// The Which group? page (3x3/bld/which-group.html) and the shared parts of Pair lookup: the four-helper picking rule
// (helpers B, D, F, K; level 0 / 1 / 2). Everything shown comes from data/pair-rule.js, generated and checked by
// log/2026-11-18-pair-rule.mjs (spec: docs/four-helper-picking-rule.md). F and K pairs are shown as seen after the
// rotation (z / y'): rotate, do the turns, the setup and the base as seen, rotate back; the as-held form is secondary.
import { pairRule, PAIR_RULE_STATS, PAIR_RULE_TURNS, PAIR_RULE_LEVEL2 } from '../data/pair-rule.js?v=2';
import { makeCube } from './sticker-cube.js?v=4';
import { pairRow } from './three-style-page.js?v=16';
import { colourCore } from './three-style-families.js?v=12';
import { invertAlg } from './algs.js';

export const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
export const st = (m) => `<span class="mv-setup">${m}</span>`;
export const alg = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[${st(m[1])} : ${colourCore(m[2])}]` : colourCore(n); };
const toks = (s) => (s ? s.split(' ').filter(Boolean) : []);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('');
const CORNERS = ['AER', 'BNQ', 'CJM', 'DFI', 'UGL', 'VKP', 'WOT', 'XHS'];
export const sameCorner = (a, b) => CORNERS.some((c) => c.includes(a) && c.includes(b));
export const RULE = Object.fromEntries(pairRule.map((e) => [e.pair, e]));
const L2 = Object.fromEntries(PAIR_RULE_LEVEL2.map((l) => [l.letter, l]));
const HELPERS = PAIR_RULE_TURNS.helpers;
const HELPER = Object.fromEntries(HELPERS.map((h) => [h.helper, h]));
const place = (h) => `${h}'s place`;
const lvName = ['Level 0', 'Level 1', 'Level 2'];

// the row to use for a pair: the best commutator for the 8 exceptions, the rule's otherwise
export const use = (e) => (e.exception ? { ...e, ...e.best, ruleSetup: e.setup, ruleCount: e.count } : e);
const split = (e) => { const n = toks(e.turns).length, t = toks(e.setupSeen); return { turnsSeen: t.slice(0, n).join(' '), rowSeen: t.slice(n).join(' ') }; };

// ---- one commutator, the way it is done --------------------------------------------------------------------------------
export const mainLine = (e) => `${e.rotation ? `<strong>${e.rotation}</strong> · ` : ''}<code>${alg(e.notationSeen)}</code>${e.rotationBack ? ` · <strong>${e.rotationBack}</strong>` : ''}`;
const chipText = (e) => [e.exception ? 'exception' : lvName[e.level].toLowerCase(), `helper ${e.helper}`, e.rotation].filter(Boolean).join(' · ');

// a pair accordion (pictures, steps, "Watch it on a cube") with the chip and the commutator as seen after the rotation
// the rotated view for the shared pair pictures (helper F / K): the cube as held after z / y'
export const viewOf = (e) => (e.rotation ? { rot: e.rotation, back: e.rotationBack, pos: e.seenPos, spots: e.spotsSeen, setup: e.setupSeen, core: e.coreSeen, moves: e.movesSeen } : undefined);
export function groupRow(e0, { id = true } = {}) {
  const e = use(e0);
  const row = pairRow({ ...e, view: viewOf(e) });
  if (!id) row.removeAttribute('id');
  row.querySelector('.ts-pair-name').after(el('span', 'wr-moved', chipText(e)));
  const code = el('code', null, alg(e.notationSeen));
  row.querySelector('summary code').replaceWith(code);
  if (e.rotation) {
    row.addEventListener('toggle', () => {
      const body = row.querySelector('.ts-pair-body');
      if (row.open && body && !body.querySelector('.wg-held')) body.prepend(el('p', 'bld-note wg-held', `Pictures and steps below: the cube as you hold it after ${e.rotation}. Without the rotation the same moves are <code>${alg(e.notation)}</code>.`));
    });
  }
  return row;
}

