// Roux method: build left/right blocks (not recorded — intuitive), then
// CMLL (orient + permute the last layer's corners in one shot), then LSE
// (last six edges), which has its own sub-steps: 4a orient the edges, 4b
// place UL/UR, 4c solve the M slice (with DFDB recognition).
//
// The CMLL cases are the user's. Everything under LSE below was added on
// request (2026-10-06) and is NOT from the user's notes, apart from the one
// recorded card kept at the end ("Your note"). The structure (4a / 4b / 4c,
// DFDB) follows the community descriptions linked on the page; every
// algorithm and table here was found or checked with js/cube-sim.js:
//   - 4a: all 32 even-parity bad-edge patterns, each turned by U to match its
//     card, are solved to "all oriented, centres lined up".
//   - 4b: all 720 arrangements of the six edges (centres lined up, all
//     oriented) end with UL/UR solved and every edge still oriented.
//   - 4c: all 48 arrangements (any centre turn) are solved by the M turn that
//     lines the centres up, then the card's algorithm.
//   - DFDB: with UL/UR solved and centres lined up, the two edges in DF and
//     DB (and nothing else) decide which 4c card it is.
// See log/2026-10-06-home-f2l-roux-lse.md.
import { cornerOrientationCases } from './corner-orientation.js';

// This is a simplified, 2-look-style CMLL: these 7 cases only orient the
// corners. Full Roux CMLL (42 cases, orient+permute together) isn't
// recorded here — add it later if it's actually needed.
// On the Roux pages H uses F Sassy×3 G as its main algorithm (owner's choice, 2026-10-23); the
// 2x2 Ortega page keeps the shared data as it is. The other algorithm stays on the card as the alternative.
// Both solve the same H (up/down) pattern of top corners (checked by simulation).
export const rouxCmllCases = cornerOrientationCases.map((c) =>
  c.id === 'h'
    ? {
        ...c,
        alg: c.altAlg,
        mnemonicChunks: c.altMnemonicChunks,
        story: undefined,
        altAlg: c.alg,
        altMnemonicChunks: c.mnemonicChunks,
        altNote: `The other algorithm: ${c.story}`,
      }
    : c,
);

export const lseFacts = [
  ['Moves', 'Only M and U (M2 and U2 included)'],
  ['Solves', 'The last six edges (UL, UR, UF, UB, DF, DB) and the four M-slice centres'],
  ['Path', '4a orient the edges → 4b place UL and UR → 4c solve the M slice'],
  ['Starts from', 'Both blocks and the top-layer corners solved (after CMLL)'],
  ['Recognition', 'DFDB (below) for 4c; bad-edge shapes for 4a'],
];

// Colours below are the ones in the pictures (yellow top, white bottom, green
// front, blue back, red left, orange right).
export const lseOverview = {
  intro:
    'After CMLL, six edges and the M-slice centres are unsolved. Only M and U are used, so both blocks stay put. Turn U first if CMLL left the top corners a turn out; each step ends with them lined up.',
  pieces: [
    'UL and UR: the yellow–red and yellow–orange edges, which belong on the left and right blocks.',
    'UF, UB, DF and DB: the yellow–green, yellow–blue, white–green and white–blue edges, in the M slice.',
  ],
};

