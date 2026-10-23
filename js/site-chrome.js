// The parts every page shares, all built from MENU below:
// - the header: a Menu button, the brand (home) and "› <current section>";
// - the menu: a panel on the left over a scrim on wide screens, a full-screen
//   accordion on phones (see MENU_WIDE);
// - the section row (the pages of the current section, under the title) and a
//   small kicker with the section name above the h1;
// - "On this page", built from the page's h2.section-heading[id] headings (and
//   the steps of a steps page): a sticky control on phones, a list in the right
//   column on wide screens;
// - the collapsed "About this page" that source notes are moved into.
//
// Pages carry only `<header class="site-header" id="site-header">` with a plain
// link to the home page inside (the no-JavaScript fallback); this module builds
// the rest. Add a page by adding it to MENU.
const ROOT = new URL('../', import.meta.url);
const url = (path) => new URL(path, ROOT);

// Width from which the menu is a panel on the left and "On this page" is a
// right-hand column. Keep in step with the @media (min-width: 900px) rules in
// css/style.css.
const MENU_WIDE = '(min-width: 900px)';

// Four groups of sections. A section is one page ({ label, path }) or several
// ({ label, pages: [{ label, path }] }, at most 6). Paths are relative to the
// site root. `badge` shows next to the section's name.
const MENU = [
  {
    group: 'Methods',
    sections: [
      {
        label: 'CFOP',
        pages: [
          { label: 'Overview', path: '3x3/cfop/index.html' },
          { label: '2-look OLL', path: '3x3/cfop/oll.html' },
          { label: '2-look PLL', path: '3x3/cfop/pll.html' },
          { label: 'F2L map', path: '3x3/cfop/f2l.html' },
        ],
      },
      {
        label: 'Roux',
        badge: 'Partial',
        pages: [
          { label: 'Reference', path: '3x3/roux/index.html' },
          { label: 'LSE map', path: '3x3/roux/lse-map.html' },
        ],
      },
      { label: "Beginner's", path: '3x3/beginners/index.html' },
      { label: '8355', path: '3x3/8355/index.html' },
      { label: 'Heise', path: '3x3/heise/index.html', badge: 'Partial' },
      { label: 'Marshall', path: '3x3/marshall/index.html', badge: 'Partial' },
    ],
  },
  {
    group: 'Blindfolded',
    sections: [
      {
        label: 'Blind',
        pages: [
          { label: 'Overview', path: '3x3/bld/index.html' },
          { label: 'M2 edges', path: '3x3/bld/m2.html' },
          { label: 'Old Pochmann', path: '3x3/bld/old-pochmann.html' },
          { label: 'Letter pairs', path: '3x3/bld/letter-pairs.html' },
        ],
      },
      {
        label: 'Commutators',
        pages: [
          { label: 'Basics', path: '3x3/bld/commutators.html' },
          { label: 'Corner cycles', path: '3x3/bld/corner-cycles.html' },
          { label: 'Corner table', path: '3x3/bld/corner-table.html' },
          { label: 'After 8355', path: '3x3/bld/corner-8355.html' },
          { label: 'Twists & parity', path: '3x3/bld/corner-twists.html' },
          { label: 'Edge cycles', path: '3x3/bld/edge-cycles.html' },
        ],
      },
    ],
  },
  {
    group: 'Practice',
    sections: [
      {
        label: 'Practice',
        pages: [
          { label: 'Recognition', path: '3x3/practice/recognition.html' },
          { label: 'Blind drills', path: '3x3/practice/blind-drills.html' },
          { label: 'Blind memo', path: '3x3/bld/practice.html' },
        ],
      },
    ],
  },
  {
    group: 'Other puzzles',
    sections: [
      { label: '2x2', path: '2x2/index.html' },
      { label: 'Megaminx', path: 'megaminx/index.html', badge: 'Partial' },
    ],
  },
];

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

const LOGO = `<svg class="brand-logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#2f6fed"/><g stroke="#fff" stroke-width="2"><line x1="0" y1="11" x2="32" y2="11"/><line x1="0" y1="21" x2="32" y2="21"/><line x1="11" y1="0" x2="11" y2="32"/><line x1="21" y1="0" x2="21" y2="32"/></g></svg>`;

// A path with a trailing "index.html" or "/" removed, so /x/ and /x/index.html compare equal.
const normal = (p) => p.replace(/index\.html$/, '').replace(/\/$/, '');
const here = normal(location.pathname);
const isHere = (path) => normal(url(path).pathname) === here;

const pagesOf = (section) => section.pages || [{ label: section.label, path: section.path }];
const currentSection = MENU.flatMap((g) => g.sections).find((s) => pagesOf(s).some((p) => isHere(p.path)));
const currentPage = currentSection && pagesOf(currentSection).find((p) => isHere(p.path));

function badge(text) {
  return el('span', 'menu-badge', text);
}

function link(label, path, cls, badgeText) {
  const a = el('a', cls, label);
  a.href = url(path).href;
  if (isHere(path)) a.setAttribute('aria-current', 'page');
  if (badgeText) a.append(' ', badge(badgeText));
  return a;
}

