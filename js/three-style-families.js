// "Which base? Read it from the letters": the four families of 3-style bases, as a table, rules and one picture
// per family showing why its letters belong together. Used on the By base page and on 3-Style solves.
// The positions in the pictures were checked by simulation (log/2026-11-06-3style-families.md): R D R' swaps the
// B position with O (D), H (D') or L (D2); R' D R swaps the buffer's position with G (D), P (D') or S (D2);
// R U R' swaps P's position with the buffer's; U' brings C into B and D into C, U2 brings A into C; D brings L,
// D' brings T, D2 brings H into P's position.

const esc = (s) => s.replace(/'/g, '′');
// Corner places, drawn on a see-through cube (front face square, back face up and to the right).
const XYZ = { UFR: [1, 1, 1], UFL: [-1, 1, 1], UBL: [-1, 1, -1], UBR: [1, 1, -1], DFR: [1, -1, 1], DFL: [-1, -1, 1], DBL: [-1, -1, -1], DBR: [1, -1, -1] };
const pt = (n) => { const [x, y, z] = XYZ[n]; return [124 + 46 * x - 32 * z, 100 - 46 * y + 16 * z]; };
const f = (v) => v.toFixed(1);

function arrow(from, to, cls, bend) {
  const [p, q] = [pt(from), pt(to)];
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
  const ctrl = [m[0] - ((q[1] - p[1]) / l) * bend, m[1] + ((q[0] - p[0]) / l) * bend];
  const trim = (a, b, r) => { const ux = b[0] - a[0], uy = b[1] - a[1], d = Math.hypot(ux, uy); return [a[0] + (ux / d) * r, a[1] + (uy / d) * r]; };
  const s = trim(p, ctrl, 8), t = trim(q, ctrl, 10);
  const ang = Math.atan2(t[1] - ctrl[1], t[0] - ctrl[0]);
  const head = [t, [t[0] - 8 * Math.cos(ang - 0.45), t[1] - 8 * Math.sin(ang - 0.45)], [t[0] - 8 * Math.cos(ang + 0.45), t[1] - 8 * Math.sin(ang + 0.45)]];
  return `<path d="M${f(s[0])} ${f(s[1])} Q${f(ctrl[0])} ${f(ctrl[1])} ${f(t[0])} ${f(t[1])}" class="fd-${cls}"/><polygon points="${head.map((h) => h.map(f).join(',')).join(' ')}" class="fd-head-${cls}"/>`;
}

// spec: { slot: [place, label], outs: [[place, label]], inters: [[place, label]], buffer: place }
function familyDiagram(spec) {
  const names = Object.keys(XYZ);
  const edges = [];
  for (const a of names) for (const b of names) {
    if (a >= b) continue;
    if ([0, 1, 2].filter((k) => a[k] !== b[k]).length !== 1) continue;
    const [p, q] = [pt(a), pt(b)];
    edges.push(`<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" class="cd-edge${a === 'DBL' || b === 'DBL' ? ' cd-hidden' : ''}"/>`);
  }
  const arrows = [
    ...spec.outs.map(([p], i) => arrow(p, spec.slot[0], 'ins', [14, -14, 22][i % 3])),
    ...spec.inters.map(([p], i) => arrow(p, spec.slot[0], 'int', [-16, 16][i % 2])),
  ];
  const labels = new Map([[spec.slot[0], spec.slot[1]], ...spec.outs, ...spec.inters]);
  const dots = names.map((n) => {
    const [x, y] = pt(n);
    const lab = labels.get(n);
    const cls = n === spec.buffer ? 'fd-buffer' : n === spec.slot[0] ? 'fd-slot' : lab ? 'fd-on' : 'cd-off';
    let out = `<circle cx="${f(x)}" cy="${f(y)}" r="${lab ? 6 : 3}" class="${cls}"/>`;
    if (lab) {
      const right = n.includes('R');
      out += `<text x="${f(x + (right ? 10 : -10))}" y="${f(y + (n[0] === 'U' ? -10 : 19))}" text-anchor="${right ? 'start' : 'end'}" class="fd-label">${esc(lab)}</text>`;
    }
    return out;
  }).join('');
  return `<svg viewBox="0 0 250 190" class="family-diagram" role="img" aria-label="${spec.aria}">${edges.join('')}${arrows.join('')}${dots}</svg>`;
}

const FAMILIES = [
  {
    name: 'Orozco: B and O, H or L',
    spec: { slot: ['UBR', 'B'], buffer: 'UFR', outs: [['DBR', "O: D"], ['DBL', "H: D'"], ['DFL', 'L: D2']], inters: [['UFR', "C: U'"]],
      aria: 'B position, with O, H and L below and the buffer next to it' },
    text: "R D R' swaps the B position with one bottom position: O with D, H with D', L with D2 (solid arrows). U' brings the buffer into the B position (dashed). So one target is always B.",
  },
  {
    name: 'G P S: D or A and G, P or S',
    spec: { slot: ['UFR', 'C'], buffer: 'UFR', outs: [['DFL', 'G: D'], ['DFR', "P: D'"], ['DBL', 'S: D2']], inters: [['UFL', "D: U'"], ['UBL', 'A: U2']],
      aria: 'buffer position, with G, P and S below and D and A on top' },
    text: "R' D R swaps the buffer's own position with G (D), P (D') or S (D2). U' brings D, U2 brings A into the buffer's position. So the targets are D or A, and G, P or S.",
  },
  {
    name: 'P family: P and L, T or H',
    spec: { slot: ['DFR', 'P'], buffer: 'UFR', outs: [['UFR', "C: R U R'"]], inters: [['DFL', 'L: D'], ['DBR', "T: D'"], ['DBL', 'H: D2']],
      aria: 'P position on the bottom, the buffer above it, L, T and H on the bottom' },
    text: "Upside down: here the interchange turns the bottom. R U R' swaps P's position with the buffer's. D brings L, D' brings T, D2 brings H into P's position. So the targets are P, and L, T or H.",
  },
];

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };

