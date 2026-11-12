# Dead Set roadmap

Agreed plan. Nothing here is built yet unless marked done. **The roadmap is subject to change.**

Every new mode follows the same order: design the full game loop, rules, logic and mechanics first, agree on them, then implement and test. The descriptions below are the current pitches: starting points for that design work, not final rules.

All modes share the Dead Set family's tools:
- phones as private screens;
- the TV board as the shared stage, with moments, the Gazette, music and backdrops;
- the 7 languages;
- portraits;
- practice bots;
- the trusted-moderator option.

---

## Beta 0 (step zero): foundations (clean setups, synced interludes, a lighter celebration, Hunches at the end)

**Status: built.**

**Clean setups.** Before anything new, the lobby must be clean. Each game mode's setup only allows the roles, rules and other settings meant for that mode. With more modes coming, this has to be solid now.

**Leaks found (2026-11-10):**
- **Classic → Custom → "Choose every role":** the "Death" group of role counters lists every Death-aligned role, including the Missions roles (Reaper, Charlatan, Veiled, Stray, Shade). The server already refuses them, so their counters silently do nothing.
- **Trusted moderator → "Assign role":** the dropdown lists every role from every mode. The server rejects wrong picks, but they shouldn't be offered.

**The fix, as a rule for all current and future modes:**
- Every role, rule card and setting belongs to a mode. Each mode declares what it uses: role sets, rule cards, Dreams, sides, twists, timers and story options.
- Every setup screen is built only from that declaration: the role counters, the moderator's role picker, the deck preview, the rule cards, the switches and the timers. The same goes for non-host players' read-only setup summary and the TV lobby.
- The server enforces the same declaration. Settings for another mode are ignored or reset when switching modes, never silently carried into a game.
- Switching modes keeps each mode's own last settings, so going Classic → Missions → Classic loses nothing.
- **Checks:** for each mode, automated tests that nothing from another mode appears in the lobby view or is accepted by the server. Also a browser pass of every lobby screen (host, guest, moderator, TV).


**Interludes: same timing for everyone, and timers start only after them.**
Today the full-screen interludes overlap with phase timers. Players skip past important votes by accident, or come out of an interlude with too little time left. The fix:
- The server runs one shared sequence of interludes. Every phone and the TV show the same interlude at the same moment, for the same length. Covered interludes include:
  - the first-leader lottery;
  - the story intro;
  - the mission card draw;
  - the team-vote reveal;
  - the card reveal;
  - the mission result;
  - nightfall;
  - the Last Stand naming, the unmasking and the Reckoning;
  - the classic game's dawn, tally, coin toss and the like.
- Shared interludes **cannot be skipped**. Tapping does nothing; a progress bar shows the time left.
- The **next phase's timer only starts when the interlude sequence has finished**. While one is on screen, nothing can be voted on or locked. Deadlines are counted from the end of the sequence.
- **Exception: personal interludes** (your role, your night result, the Candle reveal, a gift, a stolen dream) stay private, and you can tap them away. They never hold up the shared timeline: they queue behind it, or appear in a quiet stretch.
- Late joiners and reconnecting phones jump to the correct point in the current sequence.
- Re-time every interlude so the total wait per round stays reasonable.

**The Living's win celebration is too heavy.**
The particle fireworks make browsers lag, especially on phones. Redesign it to stay exciting but light:
- far fewer particles at once, reused rather than created fresh;
- a hard cap per device, lower on phones than on the TV;
- the frame rate is watched, and effects scale back automatically if it drops;
- more of the spectacle carried by cheap CSS: the gold sunburst, the glow and the letter bounce, with a few well-timed bursts instead of a continuous stream;
- reduced motion respected.

Check that every other celebration (Death, Lovers, Cult, Ripper, Jester) stays smooth on a mid-range phone.

**Show Hunches at the end.**
Hunches are currently only in the end-screen list. Also show them:
- **during the Death vote:** while Death confers in the Reckoning (and after the Last Stand naming), show what the table suspected all game, e.g. a heat ring around each portrait, sized by how many Hunches they got;
- **on the TV's result screen:** a "Who suspected whom" reveal, with arrows from each player to their Hunches across the missions, next to the role reveal.
---

## Beta 1: Missions, part 2

**Status: built** (see MISSIONS.md §2, §11, §12).

- **Side Missions** (lobby switch). Every player is dealt one secret personal objective at random when the game starts, from a large pool. Examples:
  - "Go on three missions."
  - "Never approve a team you're not on."
  - "Hold the Candle once."

  You learn the moment you've succeeded or failed. The result changes the weight of your vote in the Last Stand: more if you succeeded, less if you failed. Each one must be judged automatically from what the game records. They need checking for balance, so that Death players' Side Missions don't leak their side.
