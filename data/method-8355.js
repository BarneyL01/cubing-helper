// The 8355 method (3x3 beginner method) by Reheart Sheu.
//
// Source: Speedsolving.com Wiki, "8355 Method"
// https://www.speedsolving.com/wiki/index.php/8355_Method — pasted in by the
// user on 2026-10-03 and rewritten here. The user calls R U R' U' "Sassy"
// (never the wiki's name for it); the wiki's "Sexy Method" variant is listed
// as "Sassy Method".
//
// Everything below was checked with js/cube-sim.js (see
// log/2026-10-03-8355-method.md): what every algorithm does to which pieces,
// both worked examples, and the last-five-corners procedure over thousands of
// random positions. Where the wiki is silent or its text needed a fix, the
// step has a "notes" paragraph saying what was added and why.

const SASSY = "R U R' U'";
const sassy = [{ word: 'Sassy', moves: SASSY }];
const times = (alg, n) => Array(n).fill(alg).join(' ');

export const facts = [
  ['Proposed by', 'Reheart Sheu'],
  ['Type', 'Beginner method (layer by layer, with a keyhole)'],
  ['Algorithms', '1 to 3 — essentially just Sassy, its inverse and its mirrors'],
  ['Average moves', '100+'],
  ['Variants', 'Sassy Method, MirIS, Y-Move Method'],
  ['Path', 'Cross → 3 corners → 3 middle edges → remaining edges → last 5 corners'],
];

