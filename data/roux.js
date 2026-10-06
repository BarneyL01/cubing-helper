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
export const rouxCmllCases = cornerOrientationCases;

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
    'After CMLL, the only unsolved pieces are six edges and the M-slice centres. M and U are the only moves that leave both blocks alone, so LSE is done with those two alone. Start with the top corners lined up with the blocks (turn U if CMLL left them a turn out); every step below ends with them lined up again.',
  pieces: [
    'UL and UR: the yellow–red and yellow–orange edges. They belong to the blocks, so they have to end up on the left and right.',
    'UF, UB, DF and DB: the yellow–green, yellow–blue, white–green and white–blue edges. They sit in the M slice with the four centres.',
  ],
};

// 4a. Each card's picture shows a position the algorithm solves; the picture
// is the case seen with the centres lined up (the U centre on top).
// Positions are listed in the order UF UB UL UR DF DB; x = bad edge.
export const eoCases = [
  { pattern: '.xxx.x', alg: "M U M' U'", name: 'Arrow — 3 bad on top, DB bad', note: 'Top layer: UB, UL and UR are bad; UF is good. DB is bad.' },
  { pattern: 'x.xxx.', alg: "M' U M U'", name: 'Arrow — 3 bad on top, DF bad', note: 'Top layer: UF, UL and UR are bad; UB is good. DF is bad.' },
  { pattern: '.xx.xx', alg: "M2 U' M' U M'", name: '2 bad on top (neighbours) + DF and DB bad', note: 'UB and UL are bad, and both bottom edges are bad.' },
  { pattern: '...xx.', alg: "M U' M U2 M' U' M'", name: '1 bad on top + DF bad', note: 'UR is bad and DF is bad.' },
  { pattern: '..x..x', alg: "M' U' M U2 M U' M'", name: '1 bad on top + DB bad', note: 'UL is bad and DB is bad.' },
  { pattern: '.x.x..', alg: "M' U' M U2 M' U' M", name: '2 bad on top (neighbours), bottom good', note: 'UB and UR are bad; both bottom edges are good.' },
  { pattern: '....xx', alg: "M U M U' M' U M' U'", name: 'Only DF and DB bad', note: 'The whole top layer is good; both bottom edges are bad.' },
  { pattern: 'xxxx..', alg: "M U2 M U2 M U M U'", name: 'All 4 top edges bad', note: 'UF, UB, UL and UR are bad; both bottom edges are good.' },
  { pattern: '..xxxx', alg: "M U2 M U2 M' U M' U'", name: '2 bad on top (UL, UR) + DF and DB bad', note: 'UL and UR are bad, and so are both bottom edges.' },
  { pattern: 'xx....', alg: "M U M' U' M U M' U'", name: '2 bad on top (UF, UB), bottom good', note: 'UF and UB are bad; UL and UR are good.' },
  { pattern: 'xxxxxx', alg: "M U M U M' U M U2 M U' M", name: 'All 6 edges bad', note: 'The rarest and the longest case.' },
];

export const eoSteps = {
  goal: 'Orient all six edges (no edge "flipped"), with the centres lined up again afterwards.',
  how: [
    { title: 'Line the centres up.', text: 'Turn M until the top centre is the top colour (yellow here). Orientation is judged against the centres, not against the faces of the cube.' },
    { title: 'Find the bad edges.', text: 'A bad edge has its yellow or white sticker on a face that does not have a yellow or white centre. Top-layer edge: it is bad unless its yellow/white sticker is on top. Bottom-layer edge: bad unless its yellow/white sticker is on the bottom.' },
    { title: 'Count them.', text: 'There is always an even number: 0, 2, 4 or 6. If there are none, go straight to 4b.' },
    { title: 'Turn U until the picture matches.', text: 'U turns carry the bad top-layer edges around, so any rotation of a pattern is the same case. Turn U until the top layer looks like the card, do its algorithm, then turn U back the same number of turns the other way. (Every algorithm here turns U a net zero times, so the top corners are still lined up with the blocks afterwards.) The cards below list one case from each family.' },
  ],
  notes: [
    'The algorithms were found by search (shortest M/U sequence for each family that ends with every edge oriented, the centres lined up and the top corners back where they started) — they are not from a guide, and other short ones exist. Arrow is the well-known case: M U M\' is the usual arrow algorithm, and M U M\' U\' here is the same with the corners put back.',
    'All 32 bad-edge patterns were checked: each, turned by U to the card that matches it, solved by the card, then turned back, ends with every edge oriented, the centres lined up and the top corners lined up with the blocks.',
  ],
};

