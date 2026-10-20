// Generates the tables for the Blindfolded "Corner cycles" and "Edge cycles"
// tabs and checks them by simulation (docs/bld-corner-cycles-plan.md section 6,
// docs/bld-edge-cycles-plan.md section 5). Run from the repository root:
//
//   node log/2026-10-16-bld-cycles-generate.mjs           checks only; prints ALL OK
//   node log/2026-10-16-bld-cycles-generate.mjs --write   also rewrites the GENERATED
//                                                         block of each data file
//
// Candidates are found on sticker permutations (54 stickers, composed as arrays),
// not by running moves on the cube for each candidate. The checks at the end use
// the cube simulator (js/cube-sim.js) and the shipped memo (js/bld-memo.js).
import { readFileSync, writeFileSync } from 'node:fs';
import { applyAlg, solvedCube, faceOf, isSolved } from '../js/cube-sim.js';
import { cancelMoves, expandBrackets, invertAlg, invertMove } from '../js/algs.js';
import { bldCorners, bldEdges, BLD_CORNER_SWAP } from '../data/bld.js';
import { cornerCycles, cornerOrientation, edgeCycles, pieceName, scrambledState } from '../js/bld-memo.js';

const WRITE = process.argv.includes('--write');
const log = (...a) => console.log(...a);
const failures = [];
const check = (name, ok, detail = '') => {
  if (!ok) failures.push(detail ? `${name}: ${detail}` : name);
};

// ---------- stickers, spots and permutations ----------
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
const ESPOT = Object.fromEntries(bldEdges.map((r) => [r.letter, spotOf(r.piece)]));
const CLET = Object.fromEntries(Object.entries(CSPOT).map(([l, i]) => [i, l]));
const ELET = Object.fromEntries(Object.entries(ESPOT).map(([l, i]) => [i, l]));
const ntype = (i) => SOLVED[i].p.filter((v) => v !== 0).length; // 3 corner, 2 edge, 1 centre
const posOf = (i) => SOLVED[i].p.join();
const posVec = (p) => p.split(',').map(Number);
const comp = (X, Y) => X.map((j) => Y[j]); // do X, then Y
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

// ---------- move sets ----------
const FACES = ['U', 'D', 'R', 'L', 'F', 'B'];
const AMOUNTS = ['', "'", '2'];
const AXIS = { U: 'y', D: 'y', E: 'y', R: 'x', L: 'x', M: 'x', F: 'z', B: 'z', S: 'z' };
const FACE_ORDER = FACES;
const EDGE_ORDER = ['U', 'D', 'R', 'L', 'F', 'B', 'M', 'E', 'S'];
const turnsOf = (faces) => faces.flatMap((f) => AMOUNTS.map((a) => f + a));
const CORNER_TURNS = turnsOf(FACES);
const EDGE_TURNS = turnsOf(EDGE_ORDER);
// Tie-break rank of a setup: its turns in the order given, each amount U, U', U2.
const rankOf = (tokens, order) =>
  tokens.map((t) => String(order.indexOf(t[0]) * 3 + AMOUNTS.indexOf(t.slice(1))).padStart(2, '0')).join('');

// Reduced sequences: no two neighbouring turns on the same face or slice.
function sequences(turns, maxLen) {
  const out = [[]];
  let frontier = [[]];
  for (let len = 1; len <= maxLen; len++) {
    frontier = frontier.flatMap((seq) => turns.filter((t) => !seq.length || seq.at(-1)[0] !== t[0]).map((t) => [...seq, t]));
    out.push(...frontier);
  }
  return out;
}
const setupLevels = (turns, order, maxLen) => {
  const seqs = sequences(turns, maxLen).map((tokens) => ({ tokens, p: seqPerm(tokens), inv: null, rank: rankOf(tokens, order) }));
  for (const s of seqs) s.inv = inv(s.p);
  return Array.from({ length: maxLen + 1 }, (_, n) => seqs.filter((s) => s.tokens.length === n));
};

// ---------- commutators ----------
// An insertion is one turn, or X Y X' with X and Y on different axes.
function insertions(turns) {
  const singles = turns.map((t) => ({ text: t, tokens: [t] }));
  const triples = turns.flatMap((x) =>
    turns.filter((y) => AXIS[y[0]] !== AXIS[x[0]]).map((y) => ({ text: `${x} ${y} ${invertMove(x)}`, tokens: [x, y, invertMove(x)] })),
  );
  return [...singles, ...triples];
}

// Exactly 9 corner stickers (or 6 edge stickers) move, in three pieces, each
// moving all of its stickers to one other piece, the three forming one cycle.
// Nothing else moves, centres included.
function isThreeCycle(p, type) {
  const moved = ID.filter((i) => p[i] !== i);
  if (moved.length !== 3 * type || moved.some((i) => ntype(i) !== type)) return false;
  const pieces = [...new Set(moved.map(posOf))];
  if (pieces.length !== 3) return false;
  const map = new Map();
  for (const piece of pieces) {
    const own = moved.filter((i) => posOf(i) === piece);
    const dest = new Set(own.map((i) => posOf(p[i])));
    if (own.length !== type || dest.size !== 1) return false;
    map.set(piece, [...dest][0]);
  }
  const [a] = pieces;
  const b = map.get(a);
  const c = map.get(b);
  return b !== a && c !== a && pieces.includes(b) && pieces.includes(c) && map.get(c) === a;
}

