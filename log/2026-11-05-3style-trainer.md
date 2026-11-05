# 2026-11-05 — 3-Style solves trainer

Owner asked for a trainer like Blind drills' Small solves, but by base, with a choice of setup lengths.
New Practice page `3x3/practice/three-style-solves.html` (menu Practice › "3-Style solves", home quick link),
generator `js/three-style-trainer.js`, checker `log/2026-11-05-3style-trainer-check.mjs` (2,764 random settings: the
by-base solution solves every scramble, the corner memo from C is exactly the chosen pairs, edges untouched; ALL OK).

- Settings (localStorage `cubing-helper:3style-solves`): base groups (By base page order, insertion-first commutator,
  Orozco groups labelled), setup moves 0-4, optionally "both targets move" pairs, 1-3 pairs per solve, picture
  none / 3D / net. Default: group A P, no setup and 1-move setups, 1 pair.
- Scramble: pairs on different corners, undone with the 3-Style page's or Dylan's commutator so it does not spell out
  the answer (in ~7% of scrambles every table has the same commutator, e.g. a base with no setup).
- Show targets (letter pairs) / Show solution (per pair: base group, [setup : base], what the setup moves, moves).
