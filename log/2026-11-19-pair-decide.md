# 2026-11-19 Pair drill: Decide mode

Added a Steps / Decide switch to `3x3/practice/pair-drill.html` (`?mode=decide`, mode saved in `cubing-helper:pair-drill`). Steps is unchanged.

Decide: random pair from the same filters; three tap questions (letter into a helper's place, helper, first turn(s) as seen after the F/K rotation), each marked right/wrong at once with a one-line reason; then an answer block (where the other letter is, its setup, the base, which half is written first and its first move, the whole commutator, `best` for exceptions). Score is in memory only.

Direction finding (all 378 rows, `log/2026-11-19-pair-decide-check.mjs`): "the letter in the helper's place is the pair's 1st letter" does NOT fix which half comes first across helpers, but it does per helper:

| Helper | walked is 1st letter | walked is 2nd letter |
|---|---|---|
| B | interchange first | insertion first |
| K | interchange first | insertion first |
| D | insertion first | interchange first |
| F | insertion first | interchange first |

(Interchange = the one-move half, insertion = the three-move half, as seen after the rotation.) The page states the direction from the written base, not from this table.

Level-2 wrong options: both other powers of the first turn and one other power of the second turn.
- 2026-11-19: Which group? gained a "Which half of the base comes first" section (1st / 2nd rule, per-helper table, A → G example).
