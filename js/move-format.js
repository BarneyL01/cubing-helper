// Shows an algorithm with its setup moves in a different colour from the commutator.
// A row's notation is "[S: body]" when it has a setup S (or plain body without one).
import { expandBrackets, invertAlg } from './algs.js';

const span = (cls, text) => {
  const n = document.createElement('span');
  if (cls) n.className = cls;
  n.textContent = text;
  return n;
};

// The setup moves as a coloured span.
export const setupSpan = (setup) => span('mv-setup', setup);

// The bracket notation, with the setup coloured: [S: body] -> "[" S ": " body "]".
export function notationEl(notation, setup) {
  const prefix = `[${setup}: `;
  const wrap = document.createElement('span');
  if (setup && notation.startsWith(prefix) && notation.endsWith(']')) {
    wrap.append('[', setupSpan(setup), ': ', notation.slice(prefix.length, -1), ']');
  } else {
    wrap.textContent = notation;
  }
  return wrap;
}

// Every move written out, before any cancelling: setup, commutator, undo. The setup
// and its undo are coloured.
export function movesEl(notation, setup) {
  const wrap = document.createElement('span');
  const prefix = `[${setup}: `;
  if (setup && notation.startsWith(prefix) && notation.endsWith(']')) {
    const body = expandBrackets(notation.slice(prefix.length, -1));
    wrap.append(setupSpan(expandBrackets(setup)), ' ', body, ' ', setupSpan(invertAlg(expandBrackets(setup))));
  } else {
    wrap.textContent = expandBrackets(notation);
  }
  return wrap;
}