- **Hungarian:** rename *Last Stand* to **Utolsó Esély** everywhere.
- **Twins** (lobby switch): two Living players who know each other. A trusted pair the table can lean on, and a prime target for Death to impersonate. Check the core logic and the balance with Twins on, with bot simulations at every table size.
- **Up to 12 players:**
  - Death counts and team sizes for 11 and 12 players.
  - New roles that fit the logic. Ideas:
    - the **Undertaker**: learns how many Death players were on a failed team;
    - a **Missions Jester**: wins alone if named in the Last Stand, or by Death in the Reckoning.
  - Simulate the balance before shipping.

Other Missions ideas kept for later:
- **Branching routes:** the leader picks the next mission from two paths on a map.
- **Spoils and curses:** successes grant the Living one-off boons; failures give Death curse cards.
- **Audience seats:** spectators join by QR code and bet on who the Medium is.
- **Scarred locations:** the backdrop records each failure.
- **Quick game:** 3 missions, first to 2 wins.
- **Seat stand-in:** a bot takes over a lost player's seat and keeps their role.
- **Interrogation** after a failed mission.
- **Delay card:** Death holds back a mission's cards until the next reveal.
- **Loyalty Oath:** stake your reputation on being Living.
- **Suspicion board:** a private notepad on each phone.
- **Vote-pattern view.**
- **Accusation tokens.**
- **Death's whisper signals:** a limited set of preset signals for Death at night.
- **"What really happened" replay** at the end.
- **Themed mission-card decks.**
- **Campaign mode.**
- **Hardcore option.**

---

## Beta 2: Dead Set: Exorcism (based on Chameleon), the first new mode

**Status: built** (see EXORCISM.md).

**The pitch:** the Living know the secret word of the exorcism: the password that would banish the Death among them.

- **Setup:** a category and a secret password are drawn. Every Living phone shows the password. **Death's** phone does not, and Death must bluff.
- **Each round:** each player says one word linked to the password, trying to prove they know it without giving it away to Death.
- **The hunt:** the table then votes on who Death is. If the vote misses, Death wins.
- **Death's last chance:** if Death is caught, it may guess the password. A correct guess still wins for Death.
- **Word grid (setup switch):** an optional 4×4 grid of words in the topic, shown on the TV and openable on every phone. The password is one of them. That makes it fairer for Death and more tense for the Living.
- **Categories:** several, each switchable in setup, with many words each.
- **Language:** the lobby language is **forced on all players** in this mode, because everyone must see the same words.
- **Between rounds:** the end of a round brings everyone back to the same lobby with the same settings, so they can jump straight into a new round.
- **Players and length:** 3–12, about 5–10 minutes per round.

**To design:** the turn order and timing, tie votes, and scoring across rounds if any. Word lists also need translating into every language, per category.

---

## Order of the next betas (reordered 2026-11-12)

Séance needs by far the most new art (84 vision cards, more story cards and backdrops), so it moves back. The lighter modes come first:

| Beta | Mode | Status |
|---|---|---|
| 3 | **Coffins** | Built (COFFINS.md); full visual redesign pending, to the design codex, with owner-made assets |
| 4 | **Carnival** | Rules drafted (CARNIVAL.md) |
| 5 | **Midnight** | Pitch |
| 6 | **Séance** | Rules drafted (SEANCE.md), decisions pending |
| 7 | **Doppelgänger** | Pitch |
| 8 | **Council** | Pitch |
| 9 | **Lifeboat** | Pitch |
| 10 | **To be decided:** a new big game | — |

**Reuse first.** Every mode casts its characters from the existing Dead Set roles, emblems and cards wherever the role fits, so most art is already drawn and the brand stays one family. Each mode below lists its cast and which existing design it reuses. Anything marked **new** needs fresh art.

---

## Beta 3: Dead Set: Coffins (a cousin of Skull)

**Status: rules agreed** (see COFFINS.md).

**The pitch:** everyone buries something. Some coffins hold gold, one holds a curse. How many can you open?

- **Play:** each player secretly buries coffin cards face down: gold, or their single cursed one.
- **Bidding** goes round the table: "I can open four without finding a curse."
- **The catch:** the highest bidder must open their own coffins first, then other players'.
  - A clean dig wins a challenge. **Two challenges win the game**, as does being the last player with coffins.
  - A curse costs you a coffin.
- **Twists:**
  - **Ghost wagers and Revenants:** on by default.
  - **The Death coffin:** on by default, switchable.
  - **Relics:** off by default, switchable.
