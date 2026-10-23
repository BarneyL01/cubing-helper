// Blindfolded drills: scrambles with a chosen number of unsolved corners and edges.
// There is no 3x3 solver on the site, so a scramble is made the other way round:
// random commutators, twists and flips from the Corner/Edge cycles tables are
// combined until exactly the asked-for pieces are unsolved, and the scramble is
// those moves reversed. Every scramble is checked on the simulated cube before it
// is returned. Checked under Node by log/2026-10-23-bld-drill-check.mjs.
import { cancelMoves, invertAlg } from './algs.js';
import { randomScramble, scrambledState } from './bld-memo.js';
import { cornerComms, cornerTwists, cornerParity } from '../data/corner-cycles.js';
import { edgeComms, edgeFlips } from '../data/edge-cycles.js';

export const MAX_CORNERS = 8;
export const MAX_EDGES = 12;

// Edge commutators with E or S slice turns are awkward to do by hand; M is fine (M2 uses it).
const EDGE_ROWS = edgeComms.filter((r) => !/[ES]/.test(r.moves));
const key = (s) => `${s.p.join()}|${s.n.join()}`;

// How many corners and edges are not solved (moved, or twisted/flipped in place).
export function unsolvedCounts(state) {
  const bad = new Set();
  for (const s of state) if (s.home !== key(s)) bad.add(s.p.join());
  let corners = 0;
  let edges = 0;
  for (const p of bad) {
    const n = p.split(',').filter((v) => v !== '0').length;
    if (n === 3) corners++;
    else if (n === 2) edges++;
  }
  return { corners, edges, centres: [...bad].some((p) => p.split(',').filter((v) => v !== '0').length === 1) };
}

// Counts that a real cube can have: one piece alone can't be twisted or flipped.
export function possible(corners, edges) {
  return corners >= 0 && corners <= MAX_CORNERS && corners !== 1 && edges >= 0 && edges <= MAX_EDGES && edges !== 1 && corners + edges > 0;
}

const pick = (xs, rnd) => xs[Math.floor(rnd() * xs.length)];

// Adds random steps until `count(moves)` equals `target`, or gives up (null).
function walk(start, steps, target, count, rnd, limit) {
  let moves = start;
  for (let i = 0; i < limit; i++) {
    moves = `${moves} ${steps()}`.trim();
    const n = count(moves);
    // stop on the target most of the time, sometimes carry on (more varied cycles)
    if (n === target && rnd() < 0.7) return moves;
  }
  return count(moves) === target ? moves : null;
}

// { scramble, corners, edges } or throws if the counts are impossible.
export function drillScramble({ corners = 4, edges = 0, rnd = Math.random } = {}) {
  if (!possible(corners, edges)) throw new Error(`No cube has exactly ${corners} corners and ${edges} edges unsolved.`);
  const counts = (moves) => unsolvedCounts(scrambledState(invertAlg(moves)));
  const cornerStep = () => (rnd() < 0.88 ? pick(cornerComms, rnd) : pick(cornerTwists, rnd)).moves;
  const edgeStep = () => (rnd() < 0.85 ? pick(EDGE_ROWS, rnd) : pick(edgeFlips, rnd)).moves;
  for (let attempt = 0; attempt < 400; attempt++) {
    // Half the time (when both kinds are there) an odd number of swaps: the corner
    // parity step swaps two corners and two edges, as a real scramble can.
    const odd = corners >= 2 && edges >= 2 && rnd() < 0.5;
    let moves = odd ? pick(cornerParity, rnd).moves : '';
    if (corners) {
      moves = walk(moves, cornerStep, corners, (m) => counts(m).corners, rnd, corners + 3);
      if (moves === null) continue;
    } else if (counts(moves).corners) continue;
    if (edges) {
      const done = walk(moves, edgeStep, edges, (m) => counts(m).edges, rnd, edges + 3);
      if (done === null) continue;
      moves = done;
    } else if (counts(moves).edges) continue;
    const scramble = cancelMoves(invertAlg(moves));
    const got = unsolvedCounts(scrambledState(scramble));
    if (got.corners === corners && got.edges === edges && !got.centres) return shorter({ scramble, corners, edges }, rnd);
  }
  throw new Error('Could not make that scramble; try again.');
}

// With many unsolved pieces, a plain random-move scramble is often just as good and much
// shorter: try some and keep one that has exactly the asked-for counts.
function shorter(found, rnd) {
  const length = found.scramble.split(' ').length;
  if (length <= 25 || found.corners + found.edges < 16) return found;
  for (let i = 0; i < 300; i++) {
    const scramble = randomScramble(i < 150 ? 20 : 25, rnd);
    const got = unsolvedCounts(scrambledState(scramble));
    if (got.corners === found.corners && got.edges === found.edges) return { ...found, scramble };
  }
  return found;
}

// Letter-scheme drill: a random sticker of the chosen kind (Speffz letter A-X).
export function randomLetter(kind, rnd = Math.random, not = null) {
  for (;;) {
    const letter = String.fromCharCode(65 + Math.floor(rnd() * 24));
    if (letter !== not) return { kind: kind === 'both' ? (rnd() < 0.5 ? 'edges' : 'corners') : kind, letter };
  }
}

// Memo drill: random letters in pairs, no letter twice in a row (as in a real memo).
export function randomLetters(n, rnd = Math.random) {
  const out = [];
  while (out.length < n) {
    const l = String.fromCharCode(65 + Math.floor(rnd() * 24));
    if (l !== out.at(-1)) out.push(l);
  }
  return out;
}
