#!/usr/bin/env python3
"""Tide tables for Les Bourdaines (Seignosse), computed here, from open data.

Why this exists
---------------
The surf report used to fetch tide times from Stormglass every six hours. Their
free tier forbids commercial use and a surf school is a business, so the site now
ships pre-computed tables instead — no API, no key, no quota, no licence risk.

Tides are astronomical: once the harmonic constants of a port are known, the
times of high and low water can be predicted decades ahead. This script

  fit       downloads hourly sea-level observations of the BAYONNE_BOUCAU tide
            gauge (SHOM station 94, the reference port for Capbreton/Seignosse —
            the same station Stormglass itself resolved to) and fits harmonic
            constants with UTide. Writes scripts/tide/constants.json.

  generate  turns constants.json into data/tide/<year>.json, one file per year,
            each holding every high and low water of that year (plus a one-day
            margin either side, so a page can always cover "today" and "tomorrow"
            in Europe/Paris from the files of the years those dates fall in).

Neither step runs at build time or in CI. `generate` was run once for 20 years;
re-run it only to extend the range. Re-run `fit` only if the gauge moves or the
constants are ever in doubt — it is not needed to keep the tables current.

Data source and licence
-----------------------
Observations: REFMAR — SHOM, Réseau RONIM, http://dx.doi.org/10.17183/REFMAR#RONIM
Licence Ouverte / Open Licence v2.0 (Etalab), which allows commercial reuse
provided the source is credited. The credit is on the site's legal pages.

Accuracy (measured 2026-11-16, see scripts/tide/README.md)
--------------------------------------------------------
Fitted on 2018-2025 (68 constituents, residual 13.5 cm rms — weather and river
discharge, which no tide table can predict). Checked against data the fit never
saw: 1,174 measured 2026 extremes, median timing error 5 min, no bias; and 492
Stormglass extremes Jul-Nov 2026, median difference 3.6 min, max 13 min.

Usage
-----
  python3 -m venv .venv && .venv/bin/pip install -r scripts/tide/requirements.txt
  .venv/bin/python scripts/tide/build_tide_tables.py fit --from 2018 --to 2025
  .venv/bin/python scripts/tide/build_tide_tables.py generate --from 2026 --to 2046
"""
import argparse
import json
import ssl
import sys
import urllib.request
import warnings
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import utide
from utide.utilities import Bunch

warnings.filterwarnings("ignore")

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
CONSTANTS = HERE / "constants.json"
OUT_DIR = REPO / "data" / "tide"

STATION_ID = 94
STATION_NAME = "BAYONNE_BOUCAU"
STATION_LAT = 43.52732
SOURCE = "REFMAR - SHOM, http://dx.doi.org/10.17183/REFMAR#RONIM, Licence Ouverte v2.0"
OBS_URL = ("https://services.data.shom.fr/maregraphie/observation/json/{id}"
           "?sources={src}&dtStart={a}T00:00:00Z&dtEnd={b}T00:00:00Z&interval=60")
# 3 = validated (temps différé), 2 = real-time validated, 1 = raw. Prefer the best.
SOURCES = (3, 2, 1)


# --------------------------------------------------------------------------- fit

def _ssl_context():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


def _month_bounds(year, month):
    a = f"{year}-{month:02d}-01"
    b = f"{year + 1}-01-01" if month == 12 else f"{year}-{month + 1:02d}-01"
    return a, b


def download(year_from, year_to):
    ctx = _ssl_context()
    values = {}
    for year in range(year_from, year_to + 1):
        for month in range(1, 13):
            a, b = _month_bounds(year, month)
            got = []
            for src in SOURCES:
                url = OBS_URL.format(id=STATION_ID, src=src, a=a, b=b)
                with urllib.request.urlopen(url, timeout=60, context=ctx) as r:
                    got = json.load(r)["data"]
                if len(got) > 300:  # a usable month, not a few stray hours
                    break
            for row in got:
                values.setdefault(row["timestamp"], row["value"])
            print(f"  {a[:7]}  {len(got):4d} hourly values", file=sys.stderr)
    s = pd.Series({pd.Timestamp(k.replace("/", "-")): v for k, v in values.items()}).sort_index()
    return s[(s > -2) & (s < 8)]  # drop sensor spikes; the range here is ~0-5 m


def _to_jsonable(x):
    if isinstance(x, dict):
        return {k: _to_jsonable(v) for k, v in x.items()}
    if isinstance(x, np.ndarray):
        return {"__ndarray__": x.tolist(), "dtype": str(x.dtype)}
    if isinstance(x, (np.integer,)):
        return int(x)
    if isinstance(x, (np.floating,)):
        return float(x)
    if isinstance(x, (np.bool_,)):
        return bool(x)
    if isinstance(x, (list, tuple)):
        return [_to_jsonable(v) for v in x]
    return x


