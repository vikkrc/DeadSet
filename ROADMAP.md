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

## Mode families (the lobby groups modes by core mechanic)

| Family | Modes | Core mechanic |
|---|---|---|
| **Hidden Allegiances** | Classic Dead Set, Missions | Secret sides; a town hunts its killers over days and votes |
| **Changing Hands** | Carnival, Midnight | Role cards change owners in secret; memory and bluff |
| **Signs & Riddles** | Exorcism, Séance, Graverobbers (Beta 7), Mimic (Beta 8) | One side knows the secret and may only hint |
| **Bluff & Wager** | Coffins | Bury, bid and dare: a quick game of nerve |

New modes join a family (or open a new one) when they are pitched. The twelve modes parked from the 2026-11-17 spec (below) suggest four more: **Reading the Room** (The Omen, The Mirror), **Quiet Hands** (The Vigil, The Vault), **Bargains & Betrayals** (Inheritance, The Pact) and **Tall Tales** (The Gazette, Confessions). The Ritual joins Hidden Allegiances; Treasure Hunters, The Black Market and Standoff join Bluff & Wager.

## Order of the next betas (reordered 2026-11-12; Graverobbers inserted as Beta 7 on 2026-11-17; the full plan of 22 modes set on 2026-11-17)

Séance needed by far the most new art, so it moved back behind the lighter modes. From Beta 8 on, the order follows four rules: fully specified, low-art modes first; modes that share machinery are built together in one beta; every beta brings a different kind of game; and the modes that still need real design work (Council, Lifeboat) go last, so their design and bot balancing can run alongside the earlier betas.

| Beta | Mode(s) | Why together / why now | Status |
|---|---|---|---|
| 3 | **Coffins** | | Built (COFFINS.md); redesigned to the Codex |
| 4 | **Carnival** | | Built (CARNIVAL.md) |
| 5 | **Midnight** | | Built (MIDNIGHT.md) |
| 6 | **Séance** | | Built (SEANCE.md) |
| 7 | **Graverobbers** | | Built (GRAVEROBBERS.md); three crews added |
| 8 | **Mimic** | No new art, 8 minutes, nearly designed; reuses Exorcism's rounds and the WHERE cards | In progress (MIMIC.md) |
| 9 | **The Omen + The Mirror** | Opens *Reading the Room*. Both are sealed simultaneous ballots with scored rounds: build a reusable kit (sealed ballot, round loop, score ledger, synced reveal) that half the later modes use | Full spec |
| 10 | **The Pact + Standoff** | Pairs and targets around the table: arrows between seats, simultaneous reveals | Full spec |
| 11 | **Treasure Hunters + The Vigil** | The first push-your-luck game and the first fully co-operative one; quick, very different moods | Full spec |
| 12 | **Inheritance + The Black Market** | Coin economies, a rotating Executor or Seller, allocation and bid controls, hidden values revealed at the end | Full spec |
| 13 | **The Ritual + Last Words** | Mostly reuse: Missions machinery for the Ritual, the word pool for Last Words | Full spec / pitch |
| 14 | **The Gazette + Confessions** | Opens *Tall Tales*. Easy engines, heavy content: vetted question and case banks in 7 languages (start writing them during Betas 8–13) | Full spec |
| 15 | **The Vault** | A puzzle solver and 30+ solver-checked chambers | Full spec |
| 16 | **Sketches** | The only new technology: a live shared drawing canvas on phones and TV | Pitch |
| 17 | **Council** | The deepest hidden-role game; design it thoroughly in parallel first | Pitch, needs design |
| 18 | **Lifeboat** | Survival with a traitor; a lot still to design | Pitch, needs design |
| 19 | **The big final update:** The Wake (8–25 players) or Hollow Manor | The last big game before release | Pitch |

**Kept parked:** Contagion, The Inquest and Whitechapel. They overlap with modes the game has or will have (Midnight, Séance, Mimic), or need a map engine.

**Between betas:** the Missions feature ideas (campaign mode, branching routes and the rest, see Beta 1) are improvements to an existing mode and fit between betas.

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

**Status:** built. The full rules, wake order, table cards, winners and recommended decks are in MIDNIGHT.md.

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

**Status: built** (see SEANCE.md). The 84 visions are generated from a pencil motif library; the larger story-card pool is still to come.

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

## Beta 7: Dead Set: Graverobbers (a cousin of Codenames, with words or icons)

