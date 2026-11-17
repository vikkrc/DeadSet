# Dead Set: Mimic — rules and game spec

**Status: Beta 8, built 2026-11-17.** A cousin of Spyfall. The recommendations below were taken; open ideas for later are at the end.

Everyone at the table knows where you are, except the thing wearing a friend's face.

---

## 1. Players and cards

- **4–12 players.** One of them is the **Mimic** (the existing *Mimic* card); everyone else is **Living**.
- **The Living** see the same **location**: one of the 30 WHERE story cards, with its backdrop etching. Each also gets a **character** there: one of the WHO cards (*the Night-Shift Nurses*, *the Exiled Royals*…), different for every player. The character is a prompt for answers, not a rule.
- **The Mimic** sees only static, and the **board of possible places**.
- **The board of possible places:** 16 WHERE cards (12, 16, 20 or all 30, set in the lobby), the true one among them. Every phone and the TV shows it. Each phone can strike places out privately, as notes.
- The Mimic changes every game, and never the same player twice in a row.

## 2. A game

1. **The cards** (20 s): everyone looks at their card and taps *Ready*. Same screen, same timing, on every phone.
2. **Questions** (8 minutes; 6, 8 or 10 in the lobby): a random player holds the **lantern** and asks anyone a question about the place, aloud. They tap who they asked on their phone; the lantern passes to them, and they ask the next question. You may not ask back the player who just asked you.
   - The Living answer well enough to prove they have been there, but not so precisely that the Mimic can work the place out.
   - The Mimic bluffs, and listens.
3. **Accusations, at any moment:** any player may accuse someone, **once per game each**. The clock stops; everyone except the accused votes *Agree* or *Disagree* (30 s, missing votes disagree). Only a **unanimous** table convicts.
   - Not unanimous: the clock starts again where it stopped.
   - **The Mimic convicted:** caught (see *Last guess*).
   - **A Living player convicted:** the Mimic wins.
4. **The Mimic may unmask, at any moment:** it reveals itself and names the place from the board (30 s). Right: the Mimic wins. Wrong: the Living win.
5. **Time's up:** the final vote. Everyone, the Mimic included, points at one suspect (45 s). The most votes, with no tie, is convicted, with the same outcomes as an accusation. A tie, or no votes: the Mimic slips away and wins.

**Last guess** (on by default): a convicted Mimic gets one last guess at the place. Right, and it steals the win. This matches Exorcism's Demon, and keeps the Living from being too obvious about the place.

## 3. Scores (over a match of 1, 3 or 5 games; 3 by default)

| Outcome | Points |
|---|---|
| The Living win | every Living player +1; the accuser who caught the Mimic +1 more |
| The Mimic wins (wrong conviction, escape, or last guess) | the Mimic +2 |
| The Mimic unmasks and names the place | the Mimic +3 |

## 4. Screens

- **Phones:** your card (location and character, or static) at the top, tap to hide it; the lantern strip (who asks whom); the board of places with private strike-outs; *Accuse…* in the dock (choose a seat on the ring). The Mimic's card hides the *Unmask and name the place* hold button, so the phone looks like any other from across the table.
- **TV:** the board of places, the clock, the lantern passing round the table (the last questions drawn as arrows), accusations and votes live.
- **The sharpening backdrop (trust option, off by default):** the true location's backdrop sits **behind** the board, deeply blurred, and sharpens as time runs out: a clock the Mimic can read too, so the Living must act before it clears. Only TV boards receive the place, never phones; but anyone can open the board link, so it is for tables that trust each other.
- **Scenes** (shared on every screen): the deal, an accusation, the verdict, the unmasking, the final vote, the end with the place, every character and the Mimic revealed.

## 5. Setup (lobby)

| Setting | Options (default first) |
|---|---|
| Places on the board | 16, 12, 20, all 30 |
| Last guess for a caught Mimic | **On**, off |
| The TV backdrop sharpens (trust option) | **Off**, on |
| Games per match | **3**, 1, 5 |
| Timers | Cards 20 s, questions 8 min, each vote 30 s, the Mimic's guess 30 s, final vote 45 s |

## 6. Privacy

The location and characters reach only Living phones; the Mimic's identity reaches only the Mimic. Neither appears in public views before the end. With the trust option on, TV boards (only) receive the place for the blurred backdrop, which is never sharp before the end. Phones run identical flows.

## 7. Bots

Practice bots ask random players, accuse now and then late in the round, and vote at random (a Mimic bot always agrees to convict someone else). A Mimic bot unmasks late with a random guess. Good for pacing tests, not for strategy.

## 8. Later

- Two Mimics at big tables.
- A place that shifts halfway through.
- Characters with tiny secret instructions (side-mission emblems).
- A Witness who knows the Mimic but must stay hidden.
