# Dead Set — consistency pass

A brief for the agent working on `vikkrc/DeadSet`. It lists the design inconsistencies found across the eleven modes, the menus, the TV board and the animations, and says how to fix each one. It is a companion to `design/codex/DESIGN-GUIDE.md`, which stays the source of truth for the look. Where the two disagree, the Codex guide wins on *style* and this document wins on *structure* (shared components, rules, tokens).

```
CONSISTENCY-PASS.md   this file
evidence/             contact sheets and close-ups referenced below (E-numbers)
harness/              the scripts that produced them; rerun them to check your work (section 9)
```

## 0. Ground rules

1. **Presentation and client structure only.** No rules changes. Touch `engine/` only where a finding says so (two string fixes and one optional registry). `npm test` stays green after every step.
2. **One finding per commit**, prefixed with its ID (`C3: one commit grammar for sealed choices`). Each ID below is self-contained.
3. **The privacy rules in the Codex guide still override everything**: identical faces and brightness for secret cards, silent and still night screens, no role-specific motion.
4. **Every new string goes through `t()`** and into all seven dictionaries (`node scripts/i18n-keys.mjs <lang>` lists gaps). Do not rename an English key unless the finding says so; renaming orphans six translations.
5. **Verify with screenshots**, not by reading CSS. Section 9 explains how to replay any mode with bots and capture every phase on a phone and a TV.

## 1. How this was found

- **Code:** branch `claude/serene-franklin-v9ujky` at commit `64445e2` (2026-11-17, "Fixes: Coffins fans and shovel…"). Eleven modes: Classic Dead Set (Standard preset), Missions, Exorcism, Coffins, Carnival, Midnight, Séance, Graverobbers, Mimic, The Omen, The Mirror.
- **Play-through:** a local server, a full match of every mode played by practice bots, with a phone (390×844) and a TV board (1600×900) screenshotted at every phase change and again three seconds later: about 1,100 screenshots. All eleven lobbies were also captured in English, and some in German and Hungarian, along with the home page, invitation, room menu and guide.
- **Automated checks** at every phase (axe-core contrast, rendered text sizes including transforms, tap target sizes, horizontal overflow), plus a static scan of `public/styles.css` (4,859 lines, 413 KB) and the client modules.
- **Not covered:** the live site (deadset.onrender.com was not reachable from the test environment, so the branch is assumed to match it), real devices, Safari, screen readers, remote-chat play, the moderator view, and big tables (15–25). Treat those as still to check.

Severity: **S1** broken or misleading, **S2** visible inconsistency players will notice, **S3** drift that makes the next mode harder to build. Effort: **XS** under an hour, **S** half a day, **M** one to two days, **L** more.

## 2. Summary

| ID | Finding | Sev | Effort |
|---|---|---|---|
| **A1** | Four `@keyframes` names are defined twice; the later one silently replaces the earlier everywhere | S1 | XS |
| **A2** | Exorcism's draw scene says "The séance begins" | S1 | XS |
| **A3** | Coffins: the challenge slip covers the "Your bid" kicker | S2 | XS |
| **A4** | TV toasts sit on top of the board's caption line | S2 | XS |
| **A5** | TV Gazette panel scrolls its masthead away; the deduction grid shows above the title | S2 | S |
| **A6** | Omen end scene changes title from "Cass wins" to "The End" with the same subtitle | S2 | XS |
| **B1** | Each mode sets its own colour mood a different way; five modes have none | S2 | M |
| **B2** | Type has no scale: 69 distinct pixel sizes, 111 rules under 10 px | S2 | M |
| **B3** | Colour has no discipline: 317 hex values and 293 rgba values outside the tokens | S3 | M |
| **B4** | Nine near-identical card components | S3 | L |
| **B5** | Motion has no scale: 83 durations, 14 easing curves, 189 keyframes | S3 | M |
| **B6** | z-index is ad hoc (20 values from −1 to 300) | S3 | S |
| **B7** | Modes are listed by hand in many places; no mode registry | S3 | M |
| **C1** | Committing a choice is a tap in some modes and a hold in others | S2 | S |
| **C2** | Choosing a player is a ring in some modes and a grid or chips in others | S2 | M |
| **C3** | The utility row under the table (My role, Notes, Story…) differs in every mode | S2 | S |
| **C4** | The phase title in the header names the mode in some modes and the phase in others | S2 | S |
| **C5** | Turn counters in Roman numerals reach XX–XXIV | S2 | XS |
| **C6** | End screens: different titles, punctuation and stamps per mode | S2 | S |
| **C7** | Lobby: section order, names and explainer differ per mode | S2 | M |
| **C8** | The first-player draw uses different scenes and copy per mode | S3 | S |
| **D1** | TV text is far too small for a couch | S1 | M |
| **D2** | Phone text below 10 px in card thumbnails and labels | S2 | M |
| **D3** | Tap targets under 44 px in Graverobbers, The Mirror and Séance | S2 | S |
| **D4** | Contrast failures on fading or dimmed slips | S3 | S |
| **D5** | Midnight's day screen shows the timer twice | S3 | XS |
| **E1** | Home page copy only describes Classic and says 5–13 players | S2 | XS |
| **E2** | README describes the old "mourning stationery" identity | S3 | XS |
| **E3** | Guide navigation is a cloud of 19 chips | S3 | S |

