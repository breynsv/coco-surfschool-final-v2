// Coco Surf School — design-06 (coral) multipage generator
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fr from './content/fr.mjs';
import en from './content/en.mjs';
import nl from './content/nl.mjs';
import de from './content/de.mjs';
import es from './content/es.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.coco-surfschool.com';
const LANGS = ['fr', 'nl', 'de', 'en', 'es'];
const XDEFAULT = 'fr';
const C = { fr, en, nl, de, es };
const OGLOCALE = { fr: 'fr_FR', en: 'en_GB', nl: 'nl_BE', de: 'de_DE', es: 'es_ES' };
const LANGNAME = { fr: 'Français', en: 'English', nl: 'Nederlands', de: 'Deutsch', es: 'Español' };
const FLAG = { fr: '🇫🇷', nl: '🇳🇱', de: '🇩🇪', en: '🇬🇧', es: '🇪🇸' };

const PAGES = {
  home:      { fr: '',                        en: '',                       nl: '',                     de: '',                     es: '' },
  lessons:   { fr: 'cours-de-surf',           en: 'surf-lessons',           nl: 'surflessen',           de: 'surfkurse',            es: 'clases-de-surf' },
  coach:     { fr: 'monitrice-de-surf',       en: 'surf-coach',             nl: 'surfcoach',            de: 'surf-coach',           es: 'monitora-de-surf' },
  stay:      { fr: 'hebergement',             en: 'accommodation',          nl: 'accommodatie',         de: 'unterkunft',           es: 'alojamiento' },
  contact:   { fr: 'contact',                 en: 'contact',                nl: 'contact',              de: 'kontakt',              es: 'contacto' },
  hossegor:  { fr: 'cours-de-surf-hossegor',  en: 'surf-lessons-hossegor',  nl: 'surflessen-hossegor',  de: 'surfkurse-hossegor',   es: 'clases-de-surf-hossegor' },
  seignosse: { fr: 'cours-de-surf-seignosse', en: 'surf-lessons-seignosse', nl: 'surflessen-seignosse', de: 'surfkurse-seignosse',  es: 'clases-de-surf-seignosse' },
  team:      { fr: 'team-building-surf',      en: 'team-building',          nl: 'surf-teambuilding',    de: 'surf-teambuilding',    es: 'surf-team-building' },
  learn:     { fr: 'apprendre-a-surfer',      en: 'learn-to-surf',          nl: 'leren-surfen',         de: 'surfen-lernen',        es: 'aprender-a-surfear' },
};
const KEYS = Object.keys(PAGES);
const NAV = ['lessons', 'coach', 'stay', 'contact'];

const abs = (lang, key) => `${SITE}/${lang}/${PAGES[key][lang] ? PAGES[key][lang] + '/' : ''}`;

function urls(lang, key) {
  const depth = PAGES[key][lang] === '' ? 1 : 2;
  const root = '../'.repeat(depth);
  const u = {
    root, css: root + 'styles.css', js: root + 'script.js', logo: root + 'assets/images/ee16c3_71361371647c417f89cde7e315ac662c.png',
    img: (n) => root + 'assets/images/' + n,
    wa: 'https://wa.me/33647454265?text=' + encodeURIComponent(C[lang].waText),
  };
  for (const k of KEYS) u[k] = root + lang + '/' + (PAGES[k][lang] ? PAGES[k][lang] + '/' : '');
  u.alt = {};
  for (const l of LANGS) u.alt[l] = root + l + '/' + (PAGES[key][l] ? PAGES[key][l] + '/' : '');
  return u;
}

