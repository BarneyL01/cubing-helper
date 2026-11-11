# 2026-11-11 — Letter pairs rewritten

- Owner asked for a new list of words for all pairs: X = "sh", colourful words, initials such as GQ kept, no
  near-duplicates (cat / kitten), and help with Q and J. Answers to questions: start again; J = "y" sound; rude
  words, actions/adjectives and vivid things (people and characters not chosen); for Q the owner asked whether
  "kw" is enough.
- Q: "qu" is enough when Q comes first (about 20 of 23 pairs have a real word) but not when it comes second (about
  10 of 23: aquarium, earthquake, kumquat, liquorice, mosquito, squid, tequila ...). So Q = "qu" where a real word
  exists and "ch" otherwise (couch, ditch, finch, nachos, ouch, peach, roach, urchin, witch). C words never start
  with "ch" and S words never start with "sh". **Owner has not confirmed this yet.**
- `data/letter-pairs.js` rewritten (552); checker `log/2026-10-23-letter-pairs-check.mjs` updated for the new sounds,
  the initials (GQ HQ IQ DJ QR BQ) and the "ch"/"sh" start rule: ALL OK. "No near-synonyms" was done by hand (one
  dog + chihuahua, one cat, one frog, one snake pair cobra/python, one word per rude body part); the checker only
  catches shared stems.
- Letter pairs page: subtitle, a table of the three letters said differently, headings "J (y)", "Q (qu, ch)".
  Blind drills › Memo uses the same data (`?v=2`).
