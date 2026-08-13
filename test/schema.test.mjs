import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://www.coco-surfschool.com';
const LANGS = ['fr', 'nl', 'de', 'en', 'es'];

let built;
async function site() {
  if (!built) {
    const out = await mkdtemp(join(tmpdir(), 'coco-schema-'));
    execFileSync(process.execPath, [join(REPO, 'build.mjs')], {
      env: { ...process.env, COCO_OUT: out, PROD: '1' }, stdio: 'pipe',
    });
    built = out;
  }
  return built;
}

/** Every JSON-LD block on one built page, parsed. */
async function ld(file) {
  const html = await readFile(join(await site(), file), 'utf8');
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(m => JSON.parse(m[1]));
}

/** [file, parsed blocks] for every language page in the build. */
async function allPages() {
  const root = await site();
  const out = [];
  const walk = async (dir, rel) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) await walk(join(dir, e.name), `${rel}${e.name}/`);
      else if (e.name === 'index.html' && LANGS.includes(rel.split('/')[0])) {
        out.push([rel + e.name, await ld(rel + e.name)]);
      }
    }
  };
  await walk(root, '');
  return out;
}

test('every JSON-LD block on the site is valid JSON', async () => {
  const root = await site();
  let blocks = 0;
  const walk = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { await walk(p); continue; }
      if (!e.name.endsWith('.html')) continue;
      const html = await readFile(p, 'utf8');
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        blocks++;
        assert.doesNotThrow(() => JSON.parse(m[1]), `invalid JSON-LD in ${p}`);
      }
    }
  };
  await walk(root);
  assert.ok(blocks >= 70, `only ${blocks} JSON-LD blocks found; expected the full set`);
});

/**
 * 30 of 50 pages shipped with no structured data at all — every page except
 * the homes, the two spot pages and contact. Breadcrumbs alone now cover the
 * rest, so "no schema" should never be the answer again.
 */
test('no page ships without structured data', async () => {
  const bare = (await allPages()).filter(([, blocks]) => blocks.length === 0).map(([f]) => f);
  assert.deepEqual(bare, [], `pages with no JSON-LD: ${bare.join(', ')}`);
});

/**
 * The business used to be redeclared in full on 15 URLs with no @id, so
 * nothing tied those copies to one entity. Exactly the five home pages may
 * declare it now, all under the same @id; everyone else references it.
 */
test('the business entity is declared once per language, under one shared @id', async () => {
  const declaring = [];
  for (const [file, blocks] of await allPages()) {
    for (const b of blocks) {
      if (b['@type'] === 'SportsActivityLocation') {
        declaring.push(file);
        assert.equal(b['@id'], `${SITE}/#business`, `${file} declares the business under a different @id`);
      }
    }
  }
  assert.equal(declaring.length, 5,
    `expected exactly 5 business declarations (one per language home), got ${declaring.length}: ${declaring.join(', ')}`);
  assert.deepEqual(declaring.map(f => f.split('/')[0]).sort(), [...LANGS].sort());
});

test('pages that reference the business do not redeclare it', async () => {
  for (const [file, blocks] of await allPages()) {
    for (const b of blocks) {
      const ref = b.provider || b.worksFor;
      if (!ref) continue;
      assert.deepEqual(ref, { '@id': `${SITE}/#business` },
        `${file} inlines the business instead of referencing its @id`);
    }
  }
});

/**
 * The lessons page publishes real prices in prose. If the markup drifts from
 * the page, the markup is worse than useless — so assert the two agree.
 */
