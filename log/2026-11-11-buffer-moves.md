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

## Rebuilt on the owner's 9 bases (same day)

Owner: "I thought it was move the buffer but still use the same algs?" — the first version used the 3-Style (ours)
commutators, and only 26 of its 130 pairs used one of the 9 bases. Rebuilt: only the 9 bases (and their halves swapped),
setups up to 3 moves; the shortest with R U F D, or with L or B when that is at least one move shorter (owner: "a single
step less will still mean L and B is worth it"). The generator now searches itself (no longer reads three-style-ours).

- Hard pairs (I V Q U): 104 of 132 shorter than the walk rule, 13.4 → 11.3 moves (80 save 2+); 28 keep the walk rule
  (IU among them: 12 either way). Other pairs: 32 with 3+ moves saved or the setup 2+ moves shorter, 13.9 → 10.2.
- 42 pairs use an L or B setup. Where the buffer ends up after the setup (136 pairs): another corner 94, its own corner
  twisted (J or M) 20, not moved 22 (the walk rule is a rule, not always the shortest).
- Bases used for the hard pairs: Orozco L `[R D2 R' , U']` 32, helper D's S `[R' D2 R , U']` 26, then helper P's bases.
- Example on the page: U → E `[R U : [R D2 R' , U']]` (9 moves, walk rule 14): R U puts the buffer in the M position;
  the L base read from the M sticker is M → U → Q.
- Chips now say which helper's base: "buffer to M · helper B base · walk 14 → 9 · L/B setup".

## Pair lookup page; finder removed from Walk rule (owner: two pages were confusing)

- New `3x3/bld/pair-lookup.html` (Orozco helpers, "Pair lookup"; section now at 6 pages, the limit): two selects + Swap,
  `?pair=`, saved in `cubing-helper:pair-lookup` (falls back to the old walk-rule key). Shows the Buffer moves commutator
  when the Buffer moves page lists the pair (steps: setup, base read from the moved positions, undo; pair row with
  pictures and runner), else the walk rule's explanation (exceptions included); the other method in one line below.
- Walk rule page: "Find a pair" removed (a note links to Pair lookup); `walk-rule.js?v=4` exports `walkPairFor`,
  `explainWalk`, `walkLetterList`, `sameCorner`. `buffer-moves.js?v=3` exports `bufferMoveFor`, `explainBufferMove`.
- `site-chrome.js?v=16` on every page; `style.css?v=38` on pair-lookup.html (`.pl-tag`).
- Checked at 390 px: GO (walk), UE (buffer moves), PT (buffer stays), IK, IU (exception), DF (same corner); Walk rule and
  Buffer moves pages still load; no console errors, no sideways scroll.

## Pair lookup: "How to remember which way a pair goes" (2026-11-12)

Owner: base pairs and one-turn walks are obvious; the rest are not. Added under the finder (`mountMemory` in
`js/pair-lookup.js?v=2`), all worked out from the same data as the lookup:
1. Walk rule or buffer moves: pairs with I V Q U → buffer moves, except any two of I U V, I with L P, V with B X,
   Q with D R W, U with A H N R (14 letter pairs); other pairs → walk rule, except any two of A F G / F G K / F K S /
   R S W and GW KL NR PT ST WX (16). A pair and its reverse always go the same way (now checked by the generator,
   with the same setup and base).
2. Which letter walks: every letter's walk by number of turns (ties: either works; no simple tie rule exists —
   helper order B > P > D predicts only 54 of 72).
3. Buffer moves: which base, letter pairs per base (68 letter pairs, 60 different setups: no setup pattern to teach).
Checked at 390 px: tables fit, no console errors.
