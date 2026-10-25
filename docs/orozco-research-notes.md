# Orozco corners — research notes (2026-10-25)

Answers to `docs/orozco-research-plan.md`. Sources were read in this session; where a source could not
be read, the question is marked **not answered**.

## Sources

| Source | Read? | Used for |
|---|---|---|
| cubinghistory.com — https://www.cubinghistory.com/BlindfoldSolving/Methods/Orozco | Yes (the `cubinghistory.com` address redirects to `www.`) | Buffer, helper, set sizes, origin, credit |
| note.com (Riu) — https://note.com/cuber1u/n/n396edec5a495?hl=en | Yes (translated page) | Corner algorithm list, parity, helper rules |
| hypercubing.xyz — https://hypercubing.xyz/methods/2x2x2x2/orozco/ | Yes | Only the 4D (2x2x2x2) method; general idea only |
| speedsolving.com wiki, forum, threads (incl. the McNeill thread) | **No**: HTTP 403 to both curl and WebFetch | Search snippets only (see below) |
| youtube.com/watch?v=qutNt4f5z8g (Orozco's 2013 video) | **No**: redirects, not followed | — |
| techhenzy.com/orozco-tutorial | **No**: redirects to an unrelated domain, not followed | — |
| scribd Orozco tutorial | Not tried | — |
| forum.artofmemory.com poll | **No**: HTTP 403 | Search snippet only |

## Q1. Buffer and helper

**Answered.** Corners: buffer UFR, helper UBR (cubinghistory; note.com). Edges: buffer UF, helper UB
(cubinghistory). Common tutorials agree on these two. The 4D page says "a common combination is IUFR and
IUBR", which is the same pair in 4D. Nothing read gives a different helper. The Eka wiki snippet also
names UFR and UBR, but that wiki was not readable.

## Q2. Memo reference sticker

**Not answered.** No source read says which sticker the memo starts from. note.com gives the letters
but not the sticker convention. Our memo uses the U sticker of UFR. Check against the wiki or video.

## Q3. Odd / even rule

**Answered, partly.** note.com: "for even-numbered turns, execute the inverse sequence (the sequence
with the commutator reversed)". It says this is stated for edges and applied to corners too. It also says:
"For odd-numbered targets, the insertion comes first. For even-numbered targets, the interchange comes
first." This is the insertion/interchange order, which is a different rule from our "buffer → target →
helper" wording. Our version has the same sequence written differently: check that the two describe the
same moves before changing the page.

## Q4. The corner algorithm list

**Partly answered.** note.com lists 21 corner cases (the count matches cubinghistory's "21 algorithms").
Copied exactly from note.com (translated page; notation as written there):

**Insert to helper and U-face interchange**

| Case | Algorithm |
|---|---|
| LDB | `[R D' R', U']` |
| RDB | `[R D R', U']` |

**Insert to buffer and U-face interchange**

| Case | Algorithm |
|---|---|
| LDF | `[U, R' D R]` |
| FDR | `[U, D' R' D R]` |
| FDL | `[U, D R' D' R]` |
| RDF | `[U, R' D' R]` |
| BDL | `[U, R' D2 R]` |
| BDR | `[U, D' R' D' R]` |

**R2, insert to helper, and D-face interchange**

| Case | Algorithm |
|---|---|
| LUF | `[R2: R U' R', D']` |
| BUL | `[R2: R U2 R', D']` |
| DBR | `[R2: R2 U R2 U' R2, D']` |

**R2, insert to buffer, and D-face interchange**

| Case | Algorithm |
|---|---|
| LUB | `[R2: D, R' U R]` |
| FUL | `[R2: D, R' U2 R]` |
| DFR | `[R2: D, R2 U' R2 U R2]` |

**Insertion between buffer and helper**

| Case | Algorithm |
|---|---|
| DFL | `[x': R U R', D2]` |
| DBL | `[x: D2, R' U' R]` |
| UBL | `[x R2: R U R', D2]` |
| UFL | `[U' x R2: R U R', D2]` or `[x' R2: D2, R' U' R]` |

**Helper pieces**

| Piece | Algorithm |
|---|---|
| UBR | skip |
| RUB | `R U2 R' U' R U' R' L' U2 L U L' U L` |
| BUR | `L' U' L U' L' U2 L R U R' U R U2 R'` |

Points to check against a second source:
- The list uses `x` rotations and `R2:` (the colon is commutator notation in the source). Our data writes
  each commutator in base form with setups, so the two may differ on the same case.
- The `R2: ...` and `x` forms need the source's own notation reading before they can be simulated.
- Only one readable source. It is a translation of a Japanese blog.

Not answered: whether the helper's own stickers are in the 21 (note.com lists two helper pieces, RUB and
BUR, with their own algorithms; UBR is skipped).

## Q5. Target on the helper

**Partly answered.** note.com's helper pieces (RUB and BUR) have their own algorithms, listed above, and
the helper-CO rule: "if the letters fall in an even-numbered position, please execute the opposite
procedure (=inverse procedure)". The snippet from the search said the method's special fix is "the same
algorithm and no extra final move". Not confirmed against a readable source.

## Q6. Parity (odd number of corner targets)

**Partly answered.** note.com: parity rule `R U2 R' U2 R' F R U R U2 R' U' R U R' F'`, described as "two
sets of 2-cycle swaps for UF-BU and UFR-UBR". Our page uses the Ra-perm for parity. Whether the edges are
M2 or Orozco edges is not stated in what was read. The Eka wiki snippet said a Jb-perm is used for parity
with UFR and UBR. Two sources point to different parity algorithms; neither has been simulated here.

## Q7. Twisted corners in place

**Not answered.** Nothing read covers it. note.com's helper-CO rule may be the closest.

## Q8. Edges

**Partly answered.** Buffer UF, helper UB, 22 algorithms (cubinghistory). The list and helper rules were
not read.

## Q9. Recommended order

**Not answered** from a readable source. The search snippet said the approach is "learning 21
commutators forwards and backwards for corners and 22 for edges" (speedsolving snippet, not read in full).

## Comparison with "Our version"

- Buffer and helper: agree.
- The commutator base is the same family as ours (`[R D R', U']` and `[R D' R', U']`), but note.com
  uses a different list shape: it has `[U, …]` and `R2:` commutators and `x` rotations that our page does not.
- Parity: note.com's parity algorithm differs from our Ra-perm, and the Eka snippet names a Jb-perm.
- None of the algorithms above has been simulated in this session.

## Next steps (not done)

- Simulate note.com's 21 algorithms (with the same checker as `log/2026-10-25-orozco-corners.mjs`) to
  confirm they do what the table says, given the rotation and `R2:` notation.
- Get the speedsolving wiki, Orozco's video, or the McNeill thread from a network that can reach them.
- Decide whether to use note.com's list on the page. The owner said to use the method as taught, with
  credit, so that decision is theirs.
