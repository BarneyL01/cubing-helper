// Orozco with helper P for a scrambled cube: memo from C; 1st of each pair forwards (buffer -> X -> P), 2nd backwards
// (buffer -> P -> X); helper letters P skip, K / V twist or twist backwards; an odd number of letters: the last one
// the plain Orozco way (helper B), then the Ra-perm. Same output shape as js/orozco.js, so the drills can show it.
// Checked by log/2026-11-09-orozco-p.mjs (3,000 whole solves).
import { expandBrackets } from './algs.js';
import { cornerMemoFrom } from './bld-memo.js';
import { orozcoP, OROZCO_P_TWIST, OROZCO_P_TWIST_REV, OROZCO_P_HELPER_RULES } from '../data/orozco-p.js?v=1';
import { orozcoCorners, OROZCO_TWIST, OROZCO_TWIST_REV, OROZCO_HELPER_RULES } from '../data/orozco-corners.js?v=1';
import { OROZCO_PARITY_RUF } from '../data/orozco-mnemonics.js?v=4';

const ROW = Object.fromEntries(orozcoP.map((r) => [r.letter, r]));
const HELPER = Object.fromEntries(OROZCO_P_HELPER_RULES.map((r) => [r.letter, r]));
const TW = { twist: OROZCO_P_TWIST, 'twist-rev': OROZCO_P_TWIST_REV };
const OZ = Object.fromEntries(orozcoCorners.map((r) => [r.letter, r]));
const OZH = Object.fromEntries(OROZCO_HELPER_RULES.map((r) => [r.letter, r]));
const OZT = { twist: OROZCO_TWIST, 'twist-rev': OROZCO_TWIST_REV };

// { targets, steps: [{ letter, cycleBreak, first, how, notation, moves }], parity, parityAlg }
export function orozcoPPlan(state) {
  const targets = cornerMemoFrom(state, 'C');
  const odd = targets.length % 2 === 1;
  const steps = targets.map((t, i) => {
    const first = i % 2 === 0;
    if (odd && i === targets.length - 1) {
      // parity: the last letter with plain Orozco (helper B), then the Ra-perm
      const h = OZH[t.letter];
      if (h) return { ...t, first, how: `orozco-${h.odd}`, notation: h.odd === 'skip' ? '' : OZT[h.odd], moves: h.odd === 'skip' ? '' : expandBrackets(OZT[h.odd]) };
      return { ...t, first, how: 'orozco-forwards', notation: OZ[t.letter].notation, moves: OZ[t.letter].moves };
    }
    const h = HELPER[t.letter];
    if (h) {
      const how = first ? h.odd : h.even;
      return { ...t, first, how, notation: how === 'skip' ? '' : TW[how], moves: how === 'skip' ? '' : expandBrackets(TW[how]) };
    }
    const r = ROW[t.letter];
    return first
      ? { ...t, first, how: 'forwards', notation: r.forwards, moves: r.fMoves }
      : { ...t, first, how: 'backwards', notation: r.backwards, moves: r.bMoves };
  });
  return { targets, steps, parity: odd, parityAlg: OROZCO_PARITY_RUF };
}
