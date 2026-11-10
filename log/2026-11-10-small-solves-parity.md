# Small solves: practise parity (2026-11-10)

Owner asked for a way to practise parity in Small solves (Blind drills).

- New "Parity" select (Sometimes / Always / Never) under the counts, shown with "Pieces out of place"
  (saved as `parityMode`; Tracing shares it). With "Letters to solve" it is hidden: odd letter counts already mean parity.
- `js/bld-drill.js` `drillScramble({ parity })`: Always starts with the odd swap, Never leaves it out; every scramble
  is checked with `bldPlan(...).parity`. Always needs at least 2 corners and 2 edges (the swap moves two of each).
- Fix: the generator may now stop straight after the swap, so Always works for 2 corners + 2 edges.
- `log/2026-10-23-bld-drill-check.mjs` checks 616 Always/Never scrambles (every count 2-8 corners, 2-12 edges):
  right counts, right parity, and solved by M2 + Old Pochmann, M2 + Orozco and M2 + Orozco with helper P. ALL OK.
- Checked at 390 px in headless Chromium, no console errors.
