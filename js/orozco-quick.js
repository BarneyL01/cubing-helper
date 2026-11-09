// Quick tests for shortcuts (Orozco with B, and helper P): level 1 and level 2, as one block per page.
// Data: data/orozco-quick.js (generated and checked by log/2026-11-10-quick-tests.mjs).
import { orozcoQuick } from '../data/orozco-quick.js?v=1';
import { colourCore } from './three-style-families.js?v=12';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const alg = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[<span class="mv-setup">${m[1]}</span> : ${colourCore(m[2])}]` : colourCore(n); };
const TEXT = {
  P: { helper: 'P', setupWord: 'helper-P', base: 'A, L or H', own: 'K and V', faces: 'the bottom' },
  B: { helper: 'B', setupWord: 'Orozco', base: 'O, H or L', own: 'N and Q', faces: 'the back' },
};

export function mountQuick(slot, helper) {
  const q = orozcoQuick[helper], t = TEXT[helper];
  const l1 = q.level1.map((x) => x.letter);
  // level 1
  const one = el('div', 'ts-guide os-quick');
  one.innerHTML = `<h3>Level 1: works with every other letter</h3>
    <p>If one of the two letters is <strong>${l1.join(', ')}</strong>, it is a shortcut, whatever the other letter is
      (checked for all of them, ${t.own} included).</p>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>Letter</th><th>One turn puts it in ${t.helper}'s place</th></tr></thead><tbody>
      ${q.level1.map((x) => `<tr><th>${x.letter}</th><td><code><span class="mv-setup">${x.turn}</span></code></td></tr>`).join('')}</tbody></table></div>
    <ol class="bld-list">
      <li>Do that turn: the letter is now where ${t.helper} was.</li>
      <li>See where the other letter is now (the turn moves it too if it is on ${t.faces}).</li>
      <li>Do that letter's usual ${t.setupWord} setup and base: <strong>forwards</strong> if the other letter comes first,
        <strong>backwards</strong> if the level-1 letter comes first.</li>
      <li>Undo: the setup, then the turn.</li>
    </ol>`;
  // level 2
  const two = el('div', 'ts-guide os-quick');
  // only the partners level 1 does not already cover (a level-1 partner is easier done as level 1)
  const l2 = q.level2.map((x) => ({ ...x, fresh: x.partners.filter((p) => !l1.includes(p.letter)) })).filter((x) => x.fresh.length);
  const rows = l2.map((x) => `<tr><th>${x.letter}</th><td class="nw"><code><span class="mv-setup">${x.first} ${x.then}</span></code></td><td><strong>${x.fresh.map((p) => p.letter).join(', ')}</strong></td></tr>`).join('');
  const ex = l2[0], exP = ex.fresh[0];
  two.innerHTML = `<h3>Level 2: only with the listed partners</h3>
    <p>These letters are one turn away from a level-1 spot, so two turns put them in ${t.helper}'s place. It is a shortcut
      only if the other letter then sits on a base position (${t.base}) with no setup, which happens just for the
      partners listed. With any other partner (that is not level 1) it is two commutators.</p>
    <div class="table-wrap"><table class="bld-table"><thead><tr><th>Letter</th><th>Two turns</th><th>Works only with</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="bld-note">Partners that are level-1 letters (${l1.join(', ')}) are left out: do those as level 1.
      The commutator is the two turns, then the base for where the partner landed (forwards if the partner comes
      first, backwards if the level-2 letter comes first). For example ${exP.letter} → ${ex.letter}:
      <code>${alg(exP.yFirst)}</code>, and ${ex.letter} → ${exP.letter}: <code>${alg(exP.zFirst)}</code>.</p>`;
  // caveats
  const cav = el('div', 'ts-guide os-quick');
  cav.innerHTML = `<h3>Caveats</h3><ul class="bld-list">
    <li><strong>Level 1 has none:</strong> any partner works, even ${t.own} (the turn moves them off ${t.helper}'s corner first).
      Two letters on the same corner are never a pair anyway.</li>
    <li><strong>Level 2 is partner-specific:</strong> learn it as the short list above, not as a rule.</li>
    <li><strong>Pairs with ${t.helper} itself</strong> are already one commutator; no shortcut needed.</li>
    <li>Some level-1 pairs need a third setup move, so they are not all in the list below.</li></ul>`;
  slot.replaceChildren(one, two, cav);
}
