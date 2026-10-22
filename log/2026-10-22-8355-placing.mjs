// After 8355: the easiest commutator for each pair of CORNERS (orientation ignored), from the L/B table.
// Use: trace the memo by pieces (which corner each piece belongs in), do one of these 12 per pair, then
// fix the twists with the Sassy twist (Twists & parity tab). Checked on all 4860 positions of the five
// corners (four top-layer corners + DFR, every edge solved).
//   node log/2026-10-22-8355-placing.mjs [--write]   (--write: data/corner-8355-place.js)
import { writeFileSync } from 'node:fs';
import { PIECES, makeMoves, solvedState, apply, isHome } from './2026-10-22-sim-engine.mjs';
import { corner8355LbRows } from '../data/corner-8355-lb.js';
import { bldCorners } from '../data/bld.js';

const failures = [];
const check = (n, ok, d = '') => !ok && failures.push(`${n}${d ? `: ${d}` : ''}`);
const CORNER_OF = Object.fromEntries(bldCorners.map((r) => [r.letter, [...r.piece].sort().join('')]));
const NAME_OF = Object.fromEntries(bldCorners.filter((r) => 'ABCD'.includes(r.letter)).map((r) => [CORNER_OF[r.letter], r.piece]));
const lb = (s) => (s.match(/[LB]/g) || []).length;
// best row for each ordered pair of corners
const groups = new Map();
for (const r of corner8355LbRows) {
  const k = `${CORNER_OF[r.first]}>${CORNER_OF[r.second]}`;
  (groups.get(k) ?? groups.set(k, []).get(k)).push(r);
}
const place = [...groups.entries()].map(([k, rs]) => {
  rs.sort((a, b) => a.setupMoves - b.setupMoves || a.length - b.length || lb(a.setup) - lb(b.setup) || a.first.localeCompare(b.first));
  const [c1, c2] = k.split('>');
  return { from: NAME_OF[c1], to: NAME_OF[c2], ...rs[0], options: rs.length };
});
check('12 corner pairs', place.length === 12, String(place.length));
console.log('corner pair -> easiest commutator (setup moves, turns):');
for (const p of place) console.log(`  buffer->${p.from}, ${p.from}->${p.to}: ${p.notation}  (${p.setupMoves}, ${p.length})  letters ${p.first}${p.second}`);

// ---- check on every position: trace by pieces, apply pairs, then twists
const five = PIECES.filter((p) => ['UFR', 'DFR', 'UBL', 'UBR', 'UFL'].includes(p.name));
const others = PIECES.filter((p) => !five.includes(p));
const posOf = (st, pc) => five.find((q) => q.ids.includes(st[pc.ids[0]])); // where piece pc is now
const pieceAt = (st, slot) => five.find((pc) => slot.ids.includes(st[pc.ids[0]])); // which piece sits in slot
const inPlace = (st, pc) => posOf(st, pc) === pc;
const BUF = five.find((p) => p.name === 'DFR');
const TOP = five.filter((p) => p !== BUF);
const algPerm = (alg) => makeMoves([{ name: 'a', alg, family: 'a' }])[0].perm;
const PLACE = Object.fromEntries(place.map((p) => [`${p.from}>${p.to}`, algPerm(p.moves)]));
const x = (w, k) => Array(k).fill(w).join(' ');
const inv = (alg) => alg.split(' ').reverse().map((t) => (t.endsWith("'") ? t[0] : t.endsWith('2') ? t : `${t}'`)).join(' ');
// twists: the owner's corner-twist algorithm (twists UFR and the top corner the U turn brings in) and its
// reverse; with R first (and R' after) it brings DFR up to UFR, so the buffer corner can be twisted too
const TW = [];
for (const u of ['U', 'U2', "U'"]) for (const [a, b] of [["R' D' R D", "D' R' D R"], ["D' R' D R", "R' D' R D"]]) {
  const t = `${x(a, 2)} ${u} ${x(b, 2)} ${inv(u)}`;
  for (const s of ['', 'R', "R'", 'R2']) TW.push(s ? `${s} ${t} ${inv(s)}` : t);
}
const twistGens = makeMoves(TW.map((alg, i) => ({ name: `t${i}`, alg, family: `t${i}` }))).filter((g) => {
  const st = apply(solvedState(), g.perm);
  return others.every((p) => isHome(st, p));
});
const key = (st) => five.map((p) => p.ids.map((i) => st[i]).join('.')).join('|');
// twist distances over the 81 twist patterns
const tdist = new Map([[key(solvedState()), 0]]);
let fr = [solvedState()];
for (let d = 1; fr.length; d++) { const nx = []; for (const s of fr) for (const g of twistGens) { const q = apply(s, g.perm); const k = key(q); if (!tdist.has(k)) { tdist.set(k, d); nx.push(q); } } fr = nx; }
check('twists reach all 81 patterns', tdist.size === 81, String(tdist.size));
// all positions: BFS over the place commutators + twists from solved
const posMap = new Map([[key(solvedState()), solvedState()]]);
fr = [solvedState()];
const gensAll = [...Object.values(PLACE).map((perm) => ({ perm })), ...twistGens];
while (fr.length) { const nx = []; for (const s of fr) for (const g of gensAll) { const q = apply(s, g.perm); const k = key(q); if (!posMap.has(k)) { posMap.set(k, q); nx.push(q); } } fr = nx; }
check('all 4860 positions', posMap.size === 4860, String(posMap.size));
let pairsSum = 0, twSum = 0, maxPairs = 0, maxTw = 0;
for (const start of posMap.values()) {
  let st = start; let pairs = 0;
  for (let guard = 0; guard < 10; guard++) {
    if (TOP.every((p) => inPlace(st, p))) break;
    // first target: where the buffer's piece belongs; if it is the buffer piece itself, break into the
    // first top corner that is not in place
    const bp = pieceAt(st, BUF);
    const t1 = bp === BUF ? TOP.find((p) => !inPlace(st, p)) : bp;
    // after the first target, the piece now at t1 goes on
    const p2 = pieceAt(st, t1);
    const t2 = p2 === BUF ? TOP.find((p) => p !== t1 && !inPlace(st, p)) : p2;
    st = apply(st, PLACE[`${t1.name}>${t2.name}`]); pairs++;
  }
  check('placed', five.every((p) => inPlace(st, p)), key(start));
  const t = tdist.get(key(st));
  check('twist reachable', t !== undefined);
  pairsSum += pairs; twSum += t; maxPairs = Math.max(maxPairs, pairs); maxTw = Math.max(maxTw, t);
}
console.log(`all ${posMap.size} positions placed: pairs mean ${(pairsSum / posMap.size).toFixed(2)} (max ${maxPairs}); then twists mean ${(twSum / posMap.size).toFixed(2)} (max ${maxTw})`);
if (process.argv.includes('--write') && !failures.length) {
  writeFileSync('data/corner-8355-place.js', `// GENERATED by log/2026-10-22-8355-placing.mjs --write. Do not edit by hand.\n// After 8355: the easiest commutator (from the L/B table) for each ordered pair of corners, orientation ignored.\nexport const corner8355Place = [\n${place.map((p) => `  ${JSON.stringify({ from: p.from, to: p.to, first: p.first, second: p.second, setup: p.setup, setupMoves: p.setupMoves, base: p.base, notation: p.notation, moves: p.moves, length: p.length, options: p.options })}`).join(',\n')}\n];\n`);
  console.log('wrote data/corner-8355-place.js');
}
console.log(failures.length ? `FAILED ${failures.length}: ${failures.slice(0, 5).join('; ')}` : 'ALL OK');
