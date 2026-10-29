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

## Shorter M versions (same day)

Owner asked for the earlier M version as an alternative. The earlier M repeats ((M U M' U2)×4, (M U)×4) were not
shorter (about 132 edge moves with computer-chosen setups vs 137 by the page's rules), so instead each edge card
got a version built on the commutator `M' U2 M U2` (same start spot, same result): `SHORT` in the data file,
shown under each card's algorithm. The checker now checks both sets of cards and runs 1,000 solves with each:
drop cards 236 moves (worst 304), short cards 191 (worst 256; step 4 59, step 5 33). ALL OK.

## U' M' flip and setup explanations (same day)

- Flip changed to `(U' M')×4` (owner: the U' M' pairing is fast, as on the LSE map). It flips UF, UR, DF, DB;
  flip pair is now `(U' M')×4 U' (U' M')×4` (still flips the left and right top edges), flip all uses U2.
- Step 4 explains setups (edge to top front white up, slot to bottom front; drop; setup backwards), and every
  drop card is a picture strip: start / setup / drop / undo, the placed edge outlined pink and the edge first
  in its slot blue. Captions checked against the simulator. Checker updated; ALL OK (1,000 solves per card set).

- Step 2 wording (owner hit it): 'at least one corner in its spot' failed when two are right and two swapped. Now: exactly one (or all four); two right + two swapped → turn the top a quarter turn first. Checker unchanged (it already tried every top turn); ALL OK.

- Reverse corner cycle `(F2 U' R2)×4` on the step 2 card (owner asked); reverse Sassy `U R U' R'` (Urvop) explained in The idea and offered on step 1 (instead of Sassy ×5) and step 3 (×2 instead of Sassy ×4). Checker: reverse cycle path and = cycle twice; reverse Sassy = Sassy ×5, ×2 = Sassy ×4. ALL OK.

- Step 4: a wrong edge in a lower slot (owner: white edge in the middle) — leave it, the drop for that slot sends it up; lift by hand only when no top edge belongs below.

- Short M versions now use the same setups as the drop cards (owner asked why they differed): M' U2 M U2 equals the drop on every sticker, so setup + M' U2 M U2 + undo. Cards 2 and 4 are 3 moves longer than the search's best (10 vs 7); whole solve with short cards now 201.5 mean (worst 279). Checker checks equality and same setups. ALL OK.

- New section 'Setup moves for the drop' after step 4 (owner asked which setups are valid): any moves, undone in reverse; valid in step 4 when the edge ends at top front (card 1 way round), its slot at bottom front, a top-layer edge at top back. Table of 7 working setups (incl. D', D2, D for the other bottom slots) and 2 that don't (F', R2), all checked by the checker. ALL OK.
