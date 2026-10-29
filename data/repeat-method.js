// The Repeat method: a corners-first beginner method where every step is a short
// group of moves done several times in a row, like Sassy. Our own design
// (2026-10-29), not from a published method or from the user's notes. Found by
// a computer search over short move groups and their repeats; the rules below were
// checked by simulation on whole solves: log/2026-10-29-repeat-method-check.mjs.
//
// The page shows yellow on top, white on the bottom (like the Beginner's page).
// Edges are ignored in steps 1-3, so those steps may scramble them freely.

const SASSY = "R U R' U'";
const times = (alg, n) => Array(n).fill(alg).join(' ');

// The four repeats.
export const CORNER_CYCLE = times('R2 U F2', 4); // three top corners: UFL -> UBL -> UBR, UFR stays
export const DROP = times('R2 U2 R2 F2', 2); // three edges: UF -> DF -> UB (face turns only)
export const FLIP = times("U M'", 4); // flips UF, UL, DF, DB in place

// Drops: each takes one edge from the top layer into the slot named, and
// changes nothing else outside the top layer. `from` is where the edge must be;
// `up` is which of the target's faces its top sticker ends on.
export const DROPS = {
  downGood: { target: 'DF', from: 'UF', up: 'D', alg: DROP, display: '(R2 U2 R2 F2)×2' },
  downBad: { target: 'DF', from: 'UR', up: 'F', alg: `F R' F' ${DROP} F R F'`, display: "F R' F'  (R2 U2 R2 F2)×2  F R F'" },
  midGood: { target: 'FR', from: 'UF', up: 'F', alg: `R' D' ${DROP} D R`, display: "R' D'  (R2 U2 R2 F2)×2  D R" },
  midBad: { target: 'FR', from: 'UR', up: 'R', alg: `F U R2 ${DROP} R2 U' F'`, display: "F U R2  (R2 U2 R2 F2)×2  R2 U' F'" },
};

// Top layer (step 5).
export const TOP_CYCLE = { alg: `R2 D' ${DROP} D R2`, display: "R2 D'  (R2 U2 R2 F2)×2  D R2" }; // UR -> UB -> UF, UL stays
export const FLIP_SIDES = { alg: `${FLIP} U ${FLIP}`, display: "(U M')×4  U  (U M')×4" }; // flips UL and UR
export const FLIP_ALL = { alg: `${FLIP} U2 ${FLIP}`, display: "(U M')×4  U2  (U M')×4" }; // flips all four

export const facts = [
  ['Designed', 'Here, 2026-10-29, by computer search, then checked on whole solves'],
  ['Type', 'Beginner method: corners first, then edges'],
  ['Repeats to learn', "4: Sassy, (R2 U F2)×4, (R2 U2 R2 F2)×2, (U M')×4"],
  ['Average moves', 'About 235 on the simulator (corners about 100, edges about 135)'],
  ['Hard moves', "No L and no M. M' only in the flip (8 per flip)."],
  ['Path', 'Bottom corners → top corners in place → twist corners → bottom and middle edges → top edges'],
];

const CORNERS = 'corners';
const mn = (word, moves) => [{ word, moves }];

