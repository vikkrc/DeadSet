# Dead Set: Missions — rules and game spec

*Version 1. The rules here are the contract the engine (`engine/missions.js`) implements and the tests check.*

Death has slipped into the expedition. Every round a **Mission Leader** assembles a team, the whole table votes on it, and the team secretly plays **Succeed** or **Sabotage**. The first side to three missions *nearly* wins: each side has one last chance at the end. Nobody is eliminated. Everyone plays to the last card.

---

## 1. Sides

| Side | Goal |
|---|---|
| **The Living** | Make three missions succeed, then keep the Medium hidden from Death. |
| **Death** | Sabotage three missions and survive the Last Stand, or find the Medium. |

### Table sizes

| Players | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|
| Death | 2 | 2 | 3 | 3 | 3 | 4 | 4 | 4 |
| Living | 3 | 4 | 4 | 5 | 6 | 6 | 7 | 8 |
| Team sizes, missions 1–5 | 2·3·2·3·3 | 2·3·4·3·4 | 2·3·3·**4**·4 | 3·4·4·**5**·5 | 3·4·4·**5**·5 | 3·4·4·**5**·5 | 3·4·4·**5**·5 | 4·4·5·**6**·6 |

11 and 12 players were tuned with bot simulations (300 games per size): with 4 Death, both land at Death 51–53 %, in line with 8–10 players. Five Death at 12 players pushed Death to about 58 %.

A **bold** mission needs **two** Sabotage cards to fail. Every other mission fails with one.

## 2. Roles

Every table has a **Medium** and a **Reaper**. The others are lobby switches. Unfilled seats are plain **Companions** (living) and **Shades** (Death).

| Role | Side | Knows | Power |
|---|---|---|---|
| **Medium** | Living | Every Death player, except the Veiled | Must stay hidden: if Death names them in the Reckoning, Death wins. |
| **Believer** *(on by default)* | Living | Two candles: the Medium and the Charlatan, without knowing which is which. Only the Medium if there is no Charlatan. | Protect the Medium, often by acting like them. |
| **Companion** | Living | Nothing | — |
| **Reaper** | Death | Death team | Makes the final call in the Reckoning. |
| **Charlatan** *(on by default)* | Death | Death team | Appears as a candle to the Believer. |
| **Veiled** *(off)* | Death | Death team | Hidden from the Medium. |
| **Stray** *(off)* | Death | Nobody; Death doesn't know them either | Still seen by the Medium. Joins the others at the Reckoning. |
| **Shade** | Death | Death team (except the Stray) | — |
| **Undertaker** *(off)* | Living | — | When a mission fails, privately learns how many Death players were on that team (Veiled and Stray included, whatever they played). |
| **Twins** *(lobby switch "Twins", off)* | Living | Each other | Two Companions become Twins who know they are both Living. Strong for the Living: the lobby suggests pairing them with the Veiled or the Stray. |
| **Jester** *(off, 7+ players)* | Itself | Nothing | Takes a Living seat but is neither side: the Medium does not see it, the Candle shows it as Living, and it may play Succeed or Sabotage. Wins alone if the Last Stand names it, or the Reaper names it in the Reckoning. |

**Seats:** Death has the Reaper plus the optional Death roles switched on. The Reaper always takes one Death seat, so at 5–6 players (2 Death) only one optional Death role fits. The lobby refuses more Death roles than Death seats.

## 3. Setup

1. Seats are dealt in secret. Each phone shows your role card and what you know. Everyone taps **Understood**.
2. **The lottery:** a lantern hand spins around the table on every screen and lands on the first **Mission Leader**. The first mission, and its proposal timer, only start after the draw.
3. The player to the **right** of the first Leader holds the **Candle**.
4. The story (WHO / WHERE / WHY) is dealt as in the base game. The WHY is what the five missions are for.

## 4. A round

### 4.0 The story
With the preset story cards, every mission opens with a short chapter card before anything else. It has three parts:
- **The step:** what this mission is for, taken from the WHY card. Each WHY has five steps that build to a climax, e.g. *Find a Hidden Treasure: 1. Find the torn map … 4. Open the vault … 5. Carry the gold out*.
- **The line:** the who, where and why in one sentence, e.g. "The Space Explorers in a Haunted Mansion must Find a Hidden Treasure: 4. Open the vault."
- **The scene:** what the place throws at you on this mission, taken from the WHERE card. Each WHERE has five, e.g. a Haunted Mansion's *"Dinner is laid for exactly one more guest than you are."*

The chapter card plays over that location's TV backdrop, and only then is the mission card turned. Host-written cards get generic chapters instead ("The point of no return"). The step also stays on the mission banner while the mission lasts.

### 4.1 The mission card
At the start of each mission, **before any team is put together**, a mission card is drawn and shown to everyone. It stays in force for the whole mission, through every proposal, so it shapes how people propose and vote.

Most missions get a **Regular Mission** card with no effect. The lobby sets how often something else appears:

