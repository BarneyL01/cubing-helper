// Scores how "visible" a step is: starting from a solved cube, which pieces you care about are out of
// place after each move. Also searches for short sequences that change only one small region.
//   node log/2026-10-22-intuitive-score.mjs
import { applyAlg, solvedCube, faceOf } from '../js/cube-sim.js';

const SOLVED = solvedCube();
const POS = [...new Set(SOLVED.map((s) => s.p.join()))];
const kindOf = (pos) => pos.split(',').filter((v) => v !== '0').length; // 1 centre, 2 edge, 3 corner
const NAME = (pos) => {
  const [x, y, z] = pos.split(',').map(Number);
  return [y === 1 ? 'U' : y === -1 ? 'D' : '', z === 1 ? 'F' : z === -1 ? 'B' : '', x === 1 ? 'R' : x === -1 ? 'L' : ''].join('') || 'core';
};
const outOfPlace = (state) => {
  const by = new Map();
  for (const s of state) (by.get(s.p.join()) ?? by.set(s.p.join(), []).get(s.p.join())).push(s);
  return new Set([...by.entries()].filter(([, ss]) => !ss.every((s) => faceOf(s.n) === s.colour)).map(([p]) => p));
};
const region = (pred) => new Set(POS.filter((p) => kindOf(p) > 0 && pred(...p.split(',').map(Number), kindOf(p))));
const ALL = region(() => true);
const minus = (a, ...bs) => new Set([...a].filter((p) => !bs.some((b) => b.has(p))));
const named = (...names) => new Set(POS.filter((p) => names.includes(NAME(p))));

const U_LAYER = region((x, y) => y === 1);
const CORNERS = region((x, y, z, k) => k === 3);
const EDGES = region((x, y, z, k) => k === 2);
const CENTRES = region((x, y, z, k) => k === 1);

// name, sequence, pieces you care about (must be solved at the end and are watched during)
const STEPS = [
  ['F2L insert (top layer free)', "R U R'", minus(ALL, U_LAYER, named('DFR', 'FR'))],
  ['F2L insert, longer case', "R U' R' U R U R'", minus(ALL, U_LAYER, named('DFR', 'FR'))],
  ['8355 step 4 cycle (top + one corner free)', "R U2 R'", minus(ALL, U_LAYER, named('DFR', 'FR'))],
  ['Marshall edge insert (corners free)', "U' R U R'", minus(ALL, CORNERS, named('UF', 'UR', 'FR'))],
  ['Roux M-slice edge (M slice + top free)', "M' U2 M", minus(ALL, U_LAYER, region((x) => x === 0))],
  ['Edge 3-cycle M\' U2 M U2 (all corners solved)', "M' U2 M U2", minus(ALL, named('UF', 'UB', 'DF'))],
  ['Sassy x3 (all edges solved)', "R U R' U' R U R' U' R U R' U'", minus(ALL, named('UBR', 'UFR', 'UBL', 'DFR'))],
  ['Commutator base [R U R\', D]', "R U R' D R U' R' D'", minus(ALL, named('DFR', 'UFR', 'DFL', 'DBR', 'DBL'))],
  ['Marshall corner cycle', "U R U' L' U R' U' L", minus(ALL, named('UFL', 'UBR', 'UBL'))],
];

console.log('Step'.padEnd(46), 'moves', 'cared pieces out after each move'.padEnd(36), 'peak', 'longest broken run');
for (const [name, alg, cared] of STEPS) {
  const t = alg.split(' ');
  const path = t.map((_, i) => [...outOfPlace(applyAlg(SOLVED, t.slice(0, i + 1).join(' ')))].filter((p) => cared.has(p)).length);
  if (path.at(-1) !== 0) console.log(`  NOTE: ${name} leaves ${path.at(-1)} cared pieces out`);
  let run = 0, best = 0;
  for (const v of path) { run = v ? run + 1 : 0; best = Math.max(best, run); }
  console.log(name.padEnd(46), String(t.length).padEnd(5), path.join(' ').padEnd(36), String(Math.max(...path)).padEnd(4), best);
}

// ---- which small regions have short sequences that change only that region (and centres stay)
const INDEX = new Map(SOLVED.map((s, i) => [`${s.p.join()}|${s.n.join()}`, i]));
const permOf = (t) => applyAlg(SOLVED, t).map((s) => INDEX.get(`${s.p.join()}|${s.n.join()}`));
const MOVES = ['U', 'D', 'R', 'L', 'F', 'B', 'M', 'E', 'S'].flatMap((f) => ['', "'", '2'].map((a) => f + a));
const P = Object.fromEntries(MOVES.map((m) => [m, permOf(m)]));
const AXIS = { U: 0, D: 0, E: 0, R: 1, L: 1, M: 1, F: 2, B: 2, S: 2 };
const posOfSticker = SOLVED.map((s) => s.p.join());
const REGIONS = {
  'middle-layer (E) edges': named('FR', 'FL', 'BR', 'BL'),
  'M-slice edges': named('UF', 'UB', 'DF', 'DB'),
  'top-layer corners': named('UFR', 'UFL', 'UBR', 'UBL'),
  'top-layer edges': named('UF', 'UB', 'UR', 'UL'),
  'one vertical column (FR edge + DFR + UFR)': named('FR', 'DFR', 'UFR'),
};
const MAX = Number(process.env.MAX || 5);
const found = Object.fromEntries(Object.keys(REGIONS).map((k) => [k, new Map()]));
const N = SOLVED.length;
function walk(perm, seq, depth) {
  if (seq.length) {
    const changed = new Set();
    for (let i = 0; i < N; i++) if (perm[i] !== i) changed.add(posOfSticker[i]);
    if (changed.size) for (const [k, reg] of Object.entries(REGIONS)) {
      if ([...changed].every((p) => reg.has(p))) {
        const key = perm.join();
        if (!found[k].has(key)) found[k].set(key, { seq: seq.join(' '), changed: [...changed].map(NAME).join(' ') });
      }
    }
  }
  if (depth === MAX) return;
  for (const m of MOVES) {
    const last = seq.at(-1);
    if (last && (last[0] === m[0] || (AXIS[last[0]] === AXIS[m[0]] && last[0] > m[0]))) continue;
    const q = P[m];
    const next = new Array(N);
    for (let i = 0; i < N; i++) next[i] = q[perm[i]];
    seq.push(m); walk(next, seq, depth + 1); seq.pop();
  }
}
walk([...Array(N).keys()], [], 0);
console.log(`\nSequences of up to ${MAX} moves (any face or slice) that change ONLY the region:`);
for (const [k, m] of Object.entries(found)) {
  const list = [...m.values()].sort((a, b) => a.seq.split(' ').length - b.seq.split(' ').length);
  console.log(`- ${k}: ${list.length} different effects; shortest: ${list.slice(0, 4).map((r) => `${r.seq} [${r.changed}]`).join('; ') || 'none'}`);
}
