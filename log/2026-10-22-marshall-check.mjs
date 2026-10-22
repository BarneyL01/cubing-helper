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

if (failures.length) {
  console.error('FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}
log('ALL OK');
