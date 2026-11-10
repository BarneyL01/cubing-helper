// Third set, any 3 bases (not structured): best 3 of the 198 pure 8-move corner commutators that include the buffer,
// added to the 6 known bases. Exhaustive only over the top 80 by new coverage. See docs/third-base-set-status.md.
//   node log/2026-11-10-third-base-any.mjs
import { permOf, spotOf, letterAt, expandBrackets } from './three-style-lib.mjs';
const C = spotOf('C');
const LET = [...letterAt.values()];
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));
const targets = LET.filter((l) => cornerOf(l) !== 'C');
const PAIRS = []; for (const a of targets) for (const b of targets) if (cornerOf(a) !== cornerOf(b)) PAIRS.push(a + b);
const PI = new Map(PAIRS.map((p, i) => [p, i]));
console.log('pairs', PAIRS.length);
const pw = ['', "'", '2'], inv = (m) => m.endsWith("'") ? m[0] : m.endsWith('2') ? m : m + "'";
const faces = 'RLUDFB', axis = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };
// cycle of a commutator: [first, second] targets (buffer -> first -> second) or null
const cycOf = (alg) => { const p = permOf(alg); const moved = p.filter((v, i) => v !== i).length; if (moved !== 9) return null;
  if (p[C] === C) return null; const a = p[C], b = p[a]; if (p[b] !== C) return null; return [letterAt.get(a), letterAt.get(b), p]; };
// candidates: [X Y X' , Z] and [Z , X Y X']
const cands = new Map();
for (const X of faces) for (const xp of pw) for (const Y of faces) if (axis[Y] !== axis[X]) for (const yp of pw) for (const Z of faces) for (const zp of pw) {
  const I = `${X}${xp} ${Y}${yp} ${inv(X + xp)}`, Zm = Z + zp;
  for (const alg of [`[${I} , ${Zm}]`, `[${Zm} , ${I}]`]) {
    const e = expandBrackets(alg); const c = cycOf(e); if (!c) continue;
    const k = c[2].join(); if (!cands.has(k)) cands.set(k, { alg, a: c[0], b: c[1], perm: c[2] });
  }
}
console.log('distinct pure 8-move corner commutators with the buffer', cands.size);
// setups keeping buffer: D L B moves (or D L only), up to n moves
function setups(fs, n) { const out = [{ s: '', p: permOf('') }]; let layer = [{ s: '', last: '' }];
  for (let k = 1; k <= n; k++) { const nx = []; for (const x of layer) for (const f of fs) if (f !== x.last) for (const q of pw) { const s = (x.s ? x.s + ' ' : '') + f + q; nx.push({ s, last: f }); out.push({ s, p: permOf(s) }); } layer = nx; }
  return out; }
// coverage set of a commutator under setups: pair (x,y) where S sends x->a, y->b
function cover(c, S) { const set = new Map(); const A = spotOf(c.a), B = spotOf(c.b);
  for (const { s, p } of S) { const iv = new Array(54); p.forEach((v, i) => (iv[v] = i)); const x = letterAt.get(iv[A]), y = letterAt.get(iv[B]);
    const len = s ? s.split(' ').length : 0; const i = PI.get(x + y); if (i !== undefined && (!set.has(i) || set.get(i) > len)) set.set(i, len); }
  return set; }
const KNOWN = ["[R D R' , U']", "[R D' R' , U']", "[R D2 R' , U']", "[R U R' , D]", "[R U R' , D2]", "[R' D' R , U2]"];
const swap = (alg) => { const m = alg.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
const known = KNOWN.flatMap((a) => [a, swap(a)]).map((alg) => { const c = cycOf(expandBrackets(alg)); return { alg, a: c[0], b: c[1] }; });
for (const [fs, n] of [['DL', 2], ['DL', 3], ['DLB', 1], ['DLB', 2], ['DLB', 3]]) {
  const S = setups(fs.split(''), n);
  const have = new Set(); for (const k of known) for (const i of cover(k, S).keys()) have.add(i);
  // base with its reverse = one "base"
  const list = [...cands.values()].map((c) => { const rev = cycOf(expandBrackets(swap(c.alg))); const s = new Set(cover(c, S).keys()); for (const i of cover({ a: rev[0], b: rev[1] }, S).keys()) s.add(i); return { alg: c.alg, set: [...s].filter((i) => !have.has(i)) }; })
    .filter((c) => c.set.length);
  // best triple, exhaustive over the top 80 by new coverage
  list.sort((x, y) => y.set.length - x.set.length); const top = list.slice(0, 80);
  let best = { n: 0 };
  for (let i = 0; i < top.length; i++) for (let j = i + 1; j < top.length; j++) { const u2 = new Set([...top[i].set, ...top[j].set]);
    for (let k = j + 1; k < top.length; k++) { let n = u2.size; for (const v of top[k].set) if (!u2.has(v)) n++; if (n > best.n) best = { n, t: [top[i].alg, top[j].alg, top[k].alg] }; } }
  const missing = PAIRS.length - have.size;
  console.log(`setups ${fs} <=${n}: 6 known bases cover ${have.size}/378; left ${missing}; best 3 more add ${best.n} -> ${have.size + best.n}; ${best.t?.join(' ')}; still left ${missing - best.n}`);
}
