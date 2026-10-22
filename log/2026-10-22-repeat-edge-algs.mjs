// Repeat-style edge algorithms: short words X (2 or 3 turns) repeated k times, where X^k leaves every
// corner and centre solved and changes only edges. These are candidates for the edge stage of a
// corners-first method ("do X, k times").
//   node log/2026-10-22-repeat-edge-algs.mjs
import { PIECES, makeMoves, turns, FACES, SLICES, solvedState, apply, isHome } from './2026-10-22-sim-engine.mjs';

const ALL = makeMoves([...turns(FACES), ...turns(SLICES)]);
const CORNERS = PIECES.filter((p) => p.kind === 'corner');
const CENTRES = PIECES.filter((p) => p.kind === 'centre');
const EDGES = PIECES.filter((p) => p.kind === 'edge');
const MAXLEN = 16;
const AXIS = { U: 0, D: 0, E: 0, R: 1, L: 1, M: 1, F: 2, B: 2, S: 2 };

function describe(st) {
  const moved = [], flipped = [];
  for (const e of EDGES) {
    if (isHome(st, e)) continue;
    // where did this edge's first sticker go: same position (flipped in place) or elsewhere
    const at = st[e.ids[0]];
    if (e.ids.includes(at)) flipped.push(e.name); else moved.push(e.name);
  }
  return { moved, flipped };
}
const results = new Map();
const words = [];
for (const a of ALL) for (const b of ALL) {
  if (a.family === b.family || AXIS[a.family] === AXIS[b.family]) continue;
  words.push([a, b]);
  for (const c of ALL) {
    if (c.family === b.family || AXIS[c.family] === AXIS[b.family]) continue;
    words.push([a, b, c]);
  }
}
for (const w of words) {
  let X = solvedState();
  for (const m of w) X = apply(X, m.perm);
  let st = solvedState();
  for (let k = 1; k * w.length <= MAXLEN; k++) {
    // st = X^k
    const next = new Int16Array(st.length);
    for (let i = 0; i < st.length; i++) next[i] = X[st[i]];
    st = next;
    const cornersOk = CORNERS.every((p) => isHome(st, p)) && CENTRES.every((p) => isHome(st, p));
    if (!cornersOk) continue;
    const { moved, flipped } = describe(st);
    if (!moved.length && !flipped.length) break; // X^k is the identity: stop
    const effect = `${moved.length ? `moves ${moved.length} (${moved.join(' ')})` : ''}${moved.length && flipped.length ? '; ' : ''}${flipped.length ? `flips ${flipped.length} in place (${flipped.join(' ')})` : ''}`;
    const key = [...st].join();
    const len = k * w.length;
    const prev = results.get(key);
    if (!prev || len < prev.len) results.set(key, { word: w.map((m) => m.name).join(' '), k, len, effect, n: moved.length + flipped.length });
    break; // the first power that works is the useful one
  }
}
const list = [...results.values()].sort((a, b) => a.len - b.len || a.n - b.n);
console.log(`${list.length} different edge-only effects from repeated 2- or 3-turn words (up to ${MAXLEN} turns)`);
const byKind = {};
for (const r of list) {
  const kind = r.effect.replace(/\(.*?\)/g, '').trim();
  (byKind[kind] ??= []).push(r);
}
for (const [kind, rs] of Object.entries(byKind).sort((a, b) => a[1][0].len - b[1][0].len)) {
  console.log(`- ${kind}: ${rs.length} effects; shortest ${rs[0].len} turns, e.g. ${rs.slice(0, 3).map((r) => `(${r.word})x${r.k} [${r.effect}]`).join('; ')}`);
}

// the ones made only of easy turns (U, D, R, M, E), for each kind of effect
console.log('\nOnly U, D, R, M, E turns:');
for (const [kind, rs] of Object.entries(byKind).sort((a, b) => a[1][0].len - b[1][0].len)) {
  const easy = rs.filter((r) => /^[UDRME]['2]?( [UDRME]['2]?)*$/.test(r.word));
  if (easy.length) console.log(`- ${kind}: ${easy.length}; e.g. ${easy.slice(0, 6).map((r) => `(${r.word})x${r.k} [${r.effect.replace(/^(moves|flips) \d+ (in place )?/, '')}]`).join('; ')}`);
}
