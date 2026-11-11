// The Walk rule page (3x3/bld/walk-rule.html): which base solves any pair of corner letters, with the three helpers
// (B, P, D). Every letter has one walk (0-2 turns) into a helper's place; a pair is the walk of one letter, then the
// other letter's usual setup for that helper, then the base. Data: data/walk-rule.js, generated and checked by
// log/2026-11-10-third-helper-set.mjs (every pair as a commutator, 3,000 whole solves).
import { walkStats, walkHelpers, walkLetters, walkPairs } from '../data/walk-rule.js?v=1';
import { makeCube } from './sticker-cube.js?v=4';
import { pairRow, coreFigure } from './three-style-page.js?v=15';
import { intoDiagram } from './three-style-bases.js?v=15';
import { colourCore } from './three-style-families.js?v=12';

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const st = (m) => `<span class="mv-setup">${m}</span>`;
const alg = (n) => { const m = n.match(/^\[([^:]+) : (\[.*\])\]$/); return m ? `[${st(m[1])} : ${colourCore(m[2])}]` : colourCore(n); };
const HELPER = Object.fromEntries(walkHelpers.map((h) => [h.letter, h]));
const LETTER = Object.fromEntries(walkLetters.map((l) => [l.letter, l]));
const PAIR = Object.fromEntries(walkPairs.map((p) => [p.pair, p]));
const CORNERS = ['AER', 'BNQ', 'CJM', 'DFI', 'UGL', 'VKP', 'WOT', 'XHS'];
const sameCorner = (a, b) => CORNERS.some((c) => c.includes(a) && c.includes(b));
const PAGE = { B: 'orozco.html', P: 'orozco-p.html', D: 'orozco-d.html' };
const NAME = { B: 'Orozco', P: 'helper P', D: 'helper D' };
const place = (h) => `${h}'s place`;

// ---- pictures: the see-through cube with sticker squares, labels and arrows -----------------------------------------
const CUBE = makeCube(136, 102, 44);
const f = (v) => v.toFixed(1);
// squares: [[letter, class]]; arrows: [[from, to, 'ins' | 'lift' | 'int']]
function diagram({ squares, arrows = [], label }) {
  const arrow = ([a, b, kind]) => {
    const [p, q] = [CUBE.point(a), CUBE.point(b)];
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    const m = [(p[0] + q[0]) / 2 - ((q[1] - p[1]) / d) * 10, (p[1] + q[1]) / 2 + ((q[0] - p[0]) / d) * 10];
    const l = Math.hypot(q[0] - m[0], q[1] - m[1]) || 1;
    const t = [q[0] - ((q[0] - m[0]) / l) * 7, q[1] - ((q[1] - m[1]) / l) * 7];
    const ang = Math.atan2(t[1] - m[1], t[0] - m[0]);
    const head = [t, [t[0] - 7 * Math.cos(ang - 0.45), t[1] - 7 * Math.sin(ang - 0.45)], [t[0] - 7 * Math.cos(ang + 0.45), t[1] - 7 * Math.sin(ang + 0.45)]];
    return `<path d="M${f(p[0])} ${f(p[1])} Q${f(m[0])} ${f(m[1])} ${f(t[0])} ${f(t[1])}" class="fd-${kind}"/><polygon points="${head.map((h) => h.map(f).join(',')).join(' ')}" class="fd-head-${kind}"/>`;
  };
  const seen = new Set();
  const uniq = squares.filter(([l]) => !seen.has(l) && seen.add(l));
  const sq = uniq.map(([l, cls]) => CUBE.sticker(l, cls)).join('');
  const text = uniq.map(([l]) => { const a = CUBE.labelNear(l); return `<text x="${f(a.x)}" y="${f(a.y)}" text-anchor="${a.anchor}" class="fd-label">${l}</text>`; }).join('');
  return `<svg viewBox="0 0 262 194" class="family-diagram" role="img" aria-label="${label}">${CUBE.edges()}${sq}${arrows.map(arrow).join('')}${text}</svg>`;
}
const figure = (svg, caption, cls = 'ts-fig fd-fig') => { const g = el('figure', cls); g.append(el('div', 'fd-pic', svg), el('figcaption', null, caption)); return g; };

