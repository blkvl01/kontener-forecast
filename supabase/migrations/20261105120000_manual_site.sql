-- Konténer raktára az udvaron: MG1 (alap, üres érték) vagy MG3.
-- Egyszer kell lefuttatni a Supabase SQL Editorban. A meglévő sorok MG1-ben maradnak.
alter table public.manual add column if not exists site text;
alter table public.manual drop constraint if exists manual_site_check;
alter table public.manual add constraint manual_site_check check (site is null or site in ('MG1', 'MG3'));
