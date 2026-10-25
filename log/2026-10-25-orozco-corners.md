# 2026-10-25 — Orozco corners page

Owner asked what Orozco is, whether it is about 21 algorithms and whether they are similar, then asked for
the page. `3x3/bld/orozco.html` (Blind section, after Old Pochmann; home quick link).

- From the sources (search results; cubinghistory.com did not resolve from the build environment):
  buffer UFR, helper UBR, odd targets buffer -> target -> helper, even targets buffer -> helper -> target.
- Ours, by simulation (`log/2026-10-25-orozco-corners.mjs`, `--write` rewrites `data/orozco-corners.js`):
  - 18 target letters (24 minus buffer C/J/M and helper B/N/Q). Every one is one of three bases,
    `[R D R', U']` (6), `[R D' R', U']` (4), `[R D2 R', U']` (8), with a setup of 0-2 D/L turns
    (setup sizes 0/1/2 = 3/10/5); 8-12 moves. The shortest commutator of any shape is 8-9 moves but they
    are all different; the three-base set costs at most 3 more moves.
  - Helper letters: B skip; N twist (1st of pair) / twist backwards (2nd); Q the reverse. Twist =
    `(R' D' R D)×2 U (D' R' D R)×2 U'`, which twists UFR and UBR. Treating N/Q like B fails (the wrong
    sticker of the helper goes to the next target); this rule solved 678/678 even cases, then all.
  - Odd count: after M2 edges with the M2 parity algorithm and the last letter forwards, the leftover is
    always the same (816/816 odd test cases): UFR <-> UBR and UL <-> UB swapped, nothing twisted. The
    Ra-perm `R U' R' U' R U R D R' U' R D' R' U2 R' U'` fixes it.
- Check: 3,000 random scrambles, M2 edges then Orozco corners: all solved (1,637 odd, 2,872 with a helper
  letter, 2,410 with a cycle break). `js/orozco.js` (the planner the page and drills can use): 300/300.
- `js/bld-memo.js`: new export `cornerMemoFrom(state, ref)`; the planner check (500 scrambles) is unchanged.
- Headless Chromium at 390 and 1280: no console errors, no horizontal scroll, 18 rows, section row and menu.
