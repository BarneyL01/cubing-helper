# 2026-09-27 — Ortega T/L CMLL resolved

- User resolved the two blockers from earlier today:
  - **T CMLL** ("Sassy Sledge") — user gave Sledge directly: `R' F R F'`
    (letter-code `PFRG`, which decodes to the same thing via the existing
    cipher). Full algorithm: `R U R' U' R' F R F'`.
  - **L CMLL** ("Fipgar Urvop") — user said both were "already in the
    table" rather than giving fresh letters. Read as: Fipgar = "F" + Pager
    (`PGR` = `R' F' R`) → `F R' F' R`; Urvop = "U" + RVP (`R U' R'`) →
    `U R U' R'`. Full algorithm: `F R' F' R U R U' R'`. This one is an
    inference rather than a direct confirmation like Sledge — flagged in
    `docs/plan.md` as worth a quick sanity check.
- Updated `data/ortega.js`, `docs/mnemonics.md` (added Sledge, Fipgar,
  Urvop to the permanent table), `docs/plan.md`, and the home page badge
  (2x2 Ortega is now "Ready", all 7 OLL cases + PBL recorded).
