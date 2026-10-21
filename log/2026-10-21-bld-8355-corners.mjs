// Pairs for someone who finished 8355 step 4: the unsolved corners are the four top-layer corners
// (letters A-D, i.e. UBL UBR UFR UFL) and the buffer corner DFR (V). Same three bases as the Corner
// cycles tab, setups restricted to R, U, F, D turns (no L, B). Compares with the unrestricted table.
//   node log/2026-10-21-bld-8355-corners.mjs           checks only
//   node log/2026-10-21-bld-8355-corners.mjs --write   also writes data/corner-8355.js
//   add --lb to allow L and B setups: checks the same and writes data/corner-8355-lb.js (corner8355LbRows)
import { readFileSync, writeFileSync } from 'node:fs';
import { applyAlg, solvedCube, faceOf, caseState } from '../js/cube-sim.js';
import { cancelMoves, expandBrackets, invertAlg } from '../js/algs.js';
import { bldCorners } from '../data/bld.js';
import { cornerCycles, pieceName, scrambledState } from '../js/bld-memo.js';

const WRITE = process.argv.includes('--write');
const failures = [];
const check = (name, ok, detail = '') => !ok && failures.push(detail ? `${name}: ${detail}` : name);
const log = (...a) => console.log(...a);

// ---- stickers and permutations (as in log/2026-10-16-bld-cycles-generate.mjs)
const SOLVED = solvedCube();
const N = SOLVED.length;
const ID = SOLVED.map((_, i) => i);
const keyOf = (s) => `${s.p.join()}|${s.n.join()}`;
const INDEX = new Map(SOLVED.map((s, i) => [keyOf(s), i]));
const NORMAL = { U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], R: [1, 0, 0], L: [-1, 0, 0] };
const spotOf = (piece) => {
  const p = [0, 0, 0];
  for (const f of piece) NORMAL[f].forEach((v, i) => (p[i] += v));
  return INDEX.get(`${p.join()}|${NORMAL[piece[0]].join()}`);
};
const CSPOT = Object.fromEntries(bldCorners.map((r) => [r.letter, spotOf(r.piece)]));
const CLET = Object.fromEntries(Object.entries(CSPOT).map(([l, i]) => [i, l]));
const ntype = (i) => SOLVED[i].p.filter((v) => v !== 0).length;
const posOf = (i) => SOLVED[i].p.join();
const comp = (X, Y) => X.map((j) => Y[j]);
const inv = (X) => {
  const r = new Array(N);
  X.forEach((j, i) => (r[j] = i));
  return r;
};
const tokenPerms = new Map();
const movePerm = (t) => {
  if (!tokenPerms.has(t)) tokenPerms.set(t, applyAlg(SOLVED, t).map((s) => INDEX.get(keyOf(s))));
  return tokenPerms.get(t);
};
const seqPerm = (tokens) => tokens.reduce((acc, t) => comp(acc, movePerm(t)), ID);
const permOfText = (text) => seqPerm(text.split(/\s+/).filter(Boolean));
const TURNS = ['U', 'D', 'R', 'L', 'F', 'B'].flatMap((f) => ['', "'", '2'].map((a) => f + a));
const FACE_ORDER = ['U', 'D', 'R', 'L', 'F', 'B'];
const rankOf = (tokens) => tokens.map((t) => String(FACE_ORDER.indexOf(t[0]) * 3 + ['', "'", '2'].indexOf(t.slice(1))).padStart(2, '0')).join('');
function sequences(maxLen) {
  const out = [[]];
  let frontier = [[]];
  for (let l = 1; l <= maxLen; l++) {
    frontier = frontier.flatMap((s) => TURNS.filter((t) => !s.length || s.at(-1)[0] !== t[0]).map((t) => [...s, t]));
    out.push(...frontier);
  }
  return out;
}

const BUFFER_LETTERS = ['V', 'K', 'P'];
const V = CSPOT.V;
const BUF_SPOTS = BUFFER_LETTERS.map((l) => CSPOT[l]);
const CORNER_LETTERS = Object.keys(CSPOT).filter((l) => !BUFFER_LETTERS.includes(l));

