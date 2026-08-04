import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

/** Run build.mjs into a throwaway directory. Returns that directory. */
async function buildTo(extraEnv = {}) {
  const out = await mkdtemp(join(tmpdir(), 'coco-build-'));
  execFileSync(process.execPath, [join(REPO, 'build.mjs')], {
    env: { ...process.env, COCO_OUT: out, ...extraEnv },
    stdio: 'pipe',
  });
  return out;
}

const read = (dir, rel) => readFile(join(dir, rel), 'utf8');

test('build writes to COCO_OUT instead of the repo root', async () => {
  const out = await buildTo();
  const html = await read(out, 'fr/contact/index.html');
  assert.match(html, /Coco Surf School/);
});

test('preview build keeps noindex on generated pages', async () => {
  const out = await buildTo();
  const html = await read(out, 'fr/contact/index.html');
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
});

test('production build has no noindex on generated pages', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, 'fr/contact/index.html');
  assert.doesNotMatch(html, /noindex/);
});

test('preview robots.txt disallows everything', async () => {
  const out = await buildTo();
  assert.equal(await read(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
});

test('production robots.txt allows crawling and lists the sitemap', async () => {
  const out = await buildTo({ PROD: '1' });
  const txt = await read(out, 'robots.txt');
  assert.doesNotMatch(txt, /Disallow: \/\s*$/m);
  assert.match(txt, /^Allow: \/$/m);
  assert.match(txt, /^Sitemap: https:\/\/www\.coco-surfschool\.com\/sitemap\.xml$/m);
});

test('production root index.html drops noindex', async () => {
  const out = await buildTo({ PROD: '1' });
  assert.doesNotMatch(await read(out, 'index.html'), /noindex/);
});

test('sitemap always uses the www canonical host', async () => {
  const out = await buildTo({ PROD: '1' });
  const xml = await read(out, 'sitemap.xml');
  assert.equal((xml.match(/<loc>/g) || []).length, 50);
  assert.doesNotMatch(xml, /<loc>https:\/\/coco-surfschool\.com/);
});

test('404 page is generated with a link to every language', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, '404.html');
  for (const lang of ['fr', 'nl', 'de', 'en', 'es']) {
    assert.ok(html.includes(`href="/${lang}/"`), `missing link to /${lang}/`);
  }
});

test('404 page uses root-absolute asset paths', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, '404.html');
  assert.match(html, /href="\/styles\.css"/);
  assert.doesNotMatch(html, /(href|src)="(?!\/|https:)/);
});

test('404 page stays noindex even in production', async () => {
  const out = await buildTo({ PROD: '1' });
  assert.match(await read(out, '404.html'), /<meta name="robots" content="noindex">/);
});

test('production omits the booking pages', async () => {
  const out = await buildTo({ PROD: '1' });
  for (const p of ['fr/reserver', 'en/book', 'nl/reserveren', 'de/buchen', 'es/reservar']) {
    await assert.rejects(read(out, `${p}/index.html`), `${p} must not be emitted in production`);
  }
});

test('preview still builds the booking pages', async () => {
  const out = await buildTo();
  const html = await read(out, 'fr/reserver/index.html');
  assert.match(html, /surf-sessions/);
});

test('production sitemap excludes the booking pages', async () => {
  const out = await buildTo({ PROD: '1' });
  const xml = await read(out, 'sitemap.xml');
  assert.equal((xml.match(/<loc>/g) || []).length, 50);
  for (const slug of ['reserver', '/book/', 'reserveren', 'buchen', 'reservar']) {
    assert.ok(!xml.includes(slug), `sitemap must not reference ${slug}`);
  }
});

test('production hero CTA points at contact, not the booking page', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, 'fr/index.html');
  assert.ok(!html.includes('fr/reserver/'), 'no link may target the excluded booking page');
  assert.match(html, /href="\.\.\/fr\/contact\/"/);
});

test('production refuses to build if booking is emitted with a non-https API', async () => {
  await assert.rejects(buildTo({ PROD: '1', COCO_BUILD_BOOK: '1' }), (err) => {
    assert.match(String(err.stderr), /not https/,
      'error output must name which check failed, not just fail silently');
    return true;
  });
});

test('production refuses a booking API host ending in .test even over https', async () => {
  await assert.rejects(
    buildTo({ PROD: '1', COCO_BUILD_BOOK: '1', COCO_API: 'https://coco.membrero.test:8090' }),
    (err) => {
      assert.match(String(err.stderr), /dev\/local host/,
        'error output must name which check failed');
      return true;
    },
  );
});

test('production succeeds with a real https booking API and re-emits the booking pages', async () => {
  const out = await buildTo({ PROD: '1', COCO_BUILD_BOOK: '1', COCO_API: 'https://example.com' });
  const html = await read(out, 'fr/reserver/index.html');
  assert.match(html, /surf-sessions/);
});

test('the committed robots.txt is a production build, not a preview', async () => {
  // Guards against README.md:4's `node build.mjs` (no PROD=1) ever being run
  // and committed over the live site's robots.txt, which would silently
  // deindex it. This reads the REPO's own committed file, not a temp build.
  const txt = await readFile(join(REPO, 'robots.txt'), 'utf8');
  assert.match(txt, /^Allow: \/$/m,
    'committed robots.txt must allow crawling — run PROD=1 node build.mjs before committing');
  assert.match(txt, /^Sitemap: https:\/\/www\.coco-surfschool\.com\/sitemap\.xml$/m);
});
