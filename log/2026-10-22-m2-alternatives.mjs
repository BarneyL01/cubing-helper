// Alternatives for the M2 special cases (C, I, Q, S, W in data/bld.js): every sequence of up to
// 12 turns from a small move set with exactly the same effect, found by meeting in the middle.
//   node log/2026-10-22-m2-alternatives.mjs [moveset]   moveset: um (U D M R2 L2 F2 B2) | wide (adds R, L, F, B, E, S)
import { makeMoves, turns, solvedState, apply, applyText } from './2026-10-22-sim-engine.mjs';
import { bldEdges } from '../data/bld.js';
import { expandBrackets } from '../js/algs.js';

const SET = process.argv[2] || 'um';
const list = SET === 'wide'
  ? [...turns(['U', 'D', 'M', 'R', 'L', 'F', 'B', 'E', 'S'])]
  : [...turns(['U', 'D', 'M']), 'R2', 'L2', 'F2', 'B2'];
const MOVES = makeMoves(list);
const AXIS = { U: 0, D: 0, E: 0, R: 1, L: 1, M: 1, F: 2, B: 2, S: 2 };
const HALF = Number(process.env.HALF || 5);
const inv = (p) => { const r = new Int16Array(p.length); p.forEach((v, i) => (r[v] = i)); return r; };
const key = (p) => String.fromCharCode(...p.map((v) => v + 48));

// all sequences up to HALF moves: perm -> shortest word
const table = new Map();
const words = [[solvedState(), []]];
table.set(key(words[0][0]), []);
let frontier = words;
for (let d = 1; d <= HALF; d++) {
  const next = [];
  for (const [p, w] of frontier) for (const m of MOVES) {
    const last = w.at(-1);
    if (last && (last.family === m.family || (AXIS[last.family] === AXIS[m.family] && m.family < last.family))) continue;
    const q = apply(p, m.perm);
    const k = key(q);
    if (table.has(k)) continue;
    table.set(k, [...w, m]);
    next.push([q, [...w, m]]);
  }
  frontier = next;
}
console.log(`move set ${SET}: ${table.size} positions within ${HALF} moves`);
const all = [...table.entries()].map(([k, w]) => w);
for (const e of bldEdges.filter((x) => x.special)) {
  const full = expandBrackets(e.special.replace(/M2'/g, 'M2'));
  const T = applyText(solvedState(), full); // T = effect of the special algorithm
  // want A then B with A·B = T: for each B (up to HALF), A = T·B^-1 must be in the table
  const sols = [];
  for (const B of all) {
    let Bp = solvedState();
    for (const m of B) Bp = apply(Bp, m.perm);
    const Binv = inv(Bp);
    const A = new Int16Array(T.length);
    for (let i = 0; i < T.length; i++) A[i] = Binv[T[i]];
    const w = table.get(key(A));
    if (w) sols.push([...w, ...B].map((m) => m.name).join(' '));
  }
  const uniq = [...new Set(sols)].sort((a, b) => a.split(' ').length - b.split(' ').length);
  const best = uniq.filter((s) => s.split(' ').length === uniq[0].split(' ').length);
  console.log(`${e.letter} (${e.piece}) now: ${e.special}  [${full.split(' ').length} turns]`);
  console.log(`   shortest found: ${uniq.length ? uniq[0].split(' ').length : 'none'} turns; ${best.length} of that length; e.g. ${best.slice(0, 6).join(' | ')}`);
}

// ---- setup + M2 + undo, with the same effect as the special algorithm (setups up to 4 turns, any face/slice)
const W4 = makeMoves(turns(['U', 'D', 'R', 'L', 'F', 'B', 'M', 'E', 'S']));
const M2p = applyText(solvedState(), 'M2');
const setups = [[]];
let fr = [[]];
for (let d = 1; d <= 4; d++) {
  const nx = [];
  for (const w of fr) for (const m of W4) {
    const last = w.at(-1);
    if (last && (last.family === m.family || (AXIS[last.family] === AXIS[m.family] && m.family < last.family))) continue;
    nx.push([...w, m]);
  }
  for (const w of nx) setups.push(w);
  fr = nx;
}
console.log(`\nsetup + M2 + undo (setups up to 4 turns):`);
for (const e of bldEdges.filter((x) => x.special)) {
  const T = applyText(solvedState(), expandBrackets(e.special.replace(/M2'/g, 'M2')));
  const Tk = key(T);
  const found = [];
  for (const w of setups) {
    let S = solvedState();
    for (const m of w) S = apply(S, m.perm);
    const Si = inv(S);
    // S then M2 then S^-1
    const R = new Int16Array(T.length);
    for (let i = 0; i < T.length; i++) R[i] = Si[M2p[S[i]]];
    if (key(R) === Tk) found.push(w.map((m) => m.name).join(' '));
  }
  console.log(`${e.letter}: ${found.length ? found.slice(0, 6).map((s) => `[${s}: M2]`).join(' | ') : 'none'}`);
}