// ---- the six forms: three bases and their reverses
const FORMS = [
  { text: "[R U R', D]", reverse: false },
  { text: "[R U R', D']", reverse: false },
  { text: "[R U R', D2]", reverse: false },
  { text: "[D, R U R']", reverse: true },
  { text: "[D', R U R']", reverse: true },
  { text: "[D2, R U R']", reverse: true },
].map((f, i) => {
  const p = permOfText(expandBrackets(f.text));
  const moved = ID.filter((j) => p[j] !== j);
  const X = p[V];
  const Y = p[X];
  const ok = ntype(moved[0]) === 3 && moved.length === 9 && moved.every((j) => ntype(j) === 3) && p[Y] === V;
  check(`base ${f.text} is a pure corner 3-cycle through the buffer corner`, ok);
  return { ...f, i, p, moves: expandBrackets(f.text), pair: CLET[X] + CLET[Y], stickers: ['V', CLET[X], CLET[Y]] };
});
log(`forms: ${FORMS.map((f) => `${f.text}=${f.pair}`).join('  ')}`);

// ---- the five unsolved corners after 8355 step 4
const FIVE = ['UBL', 'UBR', 'UFR', 'UFL', 'DFR'];
const cornerOfLetter = (l) => [...bldCorners.find((r) => r.letter === l).piece].sort().join('');
const FIVE_KEYS = FIVE.map((n) => [...n].sort().join(''));
const LETTERS_5 = bldCorners.map((r) => r.letter).filter((l) => FIVE_KEYS.includes(cornerOfLetter(l)));
const TARGETS = LETTERS_5.filter((l) => !BUFFER_LETTERS.includes(l));
check('five corners: 15 stickers, 12 targets', LETTERS_5.length === 15 && TARGETS.length === 12, `${LETTERS_5} ${TARGETS}`);
log(`stickers ${LETTERS_5.join('')}; targets ${TARGETS.join('')}`);

