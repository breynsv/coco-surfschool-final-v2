# Coco Surf School Go-Live Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the built site deployable to Cloudflare Pages at `https://www.coco-surfschool.com` — indexable, with every old Wix URL redirected, a real 404 page, and a locally testable contact form.

**Architecture:** `build.mjs` is a single standalone Node ESM script that generates 55 static pages plus `sitemap.xml`, `robots.txt` and the root `index.html`. All changes are additive and gated on a `PROD` env var so preview behaviour is unchanged. The output directory becomes overridable via `COCO_OUT` so the build can be tested against a temp dir instead of clobbering the committed site.

**Tech Stack:** Node v25 ESM (no dependencies, no `package.json`), the built-in `node:test` runner, Cloudflare Pages + Pages Functions, Resend.

Spec: `docs/superpowers/specs/2026-08-04-coco-surfschool-golive-design.md`

## Global Constraints

- **No new runtime dependencies.** The repo has no `package.json` and must not gain one. Use only `node:` built-ins.
- **Canonical host is `https://www.coco-surfschool.com`** — already `SITE` at `build.mjs:12`. Do not change it.
- **Default build behaviour must not change.** `node build.mjs` keeps emitting `noindex` and `Disallow: /`. Only `PROD=1` changes output.
- **Never touch** `booking-preview/`, `vragenlijst/`, `rapport/`. They are hand-authored, carry their own `noindex`, and are not generated.
- **`_redirects` is first-match-wins.** Specific rules always precede splats.
- **Secrets never get committed.** `.dev.vars` is gitignored; only `.dev.vars.example` is tracked.
- Node's test runner is invoked as **bare** `node --test` — there is no `npm test`. Do NOT pass a directory (`node --test test/`): Node v25 treats the path as a module and emits a spurious failing test. Bare `node --test` auto-discovers `test/**`.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `build.mjs` | Modify | Add `COCO_OUT` + `PROD` gating, `notFound()` generator |
| `test/build.test.mjs` | Create | Asserts preview vs production build output |
| `_redirects` | Modify | Add Wix Bookings `/service-page/` rules |
| `wrangler.toml` | Create | Pages dev/deploy config |
| `.dev.vars.example` | Create | Committed template for local secrets |
| `.gitignore` | Modify | Ignore `.dev.vars`, `.wrangler/` |

---

### Task 1: Make the build output directory overridable

Prerequisite for every later test — without it, running the build during a test overwrites the committed site.

**Files:**
- Modify: `build.mjs:11`
- Test: `test/build.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `COCO_OUT` env var — absolute path the build writes to; defaults to the repo root. Every later task's test uses the `buildTo()` helper defined here.

- [ ] **Step 1: Write the failing test**

Create `test/build.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test`
Expected: FAIL — the build ignores `COCO_OUT` and writes to the repo, so `fr/contact/index.html` does not exist in the temp dir (`ENOENT`).

- [ ] **Step 3: Make the output directory overridable**

In `build.mjs`, replace line 11:

```js
const ROOT = dirname(fileURLToPath(import.meta.url));
```

with:

```js
// Output directory. Defaults to the repo root; overridable so tests (and any
// out-of-tree build) can write somewhere disposable.
const ROOT = process.env.COCO_OUT || dirname(fileURLToPath(import.meta.url));
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test`
Expected: PASS, 1 test.

- [ ] **Step 5: Verify the repo was not modified**

Run: `git status --porcelain`
Expected: only `build.mjs` and the new `test/` directory appear. If any file under `fr/`, `en/`, `nl/`, `de/`, `es/` shows as modified, `COCO_OUT` is not being honoured — stop and fix.

- [ ] **Step 6: Commit**

```bash
git add build.mjs test/build.test.mjs
git commit -m "refactor(build): allow output directory override via COCO_OUT

Prerequisite for testing the build without overwriting the committed site."
```

---

### Task 2: Add the PROD flag — strip noindex, open robots.txt

**Files:**
- Modify: `build.mjs` (constants block, `head()` at ~line 111, `build()` at ~line 534)
- Test: `test/build.test.mjs`

**Interfaces:**
- Consumes: `buildTo()` from Task 1
- Produces: `PROD` env var — `PROD=1` yields indexable output. Task 3 reuses the same flag.

- [ ] **Step 1: Write the failing tests**

Append to `test/build.test.mjs`:

```js
test('preview build keeps noindex on generated pages', async () => {
  const out = await buildTo();
  const html = await read(out, 'fr/contact/index.html');
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
});

