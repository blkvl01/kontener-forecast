// QR-kódos fotózás: korlátozott, lejáró belépő egyetlen konténer fotóihoz és rendszámához.
//
// Gépen (bejelentkezett tag, Authorization: a felhasználó tokenje):
//   link    { container, plate }  → az aktív link (ha nincs, új)        → { token, expires_at, created_at, by }
//   relink  { container, plate }  → a régi megszűnik, új készül          → ugyanaz
//   revoke  { container }         → a konténer minden linkje megszűnik   → { ok }
// Telefonon (QR, bejelentkezés nélkül, t = token):
//   info    { t }                 → konténer, rendszám, fotók (aláírt URL-lel)
//   upload  ?a=upload, fejléc x-kf-link: token, törzs: JPEG       → { id, at }
//   delete  { t, id }             → csak az ezzel a linkkel feltöltött fotó törölhető
//   plate   { t, plate }          → a rendszám kézi javítása (manual tábla)
//
// Telepítés: supabase functions deploy photo-link --no-verify-jwt
// (A telefon nem küld felhasználói tokent; a jogosultságot a függvény maga ellenőrzi.)
// Ajánlott külön titok: supabase secrets set PHOTO_LINK_SECRET=<hosszú véletlen szöveg>
// Ha nincs megadva, a service role kulcs szolgál HMAC-kulcsként.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SRK = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SECRET = Deno.env.get('PHOTO_LINK_SECRET') || SRK;
const db = createClient(SB_URL, SRK, { auth: { persistSession: false, autoRefreshToken: false } });

const PHOTO_TTL_MS = 12 * 3600e3;   // a fotók 12 óráig élnek (photo-cleanup)
const MIN_LEFT_MS = 4 * 3600e3;     // késő este készült QR is legalább 4 óráig él
const MAX_UPLOADS = 80;             // egy linkkel legfeljebb ennyi kép
const MAX_BYTES = 5 * 1024 * 1024;
const CONT_RE = /^[A-Z]{4}\d{7}$/;
const TOKEN_RE = /^([0-9a-f]{32})([A-Za-z0-9_-]{22})$/;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-kf-link, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
class HttpError extends Error { constructor(public status: number, msg: string) { super(msg); } }

