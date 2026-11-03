// The 3-style corner pages (ours and Dylan / J Perm): the same layout for both tables.
//   - a summary of the core groups,
//   - "By commutator" (one group per core, pairs ordered by setup length) and "By 1st target" views,
//   - every pair opens to show what the setup moves where, what the core then does, two letter pictures
//     (the pair, and where the setup puts it) and the moves written out.
// Data rows come from data/three-style-*.js (generated and checked in log/): pair, first, second, notation,
// setup, core, insertion, interchange, spots { buffer, first, second } (where the setup puts C and the two
// targets), setupMoves, moves, count, and optionally type / fix / sheet.
import { bldNet } from './bld-net.js?v=4';
import { invertAlg } from './algs.js';

const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const name = (l) => `${l} (${SPEFFZ[l]})`;
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
    summarySlot.append(p, ul);
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
    if (core) drawGroups(); else drawFirst();
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
