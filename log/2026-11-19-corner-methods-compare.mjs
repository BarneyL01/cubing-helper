// Corners per solve: Old Pochmann vs Orozco vs four helpers (picking rule) vs our 3-Style table, same 3,000 scrambles.
//   node log/2026-11-19-corner-methods-compare.mjs   prints the table and ALL OK
// Each plan is run on the simulated cube after the M2 edges (+ M2 parity when odd): the whole cube must be solved.
// Moves after cancelling, a slice or rotation counts as 1 (the four helpers' z / y' rotations are counted).
import { applyAlg } from '../js/cube-sim.js';
import { cancelMoves, expandBrackets } from '../js/algs.js';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';
import { BLD_PARITY, BLD_CORNER_SWAP } from '../data/bld.js';
import { orozcoCornerPlan } from '../js/orozco.js?v=2';
import { fourHelperPlan } from '../js/four-helper-drill.js';
import { threeStyleOurs } from '../data/three-style-ours.js';
import { orozcoCorners, OROZCO_TWIST, OROZCO_TWIST_REV, OROZCO_HELPER_RULES } from '../data/orozco-corners.js?v=1';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js?v=4';
import { pairRule } from '../data/pair-rule.js?v=2';

let seed = 4242;
const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const norm = (m) => cancelMoves(m.replace(/2'/g, '2').replace(/\s+/g, ' ').trim());
const len = (m) => (m ? m.split(' ').length : 0);
const TS = Object.fromEntries(threeStyleOurs.map((e) => [e.pair, e.moves]));
const OZ = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r]));
const OZH = Object.fromEntries(OROZCO_HELPER_RULES.map((r) => [r.letter, r]));
const OZT = { twist: OROZCO_TWIST, 'twist-rev': OROZCO_TWIST_REV };
const plain = (l, first) => { const h = OZH[l]; if (h) { const w = first ? h.odd : h.even; return w === 'skip' ? '' : expandBrackets(OZT[w]); } return first ? OZ[l].moves : OZ[l].moves.split(' ').reverse().map((m) => (m.endsWith("'") ? m.slice(0, -1) : m.endsWith('2') ? m : m + "'")).join(' '); };
// our 3-Style table: a pair from the table, else (same-corner pair) letter by letter plain Orozco; odd: plain Orozco + Ra
function threeStyle(state) {
  const t = cornerMemoFrom(state, 'C').map((x) => x.letter); const parts = [];
  for (let i = 0; i < t.length; i += 2) {
    if (i === t.length - 1) { parts.push(plain(t[i], true), OROZCO_PARITY_RUF); break; }
    parts.push(TS[t[i] + t[i + 1]] || [plain(t[i], true), plain(t[i + 1], false)].join(' '));
  }
  return { moves: parts.filter(Boolean).join(' '), odd: t.length % 2 === 1, letters: t.length };
}
const RULE = Object.fromEntries(pairRule.map((r) => [r.pair, r]));
const fourWithRot = (fp) => fp.steps.map((s) => (s.kind === 'pair' ? [s.rotation, s.moves, s.rotationBack].filter(Boolean).join(' ') : s.moves)).filter(Boolean).join(' ') + (fp.parity ? ` ${fp.parityAlg}` : '');

const methods = ['Old Pochmann', 'Orozco', 'Four helpers', 'Our 3-Style'];
const stat = Object.fromEntries(methods.map((m) => [m, []]));
const fails = [];
for (let i = 0; i < 3000; i++) {
  const scr = randomScramble(25, rnd);
  const bp = bldPlan(scr);
  const edges = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : ''].filter(Boolean).join(' ').replace(/2'/g, '2');
  const st = applyAlg(bp.state, edges);
  const oz = orozcoCornerPlan(bp.state);
  const fp = fourHelperPlan(bp.state);
  const ts = threeStyle(bp.state);
  const plans = {
    'Old Pochmann': { moves: bp.corners.map((c) => c.moves.replace('swap', BLD_CORNER_SWAP)).join(' '), letters: bp.corners.length, odd: bp.corners.length % 2 === 1 },
    Orozco: { moves: [...oz.steps.map((s) => s.moves), oz.parity ? oz.parityAlg : ''].filter(Boolean).join(' '), letters: oz.targets.length, odd: oz.parity },
    'Four helpers': { moves: fourWithRot(fp), check: fp.moves, letters: fp.targets.length, odd: fp.parity },
    'Our 3-Style': ts,
  };
  for (const m of methods) {
    const p = plans[m];
    const done = applyAlg(st, p.check || p.moves);
    if (!done.every((s) => s.home === key(s))) fails.push(`${m}: ${scr}`);
    stat[m].push({ moves: len(norm(p.moves)), letters: p.letters, odd: p.odd });
  }
}
const mean = (xs, f) => (xs.reduce((s, x) => s + f(x), 0) / xs.length).toFixed(1);
console.log('Corners per solve (3,000 random scrambles, after M2 edges):');
console.log('method        | letters | moves | moves (even solves) | vs Old Pochmann');
const op = Number(mean(stat['Old Pochmann'], (x) => x.moves));
for (const m of methods) { const v = Number(mean(stat[m], (x) => x.moves)); console.log(`${m.padEnd(13)} | ${mean(stat[m], (x) => x.letters).padStart(7)} | ${String(v).padStart(5)} | ${mean(stat[m].filter((x) => !x.odd), (x) => x.moves).padStart(19)} | ${(((v - op) / op) * 100).toFixed(0)}%`); }
console.log(fails.length ? `FAIL ${fails.length}\n${fails.slice(0, 5).join('\n')}` : 'ALL OK');
