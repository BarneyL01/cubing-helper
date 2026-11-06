// "Which base? Read it from the letters": the four families of 3-style bases, as a table, rules and one picture
// per family showing why its letters belong together. Used on the By base page and on 3-Style solves.
// The positions in the pictures were checked by simulation (log/2026-11-06-3style-families.md): R D R' swaps the
// B position with O (D), H (D') or L (D2); R' D R swaps the buffer's position with G (D), P (D') or S (D2);
// R U R' swaps P's position with the buffer's; U' brings C into B and D into C, U2 brings A into C; D brings L,
// D' brings T, D2 brings H into P's position.

import { makeCube } from './sticker-cube.js?v=2';

const esc = (s) => s.replace(/'/g, '′');
const f = (v) => v.toFixed(1);
const CUBE = makeCube(124, 100, 46);
const CORNERS = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const STICKERS = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(STICKERS).find((k) => STICKERS[k].includes(l));

function arrow(from, to, cls, bend) {
  const [p, q] = [CUBE.point(from), CUBE.point(to)];
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
  const ctrl = [m[0] - ((q[1] - p[1]) / l) * bend, m[1] + ((q[0] - p[0]) / l) * bend];
  const trim = (a, b, r) => { const ux = b[0] - a[0], uy = b[1] - a[1], d = Math.hypot(ux, uy); return [a[0] + (ux / d) * r, a[1] + (uy / d) * r]; };
  const s = trim(p, ctrl, 5), t = trim(q, ctrl, 7);
  const ang = Math.atan2(t[1] - ctrl[1], t[0] - ctrl[0]);
  const head = [t, [t[0] - 8 * Math.cos(ang - 0.45), t[1] - 8 * Math.sin(ang - 0.45)], [t[0] - 8 * Math.cos(ang + 0.45), t[1] - 8 * Math.sin(ang + 0.45)]];
  return `<path d="M${f(s[0])} ${f(s[1])} Q${f(ctrl[0])} ${f(ctrl[1])} ${f(t[0])} ${f(t[1])}" class="fd-${cls}"/><polygon points="${head.map((h) => h.map(f).join(',')).join(' ')}" class="fd-head-${cls}"/>`;
}

// spec: { slot: letter, outs: [[letter, turn]], inters: [[letter, turn]] } - letters are stickers; C is the buffer
function familyDiagram(spec) {
  const shown = [[spec.slot, ''], ...spec.outs, ...spec.inters];
  const used = new Set(shown.map(([l]) => cornerOf(l)));
  const dots = Object.keys(CORNERS).filter((c) => !used.has(c)).map((c) => { const [x, y] = CUBE.point(CORNERS[c]); return `<circle cx="${f(x)}" cy="${f(y)}" r="3" class="cd-off"/>`; }).join('');
  // colours: buffer blue, the swapped position pink, D-turn partners green (solid arrows), interchange orange (dashed)
  const kind = (l) => (l === 'C' ? 'sq-buffer' : l === spec.slot ? 'sq-slot' : spec.outs.some(([x]) => x === l) ? 'sq-ins' : 'sq-int');
  const squares = shown.map(([l]) => CUBE.sticker(l, kind(l) + (l === spec.slot ? ' sq-thick' : ''))).join('');
  const arrows = [
    ...spec.outs.map(([l], i) => arrow(l, spec.slot, 'ins', [14, -14, 22][i % 3])),
    ...spec.inters.map(([l], i) => arrow(l, spec.slot, 'int', [-16, 16][i % 2])),
  ].join('');
  const labels = shown.map(([l, turn]) => { const a = CUBE.labelAt(l); return `<text x="${f(a.x)}" y="${f(a.y)}" text-anchor="${a.anchor}" class="fd-label">${l}${turn ? `: ${esc(turn)}` : ''}</text>`; }).join('');
  return `<svg viewBox="0 0 250 190" class="family-diagram" role="img" aria-label="${spec.aria}">${CUBE.edges()}${dots}${squares}${arrows}${labels}</svg>`;
}

const FAMILIES = [
  {
    name: 'Orozco: B and O, H or L',
    algs: [['O → B', "[R D R' , U']"], ['H → B', "[R D' R' , U']"], ['L → B', "[R D2 R' , U']"]],
    spec: { slot: 'B', outs: [['O', 'D'], ['H', "D'"], ['L', 'D2']], inters: [['C', "U'"]],
      aria: 'B position, with O, H and L below and the buffer next to it' },
    text: "R D R' swaps the B position with one bottom position: O with D, H with D', L with D2 (solid arrows). U' brings the buffer into the B position (dashed). So one target is always B.",
  },
  {
    name: "G P S with D (U')",
    algs: [['D → G', "[R' D R , U']"], ['D → P', "[R' D' R , U']"], ['D → S', "[R' D2 R , U']"]],
    spec: { slot: 'C', outs: [['G', 'D'], ['P', "D'"], ['S', 'D2']], inters: [['D', "U'"]],
      aria: 'buffer position, with G, P and S below and D on top' },
    text: "R' D R swaps the buffer's own position with G (D), P (D') or S (D2). U' brings D into the buffer's position. So the targets are D, and G, P or S.",
  },
  {
    name: 'G P S with A (U2)',
    algs: [['A → G', "[R' D R , U2]"], ['A → P', "[R' D' R , U2]"], ['A → S', "[R' D2 R , U2]"]],
    spec: { slot: 'C', outs: [['G', 'D'], ['P', "D'"], ['S', 'D2']], inters: [['A', 'U2']],
      aria: 'buffer position, with G, P and S below and A on top' },
    text: "The same insertion, but U2 brings A into the buffer's position. So the targets are A, and G, P or S.",
  },
  {
    name: 'P family: P and L, T or H',
    algs: [['P → L', "[R U R' , D]"], ['P → T', "[R U R' , D']"], ['P → H', "[R U R' , D2]"]],
    spec: { slot: 'P', outs: [['C', "R U R'"]], inters: [['L', 'D'], ['T', "D'"], ['H', 'D2']],
      aria: 'P position on the bottom, the buffer above it, L, T and H on the bottom' },
    text: "Upside down: here the interchange turns the bottom. R U R' swaps P's position with the buffer's. D brings L, D' brings T, D2 brings H into P's position. So the targets are P, and L, T or H.",
  },
];

// [A , B] with the two moves that pick the pieces coloured as in the pictures: the middle turn of the 3-move
// insertion green, the one-move interchange orange.
export function colourCore(core) {
  const parts = core.slice(1, -1).split(' , ');
  const out = parts.map((part) => {
    const m = part.split(' ');
    if (m.length === 3) return `${m[0]} <span class="mv-pick">${m[1]}</span> ${m[2]}`;
    return `<span class="mv-turn">${part}</span>`;
  });
  return `[${out.join(' , ')}]`;
}
const g = (m) => `<code class="mv-pick">${m}</code>`;
const o = (m) => `<code class="mv-turn">${m}</code>`;
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };

