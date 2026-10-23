// Checks the recognition practice page's cases: for every case and every top-layer turn, the position
// shown (hold, inverse of the algorithm, then the turn) is solved by the solution shown (undo the turn,
// then the algorithm).
//   node log/2026-10-23-recognition-check.mjs
import { applyAlg, solvedCube, isSolved, startHold } from '../js/cube-sim.js';
import { invertAlg } from '../js/algs.js';
import { ollCases } from '../data/oll.js';
import { pllCornerCases, pllEdgeCases } from '../data/pll.js';
import { rouxCmllCases as cornerOrientationCases } from '../data/roux.js';
const UNDO = { U: "U'", U2: 'U2', "U'": 'U' };
let n = 0, bad = 0;
for (const c of [...ollCases, ...pllCornerCases, ...pllEdgeCases, ...cornerOrientationCases]) {
  const alg = c.alg || c.altAlg;
  const hold = c.hold ?? startHold(alg);
  for (const turn of ['', 'U', 'U2', "U'"]) {
    const setup = [hold, invertAlg(alg), turn].filter(Boolean).join(' ');
    const solution = [turn ? UNDO[turn] : '', alg].filter(Boolean).join(' ');
    let st = applyAlg(applyAlg(solvedCube(), setup), solution);
    if (hold) st = applyAlg(st, invertAlg(hold));
    n++;
    if (!isSolved(st)) { bad++; console.log('FAIL', c.name, turn); }
  }
}
console.log(`${n} case/turn combinations; ${bad ? `${bad} FAILED` : 'ALL OK'}`);
