# Dead Set — How the game works

Dead Set is a social-deduction party game for **5–13 players** (Custom mode goes up to 18 as an experimental setting). Every player uses **their own phone**. The server acts as narrator, so nobody has to sit out to run the game, and the host sees no more secrets than any other player.

This guide covers everything the app does. It follows the *Dead Set Complete Game Specification v1.0*. The decisions this implementation had to make on its own are listed at the end.

---

## 1. The idea in one paragraph

Most players belong to the **non-Death** faction. One or more are secretly **Death**, and the Death players know each other. By day everyone argues, nominates suspects and votes in secret to sentence **at most one** player. By night Death agrees on a kill, other roles use their powers, and every living player has a **Dream** that bends the night. The server resolves the night all at once and announces who died, but never how they died or what role they held.

| Layer | What it is | How long it lasts |
|---|---|---|
| **Role** | Your identity, faction and power | The whole match (a Mimic or Double Agent can change once, on Night 1) |
| **Dream** | A random one-night effect | One night |
| **Rule card** | A modifier for the whole match | The whole match |
| **Scenario** | WHO / WHERE / WHY flavour text | Storytelling only; it never changes the rules |
| **Status** | MUTE, NO VOTE, immunity, revival… | Fixed, short durations |

---

## 2. Winning

Checked after every complete resolution, never halfway through a night:

1. **Jester** (Full Deck only): if the Jester is **sentenced by the daytime vote**, they win alone, instantly.
2. If nobody is alive at all → **draw**.
3. If no Death-aligned player is alive → **non-Death wins**.
4. If living Death-aligned players **strictly outnumber** everyone else alive → **Death wins**. *Equal numbers is not a win.*
5. **Doomsday Clock** (optional): if nobody has won when Day *N* closes (default 3), Death wins. There is no Night *N*.

---

## 3. A match, step by step

### Setup (lobby)
1. The host taps **Create game** and gets a six-character room code and a QR code.
2. Players scan the QR code or type the code, then enter a name. Each phone gets its own private session token.
3. The host sets the **seating order** to match the real table (Fog of War and Sleepwalking use it), then picks a **mode**, the **Rule cards**, the **scenario** and the **timers**.
4. Everyone taps **Ready**. The host taps **Start match**. The server deals the roles using secure randomness.

### Night 0: reveal only
Each player turns over their role card on their own phone and taps **Understood**. Death players see their teammates. **Nothing else happens on Night 0**: no kills, no Dreams, no powers. Once everyone has acknowledged, Day 1 begins.

### Day
| Step | What happens |
|---|---|
| **Morning** | Dawn news: who died, who came back. Your private reports appear under *Only you know*. **Diplomat** may declare immunity (public). **Vigilante** may choose a shot (secret). When the host opens discussion, shots resolve together and victory is checked. |
| **Discussion & nominations** | Talk. Each living player may make **one formal nomination** per Day. Naming someone who is already nominated seconds it, which adds no vote weight. A Diplomat-immune player cannot be nominated. Self-nomination is off unless the host enables it. If nobody is nominated, there is no vote and no sentence. |
| **Defence** | Each nominee gets the floor in nomination order. A MUTE nominee must plead without words. |
| **Secret ballot** | Each eligible living player picks one nominee or **Abstain**. You can change your ballot until the host locks the vote (or the timer ends). Only totals are published, never who voted for whom. |
| **Sentence** | The **single highest** total is sentenced. A **tie at the top**, zero votes, a failed Majority Rule, or a winning Gambler bet means **nobody** is sentenced. |
| **After a no-sentence** | The lowest-seat living **Scapegoat**, if any, dies instead. This counts as a kill, not a sentence. |
| **Equal Exchange** (rule card) | A sentenced Death-aligned player may take one living non-Death player with them. |

### Night
1. **Dreams are drawn**: one random Dream per living player, duplicates allowed. Only **Dream Snatchers** see their card at this point; they may swap Dreams with another player. Everyone taps *Close my eyes*, so the length of this step doesn't reveal whether anyone held a Snatcher.
2. **Night actions**: each player sees their final Dream and their own action. Death players share a private room. Everyone commits or passes, then taps **Sleep**.
3. When everyone is asleep (or the timer ends), the server resolves everything at once (see §8). Survivors get their private reports, and Day *N+1* begins.

