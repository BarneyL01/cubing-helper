# Jack Cai's corner commutators compared with ours (2026-11-03)

Source: Jack Cai's commutator spreadsheet (linked from the Speedsolving thread "Intuitive 3-Style as a Beginner
Blind Method"), downloaded as xlsx and one CSV per tab: `docs/sheets/jack-cai-commutators/`. Only the Corners tab
is compared. Script: `log/2026-11-03-jack-cai-compare.mjs`; full table: `docs/sheets/jack-cai-commutators/comparison.csv`.

Compared against:
- **Ours**: `data/three-style-ours.js` (R cores, setups of up to 3 moves of R U D F; 378 pairs).
- **Dylan's sheet**: `data/three-style-corners.js` (378 pairs).

## Result in one line

For every pair Jack lists, his algorithm and ours (and Dylan's) move the same three corners the same way. The
lists differ in how they are written, how long the setups are, and which moves they use.

## What was checked

For each pair, the whole-cube sticker permutation of each algorithm was compared. Every pair Jack lists is a pure
corner 3-cycle (9 stickers move, nothing else), and each one matches ours and Dylan's exactly. The reverse
direction was also checked: Jack lists each pair in one direction only, so the other direction is his algorithm
backwards. That matches ours and Dylan's reverse entries in all cases.

The check is sensitive: a different pair (AF against AG) fails it, so the matches are not automatic.

The check shows that all three sources solve each pair with the same 3-cycle. It does not show that that cycle is
the one a solver wants. That was checked earlier, when our table and Dylan's were generated.

## Numbers

| | Jack | Ours | Dylan's sheet |
|---|---|---|---|
| Pairs listed | 190 (one direction each) | 378 | 378 |
| Mean moves per pair | 11.86 | 10.64 | 11.98 |
| Range | 8–18 | 8–13 | 8–18 |
| Algorithms with wide or rotation moves | 24 (15 with x, y or z) | 0 | 9 (use B or a wide l) |
| Same text as the other sheet | 27 match ours | — | 41 match Dylan's |

Jack's algorithms are shorter than ours for 23 pairs and longer for 131. Against Dylan's they are shorter for 53 pairs
and longer for 84.

## What this means for our page

- Our table is not a different set of commutators. It is another way to write the same 3-cycles, with shorter setups.
- Jack's sheet is useful as a second text for the same cycles. The wide moves and rotations in 24 of his
  algorithms are the main reason his text differs from ours. Our tables use only R, U, D and F, so his text
  cannot be used as-is on the site without conversion. Dylan's sheet uses B or a wide l in 9 algorithms.
- The one-direction layout is a learning choice. Jack gives one commutator and expects the learner to reverse it.
  Dylan's and our tables list both directions.
- The preference question from the earlier note is now narrower. Any two of these sheets give the same cycle for a
  pair, so a learner who prefers Dylan's sheet is choosing its setups and layout, not its cycles.

## Limits

- The comparison covers corners only. Jack's Edges tab and Parity Algs tab were not compared.
- The check compares cycles, not how easy an algorithm is to execute. Ergonomics is still a judgement.
- Jack's sheet has no date on the tab that was read, so it may have changed since the thread was written.
