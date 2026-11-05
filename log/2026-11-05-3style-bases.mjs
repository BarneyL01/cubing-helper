// 3-Style by base (owner's request 2026-11-05): learn 3-style like Orozco. A "base" is a commutator that solves a
// pair with no setup (the core moves the buffer C). For every pair, the shortest [setup : base] where the setup is
// D and L turns only (never moves the buffer), in three lists:
//   one  - the setup moves only one target (the other is already in its base position), like Orozco
//   both - the buffer stays but the setup moves both targets
//   nq   - pairs with N or Q: D and L never reach the B position, so these keep the current table's commutator
//          (data/three-style-ours.js), whose setup moves the buffer.
// Pairs with B use the owner's Orozco commutators (already one-target), as on the 3-Style page.
// Every entry is checked: it cycles C -> 1st -> 2nd -> C and moves nothing else.
//   node log/2026-11-05-3style-bases.mjs           checks; prints ALL OK
//   node log/2026-11-05-3style-bases.mjs --write   also rewrites data/three-style-bases.js
import { writeFileSync } from 'node:fs';
import { SPEFFZ, permOf, spotOf, letterAt, spots, expandBrackets, cancelMoves, invertAlg } from './three-style-lib.mjs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { threeStyleOurs } from '../data/three-style-ours.js';

const fails = [];
const check = (n, ok) => { if (!ok) fails.push(n); };
const isCorner = (i) => solvedCube()[i].p.filter(Boolean).length === 3;
const C = spotOf('C');
const inv = (p) => { const q = []; p.forEach((v, i) => (q[v] = i)); return q; };

// the 30 bases: R x R' or R' x R (x a U or D turn) against one U or D turn, moving the buffer
const bases = [];
for (const x of ['R', "R'"]) for (const y of ['U', "U'", 'U2', 'D', "D'", 'D2']) {
  const ins = `${x} ${y} ${invertAlg(x)}`;
  for (const z of ['U', "U'", 'U2', 'D', "D'", 'D2']) for (const [a, b] of [[ins, z], [z, ins]]) {
    const p = permOf(`${a} ${b} ${invertAlg(a)} ${invertAlg(b)}`);
    if (p.filter((v, i) => v !== i).length !== 9 || p.some((v, i) => v !== i && !isCorner(i)) || p[C] === C) continue;
    const t1 = letterAt.get(p[C]), t2 = letterAt.get(p[p[C]]);
    bases.push({ core: `[${a} , ${b}]`, a, b, ins, inter: z, p, base: t1 + t2 });
  }
}
check('30 bases', bases.length === 30);
// One extra base the owner chose (2026-11-05), with no B: [L' U L , D2] and its reverse. Used only where it fixes a pair
// that otherwise needs a second setup for its letter, or a 4-move setup.
for (const [a, b] of [["L' U L", 'D2'], ['D2', "L' U L"]]) {
  const p = permOf(`${a} ${b} ${invertAlg(a)} ${invertAlg(b)}`);
  check(`extra base [${a} , ${b}] is a corner 3-cycle with the buffer`, p.filter((v, i) => v !== i).length === 9 && !p.some((v, i) => v !== i && !isCorner(i)) && p[C] !== C);
  bases.push({ core: `[${a} , ${b}]`, a, b, ins: "L' U L", inter: 'D2', p, base: letterAt.get(p[C]) + letterAt.get(p[p[C]]), extra: true });
}

const M = ['D', 'L'].flatMap((f) => [f, f + "'", f + '2']);
const setups = [''];
const gen = (acc, n) => { if (acc.length) setups.push(acc.join(' ')); if (!n) return; for (const m of M) { const l = acc.at(-1); if (l && l[0] === m[0]) continue; gen([...acc, m], n - 1); } };
gen([], 4);

