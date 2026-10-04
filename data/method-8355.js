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
      'Solve it however you like — it is intuitive, with no algorithm. Planning the whole cross during inspection keeps the move count down.',
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
      'Turn the top layer until it is above the slot it belongs in, with that slot at the front-right.',
      'Repeat Sassy until it drops in solved: 1, 3 or 5 times, depending on which way its white sticker faces (cards below).',
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
      'Look for an edge in the top layer with no yellow on it — it belongs in the middle layer. Hold its slot at the front-right.',
      {
        title: 'Keyhole:',
        text: 'turn the bottom layer so the unsolved bottom corner is directly under that slot (bottom front-right).',
      },
      'Turn the top layer to bring the edge to the spot shown on card 1 or card 2, then do that algorithm.',
      'Cards 3 and 4 do the same job without the keyhole and leave the bottom layer alone.',
      'Do this for three edges. The fourth middle slot stays empty for step 4.',
    ],
    notes: [
      'Added here, not on the wiki: the bottom layer ends up turned out of line with the sides during the keyhole steps. Leave it — it is lined up at the very end of step 5. If the keyhole corner happens to end up solved, use cards 3 and 4 for the remaining edges.',
    ],
    cases: [
      {
        anchor: 'keyhole-front',
        name: '1 · Keyhole: edge at the front',
        orientation:
          "Edge at the top front: its front sticker is the colour of the right-hand centre, its top sticker is the colour of the front centre. Unsolved bottom corner under the front-right slot.",
        alg: "R U' R'",
        stickering: 'f2l',
        diagramViews: ['cube'],
        mnemonicChunks: [{ word: 'RVP', moves: "R U' R'" }],
      },
      {
        anchor: 'keyhole-right',
        name: '2 · Keyhole: edge at the right',
        orientation:
          "Edge at the top right: its right sticker is the colour of the front centre, its top sticker is the colour of the right-hand centre. Unsolved bottom corner under the front-right slot.",
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
          "Edge at the top right, sitting above its own centre: its right sticker matches the right-hand centre and its top sticker is the colour of the front centre. Goes into the front-right slot; the bottom layer is not touched.",
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
          "The mirror image of card 3: edge at the top left above its own centre, its top sticker is the colour of the front centre. Goes into the front-left slot.",
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
        text: 'Five edges are still loose: the four in the top layer and the one in the empty middle slot. Treat the top layer as a ring. The ring edges only have to be in the right order relative to each other — turning the top layer never changes that order, so you line the ring up with the side centres at the very end.',
      },
      {
        title: 'The one move: a cycle.',
        text: "R lifts the edge in the slot up to the top right. Turn the top layer. R' drops whichever edge has arrived at the top right down into the slot. So each cycle puts the slot's edge into the ring and takes one ring edge down into the slot. How far you turn the top layer (U, U' or U2) decides where the lifted edge lands and which edge is dropped. F' U F does the same from the front. Card 1 shows one cycle move by move.",
      },
      {
        title: 'Part A — three top edges.',
        text: 'Hold the empty slot at the front-right. Look at the edge in the slot and work out where in the ring it belongs, beside the top edges that are already right. Choose the cycle (R or F\', and the turn) that lands it there. Repeat until three ring edges are in the right order relative to each other.',
      },
      {
        title: 'Part B — the last two edges.',
        text: "Now the edge in the slot belongs in the ring and the ring's leftover edge belongs in the slot: they have traded places. Do the cycle twice, with a turn of the top layer between (cards 2 and 3). Look at the yellow sticker of the edge in the slot: facing front → card 2; facing right → card 3. Turn the top layer first so the unsolved top edge is where the first picture shows it (front for card 2, right for card 3).",
      },
      'Turn the top layer to line it up with the side centres.',
    ],
    notes: [
      "Checked in the simulator: the cycle on its own (R or F' with a turn of the top layer, plus free top-layer turns) solves every one of the 1,920 possible arrangements of these five edges, in at most 5 cycles — most take 2 or 3. I haven't found a simple rule that always picks the best cycle for part A (the wiki calls it intuitive); if a cycle makes things worse, undo it with its reverse and try the other turn. Part B is exact: the wiki's two swap algorithms R U R' U R U R' and F' U' F U' F' U' F are cards 2 and 3 without the final turn, and with it they solved all 32 arrangements tried.",
    ],
    cases: [
      {
        anchor: 'one-cycle',
        name: '1 · One cycle, move by move',
        orientation:
          'The first cycle of card 2, drawn after each move. The pictures show the top view and the cube from the front-right; only edges are coloured.',
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
              caption:
                'The yellow/green edge (blue) is stuck in the slot. The green/orange edge (pink) is up at the top front.',
            },
            {
              after: 'R',
              caption:
                "R lifts the slot's edge up to the top right (blue). It also drags the bottom-right edge up into the slot and sends the old top-right edge down to the back-right — R' puts both back.",
            },
            {
              after: 'U',
              caption:
                'U turns the top layer a quarter turn clockwise. The blue edge goes round to the top front, where it belongs. The edge that has arrived at the top right (yellow/blue) is the one that will be dropped.',
            },
            {
              after: "R'",
              caption:
                "R' drops the yellow/blue edge into the slot and puts the other two edges back. One cycle done: the blue edge is in its place.",
            },
          ],
        },
      },
      {
        anchor: 'swap-plain',
        name: '2 · Last two edges: yellow faces front',
        orientation:
          'The yellow sticker of the slot edge faces front. Turn the top layer so the unsolved top edge is at the front. Then: cycle, turn, cycle, and line the top layer up.',
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
              caption:
                'The two edges have traded places: the green/orange edge (pink) is at the top front, the yellow/green edge (blue) is in the slot with its yellow sticker facing front. The other three top edges are right relative to each other.',
            },
            {
              after: "R U R'",
              caption:
                'First cycle. The yellow/green edge (blue) is back at the top front, and the top-right edge is right too. The slot now holds the yellow/blue edge, and the green/orange edge (pink) has been carried round to the top left. Three edges are still out of place.',
            },
            {
              after: 'U',
              caption: "A quarter turn of the top layer (U). It only changes where the second cycle's lift lands.",
            },
            {
              after: "R U R'",
              caption:
                'Second cycle. The green/orange edge (pink) has dropped into the slot, and the four top edges are in the right order relative to each other — the top layer is just turned.',
            },
            {
              after: 'U2',
              caption: 'Half a turn of the top layer lines it up with the side centres: every edge is solved.',
            },
          ],
          every: { summary: 'Show every single move' },
        },
      },
      {
        anchor: 'swap-flipped',
        name: '3 · Last two edges: yellow faces right',
        orientation:
          "The yellow sticker of the slot edge faces right. Turn the top layer so the unsolved top edge is at the right. Then the same thing from the front: cycle, turn, cycle, and line the top layer up.",
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
              caption:
                'The two edges have traded places: the green/orange edge (pink) is at the top right, the yellow/orange edge (blue) is in the slot with its yellow sticker facing right. The other three top edges are right relative to each other.',
            },
            {
              after: "F' U' F",
              caption:
                'First cycle. The yellow/orange edge (blue) is back at the top right. The slot now holds the yellow/red edge, and the green/orange edge (pink) has been carried round to the top back. Three edges are still out of place.',
            },
            {
              after: "U'",
              caption: "A quarter turn of the top layer the other way (U'). It only changes where the second cycle's lift lands.",
            },
            {
              after: "F' U' F",
              caption:
                'Second cycle. The green/orange edge (pink) has dropped into the slot, and the four top edges are in the right order relative to each other — the top layer is just turned.',
            },
            {
              after: 'U2',
              caption: 'Half a turn of the top layer lines it up with the side centres: every edge is solved.',
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
      'Flip the cube over so four of the five unsolved corners are in the bottom layer and the fifth is at the top front-right. That one is the buffer.',
      'Before each round (added — see the note): turn the bottom layer so an unsolved bottom corner is directly under the buffer.',
      "If the buffer corner doesn't belong in the bottom layer (it has no yellow on it), do Sassy once to bring a bottom corner up into the buffer.",
      'Turn the bottom layer until the buffer corner is directly above the slot it belongs in (the slot between the two bottom edges that match its colours).',
      'Repeat Sassy until that corner is solved in the bottom layer (1, 3 or 5 times).',
      'Repeat steps 2–5 until only one unsolved bottom corner is left.',
      "Turn the bottom layer so that corner is under the buffer. Repeat Sassy until the cube is solved, or only two corners are unsolved: twisted in place, everything else solved. A bottom layer that is just turned out of line doesn't count. If the bottom layer ends up fully solved but the top isn't, keep going.",
      'Two twisted corners left: use the second card.',
      'Turn the bottom layer to line it up with the sides. Solved.',
    ],
    notes: [
      "Added here, not on the wiki: (a) turning the bottom layer so an unsolved corner is under the buffer before each round — a corner already placed there would otherwise be pulled back out by the next Sassy; (b) the exact way to finish the last two twisted corners. The wiki says to rotate the whole cube so the bottom layer holds both, which is impossible when they sit at opposite corners of the cube, so the bottom layer is turned first (card 2). Run on 3,000 random positions of the last five corners, the steps as written here solved every one (at most 24 Sassys, 15 on average).",
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
          "Turn the bottom layer so the unsolved bottom corner is under the buffer. If the buffer is one of the twisted corners, rotate the whole cube x' so both twisted corners are in the bottom layer. Sassy until the front-right corner is solved (2 or 4 times); turn the bottom layer so the other twisted corner is at the front-right; Sassy the remaining times (4 or 2 — 6 in all); turn the bottom layer back. Rotate back (x if you rotated), then line up the bottom layer.",
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
