import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
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
 * Every assets/images/... referenced by any generated page, deduped.
 * NB: this only walks the five language directories. Root-level pages
 * (index.html, 404.html) live outside fr/en/nl/de/es and are NOT covered
 * here — their only image reference (the favicon) is handled separately
 * via the explicit `used.add(...)` below. If a root-level page ever
 * references a non-favicon image, this walk would miss it.
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
  // The favicon is referenced from the root index.html and 404.html, outside the language dirs.
  used.add('ee16c3_71361371647c417f89cde7e315ac662c.png');
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
