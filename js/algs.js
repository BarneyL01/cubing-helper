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

// Expands the commutator and repeat notation used on the cycles pages:
//   [A: B] -> A B A'          [A, B] -> A B A' B'     (nesting allowed)
//   (X)×n  -> X repeated n times
// e.g. "[U: [R U R', D]]" -> "U R U R' D R U' R' D' U'".
export function expandBrackets(text) {
  let out = text;
  for (;;) {
    const next = out
      .replace(/\(([^()]*)\)\s*[×x](\d+)/g, (_, body, n) => Array(Number(n)).fill(body).join(' '))
      .replace(/\[([^[\]]*)\]/g, (_, body) => commutator(body));
    if (next === out) break;
    out = next;
  }
  return out.replace(/\s+/g, ' ').trim();
}

function commutator(body) {
  const colon = body.includes(':');
  const [a, b] = body.split(colon ? ':' : ',').map((s) => s.trim());
  const undo = invertAlg(a);
  return colon ? `${a} ${b} ${undo}` : `${a} ${b} ${undo} ${invertAlg(b)}`;
}

// Merges neighbouring turns of the same face until none are left:
// "U U" -> "U2", "U U'" -> nothing, "R U U' R'" -> nothing.
export function cancelMoves(alg) {
  const stack = [];
  for (const token of alg.trim().split(/\s+/).filter(Boolean)) {
    const [, face, num] = token.match(/^([A-Za-z]+)(2|')?$/);
    const amount = num === '2' ? 2 : num === "'" ? 3 : 1;
    const top = stack.at(-1);
    if (top && top.face === face) {
      stack.pop();
      const left = (top.amount + amount) % 4;
      if (left) stack.push({ face, amount: left });
    } else {
      stack.push({ face, amount });
    }
  }
  return stack.map(({ face, amount }) => (amount === 2 ? `${face}2` : amount === 3 ? `${face}'` : face)).join(' ');
}
