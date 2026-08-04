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