// 4a. Each card's picture shows a position the algorithm solves; the picture
// is the case seen with the centres lined up (the U centre on top).
// Positions are listed in the order UF UB UL UR DF DB; x = bad edge.
export const eoCases = [
  { pattern: '.xxx.x', alg: "M U M' U'", name: 'F Arrow (3/1) — 3 bad on top, DB bad', note: 'Top layer: UB, UL and UR are bad; UF is good. DB is bad.' },
  { pattern: 'x.xxx.', alg: "M' U M U'", name: 'F Arrow (3/1) — 3 bad on top, DF bad', note: 'Top layer: UF, UL and UR are bad; UB is good. DF is bad.' },
  { pattern: '.xx.xx', alg: "M2 U' M' U M'", name: 'V + D-Line (2a/2) — 2 bad on top (neighbours) + DF and DB bad', note: 'UB and UL are bad, and both bottom edges are bad.' },
  { pattern: '...xx.', alg: "M U' M U2 M' U' M'", name: '1+1 (1/1) — 1 bad on top + DF bad', note: 'UR is bad and DF is bad.' },
  { pattern: '..x..x', alg: "M' U' M U2 M U' M'", name: '1+1 (1/1) — 1 bad on top + DB bad', note: 'UL is bad and DB is bad.' },
  { pattern: '.x.x..', alg: "M' U' M U2 M' U' M", name: 'V (2a/0) — 2 bad on top (neighbours), bottom good', note: 'UB and UR are bad; both bottom edges are good.' },
  { pattern: '....xx', alg: "M U M U' M' U M' U'", name: 'D-Line (0/2) — only DF and DB bad', note: 'The whole top layer is good; both bottom edges are bad.' },
  { pattern: 'xxxx..', alg: "M U2 M U2 M U M U'", name: 'Cross (4/0) — all 4 top edges bad', note: 'UF, UB, UL and UR are bad; both bottom edges are good.' },
  { pattern: '..xxxx', alg: "M U2 M U2 M' U M' U'", name: '(U+D)-Line (2o/2) — 2 bad on top (UL, UR) + DF and DB bad', note: 'UL and UR are bad, and so are both bottom edges.' },
  { pattern: 'xx....', alg: "M U M' U' M U M' U'", name: 'U-Line (2o/0) — 2 bad on top (UF, UB), bottom good', note: 'UF and UB are bad; UL and UR are good.' },
  { pattern: 'xxxxxx', alg: "M U M U M' U M U2 M U' M", name: '6 Flip (4/2) — all 6 edges bad', note: 'The rarest and the longest case.' },
];

export const eoSteps = {
  goal: 'Orient all six edges (no edge "flipped"), with the centres lined up again afterwards.',
  how: [
    { title: 'Line the centres up.', text: 'Turn M until the top centre is the top colour (yellow here). Orientation is judged against the centres.' },
    { title: 'Find the bad edges.', text: 'A bad edge has its yellow or white sticker on a face that does not have a yellow or white centre. Top-layer edge: it is bad unless its yellow/white sticker is on top. Bottom-layer edge: bad unless its yellow/white sticker is on the bottom.' },
    { title: 'Count them.', text: 'There is always an even number: 0, 2, 4 or 6. If there are none, go straight to 4b.' },
    { title: 'Turn U until the picture matches.', text: 'U turns carry the bad edges round, so a rotated pattern is the same case. Turn U until the top layer matches a card, do its algorithm, then turn U back the same number of times. Every algorithm turns U a net zero times, so the top corners stay lined up. The cards list one case from each family.' },
  ],
  notes: [
    'Names and counts (bad edges on top / bottom; a = adjacent, o = opposite) follow Scheopner\'s LSE page. The 11 cards are his 9 non-mirror cases, with two mirror pairs shown both ways.',
    'Found by search: the shortest M/U sequences that keep the top corners lined up. His V + D-Line algorithm (M2 U\' M\' U M\') is the same as ours. His others turn U a net quarter or half turn (his F Arrow is M\' U M\'), which leaves the top corners out of line.',
    'All 32 bad-edge patterns were checked: each one ends with every edge oriented, the centres lined up and the top corners lined up.',
  ],
};

