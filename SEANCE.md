# Dead Set: Séance — rules and game spec (DRAFT)

**Status: design draft for Beta 3. Nothing here is built. To be agreed before implementation.**

A co-operative deduction game with a hidden traitor, for **4–10 players**, chosen in the lobby next to Classic, Missions and Exorcism. One phone each, plus the TV board, which matters more here than in any other mode.

Someone was murdered. Their **Ghost** sits at the table and knows exactly **who** killed them, **where** and **why**, but cannot say a word. It can only send **visions**: wordless etched pictures. The **Mediums** read them and light candles on what they believe. Somewhere among the Mediums sits a **Deceiver**: a second spirit, in a living body, who knows the truth too and swaps some of the Ghost's visions for its own.

---

## 1. Sides

| Side | Who | Knows | Wins when |
|---|---|---|---|
| **The Ghost** (one, public) | One player, chosen by lot or by the host | The true WHO, WHERE and WHY; what it sent to each Medium | With the Mediums |
| **The Mediums** | Everyone else, apart from the Deceiver | Their own role only | All three truths are found before the séance clock burns out (**full victory** if they then also name the Deceiver) |
| **The Deceiver** (one; two from 9 players, optional) | Hidden among the Mediums; looks exactly like one | The truth, who the Ghost is, the other Deceiver | The clock burns out first, **or** the Mediums name the wrong player at the end |

- **The Ghost is public and silent.** Everyone knows who it is, and its phone reminds it: *You cannot speak.* No words, no sounds, no gestures. The only exception is the agreed tap-to-react described in §4.
- **The Ghost does not know who the Deceiver is.** It sends true visions to everyone, including the Deceiver.
- **At 4 players there is no Deceiver** by default: Ghost plus three Mediums, purely co-operative. The host can switch a Deceiver on.
- **Trusted moderator:** the moderator can play the Ghost.

## 2. The board

Before the game, the server draws a board for the TV from the story cards: **three rows of candidate cards**.

| Row | Drawn from | Example | Size (Standard) |
|---|---|---|---|
| **WHO** killed me | WHO cards | *the Lighthouse Keepers* | 6 |
| **WHERE** it happened | WHERE cards (each with its etched backdrop) | *a Flooded Cathedral* | 6 |
| **WHY** it happened | WHY cards | *Keep a Terrible Secret* | 6 |

- One card in each row is the truth.
- The other cards are drawn so that each row contains **near-misses**: cards that share a theme with the truth (two places at sea, two motives about money). This uses the concept tags in §8.
- Rows grow or shrink with difficulty (§5).

## 3. The séance clock

- The TV shows **seven candles** around the séance table: 11 pm to dawn.
- Every round burns one candle.
- **Every wrong verdict burns one more.**
- When the last candle goes out, the séance is over (§6).

This is how the game stops brute force. Guessing does give information, because a wrong card is struck from its row, but every miss costs time.

## 4. A round

1. **Assignments.** Each Medium is given one **unsolved** row to read this round: WHO, WHERE or WHY.
   - Mediums are spread as evenly as possible across the open rows.
   - Assignments rotate every round, so everyone reads every row in turn.
   - Solved rows take no readers.
   - The TV shows the assignments as coloured threads from each portrait to its row.
2. **Visions (90 s).**
   - **The Ghost** holds a hand of **7 vision cards** and drags **one** vision to each Medium (two each on Gentle), meant for that Medium's row. Unused cards stay in hand, and the hand refills to 7 every round.
   - **Every Medium,** the Deceiver included, sees the same screen: their row's candidates, on which they mark a private **first impression**. It has no effect on the game, but it is shown in the end replay. The real reason it exists is privacy: everyone is tapping at the same time, so the Deceiver's extra action is hidden in plain sight.
   - **The Deceiver** sees the same screen with one hidden extra: a hand of **3 false visions**. Once per round, and at most **3 times per game** by default, it may **swap** the Ghost's vision to one Medium for one of its own. The Medium can't tell, and the swapped-out true vision is gone.
3. **The reveal (shared interlude).**
   - Each Medium first sees their vision alone on their phone, large on vellum, for a few seconds.
   - Then all visions fly onto the TV, each laid beneath its Medium's portrait, under that Medium's row.
   - From then on, every vision is public.
4. **Discussion (180 s).**
   - The table talks. Mediums may describe what they see in their vision, argue and persuade. The Ghost stays silent.
   - **Cold spots:** the Ghost has **3 per game**. It may tap a vision on its phone to frost it on every screen, meaning *this is not mine*. That is how the Ghost exposes a swap.
   - Frosting tells the table a swap happened, but not who made it.
5. **Candles (45 s).** Each Medium **holds** to light their candle on one candidate in their assigned row, or **abstains** (hold "Hold my candle").
6. **The verdict (shared interlude).** For each open row:
   - The candidate with the most candles is put to the spirit. A tie, or no candles, means no verdict for that row.
   - **Right:** the card blazes in a ray burst, the row is **solved**, and a chime plays. Its truth is shown to everyone.
   - **Wrong:** the card chars and is struck from the row, and **one extra candle burns**.
7. **The round's candle** burns. If any rows are still open and any candles remain, the next round begins.

## 5. Setup (lobby)

