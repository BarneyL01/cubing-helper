# Marshall method ("The Ultimate Solution") page — build plan

Status: **planned, not built** (written 2026-10-22). Written so a different agent can build it.
Read `CLAUDE.md` first (stack, page chrome, verification, branch workflow), then this file.

## Why this page

The owner wants a way to solve the cube with **very few algorithms** that each "clearly do a
thing". Philip Marshall's edges-first method fits: one short edge sequence and one 8-move corner
sequence, plus setup moves ("turn a layer, do the sequence, turn the layer back"). The owner
accepts setup-and-undo as intuitive, and accepts slice moves (2026-10-22). This page is a
**reference for an existing method**, not our own design, and must say so and credit Marshall.

## Sources (the build environment could not read any of them)

On 2026-10-22 every one of these hosts failed from the cloud environment (DNS / proxy refused):

| Source | Host |
|---|---|
| Marshall's own page, archived ("The Ultimate Solution to Rubik's Cube", 1998) | `web.archive.org` (search for Marshall's site) |
| PDF copy of Marshall's page | `www.cs.brandeis.edu` — `/~storer/JimPuzzles/RUBIK/Rubik3x3x3/SOLUTIONS/Rubik3x3x3SolutionMarshal.pdf` |
| Speedsolving wiki: "Philip Marshall", "Edges First" | `www.speedsolving.com` |
| Wikibooks: "How to Solve the Rubik's Cube" (comparison of few-algorithm methods, ~65 moves claim) | `en.wikibooks.org` |

**The builder needs one of these:** (a) the environment's network allow-list extended to these
hosts, or (b) the owner pastes Marshall's text (all steps and sequences) into the session.
Do **not** reconstruct the steps from memory or from search-result snippets: snippets disagree
(see below). Same rule as the Heise page: build only what the source states, and check it.

## What is known so far (from search summaries, not the source)

- Edges first, starting with a cross; then the middle-layer edges; then the top edges; then corners.
- Edge sequence (EPS, 4 moves): reported as `U' R U R'`.
- Corner sequence (CPS, 8 moves): reported as `U R U' L' U R' U' L`.
- About 65 moves per solve (Marshall's own figure, per Wikibooks).

Checked in our simulator (2026-10-22):

| Sequence | Corners changed | Edges changed |
|---|---|---|
| `U' R U R'` | 4 (DFR UFL UFR UBR) | 3 (UR UF FR) |
| `U R U' L' U R' U' L` | 3 top corners cycled (UFL UBR UBL), none twisted | none |

So the edge sequence only works while corners are unsolved (it moves corners), and the corner
sequence is a pure 3-cycle of top corners. **Not known:** how Marshall twists corners in place,
which orientation the cube is held in at each step, the exact setup rules, and how the last
edges are placed (the summaries do not say). These must come from the source.

## Page

- `3x3/marshall/index.html`, data `data/marshall.js`, using `js/steps-page.js` like the 8355 and
  Heise pages (step bar, numbered sections, previous/next links).
- Menu: add `{ label: 'Marshall', path: '3x3/marshall/index.html', badge: 'Partial' }` in `MENU`
  (`js/site-chrome.js`) after Heise; a home row in `index.html` under 3x3 with a one-line
  description ("Edges first, then corners, with two short sequences.").
- Source note: "Not from your notes: Philip Marshall's method, from <source used>." Credit him.
- Sassy rule: write Sassy for `R U R' U'` if it appears in any text (CLAUDE.md "Terminology").
- Intro section: the two sequences as cards (picture of what each does to a solved cube, from
  `js/alg-filmstrip.js` with `fromSolved: true` and `marks` on the moved pieces), with the
  table above.
- One section per step from the source: goal, how (numbered), the sequence and its setups,
  picture strips for the worked examples the source gives.
- Mnemonic words: only if the owner gives them (the cipher is in `docs/mnemonics.md`; never invent).

## Checks (keep the script in `log/`, e.g. `log/2026-10-xx-marshall-check.mjs`)

- Every sequence and every example on the page, by simulation (`js/cube-sim.js` under Node).
- The whole method as written: implement each step's rule as code, run at least 1,000 random
  scrambles and confirm every one solves; report the mean and maximum move count on the page
  (and compare with Marshall's ~65).
- Where the source's text needs a fix to work, add an "Added here, not in Marshall's text" note,
  as on the 8355 page.
- Headless Chromium at 390 px and 1280 px: no console errors, no horizontal page scroll.

## Afterwards

Log entry in `log/`, update `CLAUDE.md` (content scope) and `docs/plan.md`, then merge to `main`
when the owner says so.
