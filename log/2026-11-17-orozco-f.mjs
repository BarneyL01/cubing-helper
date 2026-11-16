// Orozco with helper F (2026-11-17, owner; replaces the A group page): F is the other sticker of D's corner, so the setups
// are D and B turns like helper D's (they never move the buffer or F), at most 3. Bases [U' R' U , L^k]: buffer -> E / G /
// H -> F. After a z rotation they read [R' D' R , U^k] (checked: z X z' is the same as the original turn for every face),
// so the owner does: setup, z, base, z', undo the setup. F skip; D / I twist or twist backwards (helper D's twist, same
// corner; rule found here by whole solves); odd number of letters: last letter plain Orozco (helper B), then the Ra-perm.
// Also compares B + D + P / A / F (corner moves per solve; pair setups with the buffer still).
//   node log/2026-11-17-orozco-f.mjs           checks; prints ALL OK
//   node log/2026-11-17-orozco-f.mjs --write   also writes data/orozco-f.js
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
const C = spotOf('C'), P = spotOf('F'); // P = the helper's place (F)
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));

// position -> [forwards core (buffer -> pos -> P), backwards core (buffer -> P -> pos)]
const cyc = (alg) => { const p = permOf(expandBrackets(alg)); return [letterAt.get(p[C]), letterAt.get(p[p[C]]), p.filter((v, i) => v !== i).length]; };
const swapHalves = (a) => { const m = a.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
const GROUP = ["[U' R' U , L]", "[U' R' U , L']", "[U' R' U , L2]"];
const BASES = {};
for (const b of GROUP) { const [x, y] = cyc(b); const fwd = y === 'F' ? b : swapHalves(b); BASES[cyc(fwd)[0]] = [fwd, swapHalves(fwd)]; }
// the z view: every face turn written as the face it is after z (z X z' = the original turn)
const ZMAP = {};
for (const f of 'RUFDLB') for (const g of 'RUFDLB') if (permOf(`z ${g} z'`).join() === permOf(f).join()) ZMAP[f] = g;
check('z view maps all six faces', Object.keys(ZMAP).length === 6);
const zView = (a) => a.replace(/[RUFDLB]/g, (f) => ZMAP[f]);
for (const [f] of Object.values(BASES)) check(`z ${zView(f)} z' = ${f}`, permOf(`z ${expandBrackets(zView(f))} z'`).join() === permOf(expandBrackets(f)).join());
console.log('bases:', Object.entries(BASES).map(([p, [f]]) => `${p}: ${f} = z ${zView(f)} z'`).join(' | '));
for (const [pos, [f, b]] of Object.entries(BASES)) {
  check(`${f} = buffer -> ${pos} -> F`, cyc(f).join() === [pos, 'F', 9].join());
  check(`${b} = buffer -> F -> ${pos}`, cyc(b).join() === ['F', pos, 9].join());
}

// setups of D and B, at most 3 moves, keeping the buffer and F
const turns = ['D', "D'", 'D2', 'B', "B'", 'B2'];
const setups = [''];
for (const a of turns) { setups.push(a); for (const b of turns) if (a[0] !== b[0]) { setups.push(`${a} ${b}`); for (const c of turns) if (c[0] !== b[0]) setups.push(`${a} ${b} ${c}`); } }
const rank = (s) => [s ? s.split(' ').length : 0, (s.match(/B/g) || []).length, s];
const letters = Object.keys(CORNER).flatMap((k) => [...CORNER[k]]).filter((l) => !['C', 'D'].includes(cornerOf(l))).sort(); // F is on D's corner
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
  check(`${x} forwards = buffer -> ${x} -> F`, cyc(fwd).join() === [x, 'F', 9].join());
  check(`${x} backwards = buffer -> F -> ${x}`, cyc(back).join() === ['F', x, 9].join());
  rows.push({ letter: x, setup: best.s, pos: best.to, forwards: fwd, backwards: back, fMoves: cancelMoves(expandBrackets(fwd)), bMoves: cancelMoves(expandBrackets(back)),
    count: cancelMoves(expandBrackets(fwd)).split(' ').length, spots: spots(x, 'F', best.s, fc), zForwards: zView(fc), zBackwards: zView(bc) });
}
check('18 letters', rows.length === 18);

