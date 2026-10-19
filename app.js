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
  const S = { data: null, view: 'week', week: null, sel: null, month: null, calSel: null, drawer: null, anim: false, pending: false, today: null };
  const CFG = window.KF_CONFIG;
  const sb = window.supabase.createClient(CFG.url, CFG.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  let ME = null;
  let MSGS = [];
  let MAN = {};
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
    note: r.note || '', updated_by: r.updated_by || '', updated_at: toLocal(r.updated_at)
  });

  function rebuild() {
    const d = window.KFDerive(MSGS, MAN);
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
    const [msgs, man, sync] = await Promise.all([
      fetchAll('messages', 'received'),
      fetchAll('manual'),
      sb.from('sync_status').select('*').eq('id', 1).maybeSingle()
    ]);
    MSGS = msgs.map(normMsg);
    MAN = Object.fromEntries(man.map(r => [r.container, normMan(r)]));
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
    $('#login-form').hidden = mode !== 'login';
    $('#boot-form').hidden = mode !== 'boot';
    $('#denied').hidden = mode !== 'denied';
    $('#auth-loading').hidden = mode !== 'loading';
    if (mode === 'denied') $('#denied-text').textContent = `${info} nincs a felhasználók között. Kérj hozzáférést az admintól.`;
    const first = mode === 'login' ? '#login-email' : mode === 'boot' ? '#boot-email' : null;
    if (first) setTimeout(() => $(first).focus(), 30);
  }

  async function enter(session) {
    const email = (session.user.email || '').toLowerCase();
    const { data, error } = await sb.from('members').select('email, role').eq('email', email).maybeSingle();
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
      const { data: { session } } = await sb.auth.getSession();
      if (session) { await enter(session); return; }
      if (await waitExe(2500)) {
        const r = await exe().auto_login();
        if (r && r.token_hash) {
          const { data, error } = await sb.auth.verifyOtp({ token_hash: r.token_hash, type: 'email' });
          if (!error && data.session) { await enter(data.session); return; }
        }
      }
      const st = await usersFn('status');
      showAuth(st.initialized ? 'login' : 'boot');
    } catch (e) {
      console.error(e);
      showAuth('login');
      $('#login-err').textContent = 'A szerver nem érhető el. Ellenőrizd az internetkapcsolatot.';
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
    $('#view').innerHTML = S.view === 'week' ? weekView() : monthView();
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
      <button type="button" class="tbtn" data-action="paste">ETA beillesztése</button>`;
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
        <div class="blk blk-${c.status}" style="height:${Math.max(minH, Math.round(c.kg * k))}px;animation-delay:${(arr.length - 1 - j) * 45}ms">
          <span>${esc(c.id)}</span><span>${esc(c.eta_time || (c.ctns ? c.ctns + ' ctn' : ''))}</span>
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
          </dl>
        </div>
        <div class="cols">
          <div class="col-main">
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
      const drv = [c.driver, c.phone].filter(Boolean).join(' · ');
      return `
        <div class="tr row">
          <div><button type="button" class="cid" data-action="open" data-id="${esc(c.id)}">${esc(c.id)}</button><div class="sub2">${c.pdd.length} PDD</div></div>
          <div><div class="cell-mono ${c.plate ? '' : 'dim'}">${c.plate ? esc(plate(c.plate)) : 'várható'}</div>${drv ? `<div class="sub2">${esc(drv)}</div>` : ''}</div>
          <span class="cell-mono ${c.t1 ? '' : 'dim'}" style="font-size:12.5px">${esc(c.t1 || '—')}</span>
          <span class="cell-mono r">${fmtInt(c.ctns)}</span>
          <span class="cell-mono r">${fmtInt(c.kg)}</span>
          <input type="time" class="eta ${c.eta_time ? 'set' : ''}" value="${esc(c.eta_time)}" data-eta="${esc(c.id)}" aria-label="ETA ${esc(c.id)}" ${c.status === 'arrived' ? 'disabled' : ''}>
          <div><div class="st st-${c.status}"><i aria-hidden="true"></i>${ST_LABEL[c.status]}</div>${flags.join('')}</div>
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
      arrived: `<span class="badge b-arrived">${IC.check}Megérkezett${c.arrived_at ? ' · ' + esc(stamp(c.arrived_at)) : ''}</span>`,
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
          <div class="sheet-id">${esc(c.id)}</div>
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

          ${active ? `
          <section class="etabox" aria-label="Pontos ETA">
            <div class="etabox-head"><b>Pontos ETA</b>${c.eta_time && c.eta_set ? `<span class="saved">${IC.check}Mentve · ${esc(stamp(c.eta_set))}</span>` : ''}</div>
            ${c.updated_by ? `<div class="editor">Utoljára módosította: ${esc(c.updated_by)} · ${esc(stamp(c.updated_at))}</div>` : ''}
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

  function tempPassword() {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const buf = new Uint32Array(12);
    crypto.getRandomValues(buf);
    return Array.from(buf, n => abc[n % abc.length]).join('');
  }

  function showNewPw(email, pw) {
    const box = $('#newpw');
    box.hidden = false;
    box.innerHTML = `<span>${esc(email)} jelszava:</span><code>${esc(pw)}</code><button type="button" class="u-btn" data-action="copy-pw" data-pw="${esc(pw)}">Másolás</button>`;
  }

  async function loadUsers() {
    const ul = $('#users');
    const { data, error } = await sb.from('members').select('email, role').order('email');
    if (error) { ul.innerHTML = ''; return; }
    ul.innerHTML = data.map(u => `
      <li>
        <span class="u-mail">${esc(u.email)}</span>
        <span class="u-role">${u.role === 'admin' ? 'Admin' : 'Szerkesztő'}</span>
        ${u.email === ME.email ? '' : `
          <button type="button" class="u-btn" data-action="user-pw" data-email="${esc(u.email)}">Új jelszó</button>
          <button type="button" class="u-btn danger" data-action="user-remove" data-email="${esc(u.email)}">Eltávolítás</button>`}
      </li>`).join('');
  }

  async function openSettings() {
    $('#me').innerHTML = `${esc(ME.email)}<span>${ME.role === 'admin' ? 'Admin' : 'Szerkesztő'}</span>`;
    $('#users-sec').hidden = ME.role !== 'admin';
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
        const on = !c.arrived;
        await upsertManual({ container: c.id, arrived: on, arrived_at: on ? new Date().toISOString() : null });
        break;
      }
      case 'copy-pw':
        try { await navigator.clipboard.writeText(el.dataset.pw); toast('Jelszó másolva'); } catch (_) { /* kijelölhető marad */ }
        break;
      case 'user-pw': {
        const pw = tempPassword();
        try { await usersFn('set_password', { email: el.dataset.email, password: pw }); showNewPw(el.dataset.email, pw); }
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

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && S.drawer && !$('#settings').open) { S.drawer = null; renderDrawer(); }
  });

  $('#settings').addEventListener('close', () => {
    if (S.pending) { rebuild(); render(); }
  });
  $('#paste').addEventListener('close', () => {
    if (S.pending) { rebuild(); render(); }
  });

  // ---------- űrlapok ----------
  $('#login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, btn = f.querySelector('button');
    $('#login-err').textContent = '';
    btn.disabled = true;
    const { data, error } = await sb.auth.signInWithPassword({ email: f.email.value.trim().toLowerCase(), password: f.password.value });
    btn.disabled = false;
    if (error) { $('#login-err').textContent = 'Hibás e-mail cím vagy jelszó.'; return; }
    await enter(data.session);
  });

  $('#boot-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, btn = f.querySelector('button');
    $('#boot-err').textContent = '';
    if (f.password.value !== f.password2.value) { $('#boot-err').textContent = 'A két jelszó nem egyezik.'; return; }
    btn.disabled = true;
    try {
      const email = f.email.value.trim().toLowerCase();
      await usersFn('bootstrap', { email, password: f.password.value });
      const { data, error } = await sb.auth.signInWithPassword({ email, password: f.password.value });
      if (error) throw error;
      await enter(data.session);
    } catch (err) {
      $('#boot-err').textContent = err.message || 'A létrehozás nem sikerült.';
    } finally {
      btn.disabled = false;
    }
  });

  $('#pw-form').addEventListener('submit', async e => {
    e.preventDefault();
    const inp = $('#pw-new');
    const { error } = await sb.auth.updateUser({ password: inp.value });
    if (error) { toast('A jelszó legalább 8 karakter legyen'); return; }
    inp.value = '';
    toast('Jelszó módosítva');
  });

  $('#user-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('#user-email').value.trim().toLowerCase();
    const role = $('#user-role').value;
    const pw = tempPassword();
    try {
      await usersFn('create', { email, password: pw, role });
      $('#user-email').value = '';
      showNewPw(email, pw);
      loadUsers();
    } catch (err) {
      toast(err.message);
    }
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
