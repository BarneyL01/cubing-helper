// Mnemonic words for the Orozco page (owner's letter code, docs/mnemonics.md).
// D′ = Q (owner, 2026-10-30). Grouped in fours (owner). The moves joined in order must equal
// OROZCO_PARITY: checked by log/2026-10-25-orozco-corners.mjs.
export const OROZCO_PARITY_WORDS = [
  { word: 'Jolly', moves: "R U' R' U'" },
  { word: 'Rurdy', moves: 'R U R D' },
  { word: 'Power Q', moves: "R' U' R D'" },
  { word: 'Poopav', moves: "R' U2 R' U'" },
];

// Same parity with R, U and F only (owner chose it 2026-11-01; the one above uses D). Every word is already
// in the owner's list. Checked to equal OROZCO_PARITY on every sticker by log/2026-10-25-orozco-corners.mjs.
export const OROZCO_PARITY_RUF_WORDS = [
  { word: 'Rupture', moves: "R U R' F'" },
  { word: 'Loopy', moves: "R U2 R'" },
  { word: 'U2', moves: 'U2' },
  { word: 'Prefer', moves: "R' F R" },
  { word: 'U', moves: 'U' },
  { word: 'Loopy', moves: "R U2 R'" },
  { word: 'V', moves: "U'" },
];
export const OROZCO_PARITY_RUF = OROZCO_PARITY_RUF_WORDS.map((w) => w.moves).join(' ');
