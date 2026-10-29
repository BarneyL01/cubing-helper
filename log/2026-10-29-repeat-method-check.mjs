// Checks the Repeat method page (3x3/repeat/index.html, data/repeat-method.js):
//  1. what each repeat and card does (pieces moved, where from, which way round), as the page says;
//  2. step 2's rule on all 24 arrangements of the top corners;
//  3. step 5's rules on every top-edge position (384, counting turns of the top);
//  4. whole solves from random scrambles, following the page's rules step by step,
//     with move counts per step.
//   node log/2026-10-29-repeat-method-check.mjs [solves]     prints ALL OK
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { invertAlg, cancelMoves } from '../js/algs.js';
import { randomScramble } from '../js/bld-memo.js';
import { CORNER_CYCLE, DROP, FLIP, DROPS, TOP_CYCLE as TOP_MAIN, FLIP_SIDES, FLIP_ALL, COMM, SHORT } from '../data/repeat-method.js';
const SETS = { drop: { drops: DROPS, top: TOP_MAIN.alg }, short: { drops: Object.fromEntries(Object.entries(DROPS).map(([k, d]) => [k, { ...d, alg: SHORT[k] }])), top: SHORT.topCycle } };
let TOP_CYCLE = { alg: TOP_MAIN.alg };

const fails = [];
const check = (name, ok, detail = '') => { if (!ok) fails.push(detail ? `${name}: ${detail}` : name); };
let seed = 29; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

// Positions as permutations of the 54 sticker places: st[i] = where the sticker that starts at i is now.
const SOLVED = solvedCube();
const keyOf = (s) => `${s.p.join()}|${s.n.join()}`;
const IDX = new Map(SOLVED.map((s, i) => [keyOf(s), i]));
const TAG = SOLVED.map((s, i) => ({ ...s, colour: i }));
const cache = new Map();
const permOf = (alg) => {
  if (!cache.has(alg)) { const o = new Array(54); for (const s of applyAlg(TAG, alg || 'U4')) o[s.colour] = IDX.get(keyOf(s)); cache.set(alg, o); }
  return cache.get(alg);
};
const ID = SOLVED.map((_, i) => i);
const comp = (a, b) => a.map((x) => b[x]);
const kind = (i) => SOLVED[i].p.filter((v) => v).length; // 1 centre, 2 edge, 3 corner
const piece = (i) => SOLVED[i].p.join();
const FACE = { '1,0,0': 'R', '-1,0,0': 'L', '0,1,0': 'U', '0,-1,0': 'D', '0,0,1': 'F', '0,0,-1': 'B' };
const faceOf = (i) => FACE[SOLVED[i].n.join()];
const NAME = (p) => { const o = []; if (p[1]) o.push(p[1] > 0 ? 'U' : 'D'); if (p[2]) o.push(p[2] > 0 ? 'F' : 'B'); if (p[0]) o.push(p[0] > 0 ? 'R' : 'L'); return o.join(''); };
const slot = (i) => NAME(SOLVED[i].p);
const STICKERS = new Map(); ID.forEach((i) => { const k = piece(i); if (!STICKERS.has(k)) STICKERS.set(k, []); STICKERS.get(k).push(i); });
const PIECES = [...STICKERS.keys()];
const pieceSolved = (st, k) => STICKERS.get(k).every((i) => st[i] === i);
const placed = (st, k) => piece(st[STICKERS.get(k)[0]]) === k; // in its slot, any twist
const isTop = (k) => k.split(',')[1] === '1';
const ofKind = (n) => PIECES.filter((k) => kind(STICKERS.get(k)[0]) === n);
const CORNERS = ofKind(3), EDGES = ofKind(2), CENTRES = ofKind(1);
const BY_NAME = Object.fromEntries(PIECES.map((k) => [NAME(k.split(',').map(Number)), k]));
const len = (alg) => cancelMoves(alg).split(' ').filter((m) => m && !/^[xyz]/.test(m)).length;

