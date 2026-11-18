# 2026-11-19: corner methods compared (measured, nothing built on the site)

`node log/2026-11-19-corner-methods-compare.mjs` → ALL OK (every plan solves the whole cube after M2 edges, 3,000
random scrambles). Moves after cancelling; rotations count 1 (four helpers' z / y' around each F / K pair); twisted
corners and the odd-count parity are included as each method does them.

| Corners per solve | Letters | Moves | Moves (even solves) | vs Old Pochmann |
|---|---|---|---|---|
| Old Pochmann | 8.1 | 134.8 | 135.3 | 0% |
| Orozco | 8.1 | 87.4 | 80.3 | −35% |
| Four helpers (picking rule) | 8.1 | 62.1 | 54.1 | −54% |
| Our 3-Style table | 8.1 | 55.0 | 47.0 | −59% |

(The 40.8 corner moves per solve in PAIR_RULE_STATS counts table pairs only: no rotations, twists or parity.)
