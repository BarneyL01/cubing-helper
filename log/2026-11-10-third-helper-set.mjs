// Third Orozco-style set (2026-11-10): answers to docs/third-base-set-status.md.
// 1. Which helper letters can have 3 no-setup bases that reach every other letter with setups that keep the buffer and
//    the helper still ("solves corners on its own").
// 2. Helper D with [R' D^k R , U'] (default; pass KTH or LOS for [F D^k F' , U'] / [F' D^k F , U]): letter table, twist,
//    F / I rule, 3,000 whole solves (M2 edges, then corners).
// 3. All 378 pairs with the 9 bases (Orozco B, helper P, helper D), setups of D L B up to 3 moves: coverage, uniform and
//    weighted by how often a pair comes up.
// 4. The rule for picking a base: every letter has one "walk" into a helper's place (0-2 turns); walk one letter, then
//    the other letter's setup for that helper. Every pair checked as a commutator; whole solves with the rule's table.
//   node log/2026-11-10-third-helper-set.mjs [GPS|KTH|LOS]      prints ALL OK or the failures
//   node log/2026-11-10-third-helper-set.mjs --write            also writes data/walk-rule.js (GPS, the set the owner chose)
import { writeFileSync } from 'node:fs';
import { permOf, spotOf, letterAt, expandBrackets, cancelMoves, spots } from './three-style-lib.mjs';
import { orozcoD } from '../data/orozco-d.js';
import { applyAlg } from '../js/cube-sim.js';
import { bldPlan, randomScramble, cornerMemoFrom } from '../js/bld-memo.js';
import { BLD_PARITY } from '../data/bld.js';
import { orozcoCorners, OROZCO_TWIST, OROZCO_TWIST_REV, OROZCO_HELPER_RULES } from '../data/orozco-corners.js';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js';
const fails = []; const check = (n, ok) => { if (!ok) fails.push(n); };
const key = (s) => `${s.p.join()}|${s.n.join()}`;
const C = spotOf('C');
const CORNER = { A: 'AER', B: 'BNQ', C: 'CJM', D: 'DFI', U: 'UGL', V: 'VKP', W: 'WOT', X: 'XHS' };
const FACES_OF = { A: 'ULB', B: 'UBR', C: 'UFR', D: 'UFL', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const cornerOf = (l) => Object.keys(CORNER).find((k) => CORNER[k].includes(l));
const LET = [...'ABDEFGHIKLNOPQRSTUVWX'];
const PAIRS = []; for (const a of LET) for (const b of LET) if (cornerOf(a) !== cornerOf(b)) PAIRS.push(a + b);
const pw = ['', "'", '2'], inv = (m) => (m.endsWith("'") ? m[0] : m.endsWith('2') ? m : m + "'");
const axis = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };
// 'XY' when alg is a pure corner 3-cycle buffer -> X -> Y (9 stickers moved), else null
const cycOf = (alg) => { const p = permOf(expandBrackets(alg)); if (p.filter((v, i) => v !== i).length !== 9 || p[C] === C) return null; const a = p[C], b = p[a]; return p[b] === C ? letterAt.get(a) + letterAt.get(b) : null; };
const swap = (alg) => { const m = alg.match(/^\[(.+) , (.+)\]$/); return `[${m[2]} , ${m[1]}]`; };
const TURNS = [...'DLB'].flatMap((f) => pw.map((q) => f + q));
const mm = {}; for (const t of TURNS) { const p = permOf(t); mm[t] = Object.fromEntries(LET.map((l) => [l, letterAt.get(p[spotOf(l)])])); }
function setups(fs, n) { const out = [{ s: [], m: Object.fromEntries(LET.map((l) => [l, l])) }]; let layer = out.slice();
  for (let k = 1; k <= n; k++) { const nx = []; for (const x of layer) for (const f of fs) if (!x.s.length || x.s.at(-1)[0] !== f) for (const q of pw) { const m = {}; for (const l of LET) m[l] = mm[f + q][x.m[l]]; const e = { s: [...x.s, f + q], m }; nx.push(e); out.push(e); } layer = nx; } return out; }

