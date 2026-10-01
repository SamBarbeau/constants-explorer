# Constants

Six lightweight, interactive experiments about φ, π, e, √2, τ, and γ. Each includes a diagram, numeric readout, explanation, and something to try.

Plain HTML/CSS/JS. `app.js` contains the experiments and canvas drawing helpers; `styles.css` preserves the personal site's visual style. There are no runtime dependencies, requests, or build tools. Drawings update on interaction or resize. The explicit Play button runs a bounded, ten-second animation; it stops when the tab is hidden or the experiment changes. Harmonic sums are precomputed once up to 10,000 terms.

Published through Cloudflare Pages at `constants-explorer.pages.dev`, proxied by the personal site's Worker at `https://sambarbeau.com/constants/`. Assets must stay relative to support both entry points. Select a constant with a hash, e.g. `/constants/#tau`.

Preview standalone with `python3 -m http.server 8001`, or use the sibling personal site's `scripts/preview.mjs` to test the public prefix. Deploy via the existing main-branch integration.
