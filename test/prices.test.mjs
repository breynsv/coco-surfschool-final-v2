import { test } from 'node:test';
import assert from 'node:assert/strict';

import fr from '../content/fr.mjs';
import en from '../content/en.mjs';
import nl from '../content/nl.mjs';
import de from '../content/de.mjs';
import es from '../content/es.mjs';

const C = { fr, en, nl, de, es };
const LANGS = Object.keys(C);

/**
 * Each single-lesson price is quoted in FIVE places per language: the homepage
 * lesson card, a homepage hero fact, the lessons page meta description, the
 * rate card itself, and the priceRange in the business schema. That is 25 spots
 * per price across the site.
 *
 * They drifted: the site published a €44 deluxe lesson and a €38 group lesson
 * for months against a real rate card of €52 and €40, and it took the owner
 * spotting it. Nothing in the build could see it, because each copy was
 * internally consistent — they were just consistent with the wrong number.
 *
 * These tests take the RATE CARD as the single source of truth (it is the one
 * customers read before paying) and hold every other quotation to it.
 */

/** Every euro amount in a string, in order. Handles "44 € pp" and "€44 pp". */
const euros = (s) => [...String(s).replace(/<[^>]+>/g, ' ').matchAll(/€\s*(\d+)|(\d+)\s*€/g)]
  .map(m => Number(m[1] ?? m[2]));

/** The headline (1-lesson) price of each group formula, from the rate card. */
function singlesOf(c) {
  const cards = c.pages.lessons.rates.cards;
  // Cards 0 and 1 are the two per-person group formulas; card 2 prices by party
  // size, so it has no comparable "one lesson" figure.
  const [deluxe, group] = cards;
  return {
    deluxe: euros(deluxe.lines[0][1])[0],
    group: euros(group.lines[0][1])[0],
  };
}

test('the rate card exposes a single-lesson price for both group formulas', () => {
  for (const lang of LANGS) {
    const s = singlesOf(C[lang]);
    assert.ok(Number.isFinite(s.deluxe) && s.deluxe > 0, `${lang}: no deluxe single-lesson price`);
    assert.ok(Number.isFinite(s.group) && s.group > 0, `${lang}: no group single-lesson price`);
    assert.ok(s.deluxe > s.group, `${lang}: deluxe (${s.deluxe}) should cost more than group (${s.group})`);
  }
});

test('all five languages quote the same prices', () => {
  const ref = singlesOf(C.fr);
  for (const lang of LANGS) {
    assert.deepEqual(singlesOf(C[lang]), ref, `${lang} disagrees with fr on the single-lesson prices`);
  }
});

test('the homepage lesson cards quote the rate card, not a stale copy', () => {
  for (const lang of LANGS) {
    const s = singlesOf(C[lang]);
    const froms = C[lang].pages.home.lessonsT.cards.map(card => euros(card.from)[0]).filter(Number.isFinite);
    assert.ok(froms.includes(s.deluxe), `${lang}: no lesson card quotes the deluxe price ${s.deluxe} (cards say ${froms})`);
    assert.ok(froms.includes(s.group), `${lang}: no lesson card quotes the group price ${s.group} (cards say ${froms})`);
  }
});

test('the homepage hero "from" figure is a price that exists', () => {
  for (const lang of LANGS) {
    const s = singlesOf(C[lang]);
    const facts = C[lang].pages.home.hero.facts.map(f => euros(f.b)[0]).filter(Number.isFinite);
    assert.equal(facts.length, 1, `${lang}: expected exactly one priced hero fact, got ${facts.length}`);
    assert.ok([s.deluxe, s.group].includes(facts[0]),
      `${lang}: hero quotes ${facts[0]} €, which is neither the deluxe (${s.deluxe}) nor the group (${s.group}) price`);
  }
});

test('the lessons meta description quotes both current prices', () => {
  for (const lang of LANGS) {
    const s = singlesOf(C[lang]);
    const inDesc = euros(C[lang].pages.lessons.desc);
    assert.ok(inDesc.includes(s.deluxe), `${lang}: meta description misses the deluxe price ${s.deluxe} (has ${inDesc})`);
    assert.ok(inDesc.includes(s.group), `${lang}: meta description misses the group price ${s.group} (has ${inDesc})`);
  }
});

test('priceRange starts at the cheapest lesson actually sold', () => {
  for (const lang of LANGS) {
    const s = singlesOf(C[lang]);
    const range = euros(C[lang].pages.home.jsonld.priceRange);
    assert.equal(range.length, 2, `${lang}: priceRange is not a two-ended range: ${C[lang].pages.home.jsonld.priceRange}`);
    assert.equal(range[0], Math.min(s.deluxe, s.group),
      `${lang}: priceRange starts at ${range[0]} € but the cheapest lesson is ${Math.min(s.deluxe, s.group)} €`);
    assert.ok(range[1] >= range[0], `${lang}: priceRange ends below where it starts`);
  }
});

/**
 * Packs must stay cheaper per lesson than buying singly, or the pack is not an
 * offer at all. This is what would have caught a single-lesson price being
 * raised while its packs were left behind — or a pack being edited in isolation.
 */
test('every multi-lesson pack beats the single-lesson price', () => {
  for (const lang of LANGS) {
    const s = singlesOf(C[lang]);
    const cards = C[lang].pages.lessons.rates.cards;
    for (const [i, key] of [[0, 'deluxe'], [1, 'group']]) {
      for (const [label, price] of cards[i].lines) {
        const n = (String(label).match(/(\d+)\s*(?:cours|lessen|lessons|Kurse|clases)/i) || [])[1];
        if (!n || Number(n) < 2) continue;
        const per = euros(price)[0] / Number(n);
        assert.ok(per <= s[key],
          `${lang}: "${label}" works out at ${per.toFixed(2)} €/lesson, above the ${s[key]} € single price`);
      }
    }
  }
});