// ---- 1. every helper letter -------------------------------------------------------------------------------------
const byCycle = new Map();
for (const X of 'RLUDFB') for (const xp of pw) for (const Y of 'RLUDFB') if (axis[Y] !== axis[X]) for (const yp of pw) for (const Z of 'RLUDFB') for (const zp of pw) {
  const I = `${X}${xp} ${Y}${yp} ${inv(X + xp)}`;
  for (const alg of [`[${I} , ${Z}${zp}]`, `[${Z}${zp} , ${I}]`]) { const c = cycOf(alg); if (c) (byCycle.get(c) || byCycle.set(c, []).get(c)).push(alg); }
}
check('198 pure 8-move commutators with the buffer', byCycle.size === 198);
console.log('1. Helper letters: free faces, partners with a no-setup commutator, best 3 (longest / mean setup over the 18 letters)');
for (const h of LET) { const hc = cornerOf(h); const free = [...'DLB'].filter((f) => !FACES_OF[hc].includes(f));
  const xs = LET.filter((x) => cornerOf(x) !== hc && (byCycle.has(h + x) || byCycle.has(x + h)));
  const S = setups(free, 4); const d = {}; for (const { s, m } of S) for (const l of LET) { const k = m[l] + l; if (d[k] === undefined) d[k] = s.length; }
  let best = null; const others = LET.filter((l) => cornerOf(l) !== hc);
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) for (let k = j + 1; k < xs.length; k++) { const t = [xs[i], xs[j], xs[k]]; let max = 0, sum = 0;
    for (const l of others) { const b = Math.min(...t.map((x) => d[x + l] ?? 99)); max = Math.max(max, b); sum += b; }
    if (max < 99 && (!best || max < best.max || (max === best.max && sum < best.sum))) best = { t: t.join(''), max, sum }; }
  console.log(`  ${h} free ${free.join('') || '-'} partners ${xs.join('') || '-'} ${best ? `best ${best.t}: longest ${best.max}, mean ${(best.sum / 18).toFixed(2)}` : 'no complete set'}`); }

// ---- the three helpers ------------------------------------------------------------------------------------------
const variant = ['KTH', 'LOS'].includes(process.argv[2]) ? process.argv[2] : 'GPS';
const DSETS = { GPS: ["[R' D R , U']", "[R' D' R , U']", "[R' D2 R , U']"], KTH: ["[F D F' , U']", "[F D' F' , U']", "[F D2 F' , U']"], LOS: ["[F' D' F , U]", "[F' D2 F , U]", "[F' D F , U]"] };
const H = { B: { free: 'DL', door: 'B', bases: ["[R D R' , U']", "[R D' R' , U']", "[R D2 R' , U']"] },
  P: { free: 'LB', door: 'D', bases: ["[R U R' , D]", "[R U R' , D2]", "[R' D' R , U2]"] },
  D: { free: 'DB', door: 'L', bases: DSETS[variant] } };
for (const [h, o] of Object.entries(H)) {
  o.core = {}; // position -> { fwd: buffer -> pos -> helper, back: buffer -> helper -> pos }
  for (const b of o.bases) for (const a of [b, swap(b)]) { const c = cycOf(a); check(`${a} has ${h}`, c && c.includes(h)); const pos = c.replace(h, ''); (o.core[pos] ||= {})[c[0] === h ? 'back' : 'fwd'] = a; }
  o.pos = Object.keys(o.core);
  o.row = {}; const less = (a, b) => a.s.length < b.s.length || (a.s.length === b.s.length && (a.s.join('').match(/B/g) || []).length < (b.s.join('').match(/B/g) || []).length);
  for (const e of setups([...o.free], 3)) for (const l of LET) if (cornerOf(l) !== cornerOf(h) && o.pos.includes(e.m[l]) && (!o.row[l] || less(e, { s: o.row[l].s.split(' ').filter(Boolean) }))) o.row[l] = { s: e.s.join(' '), n: e.s.length, to: e.m[l] };
  if (h === 'D' && variant === 'GPS') for (const r of orozcoD) { check(`site row ${r.letter} same length`, o.row[r.letter].n === (r.setup ? r.setup.split(' ').length : 0)); o.row[r.letter] = { s: r.setup, n: r.setup ? r.setup.split(' ').length : 0, to: r.pos }; }
  check(`${h}: 18 letters`, Object.keys(o.row).length === 18);
  for (const [l, r] of Object.entries(o.row)) { const f = r.s ? `[${r.s} : ${o.core[r.to].fwd}]` : o.core[r.to].fwd, b = r.s ? `[${r.s} : ${o.core[r.to].back}]` : o.core[r.to].back;
    check(`${h} ${l} forwards`, cycOf(f) === l + h); check(`${h} ${l} backwards`, cycOf(b) === h + l); r.fwd = f; r.back = b; }
  o.stand = {}; for (const q of pw) for (const l of LET) if (mm[o.door + q][l] === h) o.stand[l] = o.door + q;
  const hist = [0, 0, 0, 0]; for (const r of Object.values(o.row)) hist[r.n]++;
  console.log(`\nHelper ${h}: bases ${o.bases.join('  ')}; positions ${o.pos.join(' ')}; setups ${o.free}; setup lengths 0/1/2/3 = ${hist.join('/')}`);
  console.log('  letter (setup > position): ' + LET.filter((l) => o.row[l]).map((l) => `${l} (${o.row[l].s || 'none'} > ${o.row[l].to})`).join(', '));
  console.log('  stand-ins (one turn into the helper\'s place): ' + Object.entries(o.stand).map(([l, t]) => `${l} (${t})`).join(', '));
}

