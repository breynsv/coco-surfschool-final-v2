// Cloudflare Pages Function — POST /api/contact
// Receives the contact form and emails it via Resend.
// Required env var (Pages > Settings > Environment variables, encrypted):
//   RESEND_API_KEY   — your Resend API key
// Optional env vars (sensible defaults below):
//   CONTACT_TO       — inbox that receives enquiries (default: cocobosurfschool@gmail.com)
//   CONTACT_FROM     — verified Resend sender (default: Coco Surf School <contact@coco-surfschool.com>)

const DEFAULT_TO = 'cocobosurfschool@gmail.com';
const DEFAULT_FROM = 'Coco Surf School <contact@coco-surfschool.com>';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function onRequestPost({ request, env }) {
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
      subject: `Coco Surf School — ${name}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}
