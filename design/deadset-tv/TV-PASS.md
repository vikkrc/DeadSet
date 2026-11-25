# Dead Set — TV pass

This is a brief for the agent working on `vikkrc/DeadSet`. It covers the **TV board**: the screen everyone at the table shares (`/board/<code>`, rendered by `public/board.js` and each mode's `*Board()` function). The goal is to make the TV more exciting, informative, elegant, useful and recognisably Dead Set, across all eleven games and every phase.

It builds on three earlier documents:

- `design/codex/DESIGN-GUIDE.md` — the look.
- `CONSISTENCY-PASS.md` — the structure.
- `UX-PASS.md`, Parts I–III — the phone and the shared vocabulary: herald, seal, table forms, the Mirror style guide, Coffins arcana, the Omen reveal.

Where this document and an earlier one disagree about the TV, this one wins.

```
TV-PASS.md          this file
evidence/sheets/    deduplicated TV contact sheets, one per game and size (14)
evidence/frames/    the close-ups of boards 0 and 24 (E1–E18)
evidence/tv_sizes.txt   measured TV text sizes per game
workshop/png/       PNG renders of the 38 workshop boards (TV0–TV37)
workshop/html/      the same boards as standalone HTML (open index.html; shared ds.css, workshop.css, tvkit.css, art/, av/, bg/)
harness/            bot replay and audit scripts used for the evidence, plus the layout checks (overlap, cover, gap)
```

The boards also live on a Claude Design canvas, "Dead Set — TV Board Workshop", owned by the person who commissioned this. The PNGs in `workshop/png/` and the HTML pages in `workshop/html/` show the same boards. The HTML is the better reference for exact sizes, spacing and CSS: `workshop/html/tvkit.css` is the TV kit the boards are built from (frame, header, ledger, band, ornate panels, honours, `.duo` layout), and its values match this guide. Board numbers (TV0–TV37) match the canvas. Rows VI–VIII of the canvas (TV24–TV37) cover the lobby, interludes, celebrations and results in depth (sections 12–15).

**Revision 2 (25 Nov).** Adds sections 12–15 (the lobby in full, interludes, celebrations, results; boards TV24–TV37) and two ground rules: the game's hand-drawn etchings only, never CSS-drawn shapes; and cards never cover names. Existing boards were tidied (no annotation over content, the tally's columns aligned, Coffins and the 20-seat table fit above the band, the Mirror table inset from the frame, the Séance clock in the game's own candle etching).

## 0. Ground rules

- **Read before you build.** The current TV is much better than it was a month ago, and a lot of this pass is about scale, emptiness and polish. Keep what works:
  - the shared grid (`.tv-grid`, `.tv-body`, `.tv-rail`, `.tv-stage`);
  - the ornate panels;
  - the astrolabe table and wheel;
  - the caption band (`.tv-caption`);
  - the Gazette front page.
- **The TV design canvas is 1600 × 900 CSS px.** Every size in this document is at that width. The board already scales labels with the board (`--fs-label`, styles.css around line 4984); extend that approach to every size here: one TV unit, for example `--tvu: calc(100vw / 1600)`, with sizes written as `calc(var(--tvu) * 24)`. Do not use raw `vw`, `vh` or `min(92vw, …)` inside TV scenes. The clipped Gazette (TV-R2) comes from mixing viewport units with the board's own layout.
- **Secrets never reach the TV.** Only public state. A result must not be in the DOM before its reveal time (UX Part III, AT10b).
- **The TV is never operated.** It has no buttons beyond the score bell. Everything that needs a decision happens on a phone.
- **The game's hand-drawn art, never CSS shapes.** Every object on the TV (moon, coin, candle, crystal ball, clock dial, crew sigil, grave) is the game's own etching from `public/emblems.js` / `cards.js`. On dark grounds it sits on a vellum medallion (`.etch`: vellum disc, gilt rim, art with `mix-blend-mode: multiply`) or is drawn in gilt with the emblem's own strokes, as the phone's séance clock does (`seance.js` `candles()` uses `emblem('innocent')`). Do not draw flames, moons, spheres or bars with gradients and border-radius. The Codex arch, frames, lozenges and rules are fine; they are the frame, not the art.
- **Cards never cover names.** Role cards, mask cards and tabs on the table sit at the left or right edge of a seat's medallion (outward side), never over the medallion or the name label (UX Part III).
- **Run the harness** (section 16) before and after each step, and compare the contact sheets.

## 1. What the TV shows today (TV0)

The latest branch (`claude/serene-franklin-v9ujky`, head `6cff9d3`, 24 Nov) was run locally with practice bots: all eleven games, 4–8 seats, plus Classic at 12 and 20 seats and the Doomsday preset, all captured at 1600 × 900. The live site (deadset.onrender.com) is not reachable from this environment, so the evidence is the branch run locally.

**What works.**

- One grid for every board.
- Ornate gilt panels.
- The astrolabe table with portraits.
- The ornate Omen wheel.
- The herald band.
- The night palette.
- Verdict stamps.
- The Missions "Pick up the scent" banner.
- The mission cards turning.
- The covers in the lobby.

The Codex identity is there. The problems are:

1. **The text is too small for a room.** Share of TV text under 20 px, measured at every phase (`evidence/tv_sizes.txt`):

   | Game | Under 20 px | Game | Under 20 px |
   |---|---|---|---|
   | Séance | 89% | Coffins | 73% |
   | Midnight | 79% | Classic | 63% |
   | Graverobbers | 79% | The Mirror | 53% |
   | Mimic | 79% | Exorcism | 50% |
   | Carnival | 58% | Omen | 69% |
   | Missions | 68% | Classic at 20 seats | 75% |

   From a sofa 3 m away, 20 px on a 1600-wide layout is not readable. The Gazette log runs at 15 px, seat names at 14–16 px, ledger rows at 14–16 px.
2. **The hero is too small and the screen is half empty.**
   - The table is about 460 px tall in a 900 px screen.
   - The left rail is mostly empty in Classic ("Rules in force" plus three story lines).
   - Scenes put small objects in large voids: the ballot box (E3), the Coffins dig (E7), Midnight's "Death wakes…" (E9), the Séance answer card, the Mirror dilemma (E6).
3. **State is not on the table.**
   - "Who has voted?" is "7 of 8 done" in 14 px in a corner; the seats themselves don't show it.
   - Team members in Missions are shown by greying out everyone else.
4. **Each game invents its own layout inside the grid.** The result is inconsistent panels, positions of the key object, and ledger styles.
5. **Bugs**, listed as TV-R below.

### TV-R · Bugs and quick fixes

| ID | Where | Problem | Fix |
|---|---|---|---|
| TV-R1 | Ballot scene (`app.js` ~838, styles.css 2596–2598) | `.m-tally .m-body:has(.ballot)` is a two-column grid with the ballot `justify-self: end` in the left column. With no verdict in the right column, the tally sits in the left third of an empty screen (E3, every game) | Replace with the tally scene, TV-S2. Until then: one column, centred |
| TV-R2 | Gazette front page on TV (`.paper`, styles.css 1079 and 2639) | Width `min(92vw, …)` plus `rotate(-1deg)` and `max-height: 84vh` inside the board's own layout: the paper runs off the right edge and the body is never shown (E2) | Size in TV units, 1260 × 690, at most 0.6° tilt (TV-S3) |
| TV-R3 | Exorcism end | About 3 s of an empty red frame between the vote and the verdict (E8). Part I's R5 does not cover this path | Queue scenes; the arch opens from the last frame (TV-M) |
| TV-R4 | TV lobby deck | Role names break mid-word: "INNOCEN T", "GUARDIA N", "EXTENDE D" (E10) | `word-break: keep-all; hyphens: none`; let the label sit under the card; shorten in content if needed |
| TV-R5 | Graverobbers | The bottom row of stones sits under the caption band (E4) | The cemetery grid must fit the stage height; see TV-A9 |
| TV-R6 | Séance | The visions column is clipped at the right edge; about half the candidates have no label (E5) | See TV-A8 |
| TV-R7 | Header | "Start the score" is a large text button in every header, all game | A 40 px bell icon after the lobby; the prompt appears once in the lobby (TV-L5) |
| TV-R8 | Header | "Press F or tap for full screen" persists in the lobby | One-time hint that fades after 5 s |
| TV-R9 | Missions team | Seats not on the team fade to grey and lose their faces | Keep everyone in full colour; light the team (TV-A2) |
| TV-R10 | Classic night | "4/8 asleep" in the disc hints at how many are acting | Remove; show the night's public steps instead (TV-A1b) |
| TV-R11 | Midnight end, Mimic end, Omen end | The end shows a title only; the truth (final cards, the place, the scores) is not on screen | The reckoning, TV-S4 |
| TV-R12 | Many scenes | `.moment` covers the whole screen including the header and band, so the room loses the frame of the game during scenes | Scenes keep the proscenium, header and band (TV-S1) |

## 2. TV-P · The ten-foot rules (TV1)

Every TV screen follows these six rules.

- **TV-P1. One hero at a time.** The stage shows the thing the room is deciding about, as large as possible:
  - the table: 680–760 px;
  - the Omen wheel: 600 px;
  - the crystal ball: 440 px;
  - the dilemma card: 560 px wide;
  - the cemetery: about 800 × 560.

  Panels never compete with it.
- **TV-P2. Read from the sofa.** 22 px is the floor. The scale is:

  | Use | Size |
  |---|---|
  | Display (scenes) | 92 |
  | Title (header phase word) | 56 |
  | Hero line (Now card) | 38 |
  | Herald (band) | 30 |
  | Body (ledger) | 24 |
  | Labels (small caps, 0.16–0.24 em tracking) | 15–17 |
  | Seat names | 17 |

  Above 16 seats, seat names may drop to 14 px; this is the only exception.
- **TV-P3. State over sentences.** Who has acted, who is accused, who is dead, and whose turn it is must all be readable from the seats alone: gilt ticks, dashed rings, red medallions, struck names, a glow.
- **TV-P4. The TV never needs a reader.** No buttons, no "tap to continue".
- **TV-P5. Secrets never reach the TV.**
- **TV-P6. Same places, every game.**
  - The clock is always top right.
  - The herald is always in the band.
  - The join code is always bottom right.
  - The Now card is always top of the ledger.

**Three zones of attention:**

- **Hero:** the stage.
- **Pulse:** the band and the seat marks. These change every few seconds and are glanceable.
- **Record:** the ledger. It changes slowly, for whoever looks.

## 3. TV-G · The new TV grid (TV2)

The TV keeps the current header / body / caption rows. The body becomes **stage + ledger**: the left rail goes.

| Zone | Size | Contents |
|---|---|---|
| Header | 88 px | Wordmark (and the mode name under it); the phase word in 56 px blackletter with its numeral; one step line in 24 px ("Secret ballot · a Moonlit Vineyard"); the **clock dial** (60 px ring plus 44 px figures, red under 10 s); the score bell (40 px) |
| Stage | 1600 − 88 (padding) − 440 − 28 (gap) | The game's hero, centred in its area |
| Ledger | 440 px | ① the **Now card** (38 px headline, 24 px line; gilt or oxblood border); ② a phase list (on trial, the team, the crews, scores, the wake order); ③ **The Gazette · latest**: three headlines in 22 px |
| Band | 84 px | Herald line in 30 px; progress beads plus a label ("7 of 8 sealed"); join code and a small QR |

- **TV-G1. Remove the left rail.**
  - "Rules in force" appears in the Now card only when a rule applies ("Equal Exchange: a sentenced Death takes one along").
  - The story moves to the lobby and to night (TV-A1b).
  - Missions' track moves into the table's disc (TV-A2).
  - Exorcism's grid moves to the ledger.
- **TV-G2. The Now card** is the single sentence the room needs: what is happening, who is acting, and what happens next. It is filled from the same source as the phone's move strip (UX Part I, U1), in its TV wording.
- **TV-G3. The Gazette on the TV shows headlines, not the log.** The full timeline stays on phones (UX Part II, G1). Today's 15 px accusation chips in the right panel go.
- **TV-G4. Seat marks.**
  - A 22 px gilt tick on the seat of everyone who has acted in the current phase.
  - A dashed 22 px ring on those who haven't.
  - Nothing on seats that don't act (night, scenes).
  - The band's beads match the ticks.
- **TV-G5. The proscenium** (TV-I1) frames the whole screen. The mode accent tints the stage glow.
- **TV-G6. Backdrops** stay (`backdropHtml`), at 8–12% opacity, behind the stage only.

- **TV-G8. Breathing room.** The body never touches the frame: 24 px between any panel, table or card and the frame's bottom edge (the band's top line), 10 px under the header, and 16 px inside every panel between its border and the first card. Size heroes to the stage after that padding (stage height 702 px at 1600 × 900), never to the full row. The harness check: no visible element of `.tv-body` within 14 px of the band.
- **TV-G9. Only the game's own symbols.** No decorative glyphs the game doesn't use (no ✠, ☩ or dingbat crosses). A rule card is shown as the game shows it: a small vellum card with the rule's initial in rubric blackletter (as on the Night 0 rule card); curses use the curse emblem; everything else uses `emblem()` art.
- **TV-G7. One stage layout per kind of game.** There are exactly three stage layouts, and every board uses one of them:
  - **Table hero** (Classic, Missions, Carnival, Midnight, Coffins, the lobby, the reckoning): the table alone, centred in the stage, 640–760 px.
  - **Object hero** (the Omen's wheel, Exorcism's ball, Séance's candle board, Graverobbers' cemetery): the object alone, centred; no second table (seats live in the ledger).
  - **Object + companion table** (the Mirror, Mimic, and any future game whose hero is not the table but where who-faces-whom matters): the companion table in a fixed **420 px column on the left**, 400 px wide, vertically centred, with one caption line under it ("Who reads whom", "Ilka asks Tomi"); the hero object **centred in the rest of the stage**. Never the other way round, never off-centre. CSS: `.duo { grid-template-columns: 420px 1fr }`, `.duo-t`, `.duo-h`.

