# Coco Surf School — go-live on Cloudflare Pages

Date: 2026-08-04
Status: approved for planning

Take the built multilingual site live at `https://www.coco-surfschool.com`, replacing
the current Wix site, hosted on Cloudflare Pages with a working contact form.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Host | Cloudflare Pages, git-connected | Matches astro-atalanta. Pages Functions give a serverless contact endpoint with no backend. |
| Canonical host | `www` | The live Wix site 301s apex→www and its canonical tag is `https://www.coco-surfschool.com`. Every indexed URL is on `www`. `build.mjs:12` already sets `SITE` to the www host. |
| Build | No build command; output committed | The generated site is committed. What deploys is exactly what was reviewed. |
| Spam protection | Honeypot only | Operator decision. Turnstile deferred. |
| Email delivery | Resend | Already coded in `functions/api/contact.js`. |
| Nameservers | Move to Cloudflare | Domain was bought through Wix, so nameservers are changeable from the Wix dashboard. |
| Catch-all redirect | None | A global `/* → /fr/` turns typos into soft-404s. Specific rules plus a real 404 page instead. |

### Why `www` and not apex

Apex and `www` are equivalent for ranking. The choice matters here for a different
reason: this migration already changes the platform *and* the entire URL structure
(`/tarifs` → `/fr/cours-de-surf/`). Changing the canonical host as well would add a
second redirect hop to every indexed URL:

    www.../tarifs → coco-surfschool.com/tarifs → coco-surfschool.com/fr/cours-de-surf/

Keeping `www` gives one hop and preserves the host Google already trusts.

## Current state

Verified 2026-08-04.

**Already working, no changes needed**
- Contact form markup with honeypot — `build.mjs:436-443` (hidden `company` field)
- Contact endpoint — `functions/api/contact.js`, silently 200s on honeypot hit (`:33-36`)
- Submit handler with sending/ok/error states — `script.js:135-174`
- Sitemap — `build.mjs:527-533`, 50 URLs, 250 hreflang alternates, already on `www`
- Canonical/hreflang/x-default/og:url — all use `SITE` (`build.mjs:12`)
- `_redirects` — 57 rules; all 18 URLs in Wix's `pages-sitemap.xml` are covered

**Blocking go-live**
- `build.mjs:111` — `noindex, nofollow` on all 50 generated pages
- `build.mjs:534` — `robots.txt` is `Disallow: /`
- No `RESEND_API_KEY`; the Function returns `not_configured` 500 without it
- Four indexed Wix URLs have no redirect (see below)
- No `404.html`; Pages would serve its generic one
- No `wrangler.toml` / `.dev.vars`, so the Function can't be tested locally
- `.gitignore` contains only `.DS_Store` — a secrets file would be committed

**DNS facts**
- Registrar: Network Solutions; nameservers: `ns0/ns1.wixdns.net`
- Domain purchased through Wix → nameservers changeable from the Wix dashboard
- **No MX records exist.** Coco uses `cocobosurfschool@gmail.com`. The nameserver
  move cannot break her email.

## Changes

### 1. Production build flag — `build.mjs`

Gate the preview-only output on an env var. `node build.mjs` keeps today's behaviour;
`PROD=1 node build.mjs` produces:

- generated pages without the `noindex, nofollow` meta (`:111`) — leaves the
  per-file `noindex` in `booking-preview/`, `vragenlijst/`, `rapport/` untouched,
  as those are hand-authored and not generated
- `robots.txt` allowing crawl and ending with
  `Sitemap: https://www.coco-surfschool.com/sitemap.xml`
- root `index.html` without `noindex`

Note on the root: `_redirects` line 1 sends `/ → /fr/ 301`, so the JS
language-auto-detect in the generated root `index.html` never actually runs. That
is the correct behaviour to keep — crawlers hit the site from US IPs with `en-US`,
so JS-based language detection would redirect Googlebot unpredictably, whereas a
fixed 301 to the x-default language plus hreflang tags is unambiguous. Stripping
`noindex` from the root file is therefore cosmetic, not functional.

### 2. `404.html`

Generate a branded 404 using the existing site chrome, linking to the five language
homepages. Carries `noindex`.

### 3. `_redirects` — four missing URLs

`booking-services-sitemap.xml` exposes four indexed URLs the file never covered,
because it was built from the pages sitemaps only:

    /service-page/deluxe-group-lesson        → /fr/cours-de-surf/
    /service-page/ashtanga-yoga-introduction → /fr/
    /service-page/ashtanga-yoga-intermédiaire → /fr/
    /service-page/yoga-prénatal              → /fr/

