# Dead Set — "The Codex" redesign guide

A brief for the agent restyling `vikkrc/DeadSet` (branch `claude/serene-franklin-v9ujky`). This folder is self-contained: you do not need access to the design canvas.

```
DESIGN-GUIDE.md     this file
codex.css           reference stylesheet the mockups were built with (tokens + every component)
code/emblems.js     104 emblems + emblem(id, { rays }) — ready to import
code/avatar.js      drop-in replacement for public/avatar.js (same exports, same part counts)
code/backdrops.js   15 WHERE scenes as SVG strings, in SCENARIO.WHERE order
art/*.svg           every emblem as card art (inside its ray ring), ink on transparent
ico/*.svg           every emblem as a bare icon, bone on ink
bg/NN.svg           the 15 backdrops (NN-sm = heavier line for small sizes, NN-ink = for vellum cards)
boards/*.jpg        26 rendered layouts (phones at 2x, TV and sheets at 1x)
boards/*.html       the same layouts as plain HTML (open locally; they link ../codex.css)
```

Treat `codex.css` as a reference to port from, not a file to drop in. The mockups are static HTML; the app is a DOM-morphing vanilla-JS client with its own class names, states and animations. Port the look onto the existing selectors.

## 1. Ground rules

1. **Presentation only.** Touch `public/styles.css`, `public/index.html` (fonts, theme-color), `public/icons.js`, `public/avatar.js`, `public/gazette.js`, `public/board.js`, `public/backdrops.js` markup where needed. Do not change `engine/`, `server/`, view shapes, phase logic, i18n keys or tests. `npm test` must stay green.
2. **No build step, no dependencies.** Ornament and texture are CSS and inline SVG. The only network asset is the Google Fonts stylesheet.
3. **Secrets must not leak through styling.** This overrides every aesthetic choice below.
   - On a phone, every private card has the same face brightness. All role cards are vellum, Death included (`.card.rubric`: red ink, same paper). The black Death card (`.card.noir`) is for public surfaces only: TV lobby deck, end-of-match reveal, the guide.
   - Missions: Succeed and Sabotage share one vellum face on phones. The black Sabotage card appears only in the public reveal.
   - Exorcism: the ball glows the same colour for Living and Demon.
   - Night screens stay still: no role-specific colour, glow, animation or sound.
4. **Seven languages.** Display type must render hu, sk, cs, de, fr, es. Never hardcode English into ornaments; titles get longer in German and Hungarian, so let blackletter titles wrap to two lines.
5. **Keep** 44px+ touch targets, `prefers-reduced-motion`, focus outlines, the `[template, params]` rendering, and text contrast of 4.5:1 or better (3:1 at 24px+).

## 2. The idea

The game is an illuminated grimoire lying open on a séance table.

- **Ink ground.** The room is near-black with press grain and a vignette.
- **Vellum is anything a player holds:** cards, the invitation, the Gazette, mission chapters, private reports. Aged paper, sepia ink, rubric-red initials.
- **Gilt is line-work:** frames, rings, dividers, timers. Thin, tarnished, never a fill for large areas.
- **Wax is commitment:** anything pressed and held (sealing a vote, breaking the invitation, Understood) is oxblood wax.
- **Blackletter speaks for the game, Garamond for the players.** Phase names, card titles and verdicts are blackletter. Everything a person reads at length or types is Garamond.

Mood references the user supplied: castlecore bitmap ornament, 19th-century frame and border catalogues, medieval engravings with line-over-silhouette, failed ink-press and photocopy grunge, ornamental book covers, blackletter display type. The ornaments and illustrations here are original drawings in that spirit; do not copy assets from those packs into the repo unless the user confirms a licence.

## 3. Tokens

Replace the `:root` block. Old names on the left so you can migrate by search.

