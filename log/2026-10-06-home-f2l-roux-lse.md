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

## Follow-up: comparison with outside sources (network access enabled)
- Reachable: scheopner.com and sites.google.com (athefre). Still blocked:
  speedsolving.com and www.speedsolving.com. Neither opened page gives a full
  DFDB case table; athefre's says DFDB tracks the DF and DB stickers (or UF
  and UB) through 4b and aligns the U layer from them.
- Scheopner (summarised, not copied): 9 non-mirror EO cases with names and
  (top/bottom) counts; 4 unsolved 4c cases; 4b recipe (put one of UL/UR piece
  on the bottom with M2, then `M' U2 M'` or `M' U2 M`, then align and M2).
- Matches found by simulation: his V + D-Line algorithm (`M2 U' M' U M'`) is
  identical to our card; his 3-cycles `U2 M' U2 M`, `M' U2 M U2` are two of our
  cards; his H (`M2 U2 M2 U2`) has the same effect as our `U2 M2 U2 M2`; his
  "Dots" (`M' E2 M E2`) = our `U2 M' U2 M2 U2 M' U2` case after the M2 that
  lines the centres up. His EO algorithms other than V + D-Line are shorter
  because they leave the top corners out of line (net U turns), ours do not.
- The EO cards now carry his names. 11 cards = his 9 + the two mirror pairs.
- The user's "2o/2" label is his (U+D)-Line (2 opposite bad on top, both
  bottom bad). Our card for it: `M U2 M U2 M' U M' U'`; his: `M' U2 M' U2 M U M`.
  Both start with the user's recorded `M U2 M` / `M' U2 M'`, so the recorded
  card reads as the opening of that algorithm. The page's "Your recorded LSE
  note" now says this and asks for confirmation (replaces the `M U2 M'`
  literal-reading card with the whole-algorithm card).
