# Picking between the four Orozco groups (B, D, F, K) for a pair

Status 2026-11-16: **analysis and plan only, nothing built.** Follows `docs/four-helper-plan.md` (answers its open
questions) and is written for another agent to build from once the owner settles the two decisions in section 6.
Read `docs/three-style-notes.md` first. Every number here comes from `node log/2026-11-16-picking-rule.mjs`
(buffer still, setups of D, L, B; pair frequencies from 3,000 seeded solves, memo from C; all 378 results checked as
pure 3-cycles buffer → 1st → 2nd).

## 1. The answer in one table

A pair is one commutator when **one letter sits in a helper's place and the other is done with that helper's usual
setup**. So picking a group = finding which letter can get into a helper's place, and how.

| Level | The pair has | What to do | Pairs (of 378) | Share of a solve's pairs | Mean setup | Mean moves |
|---|---|---|---|---|---|---|
| 0 | B, D, F or K | That helper. Other letter's usual setup for it. Nothing new. | 134 | 41% | 1.15 | 10.3 |
| 1 | E G H L O R S X (one-turn letters) | One turn puts that letter in a helper's place. Then the other letter (where it is now) with that helper's setup. | 178 | 42% | 2.16 | 12.3 |
| 2 | only A I N P Q T U V W | One turn makes one letter into S, X, H or L. Then level 1. | 66 | 17% | 2.83 | 13.7 |

Whole rule: 41.0 corner moves per solve (3.5 pairs). The best possible group for every pair gives 39.7, so the rule
costs 1.3 moves per solve. Setup lengths 0/1/2/3/4 = 24/95/146/104/9 (rule) against 24/114/182/58/0 (best possible).

## 2. Level 0: the pair has a helper letter

Use that helper. The other letter's setup is the one on that helper's page.

Two helper letters in one pair:

