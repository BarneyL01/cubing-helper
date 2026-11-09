# 2026-11-10 — Orozco (helper B) shortcuts; B or P per pair

- New section "Shortcuts: two letters in one commutator" on 3x3/bld/orozco.html (same layout as helper P's), data
  `data/orozco-b-shortcuts.js` from `log/2026-11-10-orozco-b-shortcuts.mjs --write` (ALL OK, each commutator checked).
  The three Orozco bases with D/L/B setups ≤ 2 moves (buffer fixed, B may move): 65 letter pairs (130 both ways),
  8 one-move (A↔O, E↔L, E↔W, E↔X, L↔O, L↔X, N↔X, O↔X), 57 two-move; every one needs a B turn (D and L never move B).
  76% of solves have one, 1.14 per solve. Quick test (checked on every pair): O, E, X play B after B / B' / B2, then the
  other letter's Orozco setup + base; 42 letter pairs, 0.69 per solve. orozco.html now loads style.css?v=33.
- B or P for a pair (each letter's commutator length; helper letters N/Q in B and K/V in P are 18-move twists):
  B shorter for 138 of 378 pairs, P for 170, same for 70. Per letter: cheaper with P: A (8 v 12), I, U, W (10 v 12),
  N, Q (10/12 v twist 18); cheaper with B: O (8 v 12), T (10 v 12), K, V (10/12 v twist 18); same: D E F G H L R S X.

## Quick test: level 1 and level 2 (owner asked for a clearer layout and caveats)

- `log/2026-11-10-quick-tests.mjs` generates and checks `data/orozco-quick.js`; `js/orozco-quick.js` renders it on
  orozco-p.html (`#op-quick`) and orozco.html (`#ob-quick`) as three cards: Level 1, Level 2, Caveats.
- Level 1 (P: L T H; B: O E X): checked against every partner, including K/V (P) and N/Q (B). No exceptions.
- Level 2: two turns; a shortcut only with the listed partners. Partners that are level-1 letters are left out of the table.
- Checked at 390 px in headless Chromium, no console errors.
