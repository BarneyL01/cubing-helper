// Shared by the two 3-style generators: sticker letters (Speffz) for all 24 corner stickers, and the
// "where does the setup move things" facts the pages explain. Checked against data/bld.js.
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { expandBrackets, cancelMoves, invertAlg } from '../js/algs.js';
import { bldCorners } from '../data/bld.js';

export const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
for (const r of bldCorners) if (SPEFFZ[r.letter] !== r.piece) throw new Error(`letter ${r.letter}: ${r.piece} vs ${SPEFFZ[r.letter]}`);

const SOLVED = solvedCube();
const key = (s) => `${s.p.join()}|${s.n.join()}`;
export const IDX = new Map(SOLVED.map((s, i) => [key(s), i]));
const TAG = SOLVED.map((s, i) => ({ ...s, colour: i }));
export const permOf = (alg) => { const o = new Array(54); for (const s of applyAlg(TAG, alg || 'U4')) o[s.colour] = IDX.get(key(s)); return o; }; // o[start] = end
const AX = { R: [0, 1], L: [0, -1], U: [1, 1], D: [1, -1], F: [2, 1], B: [2, -1] };
export const spotOf = (letter) => { const name = SPEFFZ[letter]; const p = [0, 0, 0]; for (const f of name) p[AX[f][0]] = AX[f][1]; const n = [0, 0, 0]; n[AX[name[0]][0]] = AX[name[0]][1]; return IDX.get(`${p.join()}|${n.join()}`); };
export const letterAt = new Map(Object.keys(SPEFFZ).map((l) => [spotOf(l), l]));

// For [setup : core]: where the setup puts the buffer sticker C and the two targets, and a check that the core
// alone cycles those three spots. Returns { buffer, first, second } as letters of spots after the setup.
export function spots(first, second, setup, core) {
  const S = permOf(setup);
  const out = { buffer: letterAt.get(S[spotOf('C')]), first: letterAt.get(S[spotOf(first)]), second: letterAt.get(S[spotOf(second)]) };
  const P = permOf(expandBrackets(core));
  const [b, a, c] = [out.buffer, out.first, out.second].map(spotOf);
  if (!(P[b] === a && P[a] === c && P[c] === b)) throw new Error(`core ${core} does not cycle ${out.buffer} -> ${out.first} -> ${out.second}`);
  return out;
}
export { expandBrackets, cancelMoves, invertAlg };
