// Last-pair cards for Roux first block (docs/roux-block-practice-plan.md 11.5): a square is solved, the last pair's
// corner and edge are anywhere else. Generates data/roux-last-pair.js and checks it.
//   node log/2026-11-19-roux-last-pair.mjs           checks only, prints ALL OK
//   node log/2026-11-19-roux-last-pair.mjs --write   also writes the data file
// Checks: every finish (any move, and without B) solves the whole first block from its case on the sticker simulator;
// the no-B finish has no B; both lengths equal a full breadth-first distance; "via the top" re-checked move by move;
// the drill setup of every card (and of every U-turn member) followed by the shown answer leaves the first block solved.
import fs from 'fs';
import { prepare, FIRST_BLOCK, LOCATIONS, homeOf, locate, unsolvedPieces, moveList } from '../js/block-solver.js';
import { invertAlg } from '../js/algs.js';
import { applyAlg, solvedCube } from '../js/cube-sim.js';

const WRITE = process.argv.includes('--write');
const fails = [];
const ok = (name, c) => { if (!c) fails.push(name); };
const FB = FIRST_BLOCK.pieces; // DL FL BL DFL DBL
const NOB = { ...FIRST_BLOCK, moves: moveList('UDLRFMr') };
const any = prepare(FIRST_BLOCK), noB = prepare(NOB);
const pieceOfLoc = (kind, i) => LOCATIONS[kind][i].split('|')[0];
const inU = (kind, i) => LOCATIONS[kind][i].split('|')[0].split(',')[1] === '1';
const SETS = [
  { id: 'front', title: 'Front square solved: finish the back pair', pair: ['BL', 'DBL'], square: ['DL', 'FL', 'DFL'] },
  { id: 'back', title: 'Back square solved: finish the front pair', pair: ['FL', 'DFL'], square: ['DL', 'BL', 'DBL'] },
];
const CLASS = ['Both pieces on top', 'Corner on top, edge elsewhere', 'Edge on top, corner elsewhere', 'Both elsewhere'];

// a move string that makes the state from solved (so states can be turned with U by the simulator)
function setupOf(state) { return invertAlg(any.solveState(state, { max: 1, longer: false }).solutions[0]); }

const cards = [];
for (const set of SETS) {
  const [eName, cName] = set.pair;
  const home = Object.fromEntries(FB.map((n) => [n, homeOf(n)]));
  const squarePieces = set.square.map((n) => n.split('').sort().join(''));
  const usedPos = new Set(set.square.map((n) => { const k = n.length; return pieceOfLoc(k, home[n]); }));
  const cases = [];
  for (let c = 0; c < 24; c++) for (let e = 0; e < 24; e++) {
    if (usedPos.has(pieceOfLoc(3, c)) || usedPos.has(pieceOfLoc(2, e))) continue;
    if (c === home[cName] && e === home[eName]) continue;
    cases.push(FB.map((n) => (n === cName ? c : n === eName ? e : home[n])));
  }
  console.log(`${set.id}: ${cases.length} cases (21 corner spots x 20 edge spots - 1 = 419 expected)`);
  ok(`${set.id} case count ${cases.length}`, cases.length === 21 * 20 - 1);
  // group by U turns, on the solver coordinates: the four U powers applied to the case state
  const key = (s) => s.join(',');
  const seen = new Set();
  const iC = FB.indexOf(cName), iE = FB.indexOf(eName);
  for (const s0 of cases) {
    if (seen.has(key(s0))) continue;
    const members = [s0];
    let s = s0;
    for (let k = 1; k < 4; k++) {
      s = locate(`${setupOf(s)} U`, FB);
      if (!members.some((m) => key(m) === key(s))) members.push(s);
    }
    members.forEach((m) => seen.add(key(m)));
    // representative: the member with the shortest finish (ties: first found)
    const solved = members.map((m) => ({ m, a: any.solveState(m, { max: 1, longer: false }), b: noB.solveState(m, { max: 1, longer: false }) }));
    solved.sort((x, y) => x.a.length - y.a.length || x.b.length - y.b.length);
    const rep = solved[0];
    const finish = rep.a.solutions[0], finishNoB = rep.b.solutions[0];
    const setup = invertAlg(finish);
    // U turns from each member to the representative
    const uTurns = members.map((m) => { for (const t of ['', 'U', "U'", 'U2']) if (key(locate(`${setupOf(m)}${t ? ` ${t}` : ''}`, FB)) === key(rep.m)) return t; return null; });
    const cU = inU(3, rep.m[iC]), eU = inU(2, rep.m[iE]);
    const cls = cU && eU ? 0 : cU ? 1 : eU ? 2 : 3;
    // via the top: both pair pieces in the U layer after some k <= length - 2 moves
    const ms = finish.split(' ');
    let via = false;
    for (let k = 0; k <= ms.length - 2; k++) { const l = locate(`${setup} ${ms.slice(0, k).join(' ')}`, FB); if (inU(3, l[iC]) && inU(2, l[iE])) via = true; }
    cards.push({ set: set.id, cls, setup, finish, finishNoB, length: rep.a.length, lengthNoB: rep.b.length, viaTop: via, members: members.length, uTurns: [...new Set(uTurns.filter((t) => t))] });
    ok(`${set.id} U turns found`, uTurns.every((t) => t !== null));
  }
}
// order: by set, class, then length
cards.sort((a, b) => a.set.localeCompare(b.set) || a.cls - b.cls || a.length - b.length || a.lengthNoB - b.lengthNoB);
cards.forEach((c, i) => { c.id = `${c.set}-${i + 1}`; });

