# Blindfolded "Corner cycles" tab — build plan

Status: **planned, not built** (written 2026-10-16; updated the same day when
the user asked for an edges tab as well — see `docs/bld-edge-cycles-plan.md`).
A fourth tab on the Blindfolded pages, extending the Commutators tab; the edges
tab is the fifth. **Build this one first**: the edges tab reuses its helpers,
generator and page layout. Written so a different agent
can build it. Read `CLAUDE.md` first (stack, page chrome, verification, branch
workflow, the "Practice pages" convention), then this file.

User decisions (2026-10-16):

| Question | Answer |
|---|---|
| Topic | How to decide **which corners to cycle** to solve the cube (turning a scramble into a list of 3-cycles), and **setup moves** for cycles that have no direct commutator |
| Source | Ours, every claim checked by simulation; the page says it is not from the user's notes |
| Placement | A new tab beside Commutators |
| Exercises | Yes, a fixed hand-picked list, each checked by simulation |

The numbers below come from a prototype run under Node on 2026-10-16 (thrown
away). The build must regenerate them with its own script (section 6) and
put the script's numbers on the page, not these.

---

## 1. What the user gets

Page `3x3/bld/corner-cycles.html`, tab label **Corner cycles**, title "3x3
Blindfolded — Choosing corner cycles and setup moves". Tabs become: Reference /
Practice / Commutators / Corner cycles / Edge cycles. (The user agreed to the
name "Cycles & setups" before the edges tab was asked for; two tabs need two
names, so they are "Corner cycles" and "Edge cycles" — see Open questions.)

Corners only. Buffer **UFR**, Speffz letters (the buffer's stickers are **C**
(U face), **J** (F face), **M** (R face)). UFR is the buffer the Commutators
tab already names for 3-style corners. (The Reference and Practice tabs use
UBL — sticker E — because Old Pochmann does; the page says this once so the
two are not confused.)

Sections, in this order:

| # | Section | What it teaches |
|---|---|---|
| 1 | From a scramble to cycles | Follow the buffer to get the corner letters, pair them up; each pair is one 3-cycle C → first letter → second letter, done with one commutator |
| 2 | When the cycle closes early | Cycle breaks: choosing which unsolved corner to start the next cycle from, and how that choice changes the moves needed |
| 3 | Twisted corners | Corners in the right place but twisted: left out of the cycles and fixed at the end with a twist commutator |
| 4 | An odd number of letters | Parity: the last letter is done with a setup move and one swap algorithm, shared with the edges |
| 5 | Choosing a setup move | What to do when a pair has no direct commutator: a step-by-step procedure, the share of pairs that need 0/1/2/3 setup moves, and examples of each |
| 6 | Look up a pair | Pick two letters; the page shows a commutator for that pair, with its setup |
| 7 | Exercises | 8 set-up-then-solve exercises (setup scramble and picture shown, solution hidden behind a button) |

No mnemonic words or Libby's line: as on the Commutators tab, the cipher has
no D letter and these are not from the user's notes.

## 2. Content and the facts each section must use

Every move sequence and every claim on the page must come from, or be checked
by, the generator/checker script (section 6). Do not write a move sequence by
hand without adding it to the checker.

### 2.1 From a scramble to cycles

- Steps: look at the sticker in the buffer's C spot → its letter is the first
  target; look where that sticker's piece belongs → next letter; continue
  until the cycle comes back to the buffer piece. Same procedure as the
  Practice tab, buffer C instead of E.
- Pair the letters in order: (1st, 2nd), (3rd, 4th), … Each pair (X, Y) is one
  3-cycle: the piece in the buffer goes to X, the piece at X goes to Y, the
  piece at Y comes to the buffer. Solving that pair = the commutator for "C →
  X → Y" from the lookup table.
- A worked example: one fixed corners-only scramble with 6 letters (3 pairs),
  shown as a colour net, then the letters, then each pair's commutator, then a
  picture after each commutator (see 4.3).

### 2.2 When the cycle closes early

- When the buffer piece comes home before all corners are solved, start a new
  cycle: pick any unsolved corner, write down one of its stickers as a letter
  (the "break" letter), follow from there until you get back to that piece,
  and write that letter again at the end.
- The break letter is a free choice (any unsolved corner, any of its 3
  stickers). The checker computes, for the worked example in this section,
  the total moves for **every** possible break letter; the page shows that as
  a table (break letter → total moves) and states the rule the site uses:
  "pick the break letter that makes the next pair cheapest in the lookup
  table; if you don't remember, take the first unsolved corner in letter
  order (what the Practice tab does)".
- A cycle break adds 2 letters (the break letter at the start and end).

### 2.3 Twisted corners