// 1. What each piece does.
function moved(alg) {
  const p = permOf(alg);
  return PIECES.filter((k) => !pieceSolved(p, k)).map((k) => NAME(k.split(',').map(Number))).sort();
}
const sameSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
// Corner cycle: corners UFL -> UBL -> UBR; UFR and the bottom corners stay (edges may move).
{
  const p = permOf(CORNER_CYCLE);
  const goes = (from, to) => piece(p[STICKERS.get(BY_NAME[from])[0]]) === BY_NAME[to];
  check('corner cycle path', goes('UFL', 'UBL') && goes('UBL', 'UBR') && goes('UBR', 'UFL'));
  check('corner cycle keeps the others', CORNERS.filter((k) => !pieceSolved(p, k)).length === 3);
  check('corner cycle centres', CENTRES.every((k) => pieceSolved(p, k)));
}
// Drop: UF -> DF -> UB, nothing else, centres included.
{
  check('drop moves three edges only', sameSet(moved(DROP), ['UF', 'DF', 'UB']), moved(DROP).join());
  const p = permOf(DROP);
  const goes = (from, to) => piece(p[STICKERS.get(BY_NAME[from])[0]]) === BY_NAME[to];
  check('drop path', goes('UF', 'DF') && goes('DF', 'UB') && goes('UB', 'UF'));
  check('drop face turns only', !/[MESxyz]/.test(DROP));
}
// The page's strip: one R2 U2 R2 F2 moves seven edges and four corners.
{
  const p = permOf('R2 U2 R2 F2');
  check('strip caption', EDGES.filter((k) => !pieceSolved(p, k)).length === 7 && CORNERS.filter((k) => !pieceSolved(p, k)).length === 4);
}
// Flip: UF UL DF DB flipped in place, nothing else.
{
  const p = permOf(FLIP);
  check('flip moves four edges', sameSet(moved(FLIP), ['UF', 'UR', 'DF', 'DB']), moved(FLIP).join());
  check('flip keeps them in place', ['UF', 'UR', 'DF', 'DB'].every((n) => placed(p, BY_NAME[n])));
  check("flip uses M' only", !/M(?!')/.test(FLIP) && !/L/.test(FLIP));
}
// Cards: one edge from `from` into `target`, its top sticker onto face `up`; outside the top layer nothing else changes.
for (const [setName, set] of Object.entries(SETS)) for (const [name0, d] of Object.entries(set.drops)) {
  const name = `${setName} ${name0}`;
  const p = permOf(d.alg);
  const off = moved(d.alg).filter((n) => n[0] !== 'U');
  check(`${name} touches only its slot below the top`, sameSet(off, [d.target]), off.join());
  check(`${name} corners and centres`, [...CORNERS, ...CENTRES].every((k) => pieceSolved(p, k)));
  const src = STICKERS.get(BY_NAME[d.from]);
  check(`${name} comes from ${d.from}`, src.every((i) => piece(p[i]) === BY_NAME[d.target]));
  const upSticker = src.find((i) => faceOf(i) === 'U');
  check(`${name} top sticker to ${d.up}`, faceOf(p[upSticker]) === d.up);
  check(`${name} no L`, !/L/.test(d.alg));
  if (setName === 'drop') check(`${name} no M`, !/M/.test(d.alg));
}
for (const set of Object.values(SETS)) {
  TOP_CYCLE = { alg: set.top };
{
  const p = permOf(TOP_CYCLE.alg);
  check('top cycle three top edges', sameSet(moved(TOP_CYCLE.alg), ['UR', 'UB', 'UF']), moved(TOP_CYCLE.alg).join());
  const goes = (from, to) => piece(p[STICKERS.get(BY_NAME[from])[0]]) === BY_NAME[to];
  check('top cycle path R->B->F', goes('UR', 'UB') && goes('UB', 'UF') && goes('UF', 'UR'));
  const ups = EDGES.filter(isTop).map((k) => STICKERS.get(k).find((i) => faceOf(i) === 'U'));
  check('top cycle keeps yellow up', ups.every((i) => faceOf(p[i]) === 'U'));
}
}
TOP_CYCLE = { alg: TOP_MAIN.alg };
check('commutator', sameSet(moved(COMM), ['UF', 'DF', 'UB']));

// Helpers for the rules.
const U_TURNS = ['', 'U', 'U2', "U'"];
const Y_TURNS = ['', 'y', 'y2', "y'"];
const inR = (r, alg) => (r ? `${r} ${alg} ${invertAlg(r)}` : alg); // the same moves with the cube held turned
const upToU = (st, test) => U_TURNS.some((u) => test(comp(st, permOf(u))));
const topEdgeUps = EDGES.filter(isTop).map((k) => STICKERS.get(k).find((i) => faceOf(i) === 'U'));
const badTop = (st) => topEdgeUps.filter((i) => SOLVED[st[i]].p[1] === 1 && faceOf(st[i]) !== 'U').map((i) => slot(st[i])).sort();
const allSolved = (st) => st.every((x, i) => x === i);

// 2. Step 2 rule on the 24 top-corner arrangements (bottom corners solved; twist and edges ignored).
const topCornersPlaced = (st) => CORNERS.filter(isTop).every((k) => placed(st, k));
function step2(st) {
  const out = [];
  for (let round = 0; round < 2; round++) {
    for (const u of U_TURNS) for (const y of Y_TURNS) {
      const a = comp(st, permOf(u));
      // hold a corner that is in its spot at the front-right (the y turn says which one that is)
      if (!placed(a, BY_NAME[inv(y, 'UFR')])) continue;
      for (const k of [0, 1, 2]) {
        let b = a; for (let j = 0; j < k; j++) b = comp(b, permOf(inR(y, CORNER_CYCLE)));
        if (topCornersPlaced(b)) return { st: b, uses: out.length + k, moves: (u ? 1 : 0) + k * 12 + out.length * 12 };
      }
    }
    st = comp(st, permOf(CORNER_CYCLE)); out.push('any');
  }
  return null;
}
// which slot a y turn brings to the front-right: inverse lookup
function inv(y, name) {
  const p = permOf(y || '');
  const k = BY_NAME[name];
  const i = STICKERS.get(k)[0];
  // the piece that ends at UFR after turning the cube by y started at:
  const from = ID.find((j) => p[j] === i);
  return slot(from);
}
{
  const seen = new Map();
  const q = [ID];
  const sig = (s) => CORNERS.map((k) => piece(s[STICKERS.get(k)[0]])).join('|');
  seen.set(sig(ID), ID);
  while (q.length) { const s = q.shift(); for (const g of [CORNER_CYCLE, 'U']) { const n = comp(s, permOf(g)); if (!seen.has(sig(n))) { seen.set(sig(n), n); q.push(n); } } }
  const arr = [...seen.values()];
  check('step 2: 24 arrangements', arr.length === 24, String(arr.length));
  for (const s of arr) { const r = step2(s); check('step 2 rule', r && upToU(r.st, topCornersPlaced)); }
}

// 3. Step 5 rules on every top-edge position (lower layers and corners solved).
function step5(st) {
  let moves = 0;
  const doAlg = (alg) => { st = comp(st, permOf(alg)); moves += len(alg); };
  const turnTo = (want) => { for (const u of U_TURNS) { const t = comp(st, permOf(u)); if (JSON.stringify(badTop(t)) === JSON.stringify(want)) { st = t; if (u) moves++; return true; } } return false; };
  let b = badTop(st);
  if (b.length === 4) { doAlg(FLIP_ALL.alg); b = badTop(st); }
  if (b.length === 2 && !(sameSet(b, ['UF', 'UB']) || sameSet(b, ['UL', 'UR']))) {
    if (!turnTo(['UF', 'UL'])) return null;
    doAlg(TOP_CYCLE.alg); b = badTop(st);
    if (b.length !== 2) return null;
  }
  if (b.length === 2) { if (!turnTo(['UL', 'UR'])) return null; doAlg(FLIP_SIDES.alg); }
  if (badTop(st).length) return null;
  // order: line the top up so its corners are solved; hold an edge that matches its centre at the left
  // (turning the whole cube), do the top cycle once or twice. No edge matches: cycle once, look again.
  const cornersDone = (x) => CORNERS.every((k) => pieceSolved(x, k));
  for (const u of U_TURNS) if (cornersDone(comp(st, permOf(u)))) { st = comp(st, permOf(u)); if (u) moves++; break; }
  for (let round = 0; round < 2 && !allSolved(st); round++) {
    let done = false;
    for (const y of Y_TURNS) {
      const left = BY_NAME[inv(y, 'UL')];
      if (!pieceSolved(st, left)) continue;
      for (const k of [1, 2]) {
        let c = st; for (let j = 0; j < k; j++) c = comp(c, permOf(inR(y, TOP_CYCLE.alg)));
        if (allSolved(c)) { st = c; moves += k * len(TOP_CYCLE.alg); done = true; break; }
      }
      if (done) break;
    }
    if (!done) doAlg(TOP_CYCLE.alg);
  }
  for (const u of U_TURNS) if (allSolved(comp(st, permOf(u)))) return { st: comp(st, permOf(u)), moves: moves + (u ? 1 : 0) };
  return null;
}
{
  const seen = new Map(); const q = [ID]; seen.set(ID.join(), ID);
  for (const g of [TOP_CYCLE.alg, FLIP_SIDES.alg, 'U']) permOf(g);
  while (q.length) { const s = q.shift(); for (const g of [TOP_CYCLE.alg, FLIP_SIDES.alg, 'U']) { const n = comp(s, permOf(g)); if (!seen.has(n.join())) { seen.set(n.join(), n); q.push(n); } } }
  check('step 5: 384 positions', seen.size === 384, String(seen.size));
  let bad = 0; for (const s of seen.values()) { const r = step5(s); if (!r || !allSolved(r.st)) bad++; }
  check('step 5 rules', bad === 0, `${bad} positions not solved`);
  TOP_CYCLE = { alg: SHORT.topCycle }; let bad2 = 0; for (const s of seen.values()) { const r = step5(s); if (!r || !allSolved(r.st)) bad2++; }
  check('step 5 rules (short)', bad2 === 0, `${bad2}`); TOP_CYCLE = { alg: TOP_MAIN.alg };
}

// 4. Whole solves.
const SASSY = "R U R' U'";
const times = (a, n) => Array(n).fill(a).join(' ');
function step1(st) {
  let moves = 0;
  const bottom = CORNERS.filter((k) => !isTop(k));
  for (let guard = 0; guard < 40; guard++) {
    const todo = bottom.filter((k) => !pieceSolved(st, k));
    if (!todo.length) return { st, moves };
    const keep = bottom.filter((k) => pieceSolved(st, k));
    let best = null;
    for (const y of Y_TURNS) for (const u of U_TURNS) for (const n of [1, 3, 5]) {
      const alg = `${u} ${inR(y, times(SASSY, n))}`.trim();
      const t = comp(st, permOf(alg));
      const gain = bottom.filter((k) => pieceSolved(t, k)).length - keep.length;
      if (gain > 0 && keep.every((k) => pieceSolved(t, k)) && (!best || len(alg) < best.m)) best = { t, m: len(alg) };
    }
    if (best) { st = best.t; moves += best.m; continue; }
    // lift a wrong bottom corner: hold it at the front-right, Sassy once
    for (const y of Y_TURNS) {
      const k = BY_NAME[inv(y, 'DFR')];
      if (pieceSolved(st, k)) continue;
      st = comp(st, permOf(inR(y, SASSY))); moves += 4; break;
    }
  }
  return null;
}
function step3(st) {
  // yellow down (x2), twist each corner at the bottom front-right with Sassy x2 until yellow is down, turn D between
  let moves = 0;
  st = comp(st, permOf('x2'));
  const dfr = BY_NAME.DFR;
  const yellowDown = (s) => { // the sticker now on the D face at DFR must be a yellow (U) sticker
    const dPlace = STICKERS.get(dfr).find((j) => faceOf(j) === 'D');
    const from = ID.find((j) => s[j] === dPlace);
    return faceOf(from) === 'U'; };
  for (let c = 0; c < 4; c++) {
    let n = 0;
    while (!yellowDown(st) && n < 2) { st = comp(st, permOf(times(SASSY, 2))); moves += 8; n++; }
    if (!yellowDown(st)) return null;
    st = comp(st, permOf('D')); moves++;
  }
  // line up the bottom, turn back over
  for (const d of U_TURNS.map((u) => u.replace('U', 'D'))) {
    const t = comp(comp(st, permOf(d)), permOf('x2'));
    if (upToU(t, (s) => CORNERS.every((k) => pieceSolved(s, k)))) {
      for (const u of U_TURNS) { const v = comp(t, permOf(u)); if (CORNERS.every((k) => pieceSolved(v, k))) return { st: v, moves: moves + (d ? 1 : 0) + (u ? 1 : 0) }; }
    }
  }
  return null;
}
const LOWER = EDGES.filter((k) => !isTop(k));
let CARDS = [];
const buildCards = (drops) => { CARDS = []; for (const [name, d] of Object.entries(drops)) for (const y of Y_TURNS) for (const u of U_TURNS) {
  const alg = `${u} ${inR(y, d.alg)}`.trim();
  CARDS.push({ name, alg, p: permOf(alg), m: len(alg) });
} };
function step4(st) {
  let moves = 0; const used = {};
  for (let guard = 0; guard < 60; guard++) {
    const todo = LOWER.filter((k) => !pieceSolved(st, k));
    if (!todo.length) return { st, moves, used };
    const keep = LOWER.filter((k) => pieceSolved(st, k));
    let best = null;
    for (const c of CARDS) {
      const t = comp(st, c.p);
      if (!keep.every((k) => pieceSolved(t, k))) continue;
      if (LOWER.filter((k) => pieceSolved(t, k)).length > keep.length && (!best || c.m < best.c.m)) best = { c, t };
    }
    if (!best) { // lift a wrong edge out with card 1 or 3
      for (const c of CARDS) {
        if (c.name !== 'downGood' && c.name !== 'midGood') continue;
        const t = comp(st, c.p);
        if (keep.every((k) => pieceSolved(t, k)) && (!best || c.m < best.c.m)) best = { c, t, lift: true };
      }
    }
    if (!best) return null;
    st = best.t; moves += best.c.m; const key = best.lift ? 'lift' : best.c.name; used[key] = (used[key] || 0) + 1;
  }
  return null;
}
const N = Number(process.argv[2]) || 400;
for (const [setName, set] of Object.entries(SETS)) {
seed = 29; buildCards(set.drops); TOP_CYCLE = { alg: set.top };
console.log(`== ${setName} cards`);
const totals = { s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 }; let worst = 0; const used = {};
let solvedCount = 0;
for (let t = 0; t < N; t++) {
  const scramble = randomScramble(25, rnd);
  let st = permOf(scramble);
  const r1 = step1(st); if (!r1) { check('step 1', false, scramble); continue; }
  const r2 = step2(r1.st); if (!r2) { check('step 2', false, scramble); continue; }
  let s2 = r2.st; for (const u of U_TURNS) if (CORNERS.filter(isTop).every((k) => placed(comp(r2.st, permOf(u)), k))) { s2 = comp(r2.st, permOf(u)); break; }
  const r3 = step3(s2); if (!r3) { check('step 3', false, scramble); continue; }
  check('step 3 leaves corners solved', CORNERS.every((k) => pieceSolved(r3.st, k)), scramble);
  check('centres home after step 3', CENTRES.every((k) => pieceSolved(r3.st, k)), scramble);
  const r4 = step4(r3.st); if (!r4) { check('step 4', false, scramble); continue; }
  check('step 4 corners untouched', CORNERS.filter((k) => !isTop(k)).every((k) => pieceSolved(r4.st, k)) && upToU(r4.st, (s) => CORNERS.every((k) => pieceSolved(s, k))), scramble);
  // line the top up with its corners before step 5 (the page lines it up at the end; same thing)
  let s4 = r4.st; for (const u of U_TURNS) { const v = comp(r4.st, permOf(u)); if (CORNERS.every((k) => pieceSolved(v, k))) { s4 = v; break; } }
  const r5 = step5(s4); if (!r5) { check('step 5', false, scramble); continue; }
  if (allSolved(r5.st)) solvedCount++; else check('solved', false, scramble);
  totals.s1 += r1.moves; totals.s2 += r2.moves; totals.s3 += r3.moves; totals.s4 += r4.moves; totals.s5 += r5.moves;
  for (const [k, v] of Object.entries(r4.used)) used[k] = (used[k] || 0) + v;
  worst = Math.max(worst, r1.moves + r2.moves + r3.moves + r4.moves + r5.moves);
}
check('all solves', solvedCount === N, `${solvedCount}/${N}`);
const mean = (x) => (x / N).toFixed(1);
console.log(`${solvedCount}/${N} whole solves. Mean moves: step 1 ${mean(totals.s1)}, step 2 ${mean(totals.s2)}, step 3 ${mean(totals.s3)}, step 4 ${mean(totals.s4)}, step 5 ${mean(totals.s5)}; total ${mean(Object.values(totals).reduce((a, b) => a + b))}, worst ${worst}.`);
console.log('Step 4 cards per solve:', Object.fromEntries(Object.entries(used).map(([k, v]) => [k, +(v / N).toFixed(2)])));
}
console.log(fails.length ? `FAIL\n${[...new Set(fails)].slice(0, 30).join('\n')}` : 'ALL OK');
