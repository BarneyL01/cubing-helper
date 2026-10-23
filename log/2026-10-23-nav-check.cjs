// Navigation redesign (2026-10-23): headless check of every page at 390 and 1280 px.
// Serve the repo root first (python3 -m http.server 8765), then:
//   PORT=8765 node log/2026-10-23-nav-check.cjs
// Checks: console errors, horizontal scroll, no old nav bars, section row where expected,
// menu opens / Esc / scrim or Close / focus kept inside and returned, accordion, On this page,
// the After 8355 switch, and the corner-8355-lb.html and old-anchor redirects.
// Saves screenshots to log/nav-redesign-shots/.
const { join } = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT || '/opt/node22/lib/node_modules/playwright');
const BASE = `http://localhost:${process.env.PORT || 8765}/`;
const SHOTS = join(__dirname, 'nav-redesign-shots') + '/';
const PAGES = [
  'index.html',
  '3x3/cfop/index.html', '3x3/cfop/oll.html', '3x3/cfop/pll.html', '3x3/cfop/f2l.html',
  '3x3/roux/index.html', '3x3/roux/lse-map.html',
  '3x3/beginners/index.html', '3x3/8355/index.html', '3x3/heise/index.html', '3x3/marshall/index.html',
  '3x3/bld/index.html', '3x3/bld/m2.html', '3x3/bld/old-pochmann.html', '3x3/bld/letter-pairs.html',
  '3x3/bld/commutators.html', '3x3/bld/corner-cycles.html', '3x3/bld/corner-table.html',
  '3x3/bld/corner-8355.html', '3x3/bld/corner-twists.html', '3x3/bld/edge-cycles.html',
  '3x3/practice/recognition.html', '3x3/practice/blind-drills.html', '3x3/bld/practice.html',
  '2x2/index.html', 'megaminx/index.html',
];
const MULTI = new Set(PAGES.filter((p) => /cfop|roux|bld|practice/.test(p)));

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const problems = [];
  const rows = [];
  for (const width of [390, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 860 } });
    for (const path of PAGES) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(BASE + path, { waitUntil: 'load' });
      await page.waitForTimeout(700);
      const info = await page.evaluate(() => {
        const otp = document.querySelector('.otp');
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          row: !!document.querySelector('.section-row'),
          rowCurrent: document.querySelector('.section-row [aria-current="page"]')?.textContent || '',
          kicker: document.querySelector('.page-kicker')?.textContent || '',
          where: document.querySelector('.header-section-name')?.textContent || '',
          otp: otp && !otp.hidden ? document.querySelectorAll('.otp-link').length : 0,
          oldBars: document.querySelectorAll('nav.tabs, .step-bar, .jump-bar, .breadcrumbs, .site-nav').length,
          h1: document.querySelector('h1')?.textContent.trim(),
        };
      });
      // Menu: open, check, Esc closes; open again, scrim/Close closes; focus returns.
      await page.click('.menu-open-button');
      await page.waitForTimeout(250);
      const menu = await page.evaluate(() => ({
        open: !document.getElementById('site-menu').hidden,
        locked: getComputedStyle(document.documentElement).overflow === 'hidden',
        focus: document.activeElement?.className,
        current: [...document.querySelectorAll('#site-menu [aria-current="page"]')].filter((n) => n.getClientRects().length).map((n) => n.textContent.trim()),
      }));
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
      const escClosed = await page.evaluate(() => document.getElementById('site-menu').hidden && document.activeElement?.classList.contains('menu-open-button'));
      await page.click('.menu-open-button');
      await page.waitForTimeout(250);
      // Tab past the end wraps inside the menu.
      const visibleCount = await page.evaluate(() => [...document.querySelectorAll('#site-menu a, #site-menu button')].filter((n) => n.getClientRects().length).length);
      for (let i = 0; i < visibleCount + 1; i++) await page.keyboard.press('Tab');
      const focusInside = await page.evaluate(() => document.getElementById('site-menu').contains(document.activeElement));
      let accordion = 'n/a';
      if (width === 390) {
        // Expand a section that is not open.
        accordion = await page.evaluate(() => {
          const t = [...document.querySelectorAll('.menu-sec-toggle')].find((b) => b.getAttribute('aria-expanded') === 'false');
          if (!t) return 'none closed';
          t.click();
          const pages = document.getElementById(t.getAttribute('aria-controls'));
          return t.getAttribute('aria-expanded') === 'true' && pages.getClientRects().length > 0 ? 'ok' : 'FAIL';
        });
        if (path === '3x3/bld/corner-cycles.html') await page.screenshot({ path: SHOTS + 'phone-menu.png' });
        await page.click('.menu-close');
      } else {
        if (path === '3x3/bld/corner-cycles.html') await page.screenshot({ path: SHOTS + 'desktop-menu-panel.png' });
        await page.mouse.click(1200, 400); // the scrim
      }
      await page.waitForTimeout(100);
      const closed2 = await page.evaluate(() => document.getElementById('site-menu').hidden && getComputedStyle(document.documentElement).overflow !== 'hidden');
      // Phone: On this page opens its list.
      let otpOpen = 'n/a';
      if (width === 390 && info.otp) {
        otpOpen = await page.evaluate(() => {
          document.querySelector('.otp-button').click();
          const l = document.querySelector('.otp-list');
          const ok = l.getClientRects().length > 0;
          document.querySelector('.otp-button').click();
          return ok ? 'ok' : 'FAIL';
        });
      }
      if (path === '3x3/bld/corner-cycles.html') {
        await page.screenshot({ path: SHOTS + `corner-cycles-${width}.png` });
      }
      if (path === '3x3/beginners/index.html') {
        await page.evaluate(() => scrollTo(0, 2600));
        await page.waitForTimeout(200);
        await page.screenshot({ path: SHOTS + `beginners-scrolled-${width}.png` });
      }
      const line = { width, path, ...info, menuOpen: menu.open, locked: menu.locked, current: menu.current.join('/'), escClosed, closed2, focusInside, accordion, otpOpen, errors: errors.length };
      rows.push(line);
      const bad = [];
      if (errors.length) bad.push(`errors: ${errors.join(' | ')}`);
      if (info.overflow > 0) bad.push(`overflow ${info.overflow}px`);
      if (info.oldBars) bad.push('old nav bars present');
      if (MULTI.has(path) !== info.row) bad.push(`section row ${info.row}`);
      if (!menu.open || !menu.locked || !escClosed || !closed2 || !focusInside) bad.push(`menu ${JSON.stringify({ menu, escClosed, closed2, focusInside })}`);
      if (path !== 'index.html' && !menu.current.length) bad.push('no current page in menu');
      if (accordion === 'FAIL' || otpOpen === 'FAIL') bad.push(`accordion ${accordion} otp ${otpOpen}`);
      if (bad.length) problems.push(`${width} ${path}: ${bad.join('; ')}`);
      await page.close();
    }
    // 8355 switch and redirects
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(BASE + '3x3/bld/corner-8355.html');
    await page.evaluate(() => { try { localStorage.removeItem('cubing-helper:corner-8355'); } catch {} });
    await page.goto(BASE + '3x3/bld/corner-8355.html');
    await page.waitForTimeout(500);
    const before = await page.evaluate(() => [document.querySelector('#count-table').innerText, document.querySelector('#pair-table tbody').innerText.slice(0, 200), document.querySelectorAll('#place-cards .case-card').length]);
    await page.click('[data-setups="lb"]');
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => [document.querySelector('#count-table').innerText, document.querySelector('#pair-table tbody').innerText.slice(0, 200), document.querySelectorAll('#place-cards .case-card').length, location.search, localStorage.getItem('cubing-helper:corner-8355'), document.querySelector('.subtitle:not([hidden])').textContent.trim().slice(0, 30)]);
    if (width === 390) await page.screenshot({ path: SHOTS + 'after-8355-any-face-390.png' });
    await page.reload();
    await page.waitForTimeout(400);
    const kept = await page.evaluate(() => document.querySelector('[data-setups="lb"]').getAttribute('aria-pressed'));
    rows.push({ width, switch: { changed: before[0] !== after[0] && before[1] !== after[1], placeCards: [before[2], after[2]], search: after[3], stored: after[4], subtitle: after[5], keptAfterReload: kept } });
    if (!(before[0] !== after[0] && before[1] !== after[1]) || after[3] !== '?setups=lb' || kept !== 'true' || before[2] !== 12 || after[2] !== 12) problems.push(`${width} 8355 switch: ${JSON.stringify({ before, after, kept })}`);
    // back to R U F D, then the old L/B page redirects to the L/B mode with its hash
    await page.click('[data-setups="rufd"]');
    for (const [from, want] of [
      ['3x3/bld/corner-8355-lb.html#list', '3x3/bld/corner-8355.html?setups=lb#list'],
      ['3x3/bld/index.html#edge-B', '3x3/bld/m2.html#edge-B'],
      ['3x3/bld/index.html#bld-parity', '3x3/bld/m2.html#bld-parity'],
      ['3x3/bld/index.html#corner-M', '3x3/bld/old-pochmann.html#corner-M'],
      ['3x3/bld/index.html#bld-swap', '3x3/bld/old-pochmann.html#bld-swap'],
      ['3x3/bld/index.html#letters', '3x3/bld/index.html#letters'],
    ]) {
      await page.goto(BASE + from);
      await page.waitForTimeout(500);
      const at = page.url().replace(BASE, '');
      const lb = await page.evaluate(() => document.querySelector('[data-setups="lb"]')?.getAttribute('aria-pressed') ?? '-');
      rows.push({ width, redirect: from, at, lb });
      if (at !== want) problems.push(`${width} redirect ${from} -> ${at} (want ${want})`);
    }
    if (errs.length) problems.push(`${width} switch/redirect errors: ${errs.join(' | ')}`);
    await ctx.close();
  }
  await browser.close();
  for (const r of rows) console.log(JSON.stringify(r));
  console.log(problems.length ? `PROBLEMS:\n${problems.join('\n')}` : 'NO PROBLEMS');
})();