// setups from R, U, F, D only, up to 4 turns
const LB = process.argv.includes('--lb');
const OK_FACES = LB ? 'RUFDLB' : 'RUFD';
const TURNS4 = TURNS.filter((t) => OK_FACES.includes(t[0]));
function seqs4(maxLen) {
  const out = [[]];
  let frontier = [[]];
  for (let l = 1; l <= maxLen; l++) {
    frontier = frontier.flatMap((s) => TURNS4.filter((t) => !s.length || s.at(-1)[0] !== t[0]).map((t) => [...s, t]));
    out.push(...frontier);
  }
  return out;
}
const setups4 = seqs4(4).map((tokens) => ({ tokens, p: seqPerm(tokens) })).map((s) => ({ ...s, inv: inv(s.p), rank: rankOf(s.tokens) }));
const quarters = (tokens) => tokens.filter((t) => !t.endsWith('2')).length;
const best5 = new Map();
for (const S of setups4) {
  for (const f of FORMS) {
    const conj = (i) => S.inv[f.p[S.p[i]]];
    const X = conj(V);
    if (BUF_SPOTS.includes(X) || !TARGETS.includes(CLET[X])) continue;
    const Y = conj(X);
    if (BUF_SPOTS.includes(Y) || conj(Y) !== V || !TARGETS.includes(CLET[Y])) continue;
    const key = CLET[X] + CLET[Y];
    const n = S.tokens.length;
    const notation = n ? `[${S.tokens.join(' ')}: ${f.text}]` : f.text;
    const moves = cancelMoves(expandBrackets(notation));
    const len = moves.split(' ').length;
    const score = [String(n), String(len).padStart(2, '0'), String(quarters(S.tokens)), String(f.i), S.rank].join('|');
    const old = best5.get(key);
    if (!old || score < old.score) best5.set(key, { n, score, S, f, notation, moves });
  }
}
// the unrestricted table for comparison (generic search over all faces, same ordering as the Corner cycles tab)
const best = new Map();
for (const S of sequences(3).map((tokens) => ({ tokens, p: seqPerm(tokens) })).map((s) => ({ ...s, inv: inv(s.p) }))) {
  for (const f of FORMS) {
    const conj = (i) => S.inv[f.p[S.p[i]]];
    const X = conj(V);
    if (BUF_SPOTS.includes(X)) continue;
    const Y = conj(X);
    if (BUF_SPOTS.includes(Y) || conj(Y) !== V) continue;
    const key = CLET[X] + CLET[Y];
    if (!best.has(key) || S.tokens.length < best.get(key)) best.set(key, S.tokens.length);
  }
}
const rows = [];
for (const X of TARGETS) for (const Y of TARGETS) {
  if (cornerOfLetter(X) === cornerOfLetter(Y)) continue;
  const r = best5.get(X + Y);
  check(`pair ${X}${Y} found with R U F D setups`, !!r);
  if (!r) continue;
  const p = permOfText(r.moves);
  const moved = ID.filter((i) => p[i] !== i);
  check(`pair ${X}${Y} solves (V -> X -> Y -> V, nothing else)`, p[V] === CSPOT[X] && p[CSPOT[X]] === CSPOT[Y] && p[CSPOT[Y]] === V && moved.length === 9 && moved.every((i) => ntype(i) === 3), r.notation);
  if (!LB) check(`pair ${X}${Y}: no L or B turn`, !/[LB]/.test(r.moves));
  rows.push({
    first: X, second: Y, base: r.f.text, baseNo: r.f.i, setup: r.S.tokens.join(' '), setupMoves: r.n,
    notation: r.notation, moves: r.moves, length: r.moves.split(' ').length,
    fullSetupMoves: best.get(X + Y), onto: [r.S.p[V], r.S.p[CSPOT[X]], r.S.p[CSPOT[Y]]].map((i) => CLET[i]).join(''),
  });
}
check('108 rows', rows.length === 108, `${rows.length}`);
const stat = (f) => [0, 1, 2, 3, 4].map((n) => rows.filter((r) => f(r) === n).length).join('/');
log(`rows ${rows.length}; setup moves 0..4 (R U F D only): ${stat((r) => r.setupMoves)}; any face: ${stat((r) => r.fullSetupMoves)}`);
const mean = (f) => (rows.reduce((a, r) => a + f(r), 0) / rows.length).toFixed(2);
log(`mean setup ${mean((r) => r.setupMoves)} (any face ${mean((r) => r.fullSetupMoves)}); mean moves ${mean((r) => r.length)}; max moves ${Math.max(...rows.map((r) => r.length))}`);
log(`by base: ${FORMS.map((f) => rows.filter((r) => r.baseNo === f.i).length).join('/')}`);

// ---- random check: any 3-cycle of the five corners is solved by its pairs (cycle V -> X -> Y with X, Y targets)
let seed = 8355;
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
let solved = 0;
const rowOf = Object.fromEntries(rows.map((r) => [r.first + r.second, r]));
for (let k = 0; k < 300; k++) {
  const X = TARGETS[Math.floor(rnd() * 12)], Y = TARGETS[Math.floor(rnd() * 12)];
  if (!rowOf[X + Y]) continue;
  const p = permOfText(invertAlg(rowOf[X + Y].moves));
  const state = applyAlg(solvedCube(), invertAlg(rowOf[X + Y].moves));
  const back = applyAlg(state, rowOf[X + Y].moves);
  if (back.every((s) => faceOf(s.n) === s.colour)) solved++; else check('round trip', false, X + Y);
}
log(`round trips ${solved}`);

if (WRITE) {
  const body = `// GENERATED by log/2026-10-21-bld-8355-corners.mjs ${LB ? '--lb ' : ''}--write. Do not edit by hand.\n` +
    `// Pairs among the five corners left after 8355 step 4 (UBL UBR UFR UFL + DFR). Setups use ${LB ? 'any face' : 'R, U, F, D only'}.\n` +
    `export const ${LB ? 'corner8355LbRows' : 'corner8355Rows'} = [\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n];\n`;
  const out = LB ? 'data/corner-8355-lb.js' : 'data/corner-8355.js';
  writeFileSync(out, body);
  log(`wrote ${out}`);
}
if (failures.length) { console.log(`FAILED (${failures.length})`); failures.slice(0, 20).forEach((f) => console.log(' -', f)); process.exit(1); }
log('ALL OK');
