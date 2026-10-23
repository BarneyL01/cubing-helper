# 2026-10-23 — Navigation redesign

Built from the approved brief (`docs/nav-redesign-brief.md`) and mockup (`docs/nav-mockup.html`,
the "menu panel" view for desktop, `phoneSite()` / `phoneMenu()` for phones). The rejected top-bar
view (`deskSite()`) was not built. Navigation and page structure only: no algorithm, table data,
picture or case changed (`git diff --stat` shows nothing under `data/`).

## What changed

- **`MENU`** (`js/site-chrome.js`): four groups of sections; every page is in exactly one section.
  - Methods: CFOP (Overview, 2-look OLL, 2-look PLL, F2L map), Roux (Reference, LSE map; Partial),
    Beginner's, 8355, Heise (Partial), Marshall (Partial).
  - Blindfolded: Blind (Overview, M2 edges, Old Pochmann, Letter pairs), Commutators (Basics, Corner
    cycles, Corner table, After 8355, Twists & parity, Edge cycles).
  - Practice: Practice (Recognition, Blind drills, Blind memo).
  - Other puzzles: 2x2, Megaminx (Partial).
- **Header** (all widths): ☰ Menu, brand (home), "› <section>" (links to the section's first page).
  Breadcrumbs and the inline nav from 1280 px are gone.
- **Menu**: from **900 px** a 340 px panel on the left over a scrim, listing every section (one-page
  sections as bold links; others as a bold label with their pages indented). Below 900 px a
  full-screen accordion (multi-page sections open with a +/− button with `aria-expanded`; the current
  section starts open). Close / Esc / scrim click close it; Tab stays inside; focus returns to Menu;
  page scroll is locked; the current page is marked `aria-current="page"` and scrolled into view.
- **Title + section row**: on pages of multi-page sections, a kicker with the section name above the
  h1, the h1 is the page name, and a quiet row of the section's pages (small text, underline for the
  current page, no pills) after the subtitle(s). Replaces every hand-written `nav.tabs` bar.
- **On this page**: from `h2.section-heading` (ids added where missing; `data-short` = short label)
  and the steps of steps pages (`section.step[id]`, `data-short` / `data-num` set by
  `js/steps-page.js`). Phone: a sticky control with a solid background showing the current heading,
  which opens the list. From 900 px: a quiet list in a right-hand column (fixed, stays in view).
  Shown only with 3 or more entries; headings in a `[hidden]` part are left out; a MutationObserver
  picks up headings that page scripts add later (Letter pairs builds its 24 headings from its script).
  Replaces the step bar (`js/steps-page.js`) and the "Jump to" bars (`js/page-jump.js`, removed).
  The steps pages keep their existing previous/next links at the foot of each step.
- **Blind reference split**: `3x3/bld/index.html` is the Overview (Order, Letters, one-line links to
  M2 edges, Old Pochmann and Blind memo); "Edges — M2" (table + parity) moved to `m2.html`, "Corners —
  Old Pochmann" (tips, swap, table) to `old-pochmann.html`, with their data and scripts. The ids are
  kept (`bld-edges`, `edge-A`…, `bld-parity`, `bld-tips`, `bld-swap`, `bld-corners`, `corner-A`…); the
  h2s got `edges-m2` / `corners-old-pochmann`. A small script in index.html's head sends those
  anchors on index.html to the new pages. The source note's "edge B" link now points at `m2.html#edge-B`.
- **After 8355 merged**: `corner-8355.html` has one switch, "Setups: R U F D only / Any face (L, B
  too)", kept in localStorage `cubing-helper:corner-8355`; `?setups=lb` (or `?setups=rufd`) selects
  one, and switching updates the URL. The subtitle, source note, section 2 text, the count table, the
  setup table and the pair list follow the switch (each mode keeps its own "starts with" filter key, as
  before). Section 3 (place, then twist) shows in both modes. `corner-8355-lb.html` is now a tiny
  redirect to `corner-8355.html?setups=lb` keeping the hash (script, plus a meta refresh without JS).
- **Home**: grouped by the four menu groups, one `.row-card` per section, quick links: CFOP (OLL,
  PLL, F2L map); Blind (M2 edges, Old Pochmann, Letter pairs); Commutators (Corner cycles, After
  8355); Practice (Recognition, Blind drills, Blind memo).
- `?v=` bumps: `css/style.css?v=4` and `js/site-chrome.js?v=2` on every page, `js/steps-page.js?v=2`.
- Anchors land under the header (and the phone "On this page" control) through one CSS variable,
  `--anchor-offset`, set by `js/site-chrome.js` (replaces `--step-offset` / `--jump-offset`).

## Decided here (not spelled out in the brief)

- **Breakpoint: 900 px** for both the menu panel and the right-hand "On this page" column. With the
  column, `main` is up to 1220 px wide with 250 px reserved on the right (content stays about 930 px
  at 1280).
- One header layout at all widths (Menu button first, as the brief says). On phones under 420 px the
  header is a little tighter so "› Commutators" fits next to the brand at 390 px.
- Roux keeps its Partial badge (it has one now and in the mockup; the brief's table omits it).
- One-page sections keep their existing h1 ("3x3 — Beginner's Method" etc.) and get no kicker.
- The repeated section tagline "M2 for edges, Old Pochmann for corners, Speffz letters." was the
  shared tab header of every Blindfolded page; it stays on the Blind Overview only. On the LSE map, the
  Roux tagline above its own subtitle was dropped the same way (it stays on Roux Reference).
- After 8355, any-face section 2 text said "against the R, U, F, D tab"; that tab no longer exists, so
  it now says "against R, U, F, D only". In "R U F D only" mode section 3 has one added line: "These
  cards are the same for both setup choices: two of them use L2." (Two of the 12 place-then-twist cards
  use an L2 setup; no R U F D-only version was made, since that would be new algorithm content.)
- Blind drills and Letter pairs were added to the menu as asked (Practice and Blind sections) and to
  the home quick links; their content is unchanged.
- OLL, Recognition, Blind drills, Blind memo, the Blind Overview / M2 / Old Pochmann pages and 2x2
  have fewer than 3 headings, so they have no "On this page".

## Checked

- Every check script listed in the brief, plus `2026-10-23-bld-drill-check.mjs` and
  `2026-10-23-letter-pairs-check.mjs`: all pass (`2026-10-16-bld-check-planner.mjs` run against
  `git show a5bb6ac:js/bld-memo.js`: 500 same, 0 different; `2026-10-21-bld-8355-corners.mjs` with and
  without `--lb`: ALL OK).
- `log/2026-10-23-nav-check.cjs` (Playwright, headless Chromium) on all 26 pages at 390 and 1280 px:
  no console errors, no horizontal scroll, no old nav bars, section row exactly on the multi-page
  section pages, menu opens / locks scroll / keeps Tab inside / closes with Esc (focus back on Menu) and
  with the scrim (desktop) or Close (phone), accordion expands, the phone "On this page" list opens;
  After 8355 switch changes the count, setup and pair tables (place cards 12 in both), sets
  `?setups=lb` and survives a reload; `corner-8355-lb.html#list` → `corner-8355.html?setups=lb#list`;
  `index.html#edge-B` / `#bld-parity` → `m2.html`, `#corner-M` / `#bld-swap` → `old-pochmann.html`,
  `#letters` stays. Result: NO PROBLEMS.
- Screenshots in `log/nav-redesign-shots/` (phone menu, desktop menu panel, Corner cycles at both
  widths, Beginner's scrolled at both widths, After 8355 in any-face mode on a phone).
