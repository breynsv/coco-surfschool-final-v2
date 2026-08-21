import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost, onRequestGet } from '../functions/api/contact.js';

const GOOD = { name: 'Jan', email: 'jan@example.com', message: 'Graag een surfles.' };

/** A request shaped the way the real form sends it, unless overridden. */
const req = ({ origin = 'https://www.coco-surfschool.com', referer, ctype = 'application/json', body = GOOD, ip = '203.0.113.7' } = {}) => {
  const headers = { 'content-type': ctype, 'CF-Connecting-IP': ip };
  if (origin) headers.Origin = origin;
  if (referer) headers.Referer = referer;
  return new Request('https://www.coco-surfschool.com/api/contact', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
};

/**
 * Stands in for Resend so no test can send real mail. Records what it was
 * asked to send, so the tests can assert on it.
 */
function withStubbedResend(fn) {
  const real = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(init.body) });
    return new Response('{}', { status: 200 });
  };
  return Promise.resolve(fn(calls)).finally(() => { globalThis.fetch = real; });
}

const ENV = { RESEND_API_KEY: 'test-key' };

// --- the form must keep working -------------------------------------------

test('a request shaped like the real form is accepted and sent', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req(), env: ENV });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(calls.length, 1, 'expected exactly one Resend call');
    assert.match(calls[0].url, /api\.resend\.com/);
    assert.equal(calls[0].body.reply_to, GOOD.email);
  });
});

test('a stripped Origin still passes when Referer is ours', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({
      request: req({ origin: null, referer: 'https://www.coco-surfschool.com/fr/contact/' }),
      env: ENV,
    });
    assert.equal(res.status, 200, 'a proxy stripping Origin must not break the contact form');
    assert.equal(calls.length, 1);
  });
});

test('preview deployments on pages.dev still work', async () => {
  await withStubbedResend(async () => {
    const res = await onRequestPost({ request: req({ origin: 'https://abc123.coco-surfschool.pages.dev' }), env: ENV });
    assert.equal(res.status, 200);
  });
});

// --- the drive-by vector this closes ---------------------------------------

test('a cross-site POST is refused', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req({ origin: 'https://evil.example' }), env: ENV });
    assert.equal(res.status, 403);
    assert.equal(calls.length, 0, 'a cross-site caller must never reach Resend');
  });
});

test('a text/plain POST is refused — this is the no-preflight vector', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req({ ctype: 'text/plain' }), env: ENV });
    assert.equal(res.status, 415);
    assert.equal(calls.length, 0);
  });
});

test('a POST with neither Origin nor Referer is refused', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req({ origin: null }), env: ENV });
    assert.equal(res.status, 403);
    assert.equal(calls.length, 0);
  });
});

test('a Referer from another site is refused', async () => {
  await withStubbedResend(async () => {
    const res = await onRequestPost({ request: req({ origin: null, referer: 'https://evil.example/x' }), env: ENV });
    assert.equal(res.status, 403);
  });
});

test('an http (non-TLS) origin is refused', async () => {
  await withStubbedResend(async () => {
    const res = await onRequestPost({ request: req({ origin: 'http://www.coco-surfschool.com' }), env: ENV });
    assert.equal(res.status, 403);
  });
});

test('a lookalike host is refused', async () => {
  await withStubbedResend(async () => {
    for (const o of ['https://www.coco-surfschool.com.evil.example', 'https://evil-pages.dev', 'https://coco-surfschool.com']) {
      const res = await onRequestPost({ request: req({ origin: o }), env: ENV });
      assert.equal(res.status, 403, `${o} must not be trusted`);
    }
  });
});

// --- rate limiting ---------------------------------------------------------

/** Minimal KV stub with the two methods the function uses. */
const kv = () => {
  const m = new Map();
  return { store: m, get: async (k) => m.get(k) ?? null, put: async (k, v) => void m.set(k, v) };
};

test('the 6th request from one IP within the hour is throttled', async () => {
  await withStubbedResend(async (calls) => {
    const env = { ...ENV, RATE_LIMIT: kv() };
    for (let i = 1; i <= 5; i++) {
      const res = await onRequestPost({ request: req(), env });
      assert.equal(res.status, 200, `request ${i} should pass`);
    }
    const sixth = await onRequestPost({ request: req(), env });
    assert.equal(sixth.status, 429);
    assert.equal(calls.length, 5, 'the throttled request must not reach Resend');
  });
});