// the B and P rows above must be the setups the site already teaches
{ const { orozcoP } = await import('../data/orozco-p.js');
  const diffB = orozcoCorners.filter((r) => H.B.row[r.letter] && (r.setup || '') !== H.B.row[r.letter].s).map((r) => `${r.letter}: site ${r.setup || 'none'}, here ${H.B.row[r.letter].s || 'none'}`);
  const diffP = orozcoP.filter((r) => H.P.row[r.letter] && (r.setup || '') !== H.P.row[r.letter].s).map((r) => `${r.letter}: site ${r.setup || 'none'}, here ${H.P.row[r.letter].s || 'none'}`);
  console.log(`\nSetups that differ from the site's tables: helper B ${diffB.join('; ') || 'none'} | helper P ${diffP.join('; ') || 'none'}`); }

// ---- 2. helper D as a whole method ------------------------------------------------------------------------------
const TWIST = "(R' D' R D)×2 U' (D' R' D R)×2 U", TWIST_REV = "U' (R' D' R D)×2 U (D' R' D R)×2";
{ const st = bldPlan('').state; const a = applyAlg(st, expandBrackets(TWIST)); const moved = a.filter((s) => s.home !== key(s)); const pieces = new Set(moved.map((s) => s.p.join()));
  check('twist: only the buffer corner and D corner, in place', pieces.size === 2 && pieces.has('1,1,1') && pieces.has('-1,1,1') && moved.every((s) => s.home.split('|')[0] === s.p.join()));
  check('twist backwards undoes it', applyAlg(a, expandBrackets(TWIST_REV)).every((s) => s.home === key(s))); }
const OZ = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r])), OZH = Object.fromEntries(OROZCO_HELPER_RULES.map((r) => [r.letter, r]));
const OZT = { twist: OROZCO_TWIST, 'twist-rev': OROZCO_TWIST_REV, skip: '' };
// corners: pairTable (optional) for pairs it has, else helper D letter by letter; odd count: last letter plain Orozco + Ra
function plan(state, rule, pairTable) {
  const t = cornerMemoFrom(state, 'C').map((x) => x.letter); const odd = t.length % 2 === 1; const steps = []; let used = 0;
  const one = (l, first) => (l === 'D' ? '' : l === 'F' || l === 'I' ? expandBrackets(rule[l][first ? 'odd' : 'even'] === 'twist' ? TWIST : TWIST_REV) : expandBrackets(first ? H.D.row[l].fwd : H.D.row[l].back));
  for (let i = 0; i < t.length; i += 2) {
    if (i === t.length - 1) { steps.push(OZH[t[i]] ? expandBrackets(OZT[OZH[t[i]].odd]) : OZ[t[i]].moves); break; }
    const p = t[i] + t[i + 1];
    if (pairTable && pairTable[p]) { steps.push(expandBrackets(pairTable[p].alg)); used++; } else steps.push(one(t[i], true), one(t[i + 1], false));
  }
  return { moves: steps.filter(Boolean).join(' '), parity: odd, used, pairs: Math.floor(t.length / 2) };
}
let seed = 11; const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff) / 2147483648);
const solves = (scr, rule, pairTable, tally) => { const bp = bldPlan(scr); const p = plan(bp.state, rule, pairTable); if (tally) { tally.used += p.used; tally.pairs += p.pairs; }
  const all = [...bp.edges.map((e) => e.moves), bp.parity ? BLD_PARITY[0] : '', p.moves, p.parity ? OROZCO_PARITY_RUF : ''].filter(Boolean).join(' ');
  return applyAlg(bp.state, all).every((s) => s.home === key(s)); };
