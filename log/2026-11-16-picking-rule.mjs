// Picking rule for the four Orozco groups (helpers B, D, F, K): analysis for docs/four-helper-picking-rule.md.
// Nothing on the site uses this. It (1) finds the shortest D/L/B setup (buffer still, up to 4) that lands each of the
// 378 pairs on a base of each group, (2) applies the three-level rule (helper letter / one-turn letter / two-turn
// letter) with the helpers' own letter tables, checks every result is a pure 3-cycle buffer -> 1st -> 2nd, and prints
// the numbers quoted in the doc.   node log/2026-11-16-picking-rule.mjs
import { permOf, spotOf, letterAt, expandBrackets } from './three-style-lib.mjs';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));
const LET = [...'ABDEFGHIKLNOPQRSTUVWX'];
const PAIRS = []; for (const a of LET) for (const b of LET) if (cornerOf(a) !== cornerOf(b)) PAIRS.push(a + b);
const pw = ['', "'", '2'];
const C = spotOf('C');
const swap = (alg) => { const m = alg.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
const G = { B: ["[R D R' , U']", "[R D' R' , U']", "[R D2 R' , U']"], D: ["[R' D R , U']", "[R' D' R , U']", "[R' D2 R , U']"],
  F: ["[U' R' U , L]", "[U' R' U , L']", "[U' R' U , L2]"], K: ["[F D F' , U]", "[F D F' , U']", "[F D F' , U2]"],
  P: ["[R U R' , D]", "[R U R' , D2]", "[R' D' R , U2]"] };
const basePerms = {}; // group -> list of {alg, P}
for (const [g, bs] of Object.entries(G)) basePerms[g] = bs.flatMap((b) => [b, swap(b)]).map((alg) => ({ alg, P: permOf(expandBrackets(alg)) }));
const SP = Object.fromEntries(LET.concat(['C','J','M']).map((l) => [l, spotOf(l)]));
function setups(faces, n) { const turns = faces.flatMap((f) => pw.map((q) => f + q)); const tp = Object.fromEntries(turns.map((t) => [t, permOf(t)]));
  const id = [...Array(54).keys()]; const out = [{ s: [], p: id }]; let layer = out.slice();
  const ax = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };
  for (let k = 1; k <= n; k++) { const nx = []; for (const x of layer) for (const t of turns) { const last = x.s.at(-1), prev = x.s.at(-2); if (last && last[0] === t[0]) continue; if (last && prev && ax[last[0]] === ax[t[0]] && prev[0] === t[0]) continue;
    const p = x.p.map((v) => tp[t][v]); const e = { s: [...x.s, t], p }; nx.push(e); out.push(e); } layer = nx; } return out; }
// freq
let seed = 11; const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const freq = Object.fromEntries(PAIRS.map((p) => [p, 0])); let nsolves = 3000;
for (let i = 0; i < nsolves; i++) { const t = cornerMemoFrom(bldPlan(randomScramble(25, rnd)).state, 'C').map((x) => x.letter); for (let j = 0; j + 1 < t.length; j += 2) if (t[j] + t[j + 1] in freq) freq[t[j] + t[j + 1]]++; }
const tot = Object.values(freq).reduce((a, b) => a + b, 0);
function table(S, strictC) { // per pair per group best
  const t = {}; for (const p of PAIRS) t[p] = {};
  for (const { s, p: sp } of S) { const c = sp[C]; if (strictC && c !== C) continue;
    for (const pr of PAIRS) { const x = sp[SP[pr[0]]], y = sp[SP[pr[1]]];
      for (const g of Object.keys(G)) { if (t[pr][g] && t[pr][g].n <= s.length) continue; for (const b of basePerms[g]) if (b.P[c] === x && b.P[x] === y) { t[pr][g] = { n: s.length, s: s.join(' '), base: b.alg, lands: letterAt.get(c)+letterAt.get(x) + letterAt.get(y) }; break; } } } }
  return t; }
const still = table(setups([...'DLB'], 4), true);
import { orozcoCorners } from '../data/orozco-corners.js';
import { orozcoD } from '../data/orozco-d.js';
import { orozcoF } from '../data/orozco-f.js';
import { orozcoK } from '../data/orozco-k.js';
const TURNS = [...'DLB'].flatMap((f) => pw.map((q) => f + q));
const mm = {}; for (const t of TURNS) { const p = permOf(t); mm[t] = Object.fromEntries(LET.map((l) => [l, letterAt.get(p[spotOf(l)])])); }
const len = (s) => (s ? s.split(' ').length : 0);
const norm = (r, b) => ({ setup: r.setup || '', f: r.forwards || r.notation.replace(/^\[.*: (\[.*\])\]$/, '$1'), fm: r.fMoves || r.moves, bm: r.bMoves });
const T = { B: {}, D: {}, F: {}, K: {} };
for (const r of orozcoCorners) T.B[r.letter] = { setup: r.setup || '', fm: r.moves };
for (const [h, d] of [['D', orozcoD], ['F', orozcoF], ['K', orozcoK]]) for (const r of d) T[h][r.letter] = { setup: r.setup || '', fm: r.fMoves, bm: r.bMoves };
const invMoves = (m) => m.split(' ').reverse().map((x) => (x.endsWith("'") ? x[0] : x.endsWith('2') ? x : x + "'")).join(' ');
const HS = [...'BDFK']; const DOOR = { B: 'B', D: 'L', F: 'L', K: 'D' };
const cyc = (moves) => { const p = permOf(moves); if (p.filter((v, i) => v !== i).length !== 9 || p[C] === C) return null; const a = p[C], b = p[a]; return p[b] === C ? letterAt.get(a) + letterAt.get(b) : null; };
// option: x plays helper h after door turn t; other letter y. Build moves and verify. fwd alg of y2 = buffer->y2->h. Pair x,y (x first): buffer->x->y = buffer -> h -> y2 = inverse of fwd.
function opt(p, xi, h, t) { const x = p[xi], y = p[1 - xi]; const y2 = t ? mm[t][y] : y; const r = T[h][y2]; if (!r) return null;
  const fwd = r.fm; const core = xi === 0 ? invMoves(fwd) : fwd; const moves = t ? `${t} ${core} ${invMoves(t)}` : core; if (cyc(moves) !== p) throw new Error('bad ' + p + ' ' + moves);
  return { p, x, y, y2, h, t, n: (t ? 1 : 0) + len(r.setup), row: r.setup, moved: y2 !== y }; }
