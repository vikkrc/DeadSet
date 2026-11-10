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

## Beta 0 (step zero): every mode's setup shows only its own options

Before anything new, the lobby must be clean. Each game mode's setup only allows the roles, rules and other settings meant for that mode. With more modes coming, this has to be solid now.

**Leaks found (2026-11-10):**
- **Classic → Custom → "Choose every role":** the "Death" group of role counters lists every Death-aligned role, including the Missions roles (Reaper, Charlatan, Veiled, Stray, Shade). The server already refuses them, so their counters silently do nothing.
- **Trusted moderator → "Assign role":** the dropdown lists every role from every mode. The server rejects wrong picks, but they shouldn't be offered.

**The fix, as a rule for all current and future modes:**
- Every role, rule card and setting belongs to a mode. Each mode declares what it uses: role sets, rule cards, Dreams, sides, twists, timers and story options.
- Every setup screen is built only from that declaration: the role counters, the moderator's role picker, the deck preview, the rule cards, the switches and the timers. The same goes for non-host players' read-only setup summary and the TV lobby.
- The server enforces the same declaration. Settings for another mode are ignored or reset when switching modes, never silently carried into a game.
- Switching modes keeps each mode's own last settings, so going Classic → Missions → Classic loses nothing.
- **Checks:** for each mode, automated tests that nothing from another mode appears in the lobby view or is accepted by the server. Also a browser pass of every lobby screen (host, guest, moderator, TV).

---

## Beta 1: Missions, part 2

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

## Beta 3: Dead Set: Carnival (inspired by Mascarade)

**The pitch:** at a masked ball where Death is a guest, nobody is sure which mask they're wearing.

- **Setup:** everyone starts with a mask (a role card), shown once. Then all masks are face-down.
- **On your turn, do one of three things:**
  - **Swap or pretend:** swap masks with another player, or only pretend to. Everyone's phones show the same shuffle either way, so nobody knows whether it was real.
  - **Peek** at your own mask.
  - **Claim:** "I am the Fortune Teller", and use that mask's power. Anyone who thinks they hold that mask may challenge. Every challenger's mask is revealed, and the wrong claimants pay a penalty.
- **Goal:** collect **Souls** (coins). The first to reach the target wins, unless the holder of the Death mask is the first to steal enough.
- **Masks:** Dead Set characters such as the Mentalist, the Witch, the Ripper and the Jester, each with a power and a sting when claimed.
- **Why phones make it better:** the server tracks every swap, the phone tells you only what you've seen, and the TV animates each two-mask shuffle.
- **Players and length:** 4–12, about 25 minutes. Light, loud and funny.

**To design:** the full mask list and powers, the Soul economy and win target, penalties for wrong claims, rules for fake swaps, balance at each table size, and timers.

---

## Beta 4: Dead Set: Lifeboat (survival with a traitor)

**The pitch:** the ship is gone. Twelve days to land, too few rations, and someone aboard wants nobody to make it.

- **Each day:** a **crisis card** appears, such as a storm, thirst or a shark. Everyone secretly gives cards from their hand (oars, water, rope). The total is shown, but who gave what is not. Fall short and the boat loses supplies or hope.
- **Each night:** the boat may vote someone **overboard**. They become a **ghost in the water** who can still whisper one clue a day.
- **The traitor:** Death wins if the boat sinks.
- **Private goals:** some Living players carry desperate private goals, like "keep the flare gun for yourself", so not every selfish move is evil.
- **TV:** the boat, the horizon, supplies and morale running down.
- **Players and length:** 5–10, about 40 minutes. The most strategic mode.

**To design (a lot):**
- the crisis deck and the hand and supply cards;
- how hope and supplies run down, and the win conditions;
- the overboard vote and ghost clues;
- how private goals work, so selfish play stays ambiguous;
- traitor count by table size;
- the pace across the 12 days.

---

## Beta 5: Dead Set: Séance (a hidden-traitor co-op, a cousin of Mysterium)

**The pitch:** someone was murdered. Their ghost wants to help you, but the ghost can't speak, and a second spirit is lying.

- **Setup:** a secret WHO, WHERE and WHY are drawn from the story cards. One player is the **Ghost** and knows them.
- **Each round:** the Ghost may only send each player one or two **vision cards**, abstract illustrations from a large deck (about 80+).
- **The Deceiver:** a malicious spirit who also knows the answer and sends misleading visions disguised as the Ghost's.
- **Play:** players discuss and lock in guesses for who, where and why.
- **Win:** solve all three within six rounds and the Living win, but to claim the full victory they must then name the Deceiver, like the Reckoning.
- **TV:** the board of suspects, places and motives, with visions laid out as they arrive.
- **Players and length:** 4–10, about 30 minutes. Co-operative and visual.

