# Status: a third set of 3 bases to finish 3-style corners (2026-11-10)

Written for another model to pick up. Read `docs/three-style-notes.md` first: it holds the owner's preferences,
the Speffz letters, which turn moves which sticker, and everything already checked. This file covers only
the "third set" question.

## The owner's question

> "Now I've got 2 sets of 3 bases and how each can move other pieces. Is there a final set of 3 bases that I
> could learn that would complete the rest of 3 style?"

The owner knows these two sets:

| Set | Bases (each also used with its halves swapped) | Pairs with no setup |
|---|---|---|
| Orozco (helper B) | `[R D R′ , U′]`, `[R D′ R′ , U′]`, `[R D2 R′ , U′]` | B with O, H, L |
| Helper P | `[R U R′ , D]`, `[R U R′ , D2]`, `[R′ D′ R , U2]` | P with L, H; A with P |

"Complete 3-style" = every one of the 378 ordered corner pairs (buffer C, two targets on different corners,
neither on the buffer's corner) is `[setup : base]` for one of the bases.

## How the numbers were found

Scripts: `log/2026-11-10-third-base-set.mjs` (structured sets) and `log/2026-11-10-third-base-any.mjs` (any 3 bases).
Both run in about 2 s with `node`, using `log/three-style-lib.mjs`.

- **Candidate bases:** every 8-move commutator `[X Y X′ , Z]` or `[Z , X Y X′]` (any faces, Y on a different
  axis from X) that is a pure corner 3-cycle including the buffer: 9 stickers moved, nothing else. There are 198
  distinct ones.
- **A "set"** (structured, like the owner's): one part fixed, the other part's turn in its 3 powers (like Orozco's
  D, D′, D2). There are 72 distinct sets.
- **Setups** keep the buffer still, so only D, L and B turns, up to n moves (no two turns of the same face in a row).
  Each base counts with its reverse.
- **Score:** number of pairs covered, then the total shortest setup length over all pairs. Every pair counts the
  same: not weighted by how often a pair comes up in solves.

## Findings

### 1. The 6 known bases nearly finish it already, if B setups are allowed

| Setups allowed | 6 known bases cover | Missing |
|---|---|---|
| D L, up to 3 moves | 250 / 378 | 128 |
| D L, up to 4 moves | 302 / 378 | 76 |
| D L B, up to 2 moves | 266 / 378 | 112 |
| D L B, up to 3 moves | 376 / 378 | UV, VU |
| D L B, up to 4 moves | 378 / 378 | none (UV, VU need 4) |

### 2. Best structured third set: `[F D F′ , U2]`, `[F D′ F′ , U2]`, `[F D2 F′ , U2]`

- Buffer → A → K / T / H (with D / D′ / D2). With the halves swapped: buffer → K / T / H → A.
- It mirrors Orozco: one fixed partner (A instead of B) plus a D-turn choice. It has no L or B inside the base.
- With D L B setups up to 3 moves, 9 bases → 378 / 378:

| Setup moves | 6 known bases | + F set |
|---|---|---|
| 0 | 12 | 18 |
| 1 | 72 | 108 |
| 2 | 182 | 204 |
| 3 | 110 | 48 |
| 4 | 2 | 0 |
| Mean | 2.04 | 1.75 |

- Mean pair length is about 8 + 2 × 1.75 = 11.5 moves, before any cancellation. The site's own 3-Style table
  averages 10.7.

### 3. Other structured sets

| Third set | D L B ≤ 2 | D L B ≤ 3 (mean setup, 3-move count) | Notes |
|---|---|---|---|
| `[F D^k F′ , U2]` | 330 | 378 (1.75, 48) | best with no L or B in the base |
| `[R′ D2 R , U / U′ / U2]` | 314 | 378 (1.78, 64) | all R-based, matches the owner's R cores |
| `[R′ D R , U / U′ / U2]` | 316 | 378 (1.80, 62) | |
| `[U L2 U′ , R / R′ / R2]` | 332 | 378 (1.70, 46) | best overall, but has L inside |
| `[U′ B^k U , F2]` | 338 | 378 (1.70, 40) | best at ≤ 2, but has B inside |

### 4. D and L setups alone can never finish 3-style

- D and L never move B's corner, so N stays in its place. Even with the best third set and D L setups up to 4
  moves, the 36 pairs with N stay out (AN DN EN … NX). Best D L only result: 342 / 378.
- That is why the By base page sends N and Q pairs to other commutators (`docs/three-style-notes.md`).

### 5. Any 3 bases (not a structured set)

`log/2026-11-10-third-base-any.mjs`. It does not find much more than the structured sets:

| Setups | Best 3 added | Total |
|---|---|---|
| D L ≤ 3 | 92 | 342 |
| D L B ≤ 2 | 90 | 356 |
| D L B ≤ 3 | 2 | 378 |

Known flaw: it can pick a base and its own reverse as two of the three, which is wasted. It also searches
exhaustively only over the top 80 candidates. Its results are a lower bound.

## What is NOT checked

- No whole solves were run with the 9 bases. Only pair-by-pair coverage was computed. A whole-solve check exists
  for each known set; see `log/2026-11-09-orozco-p.mjs`.
- No table of pair → base + setup was generated or checked against the 3-Style pages.
- Move counts ignore cancellations between the setup and the base.
- Nothing is on the site. The owner has not chosen a set yet.

## Open questions

1. **Frequency weighting.** Score by how often each pair comes up in random solves (3,000 seeded solves,
   `Math.imul` RNG), not uniformly. Does the best set change?
2. **D L only.** Is there a set that is best for D L setups only, which the owner prefers (By base decision: no B)?
   Leave out the 36 N pairs and count what is left (342 is the bound found so far).
3. **Replace instead of add.** Would 9 bases chosen together (keeping Orozco's 3) beat Orozco + helper P + one
   more set? Would a better second set exist if helper P were not fixed?
4. **A rule instead of a table.** The owner learns best from patterns: Orozco's "B with O / H / L", helper P's
   quick test (L, T, H always work). Is there a simple rule saying which of the 9 bases a pair uses, and with
   which setup? This matters more than a few setup moves.
5. **Longer bases.** Does allowing 9- and 10-move commutators (a setup inside the insertion), or setups that move
   the buffer (U, F, R), give a much simpler set?
6. **Fix the any-3 search:** no base with its own reverse, and exhaustive over all 198.
7. **Owner checks before building:** are B setups fine (accepted for helper P and the Orozco shortcuts, rejected
   for By base)? Is F inside a base fine (the owner dislikes M, L as a main move, and B)?

## If it gets built

Follow the helper-P page: a generator in `log/` with `--write` → `data/…js`, a whole-solve check, a page in the
3-Style menu section (`js/site-chrome.js` `MENU`), a 3-Style solves preset, Speffz letters only, and C called
"the buffer". Do not change the existing 3-Style pages (owner: "Don't modify 3 style though").
