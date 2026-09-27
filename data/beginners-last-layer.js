// Beginner's method — last layer steps (after the top cross already exists).
// Unlike the CFOP OLL/PLL data, these came from the user's own raw WCA
// notation notes rather than the mnemonic cipher — see log/ for the decode.
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