const visible = (n) => n.getClientRects().length > 0;

// The menu: every group and section. Wide screens show every section's pages
// (a bold label with its pages indented); phones show an accordion where a
// section with several pages opens with +/− and the current one starts open.
function buildPanel(onClose) {
  const panel = el('div', 'menu-panel');
  panel.id = 'site-menu';
  panel.hidden = true;

  const scrim = el('div', 'menu-scrim');
  scrim.addEventListener('click', onClose);

  const drawer = el('div', 'menu-drawer');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Site menu');

  const bar = el('div', 'menu-panel-bar');
  const brand = el('a', 'brand');
  brand.href = url('index.html').href;
  brand.innerHTML = `${LOGO}<span>Cubing Helper</span>`;
  const close = el('button', 'menu-button menu-close', 'Close');
  close.type = 'button';
  close.addEventListener('click', onClose);
  bar.append(brand, close);

  const nav = el('nav', 'menu-list');
  nav.setAttribute('aria-label', 'All pages');
  nav.appendChild(link('Home', 'index.html', 'menu-sec'));
  let n = 0;
  for (const group of MENU) {
    nav.appendChild(el('p', 'menu-group-label', group.group));
    for (const section of group.sections) {
      if (!section.pages) {
        nav.appendChild(link(section.label, section.path, 'menu-sec', section.badge));
        continue;
      }
      const isCurrent = section === currentSection;
      const box = el('div', `menu-section${isCurrent ? ' is-open is-current' : ''}`);
      const pagesId = `menu-pages-${++n}`;

      const label = el('span', 'menu-sec menu-sec-label', section.label);
      if (section.badge) label.append(' ', badge(section.badge));

      const toggle = el('button', 'menu-sec menu-sec-toggle');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', String(isCurrent));
      toggle.setAttribute('aria-controls', pagesId);
      const name = el('span', null, section.label);
      if (section.badge) name.append(' ', badge(section.badge));
      const plus = el('span', 'menu-plus', isCurrent ? '−' : '+');
      plus.setAttribute('aria-hidden', 'true');
      toggle.append(name, plus);
      toggle.addEventListener('click', () => {
        const open = !box.classList.contains('is-open');
        box.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        plus.textContent = open ? '−' : '+';
      });

      const list = el('div', 'menu-pages');
      list.id = pagesId;
      for (const page of section.pages) list.appendChild(link(page.label, page.path, 'menu-page'));
      box.append(label, toggle, list);
      nav.appendChild(box);
    }
  }

  drawer.append(bar, nav);
  panel.append(scrim, drawer);
  return panel;
}

function mountHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.textContent = '';

  const bar = el('div', 'header-bar');
  const button = el('button', 'menu-button menu-open-button');
  button.type = 'button';
  button.innerHTML = '<span class="menu-bars" aria-hidden="true"><i></i><i></i><i></i></span>Menu';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'site-menu');
  const brand = el('a', 'brand');
  brand.href = url('index.html').href;
  brand.innerHTML = `${LOGO}<span>Cubing Helper</span>`;
  bar.append(button, brand);
  if (currentSection) {
    const where = el('a', 'header-section');
    where.href = url(pagesOf(currentSection)[0].path).href;
    where.append(el('span', 'header-section-sep', '›'), el('span', 'header-section-name', currentSection.label));
    bar.appendChild(where);
  }
  header.appendChild(bar);

  const panel = buildPanel(() => setOpen(false));
  document.body.appendChild(panel);

  function setOpen(open) {
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      // Show the current page's row without scrolling the page itself.
      const list = panel.querySelector('.menu-list');
      const mark = [...panel.querySelectorAll('[aria-current="page"]')].find(visible);
      if (mark) list.scrollTop = Math.max(0, mark.offsetTop - list.clientHeight / 2);
      panel.querySelector('.menu-close').focus();
    } else button.focus({ preventScroll: true });
  }
  button.addEventListener('click', () => setOpen(true));

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    // Keep Tab inside the open menu (only what this width shows).
    const focusable = [...panel.querySelectorAll('a, button')].filter(visible);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// Source and attribution notes are for reading once, not mid-solve: gather
// them into one collapsed section at the bottom of the page.
function mountAbout() {
  const main = document.querySelector('main');
  if (!main) return;
  const notes = [...main.querySelectorAll('.source-note')];
  if (!notes.length) return;
  const about = el('details', 'about-page');
  about.id = 'about-page';
  about.appendChild(el('summary', null, 'About this page'));
  for (const note of notes) about.appendChild(note);
  main.appendChild(about);
  // A link to the notes (e.g. from a citation) opens them.
  const open = () => {
    if (location.hash === '#about-page') about.open = true;
  };
  addEventListener('hashchange', open);
  open();
}

// Jump links and sticky bars below the header need to know how tall it is.
function trackHeaderHeight() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const set = () => document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  set();
  addEventListener('resize', set);
}

mountHeader();
trackHeaderHeight();
mountAbout();
