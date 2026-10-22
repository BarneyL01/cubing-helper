// Engine for trying out solving methods on the simulator (2026-10-22).
// A method is a list of steps; each step adds pieces (or groups of pieces, "bars") one unit at a
// time with the shortest sequence from an allowed move set, keeping every piece solved so far.
// For each unit it records the sequence length (the planning horizon), and how many solved pieces
// are out of place along the way (peak, longest run of moves with something broken).
import { applyAlg, solvedCube } from '../js/cube-sim.js';

export const SOLVED = solvedCube();
const N = SOLVED.length;
const keyOf = (s) => `${s.p.join()}|${s.n.join()}`;
const INDEX = new Map(SOLVED.map((s, i) => [keyOf(s), i]));
const permOfAlg = (alg) => Int16Array.from(applyAlg(SOLVED, alg).map((s) => INDEX.get(keyOf(s))));

// ---- pieces (centres included)
const nameOfPos = (p) => {
  const [x, y, z] = p;
  return [y === 1 ? 'U' : y === -1 ? 'D' : '', z === 1 ? 'F' : z === -1 ? 'B' : '', x === 1 ? 'R' : x === -1 ? 'L' : ''].join('');
};
const byPos = new Map();
SOLVED.forEach((s, i) => (byPos.get(s.p.join()) ?? byPos.set(s.p.join(), []).get(s.p.join())).push(i));
export const PIECES = [...byPos.entries()].map(([k, ids]) => {
  const p = k.split(',').map(Number);
  return { name: nameOfPos(p), p, kind: ids.length === 3 ? 'corner' : ids.length === 2 ? 'edge' : 'centre', ids };
});
export const piece = (name) => {
  const r = PIECES.find((x) => x.name === name);
  if (!r) throw new Error(`no piece ${name}`);
  return r;
};
export const pieces = (pred) => PIECES.filter(pred);

// ---- moves; a move may be a macro (several turns), e.g. Sassy
export function makeMoves(list) {
  // list: [{ name, alg, family }] or plain turn strings
  return list.map((m) => {
    const o = typeof m === 'string' ? { name: m, alg: m } : m;
    return { ...o, perm: permOfAlg(o.alg), len: o.alg.split(' ').length, family: o.family ?? o.name[0] };
  });
}
const AXIS = { U: 0, D: 0, E: 0, R: 1, L: 1, M: 1, F: 2, B: 2, S: 2 };
export const FACES = ['U', 'D', 'R', 'L', 'F', 'B'];
export const SLICES = ['M', 'E', 'S'];
export const turns = (faces, amounts = ['', "'", '2']) => faces.flatMap((f) => amounts.map((a) => f + a));

// ---- state: loc[i] = where sticker i is now
export const solvedState = () => Int16Array.from({ length: N }, (_, i) => i);
export const apply = (st, perm) => {
  const r = new Int16Array(N);
  for (let i = 0; i < N; i++) r[i] = perm[st[i]];
  return r;
};
export const applyText = (st, alg) => (alg.trim() ? apply(st, permOfAlg(alg)) : st);
export const isHome = (st, pc) => pc.ids.every((i) => st[i] === i);

// deterministic random
export function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function randomScramble(rand, n = 25) {
  const out = [];
  while (out.length < n) {
    const f = FACES[Math.floor(rand() * 6)];
    if (out.length && out.at(-1)[0] === f) continue;
    out.push(f + ['', "'", '2'][Math.floor(rand() * 3)]);
  }
  return out.join(' ');
}

// ---- search: shortest sequence (by number of moves; macros count 1) that keeps `cared` solved
// at the end and solves at least one whole group from `groups`. Transposition table on the
// stickers that matter (cared + groups); free pieces are ignored.
export function findUnit(st, { moves, cared, groups, maxDepth = 6, nodeLimit = 3e7 }) {
  const relevant = [...new Set([...cared, ...groups.flat()].flatMap((pc) => pc.ids))];
  const caredIds = cared.flatMap((pc) => pc.ids);
  const groupIds = groups.map((g) => g.flatMap((pc) => pc.ids));
  const goal = (s) => {
    for (const i of caredIds) if (s[i] !== i) return false;
    return groupIds.some((ids) => ids.every((i) => s[i] === i));
  };
  if (goal(st)) return { seq: [], depth: 0 };
  let nodes = 0;
  for (let depth = 1; depth <= maxDepth; depth++) {
    const seen = new Map();
    const path = [];
    const buf = new Uint16Array(relevant.length + 1);
    const dfs = (s, left, lastFamily) => {
      if (++nodes > nodeLimit) throw new Error('node limit');
      if (left === 0) return goal(s);
      for (let j = 0; j < relevant.length; j++) buf[j] = s[relevant[j]] + 48;
      buf[relevant.length] = 48 + left;
      const key = String.fromCharCode.apply(null, buf.subarray(0, relevant.length));
      const prev = seen.get(key);
      if (prev !== undefined && prev >= left) return false;
      seen.set(key, left);
      for (const m of moves) {
        if (m.family === lastFamily) continue;
        // same-axis turns commute: only try them in one order
        if (lastFamily && AXIS[m.family] !== undefined && AXIS[m.family] === AXIS[lastFamily] && m.family < lastFamily) continue;
        const n2 = apply(s, m.perm);
        path.push(m);
        if (dfs(n2, left - 1, m.family)) return true;
        path.pop();
      }
      return false;
    };
    try {
      if (dfs(st, depth, null)) return { seq: path.slice(), depth };
    } catch (e) {
      if (e.message === 'node limit') return null;
      throw e;
    }
  }
  return null;
}

// how many cared pieces are out of place after each move of seq
export function brokenPath(st, seq, cared) {
  const out = [];
  let s = st;
  for (const m of seq) {
    s = apply(s, m.perm);
    out.push(cared.filter((pc) => !isHome(s, pc)).length);
  }
  return out;
}
const longestRun = (path) => {
  let run = 0, best = 0;
  for (const v of path) { run = v ? run + 1 : 0; best = Math.max(best, run); }
  return best;
};

// Run one step: keep adding units from `groups` (whole groups) until all are solved.
// Returns per-unit records, or { failed } if some unit needs more than maxDepth.
export function runStep(st, step, cared) {
  const records = [];
  let todo = step.groups.slice();
  let c = cared.slice();
  // groups already solved by chance count as done
  const settle = () => {
    for (const g of todo.filter((g) => g.every((pc) => isHome(st, pc)))) c.push(...g);
    todo = todo.filter((g) => !g.every((pc) => isHome(st, pc)));
  };
  settle();
  while (todo.length) {
    const r = findUnit(st, { moves: step.moves, cared: c, groups: todo, maxDepth: step.maxDepth, nodeLimit: step.nodeLimit });
    if (!r) return { st, records, cared: c, failed: { left: todo.length } };
    const path = brokenPath(st, r.seq, c);
    for (const m of r.seq) st = apply(st, m.perm);
    records.push({
      moves: r.seq.map((m) => m.name).join(' '),
      depth: r.depth,
      turns: r.seq.reduce((a, m) => a + m.len, 0),
      peak: path.length ? Math.max(...path) : 0,
      run: longestRun(path),
    });
    settle();
  }
  return { st, records, cared: c };
}

// summary helpers
export const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
export const hist = (xs) => {
  const h = {};
  for (const x of xs) h[x] = (h[x] ?? 0) + 1;
  return Object.entries(h).sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}:${v}`).join(' ');
};
