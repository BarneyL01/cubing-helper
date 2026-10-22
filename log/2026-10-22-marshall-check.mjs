// Checks the sequences and claims on the Marshall page (3x3/marshall/index.html, data/marshall.js).
//   node log/2026-10-22-marshall-check.mjs
// Prints ALL OK when every check passes. Runs the moves on the cube simulator (js/cube-sim.js).
//
// What is checked: the two series, the Step One start position (built from Marshall's words, since
// his figure is not in the text), and the Corner Piece Series orientation claim. What is NOT checked
// here: the whole method on random scrambles. Marshall's steps 2-5 depend on his judgement about
// which edge or corner to take next, and that is not coded (see the page's "not checked yet" section).
import { applyAlg, solvedCube, faceOf, caseState } from '../js/cube-sim.js';
import { invertAlg } from '../js/algs.js';
import { pieceName } from '../js/bld-memo.js';

const failures = [];
const check = (name, ok, detail = '') => {
  if (!ok) failures.push(detail ? `${name}: ${detail}` : name);
};
const log = (...a) => console.log(...a);

// Stickers grouped by the piece they belong to (pieces are found by where their stickers are).
const pieces = (state) => {
  const by = new Map();
  for (const s of state) {
    const k = s.p.join();
    (by.get(k) ?? by.set(k, []).get(k)).push(s);
  }
  return [...by.values()].map((ss) => ({
    name: pieceName(ss[0].p),
    kind: ss.length,
    stickers: ss.map((s) => ({ colour: s.colour, face: faceOf(s.n) })),
  }));
};
// A piece is "home" when every sticker sits on the face of its own colour.
const isHome = (piece) => piece.stickers.every((s) => s.colour === s.face);
const movedNames = (state) => pieces(state).filter((p) => !isHome(p)).map((p) => p.name).sort();
const edgesOf = (state) => pieces(state).filter((p) => p.kind === 2);
const cornersOf = (state) => pieces(state).filter((p) => p.kind === 3);

// Standard corner orientation: the piece is oriented when its U/D-coloured sticker is on a U/D face.
const cornerTwisted = (piece) => {
  const ud = piece.stickers.find((s) => s.colour === 'U' || s.colour === 'D');
  return !(ud.face === 'U' || ud.face === 'D');
};

// ---- 1. Edge Piece Series: F R' F' R
{
  const alg = "F R' F' R";
  const state = applyAlg(solvedCube(), alg);
  const edgesMoved = edgesOf(state).filter((p) => !isHome(p)).map((p) => p.name).sort();
  check('EPS moves exactly three edges', edgesMoved.join() === ['FR', 'UF', 'UR'].join(), edgesMoved.join());
  const bottomEdges = ['DF', 'DR', 'DB', 'DL', 'BR', 'BL', 'UB', 'UL', 'FL'];
  const touched = edgesOf(state).filter((p) => bottomEdges.includes(p.name) && !isHome(p));
  check('EPS leaves the bottom layer and the other edges alone', touched.length === 0, touched.map((p) => p.name).join());
  log(`EPS ${alg}: edges moved ${edgesMoved.join(' ')}; corners moved ${movedNames(state).filter((n) => n.length === 3).join(' ')}`);
}

// ---- 2. Corner Piece Series, first turn to the right: U R U' L' U R' U' L
// Marshall: the first turn is of the top face; the sides alternate away and back; each side is turned
// away then back. Read from his words, "away" is R for the right face and L' for the left face.
{
  const alg = "U R U' L' U R' U' L";
  const state = applyAlg(solvedCube(), alg);
  const moved = movedNames(state);
  check('CPS (right) moves three corners on the top face', moved.join() === ['UBL', 'UBR', 'UFL'].join(), moved.join());
  check('CPS (right) moves no edges', edgesOf(state).every(isHome));
  check('CPS (right) comes back to solved when reversed', movedNames(applyAlg(state, invertAlg(alg))).length === 0);
  const twisted = cornersOf(state).filter((p) => !isHome(p));
  // Correction to the plan (2026-10-22): the plan said none of the three is twisted. In standard
  // orientation all three are twisted; they "roll over" into place when a setup brings them to the top.
  check('CPS (right): each moved corner ends twisted', twisted.length === 3 && twisted.every(cornerTwisted), twisted.map((p) => `${p.name} ${cornerTwisted(p)}`).join());
  log(`CPS right ${alg}: corners moved ${moved.join(' ')}; all twisted: ${twisted.every(cornerTwisted)}`);
}

