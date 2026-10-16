# Roux block practice — build plan

Status: **planned, not built** (written 2026-10-16). This is the spec for ideas
6 (first block practice) and 7 (second block practice) from the 2026-10-16
training-ideas review. It is written so a different agent can build it without
re-deriving anything. Read `CLAUDE.md` first (stack, page chrome, verification,
branch workflow), then this file.

The numbers in this file (table sizes, build times, solution lengths) come from
a prototype run under Node on 2026-10-16. The prototype was thrown away; the
reference code in section 5 is a cleaned-up version of it.

---

## 1. What the user gets

One new page, `3x3/roux/practice.html`, reached from a new **Block practice**
tab on the Roux page, from the menu (Roux › Block practice) and from a quick
link on the home page's Roux row.

The page has two modes, picked with a two-button switch at the top:

| Mode | You get | You do | You can then reveal |
|---|---|---|---|
| **First block** | A random scramble and a picture of the scrambled cube | Plan and build the left block (1×2×3) | The shortest length, up to 3 shortest solutions, up to 3 solutions one move longer, and when each part of the block (DL edge, front pair, back pair) is finished in each solution |
| **Second block** | The same scramble plus a first-block solution (the shortest one, or your own) and a picture of the cube after it | Build the right block using only R, r, U, M | The same as above for the right block |

Both modes also have a **Check my solution** box: type the moves you did, and
the page says whether they solve the block, how many moves that was against the
shortest, and which pieces are not home if it failed.

The page is untimed (no timer, no inspection countdown) in this version — see
Open questions.

## 2. Definitions (fixed — do not change without asking)

### Colours and how the cube is held

- Scrambles are standard WCA random-move scrambles, applied with **white on
  top, green in front** (the way people scramble).
- **Default block: blue–white on the left** (user decision, 2026-10-16). The
  solving hold is **yellow on top, red in front, blue on the left, green on
  the right** (white on the bottom).
- In simulator terms (the simulator's `U` colour is yellow, `F` green, `L`
  red, as in `js/cube-diagram.js` `COLOURS`): the site's usual picture hold is
  the scrambling hold turned over with `z2`; the default solving hold is that
  turned by `y'` more. Call the extra turn `rho`; the default is `rho = "y'"`
  (checked in the prototype: after `y'` the centres are U yellow, F red,
  L blue, D white).
- The cube as the user holds it is
  `T = applyAlg(solvedCube(), 'z2 ' + scramble + ' z2 ' + rho)`.
- The solver is given `invertAlg(rho) + ' z2 ' + scramble + ' z2 ' + rho`
  (here `"y z2 <scramble> z2 y'"`). That position has every centre in its home
  place, so the solver always works with one fixed piece list (DL, FL, …) and
  its moves are already in the user's hold. Section 3 uses the same trick for
  the other colour options; the prototype checked it on all 24 holds.
- The page tells the user: "Scramble with white on top and green in front.
  Then turn the cube so yellow is on top, red is in front and blue is on the
  left."

### The blocks

Pieces are named by their home slot. Each piece's **reference sticker** is the
sticker on the first face in its name (DL → its D sticker, DFL → its D sticker,
FL → its F sticker).

| Block | Pieces | Moves the solver may use | Groups shown in the solution notes |
|---|---|---|---|
| First block (left; blue–white by default) | DL, FL, BL edges; DFL, DBL corners | U D L R F B M r (each with `'` and `2`) — 24 moves | "DL edge" = DL; "front pair" = DFL + FL; "back pair" = DBL + BL |
| Second block (right; green–white by default) | DR, FR, BR edges; DFR, DBR corners | U R M r (each with `'` and `2`) — 12 moves | "DR edge" = DR; "front pair" = DFR + FR; "back pair" = DBR + BR |

Notes:

- None of these moves turn the L centre or the R centre, so the left and right
  sides stay fixed while solving. M and r do move the U/F/D/B centres. A block
  counts as solved when its pieces are in their home slots **in the fixed
  frame**, judged against the centres as they were **before** the solve started
  (not against the D centre afterwards, which M may have moved). This is normal
  for Roux: the M slice centres are fixed in LSE.
