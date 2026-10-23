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
// The hidden left and back faces, drawn as "mirrors" floating out beyond the cube (as cubing.js's
// player does), so the back-left and back-right sides can be read too. Seen from the front they are
// mirror images, like looking at the back of a sticker through glass.
const MIRRORS = [
  { key: 'L', normal: [-1, 0, 0], a: [0, 0, 1], b: [0, 1, 0] },
  { key: 'B', normal: [0, 0, -1], a: [1, 0, 0], b: [0, 1, 0] },
];

// stickers: the simulator's sticker list. Returns an SVG string.
export function cube3dSvg(stickers, { palette = COLOURS, label = 'Cube', mirrors = true } = {}) {
  const H = 1.5; // half the cube's width in cubie units
  const STICKER = 0.43; // half a sticker's width (cubies are 1 wide, so 0.07 of black between)
  const polys = [];
  const all = []; // every projected point, for the picture's size
  const poly = (pts, attrs) => {
    all.push(...pts);
    polys.push(`<polygon points="${pts.map((p) => p.map((n) => n.toFixed(3)).join(',')).join(' ')}" ${attrs}/>`);
  };
  // the mirrors first, so the cube is drawn over them
  if (mirrors) {
    const OUT = H + 2.4; // how far out the mirror planes float
    for (const face of MIRRORS) {
      for (const s of stickers) {
        if (!same(s.n, face.normal)) continue;
        const c = s.p.map((v, i) => (face.normal[i] ? face.normal[i] * OUT : v));
        const corner = (da, db) => project(c.map((v, i) => v + face.a[i] * da + face.b[i] * db));
        poly([corner(-STICKER, -STICKER), corner(STICKER, -STICKER), corner(STICKER, STICKER), corner(-STICKER, STICKER)],
          `fill="${palette[s.colour]}" fill-opacity="0.55" stroke="${BODY}" stroke-opacity="0.35" stroke-width="0.04" stroke-linejoin="round"`);
      }
    }
  }
  // the body: the outline of the three faces
  const body = [
    [-H, H, -H], [H, H, -H], [H, -H, -H], [H, -H, H], [-H, -H, H], [-H, H, H],
  ].map(project);
  poly(body, `fill="${BODY}" stroke="${BODY}" stroke-width="0.12" stroke-linejoin="round"`);
  for (const face of FACES) {
    for (const s of stickers) {
      if (!same(s.n, face.normal)) continue;
      // centre of the sticker on the cube's surface
      const c = s.p.map((v, i) => (face.normal[i] ? face.normal[i] * H : v));
      const corner = (da, db) => project(c.map((v, i) => v + face.a[i] * da + face.b[i] * db));
      const pts = [corner(-STICKER, -STICKER), corner(STICKER, -STICKER), corner(STICKER, STICKER), corner(-STICKER, STICKER)];
      poly(pts, `fill="${shade(palette[s.colour], SHADE[face.key])}" stroke="rgba(0,0,0,0.25)" stroke-width="0.03" stroke-linejoin="round"`);
    }
  }
  const pad = 0.15;
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  const w = Math.max(...xs) + pad - x0;
  const h = Math.max(...ys) + pad - y0;
  return `<svg class="cube-3d${mirrors ? ' with-mirrors' : ''}" viewBox="${x0.toFixed(3)} ${y0.toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}" role="img" aria-label="${label}">${polys.join('')}</svg>`;
}

// The case an algorithm solves, optionally with a turn of the top layer done afterwards (as you might
// find it in a solve), as a still 3D picture.
export function case3d(alg, { hold, turn = '', palette, label, mirrors } = {}) {
  let st = caseState(alg, hold);
  if (turn) st = applyAlg(st, turn);
  const wrap = document.createElement('div');
  wrap.className = 'cube-3d-wrap';
  wrap.innerHTML = cube3dSvg(st, { palette, label, mirrors });
  return wrap;
}
