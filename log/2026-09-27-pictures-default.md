# 2026-09-27 — Pictures by default, 3D behind a toggle

- User asked for images by default instead of the rotating 3D view, a
  toggle between them, and whether the 3D view relies on someone else's
  hosting. Answer: yes — it's loaded from `cdn.cubing.net`, run by the
  open-source cubing.js project.
- Pictures are generated, not hand-drawn:
  - `js/cube-sim.js` — a small 3x3 sticker model (position + normal per
    sticker, moves as 90° layer rotations; 2x2 = the corners of a 3x3).
    Supports R L U D F B, M E S, wide moves, x y z rotations.
  - `js/cube-diagram.js` — applies the algorithm's inverse to a solved
    cube and draws the top layer (plus bottom for 2x2 PBL and Roux LSE) as
    SVG with side stickers. Stickering modes: full colour, OLL-style
    (yellow vs grey), CMLL-style (edges greyed out), EO-style for LSE.
  - `js/view-toggle.js` — "Pictures / 3D" switch on each page with cases,
    remembered in localStorage. The cubing.js script is only imported when
    3D is picked; if it fails to load, the page reverts to pictures with a
    message. Removed the always-on `<script>` tags from the five pages.
- Used the simulator to independently re-check every recorded algorithm:
  all 8 CFOP OLL cases leave the first two layers solved, all 6 PLL cases
  also leave the top oriented, all 7 shared corner-orientation cases leave
  the 2x2 bottom layer and both Roux blocks solved, all 5 PBL cases keep
  both layers oriented. Every OLL picture also matches the user's own
  recognition notes (Antisune yellow top-right, Sune bottom-left, H1
  up/down, U^ opens up, Uv opens down, etc.).
- Found: Beginner's "Match cross colours" (`R U R' U R U2 R' U`), which
  the user had flagged as possibly incomplete, swaps exactly the front and
  left top edges and leaves F2L alone — the standard beginner edge swap.
  Updated its note to say it looks complete.
- "Orient corners (final step)" got `noViewer`: it's repeated per corner,
  so a picture of one `R U R' U'` would show a position you never see.
- Verified in headless Chromium: default view makes zero requests to
  `cdn.cubing.net`, no console errors, blocked-CDN fallback works, a
  stubbed CDN swaps to 3D and back, and phone width (375px) has no
  horizontal scroll.
