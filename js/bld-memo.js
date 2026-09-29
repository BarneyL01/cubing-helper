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
