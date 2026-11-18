// Pair drill: one random corner pair, the picking rule (docs/four-helper-picking-rule.md) revealed one step at a time.
// The step-building functions below have no DOM code, so log/2026-11-18-pair-drill-check.mjs can import them in Node.
// Data: data/pair-rule.js (from log/2026-11-18-pair-rule.mjs).
import { pairRule, PAIR_RULE_TURNS, PAIR_RULE_LEVEL2 } from '../data/pair-rule.js?v=2';

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
    notationSeen: src.notationSeen, notation: src.notation, count: src.count, moves: src.moves, setup: src.setup, core: src.core, spots: src.spots,
    seenPos: src.seenPos, spotsSeen: src.spotsSeen, movesSeen: src.movesSeen };
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

// ---------------------------------------------------------------- Decide mode (pure; no DOM)

const POWERS = ['', "'", '2'];
const faceOf = (mv) => mv[0];
const powerOf = (mv) => mv.slice(1);
const inverseOf = (mv) => (mv.endsWith("'") ? mv.slice(0, -1) : `${mv}'`);

// The three powers of a face, in a fixed order: X, X', X2.
export function powerOptions(mv) { return POWERS.map((pw) => faceOf(mv) + pw); }

// Four answers for a two-turn sequence: the right one and three wrong ones made by changing the power of one turn
// (same faces): both other powers of the first turn, and the first other power of the second turn. Sorted by the
// first turn's power, then the second's, so the right one is not always in the same place.
export function twoTurnOptions(first, second) {
  const alts = (mv) => powerOptions(mv).filter((x) => x !== mv);
  const list = [`${first} ${second}`, ...alts(first).map((a) => `${a} ${second}`), `${first} ${alts(second)[0]}`];
  const idx = (x) => { const [a, b] = x.split(' '); return POWERS.indexOf(powerOf(a)) * 3 + POWERS.indexOf(powerOf(b)); };
  return list.sort((x, y) => idx(x) - idx(y));
}

// Splits "[A , B]" (as seen) into the interchange (the one-move half) and the insertion (the three-move half), says which
// is written first and its first move. Derived from the string only.
export function baseDirection(row) {
  const m = row.coreSeen.match(/^\[(.+) , (.+)\]$/);
  const left = m[1], right = m[2];
  const leftIsInterchange = left.split(' ').length === 1;
  const firstMove = left.split(' ')[0];
  return {
    helperFirst: row.walked === row.first, // the letter in the helper's place is the pair's 1st letter
    firstHalf: leftIsInterchange ? 'interchange' : 'insertion',
    firstMove,
    firstMoveNot: firstMove.endsWith('2') ? null : inverseOf(firstMove),
    interchange: leftIsInterchange ? left : right,
    insertion: leftIsInterchange ? right : left,
  };
}

// Everything the Decide questions need for one pair.
export function decideFor(row) {
  const t = turnsSeen(row);
  const h = row.helper;
  const L = row.walked;
  const turnTxt = t ? [t.first, t.second].filter(Boolean).join(' ') : '';
  const seenNote = row.rotation ? ' (as seen after the rotation)' : '';
  let letterReason;
  if (row.level === 0) letterReason = `${L} is a helper letter.`;
  else if (row.level === 1) letterReason = `${L} is a one-turn letter (${t.first} takes it into the ${h} place, helper ${h}).`;
  else letterReason = `Neither letter is a helper or one-turn letter; ${L} comes first in ${PAIR_RULE_LEVEL2.slice().sort((a, b) => a.order - b.order).map((x) => x.letter).join(' ')}.`;
  let turnOptions = [];
  if (row.level === 1) turnOptions = powerOptions(t.first);
  else if (row.level === 2) turnOptions = twoTurnOptions(t.first, t.second);
  const turnReason = row.level === 0 ? 'No turn: it is already in its place.'
    : row.level === 1 ? `${turnTxt} takes ${L} into the ${h} place${seenNote}.`
      : `${t.first} turns ${L} into ${row.via}, then ${t.second} takes it into the ${h} place${seenNote}.`;
  const a = answerOf(row);
  return {
    letterOptions: [row.first, row.second],
    letter: L,
    letterReason,
    helperOptions: HELPERS,
    helper: h,
    helperReason: row.level === 0 ? `${L} is the ${h} place itself.` : `${L} reaches the ${h} place in ${row.level === 1 ? 'one turn' : 'two turns'}.`,
    rotation: row.rotation,
    rotationBack: row.rotationBack,
    turnOptions,
    turn: turnTxt,
    turnReason,
    otherNow: row.otherNow,
    otherSetup: rowSetupSeen(row),
    base: row.coreSeen,
    direction: baseDirection(row),
    commutator: { rotation: row.rotation, rotationBack: row.rotationBack, notationSeen: row.notationSeen, count: row.count },
    shorter: row.exception && row.best ? { rotation: a.rotation, rotationBack: a.rotationBack, notationSeen: a.notationSeen, count: a.count } : null,
  };
}

