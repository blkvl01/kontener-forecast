(() => {
  'use strict';

  const DOW = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
  const DOW_S = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
  const MON = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
  const MON_S = ['jan', 'febr', 'márc', 'ápr', 'máj', 'jún', 'júl', 'aug', 'szept', 'okt', 'nov', 'dec'];
  const ST_LABEL = { pre: 'Bejelentve', t1: 'Kamion + T1', eta: 'ETA rögzítve', arrived: 'Megérkezett', removed: 'Kikerült' };

  const IC = {
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    up: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    refresh: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 21v-5h-5"/></svg>',
    sliders: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
    arrow: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>',
    go: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    mail: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>',
    warn: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    open: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.4 0.015 255)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
  };

  // ---------- segédek ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const dowIdx = s => (parse(s).getDay() + 6) % 7;
  const mondayOf = s => addDays(s, -dowIdx(s));
  const isoWeek = s => {
    const d = parse(s);
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - y0) / 86400000 + 1) / 7);
  };
  const short = s => { const d = parse(s); return `${pad(d.getMonth() + 1)}.${pad(d.getDate())}.`; };
  const longLabel = s => { const d = parse(s); return `${MON[d.getMonth()]} ${d.getDate()}.`; };
  const group = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const fmtInt = n => group(String(Math.round(n || 0)));
  const fmtDec = (n, min, max) => {
    const [i, f] = (n || 0).toFixed(max).split('.');
    let frac = (f || '').replace(/0+$/, '');
    while (frac.length < min) frac += '0';
    return group(i) + (frac ? ',' + frac : '');
  };
  const fmtT = kg => fmtDec((kg || 0) / 1000, 1, 1) + ' t';
  const fmtKg = kg => fmtDec(kg || 0, 0, 2);
  const hm = ts => (ts ? ts.slice(11, 16) : '');
  const stamp = ts => (ts ? `${short(ts.slice(0, 10))} ${hm(ts)}` : '');
  const plate = p => (p || '').replace(/\s*\/\s*/g, ' / ');
  const toH = t => { const [h, m] = t.split(':').map(Number); return h + m / 60; };
  const nowIso = () => { const d = new Date(); return `${iso(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };

  // ---------- állapot ----------
  const S = { statsDays: 28, q: '', data: null, view: 'week', week: null, sel: null, month: null, calSel: null, drawer: null, pending: false, today: null, pdir: 0 };
  const CFG = window.KF_CONFIG;
  const sb = window.supabase.createClient(CFG.url, CFG.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  let ME = null;
  let MSGS = [];
  let MAN = {};
  let ARR = [];
  let STO = [];
  let RAMPS = 10;
  let MEMBERS = {};
  const who = email => (email && MEMBERS[email]) || email || '';
  const ROLE_L = { admin: 'Admin', editor: 'Szerkesztő', worker: 'Dolgozó' };
  const isWorker = () => !!(ME && ME.role === 'worker');
  let SYNC = null;
  let LAST_OK = null;
  let LOCAL = null;
  let channel = null;

  const isExe = () => !!(window.pywebview && window.pywebview.api && window.pywebview.api.auto_login);
  const exe = () => window.pywebview.api;
  const toLocal = ts => {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d)) return '';
    return `${iso(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const normMsg = r => ({ ...r, received: toLocal(r.received) });
  const normMan = r => ({
    eta_date: r.eta_date || '', eta_time: r.eta_time || '', eta_for: r.eta_for || '',
    eta_set: toLocal(r.eta_set), arrived: !!r.arrived, arrived_at: toLocal(r.arrived_at),
    ramp: r.ramp || null, ramp_set: toLocal(r.ramp_set),
    note: r.note || '', updated_by: r.updated_by || '', updated_at: toLocal(r.updated_at),
    auto_dismissed: !!r.auto_dismissed
  });
  const normArr = r => ({ ...r, received: toLocal(r.received) });

  function rebuild() {
    const d = window.KFDerive(MSGS, MAN, ARR, STO);
    d.now = nowIso();
    S.data = d;
    S.today = d.now.slice(0, 10);
    if (!S.sel) {
      S.sel = S.today;
      S.week = mondayOf(S.today);
      S.month = S.today.slice(0, 7);
      S.calSel = S.today;
    }
  }

  // ---------- mozgás ----------
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const VIEWS = ['week', 'month', 'stats'];
  const ZONES = { week: 'yard main', month: 'cal side', stats: 'stats' };
  const canFly = () => !RM.matches && !document.hidden && !!Element.prototype.animate;

  // Repülő másolat (FLIP): egy rögzített pozíciójú klón GPU-n mozog a cél helyére.
  // A View Transition API-t szándékosan nem használjuk: minden indításkor és végén az egész oldal stílusát újraszámolja.
  function flyClone(from, keyframes, ms, easing = 'cubic-bezier(.16,1,.3,1)') {
    const r = from.getBoundingClientRect();
    const c = from.cloneNode(true);
    c.removeAttribute('style');
    c.classList.add('ct-flyer');
    Object.assign(c.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(c);
    const a = c.animate(keyframes(r), { duration: ms, easing, fill: 'forwards' });
    a.finished.then(() => c.remove(), () => c.remove());
    return a;
  }
  const flyTo = to => r => [{ transform: 'none' }, { transform: `translate(${to.left - r.left}px, ${to.top - r.top}px) scale(${to.width / r.width})` }];

  // Darus szállítás: a kampón lógó konténer felemelkedik, a futómacska átviszi, a célnál leereszkedik, rugózik, a kampó kiold.
  // Három egymásba ágyazott réteg (X, Y + méret, lengés), mindegyik külön transform-animáció.
  // grab: a kampónak előbb le kell ereszkednie (nem volt felemelve); hold(): lerakáskor a kártya saját daruja veszi át,
  // ilyenkor nincs kioldás. A visszatérő ígéret a lerakáskor teljesül.
  function craneFly(svg, to, ms, grab = 0, hold = () => false) {
    const r = svg.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'ct-flyer crane';
    Object.assign(f.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    f.innerHTML = `<div class="cr-y"><div class="cr-sw">${HOIST}</div></div>`;
    const ct = svg.cloneNode(true);
    ct.removeAttribute('style');
    ct.classList.remove('ct-grow', 'ct-lg');
    const sw = f.querySelector('.cr-sw');
    sw.appendChild(ct);
    document.body.appendChild(f);
    const hk = f.querySelector('.hk');
    const dx = to.left - r.left, dy = to.top - r.top, s = to.width / r.width;
    const peak = Math.max(14, Math.min(r.top, to.top) - 64) - r.top;
    const k = p => (1 + (s - 1) * p).toFixed(4);
    const dir = Math.sign(dx) || 1, a = Math.min(5, Math.max(1.6, Math.abs(dx) / 110));
    const opt = (o = {}) => ({ duration: ms, delay: grab, easing: 'linear', fill: 'both', ...o });
    if (grab) hk.animate([{ transform: 'translateY(-70%)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'none', opacity: 1 }], { duration: grab, easing: 'cubic-bezier(.3,1.35,.5,1)', fill: 'backwards' });
    f.querySelector('.cr-y').animate([
      { transform: `translateY(0) scale(1)`, easing: 'cubic-bezier(.4,0,.25,1)' },
      { transform: `translateY(${peak}px) scale(${k(.12)})`, offset: .3, easing: 'linear' },
      { transform: `translateY(${peak}px) scale(${k(.6)})`, offset: .55, easing: 'cubic-bezier(.45,0,.3,1)' },
      { transform: `translateY(${dy + 4}px) scale(${s})`, offset: .9, easing: 'cubic-bezier(.3,0,.4,1)' },
      { transform: `translateY(${dy}px) scale(${s})` },
    ], opt());
    f.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], opt({ duration: ms * .58, delay: grab + ms * .16, easing: 'cubic-bezier(.6,0,.3,1)' }));
    // Gyorsuláskor a teher lemarad, fékezéskor előrelendül, majd lecsillapodik.
    sw.animate([
      { transform: 'rotate(0deg)', offset: 0 }, { transform: 'rotate(0deg)', offset: .16 },
      { transform: `rotate(${a * dir}deg)`, offset: .3 }, { transform: `rotate(${a * .25 * dir}deg)`, offset: .5 },
      { transform: `rotate(${-a * .85 * dir}deg)`, offset: .7 }, { transform: `rotate(${a * .3 * dir}deg)`, offset: .84 },
      { transform: `rotate(${-a * .1 * dir}deg)`, offset: .94 }, { transform: 'rotate(0deg)', offset: 1 },
    ], opt({ easing: 'ease-in-out' }));
    const landed = sleep(grab + ms);
    landed.then(() => {
      if (hold()) { f.remove(); return; }
      ct.style.opacity = '0';
      f.classList.add('rel');
      hk.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-60%)', opacity: 1, offset: .6 }, { transform: 'translateY(-90%)', opacity: 0 }], { duration: 380, delay: 120, easing: 'cubic-bezier(.55,0,.6,1)', fill: 'both' })
        .finished.finally(() => f.remove());
    });
    return landed;
  }

  // Csúszó jelölők a heti sávban (kiválasztott nap) és a naptárban (kiválasztott cella).
  function placeDayInd() {
    const days = $('#view .days');
    if (!days) return;
    const i = [...days.querySelectorAll('.day')].findIndex(b => b.dataset.date === S.sel);
    days.style.setProperty('--di', String(Math.max(0, i)));
    days.classList.toggle('no-sel', i < 0);
  }
  function placeCalInd(animate) {
    const ind = $('#view .cal-ind');
    const cell = ind && $(`#view .cell[data-date="${S.calSel}"]`);
    if (!cell) { if (ind) ind.style.opacity = '0'; return; }
    if (!animate) ind.style.transition = 'none';
    Object.assign(ind.style, { opacity: '', width: `${cell.offsetWidth}px`, height: `${cell.offsetHeight}px`, translate: `${cell.offsetLeft}px ${cell.offsetTop}px` });
    if (!animate) { void ind.offsetWidth; ind.style.transition = ''; }
  }

  const FMT = { int: v => fmtInt(v), t: v => fmtT(v), d1: v => fmtDec(v, 0, 1), dur: v => fmtDur(v) };
  const num = (v, f = 'int', d = 0) => `<span class="cnt" data-n="${v}" data-f="${f}" data-d="${d}">${FMT[f](v)}</span>`;

  // Számlálás nulláról a végértékig; az alapállapot a végérték, így hiba esetén is helyes szám látszik.
  // Egyetlen képkocka-ciklus az összes számlálónak, és csak akkor ír a DOM-ba, ha a kiírt szöveg változik.
  function countUp(root, offset = 0) {
    if (RM.matches || document.hidden) return;
    const items = [];
    const base = performance.now() + offset;
    root.querySelectorAll('[data-n]').forEach(el => {
      if (el.closest('.await')) return;
      const to = Number(el.dataset.n), f = FMT[el.dataset.f] || FMT.int;
      if (!to) return;
      const last = f(0);
      el.textContent = last;
      items.push({ el, to, f, t0: base + Number(el.dataset.d || 0), last });
    });
    if (!items.length) return;
    const dur = 750;
    const step = now => {
      let live = false;
      for (const it of items) {
        const k = Math.min(1, Math.max(0, (now - it.t0) / dur));
        const txt = it.f(k >= 1 ? it.to : it.to * (1 - Math.pow(2, -10 * k)));
        if (txt !== it.last) { it.el.textContent = txt; it.last = txt; }
        if (k < 1) live = true;
      }
      if (live) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // A hajtás alatti diagramok, táblák csak láthatóvá váláskor indulnak.
  let revealIO = null;
  function awaitReveal(root) {
    if (!('IntersectionObserver' in window) || RM.matches) return;
    if (revealIO) revealIO.disconnect();
    revealIO = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('rv');
      e.target.classList.remove('await');
      revealIO.unobserve(e.target);
      countUp(e.target);
    }), { rootMargin: '0px 0px -6% 0px' });
    root.querySelectorAll('[data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.94) { el.classList.add('await'); revealIO.observe(el); }
    });
  }

  // Élő frissítésnél a megváltozott konténerek felvillannak.
  let LAST_SIG = null;
  const PREV_P = {};
  const sigOf = c => [phase(c).key, c.eta_time, c.arrived ? 1 : 0, lateInfo(c) ? 1 : 0, c.ramp || '', c.day, c.state].join('|');
  function diffFlash(entering) {
    const now = {};
    all().forEach(c => { now[c.id] = sigOf(c); });
    const prev = LAST_SIG;
    LAST_SIG = now;
    if (!prev || entering) return;
    Object.keys(now).forEach(id => {
      if (prev[id] === now[id]) return;
      const late = now[id].split('|')[3] === '1' && (!prev[id] || prev[id].split('|')[3] !== '1');
      document.querySelectorAll(`#view [data-id="${CSS.escape(id)}"]:is(.blk, .ccard, .tr, .side-item, .dock, .pill, .pl)`).forEach(el => {
        el.classList.add(late ? 'flash-late' : 'flash');
      });
    });
  }
  function rememberP() {
    all().forEach(c => { PREV_P[c.id] = phase(c).p; });
  }

  async function fetchAll(table, order) {
    const out = [];
    for (let from = 0; ; from += 1000) {
      let q = sb.from(table).select('*').range(from, from + 999);
      if (order) q = q.order(order, { ascending: true });
      const { data, error } = await q;
      if (error) throw error;
      out.push(...data);
      if (data.length < 1000) break;
    }
    return out;
  }

  async function loadAll(enter) {
    let done = 0;
    const tick = p => Promise.resolve(p).then(v => { bootProgress(0.25 + 0.6 * (++done / 7)); return v; });
    const [msgs, man, arr, sync, cfg, mem, sto] = await Promise.all([
      fetchAll('messages', 'received'),
      fetchAll('manual'),
      fetchAll('arrivals', 'received'),
      sb.from('sync_status').select('*').eq('id', 1).maybeSingle(),
      sb.from('app_settings').select('*').eq('id', 1).maybeSingle(),
      sb.from('members').select('email, name'),
      fetchAll('storage_events', 'stored_at')
    ].map(tick));
    STO = sto.map(r => ({ ...r, stored_at: toLocal(r.stored_at) }));
    if (mem.data) MEMBERS = Object.fromEntries(mem.data.map(m => [m.email, m.name || m.email]));
    if (cfg.data) RAMPS = cfg.data.ramp_count || 10;
    MSGS = msgs.map(normMsg);
    MAN = Object.fromEntries(man.map(r => [r.container, normMan(r)]));
    ARR = arr.map(normArr);
    SYNC = sync.data || null;
    rebuild();
    render(enter);
  }

  let renderTimer = null;
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      rebuild();
      if (editing()) { S.pending = true; renderSync(); return; }
      render();
    }, 250);
  }

  function subscribe() {
    if (channel) sb.removeChannel(channel);
    channel = sb.channel('kf-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'manual' }, p => {
        if (p.eventType === 'DELETE') delete MAN[p.old.container];
        else MAN[p.new.container] = normMan(p.new);
        scheduleRender();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, p => {
        if (p.eventType === 'DELETE') MSGS = MSGS.filter(m => m.id !== p.old.id);
        else {
          const m = normMsg(p.new);
          const i = MSGS.findIndex(x => x.id === m.id);
          if (i >= 0) MSGS[i] = m; else MSGS.push(m);
        }
        scheduleRender();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'arrivals' }, p => {
        if (p.eventType === 'DELETE') ARR = ARR.filter(a => a.id !== p.old.id);
        else {
          const a = normArr(p.new);
          const i = ARR.findIndex(x => x.id === a.id);
          if (i >= 0) ARR[i] = a; else ARR.push(a);
        }
        scheduleRender();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'storage_events' }, p => {
        if (!STO.some(s => s.id === p.new.id)) STO.push({ ...p.new, stored_at: toLocal(p.new.stored_at) });
        scheduleRender();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, p => {
        if (p.new && p.new.ramp_count) { RAMPS = p.new.ramp_count; scheduleRender(); }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sync_status' }, p => {
        if (p.new) SYNC = p.new;
        renderSync();
      })
      .subscribe();
  }

  async function upsertManual(row) {
    const { data, error } = await sb.from('manual').upsert(row, { onConflict: 'container' }).select().single();
    if (error) { toast('A mentés nem sikerült'); console.error(error); return false; }
    MAN[data.container] = normMan(data);
    rebuild();
    render();
    return true;
  }

  function editing() {
    const a = document.activeElement;
    if ($('#settings').open || $('#paste').open || $('#people').open) return true;
    if (a && a.id === 'q') return false;
    return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA') && a.closest('#view, #drawer'));
  }

  window.KF = {
    async reload() {
      if (!isExe()) return;
      try { LOCAL = await exe().agent_status(); } catch (_) { LOCAL = null; }
      renderSync();
    }
  };

  function waitExe(ms) {
    return new Promise(resolve => {
      const t0 = Date.now();
      (function poll() {
        if (window.pywebview && window.pywebview.api && window.pywebview.api.auto_login) return resolve(true);
        if (Date.now() - t0 > ms) return resolve(false);
        setTimeout(poll, 100);
      })();
    });
  }

  // ---------- belépés ----------
  async function usersFn(action, body = {}) {
    const { data: { session } } = await sb.auth.getSession();
    const res = await fetch(`${CFG.url}/functions/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CFG.key,
        Authorization: `Bearer ${session ? session.access_token : CFG.key}`
      },
      body: JSON.stringify({ action, ...body })
    });
    let out = {};
    try { out = await res.json(); } catch (_) { /* üres válasz */ }
    if (!res.ok) throw new Error(out.error || 'A kérés nem sikerült.');
    return out;
  }

  // ---------- nyitó animáció ----------
  let booted = false;
  let BOOT_SEEN = false;
  try { BOOT_SEEN = sessionStorage.getItem('kf-boot') === '1'; } catch (_) { /* privát mód */ }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // A töltöttség a betöltés ütemét követi, de az első nyitáskor legfeljebb az idővel arányosan nő,
  // így gyors hálózaton sem ugrik egyből tele a konténer. (performance.now() a lapbetöltés óta eltelt idő.)
  // Szerepkörönként más a belépő (data-bi), ezért más a töltés kezdete és hossza is; a dolgozónál kartonok jelzik.
  const BOOT_IN = document.documentElement.getAttribute('data-bi') || 'editor';
  const BOOT_RAMP = { editor: [420, 900], admin: [820, 1000], worker: [650, 750] }[BOOT_IN] || [420, 900];
  const BOOT_LOAD = [1, 0, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12];
  let bootTarget = 0, bootShown = 0, bootRaf = 0, bootCells = 0;
  function bootProgress(f) {
    bootTarget = Math.max(bootTarget, f);
    if (!bootRaf) bootRaf = requestAnimationFrame(bootTick);
  }
  function bootTick(now) {
    bootRaf = 0;
    const b = $('#boot');
    if (!b) return;
    const ramp = BOOT_SEEN || RM.matches ? 1 : Math.min(1, 0.1 + 0.9 * Math.max(0, (now - BOOT_RAMP[0]) / BOOT_RAMP[1]));
    const goal = Math.min(bootTarget, ramp);
    bootShown += (goal - bootShown) * 0.16;
    if (goal - bootShown < 0.002) bootShown = goal;
    const p = bootShown.toFixed(4);
    $('#boot-fill').style.transform = `scaleX(${p})`;
    $('#boot-edge').style.transform = `translateX(${(p * 100).toFixed(2)}%)`;
    const n = Math.round(bootShown * BOOT_LOAD.length);
    if (n > bootCells) {
      const cells = $('#boot-load').children;
      for (; bootCells < n; bootCells++) cells[BOOT_LOAD[bootCells]].classList.add('on');
    }
    if (bootShown < bootTarget) bootRaf = requestAnimationFrame(bootTick);
  }

  // Szerepkör szerint: a belépés után már a valódi szín és kilépő (data-br), legközelebb ezzel indul a belépő is.
  function bootRole(role) {
    const r = role === 'admin' || role === 'worker' ? role : 'editor';
    document.documentElement.setAttribute('data-br', r);
    try { localStorage.setItem('kf-role', r); } catch (_) { /* privát mód */ }
  }

  // Dolgozó: blokkolókártya a mai nappal, a mostani időponttal és a mai konténerek számával.
  function bootCard() {
    const d = new Date();
    $('#bc-day').textContent = `${DOW[(d.getDay() + 6) % 7]} ${short(iso(d))}`;
    $('#bc-time').textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const n = S.data && S.today ? onDay(S.today).length : null;
    $('#bc-n').innerHTML = n === null ? '' : `<b>${n}</b>konténer`;
  }

  // A konténer a betöltés ütemében telik meg, utána a daru kiemeli, a redőnykapu felgördül.
  async function bootExit(apply, mode) {
    const b = $('#boot');
    if (booted || !b) { apply(); return; }
    booted = true;
    try { sessionStorage.setItem('kf-boot', '1'); } catch (_) { /* privát mód */ }
    const fast = RM.matches || document.hidden;
    const role = document.documentElement.getAttribute('data-br') || 'editor';
    const min = { editor: [1380, 600], admin: [2000, 1000], worker: [1450, 650] }[role] || [1380, 600];
    bootProgress(1);
    await sleep(Math.max(fast ? 0 : 200, (fast ? 0 : BOOT_SEEN ? min[1] : min[0]) - performance.now()));
    for (let k = 0; k < 30 && !fast && !document.hidden && bootShown < 0.99; k++) await sleep(30);
    // Kilépő előtti pillanat: admin „élesít”, dolgozó blokkol.
    if (!fast && role === 'admin') { b.classList.add('lock'); await sleep(460); }
    if (!fast && role === 'worker' && mode === 'app') { bootCard(); b.classList.add('stamp'); await sleep(BOOT_SEEN ? 700 : 950); }
    apply();
    b.classList.add('out');
    if (mode === 'app') {
      const app = $('#app');
      app.classList.add('boot-in');
      app.classList.remove('boot-wait');
      awaitReveal($('#view'));
      countUp($('#view'), fast ? 0 : 320);
      setTimeout(() => app.classList.remove('boot-in'), 2400);
    }
    setTimeout(() => b.remove(), fast ? 0 : role === 'admin' ? 900 : 1100);
  }

  function showAuth(mode, info) {
    if (mode === 'loading') return;
    bootExit(() => {
      $('#auth').hidden = mode === 'app';
      $('#app').hidden = mode !== 'app';
      $('#invite').hidden = mode !== 'invite';
      $('#denied').hidden = mode !== 'denied';
      if (mode === 'invite' && info) $('#invite-text').textContent = info;
      if (mode === 'denied') $('#denied-text').textContent = 'Ez a hozzáférés megszűnt. Kérj új meghívó linket az admintól.';
    }, mode);
  }

  async function enter(session) {
    bootProgress(0.2);
    const email = (session.user.email || '').toLowerCase();
    const { data, error } = await sb.from('members').select('email, role, name').eq('email', email).maybeSingle();
    if (error || !data) { showAuth('denied', email); return; }
    ME = data;
    bootRole(ME.role);
    document.body.classList.toggle('role-worker', isWorker());
    sb.rpc('touch_me').then(() => {}, () => {});
    setInterval(() => sb.rpc('touch_me').then(() => {}, () => {}), 5 * 60000);
    // Az alkalmazás már a nyitó réteg alatt kirajzolódik (az első elrendezés és szövegformázás itt fut le),
    // az animációi a redőny felhúzásáig szünetelnek.
    const app = $('#app');
    app.classList.add('boot-wait');
    app.hidden = false;
    await loadAll('boot ' + ZONES[S.view]);
    showAuth('app');
    subscribe();
    window.KF.reload();
  }

  async function bootAuth() {
    bootProgress(0.08);
    try {
      const key = (location.hash.match(/[#&]k=([\w-]{20,})/) || [])[1];
      if (key) {
        history.replaceState(null, '', location.pathname + location.search);
        try {
          const r = await usersFn('redeem', { key });
          const { data, error } = await sb.auth.verifyOtp({ token_hash: r.token_hash, type: 'email' });
          if (error || !data.session) throw error || new Error('');
          await enter(data.session);
          toast(`Üdv, ${r.name}!`);
          return;
        } catch (err) {
          showAuth('invite', err && err.message ? err.message : 'Ez a link már nem érvényes. Kérj újat az admintól.');
          return;
        }
      }
      const { data: { session } } = await sb.auth.getSession();
      if (session) { await enter(session); return; }
      if (await waitExe(2500)) {
        const r = await exe().auto_login();
        if (r && r.token_hash) {
          const { data, error } = await sb.auth.verifyOtp({ token_hash: r.token_hash, type: 'email' });
          if (!error && data.session) { await enter(data.session); return; }
        }
      }
      showAuth('invite');
    } catch (e) {
      console.error(e);
      showAuth('invite', 'A szerver nem érhető el. Ellenőrizd az internetkapcsolatot.');
    }
  }

  // ---------- adatlekérdezés ----------
  const all = () => Object.values(S.data ? S.data.containers : {});
  const ORDER = { arrived: 0, eta: 1, t1: 2, pre: 3 };
  const byEta = (a, b) => {
    const ea = a.eta_time || '99:99', eb = b.eta_time || '99:99';
    if (a.status === 'arrived' && b.status !== 'arrived') return -1;
    if (b.status === 'arrived' && a.status !== 'arrived') return 1;
    if (ea !== eb) return ea < eb ? -1 : 1;
    if (ORDER[a.status] !== ORDER[b.status]) return ORDER[a.status] - ORDER[b.status];
    return a.id < b.id ? -1 : 1;
  };
  const onDay = d => all().filter(c => c.state === 'active' && c.day === d).sort(byEta);
  const removedOn = d => all().filter(c => c.state === 'removed' && c.removed_from === d).sort((a, b) => (a.id < b.id ? -1 : 1));
  const movedOut = d => all().filter(c => c.state === 'active' && c.moved_from === d && c.date !== d);
  const hasForecast = d => (S.data.forecast_dates || []).includes(d);
  const sumKg = l => l.reduce((s, c) => s + (c.kg || 0), 0);
  const sumCt = l => l.reduce((s, c) => s + (c.ctns || 0), 0);

  // ---------- render ----------
  // enter: belépő zónák szóközzel ('boot', 'yard', 'main', 'cal', 'side', 'stats'); üresen nincs belépő animáció.
  function render(enter) {
    if (!S.data) return;
    renderTabs();
    renderPeriod();
    renderSync();
    const v = $('#view');
    v.className = enter ? enter.split(' ').map(z => `ev-${z}`).join(' ') : '';
    v.innerHTML = S.view === 'week' ? weekView() : S.view === 'month' ? monthView() : statsView();
    if (S.view === 'month') placeCalInd(false);
    renderDrawer();
    if (enter && !$('#app').hidden && !$('#app').classList.contains('boot-wait')) {
      awaitReveal(v);
      // Csak a belépő zónák számai számolnak fel; a helyben maradó részek nem villannak.
      const roots = { yard: '.yard', main: '.main', cal: '.month-main', side: '.side', stats: '.statsv' };
      enter.split(' ').forEach(z => { if (roots[z]) v.querySelectorAll(roots[z]).forEach(r => countUp(r)); });
    }
    diffFlash(!!enter);
    rememberP();
    S.pending = false;
  }

  // A kijelölt fül/időszak alatti csúszó jelölő: egyetlen kis elem, CSS-átmenettel mozog (nincs nézetváltás-pillanatkép).
  function placeInd(group, active, animate) {
    const ind = group && group.querySelector('.tab-ind');
    if (!ind || !active || !active.offsetWidth) return;
    if (!animate) ind.style.transition = 'none';
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.transform = `translateX(${active.offsetLeft}px)`;
    if (!animate) { void ind.offsetWidth; ind.style.transition = ''; }
  }

  let tabsPlaced = false;
  function renderTabs() {
    document.querySelectorAll('.tab').forEach(t => {
      if (t.dataset.view === S.view) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    const nav = $('.tabs');
    placeInd(nav, nav.querySelector('[aria-current="page"]'), tabsPlaced);
    tabsPlaced = tabsPlaced || !!nav.querySelector('.tab-ind').style.width;
  }
  if ('ResizeObserver' in window) {
    // Csak szélességváltozásra igazít (a magasság minden panelcserénél változik, az ne szakítsa meg a csúszást).
    let roW = '';
    const ro = new ResizeObserver(() => {
      const w = `${$('.tabs').offsetWidth}:${$('#view').offsetWidth}`;
      if (w === roW) return;
      roW = w;
      placeInd($('.tabs'), $('.tabs [aria-current="page"]'), false);
      placeInd($('#period .seg'), $('#period .seg-btn[aria-pressed="true"]'), false);
      placeCalInd(false);
    });
    ro.observe($('.tabs'));
    ro.observe($('#view'));
  }

  // Az időszaksáv helyben frissül: a 7/28/90 jelölő csúszik, a hét/hónap felirat lapozáskor számlálószerűen pörög.
  let periodKind = '';
  function renderPeriod() {
    let label;
    const box = $('#period');
    if (S.view === 'stats') {
      const fresh = periodKind !== 'stats';
      if (fresh) {
        box.innerHTML = `<div class="seg" role="group" aria-label="Időszak"><i class="tab-ind" aria-hidden="true"></i>${[7, 28, 90].map(n => `<button type="button" class="seg-btn" data-action="stats-range" data-days="${n}">${n} nap</button>`).join('')}</div>`;
        periodKind = 'stats';
      }
      box.querySelectorAll('.seg-btn').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.days) === S.statsDays)));
      placeInd(box.querySelector('.seg'), box.querySelector('.seg-btn[aria-pressed="true"]'), !fresh);
      return;
    }
    if (S.view === 'week') {
      const end = addDays(S.week, 6);
      const a = parse(S.week), b = parse(end);
      const range = a.getMonth() === b.getMonth()
        ? `${MON_S[a.getMonth()]} ${a.getDate()} – ${b.getDate()}`
        : `${MON_S[a.getMonth()]} ${a.getDate()} – ${MON_S[b.getMonth()]} ${b.getDate()}`;
      label = `<b>${isoWeek(S.week)}. hét</b><span>${range}</span>`;
    } else {
      const d = parse(S.month + '-01');
      label = `<b>${MON[d.getMonth()]}</b><span>${d.getFullYear()}</span>`;
    }
    const pl = box.querySelector('.period-label');
    if (periodKind === S.view && pl) {
      if (pl.innerHTML !== label) {
        pl.innerHTML = label;
        pl.classList.remove('roll-fwd', 'roll-back');
        if (S.pdir) { void pl.offsetWidth; pl.classList.add(S.pdir > 0 ? 'roll-fwd' : 'roll-back'); }
      }
      S.pdir = 0;
      return;
    }
    periodKind = S.view;
    S.pdir = 0;
    box.innerHTML = `
      <button type="button" class="ibtn" data-action="prev" aria-label="${S.view === 'week' ? 'Előző hét' : 'Előző hónap'}">${IC.left}</button>
      <div class="period-label">${label}</div>
      <button type="button" class="ibtn" data-action="next" aria-label="${S.view === 'week' ? 'Következő hét' : 'Következő hónap'}">${IC.right}</button>
      <button type="button" class="tbtn" data-action="today">Ma</button>${isWorker() ? '' : `
      <button type="button" class="tbtn tbtn-ic" data-action="paste" aria-label="ETA beillesztése" title="ETA beillesztése"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2"/><path d="M12 11v6M9 14h6"/></svg><span>ETA beillesztése</span></button>`}`;
  }

  function renderSync() {
    if (!S.data) return;
    const sy = SYNC || {};
    const last = toLocal(sy.last_ok);
    const busy = !!(LOCAL && LOCAL.busy);
    let dot = '', text = 'Outlook · nincs adat', tcls = '', title = '';
    if (busy) { dot = 'busy'; text = 'Frissítés…'; }
    else if (sy.error) { dot = 'err'; text = sy.error; tcls = 'err'; }
    else if (last) {
      const age = (Date.now() - new Date(sy.last_ok).getTime()) / 60000;
      const limit = (sy.interval_min || 10) * 3 + 5;
      text = `Outlook · ${last.slice(0, 10) === iso(new Date()) ? hm(last) : stamp(last)}`;
      if (age > limit) { dot = 'warn'; tcls = 'warn'; }
      title = `Utolsó frissítés: ${stamp(last)}`;
    } else { dot = 'warn'; tcls = 'warn'; }
    const initial = ME ? esc(ME.email.slice(0, 1)) : '';
    const fresh = LAST_OK !== null && sy.last_ok && sy.last_ok !== LAST_OK && !busy;
    if (!busy) LAST_OK = sy.last_ok || '';
    $('#sync').innerHTML = `
      <span class="sync-dot ${dot}${fresh ? ' ping' : ''}" aria-hidden="true"></span>
      <span class="sync-text ${tcls}${fresh ? ' fresh' : ''}" title="${esc(title)}">${esc(text)}</span>
      <button type="button" class="ibtn ${busy ? 'spin' : ''}" data-action="refresh" aria-label="Frissítés">${IC.refresh}</button>
      <button type="button" class="ibtn" data-action="settings" aria-label="Beállítások">${IC.sliders}</button>
      <span class="avatar" title="${esc(ME ? ME.email : '')}" aria-hidden="true">${initial}</span>`;
  }

  // ---------- heti nézet ----------
  function weekView() {
    const days = [...Array(7)].map((_, i) => addDays(S.week, i));
    const lists = days.map(onDay);
    const maxN = Math.max(1, ...lists.map(l => l.length));
    const H = window.matchMedia('(max-width: 760px)').matches ? 300 : 380;
    const GAP = 5;
    const avail = H - 12;
    const minH = Math.max(16, Math.min(maxN > 10 ? 22 : 34, Math.floor((avail - (maxN - 1) * GAP) / maxN)));
    // A legnagyobb arány, amelynél minden nap oszlopa (minimum magassággal együtt) belefér a sávba.
    const fits = k => lists.every(l => l.reduce((s, c) => s + Math.max(minH, Math.round((c.kg || 0) * k)), 0) + Math.max(0, l.length - 1) * GAP <= avail);
    let lo = 0, hi = avail / Math.max(1, ...lists.map(l => Math.max(0, ...l.map(c => c.kg || 0))));
    for (let n = 0; n < 24; n++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    const k = lo;

    const cols = days.map((d, i) => {
      const list = lists[i];
      const kg = sumKg(list);
      const blocks = list.slice().sort((a, b) => phase(b).p - phase(a).p || (a.eta_time || '99').localeCompare(b.eta_time || '99')).reverse().map((c, j, arr) => {
        const ph = phase(c);
        const late = lateInfo(c);
        return `
        <div class="blk blk-${ph.grp}${late ? ' late' : ''}" data-id="${esc(c.id)}" style="--p:${Math.round(ph.p * 100)}%;--j:${Math.min(9, arr.length - 1 - j)};height:${Math.max(minH, Math.round(c.kg * k))}px" title="${esc(c.id)} · ${esc(ph.label)}">
          <span class="blk-id">${esc(c.id)}</span><span class="blk-r">${esc(!c.arrived && c.eta_time ? c.eta_time : fmtT(c.kg))}</span>
        </div>`;
      }).join('');
      const nodata = !hasForecast(d) && !list.length;
      const note = nodata && d >= S.today ? '<div class="stack-note">Még nincs előrejelzés</div>' : '';
      const done = list.filter(c => phase(c).key === 'stored').length;
      return `
        <button type="button" class="day${d === S.today ? ' is-today' : ''}" data-action="day" data-date="${d}" aria-pressed="${d === S.sel}" style="--i:${i}">
          <div class="day-top"><span class="day-dow">${DOW[i]}</span>${d === S.today ? '<span class="today-tag">MA</span>' : ''}</div>
          <div class="day-num"><span>${parse(d).getDate()}</span></div>
          <div class="stack ${nodata ? 'nodata' : ''}" style="height:${H}px">${blocks}${note}</div>
          <div class="day-foot"><span><b>${num(list.length, 'int', 120 + i * 40)}</b><small>konténer</small></span><span class="day-t">${list.length ? fmtT(kg) : '—'}</span></div>
          <div class="day-ctn">${list.length ? `<span>${fmtInt(sumCt(list))} karton</span>${done ? `<span class="day-sto"><i style="--p:${Math.round(done / list.length * 100)}%"></i>${done}/${list.length} betárolva</span>` : ''}` : ''}</div>
        </button>`;
    }).join('');

    const legend = [['Tervben', 0, 'plan'], ['Megérkezett', 25, 'live'], ['Nyitás', 75, 'live'], ['Betárolva', 100, 'done']]
      .map(([t, p, g], i) => `<span style="--i:${i}"><i class="lg-ct lg-${g}" style="--p:${p}%"></i>${t}</span>`).join('');
    return `
      <section class="yard" aria-label="Heti érkezések">
        <div class="legend">${legend}</div>
        <div class="yard-scroll"><div class="days" style="--di:${Math.max(0, days.indexOf(S.sel))}"><i class="day-ind" aria-hidden="true"></i>${cols}</div></div>
      </section>
      ${dayPanel()}`;
  }

  // ---------- folyamat, késés, rámpa ----------
  const STAGES = ['arrive', 'request', 'approved', 'opened', 'released', 'stored'];
  const STAGE_LABEL = { arrive: 'Megérkezett', request: 'Nyitás kérve', approved: 'Nyitható', opened: 'Nyitás', released: 'Elengedve', stored: 'Betárolva' };
  const PHASE = {
    pre: ['Tervben', 0, 'plan'], t1: ['Kamion + T1', 0, 'plan'], eta: ['ETA megvan', 0, 'plan'],
    request: ['Megérkezett', 0.25, 'live'], approved: ['Nyitható', 0.5, 'live'], opened: ['Nyitás', 0.75, 'live'],
    released: ['Elengedve', 0.85, 'live'], stored: ['Betárolva', 1, 'done']
  };
  function phase(c) {
    if (c.stage === 'stored') return { key: 'stored', label: PHASE.stored[0], p: 1, grp: 'done' };
    if (c.storage && c.storage.done) {
      return { key: 'storing', label: `Betárolás ${c.storage.done}/${c.storage.total}`, p: 0.85 + 0.15 * c.storage.done / Math.max(1, c.storage.total), grp: 'live' };
    }
    const k = c.stage || (c.arrived ? 'request' : c.eta_time ? 'eta' : (c.plate || c.t1) ? 't1' : 'pre');
    const [label, p, grp] = PHASE[k];
    return { key: k, label, p, grp };
  }
  const stageText = c => phase(c).label;
  let svgUid = 0;

  function fmtDur(min) {
    min = Math.max(0, Math.round(min));
    if (min < 60) return `${min} p`;
    if (min < 1440) return `${Math.floor(min / 60)} ó ${pad(min % 60)} p`;
    const d = Math.floor(min / 1440);
    return `${d} nap ${Math.floor((min % 1440) / 60)} ó`;
  }

  function lateInfo(c) {
    if (!c || c.state !== 'active' || c.arrived) return null;
    const today = iso(new Date());
    if (c.eta_time) {
      const t = new Date(`${c.eta_date || c.date}T${c.eta_time}:00`);
      const min = (Date.now() - t.getTime()) / 60000;
      return min > 15 ? { min, label: `Késik ${fmtDur(min)}` } : null;
    }
    if (c.date && c.date < today) return { min: 0, label: 'Nem érkezett meg' };
    return null;
  }

  const minutesBetween = (a, b) => (new Date(b) - new Date(a)) / 60000;

  function stepper(c) {
    const st = c.stages || {};
    const first = (st.request && st.request.at) || c.arrived_at;
    const atOf = k => (k === 'arrive' ? (c.arrived_at || first) : st[k] && st[k].at);
    let prev = null, last = -1;
    const items = STAGES.map((k, i) => {
      const at = atOf(k);
      // Az érkezés és a nyitáskérés közti távot nem mérjük: az időtartamok a nyitáskéréstől indulnak.
      const dur = at && prev && k !== 'request' ? fmtDur(minutesBetween(prev, at)) : '';
      if (at) { if (k !== 'arrive' || !st.request) prev = at; last = i; }
      const lab = k === 'stored' && !st.stored && c.storage ? `Betárolás ${c.storage.done}/${c.storage.total}` : STAGE_LABEL[k];
      return `
        <li class="${at ? 'done' : ''}" style="--i:${i}">
          <span class="sp-dot" aria-hidden="true"></span>
          <span class="sp-lab">${esc(lab)}</span>
          <span class="sp-at">${at ? esc(hm(at)) : '—'}</span>
          <span class="sp-dur">${dur ? '+' + esc(dur) : ''}</span>
        </li>`;
    }).join('');
    const endAt = st.stored && st.stored.at;
    const total = first && endAt ? fmtDur(minutesBetween(first, endAt)) : '';
    return `
      <section class="flow" aria-label="Mérföldkövek">
        <div class="flow-head"><b>Mérföldkövek</b>${total ? `<span>Átfutás: ${esc(total)}</span>` : ''}</div>
        <ol class="steps" style="--sp:${Math.max(0, last) / (STAGES.length - 1)}">${items}</ol>
      </section>`;
  }

  function rampUse(day, exceptId) {
    const used = {};
    onDay(day).forEach(x => {
      if (x.ramp && x.id !== exceptId && x.stage !== 'released' && x.stage !== 'stored') used[x.ramp] = x.id;
    });
    return used;
  }

  function rampPicker(c) {
    const used = rampUse(c.day, c.id);
    const busy = Object.keys(used).sort((a, b) => a - b).map(n => `${n} (${used[n]})`).join(', ');
    return `
      <section class="rampbox" aria-label="Rámpa">
        <label class="ramp-line" for="ramp-input"><b>Rámpa</b>
          <input id="ramp-input" class="field ramp-in" type="number" min="1" max="99" step="1" inputmode="numeric" value="${c.ramp || ''}" data-id="${esc(c.id)}" placeholder="—">
        </label>
        ${busy ? `<div class="ramp-busy">Foglalt: ${esc(busy)}</div>` : ''}
      </section>`;
  }

  function rampStrip(d, list) {
    if (d !== S.today) return '';
    const busy = list.filter(x => x.ramp && x.stage !== 'released' && x.stage !== 'stored').sort((a, b) => a.ramp - b.ramp);
    if (!busy.length) return '';
    const tiles = busy.map((x, i) => {
      const ph = phase(x);
      return `<button type="button" class="dock" data-action="open" data-id="${esc(x.id)}" style="--i:${Math.min(i, 9)}">
        <span class="dock-n"><small>Rámpa</small>${x.ramp}</span>
        <span class="dock-body"><span class="dock-id">${esc(x.id)}</span><span class="dock-bar" style="--p:${Math.round(ph.p * 100)}%"></span><span class="dock-st">${esc(ph.label)}</span></span>
      </button>`;
    }).join('');
    return `<section class="docks" aria-label="Foglalt rámpák"><div class="dock-row">${tiles}</div></section>`;
  }

  // ---------- keresés ----------
  function searchHits(q) {
    const n = q.toUpperCase().replace(/\s+/g, '');
    if (n.length < 3) return [];
    const out = [];
    for (const c of all()) {
      let where = '', val = '';
      const pd = c.pdd.find(p => (p.no || '').toUpperCase().includes(n));
      if (c.id.includes(n)) where = 'Konténer';
      else if ((c.t1 || '').toUpperCase().includes(n)) { where = 'MRN'; val = c.t1; }
      else if ((c.plate || '').toUpperCase().replace(/\s+/g, '').includes(n)) { where = 'Rendszám'; val = plate(c.plate); }
      else if (pd) { where = 'PDD'; val = pd.no; }
      if (where) out.push({ c, where, val });
    }
    return out.sort((a, b) => (a.c.date < b.c.date ? 1 : -1)).slice(0, 12);
  }

  // A keresett részlet kiemelése (a szóközöket figyelmen kívül hagyva).
  function mark(text, q) {
    const t = String(text || '');
    const n = q.toUpperCase().replace(/\s+/g, '');
    const map = [];
    let flat = '';
    [...t].forEach((ch, i) => { if (!/\s/.test(ch)) { map.push(i); flat += ch.toUpperCase(); } });
    const at = flat.indexOf(n);
    if (!n || at < 0) return esc(t);
    const a = map[at], b = map[at + n.length - 1] + 1;
    return `${esc(t.slice(0, a))}<mark>${esc(t.slice(a, b))}</mark>${esc(t.slice(b))}`;
  }

  function renderSearch() {
    const box = $('#qres');
    const q = $('#q').value.trim();
    if (q.length < 3) { box.hidden = true; box.innerHTML = ''; return; }
    const hits = searchHits(q);
    const opening = box.hidden;
    box.hidden = false;
    box.innerHTML = hits.length ? hits.map(({ c, where, val }, i) => {
      const day = c.state === 'active' ? c.day : c.removed_from;
      const out = c.state === 'removed';
      return `<button type="button" class="qhit" data-action="qopen" data-id="${esc(c.id)}" style="--i:${i}">
        <span class="qhit-id">${mark(c.id, q)}</span>
        <span class="qhit-meta">${day ? `${DOW_S[dowIdx(day)]} ${short(day)}` : ''} · ${val ? `${esc(where)} ${mark(val, q)}` : esc(where)}</span>
        <span class="ph ph-${out ? 'out' : `${phase(c).grp} phk-${phase(c).key}`}">${esc(out ? ST_LABEL.removed : stageText(c))}</span>
      </button>`;
    }).join('') : '<div class="qnone">Nincs találat</div>';
    if (opening) {
      box.classList.add('opening');
      setTimeout(() => box.classList.remove('opening'), 600);
    }
  }

  // ---------- statisztika ----------
  function statsView() {
    const today = S.today;
    const from = addDays(today, -(S.statsDays - 1));
    const to = addDays(today, 7);
    const act = all().filter(c => c.state === 'active');
    const past = act.filter(c => c.date >= from && c.date <= today);
    const arrived = past.filter(c => c.arrived);
    const storedL = past.filter(c => phase(c).key === 'stored');
    const kg = sumKg(past), ct = sumCt(past);
    const at = (c, k) => { const st = c.stages || {}; return k === 'request' ? ((st.request && st.request.at) || c.arrived_at || null) : (st[k] && st[k].at) || null; };
    const span = (a, b) => past.map(c => { const x = at(c, a), y = at(c, b); return x && y ? minutesBetween(x, y) : null; }).filter(v => v != null && v >= 0);
    const avg = l => (l.length ? l.reduce((t, x) => t + x, 0) / l.length : null);

    const openT = span('request', 'approved');
    const waitT = span('approved', 'opened');
    const openStore = span('opened', 'stored');
    const total = span('request', 'stored');
    const days = [...new Set(past.map(c => c.date))];
    const perDay = days.length ? past.length / days.length : 0;

    const devs = past.filter(c => c.eta_time && c.arrived_at).map(c => minutesBetween(`${c.eta_date || c.date}T${c.eta_time}:00`, c.arrived_at));
    const early = devs.filter(d => d < -30).length, ok = devs.filter(d => Math.abs(d) <= 30).length, lateN = devs.filter(d => d > 30).length;

    const kpi = (title, l, sub, i) => {
      const v = avg(l);
      const sorted = l.slice().sort((a, b) => a - b);
      const mn = sorted[0], mx = sorted[sorted.length - 1];
      const pos = x => (mx > mn ? ((x - mn) / (mx - mn)) * 100 : 50);
      return `<div class="kpi" style="--i:${i}">
        <dt>${title}</dt><dd>${v != null ? num(v, 'dur', 200 + i * 90) : '—'}</dd><span class="kpi-sub">${esc(sub)}</span>
        ${l.length > 1 ? `<div class="rng" data-tip="${esc(`legrövidebb ${fmtDur(mn)} · átlag ${fmtDur(v)} · leghosszabb ${fmtDur(mx)} · ${l.length} konténer`)}"><i class="rng-track"></i>${sorted.map((x, k) => `<i class="rng-dot" style="left:${pos(x)}%;--k:${Math.min(k, 16)}"></i>`).join('')}<i class="rng-avg" style="left:${pos(v)}%"></i><span class="rng-lo">${esc(fmtDur(mn))}</span><span class="rng-hi">${esc(fmtDur(mx))}</span></div>` : `<div class="kpi-n">${l.length} mérés</div>`}
      </div>`;
    };

    const segs = [['Érkezés → Nyitható', avg(openT) || 0, 's1'], ['Nyitható → Nyitás', avg(waitT) || 0, 's2'], ['Nyitás → Betárolva', avg(openStore) || 0, 's3']];
    const segSum = segs.reduce((t, x) => t + x[1], 0);

    return `
      <div class="statsv">
        <section class="sx">
          <h2 class="sx-h">Áttekintés</h2>
          <div class="hero">
            <div class="hero-main">
              ${ring(storedL.length, past.length, 'done', 132, `<text x="50%" y="50%" text-anchor="middle"><tspan class="ring-n" x="50%" dy=".1em">${storedL.length}</tspan><tspan class="ring-l" x="50%" dy="1.7em">betárolva</tspan></text>`)}
              <div><div class="hero-n">${num(past.length, 'int', 150)}<small> konténer</small></div>
                <div class="hero-sub">${arrived.length} megérkezett</div>
                <div class="hero-sub">${fmtT(kg)} · ${fmtInt(ct)} karton</div></div>
            </div>
            <div class="hero-side">
              <div class="mini" style="--i:1"><dt>Napi átlag</dt><dd>${perDay ? num(perDay, 'd1', 200) : '—'}</dd><span>konténer / nap</span></div>
              <div class="mini" style="--i:2"><dt>Átlagos súly</dt><dd>${past.length ? num(kg / past.length, 't', 260) : '—'}</dd><span>konténerenként</span></div>
              <div class="mini mini-ring" style="--i:3">${ring(ok, devs.length, 'live', 56)}<span><dt>ETA-pontosság</dt><dd>${devs.length ? `${ok}/${devs.length}` : '—'}</dd><span>${devs.length ? `${early} korábban · ${lateN} később` : 'még nincs mérés'}</span></span></div>
            </div>
          </div>
        </section>

        <section class="sx">
          <h2 class="sx-h">Időtartamok</h2>
          <dl class="kpis">
            ${kpi('Nyitási idő', openT, 'érkezéstől nyithatóig', 0)}
            ${kpi('Nyitás → betárolás', openStore, 'nyitástól az utolsó PDD betárolásáig', 1)}
            ${kpi('Teljes átfutás', total, 'érkezéstől betárolásig', 2)}
          </dl>
          <div class="panel chart" data-reveal>
            <div class="chart-head"><b>Egy átlagos konténer útja</b><span class="chart-sub">${segSum ? esc(fmtDur(segSum)) : ''}</span></div>
            ${segSum ? `<div class="flowbar">${segs.map(([k, v, cl], i) => `<div class="fb fb-${cl}" style="flex:${Math.max(v, segSum * 0.06)};--i:${i}" data-tip="${esc(`${k}: ${fmtDur(v)}`)}"><b>${esc(fmtDur(v))}</b><span>${esc(k)}</span></div>`).join('')}</div>` : '<div class="empty">Még nincs elég adat.</div>'}
          </div>
          <div class="panel chart" data-reveal>
            <div class="chart-head"><b>Konténerenként</b><span class="lg"><i class="fb-s1"></i>Érkezés → Nyitható</span><span class="lg"><i class="fb-s2"></i>Nyitható → Nyitás</span><span class="lg"><i class="fb-s3"></i>Nyitás → Betárolva</span></div>
            ${gantt(past, at)}
          </div>
        </section>

        <section class="sx">
          <h2 class="sx-h">Mennyiség</h2>
          <div class="panel chart" data-reveal>
            <div class="chart-head"><b>Napi konténerszám</b>
              <span class="lg"><i class="lg-done"></i>Megvalósult</span><span class="lg"><i class="lg-today"></i>Ma</span><span class="lg"><i class="lg-plan"></i>Tervezett</span></div>
            ${dayBars(from, to, act)}
          </div>
          <div class="chart-row">
            <div class="panel chart" data-reveal>
              <div class="chart-head"><b>Átfutás naponta</b><span class="chart-sub">átlag, érkezéstől betárolásig</span></div>
              ${dayTrend(past, at)}
            </div>
            <div class="panel chart" data-reveal>
              <div class="chart-head"><b>Érkezések óránként</b><span class="chart-sub">nyitáskérés ideje</span></div>
              ${hourBars(past.map(c => c.arrived_at).filter(Boolean))}
            </div>
          </div>
        </section>
      </div>`;
  }

  function dayBars(from, to, act) {
    const days = [];
    for (let d = from; d <= to; d = addDays(d, 1)) days.push(d);
    const data = days.map(d => {
      const l = act.filter(c => c.date === d);
      return { d, n: l.length, kg: sumKg(l), ct: sumCt(l) };
    });
    const max = Math.max(4, ...data.map(x => x.n));
    const step = max <= 8 ? 2 : max <= 20 ? 5 : 10;
    const top = Math.ceil(max / step) * step;
    const W = 1000, H = 260, L = 34, B = 26, T = 10;
    const bw = (W - L) / data.length;
    const y = v => T + (H - T - B) * (1 - v / top);
    let grid = '';
    for (let v = 0; v <= top; v += step) {
      grid += `<line x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="g-line"/><text x="${L - 8}" y="${y(v) + 4}" class="g-lab" text-anchor="end">${v}</text>`;
    }
    const every = Math.ceil(data.length / 16);
    const bars = data.map((x, i) => {
      const cx = L + i * bw;
      const w = Math.max(2, bw - 3);
      const cls = x.d > S.today ? 'b-plan' : x.d === S.today ? 'b-today' : 'b-done';
      const h = x.n ? Math.max(3, y(0) - y(x.n)) : 0;
      const tip = `${DOW[dowIdx(x.d)]}, ${short(x.d)} · ${x.n} konténer · ${fmtT(x.kg)} · ${fmtInt(x.ct)} karton`;
      const lab = i % every === 0 ? `<text x="${cx + bw / 2}" y="${H - 8}" class="g-lab" text-anchor="middle">${short(x.d)}</text>` : '';
      return `<g class="bar-hit" data-tip="${esc(tip)}"><rect x="${cx}" y="${T}" width="${bw}" height="${H - T - B}" class="hit"/>${h ? `<rect x="${cx + 1.5}" y="${y(x.n)}" width="${w}" height="${h}" rx="3" class="cb ${cls}" style="--i:${Math.round(i * 40 / data.length)}"/>` : ''}</g>${lab}`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Napi konténerszám">${grid}${bars}</svg>`;
  }

  function gantt(list, at) {
    const rows = list.map(c => ({ c, r: at(c, 'request'), a: at(c, 'approved'), o: at(c, 'opened'), s: at(c, 'stored') }))
      .filter(x => x.r && (x.s || x.o || x.a)).sort((p, q) => (p.r < q.r ? 1 : -1)).slice(0, 14);
    if (!rows.length) return '<div class="empty">Még nincs elég adat.</div>';
    const span = x => minutesBetween(x.r, x.s || x.o || x.a);
    const max = Math.max(60, ...rows.map(span));
    const LAB = { r: 'Érkezés', a: 'Nyitható', o: 'Nyitás', s: 'Betárolva' };
    const CL = { a: 's1', o: 's2', s: 's3' };
    return `<div class="gantt">${rows.map((x, i) => {
      // Ha egy mérföldkő hiányzik, a szakasz a következő meglévőig tart, így a sáv nem marad üresen.
      const pts = ['r', 'a', 'o', 's'].filter(k => x[k]);
      const segs = pts.slice(1).map((k, j) => {
        const from = pts[j], m = minutesBetween(x[from], x[k]);
        return `<i class="fb-${CL[k]}" style="width:${(Math.max(0, m) / max) * 100}%;--k:${j}" data-tip="${esc(`${x.c.id} · ${LAB[from]} → ${LAB[k]}: ${fmtDur(m)}`)}"></i>`;
      }).join('');
      return `<div class="g-row" style="--i:${i}"><button type="button" class="g-id" data-action="open" data-id="${esc(x.c.id)}">${esc(x.c.id)}</button><span class="g-day">${esc(short(x.c.date))}</span>
        <div class="g-track"><span class="g-bar">${segs}</span></div>
        <span class="g-tot">${esc(fmtDur(span(x)))}</span></div>`;
    }).join('')}</div>`;
  }

  function dayTrend(list, at) {
    const by = {};
    list.forEach(c => { const r = at(c, 'request'), s = at(c, 'stored'); if (r && s) (by[c.date] = by[c.date] || []).push(minutesBetween(r, s)); });
    const days = Object.keys(by).sort();
    if (!days.length) return '<div class="empty">Még nincs betárolt konténer.</div>';
    const vals = days.map(d => by[d].reduce((t, x) => t + x, 0) / by[d].length);
    // Egész órás rácsvonalak: a lépés az a legkisebb, amellyel legfeljebb 4 sáv lesz.
    const maxH = Math.max(1, ...vals) / 60;
    const stepH = [1, 2, 3, 4, 6, 8, 12, 24, 48].find(s => Math.ceil(maxH / s) <= 4) || 48;
    const max = Math.max(1, Math.ceil(maxH / stepH)) * stepH * 60;
    const W = 600, H = 200, L = 46, B = 24, T = 12;
    const bw = (W - L) / days.length;
    const y = v => T + (H - T - B) * (1 - v / max);
    let grid = '';
    for (let v = 0; v <= max; v += stepH * 60) {
      grid += `<line x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="g-line"/><text x="${L - 6}" y="${y(v) + 4}" class="g-lab" text-anchor="end">${v / 60} ó</text>`;
    }
    const pts = vals.map((v, i) => [L + i * bw + bw / 2, y(v)]);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const dots = pts.map((p, i) => `<g class="t-pt" style="--t:${pts.length > 1 ? (i / (pts.length - 1)).toFixed(3) : 0}" data-tip="${esc(`${short(days[i])} · ${fmtDur(vals[i])} · ${by[days[i]].length} konténer`)}"><circle cx="${p[0]}" cy="${p[1]}" r="12" class="hit"/><circle cx="${p[0]}" cy="${p[1]}" r="5" class="t-dot"/></g><text x="${p[0]}" y="${H - 7}" class="g-lab" text-anchor="middle">${short(days[i])}</text>`).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Átfutás naponta">${grid}<path d="${line}" class="t-line" pathLength="1"/>${dots}</svg>`;
  }

  function hourBars(times) {
    if (!times.length) return '<div class="empty">Még nincs érkezési adat.</div>';
    const cnt = Array(24).fill(0);
    times.forEach(t => { cnt[Number(t.slice(11, 13))]++; });
    const lo = Math.min(6, ...cnt.map((v, i) => (v ? i : 24)));
    const hi = Math.max(20, ...cnt.map((v, i) => (v ? i : 0)));
    const hrs = [];
    for (let h = lo; h <= hi; h++) hrs.push(h);
    const max = Math.max(2, ...cnt);
    const W = 600, H = 200, L = 26, B = 24, T = 8;
    const bw = (W - L) / hrs.length;
    const y = v => T + (H - T - B) * (1 - v / max);
    let grid = '';
    for (let v = 0; v <= max; v += Math.max(1, Math.ceil(max / 4))) {
      grid += `<line x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="g-line"/><text x="${L - 6}" y="${y(v) + 4}" class="g-lab" text-anchor="end">${v}</text>`;
    }
    const bars = hrs.map((h, i) => {
      const v = cnt[h], cx = L + i * bw, hh = v ? Math.max(3, y(0) - y(v)) : 0;
      return `<g class="bar-hit" data-tip="${pad(h)}:00–${pad(h)}:59 · ${v} konténer"><rect x="${cx}" y="${T}" width="${bw}" height="${H - T - B}" class="hit"/>${hh ? `<rect x="${cx + 2}" y="${y(v)}" width="${Math.max(2, bw - 4)}" height="${hh}" rx="3" class="cb b-done" style="--i:${i}"/>` : ''}</g>${h % 2 === 0 ? `<text x="${cx + bw / 2}" y="${H - 7}" class="g-lab" text-anchor="middle">${pad(h)}</text>` : ''}`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Érkezések óránként">${grid}${bars}</svg>`;
  }

  // ---------- konténer oldalnézet (40' HC) ----------
  function containerSvg(c, opts = {}) {
    const id = (c.id || '').replace(/\s/g, '');
    const owner = id.slice(0, 4), serial = id.slice(4, 10), check = id.slice(10, 11);
    const kgTxt = c.kg ? `${fmtInt(c.kg)} KG` : '';
    const ctTxt = c.ctns ? `${fmtInt(c.ctns)} CTN` : '';
    const ph = phase(c);
    const late = lateInfo(c);
    const uid = 'cf' + (++svgUid);
    const fw = Math.round(388 * ph.p);
    // Élő változásnál a töltés az előző szintről nő a mostanira.
    const was = PREV_P[c.id];
    const grow = was !== undefined && was < ph.p;
    return `
      <svg class="ct${late ? ' ct-late' : ''}${opts.cls ? ' ' + opts.cls : ''}${grow ? ' ct-grow' : ''}"${grow ? ` style="--f0:${(was / ph.p).toFixed(3)}"` : ''} viewBox="0 0 400 96" role="img" aria-label="${esc(id)} · ${esc(ph.label)}" preserveAspectRatio="xMidYMid meet">
        <defs><clipPath id="${uid}"><rect class="ct-clip" x="6" y="8" width="${fw}" height="80"/></clipPath></defs>
        <rect class="ct-shell${ph.grp === 'plan' ? ' ct-shell-plan' : ''}" x="2" y="6" width="396" height="84" rx="2"/>
        <rect x="20.9" y="13" width="359.2" height="70" fill="url(#kf-rib)"/>
        ${fw ? `<g clip-path="url(#${uid})"><rect class="ct-fill ct-fill-${ph.grp}" x="2" y="6" width="396" height="84"${ph.grp === 'done' ? ' fill="url(#kf-done)"' : ''}/><rect x="20.8" y="13" width="359.4" height="70" fill="url(#kf-rib-f)"/></g>` : ''}
        ${ph.p > 0 && ph.p < 1 ? `<line class="ct-level" x1="${6 + fw}" x2="${6 + fw}" y1="12" y2="84" style="--lv:${fw}"/>` : ''}
        <rect class="ct-rail" x="2" y="6" width="396" height="6"/>
        <rect class="ct-rail" x="2" y="83" width="396" height="7"/>
        <rect class="ct-post" x="2" y="6" width="8" height="84"/>
        <rect class="ct-post" x="390" y="6" width="8" height="84"/>
        <g class="ct-cast">
          <rect x="2" y="6" width="14" height="11" rx="1"/><rect x="384" y="6" width="14" height="11" rx="1"/>
          <rect x="2" y="79" width="14" height="11" rx="1"/><rect x="384" y="79" width="14" height="11" rx="1"/>
        </g>
        <g class="ct-hole">
          <ellipse cx="9" cy="11.5" rx="3.6" ry="2.2"/><ellipse cx="391" cy="11.5" rx="3.6" ry="2.2"/>
          <ellipse cx="9" cy="84.5" rx="3.6" ry="2.2"/><ellipse cx="391" cy="84.5" rx="3.6" ry="2.2"/>
        </g>
        <g class="ct-mark">
          <text x="26" y="47" class="ct-id">${esc(owner)}</text>
          <text x="96" y="47" class="ct-id">${esc(serial)}</text>
          ${check ? `<rect class="ct-chk" x="186" y="25" width="21" height="28" rx="1.5"/><text x="196.5" y="47" class="ct-id" text-anchor="middle">${esc(check)}</text>` : ''}
          <text x="26" y="72" class="ct-sub">${esc(kgTxt)}</text>
          <text x="128" y="72" class="ct-sub">${esc(ctTxt)}</text>
        </g>
      </svg>`;
  }

  // Daru-függeszték a kártyákon: kötél, horogblokk, hevederek és a narancs spreader twistlock-lámpákkal.
  const HOIST = `<span class="hk" aria-hidden="true"><i class="hk-cable"></i><svg class="hk-rig" viewBox="0 0 400 56" preserveAspectRatio="xMidYMax meet">
      <path class="hk-sling" d="M200 27 L110 42 M200 27 L290 42"/>
      <rect class="hk-block" x="186" y="0" width="28" height="15" rx="3.5"/><circle class="hk-pin" cx="200" cy="7.5" r="3.2"/>
      <path class="hk-hook" d="M200 15 v6 a4.6 4.6 0 1 1 -4.6 4.6"/>
      <rect class="hk-tl" x="6" y="49" width="7" height="7"/><rect class="hk-tl" x="387" y="49" width="7" height="7"/>
      <rect class="hk-beam" x="2" y="41" width="396" height="9" rx="1.5"/>
      <rect class="hk-hz" x="2" y="41" width="40" height="9" rx="1.5"/><rect class="hk-hz" x="358" y="41" width="40" height="9" rx="1.5"/>
      <rect x="2" y="41" width="40" height="9" rx="1.5" fill="url(#kf-hz)"/><rect x="358" y="41" width="40" height="9" rx="1.5" fill="url(#kf-hz)"/>
      <rect class="hk-hl" x="42" y="41.5" width="316" height="1.6"/>
    </svg><b class="hk-lamp l"></b><b class="hk-lamp r"></b></span>`;

  function fleet(d, list) {
    if (!list.length) return '';
    const cards = list.map((c, i) => {
      const ph = phase(c);
      const late = lateInfo(c);
      const eta = !c.arrived && c.eta_time ? `<span class="cc-eta">ETA ${esc(c.eta_time)}</span>` : '';
      return `
        <button type="button" class="ccard${late ? ' is-late' : ''}" data-action="open" data-id="${esc(c.id)}" style="--i:${Math.min(i, 11)}">
          <span class="ct-wrap"><i class="cc-ground"></i><span class="ct-rig"><span class="ct-sw">${HOIST}${containerSvg(c)}</span></span></span>
          <span class="cc-top">
            <span class="cc-w"><b>${fmtDec((c.kg || 0) / 1000, 1, 1)}</b><small>t</small></span>
            <span class="ph ph-${late ? 'late' : `${ph.grp} phk-${ph.key}`}">${esc(late ? late.label : ph.label)}</span>
          </span>
          <span class="cc-sub">${fmtInt(c.ctns)} karton · ${c.pdd.length} PDD${eta}${c.ramp ? `<span class="ramp-chip">Rámpa ${c.ramp}</span>` : ''}</span>
          <span class="cc-plate ${c.plate ? '' : 'dim'}">${c.plate ? esc(plate(c.plate)) : 'kamion még nincs'}</span>
        </button>`;
    }).join('');
    return `
      <section class="fleet" aria-label="Érkező konténerek" data-reveal>
        <div class="fleet-grid">${cards}</div>
      </section>`;
  }

  // Haladás-gyűrű százalék nélkül; a felirat (ha van) a középre kerül.
  function ring(v, total, cls, size = 40, label = '') {
    const r = size / 2 - 4, C = 2 * Math.PI * r, f = total ? Math.min(1, v / total) : 0;
    return `<svg class="ring ring-${cls}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true" style="--c:${C.toFixed(1)}">
      <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}"/>
      <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      ${label}
    </svg>`;
  }

  // ETA-lefedettség: van ETA, vagy már megérkezett (akkor az ETA már nem kérdés). Minden nézet ezt használja.
  const etaDone = c => !!(c.eta_time || c.arrived);

  function dayPanel() {
    const d = S.sel;
    const list = onDay(d);
    const withEta = list.filter(etaDone).length;
    const arrived = list.filter(c => c.arrived).length;
    const stored = list.filter(c => phase(c).key === 'stored').length;
    const late = list.filter(c => lateInfo(c)).length;
    const of = n => `<span class="of"> / ${n}</span>`;
    // Üres nap: nincs 0 / 0-s gyűrűsor és üres idővonal, csak a dátum és az ok.
    if (!list.length) {
      return `
      <main class="main">
        <div class="dayhead"><div class="title-row"><h1><span class="slot">${DOW[dowIdx(d)]}</span></h1><span class="sub">${longLabel(d)}</span></div></div>
        ${table(d, list)}
      </main>`;
    }
    return `
      <main class="main">
        <div class="dayhead">
          <div class="title-row"><h1><span class="slot">${DOW[dowIdx(d)]}</span></h1><span class="sub">${longLabel(d)}</span></div>
          <dl class="stats">
            <div style="--i:0"><dt>Konténer</dt><dd>${num(list.length, 'int', 140)}</dd></div>
            <div style="--i:1"><dt>Bruttó súly</dt><dd>${num(sumKg(list), 't', 190)}</dd></div>
            <div style="--i:2"><dt>Karton</dt><dd>${num(sumCt(list), 'int', 240)}</dd></div>
            <div class="st-ring" style="--i:3">${ring(withEta, list.length, 'eta')}<span><dt>ETA</dt><dd>${num(withEta, 'int', 290)}${of(list.length)}</dd></span></div>
            <div class="st-ring" style="--i:4">${ring(arrived, list.length, 'live')}<span><dt>Megérkezett</dt><dd>${num(arrived, 'int', 340)}${of(list.length)}</dd></span></div>
            <div class="st-ring" style="--i:5">${ring(stored, list.length, 'done')}<span><dt>Betárolva</dt><dd>${num(stored, 'int', 390)}${of(list.length)}</dd></span></div>
            ${late ? `<div class="st-late st-ring" style="--i:6">${ring(late, list.length, 'late')}<span><dt>Késik</dt><dd>${num(late, 'int', 440)}</dd></span></div>` : ''}
          </dl>
        </div>
        ${rampStrip(d, list)}
        ${fleet(d, list)}
        ${timeline(d, list)}
        ${table(d, list)}
      </main>`;
  }

  function timeline(d, list) {
    const timed = list.filter(c => c.eta_time).sort((a, b) => (a.eta_time < b.eta_time ? -1 : 1));
    const hs = timed.map(c => toH(c.eta_time));
    const n = new Date();
    const nh = d === S.today ? n.getHours() + n.getMinutes() / 60 : null;
    // A „most” jelölő este és hajnalban is a skálán marad.
    if (nh !== null) hs.push(nh);
    const lo = Math.max(0, Math.min(6, Math.floor(Math.min(...hs, 24))));
    const hi = Math.min(24, Math.max(20, Math.ceil(Math.max(...hs, 0) + (nh !== null && Math.max(...hs) === nh ? 0.25 : 1))));
    const pos = h => (h - lo) / (hi - lo) * 100;
    const span = 15;
    const lanes = [];
    const pills = timed.map((c, i) => {
      const p = pos(toH(c.eta_time));
      let lane = lanes.findIndex(end => end <= p);
      if (lane < 0) { lane = lanes.length; lanes.push(0); }
      lanes[lane] = p + span;
      const left = Math.min(p, 84);
      return `<button type="button" class="pill pill-${c.status === 'arrived' ? 'arrived' : 'eta'}" style="left:${left}%;top:${6 + lane * 44}px;--i:${Math.min(i, 12)}" data-action="open" data-id="${esc(c.id)}"><b>${esc(c.eta_time)}</b><span>${esc(c.id)}</span></button>`;
    }).join('');
    const h = Math.max(1, lanes.length) * 44 + 34;
    let ticks = '';
    for (let x = lo; x <= hi; x++) {
      const major = x % 2 === 0;
      ticks += `<div class="tl-tick ${major ? 'major' : ''}" style="left:${pos(x)}%;--i:${x - lo}"></div>`;
      if (major) ticks += `<span class="tl-lab" style="left:${pos(x)}%;--i:${x - lo}">${pad(x)}</span>`;
    }
    let now = '';
    if (nh !== null && nh >= lo && nh <= hi) now = `<div class="tl-now" style="left:${pos(nh)}%"></div><span class="tl-now-lab" style="left:${pos(nh)}%">${pad(n.getHours())}:${pad(n.getMinutes())}</span>`;
    const noEta = list.filter(c => !c.eta_time && c.status !== 'arrived');
    return `
      <section class="panel timeline" aria-label="Idővonal" data-reveal>
        <div class="tl-track"><div class="tl-area" style="height:${h}px">${ticks}${now}${pills}${timed.length ? '' : '<div class="tl-empty">Nincs rögzített ETA</div>'}</div></div>
        <div class="tray">
          <div class="tray-head"><span>ETA nélkül</span><span class="mono">${noEta.length}</span></div>
          <div class="tray-list">${noEta.map((c, i) => `<button type="button" class="tray-item" data-action="open" data-id="${esc(c.id)}" style="--i:${Math.min(i, 8)}"><span>${esc(c.id)}</span><span>${fmtT(c.kg)}</span></button>`).join('') || '<span class="dim" style="font-size:13px">—</span>'}</div>
        </div>
      </section>`;
  }

  function table(d, list) {
    const rows = list.map((c, i) => {
      const flags = [];
      if (c.eta_stale) flags.push(`<div class="flag warn">${IC.warn}ETA korábbi napra</div>`);
      const lt = lateInfo(c);
      if (lt) flags.push(`<div class="flag late">${IC.warn}${esc(lt.label)}</div>`);
      const drv = [c.driver, c.phone].filter(Boolean).join(' · ');
      return `
        <div class="tr row" data-id="${esc(c.id)}" style="--i:${Math.min(i, 12)}">
          <div><button type="button" class="cid" data-action="open" data-id="${esc(c.id)}">${esc(c.id)}</button><div class="sub2">${c.pdd.length} PDD</div></div>
          <div class="cell-mono pddcol">${c.pdd.filter(p => p.no).map(p => `<div>${esc(p.no)}</div>`).join('') || '<span class="dim">—</span>'}</div>
          <div><div class="cell-mono ${c.plate ? '' : 'dim'}">${c.plate ? esc(plate(c.plate)) : 'várható'}</div>${drv ? `<div class="sub2">${esc(drv)}</div>` : ''}</div>
          <span class="cell-mono ${c.t1 ? '' : 'dim'}" style="font-size:12.5px">${esc(c.t1 || '—')}</span>
          <span class="cell-mono r">${fmtInt(c.ctns)}</span>
          <span class="cell-mono r">${fmtInt(c.kg)}</span>
          ${isWorker() ? `<span class="cell-mono eta-ro ${c.eta_time ? '' : 'dim'}">${esc(c.eta_time || '—')}</span>` : `<input type="time" class="eta ${c.eta_time ? 'set' : ''}" value="${esc(c.eta_time)}" data-eta="${esc(c.id)}" aria-label="ETA ${esc(c.id)}" ${c.status === 'arrived' ? 'disabled' : ''}>`}
          <div><div class="ph ph-${phase(c).grp} phk-${phase(c).key}">${esc(stageText(c))}</div>${c.ramp ? ` <span class="ramp-chip">Rámpa ${c.ramp}</span>` : ''}${flags.join('')}</div>
        </div>`;
    }).join('');
    const emptyText = hasForecast(d) ? 'Erre a napra nincs bejelentett konténer.' : 'Erre a napra még nem jött előrejelzés.';
    const prev = addDays(d, -1), next = addDays(d, 1);
    const stepper = `
        <div class="daystep">
          <button type="button" class="ds-btn" data-action="dayshift" data-step="-1" aria-label="Előző nap: ${DOW[dowIdx(prev)]}">${IC.left}<span>${DOW[dowIdx(prev)]}</span></button>
          <div class="ds-cur"><b>${DOW[dowIdx(d)]}</b><span>${longLabel(d)}</span>${d === S.today ? '<i class="ds-today">ma</i>' : ''}</div>
          <button type="button" class="ds-btn" data-action="dayshift" data-step="1" aria-label="Következő nap: ${DOW[dowIdx(next)]}"><span>${DOW[dowIdx(next)]}</span>${IC.right}</button>
        </div>`;
    return `
      <section class="panel" aria-label="Konténerek" data-reveal>
        ${stepper}
        ${list.length ? `<div class="tbl-scroll"><div class="tbl">
          <div class="tr head"><span>Konténer</span><span>Fuvarlevél</span><span>Rendszám · sofőr</span><span>T1 / MRN</span><span class="r">Karton</span><span class="r">Súly (kg)</span><span>ETA</span><span>Állapot</span></div>
          ${rows}
        </div></div>` : `<div class="empty">${emptyText}</div>`}
      </section>`;
  }

  // ---------- havi nézet ----------
  function monthView() {
    const first = S.month + '-01';
    const f = parse(first);
    const last = iso(new Date(f.getFullYear(), f.getMonth() + 1, 0));
    const start = mondayOf(first);
    const end = addDays(last, 6 - dowIdx(last));
    const days = [];
    for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
    const lists = Object.fromEntries(days.map(d => [d, onDay(d)]));
    const inMonth = days.filter(d => d.slice(0, 7) === S.month);
    const mKg = inMonth.reduce((s, d) => s + sumKg(lists[d]), 0);
    const mN = inMonth.reduce((s, d) => s + lists[d].length, 0);
    const maxKg = Math.max(60000, ...days.map(d => sumKg(lists[d])));

    const cells = days.map((d, idx) => {
      const list = lists[d];
      const kg = sumKg(list);
      const out = d.slice(0, 7) !== S.month;
      const nodata = !list.length && !hasForecast(d);
      const r = Math.min(1, kg / maxKg);
      const weekend = dowIdx(d) >= 5;
      let bg = weekend ? 'oklch(0.982 0.003 255)' : 'oklch(0.995 0.001 255)';
      if (kg) bg = `oklch(${(0.995 - 0.035 * r).toFixed(3)} ${(0.035 * r).toFixed(3)} 60)`;
      const numCls = d === S.today ? 'today' : (out ? 'out' : '');
      return `
        <button type="button" class="cell ${nodata ? 'nodata' : ''}" style="background-color:${bg};--w:${Math.floor(idx / 7) + (idx % 7)}" data-action="cell" data-date="${d}" aria-pressed="${d === S.calSel}" aria-label="${longLabel(d)}, ${list.length} konténer">
          <div class="cell-top"><span class="cell-num ${numCls}">${parse(d).getDate()}</span>${list.length ? `<span class="cell-count">${list.length} db</span>` : ''}</div>
          <div class="pips">${list.map((c, k) => { const ph = phase(c); return `<i class="pip pip-${ph.grp}" style="--p:${Math.round(ph.p * 100)}%;--k:${Math.min(k, 9)}"></i>`; }).join('')}</div>
          ${list.length ? `<div class="cell-foot"><div class="bar"><i class="${d < S.today ? 'past' : ''}" style="width:${Math.round(r * 100)}%"></i></div><div class="cell-t">${fmtT(kg)}</div></div>` : ''}
        </button>`;
    }).join('');

    const m = parse(first);
    return `
      <div class="month">
        <section class="month-main" aria-label="Havi naptár">
          <div class="month-head">
            <h1><span class="slot">${MON[m.getMonth()].replace(/^./, ch => ch.toUpperCase())} <span>${m.getFullYear()}</span></span></h1>
            <div class="month-sum"><span><b>${num(mN, 'int', 120)}</b> db</span><span><b>${fmtT(mKg)}</b></span></div>
          </div>
          <div class="cal-wrap"><div class="panel cal">
            <div class="cal-dow">${DOW.map((x, i) => `<span style="--i:${i}" data-s="${DOW_S[i]}">${x}</span>`).join('')}</div>
            <div class="cal-grid"><i class="cal-ind" aria-hidden="true"></i>${cells}</div>
          </div></div>
        </section>
        ${monthSide()}
      </div>`;
  }

  function monthSide() {
    const d = S.calSel;
    const list = onDay(d);
    const rows = list.map((c, i) => {
      const ph = phase(c);
      const etaCls = c.arrived ? 'arrived' : (c.eta_time ? 'eta' : '');
      return `
        <button type="button" class="side-item" data-action="open" data-id="${esc(c.id)}" style="--i:${Math.min(i, 10)}">
          <span class="side-l"><i class="pip pip-${ph.grp} side-pip" style="--p:${Math.round(ph.p * 100)}%" aria-hidden="true"></i><span class="side-txt"><span class="mono">${esc(c.id)}</span><span class="sub2">${esc(c.plate ? plate(c.plate) : 'rendszám nélkül')} · ${fmtInt(c.kg)} kg</span></span></span>
          <span class="side-eta ${etaCls}">${esc(c.arrived ? stageText(c) : (c.eta_time || '—'))}</span>
        </button>`;
    }).join('');
    const wk = mondayOf(d);
    const wd = [...Array(7)].map((_, i) => addDays(wk, i));
    const wl = wd.map(x => sumKg(onDay(x)));
    const wn = wd.reduce((s, x) => s + onDay(x).length, 0);
    const wmax = Math.max(1, ...wl);
    return `
      <aside class="side" aria-label="Kiválasztott nap">
        <div class="side-day">
          <div class="title-row"><h2><span class="slot">${DOW[dowIdx(d)]}</span></h2><span class="sub">${longLabel(d)}</span></div>
          <div class="side-stats">
            <span style="--i:0"><b>${num(list.length, 'int', 120)}</b> db</span>
            <span style="--i:1"><b>${fmtInt(sumKg(list))}</b> kg</span>
            <span style="--i:2"><b>${num(sumCt(list), 'int', 200)}</b> karton</span>
            <span style="--i:3">ETA <b>${num(list.filter(etaDone).length, 'int', 240)}</b>/${list.length}</span>
          </div>
          <div class="side-list">${rows || `<div class="side-empty">${hasForecast(d) ? 'Nincs érkezés.' : 'Nincs előrejelzés.'}</div>`}</div>
          <button type="button" class="go" data-action="goto" data-date="${d}">Heti nézet${IC.go}</button>
        </div>
        <div class="weekbars">
          <div class="weekbars-head"><b>${isoWeek(wk)}. hét</b><span>${wn} db · ${fmtT(wl.reduce((a, b) => a + b, 0))}</span></div>
          ${wd.map((x, i) => `<div class="wb" style="--i:${i}"><span>${DOW_S[i]}</span><div class="wb-track"><i class="${x < S.today ? 'past' : ''}" style="width:${Math.round(wl[i] / wmax * 100)}%"></i></div><span>${wl[i] ? fmtT(wl[i]) : '—'}</span></div>`).join('')}
        </div>
      </aside>`;
  }

  // ---------- adatlap ----------
  const cp = v => (v ? `<button type="button" class="cpy" data-action="copy" data-v="${esc(v)}" aria-label="Másolás" title="Másolás">${IC.copy}</button>` : '');

  // mode: 'enter' (CSS-sel becsúszik), 'fly' (a kártyáról átrepülő rajzzal), 'step'/'back' (lapozás), üres: frissítés helyben, görgetés megtartva.
  let drawerTimer = null;
  let drawerFrom = null;
  function renderDrawer(mode) {
    const root = $('#drawer');
    const c = S.drawer && S.data.containers[S.drawer];
    if (!c) {
      S.drawer = null;
      if (!root.classList.contains('leaving')) root.innerHTML = '';
      return;
    }
    clearTimeout(drawerTimer);
    root.classList.remove('leaving');
    const prevSheet = root.querySelector('.sheet');
    const keepScroll = !mode && prevSheet && prevSheet.dataset.id === c.id ? prevSheet.scrollTop : 0;
    const dayList = c.state === 'active' ? onDay(c.day) : removedOn(c.removed_from);
    const idx = dayList.findIndex(x => x.id === c.id);
    const refDay = c.state === 'active' ? c.day : c.removed_from;
    const ph = phase(c);
    const late = lateInfo(c);
    const where = [c.fwd, c.port, c.customs].filter(Boolean).join(' · ');
    const stored = c.storedPdd || {};
    const pddRows = c.pdd.map((p, i) => {
      const at = p.no && stored[p.no.toUpperCase()];
      return `<div class="tr2" style="--i:${Math.min(i, 8)}"><span>${esc(p.no || '—')}${cp(p.no)}</span><span class="r">${p.kg == null ? '<span class="dim">—</span>' : fmtKg(p.kg) + cp(String(p.kg).replace('.', ','))}</span><span class="r">${p.ctns == null ? '<span class="dim">—</span>' : fmtInt(p.ctns) + cp(String(p.ctns))}</span><span class="r ${at ? 'ok' : 'dim'}">${at ? esc(stamp(at)) : '—'}</span></div>`;
    }).join('');
    const etaDate = c.eta_date || c.date;
    const active = c.state === 'active';
    const badge = !active ? `<span class="ph ph-out ph-lg">${esc(ST_LABEL.removed)}</span>` : `<span class="ph ph-${late ? 'late' : `${ph.grp} phk-${ph.key}`} ph-lg">${esc(late ? late.label : ph.label)}</span>`;
    const anim = { enter: ' enter', fly: ' fly', step: ' step', back: ' step back' }[mode] || '';

    root.innerHTML = `
      <div class="scrim${mode === 'enter' ? ' enter' : ''}" data-action="close"></div>
      <aside class="sheet${anim}" role="dialog" aria-modal="true" aria-label="${esc(c.id)}" tabindex="-1" data-id="${esc(c.id)}">
        <div class="sheet-head">
          <div class="sheet-bar">
            <button type="button" class="back" data-action="close">${IC.back}${DOW[dowIdx(refDay)]}, ${short(refDay)}</button>
            ${dayList.length > 1 ? `<div style="display:flex;align-items:center;gap:2px">
              <button type="button" class="ibtn" data-action="dstep" data-step="-1" aria-label="Előző konténer" ${idx <= 0 ? 'disabled style="opacity:.35"' : ''}>${IC.up}</button>
              <span class="mono" style="font-size:12px;color:var(--yard-muted);padding:0 6px">${idx + 1} / ${dayList.length}</span>
              <button type="button" class="ibtn" data-action="dstep" data-step="1" aria-label="Következő konténer" ${idx >= dayList.length - 1 ? 'disabled style="opacity:.35"' : ''}>${IC.down}</button>
            </div>` : ''}
          </div>
          <h2 class="sr">${esc(c.id)}</h2>
          <div class="sheet-ct">${containerSvg(c, { cls: 'ct-lg' })}</div>
          <div class="badges">${badge}${where ? `<span class="badge b-out">${esc(where)}</span>` : ''}</div>
        </div>
        <div class="sheet-body">
          <dl class="facts">
            <div style="--i:0"><dt>Konténer</dt><dd>${esc(c.id)}${cp(c.id)}</dd></div>
            <div style="--i:1"><dt>Rendszám</dt><dd>${c.plate ? esc(plate(c.plate)) + cp(plate(c.plate)) : '<span class="dim">várható</span>'}</dd></div>
            <div style="--i:2"><dt>T1 / MRN</dt><dd>${c.t1 ? esc(c.t1) + cp(c.t1) : '<span class="dim">várható</span>'}</dd></div>
            <div style="--i:3"><dt>Bruttó súly</dt><dd>${fmtKg(c.kg)} kg${cp(String(c.kg).replace('.', ','))}</dd></div>
            <div style="--i:4"><dt>Karton</dt><dd>${fmtInt(c.ctns)}${cp(String(c.ctns))}</dd></div>
            <div style="--i:5"><dt>Szállítási nap</dt><dd>${c.date ? `${c.date.replace(/-/g, '.')}.` + cp(c.date.replace(/-/g, '.') + '.') : '—'}<small>${c.date ? DOW[dowIdx(c.date)] : ''}</small></dd></div>
            <div style="--i:6"><dt>ETA</dt><dd>${c.eta_time ? esc(c.eta_time) + cp(c.eta_time) : '<span class="dim">nincs</span>'}${c.eta_time && c.eta_date && c.eta_date !== c.date ? `<small>${esc(short(c.eta_date))}</small>` : ''}</dd></div>
            <div style="--i:7"><dt>Rámpa</dt><dd>${c.ramp ? c.ramp + cp(String(c.ramp)) : '<span class="dim">—</span>'}</dd></div>
            <div class="wide" style="--i:8"><dt>Sofőr</dt><dd class="plain">${c.driver ? esc(c.driver) + cp(c.driver) : '<span class="dim">nincs megadva</span>'}${c.phone ? `<small>${esc(c.phone)}${cp(c.phone)}</small>` : ''}</dd></div>
          </dl>

          ${active && (c.arrived || c.stage || c.storage) ? stepper(c) : ''}

          ${c.pdd.length ? `<section class="panel pdd" aria-label="PDD tételek"><div class="tr2 head"><span>PDD</span><span class="r">kg</span><span class="r">karton</span><span class="r">betárolva</span></div>${pddRows}</section>` : ''}

          ${active && (c.arrived || c.ramp) ? rampPicker(c) : ''}

          ${mailBox(c)}

          ${active && !isWorker() ? `
          <section class="etabox" aria-label="Pontos ETA">
            <div class="etabox-head"><b>Pontos ETA</b>${c.eta_time && c.eta_set ? `<span class="saved">${IC.check}Mentve · ${esc(stamp(c.eta_set))}</span>` : ''}</div>
            ${c.updated_by ? `<div class="editor">Utoljára módosította: ${esc(who(c.updated_by))} · ${esc(stamp(c.updated_at))}</div>` : ''}
            ${c.eta_stale ? `<div class="flag warn" style="margin-top:8px">${IC.warn}Az ETA a korábbi szállítási napra szólt.</div>` : ''}
            <div class="eta-grid">
              <label>Dátum<input type="date" class="field" id="eta-date" value="${esc(etaDate)}"></label>
              <label>Időpont<input type="time" class="field time ${c.eta_time ? 'set' : ''}" id="eta-time" value="${esc(c.eta_time)}"></label>
            </div>
            <div class="btns">
              <button type="button" class="btn-primary" data-action="save-eta">Mentés</button>
              ${c.eta_time ? '<button type="button" class="btn-ghost" data-action="clear-eta">Törlés</button>' : ''}
            </div>
          </section>` : ''}

          <label class="note">Megjegyzés
            <textarea id="note" rows="3" data-id="${esc(c.id)}">${esc(c.note)}</textarea>
          </label>
        </div>
      </aside>`;
    const sh = root.querySelector('.sheet');
    if (keepScroll) sh.scrollTop = keepScroll;
    if (mode === 'enter' || mode === 'fly') sh.focus({ preventScroll: true });
  }

  // Kártyáról nyitva a konténerrajz átrepül az adatlap fejlécébe.
  function openDrawer(id, fromEl) {
    const wasOpen = !!(S.drawer && $('#drawer .sheet'));
    drawerFrom = fromEl ? fromEl.dataset.id : drawerFrom;
    const svg = !wasOpen && fromEl && fromEl.querySelector('.ct');
    S.drawer = id;
    if (!svg || !canFly()) { renderDrawer(wasOpen ? 'step' : 'enter'); return; }
    // A kártya konténerrajza átrepül az adatlap fejlécébe; a cél a becsúszó lap végső helye (a lap 80 px-ről indul).
    renderDrawer('fly');
    const sheet = $('#drawer .sheet');
    const target = sheet.querySelector('.sheet-ct .ct');
    const t = target.getBoundingClientRect();
    const end = { left: t.left - 80, top: t.top, width: t.width };
    // A kártyán felemelt konténert a daru viszi át; ha nem volt felemelve (billentyűzet), a kampó előbb ráereszkedik.
    const card = fromEl.closest('.ccard');
    const lifted = !!card && card.matches(':hover');
    if (card) {
      document.querySelectorAll('#view .ccard.away').forEach(x => x.classList.remove('away'));
      card.classList.add('away');
      craneFly(svg, end, 900, lifted ? 0 : 260).then(() => sheet.classList.add('landed'));
    } else {
      flyClone(svg, flyTo(end), 560).finished.finally(() => sheet.classList.add('landed'));
    }
  }

  // Lapozás az adatlapon: a régi konténer kifut, az új a másik irányból érkezik (futószalag).
  function stepDrawer(id, step) {
    const old = $('#drawer .sheet-ct .ct');
    if (old && canFly()) {
      flyClone(old, () => [{ transform: 'none', opacity: 1 }, { transform: `translateY(${step > 0 ? -44 : 44}px)`, opacity: 0 }], 260, 'cubic-bezier(.55,0,.75,.2)');
    }
    S.drawer = id;
    renderDrawer(step > 0 ? 'step' : 'back');
  }

  function closeDrawer() {
    if (!S.drawer) return;
    const id = S.drawer;
    const root = $('#drawer');
    const back = () => {
      const el = drawerFrom && document.querySelector(`#view [data-id="${CSS.escape(drawerFrom)}"][data-action="open"]`);
      if (el) el.focus({ preventScroll: true });
      drawerFrom = null;
    };
    S.drawer = null;
    // Ha a kártya látszik, a rajz visszarepül a helyére, a lap közben kicsúszik.
    const card = document.querySelector(`#view .ccard[data-id="${CSS.escape(id)}"] .ct`);
    const from = root.querySelector('.sheet-ct .ct');
    const r = card && card.getBoundingClientRect();
    document.querySelectorAll('#view .ccard.away').forEach(x => { if (!card || !x.contains(card)) x.classList.remove('away'); });
    if (card && from && canFly() && r.bottom > 0 && r.top < window.innerHeight) {
      // A daru visszaviszi a konténert a kártyára, a lap közben kicsúszik.
      const cc = card.closest('.ccard');
      cc.classList.add('away');
      craneFly(from, r, 700, 200, () => cc.matches(':hover')).then(() => cc.classList.remove('away'));
      from.style.opacity = '0';
    } else if (card) card.closest('.ccard').classList.remove('away');
    if (!root.firstChild || RM.matches) { root.innerHTML = ''; back(); return; }
    root.classList.add('leaving');
    clearTimeout(drawerTimer);
    drawerTimer = setTimeout(() => { root.classList.remove('leaving'); if (!S.drawer) root.innerHTML = ''; }, 260);
    back();
  }

  // ---------- ETA beillesztése ----------
  function parseEtas(text) {
    const out = [];
    const re = /([A-Z]{4}\s?\d{7})\s*\/\/([\s\S]*?)(?=[A-Z]{4}\s?\d{7}\s*\/\/|$)/g;
    let m;
    while ((m = re.exec((text || '').toUpperCase()))) {
      const t = /ETA\s*[:\-]?\s*(\d{1,2})\s*[:.]\s*(\d{2})/.exec(m[2]);
      if (!t) continue;
      const h = +t[1], mi = +t[2];
      if (h > 23 || mi > 59) continue;
      out.push({ container: m[1].replace(/\s/g, ''), time: `${pad(h)}:${pad(mi)}` });
    }
    return out;
  }

  let pasteSeen = new Set();
  function renderPaste() {
    const items = parseEtas($('#paste-text').value);
    $('#paste-save').disabled = !items.length;
    // Csak az újonnan felismert sorok csúsznak be, a már látottak helyben maradnak.
    let k = 0;
    $('#paste-list').innerHTML = items.map(it => {
      const c = S.data.containers[it.container];
      const day = c && c.state === 'active' ? `${DOW[dowIdx(c.date)]}, ${short(c.date)}` : 'nincs a tervben';
      const key = it.container + it.time;
      const fresh = !pasteSeen.has(key);
      return `<div class="pl-row${fresh ? ' new' : ''}" style="--i:${fresh ? k++ : 0}"><span>${esc(it.container)}</span><span class="pl-day ${c && c.state === 'active' ? '' : 'unk'}">${esc(day)}</span><b>${esc(it.time)}</b></div>`;
    }).join('');
    pasteSeen = new Set(items.map(it => it.container + it.time));
  }

  async function savePaste() {
    const items = parseEtas($('#paste-text').value);
    if (!items.length) return;
    const now = new Date().toISOString();
    const rows = items.map(it => {
      const c = S.data.containers[it.container];
      const d = c && c.state === 'active' ? c.date : null;
      return { container: it.container, eta_date: d, eta_time: it.time, eta_for: d, eta_set: now };
    });
    const { data, error } = await sb.from('manual').upsert(rows, { onConflict: 'container' }).select();
    if (error) { toast('A mentés nem sikerült'); console.error(error); return; }
    data.forEach(r => { MAN[r.container] = normMan(r); });
    rebuild();
    $('#paste').close();
    render();
    toast(`${data.length} ETA rögzítve`);
  }

  // ---------- műveletek ----------
  // Egyszerre egy értesítés látszik; az új kiszorítja a régit, alul fogyó csík jelzi az időt.
  let toastEl = null, toastTimer = null;
  function toast(msg) {
    if (toastEl) { const old = toastEl; old.classList.add('out'); setTimeout(() => old.remove(), 200); }
    clearTimeout(toastTimer);
    const t = toastEl = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    toastTimer = setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => { t.remove(); if (toastEl === t) toastEl = null; }, 220);
    }, 2400);
  }

  // A nagy nézetváltások nem használnak View Transitiont (az egész oldal stílusát újraszámoltatná),
  // az irányt az érkező tartalom és a pörgő időszakfelirat adja.
  function nav(step) {
    S.pdir = step;
    if (S.view === 'week') {
      S.week = addDays(S.week, step * 7);
      S.sel = addDays(S.sel, step * 7);
      render(`yard main ${step > 0 ? 'fwd' : 'back'}`);
    } else {
      const d = parse(S.month + '-01');
      d.setMonth(d.getMonth() + step);
      S.month = iso(d).slice(0, 7);
      if (S.calSel.slice(0, 7) !== S.month) S.calSel = S.month + '-01';
      render(`cal side ${step > 0 ? 'fwd' : 'back'}`);
    }
  }

  // Napléptetés: a szomszéd napra lép; ha az másik hétre esik, a hét is vált (a sáv és a tartalom a hétváltás irányába érkezik).
  function shiftDay(step) {
    if (S.view !== 'week') return;
    const d = addDays(S.sel, step);
    if (mondayOf(d) === S.week) { selectDay(d); return; }
    S.pdir = step;
    S.sel = d; S.week = mondayOf(d);
    render(`yard main ${step > 0 ? 'fwd' : 'back'}`);
  }

  function goToday() {
    const t = iso(new Date());
    if (S.view === 'week' && S.sel === t && S.week === mondayOf(t)) {
      // Már a mai napon állunk: csak jelezzük, hol van.
      const el = document.querySelector('#view .day.is-today');
      if (el) { el.classList.remove('ping'); void el.offsetWidth; el.classList.add('ping'); }
      window.scrollTo({ top: 0, behavior: RM.matches ? 'auto' : 'smooth' });
      return;
    }
    const ref = S.view === 'month' ? S.month + '-01' : S.week;
    const dir = t < ref ? -1 : t > (S.view === 'month' ? S.month + '-31' : addDays(S.week, 6)) ? 1 : 0;
    S.pdir = dir;
    S.today = t;
    S.sel = S.today; S.week = mondayOf(S.today);
    S.month = S.today.slice(0, 7); S.calSel = S.today;
    render(`${S.view === 'month' ? 'cal side' : 'yard main'}${dir > 0 ? ' fwd' : dir < 0 ? ' back' : ''}`);
  }

  // Nap- és cellaválasztás: csak az érintett panel épül újra, a sáv és a naptár helyben marad, a jelölő átcsúszik.
  function swapIn(sel, html, zone) {
    const v = $('#view');
    const old = v.querySelector(sel);
    if (!old) return null;
    v.className = `ev-${zone} ev-solo`;
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const el = tpl.content.firstElementChild;
    old.replaceWith(el);
    awaitReveal(v);
    countUp(el);
    diffFlash(true);
    rememberP();
    return el;
  }
  function selectDay(d) {
    S.sel = d;
    if (S.view !== 'week' || !$('#view .main')) { render('main'); return; }
    $('#view').querySelectorAll('.day').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.date === d)));
    placeDayInd();
    swapIn('.main', dayPanel(), 'main');
  }
  function selectCell(d) {
    S.calSel = d;
    if (S.view !== 'month' || !$('#view .side')) { render('side'); return; }
    $('#view').querySelectorAll('.cell').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.date === d)));
    placeCalInd(true);
    swapIn('.side', monthSide(), 'side');
  }

  function switchView(next) {
    if (next === S.view || (next === 'stats' && isWorker())) return;
    const dir = VIEWS.indexOf(next) - VIEWS.indexOf(S.view);
    S.view = next;
    if (next === 'month') { S.month = S.sel.slice(0, 7); S.calSel = S.sel; }
    render(`${ZONES[next]} ${dir > 0 ? 'fwd' : 'back'}`);
  }

  async function saveEta(id, d, t) {
    const c = S.data.containers[id];
    if (!c || isWorker()) return false;
    const row = t
      ? { container: id, eta_date: d || c.date, eta_time: t, eta_for: c.date, eta_set: new Date().toISOString() }
      : { container: id, eta_date: null, eta_time: null, eta_for: null, eta_set: null };
    return upsertManual(row);
  }

  async function openFile(path) {
    const { data, error } = await sb.storage.from('t1').createSignedUrl(path, 600);
    if (error || !data) { toast('A fájl nem nyitható meg'); return; }
    if (isExe()) exe().open_url(data.signedUrl);
    else window.open(data.signedUrl, '_blank', 'noopener');
  }

  // ---------- érkezési email ----------
  const MAIL_TO = ['h7wh@hgllog.com', 'e-commerce@hgllog.com', 'eker.vam@hgllog.com'];
  function mailParts(c) {
    const d = new Date();
    const day = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    const mrn = c.t1 || '';
    const subject = `Érkező B2B konténer // ${c.id}// MRN ${mrn} ${day}`.replace(/ {2,}/g, ' ');
    const lines = [
      'Érkezett egy B2B konténer.',
      `MRN ${mrn}`.trim(),
      `Konténer szám: ${c.id}`,
      `Rendszám: ${plate(c.plate)}`.trim(),
      '',
      'Csatolom a képeket és dokumentációt.',
      '',
      'Kérnénk szépen nyitást!'
    ];
    return { to: MAIL_TO, subject, lines, body: lines.join('\n') };
  }

  function mailBox(c) {
    const m = mailParts(c);
    const miss = [!c.t1 && 'MRN', !c.plate && 'rendszám'].filter(Boolean);
    return `
      <section class="mailbox" aria-label="Nyitáskérelem">
        <div class="mail-head">
          <b>Nyitáskérelem</b>
          <button type="button" class="btn-primary sm mail-go" data-action="mail">${IC.mail}Nyitáskérelem küldése</button>
        </div>
        ${miss.length ? `<div class="flag warn">${IC.warn}Hiányzik: ${esc(miss.join(', '))}</div>` : ''}
        <dl class="mail-pv">
          <div><dt>Címzett</dt><dd><span>${esc(m.to.join('; '))}</span>${cp(m.to.join('; '))}</dd></div>
          <div><dt>Tárgy</dt><dd><span>${esc(m.subject)}</span>${cp(m.subject)}</dd></div>
          <div class="mail-txt"><dt>Szöveg</dt><dd><span>${m.lines.map(l => esc(l) || '&nbsp;').join('<br>')}</span>${cp(m.body)}</dd></div>
        </dl>
      </section>`;
  }

  // Az Outlook webes levélírója nyílik meg: a piszkozatba a felhasználó saját, Outlookban beállított aláírása kerül
  // (az új Outlook mailto-val nyitott levélbe nem tesz aláírást). Elküldeni a felhasználó küldi.
  function composeUrl(m) {
    const q = v => encodeURIComponent(v);
    return `https://outlook.office.com/mail/deeplink/compose?to=${q(m.to.join(';'))}&subject=${q(m.subject)}&body=${q(m.body + '\n')}`;
  }

  async function openMail(id) {
    const c = S.data.containers[id];
    if (!c) return;
    const url = composeUrl(mailParts(c));
    if (isExe()) {
      if (await exe().open_url(url)) return;
      toast('Frissítsd az alkalmazást');
      return;
    }
    const w = window.open(url, '_blank');
    if (w) w.opener = null;
    else location.href = url;
  }

  // ---------- felhasználók ----------
  function inviteUrl(key) {
    return `${(window.KF_CONFIG && window.KF_CONFIG.site) || (location.origin + location.pathname)}#k=${key}`;
  }

  function showLink(name, key) {
    const box = $('#newpw');
    const url = inviteUrl(key);
    box.hidden = false;
    box.innerHTML = `<span><b>${esc(name)}</b> személyes linkje</span><code class="link">${esc(url)}</code><button type="button" class="u-btn" data-action="copy-pw" data-pw="${esc(url)}">Másolás</button>`;
  }

  // Relatív időbélyeg: „most”, „12 perce”, „ma 14:05”, „tegnap 09:12”, „10.14. 08:30”.
  function ago(ts) {
    if (!ts) return '';
    const t = new Date(ts);
    if (isNaN(t)) return '';
    const min = Math.round((Date.now() - t) / 60000);
    if (min < 1) return 'most';
    if (min < 60) return `${min} perce`;
    const loc = toLocal(ts);
    const d = loc.slice(0, 10);
    if (d === S.today) return `ma ${hm(loc)}`;
    if (d === addDays(S.today, -1)) return `tegnap ${hm(loc)}`;
    return stamp(loc);
  }

  let PEOPLE = [];
  let peopleFilter = 'all';
  // pending: még nem nyitotta meg a linkjét; online: az elmúlt ~10 percben aktív (a lap 5 percenként jelez).
  const peopleState = u => {
    if (!(u.first_login || u.link_used_at || u.last_seen)) return 'pending';
    if (u.last_seen && Date.now() - new Date(u.last_seen) < 11 * 60000) return 'online';
    return 'in';
  };

  async function loadUsers() {
    let users;
    try { users = (await usersFn('list')).users || []; }
    catch (_) {
      const { data } = await sb.from('members').select('email, role, name, last_seen, added_at, added_by').order('name');
      users = (data || []).map(u => ({ ...u, fixed: !u.email.endsWith('@csapat.invalid') }));
    }
    PEOPLE = users;
    users.forEach(u => { if (u.name) MEMBERS[u.email] = u.name; });
    renderPeopleSummary();
    if ($('#people').open) renderPeople();
  }

  function renderPeopleSummary() {
    const n = PEOPLE.length;
    const pend = PEOPLE.filter(u => peopleState(u) === 'pending').length;
    const on = PEOPLE.filter(u => peopleState(u) === 'online').length;
    $('#users-sum').innerHTML = [
      [n, 'fő', ''],
      [n - pend, 'belépett', ''],
      [pend, 'még nem', pend ? 'warn-t' : ''],
      [on, 'most aktív', on ? 'ok-t' : '']
    ].map(([v, l, c]) => `<span><b class="${c}">${v}</b>${l}</span>`).join('');
  }

  const DOTS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>';

  function renderPeople() {
    const edits = {};
    Object.values(MAN).forEach(m => { if (m.updated_by) edits[m.updated_by] = (edits[m.updated_by] || 0) + 1; });
    const byName = (a, b) => (a.name || '').localeCompare(b.name || '', 'hu');
    const counts = { all: PEOPLE.length, online: 0, in: 0, pending: 0 };
    PEOPLE.forEach(u => { counts[peopleState(u)]++; });
    counts.in += counts.online;

    $('#p-sum').innerHTML = [
      ['all', 'Összesen', counts.all, ''],
      ['in', 'Belépett', counts.in, ''],
      ['pending', 'Még nem lépett be', counts.pending, counts.pending ? 'warn' : ''],
      ['online', 'Most aktív', counts.online, counts.online ? 'ok' : '']
    ].map(([k, l, v, cls]) => `<button type="button" class="p-tile ${cls}" data-action="people-filter" data-f="${k}" aria-pressed="${peopleFilter === k}"><b>${v}</b><span>${l}</span></button>`).join('');

    const match = u => {
      const st = peopleState(u);
      return peopleFilter === 'all' || st === peopleFilter || (peopleFilter === 'in' && st === 'online');
    };
    const shown = PEOPLE.filter(match);
    // Mind nézetben: előbb a még be nem lépettek, utána rangonként; szűrve egy lista.
    const groups = peopleFilter !== 'all'
      ? [['', shown.slice().sort(byName)]]
      : [
          ['Még nem lépett be', shown.filter(u => peopleState(u) === 'pending').sort(byName), 'pending'],
          ...['admin', 'editor', 'worker'].map(r => [{ admin: 'Adminok', editor: 'Szerkesztők', worker: 'Dolgozók' }[r], shown.filter(u => u.role === r && peopleState(u) !== 'pending').sort(byName)])
        ].filter(g => g[1].length);

    let i = 0;
    const row = u => {
      const st = peopleState(u);
      const me = u.email === ME.email;
      const locked = u.fixed || me;
      const first = u.first_login || u.link_used_at;
      const status = st === 'pending'
        ? `Meghívó elküldve${u.link_at ? ` · ${esc(ago(u.link_at))}` : ''}`
        : st === 'online' ? 'Most aktív' : `Aktív ${esc(ago(u.last_seen || first))}`;
      const unusedNew = st !== 'pending' && u.link_at && !u.link_used_at && u.links > 1;
      const n = i++;
      const roleCtl = locked
        ? `<span class="p-role-ro r-${esc(u.role)}">${ROLE_L[u.role] || esc(u.role)}</span>`
        : `<label class="sr" for="role-${n}">Rang</label><select id="role-${n}" class="p-role r-${esc(u.role)}" data-email="${esc(u.email)}">${['worker', 'editor', 'admin'].map(r => `<option value="${r}"${r === u.role ? ' selected' : ''}>${ROLE_L[r]}</option>`).join('')}</select>`;
      return `
      <li class="urow p-row st-${st}" style="--i:${Math.min(n, 12)}">
        <div class="p-who">
          <i class="p-dot" aria-hidden="true"></i>
          <div class="p-id">
            <span class="u-name">${esc(u.name || u.email)}${me ? '<small>te</small>' : ''}${u.fixed ? '<small>exe</small>' : ''}</span>
            <span class="p-st">${status}</span>
          </div>
        </div>
        <div class="p-rolecell">${roleCtl}</div>
        <dl class="p-facts">
          <div><dt>Meghívta</dt><dd class="sans">${u.added_by && MEMBERS[u.added_by] ? esc(MEMBERS[u.added_by]) : '—'}<small>${u.added_at ? esc(stamp(toLocal(u.added_at))) : ''}</small></dd></div>
          <div><dt>Első belépés</dt><dd>${first ? esc(stamp(toLocal(first))) : st === 'pending' ? '<span class="dim">—</span>' : '<span class="dim">korábban</span>'}</dd></div>
          <div><dt>Utoljára</dt><dd>${u.last_seen ? esc(stamp(toLocal(u.last_seen))) : '<span class="dim">—</span>'}</dd></div>
          <div><dt>Módosított</dt><dd>${edits[u.email] || 0}<small>konténer</small></dd></div>
        </dl>
        <div class="p-acts">${locked ? '' : `${st === 'pending' ? `<button type="button" class="u-btn" data-action="user-link" data-email="${esc(u.email)}" data-name="${esc(u.name || '')}">Új link</button>` : ''}
          <details class="p-menu">
            <summary class="p-more" aria-label="Műveletek">${DOTS}</summary>
            <div class="p-pop">
              <button type="button" data-action="user-rename" data-email="${esc(u.email)}" data-name="${esc(u.name || '')}">Átnevezés</button>
              <button type="button" data-action="user-link" data-email="${esc(u.email)}" data-name="${esc(u.name || '')}">Új meghívó link</button>
              <button type="button" class="danger" data-action="user-remove" data-email="${esc(u.email)}">Eltávolítás</button>
            </div>
          </details>`}
        </div>
        ${unusedNew ? `<div class="flag warn p-note">${IC.warn}Az új link még nincs megnyitva</div>` : ''}
      </li>`;
    };
    $('#users').innerHTML = groups.length
      ? groups.map(([title, list, cls]) => `${title ? `<li class="p-group${cls ? ' g-' + cls : ''}"><span>${title}</span><b>${list.length}</b></li>` : ''}${list.map(row).join('')}`).join('')
      : '<li class="p-empty">Nincs ilyen felhasználó.</li>';
  }

  function openPeople() {
    $('#newpw').hidden = true;
    peopleFilter = 'all';
    renderPeople();
    if ($('#settings').open) $('#settings').close();
    $('#people').showModal();
    loadUsers();
  }

  function renderMe() {
    const nm = ME.name || ME.email;
    const ini = nm.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    $('#me').innerHTML = `<span class="me-av" aria-hidden="true">${esc(ini)}</span><span class="me-txt"><b>${esc(nm)}</b><span class="me-role r-${esc(ME.role)}">${ROLE_L[ME.role] || esc(ME.role)}</span></span>${isExe() ? '<span class="me-dev">Exe</span>' : ''}`;
  }

  async function openSettings() {
    renderMe();
    const admin = ME.role === 'admin';
    $('#users-sec').hidden = !admin;
    $('#ramp-sec').hidden = !admin;
    $('#ramp-count').textContent = RAMPS;
    $('#app-sec').hidden = !isExe();
    if (admin) loadUsers();
    if (isExe()) {
      try { $('#autostart').checked = !!(await exe().get_settings()).autostart; } catch (_) { /* régi exe */ }
    }
    $('#settings').showModal();
  }

  let rampTimer = null;
  function stepRamps(step) {
    const n = Math.max(1, Math.min(99, Number($('#ramp-count').textContent) + step));
    $('#ramp-count').textContent = n;
    clearTimeout(rampTimer);
    rampTimer = setTimeout(async () => {
      const { error } = await sb.from('app_settings').update({ ramp_count: n }).eq('id', 1);
      if (error) { toast('A mentés nem sikerült'); $('#ramp-count').textContent = RAMPS; return; }
      RAMPS = n;
      toast(`Rámpák: ${n}`);
      if (S.pending || !editing()) { rebuild(); render(); }
    }, 500);
  }

  document.addEventListener('click', async e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const a = el.dataset.action;
    switch (a) {
      case 'view': switchView(el.dataset.view); break;
      case 'prev': nav(-1); break;
      case 'next': nav(1); break;
      case 'today': goToday(); break;
      case 'day': if (el.dataset.date !== S.sel) selectDay(el.dataset.date); break;
      case 'dayshift': shiftDay(Number(el.dataset.step)); break;
      case 'cell': if (el.dataset.date !== S.calSel) selectCell(el.dataset.date); break;
      case 'goto': {
        const d = el.dataset.date;
        S.drawer = null;
        S.view = 'week'; S.sel = d; S.week = mondayOf(d);
        render('yard main back');
        window.scrollTo({ top: 0, behavior: RM.matches ? 'auto' : 'smooth' });
        break;
      }
      case 'open': openDrawer(el.dataset.id, el); break;
      case 'close': closeDrawer(); break;
      case 'dstep': {
        const c = S.data.containers[S.drawer];
        const list = c.state === 'active' ? onDay(c.day) : removedOn(c.removed_from);
        const step = Number(el.dataset.step);
        const i = list.findIndex(x => x.id === c.id) + step;
        if (list[i]) stepDrawer(list[i].id, step);
        break;
      }
      case 'refresh':
        if (isExe()) {
          LOCAL = { ...(LOCAL || {}), busy: true };
          renderSync();
          await exe().refresh();
        } else {
          el.classList.add('spin-once');
          await loadAll();
          toast('Frissítve');
        }
        break;
      case 'settings': openSettings(); break;
      case 'stats-range': {
        const n = Number(el.dataset.days);
        if (n !== S.statsDays) { S.statsDays = n; render('stats'); }
        break;
      }
      case 'qopen': {
        const c = S.data.containers[el.dataset.id];
        $('#q').value = ''; renderSearch();
        $('#q').blur();
        if (c) {
          const day = c.state === 'active' ? c.day : c.removed_from;
          const sameWeek = S.view === 'week' && day && S.week === mondayOf(day);
          const enter = !day ? '' : !sameWeek ? 'yard main' : S.sel !== day ? 'main' : '';
          const go = () => {
            if (day) { S.view = 'week'; S.sel = day; S.week = mondayOf(day); }
            S.drawer = c.id;
            render(enter);
            renderDrawer('enter');
          };
          go();
        }
        break;
      }
      case 'ramp': {
        const c = S.data.containers[S.drawer];
        const n = Number(el.dataset.ramp);
        const val = c.ramp === n ? null : n;
        if (await upsertManual({ container: c.id, ramp: val, ramp_set: val ? new Date().toISOString() : null })) toast(val ? `Rámpa ${val}` : 'Rámpa törölve');
        break;
      }
      case 'paste': if (isWorker()) break; $('#paste-text').value = ''; pasteSeen = new Set(); renderPaste(); $('#paste').showModal(); setTimeout(() => $('#paste-text').focus(), 30); break;
      case 'paste-close': $('#paste').close(); break;
      case 'paste-save': await savePaste(); break;
      case 'settings-close': $('#settings').close(); break;
      case 'people': openPeople(); break;
      case 'ramps': stepRamps(Number(el.dataset.step)); break;
      case 'people-close': $('#people').close(); break;
      case 'people-filter': peopleFilter = el.dataset.f; renderPeople(); break;
      case 'logout': await sb.auth.signOut(); location.reload(); break;
      case 'resync':
        $('#settings').close();
        await exe().resync_all();
        toast('A levelek újraolvasása elindult');
        break;
      case 'datafolder': await exe().open_data_folder(); break;
      case 'file': await openFile(el.dataset.path); break;
      case 'save-eta': {
        const t = $('#eta-time').value, d = $('#eta-date').value;
        if (await saveEta(S.drawer, d, t)) {
          toast(t ? 'ETA mentve' : 'ETA törölve');
          const box = $('#drawer .etabox');
          if (box && t) box.classList.add('just-saved');
        }
        break;
      }
      case 'mail': await openMail(S.drawer); break;
      case 'clear-eta': if (isWorker()) break; if (await saveEta(S.drawer, '', '')) toast('ETA törölve'); break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(el.dataset.v);
          toast('Másolva');
          // A gomb egy pillanatra pipára vált.
          if (!el.classList.contains('done')) {
            const html = el.innerHTML;
            el.classList.add('done');
            el.innerHTML = IC.check;
            setTimeout(() => { el.classList.remove('done'); el.innerHTML = html; }, 1300);
          }
        } catch (_) { toast('A másolás nem sikerült'); }
        break;
      case 'copy-pw':
        try { await navigator.clipboard.writeText(el.dataset.pw); toast('Link másolva'); } catch (_) { /* kijelölhető marad */ }
        break;
      case 'user-rename': {
        const li = el.closest('.urow');
        const cur = el.dataset.name || '';
        if (li.querySelector('.u-edit')) break;
        li.querySelector('.u-name').outerHTML = `<form class="u-edit" data-email="${esc(el.dataset.email)}"><label class="sr" for="ren-${esc(el.dataset.email)}">Név</label><input id="ren-${esc(el.dataset.email)}" value="${esc(cur)}" maxlength="80" required><button type="submit" class="u-btn">Mentés</button></form>`;
        li.querySelector('.u-edit input').focus();
        break;
      }
      case 'user-link': {
        try { const r = await usersFn('relink', { email: el.dataset.email }); showLink(el.dataset.name, r.key); toast('Új link készült, a régi megszűnt'); }
        catch (err) { toast(err.message); }
        break;
      }
      case 'user-remove': {
        if (el.dataset.confirm !== '1') { el.dataset.confirm = '1'; el.textContent = 'Biztosan?'; return; }
        try { await usersFn('remove', { email: el.dataset.email }); toast('Felhasználó eltávolítva'); loadUsers(); }
        catch (err) { toast(err.message); }
        break;
      }
    }
  });

  document.addEventListener('change', async e => {
    const el = e.target;
    if (el.matches('select.p-role')) {
      try { await usersFn('role', { email: el.dataset.email, role: el.value }); toast(`Új rang: ${ROLE_L[el.value]}`); }
      catch (err) { toast(err.message); }
      loadUsers();
      return;
    }
    if (el.id === 'ramp-input') {
      const n = el.value === '' ? null : Math.max(1, Math.min(99, Math.round(Number(el.value))));
      const c = S.data.containers[el.dataset.id];
      if (c && (c.ramp || null) !== n && await upsertManual({ container: c.id, ramp: n, ramp_set: n ? new Date().toISOString() : null })) toast(n ? `Rámpa ${n}` : 'Rámpa törölve');
      return;
    }
    if (el.matches('input.eta[data-eta]') && !isWorker()) {
      const c = S.data.containers[el.dataset.eta];
      if (c) saveEta(c.id, c.eta_date || c.date, el.value);
    }
  });

  let noteTimer = null;
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.id === 'q') { renderSearch(); return; }
    if (el.id === 'paste-text') { renderPaste(); return; }
    if (el.id === 'note') {
      clearTimeout(noteTimer);
      const id = el.dataset.id, val = el.value;
      noteTimer = setTimeout(async () => {
        const { data, error } = await sb.from('manual').upsert({ container: id, note: val.trim() || null }, { onConflict: 'container' }).select().single();
        if (error) toast('A megjegyzés mentése nem sikerült');
        else MAN[id] = normMan(data);
      }, 600);
    }
  });

  document.addEventListener('focusout', () => {
    setTimeout(() => { if (S.pending && !editing()) { rebuild(); render(); } }, 60);
  });

  document.addEventListener('pointerover', e => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    const tip = $('#tip');
    if (!t) { tip.hidden = true; return; }
    tip.textContent = t.dataset.tip;
    tip.hidden = false;
  });
  document.addEventListener('pointermove', e => {
    const tip = $('#tip');
    if (tip.hidden) return;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const x = Math.min(window.innerWidth - w - 8, e.clientX + 14);
    const y = e.clientY - h - 12 < 8 ? e.clientY + 18 : e.clientY - h - 12;
    tip.style.transform = `translate(${Math.max(8, x)}px, ${y}px)`;
  });
  document.addEventListener('click', e => {
    // Felhasználói műveletmenü: egyszerre egy nyitva, kattintásra (vagy választás után) bezárul.
    const own = e.target.closest('.p-menu');
    document.querySelectorAll('.p-menu[open]').forEach(d => {
      if (d !== own || (e.target.closest('.p-pop button') && !e.target.closest('[data-action="user-remove"]'))) d.open = false;
    });
    if (!e.target.closest('.search')) { const b = $('#qres'); if (b && !b.hidden) { b.hidden = true; } }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.activeElement === $('#q')) { $('#q').value = ''; renderSearch(); return; }
    if (e.key === 'Escape' && S.drawer && !$('#settings').open && !$('#paste').open && !$('#people').open) closeDrawer();
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey
        && S.view === 'week' && S.data && !S.drawer && !$('#settings').open && !$('#paste').open && !$('#people').open) {
      const t = e.target;
      if (t && t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
      e.preventDefault();
      shiftDay(e.key === 'ArrowLeft' ? -1 : 1);
    }
  });

  // Görgetéskor a fejléc árnyékot kap, hogy elváljon a tartalomtól.
  let scrolled = false;
  window.addEventListener('scroll', () => {
    const s = window.scrollY > 4;
    if (s !== scrolled) { scrolled = s; document.querySelector('.top').classList.toggle('scrolled', s); }
  }, { passive: true });

  $('#settings').addEventListener('close', () => {
    if (S.pending) { rebuild(); render(); }
  });
  $('#paste').addEventListener('close', () => {
    if (S.pending) { rebuild(); render(); }
  });

  // ---------- űrlapok ----------
  document.addEventListener('submit', async e => {
    const f = e.target.closest && e.target.closest('.u-edit');
    if (!f) return;
    e.preventDefault();
    const name = f.querySelector('input').value.trim();
    if (!name) return;
    const { error } = await sb.from('members').update({ name }).eq('email', f.dataset.email);
    if (error) { toast('A mentés nem sikerült'); return; }
    MEMBERS[f.dataset.email] = name;
    toast('Név mentve');
    loadUsers();
  });

  $('#user-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#user-name').value.trim();
    if (!name) return;
    try {
      const role = ($('#user-form').querySelector('input[name="invite-role"]:checked') || {}).value || 'worker';
      const r = await usersFn('invite', { name, role });
      $('#user-name').value = '';
      showLink(name, r.key);
      loadUsers();
      MEMBERS[r.email] = name;
    } catch (err) {
      toast(err.message);
    }
  });

  // ---------- automatikus frissítés új verziónál ----------
  async function checkVersion() {
    try {
      const r = await fetch('version.json', { cache: 'no-store' });
      if (!r.ok) return;
      const v = (await r.json()).v;
      const mine = window.KF_CONFIG && window.KF_CONFIG.version;
      if (v && mine && v !== mine && !editing() && !S.drawer) location.reload();
    } catch (_) { /* hálózati hiba: később újra */ }
  }
  setInterval(checkVersion, 5 * 60000);

  $('#autostart').addEventListener('change', async e => {
    const on = e.target.checked;
    const cur = await exe().get_settings();
    await exe().save_settings({ ...cur, autostart: on });
    toast(on ? 'Indul a Windows-zal' : 'Nem indul a Windows-zal');
  });

  // A realtime csatorna megszakadhat (altatott lap, hálózatváltás): a szinkron állapotát ezért percenként is lekérdezzük.
  async function pullSync() {
    try {
      const { data } = await sb.from('sync_status').select('*').eq('id', 1).maybeSingle();
      if (data) { SYNC = data; renderSync(); }
    } catch (_) { /* hálózati hiba: a következő körben újra */ }
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && S.data) pullSync(); });

  setInterval(() => {
    if (!S.data) return;
    window.KF.reload();
    pullSync();
    if (editing() || S.drawer) return;
    const t = iso(new Date());
    if (t !== S.today) { rebuild(); render(); return; }
    if (S.view === 'week' && S.sel === S.today) render();
    else renderSync();
  }, 60000);

  sb.auth.onAuthStateChange(ev => {
    if (ev === 'SIGNED_OUT' && ME) location.reload();
  });

  bootAuth();
})();