// 4b. "Left piece" = the edge that belongs at UL (yellow–red); "right piece" =
// the one that belongs at UR (yellow–orange). Centres lined up, edges oriented.
export const ulUrSteps = {
  goal: 'Put the left piece in UL and the right piece in UR, keeping every edge oriented. The other four edges can be anywhere.',
  how: [
    { title: 'Find the left piece and the right piece.', text: 'The yellow–red and yellow–orange edges.' },
    { title: 'Look up where they are.', text: 'Find their positions in the table below (30 cases, top corners lined up). Positions are named by where the edge sits now.' },
    { title: 'Do the moves.', text: 'Only M and U are used. At the end UL and UR are solved, every edge is oriented and the top corners are lined up. The centres may be turned; 4c fixes that.' },
  ],
  notes: [
    'The table gives the shortest sequence for each position that keeps the top corners lined up. Other sequences leave the M slice differently; DFDB (below) predicts that.',
    'Rule of thumb from the table: both pieces on the bottom is three moves; two in the top layer opposite each other is four (or five when they are swapped); one on the bottom is five to seven; neighbours in the top layer are six.',
  ],
  groups: [
    {
      heading: "Already in place",
      rows: [
        ["UL", "UR", "(nothing)"],
      ],
    },
    {
      heading: "Both in the top layer, opposite each other",
      rows: [
        ["UB", "UF", "M2 U M2 U'"],
        ["UF", "UB", "M2 U' M2 U"],
        ["UR", "UL", "U M2 U2 M2 U"],
      ],
    },
    {
      heading: "Both on the bottom",
      rows: [
        ["DF", "DB", "U M2 U'"],
        ["DB", "DF", "U' M2 U"],
      ],
    },
    {
      heading: "One in the top layer, one on the bottom",
      rows: [
        ["UL", "DF", "U M U2 M U"],
        ["UR", "DB", "U M U2 M' U"],
        ["DF", "UL", "U M' U2 M U"],
        ["DB", "UR", "U M' U2 M' U"],
        ["DF", "UR", "U' M U2 M U'"],
        ["DB", "UL", "U' M U2 M' U'"],
        ["UR", "DF", "U' M' U2 M U'"],
        ["UL", "DB", "U' M' U2 M' U'"],
        ["UF", "DB", "M U2 M U M2 U"],
        ["DB", "UF", "M U2 M U' M2 U'"],
        ["UB", "DF", "M U2 M' U M2 U"],
        ["DF", "UB", "M U2 M' U' M2 U'"],
        ["DB", "UB", "U2 M U2 M U M2 U'"],
        ["UB", "DB", "U2 M U2 M U' M2 U"],
        ["DF", "UF", "U2 M U2 M' U M2 U'"],
        ["UF", "DF", "U2 M U2 M' U' M2 U"],
      ],
    },
    {
      heading: "Both in the top layer, neighbours",
      rows: [
        ["UL", "UB", "M2 U M U2 M U"],
        ["UR", "UF", "M2 U M U2 M' U"],
        ["UB", "UL", "M2 U M' U2 M U"],
        ["UF", "UR", "M2 U M' U2 M' U"],
        ["UB", "UR", "M2 U' M U2 M U'"],
        ["UF", "UL", "M2 U' M U2 M' U'"],
        ["UR", "UB", "M2 U' M' U2 M U'"],
        ["UL", "UF", "M2 U' M' U2 M' U'"],
      ],
    },
  ],
  columns: ['Left piece is at', 'Right piece is at', 'Moves'],
};

