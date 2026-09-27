import { caseState } from './cube-sim.js';

// Yellow on top, green in front (the usual CFOP hold).
const COLOURS = { U: '#ffd500', D: '#ffffff', F: '#009b48', B: '#0046ad', R: '#ff5800', L: '#b71234' };
const NOT_TOP = '#6b7280';
const IGNORED = '#d1d5db';
const STROKE = '#1f2937';

// Each view looks straight at one layer with the front face at the bottom of
// the picture. The bottom (D) view is the cube flipped over sideways (z2),
// which keeps the front at the bottom and swaps left/right.
const VIEWS = {
  U: { normal: [0, 1, 0], right: [1, 0, 0], down: [0, 0, 1], label: 'Top' },
  D: { normal: [0, -1, 0], right: [-1, 0, 0], down: [0, 0, 1], label: 'Bottom' },
};

const CELL = 10;
const STRIP = 3;
const GAP = 1.5;

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const same = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
const neg = (v) => v.map((x) => -x);
const pieceType = (p) => p.filter((v) => v !== 0).length; // 3 corner, 2 edge, 1 centre

// stickering: 'full' shows real colours; 'oll' shows only whether each
// sticker is the top colour; 'cmll' is 'oll' for corners with edges greyed
// out, since corner-only steps don't care about them; 'eo' (Roux LSE) greys
// out corners and shows which stickers are a top/bottom colour, which is how
// edge orientation is judged.
function fill(sticker, top, stickering) {
  if (stickering === 'full') return COLOURS[sticker.colour];
  if (stickering === 'eo') {
    if (pieceType(sticker.p) === 3) return IGNORED;
    return sticker.colour === 'U' || sticker.colour === 'D' ? COLOURS[sticker.colour] : NOT_TOP;
  }
  if (stickering === 'cmll' && pieceType(sticker.p) === 2) return IGNORED;
  return sticker.colour === top ? COLOURS[top] : NOT_TOP;
}

function layerSvg(state, viewKey, size, stickering) {
  const view = VIEWS[viewKey];
  const top = viewKey;
  const toCell = size === 3 ? (v) => v + 1 : (v) => (v + 1) / 2;
  const span = size * CELL;
  const rects = [];

  for (const s of state) {
    if (dot(s.p, view.normal) !== 1) continue;
    if (size === 2 && pieceType(s.p) !== 3) continue;
    const col = toCell(dot(s.p, view.right));
    const row = toCell(dot(s.p, view.down));
    let x;
    let y;
    let w = CELL - 1;
    let h = CELL - 1;
    if (same(s.n, view.normal)) {
      x = col * CELL + 0.5;
      y = row * CELL + 0.5;
    } else if (same(s.n, view.down)) {
      x = col * CELL + 0.5;
      y = span + GAP;
      h = STRIP;
    } else if (same(s.n, neg(view.down))) {
      x = col * CELL + 0.5;
      y = -GAP - STRIP;
      h = STRIP;
    } else if (same(s.n, view.right)) {
      x = span + GAP;
      y = row * CELL + 0.5;
      w = STRIP;
    } else {
      x = -GAP - STRIP;
      y = row * CELL + 0.5;
      w = STRIP;
    }
    rects.push(
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${fill(s, top, stickering)}" stroke="${STROKE}" stroke-width="0.4"/>`,
    );
  }

  const pad = GAP + STRIP + 0.5;
  const box = span + pad * 2;
  return `<svg viewBox="${-pad} ${-pad} ${box} ${box}" role="img" aria-label="${view.label} layer of the case">${rects.join('')}</svg>`;
}

// A picture of the position the algorithm solves, computed by applying the
// algorithm's inverse to a solved cube — so it can't disagree with the
// algorithm text.
export function caseDiagram(alg, { size = 3, stickering = 'full', views = ['U'] } = {}) {
  const state = caseState(alg);
  const wrapper = document.createElement('div');
  wrapper.className = 'case-diagram';
  wrapper.innerHTML = views
    .map((v) => {
      const caption = views.length > 1 ? `<figcaption>${VIEWS[v].label}</figcaption>` : '';
      return `<figure>${layerSvg(state, v, size, stickering)}${caption}</figure>`;
    })
    .join('');
  return wrapper;
}
