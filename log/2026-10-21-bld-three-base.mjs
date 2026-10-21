// Generates and checks the three-base corner table for the rebuilt Corner cycles tab
// (buffer DFR, stickers V K P, traced from V). Bases: [R U R', D], [R U R', D'], [R U R', D2] and
// their reverses. Every pair (X, Y) gets the shortest setup + base that sends V -> X -> Y -> V.
//   node log/2026-10-21-bld-three-base.mjs           checks only; prints ALL OK
//   node log/2026-10-21-bld-three-base.mjs --write   also rewrites the GENERATED block of data/corner-bases.js
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

// ---- the pair table
const setups = sequences(3).map((tokens) => ({ tokens, p: seqPerm(tokens) })).map((s) => ({ ...s, inv: inv(s.p), rank: rankOf(s.tokens) }));
const best = new Map();
for (const S of setups) {
  for (const f of FORMS) {
    const conj = (i) => S.inv[f.p[S.p[i]]];
    const X = conj(V);
    if (BUF_SPOTS.includes(X)) continue;
    const Y = conj(X);
    if (BUF_SPOTS.includes(Y) || conj(Y) !== V) continue;
    const key = CLET[X] + CLET[Y];
    const n = S.tokens.length;
    const old = best.get(key);
    if (old && n > old.n) continue;
    const notation = n ? `[${S.tokens.join(' ')}: ${f.text}]` : f.text;
    const moves = cancelMoves(expandBrackets(notation));
    const len = moves.split(' ').length;
    const fixed = S.p[V] === V;
    const score = [String(n), String(len).padStart(2, '0'), fixed ? '0' : '1', String(f.i), S.rank].join('|');
    if (!old || score < old.score) best.set(key, { n, score, S, f, notation, moves, fixed });
  }
}
check('three-base table: all 378 pairs', best.size === 378, `${best.size}`);
const rows = [];
for (const X of CORNER_LETTERS) for (const Y of CORNER_LETTERS) {
  const r = X !== Y && best.get(X + Y);
  if (!r) continue;
  const [bx, by] = r.f.pair.split('');
  rows.push({
    first: X, second: Y, base: r.f.text, baseNo: r.f.i, setup: r.S.tokens.join(' '), setupMoves: r.n,
    notation: r.notation, moves: r.moves, length: expandBrackets(r.notation).split(' ').length,
    // the stickers V, X, Y are carried onto the base's three stickers; `via` says which three, in cycle order from V
    onto: [r.S.p[V], r.S.p[CSPOT[X]], r.S.p[CSPOT[Y]]].map((i) => CLET[i]).join(''),
    bufferFixed: r.fixed,
  });
}
const byN = [0, 1, 2, 3].map((n) => rows.filter((r) => r.setupMoves === n).length);
const byBase = FORMS.map((f) => rows.filter((r) => r.baseNo === f.i).length);
log(`rows ${rows.length}; by setup moves 0/1/2/3: ${byN.join('/')}; by base: ${byBase.join('/')}; setup moves the buffer sticker: ${rows.filter((r) => !r.bufferFixed).length}`);
const CROWS = Object.fromEntries(rows.map((r) => [r.first + r.second, r]));

// ---- checks on the table
for (const r of rows) {
  const p = permOfText(r.moves);
  const moved = ID.filter((i) => p[i] !== i);
  const ok =
    p[V] === CSPOT[r.first] && p[CSPOT[r.first]] === CSPOT[r.second] && p[CSPOT[r.second]] === V &&
    moved.length === 9 && moved.every((i) => ntype(i) === 3) && r.moves === cancelMoves(expandBrackets(r.notation));
  check(`pair ${r.first}${r.second} solves (V -> X -> Y -> V, nothing else)`, ok, r.notation);
  // the setup carries V, X, Y onto the base's stickers in cycle order (starting anywhere)
  const f = FORMS[r.baseNo];
  const S = seqPerm(r.setup ? r.setup.split(' ') : []);
  const a = S[V];
  const b = S[CSPOT[r.first]];
  const c = S[CSPOT[r.second]];
  check(`pair ${r.first}${r.second}: setup carries V, X, Y onto the base's cycle in order`, f.p[a] === b && f.p[b] === c && f.p[c] === a, r.notation);
}
check('three-base table: setup counts 6/54/208/110', byN.join('/') === '6/54/208/110', byN.join('/'));
check('three-base table: moves 8 to 14', Math.min(...rows.map((r) => r.moves.split(' ').length)) === 8 && Math.max(...rows.map((r) => r.moves.split(' ').length)) <= 14);
log('checks on the table done');