// Every pure 3-cycle commutator [X, Y] and [Y, X] with X an insertion and Y a turn.
function commutators(turns, type) {
  const ins = insertions(turns).map((x) => ({ ...x, p: seqPerm(x.tokens) }));
  const ints = turns.map((t) => ({ text: t, tokens: [t], p: movePerm(t) }));
  const out = [];
  for (const A of ins) {
    for (const B of ints) {
      for (const [X, Y] of [[A, B], [B, A]]) {
        const p = comp(comp(comp(X.p, Y.p), inv(X.p)), inv(Y.p));
        if (isThreeCycle(p, type)) out.push({ X, Y, p });
      }
    }
  }
  return out;
}

// ---------- the pair table ----------
// For each ordered pair (X, Y) of letters on different pieces: the commutator,
// possibly with a setup, that sends the buffer's sticker C to X, X's to Y, and
// Y's back to C. Setups are tried by level (0, 1, 2, 3 moves). Within a level:
// shortest after cancelling; then a setup that leaves the buffer's stickers
// alone; then the setup order from the plan.
function pairTable(comms, levels, type) {
  const BUF = type === 3 ? CSPOT.V : ESPOT.C;
  const BUF_SPOTS = type === 3 ? [CSPOT.V, CSPOT.K, CSPOT.P] : [ESPOT.C, ESPOT.I];
  const LET = type === 3 ? CLET : ELET;
  const found = new Map();
  for (const setups of levels) {
    const best = new Map();
    for (const S of setups) {
      for (const c of comms) {
        // The commutator conjugated by the setup: do S, C, then undo S.
        const conj = (i) => S.inv[c.p[S.p[i]]];
        const X = conj(BUF);
        if (BUF_SPOTS.includes(X)) continue;
        const Y = conj(X);
        if (BUF_SPOTS.includes(Y) || conj(Y) !== BUF) continue;
        const key = LET[X] + LET[Y];
        if (found.has(key)) continue;
        const body = `[${c.X.text}, ${c.Y.text}]`;
        const notation = S.tokens.length ? `[${S.tokens.join(' ')}: ${body}]` : body;
        const moves = cancelMoves(expandBrackets(notation));
        const score = [moves ? moves.split(' ').length : 0, BUF_SPOTS.some((i) => S.p[i] !== i) ? 1 : 0, S.rank].join('|');
        const old = best.get(key);
        if (!old || score < old.score) {
          best.set(key, {
            setup: S.tokens.join(' '),
            setupMoves: S.tokens.length,
            // The bare commutator and the pair it solves: what the setup turns this pair into
            // (empty when the setup moves the buffer, so the commutator does not use it).
            comm: body,
            inner: S.p[BUF] !== BUF || c.p[BUF] === BUF ? '' : LET[c.p[BUF]] + LET[c.p[c.p[BUF]]],
            notation,
            moves,
            length: expandBrackets(notation).split(' ').length,
            score,
          });
        }
      }
    }
    for (const [key, rec] of best) found.set(key, rec);
  }
  return found;
}
const rowsFrom = (found, letters) => {
  const rows = [];
  for (const X of letters) for (const Y of letters) {
    const rec = X !== Y && found.get(X + Y);
    if (!rec) continue;
    const row = { first: X, second: Y, setup: rec.setup, setupMoves: rec.setupMoves, notation: rec.notation, moves: rec.moves, length: rec.length };
    if (rec.setupMoves) Object.assign(row, rec.inner ? { comm: rec.comm, inner: rec.inner } : { comm: rec.comm });
    rows.push(row);
  }
  return rows;
};

// ---------- corner tables ----------
const CORNER_LETTERS = Object.keys(CSPOT).filter((l) => !['V', 'K', 'P'].includes(l));
const EDGE_LETTERS = Object.keys(ESPOT).filter((l) => !['C', 'I'].includes(l));

log('corner commutators…');
const cornerComms = commutators(CORNER_TURNS, 3);
log(`  ${cornerComms.length} pure corner 3-cycle commutators`);
const cornerFound = pairTable(cornerComms, setupLevels(CORNER_TURNS, FACE_ORDER, 3), 3);
const cornerRows = rowsFrom(cornerFound, CORNER_LETTERS);
const cornerBySetup = [0, 1, 2, 3].map((n) => cornerRows.filter((r) => r.setupMoves === n).length);
log(`  ${cornerRows.length} of 378 pairs; by setup moves 0/1/2/3: ${cornerBySetup.join(' / ')}`);
check('corner pairs: 378', cornerRows.length === 378, `${cornerRows.length}`);
const CORNER_PAIR = Object.fromEntries(cornerRows.map((r) => [r.first + r.second, r]));

