/* Coco Surf School — live surf report for Les Bourdaines (Seignosse).
   Weather/waves/water-temp/UV/sun: Open-Meteo (free, no key, called from the browser).
   Tide: /data/tide.json (written a few times a day by the tide GitHub Action from
   Stormglass — the key stays a repo secret and never reaches the browser). */
(function () {
  var el = document.getElementById('surf-report');
  if (!el) return;
  var LAT = 43.6889, LNG = -1.4372;
  var lang = el.getAttribute('data-lang') || 'fr';
  var tideUrl = el.getAttribute('data-tide') || 'data/tide.json';
  var locale = { fr: 'fr-FR', nl: 'nl-BE', de: 'de-DE', en: 'en-GB', es: 'es-ES' }[lang] || 'fr-FR';

  function $(id) { return document.getElementById(id); }
  function set(id, v) { var n = $(id); if (n) n.textContent = v; }
  function num(v, d) { return (v == null || isNaN(v)) ? '–' : Number(v).toLocaleString(locale, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function hhmm(iso) { try { return new Date(iso).toLocaleTimeString(locale, { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }); } catch (e) { return '–'; } }
  function fail() { el.classList.add('sr-down'); }

  var WMO = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️', 71: '🌨️', 80: '🌦️', 81: '🌧️', 82: '⛈️', 95: '⛈️', 96: '⛈️', 99: '⛈️' };
  var COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  function compass(deg) { return COMPASS[Math.round(((deg % 360) / 22.5)) % 16]; }

  var fc = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LNG +
    '&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,uv_index' +
    '&daily=sunrise,sunset&wind_speed_unit=kmh&timezone=Europe%2FParis&forecast_days=1';
  var mr = 'https://marine-api.open-meteo.com/v1/marine?latitude=' + LAT + '&longitude=' + LNG +
    '&current=wave_height,sea_surface_temperature&timezone=Europe%2FParis';

  function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }

  // Weather + UV + sun (Open-Meteo forecast)
  getJSON(fc).then(function (d) {
    var c = d.current || {};
    set('sr-air', num(c.temperature_2m, 0) + '°');
    var ic = $('sr-air-ic'); if (ic) ic.textContent = WMO[c.weather_code] || '🌊';
    set('sr-wind', num(c.wind_speed_10m, 0));
    set('sr-wind-dir', compass(c.wind_direction_10m || 0));
    set('sr-uv', num(c.uv_index, 0));
    var day = d.daily || {};
    if (day.sunrise) set('sr-sunrise', hhmm(day.sunrise[0]));
    if (day.sunset) set('sr-sunset', hhmm(day.sunset[0]));
  }).catch(function () { fail(); });

  // Waves + water temp (Open-Meteo marine)
  getJSON(mr).then(function (d) {
    var c = d.current || {};
    set('sr-wave', num(c.wave_height, 1) + ' m');
    set('sr-water', num(c.sea_surface_temperature, 0) + '°');
  }).catch(function () { set('sr-wave', '–'); set('sr-water', '–'); });

  // Tide (cached JSON from the Action)
  getJSON(tideUrl).then(function (d) {
    var ex = (d.extremes || []).filter(function (e) { return new Date(e.time).getTime() > Date.now() - 3600e3; }).slice(0, 4);
    var wrap = $('sr-tide');
    if (!wrap) return;
    if (!ex.length) { wrap.innerHTML = '<span class="sr-tide-none">–</span>'; return; }
    var hi = el.getAttribute('data-high') || 'High', lo = el.getAttribute('data-low') || 'Low';
    wrap.innerHTML = ex.map(function (e) {
      return '<span class="sr-tide-pt"><b>' + (e.type === 'high' ? hi : lo) + '</b>' + hhmm(e.time) + '</span>';
    }).join('');
  }).catch(function () { var w = $('sr-tide'); if (w) w.innerHTML = '<span class="sr-tide-none">–</span>'; });
})();
