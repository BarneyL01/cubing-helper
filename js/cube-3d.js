// A still, 3D-looking picture of a cube, drawn as SVG by our own code (no cubing.js, no WebGL):
// the top, front and right faces seen from above the front-right corner, with each face shaded a
// little differently so it reads as a solid. The position comes from the simulator, as everywhere
// else: the algorithm's inverse applied to a solved cube (plus an optional top-layer turn after).
import { applyAlg, caseState } from './cube-sim.js';

// Yellow on top, green in front (the usual CFOP hold).
const COLOURS = { U: '#ffd500', D: '#ffffff', F: '#009b48', B: '#0046ad', R: '#ff5800', L: '#b71234' };
const BODY = '#111827';
const SHADE = { U: 1, F: 0.86, R: 0.72 }; // light from above, slightly from the front

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
// isometric projection, looking down at the front-right corner: +x (R), +y (U) and +z (F) face the viewer
const project = ([x, y, z]) => [(x - z) * COS, (x + z) * SIN - y];

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k));
  return `rgb(${c.join(',')})`;
}

// The three visible faces: normal, and the two in-plane axes for a sticker's corners.
const FACES = [
  { key: 'U', normal: [0, 1, 0], a: [1, 0, 0], b: [0, 0, 1] },
  { key: 'F', normal: [0, 0, 1], a: [1, 0, 0], b: [0, 1, 0] },
  { key: 'R', normal: [1, 0, 0], a: [0, 0, 1], b: [0, 1, 0] },
];
const same = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

// stickers: the simulator's sticker list. Returns an SVG string.
export function cube3dSvg(stickers, { palette = COLOURS, label = 'Cube' } = {}) {
  const H = 1.5; // half the cube's width in cubie units
  const STICKER = 0.43; // half a sticker's width (cubies are 1 wide, so 0.07 of black between)
  const polys = [];
  // the body: the outline of the three faces
  const body = [
    [-H, H, -H], [H, H, -H], [H, -H, -H], [H, -H, H], [-H, -H, H], [-H, H, H],
  ].map(project);
  polys.push(`<polygon points="${body.map((p) => p.map((n) => n.toFixed(3)).join(',')).join(' ')}" fill="${BODY}" stroke="${BODY}" stroke-width="0.12" stroke-linejoin="round"/>`);
  for (const face of FACES) {
    for (const s of stickers) {
      if (!same(s.n, face.normal)) continue;
      // centre of the sticker on the cube's surface
      const c = s.p.map((v, i) => (face.normal[i] ? face.normal[i] * H : v));
      const corner = (da, db) => project(c.map((v, i) => v + face.a[i] * da + face.b[i] * db));
      const pts = [corner(-STICKER, -STICKER), corner(STICKER, -STICKER), corner(STICKER, STICKER), corner(-STICKER, STICKER)];
      polys.push(`<polygon points="${pts.map((p) => p.map((n) => n.toFixed(3)).join(',')).join(' ')}" fill="${shade(palette[s.colour], SHADE[face.key])}" stroke="rgba(0,0,0,0.25)" stroke-width="0.03" stroke-linejoin="round"/>`);
    }
  }
  const w = 2 * H * COS + 0.15;
  const half = H + 2 * H * SIN + 0.15;
  const top = -half;
  const h = 2 * half;
  return `<svg class="cube-3d" viewBox="${(-w).toFixed(3)} ${top.toFixed(3)} ${(2 * w).toFixed(3)} ${h.toFixed(3)}" role="img" aria-label="${label}">${polys.join('')}</svg>`;
}

// The case an algorithm solves, optionally with a turn of the top layer done afterwards (as you might
// find it in a solve), as a still 3D picture.
export function case3d(alg, { hold, turn = '', palette, label } = {}) {
  let st = caseState(alg, hold);
  if (turn) st = applyAlg(st, turn);
  const wrap = document.createElement('div');
  wrap.className = 'cube-3d-wrap';
  wrap.innerHTML = cube3dSvg(st, { palette, label });
  return wrap;
}
