# 2026-09-27 — Beginner's Method: last layer

- User sent raw notes (plain WCA notation, not the mnemonic cipher) for the
  last three steps of the beginner's-method last layer:
  - **Match cross colours** — two write-ups (`RUR'URU UR'U` and
    `(RUR') URU - UR'U`) both decode to the same sequence:
    `R U R' U R U2 R' U`. The user flagged this one as possibly incomplete
    when they wrote it — recorded as given, with that flag shown on the
    page rather than silently treated as final.
  - **Match corners** — `U R U' L' U R' U' L`, holding a correctly-placed
    corner at front-right. Standard, no ambiguity.
  - **Orient corners** — `R U R' U'` (the same 4-move sequence as CFOP's
    "Sassy"), repeated per corner with a `U` between each, held with the
    unsolved corner "on the bottom" per the user's own phrasing (kept
    verbatim rather than reworded).
- Added `data/beginners-last-layer.js` and filled in
  `3x3/beginners/index.html` (previously a placeholder) with a "Last layer"
  section using the same card/twisty-player rendering as the CFOP pages.
  White cross / white corners / second-layer edges are still placeholder.
- Updated the home page's Beginner's Method card from "Coming soon" to a new
  "Partial" badge, plus `docs/plan.md` and `CLAUDE.md` to reflect the new
  content.
- Did this on `claude/intelligent-galileo-z6cd7r` (not `main`) per the
  repo's standing branch policy — the earlier merge-to-main was a one-time
  explicit request, not a change of workflow. Will merge again once this is
  verified.

## Next

- Verify "Match cross colours" against an actual solve.
- White cross / corners / second-layer whenever the user sends those notes.
