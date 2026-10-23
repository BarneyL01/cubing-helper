// Understanding commutators — for the Blind section (3-style).
//
// From notes the user pasted on 2026-10-04. The paste started part-way through
// the explanation, so the first section's opening paragraph and its picture
// strip are written here; everything from "The net effect is a 3-cycle…"
// onward follows the paste. Checked with js/cube-sim.js
// (log/2026-10-04-commutators.md): all four table rows, all seven exercises
// (each solution solves its setup) and every cycle named. One explanation was
// wrong in the paste and is corrected here: (R' D' R D)×2 twists FOUR corners
// (C, V, X, W), not one; exercise 7 works because only one of them
// (C) is in the U layer, which is the interchange there.

export const intro = {
  paragraphs: [
    "A commutator [A, B] means A B A' B': do A, do B, undo A, undo B. When A and B mostly stay out of each other's way, the rest cancels and leaves a 3-cycle of pieces. A is the insertion, B the interchange.",
    "Example: [R U R', D] is R U R' D R U' R' D'.",
    "Pieces use Speffz letters: C is the UFR corner and the UF edge, V is DFR, U is DFL.",
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
      { colour: 'pink', text: 'yellow/green/orange corner (starts at C)' },
      { colour: 'blue', text: 'white/green/orange corner (starts at V)' },
      { colour: '#7c3aed', text: 'white/green/red corner (starts at U)' },
    ],
    frames: [
      { after: '', label: 'Solved', caption: 'Start: pink at C, blue at V, purple at U.' },
      {
        after: "R U R'",
        label: "A = R U R'",
        caption: 'Pink drops into V; blue is pushed up to D.',
      },
      {
        after: 'D',
        label: 'B = D',
        caption: 'Pink moves away to W; purple comes into V.',
      },
      {
        after: "R U' R'",
        label: "A' = R U' R'",
        caption: 'Blue returns to V; purple lifts to C.',
      },
      {
        after: "D'",
        label: "B' = D'",
        caption: 'Pink comes round to V; blue to U.',
      },
    ],
  },
  netEffect: 'Net effect: a 3-cycle of corners, C → V → U → C.',
  why: 'Why it works: the insertion touches only one bottom slot, so the bottom turn changes only that slot, and undoing both leaves just the three pieces moved.',
};

export const variantsTable = {
  heading: 'Changing the interchange changes the cycle',
  lead: "Keep the insertion R U R' and change only the D turn:",
  rows: [
    ["[R U R', D]", "R U R' D R U' R' D'", 'C → V → U'],
    ["[R U R', D']", "R U R' D' R U' R' D", 'C → V → W'],
    ["[R U R', D2]", "R U R' D2 R U' R' D2", 'C → V → X'],
    ["[D, R U R']", "D R U R' D' R U' R'", 'Reverse of row 1', 'On a solved cube: C → U → V — row 1 backwards.'],
  ],
  after: 'Swapping A and B reverses the cycle direction.',
};

export const buildSteps = {
  heading: 'Building one yourself',
  steps: [
    { title: 'Step 1:', text: 'Name the three pieces to cycle.' },
    { title: 'Step 2:', text: 'Pick a layer that holds two of them. That is the interchange layer.' },
    {
      title: 'Step 3:',
      text: 'Find a 3-move insertion that brings the third piece, correctly oriented, into one of those slots, touching no other slot in that layer.',
    },
    { title: 'Step 4:', text: 'Put A first or B first, whichever gives the direction you need.' },
    {
      title: 'Step 5:',
      text: 'If no clean insertion exists, add a setup move (a conjugate) and undo it at the end.',
      link: { text: 'More on choosing setup moves: Corner cycles tab', href: 'corner-cycles.html' },
    },
  ],
};

// Each exercise: the position is "solution applied backwards from solved", so the
// setup scramble is the inverse of the solution (checked).
export const exercises = {
  heading: 'Exercises: set up, then solve',
  lead: 'Start from a solved cube. Apply the setup, try to solve it without the solution, then check.',
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
      '1 to 3 teach choosing the interchange turn (D, D\' or D2).',
      "4 is [U: [R U R', D]]. It cycles B → V → U. The U setup moves the B piece into C first.",
      { text: "5 cycles C → U → A. U2 swaps the two U-layer slots that M' disturbs.", link: { text: 'More: Edge cycles tab', href: 'edge-cycles.html' } },
      { text: "6 is [D: [M', U2]]. It cycles C → X → A. The D setup brings X into U.", link: { text: 'More: Edge cycles tab', href: 'edge-cycles.html' } },
      "7 uses (R' D' R D)×2. It twists four corners; only C is in the U layer, so two U-layer corners end up twisted in opposite directions.",
    ],
    correction:
      "Corrected: your notes said (R' D' R D)×2 twists one corner. It twists four. Exercise 7 works as described.",
  },
};

export const practice = {
  heading: 'Generating unlimited practice',
  items: [
    'Change one part of an exercise solution (the interchange, the setup, or the A/B order). Predict the cycle, then check it on a solved cube.',
    'Reverse drill: on a solved cube, do a commutator you make up. Then solve it yourself.',
    'The Pictures / 3D toggle plays each exercise solution; alg.cubing.net plays anything you type.',
  ],
  blind: {
    text: "Blindfolded, each pair of targets becomes a 3-cycle with buffer V (the DFR corner), built with the steps above, instead of Old Pochmann's memorised swap.",
    link: { text: 'Corner cycles and Edge cycles tabs: which pairs to cycle', href: 'corner-cycles.html' },
  },
};