// Corner twists: a pure twist of the buffer DFR and one other corner, with the
// two directions (7 corners x 2 = 14 rows). Pure = nothing moves but the twist.
const TWIST_INSERTIONS = [
  { text: "(R' D' R D)×2", tokens: "R' D' R D R' D' R D".split(' ') },
  { text: "(D' R' D R)×2", tokens: "D' R' D R D' R' D R".split(' ') },
];
function cornerTwistRows() {
  const bases = [...insertions(CORNER_TURNS), ...TWIST_INSERTIONS].map((x) => ({ ...x, p: seqPerm(x.tokens) }));
  const turns = CORNER_TURNS.map((t) => ({ text: t, tokens: [t], p: movePerm(t) }));
  const setups = setupLevels(CORNER_TURNS, FACE_ORDER, 2).flat();
  const DFR = posOf(CSPOT.V);
  const wanted = new Map();
  for (const A of bases) {
    for (const B of turns) {
      for (const [X, Y] of [[A, B], [B, A]]) {
        const base = comp(comp(comp(X.p, Y.p), inv(X.p)), inv(Y.p));
        const body = `[${X.text}, ${Y.text}]`;
        for (const S of setups) {
          const p = comp(comp(S.p, base), S.inv);
          if (!ID.every((i) => (ntype(i) === 3 ? posOf(p[i]) === posOf(i) : p[i] === i))) continue;
          const Q = inv(p);
          const after = SOLVED.map((t, f) => ({ p: t.p, n: t.n, colour: faceOf(SOLVED[Q[f]].n) }));
          const twisted = [...new Set(SOLVED.filter((t) => ntype(SOLVED.indexOf(t)) === 3).map((t) => posOf(SOLVED.indexOf(t))))]
            .map((c) => [c, cornerOrientation(after, posVec(c))])
            .filter(([, o]) => o);
          if (twisted.length !== 2 || !twisted.some(([c]) => c === DFR)) continue;
          const [[c1, o1], [c2, o2]] = twisted;
          if (o1 + o2 !== 0) continue;
          const [K, oK, oU] = c1 === DFR ? [c2, o2, o1] : [c1, o1, o2];
          const notation = S.tokens.length ? `[${S.tokens.join(' ')}: ${body}]` : body;
          const moves = cancelMoves(expandBrackets(notation));
          const name = pieceName(posVec(K));
          const bDir = oU === 1 ? 'clockwise' : 'anticlockwise';
          const kDir = oK === 1 ? 'clockwise' : 'anticlockwise';
          const id = `${name}|${bDir}|${kDir}`;
          const score = [moves.split(' ').length, S.rank].join('|');
          const old = wanted.get(id);
          if (!old || score < old.score) {
            wanted.set(id, { corner: name, buffer: bDir, twisted: kDir, setup: S.tokens.join(' '), notation, moves, length: expandBrackets(notation).split(' ').length, score });
          }
        }
      }
    }
  }
  return wanted;
}
log('corner twists…');
const cornerTwists = [...cornerTwistRows().values()].map(({ score, ...row }) => row);
log(`  ${cornerTwists.length} rows`);
check('corner twists: 14 rows', cornerTwists.length === 14, `${cornerTwists.length}`);

// Parity: the Old Pochmann corner swap (data/bld.js) swaps UBL and DFR (sticker E <-> V)
// and two edges. With the DFR buffer, the last unpaired corner letter Z is brought to
// the sticker E by a U, L, B setup (these leave DFR alone); then the swap; then the
// setup undone. Which two edges swap too depends on the setup.
const PARITY = BLD_CORNER_SWAP;
const PARITY_TARGET = 'E';
const parityTokens = PARITY.split(' ');
const parityPerm = seqPerm(parityTokens);
const PARITY_FIXED = new Set([posOf(CSPOT.V)]); // DFR
const paritySetups = setupLevels(CORNER_TURNS.filter((t) => 'ULB'.includes(t[0])), FACE_ORDER, 3).flat();
const cornerParity = CORNER_LETTERS.map((Z) => {
  let best = null;
  for (const S of paritySetups) {
    if (S.p[CSPOT[Z]] !== CSPOT[PARITY_TARGET]) continue;
    if (ID.some((i) => PARITY_FIXED.has(posOf(i)) && S.p[i] !== i)) continue;
    const score = `${S.tokens.length}|${S.rank}`;
    if (!best || score < best.score) best = { score, tokens: S.tokens };
  }
  const setup = best.tokens.join(' ');
  const notation = setup ? `[${setup}: ${PARITY}]` : PARITY;
  return { letter: Z, setup, setupMoves: best.tokens.length, notation, moves: cancelMoves(expandBrackets(notation)), length: expandBrackets(notation).split(' ').length };
});
log(`parity setups: ${cornerParity.map((r) => r.setupMoves).join(' ')}`);
const CORNER_PARITY = Object.fromEntries(cornerParity.map((r) => [r.letter, r]));

// ---------- edge tables ----------
log('edge commutators…');
const edgeComms = commutators(EDGE_TURNS, 2);
log(`  ${edgeComms.length} pure edge 3-cycle commutators`);
const edgeFound = pairTable(edgeComms, setupLevels(EDGE_TURNS, EDGE_ORDER, 1), 2);
const edgeRows = rowsFrom(edgeFound, EDGE_LETTERS);
log(`  ${edgeRows.length} of 440 pairs; by setup moves 0/1: ${[0, 1].map((n) => edgeRows.filter((r) => r.setupMoves === n).length).join(' / ')}`);
check('edge pairs: 440', edgeRows.length === 440, `${edgeRows.length}`);
const EDGE_PAIR = Object.fromEntries(edgeRows.map((r) => [r.first + r.second, r]));

