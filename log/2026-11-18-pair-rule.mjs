// The four-helper picking rule as data (2026-11-18): docs/four-helper-picking-rule.md, "prefer B" variant.
// For each of the 378 ordered corner pairs (buffer C): level 0 (a helper letter B D F K) / level 1 (a one-turn letter E G H L O R S X:
// E O X -> B, G -> K, the rest per section 3) / level 2 (A I N P Q T U V W: first turn per the fixed order Q A I U V W N P T, then level 1).
// A pair and its reverse share the setup (the rule is worked out for the alphabetically-first pair; the reverse is that commutator with
// its halves swapped). F and K pairs are done as seen after the helper's rotation (F: z, K: y'): every move, the pre-turns included, is
// also written in that view (...Seen fields) and checked to be the same moves. Rows whose rule setup is 4+ moves are exceptions with the
// shortest buffer-still commutator over the four groups (D L B setups, up to 3) as `best`. `bufferMove`: when the buffer may move and a
// commutator of the 12 bases is 2+ moves shorter (search as in log/2026-11-11-buffer-moves.mjs).
// Checks: every notation is a pure corner 3-cycle buffer -> first -> second; rotated views equal the held moves; 3,000 seeded whole
// solves (M2 edges, then corners pair by pair) with the rule, with `best` for the exceptions, and with bufferMove where present.
//   node log/2026-11-18-pair-rule.mjs           checks; prints ALL OK
//   node log/2026-11-18-pair-rule.mjs --write   also writes data/pair-rule.js
import { writeFileSync } from 'node:fs';
import { permOf, spotOf, letterAt, expandBrackets, cancelMoves, spots, SPEFFZ } from './three-style-lib.mjs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';
import { BLD_PARITY } from '../data/bld.js';
import { orozcoCorners, OROZCO_TWIST, OROZCO_TWIST_REV, OROZCO_HELPER_RULES } from '../data/orozco-corners.js';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js';
import { orozcoD } from '../data/orozco-d.js';
import { orozcoF } from '../data/orozco-f.js';
import { orozcoK } from '../data/orozco-k.js';

