// Checks the Pair drill page's steps (js/pair-drill.js) against data/pair-rule.js for all 378 pairs (2026-11-18).
//   node log/2026-11-18-pair-drill-check.mjs        prints ALL OK
// For every pair: 5 steps; the turns take the walked letter into the helper's place (through `via` on level 2) and the
// other letter to `otherNow`; turns + the row setup = the setup; the rotated (seen) form equals the held moves; the
// answer shown cycles buffer -> first -> second as a pure corner 3-cycle. Every filter combination gives a pool the
// page can show (non-empty, or an empty pool that pickPair answers with null).
import { permOf, spotOf, letterAt, expandBrackets } from './three-style-lib.mjs';
import { pairRule } from '../data/pair-rule.js';
import { stepsFor, turnsSeen, rowSetupSeen, answerOf, poolFor, pickPair, STEP_COUNT, rowOf } from '../js/pair-drill.js';

const fails = [];
const check = (name, ok) => { if (!ok) fails.push(name); };
const C = spotOf('C');
const at = (alg, letter) => letterAt.get(permOf(alg)[spotOf(letter)]);
const text = (s) => s.lines.map((l) => l.map((x) => (x.k === 'full' ? `${x.v.rotation} ${x.v.notationSeen} ${x.v.rotationBack}` : x.k === 'held' ? x.v.notation : x.v)).join('')).join('\n');
const seenStr = (t) => (t ? [t.first, t.second].filter(Boolean).join(' ') : '');
const unseen = (row, seen) => {
  // seen form -> held moves: rotation, seen moves, rotation back
  return `${row.rotation} ${seen} ${row.rotationBack}`.trim();
};

let rowsOk = 0, rotated = 0, cancelled = 0;
for (const row of pairRule) {
  const p = row.pair;
  const steps = stepsFor(row);
  check(`${p}: ${STEP_COUNT} steps`, steps.length === STEP_COUNT && steps.every((s) => s.title && s.lines.length));
  check(`${p}: rowOf`, rowOf(p).pair === p);

  // turns (held) take walked into the helper's place and other to otherNow
  const turns = row.turns || '';
  const heldTurns = turns ? turns.split(' ') : [];
  check(`${p}: other ${row.other} -> ${row.otherNow}`, at(turns, row.other) === row.otherNow);
  check(`${p}: walked ${row.walked} -> helper ${row.helper}`, at(turns, row.walked) === row.helper);
  check(`${p}: turns count by level`, heldTurns.length === row.level || (row.level === 0 && heldTurns.length === 0));
  if (row.level === 2) {
    check(`${p}: via ${row.via}`, at(heldTurns[0], row.walked) === row.via && at(heldTurns[1], row.via) === row.helper);
  }

  // seen turns equal the held turns after the rotation
  const t = turnsSeen(row);
  check(`${p}: seen turns present`, row.level === 0 ? t === null : !!t && !!t.first && (row.level === 2) === !!t.second);
  if (row.level > 0 && t) {
    const rotated0 = permOf(unseen(row, seenStr(t))).join();
    check(`${p}: rotation + seen turns + back = held turns`, rotated0 === permOf(turns).join());
  }

  // seen setup = seen turns + the helper's own setup
  const rs = rowSetupSeen(row);
  if (rs === null) cancelled++;
  else {
    const joined = [seenStr(t), rs].filter(Boolean).join(' ');
    check(`${p}: setupSeen = turns + row setup`, joined === row.setupSeen);
    // the row's own setup (held, for the letter at otherNow) in the seen form
    check(`${p}: row setup seen = held row setup`, permOf(unseen(row, rs || 'U4')).join() === permOf(row.rowSetup || 'U4').join());
  }
  check(`${p}: held setup = turns + rowSetup`, [turns, row.rowSetup].filter(Boolean).join(' ') === row.setup);

  // the answer: rotation + seen form = held moves; pure corner 3-cycle buffer -> first -> second
  const a = answerOf(row);
  check(`${p}: exception flag / best`, row.exception ? !!row.best && !a.rule && a.count < row.count : a.rule);
  const seenMoves = expandBrackets(a.notationSeen);
  check(`${p}: rotation + seen notation = held moves`, permOf(unseen(a, seenMoves)).join() === permOf(a.moves).join());
  check(`${p}: held notation = moves`, permOf(expandBrackets(a.notation)).join() === permOf(a.moves).join());
  const P = permOf(a.moves);
  const moved = P.filter((v, i) => v !== i).length;
  const [f, s] = [spotOf(row.first), spotOf(row.second)];
  check(`${p}: 3-cycle buffer -> ${row.first} -> ${row.second}`, moved === 9 && P[C] === f && P[f] === s && P[s] === C);
  check(`${p}: count`, a.moves.split(' ').length === a.count);
  if (a.rotation) rotated++;

  // text mentions the pieces the owner needs
  const all = steps.map(text).join('\n');
  check(`${p}: text has commutator, letters`, all.includes(a.notationSeen) && all.includes(row.otherNow) && all.includes(row.helper));
  check(`${p}: text has rotation`, !a.rotation || all.includes(a.rotation));
  check(`${p}: exception note`, !row.exception || all.includes('Exception'));
  rowsOk++;
}
check('378 rows', pairRule.length === 378 && rowsOk === 378);
check('8 exceptions', pairRule.filter((r) => r.exception).length === 8);
check('no cancelled setups (rowSetupSeen null)', cancelled === 0);

// every filter combination: levels (8 subsets) x helpers (16 subsets) x exceptions only (2)
let combos = 0, empty = 0;
for (let lv = 0; lv < 8; lv++) for (let hs = 0; hs < 16; hs++) for (const ex of [false, true]) {
  const f = { levels: [0, 1, 2].filter((i) => lv & (1 << i)), helpers: ['B', 'D', 'F', 'K'].filter((_, i) => hs & (1 << i)), exceptionsOnly: ex };
  const pool = poolFor(f);
  combos++;
  const expected = pairRule.filter((r) => f.levels.includes(r.level) && f.helpers.includes(r.helper) && (!ex || r.exception)).length;
  check(`pool size ${JSON.stringify(f)}`, pool.length === expected);
  const pick = pickPair(pool, 'QT', () => 0.5);
  if (pool.length === 0) { empty++; check('empty pool -> null', pick === null); } else check('pick in pool', pool.includes(pick) && (pool.length === 1 || pick.pair !== 'QT'));
}
const def = poolFor({ levels: [1, 2], helpers: ['B', 'D', 'F', 'K'], exceptionsOnly: false });
check('default pool 244', def.length === 244);
const ex = poolFor({ levels: [0, 1, 2], helpers: ['B', 'D', 'F', 'K'], exceptionsOnly: true });
check('exceptions pool 8', ex.length === 8);

if (fails.length) { console.log(`${fails.length} FAILED:`); for (const f of fails.slice(0, 30)) console.log(' ', f); process.exit(1); }
console.log(`${rowsOk} pairs, ${rotated} shown with a rotation, ${combos} filter combinations (${empty} give an empty pool, handled), ${def.length} pairs by default`);
console.log('ALL OK');
