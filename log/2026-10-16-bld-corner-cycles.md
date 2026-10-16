# 2026-10-16 — Blindfolded "Corner cycles" tab built

Built `docs/bld-corner-cycles-plan.md` (the corner half of the two-tab plan).
Page: `3x3/bld/corner-cycles.html`, tab "Corner cycles" on all five Blindfolded
tabs. Buffer UFR (letters C, J, M).

## Generated tables (`log/2026-10-16-bld-cycles-generate.mjs`)

Candidates are found on sticker permutations (54 stickers, composed as arrays);
the checks use the simulator and the shipped memo.

| Table | Result |
|---|---|
| Pure corner 3-cycle commutators | 864 |
| Ordered pairs (of 378) | 378 |
| Pairs by setup moves 0 / 1 / 2 / 3 | 198 / 138 / 36 / 6 (the prototype's numbers) |
| Twist rows (buffer + corner, both directions) | 14 |
| Parity setups (last letter Z to B, D/L/B only) | 21, at most 3 moves; T → `D L B'`, O → `B`, K → `D B` as in the plan |

The data file's GENERATED block (`data/corner-cycles.js`) is written by
`--write`; the prose and page layout are in the HTML.

## Checks (all pass)

1. Every pair: the moves put C → X → Y → C on corner stickers, nothing else moves; the notation expands to the stored moves.
3. Twist rows: UFR and the other corner twisted in the stated directions; nothing else changes.
4. Parity setups: setup + parity + undo swaps sticker Z with C, and only the UF/UR edges swap as well.
5. Parity algorithm: UFR ↔ UBR (stickers C ↔ B) and UF ↔ UR (stickers C ↔ B, I ↔ M on edges), nothing else.
6. Exercises (below): the solution solves the scramble's corners.
8. 2,000 random face-turn scrambles (1,005 odd): the corner steps solve every corner.
9. The Practice tab's `bldPlan` gives the same output on 500 random scrambles as before the change: `log/2026-10-16-bld-check-planner.mjs`.
10. Helper unit cases: `[U: [R U R', D]]` → `U R U R' D R U' R' D' U'`; `(R' D' R D)×2` → 8 moves; `R R` → `R2`; `R R'` → nothing; `U2 U` → `U'`.

Check 9: 500 of 500 identical (old `js/bld-memo.js` from `HEAD` against the new one; run with `git show HEAD:js/bld-memo.js` as the argument).

## Choices not in the plan

- **Break chain:** the chain runs until it reaches a letter on the same corner, as the Practice tab's memo does. The plan's "write the break letter again at the end" is not what the memo produces. Check 8 passes with the memo's chain.
- **Twist order:** twist rows come last, after the pairs and the parity step (plan 2.3). Each row's buffer turn is +δ for the corner K twisted by δ, so the buffer ends at zero.
- **Direction:** "clockwise" = seen from outside the corner, the U/D sticker moves to the next face clockwise (rotation by −120° about the corner diagonal).
- **Naming:** a corner with several spellings uses the one starting with U or D (DFL, not LDF).
- **Colour:** white top, green front, as the plan asked. `caseDiagram` gained a `palette` option and the `'corners'` stickering.

## Page

- Sections 1–7 as the plan. Worked example 1: 6 letters, three pairs, no break. Worked example 2: a break, with the break table (B = 19, N = 20, Q = 18: Q is the cheapest, and the default is B).
- Exercises 1–8 as the plan's table: pairs, a cycle, an early break, a break at the buffer, a twisted pair, odd letters, a full corner memo from a random scramble (8–10 letters, at least one break).
- Lookup stores the choice in `cubing-helper:bld-corner-cycles`.
- Tab bar scrolls sideways; the current tab is brought into view on load (`js/site-chrome.js`).
- Links from the Commutators page: the "building one" setup step, and the practice paragraph.

## Browser checks

Headless Chromium at 390 px and 1280 px on all changed BLD pages, the home page:
no console errors, no page-level horizontal scroll at 390 px, the lookup updates
and survives a reload, hidden solutions open, the filmstrips draw with coloured
outlines.
