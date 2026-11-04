# 2026-11-03 — 3-Style: core pictures by corner name

Owner asked for the group base pictures on both 3-Style pages to show corners by name with arrows,
kept consistent, unless the sticker letters matter for how the commutator works.

- Letters only decide how each corner ends up turned; that stays in each pair's details (two letter nets).
- Each core in a group now shows a see-through cube (`cornerDiagram` in `js/three-style-page.js`): all 8
  corners, the 3 moved ones named (U/D, F/B, R/L order) and joined by curved arrows in cycle order.
- The cycle starts at the first of UFR, UFL, UBL, UBR, DFR, DFL, DBL, DBR among its corners, so a core and
  its reverse show the same corners with the arrows turned round (e.g. `[R D2 R', U]` UBL → DFL → UBR,
  `[U, R D2 R']` UBL → UBR → DFL).
- Checked at 390 px, light and dark, both pages and Blind drills (imports the module): no console errors.

## 2026-11-04 — letter pictures back

Owner wants the sticker letters too (memorising needs the faces, since corners turn as they move). Each core now
shows the corner diagram and, under it, the letter net of its three stickers (as before), with the caption giving
both: e.g. `[R D2 R' , U]` cycles UBL → DFL → UBR, stickers E → U → Q. The letters start at the same corner as the
corner names. Checked at 390 px, both pages and Blind drills, no console errors.

## 2026-11-04 — Speffz only

Owner is learning Speffz and can't picture UFR-style names: the 3-Style pages and the 3-Style drill now name corners
by their top/bottom Speffz letter (A B C D on top, U V W X on the bottom): corner pictures, captions ("cycles corners
A → U → B"), pair steps ("onto sticker L"), parity (edges A and D) and the twist table (corner letters). The buffer is
always "the buffer" / C. Do not bring back UFR-style names in explanations to the owner either.

## 2026-11-04 — sticker letters only

"Corner V" is as hard for the owner as "DFR". Positions are now named only by sticker letters: the corner pictures
label each moved position with the sticker in the cycle, captions read "cycles E → U → Q", the twist texts say
"the B position". Explain moves the owner's way: "D' moves K into the G position, then the commutator moves
buffer → G → D".

## 2026-11-04 — pair explanations in the owner's words

Each pair's steps now read: "D' moves K into the G position. The buffer and D stay put." / "The commutator
[U' , R' D R] moves buffer → G → D." (when the buffer was moved: "Q (the buffer) → U → E"; Orozco bases are
named, e.g. "your Orozco H base") / "D takes G back to K. Net: buffer → K → D." Same wording in the Watch-it runner.
Checked on both pages (KD, UE, DH, UB, DG, LW, AF), no console errors.
