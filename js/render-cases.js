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
//
// Card layout: picture (or 3D player) on the left; name, step label and
// mnemonic word on the right; the algorithm full width, with Libby's line
// always directly under it; then a collapsed "Breakdown and notes" holding the
// mnemonic breakdown, the alternative algorithm, story and notes.
// options.libby: also show every algorithm in Libby's notation.
export function renderCases(containerId, cases, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  // Pages with a picture index get a "↑ Index" link on every card.
  const hasIndex = !!document.getElementById('picture-index');

  cases.forEach((c, i) => {
    const card = el('article', 'case-card');
    // A case with only an alternative recorded (no main algorithm) shows that
    // one as its algorithm, not tucked away in the collapsed notes.
    const promoted = !c.alg && !!c.altAlg;
    const primary = c.alg || c.altAlg;
    const primaryChunks = c.alg ? c.mnemonicChunks : c.altMnemonicChunks;
    // Every card gets an id so the picture index (and anyone) can link to it.
    card.id = c.anchor || `${containerId}-${i + 1}`;

    const header = el('div', 'case-header');
    header.appendChild(el('h3', null, c.name));
    if (c.orientation) header.appendChild(el('p', 'case-orientation', c.orientation));
    // Exercises (hideAlg) keep the mnemonic with the hidden solution.
    if (!c.hideAlg && primaryChunks && primaryChunks.length) {
      header.appendChild(el('p', 'case-mnemonic-line', mnemonicLine(primaryChunks)));
    }

    const top = el('div', 'case-top');
    top.appendChild(header);
    card.appendChild(top);

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
      const diagram = caseDiagram(viewerAlg, {
        size: c.puzzle === '2x2x2' ? 2 : 3,
        stickering: c.stickering,
        views: c.diagramViews,
        hold,
      });
      visual.appendChild(diagram);
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
      top.prepend(visual);
      // Two pictures side by side (top + bottom) need the whole width.
      if (diagram.querySelectorAll('figure').length > 1) top.classList.add('stack');
    } else {
      top.classList.add('no-visual');
    }

    // hideAlg: the algorithm, extra algorithms and mnemonic go in a closed <details>.
    let solution = card;
    if (c.hideAlg) {
      solution = el('details', 'case-solution');
      solution.appendChild(el('summary', null, 'Show the solution'));
    }

    // Everything secondary goes in a collapsed "Breakdown and notes" (hideAlg
    // cards keep it all inside their solution, as before).
    const more = c.hideAlg ? card : el('details', 'case-more');
    if (!c.hideAlg) more.appendChild(el('summary', null, 'Breakdown and notes'));

    const algBlock = el('div', 'case-alg');
    const algFallback = 'Algorithm not recorded yet.';
    // displayAlg: shown instead of alg when the picture is built from a longer
    // sequence than the one the card is about (F2L: one step of a chain).
    algBlock.appendChild(el('code', null, c.displayAlg || primary || algFallback));
    solution.appendChild(algBlock);
    if (options.libby && primary) solution.appendChild(libbyLine(primary, primaryChunks));
    if (promoted && c.note) solution.appendChild(el('p', 'case-note', c.note));
    if (c.hideAlg) card.appendChild(solution);

    if (c.then) {
      const then = el('p', 'case-then', 'Then → ');
      const link = el('a', null, c.then.text);
      link.href = c.then.href;
      then.appendChild(link);
      card.appendChild(then);
      // thenDiagram: { alg, hold } — the picture of the case it turns into,
      // drawn like that case's own card. Always shown (the 3D player only
      // plays this card's own algorithm), and a link to that case.
      if (c.thenDiagram) {
        const next = el('a', 'case-next');
        next.href = c.then.href;
        next.title = `Go to ${c.then.text}`;
        const picture = caseDiagram(c.thenDiagram.alg, {
          size: c.puzzle === '2x2x2' ? 2 : 3,
          stickering: c.stickering,
          views: c.diagramViews,
          hold: c.thenDiagram.hold,
        });
        picture.className = 'case-next-diagram';
        next.appendChild(picture);
        next.appendChild(el('span', 'case-next-label', c.then.text));
        card.appendChild(next);
      }
    }

    for (const extra of c.extraAlgs || []) {
      const block = el('div', 'case-alt');
      block.appendChild(el('p', 'case-alt-label', extra.label));
      block.appendChild(el('code', null, extra.alg));
      solution.appendChild(block);
    }

    if (primaryChunks && primaryChunks.length) {
      if (c.hideAlg) {
        const mnem = el('div', 'case-mnemonic');
        mnem.appendChild(el('strong', null, mnemonicLine(primaryChunks)));
        mnem.appendChild(el('p', 'case-breakdown', mnemonicBreakdown(primaryChunks)));
        solution.appendChild(mnem);
      } else {
        more.appendChild(el('p', 'case-breakdown', mnemonicBreakdown(primaryChunks)));
      }
    }

    if (c.description) {
      card.appendChild(el('p', 'case-orientation', c.description));
    }

    if (c.turnsInto) {
      card.appendChild(el('p', 'case-turns-into', `On solve turns into: ${c.turnsInto}`));
    }

    if (promoted) {
      if (c.altNote) more.appendChild(el('p', 'case-alt-note', c.altNote));
    } else if (c.altAlg) {
      const alt = el('div', 'case-alt');
      alt.appendChild(el('p', 'case-alt-label', 'Alternative'));
      alt.appendChild(el('code', null, c.altAlg));
      if (options.libby) alt.appendChild(libbyLine(c.altAlg, c.altMnemonicChunks));
      if (c.altMnemonicChunks && c.altMnemonicChunks.length) {
        alt.appendChild(el('strong', null, mnemonicLine(c.altMnemonicChunks)));
        alt.appendChild(el('p', 'case-breakdown', mnemonicBreakdown(c.altMnemonicChunks)));
      }
      if (c.altNote) alt.appendChild(el('p', 'case-alt-note', c.altNote));
      more.appendChild(alt);
    }

    if (c.story) more.appendChild(el('p', 'case-story', c.story));
    if (c.note && !promoted) more.appendChild(el('p', 'case-note', c.note));

    if (!c.hideAlg && more.children.length > 1) card.appendChild(more);

    if (hasIndex) {
      const back = el('a', 'case-index-link', '↑ Index');
      back.href = '#picture-index';
      card.appendChild(back);
    }

    container.appendChild(card);
  });
}

