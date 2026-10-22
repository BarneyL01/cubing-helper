// Last six edges (corners and the six side edges solved) with only M and U turns plus repeat-style
// sequences, one edge at a time. Does every position finish, and with what?
//   node log/2026-10-22-lse-repeat.mjs [count] [maxDepth] [plain|repeat]
import { piece, pieces, makeMoves, turns, solvedState, apply, rng, runStep, mean, hist, isHome } from './2026-10-22-sim-engine.mjs';
const [COUNT, DEPTH, SET] = [Number(process.argv[2] || 50), Number(process.argv[3] || 6), process.argv[4] || 'repeat'];
const x = (w, k) => Array(k).fill(w).join(' ');
const REPEAT = [
  { name: "(U' M')x4", alg: x("U' M'", 4), family: 'R1' },
  { name: '(U M)x4', alg: x('U M', 4), family: 'R5' },
  { name: '(U2 M2)x2', alg: x('U2 M2', 2), family: 'R4' },
  { name: '(U M2)x4', alg: x('U M2', 4), family: 'R6' },
];
const CYCLE = [{ name: "(M' U2 M U2)", alg: "M' U2 M U2", family: 'C1' }, { name: "(U2 M' U2 M)", alg: "U2 M' U2 M", family: 'C2' }];
// SET can also be a list of sequence names separated by commas, e.g. "(U' M')x4,(U2 M2)x2"
const PICK = SET.includes('x') || SET.includes('(') ? [...REPEAT, ...CYCLE].filter((m) => SET.split(',').includes(m.name)) : null;
const moves = PICK ? makeMoves([...turns(['U']), ...turns(['M']), ...PICK]) : makeMoves([...turns(['U']), ...turns(['M']), ...(SET === 'repeat' ? REPEAT : []), ...(SET === 'cycle' || SET === 'both' ? CYCLE : []), ...(SET === 'both' ? REPEAT : [])]);
const CORNERS = pieces((p) => p.kind === 'corner');
const KEPT = [...CORNERS, ...['DL', 'DR', 'FL', 'FR', 'BL', 'BR', 'L', 'R'].map(piece)];
const LSE = ['UF', 'UB', 'UL', 'UR', 'DF', 'DB'].map((n) => [piece(n)]);
const CENTRES = ['U', 'D', 'F', 'B'].map(piece);
const gen = makeMoves([...turns(['U']), ...turns(['M'])]);
const align = makeMoves(['U', 'U2', "U'"]);
const rand = rng(11);
const recs = []; let stuck = 0; const totals = [];
for (let k = 0; k < COUNT; k++) {
  let st = solvedState();
  for (let i = 0; i < 40; i++) st = apply(st, gen[Math.floor(rand() * gen.length)].perm);
  if (!CORNERS.every((p) => isHome(st, p))) st = align.map((m) => apply(st, m.perm)).find((s) => CORNERS.every((p) => isHome(s, p)));
  // centres: M2 at the end if needed is part of the solve; the step groups include the centres
  const r = runStep(st, { moves, groups: [...LSE, ...CENTRES.map((c) => [c])], maxDepth: DEPTH }, KEPT);
  recs.push(...r.records);
  if (r.failed) { stuck++; } else totals.push(r.records.reduce((a, q) => a + q.turns, 0));
}
console.log(`LSE with M, U + [${SET}], depth <= ${DEPTH}: stuck ${stuck}/${COUNT}; mean turns ${mean(totals).toFixed(1)}`);
console.log(`   horizon ${hist(recs.map((r) => r.depth))}; units using a sequence ${recs.filter((r) => r.moves.includes(')')).length} of ${recs.length}`);
console.log(`   examples: ${recs.filter((r) => r.moves.includes(')x')).slice(0, 6).map((r) => r.moves).join(' | ')}`);
