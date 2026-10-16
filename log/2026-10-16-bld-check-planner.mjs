// Check 9 of docs/bld-corner-cycles-plan.md: the Practice tab's bldPlan gives the
// same output as before the Corner/Edge cycles code was added. Compares the
// current js/bld-memo.js with the version in a given git revision.
//   git show a5bb6ac:js/bld-memo.js > /tmp/old-bld-memo.js   (any scratch path)
//   node log/2026-10-16-bld-check-planner.mjs <path to that old file>
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const oldFile = process.argv[2];
if (!oldFile) throw new Error('usage: node log/2026-10-16-bld-check-planner.mjs <old bld-memo.js>');
// The old file imports its neighbours (./cube-sim.js, ./algs.js, ../data/bld.js); copy them next to it.
const dir = join(tmpdir(), 'bld-check-planner');
mkdirSync(join(dir, 'js'), { recursive: true });
mkdirSync(join(dir, 'data'), { recursive: true });
copyFileSync(oldFile, join(dir, 'js', 'bld-memo.js'));
for (const f of ['cube-sim.js', 'algs.js']) copyFileSync(join('js', f), join(dir, 'js', f));
copyFileSync(join('data', 'bld.js'), join(dir, 'data', 'bld.js'));

const oldM = await import(join(dir, 'js', 'bld-memo.js'));
const newM = await import('../js/bld-memo.js');
let seed = 9;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const strip = (plan) => JSON.stringify(plan, (k, v) => (k === 'state' ? undefined : v));
let same = 0;
let diff = 0;
for (let i = 0; i < 500; i++) {
  const scramble = oldM.randomScramble(25, rnd);
  strip(oldM.bldPlan(scramble)) === strip(newM.bldPlan(scramble)) ? same++ : diff++;
}
console.log(`check 9: ${same} same, ${diff} different (500 random scrambles)`);
process.exitCode = diff ? 1 : 0;
