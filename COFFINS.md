# Dead Set: Coffins — rules and game spec

**Status: built for Beta 3 (2026-11-12).** Bot simulations (300 games per table size) gave about 8 rounds at 3 players, 12 at 5, 21 at 8 and 26 at 10; every game ended by digs or the last one standing.

A quick bluffing game for **3–10 players**, about 10 minutes, chosen in the lobby next to the other modes. One phone each, plus the TV board as the graveyard.

Everyone buries coffins in their own plot. Most hold **gold**; one holds **your curse**. Players bid on how many coffins they can open without finding a curse, and the highest bidder has to dig. They start with their own grave.

---

## 1. How to win

You win the game **the moment** one of these happens:

1. **Two clean digs.** You win your **second challenge**. A challenge is won by opening every coffin you bid for without hitting a curse (§3). The number of challenges needed is a lobby setting: 1, **2** or 3.
2. **Last one standing.** Every other player has lost all their coffins, and so has no coffins left to play.
   - **Ghosts** (§4) still count as out until they rise.
   - A Revenant who rises is back in, so a player is only "last one standing" while every ghost is still a ghost.

**Nobody else shares the win.** There are no teams in Coffins. The Death coffin (§5) is held by a different hidden player each round; it is a weapon for that round, not a side.

**Edge cases:**
- **If both conditions are met by the same dig,** for example the Digger's clean dig also knocks out the last other player through a Death steal, the Digger wins.
- **If a steal or a loss would leave nobody with coffins,** for example the last two players knock each other out in one exchange, the player who still holds coffins after the dig resolves wins. If neither does, the Digger wins.
- **Match play (several games in a row):**
  - the winner +3;
  - every challenge won +1;
  - every ghost who rose +1.

  Scores carry over, as in Exorcism. The table returns to the same lobby after the end screen.

## 2. Your coffins

- Each player starts with **4 coffin cards**: **3 Gold** and **1 Curse**. A lobby option gives 5 cards (4 Gold and 1 Curse) for longer games.
- **Your own phone** shows your coffins: gold ones with a glint, the cursed one with the red seal. Both are dark wood of equal brightness, so a glance across the table gives nothing away.
- **The TV and other phones** only show how many coffins each player holds, and how many are buried in each plot.

## 3. A round

1. **The burial.**
   - **Everyone at once:** each player secretly buries one coffin (tap a card, then hold to bury). The TV lowers the first coffin into every plot together.
   - **Then by turns, clockwise,** from the round's first player. On your turn, either:
     - **Bury** another coffin from your hand on top of your stack; or
     - **Challenge:** open the bidding with *"I can open N"*. N is from 1 up to the number of coffins buried in total.
   - A player with nothing left to bury must challenge.
2. **The bidding.** Clockwise from the challenger, each player either **raises** (any higher number, up to the total buried) or **passes**.
   - A pass is final for this round.
   - A bid equal to the total ends the bidding at once.
   - The last player not to pass becomes **the Digger**.
3. **The dig.**
   - The Digger **must open all of their own coffins first**, from the top down.
   - Then they choose other plots, one coffin at a time, always that plot's **top** coffin. They pick a headstone on their phone or the TV, until N coffins are open.
   - Every lid creaks open on the TV. Gold glints and adds to the count; a curse ends the dig at once.
4. **The outcome.**
   - **All N opened, no curse:** the Digger wins a **challenge**, and their headstone turns gilt. Check the win (§1).
   - **A curse is found:** the Digger loses one coffin for good.
     - **Their own curse:** the Digger chooses which coffin to lose. The table doesn't learn which kind it was.
     - **Another player's curse:** that player blindly draws one of the Digger's coffins at random, and it is lost. Neither learns what it was.
     - The player whose curse was found starts the next round. If it was the Digger's own curse, the Digger chooses who starts.
   - **The Death coffin is found:** see §5.
5. **Reset.** Everyone takes back their buried coffins, minus any lost, and the next round begins.

**Running out of coffins:** a player whose last coffin is lost or stolen is **out** and becomes a ghost (§4). Check the win (§1).

## 4. Ghosts and Revenants (on by default)

- A player knocked out becomes a **ghost**: their headstone cracks and their portrait fades.
- **Ghost wagers:** before each dig begins, every ghost secretly wagers on its outcome on their phone: **Gold** (the dig comes up clean) or **Curse** (it fails, including on the Death coffin). Each correct wager lights a candle on their grave.
- **Three candles** and the ghost **rises** as a **Revenant**: back in the game with **one Gold coffin and no Curse**.
  - A Revenant can't bluff with a curse; it can only be dug or dig.
  - It can win normally.
  - If it is knocked out again, it becomes a ghost with its candles reset to zero.
