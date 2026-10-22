// Philip Marshall's edges-first method, "The Ultimate Solution to Rubik's Cube" (his page, latest revision
// 2005: helm.lu/cube/MarshallPhilipp). Not from the user's notes.
//
// The text is reworded here and his figures are not reproduced: his figures use his own colours (blue
// front, red right, green top in one figure; red opposite orange, yellow opposite green, white opposite
// blue), and this page describes positions by face and by his words. Sequences use WCA notation.
// Marshall writes the Step One example as B' T' R F 2 L T 2 (T = top, B = back); here it is B' U' R F2 L U2.
//
// Every sequence and claim below is checked by log/2026-10-22-marshall-check.mjs.

export const marshallFacts = [
  ['Method', 'Edges first: all 12 edges are placed before any corner, then the corners.'],
  ['Series', 'An Edge Piece Series (F R\' F\' R, four moves) and a Corner Piece Series (eight moves).'],
  ['Steps', 'Five: the cross, the middle-layer edges, the top edges, five corners, and the end game.'],
  ['His figure', 'About 65 moves on average (70 turns) over 100 scrambled cubes; the fewest was 40. Not re-measured here.'],
];

// The two series as picture strips. Each frame is the solved cube after the moves so far (fromSolved).
export const marshallSeries = [
  {
    anchor: 'edge-series',
    name: 'Edge Piece Series',
    orientation: 'Moves three edges round one top corner (front, top, right); the bottom layer is left alone.',
    displayAlg: "F R' F' R",
    noViewer: true,
    filmstrip: {
      alg: "F R' F' R",
      fromSolved: true,
      stickering: 'edges',
      views: ['cube'],
      marks: [
        { piece: 'UF', colour: 'pink' },
        { piece: 'FR', colour: 'pink' },
        { piece: 'UR', colour: 'pink' },
      ],
      legend: [
        { colour: 'pink', text: 'the three edges it moves, from the solved cube' },
      ],
      frames: [
        { after: '', label: 'Solved', caption: 'The three edges outlined are the ones that move.' },
        { after: 'F', label: 'F', caption: 'Front turned clockwise.' },
        { after: "R'", label: "R'", caption: 'Right turned counterclockwise.' },
        { after: "F'", label: "F'", caption: 'Front turned back.' },
        { after: 'R', label: 'R', caption: 'Right turned back. The three edges have moved round the corner, and the bottom layer is unchanged.' },
      ],
    },
  },
  {
    anchor: 'corner-series',
    name: 'Corner Piece Series (first turn to the right)',
    orientation: 'Three top corners move round a triangle. Marshall: the top turns alternate, and each side face is turned away and then back.',
    displayAlg: "U R U' L' U R' U' L",
    noViewer: true,
    filmstrip: {
      alg: "U R U' L' U R' U' L",
      fromSolved: true,
      stickering: 'full',
      views: ['cube'],
      marks: [
        { piece: 'UFL', colour: 'pink' },
        { piece: 'UBL', colour: 'pink' },
        { piece: 'UBR', colour: 'pink' },
      ],
      legend: [
        { colour: 'pink', text: 'the three corners it moves, from the solved cube' },
      ],
      frames: [
        { after: '', label: 'Solved', caption: 'The top corners that will move are outlined.' },
        { after: "U R U' L'", label: 'Moves 1–4', caption: 'Halfway: the corners have moved part of the way round the triangle.' },
        { after: "U R' U' L", label: 'Moves 5–8', caption: 'Done. From a solved cube the three corners end twisted. The series is for corners that are out of place: each one rolls into its place.' },
      ],
    },
  },
  {
    anchor: 'corner-series-left',
    name: 'Corner Piece Series (first turn to the left)',
    orientation: "The mirror image: the same rules with the first top turn to the left. Here the triangle is the mirror of the first.",
    displayAlg: "U' L' U R U' L U R'",
    noViewer: true,
    filmstrip: {
      alg: "U' L' U R U' L U R'",
      fromSolved: true,
      stickering: 'full',
      views: ['cube'],
      marks: [
        { piece: 'UFR', colour: 'pink' },
        { piece: 'UBR', colour: 'pink' },
        { piece: 'UBL', colour: 'pink' },
      ],
      legend: [
        { colour: 'pink', text: 'the three corners it moves, from the solved cube' },
      ],
      frames: [
        { after: '', label: 'Solved', caption: 'The corners that will move are outlined: the two at the back of the top and the one at the front right.' },
        { after: "U' L' U R", label: 'Moves 1–4', caption: 'Halfway.' },
        { after: "U' L U R'", label: 'Moves 5–8', caption: 'Done. The mirror of the first series.' },
      ],
    },
  },
];

