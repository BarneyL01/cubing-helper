// Beginner's method (3x3), as seven steps. Held with yellow on top
// throughout (the white cross ends up on the bottom) — except step 7, where
// the user's notes turn the cube over.
//
// Steps 1–4: NOT from the user's notes — the standard beginner's method,
// filled in on request (2026-09-27). Steps 5–7: from the user's notes, which
// were in raw WCA notation rather than the mnemonic cipher (see log/).
//
// Every algorithm and every "how" instruction was checked with
// js/cube-sim.js — steps 5–7 over thousands of random last-layer states
// (log/2026-09-29-beginners-rework.md).

const SASSY = "R U R' U'";
const sassy = [{ word: 'Sassy', moves: SASSY }];
const times = (alg, n) => Array(n).fill(alg).join(' ');

const YELLOW_CROSS = "F R U R' U' F'";
const yellowCrossChunks = [
  { word: 'F', moves: 'F' },
  { word: 'Sassy', moves: SASSY },
  { word: 'G', moves: "F'" },
];

export const beginnerSteps = [
  {
    id: 'step-1',
    title: 'White cross',
    short: 'Cross',
    source: 'standard',
    goal: 'A white cross on the bottom, each edge’s side colour matching the centre above it.',
    how: [
      'Yellow on top. Bring the four white edges up around the yellow centre, white facing up — the “daisy”.',
      'Turn the top until a daisy edge’s side colour matches the centre below it, then turn that face twice. Repeat for all four.',
    ],
    cases: [
      {
        anchor: 'daisy',
        name: 'Make the daisy',
        orientation:
          "Turn a side to lift a white edge up next to the yellow centre. Turn the top first so you don't knock off an edge already placed.",
        displayAlg: 'Intuitive — no algorithm',
        noViewer: true,
      },
      {
        anchor: 'cross-down',
        name: 'Bring an edge down',
        orientation: 'Side colour matches the front centre → turn the front twice.',
        alg: 'F2',
        stickering: 'cross',
        diagramViews: ['cube'],
      },
    ],
  },
  {
    id: 'step-2',
    title: 'White corners',
    short: 'Corners',
    source: 'standard',
    goal: 'Finish the white layer: all four white corners in, matching the side colours.',
    how: [
      'Find a white corner in the top layer.',
      'Turn the top until it sits above its slot (between its two side colours), and hold that slot at the front-right.',
      'Repeat Sassy until the corner drops in solved — how many times depends on which way the white sticker faces.',
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
      {
        anchor: 'corner-stuck',
        name: 'Corner stuck in the bottom',
        orientation:
          'Wrong slot, or right slot but twisted: hold it at the front-right, Sassy once to lift it into the top, then use one of the cases above.',
        alg: SASSY,
        noViewer: true,
        mnemonicChunks: sassy,
      },
    ],
  },
  {
    id: 'step-3',
    title: 'Middle layer edges',
    short: 'Middle edges',
    source: 'standard',
    goal: 'The four middle-layer edges in place — the first two layers solved.',
    how: [
      'Find a top-layer edge with no yellow on it.',
      'Turn the top until its front colour matches the front centre.',
      'Its top colour matches the right or the left centre — that’s the side it goes to.',
    ],
    cases: [
      {
        anchor: 'edge-right',
        name: 'Edge goes right',
        orientation: 'Top colour matches the right centre.',
        alg: "U R U' R' U' F' U F",
        stickering: 'f2l',
        diagramViews: ['cube'],
        mnemonicChunks: [
          { word: 'Urvop', moves: "U R U' R'" },
          { word: 'V', moves: "U'" },
          { word: 'G', moves: "F'" },
          { word: 'U', moves: 'U' },
          { word: 'F', moves: 'F' },
        ],
      },
      {
        anchor: 'edge-left',
        name: 'Edge goes left',
        orientation: 'Top colour matches the left centre. The mirror image of going right.',
        alg: "U' L' U L U F U' F'",
        stickering: 'f2l',
        diagramViews: ['cube'],
        note: "No mnemonic: your letter code doesn't have a letter for L moves yet.",
      },
      {
        anchor: 'edge-stuck',
        name: 'Edge stuck in a slot',
        orientation:
          'Wrong slot, or right slot but flipped: hold the slot at the front-right and do “goes right” with any top edge to pop it out. For a flipped edge: goes right, U2, goes right.',
        alg: "U R U' R' U' F' U F U2 U R U' R' U' F' U F",
        displayAlg: "(U R U' R' U' F' U F) U2 (U R U' R' U' F' U F)",
        stickering: 'f2l',
        diagramViews: ['cube'],
      },
    ],
  },
  {
    id: 'step-4',
    title: 'Yellow cross',
    short: 'Yellow cross',
    source: 'standard',
    goal: 'A yellow cross on top. Only the edges matter — ignore the corners.',
    how: [
      'Look at which top edges have yellow facing up: none (dot), two neighbours (L), two opposite (line), or all four (done).',
      'One algorithm, held as shown: dot → L → line → cross. Same algorithm as the U case in 2x2 Ortega and Roux CMLL.',
    ],
    cases: [
      {
        anchor: 'yc-dot',
        name: 'Dot',
        orientation: 'Any way round.',
        alg: `${YELLOW_CROSS} U2 ${YELLOW_CROSS} ${YELLOW_CROSS}`,
        displayAlg: YELLOW_CROSS,
        stickering: 'eo',
        mnemonicChunks: yellowCrossChunks,
        then: { text: 'L shape', href: '#yc-l' },
      },
      {
        anchor: 'yc-l',
        name: 'L shape',
        orientation: 'Yellow edges at the back and left.',
        alg: `${YELLOW_CROSS} ${YELLOW_CROSS}`,
        displayAlg: YELLOW_CROSS,
        stickering: 'eo',
        mnemonicChunks: yellowCrossChunks,
        then: { text: 'Line', href: '#yc-line' },
      },
      {
        anchor: 'yc-line',
        name: 'Line',
        orientation: 'Line going left to right.',
        alg: YELLOW_CROSS,
        stickering: 'eo',
        mnemonicChunks: yellowCrossChunks,
        then: { text: 'Step 5', href: '#step-5' },
      },
    ],
  },
  {
    id: 'step-5',
    title: 'Match the cross',
    short: 'Match edges',
    source: 'yours',
    goal: 'Each yellow-cross edge matches the centre on its side.',
    how: [
      'Turn the top until at least two edges match their side centres.',
      'Two neighbouring edges match → hold them at the back and right, do the algorithm. Done.',
      'Two opposite edges match → do the algorithm once from any side. Now two neighbours match.',
    ],
    cases: [
      {
        anchor: 'match-cross',
        name: 'Swap front and left edges',
        orientation: 'Matching edges at the back and right.',
        alg: "R U R' U R U2 R' U",
        mnemonicChunks: [
          { word: 'Ugly', moves: "R U R' U" },
          { word: 'Loopy', moves: "R U2 R'" },
          { word: 'U', moves: 'U' },
        ],
        story: 'Your memory: “Match Cross = RU algo.” Back Right (if 2 matching).',
        note: 'It twists the corners too — steps 6 and 7 fix that.',
      },
    ],
  },
  {
    id: 'step-6',
    title: 'Place the corners',
    short: 'Place corners',
    source: 'yours',
    goal: 'Every top corner in its right spot. Twisted is fine.',
    how: [
      'A corner is in its right spot when its three colours match the three centres around it, whichever way it’s twisted.',
      'One corner right → hold it at the front-right, do the algorithm. Repeat until all four are right (at most twice).',
      'No corners right → do the algorithm once from any side. Now one is right.',
    ],
    cases: [
      {
        anchor: 'match-corners',
        name: 'Cycle three corners',
        orientation: 'The right corner held at the front-right.',
        alg: "U R U' L' U R' U' L",
        note: "No mnemonic: your letter code doesn't have a letter for L moves yet.",
      },
    ],
  },
  {
    id: 'step-7',
    title: 'Twist the corners',
    short: 'Twist corners',
    source: 'yours',
    goal: 'Yellow facing up on every corner — solved.',
    how: [
      'Turn the cube over so yellow is on the bottom, keeping the same side at the front.',
      'Hold an unsolved corner at the bottom front-right. Repeat Sassy until its yellow faces down (2 or 4 times).',
      'Turn only the bottom layer to bring the next unsolved corner to the front-right. Don’t turn the whole cube.',
      'The top looks scrambled part-way — keep going. It comes back once the last corner is done. Turn the bottom to line it up.',
    ],
    cases: [
      {
        anchor: 'twist-corner',
        name: 'Twist one corner',
        orientation: 'Yellow on the bottom, unsolved corner at the bottom front-right.',
        alg: SASSY,
        displayAlg: `(${SASSY}) ×2 or ×4`,
        mnemonicChunks: sassy,
        story: 'Your notes: “Put on bottom then use 4 Move Sequence.”',
        // Repeated 2 or 4 times per corner, with the cube upside down, so a
        // picture of one application would show a position you never see.
        noViewer: true,
      },
    ],
  },
];
