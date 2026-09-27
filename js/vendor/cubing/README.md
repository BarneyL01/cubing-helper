# Vendored: cubing.js `twisty` (3D player)

Not our code. This is a self-hosted copy of the `<twisty-player>` web
component from [cubing.js](https://github.com/cubing/cubing.js), so the
site's 3D view doesn't depend on `cdn.cubing.net`.

| | |
|---|---|
| Package | `cubing` **v0.63.7** (npm), entry `cubing/twisty` |
| Licence | cubing.js: `MPL-2.0 OR GPL-3.0-or-later` — used here under **MPL-2.0** |
| Also bundled | three.js v0.170.0, MIT — see `LICENSE-three.txt` |
| Source | https://github.com/cubing/cubing.js (unmodified) |

MPL-2.0 notice: This Source Code Form is subject to the terms of the Mozilla
Public License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.

These files are **unmodified** — only bundled, so the browser can load them
without a package manager. If they're ever edited, MPL-2.0 requires the
edited files' source to be made available under the same licence.

## How it was built (to update it)

```sh
npm install cubing@<version> esbuild
echo 'export * from "cubing/twisty";' > entry.js
npx esbuild entry.js --bundle --format=esm --splitting --minify \
  --target=es2020 --outdir=out --entry-names=twisty \
  --chunk-names=chunks/[name]-[hash]
# then replace twisty.js + chunks/ here with out/twisty.js + out/chunks/
```