// The table, the rules and (unless pictures: false) one picture per family.
export function mountFamilies(slot, { pictures = true } = {}) {
  slot.append(
    el('p', null, "Every base belongs to one of four families, and the two letters tell you which. The D turn inside the insertion follows the same pattern in every family as Orozco's O, H, L: first letter <code>D</code>, second <code>D'</code>, third <code>D2</code>."),
    el('div', 'table-wrap', `<table class="bld-table"><caption>The four families</caption>
      <thead><tr><th>Targets</th><th>Insertion</th><th>Interchange</th><th>D turn</th></tr></thead><tbody>
      <tr><th>B and O, H or L (Orozco)</th><td><code>R D R'</code></td><td><code>U'</code></td><td class="nw">O = <code>D</code><br>H = <code>D'</code><br>L = <code>D2</code></td></tr>
      <tr><th>D or A and G, P or S</th><td><code>R' D R</code></td><td class="nw">D → <code>U'</code><br>A → <code>U2</code></td><td class="nw">G = <code>D</code><br>P = <code>D'</code><br>S = <code>D2</code></td></tr>
      <tr><th>P and L, T or H</th><td><code>R U R'</code></td><td>D, D' or D2 (last column)</td><td class="nw">L = <code>D</code><br>T = <code>D'</code><br>H = <code>D2</code></td></tr>
      <tr><th>L and T</th><td><code>L' U L</code></td><td><code>D2</code></td><td>–</td></tr>
      </tbody></table>`),
    el('ul', 'bld-list', `<li><strong>Three letter sets, each in the order D, D', D2:</strong> O H L (your Orozco), G P S (like the satnav), L T H (the P family).</li>
      <li><strong>The middle turn and the interchange are always on opposite layers:</strong> a D in the insertion goes with a U interchange, and a U with a D interchange.</li>`),
    el('div', 'table-wrap', `<table class="bld-table"><caption>Which letter comes first</caption>
      <thead><tr><th>Family</th><th>As written (insertion first)</th><th>Halves swapped</th></tr></thead><tbody>
      <tr><th>Orozco</th><td>O, H or L, then B</td><td>B, then O, H or L</td></tr>
      <tr><th>G P S</th><td>D or A, then G, P or S</td><td>G, P or S, then D or A</td></tr>
      <tr><th>P family</th><td>P, then L, T or H</td><td>L, T or H, then P</td></tr>
      </tbody></table>`),
  );
  if (!pictures) return;
  slot.appendChild(el('p', null, '<strong>Why these letters go together.</strong> A base swaps one position (outlined) with one of three others, chosen by the D turn (solid arrows), and the interchange brings one more position into it (dashed arrows). The buffer is blue.'));
  const figs = el('div', 'ts-figs');
  for (const fam of FAMILIES) {
    const fig = el('figure', 'ts-fig fd-fig');
    fig.append(el('div', 'fd-pic', familyDiagram(fam.spec)), el('figcaption', null, `<strong>${fam.name}</strong><br>${fam.text}`));
    figs.appendChild(fig);
  }
  slot.appendChild(figs);
}
