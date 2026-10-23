# 2026-10-23 · Content edit (wordiness pass)

The owner said many pages are too wordy. The brief is `docs/content-edit-brief.md`. This entry records
the text-only pass: prose cut and tightened on every page the brief lists. No algorithm, move sequence,
mnemonic, Libby's line, table value, picture, card, case, exercise, element id, section heading id or
`data-short` label was changed. `3x3/practice/recognition.html`, `js/site-chrome.js` and all `js/` logic
were not touched.

## Word counts (prose in `main`, 390 px, `log/2026-10-23-word-count.mjs`)

Measured on the branch as it stood before the edit (`969870c`) and after the final edit. The counts in
the brief's table matched the "before" column. Pages marked "trim repetition only" were read through and
left unchanged, because no obvious repetition was found.

| Page | Before | After | Brief target |
|---|---:|---:|---|
| `3x3/bld/commutators.html` | 1,031 | 710 | ~500 |
| `3x3/bld/corner-cycles.html` | 2,292 | 1,752 | ~1,100 |
| `3x3/8355/index.html` | 2,308 | 1,598 | ~1,300 |
| `3x3/heise/index.html` | 3,047 | 1,860 | ~1,600 |
| `3x3/marshall/index.html` | 2,545 | 1,995 | ~1,400 |
| `3x3/roux/index.html` | 2,173 | 1,699 | ~1,400 |
| `3x3/bld/corner-table.html` | 864 | 730 | ~500 |
| `3x3/bld/corner-twists.html` | 653 | 520 | ~400 |
| `3x3/bld/edge-cycles.html` | 965 | 841 | ~600 |
| `3x3/bld/corner-8355-lb.html` | 712 | 555 | ~450 |
| `3x3/bld/corner-8355.html` | 257 | 177 | light trim |
| `3x3/roux/lse-map.html` | 1,027 | 990 | ~800 |
| `3x3/cfop/oll.html` | 287 | 260 | ~200 |
| `3x3/cfop/pll.html` | 349 | 325 | ~250 |
| `3x3/cfop/f2l.html` | 1,771 | 1,759 | light trim |
| `3x3/beginners/index.html` | 687 | 680 | ~550 |
| `3x3/bld/index.html` | 224 | 224 | trim repetition only (not edited) |
| `3x3/bld/practice.html` | 108 | 105 | trim repetition only (not edited) |
| `3x3/cfop/index.html` | 44 | 42 | trim repetition only |
| `index.html` | 13 | 13 | trim repetition only (not edited) |
| `2x2/index.html` | 107 | 106 | trim repetition only |
| `megaminx/index.html` | 85 | 85 | trim repetition only |
| **Total (22 pages)** | **21,549** | **17,026** | |

The `3x3/bld/practice.html` count moves by a word or two between loads because it draws a random scramble.

## Left long on purpose

The brief's targets are rough. Most of what remains above target is picture captions, cards and generated
lists, which the brief says to keep.

- **Corner cycles (1,752 vs ~1,100).** The 30 pictures and 6 + 3 + 8 cards stay, with their captions and
  orientation lines. The pair lists in section 7 and the lookup are generated. Each prose section is now
  2 to 3 sentences, and section 5 is 5 short steps.
- **Roux (1,699 vs ~1,400).** The 4a and 4c card sets (11 cards and 22 pictures each) stay. The DFDB
  sources list stays, because it is the credit. The 4a and 4c notes are shortened, not removed.
- **Marshall (1,995 vs ~1,400).** Steps 2 to 5 are numbered and shorter, but the step bodies and the
  series captions still carry the pictures. The "What is not checked yet" list is about 90 words.
- **Heise (1,860 vs ~1,600).** Step 3 (578 words, 16 pictures and 3 cards) is the longest. The approach
  list and the tools list are kept, because the pictures refer to them.
- **8355 (1,598 vs ~1,300).** "Remaining edges" (620 words, 64 pictures) keeps the cycle explanation and
  the card captions, and the "Checked in the simulator" note is one sentence. "Last five corners" is 324
  words against about 250.
- **Commutators (710 vs ~500).** The exercise cards and their solution lists are kept. The five exercise
  notes are shorter, and the practice section is about 90 words.
- **Corner table (730 vs ~500), edge cycles (841 vs ~600), corner twists (520 vs ~400).** Each has
  generated lists and cards. The section intros are now at most two sentences.
- **L/B after 8355 (555 vs ~450).** Section 3 still shows 12 generated card lines (setup, length and the
  number of sticker versions), which are data.
- **LSE map (990 vs ~800).** Only the intro and "How to read a card" were in scope. The cards are generated.

## What was removed, so the owner can check it

- Heise: the counting detail (24 outer squares; 9 third squares after a matching inner square) was
  dropped. The "where the squares sit" derivation is now two sentences plus a note. The 2004 history is
  one sentence, with its source type ("secondary") kept.
- Marshall: the note on Marshall's figure 4a and the four-edge check wording was cut to one sentence. The
  check script remains the record.
- Commutators: the second half of the Speffz explanation was cut to one line. The Speffz letters for corners
  and edges (C is UFR and UF, V is DFR, U is DFL) are kept.
- 8355: the note now quotes the wiki's two swap algorithms again, as the brief requires. (A first trim had
  dropped them from the prose. The cards still show them.)
