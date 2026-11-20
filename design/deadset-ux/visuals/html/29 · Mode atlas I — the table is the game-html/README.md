# 29 · Mode atlas I — the table is the game — design reference

This is a design mockup created in a visual design tool, exported as a
standalone page. Treat it as a REFERENCE MOCKUP, not production code:
the markup and inline styles carry the design's precise values — colors,
font sizes, spacing, radii, shadows, layout — which an implementation
should replicate faithfully in its own components and styling system
rather than copy wholesale.

## Contents

- `AtlasA.dc.html` — the artboard (a Design Component: an `<x-dc>`
  template + a small logic class). The values to replicate live in its
  inline `style="…"` attributes and the `<helmet><style>` block.
- `ds.css` — referenced resource
- `workshop.css` — referenced resource
- `art/coin.svg` — referenced resource
- `art/death.svg` — referenced resource
- `art/guardian.svg` — referenced resource
- `art/lantern.svg` — referenced resource
- `art/moon.svg` — referenced resource
- `art/veiled.svg` — referenced resource
- `ico/death.svg` — referenced resource
- `ico/moon.svg` — referenced resource
- `support.js`, `vendor/react*.js` — the runtime that renders the
  component in a browser; not part of the design.

## Viewing

Serve the folder (e.g. `python3 -m http.server`) and open `AtlasA.dc.html`;
some browsers block the scripts over file://.
