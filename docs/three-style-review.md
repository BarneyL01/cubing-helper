# Review: building and learning the owner's own 3-style corners (2026-11-17)

Analysis only; nothing on the site changed. Sources: the `log/` entries from 2026-10-25 to 2026-11-18,
`docs/three-style-notes.md`, `docs/four-helper-picking-rule.md`. New numbers come from the tables of
`log/2026-11-16-picking-rule.mjs` (buffer still, D/L/B setups, 3,000 seeded solves, 3.5 pairs per solve, pairs only).

## 1. Outcome

- The design is good enough. The limit is now learning, not design.
- The approach (few bases, Orozco-shaped, setups in front) suits the owner and should stay. Learning 378 separate
  algorithms by recall has no shortcut: pairs come up almost equally often, so there is no small "most common" set.
- What should change is the process: stop adding groups, learn in rungs that each pay off in real solves, and record
  what is known.

## 2. What has been tried (24 days)

| Date | Approach | Why it was left or changed |
|---|---|---|
| 10-25 | Orozco, helper B (18 commutators) | kept; the base of everything since |
| 11-02 | Dylan / J Perm sheet (378) | setups of 4-5 moves, hard to remember |
| 11-03 | 3-Style (ours): R cores, setups ≤ 3 of R U D F | buffer moves in setups; 12 groups; "endless" |
| 11-05 | By base: 30 + 1 bases, D/L setups | 46 bases with B "too many"; N and Q unreachable |
| 11-08 | Orozco step 2 (pairs with P) | bounded, but only 13-34% of solves |
| 11-09 | Helper P (whole Orozco), shortcuts, quick tests | P is "the odd group"; dropped from the rule 11-16 |
| 11-10 | Helper D, walk rule on B P D | hard letters I V Q U long |
| 11-11 | Buffer moves | "readings" hard to see; now outdated |
| 11-16 | A group, rotations | 3-move setups too hard; replaced |
| 11-17 | Helpers F and K (rotated) | kept |
| 11-18 | Picking rule on B D F K: Which group?, Pair lookup, Pair drill | current |

## 3. The owner's constraints and limits (as stated in the logs)

- Speffz sticker letters only; C is the buffer; explain through Orozco.
- Buffer should stay still; setups of D and L, B reluctantly; no B inside a base; L not as a main move; no M.
- Few bases: 46 was too many; 9, then 12, accepted.
- Repeated patterns preferred over shorter irregular ones.
- Full 3-style feels endless; separate lists of commutators not wanted; two-step Orozco not wanted as the answer.
- Hard: following a letter through turns; reading a base from another sticker; a double rotation (x y).
- Not all algorithms are memorised yet.

## 4. Findings

1. **Each redesign arrived before the previous one was learnt.** Eleven approaches in 24 days. Several changed what has
   to be memorised (P in, P out; A group in, out; per-pair rotation rejected 11-16, accepted the same week).
2. **Move count is nearly used up.**

   | What is used | Corner moves per solve |
   |---|---|
   | Plain Orozco (two commutators per pair) | 71.1 |
   | Every pair one commutator, helper B only | 45.1 |
   | Helpers B + D (no rotation) | 42.4 |
   | B + D + F or K | 40.9 |
   | B + D + F + K, best group every time | 39.7 |
   | The picking rule as built | 40.8 |
   | 3-Style (ours), 10.7 per pair | about 37.5 |

   Going from two commutators to one saves 26 moves and needs only the three Orozco bases. The three extra tables
   save 5 more. F and K together save 2.7 and need a rotation on half the pairs.
3. **The work per pair is now thinking, not turning.** A level-2 pair needs: level, which letter, two turns,
   rotation, where the other letter is, its setup in one of four tables (two of them in a rotated view), direction,
   undo, rotate back. Nothing so far measures thinking time or recall.
4. **A rule is a way to learn, not a way to execute forever.** Fast 3-style is recall of pair → moves. The rule is the
   right scaffold: it makes every pair derivable. Pairs done often should turn into recall without the steps.
5. **The memory load is 72 letter setups** (18 per helper), 36 of them in a rotated view, plus the rule. That is less
   than 378 but it is the real syllabus, and the site does not show it as one.
6. **The site still shows superseded systems side by side** (step 2, Helper P, B shortcuts, By base, Buffer moves,
   two 3-Style tables). Helper B's shortcuts (O, E, X after a B turn) are level 1 of the new rule under another name.
7. **No record of what is known.** Statistics were excluded by an early decision; that decision now costs more than
   it saves.

## 5. Suggested adjustments

| # | Adjustment | Why |
|---|---|---|
| 1 | Freeze the design: `data/pair-rule.js` is "my 3-style", one commutator per pair. No new group until rung 4 below is solid. | finding 1 |
| 2 | Learn in rungs (below), plain Orozco for anything not yet learnt | every rung shortens real solves at once |
| 3 | Add a "what I know" record: mark each helper table letter and each level as known; drills draw from weak items; the solve trainer makes scrambles only from known rungs | findings 3, 7 |
| 4 | Decide whether F and K are worth their rotation (section 6) | finding 2 |
| 5 | Move superseded pages into one "Earlier attempts" menu section; rename B shortcuts to "level 1 with B" | finding 6 |
| 6 | Drill for recall: Pair drill mode that shows the pair and times the answer, repeats slow pairs sooner | finding 4 |

Rungs (moves per solve when the rest is plain Orozco):

| Rung | Learn | Pairs in one commutator | Moves per solve |
|---|---|---|---|
| 0 | Orozco, helper B | pairs with B | 71.1 |
| 1 | level 1 with B (O, E, X) | 36% | 64.5 |
| 2 | helper D table, levels 0-1 | 57% | 57.3 |
| 3 | helper K or F table | 74-75% | 50.8 |
| 4 | the other one | 83% | 47.0 |
| 5 | level 2 | 100% | 40.8 |

## 6. A different approach to weigh: fewer tables, no rotation

| Variant | Tables to learn | Rotations | Moves per solve | Pairs with a 3+ move setup |
|---|---|---|---|---|
| B only | 1 (known) | none | 45.1 | 212 |
| B + D | 2 | none | 42.4 | 134 |
| B + D + F + K (now) | 4 | half the pairs | 39.7 | 58 |

With B only there is nothing to pick: one letter goes to B's place, the other uses the Orozco setup. The price is
longer setups, so more following of letters through turns, which is the owner's stated weak point. B + D is the middle.
Not measured: a level rule for B only and for B + D (the figures above are the best setup per pair).

## 7. Questions for the owner

1. Which tables are known by heart today (B, D, F, K)?
2. What is the aim: fewer moves, faster solves, or understanding commutators?
3. May the site keep a record of what is known (reverses "no statistics")?
4. Keep F and K with rotations, or run B + D only for a period and compare?

## 8. Owner's answers (2026-11-17)

- Known today: some of the tables, but the recent changes have caused confusion.
- Aim: reach 3-style (one commutator per pair instead of two); an exercise in learning, not only speed.
- **Design frozen** on B, D, F, K and the picking rule as built. No new groups.
- Hardest part so far: setups that move several pieces, and remembering how to undo them.
- Orozco feels like understanding; pair commutators feel like memory work. Learning advice should keep the
  problem-solving character: a pair is an Orozco letter with one or two turns in front, undone in reverse.
- Still to ask: a record of what is known; which rung to start on.
