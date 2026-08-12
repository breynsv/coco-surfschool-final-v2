import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

async function builtTo(extraEnv = {}) {
  const out = await mkdtemp(join(tmpdir(), 'coco-seo-'));
  execFileSync(process.execPath, [join(REPO, 'build.mjs')], {
    env: { ...process.env, COCO_OUT: out, ...extraEnv },
    stdio: 'pipe',
  });
  return out;
}

/**
 * Every assets/images/... referenced by any generated page, deduped. Picks up
 * srcset candidates as well as plain src, since each match is independent.
 *
 * NB: this only walks the five language directories. Root-level pages
 * (index.html, 404.html) live outside fr/en/nl/de/es and are NOT covered here.
 * Their only image reference is the favicon, which every language page also
 * carries. If a root-level page ever references an image no language page does,
 * this walk would miss it.
 */
async function referencedImages(out) {
  const found = new Set();
  const walk = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith('.html')) {
        const html = await readFile(p, 'utf8');
        for (const m of html.matchAll(/assets\/images\/([A-Za-z0-9._-]+)/g)) found.add(m[1]);
      }
    }
  };
  for (const lang of ['fr', 'en', 'nl', 'de', 'es']) await walk(join(out, lang));
  return [...found];
}

/**
 * Guard against a silently-broken walk (e.g. an extension mismatch or a
 * moved output dir) making the tests below pass vacuously on an empty set.
 * The site references well over 10 distinct images, so anything at or
 * under that floor means the walk itself is broken, not that the site is
 * clean.
 */
function assertWalkFound(names) {
  assert.ok(names.length > 10, `image walk found only ${names.length} name(s); the walk itself is broken`);
}

test('every referenced image exists on disk', async () => {
  const out = await builtTo({ PROD: '1' });
  const names = await referencedImages(out);
  assertWalkFound(names);
  const missing = [];
  for (const name of names) {
    try { await stat(join(REPO, 'assets/images', name)); }
    catch { missing.push(name); }
  }
  assert.deepEqual(missing, [], `referenced but absent: ${missing.join(', ')}`);
});

test('no referenced image exceeds 600 KB', async () => {
  const out = await builtTo({ PROD: '1' });
  const names = await referencedImages(out);
  assertWalkFound(names);
  const heavy = [];
  for (const name of names) {
    try {
      const s = await stat(join(REPO, 'assets/images', name));
      if (s.size > 600 * 1024) heavy.push(`${name} (${(s.size / 1048576).toFixed(2)} MB)`);
    } catch { /* covered by the previous test */ }
  }
  assert.deepEqual(heavy, [], `oversized images: ${heavy.join(', ')}`);
});

test('no unreferenced images are shipped', async () => {
  const out = await builtTo({ PROD: '1' });
  const names = await referencedImages(out);
  assertWalkFound(names);
  const used = new Set(names);
  // The favicons are also referenced from the root index.html and 404.html,
  // outside the language dirs — but every language page carries them too, so
  // the walk above already finds them and no exemption is needed.
  //
  // The two flat-graphic masters (the logo and the palm) are deliberately NOT
  // in assets/images: nothing links to them, so they live in masters/ and stay
  // out of the deploy. See MASTERS_DIR in scripts/image-manifest.mjs.
  const orphans = (await readdir(join(REPO, 'assets/images'))).filter(f => !used.has(f));
  assert.deepEqual(orphans, [], `unreferenced images still in repo: ${orphans.length}`);
});

/** Every JSON-LD block on a page, parsed. */
const jsonLdOf = (html) =>
  (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [])
    .map(b => JSON.parse(b.replace(/<\/?script[^>]*>/g, '')));

const CONTACT_SLUGS = { fr: 'contact', en: 'contact', nl: 'contact', de: 'kontakt', es: 'contacto' };

