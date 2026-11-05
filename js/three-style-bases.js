// 3-Style by base (3x3/bld/three-style-bases.html): the pairs grouped by the base they use, like Orozco.
// A base solves one pair with no setup; every other pair of the group is the base plus a setup of D and L turns
// that never moves the buffer. Three tabs: the setup moves one target / both targets / N and Q (buffer moves).
// Data: data/three-style-bases.js (generated and checked by log/2026-11-05-3style-bases.mjs).
import { pairRow, coreFigure } from './three-style-page.js?v=10';
import { bldNet } from './bld-net.js?v=4';

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const TABS = [
  ['one', 'One target moves'],
  ['both', 'Both targets move'],
  ['nq', 'N and Q'],
];
const LEADS = {
  one: 'The buffer never moves, and the setup (D and L turns) moves only one target into its base position: the other target is already there. The same idea as Orozco, where B is always in place and the setup brings the other target into L, H or O.',
  both: 'The buffer never moves, but the setup (D and L turns) has to move both targets into the base positions. Learn these after the first tab.',
  nq: "Pairs with N or Q. D and L turns never reach the B position, so the setup has to move the buffer too: these are the commutators from the 3-Style page. Pairs with the sticker B are your Orozco pairs, in the first tab.",
};
const reverseCore = (core) => { const [a, b] = core.slice(1, -1).split(' , '); return `[${b} , ${a}]`; };