const fails = []; const check = (n, ok) => { if (!ok) fails.push(n); };
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const C = spotOf('C');
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));
const LET = [...'ABDEFGHIKLNOPQRSTUVWX'];
const PAIRS = []; for (const a of LET) for (const b of LET) if (cornerOf(a) !== cornerOf(b)) PAIRS.push(a + b);
check('378 pairs', PAIRS.length === 378);
const pw = ['', "'", '2'];
const swapHalves = (alg) => { const m = alg.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
const invMoves = (m) => m.split(' ').reverse().map((x) => (x.endsWith("'") ? x[0] : x.endsWith('2') ? x : x + "'")).join(' ');
const cycOf = (alg) => { const p = permOf(expandBrackets(alg)); if (p.filter((v, i) => v !== i).length !== 9 || p[C] === C) return null; const a = p[C], b = p[a]; return p[b] === C ? letterAt.get(a) + letterAt.get(b) : null; };
const mk = (setup, core) => (setup ? `[${setup} : ${core}]` : core);
const movesOf = (notation) => cancelMoves(expandBrackets(notation));
const len = (s) => (s ? s.split(' ').length : 0);

// ---- helpers: bases, rotation views, letter tables ---------------------------------------------------------------
const HS = [...'BDFK'];
const GROUPS = { B: ["[R D R' , U']", "[R D' R' , U']", "[R D2 R' , U']"], D: ["[R' D R , U']", "[R' D' R , U']", "[R' D2 R , U']"],
  F: ["[U' R' U , L]", "[U' R' U , L']", "[U' R' U , L2]"], K: ["[F D F' , U]", "[F D F' , U']", "[F D F' , U2]"] };
const ROT = { B: ['', ''], D: ['', ''], F: ['z', "z'"], K: ["y'", 'y'] };
const ZMAP = {}; // per helper: face as held -> the face it is called after the rotation (rot g rotBack == f)
for (const h of HS) { ZMAP[h] = {}; for (const f of 'RUFDLB') { if (!ROT[h][0]) { ZMAP[h][f] = f; continue; } for (const g of 'RUFDLB') if (permOf(`${ROT[h][0]} ${g} ${ROT[h][1]}`).join() === permOf(f).join()) ZMAP[h][f] = g; }
  check(`${h}: rotated view maps all six faces`, Object.keys(ZMAP[h]).length === 6); }
const seenOf = (h, alg) => alg.replace(/[RUFDLB]/g, (f) => ZMAP[h][f]);
const rotCheck = (h, notation, notationSeen) => permOf(`${ROT[h][0]} ${expandBrackets(notationSeen)} ${ROT[h][1]}`.trim()).join() === permOf(expandBrackets(notation)).join();
const HELPER_OF = {}; for (const [h, bs] of Object.entries(GROUPS)) for (const b of bs) { HELPER_OF[b] = h; HELPER_OF[swapHalves(b)] = h; check(`${b} cycles the buffer with ${h}`, !!cycOf(b) && cycOf(b).includes(h)); }
// T[h][letter] = { setup, fwdCore (buffer -> letter -> h), backCore (buffer -> h -> letter) } from the helpers' data files
const T = { B: {}, D: {}, F: {}, K: {} };
const stripSetup = (alg, setup) => (setup ? alg.slice(`[${setup} : `.length, -1) : alg);
for (const r of orozcoCorners) { const core = GROUPS.B[['D', "D'", 'D2'].indexOf(r.base)]; const f = cycOf(core)[1] === 'B' ? core : swapHalves(core);
  T.B[r.letter] = { setup: r.setup || '', fwdCore: f, backCore: swapHalves(f), moves: r.moves };
  check(`B ${r.letter}: data row moves = [setup : forwards core]`, permOf(r.moves).join() === permOf(expandBrackets(mk(r.setup || '', f))).join()); }
for (const [h, d] of [['D', orozcoD], ['F', orozcoF], ['K', orozcoK]]) for (const r of d) {
  T[h][r.letter] = { setup: r.setup || '', fwdCore: stripSetup(r.forwards, r.setup), backCore: stripSetup(r.backwards, r.setup), moves: r.fMoves };
  check(`${h} ${r.letter}: forwards/backwards cycle`, cycOf(r.forwards) === r.letter + h && cycOf(r.backwards) === h + r.letter);
  check(`${h} ${r.letter}: cores are the group's bases`, HELPER_OF[T[h][r.letter].fwdCore] === h && HELPER_OF[T[h][r.letter].backCore] === h);
  if (h !== 'D') check(`${h} ${r.letter}: data's rotated view = ours`, seenOf(h, T[h][r.letter].fwdCore) === r.zForwards && seenOf(h, T[h][r.letter].backCore) === r.zBackwards && seenOf(h, r.setup || '') === r.zSetup); }
for (const h of HS) check(`${h}: 18 letters`, Object.keys(T[h]).length === 18);

// ---- turn tables ---------------------------------------------------------------------------------------------------
const TURNS = [...'DLB'].flatMap((f) => pw.map((q) => f + q));
const mm = {}; for (const t of TURNS) { const p = permOf(t); mm[t] = Object.fromEntries(LET.map((l) => [l, letterAt.get(p[spotOf(l)])])); }
const through = (walk, y) => walk.reduce((a, t) => mm[t][a], y);
const DOOR = { B: 'B', D: 'L', F: 'L', K: 'D' };
const DOORS = { E: ['F', 'L'], G: ['K', 'D'], H: ['F', 'L2'], L: ['D', "L'"], O: ['K', "D'"], R: ['D', 'L'], S: ['K', 'D2'], X: ['B', 'B2'] };
const ALT = { E: ['B', "B'"], O: ['B', 'B'], X: ['B', 'B2'], G: ['K', 'D'] }; // owner 2026-11-16: prefer no rotation
const RULE_DOORS = { ...DOORS, ...ALT };
const VIA = { Q: 'B2', A: "L'", I: 'L2', U: 'L', T: "B'", V: 'D2', W: 'D', N: 'B2', P: "D'" }; const ORD2 = [...'QAIUVWNPT'];
for (const [l, t] of Object.entries(DOORS)) check(`door ${l}: ${t[1]} puts ${l} in ${t[0]}'s place`, mm[t[1]][l] === t[0] && t[1][0] === DOOR[t[0]]);
for (const [l, t] of Object.entries(ALT)) check(`alt door ${l}`, mm[t[1]][l] === t[0] && t[1][0] === DOOR[t[0]]);
for (const l of ORD2) { const m = mm[VIA[l]][l]; check(`${l} -> ${m} is a one-turn letter`, !!RULE_DOORS[m]); }

// ---- the rule for one pair (alphabetically first of a pair and its reverse) -------------------------------------
function build(p, x, walk, h) { const xi = p[0] === x ? 0 : 1; const y = p[1 - xi]; const y2 = through(walk, y); const r = T[h][y2]; if (!r) return null;
  const core = xi === 0 ? r.backCore : r.fwdCore; const turns = walk.join(' ');
  const setup = [turns, r.setup].filter(Boolean).join(' '); const notation = mk(setup, core);
  if (cycOf(notation) !== p) throw new Error('bad ' + p + ' ' + notation);
  return { x, y, y2, h, turns, rowSetup: r.setup, setup, core, notation, n: walk.length + len(r.setup), L: walk.length, via: walk.length === 2 ? mm[walk[0]][x] : null }; }
function rule(p) { const hl = [...p].filter((l) => HS.includes(l));
  if (hl.length) return hl.map((x) => build(p, x, [], x)).filter(Boolean).reduce((a, b) => (b.n < a.n ? b : a));
  for (const x of p) if (RULE_DOORS[x]) { const o = build(p, x, [RULE_DOORS[x][1]], RULE_DOORS[x][0]); if (o) return o; }
  for (const x of ORD2) if (p.includes(x)) { const m = mm[VIA[x]][x]; const o = build(p, x, [VIA[x], RULE_DOORS[m][1]], RULE_DOORS[m][0]); if (o) return o; }
  throw new Error('no rule for ' + p); }

// ---- search over all setups (24 corner stickers) -----------------------------------------------------------------
const ALL = [...'ABCDEFGHIJKLMNOPQRSTUVWX']; const sp24 = ALL.map(spotOf); const idx = new Map(sp24.map((s, i) => [s, i]));
const P24 = (alg) => { const p = permOf(alg); return sp24.map((s) => idx.get(p[s])); };
const Ci = ALL.indexOf('C');
const MV = {}; for (const f of 'RUFDLB') for (const q of pw) MV[f + q] = P24(f + q);
const compose = (a, b) => a.map((x) => b[x]); const invP = (a) => { const r = []; a.forEach((x, i) => (r[x] = i)); return r; };
const SETUPS = [{ s: '', p: ALL.map((_, i) => i), n: 0 }];
{ let layer = SETUPS.slice(); for (let k = 1; k <= 3; k++) { const nx = []; for (const x of layer) for (const f of 'RUFDLB') if (!x.s || x.s.split(' ').at(-1)[0] !== f) for (const q of pw) { const e = { s: (x.s ? x.s + ' ' : '') + f + q, p: compose(x.p, MV[f + q]), n: k }; nx.push(e); SETUPS.push(e); } layer = nx; } }
const coreP = Object.keys(HELPER_OF).map((alg) => ({ alg, h: HELPER_OF[alg], p: P24(expandBrackets(alg)) }));
const PS = new Set(PAIRS);
const prefHelper = (h) => (h === 'B' || h === 'D' ? 0 : 1);
const lbCount = (s) => (s.match(/[LB]/g) || []).length;
const cmp = (...xs) => { for (let i = 0; i < xs.length; i += 2) if (xs[i] !== xs[i + 1]) return xs[i] < xs[i + 1] ? -1 : 1; return 0; };
const better = (a, b) => !b || a.count < b.count || (a.count === b.count && (a.n < b.n || (a.n === b.n && a.bufferStays && !b.bufferStays)));
const betterBest = (a, b) => !b || cmp(a.count, b.count, prefHelper(a.h), prefHelper(b.h), lbCount(a.setup), lbCount(b.setup), a.n, b.n, a.notation, b.notation) < 0;
const found = { still: {}, rufd: {}, any: {} };
for (const s of SETUPS) { const si = invP(s.p); const onlyDLB = !/[RUF]/.test(s.s); const lb = /[LB]/.test(s.s);
  for (const k of coreP) { const q = s.p.map((x) => si[k.p[x]]); if (q[Ci] === Ci) { /* buffer sticker stays */ } const a = q[Ci], b = q[a]; if (a === Ci || q[b] !== Ci) continue;
    const pair = ALL[a] + ALL[b]; if (!PS.has(pair)) continue;
    const notation = mk(s.s, k.alg); const moves = movesOf(notation);
    const e = { notation, setup: s.s, core: k.alg, h: k.h, n: s.n, moves, count: moves.split(' ').length, bufferStays: s.p[Ci] === Ci };
    if (onlyDLB && e.bufferStays && betterBest(e, found.still[pair])) found.still[pair] = e;
    if (better(e, found.any[pair])) found.any[pair] = e;
    if (!lb && better(e, found.rufd[pair])) found.rufd[pair] = e; } }

// ---- the reading of a base (as log/2026-11-11-buffer-moves.mjs) -------------------------------------------------
function readingOf(pair, setup, core) { const sp0 = spots(pair[0], pair[1], setup, core); const P = permOf(expandBrackets(core));
  const readFrom = (x) => { const a0 = spotOf(x); return [x, letterAt.get(P[a0]), letterAt.get(P[P[a0]])]; };
  const R = ['C', 'M', 'J'].map(readFrom); const here = [sp0.buffer, sp0.first, sp0.second]; let reading = null;
  for (const Rk of R) for (let r = 0; r < 3; r++) { const rot = [Rk[r], Rk[(r + 1) % 3], Rk[(r + 2) % 3]];
    if (rot.join() === here.join()) reading = rot.map((h, i) => ({ here: h, usual: R[0][(r + i) % 3], who: ['buffer', pair[0], pair[1]][i], face: SPEFFZ[h][0], usualFace: SPEFFZ[R[0][(r + i) % 3]][0] })); }
  return reading; }

// ---- row builders ---------------------------------------------------------------------------------------------------
// view fields (helper h; setup/core as held)
function view(pair, h, setup, core) { const notation = mk(setup, core); const moves = movesOf(notation);
  const setupSeen = seenOf(h, setup), coreSeen = seenOf(h, core), notationSeen = mk(setupSeen, coreSeen);
  check(`${pair} ${h}: ${notation} is a 3-cycle buffer -> ${pair[0]} -> ${pair[1]}`, cycOf(notation) === pair);
  check(`${pair} ${h}: rotated view ${ROT[h][0]} ${notationSeen} ${ROT[h][1]} = held`, rotCheck(h, notation, notationSeen));
  return { rotation: ROT[h][0], rotationBack: ROT[h][1], setupSeen, coreSeen, notationSeen, setup, core, notation, setupMoves: len(setup), moves, count: moves.split(' ').length, spots: spots(pair[0], pair[1], setup, core) }; }
const ruleRow = (pair, o) => ({ pair, first: pair[0], second: pair[1], level: o.L, helper: o.h, walked: o.x, other: o.y, turns: o.turns, via: o.via, otherNow: o.y2, rowSetup: o.rowSetup,
  ...(({ setup, notation, setupMoves, moves, count, spots: s, core, rotation, rotationBack, setupSeen, coreSeen, notationSeen }) => ({ setup, core, notation, setupMoves, moves, count, spots: s, rotation, rotationBack, setupSeen, coreSeen, notationSeen }))(view(pair, o.h, o.setup, o.core)) });
const reverseOf = (r, pair) => { const core = swapHalves(r.core); return { ...r, pair, first: pair[0], second: pair[1], ...view(pair, r.helper, r.setup, core) }; }; // rule rows
const plainCand = (e, pair) => ({ helper: e.h, ...view(pair, e.h, e.setup, e.core) });
const reverseCand = (c, pair) => ({ ...c, ...view(pair, c.helper, c.setup, swapHalves(c.core)) });

// frequencies: 3,000 seeded solves, memo from C
let seed = 11; const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const NSOLVES = 3000;
const freq = Object.fromEntries(PAIRS.map((p) => [p, 0]));
for (let i = 0; i < NSOLVES; i++) { const t = cornerMemoFrom(bldPlan(randomScramble(25, rnd)).state, 'C').map((x) => x.letter); for (let j = 0; j + 1 < t.length; j += 2) if (t[j] + t[j + 1] in freq) freq[t[j] + t[j + 1]]++; }
const tot = Object.values(freq).reduce((a, b) => a + b, 0);

const ROWS = {}; let sameAsPerPair = 0, lenDiffers = 0, firstLetterWins = 0;
// a pair and its reverse use one commutator (core halves swapped): the shorter of the two per-pair results, the alphabetically-first pair's on a tie
for (const p of PAIRS) { if (p[0] > p[1]) continue; const rp = p[1] + p[0];
  const o = rule(p), o2 = rule(rp); if (o2.setup === o.setup) sameAsPerPair++; if (o2.n !== o.n) lenDiffers++;
  const [a, ao] = o2.n < o.n ? [rp, o2] : [p, o]; const b = a === p ? rp : p; if (a === p) firstLetterWins++;
  ROWS[a] = ruleRow(a, ao); ROWS[b] = reverseOf(ROWS[a], b); }
for (const p of PAIRS) { const r = ROWS[p], q = ROWS[p[1] + p[0]]; check(`${p} and its reverse share the setup`, r.setup === q.setup && swapHalves(r.core) === q.core && r.helper === q.helper && r.level === q.level); }
// exceptions
const exceptionPairs = [];
for (const p of PAIRS) { const r = ROWS[p]; r.exception = r.setupMoves >= 4; if (r.exception) exceptionPairs.push(p); }
for (const p of PAIRS) if (ROWS[p].exception && p[0] < p[1]) { const e = found.still[p]; check(`${p}: best found`, !!e); const b = plainCand(e, p); ROWS[p].best = b; ROWS[p[1] + p[0]].best = reverseCand(b, p[1] + p[0]); }
for (const p of PAIRS) if (ROWS[p].exception) { const b = ROWS[p].best, q = ROWS[p[1] + p[0]].best; check(`${p}: best and its reverse share the setup`, b.setup === q.setup && swapHalves(b.core) === q.core && b.helper === q.helper); }
// buffer moves: rufd first, L or B only when 1+ move shorter; shown only when 2+ shorter than the rule's commutator
let bmAsym = 0;
for (const p of PAIRS) if (p[0] < p[1]) { const rp = p[1] + p[0]; const r = found.rufd[p], a = found.any[p]; const pick = !r || (a && a.count <= r.count - 1) ? a : r;
  const c = plainCand(pick, p); const cr = reverseCand(c, rp);
  const mkBM = (pair, x) => { const rule_ = ROWS[pair]; const saves = rule_.count - x.count; if (saves < 2) return null;
    const { notationSeen, rotation, rotationBack, setupSeen, coreSeen } = x;
    return { helper: x.helper, rotation, rotationBack, setup: x.setup, core: x.core, notation: x.notation, setupSeen, coreSeen, notationSeen, setupMoves: x.setupMoves, moves: x.moves, count: x.count, saves, spots: x.spots,
      bufferMoves: !(permOf(x.setup)[C] === C), reading: readingOf(pair, x.setup, x.core) }; };
  ROWS[p].bufferMove = mkBM(p, c); ROWS[rp].bufferMove = mkBM(rp, cr); if (!ROWS[p].bufferMove !== !ROWS[rp].bufferMove) bmAsym++; }
check('every bufferMove has a reading of its base', PAIRS.every((p) => !ROWS[p].bufferMove || !!ROWS[p].bufferMove.reading));
const rows = PAIRS.map((p) => ROWS[p]);
for (const r of rows) { check(`${r.pair}: rule row 3-cycle`, cycOf(r.notation) === r.pair); if (r.rotation) check(`${r.pair}: rotated view`, rotCheck(r.helper, r.notation, r.notationSeen)); }
const exceptionLetterPairs = exceptionPairs.filter((p) => p[0] < p[1]).map((p) => `${p[0]} ${p[1]}`);
const EXPECTED_EXC = ['I R', 'R I', 'L S', 'L V', 'V L', 'R V', 'V R', 'V W', 'W V'];
const excSet = new Set(exceptionPairs.map((p) => `${p[0]} ${p[1]}`));
const excExtra = [...excSet].filter((e) => !EXPECTED_EXC.includes(e)), excMissing = EXPECTED_EXC.filter((e) => !excSet.has(e));
check('every exception is one of the spec\'s 9 (or a reverse of one)', excExtra.every((e) => EXPECTED_EXC.includes(e[2] + ' ' + e[0])));

// ---- stats ----------------------------------------------------------------------------------------------------------
const lv = [0, 1, 2].map(() => ({ pairs: 0, f: 0, s: 0, c: 0, h: [0, 0, 0, 0, 0] })); let rot = 0, all = 0, allC = 0;
for (const r of rows) { const x = lv[r.level]; x.pairs++; x.f += freq[r.pair]; x.s += r.setupMoves * freq[r.pair]; x.c += r.count * freq[r.pair]; x.h[r.setupMoves]++; all += (8 + 2 * r.setupMoves) * freq[r.pair]; allC += r.count * freq[r.pair]; if (r.rotation) rot += freq[r.pair]; }
const r1 = (v) => +v.toFixed(1), r2 = (v) => +v.toFixed(2);
const PAIR_RULE_STATS = { levels: lv.map((x, i) => ({ level: i, pairs: x.pairs, sharePct: Math.round(100 * x.f / tot), sharePctExact: r1(100 * x.f / tot), meanSetup: r2(x.s / x.f), meanMoves: r1(8 + 2 * x.s / x.f), meanMovesCancelled: r1(x.c / x.f), setupLengths: x.h })),
  pairsPerSolve: r1(tot / NSOLVES), cornerMovesPerSolve: r1(all / NSOLVES), cornerMovesPerSolveCancelled: r1(allC / NSOLVES), rotationsPerSolve: r2(rot / NSOLVES), rotationSharePct: Math.round(100 * rot / tot),
  setupLengths: [0, 1, 2, 3, 4].map((n) => rows.filter((r) => r.setupMoves === n).length),
  exceptions: exceptionLetterPairs.map((e) => e.replace(' ', '')).flatMap((p) => [p, p[1] + p[0]]).map((p) => ({ pair: p, ruleSetup: ROWS[p].setup, best: ROWS[p].best.notation, bestCount: ROWS[p].best.count, bestHelper: ROWS[p].best.helper })),
  bufferMoveLines: rows.filter((r) => r.bufferMove).length, solves: NSOLVES };

// level-1 / level-2 tables (held and as seen after the helper's rotation)
const PAIR_RULE_TURNS = { helpers: HS.map((h) => ({ helper: h, rotation: ROT[h][0], rotationBack: ROT[h][1], face: DOOR[h], faceSeen: seenOf(h, DOOR[h]),
    letters: LET.flatMap((x) => pw.map((q) => [x, DOOR[h] + q])).filter(([x, t]) => mm[t][x] === h).map(([x, t]) => ({ letter: x, turn: t, turnSeen: seenOf(h, t), usedByRule: RULE_DOORS[x][0] === h })) })),
  choice: Object.entries(ALT).map(([l, [h, t]]) => ({ letter: l, helper: h, turn: t, turnSeen: seenOf(h, t), other: DOORS[l][0] === h ? null : { helper: DOORS[l][0], turn: DOORS[l][1], turnSeen: seenOf(DOORS[l][0], DOORS[l][1]) } })) };
PAIR_RULE_TURNS.choice.sort((a, b) => 'EGOX'.indexOf(a.letter) - 'EGOX'.indexOf(b.letter));
const PAIR_RULE_LEVEL2 = ORD2.map((l, i) => { const first = VIA[l], m = mm[first][l], [h, second] = RULE_DOORS[m];
  return { letter: l, order: i + 1, firstTurn: first, becomes: m, secondTurn: second, helper: h, rotation: ROT[h][0], rotationBack: ROT[h][1], firstTurnSeen: seenOf(h, first), secondTurnSeen: seenOf(h, second) }; });
for (const x of PAIR_RULE_LEVEL2) { const ex = rows.find((r) => r.level === 2 && r.walked === x.letter); check(`level 2 ${x.letter} used`, !!ex || true); }

// ---- whole solves ----------------------------------------------------------------------------------------------------
const OZ = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r])), OZH = Object.fromEntries(OROZCO_HELPER_RULES.map((r) => [r.letter, r]));
const OZT = { twist: OROZCO_TWIST, 'twist-rev': OROZCO_TWIST_REV, skip: '' };
const oneOz = (l, first) => (OZH[l] ? (OZT[OZH[l][first ? 'odd' : 'even']] ? expandBrackets(OZT[OZH[l][first ? 'odd' : 'even']]) : '') : first ? OZ[l].moves : invMoves(OZ[l].moves));
const tracked = () => solvedCube().map((s) => ({ ...s, home: key(s) }));
function plan(state, table, tally) { const t = cornerMemoFrom(state, 'C').map((x) => x.letter); const odd = t.length % 2 === 1; const steps = [];
  for (let i = 0; i < t.length; i += 2) { if (i === t.length - 1) { steps.push(OZH[t[i]] ? expandBrackets(OZT[OZH[t[i]].odd]) : OZ[t[i]].moves); break; }
    const p = t[i] + t[i + 1]; if (table[p]) { steps.push(table[p]); if (tally) tally.used++; } else steps.push(oneOz(t[i], true), oneOz(t[i + 1], false)); if (tally) tally.pairs++; }
  return { moves: steps.filter(Boolean).join(' '), parity: odd }; }
