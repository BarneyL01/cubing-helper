# Blindfolded "Edge cycles" tab — build plan

Status: **built 2026-10-16, except the odd-count full-solve method (section 2.4, checks E5 and E9 for odd scrambles, exercise 8): open, see below.** The fifth Blindfolded
tab, the edges version of the Corner cycles tab. **Build the Corner cycles tab
first** (`docs/bld-corner-cycles-plan.md`): this tab reuses its helpers
(`expandBrackets`, `cancelMoves`, the generator script, the memo function, the
scrolling tab bar) and copies its page layout. Read `CLAUDE.md`, then the
corner plan, then this file. Where this file says "as corners", do exactly what
the corner plan says with edges in place of corners.

User decisions (2026-10-16): an edges tab as well as the corners tab; same
approach (ours, checked by simulation, fixed exercises, no mnemonics).

The numbers below come from a prototype run under Node on 2026-10-16 (thrown
away). The build must regenerate them with the script and show the script's
numbers.

---

## 1. What the user gets

Page `3x3/bld/edge-cycles.html`, tab label **Edge cycles**, title "3x3
Blindfolded — Choosing edge cycles and setup moves".

**Buffer: UF** (Speffz edge letters; the buffer's stickers are **C** (U face)
and **I** (F face)). UF is the usual 3-style edge buffer, and it pairs with the
UFR corner buffer for parity (section 2.4). The page says once that the
Reference and Practice tabs use DF (letter U) because M2 does — a different
buffer.

Sections, in this order (as corners, edge versions):

| # | Section | Differences from the corner tab |
|---|---|---|
| 1 | From a scramble to cycles | Same procedure with edge letters; worked example with 6 letters |
| 2 | When the cycle closes early | Same; break-letter table for the worked example (each unsolved edge has 2 stickers to choose from) |
| 3 | Flipped edges | Edges in place but flipped: left out of the cycles, fixed at the end with a flip algorithm (2.3) |
| 4 | An odd number of letters | The same parity algorithm as corners, with the edge target set up to UR (2.4) |
| 5 | Choosing a setup move | Same procedure; edge commutators also use the slices M, E, S (2.5) |
| 6 | Look up a pair | 440 pairs instead of 378 |
| 7 | Exercises | 9 fixed exercises (2.7) |

## 2. Content and facts

As corners: every move sequence and every claim must come from, or be checked
by, the generator/checker.

### 2.1 Moves edge commutators use

- Insertions: any single move from **U D R L F B M E S** (each with `'` and
  `2`), or `X Y X'` with X and Y on different axes (slices included).
- Interchanges: any single move from the same 27.
- Both orders (`[ins, int]` and `[int, ins]`); skip a single-move insertion on
  the same axis as the interchange.
- Keep a candidate only if it moves exactly 6 stickers, all on edges, as one
  3-cycle of 3 different edges, **and leaves every centre in place** (slice
  moves move centres; a commutator undoes them, but check).
- Prototype: 5,376 such commutators.

### 2.2 Prototype numbers (buffer UF, 440 ordered pairs of letters on different edges)

| Setup moves needed | Pairs | Commutator length (no cancelling) |
|---|---|---|
| 0 (direct) | 318 | 8 (312 pairs) or 4 (6 pairs, the `[M', U2]` kind) |
| 1 | 122 | 10 |
| 2 or more | 0 | — |

Examples from the prototype (C → first → second):

| Pair | Commutator |
|---|---|
| AK | `F E F' U2 F E' F' U2` |
| EG | `L2 U S' U' L2 U S U'` |
| BD | `[R: [R S2 R', U]]` |
| JL | `[U: [R' S2 R, F2]]` |

