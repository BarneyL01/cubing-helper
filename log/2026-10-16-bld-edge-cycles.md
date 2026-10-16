# 2026-10-16 — Blindfolded "Edge cycles" tab built, odd-count method open

Built `docs/bld-edge-cycles-plan.md` except section 2.4 (the full solve with an
odd number of letters), check E5, and exercise 8. Page: `3x3/bld/edge-cycles.html`.
Buffer UF (letters C, I).

## Generated tables (`log/2026-10-16-bld-cycles-generate.mjs`, edge part)

| Table | Result |
|---|---|
| Pure edge 3-cycle commutators (centres unchanged) | 5,376 (the prototype's number) |
| Ordered pairs (of 440) | 440: 318 direct, 122 with one setup move, none more |
| Flip rows (buffer + each other edge) | 11, setups of face turns only |
| Parity edge swap, read off the parity algorithm | C ↔ B and I ↔ M (UF ↔ UR), confirmed |

## Checks

- E1: every pair moves exactly its three edges as C → X → Y → C, no centre moves; the notation expands to the stored moves.
- E3: each flip row flips exactly UF and its edge; edge positions unchanged; centres unchanged.
- E4: the parity algorithm swaps UFR ↔ UBR and UF ↔ UR, and nothing else.
- E6: exercises 1–7 and 9 (numbered 1–8 on the page): the solutions solve the scramble's edges; each scramble is chosen to have the structure its exercise is for.
- E7 (even edge counts only): 0 failures on 1,000 random scrambles.
- E9 (even scrambles only): the whole cube is solved by the steps: 507 of 507.

## Open: the odd-count full solve (plan 2.4, E5, exercise 8)

The plan's method: memorise the edges as if UF and UR had swapped places, solve
the edge pairs and flips, then the corner parity step.

Result: **1 of 493** random odd scrambles fully solved. Even scrambles: all solved.
After the edge steps, many edges are misplaced (for example DB/RB, RB/UF, FR/UR),
not just UF and UR. So the swapped memo does not translate to the real cube
by the same pairs. The corners side is fine: check 8 (1,005 odd scrambles)
passes with the corner parity step.

The plan says: "If E5 fails for any scramble, stop and ask the user rather than
inventing another method." So this part is **not** on the page (section 4 says
it is not finished), exercise 8 is left out (the page numbers 1–8), and no
method was invented.

**Decision needed:** which method should the odd-count page teach? Options to
consider (none tested yet): (a) a different relabelling of the edge pairs
(conjugating each pair by the UF/UR swap rather than using the table as is);
(b) a separate edge parity setup, if one exists that fixes both edges with the
corners; (c) leave the odd-count section as a note and teach the corner side only.

## Choices not in the plan

- Exercises renumbered 1–8 on the page (the plan's 9 becomes 8 after the removed odd-count exercise).
- Exercise 9 of the plan (a full edge memo) is an even-count scramble with 10–12 letters and a break.
- Picture views: the top, bottom and cube views are used when a case moves an E-slice edge (FR, FL, BR, BL), which the top and bottom views do not show. Decided per picture by `hiddenFromTopAndBottom` in the page.

## Browser checks

As for the corner tab: 390 px and 1280 px, no console errors, no page scroll at 390 px, the lookup and saved choice work.
