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

// One frame of a layer turn: every cubie drawn as a small cube (black faces, stickers on its outer
// faces), the turning layer rotated by `turn.angle` about `turn.axis`, faces painted back to front.
// Turned-away faces are skipped; with convex cubies on a grid that ordering is enough.
const NORMALS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const rotAxis = (axis, t) => {
  const c = Math.cos(t), s = Math.sin(t);
  if (axis === 0) return [[1, 0, 0], [0, c, -s], [0, s, c]];
  if (axis === 1) return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
};
function drawTurning(stickers, view, palette, label, turn) {
  const light = [0.35, 0.8, 0.5];
  const at = new Map(stickers.map((s) => [`${s.p.join()}|${s.n.join()}`, s]));
  const spin = rotAxis(turn.axis, turn.angle);
  const faces = [];
  for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) {
    if (!x && !y && !z) continue;
    const p = [x, y, z];
    const m = turn.layers.includes(p[turn.axis]) ? mul(view, spin) : view;
    for (const n of NORMALS) {
      const vn = apply(m, n);
      if (vn[2] <= 0.001) continue;
      const [a, b] = inPlane(n);
      const c = p.map((v, i) => v + n[i] * 0.5);
      const quad = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]].map(([da, db]) => apply(m, c.map((v, i) => v + a[i] * da + b[i] * db)));
      const depth = apply(m, c)[2];
      const s = at.get(`${p.join()}|${n.join()}`);
      const k = 0.84 + 0.16 * Math.max(0, vn[0] * light[0] + vn[1] * light[1] + vn[2] * light[2]);
      faces.push({ depth, body: quad(0.5), sticker: s ? { pts: quad(STICKER), fill: shade(palette[s.colour], k) } : null });
    }
  }
  faces.sort((f, g) => f.depth - g.depth);
  const pts = (q) => q.map(([px, py]) => `${px.toFixed(3)},${(-py).toFixed(3)}`).join(' ');
  const polys = faces.map((f) => `<polygon points="${pts(f.body)}" fill="${BODY}" stroke="${BODY}" stroke-width="0.04" stroke-linejoin="round"/>`
    + (f.sticker ? `<polygon points="${pts(f.sticker.pts)}" fill="${f.sticker.fill}" stroke="rgba(0,0,0,0.25)" stroke-width="0.03" stroke-linejoin="round"/>` : ''));
  const R = 2.75;
  return `<svg class="cube-rot-svg" viewBox="${-R} ${-R} ${2 * R} ${2 * R}" role="img" aria-label="${label}">${polys.join('')}</svg>`;
}

// Which layers a move turns, about which axis, and by how much (radians, right-hand rule), as in
// js/cube-sim.js: one turn there is a quarter turn of `dir` quarter-turns about the positive axis.
const MOVE = {
  R: [0, [1], -1], L: [0, [-1], 1], M: [0, [0], 1], r: [0, [0, 1], -1], l: [0, [-1, 0], 1], x: [0, [-1, 0, 1], -1],
  U: [1, [1], -1], D: [1, [-1], 1], E: [1, [0], 1], u: [1, [0, 1], -1], d: [1, [-1, 0], 1], y: [1, [-1, 0, 1], -1],
  F: [2, [1], -1], B: [2, [-1], 1], S: [2, [0], -1], f: [2, [0, 1], -1], b: [2, [-1, 0], 1], z: [2, [-1, 0, 1], -1],
};
function turnOf(move) {
  const m = move.match(/^([RLUDFBMESxyzrludfb])(w?)(\d*)('?)$/);
  if (!m) return null;
  const [, f, wide, count, prime] = m;
  const [axis, layers, dir] = MOVE[wide ? f.toLowerCase() : f];
  const amount = (count ? Number(count) : 1) * (prime ? -1 : 1);
  return { axis, layers, angle: dir * amount * (Math.PI / 2) };
}

// stickers: the simulator's sticker list; palette: home face -> colour.
// Returns { element, update(stickers), reset(), animate(from, to, move, ms) }.
export function rotatableCube(stickers, { palette, label = 'Cube; drag to turn it' } = {}) {
  let view = START;
  let current = stickers;
  const wrap = document.createElement('div');
  wrap.className = 'cube-rot';
  const stage = document.createElement('div');
  stage.className = 'cube-rot-stage';
  wrap.appendChild(stage);
  let turning = false; // while a move is animating, its frames do the drawing
  const render = () => { if (!turning) stage.innerHTML = draw(current, view, palette, label); };

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
    // Shows one move turning, from the stickers before it (`from`) to the stickers after it (`to`,
    // from the simulator). Resolves when done. Dragging still works during the turn.
    animate(from, to, move, ms = 350) {
      const t = turnOf(move);
      if (!t || ms <= 0) { current = to; render(); return Promise.resolve(); }
      return new Promise((resolve) => {
        turning = true;
        const t0 = performance.now();
        const frame = (now) => {
          const f = Math.min(1, (now - t0) / ms);
          const ease = f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f);
          if (f < 1) {
            stage.innerHTML = drawTurning(from, view, palette, label, { ...t, angle: t.angle * ease });
            requestAnimationFrame(frame);
          } else { turning = false; current = to; render(); resolve(); }
        };
        requestAnimationFrame(frame);
      });
    },
  };
}