Implementation: one function, `tvFrame({ header, stage, ledger, band })` (Part I's T1 asked for it). Every `*Board()` returns stage and ledger HTML; nothing else builds the grid.

## 4. TV-I · An ownable TV (TV3)

- **TV-I1. The proscenium.** A fine gilt frame 14 px inside the screen's top and sides (1 px at 32% opacity, with an inner hairline). It closes at the top edge of the band, not the bottom of the screen, so the band sits below it, centred in its own 84 px row. The band has no border of its own; the frame's bottom edge is its top line. Four 30 px lozenge corners carry the mode accent (the bottom two at the band's top corners). It appears on every TV screen, including scenes and the lobby, so every photo of the TV reads as Dead Set. CSS: `.tvx::before { inset: 14px 14px 84px 14px }`, bottom corners at `bottom: 69px`.
- **TV-I2. One accent per mode.** It appears in exactly three places: the proscenium corners, the stage glow, and the table's rim glow. Values are from the covers:

  | Mode | Accent |
  |---|---|
  | Classic | `#8e1b1f` |
  | Missions | `#a7742a` |
  | Carnival | `#7a1f3d` |
  | Midnight | `#2c4a7a` |
  | The Omen | `#9a7b2f` |
  | The Mirror | `#6f8aa8` |
  | Exorcism | `#6b55a8` |
  | Séance | `#b88a3a` |
  | Graverobbers | `#4f6b3a` |
  | Mimic | `#6f7d74` |
  | Coffins | `#4a4f58` |
- **TV-I3. The arch transition.** Every phase change opens through the Codex arch (the `--arch` clip-path the cards use):
  1. The old phase dims to ink.
  2. A gilt-rimmed pointed arch rises from the bottom edge.
  3. The arch fills the frame and passes beyond its edges.

  Total 600 ms. It replaces cross-fades and per-mode transitions. Reduced motion: a 200 ms fade.
- **TV-I6. Inside the frame.** Header content sits between the frame's top line and the body (header padding 14 px top, 52 px sides; clock dial 50 px). Ornate panels paint their fill inside the frame's curls (inset 7 px, corners cut to follow them), never a square past the bitten corners, and carry no square glow. The backdrop art is a plain low-opacity layer (no blend mode) under everything.
- **TV-I5. The ornate frame has one job.** The game's nine-slice ornate frame (`--frame`, styles.css ~1978: bitten corners, a jewel, twin curls; silver at night) is kept for panels that ask something of the room or honour someone: the **Now card** (what to do now), the **join panel** (scan here), and **honours / the champion** at the end. Records and lists (rosters, the deck, the Gazette headlines, scores) keep the plain double rule. Using it everywhere would make it wallpaper; using it this way makes it a signpost.
- **TV-I4. Four signature motifs, used the same way in every game:**
  - **The arch:** phase changes.
  - **The candle:** the only idle motion. A wick in the disc that shortens with the clock and gutters at zero; at night, the moon instead.
  - **The seal:** every decision lands as wax, with a stamp and a low thud on the TV.
  - **The page:** records arrive as unfolding vellum (the Gazette, story cards, the dilemma).

## 5. TV-M · Motion and sound (TV4)

| Event | What moves | Timing | Sound | When |
|---|---|---|---|---|
| Phase change | The arch | 600 ms | Bell; the score changes mood | Any phase; never during a timer under 10 s |
| Instant news | A ribbon across the band in its colour (gilt public, oxblood bad) | Holds 3 s (deaths 5 s) | Soft cue (deaths: toll) | The band only; never over the stage |
| Full scene | Scene kit (TV-S1), arch in and out | 3–7 s; the host's phone can tap through after 2 s | Sting | Deaths, reveals, verdicts, the end only |
| Spotlight | The subject seat grows 1.25× and the rest dim to 60% | 400 ms in, 800 ms out | — | Who speaks, who is on trial, the leader, the digger |
| Mark | A tick or bead lands (Seal) | 300 ms | Paper tick, TV only | Every "has acted" change |
| Gain / Fall | A token flies from seat to ledger; a name is struck | 500 / 400 ms | Coin / low bell | Points, Souls, deaths |
| Ambient | Candle; fog at night; backdrop drifts 2 px per 10 s | Loop | — | Always; stops under reduced motion |
| Burn-in guard | Header and band shift 2 px every 2 min; the stage drifts 4 px | — | — | Any screen held over 60 s |

Rules:

- **TV-M1. Attention budget.** The band, the scene and the table never animate for attention at the same time.
- **TV-M2. Phones follow the TV's clock.** The server sends reveal times. No phone shows a result before the TV does.
- **TV-M3. The worked sequence** (dawn after a death, TV4):
  1. 0–1.2 s: herald "Dawn breaks".
  2. 1.2–1.8 s: arch in.
  3. 1.8–6.8 s: front page.
  4. 6.8–7.4 s: arch out.
  5. 7.4–8.2 s: the victim's seat is struck (Fall).
  6. Then discussion, with the candle lit.
- **TV-M4. Scene queue.** Scenes queue; the next arch opens from the last frame of the one before. There is never a blank frame (TV-R3).

## 6. TV-S · Scenes and ceremonies (TV5–TV9)

**TV-S1. The scene kit (TV5).** Every Full scene in every game uses one composition:

- Layout:
  - a 1200 × 620 safe area, centred;
  - kicker 22 px, title 92 px, the object row, one line of 32 px;
  - nothing left-aligned or off-centre.
- People: a scene about a person shows their medallion at 2× with their name.
- Reveals: the revealed object is a real card that turns (Turn, 700 ms) after a 0.6 s held breath; then the stamp lands.
- Frame: scenes keep the proscenium, header and band. The band shows the scene's name and a thin progress line instead of the herald.
- Scene sizes from Part I still apply: Full, Banner (now the band ribbon), Inline.

**TV-S2. The ballot scene (TV6).** One tally for every vote:

- Each candidate gets a **column**: the medallion, a stack of wax lozenges and the count in 56 px blackletter.
- Ballots drop one every 350 ms in random order, so the lead changes while the room watches.
- A dashed gilt **majority line** with its number crosses the columns. The column that crosses it turns oxblood.
- Abstentions collect in a small ash column on the right.
- Secret ballots show no voters. Open Ballot shows the voter's initial inside each lozenge.
- Ties: the tied columns pulse gilt, and the band reads "A tie at the top: no one is sentenced".
- The same columns serve Exorcism, Mimic (Agree / Disagree), Missions team votes (Approve / Reject with faces) and Midnight's dawn vote.

**TV-S3. The Gazette on the TV (TV7).**

- **The page.** 1260 × 690 px, centred, tilted 0.6° at most. Masthead in 56 px. A **story headline** that names people, 72 px (UX Part II, G4). A 28 px dek. Three columns at 24 px: Yesterday at the gallows · Overnight · Where we stand.
- **Portraits.** A night death shows the victim's role card in the left column once it is revealed.
- **Motion.** It unfolds (Page, 900 ms), holds 6 s (longer if a death needs reading), then folds into the ledger's "latest" panel.
- **Quiet nights.** Every dawn gets a page; a quiet night gets a shorter two-column one.

**TV-S4. The reckoning (TV9).** The end of every game is one screen that tells the whole truth:

- **The table.** Every seat's role card deals face down beside it, then turns in seat order, 150 ms apart; Death's cards glow oxblood. The winners keep colour and glow; the others dim.
- **The ledger.** Three honours with emblems (26 px titles), then tonight's ledger: points this game and the running total.
- **The band.** It names the next step ("Next: the host chooses Again or Try another"). After 10 s it offers the share card ("Scan for tonight's front page"). After 40 s with no choice, it returns to the lobby.
- **Per game:**
  - **Exorcism:** the password in the disc, the Demon's seat red.
  - **Mimic:** the place card in the disc.
  - **Midnight:** final cards around the table, with arrows showing where each dealt card travelled.
  - **Coffins:** the winner's grave gilt.
  - **The Omen and the Mirror:** scores on the rim, a podium of three in the ledger.

**TV-S5. Lottery / "who goes first" scenes** stay. The result is shown only after the hand stops (UX Part III, AT10b), with the 0.8 s held breath.

## 7. TV-L · The TV lobby (TV8; in full in section 12)

- **TV-L1. Join is the hero until the table fills.**
  - The QR is 250 px on vellum; the code is in 38 px tiles; the address is in 22 px.
  - The join panel sits on the left of the stage.
  - Once everyone expected is seated, or after 60 s with no joins, it shrinks into the band's corner and the table takes its place.
- **TV-L2. The table seats people.** Each phone that joins drops a medallion onto the next seat (Deal), with a chime. Ready seats get a gilt tick, and the rim fills with readiness. The disc shows "6/7 ready" in 80 px.
- **TV-L3. Teach while waiting.** The Now card cycles the game's four teach steps every 8 s (UX Part II, B1), with a dot track. Under it: tonight's deck as small arcana, with labels that never break mid-word (TV-R4).
- **TV-L4. Many players.** From 10 seats, keep the table (two rings, section 9); do not switch to a list.
- **TV-L5. No buttons.**
  - The score starts with the host's first tap on their phone.
  - The TV shows a bell and, once, the line "Sound plays from the TV. Turn it up."
  - The full-screen hint fades after 5 s.
- **TV-L6. Attract loop.** If nobody joins for 3 minutes, the stage cycles the eleven covers (6 s each), and the band reads "Choose a game on the host's phone".

Section 12 replaces these with the full lobby flow (arrival, gathering, start, between games, idle, per game).

## 8. TV-A · Every game on the TV (TV10–TV21)

Each item gives the hero, the ledger, the band and the key motion.

**TV-A1 Classic, day (TV10, TV2).**

- **Hero:** the table at 680 px.
- **Disc, by phase:**
  - discussion and defence: a candle plus the clock in 64 px;
  - accusations: the count of accused in 72 px;
  - ballot: sealed ballots ("7/8") in 72 px.
- **Spotlight:** the speaking seat (TV-M).
- **Threads:** accusation threads draw above the disc and below the seats, with arrowheads. Today's are at full strength, yesterday's at half.
- **Ledger:**
  - Now card ("Tomi speaks · accused by Bram and Mara");
  - the town in seat order, with accusation counts in red and the dead struck through with their day;
  - Gazette headlines.
- **Band:** the speaking order ("Next: Ilka, then the ballot").

**TV-A1b Classic, night (TV11).**

- **The table:** silvered and asleep, with drifting fog and the moon in the disc. No seat ever lights at night. Remove "4/8 asleep" (TV-R10).
- **Ledger:**
  - Now card ("The town sleeps");
  - the night's public steps (dream cards, roles wake, Death chooses, dawn), with the current one lit;
  - the story in 24 px.
- **Band:** counts steps, not players.
- **Dawn:** in the last 10 s the moon sinks and the rim brightens, then the arch opens on the Gazette.
- **Doomsday:** the header clock becomes the Doomsday dial, and dawn adds the "hand moves a day" scene (already in `app.js` ~448).

**TV-A2 Missions (TV12).**

- **The disc:** the five mission seals at 56 px (`.trk`: gilt done, red failed, glowing now) and "5/7 voted".
- **The team:** picked seats get a gilt halo, and the leader carries the lantern above their seat. Nobody is greyed out (TV-R9).
- **Ledger:**
  - Now card ("Viktor proposes Viktor, Mara and Zsófi");
  - the current mission as an arcana card with its line and fail rule;
  - proposal beads with the rule ("on the 5th, Death wins").
- **Votes:** team votes use the tally scene (TV-S2).
- **Mission cards:** they turn one by one, with a held breath before the last (the Coffins rhythm).

**TV-A3 Carnival (TV13).**

- **The masks:**
  - a lattice-backed mask card (42 × 64 px) between each seat and the disc;
  - when masks swap (real or pretend), both cards lift, cross along a dotted gilt arc and land, identically either way;
  - from 9 seats, the masks become tabs on each medallion's outer edge (UX Part III, Y9).
- **Disc:** the Offering as a coin with its count in 52 px.
- **Ledger:**
  - Now card ("Turn 14 · Ilka: swap or pretend with Bram");
  - Souls as coin rows ("13 to win");
  - masks at the ball as small arcana.
- **Turn-level actions** are Inline on the table. The Conspirator and Gambler scenes stay Full.

**TV-A4 Midnight (TV14).**

- **The table of cards:** a silver-lattice card beside every seat, and the three table cards in the disc (44 × 66 px).
- **Ledger:** the wake order, every role in play with its emblem (40 px) and name (24 px); the current one lit, the done ones dimmed.
- **Night is silent:** nothing moves when a card is swapped. All cards shimmer once per step, so a pause gives nothing away.
- **Dawn:** the vote uses the tally. Then **every card turns at its seat**, the table cards last, with arrows showing where each dealt card travelled. This is the game's best moment; today it is a title.

**TV-A5 The Omen (TV15).**

- **The wheel:** the shipped ornate wheel at 600 px.
- **Seers:** 40 px medallions on the rim, with initials; sealed seers ring gilt (today they are 14 px dots).
- **Ledger:** seers with Influence as gilt lozenges and points in 28 px blackletter.
- **The reveal** follows AT10b:
  1. A 3.4 s veiled spin.
  2. The stop, and a 0.8 s held breath.
  3. The face lights and the stamp lands.
  4. Each seer's prediction appears beside their rim seat, right ones gilt.
  5. Arrows on the rim show who turned it which way; the net turn shows in the hub.

**TV-A6 The Mirror (TV16).**

- **The dilemma card** from the Mirror style guide (UX Part III, MR1) at 560 px wide, with the question in **40 px** upright Garamond. Today it is a 300 px card with 22 px text (E6).
- **The fates:** three text-only cards at 26 px.
- **Who reads whom:** the companion table (400 px, left column, TV-G7) with each reader's arrow to the player they face, in Mirror silver, and seal ticks.
- **The reveal:** the fates turn with counts and portraits. Then the arrows resolve one pair at a time: right readings gilt (+2 flies to the ledger), wrong ones red and dashed.
- **Ledger:** the readers' scores.

**TV-A7 Exorcism (TV17).**

- **The crystal ball** at 440 px on the game's own pedestal (`standSvg`) with the rune ring. The category is in 64 px inside.
- **Spoken words** orbit the ball as 26 px pills with the speaker's initial, in speaking order. The current speaker glows; those still to speak are dimmed.
- **Ledger:**
  - Now card ("Edda speaks now");
  - the 16-word grid in 21 px tiles (today it is 12 px).
- **Name the Demon:** the ball sinks into the table's disc, and the seats become the vote.
- **The caught Demon's guess:** the chosen grid word lifts, a held breath, then the password writes itself in the ball, gold or red.

**TV-A8 Séance (TV18).**

- **The candle board** owns the stage: Who / Where / Why rows (30 px row titles), six candidates each at 118 × 156 px. Every candidate has its etching and an 18 px name.
- **Candles:** a lit candidate carries its candle inside its own top-right corner, with a warm inner glow. Ruled-out candidates dim with a rubric stroke.
- **This round's visions** sit in one strip above the board, labelled with the medium who received them.
- **Ledger:**
  - the séance clock as seven 44 px candles;
  - the table, with the Ghost first, in red, "cannot speak".
- **The spirit answers:** a Full scene with the chosen card large and "Yes" / "No" stamped. Then the board lights or strikes it.

**TV-A9 Graverobbers (TV19).**

- **Headstones, not pills:** arched stones with the word carved in 20 px engraved caps, lit from above, and a small lozenge at the top.
- **Dug graves:** relics take their crew's metal (Sun gilt, Moon lapis) with the crew emblem. Empty graves open into dark hollows. The Death grave becomes an oxblood stone with a skull, after its Full scene.
- **Votes:** each digger's initial sits on the stone they voted for, and the majority stone glows.
- **The sign:** the Undertaker's word (46 px) and number (54 px medallion) sit on a plaque above the cemetery.
- **Fit:** the grid fits the stage (TV-R5).
- **Ledger:** two crew panels with relic tracks and members. The digging crew's panel is lit, and its accent tints the glow.

**TV-A10 Mimic (TV20).**

- **The places:** 16 vellum place cards, 136 × 128 with 19 px names, centred as the hero (TV-G7, object + companion table). They show no strike-outs; those are private.
- **The lantern:** the companion table (400 px, left column, TV-G7) shows the asker (gilt) and the asked (vellum) joined by a dotted gilt arc, with the line "Ilka asks Tomi" in 26 px.
- **Ledger:** who still holds their one accusation.
- **Accusations** use the tally (Agree / Disagree, unanimous line).
- **The unmask:** the chosen place lifts, a held breath, then the true place turns beside it.

**TV-A11 Coffins (TV21).**

- **The graveyard table:** each grave is a stack of lattice-backed coffin cards on its owner's spoke, with the owner's initial and count (UX Part III, AT5).
- **The dig as a row** under the table: opened coffins in order with their owner's name, the next one waiting, the bid's last slot dashed. The disc shows "2/4 opened".
- **Every opening:** lift, held breath, turn (UX Part III, 30b), with colour-coded faces (Gold, Curse, Death).
- **Ledger:** clean digs as gilt dots (two win) and coffins left; the digger's row lit.
- **The burial:** a coffin lowers onto every stack at once.

## 9. TV-Y · Scale (TV22)

These rules apply UX Part III, section 38, on the TV.

- **TV-Y1. The TV always shows every name.**
  - From 13 seats, seats alternate between two orbits: odd seats on the inner one (about 31%), even on the outer (about 44%).
  - Medallions are 52 px with 14 px names; the disc shrinks to 40%.
  - Threads thin to 1.5 px and show today's only.
- **TV-Y2.** From 16 seats, the ledger's roster splits into two columns of ten.
- **TV-Y3.** With 3 or fewer players left to act, the band names them ("Waiting for Zsófi and Greer").
- **TV-Y4. Small tables (3–5)** keep 84 px medallions on a 36% orbit. The extra room goes to the mode's object.

## 10. TV-Z · States (TV23)

| ID | State | TV shows |
|---|---|---|
| TV-Z1 | Paused (UX Part II, H) | The stage dims to 50%; the candle and every loop stop; "Paused by Ilka"; the clock frozen |
| TV-Z2 | A player reconnecting | Their seat dashed, with a slow circling bead, never red; the band counts down the grace period |
| TV-Z3 | Host away | "Ilka stepped out · Tomi becomes host in 0:41"; the game continues |
| TV-Z4 | The TV lost its connection | The last frame holds 3 s, then "Finding the table… Reconnecting to A3RCBG"; on rejoin, only the current phase's scene replays |
| TV-Z5 | Spectators (UX Part II, V4) | A small "2 watching" chip in the header corner |
| TV-Z6 | Left on overnight | After 20 min idle in the end or lobby screen, a dim attract loop that moves 4 px every minute |

## 11. TV-X · Accessibility and technical

- **TV-X1. Overscan.** Keep text and controls inside a 4% safe area (64 × 36 px at 1600 × 900). The proscenium sits inside it.
- **TV-X2. Contrast.** Body text on ink is at least 7:1 (TVs wash out). The gilt-on-ink labels at 15 px small caps are allowed only with 0.2 em tracking and weight 600.
- **TV-X3. Never colour alone.** Accused = red **and** the numeral; dead = grey **and** struck through; crews = colour **and** emblem.
- **TV-X4. Reduced motion** (`prefers-reduced-motion`, or a TV setting on the host's phone):
  - the arch becomes a fade;
  - the candle and fog stop;
  - ballots appear in one step;
  - spins jump to their stop;
  - the held breaths and reveals stay.
- **TV-X5. 4K.** Raster art must be at least 2× (backdrops are SVG; check portraits). The TV unit scale covers type.
- **TV-X6. Performance.** One rAF loop for all ambient motion; no `filter: blur` on large areas; `will-change` only during transitions. Target 60 fps on a Chromecast-class browser.
- **TV-X7. Screen readers.** The TV is not the accessible surface (phones are), but keep a live region announcing the herald line for anyone using the TV with assistive tech.

## 12. TV-L · The lobby, in full (TV24–TV28, TV32)

**Today (TV24, E11).** The TV lobby already has the right parts: QR on vellum, code tiles, portraits at the ring, the disc count, the cover and the deck. What fails:

- TV chrome in the header ("Press F…", a large "Start the score" button), louder than the game's name.
- The game is a 110 px cover in a corner; the header says "Lobby · Gathering".
- Ready is a 14 px padlock chip on each seat.
- A full, ready table looks exactly like a waiting one; there is no ceremony into Night 0.
- One static teach step in 15 px.
- Deck labels break mid-word and the deck overflows its panel (TV-R4).
- Rules, pace and the last result never reach the TV.

**The lobby has five states, one screen each:**

| ID | State | Stage | Ledger | Band |
|---|---|---|---|---|
| TV-L7 | **Arrival** (TV25): fewer than the expected players | Join panel (QR 250 px on vellum, 38 px code tiles, the real address in 22 px) beside the table. The table shows **empty chairs** (dashed rings with +) for the players expected (preset count, or 6). | **Tonight we play**: the cover (130 px, art only: no title or meta on the card when the name is printed beside it), title 34 px, pitch, player range and length. **How it works**: the teach step, cycling. **Tonight's cards**: a slow upward ticker (about 4 s a row, looping, faded at both ends) of every role and rule in play, each with its card, name and one line of what it does; rules first, in rubric. It re-deals when the host changes the deck. | One instruction in 30 px ("Scan the code with your phone to take a seat. No app, no account."). No join chip while the panel is up. |
| TV-L8 | **Gathering** (TV26): seated, not all ready | The table at 680 px with portraits. Gilt tick = ready; dashed ring = not yet. **Moods** above seats in 14 px caps tags ("choosing a face", "reading the rules") replace the padlocks. Disc: "6/8 ready" in 80 px. | Now card = the teach step (cycles every 8 s, dot track). **Tonight's deck**: 66 px cards in a 5-column grid, count badges (×2) on the card, names under in 17 px mixed case, never broken. **Rules in force** with one-line effects; **the table's settings** (pace, day length, reveal rule). | "Waiting for Bram and Dani" once 3 or fewer remain; beads; join code + QR. |
| TV-L9 | **All set → start** (TV27) | A: disc says "All ready" and glows; B: countdown 3-2-1 in 210 px blackletter, seats lean in 6%, a bell per beat, phones say "Look at the TV"; C: the deck deals one card face down to every seat (at the medallion's edge), 150 ms apart; D: the arch rises carrying "Night 0 · The story is dealt". About 6 s from the host's tap. | A: Now card "Ilka starts the game"; "Tonight": deck, rules, story. B–D: none (full stage). | A: "All eight are ready. Ilka starts when the room is settled." B–D: scene band with progress. |
| TV-L10 | **Between games** (TV28 B) | The **last result** card (DS-027: verdict + two honours) beside the table; "Again?" readies the same table. | "Again, or another game?"; **Tonight so far**: every game with its winners and points. | "Ready up for another round. Waiting for…" |
| TV-L11 | **Choosing a game** (TV28 A) | The TV follows the host's picker: focused cover 250 px, neighbours dimmed, title 72 px, pitch, players, length, four teach chips. | none | "Ilka is choosing tonight's game. Suggest one out loud." |
| TV-L12 | **Settings change** (TV28 C) | unchanged | The changed rule card deals into "Rules in force". | A gilt **ribbon** across the band: "Ilka added the rule Open Ballot · everyone re-readies". Ready ticks reset when the deck or rules change. |
| TV-L13 | **Idle** (TV28 D) | The join panel is the hero, as on Arrival (QR 250 px on vellum, 38 px code tiles, the address); the covers cycle beside it every 6 s. Header: the logo and “Waiting for players” only (no second wordmark, no step line). Everything drifts 4 px a minute. | none | "Scan the code with your phone to take a seat. No app, no account." The first join returns to Arrival. |

- **TV-L14. The countdown can be cancelled.** Until 0, a host tap or a player leaving cancels it; the disc returns to the count and the band says why.
- **TV-L15. Per game (TV32).** The lobby table's disc shows the game's own object at rest: Classic the deck face up; Missions five seals and the lantern; Carnival the Offering coin; Midnight three table cards; the Omen the wheel at Life; the Mirror the first dilemma face down; Exorcism the clouded ball; Séance seven unlit candles (the Innocent etching); Graverobbers the rim split into the two crews' colours; Mimic the sealed place; Coffins a coffin each. The teach steps are each game's four (TV wording under 26 characters; listed on TV32). The accent changes; nothing else.
- **TV-L16. Portraits.** The TV uses the players' own portraits (`avatarSvg`) in every medallion, including the lobby and the results; initials are only a fallback.
- **Code anchors.** `lobbyMain()` and `lastResultHtml()` (app.js ~2264), `ring(v, { lobby: true, center: centerFor(v) … })`, `graveLobbyCenter`, `lobbyOrb`, `covers.js` (`cover`, `modeTitle`, `modePitch`, `modeMeta`), `qr.js` (`qrSvg`).

## 13. TV-N · Interludes (TV29–TV31)

Today every interlude is an emblem, a title and one line on an empty gradient (E12–E18): elegant, but no table, no faces, and the header and band disappear. Every interlude moves onto the scene kit (TV-S1): header and band stay, a centred stage, kicker, title, **the object**, one line. Durations stay `sceneMs` in `interludes.js`; the band's progress line runs exactly that long.

**TV-N1. Night 0 (TV29), four beats:**

1. **The story.** Who, Where and Why deal in and turn one by one at 230 px with their etchings; the line is the sentence the Gazette will use.
2. **Tonight's rules.** A list built for several rules: each row is the rule card (vellum, its initial in rubric blackletter, nothing written on it) with the name beside it (40 px blackletter) and the effect under the name (26 px). One rule per beat (+0.7 s); the current row is lit, the rest wait dimmed; the band counts them; up to four fit, more scroll.
3. **Your role.** The table returns with a card face down at every seat (at the medallion's edge). The TV counts who has looked (ticks, beads); this beat waits for every phone (or 20 s).
4. **Night I falls.** The etched moon rises in the disc, the rim silvers, then the arch into the night board.

Other games: Missions and Exorcism show beat 3, then their lottery; Midnight beat 3, then its wake order; Mimic "The place is sealed" instead of beat 1; Graverobbers splits the crews; Séance lights its candles.

**TV-N2. The day and night cycle (TV30).** Each scene and its object:

| Scene (`sceneMs` key) | Object | Notes |
|---|---|---|
| Nightfall (`nightfall`, 3 s) | The etched moon on a silver medallion, 250 px, over the dimmed table | |
| Blood moon (`bloodmoon`, 4.6 s) | The same etching on an oxblood medallion; "No protection holds" | Rises after deathless nights; no protection holds that night; the rim stays oxblood |
| Dawn with deaths (`dawn`, 6.4 s + 0.6 s each) | The dead as 210 px portraits with their roles; struck once the stamp lands | Then the arch to the Gazette (TV-S3) |
| Dawn, quiet (`dawn`) | The whole table, every seat lit | Shorter front page |
| The call (`call`, 2.6 s) | The arch passes over the table carrying "The vote" | Also final act, stand, haunting |
| Coin flip (`coin`, 4.4 s) | The game's own tie-break coin (`COIN_FACE`, app.js ~698: milled rim, beads, rays) with a tied name on each face, between the two tied portraits | `coinToss`; lands toward one |
| Verdict, spared (`verdict`) | The spared portrait at 240 px, gilt rim | Hanged case: TV5 |
| A death (`death`, 3.6 s) | The two portraits and the cause's etching between (Lovers, Vigilante, Equal Exchange) | |
| Revive (`revive`, 3 s) | The portrait rises from grey to colour | A temporary return, until the next dawn; the seat un-strikes until then |
| Doomsday (`doom`, 4.8 s) | The game's Doomsday dial (`doom-clock`: the astrolabe face, days in roman numerals) at 470 px under a 96 px rose-red title: past days struck in blood, today gilt, the last day red; a barbed blood hand drags one day with ghost trails and a toll; the rim fills red; the screen bleeds at the edges; the band states the threat | The final day turns everything red |
| Banners (`BANNER` set) | Ribbons across the band only: gilt public, oxblood bad, night-blue for night | Never cover the stage |
| Pace (`paceScale`) | Brisk = 0.6×; banners go inline; host taps through after 2 s | |

**TV-N3. Game ceremonies (TV31).** Built from five shared parts: medallions, cards that turn, the tally columns, the stamp, and the game's etched object on a vellum medallion. The reveal rhythm is always: lift, held breath (0.6–0.8 s), turn (700 ms), stamp.

| Game | Scene | What the TV shows |
|---|---|---|
| All | Who goes first (`mlottery`, 8.6 s) | A glow passes seat to seat around the table, slows, held breath; the chosen seat lights; the game's object (lantern, ball, spade…) moves to it |
| Missions | Mission card (`mintro` + `mcard`) | The mission card at 220 px and its fail rule in 32 px |
| Missions | Team vote (`mvotes`) | Approve / Reject columns of faces (the tally kit) |
| Missions | Reveal (`mreveal`) | Cards turn one by one at 150 px; the last waits 0.8 s; a sabotage cracks oxblood |
| Exorcism | The ball (`xball`) | The etched crystal ball on a medallion; the category writes itself under it |
| Exorcism | The guess (`xguess`) | The chosen word lifts, held breath, stamp gold or oxblood |
| The Omen | The spin (`ospin`) | The ornate wheel; veiled spin, stop, held breath, face lights (AT10b) |
| The Mirror | Prompt (`wprompt`) | The dilemma card unfolds at 560–640 px; question 40 px |
| The Mirror | Readings (`wreveal`) | Reader → read pairs, one at a time, +2 in gilt or a red dashed miss |
| Mimic | Unmask (`qunmask`, `qguess`) | The accused at 2×, role turns; then the true place card beside them |
| Graverobbers | Death's grave (`gdig` kind D; the crew that opens it is out: with two crews the other wins) | The only Full dig: the dug word's headstone (the cemetery's arched stone, 270 px) cracks and turns oxblood; the skull etching rises whole on a vellum medallion; the word carved at its base |
| Séance | Visions (`svisions`) | Each vision card under the medium who received it |
| Séance | The spirit answers (`sverdict`) | The chosen card at 200 px, then Yes / No stamped, row by row |
| Carnival | The unmasking (`kreveal`) | Claimants' masks turn in seat order; the true one glows |
| Coffins | The dig (`cresult`) | Opened coffins in order; a curse stops the row with the stamp |
| Midnight | Dawn (`ndawn`) | Every final card turns at its seat, with travel arrows |

- **TV-N4. Queue, never blank.** Back-to-back scenes chain arch to arch; the band's progress restarts per scene (fixes TV-R3).
- **TV-N5. Phones in step.** Phones show the same kicker and title, timed by the TV's clock (TV-M2).
- **Copy is the game's, never invented.** Every rule, role, power and outcome on a scene comes from `engine/content.js` and the mode engines (rule cards from `RULE_CARDS`, role summaries from each role's `summary`, Carnival powers from `carnival.js`, Graverobbers' Death's grave from `graverobbers.js`). The workshop boards were checked against them.
- **Code anchors.** `interludes.js` (`sceneMs`, `scenesFor`, `sceneSize`, `BANNER`, `paceScale`), the moment renderers in `app.js` (~873, `missionMomentHtml` etc.), `.moment` (styles.css 639, 3068).

## 14. TV-C · Celebrations (TV33–TV35)

Today every game ends on a title and one line ("Dorian wins", "The Mimic wins"), sometimes clipped (E16: "A livin…"). The end becomes a **peak** that lasts about 11 s, then settles into the results.

| Beat | Town / shared win (TV33) | Death / dark win (TV34) |
|---|---|---|
| A · 0–3 s | The game-ending scene as usual (scene kit) | The etched candles go out one by one; the last gutters; a low drone |
| B · 3–5 s | The arch opens on the table: winners' seats rise and glow gilt; the bell etching swings in the disc; three bells | The table bleeds oxblood; the town's seats fall grey in turn; a deep bell per fallen |
| C · 5–11 s, **the peak** | Title 104 px in gilt ("The town survives"); the winners as portraits 150–190 px; the fallen townsfolk smaller beneath ("fell Day II"); one line naming Death's team. Gilt rays turn slowly; gilt lozenges fall for 4 s, then settle | Title in rose-oxblood ("Death takes the town"); Death's players at 220 px around the etched skull; the fallen in a grey row; one line ("Nobody suspected Ash"). Mist and drifting embers |
| D · 11 s → | The results (section 15) | The results |

- **TV-C1. Faces, not a title.** Every peak shows the winners as portraits with names.
- **TV-C2. Every game's finale (TV35).** Same peak, the game's own etched object beside the winners: Missions (mission cards in a row; or Death → the Medium), Carnival (coin and Souls), Midnight (all final cards), the Omen (the wheel etching and points), the Mirror (silver), Exorcism (the password in gold over the ball), Séance (the three solved cards and the Ghost), Graverobbers (the crew's sun or moon and faces), Mimic (the unmasked player and the true place), Coffins (two gold coffins), solo winners (Jester, Lovers, Psycho: their own peak with their role card).
- **TV-C3. Short and skippable.** The host can tap through after 3 s. Reduced motion: no rays, dust or embers; one bell or toll; candles already out.
- **Code anchors.** `outcome.js`, the end titles (`seanceTitle` and peers), `.m-title` moments, `scorethemes.js` for the bells and toll.

## 15. TV-O · Results (TV9, TV36, TV37)

- **TV-O0. Honours, one component everywhere.** Every honours panel (the reckoning, the podium, the evening, the last-result card in the lobby) is the same component: one honour at a time, 5 s each, in the ornate frame: the award's etching (72 px), the game it came from, the title (30 px blackletter), the holder's portrait and name, the line that earned it (22 px italic), a dot track and the next one named. Titles, emblems and lines come from `engine/awards.js`, never invented.
- **TV-O1. The reckoning (TV9, revised).** Title + the table at 590 px with portraits. Every seat's role card sits at the outward edge of its medallion (never over the name), dealt face down, turned in seat order 150 ms apart; Death's cards oxblood. Winners keep colour and glow; the fallen are struck and grey. Ledger: **Honours of the game** (three, each with its etching on vellum, 27 px titles and the earning line; names from `engine/awards.js`: First to suspect, Red herring, Called it, Last breath, Hand on the wheel, Mind reader…), **Tonight's ledger** (this game's points and the total), **How it went** (deaths and hangings in order). Band: next step; after 10 s the share card; after 40 s back to the lobby (TV-L10).
- **TV-O2. Scores and podium (TV36).** For points games (the Omen, the Mirror, Carnival, Coffins; Graverobbers and Missions with two plinths for the sides): the top three as portraits on vellum plinths with roman place and points, the winner tallest; rising III, II, then I with a bell. Under it, **the race**: a quiet line chart of the top three's points per round (gilt for the winner, two lighter tones, names at the line ends, no axis box). Ledger: every score at 24/28 px; the game's honours.
- **TV-O3. The evening (TV37).** After the third game (or on the host's "How are we doing?"): the champion of the evening (portrait 170 px, name 60 px, the line that earned it), tonight's front page as a vellum card with a QR (`share.js` `drawEveningCard`), every game played as its cover with the winners' faces under it, in order. Ledger: the evening's top six, then **honours of the evening, one at a time**: every honour earned tonight (from each game's `awardsFor`) takes the ornate panel in turn for 5 s, with its etching, title, holder's portrait and name, the game it came from and the line that earned it; a dot track counts them and the next one is named underneath. Band: "Again, another game, or goodnight? Ilka decides." Goodnight fades the table out and leaves the front page for a minute before idle.
- **Code anchors.** `awardsFor` (engine/awards.js), `lastResultHtml` (DS-027), `share.js` (`drawShareCard`, `drawEveningCard`, `fitFaces`), the end screen in `app.js` (~3052, `winnersLabel`, `honoursLabel`).

## 16. Order of work and checks

| Step | Items | Done when |
|---|---|---|
| 1 | TV-R1 – TV-R12 | The bugs are gone in every game's contact sheet |
| 2 | TV-G1 – TV-G6, TV-P | `tvFrame()` renders every board; no left rail; the Now card and seat marks are in every game |
| 3 | TV-I1 – TV-I4, TV-M | The proscenium on every screen; the arch is the only phase transition; the motion table holds |
| 4 | TV-S1 – TV-S5 | One scene kit; the tally, the Gazette page and the reckoning in all games |
| 5 | TV-L, TV-L7 – TV-L16 | Arrival, gathering, start, between games, choosing, settings and idle all match TV25–TV28 and TV32; no buttons |
| 6 | TV-A1 – TV-A11 | Each game matches its board in structure (hero, ledger, band, key motion) |
| 7 | TV-N1 – TV-N5 | Night 0 in four beats; every cycle scene and game ceremony on the scene kit with its object (TV29–TV31) |
| 8 | TV-C1 – TV-C3, TV-O1 – TV-O3 | A peak for every ending; the reckoning, podium and evening screens |
| 9 | TV-Y, TV-Z, TV-X | Scale, states and accessibility |

**Harness** (`harness/`). Start the server with `DEADSET_DATA= PORT=3123 npm start`, then run `node run.mjs <specs.json>` with `OUT=./shots`. The specs used for the evidence are `b1.json` to `b4.json`. Make contact sheets with `python3 sheet.py shots/<game> sheets/<game>.jpg`.

Layout checks used on the workshop boards, reusable on the live TV (`node <script> <page.html>`; they read the `.tvx` frame): `overlap.js` (text over text, text clipped, markers over content), `cover.js` (text covered by another element, via `elementFromPoint`), `gap.js` (body content within 14 px of the band).

Add to `audit.js` for the TV:

- **TV floor:** no visible text under 22 px, except `.seat b` (17 px; 14 px at 16+ seats) and small-caps labels (15 px). Report the share under 20 px per game (today's numbers are in section 1) and drive it to 0.
- **Hero size:** the stage's main object (`.table`, `.ow`, `.ball`, `.cem`, `.dcard`, `.places`) is at least 55% of the stage's height.
- **Empty space:** no TV capture with more than 40% of the stage blank, measured as low-variance pixels in the stage box.
- **Clipping:** no element with text extends past the 1600 × 900 viewport or under the band (catches TV-R2, R5 and R6).
- **Blank frames:** no capture where the board is a single colour (TV-R3).
- **Seat marks:** in any phase where players act, every acting seat has `.mk.ok` or `.mk.wait`.
- **No buttons:** no `button` visible on the TV outside the lobby, except the score bell.
- **Nothing over a name:** no element covers any part of a `.seat b` or of the medallion (`elementFromPoint` sampled across each name box; `harness/cover.js` in the workshop does this).
- **No CSS-drawn art:** a lint that flags `border-radius: 50%` + gradient backgrounds or pseudo-element flames on TV objects; objects must be `emblem()` / card art.

**By eye, per game, at 1600 × 900 from 3 m** (or at 50% zoom on a laptop):

- You can say what is happening, whose turn it is and who hasn't acted, without reading the ledger.
- Every scene is centred and fills its safe area.
- The end screen tells the whole story.

## 17. Boards and evidence

| Ref | File | Shows |
|---|---|---|
| TV0 | `workshop/png/TV00-Main.png` | The audit: ten close-ups (E1–E10) and the text-size measurements |
| TV1 | `workshop/png/TV01-Principles.png` | The ten-foot rules, the type scale, three zones |
| TV2 | `workshop/png/TV02-Grid.png` | The new grid, shown with Classic's secret ballot |
| TV3 | `workshop/png/TV03-Identity.png` | Proscenium and accents for eleven games; the arch transition; four motifs |
| TV4 | `workshop/png/TV04-Motion.png` | The motion table and the dawn sequence |
| TV5 | `workshop/png/TV05-Scenes.png` | The scene kit (Classic's verdict) |
| TV6 | `workshop/png/TV06-Tally.png` | The ballot scene |
| TV7 | `workshop/png/TV07-GazetteTV.png` | The dawn edition |
| TV8 | `workshop/png/TV08-Lobby.png` | The TV lobby |
| TV9 | `workshop/png/TV09-Results.png` | The reckoning (revised: portraits, cards at medallion edges, honours, how it went) |
| TV10 | `workshop/png/TV10-ClassicDay.png` | Classic, defence |
| TV11 | `workshop/png/TV11-ClassicNight.png` | Classic, night |
| TV12 | `workshop/png/TV12-Missions.png` | Missions, team vote |
| TV13 | `workshop/png/TV13-Carnival.png` | Carnival, a swap |
| TV14 | `workshop/png/TV14-Midnight.png` | Midnight, the Witch wakes |
| TV15 | `workshop/png/TV15-Omen.png` | The Omen, predicting |
| TV16 | `workshop/png/TV16-Mirror.png` | The Mirror, talk it over |
| TV17 | `workshop/png/TV17-Exorcism.png` | Exorcism, one word each |
| TV18 | `workshop/png/TV18-Seance.png` | Séance, the candles |
| TV19 | `workshop/png/TV19-Graverobbers.png` | Graverobbers, the dig |
| TV20 | `workshop/png/TV20-Mimic.png` | Mimic, a question |
| TV21 | `workshop/png/TV21-Coffins.png` | Coffins, the dig |
| TV22 | `workshop/png/TV22-BigTable.png` | Classic at 20 seats |
| TV23 | `workshop/png/TV23-States.png` | Paused, reconnecting, host away, TV lost, spectators, idle |
| TV24 | `workshop/png/TV24-LobbyToday.png` | Today: the lobby annotated (E11), interludes, endings, results (E12–E18); what each needs |
| TV25 | `workshop/png/TV25-LobbyArrival.png` | Lobby I: arrival, join hero, empty chairs |
| TV26 | `workshop/png/TV26-LobbyGathering.png` | Lobby II: gathering, ready ticks, moods, deck, rules |
| TV27 | `workshop/png/TV27-LobbyStart.png` | Lobby III: all ready, countdown, the deal, into Night 0 |
| TV28 | `workshop/png/TV28-LobbyBetween.png` | Lobby IV: choosing a game, between games, settings change, idle |
| TV29 | `workshop/png/TV29-Opening.png` | Night 0 in four beats |
| TV30 | `workshop/png/TV30-Cycle.png` | The day and night cycle, banners and pace |
| TV31 | `workshop/png/TV31-Ceremonies.png` | Every game's ceremonies |
| TV32 | `workshop/png/TV32-LobbyGames.png` | Every game's lobby: centre object and teach steps |
| TV33 | `workshop/png/TV33-TownWins.png` | Celebration: the town wins (peak + sequence) |
| TV34 | `workshop/png/TV34-DeathWins.png` | Celebration: Death wins (peak + sequence) |
| TV35 | `workshop/png/TV35-Finales.png` | Every game's finale |
| TV36 | `workshop/png/TV36-Podium.png` | Results: scores, podium and the race |
| TV37 | `workshop/png/TV37-Evening.png` | Results: the evening |
| E11–E18 | `evidence/frames/e11.jpg` … `e18.jpg` | Today: TV lobby, Night 0, nightfall, Omen end, Missions end board, Mimic end (clipped), the call, Death unmasks |
| E1–E10 | `evidence/frames/e1.jpg` … `e10.jpg` | Today's TV: Classic vote, Gazette clipped, ballot off-centre, Graverobbers, Séance, Mirror deal, Coffins dig, Exorcism blank frame, Midnight night, lobby deck labels |
| Sheets | `evidence/sheets/<game>.jpg` | Every distinct TV frame per run (classic, classic12, custom20, doomsday and the ten other games) |

The boards show intent: structure, hierarchy, sizes, copy and behaviour. Take colours, type and components from the Codex (`design/codex/DESIGN-GUIDE.md`) and the existing stylesheet.