- **TV:** every coffin lid creaks open.
- **Players and length:** 3–10, about 10 minutes. Pure bluffing: a quick game between bigger ones.

**Cast (reused):**

| Piece | Art |
|---|---|
| Gold | the **coin** emblem |
| The curse | the red wax **seal** |
| The Death coffin | **Death** |
| Ghosts | the **Shade** |
| Revenants | the **Necromancer** |
| The Lantern relic | the **Lantern** mission card |
| The Key relic | the **Key** |
| The Ward relic | the **Ward** mission card |
| The graveyard | the WHERE backdrops |

**New art:** only the coffin itself (a lid and a stack), and the headstones.

---

## Beta 4: Dead Set: Carnival (inspired by Mascarade)

**Status: rules drafted** (see CARNIVAL.md).

**The pitch:** at a masked ball where Death is a guest, nobody is sure which mask they're wearing.

- **Setup:** everyone starts with a mask (a role card), shown once. Then all masks are face-down.
- **On your turn, do one of three things:**
  - **Swap or pretend:** swap masks with another player, or only pretend to. Everyone's phones show the same shuffle either way.
  - **Peek** at your own mask.
  - **Claim** a mask and use its power. Anyone who thinks they hold it may challenge; the wrong claimants pay a Soul.
- **Goal:** collect **Souls**. The first to the target wins, unless a Death claimant reaps enough Souls first.
- **Players and length:** 4–12, about 25 minutes. Light, loud and funny.

**Cast (reused):** every mask is an existing role card:

| Mask | Power |
|---|---|
| **Death** | reaps |
| **Conspirator** | the rich one |
| **Diplomat** | |
| **Gambler** | |
| **Magistrate** | takes the Offering |
| **Ripper** | |
| **Bard** | |
| **Guardian** | |
| **Mentalist** | |
| **Oracle** | |
| **Witch** | |
| **Double Agent** | |
| **Mimic** | |
| **Jester** | |
| **Scapegoat** | |
| **Innocent** | |

- Souls use the **coin** emblem; the Offering uses the **Gift**.
- The **arcana** card faces and the lattice back are reused as the mask cards.

**New art:** only the mask frame over a card, and a shuffle cloak.

---

## Beta 5: Dead Set: Midnight (a cousin of One Night Ultimate Werewolf)

**The pitch:** one night, one vote, no second chances.

- **Night:** every role acts once, in a fixed order, guided by the phones. Cards change hands secretly, so by morning you may not be what you were dealt.
- **Day:** five minutes of argument, then everyone points at once. If a player who is Death by morning is the most voted, the Living win.
- **Why phones make it better:** the phones are silent narrators that track every swap exactly. The end reveal replays the whole night as a timeline.
- **Players and length:** 4–12, about 10 minutes.

**Cast (reused):** each night role is played by the classic role whose name and art already fit it.

| Role | Plays the part of |
|---|---|
| **Death** | the killers; they see each other |
| **Conspirator** | Death's lookout: sees Death but isn't seen |
| **Mentalist** | looks at one player's card, or two of the cards left on the table |
| **Double Agent** | swaps their card with another player's and looks at their new one |
| **Witch** | swaps two other players' cards without looking |
| **Gambler** | swaps their card with a table card, blind |
| **Mimic** | copies another player's role and acts as it |
| **Twins** | wake together and see each other |
| **Insomniac** | checks their own card last; art from the *Insomnia* Dream |
| **Vigilante** | if voted out, takes the person they point at with them |
| **Jester** | wins alone if voted out |
| **Innocent** | no night action |

- The table cards are "the empty chairs" from the home screen.
- **New art:** none needed for the roles.

**To design:** the wake order, the number of table cards, special winners, tie rules, and balance by table size.

---

## Beta 6: Dead Set: Séance (a hidden-traitor co-op, a cousin of Mysterium)

**Status: rules drafted** (see SEANCE.md); decisions pending.

**The pitch:** someone was murdered. Their ghost wants to help you, but the ghost can't speak, and a second spirit is lying.

- **Setup:** a secret WHO, WHERE and WHY are drawn from the story cards. One player is the **Ghost** and knows them.
- **Each round:** the Ghost sends each player **vision cards**: abstract etchings.
- **The Deceiver:** a malicious spirit among the players who also knows the answer and swaps some visions for its own.
- **Win:** solve all three before the séance clock burns out, then name the Deceiver for the full victory.
- **TV:** the board of suspects, places and motives, with visions laid out as they arrive.
- **Players and length:** 4–10, about 30 minutes. Co-operative and visual.

