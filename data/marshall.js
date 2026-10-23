// Philip Marshall's edges-first method, "The Ultimate Solution to Rubik's Cube" (his page, latest revision
// 2005: helm.lu/cube/MarshallPhilipp). Not from the user's notes.
//
// The text is reworded here and his figures are not reproduced: his figures use his own colours (blue
// front, red right, green top in one figure; red opposite orange, yellow opposite green, white opposite
// blue), and this page describes positions by face and by his words. Sequences use WCA notation.
// Marshall writes the Step One example as B' T' R F 2 L T 2 (T = top, B = back); here it is B' U' R F2 L U2.
//
// Every sequence and claim below is checked by log/2026-10-22-marshall-check.mjs.
//
// NOT Marshall's: two extra algorithms at the end (a corner twist and an edge flip) for orientations the
// series cannot fix. They come from published sources (credited in extraAlgsTable) and were checked on the
// simulator: each changes only the orientation of the named pieces, and moves nothing else.

export const marshallFacts = [
  ['Method', 'Edges first: all 12 edges are placed before any corner, then the corners.'],
  ['Series', 'An Edge Piece Series (F R\' F\' R, four moves) and a Corner Piece Series (eight moves).'],
  ['Steps', 'Five: the cross, the middle-layer edges, the top edges, five corners, and the end game.'],
  ['His figure', 'About 65 moves on average (70 turns) over 100 scrambled cubes; the fewest was 40. Not re-measured here.'],
  ['Added here', 'Two extra algorithms, not Marshall\'s: a corner twist and an edge flip, from published sources, for turned pieces the series cannot fix.'],
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
        { after: 'R', label: 'R', caption: 'Right turned back. The bottom layer is unchanged.' },
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
        { after: "U R' U' L", label: 'Moves 5–8', caption: 'Done. From a solved cube the three corners end twisted. Each corner rolls into its place when it is out of place.' },
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
      { title: 'Work from the top:', text: 'move each edge to the top face so it sits correctly next to the top edges already there. He says the bottom-first approach needs about eight moves for this cube.' },
      { title: 'His example:', text: "B' U' R F2 L U2 (his notation: B' T' R F 2 L T 2). Six moves. The card below shows the start the moves solve." },
      { title: 'With practice:', text: 'he expects about seven moves on average. How you reach the cross is up to you, provided you can do it.' },
    ],
    notes: [
      'Added here: the start on the card is found by undoing the six moves. It matches the four edge positions in his words. Check: log/2026-10-22-marshall-check.mjs.',
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
      { title: 'Take an edge up:', text: "turn the top so the middle edge that belongs in place can be moved by the Edge Piece Series (F R' F' R). The series moves three edges round one top corner: the target and two top edges." },
      { title: 'Choose which version:', text: "the target can be the first or the third edge the series moves. Pick the one that keeps the top colour up." },
      { title: 'Remove a flipped edge:', text: 'a middle edge that is in place but flipped must be taken out with the same series before it can be placed again.' },
      { title: 'Repeat:', text: 'until three middle edges are in place, three top edges have their top colour up, one top edge is in the middle layer, and the fourth middle edge is on top.' },
      { title: 'If two top edges are right:', text: 'with three middle edges in place but only two top edges right, apply one series using only top edges.' },
      { title: 'Finish:', text: 'a top turn at the end of a series can be left out; it cannot change the bottom layer.' },
    ],
    cases: [
      {
        anchor: 'edge-series-example',
        name: 'One series places the last three edges',
        orientation: 'Nine edges are in place. One series places the other three (outlined).',
        displayAlg: "F R' F' R",
        noViewer: true,
        filmstrip: {
          alg: "F R' F' R",
          stickering: 'edges',
          views: ['cube'],
          marks: [
            { piece: 'UR', colour: 'pink' },
            { piece: 'UF', colour: 'pink' },
            { piece: 'FR', colour: 'pink' },
          ],
          legend: [{ colour: 'pink', text: 'the three edges that are out of place at the start' }],
          frames: [
            { after: '', label: 'Start', caption: 'Nine edges in place; the three outlined are not.' },
            { after: 'F', label: 'F', caption: 'Front turned clockwise.' },
            { after: "R'", label: "R'", caption: 'Right turned counterclockwise.' },
            { after: "F'", label: "F'", caption: 'Front turned back.' },
            { after: 'R', label: 'R', caption: 'Right turned back. All twelve edges are in place.' },
          ],
        },
      },
      {
        anchor: 'edge-series-setup',
        name: 'A top turn first, then the series',
        orientation: 'Seven edges in place. A top turn places two more; the series places the last three.',
        displayAlg: "U F R' F' R",
        noViewer: true,
        filmstrip: {
          alg: "U F R' F' R",
          stickering: 'edges',
          views: ['cube'],
          marks: [
            { piece: 'UF', colour: 'pink' },
            { piece: 'UL', colour: 'pink' },
            { piece: 'UB', colour: 'pink' },
            { piece: 'UR', colour: 'pink' },
            { piece: 'FR', colour: 'pink' },
          ],
          legend: [{ colour: 'pink', text: 'the five edges that are out of place at the start' }],
          frames: [
            { after: '', label: 'Start', caption: 'Seven edges in place. The five outlined are not.' },
            { after: 'U', label: 'U', caption: 'Top turned clockwise: nine edges are in place.' },
            { after: 'F R\' F\' R', label: "F R' F' R", caption: 'The series. All twelve edges are in place.' },
          ],
        },
      },
    ],
    notes: [
      'The choice of which edge to take next, and which version of the series to use, is his judgement. No rule for it is coded or checked here.',
      'Added here: if an edge is in place but turned, and the series cannot turn it back, the edge flip at the end of the page turns two edges in place and moves nothing else.',
    ],
  },
  {
    id: 'step-3',
    title: 'Top edges',
    short: 'Top edges',
    source: 'marshall',
    goal: 'The fourth middle-layer edge in place, and the four top edges in their correct order with their top colour up.',
    how: [
      { title: 'Four cases', text: 'the three top edges left after step 2 are all out of order, two adjacent in order, two opposite in order, or all in order.' },
      { title: 'All three out of order:', text: 'turn the top so three top edges (one the middle-layer edge) are at the top front-right, then apply the series with the middle-layer edge first.' },
      { title: 'Two adjacent in order, one out:', text: "turn the top 180°. Apply the series to the top-layer edge in the middle layer, the out-of-order top edge and the fourth middle edge. Turn the top 90° back." },
      { title: 'Two opposite in order, one out:', text: "move the out-of-order top edge to the other side of the top layer with X U2 X' U2, where X is one side face turned 90° clockwise. Then the top edges are in order." },
      { title: 'All three in order:', text: "swap top edges with the middle-layer edge one at a time: turn the top and one side face 90° the same way, then back the other way. Repeat, alternating, until the fourth side-face turn puts the middle edge in place." },
      { title: 'Finish:', text: 'turn the top so every top edge is in place. The twelfth edge is then right, since eleven right edges force the last one.' },
    ],
    cases: [
      {
        anchor: 'side-turn',
        name: 'The side turn, from a solved cube',
        orientation: "Marshall's side turn, X U2 X' U2, with X = R, shown from a solved cube.",
        displayAlg: "R U2 R' U2",
        noViewer: true,
        filmstrip: {
          alg: "R U2 R' U2",
          fromSolved: true,
          stickering: 'edges',
          views: ['cube'],
          marks: [
            { piece: 'UR', colour: 'pink' },
            { piece: 'FR', colour: 'pink' },
            { piece: 'UL', colour: 'pink' },
          ],
          legend: [{ colour: 'pink', text: 'the three edges it moves' }],
          frames: [
            { after: '', label: 'Solved', caption: 'The cube before the side turn.' },
            { after: 'R', label: 'R', caption: 'Right turned clockwise.' },
            { after: 'U2', label: 'U2', caption: 'Top turned half way.' },
            { after: "R'", label: "R'", caption: 'Right turned back.' },
            { after: 'U2', label: 'U2', caption: 'Top turned back. Only three edges move; the bottom layer is untouched.' },
          ],
        },
      },
    ],
    notes: [
      'Marshall names the side faces by colour in his figure 6, which is not reproduced here. This page says "a side face": the one beside the edge being moved.',
    ],
  },
  {
    id: 'step-4',
    title: 'Five corners',
    short: 'Five corners',
    source: 'marshall',
    goal: 'Five corners placed, each in its place and turned correctly.',
    how: [
      { title: 'Look for a corner that moves along an edge:', text: 'the Corner Piece Series moves a corner along one cube edge into place. Some corners go this way; others move across a face diagonal.' },
      { title: 'Two at once:', text: 'a series sometimes places two corners together. Use it when it does.' },
      { title: 'Set up:', text: 'when no corner can move into place, turn one face 90° or 180° first, apply the series, then turn the face back. Marshall says 90° works about 70% of the time, 180° about 30%.' },
      { title: 'A corner in place but turned:', text: 'it has to come out. One series cannot place two corners and remove a third.' },
      { title: "Two corners in each other's place:", text: 'only one can be placed in one series; the other is moved out of the way.' },
      { title: 'Check:', text: 'step 4 is complete when five corners are placed.' },
    ],
    cases: [
      {
        anchor: 'setup-and-undo',
        name: 'A setup turn, a series, and the undo',
        orientation: 'Five corners in place; UFR, UBL and UFL are out. A right turn, the series and the undo place all eight.',
        displayAlg: "R U R U' L' U R' U' L R'",
        noViewer: true,
        filmstrip: {
          alg: "R U R U' L' U R' U' L R'",
          stickering: 'full',
          views: ['cube'],
          marks: [
            { piece: 'UFR', colour: 'pink' },
            { piece: 'UBL', colour: 'pink' },
            { piece: 'UFL', colour: 'pink' },
          ],
          legend: [{ colour: 'pink', text: 'the three corners that are out of place at the start' }],
          frames: [
            { after: '', label: 'Start', caption: 'Five corners in place.' },
            { after: 'R', label: 'R', caption: 'Right turned: this moves placed corners out, so only two are in place.' },
            { after: "U R U' L' U R' U' L", label: 'The series', caption: 'The series: four corners are in place.' },
            { after: "R'", label: "R'", caption: 'Right turned back. All eight corners are in place.' },
          ],
        },
      },
    ],
    notes: [
      "Marshall's worked examples for this step (his figures 7 to 13) are not reproduced. The setups are described in words.",
      'Added here: a turned corner the series cannot fix can be turned by the corner twist at the end of the page.',
    ],
  },
  {
    id: 'step-5',
    title: 'End game',
    short: 'End game',
    source: 'marshall',
    goal: 'The last three corners placed, with one Corner Piece Series. Once two corners are right the third must be right too.',
    how: [
      { title: 'Find or make a corner:', text: 'look for a corner that can move along an edge into place. Half the time one exists; if not, make one with a 90° or 180° turn (about 70% and 30%).' },
      { title: 'Note the colour:', text: 'the first corner will replace the second. Note the colour of the second corner when it reaches the top face in a target position.' },
      { title: 'Find the third corner:', text: 'find the third corner on the face of that colour, and note its colour on that face.' },
      { title: 'Bring it to the top:', text: 'turn faces until that colour is on the top face, in one of the target positions.' },
      { title: 'Series:', text: 'apply the Corner Piece Series so the target colour of the second corner replaces that colour. The three corners then move into place.' },
      { title: 'Reverse:', text: 'turn back the faces you turned in step 4.' },
      { title: 'Last corner:', text: 'you need to place only the first two. When everything else is right, the last corner must be right too.' },
    ],
    cases: [
      {
        anchor: 'endgame-series',
        name: 'Three corners left, one series',
        orientation: 'Five corners in place; UBR, UBL and UFL move into place with one series.',
        displayAlg: "U R U' L' U R' U' L",
        noViewer: true,
        filmstrip: {
          alg: "U R U' L' U R' U' L",
          stickering: 'full',
          views: ['cube'],
          marks: [
            { piece: 'UBR', colour: 'pink' },
            { piece: 'UBL', colour: 'pink' },
            { piece: 'UFL', colour: 'pink' },
          ],
          legend: [{ colour: 'pink', text: 'the three corners left to place' }],
          frames: [
            { after: '', label: 'Start', caption: 'Five corners in place; the three outlined are left.' },
            { after: "U R U' L'", label: 'Moves 1–4', caption: 'The series, first half.' },
            { after: "U R' U' L", label: 'Moves 5–8', caption: 'The series, second half: all eight corners are in place.' },
          ],
        },
      },
    ],
    notes: [
      'Marshall leaves one rare arrangement (his figure 21) for the reader to solve, and gives a hint only. It is not solved here.',
      "Marshall describes these rules in colours. His examples (figures 14 to 21) are not reproduced.",
    ],
  },
];

