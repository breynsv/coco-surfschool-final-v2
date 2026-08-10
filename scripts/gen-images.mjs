/**
 * Encode the responsive-image derivatives that build.mjs references.
 *
 *   node scripts/gen-images.mjs           # only what is missing or stale
 *   node scripts/gen-images.mjs --force   # re-encode everything
 *
 * Output always lands in assets/images/ and is committed, because the
 * Cloudflare build runs plain `node build.mjs` with no image toolchain. Run
 * this locally whenever a master image changes.
 *
 * Sources come from two places: photograph masters sit in assets/images/
 * because the built pages link to them as the <img> fallback, while the flat
 * graphics are read from masters/ — see MASTERS_DIR in image-manifest.mjs.
 *
 * Requires cwebp, avifenc (libwebp / libavif) and sips (macOS).
 *   brew install webp libavif
 */
import { execFile } from 'node:child_process';
import { readdir, stat, unlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import {
  ICONS, LOGO, MASTERS_DIR, PALM, PHOTOS, PHOTO_WIDTHS, variant, widthsFor,
} from './image-manifest.mjs';

const run = promisify(execFile);
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(REPO, 'assets', 'images');
// Masters for the flat graphics, deliberately outside the deployed assets tree.
const MASTERS = join(REPO, MASTERS_DIR);
const FORCE = process.argv.includes('--force');

/**
 * Quality settings, chosen by encoding carousel-1 at 1200px across the range
 * and comparing: avif cq-level 30 lands at ~44 KB with no visible loss on
 * these soft pastel beach shots, where cq 50 collapsed to 10 KB and banded the
 * sky. Lower cq-level means higher quality in aom.
 *
 * There is deliberately no JPEG fallback ladder. Every browser that lacks WebP
 * (Safari 13 and older, IE) is inside the last ~2%, and giving them the
 * original master costs no repo weight and never downloads for anyone else.
 */
const Q = { webp: 72, avif: 30, graphicWebp: 90, graphicAvif: 20 };

let made = 0, skipped = 0;
const problems = [];

async function size(path) {
  try { return (await stat(path)).size; } catch { return null; }
}

/** True when `out` is missing or older than `src`. */
async function stale(src, out) {
  if (FORCE) return true;
  const [a, b] = await Promise.all([stat(src), stat(out).catch(() => null)]);
  return !b || b.mtimeMs < a.mtimeMs;
}

/** sips writes a resized copy; it is the only resizer guaranteed present. */
async function resize(src, out, width, format) {
  const args = ['--resampleWidth', String(width), src, '--out', out];
  if (format) args.unshift('-s', 'format', format);
  await run('sips', args);
}

async function encode(src, base, width, { graphic = false } = {}) {
  const tmp = join(IMG, `.tmp-${base}.png`);
  const webp = join(IMG, `${base}.webp`);
  const avif = join(IMG, `${base}.avif`);

  if (!(await stale(src, webp)) && !(await stale(src, avif))) { skipped++; return; }

  // Resize once into a lossless intermediate so webp and avif encode from the
  // same pixels; going source -> each format separately double-compresses.
  await resize(src, tmp, width, 'png');
  try {
    await run('cwebp', ['-quiet', '-q', String(graphic ? Q.graphicWebp : Q.webp), tmp, '-o', webp]);
    await run('avifenc', [
      '--min', '0', '--max', '63',
      '-a', 'end-usage=q', '-a', `cq-level=${graphic ? Q.graphicAvif : Q.avif}`,
      '-s', '4', '-j', 'all', tmp, avif,
    ]);
    made++;
  } finally {
    await unlink(tmp).catch(() => {});
  }
}

/** Catch a manifest that has drifted from the actual file. */
async function checkSourceDims(name, [w, h]) {
  const { stdout } = await run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', join(IMG, name)]);
  const real = [
    Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1]),
    Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1]),
  ];
  if (real[0] !== w || real[1] !== h) {
    problems.push(`${name}: manifest says ${w}x${h}, file is ${real[0]}x${real[1]}`);
  }
}

console.log('Encoding derivatives into assets/images/ …\n');

for (const [name, dims] of Object.entries(PHOTOS)) {
  const src = join(IMG, name);
  if (!(await size(src))) { problems.push(`${name}: master missing`); continue; }
  await checkSourceDims(name, dims);
  for (const w of widthsFor(name, PHOTO_WIDTHS)) await encode(src, variant(name, w), w);
}

// Flat graphics get a resized PNG as their fallback rather than the master,
// because the masters here are the two worst offenders on the page (564 KB and
// 476 KB) and both render under 250px. Only the largest width gets a PNG — that
// is the one the <img> falls back to; a PNG at any other width would ship
// without ever being referenced.
for (const g of [PALM, LOGO]) {
  const src = join(MASTERS, g.src);
  if (!(await size(src))) { problems.push(`${MASTERS_DIR}/${g.src}: master missing`); continue; }
  const widest = Math.max(...g.widths);
  for (const w of g.widths) {
    const base = variant(g.src, w);
    await encode(src, base, w, { graphic: true });
    if (w === widest) {
      const png = join(IMG, `${base}.png`);
      if (await stale(src, png)) await resize(src, png, w, 'png');
    }
  }
}

for (const icon of ICONS) {
  const src = join(MASTERS, LOGO.src);
  const out = join(IMG, icon.out);
  if (await stale(src, out)) { await resize(src, out, icon.width, 'png'); made++; }
}

if (problems.length) {
  console.error('\nProblems:\n  ' + problems.join('\n  '));
  process.exitCode = 1;
}

const all = (await readdir(IMG)).filter(f => !f.startsWith('.'));
const total = (await Promise.all(all.map(f => size(join(IMG, f))))).reduce((a, b) => a + b, 0);
console.log(`\n${made} encoded, ${skipped} up to date. assets/images/ is now ${(total / 1024 / 1024).toFixed(1)} MB (masters included).`);
