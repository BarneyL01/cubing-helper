# 2026-10-01 — Blind practice keeps your scramble

Problem: going from the Practice tab to Reference (or anywhere else) and
back generated a new scramble, losing the one in progress. The scramble was
only in the page's own URL; the Practice tab link has no scramble in it, so
coming back through a link started fresh.

Fix (`3x3/bld/practice.html`):

- The current scramble is saved in the browser (localStorage key
  `cubing-helper:bld-practice`) and reused on every visit. A new scramble
  only comes from pressing **New scramble** or entering your own.
- **← Previous scramble** button: brings back the scramble you had before
  the last New scramble / own scramble (press again to go forward).
- "Hide letters" and the open/closed "Moves for each letter" list are kept
  too, so coming back mid-practice doesn't reveal the memo.
- A link with `?scramble=…` still loads that scramble (the one you had
  becomes "previous").
- Short note under the buttons: kept until you press New scramble.

Checked in Chromium: tab to Reference and back, Home → top menu → Practice,
reload, New scramble → Previous → forward again, link scramble then a plain
visit — scramble kept each time, hidden letters kept, no console errors.
