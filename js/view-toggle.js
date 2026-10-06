// Switches every case card between the built-in pictures (default) and the
// cubing.js 3D player. The player is self-hosted in js/vendor/cubing/ (see
// its README for version and licence); it's ~1 MB, so it's only loaded once
// someone picks 3D. Also hosts the "Keep screen on" switch (Screen Wake Lock),
// which is handy with a cube in both hands.
const STORAGE_KEY = 'cubing-helper:view';
const AWAKE_KEY = 'cubing-helper:keep-awake';
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

// "Keep screen on": off by default; the last choice is remembered. The lock is
// released by the browser whenever the tab is hidden, so it is asked for again
// when the tab comes back. Where the Wake Lock API is missing the switch is
// not shown, and if the browser refuses the switch just shows off.
function mountAwakeToggle(slot) {
  if (!('wakeLock' in navigator)) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'awake-toggle';
  button.textContent = 'Keep screen on';
  slot.appendChild(button);

  let want = false;
  try {
    want = localStorage.getItem(AWAKE_KEY) === 'on';
  } catch {
    // Storage unavailable — starts off.
  }
  let lock = null;

  const show = () => button.setAttribute('aria-pressed', String(!!lock));
  async function acquire() {
    try {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => {
        lock = null;
        show();
      });
    } catch {
      lock = null; // unsupported here or denied: leave the switch off
    }
    show();
  }
  async function release() {
    try {
      await lock?.release();
    } catch {
      // Already released.
    }
    lock = null;
    show();
  }

  button.addEventListener('click', () => {
    want = !want;
    try {
      localStorage.setItem(AWAKE_KEY, want ? 'on' : 'off');
    } catch {
      // The choice just won't persist.
    }
    if (want) acquire();
    else release();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && want && !lock) acquire();
  });
  show();
  if (want) acquire();
}

// options.view: false leaves out the Pictures / 3D switch (Megaminx has no 3D).
export function mountViewToggle(slot, options = {}) {
  if (!slot) return;
  const withView = options.view !== false;
  slot.innerHTML = withView
    ? `
    <span class="view-toggle-label">Show:</span>
    <div class="view-toggle-buttons" role="group" aria-label="Case view">
      <button type="button" data-mode="image">Pictures</button>
      <button type="button" data-mode="3d">3D</button>
    </div>
    <span class="view-toggle-status" role="status"></span>`
    : '';
  mountAwakeToggle(slot);
  if (!withView) return;
  const buttons = slot.querySelectorAll('.view-toggle-buttons button');
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
