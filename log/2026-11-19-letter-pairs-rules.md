# 2026-11-19: letter pairs rewritten to sound rules

Owner: words like XC shock / XK shake sound alike; ch was used for both Q and other pairs; QW had no word. Owner had not
learnt any words yet, so the whole list was rewritten. Rules agreed (Q&A): X = sh, J = y, Q = qu only, C spelled C
(hard); one word only when the 2nd letter is the first and only clear consonant (bikini would read BK); two words
(2nd word starting with the 2nd letter) always for C, Q and vowels, never for K; a vowel as one word only with no other
consonant (see, bee); avoid ph, th, ng, x, soft c/g; rewrite everything.

`log/2026-11-19-letter-pairs-check.mjs` → ALL OK. It checks the rules on the spelling, that no phrase repeats, that the
1st word of a two-word pair is not another pair's word, and that no 2nd word is used for more than 3 pairs; a negative
test (bikini, shock, pharaoh, banana, sun, fox, ring, cheese, "cake cup" for CK) is rejected by it. Exceptions listed in
the checker: VK Viking, GK geek (hard g before ee), JF Y-fronts. Letter pairs page: By 1st / By 2nd letter switch.