// Flips: a face-turn setup that brings the edge to UB and leaves UF alone, then the flip.
const FLIP = "M' U M' U M' U2 M U M U M U2";
const flipSetups = setupLevels(CORNER_TURNS, FACE_ORDER, 3).flat();
const EDGE_PIECES = [...new Set(bldEdges.map((r) => pieceName(posVec(posOf(ESPOT[r.letter])))))];
const edgeFlipRows = EDGE_PIECES.filter((piece) => piece !== 'UF').map((piece) => {
  const first = bldEdges.find((r) => pieceName(posVec(posOf(ESPOT[r.letter]))) === piece).letter;
  let best = null;
  for (const S of flipSetups) {
    if (S.p[ESPOT.C] !== ESPOT.C || S.p[ESPOT.I] !== ESPOT.I) continue;
    if (posOf(S.p[ESPOT[first]]) !== posOf(ESPOT.A)) continue;
    const score = `${S.tokens.length}|${S.rank}`;
    if (!best || score < best.score) best = { score, tokens: S.tokens };
  }
  const setup = best.tokens.join(' ');
  const notation = `[${setup}: ${FLIP}]`;
  return { edge: piece, setup, setupMoves: best.tokens.length, notation, moves: cancelMoves(expandBrackets(notation)), length: expandBrackets(notation).split(' ').length };
});
log(`flip rows: ${edgeFlipRows.length}`);
check('edge flips: 11 rows', edgeFlipRows.length === 11, `${edgeFlipRows.length}`);
const FLIP_ROW = Object.fromEntries(edgeFlipRows.map((r) => [r.edge, r]));

// ---------- solving a scramble (the way the tabs teach it) ----------
const TWIST = Object.fromEntries(cornerTwists.map((r) => [`${r.corner}|${r.buffer}|${r.twisted}`, r]));
const opposite = (d) => (d === 'clockwise' ? 'anticlockwise' : 'clockwise');
// Corner steps, then edge steps (even edge counts only), then the corner parity
// step, then the corner twists.
function solveSteps(state) {
  const cc = cornerCycles(state);
  const ec = edgeCycles(state);
  const corner = [];
  for (const p of cc.pairs.filter((x) => x.second)) corner.push({ kind: 'corner pair', ...CORNER_PAIR[p.first + p.second] });
  const parity = cc.pairs.find((x) => !x.second);
  const twists = cc.twisted.filter((t) => t.piece !== 'DFR').map((t) => ({ kind: 'corner twist', ...TWIST[`${t.piece}|${t.direction}|${opposite(t.direction)}`] }));
  const edge = [];
  for (const p of ec.pairs) edge.push({ kind: 'edge pair', ...EDGE_PAIR[p.first + p.second] });
  for (const e of ec.flipped.filter((e) => e !== 'UF')) edge.push({ kind: 'edge flip', ...FLIP_ROW[e] });
  const steps = [...corner, ...edge, ...(parity ? [{ kind: 'corner parity', ...CORNER_PARITY[parity.first] }] : []), ...twists];
  return { cc, ec, steps, cornerSteps: [...corner, ...(parity ? [{ kind: 'corner parity', ...CORNER_PARITY[parity.first] }] : []), ...twists] };
}
// Edge steps for a scramble with an even number of edge letters: pairs, then flips
// of the non-buffer edges (the buffer's flip is undone by them).
function edgeSteps(state) {
  const ec = edgeCycles(state);
  const steps = [];
  for (const p of ec.pairs) steps.push({ kind: 'edge pair', ...EDGE_PAIR[p.first + p.second] });
  for (const e of ec.flipped.filter((e) => e !== 'UF')) steps.push({ kind: 'edge flip', ...FLIP_ROW[e] });
  return { ec, steps };
}
const textOf = (steps) => steps.map((s) => s.notation).join(' ');
const plainOf = (steps) => cancelMoves(expandBrackets(textOf(steps)));

// ---------- random, seeded so the exercises stay the same between runs ----------
let seed = 20261016;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (xs) => xs[Math.floor(rnd() * xs.length)];
const randomFaceScramble = (n) => Array.from({ length: n }, () => pick(FACES) + pick(AMOUNTS)).join(' ');

// A scramble is the inverse of a random sequence of pairs and twists, so it is a
// corners-only scramble made of face turns.
function findScramble(predicate, makeText, solver = solveSteps) {
  for (let i = 0; i < 50000; i++) {
    const text = makeText();
    const scramble = invertAlg(expandBrackets(text));
    const state = scrambledState(scramble);
    const solved = solver(state);
    if (predicate(solved.cc ?? solved.ec)) return { scramble, state, ...solved };
  }
  throw new Error(`no scramble found for: ${makeText.toString()}`);
}
const freeComms = cornerComms.filter((c) => c.p[CSPOT.V] === CSPOT.V);
const randomPairText = (k) => Array.from({ length: k }, () => pick(cornerRows).notation).join(' ');
const twistRow = (corner, buffer, twisted) => cornerTwists.find((r) => r.corner === corner && r.buffer === buffer && r.twisted === twisted);
const pairOf = (...names) => names;
void pairOf;

