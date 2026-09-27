// Megaminx notes. No interactive 3D preview here yet: cubing.js's
// twisty-player doesn't use plain R/U/F cube notation for a megaminx (it
// has its own move notation), and that can't be verified from this
// sandbox's network, so every case sets noViewer to avoid rendering a
// wrong or misleading cube preview. Text + algorithm only for now.
export const megaminxGrayStarCases = [
  {
    id: 'edges-adjacent-flip',
    name: 'Two edges need to flip, adjacent',
    orientation: 'Put them in front and right.',
    alg: "F U R U' R' F'",
    noViewer: true,
  },
  {
    id: 'edges-opposite-flip',
    name: 'Two edges need to flip, not adjacent',
    orientation: 'Put them front and back-right.',
    alg: "F R U R' U' F'",
    mnemonicChunks: [
      { word: 'F', moves: 'F' },
      { word: 'Sassy', moves: "R U R' U'" },
      { word: 'G', moves: "F'" },
    ],
    noViewer: true,
  },
];

export const megaminxAlignStarCases = [
  {
    id: 'align-front-left',
    name: 'Align star pieces — two front-left',
    orientation:
      "If two pieces aren't next to each other, turn until only one is solved, and put that one in front.",
    alg: "R U R' U R U2 R'",
    note: 'Same algorithm as Sune — "U2\'" is just U2; a 180° turn has no direction to it.',
    noViewer: true,
  },
];

export const megaminxGrayCornerCases = [
  {
    id: 'flip-corners',
    name: 'Flip Gray corners (orient)',
    orientation: 'Goal: the whole Gray face fully facing up.',
    alg: "R U R' U'",
    note:
      "Same idea as the 3x3 Beginner's Method final step: put Gray on the bottom, repeat Sassy (R U R' U') on the unsolved corner, rotate the bottom (Gray) face between corners.",
    noViewer: true,
  },
  {
    id: 'move-corners',
    name: 'Move Gray corners into place (permute)',
    orientation:
      'When the layer above the corners is mostly solved: pop a corner out, rotate the Gray face only, then reslot it.',
    alg: "R U R'",
    altAlg: "R U' R'",
    altNote: 'Forward pops the corner out; backward reslots it. Only the Gray face turns in between.',
    noViewer: true,
  },
];