// ---- the steps for one pair, as the owner does them ----------------------------------------------------------------------
export function ruleSteps(e0) {
  const e = use(e0), h = e.helper, ol = el('ol', 'ts-steps');
  if (e.rotation) ol.append(el('li', null, `<strong>Read the letters, then rotate:</strong> ${st(e.rotation)}. Everything below is as you see it after the rotation${h === 'F' ? ' (the left face is now the top)' : ' (the back face is now the left, the left face the front)'}.`));
  if (e.exception) {
    ol.append(el('li', null, `<strong>Exception.</strong> The rule would give the four-move setup ${st(e.ruleSetupSeen || e0.setupSeen)}; use helper ${h} instead.`));
    if (e.setupSeen) ol.append(el('li', null, `<strong>Setup:</strong> ${st(e.setupSeen)}.`));
    ol.append(el('li', null, `<strong>Base:</strong> <code>${colourCore(e.coreSeen)}</code> cycles ${e.spots.buffer} → ${e.spots.first} → ${e.spots.second}.`));
  } else {
    const { turnsSeen, rowSeen } = split(e), other = e.other, w = e.walked;
    const into = other === e.first ? e.spots.first : e.spots.second;
    if (e.level === 0) ol.append(el('li', null, `<strong>${w} is helper ${h}.</strong> No turn first.`));
    else {
      const moved = e.otherNow !== other ? `It moves ${other} to the ${e.otherNow} position.` : `It does not move ${other}.`;
      if (e.level === 1) ol.append(el('li', null, `<strong>Turn ${st(turnsSeen)}:</strong> puts ${w} in ${place(h)}. ${moved}`));
      else {
        const [t1, t2] = turnsSeen.split(' ');
        ol.append(el('li', null, `<strong>Turn ${st(t1)}:</strong> ${w} becomes ${e.via}. <strong>Then ${st(t2)}:</strong> ${e.via} is in ${place(h)}. ${moved}`));
      }
    }
    ol.append(el('li', null, rowSeen
      ? `<strong>Set up ${other}:</strong> from the ${e.otherNow} position, ${h === 'B' ? 'Orozco' : `helper ${h}`}'s setup ${st(rowSeen)} puts it in the ${into} position.`
      : `<strong>No setup:</strong> ${other} is at ${e.otherNow}, a base position of helper ${h}.`));
    const fwd = other === e.first;
    ol.append(el('li', null, `<strong>Base:</strong> ${fwd ? `forwards (buffer → ${into} → ${h})` : `backwards (buffer → ${h} → ${into})`}, because ${fwd ? other : w} comes first: <code>${colourCore(e.coreSeen)}</code>.`));
  }
  if (e.setupSeen) ol.append(el('li', null, `<strong>Undo</strong> the setup and the turns in reverse order: ${st(invertAlg(e.setupSeen))}.`));
  if (e.rotationBack) ol.append(el('li', null, `<strong>Rotate back:</strong> ${st(e.rotationBack)}.`));
  return ol;
}

// ---- pictures: the see-through cube with the helper's place and the letters one turn brings into it -----------------------
const CUBE = makeCube(136, 102, 44);
const f = (v) => v.toFixed(1);
function arrow([a, b]) {
  const [p, q] = [CUBE.point(a), CUBE.point(b)];
  const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
  const m = [(p[0] + q[0]) / 2 - ((q[1] - p[1]) / d) * 10, (p[1] + q[1]) / 2 + ((q[0] - p[0]) / d) * 10];
  const l = Math.hypot(q[0] - m[0], q[1] - m[1]) || 1;
  const t = [q[0] - ((q[0] - m[0]) / l) * 7, q[1] - ((q[1] - m[1]) / l) * 7];
  const ang = Math.atan2(t[1] - m[1], t[0] - m[0]);
  const head = [t, [t[0] - 7 * Math.cos(ang - 0.45), t[1] - 7 * Math.sin(ang - 0.45)], [t[0] - 7 * Math.cos(ang + 0.45), t[1] - 7 * Math.sin(ang + 0.45)]];
  return `<path d="M${f(p[0])} ${f(p[1])} Q${f(m[0])} ${f(m[1])} ${f(t[0])} ${f(t[1])}" class="fd-ins"/><polygon points="${head.map((x) => x.map(f).join(',')).join(' ')}" class="fd-head-ins"/>`;
}
function placePicture(h, letters) {
  const all = ['C', h, ...letters];
  const sq = all.map((l) => CUBE.sticker(l, l === 'C' ? 'sq-buffer' : l === h ? 'sq-hand sq-thick' : 'sq-ins')).join('');
  const text = all.map((l) => { const a = CUBE.labelNear(l); return `<text x="${f(a.x)}" y="${f(a.y)}" text-anchor="${a.anchor}" class="fd-label">${l}</text>`; }).join('');
  return `<svg viewBox="0 0 262 194" class="family-diagram" role="img" aria-label="Helper ${h}: its place and the letters ${letters.join(' ')} that one turn brings into it">${CUBE.edges()}${sq}${letters.map((l) => arrow([l, h])).join('')}${text}</svg>`;
}
const figure = (svg, caption) => { const g = el('figure', 'ts-fig fd-fig'); g.append(el('div', 'fd-pic', svg), el('figcaption', null, caption)); return g; };

