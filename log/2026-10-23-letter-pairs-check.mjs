// Checks data/letter-pairs.js: all 552 ordered pairs of different letters A-X, each word
// starts with the first letter (X = "sh") and has the second letter after it, no word
// twice, and no two words share a 5-letter start of a word (e.g. "lamp", "queen").
//   node log/2026-10-23-letter-pairs-check.mjs     prints ALL OK
import { letterPairs } from '../data/letter-pairs.js';

const L = 'ABCDEFGHIJKLMNOPQRSTUVWX';
const fails = [];
const sound = (x) => (x === 'X' ? 'sh' : x.toLowerCase());
const plain = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
for (const a of L) for (const b of L) {
  if (a === b) { if (letterPairs[a + b]) fails.push(`${a + b} should not exist`); continue; }
  const w = letterPairs[a + b];
  if (!w) { fails.push(`${a + b} missing`); continue; }
  const s = plain(w);
  if (!s.startsWith(sound(a))) fails.push(`${a + b} ${w}: does not start with ${sound(a)}`);
  else if (!s.slice(sound(a).length).includes(sound(b))) fails.push(`${a + b} ${w}: no ${sound(b)} after the start`);
}
if (Object.keys(letterPairs).length !== 552) fails.push(`${Object.keys(letterPairs).length} pairs, not 552`);
const seen = new Map();
for (const [k, w] of Object.entries(letterPairs)) {
  for (const stem of new Set((w.toLowerCase().normalize('NFD').match(/[a-z]{4,}/g) || []).map((t) => t.slice(0, 5)))) {
    if (seen.has(stem)) fails.push(`${seen.get(stem)} and ${k} ${w} share "${stem}"`);
    else seen.set(stem, `${k} ${w}`);
  }
}
console.log(fails.length ? `${fails.length} FAILED\n${fails.join('\n')}` : 'ALL OK (552 pairs)');
process.exitCode = fails.length ? 1 : 0;
