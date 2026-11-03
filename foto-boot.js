// A nyitó animáció még az első képkocka előtt eldől: csak telefonon, QR-ról vagy a Fotózás gombról érkezve,
// egy linkkel munkamenetenként egyszer (újratöltéskor nem), és nem csökkentett mozgásnál.
(function () {
  var play = false;
  try {
    var t = (location.hash.match(/[#&]t=([0-9a-f]{32}[\w-]{22})/) || [])[1];
    var key = 'kf-intro-' + (t || '').slice(0, 16);
    play = !!t && matchMedia('(pointer: coarse)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches && !sessionStorage.getItem(key);
    if (play) sessionStorage.setItem(key, '1');
  } catch (_) { play = false; }
  if (play) document.documentElement.className += ' kf-intro';
})();
