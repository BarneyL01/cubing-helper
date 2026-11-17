// Checks the Pair drill's Decide mode (js/pair-drill.js: decideFor, baseDirection, directionText) for all 378 pairs (2026-11-19).
//   node log/2026-11-19-pair-decide-check.mjs        prints ALL OK
import { permOf, spotOf, letterAt, expandBrackets } from './three-style-lib.mjs';
import { pairRule } from '../data/pair-rule.js';
import { decideFor, baseDirection, directionText, turnsSeen } from '../js/pair-drill.js';

const fails = [];
const check = (name, ok) => { if (!ok) fails.push(name); };
const C = spotOf('C');
const at = (alg, letter) => letterAt.get(permOf(alg)[spotOf(letter)]);
const same = (a, b) => permOf(a).join() === permOf(b).join();
const rel = {}; // helper -> set of "helperFirst/firstHalf" seen

for (const row of pairRule) {
  const p = row.pair;
  const d = decideFor(row);
  check(`${p}: letter in pair`, d.letterOptions.includes(d.letter) && d.letterOptions.length === 2 && d.letter === row.walked);
  check(`${p}: helper`, d.helper === row.helper && d.helperOptions.includes(d.helper));
  check(`${p}: letter reason`, d.letterReason.includes(d.letter));
  check(`${p}: rotation`, d.rotation === ({ F: 'z', K: "y'" }[row.helper] || '') && d.rotationBack === row.rotationBack);

  // turns: held turns move walked to the helper place and other to otherNow
  const held = row.turns || '';
  check(`${p}: walked -> helper`, at(held, row.walked) === row.helper);
  check(`${p}: other -> otherNow`, at(held, row.other) === d.otherNow);
  // seen turns = held turns through the rotation
  if (row.level > 0) {
    const t = turnsSeen(row);
    const seen = [t.first, t.second].filter(Boolean).join(' ');
    check(`${p}: turn = seen turns`, d.turn === seen);
    check(`${p}: rotation + seen + back = held`, same(`${row.rotation} ${seen} ${row.rotationBack}`.trim(), held));
    const o = d.turnOptions;
    check(`${p}: turn option count`, o.length === (row.level === 1 ? 3 : 4));
    check(`${p}: right turn once`, o.filter((x) => x === d.turn).length === 1);
    check(`${p}: options distinct`, new Set(o).size === o.length);
    const faces = (s) => s.split(' ').map((m) => m[0]).join('');
    check(`${p}: options same faces`, o.every((x) => faces(x) === faces(d.turn)));
    if (row.level === 2) {
      check(`${p}: level-2 wrong options change one turn`, o.every((x) => x === d.turn || x.split(' ').filter((m, i) => m !== d.turn.split(' ')[i]).length === 1));
    }
  } else {
    check(`${p}: level 0 no turn`, d.turn === '' && d.turnOptions.length === 0 && held === '');
  }
  // other's setup (seen) after the turns
  check(`${p}: otherSetup`, d.otherSetup !== null && [d.turn, d.otherSetup].filter(Boolean).join(' ') === row.setupSeen);

  // direction: the commutator cycles buffer -> first -> second
  const P = permOf(expandBrackets(row.notation));
  const [f, s] = [spotOf(row.first), spotOf(row.second)];
  check(`${p}: cycle buffer -> first -> second`, P[C] === f && P[f] === s && P[s] === C);
  const dir = d.direction;
  const m = row.coreSeen.match(/^\[(.+) , (.+)\]$/);
  const n1 = m[1].split(' ').length, n2 = m[2].split(' ').length;
  check(`${p}: halves are 1 and 3 moves`, (n1 === 1 && n2 === 3) || (n1 === 3 && n2 === 1));
  check(`${p}: firstHalf`, dir.firstHalf === (n1 === 1 ? 'interchange' : 'insertion') && dir.firstMove === m[1].split(' ')[0]);
  check(`${p}: interchange/insertion`, dir.interchange.split(' ').length === 1 && dir.insertion.split(' ').length === 3 && `[${m[1]} , ${m[2]}]` === d.base);
  check(`${p}: helperFirst = walked is 1st`, dir.helperFirst === (row.walked === row.first));
  check(`${p}: text`, directionText(row).includes(dir.firstMove) && directionText(row).includes(dir.helperFirst ? '1st' : '2nd'));
  // the base as seen after the rotation, with rotation, equals the held base
  const heldCore = expandBrackets(row.core), seenCore = expandBrackets(row.coreSeen);
  check(`${p}: base seen = held base`, same(`${row.rotation} ${seenCore} ${row.rotationBack}`.trim(), heldCore));
  check(`${p}: commutator`, d.commutator.notationSeen === row.notationSeen && !!d.shorter === !!row.exception);
  const k = `${row.helper}: helper-first=${dir.helperFirst} -> ${dir.firstHalf} first`;
  rel[k] = (rel[k] || 0) + 1;
}
// Is "walked letter is the 1st letter" the same as one fixed half coming first, per helper? (reported, not assumed)
const byHelper = {};
for (const k of Object.keys(rel)) { const [h] = k.split(':'); (byHelper[h] ||= []).push(k); }
const consistent = Object.values(byHelper).every((ks) => ks.length === 2);
console.log('relation (walked is 1st letter -> half written first), per helper:');
for (const k of Object.keys(rel).sort()) console.log(`  ${k}: ${rel[k]}`);
console.log(`per helper the first half is fixed by whether the walked letter is 1st: ${consistent}`);
check('relation consistent per helper', consistent);

if (fails.length) { console.log(`${fails.length} FAILED:`); for (const f of fails.slice(0, 30)) console.log(' ', f); process.exit(1); }
console.log(`${pairRule.length} pairs checked`);
console.log('ALL OK');