export const steps8355 = [
  {
    id: 'step-1',
    title: 'Cross',
    short: 'Cross',
    source: 'wiki',
    goal: 'A cross on the bottom: four edges in place, each matching its side centre.',
    how: [
      'Hold the cross on the bottom for the first four steps.',
      'Solve it however you like; there is no algorithm. Plan it during inspection to keep the move count down.',
    ],
    cases: [
      {
        anchor: 'cross',
        name: 'Solve the cross',
        orientation: 'Intuitive.',
        displayAlg: 'Intuitive — no algorithm',
        noViewer: true,
      },
    ],
  },
  {
    id: 'step-2',
    title: 'Three corners',
    short: 'Corners',
    source: 'wiki',
    goal: 'Three of the four bottom corners in place. The fourth stays unsolved: it is the keyhole in step 3.',
    how: [
      'Find a white corner in the top layer.',
      'Turn the top layer so the corner is above its slot, with that slot at the front-right.',
      'Repeat Sassy until it drops in: 1, 3 or 5 times, depending on where its white sticker faces.',
      'Do this for three corners. Leave the fourth bottom corner alone.',
    ],
    cases: [
      {
        anchor: 'corner-white-right',
        name: 'White facing right',
        orientation: 'Sassy once.',
        alg: SASSY,
        stickering: 'layer1',
        diagramViews: ['cube'],
        mnemonicChunks: sassy,
      },
      {
        anchor: 'corner-white-up',
        name: 'White facing up',
        orientation: 'Sassy three times.',
        alg: times(SASSY, 3),
        displayAlg: `(${SASSY}) ×3`,
        stickering: 'layer1',
        diagramViews: ['cube'],
        mnemonicChunks: [{ word: 'Sassy×3', moves: `(${SASSY})×3` }],
      },
      {
        anchor: 'corner-white-front',
        name: 'White facing front',
        orientation: 'Sassy five times.',
        alg: times(SASSY, 5),
        displayAlg: `(${SASSY}) ×5`,
        stickering: 'layer1',
        diagramViews: ['cube'],
        mnemonicChunks: [{ word: 'Sassy×5', moves: `(${SASSY})×5` }],
      },
    ],
  },
  {
    id: 'step-3',
    title: 'Three middle edges (keyhole)',
    short: 'Middle edges',
    source: 'wiki',
    goal: 'Three of the four middle-layer edges in place, using the unsolved bottom corner as a keyhole.',
    how: [
      'Find a top edge with no yellow; it belongs in the middle layer. Put its slot at the front-right.',
      {
        title: 'Keyhole:',
        text: 'turn the bottom layer so the unsolved bottom corner is under that slot.',
      },
      'Turn the top layer to the spot on card 1 or 2, then do that algorithm.',
      'Cards 3 and 4 do the same without the keyhole.',
      'Do this for three edges. The fourth middle slot stays empty for step 4.',
    ],
    notes: [
      'Added here, not on the wiki: the bottom layer ends up out of line during the keyhole steps. Step 5 lines it up. If the keyhole corner is already solved, use cards 3 and 4.',
    ],
    cases: [
      {
        anchor: 'keyhole-front',
        name: '1 · Keyhole: edge at the front',
        orientation:
          'Top front edge: front sticker matches the right centre, top sticker the front centre. Unsolved corner under the front-right slot.',
        alg: "R U' R'",
        stickering: 'f2l',
        diagramViews: ['cube'],
        mnemonicChunks: [{ word: 'RVP', moves: "R U' R'" }],
      },
      {
        anchor: 'keyhole-right',
        name: '2 · Keyhole: edge at the right',
        orientation:
          'Top right edge: right sticker matches the front centre, top sticker the right centre. Unsolved corner under the front-right slot.',
        alg: "F' U F",
        stickering: 'f2l',
        diagramViews: ['cube'],
        mnemonicChunks: [
          { word: 'G', moves: "F'" },
          { word: 'U', moves: 'U' },
          { word: 'F', moves: 'F' },
        ],
      },
      {
        anchor: 'no-keyhole-right',
        name: '3 · Without the keyhole: slot at the right',
        orientation:
          'Top right edge above its own centre: right sticker matches the right centre, top sticker the front centre. Goes to the front-right slot; bottom untouched.',
        alg: "R' U' R' U' R' U R U R",
        stickering: 'f2l',
        diagramViews: ['cube'],
        mnemonicChunks: [
          { word: 'P', moves: "R'" },
          { word: 'V', moves: "U'" },
          { word: 'P', moves: "R'" },
          { word: 'V', moves: "U'" },
          { word: 'Pure', moves: "R' U R" },
          { word: 'U', moves: 'U' },
          { word: 'R', moves: 'R' },
        ],
      },
      {
        anchor: 'no-keyhole-left',
        name: '4 · Without the keyhole: slot at the left',
        orientation:
          'Mirror of card 3: top left edge above its own centre, its top sticker matches the front centre. It goes into the front-left slot.',
        alg: "L U L U L U' L' U' L'",
        stickering: 'f2l',
        diagramViews: ['cube'],
        note: "No mnemonic: your letter code doesn't have a letter for L moves yet.",
      },
    ],
  },
  {
    id: 'step-4',
    title: 'Remaining edges',
    short: 'Edges',
    source: 'wiki',
    goal: 'Every edge solved. Only five corners are left.',
    how: [
      {
        title: 'The picture to keep in mind.',
        text: 'Five edges are loose: four in the top layer and one in the empty middle slot. Treat the top layer as a ring; turning it never changes the ring\'s order.',
      },
      {
        title: 'The one move: a cycle.',
        text: "R lifts the slot's edge to the top right. A turn of the top layer (U, U' or U2) brings a ring edge there, and R' drops it into the slot. F' U F does the same from the front. Card 1 shows one cycle.",
      },
      {
        title: 'Part A: three top edges.',
        text: 'Put the empty slot at the front-right. Choose the cycle that lands the slot\'s edge beside its ring partner. Repeat until three ring edges are in order.',
      },
      {
        title: 'Part B: the last two edges.',
        text: "Check the slot edge's yellow sticker: facing front, card 2; facing right, card 3. Turn the top so the unsolved top edge is at the front or right.",
      },
      'Turn the top layer to line it up with the side centres.',
    ],
    notes: [
      "Checked: the cycle solves all 1,920 arrangements of these five edges in at most 5 cycles. I haven't found a simple rule for part A (the wiki calls it intuitive). The wiki's swap algorithms, R U R' U R U R' and F' U' F U' F' U' F, are cards 2 and 3 without the final turn; with it they solved all 32 arrangements tried.",
    ],
    cases: [
      {
        anchor: 'one-cycle',
        name: '1 · One cycle, move by move',
        orientation: 'The first cycle of card 2, after each move. Only edges are coloured.',
        alg: "R U R'",
        displayAlg: "R U R'",
        extraAlgs: [
          { label: "Other turns of the top layer", alg: "R U' R'    R U2 R'" },
          { label: 'From the front instead', alg: "F' U F    F' U' F    F' U2 F" },
        ],
        mnemonicChunks: [
          { word: 'R', moves: 'R' },
          { word: 'U', moves: 'U' },
          { word: 'P', moves: "R'" },
        ],
        noViewer: true,
        filmstrip: {
          alg: "R U R' U R U R' U2",
          marks: [
            { piece: 'FR', colour: 'pink' },
            { piece: 'FU', colour: 'blue' },
          ],
          legend: [
            { colour: 'pink', text: 'the green/orange edge, which belongs in the middle slot' },
            { colour: 'blue', text: 'the yellow/green edge, which belongs at the top front' },
          ],
          frames: [
            {
              after: '',
              caption: 'Blue is stuck in the slot; pink is at the top front.',
            },
            {
              after: 'R',
              caption: 'R lifts blue to the top right. Two other edges move; R\' puts them back.',
            },
            {
              after: 'U',
              caption: 'U: blue reaches the top front. Yellow/blue is now top right, ready to drop.',
            },
            {
              after: "R'",
              caption: 'R\' drops yellow/blue into the slot. Blue is in place: one cycle done.',
            },
          ],
        },
      },
      {
        anchor: 'swap-plain',
        name: '2 · Last two edges: yellow faces front',
        orientation:
          'Slot edge\'s yellow faces front. Turn the top so the unsolved top edge is at the front. Then cycle, turn, cycle, line up.',
        alg: "R U R' U R U R' U2",
        mnemonicChunks: [
          { word: 'Ugly', moves: "R U R' U" },
          { word: 'R', moves: 'R' },
          { word: 'U', moves: 'U' },
          { word: 'P', moves: "R'" },
          { word: 'U2', moves: 'U2' },
        ],
        noViewer: true,
        filmstrip: {
          alg: "R U R' U R U R' U2",
          marks: [
            { piece: 'FR', colour: 'pink' },
            { piece: 'FU', colour: 'blue' },
          ],
          legend: [
            { colour: 'pink', text: 'the green/orange edge, which belongs in the middle slot' },
            { colour: 'blue', text: 'the yellow/green edge, which belongs at the top front' },
          ],
          frames: [
            {
              after: '',
              caption: 'Pink is at the top front; blue is in the slot, yellow facing front.',
            },
            {
              after: "R U R'",
              caption: 'First cycle: blue is back at the top front. Pink has moved to the top left.',
            },
            {
              after: 'U',
              caption: 'U: a quarter turn. It changes only where the next lift lands.',
            },
            {
              after: "R U R'",
              caption: 'Second cycle: pink drops into the slot. The top edges are in order, just turned.',
            },
            {
              after: 'U2',
              caption: 'U2 lines the top layer up with the side centres: every edge is solved.',
            },
          ],
          every: { summary: 'Show every single move' },
        },
      },
      {
        anchor: 'swap-flipped',
        name: '3 · Last two edges: yellow faces right',
        orientation:
          'Slot edge\'s yellow faces right. Turn the top so the unsolved top edge is at the right. Then cycle, turn, cycle, line up, from the front.',
        alg: "F' U' F U' F' U' F U2",
        mnemonicChunks: [
          { word: 'G', moves: "F'" },
          { word: 'V', moves: "U'" },
          { word: 'F', moves: 'F' },
          { word: 'V', moves: "U'" },
          { word: 'G', moves: "F'" },
          { word: 'V', moves: "U'" },
          { word: 'F', moves: 'F' },
          { word: 'U2', moves: 'U2' },
        ],
        noViewer: true,
        filmstrip: {
          alg: "F' U' F U' F' U' F U2",
          marks: [
            { piece: 'FR', colour: 'pink' },
            { piece: 'RU', colour: 'blue' },
          ],
          legend: [
            { colour: 'pink', text: 'the green/orange edge, which belongs in the middle slot' },
            { colour: 'blue', text: 'the yellow/orange edge, which belongs at the top right' },
          ],
          frames: [
            {
              after: '',
              caption: 'Pink is at the top right; blue is in the slot, yellow facing right.',
            },
            {
              after: "F' U' F",
              caption: 'First cycle: blue is back at the top right. Pink has moved to the top back.',
            },
            {
              after: "U'",
              caption: "U': a quarter turn the other way. It changes only where the next lift lands.",
            },
            {
              after: "F' U' F",
              caption: 'Second cycle: pink drops into the slot. The top edges are in order, just turned.',
            },
            {
              after: 'U2',
              caption: 'U2 lines the top layer up with the side centres: every edge is solved.',
            },
          ],
          every: { summary: 'Show every single move' },
        },
      },
    ],
  },
  {
    id: 'step-5',
    title: 'Last five corners',
    short: 'Last corners',
    source: 'wiki',
    goal: 'The cube solved. Only Sassy, bottom-layer turns and one whole-cube rotation.',
    how: [
      'Flip the cube so four of the five unsolved corners are in the bottom layer and the fifth, the buffer, is at the top front-right.',
      'Added (see note): turn the bottom layer so an unsolved bottom corner is under the buffer.',
      "If the buffer has no yellow, do Sassy once to bring a bottom corner up into it.",
      'Turn the bottom layer so the buffer is above its slot (between the two bottom edges that match its colours).',
      'Repeat Sassy until that corner is solved in the bottom layer (1, 3 or 5 times).',
      'Repeat steps 2–5 until only one unsolved bottom corner is left.',
      "Turn the bottom layer so that corner is under the buffer. Repeat Sassy until the cube is solved, or only two twisted corners are left. If the bottom is solved but the top is not, keep going.",
      'Two twisted corners left: use the second card.',
      'Turn the bottom layer to line it up with the sides. Solved.',
    ],
    notes: [
      "Added here, not on the wiki: (a) turn the bottom layer so an unsolved corner is under the buffer before each round; (b) how to finish the last two twisted corners (card 2). The wiki's whole-cube rotation cannot hold both when they sit at opposite corners. These steps solved all 3,000 random positions tested (at most 24 Sassys, 15 on average).",
    ],
    cases: [
      {
        anchor: 'place-buffer',
        name: '1 · Place the buffer corner',
        orientation: 'Bottom layer turned so the buffer corner is above its slot, then repeat.',
        alg: SASSY,
        displayAlg: `(${SASSY}) × 1, 3 or 5`,
        mnemonicChunks: sassy,
        noViewer: true,
      },
      {
        anchor: 'two-twisted',
        name: '2 · Two twisted corners left',
        orientation:
          "Turn the bottom layer so an unsolved corner is under the buffer. If the buffer is twisted, rotate x' so both are in the bottom layer. Sassy until the front-right corner is solved (2 or 4 times). Turn the bottom so the other twisted corner is front-right, then Sassy the remaining 4 or 2 times. Turn the bottom back, rotate back (x if you rotated), then line up.",
        alg: SASSY,
        displayAlg: `x'  (${SASSY}) ×2 or ×4  D'  (${SASSY}) ×4 or ×2  D  x`,
        mnemonicChunks: [{ word: 'Sassy', moves: SASSY }],
        noViewer: true,
      },
    ],
  },
];