// 4c. Centres lined up, UL/UR solved, everything oriented: 12 positions.
// `df` / `db` are the edges sitting in DF and DB (named by the slot they
// belong in) — that pair is the DFDB code. `moves` says where each other edge
// has to go ("UF → DB" means the edge now in UF belongs in DB).
export const mSliceCases = [
  { name: 'Solved', alg: '', df: 'DF', db: 'DB', moves: 'Nothing: the M slice is done.' },
  { name: '3-cycle: UF → UB → DB → UF (DF stays)', alg: "M U2 M' U2", df: 'DF', db: 'UF', moves: "UF edge → UB, UB edge → DB, DB edge → UF" },
  { name: '3-cycle: UF → DB → UB → UF (DF stays)', alg: "U2 M U2 M'", df: 'DF', db: 'UB', moves: "UF edge → DB, DB edge → UB, UB edge → UF" },
  { name: '3-cycle: UF → DF → UB → UF (DB stays)', alg: "M' U2 M U2", df: 'UB', db: 'DB', moves: "UF edge → DF, DF edge → UB, UB edge → UF" },
  { name: '3-cycle: UF → UB → DF → UF (DB stays)', alg: "U2 M' U2 M", df: 'UF', db: 'DB', moves: "UF edge → UB, UB edge → DF, DF edge → UF" },
  { name: '3-cycle: UB → DB → DF → UB (UF stays)', alg: "M2 U2 M' U2 M'", df: 'UB', db: 'DF', moves: "UB edge → DB, DB edge → DF, DF edge → UB" },
  { name: '3-cycle: UB → DF → DB → UB (UF stays)', alg: "M U2 M U2 M2", df: 'DB', db: 'UB', moves: "UB edge → DF, DF edge → DB, DB edge → UB" },
  { name: '3-cycle: UF → DF → DB → UF (UB stays)', alg: "M2 U2 M U2 M", df: 'DB', db: 'UF', moves: "UF edge → DF, DF edge → DB, DB edge → UF" },
  { name: '3-cycle: UF → DB → DF → UF (UB stays)', alg: "M' U2 M' U2 M2", df: 'UF', db: 'DF', moves: "UF edge → DB, DB edge → DF, DF edge → UF" },
  { name: 'Two swaps: UF ↔ UB and DF ↔ DB', alg: "U2 M2 U2 M2", df: 'DB', db: 'DF', moves: "UF edge ↔ UB edge, DF edge ↔ DB edge" },
  { name: 'Two swaps: UF ↔ DF and UB ↔ DB', alg: "M' U2 M2 U2 M'", df: 'UF', db: 'UB', moves: "UF edge ↔ DF edge, UB edge ↔ DB edge" },
  { name: 'Two swaps: UF ↔ DB and UB ↔ DF', alg: "U2 M' U2 M2 U2 M' U2", df: 'UB', db: 'UF', moves: "UF edge ↔ DB edge, UB edge ↔ DF edge" },
];

export const mSliceSteps = {
  goal: 'Solve the four M-slice edges and the four centres. UL and UR stay where they are.',
  how: [
    { title: 'Line the centres up.', text: 'Turn M, M\' or M2 until the centres match (U centre on top). That is the only turn needed before the case.' },
    { title: 'Read the case.', text: 'With the centres lined up, the edges in DF and DB identify the case (DFDB, below). Or compare the picture: 8 three-cycles and 3 pairs of swaps make up the 11 unsolved cases.' },
    { title: 'Do the algorithm.', text: 'Every algorithm uses only M and U2, so UL, UR and the orientation survive.' },
  ],
  notes: [
    'Checked: after 4a and 4b there are only 12 cases once the centres are lined up, and the edges in DF and DB fix which one. The lining-up turn and the matching card solve all 48 positions 4b can leave.',
    'Found by search (shortest M/U2 sequence for each case). Scheopner\'s page has the same cases: his 3-cycle algorithms (U2 M\' U2 M and M\' U2 M U2) are two of the cards above, move for move; his H (M2 U2 M2 U2) does the same as our U2 M2 U2 M2. His "Dots" (M\' E2 M E2) is our last card, and it needs E2, which is not an M/U move.',
  ],
};

