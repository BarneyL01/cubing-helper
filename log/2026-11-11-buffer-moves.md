# 2026-11-11 — Buffer moves page

Owner: the hard letters (I, V, Q, U) are long with the walk rule; B in a base is not acceptable; build a page for the
hard-letter pairs that lets the buffer move, and scan the other pairs for big simplifications (e.g. 3-move setup → 1).

- Why the hard letters are hard (worked out, see the chat): D/L/B setups barely move them (I: only L; 3 turns from every
  helper), and no 8-move base with the buffer contains I, N or V. A fourth helper (best: Q) clears the exceptions but only
  saves ~0.3 setup moves on I/V. The bottleneck is the base set: every base with D/L/B setups ≤ 2 gives 9.8 moves on hard
  pairs; the U family `[R/L B^k R'/L' , F2]` helps (12.6 → 11.1) but has B in the base (rejected).
- Full 3-style's answer: setups of R/U/F move the buffer (126 of 132 hard pairs on 3-Style (ours)), mostly Orozco's
  `R D2 R'` against U2 / U / U′. No B.
- **Page** `3x3/bld/buffer-moves.html` (Orozco helpers section, "Buffer moves"): the idea with I → U `[R : [R D2 R' , U2]]`
  (R moves the buffer into the Q position); 110 hard pairs (of 132) shorter than the walk rule, grouped by base (18
  groups), filter All / Saves 2+ (74; `cubing-helper:buffer-moves`); 20 other pairs with the setup 2+ moves shorter or 4+
  moves saved: 14 with one F/F′/U setup that moves the buffer, 6 with no setup (AG AS GA SA with `[R' D^k R , U2]`, PT TP
  with `[R U R' , D']`); and the 22 hard pairs to keep on the walk rule. Pair rows reuse `pairRow` (pictures, runner) with a
  chip "buffer to Q · walk 12 → 9".
- Data `data/buffer-moves.js` from `log/2026-11-11-buffer-moves.mjs --write`: every commutator (ours and walk) checked as a
  pure 3-cycle of the right pair; no B. Hard pairs 13.5 → 11.2 moves; other 20: 13.5 → 9.4.
- `js/buffer-moves.js`; menu entry in `js/site-chrome.js` (`site-chrome.js?v=15` on every page).
- Not done: whole solves mixing the walk rule and these; a trainer preset.
- Checked at 390 px in headless Chromium: no console errors, no sideways scroll.