// Worked examples from the wiki. "(…)×n" repeats the group n times. The
// wiki's final-corners example leaves out the last bottom-layer turn; the
// row marked "added" is that turn (the cube is not solved without it).
export const exampleSolve = {
  scramble: "F2 D' B2 R2 B2 D U2 L2 U' B2 F D2 B D2 R2 U' F R F' L' D'",
  rows: [
    ['Cross (intuitive)', "R' L' F U L R2 B2"],
    ['Corner 1 — Sassy', "(R U R' U')"],
    ['Corner 2 — Sassy', "y' (R U R' U')"],
    ['Corner 3 — Sassy ×3', "y' d (R U R' U')×3"],
    ['Middle edge 1', "y2 (R' U' R' U' R' U R U R)"],
    ['Middle edge 2', "d2 (R' U' R' U' R' U R U R)"],
    ['Middle edge 3', "y' U' (R' U' R' U' R' U R U R)"],
    ['Three top edges (intuitive)', "y2 U2 R U' R' y L' U L"],
    ['Last two edges: bring the last top edge into the slot', "y' (R U R' U R U R')"],
    ['Last two edges: insert it', "y U (L' U' L U' L' U' L)"],
    ['Flip the cube; corners — Sassy ×3', "x2 y2 D (R U R' U')×3"],
    ['Corner — Sassy', "D (R U R' U')"],
    ['Corner — Sassy ×5', "D2 (R U R' U')×5"],
    ['Last corner — Sassy ×3, then turn the bottom layer', "D2 (R U R' U')×3 D2"],
  ],
};

