# Dead Set: Coffins — rules and game spec (DRAFT)

**Status: design draft for Beta 4. Nothing here is built. To be agreed before implementation.**

A quick bluffing game for **3–10 players**, about 10 minutes, chosen in the lobby next to the other modes. One phone each, plus the TV board as the graveyard.

Everyone buries coffins in their own plot. Most hold **gold**; one holds **your curse**. Players bid on how many coffins they can open without finding a curse, and the highest bidder has to dig. They start with their own grave.

---

## 1. Your coffins

- Each player starts with **4 coffin cards**: **3 Gold** and **1 Curse**.
- **Your own phone** shows your coffins: gold ones with a glint, the cursed one with a red sigil. Both are dark wood of the same brightness, so a glance across the table gives nothing away.
- **The TV and other phones** only show how many coffins each player holds, and how many are buried in each plot.

## 2. A round

1. **The burial.**
   - **Everyone at once:** each player secretly buries one coffin (tap a card, then hold to bury). The TV lowers the first coffin into every plot together.
   - **Then by turns, clockwise,** starting from the round's first player. On your turn, either:
     - **Bury** another coffin from your hand on top of your stack; or
     - **Challenge:** open the bidding by announcing *"I can open N"*. N is at least 1 and at most the number of coffins buried in total.
   - A player with nothing left to bury must challenge.
2. **The bidding.** Clockwise from the challenger, each player either **raises** (any higher number, up to the total buried) or **passes**.
   - A pass is final for this round.
   - A bid equal to the total ends the bidding at once.
   - The last player not to pass becomes **the Digger**.
3. **The dig.**
   - The Digger **must open all of their own coffins first**, from the top down.
   - Then they choose other plots, one coffin at a time, always opening that plot's **top** coffin. They pick a headstone on their phone or on the TV, until N coffins are open.
   - Every lid creaks open on the TV. Gold glints and adds a pip to the count; a curse ends the dig at once.
4. **Outcome.**
   - **All N opened, no curse:** the Digger wins a **challenge**, and their headstone turns gilt. **Two challenges wins the game.**
   - **A curse is found:**
     - **The Digger's own curse:** the Digger chooses one of their coffins to lose for good. The game doesn't say which kind it was.
     - **Another player's curse:** that player blindly takes one of the Digger's coffins at random, and it is lost for good. Neither of them learns which kind it was.
     - The player whose curse was found starts the next round. If it was the Digger's own curse, the Digger chooses who starts.
5. **Reset.** Everyone takes back their buried coffins (minus any lost), and a new round begins.

## 3. Ghosts and coming back (the Dead Set twist)

- A player with **no coffins left** is out, but becomes a **ghost**. Their headstone cracks and their portrait fades.
- **Ghost wagers:** before each dig, every ghost secretly wagers on the outcome: *gold* or *curse*. Each correct wager adds a candle to their grave.
- **Three candles** and the ghost **rises** as a **Revenant**: back in the game with **one Gold coffin and no curse**.
  - A Revenant can't bluff with a curse; it can only be dug or dig.
  - It can win normally.
- So players who are knocked out keep playing and keep the table loud.
- The game also ends if **only one player is left with coffins**. That player wins, whatever the ghosts' candles.

## 4. Options (lobby switches)

| Option | Default | What it does |
|---|---|---|
| **The Death coffin** | Off | Each round, one random player is secretly dealt the **Death coffin** in place of one of their Gold coffins, so no hand count gives it away. A Digger who opens it **does not lose a coffin**. Instead, Death's holder **steals one of the Digger's coffins at random** and keeps it as Gold. The holder wants to be dug: the hidden role of the round. Revealed when opened, and at the round's end. |
| **Relics** | Off | Every player gets one relic for the game: the **Lantern** (before bidding, peek at the top coffin of one plot), the **Shovel** (during your dig, open someone else's top coffin before your own) or **Salt** (the first curse you hit costs you nothing). Each is dealt at random, kept secret and used once. |
| **Ghost wagers** | On | §3. Off means a player who loses all their coffins is simply out. |
| Challenges to win | **2** | 1 (sudden death), 2, 3 |
| Coffins per player | **4** (3 Gold, 1 Curse) | 5 (4 Gold, 1 Curse) for longer games |
| Rounds per match | **1** | Scores carry over (§6) |
| Timers | Burial 20 s, turn 30 s, bid 20 s, each dig pick 15 s | On a timeout: burial buries a random coffin; turn buries one if you can, otherwise opens at 1; bid passes; dig picks a random plot. |

## 5. Screens

**Phone:**
- your hand of coffins along the bottom;
- the plots of the table as headstones with stack counts;
- a large number stepper for bids, with **Raise** (hold) and **Pass**;
- during your dig, tap a headstone to open it.

Everyone gets the same layout and the same prompts at the same moments. The burial step makes every phone choose at once, so nothing about your hand shows in your behaviour.

**TV: the graveyard.**
- A row of headstones with portrait medallions in front of the WHERE backdrop, which is drawn from the story cards for flavour.
- Coffin stacks in each plot, the current bid on a bell-tower counter, and whose turn it is.
- **The dig is the show:**
  - lids creak open one by one;
  - gold glints with a soft bell;
  - a curse bursts out with the red seal and a crack across the screen;
  - the Death coffin opens with a scythe sweep.

**Privacy:**
- Coffin faces are the same brightness.
- Your own curse never makes a sound or a buzz.
- Losing a coffin is announced only as a count.

## 6. Scoring and replay

- **Single game:** the first to two challenges, or the last player with coffins, wins.
- **Match play:** the winner +3. Each challenge won +1. Each ghost who rose +1.
- **End screen:** every coffin of every player turned face up, the bid history as a graph, and *"who bluffed most"*: bids made while holding a curse in the stack. After the end screen the table returns to the same lobby, as in Exorcism.

## 7. Practice bots

- **Burial:** a bot buries its curse first with probability ~0.35, otherwise gold.
- **Bidding:** a bot estimates the safe count as its own buried gold, plus a share of the others' stacks weighted by how they bid, and bluffs a raise sometimes.
- **Digging:** a bot opens the plots of players who passed early first, and avoids the plots of players who bid high.
- **Wagers:** a ghost bot wagers at the curse rate it has seen so far.

Simulations set the bluff rate, so a table of bots finishes in about 8–12 minutes at 6 players.

## 8. To decide

1. **Should the first burial be simultaneous?** This draft says **yes**, to keep phones in step. The alternative is fully turn-based.
2. **Should a player whose own curse was found choose which coffin to lose?** That matches the familiar rule, and this draft keeps it. The alternative is random loss.
3. **Ghost wagers and Revenants: on by default?** This draft says **on**. It's the main Dead Set twist.
4. **The Death coffin:** steal a coffin, or let Death's holder **win a challenge** instead? The draft says steal; a challenge win is much swingier.
5. **Should the Digger have to open their own coffins first?** The draft says **yes**. That rule is the heart of the bluff.
