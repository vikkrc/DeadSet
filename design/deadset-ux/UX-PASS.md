# Dead Set — UX pass

**Part I** (sections 0–14): pacing, guidance, readability and delight inside each game. **Part II** (sections 15–28): setup, rule book, Gazette, notices, the living table, first game, the dead, edge states, sharing and flagship standards. **Part III** (sections 29–38): the ornate table in three forms, where it lives in every mode, each mode's key surface, the herald for instant news, The Mirror's new dilemmas, switches, and the rules that keep all modes one family. Where Part III and an earlier part disagree, Part III wins.

A brief for the agent working on `vikkrc/DeadSet`. It follows `design/codex/DESIGN-GUIDE.md` (the look) and `design/deadset-consistency/CONSISTENCY-PASS.md` (structure, now mostly implemented). This pass is about **pacing, guidance, readability and delight**: how the game feels to play, not whether it is consistent.

```
UX-PASS.md      this file
evidence/       contact sheets and close-ups referenced below (E-numbers)
workshop/       PNG renders of the 35 design-workshop boards (W-numbers; W14–W25 Part II, W26–W34 Part III)
harness/        bot replay + audit scripts (same as last pass, see section 13)
```

The workshop boards also live on a Claude Design canvas ("Dead Set — UX Workshop") owned by the person who commissioned this. The PNGs in `workshop/` are the same boards. W-numbers below match the board numbers.

## 0. Ground rules

1. **Rules do not change.** Touch `engine/` only where a finding says so (awards data, the evening ledger, the "again" vote). `npm test` stays green after every commit.
2. **One finding per commit**, prefixed with its ID (`P2: banner scenes for turn-level events`).
3. **Privacy rules still win.** Nothing in this pass may make a secret readable from sound, buzz, timing, brightness or motion. Every new sound or haptic is listed with whether it is public (section 7).
4. **Every string through `t()`** and into all seven dictionaries. Plurals need a real plural helper (C1).
5. **Respect `prefers-reduced-motion`.** Every new motion has a reduced form in the same commit.
6. **Verify with the harness** (section 13): replay the affected modes and compare screenshots before and after.
7. **The workshop boards are proposals at "intent" fidelity.** Match their structure and hierarchy. Final visuals come from the Codex tokens and components already in the app, not from the board markup.

## 1. What changed since last pass, and what this pass is based on

**Code:** branch `claude/serene-franklin-v9ujky` at `34e1865` (19 Nov 2026). 49 commits since the consistency audit, covering nearly every item in CONSISTENCY-PASS.md plus a guided lobby and a rule-book guide.

**Method:** the live site (deadset.onrender.com) was again unreachable from the test environment, so the branch was run locally. Bots played a full match of all eleven modes, with a phone (390×844) and a TV (1600×900) captured at every phase. The same automated audit ran at every phase. Home, invitation, lobbies, rule book and desktop views were captured separately. The client code was read for wake lock, compression, sounds, haptics, accessibility hooks and reconnection.

**Baseline compared with last pass**

| Check | Last pass | Now |
|---|---|---|
| Phone text under 11 px (share of characters, worst mode) | 30% | 1% (only card emblems in Carnival and Coffins fans) |
| TV text under 16 px (worst mode) | 73% | 10% (The Mirror), 7% (Coffins), 6% (Classic) |
| Tap targets under 44 px | 40 | 0 |
| axe contrast failures | 4 | 2 (a card-back monogram on the TV at 1.39:1; a Coffins toast at 3.5:1) |
| Duplicate keyframes, mode registry, mode moods | broken / missing | done |

The structural work landed well. What remains is mostly experience: too much scrolling before a game, too many full-screen interruptions during it, screens that leave players unsure what to do, TV layouts that use half the screen, and endings that stop instead of inviting the next game.

## 2. Summary

| ID | Finding | Sev | Effort | Board |
|---|---|---|---|---|
| **R1** | `{names} wins` reads "Ash and Cass wins" | S1 | XS | — |
| **R2** | Séance's hollow ending says "Everyone wins" while the Deceiver walks free | S1 | XS | — |
| **R3** | Phones sleep mid-game: no screen wake lock | S1 | XS | — |
| **R4** | Exorcism and The Omen share the Oracle emblem | S2 | XS | W1 |
| **R5** | Blank frames between scenes (a black phone, an empty TV) | S2 | S | W13 |
| **R6** | Two remaining contrast failures; Exorcism's glow overflows the phone | S3 | XS | — |
| **P1** | Full-screen scenes on almost every turn in Carnival, Graverobbers and Coffins | S1 | M | W10 |
| **P2** | TV scenes use phone compositions in the middle of a 1600 px screen | S2 | M | W9, W10 |
| **P3** | No pace setting for groups who know the game | S3 | S | — |
| **U1** | No single "what do I do now?" line; instructions differ per screen | S1 | M | W5 |
| **U2** | The tray: utility chips wrap; absent slots shift the others | S2 | S | W5 |
| **U3** | The host's advance button competes with the player's own action | S2 | S | W5 |
| **U4** | Host lobby is 5,615 px tall on a phone | S1 | L | W3 |
| **U5** | Guests see the host's whole setup instead of what they need | S2 | M | W4 |
| **U6** | Home: no rejoin, no view of the eleven games | S2 | M | W2 |
| **U7** | The rule book is one 37,659 px page | S2 | M | — |
| **U8** | Disabled buttons look different per mode, and never say why | S2 | S | — |
| **U9** | Per-mode screen fixes (The Mirror, Midnight, Mimic, Exorcism, Graverobbers, Coffins, The Omen) | S2 | M | W6, W7 |
| **U10** | Reconnection and errors are quiet | S3 | S | — |
| **T1** | One TV grid for every mode | S2 | L | W9 |
| **T2** | The TV Gazette is mostly empty vellum | S3 | S | W9 |
| **T3** | The TV lobby: an attract loop instead of a static deck | S2 | M | W11 |
| **T4** | TV chrome: "Start the score" forever, no fullscreen, visible cursor | S3 | S | — |
| **M1** | Seven motion verbs | S2 | M | W13 |
| **M2** | One turn bead for every turn-based mode | S2 | M | W10, W13 |
| **M3** | Points, Souls and Influence change with no motion | S3 | S | W13 |
| **M4** | Sound and haptic map | S3 | S | W13 |
| **A1** | Eleven game covers | S2 | M | W1 |
| **A2** | Carnival's "dance under the cloak" art is an unreadable blob | S3 | S | — |
| **A3** | Graverobbers' crews rely on colour alone | S2 | S | — |
| **F1** | Awards at the end of each game | S2 | M | W8, W12 |
| **F2** | The evening ledger across games | S3 | M | W12 |
| **F3** | One-tap "Again" vote and "Try another" | S2 | S | W8 |
| **F4** | Public reactions on the TV | S3 | M | — |
| **F5** | A 30-second preview per game | S3 | M | W2, W11 |
| **X1** | Accessibility: live regions, text size, high contrast, names in blackletter | S2 | M | — |
| **C1** | A plural helper and a copy pass on host buttons | S2 | S | — |
| **Q1** | No compression: about 1.3 MB of JS and CSS on every first load | S2 | XS | — |

Severity: **S1** players will stumble on it, **S2** noticeable, **S3** polish. Effort: **XS** under an hour, **S** half a day, **M** one to two days, **L** more.

---

## 3. R — Bugs and quick fixes

### R1. "Ash and Cass wins" (S1, XS)

`t('{names} wins', { names })` is used for The Omen, The Mirror, Carnival and Graverobbers (`app.js:520–531`, `mirror.js:189`, `omen.js:149`, `graverobbers.js:362`). With two winners it reads "Ash and Cass wins" (E3, `mirror-phone`, last frames).

**Fix:** use the plural helper from C1: `tp('{names} wins', '{names} win', count)`. Add both keys in all dictionaries. Several languages also inflect the names list; let each dictionary supply its own joiner ("Ash és Cass").

### R2. Séance's hollow ending (S1, XS)

When the murder is solved but the Deceiver walks free, the verdict reads kicker "A hollow victory", title "Everyone wins", subtitle "…the Deceiver walks free" (`app.js:526`; E3, `seance-tv`, final frames). The title contradicts the subtitle.

**Fix:** title "The table wins, barely", or use the existing outcomes: title "The Deceiver walks free", kicker "A hollow victory". Stamp: Victory for the table, Defeat for the Deceiver, as now.

### R3. Screen wake lock (S1, XS)

There is no `navigator.wakeLock` anywhere. In Classic's five-minute discussion, or Mimic's eight-minute questions, phones dim and lock, and players then miss a scene or a turn.

**Fix:** request `navigator.wakeLock.request('screen')` when a room route is active and the phase is not `LOBBY` (and always on the TV board). Re-request it on `visibilitychange`, release it on leave, and fail silently where unsupported. Add a room-menu toggle, "Keep this screen awake", on by default.

### R4. Shared emblem (S2, XS)

`public/modes.js` gives both `exorcism` and `omen` the emblem `oracle`. Give each mode its own (W1): Exorcism `demon`, The Omen a wheel or compass, The Mirror a hand mirror (`s_self` from the side-mission set), Graverobbers the headstone, Coffins the coffin. Then build the covers (A1).

### R5. No blank frames (S2, S)

The replay caught a fully black phone frame in Coffins between two scenes (`coffins` frame 034), a ring drawn without seats during the burial (frame 033), and on the TV an almost empty frame before the Missions verdict.

**Fix:** a scene never fades to empty. The next screen (scene or board) fades in over the previous one (a 240 ms crossfade), and the board's seats are never removed while a phase changes, only re-styled. Add a check to the harness: flag any frame where more than 97% of pixels are within 6 of the ground colour.

### R6. Remaining audit failures (S3, XS)

- The story card back's DS monogram on the TV opening ceremony: 1.39:1. It is decorative; mark it `aria-hidden` and raise the gilt to pass 3:1 anyway.
- The Coffins toast text: 3.5:1. Use `--bone` on `--ink-2`.
- Exorcism `.xb-glow` overflows the phone horizontally during the reveal. Clip it inside the ball's wrapper.

---

## 4. P — Pacing and scenes

### P1. Three scene sizes (S1, M) — W10

Every shared event today is a full-screen scene on every phone and the TV, with inputs locked. That is right for a death or a verdict. In turn-based modes it means the game is interrupted every turn. In the Carnival replay, most phone captures were the "A dance under the cloak" scene (`kswap`, 3.4 s), repeated for each swap. Graverobbers plays `gsign` then `gdig` (3–3.8 s each) on every turn; Coffins plays `cdig` on every dig.

**Fix:** give every scene in `interludes.js` a size, and render three kinds:

| Size | Looks like | Inputs | Duration | Use for |
|---|---|---|---|---|
| **Full** | today's scene, over everything | locked | 3–7 s | the deal, deaths and unmaskings, vote results, mission cards turning, verdicts, Blood Moon, nightfall, dawn |
| **Banner** | a 70–90 px strip across the board (phone: across the stage), board visible underneath | open | 1.5–2 s | Carnival swap/pretend and claims, Graverobbers' sign, a relic found, a Coffins curse, Mimic's accusation call |
| **Inline** | animates on the ring and ledger themselves (M1, M2) | open | 0.6–1 s | passing the turn or lantern, a sealed ballot, a clean dig, a pass, points moving |

Implementation:
1. Add `size: 'full' | 'banner' | 'inline'` to each case of `sceneMs()` and `scenesFor()`. Durations for banner and inline do **not** hold the server timeline (`holdUntil`), so the next turn can start.
2. Render banners with one component (`sceneBanner`) on both phone and TV, placed over the stage, below the header and move strip.
3. Inline scenes are CSS classes added to the ring or ledger for their duration.
4. Per mode, the table on W10 shows which events go where. Default: anything that changes who can win is Full; anything that is someone's turn is Banner; bookkeeping is Inline.

Acceptance: in a replay of Carnival with six bots, the share of phone captures that are full-screen scenes drops below 25%.

### P2. TV scenes fill the TV (S2, M) — W9, W10