// ---- 3. Corner Piece Series, first turn to the left (the mirror image)
// Marshall: the same rules with the first turn to the left. Read from his words: U' L' U R U' L U R'.
{
  const alg = "U' L' U R U' L U R'";
  const state = applyAlg(solvedCube(), alg);
  const moved = movedNames(state);
  check('CPS (left) moves the mirror triangle', moved.join() === ['UBL', 'UBR', 'UFR'].join(), moved.join());
  check('CPS (left) moves no edges', edgesOf(state).every(isHome));
  check('CPS (left) comes back to solved when reversed', movedNames(applyAlg(state, invertAlg(alg))).length === 0);
  log(`CPS left ${alg}: corners moved ${moved.join(' ')}`);
}

// ---- 4. Step One: the cross example. Marshall's notation: B' T' R F 2 L T 2 (T = top, B = back).
// His figure is not in the text, so the start is built from his words: the blue/green edge on top,
// blue/red at front/right, blue/yellow at bottom/front, blue/orange at back/bottom. Here blue is U.
{
  const alg = "B' U' R F2 L U2";
  const start = caseState(alg);
  const blueEdges = edgesOf(start).filter((p) => p.stickers.some((s) => s.colour === 'U'));
  // Slots of the four blue edges. Marshall: one on top, FR, DF and BD (= DB).
  const slots = blueEdges.map((p) => p.name).sort();
  const topSlots = slots.filter((s) => s.startsWith('U'));
  check('Step One start: four blue edges, one on top and FR, DF, DB', slots.length === 4 && topSlots.length === 1 && ['FR', 'DF', 'DB'].every((s) => slots.includes(s)), slots.join());
  // After the six moves: the four blue edges are on the top layer with blue up.
  const after = pieces(applyAlg(start, alg)).filter((p) => p.kind === 2 && p.stickers.some((s) => s.colour === 'U'));
  const cross = after.every((p) => p.name.startsWith('U') && p.stickers.find((s) => s.colour === 'U').face === 'U');
  check('Step One: after the six moves the blue cross is on the top face', after.length === 4 && cross, after.map((p) => p.name).join());
  log(`Step One ${alg}: blue edges start at ${slots.join(' ')} (from the words) and end on top`);
}

