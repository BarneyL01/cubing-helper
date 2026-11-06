# 2026-11-06 — 3-Style families: shared table and "why" pictures

- `js/three-style-families.js` (`mountFamilies(slot)`) now holds the "Which base?" family table, rules and
  "which letter comes first" table; used on the By base page (replacing its static copy) and, in a collapsed
  "Which base? The four families" box, on 3-Style solves (owner asked).
- New: one picture per family (see-through cube): the position the insertion swaps (outlined), its three partners
  chosen by the D turn (solid arrows), the position(s) the interchange brings in (dashed), buffer in blue.
- Checked by simulation before drawing: R D R' swaps B with W/X/U corner (O D, H D', L D2); R' D R swaps the
  buffer's position with U/V/X corner (G D, P D', S D2); R U R' swaps P's position (V corner) with the buffer's;
  U' brings C into B and D into C; U2 brings A into C; D brings L, D' T, D2 H into P's position.