TV scenes are the phone scene centred on a 1600×900 frame (E1: "The vote" call is a 40 px title on an empty brown field; "The town decides" tally sits on the left with the condemned's medallion fading in on the right; Missions' "The cards are turned" shows 60 px cards).

**Fix:** every full scene has a TV layout. Title at `--fs-display` (110 px), the subject at least 40% of the frame height (cards 320 px tall, medallion 260 px, tally rows 48 px). Use the same three-row TV grid as the board (T1): the header strip stays visible during scenes, so the room always knows which game and round it is.

### P3. A pace setting (S3, S)

Groups that know a game want it brisker. Add **Pace: Cinematic · Brisk** to the lobby's table settings. Brisk scales full-scene durations by 0.6 and turns banner scenes into inline ones. The server owns the scale (it times the scenes), so phones and TV stay in sync.

---

## 5. U — The phone

### U1. The move strip (S1, M) — W5

Today each screen says what to do in its own way: a vellum slip ("Your bid · Raise above 2, or pass"), a centred kicker and italic paragraph ("Give your sign · One word that links…"), a caption under the ring ("When nominations close, each nominee defends themselves"), a dock note, or nothing (E2: Mimic's question screen, Midnight's dawn). Timers sometimes sit in the header and sometimes in the ring's centre.

**Fix:** one component under the header on every in-game phone screen:

```
[●]  Tap a seat to accuse          1:24
     One accusation each today
```

- **The dot** glows gilt when the player can act now, and is dim when they are waiting. When waiting, the line says who or what they are waiting for ("Cass is choosing a sign", "4 of 6 sealed").
- **Main line:** an imperative, at most 40 characters in English. **Small line:** one rule reminder or consequence.
- **The clock** is the only place the phase timer is printed on a phone. The ring's burning edge stays as the ambient timer.
- On secret screens (night actions, sealed choices) the strip shows the same text for every role ("Your night: choose, then sleep"), so the strip never leaks a role.
- Each mode supplies `moveLine(v)`, returning `{ act: boolean, main, sub }`. Put it next to each mode's dock function and use it instead of the per-mode instruction markup.

### U2. The tray (S2, S) — W5

The utility row (C3 last pass) is right in content but renders as small chips that wrap ("My card · Notes · Story" then "Rules" alone on a second line in Classic). Absent slots disappear, so the positions shift between games.

**Fix:** a fixed four-slot bar above the dock (52 px): **My card · The board · Notes · Story**, each an icon over a label. A slot the mode does not have stays in place, dimmed and inert, so muscle memory carries across games. Notes shows an unread badge. "Rules" (Classic's active Rule cards) moves inside "The board".

### U3. Host controls during play (S2, S) — W5

During play the host's "advance" (Open discussion, Close nominations, Next defence, Bring the dawn…) sits in the dock beside or instead of the player's own action. On the host's phone the most prominent button is often not about the host's own move.

**Fix:** during play, host controls move into a **host strip** at the top of the room menu, and into a small "Host" pill at the right of the header that opens it. Keep **hold to advance**. Exception: in phases where the host's advance is the only thing to do (Classic's morning), show it in the dock as now, labelled as a host action ("Host · Open the discussion").

### U4. Host lobby in three tabs (S1, L) — W3

The host's lobby is now numbered and guided, but on a phone it is **5,615 px** tall: ring, portrait, eleven mode cards, explainer, deck, extended pool, rule cards, other sides, twists, table, music, timers. A host has to scroll about seven screens before starting, and the start button is the only fixed thing.

**Fix:** three tabs under a compact header:

1. **Table**: room code, invite and TV buttons, the ring (seats, moving, removing), portraits. Done when at least the minimum players are seated.
2. **Game**: the chosen game's cover, one-line pitch and **Change game** (opens the cover picker as a sheet, W1, W2). Below it, a **Recommended for N** summary card listing the settings as chips, with **Customise** opening the full settings in place. Then the "How it works" steps.
3. **Rules**: everything advanced (rule cards, twists, other sides, timers, music), grouped as today but collapsed by default.

The **seated strip** (overlapping cameos with ready glows and "6 seated · 5 ready") stays visible above the tabs. The dock reads "Hold to start · 5 of 6 ready", and below it says who is not ready and why ("Bram is still choosing a portrait"). Target: a host who accepts the recommendations can start without scrolling.

### U5. Guest lobby on one screen (S2, M) — W4

Guests currently see the same long page, read-only. They need four things: what game it is, how it works in three lines, their own face and name, and Ready.

**Fix:** W4's single screen: the cover (from the registry), "The host chose this game · 10 minutes", three numbered lines, a link to the full chapter, the portrait row (tap to edit), and the dock with **I'm ready** and "5 of 6 ready". Settings that change what a player experiences (timers, a twist) appear as chips under the steps ("Timers: 30 s a word").

### U6. Home: rejoin and the collection (S2, M) — W2

The home page says "11 games of bluff and deduction" but shows none of them, and someone whose phone lost the room has no direct way back (the session is in `localStorage` per room code, but home does not look for it).

**Fix:**
1. **Rejoin card:** on load, scan `localStorage` for `deadset:<code>` sessions whose room still exists (`GET /api/rooms/<code>/peek`) and show the newest at the top: "Your seat is waiting · Table HB4BR3 · Day II · Return". Hide it once the room has ended or expired.
2. **Tonight's games:** a horizontal strip of covers under the form; tapping one opens its chapter of the rule book with a preview (F5).
3. Keep Host/Join, name and portrait as they are. Rename the guide link to **Rule book**, its new name.

### U7. The rule book as chapters (S2, M)

The rule book is now a good document, but on a phone it is one 37,659 px page with a chapter select at the top.

**Fix:** one route per chapter (`/guide/exorcism`) with the cover at the top, Previous/Next at the bottom, and the chapter select kept as a sticky header. Deep-link from the lobby ("Read the full chapter") and from the end screen. In-game, the room menu's **How to play** opens the current game's chapter in a sheet, not a new page.

### U8. Disabled buttons (S2, S)

Disabled dock buttons look different per mode: vellum-filled and greyed in Coffins ("Tap a coffin first"), dashed outline in The Omen ("Pick where it stops"), and Exorcism's "Hold when you have said it" wraps to three lines.

**Fix:** one disabled style (outline only, `--ash` label, no fill, opacity not below 0.7 on the text), with the reason written as the label ("Pick where it stops first"). Labels stay on one line on a 390 px phone (two at most), so long labels get shorter copy: "Hold when said".

### U9. Per-mode screen fixes (S2, M) — W6, W7

| Mode | Problem (evidence) | Change |
|---|---|---|
| **The Mirror** | "You would…" and "{name} would…" are two identical stacks of full-width rows; easy to tick the wrong one (E3) | Two columns, each headed by a portrait, 64 px option buttons with lettered discs, the target's column outlined (W6). The dock caption says what is missing ("Pick Ash's answer to seal"). |
| **Midnight** | The dawn screen is nearly empty: a small card and two chips (E2) | Show "You were dealt" with the card at 118 px, **What you know** as a timeline of your own night (only what *you* saw), and the deck in play in wake order (W7). |
| **Mimic** | "Your card" sits at the bottom, half under the dock (E2) | The card goes into the tray's **My card** slot and is shown as a peek tab above the ring; tap to raise it and "Hide my card" as now. |
| **Exorcism** | The category sits on the ball in tracked capitals ("FOOD AND / DRINK") at about 11 px (E2) | Category in `--fs-h3` Garamond on the ball, the "Tap to look inside" hint below it in `--fs-small`. The speaker list becomes the turn bead on the ball's ring (M2). |
| **Graverobbers** | Grave words in capitals break mid-word ("FINGERPRI NT"); crews told apart by colour (E2) | Mixed case, `hyphens: auto` with `lang` set, and shrink-to-fit down to `--fs-label` before wrapping. Crew glyphs (A3). |
| **Coffins** | The stacks of coffins over each medallion overlap seat names on the phone; "Your coffins" fades out at the bottom edge (E2) | Stacks sit outside the ring (outer orbit) on the phone, as on the TV; the hand is a fixed row above the tray with no fade. |
| **The Omen** | The reveal ledger columns have no headers; icons are tiny | Column headers (Seer · Influence · Turn · Points) as on W9; turn shown as ←/·/→ glyphs at 20 px. |
| **Classic** | The defence list repeats the accused list; "When nominations close, each nominee defends themselves" sits under the ring | Fold the rule into the move strip; highlight the current speaker in the list instead of repeating it. |

### U10. Reconnection and errors (S3, S)

A "Reconnecting… your choices are safe" bar exists. Improve it:
- Announce it to screen readers (`role="status"` is present; add `aria-live="polite"`).
- After 10 s show **Retry now**; after 30 s, "Still trying · Return to home" with the rejoin card ready.
- Errors from commands (e.g. "Wait for the scene to finish") appear as toasts. Most of them are not user errors: suppress `HOLD` and `STALE` toasts on the client, and show instead a short shake on the button that was pressed.

---

## 6. T — The TV

### T1. One TV grid (S2, L) — W9

Each mode's TV board has its own composition, and several leave large empty areas (E4: The Omen, Exorcism and The Mirror use the top half; Coffins leaves the right half to the backdrop; Séance's rows stop at 60% of the height).

**Fix:** every TV board uses three rows and two columns:

| Zone | Size at 1600×900 | Holds |
|---|---|---|
| **Header strip** | 96 px | wordmark, mode name, unit + number, step, timer, score icon |
| **Stage** | ~900 px wide, rest of the height | the mode's picture: ring, wheel, ball, cemetery, rows, places, at the largest size that fits |
| **Ledger** | ~520 px wide | scores, who has sealed, the Gazette, the deck in play: the mode's reference column |
| **Caption strip** | 76 px | the one line everyone reads (the TV version of the move strip), a progress count ("4 of 6 sealed"), and a small join QR with the code for late joiners and rejoiners |

Implement as a `tvFrame({ stage, ledger, caption })` helper used by every mode's board. Scale with `clamp()` so 1280×720 and 1920×1080 keep the same proportions. Toasts belong in the caption strip's right half, never over the stage.

### T2. The Gazette on the TV (S3, S)

In Classic and Missions the Gazette panel is a full-height vellum sheet whose content fills the top quarter (E1). It now never auto-scrolls (good), but it looks empty early in a match.

**Fix:** the ledger column sizes the Gazette to its content (`max-height`, not `height`), and the space below shows the mode's reference: Classic's living and dead, active Rule cards and the story spread; Missions' track and deduction grid.

### T3. The TV lobby as an attract loop (S2, M) — W11

The TV lobby shows the QR code, the ring and the deck. While people join (often several minutes), it could teach the game.

**Fix:** W11. Left: the QR, the code tiles and the address. Centre: the chosen game's cover, then a **How it works** carousel of three steps at `--fs-h1`, turning every 8 s, then the deck and rules in play. Right: **At the table**, every seated player with Ready or what they are doing ("choosing a face"). Caption: "Starting when everyone is ready · 5 of 6".

### T4. TV chrome (S3, S)

- **"Start the score"** stays as a full pill on every TV board all evening. Once the score has started, collapse it to a 52 px icon button (bell / bell-off).
- **Fullscreen:** offer it once at load ("Press F or tap for full screen") and on the TV's first tap; remember the choice.
- **Cursor:** hide the cursor after 3 s without movement on the board route.
- **Burn-in:** the TV can sit on a lobby for an hour. Drift the backdrop by a few pixels every few minutes.

---

## 7. M — Motion, effects and sound

### M1. Seven verbs (S2, M) — W13

Every animation is one of these. Each has a fixed duration token, one sound and one buzz, defined once (CSS keyframes in `styles.css`, sounds in `fx.js`):

