// "Find a case" panel for the F2L page: one-tap filters by recognition
// feature (from f2l-features.js), the chart's category, and free text.
// Each filter chip shows how many cases it would leave, given the others.
const FILTERS = [
  {
    key: 'pieces',
    label: 'Pieces',
    options: [
      ['both-top', 'Both on top'],
      ['corner-slot', 'Corner in slot'],
      ['edge-slot', 'Edge in slot'],
      ['both-slot', 'Both in slot'],
    ],
  },
  {
    key: 'white',
    label: 'Corner’s white sticker faces',
    options: [
      ['up', 'Up'],
      ['front', 'Front'],
      ['right', 'Right'],
      ['down', 'Down'],
    ],
  },
  {
    key: 'edge',
    label: 'Edge',
    options: [
      ['top-front', 'On top, front colour up'],
      ['top-right', 'On top, right colour up'],
      ['slot-ok', 'In slot, correct'],
      ['slot-flipped', 'In slot, flipped'],
    ],
  },
  {
    key: 'pair',
    label: 'Pair (both on top)',
    options: [
      ['joined', 'Already joined'],
      ['touching', 'Touching, not joined'],
      ['apart', 'Apart'],
    ],
  },
];

const norm = (s) => s.toLowerCase().replace(/[()]/g, ' ').replace(/’/g, "'").replace(/\s+/g, ' ').trim();

// items: [{ id, isCase, features, category, text, el }]
// groups: [{ heading, grid }] — headings are hidden when their grid is empty.
export function mountF2lFinder(panel, items, groups) {
  const state = { pieces: null, white: null, edge: null, pair: null, category: '', query: '' };
  const categories = [...new Set(items.filter((i) => i.isCase && i.category).map((i) => i.category))].sort();

  panel.innerHTML = `
    <div class="finder-search">
      <input type="search" placeholder="Case number, moves or words — e.g. 25, R U' R', flipped" aria-label="Search F2L cases">
      <select aria-label="Chart category">
        <option value="">All chart categories</option>
        ${categories.map((c) => `<option>${c}</option>`).join('')}
      </select>
    </div>
    ${FILTERS.map(
      (f) => `
      <div class="finder-row" data-key="${f.key}">
        <span class="finder-label">${f.label}</span>
        <div class="finder-chips">
          ${f.options.map(([v, text]) => `<button type="button" class="chip" data-value="${v}" aria-pressed="false">${text} <span class="chip-count"></span></button>`).join('')}
        </div>
      </div>`,
    ).join('')}
    <p class="finder-hint">Front / right = the slot's two sides (green / orange in the pictures). Hold the cube with the corner above its slot, as in the pictures.</p>
    <div class="finder-status"><span class="finder-result" role="status"></span> <button type="button" class="finder-clear">Clear</button></div>`;

  const input = panel.querySelector('input');
  const select = panel.querySelector('select');
  const result = panel.querySelector('.finder-result');
  const clear = panel.querySelector('.finder-clear');

  function matches(item, except) {
    if (!item.isCase) return false;
    for (const f of FILTERS) {
      if (f.key !== except && state[f.key] && item.features[f.key] !== state[f.key]) return false;
    }
    if (state.category && item.category !== state.category) return false;
    if (state.query) {
      const q = norm(state.query);
      if (/^\d+$/.test(q)) return item.id === q;
      if (!item.text.includes(q)) return false;
    }
    return true;
  }

  function update() {
    const filtering = FILTERS.some((f) => state[f.key]) || state.category || state.query;
    let shown = 0;
    for (const item of items) {
      const visible = filtering ? matches(item) : true;
      item.el.hidden = !visible;
      if (visible && item.isCase) shown++;
    }
    for (const g of groups) g.heading.hidden = g.grid.hidden = ![...g.grid.children].some((c) => !c.hidden);

    // Chip counts: how many cases would show if this option were picked.
    for (const f of FILTERS) {
      for (const chip of panel.querySelectorAll(`[data-key="${f.key}"] .chip`)) {
        const n = items.filter((i) => matches(i, f.key) && i.features[f.key] === chip.dataset.value).length;
        chip.querySelector('.chip-count').textContent = `(${n})`;
        chip.disabled = n === 0 && state[f.key] !== chip.dataset.value;
        chip.setAttribute('aria-pressed', String(state[f.key] === chip.dataset.value));
      }
    }
    const total = items.filter((i) => i.isCase).length;
    result.textContent = filtering
      ? shown === 0
        ? 'No cases match — try removing a filter.'
        : `Showing ${shown} of ${total} cases`
      : `Showing all ${total} cases, plus the chart's in-between steps`;
    clear.hidden = !filtering;
  }

  panel.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const key = chip.closest('.finder-row').dataset.key;
    state[key] = state[key] === chip.dataset.value ? null : chip.dataset.value;
    update();
  });
  input.addEventListener('input', () => {
    state.query = input.value;
    update();
  });
  select.addEventListener('change', () => {
    state.category = select.value;
    update();
  });
  function reset() {
    Object.assign(state, { pieces: null, white: null, edge: null, pair: null, category: '', query: '' });
    input.value = '';
    select.value = '';
    update();
  }
  clear.addEventListener('click', reset);
  // Following a "Then →" or map link to a case the filters are hiding
  // would land nowhere, so drop the filters first.
  window.addEventListener('hashchange', () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.hidden) {
      reset();
      target.scrollIntoView();
    }
  });
  update();
}
