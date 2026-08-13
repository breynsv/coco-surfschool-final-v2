import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

async function builtTo(extraEnv = {}) {
  const out = await mkdtemp(join(tmpdir(), 'coco-hdr-'));
  execFileSync(process.execPath, [join(REPO, 'build.mjs')], {
    env: { ...process.env, COCO_OUT: out, ...extraEnv },
    stdio: 'pipe',
  });
  return out;
}

/** The `/*` rule block of _headers, as a plain object. */
async function globHeaders(dir) {
  const raw = await readFile(join(dir, '_headers'), 'utf8');
  const out = {};
  let inGlob = false;
  for (const line of raw.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) { inGlob = line.trim() === '/*'; continue; }
    if (!inGlob) continue;
    const i = line.indexOf(':');
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

test('_headers ships in the deploy output', async () => {
  const out = await builtTo({ PROD: '1' });
  const names = await readdir(out);
  assert.ok(names.includes('_headers'),
    'Cloudflare only reads _headers from the deploy directory; it is missing from STATIC_ASSETS');
});

test('_headers sets the policies Cloudflare does not set by default', async () => {
  const h = await globHeaders(await builtTo({ PROD: '1' }));
  for (const name of [
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'X-Frame-Options',
    'Permissions-Policy',
    'X-Content-Type-Options',
    'Referrer-Policy',
  ]) {
    assert.ok(h[name], `_headers is missing ${name}`);
  }
  assert.match(h['Strict-Transport-Security'], /max-age=\d{7,}/, 'HSTS max-age is too short to be useful');
});

/**
 * The CSP allows exactly one inline script, by hash. That script is the `js`
 * class flag emitted in build.mjs head(); it is what lets the stylesheet tell a
 * JS browser from a no-JS one. Edit the one-liner without recomputing the hash
 * and the browser silently refuses to run it — no console error the visitor
 * sees, just the no-JS styling on every page. This recomputes the hash from the
 * built HTML and compares, so the two cannot drift apart.
 */
test('the CSP hash matches the inline script actually emitted', async () => {
  const out = await builtTo({ PROD: '1' });
  const html = await readFile(join(out, 'fr', 'index.html'), 'utf8');

  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*\btype=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => m[1]);
  assert.equal(inline.length, 1,
    `expected exactly 1 inline executable script, found ${inline.length}; each one needs its own CSP hash`);

  const digest = 'sha256-' + createHash('sha256').update(inline[0], 'utf8').digest('base64');
  const csp = (await globHeaders(out))['Content-Security-Policy'];
  assert.ok(csp.includes(`'${digest}'`),
    `CSP script-src does not allow the inline script that ships.\n  emitted: ${JSON.stringify(inline[0])}\n  needs:   '${digest}'`);
});

/**
 * With a hash present, CSP Level 3 ignores 'unsafe-inline' entirely — so having
 * both is not "belt and braces", it is a weaker-looking policy that buys
 * nothing. Catch anyone adding it back while debugging.
 */
test('script-src does not carry unsafe-inline alongside the hash', async () => {
  const csp = (await globHeaders(await builtTo({ PROD: '1' })))['Content-Security-Policy'];
  const scriptSrc = csp.split(';').map(s => s.trim()).find(s => s.startsWith('script-src'));
  assert.ok(scriptSrc, 'CSP has no script-src directive');
  assert.ok(!scriptSrc.includes('unsafe-inline'),
    `script-src carries both a hash and 'unsafe-inline'; the hash makes it dead weight: ${scriptSrc}`);
});

/**
 * surf-report.js fetches the two Open-Meteo hosts straight from the browser. If
 * connect-src ever loses them the tide/forecast widget dies silently.
 */
test('connect-src covers every host the client-side JS calls', async () => {
  const out = await builtTo({ PROD: '1' });
  const js = await readFile(join(out, 'surf-report.js'), 'utf8');
  const hosts = [...new Set(
    [...js.matchAll(/https:\/\/([a-z0-9.-]+)/gi)].map(m => m[1])
  )];
  assert.ok(hosts.length > 0, 'no https host found in surf-report.js; the parse is broken');

  const csp = (await globHeaders(out))['Content-Security-Policy'];
  const connect = csp.split(';').map(s => s.trim()).find(s => s.startsWith('connect-src'));
  const missing = hosts.filter(h => !connect.includes(h));
  assert.deepEqual(missing, [], `connect-src is missing hosts surf-report.js calls: ${missing.join(', ')}`);
});
