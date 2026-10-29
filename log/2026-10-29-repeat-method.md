# 2026-10-29 — Repeat Method page

Owner asked for a few algorithms that, like Sassy, are repeated to move a few pieces, enough to solve a whole
cube ("a new beginner's method, not necessarily layer by layer"). Then: fewer M moves (M' and M2 are fine),
no L moves, and worry that moving centres makes it hard to tell whether you are doing it right.

Built `3x3/repeat/index.html` (Methods group, menu "Repeat"), data `data/repeat-method.js`.

- Search (scratch scripts, not kept): every sequence of up to 5-6 moves, repeated up to 12 times, sorted
  by what the repeat leaves changed (3-cycles, twists, flips, swaps), with corner-only and "one slot below the top"
  variants.
- Method: corners first (Sassy for the bottom, `(R2 U F2)×4` corner cycle, Sassy×2 twists as in Beginner's step 7),
  then edges with one face-turn repeat, the drop `(R2 U2 R2 F2)×2` (UF→DF→UB), set up four ways for bottom/middle
  slots, plus a top cycle and the flip `(U M')×4` (M' only, centres back after each flip).
- Fix during checking: "an edge matches its centre" in step 5 only works once the top is lined up with the corners.
- `log/2026-10-29-repeat-method-check.mjs`: every card's claim, step 2 on all 24 corner arrangements, step 5 on all
  384 top-edge positions, and 1,000 whole solves following the page's rules: all solved, mean 236 moves
  (steps 44.6 / 17.9 / 36.5 / 95.7 / 41.1), worst 304. Prints ALL OK.
- site-chrome.js bumped to v7 on every page (menu changed).