- A corner in its own place but twisted is left out of the letter list.
- At the end, fix twisted corners with a pure twist: two corners twisted in
  opposite directions, done as on Commutators exercise 7 — insertion
  `(R' D' R D)×2` or `(D' R' D R)×2`, interchange a U turn, with a setup move
  if the corner isn't in the U layer.
- If only one non-buffer corner is twisted, the buffer is twisted the other
  way (total twist is always zero); twist the buffer and that corner together.
- The checker generates the twist algorithm for **buffer + each other corner,
  both directions** (7 × 2 = 14 rows) and **two non-buffer corners** for the
  cases used in the exercises. Show the 14 rows as a table.

### 2.4 An odd number of letters

- With an odd number of corner letters, the last letter has no partner (and
  the edges then have an odd number too — they always match).
- Parity algorithm (shared with the Edge cycles tab):
  `R U R' F' R U R' U' R' F R2 U' R' U'`. Prototype check: it swaps
  **UFR ↔ UBR** and **UF ↔ UR** and nothing else — the corner buffer with
  UBR and the edge buffer with UR.
- In a full solve, the edges are memorised with UF and UR swapped, and the
  corners finish exactly as below. The Edge cycles tab explains this and its
  checker proves it; this page links there.
- On this corners-only page: setup move(s) that bring the last target to
  **UBR**, the algorithm, then undo the setup. The setup must leave UFR, UF and
  UR where they are (otherwise the swap lands on the wrong pieces): use
  **D, L and B moves only**. The prototype found one of at most 3 moves for
  every corner sticker (e.g. O → `B`, K → `D B`, T → `D L B'`). Say plainly
  that UF and UR get swapped too; exercise 7 ends with them swapped, and its
  solution says so.
- The checker generates that setup for every possible last letter (21 rows,
  shortest D/L/B setup) and checks each.

### 2.5 Choosing a setup move

The prototype showed that **no simple rule** ("two of the three pieces share a
layer", "two stickers face the same way") decides whether a pair needs a
setup — so the page teaches a procedure and gives the numbers, not a rule.

Procedure (wording to be refined, each step illustrated by a checked example):

1. Try to build it directly with the five steps on the Commutators tab
   (interchange = a layer holding two of the three stickers; insertion = 1 or
   3 moves that swap the third sticker into that layer).
2. If that fails, do **one move** that brings one of the two target stickers
   into a spot where step 1 works. Prefer a move that does not touch the
   buffer. Do the commutator, then undo that move.
3. If no single move works, try two moves (or three for the hardest pairs).

Prototype numbers (buffer UFR, 378 ordered pairs of letters on different
corners; insertions of 1 move or `X Y X'`; interchanges of 1 move; setups of
face turns):

| Setup moves needed | Pairs | Commutator length (no cancelling) |
|---|---|---|
| 0 (direct) | 198 | 8 |
| 1 | 138 | 10 |
| 2 | 36 | 12 |
| 3 | 6 (AU, AW, UA, UW, WA, WU) | 14 |

The page shows the regenerated version of this table and one example per row
(taken from the lookup table).

### 2.6 Look up a pair

Two selects (first letter, second letter; buffer stickers C, J, M excluded;
letters on the same corner as the first letter disabled in the second). Shows:

- The pair's commutator in bracket notation, e.g. `[U: [R U R', D]]`, and as
  plain moves with adjacent moves cancelled (`U U` → `U2`, `R R'` → nothing).
- How many setup moves it uses and its length.
- A picture of the position it solves (corners coloured, edges grey —
  see 4.2).
- Saved choice in localStorage `cubing-helper:bld-corner-cycles` (`{ first, second }`).

### 2.7 Exercises (fixed list)

Same format as the Commutators tab's exercises (`setup`, picture, solution
hidden behind a button — the existing `hideAlg` card support). Each setup is
the inverse of its solution. Suggested list (the agent picks the actual
scrambles with the generator so each one has exactly this structure):

| # | Skill | Structure |
|---|---|---|
| 1 | One pair, direct | 2 letters, no setup |
| 2 | One pair, one setup move | 2 letters, 1 setup |
| 3 | One cycle, two pairs | 4 letters, no cycle break |
| 4 | Cycle closes early | 2 letters, then a cycle break (4 more letters) |
| 5 | Buffer already home | Buffer solved at the start, so the first letter is a break |
| 6 | Twisted pair | One pair + two corners twisted in place |
| 7 | Odd letters | 3 letters: one pair + the parity swap (ends with UF/UR swapped, said in the solution) |
| 8 | A full corner memo | Corners from a real random scramble: 8–10 letters, at least one break |

Each hidden solution shows: the letters (with break letters underlined, the
same `.cycle-break` style as the Practice tab), the pairs, each pair's
commutator in bracket notation and plain moves, and any twist/parity step.

