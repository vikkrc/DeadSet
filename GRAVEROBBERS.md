# Dead Set: Graverobbers — rules and game spec (DRAFT)

**Status: design draft for Beta 7 (added 2026-11-17). Nothing here is built.** A team word-association game, a cousin of Codenames, played with **words** or with **icons**. Open points are marked *Decide* with a recommendation.

Midnight in an old cemetery. Two crews of grave robbers serve two rival deities, the **Moon** (the Blue crew) and the **Sun** (the Gold crew). Somewhere under the 25 headstones lie the relics each deity needs to be summoned. Only each crew's **Undertaker** has the burial register and knows which grave holds what. The Undertaker may give one word and one number; the crew digs. One grave belongs to **Death**: open it and your crew is finished.

---

## 1. Players and teams

- **4–12 players**, two crews: **Blue** (the Moon) and **Gold** (the Sun). Each crew needs at least two players: an Undertaker and one digger.
- **The Undertaker** (the existing *Undertaker* card): the crew's captain for this game. They see the **burial register**: every grave colour-coded.
- **The diggers:** everyone else on the crew. They see only the headstones.
- **Setup:** crews are *random* (default) or *chosen* in the lobby (tap a player to move them between Blue and Gold). Undertakers are *random*, *rotating* (default for matches: a different Undertaker every game) or *chosen*.
- Uneven numbers are fine (5 v 4, for example).
- *Decide:* at 3 players, a co-op variant (one Undertaker, two diggers, against the clock). **Recommendation: not at launch.**

## 2. The cemetery (the board)

- **25 graves** in a 5×5 grid, each with a **word** or an **icon** on its headstone (the mode is set in the lobby).
- A coin flip picks the crew that goes first. That crew has **9 relics** under the stones, the other crew **8**.
- **7 empty graves** and **1 Death's grave** make up the rest.
- The layout is random every game. Words and icons are drawn at random from the whole pool, with no categories (§7).

| Grave | Count | When dug up |
|---|---|---|
| Your crew's relic | 9 or 8 | It is yours. Keep digging if you have digs left. |
| The other crew's relic | 8 or 9 | It goes to them. Your turn ends. |
| Empty grave | 7 | Your turn ends. |
| **Death's grave** | 1 | **Your crew loses at once.** |

## 3. A turn

1. **The sign (the Undertaker).** The Undertaker gives **one word** and **one number**, for example *"Ocean · 3"*. The word should connect that many of their crew's graves.
   - **Typed** (default): the Undertaker types the word on their phone and taps the number. It appears on the TV and on every phone, and it works for remote tables too.
   - **Spoken** (option): the Undertaker says the word aloud and only taps the number.
   - **Typed signs are checked:** one word, not a word on the board, not part of or containing one, and not a plain translation trick. A rejected sign says why. Spoken signs are on the table's honour.
   - The other crew's Undertaker stays silent. Undertakers never react to guesses.
   - *Decide:* allow 0 and "unlimited" (as in Codenames)? **Recommendation: numbers 1–9 only at launch.**
2. **The dig (the diggers).**
   - Diggers talk it over, then each one taps a grave on their phone. That is their vote, and they can change it until the vote closes.
   - A digger can also vote **Stop digging**.
   - **The vote closes** when every digger has voted, or when the timer runs out. Missing votes count as nothing.
   - **The most-voted grave is dug up.**
   - **A tie** between graves is settled by a coin flip (the existing coin scene, with a Sun and a Moon on its faces).
   - If **Stop digging** wins the vote, the crew passes (see 4).
   - A crew with one digger: their vote decides alone.
3. **What the grave holds** (a shared scene on the TV and every phone: the spade bites, the lid creaks, the light spills out):
   - **Your relic:** it rises into your crew's altar. If digs remain, the crew votes again. With no digs left, the turn passes.
   - **The other crew's relic:** it flies to their altar. The point is theirs, and so is the next turn.
   - **An empty grave:** dust and moths. The turn passes.
   - **Death's grave:** Death rises. Your crew loses.
4. **Digs:** the crew may dig up as many graves as the number, plus any bonus (below).

## 4. Passing and the bonus dig

- A crew may vote **Stop digging** at any point before its digs run out.
- If it stops with digs left, it earns **one bonus dig** for its next turn: that turn's number + 1.
- **The bonus does not stack.** A crew that stops again, even during a turn that has a bonus, earns one bonus dig at most, on top of that next number only.
- The TV shows the bonus as a lantern beside the crew's altar.

## 5. Winning

- **A crew that has all its relics dug up wins at once,** even if the other crew dug some of them up by mistake.
- **A crew that opens Death's grave loses at once.**
- **Matches:** 1, 3 or 5 games. Every win +1. The Undertaker role rotates each game by default.

## 6. Screens