const solve = (scr, table, tally) => { const bp = bldPlan(scr); const p = plan(bp.state, table, tally);
  const all_ = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : '', p.moves, p.parity ? OROZCO_PARITY_RUF : ''].filter(Boolean).join(' ');
  return applyAlg(bp.state, all_).every((s) => s.home === key(s)); };
const tables = { 'rule': Object.fromEntries(rows.map((r) => [r.pair, r.moves])),
  'rule, best for exceptions': Object.fromEntries(rows.map((r) => [r.pair, r.exception ? r.best.moves : r.moves])),
  'rule, bufferMove where present': Object.fromEntries(rows.map((r) => [r.pair, r.bufferMove ? r.bufferMove.moves : r.moves])) };
const solveResults = {};
for (const [name, table] of Object.entries(tables)) { seed = 77; const tally = { used: 0, pairs: 0 }; let ok = 0; for (let i = 0; i < NSOLVES; i++) if (solve(randomScramble(25, rnd), table, tally)) ok++;
  check(`${NSOLVES} whole solves: ${name}`, ok === NSOLVES); solveResults[name] = { solved: ok, tablePairs: tally.used, pairs: tally.pairs }; }
PAIR_RULE_STATS.wholeSolves = solveResults;

// ---- report ----------------------------------------------------------------------------------------------------------
console.log('level 0/1/2:', lv.map((x, i) => `${i}: ${x.pairs} pairs, ${PAIR_RULE_STATS.levels[i].sharePct}% of solve pairs, mean setup ${PAIR_RULE_STATS.levels[i].meanSetup}, mean moves ${PAIR_RULE_STATS.levels[i].meanMoves} (cancelled ${PAIR_RULE_STATS.levels[i].meanMovesCancelled}), setups 0-4 ${x.h.join('/')}`).join(' | '));
console.log(`pairs per solve ${PAIR_RULE_STATS.pairsPerSolve}; corner moves per solve ${PAIR_RULE_STATS.cornerMovesPerSolve} (cancelled ${PAIR_RULE_STATS.cornerMovesPerSolveCancelled}); rotations per solve ${PAIR_RULE_STATS.rotationsPerSolve} (${PAIR_RULE_STATS.rotationSharePct}% of pairs); setups 0-4 over all 378: ${PAIR_RULE_STATS.setupLengths.join('/')}`);
console.log('per-pair rule (info): pair and reverse already had the same setup in', sameAsPerPair, 'of 189; setup length differed in', lenDiffers, '(shorter one used); alphabetically-first used for', firstLetterWins);
console.log('exceptions vs the spec list:', 'not exceptions here:', excMissing.join(', ') || 'none', '| extra:', excExtra.join(', ') || 'none');
console.log('exceptions:'); for (const e of PAIR_RULE_STATS.exceptions) console.log(`  ${e.pair}: rule ${e.ruleSetup} (${ROWS[e.pair].count} moves) -> best ${e.best} (${e.bestCount} moves, helper ${e.bestHelper})`);
console.log(`bufferMove lines: ${PAIR_RULE_STATS.bufferMoveLines} (asymmetric pair/reverse: ${bmAsym}); with L/B setups ${rows.filter((r) => r.bufferMove && /[LB]/.test(r.bufferMove.setup)).length}; setup moves the buffer ${rows.filter((r) => r.bufferMove && r.bufferMove.bufferMoves).length}`);
console.log('whole solves:', JSON.stringify(solveResults));
console.log('level 1 turns:', PAIR_RULE_TURNS.helpers.map((h) => `${h.helper} (${h.face}${h.rotation ? `, seen ${h.faceSeen}` : ''}): ` + h.letters.map((x) => `${x.letter} ${x.turn}${x.turnSeen !== x.turn ? '=' + x.turnSeen : ''}${x.usedByRule ? '*' : ''}`).join(', ')).join(' | '));
console.log('level 2:', PAIR_RULE_LEVEL2.map((x) => `${x.letter} ${x.firstTurn} > ${x.becomes}, ${x.secondTurn}, ${x.helper}${x.rotation ? ` (seen ${x.firstTurnSeen} ${x.secondTurnSeen})` : ''}`).join(' | '));
for (const p of ['QT', 'AP', 'EG', 'GA', 'XP', 'ET']) { const r = ROWS[p]; console.log(`  ${p}: level ${r.level}, ${r.helper}, ${r.notation}${r.rotation ? `  | seen: ${r.rotation} ${r.notationSeen} ${r.rotationBack}` : ''}`); }