// one letter's walk: the letter (green), the spot it passes through (pale), the helper's place (yellow, thick)
function walkPicture(w) {
  const turns = w.turns.split(' ');
  if (w.n === 1) return diagram({ label: `${w.letter} walks into ${place(w.helper)} with ${w.turns}`, squares: [['C', 'sq-buffer'], [w.helper, 'sq-hand sq-thick'], [w.letter, 'sq-ins']], arrows: [[w.letter, w.helper, 'ins']] });
  return diagram({ label: `${w.letter} walks into ${place(w.helper)} with ${w.turns}, through ${w.via}`,
    squares: [['C', 'sq-buffer'], [w.helper, 'sq-hand sq-thick'], [w.via, 'sq-from'], [w.letter, 'sq-ins']], arrows: [[w.letter, w.via, 'lift'], [w.via, w.helper, 'ins']] }) + '';
}
// a pair by the rule: the walk (green), where the other letter goes (purple: moved by the walk; orange: its own setup)
function pairPicture(e) {
  const w = LETTER[e.walked], other = e.first === e.walked ? e.second : e.first;
  const squares = [['C', 'sq-buffer'], [e.helper, 'sq-hand sq-thick']];
  const arrows = [];
  if (w.n === 2) { squares.push([w.via, 'sq-from']); arrows.push([e.walked, w.via, 'ins'], [w.via, e.helper, 'ins']); } else if (w.n === 1) arrows.push([e.walked, e.helper, 'ins']);
  if (w.n) squares.push([e.walked, 'sq-ins']);
  squares.push([e.into, 'sq-slot']);
  if (e.lands !== other) { arrows.push([other, e.lands, 'lift']); if (e.lands !== e.into) squares.push([e.lands, 'sq-from']); }
  if (e.lands !== e.into) arrows.push([e.lands, e.into, 'int']);
  if (other !== e.into) squares.push([other, 'sq-on']);
  return diagram({ label: `${e.walked} into ${place(e.helper)}, ${other} into the ${e.into} position`, squares, arrows });
}

// ---- where the setup moves the pair: "as P → D · helper D" in the pair's heading ------------------------------------
const HELPERS = ['B', 'P', 'D'];
function movedTo(e) {
  const { first, second } = e.spots;
  const h = e.helper || [first, second].find((x) => HELPERS.includes(x)); // exceptions carry no helper field
  const same = first === e.first && second === e.second;
  return el('span', 'wr-moved', `${same ? 'no setup' : `as <strong>${first} → ${second}</strong>`}${h ? ` · helper ${h}` : ''}`);
}
function walkRow(e) {
  const row = pairRow(e);
  row.querySelector('.ts-pair-name').after(movedTo(e));
  return row;
}

