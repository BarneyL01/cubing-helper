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
export const CORNER_CYCLE_BACK = times("F2 U' R2", 4); // the reverse: UBR -> UBL -> UFL
export const REVERSE_SASSY = "U R U' R'"; // Urvop: Sassy backwards = Sassy x5
export const DROP = times('R2 U2 R2 F2', 2); // three edges: UF -> DF -> UB (face turns only)
export const FLIP = times("U' M'", 4); // flips UF, UR, DF, DB in place

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
export const FLIP_SIDES = { alg: `${FLIP} U' ${FLIP}`, display: "(U' M')×4  U'  (U' M')×4" }; // flips UL and UR
export const FLIP_ALL = { alg: `${FLIP} U2 ${FLIP}`, display: "(U' M')×4  U2  (U' M')×4" }; // flips all four

// Shorter versions of the same cards (same starting spot, same result), built on the
// commutator M' U2 M U2 instead of the drop. Not a repeat, and it uses M; about 40 moves less per solve.
export const COMM = "M' U2 M U2"; // UF -> DF -> UB, like the drop
export const SHORT = {
  downGood: COMM,
  downBad: "M U' M U2 M' U' M'",
  midGood: "R' D U2 M U2 M' D' R",
  midBad: "F U M' U2 M U F'",
  topCycle: "R2 D U2 M U2 M' D' R2",
};

export const facts = [
  ['Designed', 'Here, 2026-10-29, by computer search, then checked on whole solves'],
  ['Type', 'Beginner method: corners first, then edges'],
  ['Repeats to learn', "4: Sassy, (R2 U F2)×4, (R2 U2 R2 F2)×2, (U' M')×4"],
  ['Average moves', 'About 235 on the simulator (corners about 100, edges about 135); about 190 with the shorter M versions'],
  ['Hard moves', "No L and no M. M' only in the flip (8 per flip)."],
  ['Path', 'Bottom corners → top corners in place → twist corners → bottom and middle edges → top edges'],
];

const CORNERS = 'corners';
const mn = (word, moves) => [{ word, moves }];