// shared, real Google reviews (kept as-is across languages)
const REVIEWS = {
  fr: [
    ['R', 'Rozenn Laliat', 'Merci Annelies pour ton énergie et ta pédagogie ! Je suis ravie de t’avoir eu comme encadrante dans le cadre de ma première retraite de surf &amp; yoga'],
    ['L', 'L R', 'Superbe expérience de surf avec Annelies (surf coach) ! Que des bons souvenirs et les cours TOP. Des petits groupes et une super ambiance.'],
    ['N', 'nicolas berdery', 'Très bon professeur(e) ! Belle pédagogie et belle méthode ! Nous avons beaucoup progressé grâce à Annelise. Nous recommandons vivement !'],
    ['E', 'Emmanuelle M. Balaguer', 'Annelies est une prof super good vibes. J’ai adoré sa pédagogie et son énergie. Je garde un super souvenir de notre week end surf !'],
    ['F', 'Fabrice Buysschaert', 'Super expérience avec Coco Surf. Annelies, en plus d’être très sympa, est super pédagogue. Une première vraie vague surfée au bout de 4 jours !'],
    ['A', 'Audrey Montegut', 'C’était mon premier cours de surf. J’ai adoré la pédagogie d’Annelise et je reprendrai volontiers un ou plusieurs cours avec elle. Merci beaucoup !'],
    ['D', 'Dounia Morsy', 'Je garde un super souvenir de notre stage de surf en famille. Annelies nous a communiqué sa bonne humeur et surtout nous a fait progresser. Je recommande !'],
  ],
  en: [
    ['R', 'Rozenn Laliat', 'Thank you Annelies for your energy and your teaching! I was delighted to have you as my instructor for my very first surf &amp; yoga retreat.'],
    ['L', 'L R', 'Superb surf experience with Annelies (surf coach)! Nothing but great memories and top lessons. Small groups and a lovely atmosphere.'],
    ['N', 'nicolas berdery', 'A really good teacher! Great teaching and method — we progressed so much thanks to Annelies. We highly recommend!'],
    ['E', 'Emmanuelle M. Balaguer', 'Annelies is a super good-vibes teacher. I loved her teaching and her energy. I have a wonderful memory of our surf weekend!'],
    ['F', 'Fabrice Buysschaert', 'Great experience with Coco Surf. Annelies is really friendly and a fantastic teacher. I surfed my first real wave after 4 days!'],
    ['A', 'Audrey Montegut', 'It was my first surf lesson. I loved Annelies’ teaching and I’d gladly take one or more lessons with her again. Thank you so much!'],
    ['D', 'Dounia Morsy', 'I have a wonderful memory of our family surf camp. Annelies shared her good mood with us and, above all, helped us make real progress. Highly recommend!'],
  ],
  nl: [
    ['R', 'Rozenn Laliat', 'Bedankt Annelies voor je energie en je aanpak! Ik was zo blij dat jij mijn lesgever was tijdens mijn allereerste surf- &amp; yogaretreat.'],
    ['L', 'L R', 'Geweldige surfervaring met Annelies (surfcoach)! Alleen maar mooie herinneringen en toplessen. Kleine groepjes en een heerlijke sfeer.'],
    ['N', 'nicolas berdery', 'Een heel goede lesgever! Fijne aanpak en methode — we zijn enorm vooruitgegaan dankzij Annelies. Echt een aanrader!'],
    ['E', 'Emmanuelle M. Balaguer', 'Annelies is een lesgever met super good vibes. Ik was dol op haar aanpak en haar energie. Ik heb een heerlijke herinnering aan ons surfweekend!'],
    ['F', 'Fabrice Buysschaert', 'Toffe ervaring met Coco Surf. Annelies is niet alleen heel sympathiek, maar ook een fantastische lesgever. Na 4 dagen mijn eerste echte golf gesurft!'],
    ['A', 'Audrey Montegut', 'Het was mijn eerste surfles. Ik was dol op de aanpak van Annelies en ik neem graag nog een les met haar. Heel erg bedankt!'],
    ['D', 'Dounia Morsy', 'Ik heb een heerlijke herinnering aan onze surfstage met het gezin. Annelies deelde haar goede humeur en liet ons vooral echt vooruitgaan. Een aanrader!'],
  ],
};
const G_LOGO = '<symbol id="g-logo" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></symbol>';
const WA_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16c0 3.5 1.128 6.744 3.046 9.38L1.05 31.3l6.128-1.96A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.826 32 16S24.826 0 16.004 0Zm9.318 22.6c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.604-1.204-4.7-1.948-7.726-6.724-7.962-7.034-.226-.31-1.9-2.53-1.9-4.826 0-2.296 1.166-3.424 1.636-3.904.386-.394.914-.574 1.42-.574.164 0 .312.008.446.014.408.018.612.042.88.684.334.804 1.146 2.79 1.244 2.994.1.204.166.442.03.752-.128.31-.24.446-.442.684-.204.238-.398.42-.602.676-.186.222-.396.462-.16.868.236.398 1.05 1.73 2.256 2.802 1.556 1.386 2.844 1.816 3.29 2.002.334.138.732.106 1.006-.204.35-.398.78-1.058 1.216-1.71.31-.462.7-.52 1.108-.366.42.146 2.65 1.25 2.964 1.408.31.158.516.234.592.366.076.132.076.766-.31 1.856Z"/></svg>';

