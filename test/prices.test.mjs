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

/**
 * Every per-lesson rate a formula can actually be bought at, cheapest last:
 * the single price, and each pack's price divided by its lesson count. A "from"
 * claim has to land on one of these, floored to the euro.
 *
 * Lines that price something other than a run of lessons (the family discount,
 * which is per person for a given number of sign-ups) carry no lesson count and
 * are skipped rather than guessed at.
 */
function perLessonRates(c, idx) {
  const card = c.pages.lessons.rates.cards[idx];
  const out = [];
  for (const [label, price] of card.lines) {
    const p = euros(price)[0];
    if (!Number.isFinite(p)) continue;
    const m = String(label).match(/(\d+)\s*(?:cours|lessen|lessons|Kurse|clases)/i);
    const n = m ? Number(m[1]) : (/^1\s|^1$/.test(String(label).trim()) ? 1 : null);
    if (n === null) continue;
    out.push(Math.floor(p / n));
  }
  return [...new Set(out)].sort((a, b) => b - a);
}

/**
 * "From 44 €" is not the single-lesson price — it is what a deluxe lesson costs
 * inside the 5-day camp (220/5). Coco quotes the pack rates on purpose, and
 * that is legitimate: it is a real price a real customer pays. What must never
 * happen is a "from" figure that corresponds to NO purchasable rate, which is
 * how the site ended up advertising 44 and 38 as single-lesson prices for
 * months. So the rule is not "matches the single price" — it is "is achievable".
 */
test('every "from" price on the homepage is a rate someone can actually pay', () => {
  for (const lang of LANGS) {
    const c = C[lang];
    const cards = c.pages.home.lessonsT.cards;
    for (const [idx, cardIdx] of [[0, 0], [1, 1]]) {
      const shown = euros(cards[idx].from)[0];
      const achievable = perLessonRates(c, cardIdx);
      assert.ok(achievable.includes(shown),
        `${lang}: card ${idx} says "from ${shown} €", which is not a rate this formula sells. Achievable: ${achievable.join(', ')}`);
    }
  }
});

test('a "from" price never exceeds the single-lesson price it advertises', () => {
  for (const lang of LANGS) {
    const s = singlesOf(C[lang]);
    const cards = C[lang].pages.home.lessonsT.cards;
    assert.ok(euros(cards[0].from)[0] <= s.deluxe, `${lang}: deluxe "from" is above its own single price`);
    assert.ok(euros(cards[1].from)[0] <= s.group, `${lang}: group "from" is above its own single price`);
  }
});

/**
 * The hero is the site-wide "from", so it must be the lowest of the per-formula
 * "from" figures — never a mid-range one. It used to quote the deluxe rate while
 * a cheaper group lesson existed, advertising a higher entry price than the
 * school actually has.
 */
test('the homepage hero quotes the lowest "from" price on the page', () => {
  for (const lang of LANGS) {
    const cards = C[lang].pages.home.lessonsT.cards;
    const froms = cards.map(x => euros(x.from)[0]).filter(Number.isFinite);
    const facts = C[lang].pages.home.hero.facts.map(f => euros(f.b)[0]).filter(Number.isFinite);
    assert.equal(facts.length, 1, `${lang}: expected exactly one priced hero fact, got ${facts.length}`);
    assert.equal(facts[0], Math.min(...froms),
      `${lang}: hero says "from ${facts[0]} €" but the lowest card is ${Math.min(...froms)} €`);
  }
});

test('the lessons meta description agrees with the homepage "from" prices', () => {
  for (const lang of LANGS) {
    const cards = C[lang].pages.home.lessonsT.cards;
    const inDesc = euros(C[lang].pages.lessons.desc);
    for (const [i, name] of [[0, 'deluxe'], [1, 'group']]) {
      const shown = euros(cards[i].from)[0];
      assert.ok(inDesc.includes(shown),
        `${lang}: meta description does not quote the ${name} "from" price ${shown} € (has ${inDesc})`);
    }
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
