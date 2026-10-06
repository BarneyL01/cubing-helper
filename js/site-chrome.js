// The parts every page shares: the header, the grouped menu (a full-screen
// panel on phones, an inline nav on wide screens), breadcrumbs on sub-pages,
// and the collapsed "About this page" that source notes are moved into.
//
// Pages carry only `<header class="site-header" id="site-header">` with a plain
// link to the home page inside (the no-JavaScript fallback); this module builds
// the rest. Add a page to the menu by adding it to MENU below.
const ROOT = new URL('../', import.meta.url);
const url = (path) => new URL(path, ROOT);

// Paths are relative to the site root. `badge` shows next to the name.
const MENU = [
  { label: 'Home', path: 'index.html' },
  {
    group: '3x3',
    id: 'puzzle-3x3',
    items: [
      {
        label: 'CFOP',
        path: '3x3/cfop/index.html',
        children: [
          { label: '2-look OLL', path: '3x3/cfop/oll.html' },
          { label: '2-look PLL', path: '3x3/cfop/pll.html' },
          { label: 'F2L map', path: '3x3/cfop/f2l.html' },
        ],
      },
      { label: 'Roux', path: '3x3/roux/index.html', badge: 'Partial' },
      { label: "Beginner's", path: '3x3/beginners/index.html' },
      { label: '8355', path: '3x3/8355/index.html' },
      {
        label: 'Blindfolded',
        path: '3x3/bld/index.html',
        children: [
          { label: 'Practice', path: '3x3/bld/practice.html' },
          { label: 'Commutators', path: '3x3/bld/commutators.html' },
        ],
      },
    ],
  },
  { group: '2x2', id: 'puzzle-2x2', items: [{ label: 'Ortega', path: '2x2/index.html' }] },
  {
    group: 'Megaminx',
    id: 'puzzle-megaminx',
    items: [{ label: 'Last layer', path: 'megaminx/index.html', badge: 'Partial' }],
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

// Every page in the menu, with the trail of ancestors that leads to it.
function pages() {
  const out = [];
  for (const entry of MENU) {
    if (!entry.group) {
      out.push({ ...entry, trail: [] });
      continue;
    }
    const groupCrumb = { label: entry.group, path: `index.html#${entry.id}` };
    for (const item of entry.items) {
      out.push({ ...item, trail: [groupCrumb] });
      for (const child of item.children || []) out.push({ ...child, trail: [groupCrumb, item] });
    }
  }
  return out;
}

function badge(text) {
  return el('span', 'menu-badge', text);
}

function link(item, cls) {
  const a = el('a', cls, item.label);
  a.href = url(item.path).href;
  if (isHere(item.path)) a.setAttribute('aria-current', 'page');
  if (item.badge) a.append(' ', badge(item.badge));
  return a;
}

function buildNav() {
  const nav = el('nav', 'site-nav');
  nav.setAttribute('aria-label', 'Main');
  for (const entry of MENU) {
    if (!entry.group) {
      nav.appendChild(link(entry, 'nav-link'));
      continue;
    }
    const group = el('div', 'nav-group');
    group.appendChild(el('span', 'nav-group-label', entry.group));
    for (const item of entry.items) {
      group.appendChild(link(item, 'nav-link'));
      for (const child of item.children || []) group.appendChild(link(child, 'nav-link nav-sub'));
    }
    nav.appendChild(group);
  }
  return nav;
}

function buildPanel(onClose) {
  const panel = el('div', 'menu-panel');
  panel.id = 'site-menu';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Site menu');
  panel.hidden = true;

  const bar = el('div', 'menu-panel-bar');
  const brand = el('a', 'brand');
  brand.href = url('index.html').href;
  brand.innerHTML = `${LOGO}<span>Cubing Helper</span>`;
  const close = el('button', 'menu-button menu-close', 'Close');
  close.type = 'button';
  close.addEventListener('click', onClose);
  bar.append(brand, close);

  const list = el('div', 'menu-list');
  for (const entry of MENU) {
    if (!entry.group) {
      list.appendChild(link(entry, 'menu-row'));
      continue;
    }
    list.appendChild(el('p', 'menu-group-label', entry.group));
    for (const item of entry.items) {
      list.appendChild(link(item, 'menu-row'));
      if (item.children) {
        const sub = el('div', 'menu-sub');
        for (const child of item.children) sub.appendChild(link(child, 'menu-row'));
        list.appendChild(sub);
      }
    }
  }
  panel.append(bar, list);
  return panel;
}

function mountHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.textContent = '';

  const bar = el('div', 'header-bar');
  const brand = el('a', 'brand');
  brand.href = url('index.html').href;
  brand.innerHTML = `${LOGO}<span>Cubing Helper</span>`;
  const button = el('button', 'menu-button menu-open-button', 'Menu');
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'site-menu');
  bar.append(brand, buildNav(), button);
  header.appendChild(bar);

  const panel = buildPanel(() => setOpen(false));
  document.body.appendChild(panel);

  function setOpen(open) {
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) panel.querySelector('.menu-close').focus();
    else button.focus({ preventScroll: true });
  }
  button.addEventListener('click', () => setOpen(true));

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    // Keep Tab inside the open panel.
    const focusable = [...panel.querySelectorAll('a, button')];
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

  // The panel is for phones; if the window grows wide while it is open, close it.
  matchMedia('(min-width: 1280px)').addEventListener('change', (e) => {
    if (e.matches && !panel.hidden) setOpen(false);
  });
}

function mountBreadcrumbs() {
  const main = document.querySelector('main');
  const page = pages().find((p) => isHere(p.path));
  if (!main || !page || page.path === 'index.html') return;

  const nav = el('nav', 'breadcrumbs');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const list = el('ol');
  for (const crumb of page.trail) {
    const li = el('li');
    const a = el('a', null, crumb.label);
    a.href = url(crumb.path).href;
    li.appendChild(a);
    list.appendChild(li);
  }
  const current = el('li', null, page.label);
  current.setAttribute('aria-current', 'page');
  list.appendChild(current);
  nav.appendChild(list);
  main.prepend(nav);
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
mountBreadcrumbs();
mountAbout();
