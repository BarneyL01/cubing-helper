# Navigation redesign brief (2026-10-23)

The owner approved this design after reviewing a mockup. The mockup is `docs/nav-mockup.html`;
open it in a browser. The desktop design is the **"menu panel"** view (`drawerSite()` in the
mockup). The phone design is `phoneSite()` and `phoneMenu()`. The desktop **top bar** view
(`deskSite()`) was **rejected**, so do not build it.

Read `CLAUDE.md` first. This job is navigation and page structure only. Do not change any algorithm,
table data, picture, case or text content, apart from moving it between pages as described below.

## 1. Sections and pages (the new `MENU` in `js/site-chrome.js`)

Every page sits in exactly one section. Sections are not grouped by puzzle.

| Menu group | Section | Pages (label → file) |
|---|---|---|
| Methods | CFOP | Overview → `3x3/cfop/index.html`; 2-look OLL → `oll.html`; 2-look PLL → `pll.html`; F2L map → `f2l.html` |
| Methods | Roux | Reference → `3x3/roux/index.html`; LSE map → `lse-map.html` |
| Methods | Beginner's | one page |
| Methods | 8355 | one page |
| Methods | Heise (Partial) | one page |
| Methods | Marshall (Partial) | one page |
| Blindfolded | Blind | Overview → `3x3/bld/index.html`; M2 edges → `3x3/bld/m2.html` (new); Old Pochmann → `3x3/bld/old-pochmann.html` (new) |
| Blindfolded | Commutators | Basics → `3x3/bld/commutators.html`; Corner cycles; Corner table; After 8355 → `corner-8355.html` (merged, see §4); Twists & parity; Edge cycles |
| Practice | Practice | Recognition → `3x3/practice/recognition.html`; Blind memo → `3x3/bld/practice.html` |
| Other puzzles | 2x2 | one page (`2x2/index.html`) |
| Other puzzles | Megaminx (Partial) | one page |

Keep files where they are, apart from the new and merged pages, so that old links keep working.
The Blind Overview page also links to Blind memo practice in one line.

## 2. Global menu (tier 1)

