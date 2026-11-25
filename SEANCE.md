# Dead Set: Séance — rules and game spec

**Status: built for Beta 6 (2026-11-16); the rules were redesigned on 2026-11-25 (§0).** The vision etchings are generated from a motif library (§8); the larger story-card pool was added in the rework of §12.

A co-operative deduction game with a hidden traitor, for **4–10 players**, chosen in the lobby next to Classic, Missions and Exorcism. One phone each, plus the TV board, which matters more here than in any other mode.

Someone was murdered. Their **Ghost** sits at the table and knows exactly **who** killed them, **where** and **why**, but cannot say a word. It can only send **visions**: wordless etched pictures. The séance asks one question at a time. The **Mediums** read the visions and lay their hands on the card they believe. Somewhere among the Mediums sits a **Deceiver**: a second spirit, in a living body, who knows the truth too and swaps some of the Ghost's visions for its own.

---

## 0. The redesign (25 Nov)

The first build had five problems. Each change below answers one of them.

| # | Problem | The fix |
|---|---|---|
| 1 | **Brute force won.** A wrong guess only struck the card. With a guess on every row every round, six cards and seven rounds, every row fell to elimination without reading a single vision. | **One question at a time** (§4): who, then where, then why. One card is asked per round, and every round burns a candle. Seven candles for three answers among six cards each: blind guessing needs about ten and a half rounds and wins about 16% of games. A table that reads the visions needs four to six. |
| 2 | **The Deceiver's real weapon was stalling.** With one or two readers on a row, a tie or a held candle gave no verdict, and the round was lost. | **Every round asks a card.** The card under the most hands is asked; a tie, or no hands at all, is settled at random by the planchette among the tied (or all) cards. No abstaining. The Deceiver's weapons are now the ones a traitor should have: its swaps, its arguments and its hand. |
| 3 | **"Candle" meant both the clock and the vote.** | The clock keeps its **candles**. The vote is a **hand** laid on a card, as at a séance table, with its own etching (`v_hand`). |
| 4 | **Busywork and too many rules.** The first-impression tap did nothing; assigned rows and voting only on your own row were rules to learn and track. | **No assignments**: everyone reads the same question. The first impression is gone. In its place, while the Ghost chooses, each Medium marks a **hunch** (§4.2): who they suspect. It hides the Deceiver's swap in plain sight (everyone taps), it is kept from round to round, it is marked at the Naming as your first pick, and the end screen shows it. With no Deceiver at the table, there is no hunch and nothing to tap. The Discussion and Candle steps are one step: **Hands**. Last breath is gone. |
| 5 | **The Ghost's hand often held nothing that fit.** Seven random visions from 84, and near-miss rows built to share themes with the truth: on many boards no vision in hand pointed at the truth more than at the other cards. | **Fair dealing** (§4.1). Every round the Ghost's hand is dealt so that a share of it fits the answer (about half the Mediums' worth at Standard), and the Deceiver's false visions are dealt to fit a wrong card better than the answer. The Ghost always has something true to say; the Deceiver always has a plausible lie. |

## 1. Sides

| Side | Who | Knows | Wins when |
|---|---|---|---|
| **The Ghost** (one, public) | One player, chosen by lot or by the host | The true WHO, WHERE and WHY; what it sent to each Medium | With the Mediums |
| **The Mediums** | Everyone else, apart from the Deceiver | Their own role only | All three questions are answered before the séance clock burns out (**full victory** if they then also name the Deceiver) |
| **The Deceiver** (one; two from 9 players, optional) | Hidden among the Mediums; looks exactly like one | The truth, who the Ghost is, the other Deceiver | The clock burns out first, **or** the Mediums name the wrong player at the end |

- **The Ghost is public and silent.** Everyone knows who it is, and its phone reminds it: *You cannot speak.* No words, no sounds, no gestures.
- **The Ghost does not know who the Deceiver is.** It sends true visions to everyone, including the Deceiver.
- **At 4 players there is no Deceiver** by default: Ghost plus three Mediums, purely co-operative. The host can switch a Deceiver on.
- **Trusted moderator:** the moderator can play the Ghost.

## 2. The board

Before the game, the server draws a board for the TV from the story cards: **three rows of candidate cards**, one row per question.

| Row | Drawn from | Example | Size (Standard) |
|---|---|---|---|
| **WHO** killed me | WHO cards | *the Lighthouse Keepers* | 6 |
| **WHERE** it happened | WHERE cards (each with its etched backdrop) | *a Flooded Cathedral* | 6 |
| **WHY** it happened | WHY cards | *Keep a Terrible Secret* | 6 |

- One card in each row is the truth.
- Each row holds **near-misses**: cards that share a theme with the truth (two places at sea, two motives about money), from the concept tags of §8.
- Rows grow or shrink with difficulty (§5).

## 3. The séance clock

- The TV shows **seven candles** around the séance table (eight on Grim).
- **Every round burns one candle**, whatever the spirit answers.
- When the last candle goes out with a question still open, the séance is over (§6).

## 4. A round

The séance asks **WHO** first. Once the spirit says yes, it asks **WHERE**, then **WHY**. Every round is about the question being asked.

1. **Visions (90 s).**
   - **The Ghost** holds a hand of visions (three more than there are Mediums, at least six), with the answer marked in red, and sends **one vision to every Medium**. Sending again replaces the earlier choice. Unsent visions go out by themselves when the time is up (the hand picks one that fits).
   - **Every Medium** marks a **hunch**: the other Medium they suspect (§4.2). The step ends when every vision is sent and every hunch is in.
   - **The Deceiver** sees the same screen, plus a hidden drawer that every Medium has ("Your hand"; empty for them). It holds **3 false visions**. At most once a round, and **3 times a game** by default, it may **swap** another Medium's vision for one of its own. The swap lands at the reveal; the Medium can't tell, and the true vision is gone.
2. **The reveal (shared scene).** Each Medium first sees their vision alone on their phone; then all visions fly onto the TV, labelled with their Medium. They stay on the table, round after round, until the question is answered.
3. **Hands (180 s).**
   - The table talks: what each vision shows, which card it points to, which ones disagree.
   - **Cold spots:** the Ghost has **2 per game**. On its phone a red mark shows any vision it did not send; tapping one frosts it on every screen: *this one is not mine*. Frosting shows a swap happened, and clears its reader (the Deceiver cannot swap its own), but not who made it. The Ghost then holds *I have seen them*.
   - Every Medium **lays a hand** on a card of the question (and can lift or move it). Hands are secret until the answer.
   - The step ends when every hand is down and the Ghost has seen the visions, or when time runs out.
4. **The spirit answers (shared scene).**
   - The card under the most hands is asked. A tie is settled by the **planchette**, at random among the tied cards; with no hands at all, it drifts to any card in the row.
   - **Yes:** the card blazes, the question is answered, and the next one is asked from the next round.
   - **No:** the card is struck from the row.
   - Everyone's hands turn public: who laid a hand where is the case at the Naming.
5. **The candle** burns. If questions are still open and candles remain, the next round begins.

### 4.1 Fair dealing

A vision **fits** a card when it shares at least one concept tag with it, and no other live card in the row shares more. Every round:

- the Ghost's hand is dealt with a share of visions that fit the answer: `round(Mediums × share + ½)`, with share 0.75 (Gentle), 0.5 (Standard) or 0.35 (Grim), at least one; visions already seen on the question are not dealt again; the rest of the hand comes off the deck at random;
- each Deceiver's 3 false visions are dealt to fit a wrong live card better than the answer.

Human tables read pictures, not tags; the tags only make sure the hand always contains pictures with something true to say.

### 4.2 Hunches

- Marked during every vision step, by every Medium (the Deceiver too), when the table has a Deceiver.
- Private. Kept from round to round: the phone offers *Keep my hunch* with one tap.
- At the Naming, your last hunch is already marked; you may change it.
- The end screen shows every round's hunches.

## 5. Setup (lobby)

| Setting | Options (default first) |
|---|---|
| Difficulty | **Standard** (6 cards per row, about half the Ghost's visions fit, 7 candles), Gentle (5 per row, three quarters fit, 7 candles), Grim (7 per row, about a third fit, 8 candles) |
| Deceivers | **One** (from 5 players; off at 4), none, two (from 9 players) |
| Deceivers know each other | **On** (two Deceivers only) |
| The Deceiver's swaps | **3 per game**, 2, 4 |
| The Ghost's cold spots | **2 per game**, 1, 3 |
| Ghost | **Drawn by lot**, chosen by the host |
| Games per match | **1**, 2, 3 (scores carry over, as in Exorcism) |
| Timers | Visions 90 s, hands 180 s, naming 60 s |

Everything is validated per mode, following the Beta 0 rule: no Classic roles, rules or Dreams appear here.

## 6. The ending

- **All three questions answered:** the **Naming** begins, like the Reckoning. Every Medium (the Deceiver too, which it must) names who they think the Deceiver is; their last hunch is marked first. With two Deceivers, the table names two.
  - **Named correctly:** *The spirit rests.* **Full victory** for the Ghost and the Mediums.
  - **Named wrongly:** *Something else came through.* **Hollow victory.** The Mediums solved the murder, but the Deceiver also wins.
- **The clock burns out:** *The candles gutter.* The Deceiver wins. With no Deceiver, the table simply loses.

**Scores** (when playing several games):

| Outcome | Ghost and Mediums | Deceiver |
|---|---|---|
| Full victory | +2 each | 0 |
| Hollow victory | +1 each | +1 |
| Deceiver wins | 0 | +3 |

**End screen:** the full board turned face up. A replay of every round shows the true visions, the swaps, the hands and the hunches. The Gazette prints the solved murder: *"The Lighthouse Keepers, in the Flooded Cathedral, to Keep a Terrible Secret."*

## 7. Screens

Every phone shows a status bar: the round, the three questions (answered ones with their answer), the two steps (Visions, Hands) and the clock.

**The Ghost's phone:**
- the three true cards, the current question's marked;
- the Mediums as chips (each showing the vision sent), the question's row with the answer in red, and its hand;
- in Hands: the visions on the table, a red mark on any it did not send, the cold-spot counter, and *I have seen them*;
- a constant reminder: *You cannot speak.*

**A Medium's phone** (the Deceiver's is identical, plus its hidden drawer):
- Visions: the question's row, the visions so far on it, and the hunch picker;
- Hands: their own vision large beside the table seal (who has laid a hand, the candles left), the other visions, and the row to lay a hand on;
- the board sheet (from the tray): every row, struck and answered, with the visions seen on each.

**TV:** see TV-A8 in `design/deadset-tv/TV-PASS.md`. The board owns the stage: the three rows, the question being asked lit, the answered ones in gilt, the ones to come dimmed; the visions for the question above, labelled with their Medium; the clock and the table (the Ghost first, in red) in the ledger.

**Privacy rules (as everywhere):**
- Every phone runs the same flow at the same moments, with the same brightness and layout.
- The Deceiver's swap lives inside the same hunch screen as everyone else's, behind the same drawer.
- Hunches and hands stay secret until the answer (hunches until the end); swaps and cold spots never make a sound on a phone.

## 8. Content (the large pass the roadmap flags)

- **Vision cards: 84 at launch.**
  - Language-free, dream-like etchings in the established pencil and emblem style.
  - Two or three motifs collide on each one: *a key inside a birdcage; stairs that end in water; a clock with a moth on the hand; a crown on a dinner plate*.
  - **Built:** 84 hand-curated compositions (`public/visions.js`) from about 100 pencil motifs: the existing emblem library plus 16 new motifs (wave, ship, fish, bird, birdcage, stairs, tree, snake, moth, planet, gear, film reel, grapes, palm, snowflake, train). Four layouts: one motif inside another, a small one across a large one, a diagonal pair, a small one above a large one; every fourth vision adds a third accent.
  - Each motif carries two concept tags; a vision carries its motifs' tags (about 3–5, from 23: water, money, faith, night, royalty, travel, fire, secrecy, death, time…).
- **More story cards.** 20 WHO / 15 WHERE / 15 WHY repeat quickly on a 6-card board. The target is **40 / 30 / 30**:
  - 15 new WHERE cards each need a backdrop etching (and later room content for Mimic);
  - all of it translated into the six languages;
  - every WHO, WHERE and WHY card tagged with the same concept vocabulary as the visions (**done** for the current 20 / 15 / 15).
- **Tags** drive three things: near-miss boards, bot play, and a "vision fits" sanity check when generating content.

## 9. Cast (reused art)

| Character | Art |
|---|---|
| The Ghost | the **Shade** |
| The players (Mediums) | the Missions **Medium** card |
| The Deceiver | the **Charlatan** (the Missions Death card) |
| Cold spots | the **Haunted** mission card |
| The séance clock | the **Candle** |
| The board | the story cards themselves |

**New art:** the vision etchings and the extra story cards and backdrops (§8).

## 9b. Practice bots

- **Ghost bot:** sends each Medium the vision in its hand whose tags fit the answer most and the other live cards least; frosts any swapped vision while it has cold spots.
- **Medium bot:** lays its hand on the card the question's unfrosted visions fit best, with some noise (a reader is not a tag counter). Its hunch and its naming follow the hand record: hands on cards the spirit denied, or on wrong cards of an answered question; a frosted vision's reader is cleared.
- **Deceiver bot:** picks a decoy (the wrong card its false hand fits best), swaps a vision toward it when it can, and lays its hand on the decoy while the decoy looks plausible, on the truth otherwise, to blend in.

## 10. Decisions (settled for the build)

1. **One vision to every Medium, every round**, for the question being asked.
2. **The Ghost does not see the hunches.** It sees what it sent and, from the reveal on, what every Medium shows, so it can spot a swap.
3. **The Deceiver cannot swap a vision sent to itself**, only another Medium's. If two Deceivers swap the same Medium's vision in one round, only the first lands, and the second swap is not spent.
4. **Every round asks one card and burns one candle.** A tie is settled at random among the tied cards; no hands at all, at random among the row.
5. **Hands turn public after each answer**: who laid a hand where is part of the case against the Deceiver at the Naming.
6. **The Naming**: every Medium names one player (two with two Deceivers); a tie at the cut-off names nobody there, which counts as a wrong naming.
7. **The Ghost is muted** in the remote chat too.
8. **The round waits for the Ghost** to have seen the visions (or for the timer), so a swap is never answered before the Ghost could frost it.

## 11. Balance (bot simulations, 300 games each)

Standard:

| Players | Full victory | Hollow | Deceiver | Lost (no Deceiver) |
|---|---|---|---|---|
| 4 | 87% | | | 13% |
| 5 | 66% | 23% | 11% | |
| 6 | 59% | 18% | 23% | |
| 8 | 60% | 16% | 24% | |
| 10 | 59% | 12% | 29% | |

- **Blind guessing** (Mediums laying hands at random): 17% at four players, 5% full at six. Reading the visions is what wins.
- **Gentle:** 78–99% full. **Grim:** about 35% full at six, 23% at nine.
- **Two Deceivers** (nine or ten): about 35% full, 35% hollow, 30% Deceivers.
- Bots read by concept tags; humans read pictures, argue and bluff. The numbers set the dials, not the experience.

## 12. The story pool and the screens (rework, 2026-11-17)

- **Story cards: 40 WHO / 30 WHERE / 30 WHY**, translated, tagged. Every WHO and WHY card carries its own pencil icon (`STORY_ICONS` in `public/visions.js`), and every WHERE card its backdrop etching (15 new etchings in `public/backdrops.js`). New cards also appear in Classic and Missions, with their own Missions story lines (mission steps for every WHY card, scenes for every WHERE card), in all six languages.
- **No window on Séance cards:** the arch that cropped the art is gone; motifs and icons sit on the vellum, bigger.
- **One screen per step on every phone:** a status bar, one line of what to do now, then the cards (updated in §7 for the redesign).
  - The Ghost goes reader by reader: the reader's row with the truth in red, the hand, Send. It moves to the next reader by itself.
  - A reader sees their own vision large beside the other visions on their row, and their row's cards below; a second tab shows the whole table.
  - Any card can be tapped to see it large.
  - The Naming shows each player's record of wrong candles.
- **TV:** a banner names the step and what the table should be doing.

Still to come: hand-drawn vision art to replace or extend the generated motif compositions.
