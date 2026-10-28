# 2026-10-27 — How Orozco works (commutator explained)

Owner: "I want to use Orozco as a way to deeply understand commutators. Pick one of the base ones, create a new
page, add a clear and simple explanation using diagrams (3D view), include one that will run the steps."

`3x3/bld/orozco-explained.html` ("How Orozco works", Blind section after Orozco; linked from the Orozco page).
Base: `[R D R', U']` (letter O, no setup), `R D R' U' R D' R' U`.

Traced by simulation from a solved cube (white top, green front):

| Part | Moves | Buffer piece (W-G-R) | Helper piece (W-R-B) | O piece (Y-R-B) |
|---|---|---|---|---|
| start | | UFR | UBR | DBR |
| X | R D R' | UFR | DBL | UBR |
| Y | U' | UBR | DBL | UBL |
| undo X | R D' R' | DBR | UBR | UBL |
| undo Y | U | DBR | UFR | UBR |

Only those three corners are out of place at the end (8 pieces after X, 15 after Y, 8 after undo X, 3 at the end).

Page: the idea (X, Y, undo X, undo Y), the three corners (still 3D picture, `js/cube-3d.js` with mirrors, other
pieces grey), part by part (picture after each part + one sentence), why only three move, a step runner
(`js/cube-rotatable.js`: one move at a time, Back / Next / Play / Reset, drag to turn, start from solved or from the
case it solves, grey-out switch; choice in `cubing-helper:orozco-explained`), and "same shape, other letters".
Headless Chromium 390/1280: no errors, no horizontal scroll, 5 pictures, runner ends "only the three corners have
moved" from solved and "Solved." from the case; section row shows the page.

## Other letters and animation (same day, owner's request)

- Tabs for four examples from `data/orozco-corners.js`: O, H, L (the three bases, no setup) and K (base D with
  setup D). Every section follows the tab. The "goes to" lines under each part are worked out by the simulator
  on the page; the general sentence per part kind (setup, X, Y, undo X, undo Y, undo setup) is fixed text.
  Checked: each example's moves equal the Orozco table's, move only the three corners from solved, and solve
  the case. (Choice in `cubing-helper:orozco-explained`, now JSON {letter, start}.)
- Step runner animates each move: `js/cube-rotatable.js` gained `animate(from, to, move, ms)`. During a turn the
  cube is drawn as 26 cubies (black faces, stickers on outer faces), the turning layer rotated, faces painted back
  to front; the still view is unchanged (Blind drills keeps the same picture). Move table copied from
  `js/cube-sim.js` (same axes and directions); the end of each turn shows the simulator's state. Speed: slow /
  normal / fast. Back animates the reverse move. Headless: mid-turn frame drawn (105 polygons vs 30 still),
  Back returns to Start, Play from the case ends "Solved."; no errors at 390 / 1280.

## Colours and steady buttons (2026-10-28, owner's request)

- One switch under the letter tabs: "Colour only the three corners" / "Whole cube in colour" (saved as
  `colours` in `cubing-helper:orozco-explained`); it applies to every picture and the runner (replaces the runner's
  grey-out checkbox).
- Runner layout: Back / Next / Play / Start again sit right under the cube; the moves line and the text are below
  them, and the part label and text have a fixed minimum height. Headless: the Next button stays at one position
  and the page height does not change through all steps (O and K, 390 and 1280). Runner "Reset" renamed
  "Start again" (the cube's own Reset resets the view).
- Phone fit (2026-10-28): runner made compact so cube, buttons and text fit one screen: moves line above the cube, cube min(62vw, 250px) (320 px from 900 px wide), the four buttons in one row, smaller view buttons, "Start again" -> "Restart". Headless: whole runner incl. text visible at 390x700 and 360x640 (runner ~530 px tall); Next button still does not move.