// ---- 6. Worked examples on the page (ours, built from the moves). Each start is the inverse of the
// example's moves on a solved cube, so the example solves it; these checks test the counts in the captions.
const homeOf = (state, kind) => pieces(state).filter((p) => p.kind === kind && isHome(p)).length;
const outOf = (state, kind) => pieces(state).filter((p) => p.kind === kind && !isHome(p)).map((p) => p.name).sort().join(' ');
const startOf = (alg) => applyAlg(solvedCube(), invertAlg(alg));
{
  // Step 2: one series places three edges; nine edges in place at the start.
  const X = "F R' F' R";
  const st = startOf(X);
  check('step 2 example: nine edges in place at the start', homeOf(st, 2) === 9, String(homeOf(st, 2)));
  check('step 2 example: the three outlined edges are UR UF FR', outOf(st, 2) === 'FR UF UR', outOf(st, 2));
  check('step 2 example: all twelve edges in place after the series', homeOf(applyAlg(st, X), 2) === 12);
}
{
  // Step 2: a top turn first; seven edges in place, nine after U, twelve after the series.
  const X = "U F R' F' R";
  const st = startOf(X);
  check('step 2 setup example: seven edges in place at the start', homeOf(st, 2) === 7, String(homeOf(st, 2)));
  check('step 2 setup example: nine after U', homeOf(applyAlg(st, 'U'), 2) === 9);
  check('step 2 setup example: twelve after the series', homeOf(applyAlg(st, X), 2) === 12);
  check('step 2 setup example: five outlined edges', outOf(st, 2) === 'FR UB UF UL UR', outOf(st, 2));
}
{
  // Step 3: the side turn from solved moves three edges (all in the top or middle layer).
  const st = applyAlg(solvedCube(), "R U2 R' U2");
  const moved = pieces(st).filter((p) => p.kind === 2 && !isHome(p)).map((p) => p.name).sort().join(' ');
  check('step 3 side turn moves edges FR UR UL only', moved === 'FR UL UR', moved);
  check('step 3 side turn leaves the bottom-layer edges alone', pieces(st).filter((p) => p.kind === 2 && p.name.startsWith('D') && !isHome(p)).length === 0);
}
{
  // Step 4: setup R, series, undo R. Five corners at the start, three out (UFR UBL UFL).
  const X = "R U R U' L' U R' U' L R'";
  const st = startOf(X);
  check('step 4 example: five corners in place at the start', homeOf(st, 3) === 5, String(homeOf(st, 3)));
  check('step 4 example: three out are UFR UBL UFL', outOf(st, 3) === 'UBL UFL UFR', outOf(st, 3));
  const afterR = applyAlg(st, 'R');
  check('step 4 example: two corners in place after the setup R', homeOf(afterR, 3) === 2, String(homeOf(afterR, 3)));
  check('step 4 example: four corners in place after the series', homeOf(applyAlg(afterR, "U R U' L' U R' U' L"), 3) === 4);
  check('step 4 example: all eight corners after the undo R\'', homeOf(applyAlg(st, X), 3) === 8);
}
{
  // Step 5: three corners out (UBR UBL UFL); one series places them.
  const X = "U R U' L' U R' U' L";
  const st = startOf(X);
  check('step 5 example: five corners in place at the start', homeOf(st, 3) === 5, String(homeOf(st, 3)));
  check('step 5 example: three out are UBL UBR UFL', outOf(st, 3) === 'UBL UBR UFL', outOf(st, 3));
  check('step 5 example: all eight corners after the series', homeOf(applyAlg(st, X), 3) === 8);
}

// ---- 7. The two extra algorithms (published, not Marshall's). Each must change only the orientation
// of the named pieces: every corner and edge stays in its own slot, and only the named pieces are turned.
const turnedNames = (state, kind) => {
  const by = new Map();
  for (const s of state) { const k = s.p.join(); (by.get(k) ?? by.set(k, []).get(k)).push(s); }
  const displaced = [], turned = [];
  for (const ss of by.values()) {
    if (ss.length !== kind) continue;
    const slot = pieceName(ss[0].p);
    if (!isInSlot(slot, ss)) { displaced.push(slot); continue; }
    if (!ss.every((s) => s.colour === faceOf(s.n))) turned.push(slot);
  }
  return { displaced, turned: turned.sort().join(' ') };
};
const isInSlot = (slot, ss) => [...slot].sort().join('') === ss.map((s) => s.colour).sort().join('');
{
  const X = "D R' D' R U R' D R D' R' D R U' R' D' R";
  const st = applyAlg(solvedCube(), X);
  const corners = turnedNames(st, 3);
  const edges = turnedNames(st, 2);
  check('extra corner twist: no corner moves out of its slot', corners.displaced.length === 0, corners.displaced.join());
  check('extra corner twist: no edge moves or turns', edges.displaced.length === 0 && edges.turned === '', edges.displaced.join() + ' ' + edges.turned);
  check('extra corner twist: turns exactly DFL and UBR', corners.turned === 'DFL UBR', corners.turned);
}
{
  const X = "R' E' R2 E2 R' U' R E2' R2' E R U";
  const st = applyAlg(solvedCube(), X);
  const corners = turnedNames(st, 3);
  const edges = turnedNames(st, 2);
  check('extra edge flip: no edge moves out of its slot', edges.displaced.length === 0, edges.displaced.join());
  check('extra edge flip: no corner moves or turns', corners.displaced.length === 0 && corners.turned === '', corners.displaced.join() + ' ' + corners.turned);
  check('extra edge flip: flips exactly UF and UR', edges.turned === 'UF UR', edges.turned);
}

if (failures.length) {
  console.error('FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}
log('ALL OK');
