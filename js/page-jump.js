// A sticky "Jump to" bar for a long page: one pill for every h2.section-heading that has an
// id (a "5. Title" heading gets the number as the pill's badge; data-short on the heading
// gives a shorter pill label). The pill for the section being read is highlighted, and
// anchors are offset so a heading is not hidden under the header and the bar.
// Call it once the page's headings have their text.
export function mountJumpBar() {
  const main = document.querySelector('main');
  if (!main || main.querySelector('.jump-bar')) return;
  const heads = [...main.querySelectorAll('h2.section-heading[id]')].filter((h) => h.textContent.trim());
  if (heads.length < 3) return;

  const bar = document.createElement('nav');
  bar.className = 'step-bar jump-bar';
  bar.setAttribute('aria-label', 'Jump to a section');
  const pills = heads.map((h) => {
    const text = h.textContent.trim();
    const m = text.match(/^(\d+)\.\s*(.*)$/);
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.className = `step-pill${m ? '' : ' no-num'}`;
    if (m) {
      const num = document.createElement('span');
      num.className = 'step-pill-num';
      num.textContent = m[1];
      a.appendChild(num);
    }
    const title = document.createElement('span');
    title.className = 'step-pill-title';
    title.textContent = h.dataset.short || (m ? m[2] : text);
    a.appendChild(title);
    a.title = text;
    h.classList.add('jump-target');
    bar.appendChild(a);
    return a;
  });
  const anchor = main.querySelector('nav.tabs');
  if (anchor) anchor.after(bar);
  else main.prepend(bar);

  const header = document.getElementById('site-header');
  const setOffset = () =>
    document.documentElement.style.setProperty('--jump-offset', `${(header?.offsetHeight ?? 0) + bar.offsetHeight + 8}px`);
  let current = null;
  const update = () => {
    const line = (header?.offsetHeight ?? 0) + bar.offsetHeight + 24;
    let now = heads[0];
    for (const h of heads) if (h.getBoundingClientRect().top <= line) now = h;
    // At the very bottom the last section may be too short to reach the line.
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) now = heads.at(-1);
    if (now === current) return;
    current = now;
    pills.forEach((p, i) => p.classList.toggle('active', heads[i] === now));
    const active = pills[heads.indexOf(now)];
    // Keep the highlighted pill in view inside the bar, without scrolling the page.
    bar.scrollLeft = active.offsetLeft - (bar.clientWidth - active.offsetWidth) / 2;
  };
  setOffset();
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', () => { setOffset(); update(); });
}
