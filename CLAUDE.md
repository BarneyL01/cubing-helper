# Cubing Helper

A personal quick-reference website for remembering how to solve twisty puzzles —
starting with the 3x3 (CFOP, Roux, beginner's method), later adding 2x2 and
Megaminx. This is a cheat-sheet / reference tool, not a timer or trainer.

## Purpose

Built to stop forgetting 2-look OLL/PLL (and eventually full algorithm sets).
Optimize for fast lookup, not completeness for its own sake — content gets
added as it's actually needed.

## Hosting & stack

- Plain HTML/CSS/JS. No build step, no framework.
- Website source lives at the **repo root** (`index.html`, `css/`, `js/`,
  `data/`, `assets/`).
- Served via GitHub Pages, deployed by `.github/workflows/deploy-pages.yml`
  on every push to `main`. That workflow copies only the site folders
  (`index.html`, `css/`, `js/`, `data/`, `3x3/`, `2x2/`, `megaminx/`,
  `assets/` if present) into the published artifact — `docs/`, `log/`, and
  `CLAUDE.md` are intentionally left out of the deployed site. Do not put
  the site under a folder literally named `docs/` — that name is reserved
  for planning docs (see below).
- Graphics: **pictures by default**, drawn by our own code —
  `js/cube-sim.js` applies each algorithm's inverse to a solved cube and
  `js/cube-diagram.js` draws the resulting layer(s) as SVG, so a picture
  can never disagree with its algorithm and needs no outside service. A
  "Pictures / 3D" toggle (`js/view-toggle.js`, choice kept in
  localStorage) switches to cubing.js's `<twisty-player>`, **self-hosted**
  in `js/vendor/cubing/` (unmodified esbuild bundle of cubing.js v0.63.7 +
  three.js; licence notices and rebuild steps in its README). It's ~1 MB,
  so it's only loaded when someone picks 3D, and the page falls back to
  pictures if it fails. The site makes no requests to outside servers.
  Per-case data fields: `stickering` ('full' default, 'oll', 'cmll', 'eo',
  'f2l', 'cross', 'layer1'), `diagramViews` (`['U']` default, `['U', 'D']` for both layers,
  `['cube']` for the top/front/right view), `hold` (a whole-cube rotation
  for cases you reach already holding the cube turned — otherwise worked
  out automatically for algorithms containing y/d etc.), `noViewer` (no
  picture or 3D, for procedural steps or unsupported puzzles), `filmstrip`
  (a card spans the whole row and shows a position after each stage of an
  algorithm — `js/alg-filmstrip.js`; set `noViewer` too; frames come from the
  simulator, with `marks` outlining chosen pieces by their colours, and
  `fromSolved` for "what this does to a solved cube"), `setup` (an exercise's
  setup scramble) and `hideAlg` (solution behind a button). Stickering
  `'edges'` colours edges and centres and greys corners. A case's `then` link
  (F2L map) can also carry `thenDiagram: { alg, hold }`: a small picture of the
  position it leads to, shown under the "Then →" link (it stays visible in 3D
  mode; the F2L page uses the next case's own full algorithm).

## Repo layout

- `/` — site source (HTML/CSS/JS/data/assets)
- `docs/` — planning docs: scope, site structure, content roadmap, decisions
- `log/` — dated progress-log entries (one file per session/milestone)
- `CLAUDE.md` — this file

## Content scope (current)

Grows one struggle-case at a time as the user sends notes — nothing here was
built ahead of being asked for. As of 2026-10-03:

- **3x3 CFOP** — 2-look OLL (8 cases) and PLL (6 cases) from the user's
  original notes. `data/oll.js`, `data/pll.js` (both reachable straight
  from the home page since 2026-10-06, as well as via the CFOP page). Plus an **F2L map**
  (`data/f2l.js`, `3x3/cfop/f2l.html`): all 41 cases + 7 in-between steps,
  each step leading to another case. **Not our original work** — it's a
  transcription of the dogschasingsquirrels chart
  (https://dogschasingsquirrels.files.wordpress.com/2014/06/f2l.jpg); keep
  that credit on the page and in the data file. No mnemonic words for F2L
  (they weren't in the user's notes). It has its own top-menu link
  ("3x3 · F2L") rather than living under CFOP, and a "Find a case" panel:
  filters (pieces' location, white sticker direction, edge state, pair)
  computed from the simulated case by `js/f2l-features.js`, chart
  category, and free text (`js/f2l-finder.js`).
- **3x3 Roux** — CMLL done, reusing `data/corner-orientation.js` (see
  below). **LSE built out on request 2026-10-06, not from the user's
  notes** (the page says so; structure follows the Speedsolving wiki's
  Roux/L7E/EO pages and athefre's DFDB, which I could not open — the egress
  proxy blocks speedsolving.com — so the algorithms and tables are our own,
  found and checked by simulation): 4a EO (11 cards, one per family up to
  turning U), 4b UL/UR (30-row table by where the left/right pieces are), 4c
  M slice (11 cards + solved = 12 cases), and a DFDB section (the edges in
  DF and DB, with the centres lined up, identify the 4c case; plus which slots
  to read before the lining-up M turn, and a sticker-match version). The page
  uses `js/steps-page.js` (step bar). Block building is placeholder. The
  user's one recorded LSE card (`M U2 M`) is kept in a "Your recorded LSE note"
  section, with `M U2 M'` (their text read literally) beside it — neither is
  an EO algorithm; asked the user which they meant. `data/roux.js`.
  **Key rule: every LSE sequence returns the top corners to line up with the
  blocks (net zero quarter U turns).** Searching on edges alone ignores the
  corners and gives algorithms that leave the corners a quarter/half turn
  out. The whole chain (align centres → 4a → 4b → align centres → 4c) solves
  all 46,080 legal LSE positions; the checker is in the log entry — re-run it
  if anything in `data/roux.js` changes.
- **3x3 8355 Method** — Reheart Sheu's beginner method, from the
  Speedsolving wiki text the user pasted (2026-10-03), **not from the
  user's own notes** (the page says so and credits the wiki). `data/
  method-8355.js`, `3x3/8355/index.html`, own top-menu link "3x3 · 8355".
  Same layout as the Beginner's page (shared `js/steps-page.js`): 5 steps
  (cross, 3 corners, 3 middle edges with a keyhole, remaining edges, last 5
  corners) plus an "Example solve" and a "Getting faster" section. Every
  algorithm, both wiki examples and the last-5-corners procedure were
  checked by simulation (log/2026-10-03-8355-method.md); where the wiki's
  text needed a fix the step has an "Added here, not on the wiki" note
  (turn the bottom layer so an unsolved corner is under the buffer before
  each Sassy; the final two twisted corners; the trailing U2 on the last-two-
  edges swaps; the final D in the wiki's last-corners example). Step 4
  (remaining edges) is taught as one move, the **cycle** (`R U^k R'` /
  `F' U^k F`: lift the slot edge, turn the top, drop another edge), with
  step-by-step picture strips: the wiki's two "swap" algorithms are just the
  cycle done twice. Checked: the cycle alone solves all 1,920 arrangements of
  the five loose edges in at most 5 cycles; I have **not** found a simple
  rule that always picks the best cycle for part A (the wiki calls it
  intuitive), and the page says so. Re-run the checks if anything in the data
  file changes.
- **3x3 Beginner's Method** — all 7 steps, one data file
  (`data/beginners.js`, `beginnerSteps`: per step a title, short bar label,
  source, goal, numbered "how", and cases). `js/steps-page.js` builds a
  numbered section per step, a sticky step bar (highlights the current
  step) and previous/next links at the foot of each step — the 8355 page
  uses the same module (steps can also have `notes`, `intro`, `extra`
  sections and a `custom` renderer). Steps 1–4 (white cross,
  white corners, middle edges, yellow cross) are the **standard method
  filled in on request, not from the user's notes** — each step's tag says
  so; swap in the user's own version if they send one. Steps 5–7 are from
  their notes. Step 7 is done with yellow on the **bottom**, turning the
  bottom layer between corners (Sassy with yellow on top breaks the cube —
  checked by simulation). The step 5–7 "how" instructions were checked over
  thousands of random last-layer states; re-run that if they change.
- **3x3 Blindfolded** — M2 edges + Old Pochmann corners, Speffz letters,
  from the user's notes: setup moves for every letter, parity, corner swap.
  `data/bld.js`, `3x3/bld/index.html`, letter nets from `js/bld-net.js`.
  Verified by simulating 500 full blind solves (memo from the scramble →
  execute every setup/alg) — all solve. One fix to the user's notes: edge
  B's setup is `R' U R U'` (notes said `R' U R' U'`, which targets V);
  flagged on the page. Edges must be done before corners (each corner swap
  also swaps UL/UB). Re-run that simulation if any setup changes.
  A **Practice** tab (`3x3/bld/practice.html`, tabs shared with the
  reference page) generates a random-move scramble (or takes the user's own,
  face turns only), draws it as a colour net (WCA white-top or yellow-top
  colours), and shows the edge/corner memo in letter pairs plus the moves
  for every letter — worked out by `js/bld-memo.js` from `data/bld.js`.
  The current scramble (plus the previous one, hidden-letters and open
  moves list) is saved in localStorage (`cubing-helper:bld-practice`), so
  leaving the page never loses it — only "New scramble" / own scramble
  replaces it, and "← Previous scramble" undoes that once. A `?scramble=`
  link still wins.
  Cycle breaks start at the first unsolved piece in letter order. Checked:
  running every listed move solves 2,000 random scrambles; re-run if the
  memo code or any setup changes.
  A **Commutators** tab (`3x3/bld/commutators.html`, `data/commutators.js`)
  explains commutators (insertion + interchange), the effect of changing the
  interchange turn, how to build one, and seven set-up-then-solve exercises
  (setup scramble and picture shown, solution behind a button). From notes
  the user pasted 2026-10-04 (the paste began mid-explanation, so the opening
  paragraph and the picture strip are ours). Every table row, cycle and
  exercise was checked by simulation; one explanation in the paste was wrong
  (`(R' D' R D)×2` twists four corners, not one) and is corrected on the page.
  No mnemonics for most of it: the cipher has no D letter.
- **2x2 Ortega** — all 7 OLL (corner-orientation) cases plus all 5 PBL
  cases. `data/ortega.js`.
- **Megaminx** — last-layer notes (Gray star, align star, Gray corners).
  Earlier steps are placeholder, and there's no interactive 3D preview yet
  (see `docs/plan.md`'s Open questions). `data/megaminx.js`.

`data/corner-orientation.js` holds the 7 last-layer corner-orientation
cases (Sune, Antisune, H, T, L, U, Pi) shared by 2x2 Ortega's OLL step and
Roux's CMLL — they're the same cases and algorithms on both. CFOP's 3x3 OLL
cases are genuinely different algorithms (they also have to preserve edge
positions) and stay separate in `data/oll.js`.

## The mnemonic cipher

The user encodes algorithms as words built from a personal letter-substitution
cipher (e.g. "Sassy" = RUPV = `R U R' U'`). **Always decode/encode through
`docs/mnemonics.md`** — never invent new letter meanings without confirming
with the user. Every algorithm shown on the site should display both the
standard WCA notation and the user's mnemonic word breakdown.

## Libby's notation

2-look OLL and PLL cards (and any alternative algorithm on them) also show a
**"Libby's:"** line: R=1, U=2, R'=3, U'=4 (Sassy = `1234`), R2 = `11`, U2 =
`22`, every other move as written, spaces following the mnemonic words
(`js/libby.js`; rules and the user's examples in `docs/mnemonics.md`). It's
switched on per page with `renderCases(id, cases, { libby: true })` — only the
two 2-look pages use it so far. The line is computed from the algorithm and its
mnemonic chunks, so a new case there gets it automatically.

## Terminology

The user calls `R U R' U'` **Sassy**. Always write Sassy — never the name
other sources use for it — including when rewriting pasted text from the
wiki or anywhere else (user request, 2026-10-03). Method names that contain
that other word are written with Sassy too (e.g. the 8355 variant "Sassy
Method").

## Working conventions

- Standard WCA move notation for all algorithms; mnemonic word shown
  alongside, never instead of.
- Method cards (home page, CFOP page; `.method-card`) are clickable all
  over, not just the "Open →" link: the card's link stretches over the card
  via CSS, so any new card only needs a link inside it. Cards with no link
  (e.g. "Coming soon") stay inert.
- Keep pages static and fast — this is a lookup tool used mid-solve or while
  practicing, not a heavy app.
- When adding a new algorithm/case, update `docs/mnemonics.md` if it
  introduces new cipher letters, and add a dated entry to `log/`.
- Check `docs/plan.md` for current site structure and roadmap before
  restructuring pages/nav.

## Branch workflow

Develop on the feature branch (currently `claude/intelligent-galileo-z6cd7r`),
verify locally (see "Verification" below), then **merge to `main` and let it
deploy automatically** — the user has given standing permission for this, so
it does not need to be asked for each time. Only pause to ask if something
about a specific change feels like it should get a human look first (e.g. an
algorithm you can't verify, a structural change to the site).

## Verification

Before merging to `main`, check new/changed pages with a local static server
(`python3 -m http.server` from the repo root) plus a headless-Chromium
check (screenshots + console error capture) — this has caught real bugs
before (e.g. a flexbox overflow clipping long algorithms). The 3D view can
be checked too now it's self-hosted: launch Chromium with
`--use-gl=swiftshader --enable-unsafe-swiftshader`, click the 3D button,
and scroll each player into view before screenshotting (players only draw
when visible). `js/cube-sim.js` also works as an algorithm
checker under Node (copy `js/` + `data/` somewhere with a
`{"type":"module"}` package.json): e.g. every CFOP OLL case must leave the
first two layers solved, every PLL case must also leave the top oriented.
Run that kind of check when adding algorithms.
