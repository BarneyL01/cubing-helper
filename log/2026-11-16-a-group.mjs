// A group (2026-11-16, owner request): [R' D^k R , U2] — helper D's three bases with U2 instead of U'. Buffer -> A -> G /
// P / S (D, D', D2). Owner chose it over helper P's mixed set (two R U R' bases and one R' D' R); this page only adds the
// group, the other pages are not changed yet.
// For every pair: the best commutator with B (Orozco) + D + A bases, the same rule as Pair lookup (setups up to 3, R U F D
// first, L or B only when 1+ move shorter). The page lists the pairs whose best uses an A-group base.
// Also: B + D, B + D + P, B + D + A compared (buffer still = D L B setups only; buffer may move), weighted by how often a
// pair comes up in 2,000 seeded solves (memo from C).
// Checks: every commutator is a pure corner 3-cycle buffer -> first -> second; a pair and its reverse share the setup.
//   node log/2026-11-16-a-group.mjs           checks; prints ALL OK
//   node log/2026-11-16-a-group.mjs --write   also writes data/a-group.js
import { writeFileSync } from 'node:fs';
import { permOf, spotOf, letterAt, expandBrackets, cancelMoves, spots, SPEFFZ } from './three-style-lib.mjs';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';

const fails = []; const check = (n, ok) => { if (!ok) fails.push(n); };
const C = spotOf('C');
const cycOf = (alg) => { const p = permOf(expandBrackets(alg)); if (p.filter((v, i) => v !== i).length !== 9 || p[C] === C) return null; const a = p[C], b = p[a]; return p[b] === C ? letterAt.get(a) + letterAt.get(b) : null; };
const swap = (alg) => { const m = alg.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
const GROUPS = {
  B: ["[R D R' , U']", "[R D' R' , U']", "[R D2 R' , U']"],
  P: ["[R U R' , D]", "[R U R' , D2]", "[R' D' R , U2]"],
  D: ["[R' D R , U']", "[R' D' R , U']", "[R' D2 R , U']"],
  A: ["[R' D R , U2]", "[R' D' R , U2]", "[R' D2 R , U2]"],
};
for (const [g, bs] of Object.entries(GROUPS)) for (const b of bs) check(`${g} ${b} cycles the buffer`, !!cycOf(b) && cycOf(b).includes(g));

const ALL = [...'ABCDEFGHIJKLMNOPQRSTUVWX']; const sp = ALL.map(spotOf); const idx = new Map(sp.map((s, i) => [s, i]));
const P24 = (alg) => { const p = permOf(alg); return sp.map((s) => idx.get(p[s])); };
const Ci = ALL.indexOf('C'); const pw = ['', "'", '2'];
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));
const LET = ALL.filter((l) => cornerOf(l) !== 'C'); const PAIRS = []; for (const a of LET) for (const b of LET) if (cornerOf(a) !== cornerOf(b)) PAIRS.push(a + b);
const MV = {}; for (const f of 'RUFDLB') for (const q of pw) MV[f + q] = P24(f + q);
const compose = (a, b) => a.map((x) => b[x]); const invP = (a) => { const r = []; a.forEach((x, i) => (r[x] = i)); return r; };
const SETUPS = [{ s: '', p: ALL.map((_, i) => i), n: 0 }];
{ let layer = SETUPS.slice(); for (let k = 1; k <= 3; k++) { const nx = []; for (const x of layer) for (const f of 'RUFDLB') if (!x.s || x.s.split(' ').at(-1)[0] !== f) for (const q of pw) { const e = { s: (x.s ? x.s + ' ' : '') + f + q, p: compose(x.p, MV[f + q]), n: k }; nx.push(e); SETUPS.push(e); } layer = nx; } }
const better = (a, b) => !b || a.count < b.count || (a.count === b.count && a.n < b.n);
// best[pair] = { rufd, any, still } over the given groups
function search(groups) {
  const best = {};
  for (const g of groups) for (const base of GROUPS[g]) for (const alg of [base, swap(base)]) { const k = P24(expandBrackets(alg));
    for (const s of SETUPS) { const si = invP(s.p); const q = s.p.map((x) => si[k[x]]); if (q[Ci] === Ci) continue; const a = q[Ci], b = q[a]; if (q[b] !== Ci) continue;
      const pair = ALL[a] + ALL[b]; if (!PAIRS.includes(pair)) continue;
      const notation = s.s ? `[${s.s} : ${alg}]` : alg; const moves = cancelMoves(expandBrackets(notation));
      const e = { notation, setup: s.s, core: alg, group: g, n: s.n, moves, count: moves.split(' ').length, bufferStays: s.p[Ci] === Ci };
      const r = (best[pair] ||= {});
      if (better(e, r.any)) r.any = e;
      if (!/[LB]/.test(s.s) && better(e, r.rufd)) r.rufd = e;
      if (!/[RUF]/.test(s.s) && better(e, r.still)) r.still = e; } }
  for (const r of Object.values(best)) r.pick = !r.rufd || (r.any && r.any.count <= r.rufd.count - 1) ? r.any : r.rufd;
  // a pair and its reverse: the same setup, the base with its halves swapped (ties could pick different setups)
  for (const pair of PAIRS) if (pair[0] > pair[1]) { const o = best[pair[1] + pair[0]].pick; const core = swap(o.core); const notation = o.setup ? `[${o.setup} : ${core}]` : core;
    const moves = cancelMoves(expandBrackets(notation)); best[pair].pick = { ...o, core, notation, moves, count: moves.split(' ').length }; }
  return best;
}
let seed = 11; const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const freq = Object.fromEntries(PAIRS.map((p) => [p, 0])); let tot = 0; const SOLVES = 2000;
for (let i = 0; i < SOLVES; i++) { const t = cornerMemoFrom(bldPlan(randomScramble(25, rnd)).state, 'C').map((x) => x.letter); for (let j = 0; j + 1 < t.length; j += 2) if (freq[t[j] + t[j + 1]] !== undefined) { freq[t[j] + t[j + 1]]++; tot++; } }
const perSolve = tot / SOLVES;
const compare = {};
for (const set of ['BD', 'BDP', 'BDA']) { const b = search([...set]); let still = 0, stillN = 0, stillW = 0, move = 0;
  for (const p of PAIRS) { if (b[p]?.still) { still += b[p].still.count * freq[p]; stillW += freq[p]; stillN++; } move += b[p].pick.count * freq[p]; }
  compare[set] = { stillPairs: stillN, still: +(still / stillW).toFixed(2), moving: +(move / tot).toFixed(2), perSolve: +((move / tot) * perSolve).toFixed(1) }; }
