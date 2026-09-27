// 2x2 Ortega method: solve one side (intuitive, not recorded here), then
// orient the other side's corners (OLL), then permute both layers (PBL).
export const ortegaOllCases = [
  {
    id: 'sune',
    name: 'Sune',
    orientation: 'Same case as CFOP 2-look OLL — same algorithm, reused here.',
    puzzle: '2x2x2',
    alg: "R U R' U R U2 R'",
    mnemonicChunks: [
      { word: 'Ugly', moves: "R U R' U" },
      { word: 'Loopy', moves: "R U2 R'" },
    ],
  },
  {
    id: 'antisune',
    name: 'Antisune',
    orientation: 'Same case as CFOP 2-look OLL — same algorithm, reused here.',
    puzzle: '2x2x2',
    alg: "R U2 R' U' R U' R'",
    mnemonicChunks: [
      { word: 'Loopy', moves: "R U2 R'" },
      { word: 'V', moves: "U'" },
      { word: 'RVP', moves: "R U' R'" },
    ],
  },
  {
    id: 't-cmll',
    name: 'T CMLL',
    alg: null,
    mnemonicChunks: [{ word: 'Sassy', moves: "R U R' U'" }],
    note:
      'Your note said "Sassy Sledge" — "Sassy" decodes fine (R U R\' U\'), but "Sledge" hasn\'t been given a letter-code yet, so this isn\'t recorded. Not the same length as CFOP\'s T1, so probably a different (shorter) algorithm, not a straight reuse.',
  },
  {
    id: 'l-cmll',
    name: 'L CMLL',
    alg: null,
    note:
      'Your note said "Fipgar Urvop" — neither word has a letter-code yet, so this isn\'t recorded.',
  },
  {
    id: 'pi',
    name: 'Pi',
    puzzle: '2x2x2',
    alg: "F R U R' U' R U R' U' F'",
    mnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Sassy×2', moves: "(R U R' U')×2" },
      { word: 'G', moves: "F'" },
    ],
  },
  {
    id: 'u',
    name: 'U',
    puzzle: '2x2x2',
    alg: "F R U R' U' F'",
    mnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Sassy', moves: "R U R' U'" },
      { word: 'G', moves: "F'" },
    ],
  },
  {
    id: 'h',
    name: 'H',
    orientation: 'H is up/down.',
    puzzle: '2x2x2',
    alg: "F R U R' U' R U R' U' R U R' U' F'",
    mnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Sassy×3', moves: "(R U R' U')×3" },
      { word: 'G', moves: "F'" },
    ],
    note: 'Same algorithm as CFOP 2-look OLL\'s H1.',
  },
];

export const ortegaPblCases = [
  {
    id: 'two-bars-front',
    name: 'Two bars, both facing front',
    puzzle: '2x2x2',
    alg: "R2 U' B2 U2 R2 U' R2",
  },
  {
    id: 'no-bars',
    name: 'Top & bottom, no bar',
    puzzle: '2x2x2',
    alg: "R2 F2 R2",
  },
  {
    id: 'one-bar-one-none',
    name: 'One bar, other side has none',
    orientation: 'Put the bar on top, facing you.',
    puzzle: '2x2x2',
    alg: "R U' R F2 R' U R'",
  },
  {
    id: 'one-side-solved-bar',
    name: 'One side solved, other has a bar',
    orientation: 'T-perm — same algorithm as CFOP 2-look PLL.',
    puzzle: '2x2x2',
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
  },
  {
    id: 'one-side-solved-no-bar',
    name: 'One side solved, other has no bar',
    orientation: 'Y-perm — same algorithm as CFOP 2-look PLL.',
    puzzle: '2x2x2',
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  },
];
