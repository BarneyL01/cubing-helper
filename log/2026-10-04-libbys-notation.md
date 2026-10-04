# 2026-10-04 — "Libby's:" notation on 2-look OLL and PLL

Request: add a "Libby's:" line (R=1, U=2, R'=3, U'=4 — Sassy is 1234) to every
algorithm on the 2-look OLL and PLL pages; moves other than those four keep
their original notation. Examples given: Y-perm `F 1434 123F' 1234 3F1F'`,
T-perm `1234 3F11 414 123F'`.

- `js/libby.js` converts an algorithm using its mnemonic chunks for the spaces.
  `renderCases(..., { libby: true })` adds the line under each algorithm,
  including the alternative algorithm on Uv. A short key sits under each page's
  intro. Other pages are unchanged.
- Choices made from the examples (not stated outright): half turns are two
  digits (R2 = `11`, U2 = `22`, because the T-perm example writes R2 as `11`);
  spaces follow the mnemonic words; a double turn stays with the word it grew
  from; a lone non-R/U move (the G in Prefer G) joins the group before it.
- Output for the user's examples: Y-perm matches exactly. T-perm is
  `1234 3F11 434 123F'` — the user's example had `414`, but U' R' U' is `434`,
  so `414` looks like a typo.

Checks (Node): all 14 algorithms (8 OLL incl. the Uv alternative, 2 PLL corner,
4 PLL edge): the groups spell the algorithm exactly (half turns compared as
two quarter turns); the line with spaces removed equals encoding the algorithm
move by move; no group can be misread (a non-R/U letter move directly followed
by a U would read like a half turn, e.g. F then U = "F2" — none do); same
moves on a cube. Browser: 8 + 6 cards, one Libby line each, no errors, no
sideways scroll at 375px, F2L / Roux / 2x2 / Beginner's pages have none.
