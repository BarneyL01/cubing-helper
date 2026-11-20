# 2026-11-20: cycle-break rule and drill

Owner: stuck at the memo when the cycle closes and the helper corners are already solved (answers: memo moment; helper
corners solved; wants a simple rule and a drill). The rule is the one js/bld-memo.js already uses everywhere: check the
corners in the order A B D G H K O (first letters; buffer corner C J M never), break into the first neither solved nor
already traced, on its first letter; write the letter you come back on.

- Which group? page: section "When the cycle closes (memo)" with the order table (helper corners marked) and a link.
- Blind drills mode "Cycle breaks" (`?mode=cbreak`, `js/cycle-break-drill.js`, state `cubing-helper:cycle-break`):
  corners-only scrambles (from js/bld-drill.js) with at least one break, optional "helper corners (B, D, K) solved";
  shows the memo so far at each break, the answer behind a button with the corner-by-corner check and the new cycle.
- Check: `node log/2026-11-20-cycle-break-check.mjs` → ALL OK (4,284 breaks over 3,000 random scrambles follow the
  rule; 300 drill scrambles have a break, solved edges, and solved helper corners when asked).