Order of work: A (quick fixes) → B7 and B1 (the registry and themes, which later steps rely on) → C (one grammar) → B2, D1, D2, D3 (legibility) → B4, B5, B6, B3 (system cleanup) → E. Section 8 has the step list.

---

## 3. A — Bugs and quick fixes

### A1. Duplicate `@keyframes` names (S1, XS)

When two `@keyframes` share a name, the last one wins for every element that uses the name. Four names collide in `public/styles.css`:

| Name | First definition (intended for) | Later definition (wins everywhere) | Visible effect |
|---|---|---|---|
| `stampIn` | line 721: scale from 1.8, no rotation (`.b-stamp`, `.dock-note.stamped`) | line 1597: rotates to −6° | Seat badges and "Voted …" dock notes end tilted |
| `twinkle` | line 723: opacity and scale (`.stars i`) | line 1414: opacity only (`.bd-star`) | Star fields lose their pulse |
| `unfold` | line 828: 3D fold for the invitation `.letter` | line 1352: `scaleY` for a gift scene | The invitation squashes vertically instead of unfolding |
| `kFlipIn` | line 3311: 3D card turn (Carnival) | line 4035: flat `scaleX` (Coffins) | Carnival's reveals lose their 3D turn |

**Fix:** rename every keyframe with a mode or component prefix (`stamp-in`, `badge-stamp-in`, `bd-twinkle`, `letter-unfold`, `gift-unfold`, `k-flip-in`, `c-flip-in`) and update each `animation` that uses it. Then add a check to `scripts/` that fails when a keyframe name is defined twice, and run it in `npm test` (a ten-line regex scan is enough).

### A2. Exorcism's draw scene says "The séance begins" (S1, XS)

`public/exorcism.js:422` passes `kickerText: t('The séance begins')`. Séance is now a separate mode, so Exorcism players are told they are in a séance (evidence E1, `exorcism-phone`, frames 003–004).

**Fix:** use `t('The exorcism begins')`, add it to all dictionaries, and keep the old key until no dictionary uses it.

### A3. Coffins: the challenge slip covers "Your bid" (S2, XS)

When someone challenges, the dark "Dorian challenges: 'I can open 2.'" slip is placed over the top of the vellum bid card and hides its kicker (E2, third panel). The same stacking appears when two notices queue ("Viktor passes. / Ash passes.").

**Fix:** stack notices in normal flow above the bid card with a gap (or one slip that replaces the previous), never overlapping. Rule for all modes: a notice slip may push content down; it never covers it.

### A4. TV toasts cover the caption line (S2, XS)

On the board, `.is-board .toasts` is fixed at `bottom: 28px`, exactly where the table's caption sits ("Bram: raise above…", "Cass raise above 3, or pass?"). Seen in Coffins, Missions and Carnival (E3, bottom).

**Fix:** on the TV, toasts go into a fixed column in the top-right corner, under the score button, and stack downward, at most three with the oldest fading out. The caption line stays clear. The same rule holds on phones: toasts never cover the dock or the phase header.

### A5. TV Gazette panel scrolls its masthead away (S2, S)

The Gazette column on the TV auto-scrolls. In Missions the deduction grid (rows "Edda / Finch / Result") is drawn above the masthead, so once the column scrolls, the grid fragment sits at the top and the title "The Dead Set Gazette" sits halfway down (E3, top left).

**Fix:**
1. Make the masthead and edition line `position: sticky; top: 0` inside the column.
2. Move the deduction grid into the column as its own section *below* the masthead ("The deduction"), or into a separate panel.
3. Newest edition first, as now; never auto-scroll on the TV (nobody can scroll back). Instead show the latest two editions in full and the older ones collapsed to their headline.

### A6. The Omen end scene changes its title (S2, XS)

