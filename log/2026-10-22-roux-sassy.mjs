// Roux blocks solved; can the four top corners be solved with Sassy only (on the right block, or its
// mirror on the left block), U turns and M turns, keeping both blocks intact?
//   node log/2026-10-22-roux-sassy.mjs [count] [maxDepth]
import { piece, pieces, makeMoves, turns, solvedState, apply, rng, runStep, mean, hist } from './2026-10-22-sim-engine.mjs';
const [COUNT, DEPTH] = [Number(process.argv[2] || 5), Number(process.argv[3] || 8)];
const BLOCKS = ['DL', 'DFL', 'DBL', 'FL', 'BL', 'L', 'DR', 'DFR', 'DBR', 'FR', 'BR', 'R'].map(piece);
const moves = makeMoves([
  ...turns(['U']), ...turns(['M']),
  { name: 'Sassy(R)', alg: "R U R' U'", family: 'SR' },
  { name: 'mirror Sassy(L)', alg: "L' U' L U", family: 'SL' },
]);
// random positions with the blocks solved: random moves from M, U and Sune (Sune keeps the first two layers)
const gens = makeMoves([...turns(['U']), ...turns(['M']), { name: 'sune', alg: "R U R' U R U2 R'" }, { name: 'antisune', alg: "R U2 R' U' R U' R'" }]);
const rand = rng(5);
const recs = []; let stuck = 0; const totals = [];
for (let k = 0; k < COUNT; k++) {
  let st = solvedState();
  for (let i = 0; i < 60; i++) st = apply(st, gens[Math.floor(rand() * gens.length)].perm);
  const r = runStep(st, { moves, groups: pieces((p) => p.kind === 'corner' && p.p[1] === 1).map((pc) => [pc]), maxDepth: DEPTH }, BLOCKS);
  recs.push(...r.records);
  if (r.failed) { stuck++; console.log(`  position ${k}: stuck with ${r.failed.left} corners left`); } else totals.push(r.records.reduce((a, x) => a + x.turns, 0));
}
console.log(`Roux blocks + Sassy corners: stuck ${stuck}/${COUNT}; mean turns ${mean(totals).toFixed(1)}; horizon ${hist(recs.map((r) => r.depth))}`);
console.log(`   peak broken ${hist(recs.map((r) => r.peak))}; longest run ${hist(recs.map((r) => r.run))}; examples: ${recs.slice().sort((a, b) => b.depth - a.depth).slice(0, 3).map((r) => r.moves).join(' | ')}`);
