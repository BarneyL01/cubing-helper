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

## Worked examples added (second pass, same day)
Our own examples, built from the moves (not Marshall's figures). Each start is the inverse of the example
on a solved cube; `log/2026-10-22-marshall-check.mjs` checks each count in the captions.
- Step 2: one series places the last three edges (9 → 12); a top turn first (7 → 9 → 12).
- Step 3: the side turn `R U2 R' U2` from solved (moves FR, UR, UL only; bottom layer untouched).
- Step 4: setup `R`, series, undo `R'` (5 → 2 → 4 → 8 corners).
- Step 5: three corners out, one series (5 → 8).
Searched and not used: no two-corner-at-once setup was found for the three-piece pattern in this search.

## Two extra algorithms (not Marshall's), from published sources
Added for turned pieces the series cannot turn back. Both change only the named pieces (checked in
`log/2026-10-22-marshall-check.mjs`, section 7).
- Corner twist, 16 moves: `D R' D' R U R' D R D' R' D R U' R' D' R`. Turns DFL and UBR in opposite
  directions. Source: Waterloo corner-twist generator, first result for stickers LDF and RUB
  (csclub.uwaterloo.ca/~krmatthe/corner-twist.cgi).
- Edge flip, 12 moves: `R' E' R2 E2 R' U' R E2' R2' E R U`. Flips UF and UR. Source: Ned Batchelder,
  "Two-part Rubik's algorithms" (nedbatchelder.com/text/rubiks_algorithms).
Not checked: a full solve that uses them with the setup rotations.
