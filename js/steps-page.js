// Builds a numbered step-by-step method page: one section per step (goal,
// "how", case cards, previous/next links) and optional extra sections after
// the numbered steps. Used by the Beginner's, 8355, Heise, Marshall and Roux
// pages. Each step section carries data-short (and data-num), which
// js/site-chrome.js uses for its "On this page" list.
//
// A step is { id, title, short, source, goal, how, notes, cases, ... }:
//   intro  – a plain paragraph (used instead of goal/how on extra sections)
//   how    – list of lines; a line is a string or { title, text }
//   notes  – extra callout paragraphs (e.g. clarifications added to a source)
//   cases  – cards for js/render-cases.js
//   extra  – true for sections after the numbered steps (no step number)
//   mark   – the little badge for an extra section (default "+")
//   custom – function(sectionElement) that appends anything else
import { renderCases } from './render-cases.js';
import { mountViewToggle } from './view-toggle.js';

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

const link = (href, cls, text) => {
  const a = el('a', cls, text);
  a.href = href;
  return a;
};

export function mountSteps({ steps, sources }) {
  const root = document.getElementById('steps');

  // "Step 3" for numbered steps, just the title for extras.
  let count = 0;
  const labels = steps.map((s) => (s.extra ? null : ++count));
  const nameOf = (i) => (labels[i] ? `Step ${labels[i]}: ${steps[i].title}` : steps[i].title);

  steps.forEach((step, i) => {
    const section = el('section', 'step');
    section.id = step.id;
    section.dataset.short = step.short || step.title;
    if (labels[i]) section.dataset.num = String(labels[i]);

    const head = el('div', 'step-head');
    head.append(el('span', `step-num${labels[i] ? '' : ' extra'}`, labels[i] ? String(labels[i]) : step.mark || '+'), el('h2', null, step.title));
    if (step.source && sources[step.source]) head.appendChild(el('span', `step-source ${step.source}`, sources[step.source]));
    section.appendChild(head);

    if (step.goal) {
      const goal = el('p', 'step-goal');
      goal.append(el('strong', null, 'Goal: '), step.goal);
      section.appendChild(goal);
    }
    if (step.intro) section.appendChild(el('p', 'step-goal', step.intro));
    if (step.how && step.how.length) {
      const how = el('ol', 'step-how');
      for (const line of step.how) {
        const li = el('li');
        if (typeof line === 'string') li.textContent = line;
        else li.append(el('strong', null, `${line.title} `), line.text);
        how.appendChild(li);
      }
      section.appendChild(how);
    }
    for (const note of step.notes || []) section.appendChild(el('p', 'step-note', note));

    if (step.cases && step.cases.length) {
      const grid = el('div', 'case-grid');
      grid.id = `${step.id}-cases`;
      section.appendChild(grid);
      root.appendChild(section);
      renderCases(grid.id, step.cases);
    } else {
      root.appendChild(section);
    }
    if (step.custom) step.custom(section);

    const foot = el('nav', 'step-foot');
    foot.setAttribute('aria-label', 'Next step');
    foot.appendChild(i > 0 ? link(`#${steps[i - 1].id}`, 'step-prev', `← ${nameOf(i - 1)}`) : el('span'));
    foot.appendChild(link('#top', 'step-up', 'All steps ↑'));
    if (i < steps.length - 1) foot.appendChild(link(`#${steps[i + 1].id}`, 'step-next', `${nameOf(i + 1)} →`));
    else foot.appendChild(labels[i] ? el('span', 'step-done', 'Solved ✓') : el('span'));
    section.appendChild(foot);
  });

  mountViewToggle(document.getElementById('view-toggle'));
}