test('FAQ schema covers every rendered FAQ item, in all languages', async () => {
  const out = await builtTo({ PROD: '1' });
  for (const [lang, slug] of Object.entries(CONTACT_SLUGS)) {
    const html = await readFile(join(out, lang, slug, 'index.html'), 'utf8');
    const rendered = (html.match(/<details class="faq-item/g) || []).length;
    const faq = jsonLdOf(html).find(o => o['@type'] === 'FAQPage');
    assert.ok(faq, `${lang}: no FAQPage schema`);
    assert.ok(rendered > 0, `${lang}: no FAQ items rendered`);
    assert.equal(faq.mainEntity.length, rendered,
      `${lang}: ${faq.mainEntity.length} in schema vs ${rendered} rendered`);
  }
});

test('every FAQ answer in schema matches the rendered answer verbatim', async () => {
  const out = await builtTo({ PROD: '1' });
  for (const [lang, slug] of Object.entries(CONTACT_SLUGS)) {
    const html = await readFile(join(out, lang, slug, 'index.html'), 'utf8');
    const faq = jsonLdOf(html).find(o => o['@type'] === 'FAQPage');
    for (const item of faq.mainEntity) {
      const answer = item.acceptedAnswer.text;
      assert.ok(html.includes(`<p>${answer}</p>`),
        `${lang}: schema answer not rendered verbatim: ${answer.slice(0, 60)}…`);
    }
  }
});

/** Walk every generated page in the five language dirs, calling fn(relPath, html). */
async function eachPage(out, fn) {
  let seen = 0;
  const walk = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name === 'index.html') { seen++; await fn(p.replace(out, ''), await readFile(p, 'utf8')); }
    }
  };
  for (const lang of ['fr', 'en', 'nl', 'de', 'es']) await walk(join(out, lang));
  assert.ok(seen >= 50, `page walk found only ${seen} page(s); the walk itself is broken`);
}

test('no page skips a heading level', async () => {
  const out = await builtTo({ PROD: '1' });
  const bad = [];
  await eachPage(out, (rel, html) => {
    const levels = [...html.matchAll(/<h([1-6])[ >]/g)].map(m => Number(m[1]));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) { bad.push(`${rel}: h${levels[i - 1]} -> h${levels[i]}`); break; }
    }
  });
  assert.deepEqual(bad, [], `heading level skipped:\n${bad.join('\n')}`);
});

test('every page has exactly one h1', async () => {
  const out = await builtTo({ PROD: '1' });
  const bad = [];
  await eachPage(out, (rel, html) => {
    const n = (html.match(/<h1[ >]/g) || []).length;
    if (n !== 1) bad.push(`${rel}: ${n} h1`);
  });
  assert.deepEqual(bad, [], `wrong h1 count:\n${bad.join('\n')}`);
});

const SPOT_SLUGS = {
  fr: ['cours-de-surf-hossegor', 'cours-de-surf-seignosse'],
  en: ['surf-lessons-hossegor', 'surf-lessons-seignosse'],
  nl: ['surflessen-hossegor', 'surflessen-seignosse'],
  de: ['surfkurse-hossegor', 'surfkurse-seignosse'],
  es: ['clases-de-surf-hossegor', 'clases-de-surf-seignosse'],
};

test('home schema links the social profiles via sameAs', async () => {
  const out = await builtTo({ PROD: '1' });
  for (const lang of ['fr', 'en', 'nl', 'de', 'es']) {
    const html = await readFile(join(out, lang, 'index.html'), 'utf8');
    const biz = jsonLdOf(html).find(o => o['@type'] === 'SportsActivityLocation');
    assert.ok(biz, `${lang}: no business schema`);
    assert.ok(Array.isArray(biz.sameAs) && biz.sameAs.length >= 2, `${lang}: sameAs missing`);
    assert.ok(biz.sameAs.some(u => u.includes('facebook')), `${lang}: no facebook in sameAs`);
    assert.ok(biz.sameAs.some(u => u.includes('instagram')), `${lang}: no instagram in sameAs`);
  }
});

test('location pages carry business schema', async () => {
  const out = await builtTo({ PROD: '1' });
  for (const [lang, slugs] of Object.entries(SPOT_SLUGS)) {
    for (const slug of slugs) {
      const html = await readFile(join(out, lang, slug, 'index.html'), 'utf8');
      const biz = jsonLdOf(html).find(o => o['@type'] === 'SportsActivityLocation');
      assert.ok(biz, `${lang}/${slug}: no business schema`);
      assert.ok(Array.isArray(biz.sameAs) && biz.sameAs.length >= 2, `${lang}/${slug}: sameAs missing`);
    }
  }
});

