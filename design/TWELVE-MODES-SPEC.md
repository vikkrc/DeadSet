# DEAD SET — TWELVE NEW GAME MODES
## Rules, State Machines, Scoring, Edge Cases and Implementation Contract

**Version:** 1.0 — 17 November 2026  
**Purpose:** Implementation handoff for Claude or another developer. This document fixes the rules left open in early game pitches. It is the intended gameplay specification for these twelve *proposed* modes, not a claim that any has been implemented or playtested.  
**Target project:** `vikkrc/DeadSet`, active development branch `claude/serene-franklin-v9ujky` (verify current branch head before modifying code).  
**Important:** Do not write to `main` assuming it contains the app: when reviewed, `main` held only a minimal README. Preserve and extend the active app branch, and check for new changes before each implementation.

### Chosen titles and canonical mode IDs

| Title shown to players | Internal `mode` / preset ID | Players | Type |
|---|---|---:|---|
| The Gazette | `gazette_game` | 4–10 | Creative trivia / bluffing |
| The Omen | `omen` | 4–12 | Simultaneous prediction |
| **The Vigil** (formerly “The Choir”) | `vigil` | 4–10 | Silent cooperative ordering |
| The Vault | `vault` | 4–10 | Cooperative logic puzzles |
| The Mirror | `mirror` | 4–12 | Social prediction |
| **Inheritance** (formerly “The Testament”) | `inheritance` | 4–12 | Negotiation / voting |
| **Treasure Hunters** (formerly “Death’s Door”) | `treasurehunters` | 4–12 | Push-your-luck expedition |
| The Ritual | `ritual` | 5–10 | Cooperative runes with a hidden cultist |
| **Confessions** (formerly “Confession”) | `confessions` | 4–10 | Two truths, one lie / interrogation |
| The Black Market | `blackmarket` | 3–9 | Auctions / counterfeits |
| Standoff | `standoff` | 4–12 | Simultaneous threats / brinkmanship |
| The Pact | `pact` | 4–12 | Trust / betrayal / repeated partnerships |

**Naming collisions:** The existing `public/gazette.js` is the Dead Set Gazette *newspaper/recap interface*, not the new trivia game. Do not replace it. Use `engine/gazette_game.js`, `public/gazette_game.js` and dedicated assets. The current app also has **Graverobbers**, a *two-team grave-grid word association game*. **Treasure Hunters** below is an entirely different push-your-luck expedition and must not repurpose `graverobbers` code or identifiers.

---

# A. SHARED IMPLEMENTATION CONTRACT

These rules apply to all twelve modes unless a mode section explicitly overrides them.

## A1. Product and architecture

1. One authenticated phone per seated player. An optional TV/table display gets **public** information only. The in-person experience relies on speech; remote rooms may use the existing table chat when the game does not explicitly forbid talking.
2. The server is the only source of truth. All hidden cards, roles, decisions, dice, predictions, puzzle answers, and pending actions live on the server. Client messages are **requests**, never authoritative outcomes. Clients must not receive other players' private data, even hidden in DOM elements, JS objects, CSS, event payloads or animation data.
3. Reuse the existing `engine/` pattern: pure functions over serializable match state, injected seeded/secure RNG, mode-specific settings validators, `start*`, `*Command`, `*Advance`, phase detection, filtered per-audience views, public logs, individual private logs, and terminal results. Reuse the current `RoomManager`, session recovery, SSE updates, timers, idempotency keys, interludes, and shared UI language/style.
4. Every mode gets a **distinct** preset, mode-local state object, phase prefix, settings namespace, client entry/UI, tests and handbook page. The `modeOf`/mode registry, setup validation, dispatchers, host-advance logic, deadline handlers, bots and audience views must all recognize the new mode.
5. Phase changes are atomic and increment `phaseSeq`/`phaseId`; a command is valid only for the current phase, its permitted actor and its allowed payload. Repeated submissions from the same player **replace** their previous submission until the deadline/lock unless the phase explicitly marks an action irreversible. Duplicate idempotency keys must not double-apply an action or reward.
6. Actions due simultaneously are collected privately and resolved together. Never reveal early submitters, choices, action timestamps or other player-specific information before resolution. A generic **“X of N ready”** count may be shown if the count itself cannot reveal a secret role; otherwise use a fixed timer and generic waiting state.
7. Timers are authoritative server deadlines. A timer ending invokes the mode-specific fallback stated below. Host may extend a deadline by +30 seconds before it closes, not undo committed actions after a reveal. If everyone validly submits, a simultaneous phase may close early **only** if the resulting end timing does not leak protected role information. Public interludes lock inputs before the next phase's timer starts.
8. A disconnect never removes a seat midgame. The disconnected player retains inventory/score/role and can recover the seat with the app's standard recovery flow. Their missing input resolves through the specified timeout. No mode may wait indefinitely for an unavailable player.
9. The game ends only through its described terminal condition, with a winner/tie/draw or a cooperative win/loss. Never reuse Classic Death victory checks, Dreams, Rule cards or night phases in unrelated modes. Every mode must have finite rounds, finite material or a hard timeout.
10. Keep a complete **server-side** action history. Midgame public recaps must exclude hidden information; the end-game reveal may show the true actions and hidden material, subject to the room's end-reveal setting. Preserve score history, per-round outcome and a clear visual explanation of why a winner won.

## A2. Scoring, ties and math

- All points, coins, treasure and penalties use integers. Scores **may be negative** where a mode specifies a penalty; inventory currencies (spendable coins, Influence, seals, cards) may not go below zero. If a transfer requires more *points* than the payer currently has, the score may become negative; if it requires more *currency* than available, reject the transaction.
- **Competitive final ties share victory** unless the mode provides a tie-break. Do not pick a random champion to conceal a draw. The UI must say *Joint winners* when appropriate.
- `floor(x)` means mathematical floor; `mod 3` is normalized to `0, 1, 2`, even when offsets are negative.
- Score is stored with player IDs, not seats or display names. Scores reset at the start of a new game. A *Play again, same table* flow retains the same players and selected settings, and may separately maintain the existing cumulative match leaderboard; it must not accidentally carry inventory or per-game points into a fresh game. **The winner is determined from the current game only** unless a host explicitly selects a multi-game cumulative match.
- No player is eliminated from a mode unless its own rules explicitly say so. In a mode with eliminated players, they still have a spectator screen and must not receive new secrets.

## A3. Standard phase/UI semantics

- Public lobby explains, in one short paragraph: objective, player count, expected duration, and whether speech is allowed.
- The normal screen hierarchy is **private invitation/deal → public round setup → decision (individual) → locked waiting → synchronized reveal/resolution → current score and next round → final result**. Variants are defined per mode below.
- The server must provide a safe `publicView`, `playerView`, and `moderatorView`. The ordinary host has no privileged access to secrets. A trusted moderator is an out-of-game observer and is never counted as a player; whether they may inspect secrets follows the existing moderator contract.
- If players can type text, trim and sanitize, apply character limits, escape display HTML, prevent unsafe markup/scripts, and retain a consistent table language where text comparisons depend on wording. Translations must use IDs/templates rather than string matching.
- Use the existing seven supported languages (EN, HU, SK, CS, DE, FR, ES). A mode's complete initial question/puzzle pack and all dynamic game text must be translated or explicitly disabled in unsupported content languages. The Gazette forces one shared table language because its answer options must be identical for everyone; other modes may render localized explanatory text per device.
- Every mode supplies `setupDefaults`, `validateSetup(n, settings)`, `start`, `command`, `onDeadline`, `advance`, `publicView`, `playerView`, `finish`, practice bot strategy and unit/integration tests. Expose only the lobby controls actually supported by that mode. Reject settings/roles/cards from other games.

## A4. Mandatory test matrix for *each* mode

1. Test minimum, middle, maximum, and invalid player counts. Test an authorized start with all ready and rejection with incorrect setup.
2. Test one normal full game, a minimum-length terminal game and an extended/edge game using scripted RNG and a fake clock.
3. Test a missing answer/action in **every** phase; timers must resolve to the documented fallback or terminal loss with no frozen state.
4. Test malicious or accidental submissions: wrong actor, wrong target, negative or fractional currency, extra cards, malformed text, replayed `phaseId`, double submit, duplicate idempotency key, post-deadline input and submitting after the match ends.
5. Test that hidden data is absent from both public and unauthorized player views before reveal. Verify no action order/timestamp leaks secret choices.
6. Test simultaneous completion and independent deadline expiration yield the same resolution, including ties and correctly rounded divisions.
7. Test recovering an authenticated seat after disconnect, host handover, server restart/persistence, spectator/TV display, bot completion, and same-table rematch.
8. Test that switching away from a mode cannot leak its settings, content, role assignments or stale UI into another mode, and switching back recalls only its own lobby settings.
9. At completion, run the existing project test suite and localization checks. New work must not break Classic, Missions, Exorcism, Coffins, Carnival, Midnight, Séance or Graverobbers.