const ex = (n, skill, predicate, makeText) => ({ n, skill, ...findScramble(predicate, makeText) });
const EXERCISES = [
  ex(1, 'One pair, direct', (cc) => cc.letters.length === 2 && !cc.letters[0].cycleBreak && !cc.twisted.length && !cc.parity,
    () => pick(cornerRows.filter((r) => r.setupMoves === 0)).notation),
  ex(2, 'One pair, one setup move', (cc) => cc.letters.length === 2 && !cc.letters[0].cycleBreak && !cc.twisted.length,
    () => pick(cornerRows.filter((r) => r.setupMoves === 1)).notation),
  ex(3, 'One cycle, two pairs', (cc) => cc.letters.length === 4 && !cc.letters.some((l) => l.cycleBreak) && !cc.twisted.length && !cc.parity,
    () => randomPairText(2)),
  ex(4, 'Cycle closes early', (cc) => cc.letters.length === 6 && cc.letters.findIndex((l) => l.cycleBreak) === 2 && !cc.twisted.length,
    () => randomPairText(3)),
  ex(5, 'Buffer already home', (cc) => cc.letters[0]?.cycleBreak && !cc.twisted.length,
    () => {
      // A corner 3-cycle that does not touch the buffer: the buffer is home, so the first letter is a break.
      const c = pick(freeComms);
      return `[${c.X.text}, ${c.Y.text}]`;
    }),
  ex(6, 'Twisted pair', (cc) => cc.letters.length === 2 && cc.twisted.length === 2 && cc.twisted.every((t) => t.piece !== 'DFR'),
    () => {
      const K1 = pick(['DFL', 'DBL', 'DBR', 'UFR', 'UBR', 'UFL', 'UBL']);
      const K2 = pick(['DFL', 'DBL', 'DBR', 'UFR', 'UBR', 'UFL', 'UBL'].filter((k) => k !== K1));
      return [randomPairText(1), twistRow(K1, 'clockwise', 'anticlockwise').notation, twistRow(K2, 'anticlockwise', 'clockwise').notation].join(' ');
    }),
  ex(7, 'Odd letters', (cc) => cc.letters.length === 3 && !cc.twisted.length, () => {
    // One pair and one corner parity fix: an odd number of letters.
    const z = pick(CORNER_LETTERS);
    return `${pick(cornerRows).notation} ${CORNER_PARITY[z].notation}`;
  }),
];
// Exercise 8 is a real random scramble (face turns, any corner state), 8 to 10 letters and a break.
const ex8 = (() => {
  for (let i = 0; i < 50000; i++) {
    const scramble = randomFaceScramble(25);
    const state = scrambledState(scramble);
    const solved = solveSteps(state);
    if (solved.cc.letters.length >= 8 && solved.cc.letters.length <= 10 && solved.cc.letters.some((l) => l.cycleBreak)) {
      return { n: 8, skill: 'A full corner memo', scramble, state, ...solved };
    }
  }
  throw new Error('no exercise 8');
})();
EXERCISES.push(ex8);
// The exercise 7 pair must be the one from its scramble; keep the scramble itself as the setup.

// Worked examples: a three-pair scramble with no break, and a two-pair scramble with a break.
const worked1 = findScramble((cc) => cc.letters.length === 6 && !cc.letters.some((l) => l.cycleBreak) && !cc.twisted.length, () => randomPairText(3));
const worked2 = findScramble((cc) => cc.letters.length === 4 && cc.letters.some((l) => l.cycleBreak) && !cc.twisted.length && !cc.parity, () => randomPairText(2));
log(`worked example 1 scramble: ${worked1.scramble}`);
log(`worked example 2 scramble: ${worked2.scramble}`);

// Break table for worked example 2: the break can start from any sticker of
// the corner the default memo starts from; the total is the pairs' moves.
const defaultBreak = worked2.cc.letters.find((l) => l.cycleBreak).letter;
const breakPos = posOf(CSPOT[defaultBreak]);
const breakRows = Object.keys(CSPOT)
  .filter((l) => posOf(CSPOT[l]) === breakPos)
  .map((letter) => {
    const cc = cornerCycles(worked2.state, { breakLetter: letter });
    const total = cc.pairs.filter((p) => p.second).reduce((sum, p) => sum + CORNER_PAIR[p.first + p.second].moves.split(' ').length, 0);
    return { letter, letters: cc.letters.map((l) => (l.cycleBreak ? `${l.letter}*` : l.letter)).join(' '), moves: total };
  });
log(`break table: ${breakRows.map((r) => `${r.letter}=${r.moves}`).join(' ')}`);