// ---- examples helpers (as on the Heise page)
const pieces = (state) => {
  const by = new Map();
  for (const s of state) (by.get(s.p.join()) ?? by.set(s.p.join(), []).get(s.p.join())).push(s);
  return [...by.values()].map((ss) => ({ pos: ss[0].p, kind: ss.length, colours: ss.map((s) => s.colour).sort().join(''), home: ss.every((s) => faceOf(s.n) === s.colour) }));
};
const nice = (c) => [...c].sort((a, b) => 'UDFBRL'.indexOf(a) - 'UDFBRL'.indexOf(b)).join('');
const COLOURS = ['pink', 'blue', '#7c3aed'];
const posName = (letter) => pieceName(SOLVED[CSPOT[letter]].p);

// ---- the three bases on a solved cube (picture cards)
const baseCards = FORMS.slice(0, 3).map((f, k) => {
  const [a, b] = f.text.slice(1, -1).split(', ');
  const alg = f.moves;
  const after = applyAlg(solvedCube(), alg);
  const bad = pieces(after).filter((x) => !x.home);
  check(`base ${f.text}: three corners move, nothing else`, bad.length === 3 && bad.every((x) => x.kind === 3));
  const [, X, Y] = f.stickers;
  const cyc = `the sticker at V goes to ${X}, the one at ${X} goes to ${Y}, the one at ${Y} goes to V`;
  const where = `the ${posName('V')} corner goes to ${posName(X)}, the ${posName(X)} corner to ${posName(Y)}, and the ${posName(Y)} corner to ${posName('V')}`;
  return {
    anchor: `base-${k + 1}`, name: `Base ${k + 1}: ${f.text}`, orientation: `Buffer cycle: V → ${X} → ${Y}`, displayAlg: f.text, noViewer: true,
    filmstrip: {
      alg, fromSolved: true, stickering: 'full', views: ['U', 'D'],
      marks: bad.map((x, i) => ({ piece: x.colours, colour: COLOURS[i] })),
      legend: bad.map((x, i) => ({ colour: COLOURS[i], text: `${nice(x.colours)} corner` })),
      frames: [
        { after: '', label: 'Solved', caption: 'The three corners this base moves are outlined.' },
        { after: a.replace(/ /g, ' '), label: a, caption: 'The insertion (or the single turn, in the reverse form).' },
        { after: b, label: b, caption: 'The other part.' },
        { after: invertAlg(a), label: `${a} undone`, caption: 'The first part undone.' },
        { after: invertAlg(b), label: `${b} undone`, caption: `The second part undone. On a solved cube: ${cyc}; that is ${where}.` },
      ],
    },
    moves: alg,
  };
});
// frames must follow the moves in order: check a, b, a', b' tokens against the algorithm
for (const c of baseCards) {
  const joined = c.filmstrip.frames.map((f) => f.after).join(' ').replace(/\s+/g, ' ').trim();
  check(`${c.name}: frames follow the moves`, joined === c.filmstrip.alg, joined);
}

// ---- search helpers for scrambles and exercises
let seed = 20261021;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (xs) => xs[Math.floor(rnd() * xs.length)];
const stepOf = (r) => ({ kind: 'corner pair', ...r });
function solveCorners(state) {
  const cc = cornerCycles(state);
  const steps = cc.pairs.filter((p) => p.second).map((p) => stepOf(CROWS[p.first + p.second]));
  return { cc, steps, solvable: !cc.parity && !cc.twisted.length };
}
const solutionText = (steps) => steps.map((s) => s.notation).join(' ');
const plain = (steps) => cancelMoves(expandBrackets(solutionText(steps)));
function find(predicate, makeText) {
  for (let i = 0; i < 50000; i++) {
    const scramble = cancelMoves(invertAlg(expandBrackets(makeText())));
    const state = scrambledState(scramble);
    const solved = solveCorners(state);
    if (solved.solvable && predicate(solved.cc)) return { scramble, state, ...solved };
  }
  throw new Error('no scramble found');
}
const randomPairs = (k, filter = () => true) => Array.from({ length: k }, () => pick(rows.filter(filter)).notation).join(' ');

// a 3-cycle that leaves the buffer alone (for "buffer already home")
const freeCycles = [];
for (const S of setups.filter((s) => s.tokens.length <= 2)) for (const f of FORMS) {
  if (S.inv[f.p[S.p[V]]] === V) freeCycles.push(S.tokens.length ? `[${S.tokens.join(' ')}: ${f.text}]` : f.text);
}
check('cycles that leave the buffer alone exist', freeCycles.length > 0);

