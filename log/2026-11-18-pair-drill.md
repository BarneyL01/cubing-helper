# 2026-11-18: Pair drill

New practice page `3x3/practice/pair-drill.html` + `js/pair-drill.js` (+ small `.pd-*` styles in `css/drills.css`, now `?v=8`). Menu not touched (lead adds it).

- One random pair from `data/pair-rule.js`, shown as big letters. "Next step" reveals 5 steps: (1) level, helper, letter into the helper's place, rotation for F/K; (2) the turn(s) as seen after the rotation; (3) where the other letter is now (level 2: the in-between letter); (4) its setup (`setupSeen` minus the turns); (5) the commutator as seen (rotation · [setup : core] · back), move count, exception note, held form as a small line, then the pair's cube pictures (`pairRow`, opened). "Show all", "Next pair".
- Exceptions show `best` (with its own rotation) and the note that the rule gives a 4-move setup.
- Filters: levels 0/1/2 (default 1, 2), helpers B/D/F/K (all), exceptions only. Picks are uniform over the filtered list, never the same pair twice running.
- State (pair, steps shown, filters) in `cubing-helper:pair-drill`; `?pair=QT` opens that pair. Keep screen on via `mountViewToggle(..., { view: false })`.
- Pure step functions (`stepsFor`, `poolFor`, `pickPair`, ...) are DOM-free; `mountPairDrill` does the DOM.

Checker `log/2026-11-18-pair-drill-check.mjs`: all 378 pairs have 5 steps; turns put the walked letter into the helper's place (via the in-between letter on level 2) and the other letter at `otherNow`; held setup = turns + row setup; seen setup = seen turns + row setup (seen); rotation + seen form = held moves; the shown answer (rule or `best`) is a pure 9-sticker 3-cycle buffer -> first -> second; all 256 filter combinations give the expected pool (95 are empty and handled: Next pair disabled, "0 pairs match"). Prints ALL OK.

Browser check (390 px, Playwright): `?pair=QT`, `AF` (F), `VW` (exception) step through to the pictures; filters, reload keeps pair/steps/filters; no console errors; scrollWidth 390.
