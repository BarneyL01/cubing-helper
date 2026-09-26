// 2-look PLL cases, decoded from the personal mnemonic cipher.
// See docs/mnemonics.md for how the letters map to moves.
export const pllCornerCases = [
  {
    id: 'y-perm',
    name: 'Y-perm — Diagonals',
    description: 'Both pairs of adjacent corners are diagonally swapped.',
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    mnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Jolly', moves: "R U' R' U'" },
      { word: 'Rupture', moves: "R U R' F'" },
      { word: 'Sassy', moves: "R U R' U'" },
      { word: 'Prefer', moves: "R' F R" },
      { word: 'G', moves: "F'" },
    ],
  },
  {
    id: 't-perm',
    name: 'T-perm — Headlights',
    description: 'One pair of adjacent corners is swapped ("headlights" line up on one side).',
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    mnemonicChunks: [
      { word: 'Sassy', moves: "R U R' U'" },
      { word: 'Prefer', moves: "R' F R" },
      { word: 'Jolly', moves: "R U' R' U'" },
      { word: 'Rupture', moves: "R U R' F'" },
    ],
    note: "Prefer ends in R and Jolly starts with R — those combine into the R2 you'll see in the standard T-perm.",
  },
];

export const pllEdgeCases = [
  {
    id: 'ua-perm',
    name: 'Ua-perm',
    description: '3 edges cycle anti-clockwise (viewed from above).',
    alg: "M2 U M U2 M' U M2",
    mnemonicChunks: [
      { word: 'N', moves: 'M2' },
      { word: 'U', moves: 'U' },
      { word: 'M', moves: 'M' },
      { word: 'U2', moves: 'U2' },
      { word: 'K', moves: "M'" },
      { word: 'U', moves: 'U' },
      { word: 'N', moves: 'M2' },
    ],
  },
  {
    id: 'ub-perm',
    name: 'Ub-perm',
    description: '3 edges cycle clockwise (viewed from above).',
    alg: "M2 U' M U2 M' U' M2",
    mnemonicChunks: [
      { word: 'N', moves: 'M2' },
      { word: 'V', moves: "U'" },
      { word: 'M', moves: 'M' },
      { word: 'U2', moves: 'U2' },
      { word: 'K', moves: "M'" },
      { word: 'V', moves: "U'" },
      { word: 'N', moves: 'M2' },
    ],
  },
  {
    id: 'h-perm',
    name: 'H-perm',
    description: 'Both pairs of opposite edges are swapped.',
    alg: "M2 U M2 U2 M2 U M2",
    mnemonicChunks: [
      { word: 'N', moves: 'M2' },
      { word: 'U', moves: 'U' },
      { word: 'N', moves: 'M2' },
      { word: 'U2', moves: 'U2' },
      { word: 'N', moves: 'M2' },
      { word: 'U', moves: 'U' },
      { word: 'N', moves: 'M2' },
    ],
    story: 'Memory: "Nun U2 Nun."',
  },
  {
    id: 'z-perm',
    name: 'Z-perm',
    description: 'Adjacent edges are swapped on two sides.',
    alg: "M' U M2 U M2 U M' U2 M2 U'",
    mnemonicChunks: [
      { word: 'K', moves: "M'" },
      { word: 'U', moves: 'U' },
      { word: 'N', moves: 'M2' },
      { word: 'U', moves: 'U' },
      { word: 'N', moves: 'M2' },
      { word: 'U', moves: 'U' },
      { word: 'K', moves: "M'" },
      { word: 'U2', moves: 'U2' },
      { word: 'N', moves: 'M2' },
      { word: 'V', moves: "U'" },
    ],
    story: 'Memory: "Kunu Nuku you envy" (U-N-V).',
  },
];