const best = {};
const extraCands = [];
for (const S of setups) {
  const sp = permOf(S); if (sp[C] !== C) continue;
  const Si = inv(sp);
  const len = S ? S.split(' ').length : 0;
  for (const base of bases) {
    if (base.extra) { extraCands.push({ S, sp, base }); continue; }
    const E = sp.map((v) => Si[base.p[v]]);
    const a = E[C], b = E[a];
    if (a === C || E[b] !== C) continue;
    const pair = letterAt.get(a) + letterAt.get(b);
    const kind = sp[a] === a || sp[b] === b ? 'one' : 'both';
    const moves = cancelMoves(expandBrackets(S ? `[${S} : ${base.core}]` : base.core));
    const count = moves.split(' ').length;
    const c = { pair, kind, setup: S, len, base, moves, count };
    const o = best[pair];
    // one target before both, then shorter setup, then fewer moves
    const rank = (x) => [x.kind === 'one' ? 0 : 1, x.len, x.count];
    const less = (x, y) => { for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i]; return false; };
    if (!o || less(rank(c), rank(o))) best[pair] = c;
  }
}

// Letters into positions: the usual setup is the Orozco one where there is one, else the one most pairs use.
const movedOf = (sp, a, b, S) => (!S ? null : sp[a] === a ? `${letterAt.get(b)}>${letterAt.get(sp[b])}` : `${letterAt.get(a)}>${letterAt.get(sp[a])}`);
const usual = {};
{
  const u = {};
  for (const e of threeStyleOurs) if (e.orozco && e.setup) {
    const sp = permOf(e.setup); const f = sp[spotOf(e.first)] !== spotOf(e.first) ? e.first : e.second;
    usual[`${f}>${letterAt.get(sp[spotOf(f)])}`] = e.setup;
  }
  for (const c of Object.values(best)) if (c.kind === 'one' && c.setup && !/B/.test(c.pair)) {
    const sp = permOf(c.setup), a = spotOf(c.pair[0]), b = spotOf(c.pair[1]);
    const k = movedOf(sp, a, b, c.setup); (u[k] ||= {}); u[k][c.setup] = (u[k][c.setup] || 0) + 1;
  }
  for (const [k, x] of Object.entries(u)) if (!usual[k]) usual[k] = Object.keys(x).sort((p, q) => x[q] - x[p] || p.split(' ').length - q.split(' ').length)[0];
}
// the extra base, for pairs whose letter needs a second setup or whose setup is 4 moves
let extraUsed = 0;
for (const [pair, c] of Object.entries(best)) {
  if (c.kind !== 'one' || /B/.test(pair)) continue;
  const sp0 = permOf(c.setup);
  const odd = c.setup && usual[movedOf(sp0, spotOf(pair[0]), spotOf(pair[1]), c.setup)] !== c.setup;
  if (!odd && c.len < 4) continue;
  let pickX = null;
  for (const { S, sp, base } of extraCands) {
    const Si = inv(sp); const E = sp.map((v) => Si[base.p[v]]);
    const a = E[C], b = E[a];
    if (a === C || E[b] !== C || letterAt.get(a) + letterAt.get(b) !== pair) continue;
    if (S && sp[a] !== a && sp[b] !== b) continue;
    const len = S ? S.split(' ').length : 0;
    if (len > 3) continue;
    const k = movedOf(sp, a, b, S);
    if (S && usual[k] && usual[k] !== S) continue;
    if (!pickX || len < pickX.len) pickX = { S, len, base };
  }
  if (!pickX) continue;
  const moves = cancelMoves(expandBrackets(pickX.S ? `[${pickX.S} : ${pickX.base.core}]` : pickX.base.core));
  best[pair] = { pair, kind: 'one', setup: pickX.S, len: pickX.len, base: pickX.base, moves, count: moves.split(' ').length };
  extraUsed++;
}
console.log(`extra base [L' U L , D2]: used for ${extraUsed} pairs (${Object.values(best).filter((c) => c.base.extra).map((c) => c.pair).join(' ')})`);

