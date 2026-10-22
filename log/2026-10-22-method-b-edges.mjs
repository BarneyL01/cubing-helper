// Method B, edge stage on its own: all corners solved, centres solved, edges scrambled. Adds edges one at
// a time (or as bars) with the given move set, keeping corners, centres and placed edges solved.
//   node log/2026-10-22-method-b-edges.mjs [count] [singles|bars] [slice|all] [maxDepth]
import { piece, pieces, makeMoves, turns, FACES, SLICES, solvedState, applyText, rng, randomScramble, runStep, mean, hist, SOLVED } from './2026-10-22-sim-engine.mjs';

const [COUNT, MODE, SET, DEPTH] = [Number(process.argv[2] || 5), process.argv[3] || 'singles', process.argv[4] || 'all', Number(process.argv[5] || 6)];
// SET: 'slice' = slices + half turns; 'all' = slices + every face turn; 'cycle' = 'all' plus one edge
// sequence, M' U2 M U2 (a 3-cycle of UF, UB, DF) and its reverse, each counting as one move
const CYCLE = [{ name: "(M' U2 M U2)", alg: "M' U2 M U2", family: 'C1' }, { name: "(U2 M' U2 M)", alg: "U2 M' U2 M", family: 'C2' }];
// 'repeat' = 'all' plus three repeat-style sequences (corners and centres untouched):
// (U' M')x4 flips 4 edges, (U2 M E2)x2 and (U2 M' E2)x2 cycle 3 edges, (U2 M2)x2 swaps two pairs
const x = (w, k) => Array(k).fill(w).join(' ');
const REPEAT = [
  { name: "(U' M')x4", alg: x("U' M'", 4), family: 'R1' },
  { name: '(U2 M E2)x2', alg: x('U2 M E2', 2), family: 'R2' },
  { name: "(U2 M' E2)x2", alg: x("U2 M' E2", 2), family: 'R3' },
  { name: '(U2 M2)x2', alg: x('U2 M2', 2), family: 'R4' },
];
const moves = SET === 'repeat' ? makeMoves([...turns(SLICES), ...turns(FACES), ...REPEAT]) : makeMoves(SET === 'slice' ? [...turns(SLICES), ...turns(FACES, ['2'])] : SET === 'cycle' ? [...turns(SLICES), ...turns(FACES), ...CYCLE] : [...turns(SLICES), ...turns(FACES)]);
const CORNERS = pieces((p) => p.kind === 'corner');
const CENTRES = pieces((p) => p.kind === 'centre');
const BARS = [['UF', 'UB'], ['UL', 'UR'], ['DF', 'DB'], ['DL', 'DR'], ['FL', 'FR'], ['BL', 'BR']].map((b) => b.map(piece));
const rand = rng(77);
// a random position with corners and centres solved: scramble, then put corners back (only even scrambles)
const cornerIds = new Set(CORNERS.flatMap((p) => p.ids));
const parityOdd = (st) => {
  const ps = CORNERS.map((p) => { const at = st[p.ids[0]]; return CORNERS.findIndex((q) => q.ids.some((i) => i === at)); });
  let sw = 0; const seen = new Array(8).fill(false);
  for (let i = 0; i < 8; i++) { if (seen[i]) continue; let j = i, len = 0; while (!seen[j]) { seen[j] = true; j = ps[j]; len++; } sw += len - 1; }
  return sw % 2 === 1;
};
const step = { name: 'edges', moves, groups: MODE === 'bars' ? BARS : pieces((p) => p.kind === 'edge').map((pc) => [pc]), maxDepth: DEPTH, nodeLimit: 2e8 };
const recs = []; let stuck = 0; const totals = [];
let made = 0;
while (made < COUNT) {
  let st = applyText(solvedState(), randomScramble(rand));
  if (parityOdd(st)) continue;
  st = st.map((v, i) => (cornerIds.has(i) ? i : v));
  made++;
  const t0 = Date.now();
  const r = runStep(st, step, [...CORNERS, ...CENTRES]);
  recs.push(...r.records);
  if (r.failed) { stuck++; console.log(`  position ${made}: stuck with ${r.failed.left} left (${((Date.now() - t0) / 1000).toFixed(0)} s)`); }
  else { totals.push(r.records.reduce((a, x) => a + x.turns, 0)); console.log(`  position ${made}: done, ${totals.at(-1)} turns (${((Date.now() - t0) / 1000).toFixed(0)} s)`); }
}
console.log(`Edges with corners solved: ${MODE}, moves ${SET}, depth <= ${DEPTH}; stuck ${stuck}/${COUNT}; mean turns ${mean(totals).toFixed(1)}`);
console.log(`   horizon: ${hist(recs.map((r) => r.depth))}`);
console.log(`   peak solved pieces broken: ${hist(recs.map((r) => r.peak))}; longest run: ${hist(recs.map((r) => r.run))}`);
console.log(`   units using a repeat sequence: ${recs.filter((r) => r.moves.includes(')x')).length} of ${recs.length}`);
console.log(`   longest units: ${recs.slice().sort((a, b) => b.depth - a.depth).slice(0, 4).map((r) => r.moves).join(' | ')}`);
