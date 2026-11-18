// Four helpers (B, D, F, K) in Blind drills (Tracing and Small solves): the corner plan for a scrambled cube with the
// picking rule (data/pair-rule.js), and a scramble engine that builds corner pairs of the chosen kinds (levels 0/1/2,
// exception pairs), with parity and twisted corners on, off or sometimes, plus the usual number of unsolved edges.
//
// Plan (same as the whole solves checked by log/2026-11-18-pair-rule.mjs): memo from C, letters in pairs; a pair in the
// table uses its commutator (the shorter `best` for an exception pair); a pair that is not in the table (two stickers
// of one corner, which happens after a cycle break into a twisted corner) is done letter by letter the plain Orozco way;
// an odd last letter is done the plain Orozco way, then the Ra-perm.
//
// Scramble: made backwards. Pick the pairs on different corners (not the buffer's), undo them with another table's
// commutator for the same pair (3-Style page or Dylan's) so the scramble does not spell the answer; for parity add one
// more letter (plain Orozco, then the Ra-perm); for twists add a pure two-corner twist on two other corners; then edge
// 3-cycles and flips until the edge count is right. Every scramble is checked on the simulated cube: the memo starts
// with exactly the chosen pairs, parity and twists are as asked, the edge count is right, and the plan (M2 edges, then
// these corners) solves it. Checked under Node by log/2026-11-18-four-helper-drill-check.mjs.
import { applyAlg } from './cube-sim.js';
import { invertAlg, cancelMoves, expandBrackets } from './algs.js';
import { cornerMemoFrom, scrambledState, bldPlan } from './bld-memo.js';
import { unsolvedCounts } from './bld-drill.js?v=4';
import { DRILL_PIECES } from '../data/drill-pieces.js';
import { pairRule } from '../data/pair-rule.js?v=2';
import { orozcoCorners, OROZCO_TWIST, OROZCO_TWIST_REV, OROZCO_HELPER_RULES } from '../data/orozco-corners.js?v=1';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js?v=4';
import { threeStyleOurs } from '../data/three-style-ours.js';
import { threeStyleCorners } from '../data/three-style-corners.js';
import { BLD_PARITY } from '../data/bld.js';

const RULE = Object.fromEntries(pairRule.map((r) => [r.pair, r]));
const OZ = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r]));
const OZH = Object.fromEntries(OROZCO_HELPER_RULES.map((r) => [r.letter, r]));
const OZT = { twist: OROZCO_TWIST, 'twist-rev': OROZCO_TWIST_REV };
const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const piece = (l) => [...SPEFFZ[l]].sort().join('');
const pick = (xs, rnd) => xs[Math.floor(rnd() * xs.length)];
const key = (s) => `${s.p.join()}|${s.n.join()}`;

export const KINDS = ['0', '1', '2', 'x']; // levels 0, 1, 2 and the exception pairs
export const DEFAULT_FOUR = { kinds: ['1', '2'], pairs: 2, twists: 'never' };
export const MAX_PAIRS = 5;

// The pairs that match the ticked kinds (a pair counts if its level is ticked, or it is an exception and those are ticked).
export const fourPool = (kinds) => pairRule.filter((r) => kinds.includes(String(r.level)) || (kinds.includes('x') && r.exception));

// The commutator shown for a pair: the rule's, or `best` for an exception (as seen after the rotation, and as held).
export function pairAnswer(r) {
  const a = r.exception && r.best ? r.best : r;
  return { pair: r.pair, level: r.level, exception: !!r.exception, helper: a.helper, rotation: a.rotation, rotationBack: a.rotationBack,
    notationSeen: a.notationSeen, notation: a.notation, moves: a.moves, count: a.count, ruleNotationSeen: r.exception ? r.notationSeen : null };
}

// One letter the plain Orozco way (helper B): 1st of a pair forwards, 2nd backwards; B, N, Q by the helper rules.
function plainOrozco(letter, first) {
  const h = OZH[letter];
  if (h) {
    const how = first ? h.odd : h.even;
    return { letter, how: `orozco-${how}`, notation: how === 'skip' ? '' : OZT[how], moves: how === 'skip' ? '' : expandBrackets(OZT[how]) };
  }
  return first
    ? { letter, how: 'orozco-forwards', notation: OZ[letter].notation, moves: OZ[letter].moves }
    : { letter, how: 'orozco-backwards', notation: `${OZ[letter].notation}′`, moves: invertAlg(OZ[letter].moves) };
}

