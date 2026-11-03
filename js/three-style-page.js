// The 3-style corner pages (ours and Dylan / J Perm): the same layout for both tables.
//   - a summary of the core groups,
//   - "By commutator" (one group per core, pairs ordered by setup length) and "By 1st target" views,
//   - every pair opens to show what the setup moves where, what the core then does, two letter pictures
//     (the pair, and where the setup puts it) and the moves written out.
// Data rows come from data/three-style-*.js (generated and checked in log/): pair, first, second, notation,
// setup, core, insertion, interchange, spots { buffer, first, second } (where the setup puts C and the two
// targets), setupMoves, moves, count, and optionally type / fix / sheet.
import { bldNet } from './bld-net.js?v=4';
import { invertAlg, expandBrackets, cancelMoves } from './algs.js';
import { applyAlg } from './cube-sim.js';
import { trackedSolved } from './cube-laws.js';
import { createMoveRunner } from './move-runner.js?v=1';
import { WHITE_TOP } from './cube-diagram.js';
import { threeStyleTwists } from '../data/three-style-twists.js?v=2';
import { orozcoCorners } from '../data/orozco-corners.js?v=1';
import { OROZCO_PARITY_RUF, OROZCO_PARITY_RUF_WORDS } from '../data/orozco-mnemonics.js?v=4';