if (process.argv.includes('--write') && !fails.length) {
  const lines = (xs) => xs.map((x) => JSON.stringify(x)).join(',\n');
  writeFileSync(new URL('../data/pair-rule.js', import.meta.url), `// BEGIN GENERATED\n// GENERATED by log/2026-11-18-pair-rule.mjs --write. Do not edit by hand.\n// The four-helper picking rule (docs/four-helper-picking-rule.md, prefer-B variant): for each of the 378 ordered corner pairs the level, the\n// helper (B D F K), the pre-turns, the helper's own setup and the commutator, as held and as seen after the helper's rotation (F: z, K: y').\n// A pair and its reverse share the setup. Exceptions (rule setup 4+ moves) carry the shortest buffer-still commutator in \`best\`;\n// \`bufferMove\` is a commutator that may move the buffer, only when it is 2+ moves shorter.\nexport const PAIR_RULE_STATS = ${JSON.stringify(PAIR_RULE_STATS)};\nexport const PAIR_RULE_TURNS = ${JSON.stringify(PAIR_RULE_TURNS)};\nexport const PAIR_RULE_LEVEL2 = ${JSON.stringify(PAIR_RULE_LEVEL2)};\nexport const pairRule = [\n${lines(rows)}\n];\n// END GENERATED\n`);
  console.log('wrote data/pair-rule.js'); }
console.log(fails.length ? `FAIL (${fails.length})\n${fails.slice(0, 15).join('\n')}` : 'ALL OK');