// ---------- edge exercises and worked example (even edge counts only) ----------
const freeEdgeComms = edgeComms.filter((c) => c.p[ESPOT.C] === ESPOT.C);
const edgeRandomPairText = (k) => Array.from({ length: k }, () => pick(edgeRows).notation).join(' ');
const edgeFlipText = (n) => {
  const pieces = edgeFlipRows.map((r) => r.edge);
  return Array.from({ length: n }, () => FLIP_ROW[pick(pieces)].notation).join(' ');
};
const edgeEx = (n, skill, predicate, makeText) => ({ n, skill, ...findScramble(predicate, makeText, edgeSteps) });
// The odd-count method for edges is open (see the E9 note); these exercises
// use the even-count steps only.
const edgeSpecs = [
  edgeEx(1, 'One pair, direct', (ec) => ec.letters.length === 2 && !ec.letters[0].cycleBreak && !ec.flipped.length,
    () => pick(edgeRows.filter((r) => r.setupMoves === 0 && r.moves.split(' ').length === 8)).notation),
  edgeEx(2, 'The four-move kind', (ec) => ec.letters.length === 2 && !ec.letters[0].cycleBreak && !ec.flipped.length,
    () => pick(edgeRows.filter((r) => r.moves.split(' ').length === 4)).notation),
  edgeEx(3, 'One pair, one setup move', (ec) => ec.letters.length === 2 && !ec.letters[0].cycleBreak && !ec.flipped.length,
    () => pick(edgeRows.filter((r) => r.setupMoves === 1)).notation),
  edgeEx(4, 'One cycle, two pairs', (ec) => ec.letters.length === 4 && !ec.letters.some((l) => l.cycleBreak) && !ec.flipped.length,
    () => edgeRandomPairText(2)),
  edgeEx(5, 'Cycle closes early', (ec) => ec.letters.length === 6 && ec.letters.findIndex((l) => l.cycleBreak) === 2 && !ec.flipped.length,
    () => edgeRandomPairText(3)),
  edgeEx(6, 'Buffer already home', (ec) => ec.letters[0]?.cycleBreak && !ec.flipped.length,
    () => {
      const c = pick(freeEdgeComms);
      return `[${c.X.text}, ${c.Y.text}]`;
    }),
  edgeEx(7, 'Flipped pair', (ec) => ec.letters.length === 2 && ec.flipped.length === 2 && ec.flipped.includes('UF') === false,
    () => `${edgeRandomPairText(1)} ${edgeFlipText(2)}`),
];
const EDGE_EXERCISES = [...edgeSpecs];
// Exercise 9: a real random scramble, edges only, an even number of 10-12 letters with a break.
const edgeEx9 = (() => {
  for (let i = 0; i < 50000; i++) {
    const scramble = randomFaceScramble(25);
    const state = scrambledState(scramble);
    const { ec, steps } = edgeSteps(state);
    if (ec.letters.length >= 10 && ec.letters.length <= 12 && ec.letters.length % 2 === 0 && ec.letters.some((l) => l.cycleBreak)) {
      return { n: 9, skill: 'A full edge memo', scramble, state, ec, steps };
    }
  }
  throw new Error('no exercise 9');
})();
EDGE_EXERCISES.push(edgeEx9);
const edgeWorked = findScramble((ec) => ec.letters.length === 6 && !ec.letters.some((l) => l.cycleBreak) && !ec.flipped.length, () => edgeRandomPairText(3), edgeSteps);
log(`edge worked example scramble: ${edgeWorked.scramble}`);
// Break table for an edge worked example with a break.
const edgeBreakWorked = findScramble((ec) => ec.letters.length === 4 && ec.letters.some((l) => l.cycleBreak) && !ec.flipped.length, () => edgeRandomPairText(2), edgeSteps);
const edgeBreakDefault = edgeBreakWorked.ec.letters.find((l) => l.cycleBreak).letter;
const edgeBreakPos = posOf(ESPOT[edgeBreakDefault]);
const edgeBreakRows = Object.keys(ESPOT)
  .filter((l) => posOf(ESPOT[l]) === edgeBreakPos)
  .map((letter) => {
    const ec = edgeCycles(edgeBreakWorked.state, { breakLetter: letter });
    const total = ec.pairs.filter((p) => p.second).reduce((sum, p) => sum + EDGE_PAIR[p.first + p.second].moves.split(' ').length, 0);
    return { letter, letters: ec.letters.map((l) => (l.cycleBreak ? `${l.letter}*` : l.letter)).join(' '), moves: total };
  });
log(`edge break table: ${edgeBreakRows.map((r) => `${r.letter}=${r.moves}`).join(' ')}`);

// ---------- checks ----------
// 1. Each pair: its moves put C -> X -> Y -> C on the corner stickers and touch
// nothing else; the notation expands to the stored moves.
for (const [rows, type, SP] of [
  [cornerRows, 3, CSPOT],
  [edgeRows, 2, ESPOT],
]) {
  const BUF = SP === CSPOT ? CSPOT.V : ESPOT.C;
  for (const r of rows) {
    const p = seqPerm(r.moves.split(' '));
    const moved = ID.filter((i) => p[i] !== i);
    const ok =
      p[BUF] === SP[r.first] && p[SP[r.first]] === SP[r.second] && p[SP[r.second]] === BUF &&
      moved.length === 3 * type && moved.every((i) => ntype(i) === type) &&
      r.moves === cancelMoves(expandBrackets(r.notation));
    check(`pair ${r.first}${r.second}`, ok, r.notation);
  }
}
// 2. Setup rows: the bare commutator solves the inner pair (buffer -> inner[0] -> inner[1]),
// and the setup carries the pair's two stickers onto the inner pair's two stickers.
for (const r of cornerRows.filter((x) => x.inner)) {
  const c = seqPerm(expandBrackets(r.comm).split(' '));
  const S = seqPerm(r.setup.split(' '));
  const [i0, i1] = [CSPOT[r.inner[0]], CSPOT[r.inner[1]]];
  const ok = c[CSPOT.V] === i0 && c[i0] === i1 && S[CSPOT[r.first]] === i0 && S[CSPOT[r.second]] === i1;
  check(`setup row ${r.first}${r.second} inner pair`, ok, `${r.setup} ${r.comm} ${r.inner}`);
}
log('check 1: pairs; check 2: setup rows');

