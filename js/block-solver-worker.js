// Module Web Worker for Roux block practice: builds the solver tables off the page's main thread (about 2.5 s at a 4x
// CPU slowdown, over the plan's 1.5 s limit) and answers solve requests. Messages: { id, block, setup, opts } ->
// { id, result }; { ready: true } once the tables are built.
import { prepare, FIRST_BLOCK, SECOND_BLOCK, FB_EDGE, FB_SQUARE_FRONT, FB_SQUARE_BACK } from './block-solver.js?v=2';

const BLOCKS = { fb: FIRST_BLOCK, sb: SECOND_BLOCK, edge: FB_EDGE, sqF: FB_SQUARE_FRONT, sqB: FB_SQUARE_BACK };
const t0 = performance.now();
const S = Object.fromEntries(Object.entries(BLOCKS).map(([k, b]) => [k, prepare(b)]));
self.onmessage = (e) => { const { id, block, setup, opts } = e.data; self.postMessage({ id, result: S[block].solve(setup, opts) }); };
self.postMessage({ ready: true, ms: performance.now() - t0 });
