# Supabase: QR-kódos fotózás

A gépen a konténer lapján (Fotók → **QR a telefonhoz**) QR-kód készül. A telefon ezt beolvassa, és
bejelentkezés nélkül megnyílik a `foto.html`. Ezen csak az adott konténer fotói és rendszáma érhető el.

## Telepítés (egyszer)

1. **Tábla.** A Supabase SQL Editorban futtasd a `migrations/20261103180000_photo_links.sql` fájlt
   (vagy `supabase db push`). Létrejön a `photo_links` tábla, a `photos` pedig kap egy `link_id` oszlopot.
2. **Titkos kulcs** a QR-tokenekhez (ajánlott):
   ```
   supabase secrets set PHOTO_LINK_SECRET="$(openssl rand -base64 48)"
   ```
   Ha nincs megadva, a függvény a service role kulcsot használja helyette. Ha ezt a kulcsot lecseréled,
   minden kint lévő QR-kód megszűnik.
3. **Függvény:**
   ```
   supabase functions deploy photo-link --no-verify-jwt
   ```
   A `--no-verify-jwt` kell: a telefon nem küld felhasználói tokent, a jogosultságot a függvény maga ellenőrzi
   (a gépi műveleteknél a belépett tagot, a telefonosaknál a QR-tokent).

## Hogyan működik

- **Token:** `<link azonosító><HMAC aláírás>`. A tokent az adatbázis nem tárolja, a függvény számolja ki.
  Egy adatbázis-mentésből tehát nem állítható elő érvényes link.
- **Érvényesség:** a nap végéig (23:59, budapesti idő), de legalább 4 óráig. A gépen a **Visszavonás**
  azonnal megszünteti, az **Új QR-kód** a régit érvényteleníti. A QR-ablak újranyitása ugyanazt a kódot mutatja,
  így a már beolvasott telefon nem veszíti el a hozzáférést.
- **Mit tud a telefon:** a konténer képeit nézheti, új képet tölthet fel (JPEG, legfeljebb 5 MB, linkenként
  legfeljebb 80 kép), a saját, ezzel a QR-ral feltöltött képeit törölheti, és javíthatja a rendszámot.
  Más konténert, MRN-t, leveleket, felhasználókat nem lát.
- **Nyoma marad:** a QR-ral feltöltött fotó `created_by` értéke a QR-t készítő felhasználó, a `link_id` a QR,
  a gépen „QR” jelölést kap. A rendszám-javítás a `manual` táblába kerül, `updated_by = 'QR-kód (telefon)'` értékkel.
  Ha a `manual` táblán van olyan trigger, ami az `updated_by` mezőt a belépett felhasználóból tölti, az itt üres
  lehet (a függvény service role-lal ír).