export const repeatSteps = [
  {
    id: 'idea',
    title: 'The idea',
    short: 'Idea',
    extra: true,
    mark: 'i',
    intro:
      'Solve all eight corners first, ignoring the edges. Then solve the edges with one repeat, the drop, while the corners stay solved. Each repeat brings its own moves back home. Only the few pieces it is meant to move end up changed.',
    how: [
      { title: 'Steps 1 to 3:', text: 'only corners matter. The edges get mixed up; that is fine.' },
      { title: 'Steps 4 and 5:', text: 'the corners never move again. If a corner looks wrong after a repeat, a move was missed.' },
      {
        title: 'Centres:',
        text: "the drop uses face turns only, so the centres never move. The flip uses M', which moves centres; four M' make a whole turn, so they are back once the flip ends.",
      },
      {
        title: 'Turning the top is free in steps 4 and 5:',
        text: 'it only changes which edge is where in the top layer. Line the top up with the centres at the very end.',
      },
    ],
    cases: [
      {
        anchor: 'drop-strip',
        name: 'Why repeat: the drop on a solved cube',
        orientation: 'Done once, R2 U2 R2 F2 moves many pieces. Done twice, every piece is back but three edges.',
        alg: DROP,
        displayAlg: '(R2 U2 R2 F2)×2',
        mnemonicChunks: mn('(R2U2R2F2)×2', '(R2 U2 R2 F2)×2'),
        noViewer: true,
        filmstrip: {
          alg: DROP,
          fromSolved: true,
          views: ['U', 'cube'],
          marks: [
            { piece: 'UF', colour: 'pink' },
            { piece: 'DF', colour: 'blue' },
            { piece: 'UB', colour: '#d97706' },
          ],
          legend: [
            { colour: 'pink', text: 'yellow/green edge (top front)' },
            { colour: 'blue', text: 'white/green edge (bottom front)' },
            { colour: '#d97706', text: 'yellow/blue edge (top back)' },
          ],
          frames: [
            { after: '', caption: 'Solved. Only edges are coloured.' },
            { after: 'R2 U2 R2 F2', caption: 'Once: seven edges and four corners (grey here) have moved.' },
            { after: 'R2 U2 R2 F2', caption: 'Twice: only the three outlined edges have moved, top front → bottom front → top back → top front.' },
          ],
        },
      },
    ],
  },
  {
    id: 'step-1',
    title: 'Bottom corners',
    short: 'Bottom corners',
    goal: 'The four white corners in place on the bottom. Ignore the edges.',
    how: [
      'White on the bottom. Turn the whole cube so the slot you want is at the bottom front-right.',
      'Turn the top so the corner for that slot is just above it.',
      'Repeat Sassy until it drops in: 1, 3 or 5 times, depending on where its white sticker faces.',
      'A white corner in the wrong bottom slot: hold it at the bottom front-right and do Sassy once to lift it into the top.',
      'There are no edges to protect, so you can also just place corners however you like.',
    ],
    cases: [
      {
        anchor: 'corner-white-right',
        name: 'White facing right',
        orientation: 'Sassy once.',
        alg: SASSY,
        stickering: CORNERS,
        diagramViews: ['cube'],
        mnemonicChunks: mn('Sassy', SASSY),
      },
      {
        anchor: 'corner-white-up',
        name: 'White facing up',
        orientation: 'Sassy three times.',
        alg: times(SASSY, 3),
        displayAlg: `(${SASSY}) ×3`,
        stickering: CORNERS,
        diagramViews: ['cube'],
        mnemonicChunks: mn('Sassy×3', `(${SASSY})×3`),
      },
      {
        anchor: 'corner-white-front',
        name: 'White facing front',
        orientation: 'Sassy five times.',
        alg: times(SASSY, 5),
        displayAlg: `(${SASSY}) ×5`,
        stickering: CORNERS,
        diagramViews: ['cube'],
        mnemonicChunks: mn('Sassy×5', `(${SASSY})×5`),
      },
    ],
  },
  {
    id: 'step-2',
    title: 'Top corners in place',
    short: 'Top corners',
    goal: 'Each yellow corner in its own spot, even if twisted. Ignore the edges.',
    how: [
      "A corner is in its spot when its three colours match the three centres around it, in any twist.",
      'Turn the top until at least one corner is in its spot. Hold the cube so that corner is at the top front-right.',
      'Do the corner cycle. It moves the other three top corners round, front-left → back-left → back-right. If they are not all right yet, do it once more.',
      'No top turn puts any corner in its spot: do the corner cycle once from anywhere, then start again.',
    ],
    cases: [
      {
        anchor: 'corner-cycle',
        name: 'Corner cycle',
        orientation: 'Keeps the top front-right corner. The other three top corners move round once. The bottom corners stay solved.',
        alg: CORNER_CYCLE,
        displayAlg: '(R2 U F2) ×4',
        stickering: CORNERS,
        diagramViews: ['U', 'cube'],
        mnemonicChunks: mn('(Spinner F2)×4', '(R2 U F2)×4'),
        note: 'Twelve moves, all half turns but the U. It mixes the edges; they come later.',
      },
    ],
  },
  {
    id: 'step-3',
    title: 'Twist the corners',
    short: 'Twist corners',
    goal: 'All eight corners solved. Ignore the edges.',
    how: [
      "Same as the Beginner's step 7. Turn the cube over so yellow is on the bottom.",
      'Hold an unsolved corner at the bottom front-right. Repeat Sassy until its yellow faces down (2 or 4 times).',
      'Turn only the bottom layer to bring the next unsolved corner to the front-right.',
      'When all are done, turn the bottom to line it up. Turn the cube back over: yellow on top.',
    ],
    cases: [
      {
        anchor: 'twist-corner',
        name: 'Twist one corner',
        orientation: 'Yellow on the bottom, unsolved corner at the bottom front-right.',
        alg: SASSY,
        displayAlg: `(${SASSY}) ×2 or ×4`,
        mnemonicChunks: mn('Sassy', SASSY),
        noViewer: true,
      },
    ],
  },
  {
    id: 'step-4',
    title: 'Bottom and middle edges',
    short: 'Lower edges',
    goal: 'The eight edges of the bottom and middle layers solved. The corners stay solved.',
    how: [
      { title: 'The drop:', text: '(R2 U2 R2 F2)×2. The top front edge goes into the bottom front slot, the bottom front edge to the top back, and the top back edge to the top front. Nothing else moves.' },
      'Find any top edge with white, or with no yellow. It belongs in the bottom or the middle layer.',
      'Turn the whole cube so its slot is at the bottom front (white edges) or the front-right (middle edges).',
      'Turn the top to the spot the card names, then do that card. The card depends on which way the edge faces.',
      'No top edge belongs below, but a lower slot holds a wrong edge: hold that slot at the bottom front (or front-right) and do card 1 (or 3) to lift it out.',
      'Check after each one: one more lower edge is solved, nothing else in the lower layers changed, and every corner is as it was (only the top layer may be turned).',
    ],
    cases: [
      {
        anchor: 'drop-down',
        name: '1 · Bottom edge, white on top',
        orientation: 'The edge is at the top front, white facing up. It goes into the bottom front slot.',
        alg: DROPS.downGood.alg,
        displayAlg: DROPS.downGood.display,
        diagramViews: ['cube'],
        mnemonicChunks: mn('(R2U2R2F2)×2', '(R2 U2 R2 F2)×2'),
      },
      {
        anchor: 'drop-down-flipped',
        name: '2 · Bottom edge, white on the side',
        orientation: 'The edge is at the top right, white facing right. It goes into the bottom front slot, white down.',
        alg: DROPS.downBad.alg,
        displayAlg: DROPS.downBad.display,
        diagramViews: ['cube'],
        note: "F R' F' turns the slot so the edge drops in the right way round; F R F' undoes it. Written out in full, the moves cancel a little (F2 F = F'). No mnemonic word for the whole thing.",
      },
      {
        anchor: 'drop-middle',
        name: '3 · Middle edge, top colour matches the front',
        orientation: "Put the edge at the top front. Its top colour matches the front centre. It goes into the front-right slot.",
        alg: DROPS.midGood.alg,
        displayAlg: DROPS.midGood.display,
        diagramViews: ['cube'],
        note: "R' D' brings the front-right slot to the bottom front; D R puts it back. No mnemonic: your letter code has no D.",
      },
      {
        anchor: 'drop-middle-flipped',
        name: '4 · Middle edge, top colour matches the right',
        orientation: "Put the edge at the top right. Its top colour matches the right centre. It goes into the front-right slot.",
        alg: DROPS.midBad.alg,
        displayAlg: DROPS.midBad.display,
        diagramViews: ['cube'],
        note: "F U R2 sets the edge up; R2 U' F' undoes it. Written out in full, the moves cancel a little. No mnemonic word for the whole thing.",
      },
    ],
  },
  {
    id: 'step-5',
    title: 'Top edges',
    short: 'Top edges',
    goal: 'Yellow up on every top edge, each matching its side centre. The cube is solved.',
    how: [
      'First count the top edges whose yellow is not facing up: 0, 2 or 4.',
      { title: 'Four:', text: 'flip all four (card 3).' },
      { title: 'Two, next to each other:', text: 'turn the top so they are at the front and the left. Do the top cycle (card 1) once; now they are opposite.' },
      { title: 'Two, opposite:', text: 'turn the top so they are at the left and right. Do the flip pair (card 2).' },
      'Then put them in order. Turn the top so the corners line up with the centres again (the corners are solved). An edge is right when it matches its centre.',
      'Turn the whole cube so a right edge is at the left. Do the top cycle once or twice. If no edge is right, do the top cycle once from anywhere and look again.',
    ],
    cases: [
      {
        anchor: 'top-cycle',
        name: '1 · Top cycle',
        orientation: 'Keeps the left edge. The other three top edges move: right → back → front → right. Yellow stays up.',
        alg: TOP_CYCLE.alg,
        displayAlg: TOP_CYCLE.display,
        diagramViews: ['U', 'cube'],
        note: "R2 D' moves the bottom front slot to the top right; the drop then works on three top edges; D R2 puts it back. No mnemonic: your letter code has no D.",
      },
      {
        anchor: 'flip-sides',
        name: '2 · Flip pair (left and right)',
        orientation: "The flip, a quarter turn of the top, the flip again. The first flip also flips the bottom front and back edges; the second flips them back.",
        alg: FLIP_SIDES.alg,
        displayAlg: FLIP_SIDES.display,
        diagramViews: ['U', 'cube'],
        mnemonicChunks: [
          { word: '(UK)×4', moves: "(U M')×4" },
          { word: 'U', moves: 'U' },
          { word: '(UK)×4', moves: "(U M')×4" },
        ],
        note: "After each (U M')×4 the centres are back home: four M' are a whole turn.",
      },
      {
        anchor: 'flip-all',
        name: '3 · Flip all four',
        orientation: 'The same with U2 in the middle.',
        alg: FLIP_ALL.alg,
        displayAlg: FLIP_ALL.display,
        diagramViews: ['U', 'cube'],
        mnemonicChunks: [
          { word: '(UK)×4', moves: "(U M')×4" },
          { word: 'U2', moves: 'U2' },
          { word: '(UK)×4', moves: "(U M')×4" },
        ],
      },
    ],
  },
];
