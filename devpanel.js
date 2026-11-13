// Fejlesztői menü (csak admin): kézi adatjavítás, ha az automatikák elakadnak. Minden írás a write() függvényen megy át és bekerül az admin_log-ba.
(() => {
  'use strict';
  const K = new Proxy({}, { get: (_, p) => window.KFApp[p] });
  const esc = s => K.esc(s);

  // ---------- állandók ----------
  const DAY = /^\d{4}-\d{2}-\d{2}$/, HM = /^([01]\d|2[0-3]):[0-5]\d$/, CID = /^[A-Z]{4}\d{7}$/, LTS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
  const PK = { manual: 'container', glabs_ramps: 'ramp' };
  const INT_ID = new Set(['app_settings', 'sync_status', 'glabs_status']);
  const TABS = [['cont', 'Konténerek'], ['log', 'Napló'], ['sys', 'Rendszer'], ['msg', 'Pre-alert levelek'], ['arr', 'Nyitás levelek'], ['sto', 'Betárolás']];
  const RAW_TABS = new Set(['msg', 'arr', 'sto']);
  const PERIODS = [['cur', 'Aktuális'], ['today', 'Ma'], ['all', 'Mind']];
  const ARR_ST = [['request', 'Nyitás megkérve'], ['approved', 'Nyitható'], ['opened', 'Nyitás'], ['released', 'Elengedve'], ['other', 'Egyéb']];
  const SRCS = [['jz', 'Voltoo'], ['dmt', 'DMtrans'], ['nep', 'Neptune']];
  const SRC_NAME = Object.fromEntries(SRCS);
  const TBL_L = { manual: 'Konténer', messages: 'Pre-alert', arrivals: 'Nyitás levél', storage_events: 'Betárolás', app_settings: 'Beállítás', sync_status: 'Szinkron', glabs_ramps: 'Glabs rámpa' };
  const ACT_L = { insert: 'Új', update: 'Módosítás', delete: 'Törlés', restore: 'Visszaállítás' };
  const LOG_TBLS = ['manual', 'messages', 'arrivals', 'storage_events', 'app_settings', 'sync_status', 'glabs_ramps'];
  const MAX_ROWS = 400;
  const KNOWN_C = ['id', 'date', 'src', 'fwd', 'kg', 'ctns', 'plate', 't1', 'driver', 'phone', 'pdd'];

  // ---------- állapot ----------
  const S = {
    tab: 'cont', draft: null, pend: null, auto: null, autoFor: null,
    q: { cont: '', msg: '', arr: '', sto: '', log: '' },
    sel: { log: null },
    cf: { per: 'cur', man: false }, cs: { k: 'day', d: 1 },
    af: { stage: '' }, lf: { tbl: '', key: '' },
    rows: { msg: null, arr: null, sto: null, log: null }, err: {},
    cnt: {}, logMore: false, set: null, sys: null
  };
  let dlg = null, prevFocus = null, reloadTm = 0, logTm = 0;

  // ---------- segédek ----------
  const $ = (s, r) => (r || dlg).querySelector(s);
  const p2 = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const addD = (s, n) => { const [y, m, d] = s.split('-').map(Number); return iso(new Date(y, m - 1, d + n)); };
  const clone = o => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
  const nowLocal = () => K.toLocal(new Date());
  const toInp = ts => (ts ? K.toLocal(ts).slice(0, 16) : '');
  const fromInp = v => (v ? new Date(v).toISOString() : null);
  const ovTs = v => (String(v).length === 16 ? `${v}:00` : String(v));
  const dm = ts => { const s = K.toLocal(ts); return s ? `${s.slice(5, 10)} ${s.slice(11, 16)}` : '—'; };
  const full = ts => { const s = K.toLocal(ts); return s ? `${s.slice(0, 10)} ${s.slice(11, 16)}` : '—'; };
  const ago = ts => {
    const t = ts ? new Date(ts).getTime() : NaN;
    if (isNaN(t)) return '—';
    const m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'most';
    if (m < 60) return `${m} perce`;
    const h = Math.floor(m / 60);
    return h < 48 ? `${h} órája` : `${Math.floor(h / 24)} napja`;
  };
  const nz = s => { const v = String(s ?? '').trim(); return v || null; };
  const upper = s => String(s || '').toUpperCase();
  const getP = (path, root = S) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), root);
  const setP = (path, val) => {
    const ks = path.split('.'); const last = ks.pop();
    const o = ks.reduce((a, k) => (a == null ? a : a[k]), S);
    if (o) o[last] = val;
  };
  const jstr = v => JSON.stringify(v, null, 2);
  const ICON_X = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ICON_RESET = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';
  const ICON_BACK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';

  function say(msg, bad) {
    if (!dlg || !dlg.open) { K.toast(msg); return false; }
    const box = $('#dv-toasts');
    const t = document.createElement('div');
    t.className = `dv-toast${bad ? ' bad' : ''}`;
    t.setAttribute('role', bad ? 'alert' : 'status');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), bad ? 4200 : 2200);
    setTimeout(() => t.remove(), bad ? 4500 : 2500);
    return false;
  }
  const bad = msg => say(msg, true);

  // ---------- adatbázis ----------
  async function fetchAll(tbl, order, asc, max) {
    const out = [];
    for (let from = 0; from < max; from += 1000) {
      const { data, error } = await K.sb.from(tbl).select('*').order(order, { ascending: asc }).range(from, from + 999);
      if (error) throw error;
      out.push(...data);
      if (data.length < 1000) break;
    }
    return out;
  }
  const pkVal = (tbl, key) => (INT_ID.has(tbl) ? Number(key) : key);
  async function getRow(tbl, key) {
    const { data, error } = await K.sb.from(tbl).select('*').eq(PK[tbl] || 'id', pkVal(tbl, key)).maybeSingle();
    if (error) throw error;
    return data || null;
  }
  async function count(tbl) {
    const { count: n } = await K.sb.from(tbl).select('*', { count: 'exact', head: true });
    return n;
  }
  function reloadSoon() { clearTimeout(reloadTm); reloadTm = setTimeout(() => K.reload(), 300); }

  // Minden írás ezen megy át: DB művelet, visszajelzés, admin_log, főoldal frissítése.
  async function write(tbl, key, action, before, after, opt = {}) {
    const pk = PK[tbl] || 'id', kv = pkVal(tbl, key);
    let row = null, error = null;
    try {
      const t = K.sb.from(tbl);
      if (after === null) ({ error } = await t.delete().eq(pk, kv));
      else if (tbl === 'manual' || action === 'restore') ({ data: row, error } = await t.upsert(after, { onConflict: pk }).select().single());
      else if (!before || action === 'insert') ({ data: row, error } = await t.insert(after).select().single());
      else ({ data: row, error } = await t.update(after).eq(pk, kv).select().single());
    } catch (e) { error = e; }
    if (error) { console.error(error); say(`Nem sikerült: ${error.message || 'hiba'}`, true); return { ok: false }; }
    if (!opt.quiet) say(opt.msg || (after === null ? 'Törölve' : action === 'restore' ? 'Visszaállítva' : 'Mentve'));
    try {
      const { error: le } = await K.sb.from('admin_log').insert({
        at: new Date().toISOString(), by: K.me().email, tbl, key: String(key), action: opt.log || action, before: before || null, after: row || null
      });
      if (le) console.warn('admin_log', le);
    } catch (e) { console.warn('admin_log', e); }
    if (tbl === 'manual') { if (after === null) K.dropMan(key); else K.setMan(row); } else if (!opt.quiet) reloadSoon();
    if (S.cnt.admin_log != null) S.cnt.admin_log++;
    return { ok: true, row };
  }

  // ---------- a levezetett adatok ----------
  const C = () => (K.data() ? K.data().containers : {});
  // Ugyanaz a levezetés a kézi felülírások nélkül: ebből látszik az „automatikus” érték.
  function autoMap() {
    const d = K.data();
    if (S.autoFor === d && S.auto) return S.auto;
    const r = K.raw(), man = {};
    for (const [id, m] of Object.entries(r.MAN || {})) man[id] = m && m.override ? { ...m, override: null } : m;
    try { S.auto = window.KFDerive(r.MSGS, man, r.ARR, r.STO).containers; } catch (e) { console.warn(e); S.auto = {}; }
    S.autoFor = d;
    return S.auto;
  }
  function pill(c) {
    if (c.state === 'removed') return '<span class="dv-pill rm">Levéve</span>';
    const p = K.phase(c);
    return `<span class="dv-pill ${p.grp}">${esc(p.label)}</span>`;
  }

  // ---------- kis HTML-építők ----------
  // Gombcsoportot nem tehetünk <label>-be: a feliratra kattintás az első gombot nyomná meg.
  const fld = (l, c, cls = '') => (c.includes('dv-seg') ? `<div class="dv-f ${cls}"><span>${l}</span>${c}</div>` : `<label class="dv-f ${cls}"><span>${l}</span>${c}</label>`);
  const txt = (p, v, o = '') => `<input class="dv-in" data-p="${p}" value="${esc(v)}" ${o}>`;
  // Néhány rögzített érték közül választó gombsor (natív legördülő helyett).
  const sel = (p, opts, v, o = '') => `<div class="dv-seg" role="radiogroup" ${o}>${opts.map(([k, l]) => { const on = String(k) === String(v ?? ''); return `<button type="button" role="radio" class="${on ? 'on' : ''}" aria-checked="${on}" data-dv="setp" data-p="${p}" data-v="${esc(k)}">${esc(l)}</button>`; }).join('')}</div>`;
  const seg = (act, key, opts, cur) => `<div class="dv-seg" role="group">${opts.map(([v, l]) => `<button type="button" class="${v === cur ? 'on' : ''}" aria-pressed="${v === cur}" data-dv="${act}" data-k="${key}" data-v="${v}">${l}</button>`).join('')}</div>`;
  const sec = (title, body, aside = '') => `<section class="dv-sec"><h3><span>${title}</span>${aside}</h3>${body}</section>`;
  const askBtn = (label, run, arg, o = {}) => `<button type="button" class="${o.cls || 'dv-danger'}" data-dv="ask" data-run="${run}" data-arg="${esc(arg == null ? '' : arg)}" data-msg="${esc(o.msg || 'Biztosan törlöd?')}" data-yes="${esc(o.yes || 'Törlés')}">${label}</button>`;
  const rmBtn = (path, i) => `<button type="button" class="dv-ib" data-dv="rrm" data-path="${path}" data-i="${i}" aria-label="Sor törlése" title="Sor törlése">${ICON_X}</button>`;
  const empty = t => `<div class="dv-empty">${t}</div>`;

  function table(cols, rows, o = {}) {
    const th = cols.map(c => {
      const so = c.k && o.sort, on = so && o.sort.k === c.k;
      return `<th class="${c.c || ''}"${so ? ` data-dv="sort" data-k="${c.k}" tabindex="0" aria-sort="${on ? (o.sort.d > 0 ? 'ascending' : 'descending') : 'none'}"` : ''}>${c.h}${on ? `<i class="dv-ar">${o.sort.d > 0 ? '↑' : '↓'}</i>` : ''}</th>`;
    }).join('');
    const tb = rows.map(r => `<tr class="${r.id === o.sel ? 'sel' : ''}${r.cls ? ` ${r.cls}` : ''}" data-dv="pick" data-id="${esc(r.id)}" tabindex="0">${r.tds.map((t, i) => `<td class="${cols[i].c || ''}">${t}</td>`).join('')}</tr>`).join('');
    return `<table class="dv-t"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`;
  }
  const moreNote = (n, total) => (total > n ? `<div class="dv-more">+${total - n} sor nem látszik</div>` : '');

  // ---------- vázlat (draft) és piszkos állapot ----------
  const snap = d => JSON.stringify([d.f, d.ov, d.cols, d.prio, d.jm ? [d.jc, d.je] : 0]);
  const isDirty = () => !!S.draft && snap(S.draft) !== S.draft.snap;
  function setSnap(d) { d.snap = snap(d); return d; }
  function updateDirty() {
    if (!dlg) return;
    const x = isDirty();
    const sv = $('#dv-save'); if (sv) sv.disabled = !x;
    const dd = $('#dv-dirty'); if (dd) dd.hidden = !x;
    const di = $('#dv-discard'); if (di) di.disabled = !x;
    const ft = $('.dv-edf'); if (ft) ft.classList.toggle('idle', !x && !!S.draft && S.draft.kind === 'cont');
    const t = dlg.querySelector('.dv-tab.dirty'); if (t) t.classList.remove('dirty');
    if (x && S.draft) { const b = $(`#dv-t-${S.draft.tab}`); if (b) b.classList.add('dirty'); }
  }
  function go(fn) {
    if (isDirty()) { S.pend = fn; showGuard(); } else fn();
  }
  function showGuard() {
    const g = $('#dv-guard');
    g.hidden = false;
    g.innerHTML = '<span class="dv-gt">Nem mentett változás.</span><button type="button" class="btn-primary sm" data-dv="gsave">Mentés</button><button type="button" class="btn-ghost sm" data-dv="gdisc">Elvetés</button><button type="button" class="btn-ghost sm" data-dv="gcancel">Mégse</button>';
    g.querySelector('button').focus();
  }
  function hideGuard() { const g = $('#dv-guard'); g.hidden = true; g.innerHTML = ''; S.pend = null; }

  // ---------- váz ----------
  function build() {
    if (dlg) return;
    dlg = document.createElement('dialog');
    dlg.id = 'dev'; dlg.className = 'dev';
    dlg.setAttribute('aria-label', 'Fejlesztői menü');
    dlg.innerHTML = `<header class="dv-top"><h2>Fejlesztői menü</h2><span class="dv-badge" id="dv-who"></span><span class="dv-sp"></span>
      <button type="button" class="dv-tbtn" data-dv="refresh">Frissítés</button>
      <button type="button" class="dv-x" data-dv="close" aria-label="Bezárás">${ICON_X}</button></header>
      <div class="dv-guard" id="dv-guard" role="alert" hidden></div>
      <div class="dv-body"><nav class="dv-nav" role="tablist" aria-orientation="vertical" aria-label="Fejlesztői menü fülek"></nav><section class="dv-main" id="dv-main" role="tabpanel"></section></div>
      <div class="dv-toasts" id="dv-toasts" aria-live="polite"></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click', onClick);
    dlg.addEventListener('input', onInput);
    dlg.addEventListener('keydown', onKey);
    dlg.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('[data-dv-more]') && S.draft) S.draft.more = e.target.open; }, true);
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    // A főoldal adatai (realtime, más gépek mentései) frissítik a konténerlistát, ha nincs nem mentett szerkesztés.
    document.addEventListener('kf:data', () => {
      if (!dlg.open || S.tab !== 'cont' || isDirty() || saving || dlg.querySelector('.dv-confirm')) return;
      const a = document.activeElement;
      if (a && dlg.contains(a) && a.closest('.dv-ed') && /^(INPUT|TEXTAREA)$/.test(a.tagName)) return;
      const d = S.draft;
      if (d && d.kind === 'cont') S.draft = C()[d.id] ? mkCont(d.id) : null;
      renderList(); if (!d || d.kind === 'cont') renderEditor(); renderNav();
    });
    dlg.addEventListener('close', () => { if (prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (_) { /* nincs teendő */ } } });
  }

  function open(tab, id) {
    const me = K.me();
    if (!me || me.role !== 'admin') return;
    build();
    if (!dlg.open) {
      prevFocus = document.activeElement;
      dlg.showModal();
    }
    $('#dv-who').textContent = me.email;
    const t = tab && TABS.some(x => x[0] === tab) ? tab : S.tab;
    go(() => { S.tab = t; renderNav(); renderMain(); counts(); if (id) jump(t, id); });
  }
  function close() {
    if (!dlg || !dlg.open) return;
    go(() => { hideGuard(); S.draft = null; dlg.close(); });
  }

  function renderNav() {
    const nav = $('.dv-nav');
    nav.innerHTML = TABS.map(([k, l]) => {
      const err = k === 'sys' && S.sys && S.sys.sync && S.sys.sync.error;
      const head = k === 'msg' ? '<div class="dv-ng" role="presentation">Nyers adatok</div>' : '';
      return `${head}<button type="button" role="tab" id="dv-t-${k}" aria-selected="${S.tab === k}" tabindex="${S.tab === k ? 0 : -1}" class="dv-tab${RAW_TABS.has(k) ? ' raw' : ''}${S.tab === k ? ' on' : ''}${S.draft && S.draft.tab === k && isDirty() ? ' dirty' : ''}" data-dv="tab" data-k="${k}"><span class="dv-tl">${l}</span>${err ? '<em class="dv-cn err" aria-label="hiba">!</em>' : ''}<i class="dv-dot" aria-hidden="true"></i></button>`;
    }).join('');
  }
  async function counts() {
    try {
      const r = await Promise.all(['messages', 'arrivals', 'storage_events', 'admin_log'].map(count));
      S.cnt = { messages: r[0], arrivals: r[1], storage_events: r[2], admin_log: r[3] };
      if (dlg && dlg.open) renderNav();
    } catch (e) { console.warn(e); }
  }

  function setTab(k) {
    go(() => { hideGuard(); S.draft = null; S.sel.log = null; S.tab = k; renderNav(); renderMain(); });
  }

  function renderMain() {
    const m = $('#dv-main'), t = S.tab;
    m.setAttribute('aria-labelledby', `dv-t-${t}`);
    if (t === 'sys') { m.innerHTML = '<div class="dv-page"><div id="dv-sys"></div><h2 class="dv-ph">Beállítások</h2><div id="dv-set"></div></div>'; renderSys(); renderSet(); loadSys(); loadSet(); return; }
    m.innerHTML = `<div class="dv-split"><div class="dv-lp"><div class="dv-tb">${toolbar(t)}</div><div class="dv-lw" id="dv-list"></div></div><aside class="dv-ed" id="dv-ed" aria-label="Szerkesztő"></aside></div>`;
    renderList(); renderEditor();
    if (t !== 'cont') load(t).then(() => { if (S.tab === t) renderList(); });
  }

  async function load(tab, force) {
    if (tab === 'cont' || tab === 'sys') return;
    if (!force && S.rows[tab]) return;
    S.err[tab] = '';
    try {
      if (tab === 'msg') S.rows.msg = await fetchAll('messages', 'received', false, 2000);
      else if (tab === 'arr') S.rows.arr = await fetchAll('arrivals', 'received', false, 3000);
      else if (tab === 'sto') S.rows.sto = await fetchAll('storage_events', 'stored_at', false, 5000);
      else if (tab === 'log') { S.rows.log = []; await moreLog(); }
    } catch (e) { console.error(e); S.err[tab] = `Betöltési hiba: ${e.message || e}`; S.rows[tab] = S.rows[tab] || null; }
  }
  async function moreLog() {
    let q = K.sb.from('admin_log').select('*').order('at', { ascending: false }).order('id', { ascending: false });
    if (S.lf.tbl) q = q.eq('tbl', S.lf.tbl);
    if (S.lf.key.trim()) q = q.ilike('key', `%${S.lf.key.trim().replace(/[%_]/g, m => `\\${m}`)}%`);
    const n = S.rows.log.length;
    const { data, error } = await q.range(n, n + 99);
    if (error) throw error;
    S.rows.log.push(...data);
    S.logMore = data.length === 100;
  }

  // ---------- eszköztárak ----------
  function toolbar(t) {
    const q = (ph) => `<input type="search" class="dv-in dv-q" placeholder="${ph}" data-p="q.${t}" data-after="list" value="${esc(S.q[t])}" aria-label="Keresés">`;
    const cnt = '<span class="dv-count" id="dv-cnt"></span>';
    if (t === 'cont') {
      return `<div class="dv-tr2">${q('Konténerszám, PDD, MRN vagy rendszám')}<button type="button" class="btn-primary sm" data-dv="newcont">Új konténer</button></div>
        <div class="dv-tr2"><div class="dv-seg" role="radiogroup" aria-label="Időszak">${PERIODS.map(([k, l]) => `<button type="button" role="radio" class="${S.cf.per === k ? 'on' : ''}" aria-checked="${S.cf.per === k}" data-dv="per" data-k="${k}">${l}</button>`).join('')}</div>
        <button type="button" class="dv-chip${S.cf.man ? ' on' : ''}" aria-pressed="${S.cf.man}" data-dv="manonly">Kézzel állított</button><span class="dv-sp"></span>${cnt}</div>`;
    }
    if (t === 'msg') return `${q('Keresés: tárgy, konténer')}<div class="dv-tr2">${cnt}<span class="dv-sp"></span><button type="button" class="btn-primary sm" data-dv="newmsg">Új levél</button></div>`;
    if (t === 'arr') {
      return `${q('Keresés: tárgy, feladó, konténer, MRN')}<div class="dv-chips" role="group">${[['', 'Mind'], ...ARR_ST].map(([k, l]) => `<button type="button" class="dv-chip${S.af.stage === k ? ' on' : ''}" aria-pressed="${S.af.stage === k}" data-dv="stagechip" data-k="${k}">${l}</button>`).join('')}</div>
        <div class="dv-tr2">${cnt}<span class="dv-sp"></span><button type="button" class="btn-primary sm" data-dv="newarr">Új nyitás levél</button></div>`;
    }
    if (t === 'sto') return `${q('Keresés: AWB, konténer')}<div class="dv-tr2">${cnt}<span class="dv-sp"></span><button type="button" class="btn-ghost sm" data-dv="newbulk">Tömeges felvitel</button><button type="button" class="btn-primary sm" data-dv="newsto">Új betárolás</button></div>`;
    // log
    return `<input type="search" class="dv-in dv-q" placeholder="Keresés: konténer, levél vagy sor azonosítója" data-p="lf.key" data-after="log" value="${esc(S.lf.key)}" aria-label="Keresés">
      <div class="dv-chips" role="group" aria-label="Szűrés hely szerint">${[['', 'Mind'], ...LOG_TBLS.map(x => [x, TBL_L[x]])].map(([k, l]) => `<button type="button" class="dv-chip${S.lf.tbl === k ? ' on' : ''}" aria-pressed="${S.lf.tbl === k}" data-dv="logchip" data-k="${k}">${l}</button>`).join('')}</div>
      <div class="dv-tr2">${cnt}</div>`;
  }

  // ---------- listák ----------
  function renderList() {
    const el = $('#dv-list'); if (!el) return;
    const t = S.tab;
    if (t !== 'cont' && !S.rows[t]) { el.innerHTML = empty(S.err[t] ? esc(S.err[t]) : 'Betöltés…'); setCount(''); return; }
    const r = LIST[t]();
    el.innerHTML = r.html + moreNote(r.n, r.total);
    setCount(`${r.total} sor`);
  }
  function setCount(s) { const c = $('#dv-cnt'); if (c) c.textContent = s; }
  const curId = () => (S.tab === 'log' ? S.sel.log : S.draft && S.draft.tab === S.tab ? S.draft.id : null);
  const hit = (q, ...vals) => { q = q.trim().toLowerCase(); return !q || vals.some(v => String(v == null ? '' : v).toLowerCase().includes(q)); };

  const SORTERS = {
    id: c => c.id, day: c => c.day || '', fwd: c => c.fwd || c.src || '', ph: c => (c.state === 'removed' ? -1 : K.phase(c).p),
    eta: c => (c.eta_time ? `${c.eta_date} ${c.eta_time}` : ''), arr: c => c.arrived_at || '', ramp: c => c.ramp || 0,
    sto: c => (c.storage && c.storage.total ? c.storage.done / c.storage.total : -1)
  };

  const LIST = {
    cont() {
      const q = S.q.cont.trim().toLowerCase().replace(/\s/g, ''), rng = perRange();
      let arr = Object.values(C()).filter(c => {
        if (S.cf.man && !c.ov) return false;
        if (rng && ((c.day || '') < rng[0] || (c.day || '') > rng[1])) return false;
        if (!q) return true;
        return [c.id, c.t1, c.plate, ...(c.pdd || []).map(p => p.no)].some(v => String(v || '').toLowerCase().replace(/\s/g, '').includes(q));
      });
      const f = SORTERS[S.cs.k] || SORTERS.day, d = S.cs.d;
      arr.sort((a, b) => { const x = f(a), y = f(b); return (x < y ? -1 : x > y ? 1 : a.id < b.id ? -1 : 1) * d; });
      const total = arr.length; arr = arr.slice(0, MAX_ROWS);
      const cols = [{ h: 'Konténer', k: 'id' }, { h: 'Nap', k: 'day' }, { h: 'Státusz', k: 'ph' }, { h: 'ETA', k: 'eta' }, { h: 'Megérkezett', k: 'arr' }];
      const rows = arr.map(c => ({
        id: c.id, cls: c.state === 'removed' ? 'rm' : '',
        tds: [
          `<span class="mono dv-cid">${esc(c.id)}</span>${c.ov ? '<span class="dv-tag">KÉZI</span>' : ''}<small class="dv-sub">${esc(c.fwd || SRC_NAME[c.src] || '')}</small>`,
          `<span class="mono">${esc((c.day || '').slice(5) || '—')}</span>`,
          pill(c),
          c.eta_time ? `<span class="mono">${esc(c.eta_time)}</span>` : '<span class="dv-faint">—</span>',
          c.arrived_at ? `<span class="mono">${esc(c.arrived_at.slice(11, 16))}</span>` : '<span class="dv-faint">—</span>'
        ]
      }));
      return { html: table(cols, rows, { sort: S.cs, sel: curId() }), n: arr.length, total };
    },
    msg() {
      let arr = S.rows.msg.filter(m => hit(S.q.msg, m.subject, JSON.stringify((m.containers || []).map(c => c && c.id))));
      const total = arr.length; arr = arr.slice(0, MAX_ROWS);
      const cols = [{ h: 'Érkezett' }, { h: 'Tárgy', c: 'grow' }, { h: 'Napok' }, { h: 'Kont.', c: 'num' }, { h: 'Típus' }, { h: 'Forrás' }];
      const rows = arr.map(m => ({
        id: m.id, tds: [`<span class="mono">${esc(dm(m.received))}</span>`, `<span class="dv-ell">${esc(m.subject || '(nincs tárgy)')}</span>`, esc((m.dates || []).map(d => d.slice(5)).join(', ')),
          (m.containers || []).length, esc(m.kind || ''), esc(upper(((m.containers || []).find(c => c && c.src) || {}).src)) || '—']
      }));
      return { html: table(cols, rows, { sel: curId() }), n: arr.length, total };
    },
    arr() {
      let arr = S.rows.arr.filter(a => (!S.af.stage || (a.stage || 'request') === S.af.stage)
        && hit(S.q.arr, a.subject, a.sender, (a.containers || []).join(' '), (a.mrns || []).join(' ')));
      const total = arr.length; arr = arr.slice(0, MAX_ROWS);
      const cols = [{ h: 'Érkezett' }, { h: 'Szakasz' }, { h: 'Feladó' }, { h: 'Konténerek' }, { h: 'MRN' }, { h: 'Tárgy', c: 'grow' }];
      const rows = arr.map(a => ({
        id: a.id, tds: [`<span class="mono">${esc(dm(a.received))}</span>`, stagePill(a.stage), `<span class="dv-ell">${esc(a.sender || '—')}</span>`,
          (a.containers || []).length ? `<span class="mono">${esc(a.containers.slice(0, 2).join(', '))}${a.containers.length > 2 ? ` +${a.containers.length - 2}` : ''}</span>` : '—',
          `<span class="mono dv-ell">${esc((a.mrns || []).join(', ')) || '—'}</span>`, `<span class="dv-ell">${esc(a.subject || '')}</span>`]
      }));
      return { html: table(cols, rows, { sel: curId() }), n: arr.length, total };
    },
    sto() {
      const pm = pddMap();
      let arr = S.rows.sto.filter(s => hit(S.q.sto, s.awb, (pm[upper(s.awb)] || {}).id));
      const total = arr.length; arr = arr.slice(0, MAX_ROWS);
      const cols = [{ h: 'Betárolva' }, { h: 'AWB / PDD', c: 'mono' }, { h: 'Colli', c: 'num' }, { h: 'Kg', c: 'num' }, { h: 'Konténer' }];
      const rows = arr.map(s => {
        const c = pm[upper(s.awb)];
        return { id: s.id, tds: [`<span class="mono">${esc(dm(s.stored_at))}</span>`, esc(s.awb), s.ctns ?? '—', s.kg ?? '—', c ? `<button type="button" class="dv-lnk mono" data-dv="go" data-tab="cont" data-id="${esc(c.id)}">${esc(c.id)}</button>` : '<span class="dv-faint">nincs</span>'] };
      });
      return { html: table(cols, rows, { sel: curId() }), n: arr.length, total };
    },
    log() {
      const arr = S.rows.log || [];
      const cols = [{ h: 'Idő' }, { h: 'Ki', c: 'grow' }, { h: 'Hol' }, { h: 'Azonosító', c: 'mono' }, { h: 'Művelet' }];
      const rows = arr.map(l => ({ id: String(l.id), tds: [`<span class="mono">${esc(dm(l.at))}</span>`, `<span class="dv-ell">${esc(l.by || '')}</span>`, esc(TBL_L[l.tbl] || l.tbl), esc(l.key), `<span class="dv-pill ac-${esc(l.action)}">${esc(ACT_L[l.action] || l.action)}</span>`] }));
      const more = S.logMore ? '<div class="dv-morebar"><button type="button" class="btn-ghost sm" data-dv="logmore">Több</button></div>' : '';
      return { html: table(cols, rows, { sel: curId() }) + more, n: arr.length, total: arr.length };
    }
  };
  // Az időszakválasztó tartománya a konténer napjára (c.day).
  function perRange() {
    const t = K.today();
    return S.cf.per === 'today' ? [t, t] : S.cf.per === 'cur' ? [addD(t, -7), addD(t, 14)] : null;
  }
  function stagePill(s) {
    const st = s || 'request', l = (ARR_ST.find(x => x[0] === st) || [0, st])[1];
    return `<span class="dv-pill st-${esc(st)}">${esc(l)}</span>`;
  }
  function pddMap() {
    const m = {};
    Object.values(C()).forEach(c => (c.pdd || []).forEach(p => { if (p.no) m[upper(p.no)] = c; }));
    return m;
  }

  // ---------- szerkesztő keret ----------
  function renderEditor() {
    const ed = $('#dv-ed'); if (!ed) return;
    const old = ed.querySelector('.dv-edb'), st = old ? old.scrollTop : 0;
    const d = S.draft;
    let html = '', open = false;
    if (S.tab === 'log') { open = !!S.sel.log; html = open ? logEd() : empty('Nincs kijelölt naplósor'); }
    else if (d && d.tab === S.tab) { open = true; html = ED[d.kind](d); }
    else html = empty('Nincs kijelölt sor');
    ed.innerHTML = html;
    const sp = $('.dv-split'); if (sp) sp.classList.toggle('has-ed', open);
    const nb = ed.querySelector('.dv-edb'); if (nb) nb.scrollTop = st;
    updateDirty();
  }
  function edFrame(title, sub, body, foot) {
    return `<div class="dv-edh"><button type="button" class="dv-ib dv-back" data-dv="back" aria-label="Vissza a listához">${ICON_BACK}</button><div class="dv-edt">${title}</div>${sub || ''}</div>
      <div class="dv-edb">${body}</div><div class="dv-edf">${foot}</div>`;
  }
  const FOOT = (extra = '') => `<span class="dv-dirty" id="dv-dirty" hidden>Nem mentett változás</span><span class="dv-sp"></span>${extra}<button type="button" class="btn-ghost sm" id="dv-discard" data-dv="discard" disabled>Elvetés</button><button type="button" class="btn-primary sm" id="dv-save" data-dv="save" disabled>Mentés</button>`;

  // ====================== 1. KONTÉNEREK ======================
  function mkCont(id) {
    const c = C()[id]; if (!c) return null;
    const man = K.raw().MAN[id] || {};
    const d = {
      tab: 'cont', kind: 'cont', id, ov: clone(c.ov) || {}, ov0: clone(c.ov) || {},
      cols: { plate: man.plate || '', t1: man.t1 || '', driver: man.driver || '', phone: man.phone || '', site: man.site || '', ramp: man.ramp ? String(man.ramp) : '', note: man.note || '' },
      prio: (K.raw().PRIO || []).includes(id)
    };
    d.cols0 = { ...d.cols };
    return setSnap(d);
  }
  const msGet = (d, k) => (k === 'arrived' ? d.ov.arrived : (d.ov.stages || {})[k]);
  function msSet(d, k, v) {
    if (k === 'arrived') { if (v === undefined) delete d.ov.arrived; else d.ov.arrived = v; return; }
    d.ov.stages = d.ov.stages || {};
    if (v === undefined) delete d.ov.stages[k]; else d.ov.stages[k] = v;
    if (!Object.keys(d.ov.stages).length) delete d.ov.stages;
  }
  function autoMs(A, k) {
    if (!A) return null;
    if (k === 'arrived') return A.arrived ? { at: A.arrived_at, who: (A.auto_arrival && A.auto_arrival.sender) || '' } : null;
    const s = A.stages && A.stages[k];
    if (s) return { at: s.at, who: s.sender || '' };
    if (k === 'opened' && A.opened_implied) return { at: A.opened_implied, who: 'feltételezett' };
    return null;
  }

  // Státusz lépcső: a lépésre kattintva a konténer oda kerül; a korábbi lépések kitöltődnek, a későbbiek kikapcsolnak.
  const STEPS = [['arrived', 'Megérkezett'], ['approved', 'Nyitható'], ['opened', 'Nyitás'], ['released', 'Elengedve'], ['stored', 'Betárolva']];
  const LINEAR = ['arrived', 'approved', 'opened'];
  // Egy lépés a vázlat szerint: { done, at, src } (src: a levél feladója, „kézi” vagy üres).
  function stepOf(d, A, k) {
    const v = msGet(d, k);
    if (v === false) return { done: false, at: '', src: '' };
    if (typeof v === 'string' && v) return { done: true, at: v, src: 'kézi' };
    const au = autoMs(A, k);
    return au ? { done: true, at: au.at, src: au.who || '' } : { done: false, at: '', src: '' };
  }
  function curStep(d, A) {
    const s = k => stepOf(d, A, k).done;
    if (s('stored')) return 'stored';
    if (s('released')) return 'released';
    for (let i = LINEAR.length - 1; i >= 0; i--) if (s(LINEAR[i])) return LINEAR[i];
    return 'plan';
  }
  function setStep(d, A, target) {
    // Bekapcsoláskor a levélből ismert időpont az elsődleges, csak ennek híján kerül be a mostani.
    const on = k => { if (stepOf(d, A, k).done) return; msSet(d, k, autoMs(A, k) ? undefined : nowLocal()); };
    const off = k => { if (autoMs(A, k)) msSet(d, k, false); else msSet(d, k, undefined); };
    const i = LINEAR.indexOf(target);
    LINEAR.forEach((k, j) => ((target === 'released' || target === 'stored' || (i >= 0 && j <= i)) ? on(k) : off(k)));
    if (target === 'stored') on('stored');
    else if (target === 'released') { on('released'); off('stored'); }
    else { off('released'); off('stored'); }
  }
  const hasStepOv = ov => ov.arrived !== undefined || (ov.stages && Object.keys(ov.stages).length);

  function ED_cont(d) {
    const c = C()[d.id], A = autoMap()[d.id], ov = d.ov, man = K.raw().MAN[d.id] || {};
    if (!c) return edFrame(esc(d.id), '', empty('Ez a konténer már nem létezik'), '');
    const a = k => (A ? A[k] : '');
    const resetBtn = (k, label) => `<button type="button" class="dv-rs" data-dv="reset" data-k="${k}" title="Vissza a levél szerintire" aria-label="${label}: vissza a levél szerintire">${ICON_RESET}</button>`;

    // --- Státusz
    const cur = curStep(d, A);
    const row = (k, label, s) => `<li class="dv-sr${s.done ? ' done' : ''}${cur === k ? ' cur' : ''}">
      <button type="button" class="dv-sb" role="radio" aria-checked="${cur === k}" data-dv="setstep" data-k="${k}"><i class="dv-pt" aria-hidden="true"></i><span>${label}</span></button>
      ${s.done && k !== 'plan' ? `<input type="datetime-local" step="60" class="dv-in" data-ms="${k}" aria-label="${label} ideje" value="${esc(toInp(s.at))}"><span class="dv-src">${esc(s.src)}</span>` : ''}</li>`;
    const steps = `<ol class="dv-steps" role="radiogroup" aria-label="Hol tart a konténer">${row('plan', 'Tervben', { done: true })}${STEPS.map(([k, l]) => row(k, l, stepOf(d, A, k))).join('')}</ol>`;
    const status = sec('Státusz', steps, hasStepOv(ov) ? '<button type="button" class="dv-lnk" data-dv="stepauto">Levelek szerint</button>' : '');

    // --- Időpontok
    const etaOv = ov.eta, etaD = etaOv && typeof etaOv === 'object' ? etaOv : etaOv === false ? { date: '', time: '' } : { date: c.eta_date || '', time: c.eta_time || '' };
    const removed = ov.state ? ov.state === 'removed' : (A ? A.state === 'removed' : c.state === 'removed');
    const times = sec('Időpontok', `
      <div class="dv-fr2"><span class="dv-fl">Nap</span><input type="date" class="dv-in" data-ov="date" value="${esc(ov.date ?? c.date)}">${'date' in ov ? resetBtn('date', 'Nap') : ''}</div>
      ${'date' in ov && a('date') ? `<div class="dv-was">Levél szerint: <span class="mono">${esc(a('date'))}</span></div>` : ''}
      <div class="dv-fr2 dv-eta"><span class="dv-fl">ETA</span><input type="date" class="dv-in" data-eta="date" aria-label="ETA nap" value="${esc(etaD.date)}"><input type="time" step="60" class="dv-in" data-eta="time" aria-label="ETA idő" value="${esc(etaD.time)}">${etaOv !== undefined ? resetBtn('eta', 'ETA') : ''}</div>
      ${etaOv !== undefined ? `<div class="dv-was">Levél szerint: <span class="mono">${A && A.eta_time ? `${esc(A.eta_date)} ${esc(A.eta_time)}` : 'nincs'}</span></div>` : ''}
      <label class="dv-sw"><input type="checkbox" data-dv="rmsw"${removed ? ' checked' : ''}><span class="dv-swt" aria-hidden="true"></span><span>Levéve a tervből</span></label>`);

    // --- Kamion
    const col = (k, l, extra = '') => fld(l, `<input class="dv-in" data-p="draft.cols.${k}" ${extra} value="${esc(d.cols[k])}">`);
    const truck = sec('Kamion', `<div class="dv-g2">${col('plate', 'Rendszám')}${col('t1', 'MRN (T1)')}${col('driver', 'Sofőr')}${col('phone', 'Telefon', 'inputmode="tel"')}
      ${fld('Rámpa', `<input class="dv-in" type="number" min="1" max="99" step="1" data-p="draft.cols.ramp" value="${esc(d.cols.ramp)}">`)}
      ${fld('Telephely', sel('draft.cols.site', [['', 'Nincs'], ['MG1', 'MG1'], ['MG3', 'MG3']], d.cols.site))}</div>
      ${fld('Megjegyzés', `<textarea class="dv-in" rows="2" maxlength="2000" data-p="draft.cols.note">${esc(d.cols.note)}</textarea>`)}
      <label class="dv-sw"><input type="checkbox" data-ty="b" data-p="draft.prio"${d.prio ? ' checked' : ''}><span class="dv-swt" aria-hidden="true"></span><span>Prioritás</span></label>`);

    // --- Továbbiak (ritkán kell)
    const num = (k, l, step) => `<div class="dv-fr2"><span class="dv-fl">${l}</span><input class="dv-in" type="number" min="0" step="${step}" data-ty="n" data-ov="${k}" value="${esc(ov[k] ?? c[k] ?? '')}">${k in ov ? resetBtn(k, l) : ''}</div>`;
    const hist = (c.history || []).slice().reverse().map(h => `<li><span class="mono">${esc(dm(h.at))}</span><span>${histTxt(h)}</span></li>`).join('');
    const R = K.raw(), t1 = String(c.t1 || '').replace(/\s/g, '').toUpperCase();
    const stL = s => (ARR_ST.find(x => x[0] === (s || 'request')) || [0, s])[1];
    const msgs = (R.MSGS || []).filter(m => (m.containers || []).some(x => x && x.id === d.id)).sort((x, y) => (x.received < y.received ? 1 : -1)).slice(0, 10);
    const arrs = (R.ARR || []).filter(x => (x.containers || []).some(i => upper(i) === d.id) || (t1 && (x.mrns || []).some(m => upper(m).replace(/\s/g, '') === t1))).sort((x, y) => (x.received < y.received ? 1 : -1)).slice(0, 10);
    const pn = new Set((c.pdd || []).map(p => upper(p.no)));
    const stos = (R.STO || []).filter(s => pn.has(upper(s.awb))).slice(0, 10);
    const srcRow = (tab, id, at, text) => `<li><span class="mono">${esc(dm(at))}</span><span class="dv-ell">${text}</span><button type="button" class="dv-lnk" data-dv="go" data-tab="${tab}" data-id="${esc(id)}">Megnyit</button></li>`;
    const lst = (h, items) => `<h4>${h}</h4><ul class="dv-list">${items || '<li class="dv-faint">Nincs</li>'}</ul>`;
    const more = `<details class="dv-more2"${d.more ? ' open' : ''} data-dv-more><summary>Továbbiak</summary>
      ${sec('Szállítmány', `<div class="dv-fr2"><span class="dv-fl">Szállító</span>${seg('ovsrc', 'src', [['', 'Levél szerint'], ...SRCS], ov.src || '')}</div>
        ${num('kg', 'Súly kg', 'any')}${num('ctns', 'Colli', '1')}${pddBlock(d, A, c)}`)}
      ${sec('Előzmények', `<ul class="dv-list">${hist || '<li class="dv-faint">Nincs</li>'}</ul>
        ${lst('Pre-alert levelek', msgs.map(m => srcRow('msg', m.id, m.received, esc(m.subject || ''))).join(''))}
        ${lst('Nyitás levelek', arrs.map(x => srcRow('arr', x.id, x.received, `${esc(stL(x.stage))} · ${esc(x.subject || '')}`)).join(''))}
        ${lst('Betárolás', stos.map(s => srcRow('sto', s.id, s.stored_at, `${esc(s.awb)} · ${esc(s.ctns ?? '')} colli`)).join(''))}`)}
      ${sec('Nyers adat', `<details class="dv-det"><summary>Kézi adatok</summary><pre class="dv-pre">${esc(jstr(man))}</pre></details>
        <details class="dv-det"><summary>Számított állapot</summary><pre class="dv-pre">${esc(jstr(c))}</pre></details>`)}
      ${c.ov && c.ov.create ? sec('Kézi felvétel', `<div class="dv-dz">${askBtn('Kézi felvétel törlése', 'delcont', d.id, { msg: 'Biztosan törlöd a kézi felvételt?' })}</div>`) : ''}
    </details>`;

    const manualKeys = c.ov && Object.keys(c.ov).some(k => !['create', 'at', 'by'].includes(k));
    const by = man.updated_by ? `<span class="dv-faint">Módosította: ${esc(man.updated_by)} · ${esc(dm(man.updated_at))}</span>` : '';
    const head = `<div class="dv-edid mono">${esc(d.id)}</div>`;
    const sub = `<div class="dv-edsub">${pill(c)}<button type="button" class="dv-lnk" data-dv="sheet" data-id="${esc(d.id)}">Adatlap</button>${by}
      ${manualKeys ? `<span class="dv-sp"></span>${askBtn('Minden vissza a levelek szerint', 'clearov', d.id, { cls: 'btn-ghost sm', msg: 'Minden kézi beállítás törlődik?', yes: 'Igen' })}` : ''}</div>`;
    return edFrame(head, sub, status + times + truck + more, FOOT());
  }

  function pddBlock(d, A, c) {
    const ov = d.ov, has = Array.isArray(ov.pdd), list = has ? ov.pdd : (c.pdd || []);
    const autoList = ((A && A.pdd) || []).map(p => `${p.no}:${p.ctns}:${p.kg}`).join('  ');
    const rows = has
      ? ov.pdd.map((p, i) => `<div class="dv-pr"><input class="dv-in mono" placeholder="PDD szám" aria-label="PDD szám" data-p="draft.ov.pdd.${i}.no" value="${esc(p.no)}"><input class="dv-in" type="number" min="0" placeholder="Colli" aria-label="Colli" data-p="draft.ov.pdd.${i}.ctns" value="${esc(p.ctns)}"><input class="dv-in" type="number" min="0" step="any" placeholder="Kg" aria-label="Kg" data-p="draft.ov.pdd.${i}.kg" value="${esc(p.kg)}">${rmBtn('draft.ov.pdd', i)}</div>`).join('')
      : list.map(p => `<div class="dv-pr ro"><span class="mono">${esc(p.no)}</span><span>${esc(p.ctns)} colli</span><span>${esc(p.kg)} kg</span></div>`).join('') || '<div class="dv-faint">Nincs PDD</div>';
    return `<div class="dv-fr dv-pdd" data-key="pdd"><span class="dv-fl">PDD</span><div class="dv-fc">${rows}
      <div class="dv-pa">${has ? '<button type="button" class="dv-lnk" data-dv="radd" data-path="draft.ov.pdd" data-tpl="pdd">+ Sor</button>' : '<button type="button" class="dv-lnk" data-dv="pddov">Felülírás</button>'}</div>
      ${has && autoList ? `<span class="dv-auto">auto: ${esc(autoList)}</span>` : ''}</div>
      <button type="button" class="dv-rs" data-dv="reset" data-k="pdd" title="Vissza automatikusra" aria-label="PDD: vissza automatikusra"${has ? '' : ' hidden'}>↺</button></div>`;
  }

  function histTxt(h) {
    const f = s => `<span class="mono">${esc(s || '—')}</span>`;
    switch (h.kind) {
      case 'first': return `Első említés · ${f(h.date)}`;
      case 'moved': return `Áthelyezve ${f(h.from)} → ${f(h.to)}${h.back ? ' (visszakerült)' : ''}`;
      case 'removed': return `Levéve a listáról · ${f(h.from)}`;
      case 'late': return `Késői módosítás ${f(h.from)} → ${f(h.to)}`;
      case 'listed': return `Listán · ${f(h.date)}`;
      case 'changed': return `${esc(h.field)}: ${f(h.from)} → ${f(h.to)}`;
      case 'truck': return `Kamion: ${f(h.plate)} ${f(h.t1)}`;
      case 'weight': return `Súly: ${f(h.from)} → ${f(h.to)}`;
      case 'stage': return `${esc((ARR_ST.find(x => x[0] === h.stage) || [0, h.stage])[1])} · ${esc(h.sender || '')}`;
      case 'stored': return `Betárolva ${f(h.awb)} · ${esc(h.ctns ?? '')} colli`;
      default: return esc(h.kind || '');
    }
  }

  // --- konténer mentés
  async function saveCont(d) {
    const ov = clone(d.ov), cols = d.cols;
    if (ov.date !== undefined && !DAY.test(ov.date)) return bad('Hibás nap');
    for (const k of ['kg', 'ctns']) if (k in ov && !(typeof ov[k] === 'number' && ov[k] >= 0)) return bad(`Hibás ${k === 'kg' ? 'súly' : 'colli'}`);
    if (ov.fwd !== undefined) { ov.fwd = String(ov.fwd).trim(); if (!ov.fwd) delete ov.fwd; }
    if (ov.eta && typeof ov.eta === 'object' && (!DAY.test(ov.eta.date || '') || !HM.test(ov.eta.time || ''))) return bad('Az ETA-hoz nap és HH:MM idő kell');
    if (ov.arrived !== undefined && ov.arrived !== false) { if (!LTS.test(ov.arrived)) return bad('Hibás érkezési idő'); ov.arrived = ovTs(ov.arrived); }
    if (ov.stages) for (const k of Object.keys(ov.stages)) { const v = ov.stages[k]; if (v !== false) { if (!LTS.test(v)) return bad('Hibás mérföldkő idő'); ov.stages[k] = ovTs(v); } }
    if (Array.isArray(ov.pdd)) ov.pdd = ov.pdd.filter(p => String(p.no || '').trim()).map(p => ({ no: String(p.no).trim(), ctns: Number(p.ctns) || 0, kg: Number(p.kg) || 0 }));
    let ramp = null;
    if (String(cols.ramp).trim() !== '') { ramp = Number(cols.ramp); if (!Number.isInteger(ramp) || ramp < 1 || ramp > 99) return bad('A rámpa 1 és 99 közötti szám'); }
    if (cols.note.length > 2000) return bad('A megjegyzés legfeljebb 2000 karakter');
    let fresh;
    try { fresh = await getRow('manual', d.id); } catch (e) { return bad('Nem olvasható a sor'); }
    // Csak a ténylegesen átírt kulcsok mennek ki: amit közben más mentett (adatlap, másik admin), megmarad.
    const js = v => JSON.stringify(v);
    const merged = { ...((fresh && fresh.override) || {}) };
    let ovChanged = false;
    for (const k of new Set([...Object.keys(ov), ...Object.keys(d.ov0)])) {
      if (k === 'at' || k === 'by' || js(ov[k]) === js(d.ov0[k])) continue;
      ovChanged = true;
      if (k in ov) merged[k] = ov[k]; else delete merged[k];
    }
    if (ovChanged) { merged.at = nowLocal(); merged.by = K.me().email; }
    const base = { ...(fresh || {}) }; delete base.updated_by; delete base.updated_at;
    const row = { ...base, container: d.id };
    const colVal = { plate: nz(cols.plate), t1: nz(cols.t1), driver: nz(cols.driver), phone: nz(cols.phone), site: cols.site || null, note: nz(cols.note), ramp };
    for (const k of Object.keys(colVal)) if (String(cols[k]) !== String(d.cols0[k])) row[k] = colVal[k];
    if ('ramp' in row && row.ramp !== ((fresh && fresh.ramp) || null)) row.ramp_set = row.ramp ? new Date().toISOString() : null;
    row.override = Object.keys(merged).some(k => k !== 'at' && k !== 'by') ? merged : null;
    const r = await write('manual', d.id, fresh ? 'update' : 'insert', fresh, row);
    if (!r.ok) return false;
    const was = (K.raw().PRIO || []).includes(d.id);
    if (d.prio !== was) {
      const ok = await setPrio(d.id, d.prio);
      if (ok) await K.reload();
    }
    S.draft = mkCont(d.id);
    renderList(); renderEditor(); renderNav();
    return true;
  }
  async function setPrio(id, on) {
    try {
      const before = await getRow('app_settings', 1);
      const list = ((before && before.priority) || []).filter(x => x !== id);
      if (on) list.push(id);
      const r = await write('app_settings', 1, 'update', before, { ...(before || { id: 1 }), priority: list }, { quiet: true });
      return r.ok;
    } catch (e) { bad('A prioritás mentése nem sikerült'); return false; }
  }

  // --- új konténer
  function mkNew() {
    const t = K.today();
    return { tab: 'cont', kind: 'new', id: '', snap: '', f: { id: '', date: t, src: 'jz', fwd: '', kg: '', ctns: '', pdd: [], etaOn: false, etaDate: t, etaTime: '', plate: '', t1: '', driver: '', phone: '' } };
  }
  function ED_new(d) {
    const f = d.f;
    const body = sec('Új konténer', `
      ${fld('Konténerszám', `<input class="dv-in mono" data-ty="u" data-p="draft.f.id" data-after="newid" maxlength="11" placeholder="ABCD1234567" value="${esc(f.id)}">`)}
      <div class="dv-warn" id="dv-newwarn" role="status" hidden></div>
      ${fld('Nap', `<input type="date" class="dv-in" data-p="draft.f.date" value="${esc(f.date)}">`)}
      ${fld('Szállító', sel('draft.f.src', SRCS, f.src))}
      <div class="dv-g2">${fld('ETA nap', `<input type="date" class="dv-in" data-p="draft.f.etaDate" value="${esc(f.etaDate)}">`)}${fld('ETA idő', `<input type="time" step="60" class="dv-in" data-p="draft.f.etaTime" value="${esc(f.etaTime)}">`)}</div>`)
      + `<details class="dv-more2"><summary>További adatok</summary>
      ${sec('Kamion', `<div class="dv-g2">${fld('Rendszám', txt('draft.f.plate', f.plate))}${fld('MRN (T1)', txt('draft.f.t1', f.t1))}${fld('Sofőr', txt('draft.f.driver', f.driver))}${fld('Telefon', txt('draft.f.phone', f.phone, 'inputmode="tel"'))}</div>`)}
      ${sec('Szállítmány', `<div class="dv-g2">${fld('Súly kg', `<input class="dv-in" type="number" min="0" step="any" data-p="draft.f.kg" value="${esc(f.kg)}">`)}${fld('Colli', `<input class="dv-in" type="number" min="0" step="1" data-p="draft.f.ctns" value="${esc(f.ctns)}">`)}</div>
        ${f.pdd.map((p, i) => `<div class="dv-pr"><input class="dv-in mono" placeholder="PDD szám" aria-label="PDD szám" data-p="draft.f.pdd.${i}.no" value="${esc(p.no)}"><input class="dv-in" type="number" min="0" placeholder="Colli" aria-label="Colli" data-p="draft.f.pdd.${i}.ctns" value="${esc(p.ctns)}"><input class="dv-in" type="number" min="0" step="any" placeholder="Kg" aria-label="Kg" data-p="draft.f.pdd.${i}.kg" value="${esc(p.kg)}">${rmBtn('draft.f.pdd', i)}</div>`).join('')}
        <button type="button" class="dv-lnk" data-dv="radd" data-path="draft.f.pdd" data-tpl="pdd">+ PDD</button>`)}
      </details>`;
    return edFrame('Új konténer', '', body, FOOT());
  }
  async function saveNew(d) {
    const f = d.f, id = upper(f.id).trim();
    if (!CID.test(id)) return bad('A konténerszám 4 betű és 7 számjegy');
    if (C()[id]) return bad('Ez a konténer már létezik, szerkeszd a listából');
    if (!DAY.test(f.date)) return bad('A nap kötelező');
    const cr = { date: f.date, src: f.src, fwd: SRC_NAME[f.src] || '' };
    for (const k of ['kg', 'ctns']) if (String(f[k]).trim() !== '') { const n = Number(f[k]); if (!(n >= 0)) return bad(k === 'kg' ? 'Hibás súly' : 'Hibás colli'); cr[k] = n; }
    const pdd = f.pdd.filter(p => String(p.no).trim()).map(p => ({ no: String(p.no).trim(), ctns: Number(p.ctns) || 0, kg: Number(p.kg) || 0 }));
    if (pdd.length) cr.pdd = pdd;
    const ov = { create: cr };
    if (f.etaTime) { if (!DAY.test(f.etaDate) || !HM.test(f.etaTime)) return bad('Az ETA-hoz nap és idő kell'); ov.eta = { date: f.etaDate, time: f.etaTime }; }
    ov.at = nowLocal(); ov.by = K.me().email;
    let fresh = null;
    try { fresh = await getRow('manual', id); } catch (e) { /* új sor */ }
    const base = { ...(fresh || {}) }; delete base.updated_by; delete base.updated_at;
    const row = { ...base, container: id, plate: nz(f.plate) || base.plate || null, t1: nz(f.t1) || base.t1 || null, driver: nz(f.driver) || base.driver || null, phone: nz(f.phone) || base.phone || null, override: ov };
    const r = await write('manual', id, fresh ? 'update' : 'insert', fresh, row);
    if (!r.ok) return false;
    const rg = perRange(); if (rg && (f.date < rg[0] || f.date > rg[1])) S.cf.per = 'all';
    S.draft = mkCont(id);
    renderMain();
    return true;
  }

  async function clearOverride(id, whole) {
    let fresh;
    try { fresh = await getRow('manual', id); } catch (e) { return bad('Nem olvasható a sor'); }
    if (!fresh) return bad('Nincs kézi sor');
    const base = { ...fresh }; delete base.updated_by; delete base.updated_at;
    const other = ['eta_date', 'eta_time', 'note', 'ramp', 'plate', 't1', 'driver', 'phone', 'site'].some(k => base[k]) || base.arrived || base.auto_dismissed || (Array.isArray(base.pdd) ? base.pdd.length : base.pdd);
    const r = whole && !other
      ? await write('manual', id, 'delete', fresh, null)
      : await write('manual', id, 'update', fresh, { ...base, override: !whole && base.override && base.override.create ? { create: base.override.create, at: nowLocal(), by: K.me().email } : null });
    if (!r.ok) return;
    S.draft = C()[id] ? mkCont(id) : null;
    renderList(); renderEditor(); renderNav();
  }

  // ====================== 2. PRE-ALERT LEVELEK ======================
  const c2f = c => {
    const x = {}; Object.keys(c || {}).forEach(k => { if (!KNOWN_C.includes(k)) x[k] = c[k]; });
    return {
      id: c.id || '', date: c.date || '', src: c.src || '', fwd: c.fwd || '', kg: c.kg ?? '', ctns: c.ctns ?? '', plate: c.plate || '', t1: c.t1 || '', driver: c.driver || '', phone: c.phone || '',
      pdd: (c.pdd || []).map(p => `${p.no}:${p.ctns ?? ''}:${p.kg ?? ''}`).join('\n'), x
    };
  };
  function f2c(r, strict) {
    const o = { id: upper(r.id).trim() };
    if (strict && !o.id) throw new Error('Üres konténerszám a rácsban');
    if (r.date) { if (strict && !DAY.test(r.date)) throw new Error(`Hibás nap: ${r.id}`); o.date = r.date; }
    ['src', 'fwd', 'plate', 't1', 'driver', 'phone'].forEach(k => { if (String(r[k] || '').trim()) o[k] = String(r[k]).trim(); });
    ['kg', 'ctns'].forEach(k => { if (String(r[k]).trim() !== '') { const n = Number(r[k]); if (strict && !(n >= 0)) throw new Error(`Hibás szám: ${r.id}`); o[k] = n || 0; } });
    const pdd = String(r.pdd || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [no, ctns, kg] = l.split(':').map(s => s.trim()); return { no, ctns: Number(ctns) || 0, kg: Number(kg) || 0 }; });
    if (pdd.length) o.pdd = pdd;
    return { ...(r.x || {}), ...o };
  }
  const etaIn = e => ({ container: e.container || '', date: e.date || '', time: e.time || '' });
  function mkMsg(row) {
    return setSnap({
      tab: 'msg', kind: 'msg', id: row.id, isNew: false, jm: false, jc: '', je: '',
      f: { subject: row.subject || '', received: toInp(row.received), kind: row.kind || 'mail', dates: (row.dates || []).join(', '), containers: (row.containers || []).map(c2f), etas: (row.etas || []).map(etaIn) }
    });
  }
  function newMsg(from) {
    const f = from ? clone(from.f) : { subject: '', received: toInp(new Date().toISOString()), kind: 'mail', dates: '', containers: [], etas: [] };
    if (from) { f.kind = 'mail'; f.subject = f.subject; f.received = toInp(new Date().toISOString()); }
    return { tab: 'msg', kind: 'msg', id: `admin-${Date.now()}`, isNew: true, jm: from ? from.jm : false, jc: from ? from.jc : '', je: from ? from.je : '', f, snap: '' };
  }
  function ED_msg(d) {
    const f = d.f, manual = d.id.startsWith('admin-');
    const cards = f.containers.map((r, i) => {
      const P = `draft.f.containers.${i}`;
      return `<div class="dv-cc"><div class="dv-cch"><b class="mono">${esc(r.id || 'Új konténer')}</b>${rmBtn('draft.f.containers', i)}</div>
        <div class="dv-g3">${fld('Konténer', `<input class="dv-in mono" data-ty="u" data-p="${P}.id" value="${esc(r.id)}">`)}${fld('Nap', `<input type="date" class="dv-in" data-p="${P}.date" value="${esc(r.date)}">`)}${fld('Szállító', sel(`${P}.src`, [['', '—'], ...SRCS], r.src))}
        ${fld('Szállító neve', txt(`${P}.fwd`, r.fwd))}${fld('Kg', `<input class="dv-in" type="number" min="0" step="any" data-p="${P}.kg" value="${esc(r.kg)}">`)}${fld('Colli', `<input class="dv-in" type="number" min="0" data-p="${P}.ctns" value="${esc(r.ctns)}">`)}
        ${fld('Rendszám', txt(`${P}.plate`, r.plate))}${fld('T1', txt(`${P}.t1`, r.t1))}${fld('Sofőr', txt(`${P}.driver`, r.driver))}${fld('Telefon', txt(`${P}.phone`, r.phone))}</div>
        ${fld('PDD <small class="dv-faint">soronként: szám:colli:kg</small>', `<textarea class="dv-in mono" rows="2" spellcheck="false" data-p="${P}.pdd">${esc(r.pdd)}</textarea>`)}</div>`;
    }).join('');
    const etas = f.etas.map((e, i) => `<div class="dv-pr"><input class="dv-in mono" placeholder="Konténer" aria-label="Konténer" data-ty="u" data-p="draft.f.etas.${i}.container" value="${esc(e.container)}"><input type="date" class="dv-in" aria-label="Nap" data-p="draft.f.etas.${i}.date" value="${esc(e.date)}"><input type="time" step="60" class="dv-in" aria-label="Idő" data-p="draft.f.etas.${i}.time" value="${esc(e.time)}">${rmBtn('draft.f.etas', i)}</div>`).join('');
    const tog = `<div class="dv-seg" role="group">${[['t', 'Táblázat'], ['j', 'JSON']].map(([v, l]) => `<button type="button" class="${(v === 'j') === d.jm ? 'on' : ''}" aria-pressed="${(v === 'j') === d.jm}" data-dv="jmode" data-v="${v}">${l}</button>`).join('')}</div>`;
    const conts = d.jm
      ? `<textarea class="dv-in mono dv-json" rows="14" spellcheck="false" data-p="draft.jc" data-after="json" aria-label="Konténerek JSON">${esc(d.jc)}</textarea><div class="dv-jm" id="dv-jm-c"></div>`
      : `${cards || '<div class="dv-faint">Nincs konténer</div>'}<button type="button" class="dv-lnk" data-dv="radd" data-path="draft.f.containers" data-tpl="cont">+ Konténer</button>`;
    const et = d.jm
      ? `<textarea class="dv-in mono dv-json" rows="6" spellcheck="false" data-p="draft.je" data-after="json" aria-label="ETA-k JSON">${esc(d.je)}</textarea><div class="dv-jm" id="dv-jm-e"></div>`
      : `${etas || '<div class="dv-faint">Nincs ETA</div>'}<button type="button" class="dv-lnk" data-dv="radd" data-path="draft.f.etas" data-tpl="eta">+ ETA</button>`;
    const body = sec('Levél', `${fld('Tárgy', txt('draft.f.subject', f.subject))}
      <div class="dv-g2">${fld('Érkezett', `<input type="datetime-local" step="60" class="dv-in" data-p="draft.f.received" value="${esc(f.received)}">`)}${fld('Típus', sel('draft.f.kind', [['mail', 'Levél'], ['quoted', 'Idézett']], f.kind))}</div>
      ${fld('Napok <small class="dv-faint">vesszővel</small>', `<input class="dv-in mono" data-p="draft.f.dates" placeholder="2026-11-14, 2026-11-15" value="${esc(f.dates)}">`)}`)
      + sec(`Konténerek <small class="dv-faint">${d.jm ? '' : f.containers.length}</small>`, conts, tog)
      + sec('ETA-k', et)
      + (d.isNew ? '' : sec('Törlés', `<div class="dv-dz">${askBtn('Levél törlése', 'delmsg', d.id)}</div>`));
    const sub = `<div class="dv-edsub"><span class="mono dv-faint">${esc(d.id)}</span>${d.isNew ? '<span class="dv-tag">ÚJ</span>' : manual ? '<span class="dv-tag">KÉZI</span>' : '<span class="dv-tag sy">SZINKRON</span>'}</div>`;
    return edFrame(d.isNew ? 'Új levél' : 'Pre-alert levél', sub, body, FOOT(d.isNew ? '' : '<button type="button" class="btn-ghost sm" data-dv="copymsg">Másolat új kézi levélként</button>'));
  }
  function msgOut(d) {
    if (d.jm) {
      let c, e;
      try { c = JSON.parse(d.jc || '[]'); } catch (x) { throw new Error('A konténerek JSON-ja hibás'); }
      try { e = JSON.parse(d.je || '[]'); } catch (x) { throw new Error('Az ETA-k JSON-ja hibás'); }
      if (!Array.isArray(c) || !Array.isArray(e)) throw new Error('A JSON-nak tömbnek kell lennie');
      if (c.some(x => !x || typeof x !== 'object' || !x.id)) throw new Error('Minden konténernek kell id');
      return { containers: c, etas: e };
    }
    const containers = d.f.containers.map(r => f2c(r, true));
    const etas = d.f.etas.filter(e => e.container.trim()).map(e => {
      if (e.date && !DAY.test(e.date)) throw new Error(`Hibás ETA nap: ${e.container}`);
      if (e.time && !HM.test(e.time)) throw new Error(`Hibás ETA idő: ${e.container}`);
      return { container: upper(e.container).trim(), date: e.date || '', time: e.time || null };
    });
    return { containers, etas };
  }
  async function saveMsg(d) {
    let out;
    try { out = msgOut(d); } catch (e) { return bad(e.message); }
    const dates = d.f.dates.split(/[,\s]+/).filter(Boolean);
    if (dates.some(x => !DAY.test(x))) return bad('Hibás nap a „Napok” mezőben');
    if (!d.f.received) return bad('Az érkezés ideje kötelező');
    let fresh = null;
    try { fresh = d.isNew ? null : await getRow('messages', d.id); } catch (e) { return bad('Nem olvasható a sor'); }
    const row = { ...(fresh || { attachments: [] }), id: d.id, subject: d.f.subject, received: fromInp(d.f.received), kind: d.f.kind, dates, containers: out.containers, etas: out.etas };
    const r = await write('messages', d.id, fresh ? 'update' : 'insert', fresh, row);
    if (!r.ok) return false;
    cacheRow('msg', r.row, 'received');
    S.draft = mkMsg(r.row);
    counts(); renderList(); renderEditor();
    return true;
  }
  function cacheRow(tab, row, order) {
    const a = S.rows[tab] || (S.rows[tab] = []), i = a.findIndex(x => x.id === row.id);
    if (i >= 0) a[i] = row; else a.push(row);
    a.sort((x, y) => Date.parse(y[order]) - Date.parse(x[order]));
  }
  function uncache(tab, id) { S.rows[tab] = (S.rows[tab] || []).filter(x => x.id !== id); }

  // ====================== 3. NYITÁS LEVELEK ======================
  function mkArr(row) {
    return setSnap({ tab: 'arr', kind: 'arr', id: row.id, isNew: false, f: { received: toInp(row.received), stage: row.stage || 'request', sender: row.sender || '', subject: row.subject || '', containers: (row.containers || []).join('\n'), mrns: (row.mrns || []).join('\n'), snippet: row.snippet || '' } });
  }
  const newArr = () => ({ tab: 'arr', kind: 'arr', id: `admin-${Date.now()}`, isNew: true, snap: '', f: { received: toInp(new Date().toISOString()), stage: 'request', sender: '', subject: '', containers: '', mrns: '', snippet: '' } });
  function ED_arr(d) {
    const f = d.f;
    const body = sec('Nyitás levél', `<div class="dv-g2">${fld('Érkezett', `<input type="datetime-local" step="60" class="dv-in" data-p="draft.f.received" value="${esc(f.received)}">`)}${fld('Szakasz', sel('draft.f.stage', ARR_ST, f.stage))}</div>
      ${fld('Feladó', txt('draft.f.sender', f.sender))}${fld('Tárgy', txt('draft.f.subject', f.subject))}
      <div class="dv-g2">${fld('Konténerek <small class="dv-faint">soronként</small>', `<textarea class="dv-in mono" rows="4" spellcheck="false" data-p="draft.f.containers">${esc(f.containers)}</textarea>`)}${fld('MRN-ek <small class="dv-faint">soronként</small>', `<textarea class="dv-in mono" rows="4" spellcheck="false" data-p="draft.f.mrns">${esc(f.mrns)}</textarea>`)}</div>
      ${fld('Részlet', `<textarea class="dv-in" rows="4" data-p="draft.f.snippet">${esc(f.snippet)}</textarea>`)}`)
      + (d.isNew ? '' : sec('Törlés', `<div class="dv-dz">${askBtn('Levél törlése', 'delarr', d.id)}</div>`));
    return edFrame(d.isNew ? 'Új nyitás levél' : 'Nyitás levél', `<div class="dv-edsub"><span class="mono dv-faint">${esc(d.id)}</span>${d.isNew ? '<span class="dv-tag">ÚJ</span>' : ''}</div>`, body, FOOT());
  }
  async function saveArr(d) {
    if (!d.f.received) return bad('Az érkezés ideje kötelező');
    const lines = s => s.split('\n').map(x => x.trim()).filter(Boolean);
    let fresh = null;
    try { fresh = d.isNew ? null : await getRow('arrivals', d.id); } catch (e) { return bad('Nem olvasható a sor'); }
    const row = { ...(fresh || {}), id: d.id, received: fromInp(d.f.received), stage: d.f.stage, sender: d.f.sender, subject: d.f.subject, containers: [...new Set(lines(d.f.containers).map(upper))], mrns: lines(d.f.mrns), snippet: d.f.snippet };
    const r = await write('arrivals', d.id, fresh ? 'update' : 'insert', fresh, row);
    if (!r.ok) return false;
    cacheRow('arr', r.row, 'received');
    S.draft = mkArr(r.row);
    counts(); renderList(); renderEditor();
    return true;
  }

  // ====================== 4. BETÁROLÁS ======================
  function mkSto(row) {
    return setSnap({ tab: 'sto', kind: 'sto', id: row.id, isNew: false, f: { awb: row.awb || '', stored_at: toInp(row.stored_at), ctns: row.ctns ?? '', kg: row.kg ?? '' } });
  }
  const newSto = () => ({ tab: 'sto', kind: 'sto', id: `admin-${Date.now()}`, isNew: true, snap: '', f: { awb: '', stored_at: toInp(new Date().toISOString()), ctns: '', kg: '' } });
  function ED_sto(d) {
    const f = d.f, c = pddMap()[upper(f.awb)];
    const body = sec('Betárolás', `${fld('AWB / PDD', `<input class="dv-in mono" data-p="draft.f.awb" data-after="stomatch" value="${esc(f.awb)}">`)}
      <div class="dv-note" id="dv-stomatch">${c ? `Konténer: <button type="button" class="dv-lnk mono" data-dv="go" data-tab="cont" data-id="${esc(c.id)}">${esc(c.id)}</button>` : 'Nincs hozzá konténer'}</div>
      ${fld('Betárolva', `<input type="datetime-local" step="60" class="dv-in" data-p="draft.f.stored_at" value="${esc(f.stored_at)}">`)}
      <div class="dv-g2">${fld('Colli', `<input class="dv-in" type="number" min="0" step="1" data-p="draft.f.ctns" value="${esc(f.ctns)}">`)}${fld('Kg', `<input class="dv-in" type="number" min="0" step="any" data-p="draft.f.kg" value="${esc(f.kg)}">`)}</div>`)
      + (d.isNew ? '' : sec('Törlés', `<div class="dv-dz">${askBtn('Betárolás törlése', 'delsto', d.id)}</div>`));
    return edFrame(d.isNew ? 'Új betárolás' : 'Betárolás', `<div class="dv-edsub"><span class="mono dv-faint">${esc(d.id)}</span>${d.isNew ? '<span class="dv-tag">ÚJ</span>' : ''}</div>`, body, FOOT());
  }
  function stoRow(d) {
    const f = d.f;
    if (!f.awb.trim()) throw new Error('Az AWB kötelező');
    if (!f.stored_at) throw new Error('A betárolás ideje kötelező');
    const ctns = String(f.ctns).trim() === '' ? null : Number(f.ctns), kg = String(f.kg).trim() === '' ? null : Number(f.kg);
    if (ctns != null && !(Number.isInteger(ctns) && ctns >= 0)) throw new Error('A colli nemnegatív egész');
    if (kg != null && !(kg >= 0)) throw new Error('Hibás kg');
    return { awb: f.awb.trim(), stored_at: fromInp(f.stored_at), ctns, kg };
  }
  async function saveSto(d) {
    let part;
    try { part = stoRow(d); } catch (e) { return bad(e.message); }
    let fresh = null;
    try { fresh = d.isNew ? null : await getRow('storage_events', d.id); } catch (e) { return bad('Nem olvasható a sor'); }
    const r = await write('storage_events', d.id, fresh ? 'update' : 'insert', fresh, { ...(fresh || {}), id: d.id, ...part });
    if (!r.ok) return false;
    cacheRow('sto', r.row, 'stored_at');
    S.draft = mkSto(r.row);
    counts(); renderList(); renderEditor();
    return true;
  }
  const newBulk = () => ({ tab: 'sto', kind: 'bulk', id: 'bulk', isNew: true, snap: '', f: { lines: '', stored_at: toInp(new Date().toISOString()) } });
  function ED_bulk(d) {
    const n = bulkInfo(d.f.lines);
    const body = sec('Tömeges felvitel', `${fld('AWB-k <small class="dv-faint">soronként: AWB [colli [kg]]</small>', `<textarea class="dv-in mono" rows="10" spellcheck="false" data-p="draft.f.lines" data-after="bulkn">${esc(d.f.lines)}</textarea>`)}
      ${fld('Betárolva (mindegyikre)', `<input type="datetime-local" step="60" class="dv-in" data-p="draft.f.stored_at" value="${esc(d.f.stored_at)}">`)}
      <p class="dv-note mono" id="dv-bulkn">${n}</p>`);
    return edFrame('Tömeges betárolás', '', body, FOOT());
  }
  function bulkInfo(txt) {
    const pm = pddMap(), aw = txt.split('\n').map(l => l.trim().split(/[\s;,\t]+/)[0]).filter(Boolean);
    return `${aw.length} sor · ${aw.filter(a => pm[upper(a)]).length} konténerhez tartozik`;
  }
  async function saveBulk(d) {
    if (!d.f.stored_at) return bad('A betárolás ideje kötelező');
    const lines = d.f.lines.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return bad('Nincs sor');
    const iso0 = fromInp(d.f.stored_at), base = Date.now();
    let ok = 0;
    for (let i = 0; i < lines.length; i++) {
      const [awb, c, k] = lines[i].split(/[\s;,\t]+/);
      const ctns = c === undefined || c === '' ? null : Number(c), kg = k === undefined || k === '' ? null : Number(k);
      if ((ctns != null && !(ctns >= 0)) || (kg != null && !(kg >= 0))) { bad(`Hibás sor: ${lines[i]}`); break; }
      const r = await write('storage_events', `admin-${base}-${i}`, 'insert', null, { id: `admin-${base}-${i}`, awb, stored_at: iso0, ctns, kg }, { quiet: true });
      if (!r.ok) break;
      ok++;
    }
    if (ok) say(`${ok} betárolás rögzítve`);
    reloadSoon();
    await load('sto', true);
    S.draft = null;
    counts(); renderList(); renderEditor();
    return ok === lines.length;
  }

  // ====================== 5. BEÁLLÍTÁSOK ======================
  async function loadSet() {
    try {
      const row = await getRow('app_settings', 1);
      S.set = { row, ramp: String((row && row.ramp_count) || ''), prio: ((row && row.priority) || []).join('\n') };
    } catch (e) { S.set = { err: String(e.message || e) }; }
    if (S.tab === 'sys') renderSet();
  }
  const parsePrio = txt => txt.split(/[\s,;]+/).map(upper).filter(Boolean);
  function chipsHtml(txt) {
    const ids = [...new Set(parsePrio(txt))];
    return ids.map(i => `<span class="dv-pc${CID.test(i) ? '' : ' bad'} mono">${esc(i)}</span>`).join('') || '<span class="dv-faint">Üres lista</span>';
  }
  function renderSet() {
    const pg = $('#dv-set'); if (!pg) return;
    const s = S.set;
    if (!s) { pg.innerHTML = empty('Betöltés…'); return; }
    if (s.err) { pg.innerHTML = empty(`Betöltési hiba: ${esc(s.err)}`); return; }
    const ids = parsePrio(s.prio);
    pg.innerHTML = `<div class="dv-cards">
      <section class="dv-card"><h3>Rámpák száma</h3><div class="dv-step"><button type="button" class="dv-ib" data-dv="step" data-n="-1" aria-label="Kevesebb">−</button>
        <input class="dv-in mono" type="number" min="1" max="99" step="1" data-p="set.ramp" data-after="setd" id="dv-ramp" aria-label="Rámpák száma" value="${esc(s.ramp)}"><button type="button" class="dv-ib" data-dv="step" data-n="1" aria-label="Több">+</button></div>
        <div class="dv-cf"><span class="dv-faint">Mentve: <span class="mono">${esc((s.row || {}).ramp_count ?? '—')}</span></span><button type="button" class="btn-primary sm" id="dv-saveramp" data-dv="saveramp" disabled>Mentés</button></div></section>
      <section class="dv-card wide"><h3>Prioritás <small class="dv-faint" id="dv-pn">${ids.length} db</small></h3>
        <textarea class="dv-in mono" rows="8" spellcheck="false" data-p="set.prio" data-after="chips" aria-label="Prioritásos konténerek" placeholder="Egy konténerszám soronként">${esc(s.prio)}</textarea>
        <div class="dv-pcs" id="dv-chips">${chipsHtml(s.prio)}</div>
        <div class="dv-cf"><span class="dv-faint">Mentve: <span class="mono">${((s.row || {}).priority || []).length}</span> db</span><button type="button" class="btn-primary sm" id="dv-saveprio" data-dv="saveprio" disabled>Mentés</button></div></section></div>`;
    AFTER.setd();
  }
  async function saveRamp() {
    const n = Number(S.set.ramp);
    if (!Number.isInteger(n) || n < 1 || n > 99) return bad('A rámpák száma 1 és 99 közötti');
    const before = await getRow('app_settings', 1);
    const r = await write('app_settings', 1, 'update', before, { ...(before || { id: 1 }), ramp_count: n });
    if (r.ok) { S.set.row = r.row; renderSet(); }
  }
  async function savePrio() {
    const ids = [...new Set(parsePrio(S.set.prio))];
    const badIds = ids.filter(i => !CID.test(i));
    if (badIds.length) return bad(`Hibás konténerszám: ${badIds[0]}`);
    const before = await getRow('app_settings', 1);
    const r = await write('app_settings', 1, 'update', before, { ...(before || { id: 1 }), priority: ids });
    if (r.ok) { S.set.row = r.row; S.set.prio = ids.join('\n'); renderSet(); }
  }

  // ====================== 6. RENDSZER ======================
  async function loadSys() {
    try {
      const [a, b, c, ...n] = await Promise.all([
        K.sb.from('sync_status').select('*').eq('id', 1).maybeSingle(),
        K.sb.from('glabs_status').select('*').eq('id', 1).maybeSingle(),
        K.sb.from('glabs_ramps').select('*').order('ramp'),
        ...['messages', 'manual', 'arrivals', 'storage_events'].map(count)
      ]);
      S.sys = { sync: a.data || null, gl: b.data || null, glr: c.data || [], n };
    } catch (e) { S.sys = { err: String(e.message || e) }; }
    if (S.tab === 'sys') renderSys();
    renderNav();
  }
  function renderSys() {
    const pg = $('#dv-sys'); if (!pg) return;
    const s = S.sys;
    if (!s) { pg.innerHTML = empty('Betöltés…'); return; }
    if (s.err) { pg.innerHTML = empty(`Betöltési hiba: ${esc(s.err)}`); return; }
    const sy = s.sync || {}, gl = s.gl || {};
    const syOk = sy.last_ok && !sy.error && (Date.now() - new Date(sy.last_ok)) < (Number(sy.interval_min) || 5) * 150000;
    const glOk = gl.last_ok && (Date.now() - new Date(gl.last_ok)) < 180000;
    const kv = (k, v) => `<dt>${k}</dt><dd class="mono">${v}</dd>`;
    const ts = t => (t ? `${esc(full(t))} <span class="dv-faint">(${ago(t)})</span>` : '—');
    const N = ['Pre-alert levelek', 'Kézi adatsorok', 'Nyitás levelek', 'Betárolások'];
    const st = ok => `<span class="dv-stx ${ok ? 'ok' : 'bad'}"><i class="dv-st" aria-hidden="true"></i>${ok ? 'Rendben' : 'Figyelni kell'}</span>`;
    const ramps = (s.glr || []).map(r => `<tr><td class="mono">${esc(r.ramp)}</td><td class="mono">${esc((r.plates || []).join(', ')) || '—'}</td><td>${esc(r.stage || '—')}</td><td class="mono">${esc(r.called_at ? dm(r.called_at) : '—')}</td><td class="mono">${esc(r.seen_at ? dm(r.seen_at) : '—')}</td><td class="act">${askBtn('Törlés', 'delramp', r.ramp, { cls: 'dv-danger sm' })}</td></tr>`).join('');
    pg.innerHTML = `<div class="dv-cards">
      <section class="dv-card"><h3>Outlook szinkron${st(syOk)}</h3><dl class="dv-kv">${kv('Utolsó siker', ts(sy.last_ok))}${kv('Intervallum', sy.interval_min ? `${esc(sy.interval_min)} perc` : '—')}${kv('Frissítve', ts(sy.updated_at))}</dl>
        ${sy.error ? `<pre class="dv-err">${esc(sy.error)}</pre>` : '<div class="dv-faint">Nincs hiba</div>'}
        <div class="dv-cf"><button type="button" class="btn-ghost sm" data-dv="syncerr"${sy.error ? '' : ' disabled'}>Hiba törlése</button><button type="button" class="btn-ghost sm" data-dv="syncnow">Sikeresnek jelölés</button></div></section>
      <section class="dv-card"><h3>Glabs${st(glOk)}</h3><dl class="dv-kv">${kv('Utolsó siker', ts(gl.last_ok))}${kv('Utolsó próba', ts(gl.last_try))}${kv('Belépési hiba', ts(gl.login_fail_at))}${kv('Rámpák', esc(gl.ramps ?? '—'))}</dl>
        ${gl.error ? `<pre class="dv-err">${esc(gl.error)}</pre>` : '<div class="dv-faint">Nincs hiba</div>'}</section>
      <section class="dv-card wide"><h3>Glabs rámpák <small class="dv-faint">${(s.glr || []).length} db</small></h3>
        ${ramps ? `<div class="dv-tw"><table class="dv-t flat"><thead><tr><th>Rámpa</th><th>Rendszámok</th><th>Szakasz</th><th>Hívva</th><th>Látva</th><th></th></tr></thead><tbody>${ramps}</tbody></table></div>` : '<div class="dv-faint">Üres</div>'}</section>
      <section class="dv-card wide"><h3>Adatok</h3><dl class="dv-kv">${N.map((l, i) => `<dt>${l}</dt><dd class="mono">${s.n[i] ?? '—'}</dd>`).join('')}</dl>
        <div class="dv-cf"><button type="button" class="btn-ghost sm" data-dv="reloadall">Teljes újratöltés</button><button type="button" class="btn-primary sm" data-dv="export">Export JSON</button></div></section></div>`;
  }
  async function sysPatch(patch) {
    const before = await getRow('sync_status', 1);
    if (!before) return bad('Nincs szinkron sor');
    const r = await write('sync_status', 1, 'update', before, { ...before, ...patch });
    if (r.ok) { S.sys.sync = r.row; renderSys(); renderNav(); }
  }
  async function exportAll() {
    try {
      const out = { exported_at: new Date().toISOString(), by: K.me().email };
      const spec = [['messages', 'received'], ['manual', 'container'], ['arrivals', 'received'], ['storage_events', 'stored_at'], ['app_settings', 'id'], ['sync_status', 'id']];
      for (const [t, o] of spec) out[t] = await fetchAll(t, o, true, 20000);
      const a = document.createElement('a');
      const n = new Date();
      a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
      a.download = `forecast-export-${iso(n)}-${p2(n.getHours())}${p2(n.getMinutes())}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      say('Export kész');
    } catch (e) { bad(`Az export nem sikerült: ${e.message || e}`); }
  }

  // ====================== 7. NAPLÓ ======================
  function logEd() {
    const r = (S.rows.log || []).find(x => String(x.id) === S.sel.log);
    if (!r) return empty('A sor nem található');
    const b = r.before, a = r.after, o = b || {}, n = a || {};
    const keys = [...new Set([...Object.keys(o), ...Object.keys(n)])].filter(k => JSON.stringify(o[k]) !== JSON.stringify(n[k]));
    const val = v => (v === undefined ? '<span class="dv-faint">—</span>' : v !== null && typeof v === 'object' ? `<pre>${esc(jstr(v))}</pre>` : `<span class="mono">${esc(v === null ? 'null' : v)}</span>`);
    const diff = keys.map(k => `<div class="dv-df"><div class="dv-dk mono">${esc(k)}</div>${b ? `<div class="dv-dv old">${val(o[k])}</div>` : ''}${a ? `<div class="dv-dv new">${val(n[k])}</div>` : ''}</div>`).join('') || '<div class="dv-faint">Nincs eltérés</div>';
    const body = sec('Változás', `<dl class="dv-kv">${[['Idő', full(r.at)], ['Ki', r.by], ['Hol', TBL_L[r.tbl] || r.tbl], ['Azonosító', r.key], ['Művelet', ACT_L[r.action] || r.action]].map(([k, v]) => `<dt>${k}</dt><dd class="mono">${esc(v)}</dd>`).join('')}</dl>`)
      + sec('Mezők', `<div class="dv-diff">${diff}</div>`)
      + sec('Visszaállítás', `<div class="dv-dz">${askBtn(b ? (a ? 'Módosítás előtti állapot visszaállítása' : 'Törölt sor visszaállítása') : 'Létrehozott sor törlése', 'restore', r.id, { cls: 'btn-ghost sm', msg: 'Biztosan?', yes: b ? 'Visszaállítás' : 'Törlés' })}</div>`);
    return edFrame(`${esc(TBL_L[r.tbl] || r.tbl)} · <span class="mono">${esc(r.key)}</span>`, `<div class="dv-edsub"><span class="dv-pill ac-${esc(r.action)}">${esc(ACT_L[r.action] || r.action)}</span></div>`, body, '<span class="dv-sp"></span>');
  }
  async function restore(id) {
    const r = (S.rows.log || []).find(x => String(x.id) === String(id));
    if (!r) return;
    let cur;
    try { cur = await getRow(r.tbl, r.key); } catch (e) { return bad('Nem olvasható a sor'); }
    const res = r.before === null
      ? await write(r.tbl, r.key, 'delete', cur, null, { log: 'restore' })
      : await write(r.tbl, r.key, 'restore', cur, r.before);
    if (!res.ok) return;
    if (r.tbl === 'manual') S.autoFor = null;
    await load('log', true);
    counts(); renderList(); renderEditor();
  }

  // ---------- szerkesztők regisztere ----------
  const ED = { cont: ED_cont, new: ED_new, msg: ED_msg, arr: ED_arr, sto: ED_sto, bulk: ED_bulk };
  const SAVE = { cont: saveCont, new: saveNew, msg: saveMsg, arr: saveArr, sto: saveSto, bulk: saveBulk };
  const NEWD = { cont: mkNew, msg: () => newMsg(), arr: newArr, sto: newSto };

  let saving = false;
  async function saveDraft() {
    const d = S.draft;
    if (!d || saving || !isDirty()) return false;
    saving = true;
    const b = $('#dv-save'); if (b) b.disabled = true;
    let ok = false;
    try { ok = await SAVE[d.kind](d); } catch (e) { console.error(e); bad('A mentés nem sikerült'); }
    saving = false;
    updateDirty();
    return ok;
  }

  // ---------- kijelölés ----------
  function mkDraft(tab, id) {
    if (tab === 'cont') return mkCont(id);
    const row = (S.rows[tab] || []).find(r => r.id === id);
    if (!row) return null;
    return { msg: mkMsg, arr: mkArr, sto: mkSto }[tab](row);
  }
  function pick(tab, id) {
    if (tab === 'log') { S.sel.log = id; renderList(); renderEditor(); return; }
    if (S.draft && S.draft.tab === tab && S.draft.id === id) { renderEditor(); return; }
    go(() => { hideGuard(); S.draft = mkDraft(tab, id); renderList(); renderEditor(); renderNav(); });
  }
  // Másik fülre ugrás (forrás-hivatkozás): a sor hiányzó cache-ét egyedi lekéréssel pótolja.
  function jump(tab, id) {
    go(async () => {
      hideGuard(); S.draft = null; S.sel.log = null; S.tab = tab;
      renderNav(); renderMain();
      if (tab === 'cont') {
        S.q.cont = '';
        const c = C()[id], dd = c && c.day;
        const rg = perRange(); if (dd && rg && (dd < rg[0] || dd > rg[1])) S.cf.per = 'all';
        S.draft = mkCont(id); renderMain(); return;
      }
      await load(tab);
      if (!(S.rows[tab] || []).some(r => r.id === id)) {
        const t = { msg: 'messages', arr: 'arrivals', sto: 'storage_events' }[tab];
        try { const row = await getRow(t, id); if (row) cacheRow(tab, row, tab === 'sto' ? 'stored_at' : 'received'); } catch (e) { console.warn(e); }
      }
      if (S.tab !== tab) return;
      S.draft = mkDraft(tab, id);
      if (!S.draft) say('A sor nem található', true);
      renderList(); renderEditor(); renderNav();
    });
  }
  function newDraft(tab) { go(() => { hideGuard(); S.draft = NEWD[tab](); renderList(); renderEditor(); renderNav(); const i = $('.dv-edb input, .dv-edb textarea'); if (i) i.focus(); }); }

  async function refresh() {
    const b = $('[data-dv="refresh"]'); if (b) { b.disabled = true; b.textContent = 'Frissítés…'; }
    try {
      await K.reload();
      S.autoFor = null;
      const t = S.tab;
      if (['msg', 'arr', 'sto', 'log'].includes(t)) await load(t, true);
      if (t === 'sys') { await loadSys(); await loadSet(); }
      counts();
      const d = S.draft;
      if (d && !isDirty() && !d.isNew) {
        const nd = d.tab === 'cont' ? mkCont(d.id) : mkDraft(d.tab, d.id);
        S.draft = nd;
      }
      if (t !== 'sys') { renderList(); renderEditor(); }
      renderNav();
      say('Frissítve');
    } catch (e) { bad('A frissítés nem sikerült'); }
    if (b) { b.disabled = false; b.textContent = 'Frissítés'; }
  }

  // ---------- események ----------
  const AFTER = {
    list() { renderList(); },
    log() { clearTimeout(logTm); logTm = setTimeout(async () => { S.rows.log = []; S.sel.log = null; try { await moreLog(); } catch (e) { S.err.log = String(e.message || e); } renderList(); renderEditor(); }, 280); },
    json(el) { let m = ''; try { if (!Array.isArray(JSON.parse(el.value || '[]'))) m = 'Tömb kell'; } catch (e) { m = e.message; } el.classList.toggle('bad', !!m); const n = el.nextElementSibling; if (n) n.textContent = m; },
    newid(el) {
      const w = $('#dv-newwarn'), id = upper(el.value).trim();
      if (id && C()[id]) { w.hidden = false; w.innerHTML = `Ez a konténer már létezik. <button type="button" class="dv-lnk" data-dv="go" data-tab="cont" data-id="${esc(id)}">Megnyitás</button>`; }
      else if (id.length === 11 && !CID.test(id)) { w.hidden = false; w.textContent = 'A formátum: 4 betű és 7 számjegy'; }
      else w.hidden = true;
    },
    stomatch(el) { const c = pddMap()[upper(el.value)], n = $('#dv-stomatch'); n.innerHTML = c ? `Konténer: <button type="button" class="dv-lnk mono" data-dv="go" data-tab="cont" data-id="${esc(c.id)}">${esc(c.id)}</button>` : 'Nincs hozzá konténer'; },
    bulkn() { const n = $('#dv-bulkn'); if (n) n.textContent = bulkInfo(S.draft.f.lines); },
    chips() { const c = $('#dv-chips'); if (c) c.innerHTML = chipsHtml(S.set.prio); const p = $('#dv-pn'); if (p) p.textContent = `${new Set(parsePrio(S.set.prio)).size} db`; AFTER.setd(); },
    setd() {
      const s = S.set; if (!s || !s.row) return;
      const r = $('#dv-saveramp'); if (r) r.disabled = String(s.ramp) === String(s.row.ramp_count ?? '');
      const p = $('#dv-saveprio'); if (p) p.disabled = [...new Set(parsePrio(s.prio))].join('\n') === (s.row.priority || []).join('\n');
    }
  };

  function onInput(e) {
    const el = e.target, ds = el.dataset, d = S.draft;
    if (!ds) return;
    if (ds.p) {
      let v = ds.ty === 'b' ? el.checked : el.value;
      if (ds.ty === 'u') {
        v = v.toUpperCase();
        if (el.value !== v) { const s = el.selectionStart; el.value = v; try { el.setSelectionRange(s, s); } catch (_) { /* nincs teendő */ } }
      }
      setP(ds.p, v);
    } else if (ds.ov && d) {
      const k = ds.ov; let v = el.value;
      if (ds.ty === 'n') v = v === '' ? '' : Number(v);
      if (v === '' || (typeof v === 'number' && Number.isNaN(v))) delete d.ov[k]; else d.ov[k] = v;
      syncFr(el.closest('.dv-fr'));
    } else if (ds.ms && d) {
      if (el.value) msSet(d, ds.ms, ovTs(el.value));
    } else if (ds.eta && d) {
      const box = el.closest('.dv-eta'), dv = box.querySelector('[data-eta="date"]').value, tv = box.querySelector('[data-eta="time"]').value;
      d.ov.eta = !dv && !tv ? false : { date: dv, time: tv };
    } else return;
    if (ds.after && AFTER[ds.after]) AFTER[ds.after](el);
    if (ds.rr) renderEditor();
    updateDirty();
  }
  // Egy felülírható sor „auto” szövege és ↺ gombja gépelés közben, újrarajzolás nélkül frissül.
  function syncFr(row) {
    if (!row || !S.draft) return;
    const k = row.dataset.key, has = k in S.draft.ov;
    const rs = row.querySelector('.dv-rs'); if (rs) rs.hidden = !has;
    const au = row.querySelector('.dv-auto'); if (au) au.hidden = !(has && String(row.dataset.av) !== String(S.draft.ov[k] ?? ''));
  }

  const TPL = { pdd: () => ({ no: '', ctns: '', kg: '' }), cont: () => c2f({}), eta: () => ({ container: '', date: '', time: '' }) };
  const RUN = {
    clearov: id => clearOverride(id, false),
    delcont: id => clearOverride(id, true),
    delmsg: id => delRow('messages', 'msg', id),
    delarr: id => delRow('arrivals', 'arr', id),
    delsto: id => delRow('storage_events', 'sto', id),
    delramp: async ramp => {
      const row = S.sys.glr.find(r => String(r.ramp) === String(ramp));
      const r = await write('glabs_ramps', ramp, 'delete', row || null, null);
      if (r.ok) { S.sys.glr = S.sys.glr.filter(x => String(x.ramp) !== String(ramp)); renderSys(); }
    },
    restore: id => restore(id)
  };
  async function delRow(tbl, tab, id) {
    let fresh;
    try { fresh = await getRow(tbl, id); } catch (e) { return bad('Nem olvasható a sor'); }
    const r = await write(tbl, id, 'delete', fresh, null);
    if (!r.ok) return;
    uncache(tab, id);
    S.draft = null; counts(); renderList(); renderEditor(); renderNav();
  }

  const ACT = {
    close: () => close(),
    refresh: () => refresh(),
    tab: t => setTab(t.dataset.k),
    sort: t => { const k = t.dataset.k; S.cs = S.cs.k === k ? { k, d: -S.cs.d } : { k, d: 1 }; renderList(); },
    per: t => { S.cf.per = t.dataset.k; t.parentElement.querySelectorAll('button').forEach(b => { const on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }); renderList(); },
    stagechip: t => { S.af.stage = t.dataset.k; document.querySelectorAll('#dev [data-dv="stagechip"]').forEach(b => { const on = b.dataset.k === S.af.stage; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); renderList(); },
    manonly: t => { S.cf.man = !S.cf.man; t.classList.toggle('on', S.cf.man); t.setAttribute('aria-pressed', S.cf.man); renderList(); },
    pick: t => pick(S.tab, t.dataset.id),
    newcont: () => newDraft('cont'), newmsg: () => newDraft('msg'), newarr: () => newDraft('arr'), newsto: () => newDraft('sto'),
    newbulk: () => go(() => { S.draft = newBulk(); renderList(); renderEditor(); }),
    save: () => saveDraft(),
    discard: () => { const d = S.draft; if (!d) return; S.draft = d.isNew || d.kind === 'new' ? null : (d.kind === 'cont' ? mkCont(d.id) : mkDraft(d.tab, d.id)); renderList(); renderEditor(); renderNav(); },
    back: () => go(() => { S.draft = null; S.sel.log = null; renderList(); renderEditor(); renderNav(); }),
    setstep: t => { const d = S.draft; setStep(d, autoMap()[d.id], t.dataset.k); renderEditor(); updateDirty(); },
    stepauto: () => { const d = S.draft; delete d.ov.arrived; delete d.ov.stages; renderEditor(); updateDirty(); },
    rmsw: () => {
      const d = S.draft, A = autoMap()[d.id], autoRm = A ? A.state === 'removed' : false;
      const now = d.ov.state ? d.ov.state === 'removed' : autoRm;
      if (!now) { if (autoRm) delete d.ov.state; else d.ov.state = 'removed'; } else if (autoRm) d.ov.state = 'active'; else delete d.ov.state;
      renderEditor(); updateDirty();
    },
    reset: t => { const d = S.draft, k = t.dataset.k; delete d.ov[k]; if (k === 'src') delete d.ov.fwd; renderEditor(); },
    ovsrc: t => { const d = S.draft, v = t.dataset.v; if (v) { d.ov.src = v; d.ov.fwd = SRC_NAME[v]; } else { delete d.ov.src; delete d.ov.fwd; } renderEditor(); },
    setp: t => {
      setP(t.dataset.p, t.dataset.v);
      t.parentElement.querySelectorAll('button').forEach(b => { const on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      updateDirty();
    },
    logchip: t => {
      S.lf.tbl = t.dataset.k;
      dlg.querySelectorAll('[data-dv="logchip"]').forEach(b => { const on = b.dataset.k === S.lf.tbl; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      AFTER.log();
    },
    pddov: () => { const d = S.draft, c = C()[d.id]; d.ov.pdd = clone(c.pdd || []).map(p => ({ no: p.no, ctns: p.ctns, kg: p.kg })); renderEditor(); },
    radd: t => { const a = getP(t.dataset.path); if (Array.isArray(a)) a.push(TPL[t.dataset.tpl]()); renderEditor(); updateDirty(); },
    rrm: t => { const a = getP(t.dataset.path); if (Array.isArray(a)) a.splice(Number(t.dataset.i), 1); renderEditor(); updateDirty(); },
    sheet: t => { const id = t.dataset.id; go(() => { hideGuard(); S.draft = null; dlg.close(); K.openSheet(id); }); },
    go: t => { const tab = t.dataset.tab; jump(tab, t.dataset.id); },
    jmode: t => {
      const d = S.draft, toJson = t.dataset.v === 'j';
      if (toJson === d.jm) return;
      if (toJson) {
        try { d.jc = jstr(d.f.containers.map(r => f2c(r, false))); d.je = jstr(d.f.etas.filter(e => e.container.trim()).map(e => ({ container: upper(e.container).trim(), date: e.date || '', time: e.time || null }))); } catch (e) { return bad('Nem alakítható JSON-ná'); }
        d.jm = true;
      } else {
        try {
          const c = JSON.parse(d.jc || '[]'), e = JSON.parse(d.je || '[]');
          if (!Array.isArray(c) || !Array.isArray(e)) throw new Error('Tömb kell');
          d.f.containers = c.map(c2f); d.f.etas = e.map(etaIn);
        } catch (err) { return bad(`Hibás JSON: ${err.message}`); }
        d.jm = false; d.jc = d.je = '';
      }
      renderEditor();
    },
    copymsg: () => { const d = S.draft; go(() => { hideGuard(); S.draft = newMsg(d); renderList(); renderEditor(); }); },
    step: t => { const s = S.set; const n = Math.min(99, Math.max(1, (Number(s.ramp) || 0) + Number(t.dataset.n))); s.ramp = String(n); $('#dv-ramp').value = n; AFTER.setd(); },
    saveramp: () => saveRamp(), saveprio: () => savePrio(),
    syncerr: () => sysPatch({ error: null }),
    syncnow: () => sysPatch({ last_ok: new Date().toISOString() }),
    reloadall: async t => { t.disabled = true; await K.reload(); S.autoFor = null; await loadSys(); counts(); t.disabled = false; say('Újratöltve'); },
    export: t => { t.disabled = true; exportAll().finally(() => { t.disabled = false; }); },
    logmore: async t => { t.disabled = true; try { await moreLog(); } catch (e) { bad('Betöltési hiba'); } renderList(); },
    ask: t => {
      const s = document.createElement('span');
      s.className = 'dv-confirm'; s.setAttribute('role', 'group');
      s.innerHTML = `<span>${esc(t.dataset.msg)}</span><button type="button" class="dv-danger" data-dv="do" data-run="${esc(t.dataset.run)}" data-arg="${esc(t.dataset.arg)}">${esc(t.dataset.yes)}</button><button type="button" class="btn-ghost sm" data-dv="cancel">Mégse</button>`;
      s._orig = t; t.replaceWith(s);
      s.querySelector('button').focus();
    },
    do: t => { const f = RUN[t.dataset.run]; t.disabled = true; if (f) Promise.resolve(f(t.dataset.arg)).catch(e => { console.error(e); bad('A művelet nem sikerült'); }); },
    cancel: t => { const s = t.closest('.dv-confirm'); if (s && s._orig) { s.replaceWith(s._orig); s._orig.focus(); } },
    gsave: async () => { const ok = await saveDraft(); if (ok && !isDirty()) { const f = S.pend; hideGuard(); if (f) f(); } },
    gdisc: () => { const f = S.pend; S.draft = null; hideGuard(); renderNav(); if (f) f(); },
    gcancel: () => hideGuard()
  };
  function onClick(e) {
    const t = e.target.closest('[data-dv]');
    if (!t || !dlg.contains(t) || t.disabled) return;
    const h = ACT[t.dataset.dv];
    if (h) { e.preventDefault(); h(t, e); }
  }
  function onKey(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); saveDraft(); return; }
    const t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && (t.tagName === 'TR' || t.tagName === 'TH') && t.dataset.dv) { e.preventDefault(); ACT[t.dataset.dv](t, e); return; }
    if (t.closest && t.closest('.dv-nav') && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      const tabs = [...dlg.querySelectorAll('.dv-tab')], i = tabs.indexOf(t);
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 1) + tabs.length) % tabs.length;
      e.preventDefault(); tabs[n].focus();
    }
  }

  window.KFDev = { open, close };
})();