| Old | New | Day | Role |
|---|---|---|---|
| `--soot` | `--ink` | `#0c0a09` | page ground |
| `--soot-2` | `--ink-2` | `#15110e` | raised ground |
| `--soot-3` | `--ink-3` | `#221b15` | wells, gradients |
| `--line`, `--line-2` | `--iron`, `--gilt-2` | `#3b3027`, `#8a6d35` | quiet rule, active rule |
| `--bone` | `--bone` | `#e8dcc0` | text |
| `--bone-2` | `--bone-2` | `#c2b496` | secondary text |
| `--ash` | `--ash` | `#93866e` | labels (passes 4.5:1 on ink) |
| new | `--gilt`, `--gilt-hi` | `#c9a35a`, `#ecd28f` | ornament, live state |
| `--blood` | `--blood` | `#9c1c22` | fills |
| `--blood-ink` | `--blood-ink` | `#e45d50` | red text on ink |
| new | `--wax` | `#6f1016` | seal shadow |
| new | `--vellum`, `--vellum-2` | `#dccba4`, `#c6b185` | paper |
| new | `--sepia`, `--sepia-2` | `#1d1510`, `#5a4632` | ink on paper, secondary |
| new | `--rubric` | `#8e1b1f` | red ink on paper |

Themes are token overrides on `body`, exactly as `body[data-time='night']` works today. Add the others the same way.

| Theme | When | Key values |
|---|---|---|
| Night | `data-time='night'` | ink `#06080d`, bone `#dbe1ec`, gilt becomes silver `#b9c4d8` / `#5d6a82`, blue glow |
| Blood Moon | Blood Moon nights | ink `#0d0607`, gilt becomes ember `#e08a78` / `#8c3a35`, red glow |
| Mist | Exorcism mode | ink `#09070f`, gilt becomes amethyst `#c3b3ee` / `#6a5b96`; ball `--orb` violet `#8f7bd0`, gold `#d9a441` in discussion, red `#d23a35` in the vote |
| Dead | `body.is-dead` | keep the existing cold fade; desaturate gilt to ash |

Vellum surfaces do not change with the theme. Paper stays paper at night.