- **Header (all widths):** a "☰ Menu" button, the brand "Cubing Helper" (links home), and
  "› <Current section>" (links to the section's first page). Remove the inline top nav from 1280 px and the
  breadcrumbs.
- **Desktop (≥ 900 px or so; choose a breakpoint and say which):** Menu opens a vertical panel on the left,
  about 340 px wide, over a scrim. It lists all four groups and every section.
  - One-page sections are single bold links.
  - Multi-page sections show a bold label with their pages indented underneath.
  - The current page is highlighted (`aria-current="page"`).
  - It closes with Close, Esc or a click on the scrim. Focus stays inside while it is open and returns to
    the Menu button when it closes. Page scroll is locked while it is open.
- **Phone:** Menu opens a full-screen accordion.
  - One-page sections are plain links.
  - Multi-page sections expand and collapse with +/− (a `button` with `aria-expanded`).
  - The current section starts open.
  - The same close and focus rules apply.
- Badges: "Partial" only, styled as now.
- The no-JS fallback stays: the Home link inside `<header class="site-header" id="site-header">`.

## 3. Page header, section row (tier 2) and "On this page" (tier 3)

- **Title:** a small kicker with the section name above the `h1`, and the page name as the `h1`. For
  one-page sections, the kicker can be omitted.
- **Section row:** this appears only on pages of multi-page sections. It sits under the title as a quiet row
  of the section's pages (at most 6 short labels), with the current one marked. It must look less prominent
  than the global menu: small text, no filled pills. It replaces the current `nav.tabs` bars on Roux,
  Blindfolded and the others. Build it from `MENU` in `site-chrome.js`; do not hand-write it per page.
- **On this page:** build it from the page's `h2.section-heading[id]` headings, with `data-short` as the
  short label when present. Add ids to headings that lack them.
  - **Phone:** one compact sticky control with a solid background (not translucent). It shows the current
    heading and opens the list of headings.
  - **Desktop:** a quiet list in a right-hand column that stays in view while scrolling.
  - It replaces `js/page-jump.js` jump bars, the `js/steps-page.js` sticky step bar, and any other pill bars.
    Keep the steps pages' previous/next links at the foot of each step only if they are already there; do
    not add new prev/next links anywhere.
  - Skip it on pages with fewer than 3 headings.
- Keep "About this page" (moved `.source-note`), the Pictures / 3D toggle and Keep screen on as they are.

## 4. Page splits and merges

- **Split `3x3/bld/index.html`:**
  - Overview keeps "Order" and "Letters", plus short links to the two new pages and to Blind memo practice.
  - `m2.html` gets "Edges — M2".
  - `old-pochmann.html` gets "Corners — Old Pochmann".
  - Move the sections as they are, including their data and scripts, and keep the existing section ids.
  - Old anchors on `index.html` that pointed at the moved sections should still reach them: a small script
    on index.html that redirects `#<old id>` to the new page is fine.
- **Merge `corner-8355.html` and `corner-8355-lb.html`** into `corner-8355.html` with one switch at the
  top: "Setups: R U F D only / Any face (L, B too)". The choice is kept in localStorage
  `cubing-helper:corner-8355`, and `?setups=lb` selects the other one.
  - Everything that differs between the two pages follows the switch.
  - Section 3 (place, then twist) currently exists only on the L/B page. Show it in both modes.
  - Make `corner-8355-lb.html` a tiny redirect page to `corner-8355.html?setups=lb`, keeping any hash.
- **Practice:** Recognition and Blind memo appear under Practice in the menu and in the section row. Blind
  memo's file stays where it is.

## 5. Home page and docs

- `index.html`: group the home page by the four menu groups, keeping one `.row-card` per section and the
  same style. Quick links: CFOP (OLL, PLL, F2L map); Blind (M2, Old Pochmann); Commutators (Corner cycles,
  After 8355); Practice (Recognition, Blind memo).
- Update `CLAUDE.md` (the "Page chrome" bullets, the BLD tab notes and the Recognition line), `docs/plan.md`
  and add `log/2026-10-23-nav-redesign.md` (what changed, the breakpoint, and what was checked).

## 6. Do not build

These were rejected: a find/search box, a header that hides on scroll, recent or pinned pages, a bottom bar,
new prev/next links, a picture index used as the table of contents, and keyboard shortcuts.

## 7. Checks before you finish

1. Bump `?v=N` (or add `?v=2`) on `css/style.css` and `js/site-chrome.js` in every page, plus any changed
   module, so the owner's phone does not keep old files.
2. Run every check script from the repo root, and confirm each still passes:
   - `log/2026-10-16-bld-check-planner.mjs`
   - `2026-10-16-bld-cycles-generate.mjs`
   - `2026-10-20-heise-examples.mjs`
   - `2026-10-21-bld-three-base.mjs`
   - `2026-10-21-bld-8355-corners.mjs` (and `--lb`)
   - `2026-10-22-8355-placing.mjs`
   - `2026-10-22-lse-eo-map.mjs`
   - `2026-10-22-marshall-check.mjs`
   - `2026-10-22-sassy-twist-check.mjs`
   - `2026-10-23-full-oll-pll-check.mjs`
   - `2026-10-23-recognition-check.mjs`
3. Serve the site with `python3 -m http.server 8765` and load **every page** in headless Chromium at
   390 px and 1280 px. Playwright is at `/opt/node22/lib/node_modules/playwright` and the browser at
   `/opt/pw-browsers/chromium`. Check for:
   - no console errors
   - no horizontal scroll
   - the menu opens and closes (Esc and the scrim)
   - the accordion expands
   - the section row and "On this page" are present where expected
   - the 8355 switch changes the content
   - the `corner-8355-lb.html` and old-anchor redirects work

   Save a few screenshots to `log/nav-redesign-shots/` (a phone menu, the desktop panel, one multi-page
   page at each width).
4. `git diff --stat`: confirm no data or algorithm content changed except for moves between pages.
5. Commit with a clear message. Do not merge to `main`.