// ---- the rule for one pair, in words ---------------------------------------------------------------------------------
function explain(e) {
  const box = el('div', 'wr-result');
  if (e.exception) {
    box.append(el('p', null, `<strong>${e.first} → ${e.second} is one of the ${walkStats.exceptions} exception pairs.</strong> The rule (walking ${e.ruleWalked}) gives a setup of four moves, ${st(e.ruleSetup)}. Use this three-move setup instead:`));
    box.append(el('p', 'wr-alg', `<code>${alg(e.notation)}</code>`));
  } else {
    const w = LETTER[e.walked], other = e.first === e.walked ? e.second : e.first, h = e.helper;
    const ol = el('ol', 'ts-steps');
    ol.append(el('li', null, w.n === 0 ? `<strong>${e.walked} is a helper</strong>, so nothing walks.`
      : w.n === 1 ? `<strong>Walk ${e.walked}:</strong> ${st(w.turns)} puts ${e.walked} in ${place(h)}.`
        : `<strong>Walk ${e.walked}:</strong> ${st(w.turns.split(' ')[0])} takes ${e.walked} to the ${w.via} position, then ${st(w.turns.split(' ')[1])} puts it in ${place(h)}.`));
    const moved = e.lands !== other ? `The walk moves ${other} to the ${e.lands} position. ` : (w.n ? `The walk does not move ${other}. ` : '');
    const from = e.lands !== other ? `From ${e.lands}, the` : 'The';
    ol.append(el('li', null, `<strong>Set up ${other}</strong> the ${NAME[h]} way. ${moved}${e.rowSetup ? `${from} <a href="${PAGE[h]}">${NAME[h]}</a> setup is ${st(e.rowSetup)}, into the ${e.into} position.` : `${e.lands} is a base position of ${NAME[h]}: no setup.`}`));
    const fwd = other === e.first;
    ol.append(el('li', null, `<strong>Base:</strong> ${e.into} with ${h}, ${fwd ? `forwards (buffer → ${e.into} → ${h}), because ${other} comes first` : `backwards (buffer → ${h} → ${e.into}), because ${e.walked} comes first`}: <code>${colourCore(e.core)}</code>.`));
    if (e.setup) ol.append(el('li', null, 'Undo the setup turns in reverse order.'));
    const figs = el('div', 'ts-figs');
    figs.append(figure(pairPicture(e), `${w.n ? `Green: ${e.walked} walks into ${place(h)} (yellow). ` : `Yellow: ${h}, the helper. `}Pink: ${other}${other === e.into ? ', already on its base position' : ` and the ${e.into} position it ends on`}.${e.lands !== other ? ' Purple arrow: the walk moves it.' : ''}${e.lands !== e.into ? ' Orange arrow: its own setup.' : ''}`));
    box.append(el('p', 'wr-alg', `<strong>${e.first} → ${e.second}</strong> ${movedTo(e).outerHTML} <code>${alg(e.notation)}</code>`), figs, ol);
  }
  const row = walkRow(e);
  row.removeAttribute('id');
  row.querySelector('summary').prepend(el('span', 'bld-muted', 'Pictures of the setup, and a cube to watch: '));
  box.append(row);
  return box;
}

// ---- sections ---------------------------------------------------------------------------------------------------------
// for the Pair lookup page: the walk rule's commutator and its explanation for one pair
export const walkPairFor = (pair) => PAIR[pair];
export const explainWalk = (pair) => explain(PAIR[pair]);
export const walkLetterList = walkLetters.map((l) => l.letter);
export { sameCorner };

// ---- all 9 bases at a glance -----------------------------------------------------------------------------------------
function mountBases(slot) {
  const rows = walkHelpers.map((h) => `<tr class="wr-base-head"><th colspan="3"><a href="${PAGE[h.letter]}">Helper ${h.letter}</a>${h.letter === 'B' ? ' (Orozco)' : ''}</th></tr>`
    + h.positions.map((p) => `<tr><td class="bld-letter">${p.pos}</td><td class="nw"><code>${colourCore(p.forwards)}</code></td><td class="nw"><code>${colourCore(p.backwards)}</code></td></tr>`).join('')).join('');
  slot.append(el('div', 'table-wrap', `<table class="bld-table wr-bases"><thead><tr><th>Pos.</th><th>Position first</th><th>Helper first</th></tr></thead><tbody>${rows}</tbody></table>`));
  slot.append(el('ul', 'bld-list', `
    <li><strong>B (Orozco):</strong> <code>R D R'</code> with the D turn picking O / H / L (D, D′, D2), against <code>U'</code>.</li>
    <li><strong>P:</strong> <code>R U R'</code> against the D turn for L (D) and H (D2); A is <code>R' D' R</code> against <code>U2</code>.</li>
    <li><strong>D:</strong> <code>R' D R</code> with the D turn picking G / P / S (D, D′, D2), against <code>U'</code>.</li>`));
}

