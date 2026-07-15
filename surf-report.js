/* Coco Surf School — live surf report for Les Bourdaines (Seignosse).
   Weather / waves / water-temp / UV / sun: Open-Meteo (free, no key, browser).
   Tide: /data/tide.json (written a few times a day by the tide GitHub Action from
   Stormglass — the key stays a repo secret and never reaches the browser).
   Today / tomorrow toggle; tide curve drawn from the extremes. */
(function () {
  var el = document.getElementById('surf-report');
  if (!el) return;
  var LAT = 43.6889, LNG = -1.4372;
  var lang = el.getAttribute('data-lang') || 'fr';
  var tideUrl = el.getAttribute('data-tide') || 'data/tide.json';
  var HI = el.getAttribute('data-high') || 'High', LO = el.getAttribute('data-low') || 'Low';
  var locale = { fr: 'fr-FR', nl: 'nl-BE', de: 'de-DE', en: 'en-GB', es: 'es-ES' }[lang] || 'fr-FR';

  function $(id) { return document.getElementById(id); }
  function set(id, v) { var n = $(id); if (n != null) n.textContent = v; }
  function num(v, d) { return (v == null || isNaN(v)) ? '–' : Number(v).toLocaleString(locale, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function hhmm(iso) { try { return new Date(iso).toLocaleTimeString(locale, { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }); } catch (e) { return '–'; } }
  function pDate(iso) { try { return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' }); } catch (e) { return ''; } }
  function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function fail() { el.classList.add('sr-down'); }

  var CT = {
    clear:  { fr: 'Ensoleillé', nl: 'Zonnig', en: 'Clear', de: 'Klar', es: 'Despejado' },
    partly: { fr: 'Peu nuageux', nl: 'Half bewolkt', en: 'Partly cloudy', de: 'Teils bewölkt', es: 'Parcialmente nublado' },
    cloudy: { fr: 'Couvert', nl: 'Bewolkt', en: 'Cloudy', de: 'Bewölkt', es: 'Nublado' },
    fog:    { fr: 'Brouillard', nl: 'Mist', en: 'Fog', de: 'Nebel', es: 'Niebla' },
    rain:   { fr: 'Pluie', nl: 'Regen', en: 'Rain', de: 'Regen', es: 'Lluvia' },
    snow:   { fr: 'Neige', nl: 'Sneeuw', en: 'Snow', de: 'Schnee', es: 'Nieve' },
    storm:  { fr: 'Orage', nl: 'Onweer', en: 'Storm', de: 'Gewitter', es: 'Tormenta' }
  };
  var UVT = {
    low:     { fr: 'Faible', nl: 'Laag', en: 'Low', de: 'Niedrig', es: 'Bajo' },
    mod:     { fr: 'Modéré', nl: 'Matig', en: 'Moderate', de: 'Mäßig', es: 'Moderado' },
    high:    { fr: 'Élevé', nl: 'Hoog', en: 'High', de: 'Hoch', es: 'Alto' },
    vhigh:   { fr: 'Très élevé', nl: 'Zeer hoog', en: 'Very high', de: 'Sehr hoch', es: 'Muy alto' },
    extreme: { fr: 'Extrême', nl: 'Extreem', en: 'Extreme', de: 'Extrem', es: 'Extremo' }
  };
  var ICON = {
    clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3V1.5M12 22.5V21M3 12H1.5M22.5 12H21M5.6 5.6 4.5 4.5M19.5 19.5l-1.1-1.1M18.4 5.6l1.1-1.1M4.5 19.5l1.1-1.1"/></svg>',
    partly: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7.5" r="2.8"/><path d="M8 2.4V1.2M2.4 7.5H1.2M4 3.6 3.1 2.7M12.9 3.6l.9-.9M2.7 12.3l-.9.9"/><path d="M17.5 18a3.6 3.6 0 0 0-.5-7.2 5 5 0 0 0-9.6 1.3A3.4 3.4 0 0 0 7.5 18z"/></svg>',
    cloudy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M17.5 18a4 4 0 0 0-.5-8 5.5 5.5 0 0 0-10.6 1.4A3.8 3.8 0 0 0 6 18z"/></svg>',
    fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 11h11.5a3.8 3.8 0 0 0-.5-7 5.2 5.2 0 0 0-10 1.3A3.5 3.5 0 0 0 6 11z"/><path d="M4 15h13M6 19h9"/></svg>',
    rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 14a4 4 0 0 0-.5-8 5.5 5.5 0 0 0-10.6 1.4A3.8 3.8 0 0 0 6 14z"/><path d="M8 17.5 7 20M12 17.5 11 20M16 17.5 15 20"/></svg>',
    snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 14a4 4 0 0 0-.5-8 5.5 5.5 0 0 0-10.6 1.4A3.8 3.8 0 0 0 6 14z"/><path d="M8 18h.01M12 19h.01M16 18h.01M10 21h.01M14 21h.01"/></svg>',
    storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 13a4 4 0 0 0-.5-8 5.5 5.5 0 0 0-10.6 1.4A3.8 3.8 0 0 0 6 13z"/><path d="m12 12-2 4h3l-1.5 4"/></svg>'
  };
  function group(c) { if (c === 0) return 'clear'; if (c <= 2) return 'partly'; if (c === 3) return 'cloudy'; if (c <= 48) return 'fog'; if (c <= 67) return 'rain'; if (c <= 77) return 'snow'; if (c <= 82) return 'rain'; if (c <= 86) return 'snow'; return 'storm'; }
  function uvInfo(uv) { uv = Math.round(uv || 0); if (uv <= 2) return { c: '#3ea72d', k: 'low' }; if (uv <= 5) return { c: '#d9a300', k: 'mod' }; if (uv <= 7) return { c: '#e8730c', k: 'high' }; if (uv <= 10) return { c: '#d5001c', k: 'vhigh' }; return { c: '#8a3fb0', k: 'extreme' }; }

  function curveSvg(pts) {
    if (!pts.length) return '';
    var W = 300, base = 60, lines = '', dots = '';
    var P = pts.map(function (p) { return { x: p.x, y: p.high ? 16 : 50 }; });
    var d = 'M ' + P[0].x.toFixed(1) + ' ' + P[0].y;
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2.x.toFixed(1) + ' ' + p2.y;
    }
    P.forEach(function (p, i) {
      if (pts[i].high) lines += '<line x1="' + p.x.toFixed(1) + '" y1="' + p.y + '" x2="' + p.x.toFixed(1) + '" y2="' + base + '" stroke="var(--mint-line)" stroke-width="1" stroke-dasharray="2 2"/>';
      dots += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y + '" r="4" fill="var(--coral-deep)"/>';
    });
    return '<svg viewBox="0 0 ' + W + ' 66" preserveAspectRatio="none">' + lines + '<path d="' + d + '" fill="none" stroke="var(--seafoam)" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' + dots + '</svg>';
  }

  function renderTide(dateStr) {
    var wrap = $('sr-tide'), curve = $('sr-curve');
    var ex = TIDES.filter(function (e) { return pDate(e.time) === dateStr; });
    if (!ex.length) { if (wrap) wrap.innerHTML = '<span class="sr-tide-none">–</span>'; if (curve) curve.innerHTML = ''; return; }
    var n = ex.length;
    var pts = ex.map(function (e, i) { return { x: (i + 0.5) / n * 300, high: e.type === 'high' }; });
    if (curve) curve.innerHTML = curveSvg(pts);
    if (wrap) wrap.innerHTML = ex.map(function (e) { return '<span class="sr-tide-pt"><b>' + (e.type === 'high' ? HI : LO) + '</b>' + hhmm(e.time) + '</span>'; }).join('');
  }

  var DAY = [null, null], TIDES = [];

  function render(day) {
    var ds = DAY[day] || DAY[0]; if (!ds) return;
    set('sr-air', num(ds.temp, 0) + '°');
    var ic = $('sr-icon'); if (ic) ic.innerHTML = ICON[group(ds.code)] || ICON.cloudy;
    set('sr-cond', (CT[group(ds.code)] || {})[lang] || '');
    set('sr-wave', num(ds.wave, 1) + ' m');
    set('sr-sunrise', hhmm(ds.sunrise));
    set('sr-sunset', hhmm(ds.sunset));
    set('sr-wind', num(ds.wind, 0));
    var ar = $('sr-arrow'); if (ar) ar.style.transform = 'rotate(' + Math.round((ds.dir || 0) + 180) + 'deg)';
    var uv = uvInfo(ds.uv);
    set('sr-uv', num(ds.uv, 0));
    var badge = $('sr-uvbadge'); if (badge) badge.textContent = (UVT[uv.k] || {})[lang] || '';
    el.style.setProperty('--uv', uv.c);
    renderTide(ds.tideKey);
  }

  // Tabs
  var tabs = el.querySelectorAll('.sr-tab');
  tabs.forEach(function (tb) {
    tb.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); });
      tb.classList.add('is-active');
      render(+tb.getAttribute('data-day') || 0);
    });
  });

  var fc = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LNG +
    '&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,uv_index' +
    '&daily=weather_code,temperature_2m_max,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset' +
    '&wind_speed_unit=kmh&timezone=Europe%2FParis&forecast_days=2';
  var mr = 'https://marine-api.open-meteo.com/v1/marine?latitude=' + LAT + '&longitude=' + LNG +
    '&current=wave_height&daily=wave_height_max&timezone=Europe%2FParis&forecast_days=2';

  Promise.all([getJSON(fc), getJSON(mr).catch(function () { return null; }), getJSON(tideUrl).catch(function () { return null; })])
    .then(function (res) {
      var f = res[0], m = res[1], t = res[2];
      var c = f.current || {}, dl = f.daily || {};
      var md = (m && m.daily) || {}, mc = (m && m.current) || {};
      TIDES = (t && t.extremes) || [];
      DAY[0] = {
        temp: c.temperature_2m, code: c.weather_code, wind: c.wind_speed_10m, dir: c.wind_direction_10m,
        uv: c.uv_index, wave: mc.wave_height, sunrise: dl.sunrise && dl.sunrise[0], sunset: dl.sunset && dl.sunset[0],
        tideKey: dl.time ? dl.time[0] : pDate(new Date().toISOString())
      };
      DAY[1] = {
        temp: dl.temperature_2m_max && dl.temperature_2m_max[1], code: dl.weather_code && dl.weather_code[1],
        wind: dl.wind_speed_10m_max && dl.wind_speed_10m_max[1], dir: dl.wind_direction_10m_dominant && dl.wind_direction_10m_dominant[1],
        uv: dl.uv_index_max && dl.uv_index_max[1], wave: md.wave_height_max && md.wave_height_max[1],
        sunrise: dl.sunrise && dl.sunrise[1], sunset: dl.sunset && dl.sunset[1],
        tideKey: dl.time ? dl.time[1] : ''
      };
      // date label on the "today" tab
      try { set('sr-date', new Date(DAY[0].tideKey).toLocaleDateString(locale, { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' })); } catch (e) {}
      var coef = $('sr-coef'); if (coef) coef.textContent = '';
      render(0);
    })
    .catch(function () { fail(); });
})();
