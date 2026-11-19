# 2026-11-19: Roux block practice built

Merged `ccr-38ff8fba-hsnn4k` (plan update only, section 11) and built `docs/roux-block-practice-plan.md`.

Built: `3x3/roux/practice.html` (Roux section page 3 "Block practice"), `js/block-solver.js`, `js/block-solver-worker.js`,
`js/roux-last-pair.js`, `data/roux-last-pair.js`, `css/roux-practice.css`; `colourNet` `{ only, marks }` options; home
Roux row quick links (Block practice, LSE map); Roux Blocks step points to the page.

Checks:
- `node log/2026-11-19-roux-block-practice-check.mjs` → ALL OK: hold; 1,000 scrambles first + second block (every
  solution solves, right moves, length = full BFS for 200; one move longer filtered and solving); full tables 5,322,240 /
  1,088,640 positions, longest 9 / 14, mean shortest 6.76 / 9.97; notes move by move; goals 1/3 against full BFS; goal 2
  outlines; parseMoves; tables ~0.5 s in Node, slowest search 1 ms (shortest) / 11 ms (with one move longer).
- `node log/2026-11-19-roux-last-pair.mjs --write` → ALL OK: 419 cases per square (21 x 20 - 1), 370 cards after
  grouping by U turn (185 per square; classes both on top 48, corner on top 72, edge on top 36, both elsewhere 214);
  finish and no-B finish lengths equal full BFS tables; via the top 114 cards; every drill setup + answer solves.
- Headless Chromium 390 / 1280 px: all modes, reveal, check (bad move, not solved), second block line, goal 2 picture,
  goal 3 both squares, last pair drill and cards, reload keeps mode, inspection countdown → close eyes → Done → goal
  pieces; no console errors, no sideways scroll.

Differences from the plan:
- Colour options (section 3) and check 5 not built: plan 11.8 keeps the fixed blue–white hold until the owner asks.
- Navigation: a page in the Roux `MENU` section (the site's current chrome), not a hand-written tab bar.
- Pieces are named by colour in the solving hold (blue–white edge, blue–red–white corner …), not DL / DFL.
- Table build was 2.5 s at a 4x CPU slowdown (over 1.5 s), so the solver runs in a module Web Worker (falls back to the
  page if workers fail).
- Last-pair card pictures use the flat net with only the first-block pieces coloured (same as the page), not the
  `['cube']` view.