function mountHelpers(slot) {
  const pic = diagram({ label: 'the buffer and the three helpers B, P and D', squares: [['C', 'sq-buffer'], ['B', 'sq-hand sq-thick'], ['P', 'sq-hand sq-thick'], ['D', 'sq-hand sq-thick']] });
  const figs = el('div', 'ts-figs');
  figs.append(figure(pic, 'Blue: the buffer. Yellow: the three helpers, B, P and D.'));
  const face = { B: 'back (B)', D: 'bottom (D)', L: 'left (L)' };
  const t = el('div', 'table-wrap', `<table class="bld-table"><caption>The three helpers</caption><thead><tr><th>Helper</th><th>Page</th><th>Positions</th><th>Its setups turn</th><th>Turn that reaches its place</th></tr></thead><tbody>
    ${walkHelpers.map((h) => `<tr><th>${h.letter}</th><td><a href="${PAGE[h.letter]}">${NAME[h.letter][0].toUpperCase()}${NAME[h.letter].slice(1)}</a></td><td>${h.positions.map((p) => p.pos).join(', ')}</td><td>${[...h.free].join(' and ')}</td><td>${face[h.door]}</td></tr>`).join('')}</tbody></table>`);
  slot.append(figs, t);
}

function mountOne(slot) {
  const figs = el('div', 'ts-figs');
  for (const h of walkHelpers) {
    const ls = walkLetters.filter((l) => l.n === 1 && l.helper === h.letter);
    figs.append(figure(intoDiagram(h.letter, ls.map((l) => l.letter)), `Into ${place(h.letter)}: ${ls.map((l) => `${l.letter} (${l.turns})`).join(', ')}`));
  }
  const rows = walkLetters.filter((l) => l.n === 1).sort((x, y) => 'BPD'.indexOf(x.helper) - 'BPD'.indexOf(y.helper));
  slot.append(figs, el('div', 'table-wrap', `<table class="bld-table"><caption>Walks of one turn</caption><thead><tr><th>Letter</th><th>Turn</th><th>Into</th></tr></thead><tbody>
    ${rows.map((l) => `<tr><th>${l.letter}</th><td>${st(l.turns)}</td><td>${place(l.helper)}</td></tr>`).join('')}</tbody></table>`));
}

function mountTwo(slot) {
  const two = walkLetters.filter((l) => l.n === 2);
  const vias = [...new Set(two.map((l) => `${l.via}${l.helper}`))].sort((x, y) => 'BPD'.indexOf(x[1]) - 'BPD'.indexOf(y[1]) || x.localeCompare(y));
  for (const k of vias) {
    const ls = two.filter((l) => `${l.via}${l.helper}` === k), [via, h] = k, last = ls[0].turns.split(' ')[1];
    slot.append(el('h3', null, `Through ${via}, then ${st(last)} into ${place(h)}: ${ls.map((l) => l.letter).join(', ')}`));
    const figs = el('div', 'ts-figs');
    for (const l of ls) figs.append(figure(walkPicture(l), `${l.letter}: ${l.turns.split(' ')[0]} to ${via} (purple), ${last} into ${place(h)} (green)`));
    slot.append(figs);
  }
  slot.append(el('div', 'table-wrap', `<table class="bld-table"><caption>Walks of two turns</caption><thead><tr><th>Letter</th><th>Turns</th><th>Through</th><th>Into</th></tr></thead><tbody>
    ${two.sort((x, y) => 'BPD'.indexOf(x.helper) - 'BPD'.indexOf(y.helper) || x.via.localeCompare(y.via)).map((l) => `<tr><th>${l.letter}</th><td>${st(l.turns)}</td><td>${l.via}</td><td>${place(l.helper)}</td></tr>`).join('')}</tbody></table>`));
  const none = walkLetters.filter((l) => l.n === null).map((l) => l.letter);
  slot.append(el('p', 'bld-note', `${none.join(', ')} has no walk of two turns or fewer: in a pair with ${none.join(', ')}, the other letter walks.`));
}