**Status: built** (see GRAVEROBBERS.md).

**The pitch:** midnight in an old cemetery. Two crews of grave robbers, the Blue crew of the **Moon** and the Gold crew of the **Sun**, race to dig up the relics that will summon their deity. Only each crew's **Undertaker** knows which grave holds what, and may give one word and one number. One grave belongs to **Death**.

- **Board:** 25 graves in a 5×5 grid, each with a **word** or an **icon** on its headstone (set in the lobby). The starting crew (coin flip) has 9 relics, the other 8; 7 graves are empty; 1 is Death's.
- **The Undertaker** (captain, the existing *Undertaker* card) sees the burial register: every grave colour-coded. They type (or say) one word and tap a number: *"Ocean · 3"*.
- **The diggers** talk it over and each vote for a grave on their phone, or vote to stop. The most votes digs it up; a tie is settled by the coin (Sun / Moon faces).
  - **Their relic:** keep digging while digs remain.
  - **An empty grave:** the turn ends.
  - **The other crew's relic:** it is theirs, and so is the turn.
  - **Death's grave:** instant loss.
- **Stopping early** earns one bonus dig next turn (it never stacks).
- **Win:** all your relics dug up first.
- **Crews and Undertakers:** by seat (default: the lobby table shows each crew's part of the table, and moving a player changes their crew), random, or chosen. Undertakers rotate between games in a match.
- **Three crews (option, 6–12 players):** the **Stars** (amethyst) join the Moon and the Sun. The table is cut into thirds; 7 relics for the first crew, 6 for each of the others, 5 empty graves. Death's grave puts the crew that opens it out, and the others dig on.
- **TV:** the cemetery at night, headstones engraved with the words or carved with the icons, open graves showing what they held, two altars whose sigils fill as relics are found, the sign in large type, and the diggers' votes appearing on the stones live.
- **Phones:** the same 5×5 grid, filling the screen, with a switch between *Stones* (words or icons on the tiles) and *Map* (plain tiles, colour and state at a glance). Tap to vote. The Undertaker's grid shows the burial register and a sign composer.
- **Players and length:** 4–12, about 15 minutes. Team play, loud and quick.

**Content:**
- **Words:** drawn at random with no categories, from Exorcism's pool (340 words in 17 categories, 7 languages). It grows to at least 600 common words per language, with new categories that Exorcism also gains. Famous-name categories are off by default.
- **Icons:** the current emblem library (about 120 pencil drawings).

**Cast (reused):**

| Character / thing | Art |
|---|---|
| The Undertaker (captain) | the **Undertaker** |
| The diggers | the Coffins **Gravedigger** |
| The two deities | the **Moon** and **Sun** emblems |
| Death's grave | **Death** |
| Relics | the **parcel** emblems, in the crew colour |
| The cemetery | the *Forgotten Graveyard* backdrop |

**New art (small):** the headstone tile in four states, the two altars, a lapis-blue ink beside the gilt.

---

## Beta 8: Dead Set: Mimic (a cousin of Spyfall; formerly Doppelgänger)

**The pitch:** everyone at the table knows where you are, except the thing wearing a friend's face.

- **Setup:** every phone shows the same WHERE card plus a personal role there. The **Mimic** sees only static.
- **Play:** players take turns asking anyone a question. Answers must convince the others you've been there, without being specific enough for the Mimic to work it out.
- **Win:** at any moment one player can call a vote. Catch the Mimic and the Living win. Accuse a Living player, or let the Mimic guess the location, and it wins.
- **TV:** the location's backdrop blurred, sharpening as time runs out.
- **Players and length:** 4–12, about 8 minutes.
- **Spice it up:**
  - two Mimics at big tables;
  - a location that shifts halfway through;
  - roles with tiny secret instructions;
  - a Witness who knows who the Mimic is but must stay hidden.

**Cast (reused):**

| Character | Art |
|---|---|
| The Mimic | the **Mimic** |
| The Witness | the **Witness** mission card |
| Location roles | the existing **WHO** cards, cast as the people found at each WHERE (on the Night Train: the *Night-Shift Nurses*, the *Exiled Royals*, the *Lost Tourists*…) |
| The location | the backdrop and story card |

- Secret instructions reuse the **side-mission** emblems.
- **New art:** none required. It benefits from Séance's bigger WHERE pool (Beta 6) and reuses Exorcism's round-and-lobby machinery (Beta 2).

---

## Beta 17: Dead Set: Council (a cousin of Secret Hitler; moved from Beta 9)

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

## Beta 18: Dead Set: Lifeboat (survival with a traitor; moved from Beta 10)

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

## Beta 19: the big final game update before release

**To be decided:** a new big game, either one of the parked modes below or something new worthy of the last big update before the first full version. The same reuse-first rule applies.

---

## Pitched and parked

### Dead Set: The Wake (two rooms and a deadline, a cousin of Two Rooms and a Boom) · candidate for Beta 19
**The pitch:** a funeral at a great house, two parlours, and a killer. Before the clock strikes, Death must be in the same room as the Heir.
- **Rooms:** phones split the group into two physical rooms.
- **Hostages:** each round, every room picks a Host who sends some guests across.
- **Sharing:** you can **show your card** to another player, either its colour only (Living or Death) or the full card, by tap-to-share. It's logged privately on both phones.
- **Win:** after the final round, if Death and the Heir share a room, Death wins.
- **Optional characters:** the Gambler, the Bodyguard, the Medium.
- **Players and length:** 8–25, about 20 minutes. The large-party mode.

### Dead Set: Last Words (a word game with a hidden twist, a cousin of Werewords) · Beta 13
**The pitch:** the dying man had one last word. Find it before the candle burns down.
- **Questions:** the Oracle knows the secret word and answers only with phone buttons: Yes, No, Close, Way off.
- **Death** also knows the word and steers the table away from it.
- **Win:** if the word is found, Death may name the Oracle to steal the win. If time runs out, the table may name Death.
- **Players and length:** 4–12, 5–10 minutes.

### Dead Set: Sketches (a cousin of A Fake Artist Goes to New York) · Beta 16
**The pitch:** draw the thing. One of you has no idea what the thing is.
- **Drawing:** everyone except the Forger sees a secret word. Over two rounds, each player adds one continuous stroke to a shared drawing on their phone, and the picture builds up live on the TV.
- **Win:** everyone votes for the Forger. If caught, the Forger still wins by guessing the word.
- **Players and length:** 5–10, about 10 minutes. The comedy mode.

### Dead Set: Contagion (infection spreading, in the spirit of The Thing) · parked
**The pitch:** something got aboard the research station, and every handshake might be the one.
- **Trading:** each round you secretly trade one card with a neighbour. Patient Zero can pass Infected cards, so you may be infected without knowing.
- **Testing:** a few test kits reveal the truth.
- **Win:** at the end, the healthy must quarantine every infected player in one vote. Infected players win with a majority, or if one escapes quarantine.
- **End reveal:** the infection drawn spreading across the table.
- **Players and length:** 6–14, about 20 minutes.

### Dead Set: The Inquest (a cousin of Deception: Murder in Hong Kong) · parked
**The pitch:** the coroner knows exactly what happened, but may only answer in riddles.
- **Suspects:** every suspect shows four "means" cards and four "clue" cards. The Murderer secretly picks one of each from their own hand.
- **The Coroner** knows the answer and can only place markers on scene tiles such as "cause of death" or "time".
- **Win:** each investigator gets one accusation (means plus clue).
- **Extra roles:** an Accomplice and a Witness, with a Reckoning-style ending.
- **Players and length:** 4–12, about 25 minutes. Hard deduction.

### Dead Set: Whitechapel (hidden movement, a cousin of Letters from Whitechapel) · parked
**The pitch:** the Ripper moves through the fog, and the town has to box him in before dawn.
- **Movement:** a map of the location. The Ripper moves secretly on their phone; investigators move openly and search for clues.
- **The informant:** a secret investigator misleads searches.
- **Win:** investigators arrest the Ripper in a room. The Ripper wins by reaching their hideout four nights running.
- **TV:** fog, lantern light and footprints on the map.
- **Players and length:** 3–8, about 35 minutes.

### Dead Set: Hollow Manor (a cousin of Betrayal at House on the Hill) · candidate for Beta 19
**The pitch:** you're all friends exploring a house, until the house picks one of you.
- **First half:** co-operative exploration. Room tiles are revealed on the TV (themed on the WHERE locations), with items and omens to find.
- **The Turn:** after a random omen, the house chooses a traitor, or a secret traitor reveals themself. Each side gets different rules on their phone, and the rest is a race.
- **Haunts:** themed to the backdrops.
- **Players and length:** 3–8, about 45 minutes. The most cinematic mode, and the biggest build.

---

### Twelve modes from the implementation spec (added 2026-11-17, scheduled in Betas 9–15)

The full rules, state machines, scoring, edge cases and test matrices are in **design/TWELVE-MODES-SPEC.md**. These are parked ideas, not scheduled betas. When one is picked up: one mode at a time, pure engine and privacy tests first, then phones, TV, bots, translations and docs, following the newest mode's pattern (Graverobbers). Two names need care: the trivia game uses `gazette_game` (the existing `public/gazette.js` is the recap newspaper), and **Treasure Hunters** shares no code with Graverobbers.

The spec suggested (1) The Omen, The Mirror, The Pact; (2) Inheritance, Confessions, Standoff; (3) Treasure Hunters, The Gazette, The Black Market; (4) The Vigil, The Ritual, The Vault. The schedule above regroups them by shared machinery and content cost.

#### Dead Set: The Gazette (creative trivia and bluffing) · Beta 14
**The pitch:** the Gazette prints impossible-sounding facts. One Editor knows the real answer; everyone else invents a convincing fake.
- **A round:** the question appears; non-Editors type a fake answer; the real answer and the fakes are shown as identical anonymous options; everyone votes for the truth (never their own fake).
- **Scoring:** +2 for finding the truth; +1 to a fake's author for every vote it fools; the Editor +2 if fewer than half the voters found the truth.
- **Every player is Editor once.** Missing or duplicate fakes become unattributed fallback answers from the question bank.
- **Content:** at least 30 vetted questions per language, each with aliases and three fallback fakes. Never invented at runtime.
- **Players and length:** 4–10, 15–30 minutes. Family: Tall Tales.

#### Dead Set: The Omen (simultaneous prediction) · Beta 9
**The pitch:** an occult wheel points to Life, Death or Rebirth. Everyone can secretly turn it; guess where it will stop.
- **Each round:** a public starting point; every player secretly predicts the finish and may turn the wheel one step either way (spending one of 5 Influence).
- **Resolution:** the sum of all turns moves the wheel; a correct prediction scores +3. Seven rounds; unused Influence is +1 each at the end.
- **TV:** an astrolabe wheel that turns once by the net total, with a ledger of who pushed which way.
- **Players and length:** 4–12, 10–15 minutes. Family: Reading the Room.

#### Dead Set: The Vigil (silent co-operative ordering) · Beta 11
**The pitch:** a midnight vigil. Light the numbered candles on the altar in rising order, without a word.
- **Three levels:** everyone holds secret numbers from 1 to 100 (1, 2, 2 cards at 4–6 players; 1, 1, 2 at 7–10).
- **Play** any candle at any moment. Every lower number still in someone's hand is lost and adds one Discord mark. Too many marks (4–6 by table size) and the vigil fails.
- **The Bell,** once per level, shows the lowest number still unplayed. Each level has a silence limit.
- **No turns, no talking, no traitor:** a calm co-operative contrast to the deduction modes.
- **Players and length:** 4–10, 10–20 minutes. Family: Quiet Hands.

#### Dead Set: The Vault (co-operative logic puzzles) · Beta 15
**The pitch:** three sealed chambers, each with a four-digit lock. Everyone holds part of the evidence.
- **Clues** are true statements about the code ("the second digit is even", "digits one and three sum to 9"), split among the players. Together they fit exactly one code; nobody can solve it alone.
- **The Locksmith** (rotating) enters the agreed code. Three wrong guesses on a chamber, or the timer running out, and the vault stays shut for good.
- **Content:** 30+ curated chambers, each checked by a solver over all 9,000 codes.
- **End:** every clue shown with a walkthrough of the deduction.
- **Players and length:** 4–10, 15–25 minutes. Family: Quiet Hands.

#### Dead Set: The Mirror (social prediction) · Beta 9
**The pitch:** the haunted mirror doesn't show you: it shows what your friends think you'll do.
- **Eight dilemmas,** each with three plausible answers. Everyone answers for themself and predicts the answer of one assigned player (the targets rotate so everyone reads everyone).
- **Scoring:** +2 for every correct prediction. Your own answer scores nothing, so surprising your reader is fair play.
- **Content:** at least 40 dilemmas per language.
- **Players and length:** 4–12, 15–20 minutes. Family: Reading the Room.

#### Dead Set: Inheritance (negotiation and votes) · Beta 12
**The pitch:** a contested estate. Each player is Executor once and writes the will; the others accept it or tear it up.
- **The will:** the Executor splits an estate (12, 16 or 20 coins by table size) among any players, themself included.
- **The vote:** a strict majority of the other players must accept. Otherwise nobody is paid, and every non-Executor gets one consolation coin.
- **Deals and threats** are spoken and never enforced. The wealthiest player wins.
- **Players and length:** 4–12, 20–30 minutes. Family: Bargains & Betrayals.

#### Dead Set: Treasure Hunters (push your luck) · Beta 11
**The pitch:** the crew descends into haunted ruins together. Grab your share and run, or risk one more step.
- **Five expeditions.** Cards are revealed one by one: treasure piles up on the floor; the first Wraith, Collapse or Curse is a warning, the second of the same kind collapses the expedition and the floor is lost.
- **After each card,** everyone still inside secretly chooses Continue or Leave. Leavers split the floor; a lone leaver earns a +2 relic bonus.
- **At most six reveals;** whoever is still inside then shares what is left.
- **Players and length:** 4–12, 15–20 minutes. Family: Bluff & Wager. (Not related to Graverobbers.)

#### Dead Set: The Ritual (co-operative runes with a hidden Cultist) · Beta 13
**The pitch:** complete three rituals before three fail. One of you serves the other side.
- **Each round:** a public recipe of three runes; everyone holds two secret runes. The rotating Conductor picks three ritualists, who each offer one rune at once.
- **The Cultist** can lie about their hand, offer a wrong rune, or once per game corrupt their rune into any other.
- **Fair deal:** the server always deals so that some trio of the Living could complete the ritual.
- **Win:** three successes for the Living, three failures for the Cultist. No elimination, no final accusation.
- **Players and length:** 5–10, 20–30 minutes. Family: Hidden Allegiances.

#### Dead Set: Confessions (two truths and a lie) · Beta 14
**The pitch:** one player sits in the confessional with three statements. Exactly one is a lie.
- **Each player confesses once,** either Personal (they write three statements and mark the lie) or Fictional (a pre-written character case). A timeout falls back to a Fictional case.
- **Interrogation:** the table questions the Confessor, then votes for the lie.
- **Scoring:** +2 for each investigator who finds the lie; the Confessor +1 per wrong vote (up to +3).
- **Care:** never ask for sensitive or real criminal disclosures; at least 60 Fictional cases per language.
- **Players and length:** 4–10, 15–30 minutes. Family: Tall Tales.

#### Dead Set: The Black Market (auctions and counterfeits) · Beta 12
**The pitch:** relics change hands in the dark, and some of them are fakes.
- **The Seller** secretly picks a genuine relic (worth 4–6) or a counterfeit (worth −4) and pitches it, true or not.
- **Sealed bids** of 0–3 coins; the high bidder may spend one of two Audit seals to expose it. A caught fake cancels the sale and costs the Seller 2.
- **Two market cycles** (everyone sells twice); hidden values are revealed only at the end. Score: coins + relic values + reputation.
- **Players and length:** 3–9, 20–30 minutes. Family: Bluff & Wager.

#### Dead Set: Standoff (simultaneous threats) · Beta 10
**The pitch:** five confrontations in a lawless room. Everyone aims at someone, and most shots are blanks.
- **Each player** holds 2 live and 3 blank cursed rounds, and spends one per round on a chosen target.
- **The aim is revealed** (not the rounds); each target chooses once: Stand or Duck.
- **Scoring:** standing against a live shot costs 2; standing against blanks earns 2; ducking costs 1. Shooters score by how their target guessed.
- **Nobody dies or is removed.** Symbolic, supernatural duelling art; no realistic weapons.
- **Players and length:** 4–12, 10–15 minutes. Family: Bluff & Wager.

#### Dead Set: The Pact (trust and betrayal) · Beta 10
**The pitch:** at the witching hour two people swear a pact, and each decides whether to keep it.
- **Each round,** players are paired (round-robin; one bye at odd tables, worth +2). Pairs talk, then each secretly chooses Honour or Betray.
- **Payoffs:** both honour 3/3; betray an honourer 5/0; both betray 1/1.
- **Oaths:** each player has 2. If both partners stake one, a betrayer pays 2 points to their partner.
- **Public history** of honoured and broken pacts gives every choice consequences.
- **Players and length:** 4–12, 15–25 minutes. Family: Bargains & Betrayals.