## 4. Type

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Grenze+Gotisch:wght@400;600;800&family=UnifrakturCook:wght@700&display=swap">
```

| Var | Face | Use | Rules |
|---|---|---|---|
| `--black` | Grenze Gotisch 600 / 800 | phase names, card titles, verdicts, Gazette masthead and headlines, moment titles | 20px minimum. Mixed case only, never all caps. Has Latin Extended, so it is safe for translated strings. |
| `--text` | EB Garamond 400 / 500 / 600 + italic | body, descriptions, chat, inputs, chips, reports | Replaces both Instrument faces. Italic carries flavour lines and hints. Body 16–18px on phones. |
| label | EB Garamond 600 caps, `letter-spacing:.24em`, 11px | `.rule`, `.kicker`, buttons, seat names, table headers | Replaces the sans caps labels one for one. |
| `--bit` | EB Garamond 500, `font-variant-numeric: tabular-nums lining-nums` | countdowns, counts, vote totals, room codes, Roman numerals | Every number in the game is plain Garamond. Tabular figures stop a running timer from jittering. No bitmap or blackletter numerals anywhere. |
| `--mark` | UnifrakturCook 700 | the "Dead Set" wordmark and the wax monogram | Latin only. Never for translated text. |

Never set player names, chat or rules paragraphs in blackletter. Player names in seats and lists are Garamond caps.

Display type takes the **failed-press ghost**: `text-shadow:.035em .025em 0 rgba(156,28,34,.7)` on ink, a fainter one on vellum (`.press`). Use it on H1-level titles only.

## 5. Ornament and texture kit

All of these are in `codex.css`.

| Piece | Class | Notes |
|---|---|---|
| Press grain | `.ds::after` | SVG `feTurbulence` at `overlay`, 38% opacity, over everything. Replaces the current `body::before` noise. |
| Vellum | `.vellum` | paper colour + low-frequency turbulence stains + inner burn. Keep it quiet: the stains should be barely there (alpha matrix `.75 -.3`), with a faint edge burn. Text contrast comes first. Stretch the stain layer (`background-size:100% 100%`); tiling shows seams. |
| Ornate frame | `.fr` (gilt), `.fr.k` (ink on vellum), `.fr.s` (silver), `.fr.b` (blood); `.lg` / `.sm` | One 96px SVG as a nine-slice `border-image`: bitten corners, corner jewel, twin curls. Needs 22px+ inner padding. Use on panels, sheets, moments, the Gazette. One frame per screen region; do not nest frames. |
| Divider | `.orn` + `.loz` | hairline, three lozenges, hairline. Replaces `.rule::after` lines; a label can sit in the middle. |
| Lancet arch | `var(--arch)` | `clip-path` polygon. Card art windows, the home hero, Gazette portraits. Stroke it by stacking two clipped layers 1.5px apart. |
| Halftone | in `.card .art::before` | 5px dot grid fading upward behind engravings. |
| Rays | `repeating-conic-gradient` | behind card art, table disc, verdict medallion. |
| Stamp | `.stamp` | double-ruled blackletter, rotated 7 to 9 degrees. SENTENCED, SPARED, Extra, mission results. On vellum use `mix-blend-mode:multiply`. |
| Wax seal | `.seal-wax` | irregular blob radius + radial gradient + monogram. Invitation seal, edict cards, and the visual language of hold-to-confirm. |

Restraint: one blackletter title, one frame and one divider per view is usually enough. Dense ornament belongs on cards and the Gazette, not on controls.

## 6. Component map

Existing selector in `public/styles.css` on the left.

| Existing | Becomes | Reference |
|---|---|---|
| `.btn` | engraved plaque: 1px gilt border, inner hairline (`outline-offset:-5px`), lozenge tips, Garamond caps | Main |
| `.btn-solid` | `.btn.bone`: vellum fill, sepia text | P1, P5 |
| `.btn-blood`, `.hold` | `.btn.seal`: wax gradient. While held, fill sweeps left to right in a darker wax and the lozenge tips close inward; on release it "sets" with a short scale pulse | P3, P4, P7 |
| `.btn-ghost` | text-only caps, no tips | P5 |
| `.seg` | framed pair, selected half is vellum | P1 |
| `.input`, `.field`, `.sign` | underline only, large Garamond italic, as if signing a register | P1 |
| `.chip`, `.ev` | square-cornered slip, italic; red and gilt variants; on vellum they invert to sepia outlines | P4, T2 |
| `.rule`, `.kicker` | `.lab`, optionally inside `.orn` | all |
| `.panel`, `.banner`, `.report` | `.fr` on ink; private reports ("Only you know", "Your night") become `.vellum.fr.k` slips with a drop cap | Main |
| `.ring`, `.ring-wrap`, `.ring-fuse` | the astrolabe table: tick ring and timer arc (`--t`) drawn 16px **outside** the seat area so seat names never touch them; orbit line; inner disc with rays | P4, T2 |
| `.ring-orb`, `.sky-orb` | `.rider`: the sun or moon as a glowing bead riding the timer arc | T2, T3 |
| `.chair`, `.tok`, `.tok-disc` | struck medallion: double ring + dotted bead ring; portrait inside as a cameo; name on a small ink ribbon | Main (six states) |
| `.accused` | blood medallion with red bead ring and glow | P4, T2 |
| dead seats | dashed ring, greyed portrait, one centred symmetric red X (two 45° strokes through the exact centre, inset 16%), name struck through | P4, T3 |
| `.b-threads`, `.hunch-arrows` | 2px blood-ink curves between medallions | T2 |
| `.flipcard`, `.face`, `.role-mini` | tarot card (section 7). `.role-mini` is the same card at thumbnail size | P3, Arcana |
| `.dream`, `.dcard`, `.swap-card` | night-suit card (silver on indigo) + silver frame panel | P5 |
| `.rule-card`, `.cer-rule` | edict card: vellum, giant rubric initial, wax seal | Arcana |
| `.plaque` | nailed edict strip with a wax dot; `.live` glows gilt while the rule shapes the phase | P4, T2 |
| `.cer-face`, story cards | three-card spread, typographic: red blackletter WHO / WHERE / WHY, italic answer | Arcana, T1 |
| `.moment`, `.m-title`, `.m-sub` | centred lab + blackletter title + divider on a tinted glow; tap-to-skip bar at the foot | P6 |
| `.bars`, `.b-votes`, `.vcount` | votes as lozenge beads on a line, total in Garamond figures; winner row in red | P6, T3 |
| `.verdict-stamp`, `.reveal-stamp`, `.result-stamp` | `.stamp` | P6 |
| `.gazette`, `.paper`, `.edition`, `.ledger` | broadsheet on vellum: blackletter masthead, double rule, Roman numeral edition markers, drop cap, dotted ledger leaders, arch-framed portrait, red "Extra" stamp | T2, T4 |
| `.letter`, `.envelope`, `.wax`, `.wax-btn`, `.wax-ring`, `.seal-shards` | vellum envelope with flap lines, ink frame, wax seal with a conic hold-progress ring; keep the shard break | P2 |
| `.code-tiles`, `.code-in` | plain Garamond 600 capitals in gilt-ruled tiles (legibility over style) | T1 |
| `.qr-frame`, `.qr-big` | QR printed in sepia on vellum inside `.fr.k`. Keep the quiet zone and full contrast. The pattern in the mockup is a placeholder | T1 |
| `.lobby-deck`, `.deck-card`, `.b-deck` | row of small real cards; secret seats are card backs with "?" | T1 |
| `.mtrack`, `.mscore` | five roundels: gilt = succeeded, blood = failed, glowing ring = current, dashed = to come; Roman numerals | P7, T5 |
| `.mc-banner`, `.mi-rule` | chapter slip on vellum with ink frame | P7, T5 |
| `.mplay-card`, `.mcard`, `.mrc` | tarot cards: chalice = Succeed, dagger = Sabotage | P7, T5 |
| `.xball`, `.xb-runes`, `.xb-stand` | keep the WebGL mist. Add a ring of spaced Latin capitals on a text path, a dotted inner ring, a gilt stand. Password in blackletter with a glow | P8, T6 |
| `.xo-pill`, `.xb-word` | "What was said" as a ruled list: medallion + name label + word in blackletter | T6 |
| `.topbar`, `.wordmark` | UnifrakturCook wordmark, round icon buttons with an iron ring | P4 |
| `.dock`, `.sheet` | dock stays flat; sheets get `.fr` and a blackletter title | — |
| `.avatar` (avatar.js) | replace with `code/avatar.js` (section 12) | Cameos, P9 |
| `icons.js` glyphs | role, Dream, mission and object glyphs come from `code/emblems.js` (section 11); keep the small interface glyphs (menu, close, check, arrows…) at stroke 1.5 | Icons |
| `backdrops.js` | redraw from `code/backdrops.js` (section 13) | Backdrops, T2 |

## 7. The Arcana

One deck with one back. See `boards/Arcana.jpg`.

**Anatomy** (`.card`, sized with `width` + `font-size`; every inner size is in em): ink nine-slice frame inset 0.42em; number in rubric Garamond caps at the top; lancet-arched art window with halftone; title in blackletter; one italic line; faction in tiny caps. Ratio 11:18.

| Suit | Class | Face | Used for |
|---|---|---|---|
| Major arcana | `.card` | vellum, sepia ink | every role |
| Death on a phone | `.card.rubric` | same vellum, red title and edge | the Death player's own card |
| Death in public | `.card.noir` | black, gilt frame, inverted art | TV, end reveal, guide |
| Night suit | `.card.dream` | indigo, silver frame, inverted art | Dreams |
| Edict | `.card.edict` | vellum, giant red initial, wax seal | Rule cards |
| Spread | `.card` + typographic body | red WHO / WHERE / WHY | scenario |
| Back | `.card.back` | oxblood-black, gilt lattice, DS roundel | every face-down card |

**Numbering.** Give each role a fixed number so the deck feels like a real one. Death is XIII. Suggested set, adjust freely:

0 Innocent · I Mimic · II Mentalist · III Whore (Companion) · IV Magistrate · V Diplomat · VI the Lovers · VII Guardian · VIII Bodyguard · IX Oracle · X Gambler · XI Vigilante · XII Scapegoat · XIII Death · XIV Traveling Agent · XV Psycho · XVI Terrorist · XVII Bard · XVIII Witch · XIX Double Agent · XX Necromancer · XXI Conspirator. Jester, Cult Leader and Ripper carry no number (a small star instead). Missions roles use "Mission" as the top line.

**Illustrations.** Every card with a picture uses an emblem from section 11, placed in the arch inside its ray ring. The full deck is drawn on four sheets: `Cards-Roles` (25 roles, Death's two faces, the back, a secret seat), `Cards-Night` (9 Dreams, 11 edicts, the two Exorcism sides), `Cards-Missions` (10 roles, 15 mission cards, Succeed, Sabotage and its public face, Aye, Nay) and `Cards-Story` (15 WHERE cards with their etching, 20 WHO and 15 WHY in type). Edicts and WHO / WHY cards are typographic by design. `Cards-Extras` holds the twelve Traveling Agent parcels and the twenty-four side missions.

- **Parcels.** One emblem per product, in `PRODUCTS` order (`PARCEL_EMBLEMS` in `emblems.js`). In `gifts.js`, keep the parcel drop, shake and open, and the per-product gags; replace each product drawing with its emblem and, when the parcel opens, show the parcel card (emblem in the arch, the product text in italic, "From a Traveling Agent"). Only the recipient sees it, silently, as now.
- **Side missions.** A vellum card with an emblem and the objective text, replacing the `.side-panel` text box (`SIDE_EMBLEMS` maps engine ids to emblems). Every side mission has the same face, so holding one reveals nothing. States: open (plain), complete (gilt edge, ink COMPLETE stamp below the text, "Your Last Stand vote counts double"), failed (dimmed, red FAILED stamp, "counts half"). The stamp sits in the card's footer, never over the picture. The cards use only strings that already exist; the short names on the icon sheet ("Naysayer", "Lone voice"…) are labels for designers, not new UI copy.

## 8. Scenes

Each image in `boards/` matches one board. Names in brackets are the screens in the app.

| Board | Screen | What carries the character |
|---|---|---|
| `Main` | — | palette, type, frames, controls, six seat states |
| `Arcana` | — | every card type |
| `P1-Home` | home | arched reliquary window with the Death engraving, wordmark overlapping its foot, register-style name field |
| `P2-Invitation` | invite (sealed) | tilted vellum envelope, wax seal with hold ring, room code in plain serif capitals |
| `P3-Role` | Night 0 role reveal | the card is the screen; team shown as chips beneath; wax Understood |
| `P4-Day` | discussion / nomination | astrolabe table with candle at the centre, live edict plaque, accusations as slips, wax action in the dock |
| `P5-Night` | night action | silver theme, Dream as a real card beside its text, half-filled moon counts sleepers, vellum commit button |
| `P6-Verdict` | "The town decides" moment | medallion in a red ray burst, SENTENCED stamp, bead tally in a frame |
| `P7-Missions` | play your card | Roman-numeral track, vellum chapter slip, two identical-paper cards |
| `P8-Exorcism` | crystal ball | amethyst theme, lettered ring, blackletter password, stand |
| `T1-Lobby` | TV lobby | QR on vellum, code tiles, the table filling, real card thumbnails for the deck |
| `T2-Day` | TV day | table left with threads and timer bead; the Gazette as a tilted vellum sheet right |
| `T3-Night` | TV night | three columns: giant blackletter phase, moon table, timer + yesterday's result |
| `T4-Gazette` | TV dawn front page | full broadsheet moment over a sunrise glow |
| `T5-Missions` | TV mission reveal | cards turned one by one; Sabotage flips black with a red flare; votes as medallions |
| `T6-Exorcism` | TV name the Demon | red ball as the table, count inside it, ruled list of words |
| `P9-Portrait` | portrait builder | large cameo, four rows of round options; rows scroll sideways with a fade at the edge |
| `Icons` | — | all 104 emblems as icons, plus the interface glyphs |
| `Cards-Extras` | parcel reveal, side mission panel | 12 parcels, 24 side missions, and the three side-mission states |
| `Cards-Roles`, `Cards-Night`, `Cards-Missions`, `Cards-Story` | — | every card in the game |
| `Backdrops` | TV location backdrops | the 15 etchings |
| `Cameos` | — | portrait parts, samples, seat states with portraits |

Screens not drawn follow the same rules: opening ceremony = three-card spread turning on the table, then edicts stamped with wax; nightfall = Dream card flips from the common back; Death's room = `.fr.b` panel with medallions that fill with wax as each member agrees; recap = the table with thread arrows and a vellum account beside it; end screens = a full-frame moment with the winning side's emblem in the arch (keep the existing celebration layers, recoloured to the tokens); guide = vellum pages with drop caps and the card thumbnails inline.

For 15–25 players keep `layout.js` and shrink medallions to the existing small size; drop the dotted bead ring below 44px.

## 9. Motion

Keep the existing choreography and timing; restyle what moves.

- **Card flip**: unchanged 3D flip; the back is now the lattice back. Add the existing `shine` sweep in gilt.
- **Wax**: hold fills, release sets. Breaking the invitation seal keeps the shards.
- **Stamp**: scale from 1.6 to 1 with a 2-degree overshoot and a single 40ms shake of the sheet; ink ghost fades in after.
- **Timer arc**: burns down as now; the bead rides its head. Last ten seconds: arc and bead turn blood, existing edge sparks stay.
- **Candle and moon**: candle flame flickers (2 to 3 frame opacity/scale loop); the moon's lit half grows with the sleeper count.
- **Titles**: blackletter titles press in (opacity + 2px settle), the red ghost arriving 80ms late.
- **Reduced motion**: all of the above become plain fades, as today.

## 10. Layout rules learned from review

These were faults in the first round of mockups. Do not reintroduce them.

- **Nothing overlaps.** No stamp over a portrait, no wordmark over an illustration, no thread drawn across the centrepiece (threads pass under the disc), no seat name on the timer ring.
- **Descenders need room.** Blackletter g, y and p hang low: leave at least 0.25em between a blackletter line and a divider or the next line, and never set its line-height under 0.95.
- **A number and its label are two lines**, never stacked tighter than the number's own line box.
- **Circles stay whole.** A ray burst, ring or halo is never cut by its own box. Only the lancet arch may crop a picture, and the ray ring is sized to clear it.
- **Crosses are centred.** The dead mark is a true X through the centre of the medallion.

## 11. Emblems and icons

`code/emblems.js` holds one drawing per subject on a 100×100 grid, 104 in all: 25 roles, 9 Dreams, 10 Missions roles, 15 mission cards, Succeed, Sabotage, Aye, Nay, the Living, the Demon, six objects (moon, sun, key, coin, gift, bell), 12 parcels (`p_*`) and 21 side-mission emblems (`s_*`; three side missions reuse `lantern`, `succeed` and `innocent`). Ids match `icons.js` where one existed (`death`, `whore`, `agent`, `necro`, `double`, `paralysis`, `nightshift`…); mission cards use `regular`, `lantern`, `fresh`, `extra`, `skeleton`, `maskedvote`, `patience`, `ward`, `steadfast`, `brittle`, `smoke`, `grand`, `trail`, `witness`, `haunted`.

- `emblem(id)` returns the bare icon. Legible from 24px; default sizes 24 / 44 / 72.
- `emblem(id, { rays: true })` returns card art: the emblem at 84% inside a ring of 48 rays, in a padded viewBox. This is the only way to draw a burst, so every burst is a complete circle.
- Colour is CSS: `color` sets the ink, `--paper` sets the fill that hides what is behind a shape (vellum on cards, the ground colour on dark surfaces). No filters or blend modes are needed in the app; the mockups use them only because they load the SVGs as images.
- Style rules for any new emblem: 2.4 stroke, round caps and joins, one solid-ink accent, diagonal hatch on the right-hand side as shade, subject inside a 38-unit radius of centre.
- On cards add the print wobble: an SVG `feTurbulence` + `feDisplacementMap` (scale 1.3) on the art only, never on text.
- Map rule cards to emblems only for the small plaque icon (`board.js` `RULE_GLYPH`); the cards themselves are typographic.

## 12. Cameos (player portraits)

`code/avatar.js` replaces `public/avatar.js` with the same exports and the same part counts (10 / 8 / 8 / 10), so `engine/content.js` `AVATAR_PARTS`, saved portraits and the server checks keep working untouched.

- **Complexion (10):** Bone, Vellum, Wheat, Umber, Walnut, Ash, Verdigris, Moonstone, Amethyst, Rose wax. Half natural, half spectral, all from the game's palette.
- **Hair (10):** Bald, Cropped, Swept, Tonsure, Long, Topknot, Quiff, Curls, Cowl, Parted. Hair colour is derived from hair + complexion as before (six inks); the cowl is always cloth-dark.
- **Eyes (8):** Beads, Almond, Closed, Stern, Furrowed, Spectacles, Heavy-lidded, Eyepatch.
- **Mouth (8):** Smile, Flat, Grin, Frown, Gasp, Smirk, Moustache, Fangs.
- Drawing: a bust (head, neck, dark robe) with a 2.4 ink outline, one flat tone, six hatch strokes on the right cheek. Clip to a circle in CSS; style `.av-bg` (`#4a3b2a`) and `.av-robe` (`#15110e`).
- The portrait sits inside the seat medallion; all seat states (choosable, chosen, accused, dead) are rings and glows around it, as on `Cameos`. Dead = greyscale at 60% brightness plus the X.
- In the Gazette, print the portrait in sepia on vellum (`filter: grayscale(1) sepia(.5) contrast(1.1)`).
- The builder (`P9-Portrait`): 46px round options, the chosen one ringed in gilt, each row scrolling sideways. Keep *Surprise me*.
- The mockup screens still show initials in the seats; in the app every seat shows the portrait, falling back to the initial only when a player has none.

