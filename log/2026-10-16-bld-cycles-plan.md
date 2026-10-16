# 2026-10-16 — Blindfolded "Cycles & setups" tab planned

The user asked for a plan for another page extending the Commutators tab, to
explain "rotations and setup moves". Asked what "rotations" meant; answer:
**how to decide which corners to choose to cycle to solve the cube**. Other
answers: content is ours and checked by simulation; a new tab beside
Commutators; a fixed list of exercises.

Plan: `docs/bld-cycles-plan.md`. Nothing on the site changed.

## Prototype numbers (Node; prototype not kept)

- 864 pure corner 3-cycle commutators (insertion = 1 face turn or `X Y X'`,
  interchange = 1 face turn, both orders).
- Buffer UFR, 378 ordered letter pairs: 198 direct, 138 need 1 setup move,
  36 need 2, 6 need 3 (AU, AW, UA, UW, WA, WU).
- Tested rules ("two of the three pieces share a layer", "two stickers on the
  same face"): neither separates direct pairs from setup pairs, so the page
  teaches a procedure plus a lookup table instead of a rule.
- `R U R' U' R' F R2 U' R' U' R U R' F'` swaps UFR ↔ UBR and UL ↔ UR only
  (used for corner parity). A J-perm written from memory did not do what was
  expected — the plan only allows sequences the checker verifies.
- Using `applyAlg` per candidate took 22 s; the plan specifies sticker
  permutations composed with arrays instead.
