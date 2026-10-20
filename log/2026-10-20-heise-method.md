# 2026-10-20 — Heise method page (partial)

The owner pasted a spec for the Heise method (Ryan Heise), summarised from ryanheise.com, which the
build environment cannot reach (the proxy returns 403 for ryanheise.com, cubinghistory.com and the
Speedsolving wiki). Built `3x3/heise/index.html` + `data/heise.js` from the spec; menu entry "Heise"
(Partial) and a home row.

## What is on the page

- Facts and a four-step overview table; four steps with the spec's rules and procedures in plain wording;
  each point from the spec, nothing from Heise's own text copied.
- Examples, all made and checked by `log/2026-10-20-heise-examples.mjs` on the cube simulator:
  - the spec's commutator `R U' R' D R U R' D'` is `[R U' R', D]` and moves exactly three corners;
  - outer and inner square pictures (solved cube, pieces outlined, for the shape only);
  - step 3: five unsolved corners -> one 3-cycle solves two (three left) -> a second 3-cycle solves the rest (edges solved throughout);
  - step 3: an edge 3-cycle (`M' U2 M U2`);
  - step 4: three last-three-corners solves: direct `[R U' R', D]`, `[R2: [R U' R', D']]` (the two right corners brought down, as the spec describes) and `[U R2: [R U' R', D']]`; each has a picture after the setup, the commutator and the undo, and the count of unsolved pieces is checked at the end.

## Not built (the spec marks these as pictures only, or they conflict)

- Edge types (correct, incorrect, neutral); simple swap and criss/cross moves; pair 3-cycle and corner twist moves.
- A worked scramble-to-solution example.
- Where the four squares sit in their solved places and the exact piece set of an inner square. A combined "four squares" picture was drawn and removed because the spec says only that the squares share a colour, not a centre.
- The spec's step 3 start state is described two ways that do not agree (first two layers minus a pair, and a list of remaining pieces), so the page gives no piece counts.
- The spec's claim that quarter turns of two opposite faces keep edge orientation is shown as "standard theory, not checked here".

## Checks

Generator: ALL OK. Browser (390 px, 1280 px): no console errors, no page-level sideways scroll; step bar, cards and filmstrips render.

## Update: gaps that could be derived

The owner asked whether the gaps could be solved by simulation. Some could, from the spec's own rules:

- **Where the four squares sit.** Listing every way to place three outer squares and one inner square on a
  solved cube with no shared pieces, five colours in all and one colour in every square: exactly 96
  (16 per shared colour). In all 96 the union is the first two layers of the shared colour minus one adjacent
  corner/edge pair (3 corners, 7 edges, 5 centres), which matches the spec's statement about the cube after
  step 2. This also settles the spec's inconsistent description of step 3's start: 5 edges and 5 corners are
  unsolved (the spec's "3 corners" is what is left after step 3). Added as a picture (white shared, front-right
  slot free) and in the notes, labelled as derived here.
- **Edge orientation along the F/B axis.** An edge reaches 12 of 24 placements using U, D, R, L and F2, B2, and all 24
  once F or B quarter turns are allowed. So U, D, R, L keep orientation. Replaces the "not checked" note.
- **A corner twist example** (pure twist of two corners, from the corner cycles tables): added to step 3, labelled as ours.

Not derivable from the spec (Heise's own definitions, shown as pictures): the three edge types, the simple swap
and criss/cross moves, the pair 3-cycle moves, and so a worked scramble-to-solution example. Any version of these
written here would be a reconstruction, not Heise's; they stay on the "not on this page yet" list.

## Update: answers from Heise's pages

Another agent answered the open-question list from ryanheise.com (the pages state facts in text, but every move
sequence for the simple swap, criss/cross, free column, pair 3-cycles, edge 3-cycles, corner twist and the worked
examples is only in an animated applet). Added to the page, reworded: the orientation (white top, green front);
the edge orientation rule and the group R, L, U, D, F2, B2 (the earlier "two opposite faces" claim was wrong and is
corrected); the build order and choice counts for the squares (24, then 9, 3/6, 4/1); the three step 3 approaches
with their difficulty; pair 3-cycle versions v1 to v3, the F2, down-under and R conjugations; the two edge 3-cycle
varieties; the corner twist commutator X Y X' Y'; history. Our own two checks: 24 outer and 12 inner squares counted;
the corner twist example has the shape Heise describes (X disturbs one piece of the U layer, Y = U).
Still not on the page (applet only): the edge-type rule, the sequences above, a worked example.
