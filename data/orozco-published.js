// Orozco corner algorithms as published by Riu on note.com (https://note.com/cuber1u/n/n396edec5a495),
// copied from the translated page via docs/orozco-research-notes.md. The source writes "[R2: R U' R', D']"
// for a setup around a commutator; here the inner commutator is bracketed, "[R2: [R U' R', D']]".
// Each does buffer (C) -> letter -> helper (B), like ours; checked by log/2026-10-25-orozco-corners.mjs.
export const OROZCO_PUBLISHED_SOURCE = { name: 'Riu, note.com', url: 'https://note.com/cuber1u/n/n396edec5a495' };
export const orozcoPublished = [
  { letter: 'H', notation: "[R D' R', U']" },
  { letter: 'O', notation: "[R D R', U']" },
  { letter: 'G', notation: "[U, R' D R]" },
  { letter: 'K', notation: "[U, D' R' D R]" },
  { letter: 'L', notation: "[U, D R' D' R]" },
  { letter: 'P', notation: "[U, R' D' R]" },
  { letter: 'S', notation: "[U, R' D2 R]" },
  { letter: 'T', notation: "[U, D' R' D' R]" },
  { letter: 'F', notation: "[R2: [R U' R', D']]" },
  { letter: 'R', notation: "[R2: [R U2 R', D']]" },
  { letter: 'W', notation: "[R2: [R2 U R2 U' R2, D']]" },
  { letter: 'E', notation: "[R2: [D, R' U R]]" },
  { letter: 'I', notation: "[R2: [D, R' U2 R]]" },
  { letter: 'V', notation: "[R2: [D, R2 U' R2 U R2]]" },
  { letter: 'U', notation: "[x': [R U R', D2]]" },
  { letter: 'X', notation: "[x: [D2, R' U' R]]" },
  { letter: 'A', notation: "[x R2: [R U R', D2]]" },
  { letter: 'D', notation: "[x' R2: [D2, R' U' R]]" },
];
// Their helper algorithms: the same effect as the twist and twist backwards (checked).
export const OROZCO_PUBLISHED_HELPER = {
  N: "R U2 R' U' R U' R' L' U2 L U L' U L",
  Q: "L' U' L U' L' U2 L R U R' U R U2 R'",
};
// Their parity swaps UFR-UBR and UF-UB (for Orozco edges, buffer UF helper UB). With M2 edges the Ra-perm is used.
export const OROZCO_PUBLISHED_PARITY = "R U2 R' U2 R' F R U R U2 R' U' R U R' F'";
