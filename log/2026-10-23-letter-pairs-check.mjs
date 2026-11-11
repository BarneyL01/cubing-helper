// Checks data/letter-pairs.js (rules of 2026-11-11): all 552 ordered pairs of different letters A-X; each word starts
// with the first letter's sound (X = "sh", J = "y", Q = "qu" or "ch") and has the second letter's sound after it;
// C words never start with "ch" and S words never start with "sh" (those sounds are Q and X); well-known initials
// (GQ, HQ, IQ, DJ, QR code, BBQ) keep their real letters; no word twice; no two words share a 5-letter start of a
// word (e.g. "lamp", "queen").
//   node log/2026-10-23-letter-pairs-check.mjs     prints ALL OK
import { letterPairs } from '../data/letter-pairs.js';

const L = 'ABCDEFGHIJKLMNOPQRSTUVWX';
const fails = [];
const SOUND = { X: ['sh'], J: ['y'], Q: ['qu', 'ch'] };
const sounds = (x) => SOUND[x] || [x.toLowerCase()];
// initials: the word must begin with the two real letters (BBQ: contain them in order)
const INITIALS = new Set(['GQ', 'HQ', 'IQ', 'DJ', 'QR', 'BQ']);
const plain = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
for (const a of L) for (const b of L) {
  if (a === b) { if (letterPairs[a + b]) fails.push(`${a + b} should not exist`); continue; }
  const w = letterPairs[a + b];
  if (!w) { fails.push(`${a + b} missing`); continue; }
  const s = plain(w);
  if (INITIALS.has(a + b)) {
    const i = s.indexOf(a.toLowerCase());
    if (i !== 0 || !s.slice(1, 3).includes(b.toLowerCase())) fails.push(`${a + b} ${w}: not the initials`);
    continue;
  }
  const start = sounds(a).find((x) => s.startsWith(x));
  if (!start) fails.push(`${a + b} ${w}: does not start with ${sounds(a).join(' / ')}`);
  else if (!sounds(b).some((x) => s.slice(start.length).includes(x))) fails.push(`${a + b} ${w}: no ${sounds(b).join(' / ')} after the start`);
  if (a === 'C' && s.startsWith('ch')) fails.push(`${a + b} ${w}: starts with "ch" (that is Q)`);
  if (a === 'S' && s.startsWith('sh')) fails.push(`${a + b} ${w}: starts with "sh" (that is X)`);
}
if (Object.keys(letterPairs).length !== 552) fails.push(`${Object.keys(letterPairs).length} pairs, not 552`);
const seen = new Map();
const whole = new Map();
for (const [k, w] of Object.entries(letterPairs)) {
  if (whole.has(w.toLowerCase())) fails.push(`${whole.get(w.toLowerCase())} and ${k} are both "${w}"`);
  whole.set(w.toLowerCase(), k);
  for (const stem of new Set((w.toLowerCase().normalize('NFD').match(/[a-z]{4,}/g) || []).map((t) => t.slice(0, 5)))) {
    if (seen.has(stem)) fails.push(`${seen.get(stem)} and ${k} ${w} share "${stem}"`);
    else seen.set(stem, `${k} ${w}`);
  }
}
console.log(fails.length ? `${fails.length} FAILED\n${fails.join('\n')}` : 'ALL OK (552 pairs)');
process.exitCode = fails.length ? 1 : 0;