---

# 1. DEAD SET: THE GAZETTE

**4–10 players | 15–30 minutes | Creative trivia/bluffing | No secret teams**

### Fantasy and objective
The Gazette reports impossible-sounding facts. One Editor knows the genuine answer, while the other players submit convincing falsehoods. Fool the table with your fabricated answer, or identify the real one. Highest cumulative score wins.

### Setup and hidden/public information
- Everyone is seated. Shuffle a pre-authored bank of unusual, genuinely verifiable question records for the common table language; questions must be suitable for one unambiguous short answer and not rely on live internet access. Do **not** invent facts with AI at runtime.
- A question record must include `{id, prompt, realAnswer, acceptedAliases[], fallbackWrongAnswers[]}` with at least three vetted, distinct false answers. Every question and its accepted aliases must be reviewed for accidental duplicate meanings.
- The Editor rotates once through **every** player in fixed seat order, starting with a seeded random seat. There are exactly `N` rounds, one per Editor.
- The Editor sees the real answer and cannot submit a fake or vote that round. The TV and all other players see only the question until the answer reveal.
- Other players privately submit one fabricated answer (max 100 Unicode characters) and later vote for one of the displayed answers, excluding their own fake.
- Default phase timers: Editor reveal 10 s; fabricate 60 s; vote 40 s; reveal 12 s. Host may choose 30/60/90 s fabrication and 30/40/60 s voting.

### Exact gameplay loop (repeat N times)
1. `ZG_QUESTION`: Announce the Editor and question. The Editor privately sees the correct answer; other phones invite a believable fabrication. The Editor may speak but should not reveal the answer (honour rule).
2. `ZG_FABRICATE`: All non-Editors type and submit one plausible fake. Until the phase closes, submissions may be replaced. The server normalizes punctuation/whitespace/case/diacritics for collision checks; a fake identical to the verified answer or an accepted alias is rejected. Two players may not enter equivalent fake answers: the later valid submission must be revised. Submissions are hidden from everyone else.
3. On deadline, any absent/invalid submission becomes a question-specific **unattributed fallback distractor**; it is not credited to the missing player. If fewer than three distinct choices including the truth exist, add more curated distractors until there are at least three choices. Shuffle candidate IDs using server RNG.
4. `ZG_VOTE`: Show the genuine answer and all accepted fake answers as **visually identical, anonymous** options. A player cannot select their own submitted fake. The Editor cannot vote. All votes are private until locked. Missing vote = abstain.
5. `ZG_REVEAL`: Show actual truth, author of every accepted fake, each vote and its point consequence. No points for an unattributed fallback. The Editor's answer knowledge is revealed only now.
6. Update scoreboard. Advance to next Editor. After each player has served once, rank scores and end; highest score wins, ties share victory.

### Exact scoring
- Voter who selects the real answer: **+2**.
- Author of a false answer: **+1 per vote** their answer receives from other players.
- Editor: **+2** only if **at least one non-Editor voted** and `2 × correctVotes < votesCast` (strictly fewer than half of actual submitted votes were correct). Otherwise +0.
- Missing fabricated answer or missing vote earns nothing for that missing action. An Editor never earns voter/fabricator points in their own round.

### Critical logic and corner cases
- Store submitted answers as records with server-generated opaque IDs, author IDs and normalized form. Votes reference option IDs, not raw text.
- The submitted display string must not reveal answer authorship via ordering, length styling, emojis or animation.
- Duplicate fake answers: first valid locked submission wins; later duplicates are returned for editing; if a race becomes visible at resolution, later duplicates become unattributed fallbacks.
- If a legitimate real answer has multiple common spellings, all must be aliases. A false answer that is semantically also correct must be rejected by content authoring, not guessed by a fragile runtime comparison.
- Use a shared table language for this mode and its answer bank. Publish at least 30 valid questions **per enabled language** before allowing that language in the lobby; no machine-translated proper-noun answers without review.
- Empty vote phase: Editor receives no bonus. If all player devices time out, the round still completes and the next Editor begins.

### UI and bot requirements
Show a gothic newspaper front page, a secret Editor's proof sheet, anonymous answer columns, stamped voting results and a Gazette issue archive. A bot generates a false answer from that question's authored fallback set, avoiding the true answer and existing guesses; its vote is selected from its authorized options, with configurable likelihood of choosing the truth (for practice only). It may not read another player's submission before the vote phase.

### Acceptance scenarios
- Four players: one Editor, three fakes, one fake gets two votes, truth gets one. Fake author +2; correct voter +2; Editor +2 because 1 of 3 correct.
- One fake matches the real answer after normalization: rejected; timed-out replacement is unattributed.
- Three of three voters identify truth: each +2; Editor +0.
- Two identical fake submissions resolve to one credited fake and one unattributed fallback, never two indistinguishable options.

---

# 2. DEAD SET: THE OMEN

**4–12 players | 10–15 minutes | Secret prediction and simultaneous interference | No teams**

### Fantasy and objective
An occult wheel points to **Life, Death or Rebirth**. Everyone sees where it starts, but anyone can secretly turn it. Guess where it will finish, considering both your own rotation and everyone else's. Highest score after seven rounds wins.

### Setup
- Outcomes are ordered circularly as `LIFE=0`, `DEATH=1`, `REBIRTH=2`; clockwise means `+1`, anticlockwise means `−1`.
- Each player begins with **5 Influence tokens**, visible as a public remaining count. Influence cannot be traded or replenished.
- Exactly **7 rounds**. The server randomly chooses a public starting outcome at the beginning of each round; repeats are allowed.
- Each round every player submits **one private prediction** (`0|1|2`) and **one private rotation** (`−1|0|+1`). Rotating by ±1 spends exactly one Influence token; choosing 0 spends none. These are submitted together, editable until locked.
- Timer: 40 s per round. Timeout means **no prediction / no rotation**, not a free prediction of the current position.

### Gameplay loop
1. `OM_SHOW`: Reveal the wheel's starting outcome and all current Influence balances. No one learns anyone else's choice.
2. `OM_SECRET`: After an **8-second public wheel reveal**, privately choose prediction and rotation. Disable ±1 when a player's Influence is 0.
3. When everybody has submitted or timer expires, atomically deduct spent Influence and resolve `offset = Σ rotation_i` and `finish = ((start + offset) % 3 + 3) % 3`.
4. `OM_REVEAL`: Animate one wheel turn equal to the **net** offset, then show final outcome, each participant's rotation, prediction and score. Visually note cancelling opposite rotations and rotations totaling multiples of three.
5. Correct prediction earns **+3 points**. Incorrect/no prediction earns 0. Continue to the next round.
6. After round seven, each unused Influence token earns **+1 bonus point**. Highest total wins, tied leaders share victory.

### Logic and edge cases
- Never calculate by applying player rotations sequentially in client order; the mathematical sum is authoritative. Three clockwise rotations return the wheel to its starting position.
- Deduct Influence only when resolving a valid locked action, exactly once. Changing a prediction or rotation before lock must not double-spend.
- A person with zero Influence may still predict and gain points.
- The starting position and remaining Influence are public; submitted predictions and intended rotations are private until the reveal.
- Scores may remain tied for the entire match. A shared final win is correct, not a bug.

### UI / bots / tests
An astrolabe-style three-part wheel, numbered Influence counters, private prediction and turn controls, synchronized resolution, and a ledger showing why the wheel moved. Bot chooses prediction based on public starting position plus a simple random policy and rotates probabilistically while Influence remains. Test offset `−4`, `+3`, zero Influence, simultaneous conflicting rotations, duplicate commands, all timeouts, final unused-token bonus.

---

# 3. DEAD SET: THE VIGIL

**4–10 players | 10–20 minutes | Silent cooperative timing and order | No traitor**

**Title change:** Replaces “The Choir”. Players conduct a midnight memorial vigil by placing numbered candles on a common altar in **ascending order**, without discussing the numbers. The atmosphere is mournful and restrained rather than musical. This is a deliberate cooperation-only contrast to the deduction modes.

### Setup and objective
- Three levels. At 4–6 players, each player receives `1, 2, 2` cards in levels 1–3. At 7–10 players, each receives `1, 1, 2` cards to control density. Every level shuffles and draws unique integers `1..100`, with no duplicates **within that level**. Cards are private to their holders.
- All cards must be played in ascending order. Players cannot say, type, gesture, or hint at their numbers or timing (honour rule); remote chat is disabled for this mode while a level runs.
- The team starts with a shared **Discord budget**: 4 strikes for 4–6 players; 5 strikes for 7–8; 6 strikes for 9–10. Reaching the budget loses immediately.
- Once per level the team may ring the public **Bell**, which reveals the **lowest unplayed number only**, not who holds it. Any player can trigger the Bell once per level; there is no vote. The Bell resets each level.
- All three levels completed with fewer than the budgeted Discord marks = cooperative victory.

