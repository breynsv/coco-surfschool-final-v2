# Coco Surf School — design-06 (coral) MULTIPAGE preview

Design-06 "Seafoam & Coral" rebuilt as a 10-page × FR/EN/NL/DE/ES multipage site.
Generated: edit `content/{fr,en,nl,de,es}.mjs`.

**Committing generated output?** Run `PROD=1 node build.mjs`. That is the only
build whose output may be committed — it strips `noindex`, emits an
`Allow: /` `robots.txt`, and writes the real sitemap.

A bare `node build.mjs` (no `PROD=1`) produces a **noindexed preview**: every
generated page gets `<meta name="robots" content="noindex, nofollow">` and
`robots.txt` becomes `Disallow: /`. That build is for local preview only —
committing it would silently deindex the live site. Never commit its output.

## Images

Pages reference AVIF and WebP derivatives, never the full-size photo. They are
generated once and committed, because Cloudflare's build runs plain
`node build.mjs` with no image toolchain:

```sh
node scripts/gen-images.mjs          # encode what is missing or stale
node scripts/gen-images.mjs --force  # re-encode everything
```

Needs `brew install webp libavif`. **Adding or replacing a photo means editing
`scripts/image-manifest.mjs` and re-running this** — `build.mjs` refuses to
render an image the manifest does not describe, rather than emitting a `srcset`
pointing at files that were never encoded.

Photo masters live in `assets/images/` (pages link to them as the `<img>`
fallback). The two flat-graphic masters — the logo and the hero palm — live in
`masters/`, which is not deployed, because their fallback is a resized PNG and
nothing links to the 1600×1600 originals.

`sizes` in `image-manifest.mjs` was measured against the real layout, not
estimated. Change a grid in `styles.css` and the matching role has to be
re-measured, or the browser starts picking the wrong candidate.

## Fonts

Petrona is self-hosted from `assets/fonts/` (variable, latin + latin-ext, roman
+ italic). It used to come from fonts.googleapis.com, which cost ~750 ms of
render-blocking time on mobile for a chain across two extra origins.