let RULE = null; const opts = ['twist', 'twist-rev'];
for (const a of opts) for (const b of opts) for (const c of opts) for (const d of opts) { if (RULE) break; const rule = { F: { odd: a, even: b }, I: { odd: c, even: d } };
  seed = 5; let ok = 0; for (let i = 0; i < 400 && ok === i; i++) if (solves(randomScramble(25, rnd), rule)) ok++; if (ok === 400) RULE = rule; }
check('found an F / I rule', !!RULE);
let solved = 0; if (RULE) { seed = 99; for (let i = 0; i < 3000; i++) if (solves(randomScramble(25, rnd), RULE)) solved++; }
check('helper D: 3000 whole solves', solved === 3000);
console.log(`\n2. Helper D on its own: twist ${TWIST}; F / I rule ${JSON.stringify(RULE)}; whole solves ${solved}/3000`);

// ---- 3. the 378 pairs with the 9 bases --------------------------------------------------------------------------
seed = 11; const freq = Object.fromEntries(PAIRS.map((p) => [p, 0]));
for (let i = 0; i < 3000; i++) { const t = cornerMemoFrom(bldPlan(randomScramble(25, rnd)).state, 'C').map((x) => x.letter); for (let j = 0; j + 1 < t.length; j += 2) if (t[j] + t[j + 1] in freq) freq[t[j] + t[j + 1]]++; }
const S3 = setups([...'DLB'], 3);
function table(bases) { const cyc = new Map(); for (const b of bases) for (const a of [b, swap(b)]) cyc.set(cycOf(a), a);
  const t = {}; for (const { s, m } of S3) for (const p of PAIRS) { const c = m[p[0]] + m[p[1]]; if (cyc.has(c) && (!t[p] || t[p].n > s.length)) t[p] = { n: s.length, s: s.join(' '), alg: s.length ? `[${s.join(' ')} : ${cyc.get(c)}]` : cyc.get(c) }; } return t; }
const stats = (t) => { const h = [0, 0, 0, 0, 0]; let w = 0, wn = 0, sum = 0, n = 0; for (const p of PAIRS) if (t[p]) { h[t[p].n]++; sum += t[p].n; n++; w += t[p].n * freq[p]; wn += freq[p]; } return `${n}/378, setup lengths 0/1/2/3/4 = ${h.join('/')}, mean ${(sum / n).toFixed(2)}, weighted by frequency ${(w / wn).toFixed(2)}`; };
const six = [...H.B.bases, ...H.P.bases];
console.log('\n3. Pairs covered, D L B setups up to 3 moves');
console.log('  6 known bases:', stats(table(six)));
for (const [k, v] of Object.entries({ ...DSETS, 'A: [F D^k F\' , U2]': ["[F D F' , U2]", "[F D' F' , U2]", "[F D2 F' , U2]"] })) console.log(`  + ${k}:`, stats(table([...six, ...v])));
const best = table([...six, ...H.D.bases]);
check('9 bases cover 378 with setups up to 3', PAIRS.every((p) => best[p] && cycOf(best[p].alg) === p));

// ---- 4. the rule: one walk per letter ---------------------------------------------------------------------------
const walks = {}; for (const l of LET) { walks[l] = []; if (H[l]) { walks[l].push({ h: l, s: [] }); continue; }
  for (const t of TURNS) if (H[mm[t][l]] && t[0] === H[mm[t][l]].door) walks[l].push({ h: mm[t][l], s: [t] });
  if (!walks[l].length) for (const t of TURNS) for (const u of TURNS) if (u[0] !== t[0] && H[mm[u][mm[t][l]]]) walks[l].push({ h: mm[u][mm[t][l]], s: [t, u] }); }