### Gameplay loop
1. `VI_DEAL`: Deal each player their level's private numbered candles. The TV shows only the level, remaining candle count, Discord marks and unused Bell. Each player privately acknowledges their hand. This reveal window lasts **20 seconds**; missing acknowledgements auto-complete without showing a hand publicly, and then the whole table begins the level together.
2. `VI_VIGIL`: After a common countdown, the players sit in silence. At any time a player taps one of their own numbered candles to play it. A player with two cards may play either one, but should play their lower one first. The play is an irreversible commitment.
3. Server resolves immediately: let `v` be the played card; find **all** unplayed cards with value `< v` across every hand. Remove those smaller cards as **missed candles** and add **one Discord mark per missed card**. Then add `v` to the successful procession. Reveal the played value and any missed values in a shared moment. Never identify which other hand held a missed candle until the end.
4. If accumulated Discord marks reach the budget, end in defeat. Otherwise continue until every player hand is empty. If no unplayed cards remain, the level is complete and a new deal begins.
5. A Bell action may be used before any play once per level, revealing the smallest currently unplayed value. Bells do not remove cards or award points.
6. A level has a 180-second silence limit. If time expires with any cards unplayed, the level ends in **defeat**; the host may extend before expiry. This prevents impossible-to-resolve idle games without introducing damaging auto-plays.
7. After level three, show the sequence of successful and missed candles and a cooperative victory screen.

### Logic and fairness
- Cards removed as missed candles are gone; they do not still need to be played. A mistake increases the Discord count exactly by the number of skipped lower cards, preventing the exploit of deliberately playing the highest card to skip the entire level at the cost of one strike.
- No arbitrary client clock/timer threshold determines whether a card is too early. The only mathematical test is whether a lower unplayed number exists at the instant the server processes a play. The server serializes closely spaced play requests in accepted order.
- Two near-simultaneous plays are resolved deterministically in server receipt order. Commands with stale `phaseId` must be rejected after a level transition.
- Only a person's own card IDs are actionable; reject an attempt to play somebody else's card or an already discarded card.
- There is no individual score or villain. Player timeouts do not auto-play a card; they result in the shared level timeout unless the team finishes without them.

### UI / bots / acceptance
Private candle cards and a shared altar of lit candles; Discord appears as cracks spreading through the memorial. During the active level, suppress distracting score and player-identity animations and do not show whose turn is next (there is no turn order). A practice bot may schedule its own plays using only its private values and elapsed level time, with seeded jitter; a bot must never look at other hands when deciding. Tests: correct full sequence; one lower card skipped gives one mark; five skipped give five marks; Bell used twice has no second effect; a level times out; play/timeout collision; final level win and Discord defeat.

---

# 4. DEAD SET: THE VAULT

**4–10 players | 15–25 minutes | Cooperative logical deduction | No traitor**

### Fantasy and objective
The group opens **three sealed chambers** of an occult vault. Each chamber has a four-digit combination. Every player sees only part of the evidence. Share clues, reason together, and open every lock before your opportunities run out.

### Puzzle design and strict validity
- Every answer is an integer from **1000 to 9999**, shown as four digits. Leading zero is forbidden; repeated digits **are allowed** unless clues rule them out.
- A chamber has a structured set of clue predicates drawn from a small well-tested vocabulary, such as `DIGIT_EQUAL(pos,value)`, `DIGIT_EVEN(pos)`, `LESS_THAN(posA,posB)`, `SUM(posA,posB,value)`, `DIFFERENCE(posA,posB,value)`, `COUNT_OF_DIGIT(value,count)`, `ALL_DISTINCT`, `EXACTLY_ONE_PAIR`, `DIGIT_IN_SET` and `TOTAL_SUM(value)`.
- The puzzle's **intersection of all clues must match exactly one code** in `1000..9999`. Verify this automatically by enumerating all 9,000 candidates. Also verify that *no individual player's clue subset alone* identifies the combination uniquely. Avoid contradictory, redundant-only, ambiguous or language-dependent clues.
- Recommended v1 content strategy: ship **30+ curated, machine-validated chambers** with clue distribution for 4–10 players. A generator may be added later; it must use a solver and reject every deal that fails uniqueness and no-solo-solution checks. Do not substitute unverified random clue text.
- Divide each chamber's clue set evenly among seated players. All clues are true. No player may be dealt zero clues in a full human table; if the curated set is smaller than the table, use additional valid redundant clues, still without giving any person enough to solve alone.

### Setup and phases
- Three distinct chamber puzzles are randomly drawn without replacement. The server stores the true codes; these appear only in the hidden match state until a chamber is solved or the game ends.
- Each chamber's **Locksmith** is the next player in seat order, starting from a random seat. The Locksmith receives clues like everyone else and is responsible only for submitting the group's agreed combination.
- `VA_REVEAL` (15 s): Show the chamber and privately deliver clue cards. Public board shows the empty four-digit lock. No client gets the solution.
- `VA_DISCUSS` (240 s): Free discussion. Players may verbally share their clues; the app can show each player **their own** clues only. The Locksmith may propose a code at any point, opening `VA_CONFIRM` (10 s), where the whole table sees the proposed code. The Locksmith can confirm or cancel once; nobody else's vote is required. On confirmation the server spends an attempt immediately.
- `VA_RESULT` (8 s): The app announces **Opened** if the code matches; otherwise **Wrong combination**. Do not reveal individual correct digits or positional feedback on a wrong answer: that would change the puzzle's information model.

### Win/loss and attempts
- Each chamber allows **three wrong guesses maximum**. The first two wrong guesses permit continued discussion; the third wrong guess causes immediate loss of the entire game.
- Correctly opening a chamber advances to the next chamber with a new Locksmith. After three correct codes, the table wins together.
- If the 240-second discussion deadline expires before the chamber is opened, the entire game loses; the host may extend the timer before expiry. Opening a confirmation dialog must not freeze or circumvent the chamber's overall deadline.
- Same wrong guess cannot be submitted twice for the same chamber; it should be rejected without consuming an attempt, with a visible *Already tried* note.

### Privacy, bots, tests
Clients never receive the code, other players' private clues, or a complete candidate set. The host has no special answer privileges. At the end show all clues and a deduction walkthrough; the clue cards are translated from structured predicate IDs. Bot practice should use a server-side simulated **publicly shared** clue pool only if bots explicitly speak/publish their clues through legal actions; otherwise the bot may simply share one of its own clues and defer to a human Locksmith. For all-bot tests, add an isolated deterministic solver bot that acts from accumulated publicly shared clues, never invisible private data. Validate every shipped puzzle exhaustively, including three correct chambers, three wrong guesses, repeated guess rejection, time expiry and no-solo-solution by seat count.

# 5. DEAD SET: THE MIRROR

**4–12 players | 15–20 minutes | Social prediction / psychology | No secret teams**

### Fantasy and objective
A haunted mirror does not show your own reflection: it shows what your friends think you will do. Each round, answer a fictional dilemma and predict the answer of one assigned player. Win by reading people accurately, not by finding a hidden criminal.

### Content and setup
- Play exactly **8 dilemmas** selected without replacement from a bank of at least 40 localized prompts. Each dilemma contains `{id, prompt, choices:[A,B,C]}` with **exactly three** meaningfully distinct responses, all socially plausible. No objectively correct answer exists.
- The eight prompts are identical across the table; the displayed language can be individually localized as long as option **IDs** A/B/C are consistent in meaning across languages.
- Each player is assigned one **target other player** per round using seat rotation: if players are indexed `0..n−1` and round is zero-indexed `r`, the target of seat `i` is seat `(i + 1 + (r % (n−1))) % n`. Thus nobody ever predicts themself and, across the first `n−1` rounds, everyone predicts every other player exactly once. With small tables, some targets repeat in later rounds.
- Targets are publicly announced at round start, so people can interact with the person they must read. Own answers and predictions remain private.
- Timer: 75 seconds for public talk/consideration, followed by 30 seconds for private answer/prediction, and a synchronized 10-second reveal. Setup allows discussion at 45/75/120 seconds.

### Gameplay loop
1. `MI_PROMPT`: Show the new dilemma, the three choices, and who is reading whom. Encourage verbal discussion about the hypothetical scenario; players may try to misdirect others, but the final response cannot be inspected until reveal.
2. `MI_CHOOSE`: Every player submits a two-field sealed ballot: `(ownAnswer: A|B|C, predictionOfTarget: A|B|C)`. They may edit it until the deadline. The player must submit both fields together; incomplete ballots are not accepted as locked choices.
3. `MI_REVEAL`: Reveal each person's answer (or clearly labeled automatic timeout response) and each prediction arrow from predictor to target; the server scores against the target's resolved response.
4. A correct prediction earns the predictor **2 points**; an incorrect prediction earns zero. Players receive no points for their own answer. Scores add across eight rounds.
5. If a player fails to lock a complete ballot, the server assigns them a **uniformly random A/B/C answer**, visibly labeled *Automatic (timeout)* at reveal, and an **abstaining prediction**. A predictor assigned to that player is still scored normally (+2 if they happen to predict the automatic option, 0 otherwise). This prevents a strategic player from withholding their own answer to deprive another person of a fair scoring opportunity. The timed-out player earns 0 for their own missing prediction. Never present the generated answer as a real choice made by the absent player.
6. After round eight, the highest total wins. Final tied totals produce joint winners.

