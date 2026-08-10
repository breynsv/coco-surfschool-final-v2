import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/_middleware.js';

/** Minimal stand-in for the Pages context: next() returns the "static asset". */
const contextFor = (url, res = new Response('<html></html>', {
  status: 200,
  headers: { 'content-type': 'text/html' },
})) => ({ request: new Request(url), next: async () => res });

test('the canonical host is left indexable', async () => {
  const res = await onRequest(contextFor('https://www.coco-surfschool.com/fr/'));
  assert.equal(res.headers.get('X-Robots-Tag'), null);
  assert.equal(res.status, 200);
});

test('the pages.dev copy is noindexed', async () => {
  const res = await onRequest(contextFor('https://coco-surfschool.pages.dev/fr/'));
  assert.equal(res.headers.get('X-Robots-Tag'), 'noindex, nofollow');
});

test('preview deployments are noindexed', async () => {
  const res = await onRequest(contextFor('https://abc123.coco-surfschool.pages.dev/'));
  assert.equal(res.headers.get('X-Robots-Tag'), 'noindex, nofollow');
});

test('the body and status are passed through untouched', async () => {
  const res = await onRequest(contextFor('https://coco-surfschool.pages.dev/nope', new Response('not found', { status: 404 })));
  assert.equal(res.status, 404);
  assert.equal(await res.text(), 'not found');
});

test('existing headers survive', async () => {
  const upstream = new Response('x', { headers: { 'content-type': 'text/css', 'cache-control': 'max-age=60' } });
  const res = await onRequest(contextFor('https://coco-surfschool.pages.dev/styles.css', upstream));
  assert.equal(res.headers.get('content-type'), 'text/css');
  assert.equal(res.headers.get('cache-control'), 'max-age=60');
  assert.equal(res.headers.get('X-Robots-Tag'), 'noindex, nofollow');
});

test('a bodiless response does not throw', async () => {
  const res = await onRequest(contextFor('https://coco-surfschool.pages.dev/x', new Response(null, { status: 204 })));
  assert.equal(res.status, 204);
});
