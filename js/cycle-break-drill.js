// Blind drills › Cycle breaks: corner memo from C, stopped every time the cycle closes, asking which letter to break
// into. The rule is the one every memo on the site uses (js/bld-memo.js): look at the corners in the order of their
// first letters A B D G H K O (the buffer's corner C J M is never one), break into the first that is not solved (in the
// wrong place or twisted), on that first letter. breakQuestions() is DOM-free and checked by
// log/2026-11-20-cycle-break-check.mjs.
import { cornerMemoFrom, scrambledState } from './bld-memo.js';
import { drillScramble } from './bld-drill.js?v=4';
import { bldCorners } from '../data/bld.js';
import { faceOf } from './cube-sim.js';
import { rotatableCube } from './cube-rotatable.js?v=3';

const NORMAL = { U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], R: [1, 0, 0], L: [-1, 0, 0] };
const posOf = (piece) => { const p = [0, 0, 0]; for (const f of piece) NORMAL[f].forEach((v, i) => (p[i] += v)); return p.join(); };
// corners in break order, each with its three letters (first letter first)
const BY_POS = new Map();
for (const r of bldCorners) { const k = posOf(r.piece); if (!BY_POS.has(k)) BY_POS.set(k, []); BY_POS.get(k).push(r.letter); }
export const CORNER_ORDER = [...BY_POS.entries()].map(([pos, ls]) => ({ pos, letters: ls.sort().join('') })).sort((a, b) => a.letters.localeCompare(b.letters))
  .filter((c) => !c.letters.includes('C'));
export const HELPER_CORNERS = { B: 'helper B', D: 'helpers D and F', K: 'helper K' }; // keyed by the corner's first letter

const solvedCorner = (state, pos) => state.filter((s) => s.p.join() === pos).every((s) => s.colour === faceOf(s.n));

// Every cycle break in the corner memo from C: { before (letters so far), answer, corners: [{ letters, solved }] (the
// check in order, up to the answer), cycle (the letters of the new cycle, answer first) }.
export function breakQuestions(state) {
  const t = cornerMemoFrom(state, 'C');
  const out = [];
  t.forEach((x, i) => {
    if (!x.cycleBreak) return;
    // pieces solved as the memo reaches this point: solved on the cube, or already traced
    const traced = new Set(t.slice(0, i).map((y) => CORNER_ORDER.find((c) => c.letters.includes(y.letter)).pos));
    const corners = [];
    for (const c of CORNER_ORDER) {
      const done = solvedCorner(state, c.pos), was = traced.has(c.pos);
      corners.push({ letters: c.letters, solved: done, traced: was });
      if (!done && !was) break;
    }
    let j = i + 1;
    while (j < t.length && !t[j].cycleBreak) j++;
    out.push({ index: i, before: t.slice(0, i).map((y) => y.letter), answer: x.letter, corners, cycle: t.slice(i, j).map((y) => y.letter) });
  });
  return { memo: t.map((y) => y.letter), breaks: out };
}

// a corners-only scramble whose memo has at least one break (optionally with the helper corners B, D, K solved)
export function breakScramble({ helpersSolved = false, rnd = Math.random } = {}) {
  for (let tries = 0; tries < 400; tries++) {
    const n = helpersSolved ? 2 + Math.floor(rnd() * 4) : 3 + Math.floor(rnd() * 6);
    let s;
    try { s = drillScramble({ corners: Math.min(n, 8), edges: 0, rnd, budgetMs: 10 }).scramble; } catch { continue; }
    const st = scrambledState(s);
    if (helpersSolved && !['B', 'D', 'K'].every((l) => solvedCorner(st, CORNER_ORDER.find((c) => c.letters[0] === l).pos))) continue;
    const q = breakQuestions(st);
    if (q.breaks.length) return { scramble: s, ...q };
  }
  return null;
}

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const pairs = (ls) => (ls.length ? ls.join('').match(/.{1,2}/g).join(' ') : '(nothing yet)');

