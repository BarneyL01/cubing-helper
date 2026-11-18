// Measures Eka edges against M2 edges (and full 3-style edges for reference) on the same random scrambles.
//   node log/2026-11-19-eka-vs-m2.mjs   prints the table and ALL OK
//
// M2: the site's plan (js/bld-memo.js bldPlan: memo from DF, setup + M2 + undo per letter, M2 parity when odd).
// Eka (as described on the Speedsolving wiki, not from Eka's own list): buffer UF, memo from C; for each pair (a, b) a
//   setup of R / L / D / B turns (never moves UF) puts a on the helper sticker B (UR's U sticker), then the 3-style
//   commutator for (B, where b is now), then undo. Setups up to 4 moves, shortest total kept. Commutators from
//   data/edge-cycles.js (our checked UF-buffer table). Pairs where this cannot work (b on UR, or a flipped edge's two
//   letters) go through the helper letter by letter: (a, B) then (B, b), or with helper D if UR is involved.
// 3-style: each pair (a, b) straight from data/edge-cycles.js, same fallback.
// Odd number of edge letters: M2 adds its parity algorithm; Eka and 3-style do the last letter as (x, B), which leaves
//   UF and UR swapped for the corner parity algorithm (the corner parity algorithm itself is not counted for any of them).
// Every plan is run on the simulated cube: edges solved (or only UF/UR swapped when odd for Eka / 3-style; M2's own
//   odd case leaves UL/UB swapped as on the site), corners untouched by the edge part.
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { invertAlg, cancelMoves } from '../js/algs.js';
import { bldPlan, randomScramble, scrambledState, edgeMemoFrom } from '../js/bld-memo.js';
import { bldEdges, BLD_PARITY } from '../data/bld.js';
import { edgeComms } from '../data/edge-cycles.js';

const N = 3000;
let seed = 2026;
const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const NORMAL = { U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], R: [1, 0, 0], L: [-1, 0, 0] };
const stickerOf = (piece) => { const p = [0, 0, 0]; for (const f of piece) NORMAL[f].forEach((v, i) => (p[i] += v)); return { p, n: NORMAL[piece[0]] }; };
const key = (p, n) => `${p.join()}|${n.join()}`;
const SPOT = Object.fromEntries(bldEdges.map((r) => { const s = stickerOf(r.piece); return [r.letter, key(s.p, s.n)]; }));
const LETTER_AT = Object.fromEntries(Object.entries(SPOT).map(([l, k]) => [k, l]));
const PIECE = Object.fromEntries(bldEdges.map((r) => [r.letter, [...r.piece].sort().join('')]));
const tracked = () => solvedCube().map((s) => ({ ...s, home: key(s.p, s.n) }));
const where = (alg, letter) => { const st = applyAlg(tracked(), alg); const s = st.find((x) => x.home === SPOT[letter]); return LETTER_AT[key(s.p, s.n)]; };
const COMM = Object.fromEntries(edgeComms.map((e) => [e.first + e.second, e]));
const len = (m) => (m ? m.split(' ').length : 0);
const fails = [];

// setups of R L D B up to 4 moves (no two turns of one face in a row)
const TURNS = ['R', 'L', 'D', 'B'].flatMap((f) => [f, f + "'", f + '2']);
const SETUPS = [''];
for (let d = 1, layer = ['']; d <= 4; d++) {
  layer = layer.flatMap((s) => TURNS.filter((t) => !s || s.split(' ').at(-1)[0] !== t[0]).map((t) => (s ? `${s} ${t}` : t)));
  SETUPS.push(...layer);
}
// for each letter: the shortest setups taking it to B (several, so the 2nd letter can be checked)
const TO_B = {};
for (const s of SETUPS) {
  const m = s ? applyAlg(tracked(), s) : null;
  for (const l of Object.keys(SPOT)) {
    if (PIECE[l] === PIECE.C) continue;
    const st = m ? m.find((x) => x.home === SPOT[l]) : null;
    const at = st ? LETTER_AT[key(st.p, st.n)] : l;
    if (at === 'B') (TO_B[l] ||= []).push(s);
  }
}

const helperPath = (a, b, h) => (COMM[a + h] && COMM[h + b] ? [COMM[a + h].moves, COMM[h + b].moves].join(' ') : null);
// letter by letter through a helper edge that is not a's or b's piece (B first, then D, A, the others)
const viaHelper = (a, b) => {
  for (const h of ['B', 'D', 'A', ...Object.keys(SPOT)]) {
    if (PIECE[h] === PIECE.C || PIECE[h] === PIECE[a] || PIECE[h] === PIECE[b]) continue;
    const m = helperPath(a, b, h);
    if (m) return m;
  }
  throw new Error(`no helper path for ${a}${b}`);
};
function ekaPair(a, b) {
  if (PIECE[a] !== PIECE[b] && PIECE[b] !== PIECE.B) {
    let best = null;
    for (const s of TO_B[a] || []) {
      const b2 = s ? where(s, b) : b;
      if (PIECE[b2] === PIECE.B || PIECE[b2] === PIECE.C) continue;
      const c = COMM['B' + b2];
      if (!c) continue;
      const moves = cancelMoves([s, c.moves, invertAlg(s)].filter(Boolean).join(' '));
      if (!best || len(moves) < len(best.moves)) best = { moves, setup: s, kind: 'eka' };
      if (len(s) >= 3 && best) break; // setups are in length order
    }
    if (best) return best;
  }
  return { moves: viaHelper(a, b), kind: 'helper' };
}
const styled = (a, b) => (COMM[a + b] ? { moves: COMM[a + b].moves, kind: '3style' } : { moves: viaHelper(a, b), kind: 'helper' });