## 13. Backdrops

`code/backdrops.js` has the fifteen WHERE scenes in `SCENARIO.WHERE` order (append-only, like the content file). Each is a 160×90 line etching.

- **Keep them dim.** Behind the TV table the backdrop sits at about a third opacity in `--gilt-2`, stroke 0.17 units, and fades further toward the middle of the screen (a radial mask at 30% in the centre, full at the edges), so it never competes with seats, type or the Gazette. If a line can be read through a panel or behind a label, it is too strong. Set `color` for the line and `--ground` to the page ground.
- **Pencil line.** Backdrops and WHERE card art carry the same hand-drawn treatment as the card engravings: `backdropSvg()` applies an SVG filter that wobbles the line (`feDisplacementMap`) and breaks it with a fine grain, like graphite on paper. Use the `'tv'` preset full-screen and the `'card'` preset on cards. Under reduced motion nothing changes; the filter is static.
- Detail is kept to the edges and the floor line so the table and the Gazette stay readable. Do not add fills or gradients.
- The current `backdrops.js` animates its scenes (rocking ship, turning wheel, swinging lamp, lighthouse beam, gears). Port those motions onto the new drawings by wrapping the matching group; each scene's moving part is a separate element or `<g>` (ship hull group, wheel circles and spokes, lamp cone, beam paths, gear circles, pendulum).
- At night the same drawing recolours to silver through the tokens.
- The same scenes, in ink, are the art on the WHERE cards (`bg/NN-ink.svg`, cropped to the arch around each scene's subject).

## 14. Order of work

1. Tokens, fonts, `theme-color` (`#0c0a09`), grain. The app should already look different with nothing else changed.
2. Type roles: map `--serif` headings to `--black`, body and labels to `--text`. Check all seven languages on the home screen, a role card and a moment.
3. Controls: buttons, inputs, segmented control, chips, sheets, dock.
4. The table: ring, seats and their states, timer, centre pieces, phone and TV.
5. Cards: role, dream, rule, story, mission, backs, thumbnails, the opening ceremony.
6. Moments, stamps, vote tallies.
7. Gazette, invitation, private reports (the vellum surfaces).
8. Missions and Exorcism specifics, then themes: night, Blood Moon, mist, dead.
9. TV board pass at 1600×900 and 1920×1080, then big tables (15–25).

**Check before calling it done:** no element overlaps another at 360px and 1600px widths; every burst and ring is a whole circle; the dead X is centred; `npm test` green; a phone screenshot of each role card at Night 0 has the same average brightness; no blackletter under 20px or in caps; labels pass 4.5:1; every screen works at 360px width; reduced motion honoured; Hungarian and German titles do not clip.