// 3. Twist rows: DFR and K twisted in the stated directions; every other
// corner untwisted; positions and edges unchanged.
for (const r of cornerTwists) {
  const after = applyAlg(SOLVED, r.moves);
  const edgesHome = ID.every((i) => ntype(i) !== 2 || (after[i].p.join() === SOLVED[i].p.join() && after[i].n.join() === SOLVED[i].n.join()));
  const want = new Map([
    ['DFR', r.buffer === 'clockwise' ? 1 : -1],
    [r.corner, r.twisted === 'clockwise' ? 1 : -1],
  ]);
  const cornersOk = [...new Set(bldCorners.map((x) => posOf(CSPOT[x.letter])))].every((p) => {
    const name = pieceName(posVec(p));
    return cornerOrientation(after, posVec(p)) === (want.get(name) ?? 0);
  });
  check(`twist ${r.corner} ${r.buffer}/${r.twisted}`, cornersOk && edgesHome, r.notation);
}
log('check 3: twists');

// 4. Parity setups: setup + swap + undo swaps the sticker Z with the buffer sticker V,
// moves no other corners but the two swapped, and swaps exactly two edges.
for (const r of cornerParity) {
  const S = seqPerm(r.setup ? r.setup.split(' ') : []);
  const net = comp(comp(S, parityPerm), inv(S));
  const cornerMoved = ID.filter((i) => ntype(i) === 3 && net[i] !== i);
  const zCorner = posOf(CSPOT[r.letter]);
  const edgesMoved = new Set(ID.filter((i) => ntype(i) === 2 && net[i] !== i).map(posOf));
  const ok =
    net[CSPOT[r.letter]] === CSPOT.V && net[CSPOT.V] === CSPOT[r.letter] &&
    cornerMoved.every((i) => [posOf(CSPOT.V), zCorner].includes(posOf(i))) &&
    edgesMoved.size === 2 && ID.every((i) => ntype(i) !== 1 || net[i] === i);
  check(`parity ${r.letter}`, ok, r.notation);
}
log('check 4: parity setups');

// 5. The swap algorithm swaps UBL<->DFR (E<->V, A<->P, R<->K) and the UL and UB edges, nothing else.
const parityMoved = ID.filter((i) => parityPerm[i] !== i);
check('parity algorithm: E<->V', parityPerm[CSPOT.E] === CSPOT.V && parityPerm[CSPOT.V] === CSPOT.E);
check('parity algorithm: only UBL, DFR, UL, UB move', parityMoved.every((i) => [posOf(CSPOT.A), posOf(CSPOT.V), posOf(ESPOT.A), posOf(ESPOT.D)].includes(posOf(i))), `${parityMoved.length}`);
log('check 5: parity algorithm');

// 6. Flip rows: the edges' positions are unchanged, and exactly UF and K are flipped.
const edgeOrientAt = (state, p) => {
  if (p[1] !== 0) {
    const s = state.find((t) => t.p.join() === p.join() && (t.colour === 'U' || t.colour === 'D'));
    return s.n[1] !== 0 ? 0 : 1;
  }
  const s = state.find((t) => t.p.join() === p.join() && (t.colour === 'F' || t.colour === 'B'));
  return s.n[2] !== 0 ? 0 : 1;
};
const EDGE_POSITIONS = [...new Set(bldEdges.map((r) => posOf(ESPOT[r.letter])))].map(posVec);
for (const r of edgeFlipRows) {
  const after = applyAlg(SOLVED, r.moves);
  const sameColours = EDGE_POSITIONS.every((p) => {
    const colours = (state) => state.filter((t) => t.p.join() === p.join()).map((t) => t.colour).sort().join();
    return colours(after) === colours(SOLVED);
  });
  const flipped = EDGE_POSITIONS.filter((p) => edgeOrientAt(after, p) === 1).map((p) => pieceName(p)).sort().join(' ');
  const want = ['UF', r.edge].sort().join(' ');
  check(`flip ${r.edge}`, sameColours && flipped === want, `flipped: ${flipped}`);
}
log('check 6: flips');

// 7. Exercises: the solution solves the scramble's corners; the memo has the
// structure the exercise is for (checked when chosen).
for (const e of EXERCISES) {
  const after = applyAlg(e.state, plainOf(e.cornerSteps));
  const cornersSolved = ID.filter((i) => ntype(i) === 3).every((i) => after[i].p.join() === SOLVED[i].p.join() && after[i].n.join() === SOLVED[i].n.join());
  check(`exercise ${e.n} solves its corners`, cornersSolved, e.scramble);
}
// 7b. Edge exercises: the solution solves the scramble's edges (even counts only).
for (const e of EDGE_EXERCISES) {
  const after = applyAlg(e.state, plainOf(e.steps));
  const edgesSolved = ID.filter((i) => ntype(i) === 2).every((i) => after[i].p.join() === SOLVED[i].p.join() && after[i].n.join() === SOLVED[i].n.join());
  check(`edge exercise ${e.n} solves its edges`, edgesSolved, e.scramble);
}
log('check 7: exercises');

// 8. 2,000 random scrambles: corner steps solve every corner.
seed = 42;
let oddCount = 0;
for (let i = 0; i < 2000; i++) {
  const scramble = randomFaceScramble(20);
  const state = scrambledState(scramble);
  const { cornerSteps, cc } = solveSteps(state);
  const after = applyAlg(state, plainOf(cornerSteps));
  const solved = ID.filter((j) => ntype(j) === 3).every((j) => after[j].p.join() === SOLVED[j].p.join() && after[j].n.join() === SOLVED[j].n.join());
  if (!solved) {
    check('check 8: random corners', false, scramble);
    break;
  }
  if (cc.parity) oddCount++;
}
log(`check 8: 2000 random scrambles (${oddCount} odd)`);

