// A napi Excel-lekérdezés sorai. Ugyanazt számolja, mint az app „Excel” exportja (app.js: exportWeek),
// csak a böngésző nélkül: az idők budapesti falióra-szövegek („2026-11-09T08:45:00”), az időtartamok percben.
// Ha az app.js phase / lateInfo / exportWeek logikája változik, ezt a fájlt is igazítani kell.

const pad = n => String(n).padStart(2, '0');
const DOW = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
const UNPACK_MIN = 15, LATE_MIN = 15;
const PHASE = {
  plan: ['Tervben', 'plan'], request: ['Nyitás megkérve', 'live'], approved: ['Nyitható', 'live'], opened: ['Nyitás alatt', 'live'],
  unpack: ['Bontás alatt', 'live'], released: ['Elengedve', 'live'], stored: ['Betárolva', 'done']
};

// Falióra-szöveg ↔ szám (percek): mindkét oldal ugyanabban az „időzónában” értendő, ezért a különbség helyes.
const ms = s => Date.parse(`${String(s).slice(0, 19)}Z`);
const minutesBetween = (a, b) => (ms(b) - ms(a)) / 60000;
const dowIdx = day => (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
const fmtDur = min => {
  min = Math.max(0, Math.round(min));
  if (min < 60) return `${min} p`;
  if (min < 1440) return `${Math.floor(min / 60)} ó ${pad(min % 60)} p`;
  return `${Math.floor(min / 1440)} nap ${Math.floor((min % 1440) / 60)} ó`;
};
const plateFmt = p => (p || '').replace(/\s*\/\s*/g, ' / ');
const pddOf = c => (c.pdd || []).filter(p => p.no);
export function pxOf(no) {
  const m = /^([A-Za-z0-9]+?)TM\d/.exec(no);
  return m ? m[1] : (/^[A-Za-z]+/.exec(no) || ['Egyéb'])[0];
}

function phaseKey(c, now) {
  const st = c.stages || {};
  if (st.stored) return 'stored';
  if (st.released) return 'released';
  if (st.opened || c.opened_implied) return st.opened && minutesBetween(st.opened.at, now) < UNPACK_MIN ? 'opened' : 'unpack';
  if (st.approved) return 'approved';
  return c.arrived ? 'request' : 'plan';
}
function lateInfo(c, now) {
  if (!c || c.state !== 'active' || c.arrived) return null;
  if (c.eta_time) {
    const min = minutesBetween(`${c.eta_date || c.date}T${c.eta_time}:00`, now);
    return min > LATE_MIN ? { label: `Késik ${fmtDur(min)}` } : null;
  }
  if (c.date && c.date < now.slice(0, 10)) return { label: 'Nem érkezett meg' };
  return null;
}
const arrKey = c => (c.arrived ? c.arrived_at || `${c.day}T00:00:00` : c.eta_time ? `${c.day}T${c.eta_time}:00` : '9999');
const byArrival = (a, b) => { const x = arrKey(a), y = arrKey(b); return x !== y ? (x < y ? -1 : 1) : a.id < b.id ? -1 : 1; };

export const CONTAINER_COLS = [
  ['date', 'Dátum'], ['dow', 'Nap'], ['id', 'Konténer'], ['prio', 'Prioritás'], ['fwd', 'Szállító'], ['plate', 'Rendszám'], ['t1', 'T1 / MRN'],
  ['phone', 'Sofőr telefon'], ['npdd', 'Fuvarlevél (db)'], ['ctns', 'Colli'], ['kg', 'Súly (kg)'], ['state', 'Állapot'], ['ramp', 'Rámpa'],
  ['seen', 'Pre-alert'], ['truck', 'Rendszám + T1'], ['eta', 'ETA'], ['arr', 'Megérkezett'], ['dev', 'Eltérés az ETA-tól (perc)'],
  ['req', 'Nyitáskérés'], ['appr', 'Nyitható'], ['open', 'Nyitás'], ['rel', 'Elengedve'], ['sto1', 'Betárolás kezdete'], ['sto', 'Betárolva'],
  ['d1', 'Nyitáskérés → nyitható (perc)'], ['d2', 'Nyitható → nyitás (perc)'], ['d3', 'Nyitás → betárolva (perc)'],
  ['dt', 'Átfutás: érkezés → betárolva (perc)'], ['note', 'Megjegyzés']
];
export const PDD_COLS = [
  ['date', 'Dátum'], ['id', 'Konténer'], ['no', 'Fuvarlevél'], ['px', 'Prefix'], ['ctns', 'Colli'], ['kg', 'Súly (kg)'],
  ['sto', 'Betárolva'], ['arr', 'Konténer megérkezett'], ['state', 'Konténer állapota']
];

export function dayRows(data, day, now, prio = []) {
  const list = Object.values(data.containers).filter(c => c.state === 'active' && c.day === day).sort(byArrival);
  const ct = [], pd = [];
  const mins = (a, b) => (a && b ? Math.round(Math.max(0, minutesBetween(a, b))) : '');
  for (const c of list) {
    const s = c.stages || {};
    const at = k => (s[k] && s[k].at) || '';
    const k = phaseKey(c, now), late = lateInfo(c, now);
    const label = late ? late.label : PHASE[k][0];
    const eta = c.eta_time ? `${c.eta_date || c.date}T${c.eta_time}:00` : '';
    const truck = (c.history || []).find(h => h.kind === 'truck');
    const first = at('request') || c.arrived_at || '';
    const stored = at('stored');
    const ps = pddOf(c);
    ct.push({
      date: c.day, dow: DOW[dowIdx(c.day)], id: c.id, prio: prio.includes(c.id) && k !== 'stored' ? 'igen' : '', fwd: c.fwd || '',
      plate: c.plate ? plateFmt(c.plate) : '', t1: c.t1 || '', phone: c.phone || '', npdd: ps.length, ctns: c.ctns || 0, kg: Math.round(c.kg || 0),
      state: label, ramp: c.ramp || '', seen: c.first_seen || '', truck: (truck && truck.at) || '', eta, arr: c.arrived_at || '',
      dev: c.arrived_at && eta ? Math.round(minutesBetween(eta, c.arrived_at)) : '',
      req: at('request'), appr: at('approved'), open: at('opened'), rel: at('released'),
      sto1: (c.storage && c.storage.first) || '', sto: stored,
      d1: mins(at('request'), at('approved')), d2: mins(at('approved'), at('opened')), d3: mins(at('opened'), stored),
      dt: mins(first, stored), note: c.note || ''
    });
    const sp = c.storedPdd || {};
    for (const p of ps) {
      pd.push({
        date: c.day, id: c.id, no: p.no, px: pxOf(p.no),
        ctns: p.ctns != null ? p.ctns : ps.length === 1 ? c.ctns || 0 : '',
        kg: p.kg != null ? Math.round(p.kg) : ps.length === 1 ? Math.round(c.kg || 0) : '',
        sto: sp[p.no.toUpperCase()] || '', arr: c.arrived_at || '', state: label
      });
    }
  }
  return { containers: ct, pdd: pd };
}

const q = v => { const s = String(v ?? ''); return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export const toCsv = (cols, rows) => '﻿' + [cols.map(c => q(c[1])).join(','), ...rows.map(r => cols.map(c => q(r[c[0]])).join(','))].join('\r\n') + '\r\n';
