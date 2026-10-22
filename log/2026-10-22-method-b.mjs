// Method B ("corners first, then slices"): bottom corners, top corners with Sassy only (turns of U and D
// between), then all edges with slice turns and half turns (which never leave a corner out of place
// for long). Singles or bars (two opposite edges of a face, with the centre between them).
//   node log/2026-10-22-method-b.mjs [scrambles] [singles|bars] [edgeMoves: slice|all]
import { piece, pieces, makeMoves, turns, FACES, SLICES, solvedState, applyText, rng, randomScramble, runStep, mean, hist } from './2026-10-22-sim-engine.mjs';

const COUNT = Number(process.argv[2] || 20);
const MODE = process.argv[3] || 'singles';
const EDGE_MOVES = process.argv[4] || 'slice';
const faceMoves = makeMoves(turns(FACES));
const sassyMoves = makeMoves([
  ...turns(['U', 'D']),
  ...['R', 'F', 'L', 'B'].map((x) => ({ name: `Sassy(${x})`, alg: `${x} U ${x}' U'`, family: `S${x}` })),
]);
const edgeMoves = makeMoves(EDGE_MOVES === 'all' ? [...turns(SLICES), ...turns(FACES)] : [...turns(SLICES), ...turns(FACES, ['2'])]);
const CENTRES = pieces((p) => p.kind === 'centre');
const corners = (y) => pieces((p) => p.kind === 'corner' && p.p[1] === y).map((pc) => [pc]);
const BARS = [['UF', 'UB'], ['UL', 'UR'], ['DF', 'DB'], ['DL', 'DR'], ['FL', 'FR'], ['BL', 'BR']].map((b) => b.map(piece));
const STEPS = [
  { name: 'B1 bottom corners', moves: faceMoves, groups: corners(-1), maxDepth: 6 },
  { name: 'B2 top corners (Sassy only)', moves: sassyMoves, groups: corners(1), maxDepth: 9 },
  { name: 'B3 edges', moves: edgeMoves, groups: MODE === 'bars' ? BARS : pieces((p) => p.kind === 'edge').map((pc) => [pc]), maxDepth: Number(process.env.EDGE_DEPTH || (MODE === 'bars' ? 8 : 7)) },
];
const rand = rng(20261022);
const stats = STEPS.map(() => ({ recs: [], fails: 0, turns: [] }));
for (let k = 0; k < COUNT; k++) {
  let st = applyText(solvedState(), randomScramble(rand));
  // centres stay put in B1 and B2 (face turns and Sassy only); in B3 slices move them, so they are cared
  let cared = CENTRES.slice();
  for (const [i, step] of STEPS.entries()) {
    const r = runStep(st, step, cared);
    stats[i].recs.push(...r.records);
    if (r.failed) { stats[i].fails++; console.log(`  scramble ${k}: ${step.name} stuck with ${r.failed.left} left`); break; }
    stats[i].turns.push(r.records.reduce((a, x) => a + x.turns, 0));
    st = r.st; cared = r.cared;
  }
}
console.log(`Method B, ${MODE}, edge moves ${EDGE_MOVES}, ${COUNT} scrambles`);
for (const [i, step] of STEPS.entries()) {
  const s = stats[i];
  console.log(`${step.name}: stuck ${s.fails}; turns per solve mean ${mean(s.turns).toFixed(1)}; units ${s.recs.length}`);
  console.log(`   horizon (moves per unit; a Sassy counts 1): ${hist(s.recs.map((r) => r.depth))}`);
  console.log(`   peak solved pieces broken: ${hist(s.recs.map((r) => r.peak))}; longest broken run: ${hist(s.recs.map((r) => r.run))}`);
  const deep = s.recs.slice().sort((a, b) => b.depth - a.depth).slice(0, 3).map((r) => r.moves);
  if (deep.length) console.log(`   longest units: ${deep.join(' | ')}`);
}