const key = (s) => `${s.p.join()}|${s.n.join()}`;
const K = (l) => key(solvedCube()[spotOf(l)]);
const ours = Object.fromEntries(threeStyleOurs.map((e) => [e.pair, e]));
const baseOf = (core) => bases.find((b) => b.core === core);
const entries = [];
for (const e of threeStyleOurs) {
  const { pair, first, second } = e;
  let row;
  if (/[NQ]/.test(pair)) {
    check(`${pair} not reachable with D/L`, !best[pair]);
    row = { ...e, kind: 'nq' };
  } else if (e.orozco) {
    const b = baseOf(e.core);
    check(`${pair} Orozco core is a base`, !!b);
    check(`${pair} Orozco setup keeps C and one target`, permOf(e.setup)[C] === C);
    row = { ...e, kind: 'one', base: b && b.base };
  } else {
    const c = best[pair];
    check(`${pair} found`, !!c); if (!c) continue;
    const notation = c.setup ? `[${c.setup} : ${c.base.core}]` : c.base.core;
    row = { pair, first, second, notation, setup: c.setup, core: c.base.core, insertion: c.base.ins, interchange: c.base.inter,
      spots: spots(first, second, c.setup, c.base.core), setupMoves: c.len, moves: c.moves, count: c.count, kind: c.kind, base: c.base.base };
  }
  // independent check of the moves
  const st = applyAlg(solvedCube().map((s) => ({ ...s, home: key(s) })), row.moves);
  const where = new Map(st.map((s) => [s.home, key(s)]));
  check(`${pair} cycles C -> ${first} -> ${second}`, where.get(K('C')) === K(first) && where.get(K(first)) === K(second) && where.get(K(second)) === K('C'));
  check(`${pair} only three corners`, st.filter((s) => s.home !== key(s)).length === 9);
  check(`${pair} notation`, cancelMoves(expandBrackets(row.notation)) === row.moves);
  if (row.kind !== 'nq') {
    check(`${pair} buffer stays`, row.spots.buffer === 'C');
    check(`${pair} kind`, (row.kind === 'one') === (row.spots.first === first || row.spots.second === second));
    check(`${pair} setup D/L only`, !/[RUFB]/.test(row.setup));
  }
  entries.push(row);
}
check('378 pairs', entries.length === 378);
const n = (k) => entries.filter((e) => e.kind === k);
const mean = (l) => (l.reduce((s, e) => s + e.count, 0) / l.length).toFixed(1);
for (const k of ['one', 'both', 'nq']) console.log(`${k}: ${n(k).length} pairs, mean ${mean(n(k))} moves, max ${Math.max(...n(k).map((e) => e.count))}; current table on the same pairs ${mean(n(k).map((e) => ours[e.pair]))}`);
if (process.argv.includes('--write') && !fails.length) {
  const baseList = bases.map(({ core, ins, inter, base, extra }) => ({ core, insertion: ins, interchange: inter, base, ...(extra ? { extra: true } : {}) }));
  writeFileSync(new URL('../data/three-style-bases.js', import.meta.url),
    `// BEGIN GENERATED\n// GENERATED by log/2026-11-05-3style-bases.mjs --write. Do not edit by hand.\n// 3-style corners by base: setups of D and L only (the buffer never moves) for kinds 'one' and 'both';\n// kind 'nq' (N or Q targets) keeps the commutator of data/three-style-ours.js.\nexport const threeStyleBaseList = ${JSON.stringify(baseList).replace(/\},\{/g, '},\n{')};\nexport const threeStyleBases = ${JSON.stringify(entries).replace(/\},\{/g, '},\n{')};\n// END GENERATED\n`);
  console.log('wrote data/three-style-bases.js');
}
console.log(fails.length ? `FAIL\n${fails.slice(0, 20).join('\n')}` : 'ALL OK');
