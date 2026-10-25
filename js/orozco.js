// Orozco corners for a scrambled cube: memo from the buffer's top sticker C (UFR), then one
// commutator per target — forwards for 1st, 3rd, … targets, backwards for 2nd, 4th, … — with
// the helper UBR's letters handled by the rules in data/orozco-corners.js, and the parity fix
// at the end for an odd number of targets. Do the M2 edges (and their parity) first.
// Checked by log/2026-10-25-orozco-corners.mjs.
import { expandBrackets, invertAlg } from './algs.js';
import { cornerMemoFrom } from './bld-memo.js';
import {
  OROZCO_BUFFER, orozcoCorners, OROZCO_TWIST, OROZCO_TWIST_REV, OROZCO_HELPER_RULES, OROZCO_PARITY,
} from '../data/orozco-corners.js';

const ROW = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r]));
const HELPER = Object.fromEntries(OROZCO_HELPER_RULES.map((r) => [r.letter, r]));
const TWISTS = { twist: OROZCO_TWIST, 'twist-rev': OROZCO_TWIST_REV, skip: '' };

// { targets, steps: [{ letter, cycleBreak, first, how, notation, moves }], parity, parityAlg }
export function orozcoCornerPlan(state) {
  const targets = cornerMemoFrom(state, OROZCO_BUFFER.letter);
  const steps = targets.map((t, i) => {
    const first = i % 2 === 0; // 1st of its pair
    const h = HELPER[t.letter];
    if (h) {
      const how = first ? h.odd : h.even;
      return { ...t, first, how, notation: TWISTS[how], moves: expandBrackets(TWISTS[how]) };
    }
    const r = ROW[t.letter];
    return first
      ? { ...t, first, how: 'forwards', notation: r.notation, moves: r.moves }
      : { ...t, first, how: 'backwards', notation: `${r.notation}'`, moves: invertAlg(r.moves) };
  });
  const parity = targets.length % 2 === 1;
  return { targets, steps, parity, parityAlg: OROZCO_PARITY };
}
