// Prose word count per page and per section (paragraphs, list items, captions in main; not tables or code).
// Needs a local server on :8765 from the repo root.   node log/2026-10-23-word-count.mjs
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const pages = ['index.html','3x3/cfop/index.html','3x3/cfop/oll.html','3x3/cfop/pll.html','3x3/cfop/f2l.html','3x3/roux/index.html','3x3/roux/lse-map.html','3x3/beginners/index.html','3x3/8355/index.html','3x3/heise/index.html','3x3/marshall/index.html','3x3/bld/index.html','3x3/bld/practice.html','3x3/bld/commutators.html','3x3/bld/corner-cycles.html','3x3/bld/corner-table.html','3x3/bld/corner-8355.html','3x3/bld/corner-8355-lb.html','3x3/bld/corner-twists.html','3x3/bld/edge-cycles.html','2x2/index.html','megaminx/index.html'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
for (const path of pages) {
  await p.goto(`http://localhost:8765/${path}`, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const main = document.querySelector('main');
    const prose = (root) => [...root.querySelectorAll('p, li, dd, summary, .case-note, .step-note')].filter((e) => !e.closest('table, code, .film-caption, nav')).map((e) => e.innerText).join(' ');
    const words = (t) => (t.match(/\S+/g) || []).length;
    const secs = [];
    let cur = { h: '(top)', text: '' , figs: 0, tables: 0, cards: 0 };
    const walk = [...main.children];
    const flat = [];
    const visit = (el) => { if (el.matches('h2')) flat.push(el); else if (el.children.length && !el.matches('p, li, table, figure, .case-card, details, svg, .filmstrip, .case-grid, ol, ul, dl')) [...el.children].forEach(visit); else flat.push(el); };
    walk.forEach(visit);
    for (const el of flat) {
      if (el.matches('h2')) { secs.push(cur); cur = { h: el.innerText.trim(), text: '', figs: 0, tables: 0, cards: 0 }; continue; }
      cur.text += ' ' + prose(el.parentElement === main || true ? el : el) + (el.matches('p, li') ? ' ' + el.innerText : '');
      cur.figs += el.querySelectorAll('svg').length + (el.matches('svg') ? 1 : 0);
      cur.tables += el.querySelectorAll('table').length + (el.matches('table') ? 1 : 0);
      cur.cards += el.querySelectorAll('.case-card').length + (el.matches('.case-card') ? 1 : 0);
    }
    secs.push(cur);
    const total = words(prose(main));
    return { total, secs: secs.map((s) => ({ h: s.h, w: words(s.text), f: s.figs, t: s.tables, c: s.cards })) };
  });
  console.log(`\n## ${path}: ~${r.total} words of prose`);
  for (const s of r.secs) if (s.w > 60) console.log(`   ${String(s.w).padStart(5)} words | ${s.f} pictures, ${s.t} tables, ${s.c} cards | ${s.h.slice(0, 60)}`);
}
await b.close();
