// Beginner's method — first two layers. NOT from the user's notes: these
// are the standard beginner's-method steps, filled in on request
// (2026-09-27). Every algorithm was checked with js/cube-sim.js. Held with
// yellow on top throughout, so the white cross ends up on the bottom.
const note =
  "Standard beginner's method — not from your notes. Tell me if you do this step differently.";

export const beginnerCrossCases = [
  {
    id: 'daisy',
    name: '1. Make the daisy',
    orientation:
      'Yellow on top. Bring the four white edges up around the yellow centre, white facing up (a "daisy"). Intuitive — turn a side to lift an edge up, turning the top first so you don\'t knock off an edge already placed.',
    alg: null,
    displayAlg: 'Intuitive — no algorithm',
    noViewer: true,
    note,
  },
  {
    id: 'cross-down',
    name: '2. Bring each edge down',
    orientation:
      "Turn the top until a daisy edge's side colour matches the centre below it, then turn that face twice. Repeat for all four edges.",
    alg: 'F2',
    stickering: 'cross',
    diagramViews: ['cube'],
    note,
  },
];

export const beginnerCornerCases = [
  {
    id: 'corner-white-right',
    name: 'White facing right',
    orientation: 'Turn the top to put the corner above its slot (front-right), then repeat R U R\' U\' until it drops in solved.',
    alg: "R U R' U'",
    stickering: 'layer1',
    diagramViews: ['cube'],
    mnemonicChunks: [{ word: 'Sassy', moves: "R U R' U'" }],
    note,
  },
  {
    id: 'corner-white-up',
    name: 'White facing up',
    orientation: 'Corner above its slot. Same Sassy, it just takes three goes.',
    alg: "R U R' U' R U R' U' R U R' U'",
    displayAlg: "(R U R' U') ×3",
    stickering: 'layer1',
    diagramViews: ['cube'],
    mnemonicChunks: [{ word: 'Sassy×3', moves: "(R U R' U')×3" }],
    note,
  },
  {
    id: 'corner-white-front',
    name: 'White facing front',
    orientation: 'Corner above its slot. Five goes of Sassy.',
    alg: "R U R' U' R U R' U' R U R' U' R U R' U' R U R' U'",
    displayAlg: "(R U R' U') ×5",
    stickering: 'layer1',
    diagramViews: ['cube'],
    mnemonicChunks: [{ word: 'Sassy×5', moves: "(R U R' U')×5" }],
    note,
  },
  {
    id: 'corner-stuck',
    name: 'Corner stuck in the bottom',
    orientation:
      'In the wrong slot, or in the right slot but twisted: hold it at front-right and do R U R\' U\' once to lift it into the top, then treat it as one of the cases above.',
    alg: "R U R' U'",
    noViewer: true,
    mnemonicChunks: [{ word: 'Sassy', moves: "R U R' U'" }],
    note,
  },
];

export const beginnerSecondLayerCases = [
  {
    id: 'edge-right',
    name: 'Edge goes to the right',
    orientation:
      "Turn the top until the edge's front colour matches the front centre. Its top colour matches the right centre → insert right.",
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
    note,
  },
  {
    id: 'edge-left',
    name: 'Edge goes to the left',
    orientation: "Front colour matches the front centre, top colour matches the left centre → insert left (the mirror image).",
    alg: "U' L' U L U F U' F'",
    stickering: 'f2l',
    diagramViews: ['cube'],
    note: `${note} No mnemonic: your letter code doesn't have a letter for L moves yet.`,
  },
  {
    id: 'edge-stuck',
    name: 'Edge stuck in a slot (wrong slot or flipped)',
    orientation:
      'Hold the slot at front-right and do the right insert with any top edge to pop it out — then insert it properly. For a flipped edge that means: right insert, U2, right insert.',
    alg: "U R U' R' U' F' U F U2 U R U' R' U' F' U F",
    displayAlg: "(U R U' R' U' F' U F) U2 (U R U' R' U' F' U F)",
    stickering: 'f2l',
    diagramViews: ['cube'],
    note,
  },
];