- So players who are knocked out keep playing and keep the table loud.
- **Switched off,** a player who loses their last coffin is simply out.

## 5. The Death coffin (on by default)

- At the start of every round, **one random player** still in the game is secretly dealt the **Death coffin** in place of one of their Gold coffins, so no hand count gives it away.
- Only that player knows. It counts as a non-curse card for their own bluffing, and they bury it like any other coffin.
- **If a Digger opens it,** whether in their own stack or someone else's, the dig ends at once and fails:
  - **The Digger loses nothing to a curse.** Instead, the Death coffin's holder **steals one of the Digger's coffins at random** and adds it to their hand as **Gold**.
  - **If the Digger opened their own Death coffin,** they took it from themself, so nothing is stolen and the dig simply fails.
  - The holder is revealed with a scythe sweep on the TV.
- **At the end of the round,** the Death coffin leaves the holder's hand and the Gold it replaced returns.
- **For ghost wagers,** a dig that ends on the Death coffin counts as **Curse**.
- **Switched off,** there is no Death coffin.

## 6. Relics (off by default; a setup option)

When switched on, every player is dealt **one relic at random** at the start of the game. It is secret and used once, on your phone, at the moment shown.

| Relic | Art (reused) | When | Effect |
|---|---|---|---|
| **Lantern** | the Lantern mission card | Before the bidding starts, on your turn | Peek at the top coffin of one other plot |
| **Key** | the Key emblem | During your dig, before your first coffin | Open one other player's top coffin first, then carry on with your own |
| **Ward** | the Ward mission card | When you hit a curse, or the Death coffin | Nothing is lost or stolen. The dig still fails. |

- Using a relic is announced on the TV (*"Ada lights a Lantern"*). What it showed stays private.
- Relics are not refilled, and Revenants don't get a new one.

## 7. Setup (lobby)

| Setting | Options (default first) |
|---|---|
| Ghost wagers and Revenants | **On**, off |
| The Death coffin | **On**, off |
| Relics | **Off**, on |
| Challenges to win | **2**, 1, 3 |
| Coffins per player | **4** (3 Gold, 1 Curse), 5 (4 Gold, 1 Curse) |
| Games per match | **1**, 3, 5 |
| Timers | Burial 20 s, turn 30 s, bid 20 s, each dig pick 15 s, wager 10 s |

**Timeouts:**
- burial buries a random coffin;
- a turn buries one if you can, otherwise opens at 1;
- a bid passes;
- a dig pick opens a random plot;
- a missed wager counts as no wager.

Everything is validated per mode (Beta 0): nothing from another mode appears in this lobby.

## 8. Screens

**Phone:**
- your coffins along the bottom;
- the table's plots as headstones with stack counts;
- a large bid stepper with **Raise** (hold) and **Pass**;
- during your dig, tap a headstone;
- for ghosts, the wager buttons and their candles.

Everyone gets the same layout and the same prompts at the same moments.

**TV: the graveyard.**
- Headstones with portrait medallions in front of a WHERE backdrop.
- The coffin stacks, and the current bid on a bell-tower counter.
- **The dig is the show:**
  - lids creak open;
  - gold glints with a soft bell;
  - a curse bursts out with the red seal and a crack across the screen;
  - the Death coffin opens with a scythe sweep;
  - a ghost rising lights its three candles.

**Privacy:**
- Coffin faces are equally bright.
- Your own curse and the Death coffin never make a sound or a buzz on your phone.
- Losses are announced only as counts.
- Ghost wagers are secret until the dig resolves.

**End screen:**
- every coffin turned face up;
- the bid history as a graph;
- *who bluffed most* (bids made with a curse in their own stack);
- where the Death coffin went each round.

## 9. Cast (reused art)

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

**New art:** the coffin (lid and stack) and the headstones.

## 10. Practice bots

- **Burial:** a bot buries its curse first with probability ~0.35. A bot holding the Death coffin buries it early.
- **Bidding:** a bot estimates the safe count from its own buried non-curse cards plus a share of the others' stacks weighted by how they bid, and bluffs a raise sometimes.
- **Digging:** a bot opens the plots of players who passed early first, and avoids plots of players who bid high.
- **Wagers:** a ghost bot wagers at the curse rate it has seen so far.
- **Relics:** a bot uses the Lantern on the plot it would dig first, and the Ward automatically.

Simulations set the bluff rate and confirm a 6-player game of bots lasts about 8–12 minutes.
