# 2026-10-22 — Looking for a new intuitive method (simulation notes)

Owner's goal: a way to solve the cube with very few algorithms (Sassy repeated is fine; up to 3
short sequences that "clearly do a thing"), short planning horizon, not the beginner's method, not
for speed. Commutators are not intuitive for them. No page built; these are research notes.

Scripts (all in `log/`):
- `2026-10-22-intuitive-score.mjs`: pieces you care about out of place after each move of a step;
  search for sequences (up to 5 moves) that change only one region.
- `2026-10-22-sim-engine.mjs`: method simulator. A step adds one piece (or a group, "bar") at a time
  with the shortest sequence from an allowed move set, keeping solved pieces solved. Records the
  length (planning horizon), the peak number of solved pieces out of place, the longest broken run.
- `2026-10-22-method-a.mjs`, `2026-10-22-method-b.mjs`, `2026-10-22-method-b-edges.mjs`,
  `2026-10-22-roux-sassy.mjs`.

## Scores of existing steps (peak solved pieces out / longest broken run)

F2L insert 3/2; 8355 cycle 3/2; Roux `M' U2 M` 0/0; Marshall edge insert 4/3; `M' U2 M U2` 11/3;
`[R U R', D]` 13/7; Marshall corner cycle 15/7; Sassy x3 9/11.

## Region-only sequences (up to 5 moves, any face or slice)

Only slices have them: middle-layer edges (`R2 E R2 E'` etc., 11 effects) and M-slice edges
(`U2 M U2 M'` etc., 11 effects). None for top-layer corners, top-layer edges, or one column.
The E-slice ones reach only 12 of 96 middle-edge arrangements: they never flip an edge.

## Method A (middle layer free): ruled out

Bottom layer one piece at a time: within 6 moves. Top layer with the middle free: every test
position left 3 to 6 top pieces that no sequence of up to 8 moves could place. Bars (rows of 3):
worse. Middle edges: the short slice sequences cannot flip edges.

## Method B (corners first, then edges with slices)

Corners: 3 bottom corners intuitive (at most 3 moves each, peak 2), then the 8355 last-five-corners
procedure (Sassy + bottom-layer turns; already checked on 3,000 positions, and edges being free
does not change it). Edges, corners solved: slices + half turns only: stuck after 2 edges (cannot
flip / reach). All moves, up to 6 per edge: about 7 edges go in, the last 3 to 5 do not. Bars
(two opposite edges of a face): 3 bars left. Adding the 4-move cycle `M' U2 M U2` as one move with
up to 5 moves per edge: still 2 to 4 edges left. B needs a stronger edge endgame.

## Roux blocks + Sassy instead of CMLL

Both blocks solved; top corners with Sassy (right block) and its mirror `L' U' L U` (left block),
U and M turns, keeping both blocks: 10 of 10 positions solved, mean 25 turns. The first corners
take 1 to 7 moves; the last ones 11 to 12 (Sassy counted as one), found by search, so a rule (like
8355's "repeat Sassy until it drops in") would be needed to make it intuitive.

## Corners first, then edges ("Marshall the other way round"), with repeat-style sequences

`2026-10-22-repeat-edge-algs.mjs`: words of 2 or 3 turns repeated k times that leave every corner and
centre solved: 883 different edge-only effects up to 16 turns. Made of U, D, R, M, E only, e.g.
`(U2 M2)x2` swaps two pairs (4 turns), `(U2 M E2)x2` 3-cycle (6), `(U' M')x4` / `(U M)x4` flip 4
edges in place (8), `(U M2)x4` moves 6 (8), `(U R2)x6` moves 5 (12).

- Corners: 3 bottom corners intuitive, then 8355's last-five-corners procedure (Sassy repeated).
- All 12 edges one at a time with every turn plus four repeat sequences (setups up to 2 turns): 5 of 6
  positions left 2 to 3 edges (usually a flipped pair). Not good enough.
- Split as in Roux instead: the six side edges (DL DR FL FR BL BR) one at a time, any turns, up to 6:
  8 of 10 positions done (mean 26.5 turns, mostly 4-turn inserts like `M R U' M' U R'`), 2 left one
  edge (flipped in place). Peak solved pieces out 8-13: these inserts are commutator-shaped.
- Last six edges with M and U plus sequences (`2026-10-22-lse-repeat.mjs`, 40 positions, up to 8
  moves per edge, a sequence counting 1): M/U only 39 stuck; + `(U' M')x4` and `(U2 M2)x2`: 0 stuck
  (mean 45.8 turns); + `(U M2)x4` too: 0 stuck (mean 50.0, shorter horizons); + `(U' M')x4` and
  `M' U2 M U2`: 1 stuck.

## Corners last (edges and centres solved first)

Owner's point (2026-10-22): corners first is hard to follow because the centres move; edges (two
colours) are easy to track, so edges first and corners last.

`2026-10-22-repeat-corner-algs.mjs`: 2796 corner-only effects from 2- to 4-turn words repeated (up
to 24 turns). Pure 3-cycles from 8 turns, with R, U, D only e.g. `(U2 R D2 R')x2` (DFL UFL UBR),
`(D2 R U2 R')x2`; double swaps `(U' R U R')x3`, Sassy x3; no repeat word twists corners on its own
and none cycles three top corners only.

`2026-10-22-corners-last.mjs` (20 positions, corners one at a time, setups of any face turn):
- `(U2 R D2 R')x2` + reverse + Sassy x3, up to 5 moves per corner: 19 of 20 stuck with 2-3 corners
  left (twists).
- plus a twist built from Sassy-on-the-bottom, `(R' D' R D)x2 U (D' R' D R)x2 U'` (and reverse):
  up to 5 moves: 3 stuck; up to 6: 0 stuck, mean 119.9 turns.

## M2 special cases (`2026-10-22-m2-alternatives.mjs`)

Shortest sequences with exactly the same effect (U, D, M and half turns of R L F B, up to 12):
C and W 4 (as now: `(U2 M')x2`, `(M U2)x2`); I and S 10 (now 11, all commutator-shaped);
Q 11 (now 16, but the 16 is mostly `U' M'` repeated). No setup of up to 4 turns + M2 + undo does
any of them. I = `D (M' X) (M X) D' M2` and S = `M2 D (X M') (X M) D'` with the same X = `U R2 U'`.
