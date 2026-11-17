# Learning plan for the owner's 3-style corners (2026-11-17)

Status: **plan only, nothing built.** For an agent to build from. Background: `docs/three-style-review.md` (why),
`docs/four-helper-picking-rule.md` (the rule), `docs/three-style-notes.md` (facts and preferences).

## 1. Decisions (owner, 2026-11-17)

- **Design frozen:** helpers B, D, F, K and the picking rule as built (`data/pair-rule.js`). No new groups, bases or
  rules until the owner says the four tables are known. Do not propose new designs.
- Aim: 3-style (one commutator per pair), as an exercise in learning; speed is second.
- **First goal: the four helper tables** (18 letters each, 72 setups). Order B, D, K, F; one table until it needs no
  lookup; K and F not in the same week (both are "as seen after the rotation").
- After the tables: the first turns (level 1, then level 2) from the picking rule.
- **The site may keep a record of what is known, with timing** (browser only). This reverses "no statistics" for the
  blind corner drills only.
- The owner's stated difficulties: setups that move several pieces and remembering how to undo them; recent changes
  mixed up what was known; pair commutators feel like memory work, Orozco feels like understanding.

## 2. How to present a pair (wording rule for every page and drill)

A pair is an Orozco letter with a turn in front: first turn → the other letter's usual setup → base → undo the setup →
undo the first turn. Only the first turn is new. Show the undo as the same turns in reverse order, each turned the other
way, and say which part the owner already knows from the helper's table.

## 3. What to build

### 3.1 Table drill (new; the main piece)

One drill for the helper tables, as a mode of Pair drill or a new Practice page (builder's choice; add to `MENU`).

- Choose a helper (B, D, K, F). The drill shows one letter; the owner answers from memory: setup, then position.
- Reveal in steps: position the letter goes to → setup (as seen after the rotation for K and F, with the rotation
  shown) → the whole commutator forwards and backwards → the undo spelled out. Pictures from `pairRow` / `makeCube`.
- Order inside a table: by position (the three no-setup letters, then one-move setups, then the rest), selectable:
  "new letters in order" or "all mixed".
- Data: `data/orozco-corners.js`, `orozco-d.js`, `orozco-k.js`, `orozco-f.js` (use `zSetup`, `zForwards`,
  `zBackwards` for K and F). Helper letters' own corners (twists, skips) are a separate filter, off by default.

### 3.2 The record (new)

- localStorage `cubing-helper:corner-record`: per helper and letter `{ seen, right, lastMs, avgMs, lastSeen, due }`;
  later the same per pair for the pair drill.
- The owner marks each answer "knew it" / "not yet"; time runs from showing the letter to pressing Reveal.
- Next item: mostly items marked not yet or slow (above the table's median), some known ones for review; a known item
  comes back after a growing gap (1, 2, 4, 8 days). Keep the rule simple and written on the page.
- A small table per helper: letters known / not yet, slowest five. A "Reset this table" button. No charts, no
  session history, nothing sent anywhere.
- "Table passed" = every letter marked known on two different days; the page says so and suggests the next table.

### 3.3 Whole solves per table

- Blind drills corner methods: add "Orozco with helper F" and "Orozco with helper K" (planners `js/orozco-f.js`,
  `js/orozco-k.js` do not exist yet; the generators in `log/2026-11-17-orozco-f.mjs` / `-k.mjs` already try to import
  and check them, 500 solves each). B and D exist.

### 3.4 Pair drill (exists): small changes

- Use the record (3.2) per pair once the tables are passed; presets for the steps in section 4.
- Reveal text follows section 2 (what is known already, what is new, the undo).

### 3.5 Menu and pages (tidy, no new content)

- One section for the frozen design: the four helper pages, Which group?, Pair lookup.
- Move superseded pages to one section "Earlier attempts": Orozco step 2, Helper P, 3-Style by base, Buffer moves,
  3-Style (ours), Dylan / J Perm. Keep them reachable; do not delete. Ask the owner before moving anything they still use.
- Orozco page: the "Shortcuts" section (O, E, X after a B turn) is level 1 of the rule; relabel and link to Which group?.

## 4. Learning order (shown on the drill page as steps)

| Step | Practise | New |
|---|---|---|
| 1 | Helper B table (plain Orozco) | none |
| 2 | Helper D table | 18 setups |
| 3 | Helper K table (after y') | 18 setups |
| 4 | Helper F table (after z) | 18 setups |
| 5 | Pairs with a helper letter (level 0) | nothing: table recall in pairs |
| 6 | Pairs with O, E, X, then R, L, then G, S, H (level 1) | 8 first turns |
| 7 | The nine hard letters (level 2) | 9 first turns |

Corner moves per solve as the steps are learnt, the rest plain Orozco: 71.1 → 47.0 after step 6 → 40.8 after step 7
(`docs/three-style-review.md`).

## 5. Checks (site standards)

- Node checker in `log/` for the drill's step logic over all 72 letters (each revealed commutator is the pure 3-cycle
  buffer → letter → helper or its reverse; rotated forms equal the held moves) and for the scheduling rule (pure
  function, tested with a fixed clock).
- Headless Chromium at 390 px: no console errors, no sideways scroll, controls ≥ 44 px.
- Update `CLAUDE.md` (the "statistics not built" line gets this exception), `docs/three-style-notes.md`, a dated `log/`
  entry.