// ---------- token ----------
const enc = new TextEncoder();
let keyP: Promise<CryptoKey> | null = null;
const hmacKey = () => (keyP ||= crypto.subtle.importKey('raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']));
const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function sign(id: string) {
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(), enc.encode(`photo-link:${id}`)));
  return b64url(mac.slice(0, 16));
}
const tokenOf = async (id: string) => id.replace(/-/g, '') + (await sign(id));
const hexToUuid = (h: string) => `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;

function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

type Link = { id: string; container: string; plate_hint: string; created_by: string | null; created_by_email: string | null; created_at: string; expires_at: string; revoked_at: string | null; uploads: number };

async function linkFromToken(t: unknown): Promise<Link> {
  const m = typeof t === 'string' ? t.match(TOKEN_RE) : null;
  if (!m) throw new HttpError(401, 'Érvénytelen QR-kód.');
  const id = hexToUuid(m[1]);
  if (!same(m[2], await sign(id))) throw new HttpError(401, 'Érvénytelen QR-kód.');
  const { data, error } = await db.from('photo_links').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) throw new HttpError(401, 'Érvénytelen QR-kód.');
  if (data.revoked_at || new Date(data.expires_at).getTime() <= Date.now()) {
    throw new HttpError(410, 'Ez a QR-kód lejárt vagy visszavonták. Kérj újat a gépnél.');
  }
  return data as Link;
}

// ---------- tag (gép) ----------
async function member(req: Request) {
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data, error } = await db.auth.getUser(jwt);
  if (error || !data.user) throw new HttpError(401, 'Lépj be újra.');
  const email = (data.user.email || '').toLowerCase();
  const { data: m } = await db.from('members').select('email, name, role').eq('email', email).maybeSingle();
  if (!m) throw new HttpError(403, 'Nincs hozzáférésed.');
  return { uid: data.user.id, email, name: (m.name as string) || email };
}

// A nap végéig (budapesti idő szerint) él, de legalább 4 óráig.
function tzOffsetMin(t: number) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Budapest', timeZoneName: 'shortOffset' })
    .formatToParts(new Date(t)).find(x => x.type === 'timeZoneName')?.value || 'GMT';
  const m = p.match(/GMT([+-])(\d+)(?::(\d+))?/);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] || 0)) : 0;
}
function expiry(now = Date.now()) {
  const [y, mo, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(now)).split('-').map(Number);
  const utcMidnight = Date.UTC(y, mo - 1, d + 1);
  const end = utcMidnight - tzOffsetMin(utcMidnight - 3 * 3600e3) * 60e3 - 60e3; // 23:59
  return new Date(Math.max(end, now + MIN_LEFT_MS)).toISOString();
}

const cleanPlate = (s: unknown) => String(s ?? '').toUpperCase().replace(/\s+/g, ' ').trim().slice(0, 30);

async function linkOut(l: Link) {
  return { token: await tokenOf(l.id), expires_at: l.expires_at, created_at: l.created_at, by: l.created_by_email };
}

async function getOrCreate(req: Request, body: Record<string, unknown>, fresh: boolean) {
  const me = await member(req);
  const container = String(body.container || '');
  if (!CONT_RE.test(container)) throw new HttpError(400, 'Hibás konténerszám.');
  const plate = cleanPlate(body.plate);
  const now = new Date().toISOString();
  if (fresh) {
    await db.from('photo_links').update({ revoked_at: now }).eq('container', container).is('revoked_at', null);
  } else {
    // A már kint lévő QR marad érvényes (a telefonon épp használhatják); csak a levélbeli rendszám frissül.
    const { data } = await db.from('photo_links').select('*').eq('container', container).is('revoked_at', null)
      .gt('expires_at', new Date(Date.now() + 30 * 60e3).toISOString()).order('created_at', { ascending: false }).limit(1);
    if (data && data[0]) {
      if (plate && plate !== data[0].plate_hint) await db.from('photo_links').update({ plate_hint: plate }).eq('id', data[0].id);
      return linkOut(data[0] as Link);
    }
  }
  // Régi, lejárt linkek takarítása (a fotók link_id-je ilyenkor kiürül).
  db.from('photo_links').delete().lt('expires_at', new Date(Date.now() - 7 * 86400e3).toISOString()).then(() => {}, () => {});
  const { data, error } = await db.from('photo_links').insert({
    container, plate_hint: plate, created_by: me.uid, created_by_email: me.email, expires_at: expiry()
  }).select().single();
  if (error) throw error;
  return linkOut(data as Link);
}

// ---------- telefon ----------
async function info(l: Link) {
  const [{ data: man }, { data: ph, error }] = await Promise.all([
    db.from('manual').select('plate, ramp, arrived, arrived_at').eq('container', l.container).maybeSingle(),
    db.from('photos').select('id, path, created_at, link_id').eq('container', l.container)
      .gt('created_at', new Date(Date.now() - PHOTO_TTL_MS).toISOString()).order('created_at')
  ]);
  if (error) throw error;
  const list = ph || [];
  let urls: Record<string, string> = {};
  if (list.length) {
    const { data: signed } = await db.storage.from('photos').createSignedUrls(list.map(p => p.path), 3600);
    urls = Object.fromEntries((signed || []).filter(s => s.signedUrl).map(s => [s.path, s.signedUrl]));
  }
  const { data: by } = l.created_by_email
    ? await db.from('members').select('name').eq('email', l.created_by_email).maybeSingle()
    : { data: null };
  return {
    container: l.container,
    plate: (man && man.plate) || l.plate_hint || '',
    plate_fixed: !!(man && man.plate),
    ramp: (man && man.ramp) || null,
    arrived_at: man && man.arrived ? man.arrived_at : null,
    expires_at: l.expires_at,
    by: (by && by.name) || l.created_by_email || '',
    photos: list.map(p => ({ id: p.id, at: p.created_at, url: urls[p.path] || '', mine: p.link_id === l.id }))
  };
}

async function upload(req: Request) {
  const l = await linkFromToken(req.headers.get('x-kf-link'));
  if (l.uploads >= MAX_UPLOADS) throw new HttpError(429, 'Ezzel a QR-kóddal már sok kép készült. Kérj újat a gépnél.');
  const buf = new Uint8Array(await req.arrayBuffer());
  if (buf.length < 100 || buf.length > MAX_BYTES) throw new HttpError(413, 'A kép túl nagy vagy sérült.');
  if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) throw new HttpError(415, 'Csak JPEG kép tölthető fel.');
  const path = `${l.container}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;
  const up = await db.storage.from('photos').upload(path, buf, { contentType: 'image/jpeg' });
  if (up.error) throw up.error;
  const { data, error } = await db.from('photos').insert({ container: l.container, path, created_by: l.created_by, link_id: l.id })
    .select('id, created_at').single();
  if (error) { await db.storage.from('photos').remove([path]); throw error; }
  await db.from('photo_links').update({ uploads: l.uploads + 1 }).eq('id', l.id);
  return { id: data.id, at: data.created_at };
}

