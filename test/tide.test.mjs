// The surf report's tide times come from pre-computed tables in data/tide/<year>.json
// (scripts/tide/build_tide_tables.py), not from an API. These tests guard the three
// ways that can quietly go wrong: the tables run out, a table is malformed, or the
// site drifts back to calling a paid/non-commercial tide API.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIDE_DIR = join(REPO, 'data', 'tide');
const readTable = async (y) => JSON.parse(await readFile(join(TIDE_DIR, `${y}.json`), 'utf8'));

// Fails a few years before the tables run out, not on the day the widget goes blank.
// When it fails: run `build_tide_tables.py generate` for the next years (see scripts/tide/README.md).
const YEARS_AHEAD = 5;

test(`tide tables exist for this year and the next ${YEARS_AHEAD}`, async () => {
  const have = new Set((await readdir(TIDE_DIR)).filter(f => /^\d{4}\.json$/.test(f)));
  const now = new Date().getUTCFullYear();
  const missing = [];
  for (let y = now; y <= now + YEARS_AHEAD; y++) if (!have.has(`${y}.json`)) missing.push(y);
  assert.deepEqual(missing, [], `no tide table for ${missing.join(', ')} — extend data/tide/`);
});

test('every tide table is well-formed: alternating, ~4 a day, covering the whole Paris year', async () => {
  const files = (await readdir(TIDE_DIR)).filter(f => /^\d{4}\.json$/.test(f));
  assert.ok(files.length >= 20, `expected 20+ years of tables, found ${files.length}`);
  for (const f of files) {
    const t = await readTable(f.slice(0, 4));
    const y = t.year;
    assert.equal(`${y}.json`, f);
    assert.match(t.source, /REFMAR/, `${f}: source credit missing`);
    const ex = t.extremes;
    for (let i = 0; i < ex.length; i++) {
      assert.ok(ex[i].type === 'high' || ex[i].type === 'low', `${f}[${i}] bad type`);
      assert.match(ex[i].time, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00Z$/, `${f}[${i}] bad time`);
      assert.ok(!Number.isNaN(Date.parse(ex[i].time)));
      if (i) {
        assert.notEqual(ex[i].type, ex[i - 1].type, `${f}: two ${ex[i].type}s in a row at ${ex[i].time}`);
        const gapH = (Date.parse(ex[i].time) - Date.parse(ex[i - 1].time)) / 3.6e6;
        assert.ok(gapH > 4 && gapH < 8.5, `${f}: ${gapH.toFixed(1)}h between tides at ${ex[i].time}`);
      }
    }
    // Paris is ahead of UTC, so Paris 1 January starts on 31 December UTC, and
    // "tomorrow" on 31 December needs 1 January of the next year.
    assert.ok(ex[0].time < `${y}-01-01T00:00:00Z` && ex[0].time >= `${y - 1}-12-31`, `${f}: no margin before the year`);
    assert.ok(ex.at(-1).time >= `${y + 1}-01-01T12:00:00Z`, `${f}: no margin after the year`);
    const inYear = ex.filter(e => e.time.startsWith(String(y))).length;
    const days = (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 366 : 365;
    assert.ok(Math.abs(inYear / days - 3.866) < 0.02, `${f}: ${(inYear / days).toFixed(3)} tides/day`);
  }
});

test('the site no longer fetches tides from Stormglass or any other tide API', async () => {
  const sources = ['surf-report.js', 'build.mjs', ...['fr', 'nl', 'de', 'en', 'es'].map(l => `content/${l}.mjs`)];
  const workflows = await readdir(join(REPO, '.github', 'workflows')).catch(() => []);
  sources.push(...workflows.map(w => `.github/workflows/${w}`));
  const offenders = [];
  for (const s of sources) {
    const txt = await readFile(join(REPO, s), 'utf8');
    if (/stormglass|worldtides|STORMGLASS_KEY/i.test(txt)) offenders.push(s);
  }
  assert.deepEqual(offenders, [], `still references a tide API: ${offenders.join(', ')}`);
});

test('the surf report reads the per-year tide tables', async () => {
  const js = await readFile(join(REPO, 'surf-report.js'), 'utf8');
  assert.doesNotMatch(js, /data\/tide\.json/, 'surf-report.js still reads the old single tide.json');
  assert.match(js, /\+ ?'\.json'/, 'surf-report.js should request <base><year>.json');
  const build = await readFile(join(REPO, 'build.mjs'), 'utf8');
  assert.match(build, /data-tide="\$\{u\.root\}data\/tide\/"/, 'the surf-report section should point data-tide at data/tide/');
});