**Cast (reused):**

| Character | Art |
|---|---|
| The Ghost | the **Shade** |
| The players | **Mediums** (the Missions **Medium** card) |
| The Deceiver | the **Charlatan** (the Missions Death card) |
| Cold spots | the **Haunted** mission card |
| The candle clock | the **Candle** |
| The board | the story cards themselves |

**New art (large):**
- 84 vision etchings;
- about 20 more WHO, 15 more WHERE (each with a backdrop) and 15 more WHY cards;
- every translation.

---

## Beta 7: Dead Set: Doppelgänger (a cousin of Spyfall)

**The pitch:** everyone at the table knows where you are, except the thing wearing a friend's face.

- **Setup:** every phone shows the same WHERE card plus a personal role there. The **Doppelgänger** sees only static.
- **Play:** players take turns asking anyone a question. Answers must convince the others you've been there, without being specific enough for the Doppelgänger to work it out.
- **Win:** at any moment one player can call a vote. Catch the Doppelgänger and the Living win. Accuse a Living player, or let the Doppelgänger guess the location, and it wins.
- **TV:** the location's backdrop blurred, sharpening as time runs out.
- **Players and length:** 4–12, about 8 minutes.
- **Spice it up:**
  - two Doppelgängers at big tables;
  - a location that shifts halfway through;
  - roles with tiny secret instructions;
  - a Witness who knows who the Doppelgänger is but must stay hidden.

**Cast (reused):**

| Character | Art |
|---|---|
| The Doppelgänger | the **Mimic** |
| The Witness | the **Witness** mission card |
| Location roles | the existing **WHO** cards, cast as the people found at each WHERE (on the Night Train: the *Night-Shift Nurses*, the *Exiled Royals*, the *Lost Tourists*…) |
| The location | the backdrop and story card |

- Secret instructions reuse the **side-mission** emblems.
- **New art:** none required. It benefits from Séance's bigger WHERE pool (Beta 6) and reuses Exorcism's round-and-lobby machinery (Beta 2).

---

## Beta 8: Dead Set: Council (a cousin of Secret Hitler)

**The pitch:** the town is governed by decrees, and Death is quietly writing them.

- **Each round:** a **Mayor** and a **Magistrate** are elected by public vote.
  - The Mayor draws three decrees, secretly discards one, and passes two.
  - The Magistrate enacts one.
  - The deck is weighted towards **Dark** decrees.
- **Dark decrees unlock Death's powers:** a peek, a forced election, an execution.
- **Win:**
  - The Living win with five Lawful decrees, or by executing the Reaper.
  - Death wins with six Dark decrees, or by getting the Reaper elected Magistrate late in the game.
- **TV:** the decree tracks and the election tracker. The Gazette prints every law.
- **Players and length:** 5–10, about 30 minutes.

**Cast (reused):**

| Character | Art |
|---|---|
| The Mayor | the **Diplomat** |
| The Magistrate | the **Magistrate** |
| The Reaper | the **Reaper** (Missions) |
| Death's followers | **Death** |
| The Living | **Innocent** |
| Investigation | the **Mentalist** |
| Execution | the **Vigilante** |
| Elections and the tracker | the **Approve** / **Reject** tokens and the Missions proposal pips |

- **New art:** two decree cards, *Lawful* and *Dark*, in the edict style already used for Rule cards.

**To design (thoroughly; a very involved mode):** election and term rules, the chaos rule after failed elections, deck composition, the power track by table size, veto rules, the Reaper's knowledge, how blame and claims are recorded, and balance testing with bots.

---

## Beta 9: Dead Set: Lifeboat (survival with a traitor)

**The pitch:** the ship is gone. Twelve days to land, too few rations, and someone aboard wants nobody to make it.

- **Each day:** a **crisis card** appears. Everyone secretly gives cards from their hand. The total is shown, but who gave what is not.
- **Each night:** the boat may vote someone **overboard**. They become a ghost in the water who can still whisper one clue a day.
- **The traitor:** Death wins if the boat sinks.
- **Private goals:** some Living players carry desperate private goals, so not every selfish move is evil.
- **TV:** the boat, the horizon, supplies and morale running down.
- **Players and length:** 5–10, about 40 minutes. The most strategic mode.

**Cast (reused):**

| Character | Art |
|---|---|
| The traitor | **Death** |
| Crew roles | the **Guardian** (the medic), the **Bodyguard** (the strong rower), the **Lantern** keeper (the navigator, from the Missions Lantern), the **Traveling Agent** (the stowaway with supplies) |
| Ghosts in the water | the **Shade** |
| Private goals | the **side-mission** system and emblems |
| Supply cards | the **parcel** emblems (key, compass, candle, watch…) |
| The setting | the **Sinking Ship** backdrop |

