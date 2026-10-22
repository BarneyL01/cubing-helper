// Corners last: every edge and centre solved, corners scrambled. Place corners one at a time with
// setups (any face turn) around a few repeat-style corner sequences that leave edges alone.
//   node log/2026-10-22-corners-last.mjs [count] [maxDepth] [set]
//   set: cycle = (U2 R D2 R')x2 and its reverse; both = cycle + Sassy x3; twist = both + a corner-pair twist
import { pieces, makeMoves, turns, FACES, solvedState, applyText, rng, randomScramble, runStep, mean, hist } from './2026-10-22-sim-engine.mjs';
const [COUNT, DEPTH, SET] = [Number(process.argv[2] || 20), Number(process.argv[3] || 5), process.argv[4] || 'both'];
const x = (w, k) => Array(k).fill(w).join(' ');
const MACROS = [
  { name: "(U2 R D2 R')x2", alg: x("U2 R D2 R'", 2), family: 'C1' },
  { name: "(R D2 R' U2)x2", alg: x("R D2 R' U2", 2), family: 'C2' },
  ...(SET === 'both' || SET === 'twist' ? [{ name: "(R U R' U')x3", alg: x("R U R' U'", 3), family: 'S3' }] : []),
  // twist: (R' D' R D)x2 twists the UFR corner (and upsets the bottom layer), U, then undo it on the next corner
  ...(SET === 'twist' ? [
    { name: "(R' D' R D)x2 U (D' R' D R)x2 U'", alg: `${x("R' D' R D", 2)} U ${x("D' R' D R", 2)} U'`, family: 'T1' },
    { name: "(D' R' D R)x2 U (R' D' R D)x2 U'", alg: `${x("D' R' D R", 2)} U ${x("R' D' R D", 2)} U'`, family: 'T2' },
  ] : []),
];
const moves = makeMoves([...turns(FACES), ...MACROS]);
const CORNERS = pieces((p) => p.kind === 'corner');
const KEEP = pieces((p) => p.kind !== 'corner');
const edgeIds = new Set(KEEP.flatMap((p) => p.ids));
const rand = rng(31);
// corner permutation parity of a state
const odd = (st) => {
  const ps = CORNERS.map((p) => CORNERS.findIndex((q) => q.ids.includes(st[p.ids[0]])));
  let sw = 0; const seen = [];
  for (let i = 0; i < 8; i++) { if (seen[i]) continue; let j = i; let n = 0; while (!seen[j]) { seen[j] = true; j = ps[j]; n++; } sw += n - 1; }
  return sw % 2 === 1;
};
const recs = []; let stuck = 0; const totals = []; const left = [];
for (let made = 0; made < COUNT;) {
  let st = applyText(solvedState(), randomScramble(rand));
  if (odd(st)) continue;
  st = st.map((v, i) => (edgeIds.has(i) ? i : v));
  made++;
  const r = runStep(st, { moves, groups: CORNERS.map((c) => [c]), maxDepth: DEPTH }, KEEP);
  recs.push(...r.records);
  if (r.failed) { stuck++; left.push(r.failed.left); } else totals.push(r.records.reduce((a, q) => a + q.turns, 0));
}
console.log(`Corners last with [${MACROS.map((m) => m.name).join(', ')}], up to ${DEPTH} moves per corner (a sequence counts 1): stuck ${stuck}/${COUNT} (corners left: ${hist(left)}); mean turns ${mean(totals).toFixed(1)}`);
console.log(`   horizon ${hist(recs.map((r) => r.depth))}; examples: ${recs.slice(0, 8).map((r) => r.moves).join(' | ')}`);
