// The Pair lookup page (3x3/bld/pair-lookup.html): pick two corner letters, get the one commutator to use with the
// four-helper rule (helpers B, D, F, K; data/pair-rule.js). F and K pairs are shown as seen after the rotation.
// Optional line underneath: a shorter commutator if the buffer may move (the Buffer moves idea, from the same data).
import { RULE, LETTERS, sameCorner, use, el, st, alg, mainLine, groupRow, ruleSteps, ruleFacts } from './which-group.js?v=3';
import { readingTable } from './buffer-moves.js?v=6';
import { PAIR_RULE_LEVEL2 } from '../data/pair-rule.js?v=2';

const KEY = 'cubing-helper:pair-lookup';
// show the pictures straight away (the pair row builds them when it opens)
const openRows = (box) => { [box, ...box.querySelectorAll('details.ts-pair')].forEach((r) => { if (r.matches?.('details.ts-pair')) r.open = true; }); return box; };

export function mountPairLookup(slot) {
  let saved = { a: 'G', b: 'O' };
  try { saved = { ...saved, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* keep the default */ }
  const q = new URLSearchParams(location.search).get('pair');
  if (q && /^[A-X]{2}$/i.test(q)) { saved.a = q[0].toUpperCase(); saved.b = q[1].toUpperCase(); }
  const pick = (v) => { const s = el('select', 'wr-select'); for (const l of LETTERS) { const o = el('option', null, l); o.value = l; s.append(o); } s.value = LETTERS.includes(v) ? v : 'G'; return s; };
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
    const e = use(RULE[a.value + b.value]);
    out.append(el('p', 'pl-tag', `<strong>Level ${e.level}</strong> · helper ${e.helper}${e.rotation ? ` · rotate ${st(e.rotation)} first` : ' · no rotation'}${e.exception ? ' · one of the exception pairs' : ''}`));
    const box = el('div', 'wr-result');
    box.append(el('p', 'wr-alg', `<strong>${e.first} → ${e.second}</strong> ${mainLine(e)}`));
    if (e.rotation) box.append(el('p', 'bld-note', `As held, without the rotation: <code>${alg(e.notation)}</code>`));
    box.append(ruleSteps(RULE[e.pair]));
    box.append(openRows(groupRow(RULE[e.pair], { id: false })));
    out.append(box);
    const m = RULE[e.pair].bufferMove;
    const saves = m ? e.count - m.count : 0;
    if (m && saves > 0) {
      const bm = el('div', 'wr-result');
      bm.append(el('p', 'pl-tag', `<strong>Shorter if the buffer may move:</strong> ${saves} ${saves === 1 ? 'move' : 'moves'} less (${m.count} instead of ${e.count}), helper ${m.helper}${m.rotation ? `, rotate ${st(m.rotation)}` : ''}.`));
      bm.append(el('p', 'wr-alg', `<strong>${e.first} → ${e.second}</strong> ${mainLine(m)}`));
      if (m.rotation) bm.append(el('p', 'bld-note', `As held: <code>${alg(m.notation)}</code>`));
      bm.append(readingTable({ reading: m.rotation ? m.readingSeen : m.reading, readingFrom: m.rotation ? m.seenPos.buffer : 'C', readingNote: m.rotation ? ` (where the buffer is after ${m.rotation})` : '', helper: m.helper, baseLabel: `${m.helper === 'B' ? 'Orozco' : `helper ${m.helper}'s`} base` }));
      bm.append(groupRow({ ...RULE[e.pair], ...m, exception: false, level: e.level, bufferMove: null }, { id: false }));
      out.append(bm);
    }
  };
  a.addEventListener('change', show); b.addEventListener('change', show);
  swap.addEventListener('click', () => { [a.value, b.value] = [b.value, a.value]; show(); });
  slot.append(form, out);
  show();
}

// ---- How to remember: levels, one-turn letters, level 2 first turns (all worked out from the data) -------------------------
export function mountMemory(slot) {
  const { helperLetters, one, oneLetters, twoLetters } = ruleFacts();
  const lv = el('div', 'ts-guide');
  lv.innerHTML = `<h3>1. Which level?</h3>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>The pair has</th><th>Level</th><th>What to do</th></tr></thead><tbody>
      <tr><td><strong>${helperLetters.join(' ')}</strong></td><td>0</td><td>that helper, other letter's usual setup</td></tr>
      <tr><td><strong>${oneLetters.join(' ')}</strong></td><td>1</td><td>turn it into a helper's place, then set up the other letter</td></tr>
      <tr><td>only <strong>${twoLetters.slice().sort().join(' ')}</strong></td><td>2</td><td>one more turn first (make S, X, H or L), then level 1</td></tr>
    </tbody></table></div>
    <p class="bld-note">When both letters qualify, the lookup shows the shorter way; a pair and its reverse always use the same setup.</p>`;
  const byHelper = (h) => oneLetters.filter((l) => one[l].helper === h);
  const lv1 = el('div', 'ts-guide');
  lv1.innerHTML = `<h3>2. Level 1: which helper, which turn?</h3>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>Helper</th><th>Letter</th><th>Turn (as seen)</th><th>As held</th></tr></thead><tbody>
      ${helperLetters.flatMap((h) => byHelper(h).map((l) => `<tr><th>${h}${one[l].rotation ? ` <span class="bld-muted">${one[l].rotation}</span>` : ''}</th><td><strong>${l}</strong></td><td>${st(one[l].turnSeen)}</td><td>${one[l].turn === one[l].turnSeen ? '' : st(one[l].turn)}</td></tr>`)).join('')}
    </tbody></table></div>
    <p class="bld-note">E, O and X also reach other helpers, G also reaches helper F; the rule keeps one helper for each so there is nothing to choose: E, O, X to B, G to K.</p>`;
  const groups = [...new Set(PAIR_RULE_LEVEL2.map((l) => `${l.becomes} ${l.secondTurnSeen} ${l.helper}`))];
  const lv2 = el('div', 'ts-guide');
  lv2.innerHTML = `<h3>3. Level 2: the first turn</h3>
    <p>Find the first letter in the order <strong>${PAIR_RULE_LEVEL2.map((l) => l.letter).join(' ')}</strong>. Its first turn makes it S, X, H or L; the second turn is the one-turn letter's usual turn.</p>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>Becomes</th><th>Letters (first turn as seen)</th><th>Then</th></tr></thead><tbody>
      ${groups.map((g) => { const [becomes, second, helper] = g.split(' '); const ls = PAIR_RULE_LEVEL2.filter((l) => l.becomes === becomes && l.secondTurnSeen === second && l.helper === helper); return `<tr><th>${becomes}</th><td>${ls.map((l) => `<strong>${l.letter}</strong> ${st(l.firstTurnSeen)}`).join(', ')}</td><td>${st(second)}, helper ${helper}${ls[0].rotation ? ` (${ls[0].rotation})` : ''}</td></tr>`; }).join('')}
    </tbody></table></div>
    <p class="bld-note">More on the face test and the rings: <a href="which-group.html#level2">Which group?</a></p>`;
  slot.append(lv, lv1, lv2);
}
