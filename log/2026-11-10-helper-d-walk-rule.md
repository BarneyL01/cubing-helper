# 2026-11-10 — Helper D page and Walk rule page

- Owner confirmed the helper D set (`[R' D^k R , U']`) and asked for two pages.
- **Orozco with helper D** (`3x3/bld/orozco-d.html`): same layout as helper P (idea table for the three helpers, by
  position with cube pictures, every letter, D F I, parity, practise link). `log/2026-11-10-orozco-d.mjs --write` →
  `data/orozco-d.js` (18 letters, setups 0/1/2/3 = 3/7/6/2, F/I rule, 3,000 whole solves, 500 with `js/orozco-d.js`).
  Blind drills: "Corners solved with: Orozco with helper D" (`?corners=orozcoD`).
- **Walk rule** (`3x3/bld/walk-rule.html`, `js/walk-rule.js`): the rule, a pair finder (two selects, saved in
  `cubing-helper:walk-rule`, `?pair=`), pictures of the three helpers, the one-turn and two-turn walks, each helper's
  setups by position, the 5 exception pairs, and every pair by the letter that walks (pairs open to the usual
  pictures and the cube runner). `log/2026-11-10-third-helper-set.mjs --write` → `data/walk-rule.js`; it now takes
  helper D's rows from `data/orozco-d.js`.
- Menu: the 3-Style section would have had 7 pages (limit 6), so it is split: "Orozco helpers" (Orozco step 2,
  Helper P, Helper D, Walk rule) and "3-Style" (3-Style, By base, Dylan / J Perm). Home page has a row for the new
  section. `site-chrome.js?v=14` on every page; `style.css?v=35` on the two new pages.
- Checked at 390 px in headless Chromium (both new pages, home, Blind drills, helper P, step 2, 3-Style): no console
  errors, no sideways scroll.
