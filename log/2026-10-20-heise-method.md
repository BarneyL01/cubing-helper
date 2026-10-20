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
