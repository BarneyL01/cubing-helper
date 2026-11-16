// The Helper F page (3x3/bld/orozco-f.html): Orozco with F as the helper. Bases [U' R' U , L^k] (buffer -> E / G / H -> F),
// done as z [R' D' R , U^k] z'. Data: data/orozco-f.js, generated and checked by log/2026-11-17-orozco-f.mjs.
import { orozcoF, OROZCO_F_BASES, OROZCO_F_COMPARE, OROZCO_F_TWIST, OROZCO_F_TWIST_REV, OROZCO_F_HELPER_RULES } from '../data/orozco-f.js?v=1';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js?v=4';
import { coreFigure } from './three-style-page.js?v=15';
import { intoDiagram } from './three-style-bases.js?v=15';
import { colourCore } from './three-style-families.js?v=12';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const st = (m) => `<span class="mv-setup">${m}</span>`;
// "setup · z [base] z' · undo": the way the owner does it
const how = (setup, zBase) => `${setup ? `${st(setup)} · ` : ''}<strong>z</strong> <code>${colourCore(zBase)}</code> <strong>z'</strong>${setup ? ' · undo' : ''}`;
const plain = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[${st(m[1])} : ${colourCore(m[2])}]` : colourCore(n); };

export function mountHelperF(ids) {
  const $ = (id) => document.getElementById(id);
  // the bases, both views
  $(ids.bases).append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Into</th><th>As you do it (forwards)</th><th>Written without the rotation</th></tr></thead><tbody>
    ${OROZCO_F_BASES.map((b) => `<tr><th>${b.pos}</th><td class="nw"><strong>z</strong> <code>${colourCore(b.zForwards)}</code> <strong>z'</strong><br><span class="bld-muted">buffer → ${b.pos} → F</span></td><td class="nw"><code>${colourCore(b.forwards)}</code></td></tr>`).join('')}</tbody></table>`));
  const figs = el('div', 'ts-figs');
  for (const b of OROZCO_F_BASES) figs.append(coreFigure({ core: b.forwards, spots: { buffer: 'C', first: b.pos, second: 'F' } }, () => ` buffer → ${b.pos} → F`));
  $(ids.bases).append(figs);
  // by position
  for (const b of OROZCO_F_BASES) {
    const rows = orozcoF.filter((r) => r.pos === b.pos);
    const d = el('details', 'ts-core'); d.open = b === OROZCO_F_BASES[0];
    d.append(el('summary', null, `<span><strong>Into ${b.pos}</strong> <strong>z</strong> <code>${colourCore(b.zForwards)}</code> <strong>z'</strong><span class="ts-sum-base bld-muted">${rows.length} letters: ${rows.map((r) => r.letter).join(' ')}</span></span>`));
    const moved = rows.filter((r) => r.setup).map((r) => r.letter);
    const f = el('figure', 'ts-fig fd-fig'); f.append(el('div', 'fd-pic', intoDiagram(b.pos, moved)), el('figcaption', null, `Into ${b.pos} (yellow): ${moved.join(' ')}`));
    const fg = el('div', 'ts-figs'); fg.append(f); d.append(fg);
    d.append(el('div', 'table-wrap wr-wrap', `<table class="bld-table"><thead><tr><th>Letter</th><th>Setup</th><th>Forwards (1st) / backwards (2nd)</th></tr></thead><tbody>
      ${rows.map((r) => `<tr><th>${r.letter}</th><td>${r.setup ? st(r.setup) : 'none'}</td><td>${how(r.setup, r.zForwards)}<br>${how(r.setup, r.zBackwards)}</td></tr>`).join('')}</tbody></table>`));
    $(ids.groups).append(d);
  }
  // every letter
  $(ids.table).innerHTML = `<caption>Helper F: every letter (forwards = buffer → letter → F, backwards = buffer → F → letter)</caption>
    <thead><tr><th>Letter</th><th>Into</th><th>Forwards / backwards, as you do it</th><th>Without the rotation</th></tr></thead><tbody>
    ${orozcoF.map((r) => `<tr id="letter-${r.letter}"><th>${r.letter}</th><td>${r.pos}${r.setup ? '' : ' (there)'}</td><td>${how(r.setup, r.zForwards)}<br>${how(r.setup, r.zBackwards)}</td><td><code>${plain(r.forwards)}</code><br><code>${plain(r.backwards)}</code></td></tr>`).join('')}</tbody>`;
  // the helper's letters, parity
  const rule = Object.fromEntries(OROZCO_F_HELPER_RULES.map((r) => [r.letter, r]));
  const say = { skip: 'nothing (skip it)', twist: 'the twist', 'twist-rev': 'the twist backwards' };
  $(ids.helper).innerHTML = `
    <li><strong>F:</strong> skip it, like B in Orozco.</li>
    <li><strong>D:</strong> as the 1st letter of a pair ${say[rule.D.odd]}; as the 2nd ${say[rule.D.even]}.</li>
    <li><strong>I:</strong> as the 1st letter of a pair ${say[rule.I.odd]}; as the 2nd ${say[rule.I.even]}.</li>
    <li><strong>Twist</strong> (helper D's twist: D and F are stickers of the same corner; no rotation): <code>${OROZCO_F_TWIST}</code></li>
    <li><strong>Twist backwards:</strong> <code>${OROZCO_F_TWIST_REV}</code></li>`;
  $(ids.ra).textContent = OROZCO_PARITY_RUF;
  // compare
  const c = OROZCO_F_COMPARE;
  const row = (k, name) => `<tr><th>${name}</th><td>${c[k].still}</td><td>${c[k].moving}</td><td>${c[k].pairSetups[3] + c[k].pairSetups[4]}</td></tr>`;
  $(ids.compare).append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Bases</th><th>Buffer still</th><th>Buffer may move</th><th>Pairs with a 3+ move setup</th></tr></thead><tbody>
    ${row('BDP', 'B + D + P (now)')}${row('BDA', 'B + D + A group')}${row('BDF', '<strong>B + D + F</strong>')}${row('BDFQ', 'B + D + F + Q group')}</tbody></table>`));
}