export const lastFiveExample = {
  scramble: "R U R' D R U' R' D' R U R' D' R U' R' D",
  rows: [
    ['First corner', "D' (R U R' U')"],
    ['Bring the second corner into the buffer', "D (R U R' U')"],
    ['Solve the second corner — Sassy ×5', "D (R U R' U')×5"],
    ['Third corner: it is solved, but the rest of the cube looks scrambled — keep going', "D' (R U R' U')"],
    ['Keep going until only two twisted corners are left', "(R U R' U')×4"],
    ['Rotate so both twisted corners are in the bottom layer', "x'"],
    ['Solve the first twisted corner', "(R U R' U')×4"],
    ['Solve the second twisted corner', "D' (R U R' U')×2"],
    ['Turn the bottom layer back (added)', 'D'],
  ],
};

// Shorter ways to place the first corners (step 2). Each row's pictured
// position was found by simulation: the corner above its slot, white sticker
// facing right / front / up.
export const cornerShortcuts = [
  ['Right', 'Sassy ×1', "R U R'"],
  ['Front', "Sassy ×5", "U R U' R' (Sassy backwards) or F' U' F"],
  ['Up', 'Sassy ×3', "R B U2 B' R'"],
];

export const fasterTips = [
  { text: 'Cross: plan all of it during inspection and keep the move count low.' },
  { text: 'Corners: the shorter inserts in the table above, instead of repeating Sassy.' },
  { text: 'Middle edges: build a corner-and-edge pair in the top layer and insert both together.', href: '../cfop/f2l.html', link: 'F2L map' },
  { text: 'Top edges: build corner-and-edge pairs while solving the edges, so fewer corners are left at the end (the Heise method).' },
  { text: "Last five corners: use Sassy backwards (U R U' R') for any corner that would need five Sassys. More advanced: commutators solve several corners at once (the last step of the Heise method)." },
];
