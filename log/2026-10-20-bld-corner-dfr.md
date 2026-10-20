# 2026-10-20 — Corner cycles tab moved to the DFR buffer; "Jump to" bar

## Why

The owner found many UBL commutators hard (they use L and B). Read-only measurements
(scratch scripts, not kept) showed the buffer does not change the difficulty by symmetry, but
with the three bases `[R U R', D]`, `[R U R', D']`, `[R U R', D2]` the DFR buffer needs fewer
setup moves than UBL (mean 2.12 against 2.48; 60 pairs with at most one setup against 12). Restricting
setups to R, U, F, D still reaches all 378 pairs (mean 2.58, up to 15 moves). The owner chose the DFR
buffer with L and B setups allowed, to try to learn it.

## What changed

- Corner buffer DFR, letters V (D), K (F), P (R); the memo traces from V (`js/bld-memo.js`, generator).
- Table shape unchanged: 864 commutators, 378 pairs (198 / 138 / 36 / 6; the 3-setup pairs are BD, BX, DB, DX, XB, XD); 14 twist rows.
- Parity: the Old Pochmann swap (UBL ↔ DFR, sticker E ↔ V) with U, L, B setups to bring the last letter to E: 21 rows, at most 2 moves. Two edges swap too; which two depends on the setup (check 4 requires exactly two).
- Easiest cycles: D layer first (the buffer is in it), then U, then the sides (D 44, U 22, sides 132).
- Page text, nets, lookup, examples updated; the Commutators 3-style paragraph now says V for corners.
- New `js/page-jump.js`: a sticky "Jump to" bar on the Commutators, Corner cycles and Edge cycles pages, with the current section highlighted and anchors offset below the bars.

## Checks

Generator: all checks pass (pairs, setup rows, twists, parity, flips, exercises, 2,000 random corner scrambles with 1,005 odd, even full solves 507 of 507, helper unit cases).
Browser (390 px, 1280 px): no console errors, no page-level sideways scroll; jump-bar clicks land the heading below the bars and the highlight follows.

## Open

- The practice tab and the Reference tab still use the UBL buffer, traced from E; this page uses DFR.
- Odd counts on the edge side stay off the page.