The app hides your night behind a privacy veil until you tap **Show my night**, and you can cover it again at any time.

---

## 4. Roles

### Core (always present)
| Role | Faction | Power |
|---|---|---|
| **Death** | Death | Every night the living Death team agrees on **one shared kill**. Every member must confirm exactly the same target set or nobody dies. Capacity is 1, raised to 2 by Double Jeopardy, Night Shift or Power Surge, with a hard cap of 2. |
| **Innocent** | Non-Death | No power. Argue and vote. |
| **Mentalist** | Non-Death | Each night, read one other player: **DEATH-ALIGNED** or **NOT DEATH-ALIGNED**. You never learn the exact role. |
| **Guardian** | Non-Death | Each night, shield one player (yourself allowed) from **the Death kill and the Psycho only**. It does not stop bombs, the Vigilante, the Scapegoat or linked fates. |
| **Psycho** | Non-Death | **Once per game**: give a player **MUTE** (cannot speak, can still vote) or **NO VOTE** (can speak, cannot vote) for the next Day only. Guardian, Guardian Angel and Witch Bless block it, and the charge is spent either way. |

### Standard extended (enabled from 7 players)
| Role | Power |
|---|---|
| **Whore** (alias Companion) | Visit someone each night. If you visit an active Death, **the whole Death kill fails**. If the person you visit is killed by Death, you die too; if they are bombed, you are caught in the blast. |
| **Traveling Agent** | Deliver a flavour "product". The recipient learns at dawn that a Traveling Agent visited them. It has no mechanical effect. |
| **Terrorist** | Bomb a door each night: a fair 50/50. On YES the target dies, plus any Whore visiting them. Guardian does not help; Guardian Angel, Witch Bless and revival do. |
| **Mimic** | **Night 1, mandatory**: permanently copy another player's role and faction, with fresh charges. The new powers start on Night 2; a copied Death joins the team on Night 2. If you copy a Mimic or don't choose, you become a powerless Mimic. |
| **Double Agent** | **Night 1, mandatory**: secretly choose DEATH or NON-DEATH, permanently. Choosing Death joins the Death team from Night 2; no choice means non-Death. |
| **Diplomat** | **Once per game**, in the morning: publicly declare immunity from nomination and sentencing for that Day. |
| **Scapegoat** | Passive: if a Day ends without a sentence, you die. |
| **Necromancer** | **Once per game**: raise one eliminated player for the next Day and Night. They can't be killed while raised and expire after that Night. You must survive the night for it to work. Nobody can be raised twice. |
| **Conspirator** | Your ballot weighs +1. Each night you may open a private whisper with one player, who sees you only as "Stranger". |
| **Magistrate** | Your ballot weighs 2 (3 under Paranoia). |

