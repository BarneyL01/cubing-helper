# 2026-10-06 — OLL/PLL on home, F2L next-step pictures, Roux LSE + DFDB

## Asked for
"Make OLL and PLL reachable from home. F2L show diagram of the next step it
turns to. Build out Roux LSE, and include dfdb for that."

## Done
- **Home:** two new cards, "3x3 — 2-look OLL" and "3x3 — 2-look PLL", link
  straight to `3x3/cfop/oll.html` and `pll.html`. Roux card text updated.
- **F2L:** every card's "Then →" link now has a small picture of the position
  it leads to (`thenDiagram` in `js/render-cases.js`, `.case-next*` in
  `css/style.css`). The picture is the next case's own card picture; the
  "solved (37)" target shows a solved F2L. Tested: 48 cards, 48 pictures, none
  hidden by the 3D toggle, no overflow at phone width. The five "solved (37)"
  links go to the map heading, as before.
- **Roux LSE:** page rebuilt as a numbered-steps page (`js/steps-page.js`):
  Blocks (placeholder), CMLL, 4a orient edges (11 cards), 4b place UL/UR
  (30-row table), 4c M slice (11 cards, plus "solved"), DFDB, and the user's
  recorded card. Content in `data/roux.js`.

## What I could not do
- speedsolving.com and scheopner.com are blocked from the build environment,
  so I could only see search-result summaries of the Roux/L7E/EO pages and of
  athefre's DFDB. The page says so. The algorithms are shortest sequences
  found by search; DFDB is our own equivalent (two edges + centre alignment),
  not athefre's sticker-pair convention.

## What was found (all by simulation)
- Legal LSE positions with the top corners lined up: **46,080**.
- **Corner trap:** a search on edges and centres alone gives sequences with a
  net quarter/half turn of U, which leaves the top corners out of line with the
  blocks. The first draft of 4a/4b had this problem (e.g. arrow `M U M'`).
  Every sequence on the page now has net zero U turns; for 4a a pattern turned
  by U to match a card is turned back afterwards.
- 4a: 32 bad-edge patterns, 12 families under turning U (one solved).
- 4b: 30 positions of (left piece, right piece); longest sequence 7 moves.
- 4c: with UL/UR solved and centres lined up, the arrangement of the four
  M-slice edges is one of 12 (solved, 8 three-cycles, 3 double swaps); the
  centres can be 0-3 turns out, 48 positions in all. The edges in DF and DB
  identify the case (12 ordered pairs of distinct edges = 12 cases).
- Chain align centres -> 4a -> 4b -> align centres -> 4c solves **all 46,080**
  positions (`log/2026-10-06-roux-lse-check.mjs`; takes a couple of minutes).

## The user's recorded LSE card
`M U2 M` and `M' U2 M'` leave every edge oriented, swap UL/UR, turn the top
corners half a turn and turn the centres half way. The user's wording
("M or M' + U2 and reverse") reads as `M U2 M'`, which is a different
sequence. Kept the card as recorded and added `M U2 M'` beside it; asked the
user which they meant.
