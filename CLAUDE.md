# Cubing Helper

A personal quick-reference website for remembering how to solve twisty puzzles —
starting with the 3x3 (CFOP, Roux, beginner's method), later adding 2x2 and
Megaminx. It is a reference tool **and a practice tool**: reference pages for
looking things up, plus practice pages that help the user train a step
(scrambles, set-up positions, hidden answers, checks). Practice tools have
been allowed since 2026-10-16 (user decision); the first one was the
Blindfolded Practice tab. Timers, statistics and session history are still
not built unless asked for.

## Purpose

Built to stop forgetting 2-look OLL/PLL (and eventually full algorithm sets),
and to practise the steps that need training rather than memory (e.g. Roux
block building). Optimize for fast lookup on reference pages and for quick,
repeatable drills on practice pages, not completeness for its own sake —
content and drills get added as they're actually needed.

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

- **Page chrome and phone layout** (redesign, 2026-10-06; the owner approved a
  mockup and answered the open questions — see `log/2026-10-06-mobile-redesign.md`).
  Phone (390 px, cube in hand) is the primary target.
  - Every page has only `<header class="site-header" id="site-header">` with a
    plain Home link inside (the no-JS fallback) and loads `js/site-chrome.js`
    in `<head>`. That module builds the one-line sticky header, a grouped menu
    (**one `MENU` list at the top of `js/site-chrome.js` — add new pages there**),
    breadcrumbs (group › parent › page, from the same list), and moves every
    `.source-note` on the page into a collapsed "About this page" at the bottom.
    Menu: full-screen panel on screens under 1280 px (Esc/Close, focus kept
    inside, scroll locked); inline grouped nav from 1280 px up. Pages have no
    footer any more.
  - Case cards (`js/render-cases.js`): picture/3D left, name + step label +
    mnemonic word right, algorithm full width at 19 px, **Libby's line
    directly under the algorithm, never inside a collapsed section**, then a
    collapsed "Breakdown and notes" (mnemonic breakdown, alternative
    algorithm, story, notes). A case with only `altAlg` (no `alg`) shows that
    as its main algorithm. Exercises (`hideAlg`) keep everything inside their
    hidden solution. Every card gets an id (`anchor`, else `<container>-<n>`).
  - Picture index: pages with `<div id="picture-index">` call
    `renderPictureIndex(slotId, [{ title, container }])` after `renderCases`:
    thumbnails copied from the cards' own pictures (text list for Megaminx,
    which has none), each linking to its card; cards get "↑ Index". On OLL,
    PLL, 2x2 and Megaminx.
  - `mountViewToggle(slot, { view: false })` also mounts **Keep screen on**
    (Screen Wake Lock): off by default, last choice kept in localStorage
    `cubing-helper:keep-awake`, re-requested when the tab returns, hidden when
    the API is missing, shows off if the browser refuses.
  - Badges: only "Partial" / "Coming soon"; no "Ready". Partial uses
    `--partial` (#8a6408, white text; light colour in dark mode). Tappable
    controls are at least 44 px tall.
  - Home (`index.html`) is grouped by puzzle with one `.row-card` per method
    (icon, title, one-line description, chevron) and quick links (CFOP: OLL,
    PLL, F2L map; Blindfolded: Practice, Commutators). `.method-card` (whole
    card clickable via its stretched link) is only used on the CFOP hub now.

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
  notes** (the page says so). Algorithms and tables are our own, found and
  checked by simulation, then compared with Scheopner's LSE page
  (scheopner.com/cube/lse.php) and athefre's DFDB page
  (sites.google.com/site/athefre/roux/dfdb-recognition), which are reachable;
  speedsolving.com is still blocked from the build environment. The comparison:
  the EO cards carry Scheopner's names/notation ((top/bottom) bad counts, a =
  adjacent, o = opposite; his 9 non-mirror cases = our 11 cards with two mirror
  pairs shown both ways) and his V + D-Line algorithm is identical to ours; his
  two 3-cycle and H algorithms match our cards; his "Dots" (`M' E2 M E2`) is
  our `U2 M' U2 M2 U2 M' U2` case (checked). Our DFDB is an equivalent we
  built, not athefre's wording (his page has no case table): 4a EO (11 cards, one per family up to
  turning U), 4b UL/UR (30-row table by where the left/right pieces are), 4c
  M slice (11 cards + solved = 12 cases), and a DFDB section (the edges in
  DF and DB, with the centres lined up, identify the 4c case; plus which slots
  to read before the lining-up M turn, and a sticker-match version). The page
  uses `js/steps-page.js` (step bar). Block building is placeholder.
  **LSE map tab (2026-10-22, `3x3/roux/lse-map.html`, `data/lse-map.js`):** the owner's way of doing 4a —
  repeat `U' M'`, look after every pair, finish the arrow with `M' U M` or a mirror (U turn first if needed).
  One card per bad-edge pattern (32, grouped by family) with a picture after every pair; 16 patterns need a
  short fix first (they loop otherwise). Generated and checked by `log/2026-10-22-lse-eo-map.mjs --write`.
  The Roux pages now have tabs (Reference / LSE map) and a MENU child.
  **Block practice is planned, not built:** `docs/roux-block-practice-plan.md`
  is the full spec (first block + second block drills on
  `3x3/roux/practice.html`, an in-browser shortest-solution search in
  `js/block-solver.js`). The
  user's one recorded LSE card (`M U2 M`) is kept in a "Your recorded LSE note"
  section. Their "2o/2" is the (U+D)-Line EO case, and `M U2 M` / `M' U2 M'`
  read as the first three moves of its two mirror-image algorithms (ours
  `M U2 M U2 M' U M' U'`, Scheopner's `M' U2 M' U2 M U M`); the page shows the
  whole algorithm beside the card and asks the user to confirm that reading —
  it is a reading, not something they wrote. `data/roux.js`.
  **Key rule: every LSE sequence returns the top corners to line up with the
  blocks (net zero quarter U turns).** Searching on edges alone ignores the
  corners and gives algorithms that leave the corners a quarter/half turn
  out. The whole chain (align centres → 4a → 4b → align centres → 4c) solves
  all 46,080 legal LSE positions; the checker is in the log entry — re-run it
  if anything in `data/roux.js` changes.
- **Recognition practice (2026-10-23, `3x3/practice/recognition.html`):** a timed practice page — a 3D cube
  (cubing.js, loaded with the page; picture fallback) shows a random 2-look OLL, 2-look PLL and/or Roux CMLL case
  with a random top-layer turn; after the case time (default 30 s) the solution (name, U turn + algorithm,
  mnemonic, Libby's line for OLL/PLL) shows for the solution time (default 3 s, can be switched off), then the
  next case. Settings in localStorage `cubing-helper:recognition`; Keep screen on. Every case and turn checked by
  `log/2026-10-23-recognition-check.mjs` (84 combinations). Menu item and home row under 3x3. Note: cubing.js
  `control-panel="none"` stopped the cube drawing here, so the player keeps `bottom-row`.
- **3x3 Marshall Method** — Philip Marshall's edges-first method ("The Ultimate Solution to Rubik's Cube"),
  from his own page (helm.lu/cube/MarshallPhilipp, read 2026-10-22), **not from the user's notes** (the page says
  so and credits him). Two series (`F R' F' R`, `U R U' L' U R' U' L` and its mirror) with checked picture strips,
  then five steps reworded from his text. His figures are not reproduced. Not checked: the whole method on random
  scrambles and his 65-move figure, and the judgement in steps 2–5 (listed on the page). `data/marshall.js`,
  `3x3/marshall/index.html`, menu link "Marshall" (Partial); checks in `log/2026-10-22-marshall-check.mjs`.
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
- **3x3 Heise Method** — Ryan Heise's intuitive method, from a spec the owner pasted on
  2026-10-20 plus answers another agent read off ryanheise.com (the build environment cannot read it),
  **not from the user's own notes** (the page says so). Heise shows almost every move sequence only in an
  animated applet, so none is on the page except our own checked examples. `data/heise.js`, `3x3/heise/index.html`, menu link "Heise" (Partial);
  same layout as the 8355 page (`js/steps-page.js`). Four steps (squares; match + orient edges;
  remaining edges + two corners; last three corners) plus a "what is not on this page yet" list.
  Examples are only the ones that could be checked: outer/inner square pictures, the four squares in
  their solved places, a corner 3-cycle that solves two corners, an edge 3-cycle, a corner twist, and three
  last-three-corners solves (`[R U' R', D]` direct, with `R2`, with `U R2`). **Derived from the spec's rules
  (not Heise's text):** the four squares' solved places (96 arrangements, all the first two layers of the
  shared colour minus one corner/edge pair, so 5 edges and 5 corners are unsolved at the start of step 3)
  and edge orientation along the F/B axis. They are made and checked by
  `log/2026-10-20-heise-examples.mjs` (`--write` rewrites the GENERATED block). **Not built, because
  Heise gives them only as applet pictures:** the rule for correct/incorrect/neutral edges, the simple swap,
  criss/cross and free-column moves, the pair 3-cycles (v1 to v3) and conjugations, the two edge 3-cycle
  varieties, and a worked scramble-to-solution example. Do not invent them; ask for the details. Corrected
  2026-10-20: the orientation-preserving group is R, L, U, D and half turns of F and B (not "two opposite faces").
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
  **Corner tabs rebuilt around three bases (2026-10-21):** "Corner cycles"
  (`3x3/bld/corner-cycles.html`) teaches buffer V with three base commutators
  `[R U R', D]`, `[R U R', D']`, `[R U R', D2]` (and reverses) plus a setup of any
  faces (0-3 moves, mean 2.1; every pair is base + setup). Data `data/corner-bases.js`
  is generated and checked by `log/2026-10-21-bld-three-base.mjs` (`--write`).
  The old full table (one shortest commutator per pair) moved to "Corner table"
  (`corner-table.html`), twists and parity to "Twists & parity" (`corner-twists.html`),
  both still using `data/corner-cycles.js`. The older notes below describe that table.
  **"After 8355" tab (2026-10-21, `3x3/bld/corner-8355.html`):** for someone who finishes the first two
  layers with 8355, so only the corners UBL UBR UFR UFL (A-D) and DFR (V) are unsolved. Lists the 108
  pairs among them (12 target stickers on 4 corners), same three bases, setups restricted to R U F D
  (no L/B; mean 2.78 setup moves vs 2.15 with any face; max 15 moves). Data `data/corner-8355.js`,
  generated and checked by `log/2026-10-21-bld-8355-corners.mjs` (`--write`).
  **"After 8355 (L/B)" tab (`3x3/bld/corner-8355-lb.html`):** the same 108 pairs with setups of any face
  (setup moves 1/2/3 = 18/56/34, none longer; mean 2.15, mean 11.70 total moves, max 14). Data
  `data/corner-8355-lb.js` from `node log/2026-10-21-bld-8355-corners.mjs --lb --write`.
  Section 3 of the L/B tab (2026-10-22): "put the corners in place, twist later" — the easiest commutator for each
  of the 12 ordered pairs of corners (orientation ignored), with pictures and the site-wide Pictures / 3D toggle (render-cases `palette: WHITE_TOP` keeps 3D white-on-top); memo by pieces,
  then fix twists with the owner's twist algorithm. Checked on all 4,860 positions (at most 3 pairs, then at most
  3 twists) by `log/2026-10-22-8355-placing.mjs --write` (`data/corner-8355-place.js`).
  **Two more tabs are built (2026-10-16):** "Corner cycles"
  (`3x3/bld/corner-cycles.html`, buffer DFR (the corner Old Pochmann's swap exchanges with UBL), letters V/K/P, traced from V: 378 pairs, twists, odd count,
  setup moves, lookup, 8 exercises) and "Edge cycles" (`3x3/bld/edge-cycles.html`,
  buffer UF: 440 pairs, flips, 8 exercises). Their tables are generated and
  checked by `log/2026-10-16-bld-cycles-generate.mjs` (`--write` rewrites the
  GENERATED blocks in `data/corner-cycles.js` and `data/edge-cycles.js`). **Open:**
  the edge side of an odd number of letters is not on the page (the first
  method tried solved 1 of 493 random scrambles); the owner chose to teach the
  corner side only. Corner parity uses the Old Pochmann corner swap
  (`BLD_CORNER_SWAP`: UBL↔DFR and two edges) with U/L/B setups that bring the last letter to E.
  Setup moves are shown in orange (`js/move-format.js`). The three long Blindfolded pages (Commutators,
  Corner cycles, Edge cycles) have a sticky "Jump to" bar built by `js/page-jump.js` from their
  `h2.section-heading[id]` headings (`data-short` = pill label).
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
- Method cards on the CFOP hub (`.method-card`) are clickable all over, not
  just the "Open →" link: the card's link stretches over the card via CSS, so
  any new card only needs a link inside it. Cards with no link (e.g. "Coming
  soon") stay inert. Home rows (`.row-card`) are clickable all over through
  their `.row-main` link.
- Keep pages static and fast — these are lookup and practice tools used
  mid-solve or while practicing, not a heavy app. Practice pages compute what
  they need in the browser (e.g. a solver's tables built on page load) rather
  than loading large precomputed tables or outside services. Algorithm lists
  in `data/` are fine even when a script generated them (keep the script and
  its checks in `log/`).
- Practice pages: one page per drill area, reached by a tab next to the
  reference page (like `3x3/bld/practice.html`) and a `children` entry in
  `MENU`. The current item is kept in localStorage (`cubing-helper:<page>`),
  answers are hidden until a button is pressed, and anything generated (a
  scramble, a solver's solution) is checked by simulation in a Node checker
  kept in `log/`.
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