// E9. 1,000 random scrambles: the whole cube is solved by the two tabs' steps.
seed = 7;
// Even scrambles: the whole cube is solved by the tabs' steps (all of them).
// Odd scrambles: OPEN, see the note below; counted and reported, not checked.
let evenFails = 0;
let oddTotal = 0;
let oddSolved = 0;
for (let i = 0; i < 1000; i++) {
  const scramble = randomFaceScramble(25);
  const state = scrambledState(scramble);
  const { steps, cc } = solveSteps(state);
  const solved = isSolved(applyAlg(state, plainOf(steps)));
  if (!cc.parity) {
    if (!solved) {
      evenFails++;
      if (evenFails === 1) check('check E9: even scramble full solve', false, scramble);
    }
  } else {
    oddTotal++;
    if (solved) oddSolved++;
  }
}
log(`check E9: even scrambles fully solved: ${1000 - oddTotal - evenFails}/${1000 - oddTotal}`);
log(`OPEN odd edge method: ${oddSolved}/${oddTotal} odd scrambles fully solved (the edge side of an odd count is not on the page; corners are checked by check 8)`);
let edgeFullFails = 0;
for (let i = 0; i < 1000; i++) {
  const scramble = randomFaceScramble(25);
  const state = scrambledState(scramble);
  const { ec, steps } = edgeSteps(state);
  if (ec.parity) continue;
  const after = applyAlg(state, plainOf(steps));
  const edgesHome = ID.filter((j) => ntype(j) === 2).every((j) => after[j].p.join() === SOLVED[j].p.join() && after[j].n.join() === SOLVED[j].n.join());
  if (!edgesHome) edgeFullFails++;
}
log(`check E7 (even edge scrambles, edges solved): ${edgeFullFails} failures`);

// 10. Helpers (js/algs.js): the bracket, repeat and cancel rules.
const unit = [
  [expandBrackets("[U: [R U R', D]]"), "U R U R' D R U' R' D' U'"],
  [expandBrackets("(R' D' R D)×2").split(' ').length, 8],
  [cancelMoves('R R'), 'R2'],
  [cancelMoves("R R'"), ''],
  [cancelMoves('U2 U'), "U'"],
];
for (const [got, want] of unit) check(`helper unit case: ${got}`, got === want, `want ${want}`);
log('check 10: helpers');

// ---------- output ----------
const BLOCK_NOTE = 'GENERATED by log/2026-10-16-bld-cycles-generate.mjs --write. Do not edit by hand.';
const rowsJs = (name, rows) => `export const ${name} = [\n${rows.map((r) => `  ${JSON.stringify(r)},`).join('\n')}\n];\n`;
const objJs = (name, value) => `export const ${name} = ${JSON.stringify(value, null, 2)};\n`;
const cornerBlock = [
  `// ${BLOCK_NOTE}`,
  rowsJs('cornerComms', cornerRows),
  rowsJs('cornerTwists', cornerTwists),
  rowsJs('cornerParity', cornerParity),
  objJs(
    'cornerExamples',
    {
      example1: { scramble: worked1.scramble, steps: worked1.cornerSteps, letters: worked1.cc.letters },
      example2: {
        scramble: worked2.scramble,
        steps: worked2.cornerSteps,
        letters: worked2.cc.letters,
        breaks: breakRows,
      },
    },
  ),
  objJs(
    'cornerExercises',
    EXERCISES.map((e) => ({
      n: e.n,
      skill: e.skill,
      setup: e.scramble,
      solution: textOf(e.cornerSteps),
      solutionMoves: plainOf(e.cornerSteps),
      letters: e.cc.letters,
      steps: e.cornerSteps,
    })),
  ),
].join('\n');
const edgeBlock = [
  `// ${BLOCK_NOTE}`,
  rowsJs('edgeComms', edgeRows),
  rowsJs('edgeFlips', edgeFlipRows),
  objJs('edgeExamples', {
    example1: { scramble: edgeWorked.scramble, steps: edgeWorked.steps, letters: edgeWorked.ec.letters },
    example2: { scramble: edgeBreakWorked.scramble, steps: edgeBreakWorked.steps, letters: edgeBreakWorked.ec.letters, breaks: edgeBreakRows },
  }),
  objJs(
    'edgeExercises',
    EDGE_EXERCISES.map((e) => ({ n: e.n, skill: e.skill, setup: e.scramble, solution: textOf(e.steps), solutionMoves: plainOf(e.steps), letters: e.ec.letters, steps: e.steps })),
  ),
].join('\n');

function writeBlock(file, body) {
  const text = readFileSync(file, 'utf8');
  const start = text.indexOf('// BEGIN GENERATED');
  const end = text.indexOf('// END GENERATED');
  if (start < 0 || end < 0) throw new Error(`${file}: no GENERATED block`);
  writeFileSync(file, `${text.slice(0, start)}// BEGIN GENERATED\n${body}\n${text.slice(end)}`);
  log(`wrote ${file}`);
}
if (WRITE) {
  writeBlock('data/corner-cycles.js', cornerBlock);
  writeBlock('data/edge-cycles.js', edgeBlock);
}

log(failures.length ? `FAILED (${failures.length}):\n  ${failures.slice(0, 20).join('\n  ')}` : 'ALL OK');
process.exitCode = failures.length ? 1 : 0;
