// Checks the full OLL and full PLL lists (data/oll-full.js, data/pll-full.js) by simulation.
//   node log/2026-10-23-full-oll-pll-check.mjs
// OLL: every algorithm keeps the first two layers and the bottom layer solved (its inverse,
// applied to a solved cube, is the case), the top face is not already yellow in the case, and the
// 57 top-face colour patterns (up to a turn of U) are all different.
// PLL: the same F2L check; the top layer is oriented in the case; the 21 top-layer arrangements
// (up to a turn of U) are all different and none is solved.
import { applyAlg, caseState, faceOf, solvedCube, startHold } from '../js/cube-sim.js';
import { ollFullCases } from '../data/oll-full.js';
import { pllFullEdgeCases, pllFullCornerCases } from '../data/pll-full.js';

const CORNER_RING = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
const EDGE_RING = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const problems = [];

// Stickers grouped by position, with the colours on each piece.
const pieceAt = (state) => {
  const groups = new Map();
  for (const s of state) {
    const pos = s.p.join(',');
    if (!groups.has(pos)) groups.set(pos, { p: s.p, cols: [] });
    groups.get(pos).cols.push(s.colour);
  }
  return [...groups.values()];
};

// Bottom layer and the middle-layer side stickers must be home.
function firstTwoLayersSolved(state, name) {
  const ok = state.every((s) => {
    if (s.p[1] === -1) return s.colour === faceOf(s.n);
    if (s.p[1] === 0) return s.n[1] !== 0 || s.colour === faceOf(s.n);
    return true;
  });
  if (!ok) problems.push(`${name}: first two layers disturbed`);
}

const topString = (state) => state
  .filter((s) => s.p[1] === 1 && s.n[1] === 1)
  .sort((a, b) => a.p[0] - b.p[0] || a.p[2] - b.p[2])
  .map((s) => s.colour)
  .join('');

// The lowest of the four U-turn versions of a string, so a case and its AUF match.
function upToU(state) {
  return [0, 1, 2, 3]
    .map((r) => topString(r ? applyAlg(state, Array(r).fill('U').join(' ')) : state))
    .sort()[0];
}

// OLL
const ollSeen = new Map();
for (const c of ollFullCases) {
  const st = caseState(c.alg, startHold(c.alg));
  firstTwoLayersSolved(st, c.name);
  const canon = upToU(st);
  if (canon === upToU(solvedCube())) problems.push(`${c.name}: the case is already solved on top`);
  if (ollSeen.has(canon)) problems.push(`${c.name} has the same top pattern as ${ollSeen.get(canon)}`);
  ollSeen.set(canon, c.name);
}
console.log(`OLL: ${ollFullCases.length} algorithms, ${ollSeen.size} different top patterns`);

// PLL: the top layer's pieces by ring position, as [kind, piece colours, home index, ring index].
const HOME = { corner: new Map(), edge: new Map() };
for (const g of pieceAt(solvedCube())) {
  const key = [...g.cols].sort().join('');
  if (g.cols.length === 3) HOME.corner.set(key, CORNER_RING.findIndex(([x, z]) => g.p[0] === x && g.p[2] === z));
  if (g.cols.length === 2 && g.p[1] === 1) HOME.edge.set(key, EDGE_RING.findIndex(([x, z]) => g.p[0] === x && g.p[2] === z));
}
function layerPieces(state) {
  const out = [];
  for (const g of pieceAt(state)) {
    if (g.p[1] !== 1 || g.cols.length < 2) continue;
    const kind = g.cols.length === 3 ? 'corner' : 'edge';
    const ring = kind === 'corner' ? CORNER_RING : EDGE_RING;
    const cur = ring.findIndex(([x, z]) => g.p[0] === x && g.p[2] === z);
    const key = [...g.cols].sort().join('');
    out.push({ kind, key, home: HOME[kind].get(key), cur });
  }
  return out;
}
// The arrangement up to a turn of U: the lowest of the four ring shifts.
const arrangement = (pcs) => [0, 1, 2, 3]
  .map((r) => JSON.stringify(pcs.map((p) => [p.kind, p.key, p.home, (p.cur + r) % 4]).sort()))
  .sort()[0];

const pllAll = [...pllFullEdgeCases, ...pllFullCornerCases];
const solvedArrangement = arrangement(layerPieces(solvedCube()));
const pllSeen = new Map();
for (const c of pllAll) {
  const st = caseState(c.alg, startHold(c.alg));
  firstTwoLayersSolved(st, c.name);
  if (!st.filter((s) => s.p[1] === 1 && s.n[1] === 1).every((s) => s.colour === 'U')) {
    problems.push(`${c.name}: the top layer is not oriented in the case`);
  }
  const sig = arrangement(layerPieces(st));
  if (sig === solvedArrangement) problems.push(`${c.name}: the case is already solved`);
  if (pllSeen.has(sig)) problems.push(`${c.name} has the same arrangement as ${pllSeen.get(sig)}`);
  pllSeen.set(sig, c.name);
}
console.log(`PLL: ${pllAll.length} algorithms, ${pllSeen.size} different arrangements`);

console.log(problems.length ? `PROBLEMS:\n${problems.join('\n')}` : 'No problems found.');
process.exitCode = problems.length ? 1 : 0;
