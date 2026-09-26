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
- `3x3/roux/index.html` — placeholder ("coming soon")
- `3x3/beginners/index.html` — placeholder
- `2x2/index.html` — placeholder
- `megaminx/index.html` — placeholder
- shared: `css/style.css`, `js/twisty-embed.js`, `data/` (per-page algorithm
  data as JS/JSON), `assets/` (static diagram images)

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
- **v2** — Full CFOP (F2L, full 57 OLL / 21 PLL) — TBD if wanted
- **v3** — Roux method
- **v4** — Beginner's (layer-by-layer) method
- **v5** — 2x2 (method TBD — Ortega/CLL vs. beginner LBL)
- **v6** — Megaminx (likely beginner LBL + 2-look OLL/PLL equivalents)

## Open questions / TBD

- GitHub Pages deploy source (root of default branch vs. a `gh-pages` branch
  vs. a Pages-deploy GitHub Action) — decide when the first PR is ready to
  merge/deploy
- Whether to build full OLL/PLL beyond the "struggle cases" — wait and see
- 2x2 and Megaminx method choice — ask when we get there
