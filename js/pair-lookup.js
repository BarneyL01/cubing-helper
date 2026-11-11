// The Pair lookup page (3x3/bld/pair-lookup.html): pick two corner letters, get the one commutator to use. The walk
// rule's (js/walk-rule.js, buffer still), unless the Buffer moves page lists a shorter one (js/buffer-moves.js).
// The other way is shown in one line underneath, so the two can be compared.
import { walkPairFor, explainWalk, walkLetterList, sameCorner } from './walk-rule.js?v=4';
import { bufferMoveFor, explainBufferMove } from './buffer-moves.js?v=3';
import { colourCore } from './three-style-families.js?v=12';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const st = (m) => `<span class="mv-setup">${m}</span>`;
const alg = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[${st(m[1])} : ${colourCore(m[2])}]` : colourCore(n); };
const KEY = 'cubing-helper:pair-lookup';

export function mountPairLookup(slot) {
  let saved = { a: 'G', b: 'O' };
  try { saved = { ...saved, ...JSON.parse(localStorage.getItem('cubing-helper:walk-rule') || '{}'), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* keep the default */ }
  const q = new URLSearchParams(location.search).get('pair');
  if (q && /^[A-X]{2}$/i.test(q)) { saved.a = q[0].toUpperCase(); saved.b = q[1].toUpperCase(); }
  const pick = (v) => { const s = el('select', 'wr-select'); for (const l of walkLetterList) { const o = el('option', null, l); o.value = l; s.append(o); } s.value = walkLetterList.includes(v) ? v : 'G'; return s; };
  const a = pick(saved.a), b = pick(saved.b);
  const swap = el('button', 'rec-btn', 'Swap'); swap.type = 'button';
  const form = el('div', 'wr-form');
  const la = el('label', null, '1st letter '), lb = el('label', null, '2nd letter ');
  la.append(a); lb.append(b);
  form.append(la, lb, swap);
  const out = el('div');
  const show = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ a: a.value, b: b.value })); } catch { /* not saved */ }
    out.replaceChildren();
    if (sameCorner(a.value, b.value)) { out.append(el('p', 'bld-note', a.value === b.value ? 'Pick two different letters.' : `${a.value} and ${b.value} are stickers of one corner, so they are never one commutator. Do them as a twist (see the helper pages).`)); return; }
    const pair = a.value + b.value, w = walkPairFor(pair), m = bufferMoveFor(pair);
    if (m) {
      out.append(el('p', 'pl-tag', `<strong>Buffer moves</strong> · ${m.walk.count - m.count} moves shorter than the walk rule${m.bufferMoves ? '' : ' (here the buffer stays: just a shorter setup)'}`));
      out.append(explainBufferMove(m));
      out.append(el('p', 'bld-note', `Walk rule instead: <code>${alg(w.notation)}</code>, ${w.count} moves. <a href="walk-rule.html">How the walk rule works</a>.`));
    } else {
      out.append(el('p', 'pl-tag', `<strong>Walk rule</strong>${w.exception ? ' · one of the exception pairs' : ''}`));
      out.append(explainWalk(pair));
      out.append(el('p', 'bld-note', `Moving the buffer is no shorter here (or saves too little to be on the <a href="buffer-moves.html">Buffer moves</a> page).`));
    }
  };
  a.addEventListener('change', show); b.addEventListener('change', show);
  swap.addEventListener('click', () => { [a.value, b.value] = [b.value, a.value]; show(); });
  slot.append(form, out);
  show();
}
