# 2026-10-06 — Mobile redesign

Implemented from the owner's approved mockup canvas and handover
(`Cubing Helper — mobile redesign`), scheduled for 11pm Sydney time.

## Answers to the handover's open questions (from the owner)
1. Header markup: **one shared JS include** (`js/site-chrome.js`).
2. Keep screen on: **off by default, last choice remembered** (localStorage
   `cubing-helper:keep-awake`).
3. Menu on phones: **full-screen panel**.
4. Desktop: **keep an inline grouped nav**; the Menu button is for smaller screens.
5. Picture index: **top of the page only** (each card has "↑ Index").

## What changed
- `js/site-chrome.js` (new): header, menu, breadcrumbs, "About this page", header
  height variable. Every page's duplicated `<header>` and footer was removed.
- `css/style.css`: header/menu/breadcrumbs/about, home rows, picture index, case
  layout, 19 px algorithms, 16 px Libby's, `--partial`, 44 px targets.
- `index.html`: grouped home with row cards and quick links; h1 is screen-reader
  only; footer note removed.
- `js/render-cases.js`: new card layout; Libby's directly under the algorithm;
  collapsed "Breakdown and notes"; ids on every card; `renderPictureIndex`.
- `js/view-toggle.js`: Keep screen on; `{ view: false }` for Megaminx.
- OLL, PLL, 2x2, Megaminx: picture index. Megaminx's "no 3D" note moved into
  About this page.
- "Ready" badges removed (the CFOP hub too).

## Differences from the mockup / judgement calls
- Desktop inline nav only from 1280 px; between 800 and 1279 px the Menu button
  is used (a wrapped nav was 90–190 px tall and sticky).
- The CFOP home card has a third quick link, **F2L map** (the handover listed
  OLL and PLL only); otherwise F2L would not be reachable from home any more.
- Megaminx has no pictures, so its index is a plain list of case names.
- The Uv case in 2-look OLL has only an alternative algorithm recorded; the
  alternative is now shown as its main algorithm (it would otherwise sit in the
  collapsed notes), and its note was reworded ("the alternative is shown until a
  main one is added"). No algorithm or case data changed.
- Exercise cards (`hideAlg`) keep their whole solution inside the hidden
  section as before.

## Checked
Playwright over all 13 pages at 390 and 1280 px: no console errors or failed
requests, no horizontal overflow, header sticky after scrolling; menu open/close
(button, Close, Esc), focus trap and return, all 13 menu links return 200; crumb
links; every picture-index link lands below the header, "↑ Index" returns;
Libby's visible and directly under the algorithm on all 14 OLL/PLL cards;
Keep screen on persists, is absent without the API and stays off when refused;
3D toggle still renders; no tap target under 44 px on the pages checked.
Earlier regression scripts (F2L finder and next-step pictures, BLD practice
keep-scramble, commutators, 8355, filmstrips, Libby's) pass.
