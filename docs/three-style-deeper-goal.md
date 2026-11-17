# The deeper goal behind the 3-style work (owner interview, 2026-11-17)

Follows `docs/three-style-review.md` and `docs/three-style-learning-plan.md` (which froze the design and proposed table
drills and a record). The owner felt those "did not get to the bottom of what I'm after"; these are their answers to a
round of questions, and what follows from them. Nothing built yet.

## 1. What the owner said

| Question | Answer |
|---|---|
| End state: an undrilled pair comes up mid-solve | **Work it out live**. One day with any commutator; for now with a fixed toolkit (the helper bases). |
| What made Orozco click | Moving a piece into the interchange place is understood. How the commutator itself works is not, and that is fine: "I can easily figure out how to move the piece, then do the alg and undo. The sequence to solve has become understandable." Understanding grows by repeating the actions. |
| Where solves stop today | No full blind solves yet; practises sighted. Edges up to 3 pairs blind. Corners: maybe one pair; struggling to remember commutators, mostly because of the changes; Orozco B was understood but may have been muddled recently. |
| The bigger aim | Understanding the cube, enjoying the puzzle, and a hard thing to learn as a brain exercise. |
| The site while learning | **Keep both**: the four helpers as they are, plus an understanding path beside them. |
| How they learn | Not sure. Learns most things quickly; this one is different because **"not being able to trace the movement myself easily has been a significant challenge"**: 3-move setups, and setups that move more than one piece, "beyond grasp", little to no progress. Executing the four groups: somewhat achievable, a little progress. Pairs: a further step; "can't bridge the last gap yet". |
| What breaks in a multi-piece setup | **Can't see why** (can follow a written setup, can't make one) and **lose count of turns**. |
| How they trace | **Picture it in my head** (not by watching the cube, not by letter patterns). |
| Gap from groups to pairs | **Mainly tracing**, and **too many choices** (level, helper, letter, rotation). |
| Tools wanted | Trace drill 1 letter; trace drill 2 letters; build-the-setup drill. |

## 2. What this means

1. **The bottleneck is a skill, not a design.** The owner can execute a commutator once a piece is in place. What is
   missing is mentally following stickers through turns: one letter over two or three turns, two letters at once, and
   finding the turns that put a letter where it is needed. Every page so far gives the answer (the setup) instead of
   training the skill that produces it. More tables or rules will not close this gap.
2. **Tracing is done by picturing**, so the training should build that picture step by step: one turn, then two, then
   three; one letter, then two. Feedback must show where the sticker really went (a picture after each turn), so the
   mental image gets corrected, not just marked wrong.
3. **"Can't see why" means setups need to become something found, not recalled.** The helper tables are 72 answers;
   with tracing, each is a small puzzle: "get this letter into G, P or S without touching the buffer or the helper".
   That keeps the problem-solving character the owner likes in Orozco.
4. **Too many choices**: the four-helper rule asks for level, helper, letter, rotation before any turning. While
   tracing is weak, practice should fix the choices (one helper, no rotation first) so only tracing is being trained.
5. **Stability**: no more redesigns. The four helpers stay as built; the new work is an understanding / skill path next
   to them. Orozco B is the anchor and should be made solid again first.

## 3. Proposed next step (not built; owner to confirm)

A **Tracing** practice page (Practice section), all in Speffz sticker letters, with pictures as feedback:

| Level | Task | Answer shown as |
|---|---|---|
| 1 | One letter, one turn (D, L, B first; then R, U, F) | the letter's new place, picture before and after |
| 2 | One letter, two then three turns | the place after each turn, one picture per turn |
| 3 | Two letters (a pair), the same one to three turns | both places after each turn |
| 4 | Build the setup: a letter and a target (Orozco: O, H or L, buffer and B must not move) | the shortest setups; the owner's own turns checked by simulation |
| 5 | Same as 4 for helpers D, K, F, then for a pair (the second letter followed through the turns) | as 4 |

Helpful aids already worked out: the face test (a corner moves only if it is on the turned face) and the rings (each
turn moves letters round three rings of four), in `docs/four-helper-picking-rule.md` section 4.

Open questions for the owner before building: which turns to start with, timed or untimed, whether the owner types the
answer (letter buttons) or just reveals and self-marks, and whether level 4 should accept any working setup or only the
shortest.

## 4. Second round (same day): where the pair actually breaks

The owner narrowed it down: "Assuming I remembered the helper bases and the letters they need to move to, I can usually
figure out the setup. The gap I have is when neither of the letters is the target spot or the helper. I may be able to
guess one of the setups but I can't easily figure out the 2nd letter."

Measured (from `data/pair-rule.js`): in level 1 the first turn moves the second letter in 86 of 172 pairs; in level 2 in 54
of 64. Once moved, its own setup is 0-2 moves (level 1: 0/1/2 = 34/86/52; level 2: 0/1 = 14/50).

Answers, using A → O (B puts O in B's place and carries A to H, where it needs no setup):

| Question | Answer |
|---|---|
| Which step loses you | **Which letter to move** (and so which helper) |
| Knowing where the 2nd letter went, is its setup easy | **Yes, mostly** |
| Turn then look, or plan in the head | **All in my head**; trying it just now: "still make silly mistakes like recognising the wrong letter"; "at the moment it's still remembering the bases, I often have to go back to the list and check" |

## 5. Revised reading

The order of difficulty, from the bottom up:
1. **Recognising letters correctly** (wrong letter read off the cube).
2. **Recalling the bases** (12: three per helper, with the position letters) — still looked up.
3. **Deciding which letter to move and into which helper** — the step that breaks a pair.
4. Tracing the second letter and finding its setup — mostly fine once 1-3 are in place.

So the next practice should start lower than tracing: letter recognition (Blind drills' Letters mode exists), then base
recall, then a quick "which letter / which helper / which turn" decision drill, then whole pairs (Pair drill). The tracing
drills of section 3 stay useful for level 2 but are not the first need.