// The table, the rules and (unless pictures: false) one picture per family.
export function mountFamilies(slot, { pictures = true } = {}) {
  slot.append(
    el('p', null, "Every base belongs to one of four families, and the two letters tell you which. The D turn inside the insertion follows the same pattern in every family as Orozco's O, H, L: first letter <code>D</code>, second <code>D'</code>, third <code>D2</code>. Green: the turn inside the insertion; orange: the interchange turn. Those two moves pick the pieces; the rest of the commutator stays the same."),
    el('div', 'table-wrap', `<table class="bld-table"><caption>The four families</caption>
      <thead><tr><th>Targets</th><th>Insertion</th><th>Interchange</th><th>D turn</th></tr></thead><tbody>
      <tr><th>B and O, H or L (Orozco)</th><td><code>R <span class="mv-pick">D</span> R'</code></td><td>${o("U'")}</td><td class="nw">O = ${g('D')}<br>H = ${g("D'")}<br>L = ${g('D2')}</td></tr>
      <tr><th>D or A and G, P or S</th><td><code>R' <span class="mv-pick">D</span> R</code></td><td class="nw">D → ${o("U'")}<br>A → ${o('U2')}</td><td class="nw">G = ${g('D')}<br>P = ${g("D'")}<br>S = ${g('D2')}</td></tr>
      <tr><th>P and L, T or H</th><td><code>R <span class="mv-pick">U</span> R'</code></td><td>the D turn (last column)</td><td class="nw">L = ${o('D')}<br>T = ${o("D'")}<br>H = ${o('D2')}</td></tr>
      <tr><th>L and T</th><td><code>L' <span class="mv-pick">U</span> L</code></td><td>${o('D2')}</td><td>–</td></tr>
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
  slot.appendChild(el('p', null, '<strong>Why these letters go together.</strong> Each square is one sticker. A base swaps the position of one sticker (pink, thick outline) with one of three others, chosen by the D turn (green squares, solid green arrows), and the interchange brings one more into it (orange squares, dashed orange arrows). The buffer C is always blue. Stickers on faces you cannot see from the front (left, back, bottom) are dashed.'));
  const figs = el('div', 'ts-figs');
  for (const fam of FAMILIES) {
    const fig = el('figure', 'ts-fig fd-fig');
    // the whole commutators, each written from the buffer (buffer → 1st → 2nd); the reverse swaps the two halves
    const list = fam.algs.map(([pair, c]) => `<li>buffer → ${pair}: <code>${colourCore(c)}</code></li>`).join('');
    fig.append(el('div', 'fd-pic', familyDiagram(fam.spec)), el('figcaption', null, `<strong>${fam.name}</strong><br>${fam.text}<ul class="fd-algs">${list}</ul>`));
    figs.appendChild(fig);
  }
  slot.appendChild(figs);
}
