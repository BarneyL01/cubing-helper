// "Libby's" notation: R = 1, U = 2, R' = 3, U' = 4 (so Sassy, R U R' U', is
// 1234). Every other move stays as written (F, F', M2, …). A double turn is
// two quarter turns: R2 = 11, U2 = 22 — the user's own T-perm example writes
// R' F R2 as 3F11.
//
// The digits are grouped the way the user's mnemonic words group the moves:
//   Y-perm  F 1434 123F' 1234 3F1F'
//   T-perm  1234 3F11 434 123F'
// Two rules reproduce both examples:
//  • a double turn stays with the word it grew from — when a word ends in R and
//    the next starts with R (Prefer + Jolly), the second R moves back into the
//    first group (3F11, then 434);
//  • a lone move that isn't an R/U move (the G in "Prefer G") joins the group
//    before it, if that group has more than one move.
const QUARTER = { R: '1', "R'": '3', U: '2', "U'": '4' };
const HALF = { R2: '11', "R2'": '11', U2: '22', "U2'": '22' };

export const toLibbyMove = (move) => QUARTER[move] ?? HALF[move] ?? move;

const tokens = (s) => s.trim().split(/\s+/).filter(Boolean);

// R2 and U2 as two quarter turns, so "R2" and "R" "R" compare equal.
const quarterTurns = (list) =>
  list.flatMap((t) => (HALF[t] ? [t.replace(/2'?$/, ''), t.replace(/2'?$/, '')] : [t]));

// A word's moves as groups; "(R U R' U')×3" is three groups of four.
function wordGroups(chunks) {
  const groups = [];
  for (const chunk of chunks) {
    const repeat = chunk.moves.match(/^\((.*)\)\s*×\s*(\d+)$/);
    if (repeat) for (let i = 0; i < Number(repeat[2]); i++) groups.push(tokens(repeat[1]));
    else groups.push(tokens(chunk.moves));
  }
  return groups;
}

// The groups of moves (as written, e.g. "R2" is one move) that become the
// space-separated pieces of the Libby's line.
// alg: the whole algorithm; chunks: [{ word, moves }] in order (optional).
export function libbyGroups(alg, chunks) {
  const all = tokens(alg);
  let groups = chunks && chunks.length ? wordGroups(chunks) : null;
  // If the words don't spell out the algorithm exactly, don't guess: one group.
  if (!groups || quarterTurns(groups.flat()).join(' ') !== quarterTurns(all).join(' ')) groups = [all];

  for (let i = 1; i < groups.length; i++) {
    const prev = groups[i - 1];
    const cur = groups[i];
    if (cur.length && prev.at(-1) === cur[0] && QUARTER[cur[0]]) prev.push(cur.shift());
    if (!cur.length) { groups.splice(i, 1); i--; }
  }
  for (let i = 1; i < groups.length; i++) {
    const [only] = groups[i];
    if (groups[i].length === 1 && !QUARTER[only] && !HALF[only] && groups[i - 1].length > 1) {
      groups[i - 1].push(only);
      groups.splice(i, 1);
      i--;
    }
  }
  return groups;
}

export function libbyNotation(alg, chunks) {
  return libbyGroups(alg, chunks).map((g) => g.map(toLibbyMove).join('')).join(' ');
}