export function mountThreeStyleBases({ data, baseList, slot, storageKey }) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch {} };
  if (!TABS.some(([k]) => k === saved.tab)) saved.tab = 'one';

  const tabs = el('div', 'ex-tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'List');
  for (const [k, text] of TABS) {
    const n = data.filter((e) => e.kind === k).length;
    const b = el('button', null, `${text} (${n})`);
    b.type = 'button';
    b.dataset.tab = k;
    b.addEventListener('click', () => { saved.tab = k; save(); draw(); });
    tabs.appendChild(b);
  }
  const lead = el('p', 'bld-note');
  const groups = el('div');
  // Search by letters: "KD" shows that pair, "K" every pair with K. While there is text, it replaces the tabs.
  const searchLabel = el('label', 'ts-search');
  const search = el('input');
  search.type = 'search';
  search.placeholder = 'e.g. K or KD';
  search.autocapitalize = 'characters';
  search.autocomplete = 'off';
  search.maxLength = 2;
  searchLabel.append('Find letters ', search);
  const results = el('div');
  slot.append(searchLabel, results, tabs, lead, groups);
  const TAB_NAME = Object.fromEntries(TABS);
  const where = (e) => (e.kind === 'nq' ? TAB_NAME.nq : `${TAB_NAME[e.kind]} · base ${e.base[0]} ${e.base[1]}`);
  function find() {
    const q = search.value.toUpperCase().replace(/[^A-X]/g, '');
    const on = q.length > 0;
    tabs.hidden = lead.hidden = groups.hidden = on;
    results.replaceChildren();
    if (!on) return;
    const row = (e) => { const r = pairRow(e); r.querySelector('summary').appendChild(el('span', 'ts-hint', `${hint(e)} · ${where(e)}`)); return r; };
    if (q.length === 2) {
      const e = data.find((x) => x.pair === q);
      results.appendChild(e ? row(e) : el('p', 'bld-note', q[0] === q[1] ? 'Two letters on the same piece: not a pair.' : `${q} is not a pair (both letters are on the same piece, or one is the buffer).`));
      return;
    }
    const sec = (title, list) => {
      results.appendChild(el('p', 'ts-core-sub', `${title} (${list.length})`));
      list.sort((a, b) => a.pair.localeCompare(b.pair)).forEach((e) => results.appendChild(row(e)));
    };
    const firsts = data.filter((e) => e.first === q), seconds = data.filter((e) => e.second === q);
    if (!firsts.length && !seconds.length) { results.appendChild(el('p', 'bld-note', `${q} is a buffer sticker: no pairs.`)); return; }
    sec(`${q} as the 1st target`, firsts);
    sec(`${q} as the 2nd target`, seconds);
  }
  search.addEventListener('input', find);

  // A base as an entry with no setup, for its picture.
  const baseEntry = (b) => ({ core: b.core, spots: { buffer: 'C', first: b.base[0], second: b.base[1] } });
  const hint = (e) => {
    const moved = [[e.first, e.spots.first], [e.second, e.spots.second]].filter(([f, t]) => f !== t);
    if (!e.setup) return 'the base itself';
    return moved.map(([f, t]) => `${f} into ${t}`).join(', ');
  };

  function draw() {
    tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === saved.tab)));
    lead.textContent = LEADS[saved.tab];
    groups.replaceChildren();
    const list = data.filter((e) => e.kind === saved.tab);
    // group by the base and its reverse (one group per pair of positions)
    const fam = new Map();
    for (const e of list) {
      const k = saved.tab === 'nq' ? [e.core, reverseCore(e.core)].sort().join(' | ') : [...e.base].sort().join('');
      if (!fam.has(k)) fam.set(k, []);
      fam.get(k).push(e);
    }
    const ordered = [...fam.entries()].sort((a, b) => b[1].length - a[1].length);
    ordered.forEach(([k, rows], i) => {
      const d = el('details', 'ts-core');
      if (i === 0) d.open = true;
      const sum = el('summary');
      if (saved.tab === 'nq') {
        const cores = [...new Set(rows.map((e) => e.core))];
        sum.append(...cores.flatMap((c, j) => (j ? [' and ', el('code', null, c)] : [el('code', null, c)])), el('span', 'bld-muted', ` · ${rows.length} pairs`));
      } else {
        const [x, y] = [...k];
        sum.append(el('strong', null, `Base ${x} ${y}`), el('span', 'bld-muted', ` · buffer → ${x} → ${y} and buffer → ${y} → ${x} · ${rows.length} pairs`));
      }
      d.appendChild(sum);
      const figs = el('div', 'ts-figs ts-bases');
      if (saved.tab === 'nq') {
        for (const c of [...new Set(rows.map((e) => e.core))]) figs.appendChild(coreFigure(rows.find((e) => e.core === c), (lt) => ` cycles ${lt.join(' → ')}`));
      } else {
        for (const b of baseList.filter((b) => [...b.base].sort().join('') === k)) {
          figs.appendChild(coreFigure(baseEntry(b), () => ` buffer → ${b.base[0]} → ${b.base[1]} (no setup)`));
        }
      }
      d.appendChild(figs);
      if (saved.tab === 'one') d.appendChild(swapTable(k, rows));
      // forwards and backwards (the base and its reverse), each by setup length
      const cores = [...new Set(rows.map((e) => e.core))].sort((a, b) => (a.startsWith('[R') ? -1 : 1) - (b.startsWith('[R') ? -1 : 1));
      for (const c of cores) {
        const sub = rows.filter((e) => e.core === c).sort((a, b) => a.setupMoves - b.setupMoves || a.pair.localeCompare(b.pair));
        const h = el('p', 'ts-core-sub');
        h.append(el('code', null, c), saved.tab === 'nq' ? '' : ` · buffer → ${baseOfCore(c)}`);
        d.appendChild(h);
        for (const e of sub) {
          const r = pairRow(e);
          r.querySelector('summary').appendChild(el('span', 'ts-hint', hint(e)));
          d.appendChild(r);
        }
      }
      groups.appendChild(d);
    });
  }
  // Which letters can be moved into each of the group's two positions, and with which setup (forwards and backwards
  // use the same ones). A letter with two setups: the short one would also move the other target in some pairs.
  function swapTable(k, rows) {
    const into = { [k[0]]: new Map(), [k[1]]: new Map() };
    for (const e of rows) {
      if (!e.setup) continue;
      for (const [f, t] of [[e.first, e.spots.first], [e.second, e.spots.second]]) {
        if (f === t || !into[t]) continue;
        if (!into[t].has(f)) into[t].set(f, new Set());
        into[t].get(f).add(e.setup);
      }
    }
    const wrap = el('div', 'table-wrap');
    const t = el('table', 'bld-table ts-swap');
    t.createCaption().textContent = 'Letters you can move into each position (setup in orange)';
    const hr = t.createTHead().insertRow();
    ['Into', 'Letter and setup'].forEach((x) => hr.appendChild(el('th', null, x)));
    const tb = t.createTBody();
    let note = false;
    for (const pos of k) {
      const list = [...into[pos].entries()].sort((a, b) => [...a[1]][0].split(' ').length - [...b[1]][0].split(' ').length || a[0].localeCompare(b[0]));
      if (!list.length) continue;
      const tr = tb.insertRow();
      tr.appendChild(el('th', null, pos));
      const td = el('td');
      list.forEach(([f, set], i) => {
        const item = el('span', 'ts-swap-item');
        item.append(el('strong', null, f), ': ');
        [...set].forEach((st, j) => { if (j) item.append(' or '); item.append(el('span', 'mv-setup', st)); });
        if (set.size > 1) { item.append('*'); note = true; }
        td.append(item);
      });
      tr.appendChild(td);
    }
    wrap.appendChild(t);
    // one letter picture per position: the position in blue, every letter that sets up into it outlined
    const nets = el('div', 'ts-figs');
    for (const pos of k) {
      const ls = [...into[pos].keys()].sort();
      if (!ls.length) continue;
      const f = el('figure', 'ts-fig');
      const n = el('div', 'ts-net');
      n.innerHTML = bldNet('corners', { buffers: [pos], marked: ls, letters: [pos, ...ls] });
      f.append(n, el('figcaption', null, `Into ${pos} (blue): ${ls.join(' ')}`));
      nets.appendChild(f);
    }
    const box = el('div');
    box.append(nets, wrap);
    if (note) box.appendChild(el('p', 'bld-note', '* Two setups: the short one would also move the other target in some pairs, so those pairs use the longer one. Open the pair to see which.'));
    return box;
  }
  const baseOfCore = (c) => { const b = baseList.find((x) => x.core === c); return b ? `${b.base[0]} → ${b.base[1]}` : ''; };
  draw();
}
