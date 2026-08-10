// Cloudflare Pages middleware — runs on every request.
//
// The site is reachable on more hosts than the canonical one: the project's
// coco-surfschool.pages.dev URL and every preview deployment. Each of those is
// a full, publicly crawlable copy of the site. Canonical tags already point at
// www, but that is a hint rather than a rule, so serve an explicit
// X-Robots-Tag on any host that is not the real one.
//
// The apex is not listed: it 301s to www via a Cloudflare Redirect Rule before
// this ever runs.
const CANONICAL_HOST = 'www.coco-surfschool.com';

export async function onRequest(context) {
  const res = await context.next();
  const host = new URL(context.request.url).hostname;
  if (host === CANONICAL_HOST) return res;

  // Rebuild rather than mutate: a Response from next() can have immutable headers.
  const headers = new Headers(res.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
