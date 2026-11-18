// Checks js/four-helper-drill.js (Blind drills, corners "Four helpers"): for random settings (1-5 pairs), every scramble's
// corner memo from C is exactly the pairs (+ an odd letter), every pair of two corners is of a ticked kind, parity and twists are as asked,
// the edge count is right, and the shown plan (M2 edges + parity, then the four-helper corners) solves it.
// Also: fourHelperPlan solves 2,000 plain random scrambles.
//   node log/2026-11-18-four-helper-drill-check.mjs   prints ALL OK
import { fourHelperScramble, fourPool, fourHelperSolves, twistedCorners, KINDS } from '../js/four-helper-drill.js';
import { unsolvedCounts } from '../js/bld-drill.js?v=4';
import { scrambledState, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';
import { pairRule } from '../data/pair-rule.js?v=2';
let seed = 11;
const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const RULE = Object.fromEntries(pairRule.map((r) => [r.pair, r]));
const fails = [];
const PIECE = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL', M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const SAME = (p) => [...PIECE[p[0]]].sort().join('') === [...PIECE[p[1]]].sort().join(''); // two stickers of one corner (a twist)
const ok = (name, cond) => { if (!cond) fails.push(name); };
// pools
ok('pool x = 8', fourPool(['x']).length === 8);
ok('pool 2 = 66', fourPool(['2']).length === 66);
ok('pool all = 378', fourPool(KINDS).length === 378);
let made = 0, thrown = 0; const seen = { parity: 0, twists: 0 };
for (let i = 0; i < 1500; i++) {
  const kinds = KINDS.filter(() => rnd() < 0.5); if (!kinds.length) kinds.push('x');
  const pairs = 1 + Math.floor(rnd() * 5);
  const edges = [0, 2, 3, 4, 6, 8][Math.floor(rnd() * 6)];
  const parity = ['any', 'always', 'never'][Math.floor(rnd() * 3)];
  const twists = ['any', 'always', 'never'][Math.floor(rnd() * 3)];
  let s;
  try { s = fourHelperScramble({ kinds, pairs, edges, parity, twists, rnd, budgetMs: 0 }); } catch (e) { thrown++; continue; }
  made++;
  const st = scrambledState(s.scramble);
  const memo = cornerMemoFrom(st, 'C').map((t) => t.letter).join('');
  const tag = `${s.scramble} [${kinds} ${pairs}p e${edges} ${parity} ${twists}]`;
  ok(`memo starts with pairs: ${tag}`, memo.startsWith(s.pairs.join('')) && s.pairs.length === pairs);
  ok(`kinds: ${tag}`, s.pairs.every((p) => !RULE[p] ? SAME(p) : kinds.includes(String(RULE[p].level)) || (kinds.includes('x') && RULE[p].exception)));
  ok(`memo is exactly the pairs (+ odd letter): ${tag}`, memo.length === 2 * pairs + (s.parity ? 1 : 0));
  ok(`parity: ${tag}`, (memo.length % 2 === 1) === s.parity && (parity === 'any' || s.parity === (parity === 'always')));
  ok(`twists: ${tag}`, (twistedCorners(st) > 0) === s.twists && (twists === 'any' || s.twists === (twists === 'always')));
  ok(`edges: ${tag}`, unsolvedCounts(st).edges === edges);
  ok(`solves: ${tag}`, fourHelperSolves(s.scramble));
  if (s.parity) seen.parity++; if (s.twists) seen.twists++;
}
seed = 5; let rs = 0;
for (let i = 0; i < 2000; i++) if (fourHelperSolves(randomScramble(25, rnd))) rs++;
ok('2000 random scrambles solved', rs === 2000);
console.log(`scrambles made ${made}, refused (impossible settings) ${thrown}, with parity ${seen.parity}, with twists ${seen.twists}; random solves ${rs}/2000`);
console.log(fails.length ? `FAIL ${fails.length}\n${fails.slice(0, 10).join('\n')}` : 'ALL OK');
