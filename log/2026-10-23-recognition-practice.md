# 2026-10-23 — Recognition practice page

Owner's idea (from a YouTuber): a 3D cube shows a case for a set time, then changes, for recognition
practice. Owner's answers: sets 2-look OLL + 2-look PLL + Roux CMLL (checkboxes, all three), random
top-layer turn, solution = name + algorithm + mnemonic (Libby's line on OLL/PLL), shown for a
configurable time (default 3 s, optional), a general practice entry (menu item + home row under 3x3).

- `3x3/practice/recognition.html`: settings (sets, case time default 30 s, show solution + its time,
  random turn), Start/Stop, Next case now, Keep screen on, timer bar. Cases drawn from a shuffled bag (no
  repeat back to back). Settings hidden while running so the cube is near the top on a phone.
- 3D: cubing.js loaded with the page, yellow on top (setup `z2`, as on the case cards); picture fallback
  if it fails. `control-panel="none"` left the cube undrawn in testing; `bottom-row` works.
- Check: `log/2026-10-23-recognition-check.mjs` — every case x every top-layer turn: the position shown
  is solved by the solution shown. 84 combinations, all OK.
- Fix (owner saw no 3D on their device): a fresh twisty-player for every case instead of changing one player's attributes (that did not redraw reliably), and a solved cube shown as soon as 3D has loaded, before Start.
- Second fix: still no 3D on the owner's phone, so the page no longer uses cubing.js. New `js/cube-3d.js` draws a still isometric picture (top, front, right faces, shaded) as SVG from the simulator state; the page shows a solved cube before Start.
- Added: mirrors of the hidden left and back faces (floating out beyond the cube, as cubing.js shows them) in `js/cube-3d.js` (`mirrors` option, on by default); a "Show solution" button (shows it until the next case); big buttons (Start/Stop full width, red when running; Show solution and Next case side by side, 60 px tall).
