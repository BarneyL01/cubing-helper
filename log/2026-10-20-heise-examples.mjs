// Generates and checks the worked examples on the Heise page (data/heise.js GENERATED block).
//   node log/2026-10-20-heise-examples.mjs           checks only; prints ALL OK
//   node log/2026-10-20-heise-examples.mjs --write   also rewrites the GENERATED block
// Every example is a position, a solution and picture frames; the checks run the moves on the
// cube simulator and count the unsolved pieces after each stage.
import { readFileSync, writeFileSync } from 'node:fs';
import { applyAlg, solvedCube, faceOf, caseState } from '../js/cube-sim.js';
import { cancelMoves, expandBrackets, invertAlg } from '../js/algs.js';
import { pieceName } from '../js/bld-memo.js';

const WRITE = process.argv.includes('--write');
const failures = [];
const check = (name, ok, detail = '') => !ok && failures.push(detail ? `${name}: ${detail}` : name);
const log = (...a) => console.log(...a);

// ---- pieces of a state: corners and edges, with where they are and whether they are home
const pieces = (state) => {
  const by = new Map();
  for (const s of state) {
    const k = s.p.join();
    (by.get(k) ?? by.set(k, []).get(k)).push(s);
  }
  return [...by.entries()]
    .map(([k, ss]) => ({ pos: ss[0].p, kind: ss.length, colours: ss.map((s) => s.colour).sort().join(''), home: ss.every((s) => faceOf(s.n) === s.colour) }))
    .filter((x) => x.kind >= 2);
};
const unsolved = (state, kind) => pieces(state).filter((x) => x.kind === kind && !x.home);
const where = (x) => pieceName(x.pos);
// The pieces out of place in the position that `alg` solves.
const startOf = (alg) => caseState(alg);
const PINK = 'pink';
const BLUE = 'blue';
const PURPLE = '#7c3aed';
const nice = (c) => [...c].sort((a, b) => 'UDFBRL'.indexOf(a) - 'UDFBRL'.indexOf(b)).join('');
const COLOURS = [PINK, BLUE, PURPLE, '#16a34a', '#d97706'];

// ---- 1. The spec's commutator is a pure corner 3-cycle
const SPEC_COMM = "R U' R' D R U R' D'";
check('spec commutator is [R U\' R\', D]', expandBrackets("[R U' R', D]") === SPEC_COMM);
{
  const s = applyAlg(solvedCube(), SPEC_COMM);
  const bad = pieces(s).filter((x) => !x.home);
  check('spec commutator: three corners move, nothing else', bad.length === 3 && bad.every((x) => x.kind === 3), bad.map((x) => x.colours).join());
  check('spec commutator: edges and centres untouched', s.filter((t) => t.p.filter((v) => v !== 0).length < 3).every((t) => faceOf(t.n) === t.colour));
}

// ---- 2. Step 4 examples: the last three corners
// base commutators (D, D' and D2 variants of the spec's commutator)
const BASES = ["[R U' R', D]", "[R U' R', D']", "[R U' R', D2]", "[D, R U' R']", "[D', R U' R']", "[D2, R U' R']"];
const TURNS = ['U', 'D', 'R', 'L', 'F', 'B'].flatMap((f) => ['', "'", '2'].map((a) => f + a));
const setups = [[], ...TURNS.map((t) => [t]), ...TURNS.flatMap((a) => TURNS.filter((b) => b[0] !== a[0]).map((b) => [a, b]))];
const cases = [];
for (const S of setups) for (const b of BASES) {
  const setup = S.join(' ');
  const body = expandBrackets(b);
  const alg = [setup, body, invertAlg(setup)].filter(Boolean).join(' ');
  const start = startOf(alg);
  const bad = unsolved(start, 3);
  const others = unsolved(start, 2);
  if (bad.length !== 3 || others.length) continue; // a pure 3-cycle only
  cases.push({ setup, base: b, body, alg, bad, notation: setup ? `[${setup}: ${b}]` : b });
}
const layerOf = (x) => (x.pos[1] === 1 ? 'U' : 'D');
const pick = (pred, label) => {
  const c = cases.find(pred);
  check(`step 4 example found: ${label}`, !!c);
  return c;
};
const step4 = [
  { label: 'Direct: the commutator on its own', c: pick((c) => c.setup === '' && c.base === "[R U' R', D]", 'direct') },
  {
    label: 'One setup move: bring the two right-hand corners down',
    c: pick((c) => c.setup === 'R2' && ['UFR', 'UBR'].every((n) => c.bad.some((x) => where(x) === n)), 'R2 setup'),
  },
  {
    label: 'Two setup moves: all three corners start in the top layer',
    c: pick((c) => c.setup.split(' ').length === 2 && c.bad.every((x) => layerOf(x) === 'U'), 'two-move setup'),
  },
].filter((e) => e.c);