const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const name = (l) => `${l} (${SPEFFZ[l]})`;
// Pairs you already know from Orozco: X then B is Orozco's X forwards; B then X is X backwards.
const OROZCO = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r]));
export function orozcoKnown(e) {
  if (e.second === 'B' && OROZCO[e.first]) return { text: `Orozco ${e.first} forwards`, notation: OROZCO[e.first].notation, moves: cancelMoves(OROZCO[e.first].moves) };
  if (e.first === 'B' && OROZCO[e.second]) return { text: `Orozco ${e.second} backwards`, notation: `${OROZCO[e.second].notation}'`, moves: cancelMoves(invertAlg(OROZCO[e.second].moves)) };
  return null;
}
const PALETTE = { ...WHITE_TOP, X: '#d4d4d8' };
const AXIS = { R: [0, 1], L: [0, -1], U: [1, 1], D: [1, -1], F: [2, 1], B: [2, -1] };
const coords = (pieceName) => { const p = [0, 0, 0]; for (const f of pieceName) p[AXIS[f][0]] = AXIS[f][1]; return p.join(); };
// only the listed corners in colour (by where they belong), the rest grey
const greyed = (state, keep) => state.map((s) => ({ ...s, colour: keep.has(s.home.split('|')[0]) ? s.colour : 'X' }));
// A corner's name from any of its sticker letters, written the same way every time: U/D, then F/B, then R/L.
const cornerName = (l) => [...SPEFFZ[l]].sort((a, b) => 'UDFBRL'.indexOf(a) - 'UDFBRL'.indexOf(b)).join('');
// Fixed order for where a cycle starts, so a core and its reverse show the same corners with the arrows turned round.
const CORNER_ORDER = ['UFR', 'UFL', 'UBL', 'UBR', 'DFR', 'DFL', 'DBL', 'DBR'];
function coreCorners(e) {
  const c = [e.spots.buffer, e.spots.first, e.spots.second].map(cornerName);
  let i = 0;
  c.forEach((n, j) => { if (CORNER_ORDER.indexOf(n) < CORNER_ORDER.indexOf(c[i])) i = j; });
  return [...c.slice(i), ...c.slice(0, i)];
}
// A see-through cube (front face square, back face drawn up and to the right) with the three corners named
// and joined by arrows in the order the core moves them.
function cornerDiagram(cycle) {
  const pt = (n) => {
    const x = n.includes('R') ? 1 : -1, y = n.includes('U') ? 1 : -1, z = n.includes('F') ? 1 : -1;
    return [114 + 46 * x - 32 * z, 96 - 46 * y + 16 * z];
  };
  const f = (v) => v.toFixed(1);
  const edges = [];
  for (const a of CORNER_ORDER) for (const b of CORNER_ORDER) {
    if (a >= b) continue;
    const diff = [0, 1, 2].filter((k) => a[k] !== b[k]).length;
    if (diff !== 1) continue;
    const back = a.includes('DBL') || b.includes('DBL');
    const [p, q] = [pt(a), pt(b)];
    edges.push(`<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" class="cd-edge${back ? ' cd-hidden' : ''}"/>`);
  }
  const arrows = cycle.map((a, i) => {
    const b = cycle[(i + 1) % 3], other = pt(cycle[(i + 2) % 3]);
    const [p, q] = [pt(a), pt(b)];
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    // bend each arrow sideways, away from the third corner, so the three arrows never lie on top of each other
    const l0 = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let nx = -(q[1] - p[1]) / l0, ny = (q[0] - p[0]) / l0;
    if (nx * (other[0] - m[0]) + ny * (other[1] - m[1]) > 0) { nx = -nx; ny = -ny; }
    const ctrl = [m[0] + nx * 20, m[1] + ny * 20];
    const trim = (from, to, r) => { const ux = to[0] - from[0], uy = to[1] - from[1], l = Math.hypot(ux, uy); return [from[0] + (ux / l) * r, from[1] + (uy / l) * r]; };
    const s = trim(p, ctrl, 9), t = trim(q, ctrl, 10);
    const ang = Math.atan2(t[1] - ctrl[1], t[0] - ctrl[0]);
    const head = [[t[0], t[1]], [t[0] - 9 * Math.cos(ang - 0.45), t[1] - 9 * Math.sin(ang - 0.45)], [t[0] - 9 * Math.cos(ang + 0.45), t[1] - 9 * Math.sin(ang + 0.45)]];
    return `<path d="M${f(s[0])} ${f(s[1])} Q${f(ctrl[0])} ${f(ctrl[1])} ${f(t[0])} ${f(t[1])}" class="cd-arrow"/><polygon points="${head.map((h) => h.map(f).join(',')).join(' ')}" class="cd-head"/>`;
  }).join('');
  const dots = CORNER_ORDER.map((n) => {
    const [x, y] = pt(n);
    const on = cycle.includes(n);
    let out = `<circle cx="${f(x)}" cy="${f(y)}" r="${on ? 6 : 3}" class="${on ? 'cd-on' : 'cd-off'}"/>`;
    if (on) {
      const lx = x + (n.includes('R') ? 10 : -10);
      const ly = y + (n.includes('U') ? -10 : 18);
      const anchor = n.includes('R') ? 'start' : 'end';
      out += `<text x="${f(lx)}" y="${f(ly)}" text-anchor="${anchor}" class="cd-label">${n}</text>`;
    }
    return out;
  }).join('');
  return `<svg viewBox="0 0 222 182" class="corner-diagram" role="img" aria-label="${cycle.join(' to ')} to ${cycle[0]}">${edges.join('')}${arrows}${dots}</svg>`;
}
// An animated cube for one algorithm in parts: only the given corners in colour.
function watch(host, parts, moves, keepPieces, startText, doneText) {
  const runner = createMoveRunner(host, { palette: PALETTE });
  const keep = new Set(keepPieces.map(coords));
  runner.set({ parts, start: applyAlg(trackedSolved(), invertAlg(moves)), shown: (st) => greyed(st, keep), startText, doneText });
}
const famKey = (e) => `${e.insertion} · ${e.interchange.replace(/['2]/g, '')}`;
const turnWord = (face) => ({ U: 'top', D: 'bottom', F: 'front', R: 'right', L: 'left', B: 'back' })[face] || face;

// [setup : core] with the setup in orange.
function coloured(e) {
  const c = el('code');
  if (e.setup) c.append('[', el('span', 'mv-setup', e.setup), ' : ', e.core, ']'); else c.append(e.core);
  return c;
}

function net(buffer, first, second) {
  const d = el('div', 'ts-net');
  d.innerHTML = bldNet('corners', { buffers: [buffer], marked: [first, second], letters: [buffer, first, second] });
  return d;
}

