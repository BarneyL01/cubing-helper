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
  picture or 3D, for procedural steps or unsupported puzzles).

## Repo layout

- `/` — site source (HTML/CSS/JS/data/assets)
- `docs/` — planning docs: scope, site structure, content roadmap, decisions
- `log/` — dated progress-log entries (one file per session/milestone)
- `CLAUDE.md` — this file

## Content scope (current)

Grows one struggle-case at a time as the user sends notes — nothing here was
built ahead of being asked for. As of 2026-09-27:

- **3x3 CFOP** — 2-look OLL (8 cases) and PLL (6 cases) from the user's
  original notes. `data/oll.js`, `data/pll.js`. Plus an **F2L map**
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
  below); one LSE recognition case. Block building and the rest of LSE are
  placeholder. `data/roux.js`.
- **3x3 Beginner's Method** — all 7 steps. Steps 1–4 (white cross, white
  corners, second layer, yellow cross) are the **standard method filled in
  on request, not from the user's notes** — each card says so; swap in the
  user's own version if they send one. Steps 5–7 are from their notes.
  `data/beginners-first-layers.js`, `data/beginners-last-layer.js`.
- **3x3 Blindfolded** — M2 edges + Old Pochmann corners, Speffz letters,
  from the user's notes: setup moves for every letter, parity, corner swap.
  `data/bld.js`, `3x3/bld/index.html`, letter nets from `js/bld-net.js`.
  Verified by simulating 500 full blind solves (memo from the scramble →
  execute every setup/alg) — all solve. One fix to the user's notes: edge
  B's setup is `R' U R U'` (notes said `R' U R' U'`, which targets V);
  flagged on the page. Edges must be done before corners (each corner swap
  also swaps UL/UB). Re-run that simulation if any setup changes.
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

## Working conventions

- Standard WCA move notation for all algorithms; mnemonic word shown
  alongside, never instead of.
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
