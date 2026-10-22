// LSE edge-orientation map: how the bad-edge pattern changes under simple M/U moves, and how many
// repeats of U' M' it takes to reach an arrow. Orientation is judged against the centres, as on the
// Roux page: an edge is bad when its yellow/white sticker is on a face whose centre is not yellow/white.
//   node log/2026-10-22-lse-eo-map.mjs
import { applyAlg, solvedCube, faceOf } from '../js/cube-sim.js';
import { eoCases } from '../data/roux.js';

const POS = { UF: [0, 1, 1], UB: [0, 1, -1], UL: [-1, 1, 0], UR: [1, 1, 0], DF: [0, -1, 1], DB: [0, -1, -1] };
const ORDER = ['UF', 'UB', 'UL', 'UR', 'DF', 'DB'];
const centreAt = (st, face) => st.find((s) => s.p.filter((v) => v !== 0).length === 1 && faceOf(s.n) === face).colour;
// pattern of a state: x = bad, . = good, in ORDER; plus whether the centres are lined up
function patternOf(st) {
  const ud = new Set(['U', 'D']);
  const faceIsUD = (f) => ud.has(centreAt(st, f));
  const pat = ORDER.map((k) => {
    const ss = st.filter((s) => s.p.join() === POS[k].join());
    const y = ss.find((s) => ud.has(s.colour));
    return faceIsUD(faceOf(y.n)) ? '.' : 'x';
  }).join('');
  return { pat, aligned: centreAt(st, 'U') === 'U' || centreAt(st, 'U') === 'D' };
}
// build a state with a given pattern by searching M/U sequences from solved (BFS), keyed by pattern + alignment
const MOVES = ['U', "U'", 'U2', 'M', "M'", 'M2'];
const seen = new Map();
let frontier = [''];
seen.set(JSON.stringify(patternOf(solvedCube())), '');
for (let d = 0; d < 9 && frontier.length; d++) {
  const next = [];
  for (const a of frontier) for (const m of MOVES) {
    const alg = `${a} ${m}`.trim();
    const k = JSON.stringify(patternOf(applyAlg(solvedCube(), alg)));
    if (!seen.has(k)) { seen.set(k, alg); next.push(alg); }
  }
  frontier = next;
}
console.log(`reachable (pattern, centres) states: ${seen.size}`);
// family name of a pattern (aligned or not, judged against the centres): match the eoCases cards up to U turns
const rotU = (p) => { const [uf, ub, ul, ur, df, db] = p; return [ur, ul, uf, ub, df, db].join(''); }; // U turn: UF->UL ... (positions rotate)
const famOf = (p) => {
  const variants = [p];
  for (let i = 0; i < 3; i++) variants.push(rotU(variants.at(-1)));
  const card = eoCases.find((c) => variants.includes(c.pattern));
  return card ? card.name.split(' — ')[0] : (p === '......' ? 'Oriented' : `? ${p}`);
};
const isArrow = (p) => famOf(p).includes('Arrow');
const STEP = "U' M'";
console.log(`\nRepeating ${STEP} from each state (pattern judged against the centres):`);
const rows = [];
for (const [k, alg] of seen) {
  const { pat, aligned } = JSON.parse(k);
  let a = alg; let n = 0; const path = [famOf(pat)];
  let p = pat;
  while (!isArrow(p) && p !== '......' && n < 12) {
    a = `${a} ${STEP}`; n++;
    p = patternOf(applyAlg(solvedCube(), a)).pat;
    path.push(famOf(p));
  }
  rows.push({ pat, aligned, fam: famOf(pat), n: isArrow(p) || p === '......' ? n : null, path });
}
const byFam = {};
for (const r of rows) (byFam[`${r.fam} | centres ${r.aligned ? 'lined up' : 'off'}`] ??= []).push(r);
for (const [f, rs] of Object.entries(byFam).sort()) {
  const ns = rs.map((r) => (r.n === null ? 'never' : r.n));
  console.log(`- ${f}: ${rs.length} patterns; repeats to arrow/oriented: ${ns.join(' ')}; e.g. path ${rs[0].path.join(' → ')}`);
}
