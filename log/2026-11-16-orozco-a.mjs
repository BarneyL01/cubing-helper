// Orozco with the A group (2026-11-16, owner: "it doesn't show how to solve B, or D"): helper A. Same shape as
// log/2026-11-10-orozco-d.mjs. Buffer C (memo from C). 1st letter of a pair forwards (buffer -> X -> A), 2nd backwards.
// Bases [R' D R , U2] (G), [R' D' R , U2] (P), [R' D2 R , U2] (S) and their reverses. Only D turns never move the buffer
// or A, so the setups are any turns, at most 4 (3 except for U and V), whose net effect leaves the buffer and A where they are (R U F D
// preferred, then fewest L/B turns). A skip; E / R twist or twist backwards (rule found here by whole solves); odd number
// of letters: last letter plain Orozco (helper B), then the Ra-perm.
//   node log/2026-11-16-orozco-a.mjs           checks; prints ALL OK
//   node log/2026-11-16-orozco-a.mjs --write   also writes data/orozco-a.js
import { writeFileSync } from 'node:fs';
import { permOf, spotOf, letterAt, spots, expandBrackets, cancelMoves, invertAlg } from './three-style-lib.mjs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';
import { BLD_PARITY } from '../data/bld.js';
import { orozcoCorners, OROZCO_TWIST, OROZCO_TWIST_REV, OROZCO_HELPER_RULES } from '../data/orozco-corners.js';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js';

const fails = [];
const check = (n, ok) => { if (!ok) fails.push(n); };
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const tracked = () => solvedCube().map((s) => ({ ...s, home: key(s) }));
const C = spotOf('C'), P = spotOf('A'); // P = the helper's place (A)
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));

// position -> [forwards core (buffer -> pos -> P), backwards core (buffer -> P -> pos)]
const BASES = {
  G: ["[U2 , R' D R]", "[R' D R , U2]"],
  P: ["[U2 , R' D' R]", "[R' D' R , U2]"],
  S: ["[U2 , R' D2 R]", "[R' D2 R , U2]"],
};
const cyc = (alg) => { const p = permOf(expandBrackets(alg)); return [letterAt.get(p[C]), letterAt.get(p[p[C]]), p.filter((v, i) => v !== i).length]; };
for (const [pos, [f, b]] of Object.entries(BASES)) {
  check(`${f} = buffer -> ${pos} -> A`, cyc(f).join() === [pos, 'A', 9].join());
  check(`${b} = buffer -> A -> ${pos}`, cyc(b).join() === ['A', pos, 9].join());
}

// setups of any turns, at most 4 moves; kept only if the buffer and A end where they started (checked below)
const turns = [...'RUFDLB'].flatMap((f) => [f, f + "'", f + '2']);
const setups = [''];
for (const a of turns) { setups.push(a); for (const b of turns) if (a[0] !== b[0]) { setups.push(`${a} ${b}`); for (const c of turns) if (c[0] !== b[0]) { setups.push(`${a} ${b} ${c}`); for (const d of turns) if (d[0] !== c[0]) setups.push(`${a} ${b} ${c} ${d}`); } } }
// only setups that leave the buffer and A in place, each simulated once (4 moves only for U and V, which need them)
const KEEP = setups.map((s) => [s, permOf(s)]).filter(([, sp]) => sp[C] === C && sp[P] === P);
const rank = (s) => [s ? s.split(' ').length : 0, (s.match(/[LB]/g) || []).length, s];
const letters = Object.keys(CORNER).flatMap((k) => [...CORNER[k]]).filter((l) => !['C', 'A'].includes(cornerOf(l))).sort();
const rows = [];
for (const x of letters) {
  let best = null;
  for (const [s, sp] of KEEP) {
    const to = letterAt.get(sp[spotOf(x)]);
    if (!BASES[to]) continue;
    const less = (x, y) => { for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i]; return false; };
    if (!best || less(rank(s), rank(best.s))) best = { s, to };
  }
  check(`${x} has a setup`, !!best); if (!best) continue;
  const [fc, bc] = BASES[best.to];
  const fwd = best.s ? `[${best.s} : ${fc}]` : fc, back = best.s ? `[${best.s} : ${bc}]` : bc;
  check(`${x} forwards = buffer -> ${x} -> A`, cyc(fwd).join() === [x, 'A', 9].join());
  check(`${x} backwards = buffer -> A -> ${x}`, cyc(back).join() === ['A', x, 9].join());
  rows.push({ letter: x, setup: best.s, pos: best.to, forwards: fwd, backwards: back, fMoves: cancelMoves(expandBrackets(fwd)), bMoves: cancelMoves(expandBrackets(back)),
    count: cancelMoves(expandBrackets(fwd)).split(' ').length, spots: spots(x, 'A', best.s, fc) });
}
check('18 letters', rows.length === 18);
if (rows.length !== 18) { console.log('no setup within 3 moves:', letters.filter((l) => !rows.some((r) => r.letter === l)).join(' ')); }