### Important logic
- For each round the assignment is a **permutation**: every person is predicted by exactly one other person, and every predictor targets someone different from themself. Check this invariant in tests.
- A player's own answer and prediction must lock together at the end of the input window. A last-second change by a target must not trigger a premature result on another player's screen.
- There is no requirement to answer consistently with earlier rounds, and no penalty for intentionally choosing a surprising answer.
- If the session is remote, room chat is allowed during talk and closed during the final sealed ballot; don't expose votes through chat metadata.
- If *all* players fail to answer a round, the server generates a labeled automatic response for everyone, but nobody submits a valid prediction; every player earns zero that round. The next round still begins.

### UI, bot strategy and acceptance
Use large illustrated dilemmas, a mirrored portrait/target link for each player, clear three-option private inputs, and a synchronized reveal of decisions with prediction connections. A bot chooses its own answer and a prediction from its own known information (random or profile-based), never another player's current private choice. Tests include 4-, 7- and 12-player assignment rotation, seeded automatic timeout answers, missing-prediction zero, rejection of incomplete locked ballots, a tied final result, and locale-independent option IDs.

---

# 6. DEAD SET: INHERITANCE

**4–12 players | 20–30 minutes | Negotiation / coalition votes | No hidden teams**

### Fantasy and objective
A contested inheritance must be distributed. Each player, once during the match, becomes Executor and decides how to divide an estate. The others decide whether to accept the will or destroy it. The wealthiest player at the end wins.

### Setup
- Every player begins at **0 wealth**. Coins awarded in this game are score, not a spendable inventory; all offers and payments are made from each round's newly revealed estate.
- Each player serves as Executor **exactly once**, in fixed clockwise order from a seeded random start. There are exactly `N` rounds.
- To keep large tables negotiable, estate size scales with table size: **12 coins for 4–6**, **16 coins for 7–9**, **20 coins for 10–12**. This value is public and the same for every Executor within a game.
- Default phases: 90 s public negotiation, 30 s to finalize will, 40 s secret vote, 12 s reveal. The host may choose 60/90/120 s negotiation and 30/40/60 s voting.
- The Executor **may** award coins to themself, to some/all other players, or zero to anyone. All allocations must be **nonnegative integers**, and their sum must equal the exact estate size. No loans, future-debt contracts, negative allocations or fractional shares.

### Gameplay loop
1. `IN_OPEN`: Announce the Executor, public estate amount and current wealth standings. Players may offer verbal deals, plead, threaten to reject and discuss past betrayals. Promises about future wills are not enforced by the app.
2. `IN_DRAFT`: The Executor uses sliders/number fields to distribute **every** estate coin between all seats. Other players see the **final proposed will** only when submitted, not a real-time view of draft allocations. The Executor can revise before locking; after locking, it cannot change.
3. If the Executor times out without a valid locked will, the server creates a deterministic **equal will**: each player receives `floor(estate / N)`, and the remainder is allocated one coin at a time starting with the Executor and continuing clockwise. This prevents a missing Executor from freezing or automatically destroying the game.
4. `IN_VOTE`: Every player **except** the Executor privately votes **Accept** or **Contest** after seeing the completed proposal. All votes are simultaneous; timeout defaults to **Contest**.
5. `IN_VERDICT`: The proposal passes only if `acceptCount > (N−1)/2`, a strict majority of **all eligible non-Executor seats**, not merely submitted votes. On passage, transfer the exact advertised allocations to each player's cumulative wealth.
6. If the proposal fails, **none of the estate is paid**, including the Executor's share. Every **non-Executor** receives exactly **+1 consolation coin** from the bank, and the Executor receives 0. These consolation coins are newly minted score points; they do not come out of the rejected estate.
7. Reveal all votes and payment changes. Advance clockwise to the next Executor. After N wills, highest wealth wins, ties share victory.

### Balance and edge cases
- At N=4 there are three voting seats, so two Accept votes pass. At N=5 there are four, so three are required. At N=12 there are eleven, so six are required.
- The Executor is **not** allowed to vote. A claim that a vote was abstained from does not reduce the quorum; timeout counts as Contest. Accept/Contest choices can be replaced before lock, but count only once.
- All accepted payouts are calculated from **one** canonical will snapshot. Never perform partial transfers during drafting or voting. If the result is rejected, there must be zero estate payout even when the draft included attractive promises.
- If all voters disconnect, the proposal fails and consolation coins are allocated by rule; all rounds still advance.
- When presenting results, differentiate **estate payout** and **consolation** so the origin of points is auditable.

### UI / bots / acceptance
Show the Testament as a parchment allocation table, seals for each voting seat, a locked-will interlude and public wealth ledger. Bots consider positive allocations and public history when accepting or contesting; the bot Executor tends to favor itself while offering enough coins to assemble a voting majority. Tests: estate sum must be exact; two vs three Accept votes on a five-player table; rejection pays only consolation; late edit rejected; N=12 requires six Accept; equal-will timeout sums exactly to estate; every seat serves exactly once.

---

# 7. DEAD SET: TREASURE HUNTERS

**4–12 players | 15–20 minutes | Push-your-luck expedition | No villain**

### Fantasy and objective
A group of treasure hunters descends into haunted ruins together. Treasure accumulates on the floor; each explorer may flee and bank a share, or risk another reveal in search of greater riches. Every expedition can end in a supernatural catastrophe.

### Setup and content
- Five expeditions, everyone begins with **0 banked treasure**. Banked treasure persists between expeditions; unbanked treasure never carries over.
- Each expedition independently shuffles the same 24-card recipe (new copy/shuffle each time): **15 treasure cards** with values `[1,1,2,2,3,3,3,4,4,4,5,5,6,6,7]`, and **9 hazard cards**, three copies each of `WRAITH`, `COLLAPSE` and `CURSE`. The deck composition is public; the order is secret and server-shuffled.
- Every expedition has at most **six card reveals**. Each player starts the expedition as an active explorer. A player who leaves an expedition cannot re-enter that expedition.
- `floorTreasure` begins at 0 and the set of distinct hazard types encountered begins empty. All players see the cards revealed so far, how many explorers remain and the current floor value.
- The only secret action is the simultaneous **Continue/Leave** decision after a non-terminal card reveal.

### Precise expedition loop
1. `TH_DESCEND`: Open the expedition and show its number, active explorers and total banked scores. Reveal the **first** card automatically.
2. `TH_REVEAL`: If it is a treasure card, add its number to `floorTreasure`. If it is a **first** copy of a hazard type, publicly record that hazard as present; do not add treasure. If it is the **second or later** copy of a type already encountered **in this expedition**, the expedition immediately collapses: everyone still active gains **zero** from the floor and all remaining floor treasure is lost. Players who previously left keep their banked gains.
3. If the revealed card was non-terminal and fewer than six cards have been revealed, enter `TH_CHOICE`. Each remaining active explorer privately selects **Continue** or **Leave** within 30 s. Players already out do not vote. Timeout defaults to **Leave**, but timeout leavers are **not eligible** for a lone-leaver bonus.
4. Resolve choices simultaneously. Let `L` be all explorers leaving this decision, including timeouts. If `|L| > 0`, each receives `floor(floorTreasure / |L|)` to their permanent bank. Deduct the aggregate paid from `floorTreasure`; the undistributed remainder stays on the floor for explorers who continue.
5. If **exactly one player voluntarily** chose Leave, at least one treasure card has been revealed in this expedition, and at least one explorer continues after this choice, that sole voluntary leaver receives **+2 relic bonus points** directly to their bank. No bonus if multiple leave, if the sole leaver timed out, if nobody remains, or if no treasure has appeared.
6. Mark all leavers as inactive for this expedition. If zero active explorers remain, end this expedition immediately and discard the floor's remainder. Otherwise reveal the next card and repeat.
7. **Sixth-reveal limit:** after resolving the sixth card, if it does **not** collapse the expedition, all remaining active explorers automatically bank `floor(floorTreasure / activeCount)` each. Any remainder is lost. There is **no** lone-leaver bonus on this forced final extraction. End expedition.
8. After five expeditions, highest accumulated treasure wins; ties share victory.

