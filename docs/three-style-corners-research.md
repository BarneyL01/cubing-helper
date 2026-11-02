# 3-style corners: how many groups in J Perm? (2026-11-02)

## Answer

**J Perm has no 3-style corner list, so it has 0 groups for 3-style.** Its algorithm menu
(https://www.jperm.net/algs/...) covers 2-look OLL/PLL, OLL, PLL, COLL, Winter Variation, VLS,
ZBLL, OH, 2x2 and 4x4. It has no Blindfolded or 3-style section. Its "3x3 Blindfolded" tutorial page
has no algorithm list either.

Note: jperm.net returns the same HTML page (HTTP 200, same size) for any path, including made-up ones
such as `/algs/3style` and `/algs/bld`. Those URLs do not prove a page exists. A list would only appear
in the menu, so the menu is the evidence.

## Why there is no fixed list

3-style is a **freestyle** method: the solver picks commutators or 3-cycles for each pair of pieces at
solve time, with setups chosen to suit the position. The cubing history page for 3-Style says: "Use
freestyle commutators to solve two pieces at once." (https://www.cubinghistory.com/BlindfoldSolving/Methods/3Style,
read this session.) So there is no set of groups to count.

The buffers it names: UF for edges and UFR for corners are the most common. Another buffer style, "Nightmare",
uses UR for edges (same page).

## Closest fixed list: Beyer-Hardwick corners (not 3-style)

Beyer-Hardwick (BH) is a separate method. Its corner page lists one algorithm per 3-cycle from a fixed
buffer (https://www.speedcubing.com/chris/bhcorners.html, read this session):

| Optimal length (HTM) | Cases |
|---|---|
| 8 | 198 |
| 9 | 126 |
| 10 | 30 |
| 11 | 18 |
| 12 | 6 |
| **Total** | **378** |

The page says the goal is "an optimal length algorithm for all 3-cycles starting from a fixed buffer
piece", and that the case names are the important part. This is not 3-style, and it is not in J Perm.

## Options for the site

1. Use the 378 BH cases if a fixed corner list is wanted. Source: speedcubing.com (above).
2. Treat 3-style as freestyle and teach the commutators in use. Our Orozco and M2 pages already do this
   kind of teaching.
3. Find a source that lists 3-style groups, if one exists. None was found.
