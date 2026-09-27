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
- Graphics: interactive 3D cube via a twisty-player web component
  (cubing.js / alg.cubing.net's `<twisty-player>`), paired with static 2D
  diagram images for quick scanning without waiting on JS/animation.

## Repo layout

- `/` — site source (HTML/CSS/JS/data/assets)
- `docs/` — planning docs: scope, site structure, content roadmap, decisions
- `log/` — dated progress-log entries (one file per session/milestone)
- `CLAUDE.md` — this file

## Content scope (v1)

3x3 CFOP only: the specific 2-look OLL and PLL cases from the user's original
notes (OLL: Antisune, Sune, H1, L^, Pi1, T1, U^, Uv. PLL: Y-perm, T-perm, Ua,
Ub, H, Z). Nav includes placeholder ("coming soon") pages for Roux,
Beginner's Method, 2x2, and Megaminx, to be filled in later.

Beginner's Method now also has its last-layer steps (match cross colours,
match corners, orient corners) — see `data/beginners-last-layer.js`. Its
white cross / white corners / second-layer steps are still placeholder.

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
before (e.g. a flexbox overflow clipping long algorithms). `cdn.cubing.net`
is blocked from this sandbox's network, so the `<twisty-player>` 3D preview
itself can't be visually verified here — everything else on the page can.
