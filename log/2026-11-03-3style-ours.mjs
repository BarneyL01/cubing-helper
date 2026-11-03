// Our 3-style corner table (buffer UFR, Speffz letters): for every pair of targets, the shortest
// [setup : [A , B]] where the core is an R move (R x R' or R' x R, x a U or D turn) against one U or D turn, and the
// setup is at most 3 moves of R, U, D, F. Ties: fewer setup moves, then the core group used most. Every entry is
// checked: it cycles C -> 1st -> 2nd -> C and moves nothing else.
//   node log/2026-11-03-3style-ours.mjs           checks; prints ALL OK
//   node log/2026-11-03-3style-ours.mjs --write   also rewrites data/three-style-ours.js
import { writeFileSync } from 'node:fs';
import { SPEFFZ, permOf, spotOf, letterAt, spots, expandBrackets, cancelMoves, invertAlg } from './three-style-lib.mjs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';

const SETUP_MOVES = 'RUDF'.split('').flatMap((f) => [f, f + "'", f + '2']);
const axis = (f) => ({ R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 })[f];
const opp = { R: 'L', L: 'R', U: 'D', D: 'U', F: 'B', B: 'F' };
const isCorner = (i) => solvedCube()[i].p.filter(Boolean).length === 3;
const cores = [];
for (const x of ['R', "R'", 'R2']) for (const y of ['U', "U'", 'U2', 'D', "D'", 'D2']) {
  const ins = `${x} ${y} ${invertAlg(x)}`;
  for (const z of ['U', "U'", 'U2', 'D', "D'", 'D2']) for (const [a, b] of [[ins, z], [z, ins]]) {
    const p = permOf(`${a} ${b} ${invertAlg(a)} ${invertAlg(b)}`);
    if (p.filter((v, i) => v !== i).length !== 9 || p.some((v, i) => v !== i && !isCorner(i))) continue;
    cores.push({ a, b, ins, inter: z, p, fam: `${ins} · ${z[0]}` });
  }
}
const setups = [''];
const gen = (acc, n) => { if (acc.length) setups.push(acc.join(' ')); if (!n) return; for (const m of SETUP_MOVES) { const l = acc[acc.length - 1]; if (l && (l[0] === m[0] || (opp[l[0]] === m[0] && l[0] > m[0]))) continue; gen([...acc, m], n - 1); } };
gen([], 3);
const SP = setups.map((s) => ({ s, p: permOf(s), len: s ? s.split(' ').length : 0 }));
const inv = (p) => { const q = new Array(54); p.forEach((v, i) => (q[v] = i)); return q; };
const C = spotOf('C');
const cands = {};
for (const core of cores) for (const S of SP) {
  const Si = inv(S.p); const E = S.p.map((v) => Si[core.p[v]]);
  const a = E[C], b = E[a]; if (a === C || E[b] !== C) continue;
  const pair = letterAt.get(a) + letterAt.get(b);
  const moves = cancelMoves(`${S.s} ${core.a} ${core.b} ${invertAlg(core.a)} ${invertAlg(core.b)} ${invertAlg(S.s)}`);
  (cands[pair] ||= []).push({ setup: S.s, setupLen: S.len, core, count: moves.split(' ').length, moves });
}
const pairs = Object.keys(cands).sort();
let famUse = {};
let pick = {};
for (let pass = 0; pass < 3; pass++) {
  const use = {}; pick = {};
  for (const p of pairs) {
    cands[p].sort((x, y) => x.count - y.count || x.setupLen - y.setupLen || (famUse[y.core.fam] || 0) - (famUse[x.core.fam] || 0) || x.setup.localeCompare(y.setup));
    pick[p] = cands[p][0]; use[pick[p].core.fam] = (use[pick[p].core.fam] || 0) + 1;
  }
  famUse = use;
}
const fails = [];
const check = (n, ok) => { if (!ok) fails.push(n); };
const pieceId = (l) => [...SPEFFZ[l]].sort().join('');
const targets = Object.keys(SPEFFZ).filter((l) => pieceId(l) !== pieceId('C'));
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const entries = [];
for (const first of targets) for (const second of targets) {
  if (pieceId(first) === pieceId(second)) continue;
  const pair = first + second;
  const c = pick[pair];
  check(`${pair} found`, !!c); if (!c) continue;
  const core = `[${c.core.a} , ${c.core.b}]`;
  const notation = c.setup ? `[${c.setup} : ${core}]` : core;
  const moves = cancelMoves(expandBrackets(notation));
  check(`${pair} moves`, moves === c.moves);
  const st = applyAlg(solvedCube().map((s) => ({ ...s, home: key(s) })), moves);
  const where = new Map(st.map((s) => [s.home, key(s)]));
  const K = (l) => { const s = solvedCube()[spotOf(l)]; return key(s); };
  check(`${pair} cycles C -> ${first} -> ${second}`, where.get(K('C')) === K(first) && where.get(K(first)) === K(second) && where.get(K(second)) === K('C'));
  check(`${pair} only three corners`, st.filter((s) => s.home !== key(s)).length === 9);
  const aLong = c.core.a.split(' ').length >= c.core.b.split(' ').length;
  entries.push({ pair, first, second, notation, setup: c.setup, core, insertion: c.core.ins, interchange: c.core.inter, spots: spots(first, second, c.setup, core), setupMoves: c.setupLen, moves, count: c.count, aLong });
}
check('378 pairs', entries.length === 378);
const fams = {}; entries.forEach((e) => { const k = `${e.insertion} · ${e.interchange.replace(/['2]/g, '')}`; fams[k] = (fams[k] || 0) + 1; });
const st = {}; entries.forEach((e) => (st[e.setupMoves] = (st[e.setupMoves] || 0) + 1));
console.log(`${entries.length} pairs; mean ${(entries.reduce((a, e) => a + e.count, 0) / entries.length).toFixed(2)} moves (max ${Math.max(...entries.map((e) => e.count))}); setups ${JSON.stringify(st)}; ${Object.keys(fams).length} core groups`);
if (process.argv.includes('--write') && !fails.length) {
  const clean = entries.map(({ aLong, ...e }) => e);
  writeFileSync(new URL('../data/three-style-ours.js', import.meta.url), `// BEGIN GENERATED\n// GENERATED by log/2026-11-03-3style-ours.mjs --write. Do not edit by hand.\n// Our 3-style corners: buffer UFR (C); R cores against a U or D turn; setups of R U D F, at most 3 moves.\nexport const threeStyleOurs = ${JSON.stringify(clean).replace(/\},\{/g, '},\n{')};\n// END GENERATED\n`);
  console.log('wrote data/three-style-ours.js');
}
console.log(fails.length ? `FAIL\n${fails.slice(0, 20).join('\n')}` : 'ALL OK');
