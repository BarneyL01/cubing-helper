// 3-Style corners (buffer UFR) from Dylan's 3-Style Learning Sheet: reads the sheet's "UFR Comms" and "UFR Types"
// tabs (docs/sheets/3-style/*.csv, downloaded from the shared Google Sheet), applies the fixes below, expands every
// commutator to moves and checks on the simulator that it cycles buffer C -> 1st target -> 2nd target -> C and
// moves nothing else. Columns of the sheet are the 1st target, rows the 2nd.
//   node log/2026-11-02-3style-corners.mjs           checks; prints ALL OK
//   node log/2026-11-02-3style-corners.mjs --write   also rewrites data/three-style-corners.js
import { readFileSync, writeFileSync } from 'node:fs';
import { applyAlg, solvedCube } from '../js/cube-sim.js';
import { expandBrackets, cancelMoves } from '../js/algs.js';
import { bldCorners } from '../data/bld.js';
import { spots } from './three-style-lib.mjs';

const root = new URL('..', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
function csv(t) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const table = (file) => {
  const rows = csv(read(file));
  const head = rows[0].slice(1).map((h) => h.split(' ')[0]);
  const out = {};
  for (const r of rows.slice(1)) { const second = r[0].split(' ')[0]; r.slice(1).forEach((c, i) => { if (c.trim()) out[head[i] + second] = c.trim(); }); }
  return out;
};
const comms = table('docs/sheets/3-style/UFR-Comms.csv');
const types = table('docs/sheets/3-style/UFR-Types.csv');

// Cells that do not do what their place in the sheet says, as written. Each fix is checked below.
export const FIXES = {
  NI: { text: "[R' F' R D U : [R' D' R , U2]]", why: 'closing bracket missing in the sheet' },
  IN: { text: "[R' F' R D U : [U2 , R' D' R]]", why: 'closing bracket missing in the sheet' },
  EQ: { text: "[R' , F' L F]", why: 'extra closing bracket in the sheet' },
  KW: { text: "[U R D' : [U' , R' D R]]", why: "the sheet's U R' D' cycles other stickers; U R D' (the sheet's WK backwards) is right" },
  TN: { text: "[R' F' R D' U' : [R' D' R , U2]]", why: "the sheet's R' D R cycles other stickers; R' D' R is right" },
  NT: { text: "[R' F' R D' U : [R' D' R , U2]]", why: "the sheet's R' D R cycles other stickers; R' D' R is right" },
  WL: { text: "[D R2 : [R' U' R , D']]", why: "the sheet's setup D' R2 cycles other stickers; D R2 is right" },
  AI: { text: "[l' D' U : [R D R' , U2]]", why: "the sheet's setup r D' U cycles other stickers; l' D' U is right" },
  GH: { text: "[R' D : [D' R D R' , F']]", why: "the sheet's version also moves edges; this is the sheet's HG backwards" },
  UW: { text: "[U' R2' : [R2 U R2' U' R2 , D]]", why: "empty in the sheet; this is the sheet's WU backwards" },
  SI: { text: "[D R' D : [D' R D R' , F2]]", why: 'the sheet\'s version solves the pair in the other order (I then S); the two halves are swapped here' },
};

const AX = { R: [0, 1], L: [0, -1], U: [1, 1], D: [1, -1], F: [2, 1], B: [2, -1] };
const PIECE = Object.fromEntries(bldCorners.map((r) => [r.letter, r.piece]));
PIECE.C = 'UFR';
const spot = (name) => { const p = [0, 0, 0]; for (const f of name) p[AX[f][0]] = AX[f][1]; const n = [0, 0, 0]; n[AX[name[0]][0]] = AX[name[0]][1]; return `${p.join()}|${n.join()}`; };
const key = (s) => `${s.p.join()}|${s.n.join()}`;
function topLevel(t) { let d = 0; for (let i = 0; i < t.length; i++) { if (t[i] === '[') d++; else if (t[i] === ']') { d--; if (d === 0 && i < t.length - 1) return false; } } return t.startsWith('['); }
export function expand(text) {
  let t = text.trim().replace(/([A-Za-z])2'/g, '$12');
  if (!topLevel(t)) t = `[${t}]`; // e.g. "R' D R U' R : [F , R' U R U']"
  return cancelMoves(expandBrackets(t));
}
// The notation split into its setup (outer conjugates, in order) and its core commutator [A , B]; the insertion is
// the longer part, the interchange the shorter one (one face turn, or a short sequence).
export function split(text) {
  let t = text.trim().replace(/([A-Za-z])2'/g, '$12');
  if (!topLevel(t)) t = `[${t}]`;
  const setups = [];
  for (;;) {
    const inner = t.slice(1, -1);
    let d = 0, colon = -1, comma = -1;
    for (let i = 0; i < inner.length; i++) {
      const c = inner[i];
      if (c === '[') d++; else if (c === ']') d--;
      else if (d === 0 && c === ':' && colon < 0) colon = i;
      else if (d === 0 && c === ',' && comma < 0) comma = i;
    }
    if (colon >= 0) { setups.push(inner.slice(0, colon).trim()); t = inner.slice(colon + 1).trim(); continue; }
    const a = inner.slice(0, comma).trim().replace(/\s+/g, ' '), b = inner.slice(comma + 1).trim().replace(/\s+/g, ' ');
    const aLong = a.split(' ').length >= b.split(' ').length;
    return { setup: setups.join(' '), core: `[${a} , ${b}]`, insertion: aLong ? a : b, interchange: aLong ? b : a };
  }
}
const fails = [];
const check = (name, ok) => { if (!ok) fails.push(name); };
const entries = [];
const pieceId = (l) => [...PIECE[l]].sort().join('');
const LETTERS = Object.keys(PIECE).filter((l) => pieceId(l) !== pieceId('C')).sort(); // J and M are buffer stickers too
for (const first of LETTERS) for (const second of LETTERS) {
  if (pieceId(first) === pieceId(second)) { if (first !== second) check(`${first}${second} same piece listed`, !comms[first + second]); continue; }
  const pair = first + second;
  const sheet = comms[pair];
  // pairs on the same piece as the buffer are not targets (C J M are the buffer)
  const fix = FIXES[pair];
  check(`${pair} present`, !!sheet || !!fix);
  if (!sheet && !fix) continue;
  const text = fix ? fix.text : sheet;
  let moves;
  try { moves = expand(text); } catch { check(`${pair} parses`, false); continue; }
  const st = applyAlg(solvedCube().map((s) => ({ ...s, home: key(s) })), moves);
  const where = new Map(st.map((s) => [s.home, key(s)]));
  const b = spot('UFR'), a = spot(PIECE[first]), c = spot(PIECE[second]);
  check(`${pair} cycles C -> ${first} -> ${second}`, where.get(b) === a && where.get(a) === c && where.get(c) === b);
  check(`${pair} moves only three corners`, st.filter((s) => s.home !== key(s)).length === 9);
  const parts = split(text);
  check(`${pair} core parses`, !!parts.insertion);
  check(`${pair} setup + core = the commutator`, expand(parts.setup ? `[${parts.setup} : ${parts.core}]` : parts.core) === moves);
  let at = null;
  try { at = spots(first, second, parts.setup, parts.core); } catch (err) { check(`${pair} spots: ${err.message}`, false); }
  entries.push({ pair, first, second, notation: text, ...parts, spots: at, setupMoves: parts.setup ? parts.setup.split(' ').length : 0, ...(fix ? { sheet: sheet || '', fix: fix.why } : {}), moves, count: moves.split(' ').length, type: types[pair] || '' });
}
for (const pair of Object.keys(FIXES)) {
  // a fix is only listed if the sheet's own version is wrong
  let wrong = true;
  if (!comms[pair]) continue;
  try { const m = expand(comms[pair]); const st = applyAlg(solvedCube().map((s) => ({ ...s, home: key(s) })), m); const where = new Map(st.map((s) => [s.home, key(s)])); const b = spot('UFR'), a = spot(PIECE[pair[0]]), c = spot(PIECE[pair[1]]); wrong = !(where.get(b) === a && where.get(a) === c && where.get(c) === b && st.filter((s) => s.home !== key(s)).length === 9); } catch {}
  check(`${pair} fix needed`, wrong);
}
check('378 pairs', entries.length === 378);
const counts = entries.map((e) => e.count);
console.log(`${entries.length} commutators; moves: mean ${(counts.reduce((x, y) => x + y, 0) / counts.length).toFixed(2)}, min ${Math.min(...counts)}, max ${Math.max(...counts)}; ${Object.keys(FIXES).length} fixed from the sheet`);
if (process.argv.includes('--write') && !fails.length) {
  const body = `// BEGIN GENERATED\n// GENERATED by log/2026-11-02-3style-corners.mjs --write. Do not edit by hand.\n// Source: Dylan's 3-Style Learning Sheet ("UFR Comms" and "UFR Types" tabs), buffer UFR (C).\n` +
    `export const threeStyleCorners = ${JSON.stringify(entries, null, 0).replace(/\},\{/g, '},\n{')};\n// END GENERATED\n`;
  writeFileSync(new URL('data/three-style-corners.js', root), body);
  console.log('wrote data/three-style-corners.js');
}
console.log(fails.length ? `FAIL\n${fails.join('\n')}` : 'ALL OK');