const EKA = {}, TS = {};
const letters = Object.keys(SPOT).filter((l) => PIECE[l] !== PIECE.C);
for (const a of letters) for (const b of letters) if (a !== b) { EKA[a + b] = ekaPair(a, b); TS[a + b] = styled(a, b); }

const sliceCount = (m) => m.split(' ').filter((x) => /^[MES]/.test(x)).length;
const mCount = (m) => m.split(' ').filter((x) => /^M/.test(x)).length;
const edgesState = (st) => st.filter((s) => s.home.split('|')[0].split(',').filter((v) => v !== '0').length === 2);
const cornersOk = (before, after) => before.every((s, i) => s.home.split('|')[0].split(',').filter((v) => v !== '0').length !== 3 || (after[i].p.join() === s.p.join() && after[i].n.join() === s.n.join()));
const unsolvedEdges = (st) => new Set(edgesState(st).filter((s) => s.home !== key(s.p, s.n)).map((s) => s.home.split('|')[0])).size;

function plan(state, table) {
  const t = edgeMemoFrom(state, 'C').map((x) => x.letter);
  const parts = [];
  for (let i = 0; i < t.length; i += 2) {
    if (i === t.length - 1) { parts.push(COMM[t[i] + 'B'] ? COMM[t[i] + 'B'].moves : COMM[t[i] + 'A'].moves); break; } // a UR letter: UF/UB left swapped instead
    parts.push(table[t[i] + t[i + 1]].moves);
  }
  return { moves: cancelMoves(parts.join(' ')), odd: t.length % 2 === 1, letters: t.length, pairs: Math.floor(t.length / 2) };
}

const stat = { M2: [], Eka: [], '3-style': [] };
for (let i = 0; i < N; i++) {
  const scr = randomScramble(25, rnd);
  const st = scrambledState(scr);
  // M2 (edges part of the site's plan)
  const bp = bldPlan(scr);
  const m2 = cancelMoves([...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : ''].filter(Boolean).join(' ').replace(/2'/g, '2'));
  const after = applyAlg(st, m2);
  if (!cornersOk(st, after) || unsolvedEdges(after) > (bp.parity ? 2 : 0)) fails.push(`M2 ${scr}`);
  stat.M2.push({ moves: len(m2), slices: sliceCount(m2), m: mCount(m2), letters: bp.edges.length, odd: bp.parity });
  for (const [name, table] of [['Eka', EKA], ['3-style', TS]]) {
    const p = plan(st, table);
    const a2 = applyAlg(st, p.moves);
    const left = unsolvedEdges(a2);
    if (!cornersOk(st, a2) || left !== (p.odd ? 2 : 0)) fails.push(`${name} ${scr} left ${left}`);
    stat[name].push({ moves: len(p.moves), slices: sliceCount(p.moves), m: mCount(p.moves), letters: p.letters, odd: p.odd });
  }
}

const mean = (xs, f) => (xs.reduce((s, x) => s + f(x), 0) / xs.length).toFixed(1);
const ev = (xs) => xs.filter((x) => !x.odd);
console.log('Per solve, edges only (3,000 random scrambles; moves after cancelling, a slice turn counts 1):');
console.log('method   | letters | moves all | moves even-only | slice turns | M turns');
for (const [n, xs] of Object.entries(stat)) console.log(`${n.padEnd(8)} | ${mean(xs, (x) => x.letters).padStart(7)} | ${mean(xs, (x) => x.moves).padStart(9)} | ${mean(ev(xs), (x) => x.moves).padStart(15)} | ${mean(xs, (x) => x.slices).padStart(11)} | ${mean(xs, (x) => x.m).padStart(7)}`);
const ekaRows = Object.values(EKA);
const setupLen = Object.entries(EKA).filter(([, e]) => e.kind === 'eka').map(([, e]) => len(e.setup));
console.log(`Eka pairs: ${ekaRows.filter((e) => e.kind === 'eka').length} by setup into B, ${ekaRows.filter((e) => e.kind === 'helper').length} letter by letter through a helper; setup moves 0/1/2/3/4 = ${[0, 1, 2, 3, 4].map((k) => setupLen.filter((x) => x === k).length).join('/')}; mean pair ${(ekaRows.reduce((s, e) => s + len(e.moves), 0) / ekaRows.length).toFixed(1)} moves (3-style table ${(Object.values(TS).reduce((s, e) => s + len(e.moves), 0) / Object.values(TS).length).toFixed(1)})`);
console.log(fails.length ? `FAIL ${fails.length}\n${fails.slice(0, 5).join('\n')}` : 'ALL OK');
// each pair alone: a pure 3-cycle buffer -> a -> b
if (process.argv.includes('--pairs')) {
  let bad = [];
  for (const [p, e] of Object.entries(EKA)) {
    const st = applyAlg(tracked(), e.moves);
    const moved = st.filter((s) => s.home !== key(s.p, s.n));
    const okC = where(e.moves, 'C') === p[0] && where(e.moves, p[0]) === p[1] && where(e.moves, p[1]) === 'C';
    if (!okC || moved.length !== 6) bad.push(`${p} ${e.kind} ${e.setup ?? ''} | ${e.moves}`);
  }
  console.log('bad Eka pairs', bad.length, bad.slice(0, 8));
}
