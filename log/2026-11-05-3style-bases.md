# 2026-11-05 — 3-Style by base

Owner asked for 3-style grouped the Orozco way: learn a few bases (no-setup commutators), then reach other pairs
by moving one target into a base position, with the buffer never moving. New page `3x3/bld/three-style-bases.html`
("By base" in the 3-Style menu section), `js/three-style-bases.js`, data `data/three-style-bases.js` from
`log/2026-11-05-3style-bases.mjs --write` (ALL OK: every pair cycles C -> 1st -> 2nd and moves nothing else).

- 30 bases (R x R' or R' x R, x a U/D turn, against one U/D turn, moving the buffer); shown in 15 groups, each base
  with its reverse (forwards / backwards), with the corner picture and letter net.
- Setups: D and L only, up to 4 moves (owner chose D/L over D/L/B; B would add 78 pairs but 130 algorithms with B).
- Tabs: One target moves (184 pairs, mean 11.8 moves; current table 10.3 on the same pairs), Both targets move
  (122, mean 12.3 vs 10.9), N and Q (72: D/L never reach the B position, so these keep the 3-Style page's
  commutators, which move the buffer). Pairs with B are the Orozco commutators (all one-target).
- Each pair row shows what the setup moves ("T into P"); opening it gives the same steps as the 3-Style page.
- `pairRow` and a new `coreFigure` are exported from `js/three-style-page.js` (v=10) for this page.

## Search by letters

"Find letters" box above the tabs: one letter lists every pair with it as 1st and as 2nd target; two letters show that
pair. Each result says what the setup moves and where it lives (tab and base). While there is text it replaces the
tabs. Says so when the two letters are on one piece or a letter is a buffer sticker. Checked K, KD, KP, C, NQ, AN.

## Letters that move into each position

Owner asked, per base, which letters can be swapped in and whether the setup is always the same (e.g. H into P is
always D2). Each group in "One target moves" now has a table: for each of its two positions, every letter moved into
it and the setup (forwards and backwards share them). 45 of the 52 letter-into-position moves always use one setup;
7 have two (T>P, U>S, E>P, X>P, I>A, R>D, R>P) because the short setup would also move the other target in some
pairs; those are marked *.

## Setup diagrams

Each group in "One target moves" shows one letter picture per position: the position in blue, every letter that sets
up into it outlined (e.g. Into A: I O S U), above the letter/setup table.

## B setups: tried, waiting for the owner

Owner asked for B "everywhere that causes a problem or shortens the setup". Tried in a copy of the generator (not
committed): B setups wherever shorter make all 378 pairs reachable with the buffer still (268 one-target, 110 both),
but create 44 conflicts + 22 four-move setups; fixing them greedily needs 26 new bases (13 groups, total 56) and still
leaves 5 letters with two setups and 8 four-move setups. Narrow version (B only where D/L cannot reach or to fix a
problem): 216 one-target, 162 both, 16 new bases (total 46), 2 letters with two setups, 12 four-move. The earlier
estimate of 8 new bases only counted the 32 problem pairs of the D/L table. Asked the owner which to build.

## Commutators in the group titles

Each closed group now shows its two commutators under "Base A P · 24 pairs", e.g. `[R' D' R , U2]` buffer → A → P and
`[U2 , R' D' R]` buffer → P → A. Search placeholder no longer shown in capitals.

## Decision: D/L only, plus one extra base

Owner: keep D and L setups (no B); add `[L' U L , D2]` (and its reverse, group L T). The generator uses it only for
pairs whose letter otherwise needs a different setup or a 4-move setup: LT, TL (no setup), TX, XT (`L'`), LR, RL
(`D2 L2 D2`). B setups were tried and dropped (see above). Within one group every letter has one setup; across groups
7 letters go into a position a different way. Those now get a grey line in the group's table ("I into A is usually L',
but that would also move S, the other target here"), replacing the `*` note; each line checked (the usual setup does
move that other target). Group titles show one direction only (insertion first).

## 2026-11-06 — "Which base? Read it from the letters"

New section under "How it works": the four families by target letters (B + O/H/L = `R D R'` vs `U'`; D or A +
G/P/S = `R' D R` vs `U'`/`U2`; P + L/T/H = `R U R'` vs a D turn; L + T = `L' U L` vs `D2`), the D/D'/D2 letter sets
(O H L, G P S, L T H), who stays at home (B, the buffer, both targets on the bottom), middle turn and interchange on
opposite layers, and which letter comes first for each family. Every row checked against threeStyleBaseList.
