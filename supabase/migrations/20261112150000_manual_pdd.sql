-- Kézi fuvarlevelek (PDD) konténerenként: [{ "no": "OyTM202610177307", "ctns": 368, "kg": 8745.14 }, …]
-- Akkor kell, ha a levélfeldolgozó nem olvassa ki a fuvarlevélszámokat (pl. NEP pre-alert táblázata).
-- Egyszer kell lefuttatni a Supabase SQL Editorban. A meglévő sorokat nem érinti.
alter table public.manual add column if not exists pdd jsonb;