At the end of a match of The Omen, the verdict scene first reads "Cass wins" and moments later (after the table returns to the lobby) "The End", with the same subtitle "The seer with the most points wins." and the same Defeat stamp (E1, `omen-phone`, frames 041–042). The title comes from `app.js:2043` (`omenTitle(v)`), which loses the winner once the state is reset for the next match.

**Fix:** freeze the end scene's data when it opens (store `{ title, sub, stamp }` on the moment object) instead of recomputing it from the live view. Check every mode that auto-returns to the lobby (Exorcism, Carnival, Midnight, Séance, Omen, Mirror all showed their verdict after the phase had already changed to `LOBBY`).

---

## 4. B — System drift

### B1. One way to give a mode its colour mood (S2, M)

The Codex defines token themes (day, night, Blood Moon, mist). Modes have since added their own moods, each in a different way:

| Mode | Hook in `app.js` | CSS | Result |
|---|---|---|---|
| Exorcism | `body.mode-exorcism` | full palette override | amethyst |
| Carnival | `body.mode-carnival` | full palette override | wine |
| Coffins | `body.mode-coffins` | full palette override | night-blue for the whole game |
| Séance | `body.mode-seance` | only `--glow` | warm |
| Midnight | `body.mode-midnight` + `body.mn-night` | partial | blue at night only |
| Missions, Graverobbers, Mimic | class toggled | **no CSS** | default day |
| The Omen, The Mirror, Classic | no class | — | default day |

Two problems follow. Coffins uses the night palette all game, and in the Codex the night palette means "private, keep your eyes shut", so the cue is diluted. And the lobby flips colour as the host browses modes, which is a nice preview but only works for three of eleven.

**Fix:**
1. Replace the eleven `classList.toggle('mode-…')` lines with one attribute: `document.body.dataset.mode = v?.mode ?? ''` (only on room and board routes).
2. Give every mode a theme as **token overrides only**, in one block per mode under `/* ── Mode moods ── */`:

```css
body[data-mode='coffins']  { --ink: …; --ink-2: …; --glow: …; --accent: …; }
```

3. Define one new token per mode, `--accent`, used for the mode's signature line-work and glows (amethyst for Exorcism, wine for Carnival, grave-slate for Coffins, candle-amber for Séance, and so on). Keep `--gilt` for ornament everywhere.
4. Keep the night palette for night phases only. Coffins gets its own slate ground instead of reusing night.
5. Every mode, including Missions, Graverobbers, Mimic, The Omen and The Mirror, gets a mood. Suggested: Missions = expedition ochre, Graverobbers = moss, Mimic = static grey-green, The Omen = brass, The Mirror = mercury silver-blue (distinct from night by keeping warm text).
6. Remove the per-component hex overrides that were only there to fake a mood (B3 lists them).

### B2. A type scale (S2, M)

The stylesheet sets **69 distinct pixel font sizes** (4 px to 200 px, including 4.3, 4.4, 4.6, 4.8, 5.4, 5.6, 6.4, 6.5, 7.4…) and **111 rules under 10 px**. Rendered on a phone, Coffins and Séance each had about 30% of all visible text under 11 px; Graverobbers 30%.

**Fix:** define the scale once and use only these:

```css
:root {
  /* phone */
  --fs-label: 11px;   /* caps labels, tracked .2em; the floor for any text on a phone */
  --fs-small: 13px;   /* captions, hints, card subtitles */
  --fs-body: 16px;
  --fs-lead: 19px;    /* italic flavour lines */
  --fs-h3: 24px;      /* blackletter section titles (never below 20px) */
  --fs-h2: 32px;
  --fs-h1: 44px;      /* moment titles */
  --fs-display: 64px;
}
.is-board { /* TV: everything ×1.6, and a 16px floor */
  --fs-label: 16px; --fs-small: 19px; --fs-body: 24px; --fs-lead: 28px;
  --fs-h3: 34px; --fs-h2: 48px; --fs-h1: 72px; --fs-display: 110px;
}
```

Cards are the one exception: they scale with `font-size` in em. Their *rendered* text still obeys the floor. If a card is too small for its title to reach 11 px, it shows the emblem only and drops the title (see B4: `thumb` size).

### B3. Colour discipline (S3, M)

317 unique hex colours and 293 unique rgba values sit outside the 30-odd tokens. The most common stray is `#e9c27a` (28 uses), a near-duplicate of `--gilt-hi`. Others are `#77633f` (16), `#fff3f0` (11), `#f1e4c8` (10) and `#9fd49a` (10, a green used for "right" marks in The Mirror and Graverobbers, which has no token).

