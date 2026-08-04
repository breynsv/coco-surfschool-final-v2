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

/** Every assets/images/... referenced by any generated page, deduped. */
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

test('every referenced image exists on disk', async () => {
  const out = await builtTo({ PROD: '1' });
  const missing = [];
  for (const name of await referencedImages(out)) {
    try { await stat(join(REPO, 'assets/images', name)); }
    catch { missing.push(name); }
  }
  assert.deepEqual(missing, [], `referenced but absent: ${missing.join(', ')}`);
});

test('no referenced image exceeds 600 KB', async () => {
  const out = await builtTo({ PROD: '1' });
  const heavy = [];
  for (const name of await referencedImages(out)) {
    try {
      const s = await stat(join(REPO, 'assets/images', name));
      if (s.size > 600 * 1024) heavy.push(`${name} (${(s.size / 1048576).toFixed(2)} MB)`);
    } catch { /* covered by the previous test */ }
  }
  assert.deepEqual(heavy, [], `oversized images: ${heavy.join(', ')}`);
});

test('no unreferenced images are shipped', async () => {
  const out = await builtTo({ PROD: '1' });
  const used = new Set(await referencedImages(out));
  // The favicon is referenced from the root index.html and 404.html, outside the language dirs.
  used.add('ee16c3_71361371647c417f89cde7e315ac662c.png');
  const orphans = (await readdir(join(REPO, 'assets/images'))).filter(f => !used.has(f));
  assert.deepEqual(orphans, [], `unreferenced images still in repo: ${orphans.length}`);
});
