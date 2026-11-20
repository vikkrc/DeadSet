# 30 · Mode atlas II — an object takes the stage — design reference

This is a design mockup created in a visual design tool, exported as a
standalone page. Treat it as a REFERENCE MOCKUP, not production code:
the markup and inline styles carry the design's precise values — colors,
font sizes, spacing, radii, shadows, layout — which an implementation
should replicate faithfully in its own components and styling system
rather than copy wholesale.

## Contents

- `AtlasB.dc.html` — the artboard (a Design Component: an `<x-dc>`
  template + a small logic class). The values to replicate live in its
  inline `style="…"` attributes and the `<helmet><style>` block.
- `ds.css` — referenced resource
- `workshop.css` — referenced resource
- `art/bell.svg` — referenced resource
- `art/coin.svg` — referenced resource
- `art/companion.svg` — referenced resource
- `art/curse.svg` — referenced resource
- `art/death.svg` — referenced resource
- `art/demon.svg` — referenced resource
- `art/haunted.svg` — referenced resource
- `art/lantern.svg` — referenced resource
- `art/medium.svg` — referenced resource
- `art/mimic.svg` — referenced resource
- `art/p_box.svg` — referenced resource
- `art/p_candle.svg` — referenced resource
- `art/p_cards.svg` — referenced resource
- `art/p_compass.svg` — referenced resource
- `art/p_feather.svg` — referenced resource
- `art/p_key.svg` — referenced resource
- `art/p_letter.svg` — referenced resource
- `art/p_perfume.svg` — referenced resource
- `art/p_photo.svg` — referenced resource
- `art/p_sand.svg` — referenced resource
- `art/p_ticket.svg` — referenced resource
- `art/p_watch.svg` — referenced resource
- `art/reaper.svg` — referenced resource
- `art/s_heart.svg` — referenced resource
- `art/s_self.svg` — referenced resource
- `art/shade.svg` — referenced resource
- `art/smoke.svg` — referenced resource
- `art/undertaker.svg` — referenced resource
- `art/witness.svg` — referenced resource
- `ico/death.svg` — referenced resource
- `ico/s_self.svg` — referenced resource
- `support.js`, `vendor/react*.js` — the runtime that renders the
  component in a browser; not part of the design.

## Viewing

Serve the folder (e.g. `python3 -m http.server`) and open `AtlasB.dc.html`;
some browsers block the scripts over file://.
