(() => {
  'use strict';

  const DOW = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
  const DOW_S = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
  const MON = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
  const MON_S = ['jan', 'febr', 'márc', 'ápr', 'máj', 'jún', 'júl', 'aug', 'szept', 'okt', 'nov', 'dec'];
  const ST_LABEL = { pre: 'Bejelentve', t1: 'Kamion + T1', eta: 'ETA rögzítve', arrived: 'Megérkezett', removed: 'Kikerült' };

  const IC = {
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
  const S = { statsDays: 28, q: '', data: null, view: 'week', week: null, sel: null, month: null, calSel: null, drawer: null, anim: false, pending: false, today: null };
  const CFG = window.KF_CONFIG;
  const sb = window.supabase.createClient(CFG.url, CFG.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  let ME = null;
  let MSGS = [];
  let MAN = {};
  let ARR = [];
  let RAMPS = 10;
  let MEMBERS = {};
  const who = email => (email && MEMBERS[email]) || email || '';
  let SYNC = null;
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
    const d = window.KFDerive(MSGS, MAN, ARR);
    d.now = nowIso();
    S.data = d;
    S.today = d.now.slice(0, 10);
    if (!S.sel) {
      S.sel = S.today;
      S.week = mondayOf(S.today);
      S.month = S.today.slice(0, 7);
      S.calSel = S.today;
      S.anim = true;
    }
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

  async function loadAll() {
    const [msgs, man, arr, sync, cfg, mem] = await Promise.all([
      fetchAll('messages', 'received'),
      fetchAll('manual'),
      fetchAll('arrivals', 'received'),
      sb.from('sync_status').select('*').eq('id', 1).maybeSingle(),
      sb.from('app_settings').select('*').eq('id', 1).maybeSingle(),
      sb.from('members').select('email, name')
    ]);
    if (mem.data) MEMBERS = Object.fromEntries(mem.data.map(m => [m.email, m.name || m.email]));
    if (cfg.data) RAMPS = cfg.data.ramp_count || 10;
    MSGS = msgs.map(normMsg);
    MAN = Object.fromEntries(man.map(r => [r.container, normMan(r)]));
    ARR = arr.map(normArr);
    SYNC = sync.data || null;
    rebuild();
    render();
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
    if ($('#settings').open || $('#paste').open) return true;
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

  function showAuth(mode, info) {
    $('#auth').hidden = mode === 'app';
    $('#app').hidden = mode !== 'app';
    $('#invite').hidden = mode !== 'invite';
    $('#denied').hidden = mode !== 'denied';
    $('#auth-loading').hidden = mode !== 'loading';
    if (mode === 'invite' && info) $('#invite-text').textContent = info;
    if (mode === 'denied') $('#denied-text').textContent = 'Ez a hozzáférés megszűnt. Kérj új meghívó linket az admintól.';
  }

  async function enter(session) {
    const email = (session.user.email || '').toLowerCase();
    const { data, error } = await sb.from('members').select('email, role, name').eq('email', email).maybeSingle();
    if (error || !data) { showAuth('denied', email); return; }
    ME = data;
    showAuth('app');
    await loadAll();
    subscribe();
    window.KF.reload();
  }

  async function bootAuth() {
    showAuth('loading');
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
  function render() {
    if (!S.data) return;
    renderTabs();
    renderPeriod();
    renderSync();
    $('#view').innerHTML = S.view === 'week' ? weekView() : S.view === 'month' ? monthView() : statsView();
    renderDrawer();
    S.anim = false;
    S.pending = false;
  }

  function renderTabs() {
    document.querySelectorAll('.tab').forEach(t => {
      if (t.dataset.view === S.view) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
  }

  function renderPeriod() {
    let label;
    if (S.view === 'stats') {
      $('#period').innerHTML = `<div class="seg" role="group" aria-label="Időszak">${[7, 28, 90].map(n => `<button type="button" class="seg-btn" data-action="stats-range" data-days="${n}" aria-pressed="${S.statsDays === n}">${n} nap</button>`).join('')}</div>`;
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
    $('#period').innerHTML = `
      <button type="button" class="ibtn" data-action="prev" aria-label="${S.view === 'week' ? 'Előző hét' : 'Előző hónap'}">${IC.left}</button>
      <div class="period-label">${label}</div>
      <button type="button" class="ibtn" data-action="next" aria-label="${S.view === 'week' ? 'Következő hét' : 'Következő hónap'}">${IC.right}</button>
      <button type="button" class="tbtn" data-action="today">Ma</button>
      <button type="button" class="tbtn tbtn-ic" data-action="paste" aria-label="ETA beillesztése" title="ETA beillesztése"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2"/><path d="M12 11v6M9 14h6"/></svg><span>ETA beillesztése</span></button>`;
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
    $('#sync').innerHTML = `
      <span class="sync-dot ${dot}" aria-hidden="true"></span>
      <span class="sync-text ${tcls}" title="${esc(title)}">${esc(text)}</span>
      <button type="button" class="ibtn ${busy ? 'spin' : ''}" data-action="refresh" aria-label="Frissítés">${IC.refresh}</button>
      <button type="button" class="ibtn" data-action="settings" aria-label="Beállítások">${IC.sliders}</button>
      <span class="avatar" title="${esc(ME ? ME.email : '')}" aria-hidden="true">${initial}</span>`;
  }

  // ---------- heti nézet ----------
  function weekView() {
    const days = [...Array(7)].map((_, i) => addDays(S.week, i));
    const lists = days.map(onDay);
    const maxKg = Math.max(1, ...lists.map(sumKg));
    const maxN = Math.max(1, ...lists.map(l => l.length));
    const minH = maxN > 10 ? 14 : 22;
    const k = Math.min(3 / 1000, Math.max(0, (292 - (maxN - 1) * 4)) / maxKg);

    const cols = days.map((d, i) => {
      const list = lists[i];
      const kg = sumKg(list);
      const blocks = list.slice().reverse().map((c, j, arr) => `
        <div class="blk blk-${c.status}${lateInfo(c) ? ' late' : ''}" style="height:${Math.max(minH, Math.round(c.kg * k))}px;animation-delay:${(arr.length - 1 - j) * 45}ms">
          <span>${esc(c.id)}</span><span>${esc(c.eta_time || fmtT(c.kg))}</span>
        </div>`).join('');
      const notes = [];
      const mo = movedOut(d);
      if (mo.length) {
        const targets = [...new Set(mo.map(c => c.date))];
        notes.push(targets.length === 1 ? `${mo.length} konténer → ${DOW[dowIdx(targets[0])].toLowerCase()}` : `${mo.length} konténer áthelyezve`);
      }
      const rm = removedOn(d);
      if (rm.length) notes.push(`${rm.length} kikerült`);
      const nodata = !hasForecast(d) && !list.length;
      if (nodata && d >= S.today) notes.push('Még nincs előrejelzés');
      return `
        <button type="button" class="day" data-action="day" data-date="${d}" aria-pressed="${d === S.sel}">
          <div class="day-top"><span class="day-dow">${DOW[i]}</span>${d === S.today ? '<span class="today-tag">MA</span>' : ''}</div>
          <div class="day-num">${parse(d).getDate()}</div>
          <div class="stack ${nodata ? 'nodata' : ''}">${blocks}${notes.length ? `<div class="stack-note">${notes.map(esc).join('<br>')}</div>` : ''}</div>
          <div class="day-foot"><span><b>${list.length}</b><small>db</small></span><span class="mono">${list.length ? fmtT(kg) : '—'}</span></div>
          <div class="day-ctn">${list.length ? fmtInt(sumCt(list)) + ' karton' : ''}</div>
        </button>`;
    }).join('');

    return `
      <section class="yard ${S.anim ? 'anim' : ''}" aria-label="Heti érkezések">
        <div class="legend">
          <span><i class="lg-pre"></i>Bejelentve</span>
          <span><i class="lg-t1"></i>Kamion + T1</span>
          <span><i class="lg-eta"></i>ETA rögzítve</span>
          <span><i class="lg-arrived"></i>Megérkezett</span>
        </div>
        <div class="yard-scroll"><div class="days">${cols}</div></div>
      </section>
      ${dayPanel()}`;
  }

  // ---------- folyamat, késés, rámpa ----------
  const STAGES = ['request', 'approved', 'opened', 'released'];
  const STAGE_LABEL = { request: 'Nyitáskérés', approved: 'Nyitható', opened: 'Rakodás', released: 'Elengedve' };

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

  function miniSteps(c) {
    const reached = STAGES.indexOf(c.stage);
    return `<span class="mini-steps" aria-hidden="true">${STAGES.map((s, i) => `<i class="${i <= reached ? 'on' : ''}"></i>`).join('')}</span>`;
  }

  function stepper(c) {
    const st = c.stages || {};
    const first = st.request ? st.request.at : c.arrived_at;
    const items = STAGES.map((k, i) => {
      const at = k === 'request' ? first : (st[k] && st[k].at);
      const prev = i ? STAGES.slice(0, i).map(p => (p === 'request' ? first : st[p] && st[p].at)).filter(Boolean).pop() : null;
      const dur = at && prev ? fmtDur(minutesBetween(prev, at)) : '';
      return `
        <li class="${at ? 'done' : ''}">
          <span class="sp-dot" aria-hidden="true"></span>
          <span class="sp-lab">${STAGE_LABEL[k]}</span>
          <span class="sp-at">${at ? esc(hm(at)) : '—'}</span>
          <span class="sp-dur">${dur ? '+' + esc(dur) : ''}</span>
        </li>`;
    }).join('');
    const total = first && st.released ? fmtDur(minutesBetween(first, st.released.at)) : '';
    return `
      <section class="flow" aria-label="Folyamat">
        <div class="flow-head"><b>Folyamat</b>${total ? `<span>Teljes átfutás: ${esc(total)}</span>` : ''}</div>
        <ol class="steps">${items}</ol>
      </section>`;
  }

  function rampUse(day, exceptId) {
    const used = {};
    onDay(day).forEach(x => {
      if (x.ramp && x.id !== exceptId && x.stage !== 'released') used[x.ramp] = x.id;
    });
    return used;
  }

  function rampPicker(c) {
    const used = rampUse(c.day, c.id);
    const btns = [];
    for (let n = 1; n <= RAMPS; n++) {
      const other = used[n];
      btns.push(`<button type="button" class="rp ${c.ramp === n ? 'sel' : ''} ${other ? 'busy' : ''}" data-action="ramp" data-ramp="${n}" aria-pressed="${c.ramp === n}" title="${other ? 'Foglalt: ' + esc(other) : ''}"><b>${n}</b>${other ? `<small>${esc(other.slice(0, 4))}</small>` : ''}</button>`);
    }
    return `
      <section class="rampbox" aria-label="Rámpa">
        <div class="flow-head"><b>Rámpa</b>${c.ramp && c.ramp_set ? `<span>${esc(stamp(c.ramp_set))}</span>` : ''}</div>
        <div class="rp-grid">${btns.join('')}</div>
      </section>`;
  }

  function rampStrip(d, list) {
    if (d !== S.today) return '';
    const occ = {};
    list.forEach(x => { if (x.ramp && x.stage !== 'released') occ[x.ramp] = x; });
    if (!list.some(x => x.arrived) && !Object.keys(occ).length) return '';
    const tiles = [];
    for (let n = 1; n <= RAMPS; n++) {
      const x = occ[n];
      tiles.push(x
        ? `<button type="button" class="dock busy dock-${x.stage || 'request'}" data-action="open" data-id="${esc(x.id)}"><span class="dock-n">${n}</span><span class="dock-id">${esc(x.id)}</span><span class="dock-st">${esc(STAGE_LABEL[x.stage] || 'Megérkezett')}</span></button>`
        : `<div class="dock"><span class="dock-n">${n}</span><span class="dock-free">szabad</span></div>`);
    }
    return `<section class="docks" aria-label="Rámpák"><div class="docks-head"><b>Rámpák</b><span>${Object.keys(occ).length} / ${RAMPS} foglalt</span></div><div class="dock-row">${tiles.join('')}</div></section>`;
  }

  // ---------- keresés ----------
  function searchHits(q) {
    const n = q.toUpperCase().replace(/\s+/g, '');
    if (n.length < 3) return [];
    const out = [];
    for (const c of all()) {
      let where = '';
      if (c.id.includes(n)) where = 'Konténer';
      else if ((c.t1 || '').toUpperCase().includes(n)) where = 'MRN';
      else if ((c.plate || '').toUpperCase().replace(/\s+/g, '').includes(n)) where = 'Rendszám';
      else if (c.pdd.some(p => (p.no || '').toUpperCase().includes(n))) where = 'PDD';
      if (where) out.push({ c, where });
    }
    return out.sort((a, b) => (a.c.date < b.c.date ? 1 : -1)).slice(0, 12);
  }

  function renderSearch() {
    const box = $('#qres');
    const q = $('#q').value.trim();
    if (q.length < 3) { box.hidden = true; box.innerHTML = ''; return; }
    const hits = searchHits(q);
    box.hidden = false;
    box.innerHTML = hits.length ? hits.map(({ c, where }) => {
      const day = c.state === 'active' ? c.day : c.removed_from;
      return `<button type="button" class="qhit" data-action="qopen" data-id="${esc(c.id)}">
        <span class="qhit-id">${esc(c.id)}</span>
        <span class="qhit-meta">${day ? `${DOW_S[dowIdx(day)]} ${short(day)}` : ''} · ${esc(where)}</span>
        <span class="st st-${c.status}"><i aria-hidden="true"></i>${c.arrived && c.stage ? esc(STAGE_LABEL[c.stage]) : ST_LABEL[c.status]}</span>
      </button>`;
    }).join('') : '<div class="qnone">Nincs találat</div>';
  }

  // ---------- statisztika ----------
  function statsView() {
    const today = S.today;
    const from = addDays(today, -(S.statsDays - 1));
    const to = addDays(today, 7);
    const act = all().filter(c => c.state === 'active');
    const past = act.filter(c => c.date >= from && c.date <= today);
    const arrived = past.filter(c => c.arrived);
    const kg = sumKg(past), ct = sumCt(past);

    const durs = { a: [], b: [], c: [], t: [] };
    past.forEach(c => {
      const st = c.stages || {};
      const r = st.request && st.request.at, ap = st.approved && st.approved.at, op = st.opened && st.opened.at, rl = st.released && st.released.at;
      if (r && ap) durs.a.push(minutesBetween(r, ap));
      if (ap && op) durs.b.push(minutesBetween(ap, op));
      if (op && rl) durs.c.push(minutesBetween(op, rl));
      if (r && rl) durs.t.push(minutesBetween(r, rl));
    });
    const avg = l => (l.length ? l.reduce((s, x) => s + x, 0) / l.length : null);

    const devs = past.filter(c => c.eta_time && c.stages && c.stages.request).map(c => ({
      c, d: minutesBetween(`${c.eta_date || c.date}T${c.eta_time}:00`, c.stages.request.at)
    }));
    const onTime = devs.filter(x => Math.abs(x.d) <= 30).length;

    const evs = (S.data.feed || []).filter(e => e.at.slice(0, 10) >= from && e.at.slice(0, 10) <= today);
    const moves = evs.reduce((s, e) => s + e.moved.length, 0);
    const rems = evs.reduce((s, e) => s + e.removed.length, 0);

    const tiles = [
      ['Konténer', `${past.length}`, `${arrived.length} megérkezett`],
      ['Bruttó súly', fmtT(kg), `${fmtInt(ct)} karton`],
      ['Átlagos átfutás', avg(durs.t) != null ? fmtDur(avg(durs.t)) : '—', 'nyitáskéréstől elengedésig'],
      ['ETA-pontosság', devs.length ? `${Math.round(onTime / devs.length * 100)}%` : '—', devs.length ? `±30 percen belül · ${devs.length} mérés` : 'még nincs mérés'],
      ['Tervváltozás', `${moves + rems}`, `${moves} áthelyezés · ${rems} kikerülés`]
    ].map(([k, v, s]) => `<div class="tile"><dt>${k}</dt><dd>${esc(v)}</dd><span>${esc(s)}</span></div>`).join('');

    return `
      <div class="statsv">
        <dl class="tiles">${tiles}</dl>
        <section class="panel chart" aria-label="Napi érkezések">
          <div class="chart-head"><b>Napi konténerszám</b>
            <span class="lg"><i class="lg-done"></i>Megvalósult</span><span class="lg"><i class="lg-plan"></i>Tervezett</span></div>
          ${dayBars(from, to, act)}
        </section>
        <div class="chart-row">
          <section class="panel chart" aria-label="Átfutási idők">
            <div class="chart-head"><b>Átlagos lépésidők</b></div>
            ${durBars([['Nyitáskérés → Nyitható', durs.a], ['Nyitható → Rakodás', durs.b], ['Rakodás → Elengedve', durs.c], ['Teljes átfutás', durs.t]])}
          </section>
          <section class="panel chart" aria-label="ETA-eltérés">
            <div class="chart-head"><b>Érkezés az ETA-hoz képest</b><span class="chart-sub">perc</span></div>
            ${devDots(devs)}
          </section>
        </div>
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
      return `<g class="bar-hit" data-tip="${esc(tip)}"><rect x="${cx}" y="${T}" width="${bw}" height="${H - T - B}" class="hit"/>${h ? `<rect x="${cx + 1.5}" y="${y(x.n)}" width="${w}" height="${h}" rx="3" class="${cls}"/>` : ''}</g>${lab}`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Napi konténerszám">${grid}${bars}</svg>`;
  }

  function durBars(rows) {
    const vals = rows.map(([, l]) => (l.length ? l.reduce((s, x) => s + x, 0) / l.length : 0));
    const max = Math.max(30, ...vals);
    return `<div class="hbars">${rows.map(([k, l], i) => `
      <div class="hb" data-tip="${esc(`${k}: ${l.length ? fmtDur(vals[i]) : 'nincs adat'} · ${l.length} konténer`)}">
        <span class="hb-k">${esc(k)}</span>
        <span class="hb-track"><i class="${i === rows.length - 1 ? 'tot' : ''}" style="width:${l.length ? Math.max(2, vals[i] / max * 100) : 0}%"></i></span>
        <span class="hb-v">${l.length ? esc(fmtDur(vals[i])) : '—'}</span>
      </div>`).join('')}</div>`;
  }

  function devDots(devs) {
    if (!devs.length) return '<div class="empty">Még nincs olyan konténer, amelynél ETA és nyitáskérés is van.</div>';
    const W = 600, H = 150, M = 24;
    const lim = 240;
    const x = v => M + (W - 2 * M) * ((Math.max(-lim, Math.min(lim, v)) + lim) / (2 * lim));
    let ticks = '';
    [-240, -120, -60, 0, 60, 120, 240].forEach(v => {
      ticks += `<line x1="${x(v)}" x2="${x(v)}" y1="18" y2="${H - 30}" class="${v === 0 ? 'g-zero' : 'g-line'}"/><text x="${x(v)}" y="${H - 10}" class="g-lab" text-anchor="middle">${v > 0 ? '+' : ''}${v}</text>`;
    });
    const rows = {};
    const dots = devs.map(({ c, d }) => {
      const bx = Math.round(x(d) / 10);
      rows[bx] = (rows[bx] || 0) + 1;
      const cy = H - 40 - (rows[bx] - 1) * 14;
      const cls = Math.abs(d) <= 30 ? 'd-ok' : d > 0 ? 'd-late' : 'd-early';
      return `<circle cx="${x(d)}" cy="${Math.max(24, cy)}" r="6" class="${cls}" data-tip="${esc(`${c.id} · ETA ${c.eta_time} · ${d > 0 ? '+' : ''}${Math.round(d)} perc`)}"/>`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="ETA-eltérés">${ticks}${dots}</svg>
      <div class="dev-legend"><span><i class="d-early"></i>korábban</span><span><i class="d-ok"></i>±30 perc</span><span><i class="d-late"></i>később</span></div>`;
  }

  // ---------- konténer oldalnézet (40' HC) ----------
  function containerSvg(c, opts = {}) {
    const id = (c.id || '').replace(/\s/g, '');
    const owner = id.slice(0, 4), serial = id.slice(4, 10), check = id.slice(10, 11);
    const kgTxt = c.kg ? `${fmtInt(c.kg)} KG` : '';
    const ctTxt = c.ctns ? `${fmtInt(c.ctns)} CTN` : '';
    const ribs = [];
    for (let x = 22; x < 384; x += 7) ribs.push(`<line x1="${x}" y1="13" x2="${x}" y2="83"/>`);
    return `
      <svg class="ct ct-${c.status}${opts.cls ? ' ' + opts.cls : ''}" viewBox="0 0 400 96" role="img" aria-label="${esc(id)}" preserveAspectRatio="xMidYMid meet">
        <rect class="ct-body" x="2" y="6" width="396" height="84" rx="2"/>
        <g class="ct-ribs">${ribs.join('')}</g>
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
          <text x="26" y="45" class="ct-id">${esc(owner)}</text>
          <text x="102" y="45" class="ct-id">${esc(serial)}</text>
          ${check ? `<rect class="ct-chk" x="204" y="24" width="20" height="27" rx="1.5"/><text x="214" y="45" class="ct-id" text-anchor="middle">${esc(check)}</text>` : ''}
          <text x="26" y="71" class="ct-sub">${esc(kgTxt)}</text>
          <text x="142" y="71" class="ct-sub">${esc(ctTxt)}</text>
        </g>
      </svg>`;
  }

  function fleet(d, list) {
    if (!list.length) return '';
    const cards = list.map(c => {
      const etaCls = c.status === 'arrived' ? 'done' : (c.eta_time ? 'set' : 'none');
      const etaTxt = c.status === 'arrived' ? 'Megérkezett' : (c.eta_time || 'ETA ?');
      const late = lateInfo(c);
      const moved = c.moved_from && c.moved_from !== c.date ? `<span class="cc-moved">${short(c.moved_from)} → ${short(c.date)}</span>` : '';
      return `
        <button type="button" class="ccard${late ? ' is-late' : ''}" data-action="open" data-id="${esc(c.id)}">
          ${containerSvg(c)}
          <span class="cc-top">
            <span class="cc-w"><b>${fmtDec((c.kg || 0) / 1000, 1, 1)}</b><small>t</small></span>
            <span class="cc-eta cc-eta-${etaCls}">${esc(etaTxt)}</span>
          </span>
          <span class="cc-sub">${fmtInt(c.ctns)} karton · ${c.pdd.length} PDD${moved}</span>
          <span class="cc-plate ${c.plate ? '' : 'dim'}">${c.plate ? esc(plate(c.plate)) : 'kamion még nincs'}</span>
          ${c.arrived ? `<span class="cc-flow">${miniSteps(c)}<span class="cc-stage">${esc(STAGE_LABEL[c.stage] || 'Megérkezett')}</span>${c.ramp ? `<span class="ramp-chip">R${c.ramp}</span>` : ''}</span>` : ''}
          ${late ? `<span class="cc-late">${IC.warn}${esc(late.label)}</span>` : ''}
        </button>`;
    }).join('');
    return `
      <section class="fleet" aria-label="Érkező konténerek">
        <div class="fleet-grid">${cards}</div>
      </section>`;
  }

  function dayPanel() {
    const d = S.sel;
    const list = onDay(d);
    const withTruck = list.filter(c => c.plate || c.t1).length;
    const withEta = list.filter(c => c.eta_time).length;
    return `
      <main class="main">
        <div class="dayhead">
          <div class="title-row"><h1>${DOW[dowIdx(d)]}</h1><span class="sub">${longLabel(d)}</span></div>
          <dl class="stats">
            <div><dt>Konténer</dt><dd>${list.length}</dd></div>
            <div><dt>Bruttó súly</dt><dd>${fmtInt(sumKg(list))} <small>kg</small></dd></div>
            <div><dt>Karton</dt><dd>${fmtInt(sumCt(list))}</dd></div>
            <div><dt>Kamion + T1</dt><dd>${withTruck}<span class="of"> / ${list.length}</span></dd></div>
            <div><dt>ETA</dt><dd>${withEta}<span class="of"> / ${list.length}</span></dd></div>
            <div><dt>Megérkezett</dt><dd>${list.filter(c => c.arrived).length}<span class="of"> / ${list.length}</span></dd></div>
            ${list.some(c => lateInfo(c)) ? `<div class="st-late"><dt>Késik</dt><dd>${list.filter(c => lateInfo(c)).length}</dd></div>` : ''}
          </dl>
        </div>
        <div class="cols">
          <div class="col-main">
            ${rampStrip(d, list)}
            ${fleet(d, list)}
            ${timeline(d, list)}
            ${table(d, list)}
            ${removedBlock(d)}
          </div>
          ${feed()}
        </div>
      </main>`;
  }

  function timeline(d, list) {
    const timed = list.filter(c => c.eta_time).sort((a, b) => (a.eta_time < b.eta_time ? -1 : 1));
    const hs = timed.map(c => toH(c.eta_time));
    const lo = Math.max(0, Math.min(6, Math.floor(Math.min(...hs, 24))));
    const hi = Math.min(24, Math.max(20, Math.ceil(Math.max(...hs, 0) + 1)));
    const pos = h => (h - lo) / (hi - lo) * 100;
    const span = 15;
    const lanes = [];
    const pills = timed.map(c => {
      const p = pos(toH(c.eta_time));
      let lane = lanes.findIndex(end => end <= p);
      if (lane < 0) { lane = lanes.length; lanes.push(0); }
      lanes[lane] = p + span;
      const left = Math.min(p, 84);
      return `<button type="button" class="pill pill-${c.status === 'arrived' ? 'arrived' : 'eta'}" style="left:${left}%;top:${6 + lane * 44}px" data-action="open" data-id="${esc(c.id)}"><b>${esc(c.eta_time)}</b><span>${esc(c.id)}</span></button>`;
    }).join('');
    const h = Math.max(1, lanes.length) * 44 + 34;
    let ticks = '';
    for (let x = lo; x <= hi; x++) {
      const major = x % 2 === 0;
      ticks += `<div class="tl-tick ${major ? 'major' : ''}" style="left:${pos(x)}%"></div>`;
      if (major) ticks += `<span class="tl-lab" style="left:${pos(x)}%">${pad(x)}</span>`;
    }
    let now = '';
    if (d === S.today) {
      const n = new Date();
      const nh = n.getHours() + n.getMinutes() / 60;
      if (nh >= lo && nh <= hi) now = `<div class="tl-now" style="left:${pos(nh)}%"></div><span class="tl-now-lab" style="left:${pos(nh)}%">${pad(n.getHours())}:${pad(n.getMinutes())}</span>`;
    }
    const noEta = list.filter(c => !c.eta_time && c.status !== 'arrived');
    return `
      <section class="panel timeline" aria-label="Idővonal">
        <div class="tl-track"><div class="tl-area" style="height:${h}px">${ticks}${now}${pills}${timed.length ? '' : '<div class="tl-empty">Nincs rögzített ETA</div>'}</div></div>
        <div class="tray">
          <div class="tray-head"><span>ETA nélkül</span><span class="mono">${noEta.length}</span></div>
          <div class="tray-list">${noEta.map(c => `<button type="button" class="tray-item" data-action="open" data-id="${esc(c.id)}"><span>${esc(c.id)}</span><span>${fmtT(c.kg)}</span></button>`).join('') || '<span class="dim" style="font-size:13px">—</span>'}</div>
        </div>
      </section>`;
  }

  function table(d, list) {
    const rows = list.map(c => {
      const flags = [];
      if (c.moved_from && c.moved_from !== c.date) flags.push(`<div class="flag">${IC.arrow}${short(c.moved_from)} → ${short(c.date)}</div>`);
      if (c.eta_stale) flags.push(`<div class="flag warn">${IC.warn}ETA korábbi napra</div>`);
      const lt = lateInfo(c);
      if (lt) flags.push(`<div class="flag late">${IC.warn}${esc(lt.label)}</div>`);
      const drv = [c.driver, c.phone].filter(Boolean).join(' · ');
      return `
        <div class="tr row">
          <div><button type="button" class="cid" data-action="open" data-id="${esc(c.id)}">${esc(c.id)}</button><div class="sub2">${c.pdd.length} PDD</div></div>
          <div><div class="cell-mono ${c.plate ? '' : 'dim'}">${c.plate ? esc(plate(c.plate)) : 'várható'}</div>${drv ? `<div class="sub2">${esc(drv)}</div>` : ''}</div>
          <span class="cell-mono ${c.t1 ? '' : 'dim'}" style="font-size:12.5px">${esc(c.t1 || '—')}</span>
          <span class="cell-mono r">${fmtInt(c.ctns)}</span>
          <span class="cell-mono r">${fmtInt(c.kg)}</span>
          <input type="time" class="eta ${c.eta_time ? 'set' : ''}" value="${esc(c.eta_time)}" data-eta="${esc(c.id)}" aria-label="ETA ${esc(c.id)}" ${c.status === 'arrived' ? 'disabled' : ''}>
          <div><div class="st st-${c.status}"><i aria-hidden="true"></i>${c.arrived && c.stage ? esc(STAGE_LABEL[c.stage]) : ST_LABEL[c.status]}${c.ramp ? ` <span class="ramp-chip">R${c.ramp}</span>` : ''}</div>${flags.join('')}</div>
        </div>`;
    }).join('');
    const emptyText = hasForecast(d) ? 'Erre a napra nincs bejelentett konténer.' : 'Erre a napra még nem jött előrejelzés.';
    return `
      <section class="panel" aria-label="Konténerek">
        ${list.length ? `<div class="tbl-scroll"><div class="tbl">
          <div class="tr head"><span>Konténer</span><span>Rendszám · sofőr</span><span>T1 / MRN</span><span class="r">Karton</span><span class="r">Súly (kg)</span><span>ETA</span><span>Állapot</span></div>
          ${rows}
        </div></div>` : `<div class="empty">${emptyText}</div>`}
      </section>`;
  }

  function removedBlock(d) {
    const rm = removedOn(d);
    if (!rm.length) return '';
    const when = [...new Set(rm.map(c => c.removed_at))].sort().pop();
    return `
      <section class="removed" aria-label="Kikerült a tervből">
        <div class="removed-head"><b>Kikerült a tervből</b><span>${esc(stamp(when))}</span></div>
        <div class="chips">${rm.map(c => `<button type="button" class="chip" data-action="open" data-id="${esc(c.id)}"><s>${esc(c.id)}</s><span>${fmtT(c.kg)}</span></button>`).join('')}</div>
      </section>`;
  }

  function feedEntry(ev) {
    const d = ev.dates[0];
    const before = ev.before[d] || 0, after = ev.after[d] || 0;
    const movedIn = ev.moved.filter(m => m.to === d);
    const added = ev.added.length + movedIn.length;
    const rem = ev.removed.length;
    let tag, cls = 'chg';
    if (before === 0 && ev.added.length === after && after > 0) tag = 'Új';
    else if (rem && added) tag = `+${added} / −${rem}`;
    else if (before !== after) tag = `${before} → ${after}`;
    else if (ev.t1.length) { tag = 'T1'; cls = 't1'; }
    else { tag = '='; cls = 'same'; }
    const list = ids => ids.slice(0, 3).join(', ') + (ids.length > 3 ? ` +${ids.length - 3}` : '');
    const parts = [];
    if (tag === 'Új') parts.push(`${after} konténer bejelentve`);
    else if (ev.added.length) parts.push(`Új: ${list(ev.added)}`);
    const froms = {};
    movedIn.forEach(m => { (froms[m.from] = froms[m.from] || []).push(m.id); });
    Object.keys(froms).forEach(f => parts.push(`${froms[f].length} db áthelyezve ide (korábban ${short(f)})`));
    if (rem) parts.push(`Kikerült: ${list(ev.removed)}`);
    if (ev.t1.length) parts.push(`T1: ${list(ev.t1)}`);
    if (!parts.length) parts.push('Változatlan lista');
    const target = ev.dates.map(x => `${DOW[dowIdx(x)]}, ${short(x)}`).join(' · ');
    return `
      <li><button type="button" class="feed-item" data-action="goto" data-date="${d}">
        <div class="feed-when">${short(ev.at.slice(0, 10))}<br>${hm(ev.at)}</div>
        <div><div class="feed-target"><span>${esc(target)}</span><span class="tag tag-${cls}">${esc(tag)}</span></div>
        <div class="feed-text">${esc(parts.join(' · '))}</div></div>
      </button></li>`;
  }

  function feed() {
    const evs = (S.data.feed || []).filter(e => e.dates && e.dates.length);
    return `
      <aside class="feed" aria-label="Változások">
        <div class="feed-head"><b>Változások</b><span>${S.data.message_count} levél</span></div>
        ${evs.length ? `<ol>${evs.slice(0, 40).map(feedEntry).join('')}</ol>` : '<div class="feed-empty" style="margin-top:14px">Még nincs beolvasott levél.</div>'}
      </aside>`;
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

    const cells = days.map(d => {
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
        <button type="button" class="cell ${nodata ? 'nodata' : ''}" style="background-color:${bg}" data-action="cell" data-date="${d}" aria-pressed="${d === S.calSel}" aria-label="${longLabel(d)}, ${list.length} konténer">
          <div class="cell-top"><span class="cell-num ${numCls}">${parse(d).getDate()}</span>${list.length ? `<span class="cell-count">${list.length} db</span>` : ''}</div>
          <div class="pips">${list.map(c => `<i class="pip pip-${c.status}"></i>`).join('')}</div>
          ${list.length ? `<div class="cell-foot"><div class="bar"><i class="${d < S.today ? 'past' : ''}" style="width:${Math.round(r * 100)}%"></i></div><div class="cell-t">${fmtT(kg)}</div></div>` : ''}
        </button>`;
    }).join('');

    const m = parse(first);
    return `
      <div class="month">
        <section class="month-main" aria-label="Havi naptár">
          <div class="month-head">
            <h1>${MON[m.getMonth()].replace(/^./, ch => ch.toUpperCase())} <span>${m.getFullYear()}</span></h1>
            <div class="month-sum"><span><b>${mN}</b> db</span><span><b>${fmtT(mKg)}</b></span></div>
          </div>
          <div class="tbl-scroll"><div class="panel cal">
            <div class="cal-dow">${DOW.map(x => `<span>${x}</span>`).join('')}</div>
            <div class="cal-grid">${cells}</div>
          </div></div>
        </section>
        ${monthSide()}
      </div>`;
  }

  function monthSide() {
    const d = S.calSel;
    const list = onDay(d);
    const rows = list.map(c => {
      const etaCls = c.status === 'arrived' ? 'arrived' : (c.eta_time ? 'eta' : '');
      return `
        <button type="button" class="side-item" data-action="open" data-id="${esc(c.id)}">
          <span class="side-l"><i class="pip-${c.status}" aria-hidden="true"></i><span style="min-width:0"><span class="mono" style="display:block">${esc(c.id)}</span><span class="sub2" style="display:block">${esc(c.plate ? plate(c.plate) : 'rendszám nélkül')} · ${fmtInt(c.kg)} kg</span></span></span>
          <span class="side-eta ${etaCls}">${esc(c.eta_time || '—')}</span>
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
          <div class="title-row"><h2>${DOW[dowIdx(d)]}</h2><span class="sub">${longLabel(d)}</span></div>
          <div class="side-stats">
            <span><b>${list.length}</b> db</span>
            <span><b>${fmtInt(sumKg(list))}</b> kg</span>
            <span><b>${fmtInt(sumCt(list))}</b> karton</span>
            <span>ETA <b>${list.filter(c => c.eta_time).length}</b>/${list.length}</span>
          </div>
          <div class="side-list">${rows || `<div class="side-empty">${hasForecast(d) ? 'Nincs érkezés.' : 'Nincs előrejelzés.'}</div>`}</div>
          <button type="button" class="go" data-action="goto" data-date="${d}">Heti nézet${IC.go}</button>
        </div>
        <div class="weekbars">
          <div class="weekbars-head"><b>${isoWeek(wk)}. hét</b><span>${wn} db · ${fmtT(wl.reduce((a, b) => a + b, 0))}</span></div>
          ${wd.map((x, i) => `<div class="wb"><span>${DOW_S[i]}</span><div class="wb-track"><i class="${x < S.today ? 'past' : ''}" style="width:${Math.round(wl[i] / wmax * 100)}%"></i></div><span>${wl[i] ? fmtT(wl[i]) : '—'}</span></div>`).join('')}
        </div>
      </aside>`;
  }

  // ---------- adatlap ----------
  function histRow(h) {
    switch (h.kind) {
      case 'first': return ['Első bejelentés', '', `<span class="h-v">${short(h.date)}</span>`, ''];
      case 'listed': return [`Frissített lista · ${h.count} konténer`, 'ink', `<span class="h-v">${short(h.date)}</span>`, ''];
      case 'moved': return [h.back ? 'Visszakerült a tervbe' : 'Áthelyezve', 'or', `<span class="h-v or">${h.from ? `<s>${short(h.from)}</s> ` : ''}${short(h.to)}</span>`, 'hl move'];
      case 'removed': return ['Kikerült a tervből', 'rm', `<span class="h-v"><s>${short(h.from)}</s></span>`, 'hl rem'];
      case 'truck': return ['T1 és kamion', 'st', `<span class="h-v">${esc(plate(h.plate) || h.t1)}</span>`, 'hl truck'];
      case 'changed': return [h.field === 'plate' ? 'Rendszám módosult' : 'T1 módosult', 'or', `<span class="h-v">${esc(h.field === 'plate' ? plate(h.to) : h.to)}</span>`, ''];
      case 'weight': return ['Súly módosult', 'or', `<span class="h-v">${fmtInt(h.to)} kg</span>`, ''];
      case 'arrival': return ['Nyitáskérés', 'ink', `<span class="h-v">${esc(h.sender)}</span>`, 'hl arr'];
      case 'stage': return h.stage === 'other'
        ? [`Válasz · ${esc(h.sender)}`, '', `<span class="h-v h-snip">${esc(h.snippet)}</span>`, '']
        : [esc(STAGE_LABEL[h.stage]), 'st', `<span class="h-v">${esc(h.sender)}</span>`, 'hl arr'];
      default: return [esc(h.kind), '', '', ''];
    }
  }

  function renderDrawer() {
    const root = $('#drawer');
    const c = S.drawer && S.data.containers[S.drawer];
    if (!c) { S.drawer = null; root.innerHTML = ''; return; }
    const dayList = c.state === 'active' ? onDay(c.day) : removedOn(c.removed_from);
    const idx = dayList.findIndex(x => x.id === c.id);
    const refDay = c.state === 'active' ? c.day : c.removed_from;
    const statusBadge = {
      pre: '<span class="badge b-pre">Bejelentve</span>',
      t1: '<span class="badge b-t1">Kamion + T1</span>',
      eta: `<span class="badge b-eta">ETA · ${esc(c.eta_time)}</span>`,
      arrived: `<span class="badge b-arrived">${IC.check}Megérkezett${c.arrived_at ? ' · ' + esc(stamp(c.arrived_at)) : ''}${c.arrived_auto ? ' · nyitáskérés' : ''}</span>`,
      removed: '<span class="badge b-removed">Kikerült a tervből</span>'
    }[c.status];
    const where = [c.port, c.customs].filter(Boolean).join(' · ');
    const moved = c.moved_from && c.moved_from !== c.date ? `<span class="badge b-move">${IC.arrow}${short(c.moved_from)} → ${short(c.date)}</span>` : '';
    const pddRows = c.pdd.map(p => `<div class="tr2"><span>${esc(p.no || '—')}</span><span class="r">${fmtKg(p.kg)}</span><span class="r">${fmtInt(p.ctns)}</span></div>`).join('');
    const files = (c.files || []).map(f => `
      <button type="button" class="file" data-action="file" data-path="${esc(f.path)}">
        <span class="file-ic" aria-hidden="true">T1</span>
        <span class="file-txt"><b>${esc(f.name)}</b><span>${esc(stamp(f.at))} · ${Math.max(1, Math.round((f.size || 0) / 1024))} kB</span></span>
        ${IC.open}
      </button>`).join('');
    const hist = c.history.slice().reverse().slice(0, 16).map(h => {
      const [t, dot, v, cls] = histRow(h);
      return `<li class="${cls}"><span class="hd ${dot}" aria-hidden="true"></span><div><div class="h-t">${t}</div><div class="h-at">${esc(stamp(h.at))}</div></div>${v}</li>`;
    }).join('');
    const etaDate = c.eta_date || c.date;
    const active = c.state === 'active';

    root.innerHTML = `
      <div class="scrim" data-action="close"></div>
      <aside class="sheet" role="dialog" aria-modal="true" aria-label="${esc(c.id)}">
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
          <div class="badges">${statusBadge}${moved}${where ? `<span class="badge b-out">${esc(where)}</span>` : ''}</div>
          <div class="corrugate" aria-hidden="true"></div>
        </div>
        <div class="sheet-body">
          <dl class="facts">
            <div><dt>Rendszám</dt><dd>${c.plate ? esc(plate(c.plate)) : '<span class="dim">várható</span>'}</dd></div>
            <div><dt>T1 / MRN</dt><dd>${c.t1 ? esc(c.t1) : '<span class="dim">várható</span>'}</dd></div>
            <div><dt>Bruttó súly</dt><dd>${fmtKg(c.kg)} kg</dd></div>
            <div><dt>Karton</dt><dd>${fmtInt(c.ctns)}</dd></div>
            <div><dt>Szállítási nap</dt><dd>${c.date ? `${c.date.replace(/-/g, '.')}.` : '—'}<small>${c.date ? DOW[dowIdx(c.date)] : ''}</small></dd></div>
            <div><dt>Sofőr</dt><dd class="plain">${c.driver ? esc(c.driver) : '<span class="dim">nincs megadva</span>'}${c.phone ? `<small>${esc(c.phone)}</small>` : ''}</dd></div>
          </dl>

          ${c.pdd.length ? `<section class="panel pdd" aria-label="PDD tételek"><div class="tr2 head"><span>PDD</span><span class="r">kg</span><span class="r">karton</span></div>${pddRows}</section>` : ''}

          ${files ? `<div class="files">${files}</div>` : ''}

          ${active && (c.arrived || c.stage) ? stepper(c) : ''}
          ${active && (c.arrived || c.ramp) ? rampPicker(c) : ''}
          ${active && lateInfo(c) ? `<div class="late-box">${IC.warn}<span>${esc(lateInfo(c).label)}${c.eta_time ? ` · ETA ${esc(c.eta_time)}` : ''}</span></div>` : ''}

          ${active ? `
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
              <button type="button" class="btn-ghost ${c.arrived ? 'on' : ''}" data-action="arrived" aria-pressed="${c.arrived}">${c.arrived ? IC.check + ' ' : ''}Megérkezett</button>
            </div>
          </section>` : ''}

          <section aria-label="Előzmények">
            <div class="hist-title">Előzmények</div>
            <div class="hist"><ol>${hist}</ol></div>
          </section>

          <label class="note">Megjegyzés
            <textarea id="note" rows="3" data-id="${esc(c.id)}">${esc(c.note)}</textarea>
          </label>
        </div>
      </aside>`;
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

  function renderPaste() {
    const items = parseEtas($('#paste-text').value);
    $('#paste-save').disabled = !items.length;
    $('#paste-list').innerHTML = items.map(it => {
      const c = S.data.containers[it.container];
      const day = c && c.state === 'active' ? `${DOW[dowIdx(c.date)]}, ${short(c.date)}` : 'nincs a tervben';
      return `<div class="pl-row"><span>${esc(it.container)}</span><span class="pl-day ${c && c.state === 'active' ? '' : 'unk'}">${esc(day)}</span><b>${esc(it.time)}</b></div>`;
    }).join('');
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
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }

  function nav(step) {
    if (S.view === 'week') {
      S.week = addDays(S.week, step * 7);
      S.sel = addDays(S.sel, step * 7);
      S.anim = true;
    } else {
      const d = parse(S.month + '-01');
      d.setMonth(d.getMonth() + step);
      S.month = iso(d).slice(0, 7);
      if (S.calSel.slice(0, 7) !== S.month) S.calSel = S.month + '-01';
    }
    render();
  }

  function goToday() {
    S.today = iso(new Date());
    S.sel = S.today; S.week = mondayOf(S.today);
    S.month = S.today.slice(0, 7); S.calSel = S.today;
    S.anim = true;
    render();
  }

  async function saveEta(id, d, t) {
    const c = S.data.containers[id];
    if (!c) return false;
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

  function inviteUrl(key) {
    return `${(window.KF_CONFIG && window.KF_CONFIG.site) || (location.origin + location.pathname)}#k=${key}`;
  }

  function showLink(name, key) {
    const box = $('#newpw');
    const url = inviteUrl(key);
    box.hidden = false;
    box.innerHTML = `<span>${esc(name)} személyes linkje:</span><code class="link">${esc(url)}</code><button type="button" class="u-btn" data-action="copy-pw" data-pw="${esc(url)}">Másolás</button>`;
  }

  async function loadUsers() {
    const ul = $('#users');
    const { data, error } = await sb.from('members').select('email, role, name').order('name');
    if (error) { ul.innerHTML = ''; return; }
    ul.innerHTML = data.map(u => `
      <li>
        <span class="u-mail">${esc(u.name || u.email)}</span>
        <span class="u-role">${u.role === 'admin' ? 'Admin' : 'Szerkesztő'}</span>
        ${u.role === 'admin' ? '' : `
          <button type="button" class="u-btn" data-action="user-link" data-email="${esc(u.email)}" data-name="${esc(u.name || '')}">Új link</button>
          <button type="button" class="u-btn danger" data-action="user-remove" data-email="${esc(u.email)}">Eltávolítás</button>`}
      </li>`).join('');
  }

  async function openSettings() {
    $('#me').innerHTML = `${esc(ME.name || ME.email)}<span>${ME.role === 'admin' ? 'Admin' : 'Szerkesztő'}</span>`;
    $('#users-sec').hidden = ME.role !== 'admin';
    $('#yard-sec').hidden = ME.role !== 'admin';
    $('#ramp-count').value = RAMPS;
    $('#newpw').hidden = true;
    $('#outlook-sec').hidden = !isExe();
    if (ME.role === 'admin') loadUsers();
    if (isExe()) {
      const s = await exe().get_settings();
      const f = $('#outlook-form');
      f.sender.value = s.sender || '';
      f.subject_hint.value = s.subject_hint || '';
      f.interval_min.value = s.interval_min || 10;
      f.autostart.checked = !!s.autostart;
    }
    $('#settings').showModal();
  }

  document.addEventListener('click', async e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const a = el.dataset.action;
    switch (a) {
      case 'view': S.view = el.dataset.view; if (S.view === 'month') { S.month = S.sel.slice(0, 7); S.calSel = S.sel; } else { S.anim = true; } render(); break;
      case 'prev': nav(-1); break;
      case 'next': nav(1); break;
      case 'today': goToday(); break;
      case 'day': S.sel = el.dataset.date; render(); break;
      case 'cell': S.calSel = el.dataset.date; render(); break;
      case 'goto': S.view = 'week'; S.sel = el.dataset.date; S.week = mondayOf(S.sel); S.anim = true; S.drawer = null; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'open': S.drawer = el.dataset.id; renderDrawer(); break;
      case 'close': S.drawer = null; renderDrawer(); break;
      case 'dstep': {
        const c = S.data.containers[S.drawer];
        const list = c.state === 'active' ? onDay(c.day) : removedOn(c.removed_from);
        const i = list.findIndex(x => x.id === c.id) + Number(el.dataset.step);
        if (list[i]) { S.drawer = list[i].id; renderDrawer(); }
        break;
      }
      case 'refresh':
        if (isExe()) {
          LOCAL = { ...(LOCAL || {}), busy: true };
          renderSync();
          await exe().refresh();
        } else {
          await loadAll();
          toast('Frissítve');
        }
        break;
      case 'settings': openSettings(); break;
      case 'stats-range': S.statsDays = Number(el.dataset.days); render(); break;
      case 'qopen': {
        const c = S.data.containers[el.dataset.id];
        $('#q').value = ''; renderSearch();
        if (c) {
          const day = c.state === 'active' ? c.day : c.removed_from;
          if (day) { S.view = 'week'; S.sel = day; S.week = mondayOf(day); }
          S.drawer = c.id;
          render();
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
      case 'paste': $('#paste-text').value = ''; renderPaste(); $('#paste').showModal(); setTimeout(() => $('#paste-text').focus(), 30); break;
      case 'paste-close': $('#paste').close(); break;
      case 'paste-save': await savePaste(); break;
      case 'settings-close': $('#settings').close(); break;
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
        if (await saveEta(S.drawer, d, t)) toast(t ? 'ETA mentve' : 'ETA törölve');
        break;
      }
      case 'clear-eta': if (await saveEta(S.drawer, '', '')) toast('ETA törölve'); break;
      case 'arrived': {
        const c = S.data.containers[S.drawer];
        if (c.arrived_auto) {
          await upsertManual({ container: c.id, auto_dismissed: true, arrived: false, arrived_at: null });
        } else if (c.arrived) {
          await upsertManual({ container: c.id, arrived: false, arrived_at: null, auto_dismissed: !!c.auto_arrival });
        } else {
          await upsertManual({ container: c.id, arrived: true, arrived_at: new Date().toISOString() });
        }
        break;
      }
      case 'copy-pw':
        try { await navigator.clipboard.writeText(el.dataset.pw); toast('Link másolva'); } catch (_) { /* kijelölhető marad */ }
        break;
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

  document.addEventListener('change', e => {
    const el = e.target;
    if (el.matches('input.eta[data-eta]')) {
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
    if (!e.target.closest('.search')) { const b = $('#qres'); if (b && !b.hidden) { b.hidden = true; } }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.activeElement === $('#q')) { $('#q').value = ''; renderSearch(); return; }
    if (e.key === 'Escape' && S.drawer && !$('#settings').open) { S.drawer = null; renderDrawer(); }
  });

  $('#settings').addEventListener('close', () => {
    if (S.pending) { rebuild(); render(); }
  });
  $('#paste').addEventListener('close', () => {
    if (S.pending) { rebuild(); render(); }
  });

  // ---------- űrlapok ----------
  $('#user-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#user-name').value.trim();
    if (!name) return;
    try {
      const r = await usersFn('invite', { name });
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

  $('#yard-form').addEventListener('submit', async e => {
    e.preventDefault();
    const n = Math.max(1, Math.min(99, Number($('#ramp-count').value) || 10));
    const { error } = await sb.from('app_settings').update({ ramp_count: n, updated_at: new Date().toISOString() }).eq('id', 1);
    if (error) { toast('A mentés nem sikerült'); return; }
    RAMPS = n;
    toast(`Rámpák száma: ${n}`);
    render();
  });

  $('#outlook-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    await exe().save_settings({ sender: f.sender.value, subject_hint: f.subject_hint.value, interval_min: f.interval_min.value, autostart: f.autostart.checked });
    toast('Beállítások mentve');
  });

  setInterval(() => {
    if (!S.data) return;
    window.KF.reload();
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
