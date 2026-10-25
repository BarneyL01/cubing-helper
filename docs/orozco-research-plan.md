# Orozco corners — research plan (2026-10-25)

The Orozco corners page (`3x3/bld/orozco.html`) was built without reading the original sources: the
build environment cannot reach cubinghistory.com or speedsolving.com (both refused by its network
policy). Only search-result snippets were seen. This plan lists what to look up so the page can be
compared with the method as Orozco and the community teach it.

## What we have now (to compare against)

| Topic | Our version | Where it came from |
|---|---|---|
| Buffer / helper | Buffer UFR, helper UBR | Search snippets (cubinghistory.com) |
| Memo | From C, the U sticker of UFR | Ours |
| Odd / even targets | 1st of each pair: buffer → target → helper (the letter's commutator). 2nd: buffer → helper → target (the same commutator backwards) | Search snippets (speedsolving.com forum post) |
| The commutators | 18, all `[R D R', U']`, `[R D' R', U']` or `[R D2 R', U']` with a 0–2 move D/L setup (`data/orozco-corners.js`) | Ours, by simulation |
| Helper's letters | B: skip. N: twist (1st of pair) / twist backwards (2nd). Q: the reverse. Twist = `(R' D' R D)×2 U (D' R' D R)×2 U'` | Ours, by simulation |
| Odd number of targets | After the last letter forwards, Ra-perm `R U' R' U' R U R D R' U' R D' R' U2 R' U'` | Ours, by simulation (assumes M2 edges first with the owner's M2 parity, which leaves UL/UB swapped) |
| Corners twisted in place | Handled by the normal memo (cycle breaks) | Ours |

All of it is checked: 3,000 random scrambles solved with M2 edges then these corners
(`log/2026-10-25-orozco-corners.mjs`). So the research is about **matching what people teach**, not about
whether ours works.

## Sources to read

1. cubinghistory.com — https://cubinghistory.com/BlindfoldSolving/Methods/Orozco
2. Speedsolving wiki — search the wiki for "Orozco" (e.g. https://www.speedsolving.com/wiki/index.php?title=Orozco_Method)
   and the related page https://www.speedsolving.com/wiki/index.php?title=Eka
3. Speedsolving forum — https://www.speedsolving.com/forum/posts/1163658/ and https://www.speedsolving.com/forum/posts/5467/
   plus any thread or post by Gabriel Alejandro Orozco Casillas introducing the method (Nov 2013).
4. Orozco's original video (Nov 9, 2013), linked from the pages above, if a transcript or description is available.
5. Any well-known tutorial (written or video description) that gives the full corner algorithm list.

## Questions to answer

For each answer, note the source URL and quote the exact wording or algorithm.

1. **Buffer and helper.** Confirm buffer UFR and helper UBR for corners. Is the helper ever chosen
   differently (e.g. ULB, DFR) in common tutorials?
2. **Memo reference sticker.** Which sticker of the buffer is the memo started from (U sticker of UFR?) —
   i.e. which letter scheme orientation do the algorithm lists assume?
3. **Odd/even rule.** Confirm: odd targets buffer → target → helper; even targets buffer → helper → target, and
   that the even step is the odd step's algorithm done backwards (inverse).
4. **The corner algorithm list (about 21).**
   - Get the full list as published (letter or sticker → algorithm). Record it as a table.
   - Are the helper's own stickers (UBR: U, R, B stickers) included in the 21, and if so with what algorithm?
   - Do they use a few base commutators plus setups (like ours), or a different shape for each sticker?
5. **Target on the helper.** The snippet said: "If the next target is the helper and is misoriented, the
   method has a special fix … like the M2 method's version, with the same algorithm and no extra final move."
   Find the full rule: what to do for the helper's U sticker, and for each of its two other stickers, on an odd
   and on an even target. Quote any algorithm.
6. **Parity (odd number of corner targets).** What does Orozco do? Which algorithm, and does it assume the
   edges are solved with M2, Orozco edges, or something else? Is there a swap of UL/UB (or other edges)
   built in?
7. **Twisted corners in place.** Any special handling, or done through the normal memo?
8. **Edges (for later, not urgent).** Orozco edges: buffer UF, helper UB, 22 algorithms. Get the list
   and the rules for the helper's stickers and parity, so an edge page could be added later.
9. **Recommended order** in a solve (corners first or edges first) and how parity interacts between them.

## What to send back

- A markdown file (e.g. `docs/orozco-research-notes.md`) with one section per question above: the answer,
  the quote, and the URL.
- The published corner algorithm list as a table (letter or sticker, algorithm), copied exactly.
- Anything the sources say that disagrees with the "Our version" table at the top.

## What happens next (on our side)

- Compare their rules with ours. Where they differ, simulate theirs with the same checker; if it works, use
  their version on the page (the owner wants the method as taught), keeping ours only where theirs is missing.
- Add their algorithm list beside ours on the page if it is different, with credit.
- Update the page's source note to say which parts come from which source.
