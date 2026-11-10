// Élő Excel: a napi konténerlista és a fuvarlevelek CSV-ben, az Excel Power Query húzza le és frissíti.
//
// Gépen (bejelentkezett tag, Authorization: a felhasználó tokenje), POST:
//   { action: 'link' }  → { url }   a tag személyes feed-linkje (a végén a lap neve és a nap kerül)
// Excelből (bejelentkezés nélkül), GET:
//   ?t=<token>&sheet=containers|pdd&d=YYYY-MM-DD&r=day|week  → CSV (UTF-8)
//   r=day (alap): a d napja (alapból a mai); r=week: annak a hétnek hétfőtől vasárnapig, amelyikbe d esik
//
// A token = <email base64url>.<HMAC>. Nem tárolódik. Minden lekérésnél ellenőrzi, hogy az e-mail még tagja-e
// (members tábla), ezért a tag eltávolítása azonnal megszünteti a linkjét. A titok cseréje mindenkiét.
//
// Telepítés: supabase functions deploy excel-feed --no-verify-jwt
// Ajánlott külön titok: supabase secrets set EXCEL_FEED_SECRET=<hosszú véletlen szöveg>
// (Ha nincs megadva, a service role kulcs szolgál HMAC-kulcsként.)
// A derive.js a repo gyökerében lévő fájl másolata: a gyökérbeli módosítása után újra át kell másolni
// (ellenőrzés: ./supabase/functions/excel-feed/check-derive.sh).

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { CONTAINER_COLS, PDD_COLS, dayRows, toCsv, weekOf } from './rows.js';

const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SRK = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SECRET = Deno.env.get('EXCEL_FEED_SECRET') || SRK;
const db = createClient(SB_URL, SRK, { auth: { persistSession: false, autoRefreshToken: false } });

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
class HttpError extends Error { constructor(public status: number, msg: string) { super(msg); } }

// ---------- token ----------
const enc = new TextEncoder();
const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
let keyP: Promise<CryptoKey> | null = null;
const hmacKey = () => (keyP ||= crypto.subtle.importKey('raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']));
async function sign(email: string) {
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(), enc.encode(`excel-feed:${email}`))).slice(0, 24));
}
function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
async function tokenOf(email: string) { return `${b64url(enc.encode(email))}.${await sign(email)}`; }
async function emailFromToken(t: string | null) {
  const [e, mac] = (t || '').split('.');
  let email = '';
  try { email = new TextDecoder().decode(fromB64url(e || '')); } catch (_) { /* érvénytelen */ }
  if (!email || !mac || !same(mac, await sign(email))) throw new HttpError(401, 'Érvénytelen link.');
  const { data } = await db.from('members').select('email').eq('email', email).maybeSingle();
  if (!data) throw new HttpError(403, 'Ehhez a linkhez már nincs hozzáférés.');
  return email;
}
async function member(req: Request) {
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data, error } = await db.auth.getUser(jwt);
  if (error || !data.user) throw new HttpError(401, 'Lépj be újra.');
  const email = (data.user.email || '').toLowerCase();
  const { data: m } = await db.from('members').select('email').eq('email', email).maybeSingle();
  if (!m) throw new HttpError(403, 'Nincs hozzáférésed.');
  return email;
}

// ---------- adat ----------
// Budapesti falióra-szöveg a tárolt időbélyegből (az app a böngésző helyi idejét használja; itt a raktár ideje).
const fmt = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
const toLocal = (ts: unknown) => {
  if (!ts) return '';
  const d = new Date(ts as string);
  return isNaN(d.getTime()) ? '' : fmt.format(d).replace(' ', 'T');
};
async function fetchAll(table: string, order?: string) {
  const out: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db.from(table).select('*').range(from, from + 999);
    if (order) q = q.order(order, { ascending: true });
    const { data, error } = await q;
    if (error) throw error;
    out.push(...data);
    if (data.length < 1000) break;
  }
  return out;
}
async function derive() {
  (globalThis as any).window = globalThis;
  if (!(globalThis as any).KFDerive) await import('./derive.js');
  const [msgs, man, arr, sto, cfg] = await Promise.all([
    fetchAll('messages', 'received'), fetchAll('manual'), fetchAll('arrivals', 'received'), fetchAll('storage_events', 'stored_at'),
    db.from('app_settings').select('priority').eq('id', 1).maybeSingle()
  ]);
  const M = msgs.map(r => ({ ...r, received: toLocal(r.received) }));
  const MAN = Object.fromEntries(man.map((r: any) => [r.container, {
    eta_date: r.eta_date || '', eta_time: r.eta_time || '', eta_for: r.eta_for || '', eta_set: toLocal(r.eta_set),
    arrived: !!r.arrived, arrived_at: toLocal(r.arrived_at), ramp: r.ramp || null, ramp_set: toLocal(r.ramp_set),
    note: r.note || '', updated_by: r.updated_by || '', updated_at: toLocal(r.updated_at),
    plate: r.plate || '', t1: r.t1 || '', driver: r.driver || '', phone: r.phone || '',
    auto_dismissed: !!r.auto_dismissed, site: r.site || ''
  }]));
  const ARR = arr.map(r => ({ ...r, received: toLocal(r.received) }));
  const STO = sto.map(r => ({ ...r, stored_at: toLocal(r.stored_at) }));
  const data = (globalThis as any).KFDerive(M, MAN, ARR, STO);
  return { data, prio: ((cfg.data as any)?.priority || []) as string[] };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  try {
    const url = new URL(req.url);
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      if (body.action !== 'link') throw new HttpError(400, 'Ismeretlen művelet.');
      const email = await member(req);
      return json({ url: `${SB_URL}/functions/v1/excel-feed?t=${await tokenOf(email)}` });
    }
    await emailFromToken(url.searchParams.get('t'));
    const sheet = url.searchParams.get('sheet') || 'containers';
    if (!['containers', 'pdd'].includes(sheet)) throw new HttpError(400, 'Ismeretlen lap.');
    const now = fmt.format(new Date()).replace(' ', 'T');
    const dp = url.searchParams.get('d') || now.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dp)) throw new HttpError(400, 'Hibás dátum.');
    const r = url.searchParams.get('r') || 'day';
    if (!['day', 'week'].includes(r)) throw new HttpError(400, 'Ismeretlen tartomány.');
    const [from, to] = r === 'week' ? weekOf(dp) : [dp, dp];
    const { data, prio } = await derive();
    const rows = dayRows(data, from, now, prio, to);
    const csv = sheet === 'pdd' ? toCsv(PDD_COLS, rows.pdd) : toCsv(CONTAINER_COLS, rows.containers);
    return new Response(csv, { headers: { ...CORS, 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'no-store' } });
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    if (status === 500) console.error(e);
    return json({ error: e instanceof HttpError ? e.message : 'Hiba történt.' }, status);
  }
});
