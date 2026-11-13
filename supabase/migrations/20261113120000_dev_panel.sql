-- Fejlesztői menü (admin): kézi felülírások, nyers adatjavítás, napló.

-- 1) Felülírások a konténerre (nap, állapot, PDD, mérföldkövek, kézi felvétel). Csak admin írhatja.
alter table public.manual add column if not exists override jsonb;

create or replace function private.guard_override()
returns trigger language plpgsql set search_path to '' as $$
begin
  if (select private.my_role()) = 'admin' then return new; end if;
  if tg_op = 'INSERT' then
    if new.override is not null then raise exception 'override: admin only' using errcode = '42501'; end if;
  elsif new.override is distinct from old.override then
    raise exception 'override: admin only' using errcode = '42501';
  end if;
  return new;
end $$;

drop trigger if exists manual_guard_override on public.manual;
create trigger manual_guard_override before insert or update on public.manual
  for each row execute function private.guard_override();

-- A Realtime oszloplistájába is bekerül.
alter publication supabase_realtime drop table public.manual;
alter publication supabase_realtime add table public.manual
  (container, eta_date, eta_time, eta_for, eta_set, arrived, arrived_at, note, updated_by, updated_at,
   auto_dismissed, ramp, ramp_set, plate, t1, driver, phone, site, pdd, override);

-- 2) Nyers adatjavítás: nyitás- és betárolás-levelek, Glabs rámpák (admin).
create policy arrivals_admin_insert on public.arrivals for insert to authenticated with check ((select private.my_role()) = 'admin');
create policy arrivals_admin_update on public.arrivals for update to authenticated using ((select private.my_role()) = 'admin') with check ((select private.my_role()) = 'admin');
create policy arrivals_admin_delete on public.arrivals for delete to authenticated using ((select private.my_role()) = 'admin');
create policy storage_events_admin_insert on public.storage_events for insert to authenticated with check ((select private.my_role()) = 'admin');
create policy storage_events_admin_update on public.storage_events for update to authenticated using ((select private.my_role()) = 'admin') with check ((select private.my_role()) = 'admin');
create policy storage_events_admin_delete on public.storage_events for delete to authenticated using ((select private.my_role()) = 'admin');
grant delete on public.glabs_ramps to authenticated;
create policy glabs_ramps_admin_delete on public.glabs_ramps for delete to authenticated using ((select private.my_role()) = 'admin');
revoke truncate, references, trigger on public.storage_events from anon, authenticated;

-- 3) Napló: minden fejlesztői menüs módosítás előző és új értékkel, visszaállításhoz.
create table if not exists public.admin_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  by text default lower(auth.jwt() ->> 'email'),
  tbl text not null,
  key text not null,
  action text not null check (action in ('insert', 'update', 'delete', 'restore')),
  before jsonb,
  after jsonb
);
alter table public.admin_log enable row level security;
create policy admin_log_read on public.admin_log for select to authenticated using ((select private.my_role()) = 'admin');
create policy admin_log_insert on public.admin_log for insert to authenticated with check ((select private.my_role()) = 'admin');
grant select, insert on public.admin_log to authenticated;
revoke all on public.admin_log from anon;
create index if not exists admin_log_at on public.admin_log (at desc);
