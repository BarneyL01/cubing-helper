// Orozco corners (buffer UFR, helper UBR): finds one commutator per target letter and
// checks the whole method by simulation. Run from the repository root:
//
//   node log/2026-10-25-orozco-corners.mjs           checks only; prints ALL OK
//   node log/2026-10-25-orozco-corners.mjs --write   also rewrites data/orozco-corners.js
//
// From the sources (cubinghistory.com, speedsolving.com): buffer UFR, helper UBR; odd
// targets cycle buffer -> target -> helper, even targets buffer -> helper -> target.
// Worked out here: the commutators (three bases [R D R', U'], [R D' R', U'], [R D2 R', U']
// with a setup of D and L turns, which never touch the buffer or the helper), what to do
// for the helper's own letters B, N, Q, and the parity fix after M2 edges.
import { readFileSync, writeFileSync } from 'node:fs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { cancelMoves, expandBrackets, invertAlg } from '../js/algs.js';
import { bldCorners, BLD_PARITY } from '../data/bld.js';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';

const WRITE = process.argv.includes('--write');
const failures = [];
const check = (name, ok, detail = '') => { if (!ok) failures.push(detail ? `${name}: ${detail}` : name); };

// ---------- stickers and permutations ----------
const SOLVED = solvedCube();
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const IDX = new Map(SOLVED.map((s, i) => [key(s), i]));
const tagged = SOLVED.map((s, i) => ({ ...s, colour: i }));
const permOf = (alg) => { const o = new Array(54); for (const s of applyAlg(tagged, alg)) o[s.colour] = IDX.get(key(s)); return o; };
const comp = (a, b) => a.map((x) => b[x]);
const inv = (a) => { const o = new Array(54); a.forEach((x, i) => (o[x] = i)); return o; };
const NORMAL = { U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], R: [1, 0, 0], L: [-1, 0, 0] };
const spotOf = (piece) => { const p = [0, 0, 0]; for (const f of piece) NORMAL[f].forEach((v, i) => (p[i] += v)); return IDX.get(`${p.join()}|${NORMAL[piece[0]].join()}`); };
const SPOT = Object.fromEntries(bldCorners.map((r) => [r.letter, spotOf(r.piece)]));
const LETTER_AT = Object.fromEntries(Object.entries(SPOT).map(([l, i]) => [i, l]));
const PIECE = Object.fromEntries(bldCorners.map((r) => [r.letter, r.piece]));
const BUFFER = 'C'; // UFR, top sticker
const HELPER = 'B'; // UBR, top sticker
const BUFFER_LETTERS = ['C', 'J', 'M'];
const HELPER_LETTERS = ['B', 'N', 'Q'];
const TARGETS = Object.keys(SPOT).filter((l) => !BUFFER_LETTERS.includes(l) && !HELPER_LETTERS.includes(l)).sort();

// ---------- the commutators: base + setup ----------
const BASES = [
  { id: 'D', notation: "[R D R', U']" },
  { id: "D'", notation: "[R D' R', U']" },
  { id: 'D2', notation: "[R D2 R', U']" },
];
const SETUP_MOVES = ['D', "D'", 'D2', 'L', "L'", 'L2'];
const setups = [[]];
for (const a of SETUP_MOVES) { setups.push([a]); for (const b of SETUP_MOVES) if (a[0] !== b[0]) { setups.push([a, b]); for (const c of SETUP_MOVES) if (b[0] !== c[0]) setups.push([a, b, c]); } }
const rows = [];
for (const t of TARGETS) {
  let best = null;
  for (const S of setups) for (const base of BASES) {
    const setup = S.join(' ');
    const notation = setup ? `[${setup}: ${base.notation}]` : base.notation;
    const moves = cancelMoves(expandBrackets(notation));
    const p = permOf(moves);
    // buffer's top sticker -> t, t -> helper's top sticker, helper -> buffer; nothing else moves but those three corners
    if (p[SPOT[BUFFER]] !== SPOT[t] || p[SPOT[t]] !== SPOT[HELPER] || p[SPOT[HELPER]] !== SPOT[BUFFER]) continue;
    const moved = p.map((x, i) => (x !== i ? i : -1)).filter((i) => i >= 0);
    if (moved.length !== 9) continue;
    const length = moves.split(' ').length;
    const score = [S.length, length];
    if (!best || score[0] < best.score[0] || (score[0] === best.score[0] && score[1] < best.score[1])) best = { letter: t, piece: PIECE[t], setup, base: base.id, notation, moves, length, score };
  }
  check(`commutator for ${t}`, !!best);
  if (best) { delete best.score; rows.push(best); }
}