Two accented slugs need **both** literal-UTF-8 and percent-encoded (`%C3%A9`) rules,
since crawlers request the encoded form. A `/service-page/* → /fr/ 301` splat goes
**after** the specific rules — `_redirects` is first-match-wins.

Yoga targets are provisional. The new site has **zero** yoga content (`grep -ri yoga
content/` → 0 matches) while Wix is currently taking bookings for three yoga classes.
Pending Coco's confirmation these point at the homepage; if the classes are still
running this becomes a content gap to fill and the targets change.

These are **Wix Bookings** services, which is why they are easy to miss: Wix
auto-generates a `/service-page/<slug>` per service and auto-publishes it to
`booking-services-sitemap.xml`, but the pages are not in the site navigation.
Verified 2026-08-04 — all three return HTTP 200, `lastmod` 2026-06-15, and yoga
appears on `/book-online` only (0 mentions on `/`, `/cours-les-formules`, `/tarifs`,
`/a-propos`). Anyone rebuilding the site from its visible pages would not see them.

### Related: `/book-online` is a functional downgrade at launch

`/book-online` is the storefront for the whole Wix Bookings system and currently
redirects to `/fr/contact/`. The redirect is fine for SEO, but it means Coco's live
online-booking flow is replaced by a contact form on launch day. This is a business
decision to confirm with her explicitly, not just a redirect detail. The
`booking-preview/` work in this repo and the Membrero booking integration are the
intended replacement; neither is in scope here.

### 4. Local dev config

- `wrangler.toml` with `pages_build_output_dir = "."`
- `.dev.vars` template: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`
- `.gitignore` gains `.dev.vars` and `.wrangler/`

### 5. Pages environment variables

| Variable | Value | |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | **encrypted** |
| `CONTACT_TO` | `cocobosurfschool@gmail.com` | |
| `CONTACT_FROM` | `Coco Surf School <contact@coco-surfschool.com>` | mailbox need not exist |

No code change — these are the defaults already in `functions/api/contact.js:9-10`.

## Cutover sequence

The nameserver move is deliberately decoupled from go-live. Cloudflare imports the
existing Wix records when the zone is added, so the site keeps serving from Wix
until the custom domain is attached. That makes the slow, irreversible-feeling step
(nameservers) boring, and the actual launch a single fast change.

1. **Code** — apply changes 1-4, run `PROD=1 node build.mjs`, commit, push.
2. **Pages project** — connect `breynsv/coco-surfschool-final-v2`. Root `.`, output
   `.`, no build command. Test fully on `*.pages.dev`. Wix untouched.
3. **Add zone to Cloudflare** — let it import Wix's DNS records. Change nothing.
4. **Repoint nameservers** in the Wix dashboard. **The site stays on Wix** — the
   imported A records still point at Wix IPs. Nothing visibly changes.
5. **Resend** — verify `coco-surfschool.com` (DKIM/SPF/bounce-MX in Cloudflare DNS,
   grey cloud / DNS-only). Set the env vars. Test the form on `*.pages.dev`.
6. **Go live** — attach `www.coco-surfschool.com` as the Pages custom domain and
   redirect apex → `www`. This is the switch.

Rollback: point DNS back at the Wix IPs. Keep the Wix subscription for several
weeks after launch.

## Verification

Contact form:
- Happy path → Coco receives mail at `CONTACT_TO`; **Reply** addresses the visitor
  (via `reply_to`)
- Invalid email → 422, no send
- Honeypot → set hidden `company` via devtools, expect **200 but no email**
- All five languages (fr/en/nl/de/es)

Site:
- `noindex` gone from generated pages; still present on `booking-preview/`,
  `vragenlijst/`, `rapport/`
- `robots.txt` allows crawl and lists the sitemap
- `sitemap.xml` reachable, 50 URLs, all `www`
- Every URL in Wix's `pages-sitemap.xml` and `booking-services-sitemap.xml`
  returns a **single-hop 301** to a **200**
- Unknown path serves the branded 404, not a redirect
- Apex 301s to `www`

Post-launch: submit the sitemap in Google Search Console for the `www` property and
watch Coverage for 404 spikes.

## Out of scope

- **Turnstile** — deferred by operator decision. Honeypot alone will eventually let
  some spam through, since headless-browser spam ignores hidden fields. The Function
  is structured so Turnstile drops in later without touching form markup.
- **Yoga content page** — pending Coco's confirmation.
- **Membrero migration** — tracker item #201 (`in_progress`, phase 4) will host
  tenant sites on `site-id.membrero.com` with custom domains via **Cloudflare for
  SaaS**. Because the zone will already be in Cloudflare, that move is a config
  change rather than another registrar round-trip. Nothing to do now.