// DFDB: which two edges to look at, and where they are before the centres are lined up.
export const dfdb = {
  intro:
    "DFDB recognises the 4c case from the two edges in DF and DB, once the centres are lined up. U turns never move DF and DB, so they change only when M is turned. The idea follows athefre's page, which tracks the DF and DB stickers through 4b.",
  rule: [
    'First, how far are the centres off? Look at where the top-colour centre is: on top (aligned), at the front (M needed), on the bottom (M2) or at the back (M\' needed).',
    'Second, with the centres lined up, which two edges are in DF and DB? Name an edge by the slot it belongs in (the UF edge is the yellow–green one, the UB edge the yellow–blue one, the DF edge the white–green one, the DB edge the white–blue one).',
    'Those two edges identify the case. All 12 combinations are listed in the table below, each with its algorithm.',
  ],
  // Which slots to read before the lining-up turn: the edges in these slots
  // are the ones that will be in DF and DB afterwards.
  beforeTurn: {
    heading: 'Read them before you turn',
    lead: 'You can read the case before turning: the edges that will be in DF and DB are already in the M slice.',
    columns: ['Centres are off by', 'Lining-up turn', 'Read the edges now in'],
    rows: [
      ['Aligned', '(none)', 'DF and DB'],
      ['Top centre is at the front', 'M', 'UF and DF'],
      ['Top centre is on the bottom', 'M2', 'UB and UF'],
      ['Top centre is at the back', "M'", 'DB and UB'],
    ],
    after: 'The first slot in each row is the one that will be in DF, the second the one that will be in DB.',
  },
  table: {
    heading: 'The 12 cases by DF and DB',
    columns: ['Edge in DF', 'Edge in DB', 'Case', 'Algorithm'],
  },
  // The sticker version of the same thing: does each sticker match the centre next to it?
  stickers: {
    heading: 'The same thing as sticker matches',
    lead: 'If you would rather not name edges: with the centres lined up, ask whether each sticker matches the centre it touches.',
    columns: ['Edge', 'Bottom sticker matches bottom centre?', 'Front/back sticker matches its centre?', 'So it is the'],
    rows: [
      ['In DF', 'Yes', 'Yes', 'DF edge'],
      ['In DF', 'No', 'Yes', 'UF edge'],
      ['In DF', 'Yes', 'No', 'DB edge'],
      ['In DF', 'No', 'No', 'UB edge'],
      ['In DB', 'Yes', 'Yes', 'DB edge'],
      ['In DB', 'No', 'Yes', 'UB edge'],
      ['In DB', 'Yes', 'No', 'DF edge'],
      ['In DB', 'No', 'No', 'UF edge'],
    ],
  },
  sources: [
    ['athefre — DFDB recognition (opened)', 'https://sites.google.com/site/athefre/roux/dfdb-recognition'],
    ['Scheopner — Roux: Last Six Edges (opened; names, 4c and EO algorithms compared)', 'https://www.scheopner.com/cube/lse.php'],
    ['Roux method, Speedsolving wiki (not opened from here)', 'https://speedsolving.com/wiki/index.php?title=Roux'],
    ['Last Six Edges (L7E), Speedsolving wiki (not opened from here)', 'https://www.speedsolving.com/wiki/index.php?title=L7E'],
    ['Edge orientation (EO), Speedsolving wiki (not opened from here)', 'https://www.speedsolving.com/wiki/index.php?title=EO'],
  ],
  caveat:
    "Checked: the DF and DB edges identify the 4c case in all 48 positions. The table is our own. athefre's page gives the idea but no table; Scheopner's predicts the case another way, so nothing here is copied from either.",
};

// The one LSE card from the user's own notes, kept as written.
export const rouxLseCases = [
  {
    id: 'lse-4c',
    name: 'LSE — 4-edge recognition (2 opposite already oriented)',
    stickering: 'eo',
    diagramViews: ['U', 'D'],
    orientation:
      'With 2 opposite edges already oriented (your "2o/2"): set them left/right, then M or M\' + U2 and reverse.',
    alg: "M U2 M",
    altAlg: "M' U2 M'",
    note: 'Whichever direction you set the pair to left/right decides M vs M\' — both are the same idea mirrored.',
  },
];

export const yourNote = {
  intro:
    "Kept as you recorded it. We read your \"2o/2\" as the (U+D)-Line case on Scheopner's page. On its own, M U2 M changes no edge's orientation, but it is the first three moves of that case's algorithm, shown below. This is a reading, not something you wrote: please confirm or correct it.",
  extra: [
    {
      id: 'lse-4c-full',
      name: 'The whole (U+D)-Line algorithm — your card is its first three moves',
      stickering: 'eo',
      diagramViews: ['U', 'D'],
      orientation: 'UL, UR, DF and DB bad; UF and UB good. Your M U2 M, then U2 M\' U M\' and U\' to line the corners up. Mirror (M\' first): Scheopner\'s M\' U2 M\' U2 M U M, which leaves the top corners a quarter turn out.',
      alg: "M U2 M U2 M' U M' U'",
      altAlg: "M' U2 M' U2 M U M",
    },
  ],
};
