// Blindfolded practice: scramble a simulated cube, work out the Speffz memo
// (M2 edges, Old Pochmann corners) and the moves for every letter, using the
// setups in data/bld.js. Checked under Node: running every listed move on
// the scrambled cube solves it (see log/2026-09-29-bld-practice.md).
import { applyAlg, solvedCube } from './cube-sim.js';
import { invertAlg } from './algs.js';
import { bldEdges, bldCorners, BLD_PARITY, BLD_CORNER_SWAP } from '../data/bld.js';

const NORMAL = { U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], R: [1, 0, 0], L: [-1, 0, 0] };

// "LUB" -> the L-face sticker of the UBL corner: position = sum of the face
// normals, sticker normal = the first face's.
function stickerOf(piece) {
  const p = [0, 0, 0];
  for (const f of piece) NORMAL[f].forEach((v, i) => (p[i] += v));
  return { p, n: NORMAL[piece[0]] };
}

const key = (p, n) => `${p.join()}|${n.join()}`;
const table = (rows) => Object.fromEntries(rows.map((r) => [r.letter, stickerOf(r.piece)]));
const EDGE = table(bldEdges);
const CORNER = table(bldCorners);

// Memo references: edges from the buffer's U sticker (DF), corners from its
// E sticker (LUB) — "U goes to A", "E goes to V" in the notes.
const EDGE_REF = 'U';
const CORNER_REF = 'E';
const OPPOSITE = { C: 'W', W: 'C', I: 'S', S: 'I' };

const FACES = 'RLUDFB';
const AXIS = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };

// Random-move scramble: never the same face twice in a row, and never three
// turns on one axis in a row (R L R is really just L R2).
export function randomScramble(length = 25, rnd = Math.random) {
  const moves = [];
  while (moves.length < length) {
    const f = FACES[Math.floor(rnd() * 6)];
    const a = moves.at(-1);
    const b = moves.at(-2);
    if (a && a[0] === f) continue;
    if (a && b && AXIS[a[0]] === AXIS[f] && AXIS[b[0]] === AXIS[f]) continue;
    moves.push(f + ['', "'", '2'][Math.floor(rnd() * 3)]);
  }
  return moves.join(' ');
}

// Throws on anything that isn't a move, so typed-in scrambles get checked.
export function scrambledState(scramble) {
  const start = solvedCube().map((s) => ({ ...s, home: key(s.p, s.n) }));
  return applyAlg(start, scramble);
}

// Follows the pieces from the buffer. When the buffer piece comes home
// before everything is solved (or a piece is only flipped/twisted in place),
// start a new cycle at the first unsolved piece in letter order.
function memo(state, stickers, ref) {
  const at = new Map(state.map((s) => [key(s.p, s.n), s]));
  const letterAt = new Map(Object.entries(stickers).map(([l, s]) => [key(s.p, s.n), l]));
  const pieceOf = (l) => stickers[l].p.join();
  // The letter whose home is the sticker sitting at letter l's spot.
  const next = (l) => letterAt.get(at.get(key(stickers[l].p, stickers[l].n)).home);
  const letters = Object.keys(stickers);
  const buffer = pieceOf(ref);
  const solved = (piece) => letters.filter((l) => pieceOf(l) === piece).every((l) => next(l) === l);
  const unsolved = new Set(letters.map(pieceOf).filter((p) => p !== buffer && !solved(p)));

  const targets = [];
  for (let l = next(ref); pieceOf(l) !== buffer; l = next(l)) {
    targets.push({ letter: l });
    unsolved.delete(pieceOf(l));
  }
  while (unsolved.size) {
    const piece = unsolved.values().next().value;
    unsolved.delete(piece);
    const start = letters.find((l) => pieceOf(l) === piece);
    targets.push({ letter: start, cycleBreak: true });
    let l = start;
    do {
      l = next(l);
      targets.push({ letter: l });
      unsolved.delete(pieceOf(l));
    } while (pieceOf(l) !== piece);
  }
  return targets;
}