| Verb | Duration | Sound | Buzz (own phone only) | Used for |
|---|---|---|---|---|
| **Deal** | `--t-card`, 60 ms stagger | paper slide | none | dealing cards, story cards, places, graves |
| **Turn** | `--t-card`, 3D | soft flip | 8 ms, own card only | any card turning face up |
| **Seal** | hold 650 ms, set 180 ms | wax press on set | rising, then 20 ms | every hold-to-confirm |
| **Stamp** | `--t-stamp`, `--spring` | thud | 30 ms | Sentenced, Victory, Defeat, Approved, Complete |
| **Pass** | 600 ms along the arc | bell tick | 2 × 15 ms when it becomes your turn | turn, lantern, leader, speaker, Candle (M2) |
| **Gain** | 500 ms fly, 400 ms tick | coin | none | points, Souls, Influence, relics, digs (M3) |
| **Fall** | 400 ms crack, 800 ms fade | low bell | none | a death, a lost coffin, a caught Mimic |

Rules: night and secret screens use none of these sounds or buzzes. Reduced motion turns every verb into a 200 ms fade and the bead jumps. The existing tokens (`--t-card`, `--t-stamp`, `--spring`) stay; only usages that do not match a verb are changed.

### M2. The turn bead (S2, M) — W10, W13

Whose turn it is is shown differently per mode: a lantern in Mimic, a lit medallion in Carnival and Coffins, "Now speaking" text and a list of chips in Exorcism, a crew panel in Graverobbers.

**Fix:** one gilt bead that travels along the ring's arc from seat to seat (Pass, 600 ms) in every turn-based mode, phone and TV. The mode's own object (lantern, Candle, wheel needle) can ride on the bead. When the bead reaches your seat, your phone plays the bell tick and the 2 × 15 ms buzz, and the move strip's dot glows. That cue is safe because turns are public.

### M3. Things that count should move (S3, S)

Ledgers update their numbers instantly. In The Omen, The Mirror, Carnival (Souls), Coffins (clean digs) and Graverobbers (relics), a scoring moment is the best part of a round and is currently invisible.

**Fix:** Gain. A small token (+3, a Soul, a relic emblem) leaves the source (the wheel's face, the reader's seat, the grave) and flies to the player's row in the ledger; the number ticks up; the row glows for 600 ms. On the TV, ledgers re-sort with a 400 ms FLIP animation so a lead change is visible.

### M4. Sound and haptic map (S3, S)

`fx.js` has a rich generated score but few interface sounds: `uiSound` is called with `whoosh` (4), `pick` (2), `tap`, `stamp` and `reveal` (1 each), and `navigator.vibrate` is called from one place. Write the map from M1 into `fx.js` as named cues (`cue('deal')`, `cue('pass', { mine })`), and route every animation through it, so sound, haptics and motion cannot drift apart. Keep the rule that phones only play cues for public events and the player's own taps, and play nothing at night.

---

## 8. A — Artwork

### A1. Game covers (S2, M) — W1

One tarot-style cover per game: family label, the mode's emblem in the lancet arch on its accent (the B1 mood token), title in blackletter, one-line pitch, players and playing time. Use it on the home strip (U6), the lobby (U4, U5), the rule-book chapter header (U7), the TV attract loop (T3) and the end screen's "Try another" (F3). Build it as a `.tarot--cover` variant of the existing card, generated from `modes.js` (add `accent`, `minutes` and a one-line `pitch`). Playing times on W1 are placeholders; measure real games.

### A2. Carnival's cloak (S3, S)

The "A dance under the cloak" scene shows a dark red ellipse (E2, `carnival-phone`), which reads as a blob. Draw it: a cloak or curtain falling over two masks, in the emblem style (2.4 stroke, hatch, ray ring). It becomes a Banner scene under P1, so it can be small.

### A3. Crews without colour (S2, S)

Graverobbers tells crews and grave types apart by fill colour (gold Sun, blue Moon, amethyst Stars, grey, black). Add each crew's glyph (sun, moon, star) in the corner of its graves and in its panel. Give the Death grave a distinct pattern as well as its colour. Check with a colour-blindness simulation (deuteranopia and tritanopia) in the harness.

---

## 9. F — Fun and the evening

### F1. Awards (S2, M) — W8, W12

The end screens announce the result and stop. Give each game two or three **awards** drawn from what happened, shown on the phone end screen and the TV:

