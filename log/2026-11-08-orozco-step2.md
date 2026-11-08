# 2026-11-08 — Orozco step 2

Owner found full 3-style endless and asked for a bounded "step 2" after Orozco. New page `3x3/bld/orozco-step2.html`
(first page of the 3-Style menu section), `js/orozco-step2.js`, data `data/orozco-step2.js` from
`log/2026-11-08-orozco-step2.mjs --write` (ALL OK: every entry a pure buffer 3-cycle; setups keep the buffer and the
other target and move the letter into the base position).

- Idea: L turns never touch P (or the buffer), so P plays B's part. Step 2a = the P family `[R U R' , D/D'/D2]`
  (positions L, T, H, like O H L): P with L, D (L), R (L2), X (L'); T; H, G (L), F (L2), E (L') — 18 pairs.
- Step 2b: `[R' D' R , U2]` / `[R' D' R , U']`: P with A, I (L'), S (L), U (L2); A or D with L (D), T (D'), H (D2) —
  20 pairs. All setups one turn at most; mean 9.3 / 9.8 moves.
- Frequency (5,000 solves): step 1 (B pairs) 48% of solves / 0.53 pairs; 2a 13% / 0.13; 2a+2b 34% / 0.38.
- Page: the idea (step 1 vs 2a table), frequency table, one section per base (base cube, "Into" cube, letter/setup
  table, pairs both ways with the usual pair details), Practise links.
- 3-Style solves: "Pairs from" By base groups / Orozco step 2a / 2a + 2b; `?preset=step2a|step2`. Step 2a pairs all
  use P, so the trainer fixes 1 pair per solve there. Trainer checker extended (step 2 pools), ALL OK.
- `intoDiagram` now exported from js/three-style-bases.js.
