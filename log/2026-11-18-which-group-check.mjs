// Checks the facts typed into js/which-group.js (face corners, rings, seen faces, worked example) against data/pair-rule.js,
// and that every row's setup = its turns + the other letter's setup (so the pages can split the seen setup).
// Run from the repo root: node log/2026-11-18-which-group-check.mjs
import { pairRule, PAIR_RULE_TURNS, PAIR_RULE_LEVEL2 } from '../data/pair-rule.js';

const FACE_CORNERS = { L: ['AER', 'DFI', 'UGL', 'XHS'], D: ['UGL', 'VKP', 'WOT', 'XHS'], B: ['AER', 'BNQ', 'WOT', 'XHS'] };
const RINGS = { L: ['A I U S', 'D L X R', 'E F G H'], D: ['G K O S', 'H L P T', 'U V W X'], B: ['A H W N', 'B E X O', 'Q R S T'] };
const SEEN_FACE = { "y'": { L: 'F', D: 'D', B: 'L' }, z: { L: 'U', D: 'L', B: 'B' } };
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL', m); };

// where a turn (U-less: L, D, B with ' and 2) takes a letter, by the rings (plain turn = one step forward)
const move = (turn, l) => {
  const face = turn[0], n = turn.endsWith("'") ? -1 : turn.endsWith('2') ? 2 : 1;
  const ring = RINGS[face].map((r) => r.split(' ')).find((r) => r.includes(l));
  if (!ring) return l;
  return ring[(ring.indexOf(l) + n + 8) % 4];
};
const walk = (turns, l) => turns.split(' ').filter(Boolean).reduce((x, t) => move(t, x), l);

for (const f of Object.keys(RINGS)) for (const r of RINGS[f]) for (const l of r.split(' ')) if (!FACE_CORNERS[f].some((c) => c.includes(l))) fail(`ring letter ${l} not on face ${f}`);
for (const l of PAIR_RULE_LEVEL2) {
  if (walk(l.firstTurn, l.letter) !== l.becomes) fail(`level 2 ${l.letter}: ${l.firstTurn} gives ${walk(l.firstTurn, l.letter)} not ${l.becomes}`);
}
for (const h of PAIR_RULE_TURNS.helpers) for (const l of h.letters) {
  if (walk(l.turn, l.letter) !== h.helper) fail(`helper ${h.helper} letter ${l.letter} with ${l.turn} gives ${walk(l.turn, l.letter)}`);
  if (h.rotation && SEEN_FACE[h.rotation][h.face] !== h.faceSeen) fail(`face seen ${h.helper}`);
}
for (const e of pairRule) {
  const n = e.turns ? e.turns.split(' ').length : 0;
  if (e.setup !== `${e.turns} ${e.rowSetup}`.trim()) fail(`${e.pair} setup`);
  if (e.setupSeen.split(' ').filter(Boolean).length !== e.setup.split(' ').filter(Boolean).length) fail(`${e.pair} seen length`);
  if (e.level > 0 && walk(e.turns, e.other) !== e.otherNow) fail(`${e.pair} other letter ${e.other} should be at ${e.otherNow}, rings say ${walk(e.turns, e.other)}`);
  // seen faces of every turn of a helper F / K row
  const rot = e.rotation;
  if (rot) e.turns.split(' ').filter(Boolean).forEach((t, i) => { const s = e.setupSeen.split(' ')[i]; if (SEEN_FACE[rot][t[0]] !== s[0]) fail(`${e.pair} turn ${t} seen as ${s}`); });
}
const qt = pairRule.find((e) => e.pair === 'QT');
if (qt.level !== 2 || qt.via !== 'S' || qt.otherNow !== 'R' || !FACE_CORNERS.B.includes('WOT') || !qt.turns.startsWith('B2')) fail('worked example QT');
console.log(bad ? `${bad} problems` : 'ALL OK');
process.exit(bad ? 1 : 0);
