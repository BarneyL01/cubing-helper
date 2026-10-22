// Method A ("middle layer free"): bottom layer, then top layer while the middle layer is free,
// then the four middle-layer edges. Singles (one piece at a time) and bars (a row of 3 at a time).
//   node log/2026-10-22-method-a.mjs [scrambles] [singles|bars]
import { piece, pieces, makeMoves, turns, FACES, solvedState, applyText, rng, randomScramble, runStep, mean, hist, isHome } from './2026-10-22-sim-engine.mjs';

const COUNT = Number(process.argv[2] || 20);
const MODE = process.argv[3] || 'singles';
const faceMoves = makeMoves(turns(FACES));
const withE = makeMoves([...turns(FACES), ...turns(['E'])]);
const CENTRES = pieces((p) => p.kind === 'centre');
const rows = (layer) => [[`${layer}FL`, `${layer}F`, `${layer}FR`], [`${layer}L`, layer, `${layer}R`], [`${layer}BL`, `${layer}B`, `${layer}BR`]]
  .map((r) => r.map((n) => piece(n)).filter((pc) => pc.kind !== 'centre'));
const singles = (layer) => pieces((p) => p.kind !== 'centre' && p.p[1] === (layer === 'U' ? 1 : -1)).map((pc) => [pc]);
const STEPS = [
  { name: 'A1 bottom layer', moves: faceMoves, groups: MODE === 'bars' ? rows('D') : singles('D'), maxDepth: MODE === 'bars' ? 8 : 6 },
  { name: 'A2 top layer (middle free)', moves: withE, groups: MODE === 'bars' ? rows('U') : singles('U'), maxDepth: 8 },
  { name: 'A3 middle edges', moves: withE, groups: pieces((p) => p.kind === 'edge' && p.p[1] === 0).map((pc) => [pc]), maxDepth: 8 },
];
const rand = rng(20261022);
const stats = STEPS.map(() => ({ recs: [], fails: 0, turns: [] }));
for (let k = 0; k < COUNT; k++) {
  let st = applyText(solvedState(), randomScramble(rand));
  let cared = CENTRES.slice();
  for (const [i, step] of STEPS.entries()) {
    const r = runStep(st, step, cared);
    stats[i].recs.push(...r.records);
    if (r.failed) { stats[i].fails++; console.log(`  scramble ${k}: ${step.name} stuck with ${r.failed.left} left`); break; }
    stats[i].turns.push(r.records.reduce((a, x) => a + x.turns, 0));
    st = r.st; cared = r.cared;
  }
}
console.log(`Method A, ${MODE}, ${COUNT} scrambles`);
for (const [i, step] of STEPS.entries()) {
  const s = stats[i];
  console.log(`${step.name}: stuck ${s.fails}; turns per solve mean ${mean(s.turns).toFixed(1)}; units ${s.recs.length}`);
  console.log(`   horizon (moves per unit): ${hist(s.recs.map((r) => r.depth))}`);
  console.log(`   peak solved pieces broken: ${hist(s.recs.map((r) => r.peak))}; longest broken run: ${hist(s.recs.map((r) => r.run))}`);
  const deep = s.recs.filter((r) => r.depth >= 6).slice(0, 3).map((r) => r.moves);
  if (deep.length) console.log(`   examples of long units: ${deep.join(' | ')}`);
}
