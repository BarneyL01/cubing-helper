import { invertAlg } from './algs.js';
import { caseDiagram } from './cube-diagram.js';
import { startHold } from './cube-sim.js';
import { buildFilmstrip } from './alg-filmstrip.js';
import { libbyNotation } from './libby.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function mnemonicLine(chunks) {
  return chunks.map((c) => c.word).join('-');
}

function mnemonicBreakdown(chunks) {
  return chunks.map((c) => `${c.word} (${c.moves})`).join('  +  ');
}

// The "Libby's:" line: the algorithm in Libby's notation (R=1 U=2 R'=3 U'=4),
// grouped like the mnemonic words. See js/libby.js.
function libbyLine(alg, chunks) {
  const line = el('p', 'case-libby');
  line.appendChild(el('strong', null, "Libby's: "));
  line.appendChild(el('code', null, libbyNotation(alg, chunks)));
  return line;
}

// Renders a list of algorithm "cases" (OLL/PLL/etc.) into a container element,
// each with a picture and a 3D player, both built from the algorithm itself
// (so neither can drift out of sync with the algorithm text).
// options.libby: also show every algorithm in Libby's notation.
export function renderCases(containerId, cases, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (const c of cases) {
    const card = el('article', 'case-card');
    if (c.anchor) card.id = c.anchor;

    const header = el('div', 'case-header');
    header.appendChild(el('h3', null, c.name));
    if (c.orientation) header.appendChild(el('p', 'case-orientation', c.orientation));
    card.appendChild(header);

    // Exercises: the scramble to apply, with the solution kept behind a button.
    if (c.setup) {
      const setup = el('p', 'case-setup', 'Setup scramble: ');
      setup.appendChild(el('code', null, c.setup));
      card.appendChild(setup);
    }

    // filmstrip: a step-by-step row of pictures instead of the single picture
    // (set noViewer too); such a card spans the whole row.
    if (c.filmstrip) {
      card.classList.add('wide');
      card.appendChild(buildFilmstrip(c.filmstrip));
    }

    const viewerAlg = !c.noViewer && (c.alg || c.altAlg);
    if (viewerAlg) {
      const hold = c.hold ?? startHold(viewerAlg);
      const visual = el('div', 'case-visual');
      visual.appendChild(
        caseDiagram(viewerAlg, {
          size: c.puzzle === '2x2x2' ? 2 : 3,
          stickering: c.stickering,
          views: c.diagramViews,
          hold,
        }),
      );
      // Stays an inert element until the 3D toggle loads the cubing.js script.
      const viewer = document.createElement('twisty-player');
      viewer.setAttribute('puzzle', c.puzzle || '3x3x3');
      viewer.setAttribute('alg', viewerAlg);
      // z2 turns cubing.js's default white-on-top cube over to yellow-on-top,
      // matching the pictures.
      viewer.setAttribute('experimental-setup-alg', `z2 ${hold} ${invertAlg(viewerAlg)}`);
      viewer.setAttribute('background', 'none');
      viewer.setAttribute('control-panel', 'bottom-row');
      viewer.className = 'case-viewer';
      visual.appendChild(viewer);
      card.appendChild(visual);
    }

    // hideAlg: the algorithm, extra algorithms and mnemonic go in a closed <details>.
    let solution = card;
    if (c.hideAlg) {
      solution = el('details', 'case-solution');
      solution.appendChild(el('summary', null, 'Show the solution'));
    }

    const algBlock = el('div', 'case-alg');
    const algFallback = c.altAlg
      ? 'Algorithm not recorded yet — see alternative below.'
      : 'Algorithm not recorded yet.';
    // displayAlg: shown instead of alg when the picture is built from a longer
    // sequence than the one the card is about (F2L: one step of a chain).
    algBlock.appendChild(el('code', null, c.displayAlg || c.alg || algFallback));
    solution.appendChild(algBlock);
    if (options.libby && c.alg) solution.appendChild(libbyLine(c.alg, c.mnemonicChunks));
    if (c.hideAlg) card.appendChild(solution);

    if (c.then) {
      const then = el('p', 'case-then', 'Then → ');
      const link = el('a', null, c.then.text);
      link.href = c.then.href;
      then.appendChild(link);
      card.appendChild(then);
    }

    for (const extra of c.extraAlgs || []) {
      const block = el('div', 'case-alt');
      block.appendChild(el('p', 'case-alt-label', extra.label));
      block.appendChild(el('code', null, extra.alg));
      solution.appendChild(block);
    }

    if (c.mnemonicChunks && c.mnemonicChunks.length) {
      const mnem = el('div', 'case-mnemonic');
      mnem.appendChild(el('strong', null, mnemonicLine(c.mnemonicChunks)));
      mnem.appendChild(el('p', 'case-breakdown', mnemonicBreakdown(c.mnemonicChunks)));
      solution.appendChild(mnem);
    }

    if (c.description) {
      card.appendChild(el('p', 'case-orientation', c.description));
    }

    if (c.turnsInto) {
      card.appendChild(el('p', 'case-turns-into', `On solve turns into: ${c.turnsInto}`));
    }

    if (c.altAlg) {
      const alt = el('div', 'case-alt');
      alt.appendChild(el('p', 'case-alt-label', 'Alternative'));
      alt.appendChild(el('code', null, c.altAlg));
      if (options.libby) alt.appendChild(libbyLine(c.altAlg, c.altMnemonicChunks));
      if (c.altMnemonicChunks && c.altMnemonicChunks.length) {
        alt.appendChild(el('strong', null, mnemonicLine(c.altMnemonicChunks)));
        alt.appendChild(el('p', 'case-breakdown', mnemonicBreakdown(c.altMnemonicChunks)));
      }
      if (c.altNote) alt.appendChild(el('p', 'case-alt-note', c.altNote));
      card.appendChild(alt);
    }

    if (c.story) card.appendChild(el('p', 'case-story', c.story));
    if (c.note) card.appendChild(el('p', 'case-note', c.note));

    container.appendChild(card);
  }
}
