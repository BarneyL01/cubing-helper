// Cube theory pages: what a position looks like in terms of pieces — where every corner and edge
// is, how it is twisted or flipped — and the three laws every position obeys. Works on the
// simulator's stickers with `home` set (start from `trackedSolved()` and apply moves).
// Checked under Node by log/2026-10-28-theory-check.mjs.
import { applyAlg, solvedCube } from './cube-sim.js';
import { cornerOrientation } from './bld-memo.js';

export const CORNER_SLOTS = [];
export const EDGE_SLOTS = [];
for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) {
  const n = [x, y, z].filter((v) => v).length;
  if (n === 3) CORNER_SLOTS.push([x, y, z]);
  if (n === 2) EDGE_SLOTS.push([x, y, z]);
}
const FACE = { '1,0,0': 'R', '-1,0,0': 'L', '0,1,0': 'U', '0,-1,0': 'D', '0,0,1': 'F', '0,0,-1': 'B' };
// A piece's name from its position, e.g. [1,1,1] -> "UFR" (U/D first, then F/B, then R/L).
export function slotName(p) {
  const out = [];
  if (p[1]) out.push(p[1] > 0 ? 'U' : 'D');
  if (p[2]) out.push(p[2] > 0 ? 'F' : 'B');
  if (p[0]) out.push(p[0] > 0 ? 'R' : 'L');
  return out.join('');
}

const key = (s) => `${s.p.join()}|${s.n.join()}`;
export const trackedSolved = () => solvedCube().map((s) => ({ ...s, home: key(s) }));
export const tracked = (alg) => applyAlg(trackedSolved(), alg);

const homePos = (s) => s.home.split('|')[0];
const at = (state, pos) => state.filter((s) => s.p.join() === pos.join());

// Edge flip: an edge's "main" sticker is its U/D colour, or its F/B colour if it has none. A slot's
// main face is its U or D face, or its F/B face for the four middle-layer slots. Flipped (1) when the
// main sticker is not on the main face. With this rule only F and B quarter turns flip edges.
function edgeFlip(state, pos) {
  const stickers = at(state, pos);
  const main = stickers.find((s) => s.colour === 'U' || s.colour === 'D') || stickers.find((s) => s.colour === 'F' || s.colour === 'B');
  const mainAxis = pos[1] ? 1 : 2;
  return main.n[mainAxis] ? 0 : 1;
}

// Every corner and edge: its slot, the piece in it (by home slot), and its twist / flip.
// Twist: 0, 1 (clockwise, looking at the corner from outside) or 2 (anticlockwise).
export function pieces(state) {
  const corners = CORNER_SLOTS.map((pos) => {
    const t = cornerOrientation(state, pos);
    return { slot: pos.join(), piece: homePos(at(state, pos)[0]), twist: t === 0 ? 0 : t === 1 ? 1 : 2 };
  });
  const edges = EDGE_SLOTS.map((pos) => ({ slot: pos.join(), piece: homePos(at(state, pos)[0]), flip: edgeFlip(state, pos) }));
  return { corners, edges };
}

// Even (0) or odd (1) number of swaps to put the pieces back in their places.
function parity(list) {
  const where = new Map(list.map((x) => [x.piece, x.slot]));
  const seen = new Set();
  let swaps = 0;
  for (const x of list) {
    if (seen.has(x.slot)) continue;
    let len = 0;
    let s = x.slot;
    while (!seen.has(s)) { seen.add(s); len++; s = where.get(s); }
    swaps += len - 1;
  }
  return swaps % 2;
}

// The three laws, measured on a position.
export function laws(state) {
  const { corners, edges } = pieces(state);
  const twistTotal = corners.reduce((a, c) => a + c.twist, 0);
  const flips = edges.reduce((a, e) => a + e.flip, 0);
  return {
    twisted: corners.filter((c) => c.twist).length,
    twistTotal, // in thirds of a turn; always a multiple of 3
    flips, // always even
    cornerParity: parity(corners),
    edgeParity: parity(edges), // always equal to cornerParity
  };
}

// Cycles of one application of an algorithm, from a solved cube: each cycle with its length and the
// twist (corners) or flip (edges) it builds up. A corner cycle comes home after `length` repeats if its
// twist adds to a whole turn, else after 3 x length; an edge cycle after length, or 2 x length if flipped.
export function cycles(alg) {
  const { corners, edges } = pieces(tracked(alg));
  const run = (list, extra, mod) => {
    const where = new Map(list.map((x) => [x.piece, x])); // piece -> where it is now
    const seen = new Set();
    const out = [];
    for (const start of list) {
      if (seen.has(start.piece)) continue;
      const slots = [];
      let total = 0;
      let p = start.piece;
      while (!seen.has(p)) { seen.add(p); slots.push(p); const now = where.get(p); total += now[extra]; p = now.slot; }
      total %= mod;
      if (slots.length > 1 || total) out.push({ slots: slots.map((s) => slotName(s.split(',').map(Number))), length: slots.length, [extra]: total, returnsAfter: slots.length * (total ? mod : 1) });
    }
    return out;
  };
  return { corners: run(corners, 'twist', 3), edges: run(edges, 'flip', 2) };
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const lcm = (a, b) => (a * b) / gcd(a, b);

// The order: how many times in a row the algorithm must be done to get back to solved, counted on the
// simulator (centres included, so slice moves count too). Every 3x3 algorithm's order is at most 1260.
export function order(alg) {
  const start = trackedSolved();
  let st = start;
  for (let n = 1; n <= 1260; n++) {
    st = applyAlg(st, alg);
    if (st.every((s) => s.home === key(s))) return n;
  }
  return null;
}
