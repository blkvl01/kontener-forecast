// A pre-alert levelekből és a kézi adatokból levezeti a konténerek aktuális állapotát.
window.KFDerive = function derive(messages, manual, arrivals, stored) {
  const C = {};
  const feed = [];
  const files = {};
  const forecastDates = new Set();
  const mails = messages.filter(m => m.kind !== 'quoted');
  const dkey = m => (m.dates || []).join(',');
  const dup = q => mails.some(m => dkey(m) === dkey(q) && Math.abs(new Date(m.received) - new Date(q.received)) < 180000);
  const used = messages.filter(m => m.kind !== 'quoted' || !dup(m));
  const sorted = used.sort((a, b) => (a.received < b.received ? -1 : a.received > b.received ? 1 : 0));
  const mailEta = {};

  for (const m of sorted) {
    const at = m.received;
    for (const a of m.attachments || []) {
      if (!a.container) continue;
      (files[a.container] = files[a.container] || []).push({ name: a.name, path: a.path, size: a.size || 0, at });
    }
    for (const e of m.etas || []) {
      if (e && e.container && e.time) mailEta[e.container] = { time: e.time, date: e.date || '', at };
    }
    // Szállítónként külön terv: egy levél csak a saját szállítója konténereit veheti le a listáról.
    // A dátum nélküli tétel (csak sofőr/T1/ETA frissítés) a konténer meglévő napján marad.
    const src = ((m.containers || []).find(c => c && c.src) || {}).src || 'jz';
    const conts = (m.containers || []).filter(c => c && c.id && (c.date || C[c.id]))
      .map(c => (c.date ? c : { ...c, date: C[c.id].date }));
    if (!conts.length) continue;
    const dates = (m.dates || []).filter(Boolean);
    dates.forEach(d => forecastDates.add(d));
    const listedAll = new Set(conts.map(c => c.id));
    const byDate = {};
    conts.forEach(c => { (byDate[c.date] = byDate[c.date] || []).push(c.id); });
    const before = {};
    dates.forEach(d => {
      before[d] = Object.values(C).filter(x => x.state === 'active' && x.date === d && x.src === src).map(x => x.id).sort();
    });
    const ev = {
      at, subject: m.subject || '', dates, src,
      before: Object.fromEntries(dates.map(d => [d, before[d].length])),
      after: Object.fromEntries(dates.map(d => [d, (byDate[d] || []).length])),
      added: [], moved: [], removed: [], t1: []
    };

    for (const c of conts) {
      let x = C[c.id];
      if (!x) {
        x = C[c.id] = {
          id: c.id, date: c.date, state: 'active', first_seen: at, src, fwd: c.fwd || (src === 'jz' ? 'Voltoo' : ''),
          plate: '', t1: '', driver: '', phone: '', pdd: [], kg: 0, ctns: 0,
          port: c.port || '', customs: c.customs || '',
          history: [{ at, kind: 'first', date: c.date }],
          moved_from: null, moved_at: null, removed_from: null, removed_at: null
        };
        ev.added.push(c.id);
      } else if (x.state === 'removed' || x.date !== c.date) {
        const from = x.date;
        x.history.push({ at, kind: 'moved', from, to: c.date, back: x.state === 'removed' });
        x.moved_from = from;
        x.moved_at = at;
        ev.moved.push({ id: c.id, from, to: c.date });
      } else {
        x.history.push({ at, kind: 'listed', date: c.date, count: (byDate[c.date] || []).length });
      }

      const hadTruck = !!(x.plate || x.t1);
      for (const k of ['plate', 't1', 'driver', 'phone']) {
        const v = c[k] || '';
        if (!v) continue;
        if (x[k] && x[k] !== v && (k === 'plate' || k === 't1')) {
          x.history.push({ at, kind: 'changed', field: k, from: x[k], to: v });
        }
        x[k] = v;
      }
      if (!hadTruck && (x.plate || x.t1)) {
        x.history.push({ at, kind: 'truck', plate: x.plate, t1: x.t1 });
        ev.t1.push(c.id);
      }
      if (c.fwd) x.fwd = c.fwd;
      if (c.pdd && c.pdd.length) x.pdd = c.pdd;
      if (x.kg && c.kg && Math.abs(x.kg - c.kg) > 1) x.history.push({ at, kind: 'weight', from: x.kg, to: c.kg });
      if (c.kg) x.kg = c.kg;
      if (c.ctns) x.ctns = c.ctns;
      x.date = c.date;
      x.state = 'active';
      x.removed_from = x.removed_at = null;
      x.last_seen = at;
    }

    for (const d of dates) {
      for (const id of before[d]) {
        if (listedAll.has(id)) continue;
        const x = C[id];
        x.state = 'removed';
        x.removed_from = d;
        x.removed_at = at;
        x.history.push({ at, kind: 'removed', from: d });
        ev.removed.push(id);
      }
    }
    feed.push(ev);
  }

  // Nyitáskérő levelek párosítása: MRN, konténerszám, végül egy karakter eltérés
  const dist1 = (a, b) => {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > 1) return 2;
    let i = 0, j = 0, diff = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++diff > 1) return 2;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    }
    return diff + (a.length - i) + (b.length - j);
  };
  const all = Object.values(C);
  const byT1 = {};
  all.forEach(x => { if (x.t1) byT1[x.t1.replace(/\s/g, '').toUpperCase()] = x; });
  const arr = (arrivals || []).slice().sort((a, b) => (a.received < b.received ? -1 : 1));
  for (const a of arr) {
    const hits = new Set();
    (a.mrns || []).forEach(m => { const x = byT1[m.toUpperCase()]; if (x) hits.add(x); });
    if (!hits.size) {
      for (const raw of a.containers || []) {
        const r = raw.toUpperCase();
        if (C[r]) { hits.add(C[r]); continue; }
        const near = all.filter(x => dist1(x.id, r) <= 1);
        if (near.length === 1) hits.add(near[0]);
      }
    }
    const st = a.stage || 'request';
    hits.forEach(x => {
      if (!x.auto_arrival || a.received < x.auto_arrival.at) x.auto_arrival = { at: a.received, sender: a.sender || '' };
      x.stages = x.stages || {};
      if (st !== 'other' && (!x.stages[st] || a.received < x.stages[st].at)) x.stages[st] = { at: a.received, sender: a.sender || '' };
      x.history.push({ at: a.received, kind: 'stage', stage: st, sender: a.sender || '', snippet: a.snippet || '' });
    });
  }

  // Betárolás: a PDD (AWB) számok alapján, konténerenként
  const byPdd = {};
  all.forEach(x => (x.pdd || []).forEach(p => { if (p.no) byPdd[p.no.toUpperCase()] = x; }));
  for (const s of (stored || []).slice().sort((a, b) => (a.stored_at < b.stored_at ? -1 : 1))) {
    const x = byPdd[(s.awb || '').toUpperCase()];
    if (!x) continue;
    x.storedPdd = x.storedPdd || {};
    if (x.storedPdd[s.awb.toUpperCase()]) continue;
    x.storedPdd[s.awb.toUpperCase()] = s.stored_at;
    x.history.push({ at: s.stored_at, kind: 'stored', awb: s.awb, ctns: s.ctns });
    if (!x.auto_arrival || s.stored_at < x.auto_arrival.at) x.auto_arrival = x.auto_arrival || { at: s.stored_at, sender: 'Betárolás' };
  }
  all.forEach(x => {
    const total = (x.pdd || []).filter(p => p.no).length;
    const times = Object.values(x.storedPdd || {}).sort();
    x.storage = times.length ? { done: times.length, total, first: times[0], last: times[times.length - 1] } : null;
    if (x.storage && total && times.length >= total) {
      x.stages = x.stages || {};
      x.stages.stored = { at: x.storage.last, sender: 'Betárolás' };
    }
  });

  for (const x of Object.values(C)) {
    let man = manual[x.id] || {};
    const me = mailEta[x.id];
    if (me && !(man.eta_time && man.eta_set && man.eta_set >= me.at)) {
      man = { ...man, eta_time: me.time, eta_date: me.date || x.date, eta_for: x.date, eta_set: me.at, updated_by: 'ETA-levél', updated_at: me.at };
    }
    x.files = files[x.id] || [];
    x.eta_date = man.eta_date || '';
    x.eta_time = man.eta_time || '';
    x.eta_set = man.eta_set || '';
    x.eta_stale = !!(man.eta_for && x.eta_time && man.eta_for !== x.date);
    // Az érkezés és a további lépések a levelekből jönnek; kézi felülbírálás nincs.
    x.arrived_auto = !!(x.auto_arrival && !man.arrived);
    x.arrived = !!man.arrived || x.arrived_auto;
    x.arrived_at = man.arrived ? (man.arrived_at || '') : (x.arrived_auto ? x.auto_arrival.at : '');
    x.stages = x.stages || {};
    x.stage = ['stored', 'released', 'opened', 'approved', 'request'].find(k => x.stages[k]) || '';
    x.ramp = man.ramp || null;
    x.ramp_set = man.ramp_set || '';
    x.note = man.note || '';
    x.updated_by = man.updated_by || '';
    x.updated_at = man.updated_at || '';
    x.history.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
    x.history = x.history.slice(-30);
    if (x.state === 'removed') x.status = 'removed';
    else if (x.arrived) x.status = 'arrived';
    else if (x.eta_time) x.status = 'eta';
    else if (x.plate || x.t1) x.status = 't1';
    else x.status = 'pre';
    x.day = (x.eta_time && x.eta_date && !x.eta_stale) ? x.eta_date : x.date;
  }

  return {
    containers: C,
    forecast_dates: [...forecastDates].sort(),
    feed: feed.reverse().slice(0, 60),
    message_count: mails.length
  };
};