test('every euro price on the lessons page appears as an Offer', async () => {
  const root = await site();
  for (const lang of LANGS) {
    const dir = (await readdir(join(root, lang), { withFileTypes: true }))
      .filter(e => e.isDirectory()).map(e => e.name);
    // The lessons slug differs per language; find it by its Service block.
    let found = null;
    for (const d of dir) {
      const blocks = await ld(`${lang}/${d}/index.html`);
      const svc = blocks.find(b => b['@type'] === 'Service' && b.hasOfferCatalog);
      if (svc) { found = { d, svc }; break; }
    }
    assert.ok(found, `${lang}: no lessons Service with an OfferCatalog found`);

    const offers = found.svc.hasOfferCatalog.itemListElement;
    assert.ok(offers.length >= 10, `${lang}: only ${offers.length} offers marked up`);

    const html = await readFile(join(root, lang, found.d, 'index.html'), 'utf8');
    // fr/de/es render "44 €", nl/en render "€44" — accept either.
    const rendered = new Set(
      [...html.matchAll(/€\s*(?:&nbsp;)?\s*(\d+)|(\d+)\s*(?:&nbsp;)?\s*€/g)].map(m => m[1] || m[2])
    );
    const marked = new Set(offers.map(o => String(Math.round(Number(o.price)))));
    for (const o of marked) {
      assert.ok(rendered.has(o), `${lang}: Offer price ${o} € is marked up but not shown on the page`);
    }
    for (const o of offers) {
      assert.equal(o.priceCurrency, 'EUR');
      assert.ok(Number(o.price) > 0, `${lang}: offer with a non-positive price: ${JSON.stringify(o)}`);
      assert.ok(o.name && !/[<>]/.test(o.name), `${lang}: offer name carries markup: ${o.name}`);
    }
  }
});

test('the coach page carries a Person with real credentials', async () => {
  for (const lang of LANGS) {
    const root = await site();
    const dirs = (await readdir(join(root, lang), { withFileTypes: true }))
      .filter(e => e.isDirectory()).map(e => e.name);
    let person = null;
    for (const d of dirs) {
      const p = (await ld(`${lang}/${d}/index.html`)).find(b => b['@type'] === 'Person');
      if (p) { person = p; break; }
    }
    assert.ok(person, `${lang}: no Person schema on any page`);
    assert.equal(person.name, 'Annelies');
    assert.ok(person.jobTitle && !/^(Votre|Jouw|Deine|Your|Tu) /.test(person.jobTitle),
      `${lang}: jobTitle looks like a page kicker, not an occupation: ${person.jobTitle}`);
    assert.ok(person.hasCredential.length >= 5, `${lang}: only ${person.hasCredential?.length} credentials`);
    for (const c of person.hasCredential) {
      assert.ok(!/[<>]|&amp;/.test(c.name), `${lang}: credential carries raw markup: ${c.name}`);
    }
  }
});

/**
 * Breadcrumbs render on every interior page. The markup must describe the
 * trail the visitor actually sees, so both entries are checked against the
 * rendered nav rather than assumed.
 */
