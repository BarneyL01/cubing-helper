# 2026-11-18: Four helpers in Blind drills (Small solves and Tracing)

Owner asked for small-solve scrambles that test level 2 pairs and the exception pairs (Qig round: add a four-helper
method; pick pairs by ticked kinds, lower levels as options; edges and parity as now; a new twist setting).

- Corners solved with: new choice "Four helpers (B, D, F, K)" (`?corners=four`). Settings: kinds Level 0 / 1 / 2 /
  Exceptions (8) (a pair counts if its level is ticked, or it is an exception and Exceptions is ticked), Pairs 1-3,
  Twisted corners Sometimes / Always / Never; Edges (pieces) and Parity as before. Saved as `four` in
  `cubing-helper:blind-drills`.
- `js/four-helper-drill.js`: `fourHelperPlan` (memo from C, rule commutator per pair, `best` for exceptions, same-corner
  pairs letter by letter plain Orozco, odd last letter plain Orozco + Ra; same plan as the whole solves in
  `log/2026-11-18-pair-rule.mjs`) and `fourHelperScramble` (pairs on different corners undone with the 3-Style page's or
  Dylan's commutator, + odd letter + Ra, + a two-corner twist, + edge pieces; every scramble checked).
- Limits: the 8 exception pairs use only 5 corners, so at most 2 exception-only pairs; 3 pairs + a twist (or + parity and
  a twist) need more than 8 corners. The page says so.
- Moves table: one row per pair (rotation, commutator as seen, as held; exception shows the rule's longer one too), linked to Pair lookup.
- Check: `node log/2026-11-18-four-helper-drill-check.mjs` → ALL OK (1,211 scrambles over random settings, 289
  refused as impossible; every memo starts with the chosen pairs of the ticked kinds, parity/twists/edges as asked,
  the plan solves it; plus 2,000 random scrambles solved by the plan).
- Also recorded "Qig" (questions if gaps) in CLAUDE.md.

## Same day: original lettering in rotated pictures; base names

Owner: on Which group?'s exception I → R the steps said R moves "to O" (the position as seen after y') while the pair
uses helper K. Now, for F and K pairs, every position in the pair pictures, steps and "Watch it" text is named by the
sticker letter that is there on a solved cube (letters move with the cube): I → R reads "L D2 F' moves I into the A
position and R into the K position", base "helper K's A base, Position first: buffer → A → K".
- `js/three-style-page.js` (v=17): `originalAt(rot, pos)`; `pairBody` names positions with it; optional `e.baseName`.
- `js/which-group.js` (v=3): `baseNameOf(e)` names the base from the 12-bases table (Position first / Helper first);
  exception steps say where the setup puts each letter.
- Checked: for all 300 rotated rows (rule, best, bufferMove) `originalAt` of every seen spot equals the as-held spot.

## Same day: Orozco page brought in line with the helper pages

`3x3/bld/orozco.html` gained, as on the helper D / F / K pages: "The idea, and the other helpers" (a table of the four
helpers B, D, F, K and the bases / D-turn / pair-with-B notes), "By position: what goes where" (per base O, H, L: the
see-through cube of the base `coreFigure`, the "Into" picture `intoDiagram`, and a table of setup + forwards / backwards
for its letters), and "Practise" (links to Small solves with Orozco / four helpers). The existing sections (examples,
the 18 commutators with published alternatives, helper letters, parity, shortcuts) are unchanged. No new algorithms: the
rows come from `data/orozco-corners.js`; backwards = the base's halves swapped, same setup.

## Same day: up to 5 pairs (engine rebuilt)

Owner: why only 3 pairs? With every pair on its own corners, the buffer + 4 pairs needs 9 corners; 4+ pairs need a cycle
break, which the first engine never made. The engine now builds the memo letter sequence itself, following the memo's
rules (the buffer's cycle, then breaks at the lowest unsolved piece in letter order; a twisted corner = a break straight
back to another sticker of it), keeps it only if every pair of two corners is of a ticked kind, then undoes the solve
(other tables' commutators; twist pairs and the odd letter plain Orozco, + Ra) and checks it on the simulated cube (memo
exactly the sequence, twists as asked, edges, the plan solves it). Pairs 1-5; "Pairs" now counts every pair in the corner
memo, including a twisted corner's two letters (done letter by letter). Impossible settings are refused with a reason
(e.g. level 2 only: its letters are on 6 corners, so at most 3 pairs without twists).
Check: `log/2026-11-18-four-helper-drill-check.mjs` → ALL OK (1,259 scrambles, 1-5 pairs; 241 impossible settings refused).