const exercises = [
  { n: 1, skill: 'A base on its own', pred: (cc) => cc.letters.length === 2 && !cc.letters[0].cycleBreak, make: () => randomPairs(1, (r) => r.setupMoves === 0) },
  { n: 2, skill: 'One setup move', pred: (cc) => cc.letters.length === 2 && !cc.letters[0].cycleBreak, make: () => randomPairs(1, (r) => r.setupMoves === 1) },
  { n: 3, skill: 'Two setup moves', pred: (cc) => cc.letters.length === 2 && !cc.letters[0].cycleBreak, make: () => randomPairs(1, (r) => r.setupMoves === 2) },
  { n: 4, skill: 'Three setup moves', pred: (cc) => cc.letters.length === 2 && !cc.letters[0].cycleBreak, make: () => randomPairs(1, (r) => r.setupMoves === 3) },
  { n: 5, skill: 'One cycle, two pairs', pred: (cc) => cc.letters.length === 4 && !cc.letters.some((l) => l.cycleBreak), make: () => randomPairs(2) },
  { n: 6, skill: 'Cycle closes early', pred: (cc) => cc.letters.length === 6 && cc.letters.findIndex((l) => l.cycleBreak) === 2, make: () => randomPairs(3) },
  { n: 7, skill: 'Buffer already home', pred: (cc) => cc.letters[0]?.cycleBreak, make: () => pick(freeCycles) },
].map((e) => ({ n: e.n, skill: e.skill, ...find(e.pred, e.make) }));
exercises.push({ n: 8, skill: 'A full corner memo', ...find((cc) => cc.letters.length >= 8 && cc.letters.length <= 10 && cc.letters.some((l) => l.cycleBreak), () => randomPairs(5)) });
const worked1 = find((cc) => cc.letters.length === 6 && !cc.letters.some((l) => l.cycleBreak), () => randomPairs(3));
const worked2 = find((cc) => cc.letters.length === 4 && cc.letters.some((l) => l.cycleBreak), () => randomPairs(2));
log(`worked 1: ${worked1.scramble}\nworked 2: ${worked2.scramble}`);

// break table for example 2
const defaultBreak = worked2.cc.letters.find((l) => l.cycleBreak).letter;
const breakRows = Object.keys(CSPOT).filter((l) => posOf(CSPOT[l]) === posOf(CSPOT[defaultBreak])).map((letter) => {
  const cc = cornerCycles(worked2.state, { breakLetter: letter });
  const total = cc.pairs.filter((p) => p.second).reduce((s, p) => s + CROWS[p.first + p.second].moves.split(' ').length, 0);
  return { letter, letters: cc.letters.map((l) => (l.cycleBreak ? `${l.letter}*` : l.letter)).join(' '), moves: total };
});
log(`break table: ${breakRows.map((r) => `${r.letter}=${r.moves}`).join(' ')}`);

// every exercise and example: the solution solves the corners
for (const e of [...exercises, { n: 'w1', ...worked1 }, { n: 'w2', ...worked2 }]) {
  const after = applyAlg(e.state, plain(e.steps));
  check(`exercise/example ${e.n} solves the corners`, ID.filter((i) => ntype(i) === 3).every((i) => after[i].p.join() === SOLVED[i].p.join() && after[i].n.join() === SOLVED[i].n.join()), e.scramble);
}

// ---- 2,000 random scrambles with only 3-cycles: the table solves every corner
{
  let s = 99;
  const r = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  let bad = 0;
  let twisted = 0;
  for (let i = 0; i < 2000; i++) {
    const text = Array.from({ length: 1 + Math.floor(r() * 5) }, () => rows[Math.floor(r() * rows.length)].notation).join(' ');
    const state = scrambledState(invertAlg(expandBrackets(text)));
    const solved = solveCorners(state);
    if (!solved.solvable) { twisted++; continue; } // a product of 3-cycles can twist a corner in place: the twists page covers those
    const after = applyAlg(state, plain(solved.steps));
    if (!ID.filter((j) => ntype(j) === 3).every((j) => after[j].p.join() === SOLVED[j].p.join() && after[j].n.join() === SOLVED[j].n.join())) bad++;
  }
  check('2000 random 3-cycle scrambles solved by the three-base table', bad === 0, `${bad} failed`);
  log(`2000 random scrambles: ${2000 - twisted} solved by pairs alone; ${twisted} leave a corner twisted in place (twists page)`);
  check('enough scrambles tested', 2000 - twisted > 1000, `${2000 - twisted}`);
}