// ---- facts derived from the data ---------------------------------------------------------------------------------------------
export function ruleFacts() {
  const helperLetters = HELPERS.map((h) => h.helper);
  const one = {}; // letter -> { helper, turn, turnSeen, rotation, face, faceSeen }
  for (const h of HELPERS) for (const l of h.letters) if (l.usedByRule) one[l.letter] = { helper: h.helper, turn: l.turn, turnSeen: l.turnSeen, rotation: h.rotation, rotationBack: h.rotationBack };
  const oneLetters = Object.keys(one).sort();
  const twoLetters = PAIR_RULE_LEVEL2.map((l) => l.letter);
  return { helperLetters, one, oneLetters, twoLetters };
}

// ---- sections ----------------------------------------------------------------------------------------------------------------
function mountRule(slot) {
  const { helperLetters, oneLetters, twoLetters } = ruleFacts();
  const S = PAIR_RULE_STATS, lv = S.levels;
  const sets = [helperLetters, oneLetters, twoLetters];
  const what = ['That helper. The other letter\'s usual setup for it.', 'One turn puts that letter in a helper\'s place. Then the other letter (where it is now) with that helper\'s setup.', 'One more turn first: it makes the letter S, X, H or L. Then level 1.'];
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Level</th><th>A letter of the pair is</th><th>Pairs</th><th>Mean setup · moves</th></tr></thead><tbody>
    ${lv.map((l) => `<tr><th>${l.level}</th><td><strong>${sets[l.level].join(' ')}</strong><br>${what[l.level]}</td><td>${l.pairs} (${l.sharePct}% of a solve's pairs)</td><td>${l.meanSetup} · ${l.meanMoves}</td></tr>`).join('')}</tbody></table>`));
  slot.append(el('ol', 'bld-list', `
    <li><strong>Level 0.</strong> If the pair has ${helperLetters.slice(0, -1).join(', ')} or ${helperLetters.at(-1)}, use that helper.</li>
    <li><strong>Level 1.</strong> Else, if a letter is one of ${oneLetters.join(' ')}: turn it into a helper's place, then set up the other letter.</li>
    <li><strong>Level 2.</strong> Else the pair is made of ${twoLetters.slice().sort().join(' ')} only: turn one of them into S, X, H or L first, then level 1.</li>`));
  slot.append(el('p', 'bld-note', `A solve has ${S.pairsPerSolve} corner pairs on average; the rule costs ${S.cornerMovesPerSolve} corner moves per solve and needs a rotation for ${S.rotationSharePct}% of the pairs (${S.rotationsPerSolve} per solve). Setups of 0 / 1 / 2 / 3 / 4 moves: ${S.setupLengths.join(' / ')} of the 378 pairs. A pair and its reverse use the same setup and base (the base halves swapped). The rotation is not counted as a move.`));
}

function mountLevel0(slot) {
  const hl = ruleFacts().helperLetters;
  const rows = [];
  for (const a of hl) for (const b of hl) {
    if (a >= b || sameCorner(a, b)) continue;
    const e = RULE[a + b], { rowSeen } = split(e);
    rows.push(`<tr><th>${a} with ${b}</th><td>${e.helper}</td><td>${rowSeen ? st(rowSeen) : 'none'}</td><td>${e.setupMoves}</td></tr>`);
  }
  slot.append(el('p', null, `The other letter's setup is the one on that helper's page: <a href="orozco.html">Orozco</a> (B), <a href="orozco-d.html">helper D</a>, <a href="orozco-f.html">helper F</a>, <a href="orozco-k.html">helper K</a>. Nothing new to learn.`));
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><caption>A pair with two helper letters</caption><thead><tr><th>Pair</th><th>Use</th><th>Setup (as seen)</th><th>Moves</th></tr></thead><tbody>${rows.join('')}</tbody></table>`));
  const same = hl.flatMap((a) => hl.filter((b) => a < b && sameCorner(a, b)).map((b) => `${a} and ${b}`));
  if (same.length) slot.append(el('p', 'bld-note', `${same.join(', ')} are stickers of one corner, so they are never a pair.`));
}

