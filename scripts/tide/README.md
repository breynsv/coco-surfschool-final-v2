# Tide tables

The surf report's high/low tide times come from `data/tide/<year>.json`, computed in
advance by `build_tide_tables.py`. Nothing calls a tide API at runtime or on a schedule.

**Why:** the site used Stormglass's free tier, which forbids commercial use. Tides are
astronomical, so once a port's harmonic constants are known they can be predicted for
decades. We fit those constants ourselves from open data.

**Source:** hourly observations of the BAYONNE_BOUCAU tide gauge (SHOM station 94 —
the reference port for Capbreton and Seignosse, and the station Stormglass itself used).
REFMAR – Shom, <http://dx.doi.org/10.17183/REFMAR#RONIM>, Licence Ouverte v2.0, which
permits commercial reuse with credit. The credit is on the legal pages in all five languages.

## Accuracy (measured 2026-11-16)

Fitted on 2018–2025: 68 constituents, residual 13.5 cm rms (weather surge and Adour
discharge, which no tide table predicts). Checked against data the fit never saw:

| Compared with | Extremes | Median timing difference | Max |
| --- | --- | --- | --- |
| Gauge measurements, Jan–Oct 2026 | 1,174 | 5 min, no bias | 75 min (a storm-surge low) |
| Stormglass, Jul–Nov 2026 | 492 | 3.6 min | 13 min |

Heights are relative to mean sea level, like Stormglass's were. The widget only shows times.

## When to run it

- **`generate`** — only to extend the range. Tables exist for 2026–2046.
  `test/tide.test.mjs` starts failing five years before they run out (in 2042).
- **`fit`** — practically never. Only if the gauge is replaced or the constants are in doubt.
  Its output is `constants.json`, which `generate` reads.

```bash
python3 -m venv .venv && .venv/bin/pip install -r scripts/tide/requirements.txt
.venv/bin/python scripts/tide/build_tide_tables.py fit --from 2018 --to 2025   # ~1 min, downloads from SHOM
.venv/bin/python scripts/tide/build_tide_tables.py generate --from 2026 --to 2046  # ~1 min
node --test test/*.test.mjs
```

Each year file carries a one-day margin either side (Paris is ahead of UTC, and
"tomorrow" on 31 December lives in the next year); `surf-report.js` fetches the one or two
year files that today and tomorrow fall in and merges them.
