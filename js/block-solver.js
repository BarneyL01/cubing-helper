// Roux block practice solver (docs/roux-block-practice-plan.md, section 5 and 11.2). No DOM code, so it runs under
// Node for the checks (log/2026-11-19-roux-block-practice-check.mjs).
//
// A piece's coordinate is the sticker location (0-23 of its kind) of its reference sticker (the sticker on the first
// face in its name: DL -> its D sticker), which fixes both its place and its twist / flip. A block's state is one such
// number per piece. Distances come from breadth-first tables over the pieces (1-3 pieces: one full table; 4-5 pieces:
// one table per 4-piece subset, the largest distance is the bound), and the search is iterative deepening.
//
// The solver frame: the position is given as a move string that leaves every centre home at its start (for the
// default hold, "y z2 <scramble> z2 y'"), so a piece is home when it is in its fixed-frame slot; L and R centres never
// move under the allowed moves (M and r move U F D B centres, as usual in Roux).
import { applyAlg, solvedCube, faceOf } from './cube-sim.js';

const key = (p, n) => `${p.join()}|${n.join()}`;
const kindOf = (p) => p.filter((v) => v !== 0).length; // 3 corner, 2 edge, 1 centre
const SOLVED = solvedCube();
const LOC = { 3: [], 2: [] }; // sticker location keys "x,y,z|nx,ny,nz" by kind (3 corner, 2 edge)
for (const s of SOLVED) if (kindOf(s.p) > 1) LOC[kindOf(s.p)].push(key(s.p, s.n));
const INDEX = { 3: new Map(LOC[3].map((k, i) => [k, i])), 2: new Map(LOC[2].map((k, i) => [k, i])) };
export const LOCATIONS = LOC;
export const homeOf = (name) => pieceInfo(name).home;
const NORMAL = { U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], R: [1, 0, 0], L: [-1, 0, 0] };

// 'DFL' -> { kind: 3, home: location index of its D sticker, pos: '...' }
function pieceInfo(name) {
  const p = [0, 0, 0];
  for (const f of name) NORMAL[f].forEach((v, i) => (p[i] += v));
  const kind = name.length;
  return { name, kind, pos: p.join(), home: INDEX[kind].get(key(p, NORMAL[name[0]])) };
}

export const moveList = (faces) => [...faces].flatMap((f) => [f, `${f}'`, `${f}2`]);
const FACE_ORDER = 'UDLRFBMr';
const AXIS = { U: 1, D: 1, L: 0, R: 0, M: 0, r: 0, F: 2, B: 2 };

export const FIRST_BLOCK = { name: 'first block', pieces: ['DL', 'FL', 'BL', 'DFL', 'DBL'], moves: moveList('UDLRFBMr'), maxDepth: 12,
  groups: [{ name: 'DL edge', pieces: ['DL'] }, { name: 'front pair', pieces: ['DFL', 'FL'] }, { name: 'back pair', pieces: ['DBL', 'BL'] }] };
export const SECOND_BLOCK = { name: 'second block', pieces: ['DR', 'FR', 'BR', 'DFR', 'DBR'], moves: moveList('URMr'), maxDepth: 18,
  groups: [{ name: 'DR edge', pieces: ['DR'] }, { name: 'front pair', pieces: ['DFR', 'FR'] }, { name: 'back pair', pieces: ['DBR', 'BR'] }] };
// the inspection ladder's goals (section 11.2)
export const FB_EDGE = { ...FIRST_BLOCK, name: 'DL edge', pieces: ['DL'], groups: [{ name: 'DL edge', pieces: ['DL'] }] };
export const FB_SQUARE_FRONT = { ...FIRST_BLOCK, name: 'front square', pieces: ['DL', 'FL', 'DFL'], groups: FIRST_BLOCK.groups.slice(0, 2) };
export const FB_SQUARE_BACK = { ...FIRST_BLOCK, name: 'back square', pieces: ['DL', 'BL', 'DBL'], groups: [FIRST_BLOCK.groups[0], FIRST_BLOCK.groups[2]] };

// where every corner / edge sticker location goes under one move
const moveCache = new Map();
function moveTable(m) {
  if (moveCache.has(m)) return moveCache.get(m);
  const tagged = SOLVED.map((s) => ({ ...s, from: key(s.p, s.n) }));
  const t = { 3: new Uint8Array(24), 2: new Uint8Array(24) };
  for (const s of applyAlg(tagged, m)) {
    const k = kindOf(s.p);
    if (k > 1) t[k][INDEX[k].get(s.from)] = INDEX[k].get(key(s.p, s.n));
  }
  moveCache.set(m, t);
  return t;
}

