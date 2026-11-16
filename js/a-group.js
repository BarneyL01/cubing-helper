// The A group page (3x3/bld/orozco-a.html): [R' D^k R , U2], helper D's three bases with U2 instead of U'.
// Data: data/a-group.js, generated and checked by log/2026-11-16-a-group.mjs.
import { aGroupStats, aGroupBases, aGroupPairs } from '../data/a-group.js?v=1';
import { pairRow, coreFigure } from './three-style-page.js?v=15';
import { colourCore } from './three-style-families.js?v=12';
import { readingTable } from './buffer-moves.js?v=5';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const STORE = 'cubing-helper:a-group';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; } catch { /* private mode */ }
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch { /* private mode */ } };

function mountBases(slot) {
  const t = el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>D turn</th><th>Helper D (you know)</th><th>A group</th></tr></thead><tbody>
    ${aGroupBases.map((b) => `<tr><th>${b.base.match(/D['2]?/)[0]}</th><td class="nw"><code>${colourCore(b.d)}</code><br><span class="bld-muted">buffer → ${b.dCycle[0]} → ${b.dCycle[1]}</span></td>
      <td class="nw"><code>${colourCore(b.base)}</code><br><span class="bld-muted">buffer → ${b.cycle[0]} → ${b.cycle[1]}</span></td></tr>`).join('')}</tbody></table>`);
  const figs = el('div', 'ts-figs');
  for (const b of aGroupBases) figs.append(coreFigure({ core: b.base, spots: { buffer: 'C', first: b.cycle[0], second: b.cycle[1] } }, () => ` buffer → ${b.cycle[0]} → ${b.cycle[1]}`));
  slot.append(t, figs);
}

function mountCompare(slot) {
  const c = aGroupStats.compare;
  const row = (k, name) => `<tr><th>${name}</th><td>${c[k].stillPairs === 378 ? 'all' : `${c[k].stillPairs} of 378`}, ${c[k].still}</td><td>${c[k].moving}</td><td>${c[k].perSolve}</td></tr>`;
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Bases</th><th>Buffer still</th><th>Buffer may move</th><th>Per solve</th></tr></thead><tbody>
    ${row('BD', 'B + D (6)')}${row('BDP', 'B + D + P (9, now)')}${row('BDA', '<strong>B + D + A (9)</strong>')}</tbody></table>`));
}

// a pair row with its chip, and the "where the base works" table once it is opened
function row(e) {
  const r = pairRow(e);
  const where = e.bufferMoves ? `buffer to <strong>${e.spots.buffer}</strong>` : 'buffer stays';
  r.querySelector('.ts-pair-name').after(el('span', 'wr-moved', `${where} · ${e.count} moves${e.saves > 0 ? ` · ${e.saves} fewer than B and D` : ''}${e.lb ? ' · L/B setup' : ''}`));
  r.addEventListener('toggle', () => { if (r.open && !r.querySelector('.pl-reading')) setTimeout(() => r.querySelector('.ts-pair-body')?.prepend(readingTable(e)), 0); });
  return r;
}

function mountPairs(slot, filterSlot) {
  const opts = [['all', `All ${aGroupPairs.length}`], ['still', `Buffer stays (${aGroupPairs.filter((e) => !e.bufferMoves).length})`]];
  const show = () => {
    const pick = saved.show === 'still' ? 'still' : 'all';
    filterSlot.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === pick)));
    slot.replaceChildren();
    const list = aGroupPairs.filter((e) => pick === 'all' || !e.bufferMoves);
    for (const b of aGroupBases) {
      const k = b.base.slice(1, -1); const xs = list.filter((e) => `${e.insertion} , ${e.interchange}` === k).sort((x, y) => x.setupMoves - y.setupMoves || x.pair.localeCompare(y.pair));
      const d = el('details', 'ts-core');
      d.append(el('summary', null, `<span><code>${colourCore(b.base)}</code><span class="ts-sum-base bld-muted">buffer → ${b.cycle[0]} → ${b.cycle[1]} · ${xs.length} pairs · ${xs.map((e) => e.pair).join(' ')}</span></span>`));
      d.addEventListener('toggle', () => { if (d.open && d.children.length === 1) for (const e of xs) d.append(row(e)); });
      slot.append(d);
    }
  };
  for (const [v, label] of opts) { const bt = el('button', null, label); bt.type = 'button'; bt.dataset.v = v; bt.addEventListener('click', () => { saved.show = v; save(); show(); }); filterSlot.append(bt); }
  show();
}

export function mountAGroup(ids) {
  const $ = (id) => document.getElementById(id);
  const s = aGroupStats;
  $(ids.stats).innerHTML = `With B (Orozco), D and A: ${s.pairs} pairs are shortest with an A-group base (${s.share}% of the pairs in a solve), ${s.noSetup} of them with no setup and ${s.bufferStill} with the buffer staying still. On average they are ${s.savesMean} move shorter than with B and D alone.`;
  mountBases($(ids.bases));
  mountCompare($(ids.compare));
  mountPairs($(ids.pairs), $(ids.filter));
}
