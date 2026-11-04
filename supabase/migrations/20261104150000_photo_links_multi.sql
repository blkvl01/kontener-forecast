-- A telefonos Fotózás gomb belépője (multi) tagonként külön van; a siblings lista azokat a konténereket tartalmazza,
-- amelyekre a belépő átválthat (photo-link: hop) — a QR-kódé is, ha a gép megadta.
alter table public.photo_links add column if not exists multi boolean not null default false;
alter table public.photo_links add column if not exists siblings jsonb;