function head(lang, key, c) {
  const t = c.pages[key], u = urls(lang, key);
  const alt = LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${abs(l, key)}">`).join('\n');
  const ld = t.jsonld ? `\n<script type="application/ld+json">\n${JSON.stringify(t.jsonld, null, 2)}\n</script>` : '';
  const ogImg = `${SITE}/assets/images/${t.ogImage || 'a29fce_9ddbf1309cf04bb189e246d843dfc188.jpg'}`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className+=' js'</script>
<meta name="robots" content="noindex, nofollow">
<title>${t.title}</title>
<meta name="description" content="${t.desc}">
<link rel="canonical" href="${abs(lang, key)}">
${alt}
<link rel="alternate" hreflang="x-default" href="${abs(XDEFAULT, key)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${OGLOCALE[lang]}">
<meta property="og:site_name" content="Coco Surf School">
<meta property="og:title" content="${t.ogTitle || t.title}">
<meta property="og:description" content="${t.ogDesc || t.desc}">
<meta property="og:url" content="${abs(lang, key)}">
<meta property="og:image" content="${ogImg}">
<meta name="theme-color" content="#23413A">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${u.css}?v=4">
<link rel="icon" href="${u.logo}" type="image/png">${ld}
</head>`;
}

function header(lang, key, c) {
  const u = urls(lang, key), ui = c.ui;
  const nav = NAV.map(k => `<li><a href="${u[k]}"${k === key ? ' aria-current="page"' : ''}>${ui.nav[k]}</a></li>`).join('\n        ');
  const lsw = LANGS.map(l => `<a href="${u.alt[l]}"${l === lang ? ' aria-current="true"' : ''} hreflang="${l}" title="${LANGNAME[l]}"><span aria-hidden="true">${FLAG[l]}</span> ${l.toUpperCase()}</a>`).join('\n        ');
  return `<body id="top">
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${u.home}" aria-label="Coco Surf School">
      <img src="${u.logo}" alt="Logo Coco Surf School" width="46" height="46">
      <span class="brand-text"><b>Coco Surf School</b><span>Seignosse · Hossegor</span></span>
    </a>
    <nav class="nav" id="mainnav" aria-label="${ui.navLabel}">
      <ul class="nav-links">
        ${nav}
      </ul>
      <a class="btn btn--primary btn--sm" href="${u.contact}">${ui.book}</a>
      <div class="lang-switch" role="group" aria-label="${ui.langLabel}">
        ${lsw}
      </div>
    </nav>
    <button class="nav-toggle" aria-label="${ui.menuOpen}" aria-expanded="false" aria-controls="mainnav"><span></span></button>
  </div>
</header>
<div class="nav-scrim"></div>`;
}

function crumbs(lang, key, c) {
  if (key === 'home') return '';
  const u = urls(lang, key), t = c.pages[key];
  return `<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap"><a href="${u.home}">${c.ui.crumbHome}</a><span class="sep">/</span><span aria-current="page">${t.crumb || t.h1}</span></div></nav>`;
}