// ---- setup demos: one-setup and two-setup rows; after the setup, the three pieces sit on the base's corners
const demos = [1, 2, 3].map((n) => rows.find((r) => r.setupMoves === n && r.bufferFixed) ?? rows.find((r) => r.setupMoves === n));
const demoCards = demos.map((r, k) => {
  const f = FORMS[r.baseNo];
  const body = expandBrackets(f.text);
  const undo = invertAlg(r.setup);
  const alg = `${r.setup} ${body} ${undo}`;
  const startState = caseState(alg);
  const bad = pieces(startState).filter((x) => !x.home);
  check(`demo ${k + 1}: three corners unsolved at the start`, bad.length === 3 && bad.every((x) => x.kind === 3));
  const afterSetup = applyAlg(startState, r.setup);
  // the three pieces (by their colours) now sit on the three corners the base cycles
  const baseCorners = new Set(f.stickers.map((l) => posOf(CSPOT[l])));
  const where = (st, colours) => pieces(st).find((x) => x.kind === 3 && x.colours === colours).pos.join();
  const placed = bad.map((x) => where(afterSetup, x.colours));
  check(`demo ${k + 1}: after the setup the three pieces are on the base's corners`, new Set(placed).size === 3 && placed.every((q) => baseCorners.has(q)), `${placed.join(' ')} vs ${[...baseCorners].join(' ')}`);
  const end = applyAlg(startState, alg);
  check(`demo ${k + 1}: solved at the end`, pieces(end).every((x) => x.home));
  return {
    anchor: `setup-demo-${k + 1}`, name: `${r.first} → ${r.second}: ${n(k + 1)} setup move${k ? 's' : ''}`, orientation: r.notation, displayAlg: r.notation, noViewer: true,
    first: r.first, second: r.second, base: f.text, setup: r.setup, onto: r.onto, bufferFixed: r.bufferFixed,
    filmstrip: {
      alg, stickering: 'full', views: ['U', 'D'],
      marks: bad.map((x, i) => ({ piece: x.colours, colour: COLOURS[i] })),
      legend: bad.map((x, i) => ({ colour: COLOURS[i], text: `${nice(x.colours)} corner` })),
      frames: [
        { after: '', label: 'Start', caption: `The three unsolved corners are outlined. The base ${f.text} cycles the corners at ${[...f.stickers].map((l) => posName(l)).join(', ')}.` },
        { after: r.setup, label: `Setup ${r.setup}`, caption: 'The setup carries the three pieces onto the three corners the base cycles.' },
        { after: body, label: 'Base', caption: 'The base cycles them into place; everything the setup moved is still displaced.' },
        { after: undo, label: 'Undo the setup', caption: 'Undoing the setup puts the rest back. Solved.' },
      ],
    },
  };
});
function n(k) { return ['', 'one', 'two', 'three'][k]; }

const out = {
  forms: FORMS.map((f) => ({ text: f.text, reverse: f.reverse, stickers: f.stickers, pair: f.pair, positions: f.stickers.map(posName) })),
  baseCards,
  demoCards,
  examples: {
    example1: { scramble: worked1.scramble, steps: worked1.steps, letters: worked1.cc.letters },
    example2: { scramble: worked2.scramble, steps: worked2.steps, letters: worked2.cc.letters, breaks: breakRows },
  },
  exercises: exercises.map((e) => ({ n: e.n, skill: e.skill, setup: e.scramble, solution: solutionText(e.steps), solutionMoves: plain(e.steps), letters: e.cc.letters, steps: e.steps })),
};
log(failures.length ? `FAILED (${failures.length}):\n  ${failures.slice(0, 15).join('\n  ')}` : 'ALL OK');
if (WRITE) {
  const file = 'data/corner-bases.js';
  const text = readFileSync(file, 'utf8');
  const a = text.indexOf('// BEGIN GENERATED');
  const b = text.indexOf('// END GENERATED');
  if (a < 0 || b < 0) throw new Error('no GENERATED block in data/corner-bases.js');
  const rowsJs = `export const baseRows = [\n${rows.map((r) => `  ${JSON.stringify(r)},`).join('\n')}\n];\n`;
  const body = `// GENERATED by log/2026-10-21-bld-three-base.mjs --write. Do not edit by hand.\n${rowsJs}export const baseData = ${JSON.stringify(out, null, 2)};\n`;
  writeFileSync(file, `${text.slice(0, a)}// BEGIN GENERATED\n${body}${text.slice(b)}`);
  log(`wrote ${file}`);
}
process.exitCode = failures.length ? 1 : 0;
