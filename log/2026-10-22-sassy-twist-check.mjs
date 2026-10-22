// Checks the corner-pair twists built from Sassy (R U R' U') for the Twists & parity tab:
// (R U R' U')x2 D? (U R U' R')x2 D?' and the reverse order, for D, D2, D'. Each must leave every
// piece solved except two bottom corners, twisted in place.
//   node log/2026-10-22-sassy-twist-check.mjs
import { applyAlg, solvedCube, faceOf } from '../js/cube-sim.js';
import { invertAlg } from '../js/algs.js';
const x = (w, k) => Array(k).fill(w).join(' ');
const name = (p) => [p[1] === 1 ? 'U' : p[1] === -1 ? 'D' : '', p[2] === 1 ? 'F' : p[2] === -1 ? 'B' : '', p[0] === 1 ? 'R' : p[0] === -1 ? 'L' : ''].join('');
let ok = true;
for (const [label, a, b] of [['Sassy x2 first', "R U R' U'", "U R U' R'"], ['reverse Sassy x2 first', "U R U' R'", "R U R' U'"]]) {
  for (const d of ['D', 'D2', "D'"]) {
    const alg = `${x(a, 2)} ${d} ${x(b, 2)} ${invertAlg(d)}`;
    // the case this algorithm solves: its inverse applied to a solved cube
    const st = applyAlg(solvedCube(), invertAlg(alg));
    const byPos = new Map();
    for (const s of st) (byPos.get(s.p.join()) ?? byPos.set(s.p.join(), []).get(s.p.join())).push(s);
    const off = [...byPos.values()].filter((ss) => !ss.every((s) => faceOf(s.n) === s.colour));
    const desc = off.map((ss) => {
      const inPlace = ss.every((s) => ss.some((t) => faceOf(t.n) === s.colour)) && ss.length === 3;
      const dSticker = ss.find((s) => s.colour === 'D');
      return { pos: name(ss[0].p), inPlace, bottomOn: dSticker ? faceOf(dSticker.n) : '?' };
    });
    const good = desc.length === 2 && desc.every((d) => d.inPlace && d.pos[0] === 'D');
    if (!good) ok = false;
    console.log(`${label}, ${d}: ${alg}\n   solves: ${desc.map((d) => `${d.pos} with its bottom colour on the ${d.bottomOn} face`).join('; ')}${good ? '' : '  <-- NOT a two-corner twist'}`);
  }
}
console.log(ok ? 'ALL OK' : 'FAILED');