### Specific examples and invariants
- Floor=11 and three explorers Leave: each banks 3, and 2 remains on the floor. Two explorers Continue. Those two may later benefit from the 2 remaining, but the leavers cannot.
- Floor=5, one voluntary explorer Leaves, three Continue, treasure has appeared: leaver banks 5 and gets a 2-point relic bonus; floor becomes 0.
- First `WRAITH` is a warning. Second `WRAITH` triggers immediate collapse **before** any new Continue/Leave prompt, even when it is the sixth card. A `CURSE` after `WRAITH` is just another first warning, not a collapse.
- Previously banked gains are never lost on a later catastrophe. Inactive players cannot make choices, trigger relic bonuses, return to the expedition or receive forced-final treasure.
- `floorTreasure` can never become negative. Cards are without replacement **within** an expedition; each new expedition shuffles a fresh deck.
- Use distinct animations for treasure, a first-hazard warning, a repeated-hazard collapse and voluntary exit, but no camera/timing clues about pending decisions.

### UI / bots / acceptance
The TV shows a vertically descending crypt and a shared treasure pile. Every explorer privately chooses Continue/Leave; all commitments reveal at once. Leavers can watch subsequent reveals without influencing them. Bots estimate risk from already revealed hazards and remaining cards; they may take risks without peeking at the deck order. Tests cover first vs repeated hazard, three-way floor sharing with remainder, timeout vs voluntary lone departure, all-leave, sixth-card forced split, five-experience completion, and preservation of earlier banked gold after collapse.

---

# 8. DEAD SET: THE RITUAL

**5–10 players | 20–30 minutes | Collaborative rune puzzle / one hidden cultist**

### Fantasy and objective
The living must complete three occult rituals before three fail. Completing a ritual requires three selected players to contribute the correct combination of runes. A hidden Cultist can lie about their hand, submit a deliberately wrong rune or invoke one secret corruption.

### Sides and hidden information
- Exactly **one Cultist** and `N−1` **Living**. The Cultist's identity is secret. The Cultist is the only adversary; all Living share the win. No one is eliminated, and roles remain fixed for the game.
- Rune types are `SUN`, `MOON`, `KEY`, `ASH`, `VEIL`. Each ritual displays a public recipe consisting of **three distinct rune types**, for example Sun + Key + Ash. Recipe order does not matter.
- At the start of **each ritual round**, every player receives **two distinct private rune cards**. The previous round's runes are discarded, regardless of selection; there is no carry-over inventory. Other players cannot see the cards, though players may verbally describe them truthfully or lie.
- The Cultist has **one Corruption charge per game**, usable only when selected as a ritualist. This permits replacing their chosen submitted rune with **any one of the other four rune types**. This is a secret action; the publicly revealed rune is the altered one, not the originally chosen rune. The Cultist may also simply choose a poor legitimate rune, without spending Corruption.
- The server **must guarantee** that at least one three-player team consisting exclusively of Living can provide all three recipe runes from their current two-card hands (one rune per contributor). This constraint is checked with a small bipartite matching/exhaustive three-player search. If a random deal fails, redraw; use a tested deterministic fallback after bounded retries.

### Phase loop and leadership
1. Start with a seeded random **Conductor**. Each subsequent round, rotate Conductor clockwise, including the Cultist if reached. The Conductor's identity is public but does **not** reveal alignment.
2. `RI_RECIPE` (15 s): Display recipe and deal two private runes to every player. Show public progress: completed successes and failures. Roles are already known privately to their holders.
3. `RI_COUNCIL` (120 s): Everyone freely discusses what runes they allegedly hold and which three participants should perform the ritual. Nobody is required to reveal their real hand.
4. `RI_PICK` (30 s): The Conductor selects **exactly three distinct seated players**, optionally including themself; no extra approval vote. This is a deliberate difference from the Missions mode's team-vote loop. If the Conductor fails to select, use the Conductor plus the next two seats clockwise, wrapping around. The selected trio becomes public.
5. `RI_CONTRIBUTE` (35 s): The three selected players simultaneously submit **one** of their two runes. The selected Cultist can optionally use Corruption to replace the chosen rune with any different rune type. Nobody else's submission is shown until all three have locked or the timer ends. A timed-out ritualist contributes a server-random one of their **actual** two runes; timed-out Cultist **never** automatically spends Corruption.
6. `RI_REVEAL` (10 s): Reveal each contribution next to its contributor's portrait and the recipe. Success if and only if the multiset of all three submitted rune IDs equals the three required rune IDs. A duplicate symbol always fails because the recipe has distinct runes. There is no partial success or subjective assessment.
7. Increase the `successes` or `failures` count by one. The **Living win immediately at 3 successes**; the Cultist wins immediately at **3 failures**. There can be **at most five rounds**, because one side necessarily reaches three by then. If no winner, discard old hands and begin another round with a new recipe and rotated Conductor.

### Special rules, balance and privacy
- Only selected ritualists can submit. A selected Living **must** choose an actual card. The Cultist may submit an invented rune **only** by using their one Corruption charge (server validates and consumes it atomically). One player contributes one rune, never two.
- A Cultist may choose to help complete a ritual, to preserve cover. The app does not force sabotage. They know only their own role, hand and Corruption; the rule assures Living-only solvability but the Cultist must **not** learn which Living trios could solve it.
- If selected players lack the needed combination because the Conductor nominated a bad trio, the ritual legitimately fails. Do not “fix” their hands or recipe after selection.
- Exactly three successes/failures are the only core victory triggers. Do not add a final Cultist-identification vote: the ritual itself is the contest.
- If participants share runes vocally, that is a permitted human-information channel. Do not transmit the factual cards in public game state; deception relies on the inability to verify those claims.
- A disconnection cannot block the runes: the affected ritualist's random legal contribution is revealed like any other, with an unobtrusive auto-play marker **only after resolution**. The other players never learn a missing actor's hand during selection.

### UI / bots / acceptance
Reuse tarot/rune emblems and the shared astrolabe. Show the public three-slot recipe; private two-card hand; Conductor selection by seat; simultaneous rune reveal; progress with three candles to salvation or three cracks to doom. A bot Living advertises one of its own rune types via a permitted public signal and contributes a matching rune where possible. A bot Cultist sometimes lies or uses Corruption when selected. Test at 5 and 10 seats, deal solvability with Cultist excluded, valid matching, duplicate rune failure, Corruption exactly once, nonselected submit rejection, Conductor timeout fallback, all-human timeout resolution, immediate third-success/third-failure end, and maximum five rounds.

---

# 9. DEAD SET: CONFESSIONS

**4–10 players | 15–30 minutes | Personal / fictional storytelling and interrogation | No secret teams**

### Fantasy and objective
One player sits in the confessional and presents three statements. **Exactly one is designated a lie.** Everyone else interrogates the Confessor and tries to identify it. Score points by exposing lies—or by making your designated lie sound utterly credible.

### Important truth contract
In a **Personal Confession**, the Confessor themself certifies which two statements are true and which is false. The app cannot independently verify real-life truth, and must not pretend to. Do not ask for sensitive disclosures, criminal admissions or actual trauma. Provide an always-available **Fictional Case** alternative using pre-authored three-statement character scenarios with exactly two canonically true statements and one canonically false statement. This is not a truth detector, and it should be presented as a social party game.

### Setup
- Every player serves as Confessor **exactly once**, rotating through seats from a seeded random start. Total rounds = `N`.
- The Confessor chooses one of two formats at the start of their turn:
  - **Personal:** enters three different statements of at most 180 Unicode characters each and privately marks exactly one as fabricated.
  - **Fictional:** selects or is dealt a themed scenario from a localized pack; its three canonically defined statements and false index are supplied by the server, then displayed to the Confessor. The Confessor cannot change its false index but may narrate the story convincingly.
- Drafting 60 s, interrogation 90 s, voting 40 s, reveal 12 s. Setup may choose 60/90/120 s interrogation. Ship at least **60 localized Fictional Cases per enabled language** to reduce rapid repetition. The Confessor cannot vote on their own case.
- The statements are indexed A/B/C and may be shown in a different shuffled order from draft order. The false identity is tracked as a stable statement ID, not by display position.

### Exact turn loop
1. `CF_PREP`: The next Confessor sees private drafting controls or a Fictional Case. Other players see a matching neutral waiting card. The Confessor must lock three nonempty distinct statements and one false marker. A Personal draft's truth/lie labels are private.
2. On prep timeout without a valid personal submission, the server assigns an authored **Fictional Case** to this Confessor instead (no lost turn and no forced autobiographical content). The fictional story becomes the truth source for that round.
3. `CF_REVEAL`: All three statements are presented together to the table, with no truthful/false marker or secret metadata visible. The Confessor may use normal voice/remote chat to answer follow-up questions.
4. `CF_INTERROGATE`: All non-Confessors may question the Confessor for 90 s. No additional app mechanics are required; optional UI displays a countdown and the three fixed statements. The Confessor cannot rewrite statements after they are revealed.
5. `CF_VOTE`: All other players privately select **A, B or C** as the false statement. Votes may be replaced until locked. Timeout = abstain.
6. `CF_VERDICT`: Reveal the marked false statement, who voted for what, and award points:
   - Every investigator who selected the designated false statement gains **+2**.
   - The Confessor gains **+1 for each wrong non-abstaining vote**, capped at **+3 for the round**.
   - Votes for an omitted/invalid statement ID are rejected; abstentions do not help the Confessor.
