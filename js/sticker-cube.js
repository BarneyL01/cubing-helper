// A see-through cube for the 3-style pictures (front face square, back face drawn up and to the right), with
// single corner stickers drawn as squares on their own face, so a picture shows which sticker (not just which
// corner) a letter is. Faces you cannot see from the front (left, back, bottom) are drawn dashed and lighter.
const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const AX = { R: [0, 1], L: [0, -1], U: [1, 1], D: [1, -1], F: [2, 1], B: [2, -1] };
const f = (v) => v.toFixed(1);

export function makeCube(cx = 124, cy = 100, s = 46) {
  const proj = ([x, y, z]) => [cx + s * x - 0.7 * s * z, cy - s * y + 0.35 * s * z];
  const corner = (name) => { const p = [0, 0, 0]; for (const c of name) p[AX[c][0]] = AX[c][1]; return p; };
  // the four corners of a sticker square and its middle, in 3D
  const quad3 = (letter) => {
    const name = SPEFFZ[letter];
    const P = corner(name);
    const [k] = AX[name[0]];
    const [i, j] = [0, 1, 2].filter((a) => a !== k);
    const a = 2 / 3;
    const step = (v, ax) => { const q = [...v]; q[ax] -= Math.sign(P[ax]) * a; return q; };
    const p1 = step(P, i), p2 = step(p1, j), p3 = step(P, j);
    const mid = [...P];
    mid[i] -= (Math.sign(P[i]) * a) / 2;
    mid[j] -= (Math.sign(P[j]) * a) / 2;
    return { pts: [P, p1, p2, p3], mid, face: name[0] };
  };
  const hiddenFace = (face) => 'LBD'.includes(face);
  return {
    proj,
    // screen point of a corner (by name such as 'UFR') or of a sticker's middle (by letter)
    point: (x) => (x.length === 1 ? proj(quad3(x).mid) : proj(corner(x))),
    edges() {
      const names = ['UFR', 'UFL', 'UBL', 'UBR', 'DFR', 'DFL', 'DBL', 'DBR'];
      const out = [];
      for (const a of names) for (const b of names) {
        if (a >= b || [0, 1, 2].filter((k) => a[k] !== b[k]).length !== 1) continue;
        const [p, q] = [proj(corner(a)), proj(corner(b))];
        out.push(`<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" class="cd-edge${a === 'DBL' || b === 'DBL' ? ' cd-hidden' : ''}"/>`);
      }
      return out.join('');
    },
    // a sticker square; cls picks its colour
    sticker(letter, cls) {
      const q = quad3(letter);
      const pts = q.pts.map((p) => proj(p).map(f).join(',')).join(' ');
      return `<polygon points="${pts}" class="sq ${cls}${hiddenFace(q.face) ? ' sq-hidden' : ''}"/>`;
    },
    // where to put a sticker's label: outside the cube, beside its corner
    labelAt(letter) {
      const name = SPEFFZ[letter];
      const [x, y] = proj(corner(name));
      const right = name.includes('R');
      return { x: x + (right ? 10 : -10), y: y + (name.includes('U') ? -10 : 19), anchor: right ? 'start' : 'end' };
    },
  };
}
