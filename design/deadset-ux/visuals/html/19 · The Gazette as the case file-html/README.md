# 19 · The Gazette as the case file — design reference

This is a design mockup created in a visual design tool, exported as a
standalone page. Treat it as a REFERENCE MOCKUP, not production code:
the markup and inline styles carry the design's precise values — colors,
font sizes, spacing, radii, shadows, layout — which an implementation
should replicate faithfully in its own components and styling system
rather than copy wholesale.

## Contents

- `Gazette.dc.html` — the artboard (a Design Component: an `<x-dc>`
  template + a small logic class). The values to replicate live in its
  inline `style="…"` attributes and the `<helmet><style>` block.
- `ds.css` — referenced resource
- `workshop.css` — referenced resource
- `art/death.svg` — referenced resource
- `art/guardian.svg` — referenced resource
- `art/maskedvote.svg` — referenced resource
- `art/moon.svg` — referenced resource
- `art/p_key.svg` — referenced resource
- `art/reject.svg` — referenced resource
- `art/s_against.svg` — referenced resource
- `art/s_popular.svg` — referenced resource
- `art/whispers.svg` — referenced resource
- `ico/death.svg` — referenced resource
- `ico/moon.svg` — referenced resource
- `support.js`, `vendor/react*.js` — the runtime that renders the
  component in a browser; not part of the design.

## Viewing

Serve the folder (e.g. `python3 -m http.server`) and open `Gazette.dc.html`;
some browsers block the scripts over file://.
