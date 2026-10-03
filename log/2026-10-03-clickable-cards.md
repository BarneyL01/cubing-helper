# 2026-10-03 — Whole method cards are clickable

Request: make the cards on the home and CFOP pages clickable, not just the
"Open →" link.

- `css/style.css`: the card's link now stretches over the whole card
  (`.method-card a::after`, card is `position: relative`). Hover gives the
  card an accent border and shadow; keyboard focus shows a ring around the
  whole card. Cards without a link ("Full OLL / PLL — Coming soon") are
  unchanged. No HTML changes needed — any future card with a link inside
  it behaves the same.
- Checked in Chromium: for all 7 home cards and both CFOP cards, a real
  mouse click on the heading text goes to the card's page; the "Coming
  soon" card does nothing; no console errors; no sideways scroll at 375px.

Also asked for (not done yet — see the chat): a section for the **8355
method** (Reheart Sheu's beginner method: 8 = cross + 3 corners, 3 middle
edges, 5 remaining edges, 5 remaining corners, using Sexy Move and its
mirrors). Waiting on whether the user has their own notes for it.