// Helper letters and parity (worked out by simulation below).
const TWIST = "(R' D' R D)×2 U (D' R' D R)×2 U'";
const TWIST_REV = "U (R' D' R D)×2 U' (D' R' D R)×2";
const HELPER_RULES = [
  { letter: 'B', odd: 'skip', even: 'skip' },
  { letter: 'N', odd: 'twist', even: 'twist-rev' },
  { letter: 'Q', odd: 'twist-rev', even: 'twist' },
];
const PARITY = "R U' R' U' R U R D R' U' R D' R' U2 R' U'"; // Ra-perm: swaps UFR-UBR and UL-UB

// ---------- checks ----------
check('twist reversed is the inverse', cancelMoves(expandBrackets(TWIST_REV)) === cancelMoves(invertAlg(expandBrackets(TWIST))));
for (const r of rows) {
  const p = permOf(invertAlg(r.moves));
  check(`backwards ${r.letter} cycles buffer -> helper -> target`, p[SPOT[BUFFER]] === SPOT[HELPER] && p[SPOT[HELPER]] === SPOT[r.letter] && p[SPOT[r.letter]] === SPOT[BUFFER]);
}
const ROW = Object.fromEntries(rows.map((r) => [r.letter, r]));
const twistAlg = { twist: expandBrackets(TWIST), 'twist-rev': expandBrackets(TWIST_REV), skip: '' };
const steps = (targets) => targets.map((t, i) => {
  const odd = i % 2 === 0;
  const h = HELPER_RULES.find((x) => x.letter === t.letter);
  if (h) return twistAlg[odd ? h.odd : h.even];
  return odd ? ROW[t.letter].moves : invertAlg(ROW[t.letter].moves);
});
let seed = 20261025;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const counts = { solves: 0, odd: 0, helper: 0, breaks: 0 };
for (let n = 0; n < 3000; n++) {
  const scramble = randomScramble(25, rnd);
  const plan = bldPlan(scramble);
  const targets = cornerMemoFrom(plan.state, BUFFER);
  const edges = [...plan.edges.map((e) => e.moves), plan.parity ? BLD_PARITY[0] : ''];
  const corners = steps(targets);
  if (targets.length % 2) corners.push(PARITY);
  const st = applyAlg(plan.state, [...edges, ...corners].filter(Boolean).join(' '));
  const solved = st.every((s) => s.home === key(s));
  check('M2 edges + Orozco corners solve', solved, scramble);
  counts.solves += solved ? 1 : 0;
  counts.odd += targets.length % 2;
  counts.helper += targets.some((t) => HELPER_LETTERS.includes(t.letter)) ? 1 : 0;
  counts.breaks += targets.some((t) => t.cycleBreak) ? 1 : 0;
}
console.log(`commutators: ${rows.length} (setup moves 0/1/2/3: ${[0, 1, 2, 3].map((k) => rows.filter((r) => (r.setup ? r.setup.split(' ').length : 0) === k).length).join('/')}, lengths ${Math.min(...rows.map((r) => r.length))}-${Math.max(...rows.map((r) => r.length))})`);
console.log(`full solves: ${counts.solves}/3000 (odd corner count ${counts.odd}, a helper letter ${counts.helper}, a cycle break ${counts.breaks})`);