The page shows the regenerated table and one example per row. Mention that
commutators with slice moves are common for edges and give the 4-move
`[M', U2]` kind its own short note (the Commutators tab's exercise 5 is one).

Setup moves: as corners — 0, then 1, then 2 moves, using the 27 moves above.
Choose per pair:

1. fewest setup moves
2. then shortest after `cancelMoves`
3. then a setup that doesn't move UF
4. then face turns before slices
5. then setup moves in the order U, D, R, L, F, B, M, E, S

### 2.3 Flipped edges

- An edge in its own place but flipped is left out of the letter list.
- Flip algorithm: `M' U M' U M' U2 M U M U M U2`. Prototype check: it flips
  **UF and UB** in place and changes nothing else.
- If one non-buffer edge is flipped, the buffer is flipped too (the number of
  flipped edges is always even): flip the buffer and that edge together.
- The checker generates, for **buffer + each other edge** (11 rows), a setup
  that brings that edge to UB without moving UF, plus the flip algorithm plus
  the undo. The setup uses **face turns only**, so the centres stay put. It
  also generates **two non-buffer edges** for the cases the exercises use.
  Show the 11 rows as a table.

### 2.4 An odd number of letters (parity)

Facts (prototype checks):

- The edge letter count is odd exactly when the corner letter count is odd.
- Parity algorithm (the same as the corner tab's):
  `R U R' F' R U R' U' R' F R2 U' R' U'`. It swaps **UF ↔ UR** and
  **UFR ↔ UBR** and nothing else.
- Corner setups made of **D, L and B moves only** never touch UFR, UF or UR.
  The prototype found one of at most 3 moves for each of the 21 corner
  stickers (e.g. O → `B`, K → `D B`, T → `D L B'`). With any edge target and
  any corner target (84 combinations tried), setup + algorithm + undo did
  exactly the expected two swaps.

Rejected methods, so they aren't tried again:

- **Relabelling the corner letters after the edges:** finish the edges with
  the algorithm, then swap the buffer's corner letters with UBR's. That fixed
  0 of 150 odd scrambles in the prototype.
- **Edge setups made of slice moves only:** only 4 of 22 edge stickers can
  reach UR that way while keeping UF in place.

Method the page teaches for a full solve with odd letters (the checker must
prove it, check E5):

1. **Corners:** memorise as usual. The count is odd.
2. **Edges:** memorise as if the pieces in **UF and UR had swapped places**:
   when the trace reaches the UR spot, read the piece that is in UF, and when
   it reaches UF, read the piece in UR. The page states the sticker pairs
   (expected C ↔ B and I ↔ M), which the checker works out from the
   algorithm's permutation. With this swap the edge count is even.
3. Solve the edge pairs (and flips). The edges are now solved except that UF
   and UR are swapped, as expected.
4. Solve the corner pairs (and twists). For the last, unpaired corner letter:
   do a D/L/B setup that brings it to UBR, then the parity algorithm, then
   undo the setup. That swaps the last corner home and swaps UF and UR back,
   so the cube is solved.

The checker generates the corner setup table (21 rows; it belongs to the
corner tab and is shared). If E5 fails for any scramble, stop and ask the user
rather than inventing another method.

On this page, exercise 8 is a full-solve parity example (edges and corners)
showing the swapped memo in step 2. Its solution includes the corner part.

### 2.5 Choosing a setup move

The procedure is the same as for corners (the corner plan's 2.5), with
one addition for edges: "the interchange can be a slice (M, E, S) as well as a
face". Show the setup-count table (2.2), one example per row, and the `[M',
U2]` note.

### 2.6 Look up a pair

As corners: two selects (buffer stickers C and I excluded; letters on the same
edge as the first letter disabled in the second). Saved in localStorage
`cubing-helper:bld-edge-cycles`.

### 2.7 Exercises (fixed list)

| # | Skill | Structure |
|---|---|---|
| 1 | One pair, direct | 2 letters, 8-move commutator |
| 2 | The 4-move kind | 2 letters, an `[M', U2]`-type commutator |
| 3 | One pair, one setup move | 2 letters, 1 setup |
| 4 | One cycle, two pairs | 4 letters, no cycle break |
| 5 | Cycle closes early | 2 letters, then a cycle break |
| 6 | Buffer already home | First letter is a break |
| 7 | Flipped pair | One pair + two edges flipped in place |
| 8 | Odd letters (full solve) | A scramble with odd counts: corner memo, edge memo with the UF/UR swap, edge pairs, corner pairs, last corner with the parity algorithm |
| 9 | A full edge memo | Edges from a real random scramble: 10–12 letters, at least one break |

Hidden solution: as corners (letters with break letters underlined, pairs,
each commutator in bracket notation and plain moves, flips, parity).

## 3. Files

| File | New / changed | What goes in it |
|---|---|---|
| `3x3/bld/edge-cycles.html` | New | The page (copy of the corner page's structure) |
| `data/edge-cycles.js` | New | Text, worked examples, exercises, generated tables `edgeComms` (440 rows), `edgeFlips` (11 rows), the parity sticker pairs for step 2 of 2.4 (`edgeParitySwap`); header comment as corners |
| `js/bld-memo.js` | Changed | Export `edgeCycles(state, { buffer = 'C' })` (same shape as `cornerCycles`, with `flipped` instead of `twisted`). Must **not** apply the M2 rule (swapping C↔W and I↔S on every second target) — that belongs to M2 only. `bldPlan` must not change |
| `js/cube-diagram.js` | Unchanged | The existing `'edges'` stickering (corners grey) is what this page uses |
| `log/<date>-bld-cycles-generate.mjs` | Changed | Add the edge tables and checks (same script as corners) |
| `3x3/bld/*.html` (all BLD tabs) | Changed | Add the fifth tab link |
| `data/commutators.js` | Changed | Exercise notes 5 and 6 (edge commutators): add a link "More: Edge cycles tab" |
| `js/site-chrome.js` | Changed | Blindfolded `children`: add `{ label: 'Edge cycles', path: '3x3/bld/edge-cycles.html' }` |
| `index.html` | Changed | Blindfolded row quick links: add "Edge cycles" (check the row still fits at 390 px; if not, put the quick links on two lines) |
| `log/<date>-bld-edge-cycles.md` | New | Log entry with the script's numbers and the combined-parity result |
| `CLAUDE.md`, `docs/plan.md` | Changed | Replace "planned" notes with what was built |

## 4. Page details

As corners (`docs/bld-corner-cycles-plan.md` section 4), except:

- Pictures of single cases: `caseDiagram(moves, { stickering: 'edges', views: ['U', 'D'] })`.
  Edges in the E slice (FR, FL, BR, BL) don't show in U/D views; add the
  `'cube'` view when a case moves an E-slice edge. Put this choice in the data,
  per exercise or lookup row (`views`), computed by the generator.
- Letter net: `bldNet('edges', { buffers: ['C', 'I'] })`.
- Same single hold as the corner page (white top, green front).

## 5. Checks (`log/<date>-bld-cycles-generate.mjs`, edges part)

| # | Check |
|---|---|
| E1 | All 440 pairs present; `moves` = `cancelMoves(expandBrackets(notation))`; applying `moves` moves exactly the three edges, as C → first → second, and **no centre** |
| E2 | The page's setup-count table matches `edgeComms` |
| E3 | `M' U M' U M' U2 M U M U M U2` flips UF and UB only; each of the 11 flip rows flips exactly UF and that edge |
| E4 | `R U R' F' R U R' U' R' F R2 U' R' U'` swaps UF ↔ UR and UFR ↔ UBR only; `edgeParitySwap` matches the algorithm's edge permutation; with the swap, every odd scramble's edge memo has an even count |
| E5 | Full-solve parity (2.4): 500 random scrambles with odd letter counts are fully solved by steps 1–4, using only the two pages' tables |
| E6 | Exercises and worked examples: as corner checks 6 and 7, with `edgeCycles` |
| E7 | 2,000 random scrambles: `edgeCycles` + tables + flips + parity solve every scramble's edges (corners ignored; on odd scrambles UFR/UBR end swapped) |
| E8 | `bldPlan` output for 500 random scrambles unchanged |
| E9 | Full solve: 1,000 random scrambles solved completely by the two tabs' methods together (as E5, all scrambles) |

Then the browser checks from `CLAUDE.md` (390 px and 1280 px; all five tabs
reachable and the active one visible in the scrolling tab bar; a 1-setup
lookup; an exercise with an E-slice edge showing the cube view; no console
errors).

## 6. Build order

1. Corner cycles tab complete and merged (its plan's build order).
2. Generator: edge tables → `data/edge-cycles.js` → checks E1–E4.
3. `edgeCycles` → checks E7, E8.
4. Full-solve parity (2.4) → check E5 (stop and ask if it can't be made to pass).
5. Page sections, exercises → check E6.
6. Tabs, menu, home link, links from `data/commutators.js`.
7. Check E9, browser checks, log entry, `CLAUDE.md` / `docs/plan.md`, merge
   per `CLAUDE.md` "Branch workflow".

## 7. Things not to do

As corners, plus: don't change the M2 method or its letters on the Reference
and Practice tabs; don't use wide moves (r, u, …) in generated commutators
(they move centres and confuse the letters).

## 8. Open questions (defaults used until the user answers)

| Question | Default |
|---|---|
| Buffer | **Answered 2026-10-16:** UF |
| Tab names | **Answered 2026-10-16:** "Corner cycles" and "Edge cycles" |
| A buffer UF/UFR 3-style option on the Practice tab (random scrambles shown as commutator pairs)? | Not in this version |

---

## Built (2026-10-16): what changed from this plan

- Built: pairs (440: 318 direct, 122 with one setup move), flips (11 rows),
  the parity swap (C↔B, I↔M, read off the parity algorithm and checked), the
  page, two worked examples (one with a break), 8 exercises, the lookup.
  Exercises are numbered 1 to 8 on the page; the odd-count exercise is left out.
- **Not built: 2.4 (odd-count full solve), check E5, exercise 8.** The method
  "memorise as if UF and UR had swapped places" was tested with the tables on
  1,000 random scrambles. Even scrambles: all 507 solved. Odd scrambles: 1 of
  493 solved. After the edge steps the misplaced edges are many, not a UF/UR
  swap. The plan says to stop and ask in this case, so the page says the part is
  not finished and does not teach it. See `log/2026-10-16-bld-edge-cycles.md`.
- Check E9 is therefore reported for even scrambles only.
