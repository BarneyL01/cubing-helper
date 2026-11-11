// Buffer moves (2026-11-11, owner request): the owner's 9 bases (Orozco B, helper P, helper D, each also with its halves
// swapped) with setups that may move the buffer. Setups of R U F D first; an L or B setup only when it makes the pair at
// least one move shorter (owner: "a single step less will still mean L and B is worth it"). Setups up to 3 moves.
// 1. Hard letters: every pair with I, V, Q or U that is shorter than the walk rule.
// 2. Other pairs that save 3+ moves or cut the setup by 2+ moves.
// 3. Hard-letter pairs where the walk rule is as short: keep the walk rule.
// Checks: every commutator (this table's and the walk rule's) is a pure corner 3-cycle buffer -> first -> second.
//   node log/2026-11-11-buffer-moves.mjs           checks; prints ALL OK
//   node log/2026-11-11-buffer-moves.mjs --write   also writes data/buffer-moves.js
import { writeFileSync } from 'node:fs';
import { permOf, spotOf, letterAt, expandBrackets, cancelMoves, spots } from './three-style-lib.mjs';
import { walkPairs } from '../data/walk-rule.js';

const fails = []; const check = (n, ok) => { if (!ok) fails.push(n); };
const C = spotOf('C');
const cycOf = (alg) => { const p = permOf(expandBrackets(alg)); if (p.filter((v, i) => v !== i).length !== 9 || p[C] === C) return null; const a = p[C], b = p[a]; return p[b] === C ? letterAt.get(a) + letterAt.get(b) : null; };
const swap = (alg) => { const m = alg.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
const BASES = { B: ["[R D R' , U']", "[R D' R' , U']", "[R D2 R' , U']"], P: ["[R U R' , D]", "[R U R' , D2]", "[R' D' R , U2]"], D: ["[R' D R , U']", "[R' D' R , U']", "[R' D2 R , U']"] };
const HELPER_OF = {}; for (const [h, bs] of Object.entries(BASES)) for (const b of bs) { HELPER_OF[b] = h; HELPER_OF[swap(b)] = h; }
const CORES = Object.keys(HELPER_OF);
for (const c of CORES) check(`${c} is a buffer 3-cycle`, !!cycOf(c));

// fast search on the 24 corner stickers
const ALL = [...'ABCDEFGHIJKLMNOPQRSTUVWX']; const sp = ALL.map(spotOf); const idx = new Map(sp.map((s, i) => [s, i]));
const P24 = (alg) => { const p = permOf(alg); return sp.map((s) => idx.get(p[s])); };
const Ci = ALL.indexOf('C'); const pw = ['', "'", '2'];
const MV = {}; for (const f of 'RUFDLB') for (const q of pw) MV[f + q] = P24(f + q);
const compose = (a, b) => a.map((x) => b[x]); const invP = (a) => { const r = []; a.forEach((x, i) => (r[x] = i)); return r; };
const SETUPS = [{ s: '', p: ALL.map((_, i) => i), n: 0 }];
{ let layer = SETUPS.slice(); for (let k = 1; k <= 3; k++) { const nx = []; for (const x of layer) for (const f of 'RUFDLB') if (!x.s || x.s.split(' ').at(-1)[0] !== f) for (const q of pw) { const e = { s: (x.s ? x.s + ' ' : '') + f + q, p: compose(x.p, MV[f + q]), n: k }; nx.push(e); SETUPS.push(e); } layer = nx; } }
const coreP = CORES.map((alg) => ({ alg, p: P24(expandBrackets(alg)) }));
const W = Object.fromEntries(walkPairs.map((p) => [p.pair, p]));
const best = { rufd: {}, any: {} };
const better = (a, b) => !b || a.count < b.count || (a.count === b.count && (a.n < b.n || (a.n === b.n && (a.bufferStays && !b.bufferStays))));
for (const s of SETUPS) { const si = invP(s.p); const lb = /[LB]/.test(s.s);
  for (const k of coreP) { const q = s.p.map((x) => si[k.p[x]]); if (q[Ci] === Ci) continue; const a = q[Ci], b = q[a]; if (q[b] !== Ci) continue;
    const pair = ALL[a] + ALL[b]; if (!W[pair]) continue;
    const notation = s.s ? `[${s.s} : ${k.alg}]` : k.alg; const moves = cancelMoves(expandBrackets(notation));
    const e = { notation, setup: s.s, core: k.alg, n: s.n, moves, count: moves.split(' ').length, bufferStays: s.p[Ci] === Ci };
    if (better(e, best.any[pair])) best.any[pair] = e;
    if (!lb && better(e, best.rufd[pair])) best.rufd[pair] = e; } }
const HARD = /[IVQU]/;
const rows = Object.keys(W).sort().map((pair) => {
  const r = best.rufd[pair], a = best.any[pair];
  const pick = !r || (a && a.count <= r.count - 1) ? a : r; // L or B only when at least one move shorter
  check(`${pair} found`, !!pick); if (!pick) return null;
  check(`${pair}: ${pick.notation}`, cycOf(pick.notation) === pair);
  check(`${pair}: walk ${W[pair].notation}`, cycOf(W[pair].notation) === pair);
  const m = pick.core.match(/^\[(.+) , (.+)\]$/); const [insertion, interchange] = /^[RLUDFB]['2]?$/.test(m[1]) ? [m[2], m[1]] : [m[1], m[2]];
  return { pair, first: pair[0], second: pair[1], notation: pick.notation, setup: pick.setup, core: pick.core, insertion, interchange, helper: HELPER_OF[pick.core],
    setupMoves: pick.n, moves: pick.moves, count: pick.count, spots: spots(pair[0], pair[1], pick.setup, pick.core), bufferMoves: !pick.bufferStays, lb: /[LB]/.test(pick.setup),
    rufdCount: r ? r.count : null, hard: HARD.test(pair), walk: { notation: W[pair].notation, setupMoves: W[pair].setupMoves, count: W[pair].count }, saves: W[pair].count - pick.count };
}).filter(Boolean);
const hard = rows.filter((r) => r.hard && r.saves > 0);
const keep = rows.filter((r) => r.hard && r.saves <= 0);
const other = rows.filter((r) => !r.hard && (r.saves >= 3 || r.walk.setupMoves - r.setupMoves >= 2) && r.saves > 0);
check('every hard pair placed once', hard.length + keep.length === 132);
const mean = (xs, f) => +(xs.reduce((a, x) => a + f(x), 0) / xs.length).toFixed(1);
const stats = {
  hard: hard.length, hardTotal: 132, keep: keep.length, other: other.length,
  hardMoves: [mean(hard, (r) => r.walk.count), mean(hard, (r) => r.count)],
  allHardMoves: [mean(rows.filter((r) => r.hard), (r) => r.walk.count), mean(rows.filter((r) => r.hard), (r) => Math.min(r.count, r.walk.count))],
  otherMoves: [mean(other, (r) => r.walk.count), mean(other, (r) => r.count)],
  hardSaves2: hard.filter((r) => r.saves >= 2).length,
  withLB: [...hard, ...other].filter((r) => r.lb).length,
  bufferStays: [...hard, ...other].filter((r) => !r.bufferMoves).length,
};
console.log(JSON.stringify(stats));
const byBase = (xs) => Object.entries(xs.reduce((h, r) => ((h[`[${r.insertion} , ${r.interchange}]`] = (h[`[${r.insertion} , ${r.interchange}]`] || 0) + 1), h), {})).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ');
console.log('hard, by base:', byBase(hard));
console.log('other:', other.map((r) => `${r.pair} ${r.notation} (${r.walk.count} -> ${r.count}${r.bufferMoves ? '' : ', buffer stays'}${r.lb ? ', L/B' : ''})`).join('; '));
console.log('with L or B:', [...hard, ...other].filter((r) => r.lb).map((r) => `${r.pair} ${r.notation} ${r.count} (R U F D: ${r.rufdCount ?? '-'})`).join('; '));
console.log('keep the walk rule:', keep.map((r) => r.pair).join(' '));
console.log('IU:', rows.find((r) => r.pair === 'IU').notation, JSON.stringify(rows.find((r) => r.pair === 'IU').spots));
if (process.argv.includes('--write') && !fails.length) {
  const out = (xs) => JSON.stringify(xs.map(({ hard: _h, ...r }) => r)).replace(/\},\{"pair"/g, '},\n{"pair"');
  writeFileSync(new URL('../data/buffer-moves.js', import.meta.url), `// BEGIN GENERATED\n// GENERATED by log/2026-11-11-buffer-moves.mjs --write. Do not edit by hand.\n// The owner's 9 bases with setups that may move the buffer (R U F D first; L or B only when 1+ move shorter).\nexport const bufferMoveStats = ${JSON.stringify(stats)};\nexport const bufferMoveHard = ${out(hard)};\nexport const bufferMoveOther = ${out(other)};\nexport const bufferMoveKeep = ${JSON.stringify(keep.map((r) => ({ pair: r.pair, walk: r.walk.notation, count: r.walk.count, ours: r.count })))};\n// END GENERATED\n`);
  console.log('wrote data/buffer-moves.js');
}
console.log(fails.length ? `FAIL (${fails.length})\n${fails.slice(0, 12).join('\n')}` : 'ALL OK');