console.log(JSON.stringify(compare));

const bda = search(['B', 'D', 'A']), bd = search(['B', 'D']);
const HELPER = { B: 'B', D: 'D', A: 'A' };
const rows = [];
for (const pair of PAIRS) { const e = bda[pair].pick; check(`${pair}: ${e.notation}`, cycOf(e.notation) === pair);
  if (e.group !== 'A') continue;
  const sp0 = spots(pair[0], pair[1], e.setup, e.core);
  const m = e.core.match(/^\[(.+) , (.+)\]$/); const [insertion, interchange] = /^[RLUDFB]['2]?$/.test(m[1]) ? [m[2], m[1]] : [m[1], m[2]];
  const P = permOf(expandBrackets(e.core)); const readFrom = (x) => { const a0 = spotOf(x); return [x, letterAt.get(P[a0]), letterAt.get(P[P[a0]])]; };
  const R = ['C', 'M', 'J'].map(readFrom); const here = [sp0.buffer, sp0.first, sp0.second]; let reading = null;
  for (const Rk of R) for (let r = 0; r < 3; r++) { const rot = [Rk[r], Rk[(r + 1) % 3], Rk[(r + 2) % 3]];
    if (rot.join() === here.join()) reading = rot.map((h, i) => ({ here: h, usual: R[0][(r + i) % 3], who: ['buffer', pair[0], pair[1]][i], face: SPEFFZ[h][0], usualFace: SPEFFZ[R[0][(r + i) % 3]][0] })); }
  check(`${pair}: lands on a reading of its base`, !!reading);
  const without = bd[pair].pick;
  rows.push({ pair, first: pair[0], second: pair[1], notation: e.notation, setup: e.setup, core: e.core, insertion, interchange, helper: HELPER[e.group],
    basePos: R[0].slice(1).find((x) => x !== 'A'), baseLabel: `A group's ${R[0].slice(1).find((x) => x !== 'A')} base`, setupMoves: e.n, moves: e.moves, count: e.count, spots: sp0,
    bufferMoves: !e.bufferStays, lb: /[LB]/.test(e.setup), reading, withoutA: { notation: without.notation, count: without.count }, saves: without.count - e.count, freq: freq[pair] });
}
const byPair = Object.fromEntries(rows.map((r) => [r.pair, r]));
for (const r of rows) { const rv = byPair[r.second + r.first]; check(`${r.pair}: reverse also uses the A group`, !!rv); if (rv) check(`${r.pair}: reverse shares the setup`, rv.setup === r.setup); }
const stats = { pairs: rows.length, noSetup: rows.filter((r) => !r.setup).length, bufferStill: rows.filter((r) => !r.bufferMoves).length,
  share: +(100 * rows.reduce((a, r) => a + r.freq, 0) / tot).toFixed(0), savesMean: +(rows.reduce((a, r) => a + r.saves, 0) / rows.length).toFixed(1), compare };
console.log(JSON.stringify({ ...stats, compare: undefined }));
console.log('by base:', GROUPS.A.map((b) => `${b} ${rows.filter((r) => r.insertion + ' , ' + r.interchange === b.slice(1, -1)).length}`).join(' | '));
console.log('no setup:', rows.filter((r) => !r.setup).map((r) => `${r.pair} ${r.notation}`).join('; '));
if (process.argv.includes('--write') && !fails.length) {
  const bases = GROUPS.A.map((b, i) => ({ base: b, cycle: cycOf(b), d: GROUPS.D[i], dCycle: cycOf(GROUPS.D[i]) }));
  writeFileSync(new URL('../data/a-group.js', import.meta.url), `// BEGIN GENERATED\n// GENERATED by log/2026-11-16-a-group.mjs --write. Do not edit by hand.\n// The A group [R' D^k R , U2]: its bases, and the pairs whose best commutator (with B, D and A bases) uses it.\nexport const aGroupStats = ${JSON.stringify(stats)};\nexport const aGroupBases = ${JSON.stringify(bases)};\nexport const aGroupPairs = ${JSON.stringify(rows.map(({ freq: _f, ...r }) => r)).replace(/\},\{"pair"/g, '},\n{"pair"')};\n// END GENERATED\n`);
  console.log('wrote data/a-group.js');
}
console.log(fails.length ? `FAIL (${fails.length})\n${fails.slice(0, 12).join('\n')}` : 'ALL OK');
