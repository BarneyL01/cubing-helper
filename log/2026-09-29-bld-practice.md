# 2026-09-29 — Blindfolded practice tab

Request: a Blind simulator tab — generate a scramble, show the M2 edge list
and the Old Pochmann corner list, to skip working out the memo and just
practise memorising and doing the moves.

## What's there

- The Blind section now has two tabs: **Reference** (the existing page) and
  **Practice** (`3x3/bld/practice.html`). The top menu is unchanged.
- **Scramble**: 25 random face turns (no same face twice in a row, no three
  turns on one axis in a row). "New scramble", or "Use my own scramble"
  (face turns only — slice moves, wide moves and rotations are refused,
  since they'd move the centres). The scramble is kept in the page URL, so
  reloading keeps it.
- **Picture**: unfolded colour net of the scrambled cube, laid out like
  the letter nets on the reference page. "Hold" picks the colours: white
  top / green front (WCA scrambling orientation, default) or yellow top /
  green front. The letters don't depend on this — only the picture.
- **Memo**: edge letters (M2, from buffer sticker U) and corner letters
  (Old Pochmann, from buffer sticker E) in pairs, with target counts and
  whether parity is needed. Cycle breaks are underlined. "Hide letters"
  blanks the letters and hides the moves, so you can memorise, hide, then
  solve.
- **Moves for each letter** (collapsed): per target the setup, M2/swap and
  undo; on 2nd targets C↔W / I↔S shows the letter you actually do; parity
  row when needed. Letters link to their row on the Reference tab.

## How the memo is worked out (`js/bld-memo.js`)

- Follows the sticker at the buffer to where it belongs, and so on, until
  the buffer piece comes back. Then starts a new cycle at the first
  unsolved piece in letter order (this also handles flipped edges and
  twisted corners in place: two targets on the same piece).
- Uses the setups/special algorithms from `data/bld.js`, so the reference
  table and practice page can't disagree.

## Checks

- Node: 2,000 random scrambles — running every listed move (edges, parity
  algorithm 1 when odd, corners) on the scrambled cube solves it every
  time. Also solved cube, a single `R`, `U2`, a flipped-edge scramble,
  twisted corners, and the checkerboard pattern.
- Colour net checked against a known scramble (`R`: green on the U face's
  right column, yellow on the F face's right column, in WCA colours).
- Browser: no console errors, no outside requests, own-scramble input
  rejects `M'`, accepts curly apostrophes, colour choice and scramble kept
  on reload, no sideways page scroll at 375px (the moves table scrolls
  inside its box).
