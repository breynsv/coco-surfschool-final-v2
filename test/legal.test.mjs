// The two legal documents, and the consent the contact form now asks for.
//
// France requires a mentions légales page at all (LCEN art. 6-III) and the GDPR
// requires the art. 13 notice at the point of collection, so these are not
// "content tests": they check that a legal obligation is still being met after
// somebody edits a content file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const LANGS = ['fr', 'en', 'nl', 'de', 'es'];

const LEGAL_SLUGS = { fr: 'mentions-legales', en: 'legal-notice', nl: 'wettelijke-vermeldingen', de: 'impressum', es: 'aviso-legal' };
const PRIVACY_SLUGS = { fr: 'politique-de-confidentialite', en: 'privacy-policy', nl: 'privacybeleid', de: 'datenschutz', es: 'politica-de-privacidad' };
const CONTACT_SLUGS = { fr: 'contact', en: 'contact', nl: 'contact', de: 'kontakt', es: 'contacto' };

let built;
async function build() {
  if (built) return built;
  const out = await mkdtemp(join(tmpdir(), 'coco-legal-'));
  execFileSync(process.execPath, [join(REPO, 'build.mjs')], {
    env: { ...process.env, COCO_OUT: out, PROD: '1' },
    stdio: 'pipe',
  });
  built = out;
  return out;
}
const page = async (lang, slugs) => readFile(join(await build(), lang, slugs[lang], 'index.html'), 'utf8');

/**
 * The identity facts, exactly as they appear on Annelies's URSSAF record. These
 * are asserted as literals rather than imported from build.mjs on purpose: a
 * test that reads OWNER would pass just as happily if OWNER itself were edited
 * to the wrong SIRET, which is the mistake worth catching.
 */
test('the legal notice carries the registered identity, in every language', async () => {
  for (const lang of LANGS) {
    const html = await page(lang, LEGAL_SLUGS);
    for (const fact of [
      'Annelies Maria Flore Debo',
      '47 E avenue de la Marquèze',
      '40510',
      'Seignosse',
      '819 825 613 00030',
      '8551Z',
      '14/04/2016',
      'Cloudflare, Inc.',
      'cocobosurfschool@gmail.com',
    ]) {
      assert.ok(html.includes(fact), `${lang}: the legal notice does not state "${fact}"`);
    }
  }
});

test('the legal notice states the VAT position rather than leaving it blank', async () => {
  // She is under the franchise en base and has no VAT number to publish. Saying
  // so is a legal mention in its own right; saying nothing looks like an omission.
  for (const lang of LANGS) {
    const html = await page(lang, LEGAL_SLUGS);
    assert.ok(/293\s*B/.test(html), `${lang}: no reference to the article 293 B VAT exemption`);
  }
});

test('the privacy policy states the retention period Annelies confirmed', async () => {
  // Two years from last contact, confirmed 2026-08-21. If someone shortens the
  // policy, this is the sentence that must not quietly disappear.
  const TWO_YEARS = { fr: 'Deux ans', en: 'Two years', nl: 'Twee jaar', de: 'Zwei Jahre', es: 'Dos años' };
  for (const lang of LANGS) {
    const html = await page(lang, PRIVACY_SLUGS);
    assert.ok(html.includes(TWO_YEARS[lang]), `${lang}: the two-year retention period is not stated`);
  }
});

test('the privacy policy names every third party that receives visitor data', async () => {
  // Resend gets the message; Cloudflare gets the IP; Open-Meteo gets the IP of
  // anyone who loads the home page, which is the one that is easy to forget
  // because it is called from the browser rather than from our own server.
  for (const lang of LANGS) {
    const html = await page(lang, PRIVACY_SLUGS);
    for (const processor of ['Resend', 'Cloudflare', 'Open-Meteo']) {
      assert.ok(html.includes(processor), `${lang}: the privacy policy does not disclose ${processor}`);
    }
    assert.ok(/CNIL/.test(html), `${lang}: no supervisory authority named for complaints`);
  }
});

test('both legal documents are reachable from the footer of every page', async () => {
  const out = await build();
  let seen = 0;
  const walk = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { await walk(p); continue; }
      if (e.name !== 'index.html') continue;
      seen++;
      const html = await readFile(p, 'utf8');
      const lang = p.replace(out + '/', '').split('/')[0];
      assert.ok(html.includes(`${LEGAL_SLUGS[lang]}/"`), `${p}: no link to the legal notice`);
      assert.ok(html.includes(`${PRIVACY_SLUGS[lang]}/"`), `${p}: no link to the privacy policy`);
    }
  };
  for (const lang of LANGS) await walk(join(out, lang));
  assert.ok(seen >= 50, `page walk found only ${seen} page(s); the walk itself is broken`);
});

/**
 * The prose in the content files links to other pages as {privacy}, {legal},
 * {contact}, {coach} — the slugs differ per language, so a hand-written href
 * would be right in French and 404 in the other four. An unresolved token is a
 * dead link that renders as literal braces on a legal page.
 */
test('no unresolved {token} link survives into a legal document', async () => {
  for (const lang of LANGS) {
    for (const slugs of [LEGAL_SLUGS, PRIVACY_SLUGS]) {
      const html = await page(lang, slugs);
      const prose = html.match(/<div class="prose reveal">([\s\S]*?)<\/div>\s*<p class="doc-updated/);
      assert.ok(prose, `${lang}/${slugs[lang]}: no prose block found`);
      assert.doesNotMatch(prose[1], /\{\w+\}/, `${lang}/${slugs[lang]}: unresolved link token`);
    }
  }
});

test('every internal link on a legal document points at a page that exists', async () => {
  const out = await build();
  for (const lang of LANGS) {
    for (const slugs of [LEGAL_SLUGS, PRIVACY_SLUGS]) {
      const html = await page(lang, slugs);
      const prose = html.match(/<div class="prose reveal">([\s\S]*?)<\/div>\s*<p class="doc-updated/)[1];
      for (const [, href] of prose.matchAll(/href="(\.\.\/[^"]+)"/g)) {
        const target = join(out, lang, slugs[lang], href, 'index.html');
        await readFile(target, 'utf8'); // throws if the page is not there
      }
    }
  }
});

/**
 * GDPR art. 13 wants the notice where the data is collected, not only on a page
 * the visitor has to go looking for. And the newsletter opt-in has to be a free
 * choice: a `required` checkbox is not consent.
 */
test('the contact form carries the privacy notice and an optional opt-in', async () => {
  for (const lang of LANGS) {
    const html = await page(lang, CONTACT_SLUGS);
    const form = html.match(/<form class="contact-form[\s\S]*?<\/form>/);
    assert.ok(form, `${lang}: no contact form`);

    assert.match(form[0], /name="consent"[^>]*>/, `${lang}: no newsletter opt-in on the contact form`);
    assert.doesNotMatch(form[0], /name="consent"[^>]*required/, `${lang}: the opt-in is required — that is not consent`);
    assert.doesNotMatch(form[0], /name="consent"[^>]*checked/, `${lang}: the opt-in is pre-ticked — that is not consent either`);

    assert.ok(form[0].includes('class="form-privacy"'), `${lang}: no art. 13 notice at the point of collection`);
    assert.ok(form[0].includes(`${PRIVACY_SLUGS[lang]}/"`), `${lang}: the form notice does not link the privacy policy`);
  }
});