// "(U' M')×3" -> "U' M' U' M' U' M'"
const expand = (alg) =>
  alg
    .replace(/\(([^()]*)\)\s*[×x](\d)/g, (_, body, n) => Array(Number(n)).fill(body).join(' '))
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const edgeRow = Object.fromEntries(bldEdges.map((r) => [r.letter, r]));
const cornerRow = Object.fromEntries(bldCorners.map((r) => [r.letter, r]));

function step(row, core) {
  if (row.special) return { special: row.special, moves: expand(row.special) };
  return {
    setup: row.setup,
    core,
    undo: invertAlg(row.setup),
    moves: [row.setup, core, invertAlg(row.setup)].filter(Boolean).join(' '),
  };
}

// Everything the practice page shows for one scramble.
export function bldPlan(scramble) {
  const state = scrambledState(scramble);
  const edges = memo(state, EDGE, EDGE_REF).map((t, i) => {
    // Every 2nd edge target: C<->W and I<->S, because M2 has flipped the M slice.
    const doLetter = i % 2 === 1 && OPPOSITE[t.letter] ? OPPOSITE[t.letter] : t.letter;
    const row = edgeRow[doLetter];
    return { ...t, doLetter, piece: row.piece, ...step(row, 'M2') };
  });
  const corners = memo(state, CORNER, CORNER_REF).map((t) => {
    const row = cornerRow[t.letter];
    return { ...t, doLetter: t.letter, piece: row.piece, ...step(row, 'swap') };
  });
  const parity = edges.length % 2 === 1;
  const solution = [
    ...edges.map((e) => e.moves),
    parity ? BLD_PARITY[0] : '',
    ...corners.map((c) => c.moves.replace('swap', BLD_CORNER_SWAP)),
  ]
    .filter(Boolean)
    .join(' ');
  return { scramble, state, edges, corners, parity, solution };
}

// ---- Corner cycles and Edge cycles tabs (buffer UFR for corners, UF for edges).
// Same cycle-following as memo() above, with three differences: a piece that
// is in its own place but twisted (or flipped) is left out of the letters and
// reported in `twisted`/`flipped` instead; the break letter can be chosen; and
// edges can be memorised as if UF and UR had swapped places (the odd-parity
// method, see docs/bld-edge-cycles-plan.md 2.4).

const CORNER_BUFFER = 'C';
const EDGE_BUFFER = 'C';
// Edge stickers that trade places in the odd-parity method (UF and UR).
const EDGE_PARITY_SWAP = [['C', 'B'], ['I', 'M']];
const swapTo = new Map(
  EDGE_PARITY_SWAP.flatMap(([a, b]) => [[a, b], [b, a]]).map(([a, b]) => [key(EDGE[a].p, EDGE[a].n), EDGE[b]]),
);

