# Status: a third set of 3 bases to finish 3-style corners (2026-11-10)

**Answered 2026-11-10 (second session): see "Answers" at the end.** The third set is helper D with
`[R′ D R , U′]`, `[R′ D′ R , U′]`, `[R′ D2 R , U′]`; the rule for picking a base is the "walk" rule. **Built 2026-11-10:** the owner chose `[R′ D^k R , U′]`;
pages `3x3/bld/orozco-d.html` and `3x3/bld/walk-rule.html`.

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

## Answers (2026-11-10, second session)

All numbers from `node log/2026-11-10-third-helper-set.mjs` (ALL OK; pass `KTH` or `LOS` for the other two sets).

### The third set: helper D

A set "solves corners on its own" when it has one helper letter, three no-setup bases with that helper, and every
other letter reaches one of the three positions with turns that move neither the buffer nor the helper. Checked for
all 21 letters: only three corners can hold such a helper, because only they leave two free faces.

| Helper | Free faces (setups) | Turn that moves the helper | Status |
|---|---|---|---|
| B (or Q) | D, L | B | Orozco, known |
| P (or K) | L, B | D | helper P, known |
| D (or F) | D, B | L | **the third set** |

Every other letter has one free face or none, and no complete set. So the third set must have helper D.

| Helper D set | Positions (D / D′ / D2) | Setup lengths 0/1/2/3 | With the 6 known: mean setup (weighted) | Notes |
|---|---|---|---|---|
| `[R′ D^k R , U′]` | G, P, S | 3/7/6/2 | 1.89 (1.83) | **recommended**: R U D only; it is the "D + G/P/S" family already on the By base page, so no new base |
| `[F D^k F′ , U′]` | K, T, H | 3/10/5/0 | 1.83 (1.77) | shorter setups, but a new F insertion |
| `[F′ D^k F , U]` | S, L, O (D, D′, D2) | 3/10/5/0 | 1.87 (1.81) | Orozco mirrored left-right |

Each of the three, added to the 6 known bases, covers 378 / 378 with D L B setups of at most 3 moves.

Helper D, recommended set (buffer → D → G / P / S as written; halves swapped for the reverse):

| Position | Base | Letters set up into it (setup) |
|---|---|---|
| G | `[R′ D R , U′]` | G, K (`D′`) |
| P | `[R′ D′ R , U′]` | P, L (`D`), T (`D′`), H (`D2`), A (`B D2`), W (`B′ D2`), N (`B2 D2`), V (`D B′ D2`) |
| S | `[R′ D2 R , U′]` | S, O (`D`), R (`B`), Q (`B2`), X (`B D`), B (`B′ D`), E (`B2 D`), U (`D′ B D`) |

- Twist for the buffer and D: `(R′ D′ R D)×2 U′ (D′ R′ D R)×2 U` (the owner's twist with U′ and U exchanged).
  F: 1st of a pair twist, 2nd twist backwards. I: 1st twist backwards, 2nd twist. D: skip.
- Odd count: last letter plain Orozco (helper B) + Ra, as on the helper P page.
- Checked: 3,000 whole solves (M2 edges, then corners with helper D only).

### The rule for picking a base (question 4)

Every letter has one **walk**: 0, 1 or 2 turns that put it in a helper's place. For a pair: do the walk of the letter
with the shorter walk (same length: either; the checker takes the shorter result), then the other letter's usual
setup for that helper from where it now is, then the base. The walked letter sits in the helper's place, so the
commutator is the one for "other letter + helper", in the order of the pair.

| Walk | Letters (turns → helper's place) |
|---|---|
| 0 turns | B, P, D |
| 1 turn | O (`B`), E (`B′`), X (`B2`) → B; L (`D`), T (`D′`), H (`D2`) → P; R (`L`) → D |
| 2 turns, via H then `D2` → P | A (`B`), G (`L`), N (`B2`), W (`B′`) |
| 2 turns, via T then `D′` → P | Q (`B′`), S (`B`) |
| 2 turns, via O then `B` → B | K (`D`) |
| 2 turns, via E then `B′` → B | F (`L′`) |
| 2 turns, via X then `B2` → B | U (`D′`) |
| 2 turns, via X then `L2` → D | V (`D2`) |
| none | I: the other letter always walks |

- The 1-turn letters are the level 1 quick-test letters the owner knows (O E X, L T H) plus R. L and X can also walk
  to D (`L′`, `L2`); the table uses one walk per letter.
- Pairs by the walked letter: 0 turns 102, 1 turn 174, 2 turns 102. All 378 covered.
- Result: setup lengths 0/1/2/3 = 18/86/146/128, mean 2.02 (weighted 1.94). Best possible with these 9 bases: 1.89.
- Exceptions, where the rule gives 4 setup moves (5 letter pairs; a 3-move setup exists):

| Pair | Use |
|---|---|
| IK / KI | `[D L′ B : [R D′ R′ , U′]]` and its reverse |
| IR / RI | `[L2 D L : [D2 , R U R′]]` and its reverse |
| IU / UI | `[D′ L2 : [U′ , R′ D2 R]]` and its reverse |
| RV / VR | `[D′ L : [R′ D2 R , U′]]` and its reverse |
| UV / VU | `[L′ D2 L2 : [U′ , R′ D2 R]]` and its reverse |

- With `[F D^k F′ , U′]` the exceptions are IK and KU only, mean 1.96.
- Checked: every one of the 378 commutators is the right 3-cycle; a pair and its reverse share a setup; 3,000 whole
  solves using the rule's table (10,542 of 11,405 pairs from the table; the others are two letters of one corner).

Example, pair G O: O has the shorter walk (`B`, into B's place). `B` leaves G where it is. G's Orozco setup is `D2`
(into the O position). Setup `B D2`, base `[R D R′ , U′]` with G first: `[B D2 : [R D R′ , U′]]`.

### The other open questions

| # | Question | Answer |
|---|---|---|
| 1 | Frequency weighting | Order unchanged. Weighted mean setups: `[F D^k F′ , U2]` 1.71, `[F D^k F′ , U′]` 1.77, `[F′ D^k F , U]` 1.81, `[R′ D^k R , U′]` 1.83; 6 known alone 1.99 |
| 2 | D L only | Still impossible: 342 / 378 is the ceiling (36 N pairs). A helper needs two free faces, and with D and L free the helper is B or Q, which is Orozco itself |
| 3 | Replace instead of add | Partly: a complete Orozco-style set exists only for helpers on three corners, so "one set per corner" is forced. Other bases for B and P were not compared |
| 4 | A rule | The walk rule above |
| 5 | Longer bases, setups moving the buffer | Not checked |
| 6 | Any-3 search fixed | Exhaustive over all 99 bases (commutator + reverse): best 3 added give mean setup 1.65 (`[R′ D R , U2]`, `[L B2 L′ , F2]`, `[U L2 U′ , R2]`), against 1.89 for helper D. They are not a helper set |
| 7 | Owner checks | B setups are needed (helper D's free faces are D and B). F is not needed with the recommended set |

### Still not done

- A 3-Style solves preset for the walk rule.
- Move counts ignore cancellations between setup and base.
- Question 5, and other base choices for helpers B and P.
