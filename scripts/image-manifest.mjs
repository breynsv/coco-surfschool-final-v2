/**
 * Shared source of truth for the responsive-image pipeline.
 *
 * `scripts/gen-images.mjs` reads this to decide which derivatives to encode.
 * `build.mjs` reads the same table to write the matching srcset. Keeping one
 * table means the HTML can never promise a file the generator did not make.
 *
 * Source dimensions are recorded here rather than probed at build time so the
 * build has no dependency on an image toolchain — Cloudflare runs `node
 * build.mjs` with nothing else installed. Re-running gen-images.mjs verifies
 * these numbers against the real files and fails loudly if one drifts.
 */

/**
 * Width ladder shared by every photograph.
 *
 * Four rungs rather than three because the gap matters: Lighthouse's mobile
 * profile is 412 CSS px at DPR 2.625, which asks for ~1000 device px in the
 * hero. On a 400/800/1200 ladder that rounds up to 1200 and throws away a
 * third of the bytes.
 */
export const PHOTO_WIDTHS = [400, 700, 1000, 1400];

/**
 * `sizes` per layout role — how wide the image actually renders, so the browser
 * can pick a candidate before it has done layout.
 *
 * These were not estimated. Each one was measured by loading the built pages
 * and reading getBoundingClientRect().width across viewports from 360 to
 * 1600px, then fitting an expression that is never below the measured width
 * (too low means a blurry upscale; slightly high only costs a few KB).
 *
 * The numbers encode two things from styles.css: `.wrap` is
 * `min(100% - 2.4rem, 1180px)`, so the wrap stops growing at 1218px viewport;
 * and each grid's gap. Change a grid there and the matching role has to be
 * re-measured here.
 *
 * Note .coach-photo really is only 280-300px wide at every viewport — it is a
 * narrow sticky portrait, not a half-width one.
 */
export const ROLES = {
  /** .hero-slides — full wrap, capped at 460px, until 960px; then ~46vw. */
  hero: '(max-width: 498px) calc(100vw - 2.4rem), (max-width: 960px) 460px, (max-width: 1218px) 47vw, 548px',
  /** .lesson-pic — 1-up to 640px, then a 2-up grid with a 1.3rem gap. */
  card: '(max-width: 640px) calc(100vw - 2.4rem), (max-width: 1218px) calc((100vw - 3.7rem) / 2), 578px',
  /** .ts-media — teaser portrait, capped at 440px until the 820px split. */
  teaser: '(max-width: 478px) calc(100vw - 2.4rem), (max-width: 820px) 440px, (max-width: 1218px) 44vw, 504px',
  /** .coach-photo — narrow sticky portrait, 300px at most. */
  coach: '300px',
  /** .ph-media — page-hero portrait, capped at 460px until the 820px split. */
  pagehero: '(max-width: 498px) calc(100vw - 2.4rem), (max-width: 820px) 460px, (max-width: 1218px) 46vw, 534px',
  /** .spot-card full-bleed background — 1-up to 640px, then 2-up. */
  spot: '(max-width: 640px) calc(100vw - 2.4rem), (max-width: 1218px) calc((100vw - 3.4rem) / 2), 580px',
};

/**
 * Photographs: name -> intrinsic source size. Every one of these gets
 * PHOTO_WIDTHS in AVIF + WebP plus a resized JPEG fallback.
 */
export const PHOTOS = {
  'a29fce_449771ae1e2d4c52aa0fbe3159160d3b.jpg': [1600, 1600],
  'a29fce_4b942950b2834ef2ad4e3191df3d547a.jpg': [1600, 1600],
  'a29fce_571dd78100a24c038429f1bfaf22b936.jpg': [1600, 1600],
  'carousel-1.jpg': [1500, 1000],
  'carousel-coach.jpg': [1448, 1086],
  'lesson-prive.jpg': [1400, 1050],
  'lesson-team.jpg': [1500, 1000],
  'owner-coach-new.jpg': [1600, 1200],
  'owner-hossegor-page.jpg': [1600, 1066],
  // owner-hossegor.jpg and owner-spots.jpg are byte-identical copies of the
  // same photo, reached from different pages. Both are listed because both are
  // referenced; deduping them is a content change, not a performance one.
  'owner-hossegor.jpg': [1600, 1065],
  'owner-spots.jpg': [1600, 1065],
  'owner-team-new.jpg': [1600, 1066],
  'real-carousel-kids.jpg': [1440, 755],
  'real-deluxe-group.jpg': [1198, 1200],
  'real-group.jpg': [1440, 1440],
  'real-lesson-kids.jpg': [2048, 1365],
};

/**
 * Flat graphics.
 *
 * Their masters live in `masters/`, not `assets/images/`, because nothing on
 * the built site links to them: unlike the photographs, these get a resized
 * PNG as their <img> fallback, so shipping the 1600x1600 originals would put
 * ~1 MB of never-requested bytes into every deploy. `masters/` is outside
 * STATIC_ASSETS, so it stays in the repo and out of dist.
 *
 * `widths` is the srcset ladder; the largest entry doubles as the PNG fallback,
 * and only that width gets a PNG.
 */
export const MASTERS_DIR = 'masters';

/** The palm silhouette in the hero. Decorative, drawn at 230px and opacity .1. */
export const PALM = { src: '41a3c55f3d76b98ad1058e6d4a659856.png', widths: [240, 480] };

/**
 * The logo. Drawn at 46px in the header and 66px in the footer, so 192px covers
 * a 2x footer. The 1600x1600 master was also serving as the favicon, which put
 * 476 KB on the critical path of every page.
 */
export const LOGO = { src: 'ee16c3_71361371647c417f89cde7e315ac662c.png', widths: [96, 192] };

/** Favicon / apple-touch-icon, cut from the logo master. */
export const ICONS = [
  { out: 'favicon-32.png', width: 32 },
  { out: 'favicon-180.png', width: 180 },
];

/** `foo.jpg` + 800 -> `foo-800`. Extension is added by the caller. */
export const variant = (name, width) => `${name.replace(/\.(jpe?g|png)$/i, '')}-${width}`;

/** Widths that are not larger than the source — upscaling only wastes bytes. */
export const widthsFor = (name, widths = PHOTO_WIDTHS) => {
  const src = PHOTOS[name];
  if (!src) return widths;
  const usable = widths.filter(w => w <= src[0]);
  return usable.length ? usable : [src[0]];
};
