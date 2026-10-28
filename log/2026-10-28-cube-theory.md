# 2026-10-28 — Cube theory section

Owner: "Create a new section and include the 3 you have suggested, and another page with your table summary with
the remaining ones so we can look at them further."

New section **Cube theory** (Methods group, `MENU` in `js/site-chrome.js`; home row with quick links):
- `3x3/theory/index.html` Overview: built ideas (laws, conjugates, order, commutators) and the ones still to
  explore (restricted move sets, orientation, pair and insert, fewest-moves theory, computer theory), each with
  what a page could show.
- `laws.html`: the three laws (twists, flips, matching swaps) with pictures of the owner's twist algorithm, an edge
  flip and the Old Pochmann swap; a live table of what one turn does; "check any position" (face turns only; slice
  moves also move centres, explained on the page); why it matters (Orozco helper twist, parity algorithms, Ra-perm,
  1 in 12); a runner for twist / flip / swap.
- `conjugates.html`: A B A' with three examples (Orozco K = [D: O's commutator], F Sassy F', [U: T-perm]); "B alone"
  vs "A B A'" pictures with what changed worked out on the page; runner; how to make one.
- `order.html`: why repeating comes back (cycles, twist x3, flip x2, lowest common multiple); Sassy one go at a time
  (x2: corners in place but twisted, x3: edges back, x6 solved); a table of orders; runner of every go; "try your own".

Shared code: `js/cube-laws.js` (pieces, twists, flips, swap parity, cycles, order) and `js/move-runner.js` (the
animated step runner from How Orozco works, reusable). Checks: `node log/2026-10-28-theory-check.mjs` — laws on
3,000 random scrambles, the laws page's algorithms, order from cycles = order by repeating (212 algorithms), and the
conjugate examples. ALL OK. Headless Chromium 390/1280: no errors, no horizontal scroll, runners and inputs work.