// walk x into its helper's place, then y's row from where it lands; x first in the pair -> x, helper ... see alg
const cand = (w, x, y, xFirst) => { if (!w) return null; let y2 = y; for (const t of w.s) y2 = mm[t][y2]; const o = H[w.h]; const r = o.row[y2]; if (!r) return null;
  const s = [...w.s, r.s].filter(Boolean).join(' '); const core = o.core[r.to][xFirst ? 'back' : 'fwd']; // x sits in the helper's place
  return { n: w.s.length + r.n, s, h: w.h, walked: x, lands: y2, rowSetup: r.s, into: r.to, core, alg: s ? `[${s} : ${core}]` : core }; };
const pick = (ch, p) => { const a = cand(ch[p[0]], p[0], p[1], true), b = cand(ch[p[1]], p[1], p[0], false); const wa = ch[p[0]] ? ch[p[0]].s.length : 9, wb = ch[p[1]] ? ch[p[1]].s.length : 9;
  if (wa !== wb) return wa < wb ? (a || b) : (b || a); return !a ? b : !b ? a : a.n < b.n || (a.n === b.n && p[0] < p[1]) ? a : b; };
const score = (ch) => { let over = 0, sum = 0; for (const p of PAIRS) { const c = pick(ch, p); if (!c) return 1e9; sum += c.n; if (c.n > 3) over++; } return over * 1000 + sum; };
let ch = Object.fromEntries(LET.map((l) => [l, walks[l][0]])); let cur = score(ch);
for (let pass = 0; pass < 6; pass++) for (const l of LET) for (const w of walks[l]) { const c2 = { ...ch, [l]: w }; const s = score(c2); if (s < cur) { cur = s; ch = c2; } }
const rule = {}; const exceptions = []; const byWalk = [0, 0, 0];
for (const p of PAIRS) { let c = pick(ch, p); check(`rule covers ${p}`, !!c); if (!c) continue; check(`rule ${p} ${c.alg}`, cycOf(c.alg) === p);
  byWalk[ch[c.walked].s.length]++;
  if (c.n > 3) { if (p[0] < p[1]) exceptions.push(`${p} / ${p[1]}${p[0]}: rule gives ${c.s} (4 moves); use ${best[p].alg} and its reverse`); c = { ...best[p], core: best[p].alg.replace(/^\[[^:\[]+ : (\[.*\])\]$/, '$1'), exception: true, ruleSetup: c.s, ruleWalked: c.walked }; }
  rule[p] = c; }
check('rule table: all 378, setups up to 3', PAIRS.every((p) => rule[p] && rule[p].n <= 3 && cycOf(rule[p].alg) === p));
for (const p of PAIRS) check(`${p} and its reverse share a setup`, rule[p].s === rule[p[1] + p[0]].s);
console.log('\n4. The rule. Walk of each letter into a helper\'s place:');
for (const n of [0, 1, 2]) console.log(`  ${n} turns: ` + LET.filter((l) => ch[l] && ch[l].s.length === n).map((l) => `${l} (${ch[l].s.join(' ') || 'none'} > ${ch[l].h})`).join(', '));
console.log('  no walk (always the other letter walks): ' + LET.filter((l) => !ch[l]).join(' '));
console.log(`  pairs by the walked letter's turns 0/1/2: ${byWalk.join('/')}`);
console.log('  rule table:', stats(rule), '| best possible:', stats(best));
console.log(`  exceptions (${exceptions.length} letter pairs):\n    ` + exceptions.join('\n    '));
const tally = { used: 0, pairs: 0 }; let ok = 0; seed = 77; for (let i = 0; i < 3000; i++) if (solves(randomScramble(25, rnd), RULE, rule, tally)) ok++;
check('rule table: 3000 whole solves', ok === 3000);
console.log(`  whole solves with the rule's table: ${ok}/3000 (${tally.used} of ${tally.pairs} pairs from the table; the rest are two letters of one corner, done letter by letter)`);
// ---- 5. any 3 bases (a base = a commutator with its reverse), all 99, added to the 6 known ----------------------
{ const bases = []; const seen = new Set(); for (const [c, algs] of byCycle) { if (seen.has(c)) continue; seen.add(c); seen.add(c[1] + c[0]); bases.push({ alg: algs[0], cyc: [c, c[1] + c[0]] }); }
  check('99 bases', bases.length === 99);
  const six6 = table(six); const base6 = PAIRS.map((p) => (six6[p] ? six6[p].n : 9));
  const cov = bases.map((b) => { const v = new Uint8Array(378).fill(9); for (const { s, m } of S3) PAIRS.forEach((p, i) => { if (b.cyc.includes(m[p[0]] + m[p[1]]) && v[i] > s.length) v[i] = s.length; }); return v; });
  let bestT = null; for (let i = 0; i < 99; i++) for (let j = i + 1; j < 99; j++) for (let k = j + 1; k < 99; k++) { let sum = 0; const a = cov[i], b = cov[j], c = cov[k];
    for (let q = 0; q < 378; q++) sum += Math.min(base6[q], a[q], b[q], c[q]); if (!bestT || sum < bestT.sum) bestT = { sum, t: [i, j, k] }; }
  console.log(`\n5. Any 3 of the 99 bases added to the 6 known (D L B setups up to 3): best ${bestT.t.map((i) => bases[i].alg).join('  ')} -> mean setup ${(bestT.sum / 378).toFixed(2)}`); }
if (process.argv.includes('--write') && variant === 'GPS' && !fails.length) {
  const helpers = Object.entries(H).map(([h, o]) => ({ letter: h, free: o.free, door: o.door, stand: o.stand,
    positions: o.pos.map((x) => ({ pos: x, forwards: o.core[x].fwd, backwards: o.core[x].back })),
    rows: LET.filter((l) => o.row[l]).map((l) => ({ letter: l, setup: o.row[l].s, pos: o.row[l].to })) }));
  const letters = LET.map((l) => (ch[l] ? { letter: l, turns: ch[l].s.join(' '), n: ch[l].s.length, helper: ch[l].h, via: ch[l].s.length === 2 ? mm[ch[l].s[0]][l] : null } : { letter: l, turns: null, n: null, helper: null, via: null }));
  const pairs = PAIRS.map((p) => { const c = rule[p]; const moves = cancelMoves(expandBrackets(c.alg));
    return { pair: p, first: p[0], second: p[1], notation: c.alg, setup: c.s, core: c.core, setupMoves: c.n, moves, count: moves.split(' ').length, spots: spots(p[0], p[1], c.s, c.core),
      ...(c.exception ? { exception: true, ruleSetup: c.ruleSetup, ruleWalked: c.ruleWalked } : { walked: c.walked, helper: c.h, walk: ch[c.walked].s.join(' '), lands: c.lands, rowSetup: c.rowSetup, into: c.into }) }; });
  const hist = [0, 0, 0, 0]; pairs.forEach((x) => hist[x.setupMoves]++);
  const st = { pairs: 378, byWalk, bySetup: hist, meanSetup: +(pairs.reduce((a, x) => a + x.setupMoves, 0) / 378).toFixed(2), exceptions: exceptions.length };
  writeFileSync(new URL('../data/walk-rule.js', import.meta.url), `// BEGIN GENERATED\n// GENERATED by log/2026-11-10-third-helper-set.mjs --write. Do not edit by hand.\n// The walk rule: every letter has one walk (0-2 turns) into a helper's place (B, P or D); a pair is the walk of one\n// letter, then the other letter's setup for that helper, then the base. A pair and its reverse share the setup.\nexport const walkStats = ${JSON.stringify(st)};\nexport const walkHelpers = ${JSON.stringify(helpers).replace(/\},\{"letter":"([BPD])","free"/g, '},\n{"letter":"$1","free"')};\nexport const walkLetters = ${JSON.stringify(letters)};\nexport const walkPairs = ${JSON.stringify(pairs).replace(/\},\{"pair"/g, '},\n{"pair"')};\n// END GENERATED\n`);
  console.log('wrote data/walk-rule.js');
}
console.log(fails.length ? `FAIL (${fails.length})\n${fails.slice(0, 12).join('\n')}` : 'ALL OK');
