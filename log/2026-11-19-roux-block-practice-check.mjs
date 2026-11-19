// Checks js/block-solver.js for Roux block practice (docs/roux-block-practice-plan.md section 7 and 11.6).
//   node log/2026-11-19-roux-block-practice-check.mjs     prints ALL OK
// Check 5 (all 24 holds) is not run: the colour options were not built (plan 11.8: fixed blue-white hold).
import { prepare, FIRST_BLOCK, SECOND_BLOCK, FB_EDGE, FB_SQUARE_FRONT, FB_SQUARE_BACK, frameSetup, unsolvedPieces, parseMoves, locate, piecesAt } from '../js/block-solver.js';
import { applyAlg, solvedCube, faceOf } from '../js/cube-sim.js';
import { randomScramble } from '../js/bld-memo.js';

let seed = 1916;
const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const fails = [];
const ok = (name, cond) => { if (!cond) fails.push(name); };
const len = (s) => (s ? s.split(' ').length : 0);

// 1. hold
const centres = (st) => st.filter((s) => s.p.filter((v) => v).length === 1);
for (let i = 0; i < 100; i++) { const sc = randomScramble(25, rnd); ok(`hold ${sc}`, centres(applyAlg(solvedCube(), frameSetup(sc))).every((s) => s.colour === faceOf(s.n))); }
const held = centres(applyAlg(solvedCube(), "y'"));
const at = (f) => held.find((s) => faceOf(s.n) === f).colour;
ok("y' gives U yellow (U), F red (L), L blue (B), D white (D)", at('U') === 'U' && at('F') === 'L' && at('L') === 'B' && at('D') === 'D');

let t0 = Date.now();
const fb = prepare(FIRST_BLOCK), sb = prepare(SECOND_BLOCK);
const tBuild = Date.now() - t0;
const goals = [FB_EDGE, FB_SQUARE_FRONT, FB_SQUARE_BACK].map(prepare);

// full breadth-first tables for checks 3, 4, 6, 10 (only built here)
function fullTable(block) {
  const names = block.pieces, n = names.length, size = 24 ** n;
  const kinds = names.map((x) => x.length);
  const tagged = solvedCube().map((s) => ({ ...s, from: `${s.p}|${s.n}` }));
  const LOCS = { 3: [], 2: [] };
  for (const s of solvedCube()) { const k = s.p.filter((v) => v).length; if (k > 1) LOCS[k].push(`${s.p}|${s.n}`); }
  const idx = { 3: new Map(LOCS[3].map((k, i) => [k, i])), 2: new Map(LOCS[2].map((k, i) => [k, i])) };
  const mt = block.moves.map((m) => { const t = { 3: new Uint8Array(24), 2: new Uint8Array(24) }; for (const s of applyAlg(tagged, m)) { const k = s.p.filter((v) => v).length; if (k > 1) t[k][idx[k].get(s.from)] = idx[k].get(`${s.p}|${s.n}`); } return names.map((_, i) => t[kinds[i]]); });
  const goal = locate('', names).reduce((x, v) => x * 24 + v, 0);
  const dist = new Uint8Array(size).fill(255), q = new Uint32Array(size), dg = new Uint8Array(n);
  let h = 0, tl = 0; dist[goal] = 0; q[tl++] = goal;
  while (h < tl) { const c0 = q[h++], d = dist[c0] + 1; let c = c0; for (let i = n - 1; i >= 0; i--) { dg[i] = c % 24; c = (c - dg[i]) / 24; }
    for (const tab of mt) { let x = 0; for (let i = 0; i < n; i++) x = x * 24 + tab[i][dg[i]]; if (dist[x] === 255) { dist[x] = d; q[tl++] = x; } } }
  let max = 0; for (let i = 0; i < size; i++) if (dist[i] !== 255 && dist[i] > max) max = dist[i];
  return { dist, max, count: tl, of: (setup) => dist[locate(setup, names).reduce((x, v) => x * 24 + v, 0)] };
}
const fullFB = fullTable(FIRST_BLOCK), fullSB = fullTable(SECOND_BLOCK);
// 6. longest cases and table sizes
ok(`FB longest ${fullFB.max} (9), positions ${fullFB.count} (5,322,240)`, fullFB.max === 9 && fullFB.count === 5322240);
ok(`SB longest ${fullSB.max} (14), positions ${fullSB.count} (1,088,640)`, fullSB.max === 14 && fullSB.count === 1088640);

