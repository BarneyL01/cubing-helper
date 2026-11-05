// Checks js/three-style-trainer.js: for random settings, every scramble is solved by its by-base solution, its corner
// memo from C is exactly the chosen pairs, the edges are untouched, and every pair matches the settings.
//   node log/2026-11-05-3style-trainer-check.mjs   prints ALL OK
import { trainerPool, trainerScramble, groupOf } from '../js/three-style-trainer.js';
import { threeStyleBases } from '../data/three-style-bases.js';
import { threeStyleOurs } from '../data/three-style-ours.js';
import { threeStyleCorners } from '../data/three-style-corners.js';
import { applyAlg } from '../js/cube-sim.js';
import { cornerMemoFrom } from '../js/bld-memo.js';
import { invertAlg, cancelMoves } from '../js/algs.js';
let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const groups = [...new Set(threeStyleBases.filter((e) => e.kind !== 'nq').map(groupOf))];
const fails = [];
let made = 0, none = 0, sameAsSolution = 0;
for (let i = 0; i < 3000; i++) {
  const gs = groups.filter(() => rnd() < 0.4); if (!gs.length) gs.push(groups[0]);
  const setups = [0, 1, 2, 3, 4].filter(() => rnd() < 0.6); if (!setups.length) setups.push(1);
  const both = rnd() < 0.5, n = 1 + Math.floor(rnd() * 3);
  const pool = trainerPool(threeStyleBases, { groups: gs, setups, both });
  const r = trainerScramble(pool, n, [threeStyleOurs, threeStyleCorners], rnd);
  if (!r) { none++; continue; }
  made++;
  const ok = r.pairs.length === n && r.pairs.every((e) => gs.includes(groupOf(e)) && setups.includes(Math.min(4, e.setupMoves)) && (e.kind === 'one' || both));
  const done = applyAlg(r.state, r.pairs.map((e) => e.moves).join(' '));
  const memo = cornerMemoFrom(r.state, 'C').map((t) => t.letter).join('');
  const edgesOk = r.state.filter((s) => s.p.filter(Boolean).length === 2).every((s) => s.home === key(s));
  if (!ok || !done.every((s) => s.home === key(s)) || memo !== r.pairs.map((e) => e.pair).join('') || !edgesOk) fails.push(`${r.scramble} | ${r.pairs.map((e) => e.pair)}`);
  if (r.scramble === cancelMoves(invertAlg(r.pairs.map((e) => e.moves).join(' ')))) sameAsSolution++;
}
console.log(`${made} scrambles checked, ${none} settings with too few pairs; scramble is the by-base solution undone in ${sameAsSolution}`);
console.log(fails.length ? `FAIL\n${fails.slice(0, 10).join('\n')}` : 'ALL OK');