// the location of each piece's reference sticker after a move string (from solved)
export function locate(alg, names) {
  const tagged = SOLVED.map((s) => ({ ...s, from: key(s.p, s.n) }));
  const at = new Map(applyAlg(tagged, alg || '').map((s) => [s.from, key(s.p, s.n)]));
  return names.map((n) => { const pi = pieceInfo(n); return INDEX[pi.kind].get(at.get(LOC[pi.kind][pi.home])); });
}

const encode = (d) => d.reduce((x, v) => x * 24 + v, 0);
function distanceTable(goal, tabs) {
  // breadth-first with a typed-array queue: every reachable code is decoded once
  const n = goal.length, size = 24 ** n;
  const dist = new Uint8Array(size).fill(255);
  const queue = new Uint32Array(size);
  const flat = tabs.map((t) => t.map((a) => a)); // per move: one Uint8Array per piece
  let head = 0, tail = 0;
  dist[encode(goal)] = 0;
  queue[tail++] = encode(goal);
  const digits = new Uint8Array(n);
  while (head < tail) {
    const code = queue[head++];
    const d = dist[code] + 1;
    let c = code;
    for (let i = n - 1; i >= 0; i--) { digits[i] = c % 24; c = (c - digits[i]) / 24; }
    for (const tab of flat) {
      let x = 0;
      for (let i = 0; i < n; i++) x = x * 24 + tab[i][digits[i]];
      if (dist[x] === 255) { dist[x] = d; queue[tail++] = x; }
    }
  }
  return dist;
}

// Where the stickers of the named pieces are after the move string: { DFL: ['x,y,z|nx,ny,nz', ...], ... } (for
// outlining pieces in a picture, e.g. goal 2's "where are the front pair's pieces now").
export function piecesAt(alg, names) {
  const out = {};
  const pos = new Map(names.map((n) => [pieceInfo(n).pos, n]));
  for (const s of applyAlg(SOLVED.map((x) => ({ ...x, from: x.p.join() })), alg || '')) {
    const n = pos.get(s.from);
    if (n) (out[n] ||= []).push(key(s.p, s.n));
  }
  return out;
}

// A sticker-simulator check, independent of the solver's coordinates: the pieces (of `names`) that are not home after
// the move string, judged against the fixed frame (the frame's centres are home before any move).
export function unsolvedPieces(alg, names) {
  const st = applyAlg(SOLVED, alg || '');
  const byPos = new Map();
  for (const s of st) { const k = s.p.join(); if (!byPos.has(k)) byPos.set(k, []); byPos.get(k).push(s); }
  return names.filter((n) => !byPos.get(pieceInfo(n).pos).every((s) => s.colour === faceOf(s.n)));
}

// Move pairs on one axis that do the same as one allowed move (e.g. R M' = r): a "longer" solution containing one is
// a shorter one in disguise.
function samePairs(moves) {
  const sig = (a) => applyAlg(SOLVED, a).map((s) => key(s.p, s.n)).join(';');
  const single = new Set(moves.map(sig));
  const out = new Set();
  for (const a of moves) for (const b of moves) if (a[0] !== b[0] && AXIS[a[0]] === AXIS[b[0]] && single.has(sig(`${a} ${b}`))) out.add(`${a} ${b}`);
  return out;
}

