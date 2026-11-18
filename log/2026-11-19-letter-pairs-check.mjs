// Checks data/letter-pairs.js against the owner's rules of 2026-11-19 (spelling-based; vividness is checked by eye):
//   1. The word starts with the 1st letter: X = "sh", J = "y", Q = "qu", C = a hard c (not ch / ce / ci / cy),
//      G = a hard g, S = s (not sh), K = k (not kn), W = w or wh (not wr); vowels = that letter.
//   2. One word (consonant 2nd letter, not C or Q): after the start, vowels, then the 2nd letter's consonant as the
//      first AND ONLY clear consonant (doubled letters fine: ass, ammo), then only vowels (a final silent e, -y, -w fine).
//      K = k / ck; X = sh; J = y before a vowel; W = w or wh. Never ph, th, ng, x, kn, soft c or g.
//   3. Two words: 2nd letter C, Q, a vowel, or a consonant with no one-word fit. The 2nd word starts with the 2nd letter
//      (same spellings as rule 1; U not said "yoo"). Never for K. The 1st word is not itself another pair's word.
//   4. A vowel 2nd letter as one word only when the word has no other consonant (bee, see, pee).
//   5. Well-known initials keep their letters (AI, DJ, GQ, HQ, ID card, IQ, KO, OJ, OK, PJ, QR code, TV, UFO, UK,
//      USB stick, UV lamp, VR headset, VW Beetle, WC, AK-47). Listed exceptions: VK Viking (k first; ng after).
//   6. All 552 pairs, no phrase twice, and no 2nd word used for more than 3 pairs.
//   node log/2026-11-19-letter-pairs-check.mjs    prints ALL OK (and how often each 2nd word is used, if > 1)
import { letterPairs } from '../data/letter-pairs.js?v=3';

const L = 'ABCDEFGHIJKLMNOPQRSTUVWX';
const VOWELS = 'AEIOU';
const INITIALS = new Set(['AI', 'AK', 'DJ', 'GQ', 'HQ', 'ID', 'IQ', 'KO', 'OJ', 'OK', 'PJ', 'QR', 'TV', 'UF', 'UK', 'US', 'UV', 'VR', 'VW', 'WC']);
const EXCEPT = { VK: 'Viking', GK: 'geek', JF: 'Y-fronts' }; // GK: hard g before ee; JF: Y + fronts
const fails = [];
// does word w start with letter x's sound? returns the rest of the word after it, or null
function start(x, w) {
  const s = w.toLowerCase();
  const pre = { X: ['sh'], J: ['y'], Q: ['qu'], W: ['wh', 'w'] }[x] || [x.toLowerCase()];
  for (const p of pre) {
    if (!s.startsWith(p)) continue;
    const rest = s.slice(p.length);
    if (x === 'C' && /^[hei y]/.test(rest)) return null;
    if (x === 'G' && /^[eiy]/.test(rest)) return null;
    if (x === 'S' && rest.startsWith('h')) return null;
    if (x === 'K' && rest.startsWith('n')) return null;
    if (x === 'W' && p === 'w' && /^[rh]/.test(rest)) return null;
    if ('PT'.includes(x) && rest.startsWith('h')) return null;
    if (x === 'U' && /^(ni|se|su|te|ri|ra|ku|ki|sb)/.test(rest)) return null;
    return rest;
  }
  return null;
}
// the consonant spelling of letter y inside one word, at the start of `rest` (after the vowels)
function cons(y, rest) {
  const opts = { K: ['ck', 'k'], X: ['sh'], W: ['wh', 'w'], J: ['y'] }[y] || [y.toLowerCase() + y.toLowerCase(), y.toLowerCase()];
  for (const o of opts) if (rest.startsWith(o)) {
    const after = rest.slice(o.length);
    if (y === 'J' && !/^[aeiou]/.test(after)) return null;
    if (y === 'G' && /^[eiy]/.test(after)) return null;
    if ('SPTCWG'.includes(y) && after.startsWith('h') && o.length === 1) return null; // sh, ph, th, ch, wh, gh
    if (y === 'N' && /^g/.test(after)) return null;
    return after;
  }
  return null;
}
const oneWords = new Set(Object.entries(letterPairs).filter(([, w]) => !/\s/.test(w)).map(([, w]) => w.toLowerCase()));
const second = new Map();
for (const a of L) for (const b of L) {
  if (a === b) continue;
  const p = a + b, w = letterPairs[p];
  if (!w) { fails.push(`${p} missing`); continue; }
  if (INITIALS.has(p)) { if (!w.toUpperCase().replace(/[^A-Z]/g, '').startsWith(p === 'UF' ? 'UFO' : p === 'US' ? 'USB' : p)) fails.push(`${p} ${w}: not the initials`); continue; }
  if (EXCEPT[p]) { if (EXCEPT[p] !== w) fails.push(`${p} ${w}: not the listed exception`); continue; }
  const toks = w.split(/\s+/); // a hyphenated word (yo-yo) is one word
  if (toks.length > 2) { fails.push(`${p} ${w}: more than two words`); continue; }
  if (toks.length === 2) {
    if (b === 'K') fails.push(`${p} ${w}: two words for K`);
    if (start(a, toks[0]) === null) fails.push(`${p} ${w}: 1st word does not start with ${a}`);
    if (start(b, toks[1]) === null) fails.push(`${p} ${w}: 2nd word does not start with ${b}`);
    if (oneWords.has(toks[0].toLowerCase())) fails.push(`${p} ${w}: 1st word "${toks[0]}" is another pair's word`);
    const k = toks[1].toLowerCase(); second.set(k, [...(second.get(k) || []), p]);
    continue;
  }
  const rest = start(a, w);
  if (rest === null) { fails.push(`${p} ${w}: does not start with ${a}`); continue; }
  const v = rest.match(/^[aeiou]*(w(?=[^aeiouy]))?/)[0]; // aw / ow before a consonant is a vowel (yawn)
  const tail = rest.slice(v.length);
  if (VOWELS.includes(b)) { if (!/^[aeiouy]*$/.test(rest) || !rest.endsWith(b.toLowerCase())) fails.push(`${p} ${w}: a vowel 2nd letter needs two words (or no other consonant)`); continue; }
  if (b === 'C' || b === 'Q') { fails.push(`${p} ${w}: ${b} needs two words`); continue; }
  if (!v && !VOWELS.includes(a)) { fails.push(`${p} ${w}: no vowel after the start`); continue; }
  const after = cons(b, tail);
  if (after === null) { fails.push(`${p} ${w}: first consonant is not ${b}`); continue; }
  if (!/^[aeiouyw]*$/.test(after)) fails.push(`${p} ${w}: another consonant after ${b} ("${after}")`);
}
if (Object.keys(letterPairs).length !== 552) fails.push(`${Object.keys(letterPairs).length} pairs, not 552`);
const seen = new Map();
for (const [k, w] of Object.entries(letterPairs)) { const x = w.toLowerCase(); if (seen.has(x)) fails.push(`${seen.get(x)} and ${k} are both "${w}"`); seen.set(x, k); }
for (const [k, ps] of second) if (ps.length > 3) fails.push(`2nd word "${k}" used ${ps.length} times: ${ps.join(' ')}`);
if (process.argv.includes('--repeats')) console.log([...second].filter(([, ps]) => ps.length > 1).map(([k, ps]) => `${k} ${ps.join(' ')}`).join('\n'));
console.log(fails.length ? `FAIL ${fails.length}\n${fails.join('\n')}` : 'ALL OK');
