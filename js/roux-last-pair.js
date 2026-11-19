// Roux block practice: last-pair cards and the Last pair drill (docs/roux-block-practice-plan.md 11.5).
// Data: data/roux-last-pair.js, generated and checked by log/2026-11-19-roux-last-pair.mjs.
import { lastPairCards, LAST_PAIR_CLASSES, LAST_PAIR_STATS } from '../data/roux-last-pair.js?v=1';
import { colourNet } from './bld-net.js?v=5';
import { applyAlg, solvedCube } from './cube-sim.js';
import { invertAlg } from './algs.js';
import { FIRST_BLOCK, piecesAt } from './block-solver.js?v=2';

// solver-frame colours shown as you hold the cube: yellow top, red front, blue left, green right
const FRAME = { U: '#ffd500', D: '#ffffff', F: '#b71234', B: '#ff5800', L: '#0046ad', R: '#009b48' };
const SET_TITLE = { front: 'Front square solved: finish the back pair', back: 'Back square solved: finish the front pair' };
const KEY = 'cubing-helper:roux-practice-lp';
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const picture = (setup) => colourNet(applyAlg(solvedCube(), setup), FRAME, { only: new Set(Object.values(piecesAt(setup, FIRST_BLOCK.pieces)).flat()), label: 'The case: first-block pieces in colour' });
const count = (s) => s.split(' ').length;

// the finish lines: no-B first unless it is 2+ moves longer
function finishes(c) {
  const noB = `<p>Without B (${c.lengthNoB}): <code>${c.finishNoB}</code></p>`;
  const anyF = c.finish === c.finishNoB ? '' : `<p>Shortest (${c.length}): <code>${c.finish}</code></p>`;
  return c.lengthNoB >= c.length + 2 ? anyF + noB : noB + anyF;
}
const tags = (c) => `<span class="rp-tag">${c.viaTop ? 'via the top' : 'direct'}</span>${c.members > 1 ? `<span class="rp-tag">+${c.members - 1} more one U turn away</span>` : ''}`;

function card(c) {
  const d = el('div', 'rp-card');
  d.id = `lp-${c.id}`;
  d.innerHTML = `<div class="rp-card-head"><div class="drill-net" style="max-width:180px">${picture(c.setup)}</div><div>
    <p><strong>${c.id}</strong>${tags(c)}</p>${finishes(c)}
    <p class="bld-note">Set it up from a solved cube (yellow top, red front): <code>${c.setup}</code></p></div></div>`;
  return d;
}

export function mountLastPair(slots, opts = {}) {
  let st = { filter: 'all', id: null, u: '' };
  try { st = { ...st, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* keep the default */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* not saved */ } };
  let built = false;

  // ---- cards: one section per square, one collapsed group per piece position, built when opened
  function buildCards() {
    const s = LAST_PAIR_STATS;
    slots.cards.append(el('p', 'bld-note', `${s.cards} cards (${s.front} per square): cases one U turn apart are one card. "Via the top" = the shortest finish has both pieces on the top layer before its last two moves (${s.viaTop} cards); "direct" finishes do not. Mean finish ${s.meanLength} moves, ${s.meanNoB} without B (the same length in ${s.noBSame} cards).`));
    for (const set of ['front', 'back']) {
      slots.cards.append(el('h3', null, SET_TITLE[set]));
      LAST_PAIR_CLASSES.forEach((title, cls) => {
        const list = lastPairCards.filter((c) => c.set === set && c.cls === cls);
        const det = el('details', 'ts-core');
        det.append(el('summary', null, `<span><strong>${title}</strong><span class="ts-sum-base bld-muted">${list.length} cards · ${list.filter((c) => c.viaTop).length} via the top</span></span>`));
        det.addEventListener('toggle', () => { if (det.open && det.children.length === 1) for (const c of list) det.append(card(c)); });
        slots.cards.append(det);
      });
    }
  }

  // ---- the drill: a random card (and a random U turn of it), its setup, the answer behind a button
  const box = slots.drill;
  const how = el('p', 'drill-how', 'Hold a solved cube yellow on top, red in front, do the setup, then finish the block. Plan in inspection if you like.');
  const filt = el('label', null, 'Cases <select><option value="all">All</option><option value="direct">Only “direct” (not via the top)</option></select>');
  const sel = filt.querySelector('select');
  const setupP = el('p', 'scramble-text');
  const pic = el('div', 'drill-net');
  const controls = el('div', 'rec-controls');
  const show = el('button', 'rec-btn rec-btn-primary', 'Show the answer'); show.type = 'button';
  const next = el('button', 'rec-btn', 'Next case'); next.type = 'button';
  const start = el('button', 'rec-btn', 'Start inspection'); start.type = 'button';
  controls.append(show, next, start);
  const track = el('div', 'rec-timer'); const bar = el('div', 'rec-timer-bar'); track.append(bar); track.hidden = true;
  const phase = el('p', 'drill-label');
  const ans = el('div'); ans.hidden = true;
  box.append(how, filt, el('p', 'drill-label', 'Setup (from solved):'), setupP, controls, track, phase, pic, ans);

  const pool = () => lastPairCards.filter((c) => st.filter === 'all' || !c.viaTop);
  function pick() {
    const p = pool();
    const c = p[Math.floor(Math.random() * p.length)];
    st.id = c.id; st.u = ['', ...c.uTurns][Math.floor(Math.random() * (c.uTurns.length + 1))];
    save();
  }
  let raf = 0;
  function draw() {
    sel.value = st.filter;
    let c = lastPairCards.find((x) => x.id === st.id);
    if (!c || (st.filter === 'direct' && c.viaTop)) { pick(); c = lastPairCards.find((x) => x.id === st.id); }
    const setup = st.u ? `${c.setup} ${invertAlg(st.u)}` : c.setup;
    setupP.innerHTML = `<code>${setup}</code> <span class="bld-muted">(${count(setup)} ${count(setup) === 1 ? "move" : "moves"})</span>`;
    pic.innerHTML = picture(setup);
    ans.innerHTML = `${st.u ? `<p><strong>First ${st.u}</strong>, then card ${c.id}:</p>` : `<p>Card ${c.id}:</p>`}${finishes(c)}<p>${tags(c)}</p>`;
  }
  show.addEventListener('click', () => { pic.hidden = false; ans.hidden = !ans.hidden; show.textContent = ans.hidden ? 'Show the answer' : 'Hide the answer'; });
  next.addEventListener('click', () => { cancelAnimationFrame(raf); track.hidden = true; phase.textContent = ''; pic.hidden = false; pick(); ans.hidden = true; show.textContent = 'Show the answer'; draw(); });
  sel.addEventListener('change', () => { st.filter = sel.value; save(); draw(); });
  start.addEventListener('click', () => {
    const secs = opts.inspectSecs ? opts.inspectSecs() : 15;
    const end = Date.now() + secs * 1000;
    track.hidden = false; ans.hidden = true; show.textContent = 'Show the answer';
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      bar.style.width = `${(100 * left) / (secs * 1000)}%`;
      phase.textContent = left ? `Inspection: ${Math.ceil(left / 1000)} s` : 'Close your eyes and do your plan. Then open them and check, or show the answer.';
      if (left) raf = requestAnimationFrame(tick); else { track.hidden = true; pic.hidden = true; }
    };
    tick();
  });
  return { show() { if (!built) { built = true; buildCards(); } draw(); } };
}