7. Continue to the next Confessor. After all `N` turns, highest score wins; ties share victory.

### Rules and integrity
- Do not silently classify personal statements as true or false via AI. Only the Confessor's stored false marker is the game truth for Personal mode. The revealed result should say *“Marked as the lie by the Confessor”* when personal.
- Prevent real-time editing or revealing of the false marker during the public phase. A viewer inspecting client network traffic must not see it in public `CF_INTERROGATE` or `CF_VOTE` views.
- The same player cannot vote for their own confession; the Confessor cannot earn +2 investigator points during their own turn.
- Prohibit empty/identical Personal statements and invalid false markers. A legitimate fictional pack must have pre-authored, comprehensible truth facts rather than ambiguous rhetorical claims.
- In remote play, chat is allowed during interrogation but not during the private vote. Do not expose unsubmitted ballots to the Confessor or host.

### UI / bots / acceptance
Design the experience as a candlelit confession booth: three parchment statements, interrogation clock, private suspicion seal and signed reveal. Practice bots choose a Fictional Case, select a vote based on visible statements only (random when no reasoning), and never access the hidden false marker to decide. Test Personal and Fictional paths, default fictional case on timeout, exactly one false statement, all-correct votes, all-wrong votes and +3 cap, confessor-vote rejection, and the marked-truth disclosure wording.

---

# 10. DEAD SET: THE BLACK MARKET

**3–9 players | 20–30 minutes | Sealed auctions, fake artifacts and reputation | No secret teams**

### Fantasy and objective
An occult black market trades in relics. On your turn, you choose whether to sell a real relic or a convincing counterfeit. Other players compete to buy, then decide whether to spend one of their limited Audit seals to expose fraud.

### Setup and items
- Every player starts with **5 spendable coins**, **2 Audit seals**, and a score adjustment of 0. Coins are both money for purchases and part of the final score. Coins cannot be negative.
- Two **market cycles** are played; in each cycle, every player serves once as Seller, in fixed clockwise order from a seeded random start. Total auctions = `2N`, even when nobody bids. The second market cycle begins with **+2 coins from the bank to every player** as a trading stipend.
- Each Seller privately receives two fresh lot options: one genuine artifact with hidden true score value **4, 5, or 6**, and one counterfeit with true score value **−4**. Seller chooses **one** to auction and discards the other; items not put up for sale have no score effect.
- Every item has a neutral public name and generic appearance. The exact same visual treatment is used for genuine and fake lots. The Seller knows authenticity and value; bidders know only the public lot appearance and the Seller's claims.
- A curated item bank should have at least 30 visual/name variants. Do not attach an obvious category, UI glow, image metadata, animation or name suffix that allows bidders to infer authenticity. The server may reuse neutral templates with differing hidden truth values.

### Auction turn
1. `BM_DEAL`: Seller privately sees two possible lots (genuine/counterfeit). Other players see only **“The Seller is preparing a lot.”** Selection timer 30 s. On timeout, server chooses one of the two options using seeded RNG (never automatically prefer genuine or fake).
2. `BM_PITCH`: Chosen lot is publicly shown. Seller may speak or publish a sanitized pitch of at most 120 characters. This statement is not binding; the Seller may lie about authenticity/value. Pitch timer 35 s; missing pitch means no written pitch and does not block auction.
3. `BM_BID`: Every **non-Seller** simultaneously submits one sealed integer bid **0–3**, not exceeding their currently owned coins. Bid 0 = no offer. Timer 30 s; timeout = 0. No coins are deducted until a valid purchase resolves.
4. `BM_WINNER`: If all bids are 0, unsold lot is discarded, nobody pays or receives it, and the game proceeds to next Seller. Otherwise highest **positive** bid wins. Ties are broken by the first tied bidder **clockwise after the Seller**; this fixed priority is public before bidding and never RNG-decided mid-turn. Reveal winner, winning bid and all sealed bids simultaneously.
5. `BM_AUDIT`: The high bidder may spend **one Audit seal** before paying. They have 15 s; timeout = **do not audit**. Auditing reveals the authenticity to the whole table. A bidder with no seals cannot audit. The Seller cannot audit their own item.
6. Settlement:
   - **Unaudited lot:** Winner pays the bid to Seller; item goes to Buyer's private collection as **unknown authenticity** until endgame. The Seller already knows its value. If genuine, Seller gets **+2 reputation score**, applied immediately but the reason must remain hidden until endgame to avoid leaking authenticity. Instead of showing this privately derived +2 in live public totals, track reputation separately and reveal/settle its score only at endgame.
   - **Audited genuine:** Buyer pays Seller; item goes to Buyer, publicly revealed as genuine with its actual score value; Seller earns **+2 reputation score** as above.
   - **Audited counterfeit:** Auction **cancels**: no coins transfer and Buyer gets no item. The counterfeit is discarded. Seller receives a **−2 penalty score**. The public record shows that an audit caught a fake.
7. `BM_RESULT`: Show only the public trade outcome: sold/unsold, Buyer, Seller, price, audit and audit verdict if used. Unevaluated private collections must not leak fake/genuine values. Move to next Seller.
8. After `2N` sales opportunities, `BM_CLOSE`: Reveal all collected items, true values, each Seller's genuine-sale reputation rewards, counterfeits exposed, and penalties. Compute final score for each player as **remaining coins + sum of acquired item values + 2 × genuine lots sold − 2 × audited fakes caught selling**. Highest score wins; ties share victory.

### Market arithmetic and privacy
- A Seller never earns their own lot's value just by showing it; only Buyers count items they acquired. Seller can earn coins from sales and reputation from genuine sales.
- Auditing a genuine purchase **does not change the price**. Auditing a fake cancels the full exchange and costs the Seller two final-score points; the Buyer retains their coins and consumes one Audit seal.
- Because genuine-sales add hidden reputation score, **do not show a live public total including those hidden points**; show publicly known coins and known penalties, and label endgame valuation as pending. The Seller may see their own internal reputation count, but not other Sellers' hidden counts.
- If the Seller times out, the two-lot RNG choice is server-side. If bids are all zero, there is no audit phase and no +2 genuine-sale bonus.
- If a player's available coins change after an earlier auction, the subsequent bid picker must use the actual current balance. Never permit a sealed bid higher than their coins or a second charge for the same purchased lot.
- Buyer and Seller may trade coins only via a settled auction; no side payments are enforced by the app. Verbal promises are allowed but not binding.
- The second-cycle stipend is awarded **exactly once**, before the first second-cycle seller, not on every turn.

### UI / bots / acceptance
Use a dark auction catalogue, neutral face-down relics, a numbered bid dial (0–3), wax Audit seals, a public sale ledger and a final exposure of fake inventory. The Seller's private preview clearly differentiates genuine and counterfeit; no other browser receives the truth until audit/end. Bots choose either lot with weighted randomness, bid within their own coin balances, and sometimes audit. Test no-bid sale, bid ties, bidder without coins, buyer with/without Audit, genuine reputation secrecy until end, counterfeit cancellation, two cycles and one stipend, currency conservation except the explicit stipend, and final negative counterfeit values.

---

# 11. DEAD SET: STANDOFF

**4–12 players | 10–15 minutes | Simultaneous threats, bluffing and brinkmanship | No hidden teams**

### Fantasy and objective
Five confrontations in a lawless room. Everybody draws a ceremonial dueling pistol and aims at someone else. Most rounds are blanks; nobody knows whether the threat against them is genuine. Correctly calling a bluff scores points; misjudging a live threat costs them. No one dies or is removed in this mode.

### Setup
- Every player privately holds exactly **5 ammunition cards: 2 LIVE and 3 BLANK**. In every round they must spend exactly one unused card. The ammunition balance is private, but its **starting composition** is known to everyone.
- There are exactly **five rounds**, so every active player must ultimately commit two live rounds and three blanks across the game. Cards are not replenished. A player may target any **other** seat, never themself.
- Scores start at 0 and may be negative. High score after round five wins; ties share victory.
- Thematic art may be supernatural/cursed dueling weapons and sealed bullets; the rules require no real-world physical weapons, demonstrations or gun handling.

