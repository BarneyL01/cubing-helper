// Twisted corners and parity for the 3-style pages (buffer UFR, M2 edges), built from the owner's Orozco algorithms:
//  - twist: bring the twisted corner into UBR with a setup that does not touch UFR (B, D, L turns), do Orozco's twist
//    (twists UFR and UBR) or twist backwards, undo the setup. One per twisted corner; the buffer comes right last.
//  - parity (odd corner letters): last letter X -> the pair X then B, then the Ra-perm (Orozco's parity, R U F version);
//    if X is on UBR (B, N, Q): only the Ra-perm, the twist step does the rest.
// Checks every twist row, then 3,000 whole solves per table: M2 edges (+ M2 parity), pairs, parity, twists.
//   node log/2026-11-03-3style-twists.mjs           checks; prints ALL OK
//   node log/2026-11-03-3style-twists.mjs --write   also rewrites data/three-style-twists.js
import { writeFileSync } from 'node:fs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { expandBrackets, cancelMoves, invertAlg } from '../js/algs.js';
import { pieces, tracked, trackedSolved, slotName } from '../js/cube-laws.js';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';
import { BLD_PARITY } from '../data/bld.js';
import { OROZCO_TWIST, OROZCO_TWIST_REV } from '../data/orozco-corners.js';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js';
import { threeStyleOurs } from '../data/three-style-ours.js';
import { threeStyleCorners } from '../data/three-style-corners.js';
import { SPEFFZ } from './three-style-lib.mjs';

const fails = [];
const permSig = (m) => JSON.stringify(applyAlg(solvedCube(), m).map((s) => [s.p.join(), s.n.join(), s.colour]));
const check = (n, ok) => { if (!ok) fails.push(n); };
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const TW = { twist: cancelMoves(expandBrackets(OROZCO_TWIST)), 'twist backwards': cancelMoves(expandBrackets(OROZCO_TWIST_REV)) };
// The setups, as found by search (shortest; B and D first, L only where nothing else works). Checked below.
const SETUPS = { UBR: '', UBL: "B'", DBR: 'B', DBL: 'B2', DFR: 'D B', DFL: "D' B2", UFL: "L' B'" };
const FACE = (n) => ({ '1,0,0': 'R', '-1,0,0': 'L', '0,1,0': 'U', '0,-1,0': 'D', '0,0,1': 'F', '0,0,-1': 'B' })[n.join()];
const rows = [];
for (const [corner, setup] of Object.entries(SETUPS)) for (const [name, t] of Object.entries(TW)) {
  const moves = cancelMoves(setup ? `${setup} ${t} ${invertAlg(setup)}` : t);
  const ch = pieces(tracked(moves)).corners.filter((c) => c.twist || c.slot !== c.piece);
  check(`${corner} ${name}: only UFR and ${corner} twisted in place`, ch.length === 2 && ch.every((c) => c.slot === c.piece) && ch.some((c) => slotName(c.slot.split(',').map(Number)) === 'UFR') && ch.some((c) => slotName(c.slot.split(',').map(Number)) === corner));
  check(`${corner} ${name}: setup avoids UFR`, !/[RUF]/.test(setup));
  // the case it solves: where the white/yellow (U or D) sticker of that corner is
  const caseState = applyAlg(trackedSolved(), invertAlg(moves));
  const AX = { U: [1, 1], D: [1, -1], F: [2, 1], B: [2, -1], R: [0, 1], L: [0, -1] };
  const p = [0, 0, 0]; for (const f of corner) p[AX[f][0]] = AX[f][1];
  const wy = caseState.find((s) => s.p.join() === p.join() && (s.colour === 'U' || s.colour === 'D'));
  rows.push({ corner, setup, alg: name, faces: FACE(wy.n), moves, count: moves.split(' ').length });
}
check('14 twist rows', rows.length === 14);