function mountLevel1(slot) {
  const heads = HELPERS.map((h) => `<tr class="wr-base-head"><th colspan="4">Helper ${h.helper}${h.rotation ? ` · rotate ${st(h.rotation)} first` : ''} · its turn face: ${h.face}${h.rotation ? ` (seen ${h.faceSeen})` : ''}</th></tr>`
    + h.letters.map((l) => `<tr><td class="bld-letter">${l.letter}</td><td>${st(l.turnSeen)}</td><td>${l.turn === l.turnSeen ? '' : st(l.turn)}</td><td>${l.usedByRule ? 'the rule' : '<span class="bld-muted">not used</span>'}</td></tr>`).join(''));
  slot.append(el('p', null, `Every helper has one face that turns its own corner without moving the buffer. Turning that face carries three other letters into the helper's place. For F and K the turns are listed as you see them after the rotation, and as held.`));
  const figs = el('div', 'ts-figs');
  for (const h of HELPERS) figs.append(figure(placePicture(h.helper, h.letters.map((l) => l.letter)),
    `Helper ${h.helper} (yellow): ${h.letters.map((l) => `${l.letter} ${l.turnSeen}`).join(', ')}${h.rotation ? ` (seen after ${h.rotation})` : ''}. Blue: the buffer.`));
  slot.append(figs);
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Letter</th><th>Turn (as seen)</th><th>As held</th><th>Used by</th></tr></thead><tbody>${heads.join('')}</tbody></table>`));
  slot.append(el('p', null, `<strong>The turn comes from the letter, then the other letter follows.</strong> After the turn, check whether the other letter moved: a letter only moves if its corner is on the turned face (the face test, level 2 below). Then use the helper's setup for where it is now, and the base: forwards if the other letter comes first in the pair, backwards if the one you turned comes first.`));
  // E G O X
  const both = LETTERS.filter((l) => HELPERS.filter((h) => h.letters.some((x) => x.letter === l)).length > 1);
  const rows = both.map((l) => {
    const opts = HELPERS.filter((h) => h.letters.some((x) => x.letter === l)).map((h) => ({ h, x: h.letters.find((x) => x.letter === l) }));
    const rule = opts.find((o) => o.x.usedByRule), alt = opts.filter((o) => !o.x.usedByRule);
    return `<tr><th>${l}</th><td><strong>${rule.h.helper}</strong> ${st(rule.x.turnSeen)}</td><td>${alt.map((o) => `${o.h.helper} ${st(o.x.turnSeen)}`).join(', ')}</td></tr>`;
  });
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><caption>Letters with two choices: the rule always takes the first</caption><thead><tr><th>Letter</th><th>Rule</th><th>Not used</th></tr></thead><tbody>${rows.join('')}</tbody></table>`));
  slot.append(el('p', 'bld-note', `Fixed choice: E, O, X go to helper B and G to helper K. Helper B needs no rotation, which saves about a third of a rotation per solve against the shorter setup of choosing per pair.`));
}

// faces and rings (spec section 4); checked against the data by log/2026-11-18-which-group-check.mjs
export const FACE_CORNERS = { L: ['AER', 'DFI', 'UGL', 'XHS'], D: ['UGL', 'VKP', 'WOT', 'XHS'], B: ['AER', 'BNQ', 'WOT', 'XHS'] };
export const RINGS = { L: ['A I U S', 'D L X R', 'E F G H'], D: ['G K O S', 'H L P T', 'U V W X'], B: ['A H W N', 'B E X O', 'Q R S T'] };
const SEEN_FACE = { "y'": { L: 'F', D: 'D', B: 'L' }, z: { L: 'U', D: 'L', B: 'B' } };

function mountLevel2(slot) {
  const rows = PAIR_RULE_LEVEL2.map((l) => `<tr><th>${l.letter}</th><td>${st(l.firstTurnSeen)}${l.firstTurn !== l.firstTurnSeen ? ` <span class="bld-muted">(held ${l.firstTurn})</span>` : ''}</td><td>${l.becomes}</td><td>${st(l.secondTurnSeen)}</td><td>${l.helper}${l.rotation ? ` · ${l.rotation}` : ''}</td></tr>`);
  slot.append(el('p', null, `Level 2 is the pairs where neither letter is a helper letter or a one-turn letter. Each of the nine letters is one turn from S, X, H or L, which are one-turn letters. So: make it that letter, then level 1. If both letters are level 2, the one that comes first in this order is turned: <strong>${PAIR_RULE_LEVEL2.map((l) => l.letter).join(' ')}</strong>.`));
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><caption>The first turn for each level 2 letter (as seen)</caption><thead><tr><th>Letter</th><th>First turn</th><th>Becomes</th><th>Then</th><th>Helper</th></tr></thead><tbody>${rows.join('')}</tbody></table>`));
  slot.append(el('h3', null, 'Following the other letter: the face test and the rings'));
  slot.append(el('p', null, `<strong>Face test.</strong> A letter moves under a turn only if its corner is on the turned face. The corners on each face (held):`));
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Face</th><th>Corners on it</th></tr></thead><tbody>${Object.entries(FACE_CORNERS).map(([k, v]) => `<tr><th>${k}</th><td>${v.map((c) => `<strong>${c.split('').join(' ')}</strong>`).join(' · ')}</td></tr>`).join('')}</tbody></table>`));
  slot.append(el('p', null, `<strong>Rings.</strong> A turn moves letters round three rings of four, one step for the plain turn, backwards for the prime turn, two steps for a 2 turn. They are also where the one-turn letters come from: the ring that holds a helper letter.`));
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><thead><tr><th>Face (held)</th><th>Seen after y'</th><th>Seen after z</th><th>The three rings</th></tr></thead><tbody>${Object.entries(RINGS).map(([k, v]) => `<tr><th>${k}</th><td>${SEEN_FACE["y'"][k]}</td><td>${SEEN_FACE.z[k]}</td><td>${v.map((r) => `<strong>${r.split(' ').join(' → ')}</strong> → …`).join('<br>')}</td></tr>`).join('')}</tbody></table>`));
  // worked example
  const ex = RULE.QT;
  const { turnsSeen } = split(ex), [t1, t2] = turnsSeen.split(' ');
  slot.append(el('h3', null, `Worked example: ${ex.first} → ${ex.second}`));
  slot.append(el('p', null, `Neither Q nor T is a helper letter or a one-turn letter, so this is level 2. Q comes first in the order, so Q is turned. Q's first turn is ${st(t1)}, which makes it ${ex.via}; ${st(t2)} puts ${ex.via} in ${place(ex.helper)}. Face test: T's corner (W O T) is on the B face, so the first turn moves it: T goes two steps round the ring Q → R → S → T, to ${ex.otherNow}. The ${st(t2)} turn does not touch ${ex.otherNow}.`));
  slot.append(el('p', 'wr-alg', `<strong>${ex.first} → ${ex.second}</strong> ${mainLine(ex)}`));
  slot.append(ruleSteps(ex));
  const r = groupRow(ex, { id: false });
  slot.append(r);
}