// The explanation and pictures for one pair, built when it is first opened.
function pairBody(e) {
  const body = el('div', 'ts-pair-body');
  const s = e.spots;
  const figs = el('div', 'ts-figs');
  const fig = (title, n) => { const f = el('figure', 'ts-fig'); f.append(n, el('figcaption', null, title)); return f; };
  figs.appendChild(fig(`The pair: buffer C (blue), 1st ${e.first}, 2nd ${e.second}`, net('C', e.first, e.second)));
  if (e.setup) figs.appendChild(fig(`After the setup: they are at ${s.buffer}, ${s.first}, ${s.second}`, net(s.buffer, s.first, s.second)));
  body.appendChild(figs);

  const ol = el('ol', 'ts-steps');
  if (e.setup) {
    const moved = [['the buffer', 'C', s.buffer], [`the 1st target`, e.first, s.first], [`the 2nd target`, e.second, s.second]].filter(([, from, to]) => from !== to);
    const stay = [['the buffer', 'C', s.buffer], [`the 1st target`, e.first, s.first], [`the 2nd target`, e.second, s.second]].filter(([, from, to]) => from === to);
    const li = el('li');
    li.append(el('strong', null, 'Setup '), el('span', 'mv-setup', e.setup), `: moves ${moved.length === 0 ? 'none of the three' : moved.length === 1 ? 'one piece' : moved.length === 2 ? 'two pieces' : 'all three'}${moved.length ? ': ' : '.'}`);
    if (moved.length) li.append(moved.map(([what, from, to]) => `${what} ${name(from)} to the spot ${name(to)}`).join('; ') + '.');
    if (stay.length) { const t = stay.map(([what, from]) => `${what} ${from}`).join(' and '); li.append(` ${t[0].toUpperCase()}${t.slice(1)} ${stay.length > 1 ? 'stay' : 'stays'} put.`); }
    ol.appendChild(li);
  }
  const core = el('li');
  core.append(el('strong', null, 'Core '), el('code', null, e.core), `: cycles ${s.buffer} → ${s.first} → ${s.second}. The sticker at ${s.buffer} goes to ${s.first}, ${s.first}'s to ${s.second}, ${s.second}'s back to ${s.buffer}.`);
  if (!e.setup) core.append(' That is the pair itself, so no setup is needed.');
  ol.appendChild(core);
  if (e.setup) {
    const undo = el('li');
    undo.append(el('strong', null, 'Undo the setup '), el('span', 'mv-setup', invertAlg(e.setup)), `: everything goes back, except that ${e.first} and ${e.second} have been solved and the buffer holds a new piece.`);
    ol.appendChild(undo);
  }
  body.appendChild(ol);
  const w = el('button', 'rec-btn ts-watch', 'Watch it on a cube');
  w.type = 'button';
  w.addEventListener('click', () => {
    const host = el('div', 'ts-runner');
    w.replaceWith(host);
    const coreMoves = expandBrackets(e.core);
    const parts = e.setup
      ? [{ name: 'Setup', moves: e.setup, text: `The setup puts the three corners on the core's spots ${s.buffer}, ${s.first}, ${s.second}.` },
        { name: 'Core', moves: coreMoves, text: `The core cycles ${s.buffer} → ${s.first} → ${s.second}.` },
        { name: 'Undo', moves: invertAlg(e.setup), text: 'The setup is undone: the three corners go home.' }]
      : [{ name: 'Core', moves: coreMoves, text: `The core cycles C → ${e.first} → ${e.second}: solved.` }];
    watch(host, parts, e.moves, [SPEFFZ.C, SPEFFZ[e.first], SPEFFZ[e.second]],
      `Only the three corners of this pair are in colour (the rest is grey). Press Next or Play.`, 'Solved: all three corners are home.');
  });
  body.appendChild(w);
  const oz = orozcoKnown(e);
  if (oz) {
    const k = el('p', 'ts-known');
    if (e.orozco || e.moves === oz.moves) k.append(el('strong', null, 'You know this one: '), `it is your ${oz.text}. Nothing new to learn.`);
    else k.append(el('strong', null, 'You know this one: '), `the sheet's commutator is different, but it does exactly what your ${oz.text} does, `, el('code', null, oz.notation), '. Use whichever you prefer.');
    body.appendChild(k);
  }
  const meta = el('p', 'bld-note', `${e.count} moves written out${e.type ? ` · the sheet's type: ${e.type}` : ''}`);
  body.appendChild(meta);
  body.appendChild(el('p', 'ts-moves')).appendChild(el('code', null, e.moves));
  if (e.fix) body.appendChild(el('p', 'ts-fix', `Fixed from the sheet: ${e.fix}.${e.sheet ? ` The sheet has ${e.sheet}.` : ''}`));
  return body;
}

function pairRow(e) {
  const d = el('details', 'ts-pair');
  d.id = `pair-${e.pair}`;
  const sum = el('summary');
  sum.append(el('span', 'ts-pair-name', `${e.first} → ${e.second}`), coloured(e), el('span', 'bld-muted', `${e.count} moves`));
  if (orozcoKnown(e)) { d.classList.add('ts-is-known'); sum.appendChild(el('span', 'ts-badge', 'Orozco')); }
  d.appendChild(sum);
  d.addEventListener('toggle', () => { if (d.open && d.children.length === 1) d.appendChild(pairBody(e)); });
  return d;
}

export function mountThreeStyle({ data, storageKey, summarySlot, appSlot }) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch {} };
  const fams = new Map();
  for (const e of data) { const k = famKey(e); if (!fams.has(k)) fams.set(k, []); fams.get(k).push(e); }
  const famList = [...fams.entries()].sort((a, b) => b[1].length - a[1].length);
  const firsts = [...new Set(data.map((e) => e.first))].sort();
  if (!firsts.includes(saved.first)) saved.first = firsts[0];

  // summary
  if (summarySlot) {
    const bySetup = {};
    data.forEach((e) => (bySetup[e.setupMoves] = (bySetup[e.setupMoves] || 0) + 1));
    const mean = (data.reduce((a, e) => a + e.count, 0) / data.length).toFixed(1);
    const p = el('p');
    p.append(`${data.length} pairs in ${famList.length} core groups, ${mean} moves on average. Setups: `,
      Object.keys(bySetup).sort().map((k) => `${bySetup[k]} with ${k === '0' ? 'none' : `${k} move${k === '1' ? '' : 's'}`}`).join(', '), '.');
    const ul = el('ul', 'bld-list');
    for (const [k, list] of famList.slice(0, 6)) {
      const [ins, face] = k.split(' · ');
      const li = el('li');
      li.append(el('code', null, ins), ` against ${turnWord(face)} turns: ${list.length} pairs`);
      ul.appendChild(li);
    }
    const known = data.filter(orozcoKnown).length;
    const kn = el('p');
    kn.append(el('span', 'ts-badge', 'Orozco'), ` marks the ${known} pairs you already know: X then B is Orozco's X forwards, B then X is X backwards. Any pair you have not learned yet can still be done the Orozco way (1st letter forwards, 2nd backwards): same result, about twice the moves.`);
    summarySlot.append(p, ul, kn);
  }

  // views
  const tabs = el('div', 'ex-tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'View');
  const tab = (view, text) => { const b = el('button', null, text); b.type = 'button'; b.dataset.view = view; b.addEventListener('click', () => { saved.view = view; save(); show(); }); tabs.appendChild(b); return b; };
  tab('core', 'By commutator');
  tab('first', 'By 1st target');
  const coreView = el('div');
  const pureLabel = el('label', 'ts-order');
  const pure = el('input'); pure.type = 'checkbox'; pure.checked = !!saved.pure;
  pureLabel.append(pure, ' Only pairs with no setup');
  const groups = el('div');
  coreView.append(pureLabel, groups);
  pure.addEventListener('change', () => { saved.pure = pure.checked; save(); drawGroups(); });
  const firstView = el('div');
  const letters = el('div', 'ex-tabs ts-letters');
  const firstList = el('div', 'ts-list');
  const firstSummary = el('p', 'bld-note');
  firstView.append(letters, firstSummary, firstList);
  for (const l of firsts) {
    const b = el('button', null, l); b.type = 'button'; b.title = `1st target ${name(l)}`;
    b.addEventListener('click', () => { saved.first = l; save(); drawFirst(); });
    letters.appendChild(b);
  }
  appSlot.append(tabs, coreView, firstView);

  function drawGroups() {
    groups.replaceChildren();
    famList.forEach(([k, list], i) => {
      const shown = list.filter((e) => !pure.checked || !e.setup).sort((a, b) => a.setupMoves - b.setupMoves || a.pair.localeCompare(b.pair));
      if (!shown.length) return;
      const [ins, face] = k.split(' · ');
      const d = el('details', 'ts-core');
      if (i === 0) d.open = true;
      const sum = el('summary');
      sum.append(el('code', null, ins), ` against ${turnWord(face)} turns`, el('span', 'bld-muted', ` · ${list.length} pairs, ${list.filter((e) => !e.setup).length} with no setup`));
      d.appendChild(sum);
      // the cores in this group and the spots each one cycles (its base)
      const cores = new Map();
      for (const e of list) if (!cores.has(e.core)) cores.set(e.core, { e, n: 0 }); 
      for (const e of list) cores.get(e.core).n++;
      const bases = el('div', 'ts-bases');
      bases.appendChild(el('p', 'bld-note', `Every pair here uses one of these ${cores.size} cores. Each picture shows the three corners a core moves, by name, with arrows for where each corner goes (a core and its reverse show the same corners with the arrows turned round). The setup brings the buffer and the two targets onto those three corners; open a pair to see the sticker letters, which say how each corner ends up turned.`));
      const row = el('div', 'ts-figs');
      for (const [core, { e, n }] of cores) {
        const [a, b, c] = coreCorners(e);
        const f = el('figure', 'ts-fig ts-base');
        const nb = el('div', 'ts-corners');
        nb.innerHTML = cornerDiagram([a, b, c]);
        f.append(nb);
        const cap = el('figcaption');
        cap.append(el('code', null, core), ` cycles ${a} → ${b} → ${c} · ${n} pair${n > 1 ? 's' : ''}`);
        f.appendChild(cap);
        row.appendChild(f);
      }
      bases.appendChild(row);
      d.appendChild(bases);
      let last = -1;
      for (const e of shown) {
        if (e.setupMoves !== last) { d.appendChild(el('p', 'ts-core-sub', e.setupMoves ? `Setup of ${e.setupMoves} move${e.setupMoves > 1 ? 's' : ''}` : 'No setup')); last = e.setupMoves; }
        d.appendChild(pairRow(e));
      }
      groups.appendChild(d);
    });
  }
  function drawFirst() {
    letters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b.textContent === saved.first)));
    const rows = data.filter((e) => e.first === saved.first).sort((a, b) => a.second.localeCompare(b.second));
    firstSummary.textContent = `1st target ${name(saved.first)}: ${rows.length} pairs. Tap a pair to see how it works.`;
    firstList.replaceChildren(...rows.map(pairRow));
  }
  function show() {
    const core = saved.view !== 'first';
    tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === (core ? 'core' : 'first'))));
    coreView.hidden = !core;
    firstView.hidden = core;
    // only the shown view is built, so every pair's id (#pair-XY) is on the page once
    if (core) { firstList.replaceChildren(); drawGroups(); } else { groups.replaceChildren(); drawFirst(); }
  }
  show();

  // #pair-XY: open that pair in the 1st-target view
  const openPair = (pair) => {
    if (!data.some((e) => e.pair === pair)) return;
    saved.view = 'first'; saved.first = pair[0]; save(); show();
    const d = document.getElementById(`pair-${pair}`);
    if (d) { d.open = true; d.scrollIntoView(); }
  };
  const m = location.hash.match(/^#pair-([A-X]{2})$/);
  if (m) openPair(m[1]);
  return { openPair };
}

