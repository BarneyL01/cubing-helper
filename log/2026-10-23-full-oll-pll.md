# 2026-10-23 — Full OLL (57) and full PLL (21) lists

Owner asked for full OLL and PLL lists as sections, and for them in Recognition practice. Standard names
and notation only: no mnemonic words, no Libby's line on these cards.

## What was added

- `data/oll-full.js` (`ollFullCases`): 57 cases, named `OLL n — shape` (H, Pi, Antisune, Sune where those
  are the standard names; otherwise the shape from the J Perm list).
- `data/pll-full.js` (`pllFullEdgeCases` 4, `pllFullCornerCases` 17): standard `X-perm` names, with a
  description written from the simulated effect.
- `3x3/cfop/oll.html`: "Full OLL (57 cases)" section under the 2-look cards; picture index has both.
- `3x3/cfop/pll.html`: "Full PLL (21 cases)" section, with "Edges only" and "Corners" groups.
- `3x3/practice/recognition.html`: "Full OLL (57)" and "Full PLL (21)" sets. Both are off by default
  (tick them in Cases). Their solutions show no mnemonic and no Libby's line.
- `CLAUDE.md`: the exception to the mnemonic rule, and the scope line.

## Where the algorithms come from

The first option for each case in the J Perm OLL and PLL lists (jperm.net, `lib/oll.js`, `lib/pll.js`), with
parentheses removed. Where the list offered a choice, a version without whole-cube rotations was used
(Aa, Ab, E and Ja have none, so their x rotations stay). Not from the owner's notes.

## Checks

`log/2026-10-23-full-oll-pll-check.mjs` (run `node log/2026-10-23-full-oll-pll-check.mjs` from the repo root):

- OLL: all 57 keep the first two layers solved (checked on the inverse, the case). All 57 top-face colour
  patterns differ (up to a turn of U), none solved.
- PLL: all 21 keep the first two layers solved, the top layer oriented in the case, and the 21
  arrangements differ (up to a turn of U), none solved.
- A mutated copy of one algorithm makes the check fail, so it is not passing trivially.
- Recognition practice run in headless Chromium with only the two full sets ticked: cases and solutions
  show with no mnemonic and no Libby's line. The OLL and PLL pages load with no console errors.

## Open point

The checks say the E-perm alg (J Perm's E) swaps two pairs of adjacent corners on opposite sides. J Perm's
group label and a forum post call E a diagonal swap. The description on the card follows the simulation.
Worth a look on a real cube.
