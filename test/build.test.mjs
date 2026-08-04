import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

/** Run build.mjs into a throwaway directory. Returns that directory. */
export async function buildTo(extraEnv = {}) {
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
  assert.equal((xml.match(/<loc>/g) || []).length, 55);
  assert.doesNotMatch(xml, /<loc>https:\/\/coco-surfschool\.com/);
});