// ---- checks against a full breadth-first table (any moves and no-B), and on the sticker simulator
// full breadth-first distance tables over the five first-block pieces (any move, and without B)
function fullTable(moves) {
  const n = 5, size = 24 ** n, kinds = FB.map((x) => x.length);
  const idx = { 3: new Map(LOCATIONS[3].map((k, i) => [k, i])), 2: new Map(LOCATIONS[2].map((k, i) => [k, i])) };
  const tagged = solvedCube().map((x) => ({ ...x, from: `${x.p}|${x.n}` }));
  const mt = moves.map((m) => { const t = { 3: new Uint8Array(24), 2: new Uint8Array(24) }; for (const x of applyAlg(tagged, m)) { const k = x.p.filter((v) => v).length; if (k > 1) t[k][idx[k].get(x.from)] = idx[k].get(`${x.p}|${x.n}`); } return FB.map((_, i) => t[kinds[i]]); });
  const goal = locate('', FB).reduce((x, v) => x * 24 + v, 0);
  const d = new Uint8Array(size).fill(255), q = new Uint32Array(size), dg = new Uint8Array(n);
  let h = 0, tl = 0; d[goal] = 0; q[tl++] = goal;
  while (h < tl) { const c0 = q[h++], nd = d[c0] + 1; let c = c0; for (let i = n - 1; i >= 0; i--) { dg[i] = c % 24; c = (c - dg[i]) / 24; }
    for (const tab of mt) { let x = 0; for (let i = 0; i < n; i++) x = x * 24 + tab[i][dg[i]]; if (d[x] === 255) { d[x] = nd; q[tl++] = x; } } }
  return (state) => d[state.reduce((x, v) => x * 24 + v, 0)];
}
const distAny = fullTable(FIRST_BLOCK.moves), distNoB = fullTable(NOB.moves);
for (const c of cards) {
  const st = locate(c.setup, FB);
  ok(`${c.id} finish solves`, unsolvedPieces(`${c.setup} ${c.finish}`, FB).length === 0);
  ok(`${c.id} no-B finish solves`, unsolvedPieces(`${c.setup} ${c.finishNoB}`, FB).length === 0);
  ok(`${c.id} no-B has no B`, !/\bB/.test(c.finishNoB));
  ok(`${c.id} lengths`, c.finish.split(' ').length === c.length && c.finishNoB.split(' ').length === c.lengthNoB && distAny(st) === c.length && distNoB(st) === c.lengthNoB);
  const sq = SETS.find((s) => s.id === c.set).square;
  ok(`${c.id} square home at the start`, unsolvedPieces(c.setup, sq).length === 0 && unsolvedPieces(c.setup, FB).length > 0);
  // via the top, re-checked on the simulator: the pair's stickers all on the U layer
  const pair = SETS.find((s) => s.id === c.set).pair;
  const ms = c.finish.split(' ');
  let via = false;
  for (let k = 0; k <= ms.length - 2; k++) { const l = locate(`${c.setup} ${ms.slice(0, k).join(' ')}`, pair); if (LOCATIONS[2][l[0]].split('|')[0].split(',')[1] === '1' && LOCATIONS[3][l[1]].split('|')[0].split(',')[1] === '1') via = true; }
  ok(`${c.id} via the top`, via === c.viaTop);
  for (const u of ['', ...c.uTurns]) { const setup = u ? `${c.setup} ${invertAlg(u)}` : c.setup; ok(`${c.id} drill ${u}`, unsolvedPieces(`${setup} ${u} ${c.finish}`, FB).length === 0); }
}
const by = (f) => cards.filter(f).length;
const stats = { cards: cards.length, front: by((c) => c.set === 'front'), back: by((c) => c.set === 'back'), viaTop: by((c) => c.viaTop), classes: CLASS.map((_, i) => by((c) => c.cls === i)),
  meanLength: +(cards.reduce((a, c) => a + c.length, 0) / cards.length).toFixed(2), meanNoB: +(cards.reduce((a, c) => a + c.lengthNoB, 0) / cards.length).toFixed(2), noBSame: by((c) => c.lengthNoB === c.length) };
console.log(JSON.stringify(stats));
if (WRITE) {
  const body = `// GENERATED by log/2026-11-19-roux-last-pair.mjs --write. Do not edit by hand.
// Roux first block, last pair: a square solved, the other pair's corner and edge anywhere else, grouped so that cases
// one U turn apart are one card. setup: from a solved cube in the solving hold (yellow top, red front), makes the
// case; finish / finishNoB: the shortest finish with U D L R F B M r / without B. viaTop: the shortest finish has both
// pair pieces on the top layer before its last two moves. uTurns: U turns that bring the other members to this card.
export const LAST_PAIR_CLASSES = ${JSON.stringify(CLASS)};
export const LAST_PAIR_STATS = ${JSON.stringify(stats)};
export const lastPairCards = [
${cards.map((c) => `  ${JSON.stringify(c)},`).join('\n')}
];
`;
  fs.writeFileSync(new URL('../data/roux-last-pair.js', import.meta.url), body);
  console.log('wrote data/roux-last-pair.js');
}
console.log(fails.length ? `FAIL ${fails.length}\n${fails.slice(0, 10).join('\n')}` : 'ALL OK');
