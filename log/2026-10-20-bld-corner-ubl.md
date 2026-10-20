# 2026-10-20 — Corner cycles tab moved to the UBL buffer

The owner asked for the corner tab to use the UBL buffer, so it overlaps with
Old Pochmann (Reference and Practice tabs). Corners only; the edge tab keeps UF.
The owner also chose: teach the corner side of an odd count only.

## What changed

- Buffer UBL, letters A (U), E (L), R (B). `js/bld-memo.js` `cornerCycles` and
  `log/2026-10-16-bld-cycles-generate.mjs` use it; twist rows use UBL as the buffer.
- Parity: the Old Pochmann corner swap from `data/bld.js` (swaps UBL ↔ DFR,
  stickers A ↔ P, and the UL and UB edges). Setups are D, F, R moves that leave UBL,
  UL and UB alone: 21 rows, at most 2 moves.
- Edge tab: the odd-count edge method and the UF/UR parity swap are removed
  (`edgeCycles` no longer takes `swap`, no `edgeParitySwap` data); section 4 names
  the corner step and says the edge side is not on the page.
- Page text, nets (buffer stickers A, E, R), lookup default, the Commutators
  3-style paragraph (UBL for corners).

## Numbers (regenerated; the pair table is the same shape as with UFR)

- 864 corner 3-cycle commutators; 378 of 378 pairs; by setup moves 0/1/2/3:
  198 / 138 / 36 / 6; the 3-setup pairs are CU, CW, UC, UW, WC, WU.
- 14 twist rows; 21 parity setups.
- Checks: all pass, including 2,000 random scrambles (1,005 odd) with the corner steps
  solving every corner, and the even full solves (507 of 507). Edge tables unchanged
  (440 pairs, 318 direct, 122 with one setup move; 11 flips).
- Headless Chromium at 390 px and 1280 px: no console errors, no page-level sideways scroll.

## Added: "Easiest cycles to learn" and "How to use a setup move" (corner tab)

- New sections 5 (easiest cycles) and 7 (how to use a setup move); the old 5, 6, 7 are now 6, 8, 9. The edge page's reference to the setup section is now section 6.
- Easiest cycles: the 198 direct pairs grouped by the layer the interchange turns: U layer 44, D layer 22, side layers 132 (counted from the table on the page). Order: U, D, sides, then one-setup pairs.
- Setup rows now carry `comm` (the bare commutator) and, when the setup leaves the buffer sticker alone, `inner` (the pair the bare commutator solves). 168 of the 180 setup rows have one; the other 12 use a setup that moves the buffer's sticker and the page says so. New generator check 2 verifies each inner pair (the commutator solves it and the setup carries both stickers onto it). All checks pass.
- The page shows one-setup and two-setup examples from the table as a filmstrip: start, setup, commutator, undo.
