// The 3-style corner pages (ours and Dylan / J Perm): the same layout for both tables.
//   - a summary of the core groups,
//   - "By commutator" (one group per core, pairs ordered by setup length) and "By 1st target" views,
//   - every pair opens to show what the setup moves where, what the core then does, two cube pictures
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
import { makeCube } from './sticker-cube.js?v=4';
import { threeStyleTwists } from '../data/three-style-twists.js?v=2';
import { orozcoCorners } from '../data/orozco-corners.js?v=1';
import { OROZCO_PARITY_RUF, OROZCO_PARITY_RUF_WORDS } from '../data/orozco-mnemonics.js?v=4';

const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const name = (l) => l;
// A corner by its Speffz letter on the top or bottom face (A B C D on top, U V W X on the bottom).
const CORNER_LETTER = { UBL: 'A', UBR: 'B', UFR: 'C', UFL: 'D', DFL: 'U', DFR: 'V', DBR: 'W', DBL: 'X' };
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
// The core's cycle as corner names and as sticker letters, both starting at the same corner.
function coreCorners(e) {
  const l = [e.spots.buffer, e.spots.first, e.spots.second];
  const c = l.map(cornerName);
  let i = 0;
  c.forEach((n, j) => { if (CORNER_ORDER.indexOf(n) < CORNER_ORDER.indexOf(c[i])) i = j; });
  const rot = (x) => [...x.slice(i), ...x.slice(0, i)];
  return { corners: rot(c), letters: rot(l) };
}
// A see-through cube (front face square, back face drawn up and to the right) with the three stickers the core
// moves drawn as squares on their own faces, labelled, and joined by arrows in the order the core moves them.
const CUBE = makeCube(114, 96, 46);
// opts.buffer: the letter to draw blue (default: any of C J M); opts.from: [[start, now]] for pieces a setup moved,
// drawn as a pale square where they started with a purple arrow to where they are now.
function cornerDiagram(cycle, labels, opts = {}) {
  const f = (v) => v.toFixed(1);
  const from = opts.from || [];
  const isBuffer = (l) => (opts.buffer ? l === opts.buffer : 'CJM'.includes(l));
  const arrows = labels.map((a, i) => {
    const b = labels[(i + 1) % 3], other = CUBE.point(labels[(i + 2) % 3]);
    const [p, q] = [CUBE.point(a), CUBE.point(b)];
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    // bend each arrow sideways, away from the third sticker, so the three arrows never lie on top of each other
    const l0 = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let nx = -(q[1] - p[1]) / l0, ny = (q[0] - p[0]) / l0;
    if (nx * (other[0] - m[0]) + ny * (other[1] - m[1]) > 0) { nx = -nx; ny = -ny; }
    const ctrl = [m[0] + nx * 20, m[1] + ny * 20];
    const trim = (from, to, r) => { const ux = to[0] - from[0], uy = to[1] - from[1], l = Math.hypot(ux, uy); return [from[0] + (ux / l) * r, from[1] + (uy / l) * r]; };
    const s = trim(p, ctrl, 5), t = trim(q, ctrl, 7);
    const ang = Math.atan2(t[1] - ctrl[1], t[0] - ctrl[0]);
    const head = [[t[0], t[1]], [t[0] - 9 * Math.cos(ang - 0.45), t[1] - 9 * Math.sin(ang - 0.45)], [t[0] - 9 * Math.cos(ang + 0.45), t[1] - 9 * Math.sin(ang + 0.45)]];
    return `<path d="M${f(s[0])} ${f(s[1])} Q${f(ctrl[0])} ${f(ctrl[1])} ${f(t[0])} ${f(t[1])}" class="cd-arrow"/><polygon points="${head.map((h) => h.map(f).join(',')).join(' ')}" class="cd-head"/>`;
  }).join('');
  const taken = new Set([...cycle, ...from.map(([a]) => cornerName(a))]);
  const dots = CORNER_ORDER.filter((n) => !taken.has(n)).map((n) => { const [x, y] = CUBE.point(n); return `<circle cx="${f(x)}" cy="${f(y)}" r="3" class="cd-off"/>`; }).join('');
  const pale = from.map(([a]) => CUBE.sticker(a, 'sq-from')).join('');
  const moves = from.map(([a, b]) => {
    const [p, q] = [CUBE.point(a), CUBE.point(b)];
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (d < 4) return '';
    const trim = (u, v, r) => [u[0] + ((v[0] - u[0]) / d) * r, u[1] + ((v[1] - u[1]) / d) * r];
    const s0 = trim(p, q, 5), t = trim(q, p, 7);
    const ang = Math.atan2(t[1] - s0[1], t[0] - s0[0]);
    const head = [t, [t[0] - 8 * Math.cos(ang - 0.45), t[1] - 8 * Math.sin(ang - 0.45)], [t[0] - 8 * Math.cos(ang + 0.45), t[1] - 8 * Math.sin(ang + 0.45)]];
    return `<line x1="${f(s0[0])}" y1="${f(s0[1])}" x2="${f(t[0])}" y2="${f(t[1])}" class="cd-setup"/><polygon points="${head.map((h) => h.map(f).join(',')).join(' ')}" class="cd-setup-head"/>`;
  }).join('');
  const squares = labels.map((l) => CUBE.sticker(l, isBuffer(l) ? 'sq-buffer' : 'sq-on')).join('');
  const text = [...labels.map((l) => [l, 'cd-label']), ...from.filter(([a]) => !labels.includes(a)).map(([a]) => [a, 'cd-label cd-label-from'])]
    .map(([l, cls]) => { const a = CUBE.labelAt(l); return `<text x="${f(a.x)}" y="${f(a.y)}" text-anchor="${a.anchor}" class="${cls}">${l}</text>`; }).join('');
  return `<svg viewBox="0 0 222 182" class="corner-diagram" role="img" aria-label="${labels.join(' to ')} to ${labels[0]}">${CUBE.edges()}${dots}${pale}${squares}${moves}${arrows}${text}</svg>`;
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

// A pair as a see-through cube: the buffer (blue) and the two targets with the cycle arrows; from: pieces the
// setup moved (pale square where they started, purple arrow to where they are now).
function pairCube(buffer, first, second, from = []) {
  const d = el('div', 'ts-corners');
  d.innerHTML = cornerDiagram([buffer, first, second].map(cornerName), [buffer, first, second], { buffer, from });
  return d;
}

// The explanation and pictures for one pair, built when it is first opened.
function pairBody(e) {
  const body = el('div', 'ts-pair-body');
  const s = e.spots;
  const figs = el('div', 'ts-figs');
  const fig = (title, n) => { const f = el('figure', 'ts-fig'); f.append(n, el('figcaption', null, title)); return f; };
  // Where each piece is after the setup, named by sticker letter only ("D' moves K into the G position").
  const roles = [['the buffer', 'C', s.buffer], [e.first, e.first, s.first], [e.second, e.second, s.second]];
  const label = (l) => (l === 'C' ? 'buffer' : l);
  const atStart = (l) => (l === 'C' ? 'buffer' : `${l} (the buffer)`);
  const list = (xs) => (xs.length < 3 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);
  figs.appendChild(fig(`The pair: buffer C (blue) → ${e.first} → ${e.second}`, pairCube('C', e.first, e.second)));
  if (e.setup) figs.appendChild(fig(`After the setup: ${roles.filter(([, f, t]) => f !== t).map(([w, , to]) => `${w === 'the buffer' ? 'buffer' : w} in the ${to} position`).join(', ')} (grey: where they started)`, pairCube(s.buffer, s.first, s.second, roles.filter(([, fr, to]) => fr !== to).map(([, fr, to]) => [fr, to]))));
  body.appendChild(figs);

  const ol = el('ol', 'ts-steps');
  const cycle = `${atStart(s.buffer)} → ${s.first} → ${s.second}`;
  const base = { "[R D R' , U']": 'O', "[R D' R' , U']": 'H', "[R D2 R' , U']": 'L' }[e.core];
  if (e.setup) {
    const moved = roles.filter(([, from, to]) => from !== to);
    const stay = roles.filter(([, from, to]) => from === to);
    const li = el('li');
    li.append(el('span', 'mv-setup', e.setup), ` moves ${list(moved.map(([w, , to]) => `${w} into the ${to} position`))}.`);
    if (stay.length) { const t = stay.map(([w]) => w).join(' and '); li.append(` ${t[0].toUpperCase()}${t.slice(1)} ${stay.length > 1 ? 'stay' : 'stays'} put.`); }
    ol.appendChild(li);
  }
  const core = el('li');
  core.append('The commutator ', el('code', null, e.core), base ? ` (your Orozco ${base} base)` : '', ` moves ${cycle}.`);
  if (!e.setup) core.append(' That is the pair itself, so there is no setup.');
  ol.appendChild(core);
  if (e.setup) {
    const undo = el('li');
    const back = roles.filter(([, from, to]) => from !== to).map(([, from, to]) => `${to} back to ${label(from) === 'buffer' ? 'the buffer' : from}`);
    
    undo.append(el('span', 'mv-setup', invertAlg(e.setup)), ` takes ${list(back)}. Net: buffer → ${e.first} → ${e.second}.`);
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
      ? [{ name: 'Setup', moves: e.setup, text: `The setup moves ${list(roles.filter(([, f, t]) => f !== t).map(([w, , t]) => `${w} into the ${t} position`))}.` },
        { name: 'Core', moves: coreMoves, text: `The commutator moves ${cycle}.` },
        { name: 'Undo', moves: invertAlg(e.setup), text: `The setup is undone. Net: buffer → ${e.first} → ${e.second}.` }]
      : [{ name: 'Core', moves: coreMoves, text: `The commutator moves buffer → ${e.first} → ${e.second}: solved.` }];
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

// One core as a picture: the see-through cube with the three positions and arrows, the letter net, and a caption
// (caption(letters) gives the text after the core).
export function coreFigure(e, caption) {
  const { corners: [a, b, c], letters: lt } = coreCorners(e);
  const f = el('figure', 'ts-fig ts-base');
  const nb = el('div', 'ts-corners');
  nb.innerHTML = cornerDiagram([a, b, c], lt);
  f.append(nb);
  const cap = el('figcaption');
  cap.append(el('code', null, e.core), caption(lt));
  f.appendChild(cap);
  return f;
}

export function pairRow(e) {
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
      bases.appendChild(el('p', 'bld-note', `Every pair here uses one of these ${cores.size} cores. Each picture shows the three stickers a core moves, as squares on their own faces (dashed: faces you cannot see from the front), with arrows for where each one goes (a core and its reverse show the same stickers with the arrows turned round). The setup brings the buffer and the two targets onto those three stickers.`));
      const row = el('div', 'ts-figs');
      for (const [core, { e, n }] of cores) row.appendChild(coreFigure(e, (lt) => ` cycles ${lt.join(' → ')} · ${n} pair${n > 1 ? 's' : ''}`));
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
  li('Do your edges with M2 as usual, including your M2 parity algorithm when the edge count is odd. That leaves edges A and D swapped, exactly as for Orozco.');
  li('Do the corner pairs. The last letter X has no partner: do the pair ', el('strong', null, 'X then B'), ' from the list. It moves X home and leaves the buffer and B swapped.');
  const ra = el('code', null, OROZCO_PARITY_RUF);
  li('Then the Ra-perm ', ra, ` (${OROZCO_PARITY_RUF_WORDS.map((w) => w.word).join(' · ')}): it swaps the buffer and B back, and edges A and D. The same as Orozco's parity.`);
  li('If the last letter is B, N or Q (the piece in the B position): skip the pair, only do the Ra-perm. If it was N or Q, that corner is left twisted: the twist step below fixes it.');
  p.appendChild(ol);

  p.appendChild(h('Twisted corners', 'twists', 'Twists'));
  p.appendChild(el('p', null, "A corner in its own spot but twisted is not memoed as letters (don't break into it). Note it, and fix it at the very end, after the pairs and parity, with your Orozco twist: bring the corner into the B position with a setup that does not touch the buffer, do the twist (or twist backwards), undo the setup. It also twists the buffer; after the last twisted corner the buffer comes out right by itself."));
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
    c.append(el('strong', null, CORNER_LETTER[r.corner]));
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
      const parts = r.setup ? [{ name: 'Setup', moves: r.setup, text: `The setup brings ${CORNER_LETTER[r.corner]} into the B position without touching the buffer.` }, { name: r.alg, moves: tw, text: 'The twist turns B and the buffer opposite ways.' }, { name: 'Undo', moves: invertAlg(r.setup), text: 'The setup is undone.' }]
        : [{ name: r.alg, moves: tw, text: 'The twist turns B and the buffer opposite ways.' }];
      watch(host, parts, r.moves, ['UFR', r.corner], `Only ${CORNER_LETTER[r.corner]} and the buffer in colour; ${CORNER_LETTER[r.corner]} is twisted. Press Next or Play.`, `${CORNER_LETTER[r.corner]} is fixed; the buffer is twisted the other way, which the last twist of a solve undoes.`);
    });
    wcell.appendChild(b);
    const nb = el('td');
    nb.append(el('code', null, r.noB.notation), el('div', 'bld-muted', `${r.noB.count} moves`));
    tr.append(c, el('td', null, r.faces), how, nb, wcell);
  }
  wrap.appendChild(t);
  p.appendChild(wrap);
  p.appendChild(el('p', 'bld-note', "Without B: the same job in 16-17 moves with no B turn: one core, R' D R D' R' D R, against a top turn, with at most D R as a setup (the same idea as the sheet's 2-Twists tab). L cannot replace B in the Orozco way: L never touches the B position, where your Orozco twist works, and U or R would move the buffer. Checked: 3,000 whole solves per table, and with the twists without B, all solved."));
  slot.appendChild(p);
}
