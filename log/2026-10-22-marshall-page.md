# 2026-10-22 — Marshall method page

Built `3x3/marshall/index.html` from `docs/marshall-method-plan.md`. The plan said the source could not be read;
on this date `helm.lu/cube/MarshallPhilipp` (linked from Wikibooks) was reachable, so the text was read from there:
the index, the two series, and steps one to five.

## What is on the page
- Two series as picture strips, from solved: `F R' F' R` (edges), `U R U' L' U R' U' L` and its mirror (corners).
- Five steps reworded from his text, credited to him. Step 1 has a card for his example, built from his words.
- A "not checked yet" section listing what is not verified.

## Checks (`node log/2026-10-22-marshall-check.mjs`, ALL OK)
- EPS moves exactly UF, FR, UR; bottom and other edges untouched.
- CPS (right) moves UFL, UBL, UBR; no edges; reverses to solved.
- CPS (left) moves UFR, UBR, UBL; no edges; reverses to solved.
- Step One: the start from his words has blue edges at UR, FR, DF, DB; the six moves leave a blue top cross.

## Corrections to the plan
- The plan said the CPS leaves the three corners untwisted. In standard orientation all three end twisted
  (their twists must sum to zero). The page says so.
- The plan's "away" reading gives the sequence in the plan; the text gives it as `U R U' L' U R' U' L`.

## Not done (plan items)
- Whole-method test on 1,000 random scrambles and the 65-move comparison: not built. Steps 2–5 depend on his
  judgement about which piece to take next and are not coded.
- His figures (colour-coded examples in steps 2–5) are not reproduced.
