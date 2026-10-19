/* Medident motion: animated implant scene in the hero + scroll reveal. */
(function () {
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = {
    de: ['3D-Planung mit CBCT', 'Präzise Bohrung', 'Implantat wird eingesetzt', 'Abutment', 'Zirkonkrone sitzt'],
    en: ['3D planning on CBCT', 'Precise drilling', 'Placing the implant', 'Abutment', 'Zirconia crown fitted'],
    sv: ['3D-planering med CBCT', 'Precisionsborrning', 'Implantatet sätts in', 'Distans', 'Zirkoniakronan på plats'],
    it: ['Pianificazione 3D con CBCT', 'Fresatura precisa', 'Inserimento dell’impianto', 'Abutment', 'Corona in zirconia'],
    bs: ['3D planiranje (CBCT)', 'Precizno bušenje', 'Ugradnja implantata', 'Abutment', 'Cirkonska krunica'],
    hr: ['3D planiranje (CBCT)', 'Precizno bušenje', 'Ugradnja implantata', 'Abutment', 'Cirkonijeva krunica']
  };
  var cap = T[lang] || T.en;

  var css = '' +
    '.mx{position:relative;max-width:420px;margin:26px auto 0;background:linear-gradient(160deg,#143a63,#0b2440);border:1px solid rgba(95,214,239,.25);border-radius:22px;padding:14px 14px 10px;box-shadow:0 20px 50px rgba(0,0,0,.35)}' +
    '@media(min-width:900px){.hero{display:grid;grid-template-columns:1.2fr .9fr;gap:30px;align-items:center}.hero>.mx{margin:0}}' +
    '.mx svg{width:100%;height:auto;display:block}.mx .cap{display:flex;justify-content:space-between;align-items:center;color:#c4d6e8;font-size:.85rem;font-weight:700;padding:6px 4px 2px}' +
    '.mx .cap b{color:#5fd6ef;font-size:.7rem;letter-spacing:.14em}.mx .bar{display:flex;gap:4px;margin:6px 4px 2px}.mx .bar i{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.15);overflow:hidden}.mx .bar i s{display:block;height:100%;width:0;background:#5fd6ef}' +
    '.rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}.rv.in{opacity:1;transform:none}' +
    '.cd.rv.in:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(15,45,78,.14)}.cd{transition:transform .3s,box-shadow .3s}' +
    '.steps li.rv{transform:translateX(-24px)}.steps li.rv.in{transform:none}' +
    '.btn{transition:transform .2s,box-shadow .2s}.btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(10,162,192,.35)}' +
    '.hero h1,.hero p,.hero .k,.hero .btn{animation:mup .8s both}.hero p{animation-delay:.12s}.hero .btn{animation-delay:.24s}@keyframes mup{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}' +
    '@media(prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}.hero *{animation:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // --- Animated implant scene (SVG) ---
  var svg = '' +
  '<svg viewBox="0 0 400 300" role="img" aria-label="Implant animation">' +
  '<defs><linearGradient id="mxTi" x1="0" x2="1"><stop offset="0" stop-color="#7d8a96"/><stop offset=".5" stop-color="#e8eef3"/><stop offset="1" stop-color="#8994a0"/></linearGradient>' +
  '<linearGradient id="mxBone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e3c6"/><stop offset="1" stop-color="#d9c39a"/></linearGradient>' +
  '<linearGradient id="mxTooth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6edf2"/></linearGradient>' +
  '<clipPath id="mxClip"><rect x="0" y="0" width="400" height="300"/></clipPath></defs>' +
  '<g clip-path="url(#mxClip)">' +
  // scan grid
  '<g id="mxGrid" opacity="0"><path d="M0 60H400M0 120H400M0 180H400M0 240H400M80 0V300M160 0V300M240 0V300M320 0V300" stroke="#5fd6ef" stroke-opacity=".18"/><rect id="mxScan" x="0" y="0" width="400" height="6" fill="#5fd6ef" opacity=".5"/></g>' +
  // bone + gum
  '<path d="M0 170 Q100 160 200 168 T400 170 V300 H0Z" fill="url(#mxBone)"/>' +
  '<g fill="#e9d6b0" opacity=".7"><circle cx="40" cy="230" r="6"/><circle cx="120" cy="260" r="5"/><circle cx="300" cy="250" r="7"/><circle cx="360" cy="215" r="4"/><circle cx="250" cy="280" r="5"/></g>' +
  '<path d="M0 150 Q60 140 110 152 Q150 166 200 160 Q250 154 290 152 Q340 140 400 150 V178 Q300 186 200 180 Q100 186 0 178Z" fill="#e88e9a"/>' +
  // neighbour teeth
  '<g><path d="M40 150 C38 110 44 70 70 66 C96 62 104 110 100 150Z" fill="url(#mxTooth)" stroke="#cfd9e2"/><path d="M52 150 L56 230 M88 150 L84 228" stroke="#e7dcc6" stroke-width="10" stroke-linecap="round"/></g>' +
  '<g><path d="M300 150 C296 110 304 70 330 66 C356 62 364 110 360 150Z" fill="url(#mxTooth)" stroke="#cfd9e2"/><path d="M312 150 L316 230 M348 150 L344 228" stroke="#e7dcc6" stroke-width="10" stroke-linecap="round"/></g>' +
  // planned path
  '<line id="mxPlan" x1="200" y1="40" x2="200" y2="262" stroke="#5fd6ef" stroke-width="2" stroke-dasharray="6 6" opacity="0"/>' +
  // osteotomy hole
  '<rect id="mxHole" x="190" y="170" width="20" height="0" rx="8" fill="#b89a6a"/>' +
  // drill
  '<g id="mxDrill" transform="translate(0,-240)"><rect x="186" y="20" width="28" height="40" rx="8" fill="#9aa7b3"/><rect x="194" y="58" width="12" height="16" fill="#c8d1d9"/>' +
  '<g id="mxBit"><path d="M196 74 H204 V160 L200 172 L196 160Z" fill="url(#mxTi)"/><path id="mxFl" d="M196 84 L204 92 M196 100 L204 108 M196 116 L204 124 M196 132 L204 140 M196 148 L204 156" stroke="#6b7783" stroke-width="2"/></g></g>' +
  // implant
  '<g id="mxImp" transform="translate(0,-280)"><path d="M188 168 H212 L210 252 Q200 268 190 252Z" fill="url(#mxTi)"/>' +
  '<g id="mxTh" stroke="#6f7b87" stroke-width="2.4"><path d="M188 180 L212 186 M188 192 L212 198 M188 204 L212 210 M189 216 L211 222 M189 228 L211 234 M190 240 L210 246"/></g></g>' +
  // abutment
  '<path id="mxAb" d="M193 132 H207 L210 168 H190Z" fill="#c9a24a" opacity="0" transform="translate(0,-30)"/>' +
  // crown
  '<g id="mxCr" opacity="0" transform="translate(0,-120)"><path d="M168 152 C164 112 172 78 200 74 C228 78 236 112 232 152 Q200 162 168 152Z" fill="url(#mxTooth)" stroke="#d3dde6" stroke-width="2"/><path d="M182 92 Q200 84 218 92" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/></g>' +
  // sparkle
  '<g id="mxSp" opacity="0" fill="#5fd6ef"><path d="M248 70 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z"/><path d="M150 96 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/></g>' +
  '</g></svg>' +
  '<div class="cap"><span id="mxTxt"></span><b id="mxN"></b></div><div class="bar">' + cap.map(function () { return '<i><s></s></i>'; }).join('') + '</div>';

  function mount() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var wrap = document.createElement('div'); while (hero.firstChild) wrap.appendChild(hero.firstChild); hero.appendChild(wrap);
    var box = document.createElement('div'); box.className = 'mx'; box.innerHTML = svg; hero.appendChild(box);
    var $ = function (id) { return box.querySelector('#' + id); };
    var els = { grid: $('mxGrid'), scan: $('mxScan'), plan: $('mxPlan'), hole: $('mxHole'), drill: $('mxDrill'), fl: $('mxFl'), imp: $('mxImp'), th: $('mxTh'), ab: $('mxAb'), cr: $('mxCr'), sp: $('mxSp'), txt: $('mxTxt'), n: $('mxN') };
    var bars = box.querySelectorAll('.bar s');
    var D = [2200, 2200, 2600, 1300, 2600]; var TOTAL = D.reduce(function (a, b) { return a + b; }, 0) + 1400;
    var ease = function (t) { return t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3); };
    var lastStep = -1;
    function frame(ms) {
      var t = reduce ? TOTAL - 1500 : ms % TOTAL, acc = 0, step = 0, p = 0;
      for (var i = 0; i < D.length; i++) { if (t < acc + D[i]) { step = i; p = (t - acc) / D[i]; break; } acc += D[i]; step = D.length - 1; p = 1; }
      var done = t >= acc + D[D.length - 1] - 1;
      // 0 scan
      els.grid.setAttribute('opacity', step === 0 ? Math.min(1, p * 3) : step === 1 ? 1 - p : 0);
      els.scan.setAttribute('y', step === 0 ? (p * 300) : -10);
      els.plan.setAttribute('opacity', step <= 1 ? (step === 0 ? ease(p) : 1) : step === 2 ? 1 - p : 0);
      // 1 drill
      var dy = step === 1 ? (p < .6 ? -240 + ease(p / .6) * 240 : -ease((p - .6) / .4) * 240) : -240;
      els.drill.setAttribute('transform', 'translate(0,' + dy + ')');
      els.fl.setAttribute('transform', 'translate(0,' + ((ms / 30) % 16) + ')');
      var hole = step === 1 ? Math.min(1, p / .6) * 90 : step > 1 ? 90 : 0;
      els.hole.setAttribute('height', hole);
      // 2 implant screws in
      var iy = step < 2 ? -280 : step === 2 ? -280 + ease(p) * 280 : 0;
      els.imp.setAttribute('transform', 'translate(0,' + iy + ')');
      els.th.setAttribute('transform', 'translate(0,' + (step === 2 ? ((ms / 25) % 12) - 6 : 0) + ')');
      // 3 abutment
      els.ab.setAttribute('opacity', step < 3 ? 0 : 1);
      els.ab.setAttribute('transform', 'translate(0,' + (step === 3 ? -30 + ease(p) * 30 : step > 3 ? 0 : -30) + ')');
      // 4 crown
      els.cr.setAttribute('opacity', step < 4 ? 0 : Math.min(1, p * 3));
      els.cr.setAttribute('transform', 'translate(0,' + (step === 4 ? -120 + ease(p * 1.3) * 120 : step > 4 ? 0 : -120) + ')');
      els.sp.setAttribute('opacity', step === 4 && p > .75 ? (Math.sin(ms / 120) * .5 + .5) : (done ? .8 : 0));
      if (step !== lastStep) { els.txt.textContent = cap[step]; els.n.textContent = (step + 1) + '/' + cap.length; lastStep = step; }
      for (var j = 0; j < bars.length; j++) bars[j].style.width = (j < step ? 100 : j === step ? p * 100 : 0) + '%';
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function reveal() {
    var items = document.querySelectorAll('main section, .cd, .steps li, details, ul.l li');
    if (!('IntersectionObserver' in window) || reduce) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    items.forEach(function (el, i) {
      el.classList.add('rv');
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 6) * 70 + 'ms';
      io.observe(el);
    });
  }

  function ready(f) { document.readyState !== 'loading' ? f() : document.addEventListener('DOMContentLoaded', f); }
  ready(function () { mount(); reveal(); });
})();
