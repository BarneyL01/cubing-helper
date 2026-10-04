# 2026-10-04 — 8355 remaining edges explained visually; Commutators tab

## 1. 8355 step 4 (remaining edges), reworked

User: struggles most with the remaining edges, especially the last two, wants
it explained visually, and thought it could be learned intuitively rather than
with algorithms.

The user was right, and this **corrects what the 2026-10-03 log said** (that
the last two edges needed a separate algorithm). The wiki's two "swap"
algorithms are the same lift–turn–drop move done twice:
`R U R' U R U R'` = (R U R') + U + (R U R'), and
`F' U' F U' F' U' F` = (F' U' F) + U' + (F' U' F).

- Step 4 text now builds on one idea: the top layer is a ring whose edges only
  have to be in the right order relative to each other, and one move — the
  **cycle** (`R U^k R'` or `F' U^k F`) — puts the slot's edge into the ring and
  takes one ring edge into the slot. Part A (first three) and Part B (last two)
  are both cycles.
- New picture strips (`js/alg-filmstrip.js`): card 1 shows one cycle after
  each move (R lifts, U turns, R' drops); cards 2 and 3 show the last-two-edges
  case after each cycle and the final turn, with the two edges outlined (pink =
  the middle-layer edge, blue = the top edge stuck in the slot), plus a
  collapsed "every single move" strip. Pictures come from the simulator.
- Diagram code: stickering `'edges'`, outlined `marks`; render-cases: `filmstrip`
  and `wide` fields.

Checks (simulator, Node):
- Every caption claim was asserted: positions of the followed edges after each
  stage, which face the slot edge's yellow sticker is on in each case, the cycle
  intermediates (e.g. after R the slot holds the bottom-right edge and the old
  top-right edge is at back-right).
- The cycle alone (R or F' with U, U' or U2, plus free top-layer turns) solves
  **all 1,920** legal arrangements of the five loose edges, worst case **5 cycles**
  (distribution: 0 → 4, 1 → 96, 2 → 704, 3 → 804, 4 → 288, 5 → 24).
- A greedy "one more edge in place each time" rule does NOT always work (it got
  stuck in most arrangements), so the page does not claim a rule for part A.
- Plain / flipped rule (yellow sticker on the slot edge faces front → card 2,
  right → card 3) re-run over the 32 arrangements: all solve.

## 2. Commutators tab (Blind section)

User pasted notes on understanding commutators (they began part-way through,
so the intro paragraph and a picture strip were written here) and asked for a
section. Put it as a third tab beside Reference and Practice
(`3x3/bld/commutators.html`, `data/commutators.js`), because the notes end
with 3-style blindfold solving.

- Sections: how a commutator works (strip of [R U R', D] after A, B, A', B',
  following three corners), changing the interchange (table + one picture each),
  building one yourself (5 steps), seven set-up-then-solve exercises (setup
  scramble and picture shown, solution behind "Show the solution", 3D toggle
  plays the solution), notes on each, generating practice, 3-style paragraph.
- render-cases: `setup` and `hideAlg` fields for exercise cards.

Checks (simulator): all four table rows have the stated cycle (and row 4 is
row 1 reversed); all seven setups are the inverse of their solutions and every
solution solves its setup; cycles named in the notes for exercises 4, 5 and 6
are right; exercise 7 leaves exactly UBR and UFR twisted.
**One correction to the pasted notes**: they said `(R' D' R D)×2` twists one
corner in place. It twists four (UFR, DFR, DBL, DBR). Exercise 7 still works
because only UFR is in the U layer, which is the interchange there. The page
says so.

Left out: the closing question in the paste ("Would you like a second set of
exercises focused on edge commutators…") was addressed to the reader, not
page content. The paste's "for your blindfold solving" paragraph is reworded as
a general 3-style note, since the Reference tab teaches M2 / Old Pochmann.