**To design:** vision card art and count, how many visions each player gets per round, Deceiver powers and limits, partial-credit rules, and difficulty settings.

**Content:** many more WHO, WHERE and WHY cards to avoid repetition. This also affects the other modes: story intros, backdrops, scenes for every location, and all translations. Plan for a large content pass.

---

## Beta 6: Dead Set: Doppelgänger (a cousin of Spyfall)

**The pitch:** everyone at the table knows where you are, except the thing wearing a friend's face.

- **Setup:** every phone shows the same WHERE card plus a personal role there (on the Night Train: the conductor, the stowaway, the chef). The **Doppelgänger** sees only static.
- **Play:** players take turns asking anyone a question. Answers must convince the others you've been there, without being so specific that the Doppelgänger works it out.
- **Win:** at any moment one player can call a vote. Catch the Doppelgänger and the Living win. Accuse a Living player, or let the Doppelgänger guess the location correctly, and it wins.
- **TV:** the location's backdrop blurred, sharpening as time runs out.
- **Players and length:** 4–12, about 8 minutes.
- **Spice it up** beyond the base pitch, e.g.:
  - two Doppelgängers at big tables;
  - a location that shifts halfway through;
  - roles with tiny secret instructions ("mention the weather");
  - a Witness who knows who the Doppelgänger is but must stay hidden.

It benefits directly from Beta 5's bigger WHERE pool (Séance), and reuses the round-and-lobby machinery built for Exorcism (Beta 2).

---

## Beta 7: Dead Set: Midnight (a cousin of One Night Ultimate Werewolf)

**The pitch:** one night, one vote, no second chances.

- **Night:** every role acts once, in a fixed order, guided by the phones:
  - the **Thief** swaps cards;
  - the **Seer** looks at a card;
  - the **Insomniac** checks whether they're still themself.

  Cards change hands secretly, so by morning you may not be what you were dealt.
- **Day:** five minutes of argument, then everyone points at once. If a player who is Death by morning is the most voted, the Living win.
- **Why phones make it better:** the phones are silent narrators that track every swap exactly. The end reveal replays the whole night as a timeline.
- **Players and length:** 4–12, about 10 minutes. It reuses the classic game's roles and art.

**To design:** the role set and wake order, centre cards, special winners such as a Jester, tie rules, and balance by table size.

---

## Beta 8: Dead Set: Council (a cousin of Secret Hitler)

**The pitch:** the town is governed by decrees, and Death is quietly writing them.

- **Each round:** a **Mayor** and a **Magistrate** are elected by public vote.
  - The Mayor draws three decrees, secretly discards one, and passes two.
  - The Magistrate enacts one.
  - The deck is weighted towards **Dark** decrees.
- **Dark decrees unlock Death's powers:** a peek, a forced election, an execution.
- **Blame:** the two officials often blame each other ("he passed me two Dark ones!"), and only one of them is lying.
- **Win:**
  - The Living win with five Lawful decrees, or by executing the Reaper.
  - Death wins with six Dark decrees, or by getting the Reaper elected Magistrate late in the game.
- **TV:** the decree tracks and the election tracker. The Gazette prints every law.
- **Players and length:** 5–10, about 30 minutes.

**To design (thoroughly; this is a very involved mode):**
- election and term rules, and the chaos rule after failed elections;
- deck composition;
- the power track for each table size;
- veto rules;
- the Reaper's knowledge;
- execution and investigation details;
- how blame and claims are recorded;
- balance testing with bots.

---

## Beta 9: Dead Set: Coffins (a cousin of Skull)

**The pitch:** everyone buries something. Some coffins hold gold, one holds a curse. How many can you open?

- **Play:** each player secretly lays coffin cards face down: gold, or their single cursed one.
- **Bidding** goes round the table: "I can open four without finding a curse."
- **The catch:** the highest bidder must open their own coffins first, then other players'. Hit a curse and you lose a card. Win two challenges and you win the game.
- **TV:** every coffin lid creaks open.
- **Players and length:** 3–10, about 10 minutes. Pure bluffing: a quick game between bigger ones.

**To design:** bid and pass rules, choosing which coffins to open, card loss, elimination or ghosts, and a possible Dead Set twist (e.g. a Death coffin that steals a card).

---

## Beta 10: the big final update before version 1.0

Build one of the big modes left out so far (below), or something new worthy of the last big update before the first full version.

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