// the twist for the buffer and A (helper D's twist with U2 for U' and U)
const TWIST = "(R' D' R D)×2 U2 (D' R' D R)×2 U2";
const TWIST_REV = "U2 (R' D' R D)×2 U2 (D' R' D R)×2";
{
  const st = applyAlg(tracked(), expandBrackets(TWIST));
  const moved = st.filter((s) => s.home !== key(s));
  const pieces = new Set(moved.map((s) => s.p.join()));
  check('twist moves only the buffer corner and A corner, in place', pieces.size === 2 && pieces.has('1,1,1') && pieces.has('-1,1,-1') && moved.every((s) => s.home.split('|')[0] === s.p.join()));
  check('twist backwards undoes it', applyAlg(applyAlg(tracked(), expandBrackets(TWIST)), expandBrackets(TWIST_REV)).every((s) => s.home === key(s)));
}

// a whole plan for the corners
const ROW = Object.fromEntries(rows.map((r) => [r.letter, r]));
const OZ = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r]));
const OZH = Object.fromEntries(OROZCO_HELPER_RULES.map((r) => [r.letter, r]));
const OZT = { twist: OROZCO_TWIST, 'twist-rev': OROZCO_TWIST_REV, skip: '' };
function plan(state, rule) {
  const t = cornerMemoFrom(state, 'C').map((x) => x.letter);
  const odd = t.length % 2 === 1;
  const steps = t.map((l, i) => {
    const first = i % 2 === 0;
    if (odd && i === t.length - 1) { // parity: plain Orozco for the last letter
      if (OZH[l]) return expandBrackets(OZT[OZH[l].odd]);
      return OZ[l].moves;
    }
    if (l === 'A') return '';
    if (l === 'E' || l === 'R') return expandBrackets(rule[l][first ? 'odd' : 'even'] === 'twist' ? TWIST : TWIST_REV);
    return expandBrackets(first ? ROW[l].forwards : ROW[l].backwards);
  });
  return { t, moves: steps.filter(Boolean).join(' '), parity: odd };
}
// find the E / R rule by trying both on positions where the letter comes up
let seed = 11;
const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const solves = (scr, rule) => {
  const bp = bldPlan(scr);
  const p = plan(bp.state, rule);
  const all = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : '', p.moves, p.parity ? OROZCO_PARITY_RUF : ''].filter(Boolean).join(' ');
  return applyAlg(bp.state, all).every((s) => s.home === key(s));
};
const options = ['twist', 'twist-rev'];
let RULE = null;
for (const ko of options) for (const ke of options) for (const vo of options) for (const ve of options) {
  if (RULE) break;
  const rule = { E: { odd: ko, even: ke }, R: { odd: vo, even: ve } };
  seed = 5; let ok = 0;
  for (let i = 0; i < 400; i++) if (solves(randomScramble(25, rnd), rule)) ok++;
  if (ok === 400) RULE = rule;
}
check('found an E/R rule', !!RULE);
let solved = 0;
if (RULE) { seed = 99; for (let i = 0; i < 3000; i++) if (solves(randomScramble(25, rnd), RULE)) solved++; }
check('3000 whole solves', solved === 3000);
// the module the pages use must agree (run after --write)
try {
  const { orozcoAPlan: orozcoPPlan } = await import('../js/orozco-a.js');
  let same = 0; seed = 7;
  for (let i = 0; i < 500; i++) {
    const bp = bldPlan(randomScramble(25, rnd));
    const o = orozcoPPlan(bp.state);
    const all = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : '', ...o.steps.map((x) => x.moves), o.parity ? o.parityAlg : ''].filter(Boolean).join(' ');
    if (applyAlg(bp.state, all).every((st) => st.home === key(st))) same++;
  }
  check('js/orozco-a.js plans solve', same === 500);
  console.log(`js/orozco-a.js: ${same}/500 solves`);
} catch (e) { console.log('js/orozco-a.js not checked (no planner module yet):', e.message.split('\n')[0]); }
console.log(`letters ${rows.length}; setups ${JSON.stringify(rows.reduce((h, r) => ((h[r.setup ? r.setup.split(' ').length : 0] = (h[r.setup ? r.setup.split(' ').length : 0] || 0) + 1), h), {}))}; mean ${(rows.reduce((a, r) => a + r.count, 0) / rows.length).toFixed(1)} moves; E/R rule ${JSON.stringify(RULE)}; whole solves ${solved}/3000`);
if (process.argv.includes('--write') && !fails.length) {
  writeFileSync(new URL('../data/orozco-a.js', import.meta.url),
    `// BEGIN GENERATED\n// GENERATED by log/2026-11-16-orozco-a.mjs --write. Do not edit by hand.\n// Orozco with the A group (helper A): buffer C, 1st letter forwards (buffer -> X -> A), 2nd backwards; setups leave buffer and A in place.\nexport const orozcoA = ${JSON.stringify(rows).replace(/\},\{/g, '},\n{')};\nexport const OROZCO_A_TWIST = ${JSON.stringify(TWIST)};\nexport const OROZCO_A_TWIST_REV = ${JSON.stringify(TWIST_REV)};\nexport const OROZCO_A_HELPER_RULES = [{"letter":"A","odd":"skip","even":"skip"},{"letter":"E",${JSON.stringify(RULE.E).slice(1, -1)}},{"letter":"R",${JSON.stringify(RULE.R).slice(1, -1)}}];\n// END GENERATED\n`);
  console.log('wrote data/orozco-a.js');
}
console.log(fails.length ? `FAIL\n${fails.slice(0, 20).join('\n')}` : 'ALL OK');