function mountRotations(slot) {
  const r = (rot, back, text, href, face) => `<p><strong>${rot}</strong> turns the whole cube in your hands, ${text} Nothing on the cube changes, only how you hold it. <strong>${back}</strong> is the same turn the other way. Do ${rot} once before the corners and ${back} once after them, not for every letter. (<a href="${href}#rotation">${face} page</a>)</p>`;
  slot.append(el('div', null, r('z', "z'", 'a quarter turn clockwise as you look at the front. The top face goes to the right, the right face to the bottom, the bottom to the left, the left to the top.', 'orozco-f.html', 'Helper F') + r("y'", 'y', 'a quarter turn anticlockwise as you look down at the top. The front face goes to the right, the right face to the back, the back to the left, the left to the front.', 'orozco-k.html', 'Helper K')));
  slot.append(el('p', 'bld-note', `Read the letters first, then rotate. Every turn, setup and base for a helper F pair is as seen after z, for a helper K pair as seen after y'.`));
}

function mountExceptions(slot) {
  const ex = pairRule.filter((e) => e.exception);
  slot.append(el('p', null, `For ${ex.length} ordered pairs the rule gives a setup of four moves. Each has a three-move commutator with another helper; use that one. (${ex.map((e) => `${e.first} ${e.second}`).join(', ')}.)`));
  slot.append(el('div', 'table-wrap wr-wrap', `<table class="bld-table"><thead><tr><th>Pair</th><th>The rule gives</th><th>Use</th><th>Moves</th></tr></thead><tbody>
    ${ex.map((e) => `<tr><th>${e.first} → ${e.second}</th><td>${st(e.setupSeen)}</td><td class="nw">${mainLine(use(e))}</td><td>${e.best.count}</td></tr>`).join('')}</tbody></table>`));
  for (const e of ex) slot.append(groupRow(e, { id: false }));
}

