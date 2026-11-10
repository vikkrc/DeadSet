# Dead Set — Gothic Press (visual direction v2)

An archival murder-mystery design system, borrowing the *language* of nineteenth-century printed frames, blackletter display typography and two-colour crime notices — without importing illustrative clip art or a casino/astrology identity.

## The visual thesis

**A forbidden edition of a murder mystery.** Dead Set feels printed, collected, redacted and passed from hand to hand. The homepage is an invitation; a revealed role is an evidence plate; the Gazette is a public notice; a death verdict is an aggressive vermilion print.

## Hierarchy of influences

- **Typography:** existing Instrument Serif / Instrument Sans / JetBrains Mono remain the backbone for interaction, body copy, time and controls. Grenze Gotisch is a *display accent* on the homepage masthead only. Never use dense blackletter for small UI, voting, or game instructions.
- **Colour:** soot and bone as defaults, a flat vivid vermilion for danger, accusation and decisive actions. Do not turn every surface red. Metallic gold removed.
- **Graphic system:** cut-arch emblem, slash/cancellation mark, black print borders, slim rules, card-back engraved geometry, parchment stock. Avoid all-seeing-eye or mystical geometry as the brand's central logo.
- **Texture:** a light inline SVG noise filter and CSS gradients. No raster illustration, stock imagery or photorealistic candles / velvet / wax.
- **Motion:** events own motion. The idle interface should be still; respect reduced-motion preferences.

## Original assets
- `public/gothic-sigil.svg` — cut arch and red strike; used with the wordmark.
- `public/favicon.svg` — companion square icon.
- `public/gothic-cardback.svg` — symmetrical engraved card back.
- `public/gothic-frame.svg` — vector engraved card/paper corners.
- `public/gothic-rule.svg` — repeatable printer's ornament.
- `public/gothic-press.css` — CSS skin, loaded *after* the original `styles.css`.

The previous `black-ledger.css` remains in the branch for reference, but is **not loaded**. This pass starts from the original site typography and layout rather than layering another theme over the prior redesign.

## Experience map
- **Home:** seven seats around a graphic circular murder table; one is marked red. Editorial title and a dark invitation plate with one emphatic action.
- **Join:** printed invitation; a letter, not a floating dashboard.
- **Lobby:** modes as three distinct editions, clear selected state and unchanged setup behavior.
- **Role reveal:** repeatable front/back vector plate with original role glyphs. Nothing in the graphic art exposes unrevealed secret information.
- **Classic game:** etched ring and player tokens, restrained accusation indicators, one dominant mobile action.
- **Missions:** same typography and materials, minimal mission progress indicators.
- **Exorcism:** preserve the existing shader-driven crystal ball; strip excessive pill treatments from surrounding UI.
- **TV board:** public diagram alongside a parchment Gazette.
- **Verdict:** sudden two-colour vermilion print moment, not an ongoing animated ornamental spectacle.

## Engineering and constraints

The design changes do not alter server rules, websocket contracts, timers, roles, phase logic or moderation. The role flip and player table use existing renderers. The only application-markup change is the small logo SVG in the existing `wordmark()` function.

Test before merging: desktop and Safari phone layouts, portrait/landscape, seven languages, 3-25 player ring states, Exorcism ball, stage timers, reduced motion and font fallback. Treat static design previews as illustrative, not proof of gameplay correctness.

This branch is deliberately experimental and must not be merged into the source branch without visual and interaction review.
