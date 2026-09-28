// Blindfolded 3x3: M2 (edges) + Old Pochmann (corners), Speffz letters.
// From the user's notes (2026-09-28). Checked by simulating 500 complete
// blind solves (memo from the scrambled cube, then every setup/algorithm
// below): all solved, once edge B's setup was fixed (see its note).
export const BLD_ORDER = [
  'Memo edges from the buffer sticker U (DF, bottom) — "U goes to A". Memo corners from buffer sticker E — "E goes to V".',
  'Edges first (M2). On every 2nd edge target, swap C↔W and I↔S — they\'re opposites.',
  'Odd number of edge targets? Do the parity algorithm.',
  'Then corners (Old Pochmann). Edges must come before corners — each corner swap also swaps the UL/UB edges, which messes up the edge memo if corners go first.',
];

// Each target: setup, then M2, then undo the setup. `special` letters on
// the M slice use their own full algorithm instead.
export const bldEdges = [
  { letter: 'A', piece: 'UB', setup: '', note: 'Just M2.' },
  {
    letter: 'B',
    piece: 'UR',
    setup: "R' U R U'",
    note: "Your notes had R' U R' U' — that sends the buffer to V, not B. Fixed (checked by simulation).",
  },
  { letter: 'C', piece: 'UF', special: "U2 M' U2 M'", note: 'Opposite of W: on a 2nd target, do W instead.' },
  { letter: 'D', piece: 'UL', setup: "L' U' L U" },
  { letter: 'E', piece: 'LU', setup: "B L' B'", alt: "x' U L' U'" },
  { letter: 'F', piece: 'LF', setup: "B L2 B'", alt: "x' U L2 U'" },
  { letter: 'G', piece: 'LD', setup: "B L B'", alt: "x' U L U'" },
  { letter: 'H', piece: 'LB', setup: "u' L' u" },
  { letter: 'I', piece: 'FU', special: "D (M' U R2 U') (M U R2 U') D' M2", note: 'Opposite of S: on a 2nd target, do S instead.' },
  { letter: 'J', piece: 'FR', setup: "U R U'" },
  { letter: 'K', piece: 'FD', buffer: true },
  { letter: 'L', piece: 'FL', setup: "U' L' U" },
  { letter: 'M', piece: 'RU', setup: "B' R B", alt: "x' U' R U" },
  { letter: 'N', piece: 'RB', setup: "u R u'" },
  { letter: 'O', piece: 'RD', setup: "B' R' B", alt: "x' U' R' U" },
  { letter: 'P', piece: 'RF', setup: "B' R2 B", alt: "x' U' R2 U" },
  { letter: 'Q', piece: 'BU', special: "(U' M')×3 U' M (U' M')×4" },
  { letter: 'R', piece: 'BL', setup: "U' L U" },
  {
    letter: 'S',
    piece: 'BD',
    special: "M2' D (U R2 U' M') (U R2 U' M) D'",
    note: "Opposite of I: on a 2nd target, do I instead. Commutator: M2' [D: [U R2 U', M']].",
  },
  { letter: 'T', piece: 'BR', setup: "U R' U'" },
  { letter: 'U', piece: 'DF', buffer: true },
  { letter: 'V', piece: 'DR', setup: "U R2 U'" },
  { letter: 'W', piece: 'DB', special: 'M U2 M U2', note: 'Opposite of C: on a 2nd target, do C instead.' },
  { letter: 'X', piece: 'DL', setup: "U' L2 U" },
];

export const BLD_PARITY = ["D' L2 D M2 D' L2 D", "D' Rw2 U M2 U' Rw2 D"];

export const BLD_CORNER_TIPS = [
  "Don't set up with U, B or L moves — they disturb pieces the swap algorithm moves. Only D, F and R.",
  'D-face stickers: a D turn.',
  "F-face stickers: an F turn, then R'.",
  'R-face stickers: an R turn, then F.',
  'Anything else: one move to bring it onto the D, F or R face, then set up from there.',
];

// Corner swap: Y-perm without its first F and last F'.
export const BLD_CORNER_SWAP = "R U' R' U' R U R' F' R U R' U' R' F R";

export const bldCorners = [
  { letter: 'A', piece: 'UBL', buffer: true },
  { letter: 'B', piece: 'UBR', setup: 'R2' },
  { letter: 'C', piece: 'UFR', setup: 'F2 D' },
  { letter: 'D', piece: 'UFL', setup: 'F2' },
  { letter: 'E', piece: 'LUB', buffer: true },
  { letter: 'F', piece: 'LUF', setup: "F' D" },
  { letter: 'G', piece: 'LDF', setup: "F'" },
  { letter: 'H', piece: 'LDB', setup: "D' R" },
  { letter: 'I', piece: 'FUL', setup: "F R'" },
  { letter: 'J', piece: 'FUR', setup: "R'" },
  { letter: 'K', piece: 'FDR', setup: "F' R'" },
  { letter: 'L', piece: 'FDL', setup: "F2 R'" },
  { letter: 'M', piece: 'RUF', setup: 'F' },
  { letter: 'N', piece: 'RUB', setup: "R' F" },
  { letter: 'O', piece: 'RDB', setup: 'R2 F' },
  { letter: 'P', piece: 'RDF', setup: 'R F' },
  { letter: 'Q', piece: 'BUR', setup: "R D'" },
  { letter: 'R', piece: 'BUL', buffer: true },
  { letter: 'S', piece: 'BDL', setup: "D F'" },
  { letter: 'T', piece: 'BDR', setup: 'R' },
  { letter: 'U', piece: 'DFL', setup: 'D' },
  { letter: 'V', piece: 'DFR', setup: '' },
  { letter: 'W', piece: 'DBR', setup: "D'" },
  { letter: 'X', piece: 'DBL', setup: 'D2' },
];
