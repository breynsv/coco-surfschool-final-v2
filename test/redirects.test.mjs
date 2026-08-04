import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

const exists = async (p) => stat(p).then(() => true, () => false);

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

test('the five booking-withhold rules target the correct per-language contact slug', async () => {
  const r = await rules();
  // Slugs differ per language: fr/en/nl all use "contact", de uses "kontakt",
  // es uses "contacto".
  const expected = {
    '/fr/reserver/': '/fr/contact/',
    '/en/book/': '/en/contact/',
    '/nl/reserveren/': '/nl/contact/',
    '/de/buchen/': '/de/kontakt/',
    '/es/reservar/': '/es/contacto/',
  };
  for (const [from, to] of Object.entries(expected)) {
    const rule = r.find(x => x.from === from);
    assert.ok(rule, `no redirect rule for ${from}`);
    assert.equal(rule.to, to, `${from} must redirect to ${to}`);
    assert.equal(rule.code, '301', `${from} must be a 301`);
  }
});

test('the booking-withhold rules also cover the no-trailing-slash form', async () => {
  const r = await rules();
  const expected = {
    '/fr/reserver': '/fr/contact/',
    '/en/book': '/en/contact/',
    '/nl/reserveren': '/nl/contact/',
    '/de/buchen': '/de/kontakt/',
    '/es/reservar': '/es/contacto/',
  };
  for (const [from, to] of Object.entries(expected)) {
    const rule = r.find(x => x.from === from);
    assert.ok(rule, `no no-trailing-slash redirect rule for ${from}`);
    assert.equal(rule.to, to, `${from} must redirect to ${to}`);
    assert.equal(rule.code, '301', `${from} must be a 301`);
  }
});

test('every redirect target that points at a site path resolves to a real emitted page', async () => {
  const r = await rules();
  for (const { from, to } of r) {
    if (!to || /^https?:\/\//.test(to)) continue; // external targets are out of scope
    const rel = to.replace(/^\//, '');
    const resolvesAsPageDir = await exists(join(REPO, rel, 'index.html'));
    const resolvesAsFile = await exists(join(REPO, rel));
    assert.ok(resolvesAsPageDir || resolvesAsFile,
      `redirect ${from} -> ${to} does not resolve to a real emitted page (checked for ` +
      `${rel}index.html and ${rel}) — a redirect to a 404 is worse than no redirect`);
  }
});