| Mission cards | Chance of a special card |
|---|---|
| Off | 0% |
| Rare *(default)* | 25% |
| Sometimes | 40% |

Each special card appears **at most once per game**. A card is only drawn when it can apply to that mission (see §7). If none can, the mission is Regular.

### 4.2 Proposal
The Leader picks exactly the team size by tapping seats. They may include themselves. Some cards add requirements (§7). The table can talk as long as it likes; the host can set a timer.

### 4.3 The team vote
**Everyone** at the table votes **Approve** or **Reject** in secret. When all have voted (or the timer ends), the votes are revealed **all at once**, with names.
- **Approved** (more than half approve) → the team goes on the mission.
- **Rejected** → leadership passes to the **next player to the left** (the next seat clockwise), who proposes a new team for the same mission.
- **The fifth proposal** of a mission (after 4 rejections) **goes ahead whatever the vote**. It is still voted on, and the votes are still shown, because how people vote on it is evidence.
- A missing vote counts as **Approve**.

### 4.4 The mission
Each team member secretly picks a card on their phone:
- the Living can only play **Succeed**;
- Death may play **Succeed** or **Sabotage**.

Both cards look the same on every phone until tapped, so a glance at a neighbour's screen reveals nothing. A missing card counts as **Succeed**.

### 4.5 The reveal
The cards are **shuffled** on the server and turned over one by one on every phone and the TV. The mission **fails** if the number of Sabotage cards reaches the requirement (1, or 2 on a bold mission). The result is added to the track, and the Gazette records the card, the team, every vote and the result.

### 4.5b Who leads the next mission (lobby setting)
- **Next in line** (default): leadership passes to the next player to the left.
- **Chosen by the last leader:** at the night interlude, the leader whose team went hands the lantern to anyone who has **not yet led a mission that went ahead**. Leading a rejected proposal doesn't count. If they choose no one in time, it goes to the next eligible player in line. Rejected proposals within a mission still pass to the next player to the left.

### 4.6 The night interlude (after missions 1–4, unless the game is over)
A short night, with the night score. Every player gets the same night screen and **must pick one seat as their Hunch**. Anything you pick counts as soon as you tap it (who they suspect most). Hunches are private and only shown at the end, but because *everyone* taps, nobody can tell who is doing something more. Alongside their Hunch:
- **The Candle** (after missions 2, 3 and 4): the holder picks a player who has **never held** the Candle and privately learns their side (*Living* or *Death*). The Candle passes to that player. *Who* checked *whom* is public; the answer is not. The pick counts as soon as it is tapped, even if the night ends before the holder goes to sleep. At dawn the holder gets a private *By Candlelight* reveal.
- **Witness** / **Haunted Road** cards act here (§7).

At dawn, **Clues** may arrive (§5). Leadership passes to the next player to the left, and the next mission's card is drawn.

## 5. Clues
The base game's Clues, set in the lobby: **Off / Rare 15% / Uncommon 30% / Common 50%** chance per night. When they come, up to **two** random Living players (never the Medium) each receive one true clue in their dawn report:
- *one of A and B walks with Death*
- *B is not Death-aligned*
- *someone seated within two seats of B walks with Death*
- *Death had someone on mission N* / *nobody from Death went on mission N*

## 6. The end

### 6.1 Three successes → the Reckoning
Death reveals itself: every Death player, the Stray included, is shown to the whole table. Death may talk openly. Each Death player can **suggest** a name on their phone, and the **Reaper names the Medium**.
- Right → **Death wins.**
- Wrong → **the Living win.**