test('breadcrumb markup matches the breadcrumb the visitor sees', async () => {
  const root = await site();
  let checked = 0;
  for (const [file, blocks] of await allPages()) {
    const html = await readFile(join(root, file), 'utf8');
    const nav = html.match(/<nav class="crumbs"[\s\S]*?<\/nav>/);
    const bc = blocks.find(b => b['@type'] === 'BreadcrumbList');

    if (!nav) { assert.ok(!bc, `${file} has BreadcrumbList markup but renders no breadcrumb`); continue; }
    assert.ok(bc, `${file} renders a breadcrumb but ships no BreadcrumbList`);

    // The nav carries HTML entities ("Kurse &amp; Preise"); JSON-LD carries the
    // decoded text. Compare like with like.
    const decode = (s) => s
      .replace(/&amp;/g, '&').replace(/&nbsp;|&#160;/g, ' ')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ').trim();
    const labels = [...nav[0].matchAll(/>([^<>]+)</g)].map(m => decode(m[1])).filter(s => s && s !== '/');
    assert.equal(bc.itemListElement.length, 2);
    assert.equal(bc.itemListElement[0].position, 1);
    assert.equal(bc.itemListElement[1].position, 2);
    for (const item of bc.itemListElement) {
      assert.ok(item.item.startsWith(SITE), `${file}: breadcrumb item is not an absolute URL: ${item.item}`);
      assert.ok(labels.some(l => l === item.name),
        `${file}: breadcrumb name "${item.name}" is not one of the rendered labels ${JSON.stringify(labels)}`);
    }
    checked++;
  }
  assert.ok(checked >= 45, `only ${checked} breadcrumbs checked; expected every interior page`);
});

test('the home pages carry no breadcrumb markup, because they render none', async () => {
  for (const lang of LANGS) {
    const blocks = await ld(`${lang}/index.html`);
    assert.ok(!blocks.some(b => b['@type'] === 'BreadcrumbList'), `${lang} home ships a stray BreadcrumbList`);
  }
});

/** JSON-LD is data, not markup: HTML entities from the content files must be decoded. */
test('no JSON-LD string carries raw HTML or undecoded entities', async () => {
  const offenders = [];
  const scan = (node, path, file) => {
    if (typeof node === 'string') {
      if (/<[a-z/][^>]*>/i.test(node) || /&(amp|nbsp|lt|gt|quot|#\d+);/.test(node)) {
        offenders.push(`${file} ${path}: ${node.slice(0, 70)}`);
      }
      return;
    }
    if (Array.isArray(node)) return node.forEach((v, i) => scan(v, `${path}[${i}]`, file));
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k === '@context' || k === '@id' || k === 'url' || k === 'item' || k === 'image') continue;
        scan(v, `${path}.${k}`, file);
      }
    }
  };
  for (const [file, blocks] of await allPages()) blocks.forEach((b, i) => scan(b, `[${i}]`, file));
  assert.deepEqual(offenders, [], `JSON-LD strings carrying markup:\n  ${offenders.join('\n  ')}`);
});

/**
 * For a local business, the site and the Google Business Profile agreeing is
 * the whole point — Google cross-checks them, and a near-miss is worse than
 * saying less. The profile reads "plage des Bourdaines, 40510 Seignosse,
 * France"; these assertions pin the site to that.
 */
test('the business address and coordinates match the Google Business Profile', async () => {
  for (const lang of LANGS) {
    const biz = (await ld(`${lang}/index.html`)).find(b => b['@type'] === 'SportsActivityLocation');
    assert.ok(biz, `${lang}: no business schema`);

    assert.equal(biz.address.streetAddress, 'Plage des Bourdaines', `${lang}: streetAddress drifted`);
    assert.equal(biz.address.postalCode, '40510', `${lang}: postcode drifted`);
    assert.equal(biz.address.addressLocality, 'Seignosse', `${lang}: locality drifted`);
    assert.equal(biz.address.addressCountry, 'FR');

    // Les Bourdaines, geocoded via OpenStreetMap. The tolerance is wide enough
    // to allow a re-geocode and narrow enough to catch a transposed sign or a
    // decimal slip, which would land the school in the ocean or another country.
    assert.ok(Math.abs(biz.geo.latitude - 43.6979) < 0.01, `${lang}: latitude is off: ${biz.geo.latitude}`);
    assert.ok(Math.abs(biz.geo.longitude - -1.4392) < 0.01, `${lang}: longitude is off: ${biz.geo.longitude}`);
    assert.equal(biz.geo['@type'], 'GeoCoordinates');
  }
});

/**
 * Opening hours are NOT published, on purpose: only the 20:00 closing time is
 * confirmed. If someone adds them later this test should be updated with the
 * real pattern, not deleted — hours that are wrong send people to a beach for
 * nothing, which is worse than no hours at all.
 */
test('no opening hours are published while they are unconfirmed', async () => {
  for (const lang of LANGS) {
    const biz = (await ld(`${lang}/index.html`)).find(b => b['@type'] === 'SportsActivityLocation');
    assert.ok(!biz.openingHoursSpecification && !biz.openingHours,
      `${lang}: opening hours are published — confirm the full weekly pattern against the Google profile first`);
  }
});
