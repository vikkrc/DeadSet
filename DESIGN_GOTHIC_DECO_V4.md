# Dead Set — Gothic / Art Deco gameplay visual system (v4)

Branch: \`design/gothic-deco-gameplay-v4\`
Parent: \`design/redacted-print-v3\`

## Identity
Use the supplied references as an editorial design vocabulary, not literal layouts or licensed source assets. Dark twentieth-century gothic-meets-Art-Deco, printing-press grain, sharp vermilion ink, engraved architecture, chain geometry, fine star rays, pointed arches, symmetry and claustrophobic mystery.

**Neither modern SaaS nor luxury casino.** Large typography, genuinely hand-drawn vector primitives, and occasional shock-red printing. The most intricate borders belong to ceremonies, role revelations, the table diagram and the Gazette. Small controls stay legible and large enough to touch.

## Implementation
The real game (Classic / Missions / Exorcism) still uses the same source code, actions, and server contracts:
- \`public/styles.css\` — original app stylesheet
- \`public/redacted-press.css\` — only experimental overlay, extended in this branch
- \`public/deco-frame-bone.svg\` — modular bone ornament, designed as a nine-slice border
- \`public/deco-frame-red.svg\` — equivalent danger/red edition
- \`public/deco-frame-ink.svg\` — dark engraving on light paper
- \`public/deco-ring.svg\` — original concentric rings, fine engraved ticks and stars
- \`public/deco-role-frame.svg\` — original gothic-arched role card plate
- \`public/deco-frieze.svg\` — original repeating architectural arcade
- \`public/deco-masthead.svg\` — original stepped header and radiant arch
- \`public/press-witness.svg\`, \`press-cardback.svg\`, \`press-rule.svg\` — existing original Redacted Press assets

The visual system is CSS-driven and keeps the existing role glyphs and avatar vectors. No generated character illustrations or proprietary fonts are embedded. Instrument Serif/Sans/JetBrains Mono stay the primary readable UI typefaces. The existing, freely available gothic headline webfont is used only for the wordmark/large display.

### Coverage
- Home: press poster, ornate but restrained master frame and masthead
- Game selection: three ornate printed chapter cards with strong active state
- Lobby: QR/invitation, player table, deck, switches and setup panels
- Role reveal: articulated card front/back and an identity glyph that can later be replaced by role art
- Day/discussion/vote: engraved table, selected target highlight, accusations, reports and sticky action dock
- Night: same table with colder palette and secret action hierarchy, Dreams and confirmations
- Public TV: enlarged circle, printed public Gazette and ornamental plaques
- Missions and Exorcism: common typography and material treatment over existing mode-specific interfaces
- Sheet dialogs / moments / recap: same frame family, restrained effects, red verdict moment

### No private data leaks
Only cosmetic CSS and SVG files were changed from Redacted Press. The public board continues receiving the server-provided public view; the cosmetic design does not reveal roles or make sound or motion based on privately-held information. The \`public/deco-preview.html\` fixture uses fabricated sample labels and does not connect to live rooms.

### Preview and tests
Run \`npm start\`, then visit \`http://localhost:3000/deco-preview.html\`. Choose Role reveal, Night, Voting or TV board in the demo toolbar. These are **static style fixtures**, not a simulated rules engine or screenshots of actual gameplay.

Run \`node scripts/check-deco-design.mjs\` for asset-wiring/action-hook sanity checks, then \`npm test\` for the real game engine. Both commands require a local checkout; they have not been executed here, because this environment could fetch repository files through the connector but could not clone the full repository for a local test run.

Before merging: manually verify 320/375/390 px mobile widths, 7 locales with long strings, 5–25 player tables, role card privacy, actual Exorcism orb/shaders, Mines/Missions flows, iOS Safari reduced-motion and gestures, and 16:9 TV resolutions.

### Future character art guidance
Keep the outer role-card geometry unchanged. Replace the generic center glyph only with appropriately aligned original illustrated artwork (two- or three-colour halftone woodcut engraving). Build character artwork as independent assets; don't rasterize the entire role card or UI border. Use SVG for decorative corner plate and exported art inside a clipped \`art\` slot, so responsive text/labels remain actual DOM content.

### Art-direction decisions
- High ornament density on large section boundaries and special moments.
- Low density on interactive form controls and long-text areas.
- Never change server state as a styling effect.
- Avoid gold, shiny buttons, glass, fake holography, generic eye sigils and excessive motion.
- Preserve focus states, native form semantics and minimum 44px touch targets.