// ---------- the published list (note.com) ----------
{
  const { orozcoPublished, OROZCO_PUBLISHED_HELPER, OROZCO_PUBLISHED_PARITY } = await import('../data/orozco-published.js');
  check('published list: 18 letters', orozcoPublished.length === 18 && new Set(orozcoPublished.map((r) => r.letter)).size === 18);
  for (const r of orozcoPublished) {
    const p = permOf(cancelMoves(expandBrackets(r.notation)));
    const moved = p.filter((x, i) => x !== i).length;
    check(`published ${r.letter} cycles buffer -> ${r.letter} -> helper, nothing else`, p[SPOT[BUFFER]] === SPOT[r.letter] && p[SPOT[r.letter]] === SPOT[HELPER] && p[SPOT[HELPER]] === SPOT[BUFFER] && moved === 9, r.notation);
  }
  const same = (a, b) => permOf(a).every((x, i) => x === permOf(b)[i]);
  check('published N = twist', same(OROZCO_PUBLISHED_HELPER.N, expandBrackets(TWIST)));
  check('published Q = twist backwards', same(OROZCO_PUBLISHED_HELPER.Q, expandBrackets(TWIST_REV)));
  // their parity: UFR <-> UBR and UF <-> UB; ours (Ra): UFR <-> UBR and UL <-> UB
  const pp = permOf(OROZCO_PUBLISHED_PARITY);
  check('published parity swaps the buffer and helper corners', pp[SPOT.C] === SPOT.B && pp[SPOT.B] === SPOT.C);
  console.log(`published list: ${orozcoPublished.length} checked, helper algorithms and parity checked`);
}

// ---------- write ----------
if (WRITE) {
  const path = 'data/orozco-corners.js';
  const body = [
    '// GENERATED by log/2026-10-25-orozco-corners.mjs --write. Do not edit by hand.',
    `export const OROZCO_BUFFER = ${JSON.stringify({ letter: BUFFER, piece: 'UFR', letters: BUFFER_LETTERS })};`,
    `export const OROZCO_HELPER = ${JSON.stringify({ letter: HELPER, piece: 'UBR', letters: HELPER_LETTERS })};`,
    `export const OROZCO_BASES = ${JSON.stringify(BASES)};`,
    'export const orozcoCorners = [',
    ...rows.map((r) => `  ${JSON.stringify(r)},`),
    '];',
    `export const OROZCO_TWIST = ${JSON.stringify(TWIST)};`,
    `export const OROZCO_TWIST_REV = ${JSON.stringify(TWIST_REV)};`,
    `export const OROZCO_HELPER_RULES = ${JSON.stringify(HELPER_RULES)};`,
    `export const OROZCO_PARITY = ${JSON.stringify(PARITY)};`,
  ].join('\n');
  writeFileSync(path, `// Orozco corners: buffer UFR (C), helper UBR (B). One commutator per target letter.\n// BEGIN GENERATED\n${body}\n// END GENERATED\n`);
  console.log(`wrote ${path}`);
}
// the module the page uses must agree with this script
try {
  const { orozcoCornerPlan } = await import('../js/orozco.js');
  let same = 0;
  seed = 99;
  for (let n = 0; n < 300; n++) {
    const plan = bldPlan(randomScramble(25, rnd));
    const o = orozcoCornerPlan(plan.state);
    const st = applyAlg(plan.state, [...plan.edges.map((e) => e.moves), plan.parity ? BLD_PARITY[0] : '', ...o.steps.map((s) => s.moves), o.parity ? o.parityAlg : ''].filter(Boolean).join(' '));
    if (st.every((s) => s.home === key(s))) same++;
  }
  check('js/orozco.js plans solve', same === 300, `${same}/300`);
  console.log(`js/orozco.js: ${same}/300 solves`);
} catch (e) { check('js/orozco.js loads', false, e.message); }
// ---------- the page's worked examples ----------
{
  const { orozcoExamples } = await import('../data/orozco-examples.js');
  const { orozcoStepsForMemo } = await import('../js/orozco.js');
  const { scrambledState } = await import('../js/bld-memo.js');
  for (const ex of orozcoExamples) {
    const solve = orozcoStepsForMemo(ex.memo).map((x) => x.moves).join(' ');
    const st = scrambledState(cancelMoves(invertAlg(solve)));
    const memo = cornerMemoFrom(st, BUFFER).map((t) => t.letter).join(' ');
    check(`example ${ex.id} memos as ${ex.memo.join(' ')}`, memo === ex.memo.join(' '), memo);
    check(`example ${ex.id} solves`, applyAlg(st, solve).every((s) => s.home === key(s)));
  }
  console.log(`examples: ${orozcoExamples.length} checked`);
}
console.log(failures.length ? `${failures.length} FAILED\n${failures.slice(0, 10).join('\n')}` : 'ALL OK');
process.exitCode = failures.length ? 1 : 0;