// Sentence for the direction of the base.
export function directionText(row, d = baseDirection(row)) {
  const nth = d.helperFirst ? '1st' : '2nd';
  const half = d.firstHalf === 'interchange' ? `the interchange ${d.interchange} comes first, then the insertion ${d.insertion}`
    : `the insertion ${d.insertion} comes first, then the interchange ${d.interchange}`;
  const start = d.firstMoveNot ? `It starts with ${d.firstMove}, not ${d.firstMoveNot}.` : `It starts with ${d.firstMove}.`;
  return `${row.walked} (the letter in the ${row.helper} place) is the ${nth} letter of the pair. In this base ${half}. ${start}`;
}

// ---------------------------------------------------------------- DOM (only runs in mountPairDrill)

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

export async function mountPairDrill(root) {
  const [{ pairRow }, { colourCore }] = await Promise.all([
    import('./three-style-page.js?v=17'),
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
    mode: saved.mode === 'decide' ? 'decide' : 'steps',
  };
  const wantedMode = new URLSearchParams(location.search).get('mode');
  if (wantedMode === 'decide' || wantedMode === 'steps') st.mode = wantedMode;
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
      const r = pairRow({ ...row, setup: a.setup, core: a.core, moves: a.moves, count: a.count, spots: a.spots,
        view: a.rotation ? { rot: a.rotation, back: a.rotationBack, pos: a.seenPos, spots: a.spotsSeen, setup: a.setupSeen, core: a.coreSeen, moves: a.movesSeen } : undefined });
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

  // ---- Decide mode: in memory only (the site keeps no statistics)
  const ds = { row: null, picks: [], right: 0, asked: 0 };
  const QUESTIONS = (d, row) => {
    const qs = [
      { title: "Which letter goes into a helper's place?", options: d.letterOptions, right: d.letter, reason: d.letterReason },
      { title: 'Which helper?', options: d.helperOptions, right: d.helper, reason: d.helperReason,
        after: d.rotation ? `Rotate ${d.rotation} first, then read everything as seen after it.` : 'No rotation needed.' },
    ];
    if (row.level > 0) qs.push({ title: row.level === 1 ? `First turn${d.rotation ? ' (as seen after the rotation)' : ''}` : `The two turns${d.rotation ? ' (as seen after the rotation)' : ''}`,
      options: d.turnOptions, right: d.turn, reason: d.turnReason, turn: true });
    return qs;
  };
  function moves(text, cls) { const n = el('span', cls); n.textContent = text; return n; }
  function renderDecide() {
    const row = ds.row;
    const stage = $('pd-dstage');
    stage.replaceChildren();
    const n = poolFor(filters()).length;
    $('pd-count').textContent = `${n} pair${n === 1 ? '' : 's'} match the filters.`;
    $('pd-dnext').disabled = !n;
    $('pd-dscore').textContent = ds.asked ? `${ds.right} of ${ds.asked} right this session` : '';
    if (!row) { stage.append(el('p', 'pd-empty', n ? 'Press Next pair.' : 'No pairs match these filters. Tick more levels or helpers.')); return; }
    const d = decideFor(row);
    const head = el('p', 'pd-pair');
    head.append(el('span', 'pd-big', row.first), ' → ', el('span', 'pd-big', row.second));
    stage.appendChild(head);
    const qs = QUESTIONS(d, row);
    qs.forEach((q, i) => {
      const card = el('div', 'pd-step pd-q');
      card.appendChild(el('h3', null, `${i + 1}. ${q.title}`));
      if (i < ds.picks.length) {
        const ok = ds.picks[i] === q.right;
        const p = el('p', `pd-line ${ok ? 'pd-ok' : 'pd-bad'}`);
        p.append(ok ? 'Right: ' : `Not ${ds.picks[i]}. Right answer: `, q.turn ? moves(q.right, 'mv-setup') : el('strong', 'pd-letter', q.right));
        card.appendChild(p);
        if (!ok) card.appendChild(el('p', 'pd-line', q.reason));
        if (q.after) card.appendChild(el('p', 'pd-line', q.after));
        if (q.turn && ok) card.appendChild(el('p', 'pd-line', q.reason));
      } else if (i === ds.picks.length) {
        const g = el('div', 'pd-choices');
        for (const o of q.options) {
          const b = el('button', 'rec-btn pd-choice', o);
          b.type = 'button';
          b.addEventListener('click', () => { ds.picks.push(o); ds.asked++; if (o === q.right) ds.right++; renderDecide(); });
          g.appendChild(b);
        }
        card.appendChild(g);
      } else return;
      stage.appendChild(card);
    });
    if (row.level === 0 && ds.picks.length >= 2) {
      const c = el('div', 'pd-step');
      c.append(el('h3', null, '3. First turn'), el('p', 'pd-line', 'No turn: it is already in its place.'));
      stage.appendChild(c);
    }
    if (ds.picks.length >= qs.length) {
      const res = el('div', 'pd-step pd-result');
      res.appendChild(el('h3', null, 'Answer'));
      const o = el('p', 'pd-line');
      o.append('Letter ', el('strong', 'pd-letter', row.other), d.otherNow === row.other ? ' did not move.' : ' is now at ');
      if (d.otherNow !== row.other) o.append(el('strong', 'pd-letter', d.otherNow), '.');
      res.appendChild(o);
      const su = el('p', 'pd-line');
      su.append(`Setup for ${d.otherNow} with helper ${d.helper}: `);
      if (d.otherSetup) su.append(moves(d.otherSetup, 'mv-setup')); else su.append('none');
      res.appendChild(su);
      const b = el('p', 'pd-line');
      b.append('Base as seen: ');
      const bc = el('code'); bc.innerHTML = colourCore(d.base); b.appendChild(bc);
      res.appendChild(b);
      res.appendChild(el('p', 'pd-line pd-direction', directionText(row, d.direction)));
      const f = el('p', 'pd-line case-alg'); f.appendChild(commutator(d.commutator, false)); res.appendChild(f);
      res.appendChild(el('p', 'pd-line', `${d.commutator.count} moves.`));
      if (d.shorter) {
        const sh = el('p', 'pd-line case-alg');
        sh.append('Shorter alternative: ', commutator(d.shorter, false));
        res.append(el('p', 'pd-line', `Exception: this pair has a shorter commutator (${d.shorter.count} moves).`), sh);
      }
      stage.appendChild(res);
    }
  }
  function decideNext() {
    const r = pickPair(poolFor(filters()), ds.row && ds.row.pair);
    ds.row = r; ds.picks = [];
    renderDecide();
  }
  if (rowOf(wanted)) ds.row = rowOf(wanted);
  $('pd-dnext').addEventListener('click', decideNext);

  function applyMode() {
    const dec = st.mode === 'decide';
    $('pd-steps-mode').hidden = dec;
    $('pd-decide-mode').hidden = !dec;
    $('pd-mode-steps').setAttribute('aria-pressed', String(!dec));
    $('pd-mode-decide').setAttribute('aria-pressed', String(dec));
    if (dec) { if (!ds.row) decideNext(); else renderDecide(); } else render();
  }
  $('pd-mode-steps').addEventListener('click', () => { st.mode = 'steps'; save(); applyMode(); });
  $('pd-mode-decide').addEventListener('click', () => { st.mode = 'decide'; save(); applyMode(); });

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
    if (st.mode === 'decide') {
      if (ds.row && !poolFor(filters()).includes(ds.row)) decideNext(); else renderDecide();
    } else render();
  });
  $('pd-next-step').addEventListener('click', () => { st.shown = Math.min(STEP_COUNT, st.shown + 1); save(); render(); });
  $('pd-show-all').addEventListener('click', () => { st.shown = STEP_COUNT; save(); render(); });
  $('pd-next-pair').addEventListener('click', nextPair);

  if (!st.pair) nextPair(); else { save(); render(); }
  applyMode();
}
