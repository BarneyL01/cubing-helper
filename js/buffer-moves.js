// The Buffer moves page (3x3/bld/buffer-moves.html): pairs where a setup that moves the buffer beats the walk rule.
// Data: data/buffer-moves.js, generated and checked by log/2026-11-11-buffer-moves.mjs (the owner's 9 bases, setups that
// may move the buffer).
import { bufferMoveStats, bufferMoveHard, bufferMoveOther, bufferMoveKeep } from '../data/buffer-moves.js?v=2';
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
  r.querySelector('.ts-pair-name').after(el('span', 'wr-moved', `${where} · helper ${e.helper} base · walk ${e.walk.count} → ${e.count}${e.lb ? ' · L/B setup' : ''}`));
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
  const e = bufferMoveHard.find((x) => x.pair === 'UE');
  const s = e.spots;
  slot.append(el('p', 'wr-alg', `<strong>${e.first} → ${e.second}</strong> <code>${alg(e.notation)}</code> · ${e.count} moves (walk rule: <code>${alg(e.walk.notation)}</code>, ${e.walk.count})`));
  const ol = el('ol', 'bld-list');
  ol.innerHTML = `<li>${st(e.setup)} moves the buffer into the ${s.buffer} position and ${e.second} into the ${s.second} position. ${e.first} stays put.</li>
    <li>Your Orozco L base <code>${colourCore(e.core)}</code> then cycles ${s.buffer} → ${s.first} → ${s.second}. It is the same base: it always turns the
      same three corners, here read from their other stickers (C → L → B read from M is M → U → Q).</li>
    <li>Undo ${st(e.setup)}. Net: buffer → ${e.first} → ${e.second}.</li>`;
  slot.append(ol);
  const r = row(e); r.removeAttribute('id');
  r.querySelector('summary').prepend(el('span', 'bld-muted', 'Pictures and a cube to watch: '));
  slot.append(r);
}

// for the Pair lookup page: the Buffer moves commutator for a pair (only pairs listed on this page), and its steps
const LISTED = Object.fromEntries([...bufferMoveHard, ...bufferMoveOther].map((e) => [e.pair, e]));
export const bufferMoveFor = (pair) => LISTED[pair] || null;
export function explainBufferMove(e) {
  const box = el('div', 'wr-result');
  const s = e.spots;
  const roles = [['the buffer', 'C', s.buffer], [e.first, e.first, s.first], [e.second, e.second, s.second]];
  const moved = roles.filter(([, a, b]) => a !== b), stay = roles.filter(([, a, b]) => a === b);
  const list = (xs) => (xs.length < 3 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);
  box.append(el('p', 'wr-alg', `<strong>${e.first} → ${e.second}</strong> <code>${alg(e.notation)}</code> · ${e.count} moves`));
  const ol = el('ol', 'ts-steps');
  if (e.setup) ol.append(el('li', null, `<strong>Setup</strong> ${st(e.setup)}: moves ${list(moved.map(([w, , to]) => `${w} into the ${to} position`))}.${stay.length ? ` ${list(stay.map(([w]) => w))} ${stay.length > 1 ? 'stay' : 'stays'} put.` : ''}`));
  ol.append(el('li', null, `<strong>Base:</strong> your helper ${e.helper} base <code>${colourCore(e.core)}</code> cycles ${s.buffer} → ${s.first} → ${s.second}.`));
  if (e.setup) ol.append(el('li', null, `<strong>Undo</strong> the setup. Net: buffer → ${e.first} → ${e.second}.`));
  box.append(ol);
  const r = row(e); r.removeAttribute('id');
  r.querySelector('summary').prepend(el('span', 'bld-muted', 'Pictures of the setup, and a cube to watch: '));
  box.append(r);
  return box;
}

function mountKeep(slot) {
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Pair</th><th>Walk rule</th><th>Moves</th><th>Buffer moving</th></tr></thead><tbody>
    ${bufferMoveKeep.map((k) => `<tr><th>${k.pair}</th><td class="nw"><code>${alg(k.walk)}</code></td><td>${k.count}</td><td>${k.ours}</td></tr>`).join('')}</tbody></table>`));
}

export function mountBufferMoves(ids) {
  const $ = (id) => document.getElementById(id);
  const s = bufferMoveStats;
  $(ids.stats).innerHTML = `Only your 9 bases. Pairs with I, V, Q or U: ${s.hard} of ${s.hardTotal} are shorter than the walk rule, ${s.hardMoves[0]} → ${s.hardMoves[1]} moves on average (${s.hardSaves2} save 2 or more); the other ${s.keep} stay with the walk rule. Elsewhere, ${s.other} more pairs drop from ${s.otherMoves[0]} to ${s.otherMoves[1]} moves. ${s.withLB} pairs use an L or B setup (each one move or more shorter than with R, U, F, D).`;
  mountExample($(ids.example));
  mountHard($(ids.hard), $(ids.hardFilter));
  groups($(ids.otherMoves), bufferMoveOther.filter((e) => e.bufferMoves));
  groups($(ids.otherStays), bufferMoveOther.filter((e) => !e.bufferMoves));
  mountKeep($(ids.keep));
}