export function mountCycleBreak(slot, { colours }) {
  const KEY = 'cubing-helper:cycle-break';
  let st = { helpersSolved: false, scramble: null, step: 0, shown: false };
  try { st = { ...st, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* keep the default */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* not saved */ } };

  const rule = el('div', 'ts-guide', `<p><strong>The rule:</strong> when the trace comes back to the buffer's corner (C, J or M), the
    cycle is closed: don't write that letter. Check the corners in this order and break into the <strong>first one that is not
    solved</strong> (in the wrong place, or twisted), on its first letter:</p>
    <p class="drill-big" style="font-size:1.6rem">${CORNER_ORDER.map((c) => c.letters[0]).join(' ')}</p>
    <p class="bld-note">${CORNER_ORDER.map((c) => `${c.letters[0]} = ${c.letters.split('').join(' ')}`).join(' · ')}. A corner you have already traced counts as solved.
    The helper corners (B: helper B; D: helpers D and F; K: helper K) are often solved: then you skip them. Write the break letter, follow the
    trace as usual, and write the letter you come back to that corner on (it can be another of its letters if it is twisted).</p>`);
  const opts = el('label', null, '<input type="checkbox" /> Only scrambles with the helper corners (B, D, K) solved');
  const box = opts.querySelector('input');
  const scr = el('p', 'scramble-text');
  const pic = el('div', 'drill-cube');
  const q = el('div', 'drill-stage');
  const controls = el('div', 'rec-controls');
  const show = el('button', 'rec-btn rec-btn-primary', 'Show the answer'); show.type = 'button';
  const next = el('button', 'rec-btn', 'Next break'); next.type = 'button';
  const fresh = el('button', 'rec-btn', 'New scramble'); fresh.type = 'button';
  controls.append(show, next, fresh);
  const ans = el('div');
  slot.append(rule, opts, el('p', 'drill-label', 'Scramble (corners only; white top, green front):'), scr, pic, q, controls, ans);
  let cube = null, data = null;

  function load() {
    if (!st.scramble) { const r = breakScramble({ helpersSolved: st.helpersSolved }); st.scramble = r ? r.scramble : "R U R' U'"; st.step = 0; st.shown = false; save(); }
    const state = scrambledState(st.scramble);
    data = breakQuestions(state);
    if (!cube) { cube = rotatableCube(state, { palette: colours, label: 'Scrambled cube; drag to turn it' }); pic.appendChild(cube.element); } else cube.update(state);
  }
  function draw() {
    box.checked = st.helpersSolved;
    scr.innerHTML = `<code>${st.scramble}</code>`;
    const b = data.breaks[Math.min(st.step, data.breaks.length - 1)];
    q.innerHTML = b.index === 0
      ? '<p class="drill-answer">The buffer corner is already solved (its trace comes straight back).</p><p>Which letter do you start with?</p>'
      : `<p class="drill-label">Memo so far</p><p class="drill-big" style="font-size:1.6rem">${pairs(b.before)}</p><p class="drill-answer">The trace is back at the buffer's corner: the cycle is closed.</p><p>Which letter do you break into?</p>`;
    ans.hidden = !st.shown;
    show.textContent = st.shown ? 'Hide the answer' : 'Show the answer';
    next.hidden = !st.shown || st.step >= data.breaks.length - 1;
    const checks = b.corners.map((c) => `<li><strong>${c.letters[0]}</strong> corner (${c.letters.split('').join(' ')}): ${c.solved ? 'solved' : c.traced ? 'already traced' : '<strong>not solved → break here</strong>'}${HELPER_CORNERS[c.letters[0]] ? ` <span class="bld-muted">(${HELPER_CORNERS[c.letters[0]]})</span>` : ''}</li>`).join('');
    const last = st.step >= data.breaks.length - 1;
    ans.innerHTML = `<p class="drill-big">${b.answer}</p><ol class="bld-list">${checks}</ol>
      <p>Then follow from ${b.answer}: <strong>${b.cycle.join(' ')}</strong> (back to the ${b.answer} corner on ${b.cycle.at(-1)}).</p>
      ${last ? `<p class="bld-note">No more breaks. The whole corner memo: <strong>${pairs(data.memo)}</strong>.</p>` : ''}`;
  }
  show.addEventListener('click', () => { st.shown = !st.shown; save(); draw(); });
  next.addEventListener('click', () => { st.step++; st.shown = false; save(); draw(); });
  fresh.addEventListener('click', () => { st.scramble = null; load(); cube?.reset?.(); draw(); });
  box.addEventListener('change', () => { st.helpersSolved = box.checked; st.scramble = null; load(); draw(); });
  return { show() { load(); draw(); } };
}
