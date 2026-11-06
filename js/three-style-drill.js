// Blind drills › 3-Style: a random pair from the chosen 3-style table; say (or do) its commutator, then reveal.
// Filters: which table, pairs known from Orozco, setup length, core group. Optional timer like the Letters drill.
// Saved in localStorage 'cubing-helper:3style-drill'.
import { bldNet } from './bld-net.js?v=4';
import { orozcoKnown } from './three-style-page.js?v=12';
import { threeStyleOurs } from '../data/three-style-ours.js?v=2';
import { threeStyleCorners } from '../data/three-style-corners.js?v=3';

const SPEFFZ = { A: 'UBL', B: 'UBR', C: 'UFR', D: 'UFL', E: 'LUB', F: 'LUF', G: 'LDF', H: 'LDB', I: 'FUL', J: 'FUR', K: 'FDR', L: 'FDL',
  M: 'RUF', N: 'RUB', O: 'RDB', P: 'RDF', Q: 'BUR', R: 'BUL', S: 'BDL', T: 'BDR', U: 'DFL', V: 'DFR', W: 'DBR', X: 'DBL' };
const TABLES = {
  ours: { label: 'Ours', data: threeStyleOurs, page: '../bld/three-style.html' },
  dylan: { label: 'Dylan / J Perm', data: threeStyleCorners, page: '../bld/three-style-corners.html' },
};
const SETUP_KINDS = [['0', 'No setup'], ['1', '1-move setup'], ['2', '2-move setup'], ['3', '3 or more']];
const KEY = 'cubing-helper:3style-drill';
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const famKey = (e) => `${e.insertion} against ${e.interchange.replace(/['2]/g, '')} turns`;

