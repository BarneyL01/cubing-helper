# 2026-09-27 — Roux CMLL + Megaminx last layer

- User sent a Roux CMLL table spelling out all 7 corner-orientation cases
  **letter by letter**. This independently confirmed both of the
  previously-uncertain 2x2 Ortega decodes exactly:
  - T CMLL: "Sassy-P-F-R-G" → `R U R' U' R' F R F'` — matches what "Sassy
    Sledge" had already decoded to.
  - L CMLL: "F-P-G-R-U-R-V-P" → `F R' F' R U R U' R'` — matches the
    inferred "Fipgar Urvop" decode exactly. That inference is no longer
    just a guess.
  - Also picked up a genuinely new alternate algorithm for H:
    `U R U R' U R U' R' U R U2 R'` ("U-Ugly-Punk-Loopy"), which the user's
    notes treat as the primary one, with "F Sassy×3 G" (already known, same
    as CFOP's H1) offered as an easier-to-remember alternative.
- **Refactored**: pulled the 7 corner-orientation cases into
  `data/corner-orientation.js` as a single shared source, since Ortega's
  OLL and Roux's CMLL are the exact same cases/algorithms. `data/ortega.js`
  now imports and re-tags it for the 2x2 puzzle; `data/roux.js` reuses it
  directly. Backfilled the new stories/mnemonics (Sassy with a Sledge;
  Fipgar Urvop / Frogs Paint Green Rainbows, Umbrellas Reveal Very Purple;
  Frog is Sassy/double-Sassy to Goose; Havoc! Ugly Punk Goes Loopy) onto
  the shared cases, so both pages benefit.
- Added the one Roux LSE case given ("4-edge recognition" with a pair of
  opposite edges already oriented): `M U2 M` / `M' U2 M'`.
- Built out the Megaminx page (previously a placeholder): Gray star (edge
  orientation, 2 cases), align star pieces (1 case, same algorithm as
  Sune), and Gray corners (flip = reuses Sassy; move = insert/reslot with
  R U R' / R U' R').
  - **No interactive 3D preview for Megaminx.** cubing.js's twisty-player
    doesn't use plain cube (R/U/F) notation for a megaminx — it has its
    own — and `cdn.cubing.net` is blocked from this sandbox so the actual
    notation couldn't be checked. Rather than guess and risk an incorrect
    or broken preview, added a `noViewer` flag to `js/render-cases.js` and
    used it for every Megaminx case. Text and algorithms only, for now.
- Updated home page badges (Roux, Megaminx → "Partial"), `docs/plan.md`,
  `docs/mnemonics.md`, and `CLAUDE.md`'s content-scope section (rewrote it
  as a live per-puzzle summary instead of a fixed "v1 scope" — it was
  getting stale every time something new got added).
- Verified locally (static server + headless Chromium, all touched pages)
  before merging: mnemonic-chunk-to-algorithm checks all pass
  programmatically, no console errors besides the expected
  sandbox-blocked `cdn.cubing.net` one, Megaminx correctly requests no
  twisty-player script at all.

## Next

- Figure out the right cubing.js notation for megaminx (or another
  approach) and wire up its 3D preview.
- Roux: block building, rest of LSE, whenever the user sends more.
- Megaminx: earlier layers, whenever sent.