async function del(l: Link, id: unknown) {
  const { data: p } = await db.from('photos').select('id, path, link_id, container').eq('id', id as string).maybeSingle();
  if (!p) return { ok: true };
  if (p.link_id !== l.id || p.container !== l.container) throw new HttpError(403, 'Ezt a fotót csak a gépen lehet törölni.');
  const { error } = await db.from('photos').delete().eq('id', p.id);
  if (error) throw error;
  await db.storage.from('photos').remove([p.path]);
  return { ok: true };
}

async function setPlate(l: Link, raw: unknown) {
  const parts = cleanPlate(raw).split('/').map(s => s.trim()).filter(Boolean);
  if (!parts.length || parts.length > 2) throw new HttpError(400, 'Add meg a rendszámot.');
  if (parts.some(p => p.length > 14 || !/^[A-Z0-9ÄÖÜÁÉÍÓÚŐŰ.\- ]+$/u.test(p))) throw new HttpError(400, 'A rendszámban csak betű, szám, szóköz és kötőjel lehet.');
  const plate = parts.join(' / ');
  const { error } = await db.from('manual').upsert(
    { container: l.container, plate, updated_by: 'QR-kód (telefon)', updated_at: new Date().toISOString() },
    { onConflict: 'container' }
  );
  if (error) throw error;
  return { plate };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Csak POST.' }, 405);
  try {
    if (new URL(req.url).searchParams.get('a') === 'upload') return json(await upload(req));
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    switch (body.action) {
      case 'link': return json(await getOrCreate(req, body, false));
      case 'relink': return json(await getOrCreate(req, body, true));
      case 'revoke': {
        await member(req);
        const container = String(body.container || '');
        if (!CONT_RE.test(container)) throw new HttpError(400, 'Hibás konténerszám.');
        await db.from('photo_links').update({ revoked_at: new Date().toISOString() }).eq('container', container).is('revoked_at', null);
        return json({ ok: true });
      }
      case 'info': return json(await info(await linkFromToken(body.t)));
      case 'delete': return json(await del(await linkFromToken(body.t), body.id));
      case 'plate': return json(await setPlate(await linkFromToken(body.t), body.plate));
      default: throw new HttpError(400, 'Ismeretlen művelet.');
    }
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    console.error(e);
    return json({ error: 'Szerverhiba, próbáld újra.' }, 500);
  }
});