## 3. Files

| File | New / changed | What goes in it |
|---|---|---|
| `3x3/bld/corner-cycles.html` | New | The page; page script inline, like the other BLD pages |
| `data/corner-cycles.js` | New | Section text, worked examples, exercises, and the generated tables: `cornerComms` (378 rows: `{ first, second, setupMoves, notation, moves, length }`), `cornerTwists` (14 rows), `paritySetups` (21 rows). Header comment says the tables are generated and checked by the log script and must not be edited by hand |
| `js/bld-memo.js` | Changed | Export a new `cornerCycles(state, { buffer = 'C' })` → `{ letters: [{ letter, cycleBreak }], pairs, twisted: [{ piece, direction }], parity }`. It reuses the existing `memo` logic but leaves in-place twisted corners out (they go in `twisted`). `bldPlan` and the Practice tab must not change behaviour |
| `js/cube-diagram.js` | Changed | Add stickering `'corners'`: corners and centres in colour, edges grey (the mirror of the existing `'edges'`) |
| `js/algs.js` | Changed | Add `expandBrackets(text)` (`[A: B]` → `A B A'`, `[A, B]` → `A B A' B'`, nesting allowed, `(…)×n` repeats) and `cancelMoves(alg)` (merges same-face neighbours: `U U` → `U2`, `U U'` → removed, repeated until nothing changes) |
| `3x3/bld/index.html`, `practice.html`, `commutators.html` | Changed | Add the fourth tab link (and the fifth, Edge cycles, once that page exists) |
| `data/commutators.js` | Changed | In "Building one yourself", step 5 (the setup-move step): add a link "More on choosing setup moves: Corner cycles tab". In `practice.blind`: add a link to the new tab |
| `js/site-chrome.js` | Changed | Blindfolded `children`: add `{ label: 'Corner cycles', path: '3x3/bld/corner-cycles.html' }` |
| `index.html` | Changed | Blindfolded row quick links: add "Corner cycles" |
| `css/style.css` | Changed | Only what's new (pair-lookup selects, tables); 44 px tap targets. **The tab bar must scroll sideways**: `.tabs` currently has no wrapping or scrolling, and five tabs do not fit at 390 px. Give it `overflow-x: auto`, no wrapping, and scroll the active tab into view on load. Check all BLD tabs at 390 px |
| `log/<date>-bld-cycles-generate.mjs` | New | Generator + checker (section 6). Write it so the piece type (corners/edges), buffer, move list and table names are parameters — the edges tab adds its tables with the same script |
| `log/<date>-bld-corner-cycles.md` | New | Log entry with the script's output numbers |
| `CLAUDE.md`, `docs/plan.md` | Changed | Replace the "planned" notes with what was built |

## 4. Page details

### 4.1 Layout

