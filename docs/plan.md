# Cubing Helper — Project Plan

## Goal

A quick-reference / cheat-sheet site (not a timer, not a trainer) for
recalling how to solve the Rubik's cube family: 3x3 (multiple methods), 2x2,
Megaminx. Hosted free on GitHub Pages.

## Decisions made (2026-09-26)

| Question | Decision |
|---|---|
| Tech stack | Plain HTML/CSS/JS, no build step |
| Graphics | Interactive 3D twisty player + static 2D diagrams |
| V1 scope | 3x3 CFOP: just the OLL/PLL cases in the user's notes |
| Other methods (Roux, Beginner's, 2x2, Megaminx) | Placeholder pages/nav now, content later |
| Mnemonics | Custom letter-substitution cipher, decoded in `docs/mnemonics.md` |

## Site structure (v1)

- `index.html` — landing page, links out to each puzzle/method
- `3x3/cfop/oll.html` — 2-look OLL cases
- `3x3/cfop/pll.html` — 2-look PLL cases
- `3x3/roux/index.html` — CMLL done (shares the same 7 cases as Ortega's
  OLL); block building and most of LSE still placeholder
- `3x3/beginners/index.html` — last layer done (match cross colours, match
  corners, orient corners); cross/corners/second-layer still placeholder
- `2x2/index.html` — Ortega: OLL and PBL done, all 7 OLL cases recorded
- `megaminx/index.html` — Gray star, align star, and Gray corner notes
  recorded; no interactive 3D preview (see Open questions)
- shared: `css/style.css`, `js/algs.js`, `js/render-cases.js`, `data/`
  (per-page algorithm data as ES modules — `data/corner-orientation.js`
  holds the 7 corner-orientation cases shared by Ortega and Roux CMLL)

## Per-algorithm content

Each case shows:

- Case name + when it applies (with orientation note, e.g. `^` = alternate
  orientation from the base case)
- Standard WCA algorithm
- The user's mnemonic word + letter breakdown
- Static 2D diagram image
- Interactive 3D twisty player preview
- OLL only: what the case turns into once you finish 2-look OLL (per the
  user's table) and any alt algorithm + memory-story notes

## Roadmap

- **v1** — CFOP 2-look OLL/PLL (the content in the user's notes); placeholder
  pages for everything else
- **v1.1** — Beginner's Method last layer (match cross colours, match
  corners, orient corners) — done
- **v2** — Full CFOP (F2L, full 57 OLL / 21 PLL) — TBD if wanted
- **v3** — Roux: CMLL — done; block building and full LSE still to come
- **v4** — Beginner's Method: white cross, white corners, second-layer edges
- **v5** — 2x2: Ortega (OLL + PBL) — done
- **v6** — Megaminx: Gray star / align star / Gray corners — done (last
  layer only so far); still needs a 3D preview and earlier steps

## Open questions / TBD

- Whether to build full OLL/PLL beyond the "struggle cases" — wait and see
- Megaminx method choice for the earlier steps (first layer, etc.) — ask
  when we get there; last layer is settled/recorded
- Static 2D diagrams per case are deferred (see `log/` for why) — the
  interactive 3D twisty player is the accurate visual for the cases that
  have one
- OLL "Uv" case has no primary algorithm recorded (only the alt) — add one
  if/when the user finds a main algorithm they prefer
- Beginner's Method "Match cross colours" algorithm was flagged by the user
  as possibly incomplete when they wrote it down — worth confirming against
  an actual solve
- Megaminx has no interactive 3D preview: cubing.js's twisty-player doesn't
  use plain cube (R/U/F) notation for a megaminx, and this session's
  network can't reach `cdn.cubing.net` to check what it does use — figure
  out the right notation and wire it up when that's confirmed
- Roux LSE "4-edge recognition" terminology ("2o/2", "4c") is recorded as
  the user described it, but wasn't independently cross-checked the way
  the OLL/PLL/CMLL algorithms were — flag if any of it reads wrong

## Deploy

Live at https://barneyl01.github.io/cubing-helper/, deployed by
`.github/workflows/deploy-pages.yml` on every push to `main` (it
auto-configured the Pages source on its first run — no manual settings step
turned out to be needed). Feature-branch work gets merged to `main`
automatically once verified locally — see CLAUDE.md's "Branch workflow".

## v1 status

Built: `index.html`, shared `css/style.css`, `js/algs.js` (WCA-notation
algorithm helpers) + `js/render-cases.js` (renders a case list into cards
with an embedded `<twisty-player>`), `data/oll.js` + `data/pll.js` (decoded
algorithm data), the CFOP OLL/PLL pages, and placeholder pages for Roux,
Beginner's, 2x2, and Megaminx.