- Roux: "Your recorded LSE note" was shortened. The question to the owner is kept: "Please confirm or
  correct it."

## Honesty statements kept (each one sentence or so)

- Heise: "Derived here, not from Heise" (the 96 square placements and the piece counts); "not on this page"
  list; "Added" notes on the examples.
- Marshall: "Not from your own notes"; "Steps 2 to 5 rely on judgement" with the "not checked" list; the two
  extra algorithms "not Marshall's"; the simulator-checked claims.
- 8355: "Added here, not on the wiki" on the keyhole and last-corners notes; the "I haven't found a simple
  rule for part A" sentence; the 3,000-position check; the "32 arrangements tried" claim.
- Commutators: "Corrected: your notes said (R' D' R D)×2 twists one corner. It twists four."
- Corner cycles and corner table: "Not from your notes"; the generator name for every generated table.
- Beginners and Roux: the "not from your notes" tags on steps 1–4 and on the LSE steps.
- F2L: the chart credit ("Not our original work", dogschasingsquirrels) is untouched.

## Cache busting

- `3x3/bld/corner-cycles.html`: `data/corner-bases.js?v=1` → `?v=2`.
- `3x3/heise/index.html`: `data/heise.js?v=4` → `?v=6`.
- `3x3/marshall/index.html`: `data/marshall.js?v=2` → `?v=4`.
- `3x3/roux/index.html`: `data/roux.js?v=2` → `?v=3`.
- Not bumped, on purpose: `3x3/practice/recognition.html` also imports `data/roux.js?v=2`, and the brief says
  not to touch that page. The only export it uses (`rouxCmllCases`) is unchanged, so the cached copy is still
  correct. The commutators, 8355 and beginners pages import their data without a `?v`, so there is no number
  to bump.

## Generated text

Changed in the generators, then regenerated with `--write`, as the brief requires:

- `log/2026-10-21-bld-three-base.mjs` → `data/corner-bases.js`: base-card "Net" caption; demo start and base
  captions.
- `log/2026-10-20-heise-examples.mjs` → `data/heise.js` (inside the GENERATED block): square, twist,
  two-corner and edge-cycle captions.

Not regenerated: `data/corner-cycles.js` and `data/edge-cycles.js` (no text change needed in the
generator; the tab captions are in the page script), `data/lse-map.js`, `data/corner-8355*.js`.

## Checks

Run from the worktree (`/home/user/cubing-helper/.claude/worktrees/agent-aae4a34c5b40bde76`) on the final state.

| Script | Result |
|---|---|
| `log/2026-10-06-roux-lse-check.mjs` | ALL OK (run from a scratch copy with `js/`, `data/` and `"type":"module"`, as its header says) |
| `log/2026-10-16-bld-check-planner.mjs <old bld-memo.js>` | `check 9: 500 same, 0 different` (old file from `a5bb6ac`) |
| `log/2026-10-16-bld-cycles-generate.mjs` | ALL OK (check mode) |
| `log/2026-10-20-heise-examples.mjs` | ALL OK |
| `log/2026-10-21-bld-three-base.mjs` | ALL OK |
| `log/2026-10-21-bld-8355-corners.mjs` (and `--lb`) | ALL OK, both |
| `log/2026-10-22-8355-placing.mjs` | ALL OK (4,860 positions) |
| `log/2026-10-22-lse-eo-map.mjs` | ALL OK (32 patterns) |
| `log/2026-10-22-marshall-check.mjs` | ALL OK |
| `log/2026-10-22-sassy-twist-check.mjs` | ALL OK |
| `log/2026-10-23-full-oll-pll-check.mjs` | No problems found |
| `log/2026-10-23-recognition-check.mjs` | 84 combinations; ALL OK |

Headless Chromium (Playwright), each edited page at 390 px and 1280 px, served from this worktree: no console
errors, no page errors, no horizontal scroll, and every `h2`/`h3` id and `data-short` label from the base
commit still present. The rendered heading texts were compared with the base: none changed and none was
removed. (The only heading differences reported are in `3x3/bld/practice.html`, whose heading counts come from
its random scramble, and that page was not edited.)

Algorithm preservation: every exported value in the edited data files was compared with the base commit
after dropping prose-only keys (`text`, `caption`, `orientation`, `goal`, `how`, `notes`, `name`, `title`
and similar). The only differences reported are for export arrays of plain prose strings (`heiseFacts`,
`heiseGaps`, `marshallGaps`), which the checker cannot separate from data. Separately, every move sequence in
each edited file was compared with the base, including sequences quoted in prose. The only differences are
prose mentions that were removed; each quoted algorithm also appears in the unchanged card data.

## Environment note

Port 8765 was held by another session's server on the main checkout, so the worktree was served on 8766 and
the base snapshot (`git archive 969870c`) on 8767. The word-count script was run with its port changed in a
scratch copy. The log script itself is unchanged.

## Stale card noticed, not changed

The CFOP hub (`3x3/cfop/index.html`) still shows a "Coming soon" card for "Full OLL / PLL", although the full
57 and 21 lists have been on the OLL and PLL pages since 2026-10-23. Changing the card is a navigation or
content decision outside this brief, so it is left for the owner.
