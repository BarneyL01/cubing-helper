# 2026-11-02 — 3-Style corners page

Owner shared Dylan's (J Perm's) 3-Style Learning Sheet and asked for the corners as a new page. The saved web page
held only the 2-Flips tab and the PDF print cut 329 of 416 corner cells short; another agent then downloaded the
sheet as .xlsx + one CSV per tab (branch claude/awesome-hawking-nw1imf). The two corner tabs are copied to
docs/sheets/3-style/ (UFR-Comms.csv, UFR-Types.csv).

`log/2026-11-02-3style-corners.mjs --write` builds data/three-style-corners.js: columns are the 1st target, rows the
2nd; each cell expanded ([A : B], [A , B], nested; R2' read as R2) and checked to cycle C -> 1st -> 2nd -> C and
move nothing else. 378 pairs, 8-18 moves (mean 12.03). 11 cells fixed and marked on the page:
NI, IN missing "]"; EQ extra "]"; KW R'->R (= the sheet's WK backwards); TN, NT inner R' D R -> R' D' R; WL setup
D' -> D; AI setup r -> l'; GH also moved edges (used the sheet's HG backwards); SI did the pair in the other order
(halves swapped); UW empty in the sheet (the sheet's WU backwards).

Page `3x3/bld/three-style-corners.html` (menu Blindfolded › "3-Style", home row): how to read the notation, 1st-target
letter buttons (saved in `cubing-helper:3style-corners`), list of the 18 pairs for that letter (net with both
targets, notation, the sheet's type, move count, moves written out), order by letter / type / length,
`#pair-XY` links, and the list of fixes. Not added yet: the sheet's Parity, 2-Twists, 3-Twists and edge tabs; no
mnemonics (378 algorithms). Checked in headless Chromium at 390 px (no errors).