### Turn phases
1. `ST_LOAD` (35 s): All players privately select **one unused ammunition card** (LIVE/BLANK) and **one target**. Choices remain private until everyone locks or the timer expires.
2. On timeout, the server automatically selects an unused card using seeded RNG and chooses the **next seated player clockwise** as target; the action is logged as auto-selected but not flagged publicly until the reveal. The fallback ensures all five rounds always consume one card and no player can improve their score by withholding a required shot.
3. `ST_AIM` (10 s): Reveal **every targeting arrow simultaneously**, but **not ammunition type**. Each player with one or more incoming threats sees a single **Stand / Duck** decision. Players with no incoming threats do not respond.
4. `ST_DECIDE` (25 s): Targeted players privately select Stand or Duck. A target makes **one response applying to all shots aimed at them**. Timeout = Duck. No one is allowed to change their attack or target after the aiming reveal.
5. `ST_FIRE` (12 s): Reveal all ammunition and all responses simultaneously, resolve scores and display arrows, choices and per-player score changes.
6. Continue to next round; stop after fifth resolution.

### Exact scoring (independently for each shooter; one response per target)
For every targeted player `T`, let `S(T)` be all shooters who aimed at them. Resolve:

- **If T chose STAND and at least one incoming shot was LIVE:** T scores **−2 exactly once for that round**, regardless of how many live shots arrived. Each LIVE shooter targeting T gets **+2**. Each BLANK shooter targeting T gets **−1**.
- **If T chose STAND and every incoming shot was BLANK:** T gets **+2 exactly once for that round**. Every BLANK shooter targeting T gets **−1**.
- **If T chose DUCK:** T gets **−1 exactly once for that round**. Every BLANK shooter targeting T gets **+1**. Every LIVE shooter targeting T gets **0**.
- A player with **no incoming shots** scores 0 from being targeted (but still scores as a shooter against their selected target).
- A person can simultaneously lose points as a target and earn points as a shooter. Calculate all round deltas from a single locked snapshot and then apply the aggregate at once.

### Examples and corner cases
- Ada fires LIVE at Bram, Cara fires BLANK at Bram; Bram STANDS. Bram −2, Ada +2, Cara −1. If Bram DUCKS, Bram −1, Ada 0, Cara +1.
- Three players all fire BLANK at Bram and he STANDS: Bram +2 **not +6**; each blank shooter −1. If Bram DUCKS: Bram −1 **not −3**, all three shooters +1 each.
- An untargeted player is not asked to Duck/Stand and is awarded no free “bravery” points.
- A player whose final remaining ammunition is LIVE must shoot LIVE in round five; the server validates inventory. A command targeting self or reusing a spent card is rejected.
- Do not reveal the other four rounds' ammunition or a player's unused cards from a public view. End-game recap reveals each round's spent ammunition and target choices.

### UI / bots / acceptance
Show everyone's portrait around a dim gunmetal/silver table, synchronized targeting lines and one group **STAND YOUR GROUND?** prompt per targeted player, with a dramatic gunfire/blanks reveal. Use non-realistic symbolic animation rather than actionable gun handling. Bots choose from their own remaining ammo and legal targets, then decide whether to duck based on public prior behavior. Test multi-attacker single-response scoring, no-incoming target, all BLANK vs mixed LIVE, simultaneous positive/negative effects, five-round ammunition exhaustion, final ties, and all actors timing out.

---

# 12. DEAD SET: THE PACT

**4–12 players | 15–25 minutes | Repeated trust game / rotating partnerships | No permanent teams**

### Fantasy and objective
At the witching hour, two people swear a pact. Each must choose whether to honour it or betray it. Promises can be reinforced with scarce Oath tokens—but only when both people agree to stake one.

### Setup and partnerships
- Every player begins with **0 points** and **2 Oath tokens**. Tokens are private inventory until used; current remaining counts may be public after each round. Oath tokens cannot be traded.
- Create a deterministic rotating pairing schedule using the standard **circle method** with a dummy bye seat when `N` is odd. Pairing schedule is shown publicly at the start of every round.
- For **even N**, there are **6 rounds**, even if this requires cycling pairings after all unique opponents have been exhausted at small N. Avoid repeating the **same exact pair** in consecutive rounds whenever a legal alternative exists.
- For **odd N**, there are **N rounds**, exactly one bye per player over a complete round-robin. Each player receives **+2 neutral points** on their single bye; bye players are spectators for that round, cannot pledge an Oath and cannot choose Honour/Betray.
- A paired decision involves two partners only. Everyone acts at once across the table; no waiting for partnerships to resolve sequentially.

### Single-round phase flow
1. `PA_PAIRS` (10 s): Reveal each pair (and any bye), current standings and number of Oath tokens remaining. Each pair has 45 s to speak directly or by limited pair chat if remote. No other player is given access to their private pair channel.
2. `PA_OATH` (15 s): Each partner privately selects **Offer Oath** or **No Oath**. An Oath becomes active **only if both offer and both have ≥1 token**. When active, the server deducts exactly one token from each person. When only one offers, neither spends a token. Both partners learn whether their agreement became active, but the rest of the table does not learn private choices before the round's reveal.
3. `PA_CHOICE` (25 s): Each partner privately selects **HONOUR** or **BETRAY**. These choices may be edited until resolution, and neither partner can see the other's input. On timeout, use **HONOUR** as the fallback; choosing nothing must not automatically award the high Betray payout.
4. `PA_REVEAL` (10 s): Reveal both choices in every pair and whether an Oath was active. Resolve each pair independently by the matrix below, then make Oath transfers, award bye points, and show the score deltas.
5. Next scheduled pairings begin. After the final round, highest score wins; ties share victory.

### Base payoff matrix

| Player A | Player B | A points | B points |
|---|---|---:|---:|
| HONOUR | HONOUR | +3 | +3 |
| BETRAY | HONOUR | +5 | 0 |
| HONOUR | BETRAY | 0 | +5 |
| BETRAY | BETRAY | +1 | +1 |

**If an Oath was active**, transfer an additional **2 points from each betrayer to their partner** after base payoffs:
- A Betrays and B Honours: base (5,0) becomes **(3,2)**.
- A Honours and B Betrays: base (0,5) becomes **(2,3)**.
- Both Honour: remains (3,3); the staked tokens are still consumed.
- Both Betray: each transfers 2 to the other, so net result remains (1,1); both tokens are consumed.

These are **score-point transfers**, not transfers of Oath tokens. Scores may become negative when another mode variant or future modifier allows a penalty; this base game does not require negative starting scores. Transfers are applied atomically and cannot fail for insufficient score balance.

### Logic and balance concerns
- In a valid odd-player schedule, exactly one player sits out each round and every person gets **exactly one bye**, receiving the same +2 bye payment over the match.
- A pair can activate an Oath only through **mutual consent** and only when both have a token. Showing who offered before consent closes would leak negotiation information; do not do so.
- A pair's choices are locked together for reveal; a completed pair must not reveal while another pair is still choosing. Public reveal happens simultaneously after the phase closes for **all** pairs.
- Repeated partnerships, promises and retaliation are intended. The app should display previous pair results and betrayals as a public history so choices gain social consequences.
- Players are not obligated to keep verbal promises. The app enforces only Oath point transfers. Do not treat verbal pair agreements as binding contracts.

### UI / bots / tests
Show red wax-sealed two-person pact cards on individual phones, pairing threads around the table, an optional mutual Oath seal, then a simultaneous **HONOURED / BROKEN** reveal for all pairs. Bots use their own history of betrayal and co-operation with each partner and limited randomized choices. Tests: matrix all four outcomes, all four Oath outcomes, mutual consent required, single-sided Oath offer spends nothing, token exhaustion, Honour timeout, six even-table rounds, a full odd round-robin with one bye each, and tie-sharing on the final scoreboard.

---

# B. CLAUDE IMPLEMENTATION ORDER AND QUALITY GATES

## Recommended build sequence

This order balances the ease of reusing the current architecture with meaningful new mechanical variety. It is **not** a requirement to ship every mode at once.

1. **The Omen, The Mirror, The Pact:** simple simultaneous private ballots, deterministic score resolution and existing lobby/seat UI reuse.
2. **Inheritance, Confessions, Standoff:** add rotating public leadership, authored statements and more sophisticated simultaneous targeting.
3. **Treasure Hunters, The Gazette, The Black Market:** introduce hidden server-generated decks/content, risk rounds, auctions and optional reveals.
4. **The Vigil, The Ritual, The Vault:** the most demanding cooperative states and puzzle validators; finish with thorough solver and edge-case tests.

## Development prompt to give Claude

> Implement the twelve new Dead Set modes from this file **one at a time**, following the active branch's existing mode pattern. Before editing, inspect the current branch and compare existing modes, particularly the newer Graverobbers implementation. Treat the rules in each numbered section as the normative game design; do not silently simplify, invent or reinterpret them. Begin by wiring each new preset/setting validator to the lobby, then create its pure engine, per-audience filtered view, authoritative server command/deadline routing, phone UI and TV/public UI, practice bots, translations, documentation and deterministic tests. Keep the existing games working. For every mode, provide a focused summary of files changed and tests run; do not claim unexecuted manual browser checks have passed. Do not expose future answers, private bids, fake items, runes or role assignments to ordinary clients. Use `gazette_game` rather than overwriting the existing `public/gazette.js`. Keep Treasure Hunters separate from Graverobbers.