test('the limit is per IP, not global', async () => {
  await withStubbedResend(async () => {
    const env = { ...ENV, RATE_LIMIT: kv() };
    for (let i = 0; i < 5; i++) await onRequestPost({ request: req({ ip: '198.51.100.1' }), env });
    const other = await onRequestPost({ request: req({ ip: '198.51.100.2' }), env });
    assert.equal(other.status, 200, 'a different visitor must not inherit someone else\'s budget');
  });
});

test('a broken KV fails open rather than dropping enquiries', async () => {
  await withStubbedResend(async (calls) => {
    const env = { ...ENV, RATE_LIMIT: { get: async () => { throw new Error('KV down'); }, put: async () => {} } };
    const res = await onRequestPost({ request: req(), env });
    assert.equal(res.status, 200, 'a KV outage must not silently block the contact form');
    assert.equal(calls.length, 1);
  });
});

test('with no KV bound the limiter is inert', async () => {
  await withStubbedResend(async () => {
    for (let i = 0; i < 8; i++) {
      const res = await onRequestPost({ request: req(), env: ENV });
      assert.equal(res.status, 200);
    }
  });
});

// --- Turnstile -------------------------------------------------------------

test('Turnstile is skipped entirely when no secret is configured', async () => {
  await withStubbedResend(async (calls) => {
    await onRequestPost({ request: req(), env: ENV });
    assert.equal(calls.length, 1);
    assert.ok(!calls.some(c => c.url.includes('challenges.cloudflare.com')),
      'no CAPTCHA call should happen before the school configures Turnstile');
  });
});

test('with a secret configured, a missing token is rejected', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req(), env: { ...ENV, TURNSTILE_SECRET_KEY: 's' } });
    assert.equal(res.status, 403);
    assert.equal(calls.length, 0);
  });
});

test('with a secret configured, a token Cloudflare rejects fails closed', async () => {
  const real = globalThis.fetch;
  globalThis.fetch = async (url) => String(url).includes('challenges.cloudflare.com')
    ? new Response(JSON.stringify({ success: false }), { status: 200 })
    : new Response('{}', { status: 200 });
  try {
    const res = await onRequestPost({
      request: req({ body: { ...GOOD, turnstileToken: 'bogus' } }),
      env: { ...ENV, TURNSTILE_SECRET_KEY: 's' },
    });
    assert.equal(res.status, 403);
  } finally { globalThis.fetch = real; }
});

test('with a secret configured, a token Cloudflare accepts passes', async () => {
  const real = globalThis.fetch;
  const sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push(String(url));
    return String(url).includes('challenges.cloudflare.com')
      ? new Response(JSON.stringify({ success: true }), { status: 200 })
      : new Response('{}', { status: 200 });
  };
  try {
    const res = await onRequestPost({
      request: req({ body: { ...GOOD, turnstileToken: 'good' } }),
      env: { ...ENV, TURNSTILE_SECRET_KEY: 's' },
    });
    assert.equal(res.status, 200);
    assert.ok(sent.some(u => u.includes('api.resend.com')));
  } finally { globalThis.fetch = real; }
});

// --- behaviour that must not have regressed --------------------------------

test('the honeypot still silently absorbs bots', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req({ body: { ...GOOD, company: 'bot' } }), env: ENV });
    assert.equal(res.status, 200, 'bots must not learn what tripped them');
    assert.equal(calls.length, 0, 'the honeypot must stop the mail');
  });
});

test('validation and length caps still apply', async () => {
  await withStubbedResend(async () => {
    const bad = [
      [{ ...GOOD, email: 'nope' }, 422],
      [{ ...GOOD, name: '' }, 422],
      [{ ...GOOD, message: '' }, 422],
      [{ ...GOOD, message: 'x'.repeat(5001) }, 422],
      [{ ...GOOD, name: 'x'.repeat(201) }, 422],
    ];
    for (const [body, status] of bad) {
      const res = await onRequestPost({ request: req({ body }), env: ENV });
      assert.equal(res.status, status, `expected ${status} for ${JSON.stringify(body).slice(0, 60)}`);
    }
  });
});