function optionsRaw(p) { const out = []; for (const xi of [0, 1]) { const x = p[xi]; if (HS.includes(x)) { const o = opt(p, xi, x, ''); if (o) out.push({ ...o, lvl: 0 }); } for (const h of HS) for (const q of pw) if (mm[DOOR[h] + q][x] === h) { const o = opt(p, xi, h, DOOR[h] + q); if (o) out.push({ ...o, lvl: 1 }); } } return out; }
const OPT = {}; function options(p) { return OPT[p] ||= optionsRaw(p); } 
const best = (p) => Math.min(...HS.map((g) => still[p][g].n));
const lvl = (p) => { const o = options(p); return o.some((x) => x.lvl === 0) ? 0 : o.length ? 1 : 2; };
const DOORS = { E: ['F', 'L'], G: ['K', 'D'], H: ['F', 'L2'], L: ['D', "L'"], O: ['K', "D'"], R: ['D', 'L'], S: ['K', 'D2'], X: ['B', 'B2'] };
const ALT = { E: ['B', "B'"], O: ['B', 'B'], X: ['B', 'B2'], G: ['K', 'D'] }; // prefer-B variant overrides
const VIA = { Q: 'B2', A: "L'", I: 'L2', U: 'L', T: "B'", V: 'D2', W: 'D', N: 'B2', P: "D'" }; const ORD2 = [...'QAIUVWNPT'];
for (const [l, t] of Object.entries(VIA)) console.log(l, t, '->', mm[t][l], DOORS[mm[t][l]].join(' via '));
const through = (s, y) => s.reduce((a, t) => mm[t][a], y);
function build(p, x, walk, h) { const xi = p[0] === x ? 0 : 1; const y = p[1 - xi]; const y2 = through(walk, y); const r = T[h][y2]; if (!r) return null; const core = xi === 0 ? invMoves(r.fm) : r.fm; const pre = walk.join(' '); const moves = pre ? `${pre} ${core} ${invMoves(pre)}` : core; if (cyc(moves) !== p) throw new Error('bad ' + p); return { n: walk.length + len(r.setup), h, x, y2, walk: pre, row: r.setup, L: walk.length }; }
function rule(p, doors) { const hl = [...p].filter((l) => HS.includes(l)); if (hl.length) return hl.map((x) => build(p, x, [], x)).filter(Boolean).reduce((a, b) => (b.n < a.n ? b : a));
  for (const x of p) if (doors[x]) { const o = build(p, x, [doors[x][1]], doors[x][0]); if (o) return o; }
  for (const x of ORD2) if (p.includes(x)) { const m = mm[VIA[x]][x]; const o = build(p, x, [VIA[x], doors[m][1]], doors[m][0]); if (o) return o; } throw new Error('none ' + p); }
for (const [name, doors] of [['A (E>F O>K X>B G>K)', DOORS], ['prefer B (E>B O>B X>B G>K)', { ...DOORS, ...ALT }]]) { const lv = [0, 1, 2].map(() => ({ c: 0, f: 0, s: 0, h: [0,0,0,0,0] })); let rot = 0, all = 0; const four = [];
  for (const p of PAIRS) { const o = rule(p, doors); const x = lv[o.L]; x.c++; x.f += freq[p]; x.s += o.n * freq[p]; x.h[o.n]++; all += (8 + 2 * o.n) * freq[p]; if ('FK'.includes(o.h)) rot += freq[p]; if (o.n > 3) four.push(p); }
  console.log('RULE', name); lv.forEach((x, i) => console.log(`  level ${i}: ${x.c} pairs, ${(100 * x.f / tot).toFixed(0)}% of solve pairs, mean setup ${(x.s / x.f).toFixed(2)}, mean moves ${(8 + 2 * x.s / x.f).toFixed(1)}, lengths 0-4 ${x.h.join('/')}`));
  console.log(`  all 378 checked as pure 3-cycles; corner moves per solve ${(all / nsolves).toFixed(1)}; pairs needing a rotation (F or K) ${(100 * rot / tot).toFixed(0)}% = ${(rot / nsolves).toFixed(2)} per solve; 4-move setups: ${four.join(' ')}`); }
const ex = (p) => { const o = rule(p, DOORS); return `${p}: ${o.x} ${o.walk ? 'after ' + o.walk : 'is the helper'} -> helper ${o.h}; other letter is at ${o.y2}; its helper-${o.h} setup ${o.row || 'none'}; setup ${o.n}`; };
for (const p of ['QT','AP','NW','IV','TU','VW','AU','ET','GA','XP']) console.log(ex(p));

{ const h = [0,0,0,0,0]; let w = 0; for (const p of PAIRS) { h[best(p)]++; w += best(p) * freq[p]; } console.log(`best group for every pair: lengths 0-4 ${h.join('/')}, mean setup ${(w / tot).toFixed(2)}, corner moves per solve ${((8 * tot + 2 * w) / nsolves).toFixed(1)}`); }