// { targets, steps: [{ kind: 'pair' | 'letters' | 'odd', letters, ... }], parity, parityAlg, moves }
export function fourHelperPlan(state) {
  const targets = cornerMemoFrom(state, 'C');
  const t = targets.map((x) => x.letter);
  const steps = [];
  for (let i = 0; i < t.length; i += 2) {
    if (i === t.length - 1) { steps.push({ kind: 'odd', letters: t[i], ...plainOrozco(t[i], true) }); break; }
    const r = RULE[t[i] + t[i + 1]];
    if (r) steps.push({ kind: 'pair', letters: r.pair, ...pairAnswer(r) });
    else {
      const a = plainOrozco(t[i], true), b = plainOrozco(t[i + 1], false);
      steps.push({ kind: 'letters', letters: t[i] + t[i + 1], parts: [a, b], moves: [a.moves, b.moves].filter(Boolean).join(' ') });
    }
  }
  const parity = t.length % 2 === 1;
  const moves = [...steps.map((s) => s.moves), parity ? OROZCO_PARITY_RUF : ''].filter(Boolean).join(' ');
  return { targets, steps, parity, parityAlg: OROZCO_PARITY_RUF, moves };
}

// Corners that are in their place but twisted.
export function twistedCorners(state) {
  const by = new Map();
  for (const s of state) {
    const [hp] = s.home.split('|');
    if (hp.split(',').filter((v) => v !== '0').length !== 3) continue;
    if (!by.has(hp)) by.set(hp, []);
    by.get(hp).push(s);
  }
  let n = 0;
  for (const [hp, ss] of by) if (ss.every((s) => s.p.join() === hp) && ss.some((s) => s.home !== key(s))) n++;
  return n;
}

// The whole solve the drill shows: M2 edges (+ edge parity), then the corners with fourHelperPlan.
export function fourHelperSolves(scramble) {
  const bp = bldPlan(scramble);
  const cp = fourHelperPlan(bp.state);
  const all = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : '', cp.moves].filter(Boolean).join(' ');
  return applyAlg(bp.state, all).every((s) => s.home === key(s));
}

const ALT = {};
for (const tbl of [threeStyleOurs, threeStyleCorners]) for (const e of tbl) (ALT[e.pair] ||= []).push(e.moves);

// Pieces in the order the memo starts cycle breaks (the first unsolved piece in letter order) and their lowest letter.
const LETTERS = Object.keys(SPEFFZ);
const PIECES = [...new Set(LETTERS.map(piece))].filter((p) => p !== piece('C'));
const FIRST = Object.fromEntries(PIECES.map((p) => [p, LETTERS.find((l) => piece(l) === p)]));
const STICKERS = Object.fromEntries(PIECES.map((p) => [p, LETTERS.filter((l) => piece(l) === p)]));

// A memo letter sequence of exactly T letters that follows the memo's rules: the buffer's cycle, then cycle breaks, each
// starting at the lowest unsolved piece and ending on a sticker of that piece (another sticker of it and nothing between:
// a corner twisted in place). Twisted-in-place corners only when tw. Null if this try does not reach T.
function sequence(T, tw, rnd) {
  let free = [...PIECES];
  const take = (p) => { free = free.filter((x) => x !== p); };
  const seq = [];
  const k = Math.floor(rnd() * (Math.min(7, T) + 1));
  for (let i = 0; i < k; i++) { const p = pick(free, rnd); take(p); seq.push(pick(STICKERS[p], rnd)); }
  let twisted = false;
  while (seq.length < T) {
    const left = T - seq.length;
    if (left < 2 || !free.length) return null;
    const start = pick(free, rnd);
    free = free.filter((x) => PIECES.indexOf(x) > PIECES.indexOf(start)); // lower pieces stay solved
    const maxM = Math.min(free.length, left - 2);
    if (maxM < 1 && !tw) return null;
    const m = tw && (rnd() < 0.4 || maxM === 0) ? 0 : 1 + Math.floor(rnd() * maxM);
    if (m === 0 && !tw) return null;
    seq.push(FIRST[start]);
    for (let i = 0; i < m; i++) { const p = pick(free, rnd); take(p); seq.push(pick(STICKERS[p], rnd)); }
    const ends = m === 0 ? STICKERS[start].filter((l) => l !== FIRST[start]) : STICKERS[start];
    seq.push(pick(ends, rnd));
    if (m === 0) twisted = true;
  }
  return seq.length === T && twisted === tw ? seq : null;
}

