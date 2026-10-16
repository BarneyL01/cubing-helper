# 2026-10-16 — Blindfolded "Cycles & setups" tab planned

The user asked for a plan for another page extending the Commutators tab, to
explain "rotations and setup moves". Asked what "rotations" meant; answer:
**how to decide which corners to choose to cycle to solve the cube**. Other
answers: content is ours and checked by simulation; a new tab beside
Commutators; a fixed list of exercises.

Plan: `docs/bld-corner-cycles-plan.md` (first named `docs/bld-cycles-plan.md`). Nothing on the site changed.

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

## Follow-up the same day: edges tab

The user confirmed and asked for an edges plan as another tab. The corner plan
was renamed (`docs/bld-corner-cycles-plan.md`, page `corner-cycles.html`, tab
"Corner cycles"); the edges plan is `docs/bld-edge-cycles-plan.md` (page
`edge-cycles.html`, tab "Edge cycles"). Five tabs don't fit at 390 px with the
current `.tabs` CSS, so the corner plan makes the tab bar scroll sideways.

Edge prototype (buffer UF; insertions/interchanges from U D R L F B M E S):

- 5,376 pure edge 3-cycle commutators (centres checked unchanged).
- 440 ordered letter pairs: 318 direct (312 of 8 moves, 6 of 4 moves), 122
  need one setup move, none need more.
- `M' U M' U M' U2 M U M U M U2` flips UF and UB only.
- `R U R' F' R U R' U' R' F R2 U' R' U'` swaps UF ↔ UR and UFR ↔ UBR only;
  both tabs now use it for parity (the corner plan first had a T-perm that
  swaps UL/UR instead — changed so the two tabs share one method).

Parity in a full solve — tried in the prototype:

| Method | Result |
|---|---|
| Finish edges with the algorithm, then relabel the corner letters (buffer ↔ UBR) | Failed: 0 of 150 odd scrambles |
| Edge setups to UR from slice moves only | Only 4 of 22 edge stickers reachable |
| Corner setups to UBR from D, L, B only (never touch UFR, UF, UR) | All 21 corner stickers, at most 3 moves; setup + algorithm + undo correct for all 84 edge/corner combinations tried |

So the plans teach: memorise edges as if UF and UR were swapped, solve the
edges, then finish the corners with a D/L/B setup + the algorithm. Not yet
proven on whole scrambles — the edge plan's check E5 must do that (500 odd
scrambles) before anything is built on it.