def _from_jsonable(x):
    if isinstance(x, dict):
        if "__ndarray__" in x:
            return np.array(x["__ndarray__"], dtype=x["dtype"])
        return Bunch({k: _from_jsonable(v) for k, v in x.items()})
    if isinstance(x, list):
        return [_from_jsonable(v) for v in x]
    return x


def cmd_fit(args):
    print(f"Downloading {STATION_NAME} {args.year_from}-{args.year_to} ...", file=sys.stderr)
    s = download(args.year_from, args.year_to)
    coef = utide.solve(s.index.to_pydatetime(), s.values, lat=STATION_LAT, method="ols",
                       conf_int="none", trend=False, nodal=True, constit="auto", verbose=False)
    residual = s.values - utide.reconstruct(s.index.to_pydatetime(), coef, verbose=False).h
    meta = {
        "station": STATION_NAME, "shom_id": STATION_ID, "source": SOURCE,
        "fitted_on": f"{args.year_from}-01-01/{args.year_to}-12-31",
        "observations": int(len(s)),
        "residual_rms_m": round(float(np.sqrt(np.nanmean(residual ** 2))), 3),
        "datum": "heights in the coefficients are above chart datum (zéro hydrographique); "
                 "generate subtracts the fitted mean, so the tables are relative to mean sea level",
        "created": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    CONSTANTS.write_text(json.dumps({"meta": meta, "coef": _to_jsonable(dict(coef))}, indent=1) + "\n")
    print(f"Wrote {CONSTANTS.relative_to(REPO)}: {len(coef.name)} constituents, "
          f"residual {meta['residual_rms_m']} m rms", file=sys.stderr)


# ---------------------------------------------------------------------- generate

def load_constants():
    data = json.loads(CONSTANTS.read_text())
    return data["meta"], _from_jsonable(data["coef"])


def extremes(coef, start, end, step_min=2):
    """High and low waters between two naive-UTC datetimes: [(type, Timestamp, metres above MSL)]."""
    idx = pd.date_range(start, end, freq=f"{step_min}min")
    h = utide.reconstruct(idx.to_pydatetime(), coef, verbose=False).h - coef.mean
    d = np.diff(h)
    found = []
    for i in range(1, len(h) - 1):
        if d[i - 1] > 0 and d[i] <= 0:
            kind = "high"
        elif d[i - 1] < 0 and d[i] >= 0:
            kind = "low"
        else:
            continue
        y0, y1, y2 = h[i - 1], h[i], h[i + 1]
        den = y0 - 2 * y1 + y2
        off = 0.5 * (y0 - y2) / den if den else 0.0  # parabolic refinement between samples
        found.append([kind, idx[i] + pd.Timedelta(minutes=off * step_min), y1 - 0.25 * (y0 - y2) * off])
    # The Adour estuary has shallow-water constituents that can put a tiny wiggle
    # near slack water. Keep one extreme per turn of the tide.
    clean = []
    for e in found:
        if clean and clean[-1][0] == e[0]:
            if (e[0] == "high") == (e[2] > clean[-1][2]):
                clean[-1] = e
            continue
        if clean and e[1] - clean[-1][1] < pd.Timedelta(hours=2) and abs(e[2] - clean[-1][2]) < 0.10:
            clean.pop()
            continue
        clean.append(e)
    return clean


def cmd_generate(args):
    meta, coef = load_constants()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for year in range(args.year_from, args.year_to + 1):
        # One day of margin each side: Europe/Paris is ahead of UTC, so its 1 January
        # starts on 31 December UTC, and a page showing "tomorrow" on 31 December
        # needs the next year's first day.
        start = datetime(year - 1, 12, 31)
        end = datetime(year + 1, 1, 2)
        rows = [{
            "type": kind,
            "time": ts.round("min").strftime("%Y-%m-%dT%H:%M:00Z"),
            "height": round(float(h), 2),
        } for kind, ts, h in extremes(coef, start, end)]
        out = {
            "year": year,
            "station": meta["station"],
            "source": meta["source"],
            "method": f"harmonic prediction (UTide, {len(coef.name)} constituents, fitted on {meta['fitted_on']})",
            "datum": "mean sea level",
            "extremes": rows,
        }
        path = OUT_DIR / f"{year}.json"
        path.write_text(json.dumps(out, separators=(",", ":")) + "\n")
        print(f"  {path.relative_to(REPO)}  {len(rows)} extremes", file=sys.stderr)


def main():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = p.add_subparsers(dest="cmd", required=True)
    f = sub.add_parser("fit")
    f.add_argument("--from", dest="year_from", type=int, default=2018)
    f.add_argument("--to", dest="year_to", type=int, default=2025)
    f.set_defaults(func=cmd_fit)
    g = sub.add_parser("generate")
    g.add_argument("--from", dest="year_from", type=int, required=True)
    g.add_argument("--to", dest="year_to", type=int, required=True)
    g.set_defaults(func=cmd_generate)
    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