function footer(lang, key, c) {
  const u = urls(lang, key), ui = c.ui;
  const navcol = NAV.map(k => `<li><a href="${u[k]}">${ui.nav[k]}</a></li>`).join('\n          ');
  const flangs = LANGS.map(l => `<a href="${u.alt[l]}" hreflang="${l}">${l.toUpperCase()}</a>`).join('\n        ');
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="${u.logo}" alt="Logo Coco Surf School" width="66" height="66">
        <p>${ui.footTagline}</p>
      </div>
      <div class="footer-col">
        <h4>${ui.footNav}</h4>
        <ul>
          ${navcol}
          <li><a href="${u.learn}">${ui.nav.learn || 'Learn to surf'}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:+33647454265">06 47 45 42 65</a></li>
          <li><a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a></li>
          <li>Seignosse · Hossegor, Landes</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Coco Surf School · SIRET 819 825 613 00030</span>
      <span class="lang-inline">${ui.langWord} :
        ${flangs}
      </span>
    </div>
  </div>
</footer>
<a class="wa-fab" href="${u.wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_SVG}</a>
<script src="${u.js}" defer></script>
</body>
</html>`;
}

/* ---------- shared section fragments ---------- */
function trustBar(t) {
  return `<section class="trust"><div class="wrap trust-grid">
    ${t.trust.map(i => `<div class="trust-item"><span class="ic">${i.ic}</span><div><b>${i.b}</b><span>${i.s}</span></div></div>`).join('\n    ')}
  </div></section>`;
}
function lessonCards(u, cards, from = true) {
  return cards.map((c, i) => `<article class="lesson-card reveal">
      <div class="lesson-pic"><img src="${u.img(c.img)}" alt="${c.alt}" width="1600" height="1600" loading="lazy" decoding="async"></div>
      <div class="card-head"><h3>${c.title}</h3>${c.from ? `<span class="from">${c.from}</span>` : `<span class="num">0${i + 1}</span>`}</div>
      <p>${c.p}</p>
      <div class="chips">${c.chips.map(ch => `<span class="chip">${ch}</span>`).join('')}</div>
    </article>`).join('\n    ');
}
function reviewsSection(t, lang) {
  return `<section class="section" id="reviews">
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${G_LOGO}</svg>
  <div class="wrap">
    <div class="reviews-head reveal">
      <div><p class="eyebrow">${t.reviews.eyebrow}</p><h2 class="section-title">${t.reviews.title}</h2></div>
      <div class="reviews-summary">
        <svg class="g-mark" viewBox="0 0 48 48" role="img" aria-label="Google"><use href="#g-logo"/></svg>
        <div><div class="rs-score"><b>5,0</b><span class="stars" aria-hidden="true">★★★★★</span></div><p class="rs-sub">${t.reviews.sub}</p></div>
        <a class="btn btn--ghost btn--sm reviews-cta" href="https://www.google.com/maps/search/?api=1&amp;query=Coco%20Surf%20School%20Seignosse" target="_blank" rel="noopener">${t.reviews.cta}</a>
      </div>
    </div>
    <div class="reviews-carousel reveal" role="region" aria-roledescription="carousel" aria-label="${t.reviews.title}">
      <div class="reviews-track">
        ${(REVIEWS[lang] || REVIEWS.fr).map(([in_, name, text]) => `<article class="review-card"><header class="rc-head"><span class="rc-avatar" aria-hidden="true">${in_}</span><div class="rc-id"><b>${name}</b><span class="rc-stars" aria-label="5/5">★★★★★</span></div><svg class="rc-g" viewBox="0 0 48 48" role="img" aria-label="Google"><use href="#g-logo"/></svg></header><p class="rc-text">${text}</p></article>`).join('\n        ')}
      </div>
      <div class="reviews-controls">
        <button type="button" class="review-btn" data-dir="prev" aria-label="prev">‹</button>
        <div class="review-dots" role="tablist"></div>
        <button type="button" class="review-btn" data-dir="next" aria-label="next">›</button>
      </div>
    </div>
  </div>
</section>`;
}

/* ---------- page renderers ---------- */
const R = {
  home(u, t, ui, lang) {
    const h = t.hero;
    return `
<section class="hero" id="accueil">
  <img class="palm-mark" src="${u.img('41a3c55f3d76b98ad1058e6d4a659856.png')}" alt="" aria-hidden="true" width="240" height="240" style="top:-40px;right:-30px;width:230px" loading="lazy">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${h.eyebrow}</p>
      <h1>${h.h1}</h1>
      <p class="lead">${h.lead}</p>
      <div class="hero-cta"><a class="btn btn--primary" href="${u.contact}">${h.cta1}</a><a class="btn btn--ghost" href="${u.lessons}">${h.cta2}</a>${h.cta3 ? `<a class="btn btn--coral" href="${u.lessons}#tarieven">${h.cta3}</a>` : ''}</div>
      <div class="hero-facts">${h.facts.map(f => `<div class="hero-fact"><b>${f.b}</b><span>${f.s}</span></div>`).join('')}</div>
    </div>
    <div class="hero-media">
      <img src="${u.img('owner-hero.png')}" alt="${h.imgAlt}" width="1536" height="1447" fetchpriority="high" decoding="async">
      <div class="hero-badge"><span class="dot">🌊</span><span><b>${h.badge1}</b><span>${h.badge2}</span></span></div>
    </div>
  </div>
</section>
${trustBar(t)}
<section class="section" id="filosofie">
  <div class="wrap">
    <div class="section-head center reveal"><p class="eyebrow">${t.philosophy.eyebrow}</p><h2 class="section-title" style="margin-inline:auto">${t.philosophy.title}</h2><p class="lead" style="margin-inline:auto">${t.philosophy.lead}</p></div>
    <div class="philo-grid">${t.philosophy.points.map(pt => `<div class="extra-card reveal"><h4>${pt.h}</h4><p>${pt.p}</p></div>`).join('')}</div>
  </div>
</section>
<section class="section" id="cours">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">${t.lessonsT.eyebrow}</p><h2 class="section-title">${t.lessonsT.title}</h2><p class="lead">${t.lessonsT.lead}</p></div>
    <div class="lessons-grid">
      ${lessonCards(u, t.lessonsT.cards)}
    </div>
    <p style="text-align:center;margin:1.1rem 0 0"><a class="btn btn--ghost" href="${u.lessons}">${t.lessonsT.more}</a></p>
  </div>
</section>
<section class="section section--tint">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">${t.spots.eyebrow}</p><h2 class="section-title">${t.spots.title}</h2><p class="lead">${t.spots.lead}</p></div>
    <div class="spots-grid">
      <a class="spot-card reveal" href="${u.seignosse}"><img src="${u.img('a29fce_571dd78100a24c038429f1bfaf22b936.jpg')}" alt="${t.spots.seignosse.alt}" width="1600" height="1600" loading="lazy"><div class="sc-body"><h3>${t.spots.seignosse.h}</h3><p>${t.spots.seignosse.p}</p></div></a>
      <a class="spot-card reveal" href="${u.hossegor}"><img src="${u.img('owner-hossegor.png')}" alt="${t.spots.hossegor.alt}" width="1537" height="1023" loading="lazy"><div class="sc-body"><h3>${t.spots.hossegor.h}</h3><p>${t.spots.hossegor.p}</p></div></a>
    </div>
  </div>
</section>
${reviewsSection(t, lang)}
<section class="section section--tint">
  <div class="wrap teaser-split">
    <div class="ts-media reveal"><img src="${u.img('a29fce_449771ae1e2d4c52aa0fbe3159160d3b.jpg')}" alt="${t.coachT.alt}" width="1600" height="1600" loading="lazy"></div>
    <div class="ts-body reveal"><h2>${t.coachT.title}</h2><p class="coach-quote">${t.coachT.quote}</p><p>${t.coachT.p}</p><p><a class="btn btn--ghost" href="${u.coach}">${t.coachT.cta}</a></p></div>
  </div>
</section>
<section class="cta-band"><div class="wrap"><div><h2>${t.cta.h}</h2><p>${t.cta.p}</p></div><div class="hero-cta"><a class="btn btn--coral" href="${u.contact}">${t.cta.b1}</a><a class="btn btn--ghost" href="${u.wa}" target="_blank" rel="noopener">${t.cta.b2}</a></div></div></section>`;
  },

  lessons(u, t, ui) {
    return `
<section class="page-hero"><div class="wrap"><div class="ph-copy reveal"><p class="eyebrow">${t.eyebrow}</p><h1>${t.h1html}</h1><p class="lead">${t.lead}</p><div class="hero-cta"><a class="btn btn--primary" href="${u.contact}">${t.cta1}</a><a class="btn btn--ghost" href="${u.wa}" target="_blank" rel="noopener">${t.cta2}</a></div></div></div></section>
<section class="section"><div class="wrap"><div class="lessons-grid">
  ${lessonCards(u, t.cards)}
</div><p class="lessons-note reveal"><span>💡</span><span>${t.note}</span></p></div></section>
<section class="section section--tint" id="tarifs"><div class="wrap">
  <div class="section-head center reveal"><p class="eyebrow">${t.rates.eyebrow}</p><h2 class="section-title" style="margin-inline:auto">${t.rates.title}</h2><p class="lead" style="margin-inline:auto">${t.rates.lead}</p></div>
  <div class="rates-grid">
    ${t.rates.cards.map(rc => `<article class="rate-card${rc.featured ? ' featured' : ''} reveal"><div class="rate-head"><h3>${rc.h}</h3>${rc.flag ? `<span class="flag">${rc.flag}</span>` : ''}</div><p class="sub">${rc.sub}</p><ul class="price-list">${rc.lines.map(l => `<li><span>${l[0]}</span><span class="p">${l[1]}</span></li>`).join('')}</ul><p class="incl">${rc.incl}</p></article>`).join('\n    ')}
  </div>
  <div class="rates-extra">${t.rates.extra.map(e => `<div class="extra-card reveal"><h4>${e.h}</h4><p>${e.p}</p></div>`).join('')}</div>
</div></section>`;
  },

  coach(u, t, ui) {
    return `
<section class="section section--tint" id="coach" style="padding-top:clamp(2.4rem,5vw,3.4rem)"><div class="wrap coach-grid">
  <div class="coach-photo reveal"><img src="${u.img('owner-coach.png')}" alt="${t.imgAlt}" width="1448" height="1086" fetchpriority="high" decoding="async"></div>
  <div class="coach-body reveal">
    <p class="eyebrow">${t.eyebrow}</p>
    <h1 class="section-title">${t.h1}</h1>
    <p class="coach-quote">${t.quote}</p>
    ${t.body.map(p => `<p>${p}</p>`).join('\n    ')}
    <p class="coach-sign">— Annelies</p>
    <div class="diplomas"><h4>${t.dipTitle}</h4><ul class="diploma-list">${t.diplomas.map(d => `<li><b>${d[0]}</b> ${d[1]}</li>`).join('')}</ul></div>
    <p style="margin-top:1.6rem"><a class="btn btn--primary" href="${u.contact}">${t.cta}</a></p>
  </div>
</div></section>`;
  },

  stay(u, t, ui) {
    return `
<section class="page-hero"><div class="wrap"><div class="ph-copy reveal"><p class="eyebrow">${t.eyebrow}</p><h1>${t.h1html}</h1><p class="lead">${t.lead}</p></div></div></section>
<section class="section"><div class="wrap"><div class="stay-grid">
  ${t.cards.map(s => `<article class="stay-card reveal"><span class="pin">${s.pin}</span><h3>${s.h}</h3><p>${s.p}</p><a class="link" href="${s.href}"${s.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${s.link}</a></article>`).join('\n  ')}
</div></div></section>`;
  },

  srilanka(u, t, ui) {
    return `
<section class="section srilanka" style="padding-top:clamp(2.4rem,5vw,3.4rem)"><div class="wrap">
  <div class="sl-banner reveal"><img src="${u.img('a29fce_dcf84276ce074f1eaa9dba99897623be.jpg')}" alt="${t.bannerAlt}" width="1600" height="1600" fetchpriority="high" decoding="async"><div class="cap"><p class="eyebrow">${t.eyebrow}</p><h1>${t.h1}</h1></div></div>
  <div class="sl-body">
    <div class="reveal">${t.body.map(p => `<p>${p}</p>`).join('')}<p class="sl-ayubowan">Ayubowan !</p><p style="margin-top:1.4rem"><a class="btn btn--coral" href="${u.contact}">${t.cta}</a></p></div>
    <div class="sl-gallery reveal">
      <img src="${u.img('a29fce_becd34756fab44a98c1b1e602e5a8b11.jpg')}" alt="${t.g1}" width="1600" height="1600" loading="lazy">
      <img src="${u.img('a29fce_2486b6dfe856444ebe10266f32e3ea95.jpg')}" alt="${t.g2}" width="1600" height="1600" loading="lazy">
      <img src="${u.img('a29fce_aec7b4e0cf3346c5b67e02ffdbaa8088_d_1920_1280_s_2.jpg')}" alt="${t.g3}" width="1600" height="1600" loading="lazy">
    </div>
  </div>
</div></section>`;
  },

  contact(u, t, ui) {
    return `
<section class="section section--tint" id="contact" style="padding-top:clamp(2.4rem,5vw,3.4rem)"><div class="wrap contact-grid">
  <div class="contact-info reveal">
    <p class="eyebrow">${t.eyebrow}</p><h1 class="section-title">${t.h1}</h1><p class="lead">${t.lead}</p>
    <ul class="contact-lines">
      <li><span class="ic">📞</span><div><b>${t.phone}</b><a href="tel:+33647454265">06 47 45 42 65</a></div></li>
      <li><span class="ic">💬</span><div><b>WhatsApp</b><a href="${u.wa}" target="_blank" rel="noopener">06 47 45 42 65</a></div></li>
      <li><span class="ic">✉️</span><div><b>Email</b><a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a></div></li>
      <li><span class="ic">📍</span><div><b>${t.where}</b><span>Seignosse — Les Bourdaines &amp; Hossegor, Landes</span></div></li>
    </ul>
    <p class="deposit-note">${t.deposit}</p>
  </div>
  <form class="contact-form reveal" data-mailto="cocobosurfschool@gmail.com" novalidate>
    <div class="field"><label for="c-name">${t.fName}</label><input id="c-name" name="name" type="text" autocomplete="name" required></div>
    <div class="field"><label for="c-email">${t.fEmail}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="c-msg">${t.fMsg}</label><textarea id="c-msg" name="message" placeholder="${t.fPlaceholder}" required></textarea></div>
    <button type="submit" class="btn btn--coral">${t.send}</button>
  </form>
</div></section>
<section class="section" id="faq"><div class="wrap">
  <div class="section-head center reveal"><p class="eyebrow">FAQ</p><h2 class="section-title" style="margin-inline:auto">${t.faqTitle}</h2></div>
  <div class="faq-list">${t.faq.map(f => `<details class="faq-item reveal"><summary>${f.q}<span class="chev">+</span></summary><div class="faq-body"><p>${f.a}</p></div></details>`).join('')}</div>
</div></section>`;
  },

  article(u, t, ui) {
    return `
<section class="page-hero has-media"><div class="wrap">
  <div class="ph-copy reveal"><p class="eyebrow">${t.eyebrow}</p><h1>${t.h1html}</h1><p class="lead">${t.lead}</p><div class="hero-cta"><a class="btn btn--primary" href="${u.contact}">${t.cta1}</a><a class="btn btn--ghost" href="${u.lessons}">${t.cta2}</a></div></div>
  <div class="ph-media reveal"><img src="${u.img(t.img)}" alt="${t.imgAlt}" width="1600" height="1600" fetchpriority="high" decoding="async"></div>
</div></section>
<section class="section"><div class="wrap article-grid">
  <div class="prose reveal">${t.body}</div>
  <aside class="aside-card reveal"><h3>${t.aside.h}</h3><p>${t.aside.p}</p><div class="mini"><a href="tel:+33647454265">06 47 45 42 65</a><a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a></div><a class="btn btn--primary" href="${u.contact}">${t.aside.b1}</a><a class="btn btn--ghost" href="${u.wa}" target="_blank" rel="noopener">${t.aside.b2}</a></aside>
</div></section>`;
  },
};
const RENDER = { home: R.home, lessons: R.lessons, coach: R.coach, stay: R.stay, srilanka: R.srilanka, contact: R.contact, hossegor: R.article, seignosse: R.article, team: R.article, learn: R.article };

async function build() {
  let n = 0;
  for (const lang of LANGS) {
    const c = C[lang];
    for (const key of KEYS) {
      const u = urls(lang, key), t = c.pages[key];
      const main = RENDER[key](u, t, c.ui, lang);
      const html = head(lang, key, c) + '\n' + header(lang, key, c) + '\n' + crumbs(lang, key, c) + '\n<main>\n' + main + '\n</main>\n' + footer(lang, key, c);
      const dir = join(ROOT, lang, PAGES[key][lang]);
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, 'index.html'), html, 'utf8');
      n++;
    }
  }
  // sitemap + robots
  const urlset = [];
  for (const key of KEYS) for (const lang of LANGS) {
    const alts = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(l, key)}"/>`).join('\n');
    urlset.push(`  <url>\n    <loc>${abs(lang, key)}</loc>\n${alts}\n  </url>`);
  }
  await writeFile(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlset.join('\n')}\n</urlset>\n`);
  await writeFile(join(ROOT, 'robots.txt'), `User-agent: *\nDisallow: /\n`);
  // root redirect
  await writeFile(join(ROOT, 'index.html'), `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Coco Surf School</title><link rel="icon" href="assets/images/ee16c3_71361371647c417f89cde7e315ac662c.png"><script>var s={fr:1,en:1,nl:1,de:1,es:1},l=(navigator.languages||[navigator.language||'fr']),p='fr';for(var i=0;i<l.length;i++){var x=(l[i]||'').slice(0,2).toLowerCase();if(s[x]){p=x;break}}location.replace('./'+p+'/')</script></head><body><p style="font-family:sans-serif;text-align:center;padding:2rem">Coco Surf School — <a href="./fr/">Français</a> · <a href="./en/">English</a> · <a href="./nl/">Nederlands</a></p></body></html>\n`);
  console.log('Generated ' + n + ' pages + sitemap + robots + redirect');
}
build().catch(e => { console.error(e); process.exit(1); });