- U R M r cannot disturb the first block (every first-block piece is in the L
  layer), so the second-block solver never breaks it.
- No whole-cube rotations (x, y, z) anywhere in solver output.

### Measured sizes (all positions, from a full breadth-first search)

| | First block | Second block (first block solved) |
|---|---|---|
| Reachable positions of the block's pieces | 5,322,240 | 1,088,640 |
| Longest shortest solution | 9 moves | 14 moves |
| Average shortest solution | 6.78 moves | 9.96 moves |
| Most common lengths | 7 (57.2%), 6 (25.4%), 8 (12.9%) | 10 (35.8%), 11 (29.1%), 9 (22.1%) |

Moves are counted with `R2`, `M2`, etc. as one move each.

## 3. Colour options (one setting, saved)

A select box, **Block colour**, with three choices:

| Choice | Holds tried | What is shown |
|---|---|---|
| Blue–white on the left (default) | 1 (`rho = "y'"`, section 2) | As described in section 1 |
| White or yellow on the bottom | 8 | The hold with the shortest solution is used for the reveal; a table lists every hold tried with its shortest length |
| Any colour | 24 | As above, with all 24 holds |

How to do the other holds (checked by the prototype on all 24 holds):

- `ROTATIONS` in `js/cube-sim.js` (currently not exported) lists the 24 whole-
  cube rotations. Export it.
- For a rotation `rho` (the default is `"y'"`), the cube as the user sees it is
  `T = applyAlg(solvedCube(), 'z2 ' + scramble + ' z2 ' + rho)`.
- Give the solver `invertAlg(rho) + ' z2 ' + scramble + ' z2 ' + rho` instead
  of a plain scramble. That position has every centre in its home place, so
  the solver's fixed piece list (DL, FL, …) means "the block whose colours are
  on the left and bottom centres of `T`". Its solution moves are already in the
  user's hold — no move relabelling is needed.
- "White or yellow on the bottom" = the rotations for which the D centre of `T`
  is white or yellow.
