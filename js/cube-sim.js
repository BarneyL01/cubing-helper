import { invertAlg } from './algs.js';

// Minimal 3x3 sticker model. Each sticker is a position + outward normal in
// cube coordinates (x = right, y = up, z = front), so every move is a 90°
// rotation of the stickers in one or more layers. A 2x2 is simulated as the
// corners of a 3x3 — outer-layer moves act on corners identically.

// dir is the rotation for one clockwise turn of that face, in quarter turns
// about the positive axis (right-hand rule): -1 = clockwise seen from +axis.
const MOVES = {
  R: { axis: 0, layers: [1], dir: -1 },
  L: { axis: 0, layers: [-1], dir: 1 },
  M: { axis: 0, layers: [0], dir: 1 },
  r: { axis: 0, layers: [0, 1], dir: -1 },
  l: { axis: 0, layers: [-1, 0], dir: 1 },
  x: { axis: 0, layers: [-1, 0, 1], dir: -1 },
  U: { axis: 1, layers: [1], dir: -1 },
  D: { axis: 1, layers: [-1], dir: 1 },
  E: { axis: 1, layers: [0], dir: 1 },
  u: { axis: 1, layers: [0, 1], dir: -1 },
  d: { axis: 1, layers: [-1, 0], dir: 1 },
  y: { axis: 1, layers: [-1, 0, 1], dir: -1 },
  F: { axis: 2, layers: [1], dir: -1 },
  B: { axis: 2, layers: [-1], dir: 1 },
  S: { axis: 2, layers: [0], dir: -1 },
  f: { axis: 2, layers: [0, 1], dir: -1 },
  b: { axis: 2, layers: [-1, 0], dir: 1 },
  z: { axis: 2, layers: [-1, 0, 1], dir: -1 },
};

const FACE_BY_NORMAL = { '0,1,0': 'U', '0,-1,0': 'D', '0,0,1': 'F', '0,0,-1': 'B', '1,0,0': 'R', '-1,0,0': 'L' };

export function faceOf(normal) {
  return FACE_BY_NORMAL[normal.join(',')];
}

// One +90° right-hand rotation of a vector about the given axis.
function quarter([x, y, z], axis) {
  if (axis === 0) return [x, -z, y];
  if (axis === 1) return [z, y, -x];
  return [-y, x, z];
}

export function solvedCube() {
  const stickers = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        const p = [x, y, z];
        p.forEach((v, axis) => {
          if (v === 0) return;
          const n = [0, 0, 0];
          n[axis] = v;
          stickers.push({ p, n, colour: faceOf(n) });
        });
      }
    }
  }
  return stickers;
}

function parseMove(token) {
  const match = token.match(/^([RLUDFBMESxyzrludfb])(w?)(\d*)('?)$/);
  if (!match) throw new Error(`Unknown move: ${token}`);
  const [, face, wide, count, prime] = match;
  const move = MOVES[wide ? face.toLowerCase() : face];
  const amount = (count ? parseInt(count, 10) : 1) * (prime ? -1 : 1);
  return { ...move, turns: (((move.dir * amount) % 4) + 4) % 4 };
}

export function applyAlg(stickers, alg) {
  let state = stickers;
  for (const token of alg.replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean)) {
    const { axis, layers, turns } = parseMove(token);
    state = state.map((s) => {
      if (!layers.includes(s.p[axis])) return s;
      let { p, n } = s;
      for (let i = 0; i < turns; i++) {
        p = quarter(p, axis);
        n = quarter(n, axis);
      }
      return { ...s, p, n };
    });
  }
  return state;
}

const ROTATIONS = ['', 'x', 'x2', "x'", 'z', "z'"].flatMap((a) =>
  ['', 'y', 'y2', "y'"].map((b) => `${a} ${b}`.trim()),
);

const centresHome = (stickers) =>
  stickers.every((s) => s.p.filter((v) => v !== 0).length !== 1 || s.colour === faceOf(s.n));

// How the cube is held when a case starts. Algorithms that turn the whole
// cube (x/y/z or wide moves like d) end with the cube held differently, so
// the start is found by trying every hold until the centres come out in
// their normal places. Slice-only algorithms (e.g. Roux's M U2 M) keep the
// default hold, since for them the corners — not the centres — set the hold.
export function startHold(alg) {
  if (!/(^|\s)([xyz]|[rludfb]|\w+w)/.test(alg)) return '';
  const inverse = invertAlg(alg);
  return ROTATIONS.find((r) => centresHome(applyAlg(applyAlg(solvedCube(), r), inverse))) ?? '';
}

// The position a case starts from: the algorithm's inverse applied to a
// solved cube, so running the algorithm itself solves it. `hold` is a
// whole-cube rotation for cases you reach already holding the cube turned.
export function caseState(alg, hold = startHold(alg)) {
  return applyAlg(applyAlg(solvedCube(), hold), invertAlg(alg));
}

export function isSolved(stickers) {
  return stickers.every((s) => s.colour === faceOf(s.n));
}