// Without B: twist the buffer and the corner directly, [setup : [R' D R D' R' D R , U^k]] (or the two parts swapped),
// setup at most 2 moves of R U D F. The shortest for each row; checked like the others.
{
  const CORE = "R' D R D' R' D R";
  const MOVES = 'RUDF'.split('').flatMap((f) => [f, f + "'", f + '2']);
  const setups = [''];
  for (const a of MOVES) { setups.push(a); for (const b of MOVES) if (a[0] !== b[0]) setups.push(`${a} ${b}`); }
  for (const r of rows) {
    let best = null;
    for (const st of setups) for (const k of ['U', "U'", 'U2']) for (const body of [`[${CORE} , ${k}]`, `[${k} , ${CORE}]`]) {
      const notation = st ? `[${st} : ${body}]` : body;
      const moves = cancelMoves(expandBrackets(notation));
      const p1 = permSig(moves);
      if (p1 !== permSig(r.moves)) continue; // the same effect as the B version: this corner and the buffer, same directions
      const n = moves.split(' ').length;
      if (!best || n < best.count) best = { notation, moves, count: n };
    }
    check(`${r.corner} ${r.alg}: a version without B`, !!best && !/B/.test(best.moves));
    if (best) r.noB = best;
  }
}

// whole solves
const OZ = Object.fromEntries(rows.map((r) => [`${r.corner}:${r.faces}`, r.moves]));
const OZB = Object.fromEntries(rows.map((r) => [`${r.corner}:${r.faces}`, r.noB ? r.noB.moves : r.moves]));
let seed = 20261103; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const pieceId = (l) => [...SPEFFZ[l]].sort().join('');
const UFR = '1,1,1';
for (const [label, table, noB] of [['ours', threeStyleOurs, false], ['Dylan', threeStyleCorners, false], ['ours, twists without B', threeStyleOurs, true]]) {
  const PAIR = Object.fromEntries(table.map((e) => [e.pair, e.moves]));
  let solved = 0, odd = 0, twisted = 0;
  for (let t = 0; t < 3000; t++) {
    const plan = bldPlan(randomScramble(25, rnd));
    const raw = cornerMemoFrom(plan.state, 'C');
    const targets = [];
    for (let i = 0; i < raw.length; i++) {
      // a cycle that only visits one piece is a corner twisted in place: leave it for the twist step
      if (raw[i].cycleBreak && raw[i + 1] && pieceId(raw[i + 1].letter) === pieceId(raw[i].letter) && (!raw[i + 2] || raw[i + 2].cycleBreak)) { i++; continue; }
      targets.push(raw[i].letter);
    }
    const moves = [...plan.edges.map((e) => e.moves), plan.parity ? BLD_PARITY[0] : ''];
    for (let i = 0; i + 1 < targets.length; i += 2) moves.push(PAIR[targets[i] + targets[i + 1]]);
    if (targets.length % 2) { odd++; const x = targets.at(-1); if (pieceId(x) !== pieceId('B')) moves.push(PAIR[`${x}B`]); moves.push(OROZCO_PARITY_RUF); }
    let st = applyAlg(plan.state, moves.filter(Boolean).join(' '));
    const tw = pieces(st).corners.filter((c) => c.twist && c.slot !== UFR);
    if (tw.length) twisted++;
    for (const c of tw) {
      const name = slotName(c.slot.split(',').map(Number));
      const AX = c.slot.split(',').map(Number);
      const wy = st.find((s) => s.p.join() === c.slot && (s.colour === 'U' || s.colour === 'D'));
      st = applyAlg(st, noB ? OZB[`${name}:${FACE(wy.n)}`] : OZ[`${name}:${FACE(wy.n)}`]);
    }
    if (st.every((s) => key(s) === s.home)) solved++;
  }
  check(`${label}: 3000 whole solves`, solved === 3000);
  console.log(`${label}: ${solved}/3000 whole solves (odd corner count ${odd}, twists at the end ${twisted})`);
}
if (process.argv.includes('--write') && !fails.length) {
  writeFileSync(new URL('../data/three-style-twists.js', import.meta.url), `// BEGIN GENERATED\n// GENERATED by log/2026-11-03-3style-twists.mjs --write. Do not edit by hand.\n// Twisted corners for 3-style (buffer UFR): setup into UBR (no R, U, F turns), Orozco's twist or twist backwards, undo.\n// faces: where the white/yellow sticker of that corner is when this row fixes it.\nexport const threeStyleTwists = ${JSON.stringify(rows).replace(/\},\{/g, '},\n{')};\n// END GENERATED\n`);
  console.log('wrote data/three-style-twists.js');
}
console.log(fails.length ? `FAIL\n${fails.join('\n')}` : 'ALL OK');