- Hold instruction text, from the centres of `T`: "Hold *(U centre colour)* on
  top, *(F centre colour)* in front: *(L colour)*–*(D colour)* block on the
  left." Colour names: U yellow, D white, F green, B blue, R orange, L red
  (the simulator's colour letters).
- Second block uses the same hold as the first block it follows.

The hold table (sorted shortest first, ties in `ROTATIONS` order):

| Block (left–bottom) | Hold | Shortest |
|---|---|---|
| e.g. Blue–white | Yellow top, red front | 7 |

## 4. Files

| File | New / changed | What goes in it |
|---|---|---|
| `js/block-solver.js` | New | Everything about solving: piece coordinates, move tables, pruning tables, search, block checks, solution notes. **No DOM code**, so it runs under Node for the checks. |
| `3x3/roux/practice.html` | New | The page, with its page script inline (same pattern as `3x3/bld/practice.html`). |
| `js/cube-sim.js` | Changed | `export` the existing `ROTATIONS` constant. Nothing else. |
| `js/bld-net.js` | Changed (optional, step 6 of the build order) | `colourNet(stickers, colours, { only })`: when `only` is a set of piece names, every other sticker is drawn grey (`#6b7280`). Default behaviour unchanged. |
| `3x3/roux/index.html` | Changed | Add the tab bar (`<nav class="tabs">`: Reference / Block practice, copied from the BLD pages) under the subtitle; in the "Blocks" step intro, add a sentence linking to the practice page. |
| `js/site-chrome.js` | Changed | In `MENU`, give the Roux item `children: [{ label: 'Block practice', path: '3x3/roux/practice.html' }]`. |
| `index.html` | Changed | Roux row: add `<div class="row-quick"><a class="quick-link" href="3x3/roux/practice.html">Block practice</a></div>` (same markup as the Blindfolded row). Change its description to "CMLL, last six edges with DFDB, block practice." |
| `css/style.css` | Changed | Only what the new parts need (mode switch, solution list, hold table). Reuse the `.practice-*`, `.btn`, `.tabs`, `.table-wrap`, `.bld-table` classes; keep tappable controls at least 44 px tall. |
| `log/<date>-roux-block-practice.md` | New | Log entry (what was built, the check results, any deviation from this plan). |
| `log/<date>-roux-block-practice-check.mjs` | New | The Node checker from section 7, kept like `log/2026-10-06-roux-lse-check.mjs`. |
| `CLAUDE.md`, `docs/plan.md` | Changed | Replace the "planned" notes about Roux block practice with what was built. |

`.github/workflows/deploy-pages.yml` already copies `3x3/` and `js/`; no change.

The scramble generator is `randomScramble()` in `js/bld-memo.js`. Import it
from there. (It brings `data/bld.js` with it; that is a small file and
acceptable. Do not move the function unless asked.)

## 5. The solver (`js/block-solver.js`)

### 5.1 State representation

- The simulator (`js/cube-sim.js`) has 24 corner-sticker locations and 24
  edge-sticker locations (a location = position + facing). Number them in the
  order `solvedCube()` produces them, filtered by piece type (3 non-zero
  coordinates = corner, 2 = edge).
- One sticker location fixes where a piece is **and** how it is twisted or
  flipped. So a piece's coordinate is just the location index (0–23) of its
  reference sticker, and a block's state is an array of 5 numbers.
- Encode a state as a base-24 number (`((a*24+b)*24+c)...`). Unreachable codes
  are simply never visited.

### 5.2 Move tables

For each allowed move, apply it with `applyAlg` to a solved cube whose stickers
are tagged with their starting location, and record, for each of the 24 corner
and 24 edge locations, where it goes. Two `Uint8Array(24)` per move.

### 5.3 Pruning tables

Do **not** build the full 5-piece table on the page: it takes about 2.3 s on a
desktop and holds 8 MB. Instead build one breadth-first distance table for each
**4-piece subset** (leave out each piece in turn → 5 tables of 24⁴ = 331,776
bytes each) and use the largest of the 5 distances as the search's lower bound.
All five being 0 means the block is solved.

Build each table by scanning level by level (no frontier arrays — the
prototype's first version with arrays took 20 s):

```js
// slots: e.g. ['DL', 'FL', 'DFL', 'DBL']; tabs[m][i] = move m's Uint8Array for piece i's kind
function distanceTable(goalDigits, tabs) {
  const n = goalDigits.length;
  const size = 24 ** n;
  const dist = new Uint8Array(size).fill(255);
  dist[encode(goalDigits)] = 0;
  const digits = new Uint8Array(n);
  for (let d = 0, found = 1; found; d++) {
    found = 0;
    for (let code = 0; code < size; code++) {
      if (dist[code] !== d) continue;
      let c = code;
      for (let i = n - 1; i >= 0; i--) { digits[i] = c % 24; c = (c - digits[i]) / 24; }
      for (const tab of tabs) {
        let x = 0;
        for (let i = 0; i < n; i++) x = x * 24 + tab[i][digits[i]];
        if (dist[x] === 255) { dist[x] = d + 1; found++; }
      }
    }
  }
  return dist;
}
```

Measured on desktop Node: all 4-piece tables for **both** blocks together took
about 0.4–0.5 s. Build them once, after the page has drawn (see 6.6).

### 5.4 Search

Iterative deepening (IDA*): for depth = lower bound, lower bound + 1, …, do a
depth-first search that stops a branch when `moves so far + lower bound >
depth`. A branch also stops as soon as the block is solved (so no solution
ever passes through "solved" and carries on). At the first depth N that has
any solution, collect up to **3** solutions. Then run the same search once
more at depth **N + 1** (user decision, 2026-10-16: show solutions one move
longer too) and collect up to **200** raw solutions.

One-move-longer solutions: many raw ones are a shortest solution in disguise.
Drop a raw N + 1 solution if either is true, then keep the first 3 that are
left:

- Deleting any one of its moves still solves the block (e.g. an extra U at the
  start that touches no block piece).
- Two moves next to each other on the same axis do the same as one allowed
  move (e.g. `R M'` = `r`). Check with the simulator: apply the pair and each
  single allowed move to a solved cube and compare every sticker.

Prototype numbers for this filter (300 scrambles, keeping only the first 50
raw solutions): fewer than 3 were left in 12 of 300 cases, which is why the
plan collects 200. If none are left, the page says "No different solution one
move longer."

Rules that stop the search producing the same solution in different orders:

- Never turn the same face twice in a row (`R R'` etc.).
- Moves on one axis commute (R, L, M, r about x; U, D about y; F, B about z).
  Give each face an index (`U D L R F B M r` → 0…7) and an axis (U, D → y;
  L, R, M, r → x; F, B → z). When a move is on the same axis as the previous
  move, only allow it if its face index is **higher** than the previous one.
  (This also stops `R M` and `M R` both appearing.)

Measured with the 4-piece tables. Shortest only: first block average 0.2 ms
per scramble, slowest 2 ms over 200 scrambles; second block average 0.4 ms,
slowest 3 ms. Shortest plus one move longer (both ordering rules, blue–white
hold, 300 scrambles): slowest 11 ms first block, 8 ms second block, at most
12,210 search nodes.
Hard limits for safety: stop at depth 12 (first block) and 18 (second block)
and report "no solution found" (it should never happen — longest are 9 and 14).

For the colour options, run the search once per hold (up to 24 × a few ms).

### 5.5 Exported API

```js
export const FIRST_BLOCK;   // { pieces, moves, groups, maxDepth }
export const SECOND_BLOCK;  // same shape

// Builds the move and pruning tables for a block (call once; cache the result).
export function prepare(block);            // → solver

// `setup` is the whole move string that produces the position, in the
// solver's frame, e.g. invertAlg(rho) + ' z2 ' + scramble + ' z2 ' + rho
// (+ ' ' + firstBlockSolution for the second block).
solver.solve(setup, { max: 3 });           // → { length, solutions: ['F D R' ...],
                                           //     longer: [...] }  (N + 1, filtered, up to 3)
solver.unsolvedPieces(setup);              // → ['FL', 'DBL'] (empty = block solved)
solver.notes(setup, solution);             // → [{ group: 'DL edge', afterMove: 2 }, ...]

export function holdsFor(choice);          // 'fixed' | 'dual' | 'any' → list of rotations
export function holdText(scramble, rho);   // → 'Hold yellow on top, red in front: blue–white block on the left.'
export function parseMoves(text, allowed); // → { moves: 'R U r', bad: ['x'] }
```

- `unsolvedPieces` uses the sticker simulator directly (not the solver's own
  coordinates), so it is an independent check: a piece is home when every one
  of its stickers in its home slot has the colour of the centre on that face
  **before** the moves were done.
- `notes`: for each group, the move number after which the group's pieces are
  all home **and stay home until the end** of the solution. A group that was
  already home at the start gets `afterMove: 0` ("already done").
- `parseMoves`: accept `'` / `’` / `‘` / `` ` `` / `´` for prime (same as the
  BLD page), `Rw` as `r`, brackets ignored, case-sensitive faces. Allowed moves
  for **Check my solution**: first block — the solver's 24 moves; second block
  — the solver's 12 moves plus everything else except rotations, then report
  "your moves broke the first block" if they do.

## 6. The page (`3x3/roux/practice.html`)

Copy the structure of `3x3/bld/practice.html`: same `<head>` (title
"3x3 Roux Block Practice — Cubing Helper"), same header, `<main>` with
`<h1>3x3 — Roux</h1>`, the tab bar, then:

### 6.1 Top of the page

- A `.source-note` (moved into "About this page" by `js/site-chrome.js`):
  "Not from your notes. The solutions are found by the site's own search
  (shortest possible, using U D L R F B M r for the first block and U R M r for
  the second) — a person usually finds a longer one. Block definitions follow
  the usual Roux first and second blocks."
- Mode switch: two buttons, **First block** / **Second block**
  (`aria-pressed`), 44 px tall.
- **Block colour** select (section 3).

### 6.2 Scramble panel

Same as BLD: the scramble in `<code>`, **New scramble**, **Use my own
scramble** (face turns only, same validation), **← Previous scramble**, and the
"Kept until you press New scramble" line. Then the hold instruction (6.4).

### 6.3 Picture

- `colourNet(state, colours)` from `js/bld-net.js`, with the yellow-top colour
  map (`{ U: '#ffd500', D: '#ffffff', F: '#009b48', B: '#0046ad', R: '#ff5800', L: '#b71234' }`),
  drawn from the cube **as the user holds it** (`T`, section 3; in second-block
  mode, `T` with the first-block solution applied).
- A checkbox **Show only block pieces** (optional build step 6): greys out
  everything but the current block's pieces and the centres.

### 6.4 Second-block mode extra line

"First block: `<moves>` (shortest, N moves)" — or "(your solution, N moves)"
when the user checked their own first-block solution and pressed **Use mine for
the second block**. A **Change** link switches back to first-block mode.

### 6.5 Reveal and check

- **Show the solution** button (the same pattern as `hideAlg` exercises: the
  answer is in the page but hidden until pressed). Revealed:
  - "Shortest: N moves."
  - Up to 3 solutions, each as a `<code>` line, with its notes underneath:
    "DL edge after move 2 · front pair after move 5 · back pair after move 7".
  - A sub-heading "One move longer (N + 1 moves)" with up to 3 of those, shown
    the same way (or "No different solution one move longer.").
  - For "dual" / "any" colours: the hold table (section 3), the used hold
    highlighted.
- **Check my solution**: text input + **Check** button. Results:
  - Solved: "Solves the first block in 9 moves (shortest: 7)."
  - Not solved: "Not solved yet — not home: FL edge, DBL corner."
  - Bad input: "Not a move: x" (and nothing else is shown).
  - First-block mode, solved: a **Use mine for the second block** button.
- Hide the solution again when a new scramble comes in or the mode changes.

### 6.6 Solver loading

Build the tables after the first paint (`setTimeout(…, 0)` after the page is
drawn). Until they are ready, the **Show the solution** button reads "Getting
the solver ready…" and is disabled; **Check my solution** works without the
tables (it only uses `unsolvedPieces`), but its "shortest" figure waits for
them. Measure the build time with Chromium's 4× CPU slowdown (DevTools protocol
`Emulation.setCPUThrottlingRate`); if it is over 1.5 s, move the table building
and search into a module Web Worker (`new Worker(url, { type: 'module' })`) and
record that in the log.

### 6.7 Saved state

localStorage key `cubing-helper:roux-practice`, wrapped in try/catch like the
BLD page:

```js
{ scramble, previous, mode: 'fb' | 'sb', colour: 'fixed' | 'dual' | 'any',
  ownFirstBlock: "R U r ..." | null, onlyBlockPieces: false }
```

- Leaving and coming back keeps the scramble and mode. Only **New scramble**
  or your own scramble replaces it; **← Previous scramble** undoes that once.
- A new scramble clears `ownFirstBlock`.
- `?scramble=...&mode=sb` in the URL wins over the saved state (same rule as
  the BLD page). Keep the URL updated with `history.replaceState`.

### 6.8 Mnemonics and Libby's line

Generated solutions are not algorithms from the user's notes, so they show
**no mnemonic word and no Libby's line**. Say so once in the source note. (See
Open questions.)

## 7. Checks (must pass before merging)

Write `log/<date>-roux-block-practice-check.mjs` (run it the same way as the
LSE checker: copy `js/` + `data/` + the file into a folder with
`{"type":"module"}`, `node <file>`; print `ALL OK` at the end). It must check:

| # | Check | Pass when |
|---|---|---|
| 1 | Hold | `y z2 <scramble> z2 y'` leaves all six centres home, for 100 scrambles; `y'` alone gives centres U yellow, F red, L blue, D white |
| 2 | First block, default hold | 1,000 random scrambles: every returned solution leaves `unsolvedPieces` empty; every solution's length equals the reported shortest; solutions use only the 24 allowed moves |
| 3 | First block is really shortest | For 200 of those scrambles, the length equals the distance in a **full** 5-piece breadth-first table built in the checker (≈2–3 s in Node; this is the only place the full table is built) |
| 4a | One move longer | For 200 scrambles, both blocks: every `longer` solution has length N + 1, solves the block, passes both filter rules, and no shorter part of it from the start solves the block |
| 4 | Second block | For the same 1,000 scrambles, after the first solution: every second-block solution leaves both blocks solved, uses only U R M r, and the length matches the full 5-piece second-block table for 200 of them |
| 5 | All holds | For 240 scrambles (10 per rotation): the solution from the rotated setup string, done on `T`, solves the block whose colours are the left and bottom centres of `T` |
| 6 | Longest cases | The full tables' maximum depths are 9 (first block) and 14 (second block) |
| 7 | Notes | For 200 solutions, each group's `afterMove` is correct when checked move by move with the simulator |
| 8 | Check my solution | `parseMoves` accepts `R U' r2 Rw M’` and rejects `x`, `Q`; a correct own solution passes, a wrong one lists the right pieces |
| 9 | Speed | Table build for both blocks under 1 s in Node; search under 20 ms for every one of the 1,000 scrambles |

Then the browser checks from `CLAUDE.md` "Verification": `python3 -m
http.server` from the repo root; headless Chromium at 390 px and 1280 px wide;
screenshots of first-block mode, second-block mode, the revealed solution, the
hold table (any colour) and a failed check; no console errors; reload keeps the
scramble and mode; the menu shows Roux › Block practice; the Roux page and home
page links work.

## 8. Build order

Do these in order; each step should leave the site working.

1. `js/cube-sim.js`: export `ROTATIONS`.
2. `js/block-solver.js` + the Node checker (section 7, checks 1–4, 6–9). Do not
   start on the page until the checker prints `ALL OK`.
3. `3x3/roux/practice.html`, first-block mode only, default hold.
4. Second-block mode and **Use mine for the second block**.
5. Block colour options + hold table (+ check 5).
6. **Show only block pieces** (the `colourNet` option).
7. Links: Roux page tabs + Blocks intro sentence, `MENU`, home row.
8. Browser checks, log entry, update `CLAUDE.md` and `docs/plan.md`, then merge
   per `CLAUDE.md` "Branch workflow".

## 9. Things not to do

- Do not add a timer, inspection countdown, statistics or session history —
  not asked for yet (Open questions).
- Do not load anything from outside the site (no external solver, no CDN).
- Do not ship a precomputed table file.
- Do not add mnemonic words for solver output.
- Do not change the existing Roux reference content or `data/roux.js`.
- Do not use the word other sources use for `R U R' U'`; it is **Sassy** (only
  relevant if any text about it is written).

## 10. Open questions (defaults used until the user answers)

| Question | Default in this plan |
|---|---|
| Timer or 15 s inspection countdown? | None |
| Which colour option should be the default? | **Answered 2026-10-16:** blue–white on the left |
| Should the first-block solver also be offered with a smaller move set (e.g. no D, B, L), closer to how people build it? | No — one move set, U D L R F B M r |
| Show solutions one move longer than shortest (often easier to find)? | **Answered 2026-10-16:** yes, up to 3, filtered (section 5.4) |
| Mnemonic words for generated solutions? | None |
| A step-by-step picture strip for a solution (`js/alg-filmstrip.js` would need a "start from this position" option)? | Not in this version |
