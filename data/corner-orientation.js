// The 7 last-layer corner-orientation cases, shared by anything that only
// needs to orient corners (not preserve edges): 2x2 Ortega's OLL step and
// Roux's (simplified, 2-look) CMLL. CFOP's 3x3 OLL cases are NOT the same
// algorithms — those also have to preserve edge positions, so they live
// separately in data/oll.js.
//
// Confirmed twice over: once when the 2x2 Ortega notes gave "Sassy Sledge"
// and "Fipgar Urvop" without spelling out the new words, and again when the
// Roux CMLL notes spelled every case out letter-by-letter and matched
// exactly (see docs/mnemonics.md and log/ for both).
export const cornerOrientationCases = [
  {
    id: 'sune',
    name: 'Sune',
    alg: "R U R' U R U2 R'",
    mnemonicChunks: [
      { word: 'Ugly', moves: "R U R' U" },
      { word: 'Loopy', moves: "R U2 R'" },
    ],
  },
  {
    id: 'antisune',
    name: 'Antisune',
    alg: "R U2 R' U' R U' R'",
    mnemonicChunks: [
      { word: 'Loopy', moves: "R U2 R'" },
      { word: 'V', moves: "U'" },
      { word: 'RVP', moves: "R U' R'" },
    ],
  },
  {
    id: 'h',
    name: 'H',
    orientation: 'H is up/down.',
    alg: "U R U R' U R U' R' U R U2 R'",
    mnemonicChunks: [
      { word: 'U', moves: 'U' },
      { word: 'Ugly', moves: "R U R' U" },
      { word: 'Punk', moves: "R U' R' U" },
      { word: 'Loopy', moves: "R U2 R'" },
    ],
    story: 'Havoc! Ugly Punk Goes Loopy.',
    altAlg: "F R U R' U' R U R' U' R U R' U' F'",
    altMnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Sassy×3', moves: "(R U R' U')×3" },
      { word: 'G', moves: "F'" },
    ],
    altNote: 'Easier to remember, if you\'d rather use this one.',
  },
  {
    id: 't',
    name: 'T',
    alg: "R U R' U' R' F R F'",
    mnemonicChunks: [
      { word: 'Sassy', moves: "R U R' U'" },
      { word: 'Sledge', moves: "R' F R F'" },
    ],
    story: 'Sassy with a Sledge.',
  },
  {
    id: 'l',
    name: 'L',
    alg: "F R' F' R U R U' R'",
    mnemonicChunks: [
      { word: 'Fipgar', moves: "F R' F' R" },
      { word: 'Urvop', moves: "U R U' R'" },
    ],
    story: 'Fipgar Urvop — Frogs Paint Green Rainbows, Umbrellas Reveal Very Purple.',
  },
  {
    id: 'u',
    name: 'U',
    alg: "F R U R' U' F'",
    mnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Sassy', moves: "R U R' U'" },
      { word: 'G', moves: "F'" },
    ],
    story: 'Frog is Sassy to Goose.',
  },
  {
    id: 'pi',
    name: 'Pi',
    alg: "F R U R' U' R U R' U' F'",
    mnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Sassy×2', moves: "(R U R' U')×2" },
      { word: 'G', moves: "F'" },
    ],
    story: 'Frog is double Sassy to Goose.',
  },
];
