// Cloudflare Pages Function — POST /api/contact
// Receives the contact form and emails it via Resend.
//
// Required env var (Pages > Settings > Variables and Secrets, encrypted):
//   RESEND_API_KEY        — your Resend API key
// Optional env vars (sensible defaults below):
//   CONTACT_TO            — inbox that receives enquiries
//   CONTACT_FROM          — verified Resend sender
//   TURNSTILE_SECRET_KEY  — enables CAPTCHA verification when set (see below)
// Optional binding:
//   RATE_LIMIT            — a KV namespace; enables per-IP throttling when bound
//
// ---------------------------------------------------------------------------
// Abuse protection, in layers. Each stops a different attacker.
//
// 1. Origin allowlist + JSON content-type. Together these close the drive-by
//    vector: a cross-site POST with `content-type: text/plain` is a CORS
//    "simple request", so the browser sends it with NO preflight — and this
//    function reads the body with request.json() regardless of content type,
//    so it used to process those happily. Demanding application/json forces a
//    preflight, which fails because nothing here answers OPTIONS with CORS
//    headers. This is what protects real visitors' browsers.
//
// 2. Per-IP rate limit. Layer 1 does nothing against a script — curl sets any
//    header it likes. This caps a single source.
//
// 3. Turnstile. Caps distributed abuse that layer 2 cannot see as one source.
//
// Layers 2 and 3 stay dormant until configured, so this file is safe to deploy
// before the KV namespace and Turnstile keys exist. `GET /api/contact` reports
// which layers are actually live — check it after deploying rather than
// assuming.
// ---------------------------------------------------------------------------

const DEFAULT_TO = 'cocobosurfschool@gmail.com';
const DEFAULT_FROM = 'Coco Surf School <contact@coco-surfschool.com>';

// The form is only ever served from the canonical host; *.pages.dev is allowed
// so preview deployments remain testable.
const CANONICAL_ORIGIN = 'https://www.coco-surfschool.com';
const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'https:') return false;
    return u.origin === CANONICAL_ORIGIN || u.hostname.endsWith('.pages.dev');
  } catch {
    return false;
  }
};

/**
 * Browsers send Origin on every non-GET/HEAD request, same-origin included —
 * that is the Fetch spec, and Chromium was checked directly. Referer is a
 * fallback for the case where something in front of the browser strips Origin:
 * without it, a stripped header would 403 the contact form for that visitor and
 * nobody would find out. It is not a weakening — a cross-site caller's Referer
 * is its own page, so it fails this check too. If BOTH are absent we refuse,
 * which is what a scripted POST with no headers looks like.
 */
const isTrustedCaller = (request) => {
  const origin = request.headers.get('Origin');
  if (origin) return isAllowedOrigin(origin);
  const referer = request.headers.get('Referer');
  if (!referer) return false;
  try {
    return isAllowedOrigin(new URL(referer).origin);
  } catch {
    return false;
  }
};

// Requests per IP per rolling hour, once a RATE_LIMIT KV namespace is bound.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_S = 3600;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/**
 * True when the request is over its per-IP budget. Fails OPEN: if KV is not
 * bound, or errors, enquiries must still reach Annelies. A dropped enquiry is a
 * lost customer; a duplicate one is an annoyance.
 */
async function isRateLimited(env, ip) {
  if (!env.RATE_LIMIT || !ip) return false;
  const key = `contact:${ip}:${Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW_S)}`;
  try {
    const n = Number(await env.RATE_LIMIT.get(key)) || 0;
    if (n >= RATE_LIMIT_MAX) return true;
    await env.RATE_LIMIT.put(key, String(n + 1), { expirationTtl: RATE_LIMIT_WINDOW_S * 2 });
    return false;
  } catch {
    return false;
  }
}

/**
 * Verify a Turnstile token. Only called when TURNSTILE_SECRET_KEY is set, so
 * this fails CLOSED — once the school has opted into CAPTCHA, a token that
 * cannot be verified must not pass.
 */
async function turnstileOk(env, token, ip) {
  if (!token) return false;
  try {
    const body = new FormData();
    body.append('secret', env.TURNSTILE_SECRET_KEY);
    body.append('response', token);
    if (ip) body.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    if (!r.ok) return false;
    const out = await r.json();
    return out.success === true;
  } catch {
    return false;
  }
}

/** Which protections are actually live. Deploy-time sanity check, no secrets. */
export function onRequestGet({ env }) {
  return json({
    ok: true,
    protections: {
      originCheck: true,
      jsonContentType: true,
      honeypot: true,
      rateLimit: Boolean(env.RATE_LIMIT),
      turnstile: Boolean(env.TURNSTILE_SECRET_KEY),
      resendConfigured: Boolean(env.RESEND_API_KEY),
    },
  });
}

export async function onRequestPost({ request, env }) {
  // --- layer 1: this must look like our own form, from our own page ---------
  if (!isTrustedCaller(request)) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }
  const ctype = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  if (ctype !== 'application/json') {
    return json({ ok: false, error: 'unsupported_media_type' }, 415);
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';

  // --- layer 2: per-IP budget ----------------------------------------------
  if (await isRateLimited(env, ip)) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  const name = (data.name || '').toString().trim();
  const email = (data.email || '').toString().trim();
  const message = (data.message || '').toString().trim();
  const honeypot = (data.company || '').toString().trim(); // hidden field; bots fill it

  // Silently accept spam so bots don't learn what tripped them.
  if (honeypot) return json({ ok: true });

  // --- layer 3: Turnstile, only once the school has configured it -----------
  if (env.TURNSTILE_SECRET_KEY) {
    const token = (data.turnstileToken || data['cf-turnstile-response'] || '').toString();
    if (!await turnstileOk(env, token, ip)) {
      return json({ ok: false, error: 'captcha_failed' }, 403);
    }
  }

  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: 'invalid' }, 422);
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return json({ ok: false, error: 'too_long' }, 422);
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  const to = env.CONTACT_TO || DEFAULT_TO;
  const from = env.CONTACT_FROM || DEFAULT_FROM;

  const text =
    `New enquiry from the Coco Surf School website\n\n` +
    `Name:  ${name}\n` +
    `Email: ${email}\n\n` +
    `${message}\n`;

  const html =
    `<h2>New enquiry from the Coco Surf School website</h2>` +
    `<p><b>Name:</b> ${escapeHtml(name)}<br>` +
    `<b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      // Collapse whitespace so a newline in `name` cannot be pushed into a
      // header field. Resend encodes this for us; belt and braces.
      subject: `Coco Surf School — ${name.replace(/\s+/g, ' ')}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}
