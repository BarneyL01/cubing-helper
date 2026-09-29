# 2026-09-29 — Beginner's method page rework

Request: make the beginner's method cleaner and more logical, with headings
that let you move to the next step.

## Page

- One numbered section per step (1–7), each with: step number, title, a
  source tag ("Standard method" for 1–4, "Your notes" for 5–7), a one-line
  goal, numbered "how" instructions, the case cards, and a footer with
  ← previous step / All steps ↑ / next step →.
- Sticky step bar under the site header with short labels (Cross, Corners,
  Middle edges, Yellow cross, Match edges, Place corners, Twist corners);
  highlights the step being read. Scrolls sideways on phones.
- Cards no longer repeat "Standard beginner's method — not from your notes"
  on every card — the step's tag says it once.
- Yellow cross cards now in the order you meet them: Dot → L → Line, and
  Line links on to Step 5.
- Data merged into `data/beginners.js` (`beginnerSteps`); the two old files
  (`beginners-first-layers.js`, `beginners-last-layer.js`) are removed.

## Content added / corrected

- Step 5: added your notes that had been left off — "Back Right (if 2
  matching)" and the mnemonic RUPU RU2P U = **Ugly-Loopy-U**. Recognition
  written out: two neighbouring edges match → hold them back and right; two
  opposite → do it once from any side first.
- Step 6: written out what to do with no correct corner (do it once from
  any side — one will then be correct) and that it takes at most two goes
  with one correct.
- Step 7 **correction**: the old card said to turn the top layer between
  corners. With `R U R' U'`, that breaks the cube — the simulation shows it.
  Your notes say "put on bottom": turn the cube over (yellow on the bottom),
  hold the unsolved corner at the bottom front-right, Sassy 2 or 4 times,
  then turn the bottom layer to the next corner.

## Checks (js/cube-sim.js, under Node)

- Steps 5–7 recipes run on 3,000 random last-layer states (built from the
  step 5/6 algorithms and U turns, first two layers solved): all solved.
  Step 5 took at most 2 algorithms, step 6 at most 3 (0 correct → 1 → up
  to 2 more), step 7 took 0, 2 or 4 Sassys per corner.
- Every picture shows a valid starting position (previous step's goal met).
- Browser (Playwright/Chromium): 7 sections, 15 cards, 12 pictures, no
  console errors, no broken in-page links, next/step-bar/"Then" links land
  below the sticky bar with the right step highlighted (including step 7 at
  the bottom of the page), no sideways scroll at 375px, 3D view works.
