// Understanding commutators — for the Blind section (3-style).
//
// From notes the user pasted on 2026-10-04. The paste started part-way through
// the explanation, so the first section's opening paragraph and its picture
// strip are written here; everything from "The net effect is a 3-cycle…"
// onward follows the paste. Checked with js/cube-sim.js
// (log/2026-10-04-commutators.md): all four table rows, all seven exercises
// (each solution solves its setup) and every cycle named. One explanation was
// wrong in the paste and is corrected here: (R' D' R D)×2 twists FOUR corners
// (UFR, DFR, DBL, DBR), not one; exercise 7 works because only one of them
// (UFR) is in the U layer, which is the interchange there.

export const intro = {
  paragraphs: [
    "A commutator is written [A, B] and means: do A, do B, undo A, undo B — A B A' B'. If A and B stay mostly out of each other's way, nearly everything cancels and what is left is a 3-cycle of pieces. A is called the insertion and B the interchange.",
    "Example: [R U R', D] — A is R U R' (the insertion), B is D (the interchange). Written out it is R U R' D R U' R' D'.",
  ],
  // The same three corners followed through that example.
  filmstrip: {
    alg: "R U R' D R U' R' D'",
    fromSolved: true,
    stickering: 'full',
    views: ['U', 'D'],
    marks: [
      { piece: 'UFR', colour: 'pink' },
      { piece: 'DFR', colour: 'blue' },
      { piece: 'DFL', colour: '#7c3aed' },
    ],
    legend: [
      { colour: 'pink', text: 'yellow/green/orange corner (starts at UFR)' },
      { colour: 'blue', text: 'white/green/orange corner (starts at DFR)' },
      { colour: '#7c3aed', text: 'white/green/red corner (starts at DFL)' },
    ],
    frames: [
      { after: '', label: 'Solved', caption: 'Three corners to follow: pink at UFR, blue at DFR, purple at DFL.' },
      {
        after: "R U R'",
        label: "A = R U R'",
        caption:
          'The insertion. The pink corner goes down into the DFR slot and kicks the blue corner up to UFL. In the bottom layer it touches only that one slot.',
      },
      {
        after: 'D',
        label: 'B = D',
        caption:
          'The interchange. Turning the bottom layer carries the pink corner away from DFR to DBR and brings the purple corner into DFR.',
      },
      {
        after: "R U' R'",
        label: "A' = R U' R'",
        caption:
          "The insertion undone — but now the purple corner is in the slot. The blue corner comes back down to DFR and the purple corner is lifted up to UFR.",
      },
      {
        after: "D'",
        label: "B' = D'",
        caption:
          'The turn undone: the pink corner comes round to DFR and the blue corner to DFL. Net: pink UFR → DFR, blue DFR → DFL, purple DFL → UFR.',
      },
    ],
  },
  netEffect: 'The net effect is a 3-cycle of corners: UFR → DFR → DFL → UFR (the piece in each position moves to the next one).',
  why: "Why it works: the insertion touches only one slot in the D layer, so the D turn can swap that slot's contents without disturbing anything else the insertion moved. When you undo both, the only change left is the three pieces.",
};

export const variantsTable = {
  heading: 'Changing the interchange changes the cycle',
  lead: "Keep the insertion R U R' and change only the D turn:",
  rows: [
    ["[R U R', D]", "R U R' D R U' R' D'", 'UFR → DFR → DFL'],
    ["[R U R', D']", "R U R' D' R U' R' D", 'UFR → DFR → DBR'],
    ["[R U R', D2]", "R U R' D2 R U' R' D2", 'UFR → DFR → DBL'],
    ["[D, R U R']", "D R U R' D' R U' R'", 'Reverse of row 1', 'On a solved cube: UFR → DFL → DFR — row 1 backwards.'],
  ],
  after:
    'Swapping the order of A and B reverses the cycle direction. That is the whole trick for fixing direction.',
};

