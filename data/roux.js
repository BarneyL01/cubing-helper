// Roux method: build left/right blocks (not recorded — intuitive), then
// CMLL (orient + permute the last layer's corners in one shot), then LSE
// (last six edges).
import { cornerOrientationCases } from './corner-orientation.js';

// This is a simplified, 2-look-style CMLL: these 7 cases only orient the
// corners. Full Roux CMLL (42 cases, orient+permute together) isn't
// recorded here — add it later if it's actually needed.
export const rouxCmllCases = cornerOrientationCases;

export const rouxLseCases = [
  {
    id: 'lse-4c',
    name: 'LSE — 4-edge recognition (2 opposite already oriented)',
    orientation:
      'With 2 opposite edges already oriented (your "2o/2"): set them left/right, then M or M\' + U2 and reverse.',
    alg: "M U2 M",
    altAlg: "M' U2 M'",
    note: 'Whichever direction you set the pair to left/right decides M vs M\' — both are the same idea mirrored.',
  },
];
