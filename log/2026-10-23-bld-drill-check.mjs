// Checks js/bld-drill.js: for every possible pair of counts (corners 0, 2-8; edges 0, 2-12),
// 20 seeded scrambles each must leave exactly those pieces unsolved (centres solved), and
// the M2 / Old Pochmann solution from js/bld-memo.js must solve each one, and so must M2 + Orozco corners.
// Also the Parity setting (always / never).
//   node log/2026-10-23-bld-drill-check.mjs        prints ALL OK and scramble lengths
import { drillScramble, drillScrambleLetters, letterCounts, possible, unsolvedCounts, MAX_CORNERS, MAX_EDGES } from '../js/bld-drill.js';
import { bldPlan, scrambledState } from '../js/bld-memo.js';
import { applyAlg, isSolved } from '../js/cube-sim.js';
import { orozcoCornerPlan } from '../js/orozco.js';
import { BLD_PARITY } from '../data/bld.js';

let seed = 20261023;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const fails = [];
const lengths = {};
let n = 0;
const t0 = Date.now();
for (let c = 0; c <= MAX_CORNERS; c++) {
  for (let e = 0; e <= MAX_EDGES; e++) {
    if (!possible(c, e)) continue;
    const lens = [];
    for (let i = 0; i < 20; i++) {
      let r;
      try { r = drillScramble({ corners: c, edges: e, rnd, budgetMs: 0 }); } catch (err) { fails.push(`${c}/${e}: ${err.message}`); continue; }
      n++;
      const got = unsolvedCounts(scrambledState(r.scramble));
      if (got.corners !== c || got.edges !== e || got.centres) fails.push(`${c}/${e}: got ${got.corners}/${got.edges} ${r.scramble}`);
      const plan = bldPlan(r.scramble);
      if (!isSolved(applyAlg(plan.state, plan.solution))) fails.push(`${c}/${e}: M2/OP does not solve ${r.scramble}`);
      // the same scramble with Orozco corners (the drill's other corner choice)
      const oz = orozcoCornerPlan(plan.state);
      const ozMoves = [...plan.edges.map((x) => x.moves), plan.parity ? BLD_PARITY[0] : '', ...oz.steps.map((x) => x.moves), oz.parity ? oz.parityAlg : ''].filter(Boolean).join(' ');
      if (!isSolved(applyAlg(plan.state, ozMoves))) fails.push(`${c}/${e}: M2/Orozco does not solve ${r.scramble}`);
      lens.push(r.scramble.split(' ').length);
    }
    lengths[`${c}/${e}`] = Math.round(lens.reduce((a, b) => a + b, 0) / lens.length);
  }
}
const show = (cs, es) => cs.map((c) => `${c}c: ` + es.map((e) => lengths[`${c}/${e}`] ?? '-').join(' ')).join('\n');
console.log(`mean scramble length (rows corners, columns edges 0 2 3 4 6 8 12):\n${show([0, 2, 3, 4, 6, 8], [0, 2, 3, 4, 6, 8, 12])}`);
console.log(`${n} scrambles in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
// With the page's real setting (shortest of ~0.15 s of tries): typical lengths, also checked.
{
  const rows = [];
  for (const [c, e] of [[2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [0, 4], [3, 3], [4, 4]]) {
    const lens = [];
    for (let i = 0; i < 8; i++) {
      const r = drillScramble({ corners: c, edges: e, rnd });
      const got = unsolvedCounts(scrambledState(r.scramble));
      if (got.corners !== c || got.edges !== e || got.centres) fails.push(`page setting ${c}/${e}: got ${got.corners}/${got.edges}`);
      lens.push(r.scramble.split(' ').length);
    }
    rows.push(`${c}/${e}: ${Math.round(lens.reduce((a, b) => a + b, 0) / lens.length)} (${Math.min(...lens)}-${Math.max(...lens)})`);
  }
  console.log(`page setting, mean (min-max) moves: ${rows.join(', ')}`);
}
// By letters: the memo has exactly the asked-for letters, for each corner method, and both solves still work.
{
  const rows = [];
  for (const [c, e] of [[2, 0], [4, 0], [6, 0], [0, 4], [2, 2], [4, 4], [3, 1], [8, 0]]) for (const method of ['op', 'orozco']) {
    for (let i = 0; i < 3; i++) {
      const r = drillScrambleLetters({ cornerLetters: c, edgeLetters: e, method, rnd, budgetMs: 50 });
      const got = letterCounts(r.scramble, method);
      if (got.corners !== c || got.edges !== e) fails.push(`letters ${c}/${e} ${method}: got ${got.corners}/${got.edges}`);
      const plan = bldPlan(r.scramble);
      if (!isSolved(applyAlg(plan.state, plan.solution))) fails.push(`letters ${c}/${e}: M2/OP does not solve ${r.scramble}`);
      const oz = orozcoCornerPlan(plan.state);
      const ozMoves = [...plan.edges.map((x) => x.moves), plan.parity ? BLD_PARITY[0] : '', ...oz.steps.map((x) => x.moves), oz.parity ? oz.parityAlg : ''].filter(Boolean).join(' ');
      if (!isSolved(applyAlg(plan.state, ozMoves))) fails.push(`letters ${c}/${e}: M2/Orozco does not solve ${r.scramble}`);
    }
    rows.push(`${c}/${e} ${method}`);
  }
  console.log(`by letters: ${rows.length} combinations x 3 checked`);
}
// Parity setting (2026-11-10): 'always' gives an odd number of edge (and corner) letters every time, 'never' never;
// both still solve with M2 + Old Pochmann, M2 + Orozco and M2 + Orozco with helper P.
{
  const { orozcoPPlan } = await import('../js/orozco-p.js');
  let k = 0;
  for (let c = 2; c <= MAX_CORNERS; c++) for (let e = 2; e <= MAX_EDGES; e++) for (const parity of ['always', 'never']) for (let i = 0; i < 4; i++) {
    let r;
    try { r = drillScramble({ corners: c, edges: e, parity, rnd, budgetMs: 0 }); } catch (err) { fails.push(`parity ${parity} ${c}/${e}: ${err.message}`); continue; }
    k++;
    const got = unsolvedCounts(scrambledState(r.scramble));
    if (got.corners !== c || got.edges !== e || got.centres) fails.push(`parity ${parity} ${c}/${e}: got ${got.corners}/${got.edges}`);
    const plan = bldPlan(r.scramble);
    if (plan.parity !== (parity === 'always')) fails.push(`parity ${parity} ${c}/${e}: edge letters ${plan.edges.length}`);
    if (!isSolved(applyAlg(plan.state, plan.solution))) fails.push(`parity ${parity} ${c}/${e}: M2/OP does not solve`);
    for (const [name, oz] of [['Orozco', orozcoCornerPlan(plan.state)], ['helper P', orozcoPPlan(plan.state)]]) {
      if (oz.parity !== (parity === 'always')) fails.push(`parity ${parity} ${c}/${e}: ${name} corner letters ${oz.targets.length}`);
      const m = [...plan.edges.map((x) => x.moves), plan.parity ? BLD_PARITY[0] : '', ...oz.steps.map((x) => x.moves), oz.parity ? oz.parityAlg : ''].filter(Boolean).join(' ');
      if (!isSolved(applyAlg(plan.state, m))) fails.push(`parity ${parity} ${c}/${e}: M2/${name} does not solve`);
    }
  }
  try { drillScramble({ corners: 3, edges: 0, parity: 'always' }); fails.push('parity always 3/0 should be refused'); } catch { /* expected */ }
  console.log(`parity always/never: ${k} scrambles checked`);
}
if (fails.length) { console.log(`${fails.length} FAILED\n${fails.slice(0, 10).join('\n')}`); process.exitCode = 1; } else console.log('ALL OK');