export const buildSteps = {
  heading: 'Building one yourself',
  steps: [
    { title: 'Step 1:', text: 'Name the three pieces you want cycled.' },
    { title: 'Step 2:', text: 'Find a layer that holds two of them. That layer is your interchange.' },
    {
      title: 'Step 3:',
      text: 'Find a 3-move insertion that takes the third piece into one of those two slots, in the orientation it needs, touching only that one slot in the interchange layer.',
    },
    { title: 'Step 4:', text: 'Choose A-first or B-first based on which direction the cycle must go.' },
    {
      title: 'Step 5:',
      text: 'If no clean insertion exists, use a setup move (a conjugate) to bring one piece into a better position, then undo it at the end.',
    },
  ],
};

// Each exercise: the position is "solution applied backwards from solved", so the
// setup scramble is the inverse of the solution (checked).
export const exercises = {
  heading: 'Exercises: set up, then solve',
  lead: 'Start from a solved cube each time. Apply the setup scramble, look at which pieces moved, try to solve it without reading the solution, then check.',
  cards: [
    { n: 1, skill: 'Basic corner cycle', setup: "D R U R' D' R U' R'", solution: "R U R' D R U' R' D'" },
    { n: 2, skill: 'Other D corner', setup: "D' R U R' D R U' R'", solution: "R U R' D' R U' R' D" },
    { n: 3, skill: 'Opposite D corner', setup: "D2 R U R' D2 R U' R'", solution: "R U R' D2 R U' R' D2" },
    { n: 4, skill: 'Corner with setup move', setup: "U D R U R' D' R U' R' U'", solution: "U R U R' D R U' R' D' U'" },
    {
      n: 5,
      skill: 'Edge cycle (M slice)',
      setup: "U2 M' U2 M",
      solution: "M' U2 M U2",
      mnemonicChunks: [
        { word: 'K', moves: "M'" },
        { word: 'U2', moves: 'U2' },
        { word: 'M', moves: 'M' },
        { word: 'U2', moves: 'U2' },
      ],
    },
    { n: 6, skill: 'Edge with setup move', setup: "D U2 M' U2 M D'", solution: "D M' U2 M U2 D'" },
    {
      n: 7,
      skill: 'Twist two corners',
      setup: "U (R' D' R D)×2 U' (D' R' D R)×2",
      solution: "(R' D' R D)×2 U (D' R' D R)×2 U'",
      // (…)×n is written for people; the simulator needs it spelled out.
      setupMoves: "U R' D' R D R' D' R D U' D' R' D R D' R' D R",
      solutionMoves: "R' D' R D R' D' R D U D' R' D R D' R' D R U'",
    },
  ],
  notes: {
    heading: 'Notes on each',
    items: [
      '1 to 3 teach you to pick the interchange turn (D, D\', D2) for the target position.',
      "4 is [U: [R U R', D]]. It cycles UBR → DFR → DFL. The U setup moves the UBR piece into UFR first.",
      '5 cycles UF → DF → UB. This works with U2 because U2 swaps the only two U-layer slots that M\' disturbs.',
      "6 is [D: [M', U2]]. It cycles UF → DL → UB. The D setup brings DL into DF.",
      "7 uses (R' D' R D)×2 as the insertion. That sequence twists four corners (UFR, DFR, DBL, DBR), but only one of them, UFR, is in the U layer — and U is the interchange here. So the commutator leaves two U-layer corners twisted in opposite directions. This handles twisted corners in blindfold.",
    ],
    correction:
      "Corrected from the notes you pasted: they said (R' D' R D)×2 twists one corner in place. In the simulator it twists four; the result (two U-layer corners twisted in opposite directions) is as described.",
  },
};

export const practice = {
  heading: 'Generating unlimited practice',
  items: [
    'Take any solution from the exercises and change one part (the interchange turn, the setup move, or the A/B order). Predict the cycle, then perform it on a solved cube to check.',
    'Reverse drill: on a solved cube, do any commutator you make up. That is your scramble. Now solve it by finding the inverse yourself.',
    "You can watch any sequence before trying it on your cube: the Pictures / 3D toggle on this page plays each exercise's solution, and an online viewer such as alg.cubing.net will play anything you type.",
  ],
  blind:
    "Blindfolded, this is 3-style: instead of memorised setups and a swap algorithm (the Old Pochmann method on the Reference tab), each pair of targets becomes a 3-cycle with the buffer — UFR for corners — that you build with the five steps above.",
};
