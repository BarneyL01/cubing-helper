import { invertAlg } from './algs.js';

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
// each with an interactive 3D twisty-player preview built from the algorithm
// itself (so the preview can't drift out of sync with the algorithm text).
export function renderCases(containerId, cases) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (const c of cases) {
    const card = el('article', 'case-card');

    const header = el('div', 'case-header');
    header.appendChild(el('h3', null, c.name));
    if (c.orientation) header.appendChild(el('p', 'case-orientation', c.orientation));
    card.appendChild(header);

    const viewerAlg = c.alg || c.altAlg;
    if (viewerAlg) {
      const viewer = document.createElement('twisty-player');
      viewer.setAttribute('puzzle', c.puzzle || '3x3x3');
      viewer.setAttribute('alg', viewerAlg);
      viewer.setAttribute('experimental-setup-alg', invertAlg(viewerAlg));
      viewer.setAttribute('background', 'none');
      viewer.setAttribute('control-panel', 'bottom-row');
      viewer.className = 'case-viewer';
      card.appendChild(viewer);
    }

    const algBlock = el('div', 'case-alg');
    algBlock.appendChild(el('code', null, c.alg || 'Algorithm not recorded yet — see alternative below.'));
    card.appendChild(algBlock);

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
