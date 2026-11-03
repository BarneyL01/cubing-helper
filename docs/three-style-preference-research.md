# Why 3-style users use Dylan / J Perm's comms (research, 2026-11-03)

Question: why do 3-style solvers seem to prefer the comms in Dylan's 3-Style Learning Sheet (the "Dylan / J Perm"
page, `3x3/bld/three-style-corners.html`)?

## Short answer

**No source found says 3-style solvers prefer Dylan's sheet specifically.** The searches found no survey, no
ranking and no direct comparison. What the sources do support is narrower:

1. The corner buffer UFR (and edge buffer UF) is the community default. The reason given is ergonomics, plus the
   fact that these are the natural focal point when looking at the cube. Most of the sheet's corner comms use
   UFR as the buffer, so a learner using the sheet is following the common buffer.
2. 3-style is commutator-based. The commutators are described as intuitive, so one set is easier to learn than
   a large memorised list.
3. Setups matter. A sheet's value is in telling you the setup that gives a good commutator. One commenter said a
   sheet "just tells you the setups that give you the best commutators".
4. Competitive solvers learn the commutators as fixed algorithms. Casual solvers may build them on the fly.

## What the repo's own numbers show

From the logs (`log/2026-11-02-3style-corners.md`, `log/2026-11-03-3style-ours.md`):

| | Dylan's sheet (corner UFR) | Our table (shortest setups, R cores) |
|---|---|---|
| Pairs | 378 | 378 |
| Mean moves per pair | 12.03 (range 8-18) | 10.66 (max 13) |
| Setup length 4-5 moves | 55 pairs | none (setups up to 3 moves) |
| Core groups | 27 | 12 |

So the sheet is not the shortest option in move count. Its advantage is the grouping by commutator and its
established use. Any preference is about familiarity and learning order, not about shorter solutions. This is
an inference from the repo's numbers, not a finding from a source.

## Sources read

| Source | Read? | Used for |
|---|---|---|
| https://cubinghistory.com/BlindfoldSolving/Methods/3Style | Yes (earlier session) | Freestyle commutators; UF and UFR buffers became the majority choice; "Nightmare" buffer style |
| https://cubelelo.com/blogs/cubing/advancements-in-methods-to-solve-the-3x3-blindfolded | Yes | 3-Style uses commutators and setups; "80-90% of the algorithms are intuitive"; "arguably the best method out there in terms of both efficiency and ease-of-learning" at its level; 70-80 moves on average; large algorithm set |
| https://www.lyt0112.com/blog/blindfold-en | Yes | 18-pair corner table around UFR; "Choose consistent setups for common targets so execution does not require a fresh search each time." |
| https://jperm.net/bld/faster | Yes | 3-Style "uses intuitive commutators to cycle 3 pieces at once"; commutators "not necessary unless you are very serious about improving" |
| Speedsolving search snippets (wiki Orozco, threads "Intuitive 3-style as a beginner blind method", "3BLD buffers") | Snippets only | UF/UFR "generate speed-optimal commutators"; ergonomics argument (Huanqui); consistency matters more than the exact buffer |
| https://forum.artofmemory.com/t/february-2020-one-month-of-3-style-corners-for-3bld/46368 | No (403) | — |
| https://www.speedsolving.com/threads/intuitive-3-style-as-a-beginner-blind-method.77200/ | No (403) | — |

## Gaps

- No ergonomic study of UFR or of Dylan's setups. The ergonomic claim is community opinion.
- No source names the sheet as the most used. Dylan (J Perm's maintainer) is mentioned only as the sheet's author.
- Speedsolving and Art of Memory threads were blocked. They are where most 3-style discussion happens, so this
  research is thin.

## What would settle it

- A survey or results list of blind solvers that names their comm source.
- The two forum threads above, read from a network that can reach them.
- Timed tests of the same pairs using each set. That is a practice question, not a research one.