Same chrome as the other BLD pages (`site-chrome.js`, tabs nav, a
`.source-note`: "Not from your notes: written here and checked with the cube
simulator. Buffer UFR (letters C, J, M), not the UBL buffer the Reference and
Practice tabs use for Old Pochmann."). Sections 1–7 as `<section>`s with
`h2.section-heading`. Use `js/steps-page.js` only if it fits without changes;
otherwise plain sections like `commutators.html`.

### 4.2 Pictures

- Scrambled positions: `colourNet` from `js/bld-net.js` with the WCA white-top
  colours (same as the Practice tab's default), plus a Speffz corner-letter
  net (`bldNet('corners', { buffers: ['C', 'J', 'M'] })`) once in section 1 so
  the letters can be found.
- Single cases (lookup, exercises): `caseDiagram(moves, { stickering:
  'corners', views: ['U', 'D'] })`.

Note on colours: the Practice tab's net uses WCA white-top colours while
`caseDiagram` uses yellow-top. Use one hold on this page: **white top, green
front** (letters are defined for that hold). If `caseDiagram` can't be given
that colour map, draw these with `colourNet` too. Record the choice in the log.

### 4.3 Worked example strip

Use `js/alg-filmstrip.js` (`buildFilmstrip`) with `alg` = the whole solution,
one frame per commutator (`after` = that commutator's moves), `stickering:
'corners'`, and `marks` outlining the three corners of each pair.

## 5. Things not to do

- No edges on this page — they have their own tab (`docs/bld-edge-cycles-plan.md`).
- No generated/random exercises: the list is fixed (user decision).
- Do not change how the Practice tab memos (buffer E) or anything on the
  Reference tab.
- No move sequence on the page that the checker hasn't verified.
- Do not use the word other sources use for `R U R' U'`; it is **Sassy**.

## 6. Generator and checker (`log/<date>-bld-cycles-generate.mjs`)

Run like the other checkers (copy `js/` + `data/` + the script into a folder
with `{"type":"module"}`; `node <script>`). Mode `--write` prints the
`cornerComms`, `cornerTwists` and `paritySetups` arrays for pasting into
`data/corner-cycles.js`; with no flag it checks the data file and prints
`ALL OK`.

### 6.1 How to find commutators fast

The prototype took 22 s using `applyAlg` for every candidate. Do this instead:

- Turn each move sequence into a **sticker permutation** once (54 entries:
  where each sticker goes), using `applyAlg` on a solved cube whose stickers
  carry their index.
- Compose permutations with arrays (`comp(X, Y)[i] = Y[X[i]]`) — no more
  `applyAlg` calls in the inner loop.
- Candidates:
  - insertions = the 18 face turns plus every `X Y X'` with X, Y face turns
    on different axes (234 in all)
  - interchanges = the 18 face turns
  - both orders, `[ins, int]` and `[int, ins]`, skipping pairs on the same face
- Keep those whose permutation moves exactly 9 stickers, all on corners, as
  one 3-cycle of 3 different corners. The prototype found 864.
- Setups: 0, then 1 face turn, then 2, then 3 (only for pairs still missing).
  The conjugate's permutation = `comp(comp(S, C), S⁻¹)`.
- Key each result by `(X, Y)`, where the sticker at C goes to X's spot and the
  sticker at X goes to Y's spot. Ignore results where X or Y is on the
  buffer's corner. (The prototype had one such twist-only result; leave it
  out.)
- Choose per pair:
  1. fewest setup moves
  2. then shortest after `cancelMoves`
  3. then a setup that doesn't move UFR
  4. then setup moves in the order U, D, R, L, F, B

### 6.2 Checks (all must pass)

| # | Check |
|---|---|
| 1 | All 378 pairs present; each row's `moves` = `cancelMoves(expandBrackets(notation))`; applying `moves` to a solved cube moves exactly the three corners and nothing else, as C → first → second |
| 2 | The setup-count table on the page matches the counts in `cornerComms` |
| 3 | Each of the 14 twist rows twists exactly UFR and that corner, in the stated directions, and nothing else |
| 4 | Each of the 21 parity setups leaves UFR, UF and UR in place, brings the target to UBR, and setup + swap + undo leaves exactly that corner swapped with the buffer plus UF/UR swapped |
| 5 | `R U R' F' R U R' U' R' F R2 U' R' U'` swaps UFR ↔ UBR and UF ↔ UR only |
| 6 | Every exercise: the setup is the inverse of the solution; the solution solves the corners (and everything else, except exercise 7's UF/UR swap); `cornerCycles` on the set-up position gives exactly the letters, breaks, twists and parity the solution shows; the structure matches the table in 2.7 |
| 7 | Worked examples: same as 6; the break-letter table in 2.2 matches a recount over every possible break letter |
| 8 | 2,000 random scrambles: `cornerCycles` letters + the lookup table + twists + parity solve every scramble's corners (corners only; edges are ignored) |
| 9 | `bldPlan` output for 500 random scrambles is unchanged from before the edit (compare with the old function's output) |
| 10 | `expandBrackets` / `cancelMoves` unit cases: `[U: [R U R', D]]` → `U R U R' D R U' R' D' U'`; `(R' D' R D)×2` → 8 moves; `R R` → `R2`; `R R'` → ''; `U2 U` → `U'` |

Then the browser checks from `CLAUDE.md` "Verification" (390 px and 1280 px,
screenshots of each section, revealed exercise solution, the lookup with a
3-setup pair, no console errors, the new tab on all four BLD pages, menu and
home links).

## 7. Build order

1. `js/algs.js` helpers + check 10.
2. Generator (6.1) → paste tables into `data/corner-cycles.js` → checks 1–5.
3. `cornerCycles` in `js/bld-memo.js` → checks 8, 9.
4. `'corners'` stickering.
5. Page sections 1–6, then the exercises (pick scrambles with the generator) →
   checks 6, 7.
6. Tabs, menu, home link, the two links from `data/commutators.js`.
7. Browser checks, log entry, `CLAUDE.md` / `docs/plan.md`, merge per
   `CLAUDE.md` "Branch workflow".

## 8. Open questions (defaults used until the user answers)

| Question | Default |
|---|---|
| Edges too? | **Answered 2026-10-16:** yes, as a separate tab — `docs/bld-edge-cycles-plan.md` |
| Add a "buffer C, commutators" option to the Practice tab so random scrambles show 3-style corner pairs? | Not in this version |
| Tab name | **Answered 2026-10-16:** "Corner cycles" and "Edge cycles" |
| Buffer | **Answered 2026-10-16:** UFR |