| Pair | Use | Setup |
|---|---|---|
| K with B, K with D | K | none (B and D are K's base positions) |
| B with D | B | 1 |
| B with F | B or F | 1 either way |
| F with K | F | 1 |

D and F are on the same corner, so D with F is not a pair.

## 3. Level 1: one-turn letters

Each helper has one face that turns its own corner without moving the buffer. Turning that face carries three other
letters into the helper's place.

| Helper | Turn face | Letters that reach the helper's place | Turn for each |
|---|---|---|---|
| B | B | O, E, X | O: `B`, E: `B'`, X: `B2` |
| D | L | R, L, X | R: `L`, L: `L'`, X: `L2` |
| F | L | E, G, H | E: `L`, G: `L'`, H: `L2` |
| K | D | G, O, S | G: `D`, O: `D'`, S: `D2` |

Steps for a pair X Y where X is a one-turn letter:
1. Do X's turn. X is now in the helper's place.
2. See where Y is now (it moved only if it is on the turned face).
3. Do the helper's usual setup for the letter at Y's new place, then the base, then undo both.
4. Direction: X is in the helper's place. If X is the first letter of the pair, the base goes buffer → helper → position
   (the "backwards" form on the helper pages); if X is second, the "forwards" form.

Examples (checked):

| Pair | Turn | Helper | Other letter is now at | Its setup for that helper | Total setup |
|---|---|---|---|---|---|
| G A | `D` (G → K) | K | A (not moved) | none | 1 |
| E T | `L` (E → F) | F | T (not moved) | `D` | 2 |
| X P | `B2` (X → B) | B | P (not moved) | `D'` | 2 |
| G O | `D` (G → K) | K | S | `L` | 2 |

### Letters with two choices (E, G, O, X)

Setup length with each helper, by partner (partners that are helper letters are level 0 and left out):

| Letter | Shorter with the first helper | Equal | Shorter with the second helper |
|---|---|---|---|
| E (F or B) | F: G, H (1 v 2-3), N, U (2 v 3) | I, O, P, S, T, V | B: L, W (1 v 2), Q, X (2 v 3) |
| G (K or F) | K: A (1 v 2), V (2 v 3) | I, N, O, Q, R, S, T, W, X | F: E, H (1 v 2), P (2 v 3) |
| O (K or B) | K: I, N, U, V (2 v 3) | A, E, G, H, P, R, S | B: L, X (1 v 2), Q (2 v 3) |
| X (B or D) | B: L (1 v 2), N (1 v 3), G (2 v 3), A, V (3 v 4) | E, O, Q, R, T, U, W | D: I, P (1 v 3) |

No property of the partner (its layer, its corner) predicts the shorter choice; it depends on where the partner lands.
The difference is 1 move of setup in all but X with I, P, N.

Three ways to settle it, measured over the level-1 pairs:

| Choice | Mean setup | Pairs per solve that need F or K (a rotation) | To learn |
|---|---|---|---|
| One helper each, shortest overall: E → F, G → K, O → K, X → B | 2.16 | 2.05 | 4 facts |
| One helper each, prefer no rotation: E → B, O → B, X → B, G → K | 2.20 | 1.72 | 4 facts |
| Always the shorter of the two | 1.99 | about 2 | both setups compared per pair |

Recommendation: **prefer no rotation (E, O, X → B; G → K)**, because the owner rotates around each F or K pair
(decision, section 5) and this removes a third of a rotation per solve for 0.04 moves of setup. Optional later
refinement, 6 letter pairs worth 1+ move each: E with G or H → F; X with I or P → D; G with E or H → F.

When both letters are one-turn letters, use the first letter of the pair (either works; choosing the better of the
two is part of the "always the shorter" row above).

## 4. Level 2: pairs with only A I N P Q T U V W (the open area)

The owner does not want these done as two Orozco letters or from a separate list of commutators.

### What the 9 letters have in common (checked)

None is one turn from a helper's place. Each is one turn from S, X, H or L, which are one-turn letters:

| Letter | First turn | Becomes | Then | Helper |
|---|---|---|---|---|
| Q | `B2` | S | `D2` | K |
| A | `L'` | S | `D2` | K |
| I | `L2` | S | `D2` | K |
| U | `L` | S | `D2` | K |
| T | `B'` | S | `D2` | K |
| V | `D2` | X | `B2` | B |
| W | `D` | X | `B2` | B |
| N | `B2` | H | `L2` | F |
| P | `D'` | L | `L'` | D |

So level 2 is level 1 with one more turn in front: "make it S (or X, H, L), then go on as usual". Which letter of the
pair to move: the first one found in the order Q A I U V W N P T (found by search; a different order costs little).

Result for the 66 pairs: setups 2/3/4 moves = 14/50/2, mean 2.83 (13.7 moves). The best possible is 32/34/0, mean 2.53.
The two 4-move pairs are V W and W V.

### Options for level 2 (none is two-step Orozco or a separate list)

| Option | What the owner does | Mean setup | To learn | Weak point |
|---|---|---|---|---|
| A. "Make it S" (table above) | one more turn, then level 1 | 2.83 | 9 first turns (5 of them go to S) | the other letter must be followed through two turns |
| B. A turn that moves the buffer (R, U or F) first | e.g. Q T: `R'` then K's base | 8 pairs 1 move, 46 two, 12 three | the "readings" (base read from M or J) | the owner found readings hard to see (Buffer moves page) |
| C. Avoid the pair at memo time | when a cycle break is free, break to a letter that is not one of the 9 | fewer level-2 pairs | a memo habit | only helps at cycle breaks; not measured yet |
| D. A fifth helper | P as helper makes T, L, H one-turn letters: level 2 falls from 66 to 40 pairs | – | a fifth table | owner chose four groups only |

Recommendation: **A as the rule, C as a habit to measure next.** A needs no new commutators and no new idea, only one
more turn. B is shorter on paper but depends on readings. To measure for C: how many level-2 pairs remain when every
free cycle-break choice avoids the 9 letters (needs a memo simulation; `js/bld-memo.js` breaks at the first unsolved
piece in letter order today).

Also worth measuring before building: whether following the other letter through two turns is workable in the head.
A practice drill (level 2 pairs only, show the pair, reveal turn by turn) would answer that faster than analysis.

### Making "where is the other letter now?" easier (asked 2026-11-16; checked)

1. **Walk the letter whose turns disturb the other letter less.** With one fixed walk per letter (same as above except
   T: `D2` → L, then `L'`, helper D; W: `B'` → H, then `L2`, helper F), the other letter is never moved by both turns:
   not moved at all in 36% of level-2 pairs, moved by one turn in 64%. Cost: mean setup 2.88 (was 2.83), 12 pairs
   with a 4-move setup (was 2). With the walks in the table above unchanged: 31% / 68% / 2%, mean 2.97.
2. **Face test.** A letter moves under a turn only if its corner is on the turned face. Corners on each face:
   L: A E R, D F I, U G L, X H S. D: U G L, V K P, W O T, X H S. B: A E R, B N Q, W O T, X H S.
3. **Rings.** Each turn moves letters round three rings of four (a 2 turn goes two steps, a ′ turn goes backwards):
   L: A → I → U → S, D → L → X → R, E → F → G → H. D: G → K → O → S, H → L → P → T, U → V → W → X.
   B: A → H → W → N, B → E → X → O, Q → R → S → T. These are also where the one-turn letters come from (the ring
   that holds a helper letter).
4. A drill that reveals the steps one at a time (section 7).

### Decision and two more checks (owner, 2026-11-16)

- **Level 2 = option A with the shorter setups** (the first table: fixed order Q A I U V W N P T), helped by the face
  test and the rings, and learnt through drills. Not the "less disturbing letter" variant (12 four-move setups).
- **V W / W V are not 4 moves whatever you do:** the rule gives `D2 B2` + `D' L'` (4), but helper B with `B D2 B2` (V into
  B's place, W into H) is 3; helpers D and F also have 3-move setups. Show the 3-move one in the lookup as the listed
  exception (same for the other 4-move pairs in section 8).
- **No small set of extra commutators removes level 2** (greedy cover of the 66 pairs by any 8-move commutator with the
  buffer, D/L/B setups, weighted by frequency): no setup: 2 pairs per base; setup ≤ 1: best single base
  `[R' D' R , U2]` (buffer → A → P, already known from helper P / step 2b) covers 12 pairs = 21% of level 2, five bases
  without L or B cover 30 pairs (47%); with L/B bases six cover 67%. Helper P as a whole fifth group leaves 40 pairs
  (11% of a solve's pairs instead of 17%). I, N and V cannot be helpers at all (no 8-move commutator with the buffer
  contains them). Owner keeps four groups.

## 5. Answers to the open questions in `docs/four-helper-plan.md`

| # | Question | Answer | Basis |
|---|---|---|---|
| 1 | Drop helper P from Walk rule, Buffer moves, Pair lookup? | **Drop it; four groups only** (owner, 2026-11-16). Helper P's page and Orozco step 2 stay. | P as a fifth: mean setup 1.67 → 1.53 (about 1 move per solve), but K and P share a corner and a turn face, so more choices per pair |
| 2 | Rotation per pair for F and K? | **Rotate around each pair** (owner, 2026-11-16): z for F, y' for K, the pair as on the helper pages, rotate back. | Under the rule 1.7-2.1 pairs per solve need a rotation |
| 3 | Show a pair as seen after the rotation, or as written? | **As seen after the rotation**, with the rotation written in the line ("z · … · z'"); the level-1 turn and the letters are read **before** rotating. Follows from 2. To confirm with the owner: do the one-turn move before the rotation (recommended: the letters are still where they were memorised) or after. | – |
| 4 | Is Buffer moves still worth a page? | **Not as part of the picking rule.** Keep it only as a "shorter alternative" line in Pair lookup where it saves 2+ moves. | With four helpers, moving the buffer shortens the setup for 13% of a solve's pairs; pairs with I V Q U average 12.5 moves buffer still, 11.9 with the buffer moving (it was 13.1 → 11.3 with B, P, D) |

## 6. Decisions (owner, 2026-11-16) and what is still open

Decided:
- Four groups only (no P). Rotate around each F or K pair.
- E, G, O, X: **fixed helpers preferring no rotation: E, O, X → B; G → K.**
- F and K pairs: **rotate first, then do everything as seen after the rotation**, the one-turn move included (owner: "I
  should learn the group as rotated"). So the page must give the one-turn moves for F and K in the rotated view: after z
  the old L face is the U face, so E, G, H reach F's place with U turns as seen; after y' the D face is still the D face,
  so G, O, S reach K's place with the same D turns. Generate these from the data and check each rotated form equals the
  original moves (as the F and K generators already do). This overrides the "before rotating" note in section 5, row 3.

Still open: nothing for the rule itself (level 2 decided, see the end of section 4). Earlier note:
- Level 2 (section 4): the owner did not follow the table on first reading ("is that to cover the gaps from level 1?").
  It is: level 2 is the 17% of pairs where neither letter is a helper letter or a one-turn letter. Explain it with a
  worked pair before asking the owner to choose an option.

## 7. What to build once decided (for the building agent)

Not to be started before section 6 is answered.

- **Walk rule page → "Which group?" page.** Replace the B, P, D walk table with the three levels: level 0 note, the
  one-turn table (section 3), the level-2 first turns (section 4), E G O X table. Keep the sticker-cube pictures: one per
  helper showing its turn face and the three letters it brings in.
- **Pair lookup.** Two letters → level, turn(s), helper, where the other letter is now, its setup, the commutator as the
  owner does it (rotation shown for F and K). Show the best-possible group's commutator in one line when it is shorter
  than the rule's (so the rule's result is always first).
- **Buffer moves.** Fold into Pair lookup as the optional shorter line (question 4); retire the page or keep it marked
  Outdated until the owner says.
- **A drill** (Blind drills, 3-Style mode or 3-Style solves): pairs filtered by level, answer hidden, steps revealed one
  at a time (turn → helper → where the other letter is → setup → commutator).
- Data: generate from the four helpers' data files (`data/orozco-corners.js`, `orozco-d.js`, `orozco-f.js`,
  `orozco-k.js`) with a generator in `log/` (`--write`), starting from `log/2026-11-16-picking-rule.mjs`, which already
  builds and checks all 378. Add whole-solve checks (3,000 seeded solves: M2 edges, then corners pair by pair with the
  rule, last letter plain Orozco + Ra on an odd count) as section 5 of the plan doc describes.
- Wording: Speffz sticker letters only, C is "the buffer", "helper's place", "turn face" (the earlier pages said "walk";
  the owner has not chosen between the words).

## 8. Facts found on the way (checked; do not re-simulate)

- Each helper with its three base positions: B with O H L; D with G P S; F with E G H; K with B D A. F's place and its
  positions are the four stickers of the left face itself (E F G H), so any two of them are a pair with one L turn.
- One fixed helper per one-turn letter against always the shorter: 2.16 v 1.99 mean setup over level 1, 0.5 moves per
  solve. A fixed order of helpers ("try B first, then D …") is worse than a fixed helper per letter (2.17-2.21).
- "Only use turns that leave the other letter where it is" does not work as a rule: 58 pairs are not reachable and
  the mean rises to 1.84.
- Pairs with a 4-move setup under the rule (9): I R, R I, L S, L V, V L, R V, V R, V W, W V. The best group has 3 for
  each of them; list these as exceptions in the lookup.
