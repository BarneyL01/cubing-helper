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
          { label: 'Orozco', path: '3x3/bld/orozco.html' },
          { label: 'How Orozco works', path: '3x3/bld/orozco-explained.html' },
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

// Title (tier 2): on a page of a section with several pages, a small kicker
// with the section's name above the h1 and a quiet row of the section's pages
// under the title (after the subtitles that follow the h1, if there are any).
// Returns the element that "On this page" goes after.
function mountTitle() {
  const main = document.querySelector('main');
  const h1 = main?.querySelector('h1');
  if (!main || !h1) return null;
  let anchor = h1;
  while (anchor.nextElementSibling?.classList.contains('subtitle')) anchor = anchor.nextElementSibling;
  if (!currentSection?.pages) return anchor;

  h1.before(el('p', 'page-kicker', currentSection.label));
  const row = el('nav', 'section-row');
  row.setAttribute('aria-label', `${currentSection.label} pages`);
  for (const page of currentSection.pages) row.appendChild(link(page.label, page.path, 'section-row-link'));
  anchor.after(row);
  // On a phone the row may scroll sideways: bring the current page into view.
  const active = row.querySelector('[aria-current="page"]');
  if (active && row.scrollWidth > row.clientWidth) {
    row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }
  return row;
}

// "On this page" (tier 3): one entry per h2.section-heading[id] (data-short is
// the short label) and per step of a steps page (section.step[id]). Headings
// that page scripts add later are picked up too, and headings inside a hidden
// part of the page are left out. Shown only with 3 or more entries.
const TARGETS = 'h2.section-heading, section.step[id]';
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function entryOf(t) {
  const text = (t.matches('section') ? t.querySelector('h2')?.textContent : t.textContent)?.trim() || '';
  const m = text.match(/^(\d+)\.\s*(.*)$/);
  return {
    id: t.id,
    num: t.dataset.num || (m ? m[1] : ''),
    label: t.dataset.short || (m ? m[2] : text),
    title: text,
  };
}

function mountOnThisPage(after) {
  const main = document.querySelector('main');
  if (!main) return;
  const wide = matchMedia(MENU_WIDE);

  const box = el('nav', 'otp');
  box.setAttribute('aria-label', 'On this page');
  box.hidden = true;
  const title = el('p', 'otp-title', 'On this page');
  const button = el('button', 'otp-button');
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'otp-list');
  const current = el('span', 'otp-current');
  button.append(el('span', 'otp-label', 'On this page'), current);
  const list = el('div', 'otp-list');
  list.id = 'otp-list';
  box.append(title, button, list);
  // A page-wide switch right under the title (After 8355) stays above it.
  while (after?.nextElementSibling?.classList.contains('page-switch')) after = after.nextElementSibling;
  if (after) after.after(box);
  else main.prepend(box);

  let targets = [];
  let links = [];
  let signature = '';

  const root = document.documentElement;
  const header = document.getElementById('site-header');
  function setOffset() {
    const extra = !box.hidden && !wide.matches ? box.offsetHeight : 0;
    root.style.setProperty('--anchor-offset', `${(header?.offsetHeight ?? 0) + extra + 8}px`);
  }

  function setOpen(open) {
    box.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  }
  button.addEventListener('click', () => setOpen(!box.classList.contains('is-open')));
  list.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && box.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!box.contains(e.target)) setOpen(false);
  });

  let active = null;
  function markActive() {
    if (!targets.length) return;
    const line = parseFloat(getComputedStyle(root).getPropertyValue('--anchor-offset')) + 16;
    let now = 0;
    targets.forEach((t, i) => {
      if (t.getBoundingClientRect().top <= line) now = i;
    });
    // At the very bottom the last sections may be too short to reach the line:
    // prefer the one just jumped to.
    if (innerHeight + scrollY >= root.scrollHeight - 2) {
      const jumped = targets.findIndex((t) => `#${t.id}` === location.hash);
      now = jumped > now ? jumped : now;
    }
    if (now === active) return;
    active = now;
    links.forEach((a, i) => (i === now ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    const e = entryOf(targets[now]);
    current.textContent = e.num ? `${e.num}. ${e.label}` : e.label;
    // Keep the highlighted entry in view inside the desktop list.
    if (wide.matches && list.scrollHeight > list.clientHeight) {
      const a = links[now];
      if (a.offsetTop < list.scrollTop || a.offsetTop + a.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = a.offsetTop - list.clientHeight / 2;
      }
    }
  }

  function rebuild() {
    const found = [...main.querySelectorAll(TARGETS)].filter(
      (t) => !box.contains(t) && !t.closest('[hidden]') && entryOf(t).title,
    );
    for (const t of found) {
      if (!t.id) {
        let id = slug(entryOf(t).title) || 'section';
        while (document.getElementById(id)) id += '-2';
        t.id = id;
      }
    }
    const entries = found.map(entryOf);
    const sig = entries.map((e) => `${e.id}|${e.num}|${e.label}`).join('\n');
    if (sig === signature) return;
    signature = sig;
    targets = found;
    active = null;
    list.replaceChildren();
    links = entries.map((e) => {
      const a = el('a', 'otp-link');
      a.href = `#${e.id}`;
      if (e.num) a.append(el('span', 'otp-num', e.num));
      a.append(el('span', null, e.label));
      if (e.title !== e.label) a.title = e.title;
      list.appendChild(a);
      return a;
    });
    const show = entries.length >= 3;
    box.hidden = !show;
    document.body.classList.toggle('has-otp', show);
    if (!show) targets = [];
    setOffset();
    markActive();
  }

  let timer = 0;
  const later = () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 60);
  };
  new MutationObserver((records) => {
    if (records.some((r) => !box.contains(r.target))) later();
  }).observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'id', 'data-short'] });

  rebuild();
  // Page scripts run after this module: build again once they have.
  document.addEventListener('DOMContentLoaded', rebuild);
  addEventListener('load', rebuild);
  addEventListener('scroll', markActive, { passive: true });
  addEventListener('hashchange', markActive);
  addEventListener('resize', () => {
    setOffset();
    markActive();
  });
  wide.addEventListener('change', () => {
    setOpen(false);
    setOffset();
  });
}

mountHeader();
trackHeaderHeight();
mountOnThisPage(mountTitle());
mountAbout();