test('the schema review count matches the number shown in the rating badge', async () => {
  const out = await builtTo({ PROD: '1' });
  for (const lang of ['fr', 'en', 'nl', 'de', 'es']) {
    const html = await readFile(join(out, lang, 'index.html'), 'utf8');
    const badge = html.match(/<span class="rb-count">(\d+)\+/);
    assert.ok(badge, `${lang}: no rating badge count found`);
    const biz = jsonLdOf(html).find(o => o['@type'] === 'SportsActivityLocation');
    assert.equal(biz.aggregateRating.reviewCount, badge[1],
      `${lang}: schema says ${biz.aggregateRating.reviewCount} but the badge shows ${badge[1]}+`);
  }
});

test('no JSON-LD carries an HTML-escaped URL', async () => {
  const out = await builtTo({ PROD: '1' });
  const bad = [];
  await eachPage(out, (rel, html) => {
    for (const o of jsonLdOf(html)) {
      if (JSON.stringify(o).includes('&amp;')) bad.push(rel);
    }
  });
  assert.deepEqual(bad, [], `HTML entities leaked into JSON-LD:\n${bad.join('\n')}`);
});

test('the two spot pages link to each other', async () => {
  const out = await builtTo({ PROD: '1' });
  for (const [lang, [a, b]] of Object.entries(SPOT_SLUGS)) {
    const ha = await readFile(join(out, lang, a, 'index.html'), 'utf8');
    const hb = await readFile(join(out, lang, b, 'index.html'), 'utf8');
    assert.ok(ha.includes(`${b}/`), `${lang}/${a} does not link to ${b}`);
    assert.ok(hb.includes(`${a}/`), `${lang}/${b} does not link to ${a}`);
  }
});

test('the cross-link appears only on the two spot pages', async () => {
  const out = await builtTo({ PROD: '1' });
  const stray = [];
  await eachPage(out, (rel, html) => {
    if (!html.includes('spot-crosslink')) return;
    const lang = rel.split('/')[1];
    if (!SPOT_SLUGS[lang].some(s => rel.includes(`/${s}/`))) stray.push(rel);
  });
  assert.deepEqual(stray, [], `cross-link on non-spot pages:\n${stray.join('\n')}`);
});

/**
 * Everything the deployed site must NOT expose. These were previously "blocked"
 * by 404 rules in _redirects, which never fired: Cloudflare Pages serves a
 * matching static asset BEFORE consulting _redirects, so a rule can never hide
 * a file that exists. The only real fix is not shipping them.
 */
const MUST_NOT_SHIP = [
  'build.mjs', 'README.md', 'DESIGN.md', 'REPORT-OWNER.md', 'wrangler.toml',
  '.htaccess', '.gitignore', '.dev.vars', '.dev.vars.example',
  'content', 'test', 'docs', 'scripts', '.github', 'functions',
  'booking-preview', 'vragenlijst', 'rapport', '.superpowers', '.impeccable',
  // Image masters for the flat graphics. Nothing links to them, so they exist
  // only to re-run scripts/gen-images.mjs and must stay out of the deploy.
  'masters',
];

/** Everything the deployed site DOES need. */
const MUST_SHIP = [
  'index.html', '404.html', 'sitemap.xml', 'robots.txt', '_redirects',
  'styles.css', 'script.js', 'surf-report.js',
  'assets/images', 'assets/fonts', 'data/tide.json',
  'fr/index.html', 'en/index.html', 'nl/index.html', 'de/index.html', 'es/index.html',
];

test('the deploy build ships no source, config or private files', async () => {
  const out = await builtTo({ PROD: '1' });
  const shipped = new Set(await readdir(out));
  const leaked = MUST_NOT_SHIP.filter(n => shipped.has(n));
  assert.deepEqual(leaked, [], `private files in the deploy output: ${leaked.join(', ')}`);
});

test('the deploy build ships everything the site needs', async () => {
  const out = await builtTo({ PROD: '1' });
  const missing = [];
  for (const rel of MUST_SHIP) {
    try { await stat(join(out, rel)); } catch { missing.push(rel); }
  }
  assert.deepEqual(missing, [], `missing from the deploy output: ${missing.join(', ')}`);
});

