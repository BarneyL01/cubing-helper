# 2026-09-28 — Blindfolded (M2 / Old Pochmann)

- User sent notes for 3x3 blindfolded: M2 edges (Speffz, buffer DF = U/K)
  and Old Pochmann corners (buffer UBL = A/E/R), setup moves for every
  letter, two parity algorithms, corner-setup tips and the corner swap
  (Y-perm without F/F' — Jolly Rupture Sassy Prefer in the cipher).
- Verified by simulation rather than by eye: memorise a random scramble
  with the user's letters (edges from U, corners from E), execute every
  setup/algorithm, check the cube ends solved.
  - First run: only ~1/3 solved. Per-letter tests showed all 21 corner
    setups correct (each sends sticker E to its letter) and 21/22 edge
    letters correct. **Edge B's setup `R' U R' U'` sends the buffer to V.**
    The standard `R' U R U'` fixes it.
  - With B fixed: **500/500** solved (246 needed parity), with either
    parity algorithm and either set of E/F/G/M/O/P setups (B-moves or the
    `x'` alternatives). Confirms the C↔W / I↔S swap on every 2nd target.
  - Order matters: edges must come before corners (corners first: ~50%
    solved), because every corner swap also swaps the UL/UB edges. Parity
    can go between edges and corners or at the end.
  - Both parity algorithms have identical effect: swap UL/UB and undo the
    leftover M2 (UF/DB + centres).
- Page `3x3/bld/index.html` ("3x3 · Blind" in the top menu, home card):
  solve order, two Speffz nets (edges / corners) with buffers and the M2
  opposite pairs highlighted, setup/undo tables for every letter, parity
  and corner-swap cards. B's fix is flagged on the page.
