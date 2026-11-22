# Next round — noted, not yet built (2026-11-21)

Collected from a play session on a phone (Classic, Day III and Night III screenshots).
Build in this order. Edge states (Z2, Z3, Z5, Z10) and the "?" explainers (B2/B3) wait until later.

## TB — The phone top bar, rethought

What the screenshots show:

- **Too much in the bar.** By day it runs to four lines: kicker, move, and a sub-line that wraps.
  - The kicker says the day twice: "DAY III · Day III · the floor is open".
  - The sub-line ("When nominations close, each nominee defends themselves.") wraps onto a second line.
- **Text that doesn't fit is cut off.** At night the move line is clipped: "Your night: choose, then sl…".
- **The HOST badge takes too much room.** It squeezes the move and the clock.
- **Notices land on top of the bar.** The herald line ("You are bound to Finch, seated just before you.") pushes into or under the bar. Notices can cover the timer, and they always cover the menu button. Those are the two controls that must stay reachable.

To do:

- **TB1. One fixed layout.**
  - Left: the phase glyph.
  - Middle: two lines at most:
    - a small-caps kicker (phase and number, said once, e.g. "Night III · Actions");
    - the move, in one line.
  - Right: the clock, then the menu button.
  - The kicker never repeats what the move or the phase word says. Drop the step from the kicker when it echoes the phase.
- **TB2. Text that is too long never clips mid-word.**
  - First, shorten the copy so every move fits one line at 360 px (the N rule: under 32 characters, verb first).
  - Where a line is still too long (names, other languages), let it shrink a step, then scroll slowly once (marquee, paused for reduced motion), ending on an ellipsis.
  - The sub-line moves out of the bar into the stage, or is shown only on tap of the move.
- **TB3. No HOST badge.** For the host, the menu button itself turns red (blood ring and glyph). That is the only host mark in the bar. The host's controls stay in the room menu's Host tab.
- **TB4. Notices never cover the clock or the menu.**
  - The herald gets its own slot directly under the bar, full width, pushing nothing and overlapping nothing in the bar.
  - Or it lives inside the middle column, in place of the move, for its 2.5 s, then settles back into the kicker echo.
  - Never over the right-hand cluster (clock and menu).
  - Applies to toasts, herald lines and the paused chip alike.
- **TB5. Check at 360, 390 and 430 px wide, in all seven languages,** for a day, a night, a vote and a long-name case.

## ST — Stage fixes seen in the same screenshots

- **ST1.** At night the centre of the ring repeats the clock ("Shield… 1:28") while the bar shows 1:28 too. Keep the clock in one place (the bar). The centre shows the action only.
- **ST2.** The "Tonight's dream" card is cut off and slides behind the tray when the stage is taller than the screen (third screenshot). It must sit above the tray, collapse to one line, or move into Notes.
- **ST3.** The role label under the ring ("Guardian") floats on its own. Tie it to the ring or the card, or drop it, since My card already says it.

## N — The rest of the notice ladder

