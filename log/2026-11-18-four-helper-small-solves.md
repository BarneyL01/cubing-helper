# 2026-11-18: Four helpers in Blind drills (Small solves and Tracing)

Owner asked for small-solve scrambles that test level 2 pairs and the exception pairs (Qig round: add a four-helper
method; pick pairs by ticked kinds, lower levels as options; edges and parity as now; a new twist setting).

- Corners solved with: new choice "Four helpers (B, D, F, K)" (`?corners=four`). Settings: kinds Level 0 / 1 / 2 /
  Exceptions (8) (a pair counts if its level is ticked, or it is an exception and Exceptions is ticked), Pairs 1-3,
  Twisted corners Sometimes / Always / Never; Edges (pieces) and Parity as before. Saved as `four` in
  `cubing-helper:blind-drills`.
- `js/four-helper-drill.js`: `fourHelperPlan` (memo from C, rule commutator per pair, `best` for exceptions, same-corner
  pairs letter by letter plain Orozco, odd last letter plain Orozco + Ra; same plan as the whole solves in
  `log/2026-11-18-pair-rule.mjs`) and `fourHelperScramble` (pairs on different corners undone with the 3-Style page's or
  Dylan's commutator, + odd letter + Ra, + a two-corner twist, + edge pieces; every scramble checked).
- Limits: the 8 exception pairs use only 5 corners, so at most 2 exception-only pairs; 3 pairs + a twist (or + parity and
  a twist) need more than 8 corners. The page says so.
- Moves table: one row per pair (rotation, commutator as seen, as held; exception shows the rule's longer one too), linked to Pair lookup.
- Check: `node log/2026-11-18-four-helper-drill-check.mjs` → ALL OK (1,211 scrambles over random settings, 289
  refused as impossible; every memo starts with the chosen pairs of the ticked kinds, parity/twists/edges as asked,
  the plan solves it; plus 2,000 random scrambles solved by the plan).
- Also recorded "Qig" (questions if gaps) in CLAUDE.md.
