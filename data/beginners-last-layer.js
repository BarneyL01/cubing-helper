// Beginner's method — last layer.
//
// Yellow cross: NOT from the user's notes — standard beginner's step,
// filled in on request (2026-09-27), checked with js/cube-sim.js. The same
// algorithm is repeated; each shape leads to the next (dot → L → line →
// cross), so each card's picture comes from the whole chain.
const YELLOW_CROSS = "F R U R' U' F'";
const yellowCrossChunks = [
  { word: 'F', moves: 'F' },
  { word: 'Sassy', moves: "R U R' U'" },
  { word: 'G', moves: "F'" },
];
const yellowCrossNote = "Standard beginner's method — not from your notes. Same algorithm as the U case in 2x2 Ortega / Roux CMLL.";

export const beginnerYellowCrossCases = [
  {
    id: 'yc-line',
    anchor: 'yc-line',
    name: 'Line',
    orientation: 'Hold the line left-to-right.',
    alg: YELLOW_CROSS,
    stickering: 'eo',
    mnemonicChunks: yellowCrossChunks,
    then: { text: 'cross done', href: '#match-cross' },
    note: yellowCrossNote,
  },
  {
    id: 'yc-l',
    anchor: 'yc-l',
    name: 'L shape',
    orientation: 'Hold the L at the back-left (the two yellow edges at the back and left).',
    alg: `${YELLOW_CROSS} ${YELLOW_CROSS}`,
    displayAlg: YELLOW_CROSS,
    stickering: 'eo',
    mnemonicChunks: yellowCrossChunks,
    then: { text: 'Line', href: '#yc-line' },
    note: yellowCrossNote,
  },
  {
    id: 'yc-dot',
    anchor: 'yc-dot',
    name: 'Dot (no yellow edges up)',
    orientation: 'Any way round. You get an L — turn the top until it sits at the back-left.',
    alg: `${YELLOW_CROSS} U2 ${YELLOW_CROSS} ${YELLOW_CROSS}`,
    displayAlg: YELLOW_CROSS,
    stickering: 'eo',
    mnemonicChunks: yellowCrossChunks,
    then: { text: 'L shape', href: '#yc-l' },
    note: yellowCrossNote,
  },
];

// The rest came from the user's own raw WCA notation notes rather than the
// mnemonic cipher — see log/ for the decode.
export const beginnerLastLayerCases = [
  {
    id: 'match-cross-colours',
    name: 'Match cross colours',
    orientation:
      "The top cross is made, but its edges may not line up with the side colours yet — this permutes them into place.",
    alg: "R U R' U R U2 R' U",
    story: 'Your memory: "Match Cross = RU algo."',
    note:
      "You flagged this as possibly incomplete. Checked with a cube simulation: it swaps exactly the front and left top edges and leaves the first two layers alone (it twists corners, which the next two steps fix). That's the standard beginner edge swap, so it looks complete.",
  },
  {
    id: 'match-corners',
    name: 'Match corners (position)',
    orientation:
      'If one corner is already in its correct spot, hold it in the front-right position before starting. May need a second application (re-checking which corner is correct) if more than one corner was out of place.',
    alg: "U R U' L' U R' U' L",
  },
  {
    id: 'solve-corner-rotation',
    name: 'Orient corners (final step)',
    orientation:
      "Put the unsolved corner on the bottom, then repeat the 4-move sequence until it's oriented. Turn U (top layer only) to bring the next unsolved corner around and repeat.",
    alg: "R U R' U'",
    // Repeated a varying number of times per corner, so a picture of one
    // application would show a position you never actually see.
    noViewer: true,
  },
];