// { scramble, pairs, parity, twists } or throws. pairs = letter pairs in the corner memo (a twisted corner's two letters
// count too). parity / twists: 'any' (about half the time), 'always', 'never'.
export function fourHelperScramble({ kinds = DEFAULT_FOUR.kinds, pairs = 2, edges = 0, parity = 'any', twists = 'never', rnd = Math.random, budgetMs = 150, maxMs = 2500 } = {}) {
  const pool = new Set(fourPool(kinds).map((r) => r.pair));
  if (!pool.size) throw new Error('Tick at least one kind of pair.');
  if (pairs < 1 || pairs > MAX_PAIRS) throw new Error(`Choose 1 to ${MAX_PAIRS} pairs.`);
  if (edges === 1 || edges > 12) throw new Error('Edges: 0 or 2 to 12.');
  if (parity === 'always' && edges < 2) throw new Error('Parity needs at least 2 edges unsolved (the parity swaps two edges).');
  const t0 = Date.now();
  let best = null, memoOk = 0;
  for (let tries = 0; tries < 200000; tries++) {
    if (Date.now() - t0 >= maxMs || (best && Date.now() - t0 >= budgetMs)) break;
    const odd = parity === 'always' || (parity === 'any' && edges >= 2 && rnd() < 0.5);
    const tw = twists === 'always' || (twists === 'any' && rnd() < 0.5);
    const seq = sequence(2 * pairs + (odd ? 1 : 0), tw, rnd);
    if (!seq) continue;
    // every pair of two corners must be of a ticked kind (two stickers of one corner: a twist, done letter by letter)
    let fits = true;
    for (let i = 0; i + 1 < seq.length; i += 2) if (piece(seq[i]) !== piece(seq[i + 1]) && !pool.has(seq[i] + seq[i + 1])) { fits = false; break; }
    if (!fits) continue;
    memoOk++;
    const s = build(seq, edges, odd, tw, rnd);
    if (s && (!best || s.length < best.length)) best = s;
  }
  if (!best && !memoOk) throw new Error(`No solve has ${pairs} corner ${pairs === 1 ? 'pair' : 'pairs'} all of the ticked kinds${twists === 'always' ? ' with a twisted corner' : ''} (for example, the exception pairs use only 5 corners, and level 2 letters only 6). Choose fewer pairs or tick more kinds.`);
  if (!best) throw new Error('Could not make that scramble; try again or change the settings.');
  return best;
}

// The scramble for a memo sequence: undo the solve (pairs with another table's commutator, a twist's two letters plain
// Orozco, an odd last letter plain Orozco + Ra), add edge pieces, then check everything on the simulated cube.
function build(seq, edges, odd, tw, rnd) {
  const undo = [];
  for (let i = 0; i < seq.length; i += 2) {
    if (i === seq.length - 1) { undo.push(plainOrozco(seq[i], true).moves, OROZCO_PARITY_RUF); break; }
    const p = seq[i] + seq[i + 1];
    if (RULE[p]) undo.push(pick(ALT[p] || [RULE[p].moves], rnd));
    else undo.push(plainOrozco(seq[i], true).moves, plainOrozco(seq[i + 1], false).moves);
  }
  let moves = cancelMoves(undo.filter(Boolean).join(' '));
  const edgeCount = (m) => unsolvedCounts(scrambledState(invertAlg(m))).edges;
  for (let i = 0; i < edges + 3; i++) {
    const c = edgeCount(moves);
    if (c === edges && (c === 0 || rnd() < 0.7)) break;
    moves = cancelMoves(`${moves} ${pick(rnd() < 0.85 ? DRILL_PIECES.edge3 : DRILL_PIECES.flip2, rnd)}`);
  }
  const scramble = cancelMoves(invertAlg(moves));
  if (!scramble) return null;
  const state = scrambledState(scramble);
  const got = unsolvedCounts(state);
  if (got.edges !== edges || got.centres) return null;
  const memo = cornerMemoFrom(state, 'C').map((t) => t.letter);
  if (memo.join('') !== seq.join('')) return null;
  if ((twistedCorners(state) > 0) !== tw) return null;
  if (!fourHelperSolves(scramble)) return null;
  const pairs = [];
  for (let i = 0; i + 1 < seq.length; i += 2) pairs.push(seq[i] + seq[i + 1]);
  return { scramble, length: scramble.split(' ').length, pairs, parity: odd, twists: tw };
}