test('malformed JSON is a 400, not a crash', async () => {
  await withStubbedResend(async () => {
    const res = await onRequestPost({ request: req({ body: '{not json' }), env: ENV });
    assert.equal(res.status, 400);
  });
});

test('HTML in the message is escaped in the email body', async () => {
  await withStubbedResend(async (calls) => {
    await onRequestPost({ request: req({ body: { ...GOOD, message: '<img src=x onerror=alert(1)>' } }), env: ENV });
    assert.ok(calls[0].body.html.includes('&lt;img'), 'message must be escaped into the HTML mail');
    assert.ok(!calls[0].body.html.includes('<img src=x'), 'raw tag leaked into the HTML mail');
  });
});

test('a newline in the name cannot reach the subject header', async () => {
  await withStubbedResend(async (calls) => {
    await onRequestPost({ request: req({ body: { ...GOOD, name: 'Jan\nBcc: evil@example.com' } }), env: ENV });
    assert.ok(!/[\r\n]/.test(calls[0].body.subject), `subject contains a newline: ${JSON.stringify(calls[0].body.subject)}`);
  });
});

test('a missing Resend key is a 500, not a silent success', async () => {
  const res = await onRequestPost({ request: req(), env: {} });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { ok: false, error: 'not_configured' });
});

test('a Resend failure surfaces as 502', async () => {
  const real = globalThis.fetch;
  globalThis.fetch = async () => new Response('nope', { status: 500 });
  try {
    const res = await onRequestPost({ request: req(), env: ENV });
    assert.equal(res.status, 502);
  } finally { globalThis.fetch = real; }
});

// --- the status probe ------------------------------------------------------

test('GET reports which protections are live, and leaks no secrets', async () => {
  const res = await onRequestGet({ env: { ...ENV, RATE_LIMIT: kv(), TURNSTILE_SECRET_KEY: 'super-secret' } });
  const body = await res.json();
  assert.deepEqual(body.protections, {
    originCheck: true, jsonContentType: true, honeypot: true,
    rateLimit: true, turnstile: true, resendConfigured: true,
  });
  const raw = JSON.stringify(body);
  assert.ok(!raw.includes('super-secret') && !raw.includes('test-key'), 'the probe must not echo secrets');
});

test('GET reports the dormant layers as dormant', async () => {
  const body = await (await onRequestGet({ env: {} })).json();
  assert.equal(body.protections.rateLimit, false);
  assert.equal(body.protections.turnstile, false);
  assert.equal(body.protections.resendConfigured, false);
});

// --- newsletter opt-in ------------------------------------------------------
//
// There is no list system behind this form: the enquiry email IS the record of
// consent. So the opt-in has to be legible in the mail Annelies opens, and an
// absent or unticked box must read as an explicit "no" rather than as silence —
// otherwise a message that never asked and a message that asked and was refused
// look identical, and the difference is exactly what GDPR consent turns on.

test('a ticked opt-in is reported in the email as a yes', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req({ body: { ...GOOD, consent: true } }), env: ENV });
    assert.equal(res.status, 200);
    assert.match(calls[0].body.text, /News opt-in: YES/);
    assert.match(calls[0].body.html, /News opt-in:<\/b> YES/);
  });
});

test('an unticked opt-in is reported as a no, not omitted', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req({ body: { ...GOOD, consent: false } }), env: ENV });
    assert.equal(res.status, 200);
    assert.match(calls[0].body.text, /News opt-in: no/);
    assert.doesNotMatch(calls[0].body.text, /YES/);
  });
});

test('a message with no consent field at all still reports a no', async () => {
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req(), env: ENV });
    assert.equal(res.status, 200);
    assert.match(calls[0].body.text, /News opt-in: no/);
  });
});

test('the checkbox value "1" counts as a yes', async () => {
  // Belt and braces: script.js sends a real boolean, but the checkbox itself
  // carries value="1", so anything posting the form natively sends the string.
  await withStubbedResend(async (calls) => {
    const res = await onRequestPost({ request: req({ body: { ...GOOD, consent: '1' } }), env: ENV });
    assert.equal(res.status, 200);
    assert.match(calls[0].body.text, /News opt-in: YES/);
  });
});