const SHORT_LABEL = 'Shorter, with M (about 45 moves less per solve)';
// A picture strip for a card: the edge being placed (pink) and the edge first in its slot (blue).
const strip = (alg, frames, pink, blue, pinkText, blueText) => ({
  alg,
  stickering: 'edges',
  views: ['cube'],
  marks: [{ piece: pink, colour: 'pink' }, { piece: blue, colour: 'blue' }],
  legend: [{ colour: 'pink', text: pinkText }, { colour: 'blue', text: blueText }],
  frames,
});

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
        text: "the drop uses face turns only, so the centres never move. The flip (U' M')×4 uses M', which moves centres; four M' make a whole turn, so they are back once the flip ends.",
      },
      {
        title: 'Turning the top is free in steps 4 and 5:',
        text: 'it only changes which edge is where in the top layer. Line the top up with the centres at the very end.',
      },
      {
        title: 'Reverse Sassy:',
        text: "U R U' R' (Urvop) is Sassy done backwards: it undoes one Sassy. Sassy six times brings the cube back, so Sassy ×5 is the same as reverse Sassy once, and Sassy ×4 the same as reverse Sassy ×2. Wherever a step says Sassy ×4 or ×5, the reverse gives the same result in fewer moves.",
      },
      {
        title: 'Shorter, with M:',
        text: "M' U2 M U2 (KU2MU2, 4 moves) does exactly what the drop does: top front → bottom front → top back. It is not a repeat (three in a row bring the cube back), and it uses M. Each edge card shows a version built on it under the main algorithm; same starting spot, same result, about 45 moves less per solve.",
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
      'Repeat Sassy until it drops in: 1, 3 or 5 times, depending on where its white sticker faces. Instead of 5 Sassys, do one reverse Sassy (U R U\' R\'): same result.',
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
        extraAlgs: [{ label: 'Same result, 4 moves: reverse Sassy once (Urvop)', alg: REVERSE_SASSY }],
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
      'Turn the top until exactly one corner is in its spot (or all four). Hold the cube so that corner is at the top front-right.',
      { title: 'Two right, two swapped:', text: 'the cycle cannot fix a swap. Turn the top a quarter turn either way: then exactly one corner is in its spot.' },
      'Look where the other three corners need to go. Front-left → back-left → back-right (clockwise from the top): do the corner cycle. The other way round: do the reverse. (The cycle done twice also works, in twice the moves.)',
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
        extraAlgs: [{ label: "Reverse: back-right → back-left → front-left (anticlockwise). Each group backwards: F2 U' R2", alg: '(F2 U\' R2) ×4' }],
        note: "Twelve moves, all half turns but the U. It mixes the edges; they come later. Reverse mnemonic: (F2VR2)×4.",
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
      'Hold an unsolved corner at the bottom front-right. Repeat Sassy until its yellow faces down (2 or 4 times). Instead of 4 Sassys, do reverse Sassy twice: same result. It is exactly the same as 4 Sassys, so the rest of the step does not change.',
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
        extraAlgs: [{ label: 'Instead of Sassy ×4: reverse Sassy ×2 (Urvop ×2)', alg: `(${REVERSE_SASSY}) ×2` }],
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
      { title: 'The drop:', text: '(R2 U2 R2 F2)×2. Three edges swap round: top front → bottom front → top back → top front. Nothing else moves, so the drop fills the bottom front slot from the top front.' },
      { title: 'Setup moves:', text: 'the drop only works on those three spots. When the edge or its slot is somewhere else, a short setup first moves them there: the edge to the top front, white up, and the slot to the bottom front. Do the drop, then the setup backwards. The setup moves other pieces too; undoing it puts them all back, and only the drop\'s three edges stay changed. Card 1 needs no setup; cards 2-4 show the setup, drop and undo spaced apart, with a picture after each part.' },
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
        orientation: 'The edge is at the top front, white facing up. It goes into the bottom front slot. No setup needed.',
        alg: DROPS.downGood.alg,
        displayAlg: DROPS.downGood.display,
        extraAlgs: [{ label: SHORT_LABEL, alg: SHORT.downGood }],
        mnemonicChunks: mn('(R2U2R2F2)×2', '(R2 U2 R2 F2)×2'),
        noViewer: true,
        filmstrip: strip(DROPS.downGood.alg, [
          { after: '', label: 'Start', caption: 'Pink is at the top front, white up. Blue (a top edge) sits in pink\'s slot.' },
          { after: 'R2 U2 R2 F2', label: 'R2 U2 R2 F2 once', caption: 'Halfway: other edges have moved too. Keep going.' },
          { after: 'R2 U2 R2 F2', label: 'Twice: the drop', caption: 'Pink is in the bottom front slot. Blue went to the top. Everything else is back.' },
        ], 'DF', 'UB', 'white/green edge (belongs at the bottom front)', 'yellow/blue edge (a top edge in the slot)'),
      },
      {
        anchor: 'drop-down-flipped',
        name: '2 · Bottom edge, white on the side',
        orientation: 'The edge is at the top right, white facing right. It goes into the bottom front slot, white down.',
        alg: DROPS.downBad.alg,
        displayAlg: DROPS.downBad.display,
        extraAlgs: [{ label: SHORT_LABEL, alg: SHORT.downBad }],
        noViewer: true,
        filmstrip: strip(DROPS.downBad.alg, [
          { after: '', label: 'Start', caption: 'Pink is at the top right, white facing right. Dropped from here it would land white side out.' },
          { after: "F R' F'", label: "Setup: F R' F'", caption: 'Pink is now at the top front with white up: the start of card 1. The setup also moved other pieces.' },
          { after: DROP, label: 'Drop', caption: 'Pink drops into the bottom front slot.' },
          { after: "F R F'", label: "Undo: F R F'", caption: 'The setup backwards puts the other pieces back. Pink stays in its slot, white down.' },
        ], 'DF', 'UB', 'white/green edge (belongs at the bottom front)', 'yellow/blue edge (a top edge in the slot)'),
        note: "Written out in full, the moves cancel a little (F2 F = F'). No mnemonic word for the whole thing.",
      },
      {
        anchor: 'drop-middle',
        name: '3 · Middle edge, top colour matches the front',
        orientation: "Put the edge at the top front. Its top colour matches the front centre. It goes into the front-right slot.",
        alg: DROPS.midGood.alg,
        displayAlg: DROPS.midGood.display,
        extraAlgs: [{ label: SHORT_LABEL, alg: SHORT.midGood }],
        noViewer: true,
        filmstrip: strip(DROPS.midGood.alg, [
          { after: '', label: 'Start', caption: 'Pink is at the top front. Its slot is the front-right, where blue is.' },
          { after: "R' D'", label: "Setup: R' D'", caption: "R' takes the front-right slot down to the bottom right; D' turns it to the bottom front, where the drop fills." },
          { after: DROP, label: 'Drop', caption: 'Pink drops into the slot, now at the bottom front.' },
          { after: 'D R', label: 'Undo: D R', caption: 'D R takes the slot back up to the front-right, with pink in it.' },
        ], 'FR', 'UB', 'green/orange edge (belongs at the front-right)', 'yellow/blue edge (a top edge in the slot)'),
        note: 'No mnemonic: your letter code has no D.',
      },
      {
        anchor: 'drop-middle-flipped',
        name: '4 · Middle edge, top colour matches the right',
        orientation: "Put the edge at the top right. Its top colour matches the right centre. It goes into the front-right slot.",
        alg: DROPS.midBad.alg,
        displayAlg: DROPS.midBad.display,
        extraAlgs: [{ label: SHORT_LABEL, alg: SHORT.midBad }],
        noViewer: true,
        filmstrip: strip(DROPS.midBad.alg, [
          { after: '', label: 'Start', caption: 'Pink is at the top right. Its slot is the front-right, where blue is.' },
          { after: 'F U R2', label: 'Setup: F U R2', caption: 'Pink is now at the top front and its slot at the bottom front: the drop can fill it.' },
          { after: DROP, label: 'Drop', caption: 'Pink drops into the slot.' },
          { after: "R2 U' F'", label: "Undo: R2 U' F'", caption: 'The setup backwards takes the slot back to the front-right, with pink in it.' },
        ], 'FR', 'UL', 'green/orange edge (belongs at the front-right)', 'yellow/red edge (a top edge in the slot)'),
        note: 'Written out in full, the moves cancel a little. No mnemonic word for the whole thing.',
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
        extraAlgs: [{ label: 'Shorter, with M (about 45 moves less per solve)', alg: SHORT.topCycle }],
        diagramViews: ['U', 'cube'],
        note: "Setup R2 D' takes the top right edge down to the bottom front, the drop moves it and two top edges round, and D R2 brings it back up. No mnemonic: your letter code has no D.",
      },
      {
        anchor: 'flip-sides',
        name: '2 · Flip pair (left and right)',
        orientation: "The flip (U' M')×4, then U', then the flip again. The first flip flips the top front and right edges and the bottom front and back; U' moves two different top edges into place; the second flip flips the bottom two back.",
        alg: FLIP_SIDES.alg,
        displayAlg: FLIP_SIDES.display,
        diagramViews: ['U', 'cube'],
        mnemonicChunks: [
          { word: '(VK)×4', moves: "(U' M')×4" },
          { word: 'V', moves: "U'" },
          { word: '(VK)×4', moves: "(U' M')×4" },
        ],
        note: "(U' M') is the pairing from the LSE map. After each (U' M')×4 the centres are back home: four M' are a whole turn.",
      },
      {
        anchor: 'flip-all',
        name: '3 · Flip all four',
        orientation: 'The same with U2 in the middle.',
        alg: FLIP_ALL.alg,
        displayAlg: FLIP_ALL.display,
        diagramViews: ['U', 'cube'],
        mnemonicChunks: [
          { word: '(VK)×4', moves: "(U' M')×4" },
          { word: 'U2', moves: 'U2' },
          { word: '(VK)×4', moves: "(U' M')×4" },
        ],
      },
    ],
  },
];
