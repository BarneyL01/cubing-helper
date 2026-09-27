# 2026-09-27 — F2L in the top menu + case finder

- Added "3x3 · F2L" to the top menu on every page and an F2L card on the
  home page; removed the F2L card from the CFOP page (per request).
- Added a "Find a case" panel to the F2L page (`js/f2l-finder.js`):
  - One-tap filter rows: **Pieces** (both on top / corner in slot / edge in
    slot / both in slot), **Corner's white sticker faces** (up / front /
    right / down), **Edge** (on top with front or right colour up / in
    slot correct / in slot flipped), **Pair** (already joined / touching /
    apart). Each chip shows how many cases it would leave; chips that
    would leave none are disabled.
  - Chart-category dropdown and free-text search (case number, moves, or
    words like "flipped", "twisted", "white up").
- The features are computed from the simulated case (`js/f2l-features.js`),
  not typed in. Checks: the Pieces groups come out as 24 / 6 / 6 / 5,
  exactly the chart's own groupings (1–24, 25–30, 31–36, 38–42). All four
  filters together narrow any case to at most 2.
- Dropped a "corner above the slot" filter I tried first: the chart always
  draws a top-layer corner above its slot, so it matched all 30 of those
  cases and was useless.
- Following a "Then →" or map link to a case the filters are hiding
  clears the filters. Moved the map below the cases.
- Layout: added a global `[hidden] { display: none !important }` (cards'
  own display rules were overriding it); filtered F2L cards keep their
  size; on phones the menu (now 7 links) no longer stays pinned.
