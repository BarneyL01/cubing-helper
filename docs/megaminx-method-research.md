# Megaminx: non-beginner solving methods — research brief (2026-10-28)

Purpose: a brief for a planner agent. It lists the non-beginner Megaminx methods found, what each
involves, the notation we would need, what the repo already has, and what is still unknown. Nothing here
is built. Every algorithm below is copied from a source, not checked by simulation. Where a source could
not be read, that is said.

## 1. What the site has now

| Item | State |
|---|---|
| `megaminx/index.html` | Three cards: Gray star (2 cases), align star pieces (1), Gray corners (2). Text and algorithms only. |
| `data/megaminx.js` | Those 5 cases. All set `noViewer`, because the simulator only does 3x3 cubes. |
| First layer, second layer, edges, corners of the earlier steps | Placeholder. The beginner's method is not on the site. |
| Picture or 3D preview | None. `docs/plan.md` open question: cubing.js is self-hosted and includes megaminx, but its move notation differs from ours. |
| Simulator | `js/cube-sim.js` handles 3x3 only. Megaminx needs its own model (12 faces, 5 stickers each, 72° turns). |

## 2. Notation (needed by any method below)

The official WCA-style notation is in the Randelshofer SSE page
(https://www.randelshofer.ch/rubik/megaminx/doc/supersetENG_3x3_megaminx.html, read this session).
Other sources use the same letters.

**Faces (12):** upper half R, F, L, UL, UR, U; lower half DR, DL, BL, B, BR, D.
Opposite pairs: U/D, R/BL, F/B, L/BR, UL/DR, UR/DL.

**Moves:**
- A plain letter (R, F, U, …) is a clockwise 72° turn of that face (seen from that face).
- `'` is counterclockwise. `2` is 144°. `3` and `4` are never written (R3 = R2', and so on).
- Prefixes: `T` = tier twist (two layers deep), `M` = middle layer, `S` = slice of opposing faces,
  `C` = whole-puzzle rotation.
- `( … )` groups a sequence; `(…)3` repeats it.

**Scrambles use a different notation** (WCA Right/Down/Up turns with `++` and `--`). Do not mix them
into algorithms. Source: https://speedcube.com.au/blogs/notation-guides/megaminx-notation (text only; the
letter definitions are in images on that page).

**Gaps:** the page the GAN guide points to (https://www.gancube.com/pages/megaminx-guide-of-gan) has its
algorithms only in images. `FR` (front right) does not appear in the SSE face list; sources that use it
have not been read.

**Caution on notation mixing:** the solvingrubikscube tutorial gives Megaminx steps in 3x3 notation (e.g.
`U R U' R' U' F' U F`) without defining the faces. Do not use those strings without a face map.

## 3. Candidate non-beginner methods

Sources for the method names: Speedsolving wiki category "Megaminx methods"
(https://www.speedsolving.com/wiki/index.php/Category:Megaminx_methods), as shown in search results.
The wiki pages themselves returned HTTP 403 to both curl and WebFetch, so their content is from snippets
only.

The Speedsolving wiki's Megaminx F2L page describes two main approaches: **Star and Pairs** (like CFOP) and
**Blockbuilding** (like Petrus). Other named methods on the wiki's category page: Tregay, MiniTripod,
Villaret, Akkersdijk, Hayes, efattah. Pages with their own entries: Bálint, Petrus, Westlund, Yu Da-Hyun,
ZZ-Spike. A forum post named Westlund, Yu Da-Hyun and Bálint as the three most used (an opinion, dated).

### 3.1 CFOP-style (Star + Pairs), what the sources agree on

| Stage | What it is | Source |
|---|---|---|
| First layer ("star") | Solve one face's 5 edges around a centre (star), then its corners. Intuitive, no algorithms. | solvingrubikscube; GAN guide; Speedsolving F2L page |
| Middle layers | Insert edge + corner pairs (F2L-style). Sources disagree on count: 5 pair insertions (Speedsolving) or 25 middle edges (solvingrubikscube). | both |
| Last-layer star (OLL-style) | Orient the 5 edges of the last face. Algorithm given by solvingrubikscube: `R U R' U R U2 R'` (the Sune). | solvingrubikscube (as read) |
| Last-layer edges | Permute the 5 star edges, then the corners. | solvingrubikscube; Speedsolving LL snippet |
| Corners | Position, then orient. | solvingrubikscube |

solvingrubikscube's algorithms (read; not verified):
- Edge permutation: `R U R' U R U2 R' U`
- Corner positioning: `U R U' L' U R' U' L` (repeat as needed)
- Corner orientation: `R' D' R D` (repeat per corner)

Its "sub-2-minute" claim is unverified. The page calls the middle-layer method "Advanced CFOP variant" and
gives no piece breakdown.

### 3.2 Four-look last layer (4LLL) — Speedsolving LL page (snippet)

Four separate last-layer stages: orient edges, orient corners, permute edges, permute corners. The page
says "either of those allows the last layer to be solved using OCLL and PLL, referring to edge control or
ZZ-Spike approaches" (snippet). Not read in full.

### 3.3 Two-look last layer for Megaminx (speedcube.com.au blog, read)

Two stages: orient edges, then orient corners. Permute edges first, then corners. The page gives
19 orientation-type cases ("MEGA 2LOLL 01–19") and 20 permutation cases (EPLL 01–05, CPLL 01–15). Stated
reason: "Most Megaminx solutions permute the last layer edges first, and then the corners." and "a corner is
the intersection of three turnable faces."

Sample algorithms as written (source; notation not defined on the page; not verified):
- 2LOLL 01: `F (U R U' R') F'`; 2LOLL 04: `R U2 R' U R U2 R'`; 2LOLL 13: `R U2 R' U' R U R' U' R U' R'`
- EPLL 01: `R2 U2' R2' U' R2 U2' R2'`; EPLL 05: `(L R U2) (L' U R') (L U' R U2) (L' U2 R')`
- CPLL 01: `(R' BR' R BR) (R' F' R BR') (R' BR F R)`; CPLL 13: `(R' U2 R U') (R' U2 R U2') (R' U' R U2') (R' U R U2') (R' U R)`

Notation note: these strings use `BR` and `Dfr'`, which the SSE page defines only for `BR`. `Dfr` is not
in the SSE list. Use the SSE definitions and check the rest on a source with a notation key.

### 3.4 Westlund S2L (Speedsolving wiki snippet, not read in full)

Six steps: solve two star edges next to a partly solved face; insert pairs to complete that face; repeat
an edge-insertion step to leave two faces; solve the face not opposite the first; finish with the last
layer. Last layer ends with grey on top (per a forum post). Described as the most popular method for
Megaminx. Strength: blocks built next to each other (lookahead). Weakness: fixed order.

### 3.5 Yu Da-Hyun S2L (forum snippets only)

A variant of Westlund. Last-layer colour is not restricted to the colour opposite the star. No step list
found. One poster says Westlund and Yu Da-Hyun are "essentially the same".

### 3.6 Bálint (Speedsolving wiki snippet and forum)

Four steps: solve the first two layers; solve five Bálint blocks (two edges and a corner on a centre,
built on the F2L); solve five pairs; solve the last layer. More freestyle, more block building, more
rotations than Westlund. Video and cubeskills lessons are gated.

### 3.7 Petrus-style (Speedsolving wiki snippet)

Blockbuilding for most of the solve, with edge orientation on the last two faces. Page not readable.

### 3.8 Lesser-known named methods

Tregay, MiniTripod, Villaret, Akkersdijk, Hayes, efattah, ZZ-Spike: named on the category page only. Not
researched.

## 4. Comparison (from sources read; not checked)

| Method | Steps | Algorithms | Intuition | Notes |
|---|---|---|---|---|
| CFOP-style star + pairs | 6 (first layer, pairs, last-layer star, edges, corners, orient) | Few per stage | Medium (pair insertion) | Closest to the 3x3 CFOP we already teach. Most sources agree on it. |
| Westlund S2L | 6 | Several | Low (fixed order) | Most popular per a forum post. |
| Bálint | 4 | Several | High (blocks) | Harder to teach as fixed steps. |
| Petrus-style | Multi | Few | High | Blockbuilding. |
| 4LLL / 2LOLL last layer | Last layer only | Many, in sets | None | Last layer stage; can be paired with any build method. |

## 5. Open questions (for the owner)

1. Which method should the site teach first? Options: CFOP-style (closest to our 3x3 pages), Westlund
   (most popular), or a last-layer-only addition on top of the beginner's first two layers.
2. Last layer: 2-look (Megaminx 2LOLL/EPLL/CPLL) or 4LLL (separate sets)?
3. Notation: use the SSE letters (R, F, U, BR, DR, …) for algorithms? Confirm.
4. Pictures: is a Megaminx picture or 3D view wanted? It needs a new Megaminx model (see section 6).

## 6. What a planner needs to build this

- A simulator for Megaminx (12 faces, 5 stickers each, 72° turns, face map from section 2), checked on
  the existing 5 megaminx cases first. `cube-sim.js` cannot be reused as is.
- Per-step data in `data/`, following the pattern of `data/beginners.js` (steps with cases).
- Pages: a method page with steps, using `js/steps-page.js` (the same layout as the beginner's and 8355
  pages). The Megaminx section in `js/site-chrome.js` `MENU` currently has one page.
- Verification: each algorithm applied to a solved cube, then checked for the stage's expected state,
  as in `log/` check scripts. Keep the checker in `log/`.
- Sources to re-read before building (currently blocked or gated): the Speedsolving wiki Megaminx pages
  (F2L, LL, Westlund, Bálint, Petrus), the cubeskills intermediate lessons (member video), and the GAN
  guide's algorithm images.

## 7. Sources

| Source | Read? | Used for |
|---|---|---|
| https://www.randelshofer.ch/rubik/megaminx/doc/supersetENG_3x3_megaminx.html | Yes | Notation (faces, moves, prefixes) |
| https://speedcube.com.au/blogs/notation-guides/megaminx-notation | Partly (letters are in images) | Scramble vs algorithm notation |
| https://in.speedcube.com.au/blogs/megaminx-2-look-pll | Yes | 2LOLL, EPLL, CPLL cases |
| https://www.speedcube.us/blogs/megaminx-2-look-oll | Yes | 2LOLL cases (same list) |
| https://solvingrubikscube.com/tutorials/how-to-solve-megaminx-dodecahedron.php | Yes | CFOP-style steps (unverified) |
| https://www.gancube.com/pages/megaminx-guide-of-gan | Partly (algorithms in images) | Layer method outline |
| https://ruwix.com/twisty-puzzles/megaminx-gigaminx-teraminx-petaminx/ | Yes | Beginner's method only |
| https://www.cubeskills.com/tutorials/intermediate-megaminx-techniques | Yes (menu) | Lesson list; lessons are gated |
| https://www.cubeskills.com/tutorials/intermediate-megaminx-techniques/blint-s2l | No (member only) | — |
| https://www.speedsolving.com/wiki/index.php/Megaminx_F2L | No (403) | Snippet only |
| https://www.speedsolving.com/wiki/index.php/Megaminx_LL | No (403) | Snippet only |
| https://www.speedsolving.com/wiki/index.php/Petrus_method_(Megaminx) | No (403) | Snippet only |
| https://www.speedsolving.com/wiki/index.php/Westlund_method | No (403) | Snippet only |
| https://www.speedsolving.com/wiki/index.php/Category:Megaminx_methods | Snippet only | Method names |
