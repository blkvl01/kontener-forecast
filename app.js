(() => {
  'use strict';

  const DOW = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
  const DOW_S = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
  const MON = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
  const MON_S = ['jan', 'febr', 'márc', 'ápr', 'máj', 'jún', 'júl', 'aug', 'szept', 'okt', 'nov', 'dec'];
  const ST_LABEL = { removed: 'Kikerült' };

  const IC = {
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    up: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    refresh: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 21v-5h-5"/></svg>',
    sliders: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
    help: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.6"/><path d="M12 17.2h.01"/></svg>',
    arrow: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>',
    go: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    mail: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>',
    warn: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    open: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.4 0.015 255)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    cam: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    qr: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v.01M14.5 20.5h.01M17.5 20.5h3v-3"/></svg>',
    img: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-9 9"/></svg>',
    awb: '<svg width="13" height="15" viewBox="0 0 20 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 2.5h9l4 4v15H4z"/><path d="M13 2.5v4h4"/><path d="M7.5 11h6M7.5 14.5h6M7.5 18h3.5"/></svg>',
    box: '<svg width="16" height="11" viewBox="0 0 22 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="1.5" width="19" height="12" rx="1"/><path d="M6 4.5v6M9.5 4.5v6M13 4.5v6M16.5 4.5v6"/></svg>',
    prio: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 22V3" fill="none"/><path d="M5 4h13l-3 4.5 3 4.5H5z"/></svg>',
    xls: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13l6 5M15 13l-6 5"/></svg>'
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
  const S = { statsDays: 28, q: '', data: null, view: 'week', week: null, sel: null, month: null, calSel: null, drawer: null, pending: false, today: null, pdir: 0, px: null, chg: false, unit: 'ct', band: 'week', site: 'MG1', fleetOpen: false, laneMode: 'ct', statDay: null, statClosed: false };
  try { if (localStorage.getItem('kf-unit') === 'pdd') S.unit = 'pdd'; } catch (_) { /* privát mód */ }
  const CFG = window.KF_CONFIG;
  const sb = window.supabase.createClient(CFG.url, CFG.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  let ME = null;
  let MSGS = [];
  let MAN = {};
  let ARR = [];
  let STO = [];
  // Rámpasor a telephely rámpatáblája szerint: 1–23. A szürke helyekre nem tud kamion állni (Joloda vagy vak rámpa),
  // ezekre nem lehet rámpát kiosztani. A RAMPS a használható rámpák száma.
  const RAMP_SLOTS = 23;
  const RAMP_OFF = { 1: 'Joloda', 2: 'nem használható', 7: 'vak', 8: 'vak', 9: 'Joloda', 10: 'vak', 13: 'vak', 14: 'vak', 18: 'vak', 19: 'vak', 23: 'vak' };
  const rampOk = r => Number.isInteger(r) && r >= 1 && r <= RAMP_SLOTS && !RAMP_OFF[r];
  const RAMP_LIST = Array.from({ length: RAMP_SLOTS }, (_, i) => i + 1).filter(rampOk);
  const RAMPS = RAMP_LIST.length;
  // Tömör felsorolás: 3–6, 11, 12, 15–17, 20–22
  const RAMP_TXT = RAMP_LIST.reduce((a, r) => { const l = a[a.length - 1]; if (l && l[1] === r - 1) l[1] = r; else a.push([r, r]); return a; }, [])
    .map(([a, b]) => (a === b ? `${a}` : b === a + 1 ? `${a}, ${b}` : `${a}–${b}`)).join(', ');
  // Prioritásos konténerek (app_settings.priority), mindenkinek ugyanaz a lista.
  let PRIO = [];
  let MEMBERS = {};
  const who = email => (email && MEMBERS[email]) || email || '';
  const ROLE_L = { admin: 'Admin', editor: 'Szerkesztő', worker: 'Dolgozó' };
  const isWorker = () => !!(ME && ME.role === 'worker');
  let SYNC = null;
  // Glabs: melyik rámpán melyik kamion áll (glabs_ramps, a glabs-ramps függvény tölti 30 mp-enként).
  // A kulcs a Glabs teljes rámpaneve ("Ramp 16", "A1"). 3 percnél régebbi sikeres lekérés után az adat halvány.
  let GL = {}, GLST = null, GL_WAS = false;
  const GL_STALE = 3 * 60000;
  // Irány a Glabs rakodási szabályából. Az ajtó felül van: befelé felfelé, kifelé lefelé mutat a nyíl.
  const GL_DIR = { in: ['Befelé', 'M12 19V5M6 11l6-6 6 6'], out: ['Kifelé', 'M12 5v14M6 13l6 6 6-6'], inout: ['Be és ki', 'M8 19V5M4 9l4-4 4 4M16 5v14M12 15l4 4 4-4'] };
  const glDir = t => GL_DIR[t.dir] || null;
  const glArrow = t => { const d = glDir(t); return d ? `<svg class="gl-ar" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d[1]}"/></svg>` : ''; };
  // Mióta hívták rámpára (a Glabs hívásának ideje), percre kerekítve.
  const glSince = t => fmtDur((Date.now() - new Date(t.called_at).getTime()) / 60000);
  const glDesc = t => [glDir(t) ? glDir(t)[0].toLowerCase() : '', `${glSince(t)} óta hívva`, t.stage === 'loading' ? 'rakodik' : ''].filter(Boolean).join(' · ');
  const glFresh = () => !!(GLST && GLST.last_ok && Date.now() - new Date(GLST.last_ok).getTime() < GL_STALE);
  const glSig = t => (t ? [t.glabs_id, (t.plates || []).join('/'), t.stage, t.dir].join('|') : '');
  const glAt = r => GL[`Ramp ${r}`] || null;
  const glBlocks = r => !!(glAt(r) && glFresh());
  const glOther = () => Object.values(GL).filter(t => !/^Ramp \d+$/.test(t.ramp)).sort((a, b) => a.ramp.localeCompare(b.ramp));
  const glPlates = t => (t.plates && t.plates.length ? t.plates.join(' / ') : 'rendszám nélkül');
  let LAST_OK = null;
  let LOCAL = null;
  // A felhős (Power Automate) újraolvasás indítása óta eltelt idő; a következő sync_status-frissítésig „Frissítés…”.
  let CLOUD_BUSY = 0;
  const CLOUD_BUSY_MS = 3 * 60 * 1000;
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
    plate: r.plate || '', t1: r.t1 || '', driver: r.driver || '', phone: r.phone || '',
    auto_dismissed: !!r.auto_dismissed,
    site: r.site || '',
    pdd: Array.isArray(r.pdd) ? r.pdd : [],
    override: r.override || null
  });
  const normArr = r => ({ ...r, received: toLocal(r.received) });

  function rebuild() {
    const d = window.KFDerive(MSGS, MAN, ARR, STO);
    d.now = nowIso();
    S.data = d;
    document.dispatchEvent(new Event('kf:data'));
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

  // ---------- daru: a felemelt konténer követi az egeret ----------
  // Kártyánként egy rugós-csillapított inga: a konténer a kampó feletti tengely körül oldalra leng (2D).
  // Az egér felőli vége billen le; a vízszintes sebesség lökés (túllendül, majd visszaleng); a földi árnyék
  // a konténer alja után csúszik. Csak transform íródik, és csak amíg mozog: nyugalomban nincs képkocka-ciklus.
  // Az emelés (lift) a CSS-átmenet ütemét követi: csak a felemelt konténer leng.
  const HOVER_OK = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
  const PIVOT = 1.1; // a lengés tengelye a konténer közepe fölött, konténermagasságban mérve (a kampó fölött)
  const swT = (a, p) => `translateY(${(-p).toFixed(1)}px) rotate(${a.toFixed(3)}deg) translateY(${p.toFixed(1)}px)`;
  const sims = new Map();
  let simRaf = 0, simLast = 0;

  // Az egér pillanatnyi helye: a :hover bezáráskor a lezáró réteg miatt késve frissül, ezért a darus átadás a koordinátából dönt.
  const PTR = { x: -1, y: -1, mouse: false };
  const trackPtr = e => { PTR.x = e.clientX; PTR.y = e.clientY; PTR.mouse = e.pointerType === 'mouse'; };
  document.addEventListener('pointermove', trackPtr, { passive: true });
  document.addEventListener('pointerdown', trackPtr, { passive: true });
  const pointerOn = el => {
    if (!PTR.mouse || !HOVER_OK.matches || !el) return false;
    const r = el.getBoundingClientRect();
    return PTR.x >= r.left && PTR.x <= r.right && PTR.y >= r.top && PTR.y <= r.bottom;
  };
  // A visszaérkező daru ezt a kártyát hagyta „kézben tartott” (.hold) állapotban: úgy néz ki, mint a hover, de a kampó nem ereszkedik le újra.
  let holdEl = null;
  const holdRelease = () => { if (holdEl) { holdEl.classList.remove('hold'); holdEl = null; } };

  function simFor(card) {
    let m = sims.get(card);
    if (m) return m;
    const sw = card.querySelector('.ct-sw');
    if (!sw) return null;
    m = { card, sw, sh: card.querySelector('.cc-shadow'), h: sw.offsetHeight, r: null, enter: performance.now(), out: false, lift: 0, nx: 0, pv: 0, px: null, pt: 0, a: 0, va: 0 };
    sims.set(card, m);
    card.classList.add('phys');
    return m;
  }
  function simClear(m) {
    sims.delete(m.card);
    m.card.classList.remove('phys');
    m.sw.style.transform = '';
    if (m.sh) m.sh.style.transform = '';
  }
  // Kattintáskor a daru a pillanatnyi kilengésből veszi át a konténert.
  function simGrab(card) {
    const m = sims.get(card);
    if (!m) return 0;
    const a = m.a;
    simClear(m);
    return a;
  }

  function simStep(now) {
    simRaf = 0;
    const dt = Math.min(0.034, Math.max(0.001, (now - (simLast || now - 16)) / 1000));
    simLast = now;
    for (const m of sims.values()) {
      if (!m.card.isConnected || m.card.classList.contains('away')) { simClear(m); continue; }
      // emelés: belépés után ~.42 s-tól .55 s alatt fel, kilépéskor .34 s alatt le (mint a CSS-átmenet)
      m.lift = m.out ? Math.max(0, m.lift - dt / 0.34) : (now - m.enter > 420 ? Math.min(1, m.lift + dt / 0.55) : m.lift);
      const L = m.lift * m.lift * (3 - 2 * m.lift);
      m.pv *= Math.exp(-dt * 10);
      // lágy, alulcsillapított inga (~0,9 Hz); elengedve erősebben csillapodik
      const ta = m.nx * 4.5 * L, c = m.out ? 7 : 2.2;
      for (let i = 0; i < 2; i++) {
        const h = dt / 2;
        m.va += (32 * (ta - m.a) - c * m.va + m.pv * 0.05 * L) * h;
        m.a += m.va * h;
      }
      m.a = Math.max(-8, Math.min(8, m.a));
      const p = m.h * PIVOT;
      m.sw.style.transform = swT(m.a, p);
      // földi árnyék: a konténer alja után csúszik, felemelve szétterül
      if (m.sh) {
        const shift = -Math.sin(m.a * Math.PI / 180) * (p + m.h / 2) * 0.85;
        m.sh.style.transform = `translateX(${shift.toFixed(2)}px) scaleX(${(0.82 + 0.18 * L).toFixed(4)})`;
      }
      if (m.out && m.lift === 0 && Math.abs(m.a) < 0.02 && Math.abs(m.va) < 0.05) simClear(m);
    }
    if (sims.size) simRaf = requestAnimationFrame(simStep);
    else simLast = 0;
  }
  const simKick = () => { if (!simRaf) simRaf = requestAnimationFrame(simStep); };

  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !HOVER_OK.matches || !canFly()) return;
    const card = e.target.closest ? e.target.closest('#view .ccard') : null;
    // Az átadási jelző addig marad, amíg az egér a kártyán áll (a valódi hover mellette ugyanazt mutatja, a zárás-kattanás nem ismétlődik).
    if (holdEl && (!holdEl.isConnected || holdEl !== card)) holdRelease();
    for (const m of sims.values()) if (m.card !== card) m.out = true;
    if (card && !card.classList.contains('away')) {
      const m = simFor(card);
      if (m) {
        const now = performance.now();
        if (m.out) { m.out = false; m.enter = now - (m.lift > 0 ? 420 : 0); }
        if (!m.r) m.r = card.getBoundingClientRect();
        m.nx = Math.max(-1, Math.min(1, (e.clientX - m.r.left - m.r.width / 2) / (m.r.width / 2)));
        if (m.px !== null && now > m.pt) m.pv = m.pv * 0.6 + 0.4 * Math.max(-3000, Math.min(3000, (e.clientX - m.px) / ((now - m.pt) / 1000)));
        m.px = e.clientX; m.pt = now;
      }
    }
    if (sims.size) simKick();
  }, { passive: true });
  const simOut = () => { holdRelease(); for (const m of sims.values()) m.out = true; if (sims.size) simKick(); };
  document.addEventListener('pointerout', e => { if (!e.relatedTarget) simOut(); }, { passive: true });
  window.addEventListener('blur', simOut);
  window.addEventListener('scroll', () => { for (const m of sims.values()) m.r = null; }, { passive: true, capture: true });

  // Darus szállítás: a kampón lógó konténer felemelkedik, a futómacska átviszi, a célnál leereszkedik, rugózik, a kampó kiold.
  // Három egymásba ágyazott réteg (X, Y + méret, lengés), mindegyik külön transform-animáció.
  // grab: a kampónak előbb le kell ereszkednie (nem volt felemelve); hold(): lerakáskor a kártya saját daruja veszi át,
  // ilyenkor nincs kioldás. a0: a kártyán lengő konténer pillanatnyi kilengése, innen indul.
  // follow(): a cél élő eleme; ha repülés közben elmozdul (görgetés, emelés, újrarajzolás), a pálya fokozatosan
  // utánahajlik (az elején 0, lerakáskor teljes eltolás), így a konténer mindig a kártya valódi helyére érkezik.
  // A visszatérő ígéret a lerakáskor teljesül.
  function craneFly(svg, to, ms, { grab = 0, hold = () => false, a0 = 0, follow = null } = {}) {
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
    const P = r.height * PIVOT;
    const swing = [[0, a0], [.16, a0 * .3], [.3, a * dir], [.5, a * .25 * dir], [.7, -a * .85 * dir], [.84, a * .3 * dir], [.94, -a * .1 * dir], [1, 0]];
    sw.animate(swing.map(([o, ang]) => ({ offset: o, transform: swT(ang, P) })), opt({ easing: 'ease-in-out' }));
    // Célkövetés: képkockánként egy helylekérdezés, az eltolás a 'translate' tulajdonságba kerül
    // (független az animált transformtól, és képernyő-pixelben értendő, a méretezés nem hat rá).
    let raf = 0;
    if (follow) {
      const t0 = performance.now(), T = grab + ms;
      const track = now => {
        raf = 0;
        if (!f.isConnected) return;
        const el = follow();
        if (el) {
          const c = el.getBoundingClientRect();
          const u = Math.min(1, Math.max(0, (now - t0) / T)), w = u * u * (3 - 2 * u);
          f.style.translate = `${((c.left - to.left) * w).toFixed(2)}px ${((c.top - to.top) * w).toFixed(2)}px`;
        }
        raf = requestAnimationFrame(track);
      };
      raf = requestAnimationFrame(track);
    }
    const done = () => { cancelAnimationFrame(raf); f.remove(); };
    const landed = sleep(grab + ms);
    landed.then(() => {
      if (hold()) { done(); return; }
      ct.style.opacity = '0';
      f.classList.add('rel');
      hk.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-60%)', opacity: 1, offset: .6 }, { transform: 'translateY(-90%)', opacity: 0 }], { duration: 380, delay: 120, easing: 'cubic-bezier(.55,0,.6,1)', fill: 'both' })
        .finished.finally(done);
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

  // Számláló azonosítója a nézetben: a nap (data-date) vagy a szakasz, és a sorszáma azon belül.
  // Egységváltáskor ezzel a régi értékről számol az újra, nem nulláról.
  function numKey(el) {
    const box = el.closest('[data-date], .wk-foot, .stats');
    return `${box ? box.dataset.date || box.className.split(' ')[0] : ''}|${box ? [...box.querySelectorAll('[data-n]')].indexOf(el) : -1}`;
  }
  function snapNums() {
    const m = {};
    $('#view').querySelectorAll('[data-n]').forEach(el => { m[numKey(el)] = Number(el.dataset.n); });
    return m;
  }

  // Számlálás nulláról (vagy from esetén a régi értékről) a végértékig; az alapállapot a végérték, így hiba esetén is helyes szám látszik.
  // Egyetlen képkocka-ciklus az összes számlálónak, és csak akkor ír a DOM-ba, ha a kiírt szöveg változik.
  function countUp(root, offset = 0, from = null) {
    if (RM.matches || document.hidden) return;
    const items = [];
    const base = performance.now() + offset;
    root.querySelectorAll('[data-n]').forEach(el => {
      if (el.closest('.await')) return;
      const to = Number(el.dataset.n), f = FMT[el.dataset.f] || FMT.int;
      const v0 = from ? from[numKey(el)] ?? to : 0;
      if (to === v0) return;
      const last = f(v0);
      el.textContent = last;
      // Egységváltásnál késleltetés nélkül, rövidebben: a szám a rekeszekkel együtt vált.
      items.push({ el, to, v0, f, t0: base + (from ? 0 : Number(el.dataset.d || 0)), last });
    });
    if (!items.length) return;
    const dur = from ? 480 : 750;
    const step = now => {
      let live = false;
      for (const it of items) {
        const k = Math.min(1, Math.max(0, (now - it.t0) / dur));
        const txt = it.f(k >= 1 ? it.to : it.v0 + (it.to - it.v0) * (1 - Math.pow(2, -10 * k)));
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
      document.querySelectorAll(`#view [data-id="${CSS.escape(id)}"]:is(.blk, .ccard, .tr, .side-item, .roof, .pk-main, .tile, .pl)`).forEach(el => {
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
    const tick = p => Promise.resolve(p).then(v => { bootProgress(0.25 + 0.6 * (++done / 10)); return v; });
    const [msgs, man, arr, sync, cfg, mem, sto, pho, glr, gls] = await Promise.all([
      fetchAll('messages', 'received'),
      fetchAll('manual'),
      fetchAll('arrivals', 'received'),
      sb.from('sync_status').select('*').eq('id', 1).maybeSingle(),
      sb.from('app_settings').select('*').eq('id', 1).maybeSingle(),
      sb.from('members').select('email, name'),
      fetchAll('storage_events', 'stored_at'),
      sb.from('photos').select('*').gt('created_at', new Date(Date.now() - PHOTO_TTL).toISOString()).order('created_at'),
      sb.from('glabs_ramps').select('*'),
      sb.from('glabs_status').select('*').eq('id', 1).maybeSingle()
    ].map(tick));
    if (pho.data) PHOTOS = pho.data;
    if (glr.data) GL = Object.fromEntries(glr.data.map(t => [t.ramp, t]));
    if (gls.data) { GLST = gls.data; GL_WAS = glFresh(); }
    STO = sto.map(r => ({ ...r, stored_at: toLocal(r.stored_at) }));
    if (mem.data) MEMBERS = Object.fromEntries(mem.data.map(m => [m.email, m.name || m.email]));
    if (cfg.data) PRIO = cfg.data.priority || [];
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'storage_events' }, p => {
        const id = (p.new && p.new.id) || (p.old && p.old.id);
        STO = STO.filter(s => s.id !== id);
        if (p.eventType !== 'DELETE') STO.push({ ...p.new, stored_at: toLocal(p.new.stored_at) });
        scheduleRender();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, p => {
        const row = p.eventType === 'DELETE' ? p.old : p.new;
        PHOTOS = PHOTOS.filter(x => x.id !== row.id);
        if (p.eventType !== 'DELETE') PHOTOS.push(p.new);
        paintPhotos(row.container);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, p => {
        if (p.new) { PRIO = p.new.priority || []; scheduleRender(); }
      })
      // A függvény 30 mp-enként frissíti a seen_at / last_try mezőket; újrarajzolás csak valódi változásnál.
      .on('postgres_changes', { event: '*', schema: 'public', table: 'glabs_ramps' }, p => {
        const key = (p.new && p.new.ramp) || (p.old && p.old.ramp);
        if (!key) return;
        const was = glSig(GL[key]);
        if (p.eventType === 'DELETE') delete GL[key]; else GL[key] = p.new;
        if (glSig(GL[key]) !== was) scheduleRender();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sync_status' }, p => {
        if (p.new) {
          if (CLOUD_BUSY && (p.new.error || (p.new.last_ok && new Date(p.new.last_ok).getTime() > CLOUD_BUSY))) CLOUD_BUSY = 0;
          SYNC = p.new;
        }
        renderSync();
      })
      .subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        // Újracsatlakozás után a kimaradt változások nem érkeznek meg, ezért az adatot újra lekérjük.
        if (subscribedOnce) refreshData(); else subscribedOnce = true;
      });
  }

  // A realtime csatorna altatás vagy hálózatváltás után hézagot hagyhat, ezért az adat időnként újra lekérődik is.
  let subscribedOnce = false, refreshing = false, lastRefresh = Date.now();
  async function refreshData() {
    if (!S.data || refreshing) return;
    if (editing() || S.drawer || (window.KFTour && window.KFTour.active)) return;
    refreshing = true;
    try { await loadAll(); lastRefresh = Date.now(); } catch (_) { /* hálózati hiba: később újra */ }
    refreshing = false;
  }
  setInterval(() => { if (!document.hidden && Date.now() - lastRefresh > 4.5 * 60000) refreshData(); }, 60000);
  // A Glabs lekérés állapota nincs a Realtime-on (30 mp-enként íródik, ez a keretet enné): percenként lekérjük.
  // Frissből elavultba (és vissza) váltáskor rajzolódik újra.
  async function glCheck() {
    if (!S.data || document.hidden) return;
    const { data } = await sb.from('glabs_status').select('*').eq('id', 1).maybeSingle();
    if (data) GLST = data;
    const f = glFresh();
    if (f !== GL_WAS) { GL_WAS = f; scheduleRender(); }
  }
  setInterval(() => { glCheck().catch(() => {}); }, 60000);

  // Fejlesztői menü (devpanel.js): admin-only hozzáférés az adatokhoz és a nézethez.
  window.KFApp = {
    sb, esc, toast, toLocal, normMan, phase, stageText: c => stageText(c),
    me: () => ME,
    data: () => S.data,
    raw: () => ({ MSGS, MAN, ARR, STO, SYNC, PRIO, GL, GLST }),
    members: () => MEMBERS,
    today: () => S.today,
    reload: () => loadAll(),
    setMan(row) { if (row) MAN[row.container] = normMan(row); rebuild(); render(); },
    dropMan(id) { delete MAN[id]; rebuild(); render(); },
    openSheet(id) { if (S.data && S.data.containers[id]) openDrawer(id); }
  };
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd') && ME && ME.role === 'admin' && window.KFDev) {
      e.preventDefault();
      if ($('#settings').open) $('#settings').close();
      window.KFDev.open();
    }
  });

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
    if ($('#settings').open || $('#paste').open || $('#wb').open || $('#people').open || $('#rpick').open || DRAG) return true;
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
  const usersFn = (action, body) => edgeFn('users', action, body);
  async function edgeFn(name, action, body = {}) {
    const { data: { session } } = await sb.auth.getSession();
    const res = await fetch(`${CFG.url}/functions/v1/${name}`, {
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

  // A levelek újraolvasása a felhőben (Power Automate), exe nélkül is.
  async function cloudSync(mode) {
    const { data: { session } } = await sb.auth.getSession();
    const res = await fetch(`${CFG.url}/functions/v1/outlook-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CFG.key,
        Authorization: `Bearer ${session ? session.access_token : CFG.key}`
      },
      body: JSON.stringify({ mode })
    });
    let out = {};
    try { out = await res.json(); } catch (_) { /* üres válasz */ }
    if (!res.ok) throw new Error(out.error || 'A levelek újraolvasása nem indult el.');
    return out;
  }

  async function startCloudSync(mode) {
    CLOUD_BUSY = Date.now();
    renderSync();
    setTimeout(renderSync, CLOUD_BUSY_MS + 1000);
    try {
      await cloudSync(mode);
      return true;
    } catch (e) {
      CLOUD_BUSY = 0;
      renderSync();
      toast(e.message);
      return false;
    }
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
    ME = { ...data, uid: session.user.id };
    bootRole(ME.role);
    document.body.classList.toggle('role-worker', isWorker());
    sb.rpc('touch_me').then(() => {}, () => {});
    setInterval(() => sb.rpc('touch_me').then(() => {}, () => {}), 5 * 60000);
    // Az alkalmazás már a nyitó réteg alatt kirajzolódik (az első elrendezés és szövegformázás itt fut le),
    // az animációi a redőny felhúzásáig szünetelnek.
    const app = $('#app');
    app.classList.add('boot-wait');
    app.hidden = false;
    const hc = (location.hash.match(/[#&]c=([A-Z]{4}\d{7})/) || [])[1];
    if (hc) history.replaceState(null, '', location.pathname + location.search);
    await loadAll('boot ' + ZONES[S.view]);
    showAuth('app');
    if (hc && S.data.containers[hc]) {
      const c = S.data.containers[hc];
      const day = c.state === 'active' ? panelDay(c) : c.removed_from;
      if (day) { S.view = 'week'; S.sel = day; S.week = mondayOf(day); }
      S.drawer = hc;
      render();
      renderDrawer('enter');
    }
    subscribe();
    window.KF.reload();
    if (window.KFTour) window.KFTour.auto(ME, tourSheet);
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
  // Érkezési sorrend: a megérkezett konténer a tényleges érkezés, a többi az ETA ideje szerint; az ETA nélküliek a nap végén.
  const arrKey = c => {
    if (c.arrived) return c.arrived_at || `${c.day}T00:00:00`;
    return c.eta_time ? `${c.day}T${c.eta_time}:00` : '9999';
  };
  const byArrival = (a, b) => {
    const ka = arrKey(a), kb = arrKey(b);
    if (ka !== kb) return ka < kb ? -1 : 1;
    return a.id < b.id ? -1 : 1;
  };
  const onDay = d => all().filter(c => c.state === 'active' && c.day === d).sort(byArrival);
  // A napi panel (kártyák, számláló, idősáv, táblázat) az érkezés napját követi: aki más napon érkezett meg,
  // mint amire tervezték (pl. tegnapi ETA, ma érkezett), a mai panelen látszik, jelölve. A heti sávban marad a tervezett napnál.
  const panelDay = c => (c.arrived && c.arrived_at && !c.late_mod ? c.arrived_at.slice(0, 10) : c.day);
  const panelOn = d => all().filter(c => c.state === 'active' && panelDay(c) === d).sort(byArrival);
  // Másik napra tervezett konténer ezen a panelen: rövid jelölés (Tegnapi ETA, 11.02. ETA, Holnapi ETA).
  const carryTag = (c, d) => (c.day === d ? '' : c.day === addDays(d, -1) ? 'Tegnapi ETA' : c.day === addDays(d, 1) ? 'Holnapi ETA' : `${short(c.day)} ETA`);
  const removedOn = d => all().filter(c => c.state === 'removed' && c.removed_from === d).sort((a, b) => (a.id < b.id ? -1 : 1));
  const movedOut = d => all().filter(c => c.state === 'active' && c.moved_from === d && c.date !== d);
  const hasForecast = d => (S.data.forecast_dates || []).includes(d);
  const sumKg = l => l.reduce((s, c) => s + (c.kg || 0), 0);
  const sumCt = l => l.reduce((s, c) => s + (c.ctns || 0), 0);
  // Számolás fuvarlevélben: csak ott, ahol fuvarlevél-szintű adat van (darab, prefix, betárolás).
  // Az érkezés, az ETA és a késés konténerhez kötött, ezek fuvarlevél-módban is konténerben maradnak.
  const UP = () => S.unit === 'pdd';
  const pddOf = c => (c.pdd || []).filter(p => p.no);
  const sumPdd = l => l.reduce((s, c) => s + pddOf(c).length, 0);
  const sumPddSt = l => l.reduce((s, c) => s + (c.storage ? Math.min(c.storage.done, pddOf(c).length || c.storage.done) : 0), 0);

  // ---------- render ----------
  // enter: belépő zónák szóközzel ('boot', 'yard', 'main', 'cal', 'side', 'stats'); üresen nincs belépő animáció.
  // Újraépítéskor (élő frissítés, percenkénti frissítés) a fókusz ugyanarra a vezérlőre kerül vissza, nem esik az oldal elejére.
  function focusKey(scope = '#view') {
    const a = document.activeElement;
    if (!a || !a.closest(scope)) return null;
    const ks = ['action', 'id', 'date', 'step', 'eta', 'v'].filter(k => a.dataset[k] != null);
    if (!ks.length) return null;
    return a.tagName.toLowerCase() + (a.classList[0] ? `.${CSS.escape(a.classList[0])}` : '') + ks.map(k => `[data-${k}="${CSS.escape(a.dataset[k])}"]`).join('');
  }
  function refocus(key, scope = '#view') {
    const a = document.activeElement;
    if (!key || (a && a !== document.body && a.isConnected)) return;
    const el = $(scope).querySelector(key);
    if (el) el.focus({ preventScroll: true });
  }

  function render(enter) {
    if (!S.data) return;
    renderTabs();
    renderPeriod();
    renderSync();
    const v = $('#view');
    const fk = focusKey();
    const ysnap = enter ? null : yardSnap();
    v.className = enter ? enter.split(' ').map(z => `ev-${z}`).join(' ') : '';
    v.innerHTML = S.view === 'week' ? weekView() : S.view === 'month' ? monthView() : statsView();
    refocus(fk);
    if (ysnap) yardAnim(ysnap);
    if (S.view === 'month') placeCalInd(false);
    renderDrawer();
    if (enter && !$('#app').hidden && !$('#app').classList.contains('boot-wait')) {
      awaitReveal(v);
      // Csak a belépő zónák számai számolnak fel; a helyben maradó részek nem villannak.
      const roots = { yard: '.yard', main: '.main', cal: '.month-main', side: '.side', stats: '.statsv' };
      enter.split(' ').forEach(z => { if (roots[z]) v.querySelectorAll(roots[z]).forEach(r => countUp(r)); });
    }
    diffFlash(!!enter);
    if (!enter) notifyChanges();
    rememberP();
    rememberK();
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
      label = `<b>${isoWeek(S.week)}. hét</b><span>${weekRange(S.week)}</span>`;
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
      <button type="button" class="tbtn" data-action="today">Ma</button>${`
      <button type="button" class="tbtn tbtn-ic" data-action="paste" aria-label="ETA beillesztése" title="ETA beillesztése"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2"/><path d="M12 11v6M9 14h6"/></svg><span>ETA beillesztése</span></button>
      <button type="button" class="tbtn tbtn-ic" data-action="wb" aria-label="Fuvarlevelek beillesztése" title="Fuvarlevelek beillesztése"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/></svg><span>Fuvarlevelek</span></button>`}`;
  }

  function renderSync() {
    if (!S.data) return;
    const sy = SYNC || {};
    const last = toLocal(sy.last_ok);
    if (CLOUD_BUSY && Date.now() - CLOUD_BUSY > CLOUD_BUSY_MS) CLOUD_BUSY = 0;
    const busy = !!(LOCAL && LOCAL.busy) || !!CLOUD_BUSY;
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
      <button type="button" class="ibtn" data-action="tour" aria-label="Útmutató" title="Útmutató">${IC.help}</button>
      <span class="avatar" title="${esc(ME ? ME.email : '')}" aria-hidden="true">${initial}</span>`;
  }

  // ---------- heti nézet ----------
  function weekRange(wk) {
    const a = parse(wk), b = parse(addDays(wk, 6));
    return a.getMonth() === b.getMonth()
      ? `${MON_S[a.getMonth()]} ${a.getDate()} – ${b.getDate()}`
      : `${MON_S[a.getMonth()]} ${a.getDate()} – ${MON_S[b.getMonth()]} ${b.getDate()}`;
  }

  // Fuvarlevél-prefix: a PDD-szám „TM” előtti része (J1zTM… → J1z). A három ismert prefix mindig látszik a heti összesítőben.
  const PX_KNOWN = ['J1z', 'SZDm', 'Oy'];
  const PX_HUE = { J1z: 235, SZDm: 165, Oy: 305 };
  const PX_SPARE = [95, 15, 270, 200];
  function pxOf(no) {
    const m = /^([A-Za-z0-9]+?)TM\d/.exec(no);
    return m ? m[1] : (/^[A-Za-z]+/.exec(no) || ['Egyéb'])[0];
  }
  function pxCount(list) {
    const n = {};
    list.forEach(c => (c.pdd || []).forEach(p => { if (p.no) { const k = pxOf(p.no); n[k] = (n[k] || 0) + 1; } }));
    return n;
  }
  const pxKeys = n => [...PX_KNOWN, ...Object.keys(n).filter(k => !PX_KNOWN.includes(k)).sort()];
  const pxHue = (k, keys) => PX_HUE[k] ?? PX_SPARE[(keys.indexOf(k) - PX_KNOWN.length) % PX_SPARE.length];
  const hasPx = (c, px) => (c.pdd || []).some(p => p.no && pxOf(p.no) === px);
  // A konténer fő prefixe: amelyikből a legtöbb fuvarlevele van; fuvarlevél nélkül a szállítójáé.
  const SRC_PX = { jz: 'J1z', dmt: 'SZDm', nep: 'Oy' };
  function cPx(c) {
    const n = pxCount([c]);
    return Object.keys(n).sort((a, b) => n[b] - n[a])[0] || SRC_PX[c.src] || '';
  }
  function pxCountC(list) {
    const n = {};
    list.forEach(c => { const k = cPx(c); if (k) n[k] = (n[k] || 0) + 1; });
    return n;
  }
  // Prefix-szűrés: csak kiemel, a számok a teljes hetet mutatják.
  const pxOff = c => !!S.px && !hasPx(c, S.px);
  const pxOn = k => (S.px && S.px !== k ? 'off' : '');
  // Betárolásig jelölt, utána magától lekerül.
  const isPrio = c => PRIO.includes(c.id) && phase(c).key !== 'stored';
  const prioIc = c => (isPrio(c) ? `<span class="prio-ic" title="Prioritás">${IC.prio}</span>` : '');

  // Változások: naponként és szállítónként a legutóbbi pre-alert-változat ezt hozta az előzőhöz képest.
  // A nap első előrejelzése nem jelöl mindent újnak; ami azóta máshová került vagy visszajött, kimarad.
  function weekChanges(days) {
    const C = S.data.containers;
    const latest = {};
    for (const ev of S.data.feed || []) {
      for (const d of ev.dates) if (days.includes(d) && !latest[`${d}|${ev.src}`]) latest[`${d}|${ev.src}`] = ev;
    }
    const out = [];
    for (const [key, ev] of Object.entries(latest)) {
      const d = key.split('|')[0];
      const on = id => C[id] && C[id].state === 'active' && C[id].date === d;
      if (ev.before[d]) ev.added.forEach(a => { if (a.to === d && on(a.id)) out.push({ kind: 'new', id: a.id, day: d, at: ev.at }); });
      ev.moved.forEach(m => { if (m.to === d && on(m.id)) out.push({ kind: 'mov', id: m.id, day: d, from: m.from, at: ev.at }); });
      ev.removed.forEach(r => {
        const x = C[r.id];
        if (r.from === d && x && x.state === 'removed' && x.removed_from === d) out.push({ kind: 'out', id: r.id, day: d, at: ev.at });
      });
    }
    return out.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : a.id < b.id ? -1 : 1));
  }

  const when = at => {
    const d = at.slice(0, 10);
    return d === S.today ? `ma ${hm(at)}` : d === addDays(S.today, -1) ? `tegnap ${hm(at)}` : stamp(at);
  };
  const dayShort = d => `${DOW[dowIdx(d)]} ${parse(d).getDate()}.`;
  const CHG_H = { new: 'Új', mov: 'Áthelyezve', out: 'Kikerült' };

  function changesPop(chg) {
    const secs = ['new', 'mov', 'out'].map(kd => {
      const rows = chg.filter(x => x.kind === kd);
      if (!rows.length) return '';
      return `
        <div class="cp-sec"><h4>${CHG_H[kd]} · ${rows.length}</h4>${rows.map(x => `
          <button type="button" class="cp-row" data-action="open" data-id="${esc(x.id)}"><span class="cid">${esc(x.id)}</span><span>${esc(x.kind === 'mov' ? `${dayShort(x.from)} → ${dayShort(x.day)}` : `${DOW[dowIdx(x.day)]}, ${longLabel(x.day)}`)}</span><time>${esc(when(x.at))}</time></button>`).join('')}
        </div>`;
    }).join('');
    return `
      <div class="chg-pop" id="chg-pop" role="dialog" aria-label="Változások"${S.chg ? '' : ' hidden'}>
        <div class="cp-head"><b>Változások</b><span>legutóbbi pre-alert szerint</span></div>${secs}
      </div>`;
  }

  function setChg(open) {
    S.chg = open;
    const pop = $('#chg-pop'), btn = $('.chg-btn[data-action="chg"]');
    if (pop) pop.hidden = !open;
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  function weekSum(lists, wpx) {
    const flat = lists.flat();
    const keys = pxKeys(wpx);
    const pdd = keys.reduce((s, k) => s + (wpx[k] || 0), 0);
    const prevWk = addDays(S.week, -7);
    const prev = [...Array(7)].map((_, i) => onDay(addDays(prevWk, i))).flat();
    const ppx = pxCount(prev);
    const ppdd = Object.values(ppx).reduce((s, n) => s + n, 0);
    const delta = (v, p, f, ref) => {
      const d = v - p;
      return `<span class="wk-d ${d > 0 ? 'up' : d < 0 ? 'dn' : 'eq'}" title="Előző héthez képest">${d ? f(Math.abs(d)) : '0'}${ref ? ` a ${isoWeek(prevWk)}. héthez` : ''}</span>`;
    };
    const kpi = (lab, v, dl, i, on) => `<div class="wk-kpi${on ? ' on' : ''}" style="--i:${i}"><small>${lab}</small><b>${v}</b>${dl}</div>`;
    const U = UP();
    const arrived = U ? sumPdd(flat.filter(c => c.arrived)) : flat.filter(c => c.arrived).length;
    const stored = U ? sumPddSt(flat) : flat.filter(c => phase(c).key === 'stored').length;
    const prog = (lab, n, col, of = flat.length) => `<div class="wk-prog-row"><span>${lab}</span><i style="--p:${of ? Math.round(n / of * 100) : 0}%;--c:${col}"></i><b>${n}/${of}</b></div>`;
    const bar = keys.filter(k => wpx[k]).map(k => `<i class="${pxOn(k)}" style="flex:${wpx[k]};--h:${pxHue(k, keys)}"></i>`).join('');
    const legend = keys.map(k => {
      const n = wpx[k] || 0;
      return `<button type="button" class="wk-key${n ? '' : ' zero'}" data-action="px" data-v="${esc(k)}" aria-pressed="${S.px === k}"${n ? '' : ' disabled'}><i style="--h:${pxHue(k, keys)}"></i>${esc(k)}<b>${n}</b><span>${pdd ? Math.round(n / pdd * 100) : 0}%</span></button>`;
    }).join('');
    return `
      <section class="wk-foot" aria-label="Heti összesítő">
        <div class="wk-title"><b>${isoWeek(S.week)}. hét összesen</b><span>${weekRange(S.week)}</span>
          <div class="wk-acts"><button type="button" class="wk-btn" data-action="export"${flat.length ? '' : ' disabled'}>${IC.xls}Excel</button><button type="button" class="wk-btn" data-action="live" title="Magától frissülő Excel az aktuális hétről">${IC.xls}Élő Excel</button></div>
        </div>
        <div class="wk-kpis">
          ${kpi('Konténer', num(flat.length, 'int', 200), delta(flat.length, prev.length, fmtInt, !U), 0, !U)}
          ${kpi('Fuvarlevél', num(pdd, 'int', 240), delta(pdd, ppdd, fmtInt, U), 1, U)}
          ${kpi('Colli', num(sumCt(flat), 'int', 280), delta(sumCt(flat), sumCt(prev), fmtInt), 2)}
          ${kpi('Súly', `${num(sumKg(flat) / 1000, 'd1', 320)}<em>t</em>`, delta(sumKg(flat), sumKg(prev), fmtT), 3)}
          <div class="wk-prog" style="--i:4"><small>Állapot</small>
            ${prog('Megérkezett', arrived, 'var(--fill-live)', U ? pdd : flat.length)}
            ${prog('Betárolva', stored, 'oklch(0.86 0.12 85)', U ? pdd : flat.length)}
          </div>
        </div>
        <div class="wk-pre">
          <div class="wk-pre-head">Fuvarlevél prefix szerint<span>${fmtInt(pdd)} db</span></div>
          <div class="wk-bar" aria-hidden="true">${bar}</div>
          <div class="wk-keys" role="group" aria-label="Kiemelés prefix szerint">${legend}</div>
        </div>
      </section>`;
  }

  // Heti export: formázott .xlsx három lappal. A hét lapja képletekkel számol a két adatlapból
  // (Konténerek, Fuvarlevelek), így szűrés vagy javítás után is helyes.
  let xlsxLib = null;
  const loadXlsx = () => (xlsxLib ||= new Promise((res, rej) => {
    if (window.KFXlsx) { res(window.KFXlsx); return; }
    const sc = document.createElement('script');
    sc.src = `xlsx.js?v=${(CFG && CFG.version) || ''}`;
    sc.onload = () => (window.KFXlsx ? res(window.KFXlsx) : rej(new Error('xlsx')));
    sc.onerror = () => { xlsxLib = null; rej(new Error('xlsx')); };
    document.head.appendChild(sc);
  }));

  async function exportWeek() {
    let X;
    try { X = await loadXlsx(); } catch (_) { toast('Az export most nem érhető el, frissítsd az oldalt'); return; }
    const days = [...Array(7)].map((_, i) => addDays(S.week, i));
    const list = days.flatMap(d => onDay(d));
    const wk = isoWeek(S.week);

    // ---- stílusok: egy betűtípus, három méret, egy kiemelőszín; a hierarchiát méret és súly adja ----
    const INK = 'FF1F2430', GREY = 'FF6B7280', HAIR = 'FFE3E5EA', ACC = 'FFC2571A';
    const STC = { done: 'FF2E7D5B', live: 'FFC2571A', late: 'FFB42318', plan: 'FF6B7280' };
    const row = { bottom: { style: 'hair', color: HAIR } };
    const F = {
      title: { font: { b: true, sz: 16 } },
      sub: { font: { color: GREY } },
      sec: { font: { b: true, sz: 9, color: GREY } },
      head: { font: { b: true, sz: 9, color: GREY }, border: { bottom: { style: 'thin', color: INK } }, v: 'bottom', wrap: true },
      headR: { font: { b: true, sz: 9, color: GREY }, border: { bottom: { style: 'thin', color: INK } }, v: 'bottom', wrap: true, h: 'right' },
      txt: { border: row },
      mono: { font: { name: 'Consolas', sz: 10 }, border: row },
      int: { fmt: '#,##0;-#,##0;"–"', border: row, h: 'right' },
      dec: { fmt: '#,##0.0;-#,##0.0;"–"', border: row, h: 'right' },
      date: { fmt: 'yyyy. mm. dd.', border: row, h: 'left' },
      dt: { fmt: 'mm. dd. hh:mm', border: row, h: 'right' },
      dur: { fmt: '[h]:mm', border: row, h: 'right' },
      dev: { fmt: '+#,##0" p";-#,##0" p";"0 p"', border: row, h: 'right' },
      pct: { fmt: '0%', border: row, h: 'right' },
      flag: { font: { b: true, color: ACC }, border: row },
      totL: { font: { b: true }, border: { top: { style: 'thin', color: INK } } },
      totI: { font: { b: true }, fmt: '#,##0;-#,##0;"–"', border: { top: { style: 'thin', color: INK } }, h: 'right' },
      totD: { font: { b: true }, fmt: '#,##0.0;-#,##0.0;"–"', border: { top: { style: 'thin', color: INK } }, h: 'right' },
      totU: { font: { b: true }, fmt: '[h]:mm', border: { top: { style: 'thin', color: INK } }, h: 'right' },
      totP: { font: { b: true }, fmt: '0%', border: { top: { style: 'thin', color: INK } }, h: 'right' },
      kL: { font: { sz: 9, color: GREY } },
      kI: { font: { b: true, sz: 18 }, fmt: '#,##0', h: 'left' },
      kD: { font: { b: true, sz: 18 }, fmt: '#,##0.0', h: 'left' },
      kU: { font: { b: true, sz: 18 }, fmt: '[h]:mm', h: 'left' }
    };
    const st = (k) => ({ font: { b: k !== 'plan', color: STC[k] }, border: row });
    const C = (v, s, f) => (v == null && !f ? (s ? { s } : null) : { v, s, f });
    const ser = X.serial;
    const mins = (a, b) => (a && b ? Math.max(0, minutesBetween(a, b)) / 1440 : null);

    // ---- Konténerek ----
    const KC = [
      ['date', 'Dátum', 11], ['dow', 'Nap', 10], ['id', 'Konténer', 14], ['prio', 'Prioritás', 9], ['fwd', 'Szállító', 11],
      ['plate', 'Rendszám', 24], ['t1', 'T1 / MRN', 22], ['phone', 'Sofőr telefon', 16], ['npdd', 'Fuvarlevél (db)', 10], ['ctns', 'Colli', 9],
      ['kg', 'Súly (kg)', 10], ['state', 'Állapot', 14], ['ramp', 'Rámpa', 7], ['seen', 'Pre-alert', 12], ['truck', 'Rendszám + T1', 12],
      ['eta', 'ETA', 12], ['arr', 'Megérkezett', 12], ['dev', 'Eltérés az ETA-tól', 11], ['req', 'Nyitáskérés', 12], ['appr', 'Nyitható', 12],
      ['open', 'Nyitás', 12], ['rel', 'Elengedve', 12], ['sto1', 'Betárolás kezdete', 12], ['sto', 'Betárolva', 12],
      ['d1', 'Nyitáskérés → nyitható', 11], ['d2', 'Nyitható → nyitás', 11], ['d3', 'Nyitás → betárolva', 11], ['dt', 'Átfutás (érkezés → betárolva)', 13], ['note', 'Megjegyzés', 34]
    ];
    const KL = Object.fromEntries(KC.map(([k], i) => [k, X.colName(i)]));
    const kRows = [KC.map(([k, h]) => C(h, ['npdd', 'ctns', 'kg', 'ramp', 'dev', 'd1', 'd2', 'd3', 'dt'].includes(k) || ['seen', 'truck', 'eta', 'arr', 'req', 'appr', 'open', 'rel', 'sto1', 'sto'].includes(k) ? F.headR : F.head))];
    const cache = { n: {}, pdd: {}, ct: {}, kg: {}, arr: {}, sto: {}, dt: {} };
    list.forEach(c => {
      const s = c.stages || {};
      const at = k => (s[k] && s[k].at) || null;
      const eta = c.eta_time ? `${c.eta_date || c.date}T${c.eta_time}:00` : null;
      const truck = (c.history || []).find(h => h.kind === 'truck');
      const first = at('request') || c.arrived_at || null;
      const stored = at('stored');
      const ph = phase(c), late = lateInfo(c);
      const stKey = late ? 'late' : ph.grp;
      const dev = c.arrived_at && eta ? Math.round(minutesBetween(eta, c.arrived_at)) : null;
      const npdd = pddOf(c).length;
      const v = {
        date: C(ser(c.day), F.date), dow: C(DOW[dowIdx(c.day)], F.txt), id: C(c.id, F.mono), prio: C(isPrio(c) ? 'igen' : null, F.flag), fwd: C(c.fwd || null, F.txt),
        plate: C(c.plate ? plate(c.plate) : null, F.mono), t1: C(c.t1 || null, F.mono), phone: C(c.phone || null, F.txt), npdd: C(npdd, F.int), ctns: C(c.ctns || 0, F.int),
        kg: C(Math.round(c.kg || 0), F.int), state: C(late ? late.label : ph.label, st(stKey)), ramp: C(c.ramp || null, F.int),
        seen: C(ser(c.first_seen), F.dt), truck: C(ser(truck && truck.at), F.dt), eta: C(ser(eta), F.dt), arr: C(ser(c.arrived_at), F.dt), dev: C(dev, F.dev),
        req: C(ser(at('request')), F.dt), appr: C(ser(at('approved')), F.dt), open: C(ser(at('opened')), F.dt), rel: C(ser(at('released')), F.dt),
        sto1: C(ser(c.storage && c.storage.first), F.dt), sto: C(ser(stored), F.dt),
        d1: C(mins(at('request'), at('approved')), F.dur), d2: C(mins(at('approved'), at('opened')), F.dur), d3: C(mins(at('opened'), stored), F.dur),
        dt: C(mins(first, stored), F.dur), note: C(c.note || null, F.txt)
      };
      kRows.push(KC.map(([k]) => v[k]));
      const d = c.day;
      cache.n[d] = (cache.n[d] || 0) + 1; cache.pdd[d] = (cache.pdd[d] || 0) + npdd; cache.ct[d] = (cache.ct[d] || 0) + (c.ctns || 0);
      cache.kg[d] = (cache.kg[d] || 0) + (c.kg || 0); if (c.arrived_at) cache.arr[d] = (cache.arr[d] || 0) + 1;
      if (stored) cache.sto[d] = (cache.sto[d] || 0) + 1;
      if (first && stored) (cache.dt[d] = cache.dt[d] || []).push(mins(first, stored));
    });

    // ---- Fuvarlevelek ----
    const PC = [['date', 'Dátum', 11], ['id', 'Konténer', 14], ['no', 'Fuvarlevél', 20], ['px', 'Prefix', 8], ['ctns', 'Colli', 9], ['kg', 'Súly (kg)', 10], ['sto', 'Betárolva', 12], ['arr', 'Konténer megérkezett', 12], ['state', 'Konténer állapota', 14]];
    const PL = Object.fromEntries(PC.map(([k], i) => [k, X.colName(i)]));
    const pRows = [PC.map(([k, h]) => C(h, ['ctns', 'kg', 'sto', 'arr'].includes(k) ? F.headR : F.head))];
    const pxN = {}, pxS = {}, stoP = {};
    list.forEach(c => {
      const ps = pddOf(c);
      const stored = c.storedPdd || {};
      const ph = phase(c), late = lateInfo(c);
      ps.forEach(p => {
        const sAt = stored[p.no.toUpperCase()] || null;
        const px = pxOf(p.no);
        pxN[px] = (pxN[px] || 0) + 1;
        if (sAt) { pxS[px] = (pxS[px] || 0) + 1; stoP[c.day] = (stoP[c.day] || 0) + 1; }
        pRows.push([
          C(ser(c.day), F.date), C(c.id, F.mono), C(p.no, F.mono), C(px, F.txt),
          C(p.ctns != null ? p.ctns : ps.length === 1 ? c.ctns : null, F.int), C(p.kg != null ? Math.round(p.kg) : ps.length === 1 ? Math.round(c.kg || 0) : null, F.int),
          C(ser(sAt), F.dt), C(ser(c.arrived_at), F.dt), C(late ? late.label : ph.label, st(late ? 'late' : ph.grp))
        ]);
      });
    });

    // ---- A hét lapja ----
    const KS = "'Konténerek'!", PS = "'Fuvarlevelek'!";
    const col = (sh, L) => `${sh}$${L}:$${L}`;
    const wRows = [];
    const made = new Date();
    wRows[0] = [C(`Konténer Forecast · ${wk}. hét`, F.title)];
    wRows[1] = [C(`${S.week.replace(/-/g, '. ')}. – ${addDays(S.week, 6).replace(/-/g, '. ')}. · készült ${made.getFullYear()}. ${pad(made.getMonth() + 1)}. ${pad(made.getDate())}. ${pad(made.getHours())}:${pad(made.getMinutes())}${ME && ME.name ? ` · ${ME.name}` : ''}`, F.sub)];
    const allDt = Object.values(cache.dt).flat();
    const avgDt = allDt.length ? allDt.reduce((a, b) => a + b, 0) / allDt.length : '';
    const tot = k => Object.values(cache[k]).reduce((a, b) => a + b, 0);
    const pddTot = tot('pdd');
    const kpis = [
      ['Konténer', `COUNT(${col(KS, KL.date)})`, list.length, F.kI],
      ['Fuvarlevél', `SUM(${col(KS, KL.npdd)})`, pddTot, F.kI],
      ['Colli', `SUM(${col(KS, KL.ctns)})`, tot('ct'), F.kI],
      ['Súly (t)', `SUM(${col(KS, KL.kg)})/1000`, tot('kg') / 1000, F.kD],
      ['Megérkezett', `COUNT(${col(KS, KL.arr)})`, tot('arr'), F.kI],
      ['Betárolva', `COUNT(${col(KS, KL.sto)})`, tot('sto'), F.kI],
      ['Átlagos átfutás', `IFERROR(AVERAGE(${col(KS, KL.dt)}),"")`, avgDt, F.kU]
    ];
    wRows[3] = kpis.map(k => C(k[0], F.kL));
    wRows[4] = kpis.map(k => ({ f: k[1], v: k[2], s: k[3] }));
    wRows[6] = [C('Naponta', F.sec)];
    const DH = [['Nap', F.head], ['Dátum', F.head], ['Konténer', F.headR], ['Fuvarlevél', F.headR], ['Colli', F.headR], ['Súly (t)', F.headR], ['Megérkezett', F.headR], ['Betárolva', F.headR], ['Betárolt fuvarlevél', F.headR], ['Átlagos átfutás', F.headR]];
    wRows[7] = DH.map(([h, s]) => C(h, s));
    const r0 = 9;
    days.forEach((d, i) => {
      const r = r0 + i, B = `$B${r}`;
      const dts = cache.dt[d] || [];
      wRows[r - 1] = [
        C(DOW[i], F.txt), C(ser(d), F.date),
        { f: `COUNTIFS(${col(KS, KL.date)},${B})`, v: cache.n[d] || 0, s: F.int },
        { f: `SUMIFS(${col(KS, KL.npdd)},${col(KS, KL.date)},${B})`, v: cache.pdd[d] || 0, s: F.int },
        { f: `SUMIFS(${col(KS, KL.ctns)},${col(KS, KL.date)},${B})`, v: cache.ct[d] || 0, s: F.int },
        { f: `SUMIFS(${col(KS, KL.kg)},${col(KS, KL.date)},${B})/1000`, v: (cache.kg[d] || 0) / 1000, s: F.dec },
        { f: `COUNTIFS(${col(KS, KL.date)},${B},${col(KS, KL.arr)},"<>")`, v: cache.arr[d] || 0, s: F.int },
        { f: `COUNTIFS(${col(KS, KL.date)},${B},${col(KS, KL.sto)},"<>")`, v: cache.sto[d] || 0, s: F.int },
        { f: `COUNTIFS(${col(PS, PL.date)},${B},${col(PS, PL.sto)},"<>")`, v: stoP[d] || 0, s: F.int },
        { f: `IFERROR(AVERAGEIFS(${col(KS, KL.dt)},${col(KS, KL.date)},${B}),"")`, v: dts.length ? dts.reduce((a, b) => a + b, 0) / dts.length : '', s: F.dur }
      ];
    });
    const rT = r0 + 7, rng = L => `${L}${r0}:${L}${r0 + 6}`;
    wRows[rT - 1] = [
      C('Összesen', F.totL), C(null, F.totL),
      ...['C', 'D', 'E', 'F', 'G', 'H', 'I'].map((L, k) => ({ f: `SUBTOTAL(109,${rng(L)})`, v: [list.length, pddTot, tot('ct'), tot('kg') / 1000, tot('arr'), tot('sto'), Object.values(stoP).reduce((a, b) => a + b, 0)][k], s: L === 'F' ? F.totD : F.totI })),
      { f: `IFERROR(AVERAGE(${col(KS, KL.dt)}),"")`, v: avgDt, s: F.totU }
    ];
    const rP = rT + 2;
    wRows[rP - 1] = [C('Fuvarlevél prefix szerint', F.sec)];
    wRows[rP] = [C('Prefix', F.head), C(null, F.head), C('Fuvarlevél', F.headR), C('Arány', F.headR), C('Betárolva', F.headR)];
    const pks = pxKeys(pxN).filter(k => pxN[k]);
    pks.forEach((k, i) => {
      const r = rP + 2 + i;
      wRows[r - 1] = [
        C(k, F.txt), C(null, F.txt),
        { f: `COUNTIFS(${col(PS, PL.px)},$A${r})`, v: pxN[k], s: F.int },
        { f: `IFERROR(C${r}/C$${rP + 2 + pks.length},0)`, v: pddTot ? pxN[k] / pddTot : 0, s: F.pct },
        { f: `COUNTIFS(${col(PS, PL.px)},$A${r},${col(PS, PL.sto)},"<>")`, v: pxS[k] || 0, s: F.int }
      ];
    });
    const rPT = rP + 2 + pks.length;
    wRows[rPT - 1] = [C('Összesen', F.totL), C(null, F.totL), { f: `SUBTOTAL(109,C${rP + 2}:C${rPT - 1})`, v: pddTot, s: F.totI }, { f: `IFERROR(C${rPT}/C${rPT},0)`, v: pddTot ? 1 : 0, s: F.totP }, { f: `SUBTOTAL(109,E${rP + 2}:E${rPT - 1})`, v: Object.values(pxS).reduce((a, b) => a + b, 0), s: F.totI }];

    const blob = X.book([
      { name: `${wk}. hét`, cols: [14, 14, 13, 13, 13, 13, 14, 12, 13, 13], rows: wRows, heights: { 0: 24, 4: 26, 7: 26 }, tabSelected: true },
      { name: 'Konténerek', cols: KC.map(x => x[2]), rows: kRows, freeze: { row: 1, col: 3 }, filter: `A1:${X.colName(KC.length - 1)}${kRows.length}`, heights: { 0: 30 }, landscape: true },
      { name: 'Fuvarlevelek', cols: PC.map(x => x[2]), rows: pRows, freeze: { row: 1, col: 3 }, filter: `A1:${X.colName(PC.length - 1)}${pRows.length}`, heights: { 0: 30 }, landscape: true }
    ], { title: `Konténer Forecast ${wk}. hét`, author: ME && ME.name });
    const name = `kontener-${S.week.slice(0, 4)}-${pad(wk)}-het.xlsx`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast(`${list.length} konténer, ${pddTot} fuvarlevél exportálva`);
  }

  // Élő Excel (a heti összesítő gombja, a konzolból kfLiveExcel('day'|'week')): a mai napot vagy az aktuális hetet Power Query húzza az excel-feed függvényből.
  // A link a belépett taghoz kötött; a tagság megszűnésével a fájl is leáll.
  let liveLib = null;
  const loadLive = () => (liveLib ||= new Promise((res, rej) => {
    if (window.KFLive) { res(window.KFLive); return; }
    const sc = document.createElement('script');
    sc.src = `live-xlsx.js?v=${(CFG && CFG.version) || ''}`;
    sc.onload = () => (window.KFLive ? res(window.KFLive) : rej(new Error('live')));
    sc.onerror = () => { liveLib = null; rej(new Error('live')); };
    document.head.appendChild(sc);
  }));
  async function exportLive(range = 'week') {
    range = range === 'day' ? 'day' : 'week';
    try {
      await loadXlsx();
      const L = await loadLive();
      const { url } = await edgeFn('excel-feed', 'link');
      const blob = L.build({ feedUrl: url, author: ME && ME.name, range });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `kontener-elo-${range === 'week' ? 'het' : 'nap'}-${iso(new Date())}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      toast('Élő Excel letöltve');
    } catch (e) { toast(e && e.message && e.message !== 'live' ? e.message : 'Az élő Excel most nem érhető el'); }
  }
  window.kfLiveExcel = exportLive;
  let liveBusy = false;

  function weekView() {
    const days = [...Array(7)].map((_, i) => addDays(S.week, i));
    const lists = days.map(onDay);
    const maxN = Math.max(1, ...lists.map(l => l.length));
    const baseH = window.matchMedia('(max-width: 760px)').matches ? 300 : 380;
    const GAP = 5;
    const chg = weekChanges(days);
    if (!chg.length) S.chg = false;
    // Kikerült vagy elvitt konténer: szaggatott helyőrző a nap alján.
    const ghosts = days.map(d => [
      ...chg.filter(x => x.kind === 'out' && x.day === d).map(x => ({ id: x.id, t: 'kikerült' })),
      ...chg.filter(x => x.kind === 'mov' && x.from === d).map(x => ({ id: x.id, t: `→ ${DOW[dowIdx(x.day)]}` }))
    ]);
    const GH = 22;
    // A blokk legalább olvasható magasságú (MINH); sok konténernél nem zsugorodik tovább, hanem a sáv nő meg,
    // így a blokkok sosem lógnak rá a nap fejlécére.
    const MINH = 22;
    const minH = Math.max(MINH, Math.min(maxN > 10 ? MINH : 34, Math.floor((baseH - 12 - (maxN - 1) * GAP) / maxN)));
    const need = Math.max(0, ...lists.map((l, i) => l.length * minH + Math.max(0, l.length - 1) * GAP + ghosts[i].length * (GH + GAP)));
    // Túltelt hétnél egy kis ráhagyás marad, hogy a súly szerinti magasságkülönbség is látsszon.
    const H = need + 12 > baseH ? Math.ceil(need * 1.12) + 12 : baseH;
    const avail = H - 12;
    // A legnagyobb arány, amelynél minden nap oszlopa (minimum magassággal és a helyőrzőkkel együtt) belefér a sávba.
    const fits = k => lists.every((l, i) => l.reduce((s, c) => s + Math.max(minH, Math.round((c.kg || 0) * k)), 0) + Math.max(0, l.length - 1) * GAP + ghosts[i].length * (GH + GAP) <= avail);
    let lo = 0, hi = avail / Math.max(1, ...lists.map(l => Math.max(0, ...l.map(c => c.kg || 0))));
    for (let n = 0; n < 24; n++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    const k = lo;
    const wpx = pxCount(lists.flat());
    const wkeys = pxKeys(wpx);

    const cols = days.map((d, i) => {
      const list = lists[i];
      const kg = sumKg(list);
      const dchg = chg.filter(x => x.day === d);
      const mk = {};
      dchg.forEach(x => { if (x.kind !== 'out') mk[x.id] = x.kind; });
      const blocks = list.slice().sort((a, b) => phase(b).p - phase(a).p || (a.eta_time || '99').localeCompare(b.eta_time || '99')).reverse().map((c, j, arr) => {
        const ph = phase(c);
        const late = lateInfo(c);
        const m = mk[c.id] || (c.late_mod ? 'late' : '');
        const cp = cPx(c);
        return `
        <div class="blk blk-${ph.grp}${late ? ' late' : ''}${isPrio(c) ? ' prio' : ''}${pxOff(c) ? ' px-off' : ''}" data-id="${esc(c.id)}" style="--p:${Math.round(ph.p * 100)}%;--j:${Math.min(9, arr.length - 1 - j)};height:${Math.max(minH, Math.round(c.kg * k))}px" title="${esc(c.id)}${cp ? ` · ${esc(cp)}` : ''} ·${esc(late ? late.label : ph.label)}${isPrio(c) ? ' · prioritás' : ''}${m ? ` · ${m === 'new' ? 'új' : m === 'late' ? 'utólag módosítva' : 'áthelyezve'}` : ''}">${isPrio(c) ? '<i class="pf" aria-hidden="true"></i>' : ''}
          <span class="blk-l">${m ? `<i class="mk mk-${m}" aria-hidden="true"></i>` : ''}<span class="blk-id">${esc(c.id)}</span></span>${pddCells(c, ph)}<span class="blk-r"><span class="blk-v">${esc(!c.arrived && c.eta_time ? c.eta_time : fmtT(c.kg))}</span><b class="blk-n${pddOf(c).length ? '' : ' zero'}">${IC.awb}${pddOf(c).length}</b></span>
        </div>`;
      }).join('');
      const ghost = ghosts[i].map(g => `<div class="blk-ghost" style="height:${GH}px"><s>${esc(g.id)}</s><em>${esc(g.t)}</em></div>`).join('');
      // Fuvarlevél-módban a változások is fuvarlevélben számolnak (a konténer összes fuvarlevele mozdult).
      const wOf = id => (UP() ? pddOf(S.data.containers[id] || {}).length : 1);
      const sumW = xs => xs.reduce((n, x) => n + wOf(x.id), 0);
      const nNew = sumW(dchg.filter(x => x.kind === 'new'));
      const nMov = sumW(dchg.filter(x => x.kind === 'mov'));
      const outs = dchg.filter(x => x.kind === 'out');
      const nOut = sumW(outs);
      const nAway = sumW(ghosts[i]) - nOut;
      const nPr = UP() ? sumPdd(list.filter(isPrio)) : list.filter(isPrio).length;
      const uS = UP() ? ' PDD' : '';
      const chips = [
        nNew && `<span class="cg-new">+${nNew}${uS} új</span>`,
        nMov && `<span class="cg-mov">${nMov}${uS} áthelyezve ide</span>`,
        nAway > 0 && `<span class="cg-out">${nAway}${uS} áthelyezve innen</span>`,
        nOut && `<span class="cg-out">${nOut}${uS} kikerült</span>`
      ].filter(Boolean);
      const nodata = !hasForecast(d) && !list.length;
      const note = nodata && d >= S.today ? '<div class="stack-note">Még nincs előrejelzés</div>' : '';
      const U = UP();
      const tot = U ? sumPdd(list) : list.length;
      const done = U ? sumPddSt(list) : list.filter(c => phase(c).key === 'stored').length;
      const lateN = list.filter(c => lateInfo(c)).length;
      const dpx = U ? pxCount(list) : pxCountC(list);
      const dkeys = wkeys.filter(x => dpx[x]);
      const pxs = dkeys.map(x => `${x} ${dpx[x]}`).join(' · ');
      const chgSay = chips.map(s => s.replace(/<[^>]+>/g, '')).join(', ');
      const say = `${DOW[i]}, ${longLabel(d)}: ${list.length} konténer${U ? `, ${tot} fuvarlevél` : ''}${list.length ? `, ${fmtT(kg)}, ${done} ${U ? 'fuvarlevél ' : ''}betárolva` : ''}${lateN ? `, ${lateN} késik` : ''}${nPr ? `, ${nPr} prioritás` : ''}${pxs ? `, prefix szerint: ${pxs}` : ''}${chgSay ? `, változás: ${chgSay}` : ''}`;
      return `
        <button type="button" class="day${d === S.today ? ' is-today' : ''}" data-action="day" data-date="${d}" aria-pressed="${d === S.sel}" aria-label="${esc(say)}" style="--i:${i}">
          <div class="day-top"><span class="day-dow">${DOW[i]}</span>${d === S.today ? '<span class="today-tag">MA</span>' : ''}</div>
          <div class="day-num"><span>${parse(d).getDate()}</span></div>
          <div class="day-chg">${nPr ? `<span class="cg-pr">${IC.prio}${nPr}${uS} prioritás</span>` : ''}${chips.join('')}</div>
          <div class="stack ${nodata ? 'nodata' : ''}" style="height:${H}px">${blocks}${ghost}${note}</div>
          <div class="day-foot"><span><b>${num(tot, 'int', 120 + i * 40)}</b><small>${U ? 'fuvarlevél' : 'konténer'}</small></span><span class="day-t">${list.length ? fmtT(kg) : '—'}</span></div>
          <div class="day-ctn">${list.length ? `<span>${fmtInt(sumCt(list))} colli</span>${done ? `<span class="day-sto"><i style="--p:${Math.round(done / Math.max(1, tot) * 100)}%"></i>${done}/${tot} betárolva</span>` : ''}` : ''}</div>
          ${dkeys.length ? `<div class="day-px" aria-hidden="true">${dkeys.map(x => `<i class="${pxOn(x)}" style="flex:${dpx[x]};--h:${pxHue(x, wkeys)}"></i>`).join('')}</div><div class="day-pxt">${IC.box}<span>${esc(pxs)}</span></div>` : ''}
        </button>`;
    }).join('');

    // A rekeszek ugyanazt a töltés-nyelvet beszélik, mint a konténer, így a jelmagyarázat mindkét módban azonos.
    const legend = [['Tervben', 0, 'plan'], ['Nyitható', 40, 'live'], ['Bontás alatt', 75, 'live'], ['Betárolva', 100, 'done'], ['Késik', 0, 'plan lg-late']]
      .map(([t, p, g], i) => `<span style="--i:${i}"><i class="lg-ct lg-${g}" style="--p:${p}%"></i>${t}</span>`).join('');
    // A mód csak ezen az osztályon múlik; a blokkok markupja mindkét módban azonos (lásd swapUnit).
    const uCls = UP() ? ' u-pdd' : '';
    if (S.band === 'yard') {
      return `
      <section class="yard is-yd${uCls}" aria-label="Udvar: rámpák és parkoló">
        <div class="yard-top">
          ${bandSwitch()}
          ${siteSwitch()}
          <span class="yd-sum">${siteSum()}</span>
        </div>
        ${yardBand()}
      </section>
      ${dayPanel()}`;
    }
    return `
      <section class="yard${uCls}" aria-label="Heti érkezések">
        <div class="yard-top">
          ${bandSwitch()}
          ${chg.length
            ? `<button type="button" class="chg-btn" data-action="chg" aria-expanded="${!!S.chg}" aria-controls="chg-pop">Változások <span class="n">${chg.length}</span></button>${changesPop(chg)}`
            : '<span class="chg-btn none">Nincs változás</span>'}
          ${S.px ? `<button type="button" class="fchip" data-action="px" data-v="" aria-label="Kiemelés törlése: ${esc(S.px)}" style="--h:${pxHue(S.px, wkeys)}"><i></i>Csak ${esc(S.px)}<span aria-hidden="true">✕</span></button>` : ''}
          ${unitSwitch()}
          <div class="legend">${legend}</div>
        </div>
        <div class="yard-scroll"><div class="days" style="--di:${Math.max(0, days.indexOf(S.sel))}"><i class="day-ind" aria-hidden="true"></i>${cols}</div></div>
        ${weekSum(lists, wpx)}
      </section>
      ${dayPanel()}`;
  }

  // Egységváltás újrarajzolás nélkül: a .yard módosztálya azonnal vált (a rekeszek, feliratok és a csúszka
  // CSS-átmenettel mennek át a meglévő elemeken), a számok és szövegek pedig helyben cserélődnek, a régi
  // értékükről számolva. A teljes nézet újraépítése lassú gépen elnyelné az átmenet első felét.
  function swapUnit() {
    const view = $('#view');
    const y = view.querySelector('.yard');
    if (S.view !== 'week' || !y) { render(); return; }
    const from = snapNums();
    y.classList.toggle('u-pdd', UP());
    y.querySelectorAll('.us-opt').forEach(b => b.setAttribute('aria-checked', String(b.dataset.v === S.unit)));
    const tpl = document.createElement('div');
    tpl.innerHTML = weekView();
    // A becserélt részek ne játsszák le újra a nézet belépő animációját (a #view ev-* osztálya még rajta lehet).
    tpl.querySelectorAll('.day-chg, .day-foot, .day-ctn, .day-px, .day-pxt, .wk-foot, .main .stats').forEach(e => e.classList.add('k-swap'));
    tpl.querySelectorAll('.yard .day').forEach(nd => {
      const od = y.querySelector(`.day[data-date="${nd.dataset.date}"]`);
      if (!od) return;
      od.setAttribute('aria-label', nd.getAttribute('aria-label'));
      ['.day-chg', '.day-foot', '.day-ctn'].forEach(s => { const o = od.querySelector(s), n = nd.querySelector(s); if (o && n) o.replaceWith(n); });
      od.querySelectorAll(':scope > .day-px, :scope > .day-pxt').forEach(e => e.remove());
      nd.querySelectorAll(':scope > .day-px, :scope > .day-pxt').forEach(e => od.appendChild(e));
    });
    const swap = s => { const o = view.querySelector(s), n = tpl.querySelector(s); if (o && n) o.replaceWith(n); };
    swap('.wk-foot');
    swap('.main .stats');
    ['.yard', '.main .stats'].forEach(s => { const r = view.querySelector(s); if (r) countUp(r, 0, from); });
  }

  // Konténer / fuvarlevél kapcsoló. A csúszka és a kiemelt felirat a .yard módosztályát követi.
  function unitSwitch() {
    const opt = (v, ic, t, sub) => `<button type="button" class="us-opt" role="radio" aria-checked="${S.unit === v}" data-action="unit" data-v="${v}">${ic}<span>${t}<small>${sub}</small></span></button>`;
    return `<div class="unit-sw" role="radiogroup" aria-label="Számolás egysége">
        <i class="us-ind" aria-hidden="true"></i>
        ${opt('ct', IC.box, 'Konténer', 'db')}
        ${opt('pdd', IC.awb, 'Fuvarlevél', 'PDD')}
      </div>`;
  }
  // Fuvarlevél-réteg: a több fuvarleveles konténer annyi rekeszre bomlik, ahány fuvarlevele van. Minden rekesz ugyanazzal a
  // haladás-töltéssel mutatja a saját állapotát, a betárolt fuvarlevélé tele. Mindkét módban a DOM-ban van,
  // a láthatóságát a .yard módosztálya vezérli.
  function pddCells(c, ph) {
    const ps = pddOf(c);
    // Egy fuvarlevélnél a rekesz maga a konténer: nincs mit szétbontani, csak a szám jelenik meg.
    if (ps.length < 2) return '';
    const st = c.storedPdd || {};
    // Betárolás közben a még be nem tárolt fuvarlevél a nyitás szintjén áll.
    const rest = ph.p;
    return `<span class="blk-cells" aria-hidden="true" style="--n:${Math.min(ps.length, 9)}">${ps.map((p, k) => {
      const on = ph.key === 'stored' || !!st[p.no.toUpperCase()];
      return `<i class="c-${on ? 'done' : ph.grp}" style="--cp:${Math.round((on ? 1 : rest) * 100)}%;--ci:${Math.min(k, 8)}"></i>`;
    }).join('')}</span>`;
  }

  // ---------- folyamat, késés, rámpa ----------
  // Egy fázis, egy név: a chip, a jelmagyarázat, a mérföldkő és a statisztika ugyanezeket a feliratokat használja.
  // Mérföldkövek, mind levélből: nyitáskérelem elküldve → nyitható → „nyitjuk” → (+15 perc) bontás → elengedve vagy betárolva.
  // A bontás nem kap levelet: a „nyitjuk” levél után 15 perccel magától lép. A betárolva az elengedésnél erősebb:
  // ha mindkettő megjött, a konténer betárolva. A részleges (PDD-nkénti) betárolás nem külön mérföldkő.
  const STAGES = ['request', 'approved', 'opened', 'unpack', 'released', 'stored'];
  const STAGE_LABEL = { request: 'Nyitás megkérve', approved: 'Nyitható', opened: 'Nyitás alatt', unpack: 'Bontás alatt', released: 'Elengedve', stored: 'Betárolva' };
  const UNPACK_MIN = 15;
  const PHASE = {
    plan: ['Tervben', 0, 'plan'], request: ['Nyitás megkérve', 0.2, 'live'], approved: ['Nyitható', 0.4, 'live'],
    opened: ['Nyitás alatt', 0.55, 'live'], unpack: ['Bontás alatt', 0.75, 'live'], released: ['Elengedve', 0.9, 'live'],
    stored: ['Betárolva', 1, 'done']
  };
  // Helyi idő ISO-szövegként, percekkel eltolva (a levelek ideje is így van tárolva).
  const isoAdd = (ts, min) => { const d = new Date(new Date(ts).getTime() + min * 60000); return `${iso(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
  const openedAt = c => (c.stages && c.stages.opened && c.stages.opened.at) || '';
  function phaseKey(c) {
    const st = c.stages || {};
    if (st.stored) return 'stored';
    if (st.released) return 'released';
    if (st.opened || c.opened_implied) return st.opened && minutesBetween(st.opened.at, nowIso()) < UNPACK_MIN ? 'opened' : 'unpack';
    if (st.approved) return 'approved';
    return c.arrived ? 'request' : 'plan';
  }
  function phase(c) {
    const k = phaseKey(c);
    const [label, p, grp] = PHASE[k];
    return { key: k, label, p, grp };
  }
  const stageText = c => phase(c).label;
  // A fázis kezdete: ettől számít a várakozás (parkolóban, rámpán).
  function phaseSince(c) {
    const st = c.stages || {}, k = phaseKey(c);
    if (k === 'request') return (st.request && st.request.at) || c.arrived_at || '';
    if (k === 'approved') return st.approved ? st.approved.at : '';
    if (k === 'opened') return openedAt(c);
    if (k === 'unpack') return openedAt(c) ? isoAdd(openedAt(c), UNPACK_MIN) : (c.opened_implied || '');
    if (k === 'released') return st.released ? st.released.at : '';
    if (k === 'stored') return st.stored ? st.stored.at : '';
    return '';
  }
  const waitMin = c => { const t = phaseSince(c); return t ? Math.max(0, minutesBetween(t, nowIso())) : 0; };

  // ---------- udvar: parkoló és rámpák ----------
  // Fizikailag az udvaron áll (parkolóban vagy rámpán), amíg nincs elengedve vagy betárolva.
  // A régi, lezáratlanul maradt tételek ne foglaljanak helyet: csak a tegnapelőttől holnapig tervezettek számítanak.
  const ON_YARD = ['request', 'approved', 'opened', 'unpack'];
  // Két raktár: MG1 (alap, a 23 rámpás sor) és MG3 (rámpaszám nélkül). A raktárt érkezéskor lehet kiválasztani.
  const SITES = ['MG1', 'MG3'];
  const siteOf = c => (c && c.site === 'MG3' ? 'MG3' : 'MG1');
  const MG3_DOCK = ['approved', 'opened', 'unpack'];
  const yardList = site => {
    const lo = addDays(S.today, -2), hi = addDays(S.today, 1);
    return all().filter(c => c.state === 'active' && c.day >= lo && c.day <= hi && ON_YARD.includes(phaseKey(c)) && (!site || siteOf(c) === site));
  };
  // Rámpa → konténer (exceptId: ez a konténer ne számítson foglaltnak). Rámpája csak az MG1-nek van.
  function rampMap(exceptId) {
    const m = {};
    yardList('MG1').forEach(c => { if (c.ramp && c.id !== exceptId && !m[c.ramp]) m[c.ramp] = c; });
    return m;
  }
  const onRamp = c => !!(c.ramp && c.state === 'active' && siteOf(c) === 'MG1' && ON_YARD.includes(phaseKey(c)));
  // Rámpát az MG1-be menő nyitható konténer kap; ha a „nyitjuk” levél rámpa nélkül jön, akkor is (és sürgősen) kell neki.
  const canPick = c => !!c && c.state === 'active' && siteOf(c) === 'MG1' && ['approved', 'opened', 'unpack'].includes(phaseKey(c));
  const needsRamp = c => canPick(c) && !c.ramp;
  const openNoRamp = c => !!c && c.state === 'active' && siteOf(c) === 'MG1' && !c.ramp && ['opened', 'unpack'].includes(phaseKey(c));
  // Raktár választható, amíg a konténer az udvaron van (megérkezett, de még nincs elengedve vagy betárolva).
  const canSite = c => !!c && c.state === 'active' && ON_YARD.includes(phaseKey(c));
  // MG3: a parkolóban a még nem nyithatók, a kirakodóban a nyithatók és a nyitás / bontás alattiak.
  const inMg3Dock = c => siteOf(c) === 'MG3' && MG3_DOCK.includes(phaseKey(c));
  // Parkoló sorrendje: rámpa nélkül nyitott elöl, utána a nyithatók (régebbi elöl), végül a nyitásra várók.
  function parkList(site = 'MG1') {
    if (site === 'MG3') return yardList('MG3').filter(c => !inMg3Dock(c)).sort((a, b) => (isPrio(b) - isPrio(a)) || (phaseSince(a) < phaseSince(b) ? -1 : 1));
    const rank = c => (openNoRamp(c) ? 0 : phaseKey(c) === 'approved' ? 1 : 2);
    return yardList('MG1').filter(c => !c.ramp).sort((a, b) => rank(a) - rank(b) || (isPrio(b) - isPrio(a)) || (phaseSince(a) < phaseSince(b) ? -1 : 1));
  }
  // MG3 kirakodó sora: a nyithatóvá válás sorrendjében.
  const mg3Dock = () => yardList('MG3').filter(inMg3Dock).sort((a, b) => ((a.stages.approved || {}).at || '') < ((b.stages.approved || {}).at || '') ? -1 : 1);
  let svgUid = 0;

  function fmtDur(min) {
    min = Math.max(0, Math.round(min));
    if (min < 60) return `${min} p`;
    if (min < 1440) return `${Math.floor(min / 60)} ó ${pad(min % 60)} p`;
    const d = Math.floor(min / 1440);
    return `${d} nap ${Math.floor((min % 1440) / 60)} ó`;
  }

  // Késés: ennyi perccel az ETA után. A statisztika ETA-pontossága is ezzel számol.
  const LATE_MIN = 15;
  function lateInfo(c) {
    if (!c || c.state !== 'active' || c.arrived) return null;
    const today = iso(new Date());
    if (c.eta_time) {
      const t = new Date(`${c.eta_date || c.date}T${c.eta_time}:00`);
      const min = (Date.now() - t.getTime()) / 60000;
      return min > LATE_MIN ? { min, label: `Késik ${fmtDur(min)}` } : null;
    }
    if (c.date && c.date < today) return { min: 0, label: 'Nem érkezett meg' };
    return null;
  }

  const minutesBetween = (a, b) => (new Date(b) - new Date(a)) / 60000;

  function stepper(c) {
    const st = c.stages || {};
    const cur = phaseKey(c);
    const ci = STAGES.indexOf(cur);
    const now = nowIso();
    const op = openedAt(c);
    const endTs = [st.stored && st.stored.at, st.released && st.released.at].filter(Boolean).sort()[0] || '';
    // A bontás nem kap levelet, a „nyitjuk” + 15 perc a becsült kezdete. Ha az elengedés / betárolás ennél hamarabb
    // megjött, a bontás már lezajlott: kész, de pontos ideje nincs (különben az elengedésnél későbbi időt mutatna).
    const un0 = op ? isoAdd(op, UNPACK_MIN) : '';
    const un = un0 && endTs && endTs < un0 ? '' : un0;
    const at = {
      request: (st.request && st.request.at) || c.arrived_at || '',
      approved: st.approved ? st.approved.at : '', opened: op, unpack: un && un <= now ? un : '',
      released: st.released ? st.released.at : '', stored: st.stored ? st.stored.at : ''
    };
    // Levélsorrend-ellenőrzés: ha egy későbbi lépés levele korábban jött, mint ez, a két idő ellentmond egymásnak.
    // Az idő marad (a levél ideje), de jelölve, és az időköz nem lesz negatív.
    const odd = {};
    STAGES.forEach((k, i) => {
      if (!at[k]) return;
      const nx = STAGES.slice(i + 1).find(k2 => at[k2] && at[k2] < at[k]);
      if (nx) odd[k] = nx;
    });
    let prev = null, last = -1;
    const items = STAGES.map((k, i) => {
      // Betárolva elengedés nélkül: az elengedés kimarad (áthúzva). Nyitásról levél nélkül (később igazolva): kész, idő nélkül.
      const skip = k === 'released' && cur === 'stored' && !at.released;
      const done = !skip && (!!at[k] || (ci >= 0 && i <= ci && k !== 'released') || (k === 'released' && cur === 'released'));
      const dur = at[k] && prev && at[k] >= prev ? fmtDur(minutesBetween(prev, at[k])) : '';
      if (at[k] && (!prev || at[k] > prev)) prev = at[k];
      if (done) last = i;
      // A bontás ideje előre látszik (halványan), amíg a 15 perc le nem telik.
      const plan = !at[k] && k === 'unpack' && un ? `~${hm(un)}` : '';
      const tip = odd[k] ? ` title="${esc(`A(z) „${STAGE_LABEL[odd[k]]}” levél korábban jött (${hm(at[odd[k]])}), mint ez a lépés.`)}"` : '';
      return `
        <li class="${done ? 'done' : ''}${i === ci ? ' cur' : ''}${skip ? ' skip' : ''}${odd[k] ? ' odd' : ''}" style="--i:${i}"${tip}>
          <span class="sp-dot" aria-hidden="true"></span>
          <span class="sp-lab">${esc(STAGE_LABEL[k])}</span>
          <span class="sp-at">${at[k] ? esc(hm(at[k])) : plan ? `<span class="sp-plan">${esc(plan)}</span>` : '—'}</span>
          <span class="sp-dur">${dur ? '+' + esc(dur) : ''}</span>
        </li>`;
    }).join('');
    const endAt = at.stored || at.released;
    const total = at.request && endAt ? fmtDur(minutesBetween(at.request, endAt)) : '';
    const sto = c.storage && !st.stored ? `<span>${c.storage.done}/${c.storage.total} PDD betárolva</span>` : '';
    return `
      <section class="flow" aria-label="Mérföldkövek">
        <div class="flow-head"><b>Mérföldkövek</b>${total ? `<span>Átfutás: ${esc(total)}</span>` : sto}</div>
        <ol class="steps" style="--n:${STAGES.length};--sp:${Math.max(0, last) / (STAGES.length - 1)}">${items}</ol>
      </section>`;
  }

  // A szerkesztőmező súgója: mely rámpák foglaltak most (az udvaron állók szerint, naptól függetlenül).
  function rampUse(exceptId) {
    const used = {};
    Object.entries(rampMap(exceptId)).forEach(([r, x]) => { used[r] = x.id; });
    RAMP_LIST.forEach(r => { if (!used[r] && glBlocks(r)) used[r] = 'kamion'; });
    return used;
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

  // Billentyűzettel: ↓/↑ lépteti a kijelölt találatot, Enter megnyitja, Esc töröl (combobox minta).
  let qIdx = -1;
  function searchState(open) {
    const q = $('#q');
    q.setAttribute('aria-expanded', String(open));
    const hits = $('#qres').querySelectorAll('.qhit');
    hits.forEach((h, i) => { h.classList.toggle('act', i === qIdx); h.setAttribute('aria-selected', String(i === qIdx)); });
    if (open && hits[qIdx]) { q.setAttribute('aria-activedescendant', hits[qIdx].id); hits[qIdx].scrollIntoView({ block: 'nearest' }); }
    else q.removeAttribute('aria-activedescendant');
  }
  function closeSearch() {
    $('#qres').hidden = true;
    qIdx = -1;
    searchState(false);
  }

  // A lista zárás közben (kifutó áttűnés) még megtartja a tartalmát; csak utána ürül.
  let qClear = 0;
  function renderSearch() {
    const box = $('#qres');
    const q = $('#q').value.trim();
    clearTimeout(qClear);
    if (q.length < 3) {
      box.hidden = true;
      qClear = setTimeout(() => { if (box.hidden) box.innerHTML = ''; }, 220);
      qIdx = -1; searchState(false); $('#qcount').textContent = '';
      return;
    }
    const hits = searchHits(q);
    const opening = box.hidden;
    box.hidden = false;
    qIdx = hits.length ? 0 : -1;
    const say = hits.length ? `${hits.length} találat` : 'Nincs találat';
    if ($('#qcount').textContent !== say) $('#qcount').textContent = say;
    box.innerHTML = hits.length ? hits.map(({ c, where, val }, i) => {
      const day = c.state === 'active' ? panelDay(c) : c.removed_from;
      const out = c.state === 'removed';
      return `<button type="button" class="qhit" id="qh-${i}" role="option" tabindex="-1" data-action="qopen" data-id="${esc(c.id)}" style="--i:${i}">
        <span class="qhit-id">${mark(c.id, q)}${prioIc(c)}</span>
        <span class="qhit-meta">${day ? `${DOW_S[dowIdx(day)]} ${short(day)}` : ''} · ${val ? `${esc(where)} ${mark(val, q)}` : esc(where)}</span>
        <span class="ph ph-${out ? 'out' : `${phase(c).grp} phk-${phase(c).key}`}">${esc(out ? ST_LABEL.removed : stageText(c))}</span>
      </button>`;
    }).join('') : '<div class="qnone">Nincs találat</div>';
    searchState(true);
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
    const early = devs.filter(d => d < -LATE_MIN).length, ok = devs.filter(d => Math.abs(d) <= LATE_MIN).length, lateN = devs.filter(d => d > LATE_MIN).length;

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

    // Napi nézet (Egy átlagos konténer útja, Konténerenként): a kiválasztott nap konténerei az érkezés napja szerint,
    // a kapcsolóval csak a lezártak (elengedve vagy betárolva).
    const sd = S.statDay || today;
    const closedC = c => ['released', 'stored'].includes(phaseKey(c));
    const dayAll = act.filter(c => panelDay(c) === sd);
    const shown = (S.statClosed ? dayAll.filter(closedC) : dayAll).slice()
      .sort((a, b) => { const ka = at(a, 'request') || `~${a.eta_time || '~'}`, kb = at(b, 'request') || `~${b.eta_time || '~'}`; return ka < kb ? -1 : ka > kb ? 1 : 0; });
    const atD = (c, k) => (k === 'end' ? [at(c, 'stored'), at(c, 'released')].filter(Boolean).sort()[0] || null : at(c, k));
    const spanD = (a, b) => shown.map(c => { const x = atD(c, a), y = atD(c, b); return x && y ? minutesBetween(x, y) : null; }).filter(v => v != null && v >= 0);
    const segs = [['Megérkezett → Nyitható', avg(spanD('request', 'approved')) || 0, 's1'], ['Nyitható → Nyitás', avg(spanD('approved', 'opened')) || 0, 's2'], ['Nyitás → Betárolva / Elengedve', avg(spanD('opened', 'end')) || 0, 's3']];
    const segSum = segs.reduce((t, x) => t + x[1], 0);
    const nClosed = dayAll.filter(closedC).length;
    const dayBar = `
          <div class="sday" role="group" aria-label="Nap kiválasztása">
            <button type="button" class="ibtn sday-b" data-action="sday" data-step="-1" aria-label="Előző nap">${IC.left}</button>
            <div class="sday-cur"><b>${DOW[dowIdx(sd)]}</b><span>${longLabel(sd)}</span>${sd === today ? '<i class="ds-today">ma</i>' : ''}</div>
            <button type="button" class="ibtn sday-b" data-action="sday" data-step="1" aria-label="Következő nap"${sd >= today ? ' disabled' : ''}>${IC.right}</button>
            <span class="sday-n">${dayAll.length} konténer, ebből ${nClosed} lezárt</span>
            <button type="button" class="sw-tg" role="switch" aria-checked="${S.statClosed}" data-action="sclosed"><i aria-hidden="true"></i>Csak lezártak</button>
          </div>`;

    return `
      <div class="statsv">
        <section class="sx">
          <h2 class="sx-h">Áttekintés</h2>
          <div class="hero">
            <div class="hero-main">
              ${ring(storedL.length, past.length, 'done', 132, `<text x="50%" y="50%" text-anchor="middle"><tspan class="ring-n" x="50%" dy=".1em">${storedL.length}</tspan><tspan class="ring-l" x="50%" dy="1.7em">betárolva</tspan></text>`)}
              <div><div class="hero-n">${num(past.length, 'int', 150)}<small> konténer</small></div>
                <div class="hero-sub">${arrived.length} megérkezett</div>
                <div class="hero-sub">${fmtT(kg)} · ${fmtInt(ct)} colli</div></div>
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
          ${dayBar}
          <div class="panel chart" data-reveal>
            <div class="chart-head"><b>Egy átlagos konténer útja</b><span class="chart-sub">${segSum ? `${esc(fmtDur(segSum))}, ${esc(`${DOW[dowIdx(sd)].toLowerCase()}i átlag`)}` : ''}</span></div>
            ${segSum ? `<div class="flowbar">${segs.map(([k, v, cl], i) => `<div class="fb fb-${cl}" style="flex:${Math.max(v, segSum * 0.06)};--i:${i}" data-tip="${esc(`${k}: ${fmtDur(v)}`)}"><b>${esc(fmtDur(v))}</b><span>${esc(k)}</span></div>`).join('')}</div>` : '<div class="empty">Erre a napra még nincs elég adat.</div>'}
          </div>
          <div class="panel chart" data-reveal>
            <div class="chart-head"><b>Konténerenként</b><span class="lg"><i class="fb-s1"></i>Megérkezett → Nyitható</span><span class="lg"><i class="fb-s2"></i>Nyitható → Nyitás</span><span class="lg"><i class="fb-s3"></i>Nyitás → Betárolva / Elengedve</span>${sd === today ? '<span class="lg"><i class="fb-live"></i>Folyamatban</span>' : ''}</div>
            ${gantt(shown, atD, sd === today)}
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
      const tip = `${DOW[dowIdx(x.d)]}, ${short(x.d)} · ${x.n} konténer · ${fmtT(x.kg)} · ${fmtInt(x.ct)} colli`;
      const lab = i % every === 0 ? `<text x="${cx + bw / 2}" y="${H - 8}" class="g-lab" text-anchor="middle">${short(x.d)}</text>` : '';
      return `<g class="bar-hit" data-tip="${esc(tip)}"><rect x="${cx}" y="${T}" width="${bw}" height="${H - T - B}" class="hit"/>${h ? `<rect x="${cx + 1.5}" y="${y(x.n)}" width="${w}" height="${h}" rx="3" class="cb ${cls}" style="--i:${Math.round(i * 40 / data.length)}"/>` : ''}</g>${lab}`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Napi konténerszám">${grid}${bars}</svg>`;
  }

  // Konténerenként: a nap minden konténere (vagy csak a lezártak). A szakaszok a meglévő mérföldkövekig tartanak,
  // a mai napon a még folyamatban lévő konténer utolsó szakasza a mostani pillanatig, halványan.
  function gantt(list, at, live) {
    if (!list.length) return `<div class="empty">${S.statClosed ? 'Erre a napra még nincs lezárt konténer.' : 'Erre a napra nincs konténer.'}</div>`;
    const now = nowIso();
    const rows = list.map(c => ({ c, r: at(c, 'request'), a: at(c, 'approved'), o: at(c, 'opened'), s: at(c, 'end') }));
    const endOf = x => x.s || (live && x.r ? now : x.o || x.a || x.r);
    const span = x => (x.r ? minutesBetween(x.r, endOf(x)) : 0);
    const max = Math.max(60, ...rows.map(span));
    const LAB = { r: 'Megérkezett', a: 'Nyitható', o: 'Nyitás', s: 'Lezárva' };
    const CL = { a: 's1', o: 's2', s: 's3' };
    return `<div class="gantt">${rows.map((x, i) => {
      let segs = '', tot = '';
      if (!x.r) {
        tot = x.c.eta_time ? `ETA ${x.c.eta_time}` : 'nem érkezett';
      } else {
        // Ha egy mérföldkő hiányzik, a szakasz a következő meglévőig tart, így a sáv nem marad üresen.
        const pts = ['r', 'a', 'o', 's'].filter(k => x[k]);
        segs = pts.slice(1).map((k, j) => {
          const from = pts[j], m = minutesBetween(x[from], x[k]);
          return `<i class="fb-${CL[k]}" style="width:${(Math.max(0, m) / max) * 100}%;--k:${j}" data-tip="${esc(`${x.c.id} · ${LAB[from]} → ${LAB[k]}: ${fmtDur(m)}`)}"></i>`;
        }).join('');
        const last = x[pts[pts.length - 1]];
        if (!x.s && live) {
          const m = minutesBetween(last, now);
          if (m > 0) segs += `<i class="fb-live" style="width:${(m / max) * 100}%;--k:${pts.length}" data-tip="${esc(`${x.c.id} · ${stageText(x.c)}, ${fmtDur(m)} óta`)}"></i>`;
        }
        tot = x.s ? fmtDur(span(x)) : `${fmtDur(span(x))}|folyamatban`;
      }
      return `<div class="g-row${x.s ? '' : ' open'}" style="--i:${Math.min(i, 16)}"><button type="button" class="g-id" data-action="open" data-id="${esc(x.c.id)}">${esc(x.c.id)}</button><span class="g-day">${esc(stageText(x.c))}</span>
        <div class="g-track"><span class="g-bar">${segs}</span></div>
        <span class="g-tot">${esc(tot.split('|')[0])}${tot.includes('|') ? '<small class="g-open">, folyamatban</small>' : ''}</span></div>`;
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
        ${opts.prio ? '<path class="ct-pf" d="M2 6h30L2 36z"/>' : ''}
        ${opts.px != null && !late ? `<rect class="ct-px" x="2" y="6" width="396" height="84" rx="2" style="--h:${opts.px}"/>` : ''}
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

  // Kártyák sorrendje: rámpán állók (rámpaszám szerint), parkoló (mint az udvaron), késők, a többi tervben lévő
  // érkezési sorrendben, végül az elengedett / betárolt (a legutóbbi elöl).
  const FLEET_N = 8;
  function fleetOrder(list) {
    const grp = c => (onRamp(c) || inMg3Dock(c) ? 0 : ON_YARD.includes(phaseKey(c)) ? 1 : phaseKey(c) === 'plan' ? (lateInfo(c) ? 2 : 3) : 4);
    const prk = c => (openNoRamp(c) ? 0 : phaseKey(c) === 'approved' ? 1 : 2);
    return list.slice().sort((a, b) => {
      const ga = grp(a), gb = grp(b);
      if (ga !== gb) return ga - gb;
      if (ga === 0) return (onRamp(a) ? a.ramp : 1000) - (onRamp(b) ? b.ramp : 1000);
      if (ga === 1) return prk(a) - prk(b) || (isPrio(b) - isPrio(a)) || (phaseSince(a) < phaseSince(b) ? -1 : 1);
      if (ga === 4) return phaseSince(a) < phaseSince(b) ? 1 : -1;
      return byArrival(a, b);
    });
  }

  function fleet(d, list) {
    if (!list.length) return '';
    const keys = pxKeys(pxCountC(list));
    const cards = fleetOrder(list).map((c, i) => {
      const ph = phase(c);
      const late = lateInfo(c);
      const cp = cPx(c);
      // Érkezési idő: a megérkezettnél a tényleges, egyébként az ETA.
      const at = c.arrived
        ? { k: 'k-in', t: 'Érkezett', v: c.arrived_at ? (c.arrived_at.slice(0, 10) === d ? hm(c.arrived_at) : stamp(c.arrived_at)) : '—' }
        : c.eta_time ? { k: 'k-eta', t: 'ETA', v: c.eta_time } : { k: 'k-none', t: 'ETA', v: 'még nincs' };
      // Nyitható konténer rámpa nélkül: egy gombbal választható neki rámpa (a kártyán kívül, hogy ne legyen gomb a gombban).
      const go = needsRamp(c) ? `<button type="button" class="cc-go${openNoRamp(c) ? ' warn' : ''}" data-action="pick" data-id="${esc(c.id)}">${openNoRamp(c) ? `${IC.warn}Nincs rámpa` : 'Rámpa választása'}</button>` : '';
      return `
        <div class="cc-cell${go ? ' has-go' : ''}" data-cell="${esc(c.id)}">
        <button type="button" class="ccard${late ? ' is-late' : ''}${isPrio(c) ? ' is-prio' : ''}" data-action="open" data-id="${esc(c.id)}" style="--i:${Math.min(i, 11)}">
          <span class="ct-wrap"><i class="cc-ground"><i class="cc-shadow"></i></i><span class="ct-rig"><span class="ct-sw">${HOIST}${containerSvg(c, { px: cp ? pxHue(cp, keys) : null, prio: isPrio(c) })}</span></span></span>
          <span class="cc-top">
            <span class="cc-w"><b>${fmtDec((c.kg || 0) / 1000, 1, 1)}</b><small>t</small></span>${isPrio(c) ? `<span class="prio-tag">${IC.prio}Prioritás</span>` : ''}
            <span class="ph ph-${late ? 'late' : `${ph.grp} phk-${ph.key}`}">${esc(late ? late.label : ph.label)}</span>
          </span>
          <span class="cc-sub">${fmtInt(c.ctns)} colli · ${c.pdd.length} PDD${onRamp(c) ? `<span class="ramp-chip">Rámpa ${c.ramp}</span>` : ''}${canSite(c) && siteOf(c) === 'MG3' ? '<span class="site-chip">MG3</span>' : ''}${carryTag(c, d) ? `<span class="carry-tag" title="${esc(`Tervezve: ${DOW[dowIdx(c.day)]}, ${short(c.day)}${c.eta_time ? ` ${c.eta_time}` : ''}`)}">${esc(carryTag(c, d))}</span>` : ''}</span>
          <span class="cc-at ${at.k}"><small>${at.t}</small><b>${esc(at.v)}</b></span>
        </button>${go}
        </div>`;
    }).join('');
    const n = list.length;
    // Alapból 2 × 4 kártya (telefonon 4), a többi lenyitható; a gomb azt írja, hány kártya van még elrejtve.
    const more = n > 4 ? `<div class="fleet-more-row${n <= FLEET_N ? ' few' : ''}" data-n="${n}"><button type="button" class="fleet-more" data-action="fleet-more" aria-expanded="${!!S.fleetOpen}" aria-controls="fleet-grid"><span class="fm-l">${fleetLabel(n)}</span>${IC.down}</button></div>` : '';
    return `
      <section class="fleet" aria-label="Konténerek" data-reveal>
        <div class="fleet-grid${S.fleetOpen ? ' open' : ''}" id="fleet-grid">${cards}</div>
        ${more}
      </section>`;
  }

  // A gomb felirata: zárva a még rejtett kártyák száma (telefonon 4, gépen 8 látszik), nyitva „Kevesebb”.
  const FLEET_NARROW = window.matchMedia('(max-width: 760px)');
  const fleetLabel = n => (S.fleetOpen ? 'Kevesebb' : `+${Math.max(1, n - (FLEET_NARROW.matches ? 4 : FLEET_N))} további lenyitása`);
  FLEET_NARROW.addEventListener('change', () => {
    const row = $('#view .fleet-more-row');
    if (row) row.querySelector('.fm-l').textContent = fleetLabel(Number(row.dataset.n));
  });

  // Lenyitás / becsukás újrarajzolás nélkül: a rács magassága átúszik, az előbukkanó kártyák sorban beúsznak.
  function toggleFleet() {
    const g = $('#view .fleet-grid');
    S.fleetOpen = !S.fleetOpen;
    if (!g) return;
    const h0 = g.offsetHeight;
    g.classList.toggle('open', S.fleetOpen);
    const b = $('#view .fleet-more');
    if (b) { b.setAttribute('aria-expanded', String(S.fleetOpen)); b.querySelector('.fm-l').textContent = fleetLabel(Number(b.parentElement.dataset.n)); }
    if (!canFly()) return;
    const h1 = g.offsetHeight;
    g.animate([{ height: `${h0}px`, overflow: 'hidden' }, { height: `${h1}px`, overflow: 'hidden' }], { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
    if (S.fleetOpen) {
      const narrow = window.matchMedia('(max-width: 760px)').matches;
      [...g.children].slice(narrow ? 4 : FLEET_N).forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: Math.min(i, 12) * 30, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
    } else {
      const top = g.getBoundingClientRect().top;
      if (top < 0) g.scrollIntoView({ block: 'start', behavior: RM.matches ? 'auto' : 'smooth' });
    }
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

  // Mérföldkő-számláló: a nap konténerei fázisonként, négy csoportban (úton, parkoló, rámpán, kész).
  const MS_GROUPS = [['Úton', ['plan']], ['Parkoló', ['request', 'approved']], ['Rámpán', ['opened', 'unpack']], ['Kész', ['released', 'stored']]];
  function msCounter(d, list) {
    const U = UP();
    const W = l => (U ? sumPdd(l) : l.length);
    const of = k => list.filter(c => phaseKey(c) === k);
    let n = 0;
    return `<div class="ms" style="--i:3"><dt class="sr">Fázisok</dt><dd>${MS_GROUPS.map(([g, ks]) => {
      const tot = W(list.filter(c => ks.includes(phaseKey(c))));
      return `<div class="ms-g"><div class="ms-gh"><span>${g}</span><b>${num(tot, 'int', 260 + n * 40)}${g === 'Rámpán' && d === S.today ? `<small> / ${RAMPS}</small>` : ''}</b></div>
        <div class="ms-st">${ks.map(k => {
          const v = W(of(k));
          const cr = of(k).filter(c => c.day !== d);
          const crW = cr.length ? W(cr) : 0;
          const from = cr.every(c => c.day === addDays(d, -1)) ? 'tegnapról' : cr.every(c => c.day > d) ? 'előre jött' : 'korábbról';
          n++;
          return `<div class="ms-s phk-${k}${k === 'approved' && v ? ' hot' : ''}${v ? '' : ' zero'}"><b>${num(v, 'int', 260 + n * 40)}</b><i class="mk" aria-hidden="true"></i><span>${PHASE[k][0]}</span>${crW ? `<em class="ms-carry" title="${esc(cr.map(c => `${c.id}: ${carryTag(c, d)}`).join(', '))}">+${crW} ${from}</em>` : ''}</div>`;
        }).join('')}</div></div>`;
    }).join('')}</dd></div>`;
  }

  function dayPanel() {
    const d = S.sel;
    const list = panelOn(d);
    // Fuvarlevél-módban minden mutató fuvarlevélben: a fuvarlevél a konténerével érkezik, kap ETA-t és késik.
    const U = UP();
    const W = l => (U ? sumPdd(l) : l.length);
    const tot = W(list);
    const late = W(list.filter(c => lateInfo(c)));
    // Üres nap: nincs nullás számlálósor és üres idősáv, csak a dátum és az ok.
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
            <div style="--i:0"><dt>${U ? 'Fuvarlevél' : 'Konténer'}</dt><dd>${num(tot, 'int', 140)}</dd></div>
            <div style="--i:1"><dt>Bruttó súly</dt><dd>${num(sumKg(list), 't', 190)}</dd></div>
            <div style="--i:2"><dt>Colli</dt><dd>${num(sumCt(list), 'int', 240)}</dd></div>
            ${msCounter(d, list)}
            ${late ? `<div class="st-late st-ring" style="--i:6">${ring(late, tot, 'late')}<span><dt>Késik</dt><dd>${num(late, 'int', 600)}</dd></span></div>` : ''}
          </dl>
        </div>
        ${fleet(d, list)}
        ${laneView(d, list)}
        ${table(d, list)}
      </main>`;
  }

  // ---------- idősáv: ki mettől meddig állt a rámpán, ki vár a parkolóban, ki érkezik még ----------
  // A rámpán töltött idő a rámpa beírásától (ha a nyitás korábbi, attól) az elengedésig / betárolásig tart,
  // amíg tart, a mostani pillanatig. Csak az utolsó rámpa ismert: áthelyezés előtti rámpa nem látszik.
  function laneView(d, list) {
    const isToday = d === S.today;
    const now = nowIso();
    const t0 = new Date(`${d}T00:00:00`).getTime();
    const mOf = ts => (new Date(ts).getTime() - t0) / 60000;
    const nowM = mOf(now);
    const ramps = [], parks = [];
    for (const c of list) {
      const st = c.stages || {};
      const k = phaseKey(c);
      if (k === 'plan' || k === 'request' && !c.ramp) {
        if (k === 'request' && isToday && ON_YARD.includes(k)) parks.push(c);
        continue;
      }
      if (c.ramp && k !== 'request') {
        const op = openedAt(c);
        const cands = [c.ramp_set, op, st.approved && st.approved.at].filter(Boolean).sort();
        let start = c.ramp_set && op && c.ramp_set > op ? op : (c.ramp_set || cands[0]);
        if (!start) continue;
        // A rámpa az elengedésnél vagy a betárolásnál szabadul fel, amelyik előbb jött.
        const endTs = [st.stored && st.stored.at, st.released && st.released.at].filter(Boolean).sort()[0] || '';
        const live = !endTs && ON_YARD.includes(k);
        const end = endTs || (live ? now : start);
        if (end < start) start = end;
        const segs = [];
        const add = (key, a, b, wait) => { if (a && b && b > a) segs.push({ key, a, b, wait }); };
        const un = op ? isoAdd(op, UNPACK_MIN) : '';
        if (op) {
          add('approved', start, op < end ? op : end, true);
          add('opened', op > start ? op : start, un < end ? un : end);
          add('unpack', un > start ? un : start, end);
        } else if (c.opened_implied) add('unpack', start, end);
        else add('approved', start, end, true);
        if (!segs.length) continue;
        const tail = endTs ? (st.stored && st.stored.at === endTs ? `betárolva ${hm(endTs)}` : `elengedve ${hm(endTs)}`) : '';
        ramps.push({ c, r: c.ramp, segs, live, tail });
      } else if (isToday && ON_YARD.includes(k)) parks.push(c);
    }
    // Konténerenként (alapnézet): egy sor egy konténer, a teljes útja a rámpától függetlenül:
    // parkolóban vár (nyitáskéréstől), nyitható és vár, nyitás alatt, bontás alatt, az elengedésig / betárolásig.
    const perCt = S.laneMode !== 'ramp';
    const cts = !perCt ? [] : list.map(c => {
      const st = c.stages || {}, k = phaseKey(c);
      const req = (st.request && st.request.at) || c.arrived_at || '';
      if (k === 'plan' || !req) return { c, k, segs: [] };
      const appr = st.approved ? st.approved.at : '';
      const op = openedAt(c), un = op ? isoAdd(op, UNPACK_MIN) : '';
      const endTs = [st.stored && st.stored.at, st.released && st.released.at].filter(Boolean).sort()[0] || '';
      const live = !endTs && ON_YARD.includes(k);
      const end = endTs || (live ? now : [op, appr, req].filter(Boolean).sort().pop());
      const lo1 = (...t) => t.filter(Boolean).sort()[0];
      const segs = [];
      const add = (key, a, b, wait) => { if (a && b && b > a) segs.push({ key, a, b, wait }); };
      add('request', req, lo1(appr, op, end), true);
      if (appr) add('approved', appr, lo1(op, end), true);
      if (op) { add('opened', op, lo1(un, end)); add('unpack', un, end); }
      else if (c.opened_implied && (appr || req) < end) add('unpack', appr || req, end);
      const tail = endTs ? (st.stored && st.stored.at === endTs ? `betárolva ${hm(endTs)}` : `elengedve ${hm(endTs)}`)
        : openNoRamp(c) ? 'nincs rámpa' : live ? PHASE[k][0].toLowerCase() : '';
      const rmp = siteOf(c) === 'MG3' ? 'MG3' : c.ramp && (onRamp(c) || endTs) ? `R${c.ramp}` : '';
      return { c, k, segs, live, tail: [rmp, tail].filter(Boolean).join(' · ') };
    });
    const etas = list.filter(c => phaseKey(c) === 'plan' && c.eta_time);
    const noEta = list.filter(c => !c.eta_time && !c.arrived);
    // Időtengely: 6–20 óra, ha az adat kilóg, kitágul (egész órára).
    const ms = [];
    cts.forEach(x => x.segs.forEach(g => ms.push(mOf(g.a), mOf(g.b))));
    ramps.forEach(x => x.segs.forEach(g => ms.push(mOf(g.a), mOf(g.b))));
    parks.forEach(c => { const a = (c.stages.request && c.stages.request.at) || c.arrived_at; if (a) ms.push(mOf(a)); });
    etas.forEach(c => ms.push(toH(c.eta_time) * 60));
    if (isToday) ms.push(nowM);
    const lo = Math.max(0, Math.min(6 * 60, Math.floor(Math.min(...ms, 1440) / 60) * 60));
    const hi = Math.min(24 * 60, Math.max(20 * 60, Math.ceil(Math.max(...ms, 0) / 60) * 60));
    const X = m => (Math.min(hi, Math.max(lo, m)) - lo) / (hi - lo) * 100;
    const bar = (id, segs, cls, txt) => {
      const a = X(mOf(segs[0].a)), b = X(mOf(segs[segs.length - 1].b));
      const inner = segs.map(g => `<i class="lk-${g.key}${g.wait ? ' wait' : ''}" style="flex:${Math.max(0.0001, mOf(g.b) - mOf(g.a))} 0 0"></i>`).join('');
      const label = `${id} · ${segs.map(g => `${g.wait ? 'vár' : PHASE[g.key][0].toLowerCase()} ${hm(g.a)}–${hm(g.b)}`).join(', ')}`;
      return `<button type="button" class="ln-bar ${cls}" data-action="open" data-id="${esc(id)}" style="left:${a.toFixed(3)}%;width:${Math.max(0.4, b - a).toFixed(3)}%" aria-label="${esc(label)}" data-tip="${esc(label)}">${inner}</button>${txt ? `<span class="ln-txt" style="left:${b.toFixed(3)}%">${esc(txt)}</span>` : ''}`;
    };
    let rows = '';
    const etaMark = c => {
      const m = toH(c.eta_time) * 60, late = lateInfo(c);
      return `${late && isToday ? `<span class="ln-miss" style="left:${X(m).toFixed(3)}%;width:${Math.max(0, X(nowM) - X(m)).toFixed(3)}%"></span>` : ''}<button type="button" class="ln-eta${late ? ' late' : ''}" data-action="open" data-id="${esc(c.id)}" style="left:${X(m).toFixed(3)}%" data-tip="${esc(`${c.id} · ETA ${c.eta_time}${late ? ` · ${late.label}` : ''}`)}">${esc(c.eta_time)}</button>`;
    };
    if (perCt) {
      rows = cts.map(x => {
        const ct = carryTag(x.c, d);
        const lb = `<span class="ln-lb${ct ? ' carry' : ''}"${ct ? ` title="${esc(ct)}"` : ''}>${esc(x.c.id)}</span>`;
        if (x.segs.length) return `<div class="ln-row">${lb}<div class="ln-trk">${bar(x.c.id, x.segs, `${x.live ? 'live' : ''}${openNoRamp(x.c) ? ' flag' : ''}`, x.tail)}</div></div>`;
        return `<div class="ln-row">${lb}<div class="ln-trk">${x.c.eta_time ? etaMark(x.c) : '<span class="ln-note">ETA nincs</span>'}</div></div>`;
      }).join('');
    }
    const byRamp = {};
    if (!perCt) ramps.forEach(x => { (byRamp[x.r] = byRamp[x.r] || []).push(x); });
    const used = Object.keys(byRamp).map(Number).sort((a, b) => a - b);
    if (used.length) {
      rows += '<div class="ln-grp">Rámpák</div>';
      used.forEach(r => {
        rows += `<div class="ln-row"><span class="ln-lb">R${r}</span><div class="ln-trk">${byRamp[r].map(x => bar(x.c.id, x.segs, x.live ? 'live' : '', `${x.c.id}${x.tail ? ' ' + x.tail : ''}`)).join('')}</div></div>`;
      });
      const idle = RAMPS - used.filter(rampOk).length;
      if (isToday && idle > 0) rows += `<div class="ln-row ln-rest"><span class="ln-lb"><small>+${idle} rámpa</small></span><div class="ln-trk"><span class="ln-note">ma nem volt használva</span></div></div>`;
    }
    if (!perCt && parks.length) {
      rows += '<div class="ln-grp">Parkoló</div>';
      [...parkList('MG1'), ...parkList('MG3'), ...mg3Dock()].filter(c => parks.includes(c)).forEach(c => {
        const st = c.stages || {};
        const req = (st.request && st.request.at) || c.arrived_at;
        const segs = [];
        if (req) segs.push({ key: 'request', a: req, b: (st.approved && st.approved.at) || openedAt(c) || now, wait: true });
        if (st.approved) segs.push({ key: 'approved', a: st.approved.at, b: openedAt(c) || now, wait: true });
        if (openedAt(c)) segs.push({ key: phaseKey(c), a: openedAt(c), b: now });
        const ok = segs.filter(g => g.b > g.a);
        rows += `<div class="ln-row"><span class="ln-lb">${esc(c.id)}</span><div class="ln-trk">${ok.length ? bar(c.id, ok, `live${openNoRamp(c) ? ' flag' : ''}`, openNoRamp(c) ? 'nincs rámpa' : siteOf(c) === 'MG3' ? 'MG3' : '') : ''}</div></div>`;
      });
    }
    if (!perCt && etas.length) {
      rows += `<div class="ln-grp">Érkezik</div><div class="ln-row"><span class="ln-lb">ETA</span><div class="ln-trk">${etas.map(etaMark).join('')}</div></div>`;
    }
    let ticks = '';
    for (let h = lo / 60; h <= hi / 60; h++) {
      if (h % 2) continue;
      if (isToday && Math.abs(h * 60 - nowM) < 35) continue;
      ticks += `<span style="left:${X(h * 60).toFixed(3)}%">${pad(h)}</span>`;
    }
    const nowLine = isToday && nowM >= lo && nowM <= hi ? `<div class="ln-now" style="--x:${(X(nowM) / 100).toFixed(4)}"><span>${hm(now)}</span></div>` : '';
    const empty = !rows ? `<div class="ln-empty">${isToday ? 'Még nincs rámpán, parkolóban vagy ETA-val érkező konténer.' : 'Erre a napra nincs rámpás vagy ETA-val érkező konténer.'}</div>` : '';
    const legend = perCt
      ? `<span class="ln-lg"><span><i class="lk-request wait"></i>Nyitás megkérve</span><span><i class="lk-approved wait"></i>Nyitható</span><span><i class="lk-opened"></i>Nyitás alatt</span><span><i class="lk-unpack"></i>Bontás alatt</span><span><i class="lg-eta"></i>ETA</span></span>`
      : `<span class="ln-lg"><span><i class="lk-opened"></i>Nyitás alatt</span><span><i class="lk-unpack"></i>Bontás alatt</span><span><i class="lk-approved wait"></i>Vár</span><span><i class="lg-eta"></i>ETA</span></span>`;
    const sw = `<span class="ln-sw" role="group" aria-label="Idősáv nézete"><button type="button" data-action="lane" data-v="ct" aria-pressed="${perCt}">Konténerenként</button><button type="button" data-action="lane" data-v="ramp" aria-pressed="${!perCt}">Rámpánként</button></span>`;
    return `
      <section class="panel lanes" aria-label="Idősáv" data-reveal>
        <div class="ln-head"><b>Idősáv</b>${sw}${rows ? legend : ''}</div>
        ${rows ? `<div class="ln-scroll"><div class="ln"><div class="ln-axis"><span class="ln-lb"></span><div class="ln-trk">${ticks}</div></div>${rows}${nowLine}</div></div>` : empty}
        ${!perCt && noEta.length ? `<div class="tray ln-tray">
          <div class="tray-head"><span>ETA nélkül</span><span class="mono">${noEta.length}</span></div>
          <div class="tray-list">${noEta.map((c, i) => `<button type="button" class="tray-item" data-action="open" data-id="${esc(c.id)}" style="--i:${Math.min(i, 8)}"><span>${esc(c.id)}${prioIc(c)}</span><span>${fmtT(c.kg)}</span></button>`).join('')}</div>
        </div>` : ''}
      </section>`;
  }

  // ---------- udvar (a heti sáv helyén, Hét / Udvar váltóval) ----------
  // Egy sorban az összes rámpa: a szabad keskeny, a foglalt kiszélesedik. Mellette a parkoló és a következő érkezők.
  const yardN = m => Math.max(RAMP_SLOTS, ...Object.keys(m).map(Number));
  // Foglalt: széles; szabad: keskeny; nem használható (szürke a táblán): még keskenyebb fal.
  const yardCols = (m, n) => Array.from({ length: n }, (_, i) => (m[i + 1] || glAt(i + 1) ? 'minmax(0,3.4fr)' : rampOk(i + 1) ? 'minmax(0,1fr)' : 'minmax(0,.62fr)')).join(' ');
  const yardCount = () => yardList().length;
  const siteCount = site => yardList(site).length;

  function bandSwitch() {
    const n = yardCount();
    return `<div class="band-sw" role="group" aria-label="Felső sáv nézete">
        <button type="button" class="bs-opt" data-action="band" data-v="week" aria-pressed="${S.band === 'week'}">Hét</button>
        <button type="button" class="bs-opt" data-action="band" data-v="yard" aria-pressed="${S.band === 'yard'}">Udvar${n ? `<b class="bs-n">${n}</b>` : ''}</button>
      </div>`;
  }
  // Raktárváltó az udvar fölött; a kijelölés csúszik, a gombokon az ott álló konténerek száma.
  function siteSwitch() {
    return `<div class="site-sw" role="group" aria-label="Raktár" data-v="${S.site}">
        <i class="site-ind" aria-hidden="true"></i>
        ${SITES.map(v => { const n = siteCount(v); return `<button type="button" class="site-opt" data-action="site" data-v="${v}" aria-pressed="${S.site === v}">${v}<b class="site-n${n ? '' : ' zero'}">${n}</b></button>`; }).join('')}
      </div>`;
  }
  function siteSum() {
    if (S.site === 'MG3') {
      const d = mg3Dock().length, p = parkList('MG3').length;
      return `<span><b>${d}</b> a kirakodóban</span><span><b>${p}</b> a parkolóban</span>`;
    }
    const m = rampMap();
    const busy = RAMP_LIST.filter(r => m[r] || glAt(r)).length;
    const trucks = Object.keys(GL).length;
    const other = glOther().map(t => `<span class="gl-oth" title="${esc(`${t.glabs_id} · ${glDesc(t)}`)}"><b>${esc(t.ramp)}</b>${glArrow(t)} ${esc(glPlates(t))}</span>`).join('');
    const old = GLST && GLST.last_ok && !glFresh() ? `<span class="gl-old">Glabs: ${esc(hm(toLocal(GLST.last_ok)))}</span>` : '';
    return `<span><b>${busy}</b> / ${RAMPS} rámpa foglalt</span><span><b>${parkList('MG1').length}</b> a parkolóban</span>${trucks ? `<span><b>${trucks}</b> kamion</span>` : ''}${other}${old}`;
  }

  // Glabs-kamion a rámpán: pótkocsi-tető a rendszámokkal; ha konténer is áll ott, csak egy keskeny csík.
  // Felül az irány (befelé / kifelé), alul az, hogy mióta hívták rámpára; a Glabs-azonosító a súgóban.
  function truckHtml(t, mini) {
    const fresh = glFresh(), d = glDir(t);
    const tip = `${t.ramp}: ${glPlates(t)} · ${t.glabs_id} · ${glDesc(t)}${fresh ? '' : ` · Glabs ${GLST && GLST.last_ok ? hm(toLocal(GLST.last_ok)) : '—'}`}`;
    const pl = t.plates && t.plates.length ? t.plates.map(p => `<b>${esc(p)}</b>`).join('') : '<i>rendszám nélkül</i>';
    const dir = d ? `<span class="tr-dir d-${esc(t.dir)}">${glArrow(t)}${mini ? '' : esc(d[0])}</span>` : '';
    if (mini) return `<div class="truck mini${fresh ? '' : ' stale'}" role="img" aria-label="${esc(tip)}" title="${esc(tip)}"><span class="tr-pl">${pl}</span>${dir}</div>`;
    return `<div class="truck${fresh ? '' : ' stale'}" role="img" aria-label="${esc(tip)}" title="${esc(tip)}">
        ${dir}<span class="tr-pl">${pl}</span>
        <span class="rf-plate"><b>${esc(glSince(t))}</b>${t.stage === 'loading' ? '<span>rakodik</span>' : ''}</span>
      </div>`;
  }

  function roofHtml(c) {
    const k = phaseKey(c);
    const where = siteOf(c) === 'MG3' ? 'MG3 kirakodó' : `${c.ramp}. rámpa`;
    // A szám vízszintes, két sorban (négy betű / hét számjegy): a 90 fokban fordított felirat nehezen olvasható.
    const pr = isPrio(c);
    return `<button type="button" class="roof phk-${k}${pr ? ' prio' : ''}" data-action="open" data-id="${esc(c.id)}" aria-label="${esc(`${c.id}, ${where}, ${PHASE[k][0]}${pr ? ', prioritás' : ''}`)}">
        ${pr ? `<span class="rf-fl" title="Prioritás">${IC.prio}</span>` : ''}
        <span class="rf-id"><span class="rf-l">${esc(c.id.slice(0, 4))}</span><span class="rf-d">${esc(c.id.slice(4))}</span></span>
        <span class="rf-plate"><b>${esc(PHASE[k][0])}</b><span>${esc(fmtDur(waitMin(c)))}</span></span>
      </button>`;
  }
  // Parkolóhely: a konténer, a fázisa, a várakozás; az MG1-ben rámpagomb (ha nyitható), és áthelyezés a másik raktárba.
  function slotHtml(c, drag) {
    const k = phaseKey(c), w = waitMin(c), flag = openNoRamp(c), site = siteOf(c);
    const other = site === 'MG1' ? 'MG3' : 'MG1';
    const lab = flag ? `${PHASE[k][0]}, nincs rámpa` : PHASE[k][0];
    const tip = site === 'MG1' && !needsRamp(c) ? ' title="Rámpát a nyitható levél után lehet választani"' : '';
    const pr = isPrio(c);
    return `<div class="slot" data-slot="${esc(c.id)}">
        <div class="pk phk-${k}${w > 60 ? ' long' : ''}${flag ? ' flag' : ''}${pr ? ' prio' : ''}"${drag ? ` draggable="true" data-drag="${esc(c.id)}"` : ''}${tip}>
          <button type="button" class="pk-main" data-action="open" data-id="${esc(c.id)}"><span class="pk-rf">${esc(c.id)}</span><span class="pk-lab">${esc(lab)}${prioIc(c)}</span><span class="pk-w">${esc(fmtDur(w))}</span></button>
          ${needsRamp(c) ? `<button type="button" class="pk-go" data-action="pick" data-id="${esc(c.id)}">Rámpa</button>` : ''}
          <button type="button" class="pk-mv" data-action="site-set" data-id="${esc(c.id)}" data-v="${other}" aria-label="${esc(`${c.id} áthelyezése: ${other}`)}" title="Áthelyezés: ${other}">${other}</button>
        </div>
      </div>`;
  }

  function gateHtml() {
    const today = onDay(S.today).filter(c => phaseKey(c) === 'plan' && c.eta_time).sort((a, b) => (a.eta_time < b.eta_time ? -1 : 1));
    const gate = today.slice(0, 3).map(c => {
      const d = minutesBetween(nowIso(), `${S.today}T${c.eta_time}:00`);
      const late = lateInfo(c);
      return `<button type="button" class="gate-r${late ? ' late' : ''}" data-action="open" data-id="${esc(c.id)}"><span class="gt-t">${esc(c.eta_time)}</span><span class="gt-id">${esc(c.id)}</span><span class="gt-r">${d < 0 ? `+${esc(fmtDur(-d))}` : esc(fmtDur(d))}</span></button>`;
    }).join('');
    const rest = today.length > 3 ? `<span class="gate-more">+${today.length - 3} ETA-val</span>` : '';
    return `<div class="gate"><h5>Érkezik</h5>${gate || '<span class="gate-none">Ma már nincs ETA-val érkező.</span>'}${rest}</div>`;
  }

  function yardBand() {
    return S.site === 'MG3' ? mg3Band() : mg1Band();
  }

  function mg1Band() {
    const m = rampMap();
    const n = yardN(m);
    const park = parkList('MG1');
    const cols = yardCols(m, n);
    let doors = '', bays = '', tiles = '';
    for (let r = 1; r <= n; r++) {
      const c = m[r], t = glAt(r);
      const off = !c && !t && !rampOk(r);
      const offT = off ? `${r}. hely: ${RAMP_OFF[r] || 'nincs ilyen rámpa'}, ide nem tud kamion állni` : '';
      doors += `<i class="door${c || t ? ' on' : off ? ' off' : ''}">${off ? '' : '<b class="shut"></b>'}</i>`;
      bays += off ? `<div class="bay off" data-r="${r}" title="${esc(offT)}"><span class="bay-n">${r}</span>${RAMP_OFF[r] === 'Joloda' ? '<span class="bay-j">J</span>' : ''}</div>`
        : `<div class="bay${c || t ? '' : ' free'}" data-r="${r}"><span class="bay-n">${r}</span>${c ? roofHtml(c) + (t ? truckHtml(t, true) : '') : t ? truckHtml(t) : ''}</div>`;
      tiles += c ? `<button type="button" class="tile busy phk-${phaseKey(c)}${isPrio(c) ? ' prio' : ''}" data-action="open" data-id="${esc(c.id)}" aria-label="${esc(`${r}. rámpa: ${c.id}, ${PHASE[phaseKey(c)][0]}`)}"><span class="tile-n">${r}</span><small>${esc(c.id.slice(0, 4))}</small></button>`
        : t ? `<span class="tile gl${glFresh() ? '' : ' stale'}" title="${esc(`${t.ramp}: ${glPlates(t)} · ${t.glabs_id} · ${glDesc(t)}`)}"><span class="tile-n">${r}${glArrow(t)}</span><small>${esc(t.plates && t.plates[0] ? t.plates[0] : '—')}</small></span>`
        : off ? `<span class="tile off" title="${esc(offT)}"><span class="tile-n">${r}</span>${RAMP_OFF[r] === 'Joloda' ? '<small>J</small>' : ''}</span>`
        : `<span class="tile"><span class="tile-n">${r}</span></span>`;
    }
    const parkHtml = drag => (park.length ? park.map(c => slotHtml(c, drag)).join('') : '<p class="park-empty">A parkoló üres.</p>');
    return `
      <div class="band-body yd" data-site="MG1">
        <div class="yd-wall"><b>MG1</b><span>${RAMP_SLOTS} rámpa, ebből ${RAMPS} használható</span></div>
        <div class="yd-wide">
          <div class="ramps">
            <div class="doors" style="grid-template-columns:${cols}" data-cols="${cols}">${doors}</div>
            <div class="bays" style="grid-template-columns:${cols}" data-cols="${cols}">${bays}</div>
          </div>
          <div class="park">
            <h4><span>Parkoló</span><b>${park.length}</b></h4>
            <div class="slots">${parkHtml(true)}</div>
            ${gateHtml()}
          </div>
        </div>
        <div class="yd-narrow">
          <div class="tiles">${tiles}</div>
          <div class="slots">${parkHtml(false)}</div>
        </div>
      </div>`;
  }

  // MG3: a rámpák száma még nem ismert, ezért számozatlan kirakodó sor: annyi kapu, ahány konténer áll ott,
  // legalább hat (a szabad kapuk keskenyek). Mellette a saját parkolója a még nem nyithatóknak.
  const MG3_MIN = 8;
  function mg3Band() {
    const dock = mg3Dock();
    const park = parkList('MG3');
    const n = Math.max(MG3_MIN, dock.length + 1);
    const cols = Array.from({ length: n }, (_, i) => (dock[i] ? 'minmax(0,2.4fr)' : 'minmax(0,1fr)')).join(' ');
    let doors = '', bays = '', tiles = '';
    for (let i = 0; i < n; i++) {
      const c = dock[i];
      doors += `<i class="door${c ? ' on' : ''}"><b class="shut"></b></i>`;
      bays += `<div class="bay${c ? '' : ' free mg3-free'}" data-r="${i + 1}"><span class="bay-n" aria-hidden="true">${c ? '' : '·'}</span>${c ? roofHtml(c) : ''}</div>`;
      if (c) tiles += `<button type="button" class="tile busy phk-${phaseKey(c)}${isPrio(c) ? ' prio' : ''}" data-action="open" data-id="${esc(c.id)}" aria-label="${esc(`MG3 kirakodó: ${c.id}, ${PHASE[phaseKey(c)][0]}`)}"><span class="tile-n">${esc(c.id.slice(0, 4))}</span><small>${esc(PHASE[phaseKey(c)][0])}</small></button>`;
    }
    const parkHtml = drag => (park.length ? park.map(c => slotHtml(c, drag)).join('') : '<p class="park-empty">Az MG3 parkolója üres.</p>');
    return `
      <div class="band-body yd yd-mg3" data-site="MG3">
        <div class="yd-wall"><b>MG3</b><span>kirakodó, rámpaszám nélkül</span></div>
        <div class="yd-wide">
          <div class="ramps">
            <div class="doors" style="grid-template-columns:${cols}" data-cols="${cols}">${doors}</div>
            <div class="bays" style="grid-template-columns:${cols}" data-cols="${cols}">${bays}</div>
            ${dock.length ? '' : '<p class="mg3-empty">Nincs nyitható vagy nyitás alatt álló konténer az MG3-ban.</p>'}
          </div>
          <div class="park">
            <h4><span>Parkoló</span><b>${park.length}</b></h4>
            <div class="slots">${parkHtml(true)}</div>
            ${gateHtml()}
          </div>
        </div>
        <div class="yd-narrow">
          <div class="tiles mg3-tiles">${tiles || '<p class="mg3-empty">Nincs konténer a kirakodóban.</p>'}</div>
          <div class="slots">${parkHtml(false)}</div>
        </div>
      </div>`;
  }

  // Késleltetett nyitás: a kapuk sorban felhúzódnak, a foglalt kapunál a redőny után a konténer is beáll,
  // a parkolóhelyek jobbról sorban beúsznak, végül az érkezők listája. Belépéskor és raktárváltáskor fut.
  function yardEnter(body, d0 = 0) {
    if (!body || !canFly()) return;
    const ease = 'cubic-bezier(.22,1,.36,1)';
    const wide = body.querySelector('.yd-wide');
    const wall = body.querySelector('.yd-wall');
    if (wall) wall.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: d0, easing: ease, fill: 'backwards' });
    if (wide && wide.offsetParent) {
      const doors = [...wide.querySelectorAll('.door')];
      const bays = [...wide.querySelectorAll('.bay')];
      doors.forEach((dr, i) => {
        const sh = dr.querySelector('.shut');
        if (!sh) return;
        const t = d0 + 90 + i * 32;
        if (dr.classList.contains('on')) {
          // foglalt kapu: zárva indul, felhúzódik, utána áll be a konténer
          sh.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(1)', offset: 0.15 }, { transform: 'scaleY(0)' }], { duration: 560, delay: t, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'backwards' });
          const roof = bays[i] && bays[i].querySelector('.roof');
          if (roof) roof.animate([{ opacity: 0, transform: 'translateY(-26px) scaleY(.92)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: t + 380, easing: ease, fill: 'backwards' });
        } else {
          // szabad kapu: a redőny leereszkedik
          sh.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 340, delay: t, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'backwards' });
        }
        bays[i] && bays[i].querySelector('.bay-n')?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: t, fill: 'backwards' });
      });
      wide.querySelectorAll('.park h4, .slot, .park-empty').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateX(26px)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: d0 + 160 + i * 70, easing: ease, fill: 'backwards' }));
      wide.querySelectorAll('.gate h5, .gate-r, .gate-none, .gate-more').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: d0 + 420 + i * 60, easing: ease, fill: 'backwards' }));
      wide.querySelectorAll('.mg3-empty').forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: d0 + 300, fill: 'backwards' }));
    } else {
      body.querySelectorAll('.yd-narrow .tile, .yd-narrow .mg3-empty').forEach((el, i) => el.animate([{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: d0 + 60 + i * 22, easing: ease, fill: 'backwards' }));
      body.querySelectorAll('.yd-narrow .slot, .yd-narrow .park-empty').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateX(22px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: d0 + 200 + i * 70, easing: ease, fill: 'backwards' }));
    }
  }

  // A felső sáv váltása: csak a sáv cserélődik, a magasság átúszik, a tartalom beúszik.
  function switchBand(v) {
    if (S.band === v) return;
    S.band = v;
    const old = S.view === 'week' && $('#view .yard');
    if (!old) { render(); return; }
    const h0 = old.offsetHeight;
    const tpl = document.createElement('template');
    tpl.innerHTML = weekView();
    const nu = tpl.content.querySelector('.yard');
    nu.classList.add('k-swap');
    const fk = focusKey();
    old.replaceWith(nu);
    refocus(fk);
    if (!canFly()) return;
    const h1 = nu.offsetHeight;
    nu.animate([{ height: `${h0}px`, overflow: 'hidden' }, { height: `${h1}px`, overflow: 'hidden' }], { duration: 440, easing: 'cubic-bezier(.22,1,.36,1)' });
    const body = nu.querySelector('.band-body, .yard-scroll');
    if (body) body.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 60, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    if (v === 'yard') yardEnter(nu.querySelector('.band-body'), 120);
    const ss = nu.querySelector('.site-sw');
    if (ss) ss.animate([{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 140, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  }

  // Raktárváltás: a régi udvar a váltás irányába kicsúszik, az új a másik oldalról beúszik, a sáv magassága átúszik,
  // utána a kapuk sorban kinyílnak (késleltetett nyitás). A kijelölés a váltón csúszik, a számláló frissül.
  let siteBusy = 0;
  function switchSite(v) {
    if (!SITES.includes(v) || S.site === v) return;
    const dir = SITES.indexOf(v) > SITES.indexOf(S.site) ? 1 : -1;
    S.site = v;
    const yard = S.view === 'week' && $('#view .yard.is-yd');
    const oldBody = yard && yard.querySelector('.band-body');
    if (!oldBody) { render(); return; }
    const tpl = document.createElement('template');
    tpl.innerHTML = yardBand().trim();
    const nu = tpl.content.firstElementChild;
    // a váltó és az összesítő helyben frissül: a kijelölés CSS-átmenettel csúszik
    const sw = yard.querySelector('.site-sw');
    if (sw) {
      sw.dataset.v = v;
      sw.querySelectorAll('.site-opt').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    }
    const sum = yard.querySelector('.yd-sum');
    if (sum) sum.innerHTML = siteSum();
    if (!canFly()) { oldBody.replaceWith(nu); return; }
    clearTimeout(siteBusy);
    yard.querySelectorAll('.yd-leaving').forEach(x => x.remove());
    const r0 = oldBody.getBoundingClientRect(), y0 = yard.getBoundingClientRect();
    const h0 = oldBody.offsetHeight;
    // a régi udvar a helyén marad, amíg kicsúszik (abszolút, hogy az új már a végső helyén mérhető legyen)
    oldBody.classList.add('yd-leaving');
    Object.assign(oldBody.style, { position: 'absolute', left: `${r0.left - y0.left}px`, top: `${r0.top - y0.top}px`, width: `${r0.width}px`, pointerEvents: 'none' });
    yard.style.position = 'relative';
    // A sáv alja vág: a magasabb régi udvar (és a szélre csúszó új) nem lóghat ki a sötét sávból a fehér rész fölé.
    yard.classList.add('yd-swap');
    oldBody.before(nu);
    if (sum) sum.animate([{ opacity: 0, transform: `translateX(${dir * 10}px)` }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' });
    const h1 = nu.offsetHeight;
    oldBody.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * 70}px)` }], { duration: 300, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' });
    nu.animate([{ opacity: 0, transform: `translateX(${dir * 70}px)` }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 140, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    if (h0 !== h1) nu.animate([{ height: `${h0}px`, overflow: 'hidden' }, { height: `${h1}px`, overflow: 'hidden' }], { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
    yardEnter(nu, 260);
    // A régi udvar a magasságváltás végéig marad (láthatatlanul), a vágás is addig tart.
    siteBusy = setTimeout(() => { oldBody.remove(); yard.style.position = ''; yard.classList.remove('yd-swap'); }, h0 !== h1 ? 500 : 320);
  }

  // Élő változásnál (rámpakiosztás, raktárváltás, levél) az udvar mozog: a parkolóból a konténer átcsúszik a rámpára,
  // a felszabaduló rámpáról kiúszik, a másik raktárba küldött konténer a raktárváltó gombjába repül, a rámpasor
  // oszlopai átrendeződnek, az új érkező beúszik a parkolóba. A teljes nézet újraépül, ezért előtte pillanatkép készül.
  function yardSnap() {
    const y = $('#view .yd-wide');
    if (!y || !y.offsetParent) return null;
    const snap = { site: S.site, cols: y.querySelector('.bays').style.gridTemplateColumns, roofs: {}, park: {} };
    y.querySelectorAll('.roof[data-id]').forEach(el => { snap.roofs[el.dataset.id] = { r: el.getBoundingClientRect(), html: el.outerHTML, bay: el.closest('.bay').dataset.r }; });
    // A parkolóból induló másolat felirat nélküli tető (vízszintesből függőlegesbe nyúlik, a szöveg torzulna).
    y.querySelectorAll('.slot[data-slot]').forEach(el => {
      const rf = el.querySelector('.pk-rf'), k = (el.querySelector('.pk').className.match(/phk-\w+/) || ['phk-approved'])[0];
      snap.park[el.dataset.slot] = { r: rf.getBoundingClientRect(), html: `<span class="roof-ghost ${k}"></span>` };
    });
    return snap;
  }
  function ghost(html, r, cls) {
    const g = document.createElement('div');
    g.className = `yd-ghost ${cls}`;
    g.innerHTML = html;
    Object.assign(g.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(g);
    return g;
  }
  function yardAnim(snap) {
    const y = $('#view .yd-wide');
    if (!snap || snap.site !== S.site || !y || !y.offsetParent || !canFly()) return;
    const bays = y.querySelector('.bays'), doors = y.querySelector('.doors');
    const target = bays.dataset.cols;
    const moved = [];
    y.querySelectorAll('.roof[data-id]').forEach(el => {
      const id = el.dataset.id, was = snap.roofs[id];
      if (was && was.bay === el.closest('.bay').dataset.r) return;
      moved.push({ el, from: was ? was.r : snap.park[id] && snap.park[id].r, html: was ? was.html : snap.park[id] && snap.park[id].html, roof: !!was });
    });
    const here = id => y.querySelector(`.roof[data-id="${CSS.escape(id)}"], .slot[data-slot="${CSS.escape(id)}"]`);
    const away = id => { const c = S.data.containers[id]; return c && canSite(c) && siteOf(c) !== S.site ? siteOf(c) : ''; };
    const leaving = Object.entries(snap.roofs).filter(([id]) => !y.querySelector(`.roof[data-id="${CSS.escape(id)}"]`));
    const sent = Object.entries(snap.park).filter(([id]) => !here(id) && away(id));
    const fresh = [...y.querySelectorAll('.slot[data-slot]')].filter(el => !snap.park[el.dataset.slot] && !snap.roofs[el.dataset.slot]);
    if (!moved.length && !leaving.length && !fresh.length && !sent.length && snap.cols === target) return;
    // A célhelyek a végső oszlopszélességgel mérve; utána az oszlopok a régi szélességről úsznak át.
    const ends = moved.map(x => x.el.getBoundingClientRect());
    if (snap.cols && snap.cols !== target) {
      bays.style.gridTemplateColumns = snap.cols;
      doors.style.gridTemplateColumns = snap.cols;
      void bays.offsetWidth;
      bays.classList.add('anim'); doors.classList.add('anim');
      requestAnimationFrame(() => { bays.style.gridTemplateColumns = target; doors.style.gridTemplateColumns = target; });
    }
    const allBays = [...bays.children], allDoors = [...doors.children];
    moved.forEach((x, i) => {
      const to = ends[i];
      // a konténer előtt a kapu redőnye felhúzódik
      const sh = allDoors[allBays.indexOf(x.el.closest('.bay'))]?.querySelector('.shut');
      if (sh) sh.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: 420, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'backwards' });
      if (!x.from) { x.el.animate([{ opacity: 0, transform: 'translateY(-16px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 260, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); return; }
      // A parkolóból (vagy másik rámpáról) induló másolat a rámpa helyére repül, közben a valódi tető előtűnik.
      const g = ghost(x.html, x.from, x.roof ? 'g-roof' : 'g-rf');
      const sx = to.width / x.from.width, sy = to.height / x.from.height;
      g.animate([
        { transform: 'none', opacity: 1 },
        { transform: `translate(${(to.left - x.from.left) * 0.5}px, ${Math.min(to.top, x.from.top) - x.from.top - 26}px) scale(${(1 + sx) / 2}, ${(1 + sy) / 2})`, opacity: 1, offset: 0.45 },
        { transform: `translate(${to.left - x.from.left}px, ${to.top - x.from.top}px) scale(${sx}, ${sy})`, opacity: 0.2 }
      ], { duration: 640, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }).finished.finally(() => g.remove());
      x.el.animate([{ opacity: 0 }, { opacity: 0, offset: 0.6 }, { opacity: 1 }], { duration: 700, easing: 'ease-out' });
    });
    // A rámpáról vagy a parkolóból a másik raktárba küldött konténer a raktárváltó gombjába repül, ott a szám megpattan.
    const flyToSite = (w, site) => {
      const btn = $(`#view .site-opt[data-v="${site}"]`);
      const t = btn && btn.getBoundingClientRect();
      if (!t || !t.width) return false;
      const g = ghost(w.html, w.r, 'g-roof');
      g.animate([
        { transform: 'none', opacity: 1 },
        { transform: `translate(${(t.left + t.width / 2 - w.r.left - w.r.width / 2) * 0.4}px, -40px) scale(.8)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${t.left + t.width / 2 - w.r.left - w.r.width / 2}px, ${t.top + t.height / 2 - w.r.top - w.r.height / 2}px) scale(.12)`, opacity: 0.1 }
      ], { duration: 720, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }).finished.finally(() => g.remove());
      const n = btn.querySelector('.site-n');
      if (n) setTimeout(() => n.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.3,1.6,.5,1)' }), 640);
      return true;
    };
    leaving.forEach(([id, w]) => {
      const site = away(id);
      if (site && flyToSite(w, site)) return;
      const g = ghost(w.html, w.r, 'g-roof');
      g.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-26px)', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' }).finished.finally(() => g.remove());
    });
    sent.forEach(([id, w]) => flyToSite(w, away(id)));
    fresh.forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateX(28px)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: i * 60, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
    setTimeout(() => { bays.classList.remove('anim'); doors.classList.remove('anim'); }, 700);
  }

  // Raktár mentése visszavonhatóan (MG1 = üres). Az MG3-ba küldött konténer elveszti az MG1-es rámpáját.
  // Ha az adatbázisban még nincs „site” oszlop, erről szól (a migráció a supabase/migrations mappában van).
  async function setSite(id, v) {
    const c = S.data.containers[id];
    if (!c || !SITES.includes(v) || siteOf(c) === v) return false;
    const man = MAN[id] || {};
    const prev = { site: man.site || null, ramp: man.ramp || null, ramp_set: man.ramp_set ? new Date(man.ramp_set).toISOString() : null };
    const row = { container: id, site: v === 'MG3' ? 'MG3' : null };
    if (v === 'MG3' && c.ramp) Object.assign(row, { ramp: null, ramp_set: null });
    const { data, error } = await sb.from('manual').upsert(row, { onConflict: 'container' }).select().single();
    if (error || !data) {
      console.error(error);
      if (error && /site/i.test(`${error.message || ''} ${error.details || ''}`)) toast('A raktár mentéséhez frissíteni kell az adatbázist', { sub: 'Supabase SQL Editorban: supabase/migrations/20261105120000_manual_site.sql', warn: true, ms: 14000 });
      else toast('A mentés nem sikerült');
      return false;
    }
    MAN[data.container] = normMan(data);
    rebuild();
    render();
    toast(`${id}: ${v}`, {
      sub: v === 'MG3' ? (MG3_DOCK.includes(phaseKey(c)) ? 'Az MG3 kirakodójába került.' : 'Az MG3 parkolójába került.') + (row.ramp === null ? ` A ${c.ramp}. rámpa felszabadult.` : '') : 'Az MG1 parkolójába került.',
      undo: async () => {
        const { data: d2, error: e2 } = await sb.from('manual').upsert({ container: id, ...prev }, { onConflict: 'container' }).select().single();
        if (e2 || !d2) { toast('A visszavonás nem sikerült'); return false; }
        MAN[d2.container] = normMan(d2);
        rebuild();
        render();
        return true;
      }
    });
    return true;
  }

  // ---------- rámpaválasztó ----------
  let PICK = null;
  function openPicker(id) {
    const c = S.data.containers[id];
    if (!canPick(c)) { toast('Rámpát a nyitható levél után lehet választani'); return; }
    const m = rampMap(c.id);
    const n = yardN(m);
    const free = Array.from({ length: n }, (_, i) => i + 1).filter(r => rampOk(r) && !m[r] && !glBlocks(r) && r !== c.ramp);
    PICK = { id: c.id, r: free[0] || null };
    const k = phaseKey(c);
    $('#rpick-title').textContent = `${c.id} rámpára`;
    $('#rpick-sub').textContent = c.ramp ? `Most a ${c.ramp}. rámpán áll. ${PHASE[k][0]}.` : openNoRamp(c) ? `${PHASE[k][0]}, de nincs rámpája.` : `${PHASE[k][0]}, ${fmtDur(waitMin(c))} óta a parkolóban.`;
    $('#rpick-grid').innerHTML = Array.from({ length: n }, (_, i) => {
      const r = i + 1, o = m[r];
      if (r === c.ramp) return `<span class="rp-b cur" aria-disabled="true"><b>${r}</b><small>jelenlegi</small></span>`;
      if (o) return `<span class="rp-b busy" aria-disabled="true" title="${esc(o.id)}"><b>${r}</b><small>${esc(o.id.slice(0, 4))}</small></span>`;
      if (glBlocks(r)) return `<span class="rp-b busy" aria-disabled="true" title="${esc(`Glabs: ${glPlates(glAt(r))}`)}"><b>${r}</b><small>kamion</small></span>`;
      if (!rampOk(r)) return `<span class="rp-b off" aria-disabled="true" title="${esc(`Ide nem tud kamion állni (${RAMP_OFF[r] || 'nincs ilyen rámpa'})`)}"><b>${r}</b><small>${RAMP_OFF[r] === 'Joloda' ? 'Joloda' : 'nem lehet'}</small></span>`;
      return `<button type="button" class="rp-b" data-r="${r}" aria-pressed="${r === PICK.r}"><b>${r}</b><small>${r === free[0] ? 'javasolt' : 'szabad'}</small></button>`;
    }).join('');
    $('#rpick-clear').hidden = !(c.ramp && k === 'approved');
    paintPickGo();
    const dlg = $('#rpick');
    if (!dlg.open) dlg.showModal();
    const sel = $('#rpick-grid [aria-pressed="true"]');
    if (sel) sel.focus();
  }
  function paintPickGo() {
    const b = $('#rpick-save');
    b.disabled = !PICK || !PICK.r;
    b.textContent = PICK && PICK.r ? `${PICK.r}. rámpa kiosztása` : 'Nincs szabad rámpa';
  }
  function closePicker() {
    const dlg = $('#rpick');
    if (!dlg.open) return;
    if (!canFly()) { dlg.close(); PICK = null; return; }
    dlg.classList.add('closing');
    setTimeout(() => { dlg.classList.remove('closing'); dlg.close(); PICK = null; }, 160);
  }
  $('#rpick').addEventListener('click', e => {
    if (e.target === $('#rpick')) { closePicker(); return; }
    const b = e.target.closest('button.rp-b');
    if (!b || !PICK) return;
    PICK.r = Number(b.dataset.r);
    $('#rpick-grid').querySelectorAll('button.rp-b').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    paintPickGo();
  });
  $('#rpick').addEventListener('dblclick', e => { if (e.target.closest('button.rp-b')) $('#rpick-save').click(); });
  $('#rpick').addEventListener('cancel', e => { e.preventDefault(); closePicker(); });

  // Rámpa mentése visszavonhatóan. A foglaltságot mentés előtt újra megnézzük (közben más is kioszthatta).
  async function setRamp(id, r) {
    const c = S.data.containers[id];
    if (!c) return false;
    if (r && !rampOk(r)) { toast(`A ${r}. helyre nem tud kamion állni`); return false; }
    if (r) {
      const o = rampMap(id)[r];
      if (o) { toast(`A ${r}. rámpa foglalt: ${o.id}`); return false; }
      if (glBlocks(r)) { toast(`A ${r}. rámpán kamion áll: ${glPlates(glAt(r))}`); return false; }
    }
    const man = MAN[id] || {};
    const prev = { ramp: man.ramp || null, ramp_set: man.ramp_set ? new Date(man.ramp_set).toISOString() : null };
    const from = c.ramp;
    const ok = await upsertManual({ container: id, ramp: r || null, ramp_set: r ? new Date().toISOString() : null });
    if (!ok) return false;
    toast(r ? (from ? `${id}: áthelyezve a ${r}. rámpára` : `${id}: ${r}. rámpa`) : `${id}: vissza a parkolóba`, {
      sub: r ? (['opened', 'unpack'].includes(phaseKey(c)) ? 'A nyitás már folyamatban van.' : 'A „nyitjuk” levélig itt vár.') : `A ${from}. rámpa felszabadult.`,
      undo: () => upsertManual({ container: id, ...prev })
    });
    return true;
  }

  // ---------- áthúzás a parkolóból a rámpára (asztali gépen) ----------
  let DRAG = null;
  document.addEventListener('dragstart', e => {
    const el = e.target.closest && e.target.closest('[data-drag]');
    if (!el) return;
    DRAG = el.dataset.drag;
    e.dataTransfer.setData('text/plain', DRAG);
    e.dataTransfer.effectAllowed = 'move';
    const y = el.closest('.yd');
    if (y) y.classList.add('dragging', needsRamp(S.data.containers[DRAG]) ? 'can-ramp' : 'no-ramp');
    document.querySelectorAll('#view .site-sw').forEach(x => x.classList.add('dragging'));
  });
  document.addEventListener('dragend', () => {
    DRAG = null;
    document.querySelectorAll('.yd.dragging, #view .site-sw.dragging').forEach(y => y.classList.remove('dragging', 'can-ramp', 'no-ramp'));
    document.querySelectorAll('.bay.over, .site-opt.over').forEach(b => b.classList.remove('over'));
  });
  // Hová ejthető: MG1-es nyitható konténer szabad rámpára, bármelyik konténer a másik raktár gombjára.
  const dropTarget = e => {
    const c = DRAG && S.data.containers[DRAG];
    if (!c || !e.target.closest) return null;
    const so = e.target.closest('#view .site-opt');
    if (so && so.dataset.v !== siteOf(c)) return so;
    const b = e.target.closest('.yd[data-site="MG1"] .yd-wide .bay.free');
    return b && needsRamp(c) ? b : null;
  };
  document.addEventListener('dragover', e => {
    if (!DRAG) return;
    const t = dropTarget(e);
    document.querySelectorAll('.bay.over, .site-opt.over').forEach(x => { if (x !== t) x.classList.remove('over'); });
    if (!t) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    t.classList.add('over');
  });
  document.addEventListener('drop', e => {
    if (!DRAG) return;
    const t = dropTarget(e);
    if (!t) return;
    e.preventDefault();
    const id = DRAG;
    DRAG = null;
    t.classList.remove('over');
    if (t.classList.contains('site-opt')) setSite(id, t.dataset.v);
    else setRamp(id, Number(t.dataset.r));
  });

  // ---------- értesítés élő változásnál ----------
  // Csak az élő frissítésből jövő váltásokra (nem a betöltésre): nyitható lett, „nyitjuk” jött rámpa nélkül, rámpa felszabadult.
  const PHK = {};
  function notifyChanges() {
    if (!Object.keys(PHK).length) return;
    const out = [];
    all().forEach(c => {
      const was = PHK[c.id], k = phaseKey(c);
      if (!was || was === k || c.state !== 'active') return;
      const lo = addDays(S.today, -2), hi = addDays(S.today, 1);
      if (c.day < lo || c.day > hi) return;
      if (k === 'request' && was === 'plan' && !c.site) out.push([c.id, 'Megérkezett', 'Melyik raktárba megy?', { acts: SITES.map(v => ({ label: v, action: 'site-set', id: c.id, v, cur: v === 'MG1' })) }]);
      else if (k === 'approved' && siteOf(c) === 'MG3') out.push([c.id, 'Nyitható', 'MG3: a kirakodóba került.', {}]);
      else if (k === 'approved' && !c.ramp) out.push([c.id, 'Nyitható', 'A parkolóban áll, választható neki rámpa.', { act: { label: 'Rámpa választása', action: 'pick', id: c.id } }]);
      else if ((k === 'opened' || k === 'unpack') && was !== 'opened' && openNoRamp(c)) out.push([c.id, '„Nyitjuk” levél, de nincs rámpája', 'Válassz neki rámpát.', { warn: true, act: { label: 'Rámpa választása', action: 'pick', id: c.id } }]);
      else if ((k === 'released' || k === 'stored') && c.ramp && ON_YARD.includes(was)) out.push([c.id, PHASE[k][0], `A ${c.ramp}. rámpa felszabadult.`, {}]);
    });
    if (out.length > 3) toast(`${out.length} konténer állapota változott`, { sub: out.slice(0, 3).map(x => `${x[0]}: ${x[1]}`).join(', ') });
    else out.forEach(([id, t, sub, o]) => toast(`${t}: ${id}`, { sub, ...o, ms: o.act || o.acts ? 12000 : 6000 }));
  }
  function rememberK() { all().forEach(c => { PHK[c.id] = phaseKey(c); }); }

  function table(d, list) {
    const rows = list.map((c, i) => {
      const flags = [];
      if (c.eta_stale) flags.push(`<div class="flag warn">${IC.warn}ETA korábbi napra</div>`);
      const lt = lateInfo(c);
      if (lt) flags.push(`<div class="flag late">${IC.warn}${esc(lt.label)}</div>`);
      if (carryTag(c, d)) flags.push(`<div class="flag carry">${esc(carryTag(c, d))}</div>`);
      const drv = [c.driver, c.phone].filter(Boolean).join(' · ');
      return `
        <div class="tr row${isPrio(c) ? ' prio' : ''}${pxOff(c) ? ' px-off' : ''}" data-id="${esc(c.id)}" style="--i:${Math.min(i, 12)}">
          <div><button type="button" class="cid" data-action="open" data-id="${esc(c.id)}">${esc(c.id)}</button>${prioIc(c)}<div class="sub2">${c.pdd.length} PDD</div></div>
          <div class="cell-mono pddcol">${c.pdd.filter(p => p.no).map(p => `<div>${esc(p.no)}</div>`).join('') || '<span class="dim">—</span>'}</div>
          <div><div class="cell-mono ${c.plate ? '' : 'dim'}">${c.plate ? esc(plate(c.plate)) : 'várható'}</div>${drv ? `<div class="sub2">${esc(drv)}</div>` : ''}</div>
          <span class="cell-mono ${c.t1 ? '' : 'dim'}" style="font-size:12.5px">${esc(c.t1 || '—')}</span>
          <span class="cell-mono r">${fmtInt(c.ctns)}</span>
          <span class="cell-mono r">${fmtInt(c.kg)}</span>
          <input type="time" class="eta ${c.eta_time ? 'set' : ''}" value="${esc(c.eta_time)}" data-eta="${esc(c.id)}" aria-label="ETA ${esc(c.id)}" ${c.status === 'arrived' ? 'disabled' : ''}>
          <span class="cell-mono ${c.arrived && c.arrived_at ? '' : 'dim'}">${c.arrived && c.arrived_at ? esc(c.arrived_at.slice(0, 10) === d ? hm(c.arrived_at) : stamp(c.arrived_at)) : '—'}</span>
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
          <div class="tr head"><span>Konténer</span><span>Fuvarlevél</span><span>Rendszám · sofőr</span><span>T1 / MRN</span><span class="r">Colli</span><span class="r">Súly (kg)</span><span>ETA</span><span>Érkezett</span><span>Állapot</span></div>
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
      const lateN = list.filter(c => lateInfo(c)).length;
      const prN = list.filter(isPrio).length;
      return `
        <button type="button" class="cell ${nodata ? 'nodata' : ''}" style="background-color:${bg};--w:${Math.floor(idx / 7) + (idx % 7)}" data-action="cell" data-date="${d}" aria-pressed="${d === S.calSel}" aria-label="${longLabel(d)}, ${list.length} konténer${lateN ? `, ${lateN} késik` : ''}${prN ? `, ${prN} prioritás` : ''}">
          <div class="cell-top"><span class="cell-num ${numCls}">${parse(d).getDate()}</span>${list.length ? `<span class="cell-count">${list.length} db</span>` : ''}</div>
          ${lateN || prN ? `<div class="cell-tags">${lateN ? `<span class="cell-late">${lateN} késik</span>` : ''}${prN ? `<span class="cell-prio">${IC.prio}${prN}</span>` : ''}</div>` : ''}
          <div class="pips">${list.map((c, k) => { const ph = phase(c); return `<i class="pip pip-${ph.grp}${lateInfo(c) ? ' pip-late' : ''}" style="--p:${Math.round(ph.p * 100)}%;--k:${Math.min(k, 9)}"></i>`; }).join('')}</div>
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
      const late = lateInfo(c);
      const etaCls = late ? 'late' : c.arrived ? 'arrived' : (c.eta_time ? 'eta' : '');
      return `
        <button type="button" class="side-item" data-action="open" data-id="${esc(c.id)}" style="--i:${Math.min(i, 10)}">
          <span class="side-l"><i class="pip pip-${ph.grp}${late ? ' pip-late' : ''} side-pip" style="--p:${Math.round(ph.p * 100)}%" aria-hidden="true"></i><span class="side-txt"><span class="mono">${esc(c.id)}${prioIc(c)}</span><span class="sub2">${esc(c.plate ? plate(c.plate) : 'rendszám nélkül')} · ${fmtInt(c.kg)} kg</span></span></span>
          <span class="side-eta ${etaCls}">${esc(late ? late.label : c.arrived ? stageText(c) : (c.eta_time || '—'))}</span>
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
            <span style="--i:2"><b>${num(sumCt(list), 'int', 200)}</b> colli</span>
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
      appInteractive();
      if (!root.classList.contains('leaving')) root.innerHTML = '';
      return;
    }
    clearTimeout(drawerTimer);
    root.classList.remove('leaving');
    // Modális lap: a háttér nem kap fókuszt, a Tab a lapon belül marad.
    $('#app').inert = true;
    const prevSheet = root.querySelector('.sheet');
    const keepScroll = !mode && prevSheet && prevSheet.dataset.id === c.id ? prevSheet.scrollTop : 0;
    const dayList = c.state === 'active' ? panelOn(panelDay(c)) : removedOn(c.removed_from);
    const idx = dayList.findIndex(x => x.id === c.id);
    const refDay = c.state === 'active' ? panelDay(c) : c.removed_from;
    const ph = phase(c);
    const late = lateInfo(c);
    const where = [c.fwd, c.port, c.customs].filter(Boolean).join(' · ');
    const active = c.state === 'active';
    const badge = !active ? `<span class="ph ph-out ph-lg">${esc(ST_LABEL.removed)}</span>` : `<span class="ph ph-${late ? 'late' : `${ph.grp} phk-${ph.key}`} ph-lg">${esc(late ? late.label : ph.label)}</span>`;
    const anim = { enter: ' enter', fly: ' fly', step: ' step', back: ' step back' }[mode] || '';

    const had = root.contains(document.activeElement);
    const fk = mode === 'enter' || mode === 'fly' ? null : focusKey('#drawer');
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
          <div class="sheet-ct">${containerSvg(c, { cls: 'ct-lg', prio: isPrio(c) })}</div>
          <div class="badges">${badge}${isPrio(c) ? `<span class="ph ph-prio ph-lg">${IC.prio}Prioritás</span>` : ''}${c.late_mod ? `<span class="badge b-late" title="${esc(c.late_mod.to ? `Új forecast: ${short(c.late_mod.to)}` : 'Kikerült az új forecastból')}">Utólag módosítva</span>` : ''}${c.date_guess ? `<span class="badge b-late" title="A levélben nem volt felismerhető nap, ezért a levél utáni napra került. Az első levél valódi nappal javítja.">Becsült nap</span>` : ''}${where ? `<span class="badge b-out">${esc(where)}</span>` : ''}</div>
          ${canSite(c) ? `<div class="sh-site" role="group" aria-label="Raktár"><small>Raktár</small>${SITES.map(v => `<button type="button" class="sh-sbtn" data-action="site-set" data-id="${esc(c.id)}" data-v="${v}" aria-pressed="${siteOf(c) === v}">${v}</button>`).join('')}${siteOf(c) === 'MG3' ? `<span class="sh-snote">${MG3_DOCK.includes(phaseKey(c)) ? 'a kirakodóban' : 'a parkolóban'}</span>` : ''}</div>` : ''}
          ${canPick(c) ? `<div class="sh-ramp">${c.ramp
            ? `<span class="sh-r"><small>Rámpa</small><b>${c.ramp}</b></span><button type="button" class="sh-rbtn ghost" data-action="pick" data-id="${esc(c.id)}">Rámpa váltása</button>`
            : `<span class="sh-r none${openNoRamp(c) ? ' warn' : ''}"><small>Rámpa</small><b>${openNoRamp(c) ? 'nincs, de már nyitják' : 'nincs'}</b></span><button type="button" class="sh-rbtn" data-action="pick" data-id="${esc(c.id)}">Rámpa választása</button>`}</div>` : ''}
        </div>
        <div class="sheet-body">
          ${factsBox(c)}

          ${active && (c.arrived || c.stage || c.storage) ? stepper(c) : ''}

          ${photoBox(c)}

          ${mailBox(c)}
        </div>
      </aside>`;
    const sh = root.querySelector('.sheet');
    if (keepScroll) sh.scrollTop = keepScroll;
    refocus(fk, '#drawer');
    if (mode === 'enter' || mode === 'fly' || (had && !sh.contains(document.activeElement))) sh.focus({ preventScroll: true });
    loadThumbs();
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
    const lifted = !!card && (card.matches(':hover') || card.classList.contains('hold'));
    if (card) {
      if (holdEl === card) holdRelease();
      document.querySelectorAll('#view .ccard.away').forEach(x => x.classList.remove('away'));
      const a0 = simGrab(card);
      card.classList.add('away');
      craneFly(svg, end, 900, { grab: lifted ? 0 : 260, a0 }).then(() => sheet.classList.add('landed'));
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

  // A háttér újra kezelhető; a túra alatt viszont az tartja inertben.
  function appInteractive() {
    $('#app').inert = !!(window.KFTour && window.KFTour.active);
  }

  function closeDrawer() {
    if (!S.drawer) return;
    const id = S.drawer;
    const root = $('#drawer');
    appInteractive();
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
      // A célt minden képkockán újra megkeressük: görgetés vagy élő frissítés (új kártya-elem) közben is odatalál.
      const sel = `#view .ccard[data-id="${CSS.escape(id)}"]`;
      const cur = () => document.querySelector(sel);
      let down = false; // lerakás után már nem rejtjük el: a kártya saját konténere látszik
      card.closest('.ccard').classList.add('away');
      craneFly(from, r, 700, {
        grab: 200,
        hold: () => pointerOn(cur()),
        follow: () => { const x = cur(); if (x && !down) x.classList.add('away'); return x && x.querySelector('.ct'); },
      }).then(() => {
        down = true;
        const x = cur();
        if (!x) return;
        // Az egér a kártyán áll: a kártya a kampóval együtt veszi át a konténert (nincs újabb leereszkedés), az emelés fut le.
        if (pointerOn(x)) { if (holdEl !== x) holdRelease(); x.classList.add('hold'); holdEl = x; }
        x.classList.remove('away');
      });
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

  // ---------- fuvarlevelek beillesztése ----------
  // A beszállító táblázata (pl. NEP pre-alert: Reference number, Container number, Ctns, Weight) kimásolva,
  // akár soronként tabulátorral, akár cellánként új sorban. A sorrend a táblázatból derül ki: ha az első konténerszám
  // az első fuvarlevél előtt áll, a fuvarlevél az előtte lévő konténeré, különben az utána következőé (a fuvarlevél
  // „sorában”). Az összevont konténer-cella csak az első sorban áll: a konténer a következőig érvényes.
  // A fuvarlevél után álló első egész szám a darab, az első tizedes szám a súly.
  function parseWaybills(text) {
    const toks = String(text || '').replace(/([A-Za-z]{4})[ \u00a0](\d{7})(?!\d)/g, '$1$2')
      .split(/[\s\u00a0|;]+/).map(t => t.replace(/^[^\w]+|[^\w.,]+$|[.,]+$/g, '')).filter(Boolean);
    const isWb = t => /^[A-Za-z0-9]{1,6}TM\d{9,15}$/.test(t);
    const isCt = t => /^[A-Z]{4}\d{7}$/.test(t.toUpperCase()) && !isWb(t);
    const fw = toks.findIndex(isWb), fc = toks.findIndex(isCt);
    if (fw < 0 || fc < 0) return [];
    const ctFirst = fc < fw;
    const by = {};
    let cur = '';
    for (let i = 0; i < toks.length; i++) {
      if (isCt(toks[i])) { if (ctFirst) cur = toks[i].toUpperCase(); continue; }
      if (!isWb(toks[i])) continue;
      let j = i + 1;
      while (j < toks.length && !isWb(toks[j])) j++;
      const seg = toks.slice(i + 1, j);
      if (!ctFirst) { const c = seg.find(isCt); if (c) cur = c.toUpperCase(); }
      if (!cur) continue;
      // Csak a következő konténerszámig (konténer-előre sorrendnél az már a következő sor).
      const k = ctFirst ? seg.findIndex(isCt) : -1;
      const nums = (k >= 0 ? seg.slice(0, k) : seg).filter(t => !isCt(t) && /^\d+(?:[.,]\d+)?$/.test(t));
      const dec = nums.find(n => /[.,]/.test(n));
      const ints = nums.filter(n => !/[.,]/.test(n));
      const list = by[cur] = by[cur] || [];
      if (!list.some(p => p.no.toUpperCase() === toks[i].toUpperCase())) {
        list.push({ no: toks[i], ctns: ints.length ? +ints[0] : 0, kg: dec ? +dec.replace(',', '.') : ints.length > 1 ? +ints[1] : 0 });
      }
    }
    return Object.entries(by).map(([container, pdd]) => ({ container, pdd }));
  }
  function openWaybills() {
    $('#wb-text').value = '';
    renderWaybills();
    $('#wb').showModal();
    setTimeout(() => $('#wb-text').focus(), 30);
  }
  function renderWaybills() {
    const items = parseWaybills($('#wb-text').value);
    $('#wb-save').disabled = !items.length;
    $('#wb-list').innerHTML = items.map(it => {
      const c = S.data.containers[it.container];
      const on = c && c.state === 'active';
      const n = it.pdd.reduce((t, p) => t + p.ctns, 0);
      const kg = it.pdd.reduce((t, p) => t + p.kg, 0);
      // Ellenőrzés: a levélben kapott darabszámmal egyezik-e.
      const diff = on && c.ctns && n && Math.abs(c.ctns - n) > 0 ? ` · levélben ${fmtInt(c.ctns)}` : '';
      return `<div class="pl-row"><span>${esc(it.container)}<small class="wb-nos">${it.pdd.map(p => esc(p.no)).join('<br>')}</small></span>`
        + `<span class="pl-day ${on ? '' : 'unk'}">${on ? esc(`${DOW[dowIdx(c.day)]}, ${short(c.day)}`) : 'nincs a tervben'}${esc(diff)}</span>`
        + `<b>${it.pdd.length} db · ${fmtInt(n)} colli · ${esc(fmtT(kg))}</b></div>`;
    }).join('');
  }
  async function saveWaybills() {
    const items = parseWaybills($('#wb-text').value);
    if (!items.length) return;
    const rows = items.map(it => ({ container: it.container, pdd: it.pdd }));
    const { data, error } = await sb.from('manual').upsert(rows, { onConflict: 'container' }).select();
    if (error) {
      console.error(error);
      toast(/pdd/.test(error.message || '') ? 'Hiányzik a pdd oszlop: futtasd a 20261112150000_manual_pdd.sql fájlt' : 'A mentés nem sikerült');
      return;
    }
    data.forEach(r => { MAN[r.container] = normMan(r); });
    rebuild();
    $('#wb').close();
    render();
    const n = items.reduce((t, it) => t + it.pdd.length, 0);
    toast(`${n} fuvarlevél, ${items.length} konténer`);
  }

  // ---------- prioritás ----------
  const canPrio = () => ME && ME.role === 'admin';
  const prioSum = () => {
    const n = PRIO.filter(id => { const c = S.data.containers[id]; return !c || phase(c).key !== 'stored'; }).length;
    return n ? `<b>${n}</b> konténer` : 'Nincs kijelölve';
  };
  const parsePrio = text => [...new Set(((text || '').toUpperCase().replace(/[^\S\n]+/g, '').match(/[A-Z]{4}\d{7}/g) || []))];
  function openPrio() {
    if (!canPrio()) return;
    $('#prio-text').value = PRIO.join('\n');
    renderPrio();
    $('#prio').showModal();
    setTimeout(() => $('#prio-text').focus(), 30);
  }
  function renderPrio() {
    const ids = parsePrio($('#prio-text').value);
    const same = ids.length === PRIO.length && ids.every(id => PRIO.includes(id));
    $('#prio-save').disabled = same;
    $('#prio-list').innerHTML = ids.map(id => {
      const c = S.data.containers[id];
      const on = c && c.state === 'active';
      const ph = on ? phase(c) : null;
      return `<div class="pl-row"><span>${esc(id)}</span><span class="pl-day ${on ? '' : 'unk'}">${on ? esc(`${DOW[dowIdx(c.day)]}, ${short(c.day)}`) : 'még nincs a tervben'}</span>${ph ? `<span class="ph ph-${ph.grp} phk-${ph.key}">${esc(ph.label)}</span>` : '<span></span>'}</div>`;
    }).join('');
  }
  async function savePrio() {
    const ids = parsePrio($('#prio-text').value);
    const { error } = await sb.from('app_settings').update({ priority: ids }).eq('id', 1);
    if (error) { toast('A mentés nem sikerült'); console.error(error); return; }
    PRIO = ids;
    $('#prio').close();
    $('#prio-sum').innerHTML = prioSum();
    render();
    toast(ids.length ? 'Prioritás mentve' : 'Prioritás törölve');
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
  // Értesítések: az egyszerű visszajelzés (Mentve, Rámpa 4) kiszorítja az előzőt; a teendős (Nyitható: … gombbal)
  // megmarad, amíg le nem jár. Gépen legfeljebb három látszik egymás fölött, telefonon csak a legújabb, tömören.
  // Alul fogyó csík jelzi az időt; az egér fölötte megállítja.
  function toastBox() {
    let b = $('#toasts');
    if (!b) { b = document.createElement('div'); b.id = 'toasts'; b.className = 'toasts'; b.setAttribute('aria-live', 'polite'); document.body.appendChild(b); }
    return b;
  }
  function dropToast(t) {
    if (!t || t.classList.contains('out')) return;
    clearTimeout(t._tm);
    t.classList.add('out');
    setTimeout(() => t.remove(), 230);
  }
  function toast(msg, o = {}) {
    const box = toastBox();
    const acts = o.acts || (o.act ? [o.act] : []);
    const rich = !!(acts.length || o.undo);
    if (!rich) box.querySelectorAll('.toast.plain').forEach(dropToast);
    const t = document.createElement('div');
    const ms = o.ms || (o.undo ? 7000 : rich ? 12000 : 2400);
    t.className = `toast${rich ? ' rich' : ' plain'}${o.sub ? ' has-sub' : ''}${o.warn ? ' warn' : ''}`;
    t.setAttribute('role', o.warn ? 'alert' : 'status');
    t.style.setProperty('--ms', `${ms}ms`);
    t.innerHTML = `<div class="t-txt"><b>${esc(msg)}</b>${o.sub ? `<span>${esc(o.sub)}</span>` : ''}</div>`
      + acts.map(a => `<button type="button" class="t-act${a.cur ? ' cur' : ''}${acts.length > 1 ? ' t-site' : ''}" data-action="${esc(a.action)}" data-id="${esc(a.id || '')}"${a.v ? ` data-v="${esc(a.v)}"` : ''}>${esc(a.label)}</button>`).join('')
      + (o.undo ? '<button type="button" class="t-act t-undo">Visszavonás</button>' : '')
      + (rich ? `<button type="button" class="t-x" aria-label="Bezárás"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>` : '');
    box.appendChild(t);
    const live = [...box.querySelectorAll('.toast:not(.out)')];
    live.slice(0, Math.max(0, live.length - 3)).forEach(dropToast);
    const arm = () => { clearTimeout(t._tm); t._tm = setTimeout(() => dropToast(t), ms); };
    t.addEventListener('mouseenter', () => { clearTimeout(t._tm); t.classList.add('hold'); });
    t.addEventListener('mouseleave', () => { t.classList.remove('hold'); arm(); });
    const x = t.querySelector('.t-x');
    if (x) x.addEventListener('click', () => dropToast(t));
    const u = t.querySelector('.t-undo');
    if (u) u.addEventListener('click', async () => { dropToast(t); if (await o.undo()) toast('Visszavonva'); });
    arm();
    return t;
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
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const el = tpl.content.firstElementChild;
    // A belépő osztályok csak az új panelre kerülnek: a nézet osztályainak átírása a még futó belépőket
    // (pl. a most érkezett hét blokkjait) egy pillanat alatt a végállapotukba ugratná.
    el.classList.add(`ev-${zone}`, 'ev-solo');
    const fk = focusKey();
    old.replaceWith(el);
    refocus(fk);
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
    if (!c) return false;
    const row = t
      ? { container: id, eta_date: d || c.date, eta_time: t, eta_for: c.date, eta_set: new Date().toISOString() }
      : { container: id, eta_date: null, eta_time: null, eta_for: null, eta_set: null };
    return upsertManual(row);
  }

  // ---------- adatlap: adatok helyben szerkesztve ----------
  // Minden adat egy dobozban; a ceruza (vagy az értékre kattintás) helyben szerkeszthetővé teszi.
  // Enter vagy kikattintás ment, Esc elvet. Az üresre törölt rendszám, MRN, telefon visszaáll a levélbelire.
  const FIX = {
    plate: v => v.toUpperCase().replace(/\s+/g, ' ').trim(),
    t1: v => v.toUpperCase().replace(/\s+/g, ''),
    phone: v => v.replace(/\s+/g, ' ').trim()
  };
  const MRN_OK = /^\d{2}[A-Z]{2}[A-Z0-9]{14}$/;
  const fromMail = (c, k) => (c.fixed && k in c.fixed ? c.fixed[k] : c[k]) || '';
  let FX = null; // { id, k }: épp szerkesztett mező

  // Minden szerepkör szerkesztheti az adatokat; a rámpa és az ETA csak aktív konténernél.
  const canFx = (c, k) => {
    if (k === 'ramp' || k === 'eta') { if (c.state !== 'active') return false; }
    return true;
  };
  const etaText = c => (c.eta_time ? `${short(c.eta_date || c.date)} ${c.eta_time}` : short(c.day || c.date));
  const PEN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>';
  const FX_LABEL = { plate: 'Rendszám', t1: 'T1 / MRN', phone: 'Telefon', eta: 'ETA', ramp: 'Rámpa', note: 'Megjegyzés' };

  function fxEditor(c, k) {
    const cls = 'field fx-in';
    if (k === 'eta') {
      return `<span class="fx-eta"><input type="date" class="${cls}" data-fx="eta-d" value="${esc(c.eta_date || c.day || c.date)}" aria-label="ETA dátum"><input type="time" class="${cls}" data-fx="eta-t" value="${esc(c.eta_time)}" aria-label="ETA időpont"></span><small class="fx-hint">Időpont nélkül a pontos ETA törlődik</small>`;
    }
    if (k === 'ramp') {
      const used = rampUse(c.id);
      const busy = Object.keys(used).sort((a, b) => a - b).map(n => `${n} (${used[n]})`).join(', ');
      return `<input type="number" class="${cls} fx-num" data-fx="ramp" min="1" max="${RAMP_SLOTS}" step="1" inputmode="numeric" value="${c.ramp || ''}" aria-label="Rámpa" placeholder="—"><small class="fx-hint">Használható: ${esc(RAMP_TXT)}</small>${busy ? `<small class="fx-hint">Foglalt: ${esc(busy)}</small>` : ''}`;
    }
    if (k === 'note') return `<textarea class="${cls} fx-note" data-fx="note" rows="3" aria-label="Megjegyzés" placeholder="Shift+Enter: új sor">${esc(c.note)}</textarea>`;
    const mail = fromMail(c, k);
    return `<input class="${cls}" data-fx="${k}" value="${esc(c[k] || '')}" autocomplete="off" spellcheck="false" aria-label="${FX_LABEL[k]}"${k === 'phone' ? ' inputmode="tel"' : ''}>${mail && mail !== c[k] ? `<small class="fx-hint">Levélben: ${esc(mail)} · üresen ez marad</small>` : mail ? '' : ''}`;
  }

  function fact(c, k, label, val, opts = {}) {
    const ed = FX && FX.id === c.id && FX.k === k;
    const can = opts.k !== false && canFx(c, k);
    const body = ed ? fxEditor(c, k) : val;
    return `<div class="fact${opts.wide ? ' wide' : ''}${ed ? ' editing' : ''}" data-k="${k}">
        <dt>${label}${can && !ed ? `<button type="button" class="fx-pen" data-action="fx-edit" data-k="${k}" aria-label="${esc(label)} szerkesztése" title="Szerkesztés">${PEN}</button>` : ''}</dt>
        <dd${opts.plain ? ' class="plain"' : ''}>${body}</dd>
      </div>`;
  }

  function factsBox(c) {
    const dim = t => `<span class="dim">${t}</span>`;
    const stored = c.storedPdd || {};
    const pdds = c.pdd.filter(p => p.no);
    const pddRows = pdds.map(p => {
      const at = stored[p.no.toUpperCase()];
      return `<div class="pdd-r"><span class="pdd-no"><span class="pdd-t">${esc(p.no)}</span>${cp(p.no)}</span><span class="r">${p.ctns == null ? '—' : fmtInt(p.ctns)}<small> colli</small></span><span class="r">${p.kg == null ? '—' : fmtKg(p.kg)}<small> kg</small></span><span class="r ${at ? 'ok' : 'dim'}">${at ? `${IC.check}${esc(stamp(at))}` : 'nincs betárolva'}</span></div>`;
    }).join('');
    const late = lateInfo(c);
    const eta = `${esc(etaText(c))}${c.eta_time ? cp(etaText(c)) : ''}${late ? `<small class="fx-late">${esc(late.label)}</small>` : ''}${c.eta_stale ? `<small class="fx-late">a korábbi napra szólt</small>` : ''}`;
    return `
      <dl class="facts facts2">
        ${fact(c, 'id', 'Konténer', `${esc(c.id)}${cp(c.id)}`, { k: false })}
        ${fact(c, 'plate', 'Rendszám', c.plate ? esc(plate(c.plate)) + cp(plate(c.plate)) : dim('várható'))}
        ${fact(c, 't1', 'T1 / MRN', c.t1 ? esc(c.t1) + cp(c.t1) : dim('várható'))}
        ${fact(c, 'phone', 'Sofőr telefon', c.phone ? esc(c.phone) + cp(c.phone) : dim('nincs megadva'))}
        ${fact(c, 'eta', c.eta_time ? 'ETA' : 'ETA (nap)', eta)}
        ${fact(c, 'ramp', 'Rámpa', c.ramp ? c.ramp + cp(String(c.ramp)) : dim('—'))}
        ${fact(c, 'kg', 'Bruttó súly', `${fmtKg(c.kg)} kg${cp(String(c.kg).replace('.', ','))}`, { k: false })}
        ${fact(c, 'ctns', 'Colli', `${fmtInt(c.ctns)}${cp(String(c.ctns))}`, { k: false })}
        ${pdds.length ? `<div class="fact wide pdd-f"><dt>Fuvarlevelek · ${pdds.length}${c.storage ? `<span class="pdd-sum">${c.storage.done}/${pdds.length} betárolva</span>` : ''}</dt><dd class="plain">${pddRows}</dd></div>` : ''}
        ${fact(c, 'note', 'Megjegyzés', c.note ? `<span class="fx-notev">${esc(c.note)}</span>` : dim('nincs'), { wide: true, plain: true })}
      </dl>
      ${c.updated_by ? `<div class="editor">Utoljára módosította: ${esc(who(c.updated_by))} · ${esc(stamp(c.updated_at))}</div>` : ''}`;
  }

  // Csak a doboz épül újra: a lap többi része (fotók, levél) és a görgetés marad.
  function paintFacts(focusK) {
    const c = S.drawer && S.data.containers[S.drawer];
    const box = $('#drawer .facts2');
    if (!c || !box) return;
    const ed = box.nextElementSibling && box.nextElementSibling.classList.contains('editor') ? box.nextElementSibling : null;
    const tpl = document.createElement('template');
    tpl.innerHTML = factsBox(c);
    if (ed) ed.remove();
    box.replaceWith(tpl.content);
    if (focusK) {
      const inp = $(`#drawer .fact[data-k="${focusK}"] .fx-in`);
      if (inp) { inp.focus(); if (inp.select && inp.type !== 'date' && inp.type !== 'time' && inp.type !== 'number') inp.select(); }
    } else {
      const pen = $(`#drawer .fact[data-k="${FX_LAST}"] .fx-pen`);
      if (pen) pen.focus({ preventScroll: true });
    }
  }

  let FX_LAST = null, fxBusy = false;
  function fxStart(k) {
    const c = S.data.containers[S.drawer];
    if (!c || !canFx(c, k)) return;
    if (FX && FX.k !== k) fxCommit();
    FX = { id: c.id, k };
    paintFacts(k);
  }
  function fxCancel() {
    if (!FX) return;
    FX_LAST = FX.k;
    FX = null;
    paintFacts();
    if (S.pending) { rebuild(); render(); }
  }

  async function fxCommit() {
    if (!FX || fxBusy) return;
    const { id, k } = FX;
    const c = S.data.containers[id];
    const box = $(`#drawer .fact[data-k="${k}"]`);
    if (!c || !box) { FX = null; return; }
    const val = sel => { const el = box.querySelector(`[data-fx="${sel}"]`); return el ? el.value : ''; };
    let row = null, msg = '';
    if (k === 'eta') {
      const d = val('eta-d'), t = val('eta-t');
      const cur = [c.eta_date || c.day || c.date, c.eta_time];
      if (t !== cur[1] || (t && d !== cur[0])) {
        row = t ? { container: id, eta_date: d || c.date, eta_time: t, eta_for: c.date, eta_set: new Date().toISOString() }
          : { container: id, eta_date: null, eta_time: null, eta_for: null, eta_set: null };
        msg = t ? 'ETA mentve' : 'ETA törölve';
      }
    } else if (k === 'ramp') {
      const raw = val('ramp');
      const n = raw === '' ? null : Math.round(Number(raw));
      if (n !== null && !rampOk(n)) {
        const inp = box.querySelector('.fx-in');
        inp.setAttribute('aria-invalid', 'true');
        inp.focus();
        toast(RAMP_OFF[n] ? `A ${n}. helyre nem tud kamion állni (${RAMP_OFF[n]})` : `Nincs ${n}. rámpa. Használható: ${RAMP_TXT}`);
        return;
      }
      if ((c.ramp || null) !== n) { row = { container: id, ramp: n, ramp_set: n ? new Date().toISOString() : null }; msg = n ? `Rámpa ${n}` : 'Rámpa törölve'; }
    } else if (k === 'note') {
      const v = val('note').trim();
      if (v !== (c.note || '')) { row = { container: id, note: v || null }; msg = 'Megjegyzés mentve'; }
    } else {
      const v = FIX[k](val(k));
      if (k === 't1' && v && !MRN_OK.test(v)) {
        const inp = box.querySelector('.fx-in');
        inp.setAttribute('aria-invalid', 'true');
        inp.focus();
        toast('Hibás MRN: 2 szám, 2 betű, majd 14 betű vagy szám');
        return;
      }
      if (v !== (c[k] || '')) { row = { container: id, [k]: v && v !== fromMail(c, k) ? v : null }; msg = `${FX_LABEL[k]} mentve`; }
    }
    FX_LAST = k;
    FX = null;
    if (!row) { paintFacts(); if (S.pending) { rebuild(); render(); } return; }
    fxBusy = true;
    box.classList.add('saving');
    const ok = await upsertManual(row);
    fxBusy = false;
    if (ok) toast(msg);
    else paintFacts();
  }

  // Kikattintás: ha a fókusz a mezőn kívülre kerül, ment (a dátum/idő pár között lépkedve nem).
  document.addEventListener('focusout', e => {
    if (!FX || !e.target.closest || !e.target.closest('.fact.editing')) return;
    const box = e.target.closest('.fact.editing');
    setTimeout(() => {
      if (!FX || !box.isConnected || box.contains(document.activeElement)) return;
      fxCommit();
    }, 0);
  });
  document.addEventListener('keydown', e => {
    if (!FX || !e.target.closest || !e.target.closest('.fact.editing')) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fxCancel(); return; }
    if (e.key === 'Enter' && !(e.target.tagName === 'TEXTAREA' && e.shiftKey)) { e.preventDefault(); fxCommit(); }
  }, true);

  async function openFile(path) {
    const { data, error } = await sb.storage.from('t1').createSignedUrl(path, 600);
    if (error || !data) { toast('A fájl nem nyitható meg'); return; }
    if (isExe()) exe().open_url(data.signedUrl);
    else window.open(data.signedUrl, '_blank', 'noopener');
  }

  // ---------- konténerfotók ----------
  // A telefonnal készült képek kicsinyítve a konténerhez kerülnek; 12 óra után a szerver (photo-cleanup) törli őket.
  const PHOTO_TTL = 12 * 3600e3;
  let PHOTOS = [];
  const PH_BLOB = {}, PH_URL = {}, PH_BUSY = {};
  const phLoading = new Set();
  const COARSE = matchMedia('(pointer: coarse)');
  const livePhotos = id => PHOTOS
    .filter(p => p.container === id && Date.now() - new Date(p.created_at).getTime() < PHOTO_TTL)
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
  const canDelPhoto = p => !!ME && (p.created_by === ME.uid || !isWorker());
  const phUrl = path => PH_URL[path] || (PH_BLOB[path] ? (PH_URL[path] = URL.createObjectURL(PH_BLOB[path])) : '');

  function photoBox(c) {
    const ph = livePhotos(c.id);
    const busy = PH_BUSY[c.id] || 0;
    const thumbs = ph.map((p, i) => {
      const u = phUrl(p.path);
      return `<figure class="ph-t">
          <button type="button" class="ph-img" data-action="photo-view" data-ph="${esc(p.path)}" aria-label="${i + 1}. fotó"><img data-ph="${esc(p.path)}" alt=""${u ? ` src="${u}"` : ''}></button>
          ${p.link_id ? '<span class="ph-qr" title="Telefonról, QR-kóddal feltöltve">QR</span>' : ''}
          ${canDelPhoto(p) ? `<button type="button" class="ph-x" data-action="photo-del" data-ph="${esc(p.path)}" aria-label="${i + 1}. fotó törlése">×</button>` : ''}
        </figure>`;
    }).join('') + '<figure class="ph-t busy" aria-hidden="true"></figure>'.repeat(busy);
    const add = COARSE.matches
      ? `<button type="button" class="btn-primary sm" data-action="photo-phone">${IC.cam}Fotózás</button>`
      : `<button type="button" class="btn-ghost sm" data-action="photo-qr">${IC.qr}QR a telefonhoz</button><button type="button" class="btn-ghost sm" data-action="photo-take" data-src="lib">${IC.img}Képek hozzáadása</button>`;
    return `
      <section class="photobox" aria-label="Fotók">
        <div class="mail-head">
          <b>Fotók${ph.length ? ` <span class="ph-n">${ph.length}</span>` : ''}</b>
          <div class="ph-add">${add}</div>
        </div>
        <input type="file" id="ph-lib" accept="image/*" multiple hidden data-id="${esc(c.id)}">
        ${thumbs ? `<div class="ph-grid" aria-busy="${busy ? 'true' : 'false'}">${thumbs}</div>` : ''}
      </section>`;
  }

  // Csak a fotó- és a levéldoboz épül újra, így a megjegyzésbe gépelt, még nem mentett szöveg megmarad.
  function paintPhotos(id) {
    if (CAM.id === id) renderCam();
    if (!S.drawer || S.drawer !== id) return;
    const c = S.data.containers[id];
    const pb = $('#drawer .photobox'), mb = $('#drawer .mailbox');
    if (!c || !pb) return;
    const fk = focusKey('#drawer');
    pb.outerHTML = photoBox(c);
    if (mb) mb.outerHTML = mailBox(c);
    refocus(fk, '#drawer');
    loadThumbs();
  }

  async function phBlob(path) {
    if (PH_BLOB[path]) return PH_BLOB[path];
    const { data, error } = await sb.storage.from('photos').download(path);
    if (error) throw error;
    return (PH_BLOB[path] = data);
  }

  function loadThumbs() {
    document.querySelectorAll('img[data-ph]:not([src])').forEach(img => {
      const p = img.dataset.ph;
      if (phLoading.has(p)) return;
      phLoading.add(p);
      phBlob(p)
        .then(() => document.querySelectorAll(`img[data-ph="${CSS.escape(p)}"]`).forEach(i => { i.src = phUrl(p); }))
        .catch(() => {})
        .finally(() => phLoading.delete(p));
    });
  }

  // Leghosszabb oldal 1920 px, JPEG: egy kép néhány száz KB, gyenge térerőn is felmegy.
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

  // ready: a kamerából érkező képek már kicsinyítve vannak.
  async function addPhotos(id, files, ready) {
    const list = [...files].filter(f => ready || !f.type || f.type.startsWith('image/'));
    if (!list.length) return;
    PH_BUSY[id] = (PH_BUSY[id] || 0) + list.length;
    paintPhotos(id);
    let ok = 0;
    for (const f of list) {
      try {
        const blob = ready ? f : await shrink(f);
        const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        let up;
        for (let t = 0; t < 3; t++) {
          up = await sb.storage.from('photos').upload(path, blob, { contentType: 'image/jpeg' });
          if (!up.error || /exist/i.test(up.error.message)) { up.error = null; break; }
          await sleep(1500 * (t + 1));
        }
        if (up.error) throw up.error;
        const { data, error } = await sb.from('photos').insert({ container: id, path }).select().single();
        if (error) { sb.storage.from('photos').remove([path]); throw error; }
        PH_BLOB[path] = blob;
        PHOTOS = PHOTOS.filter(x => x.id !== data.id).concat(data);
        ok++;
      } catch (err) { console.error(err); }
      PH_BUSY[id]--;
      paintPhotos(id);
    }
    if (ok < list.length) toast(ok ? `${list.length - ok} fotó feltöltése nem sikerült` : 'A feltöltés nem sikerült');
    else toast(ok > 1 ? `${ok} fotó feltöltve` : 'Fotó feltöltve');
  }

  // ---------- beépített kamera ----------
  // Egymás után több kép, jóváhagyás nélkül; a képek alul gyűlnek, törölhetők, és csak a „Feltöltés” küldi fel őket.
  const CAM = { id: null, stream: null, shots: [], ptrShot: false };
  const camLive = () => {
    const v = CAM.stream && $('#cam video');
    return !!(v && v.videoWidth && CAM.stream.getVideoTracks().some(t => t.readyState === 'live'));
  };

  function camOpen(id) {
    CAM.id = id;
    let d = $('#cam');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'cam';
      d.setAttribute('aria-label', 'Fotózás');
      d.addEventListener('cancel', e => { e.preventDefault(); camClose(); });
      // Az exponálás a gomb lenyomásakor történik, nem a felengedéskor (a click csak az ujj felemelése után jön).
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
        <button type="button" class="cam-x" data-action="cam-close" aria-label="Bezárás">×</button>
        <label class="cam-pick"><span class="sr">Konténer</span><select id="cam-ct"></select></label>
      </div>
      <div class="cam-view">
        <video playsinline muted autoplay></video>
        <div class="cam-msg" hidden></div>
        <div class="cam-flash"></div>
      </div>
      <div class="cam-strip"></div>
      <div class="cam-bar">
        <button type="button" class="cam-lib" data-action="cam-lib">${IC.img}<span>Galéria</span></button>
        <button type="button" class="cam-shot" data-action="cam-shot" aria-label="Fotó készítése"><i></i></button>
        <button type="button" class="cam-send" data-action="cam-send" disabled>Feltöltés</button>
      </div>
      <input type="file" id="cam-in-lib" accept="image/*" multiple hidden>
      <input type="file" id="cam-in-native" accept="image/*" capture="environment" hidden>`;
    d.showModal();
    renderCam();
    camStart();
  }

  async function camStart() {
    const d = $('#cam'), msg = d.querySelector('.cam-msg');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.hidden = false; msg.textContent = 'Érintsd meg a gombot a fotózáshoz'; return; }
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1440 } } });
      if (!d.open || CAM.stream) { st.getTracks().forEach(t => t.stop()); return; }
      CAM.stream = st;
      const v = d.querySelector('video');
      v.srcObject = st;
      v.play().catch(() => {});
      msg.hidden = true;
    } catch (err) {
      msg.hidden = false;
      msg.textContent = err && err.name === 'NotAllowedError' ? 'A kamera nincs engedélyezve a böngészőben' : 'A kamera nem érhető el';
    }
  }

  // Másik alkalmazásra váltás után a rendszer leállíthatja a kamerát: visszatéréskor újraindul.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !CAM.id) return;
    if (!CAM.stream || CAM.stream.getVideoTracks().every(t => t.readyState === 'ended')) { camStop(); camStart(); }
  });

  function camStop() {
    if (CAM.stream) CAM.stream.getTracks().forEach(t => t.stop());
    CAM.stream = null;
  }

  function camClose(force) {
    const d = $('#cam');
    const x = d && d.querySelector('.cam-x');
    // Feltöltetlen kép elvetése előtt egy második érintést kér.
    if (!force && CAM.shots.length && x && !x.classList.contains('arm')) {
      x.classList.add('arm');
      x.textContent = 'Elveted?';
      setTimeout(() => { if (x.isConnected) { x.classList.remove('arm'); x.textContent = '×'; } }, 2500);
      return;
    }
    camStop();
    CAM.shots.forEach(s => URL.revokeObjectURL(s.url));
    CAM.shots = [];
    CAM.id = null;
    if (d && d.open) d.close();
  }

  // Váltható konténerek (ugyanaz a lista, mint a telefonos fotóoldalon).
  const camList = () => photoList(CAM.id).map(x => S.data.containers[x.id]).filter(Boolean);

  function camLabel(c) {
    const t = iso(new Date());
    const day = c.day === t ? 'ma' : c.day === addDays(t, 1) ? 'holnap' : c.day === addDays(t, -1) ? 'tegnap' : c.day ? short(c.day) : '';
    const n = livePhotos(c.id).length + CAM.shots.filter(s => s.id === c.id).length;
    return [c.id, [day, c.eta_time].filter(Boolean).join(' '), c.plate ? plate(c.plate) : '', n ? `${n} kép` : ''].filter(Boolean).join(' · ');
  }

  // A kép azonnal a sávba kerül (az épp kiválasztott konténerhez); ha a JPEG még készül (ready), a feltöltés megvárja.
  function camAdd(blob, url, ready) {
    if (!CAM.id) return;
    CAM.shots.push({ k: Math.random().toString(36).slice(2), id: CAM.id, blob, url: url || URL.createObjectURL(blob), ready: ready || Promise.resolve(blob) });
    renderCam();
    const s = $('#cam .cam-strip');
    if (s) s.scrollLeft = s.scrollWidth;
  }

  // A kép az élőkép épp látható kockája, az érintés pillanatában. (Korábban Androidon az ImageCapture.takePhoto()
  // készítette: az újrafókuszál és fényt mér, így a kép 0,5–2 mp-cel a gombnyomás után, elmozdulva készült.
  // A kép úgyis 1920 px-re kicsinyül, ezt az élőkép felbontása is adja.)
  // A vászonra rajzolás szinkron és gyors; a JPEG-kódolás utána, a háttérben fut, így rögtön jöhet a következő kép.
  function camShot() {
    const d = $('#cam');
    const v = d && d.querySelector('video');
    if (!camLive()) { const n = $('#cam-in-native'); if (n) n.click(); return; }
    const k = Math.min(1, 1920 / Math.max(v.videoWidth, v.videoHeight));
    const cv = document.createElement('canvas');
    cv.width = Math.round(v.videoWidth * k); cv.height = Math.round(v.videoHeight * k);
    cv.getContext('2d').drawImage(v, 0, 0, cv.width, cv.height);
    const fl = d.querySelector('.cam-flash');
    fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
    if (navigator.vibrate) navigator.vibrate(20);
    // Kis előnézet azonnal; a teljes kép elkészültéig ez látszik a sávban.
    const tk = 160 / Math.max(cv.width, cv.height);
    const tc = document.createElement('canvas');
    tc.width = Math.round(cv.width * tk); tc.height = Math.round(cv.height * tk);
    tc.getContext('2d').drawImage(cv, 0, 0, tc.width, tc.height);
    const ready = new Promise(r => cv.toBlob(r, 'image/jpeg', 0.85)).then(b => {
      const s = CAM.shots.find(x => x.ready === ready);
      if (s) s.blob = b;
      return b;
    });
    camAdd(null, tc.toDataURL('image/jpeg', 0.7), ready);
  }

  async function camFiles(files) {
    for (const f of files) {
      if (f.type && !f.type.startsWith('image/')) continue;
      try { camAdd(await shrink(f)); } catch (_) { toast('Egy kép nem olvasható'); }
    }
  }

  function renderCam() {
    const d = $('#cam');
    if (!d || !d.open || !CAM.id) return;
    const up = livePhotos(CAM.id).map((p, i) => `<figure class="ph-t up">
        <button type="button" class="ph-img" data-action="photo-view" data-ph="${esc(p.path)}" aria-label="Feltöltött ${i + 1}. fotó"><img data-ph="${esc(p.path)}" alt=""${phUrl(p.path) ? ` src="${phUrl(p.path)}"` : ''}></button>
        ${canDelPhoto(p) ? `<button type="button" class="ph-x" data-action="photo-del" data-ph="${esc(p.path)}" aria-label="Feltöltött ${i + 1}. fotó törlése">×</button>` : ''}
      </figure>`).join('');
    const sel = d.querySelector('#cam-ct');
    if (sel && document.activeElement !== sel) {
      sel.innerHTML = camList().map(c => `<option value="${esc(c.id)}"${c.id === CAM.id ? ' selected' : ''}>${esc(camLabel(c))}</option>`).join('');
    }
    const mine = CAM.shots.filter(s => s.id === CAM.id).map((s, i) => `<figure class="ph-t">
        <img src="${s.url}" alt="">
        <button type="button" class="ph-x" data-action="cam-del" data-k="${s.k}" aria-label="${i + 1}. új fotó törlése">×</button>
      </figure>`).join('');
    d.querySelector('.cam-strip').innerHTML = up + mine;
    const send = d.querySelector('.cam-send');
    send.disabled = !CAM.shots.length;
    send.textContent = CAM.shots.length ? `Feltöltés (${CAM.shots.length})` : 'Feltöltés';
    loadThumbs();
  }

  // Az összes konténer képei egyszerre mennek fel, konténerenként.
  async function camSend() {
    const by = {};
    CAM.shots.forEach(s => { (by[s.id] = by[s.id] || []).push(s.ready); });
    if (!Object.keys(by).length) return;
    camClose(true);
    for (const [id, pending] of Object.entries(by)) addPhotos(id, (await Promise.all(pending)).filter(Boolean), true);
  }

  async function delPhoto(path) {
    const p = PHOTOS.find(x => x.path === path);
    if (!p) return;
    const { error } = await sb.from('photos').delete().eq('id', p.id);
    if (error) { toast('A törlés nem sikerült'); return; }
    sb.storage.from('photos').remove([path]);
    PHOTOS = PHOTOS.filter(x => x.id !== p.id);
    paintPhotos(p.container);
    toast('Fotó törölve');
  }

  function viewPhoto(path) {
    const u = phUrl(path);
    if (!u) return;
    let d = $('#ph-view');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'ph-view';
      d.addEventListener('click', () => d.close());
      document.body.appendChild(d);
    }
    d.innerHTML = `<img src="${u}" alt="">`;
    d.showModal();
  }

  // A konténer képei a Letöltések mappába kerülnek (KONTÉNER_1.jpg, _2.jpg …), mappaválasztás és engedélykérés nélkül.
  // A már betöltött képek azonnal mennek, így a levél ugyanabban a kattintásban nyílhat (a böngésző nem tiltja le).
  const photosCached = id => livePhotos(id).every(p => PH_BLOB[p.path]);
  async function downloadPhotos(id) {
    const ph = livePhotos(id);
    const blobs = photosCached(id) ? ph.map(p => PH_BLOB[p.path]) : await Promise.all(ph.map(p => phBlob(p.path)));
    blobs.forEach((b, i) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `${id}_${i + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    });
    return blobs.length;
  }

  // ---------- QR-kód a telefonos fotózáshoz ----------
  // A QR egy korlátozott, lejáró link (foto.html): bejelentkezés nélkül csak ennek a konténernek a fotói és a rendszáma
  // érhető el. A már kint lévő QR újranyitáskor ugyanaz marad (a telefonon épp használhatják); az „Új QR-kód” a régit megszünteti.
  const QR = { id: null, url: '', busy: false };
  let qrLib = null;
  const loadQrLib = () => (qrLib ||= new Promise((res, rej) => {
    if (window.qrcode) { res(window.qrcode); return; }
    const sc = document.createElement('script');
    sc.src = `vendor/qrcode.js?v=${(CFG && CFG.version) || ''}`;
    sc.onload = () => (window.qrcode ? res(window.qrcode) : rej(new Error('qr')));
    sc.onerror = () => { qrLib = null; rej(new Error('qr')); };
    document.head.appendChild(sc);
  }));
  const photoSite = () => ((window.KF_CONFIG && window.KF_CONFIG.site) || location.origin + location.pathname.replace(/[^/]*$/, ''));

  function qrUntil(ts) {
    const d = new Date(ts);
    if (isNaN(d)) return '';
    const day = iso(d) === S.today ? 'ma' : iso(d) === addDays(S.today, 1) ? 'holnap' : short(iso(d));
    return `${day} ${pad(d.getHours())}:${pad(d.getMinutes())}-ig`;
  }

  async function qrDraw(cv, text) {
    const make = await loadQrLib();
    const q = make(0, 'M');
    q.addData(text);
    q.make();
    const n = q.getModuleCount(), quiet = 3, cells = n + quiet * 2;
    const css = 216, dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
    const px = Math.floor(css * dpr / cells);
    cv.width = cv.height = px * cells;
    cv.style.width = cv.style.height = `${css}px`;
    const g = cv.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#16191f';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) g.fillRect((c + quiet) * px, (r + quiet) * px, px, px);
  }

  function qrShell(c) {
    let d = $('#qr-dlg');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'qr-dlg';
      d.className = 'settings qr-dlg';
      d.setAttribute('aria-labelledby', 'qr-h');
      d.addEventListener('close', () => { QR.id = null; QR.url = ''; });
      document.body.appendChild(d);
    }
    d.innerHTML = `
      <div class="qr-in">
        <div class="settings-head">
          <h2 id="qr-h">Fotózás telefonnal</h2>
          <button type="button" class="x-btn" data-action="qr-close" aria-label="Bezárás"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </div>
        <div class="qr-body">
          <div class="qr-code" aria-live="polite"><span class="qr-wait">QR-kód készül…</span><canvas hidden role="img" aria-label="QR-kód a telefonos fotózáshoz"></canvas></div>
          <div class="qr-info">
            <span class="qr-cno">${esc(c.id.slice(0, 4))} ${esc(c.id.slice(4, 10))}<b>${esc(c.id.slice(10))}</b></span>
            <p>Olvasd be a telefon kamerájával. Belépés nem kell: a telefonon csak ennek a konténernek a fotói és a rendszáma érhető el.</p>
            <dl class="qr-dl">
              <div><dt>Rendszám</dt><dd>${c.plate ? esc(plate(c.plate)) : '<span class="dim">nincs megadva, a telefonon megadható</span>'}</dd></div>
              <div><dt>Érvényes</dt><dd class="qr-exp">…</dd></div>
              <div><dt>Készítette</dt><dd class="qr-by">…</dd></div>
            </dl>
            <div class="qr-btns">
              <button type="button" class="btn-ghost sm" data-action="qr-copy" disabled>${IC.copy}Link másolása</button>
              <button type="button" class="btn-ghost sm" data-action="qr-new" disabled>Új QR-kód</button>
              <button type="button" class="btn-ghost sm qr-rev" data-action="qr-revoke" disabled>Visszavonás</button>
            </div>
          </div>
        </div>
      </div>`;
    if (!d.open) d.showModal();
    return d;
  }

  async function qrLoad(fresh) {
    const id = QR.id, c = id && S.data.containers[id];
    const d = $('#qr-dlg');
    if (!c || !d || QR.busy) return;
    QR.busy = true;
    const box = d.querySelector('.qr-code'), cv = box.querySelector('canvas'), wait = box.querySelector('.qr-wait');
    d.querySelectorAll('.qr-btns button').forEach(b => { b.disabled = true; });
    try {
      const r = await edgeFn('photo-link', fresh ? 'relink' : 'link', { container: id, plate: (c.fixed && 'plate' in c.fixed ? c.fixed.plate : c.plate) || '', list: photoList(id) });
      if (QR.id !== id) return;
      QR.url = `${photoSite()}foto.html#t=${r.token}&c=${id}`;
      await qrDraw(cv, QR.url);
      cv.hidden = false;
      wait.hidden = true;
      d.querySelector('.qr-exp').textContent = qrUntil(r.expires_at);
      d.querySelector('.qr-by').textContent = `${who(r.by) || '—'}, ${hm(toLocal(r.created_at))}`;
      d.querySelectorAll('.qr-btns button').forEach(b => { b.disabled = false; });
      if (fresh) toast('Új QR-kód, a régi megszűnt');
    } catch (err) {
      if (QR.id !== id) return;
      cv.hidden = true;
      wait.hidden = false;
      wait.textContent = /Failed to fetch|NetworkError|Load failed/i.test(err.message) || err.message === 'qr'
        ? 'A QR-kód most nem készíthető el. Ellenőrizd a kapcsolatot, és nyisd meg újra.'
        : err.message;
      const nb = d.querySelector('[data-action="qr-new"]');
      if (nb) nb.disabled = false;
    } finally {
      QR.busy = false;
    }
  }

  // Telefonon (belépve) a Fotózás gomb QR nélkül ugyanarra a fotózó oldalra visz: a link a háttérben készül.
  // Ha a szolgáltatás nem érhető el, a beépített kamera nyílik.
  // A még meg nem érkezett konténerek tegnapelőttől holnapig, érkezési sorrendben; a megnyitott mindig benne van.
  function photoList(id) {
    const t = iso(new Date());
    const out = [];
    for (let d = addDays(t, -2); d <= addDays(t, 1); d = addDays(d, 1)) out.push(...onDay(d).filter(c => !c.arrived));
    const cur = S.data.containers[id];
    if (cur && !out.some(c => c.id === id)) out.unshift(cur);
    return out.map(c => ({ id: c.id, day: c.day || '', eta: c.eta_time || '', plate: c.plate ? plate(c.plate) : '' }));
  }

  async function photoPhone(el, id) {
    const c = S.data.containers[id];
    if (!c || el.classList.contains('busy')) return;
    el.classList.add('busy');
    try {
      // A fotóoldalon a lista konténerei között lehet váltani (a még meg nem érkezettek).
      const r = await edgeFn('photo-link', 'link', { container: id, plate: (c.fixed && 'plate' in c.fixed ? c.fixed.plate : c.plate) || '', multi: true, list: photoList(id) });
      // Visszalépéskor (ha a böngésző újratölti az oldalt) ugyanez az adatlap nyílik meg.
      history.replaceState(null, '', `${location.pathname}${location.search}#c=${id}`);
      location.href = `foto.html#t=${r.token}&c=${id}&from=app`;
    } catch (_) {
      el.classList.remove('busy');
      camOpen(id);
    }
  }

  function qrOpen(id) {
    const c = S.data.containers[id];
    if (!c) return;
    QR.id = id;
    QR.url = '';
    qrShell(c);
    qrLoad(false);
  }

  async function qrRevoke(el) {
    if (el.dataset.confirm !== '1') {
      el.dataset.confirm = '1';
      el.textContent = 'Biztosan?';
      setTimeout(() => { if (el.isConnected) { el.dataset.confirm = ''; el.textContent = 'Visszavonás'; } }, 2500);
      return;
    }
    try {
      await edgeFn('photo-link', 'revoke', { container: QR.id });
      $('#qr-dlg').close();
      toast('A QR-kód megszűnt');
    } catch (err) { toast(err.message); }
  }

  // ---------- érkezési email ----------
  const MAIL_TO = ['h7wh@hgllog.com', 'e-commerce@hgllog.com', 'eker.vam@hgllog.com'];
  function mailParts(c) {
    const d = new Date();
    const day = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    const mrn = c.t1 || '';
    const subject = `Érkező B2B konténer // ${c.id}// ${mrn} ${day}`.replace(/ {2,}/g, ' ');
    const awbs = (c.pdd || []).map(p => p.no).filter(Boolean);
    const lines = [
      'Érkezett egy B2B konténer.',
      `MRN ${mrn}`.trim(),
      `Konténer szám: ${c.id}`,
      `Rendszám: ${plate(c.plate)}`.trim(),
      ...(awbs.length ? [`Fuvarlevélszámok: ${awbs.join(', ')}`] : []),
      '',
      'Csatolom a képeket és dokumentációt.',
      '',
      'Kérnénk szépen nyitást!'
    ];
    return { to: MAIL_TO, subject, lines, body: lines.join('\n') };
  }

  // A levél előnézete összecsukva indul; a kinyitott állapot a munkamenet végéig megmarad.
  let MAIL_OPEN = false;
  document.addEventListener('toggle', e => { if (e.target.classList && e.target.classList.contains('mail-more')) MAIL_OPEN = e.target.open; }, true);
  function mailBox(c) {
    const m = mailParts(c);
    const miss = [!c.t1 && 'MRN', !c.plate && 'rendszám', !livePhotos(c.id).length && 'fotó'].filter(Boolean);
    return `
      <section class="mailbox" aria-label="Nyitáskérelem">
        <div class="mail-head">
          <b>Nyitáskérelem</b>
          <span class="mail-act">
          <button type="button" class="ibtn mail-help" data-action="photo-help" aria-label="Súgó: fotózás és nyitáskérelem" title="Súgó: fotózás és nyitáskérelem">${IC.help}</button>
          ${MAIL_LATER === c.id
            ? `<button type="button" class="btn-primary sm mail-go" data-action="mail-open">${IC.mail}Levél megnyitása</button>`
            : `<button type="button" class="btn-primary sm mail-go" data-action="mail">${IC.mail}Nyitáskérelem küldése</button>`}
          </span>
        </div>
        ${miss.length ? `<div class="flag warn">${IC.warn}Hiányzik: ${esc(miss.join(', '))}</div>` : ''}
        ${MAIL_DONE && MAIL_DONE.id === c.id ? `<div class="mail-att" role="status">
          <b>${IC.check}${MAIL_DONE.n} fotó a Letöltések mappában</b>
          <span class="mono">${esc(c.id)}_1.jpg${MAIL_DONE.n > 1 ? ` … _${MAIL_DONE.n}.jpg` : ''}</span>
          <ol><li>Húzd be a képeket a levélbe a böngésző letöltési listájából (jobb felül), vagy</li><li>a levélben: <b>Csatolás</b> → <b>Tallózás ezen a számítógépen</b> → <b>Letöltések</b>, jelöld ki a képeket.</li></ol>
          <small>Ha a böngésző megkérdezi, engedélyezd a több fájl letöltését (csak első alkalommal).</small>
        </div>` : ''}
        <details class="mail-more"${MAIL_OPEN ? ' open' : ''}>
          <summary>Levél előnézete<span>${esc(m.subject)}</span></summary>
          <dl class="mail-pv">
            <div><dt>Címzett</dt><dd><span>${esc(m.to.join('; '))}</span>${cp(m.to.join('; '))}</dd></div>
            <div><dt>Tárgy</dt><dd><span>${esc(m.subject)}</span>${cp(m.subject)}</dd></div>
            <div class="mail-txt"><dt>Szöveg</dt><dd><span>${m.lines.map(l => esc(l) || '&nbsp;').join('<br>')}</span>${cp(m.body)}</dd></div>
          </dl>
        </details>
      </section>`;
  }

  // Az Outlook webes levélírója nyílik meg: a piszkozatba a felhasználó saját, Outlookban beállított aláírása kerül
  // (az új Outlook mailto-val nyitott levélbe nem tesz aláírást). Elküldeni a felhasználó küldi.
  function composeUrl(m) {
    const q = v => encodeURIComponent(v);
    return `https://outlook.office.com/mail/deeplink/compose?to=${q(m.to.join(';'))}&subject=${q(m.subject)}&body=${q(m.body + '\n')}`;
  }

  function openWin(url) {
    const w = window.open(url, '_blank');
    if (w) w.opener = null;
    return !!w;
  }

  // A webes Outlook linkből csatolmányt nem fogad: a képek a Letöltésekbe kerülnek, a levélbe onnan húzhatók be.
  // Ha a böngésző mégis letiltja az új ablakot, a levél egy külön gombbal nyílik.
  let MAIL_LATER = null;
  let MAIL_DONE = null; // { id, n }: a képek letöltve, a csatolás menete a dobozban látszik

  async function openMail(id) {
    const c = S.data.containers[id];
    if (!c) return;
    const url = composeUrl(mailParts(c));
    const n = livePhotos(id).length;
    if (isExe()) {
      if (!(await exe().open_url(url))) { toast('Frissítsd az alkalmazást'); return; }
      if (n) { try { MAIL_DONE = { id, n: await downloadPhotos(id) }; } catch (_) { toast('A fotók letöltése nem sikerült'); } paintPhotos(id); }
      return;
    }
    if (n) {
      try { MAIL_DONE = { id, n: await downloadPhotos(id) }; }
      catch (_) { toast('A fotók letöltése nem sikerült'); }
    }
    MAIL_LATER = openWin(url) ? null : id;
    if (MAIL_LATER) toast('A böngésző letiltotta az új ablakot: nyisd meg a levelet a gombbal');
    else if (n && MAIL_DONE) toast(`${MAIL_DONE.n} fotó a Letöltések mappában`);
    paintPhotos(id);
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
    $('#dev-sec').hidden = !admin || !window.KFDev;
    $('#ramp-info').textContent = `${RAMPS} használható a ${RAMP_SLOTS} helyből: ${RAMP_TXT}. Nem tud kamion állni: 1 és 9 (Joloda), 2, valamint a vak 7, 8, 10, 13, 14, 18, 19, 23.`;
    $('#prio-sec').hidden = !canPrio();
    $('#prio-sum').innerHTML = prioSum();
    $('#app-sec').hidden = !isExe();
    $('#sync-sec').hidden = isWorker();
    if (admin) loadUsers();
    if (isExe()) {
      try { $('#autostart').checked = !!(await exe().get_settings()).autostart; } catch (_) { /* régi exe */ }
    }
    $('#settings').showModal();
  }

  // Az útmutató adatlapos lépéseihez: a kijelölt nap első (lehetőleg már érkezett) konténere, ennek híján a legközelebbi napé.
  const tourSheet = {
    pick() {
      const act = all().filter(c => c.state === 'active');
      const day = onDay(S.sel);
      const c = day.find(x => x.stage || x.arrived) || day[0]
        || act.sort((a, b) => Math.abs(parse(a.day) - parse(S.sel)) - Math.abs(parse(b.day) - parse(S.sel)))[0];
      return c ? c.id : null;
    },
    open(id) { if (id && S.drawer !== id) openDrawer(id); },
    close() { closeDrawer(); }
  };

  // Útmutató: a heti nézet mai napjáról indul, hogy a lépések a valódi elemekre mutassanak.
  function startTour(opener) {
    if (!window.KFTour || !ME) return;
    if (S.drawer) closeDrawer();
    const t = iso(new Date());
    const redo = S.view !== 'week' || S.sel !== t || S.week !== mondayOf(t);
    if (redo) {
      S.view = 'week'; S.today = t; S.sel = t; S.week = mondayOf(t); S.month = t.slice(0, 7); S.calSel = t;
      render('yard main');
    }
    // Az újrarajzolt elemek belépő mozgása után indul, hogy a kiemelés a végleges helyükre kerüljön.
    setTimeout(() => window.KFTour.start(ME.role, { opener, sheet: tourSheet }), redo && canFly() ? 900 : 0);
  }

  document.addEventListener('click', async e => {
    // A változáslista bezárul kívülre kattintva, és ha belőle nyílik egy konténer.
    if (S.chg && (!e.target.closest('#chg-pop, [data-action="chg"]') || e.target.closest('#chg-pop [data-action]'))) setChg(false);
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const a = el.dataset.action;
    switch (a) {
      case 'view': switchView(el.dataset.view); break;
      case 'chg': setChg(!S.chg); break;
      case 'unit':
        if (S.unit === el.dataset.v) break;
        S.unit = el.dataset.v;
        try { localStorage.setItem('kf-unit', S.unit); } catch (_) { /* privát mód */ }
        swapUnit();
        break;
      case 'px': S.px = el.dataset.v && S.px !== el.dataset.v ? el.dataset.v : null; render(); break;
      case 'export': exportWeek(); break;
      case 'live': if (!liveBusy) { liveBusy = true; exportLive('week').finally(() => { liveBusy = false; }); } break;
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
      case 'band': switchBand(el.dataset.v === 'yard' ? 'yard' : 'week'); break;
      case 'site': switchSite(el.dataset.v); break;
      case 'site-set': {
        const t = el.closest('.toast');
        if (t) dropToast(t);
        await setSite(el.dataset.id, el.dataset.v);
        break;
      }
      case 'fleet-more': toggleFleet(); break;
      case 'lane': {
        const v = el.dataset.v === 'ramp' ? 'ramp' : 'ct';
        if (v === S.laneMode) break;
        S.laneMode = v;
        const old = $('#view .lanes');
        if (!old) { render(); break; }
        const tpl = document.createElement('template');
        tpl.innerHTML = laneView(S.sel, panelOn(S.sel)).trim();
        const nu = tpl.content.firstElementChild;
        nu.classList.add('rv');
        old.replaceWith(nu);
        const b = nu.querySelector(`[data-action="lane"][data-v="${v}"]`);
        if (b) b.focus({ preventScroll: true });
        if (canFly()) nu.querySelector('.ln-scroll, .ln-empty')?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
        break;
      }
      case 'pick': {
        const t = el.closest('.toast');
        if (t) dropToast(t);
        openPicker(el.dataset.id);
        break;
      }
      case 'rpick-close': closePicker(); break;
      case 'rpick-save': {
        if (!PICK || !PICK.r) break;
        const { id, r } = PICK;
        closePicker();
        await setRamp(id, r);
        break;
      }
      case 'rpick-clear': {
        if (!PICK) break;
        const id = PICK.id;
        closePicker();
        await setRamp(id, null);
        break;
      }
      case 'close': closeDrawer(); break;
      case 'dstep': {
        const c = S.data.containers[S.drawer];
        const list = c.state === 'active' ? panelOn(panelDay(c)) : removedOn(c.removed_from);
        const step = Number(el.dataset.step);
        const i = list.findIndex(x => x.id === c.id) + step;
        if (list[i]) stepDrawer(list[i].id, step);
        break;
      }
      case 'refresh':
        if (CLOUD_BUSY) break;
        await loadAll();
        await startCloudSync('refresh');
        break;
      case 'settings': openSettings(); break;
      case 'tour': startTour(el); break;
      case 'sday': {
        const cur = S.statDay || S.today;
        const nx = addDays(cur, Number(el.dataset.step));
        if (nx > S.today) break;
        S.statDay = nx;
        render();
        const b = $(`#view [data-action="sday"][data-step="${el.dataset.step}"]`);
        if (b && !b.disabled) b.focus({ preventScroll: true });
        break;
      }
      case 'sclosed':
        S.statClosed = !S.statClosed;
        render();
        $('#view [data-action="sclosed"]')?.focus({ preventScroll: true });
        break;
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
          const day = c.state === 'active' ? panelDay(c) : c.removed_from;
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
      case 'paste': $('#paste-text').value = ''; pasteSeen = new Set(); renderPaste(); $('#paste').showModal(); setTimeout(() => $('#paste-text').focus(), 30); break;
      case 'paste-close': $('#paste').close(); break;
      case 'wb': openWaybills(); break;
      case 'wb-close': $('#wb').close(); break;
      case 'wb-save': await saveWaybills(); break;
      case 'prio': openPrio(); break;
      case 'prio-close': $('#prio').close(); break;
      case 'prio-save': await savePrio(); break;
      case 'paste-save': await savePaste(); break;
      case 'settings-close': $('#settings').close(); break;
      case 'people': openPeople(); break;
      case 'dev': $('#settings').close(); if (window.KFDev) window.KFDev.open(); break;
      case 'people-close': $('#people').close(); break;
      case 'people-filter': peopleFilter = el.dataset.f; renderPeople(); break;
      case 'logout': await sb.auth.signOut(); location.reload(); break;
      case 'resync':
        $('#settings').close();
        if (await startCloudSync('full')) toast('A levelek újraolvasása elindult');
        break;
      case 'datafolder': await exe().open_data_folder(); break;
      case 'file': await openFile(el.dataset.path); break;
      case 'mail': await openMail(S.drawer); break;
      case 'mail-open': {
        const c = S.data.containers[S.drawer];
        MAIL_LATER = null;
        if (c) { const url = composeUrl(mailParts(c)); if (!openWin(url)) location.href = url; }
        paintPhotos(S.drawer);
        break;
      }
      case 'fx-edit': fxStart(el.dataset.k); break;
      case 'photo-help': if (window.KFTour && ME) window.KFTour.photoHelp(ME.role, el); break;
      case 'photo-qr': qrOpen(S.drawer); break;
      case 'photo-phone': await photoPhone(el, S.drawer); break;
      case 'qr-close': $('#qr-dlg').close(); break;
      case 'qr-new': await qrLoad(true); break;
      case 'qr-revoke': await qrRevoke(el); break;
      case 'qr-copy':
        try { await navigator.clipboard.writeText(QR.url); toast('Link másolva'); } catch (_) { toast('A másolás nem sikerült'); }
        break;
      case 'photo-take':
        if (el.dataset.src === 'cam') camOpen(S.drawer);
        else { const inp = $('#ph-lib'); if (inp) inp.click(); }
        break;
      case 'cam-close': camClose(); break;
      case 'cam-shot':
        // Érintésnél már a lenyomás exponált; a click csak billentyűzetről vagy a rendszerkamerás tartalékútnál fotóz.
        if (CAM.ptrShot && e.detail) { CAM.ptrShot = false; break; }
        camShot();
        break;
      case 'cam-lib': { const inp = $('#cam-in-lib'); if (inp) inp.click(); break; }
      case 'cam-send': camSend(); break;
      case 'cam-del': {
        const s = CAM.shots.find(x => x.k === el.dataset.k);
        if (s) { URL.revokeObjectURL(s.url); CAM.shots = CAM.shots.filter(x => x !== s); renderCam(); }
        break;
      }
      case 'photo-view': viewPhoto(el.dataset.ph); break;
      case 'photo-del':
        // Első érintésre csak élesedik, a második töröl.
        if (!el.classList.contains('arm')) { el.classList.add('arm'); const lbl = el.getAttribute('aria-label'); el.setAttribute('aria-label', 'Biztosan törlöd?'); setTimeout(() => { el.classList.remove('arm'); el.setAttribute('aria-label', lbl); }, 2500); break; }
        await delPhoto(el.dataset.ph);
        break;
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
    if (el.id === 'cam-ct') {
      CAM.id = el.value;
      el.blur();
      renderCam();
      return;
    }
    if (el.id === 'cam-in-lib' || el.id === 'cam-in-native') {
      const files = [...el.files];
      el.value = '';
      camFiles(files);
      return;
    }
    if (el.id === 'ph-lib') {
      const files = [...el.files];
      el.value = '';
      addPhotos(el.dataset.id, files);
      return;
    }
    if (el.matches('input.eta[data-eta]')) {
      const c = S.data.containers[el.dataset.eta];
      if (c) saveEta(c.id, c.eta_date || c.date, el.value);
    }
  });

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.id === 'q') { renderSearch(); return; }
    if (el.id === 'paste-text') { renderPaste(); return; }
    if (el.id === 'wb-text') { renderWaybills(); return; }
    if (el.id === 'prio-text') { renderPrio(); return; }
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
  // A menü zárása rövid kicsúszással; a details az animáció végén csukódik be (addig a tartalma látszik).
  function closeMenu(d) {
    if (!d.open || d.classList.contains('closing')) return;
    if (RM.matches) { d.open = false; return; }
    d.classList.add('closing');
    setTimeout(() => { d.open = false; d.classList.remove('closing'); }, 140);
  }
  document.addEventListener('click', e => {
    // Felhasználói műveletmenü: egyszerre egy nyitva, kattintásra (vagy választás után) bezárul.
    const own = e.target.closest('.p-menu');
    // Az éppen nyitott menü fejlécére kattintva sem tűnik el egyszerre: előbb kicsúszik.
    const sum = e.target.closest('.p-more');
    if (sum && own && own.open) { e.preventDefault(); closeMenu(own); return; }
    document.querySelectorAll('.p-menu[open]').forEach(d => {
      if (d !== own || (e.target.closest('.p-pop button') && !e.target.closest('[data-action="user-remove"]'))) closeMenu(d);
    });
    if (!e.target.closest('.search')) { const b = $('#qres'); if (b && !b.hidden) closeSearch(); }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.activeElement === $('#q')) { $('#q').value = ''; renderSearch(); return; }
    if (e.key === 'Escape' && S.chg) { setChg(false); const b = $('.chg-btn[data-action="chg"]'); if (b) b.focus(); return; }
    if (document.activeElement === $('#q') && ['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
      const hits = $('#qres').querySelectorAll('.qhit');
      if ($('#qres').hidden) { if (e.key !== 'Enter' && $('#q').value.trim().length >= 3) { e.preventDefault(); renderSearch(); } return; }
      if (!hits.length) return;
      e.preventDefault();
      if (e.key === 'Enter') { (hits[qIdx] || hits[0]).click(); return; }
      qIdx = (Math.max(qIdx, e.key === 'ArrowDown' ? -1 : 0) + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
      searchState(true);
      return;
    }
    // Nyitott párbeszédablak (beállítások, nagy kép, QR, kamera …) fölött az Esc csak azt zárja, az adatlapot nem.
    const dlgOpen = !!document.querySelector('dialog[open]');
    if (e.key === 'Escape' && S.drawer && !dlgOpen) closeDrawer();
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey
        && S.view === 'week' && S.data && !S.drawer && !dlgOpen) {
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
  $('#wb').addEventListener('close', () => {
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
      if (v && mine && v !== mine && !editing() && !S.drawer && !(window.KFTour && window.KFTour.active)) location.reload();
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
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !S.data) return;
    pullSync();
    if (Date.now() - lastRefresh > 60000) refreshData();
  });

  setInterval(() => {
    if (!S.data) return;
    window.KF.reload();
    pullSync();
    if (editing() || S.drawer) return;
    const t = iso(new Date());
    if (t !== S.today) { rebuild(); render(); return; }
    if (S.view === 'week' && (S.sel === S.today || S.band === 'yard')) render();
    else renderSync();
  }, 60000);

  sb.auth.onAuthStateChange(ev => {
    if (ev === 'SIGNED_OUT' && ME) location.reload();
  });

  bootAuth();
})();
