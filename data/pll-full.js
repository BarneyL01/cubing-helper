// Full PLL list: all 21 cases, each with one standard algorithm.
// Standard names and notation only: no mnemonic words, no Libby's digits.
// Algorithms are the first option for each case in the J Perm PLL list
// (jperm.net) that uses no whole-cube rotation where one exists, with
// parentheses removed. Checked by simulation: every case keeps the first two
// layers solved, the top layer oriented, and all 21 cases differ
// (log/2026-10-23-full-oll-pll.md).
export const pllFullEdgeCases = [
  {
    id: 'pll-full-h',
    name: 'H-perm',
    stickering: 'full',
    description: 'Edges: two pairs of opposite edges swapped. Corners solved.',
    alg: 'M2 U M2 U2 M2 U M2',
  },
  {
    id: 'pll-full-z',
    name: 'Z-perm',
    stickering: 'full',
    description: 'Edges: two pairs of adjacent edges swapped. Corners solved.',
    alg: 'M\' U M2 U M2 U M\' U2 M2',
  },
  {
    id: 'pll-full-ua',
    name: 'Ua-perm',
    stickering: 'full',
    description: 'Edges: 3-cycle, anticlockwise. Corners solved.',
    alg: 'M2 U M U2 M\' U M2',
  },
  {
    id: 'pll-full-ub',
    name: 'Ub-perm',
    stickering: 'full',
    description: 'Edges: 3-cycle, clockwise. Corners solved.',
    alg: 'M2 U\' M U2 M\' U\' M2',
  },
];

export const pllFullCornerCases = [
  {
    id: 'pll-full-aa',
    name: 'Aa-perm',
    stickering: 'full',
    description: 'Corners: 3-cycle. Edges solved.',
    alg: 'x L2 D2 L\' U\' L D2 L\' U L\'',
  },
  {
    id: 'pll-full-ab',
    name: 'Ab-perm',
    stickering: 'full',
    description: 'Corners: 3-cycle. Edges solved.',
    alg: 'x\' L2 D2 L U L\' D2 L U\' L',
  },
  {
    id: 'pll-full-e',
    name: 'E-perm',
    stickering: 'full',
    description: 'Corners: two adjacent swaps, on opposite sides. Edges solved.',
    alg: 'x\' L\' U L D\' L\' U\' L D L\' U\' L D\' L\' U L D',
  },
  {
    id: 'pll-full-f',
    name: 'F-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: opposite swap.',
    alg: 'R\' U\' F\' R U R\' U\' R\' F R2 U\' R\' U\' R U R\' U R',
  },
  {
    id: 'pll-full-ja',
    name: 'Ja-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: adjacent swap.',
    alg: 'x R2 F R F\' R U2 r\' U r U2',
  },
  {
    id: 'pll-full-jb',
    name: 'Jb-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: adjacent swap.',
    alg: 'R U R\' F\' R U R\' U\' R\' F R2 U\' R\'',
  },
  {
    id: 'pll-full-ra',
    name: 'Ra-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: adjacent swap.',
    alg: 'R U\' R\' U\' R U R D R\' U\' R D\' R\' U2 R\'',
  },
  {
    id: 'pll-full-rb',
    name: 'Rb-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: adjacent swap.',
    alg: 'R2 F R U R U\' R\' F\' R U2 R\' U2 R',
  },
  {
    id: 'pll-full-t',
    name: 'T-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: opposite swap.',
    alg: 'R U R\' U\' R\' F R2 U\' R\' U\' R U R\' F\'',
  },
  {
    id: 'pll-full-y',
    name: 'Y-perm',
    stickering: 'full',
    description: 'Corners: diagonal swap. Edges: adjacent swap.',
    alg: 'F R U\' R\' U\' R U R\' F\' R U R\' U\' R\' F R F\'',
  },
  {
    id: 'pll-full-v',
    name: 'V-perm',
    stickering: 'full',
    description: 'Corners: diagonal swap. Edges: adjacent swap.',
    alg: 'R\' U R\' U\' R D\' R\' D R\' U D\' R2 U\' R2 D R2',
  },
  {
    id: 'pll-full-na',
    name: 'Na-perm',
    stickering: 'full',
    description: 'Corners: diagonal swap. Edges: opposite swap.',
    alg: 'R U R\' U R U R\' F\' R U R\' U\' R\' F R2 U\' R\' U2 R U\' R\'',
  },
  {
    id: 'pll-full-nb',
    name: 'Nb-perm',
    stickering: 'full',
    description: 'Corners: diagonal swap. Edges: opposite swap.',
    alg: 'R\' U R U\' R\' F\' U\' F R U R\' F R\' F\' R U\' R',
  },
  {
    id: 'pll-full-ga',
    name: 'Ga-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: 4-cycle.',
    alg: 'R2 U R\' U R\' U\' R U\' R2 U\' D R\' U R D\'',
  },
  {
    id: 'pll-full-gb',
    name: 'Gb-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: 4-cycle.',
    alg: 'R\' U\' R U D\' R2 U R\' U R U\' R U\' R2 D',
  },
  {
    id: 'pll-full-gc',
    name: 'Gc-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: 4-cycle.',
    alg: 'R2 U\' R U\' R U R\' U R2 U D\' R U\' R\' D',
  },
  {
    id: 'pll-full-gd',
    name: 'Gd-perm',
    stickering: 'full',
    description: 'Corners: adjacent swap. Edges: 4-cycle.',
    alg: 'R U R\' U\' D R2 U\' R U\' R\' U R\' U R2 D\'',
  },
];
