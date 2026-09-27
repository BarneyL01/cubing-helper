# 2026-09-27 — Self-hosted 3D view + F2L map

## Self-hosting cubing.js

- Installed `cubing@0.63.7` from npm and bundled `cubing/twisty` with
  esbuild into `js/vendor/cubing/` (`twisty.js` + 11 lazily loaded
  chunks, ~1 MB). Needed because the npm package imports other packages by
  name, which browsers can't resolve without a build step.
- Bundle contains only cubing.js (MPL-2.0 OR GPL-3.0-or-later, used under
  MPL-2.0, unmodified) and three.js (MIT). Licence notices and rebuild
  steps are in `js/vendor/cubing/README.md`; three.js's LICENSE copied in.
- `js/view-toggle.js` now imports the local copy. The site makes no
  requests to outside servers at all.
- First time the 3D view could be tested here (the CDN was blocked).
  Found it defaulted to white on top; added `z2` to the setup so it's
  yellow on top, green front, matching the pictures.

## F2L map

- Source: https://dogschasingsquirrels.files.wordpress.com/2014/06/f2l.jpg
  — not our work; credited on the page and in `data/f2l.js`. The sandbox
  couldn't download it, so the user pasted it in.
- Transcribed all 41 cases (1–42, with 37 = solved) and the 7 in-between
  steps (1b, 1c, 2b, 2c, 2d, 3b, 3c): each case's algorithm, its chart
  description, and which case its arrow points to.
- Extended the simulator/pictures for F2L:
  - `startHold()` in `js/cube-sim.js`: algorithms with y/d/etc. end with
    the cube held differently, so the starting hold is found by trying all
    24 holds. Steps you arrive at already turned (2b, 2c, 2d, 3b) get an
    explicit `hold: "y'"`.
  - `cube` view in `js/cube-diagram.js`: top + front + right faces, since
    F2L pieces can be down in the slot. `f2l` stickering greys last-layer
    pieces, like the chart.
- Checked by simulation: all 48 steps leave the cross and other three
  slots solved; every case's piece positions match its chart description
  ("edge in place, corner in U", etc.); all 41 cases are distinct.
- **One chart quirk:** case 42 `(R U' R' U)` → case 6 lands one U-turn off
  from case 6 as drawn, so following the arrows literally doesn't solve
  it. Doing 42's moves, then 6's, then skipping 2b's `U'` does, and that
  matches the chart's own picture of 42 exactly. Kept the chart's text and
  arrow, added a correct whole solution and a note on the card.
- Page: `3x3/cfop/f2l.html` — a map (one tree per final insert, linked)
  plus a card per case with picture, the chart's step, a "Then →" link and
  the whole solution. Linked from the CFOP page.
