// Small WCA-notation algorithm helpers shared across pages.

// Inverts a single move token, e.g. "R" -> "R'", "R'" -> "R", "R2" -> "R2".
export function invertMove(move) {
  const match = move.match(/^([A-Za-z]+)(2)?('?)$/);
  if (!match) return move;
  const [, face, double, prime] = match;
  if (double) return `${face}2`;
  return prime ? face : `${face}'`;
}

// Inverts a full algorithm string, reversing move order and each move's direction.
// Used to derive the "before" (case) state from a "solving" algorithm: applying
// invertAlg(alg) to a solved puzzle produces the scrambled case, and then alg
// solves it back up.
export function invertAlg(alg) {
  if (!alg) return '';
  return alg
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(invertMove)
    .reverse()
    .join(' ');
}
