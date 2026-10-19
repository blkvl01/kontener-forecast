// A pre-alert levelekből és a kézi adatokból levezeti a konténerek aktuális állapotát.
window.KFDerive = function derive(messages, manual) {
  const C = {};
  const feed = [];
  const files = {};
  const forecastDates = new Set();
  const sorted = messages.slice().sort((a, b) => (a.received < b.received ? -1 : a.received > b.received ? 1 : 0));

  for (const m of sorted) {
    const at = m.received;
    for (const a of m.attachments || []) {
      if (!a.container) continue;
      (files[a.container] = files[a.container] || []).push({ name: a.name, path: a.path, size: a.size || 0, at });
    }
    const conts = m.containers || [];
    if (!conts.length) continue;
    const dates = (m.dates || []).filter(Boolean);
    dates.forEach(d => forecastDates.add(d));
    const listedAll = new Set(conts.map(c => c.id));
    const byDate = {};
    conts.forEach(c => { (byDate[c.date] = byDate[c.date] || []).push(c.id); });
    const before = {};
    dates.forEach(d => {
      before[d] = Object.values(C).filter(x => x.state === 'active' && x.date === d).map(x => x.id).sort();
    });
    const ev = {
      at, subject: m.subject || '', dates,
      before: Object.fromEntries(dates.map(d => [d, before[d].length])),
      after: Object.fromEntries(dates.map(d => [d, (byDate[d] || []).length])),
      added: [], moved: [], removed: [], t1: []
    };

    for (const c of conts) {
      let x = C[c.id];
      if (!x) {
        x = C[c.id] = {
          id: c.id, date: c.date, state: 'active', first_seen: at,
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

  for (const x of Object.values(C)) {
    const man = manual[x.id] || {};
    x.files = files[x.id] || [];
    x.eta_date = man.eta_date || '';
    x.eta_time = man.eta_time || '';
    x.eta_set = man.eta_set || '';
    x.eta_stale = !!(man.eta_for && x.eta_time && man.eta_for !== x.date);
    x.arrived = !!man.arrived;
    x.arrived_at = man.arrived_at || '';
    x.note = man.note || '';
    x.updated_by = man.updated_by || '';
    x.updated_at = man.updated_at || '';
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
    message_count: messages.length
  };
};
