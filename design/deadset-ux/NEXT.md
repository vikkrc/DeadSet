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
