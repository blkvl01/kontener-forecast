// A nyitó animáció a legutóbb belépett szerepkör szerint indul, még az első képkocka előtt.
(function () {
  var r = 'editor';
  try { r = localStorage.getItem('kf-role') || r; } catch (_) { /* privát mód */ }
  if (r !== 'admin' && r !== 'worker') r = 'editor';
  document.documentElement.setAttribute('data-bi', r);
  document.documentElement.setAttribute('data-br', r);
})();