**New art:** the crisis deck (storm, thirst, shark…) and the boat.

**To design (a lot):** the crisis deck and the hand and supply cards; how hope and supplies run down, and the win conditions; the overboard vote and ghost clues; private goals; traitor count by table size; the pace across 12 days.

---

## Beta 10: the big final game update before release

**To be decided:** a new big game, either one of the parked modes below or something new worthy of the last big update before the first full version. The same reuse-first rule applies.

---

## Pitched and parked

### Dead Set: The Wake (two rooms and a deadline, a cousin of Two Rooms and a Boom)
**The pitch:** a funeral at a great house, two parlours, and a killer. Before the clock strikes, Death must be in the same room as the Heir.
- **Rooms:** phones split the group into two physical rooms.
- **Hostages:** each round, every room picks a Host who sends some guests across.
- **Sharing:** you can **show your card** to another player, either its colour only (Living or Death) or the full card, by tap-to-share. It's logged privately on both phones.
- **Win:** after the final round, if Death and the Heir share a room, Death wins.
- **Optional characters:** the Gambler, the Bodyguard, the Medium.
- **Players and length:** 8–25, about 20 minutes. The large-party mode.

### Dead Set: Last Words (a word game with a hidden twist, a cousin of Werewords)
**The pitch:** the dying man had one last word. Find it before the candle burns down.
- **Questions:** the Oracle knows the secret word and answers only with phone buttons: Yes, No, Close, Way off.
- **Death** also knows the word and steers the table away from it.
- **Win:** if the word is found, Death may name the Oracle to steal the win. If time runs out, the table may name Death.
- **Players and length:** 4–12, 5–10 minutes.

### Dead Set: Sketches (a cousin of A Fake Artist Goes to New York)
**The pitch:** draw the thing. One of you has no idea what the thing is.
- **Drawing:** everyone except the Forger sees a secret word. Over two rounds, each player adds one continuous stroke to a shared drawing on their phone, and the picture builds up live on the TV.
- **Win:** everyone votes for the Forger. If caught, the Forger still wins by guessing the word.
- **Players and length:** 5–10, about 10 minutes. The comedy mode.

### Dead Set: Contagion (infection spreading, in the spirit of The Thing)
**The pitch:** something got aboard the research station, and every handshake might be the one.
- **Trading:** each round you secretly trade one card with a neighbour. Patient Zero can pass Infected cards, so you may be infected without knowing.
- **Testing:** a few test kits reveal the truth.
- **Win:** at the end, the healthy must quarantine every infected player in one vote. Infected players win with a majority, or if one escapes quarantine.
- **End reveal:** the infection drawn spreading across the table.
- **Players and length:** 6–14, about 20 minutes.

### Dead Set: The Inquest (a cousin of Deception: Murder in Hong Kong)
**The pitch:** the coroner knows exactly what happened, but may only answer in riddles.
- **Suspects:** every suspect shows four "means" cards and four "clue" cards. The Murderer secretly picks one of each from their own hand.
- **The Coroner** knows the answer and can only place markers on scene tiles such as "cause of death" or "time".
- **Win:** each investigator gets one accusation (means plus clue).
- **Extra roles:** an Accomplice and a Witness, with a Reckoning-style ending.
- **Players and length:** 4–12, about 25 minutes. Hard deduction.

### Dead Set: Whitechapel (hidden movement, a cousin of Letters from Whitechapel)
**The pitch:** the Ripper moves through the fog, and the town has to box him in before dawn.
- **Movement:** a map of the location. The Ripper moves secretly on their phone; investigators move openly and search for clues.
- **The informant:** a secret investigator misleads searches.
- **Win:** investigators arrest the Ripper in a room. The Ripper wins by reaching their hideout four nights running.
- **TV:** fog, lantern light and footprints on the map.
- **Players and length:** 3–8, about 35 minutes.

### Dead Set: Hollow Manor (a cousin of Betrayal at House on the Hill)
**The pitch:** you're all friends exploring a house, until the house picks one of you.
- **First half:** co-operative exploration. Room tiles are revealed on the TV (themed on the WHERE locations), with items and omens to find.
- **The Turn:** after a random omen, the house chooses a traitor, or a secret traitor reveals themself. Each side gets different rules on their phone, and the rest is a race.
- **Haunts:** themed to the backdrops.
- **Players and length:** 3–8, about 45 minutes. The most cinematic mode, and the biggest build.