| Setting | Options (default first) |
|---|---|
| Difficulty | **Standard** (6 cards per row, 1 vision each, 7 candles), Gentle (5 per row, 2 visions each, 8 candles), Grim (8 per row, 1 vision each, 6 candles) |
| Deceivers | **One** (from 5 players; off at 4), none, two (from 9 players) |
| Deceivers know each other | **On** (two Deceivers only) |
| The Deceiver's swaps | **3 per game**, 2, 4 |
| The Ghost's cold spots | **3 per game**, 2, 4 |
| Last breath (§6) | **On**, off |
| Ghost | **Drawn by lot**, chosen by the host, the trusted moderator |
| Rounds per match | **1**, 2, 3 (scores carry over, as in Exorcism) |
| Timers | Visions 90 s, discussion 180 s, candles 45 s, naming 60 s |
| Story cards | The usual WHO / WHERE / WHY switches; the host can exclude cards |

Everything is validated per mode, following the Beta 0 rule: no Classic roles, rules or Dreams appear here.

## 6. The ending

- **All three rows solved:** the **Naming** begins, like the Reckoning. The Ghost is revealed as satisfied on the TV, and every Medium (the Deceiver too, which it must) votes for who they think the Deceiver is. With two Deceivers, the table names two.
  - **Named correctly:** *The spirit rests.* **Full victory** for the Ghost and the Mediums.
  - **Named wrongly:** *Something else came through.* **Hollow victory.** The Mediums solved the murder, but the Deceiver also wins.
- **Clock burns out with exactly one row open, and Last breath is on:** every Medium lights one final candle on that row, with no assignments. A plurality is put to the spirit once.
  - Right: on to the Naming.
  - Wrong: the Deceiver wins.
- **Clock burns out otherwise:** *The candles gutter.* The Deceiver wins. With no Deceiver, the table simply loses.

**Scores** (when playing several rounds):

| Outcome | Ghost and Mediums | Deceiver |
|---|---|---|
| Full victory | +2 each | 0 |
| Hollow victory | +1 each | +1 |
| Deceiver wins | 0 | +3 |

**End screen:** the full board turned face up. A replay of every round shows the true visions, the swaps, the first impressions and the candles. The Gazette prints the solved murder: *"The Lighthouse Keepers, in the Flooded Cathedral, to Keep a Terrible Secret."*

## 7. Screens

**The Ghost's phone:**
- the three true cards at the top, always visible;
- its hand of 7 visions;
- the Mediums as portrait slots, to drag a vision onto each;
- a cold-spot counter;
- a constant reminder: *You cannot speak.*

**A Medium's phone** (the Deceiver's is identical, plus its hidden hand):
- the assigned row;
- the first-impression tap;
- their own vision, large;
- all visions in a scrollable strip;
- the candle hold.

**TV:**
- **The table and clock:** the séance table as the astrolabe ring, with seven candles as the burning clock.
- **The board:** the three rows of etched cards above the table, the WHERE row with its backdrop vignettes. Visions are laid as tarot-sized cards under each portrait, frosted ones iced over. Solved rows are set in gold, struck cards charred.
- **Atmosphere:** a new *séance* music mood, with flickers when a candle burns.

**Privacy rules (as everywhere):**
- Every phone runs the same flow at the same moments, with the same brightness and layout.
- The Deceiver's swap lives inside the same first-impression screen as everyone else's.
- Swaps and cold spots never make a sound on a phone.

## 8. Content (the large pass the roadmap flags)

- **Vision cards: 84 at launch.**
  - Language-free, dream-like etchings in the established pencil and emblem style.
  - Two or three motifs collide on each one: *a key inside a birdcage; stairs that end in water; a clock with a moth on the hand; a crown on a dinner plate*.
  - Drawn as SVG compositions from a motif library (about 60 motifs) with composition rules, plus hand-curated favourites.
  - Each vision carries **4–6 concept tags** (water, money, faith, night, royalty, travel, fire, secrecy…).
- **More story cards.** 20 WHO / 15 WHERE / 15 WHY repeat quickly on a 6-card board. The target is **40 / 30 / 30**:
  - 15 new WHERE cards each need a backdrop etching (and later room content for Doppelgänger);
  - all of it translated into the six languages;
  - every WHO, WHERE and WHY card tagged with the same concept vocabulary as the visions.
- **Tags** drive three things: near-miss boards, bot play, and a "vision fits" sanity check when generating content.

## 9. Practice bots

- **Ghost bot:** sends each Medium the vision in its hand whose tags overlap most with the truth of that Medium's row, and least with the row's other cards.
- **Medium bot:** lights its candle on the candidate whose tags overlap most with the visions in its row, frosted visions excluded. Bots discount visions from Mediums whose verdicts went wrong.
- **Deceiver bot:**
  - swaps the vision of a Medium assigned to a near-miss row, using a vision tagged toward a near-miss;
  - votes plausibly wrong at most once per row.

Bot simulations set the balance: the clock length, the swap count and the cold-spot count per difficulty, so the full victory lands at about 50–60% on Standard.

## 10. To decide

1. **Visions to each Medium, or visions to the whole row?** The roadmap says *to each player*, and so does this draft. Personal visions make each reader matter.
2. **Should the Ghost also see the first impressions?** That would give it a way to steer. The draft says **no**, to keep the Ghost honest.
3. **Can the Deceiver swap a vision sent to itself?** The draft says **no**: it can only swap other players' visions.
4. **Does a wrong verdict strike the card?** The draft says **yes**, plus the extra burned candle. An alternative: the card stays and only the candle burns.
5. **Should the clock length scale with the number of rows still open?** That would make two-row endgames less punishing.
