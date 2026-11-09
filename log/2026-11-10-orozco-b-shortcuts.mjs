// Orozco (helper B) shortcuts (owner 2026-11-10): pairs that the three Orozco bases [R D R' , U'], [R D' R' , U'],
// [R D2 R' , U'] (and reverses) solve in ONE commutator when the setup may also move B: setups of D, L and B turns
// (the buffer never moves), at most 2 moves; shortest, then no B. Pairs with the letter B are left out (already one
// commutator in Orozco). A pair and its reverse share the setup (base halves swapped). Also checks a quick test:
// letters that one B turn brings into B's place play B, then the other letter's Orozco setup (from where it now is).
//   node log/2026-11-10-orozco-b-shortcuts.mjs           checks; prints ALL OK
//   node log/2026-11-10-orozco-b-shortcuts.mjs --write   also rewrites data/orozco-b-shortcuts.js
import { writeFileSync } from 'node:fs';
import { permOf, spotOf, letterAt, spots, expandBrackets, cancelMoves } from './three-style-lib.mjs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { randomScramble, scrambledState, cornerMemoFrom } from '../js/bld-memo.js';
import { orozcoCorners } from '../data/orozco-corners.js';
const fails = []; const check = (n, ok) => { if (!ok) fails.push(n); };
const key = (s) => `${s.p.join()}|${s.n.join()}`; const K = (l) => key(solvedCube()[spotOf(l)]);
const C = spotOf('C'); const inv = (p) => { const q = []; p.forEach((v, i) => (q[v] = i)); return q; };
const CORES = ["[R D R' , U']", "[U' , R D R']", "[R D' R' , U']", "[U' , R D' R']", "[R D2 R' , U']", "[U' , R D2 R']"];
const core = CORES.map((c) => ({ c, p: permOf(expandBrackets(c)) }));
const turns = [...'DLB'].flatMap((x) => [x, x + "'", x + '2']);
const setups = ['']; for (const a of turns) { setups.push(a); for (const b of turns) if (a[0] !== b[0]) setups.push(`${a} ${b}`); }
const best = {};
for (const s of setups) { const sp = permOf(s); if (sp[C] !== C) continue; const si = inv(sp); const r = [s ? s.split(' ').length : 0, /B/.test(s) ? 1 : 0];
  for (const { c, p } of core) { const E = sp.map((v) => si[p[v]]); const a = E[C], b = E[a]; if (a === C || E[b] !== C) continue;
    const pr = letterAt.get(a) + letterAt.get(b); if (/B/.test(pr)) continue;
    if (!best[pr] || r[0] < best[pr].r[0] || (r[0] === best[pr].r[0] && r[1] < best[pr].r[1])) best[pr] = { s, c, r }; } }
const swap = (c) => { const [x, y] = c.slice(1, -1).split(' , '); return `[${y} , ${x}]`; };
for (const pr of Object.keys(best).sort()) { const rev = pr[1] + pr[0]; if (pr < rev && best[rev]) { check(`${pr}/${rev} same length`, best[pr].r[0] === best[rev].r[0]); best[rev] = { ...best[pr], c: swap(best[pr].c) }; } }
const rows = [];
for (const [pair, b] of Object.entries(best).sort()) {
  const notation = b.s ? `[${b.s} : ${b.c}]` : b.c; const moves = cancelMoves(expandBrackets(notation));
  const st = applyAlg(solvedCube().map((x) => ({ ...x, home: key(x) })), moves); const w = new Map(st.map((x) => [x.home, key(x)]));
  check(pair, w.get(K('C')) === K(pair[0]) && w.get(K(pair[0])) === K(pair[1]) && w.get(K(pair[1])) === K('C') && st.filter((x) => x.home !== key(x)).length === 9);
  rows.push({ pair, first: pair[0], second: pair[1], notation, setup: b.s, core: b.c, setupMoves: b.r[0], moves, count: moves.split(' ').length, spots: spots(pair[0], pair[1], b.s, b.c) });
}
// quick test: which letters one B turn brings into B's place
const OZ = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r]));
const BT = {}; for (const t of ['B', "B'", 'B2']) { const l = letterAt.get(inv(permOf(t))[spotOf('B')]); BT[l] = t; }
const cyc = (a) => { const p = permOf(expandBrackets(a)); const x = p[C], y = p[x]; return p[y] === C && p.filter((v, i) => v !== i).length === 9 ? letterAt.get(x) + letterAt.get(y) : null; };
const corner = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' }; const cOf = (l) => Object.keys(corner).find((k) => corner[k].includes(l));
const quick = new Set(); let qn = 0; const qlens = {}; const qbad = [];
for (const [z, t] of Object.entries(BT)) for (const y of 'ADEFGHIKLOPRSTUVWX') { if (y === z || cOf(y) === cOf(z)) continue; qn++;
  const y2 = letterAt.get(permOf(t)[spotOf(y)]); const r = OZ[y2]; if (!r) { qbad.push(`${z}${y}: ${y} lands on ${y2}`); continue; }
  const st = [t, r.setup].filter(Boolean).join(' '); const baseF = `[R ${r.base} R' , U']`; const baseB = swap(baseF);
  if (cyc(`[${st} : ${baseF}]`) === y + z && cyc(`[${st} : ${baseB}]`) === z + y) { quick.add(y + z); quick.add(z + y); const k = st.split(' ').length; qlens[k] = (qlens[k] || 0) + 1; } else qbad.push(`${z}${y}: fails`); }
check('quick test: every exception is a letter landing on a B-corner sticker', qbad.every((x) => /lands on [NQB]/.test(x)));
console.log('quick test exceptions:', qbad.join(', '));
const set = new Set(rows.map((r) => r.pair)); let seed = 3; const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
let any = 0, tot = 0, qhit = 0; const N = 3000;
for (let i = 0; i < N; i++) { const tt = cornerMemoFrom(scrambledState(randomScramble(25, rnd)), 'C').map((x) => x.letter); let n = 0; for (let j = 0; j + 1 < tt.length; j += 2) { const p = tt[j] + tt[j + 1]; if (set.has(p)) n++; if (quick.has(p)) qhit++; } if (n) any++; tot += n; }
const h = {}; rows.forEach((r) => (h[r.setupMoves] = (h[r.setupMoves] || 0) + 1));
const stats = { pairs: rows.length, bySetup: h, withB: rows.filter((r) => /B/.test(r.setup)).length, solvesPct: Math.round((100 * any) / N), perSolve: +(tot / N).toFixed(2), quickTurns: BT, quickLetterPairs: quick.size / 2, quickExceptions: qbad.length, quickSetupLengths: qlens, quickPerSolve: +(qhit / N).toFixed(2) };
console.log(JSON.stringify(stats));
if (process.argv.includes('--write') && !fails.length) {
  writeFileSync(new URL('../data/orozco-b-shortcuts.js', import.meta.url), `// BEGIN GENERATED\n// GENERATED by log/2026-11-10-orozco-b-shortcuts.mjs --write. Do not edit by hand.\n// Orozco (helper B) shortcuts: pairs the three Orozco bases solve in one commutator with a D/L/B setup of at most 2 moves.\n// A pair and its reverse share the setup; the reverse has the base's halves swapped.\nexport const orozcoBShortcutStats = ${JSON.stringify(stats)};\nexport const orozcoBShortcuts = ${JSON.stringify(rows).replace(/\},\{/g, '},\n{')};\n// END GENERATED\n`);
  console.log('wrote data/orozco-b-shortcuts.js');
}
console.log(fails.length ? `FAIL\n${fails.slice(0, 10).join('\n')}` : 'ALL OK');
