// Orozco with helper P (owner's request 2026-11-09): Orozco with P in B's place, so every target uses the step 2 bases.
// Buffer C (memo from C). 1st letter of a pair forwards (buffer -> X -> P), 2nd backwards (buffer -> P -> X).
// Setups: L and B turns only (they never move the buffer or P), at most 2 moves, the shortest (ties: no B, then L).
// Bases (insertion first / halves swapped), checked: [R U R' , D/D'/D2] = P -> L/T/H; [R' D' R , U2] = A -> P.
// (Owner 2026-11-09: four bases; D and R go into L with L / L2 instead of their own base [R' D' R , U'].) Helper letters: P skip; K, V twist / twist backwards (rule found below by trying);
// the twist is (R D' R' D)x2 F (D' R D R')x2 F' (twists the buffer and P only, found by search 2026-11-09).
// Odd number of letters (parity): the last letter is done the plain Orozco way (X forwards with helper B; B skip,
// N/Q Orozco twists), then the Ra-perm - the same parity as Orozco.
// Checks every commutator, then 3,000 whole solves (M2 edges + M2 parity, then these corners).
//   node log/2026-11-09-orozco-p.mjs           checks; prints ALL OK
//   node log/2026-11-09-orozco-p.mjs --write   also rewrites data/orozco-p.js
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
const C = spotOf('C'), P = spotOf('P');
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));

// position -> [forwards core (buffer -> pos -> P), backwards core (buffer -> P -> pos)]
const BASES = {
  L: ["[D , R U R']", "[R U R' , D]"],
  T: ["[D' , R U R']", "[R U R' , D']"],
  H: ["[D2 , R U R']", "[R U R' , D2]"],
  A: ["[R' D' R , U2]", "[U2 , R' D' R]"],
};
const cyc = (alg) => { const p = permOf(expandBrackets(alg)); return [letterAt.get(p[C]), letterAt.get(p[p[C]]), p.filter((v, i) => v !== i).length]; };
for (const [pos, [f, b]] of Object.entries(BASES)) {
  check(`${f} = buffer -> ${pos} -> P`, cyc(f).join() === [pos, 'P', 9].join());
  check(`${b} = buffer -> P -> ${pos}`, cyc(b).join() === ['P', pos, 9].join());
}

// setups of L and B, at most 2 moves, keeping the buffer and P
const turns = ['L', "L'", 'L2', 'B', "B'", 'B2'];
const setups = [''];
for (const a of turns) { setups.push(a); for (const b of turns) if (a[0] !== b[0]) setups.push(`${a} ${b}`); }
const rank = (s) => [s ? s.split(' ').length : 0, /B/.test(s) ? 1 : 0, s];
const letters = Object.keys(CORNER).flatMap((k) => [...CORNER[k]]).filter((l) => !['C', 'V'].includes(cornerOf(l))).sort();
const rows = [];
for (const x of letters) {
  let best = null;
  for (const s of setups) {
    const sp = permOf(s);
    if (sp[C] !== C || sp[P] !== P) continue;
    const to = letterAt.get(sp[spotOf(x)]);
    if (!BASES[to]) continue;
    const less = (x, y) => { for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i]; return false; };
    if (!best || less(rank(s), rank(best.s))) best = { s, to };
  }
  check(`${x} has a setup`, !!best); if (!best) continue;
  const [fc, bc] = BASES[best.to];
  const fwd = best.s ? `[${best.s} : ${fc}]` : fc, back = best.s ? `[${best.s} : ${bc}]` : bc;
  check(`${x} forwards = buffer -> ${x} -> P`, cyc(fwd).join() === [x, 'P', 9].join());
  check(`${x} backwards = buffer -> P -> ${x}`, cyc(back).join() === ['P', x, 9].join());
  rows.push({ letter: x, setup: best.s, pos: best.to, forwards: fwd, backwards: back, fMoves: cancelMoves(expandBrackets(fwd)), bMoves: cancelMoves(expandBrackets(back)),
    count: cancelMoves(expandBrackets(fwd)).split(' ').length, spots: spots(x, 'P', best.s, fc) });
}
check('18 letters', rows.length === 18);

