// Short building blocks for the Blind drills scrambles (js/bld-drill.js): the shortest pure algorithms
// of each kind, found by search on sticker permutations and checked on the simulated cube.
//   node log/2026-10-26-drill-pieces.mjs           checks; prints the pool sizes and ALL OK
//   node log/2026-10-26-drill-pieces.mjs --write   also rewrites data/drill-pieces.js
// Kinds: corner 3-cycles, two-corner twists, edge 3-cycles (M allowed, no E/S), two-edge flips, and
// odd swaps (two corners and two edges, for odd parity). "Pure": nothing else moves, centres included.
import { writeFileSync } from 'node:fs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { cancelMoves, expandBrackets, invertAlg } from '../js/algs.js';

const WRITE = process.argv.includes('--write');
const SOLVED = solvedCube();
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const IDX = new Map(SOLVED.map((s, i) => [key(s), i]));
const tagged = SOLVED.map((s, i) => ({ ...s, colour: i }));
const permOf = (alg) => { const o = new Array(54); for (const s of applyAlg(tagged, alg)) o[s.colour] = IDX.get(key(s)); return o; };
const comp = (a, b) => a.map((x) => b[x]);
const inv = (a) => { const o = new Array(54); a.forEach((x, i) => (o[x] = i)); return o; };
const ID = SOLVED.map((_, i) => i);
const kindOf = (i) => SOLVED[i].p.filter((v) => v).length; // 3 corner, 2 edge, 1 centre
const pieceOf = (i) => SOLVED[i].p.join();

// What a permutation does: corners/edges moved, and whether it is a pure cycle, twist, flip or swap.
function classify(p) {
  const moved = new Set(); let centre = false;
  p.forEach((x, i) => { if (x !== i) { if (kindOf(i) === 1) centre = true; else moved.add(pieceOf(i)); } });
  if (centre) return null;
  const pieces = [...moved];
  const c = pieces.filter((q) => q.split(',').filter((v) => v !== '0').length === 3);
  const e = pieces.filter((q) => q.split(',').filter((v) => v !== '0').length === 2);
  // does a piece change place (not just turn in place)?
  const placeOf = (i) => pieceOf(p[i]);
  const placesMoved = (list) => list.filter((q) => { const i = SOLVED.findIndex((s) => s.p.join() === q); return placeOf(i) !== q; }).length;
  const cm = placesMoved(c), em = placesMoved(e);
  if (c.length === 3 && cm === 3 && e.length === 0) return 'corner3';
  if (c.length === 2 && cm === 0 && e.length === 0) return 'twist2';
  if (e.length === 3 && em === 3 && c.length === 0) return 'edge3';
  if (e.length === 2 && em === 0 && c.length === 0) return 'flip2';
  if (c.length === 2 && cm === 2 && e.length === 2 && em === 2) return 'swap';
  return null;
}

const FACE = []; for (const f of 'RLUDFB') for (const s of ['', "'", '2']) FACE.push(f + s);
const SLICE = []; for (const f of 'RLUDFBM') for (const s of ['', "'", '2']) SLICE.push(f + s);
const P = Object.fromEntries(SLICE.map((m) => [m, permOf(m)]));
const seqP = (ms) => ms.reduce((a, m) => comp(a, P[m]), ID);
const pools = { corner3: new Map(), twist2: new Map(), edge3: new Map(), flip2: new Map(), swap: new Map() };
const add = (kind, alg, p) => {
  const k = p.join();
  const moves = cancelMoves(alg);
  const len = moves.split(' ').length;
  const prev = pools[kind].get(k);
  if (!prev || len < prev.length) pools[kind].set(k, { moves, length: len });
};

// 1. Commutators [A, B]: A of 1-3 moves, B one move. Face turns for corners; M allowed for edges.
for (const moves of [FACE, SLICE]) {
  const seqs = [];
  for (const a of moves) { seqs.push([a]); for (const b of moves) { if (a[0] === b[0]) continue; seqs.push([a, b]); for (const c of moves) if (b[0] !== c[0]) seqs.push([a, b, c]); } }
  for (const A of seqs) {
    const pa = seqP(A), ia = inv(pa);
    for (const B of moves) {
      const p = comp(comp(comp(pa, P[B]), ia), inv(P[B]));
      const kind = classify(p);
      if (kind === 'corner3' || kind === 'edge3') add(kind, `${A.join(' ')} ${B} ${invertAlg(A.join(' '))} ${invertAlg(B)}`, p);
    }
  }
}
// 2. Twists, flips and swaps: known short algorithms, with a setup of up to 2 face turns.
const SEEDS = {
  twist2: ["R U2 R' U' R U' R' L' U2 L U L' U L", "L' U' L U' L' U2 L R U R' U R U2 R'"],
  flip2: ["M' U M' U M' U2 M U M U M U2", "R U R' U' M' U R U' r'"],
  swap: ["R U R' U' R' F R2 U' R' U' R U R' F'", "R U R' F' R U R' U' R' F R2 U' R' U'"],
};
const setups = [[]]; for (const a of FACE) { setups.push([a]); for (const b of FACE) if (a[0] !== b[0]) setups.push([a, b]); }
for (const [kind, seeds] of Object.entries(SEEDS)) for (const seed of seeds) {
  const ps = permOf(expandBrackets(seed));
  for (const S of setups) {
    const s = S.join(' ');
    const p = comp(comp(seqP(S), ps), inv(seqP(S)));
    if (classify(p) === kind) add(kind, `${s} ${expandBrackets(seed)} ${invertAlg(s)}`, p);
  }
}

// checks: every pool entry really is what it says, on the simulator
const failures = [];
for (const [kind, m] of Object.entries(pools)) for (const r of m.values()) if (classify(permOf(r.moves)) !== kind) failures.push(`${kind}: ${r.moves}`);
const summary = Object.entries(pools).map(([k, m]) => { const ls = [...m.values()].map((r) => r.length); return `${k} ${m.size} (${Math.min(...ls)}-${Math.max(...ls)} moves)`; }).join(', ');
console.log(summary);
if (WRITE) {
  const out = Object.fromEntries(Object.entries(pools).map(([k, m]) => [k, [...m.values()].sort((a, b) => a.length - b.length).map((r) => r.moves)]));
  writeFileSync('data/drill-pieces.js', `// GENERATED by log/2026-10-26-drill-pieces.mjs --write. Do not edit by hand.\n// Short pure algorithms for the Blind drills scrambles, shortest first.\nexport const DRILL_PIECES = ${JSON.stringify(out, null, 0).replace(/\],"/g, '],\n  "')};\n`);
  console.log('wrote data/drill-pieces.js');
}
console.log(failures.length ? `${failures.length} FAILED\n${failures.slice(0, 5).join('\n')}` : 'ALL OK');
process.exitCode = failures.length ? 1 : 0;
