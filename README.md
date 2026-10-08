# Constants

Six lightweight, interactive experiments about φ, π, e, √2, τ, and γ. Each includes a diagram, numeric readout, explanation, and something to try.

Plain HTML/CSS/JS. `app.js` contains the experiments and canvas drawing helpers; `styles.css` preserves the personal site's visual style. There are no runtime dependencies, requests, or build tools. Drawings update on interaction or resize. Each experiment has a purposeful eight-second play sequence, with pause/resume. Playback pauses when the tab is hidden and stops when the experiment changes. Harmonic sums are precomputed once up to 10,000 terms.

Published through Cloudflare Pages at `constants-explorer.pages.dev`, proxied by the personal site's Worker at `https://sambarbeau.com/constants/`. Assets must stay relative to support both entry points. Select a constant with a hash, e.g. `/constants/#tau`.

Preview standalone with `python3 -m http.server 8001`, or use the sibling personal site's `scripts/preview.mjs` to test the public prefix. Deploy via the existing main-branch integration.

## Experiments

- φ: place seeds using a fixed turn and square-root outward spacing. Compare golden-angle spirals with 90° and 144° spokes; playback grows from 1 to 1,000 dots.
- π: straighten a circle’s edge without changing its length; measure it in diameters.
- e: collect interest through a year, including the $1 → $1.50 → $2.25 example.
- √2: compare a sheet with a turned half-sheet at the same height.
- τ: connect a rotating point to the sine wave made by its height.
- γ: accumulate the area between the harmonic staircase and 1/x. A moving, vertically magnified window follows the newest six steps up to 10,000; a fixed-scale plot shows the accumulated area approaching its limit. The latest scrap is computed with 1/n − log1p(1/n). This uses H_n − ln(n+1), which approaches the same Euler–Mascheroni constant as H_n − ln(n), since ln(n+1) − ln(n) tends to zero. Reference: https://dlmf.nist.gov/5.2#E3.

Equations are optional disclosures. Contextual feedback explains what changed after an interaction. All diagrams render only on input, resize, or explicit playback. No extra runtime libraries were added.

Browser checks: all six play sequences finish and stop; exact shape presets, compounding balances, wave extrema, and gamma totals checked; pause/resume and reset checked; layout and canvas label bounds checked at 320, 390, and 1100 pixels.
