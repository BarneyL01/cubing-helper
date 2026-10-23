# Content edit brief (2026-10-23)

Owner's request: "Some sections are very wordy, e.g. the commutator page, where the diagram and worked
example is actually the key part. Review all pages, except the new Recognition practice one."

This brief is for the agent doing the edit. Read `CLAUDE.md` first. The job is **cutting and tightening
words**. It is not a redesign: no new sections, no new features, no navigation or menu changes (a
navigation redesign comes separately, after this).

## The rule for every page

1. **The picture and the worked example carry the explanation.** Text says only what the picture,
   table or card cannot show. If a caption already says it, the paragraph above must not say it again.
2. **Short.** Paragraphs of at most 2–3 sentences. Prefer a numbered list of steps (one action each) or a
   table. One idea per sentence. Picture-strip captions at most ~15 words.
3. **Say each thing once.** Don't explain the same idea in the intro, a note and a caption. If another
   page explains it, give one line and a link instead of repeating it.
4. **Provenance and checking details go in the page's `.source-note`** (it is folded into the collapsed
   "About this page" at the bottom): "not from your notes", source credits, "checked by
   `log/…mjs`", counts of positions tested. Keep the facts, but out of the main text, in 1–3 sentences.
5. **Keep honesty statements**, just shorter: "not checked", "not from your notes", "Added here, not on the
   wiki", "I haven't found a simple rule…", corrections of the owner's notes. One sentence each.
6. **Style:** plain and literal, no similes, metaphors or analogies; no em-dash asides; British spelling as
   now; the user's word **Sassy** for `R U R' U'` (never the other name).

## Do not change

- Any algorithm, move sequence, mnemonic word, Libby's line, table data, picture, card, case, exercise,
  setup scramble, or number in a table. Text only.
- Element `id`s, `h2.section-heading` ids and `data-short` labels (the jump bars and links use them), the
  order and number of sections, and headings' meaning (you may shorten a heading's words).
- `3x3/practice/recognition.html`, `js/site-chrome.js` (menu), any `js/` logic. You may edit text strings in
  page HTML and in `data/*.js`.
- **Generated text.** `data/corner-bases.js`, `data/corner-cycles.js`, `data/edge-cycles.js`,
  `data/heise.js` have `// BEGIN GENERATED … // END GENERATED` blocks: never hand-edit inside them. If text
  you want to shorten is inside one (captions, example notes), edit the string in the generator in `log/`
  that writes it (`2026-10-21-bld-three-base.mjs` → corner-bases, `2026-10-16-bld-cycles-generate.mjs` →
  corner-cycles and edge-cycles, `2026-10-20-heise-examples.mjs` → heise), run it with `--write`, and check
  it still prints ALL OK. `data/lse-map.js` (from `2026-10-22-lse-eo-map.mjs`) and
  `data/corner-8355*.js` are generated whole files: leave their data alone.
- Cache-busting: when you change a `data/*.js` file that a page imports with `?v=N`, bump that `N` in every
  page that imports it.

## Page by page (word counts measured 2026-10-23 at 390 px; targets are rough)

