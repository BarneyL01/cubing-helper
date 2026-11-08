// Orozco step 2 page (3x3/bld/orozco-step2.html): one section per base, like the Orozco page - the base's picture,
// the letters that go into its position (picture + table with the setup), and the pairs both ways.
// Data: data/orozco-step2.js (generated and checked by log/2026-11-08-orozco-step2.mjs).
import { pairRow, coreFigure } from './three-style-page.js?v=15';
import { intoDiagram } from './three-style-bases.js?v=15';
import { colourCore } from './three-style-families.js?v=12';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const BASES = [
  { step: '2a', ins: "R U R'", inter: 'D', pos: 'L', fixed: 'P', title: 'P and L', cyc: ['P', 'L'] },
  { step: '2a', ins: "R U R'", inter: "D'", pos: 'T', fixed: 'P', title: 'P and T', cyc: ['P', 'T'] },
  { step: '2a', ins: "R U R'", inter: 'D2', pos: 'H', fixed: 'P', title: 'P and H', cyc: ['P', 'H'] },
  { step: '2b', ins: "R' D' R", inter: 'U2', pos: 'A', fixed: 'P', title: 'P and A', cyc: ['A', 'P'] },
  { step: '2b', ins: "R' D' R", inter: 'U2', pos: 'P', fixed: 'A', title: 'A and P (A with L, T, H)', cyc: ['A', 'P'] },
  { step: '2b', ins: "R' D' R", inter: "U'", pos: 'P', fixed: 'D', title: 'D and P (D with L, T, H)', cyc: ['D', 'P'] },
];

export function mountOrozcoStep2(data, slots) {
  for (const b of BASES) {
    const rows = data.filter((e) => e.insertion === b.ins && e.interchange === b.inter && e.pos === b.pos && e.fixed === b.fixed);
    const sec = el('section', 'os2-base');
    const core = `[${b.ins} , ${b.inter}]`;
    sec.appendChild(el('h3', null, `${b.title}: <code>${colourCore(core)}</code>`));
    // pictures: the base itself, and the letters that set up into its position
    const figs = el('div', 'ts-figs');
    // the base on its own (checked: as written it cycles buffer -> cyc[0] -> cyc[1])
    const own = { core, spots: { buffer: 'C', first: b.cyc[0], second: b.cyc[1] } };
    figs.appendChild(coreFigure(own, () => ` buffer → ${b.cyc[0]} → ${b.cyc[1]}`));
    const setups = [...new Map(rows.filter((e) => e.setup).map((e) => { const x = e.first === b.fixed ? e.second : e.first; return [x, e.setup]; })).entries()];
    if (setups.length) {
      const f = el('figure', 'ts-fig fd-fig');
      f.append(el('div', 'fd-pic', intoDiagram(b.pos, setups.map(([x]) => x))), el('figcaption', null, `Into ${b.pos} (yellow): ${setups.map(([x]) => x).join(' ')}`));
      figs.appendChild(f);
    }
    sec.appendChild(figs);
    // letter table, like Orozco's list
    const direct = rows.filter((e) => !e.setup).map((e) => (e.first === b.fixed ? e.second : e.first));
    const t = el('div', 'table-wrap', `<table class="bld-table"><caption>Letters with ${b.fixed} (setup in orange)</caption>
      <thead><tr><th>Letter</th><th>Setup into ${b.pos}</th></tr></thead><tbody>
      ${[...new Set(direct)].map((x) => `<tr><th>${x}</th><td>none: it is already there</td></tr>`).join('')}
      ${setups.map(([x, s]) => `<tr><th>${x}</th><td><span class="mv-setup">${s}</span></td></tr>`).join('')}
      </tbody></table>`);
    sec.appendChild(t);
    const fwd = rows.filter((e) => e.insFirst), back = rows.filter((e) => !e.insFirst);
    const order = (l) => (l[0].first === b.fixed ? `${b.fixed} then the letter` : `the letter then ${b.fixed}`);
    for (const [list, label] of [[fwd, `As written, ${colourCore(core)}: ${order(fwd)}`], [back, `Halves swapped, ${colourCore(`[${b.inter} , ${b.ins}]`)}: ${order(back)}`]]) {
      if (!list.length) continue;
      sec.appendChild(el('p', 'ts-core-sub', label));
      list.sort((x, y) => x.setupMoves - y.setupMoves || x.pair.localeCompare(y.pair)).forEach((e) => sec.appendChild(pairRow(e)));
    }
    slots[b.step].appendChild(sec);
  }
}
