# Plan: redo Walk rule, Buffer moves and Pair lookup with four helpers (B, D, F, K)

Status 2026-11-17: **plan only, nothing implemented.** Written for another agent to evaluate and, if the owner agrees,
build. Read `docs/three-style-notes.md` first (owner preferences, Speffz letters, what is already checked) and
`CLAUDE.md` (site rules, verification, deploy).

## 1. Where things stand

### Built and checked (keep)

| Page | Helper | Bases (as written) | As the owner does it | Setups (letters 0/1/2/3+) | Data / generator |
|---|---|---|---|---|---|
| `orozco.html` | B | `[R D^k R' , U']` → O/H/L | no rotation | 3/10/5/0, D and L | `data/orozco-corners.js`, `log/2026-10-25-orozco-corners.mjs` |
| `orozco-d.html` | D | `[R' D^k R , U']` → G/P/S | no rotation | 3/7/6/2, D and B | `data/orozco-d.js`, `log/2026-11-10-orozco-d.mjs` |
| `orozco-f.html` | F | `[U' R' U , L^k]` → E/G/H | z, `[R' D' R , U^k]`, z' | 3/11/4/0, D and B (L and B as seen after z) | `data/orozco-f.js`, `log/2026-11-17-orozco-f.mjs` |
| `orozco-k.html` | K | `[F D F' , U^k]` → B/D/A | y', `[R D R' , U^k]`, y | 3/11/4/0, L and B (F and L as seen after y') | `data/orozco-k.js`, `log/2026-11-17-orozco-k.mjs` |
| `orozco-p.html` | P | `[R U R' , D]`, `[R U R' , D2]`, `[R' D' R , U2]` → L/H/A | no rotation | L and B | `data/orozco-p.js`, `log/2026-11-09-orozco-p.mjs` |

Each Orozco-with-helper method solved 3,000 whole random solves (M2 edges, then corners). For F and K every rotated form
(setup, base, twist as seen after the rotation) was checked to be the same moves as the original.

### Outdated (marked on the page with `.page-outdated`)

| Page | Built on | What it does now |
|---|---|---|
| `walk-rule.html` (`js/walk-rule.js`, `data/walk-rule.js` from `log/2026-11-10-third-helper-set.mjs`) | B, P, D | every letter has one "walk" (0-2 turns of D/L/B) into a helper's place, then the other letter's helper setup; 378 pairs, setups ≤ 3, 5 exception pairs |
| `buffer-moves.html` (`js/buffer-moves.js`, `data/buffer-moves.js` from `log/2026-11-11-buffer-moves.mjs`) | B, P, D | setups that may move the buffer (R U F D first, L/B when 1+ move shorter) where they beat the walk rule; "where the base works" readings |
| `pair-lookup.html` (`js/pair-lookup.js`) | the two above | two letters → buffer-moves commutator if listed, else the walk rule's; memory rules; exception accordions |

## 2. What the simulations found (all checked in `js/cube-sim.js` via `log/three-style-lib.mjs`)

Numbers are corner moves per solve (3.5 corner pairs per solve on average), weighted by how often a pair comes up in
2,000 seeded random solves (memo from C, `Math.imul` RNG). "Buffer still" = setups of D, L, B only (as the walk rule);
"buffer may move" = setups up to 3, R U F D first, L or B only when 1+ move shorter (as Buffer moves / Pair lookup).
Rotations are **not** counted as moves in these tables.

| Bases (with B and D) | Buffer still | Buffer may move | Pairs (of 378) needing a 3+ move setup, buffer still |
|---|---|---|---|
| B + D | 42.4 | 37.7 | (2 pairs not reachable in 3) |
| + P (current pages) | 40.4 | 37.1 | 84 |
| + A group `[R' D^k R , U2]` (rejected: 3-move letter setups) | 40.0 | 36.4 | 62 |
| + F | 40.4 | 36.4 | 88 |
| + K | 40.9 | 36.5 | 88 |
| **+ F + K (the four helpers)** | **39.3** | **35.5** | **58** |
| + F + Q group `[U F U' , B^k]` (rejected: x y rotation) | 38.9 | 35.8 | 44 |

Other findings worth keeping:
- **Setup length depends on the helper's corner.** A letter's Orozco setup must leave the buffer and the helper still;
  only B's, P's and D's corners (B N Q, P K V, D F I) have two such faces among D, L, B, so their groups have 0-2 move
  setups. A's corner has one (3-4 move setups). F is on D's corner, K on P's.
- **Hard letters** I, V, Q, U (132 pairs, 30% of solve pairs) were long with the walk rule (13.1 moves) because D/L/B
  barely move them and no 8-move base containing the buffer contains I, N or V. Buffer-moving setups with the owner's
  bases brought 104 of them to 11.3.
- **Readings:** a base turns the same three corners whatever the setup; read from C, M or J it gives three sticker cycles
  (L base: C → L → B, M → U → Q, J → G → N). A buffer-moving setup lands the pair on one of them.
- **One fixed rotation used per pair** (any of 23, counted as moves) gains nothing once setups may move the buffer.
  F and K are different: the rotation belongs to the helper, and the owner holds it for the whole helper's corners.
- Owner rejected: B inside a base, per-pair rotations, two-step rotations (x y), the A group (3-move setups).

## 3. What four helpers would change on each page (ideas, not built)

### Walk rule

Today: walk one letter into B's, P's or D's place, then the other letter's setup for that helper.

Ideas:
1. **Helpers B, D, F, K** (drop P, or keep P as a fifth; see the questions). The walk targets become B's, D's, F's and K's
   places. F's place is on D's corner and K's on P's corner, so many letters gain a shorter walk (D-layer letters walk into
   K's place with one D turn; left-layer letters into F's place with one L turn) — to be measured.
2. **The rotation stays with the helper.** A pair that walks into F's place is done as: walk and setup (as held), z, base,
   z', undo — or, closer to the owner's way of practising helper F, written as seen after z. A pair is one commutator, so
   the rotation is per pair here; the page must show it in the pair's line ("helper F · z").
3. Keep everything else: one walk per letter, "walk the letter with fewer turns", exceptions listed, pictures.

To measure before building: walks per letter (0/1/2 turns), setup lengths 0/1/2/3 over the 378 pairs, number of
exception pairs (4-move setups), how many pairs need a rotation, and the mean moves — for B+D+F+K and for B+D+F+K+P.

### Buffer moves

Today: the owner's 9 bases with setups that may move the buffer, where they beat the walk rule; hard letters I V Q U first.

Ideas:
1. Rebuild the table on the 12 bases of B, D, F, K (each with its halves swapped). Same setup rule (R U F D first, L/B when
   1+ move shorter), compared with the new walk rule.
2. Pairs whose best base is F's or K's: show them as the owner does them (z / y' first) and keep the "where the base
   works" reading table (it already handles sticker readings).
3. Re-check whether the hard-letter story still holds: with K on P's corner and F on D's corner, some I/V/Q/U pairs may now
   be short with the buffer still, which would shrink this page.

### Pair lookup

Today: buffer-moves commutator if listed, else the walk rule's; memory section (which method, which letter walks, which
base); exception accordions.

Ideas:
1. Same page, fed by the two rebuilt tables; the result line names the helper and its rotation ("helper K · y' …").
2. Memory section: recompute the "usually / except" rule. It is generated from the data, so it updates itself, but the
   wording (I V Q U default to buffer moves) may no longer be the best split — find the split with the fewest exceptions.
3. A filter or a note for pairs that need a rotation, since the owner may want to practise the no-rotation pairs first.

### Elsewhere (smaller)

- `orozco-step2.html` and the Orozco / helper P shortcut sections are about P; leave them, but link F and K pages.
- 3-Style solves presets and Blind drills corner methods: add "Orozco with helper F / K" (needs planners `js/orozco-f.js`
  and `js/orozco-k.js`, which the generators already try to import and check, 500 solves each).
- Home page row "Any pair" description mentions the walk rule; update after the rebuild.

## 4. Open questions for the owner (ask before building)

1. Drop helper P entirely from these three pages, or keep it as a fifth helper (it still has the shortest buffer-still
   setups for some pairs)?
2. In the walk rule and lookup, a pair using F or K needs its rotation (z or y') around that one commutator. Acceptable per
   pair, or should those pairs only be offered as "while you are holding z / y'"?
3. Should a pair's commutator be shown as seen after the rotation (as on the F and K pages) or as written in the normal
   hold?
4. Buffer moves: still worth a page if the four helpers make most hard-letter pairs short with the buffer still?

## 5. How to check a rebuild (keep the site's standards)

- Generators in `log/` with `--write`, data in `data/`, every commutator checked as a pure 3-cycle buffer → first → second,
  every rotated form checked equal to the original, a pair and its reverse sharing the setup.
- Whole solves: plan M2 edges, then corners with the new table where it applies (letter by letter otherwise), 3,000
  seeded solves, all solved.
- Headless Chromium at 390 px: no console errors, no sideways scroll; remove the `.page-outdated` notes only when a page is
  rebuilt. Update `CLAUDE.md`, `docs/three-style-notes.md` and a dated `log/` entry.

## 6. Owner preferences that apply (from CLAUDE.md and the notes)

Speffz sticker letters only (never UFR-style names), C is "the buffer", Orozco as the bridge, phone-first, tables for
comparisons, no analogies, ask when unclear. Dislikes M (M′/M2 fine), L as a main move, B except in setups. Prefers short
repeated patterns and one fixed rotation per helper over per-pair rotations.
