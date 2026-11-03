-- QR-kódos fotózás: konténerenként egy korlátozott, lejáró belépő a telefonos fotózáshoz.
-- A token nem tárolódik: a photo-link függvény a sor azonosítójából titkos kulccsal (HMAC) számolja,
-- így egy adatbázis-mentésből sem állítható elő érvényes link.

create table if not exists public.photo_links (
  id uuid primary key default gen_random_uuid(),
  container text not null check (container ~ '^[A-Z]{4}[0-9]{7}$'),
  -- A levélből származó rendszám a QR készítésekor (a kézi javítás a manual táblában van, az az erősebb).
  plate_hint text not null default '',
  created_by uuid,
  created_by_email text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  uploads integer not null default 0
);

create index if not exists photo_links_active on public.photo_links (container) where revoked_at is null;

-- Nincs szabály (policy): a böngészőből senki nem olvashatja és írhatja, csak a photo-link függvény (service role).
alter table public.photo_links enable row level security;

-- A QR-ral feltöltött fotó a linkhez kötődik: a telefon csak ezeket törölheti, a gépen „QR” jelölést kapnak.
alter table public.photos add column if not exists link_id uuid references public.photo_links (id) on delete set null;
