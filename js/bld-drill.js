// Blindfolded drills: scrambles with a chosen number of unsolved corners and edges.
// There is no 3x3 solver on the site, so a scramble is made the other way round: short pure
// algorithms (data/drill-pieces.js: 8-move corner 3-cycles, 4-8 move edge 3-cycles, 14-move twists,
// flips and odd swaps) are combined until exactly the asked-for pieces are unsolved, and the
// scramble is those moves reversed. Many such scrambles are made for a short time and the shortest
// is kept. Every scramble is checked on the simulated cube before it is returned. Checked under
// Node by log/2026-10-23-bld-drill-check.mjs.
import { cancelMoves, invertAlg } from './algs.js';
import { randomScramble, scrambledState } from './bld-memo.js';
import { DRILL_PIECES } from '../data/drill-pieces.js';

export const MAX_CORNERS = 8;
export const MAX_EDGES = 12;

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
const length = (alg) => (alg ? alg.split(' ').length : 0);

// One try: random pieces until the counts match (or null). Corners first, then edges; half the time
// (when both kinds are there) an odd swap first, as a real scramble can have.
function attempt(corners, edges, rnd) {
  const counts = (m) => unsolvedCounts(scrambledState(invertAlg(m)));
  let moves = corners >= 2 && edges >= 2 && rnd() < 0.5 ? pick(DRILL_PIECES.swap, rnd) : '';
  const phase = (target, kind, step, limit) => {
    for (let i = 0; i < limit; i++) {
      // stop on the target most of the time, sometimes carry on (more varied cycles)
      if (counts(moves)[kind] === target && (i > 0 || target === 0) && rnd() < 0.7) return true;
      moves = cancelMoves(`${moves} ${step()}`);
    }
    return counts(moves)[kind] === target;
  };
  if (!phase(corners, 'corners', () => pick(rnd() < 0.85 ? DRILL_PIECES.corner3 : DRILL_PIECES.twist2, rnd), corners + 2)) return null;
  if (!phase(edges, 'edges', () => pick(rnd() < 0.85 ? DRILL_PIECES.edge3 : DRILL_PIECES.flip2, rnd), edges + 2)) return null;
  const scramble = cancelMoves(invertAlg(moves));
  const got = unsolvedCounts(scrambledState(scramble));
  return got.corners === corners && got.edges === edges && !got.centres ? scramble : null;
}

// { scramble, corners, edges } or throws if the counts are impossible. Keeps trying for `budgetMs`
// (at least one success) and returns the shortest scramble found.
export function drillScramble({ corners = 4, edges = 0, rnd = Math.random, budgetMs = 150, maxMs = 5000 } = {}) {
  if (!possible(corners, edges)) throw new Error(`No cube has exactly ${corners} corners and ${edges} edges unsolved.`);
  const t0 = Date.now();
  let best = null;
  for (let tries = 0; tries < 20000; tries++) {
    const s = attempt(corners, edges, rnd);
    if (s && (!best || length(s) < length(best))) best = s;
    if (best && Date.now() - t0 >= budgetMs) break;
    if (Date.now() - t0 >= maxMs) break;
  }
  if (!best) throw new Error('Could not make that scramble; try again.');
  // nearly every piece unsolved: a plain random-move scramble with the same counts can be shorter
  if (corners + edges >= 16 && length(best) > 20) {
    for (let i = 0; i < 300; i++) {
      const s = randomScramble(i < 150 ? 20 : 25, rnd);
      const got = unsolvedCounts(scrambledState(s));
      if (got.corners === corners && got.edges === edges) { if (length(s) < length(best)) best = s; break; }
    }
  }
  return { scramble: best, corners, edges };
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

// ---- By letters: scrambles whose memo has exactly the asked-for number of letters.
// Corner letters follow the chosen corner method ('op': Old Pochmann, memo from UBL; 'orozco': memo
// from UFR); edge letters are the M2 memo (from DF). Made by trying piece counts near the letter counts
// and keeping scrambles whose memo matches; the shortest found in `budgetMs` is returned.
import { bldPlan } from './bld-memo.js';
import { orozcoCornerPlan } from './orozco.js';

export const MAX_CORNER_LETTERS = 10;
export const MAX_EDGE_LETTERS = 14;

export function letterCounts(scramble, method = 'op') {
  const plan = bldPlan(scramble);
  const corners = method === 'orozco' ? orozcoCornerPlan(plan.state).targets.length : plan.corners.length;
  return { corners, edges: plan.edges.length };
}

// One try: pieces added until the corner letters, then the edge letters, are right (corner pieces never
// change edges and edge pieces never change corners). Odd counts start with an odd swap.
function attemptLetters(cl, el, method, rnd) {
  const letters = (m) => letterCounts(cancelMoves(invertAlg(m)) || '', method);
  let moves = cl % 2 === 1 ? pick(DRILL_PIECES.swap, rnd) : '';
  const phase = (target, kind, step, limit) => {
    for (let i = 0; i < limit; i++) {
      const n = letters(moves)[kind];
      if (n === target && (i > 0 || target === 0 || moves) && rnd() < 0.75) return true;
      moves = cancelMoves(`${moves} ${step()}`);
    }
    return letters(moves)[kind] === target;
  };
  if (!phase(cl, 'corners', () => pick(rnd() < 0.85 ? DRILL_PIECES.corner3 : DRILL_PIECES.twist2, rnd), Math.ceil(cl / 2) + 3)) return null;
  if (!phase(el, 'edges', () => pick(rnd() < 0.85 ? DRILL_PIECES.edge3 : DRILL_PIECES.flip2, rnd), Math.ceil(el / 2) + 3)) return null;
  const scramble = cancelMoves(invertAlg(moves));
  const got = letterCounts(scramble, method);
  return got.corners === cl && got.edges === el ? scramble : null;
}

export function drillScrambleLetters({ cornerLetters = 4, edgeLetters = 0, method = 'op', rnd = Math.random, budgetMs = 200 } = {}) {
  if (cornerLetters + edgeLetters === 0) throw new Error('Choose at least one letter.');
  if (cornerLetters % 2 !== edgeLetters % 2) {
    // an odd number of corner letters means an odd number of corner swaps, and corner and edge swaps always match
    throw new Error('Corner and edge letters must be both even or both odd (corner and edge swaps always match).');
  }
  const t0 = Date.now();
  let best = null;
  for (let tries = 0; tries < 20000; tries++) {
    const s = attemptLetters(cornerLetters, edgeLetters, method, rnd);
    if (s && (!best || length(s) < length(best))) best = s;
    if (best && Date.now() - t0 >= budgetMs) break;
    if (!best && Date.now() - t0 >= 3000) break;
  }
  if (!best) throw new Error('No scramble found with exactly those letters; try other numbers.');
  return { scramble: best, cornerLetters, edgeLetters };
}
