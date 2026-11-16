// Pair drill: one random corner pair, the picking rule (docs/four-helper-picking-rule.md) revealed one step at a time.
// The step-building functions below have no DOM code, so log/2026-11-18-pair-drill-check.mjs can import them in Node.
// Data: data/pair-rule.js (from log/2026-11-18-pair-rule.mjs).
import { pairRule, PAIR_RULE_TURNS, PAIR_RULE_LEVEL2 } from '../data/pair-rule.js?v=1';

export const STORE = 'cubing-helper:pair-drill';
export const STEP_COUNT = 5;
export const HELPERS = ['B', 'D', 'F', 'K'];
export const DEFAULT_FILTERS = { levels: [1, 2], helpers: [...HELPERS], exceptionsOnly: false };

export const rowOf = (pair) => pairRule.find((r) => r.pair === pair) || null;

// Rows that pass the filters (uniform random pick from this list; every pair is equally likely).
export function poolFor(f) {
  return pairRule.filter((r) => f.levels.includes(r.level) && f.helpers.includes(r.helper) && (!f.exceptionsOnly || r.exception));
}

// A random pair from the pool, not the one just shown (unless it is the only one). rnd() is Math.random by default.
export function pickPair(pool, current, rnd = Math.random) {
  if (!pool.length) return null;
  const rest = pool.length > 1 ? pool.filter((r) => r.pair !== current) : pool;
  return rest[Math.floor(rnd() * rest.length)];
}

// The turns that take the walked letter into the helper's place, as seen after the helper's rotation:
// { first, second } (second only on level 2), or null on level 0.
export function turnsSeen(row) {
  if (row.level === 0) return null;
  if (row.level === 2) {
    const l2 = PAIR_RULE_LEVEL2.find((x) => x.letter === row.walked);
    return l2 ? { first: l2.firstTurnSeen, second: l2.secondTurnSeen } : null;
  }
  const h = PAIR_RULE_TURNS.helpers.find((x) => x.helper === row.helper);
  const l = h && h.letters.find((x) => x.letter === row.walked);
  return l ? { first: l.turnSeen, second: null } : null;
}

// The helper's usual setup for the letter where the other one is now, seen after the rotation:
// setupSeen without the turns at its front. null if the turns were cancelled into the setup.
export function rowSetupSeen(row) {
  const t = turnsSeen(row);
  const turns = t ? [t.first, t.second].filter(Boolean).join(' ') : '';
  const full = row.setupSeen || '';
  if (!turns) return full;
  if (full === turns) return '';
  if (full.startsWith(`${turns} `)) return full.slice(turns.length + 1);
  return null;
}

// What the owner is shown as the answer: the rule's commutator, or `best` for an exception.
export function answerOf(row) {
  const src = row.exception && row.best ? row.best : row;
  return { rule: src === row, rotation: src.rotation, rotationBack: src.rotationBack, setupSeen: src.setupSeen, coreSeen: src.coreSeen,
    notationSeen: src.notationSeen, notation: src.notation, count: src.count, moves: src.moves, setup: src.setup, core: src.core, spots: src.spots };
}

// Segments: { k: 't' text, 'letter', 'setup' (orange moves), 'move' (plain code), 'full' / 'held' (the commutator) }
const T = (v) => ({ k: 't', v });
const L = (v) => ({ k: 'letter', v });
const S = (v) => ({ k: 'setup', v });
const C = (v) => ({ k: 'move', v });