// the twist for the buffer and P
const TWIST = "(R D' R' D)×2 F (D' R D R')×2 F'";
const TWIST_REV = "F (R D' R' D)×2 F' (D' R D R')×2";
{
  const st = applyAlg(tracked(), expandBrackets(TWIST));
  const moved = st.filter((s) => s.home !== key(s));
  const pieces = new Set(moved.map((s) => s.p.join()));
  check('twist moves only the buffer corner and P corner, in place', pieces.size === 2 && pieces.has('1,1,1') && pieces.has('1,-1,1') && moved.every((s) => s.home.split('|')[0] === s.p.join()));
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
    if (l === 'P') return '';
    if (l === 'K' || l === 'V') return expandBrackets(rule[l][first ? 'odd' : 'even'] === 'twist' ? TWIST : TWIST_REV);
    return expandBrackets(first ? ROW[l].forwards : ROW[l].backwards);
  });
  return { t, moves: steps.filter(Boolean).join(' '), parity: odd };
}
// find the K / V rule by trying both on positions where the letter comes up
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
  const rule = { K: { odd: ko, even: ke }, V: { odd: vo, even: ve } };
  seed = 5; let ok = 0;
  for (let i = 0; i < 400; i++) if (solves(randomScramble(25, rnd), rule)) ok++;
  if (ok === 400) RULE = rule;
}
check('found a K/V rule', !!RULE);
let solved = 0;
if (RULE) { seed = 99; for (let i = 0; i < 3000; i++) if (solves(randomScramble(25, rnd), RULE)) solved++; }
check('3000 whole solves', solved === 3000);
// the module the pages use must agree (run after --write)
try {
  const { orozcoPPlan } = await import('../js/orozco-p.js');
  let same = 0; seed = 7;
  for (let i = 0; i < 500; i++) {
    const bp = bldPlan(randomScramble(25, rnd));
    const o = orozcoPPlan(bp.state);
    const all = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : '', ...o.steps.map((x) => x.moves), o.parity ? o.parityAlg : ''].filter(Boolean).join(' ');
    if (applyAlg(bp.state, all).every((st) => st.home === key(st))) same++;
  }
  check('js/orozco-p.js plans solve', same === 500);
  console.log(`js/orozco-p.js: ${same}/500 solves`);
} catch (e) { console.log('js/orozco-p.js not checked:', e.message); }
console.log(`letters ${rows.length}; setups ${JSON.stringify(rows.reduce((h, r) => ((h[r.setup ? r.setup.split(' ').length : 0] = (h[r.setup ? r.setup.split(' ').length : 0] || 0) + 1), h), {}))}; mean ${(rows.reduce((a, r) => a + r.count, 0) / rows.length).toFixed(1)} moves; K/V rule ${JSON.stringify(RULE)}; whole solves ${solved}/3000`);
if (process.argv.includes('--write') && !fails.length) {
  writeFileSync(new URL('../data/orozco-p.js', import.meta.url),
    `// BEGIN GENERATED\n// GENERATED by log/2026-11-09-orozco-p.mjs --write. Do not edit by hand.\n// Orozco with helper P: buffer C, 1st letter forwards (buffer -> X -> P), 2nd backwards; setups of L and B.\nexport const orozcoP = ${JSON.stringify(rows).replace(/\},\{/g, '},\n{')};\nexport const OROZCO_P_TWIST = ${JSON.stringify(TWIST)};\nexport const OROZCO_P_TWIST_REV = ${JSON.stringify(TWIST_REV)};\nexport const OROZCO_P_HELPER_RULES = [{"letter":"P","odd":"skip","even":"skip"},{"letter":"K",${JSON.stringify(RULE.K).slice(1, -1)}},{"letter":"V",${JSON.stringify(RULE.V).slice(1, -1)}}];\n// END GENERATED\n`);
  console.log('wrote data/orozco-p.js');
}
console.log(fails.length ? `FAIL\n${fails.slice(0, 20).join('\n')}` : 'ALL OK');
