// 3-Style by base (3x3/bld/three-style-bases.html): the pairs grouped by the base they use, like Orozco.
// A base solves one pair with no setup; every other pair of the group is the base plus a setup of D and L turns
// that never moves the buffer. Three tabs: the setup moves one target / both targets / N and Q (buffer moves).
// Data: data/three-style-bases.js (generated and checked by log/2026-11-05-3style-bases.mjs).
import { pairRow, coreFigure } from './three-style-page.js?v=10';

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
  slot.append(tabs, lead, groups);

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
  const baseOfCore = (c) => { const b = baseList.find((x) => x.core === c); return b ? `${b.base[0]} → ${b.base[1]}` : ''; };
  draw();
}
