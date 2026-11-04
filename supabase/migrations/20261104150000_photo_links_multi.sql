-- A telefonos Fotózás gomb belépője más konténerre is átválthat (photo-link: hop); a QR-kódé nem.
alter table public.photo_links add column if not exists multi boolean not null default false;