If the timer runs out, the most-suggested player is named (ties: the Reaper's own suggestion, then a random pick).

### 6.2 Three failures → the Last Stand
Everyone, Death included, votes for **one player** they believe is Death. Votes can change until the last one is in (or the timer ends). The most-voted player is named. A tie is settled by the **coin toss** among the tied players.
- The named player is **not** Death → **Death wins.**
- The named player **is** Death → the **Reckoning** (§6.1) follows. Death can still win by finding the Medium.

So every Living victory has to survive the Reckoning. The Medium can steer the Last Stand to save the game, but doing so may give them away.

## 7. Mission cards

| Card | Effect | Drawn when |
|---|---|---|
| **Regular Mission** | No effect. | Always possible (most missions). |
| **Lantern Bearer** | The Leader must be on the team. | Nobody is haunted this mission. |
| **Fresh Faces** | At least half the team (rounded up) must not have been on the previous mission. | Missions 2–5, if a valid team exists. |
| **Extra Hand** | The team is one player larger. | The larger team leaves at least one player out. |
| **Skeleton Crew** | The team is one player smaller (minimum 2). | The team would be 3 or more. |
| **Masked Vote** | Team votes show only the totals, not who voted how. | Any mission. |
| **Short Patience** | The **third** proposal goes ahead whatever the vote (instead of the fifth). | Any mission. |
| **Ward** | With the team, the Leader names one member who is **warded**: their card is forced to Succeed. Public. | Any mission. |
| **Steadfast** | One more Sabotage than usual is needed to fail. | The requirement stays at or below the team size. |
| **Brittle** | A single Sabotage fails it, even on a bold mission. | Only on a bold mission. |
| **Smoke** | Only the result is shown, not how many Sabotage cards were played. | Any mission. |
| **Grand Mission** | The result counts **twice** on the track. | Missions 2–4. |
| **Trail** | If it succeeds, one random Living team member finds a clue at night. | Missions 1–4. |
| **Witness** | At night, the Leader of the team that went privately sees **one** other team member's card. | Missions 1–4. |
| **Haunted Road** | If it fails, the Reaper picks one of its members at night; that player can't be on the next mission's team. | Missions 1–4. |

**Logic notes:**
- Effects on team size apply before any requirement. Steadfast and Brittle change the requirement; Grand changes how much the result counts.
- A **haunted** player can still lead, vote and hold the Candle. They just can't be picked for the team. If the Leader is haunted, they lead without going.
- Fresh Faces counts "the previous mission" as the team that actually went.
- A Grand Mission can take a side straight to 3. The game always ends by mission 5, because five results always give one side three.

## 8. Timers (host settings; 0 = no limit, the host moves things on)

| Phase | Default | When it runs out |
|---|---|---|
| Proposal | none | The host may pass leadership on. That counts as a rejected proposal. |
| Team vote | 60 s | Missing votes → Approve |
| Mission | 45 s | Missing cards → Succeed |
| Night interlude | 45 s | Missing Hunch → none; Candle unused; Witness skipped; Haunted Road → random team member |
| Last Stand | 240 s | Votes so far count; no votes at all → a random player is named |
| Reckoning | 180 s | Most-suggested player (see §6.1) |

## 9. What every phone and the TV show

- **The mission track:** five discs (team size, bold for two-sabotage missions); each turns gold or red when done, with a "×2" mark for a Grand Mission.
- **The rejection track:** 1–5 marks; the hammer mark glows on the proposal that will go ahead regardless.
- **The mission grid** (phones' record and TV): who was on each mission, who led, how everyone voted, the card and the result. It's the deduction aid players otherwise keep on paper.
- **Big moments:** the mission card turning over; the vote flip (every portrait flips to a gold or red token at once); the **card reveal** (cards slide in face-down, shuffle, and turn one at a time with a heartbeat; a Sabotage card cracks and bleeds red, a Succeed card flares gold; then a SUCCEEDED / FAILED stamp); the Last Stand verdict; the Reckoning (Death unmasks, then the Reaper's choice is turned over).
- Private moments only ever appear on the owner's phone: their role and knowledge, the Candle result, a Witness card, clues.

## 9b. Sound
The TV board's score has its own Missions soundscapes, one per phase:

| Phase | Soundscape |
|---|---|
| Role reveal | A lantern-lit drone with a music box |
| Proposal | A travelling ostinato over a soft marching drum |
| Team vote | A ticking clock against a slow heart |
| Mission | A dark drone, a slow drum and held breath |
| Reveal | Near-silence, so the cards carry the room |
| Night interlude | Candle crackle and a gentle music box |
| Last Stand | War drums and voices |
| Reckoning | Tolling bells, a choir and a slow heart |

Moments have their own stings: a horn call for each chapter, card flips (a gold chime or a crack), the vote reveal, a match strike for the Candle, war drums for the Last Stand, and a choir stab when Death unmasks.

## 10. Practice bots
Bots work in Missions too:
- They propose valid teams and vote with simple heuristics.
- Death bots sabotage most of the time (less often when another Death is on the team).
- They take their night actions, and in the Last Stand and the Reckoning they vote with what they know.

## 11. Side Missions (lobby switch, off by default)

Everyone is dealt one **secret personal objective**, all different, from a pool of 24. They only look at things both sides can do in the open (going on missions, leading, team votes, proposals, the Candle, Hunches) and are dealt the same way to everyone, so holding one never reveals your side. Examples: *Go on at least two missions*, *Never vote Reject*, *Vote Approve on a team the table rejects*, *Go on a mission together with the player on your left*, *Never change your Hunch*.

- They are judged automatically after every vote, mission and night, and the owner learns at once (a private card on their phone).
- A **reach** objective succeeds the moment it is met; a **keep** objective fails the moment it is broken.
- When the Last Stand opens (or the game ends), open ones are settled: an unmet reach fails, a kept promise succeeds.
- **In the Last Stand** a completed Side Mission makes your vote count **double**; a failed one counts **half**. Ties still go to the coin.
- They are listed for everyone on the end screen.

## 12. Hunches at the end
During the Reckoning (and on the end screen) portraits glow with how many Hunches pointed at them. The end screen and the TV draw **Who suspected whom**: an arrow per Hunch, gold onto Death, grey onto the Living, dashed red from Death.

## Not yet (planned)
- A "Swift" option with no team votes
