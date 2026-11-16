# 2026-11-18 — Four-helper rule built (lead's integration notes)

Owner: review the other agent's analysis (`docs/four-helper-picking-rule.md`, branch claude/orozco-groups-selection-m2ve6g)
and send cheaper agents to build it. Merged the analysis branch; reran `log/2026-11-16-picking-rule.mjs` (numbers match).
Three agents built it:
1. Data + checks: `log/2026-11-18-pair-rule.mjs --write` → `data/pair-rule.js` (378 rows; rotated "seen" forms checked;
   8 exceptions with best 3-move commutators; bufferMove line for 192 pairs; 3,000 whole solves ×3 variants). Deviation
   (accepted): a pair and its reverse share the shorter setup → 8 exceptions (L S is not one), 40.8 corner moves per solve.
2. Pages: `3x3/bld/which-group.html` (`js/which-group.js`, replaces Walk rule; `walk-rule.html` redirects), Pair lookup
   rebuilt on `data/pair-rule.js`; `js/walk-rule.js`, `data/walk-rule.js` removed; Buffer moves keeps its Outdated note.
   Check `log/2026-11-18-which-group-check.mjs`.
3. Drill: `3x3/practice/pair-drill.html` (`js/pair-drill.js`), check `log/2026-11-18-pair-drill-check.mjs`.

Lead: merged both worktree branches (no conflicts), added Pair drill to the Practice menu and home quick links,
`site-chrome.js?v=21` on all 50 pages, fixed Pair lookup not opening the pair's pictures (`openRows` skipped the row
itself). All three checkers ALL OK; 10 pages checked at 390 px, no console errors, no sideways scroll.
Known gaps (not fixed): the pair pictures and "where the base works" tables are in the as-held view (the commutator
lines are as seen after the rotation); the buffer-move row stays closed.

## Rotated pictures and the 12-base table (owner, same day)

- Owner: "make the pictures show the rotated view too", and "include in Which group the total list of all the commutator
  bases, like the Walk rule page used to".
- `log/2026-11-18-pair-rule.mjs`: every row / best / bufferMove now also has `seenPos` (buffer and letters after the
  rotation), `spotsSeen` (after the seen setup), `movesSeen`, and bufferMove `readingSeen` (readings start at the buffer's
  place after the rotation; for K the seen base does not touch C at all). Checked: the seen base cycles spotsSeen buffer →
  first → second for every row; bufferMove readings found both ways. Regenerated; ALL OK; other checkers ALL OK.
- `js/three-style-page.js?v=16`: optional `view` on a pair (`{ rot, back, pos, spots, setup, core, moves }`): pictures put
  the pieces' own letters (C and the two letters) at their positions after the rotation, steps and the cube runner use the
  seen moves, the runner starts from the cube as held after the rotation and ends "rotate back with …". No view = the 3-Style
  pages unchanged (checked they load). `readingTable` (`buffer-moves.js?v=6`) takes `readingFrom` / `readingNote`.
- Which group?: new "All 12 bases" section (`baseList()` from the data: each helper's three no-setup pairs, position first /
  helper first, F and K as seen after the rotation, held forms listed under it).
- Callers pass the view: `which-group.js?v=2` (`viewOf`), `pair-lookup.js?v=10`, `pair-drill.js?v=2`; `pair-rule.js?v=2`.
- Checked at 390 px: Which group (bases table 358 px), Pair lookup QT (pictures, steps, runner), Pair drill GA, 3-Style,
  Orozco, Buffer moves, helper K: no console errors, no sideways scroll.
