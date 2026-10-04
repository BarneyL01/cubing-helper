// A row of pictures showing a position after each stage of an algorithm.
//
// The pictures come from the simulator, not from drawings: the position after
// the first n moves of an algorithm that solves a case is exactly the case the
// *remaining* moves solve, so each frame is caseDiagram(remaining moves).
// Pieces named in `marks` get a coloured outline wherever they are, so the eye
// can follow them from frame to frame.
import { caseDiagram } from './cube-diagram.js';
import { invertAlg } from './algs.js';

const OUTLINES = { pink: '#e11d9b', blue: '#0ea5e9' };

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

const tokens = (alg) => alg.trim().split(/\s+/).filter(Boolean);

// spec: {
//   alg      – the whole algorithm (it must solve the case being shown)
//   stickering, views – as for caseDiagram (default: edges only, top + cube)
//   marks    – [{ piece: 'FR', colour: 'pink' | 'blue' }, ...] pieces named by their colours
//   legend   – [{ colour: 'pink', text: '…' }, ...]
//   frames   – [{ after: "R U R'", label?, caption? }, ...]; `after` is the chunk of
//              moves done since the previous frame ('' for the starting frame)
//   fromSolved – true to show what the algorithm *does to a solved cube* (frame n is the
//              solved cube after the first n moves) instead of how it solves a case
//   every    – optional { summary } to add a collapsed "every single move" strip
// }
export function buildFilmstrip(spec) {
  const { alg, stickering = 'edges', views = ['U', 'cube'], marks = [], legend = [], frames, every, fromSolved = false } = spec;
  const all = tokens(alg);
  const outlines = marks.map((m) => ({ piece: m.piece, colour: OUTLINES[m.colour] || m.colour }));

  function frame(done, label, caption) {
    const li = el('li', 'film-frame');
    li.appendChild(el('div', 'film-label', label));
    // The position the remaining moves solve = the position reached after the moves so far.
    // From a solved cube, the position after the first n moves is solved by their inverse.
    const shown = fromSolved ? invertAlg(all.slice(0, done).join(' ')) : all.slice(done).join(' ');
    const diagram = caseDiagram(shown, { stickering, views, marks: outlines });
    // The Pictures / 3D toggle hides `.case-diagram`; a step-by-step strip
    // has no 3D equivalent, so it keeps its own class and always shows.
    diagram.className = 'film-diagram';
    li.appendChild(diagram);
    if (caption) li.appendChild(el('p', 'film-caption', caption));
    return li;
  }

  const root = el('div', 'filmstrip');
  if (legend.length) {
    const key = el('p', 'film-legend');
    for (const item of legend) {
      const swatch = el('span', 'film-swatch');
      swatch.style.borderColor = OUTLINES[item.colour] || item.colour;
      key.append(swatch, ` ${item.text}   `);
    }
    root.appendChild(key);
  }

  const strip = el('ol', 'film');
  let done = 0;
  for (const f of frames) {
    const chunk = tokens(f.after || '');
    if (chunk.join(' ') !== all.slice(done, done + chunk.length).join(' ')) {
      throw new Error(`Filmstrip frame "${f.after}" does not follow the moves done so far in "${alg}"`);
    }
    done += chunk.length;
    strip.appendChild(frame(done, f.label ?? (chunk.length ? chunk.join(' ') : 'Start'), f.caption));
  }
  root.appendChild(strip);

  if (every) {
    const details = el('details', 'film-every');
    details.appendChild(el('summary', null, every.summary || 'Show every single move'));
    const list = el('ol', 'film');
    list.appendChild(frame(0, 'Start'));
    all.forEach((move, i) => list.appendChild(frame(i + 1, move, every.captions?.[i])));
    details.appendChild(list);
    root.appendChild(details);
  }
  return root;
}
