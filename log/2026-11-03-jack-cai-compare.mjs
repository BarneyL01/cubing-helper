// Compares Jack Cai's corner commutator sheet (docs/sheets/jack-cai-commutators/Corners.csv, exported
// from the shared Google Sheet) with our 3-style corner tables (data/three-style-ours.js) and Dylan's
// sheet (data/three-style-corners.js). Writes docs/sheets/jack-cai-commutators/comparison.csv and prints a
// summary.
//   node log/2026-11-03-jack-cai-compare.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { permOf } from './three-style-lib.mjs';
import { expandBrackets, invertAlg } from '../js/algs.js';
import { threeStyleOurs } from '../data/three-style-ours.js';
import { threeStyleCorners } from '../data/three-style-corners.js';

const CSV = 'docs/sheets/jack-cai-commutators/Corners.csv';
const OUT = 'docs/sheets/jack-cai-commutators/comparison.csv';

// Quoted-field CSV parser (fields may contain commas inside quotes).
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Jack's cells: a pair label (two Speffz letters) followed by its algorithm in the next cell.
const pairs = new Map();
for (const row of parseCsv(readFileSync(CSV, 'utf8'))) {
  for (let i = 0; i < row.length - 1; i++) {
    if (/^[A-X]{2}$/.test(row[i]) && row[i + 1].includes('[')) {
      if (!pairs.has(row[i])) pairs.set(row[i], row[i + 1]);
    }
  }
}

// Turn a sheet algorithm into WCA-style moves (Lw = wide L is kept; the simulator reads it).
function normalise(raw) {
  const spaced = raw.replace(/([A-Za-z]w?\d?'?)/g, ' $1 ').replace(/\s+/g, ' ').trim();
  return expandBrackets(spaced).replace(/\s+/g, ' ').trim();
}
const countMoves = (alg) => alg.split(' ').filter(Boolean).length;

// Effect of an algorithm on all 54 stickers, as moved / unmoved, plus how many of each kind moved.
function effect(alg) {
  const o = permOf(alg);
  const moved = [];
  for (let i = 0; i < o.length; i++) if (o[i] !== i) moved.push(i);
  return { o, moved };
}
const sameEffect = (a, b) => a.o.every((v, i) => v === b.o[i]);
const sameSet = (a, b) => a.moved.length === b.moved.length && a.moved.every((v) => b.moved.includes(v));

// Corner stickers are indices 0..53 in the Speffz order used by permOf; edge stickers are the ones
// that are not corners. Counting corners moved: a pure corner 3-cycle moves 9 corner stickers.
function relation(his, ref) {
  if (!ref) return 'no reference';
  const h = effect(his.alg), r = effect(ref.moves);
  if (sameEffect(h, r)) return 'identical effect';
  if (sameSet(h, r)) return 'same pieces, different twist or direction';
  return 'different pieces';
}

const ourByPair = new Map(threeStyleOurs.map((x) => [x.pair, x]));
const dylanByPair = new Map(threeStyleCorners.map((x) => [x.pair, x]));
// Jack lists each pair in one direction only. The other direction (YX) should be his algorithm backwards.
const reverse = (pair) => pair[1] + pair[0];

const rows = [];
for (const [pair, raw] of [...pairs.entries()].sort()) {
  const alg = normalise(raw);
  const h = effect(alg);
  const pure = h.moved.length === 9 || h.moved.length === 0 ? 'yes' : 'no';
  const ours = ourByPair.get(pair);
  const dylan = dylanByPair.get(pair);
  rows.push({
    pair, sheet: raw, alg, moves: countMoves(alg), movedStickers: h.moved.length,
    ours: ours ? ours.moves : '', oursMoves: ours ? ours.count : '',
    dylan: dylan ? dylan.moves : '', dylanMoves: dylan ? dylan.count : '',
    vsOurs: relation({ alg }, ours), vsDylan: relation({ alg }, dylan), pure,
    backOurs: relation({ alg: invertAlg(alg) }, ourByPair.get(reverse(pair))),
    backDylan: relation({ alg: invertAlg(alg) }, dylanByPair.get(reverse(pair))),
  });
}

const headers = ['pair', 'sheet', 'alg', 'moves', 'movedStickers', 'pure3cycle', 'ours', 'oursMoves', 'dylan', 'dylanMoves', 'vsOurs', 'vsDylan', 'reverseVsOurs', 'reverseVsDylan'];
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const lines = [headers.join(',')];
for (const r of rows) {
  lines.push([r.pair, r.sheet, r.alg, r.moves, r.movedStickers, r.pure, r.ours, r.oursMoves, r.dylan, r.dylanMoves, r.vsOurs, r.vsDylan, r.backOurs, r.backDylan].map(esc).join(','));
}
writeFileSync(OUT, lines.join('\n') + '\n');

const mean = (xs) => (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2);
const tally = (key) => rows.reduce((m, r) => ((m[r[key]] = (m[r[key]] || 0) + 1), m), {});
console.log(`pairs in Jack's Corners tab: ${rows.length}`);
console.log(`pairs covered by ours: ${rows.filter((r) => r.ours).length}, by Dylan's sheet: ${rows.filter((r) => r.dylan).length}`);
console.log(`mean moves: Jack ${mean(rows.map((r) => r.moves))}, ours ${mean(rows.filter((r) => r.oursMoves !== '').map((r) => r.oursMoves))}, Dylan ${mean(rows.filter((r) => r.dylanMoves !== '').map((r) => r.dylanMoves))}`);
console.log('pure 3-cycles (9 stickers moved, or none):', tally('pure'));
console.log('moved stickers:', tally('movedStickers'));
console.log('vs ours:', tally('vsOurs'));
console.log('vs Dylan:', tally('vsDylan'));
console.log('reverse direction, ours (his algorithm inverted):', tally('backOurs'));
console.log('reverse direction, Dylan:', tally('backDylan'));
console.log(`wrote ${OUT}`);
