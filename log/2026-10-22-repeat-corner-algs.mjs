// Repeat-style corner algorithms: words of 2 to 4 turns repeated k times, where X^k leaves every edge
// and centre solved and changes only corners. For a method that solves edges first (easy to track by
// their two colours) and corners last.
//   node log/2026-10-22-repeat-corner-algs.mjs
import { PIECES, makeMoves, turns, FACES, solvedState, apply, isHome } from './2026-10-22-sim-engine.mjs';

const ALL = makeMoves(turns(FACES));
const CORNERS = PIECES.filter((p) => p.kind === 'corner');
const EDGES = PIECES.filter((p) => p.kind === 'edge');
const AXIS = { U: 0, D: 0, R: 1, L: 1, F: 2, B: 2 };
const MAXLEN = 24;
function describe(st) {
  const moved = [], twisted = [];
  for (const c of CORNERS) {
    if (isHome(st, c)) continue;
    if (c.ids.includes(st[c.ids[0]])) twisted.push(c.name); else moved.push(c.name);
  }
  return { moved, twisted };
}
const words = [[]];
for (let len = 1; len <= 4; len++) {
  const next = [];
  for (const w of words.filter((x) => x.length === len - 1)) for (const m of ALL) {
    const last = w.at(-1);
    if (last && (last.family === m.family || AXIS[last.family] === AXIS[m.family])) continue;
    next.push([...w, m]);
  }
  words.push(...next);
}
const results = new Map();
for (const w of words.filter((x) => x.length >= 2)) {
  let X = solvedState();
  for (const m of w) X = apply(X, m.perm);
  let st = solvedState();
  for (let k = 1; k * w.length <= MAXLEN; k++) {
    const next = new Int16Array(st.length);
    for (let i = 0; i < st.length; i++) next[i] = X[st[i]];
    st = next;
    if (!EDGES.every((p) => isHome(st, p))) continue;
    const { moved, twisted } = describe(st);
    if (!moved.length && !twisted.length) break;
    const key = [...st].join();
    const len = k * w.length;
    const prev = results.get(key);
    if (!prev || len < prev.len) results.set(key, { word: w.map((m) => m.name).join(' '), k, len, moved, twisted });
    break;
  }
}
const list = [...results.values()].sort((a, b) => a.len - b.len);
console.log(`${list.length} different corner-only effects from repeated 2- to 4-turn words (up to ${MAXLEN} turns)`);
const kind = (r) => `${r.moved.length ? `moves ${r.moved.length}` : ''}${r.moved.length && r.twisted.length ? ' + ' : ''}${r.twisted.length ? `twists ${r.twisted.length} in place` : ''}`;
const byKind = {};
for (const r of list) (byKind[kind(r)] ??= []).push(r);
for (const [k, rs] of Object.entries(byKind).sort((a, b) => a[1][0].len - b[1][0].len)) {
  const easy = rs.filter((r) => /^[RUD]['2]?( [RUD]['2]?)*$/.test(r.word));
  console.log(`- ${k}: ${rs.length}; shortest ${rs[0].len} turns: ${rs.slice(0, 3).map((r) => `(${r.word})x${r.k} [${[...r.moved, ...r.twisted].join(' ')}]`).join('; ')}`);
  if (easy.length) console.log(`    with R, U, D only: ${easy.slice(0, 4).map((r) => `(${r.word})x${r.k} [${[...r.moved, ...r.twisted].join(' ')}]`).join('; ')}`);
}

// 3-cycles of three top corners only
const top = list.filter((r) => r.twisted.length === 0 && r.moved.length === 3 && r.moved.every((n) => n[0] === 'U'));
console.log(`\n3-cycles of three top corners: ${top.length}; e.g. ${top.slice(0, 6).map((r) => `(${r.word})x${r.k} [${r.moved.join(' ')}]`).join('; ')}`);
