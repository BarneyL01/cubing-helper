# 2026-11-05 — 3-Style by base

Owner asked for 3-style grouped the Orozco way: learn a few bases (no-setup commutators), then reach other pairs
by moving one target into a base position, with the buffer never moving. New page `3x3/bld/three-style-bases.html`
("By base" in the 3-Style menu section), `js/three-style-bases.js`, data `data/three-style-bases.js` from
`log/2026-11-05-3style-bases.mjs --write` (ALL OK: every pair cycles C -> 1st -> 2nd and moves nothing else).

- 30 bases (R x R' or R' x R, x a U/D turn, against one U/D turn, moving the buffer); shown in 15 groups, each base
  with its reverse (forwards / backwards), with the corner picture and letter net.
- Setups: D and L only, up to 4 moves (owner chose D/L over D/L/B; B would add 78 pairs but 130 algorithms with B).
- Tabs: One target moves (184 pairs, mean 11.8 moves; current table 10.3 on the same pairs), Both targets move
  (122, mean 12.3 vs 10.9), N and Q (72: D/L never reach the B position, so these keep the 3-Style page's
  commutators, which move the buffer). Pairs with B are the Orozco commutators (all one-target).
- Each pair row shows what the setup moves ("T into P"); opening it gives the same steps as the 3-Style page.
- `pairRow` and a new `coreFigure` are exported from `js/three-style-page.js` (v=10) for this page.

## Search by letters

"Find letters" box above the tabs: one letter lists every pair with it as 1st and as 2nd target; two letters show that
pair. Each result says what the setup moves and where it lives (tab and base). While there is text it replaces the
tabs. Says so when the two letters are on one piece or a letter is a buffer sticker. Checked K, KD, KP, C, NQ, AN.

## Letters that move into each position

Owner asked, per base, which letters can be swapped in and whether the setup is always the same (e.g. H into P is
always D2). Each group in "One target moves" now has a table: for each of its two positions, every letter moved into
it and the setup (forwards and backwards share them). 45 of the 52 letter-into-position moves always use one setup;
7 have two (T>P, U>S, E>P, X>P, I>A, R>D, R>P) because the short setup would also move the other target in some
pairs; those are marked *.