// the twist for the buffer and F's corner: helper D's twist (D and F are stickers of the same corner)
const TWIST = "(R' D' R D)×2 U' (D' R' D R)×2 U";
const TWIST_REV = "U' (R' D' R D)×2 U (D' R' D R)×2";
{
  const st = applyAlg(tracked(), expandBrackets(TWIST));
  const moved = st.filter((s) => s.home !== key(s));
  const pieces = new Set(moved.map((s) => s.p.join()));
  check('twist moves only the buffer corner and F corner, in place', pieces.size === 2 && pieces.has('1,1,1') && pieces.has('-1,1,1') && moved.every((s) => s.home.split('|')[0] === s.p.join()));
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
    if (l === 'F') return '';
    if (l === 'D' || l === 'I') return expandBrackets(rule[l][first ? 'odd' : 'even'] === 'twist' ? TWIST : TWIST_REV);
    return expandBrackets(first ? ROW[l].forwards : ROW[l].backwards);
  });
  return { t, moves: steps.filter(Boolean).join(' '), parity: odd };
}
// find the D / I rule by trying both on positions where the letter comes up
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
  const rule = { D: { odd: ko, even: ke }, I: { odd: vo, even: ve } };
  seed = 5; let ok = 0;
  for (let i = 0; i < 400; i++) if (solves(randomScramble(25, rnd), rule)) ok++;
  if (ok === 400) RULE = rule;
}
check('found a D/I rule', !!RULE);
let solved = 0;
if (RULE) { seed = 99; for (let i = 0; i < 3000; i++) if (solves(randomScramble(25, rnd), RULE)) solved++; }
check('3000 whole solves', solved === 3000);
// the module the pages use must agree (run after --write)
try {
  const { orozcoFPlan: orozcoPPlan } = await import('../js/orozco-f.js');
  let same = 0; seed = 7;
  for (let i = 0; i < 500; i++) {
    const bp = bldPlan(randomScramble(25, rnd));
    const o = orozcoPPlan(bp.state);
    const all = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : '', ...o.steps.map((x) => x.moves), o.parity ? o.parityAlg : ''].filter(Boolean).join(' ');
    if (applyAlg(bp.state, all).every((st) => st.home === key(st))) same++;
  }
  check('js/orozco-f.js plans solve', same === 500);
  console.log(`js/orozco-f.js: ${same}/500 solves`);
} catch (e) { console.log('js/orozco-f.js not checked (no planner module yet):', e.message.split('\n')[0]); }
console.log(`letters ${rows.length}; setups ${JSON.stringify(rows.reduce((h, r) => ((h[r.setup ? r.setup.split(' ').length : 0] = (h[r.setup ? r.setup.split(' ').length : 0] || 0) + 1), h), {}))}; mean ${(rows.reduce((a, r) => a + r.count, 0) / rows.length).toFixed(1)} moves; D/I rule ${JSON.stringify(RULE)}; whole solves ${solved}/3000`);
// ---- compare: B + D + P / A / F (and F + the Q group). Pairs: buffer still = D L B setups up to 3 (as the walk rule);
// buffer may move = setups up to 3, R U F D first, L or B when 1+ move shorter (as Pair lookup). Weighted by how often a
// pair comes up in 2,000 seeded solves (memo from C); per solve = 3.5 corner pairs on average.
const COMPARE = {};
{
  const ALL = [...'ABCDEFGHIJKLMNOPQRSTUVWX']; const sp24 = ALL.map(spotOf); const ix = new Map(sp24.map((v, i) => [v, i]));
  const P24 = (alg) => { const p = permOf(alg); return sp24.map((v) => ix.get(p[v])); };
  const Ci = ALL.indexOf('C'); const pw = ['', "'", '2'];
  const PAIRS = []; for (const a of ALL) for (const b of ALL) if (cornerOf(a) !== 'C' && cornerOf(b) !== 'C' && cornerOf(a) !== cornerOf(b)) PAIRS.push(a + b); const PS = new Set(PAIRS);
  const MV = {}; for (const f of 'RUFDLB') for (const q of pw) MV[f + q] = P24(f + q);
  const comp = (x, y) => x.map((v) => y[v]); const invP = (x) => { const r = []; x.forEach((v, i) => (r[v] = i)); return r; };
  const SET = [{ s: '', p: ALL.map((_, i) => i), n: 0 }];
  { let layer = SET.slice(); for (let k = 1; k <= 3; k++) { const nx = []; for (const x of layer) for (const f of 'RUFDLB') if (!x.s || x.s.split(' ').at(-1)[0] !== f) for (const q of pw) { const e = { s: (x.s ? x.s + ' ' : '') + f + q, p: comp(x.p, MV[f + q]), n: k }; nx.push(e); SET.push(e); } layer = nx; } }
  const g3 = (f) => pw.map((q) => f.replace('^k', q));
  const G = { B: g3("[R D^k R' , U']"), D: g3("[R' D^k R , U']"), P: ["[R U R' , D]", "[R U R' , D2]", "[R' D' R , U2]"], A: g3("[R' D^k R , U2]"), F: GROUP, Q: g3("[U F U' , B^k]") };
  const cache = {};
  const cover = (g) => cache[g] ||= (() => { const r = {}; for (const base of G[g]) for (const alg of [base, swapHalves(base)]) { const k = P24(expandBrackets(alg));
    for (const st of SET) { const si = invP(st.p); const q = st.p.map((v) => si[k[v]]); if (q[Ci] === Ci) continue; const a = q[Ci], c = q[a]; if (q[c] !== Ci) continue; const pr = ALL[a] + ALL[c]; if (!PS.has(pr)) continue;
      const n = cancelMoves(expandBrackets(st.s ? `[${st.s} : ${alg}]` : alg)).split(' ').length; const e = (r[pr] ||= { still: 99, stillN: 9, rufd: 99, any: 99 });
      if (!/[RUF]/.test(st.s) && (n < e.still || (n === e.still && st.n < e.stillN))) { e.still = n; e.stillN = st.n; }
      if (!/[LB]/.test(st.s)) e.rufd = Math.min(e.rufd, n); e.any = Math.min(e.any, n); } } return r; })();
  let sd = 11; const rn = () => ((sd = (Math.imul(sd, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
  const fq = Object.fromEntries(PAIRS.map((x) => [x, 0])); let tot = 0;
  for (let i = 0; i < 2000; i++) { const t = cornerMemoFrom(bldPlan(randomScramble(25, rn)).state, 'C').map((x) => x.letter); for (let j = 0; j + 1 < t.length; j += 2) if (fq[t[j] + t[j + 1]] !== undefined) { fq[t[j] + t[j + 1]]++; tot++; } }
  for (const set of ['BDP', 'BDA', 'BDF', 'BDFQ']) { const cs = [...set].map(cover); let ws = 0, wm = 0; const h = [0, 0, 0, 0, 0];
    for (const x of PAIRS) { let st = 99, n = 9, r = 99, a = 99; for (const c of cs) { const e = c[x]; if (!e) continue; if (e.still < st || (e.still === st && e.stillN < n)) { st = e.still; n = e.stillN; } r = Math.min(r, e.rufd); a = Math.min(a, e.any); }
      h[Math.min(n, 4)]++; ws += Math.min(st, 16) * fq[x]; wm += (a <= r - 1 ? a : r) * fq[x]; }
    COMPARE[set] = { still: +(ws / tot * 3.5).toFixed(1), moving: +(wm / tot * 3.5).toFixed(1), pairSetups: h }; }
  console.log('compare (corner moves per solve; pair setups 0/1/2/3/4+ with the buffer still):', JSON.stringify(COMPARE));
}
if (process.argv.includes('--write') && !fails.length) {
  writeFileSync(new URL('../data/orozco-f.js', import.meta.url),
    `// BEGIN GENERATED\n// GENERATED by log/2026-11-17-orozco-f.mjs --write. Do not edit by hand.\n// Orozco with helper F: buffer C, 1st letter forwards (buffer -> X -> F), 2nd backwards; setups of D and B; bases also in the z view.\nexport const orozcoF = ${JSON.stringify(rows).replace(/\},\{/g, '},\n{')};\nexport const OROZCO_F_BASES = ${JSON.stringify(Object.entries(BASES).map(([pos, [f, b]]) => ({ pos, forwards: f, backwards: b, zForwards: zView(f), zBackwards: zView(b) })))};\nexport const OROZCO_F_COMPARE = ${JSON.stringify(COMPARE)};\nexport const OROZCO_F_TWIST = ${JSON.stringify(TWIST)};\nexport const OROZCO_F_TWIST_REV = ${JSON.stringify(TWIST_REV)};\nexport const OROZCO_F_HELPER_RULES = [{"letter":"F","odd":"skip","even":"skip"},{"letter":"D",${JSON.stringify(RULE.D).slice(1, -1)}},{"letter":"I",${JSON.stringify(RULE.I).slice(1, -1)}}];\n// END GENERATED\n`);
  console.log('wrote data/orozco-f.js');
}
console.log(fails.length ? `FAIL\n${fails.slice(0, 20).join('\n')}` : 'ALL OK');
