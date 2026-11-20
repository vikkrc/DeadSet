# 36 · Full tables, mode by mode — what changes past 10 — design reference

This is a design mockup created in a visual design tool, exported as a
standalone page. Treat it as a REFERENCE MOCKUP, not production code:
the markup and inline styles carry the design's precise values — colors,
font sizes, spacing, radii, shadows, layout — which an implementation
should replicate faithfully in its own components and styling system
rather than copy wholesale.

## Contents

- `ScaleModes.dc.html` — the artboard (a Design Component: an `<x-dc>`
  template + a small logic class). The values to replicate live in its
  inline `style="…"` attributes and the `<helmet><style>` block.
- `ds.css` — referenced resource
- `workshop.css` — referenced resource
- `art/coin.svg` — referenced resource
- `art/demon.svg` — referenced resource
- `art/lantern.svg` — referenced resource
- `art/moon.svg` — referenced resource
- `art/undertaker.svg` — referenced resource
- `art/veiled.svg` — referenced resource
- `ico/moon.svg` — referenced resource
- `support.js`, `vendor/react*.js` — the runtime that renders the
  component in a browser; not part of the design.

## Viewing

Serve the folder (e.g. `python3 -m http.server`) and open `ScaleModes.dc.html`;
some browsers block the scripts over file://.
