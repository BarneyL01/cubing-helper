import { invertAlg } from './algs.js';
import { caseDiagram } from './cube-diagram.js';
import { startHold } from './cube-sim.js';

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

// Renders a list of algorithm "cases" (OLL/PLL/etc.) into a container element,
// each with a picture and a 3D player, both built from the algorithm itself
// (so neither can drift out of sync with the algorithm text).
export function renderCases(containerId, cases) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (const c of cases) {
    const card = el('article', 'case-card');
    if (c.anchor) card.id = c.anchor;

    const header = el('div', 'case-header');
    header.appendChild(el('h3', null, c.name));
    if (c.orientation) header.appendChild(el('p', 'case-orientation', c.orientation));
    card.appendChild(header);

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

    const algBlock = el('div', 'case-alg');
    const algFallback = c.altAlg
      ? 'Algorithm not recorded yet — see alternative below.'
      : 'Algorithm not recorded yet.';
    // displayAlg: shown instead of alg when the picture is built from a longer
    // sequence than the one the card is about (F2L: one step of a chain).
    algBlock.appendChild(el('code', null, c.displayAlg || c.alg || algFallback));
    card.appendChild(algBlock);

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
      card.appendChild(block);
    }

    if (c.mnemonicChunks && c.mnemonicChunks.length) {
      const mnem = el('div', 'case-mnemonic');
      mnem.appendChild(el('strong', null, mnemonicLine(c.mnemonicChunks)));
      mnem.appendChild(el('p', 'case-breakdown', mnemonicBreakdown(c.mnemonicChunks)));
      card.appendChild(mnem);
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
