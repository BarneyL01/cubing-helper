# Mnemonic Cipher

The user encodes 3x3 algorithms as short "words" made of letters that each
stand for a specific move. This file is the single source of truth for
decoding/encoding them — check here (and update here) before adding any
algorithm to the site.

## Letter → move table

| Letter | Move | Notes |
|---|---|---|
| R | R | |
| P | R' | "prime of R" |
| U | U | |
| V | U' | "prime of U" |
| F | F | |
| G | F' | "prime of F" |
| M | M | slice move |
| K | M' | "prime of M" |
| N | M2 | double-M, gets its own letter since it's so common |
| `2` suffix on R/U/F | doubles that face move | e.g. `U2` = `U U`, `R2` = `R R` — written literally in the word, not spelled out as two letters |

## Named chunks (words)

| Word | Letters | Moves |
|---|---|---|
| Sassy | RUPV | R U R' U' |
| Jolly | RVPV | R U' R' U' |
| Rupture | RUPG | R U R' F' |
| Ugly | RUPU | R U R' U |
| Loopy | RU2P | R U2 R' |
| RVP | RVP | R U' R' |
| Punk | RVPU | R U' R' U |
| Spinner | R2U | R2 U |
| Spanner | R2V | R2 U' |
| Prefer | PFR | R' F R |
| Power | PVR | R' U' R |
| Pup | PUP | R' U R' |
| Privilege | PVG | R' U' F' |
| Pager | PGR | R' F' R |
| Pure | PUR | R' U R |

## How this was decoded

The user gave letter chunks but not a direct 1:1 dictionary. The mapping
above was derived by decoding whole named algorithms and cross-checking the
result against known standard WCA algorithms — every one below matched
exactly, which is strong confirmation the table is correct:

- **Headlights (T-perm)** = Sassy + Prefer + Jolly + Rupture decodes to
  `R U R' U' R' F R2 U' R' U' R U R' F'` — the standard T-perm, exactly.
  (Also confirms that two adjacent identical quarter turns, e.g. the `R` at
  the end of Prefer meeting the `R` at the start of Jolly, combine into the
  `R2` seen in the real algorithm.)
- **Diagonals (Y-perm)** = F + Jolly + Rupture + Sassy + Prefer + G decodes
  to `F R U' R' U' R U R' F' R U R' U' R' F R F'` — the standard Y-perm,
  exactly.
- **H1 alt**, "F Sassy×3 G", decodes to `F (R U R' U')×3 F'`, matching the
  user's own note "H Alt: F (RUR'U')3 F'" word for word.
- **Pi1**, "RU2-R2V-R2V-R2U2-R", decodes to `R U2 R2 U' R2 U' R2 U2 R`, a
  known Pi-OLL algorithm.
- **Ua-perm**, "NUM-U2-KUN", decodes to `M2 U M U2 M' U M2` — the standard
  M-slice Ua-perm, exactly (confirms M / K / N).
- **Ub-perm**, "NVM-U2-KVN", decodes to `M2 U' M U2 M' U' M2` — the standard
  M-slice Ub-perm, exactly.
- **H-perm**, "NU-N-U2-NU-N", decodes to `M2 U M2 U2 M2 U M2` — the standard
  M-slice H-perm, exactly.
- **Z-perm**, "KU-NU-NU-KU2-NV", decodes to
  `M' U M2 U M2 U M' U2 M2 U'` — consistent with the table above, but this
  is the one case that wasn't independently cross-verified against a second
  known-good source. **Flagged for the user to double-check** against their
  own solve before we treat it as final.

## Still open

- Confirm the Z-perm decode above.
- No letters for L, D, B, E, S, X, Y, Z, W turns have shown up yet — ask the
  user for these if/when Roux or another method needs them (Roux leans
  heavily on M-slice and rotations, so more letters are likely).
