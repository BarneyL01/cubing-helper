// A step runner for the theory pages: a cube you can drag round (js/cube-rotatable.js), each move
// turning on screen, with Back / Next / Play / Restart, the moves listed with the current one marked,
// and a line of text per part. The same layout as the runner on How Orozco works (styles .orz-*).
import { applyAlg } from './cube-sim.js';
import { invertAlg } from './algs.js';
import { rotatableCube } from './cube-rotatable.js?v=2';

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const SPEED = { slow: 700, normal: 380, fast: 200 };

// host: an empty element. Returns { set({ parts, start, shown, startText, doneText }) }.
//   parts: [{ name, moves, text }]  start: stickers to begin from  shown: stickers -> stickers to draw
export function createMoveRunner(host, { palette, label = 'Cube after the moves so far; drag to turn it' } = {}) {
  const stage = el('div', 'drill-stage orz-runner');
  const partLabel = el('p', 'drill-label orz-run-part');
  const movesLine = el('p', 'orz-moves');
  const cubeSlot = el('div');
  const controls = el('div', 'rec-controls orz-run-controls');
  const btn = (text, cls = 'rec-btn') => { const b = el('button', cls, text); b.type = 'button'; controls.appendChild(b); return b; };
  const back = btn('◀ Back');
  const next = btn('Next ▶');
  const play = btn('Play', 'rec-btn rec-btn-primary');
  const restart = btn('Restart');
  const caption = el('p', 'orz-run-caption');
  stage.append(partLabel, movesLine, cubeSlot, controls, caption);
  const speedLabel = el('label', 'orz-grey', 'Speed ');
  const speed = el('select');
  for (const [v, t] of [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']]) { const o = el('option', null, t); o.value = v; if (v === 'normal') o.selected = true; speed.appendChild(o); }
  speedLabel.appendChild(speed);
  host.append(stage, speedLabel);

  let spec = { parts: [], start: [], shown: (s) => s, startText: '', doneText: '' };
  let all = [];
  let pos = 0;
  let busy = false;
  let playing = false;
  const cube = rotatableCube([], { palette, label });
  cubeSlot.appendChild(cube.element);
  const stateAt = (n) => applyAlg(spec.start, all.slice(0, n).map((a) => a.move).join(' '));

  function labels() {
    movesLine.replaceChildren();
    all.forEach((a, i) => {
      if (i && all[i - 1].part !== a.part) movesLine.append(el('span', 'orz-sep', '·'));
      movesLine.append(el('span', i < pos ? 'orz-done' : i === pos ? 'orz-next' : 'orz-todo', a.move));
    });
    if (pos === 0) {
      partLabel.textContent = 'Start';
      caption.textContent = spec.startText;
    } else {
      const p = spec.parts[all[pos - 1].part];
      const partDone = pos === all.length || all[pos].part !== all[pos - 1].part;
      partLabel.textContent = `${p.name} (${p.moves})${partDone ? ' done' : ''}: move ${pos} of ${all.length}`;
      caption.textContent = pos === all.length ? spec.doneText || p.text || '' : partDone ? p.text || '' : '';
    }
    back.disabled = pos === 0;
    next.disabled = pos === all.length;
    play.textContent = playing ? 'Pause' : 'Play';
  }
  const still = () => { cube.update(spec.shown(stateAt(pos))); labels(); };
  async function step(dir) {
    if (busy || (dir > 0 && pos >= all.length) || (dir < 0 && pos <= 0)) return;
    busy = true;
    const from = stateAt(pos);
    const move = dir > 0 ? all[pos].move : invertAlg(all[pos - 1].move);
    pos += dir;
    labels();
    await cube.animate(spec.shown(from), spec.shown(stateAt(pos)), move, SPEED[speed.value]);
    busy = false;
  }
  next.addEventListener('click', () => { playing = false; step(1); });
  back.addEventListener('click', () => { playing = false; step(-1); });
  restart.addEventListener('click', () => { if (!busy) { playing = false; pos = 0; cube.reset(); still(); } });
  play.addEventListener('click', async () => {
    if (playing) { playing = false; labels(); return; }
    if (pos === all.length) { pos = 0; still(); }
    playing = true;
    labels();
    while (playing && pos < all.length) {
      await step(1);
      await new Promise((r) => setTimeout(r, 150));
    }
    playing = false;
    labels();
  });

  return {
    set(opts) {
      playing = false;
      spec = { startText: '', doneText: '', shown: (s) => s, ...opts };
      all = spec.parts.flatMap((p, pi) => p.moves.split(' ').filter(Boolean).map((m) => ({ move: m, part: pi })));
      pos = 0;
      cube.reset();
      still();
    },
    get busy() { return busy; },
  };
}
