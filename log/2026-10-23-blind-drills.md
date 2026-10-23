# 2026-10-23 — Blind drills and letter pairs

Owner's choices: drills 1 (letter scheme), 2 (tracing), 3 (memo) and 5 (small solves with a chosen
number of unsolved corners/edges); tap to reveal; no score; a separate page of letter-pair words with
"sh" for X, colourful words, no two too similar.

- `3x3/practice/blind-drills.html`: four modes (Letters, Tracing, Memo, Small solves). Settings and the
  current item in localStorage `cubing-helper:blind-drills`. Styles in `css/drills.css`.
- `js/bld-drill.js`: scrambles with exactly N corners and M edges unsolved (corners 0, 2-8; edges 0, 2-12).
  No 3x3 solver on the site (owner chose option A): random commutators, twists and flips from
  `data/corner-cycles.js` / `data/edge-cycles.js` (edge rows with E or S turns left out; M kept) are
  combined until the counts match, then reversed. Odd swaps come from the corner parity step. With 16+
  unsolved pieces a plain random 20-25 move scramble is used when one matches.
- Check: `node log/2026-10-23-bld-drill-check.mjs` — 20 scrambles for each of the 95 possible count pairs
  (1,900): exact counts, centres solved, and the M2 / Old Pochmann solution from `js/bld-memo.js` solves
  each one. ALL OK. Mean scramble lengths: small drills 10-45 moves (e.g. 3 corners 10, 4 corners 26,
  3 corners + 4 edges 36); large counts are long (6 corners + 6 edges about 86; 8 + 8 about 135), apart
  from the near-full cube cases (20 moves).
- `data/letter-pairs.js` + `3x3/bld/letter-pairs.html`: 552 words, our own. Check:
  `node log/2026-10-23-letter-pairs-check.mjs` (each word starts with the first letter, X = "sh", has the
  second letter after it, no duplicates, no shared 5-letter stems). ALL OK.
- `js/bld-net.js`: `bldNet(kind, { letters: false })` draws the net without letters.
- Headless Chromium at 390 and 1280: no console errors, no horizontal scroll, memo hides after its time,
  552 pairs listed.
- Not done yet: menu entries (Practice → Blind drills, Blind → Letter pairs) and home links, waiting
  for the navigation redesign.