// A grid of small pictures at the top of a case page, each linking to its
// card. The thumbnails are copies of the cards' own pictures, so they can't
// disagree with them. groups: [{ title, container: <id of a case grid> }].
// Call after renderCases for every group.
export function renderPictureIndex(slotId, groups) {
  const slot = document.getElementById(slotId);
  if (!slot) return;
  slot.classList.add('picture-index');
  for (const group of groups) {
    const cards = [...document.querySelectorAll(`#${group.container} > .case-card`)];
    if (!cards.length) continue;
    if (group.title) slot.appendChild(el('h2', 'index-heading', group.title));
    // Cases with no picture (Megaminx) get a plain list of names instead.
    const pictured = cards.every((card) => card.querySelector('.case-diagram svg'));
    const grid = el('div', pictured ? 'index-grid' : 'index-list');
    for (const card of cards) {
      const item = el('a', pictured ? 'index-item' : 'index-link');
      item.href = `#${card.id}`;
      const full = card.querySelector('h3').textContent;
      if (pictured) {
        item.appendChild(card.querySelector('.case-diagram svg').cloneNode(true));
        // "Y-perm — Diagonals" → "Y-perm"
        item.appendChild(el('span', null, full.split(' — ')[0]));
      } else {
        item.textContent = full;
      }
      grid.appendChild(item);
    }
    slot.appendChild(grid);
  }
}
