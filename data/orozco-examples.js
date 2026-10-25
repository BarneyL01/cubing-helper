// Worked examples for the Orozco corners page: memo letters (from C) and what each one shows.
// The scramble is made from the solve (its moves reversed); log/2026-10-25-orozco-corners.mjs checks that
// the scramble really memos as these letters and that the steps solve it.
export const orozcoExamples = [
  { id: 'ol', memo: ['O', 'L'], note: "O's base has D; L's has D2. Backwards, D2 stays D2." },
  { id: 'ho', memo: ['H', 'O'], note: "Backwards, every D becomes D' and every D' becomes D: compare O forwards with O backwards." },
  { id: 'ke', memo: ['K', 'E'], note: 'With setups. Backwards still starts with the setup and ends by undoing it.' },
  { id: 'tn', memo: ['T', 'N'], note: 'N is a helper sticker: as the 2nd letter of a pair, the twist backwards.' },
  { id: 'gpxa', memo: ['G', 'P', 'X', 'A'], note: 'Two pairs: forwards, backwards, forwards, backwards.' },
];
