/* Suggests the visitor's own-language dental tourism page on the homepage. */
(function () {
  try {
    if (location.pathname !== '/' && location.pathname !== '/index.html') return;
    if (sessionStorage.getItem('mdLangBanner')) return;
  } catch (e) {}
  var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map(function (l) { return String(l).toLowerCase(); });
  if (langs.some(function (l) { return l.indexOf('sq') === 0; })) return; // Albanian speakers: no banner
  var l = langs[0] || '';
  var M = [
    [/^de-ch/, '🇨🇭 Patient aus der Schweiz?', 'Preise in CHF ansehen', '/zahnimplantate-kosovo-schweiz.html'],
    [/^de/, '🇩🇪 Patient aus Deutschland oder Österreich?', 'Preise & Zahnurlaub auf Deutsch', '/zahnimplantate-kosovo-vs-deutschland.html'],
    [/^sv/, '🇸🇪 Patient från Sverige?', 'Se priser på svenska', '/tandimplantat-kosovo-sverige.html'],
    [/^it/, '🇮🇹 Paziente dall’Italia?', 'Vedi i prezzi in italiano', '/impianti-dentali-kosovo.html'],
    [/^hr/, '🇭🇷 Pacijent iz Hrvatske?', 'Pogledajte cijene na hrvatskom', '/zubni-implantati-kosovo-hrvatska.html'],
    [/^(bs|sr)/, '🇧🇦 Pacijent iz BiH?', 'Pogledajte cijene na bosanskom', '/zubni-implantati-kosovo-bih.html'],
    [/^en/, '🌍 Visiting from abroad?', 'See prices vs the UK', '/dental-implants-kosovo-vs-uk.html']
  ];
  var hit = null;
  for (var i = 0; i < M.length; i++) if (M[i][0].test(l)) { hit = M[i]; break; }
  if (!hit) return;
  var d = document.createElement('div');
  d.setAttribute('role', 'region');
  d.style.cssText = 'position:fixed;left:50%;bottom:88px;transform:translate(-50%,240%);z-index:2147483000;max-width:calc(100% - 32px);width:440px;background:#0f2d4e;color:#fff;border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.35);padding:14px 44px 14px 16px;font:600 15px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;transition:transform .5s cubic-bezier(.2,.8,.2,1)';
  d.innerHTML = '<div>' + hit[1] + '</div><a href="' + hit[3] + '" style="display:inline-block;margin-top:8px;background:#0aa2c0;color:#fff;text-decoration:none;padding:8px 16px;border-radius:30px;font-weight:800">' + hit[2] + ' →</a>' +
    '<button aria-label="Close" style="position:absolute;top:8px;right:10px;background:none;border:0;color:#c4d6e8;font-size:22px;cursor:pointer;line-height:1">×</button>';
  d.querySelector('button').onclick = function () { d.style.transform = 'translate(-50%,240%)'; try { sessionStorage.setItem('mdLangBanner', '1'); } catch (e) {} };
  function show() { document.body.appendChild(d); requestAnimationFrame(function () { requestAnimationFrame(function () { d.style.transform = 'translate(-50%,0)'; }); }); }
  setTimeout(show, 1800);
})();