**Fix:**
1. Add the missing semantic tokens: `--ok` (right, success) and `--no` (wrong). Use blue and orange rather than green and red so colour-blind players can tell them apart, and add a glyph (✓/✗) so colour is never the only signal. Also add `--accent` (B1) and `--paper-edge` (`#77633f`, the card edge).
2. Replace every literal that is within ΔE 3 of a token with the token. A script can list candidates; review by eye.
3. Allowed literals: `#000`/`#fff` in shadows and masks, and colours inside `emblems.js`/`avatar.js` SVG art.
4. Add a check that fails when a new hex literal appears in `styles.css` outside the token block, with an allowlist comment `/* literal-ok */` for genuine exceptions.

### B4. One card component (S3, L)

There are nine card implementations with nearly the same definition (`width: 6.2em; aspect-ratio: 11/18; padding: 1.05em 0.75em 0.9em; font-size: 9px`): `.card` (Codex), `.dcard` (Dreams), `.kcard` (Carnival), `.ncard` (Midnight), `.scard` and `.vcard` (Séance), `.coff` (Coffins), `.srole`, `.mcard`/`.mrc` (Missions). Each has its own thumb size, flip animation and face rules, which is why their sizes, edges and flips differ between modes (A1 is one symptom).

**Fix:** one `.tarot` component with modifiers, then migrate mode by mode:

