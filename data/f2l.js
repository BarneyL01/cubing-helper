// F2L map — NOT our original work. Transcribed from the chart at
// https://dogschasingsquirrels.files.wordpress.com/2014/06/f2l.jpg
// (dogschasingsquirrels.wordpress.com, 2014). Every case's algorithm leads
// to another case on the chart, and every chain ends at the solved slot
// (case 37). Case numbers, algorithms, descriptions and arrows are as on
// the chart; the pictures on the page are our own, computed from the
// algorithms (and use this site's colours, not the chart's).
export const F2L_SOURCE = {
  image: 'https://dogschasingsquirrels.files.wordpress.com/2014/06/f2l.jpg',
  site: 'https://dogschasingsquirrels.wordpress.com/',
};

// id: the chart's label. step: the algorithm as written on the chart.
// next: the case that step leads to. hold: "y'" for the in-between steps the
// chart draws with the cube already turned (you arrive at them after a y' or
// d). group: which final insert the chain ends with.
export const f2lNodes = [
  { id: '37', name: 'Solved', solved: true },

  // Chains ending in R U' R'
  { id: '1b', step: "(R U' R')", next: '37', group: 'a' },
  { id: '1', step: 'U', next: '1b', group: 'a' },
  { id: '1c', step: 'U', next: '1', group: 'a' },
  { id: '5', step: "(U' R U R')", next: '1c', desc: 'Reposition edge', group: 'a' },
  { id: '7', step: "U' (R U2' R')", next: '1c', desc: 'Reposition edge', group: 'a' },
  { id: '12', step: "R U' R' U R U' R'", next: '1c', desc: 'Reposition edge & flip corner', group: 'a' },
  { id: '19', step: "U (R U2 R')", next: '1', desc: 'Pair made on side', group: 'a' },
  { id: '25', step: "d' (L' U L) d", next: '1b', desc: 'Corner in place, edge in U', group: 'a' },
  { id: '27', step: "(R U' R' U)", next: '1b', desc: 'Corner in place, edge in U', group: 'a' },
  { id: '33', step: "(U' R U' R')", next: '1c', desc: 'Edge in place, corner in U', group: 'a' },
  { id: '38', step: "(R' F R F')", next: '12', desc: 'Edge and corner in place', group: 'a' },
  { id: '39', step: "(R U' R')", next: '5', desc: 'Edge and corner in place', group: 'a' },
  { id: '40', step: "(R U' R')", next: '19', desc: 'Edge and corner in place', group: 'a' },

  // Chains ending in y' … R' U' R
  { id: '3b', step: "(R' U' R)", next: '37', hold: "y'", group: 'b' },
  { id: '3', step: "y'", next: '3b', group: 'b' },
  { id: '3c', step: 'd', next: '3b', group: 'b' },
  { id: '9', step: "U' R U' R'", next: '3c', desc: 'Reposition edge & flip corner', group: 'b' },
  { id: '11', step: "U' (R U2' R')", next: '3c', desc: 'Reposition edge & flip corner', group: 'b' },
  { id: '13', step: "d (R' U R U')", next: '3b', desc: 'Reposition edge & flip corner', group: 'b' },
  { id: '16', step: "(R U' R' U)", next: '3c', desc: 'Split pair by going over', group: 'b' },
  { id: '18', step: "y' (R' U2 R) U", next: '3b', desc: 'Split pair by going over', group: 'b' },
  { id: '22', step: "y' (R' U R) U2", next: '3b', desc: 'Pair made on side', group: 'b' },
  { id: '29', step: "y' (R' U' R U)", next: '3b', desc: 'Corner in place, edge in U', group: 'b' },
  { id: '35', step: "(U' R U R')", next: '3c', desc: 'Edge in place, corner in U', group: 'b' },
  { id: '41', step: "(R U' R') d (R' U' R U')", next: '3b', desc: 'Edge and corner in place', group: 'b' },

  // Chains ending in y' … R' U R
  { id: '2c', step: "(R' U R)", next: '37', hold: "y'", group: 'c' },
  { id: '2b', step: "U'", next: '2c', hold: "y'", group: 'c' },
  { id: '2d', step: "(R' U R)", next: '2b', hold: "y'", group: 'c' },
  { id: '2', step: "y'", next: '2b', group: 'c' },
  { id: '6', step: "d (R' U' R) U'", next: '2b', desc: 'Reposition edge', group: 'c' },
  { id: '8', step: "d (R' U2 R) U'", next: '2b', desc: 'Reposition edge', group: 'c' },
  { id: '20', step: "y' U' (R' U2 R)", next: '2b', desc: 'Pair made on side', group: 'c' },
  { id: '24', step: "(R U R') d", next: '2d', desc: 'Weird', group: 'c' },
  { id: '28', step: "y'", next: '2d', desc: 'Corner in place, edge in U', group: 'c' },
  { id: '31', step: "(R U' R') d", next: '2c', desc: 'Edge in place, corner in U', group: 'c' },
  {
    id: '42',
    step: "(R U' R' U)",
    next: '6',
    desc: 'Edge and corner in place',
    group: 'c',
    // Chart quirk: 42's step lands one U-turn away from case 6 as drawn, so
    // following the arrows literally doesn't solve it. Skipping 2b's U' does,
    // and matches the chart's picture of 42 exactly (checked by simulation).
    fullAlg: "R U' R' U d R' U' R U' R' U R",
    note: "Chart quirk: this lands one U-turn off from case 6 as drawn. After case 6's moves, skip 2b's U' and go straight to 2c's R' U R.",
  },

  // Chains ending in R U R'
  { id: '4', step: "(R U R')", next: '37', group: 'd' },
  { id: '10', step: "U' (R U R' U)", next: '4', desc: 'Reposition edge & flip corner', group: 'd' },
  { id: '14', step: "U' (R U' R' U)", next: '4', desc: 'Reposition edge & flip corner', group: 'd' },
  { id: '15', step: "y' (R' U R U') d'", next: '4', desc: 'Split pair by going over', group: 'd' },
  { id: '17', step: "(R U2 R') U'", next: '4', desc: 'Split pair by going over', group: 'd' },
  { id: '21', step: "(R U' R') U2", next: '4', desc: 'Pair made on side', group: 'd' },
  { id: '23', step: "U (F R' F' R) U", next: '4', desc: 'Weird', group: 'd' },
  { id: '30', step: "(R U R' U')", next: '4', desc: 'Corner in place, edge in U', group: 'd' },
  { id: '32', step: "(R U R' U')", next: '30', desc: 'Edge in place, corner in U', group: 'd' },
  { id: '34', step: "U' (R U2' R') U", next: '4', desc: 'Edge in place, corner in U', group: 'd' },
  { id: '36', step: "d (R' U' R) d'", next: '4', desc: 'Edge in place, corner in U', group: 'd' },

  // Its own chain: straight to solved
  { id: '26', step: "U (R U' R') d' (L' U L)", next: '37', desc: 'Corner in place, edge in U', group: 'e' },
];

export const F2L_GROUPS = {
  a: "Ends with R U' R'",
  b: "Ends with y' … R' U' R",
  c: "Ends with y' … R' U R",
  d: "Ends with R U R'",
  e: 'Straight to solved',
};

const byId = new Map(f2lNodes.map((n) => [n.id, n]));

export function f2lNode(id) {
  return byId.get(id);
}

// The whole solution from a case to solved: its step, then the next case's
// step, and so on. Parentheses are only the chart's grouping.
export function f2lFullAlg(id) {
  if (byId.get(id)?.fullAlg) return byId.get(id).fullAlg;
  const moves = [];
  for (let n = byId.get(id); n && !n.solved; n = byId.get(n.next)) {
    moves.push(n.step.replace(/[()]/g, ''));
  }
  return moves.join(' ').replace(/\s+/g, ' ').trim();
}

// Cases that lead into this one (the arrows pointing at it on the chart).
export function f2lIncoming(id) {
  return f2lNodes.filter((n) => n.next === id).map((n) => n.id);
}