| Page | Now | Target | What to do |
|---|---|---|---|
| `3x3/bld/commutators.html` + `data/commutators.js` | 1,030 | ~500 | **The owner's example.** "How a commutator works" (374 words): one-sentence definition + the `[R U R', D]` example line, then let the picture strip carry it; each frame caption ≤ 15 words; "Why it works" one sentence; the Speffz-naming note one line. "Building one yourself": numbered steps only. Exercises intro ≤ 2 sentences. "Generating unlimited practice" (156) → ~50. |
| `3x3/bld/corner-cycles.html` + generator text | 2,290 | ~1,100 | Sections 3 "The three bases" (486) and 4 "How a setup turns a base into any pair" (543) are mostly prose around the cards: cut to 2–3 sentences each, the forms table and cards stay. Section 5 "Working out a pair yourself": ≤ 5 numbered steps, ~70 words. Section 7 "What to learn first": the lists plus one sentence. Sections 1–2: shorten the steps; the worked example table is the key part. |
| `3x3/8355/index.html` + `data/method-8355.js` | 2,310 | ~1,300 | "Remaining edges" (1,100): the cycle in 2 sentences, Part A and Part B as short numbered steps, picture-strip captions ≤ 15 words, the long "Checked in the simulator…" paragraph → one sentence (details to the source note). "Last five corners" (439) → ~250. "Three middle edges" (315) → ~180. Keep every "Added here, not on the wiki" note, one sentence each. |
| `3x3/heise/index.html` + `data/heise.js` (non-generated parts) + generator captions | 3,050 | ~1,600 | "Build four squares" (837) → ~350: rules as a 4-item list, the order as 4 short steps, techniques as a short list, the "where the squares sit" derivation → 2 sentences + note. Step 3 (966) → ~450. Step 4 (552) → ~300. "What is not on this page yet" → a plain bullet list, ~80 words. |
| `3x3/marshall/index.html` + `data/marshall.js` | 2,550 | ~1,400 | Each step ≤ ~200 words, as numbered steps; "Middle-layer edges" (479) and "Top edges" (408) most. "What is not checked yet" → bullets, ~80 words. Keep the credit to Marshall. |
| `3x3/roux/index.html` + `data/roux.js` | 2,170 | ~1,400 | 4a notes (593 with cards) and 4c (513): cut the notes, not the cards. DFDB (386) → ~220. "Your recorded LSE note" (234) → ~100, keep the question to the owner. |
| `3x3/bld/corner-table.html` | 860 | ~500 | Sections 1–3: intros ≤ 2 sentences, the "how to use a setup move" steps short. |
| `3x3/bld/corner-twists.html` | 650 | ~400 | "Twisted corners" (353) → ~180. |
| `3x3/bld/edge-cycles.html` | 965 | ~600 | Sections 1–2 steps shorter; section intros ≤ 2 sentences. |
| `3x3/bld/corner-8355-lb.html` | 710 | ~450 | Section 3 intro and steps (457) → ~200; the cards stay. |
| `3x3/bld/corner-8355.html` | 260 | — | Light trim of intros only. |
| `3x3/roux/lse-map.html` | 1,030 | ~800 | The intro and "How to read a card" only; the cards' text is generated, leave it. |
| `3x3/cfop/oll.html`, `pll.html` | 290 / 350 | ~200 / ~250 | Intros and the full-list intros (180 / 149) → ~60 each. |
| `3x3/cfop/f2l.html` | 1,770 | light | The case texts are a transcription of the dogschasingsquirrels chart: leave them. Trim only the intro and panel help text. Keep the credit. |
| `3x3/beginners/index.html` + `data/beginners.js` | 690 | ~550 | Light trim; each step's "how" ≤ 4 short items where possible. |
| `3x3/bld/index.html`, `practice.html`, `3x3/cfop/index.html`, `index.html`, `2x2/index.html`, `megaminx/index.html` | small | — | Read through; trim only obvious repetition. |

## Before you finish

1. Run every check script that has a check mode and confirm it still passes (each prints ALL OK or its own
   pass line): `node log/2026-10-06-roux-lse-check.mjs`, `2026-10-16-bld-check-planner.mjs`,
   `2026-10-16-bld-cycles-generate.mjs`, `2026-10-20-heise-examples.mjs`, `2026-10-21-bld-three-base.mjs`,
   `2026-10-21-bld-8355-corners.mjs` (and `--lb`), `2026-10-22-8355-placing.mjs`, `2026-10-22-lse-eo-map.mjs`,
   `2026-10-22-marshall-check.mjs`, `2026-10-22-sassy-twist-check.mjs`, `2026-10-23-full-oll-pll-check.mjs`,
   `2026-10-23-recognition-check.mjs`. (Run from the repo root.)
2. Serve the site (`python3 -m http.server 8765` from the repo root) and load every edited page in headless
   Chromium (Playwright is at `/opt/node22/lib/node_modules/playwright`, browser
   `/opt/pw-browsers/chromium`) at 390 px and 1280 px: no console errors, no horizontal page scroll, every
   section heading still present.
3. `git diff --stat` and check that no algorithm or table value changed (search the diff for changed move
   strings).
4. Add `log/2026-10-23-content-edit.md`: a table of each page's word count before and after (measure the
   prose the same way: paragraphs, list items and captions in `main`, not tables or code), and any place you
   left long on purpose and why.
5. Commit with a clear message. Do not merge to `main`.
