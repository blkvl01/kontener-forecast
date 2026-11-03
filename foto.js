// Telefonos fotózás QR-kóddal: bejelentkezés nélkül, csak egy konténer fotói és rendszáma.
// A képek fotózás közben, a háttérben mennek fel (egyszerre kettő); a még fel nem ment képek az IndexedDB-ben
// várnak, így térerő-kiesés vagy véletlen bezárás után sem vesznek el.
(() => {
  'use strict';

  const CFG = window.KF_CONFIG || {};
  const FN = `${CFG.url}/functions/v1/photo-link`;
  const TOKEN = (location.hash.match(/[#&]t=([0-9a-f]{32}[\w-]{22})(?![\w-])/) || [])[1] || '';
  // A gépi QR és a telefonos Fotózás gomb a konténerszámot is átadja: a nyitó jelenet rögtön azt mutatja.
  const HINT = (location.hash.match(/[#&]c=([A-Z]{4}\d{7})/) || [])[1] || '';
  const FROM_APP = /[#&]from=app\b/.test(location.hash);
  const $ = s => document.querySelector(s);
  const main = $('#main');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const pad = n => String(n).padStart(2, '0');
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const IC = {
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-9 9"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>',
    wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><path d="M12 19h.01"/><path d="M3 3l18 18"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>',
    lock: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
  };

  // ---------- nyitó jelenet ----------
  // Daru → fókusz → írisz → fotólap. Az adatok betöltése alatt a kereső „fókuszál”; az exponálás akkor jön,
  // amikor az adatok megvannak és a daru letette a konténert (legalább ~0,55 mp).
  const INTRO = document.documentElement.classList.contains('kf-intro') ? document.getElementById('intro') : null;
  function introCode(id) {
    const el = document.getElementById('in-code');
    if (!el || !id || el.dataset.id === id) return;
    el.dataset.id = id;
    let i = 0;
    const ch = t => [...t].map(x => `<span class="ch" style="--i:${i++}">${esc(x)}</span>`).join('');
    el.innerHTML = `${ch(id.slice(0, 4))} ${ch(id.slice(4, 10))}<b>${ch(id.slice(10))}</b>`;
  }
  function introEnd() {
    if (INTRO) INTRO.remove();
    document.documentElement.classList.remove('kf-intro');
  }
  async function introPlay(id) {
    if (!INTRO || !INTRO.isConnected) return;
    introCode(id);
    const wait = 520 - performance.now();
    if (wait > 0) await sleep(wait);
    if (!HINT) await sleep(240); // a most beírt konténerszám előbb kirajzolódik
    INTRO.classList.add('shoot');
    if (navigator.vibrate) setTimeout(() => navigator.vibrate(14), 170);
    await sleep(280);
    INTRO.classList.add('print');
    await sleep(560);
    introEnd();
  }
  function introAbort() {
    if (!INTRO || !INTRO.isConnected) return;
    INTRO.classList.add('abort');
    setTimeout(introEnd, 260);
  }
  if (INTRO) introCode(HINT);

  // ---------- szerver ----------
  class Gone extends Error {}
  const headers = extra => ({ apikey: CFG.key, Authorization: `Bearer ${CFG.key}`, ...extra });

  async function call(action, body = {}, keepalive = false) {
    const res = await fetch(FN, {
      method: 'POST', keepalive,
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ action, t: TOKEN, ...body })
    });
    let out = {};
    try { out = await res.json(); } catch (_) { /* üres válasz */ }
    if (res.status === 401 || res.status === 410) throw new Gone(out.error || 'Ez a QR-kód már nem érvényes.');
    if (!res.ok) throw new Error(out.error || 'A kérés nem sikerült.');
    return out;
  }

  // ---------- állapot ----------
  let INFO = null;                 // konténer, rendszám, fotók (szerver)
  let Q = [];                      // feltöltési sor: { k, blob, url, state: 'enc'|'wait'|'up'|'fail'|'bad', next, tries }
  const ID2K = {};                 // feltöltött kép szerver-azonosítója → helyi kulcs (a helyi kép marad látható)
  const LOCAL = {};                // helyi kulcs → blob URL
  const SURL = {};                 // fotó azonosító → aláírt URL és ideje
  const RECENT = new Map();        // most feltöltött, a szerver listájában talán még nem szereplő képek
  const HIDE = new Set();          // törölt (még visszavonható) kulcsok
  const PENDING = new Map();       // kulcs → törlés időzítője
  const OK_AT = {};                // kulcs → mikor ment fel (a pipa rövid ideig látszik)
  let EXPIRED = '';
  let SESSION = [];                // a kamera sávja: ebben a megnyitásban készült kulcsok

  const keyOf = p => ID2K[p.id] || `s:${p.id}`;
  const fmtC = id => `${esc(id.slice(0, 4))} ${esc(id.slice(4, 10))}<b>${esc(id.slice(10))}</b>`;
  const plateTxt = p => (p || '').replace(/\s*\/\s*/g, ' / ');

  // A kártya és a kamera közös képlistája, időrendben.
  function items() {
    const out = [];
    const seen = new Set();
    for (const p of INFO ? INFO.photos : []) {
      const k = keyOf(p);
      seen.add(k);
      out.push({ k, url: LOCAL[k] || p.url, mine: p.mine, state: OK_AT[k] && Date.now() - OK_AT[k] < 3000 ? 'ok' : '', at: p.at });
    }
    for (const [k, r] of RECENT) if (!seen.has(k)) { seen.add(k); out.push({ k, url: LOCAL[k], mine: true, state: 'ok', at: r.at }); }
    for (const it of Q) if (!seen.has(it.k)) out.push({ k: it.k, url: it.url, mine: true, state: it.state, at: it.at });
    return out.filter(x => !HIDE.has(x.k));
  }
  const waiting = () => Q.filter(q => !HIDE.has(q.k) && q.state !== 'bad');

  // ---------- megjelenítés ----------
  function gone(msg, retry) {
    main.innerHTML = `
      <div class="gone">
        <span class="ic">${IC.lock}</span>
        <h1>${retry ? 'Nincs kapcsolat' : 'A QR-kód nem érvényes'}</h1>
        <p>${esc(msg)}</p>
        ${retry ? '<button type="button" class="btn or sm" data-a="retry" style="max-width:240px">Újra</button>' : ''}
      </div>`;
  }

  function until(ts) {
    const d = new Date(ts), now = new Date();
    if (isNaN(d)) return '';
    const tm = new Date(now); tm.setDate(tm.getDate() + 1);
    const day = d.toDateString() === now.toDateString() ? 'ma' : d.toDateString() === tm.toDateString() ? 'holnap' : `${pad(d.getMonth() + 1)}.${pad(d.getDate())}.`;
    return `${day} ${pad(d.getHours())}:${pad(d.getMinutes())}-ig`;
  }
  const hm = ts => { const d = new Date(ts); return isNaN(d) ? '' : `${pad(d.getHours())}:${pad(d.getMinutes())}`; };

  function tile(x) {
    const st = x.state === 'enc' || x.state === 'up' ? '<span class="st up" aria-label="Feltöltés"></span>'
      : x.state === 'wait' || x.state === 'fail' ? '<span class="st wait" aria-label="Feltöltésre vár">!</span>'
        : x.state === 'bad' ? '<span class="st wait" aria-label="Nem tölthető fel">×</span>'
          : x.state === 'ok' ? '<span class="st ok" aria-label="Feltöltve">✓</span>' : '';
    return `<figure class="th">
        <button type="button" class="v" data-a="view" data-k="${esc(x.k)}" aria-label="Fotó megnyitása">${x.url ? `<img src="${esc(x.url)}" alt="" decoding="async">` : ''}</button>
        ${st}
        ${x.mine ? `<button type="button" class="x" data-a="del" data-k="${esc(x.k)}" aria-label="Fotó törlése">×</button>` : ''}
      </figure>`;
  }

  function banner() {
    if (EXPIRED) return `<div class="banner">${IC.lock}<span><b>${esc(EXPIRED)}</b>${waiting().length ? ` ${waiting().length} kép a telefonon maradt: olvass be új QR-kódot ennél a konténernél, és onnan felmegy.` : ''}</span></div>`;
    const stuck = Q.filter(q => !HIDE.has(q.k) && (q.state === 'fail' || (q.state === 'wait' && !navigator.onLine)));
    const bad = Q.filter(q => !HIDE.has(q.k) && q.state === 'bad');
    if (bad.length) return `<div class="banner">${IC.wifi}<span><b>${bad.length} kép nem tölthető fel.</b> ${esc(bad[0].msg || '')} Töröld, és fotózd újra.</span></div>`;
    if (stuck.length) return `<div class="banner">${IC.wifi}<span><b>Gyenge a térerő.</b> ${stuck.length} kép a telefonon vár, és magától felmegy, amint lesz jel.</span></div>`;
    return '';
  }

  function render() {
    if (!INFO) return;
    const list = items();
    const total = list.length;
    const left = waiting().length;
    const doneN = total - left;
    const chips = [
      INFO.arrived_at ? `<span class="chip live">Megérkezett ${esc(hm(INFO.arrived_at))}</span>` : '',
      INFO.ramp ? `<span class="chip">Rámpa ${esc(INFO.ramp)}</span>` : '',
      FROM_APP ? '' : `<span class="chip">QR ${esc(until(INFO.expires_at))}</span>`
    ].join('');
    const pl = plateTxt(INFO.plate);
    main.innerHTML = `
      <header class="band">
        ${FROM_APP ? `<button type="button" class="back" data-a="back">${IC.back}Vissza a konténerhez</button>` : ''}
        <span class="lbl">Konténer</span>
        <span class="cno">${fmtC(INFO.container)}</span>
        <div class="chips">${chips}</div>
      </header>
      <div class="body">
        ${banner()}
        <section class="box" aria-label="Rendszám">
          <div class="hd"><span class="lbl">Rendszám</span><button type="button" class="link" data-a="plate">${IC.pen}Módosítás</button></div>
          ${pl ? `<span class="plate"><span>${esc(pl)}</span></span>` : '<span class="plate none"><span>nincs megadva</span></span>'}
          ${INFO.plate_fixed ? '<span class="fixed">Kézzel javítva</span>' : ''}
        </section>
        <section class="box" aria-label="Fotók">
          <div class="hd"><b>Fotók${total ? ` <span class="n">· ${total}</span>` : ''}</b>${left ? `<span class="fixed">${doneN}/${total} feltöltve</span>` : ''}</div>
          ${left ? `<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${doneN}"><i style="width:${Math.round(100 * doneN / Math.max(1, total))}%"></i></div>` : ''}
          ${total ? '' : '<p class="empty" style="margin:0">Még nincs fotó ehhez a konténerhez.</p>'}
          <div class="grid">${list.map(x => tile(x)).join('')}<button type="button" class="add" data-a="cam" aria-label="Fotózás">+</button></div>
        </section>
      </div>
      <div class="cta">
        <button type="button" class="btn or" data-a="cam">${IC.cam}Fotózás</button>
        <button type="button" class="btn ln sm" data-a="lib">${IC.img}Képek a galériából</button>
        <p class="foot">A képek 12 óra után törlődnek.${INFO.by ? ` QR-kód: ${esc(INFO.by)}` : ''}</p>
      </div>`;
  }

  // A sok apró állapotváltás egy képkockában rajzolódik újra.
  let paintRaf = 0;
  function paint() {
    if (paintRaf) return;
    paintRaf = requestAnimationFrame(() => { paintRaf = 0; render(); renderCam(); });
  }

  // ---------- adat ----------
  async function load(first) {
    try {
      const out = await call('info');
      // Az aláírt URL minden lekéréskor más: a már betöltött képek a régi (még érvényes) címükön maradnak,
      // különben percenként újra letöltődne minden kép.
      out.photos.forEach(p => {
        const c = SURL[p.id];
        if (c && Date.now() - c.t < 50 * 60000) p.url = c.u;
        else if (p.url) SURL[p.id] = { u: p.url, t: Date.now() };
      });
      // A szerver listájában már szereplő friss képeket nem kell külön tartani.
      const ids = new Set(out.photos.map(p => p.id));
      for (const [k, r] of RECENT) if (ids.has(r.id) || Date.now() - r.t > 120000) RECENT.delete(k);
      INFO = out;
      if (first) await restoreQueue();
      paint();
      if (first) introPlay(out.container);
    } catch (e) {
      if (first) introAbort();
      if (e instanceof Gone) {
        if (!INFO) { gone(e.message); return; }
        EXPIRED = e.message; paint(); return;
      }
      if (first) gone('A szerver nem érhető el. Ellenőrizd az internetkapcsolatot.', true);
    }
  }

  // ---------- helyi tár (IndexedDB) ----------
  let dbP = null;
  function idb() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('nincs'));
    return (dbP ||= new Promise((res, rej) => {
      const rq = indexedDB.open('kf-foto', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('q', { keyPath: 'k' });
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    }));
  }
  async function tx(mode, fn) {
    const db = await idb();
    return new Promise((res, rej) => {
      const t = db.transaction('q', mode);
      const r = fn(t.objectStore('q'));
      t.oncomplete = () => res(r && r.result);
      t.onerror = () => rej(t.error);
    });
  }
  const idbPut = it => tx('readwrite', s => s.put({ k: it.k, container: INFO.container, blob: it.blob, at: it.at })).catch(() => {});
  const idbDel = k => tx('readwrite', s => s.delete(k)).catch(() => {});

  async function restoreQueue() {
    let rows = [];
    try { rows = await tx('readonly', s => s.getAll()) || []; } catch (_) { return; }
    rows.filter(r => r.container === INFO.container && r.blob).forEach(r => {
      if (Q.some(q => q.k === r.k)) return;
      LOCAL[r.k] = URL.createObjectURL(r.blob);
      Q.push({ k: r.k, blob: r.blob, url: LOCAL[r.k], state: 'wait', at: r.at, tries: 0 });
    });
    if (Q.length) pump();
  }

  // ---------- feltöltés ----------
  let running = 0, retryTimer = 0;
  const newKey = () => `L${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

  function enqueue(blob, k = newKey()) {
    const url = URL.createObjectURL(blob);
    LOCAL[k] = url;
    let it = Q.find(q => q.k === k);
    if (it) Object.assign(it, { blob, url, state: 'wait' });
    else Q.push(it = { k, blob, url, state: 'wait', at: new Date().toISOString(), tries: 0 });
    idbPut(it);
    pump();
    paint();
    return k;
  }

  function pump() {
    if (EXPIRED) return;
    clearTimeout(retryTimer);
    const now = Date.now();
    while (running < 2) {
      const it = Q.find(q => (q.state === 'wait' || (q.state === 'fail' && q.next <= now)) && !HIDE.has(q.k));
      if (!it) break;
      running++;
      it.state = 'up';
      upOne(it).finally(() => { running--; pump(); });
    }
    const fails = Q.filter(q => q.state === 'fail');
    if (fails.length) retryTimer = setTimeout(pump, Math.max(500, Math.min(...fails.map(q => q.next)) - now));
    paint();
  }

  async function upOne(it) {
    try {
      const res = await fetch(`${FN}?a=upload`, { method: 'POST', headers: headers({ 'Content-Type': 'image/jpeg', 'x-kf-link': TOKEN }), body: it.blob });
      let out = {};
      try { out = await res.json(); } catch (_) { /* üres válasz */ }
      if (res.status === 401 || res.status === 410) { it.state = 'wait'; EXPIRED = out.error || 'Ez a QR-kód lejárt.'; return; }
      if (res.status === 413 || res.status === 415 || res.status === 429) { it.state = 'bad'; it.msg = out.error || ''; return; }
      if (!res.ok) throw new Error(out.error || 'feltöltés');
      ID2K[out.id] = it.k;
      LOCAL[it.k] = it.url;
      OK_AT[it.k] = Date.now();
      RECENT.set(it.k, { id: out.id, at: out.at, t: Date.now() });
      if (INFO && !INFO.photos.some(p => p.id === out.id)) INFO.photos.push({ id: out.id, at: out.at, url: '', mine: true });
      Q = Q.filter(q => q !== it);
      idbDel(it.k);
      // Feltöltés közben törölték: most már a szerverről törlődik.
      if (it.cancel) commitDel(it.k);
      setTimeout(paint, 3100);
    } catch (_) {
      it.tries = (it.tries || 0) + 1;
      it.state = 'fail';
      it.next = Date.now() + Math.min(30000, 2000 * 2 ** (it.tries - 1));
    }
  }

  window.addEventListener('online', () => { Q.forEach(q => { if (q.state === 'fail') q.next = 0; }); pump(); });
  window.addEventListener('offline', paint);

  // ---------- törlés visszavonással ----------
  function del(k) {
    HIDE.add(k);
    PENDING.set(k, setTimeout(() => commitDel(k), 5000));
    toast('Fotó törölve', 'Visszavonás', () => undoDel(k));
    paint();
  }
  function undoDel(k) {
    clearTimeout(PENDING.get(k));
    PENDING.delete(k);
    HIDE.delete(k);
    pump();
    paint();
  }
  async function commitDel(k, keepalive) {
    clearTimeout(PENDING.get(k));
    PENDING.delete(k);
    const it = Q.find(q => q.k === k);
    if (it) {
      if (it.state === 'up') { it.cancel = true; return; }
      Q = Q.filter(q => q !== it);
      idbDel(k);
      HIDE.delete(k);
      paint();
      return;
    }
    const p = INFO && INFO.photos.find(x => keyOf(x) === k);
    const r = RECENT.get(k);
    const id = p ? p.id : r && r.id;
    if (id == null) { HIDE.delete(k); return; }
    try {
      await call('delete', { id }, keepalive);
      if (INFO) INFO.photos = INFO.photos.filter(x => x.id !== id);
      RECENT.delete(k);
      HIDE.delete(k);
    } catch (e) {
      HIDE.delete(k);
      toast(e instanceof Gone ? e.message : e.message || 'A törlés nem sikerült');
    }
    paint();
  }

  // ---------- értesítés ----------
  let toastEl = null, toastTimer = 0;
  function toast(msg, act, fn) {
    if (toastEl) toastEl.remove();
    clearTimeout(toastTimer);
    const t = toastEl = document.createElement('div');
    t.className = `toast${CAM.open ? ' cam' : ''}`;
    t.setAttribute('role', 'status');
    t.innerHTML = `<span>${esc(msg)}</span>${act ? `<button type="button">${esc(act)}</button>` : ''}`;
    if (act) t.querySelector('button').addEventListener('click', () => { fn(); t.remove(); });
    (CAM.open ? $('#cam') : document.body).appendChild(t);
    toastTimer = setTimeout(() => { t.remove(); if (toastEl === t) toastEl = null; }, act ? 5000 : 2600);
  }

  // ---------- kép kicsinyítése (galéria) ----------
  async function shrink(file) {
    let src;
    try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (_) {
      src = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = URL.createObjectURL(file);
      });
    }
    const w = src.width || src.naturalWidth, h = src.height || src.naturalHeight;
    const k = Math.min(1, 1920 / Math.max(w, h));
    const cv = document.createElement('canvas');
    cv.width = Math.round(w * k); cv.height = Math.round(h * k);
    cv.getContext('2d').drawImage(src, 0, 0, cv.width, cv.height);
    if (src.close) src.close();
    return new Promise((res, rej) => cv.toBlob(b => (b ? res(b) : rej(new Error('kép'))), 'image/jpeg', 0.82));
  }

  async function addFiles(files) {
    for (const f of files) {
      if (f.type && !f.type.startsWith('image/')) continue;
      try { const b = await shrink(f); SESSION.push(enqueue(b)); } catch (_) { toast('Egy kép nem olvasható'); }
    }
  }

  // ---------- kamera ----------
  // A kép az érintés pillanatában készül: a lenyomáskor az élőkép épp látható kockája kerül vászonra,
  // a JPEG-kódolás és a feltöltés a háttérben fut, így rögtön jöhet a következő kép.
  const CAM = { open: false, stream: null, ptrShot: false, lock: null };
  const camLive = () => {
    const v = CAM.stream && $('#cam video');
    return !!(v && v.videoWidth && CAM.stream.getVideoTracks().some(t => t.readyState === 'live'));
  };

  function camOpen() {
    let d = $('#cam');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'cam';
      d.setAttribute('aria-label', 'Fotózás');
      d.addEventListener('cancel', e => { e.preventDefault(); camClose(); });
      d.addEventListener('pointerdown', e => {
        if (!e.target.closest('.cam-shot')) return;
        CAM.ptrShot = false;
        if (e.button !== 0 || !camLive()) return;
        CAM.ptrShot = true;
        camShot();
      });
      document.body.appendChild(d);
    }
    d.innerHTML = `
      <div class="cam-top">
        <button type="button" class="cam-x" data-a="cam-close" aria-label="Bezárás">×</button>
        <span class="cam-id"><span class="cno">${fmtC(INFO.container)}</span><span class="p">${esc(plateTxt(INFO.plate) || 'rendszám nélkül')}</span></span>
      </div>
      <div class="cam-view">
        <video playsinline muted autoplay></video>
        <div class="cam-msg" hidden></div>
        <div class="cam-flash"></div>
      </div>
      <div class="cam-strip"></div>
      <div class="cam-bar">
        <button type="button" class="cam-lib" data-a="lib">${IC.img}<span>Galéria</span></button>
        <button type="button" class="cam-shot" data-a="shot" aria-label="Fotó készítése"><i></i></button>
        <button type="button" class="cam-done" data-a="cam-close">Kész</button>
      </div>`;
    SESSION = [];
    CAM.open = true;
    d.showModal();
    renderCam();
    camStart();
    wake(true);
  }

  async function camStart() {
    const d = $('#cam'), msg = d.querySelector('.cam-msg');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.hidden = false; msg.textContent = 'Érintsd meg a gombot a fotózáshoz'; return; }
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1440 } } });
      if (!CAM.open || CAM.stream) { st.getTracks().forEach(t => t.stop()); return; }
      CAM.stream = st;
      const v = d.querySelector('video');
      v.srcObject = st;
      v.play().catch(() => {});
      msg.hidden = true;
    } catch (err) {
      msg.hidden = false;
      msg.textContent = err && err.name === 'NotAllowedError'
        ? 'A kamera nincs engedélyezve. Engedélyezd a böngésző beállításaiban, vagy érintsd meg a gombot.'
        : 'A kamera nem érhető el. Érintsd meg a gombot a telefon kamerájához.';
    }
  }

  function camStop() {
    if (CAM.stream) CAM.stream.getTracks().forEach(t => t.stop());
    CAM.stream = null;
  }

  function camClose() {
    camStop();
    CAM.open = false;
    wake(false);
    const d = $('#cam');
    if (d && d.open) d.close();
    if (toastEl && toastEl.parentNode === d) { document.body.appendChild(toastEl); toastEl.classList.remove('cam'); }
    paint();
  }

  function camShot() {
    if (!camLive()) { $('#in-native').click(); return; }
    const d = $('#cam'), v = d.querySelector('video');
    const k = Math.min(1, 1920 / Math.max(v.videoWidth, v.videoHeight));
    const cv = document.createElement('canvas');
    cv.width = Math.round(v.videoWidth * k); cv.height = Math.round(v.videoHeight * k);
    cv.getContext('2d').drawImage(v, 0, 0, cv.width, cv.height);
    const fl = d.querySelector('.cam-flash');
    fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
    if (navigator.vibrate) navigator.vibrate(20);
    const tk = 160 / Math.max(cv.width, cv.height);
    const tc = document.createElement('canvas');
    tc.width = Math.round(cv.width * tk); tc.height = Math.round(cv.height * tk);
    tc.getContext('2d').drawImage(cv, 0, 0, tc.width, tc.height);
    const key = newKey();
    Q.push({ k: key, blob: null, url: tc.toDataURL('image/jpeg', 0.7), state: 'enc', at: new Date().toISOString(), tries: 0 });
    SESSION.push(key);
    paint();
    cv.toBlob(b => {
      if (!b) { Q = Q.filter(q => q.k !== key); toast('A kép nem sikerült'); paint(); return; }
      // Kódolás közben törölték (és a visszavonás ideje is letelt): a kép eldobható.
      if (!Q.some(q => q.k === key)) return;
      enqueue(b, key);
    }, 'image/jpeg', 0.85);
  }

  function renderCam() {
    const d = $('#cam');
    if (!d || !d.open || !INFO) return;
    const all = items();
    const mine = SESSION.map(k => all.find(x => x.k === k)).filter(Boolean);
    const s = d.querySelector('.cam-strip');
    const atEnd = s.scrollLeft + s.clientWidth >= s.scrollWidth - 8;
    s.innerHTML = mine.map(x => tile(x)).join('');
    if (atEnd) s.scrollLeft = s.scrollWidth;
    const done = d.querySelector('.cam-done');
    const left = mine.filter(x => x.state && x.state !== 'ok').length;
    done.textContent = mine.length ? (left ? `Kész · ${mine.length - left}/${mine.length}` : `Kész · ${mine.length}`) : 'Kész';
  }

  // Alkalmazásváltás után a rendszer leállíthatja a kamerát: visszatéréskor újraindul.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // A függő törlések bezárás előtt is lefutnak.
      [...PENDING.keys()].forEach(k => commitDel(k, true));
      return;
    }
    if (CAM.open) {
      if (!CAM.stream || CAM.stream.getVideoTracks().every(t => t.readyState === 'ended')) { camStop(); camStart(); }
      wake(true);
    }
    if (INFO && !EXPIRED) load();
  });

  async function wake(on) {
    try {
      if (on && 'wakeLock' in navigator && !document.hidden) CAM.lock = await navigator.wakeLock.request('screen');
      else if (!on && CAM.lock) { await CAM.lock.release(); CAM.lock = null; }
    } catch (_) { /* nem támogatott */ }
  }

  // ---------- rendszám ----------
  function plateOpen() {
    let d = $('#plate');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'plate';
      d.className = 'sheet';
      d.setAttribute('aria-labelledby', 'plate-h');
      d.addEventListener('click', e => { if (e.target === d) d.close(); });
      document.body.appendChild(d);
    }
    const [a = '', b = ''] = (INFO.plate || '').split('/').map(s => s.trim());
    const attrs = 'autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" maxlength="14"';
    d.innerHTML = `
      <form method="dialog" novalidate>
        <span class="grab" aria-hidden="true"></span>
        <h2 id="plate-h">Rendszám javítása</h2>
        <div class="two">
          <div class="fld"><label for="p1">Vontató</label><input id="p1" ${attrs} enterkeyhint="next" value="${esc(a)}"></div>
          <div class="fld"><label for="p2">Pótkocsi</label><input id="p2" ${attrs} enterkeyhint="done" value="${esc(b)}"></div>
        </div>
        <p class="err" hidden></p>
        <div class="two"><button type="button" class="btn ln sm" data-a="plate-close">Mégse</button><button type="submit" class="btn or sm">Mentés</button></div>
      </form>`;
    d.showModal();
    const p1 = d.querySelector('#p1');
    p1.focus();
    p1.setSelectionRange(p1.value.length, p1.value.length);
    p1.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); d.querySelector('#p2').focus(); } });
    d.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const norm = v => v.toUpperCase().replace(/\s+/g, ' ').trim();
      const v1 = norm(d.querySelector('#p1').value), v2 = norm(d.querySelector('#p2').value);
      const err = d.querySelector('.err');
      if (!v1) { err.hidden = false; err.textContent = 'Add meg a vontató rendszámát.'; return; }
      const btn = d.querySelector('[type="submit"]');
      btn.disabled = true;
      try {
        const out = await call('plate', { plate: v2 ? `${v1} / ${v2}` : v1 });
        INFO.plate = out.plate;
        INFO.plate_fixed = true;
        d.close();
        toast('Rendszám mentve');
        paint();
      } catch (ex) {
        if (ex instanceof Gone) { EXPIRED = ex.message; d.close(); paint(); return; }
        err.hidden = false;
        err.textContent = ex.message || 'A mentés nem sikerült. Próbáld újra.';
        btn.disabled = false;
      }
    });
  }

  // ---------- nagy nézet ----------
  function view(k) {
    const x = items().find(i => i.k === k);
    if (!x || !x.url) return;
    let d = $('#view');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'view';
      d.addEventListener('click', () => d.close());
      document.body.appendChild(d);
    }
    d.innerHTML = `<img src="${esc(x.url)}" alt="Fotó">`;
    d.showModal();
  }

  // ---------- események ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el || el.disabled) return;
    switch (el.dataset.a) {
      case 'cam': if (!EXPIRED) camOpen(); break;
      case 'cam-close': camClose(); break;
      case 'shot':
        // Érintésnél már a lenyomás exponált; a click csak billentyűzetről vagy a tartalék úton fotóz.
        if (CAM.ptrShot && e.detail) { CAM.ptrShot = false; break; }
        camShot();
        break;
      case 'lib': if (!EXPIRED) $('#in-lib').click(); break;
      case 'del': del(el.dataset.k); break;
      case 'view': view(el.dataset.k); break;
      case 'plate': if (!EXPIRED) plateOpen(); break;
      case 'plate-close': $('#plate').close(); break;
      case 'back':
        if (history.length > 1) history.back();
        else location.replace(`./#c=${INFO ? INFO.container : HINT}`);
        break;
      case 'retry': main.innerHTML = '<div class="load"><i></i><span>Betöltés…</span></div>'; load(true); break;
    }
  });

  // A fájlválasztók a lapon kívül vannak, így az újrarajzolás nem viszi el őket választás közben.
  function inputs() {
    const mk = (id, attrs) => {
      const i = document.createElement('input');
      i.type = 'file'; i.id = id; i.accept = 'image/*'; i.hidden = true;
      Object.entries(attrs).forEach(([k, v]) => i.setAttribute(k, v));
      i.addEventListener('change', () => { const f = [...i.files]; i.value = ''; addFiles(f); });
      document.body.appendChild(i);
    };
    mk('in-lib', { multiple: '' });
    mk('in-native', { capture: 'environment' });
  }

  // Percenként frissül (gépen törölt kép, javított rendszám), ha a lap látszik.
  setInterval(() => { if (!document.hidden && INFO && !EXPIRED) load(); }, 60000);

  inputs();
  if (!TOKEN || !CFG.url) introAbort();
  if (!TOKEN || !CFG.url) gone('Ez az oldal a gépen készült QR-kóddal nyitható meg. Kérd meg a kollégát, hogy nyissa meg a konténert, és mutassa a QR-kódot.');
  else load(true);
})();
