// Third set of 3 bases (2026-11-10): which 3-base set, added to the 6 known (Orozco + helper P), covers the most of the
// 378 corner pairs as [setup : base] with buffer-still setups (D, L, B). Structured sets only (one part fixed, the other
// turn in its 3 powers). See docs/third-base-set-status.md.   node log/2026-11-10-third-base-set.mjs
import { permOf, spotOf, letterAt, expandBrackets } from './three-style-lib.mjs';
const C = spotOf('C');
const LET = [...letterAt.values()];
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));
const targets = LET.filter((l) => cornerOf(l) !== 'C');
const PAIRS = []; for (const a of targets) for (const b of targets) if (cornerOf(a) !== cornerOf(b)) PAIRS.push(a + b);
const PI = new Map(PAIRS.map((p, i) => [p, i]));
const pw = ['', "'", '2'], inv = (m) => m.endsWith("'") ? m[0] : m.endsWith('2') ? m : m + "'";
const axis = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };
const cycOf = (alg) => { const p = permOf(expandBrackets(alg)); if (p.filter((v, i) => v !== i).length !== 9 || p[C] === C) return null; const a = p[C], b = p[a]; return p[b] === C ? [letterAt.get(a), letterAt.get(b)] : null; };
const swap = (alg) => { const m = alg.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
function setups(fs, n) { const out = [{ s: '', p: permOf(''), len: 0 }]; let layer = [{ s: '', last: '' }];
  for (let k = 1; k <= n; k++) { const nx = []; for (const x of layer) for (const f of fs) if (f !== x.last) for (const q of pw) { const s = (x.s ? x.s + ' ' : '') + f + q; nx.push({ s, last: f }); out.push({ s, p: permOf(s), len: k }); } layer = nx; } return out; }
// base (with reverse) -> Map pairIndex -> shortest setup length
function cover(alg, S) { const m = new Map();
  for (const a of [alg, swap(alg)]) { const c = cycOf(a); const A = spotOf(c[0]), B = spotOf(c[1]);
    for (const { p, len } of S) { let x, y; for (let i = 0; i < 54; i++) { if (p[i] === A) x = i; if (p[i] === B) y = i; }
      const k = PI.get(letterAt.get(x) + letterAt.get(y)); if (k !== undefined && (!m.has(k) || m.get(k) > len)) m.set(k, len); } }
  return m; }
const KNOWN = ["[R D R' , U']", "[R D' R' , U']", "[R D2 R' , U']", "[R U R' , D]", "[R U R' , D2]", "[R' D' R , U2]"];
// structured sets: one fixed part, the other part's turn in its 3 powers (like Orozco: D, D', D2)
const sets = [];
for (const X of 'RLUDFB') for (const xp of ['', "'"]) for (const Y of 'RLUDFB') if (axis[Y] !== axis[X]) for (const Z of 'RLUDFB') {
  // vary interchange power with insertion X Y^k X' fixed k, or vary middle with interchange fixed
  for (const yp of pw) { const I = `${X}${xp} ${Y}${yp} ${inv(X + xp)}`; const algs = pw.map((zp) => `[${I} , ${Z}${zp}]`).filter(cycOf); if (algs.length === 3) sets.push(algs); }
  for (const zp of pw) { const algs = pw.map((yp) => `[${X}${xp} ${Y}${yp} ${inv(X + xp)} , ${Z}${zp}]`).filter(cycOf); if (algs.length === 3) sets.push(algs); }
}
const key = (s) => s.slice().sort().join('|'); const uniq = [...new Map(sets.map((s) => [key(s), s])).values()];
console.log('structured sets of 3', uniq.length);
const pretty = (m) => { const h = {}; for (const v of m.values()) h[v] = (h[v] || 0) + 1; return JSON.stringify(h); };
for (const [fs, n] of [['DL', 3], ['DL', 4], ['DLB', 2], ['DLB', 3]]) {
  const S = setups(fs.split(''), n);
  const best6 = new Map(); for (const a of KNOWN) for (const [k, v] of cover(a, S)) if (!best6.has(k) || best6.get(k) > v) best6.set(k, v);
  const missing = PAIRS.filter((_, i) => !best6.has(i));
  const mean = (m) => ([...m.values()].reduce((a, b) => a + b, 0) / m.size).toFixed(2);
  console.log(`\n== setups ${fs} up to ${n}: 6 known -> ${best6.size}/378, mean setup ${mean(best6)} ${pretty(best6)}`);
  if (missing.length <= 40) console.log('  missing:', missing.join(' '));
  const scored = uniq.map((set) => { const m = new Map(best6); for (const a of set) for (const [k, v] of cover(a, S)) if (!m.has(k) || m.get(k) > v) m.set(k, v);
    const total = [...m.values()].reduce((a, b) => a + b, 0) + (378 - m.size) * 99; return { set, m, total }; }).sort((a, b) => a.total - b.total);
  for (const r of scored.slice(0, 6)) console.log(`  + ${r.set.join(' ')} -> ${r.m.size}/378 mean setup ${mean(r.m)} ${pretty(r.m)}`);
}

console.log('\n== sets with no L or B inside the base ==');
for (const [fs, n] of [['DLB', 2], ['DLB', 3]]) {
  const S = setups(fs.split(''), n);
  const best6 = new Map(); for (const a of KNOWN) for (const [k, v] of cover(a, S)) if (!best6.has(k) || best6.get(k) > v) best6.set(k, v);
  const mean = (m) => ([...m.values()].reduce((a, b) => a + b, 0) / m.size).toFixed(2);
  const scored = uniq.filter((s) => !/[LB]/.test(s.join(''))).map((set) => { const m = new Map(best6); for (const a of set) for (const [k, v] of cover(a, S)) if (!m.has(k) || m.get(k) > v) m.set(k, v);
    return { set, m, total: [...m.values()].reduce((a, b) => a + b, 0) + (378 - m.size) * 99 }; }).sort((a, b) => a.total - b.total);
  console.log(`setups ${fs} up to ${n}:`);
  for (const r of scored.slice(0, 5)) console.log(`  + ${r.set.join(' ')} -> ${r.m.size}/378 mean setup ${mean(r.m)} ${pretty(r.m)}`);
}
// the six known + UV/VU at 4 moves?
{ const S = setups(['D', 'L', 'B'], 4); const m = new Map(); for (const a of KNOWN) for (const [k, v] of cover(a, S)) if (!m.has(k) || m.get(k) > v) m.set(k, v);
  console.log('known 6, DLB up to 4:', m.size, 'UV', m.get(PI.get('UV')), 'VU', m.get(PI.get('VU'))); }
// D/L only, why not complete: pairs never reachable
{ const S = setups(['D', 'L'], 4); const m = new Map(); for (const set of [KNOWN, ["[U' B U , F2]", "[U' B' U , F2]", "[U' B2 U , F2]"]]) for (const a of set) for (const [k, v] of cover(a, S)) if (!m.has(k)) m.set(k, v);
  const miss = PAIRS.filter((_, i) => !m.has(i)); console.log('DL<=4 with best set, missing', miss.length, miss.join(' ')); }
// cycles of the F D F' set
for (const a of ["[F D F' , U2]", "[F D' F' , U2]", "[F D2 F' , U2]"]) console.log(a, cycOf(a).join(' then '), '| reverse', cycOf(swap(a)).join(' then '));