export function prepare(block) {
  const pieces = block.pieces.map(pieceInfo);
  const moves = block.moves;
  const mt = moves.map(moveTable);
  const goal = pieces.map((p) => p.home);
  const subsets = pieces.length <= 3 ? [pieces.map((_, i) => i)] : pieces.length === 4 ? [[0, 1, 2, 3]] : pieces.map((_, skip) => pieces.map((_, i) => i).filter((i) => i !== skip));
  const tables = subsets.map((idx) => ({ idx, dist: distanceTable(idx.map((i) => goal[i]), mt.map((t) => idx.map((i) => t[pieces[i].kind]))) }));
  const bound = (st) => { let h = 0; for (const t of tables) { let x = 0; for (const i of t.idx) x = x * 24 + st[i]; const d = t.dist[x]; if (d > h) h = d; } return h; };
  const face = moves.map((m) => m[0]);
  const pairs = samePairs(moves);
  const step = (st, mi) => st.map((v, i) => mt[mi][pieces[i].kind][v]);

  function search(start, depth, limit) {
    const found = [], path = [];
    let nodes = 0;
    (function dfs(st, g, last) {
      if (found.length >= limit) return;
      nodes++;
      const h = bound(st);
      if (h === 0) { if (g === depth) found.push(path.map((i) => moves[i]).join(' ')); return; }
      if (g + h > depth) return;
      for (let mi = 0; mi < moves.length; mi++) {
        if (last >= 0) {
          const f = face[mi], lf = face[last];
          if (f === lf) continue;
          if (AXIS[f] === AXIS[lf] && FACE_ORDER.indexOf(f) < FACE_ORDER.indexOf(lf)) continue;
        }
        path.push(mi);
        dfs(step(st, mi), g + 1, mi);
        path.pop();
        if (found.length >= limit) return;
      }
    })(start, 0, -1);
    return { found, nodes };
  }

  const idxOf = new Map(moves.map((m, i) => [m, i]));
  // solved after these moves from a start state (solver coordinates; the checker re-checks with the sticker simulator)
  const solvedFrom = (start, ms) => { let st = start; for (const m of ms) st = step(st, idxOf.get(m)); return st.every((v, i) => v === goal[i]); };
  return {
    block,
    // { length, solutions, longer, nodes } for the position the move string gives (in the solver frame)
    solve(setup, opts = {}) { return this.solveState(locate(setup, block.pieces), opts, setup); },
    // the same from a state (one sticker location per piece, in block.pieces order)
    solveState(start, { max = 3, longer = true } = {}) {
      let nodes = 0;
      for (let depth = bound(start); depth <= block.maxDepth; depth++) {
        const r = search(start, depth, max);
        nodes += r.nodes;
        if (!r.found.length) continue;
        const out = { length: depth, solutions: r.found, longer: [], nodes };
        if (longer && depth + 1 <= block.maxDepth) {
          const raw = search(start, depth + 1, 200);
          nodes += raw.nodes;
          for (const s of raw.found) {
            const ms = s.split(' ');
            if (ms.some((_, i) => solvedFrom(start, ms.filter((__, j) => j !== i)))) continue; // a move can go
            if (ms.some((m, i) => i > 0 && pairs.has(`${ms[i - 1]} ${m}`))) continue; // two moves = one allowed move
            out.longer.push(s);
            if (out.longer.length >= max) break;
          }
          out.nodes = nodes;
        }
        return out;
      }
      return { length: null, solutions: [], longer: [], nodes };
    },
    unsolvedPieces: (alg) => unsolvedPieces(alg, block.pieces),
    // for each group, the move number after which its pieces are home and stay home (0 = already done)
    notes(setup, solution) {
      const ms = solution ? solution.split(' ') : [];
      return block.groups.map((g) => {
        let after = 0;
        for (let k = 0; k <= ms.length; k++) if (unsolvedPieces(`${setup} ${ms.slice(0, k).join(' ')}`, g.pieces).length) after = k + 1;
        return { group: g.name, afterMove: after };
      });
    },
  };
}

// For each group of a block, the move number after which its pieces are home and stay home (0 = already done). Needs no
// tables (sticker simulator only), so the page can call it while the solver runs in a worker.
export function notesFor(block, setup, solution) {
  const ms = solution ? solution.split(' ') : [];
  return block.groups.map((g) => {
    let after = 0;
    for (let k = 0; k <= ms.length; k++) if (unsolvedPieces(`${setup} ${ms.slice(0, k).join(' ')}`, g.pieces).length) after = k + 1;
    return { group: g.name, afterMove: after };
  });
}

// the default hold (section 2): scramble white top, green front; solve yellow top, red front, blue-white block left
export const RHO = "y'";
export const frameSetup = (scramble) => `y z2 ${scramble} z2 ${RHO}`;
export const userSetup = (scramble) => `z2 ${scramble} z2 ${RHO}`;

// Typed moves: primes as ' ’ ‘ ` ´, Rw = r, brackets ignored. allowed: a Set of move tokens, or 'any' for every
// non-rotation move. → { moves, bad }
export function parseMoves(text, allowed) {
  const toks = String(text).replace(/[’‘`´]/g, "'").replace(/[()[\]]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const moves = [], bad = [];
  for (let t of toks) {
    t = t.replace(/^([RLUDFB])w/, (_, f) => f.toLowerCase()).replace(/2'$/, '2');
    const ok = /^[RLUDFBMESrludfb](2|')?$/.test(t) && (allowed === 'any' || allowed.has(t));
    if (ok) moves.push(t); else bad.push(t);
  }
  return { moves: moves.join(' '), bad };
}