| Axis | Modifiers |
|---|---|
| Size | `--thumb` (emblem only, no text), `--small` (title at `--fs-small`), `--hand`, `--hero` |
| Face | `--vellum` (default), `--noir`, `--night`, `--edict`, `--back`, plus a `--suit` custom property for mode accents (Carnival's coloured masks) |
| State | `.is-struck` (crossed out), `.is-chosen`, `.is-dim` |
| Motion | one `tarot-turn` (3D, used everywhere a card turns) and one `tarot-deal` |

Keep the old class names as aliases during migration (`.kcard { @extend }` is not CSS, so add `tarot tarot--small` to the markup and delete the old rules once a mode is moved). Migrate Missions → Coffins → Carnival → Midnight → Séance → the rest.

### B5. A motion scale (S3, M)

The stylesheet uses 83 different durations, 14 cubic-bezier curves (while `--ease` and `--spring` exist) and 189 `@keyframes`. Moments that are the "same" feel different per mode: a card turn takes 0.6 s in Coffins and 0.9 s on the role card; stamps land at 0.45 s or 0.5 s with different overshoot.

**Fix:**

```css
:root {
  --t-tap: 120ms;    /* press feedback */
  --t-ui: 240ms;     /* panels, chips, sheets */
  --t-card: 700ms;   /* every card turn and deal */
  --t-stamp: 500ms;  /* every stamp and seal */
  --t-scene: 900ms;  /* scene titles in and out */
  --t-phase: 1.2s;   /* palette change between phases (exists) */
  --ease: cubic-bezier(.2,.7,.1,1);      /* exists */
  --spring: cubic-bezier(.3,1.6,.5,1);   /* exists; only for stamps and pops */
  --ease-in: cubic-bezier(.55,0,.9,.5);  /* exits */
}
```

Every `transition`/`animation` uses these. Shared keyframes live once at the top (`fade-up`, `pop`, `stamp-in`, `tarot-turn`, `tarot-deal`, `glow-pulse`, `letters-in`) and modes reuse them. Mode-specific keyframes get a mode prefix (A1). Under `prefers-reduced-motion`, one global rule replaces the 21 scattered ones: animations become a 200 ms fade, transitions stay under 200 ms.

### B6. Named layers (S3, S)

z-index takes 20 values (−1, 0–6, 20, 30, 50, 51, 60, 70, 75, 80, 90, 94, 95, 300). Toasts (70) sit below moments (80–95), which is right, but nothing documents why.

**Fix:** define the layers once and use only these:

```css
:root { --z-backdrop: -1; --z-base: 0; --z-raised: 2; --z-dock: 20; --z-header: 30;
        --z-sheet: 50; --z-toast: 70; --z-moment: 80; --z-fx: 90; --z-veil: 95; --z-debug: 300; }
```

### B7. A mode registry (S3, M)

Modes are listed by hand in at least: `server/rooms.js:148` (the rematch list), `app.js` (eleven `mode-…` toggles, the mode families, the dock dispatch, `phaseWord`), `interludes.js` (scene names), `guide.js` and `board.js`. Every new mode has to touch them all, which is how Mimic, The Omen and The Mirror ended up without a theme and with a different end title.

**Fix:** add `public/modes.js` (pure data, importable by the server like `interludes.js`):

```js
export const MODES = {
  classic:  { family: 'hidden', theme: 'day',      phasePrefix: null, title: 'Classic Dead Set', rematchReady: false, draw: null },
  missions: { family: 'hidden', theme: 'missions', phasePrefix: 'M_', title: 'Dead Set: Missions', rematchReady: false, draw: 'lantern' },
  exorcism: { family: 'signs',  theme: 'exorcism', phasePrefix: 'X_', title: 'Dead Set: Exorcism', rematchReady: true,  draw: 'wheel' },
  // … one entry per mode: phase title word (C4), utility row (C3), end stamp rules (C6), lobby sections (C7)
};
```

Then derive the rematch list, `body[data-mode]`, the families, the dock dispatch and the phase title from it. The engine is not changed; the server only reads `rematchReady`.

---

## 5. C — One grammar across modes

### C1. Committing a choice: tap or hold (S2, S)

What a player does to lock in a choice differs by mode, so the same gesture means different things:

| Mode | Lock in a secret choice | Accuse or point at a player |
|---|---|---|
| Classic | tap "Vote {name}" | tap "Accuse {name}" |
| Missions | tap Approve/Reject | — |
| Midnight | hold to swap/look | hold to point |
| Coffins | hold to raise | — |
| Séance | hold to light the candle | hold to name |
| Mimic | — | hold to accuse |
| Graverobbers | tap "Give the sign" | — |
| The Omen, The Mirror | tap "Seal my omen/ballot" | — |

The Codex says wax means commitment, and the README says host advances and big public acts are holds.

**Rule (apply everywhere):**
- **Hold (wax, `btn seal`)** for anything *public and irreversible*: accusing, naming the Demon/Deceiver/Mimic, unmasking, starting the match, advancing a phase, a bid raise that others must answer.
- **Tap (`btn bone`)** for a *secret choice that can still change* until the phase closes: votes, ballots, night actions, predictions, signs. After the tap, show the stamped dock note ("Sealed · you can change it until everyone is in") exactly as Classic does.
- So Midnight's night actions and vote become taps (they are secret and changeable until the step ends). Coffins' raise stays a hold (public). The Omen and The Mirror stay taps but get the stamped note. Classic accusation becomes a hold (public, one per day).
- One helper decides: `commitBtn(kind, label)`, where `kind` is `'public'` or `'secret'`. Remove direct `btn(…, 'btn-blood')` calls for commits.

### C2. Choosing a player: always the ring (S2, M)

The guide promises "To nominate, vote, aim, kill, protect or pick a dream partner, you tap a seat." That holds in Classic, Missions, Coffins, Carnival and Mimic. Elsewhere players are chosen from:
- a 2-column portrait grid (Midnight's Mentalist, Witch and Double Agent steps, and Midnight's vote, E4);
- text chips (Séance's "Edda Where / Dorian Who" reader chips, Exorcism's speaker chips);
- no table at all (The Omen and The Mirror show who you read only as a pair of portraits).

**Fix:** every pick of a player uses the table ring with the standard seat states (choosable breathes, chosen is vellum, the rest dim). Midnight's table cards sit in the ring's centre disc as three face-down cards, which can be picked too. Chips can remain as a *secondary* list for big tables, but they must mirror the ring's selection. In The Mirror, draw the reading pairs on the ring as arrows (the TV already does).

### C3. One utility row (S2, S)

The row of small buttons under the table differs per mode:

| Mode | Row |
|---|---|
| Classic, Missions | My role · Notes · Story |
| Exorcism | My role · Notes |
| Coffins | My role · Notes (lottery only) |
| Séance | The board · Notes |
| Midnight | Cards in play · Notes |
| Graverobbers | Stones/Map tabs · Hide the register |
| Mimic | Hide my card |
| The Omen, The Mirror | none |

**Fix:** one `utilityRow(v)` with fixed slots, in this order, each present only when the mode has it: **My card** (always; "My role" and "Hide my card" become this, opening the card sheet), **The board** (mode reference: deck in play, places, mission track), **Notes** (every mode that has hidden information), **Story** (modes with WHO/WHERE/WHY). The same icons, height (44 px) and position in every mode, defined per mode in the registry (B7).

### C4. The phase title in the header (S2, S)

The big word in the phone header and TV header is sometimes the phase and sometimes the mode:

- **Phase:** Classic ("Day II", "Night I"), Missions ("Mission IV", "The End"), Midnight ("Midnight", then "Dawn").
- **Mode or place:** Exorcism ("Exorcism"), Carnival ("The Ball"), Séance ("The séance"), Graverobbers ("The cemetery"), Mimic ("The Mimic"), The Omen, The Mirror.
- **Unit:** Coffins ("Round").

The subtitle then carries the step in the second group ("Swap, peek or claim", "The sign").

**Rule:** the header word is the **unit of play with its number** (Day II, Night II, Mission IV, Round III, Turn XII, Dilemma 3), and the subtitle is the **step** (Discussion, The bidding, Seal your ballot). The mode's name belongs in the room menu, the lobby and the TV's top-left wordmark line ("Dead Set · Exorcism"), not in the header. Set the word per mode in the registry. Keep "The End" for the final phase in every mode.

### C5. Long Roman numerals (S2, XS)

Turn counters use Roman numerals and grow long: "The Ball XXIV", "The cemetery XX", "Round XII" (E1). At superscript size, XXIV is hard to read.

**Fix:** Roman numerals only for counts that stay small and are part of the story (Day, Night, Mission, chapter, card numbers ≤ XXI). Use plain Garamond figures for turn and round counters, which can run high ("Turn 24"). Put the rule in `roman()`'s doc comment.

### C6. End screens (S2, S)

Verdict screens differ in title form, punctuation and stamps (E5):

| Mode | Title | Stamp |
|---|---|---|
| Midnight | "The Living win." (full stop) | Victory / Defeat |
| Séance | "A hollow victory." (full stop) | Defeat |
| Exorcism | "The Demon wins" | Defeat |
| Mimic | "The Mimic wins" | Victory |
| Carnival, Omen, Mirror | "{name} wins" | Defeat |
| Missions | "The Reaper names / Ash" | "The Medium" |
| Omen (after reset) | "The End" | Defeat (A6) |

**Rule:**
- Title: **"{Side or name} win(s)"**, no full stop, in every mode. A special outcome goes in the kicker ("A hollow victory", "Their own Death coffin"), not in the title.
- Subtitle: one sentence explaining why, with a full stop.
- Stamp: **Victory** or **Defeat** for the viewer, in every mode, every time; spectators and the TV get no stamp. Rank-based modes (The Omen, The Mirror, Carnival, Coffins) stamp **Victory** for winners and show the viewer's place ("3rd of 6") instead of Defeat for everyone else.
- One `verdictScene({ kicker, title, sub, stamp, emblem })` builds them all, with the mode's emblem in the ray burst.

### C7. Lobby structure (S2, M)

Every lobby has the same top (code, ring, portrait, start button, mode list). After that, the structure varies (E6):
- Most modes open with "How {mode} works" (a numbered explainer); **Classic and Missions have none**.
- The deck preview sits above the explainer in Missions, in the middle in Carnival and Midnight, at the end in Coffins, and is absent in The Mirror (which shows a sample dilemma instead).
- Section names differ for the same idea: "The masks", "The table", "Winning", "Twists", "The ball", "The Demon", "The words", "Setup".
- "Same room / Remote chat" appears in every mode, including ones with no chat behaviour.
- "Music style" appears in every mode, but in Classic it sits next to an extra "Atmospheric score" toggle.

**Fix:** one lobby order for every mode, built from the registry:

1. **The mode** (family list, as now).
2. **How it works**: numbered explainer, for every mode including Classic and Missions.
3. **The deck**: what will be dealt for this player count (cards, masks, places, dilemmas).
4. **Rules**: the mode's own switches, under that one heading.
5. **The table**: table language, music (score on/off and style together), backdrops, Same room/Remote (only where remote changes anything).
6. **Timers**, collapsed.

Show "Same room / Remote chat" only for modes where remote play changes something, and put the score switch and the music style in one row for every mode.

### C8. The first-player draw (S3, S)

The wheel scene is shared by Missions, Exorcism, Coffins, Carnival and Séance, with different kickers ("Before the first mission", "The masks turn face down", "Before the first burial", "The séance begins" (A2), "The séance"). Graverobbers uses a coin; Mimic deals a fan of cards; Midnight, The Omen and The Mirror have no draw. That variety is fine, but each scene uses its own kicker style and timing.

**Fix:** keep the variety of scenes, but standardise:
- the kicker pattern **"Before the first {unit}"** for every draw;
- the title **"Who {verb} first?"**;
- one duration (`mlottery`, 8.6 s) and the same result line ("{name} {verbs} first").
- Put `draw: 'wheel' | 'coin' | 'fan' | null` in the registry.

---

## 6. D — Legibility on phone and TV

### D1. TV text is too small (S1, M)

The TV is read from a sofa three metres away. At 1600×900, the share of visible TV text under 16 px was: Classic 73%, Coffins 73%, Séance 63%, Missions 62%, The Omen 53%, Carnival 45%, Midnight 42%, The Mirror 38%. The smallest text was 6–9 px: seat names (`.tok-name`, 12.6 px), Gazette entries (`.ev`, 14 px, and chips at ~10 px), Coffins' coffin labels (`.cf-o`, 8.8 px), card signatures (`.sig`, 6 px) and card names in Séance's rows (`.nm`, 7 px) (E3, E7).

**Fix:**
1. Apply the TV type scale (B2) with a **16 px floor** at 1600 wide. Use `clamp()` so 1920 and 4K boards scale up rather than staying fixed.
2. **Seat names on the TV**: `--fs-label` (16 px), with the medallion at least 84 px.
3. **The Gazette on the TV** shows only headlines and one line of chips per edition at `--fs-small` (19 px). Full detail stays on phones.
4. **Card thumbnails on the TV**: if a card is shown smaller than 110 px tall, show its emblem and drop all text (B4 `--thumb`). Séance's three rows of 6–10 cards are the main offender: on the TV, show each row's cards larger, with the struck cards collapsed to a count ("3 ruled out").
5. Check every TV board at 1920×1080 and at 1280×720 (a laptop on a table).

### D2. Phone text under 10 px (S2, M)

The worst cases measured on the phone: Coffins card labels and seat names (2–3 px rendered, inside the scaled fan of coffins), Séance card names (4.3 px), Carnival mask signatures (5.5 px), Mimic arc numbers (5.1 px), Graverobbers' small grave words (6.2 px), The Omen's ledger (8.5 px).

**Fix:** same rule as the TV: a card or token too small for 11 px text shows its emblem or colour only. Coffins' fans above each medallion show the coffin backs and a count, not labels. Séance rows use `--small` cards in a horizontal scroller (with a fade at the edge, like the portrait picker) rather than shrinking six cards into one row.

### D3. Tap targets under 44 px (S2, S)

Measured on a 390 px phone:
- **Graverobbers:** the number picker 1–9 (about 35 px circles) and the Stones/Map tabs.
- **The Mirror:** the A/B/C answer rows (`.w-opt`), about 36 px tall.
- **Séance:** the reader chips (`.sg-chip`).

**Fix:** 44 px minimum height. The number picker becomes a 3×3 grid of 48 px buttons or a −/+ stepper like Coffins' bid. Answer rows get 48 px height with the letter in a 32 px disc.

### D4. Contrast on dimmed slips (S3, S)

axe-core flagged Carnival's turn slip while it is dimmed (kicker at 1.56:1, title at 2.4:1) and a Coffins TV notice (1.31:1). These are fading or "inactive" states, but players still read them.

**Fix:** dim an inactive panel by lowering its *border and background*, not the text. Text stays at 4.5:1 or better (3:1 at 24 px+) in every state. When something must look inactive, use `--ash` text (which passes 4.5:1 on ink), never opacity below 0.7 on text.

### D5. Midnight's timer appears twice (S3, XS)

Midnight's day screen shows the countdown in the header (4:59) and again in the middle of the page (E4). Every other mode shows it once, in the header (phone) or the top right (TV), plus the ring's burning edge.

**Fix:** remove the inline timer. If a mode needs a bigger countdown in the last minute, it is the header timer that grows.

---

## 7. E — Home, guide and documentation

### E1. Home page copy (S2, XS)

The home page says "Hidden roles. Secret votes. Find them before they outnumber you." and "5–13 players · one phone each · no app to install" (`app.js:838`, `app.js:855`). Both describe Classic only; the modes now run from 3 players (Exorcism, Coffins) to 25 (Custom).

**Fix:** a tagline that covers the collection ("Eleven games of bluff and deduction. One phone each.") and the foot line "3–25 players · one phone each · no app to install". Ideally the foot line reads the range from the registry (B7). New keys in all seven dictionaries.

### E2. README identity (S3, XS)

`README.md` still describes the "mourning stationery" identity with Instrument Serif and Instrument Sans, and lists only Missions and Exorcism as extra modes. Update the *Interface* paragraph to the Codex (link `design/codex/DESIGN-GUIDE.md`) and list all modes with links to their rule files.

### E3. Guide navigation (S3, S)

The guide's navigation is a wrapping cloud of 19 italic chips (E8). It is hard to scan, and the mode chips all repeat "Dead Set:".

**Fix:** two groups. **The basics**: Basics, A round, Winning, Core roles, Extended roles, Dreams, Rule cards, Night order, Phones, Other sides. **The modes**: grouped by family, as in the lobby, without the "Dead Set:" prefix. On a phone, a sticky select menu; on desktop, a left column. Use the same "Back" control as the room menu (the guide's "◇ Back ◇" button looks different from every other back control).

---

## 8. Order of work

| Step | IDs | Done when |
|---|---|---|
| 1 | A1–A6, D5, E1, E2 | Each fix shows in the screenshot it was found in |
| 2 | B7 | `public/modes.js` exists; rematch list, mode classes, families and dock dispatch read from it; tests pass |
| 3 | B1 | `body[data-mode]` drives every mode's mood; Coffins no longer uses the night palette by day; all 11 modes have a mood |
| 4 | C1, C4, C5 | One commit grammar, one header rule, Arabic figures for long counters |
| 5 | C2, C3 | Every player pick is on the ring; one utility row |
| 6 | C6, C8 | One verdict scene and one draw-scene pattern |
| 7 | C7 | Every lobby in the same order; start button only in the dock |
| 8 | B2, D1, D2, D3, D4 | Type scale in place; checks in section 9 pass |
| 9 | B4 | `.tarot` replaces the nine card classes, one mode per commit |
| 10 | B5, B6, B3 | Motion, layer and colour tokens; the guard scripts run in `npm test` |
| 11 | E3 | Guide navigation |

## 9. Checks and how to rerun them

`harness/` has the scripts that produced the evidence. They need the preinstalled Playwright and `npm i axe-core`.

- `run.mjs <spec.json>`: creates a room per entry, sets the mode, adds bots, opens a phone and a TV, starts the match, advances when it stalls, and screenshots both screens at every phase change and three seconds later. With `"audit": true` it also runs `audit.js` at every phase and writes `_audit.json`.
- `audit.js`: rendered font sizes (counting transforms), tap targets under 44 px, horizontal overflow, axe-core contrast.
- `sheet.py <mode…>`: de-duplicated contact sheets per mode.
- `cap2.mjs`: home, guide, invitation, room menu and every lobby in English, German and Hungarian.

Spec files `s1.json`–`s3.json` and `a0.json`–`a2.json` cover all modes. Run the server with `DEADSET_DATA= PORT=3123 npm start` first. The scripts send `x-forwarded-for` headers to stay under the room-creation rate limit.

**Acceptance for the whole pass** (rerun the audit and compare with these baselines):

| Check | Baseline (this audit) | Target |
|---|---|---|
| Phone text under 11 px, share of characters | 3–30% per mode | 0% outside cards; cards show emblem only below 11 px |
| TV text under 16 px, share of characters | 32–73% per mode | under 5% (captions only), nothing under 14 px |
| Tap targets under 44 px | 11 (Graverobbers), 24 (Mirror), 5 (Séance) | 0 |
| axe contrast failures | 4 | 0 |
| Distinct font sizes in `styles.css` | 69 | only the scale tokens, plus em sizes inside cards |
| Hex literals outside tokens | 317 | allowlisted only |
| Duplicate keyframe names | 4 | 0 (enforced by a test) |
| Modes with a mood | 5 of 11, inconsistently | 11 of 11 via `body[data-mode]` |
| `npm test` | green | green |

And by eye, for each mode at 390×844 and 1600×900: nothing overlaps; every circle and burst is whole; the header word follows C4; commits follow C1; the verdict follows C6; the lobby follows C7.

## 10. Evidence index

| Ref | File | Shows |
|---|---|---|
| E1 | `evidence/sheets/<mode>-phone.png`, `<mode>-tv.png` | Every distinct screen of a full bot match, per mode |
| E2 | `evidence/closeups/phone-four.png` | Missions reveal; Coffins challenge slip over "Your bid" (A3); Graverobbers number picker (D3) |
| E3 | `evidence/closeups/tv-four.png`, `tv-toast.png` | Gazette masthead scrolled away (A5); small TV text (D1); toasts over the caption (A4) |
| E4 | `evidence/sheets/midnight-phone.png` | Portrait grid instead of the ring (C2); timer twice (D5) |
| E5 | `evidence/sheets/*-phone.png`, last frames | End screens (C6) |
| E6 | `evidence/closeups/lobbies.png`, `evidence/lobbies/*` | All eleven lobbies side by side (C7) |
| E7 | `evidence/audit/<mode>/_audit.json`, `audit_summary.json` | Measured sizes, taps, overflow and contrast per phase |
| E8 | `evidence/closeups/home-menu-guide.png`, `evidence/lobbies/home-*`, `guide-*` | Home copy (E1); guide chips (E3); room menu |
