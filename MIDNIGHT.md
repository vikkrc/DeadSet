# Dead Set: Midnight — rules and game spec

**Status: built for Beta 5 (2026-11-16).** The roadmap pitch left the wake order, table cards, special winners, ties and balance to design; the decisions are below and marked where they could be revisited.

One night, one vote, no second chances. **4–12 players**, about 10 minutes. One phone each, plus the TV.

---

## 1. Setup

- The deck holds **one card per player plus three table cards**. The three table cards lie face down in the middle: they are the **empty chairs** of the home screen.
- Everyone sees their own card once at the start (the deal). Nobody sees the table cards.
- Cards change hands during the night. **You are whatever card is in front of you at dawn**, not what you were dealt.

## 2. The cast

| Card | Side | At night |
|---|---|---|
| **Death** (×1–2) | Death | Wake together and see each other. A **lone Death** may look at one table card. |
| **Conspirator** | Death | Sees who is Death. Death does not see the Conspirator. |
| **Mimic** | copies | Looks at another player's card and **becomes that role**. Copying an action role (Mentalist, Double Agent, Witch, Gambler), it does that action at once; copying Death, the Conspirator or a Twin, it wakes with them in their turn; copying the Insomniac, it checks its own card at the end. |
| **Twins** (a pair) | Living | Wake together and see each other. |
| **Mentalist** | Living | Looks at one other player's card, **or** two of the table cards. |
| **Double Agent** | Living | Swaps their card with another player's, then looks at their new card. |
| **Witch** | Living | Swaps two other players' cards, without looking. |
| **Gambler** | Living | Swaps their card with a table card, without looking. |
| **Insomniac** | Living | Wakes last and looks at their own card. |
| **Vigilante** | Living | No night action. If voted out, the player they voted for dies too. |
| **Jester** | alone | No night action. Wins if voted out. |
| **Innocent** (×0–4) | Living | No night action. |

The cards are the existing role cards; the Twins use the Twins emblem and the Insomniac the *Insomnia* Dream's art.

## 3. The night (the phones narrate)

Steps, always in this order, each **10 seconds**:

1. Mimic · 2. Death · 3. Conspirator · 4. Twins · 5. Mentalist · 6. Double Agent · 7. Witch · 8. Gambler · 9. Insomniac

- A step runs if its card is **in the deck**, even when the card lies on the table, so nobody learns what is in play from how long the night lasts. Steps for cards not in the deck are skipped (the deck is public).
- Every phone shows the same step screen. Only the player who was **dealt** that card (or the Mimic who copied it) gets controls; everyone else's phone says to keep their eyes shut. The step always lasts its full time, acted or not.
- Actions use the cards as they are at that moment, in this order. Unanswered: the Gambler swaps with a random table card; everyone else does nothing.

## 4. The day and the vote

- **Discussion:** 5 minutes by default (3 or 7 in setup). The host can open the vote early.
- **The vote (30 s):** everyone points at one other player at once; a missed vote points at nobody.
- **Who dies:** the player(s) with the most votes, **if that is at least two votes**. A tie at the top: every tied player dies. If nobody has more than one vote, nobody dies.
- **The Vigilante:** if a player whose card is the Vigilante dies, the player they voted for dies too.

## 5. Who wins

Sides are read from the cards at **dawn** (a Mimic counts as the role it copied):

- **The Jester** wins if they die.
- **The Living** win if at least one Death dies. If no player holds Death, the Living win if **nobody** dies.
- **Death's side** (Death and the Conspirator) wins if no Death dies and the Jester did not die. If no player holds Death, Death's side wins only when the Conspirator is among the players and someone else dies.
- Several can win together (the Jester and the Living, for example).

**Match play:** every winner +1, the Jester +2. Scores carry over between games (1, 3 or 5 per match), and the table returns to the same lobby.

## 6. Setup (lobby)

| Setting | Options (default first) |
|---|---|
| Cards | **Recommended** (grows with the table, below), custom (−1/+1 per card; Death 1–2, required; Twins 0 or 2; Innocent 0–4; the rest 0–1; the total must be players + 3) |
| A lone Death peeks | **On**, off |
| Discussion | **5 min**, 3, 7 |
| Games per match | **1**, 3, 5 |
| Timers | Deal 15 s, night steps 10 s, vote 30 s |

**Recommended cards** (players + 3):

| Players | Cards |
|---|---|
| 4 | Death ×2, Mentalist, Double Agent, Witch, Insomniac, Innocent |
| 5 | + Gambler |
| 6 | + Conspirator |
| 7 | + Jester |
| 8 | + Vigilante |
| 9 | + Mimic |
| 10 | Innocent → Twins ×2 |
| 11 | + Innocent |
| 12 | + Innocent |

## 7. Screens

- **Deal:** your card turns over (the usual tarot flip); "I have seen it".
- **Night:** a still silver screen with the step's card and "The Witch wakes…"; the actor's controls sit on the same layout. No sound, no buzz, no colour change (Codex night rule).
- **Dawn:** a shared scene, then the day: the table, the deck in play as a reference (in wake order), and the discussion timer.
- **Vote:** tap a player and hold to point. The tally is shown as beads, then the dead, then the verdict.
- **End:** every card face up, **dealt → dawn**, and the whole night replayed step by step: who looked at what, every swap.

## 8. Practice bots

Bots act at random within their role (the Gambler and Witch pick at random, the Mentalist looks at a random player). By day a bot that knows it is Death points at a non-Death it knows of, others point at random among the players they have no reason to trust. Good enough to fill a table, not to win.