// Parity and twisted corners, for M2 edges (the same on both pages; checked by log/2026-11-03-3style-twists.mjs).
export function mountParityTwists(slot) {
  const p = el('div', 'ts-pt');
  const h = (t, id, short) => { const x = el('h2', 'section-heading', t); x.id = id; x.dataset.short = short; return x; };
  p.appendChild(h('Odd number of corner letters (parity)', 'parity', 'Parity'));
  const ol = el('ol', 'bld-list');
  const li = (...kids) => { const x = el('li'); x.append(...kids); ol.appendChild(x); };
  li('Do your edges with M2 as usual, including your M2 parity algorithm when the edge count is odd. That leaves UL and UB swapped, exactly as for Orozco.');
  li('Do the corner pairs. The last letter X has no partner: do the pair ', el('strong', null, 'X then B'), ' from the list. It moves X home and leaves the buffer and B (UBR) swapped.');
  const ra = el('code', null, OROZCO_PARITY_RUF);
  li('Then the Ra-perm ', ra, ` (${OROZCO_PARITY_RUF_WORDS.map((w) => w.word).join(' · ')}): it swaps the buffer and B back, and UL and UB. The same as Orozco's parity.`);
  li('If the last letter is on the UBR corner itself (B, N or Q): skip the pair, only do the Ra-perm. If it was N or Q, that corner is left twisted: the twist step below fixes it.');
  p.appendChild(ol);

  p.appendChild(h('Twisted corners', 'twists', 'Twists'));
  p.appendChild(el('p', null, "A corner in its own spot but twisted is not memoed as letters (don't break into it). Note it, and fix it at the very end, after the pairs and parity, with your Orozco twist: bring the corner into UBR with a setup that does not touch the buffer, do the twist (or twist backwards), undo the setup. It also twists the buffer; after the last twisted corner the buffer comes out right by itself."));
  const rule = el('p');
  rule.append(el('strong', null, 'Which one: '), 'look at where the white or yellow sticker of the twisted corner is. The table says twist or twist backwards for each. Twist = ', el('code', null, "(R' D' R D)×2 U (D' R' D R)×2 U'"), ', twist backwards = ', el('code', null, "U (R' D' R D)×2 U' (D' R' D R)×2"), '.');
  p.appendChild(rule);
  const wrap = el('div', 'table-wrap');
  const t = el('table', 'bld-table');
  t.createCaption().textContent = 'Twisted corner → setup, twist';
  const hr = t.createTHead().insertRow();
  ['Corner', 'White/yellow faces', 'With your Orozco twist', 'Without B', ''].forEach((x) => hr.appendChild(el('th', null, x)));
  const tb = t.createTBody();
  const letterOf = Object.fromEntries(Object.entries(SPEFFZ).map(([l, n]) => [n, l]));
  for (const r of threeStyleTwists) {
    const tr = tb.insertRow();
    const c = el('td');
    c.append(el('strong', null, r.corner));
    const n = el('div', 'ts-tw-net');
    n.innerHTML = bldNet('corners', { buffers: ['C'], marked: [letterOf[r.corner], 'B'].filter((v, i, a) => a.indexOf(v) === i), letters: ['C', 'B', letterOf[r.corner]] });
    c.appendChild(n);
    const how = el('td');
    if (r.setup) how.append(el('span', 'mv-setup', r.setup), ' · ');
    how.append(r.alg);
    if (r.setup) how.append(' · ', el('span', 'mv-setup', invertAlg(r.setup)));
    how.appendChild(el('div', 'bld-muted', `${r.count} moves`));
    const wcell = el('td');
    const b = el('button', 'rec-btn ts-watch', 'Watch');
    b.type = 'button';
    b.addEventListener('click', () => {
      const host = el('td');
      host.colSpan = 5;
      const row2 = tb.insertRow(tr.sectionRowIndex + 1);
      row2.appendChild(host);
      b.disabled = true;
      const tw = expandBrackets(r.alg === 'twist' ? "(R' D' R D)×2 U (D' R' D R)×2 U'" : "U (R' D' R D)×2 U' (D' R' D R)×2");
      const parts = r.setup ? [{ name: 'Setup', moves: r.setup, text: `The setup brings ${r.corner} into UBR without touching the buffer.` }, { name: r.alg, moves: tw, text: 'The twist turns UBR and the buffer (UFR) opposite ways.' }, { name: 'Undo', moves: invertAlg(r.setup), text: 'The setup is undone.' }]
        : [{ name: r.alg, moves: tw, text: 'The twist turns UBR and the buffer (UFR) opposite ways.' }];
      watch(host, parts, r.moves, ['UFR', r.corner], `Only ${r.corner} and the buffer in colour; ${r.corner} is twisted. Press Next or Play.`, `${r.corner} is fixed; the buffer is twisted the other way, which the last twist of a solve undoes.`);
    });
    wcell.appendChild(b);
    const nb = el('td');
    nb.append(el('code', null, r.noB.notation), el('div', 'bld-muted', `${r.noB.count} moves`));
    tr.append(c, el('td', null, r.faces), how, nb, wcell);
  }
  wrap.appendChild(t);
  p.appendChild(wrap);
  p.appendChild(el('p', 'bld-note', "Without B: the same job in 16-17 moves with no B turn: one core, R' D R D' R' D R, against a top turn, with at most D R as a setup (the same idea as the sheet's 2-Twists tab). L cannot replace B in the Orozco way: L never touches UBR, the corner your Orozco twist works on, and U or R would move the buffer. Checked: 3,000 whole solves per table, and with the twists without B, all solved."));
  slot.appendChild(p);
}