export function stepsFor(row) {
  const t = turnsSeen(row);
  const rot = row.rotation;
  const h = row.helper;
  const steps = [];

  // 1. level and letter
  const s1 = [];
  if (row.level === 0) s1.push([T('Level 0: '), L(row.walked), T(' is a helper letter. Use helper '), L(h), T('.')]);
  else if (row.level === 1) s1.push([T('Level 1: '), L(row.walked), T(' is one turn from the '), L(h), T(' place. Use helper '), L(h), T('.')]);
  else s1.push([T('Level 2: '), L(row.walked), T(' takes two turns to reach the '), L(h), T(' place. Use helper '), L(h), T('.')]);
  s1.push([T('Letter into the place: '), L(row.walked), T('. The other letter: '), L(row.other), T('.')]);
  if (rot) s1.push([T('Helper '), L(h), T(' is done rotated: '), C(rot), T(' first, everything below as seen after it, then '), C(row.rotationBack), T('.')]);
  steps.push({ title: 'Level and letter', lines: s1 });

  // 2. turns
  const s2 = [];
  const after = rot ? ' (as seen after the rotation).' : '.';
  if (!t) s2.push([T('No turn: '), L(row.walked), T(' is already in the place.')]);
  else if (t.second) s2.push([T('First turn '), S(t.first), T(', then '), S(t.second), T(after)]);
  else s2.push([T('One turn '), S(t.first), T(after)]);
  steps.push({ title: 'Turns', lines: s2 });

  // 3. where the other letter is now
  const s3 = [];
  if (row.level === 2 && row.via) s3.push([L(row.walked), T(' passes through '), L(row.via), T(' on the way.')]);
  if (row.otherNow === row.other) s3.push([L(row.other), T(' did not move.')]);
  else s3.push([L(row.other), T(' is now at '), L(row.otherNow), T('.')]);
  steps.push({ title: 'Where the other letter is', lines: s3 });

  // 4. its setup
  const rs = rowSetupSeen(row);
  const s4 = [];
  if (rs === null) s4.push([T('Setup for '), L(row.otherNow), T(' with helper '), L(h), T(': see the full setup below.')]);
  else if (rs === '') s4.push([T('Setup for '), L(row.otherNow), T(' with helper '), L(h), T(': none.')]);
  else s4.push([T('Setup for '), L(row.otherNow), T(' with helper '), L(h), T(': '), S(rs)]);
  steps.push({ title: `Setup for ${row.otherNow}`, lines: s4 });

  // 5. whole commutator
  const a = answerOf(row);
  const s5 = [[{ k: 'full', v: a }], [T(`${a.count} moves.`)]];
  if (row.exception) s5.push([T('Exception: the rule gives a 4-move setup ('), S(row.setupSeen), T('). This one is shorter, use it.')]);
  if (a.rotation) s5.push([{ k: 'held', v: a }]);
  steps.push({ title: 'The commutator', lines: s5 });
  return steps;
}

// ---------------------------------------------------------------- DOM (only runs in mountPairDrill)

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

