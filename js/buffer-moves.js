// The Buffer moves page (3x3/bld/buffer-moves.html): pairs where a setup that moves the buffer beats the walk rule.
// Data: data/buffer-moves.js, generated and checked by log/2026-11-11-buffer-moves.mjs (3-Style (ours) commutators).
import { bufferMoveStats, bufferMoveHard, bufferMoveOther, bufferMoveKeep } from '../data/buffer-moves.js?v=1';
import { pairRow } from './three-style-page.js?v=15';
import { colourCore } from './three-style-families.js?v=12';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const st = (m) => `<span class="mv-setup">${m}</span>`;
const alg = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[${st(m[1])} : ${colourCore(m[2])}]` : colourCore(n); };
const baseOf = (e) => `[${e.insertion} , ${e.interchange}]`;
const STORE = 'cubing-helper:buffer-moves';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; } catch { /* private mode */ }
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch { /* private mode */ } };

// a pair row with "buffer to Q · walk 14 → 11" beside the letters
function row(e) {
  const r = pairRow(e);
  const where = e.bufferMoves ? `buffer to <strong>${e.spots.buffer}</strong>` : 'buffer stays';
  r.querySelector('.ts-pair-name').after(el('span', 'wr-moved', `${where} · walk ${e.walk.count} → ${e.count}`));
  return r;
}

// pairs grouped by base (a base and its halves swapped together), biggest group first; rows built when opened
function groups(slot, list) {
  slot.replaceChildren();
  const by = new Map();
  for (const e of list) { const k = baseOf(e); if (!by.has(k)) by.set(k, []); by.get(k).push(e); }
  for (const [k, xs] of [...by.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) {
    xs.sort((a, b) => b.saves - a.saves || a.pair.localeCompare(b.pair));
    const save = (xs.reduce((a, e) => a + e.saves, 0) / xs.length).toFixed(1);
    const d = el('details', 'ts-core');
    d.append(el('summary', null, `<span><code>${colourCore(k)}</code><span class="ts-sum-base bld-muted">${xs.length} pairs · saves ${save} moves on average · ${xs.map((e) => e.pair).join(' ')}</span></span>`));
    d.addEventListener('toggle', () => { if (d.open && d.children.length === 1) for (const e of xs) d.append(row(e)); });
    slot.append(d);
  }
}

function mountHard(slot, filterSlot) {
  const all = bufferMoveHard, two = all.filter((e) => e.saves >= 2);
  const opts = [['all', `All ${all.length}`], ['two', `Saves 2+ moves (${two.length})`]];
  const show = () => {
    const pick = saved.hard === 'two' ? 'two' : 'all';
    filterSlot.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === pick)));
    groups(slot, pick === 'two' ? two : all);
  };
  filterSlot.replaceChildren();
  for (const [v, label] of opts) {
    const b = el('button', null, label); b.type = 'button'; b.dataset.v = v;
    b.addEventListener('click', () => { saved.hard = v; save(); show(); });
    filterSlot.append(b);
  }
  show();
}

function mountExample(slot) {
  const e = bufferMoveHard.find((x) => x.pair === 'IU');
  slot.append(el('p', 'wr-alg', `<strong>I → U</strong> <code>${alg(e.notation)}</code> · ${e.count} moves (walk rule: <code>${alg(e.walk.notation)}</code>, ${e.walk.count})`));
  const ol = el('ol', 'bld-list');
  ol.innerHTML = `<li>${st('R')} moves the buffer into the Q position. I and U stay put.</li>
    <li>The base <code>${colourCore(e.core)}</code> then cycles Q → I → U: Q's position plays the buffer.</li>
    <li>${st("R'")} puts the buffer back. Net: buffer → I → U.</li>`;
  slot.append(ol);
  const r = row(e); r.removeAttribute('id');
  r.querySelector('summary').prepend(el('span', 'bld-muted', 'Pictures and a cube to watch: '));
  slot.append(r);
}

function mountKeep(slot) {
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Pair</th><th>Walk rule</th><th>Moves</th><th>Buffer moving</th></tr></thead><tbody>
    ${bufferMoveKeep.map((k) => `<tr><th>${k.pair}</th><td class="nw"><code>${alg(k.walk)}</code></td><td>${k.count}</td><td>${k.ours}</td></tr>`).join('')}</tbody></table>`));
}

export function mountBufferMoves(ids) {
  const $ = (id) => document.getElementById(id);
  const s = bufferMoveStats;
  $(ids.stats).innerHTML = `Pairs with I, V, Q or U: ${s.hard} of ${s.hardTotal} are shorter with the buffer moving, ${s.hardMoves[0]} → ${s.hardMoves[1]} moves on average (${s.hardSaves2} save 2 or more). The other ${s.keep} stay with the walk rule. Elsewhere, ${s.other} more pairs drop from ${s.otherMoves[0]} to ${s.otherMoves[1]} moves.`;
  mountExample($(ids.example));
  mountHard($(ids.hard), $(ids.hardFilter));
  groups($(ids.otherMoves), bufferMoveOther.filter((e) => e.bufferMoves));
  groups($(ids.otherStays), bufferMoveOther.filter((e) => !e.bufferMoves));
  mountKeep($(ids.keep));
}