const sameVec = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Rotates vector v about the corner diagonal `axis` by `degrees` (right-hand
// rule), rounded back to a unit normal.
function rotate(v, axis, degrees) {
  const len = Math.hypot(...axis);
  const k = axis.map((a) => a / len);
  const t = (degrees * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const kv = cross(k, v);
  const kd = dot3(k, v);
  return v.map((x, i) => Math.round(x * c + kv[i] * s + k[i] * kd * (1 - c)));
}

// Corner orientation of the piece in place at corner `pos`: 0 if its U/D
// sticker is on the U/D face, +1 if it is turned clockwise seen from outside
// the corner (the U/D sticker has moved on to the next face clockwise), -1 if
// anticlockwise.
export function cornerOrientation(state, pos) {
  const up = [0, pos[1], 0];
  const cw = rotate(up, pos, -120);
  const s = state.find((t) => sameVec(t.p, pos) && (t.colour === 'U' || t.colour === 'D'));
  if (sameVec(s.n, up)) return 0;
  return sameVec(s.n, cw) ? 1 : -1;
}

// The piece name for a set of faces, e.g. UFR or FR, as the letters name it.
// Where a piece has several spellings (UFR, FUR, RUF), the one that starts with
// its U or D face is used (UFR, DFL), then the first in letter order.
const NAME_OF = {};
for (const r of [...bldCorners, ...bldEdges]) {
  const set = [...r.piece].sort().join('');
  if (!NAME_OF[set] || (/^[UD]/.test(r.piece) && !/^[UD]/.test(NAME_OF[set]))) NAME_OF[set] = r.piece;
}
export const pieceName = (pos) =>
  NAME_OF[Object.entries(NORMAL)
    .filter(([, n]) => pos.some((v, i) => v && n[i] === v))
    .map(([f]) => f)
    .sort()
    .join('')];

// The shared engine. `stickers` maps letters to solved stickers, `ref` is the
// buffer letter. Returns the targets in order and the pieces found in place
// but not solved (twisted or flipped).
function cycleTargets(state, stickers, ref, { breakLetter } = {}) {
  const at = new Map(state.map((s) => [key(s.p, s.n), s]));
  const letterAt = new Map(Object.entries(stickers).map(([l, s]) => [key(s.p, s.n), l]));
  const pieceOf = (l) => stickers[l].p.join();
  const next = (l) => letterAt.get(at.get(key(stickers[l].p, stickers[l].n)).home);
  const letters = Object.keys(stickers);
  const lettersOf = (piece) => letters.filter((l) => pieceOf(l) === piece);
  const pieces = [...new Set(letters.map(pieceOf))];
  const buffer = pieceOf(ref);
  const solved = (piece) => lettersOf(piece).every((l) => next(l) === l);
  const inPlace = (piece) => lettersOf(piece).every((l) => pieceOf(next(l)) === piece);
  const twisted = pieces.filter((p) => inPlace(p) && !solved(p));
  const unsolved = new Set(pieces.filter((p) => p !== buffer && !solved(p) && !twisted.includes(p)));

  const targets = [];
  for (let l = next(ref); pieceOf(l) !== buffer; l = next(l)) {
    targets.push({ letter: l });
    unsolved.delete(pieceOf(l));
  }
  let first = true;
  while (unsolved.size) {
    const piece = unsolved.values().next().value;
    unsolved.delete(piece);
    const start = first && breakLetter ? breakLetter : lettersOf(piece)[0];
    first = false;
    targets.push({ letter: start, cycleBreak: true });
    let l = start;
    do {
      l = next(l);
      targets.push({ letter: l });
      unsolved.delete(pieceOf(l));
    } while (pieceOf(l) !== piece);
  }
  return { targets, twisted };
}

// Letters of the pieces on a state, turned into pairs for the 3-cycle tables.
function withPairs(targets) {
  const pairs = [];
  for (let i = 0; i < targets.length; i += 2) {
    pairs.push({ first: targets[i].letter, second: targets[i + 1]?.letter ?? null });
  }
  return pairs;
}

// Corner cycles: { letters, pairs, twisted: [{ piece, direction }], parity }.
// `twisted` includes the buffer UFR when it is twisted in place.
export function cornerCycles(state, { breakLetter } = {}) {
  const { targets, twisted } = cycleTargets(state, CORNER, CORNER_BUFFER, { breakLetter });
  const pos = (p) => p.split(',').map(Number);
  return {
    letters: targets,
    pairs: withPairs(targets),
    twisted: twisted.map((p) => {
      const o = cornerOrientation(state, pos(p));
      return { piece: pieceName(pos(p)), direction: o === 1 ? 'clockwise' : 'anticlockwise' };
    }),
    parity: targets.length % 2 === 1,
  };
}

// Edge cycles. `swap` memorises the edges as if UF and UR had swapped places,
// which is the method for an odd number of corner letters.
export function edgeCycles(state, { swap = false, breakLetter } = {}) {
  const at = swap
    ? state.map((s) => {
        const to = swapTo.get(key(s.p, s.n));
        return to ? { ...s, p: to.p, n: to.n } : s;
      })
    : state;
  const { targets, twisted } = cycleTargets(at, EDGE, EDGE_BUFFER, { breakLetter });
  return {
    letters: targets,
    pairs: withPairs(targets),
    flipped: twisted.map((p) => pieceName(p.split(',').map(Number))),
    parity: targets.length % 2 === 1,
  };
}
