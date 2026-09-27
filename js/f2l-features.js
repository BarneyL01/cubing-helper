import { faceOf } from './cube-sim.js';

// Recognition features of an F2L case (front-right slot), read off the
// simulated cube rather than typed in, so the search can't mislabel a case.
// `state` must be held normally (centres home), as caseState() returns for
// every numbered case. On the chart, a corner in the top layer is always
// drawn above the slot, so "front"/"right" below are unambiguous.
const SLOT_CORNER = [1, -1, 1];
const SLOT_EDGE = [1, 0, 1];

const same = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
const FACING = { '0,1,0': 'up', '0,-1,0': 'down', '0,0,1': 'front', '1,0,0': 'right', '0,0,-1': 'back', '-1,0,0': 'left' };

function piece(state, colours) {
  const key = [...colours].sort().join('');
  const byPos = new Map();
  for (const s of state) {
    const k = s.p.join(',');
    byPos.set(k, [...(byPos.get(k) ?? []), s]);
  }
  return [...byPos.values()].find((ss) => ss.map((s) => s.colour).sort().join('') === key);
}

// Plain words for a case's features, so free-text search finds e.g.
// "flipped", "twisted", "white up", "joined".
export function f2lFeatureWords(f) {
  const words = {
    'both-top': 'both on top',
    'corner-slot': 'corner in slot edge on top',
    'edge-slot': 'edge in slot corner on top',
    'both-slot': 'both in slot',
  }[f.pieces].split(' ');
  words.push(`white ${f.white}`, `white facing ${f.white}`);
  if (f.pieces === 'corner-slot' || f.pieces === 'both-slot') words.push(f.white === 'down' ? 'corner correct' : 'corner twisted');
  words.push(
    {
      'slot-ok': 'edge correct',
      'slot-flipped': 'edge flipped',
      'top-front': 'front colour up',
      'top-right': 'right colour up',
    }[f.edge],
  );
  if (f.pair) words.push(`pair ${f.pair}`, f.pair === 'touching' ? 'not joined' : '');
  return words.join(' ');
}

export function f2lFeatures(state) {
  const corner = piece(state, ['D', 'F', 'R']);
  const edge = piece(state, ['F', 'R']);
  const cp = corner[0].p;
  const ep = edge[0].p;

  const cornerIn = cp[1] === 1 ? 'top' : same(cp, SLOT_CORNER) ? 'slot' : 'other';
  const edgeIn = ep[1] === 1 ? 'top' : same(ep, SLOT_EDGE) ? 'slot' : 'other';
  const bothTop = cornerIn === 'top' && edgeIn === 'top';

  // Next to each other in the top layer, and already a matching pair?
  const touching = bothTop && ((ep[0] === 0 && ep[2] === cp[2]) || (ep[2] === 0 && ep[0] === cp[0]));
  const joined = touching && edge.every((e) => corner.some((c) => same(c.n, e.n) && c.colour === e.colour));

  let edgeState;
  if (edgeIn === 'slot') {
    edgeState = edge.every((s) => s.colour === faceOf(s.n)) ? 'slot-ok' : 'slot-flipped';
  } else {
    // Which of the slot's two colours is showing on top.
    edgeState = edge.find((s) => s.n[1] === 1).colour === 'F' ? 'top-front' : 'top-right';
  }

  return {
    pieces: bothTop ? 'both-top' : cornerIn === 'slot' && edgeIn === 'top' ? 'corner-slot' : cornerIn === 'top' ? 'edge-slot' : 'both-slot',
    white: FACING[corner.find((s) => s.colour === 'D').n.join(',')],
    edge: edgeState,
    pair: bothTop ? (joined ? 'joined' : touching ? 'touching' : 'apart') : null,
  };
}