// The two extra algorithms. Not Marshall's. Each is a published algorithm, checked on the simulator.
// Both are shown as what they do to a solved cube (fromSolved), so only the turned pieces show.
export const marshallExtraAlgs = [
  {
    anchor: 'extra-corner-twist',
    name: 'Corner twist: two corners, in place',
    orientation: 'Turns two corners in place in opposite directions; nothing else moves.',
    displayAlg: "D R' D' R U R' D R D' R' D R U' R' D' R",
    noViewer: true,
    filmstrip: {
      alg: "D R' D' R U R' D R D' R' D R U' R' D' R",
      fromSolved: true,
      stickering: 'full',
      views: ['cube'],
      marks: [
        { piece: 'DFL', colour: 'pink' },
        { piece: 'UBR', colour: 'pink' },
      ],
      legend: [{ colour: 'pink', text: 'the two corners it turns' }],
      frames: [
        { after: '', label: 'Solved', caption: 'The cube before the algorithm.' },
        { after: "D R' D' R U R' D R", label: 'Moves 1–8', caption: 'Halfway.' },
        { after: "D' R' D R U' R' D' R", label: 'Moves 9–16', caption: 'Done: the two outlined corners are turned, and no corner or edge has moved.' },
      ],
    },
  },
  {
    anchor: 'extra-edge-flip',
    name: 'Edge flip: two edges, in place',
    orientation: 'Flips two adjacent edges in place; nothing else moves. E is the middle slice, turned like D.',
    displayAlg: "R' E' R2 E2 R' U' R E2' R2' E R U",
    noViewer: true,
    filmstrip: {
      alg: "R' E' R2 E2 R' U' R E2' R2' E R U",
      fromSolved: true,
      stickering: 'edges',
      views: ['cube'],
      marks: [
        { piece: 'UF', colour: 'pink' },
        { piece: 'UR', colour: 'pink' },
      ],
      legend: [{ colour: 'pink', text: 'the two edges it flips' }],
      frames: [
        { after: '', label: 'Solved', caption: 'The cube before the algorithm.' },
        { after: "R' E' R2 E2 R' U'", label: 'Moves 1–6', caption: 'Halfway.' },
        { after: "R E2' R2' E R U", label: 'Moves 7–12', caption: 'Done: the two outlined edges are flipped, and no other edge or corner has moved.' },
      ],
    },
  },
];

// The table for the extra algorithms, with where each comes from.
export const marshallExtraAlgsTable = [
  ['Corner twist', "D R' D' R U R' D R D' R' D R U' R' D' R", '16', 'DFL and UBR, turned in opposite directions', 'Waterloo corner-twist generator (csclub.uwaterloo.ca/~krmatthe/corner-twist.cgi), first result for stickers LDF and RUB'],
  ['Edge flip', "R' E' R2 E2 R' U' R E2' R2' E R U", '12', 'UF and UR, flipped', 'Ned Batchelder, "Two-part Rubik\'s algorithms" (nedbatchelder.com/text/rubiks_algorithms)'],
];

export const marshallSources = {
  marshall: "Philip Marshall's page",
  published: 'Published algorithms (not Marshall)',
};

// What this page does not check. Listed on the page so nobody takes it for checked.
export const marshallGaps = [
  'The whole method on random scrambles, and his 65-move average (his figure).',
  'The judgement in steps 2 to 5: which edge or corner to take next, and which face to set up.',
  'His worked examples for steps 2 to 5 (his figures). Ours are built from the moves and checked.',
  'How the two extra algorithms fit into a full solve.',
  'His remark that one edge in the Edge Piece Series ends inverted (his figure numbering).',
];
