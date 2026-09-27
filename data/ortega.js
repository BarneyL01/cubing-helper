// 2x2 Ortega method: solve one side (intuitive, not recorded here), then
// orient the other side's corners (OLL), then permute both layers (PBL).
import { cornerOrientationCases } from './corner-orientation.js';

// Ortega's OLL step is exactly the shared 7 corner-orientation cases,
// rendered on a 2x2 puzzle instead of the default 3x3.
export const ortegaOllCases = cornerOrientationCases.map((c) => ({
  ...c,
  puzzle: '2x2x2',
}));

export const ortegaPblCases = [
  {
    id: 'two-bars-front',
    name: 'Two bars, both facing front',
    puzzle: '2x2x2',
    alg: "R2 U' B2 U2 R2 U' R2",
  },
  {
    id: 'no-bars',
    name: 'Top & bottom, no bar',
    puzzle: '2x2x2',
    alg: "R2 F2 R2",
  },
  {
    id: 'one-bar-one-none',
    name: 'One bar, other side has none',
    orientation: 'Put the bar on top, facing you.',
    puzzle: '2x2x2',
    alg: "R U' R F2 R' U R'",
  },
  {
    id: 'one-side-solved-bar',
    name: 'One side solved, other has a bar',
    orientation: 'T-perm — same algorithm as CFOP 2-look PLL.',
    puzzle: '2x2x2',
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
  },
  {
    id: 'one-side-solved-no-bar',
    name: 'One side solved, other has no bar',
    orientation: 'Y-perm — same algorithm as CFOP 2-look PLL.',
    puzzle: '2x2x2',
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  },
];