const filmstripFor = (c, intro) => {
  const parts = [];
  if (c.setup) parts.push(c.setup);
  parts.push(c.body);
  if (c.setup) parts.push(invertAlg(c.setup));
  const marks = c.bad.map((x, i) => ({ piece: x.colours, colour: COLOURS[i] }));
  const names = c.bad.map((x) => `the ${nice(x.colours)} corner is at ${where(x)}`).join('; ');
  const frames = [{ after: '', label: 'Start', caption: `${intro} The three unsolved corners are outlined: ${names}. Everything else is solved.` }];
  if (c.setup) {
    frames.push({ after: c.setup, label: `Setup ${c.setup}`, caption: 'The setup moves the corners to where the commutator can reach them.' });
    frames.push({ after: c.body, label: 'Commutator', caption: 'The commutator cycles the three corners; the setup has not been undone yet, so other pieces are displaced.' });
    frames.push({ after: invertAlg(c.setup), label: 'Undo the setup', caption: 'Undoing the setup puts everything else back. The cube is solved.' });
  } else {
    // X Y X' Y' for [R U' R', D]
    frames.push({ after: "R U' R'", label: "X = R U' R'", caption: 'The first part, X.' });
    frames.push({ after: 'D', label: 'Y = D', caption: 'The second part, Y.' });
    frames.push({ after: "R U R'", label: "X' = R U R'", caption: 'X undone.' });
    frames.push({ after: "D'", label: "Y' = D'", caption: 'Y undone. The three corners are cycled home and the cube is solved.' });
  }
  return { alg: parts.join(' '), stickering: 'full', views: ['U', 'D'], marks, legend: c.bad.map((x, i) => ({ colour: COLOURS[i], text: `${nice(x.colours)} corner` })), frames };
};
const step4Cards = step4.map(({ label, c }, i) => {
  const alg = c.alg;
  // frames must follow the moves of the whole algorithm exactly
  return { anchor: `step4-${i + 1}`, name: label, orientation: c.notation, displayAlg: c.notation, noViewer: true, filmstrip: filmstripFor(c, ''), moves: alg };
});
for (const [i, e] of step4.entries()) {
  const after = applyAlg(startOf(e.c.alg), e.c.alg);
  check(`step 4 example ${i + 1} solves the cube`, unsolved(after, 3).length === 0 && unsolved(after, 2).length === 0);
  log(`step 4 example ${i + 1}: ${e.c.notation}  (start: ${e.c.bad.map((x) => `${nice(x.colours)}@${where(x)}`).join(' ')})`);
}

// ---- 3. Step 3 example: two corners solved with one 3-cycle (five unsolved corners -> three -> none)
const cycles = cases.filter((c) => c.setup.split(' ').filter(Boolean).length <= 1);
let two = null;
outer: for (const A of cycles) for (const B of cycles) {
  const scramble = `${A.alg} ${B.alg}`; // positions after A then B from solved
  const solutionAlg = invertAlg(scramble); // B' then A'
  const start = applyAlg(solvedCube(), scramble);
  const badAtStart = unsolved(start, 3);
  const afterFirst = applyAlg(start, invertAlg(B.alg));
  if (badAtStart.length === 5 && unsolved(afterFirst, 3).length === 3 && unsolved(start, 2).length === 0) {
    const total = cancelMoves(solutionAlg).split(' ').length;
    if (!two || total < two.total) two = { A, B, total };
    if (two.total <= 18) break outer;
  }
}
check('step 3 example found: two corners with one 3-cycle', !!two);
let twoCard = null;
if (two) {
  const step1 = invertAlg(two.B.alg); // one 3-cycle: solves two corners, leaves three
  const step2 = invertAlg(two.A.alg); // the final 3-cycle: step 4
  const start = applyAlg(solvedCube(), `${two.A.alg} ${two.B.alg}`);
  const startBad = unsolved(start, 3);
  const mid = applyAlg(start, step1);
  const midBad = unsolved(mid, 3);
  const end = applyAlg(mid, step2);
  check('step 3 example: ends solved', unsolved(end, 3).length === 0 && unsolved(end, 2).length === 0);
  check('step 3 example: edges solved throughout', unsolved(start, 2).length === 0 && unsolved(mid, 2).length === 0);
  const alg = `${step1} ${step2}`;
  const marks = startBad.map((x, i) => ({ piece: x.colours, colour: COLOURS[i] }));
  const names = (bad) => bad.map((x) => nice(x.colours)).join(', ');
  twoCard = {
    anchor: 'step3-two-corners',
    name: 'Two corners with one 3-cycle',
    orientation: 'Edges solved, five corners unsolved.',
    displayAlg: `${step1}   then   ${step2}`,
    noViewer: true,
    filmstrip: {
      alg, stickering: 'full', views: ['U', 'D'], marks,
      legend: startBad.map((x, i) => ({ colour: COLOURS[i], text: `${nice(x.colours)} corner` })),
      frames: [
        { after: '', label: 'Start', caption: `Five corners are unsolved (${names(startBad)}); every edge is solved.` },
        { after: step1, label: 'One 3-cycle', caption: `One corner 3-cycle puts two corners home. Three are left (${names(midBad)}): the position for step 4.` },
        { after: step2, label: 'Step 4', caption: 'A second 3-cycle (step 4) solves the last three corners.' },
      ],
    },
  };
  log(`step 3 example: ${alg}  (${cancelMoves(alg).split(' ').length} moves after cancelling)`);
}