export function mountThreeStyleDrill(section) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch {} };
  saved = { table: 'ours', orozco: true, setups: ['0', '1'], group: '', picture: true, timer: false, time: 8, ansTime: 4, ...saved };

  // ---- settings
  const form = el('form', 'rec-settings');
  form.onsubmit = () => false;
  const fs = (legend) => { const f = el('fieldset'); f.appendChild(el('legend', null, legend)); form.appendChild(f); return f; };
  const label = (input, text) => { const l = el('label'); l.append(input, ` ${text}`); return l; };
  const radio = (name, value, checked) => { const i = el('input'); i.type = 'radio'; i.name = name; i.value = value; i.checked = checked; return i; };
  const box = (checked) => { const i = el('input'); i.type = 'checkbox'; i.checked = checked; return i; };
  const num = (v, min, max) => { const i = el('input'); i.type = 'number'; i.min = min; i.max = max; i.step = 1; i.value = v; i.inputMode = 'numeric'; return i; };

  const fTable = fs('Table');
  for (const [k, t] of Object.entries(TABLES)) fTable.appendChild(label(radio('ts-table', k, saved.table === k), t.label));
  const fPairs = fs('Pairs');
  const oz = box(saved.orozco);
  fPairs.appendChild(label(oz, 'Pairs you know from Orozco (with B)'));
  const setupBoxes = SETUP_KINDS.map(([k, text]) => { const b = box(saved.setups.includes(k)); b.value = k; fPairs.appendChild(label(b, text)); return b; });
  const groupSel = el('select');
  const gl = el('label', null, 'Core group ');
  gl.appendChild(groupSel);
  fPairs.appendChild(gl);
  const count = el('p', 'bld-note');
  fPairs.appendChild(count);
  const fShow = fs('Show');
  const pic = box(saved.picture);
  fShow.appendChild(label(pic, 'Picture of where the two targets are'));
  const fTimer = fs('Timer');
  const tOn = box(saved.timer);
  const tTime = num(saved.time, 1, 60);
  const tAns = num(saved.ansTime, 1, 30);
  fTimer.appendChild(label(tOn, 'Timer mode: the next pair comes by itself'));
  const l1 = el('label', 'indent'); l1.append('Time to answer ', tTime, ' seconds'); fTimer.appendChild(l1);
  const l2 = el('label', 'indent'); l2.append('Then the answer for ', tAns, ' seconds'); fTimer.appendChild(l2);
  section.appendChild(form);

  // ---- controls and stage
  const timerControls = el('div', 'rec-controls');
  const start = el('button', 'rec-btn rec-btn-primary', 'Start'); start.type = 'button';
  timerControls.appendChild(start);
  section.appendChild(timerControls);
  const stage = el('div', 'drill-stage');
  const track = el('div', 'rec-timer'); const bar = el('div', 'rec-timer-bar'); track.appendChild(bar);
  const phase = el('p', 'rec-phase');
  const big = el('p', 'drill-big');
  const sub = el('p', 'drill-kind');
  const net = el('div', 'drill-net ts-drill-net');
  const answer = el('div', 'drill-answer ts-drill-answer');
  stage.append(track, phase, big, sub, net, answer);
  section.appendChild(stage);
  const controls = el('div', 'rec-controls');
  const show = el('button', 'rec-btn rec-btn-primary', 'Show answer'); show.type = 'button';
  const next = el('button', 'rec-btn', 'Next'); next.type = 'button';
  controls.append(show, next);
  section.appendChild(controls);

  const table = () => TABLES[saved.table] || TABLES.ours;
  function fillGroups() {
    const fams = [...new Set(table().data.map(famKey))].sort();
    groupSel.replaceChildren(el('option', null, 'Any'));
    groupSel.firstChild.value = '';
    for (const f of fams) { const o = el('option', null, f); o.value = f; groupSel.appendChild(o); }
    groupSel.value = fams.includes(saved.group) ? saved.group : '';
  }
  function pool() {
    return table().data.filter((e) => {
      if (saved.group && famKey(e) !== saved.group) return false;
      if (orozcoKnown(e)) return saved.orozco;
      return saved.setups.includes(String(Math.min(3, e.setupMoves)));
    });
  }
  function readSettings() {
    saved.table = form.querySelector('input[name="ts-table"]:checked').value;
    saved.orozco = oz.checked;
    saved.setups = setupBoxes.filter((b) => b.checked).map((b) => b.value);
    saved.group = groupSel.value;
    saved.picture = pic.checked;
    saved.timer = tOn.checked;
    const clamp = (i, lo, hi, d) => { const v = Math.round(Number(i.value)); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
    saved.time = clamp(tTime, 1, 60, 8);
    saved.ansTime = clamp(tAns, 1, 30, 4);
    save();
  }
  function current() { return table().data.find((e) => e.pair === saved.pair); }
  function draw() {
    timerControls.hidden = !saved.timer;
    track.hidden = !saved.timer;
    phase.hidden = !saved.timer;
    const n = pool().length;
    count.textContent = `${n} pair${n === 1 ? '' : 's'} match.`;
    const e = current();
    answer.hidden = true;
    answer.replaceChildren();
    show.disabled = !e;
    if (!e) { big.textContent = ''; sub.textContent = n ? 'Press Next.' : 'No pairs match: tick more boxes.'; net.replaceChildren(); return; }
    big.textContent = `${e.first} ${e.second}`;
    sub.textContent = `${e.first} then ${e.second} · buffer C`;
    net.hidden = !saved.picture;
    net.innerHTML = saved.picture ? bldNet('corners', { buffers: ['C'], marked: [e.first, e.second], letters: ['C', e.first, e.second] }) : '';
  }
  function reveal() {
    const e = current();
    if (!e) return;
    answer.replaceChildren();
    const code = el('code');
    if (e.setup) code.append('[', el('span', 'mv-setup', e.setup), ' : ', e.core, ']'); else code.append(e.core);
    const alg = el('p', 'case-alg'); alg.appendChild(code);
    answer.append(alg, el('p', 'bld-note', `${famKey(e)} · ${e.setup ? `setup ${e.setup}` : 'no setup'} · ${e.count} moves`));
    const k = orozcoKnown(e);
    if (k) { const p = el('p', 'ts-known'); p.append(el('strong', null, 'You know this one: '), `${k.text}, `, el('code', null, k.notation)); answer.appendChild(p); }
    const a = el('a', null, 'Open it on the 3-Style page (pictures, Watch it)');
    a.href = `${table().page}#pair-${e.pair}`;
    answer.appendChild(a);
    answer.hidden = false;
    show.disabled = true;
  }
  function pick() {
    const list = pool();
    if (!list.length) { saved.pair = null; save(); draw(); return; }
    let e = list[Math.floor(Math.random() * list.length)];
    if (list.length > 1 && e.pair === saved.pair) e = list[(list.indexOf(e) + 1) % list.length];
    saved.pair = e.pair;
    save();
    draw();
  }

  // ---- timer
  let running = false, timeout = null, raf = null, end = 0, len = 1, mode = '';
  const tick = () => { const left = Math.max(0, end - Date.now()); bar.style.width = `${(100 * left) / len}%`; phase.textContent = mode === 'ask' ? `Answer: ${Math.ceil(left / 1000)} s` : `Next pair in ${Math.ceil(left / 1000)} s`; if (running) raf = requestAnimationFrame(tick); };
  const phaseFor = (m, s, then) => { clearTimeout(timeout); mode = m; len = s * 1000; end = Date.now() + len; timeout = setTimeout(then, len); };
  const round = () => { pick(); phaseFor('ask', saved.time, () => { reveal(); phaseFor('answer', saved.ansTime, round); }); };
  function stop() {
    if (!running) return;
    running = false; clearTimeout(timeout); cancelAnimationFrame(raf);
    start.textContent = 'Start'; start.classList.remove('rec-btn-stop'); form.hidden = false;
    phase.textContent = 'Stopped.'; bar.style.width = '0%';
    reveal();
  }
  start.addEventListener('click', () => {
    if (running) return stop();
    running = true; form.hidden = true; start.textContent = 'Stop'; start.classList.add('rec-btn-stop');
    round(); tick();
  });
  show.addEventListener('click', reveal);
  next.addEventListener('click', () => (running ? round() : pick()));
  form.addEventListener('change', (ev) => {
    const tableChanged = ev.target.name === 'ts-table';
    readSettings();
    if (tableChanged) { fillGroups(); saved.group = groupSel.value; save(); }
    if (!pool().some((e) => e.pair === saved.pair)) pick(); else draw();
  });

  fillGroups();
  if (!current() || !pool().some((e) => e.pair === saved.pair)) pick(); else draw();
  if (!saved.timer) phase.textContent = '';
  return { stop };
}
