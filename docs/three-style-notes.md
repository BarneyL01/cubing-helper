# 3-Style corners: what is known, decided and checked

Read this before working on any blind / 3-style page or answering the owner's 3-style questions. Everything
marked *checked* was confirmed in the cube simulator (`js/cube-sim.js`, helpers in `log/three-style-lib.mjs`)
in an earlier session — do not re-simulate it unless the data changes. Last updated 2026-11-08.

## How to talk to the owner about it

- **Speffz sticker letters only.** Never UFR / DFL / "corner V" names (owner: "I can't imagine these, I am
  learning Speffz"). Say "D′ moves K into the G position, then the commutator moves buffer → G → D".
- **C is always "the buffer".** No "helper" in 3-style (that is an Orozco word for B).
- **Orozco is the bridge.** Explain new ideas as "like Orozco, but …". The owner understands Orozco's bases
  as interchange (U′) + outside position (L / H / O).
- Terms (from the Commutators page): **insertion** (the 3-move R … R′ part), **interchange** (the single
  turn), **positions** named by sticker letter. Slot words used once: insertion slot / interchange slot /
  outside slot — prefer "position" and letters.
- Short, phone-sized answers, tables, outcome first; no analogies. Repeated patterns are easier for the owner
  than shorter non-repeating ones (kept the 18-move twist over a 16-move one).
- Moves the owner dislikes: M (M′ and M2 fine), L as a main move, B (setups only, and even then avoided).

## Letters (checked)

| Corner (top/bottom letter) | Stickers |
|---|---|
| A | A E R | 
| B | B N Q |
| C (buffer) | C J M |
| D | D F I |
| U | U G L |
| V | V K P |
| W | W O T |
| X | X H S |

Left layer = corners A, D, U, X (stickers A E R, D F I, U G L, X H S).

Where one turn sends each sticker (checked; `X→Y` = the sticker at X goes to Y's place):

| Turn | Moves |
|---|---|
| U | A→B B→C C→D D→A E→Q F→R I→E J→F M→I N→J Q→M R→N |
| U′ | A→D B→A C→B D→C E→I F→J I→M J→N M→Q N→R Q→E R→F |
| U2 | A→C B→D C→A D→B E→M F→N I→Q J→R M→E N→F Q→I R→J |
| D | G→K H→L K→O L→P O→S P→T S→G T→H U→V V→W W→X X→U |
| D′ | G→S H→T K→G L→H O→K P→L S→O T→P U→X V→U W→V X→W |
| D2 | G→O H→P K→S L→T O→G P→H S→K T→L U→W V→X W→U X→V |
| R | B→T C→Q J→B K→C M→N N→O O→P P→M Q→W T→V V→J W→K |
| R′ | B→J C→K J→V K→W M→P N→M O→N P→O Q→C T→B V→T W→Q |
| L | A→I D→L E→F F→G G→H H→E I→U L→X R→D S→A U→S X→R |
| L′ | A→S D→R E→H F→E G→F H→G I→A L→D R→X S→U U→I X→L |

D and L never touch B or C, so D/L setups never move the buffer; B is the only top position they cannot
reach (so pairs with N or Q need the buffer to move, unless B turns are used).

## The four families of bases (checked; on the By base page and 3-Style solves)

A base = commutator that solves a pair with no setup. Middle turn of the insertion and the interchange are
always on opposite layers.

| Targets | Insertion | Interchange | D turn picks |
|---|---|---|---|
| B + O/H/L (Orozco) | `R D R′` | `U′` | O = D, H = D′, L = D2 |
| D or A + G/P/S | `R′ D R` | D: `U′`, A: `U2` | G = D, P = D′, S = D2 |
| P + L/T/H | `R U R′` | the D turn | L = D, T = D′, H = D2 |
| L + T (extra base) | `L′ U L` | `D2` | – |

As written (insertion first) the pairs are: O/H/L then B; D/A then G/P/S; P then L/T/H; L then T. Halves
swapped = the reverse pair. Letter sets in D, D′, D2 order: **O H L**, **G P S**, **L T H**.

Why (checked): `R D^k R′` swaps the B position with O / H / L; `R′ D^k R` swaps the buffer's own position
with G / P / S; `R U R′` swaps P's position with the buffer's. `U′` brings C into B, D into C; `U2` brings A
into C; `D`, `D′`, `D2` bring L, T, H into P. **Hand-off spots:** Orozco — R takes B down to T (and O to the
P spot); D/D′/D2 bring P/H/L into T; R′ lifts T into B. G P S — R′ takes C down to K (and P to the O spot);
D/D′/D2 bring G/O/S into K; R lifts K into C. P family — R takes C to Q, U takes Q to M, R′ drops M into P.

The R-family bases unused for pairs: `[R′ D^k R , U]` (0 pairs). Total: 30 R bases (15 groups with reverses)
+ `[L′ U L , D2]` and reverse; 12 groups used + L T.

## The tables (data, all generated and checked)

| Page | Data | Rule |
|---|---|---|
| 3-Style (ours) | `data/three-style-ours.js` | shortest R-core commutator, setups ≤ 3 of R U D F; pairs with B = Orozco algs; mean 10.7 moves |
| Dylan / J Perm | `data/three-style-corners.js` | from the sheet, 11 cells fixed |
| By base | `data/three-style-bases.js` | D/L setups only (≤ 4), buffer never moves; one-target first |

By base numbers (checked): one target moves 184 pairs (mean 11.7), both move 122 (12.3), N and Q 72 (use the
3-Style page's commutators). Same pairs on the 3-Style table: 10.3 / 10.9. One setup per "letter into
position" inside each group; across groups 7 letters go in another way because the usual setup would move the
other target: T into P (group H P), R into D (D S and D G), U into S (D S), I into A (A S and A G), E into P (D P) — each shown as a grey line in that group's table.

"Both targets move" structure (checked 2026-11-08; corrects an earlier "other 44 mostly P family"):

| Group | End positions | Bases | Pairs | Setup shapes |
|---|---|---|---|---|
| G P S, left layer | A or D + G or S | `R′ D R`, `R′ D2 R` vs `U′`/`U2` | 78 | L 16, D L 24, L D 18, L D L 14, D L D 4, 4-move 2 |
| G P S, with P | A or D + P | `R′ D′ R` vs `U′`/`U2` | 20 | D L 8, L D 6, D L D 4, L D L 2 |
| P family | P + L/T/H | `R U R′` vs D turns | 24 | D 2, D L 8, L D 4, L D L 6, D L D 2, 4-move 2 |
| Orozco, L T | – | – | 0 | – |

Left-layer group: both end positions on the left layer; both targets already there → one L turn (16).
P family: all on the bottom; both already on the bottom → one D turn (e.g. HL `[D : [D , R U R′]]`).
Built 2026-11-08: the "Both targets move" tab opens with this guide (BOTH_GUIDE in js/three-style-bases.js).

How often a group comes up in a solve (3,000 random solves, 3.8 corner pairs each): A P 33%, B L 20%,
A G 19%, H P 18%, A S 18%, B O 18%, D S 16%, D G 14%, D P 14%, B H 11%, L P 9%, P T 5%, L T 4%.
Learning ladder offered: A P with 0–1 move setups first (the trainer's default), then its 3-move setups,
then H P or A G. Unlearned pairs: do them the Orozco way (1st forwards, 2nd backwards).

Setup-length coverage, buffer still, one target moves (checked): no setup 32, ≤ 1 move 92, ≤ 2 moves 96,
≤ 2 with B 142.

## Orozco step 2 (built 2026-11-08)

Bounded next step after Orozco (owner found full 3-style endless). P plays B's part because L turns never touch P or
the buffer. 2a: `[R U R′ , D/D′/D2]`, positions L/T/H; P with L, D (L), R (L2), X (L′), T, H, G (L), F (L2), E (L′):
18 pairs. 2b: `[R′ D′ R , U2/U′]`: P with A, I (L′), S (L), U (L2); A or D with L (D), T (D′), H (D2): 20 pairs.
Frequency: step 1 48% of solves (0.53 pairs), 2a 13% (0.13), 2a+2b 34% (0.38). Page 3x3/bld/orozco-step2.html,
trainer presets `?preset=step2a|step2` (2a: 1 pair per solve, all share P). Everything else stays plain Orozco.

## Orozco with helper P (built 2026-11-09)

Full Orozco variant: buffer C, helper P, L and B setups (owner chose B setups for B N O Q W). Letter table, K/V rules,
twist and parity: see log/2026-11-09-orozco-p.md (all checked, 3,000 whole solves). Parity = last letter plain
Orozco (helper B) + Ra, so nothing new. Twist for buffer + P: `(R D′ R′ D)×2 F (D′ R D R′)×2 F′`.
Helper P uses THREE bases since 2026-11-09 (owner; 3-Style pages unchanged): `[R U R′ , D]` (L), `[R U R′ , D2]` (H),
`[R′ D′ R , U2]` (A). D, R into L (`L`, `L2`); T into A (`B′ L`); Q into L (`B L2`). Shortcuts with the 3 bases, ≤ 2 setup
moves: 58 letter pairs (116 both ways), 6 one-move (among A L T H), 72% of solves, 1.01 per solve. Coverage 186 = 49%.
Quick test (checked): a pair with L, T or H (not with P/V) is always a shortcut: D/D′/D2 puts that letter where P was,
then the other letter's helper-P setup + base (forwards if it is first). 45 letter pairs, 20% of solve pairs (4 bases).

## Coverage of the Orozco family (2026-11-09, 5,000 solves)

B pairs 36 (13% of solve pairs, 7.1 commutators per solve); P pairs 36 (7%, 7.4); both 70 (20%, 6.9); both +
helper-P shortcuts 188 = 50% of the 378 (46% of solve pairs, 5.9 per solve; 4-base helper P); plain Orozco 7.6; full 3-style 3.8.
Mixing per pair is fine. **Checker RNG:** use `Math.imul` (the old float LCG was skewed; fixed in all log/*.mjs).

## Orozco B shortcuts and B-or-P per pair (2026-11-10)

Orozco page has a Shortcuts section: 65 letter pairs (130), all need a B turn; quick test O/E/X play B after
B/B′/B2. Per letter, P is shorter for A I U W N Q, B for O T K V, the rest equal (see log/2026-11-10-orozco-b-shortcuts.md).
Quick test levels (2026-11-10, `data/orozco-quick.js` from `log/2026-11-10-quick-tests.mjs`, shown by `js/orozco-quick.js`
on both pages): level 1 (P: L T H; B: O E X) works with every partner, helper-corner letters included (checked, no exceptions);
level 2 = one turn from a level-1 spot, works only with 2-3 listed partners each (partner lands on a base with no setup).

## Third set of 3 bases: helper D and the walk rule (built 2026-11-10)

Full write-up: `docs/third-base-set-status.md` ("Answers"); checker `log/2026-11-10-third-helper-set.mjs` (ALL OK).
- Only three corners can hold an Orozco-style helper (two free faces): B (D, L free), P (L, B free), D (D, B free).
  Third set = **helper D**: `[R′ D^k R , U′]`, positions G / P / S (recommended, already the "D + G/P/S" family), or
  `[F D^k F′ , U′]`, positions K / T / H (shorter setups). Either + the 6 known = 378 / 378, setups ≤ 3 of D L B.
- Helper D twist `(R′ D′ R D)×2 U′ (D′ R′ D R)×2 U`; F: 1st twist, 2nd backwards; I the opposite. 3,000 whole solves.
- **Walk rule** for any pair: each letter has one walk into a helper's place (0: B P D; 1: O E X → B, L T H → P,
  R → D; 2: A G N W via H, Q S via T, K via O, F via E, U via X → B, V via X → D; I never walks). Walk the letter with
  the shorter walk, then the other letter's setup for that helper. All 378, mean setup 2.02; 5 exception pairs
  (IK, IR, IU, RV, UV) have listed 3-move setups.
- Owner chose `[R′ D^k R , U′]` (2026-11-10). Built: `3x3/bld/orozco-d.html` (data/orozco-d.js, js/orozco-d.js,
  log/2026-11-10-orozco-d.mjs) and `3x3/bld/walk-rule.html` (js/walk-rule.js, data/walk-rule.js). Menu section
  "Orozco helpers" holds Orozco step 2, Helper P, Helper D, Walk rule. Not built: a 3-Style solves preset for the walk rule.

## Hard letters and Buffer moves (2026-11-11)

I, V, Q, U pairs (132, 30% of solve pairs) are long with the walk rule (13.1): D/L/B barely move them and no 8-move
buffer base contains I, N or V. A 4th helper (Q) clears the 5 exceptions but helps little; the U family
`[R/L B^k R'/L' , F2]` was rejected (owner: no B in a base). Built instead: Buffer moves page (owner's 9 bases only, setups that may
move the buffer, R U F D first, L/B when 1+ move shorter): 104 hard pairs 13.4 → 11.3, plus 32 other big savings. See log/2026-11-11-buffer-moves.md.
**Readings (checked):** a base turns the same three corners whatever the setup; read from C, M or J it gives three
sticker cycles (L base: C → L → B, M → U → Q, J → G → N). A buffer-moving setup lands the pair on one of them; the page
shows it as Usually / Here / Holds (owner found "the faces next to it" hard to see, Q → G).

## Decisions (owner)

- **D and L setups only on By base; no B.** B was tried: B wherever shorter → 268 one-target pairs but 26 new
  bases (56 total) and 104 B setups; B only to fix problems → 46 bases. Owner: 46 is too many.
- **One extra base only:** `[L′ U L , D2]` (fixes LT, TL no setup; TX, XT with `L′`; LR, RL with `D2 L2 D2`).
- **Pairs with B keep the owner's Orozco commutators**, no alternatives (shorter ones save 1–3 moves on 16).
- **Twist:** keep `(R′ D′ R D)×2 U (D′ R′ D R)×2 U′` (18 moves). It cancels to 16
  (`R′ D′ R D R′ D′ R U R′ D R D′ R′ D R U′`, the D U D′ = U cancellation) but the owner prefers the
  grouped 18. Nothing on the site changed.
- **Parity (M2 edges):** last letter X → pair X then B, then the R U F Ra
  `R U R′ F′ R U2 R′ U2 R′ F R U R U2 R′ U′`; if X is B/N/Q only the Ra. Owner knows Ra (Orozco) and the
  T-perm (Old Pochmann). 3-style *edges* parity (UF buffer, usually a J-perm style swap) is not built; offered.
- **Twisted corners in Orozco** (e.g. B, C, D twisted in place): no extra move needed — buffer twist sorts
  itself (start with a cycle break); D twisted = two letters "D then F/I"; B twisted = "B then N/Q" (skip +
  twist). Checked on 40 scrambles.
- 46 bases too many; "number of bases" has no standard — Dylan's sheet: 8 cores cover 325/378.
- Core-count experiment (asked, nothing changed): 1 core group → setup 2.5 / 12.0 moves; Orozco's 3 → 2.6 /
  11.9; 4 → 2.0 / 11.1; R vs U only (6) → 1.8 / 10.7; ours (12) → 1.6 / 10.7; any 3-move insertion R U D F
  (24) → 1.4 / 10.2; all faces (80) → 0.6 / 8.9.

## Pictures (how they are drawn)

- `js/sticker-cube.js` `makeCube()`: see-through cube, sticker squares on their own faces, hidden faces
  (L, B, D) dashed; `labelAt` (beside corner) and `labelNear` (beside the square, when two stickers of one
  corner are labelled).
- Colours: buffer blue; swapped position pink thick; D-turn partners / insertion turn green; interchange
  orange; hand-off spot yellow; R lift purple; setup moves purple dashed, start position grey.
- Text: `colourCore()` in `js/three-style-families.js` colours the insertion's middle turn green and the
  interchange orange.
- Only the twist table ("Twisted corners") still uses flat nets.

## Working notes (tooling)

- Quick check snippet: `import { permOf, spotOf, letterAt } from './three-style-lib.mjs'` in a file inside
  `log/`; `to(alg, l) = letterAt.get(permOf(alg)[spotOf(l)])` gives where sticker l goes. Delete the temp file
  (the stop hook complains about untracked files).
- `node --check` on a `.js` ES module can miss errors: copy it to the scratchpad as `.mjs` first. A `'` inside
  a single-quoted JS string broke the families module once.
- Cache versions chain: `three-style-page.js?v=` is imported by three-style.html, three-style-corners.html,
  js/three-style-bases.js, js/three-style-drill.js; bump `three-style-drill.js?v=` in blind-drills.html and
  `js/three-style-bases.js?v=` in three-style-bases.html when they change. `sticker-cube.js?v=` is imported by
  page, families and bases modules — keep them equal.
- The local `python3 -m http.server 8765` dies between turns; restart before screenshots.
