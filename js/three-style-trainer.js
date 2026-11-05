// 3-Style solves (3x3/practice/three-style-solves.html): small blind solves whose corners are exactly the chosen
// kind of 3-style pairs from the "By base" page (data/three-style-bases.js): chosen base groups and setup lengths.
// A scramble is made backwards: pick pairs that use different corners, and undo them. The scramble undoes the
// 3-Style page's (or Dylan's) commutators for those pairs, so it does not spell out the by-base solution. Every scramble is checked on the simulated cube: the by-base solution solves it, and the corner memo
// from C is exactly the chosen pairs. Checked under Node by log/2026-11-05-3style-trainer-check.mjs.
import { applyAlg, solvedCube } from './cube-sim.js';
import { invertAlg, cancelMoves } from './algs.js';
import { cornerMemoFrom } from './bld-memo.js';

const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const piece = (l) => [...SPEFFZ[l]].sort().join('');
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const tracked = () => solvedCube().map((s) => ({ ...s, home: key(s) }));
export const groupOf = (e) => [...e.base].sort().join('');

// The pairs that match the settings.
export function trainerPool(data, { groups, setups, both }) {
  return data.filter((e) => (e.kind === 'one' || (both && e.kind === 'both')) && groups.includes(groupOf(e)) && setups.includes(Math.min(4, e.setupMoves)));
}

// { scramble, state, pairs } with n pairs from the pool on different corners, or null.
// alts: other tables (the 3-Style page's, Dylan's) whose commutators the scramble undoes, so it differs from the solution.
export function trainerScramble(pool, n, alts, rnd = Math.random) {
  const byPair = {};
  for (const t of alts) for (const e of t) (byPair[e.pair] ||= []).push(e.moves);
  const undoOf = (e) => (byPair[e.pair] || []).find((m) => m !== e.moves) || e.moves;
  for (let tries = 0; tries < 200; tries++) {
    const used = new Set([piece('C')]);
    const pairs = [];
    const shuffled = [...pool].sort(() => rnd() - 0.5);
    for (const e of shuffled) {
      if (pairs.length === n) break;
      const a = piece(e.first), b = piece(e.second);
      if (used.has(a) || used.has(b)) continue;
      used.add(a); used.add(b);
      pairs.push(e);
    }
    if (pairs.length < n) return null;
    const undo = pairs.map(undoOf).join(' ');
    const scramble = cancelMoves(invertAlg(undo));
    const state = applyAlg(tracked(), scramble);
    // the memo from C must be exactly these pairs, and the by-base solution must solve it
    const memo = cornerMemoFrom(state, 'C').map((t) => t.letter).join('');
    if (memo !== pairs.map((e) => e.pair).join('')) continue;
    const done = applyAlg(state, pairs.map((e) => e.moves).join(' '));
    if (!done.every((s) => s.home === key(s))) continue;
    return { scramble, state, pairs };
  }
  return null;
}
