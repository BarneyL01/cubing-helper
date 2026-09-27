// Switches every case card between the built-in pictures (default) and the
// cubing.js 3D player. The player is self-hosted in js/vendor/cubing/ (see
// its README for version and licence); it's ~1 MB, so it's only loaded once
// someone picks 3D.
const STORAGE_KEY = 'cubing-helper:view';
const TWISTY_URL = new URL('./vendor/cubing/twisty.js', import.meta.url).href;

let twistyLoad = null;

function readMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '3d' ? '3d' : 'image';
  } catch {
    return 'image';
  }
}

function saveMode(mode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage unavailable (private window etc.) — the choice just won't persist.
  }
}

export function mountViewToggle(slot) {
  if (!slot) return;
  slot.innerHTML = `
    <span class="view-toggle-label">Show:</span>
    <div class="view-toggle-buttons" role="group" aria-label="Case view">
      <button type="button" data-mode="image">Pictures</button>
      <button type="button" data-mode="3d">3D</button>
    </div>
    <span class="view-toggle-status" role="status"></span>`;
  const buttons = slot.querySelectorAll('button');
  const status = slot.querySelector('.view-toggle-status');

  function apply(mode) {
    document.documentElement.dataset.view = mode;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    status.textContent = '';
    if (mode !== '3d' || twistyLoad) return;
    status.textContent = 'Loading 3D…';
    twistyLoad = import(TWISTY_URL)
      .then(() => {
        status.textContent = '';
      })
      .catch(() => {
        twistyLoad = null;
        apply('image');
        status.textContent = "3D view couldn't load — showing pictures.";
      });
  }

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      saveMode(b.dataset.mode);
      apply(b.dataset.mode);
    }),
  );
  apply(readMode());
}
