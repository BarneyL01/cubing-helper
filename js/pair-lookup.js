// The Pair lookup page (3x3/bld/pair-lookup.html): pick two corner letters, get the one commutator to use. The walk
// rule's (js/walk-rule.js, buffer still), unless the Buffer moves page lists a shorter one (js/buffer-moves.js).
// The other way is shown in one line underneath, so the two can be compared.
import { walkPairFor, explainWalk, walkLetterList, sameCorner } from './walk-rule.js?v=4';
import { bufferMoveFor, explainBufferMove } from './buffer-moves.js?v=4';
import { walkLetters } from '../data/walk-rule.js?v=1';
import { bufferMoveHard, bufferMoveOther } from '../data/buffer-moves.js?v=3';
import { colourCore } from './three-style-families.js?v=12';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const st = (m) => `<span class="mv-setup">${m}</span>`;
const alg = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[${st(m[1])} : ${colourCore(m[2])}]` : colourCore(n); };
const KEY = 'cubing-helper:pair-lookup';
// show the pictures straight away (the pair row builds them when it opens)
const openRows = (box) => { box.querySelectorAll('details.ts-pair').forEach((r) => { r.open = true; }); return box; };

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
      out.append(openRows(explainBufferMove(m)));
      out.append(el('p', 'bld-note', `Walk rule instead: <code>${alg(w.notation)}</code>, ${w.count} moves. <a href="walk-rule.html">How the walk rule works</a>.`));
    } else {
      out.append(el('p', 'pl-tag', `<strong>Walk rule</strong>${w.exception ? ' · one of the exception pairs' : ''}`));
      out.append(openRows(explainWalk(pair)));
      out.append(el('p', 'bld-note', `Moving the buffer is no shorter here (or saves too little to be on the <a href="buffer-moves.html">Buffer moves</a> page).`));
    }
  };
  a.addEventListener('change', show); b.addEventListener('change', show);
  swap.addEventListener('click', () => { [a.value, b.value] = [b.value, a.value]; show(); });
  slot.append(form, out);
  show();
}

// ---- How to remember: which method, which letter walks, which base (all worked out from the same data) --------------
const HARD = 'IVQU';
const lp = (p) => [...p].sort().join('');
const uniq = (xs) => [...new Set(xs)].sort();
// triangles first (three letters, every two of them in the list), then the pairs left over
function chunk(pairs) {
  const set = new Set(pairs), used = new Set(), tri = [];
  const letters = uniq(pairs.join('').split(''));
  for (const a of letters) for (const b of letters) for (const c of letters) {
    if (!(a < b && b < c)) continue;
    const ps = [a + b, a + c, b + c];
    if (ps.every((x) => set.has(x)) && ps.filter((x) => used.has(x)).length <= 1) { tri.push(a + b + c); ps.forEach((x) => used.add(x)); }
  }
  return { tri, rest: pairs.filter((x) => !used.has(x)) };
}
export function mountMemory(slot) {
  const bm = [...bufferMoveHard, ...bufferMoveOther];
  const onBM = new Set(bm.map((e) => lp(e.pair)));
  const all = [];
  for (const a of walkLetterList) for (const b of walkLetterList) if (a < b && !sameCorner(a, b)) all.push(a + b);
  // 1. which method
  const walkHard = all.filter((p) => /[IVQU]/.test(p) && !onBM.has(p));
  const bmOther = all.filter((p) => !/[IVQU]/.test(p) && onBM.has(p));
  const hardHard = chunk(walkHard.filter((p) => [...p].every((c) => HARD.includes(c))));
  const perHard = [...HARD].map((h) => [h, walkHard.filter((p) => p.includes(h) && ![...p].every((c) => HARD.includes(c))).map((p) => p.replace(h, ''))]);
  const o = chunk(bmOther);
  const one = el('div', 'ts-guide');
  one.innerHTML = `<h3>1. Walk rule or buffer moves?</h3>
    <p>A pair and its reverse always go the same way, so learn letter pairs, not orders.</p>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>The pair has</th><th>Usually</th><th>Except (the other way)</th></tr></thead><tbody>
      <tr><th>I, V, Q or U</th><td>Buffer moves</td><td>Walk rule: ${hardHard.tri.map((t) => `any two of <strong>${t.split('').join(' ')}</strong>`).concat(hardHard.rest.map((p) => `<strong>${p}</strong>`)).join(', ')}; and
        ${perHard.filter(([, xs]) => xs.length).map(([h, xs]) => `<strong>${h}</strong> with ${xs.join(' ')}`).join('; ')}</td></tr>
      <tr><th>none of them</th><td>Walk rule</td><td>Buffer moves: ${o.tri.map((t) => `any two of <strong>${t.split('').join(' ')}</strong>`).join(', ')}; and <strong>${o.rest.join(' ')}</strong></td></tr>
    </tbody></table></div>
    <p class="bld-note">That is ${walkHard.length} + ${bmOther.length} letter pairs to learn as exceptions; everything else follows the first two columns.</p>`;
  // the exceptions, one accordion per letter pair: the pair worked out with its cube pictures open, the reverse in one line
  const exceptionGroup = (title, pairs, viaBM) => {
    const box = el('div', 'pl-exceptions');
    box.append(el('h4', null, `${title} (${pairs.length})`));
    for (const p of pairs) {
      const [x, y] = [p, p[1] + p[0]];
      const w = walkPairFor(x), m = viaBM ? bufferMoveFor(x) : null, mr = viaBM ? bufferMoveFor(y) : null, wr = walkPairFor(y);
      const d = el('details', 'ts-core');
      d.append(el('summary', null, `<span><strong>${p[0]} ${p[1]}</strong> · ${viaBM ? 'buffer moves' : 'walk rule'}<span class="ts-sum-base bld-muted">${viaBM ? `helper ${m.helper} base · ${m.count} moves (walk rule ${w.count})` : `${w.count} moves`}</span></span>`));
      d.addEventListener('toggle', () => {
        if (!d.open || d.children.length > 1) return;
        const body = viaBM ? explainBufferMove(m) : explainWalk(x);
        body.querySelectorAll('details.ts-pair').forEach((r) => { r.open = true; });
        if (viaBM) body.querySelector(':scope > ol.ts-steps')?.remove(); // the open pictures repeat the same three steps
        d.append(body, el('p', 'bld-note', `Reverse, ${y[0]} → ${y[1]}: <code>${alg(viaBM ? mr.notation : wr.notation)}</code>, ${viaBM ? mr.count : wr.count} moves (the same setup, the base with its halves swapped).`));
      });
      box.append(d);
    }
    return box;
  };
  one.append(exceptionGroup('Walk rule, though the pair has I, V, Q or U', walkHard, false), exceptionGroup('Buffer moves, though the pair has none of them', bmOther, true));
  // 2. which letter walks
  const byN = [0, 1, 2].map((n) => walkLetters.filter((l) => l.n === n));
  const two = el('div', 'ts-guide');
  two.innerHTML = `<h3>2. Walk rule: which letter walks?</h3>
    <p>Walk the letter with fewer turns. If both need the same number, either works; the lookup shows the shorter one.</p>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>Turns</th><th>Letters (walk → helper's place)</th></tr></thead><tbody>
      <tr><th>0</th><td>${byN[0].map((l) => `<strong>${l.letter}</strong> (is a helper)`).join(', ')}</td></tr>
      <tr><th>1</th><td>${byN[1].map((l) => `<strong>${l.letter}</strong> <span class="mv-setup">${l.turns}</span> → ${l.helper}`).join(', ')}</td></tr>
      <tr><th>2</th><td>${byN[2].map((l) => `<strong>${l.letter}</strong> <span class="mv-setup">${l.turns}</span> → ${l.helper}`).join(', ')}</td></tr>
      <tr><th>none</th><td>${walkLetters.filter((l) => l.n === null).map((l) => `<strong>${l.letter}</strong>: the other letter always walks`).join(', ')}</td></tr>
    </tbody></table></div>`;
  // 3. buffer moves: which base
  const byBase = new Map();
  for (const e of bm) { const k = e.core.replace(/^\[([RLUDFB]['2]?) , (.+)\]$/, '[$2 , $1]'); if (!byBase.has(k)) byBase.set(k, { helper: e.helper, ps: new Set() }); byBase.get(k).ps.add(lp(e.pair)); }
  const three = el('div', 'ts-guide');
  three.innerHTML = `<h3>3. Buffer moves: which of your bases?</h3>
    <p>The setups do not follow one pattern (${onBM.size} letter pairs use ${new Set(bm.map((e) => e.setup)).size} different setups), so learn them pair by pair. Knowing the base first
      narrows it down: the setup only has to put the buffer and the two letters on one reading of that base.</p>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>Base</th><th>Letter pairs</th></tr></thead><tbody>
      ${[...byBase.entries()].sort((a, b) => b[1].ps.size - a[1].ps.size).map(([k, v]) => `<tr><td class="nw"><code>${colourCore(k)}</code><br><span class="bld-muted">helper ${v.helper} · ${v.ps.size}</span></td><td>${[...v.ps].sort().join(' ')}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="bld-note">Each base is shown insertion first; a pair may use it with the halves swapped.</p>`;
  slot.append(one, two, three);
}