// ---- 4. Step 3: an edge 3-cycle (centres untouched)
const EDGE_ALG = "M' U2 M U2";
const edgeAfter = applyAlg(solvedCube(), EDGE_ALG);
const movedEdges = pieces(edgeAfter).filter((x) => x.kind === 2 && !x.home);
check('edge 3-cycle: exactly three edges move', movedEdges.length === 3);
check('edge 3-cycle: no corner or centre moves', unsolved(edgeAfter, 3).length === 0 && edgeAfter.filter((t) => t.p.filter((v) => v !== 0).length === 1).every((t) => faceOf(t.n) === t.colour));
const edgeStart = startOf(EDGE_ALG);
const edgeBad = unsolved(edgeStart, 2);
const edgeCard = {
  anchor: 'step3-edge-cycle',
  name: 'An edge 3-cycle',
  orientation: 'Three edges unsolved, everything else solved.',
  displayAlg: EDGE_ALG,
  noViewer: true,
  filmstrip: {
    alg: EDGE_ALG, stickering: 'full', views: ['U', 'D', 'cube'],
    marks: edgeBad.map((x, i) => ({ piece: x.colours, colour: COLOURS[i] })),
    legend: edgeBad.map((x, i) => ({ colour: COLOURS[i], text: `${nice(x.colours)} edge` })),
    frames: [
      { after: '', label: 'Start', caption: `Three edges are out of place (${edgeBad.map((x) => nice(x.colours)).join(', ')}).` },
      { after: EDGE_ALG, label: EDGE_ALG, caption: 'Four moves put the three edges home. Two of the edges move in the U layer, one in the M slice.' },
    ],
  },
};

// ---- 5. Square pictures (the solved cube with pieces outlined)
const squareFilm = (marks, views, caption, legend) => ({
  alg: '', stickering: 'full', views, marks, legend,
  frames: [{ after: '', label: '', caption }],
});
const squares = [
  {
    anchor: 'outer-square', name: 'An outer square', orientation: 'A corner, two edges and a centre: a 2x2x1 block.',
    displayAlg: 'Corner + 2 edges + centre', noViewer: true,
    filmstrip: squareFilm(
      ['DFL', 'DF', 'DL', 'D'].map((piece) => ({ piece, colour: PINK })), ['D'],
      'The white/green/red corner, the two white edges beside it and the white centre.',
      [{ colour: PINK, text: 'one outer square (in its solved place)' }]),
  },
  {
    anchor: 'inner-square', name: 'An inner square', orientation: 'An edge and two centres, no corner.',
    displayAlg: 'Edge + 2 centres', noViewer: true,
    filmstrip: squareFilm(
      ['FR', 'F', 'R'].map((piece) => ({ piece, colour: BLUE })), ['cube'],
      'The green/orange edge in the middle layer with the green and orange centres.',
      [{ colour: BLUE, text: 'one inner square (in its solved place)' }]),
  },
];

// ---- output
const out = {
  squares,
  step3: [twoCard, edgeCard].filter(Boolean),
  step4: step4Cards,
};
log(failures.length ? `FAILED (${failures.length}):\n  ${failures.join('\n  ')}` : 'ALL OK');
if (WRITE) {
  const file = 'data/heise.js';
  const text = readFileSync(file, 'utf8');
  const a = text.indexOf('// BEGIN GENERATED');
  const b = text.indexOf('// END GENERATED');
  if (a < 0 || b < 0) throw new Error('no GENERATED block in data/heise.js');
  const body = `// GENERATED by log/2026-10-20-heise-examples.mjs --write. Do not edit by hand.\nexport const heiseExamples = ${JSON.stringify(out, null, 2)};\n`;
  writeFileSync(file, `${text.slice(0, a)}// BEGIN GENERATED\n${body}${text.slice(b)}`);
  log(`wrote ${file}`);
}
process.exitCode = failures.length ? 1 : 0;
