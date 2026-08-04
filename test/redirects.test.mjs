import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

const rules = async () =>
  (await readFile(join(REPO, '_redirects'), 'utf8'))
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('/'))
    .map(l => {
      const [from, to, code] = l.split(/\s+/);
      return { from, to, code };
    });

test('every Wix Bookings service URL has a redirect', async () => {
  const r = await rules();
  const find = f => r.find(x => x.from === f);
  for (const path of [
    '/service-page/deluxe-group-lesson',
    '/service-page/ashtanga-yoga-introduction',
    '/service-page/ashtanga-yoga-intermédiaire',
    '/service-page/ashtanga-yoga-interm%C3%A9diaire',
    '/service-page/yoga-prénatal',
    '/service-page/yoga-pr%C3%A9natal',
  ]) {
    const rule = find(path);
    assert.ok(rule, `no redirect rule for ${path}`);
    assert.equal(rule.code, '301', `${path} must be a 301`);
    assert.match(rule.to, /^\/(fr|en|nl|de|es)\//, `${path} must target a language path`);
  }
});

test('the service-page splat is last among service-page rules', async () => {
  const r = await rules();
  const idx = r.findIndex(x => x.from === '/service-page/*');
  assert.ok(idx >= 0, 'missing /service-page/* backstop');
  const after = r.slice(idx + 1).filter(x => x.from.startsWith('/service-page/'));
  assert.deepEqual(after, [], '_redirects is first-match-wins; the splat must come last');
});

test('there is no global catch-all redirect', async () => {
  const r = await rules();
  assert.equal(r.find(x => x.from === '/*'), undefined,
    'a global /* catch-all creates soft-404s and must not be added');
});