const goalFull = [FB_EDGE, FB_SQUARE_FRONT, FB_SQUARE_BACK].map(fullTable);
const FBM = new Set(FIRST_BLOCK.moves), SBM = new Set(SECOND_BLOCK.moves);
let slowest = 0, slowestShort = 0, n1 = 0;
const lengths = { fb: [], sb: [] };
for (let i = 0; i < 1000; i++) {
  const sc = randomScramble(25, rnd), set = frameSetup(sc);
  let t = Date.now(); const r = fb.solve(set, { longer: i < 200 }); slowest = Math.max(slowest, Date.now() - t);
  t = Date.now(); fb.solve(set, { longer: false }); slowestShort = Math.max(slowestShort, Date.now() - t);
  // 2. first block
  for (const s of r.solutions) {
    ok(`FB solves ${sc} | ${s}`, fb.unsolvedPieces(`${set} ${s}`).length === 0);
    ok(`FB length ${sc}`, len(s) === r.length);
    ok(`FB moves ${s}`, s.split(' ').every((m) => FBM.has(m)));
  }
  lengths.fb.push(r.length);
  // 3. really shortest
  if (i < 200) ok(`FB shortest ${sc}: ${r.length} vs ${fullFB.of(set)}`, r.length === fullFB.of(set));
  // 4a. one move longer
  if (i < 200) for (const s of r.longer) {
    const ms = s.split(' ');
    ok(`FB longer length ${s}`, ms.length === r.length + 1);
    ok(`FB longer solves ${s}`, fb.unsolvedPieces(`${set} ${s}`).length === 0);
    ok(`FB longer no prefix ${s}`, ms.every((_, k) => k === ms.length || fb.unsolvedPieces(`${set} ${ms.slice(0, k).join(' ')}`).length > 0));
    ok(`FB longer no removable move ${s}`, ms.every((_, k) => fb.unsolvedPieces(`${set} ${ms.filter((__, j) => j !== k).join(' ')}`).length > 0));
  }
  // 7. notes
  if (i < 200) {
    const s = r.solutions[0], ms = s.split(' ');
    for (const nt of fb.notes(set, s)) {
      const g = FIRST_BLOCK.groups.find((x) => x.name === nt.group);
      const home = (k) => unsolvedPieces(`${set} ${ms.slice(0, k).join(' ')}`, g.pieces).length === 0;
      ok(`notes ${nt.group} ${s}`, home(nt.afterMove) && ms.every((_, k) => k + 1 < nt.afterMove || home(k + 1)) && (nt.afterMove === 0 || !home(nt.afterMove - 1)));
    }
  }
  // 4. second block
  const set2 = `${set} ${r.solutions[0]}`;
  t = Date.now(); const r2 = sb.solve(set2, { longer: i < 200 }); slowest = Math.max(slowest, Date.now() - t);
  for (const s of r2.solutions) {
    ok(`SB solves ${sc} | ${s}`, sb.unsolvedPieces(`${set2} ${s}`).length === 0 && fb.unsolvedPieces(`${set2} ${s}`).length === 0);
    ok(`SB moves ${s}`, s.split(' ').every((m) => SBM.has(m)) && len(s) === r2.length);
  }
  if (i < 200) ok(`SB shortest ${sc}: ${r2.length} vs ${fullSB.of(set2)}`, r2.length === fullSB.of(set2));
  if (i < 200) for (const s of r2.longer) ok(`SB longer ${s}`, len(s) === r2.length + 1 && sb.unsolvedPieces(`${set2} ${s}`).length === 0);
  lengths.sb.push(r2.length);
  // 10. goals
  if (i < 500) {
    for (const [gi, g] of goals.entries()) {
      const rg = g.solve(set, { longer: false });
      const full = [FB_EDGE, FB_SQUARE_FRONT, FB_SQUARE_BACK][gi];
      for (const s of rg.solutions) ok(`goal ${full.name} ${s}`, unsolvedPieces(`${set} ${s}`, full.pieces).length === 0);
      if (i < 100) { n1++; ok(`goal ${full.name} shortest ${rg.length} vs ${goalFull[gi].of(set)}`, rg.length === goalFull[gi].of(set)); }
    }
  }
  // 11. goal 2 picture: after the shortest DL solution, the outlined stickers of DFL and FL carry those pieces' colours
  if (i < 200) {
    const s = goals[0].solve(set, { longer: false }).solutions[0];
    const st = applyAlg(solvedCube(), `${set} ${s}`);
    const colourAt = new Map(st.map((x) => [`${x.p.join()}|${x.n.join()}`, x.colour]));
    const marks = piecesAt(`${set} ${s}`, ['DFL', 'FL']);
    ok(`goal 2 outline ${sc}`, [...marks.DFL.map((k) => colourAt.get(k))].sort().join('') === 'DFL'.split('').sort().join('') && [...marks.FL.map((k) => colourAt.get(k))].sort().join('') === 'FL'.split('').sort().join(''));
  }
}
const avg = (xs) => (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2);
// 8. check my solution
const pm = parseMoves("R U' r2 Rw M’", 'any');
ok(`parseMoves accepts: ${pm.moves} bad ${pm.bad}`, pm.moves === "R U' r2 r M'" && pm.bad.length === 0);
ok('parseMoves rejects x Q', parseMoves('x Q', 'any').bad.join() === 'x,Q');
{ const sc = randomScramble(25, rnd), set = frameSetup(sc), s = fb.solve(set).solutions[0];
  ok('own solution passes', fb.unsolvedPieces(`${set} ${s}`).length === 0);
  const wrong = s.split(' ').slice(0, -1).join(' ');
  ok('wrong solution lists pieces', fb.unsolvedPieces(`${set} ${wrong}`).length > 0 && fb.unsolvedPieces(`${set} ${wrong}`).every((p) => FIRST_BLOCK.pieces.includes(p))); }
// 9. speed
ok(`table build ${tBuild} ms (< 1000)`, tBuild < 1000);
ok(`slowest shortest-only search ${slowestShort} ms (< 20)`, slowestShort < 20);
ok(`slowest search with one-move-longer ${slowest} ms (< 60)`, slowest < 60);
console.log(`tables ${tBuild} ms; slowest search ${slowestShort} ms shortest only, ${slowest} ms with longer; mean shortest FB ${avg(lengths.fb)}, SB ${avg(lengths.sb)}; goal checks ${n1}`);
console.log(fails.length ? `FAIL ${fails.length}\n${fails.slice(0, 12).join('\n')}` : 'ALL OK');
