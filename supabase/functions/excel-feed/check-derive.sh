#!/bin/sh
# Ellenőrzi, hogy a függvény derive.js-e megegyezik a repo gyökerében lévővel.
cd "$(dirname "$0")" && cmp ../../../derive.js derive.js && echo "derive.js rendben" || { echo "Eltér: cp derive.js supabase/functions/excel-feed/derive.js"; exit 1; }