| Mode | Example awards (computed) |
|---|---|
| Classic | First to suspect (earliest vote on a Death), Red herring (most votes while non-Death), Last breath (survived longest as a Living target) |
| Missions | Clean hands (most successful missions joined), Doubting Thomas (most Rejects on teams with a saboteur) |
| Exorcism | First to suspect, Red herring, Silver tongue (the Demon's word drew no votes) |
| The Mirror | Mind reader (most right readings), Open book (read right most often) |
| The Omen | Steady hand (most right predictions without turning), Puppeteer (most turns that changed the finish) |
| Carnival, Coffins, Graverobbers, Mimic, Midnight, Séance | similar, two per mode, written with the mode's designer |

Rules: computed on the server from the match record at the end; never reveal anything the end screen does not already reveal; at most one award per player per game; each has an emblem from the existing set.

### F2. The evening ledger (S3, M) — W12

A table often plays several games in one evening, but scores reset per mode. Keep a room-level **evening ledger**: each finished game gives every player 0–2 evening points (win 2, place or survive 1), so a ten-minute game and an hour-long one weigh the same. Show it on the TV end screen and in the room menu. The host can clear it. Store it on the room (not the match) so it survives "Try another".

### F3. "Again" and "Try another" (S2, S) — W8

Today the host chooses what happens after a game. Let players say what they want: two buttons on every phone end screen, **Again** and **Try another**, with a live count on the TV ("Again? 4 of 6 say yes"). The host still decides; the count just informs. "Try another" on the host's phone opens the cover picker directly.

### F4. Public reactions (S3, M)

Social games are loud in the room but silent in the app. Allow a few **reactions** during *public* phases only (discussion, reveals, verdicts): a gasp, a laugh, a pointing finger, drawn as Codex sigils (no emoji), rate-limited to one per player per 5 s. They appear on the TV beside the sender's seat for 2 s. Never during night or secret phases, never on phones other than the sender's.

### F5. A 30-second preview per game (S3, M)

New players learn by watching. For each game, record a short scripted bot round as data (a sequence of views) and play it back in the rule-book chapter and the TV attract loop, with captions. The bots already play every mode; the work is a recorder and a player for view snapshots, not video.

---

## 10. X — Accessibility and comfort

- **Live regions:** scenes, the move strip and results are announced through one `aria-live="polite"` region. There are two `aria-live` uses in the client today. Night phases announce only generic text.
- **Text size:** a room-menu setting **Text: Normal · Large** (Large multiplies the `--fs-*` scale by 1.15 on that phone).
- **High contrast:** support `prefers-contrast: more`: stronger `--iron` lines, no grain overlay, `--bone` for secondary text.
- **Names in Garamond:** the vote tallies and some lists set player names in blackletter (E1: "Finch", "Viktor", "Bram" in Grenze Gotisch). The Codex rule is names in Garamond; apply it in tallies, the Gazette and ledgers.
- **Colour-blind checks:** add a simulation pass to the harness (A3).
- **Focus:** sheets and scenes move focus to their title and return it on close (`inert` on the page behind). `inert` is not used anywhere yet.

## 11. C — Copy

### C1. A plural helper and a copy pass (S2, S)

- Add `tp(one, other, n, params)` to `i18n.js` using `Intl.PluralRules` for each language, and use it for wins, counts ("1 dig left"), and "N of M".
- Host button labels should say what happens, plainly: "Bury for the slow ones" → "Bury for anyone still choosing"; "Bring the dawn" can stay (it is clear in context). List every host label in one table and review them with the person who owns the voice.
- One-line limits: move strip main line ≤ 40 characters in English; dock labels ≤ 24; check German and Hungarian in the harness.

## 12. Q — Performance

### Q1. Compression and caching (S2, XS)

`server/index.js` sends static files without compression (no gzip or brotli). The client is about 858 KB of JavaScript plus 439 KB of CSS, all loaded on every first visit, on phones on party Wi-Fi.

**Fix:**
1. Gzip (or brotli) text responses in `staticFile` (Node's `zlib`, no dependency); cache the compressed bytes per file and ETag.
2. `cache-control: public, max-age=31536000, immutable` for fonts; keep `no-cache` + ETag for JS and CSS.
3. Later: load mode modules on demand (`import()` when a mode is chosen) and split `styles.css` per mode, so a Classic table does not download Carnival's styles.

## 13. Order of work and checks

| Step | IDs | Done when |
|---|---|---|
| 1 | R1–R6, Q1, C1 | Fixes visible in the frames they were found in; compression on |
| 2 | U1, U2, U3 | Every phone screen in every mode shows the move strip and the tray; host controls are out of the dock during play |
| 3 | P1, P3 | Scene sizes in `interludes.js`; Carnival's full-scene share < 25% |
| 4 | M1, M2, M3, M4 | The seven verbs and the bead exist and are used; sound and haptic cues go through one map |
| 5 | U4, U5, U6, U7 | Lobby tabs, guest lobby, rejoin card, chapter routes |
| 6 | T1, T2, P2, T3, T4 | Every TV board uses `tvFrame`; scenes have TV layouts; attract loop |
| 7 | U8, U9, U10 | Per-mode fixes |
| 8 | A1, A2, A3 | Covers, cloak art, crew glyphs |
| 9 | F1, F2, F3 | Awards, evening ledger, Again / Try another |
| 10 | X, F4, F5 | Accessibility settings, reactions, previews |

**Harness** (`harness/`): unchanged from the consistency pass. Run `DEADSET_DATA= PORT=3123 npm start`, then `node run.mjs a0.json` (and `a1`, `a2`) with `OUT=<folder>`. Add to `audit.js` in this pass:
- **blank-frame check** (R5);
- **scene share:** count captures where `body.has-moment` is set, per mode (P1);
- **move-strip presence:** every non-scene phone capture has exactly one `.move` element (U1);
- **one-line labels:** dock buttons never exceed two lines (U8);
- **lobby height:** host lobby ≤ 1.2 × viewport with recommended settings (U4).

**By eye, per mode, at 390×844 and 1600×900:** the move strip says what to do; the tray has the same four slots; a turn shows the bead moving; scoring shows a Gain; no full scene for a routine turn; the TV uses its whole frame; the end screen shows awards, the result and the next step.

## 14. Evidence and boards

| Ref | File | Shows |
|---|---|---|
| E1 | `evidence/sheets/s-standard-tv.jpg`, `closeups/d1.png` | TV scenes at phone scale; the Gazette's empty vellum; names in blackletter in the tally |
| E2 | `evidence/closeups/d2.png`, `d3.png` | Coffins' blank frame and empty ring; Exorcism's category and hold label; Graverobbers' broken words; The Omen's ledger; Mimic's card under the dock; Midnight's empty dawn |
| E3 | `evidence/sheets/s-<mode>-phone.jpg` | Every distinct phone screen per mode: Carnival's repeated cloak scene, The Mirror's two stacks, the plural bug |
| E4 | `evidence/closeups/d6.png`, `sheets/s-<mode>-tv.jpg` | TV boards of eight modes: empty halves, small ledgers |
| E5 | `evidence/lobby/*` | The 5,615 px host lobby, home, invitation, rule book |
| E6 | `evidence/audit/<mode>/_audit.json` | Measured sizes, taps, overflow and contrast at every phase |
| W0–W13 | `workshop/*.png` | The design-workshop boards: 0 principles, 1 covers, 2 home, 3 host lobby, 4 guest lobby, 5 phone anatomy, 6 The Mirror, 7 Midnight, 8 phone end, 9 TV grid, 10 scene sizes, 11 TV lobby, 12 TV end, 13 motion |


---

# Part II — From good to flagship

Part I fixed how a single game reads and moves. Part II is about **everything around the game** (choosing it, setting it up, learning it, looking things up, following the story, surviving mishaps, and telling friends about it) and about the qualities that make a party game something groups come back to: it feels alive, it tells you the right thing at the right moment, it is easy without being bland.

Do Part I first where the two touch: Part II assumes the five phone bands (header, move strip, stage, tray, dock), the scene sizes (Full, Banner, Inline), the seven motion verbs and `tvFrame` already exist.

New ID prefixes in this part: **S** setup, **B** rule book, **G** Gazette, **N** notices, **L** living table, **O** onboarding, **D** the dead, **H** room menu and host, **Z** edge states, **V** sharing and growth, **K** flagship standards. Boards W14–W25 (section 26).

## 15. The four questions, answered (W14)

These are the tests for every screen in Part II. When two proposals conflict, the one that passes more of them wins.

**What counts as good UI and UX in Dead Set?**

- **The phone is a private hand; the TV is the table.** The phone shows only what *you* need to decide or to keep secret. Everything the room shares goes on the TV, once, large. Six people should never read the same paragraph on six phones.
- **One decision per screen.** The move strip names it, the dock confirms it. If a screen has two primary buttons, one of them belongs in a sheet.
- **Eyes up.** A phone screen should be readable in two seconds and then put face down. Measure it: the move strip under 32 characters, the stage free of paragraphs during play.
- **Same place, every game.** Eleven modes, one set of controls. A player who learnt Classic should find the vote, their card and their items in the same spot in Coffins.
- **Recover from anything.** A dropped connection, a late friend, a host who leaves, a TV that sleeps: every state has a way back and says what it is (section 24).

**What makes it feel alive and fun?**

- **Anticipation**: a held beat before a reveal, beads landing one by one, a heartbeat in the last ten seconds.
- **Consequence**: every action leaves a mark someone can see: a thread of suspicion, a crack in a seal, a token flying into the ledger, a line in the Gazette.
- **Recognition**: your face on the table, your name in a headline, an award for your best moment, the evening's ledger, a share card with your table on it.
- **Life at rest**: things that move slowly when nothing happens (a candle, a speaker's halo, faces that react). Small, slow, never in the way.

**How do we relay the right amount of information?**

- A **notice ladder** of five rungs (section 20). Each piece of news gets exactly one rung; climb only when the game changes.
- Everything shown is also **written to the Gazette**, so missing a banner is never fatal. That frees the live UI to be brief.
- **State over events**: whenever something can be shown as a lasting state (a filled ring, a bead) instead of a passing message, prefer the state.

**How is it easy but not bland?**

- **Plain controls, rich world.** Buttons, labels, lists and settings use Garamond, one action, big targets, no ornament inside the hit area. The world around them (backdrops, cards, headlines, scenes, sound) carries all the gothic flavour.
- **Defaults that play well.** A recommended setup for every mode and player count, so a new host can start without opening a single setting.
- **Depth on request.** Rules one long-press away, customisation one level down, the full record in the Gazette, the dossier one tap from a name.
- **Character in the copy.** “Bram did not wake” beats “Player eliminated”. Clear first, then flavour: the first four words must carry the fact.

## 16. S — Setup: from “let's play” to the first card in under a minute

The host lobby was cut down in Part I (U4). This section is the flow around it: choosing a game, adjusting it, and starting with confidence. Target: **a new host with 6 friends reaches the first deal in under 60 seconds and 5 taps**, without opening Customise.

### S1. The game picker (W15)

Today the mode is a segmented choice inside the lobby settings, so the host has to know the names to choose. Replace it with a **“Choose a game” sheet**, opened from the lobby's game cover.

- **Filter chips** at the top, multi-select: `{n} at the table` (on by default, uses the current player count), `Under 15 min`, `Nobody dies`, `New players`. Add `Word game`, `Bluffing` later if the list grows.
- **Rows**, not a grid: mini cover (58 px, from the A1 covers), name in blackletter, a one-line pitch (“One word each. Who doesn't know it?”), and a meta line `3–12 · 10 min · word game` in small caps.
- **Tags**: `Chosen` on the current game; `Best first` on Classic when the table has never played; `New` for a mode added in the last 30 days.
- **Group: “Needs more players”** at the bottom, dimmed, with the reason in the pitch line (“Best from 7; playable at 5–6”). Tapping one explains rather than refusing.
- **Footer**: “Played tonight: Classic, The Mirror · Last chosen: Exorcism” (from the evening ledger, F2), and one button: `Play {Mode}`.
- **Data**: add to each mode's content entry `pitch`, `minutes`, `tags: ['words' | 'bluff' | 'elimination' | 'nodeath' | 'cards']`, `best: [min, max]`, `ideal: [min, max]`. The sheet reads only these.
- Players see the chosen cover on their own lobby (U5) with “Ilka is choosing…” while the sheet is open, so nobody wonders why nothing happens.

### S2. Recommended setup per player count

- Each mode gets a `recommend(n)` function in the engine (alongside `setup.js`) that returns the role mix, rule switches and timers for `n` players. The lobby always starts from it.
- When players join or leave, the recommended setup **updates live** until the host changes something; after that the host's choice is kept and a small chip says “Recommended for 7 changed. Update?”
- The lobby shows the summary, not the switches: “Classic for 7 · 2 of Death · Dreams and Clues on · Relaxed timers · ~45 min”.

### S3. Customise with live effects (W16)

The current settings list tells you *what* a switch is, never *what it does to the game*. Customise becomes a sheet with a **balance panel** pinned at the top:

- **Balance meter**: a bar from Town (blue) to Death (red), with a grey `was` marker and a gold `now` marker. Computed from a simple per-mode heuristic (role weights × count + switch weights; constants in the content file). It does not need to be exact, only directionally honest.
- **Three numbers**: estimated length (`~50 min`, `was ~45`), learning load (`3 / 5`), and the most important count for the mode (`3 Death of 8`, `2 Demons`, `4 coffins`).
- **Rows** for each switch: name, toggle, one-line effect in italics. When a switch moves the meter or the length, the row tints gold and gains an **effect label** in red small caps: `Death much stronger`, `Longer`, `Harder to learn`.
- Footer: `Recommended` (restores S2) and `Keep my changes`. A count in the header: “changed 2 of 14”.
- **Warnings** only for broken combinations (e.g. Blood Moon off with one Guardian and Double Jeopardy off can stall). Show them as a row note, never as a modal.

### S4. Start with a checklist, never a dead button

- The host's Start button always says what's missing instead of being greyed: `Waiting for 2 to be ready`, `Need 1 more for Missions`, `Open the TV to start` (when the mode requires a TV and none is connected; otherwise skip).
- Long-press Start for `Start anyway` when people are not ready (they get a 3 s “Starting…” banner on their phones).
- The TV lobby (W11) shows the same checklist as large lines with ticks: “6 seated ✓ · TV ✓ · 2 still reading their rule card”.

### S5. Saved tables (“our group”)

Groups that play weekly should not set up from zero.

- After an evening, the host is offered **“Save this table”**: name (“Thursday crowd”), the people (names and avatars, matched on rejoin by device and name), their favourite modes and setups, and the evening ledger history.
- Home shows saved tables as cards: “Thursday crowd · 7 · last played 6 days ago · Classic, Exorcism”. Tapping one opens a new room with that setup and sends the invite (V3) to the stored contacts if the device can share.
- Storage: browser-local for v1 (`localStorage` key `deadset:tables`), exportable as a link. No accounts required.

### S6. Scenario cards in setup

The WHO / WHERE / WHY scenario already shapes the Gazette's wording (`scenarioWords` in `public/gazette.js`). Make it visible and playful at setup: three face-down cards in the lobby that the host can **re-roll individually** with a flip (the Turn verb), or write their own. The TV lobby shows them face up as a title card: “The Monks of a Drowned Abbey must Find the Relic”.

## 17. B — Rule book: teach in a minute, look up in a second (W18)

Today `public/guide.js` renders a long reference (`renderGuide`) opened from home and the lobby. It is correct but it is one document for two different jobs: **learning** a game before playing, and **looking something up** in the middle of one. Split them.

### B1. Chapters, one per mode

- Each mode's chapter opens with its cover, name, a meta line (players, minutes, kind), and a **“Teach it in a minute”** vellum panel: four sentences, written to be **read aloud** by the host. This is the most important text in the book; write it for each mode and keep it under 60 words.
- Below, collapsible sections in this fixed order for every mode: *Your first round, step by step* · *What you'll see on your phone* (with thumbnails of the five bands in that mode) · *Settings, and what they change* · *Tips for each side* · *Questions people ask*.
- Footer navigation `‹ Classic | Séance ›`, and a `Chapters` button for the full list (grouped by family as on the covers).
- Deep links: `#rules/exorcism`, `#rules/exorcism/settings`. The lobby's `?` opens the current mode's chapter; the picker (S1) has a “How to play” link per row.

### B2. “What does this do?” in the game

- **Long-press** on any card, role, item in the tray, rule plaque, status chip, or seat marker opens a bottom sheet (not a full page): the card, its name, one sentence of effect, then **interactions that apply to this game**: “Does not stop: the Vigilante's shot, a broken heart”. Rules that are off in this match are not shown. Rules that are on and change the answer are flagged (“Blood Moon is on in this game: on a Blood Moon night, no protection holds”).
- A search field at the bottom (“e.g. tie, revive, Blood Moon”) searches the current mode's chapter and glossary.
- The sheet never reveals hidden information: it only explains cards you can see, and roles in the role list are explained generically.
- Implementation: every rule fact lives once in content (`engine/content.js`) as `{ id, text, interactsWith: [...], when: (config) => bool }`. Both the book and the sheet render from it, so they cannot drift.

### B3. A glossary that the whole game links to

Terms like *nominate*, *second*, *trial*, *sentence*, *immunity*, *ghost*, *the Living* appear in many modes. A glossary (one entry each, one sentence) is linked from the first appearance of each term per screen with a dotted underline. Tap shows a small popover; no navigation.

### B4. A printable sheet

`Print` in each chapter produces a one-page A4 summary (teach-it panel, phases, roles in the default setup). Parties with a host who likes paper will use it; it also works as a shareable PDF for groups deciding what to play.

## 18. G — The Gazette as the case file (W19)

The Gazette (`public/gazette.js`: `editions`, `gazetteHtml`, `frontPageHtml`) is the most characterful thing in Dead Set, and today it is mostly a recap. Its real job in a deduction game is to be **the public memory of the table**: the thing you check when you say “wait, who voted for Mara?”. Give it that job without losing the newspaper.

### G1. Two views, one record

- Keep the **front page** for dawn (Full scene on TV, Banner on phones): headline, dek, portrait, columns. It is the dramatic moment.
- Add a **timeline view** as the default on phones (rename today's “List view”): grouped by phase (“Night II”, “Day III”), one line per event, with a small-caps time tag (`Dawn`, `Talk`, `Vote`, `Ballot`, `Now`). Deaths and sentences in red.
- **Filters**: `Everything` · `Votes` · `Deaths` · `Who said what`. Votes shows every tally with who voted how where the mode makes votes public.
- The last line is always **Now**: “Night III begins. 4 Living, 2 of Death (unknown).”

### G2. “Where we stand”

A vellum panel pinned at the bottom of the timeline: one or two sentences generated from public state that tell the table what's at stake. “Two killers remain. The Town needs two right votes in the next three days.” For Missions: “Town 2 · Saboteurs 1. One more success wins.” For Exorcism: “Round 2 of 3. The Demon has escaped once.” This is the single most useful line for a player who zoned out.

### G3. The dossier

- Tap any name in the Gazette (or long-press a seat) to open a **dossier**: avatar, status (“Alive · seat 4 · role unknown”), and a **public record** (votes cast, people defended and accused, nominations received, public claims if the mode has them). Each line is computed from public log events only.
- **Private notes**: a text field and three marks (`Suspect` / `Trust` / `Unsure`), stored on the device only, keyed by match id. A mark paints a faint tint on that player's seat on your phone (red, blue, grey), never on the TV.
- Rule: the dossier must never show anything the whole table did not see. Write a test that renders every dossier from `playerView` and asserts no hidden field is read.

### G4. Headlines that name people

Front-page headlines today are templated by death count. Add a small set of **story headlines** chosen by events, with names: “Town Hangs Its Own Guardian”, “Oracle's Last Vision Ignored”, “Quiet Night; Accusations Fly”, “Demon Guesses the Word and Walks Free”. Each needs a condition on public events and a fallback. This is what people screenshot.

### G5. The Gazette after the game

At the end, the Gazette becomes **the full story with secrets revealed**: the same timeline, now with night actions filled in (“Night II · Death chose Bram. The Guardian shielded Tomi.”). This is the best way to understand what happened, and it feeds the share card (V1).

## 19. H — Room menu and host controls (W17)

Today in-game options are spread over the dock, chips and sheets. Collect them in one **room menu** opened from the header's table name.

- Header: mode and phase (“Classic · Day II”), table code, “you are Viktor”.
- **Tabs**: `You` (this phone) · `Table` (Gazette, story, evening ledger, invite) · `Host` (host only) · `Help` (this mode's chapter, “what does this do?” index).
- **You**: keep screen awake (R3), text size (Normal / Large / Larger), sound and buzz (All / Taps only / Silent), language, first-game tips on/off, leave the table (“your seat stays; rejoin from home”).
- **Host**, also shown as a red-bordered box at the top of `You` when you are host: the current phase's main control as a **hold-to-confirm** button (`Hold to close nominations`; maps to `host.advance`), `+30 s` (`host.extend`), `Pause`, then below: recover a seat (`host.recovery`), move seats, remove a player (`host.kick`), end the match (`host.end`, hold to confirm).
- **Pause** is new: freezes deadlines on the server, shows “Paused by Ilka” on the TV as an Announce banner with the candle stopped. Needed for doorbells and pizza.
- Hold-to-confirm replaces confirm dialogs for all destructive host actions: a gold fill runs along the button for 800 ms.

## 20. N — The notice ladder (W22)

Today scenes, toasts, banners and log lines are chosen per mode. Define one ladder and route every message through it (a `notify(level, payload)` in `public/fx.js`, used by all modes).

| Rung | Where | For | Limits |
|---|---|---|---|
| **Interrupt** | Full scene on TV; small headline on phones | Deaths, role reveals, the verdict, the end | Max 6 s, tap-through after 2 s; max one per phase, queue the rest; never while a timer under 15 s runs |
| **Announce** | Banner across the stage | Phase changes, a vote opens, a turn passes to you | Holds 2.5 s, then settles into the header; newer replaces older, never stacks; your-turn adds one buzz |
| **Inform** | Move strip on phones, caption on TV | What to do now, what you are waiting for | One line, verb first, under 32 characters; changes with a 150 ms fade only |
| **Ambient** | Rings, ledger, beads, tints | Who voted, who's talking, how close the end is | No text, no sound; motion ≤ 300 ms |
| **Private** | A folded slip on your phone | Your secret results | Opens on hold, re-folds on release; kept in the tray; never on TV, never a system notification |

**N1.** Every message in `engine/messages.js` gets a `level`. Audit: no mode uses a Full scene for something that is not on the Interrupt list (Carnival's per-turn cloak scene is the known offender, P1).

**N2. Everything goes to the Gazette.** Each notice above Ambient also writes a public log event (or a private one for Private). The UI may then drop anything that does not fit its rung.

**N3. Waiting is information.** The move strip never says “Please wait”. It says who or what: “Waiting for Ilka and 2 others”, “Death is choosing”, “The TV is revealing the votes”. Pair it with the Ambient rings so the waiting player can see progress.

**N4. Quiet hours inside the game.** During discussion (the part of the game that happens between people), phones show nothing new except Ambient changes and the last-10-seconds warning. Discussion is the game; the UI should step back.

**N5. Sound follows the ladder.** Interrupt has a sting, Announce a soft cue, Inform nothing, Ambient nothing, Private a paper sound on your phone only. One volume setting per phone (H).

## 21. L — The living table (W23)

What makes a table feel alive is state you can read at a glance that changes slowly as the conversation changes. All of these are TV-first; phones get a reduced version on their table view.

**L1. Speaker spotlight.** A warm halo around the seat of whoever has the floor. Sources, in order: the host taps a seat; a player taps “I'm speaking” on their phone (optional, off by default); never the microphone without explicit opt-in. Fade in 400 ms, out 800 ms.

**L2. Threads of suspicion.** Each nomination or second draws a red thread from accuser to accused across the table, thicker with repeats, fading at dawn. In modes without nominations, an optional “I suspect…” tap on a seat draws a thinner thread. At the vote, the threads become the vote lines.

**L3. Faces that react.** Avatars (`public/avatar.js`) get four state-driven moods: *calm*, *speaking* (mouth open), *accused* (brows up, label “accused ×2”), *dead* (eyes closed, desaturated). Optionally a player may set *nervous* or *smug* once a day as a playful tell. Moods are layers on the existing avatar parts, not new art per character.

**L4. The candle.** The single always-moving element on the TV: a 3 s flicker loop at the centre of the table that shrinks with the remaining discussion time and gutters out when the vote opens. It replaces any other idle animation.

**L5. Tension at ten seconds.** In the last 10 s of a timed phase, the clock turns red, the TV plays a heartbeat at 60 bpm and the edges vignette. Phones buzz once. Never earlier, so it stays special.

**L6. The dead stay seated.** Dead players keep their seat, grey and still, with their role shown once revealed. A small ghost glyph appears when they submit a hunch (D1), without revealing it.

**L7. Reduced motion** (`prefers-reduced-motion` or the setting): spotlight and threads stay as static states, the candle and heartbeat stop, the clock just turns red.

## 22. O — First game: learn by playing (W20)

Rules teach best in the moment they matter. Add **first-game tips** (on automatically for a device that has never finished a game; toggle in the room menu).

- **Four tips, in order**, each shown once when that part first matters: (1) your card: hold to peek, let go to hide; (2) the move strip: it always says what to do; gold means your move, grey means wait; (3) the tray: what you hold; (4) the dock: one button confirms.
- Each tip is a vellum callout pointing to a **spotlighted** band (the rest dims). Buttons: `Skip tips` and `Got it`, with a 4-step progress mark.
- **Never during a timer under 20 s.** Queue the tip for the next calm moment instead.
- Mode-specific tips (one per mode, at most two): “In Exorcism, say a word that proves you know, without giving it away.” From the chapter's teach-it panel.
- **Practice table**: `server/bots.js` already adds practice bots (`host.bots`). Expose it on home as **“Try a practice round”**: a room with 5 bots, Exorcism or Classic, tips on, the TV view in a second tab optional. Bots should be marked as such on every screen (a small “bot” tag) and the Gazette should say “practice” in the masthead.
- **The host's script**: when the host starts a mode for the first time, the TV shows the teach-it panel as a title card for the host to read aloud, with `Start` on the host's phone. Hosts like having something to say.

## 23. D — The dead still play (W21)

Being eliminated early in a 45-minute game is the biggest fun-killer in the genre. Dead players must stay involved without being able to leak.

**D1. Hunches.** Dead players get a ghost seat: a cooler, desaturated theme (blue-grey, `#a9c3d6` accent) and one recurring move: **“Hunch: who is Death?”** (per mode: who is the Demon, who is the saboteur…). Pick up to two per day. Hunches score at the end (+2 for a correct hunch made before the table found out) and feed an award (“Called It”).

**D2. A ghost leaderboard** among the dead, shown only on ghost phones, and on the TV once, at the reveal: “Mara called it on Day II.”

**D3. Ghosts see only what the table sees.** No roles, no night actions, until the game ends. This is the opposite of some games' “spectators see everything”, and it is deliberate: in a room, a dead player's face is visible to everyone; if they knew, their face would tell. Write a test: `playerView` for a dead player equals the public view plus their own role and hunches.

**D4. Things to do.** “Follow the vote” (watch the tally live), the Gazette, the dossier. Optionally, in modes that support it later, a *haunt*: once per game, a ghost can make one seat's candle flicker on the TV during discussion. Pure atmosphere, no information. Test it with groups before shipping.

**D5. The dead in the evening ledger.** Early deaths still earn awards (“First to Fall” is a joke award; “Called It” is a real one). Nobody should finish a game with nothing to show.

## 24. Z — Edge states (W24)

Each edge state says **what happened, what happens next, and one way forward**, in the game's voice. No error codes, no blank pages, no red names on the TV.

| ID | State | What to show | Notes |
|---|---|---|---|
| Z1 | **Late arrival** during a game | “A game is under way. You're in the gallery and will be seated for the next game.” `Watch` · `Get the rules` | Host may deal them in only in modes that allow it (Exorcism, The Mirror) |
| Z2 | **Reconnecting** | “Finding your seat… Your cards are safe.” with beads | TV shows a dim seat with a small spinner; auto-skip their action after 45 s if the phase needs it |
| Z3 | **Host away** | “Ilka stepped out. If she isn't back in 60 s, Tomi becomes host.” `Take over now` | New: host hand-over. Today `hostId` is fixed; add `room.hostAway` and promote the longest-connected non-bot player. The TV never needs a host |
| Z4 | **Too few players** | “Missions needs 5. You have 4.” `Invite` · `Exorcism (3+)` | Start is never a dead button (S4) |
| Z5 | **Someone leaves mid-game** | “Dani has left. Their seat is held; their turns are skipped; a vote needs 5 instead of 6.” `Hold seat` · `Replace with a bot` | One Announce; the Gazette records why the count changed. Replacing with a bot is new and uses `bots.js` |
| Z6 | **Kicked** | “The host removed you from this table.” `Home` | No reason shown, nothing on the TV but an empty seat |
| Z7 | **Room ended** | “The candles are out. This table closed after the last game. Tonight's ledger is saved.” `See the ledger` · `New table` | Old invite links land here. Rooms are swept after 12 h without clients (`ROOM_TTL_MS` in `server/rooms.js`); keep a tombstone with the ledger for 7 days |
| Z8 | **TV lost** | “The table went dark. Phones keep playing.” `Copy TV link` | Phones show a small “TV offline” chip in the header only |
| Z9 | **Wrong code** | “No table with that code. Check the letters on the TV.” and show the code in the same font as the TV | Codes should avoid ambiguous letters (0/O, 1/I) if they don't already |
| Z10 | **Phone locked / app in background** | On return, a one-line catch-up above the move strip: “While you were away: Bram died; you voted (auto: abstain).” | Uses the Gazette since the last seen event id |

## 25. V — Sharing and growth (W25)

A party game spreads through **the people who weren't there**: the screenshot in a group chat, the invite link, the friend who watched and wanted in. Each of these needs a designed artifact.

**V1. The share card.** At the end of a game, `Share` produces a **1080×1350 image** (Instagram/WhatsApp portrait) rendered as a Gazette front page: date, table name, game number of the night; the masthead; a **story headline** (G4) with names; mode, players, minutes, winner; the key art; a three-sentence story; the evening's honours (from F1 awards); the winners' faces and the fallen; the URL. Generate it client-side from the end-of-game Gazette (canvas or SVG → PNG), share with the Web Share API, fall back to download. Never include hidden information players didn't agree to reveal (it's after the game, so roles are fine).

**V2. The evening card.** At the end of the evening (or on demand from the ledger), a second card summarising all games: “Thursday crowd · 4 games · Death won 3 · MVP: Ilka”. This is the one that gets pinned.

**V3. Invites that sell.** The invite link's preview (Open Graph image and text) shows the chosen game's cover and “Ilka invites you to Classic tonight. No app, just your phone.” The page it opens is the guest lobby (U5) with the game's teach-it panel, so people arrive knowing what they're playing.

**V4. A spectator link.** A read-only TV view by link (`/tv/{code}?watch`), for a friend on a call or a second screen in another room. Shows exactly what the TV shows. Count spectators in the TV corner (“2 watching”).

**V5. Saved tables** (S5) and **the evening ledger** (F2) make return visits easy; a `Play again next week` button on the evening card creates a calendar-free reminder: the saved table appears first on home.

**V6. Moments worth retelling.** Keep a short list of “moment” detectors over public events (a 5–1 hanging of an innocent, a last-second Demon guess, a ghost who called it on Day I) and give them a stinger line in the Gazette and the share card. These are what people tell their friends.

## 26. K — Flagship standards

To pull in many groups over time, Dead Set has to feel finished everywhere, not only in its best mode.

- **K1. One quality bar for all eleven modes.** Every mode ships with: a cover, a teach-it panel, a recommended setup per count, a TV layout using `tvFrame`, a front-page headline set, at least three awards, and a share card. Track it as a table in `ROADMAP.md`; a mode missing any of these is labelled “Preview” in the picker.
- **K2. Time to fun.** Measure from home to first deal for a new host with recommended settings. Target under 60 s. Add it to the harness as a scripted flow.
- **K3. Performance budget.** First load on a mid-range phone over 4G under 2.5 s to interactive; the game must work on a three-year-old Android. Part I's Q items (compression, image sizes) are the start.
- **K4. Localisation as a feature.** Eight languages exist in `public/i18n/`. Every new string in Part II goes through `t()`, and the teach-it panels and headlines are translated by a human, not left in English. Blackletter only for display text; all body text in Garamond with full Latin Extended (for Hungarian, Czech, Slovak).
- **K5. Accessibility is not a mode.** The text-size setting (H) scales every phone screen without overflow; every long-press has a visible alternative (a `?` in the sheet header); colour is never the only signal (threads have arrowheads, marks have icons).
- **K6. Safety for public play.** Names are filtered for slurs; the host can rename a player; the share card can blur names (`Share without names`). Groups of strangers (stream audiences, game cafés) need these before they need anything else.
- **K7. Telemetry without accounts.** Anonymous, opt-out counts of: mode chosen, players, length, finished vs abandoned, where people drop out. Without it, Part III will be guesswork.

## 27. Order of work for Part II

| Step | Items | Done when |
|---|---|---|
| 1 | N1–N5 | Every message has a level; `notify()` is the only path; harness counts Interrupts per phase ≤ 1 |
| 2 | B2, B3, G1, G2 | Long-press sheet works on every card and chip in every mode; timeline view is the phone default with “Where we stand” |
| 3 | S1, S2, S4 | Picker sheet; `recommend(n)` for every mode; Start always names what's missing |
| 4 | H, Z2, Z3, Z5, Z10 | Room menu with hold-to-confirm; Pause; host hand-over; catch-up line |
| 5 | D1–D3 | Ghost seat with hunches in every elimination mode; leak test passes |
| 6 | O | Four tips; practice table on home |
| 7 | L1–L7 | Living table on TV; reduced-motion variant |
| 8 | G3–G5, S3 | Dossier with private notes; story headlines; full story after the game; Customise with balance panel |
| 9 | B1, B4 | Chapters rewritten with teach-it panels; deep links; print |
| 10 | V1–V6, S5, S6 | Share card, evening card, invite previews, spectator link, saved tables, scenario cards |
| 11 | Z1, Z4, Z6–Z9, K1–K7 | Remaining edge states; the flagship checklist is green for all modes |

**Harness additions** (`harness/audit.js`):

- **interrupt budget**: no phase has more than one `.moment.full` capture (N1);
- **move strip copy**: every `.move .what` is under 32 characters and does not contain “wait” without a name or role (N3);
- **dossier leak test** and **ghost leak test**: render the views for every player at every phase and assert no hidden field appears (G3, D3);
- **time to first deal**: scripted host flow from home with recommended settings, report seconds and taps (K2);
- **long-press coverage**: every `.card`, `.chip`, tray slot and seat has a `data-explain` id that resolves in content (B2);
- **edge state screenshots**: force each E-state and capture phone and TV (Z1–Z10).

**By eye**: a new player who has never seen Dead Set can join, play an Exorcism round with tips on and say what the Demon does, without anyone explaining. A dead player in Classic still has their phone in hand at the end. The share card is something you would post.

## 28. Evidence and boards, Part II

| Ref | File | Shows |
|---|---|---|
| W14 | `workshop/W14-Principles.png` | The four questions answered (section 15) |
| W15 | `workshop/W15-Picker.png` | Game picker sheet with filters, tags, “needs more players”, tonight's history (S1) |
| W16 | `workshop/W16-Customise.png` | Customise with balance meter, length, learning load and effect labels (S3) |
| W17 | `workshop/W17-Menu.png` | Room menu with tabs and host box, hold-to-confirm (H) |
| W18 | `workshop/W18-Rulebook.png` | A chapter with “Teach it in a minute”; the in-game “What does this do?” sheet (B1, B2) |
| W19 | `workshop/W19-Gazette.png` | Gazette timeline with filters and “Where we stand”; the dossier with private notes (G1–G3) |
| W20 | `workshop/W20-Coach.png` | First-game tip spotlighting the move strip (O) |
| W21 | `workshop/W21-Ghost.png` | Ghost seat with hunches and the ghost leaderboard (D1–D4) |
| W22 | `workshop/W22-Notices.png` | The notice ladder with examples and limits (N) |
| W23 | `workshop/W23-Living.png` | TV living table: spotlight, threads, moods, candle, tension (L) |
| W24 | `workshop/W24-Edges.png` | Eight edge states (Z) |
| W25 | `workshop/W25-Share.png` | The 1080×1350 share card (V1) |

The boards are sketches of intent, not pixel specs: take structure, hierarchy, copy and behaviour from them, and take colours, type and components from `design/codex/DESIGN-GUIDE.md`.


---

# Part III — One table, every mode, one voice

Part III follows a design review of Parts I and II. It asks for six things:

1. **Design par.** The Part II screens must be brought up to the visual standard of the earlier boards, not only their logic.
2. **One table.** The table is always the ornate astrolabe table (board 5).
3. **Where the table lives.** For every mode, decide where the table is shown as an indicator and where it is a point of interaction, and what each mode's key interaction surface looks like.
4. **Notifications.** Make one shared decision on where instant notifications appear.
5. **Coherence.** Every mode should look like the same game.
6. **The Mirror.** It gets the game's real switch, and its dilemmas get a new, more appealing design.

New ID prefixes in this part: **Y** the table, **J** the herald (instant news), **AT** the mode atlas (one item per mode), **MR** The Mirror, **CO** coherence, **SW** switches and controls, **RD** redrawn boards. Boards W26–W34 are new; boards 3, 6, 9, 10, 11 and 15–24 were redrawn (section 37).

> Read this part against the **latest branch** (`claude/serene-franklin-v9ujky`, head `34e1865` at the time of writing). It has the per-mode client files (`public/carnival.js`, `coffins.js`, `graverobbers.js`, `midnight.js`, `mimic.js`, `mirror.js`, `omen.js`, `seance.js`, plus `exorcism.js` and `missions.js`) and the mode registry `public/modes.js`. The shared table is `ring()` in `public/app.js` (around line 1032), and every mode calls it.

## 29. Y — The table: one icon, three forms (W26)

The table is the game's icon. It is always the **ornate astrolabe** from board 5:

- a ticked outer rim;
- a gilt ring that doubles as the phase timer;
- a thin orbit line;
- an inner disc with a ray pattern;
- medallion seats (54 px, a dotted halo, the name in small caps on an ink plate).

It changes **size and role, never style**. In code, that means one renderer: `ring()` gets a `form` option, and modes stop styling `.ring` themselves.

| Form | Size (phone / TV) | Role | Used for |
|---|---|---|---|
| **Seating** | 300 px / 380–640 px | Interaction | Every lobby. Drag a medallion to move a seat (it lifts and the others part). Tap a seat for its sheet: move, make host, remove. The empty chair is a dashed "+ Invite" seat. The disc shows the ready count, and the rim fills as players get ready. |
| **Playing** | 300 px / 640–760 px | Interaction | Any step that targets a person. Seats are the only tap targets (80 px hit areas). A tap selects (gold halo) and the dock confirms. The disc holds the mode's central object; the rim is the timer. |
| **Seal** | 104 px (78 px beside a large object) / a ring around the object on TV | Indicator only | Any step where the mode's own object owns the stage. Dots show whose turn it is (a bright bead), who has sealed (gilt), who is dead (dashed), and you (bone with a gilt ring). One tap opens The board sheet, read-only. A seal never selects a player. |

- **Y1.** Add `form: 'seat' | 'play' | 'seal'` to `ring()` and a `.tseal` style that reuses the table's tokens: ticks, gilt rim, ray disc. Look at `workshop.css` → `.tseal` in the canvas for a working reference.
- **Y1b. The seal in motion (board 26b).**
  - **Whose turn.** At rest, the seal's centre shows the round ("4/7") or the mode's icon. On every turn change, the bead moves to the new seat and the centre flips edge-on (Turn verb, 180 ms) to that player's portrait or letter, with their name on a plate below. It holds for 2.4 s, then flips back to the round.
  - **Your turn.** The centre stays on your medallion with a slow gold pulse until you act.
  - **Simultaneous modes.** Where everyone acts at once, the centre stays on the round and each dot turns gilt as that player seals.
  - **Reduced motion.** A cross-fade replaces the flip.
  - **Tap to open.** Tapping the seal always opens the full table. The table zooms out of the seal's position (320 ms, ease-out, stage dimmed) into a read-only sheet. Closing it, by tapping outside or pinching, shrinks it back into the seal. Minimum hit area: 64 px.
- **Y2. Mode marks** sit on the table; they never replace it:
  - crews as rim arcs or dot colours (Graverobbers, via the existing `crews` option);
  - face-down cards beside the seats (Carnival masks, Midnight cards);
  - plots beside the seats (Coffins);
  - table cards or the Offering in the disc;
  - the Ghost's seat in red (Séance).
- **Y3. Placement rule.** Where the stage belongs to another object, the seal sits **top right of the stage, 78–104 px, always in the same spot**, so "who has acted?" is answered in the same place in every mode.
- **Y4. The playing table comes back for any choice of a person**: accuse, vote, swap, ask, dig a player's plot. Players should never pick a person from a list or a grid of buttons.
- **Y5. On TV** the table is the hero in table modes. In object modes, the seal grows into a ring around the object: seers on the wheel's rim, portraits on the crystal ball's edge.
- **Y6. The ghost tint.** Dead players see the same table in blue-grey (board 21). Their hunches use the playing table, not a button grid.

## 30. Where the table lives, mode by mode (W27)

Legend:

- **T**: the playing table (tap seats).
- **S**: the seal (indicator).
- **O**: the mode's own object, with a seal beside it.

Every mode starts at the seating table.

| Mode | Setup | First look | Main play | The decision | Reveal & end | Key surface |
|---|---|---|---|---|---|---|
| Classic | T seating | O role card | T night target, day accusations | T vote: tap a seat, hold | T: the dead are struck through; front page | The table |
| Missions | T seating, lottery hand | O role card | T: the Leader taps the team | O Approve/Reject, then Succeed/Sabotage cards | T: the mission seal lands in the disc | Table + mission seals |
| Carnival | T seating, empty chairs | T unmasking: masks face up | T: tap a seat's mask, then Swap / Pretend | T: challenge at a seat | T: the mask turns at its seat | Table of masks, Offering |
| Midnight | T seating, 3 table cards | O your card once | T for the waking role; others see the seal | T dawn vote | T: cards turn at every seat | Table of cards |
| Coffins | T seating | O your coffins: bury one | S beside the bid dial | T dig: tap plots on the graveyard table | O coffin opens | Graveyard table |
| Mimic | T seating | O place card or static | O board of places; the lantern on the seal | T accuse | O the Mimic names a place | Board of places |
| Exorcism | T seating, wheel draw | O crystal ball reveal | O ball, words on its rim; seal | T name the Demon: the ball sinks into the disc | T: the password at the table's heart | Crystal ball → table |
| Séance | T seating, the Ghost's seat | O story cards | O visions on vellum; seal | O candle board | O the spirit answers | Candle board |
| Graverobbers | T seating, crew arcs | O coin | O the Undertaker's sign pad | O cemetery: tap a stone; crews on the seal | O grave opens | Cemetery of 25 |
| The Omen | T seating | — | O wheel: predict a face; seers on its rim | O turn back / leave / on | O needle turns once (TV) | The wheel |
| The Mirror | T seating: who reads whom | — | O dilemma card; the glass pairs you | O fate cards with two seals | T arrows across the table (TV) | The Arcana of Dilemmas |

**Acceptance:** for every phase in every mode, the harness asserts exactly one of these is true:

- a `.ring[data-form=play]` is present and is the only element with seat tap targets; or
- a `.ring[data-form=seal]` is present at the top right of the stage, next to the mode's object.

## 31. AT — The key interaction surface of every mode (W29–W31)

Each item says what owns the stage band, how the table appears, and what the dock holds. Boards 29–31 draw one phone per mode at 390 × 844 with the five bands from Part I.

**AT1 Classic.** The playing table all game.

- **Night:** the moonlit (silver) table. The disc shows your role's emblem and a verb ("shield one"). Others' phones show the same sleeping table with no controls and a dim move strip.
- **Day:** accusations draw threads; the vote uses the same seats.
- **Context row:** one vellum slip with the rule that matters now ("The same player can't be shielded twice in a row").
- **Dock:** bone (tap) for night choices, wax (hold) for public votes.

**AT2 Missions.** The table, with the five mission seals in the disc (`.trk` medallions: done gilt, failed red, current glowing) and "3 of 3 on the team".

- The Leader taps seats; others see the picks live.
- **Context row:** team chips and proposal beads (rejections so far).
- **Votes:** Approve/Reject and Succeed/Sabotage are face-down cards in the dock, played with a hold.

**AT3 Carnival.** The table of masks: a small face-down arcana mask beside each seat, and the Offering (coin emblem, Souls count) in the disc.

- Tap a seat's mask. **Swap** and **Pretend** are twin wax buttons, identical by design.
- **Context row:** this turn's claims and challenges as chips, and the Souls line.

**AT4 Midnight.** The silver table of cards: one card beside each seat, the three table cards in the disc.

- Only the waking role can tap.
- **Context row:** the wake order with a bead on the current step.
- The dawn vote reuses the table.

**AT5 Coffins.** The graveyard table (boards 30 and 30b).

- **Coffins are cards, colour-coded so they read at 48 px.**
  - Face down: one lattice back (cross sigil) for every kind, the same brightness for all.
  - Faces fill the card with colour and one large emblem roundel (about 66% of the card's width), with the kind named in small caps:
    - **Gold:** gilt paper with a coin.
    - **Curse:** oxblood with the game's own `curse` emblem (the cracked heart in a sealed starburst, from `public/emblems.js` and `design/codex/art/curse.svg`), in the same roundel as the other icons.
    - **Death:** black and silver with the skull.
  - The kinds are told apart by colour, emblem and word, never colour alone.
- **Ownership is spatial.** Each grave is a small stack of lattice backs on its owner's **spoke**: a gilt line from the seat's medallion toward the centre. The owner's initial is on the top card and the count sits beside it. Tapping a grave or its seat lights both. A finished grave (yours, dug) shows a tick.
- **The bid** sits in the disc ("2 / 4 opened").
- **Context row:** your hand as small colour-coded faces, visible only on your phone. In the round you hold the Death coffin, it sits in your hand with the others.

**AT5b The opening (board 30b).** Every coffin opens in five beats:

1. **Choice:** the grave and its seat light; the top card lifts.
2. **Lift:** the card rises to the centre of the TV and every phone (Deal verb), back up, and a lid creaks.
3. **Held breath:** the card turns edge-on and holds there for 0.6 s in silence.
4. **Face:** the card turns face up.
   - **Gold:** a sunburst, a chime and a bead (Gain).
   - **Curse:** the cracked-heart emblem, a "Cursed" stamp and a low bell; the dig ends and the Digger's seat cracks.
   - **Death:** black and silver with the skull emblem; the music cuts, a long toll sounds, and Death steals a coffin from the Digger, followed by its own short scene (Turn + Fall).

Further rules:

- The face is sent with a reveal time and is rendered only after the turn completes.
- In long digs, opens after the second shorten to 1.2 s. The held breath and the final coffin's full sequence stay.

**AT6 Mimic.** The board of places owns the stage: 4 × 4 vellum tiles, each with an etching and a name.

- Your place is gilt-ringed. Struck places are dimmed and crossed with a rubric line, privately.
- **Seal** top right, with the lantern bead on the asker.
- Your place card sits as a vellum slip above the board.
- **Dock:** `Accuse…` (brings the playing table back) and `Ask a player`.

**AT7 Exorcism.** The crystal ball owns the stage (`.ball` with its stand). The password is written in it, or the Demon's sigil.

- Spoken words orbit the rim as portrait pills.
- **Seal** top right, showing speaking order.
- **Context row:** "Said so far" chips.
- **At Name the Demon** the ball shrinks into the disc of the playing table.

**AT8 Séance.** The candle board owns the stage: Who / Where / Why rows of four etched vellum candidates. A lit candidate gets a small candle **inside its own top-right corner**, a warm inner glow and a gilt ring. Nothing extends past the card's edge, so a candle never overlaps the row above. Ruled-out candidates are dimmed.

- Your visions this round sit above the board as two small vellum cards.
- **Seal:** the Ghost's seat in red, and the seven-candle clock as the rim.
- The Ghost's phone has the hand of visions instead of the board.

**AT9 Graverobbers.** The cemetery owns the stage: 5 × 5 headstones.

- Dug stones keep their crew's colour: lapis for the Moon, gilt for the Sun, oxblood for Death.
- Opened graves become dashed hollows. Your vote has a gilt halo.
- **The sign** ("workshop" and its number) is a plaque above the stones for the whole turn.
- **Seal:** crews as blue and gold dots, with the bead on the digging crew.

**AT10 The Omen.** The ornate astrolabe wheel owns the stage (boards 31, 31b and 9).

- **Rim:** a double gilt rim with fine ticks, gilt lozenges at the three sector borders, and a dotted inner ring.
- **Sectors:** three sectors with engraved rays (Life gilt, Death oxblood, Rebirth blue-grey). Each face is an etched roundel with its name on an ink plaque.
- **The needle:** a tapered gilt blade with a lozenge tip, a crossguard, a crescent-ring counterweight, and an eight-point rosette hub.
- **Seers:** shown as dots on the outer rim (gilt = sealed). There is no separate table.
- **Below the wheel:** three face buttons, each tinted like its sector (Life a gilt wash, Death oxblood, Rebirth blue-grey; the chosen one carries a deeper tint, a gilt-hi border and a glow in its colour), then `Back one / Leave it / On one` with the Influence beads. Each turn button shows its direction: an anticlockwise arrow (↺) on Back one, a still needle-dial on Leave it, and a clockwise arrow (↻) on On one, since the wheel reads clockwise. Their `aria-label`s name the direction.

**AT10b The reveal waits for the needle (rule for every spin).**

- **The spin (3.4 s).** The faces veil and dim, and a light sweeps the rim. The needle slows with a tick on each face. Nothing is lit, nothing sounds a hint, and the ledger and phones say "The wheel turns…".
- **Stopped (0.8 s).** The needle rests and the music drops out: a held breath.
- **The reveal.** Only then does the face light (Stamp verb, the bell), and the ledger counts who foresaw it.
- **Phones** mirror the TV and may not run ahead. The result reaches the client with a reveal time and is not rendered before it.
- **Every other spin follows the same rule:** the Missions lottery hand, the wheel draws (Exorcism, Carnival, Séance, Coffins), the Graverobbers coin, and Midnight's dawn turn.
- **Reduced motion:** the needle jumps to the stop; the hold and the reveal stay.

**AT11 The Mirror.** See section 33.

**AT-common.**

- The stage band is always the largest thing on the phone.
- A "context row" (at most two lines of chips or one slip) may sit between the stage and the tray.
- Nothing else goes on the stage.

## 32. J — Instant news: the herald (W28)

There is **one** place for every instant notification in every mode. It replaces banners across the stage, toasts and centred pop-ups.

**J1. The herald slip (phones).**

- It drops 8 px over the **move strip**: same width, 56 px tall.
- It holds for 2.5 s (4 s for deaths), then folds back into the strip.
- It never covers the stage, the tray or the dock, and taps on the stage keep working while it is shown.

**J2. Kinds** (one component, `notify(kind, payload)` in `public/fx.js`):

| Kind | Look | When |
|---|---|---|
| Your turn | Gilt slip, lozenge, one buzz | It became your move |
| Public | Gilt slip | A phase changes, a vote opens, a turn passes, a reveal you'll also see on TV |
| Bad | Oxblood slip | A death or a failed mission |
| Private | Vellum slip, "Only you · hold to read" | Your secret result. The content is shown only on hold, and the slip goes into the tray with a wax dot. |

**J3. The header keeps it.** The latest herald line replaces the header subtitle for 10 s, in italics.

**J4. Queueing.**

- A newer slip replaces the current one after at least 1.2 s on screen.
- Three or more pending collapse to "3 new · see the Gazette".
- Swipe up dismisses; a tap opens the Gazette at that line.

**J5. Quiet hours.** During discussion, only deaths and the 10-second warning may drop a slip.

**J6. TV.**

- The caption band (the bottom 76 px of the grid) is the herald. News crosses it as a ribbon in the kind's colour, holds, then returns to the plain caption.
- It never covers the table or the ledger.
- Full scenes stay for deaths, reveals and the end only (Part I, P1).

**J7. System news** (TV offline, reconnecting) is a small chip in the header, never a slip.

**J8.** This sharpens Part II's notice ladder (N): Announce = the herald; Inform = the move strip; Private = the vellum herald and the tray dot.

**Acceptance:** no element with `position:fixed` other than the herald, scenes and sheets; and no element covering `.stage` while a non-scene notification is visible.

## 33. MR — The Mirror: the Arcana of Dilemmas (W32, W33, board 6)

Today a dilemma is an italic line in a dark arch with A/B/C rows: it reads like a form. The chosen direction is **the Arcana of Dilemmas**, and it belongs to The Mirror alone. Board 32 is its full style guide (card anatomy, the fates' states, seals and the glass, colour and type, writing rules, motion, do and don't).

**MR1. Every dilemma is a card, and the question is its hero.**

- The card is flat vellum (`#e6d8b6`, no texture behind the text) with a thin inner rule.
- At the top sits **one fixed Mirror sigil** (the hand-mirror emblem, a 52–64 px roundel with a silvered ring), the numeral ("Dilemma · III") and the **title** in blackletter ("The Salesman"), then a short gilt rule. There is no per-dilemma art.
- **The question is the largest and darkest thing on the card:** Garamond 500, upright (never italic), centred, balanced line breaks, about 22 characters a line, colour `#1a120c`.
- Question sizes:

  | Where | Question | Title |
  |---|---|---|
  | Phone ballot | 21 px | 24 px |
  | Phone talk | 25 px | 28 px |
  | TV | 40 px | 44 px |
  | Deal scene | 48 px | 52 px |

- It is dealt with the Turn verb, on the TV and every phone.
- **Optional, later:** a sigil per *pack* (never per dilemma), so adding dilemmas never needs new art.

**MR2. The answers are three fate cards:** text only, no icons.

- The numerals I · II · III sit in a small gilt ring.
- Answer text is Garamond 500, balanced and centred: 16.5 px on phones, 26 px on TV.
- Each card grows to fit up to three lines.
- States:
  - **Idle:** an ink card with a gilt hairline.
  - **Yours:** vellum, a rubric numeral, and the red wax seal.
  - **Theirs:** a silver ring and glow, and the silver seal.
  - **Both:** both seals.
  - **Revealed:** the count in blackletter, plus the portraits of who chose it.

**MR3. Two seals instead of two columns.** Above the fates, a segmented control (`Your seal` / `{name}'s seal`) chooses which seal you are placing. Tap a fate to place it:

- your seal is red wax with your initial;
- your target's seal is silver with theirs.

Both can move until everyone has sealed. One screen and one row replace today's two columns of three.

**MR4. The glass.** A slim mirror band above the card pairs you with the player you read ("V You ──→ Ash A"), silvered blue (the Mirror accent `#6f8aa8`).

**MR5. Talk phase.** A large card, the answers as chips under it, and `Ready to seal` in the dock.

**MR6. Reveal.**

- The fates turn face up, each with its count and the portraits of who chose it.
- The target's choice glows silver; your seal stays where you put it.
- Two result rows: "You read Ash · wrong +0" (oxblood) and "Mara read you · right +2 to Mara" (gilt).
- The TV draws the readings as arrows across the playing table (green right, red dashed wrong, as today).

**MR7. Data and writing.**

- Add `title` to every entry in `public/dilemmas.js`, and to each `i18n/<lang>.content.js` entry as a fifth field. No art or icon fields.
- Extend the i18n test so a missing title fails.
- Writing rules:
  - Question: at most 110 characters, one sentence, no real people or real sensitive topics.
  - Answers: at most 28 characters each, starting with a verb, with the same grammar across all three.
  - Title: "The …", naming the situation rather than an answer.
- Suggested first eight titles: d001 The Midnight Visitor · d002 The Locked Diary · d003 The Fortune Teller · d004 The Dark Dinner · d005 The Borrowed Ghost · d006 The Cursed Castle · d007 The Three O'Clock Raven · d008 The Haunted Night.

**MR8. Code.**

- Rework `dilemmaCard()` and `mirrorMain()` in `public/mirror.js`: the card markup becomes `.card` (the Codex tarot) plus `.fates`.
- The `w-opt` rows become fate buttons with `aria-pressed` and a seal child.
- Remove the dark-arch `.w-card` styles near `styles.css` lines 4647–4760.

## 34. SW — Switches and controls

**SW1. The switch is the game's own**: a hexagon whose short ends take the lozenge's points (top and bottom sides longer), with a lozenge knob.

- **Off:** gilt-2 outline, ink face, ash knob.
- **On:** vellum face, wax knob.

It is already in `styles.css` (`input.switch`, near line 3103, "Switches: a hexagon whose ends take the lozenge's points"). The workshop boards had drawn pill switches; they were wrong and are fixed on boards 16 and 17. **Do not change the game's switch.** Do make sure every on/off control uses it: settings, the room menu (keep screen awake, first-game tips), and Customise.

**SW2. Other controls.**

- Choices between three or more options use `.seg` (text size, sound, filters).
- A value that opens a sheet is italic gilt text with a `›`.
- Never use a native checkbox, radio or select in play screens. A native `<select>` is acceptable only for the language list.

## 35. CO — One family: rules every mode follows (W34)

**CO1. Colour.**

- One accent per mode, used only in three places: the cover window, the backdrop glow, and the table's rim glow.
- Buttons, text and frames stay gilt, bone, vellum and wax in every mode.

**CO2. Light.** There are three lights:

- **Candle** is the default.
- **Moon** (`.night`, silver gilt) is for whatever happens while others sleep: Classic nights, Midnight, the Moon crew's turn.
- **Blood moon** is only for its rule.

**CO3. Type.**

- Blackletter is for titles, headlines, names of things (roles, dilemmas, places, modes) and big numbers. Never use it under 20 px.
- Garamond is for every instruction, answer and button. Small caps are for labels.

**CO4. Commitment.**

- **Bone** (tap) is for a private choice nobody sees you make.
- **Wax** (hold 0.6 s) is for anything public or final.
- **Ghost** buttons are for skip and back.
- Swap/Pretend-style privacy pairs are two identical wax buttons.

**CO5. Surfaces.**

- **Vellum** is for what you hold: cards, slips, the Gazette, story, dilemma and place cards.
- **Ink with gilt frames** (`.fr`) is the world: the table and sheets.
- No grey cards, no white panels, no flat UI tiles.

**CO6. Pictures.**

- Pencil etchings in a sunburst roundel are for things.
- Engraved emblems are for roles and modes.
- No emoji, and no flat icons outside the tray and header.

**CO7. The table:** section 29. **CO8. News:** section 32.

**CO9. A per-mode checklist.** Add it to `ROADMAP.md` and keep it green:

- the cover;
- the key surface as specified in section 31;
- the seal placement;
- herald-only news;
- the ornate table in setup and in every person-choice;
- the mode accent only in the three places;
- the hexagon switches in its settings.

## 36. Order of work for Part III

| Step | Items | Done when |
|---|---|---|
| 1 | Y1–Y6 | `ring()` has three forms; no mode overrides `.ring` styles; the seal sits top right wherever an object owns the stage |
| 2 | J1–J8 | `notify()` is the only path for instant news; no toasts or stage banners remain |
| 3 | MR1–MR8 | The Mirror ships the Arcana: titles and art for all 80 dilemmas, fate cards, two seals, the new reveal |
| 4 | AT1–AT11 | Each mode's phone matches its atlas board in structure (stage owner, seal, context row, dock) |
| 5 | SW1–SW2, CO1–CO9 | Every on/off uses the hexagon switch; the CO checklist is green for all eleven modes |
| 6 | RD (section 37) | The Part II screens are built to the redrawn boards, not the first sketches |

**Harness additions:**

- **table-form check**: every capture has either one `[data-form=play]` ring that holds all the seat targets, or one `[data-form=seal]` ring plus a mode object.
- **herald check**: no `.toast` or stage banner; notices render inside `.herald`.
- **switch check**: no `input[type=checkbox]` without `.switch`.
- **Mirror data check**: every dilemma has a title, art and three icons in every language.

## 37. RD — Redrawn boards, and the evidence for Part III

These boards were redrawn to design par and now supersede their first versions:

| Board | What changed |
|---|---|
| 3 · Host lobby | The initials row became a table seal ("The table ›") |
| 6 · The Mirror ballot | Now the Arcana: the glass, the dilemma card, fate cards with two seals |
| 9 · TV grid | The Omen's wheel is the ornate astrolabe wheel with seers on its rim |
| 10 · Scene sizes | The mini tables are ornate (ticks, gilt rim, ray disc) |
| 11 · TV lobby | The player list became the ornate seating table, "5 of 6 ready" |
| 15 · Picker | A sheet rising over the seating table; framed; ornament dividers; lozenge filter chips |
| 16 · Customise | Hexagon switches; the balance as a gilt scale with lozenge markers and Town/Death emblems; blackletter figures |
| 17 · Room menu | A seal in the header; lozenge tabs; the host box in a red frame; hexagon switches; segmented text size and sound |
| 18 · Rule book | Drop-cap teach panel; three-step strip with emblems; the "What does this do?" sheet over a live (dimmed) table |
| 19 · Gazette | The timeline is a vellum newspaper page with masthead, editions and etched icons; "Where we stand" with a seal; the dossier with a medallion and a seal showing where Tomi sits |
| 20 · Coach | Real night phone with the ornate table; spotlight on the move strip; vellum coach card |
| 21 · Ghost | The ghost-tinted ornate table for hunches |
| 22 · Notices | Announce shows the herald; Ambient shows a seal |
| 23 · Living table | The ornate table at TV size, with mood labels, arrowed threads, the candle in the disc and a red tension rim |
| 24 · Edge states | Framed tiles with an etching each |

New boards:

| Ref | File | Shows |
|---|---|---|
| W26 | `workshop/W26-TableForms.png` | The table's three forms: seating, playing, seal (Y) |
| W26b | `workshop/W26b-SealMotion.png` | The seal's turn flip and its tap-to-zoom into the full table (Y1b) |
| W27 | `workshop/W27-TableMap.png` | Where the table lives, mode × phase (section 30) |
| W28 | `workshop/W28-Herald.png` | The herald on phone and TV, its kinds and rules (J) |
| W29 | `workshop/W29-AtlasA.png` | Classic, Missions, Carnival, Midnight: the table is the game (AT1–AT4) |
| W30 | `workshop/W30-AtlasB.png` | Coffins, Mimic, Exorcism, Séance: an object takes the stage (AT5–AT8) |
| W30b | `workshop/W30b-CoffinsReveal.png` | Coffin arcana and the five-beat opening (AT5b) |
| W31 | `workshop/W31-AtlasC.png` | Graverobbers, The Omen, The Mirror (AT9–AT11) |
| W31b | `workshop/W31b-OmenReveal.png` | The ornate wheel and the reveal-after-stop sequence with timing (AT10b) |
| W32 | `workshop/W32-MirrorPrompt.png` | The Mirror style guide: the Arcana of Dilemmas (MR) |
| W33 | `workshop/W33-MirrorPhone.png` | The Mirror's talk and reveal phones (MR5–MR6) |
| W35 | `workshop/W35-ScaleTable.png` | The table at every size, 3–25 seats, with seals and the lens (section 38) |
| W36 | `workshop/W36-ScaleModes.png` | Full tables mode by mode: tabs on the seat, small tables (section 38) |
| W34 | `workshop/W34-Coherence.png` | The family rules every mode follows (CO) |

Redrawn boards keep their original W-numbers; their PNGs in `workshop/` were re-rendered.

## 38. Y-scale — Many players, few players (W35, W36)

The table must work from 3 seats to 25 (Classic) without scrolling or pinching. One ornate table scales in five steps. `ring()` picks the step from the seat count. On the phone the table is 260–310 px.

| Seats | Step | Medallion | Names | Rings | Hit area |
|---|---|---|---|---|---|
| 3–5 | Intimate | 54 px | always | one, orbit 36% | 80 px |
| 6–8 | Roomy | 54 px | always | one, orbit 40% | 80 px |
| 9–12 | Snug | 44 px | 9 px plates | one | 56 px |
| 13–18 | Two rings | 36 px | outer ring always; inner ring on press | staggered: odd seats on the inner orbit (29%), even on the outer (42%) | 48 px |
| 19–25 | Crowded | 30 px letters | in the **lens** | staggered (31% / 43%) | 44 px + lens |

**Y7. The lens.** From 19 seats, press and slide over the table. The seat under your finger rises above it in an 86 px medallion with its name; lift to select, and the dock names the seat again before you confirm. There is no scrolling, pinching or zooming of the table itself.

**Y8. The seal at any count.** Dots up to 12. From 13 the dots become small rim lozenges (bead, sealed, dead and you still distinct). The centre still shows the count or whose turn it is (Y1b).

**Y9. Player-owned objects at scale** (W36). Things that belong to a player live on their seat:

- With room (up to about 6–8 seats), they sit beside it: Carnival masks, Midnight cards, Coffins stacks on their spokes.
- When crowded, they fold into a **tab on the medallion's shoulder**, always on the same side for every seat:
  - a lattice tab for a mask or card;
  - a numbered tab for a grave, which turns gilt when chosen.
- The chosen one unfolds in the context row below the table (for example, the chosen grave's stack).
- The disc keeps the shared object: mission seals, the Offering, the three table cards, the bid.

**Y10. Per mode at the top end.**

- **Missions 12:** 44 px seats; team chips with a dashed "+n" for missing picks.
- **Carnival 12:** mask tabs.
- **Coffins 10:** numbered grave tabs. At 3, full stacks on spokes.
- **Midnight 12:** card tabs; the table cards stay in the disc.
- **Exorcism 12:** past 6 words, the words leave the ball's rim for a chip list below it; the rim keeps only the current speaker.
- **The Omen 12:** seers as lozenges on the wheel rim.
- **Graverobbers:** crews shown as arcs on the seal.
- **The Mirror:** the glass shows one pair. On TV, 12 thinned arrows, with each pair lit in turn at the reveal.
- **Mimic:** a 44 px table for the lantern.
- **Séance:** the board is unchanged.

**Y11. TV.** The TV always shows every name:

- a 760 px table with 58 px medallions, even at 25;
- two rings from 13 seats;
- the ledger splits into two columns from 16;
- threads thin to 1.5 px past 12.

Threads always draw above the disc and below the seats (z-index 2, between the disc at 1 and the seats at 3; board 23).

**Y12. Small tables.**

- Orbit 36%, full-size medallions, objects shown in full.
- No empty chairs in play; they appear only in the lobby.
- Modes that need more players say so before Start (Z4). Bots fill seats only in practice rooms.

**Harness.** At 3, 8, 12, 18 and 25 seats, assert:

- no seat plates overlap, measured with bounding boxes;
- no page scroll on the stage;
- every seat target is at least 44 px, plus the lens from 19 seats.
