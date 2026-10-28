// Checks the Cube theory pages (3x3/theory/) and js/cube-laws.js:
//  1. the three laws hold on 3,000 random scrambles (face turns);
//  2. the laws page's algorithms do what the page says (twist: two corners, opposite ways; flip: two edges;
//     Old Pochmann swap: two corners and two edges; each face quarter turn: odd corner and edge swaps);
//  3. the order from the cycles equals the order found by repeating the moves until solved;
//  4. the conjugate examples: K equals the Orozco table's K; F Sassy F' only changes the top layer; the
//     T-perm conjugate swaps different pieces of the same kind.
//   node log/2026-10-28-theory-check.mjs     prints ALL OK
import { laws, pieces, tracked, cycles, order, lcm } from '../js/cube-laws.js';
import { randomScramble } from '../js/bld-memo.js';
import { expandBrackets, cancelMoves, invertAlg } from '../js/algs.js';
import { BLD_CORNER_SWAP } from '../data/bld.js';
import { orozcoCorners } from '../data/orozco-corners.js';

const fails = [];
const check = (name, ok, detail = '') => { if (!ok) fails.push(detail ? `${name}: ${detail}` : name); };
let seed = 28; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

// 1
let n = 0;
for (let i = 0; i < 3000; i++) {
  const l = laws(tracked(randomScramble(25, rnd)));
  n++;
  check('law 1 (twists)', l.twistTotal % 3 === 0);
  check('law 2 (flips)', l.flips % 2 === 0);
  check('law 3 (swaps)', l.cornerParity === l.edgeParity);
}
// 2
const changed = (alg) => { const { corners, edges } = pieces(tracked(alg)); return { c: corners.filter((x) => x.slot !== x.piece || x.twist), e: edges.filter((x) => x.slot !== x.piece || x.flip), corners, edges }; };
const tw = changed(expandBrackets("(R' D' R D)×2 U (D' R' D R)×2 U'"));
check('twist algorithm: two corners twisted in place, opposite ways', tw.c.length === 2 && tw.e.length === 0 && tw.c.every((x) => x.slot === x.piece) && tw.c[0].twist + tw.c[1].twist === 3);
const half = changed(expandBrackets("(R' D' R D)×2 U (D' R' D R)×2"));
check('twist runner text: before the last U\' only top-layer pieces changed', [...half.c, ...half.e].every((x) => x.slot.split(',')[1] === '1'));
const fl = changed("M' U M' U M' U2 M U M U M U2");
check('flip algorithm: two edges flipped in place', fl.e.length === 2 && fl.c.length === 0 && fl.e.every((x) => x.slot === x.piece && x.flip));
const sw = changed(BLD_CORNER_SWAP);
check('Old Pochmann swap: two corners and two edges swapped', sw.c.length === 2 && sw.e.length === 2 && laws(tracked(BLD_CORNER_SWAP)).cornerParity === 1);
for (const m of ['U', 'D', 'R', 'L', 'F', 'B']) { const l = laws(tracked(m)); check(`${m}: odd corner and edge swaps`, l.cornerParity === 1 && l.edgeParity === 1); }
// 3
const ALGS = ['U', "R U R' U'", "R U R' U R U2 R'", "F R U R' U' F'", 'R U', 'R U2', 'R2 U2', "R U R' U' R' F R2 U' R' U' R U R' F'", "R D R' U' R D' R' U", expandBrackets("(R' D' R D)×2 U (D' R' D R)×2 U'"), "R U2 R' U'", "R' F R F'"];
for (const a of ALGS) {
  const c = cycles(a);
  const fromCycles = [...c.corners, ...c.edges].map((x) => x.returnsAfter).reduce(lcm, 1);
  check(`order of ${a}`, fromCycles === order(a), `${fromCycles} vs ${order(a)}`);
}
for (let i = 0; i < 200; i++) { const a = randomScramble(6, rnd); const c = cycles(a); const f = [...c.corners, ...c.edges].map((x) => x.returnsAfter).reduce(lcm, 1); check('order of random 6-move sequences', f === order(a), a); }
check('Sassy has order 6', order("R U R' U'") === 6);
// 4
const K = orozcoCorners.find((r) => r.letter === 'K');
check('conjugate example K equals the Orozco table', cancelMoves(`D R D R' U' R D' R' U D'`) === K.moves);
const fs = changed("F R U R' U' F'");
check("F Sassy F' only changes the top layer", [...fs.c, ...fs.e].every((x) => x.slot.split(',')[1] === '1'));
const sa = changed("R U R' U'");
check('Sassy alone disturbs FR and DFR', sa.e.some((x) => x.slot === '1,0,1' || x.piece === '1,0,1') && sa.c.some((x) => x.slot === '1,-1,1' || x.piece === '1,-1,1'));
const T = "R U R' U' R' F R2 U' R' U' R U R' F'";
const t1 = changed(T), t2 = changed(cancelMoves(`U ${T} ${invertAlg('U')}`));
check('T-perm conjugate swaps two corners and two edges, different ones', t2.c.length === 2 && t2.e.length === 2 && t1.c.map((x) => x.slot).sort().join() !== t2.c.map((x) => x.slot).sort().join());

console.log(`laws checked on ${n} scrambles; ${ALGS.length} + 200 orders compared`);
console.log(fails.length ? `${fails.length} FAILED\n${[...new Set(fails)].slice(0, 10).join('\n')}` : 'ALL OK');
process.exitCode = fails.length ? 1 : 0;