function mountAll(slot) {
  const by = new Map();
  for (const e of pairRule) { if (!by.has(e.walked)) by.set(e.walked, []); by.get(e.walked).push(e); }
  for (const l of [...by.keys()].sort()) {
    const list = by.get(l).sort((x, y) => x.setupMoves - y.setupMoves || x.pair.localeCompare(y.pair));
    const e0 = list[0], h = e0.helper;
    const how = e0.level === 0 ? `is helper ${l}` : e0.level === 1 ? `${split(e0).turnsSeen} into ${place(h)}` : `${split(e0).turnsSeen.split(' ')[0]}, then ${split(e0).turnsSeen.split(' ')[1]}`;
    const d = el('details', 'ts-core');
    d.append(el('summary', null, `<span><strong>${l}</strong> · level ${e0.level} · ${how}${e0.rotation ? ` · ${e0.rotation}` : ''}<span class="ts-sum-base bld-muted">${list.length} pairs</span></span>`));
    d.addEventListener('toggle', () => { if (d.open && d.children.length === 1) for (const e of list) d.append(groupRow(e)); });
    slot.append(d);
  }
}

// ---- all 12 bases at a glance: each helper's three no-setup pairs, read from the data ------------------------------------
const HELPER_PAGE = { B: 'orozco.html', D: 'orozco-d.html', F: 'orozco-f.html', K: 'orozco-k.html' };
export function baseList() {
  return ['B', 'D', 'F', 'K'].map((h) => {
    const rows = pairRule.filter((r) => r.second === h && r.helper === h && !r.setup && r.level === 0).sort((x, y) => x.first.localeCompare(y.first));
    return { helper: h, rotation: rows[0].rotation, rotationBack: rows[0].rotationBack, positions: rows.map((f) => ({ pos: f.first, forwards: f, backwards: RULE[h + f.first] })) };
  });
}
function mountBases(slot) {
  const groups = baseList();
  const head = (g) => `<tr class="wr-base-head"><th colspan="3"><a href="${HELPER_PAGE[g.helper]}">Helper ${g.helper}</a>${g.helper === 'B' ? ' (Orozco)' : ''}${g.rotation ? ` · seen after <strong>${g.rotation}</strong>, rotate back with <strong>${g.rotationBack}</strong>` : ''}</th></tr>`;
  const rows = groups.map((g) => head(g) + g.positions.map((p) => `<tr><td class="bld-letter">${p.pos}</td><td class="nw"><code>${colourCore(p.forwards.coreSeen)}</code></td><td class="nw"><code>${colourCore(p.backwards.coreSeen)}</code></td></tr>`).join('')).join('');
  slot.append(el('div', 'table-wrap', `<table class="bld-table wr-bases"><thead><tr><th>Pos.</th><th>Position first</th><th>Helper first</th></tr></thead><tbody>${rows}</tbody></table>`));
  slot.append(el('ul', 'bld-list', groups.map((g) => {
    const held = g.positions.map((p) => p.forwards.core);
    return `<li><strong>${g.helper}:</strong> ${g.positions.map((p) => p.pos).join(' / ')}${g.rotation ? `; without the rotation <code>${held.map((c) => colourCore(c)).join('</code> <code>')}</code>` : ''}</li>`;
  }).join('')));
}

export function mountWhichGroup(ids) {
  const $ = (id) => document.getElementById(id);
  mountRule($(ids.rule));
  if (ids.bases) mountBases($(ids.bases));
  mountLevel0($(ids.level0));
  mountLevel1($(ids.level1));
  mountLevel2($(ids.level2));
  mountRotations($(ids.rotations));
  mountExceptions($(ids.exceptions));
  mountAll($(ids.all));
}
