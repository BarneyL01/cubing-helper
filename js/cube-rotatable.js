// A 3D cube you can turn round by dragging (or with buttons), drawn as SVG by our own code
// (no cubing.js, no WebGL). Only the whole cube turns, to look at it from any side; the
// stickers come from the simulator, as everywhere else. Orthographic view: the faces turned
// towards the viewer never overlap on a cube, so no depth sorting is needed.
const BODY = '#111827';
const H = 1.5; // half the cube's width in cubie units
const STICKER = 0.43; // half a sticker's width

// 3x3 rotation matrices, rows.
const mul = (a, b) => a.map((r) => [0, 1, 2].map((j) => r[0] * b[0][j] + r[1] * b[1][j] + r[2] * b[2][j]));
const apply = (m, v) => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const rotX = (t) => [[1, 0, 0], [0, Math.cos(t), -Math.sin(t)], [0, Math.sin(t), Math.cos(t)]];
const rotY = (t) => [[Math.cos(t), 0, Math.sin(t)], [0, 1, 0], [-Math.sin(t), 0, Math.cos(t)]];
// Start: looking down at the front-right corner (top, front and right faces showing).
const START = mul(rotX(Math.atan(1 / Math.SQRT2)), rotY(-Math.PI / 4));
const AXES = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k)).join(',')})`;
}

// In-plane axes of a face with outward normal n.
function inPlane(n) {
  const others = AXES.filter((a) => !a.some((v, i) => v && n[i]));
  return others;
}

function draw(stickers, view, palette, label) {
  const light = [0.35, 0.8, 0.5];
  const polys = [];
  const pt = (v) => {
    const [x, y] = apply(view, v);
    return `${x.toFixed(3)},${(-y).toFixed(3)}`;
  };
  // the six faces' black backing, then stickers, only for faces turned towards the viewer
  const normals = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const facing = new Map();
  for (const n of normals) {
    const z = apply(view, n)[2];
    if (z <= 0.001) continue;
    facing.set(n.join(), apply(view, n));
    const [a, b] = inPlane(n);
    const c = n.map((v) => v * H);
    const corner = (da, db) => c.map((v, i) => v + a[i] * da + b[i] * db);
    polys.push(`<polygon points="${[corner(-H, -H), corner(H, -H), corner(H, H), corner(-H, H)].map(pt).join(' ')}" fill="${BODY}" stroke="${BODY}" stroke-width="0.1" stroke-linejoin="round"/>`);
  }
  for (const s of stickers) {
    const vn = facing.get(s.n.join());
    if (!vn) continue;
    const k = 0.84 + 0.16 * Math.max(0, vn[0] * light[0] + vn[1] * light[1] + vn[2] * light[2]);
    const [a, b] = inPlane(s.n);
    const c = s.p.map((v, i) => (s.n[i] ? s.n[i] * H : v));
    const corner = (da, db) => c.map((v, i) => v + a[i] * da + b[i] * db);
    polys.push(`<polygon points="${[corner(-STICKER, -STICKER), corner(STICKER, -STICKER), corner(STICKER, STICKER), corner(-STICKER, STICKER)].map(pt).join(' ')}" fill="${shade(palette[s.colour], k)}" stroke="rgba(0,0,0,0.25)" stroke-width="0.03" stroke-linejoin="round"/>`);
  }
  const R = 2.75; // covers the cube from any side (half its diagonal is 2.6)
  return `<svg class="cube-rot-svg" viewBox="${-R} ${-R} ${2 * R} ${2 * R}" role="img" aria-label="${label}">${polys.join('')}</svg>`;
}

// stickers: the simulator's sticker list; palette: home face -> colour.
// Returns { element, update(stickers), reset() }.
export function rotatableCube(stickers, { palette, label = 'Cube; drag to turn it' } = {}) {
  let view = START;
  let current = stickers;
  const wrap = document.createElement('div');
  wrap.className = 'cube-rot';
  const stage = document.createElement('div');
  stage.className = 'cube-rot-stage';
  wrap.appendChild(stage);
  const render = () => { stage.innerHTML = draw(current, view, palette, label); };

  // drag: sideways turns about the screen's up axis, up/down about its sideways axis
  let last = null;
  stage.addEventListener('pointerdown', (e) => {
    last = [e.clientX, e.clientY];
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!last) return;
    const size = stage.getBoundingClientRect().width || 300;
    const dx = ((e.clientX - last[0]) / size) * Math.PI * 1.2;
    const dy = ((e.clientY - last[1]) / size) * Math.PI * 1.2;
    last = [e.clientX, e.clientY];
    view = mul(rotX(dy), mul(rotY(dx), view));
    render();
  });
  const end = () => { last = null; };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  // buttons: whole-cube turns about the cube's own axes, as you would turn it in your hand
  const bar = document.createElement('div');
  bar.className = 'cube-rot-buttons';
  const button = (text, title, fn) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.title = title;
    b.addEventListener('click', () => { fn(); render(); });
    bar.appendChild(b);
  };
  // y turns the cube like U: the front face goes to the left
  button("y'", "Turn the cube a quarter: front face to the right (y')", () => { view = mul(view, rotY(Math.PI / 2)); });
  button('y', 'Turn the cube a quarter: front face to the left (y)', () => { view = mul(view, rotY(-Math.PI / 2)); });
  button('x2', 'Turn the cube upside down (x2)', () => { view = mul(view, rotX(Math.PI)); });
  button('Reset', 'Back to the starting view', () => { view = START; });
  wrap.appendChild(bar);
  render();
  return {
    element: wrap,
    update(next) { current = next; render(); },
    reset() { view = START; render(); },
  };
}
