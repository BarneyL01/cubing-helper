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