// Summary of the two series, checked on the simulator from a solved cube.
export const marshallSeriesTable = [
  ['Edge Piece Series', "F R' F' R", 'Three edges: front-top, front-right, top-right', 'Four corners: front-top-right, back-top-right, front-top-left, front-bottom-right', 'Marshall: the corners do not matter at this stage.'],
  ['Corner Piece Series, first turn right', "U R U' L' U R' U' L", 'None', 'Three top corners: front-left, back-left, back-right', 'Each corner rolls into its place; from solved they end twisted.'],
  ['Corner Piece Series, first turn left', "U' L' U R U' L U R'", 'None', 'Three top corners: front-right, back-right, back-left', 'The mirror image of the right-first series.'],
];

// The five steps. `how` lines are plain strings or { title, text }.
export const marshallSteps = [
  {
    id: 'step-1',
    title: 'The cross',
    short: 'Cross',
    source: 'marshall',
    goal: 'A cross on one face, with the edges that already sit on it used where possible.',
    how: [
      { title: 'Choose a face:', text: 'pick a face whose centre matches an edge already on it. In his example, three faces qualify.' },
      { title: 'Work from the top:', text: 'move each edge to the top face so it sits correctly next to the top edges already there, rather than taking every edge to the bottom first. He says the bottom-first approach needs about eight moves for this cube.' },
      { title: 'His example:', text: "B' U' R F2 L U2 (his notation: B' T' R F 2 L T 2). Six moves. The card below shows the start the moves solve." },
      { title: 'With practice:', text: 'he expects about seven moves on average. How you reach the cross is up to you, provided you can do it.' },
    ],
    notes: [
      'Added here, not in his text: his figure 4a is not in the text. The start on the card is found by undoing the six moves, and it matches the four edge positions his words give (the blue/green edge on top; blue/red at front-right; blue/yellow at bottom-front; blue/orange at back-bottom). The check is in log/2026-10-22-marshall-check.mjs.',
    ],
    cases: [
      {
        anchor: 'cross-example',
        name: 'His example: the start of the cross',
        orientation: 'Blue is the top face in his step. The four blue edges are outlined.',
        displayAlg: "B' U' R F2 L U2",
        noViewer: true,
        filmstrip: {
          alg: "B' U' R F2 L U2",
          stickering: 'edges',
          views: ['cube'],
          marks: [
            { piece: 'UF', colour: 'pink' },
            { piece: 'UR', colour: 'pink' },
            { piece: 'UB', colour: 'pink' },
            { piece: 'UL', colour: 'pink' },
          ],
          legend: [
            { colour: 'pink', text: 'the four edges with a blue sticker (blue is the top face in his step)' },
          ],
          frames: [
            { after: '', label: 'Start', caption: 'The start the six moves solve, with the blue edges outlined.' },
            { after: "B' U'", label: "B' U'", caption: 'Back and top turned.' },
            { after: "R F2", label: 'R F2', caption: 'Right and front turned.' },
            { after: 'L U2', label: 'L U2', caption: 'The cross is on the top face.' },
          ],
        },
      },
    ],
  },
  {
    id: 'step-2',
    title: 'Middle-layer edges',
    short: 'Middle edges',
    source: 'marshall',
    goal: 'Three middle-layer edges in place. Three top edges with their top colour up. One top edge in the middle layer. The fourth middle edge on top.',
    how: [
      { title: 'Take an edge up:', text: 'turn the top so the middle-layer edge that belongs in place can be moved by the Edge Piece Series (F R\' F\' R) into its position and orientation. The series moves three edges round one top corner, so it moves the target edge and two top edges.' },
      { title: 'Choose which version:', text: 'the same target can be placed with the top turned so it is the first or the third edge the series moves. Pick the version that keeps the top edges\' top colour up, since that is the aim of this step.' },
      { title: 'Remove a flipped edge:', text: 'a middle-layer edge that is in position but flipped must be taken out with the same series before it can be placed again.' },
      { title: 'Repeat:', text: 'do this until three middle-layer edges are in place, three top edges have their top colour up, one top edge is in the middle layer, and the fourth middle-layer edge is on top.' },
      { title: 'If two top edges are right:', text: 'when three middle edges are in place but only two top edges have their top colour up, apply one more series using only top edges. The top edge in the middle layer comes up with its top colour up, and the top edge with the wrong colour goes into the middle layer.' },
      { title: 'Finish:', text: 'if the last turn of a series is a turn of the top face, it can be left out: a top turn cannot change the bottom layer, which the series is there to protect.' },
    ],
    notes: [
      'The choice of which edge to take next, and which version of the series to use, is a judgement in his method. No rule for it is coded or checked here.',
    ],
  },
  {
    id: 'step-3',
    title: 'Top edges',
    short: 'Top edges',
    source: 'marshall',
    goal: 'The fourth middle-layer edge in place, and the four top edges in their correct order with their top colour up.',
    how: [
      { title: 'Four cases', text: 'for the three top edges left after step 2: all three out of order; two adjacent in order and one out; two opposite in order and one out; or all three in order with each other.' },
      { title: 'All three out of order:', text: 'turn the top so three top edges (one of them the middle-layer edge) are at the top front-right corner, then apply the Edge Piece Series with the middle-layer edge as the first edge. This turns the top edges into one of the other cases.' },
      { title: 'Two adjacent in order, one out:', text: 'turn the top 180°. Apply the Edge Piece Series to three edges: the top-layer edge that is in the middle layer, the top edge that is out of order, and the fourth middle-layer edge. Turn the top 90° the other way to finish.' },
      { title: 'Two opposite in order, one out:', text: "move the out-of-order top edge to the other side of the top layer: X U2 X' U2, where X is one side face turned 90° clockwise. Then the top edges are in order." },
      { title: 'All three in order:', text: 'swap top edges with the middle-layer edge one at a time. Turn the top 90° one way and one side face 90° the same way; then turn the top 90° the other way and the side face 90° back the other way. Repeat, alternating the directions, until the fourth turn of the side face brings the last top edge back on top and puts the middle-layer edge in place.' },
      { title: 'Finish:', text: 'turn the top so every top edge is in its place. The twelfth edge then must be right, since eleven right edges force the last one.' },
    ],
    notes: [
      'Marshall names the side faces by the colour in his figure 6. This page says "a side face"; the face is the one beside the edge being moved. Check the case against a picture before relying on the face: his figures are not reproduced here.',
    ],
  },
  {
    id: 'step-4',
    title: 'Five corners',
    short: 'Five corners',
    source: 'marshall',
    goal: 'Five corners placed, each in its place and turned correctly.',
    how: [
      { title: 'Look for a corner that moves along an edge:', text: 'the Corner Piece Series moves a corner along one cube edge and rolls it into its place. Some corners are placed this way, and some move across a face diagonal. Use whichever is in front of you.' },
      { title: 'Two at once:', text: 'a series sometimes places two corners together. When one does, use it: it saves a series.' },
      { title: 'Set up:', text: 'when no corner can move into place, turn one face 90° or 180° first. That brings a corner into a position the series can use, or moves a second corner into the triangle. Apply the series, then turn the face back. Marshall says about 70% of the time a 90° turn does it and about 30% a 180° turn.' },
      { title: 'A corner in place but turned:', text: 'it has to come out. It can be taken out in the same series that places another corner, but a series cannot place two corners and remove a third.' },
      { title: 'Two corners in each other\'s place:', text: 'only one can be placed in one series; the other is moved out of the way.' },
      { title: 'Check:', text: 'step 4 is complete when five corners are placed. A series can add one or two to the count.' },
    ],
    notes: [
      'Marshall\'s worked examples for this step (his figures 7 to 13) are pictures and are not reproduced. The setups are described by face in words, not by a worked move list.',
    ],
  },
  {
    id: 'step-5',
    title: 'End game',
    short: 'End game',
    source: 'marshall',
    goal: 'The last three corners placed, with one Corner Piece Series. Once two corners are right the third must be right too.',
    how: [
      { title: 'Find or make a corner:', text: 'look for a corner that can move along an edge into place. Half the time one exists; if none does, make one with a 90° turn of a face (about 70% of the time) or a 180° turn (about 30%).' },
      { title: 'Note the colour:', text: 'the first corner will replace the second corner. Note the colour of the second corner that comes to the top face when it is placed in one of the two target positions.' },
      { title: 'Find the third corner:', text: 'find the third corner on the face of that colour, and note its colour on that face.' },
      { title: 'Bring it to the top:', text: 'turn faces until that colour is on the top face, in one of the target positions.' },
      { title: 'Series:', text: 'apply the Corner Piece Series so the target colour of the second corner replaces that colour. The three corners then move into place.' },
      { title: 'Reverse:', text: 'turn the faces back that you turned in step 4.' },
      { title: 'Last corner:', text: 'you need to place only the first two. When everything else is right, the last corner must be right too.' },
    ],
    notes: [
      'Marshall leaves one rare arrangement (his figure 21) for the reader to solve, and gives a hint only. It is not solved here.',
      'Marshall describes these rules in colours. The steps are followed as he gives them; the examples in his figures 14 to 21 are not reproduced.',
    ],
  },
];

export const marshallSources = {
  marshall: "Philip Marshall's page",
};

// What this page does not check. Listed on the page so nobody takes it for checked.
export const marshallGaps = [
  'The whole method on random scrambles: not run. Marshall says his average is about 65 moves over 100 scrambles; that figure is his, not measured here.',
  'The judgement parts of steps 2 to 5 (which edge or corner to take next, and which face to set up): his rules are reworded, not coded, so they are not checked by simulation.',
  'His worked examples in steps 2 to 5: they are pictures in his page and are not reproduced.',
  'His statement that one of the three edges in the Edge Piece Series ends inverted: his figure numbers the edges, and the page does not reproduce that numbering.',
];