## Data contracts to reuse

Every implementation can use a small mode-specific substate rather than a universal giant engine. This **illustrative** data schema describes the categories of information that must be retained; it is not a directive to replace the project's established match shape.

```js
{
  mode: 'omen',                 // distinct mode ID
  round: 3,                    // 1-based round / expedition / case
  phase: 'OM_SECRET',          // mode-prefixed authoritative phase
  phaseId: 'OM_SECRET:3:17',   // rejected when stale
  deadline: 1800000000000,    // server time, if phase has timer
  playerOrder: ['p1','p2'],    // stable seat IDs
  scores: { p1: 9, p2: 6 },
  publicState: {},             // only fields safe to expose to all
  privateState: {},            // never sent in public view
  pending: {},                 // sealed actions, keyed by player ID
  history: [],                 // complete server log, filtered in views
  outcome: null                // authoritative victory/loss when ended
}
```

**Never send `privateState` or raw `history` wholesale.** `publicView()` constructs a new object with an explicit allowlist. `playerView(id)` may add only that player's secrets. A trusted moderator may have a separate intentional full-information view as supported in the current app.

## Criteria for each mode to be considered implemented

- [ ] Setup is visible in the correct mode family; the lobby permits only its valid settings and player range.
- [ ] A complete human match can be played on separate phones, with optional TV, from room join through end reveal and rematch.
- [ ] All secret actions stay server-side before reveal; view-level privacy tests pass.
- [ ] Every timer/absent actor action resolves as written. No stalled game, no infinite turn, no command replays that double award resources.
- [ ] Score, token, inventory, clue, win, tie and timeout behaviour match the numbered section exactly.
- [ ] Practice bots can finish a whole match without reading unauthorized secrets; bots are testing aids, not a substitute for human balance tests.
- [ ] Deterministic unit and end-to-end server tests pass. Existing tests and localization checks continue to pass.
- [ ] Rules and onboarding in the app are synchronized with the engine's actual behavior. The end-of-game recap explains decisions and outcomes from logged facts.
- [ ] Phone-first layouts, the dark gothic/editorial/print identity, shared animations, reduced-motion support and accessibility remain consistent with Dead Set.

## Balance testing before public release

**All numbers in this document are initial design decisions, not empirically validated balance claims.** After the implementation is correct, measure at least the following with seeded bots and human sessions:

- Gazette: genuine-answer identification rate, misleading-answer voting rate and Editor score advantage.
- Omen: total Influence usage, stalemates and whether never-spending becomes dominant.
- Vigil: completion rate by table size and number of missed lower cards per level.
- Vault: human solve rate and average attempts per chamber; verify **100%** of shipped puzzles have unique solutions.
- Mirror: prediction success relative to a 1/3 random baseline; whether target mapping produces unexpected systematic advantage.
- Inheritance: acceptance rate by player count and Executor wealth share, particularly at 10–12 seats.
- Treasure Hunters: expedition collapse rate, solo-leave frequency and distribution of banked treasure after five expeditions.
- Ritual: Cultist win rate at 5, 7 and 10 players; rate of solvable recipes versus actual team nominations.
- Confessions: average Confessor points vs investigator points, fictional scenario detection rate, and proportion of round skips/default fictional cases.
- Black Market: percentage of genuine items sold, coins available in second cycle, audit usage, negative counterfeit impact and whether fake-only selling dominates.
- Standoff: target concentration, LIVE usage timing and relative value of Duck/Stand across 1–4 incoming threats.
- Pact: Betray vs Honour rates, uptake and impact of Oaths, even/odd-table win balance, and whether replaying pairs at four seats makes rounds repetitive.

**Design principle:** a mathematically terminating game is only the first milestone. Every mode must also reward socially interesting decisions, retain agency for all players throughout play, and be enjoyable without requiring players to read lengthy rules during a match.

---

# C. COMMANDS, SETTINGS AND CONTENT CHECKLIST

This is a concise integration map. Command names are recommended stable API names (they can be adapted to the repository's established pattern if behavior remains identical). All client commands require session authentication and the current `phaseId`; all target IDs, index values, amounts and inventory references must be validated against **server state**.

| Mode | Core player/host commands | Input fallbacks | Primary settings exposed in its lobby |
|---|---|---|---|
| Gazette | `zg.submitFake(text)`, `zg.vote(optionId)` | Missing fake → curated unattributed decoy; missing vote → abstain | fabrication/vote timers; question packs/categories; table language |
| Omen | `om.submit({prediction,rotation})` | No prediction, rotation=0 | decision timer; fixed 7 rounds for v1 |
| Vigil | `vi.ack`, `vi.play(cardId)`, `vi.ringBell` | Deal ack auto-completes; no play until deadline → team loses | level timer; fixed card counts by table size |
| Vault | `va.ack`, `va.propose(code)`, `va.confirm`, `va.cancel` | Missing Locksmith input before 240 s → team loses | chapter duration / curated puzzle pack |
| Mirror | `mi.submit({ownAnswer,prediction})` | Random labeled auto-answer, no prediction | discussion timer; fixed 8 rounds for v1 |
| Inheritance | `in.submitWill(allocationsByPid)`, `in.vote(accept)` | Missing will → equal will; missing vote → Contest | negotiation/vote timers; estate size fixed by N |
| Treasure Hunters | `th.choose(continue|leave)` | Leave without lone-leaver bonus | choice timer; fixed 5 expeditions for v1 |
| Ritual | `ri.pick(teamIds)`, `ri.contribute({runeId,corruptTo?})` | Nomination → clockwise trio; contribution → seeded legal random rune | council/team/contribute timers; exactly one Cultist |
| Confessions | `cf.submit({statements,falseId})`, `cf.useFiction`, `cf.vote(statementId)` | No confession → authored Fictional Case; missing vote → abstain | interrogation timer; personal vs fictional enabled |
| Black Market | `bm.chooseLot`, `bm.pitch`, `bm.bid(amount)`, `bm.audit(useSeal)` | Lot → seeded choice; pitch → none; bid → 0; audit → no | bid/auction timers; exactly two sales cycles |
| Standoff | `st.load({ammoId,targetId})`, `st.react(stand|duck)` | Legal random shot at next seat; incoming response → Duck | action/decision timers; fixed 5 rounds |
| Pact | `pa.offerOath(bool)`, `pa.choose(honour|betray)` | No Oath; Honour | negotiation/oath/choice timers; fixed pairing schedule |

### Content ownership and localized authoring requirements

- **Gazette:** 30+ reviewed factual prompts **per enabled language**, each with a correct short answer, accepted spelling aliases and 3+ curated wrong answers. Source provenance may be stored in *authoring metadata* without showing the source to players during the round. Periodically review ambiguous/outdated facts.
- **Mirror:** 40+ dilemmas with three option IDs and per-language wording. No live translation is needed at game time; the server only scores IDs.
- **Vault:** 30+ validated four-digit chamber definitions or an equally well-tested generator with authored clue templates and deterministic fallback. Write a script that validates uniqueness and tests every seat distribution.
- **Confessions:** 60+ Fictional Cases with two internally true facts and one false fact, translated consistently. Personal statements are entered by users and not part of the content bank.
- **Black Market:** 30+ artifact titles/illustrated neutral identities, with genuine/fake metadata **stored only in private server lot data**. Do not attach authenticity hints to public asset filenames.
- **Treasure Hunters:** Fixed treasure values and hazard composition from §7; optional artwork for the three hazards. No runtime authored prose required for card resolution.
- **Ritual:** Five rune symbols and all ten possible three-distinct-rune public recipes; 2-card private hands generated and validity-checked per round.
- **Omen:** Three symbols with fixed circular order. **Vigil:** digits 1–100 and a single Bell per level. **Standoff:** LIVE/BLANK card backs and public spent-card animations. **Pact:** Honour/Betray/Oath icons.
- **Inheritance:** No authored scenarios are required for rules; use public generated wills with their exact estate arithmetic.

### Delivery approach

Do not attempt to merge a dozen large features in a single unsafe commit. The strongest workflow is:

1. Register one mode ID and isolated settings object; add a failing setup/registry test.
2. Implement its **pure server rule engine** and run deterministic tests for every table size and phase edge case.
3. Implement filtered views and run privacy tests before any visual interface work.
4. Add the per-player and public/TV screens, including ordinary host, reconnect and timeout behavior.
5. Add first-game tips, the complete rules text, localized strings, logs/replay and bot support.
6. Run the existing project suite, test with 2+ real devices and optional TV, then merge or keep a reviewable feature branch.
7. Repeat for the next mode, preserving the working behavior of all earlier modes.

**Core product requirement:** Every player should be able to understand the essential objective in **one lobby paragraph**, learn their immediate action from the current phone screen, and play an entire mode without somebody reading this engineering document aloud.
