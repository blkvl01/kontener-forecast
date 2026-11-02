// Rövid végigvezető szerepkörönként (dolgozó / szerkesztő / admin): első belépéskor magától indul, a ? gombbal újra elő lehet hozni.
// A kiemelt elemet minden képkockán újra megkeresi (selector alapján), így az élő újrarajzolás nem tépi le róla.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const pad = n => String(n).padStart(2, '0');
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ROLE_L = { worker: 'Dolgozó', editor: 'Szerkesztő', admin: 'Admin' };

  const IC_X = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const IC_CT = '<svg width="64" height="40" viewBox="0 0 64 40" fill="none" aria-hidden="true"><rect x="1.5" y="3.5" width="61" height="33" rx="2" stroke="currentColor" stroke-width="2"/><path d="M10 9v22M17 9v22M24 9v22M31 9v22M38 9v22M45 9v22M52 9v22" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/><path d="M1.5 3.5h9v7h-9zM53.5 3.5h9v7h-9zM1.5 29.5h9v7h-9zM53.5 29.5h9v7h-9z" fill="currentColor"/></svg>';

  // sel: egymás utáni jelöltek (az első látható számít); union: az összes látható elem közös kerete.
  // Amelyik lépés célja nem létezik vagy nem látszik (pl. telefonon), azt kihagyja.
  // sheet: a lépéshez a konténer adatlapja nyitva van (a túra nyitja meg, és a végén be is zárja).
  const INTRO = 'Rövid áttekintés: mi hol található az oldalon.';
  const YARD = { sel: ['.yard'], title: 'Heti sáv', text: 'Egy oszlop egy nap, egy blokk egy konténer. A töltöttség a haladást mutatja, a piros a késést.\nNapra kattintva alatta a konténerei jelennek meg.' };
  const SHEET = { sheet: true, place: 'left' };
  const SHEET_W = { ...SHEET, sel: ['.sheet .facts'], title: 'Adatlap', text: 'Konténerre kattintva nyílik az adatlapja (most az első).\nRendszám, T1/MRN, súly, karton, ETA és sofőr olvasható róla; a rámpa és a megjegyzés is itt adható meg.' };
  const SHEET_E = { ...SHEET, sel: ['.sheet .facts'], title: 'Adatlap', text: 'Konténerre kattintva nyílik az adatlapja (most az első).\nRendszám, T1/MRN, súly, karton és sofőr olvasható róla; az ETA, a rámpa és a megjegyzés is itt adható meg.' };
  const MAILBOX = { ...SHEET, sel: ['.sheet .mailbox'], title: 'Nyitáskérelem', text: 'Előre kitöltött levél: címzettek, tárgy (konténerszám, MRN, mai dátum) és szöveg (az adatok között a fuvarlevélszámokkal), mezőnként másolható.\nA Rendszám sorban az előre bejelentett rendszám áll: küldés előtt a valós rendszámmal össze kell vetni.\nHiányzó MRN-t vagy rendszámot sárga jelzés mutat.' };
  const MAILGO = { ...SHEET, sel: ['.sheet .mail-go'], pad: 6, title: 'Küldés', text: 'A gomb új levelet nyit az Outlook webes felületén ezekkel az adatokkal és a saját aláírással.\nA képeket és a dokumentációt a levélhez kell csatolni; a küldés az Outlookban történik.' };
  const VIEWS_W = { sel: ['.tabs', '.search'], union: true, title: 'Nézetek és keresés', text: 'Hét: heti áttekintés, Naptár: havi nézet.\nA keresés konténerszámra, MRN-re, rendszámra és PDD-re is működik.' };
  const VIEWS_E = { ...VIEWS_W, text: 'Hét: heti áttekintés, Naptár: havi nézet, Statisztika: darabszám és átfutás 7, 28 vagy 90 napra.\nA keresés konténerszámra, MRN-re, rendszámra és PDD-re is működik.' };
  const PASTE = { sel: ['.period [data-action="paste"]'], title: 'ETA beillesztése', text: 'A levélben kapott „KONTÉNER// … ETA 11:30” blokkok ide illeszthetők be, egyszerre több is.' };
  const SYNC = { sel: ['#sync'], title: 'Outlook-szinkron', text: 'Az Outlook utolsó beolvasásának ideje. A sárga vagy piros pont elakadást jelez, a nyíl kézi frissítést indít.' };
  const SETTINGS = { sel: ['#sync [data-action="settings"]'], title: 'Beállítások', text: 'Felhasználók kezelése (meghívó link, rangok: dolgozó, szerkesztő, admin) és a rámpák száma.' };
  const HELP = { sel: ['[data-action="tour"]'], title: 'Súgó', text: 'Ezzel a gombbal az útmutató bármikor újra előhívható.' };

  const TITLE = 'Üdv a Konténer Forecastban';
  const STEPS = {
    worker: [{ title: TITLE, text: INTRO }, YARD, SHEET_W, MAILBOX, MAILGO, VIEWS_W, HELP],
    editor: [{ title: TITLE, text: `${INTRO}\nA Szerkesztő rangban az ETA is módosítható.` }, YARD, SHEET_E, MAILBOX, MAILGO, VIEWS_E, PASTE, HELP],
    admin: [{ title: TITLE, text: `${INTRO}\nAz Admin rangban a felhasználók kezelése és a beállítások is elérhetők.` }, YARD, SHEET_E, MAILBOX, MAILGO, VIEWS_E, PASTE, SYNC, SETTINGS, HELP]
  };

  let T = null;

  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  function find(sels) {
    for (const s of sels) {
      const el = document.querySelector(s);
      if (el && vis(el)) return el;
    }
    return null;
  }

  function targets(step) {
    if (!step.sel) return [];
    if (step.union) return step.sel.map(s => document.querySelector(s)).filter(e => e && vis(e));
    const e = find(step.sel);
    return e ? [e] : [];
  }

  // A kiemelés téglalapja a nézetablakban (a szélekhez igazítva, hogy mindig látszódjon valami).
  function box(step) {
    const els = targets(step);
    if (!els.length) return null;
    const rs = els.map(e => e.getBoundingClientRect());
    const r = { left: Math.min(...rs.map(x => x.left)), top: Math.min(...rs.map(x => x.top)), right: Math.max(...rs.map(x => x.right)), bottom: Math.max(...rs.map(x => x.bottom)) };
    const p = step.pad == null ? 8 : step.pad;
    const vw = innerWidth, vh = innerHeight, m = 6;
    const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const l = cl(r.left - p, m, vw - m - 8), t = cl(r.top - p, m, vh - m - 8);
    const rr = cl(r.right + p, l + 8, vw - m), b = cl(r.bottom + p, t + 8, vh - m);
    return { l: Math.round(l), t: Math.round(t), w: Math.round(rr - l), h: Math.round(b - t) };
  }

  // A kártya a kiemelés alatt, felett, mellett; ha sehol nincs hely, a jobb alsó sarokban.
  function place(b, cw, ch, pref) {
    const vw = innerWidth, vh = innerHeight, g = 16, m = 12;
    if (!b) return { x: Math.round((vw - cw) / 2), y: Math.round((vh - ch) / 2), side: 'c' };
    const room = { bottom: vh - (b.t + b.h) - g - m, top: b.t - g - m, right: vw - (b.l + b.w) - g - m, left: b.l - g - m };
    const need = { bottom: ch, top: ch, right: cw, left: cw };
    const order = [pref, 'bottom', 'top', 'right', 'left'].filter((s, k, a) => s && a.indexOf(s) === k);
    const side = order.find(s => room[s] >= need[s]);
    const cx = b.l + b.w / 2 - cw / 2, cy = b.t + b.h / 2 - ch / 2;
    const clX = x => Math.max(m, Math.min(vw - cw - m, x)), clY = y => Math.max(m, Math.min(vh - ch - m, y));
    if (side === 'bottom') return { x: Math.round(clX(cx)), y: b.t + b.h + g, side };
    if (side === 'top') return { x: Math.round(clX(cx)), y: b.t - g - ch, side };
    if (side === 'right') return { x: b.l + b.w + g, y: Math.round(clY(cy)), side };
    if (side === 'left') return { x: b.l - g - cw, y: Math.round(clY(cy)), side };
    return { x: Math.max(m, vw - cw - m), y: Math.max(m, vh - ch - m), side: 'dock' };
  }

  function layout() {
    if (!T) return;
    const b = box(T.steps[T.i]);
    const p = place(b, T.card.offsetWidth, T.card.offsetHeight, T.side);
    T.side = p.side === 'bottom' || p.side === 'top' || p.side === 'right' || p.side === 'left' ? p.side : null;
    const rk = b ? `${b.l},${b.t},${b.w},${b.h}` : 'c';
    if (rk !== T.rk) {
      T.rk = rk;
      const r = T.ring.style;
      if (b) { r.width = `${b.w}px`; r.height = `${b.h}px`; r.transform = `translate(${b.l}px,${b.t}px)`; T.ring.classList.remove('off'); }
      else { r.width = '0px'; r.height = '0px'; r.transform = `translate(${Math.round(innerWidth / 2)}px,${Math.round(innerHeight / 2)}px)`; T.ring.classList.add('off'); }
    }
    const ck = `${p.x},${p.y}`;
    if (ck !== T.ck) { T.ck = ck; T.card.style.transform = `translate(${p.x}px,${p.y}px)`; }
  }

  function loop() {
    if (!T) return;
    layout();
    T.raf = requestAnimationFrame(loop);
  }

  // Ha a kiemelt elem nem látszik teljesen, a lap (vagy az adatlap) odagörög (a ragadós fejléc alá nem).
  function reveal(el) {
    const behavior = RM.matches ? 'auto' : 'smooth';
    const sh = el.closest('.sheet');
    if (sh) {
      const sr = sh.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (r.top < sr.top + 12 || r.bottom > sr.bottom - 12) sh.scrollTo({ top: sh.scrollTop + r.top - sr.top - 90, behavior });
      return;
    }
    const head = $('.top');
    const sticky = !!head && getComputedStyle(head).position === 'sticky';
    if (sticky && head.contains(el)) return;
    const r = el.getBoundingClientRect();
    const top = (sticky ? head.offsetHeight : 0) + 12;
    if (r.top >= top && r.bottom <= innerHeight - 12) return;
    window.scrollTo({ top: Math.max(0, scrollY + r.top - top - 8), behavior });
  }

  function setText(box, text) {
    box.replaceChildren(...text.split('\n').map(l => { const p = document.createElement('p'); p.textContent = l; return p; }));
  }

  // Az adatlapos lépésekhez a túra maga nyitja meg az első konténer adatlapját, és a végén be is zárja.
  function sheetFor(s) {
    if (!T.sheet) return;
    if (s.sheet && !T.sheetOpen) { T.sheetOpen = true; T.sheet.open(T.sheet.pick()); }
    else if (!s.sheet && T.sheetOpen) { T.sheetOpen = false; T.sheet.close(); }
  }

  function show(i, dir) {
    const s = T.steps[i];
    T.i = i; T.side = s.place || null; T.rk = T.ck = '';
    sheetFor(s);
    const last = i === T.steps.length - 1;
    T.card.classList.toggle('intro', i === 0);
    T.title.textContent = s.title;
    setText(T.text, s.text);
    T.n.textContent = `${pad(i + 1)} / ${pad(T.steps.length)}`;
    T.ticks.forEach((t, k) => t.classList.toggle('on', k <= i));
    T.back.textContent = i === 0 ? 'Kihagyom' : 'Vissza';
    T.back.dataset.act = i === 0 ? 'x' : 'back';
    T.next.textContent = i === 0 ? 'Kezdjük' : last ? 'Kész' : 'Tovább';
    T.body.style.setProperty('--dx', `${(dir || 0) * 12}px`);
    T.body.classList.remove('swap');
    void T.body.offsetWidth;
    if (dir) T.body.classList.add('swap');
    // A mozgás csak lépésváltáskor átmenetes; utána a követés azonnali.
    T.root.classList.add('mv');
    clearTimeout(T.mvT);
    T.mvT = setTimeout(() => T && T.root.classList.remove('mv'), 600);
    const el = targets(s)[0];
    if (el) reveal(el);
    layout();
    T.next.focus({ preventScroll: true });
  }

  function go(d) {
    const i = T.i + d;
    if (i < 0) return;
    if (i >= T.steps.length) { close(); return; }
    show(i, d);
  }

  function close() {
    if (!T) return;
    const t = T;
    T = null;
    cancelAnimationFrame(t.raf);
    clearTimeout(t.mvT);
    removeEventListener('keydown', onKey, true);
    removeEventListener('resize', onResize);
    if (t.sheetOpen) t.sheet.close();
    const app = $('#app');
    if (app) app.inert = false;
    t.root.classList.add('bye');
    setTimeout(() => t.root.remove(), RM.matches ? 0 : 220);
    if (t.opener) { const b = $('[data-action="tour"]'); if (b) b.focus({ preventScroll: true }); }
  }

  function onResize() { layout(); }

  function onKey(e) {
    if (!T) return;
    const k = e.key;
    if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (k === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); go(1); return; }
    if (k === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); go(-1); return; }
    if (k === 'Tab') {
      e.preventDefault();
      const f = [T.x, T.back, T.next];
      const at = f.indexOf(document.activeElement);
      f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus({ preventScroll: true });
    }
  }

  // o.sheet: { pick() -> konténer azonosító | null, open(id), close() } az adatlapos lépésekhez; nélküle azok kimaradnak.
  function start(role, o = {}) {
    if (T || !STEPS[role]) return false;
    const sheet = o.sheet && o.sheet.pick() ? o.sheet : null;
    const steps = STEPS[role].filter(s => (s.sheet ? !!sheet : !s.sel || targets(s).length));
    const root = document.createElement('div');
    root.className = 'tour';
    root.dataset.role = role;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Útmutató');
    root.innerHTML = `
      <i class="tour-ring off"></i>
      <div class="tour-card" tabindex="-1"><div class="tour-in">
        <div class="tour-head"><span class="tour-role"></span><span class="tour-n"></span><button type="button" class="tour-x" data-act="x" aria-label="Bezárás">${IC_X}</button></div>
        <div class="tour-body" aria-live="polite"><div class="tour-art">${IC_CT}</div><h3></h3><div class="tour-txt"></div></div>
        <div class="tour-foot"><span class="tour-ticks" aria-hidden="true">${steps.map(() => '<i></i>').join('')}</span><span class="tour-btns"><button type="button" class="tour-b ghost" data-act="back"></button><button type="button" class="tour-b is-primary" data-act="next"></button></span></div>
      </div></div>`;
    root.querySelector('.tour-role').textContent = ROLE_L[role] || role;
    T = {
      root, steps, role, sheet, sheetOpen: false, i: 0, side: null, rk: '', ck: '', raf: 0, mvT: 0, opener: !!o.opener,
      ring: root.querySelector('.tour-ring'), card: root.querySelector('.tour-card'),
      body: root.querySelector('.tour-body'), title: root.querySelector('h3'), text: root.querySelector('.tour-txt'),
      n: root.querySelector('.tour-n'), ticks: [...root.querySelectorAll('.tour-ticks i')],
      x: root.querySelector('.tour-x'), back: root.querySelector('[data-act="back"]'), next: root.querySelector('[data-act="next"]')
    };
    root.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !T) return;
      if (b.dataset.act === 'x') close();
      else if (b.dataset.act === 'back') go(-1);
      else if (b.dataset.act === 'next') go(1);
    });
    document.body.appendChild(root);
    const app = $('#app');
    if (app) app.inert = true;
    addEventListener('keydown', onKey, true);
    addEventListener('resize', onResize);
    show(0, 0);
    T.raf = requestAnimationFrame(loop);
    return true;
  }

  // ---------- első belépés ----------
  const mem = {};
  const seenKey = me => `kf-tour:${me.email}`;
  function seen(me) {
    try { return localStorage.getItem(seenKey(me)); } catch (_) { return mem[seenKey(me)]; }
  }
  function remember(me) {
    mem[seenKey(me)] = me.role;
    try { localStorage.setItem(seenKey(me), me.role); } catch (_) { /* privát mód: laponként egyszer */ }
  }

  // A nyitó animáció, az érkező elemek és az esetleges nyitott ablak után indul.
  function ready() {
    const app = $('#app');
    return !!app && !app.hidden && !$('#boot') && !app.classList.contains('boot-in') && !app.classList.contains('boot-wait')
      && !!$('#view .yard') && !document.querySelector('dialog[open]') && !$('#drawer .sheet') && !document.hidden;
  }

  // Szerepkörönként egyszer jelenik meg (más rangra váltva az új rang útmutatója újra).
  function auto(me, sheet) {
    if (!me || !STEPS[me.role] || seen(me) === me.role) return;
    const t0 = Date.now();
    (function poll() {
      if (T) return;
      if (ready()) { setTimeout(() => { if (!T && ready()) { remember(me); start(me.role, { sheet }); } else setTimeout(poll, 400); }, 600); return; }
      if (Date.now() - t0 < 60000) setTimeout(poll, 400);
    })();
  }

  window.KFTour = { start, auto, get active() { return !!T; } };
})();
