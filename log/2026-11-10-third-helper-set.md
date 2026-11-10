# 2026-11-10 — Third Orozco-style set: answers (no site change)

- Owner asked for answers to the open questions in `docs/third-base-set-status.md`: a third set of 3 bases that
  solves corners on its own, completes 3-style with setups under 4 moves, and a way to know which base a pair uses.
- `log/2026-11-10-third-helper-set.mjs` (ALL OK; `GPS` default, `KTH`, `LOS`):
  - Helper letters with a complete set: only B/Q, P/K, D/F (two free faces). Third set = helper D.
  - Helper D with `[R' D^k R , U']` (G P S): 18 letters, setups D/B 0/1/2/3 = 3/7/6/2; twist
    `(R' D' R D)x2 U' (D' R' D R)x2 U`; F 1st twist / 2nd backwards, I the opposite; 3,000 whole solves.
  - 9 bases, D L B setups up to 3: 378 / 378, mean setup 1.89 (weighted 1.83).
  - Walk rule (one walk per letter into a helper's place, then the other letter's setup): 378 / 378, mean 2.02,
    5 exception pairs; every commutator checked; 3,000 whole solves with the rule's table.
  - Any 3 of all 99 bases added to the 6 known: best mean setup 1.65 (not a helper set).
- Docs updated: `docs/third-base-set-status.md` (Answers), `docs/three-style-notes.md`. Nothing built on the site;
  the owner still has to choose between `[R' D^k R , U']` and `[F D^k F' , U']`.
