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
