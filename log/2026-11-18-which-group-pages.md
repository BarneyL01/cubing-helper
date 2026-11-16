# 2026-11-18: Which group? and Pair lookup on the four-helper rule

Built the two pages on `data/pair-rule.js` (spec `docs/four-helper-picking-rule.md`, data notes `log/2026-11-18-pair-rule.md`).
No data was regenerated or edited; every commutator on the pages is read from it.

## Pages
- `3x3/bld/which-group.html` + `js/which-group.js` (new): the rule in three levels (table with `PAIR_RULE_STATS`), level 0 (two-helper-letter table from the rows),
  level 1 (turn face and three letters per helper, held and seen, one see-through cube per helper; E G O X choice derived from the helper lists),
  level 2 (first-turn table, face test, rings, worked example Q T with steps and an open pair row), what z and y' mean (links to `orozco-f.html#rotation`, `orozco-k.html#rotation`),
  the 8 exceptions (best commutator, rule's 4-move setup), every pair by turned letter (accordions, rows built when opened with `pairRow` plus a chip: level · helper · rotation, seen notation in the heading, as-held line added to the opened body).
- `3x3/bld/pair-lookup.html` + `js/pair-lookup.js` (rebuilt): same finder (selects, Swap, `?pair=`, `cubing-helper:pair-lookup`, same-corner message); result = level, helper, rotation, commutator seen first (held small), numbered steps, open pictures,
  exception note, optional "shorter if the buffer may move" line (`bufferMove`, `readingTable`). "How to remember" generated from the data (levels, one-turn letters, level 2 first turns). `.page-outdated` note removed.
- `3x3/bld/walk-rule.html` is a redirect to `which-group.html` (keeps the hash). `js/walk-rule.js`, `data/walk-rule.js` deleted (nothing else imported them).
- `buffer-moves.html`: Outdated note now points to Pair lookup and Which group?. `orozco-d.html` link updated. Menu: "Any pair" = Pair lookup, Which group?, Buffer moves; `site-chrome.js?v=20` on all pages; home row text and quick link updated.

## Notes
- The branch did not contain the spec/data commits; fast-forwarded to `ccr-30dfe743-5np96h` (commit 3ad8252) first.
- Steps split the seen setup into turns and the other letter's setup by the number of turns (checked: setup = turns + other's setup for all 378 rows).
- `log/2026-11-18-which-group-check.mjs`: face corners, rings, seen-face map, worked example and the other letter's position after the turns, all against the data (ALL OK).
- Not built: the level-filtered drill from the spec's section 7. For F and K pairs the "As held" line is the only place the unrotated moves appear.
- Buffer-move reading tables for rotated helpers show the faces as held (data's `reading`), the commutator above them is as seen.