- **N1.** Every message in `engine/messages.js` gets a level: Interrupt / Announce / Inform / Ambient / Private.
  - `notify(level, payload)` is the only path.
  - Audit the modes for full scenes that are not on the Interrupt list (Carnival's per-turn cloak scene is the known one).
  - Add a harness count: at most one Interrupt per phase.
- **N2.** Every notice above Ambient also writes a public log line (or a private one for Private), so the timeline holds everything the UI dropped.
- **N4.** Quiet hours during discussion: phones show only Ambient changes and the 10-second warning.
- **N5.** Sound follows the ladder:
  - Interrupt: a sting.
  - Announce: a soft cue.
  - Inform and Ambient: nothing.
  - Private: a paper sound on that phone only.
- **N3 is done** (waiting names who). Extend it to the other modes' waiting lines.

## V2 — The evening card

- A second share card summing up the evening, from the ledger (`room.evening`). Example: "Thursday crowd · 4 games · Death won 3 · MVP: Ilka".
- Contents:
  - the games played with their winners;
  - the top of the ledger with faces;
  - the night's best honour.
- Same 1080×1350 Gazette look and the same "Share without names" option as V1.
- Offered from the ledger (lobby Table tab, end screen) and when the host clears the ledger.

## F1 — Awards for the other modes

At least three honours each, from public events only, one per player per game, with singular and plural lines, translated:

- Missions
- Coffins
- Carnival
- Midnight
- Séance
- Graverobbers
- Mimic
- Omen
- Mirror

They feed the end screen, the share card and the ledger, like Classic and Exorcism.

## Later (as agreed)

- Z2, Z3, Z5, Z8, Z10 edge states.
- B2/B3 "?" explainers.
- X accessibility.

---

# Status after the audit pass (2026-11-22)

Source: `Dead_Set_QA_and_Design_Audit_2026-11-21.md` (rev. 2, 45 findings), plus this file's own list. One commit per finding.

## Done

- **Pass 0, lifecycle and authorisation:**
  - DS-035 (stream teardown; real HTTP/SSE test)
  - DS-036 (moderator kept through rematch)
  - DS-037 (pause survives a restart)
  - DS-038 (ledger survives a restart)
  - DS-039 (retry receipts survive a restart)
  - DS-040 (host-away is pushed)
  - DS-041 (claim votes voided when the host returns)
  - DS-042 (a removed seat's codes die)
  - DS-043 (manual deals only in Classic, Missions and Exorcism; the Exorcism Demon is honoured)
  - DS-044 (clean mode state; all 121 pairs tested)
  - DS-045 (a failed Start anyway leaves readiness alone)
- **Pass A, rules and behaviour:**
  - DS-001 (the win line)
  - DS-002 (settings-aware explainers: Carnival, Exorcism, Mimic, Mirror, Séance)
  - DS-003 (tap/hold copy, 7 languages)
  - DS-004 (per-phase timeout notes)
  - DS-005 (paused tables refuse moves; scenes freeze)
  - DS-006 (failed retries stay failures)
  - DS-007 (rename rules)
  - DS-011 (whole preset names)
  - DS-012 (too big vs too small)
- **This file:**
  - TB1–TB5 and ST1–ST3 (DS-019, DS-020)
  - N3 extended (DS-026)
  - V2 (the evening card)
  - F1 (honours for all 11 games)
- **Pass B–D:**
  - DS-008 (modal focus)
  - DS-009 (accessible names: headings, portrait, story cards, Omen)
  - DS-010 (covered secrets absent; reveal by choice; Mimic starts covered)
  - DS-013 (notices scoped to the game)
  - DS-014 (unread per game)
  - DS-015 (share card accounts for everyone)
  - DS-016 (evening points named and explained)
  - DS-017 (counts follow the registry)
  - DS-018 (inline field errors)
  - DS-021 (quieter host override)
  - DS-022 (part: one introduction for AT)
  - DS-023 (preview below the minimum; rough-guide label)
  - DS-027 (last result kept in the lobby)
  - DS-028 (part: six-character codes, page titles)
  - DS-030 (honest reconnect line)
  - DS-033 (Mirror emblem)
- **Tests added:**
  - `test/http.test.js` (child server, real SSE)
  - `test/contract.test.js`
  - `test/lifecycle.test.js`
  - `test/messages.test.js`
  - `test/hunches.test.js`
  - `test/gazette.test.js`
  - `test/share.test.js`

## Still open

- **N1 / N5:** a `level` on every engine message, one notify path, a harness count of Interrupts per phase, and sound by rung. Quiet hours (N4) already exist.
- **DS-022 (rest):** restructure the Game/Rules tabs so a default host never meets the long form.
- **DS-024:** a synchronised roster/lens for picking targets at 13–25 seats.
- **DS-025:** compact readable boards (Graverobbers grid, Mimic places, Séance cards), and a separate inspect action that does not commit.
- **DS-028 (rest):** in-game quick help and a card reference. This is the "?" explainers, deferred at your request.
- **DS-029:** semantic rendering tests for more messages (DS-011's test is the pattern), and native-language review.
- **DS-031, DS-032, DS-034:** real phones (iOS Safari, Android Chrome), VoiceOver/TalkBack, performance and audio passes, and a reproducible browser suite. These need devices and people; nothing here claims them.
- **§5:** the mode-specific notes beyond the fixes above, e.g.:
  - the Missions proposal summary
  - the Carnival status line
  - Omen's modular-turn explanation
  - The Mirror's two-seal labels
  - Graverobbers' Stones/Map naming
- **Edge states** Z2, Z3, Z5, Z8, Z10.
- **X:** accessibility settings (text size and the rest).