**The TV: the cemetery at night**
- The 5×5 grid as headstones on a dark hillside under a crescent moon and a low sun on the horizon (the two deities). Each word is engraved on its stone, or each icon carved in pencil relief.
- Dug graves stay open:
  - your relic glows in the crew's colour (lapis blue or gilt);
  - an empty grave is dark earth with a moth;
  - Death's grave is a black, open grave with the skull.
- **Two altars,** one at each side: the Moon's and the Sun's sigils. Each relic found lights one more segment, so a crew's progress is a sigil filling in.
- **The sign banner:** *"OCEAN · 3"* in large type, with the crew's colour, digs left, and the bonus lantern.
- **During the vote,** each grave shows the diggers' small portraits on its stone as they vote. Votes are public; arguing is the point.

**Phones: the same cemetery**
- **The grid** fills the phone: 5 columns, square tiles, no scrolling.
- **View switch** (top right): *Stones* (tiles with the words or icons, large) or *Map* (tiles only, colour and state at a glance). The tiles-only view is for scanning the board quickly; long words get a tap-to-enlarge.
- **Diggers:** tap a grave to vote (your portrait appears on it), tap again to take the vote back, or vote *Stop digging* in the dock. A strip above the grid shows the sign, digs left, and who has voted.
- **The Undertaker:** the burial register over the same grid. Own relics are outlined in the crew colour, the other crew's in theirs, empty graves pale, and Death's grave black with a skull. The register can be hidden with a hold so the phone can be shown to nobody. A sign composer sits in the dock: the word field, number chips 1–9, and *Give the sign*.
- **The waiting crew** sees the same board and the live votes, and argues quietly among themselves.

**Privacy (as everywhere):** the burial register only ever reaches the two Undertakers' phones. Diggers' phones never receive it. Phones run identical flows; no private sound.

## 7. Content

- **Words:** Exorcism's pool has 340 words in 17 categories, in 7 languages. Graverobbers draws without categories. The proper-noun categories (celebrities, cartoons, video games, game heroes, movies, heroes, landmarks) are **off by default**, and a lobby switch adds them.
  - **Target: at least 600 common words per language.** Add new categories for Exorcism too, which benefits both modes: Tools, Body, Weather, Music, Sea, Castle, Kitchen, Professions II, Fabrics and colours, Night and magic, Science, Sports, Buildings, Plants.
  - **Prefer words with two meanings** (*Bark, Crane, Organ, Seal, Bat, Pitch, Key, Spring*), because they make the best signs.
- **Icons:** the current emblem library, about 120 pencil drawings (roles, Dreams, mission cards, parcels, side missions, Séance motifs). Leave out near-duplicates (the shields, the check and cross marks) and the role emblems that only make sense with their names. The icon pool grows with every future emblem.
- **Language:** word mode deals the words in the table's language. Icons are language-free.

## 8. Cast (reused art)

| Character / thing | Art |
|---|---|
| The Undertaker (captain) | the **Undertaker** |
| The diggers | the Coffins **Gravedigger** |
| The Moon crew / the Sun crew | the **Moon** and **Sun** emblems |
| Death's grave | **Death** |
| An empty grave | the **Headstone**, plus a moth (Séance motif) |
| Relics | the **parcel** emblems (key, chalice, feather, watch, compass…) in the crew colour |
| The coin flip | the existing coin scene, re-faced Sun / Moon |
| The cemetery | the new *Forgotten Graveyard* backdrop (Séance) |

**New art (small):**
- the headstone tile in four states (closed, relic, empty, Death);
- the two altars with 9-segment sigils;
- a lapis-blue ink token beside the existing gilt.

## 9. Bots

- **Undertaker bot:** picks a word that links two or three of its graves. This needs the concept tags: the Séance tag vocabulary for icons, and a small tag list per word for words. It avoids anything near Death's grave.
- **Digger bot:** votes for the grave whose tags best match the sign, and stops when no grave scores. Good enough to practise against, and to test the pacing.

## 10. Setup (lobby)

| Setting | Options (default first) |
|---|---|
| Graves show | **Words**, Icons |
| Famous names in the word pool | **Off**, on |
| Crews | **Random**, chosen |
| Undertakers | **Rotating**, random, chosen |
| Signs | **Typed**, spoken |
| Games per match | **1**, 3, 5 |
| Timers | Sign 90 s, each vote 45 s (each can be off) |

## 11. To decide

1. 0 and "unlimited" signs (§3). **Recommendation: no, at launch.**
2. Should the Undertaker see the votes live? **Recommendation: yes,** silently. It is fun to watch, and they must not react.
3. A 3-player co-op variant (§1). **Recommendation: later.**
4. A turn timer for the whole crew instead of each vote. **Recommendation: per vote, 45 s,** with the host able to close a vote early.