// 4b. "Left piece" = the edge that belongs at UL (yellow–red); "right piece" =
// the one that belongs at UR (yellow–orange). Centres lined up, edges oriented.
export const ulUrSteps = {
  goal: 'Put the left piece in UL and the right piece in UR, keeping every edge oriented. The other four edges can be anywhere.',
  how: [
    { title: 'Find the left piece and the right piece.', text: 'The yellow–red edge and the yellow–orange edge (the edges that belong with the left and right blocks).' },
    { title: 'Look up where they are.', text: 'The table below has all 30 positions, read with the top corners lined up with the blocks (4a leaves them that way). Positions are named by where an edge sits now: UL, UR, UF, UB (top layer) or DF, DB (bottom).' },
    { title: 'Do the moves.', text: 'Every sequence is only M, U and their inverses. Every edge is still oriented at the end, UL and UR are in place and the top corners are lined up with the blocks again (the turns of U add up to zero). The centres may end up turned: that is dealt with at the start of 4c.' },
  ],
  notes: [
    'The table gives the shortest sequence found for each position that also leaves the top corners lined up. Other sequences exist, and they leave the M slice in a different arrangement, which is exactly what DFDB (below) lets you predict and choose between.',
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
    { title: 'Line the centres up.', text: 'Turn M, M\' or M2 until the centres match the sides again (the U centre on top). That is the only turn you ever need before the case; a solved case ends here.' },
    { title: 'Read the case.', text: 'With the centres lined up and UL/UR solved, the edges in DF and DB (the "DFDB" pair, next section) identify it. Or compare the picture: the 11 unsolved cases are 8 three-cycles and 3 pairs of swaps.' },
    { title: 'Do the algorithm.', text: 'Every one uses only M and U2, so UL, UR and the orientation survive. The cube is solved when it finishes.' },
  ],
  notes: [
    'Only 12 cases: checked in the simulator, after 4a and 4b the four M-slice edges cannot be in just any arrangement. Once the centres are lined up, the edges in DF and DB fix where the other two are. In all 48 positions that 4b can leave (12 for each turn of the centres), the lining-up turn followed by the matching card solves the cube.',
    'Algorithms were found by search (shortest M/U2 sequence for each case), not taken from a guide; other algorithms exist for the same cases, including ones that start with M2.',
  ],
};

// DFDB: which two edges to look at, and where they are before the centres are lined up.
export const dfdb = {
  intro:
    "DFDB is a way to recognise the 4c case from only two edges: the one in DF and the one in DB. U turns never touch those two slots, so during 4b they only move when you turn M, and you can follow them — and know the 4c case before 4b is even finished.",
  rule: [
    'First, how far are the centres off? Look at where the top-colour centre is: on top (aligned), at the front (M needed), on the bottom (M2) or at the back (M\' needed).',
    'Second, with the centres lined up, which two edges are in DF and DB? Name an edge by the slot it belongs in (the UF edge is the yellow–green one, the UB edge the yellow–blue one, the DF edge the white–green one, the DB edge the white–blue one).',
    'Those two edges identify the case. All 12 combinations are listed in the table below, each with its algorithm.',
  ],
  // Which slots to read before the lining-up turn: the edges in these slots
  // are the ones that will be in DF and DB afterwards.
  beforeTurn: {
    heading: 'Read them before you turn',
    lead: 'You do not have to turn M to read the case: the edges that will be in DF and DB after the lining-up turn are already somewhere in the M slice.',
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
    lead: 'If you would rather not name edges: with the centres lined up, each of the two edges has two stickers that touch two centres. Ask whether each sticker matches the centre it touches.',
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
    ['Roux method, Speedsolving wiki', 'https://speedsolving.com/wiki/index.php?title=Roux'],
    ['Last Six Edges (L7E), Speedsolving wiki', 'https://www.speedsolving.com/wiki/index.php?title=L7E'],
    ["Edge orientation (EO), Speedsolving wiki", 'https://www.speedsolving.com/wiki/index.php?title=EO'],
    ['athefre\'s Roux pages (DFDB is credited to athefre in the results I found)', 'https://sites.google.com/site/athefre'],
  ],
  caveat:
    "The community's DFDB follows one fixed pair of stickers and a centre comparison. I could not open those pages from here, so the tables below are my own equivalent, built and checked with the simulator — compare them with athefre's version before relying on the exact wording.",
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
    "Kept exactly as you recorded it. Checked in the simulator: neither M U2 M nor M' U2 M' changes any edge's orientation, so they are not a 4a (orientation) algorithm. All four swap UL and UR (and turn the top corners half a turn); M U2 M and M' U2 M' also turn the centres half way. So they are not orientation algorithms. Your text says \"M or M' + U2 and reverse\", which reads as M U2 M' — that is a different sequence from M U2 M, and it also leaves every edge oriented. I could not tell which you meant, so both are on the page.",
  extra: [
    {
      id: 'lse-4c-text',
      name: "Your text read literally: M U2 M'",
      stickering: 'eo',
      diagramViews: ['U', 'D'],
      orientation: 'M, then U2, then M reversed (M\').',
      alg: "M U2 M'",
      altAlg: "M' U2 M",
    },
  ],
};