export async function mountPairDrill(root) {
  const [{ pairRow }, { colourCore }] = await Promise.all([
    import('./three-style-page.js?v=15'),
    import('./three-style-families.js?v=12'),
  ]);
  const $ = (id) => root.querySelector(`#${id}`);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; } catch { /* private mode */ }
  const st = {
    pair: rowOf(saved.pair) ? saved.pair : null,
    shown: Number.isInteger(saved.shown) ? Math.max(0, Math.min(STEP_COUNT, saved.shown)) : 0,
    levels: Array.isArray(saved.levels) ? saved.levels.filter((x) => [0, 1, 2].includes(x)) : [...DEFAULT_FILTERS.levels],
    helpers: Array.isArray(saved.helpers) ? saved.helpers.filter((x) => HELPERS.includes(x)) : [...DEFAULT_FILTERS.helpers],
    exceptionsOnly: saved.exceptionsOnly === true,
  };
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch { /* private mode */ } };
  const filters = () => ({ levels: st.levels, helpers: st.helpers, exceptionsOnly: st.exceptionsOnly });

  // a link ?pair=QT opens that pair
  const wanted = (new URLSearchParams(location.search).get('pair') || '').toUpperCase();
  if (rowOf(wanted) && wanted !== st.pair) { st.pair = wanted; st.shown = 0; }

  function commutator(a, held) {
    const n = el('code');
    const notation = held ? a.notation : a.notationSeen;
    const m = notation.match(/^\[([^:]+) : (\[.*\])\]$/);
    const inner = document.createElement('span');
    inner.innerHTML = m ? `[<span class="mv-setup">${m[1].trim()}</span> : ${colourCore(m[2])}]` : colourCore(notation);
    const rot = !held && a.rotation;
    n.append(...(rot ? [`${a.rotation} · `] : []), inner, ...(rot ? [` · ${a.rotationBack}`] : []));
    return n;
  }
  function renderLine(segs) {
    const p = el('p', 'pd-line');
    for (const s of segs) {
      if (s.k === 't') p.append(s.v);
      else if (s.k === 'letter') p.append(el('strong', 'pd-letter', s.v));
      else if (s.k === 'setup') p.append(el('span', 'mv-setup', s.v));
      else if (s.k === 'move') p.append(el('code', null, s.v));
      else if (s.k === 'full') { p.className = 'pd-line case-alg'; p.append(commutator(s.v, false)); }
      else if (s.k === 'held') { p.className = 'pd-line bld-note'; p.append('Held, without the rotation: ', commutator(s.v, true)); }
    }
    return p;
  }

  function render() {
    const row = st.pair && rowOf(st.pair);
    const stage = $('pd-stage');
    stage.replaceChildren();
    const n = poolFor(filters()).length;
    $('pd-count').textContent = `${n} pair${n === 1 ? '' : 's'} match the filters.`;
    if (!row) {
      stage.append(el('p', 'pd-empty', n ? 'Press Next pair.' : 'No pairs match these filters. Tick more levels or helpers.'));
      $('pd-next-step').disabled = $('pd-show-all').disabled = true;
      $('pd-next-pair').disabled = !n;
      return;
    }
    $('pd-next-pair').disabled = !n;
    const head = el('p', 'pd-pair');
    head.append(el('span', 'pd-big', row.first), ' → ', el('span', 'pd-big', row.second));
    stage.appendChild(head);
    if (st.shown === 0) stage.appendChild(el('p', 'drill-how', 'Work it out first: the level, the turns, where the other letter ends up and its setup. Then Next step.'));
    const ol = el('ol', 'pd-steps');
    stepsFor(row).slice(0, st.shown).forEach((s, i) => {
      const li = el('li', 'pd-step');
      li.appendChild(el('h3', null, `${i + 1}. ${s.title}`));
      for (const l of s.lines) li.appendChild(renderLine(l));
      ol.appendChild(li);
    });
    stage.appendChild(ol);
    if (st.shown >= STEP_COUNT) {
      const a = answerOf(row);
      const r = pairRow({ ...row, setup: a.setup, core: a.core, moves: a.moves, count: a.count, spots: a.spots });
      r.open = true;
      stage.appendChild(r);
    }
    const done = st.shown >= STEP_COUNT;
    $('pd-next-step').disabled = $('pd-show-all').disabled = done;
    $('pd-next-step').textContent = done ? 'All steps shown' : `Next step (${st.shown}/${STEP_COUNT})`;
  }

  function nextPair() {
    const r = pickPair(poolFor(filters()), st.pair);
    st.pair = r ? r.pair : null;
    st.shown = 0;
    save();
    render();
  }

  const levelBoxes = [...root.querySelectorAll('input[name="pd-level"]')];
  const helperBoxes = [...root.querySelectorAll('input[name="pd-helper"]')];
  levelBoxes.forEach((b) => { b.checked = st.levels.includes(Number(b.value)); });
  helperBoxes.forEach((b) => { b.checked = st.helpers.includes(b.value); });
  $('pd-exceptions').checked = st.exceptionsOnly;
  $('pd-form').addEventListener('change', () => {
    st.levels = levelBoxes.filter((b) => b.checked).map((b) => Number(b.value));
    st.helpers = helperBoxes.filter((b) => b.checked).map((b) => b.value);
    st.exceptionsOnly = $('pd-exceptions').checked;
    save();
    render();
  });
  $('pd-next-step').addEventListener('click', () => { st.shown = Math.min(STEP_COUNT, st.shown + 1); save(); render(); });
  $('pd-show-all').addEventListener('click', () => { st.shown = STEP_COUNT; save(); render(); });
  $('pd-next-pair').addEventListener('click', nextPair);

  if (!st.pair) nextPair(); else { save(); render(); }
}