function mountSetups(slot) {
  for (const h of walkHelpers) {
    const d = el('details', 'ts-core');
    d.append(el('summary', null, `<span><strong>Helper ${h.letter}</strong>${h.letter === 'B' ? ' (Orozco)' : ''}<span class="ts-sum-base bld-muted">positions ${h.positions.map((p) => p.pos).join(' ')} · setups of ${[...h.free].join(' and ')}</span></span>`));
    d.addEventListener('toggle', () => {
      if (!d.open || d.children.length > 1) return;
      for (const p of h.positions) {
        const rows = h.rows.filter((r) => r.pos === p.pos), moved = rows.filter((r) => r.setup);
        d.append(el('p', 'ts-core-sub', `Into ${p.pos}`));
        const figs = el('div', 'ts-figs');
        figs.append(coreFigure({ core: p.forwards, spots: { buffer: 'C', first: p.pos, second: h.letter } }, () => ` buffer → ${p.pos} → ${h.letter} (forwards)`));
        if (moved.length) figs.append(figure(intoDiagram(p.pos, moved.map((r) => r.letter)), `Into ${p.pos} (yellow): ${moved.map((r) => r.letter).join(' ')}`));
        d.append(figs, el('div', 'table-wrap wr-wrap', `<table class="bld-table"><thead><tr><th>Letter</th><th>Setup</th><th>Forwards · backwards</th></tr></thead><tbody>
          ${rows.map((r) => `<tr><th>${r.letter}</th><td>${r.setup ? st(r.setup) : 'none'}</td><td><code>${alg(r.setup ? `[${r.setup} : ${p.forwards}]` : p.forwards)}</code><br><code>${alg(r.setup ? `[${r.setup} : ${p.backwards}]` : p.backwards)}</code></td></tr>`).join('')}</tbody></table>`));
      }
      d.append(el('p', 'bld-note', `Full page: <a href="${PAGE[h.letter]}">${NAME[h.letter]}</a>.`));
    });
    slot.append(d);
  }
}

function mountExceptions(slot) {
  const ex = walkPairs.filter((p) => p.exception && p.first < p.second);
  slot.append(el('div', 'table-wrap wr-wrap', `<table class="bld-table"><caption>The ${ex.length} letter pairs where the rule gives four setup moves</caption><thead><tr><th>Letters</th><th>The rule gives</th><th>Use · reverse</th></tr></thead><tbody>
    ${ex.map((e) => `<tr><th>${e.first} ↔ ${e.second}</th><td>${st(e.ruleSetup)}</td><td><code>${alg(e.notation)}</code><br><code>${alg(PAIR[e.second + e.first].notation)}</code></td></tr>`).join('')}</tbody></table>`));
  for (const e of ex) { slot.append(walkRow(e), walkRow(PAIR[e.second + e.first])); }
}

function mountAll(slot) {
  const order = walkLetters.filter((l) => l.n !== null).sort((x, y) => x.n - y.n || x.letter.localeCompare(y.letter));
  for (const l of order) {
    const list = walkPairs.filter((p) => p.walked === l.letter).sort((x, y) => x.setupMoves - y.setupMoves || x.pair.localeCompare(y.pair));
    if (!list.length) continue;
    const d = el('details', 'ts-core');
    d.append(el('summary', null, `<span><strong>${l.letter}</strong> ${l.n ? `walks with ${st(l.turns)} into ${place(l.helper)}` : 'is a helper'}<span class="ts-sum-base bld-muted">${list.length} pairs</span></span>`));
    d.addEventListener('toggle', () => { if (d.open && d.children.length === 1) for (const e of list) d.append(walkRow(e)); });
    slot.append(d);
  }
}

export function mountWalkRule(ids) {
  const $ = (id) => document.getElementById(id);
  if (ids.bases) mountBases($(ids.bases));
  mountHelpers($(ids.helpers));
  mountOne($(ids.one));
  mountTwo($(ids.two));
  mountSetups($(ids.setups));
  mountExceptions($(ids.exceptions));
  mountAll($(ids.all));
  const s = walkStats;
  $(ids.stats).innerHTML = `All ${s.pairs} pairs: the walked letter needs no turn in ${s.byWalk[0]}, one turn in ${s.byWalk[1]} and two turns in ${s.byWalk[2]}. Setups of 0 / 1 / 2 / 3 moves: ${s.bySetup.join(' / ')} pairs, ${s.meanSetup} moves on average.`;
}