### Full Deck additions
| Role | Power |
|---|---|
| **Oracle** | Once: predict Death's target tonight. If you're right, that player survives one Death kill. |
| **Gambler** | Once: bet on tomorrow's **first formal nominee**. If you're right, that Day's sentence is cancelled. |
| **Vigilante** | Once, in the morning: shoot a player. This is a kill, not a sentence, and Diplomat immunity doesn't stop it. |
| **Jester** | Independent. You win alone **only** if sentenced by vote. |
| **Bodyguard** | Guard someone each night. If Death would kill them and nothing else saves them, you die in their place (at most once per night). |
| **Bard** | Once: *Silence the Night*. Every role power that night fails, Death included. Dreams still work. |
| **Witch** | Each night: **Bless** (protects from harmful role actions and bombs) or **Curse** (the target's next targeted action fizzles; cursing an active Death blocks the kill). Never on yourself. |

### Role counts
| Players | Death | Innocent | Guardian / Mentalist / Psycho | Extended |
|---:|---:|---:|---|---:|
| 5 | 1 | 1 | 1 each | 0 |
| 6 | 2 | 1 | 1 each | 0 |
| 7 | 2 | 1 | 1 each | 1 |
| 8 | 3 | 1 | 1 each | 1 |
| 9 | 3 | 2 | 1 each | 1 |
| 10 | 3 | 2 | 1 each | 2 |
| 11 | 3 | 2 | 1 each | 3 |
| 12 | 4 | 2 | 1 each | 3 |
| 13 | 4 | 3 | 1 each | 3 |

From 14 players the cycle continues: +Extended, +Death, +Innocent (Custom mode only, flagged as experimental). Extended roles are drawn **secretly** from the mode's pool.

---

## 5. Dreams (from Night 1, one per living player per night)
| Dream | Effect |
|---|---|
| **Sleep Paralysis** | You can't use your role tonight. If you're an active Death, the whole kill is blocked. |
| **Premonition** | At dawn, learn the name of one living Death-aligned player. |
| **Whispers of the Past** | At dawn, learn the exact role of one random dead player. |
| **Sleepwalking** | Bound to the player seated just before you: if they die tonight, so do you. |
| **Dream Snatcher** | Before actions open, you may swap Dreams with another player (swaps resolve once each, in seat order). |
| **Night Shift** | One extra use of a repeatable power on a second target. For Death, team capacity becomes 2. |
| **Shared Nightmare** | Pick a partner. If they die tonight, you die too. |
| **Insomnia** | At dawn (if you survive) you get a full chronological report of tonight's actions. |
| **Guardian Angel** | Tonight you're immune to Death, Psycho, bombs, Witch Curse and linked deaths. |

---

## 6. Rule cards (1–3 per match)
| Rule | Effect |
|---|---|
| **Fog of War** | During discussion you may only talk to your seat neighbours. In remote play the table chat is replaced by neighbour whispers. |
| **Double Jeopardy** | Death may kill up to 2 per night. |
| **Paranoia** | Every living ballot gets +1 weight (Magistrate 3, Conspirator 3). |
| **Unreliable Power** | Every night role action rolls a d6; 1–3 fails. Death rolls once for the team. |
| **Power Surge** | Each night one random repeatable power-holder gets an extra use. Death counts as one entry. |
| **Equal Exchange** | A sentenced Death-aligned player may take one non-Death player with them. |
| **Cursed Silence** | Speak only when directly addressed (honour rule). |
| **Majority Rule** | A sentence needs **more than half** of all eligible living voters' weight. Abstainers still count in the denominator. |
| **Hidden Roles** | Roles of the dead are never shown before the end (this is already the default). |
| **Vengeful Ghosts** | The dead cast one weight-1 ghost ballot per Day. Ghost ballots never count under Majority Rule. |

The lobby warns about combinations that interact or overlap (for example Majority Rule + Vengeful Ghosts).

---

## 7. Modes
| Mode | Players | What's different |
|---|---|---|
| **Standard** (recommended) | 5–13 | 10-role extended pool from 7 players, Dreams on, 1–3 Rule cards. |
| **Classic / Learn** | 5–13 | Core roles only; extended seats become Innocents (and the lobby says so). Dreams off by default; 0–1 simple Rule (Double Jeopardy, Paranoia, Majority Rule or Hidden Roles). |
| **Full Deck / Chaos** | 7–13 | All 17 extended roles, including Jester, Bard and Witch. |
| **Doomsday** | 5–13 | Standard + the Doomsday Clock (default 3 Days, configurable). |
| **Custom** | 5–18 | Choose the extended pool, Dreams on/off, the clock, 0–3 rules, or type an **exact deck** (`Death x2`, `Guardian`, …). It validates the count, requires at least one Death and forbids a starting Death majority. |

**How you play is a separate choice from the mode:**
- **Same room**: talk face to face. MUTE, Fog of War and Cursed Silence are honour rules.
- **Remote**: adds an in-app table chat during the Day. MUTE players can't post, and Fog of War limits you to neighbour whispers.
- **Trusted moderator**: when creating a room you can choose to moderate instead of playing. The moderator sees every role, Dream and vote, holds no seat, and every player is told. Only a moderator can hand-assign roles.

---

## 8. Night resolution order

All night choices are collected first, then resolved in this fixed order. The order in which phones submitted never matters.

1. **Suppression**: Unreliable Power dice. Bard silence cancels every role power. Sleep Paralysis blocks its holder (an active Death holding it blocks the kill).
2. **Witch Curse and Whore visits**: a curse fizzles the target's first targeted action; a curse on an active Death, or a Whore visiting one, blocks the Death kill.
3. **Conversions**: Double Agent first, then Mimic. They are visible to the Mentalist tonight, but the new Death members don't take part in tonight's kill.
4. **Death kill**: for each target, the first applicable protection stops it, in this order: *temporary revival → Guardian Angel → Witch Bless → Guardian → correct Oracle*. Otherwise a **Bodyguard** dies in their place; otherwise the target dies.
5. **Psycho**: the status lands unless the target died or is protected (revival, Angel, Bless, Guardian).
6. **Bombs and other actions**: bombs (protected by revival, Angel or Bless only, and visiting Whores are caught in the blast), Mentalist readings, deliveries, Oracle results and Gambler bets.
7. **Necromancer** raises the dead, if the Necromancer survived.
8. **Linked fates** repeat until nothing changes: a Whore dies with their Death-killed host; Shared Nightmare and Sleepwalking holders die with their partner. Only revival or Guardian Angel prevents a linked death. Then any expired revivals die.
9. **Dawn**: only survivors get their private reports. The public sees who died and who returned, never causes or roles.

Charges are spent when a valid action is **submitted**, even if it's then blocked or fails its roll.

---

## 9. Phones, connections and fairness

- **The server is authoritative.** It deals the roles, draws all randomness, holds every secret and resolves every action. Each phone receives only its own filtered view, and other players' roles are never sent to the browser.
- **Timers**: each window can have a deadline. Missing input becomes **pass** (or **abstain**, or "no retaliation"). A Double Agent who doesn't choose stays non-Death, and a Mimic who doesn't choose becomes powerless. The host can add 30 seconds before a window closes.
- **Disconnects**: a dropped phone keeps its seat, role and committed actions. When it comes back it reloads the current state.
- **New device**: the host issues a one-time **recovery code** (valid 15 minutes) from *Host controls → Recover a player's seat*. Entering it signs the old device out.
- **Host leaves**: after a minute away, a majority of the connected players can vote to hand the *public* host controls to someone else. Moderator secrets are never transferred.
- **Public board**: open `/board/ROOMCODE` on a TV. It shows only public information.
- **End of match**: every role is revealed (the host can turn this off), and the host can start a new match at the same table.

---

## 9b. How the app feels to use

- **The table.** Everyone sits around a ring in seating order. To nominate, vote, aim, kill, protect or pick a dream partner, you **tap a seat**. Seats you can pick gently breathe; the rest dim. The ring's outer edge burns down as the phase timer.
- **Moments.** Big public events get a short full-screen scene on every phone: *Night falls*, *Dawn* (the dead are struck through one by one), *The town decides* (vote bars, then a SENTENCED or SPARED stamp), and the final verdict with a celebration. Tap to skip. After each dawn, every living player also gets a private *Your night* card. Everyone gets one, even if it's empty, so it gives nothing away.
- **Hold to confirm.** Host advances, starting the match and declaring Diplomat immunity are **press-and-hold** buttons, so nobody skips a phase by accident.
- **Night privacy.** Your night starts behind a curtain (*Open your eyes*), and you can cover it again at any time. Once you commit, you see a sleeping screen whose moon fills up as players go to sleep. It shows a count only, never who.
- **Sound and vibration** (toggle in the top bar). They only fire for public events and your own taps. Private information (your role, a Mentalist reading, a Premonition) never makes a noise or a buzz that could give you away across the table.
- **Reduced motion.** If your device asks for reduced motion, the animations and particles are switched off.

## 10. Interpretation notes (where the spec was open)

The spec resolves almost everything. Where it left room, this build does the following:

- **Death targets**: Death may target any living player who isn't on the active team.
- **Bomb blast**: a Whore visiting a bombed player is caught in the blast even if the bombed player themselves was protected.
- **Bodyguard sacrifice**: the Bodyguard's own protections (revival, Angel, Bless, Guardian) can save them when they take the blade.
- **Witch spells resolve together**: one curse can't cancel another witch's spell, and a Bless also shields its target from a Curse.
- **Conspirator whisper**: the partner sees the Conspirator only as "Stranger", because the channel's existence would otherwise expose the role. The whisper opens live during the night, so Bard silence can't retroactively close it.
- **Insomnia report**: names the roles of the actors (it is "deliberately powerful"), but describes the Death kill as "the Death faction" without naming its members.
- **Dream Snatcher privacy**: every living player has to tap *Close my eyes* in the swap window, so nobody can tell from timing whether a Snatcher exists.
- **Gambler**: a correct bet cancels the sentence even if the Gambler died overnight, because the bet was locked when it was placed.
- **Nominations**: one formal nomination per player per Day. A MUTE player can still nominate (the MUTE rule says so explicitly).
