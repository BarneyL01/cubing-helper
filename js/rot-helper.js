// Pages for the helpers done from one rotation (3x3/bld/orozco-f.html: z, orozco-k.html: y'). Orozco with the helper in
// B's place, held in the rotated view for the whole corner phase: rotate once, every letter (setup, base, undo, all as
// seen), rotate back; an odd count's last letter and the Ra-perm after rotating back. Data: data/orozco-f.js, data/orozco-k.js, generated and checked
// by log/2026-11-17-orozco-f.mjs and log/2026-11-17-orozco-k.mjs (3,000 whole solves each).
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js?v=4';
import { coreFigure } from './three-style-page.js?v=15';
import { intoDiagram } from './three-style-bases.js?v=15';
import { colourCore } from './three-style-families.js?v=12';
import { cube3dSvg } from './cube-3d.js?v=2';
import { WHITE_TOP } from './cube-diagram.js';
import { applyAlg, solvedCube } from './cube-sim.js';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const st = (m) => `<span class="mv-setup">${m}</span>`;
const plain = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[${st(m[1])} : ${colourCore(m[2])}]` : colourCore(n); };

// cfg: { helper, rot, back, rows, bases, compare, compareRows: [[key, label]], twist, twistRev, rules, twistLetters, twistNote,
//        twistView, rotText (what the rotation does, in words), seen (who sits where after it) }
export function mountRotHelper(cfg, ids) {
  const $ = (id) => document.getElementById(id);
  const { helper: H, rot, back } = cfg;
  // what you do while holding the cube in the rotated view: [setup : base], all as seen
  const how = (setup, view) => `<code>${setup ? `[${st(setup)} : ${colourCore(view)}]` : colourCore(view)}</code>`;
  // what the rotation does: the solved cube before and after
  if (ids.rotation) {
    const figs = el('div', 'ts-figs');
    const pic = (alg, cap) => { const f = el('figure', 'ts-fig rh-cube'); f.innerHTML = cube3dSvg(alg ? applyAlg(solvedCube(), alg) : solvedCube(), { label: cap, palette: WHITE_TOP }); f.append(el('figcaption', null, cap)); return f; };
    figs.append(pic('', 'Before: white on top, green in front'), pic(rot, `After ${rot}: the same cube, turned in your hands`));
    $(ids.rotation).append(el('ul', 'bld-list', cfg.rotText.map((t) => `<li>${t}</li>`).join('')), figs,
      el('div', 'table-wrap', `<table class="bld-table"><caption>Where the pieces are after ${rot}</caption><thead><tr><th>Piece</th><th>Now in the place of</th></tr></thead><tbody>
        ${cfg.seen.map(([who, where]) => `<tr><th>${who}</th><td>${where}</td></tr>`).join('')}</tbody></table>`));
  }
  // how a solve goes
  if (ids.flow) $(ids.flow).append(el('ol', 'bld-list', `
    <li>Memo the corners from C as always, holding the cube normally.</li>
    <li><strong>${rot}</strong> once. From here on, hold the cube that way.</li>
    <li>Every letter in memo order: the 1st of each pair forwards, the 2nd backwards, with the setups and bases on this page (they are written as you now see the cube). ${H}: skip. ${cfg.twistLetters.join(' and ')}: the twist, also written as you now see the cube.</li>
    <li><strong>${back}</strong> once, back to how you started.</li>
    <li>Odd number of letters: stop before the last letter in step 3; after ${back}, do that last letter the plain Orozco way (helper B), then the Ra-perm.</li>`));
  // the bases, both views
  $(ids.bases).append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Into</th><th>Seen after ${rot} (forwards)</th><th>Without the rotation</th></tr></thead><tbody>
    ${cfg.bases.map((b) => `<tr><th>${b.pos}</th><td class="nw"><code>${colourCore(b.zForwards)}</code><br><span class="bld-muted">buffer → ${b.pos} → ${H}</span></td><td class="nw"><code>${colourCore(b.forwards)}</code></td></tr>`).join('')}</tbody></table>`));
  const figs = el('div', 'ts-figs');
  for (const b of cfg.bases) figs.append(coreFigure({ core: b.forwards, spots: { buffer: 'C', first: b.pos, second: H } }, () => ` buffer → ${b.pos} → ${H} (as you hold the cube before ${rot})`));
  $(ids.bases).append(figs);
  // by position
  for (const b of cfg.bases) {
    const rows = cfg.rows.filter((r) => r.pos === b.pos);
    const d = el('details', 'ts-core'); d.open = b === cfg.bases[0];
    d.append(el('summary', null, `<span><strong>Into ${b.pos}</strong> <code>${colourCore(b.zForwards)}</code><span class="ts-sum-base bld-muted">${rows.length} letters: ${rows.map((r) => r.letter).join(' ')}</span></span>`));
    const moved = rows.filter((r) => r.setup).map((r) => r.letter);
    const f = el('figure', 'ts-fig fd-fig'); f.append(el('div', 'fd-pic', intoDiagram(b.pos, moved)), el('figcaption', null, `Into ${b.pos} (yellow): ${moved.join(' ')} · letters as you memo them, before ${rot}`));
    const fg = el('div', 'ts-figs'); fg.append(f); d.append(fg);
    d.append(el('div', 'table-wrap wr-wrap', `<table class="bld-table"><thead><tr><th>Letter</th><th>Setup (seen)</th><th>Forwards (1st) / backwards (2nd), seen after ${rot}</th></tr></thead><tbody>
      ${rows.map((r) => `<tr><th>${r.letter}</th><td>${r.zSetup ? st(r.zSetup) : 'none'}</td><td>${how(r.zSetup, r.zForwards)}<br>${how(r.zSetup, r.zBackwards)}</td></tr>`).join('')}</tbody></table>`));
    $(ids.groups).append(d);
  }
  // every letter
  $(ids.table).innerHTML = `<caption>Helper ${H}: every letter (forwards = buffer → letter → ${H}, backwards = buffer → ${H} → letter)</caption>
    <thead><tr><th>Letter</th><th>Into</th><th>Seen after ${rot}: forwards / backwards</th><th>Without the rotation</th></tr></thead><tbody>
    ${cfg.rows.map((r) => `<tr id="letter-${r.letter}"><th>${r.letter}</th><td>${r.pos}${r.setup ? '' : ' (there)'}</td><td>${how(r.zSetup, r.zForwards)}<br>${how(r.zSetup, r.zBackwards)}</td><td><code>${plain(r.forwards)}</code><br><code>${plain(r.backwards)}</code></td></tr>`).join('')}</tbody>`;
  // the helper's letters, parity
  const rule = Object.fromEntries(cfg.rules.map((r) => [r.letter, r]));
  const say = { skip: 'nothing (skip it)', twist: 'the twist', 'twist-rev': 'the twist backwards' };
  $(ids.helper).innerHTML = `<li><strong>${H}:</strong> skip it, like B in Orozco.</li>
    ${cfg.twistLetters.map((l) => `<li><strong>${l}:</strong> as the 1st letter of a pair ${say[rule[l].odd]}; as the 2nd ${say[rule[l].even]}.</li>`).join('')}
    <li><strong>Twist</strong>, seen after ${rot} (do it while you still hold the cube that way): <code>${cfg.twistView[0]}</code></li>
    <li><strong>Twist backwards</strong>, seen after ${rot}: <code>${cfg.twistView[1]}</code></li>
    <li class="bld-muted">Without the rotation these are ${cfg.twistNote}: <code>${cfg.twist}</code> and <code>${cfg.twistRev}</code>.</li>`;
  $(ids.ra).textContent = OROZCO_PARITY_RUF;
  // compare
  const c = cfg.compare;
  $(ids.compare).append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Bases</th><th>Buffer still</th><th>Buffer may move</th><th>Pairs with a 3+ move setup</th></tr></thead><tbody>
    ${cfg.compareRows.map(([k, label]) => `<tr><th>${label}</th><td>${c[k].still}</td><td>${c[k].moving}</td><td>${c[k].pairSetups[3] + c[k].pairSetups[4]}</td></tr>`).join('')}</tbody></table>`));
}