test('production build has no noindex on generated pages', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, 'fr/contact/index.html');
  assert.doesNotMatch(html, /noindex/);
});

test('preview robots.txt disallows everything', async () => {
  const out = await buildTo();
  assert.equal(await read(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
});

test('production robots.txt allows crawling and lists the sitemap', async () => {
  const out = await buildTo({ PROD: '1' });
  const txt = await read(out, 'robots.txt');
  assert.doesNotMatch(txt, /Disallow: \/\s*$/m);
  assert.match(txt, /^Allow: \/$/m);
  assert.match(txt, /^Sitemap: https:\/\/www\.coco-surfschool\.com\/sitemap\.xml$/m);
});

test('production root index.html drops noindex', async () => {
  const out = await buildTo({ PROD: '1' });
  assert.doesNotMatch(await read(out, 'index.html'), /noindex/);
});

test('sitemap always uses the www canonical host', async () => {
  const out = await buildTo({ PROD: '1' });
  const xml = await read(out, 'sitemap.xml');
  assert.equal((xml.match(/<loc>/g) || []).length, 55);
  assert.doesNotMatch(xml, /<loc>https:\/\/coco-surfschool\.com/);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test`
Expected: FAIL. `PROD` is not implemented, so the production cases still see `noindex` and `Disallow: /`. The two preview cases and the sitemap case should already pass.

- [ ] **Step 3: Add the PROD constant**

In `build.mjs`, immediately after the `SITE` declaration (line 12), add:

```js
// Production build: PROD=1 node build.mjs
// Preview (default) keeps the site noindexed and fully disallowed.
const PROD = process.env.PROD === '1';
const ROBOTS_META = PROD ? '' : '<meta name="robots" content="noindex, nofollow">\n';
```

- [ ] **Step 4: Gate the per-page robots meta**

In `head()`, find these three consecutive lines of the returned template:

```
<script>document.documentElement.className+=' js'</script>
<meta name="robots" content="noindex, nofollow">
<title>${t.title}</title>
```

Replace with:

```
<script>document.documentElement.className+=' js'</script>
${ROBOTS_META}<title>${t.title}</title>
```

- [ ] **Step 5: Gate robots.txt**

In `build()`, replace:

```js
  await writeFile(join(ROOT, 'robots.txt'), `User-agent: *\nDisallow: /\n`);
```

with:

```js
  await writeFile(join(ROOT, 'robots.txt'), PROD
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`);
```

- [ ] **Step 6: Gate the root index.html meta**

In the same function, the root `index.html` template contains `<meta name="robots" content="noindex">`. Replace that literal substring inside the template with `${PROD ? '' : '<meta name="robots" content="noindex">'}`.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `node --test`
Expected: PASS, 7 tests.

- [ ] **Step 8: Commit**

```bash
git add build.mjs test/build.test.mjs
git commit -m "feat(build): add PROD flag for indexable production output

PROD=1 strips the noindex meta from all 55 generated pages, opens
robots.txt and adds the Sitemap: line. Default preview build unchanged."
```

---

### Task 3: Generate a branded 404 page

**Files:**
- Modify: `build.mjs` (new `notFound()` function, one call in `build()`)
- Test: `test/build.test.mjs`

**Interfaces:**
- Consumes: `buildTo()` from Task 1; `LANGS`, `LANGNAME`, `FLAG` constants already in `build.mjs`
- Produces: `notFound(): string` — full HTML document; `404.html` at the output root

- [ ] **Step 1: Write the failing tests**

Append to `test/build.test.mjs`:

```js
test('404 page is generated with a link to every language', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, '404.html');
  for (const lang of ['fr', 'nl', 'de', 'en', 'es']) {
    assert.ok(html.includes(`href="/${lang}/"`), `missing link to /${lang}/`);
  }
});

test('404 page uses root-absolute asset paths', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, '404.html');
  assert.match(html, /href="\/styles\.css"/);
  assert.doesNotMatch(html, /(href|src)="(?!\/|https:)/);
});

test('404 page stays noindex even in production', async () => {
  const out = await buildTo({ PROD: '1' });
  assert.match(await read(out, '404.html'), /<meta name="robots" content="noindex">/);
});
```

Root-absolute paths matter because Cloudflare Pages serves `404.html` for a request at any depth — a relative `styles.css` would 404 from `/fr/foo/bar`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test`
Expected: FAIL — `404.html` does not exist (`ENOENT`).

- [ ] **Step 3: Add the notFound() generator**

In `build.mjs`, add immediately before `async function build() {`:

```js
// Cloudflare Pages serves this for any unmatched path, at any depth, so every
// asset reference must be root-absolute. Stays noindex in every build.
function notFound() {
  const links = LANGS
    .map(l => `<a class="btn btn--ghost" href="/${l}/">${FLAG[l]} ${LANGNAME[l]}</a>`)
    .join('\n        ');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page introuvable — Coco Surf School</title>
<link rel="icon" href="/assets/images/ee16c3_71361371647c417f89cde7e315ac662c.png">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<main class="section" style="min-height:70vh;display:grid;place-items:center;text-align:center">
  <div class="wrap">
    <p class="eyebrow">404</p>
    <h1 class="section-title">Page introuvable · Page not found · Pagina niet gevonden</h1>
    <p class="lead">Cette page n'existe plus — choisissez votre langue :<br>
      This page no longer exists — pick your language:</p>
    <div class="hero-cta" style="justify-content:center;flex-wrap:wrap;margin-top:1.6rem">
        ${links}
    </div>
  </div>
</main>
</body>
</html>
`;
}
```

- [ ] **Step 4: Write the file during the build**

In `build()`, immediately after the `robots.txt` write, add:

```js
  await writeFile(join(ROOT, '404.html'), notFound());
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --test`
Expected: PASS, 10 tests.

- [ ] **Step 6: Commit**

```bash
git add build.mjs test/build.test.mjs
git commit -m "feat(build): generate a branded multilingual 404 page

Cloudflare Pages serves 404.html for unmatched paths; without one it
shows a generic Cloudflare error. Root-absolute asset paths so it
renders correctly at any URL depth."
```

---

### Task 4: Redirect the four uncovered Wix Bookings URLs

**Files:**
- Modify: `_redirects` (append a new section at end of file)
- Test: `test/redirects.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: nothing consumed by later tasks

Context: `booking-services-sitemap.xml` on the live Wix site lists four indexed URLs absent from `_redirects`. Verified live on 2026-08-04 — all return HTTP 200. The two accented slugs need both literal-UTF-8 and percent-encoded forms because crawlers request the encoded form.

- [ ] **Step 1: Write the failing test**

Create `test/redirects.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test`
Expected: FAIL — "no redirect rule for /service-page/deluxe-group-lesson".

- [ ] **Step 3: Append the rules**

Add to the **end** of `_redirects`:

```
# ---- Wix Bookings service pages (booking-services-sitemap.xml) ----
# Wix auto-generates a /service-page/<slug> per bookable service and publishes
# it to its own sitemap; these are indexed but were never in the page sitemaps.
# Accented slugs need BOTH the literal-UTF-8 and percent-encoded forms.
# Yoga targets are provisional pending Coco — the new site has no yoga content.
/service-page/deluxe-group-lesson              /fr/cours-de-surf/  301
/service-page/ashtanga-yoga-introduction       /fr/                301
/service-page/ashtanga-yoga-intermédiaire      /fr/                301
/service-page/ashtanga-yoga-interm%C3%A9diaire /fr/                301
/service-page/yoga-prénatal                    /fr/                301
/service-page/yoga-pr%C3%A9natal               /fr/                301
# Backstop for any service not listed above. MUST STAY LAST — first match wins.
/service-page/*                                /fr/                301
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test`
Expected: PASS, 13 tests total across both files.

- [ ] **Step 5: Commit**

```bash
git add _redirects test/redirects.test.mjs
git commit -m "fix(redirects): cover Wix Bookings /service-page/ URLs

booking-services-sitemap.xml lists four indexed URLs that _redirects
never covered, because it was built from the page sitemaps only. All
four return 200 on the live site and would 404 at launch."
```

---

### Task 5: Local Cloudflare dev config

**Files:**
- Create: `wrangler.toml`, `.dev.vars.example`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: `npx wrangler pages dev` serves the site plus `functions/` with secrets loaded from `.dev.vars`

- [ ] **Step 1: Extend .gitignore first**

Do this **before** creating anything else, so a real `.dev.vars` can never be staged by accident. Replace the entire contents of `.gitignore` with:

```
.DS_Store
.dev.vars
.wrangler/
node_modules/
```

- [ ] **Step 2: Verify the ignore rule works**

```bash
printf 'RESEND_API_KEY="re_leaked"\n' > .dev.vars
git status --porcelain .dev.vars
```

Expected: **no output.** If `.dev.vars` appears, the ignore rule is wrong — stop and fix before continuing. Leave the file in place; it is needed for local dev.

- [ ] **Step 3: Create wrangler.toml**

```toml
name = "coco-surfschool"
compatibility_date = "2026-08-04"
pages_build_output_dir = "."
```

The site is pre-built and committed, so there is no build command — Pages serves the repo as-is and picks up `functions/` automatically.

- [ ] **Step 4: Create .dev.vars.example**

This is the committed template. The real `.dev.vars` is gitignored.

```
# Copy to .dev.vars and fill in real values. .dev.vars is gitignored.
# Consumed by functions/api/contact.js via the `env` binding.
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
CONTACT_TO="cocobosurfschool@gmail.com"
CONTACT_FROM="Coco Surf School <contact@coco-surfschool.com>"
```

- [ ] **Step 5: Verify nothing secret is staged**

```bash
git status --porcelain
```

Expected: `.gitignore`, `wrangler.toml` and `.dev.vars.example` only. `.dev.vars` must **not** appear.

- [ ] **Step 6: Commit**

```bash
git add .gitignore wrangler.toml .dev.vars.example
git commit -m "chore: add wrangler config for local Pages Function testing

.gitignore previously held only .DS_Store, so a .dev.vars secrets file
would have been committed."
```

---

### Task 6: Produce and commit the production build

Run last, after every code change is merged. This is the artifact Cloudflare actually serves.

**Files:**
- Modify: all 55 generated `index.html` files, `robots.txt`, `sitemap.xml`, `404.html`, root `index.html`

**Interfaces:**
- Consumes: `PROD` flag (Task 2), `notFound()` (Task 3)
- Produces: the deployable committed site

- [ ] **Step 1: Confirm the full suite passes**

Run: `node --test`
Expected: PASS, 13 tests. Do not continue if anything fails.

- [ ] **Step 2: Run the production build against the real repo**

```bash
PROD=1 node build.mjs
```

Expected output: `Generated 55 pages + sitemap + robots + redirect`

- [ ] **Step 3: Verify the output**

```bash
echo "pages still carrying noindex (expect 0):"
grep -rl "noindex" fr en nl de es --include=index.html | wc -l

echo "hand-authored previews still noindexed (expect 3):"
grep -l "noindex" booking-preview/index.html vragenlijst/index.html rapport/index.html | wc -l

echo "robots.txt:"; cat robots.txt
echo "sitemap URLs (expect 55):"; grep -c "<loc>" sitemap.xml
echo "404 exists:"; test -f 404.html && echo yes
```

Expected: `0`, then `3`, a `robots.txt` with `Allow: /` and a `Sitemap:` line, `55`, and `yes`.

If the first number is not 0 or the second is not 3, stop — the `PROD` gating is wrong, or the build touched the hand-authored preview pages.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "build: production output — indexable, 404 page, open robots.txt

Generated with PROD=1. This is the artifact Cloudflare Pages serves."
```

---

## Self-Review

**Spec coverage**

| Spec item | Task |
|---|---|
| Production build flag (noindex, robots, Sitemap line) | 2 |
| `404.html` | 3 |
| Four `/service-page/` redirects + splat | 4 |
| No global catch-all | 4 (asserted) |
| `wrangler.toml`, `.dev.vars`, `.gitignore` | 5 |
| Deployable committed output | 6 |
| `www` canonical | none needed — `build.mjs:12` already correct, asserted in Task 2 |
| Pages env vars, Resend, DNS, cutover | **not code** — operator runbook below |

**Type consistency:** `buildTo(extraEnv)` and `read(dir, rel)` are defined once in Task 1 and reused unchanged in Tasks 2 and 3. `notFound()` is defined and called in Task 3 only. `rules()` is local to `test/redirects.test.mjs`.

---

## Operator Runbook — NOT agent tasks

These require dashboard access and cannot be automated from this repo. Sven runs them after Task 6 lands. Full detail in the spec's "Cutover sequence".

1. **Cloudflare Pages project** — connect `breynsv/coco-surfschool-final-v2`. Root `.`, output `.`, **no build command**. Test on `*.pages.dev`.
2. **Add the zone to Cloudflare** — let it import Wix's records. Change nothing.
3. **Repoint nameservers** in the Wix dashboard (Domains → Advanced). The site stays on Wix; the imported A records still point at Wix IPs.
4. **Resend** — verify `coco-surfschool.com` (DKIM/SPF/bounce-MX, DNS-only / grey cloud). Set `RESEND_API_KEY` (encrypted), `CONTACT_TO`, `CONTACT_FROM` in Pages. Test the form on `*.pages.dev`.
5. **Go live** — attach `www.coco-surfschool.com` as the Pages custom domain, apex → `www`.

Rollback: point DNS back at the Wix IPs. Keep the Wix subscription for several weeks.

**Post-deploy verification** (spec "Verification"): happy path emails Coco and Reply addresses the visitor; invalid email → 422; honeypot `company` filled → 200 but **no email**; all five languages; every Wix sitemap URL single-hop 301 → 200; unknown path → branded 404; apex → `www`.

**Raise with Coco before launch:** the three yoga classes are still taking bookings on Wix, and `/book-online` redirects to a contact form — replacing her live booking flow on launch day.

---

### Task 7: Exclude the booking pages from production

Added after Task 6, from an out-of-band SEO audit finding. `build.mjs:21` sets
`API_BASE = process.env.COCO_API || 'http://coco.membrero.test:8090'` and bakes it
into the page at build time. The Task 6 production build did not set `COCO_API`, so
all 5 booking pages shipped a dev-only, non-HTTPS endpoint. Verified in the committed
output. Consequences: mixed content blocks the fetch, the host is unresolvable from
the internet, and the 5 pages are in the sitemap and indexable — 5 permanently-empty
pages. The homepage hero CTA (`build.mjs:272`, `href="${u.book}"`) points at them.

Owner decision: exclude `/book/` from launch, redirect to contact, restore when the
Membrero booking API is live.

**Files:**
- Modify: `build.mjs` (constants, `urls()`, the build loop, the sitemap loop)
- Modify: `_redirects` (5 new rules)
- Modify: `test/build.test.mjs` (one existing assertion changes)
- Delete: `fr/reserver/`, `en/book/`, `nl/reserveren/`, `de/buchen/`, `es/reservar/`
- Test: `test/build.test.mjs`

**Interfaces:**
- Consumes: `PROD`, `buildTo()`, `read()`
- Produces: `PROD_EXCLUDE` and `EMITTED` in build.mjs

Contact slugs per language, needed for the redirect targets — copy exactly:
`fr: contact`, `en: contact`, `nl: contact`, `de: kontakt`, `es: contacto`.

- [ ] **Step 1: Update the one existing assertion that will change**

In `test/build.test.mjs`, the test `'sitemap always uses the www canonical host'`
asserts 55 `<loc>` entries. Production now emits 50 (11 page types minus `book`,
times 5 languages). Change that assertion from `55` to `50`. Leave the
`doesNotMatch` host assertion untouched.

- [ ] **Step 2: Write the failing tests**

Append to `test/build.test.mjs`:

```js
test('production omits the booking pages', async () => {
  const out = await buildTo({ PROD: '1' });
  for (const p of ['fr/reserver', 'en/book', 'nl/reserveren', 'de/buchen', 'es/reservar']) {
    await assert.rejects(read(out, `${p}/index.html`), `${p} must not be emitted in production`);
  }
});

test('preview still builds the booking pages', async () => {
  const out = await buildTo();
  const html = await read(out, 'fr/reserver/index.html');
  assert.match(html, /surf-sessions/);
});

test('production sitemap excludes the booking pages', async () => {
  const out = await buildTo({ PROD: '1' });
  const xml = await read(out, 'sitemap.xml');
  assert.equal((xml.match(/<loc>/g) || []).length, 50);
  for (const slug of ['reserver', '/book/', 'reserveren', 'buchen', 'reservar']) {
    assert.ok(!xml.includes(slug), `sitemap must not reference ${slug}`);
  }
});

test('production hero CTA points at contact, not the booking page', async () => {
  const out = await buildTo({ PROD: '1' });
  const html = await read(out, 'fr/index.html');
  assert.ok(!html.includes('fr/reserver/'), 'no link may target the excluded booking page');
  assert.match(html, /href="\.\.\/fr\/contact\/"/);
});

test('production refuses to build if booking is emitted with a non-https API', async () => {
  await assert.rejects(buildTo({ PROD: '1', COCO_BUILD_BOOK: '1' }),
    'build must fail rather than bake a dev endpoint into production');
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `node --test`
Expected: FAIL — the booking pages are still emitted in production.

- [ ] **Step 4: Add the exclusion constants**

In `build.mjs`, immediately after the `PROD` / `ROBOTS_META` block, add:

```js
// The booking page renders a live sessions list from the Membrero CRM API.
// Until that API is reachable over https from this domain it would render a
// permanent "Loading available sessions…" state, so production omits it; the
// slugs are redirected to contact in _redirects. Set COCO_BUILD_BOOK=1 (with a
// real https COCO_API) to bring it back.
const BUILD_BOOK = process.env.COCO_BUILD_BOOK === '1';
const PROD_EXCLUDE = PROD && !BUILD_BOOK ? ['book'] : [];
```

- [ ] **Step 5: Add the build guard**

Immediately after the `API_BASE` declaration (`build.mjs:21`), add:

```js
// Never bake a non-https or dev API host into a production page.
if (process.env.PROD === '1' && process.env.COCO_BUILD_BOOK === '1'
    && !/^https:\/\//.test(API_BASE)) {
  console.error(`Refusing to build: PROD=1 with the booking page enabled, but COCO_API is "${API_BASE}" (not https). Set COCO_API to the production booking API.`);
  process.exit(1);
}
```

- [ ] **Step 6: Derive the emitted page list**

After the `KEYS` declaration, add:

```js
const EMITTED = KEYS.filter(k => !PROD_EXCLUDE.includes(k));
```

In `urls()`, immediately after the line `for (const k of KEYS) u[k] = ...`, add:

```js
  // Excluded pages are not emitted; point their links at contact so no CTA
  // lands on a redirect or a 404.
  for (const k of PROD_EXCLUDE) u[k] = root + lang + '/' + PAGES.contact[lang] + '/';
```

- [ ] **Step 7: Use EMITTED in both loops**

In `build()`, the page loop reads `for (const key of KEYS) {`. Change that one
occurrence to `for (const key of EMITTED) {`.

The sitemap loop reads `for (const key of KEYS) for (const lang of LANGS) {`.
Change it to `for (const key of EMITTED) for (const lang of LANGS) {`.

Change nothing else that references `KEYS` — `urls()` must still populate every key.

- [ ] **Step 8: Run the tests to verify they pass**

Run: `node --test`
Expected: PASS, 18 tests.

- [ ] **Step 9: Add the redirects**

Append to `_redirects`:

```
# ---- Booking pages withheld until the Membrero booking API is live ----
# build.mjs omits these from PROD builds; without these rules they would 404.
/fr/reserver/     /fr/contact/    301
/en/book/         /en/contact/    301
/nl/reserveren/   /nl/contact/    301
/de/buchen/       /de/kontakt/    301
/es/reservar/     /es/contacto/   301
```

- [ ] **Step 10: Rebuild and remove the stale committed pages**

The build does not delete files, so the 5 booking directories committed in Task 6
must be removed explicitly.

```bash
PROD=1 node build.mjs
git rm -r --quiet fr/reserver en/book nl/reserveren de/buchen es/reservar
```

- [ ] **Step 11: Verify**

```bash
echo "dev API refs remaining (expect 0):"; grep -rl "coco.membrero.test" --include=index.html fr en nl de es | wc -l
echo "sitemap locs (expect 50):"; grep -c "<loc>" sitemap.xml
echo "booking dirs remaining (expect 0):"; ls -d fr/reserver en/book nl/reserveren de/buchen es/reservar 2>/dev/null | wc -l
echo "hero CTA target:"; grep -o 'hero-cta"><a class="btn btn--primary" href="[^"]*"' fr/index.html
```

Expected: `0`, `50`, `0`, and a hero CTA pointing at `../fr/contact/`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "fix: withhold booking pages from production

build.mjs baked http://coco.membrero.test:8090 into all 5 booking pages
whenever COCO_API was unset, which the production build was. Mixed content
plus an unresolvable host meant 5 indexable, permanently-empty pages, and
the homepage hero CTA pointed at them. Excluded from PROD, redirected to
contact, and a guard now refuses to build them with a non-https API."
```
