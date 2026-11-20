// Checks js/cycle-break-drill.js: for 3,000 random scrambles every cycle break in the corner memo from C is the first
// corner, in the order A B D G H K O, that is neither solved nor already traced, entered on its first letter; the new
// cycle returns to that corner; the order is A B D G H K O. breakScramble: 300 scrambles (half with the helper corners
// B, D, K solved) all have a break, solved edges and (when asked) solved helper corners.
//   node log/2026-11-20-cycle-break-check.mjs    prints ALL OK
import { breakQuestions, breakScramble, CORNER_ORDER } from '../js/cycle-break-drill.js';
import { randomScramble, scrambledState } from '../js/bld-memo.js';
import { unsolvedCounts } from '../js/bld-drill.js?v=4';
import { faceOf } from '../js/cube-sim.js';
let seed = 2011;
const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const fails = [];
const ok = (n, c) => { if (!c) fails.push(n); };
ok(`order ${CORNER_ORDER.map((c) => c.letters[0]).join('')}`, CORNER_ORDER.map((c) => c.letters[0]).join('') === 'ABDGHKO');
const cornerOf = (l) => CORNER_ORDER.find((c) => c.letters.includes(l));
const solved = (st, c) => st.filter((s) => s.p.join() === c.pos).every((s) => s.colour === faceOf(s.n));
let breaks = 0;
for (let i = 0; i < 3000; i++) {
  const sc = randomScramble(25, rnd), st = scrambledState(sc);
  const q = breakQuestions(st);
  for (const b of q.breaks) {
    breaks++;
    const traced = new Set(b.before.map((l) => cornerOf(l).pos));
    const first = CORNER_ORDER.find((c) => !solved(st, c) && !traced.has(c.pos));
    ok(`${sc}: break ${b.answer} = ${first?.letters[0]}`, first && b.answer === first.letters[0]);
    ok(`${sc}: cycle back to ${b.answer}'s corner`, b.cycle[0] === b.answer && cornerOf(b.cycle.at(-1)) === cornerOf(b.answer) && b.cycle.length >= 2);
    ok(`${sc}: checks end at the answer`, b.corners.at(-1).letters[0] === b.answer && b.corners.slice(0, -1).every((c) => c.solved || c.traced));
  }
}
for (let i = 0; i < 300; i++) {
  const helpersSolved = i % 2 === 0;
  const r = breakScramble({ helpersSolved, rnd });
  ok(`breakScramble ${i}`, !!r);
  if (!r) continue;
  const st = scrambledState(r.scramble);
  ok(`breakScramble ${i} has a break`, r.breaks.length > 0 && unsolvedCounts(st).edges === 0);
  if (helpersSolved) ok(`breakScramble ${i} helpers solved`, ['B', 'D', 'K'].every((l) => solved(st, CORNER_ORDER.find((c) => c.letters[0] === l))));
}
console.log(`${breaks} breaks checked`);
console.log(fails.length ? `FAIL ${fails.length}\n${fails.slice(0, 8).join('\n')}` : 'ALL OK');
