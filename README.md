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
