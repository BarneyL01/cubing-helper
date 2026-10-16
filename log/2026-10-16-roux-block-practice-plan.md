# 2026-10-16 — Roux training ideas; block practice planned; practice tools allowed

## What happened

- The user asked for ideas for training Roux. Ten ideas were reviewed in chat
  (case scrambles, recognition quizzes, 4b table drill, DFDB drill, full LSE
  walkthrough, first block practice, second block practice, weak-case focus,
  quick-look mode, colour-neutral option).
- The user picked **first block practice (6)** and **second block practice
  (7)** and asked for a plan detailed enough for another agent to build, with
  no building yet.
- The user also asked for the docs to allow the site to be a practice tool.
  `CLAUDE.md` (intro, Purpose, Working conventions, Roux entry) and
  `docs/plan.md` (Goal, Decisions, Site structure, Roadmap v3.1, Open
  questions) now say so. Timers, statistics and session history are still out
  unless asked for.

## The plan

`docs/roux-block-practice-plan.md`. Summary: a new `3x3/roux/practice.html`
with first-block and second-block modes, random WCA scrambles, a colour net of
the scrambled cube, hidden shortest solutions (with when the DL/DR edge and
each pair is finished), a "check my solution" box, and a colour-neutral
option. Solving is done in the browser by `js/block-solver.js` (IDA* with five
4-piece distance tables per block).

## Prototype numbers (Node, desktop; prototype not kept)

| | First block (U D L R F B M r) | Second block (U R M r) |
|---|---|---|
| Positions | 5,322,240 | 1,088,640 |
| Longest / average shortest solution | 9 / 6.78 moves | 14 / 9.96 moves |
| Full 5-piece table build | 2.3 s, 8 MB (rejected for the page) | 0.5 s |
| 4-piece tables, both blocks | about 0.4–0.5 s total | (included) |
| Search per scramble | 0.2 ms average, 2 ms slowest (200 scrambles) | 0.4 ms average, 3 ms slowest (300 scrambles) |

Also checked in the prototype: `z2 <scramble> z2` leaves the centres home; the
rotated-hold trick (`invertAlg(rho) z2 <scramble> z2 rho`) solved the right
block on all 24 holds (100 scrambles); every second-block solution kept the
first block solved.

## Not done

Nothing on the site changed. Not merged to `main` — waiting for the user to
review the plan and the scope change.
