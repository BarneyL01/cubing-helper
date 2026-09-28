// Unfolded cube showing Speffz letters, for the blindfolded page. Letters
// are positions, not colours, so the faces are drawn neutral.
const FACES = ['U', 'L', 'F', 'R', 'B', 'D'];
const NET_POS = { U: [1, 0], L: [0, 1], F: [1, 1], R: [2, 1], B: [3, 1], D: [1, 2] };
// Speffz goes clockwise from the top-left (corners) / top (edges) of each face.
const CORNER_CELLS = [[0, 0], [2, 0], [2, 2], [0, 2]];
const EDGE_CELLS = [[1, 0], [2, 1], [1, 2], [0, 1]];

export function bldNet(kind, { buffers = [], marked = [] } = {}) {
  const cells = kind === 'edges' ? EDGE_CELLS : CORNER_CELLS;
  const S = 10;
  const parts = [];
  FACES.forEach((face, f) => {
    const [fx, fy] = NET_POS[face];
    const ox = fx * 3 * S;
    const oy = fy * 3 * S;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        parts.push(`<rect class="net-cell" x="${ox + c * S + 0.4}" y="${oy + r * S + 0.4}" width="${S - 0.8}" height="${S - 0.8}" rx="1"/>`);
      }
    }
    parts.push(`<text class="net-face" x="${ox + 1.5 * S}" y="${oy + 1.5 * S}">${face}</text>`);
    cells.forEach(([c, r], i) => {
      const letter = String.fromCharCode(65 + f * 4 + i);
      const cls = buffers.includes(letter) ? ' net-buffer' : marked.includes(letter) ? ' net-marked' : '';
      parts.push(`<rect class="net-cell${cls}" x="${ox + c * S + 0.4}" y="${oy + r * S + 0.4}" width="${S - 0.8}" height="${S - 0.8}" rx="1"/>`);
      parts.push(`<text class="net-letter${cls}" x="${ox + (c + 0.5) * S}" y="${oy + (r + 0.5) * S}">${letter}</text>`);
    });
  });
  return `<svg class="bld-net" viewBox="-0.5 -0.5 121 91" role="img" aria-label="Speffz ${kind} letters on an unfolded cube">${parts.join('')}</svg>`;
}
