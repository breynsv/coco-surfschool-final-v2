// Fetches tide extremes for Les Bourdaines (Seignosse) from Stormglass and
// writes data/tide.json. Run by .github/workflows/tide.yml on a schedule so the
// browser never calls Stormglass directly (key stays a repo secret; ~4 calls/day).
import { writeFile, mkdir } from 'node:fs/promises';

const KEY = process.env.STORMGLASS_KEY;
if (!KEY) { console.error('STORMGLASS_KEY missing'); process.exit(1); }

const LAT = 43.6889, LNG = -1.4372;          // Les Bourdaines, Seignosse
const now = Date.now();
const start = new Date(now - 6 * 3600e3).toISOString();     // 6h back (catch the current cycle)
const end = new Date(now + 2 * 86400e3).toISOString();      // +2 days

const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${LAT}&lng=${LNG}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

const res = await fetch(url, { headers: { Authorization: KEY } });
if (!res.ok) { console.error('Stormglass error', res.status, await res.text()); process.exit(1); }
const data = await res.json();

const extremes = (data.data || []).map(e => ({
  type: e.type,               // 'high' | 'low'
  time: e.time,               // ISO 8601 (UTC)
  height: Math.round((e.height ?? 0) * 100) / 100,
}));

const out = {
  updated: new Date().toISOString(),
  station: data.meta?.station?.name || 'Les Bourdaines',
  lat: LAT, lng: LNG,
  extremes,
};

await mkdir('data', { recursive: true });
await writeFile('data/tide.json', JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote data/tide.json with ${extremes.length} extremes (${data.meta?.requestCount ?? '?'} requests used today).`);