/**
 * Petrona is self-hosted, so a missing or renamed .woff2 no longer 404s
 * visibly — the @font-face just never loads and every heading silently falls
 * back to Georgia. Same for any other url() the stylesheet gains.
 */
test('every url() in styles.css resolves in the deploy output', async () => {
  const out = await builtTo({ PROD: '1' });
  const css = await readFile(join(out, 'styles.css'), 'utf8');
  const refs = [...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)]
    .map(m => m[1].trim())
    .filter(u => !/^(data:|https?:|\/\/)/.test(u));
  assert.ok(refs.length > 0, 'no url() found in styles.css; the parse is broken');
  const missing = [];
  for (const ref of refs) {
    // styles.css sits at the site root, so its urls resolve from there.
    try { await stat(join(out, ref.replace(/^\.?\//, '').split('?')[0])); }
    catch { missing.push(ref); }
  }
  assert.deepEqual(missing, [], `styles.css references files the deploy lacks: ${missing.join(', ')}`);
});

test('a dist build without PROD=1 fails instead of deindexing the site', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'coco-dist-'));
  const dist = join(parent, 'dist');
  assert.throws(
    () => execFileSync(process.execPath, [join(REPO, 'build.mjs')], {
      env: { ...process.env, COCO_OUT: dist, PROD: '' },
      stdio: 'pipe',
    }),
    /Refusing to build/,
    'a dist build without PROD=1 must fail, not emit a noindexed site',
  );
});

test('every RENDER key is a page the site actually emits', async () => {
  const src = await readFile(join(REPO, 'build.mjs'), 'utf8');
  const renderKeys = src.match(/^const RENDER = \{([^}]*)\}/m)[1]
    .split(',').map(p => p.split(':')[0].trim()).filter(Boolean);
  const pageKeys = new Set(
    [...src.matchAll(/^ {2}([a-z]+): +\{ +fr: /gm)].map(m => m[1])
  );
  assert.ok(pageKeys.size >= 10, `PAGES parse found only ${pageKeys.size} key(s); the parse is broken`);
  const unreachable = renderKeys.filter(k => !pageKeys.has(k));
  assert.deepEqual(unreachable, [], `RENDER keys with no PAGES entry: ${unreachable.join(', ')}`);
});

/**
 * A same-page fragment link whose target id does not exist fails silently: the
 * browser stays put or lands at the top of the destination page, and nothing
 * logs. The homepage "see the rates" CTA shipped pointing at `#tarieven` while
 * every language rendered the section as `id="tarifs"`, so the highest-intent
 * button on the site quietly dropped visitors above the pricing they asked for.
 * Nothing in the suite noticed, because every page still built and every link
 * still resolved to a real page.
 */
test('every in-page fragment link resolves to an id that exists', async () => {
  const out = await builtTo({ PROD: '1' });
  const pages = new Map();
  const walk = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith('.html')) pages.set(p, await readFile(p, 'utf8'));
    }
  };
  await walk(out);
  assert.ok(pages.size >= 50, `walk found only ${pages.size} page(s); the parse is broken`);

  const idsOf = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  const broken = [];

  for (const [file, html] of pages) {
    for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]*#[^"]+)"/g)) {
      const [path, frag] = m[1].split('#');
      if (!frag || frag.startsWith('!')) continue;
      // Cloudflare rewrites mailto: into /cdn-cgi/l/email-protection#<hash>.
      if (path.startsWith('/cdn-cgi/')) continue;
      if (/^(https?:|mailto:|tel:)/.test(path)) continue;

      // Resolve the link target relative to the page that carries it.
      const targetFile = path === ''
        ? file
        : join(dirname(file), path.endsWith('/') ? join(path, 'index.html') : path);

      const targetHtml = pages.get(targetFile);
      if (targetHtml === undefined) {
        broken.push(`${relative(out, file)} -> ${m[1]} (no such page)`);
        continue;
      }
      if (!idsOf(targetHtml).has(frag)) {
        broken.push(`${relative(out, file)} -> ${m[1]} (no id="${frag}" on target)`);
      }
    }
  }

  assert.deepEqual(broken, [], `fragment links pointing at ids that do not exist:\n  ${broken.join('\n  ')}`);
});
