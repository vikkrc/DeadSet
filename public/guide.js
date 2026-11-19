// In-app "How to play". Catalog entries come from /api/content so the guide
// can never drift from the rules engine's own definitions. The prose lives in
// GUIDE_EN; each language file may provide its own `guide` table (same keys).
export const GUIDE_EN = {
  title: 'How to<br><i>play.</i>',
  // ── The basics: the platform, not a game ──
  kicker: 'The rule book',
  intro: 'Dead Set is a family of party games for one room. Everyone plays on their own phone; a TV, if you have one, is the shared stage. Pick a game, read its chapter, play.',
  aboutH: 'What Dead Set is',
  about: `<p>Dead Set is a collection of social games (hidden roles, bluffing, word games, prediction) that share one table. Every game is played the same way: each player's <b>phone is a private screen</b> that shows only what that player may know, and the app is the narrator, so nobody has to sit out to run the game.</p>
<ul>
<li><b>No install.</b> It runs in the browser. Join with a six-letter code, a link or a QR code.</li>
<li><b>3 to 25 players</b>, depending on the game. Each game's chapter gives its table size and length.</li>
<li><b>A TV is optional but best.</b> The TV board shows the table, the scenes, the scores and the music. It never shows a secret.</li>
<li><b>Seven languages.</b> Everyone picks their own; word games use the table's language on every phone so the words match.</li>
<li><b>One table, many games.</b> Switch games in the lobby between rounds; scores carry over within a match.</li>
</ul>`,
  tableH: 'Starting a table',
  table: `<ol>
<li><b>Host a table.</b> The host taps <em>Host a table</em>, enters a name and gets a six-letter room code.</li>
<li><b>Invite.</b> Share the code, the link or the QR code. Everyone else taps <em>Join a table</em> (or opens the link), enters a name and picks a portrait.</li>
<li><b>Put the TV on.</b> Tap <em>TV board</em> in the lobby, or open the room on the TV's own browser and choose <em>Open TV table</em>. Several screens can show the board at once.</li>
<li><b>Seats.</b> Players sit round the table in the order they join. The host can tap a seat to move or remove a player.</li>
</ol>
<p>Your seat is tied to your browser. If a phone dies, the host can give you a one-time recovery code from the room menu; on the new phone choose <em>Recover my seat</em> and enter it and your seat (with its secrets) moves there. A phone that drops out keeps its seat and catches up when it returns.</p>
<p>For a table where someone wants to run the game and see everything, open the room as a <b>trusted moderator</b>. The moderator holds no seat, and every player is told.</p>`,
  setupH: 'Setting up a game',
  setup: `<p>The lobby walks the host through the same numbered steps for every game. Guests see the same steps, read-only.</p>
<ol>
<li><b>The game.</b> Choose one, grouped by family: Hidden Allegiances, Changing Hands, Reading the Room, Signs &amp; Riddles, Bluff &amp; Wager.</li>
<li><b>How it works.</b> Four or five illustrated steps: the whole game at a glance.</li>
<li><b>The deck.</b> What will be dealt at this table size: roles, masks, cards or places. It updates as players join.</li>
<li><b>Rules.</b> The game's own switches. The defaults are a good first game.</li>
<li><b>The table.</b> The table's language, the music and its style, backdrops, and (where it changes anything) whether you play in the same room or remotely with a chat.</li>
<li><b>Timers.</b> How long each step lasts. Collapsed; the defaults suit most tables.</li>
</ol>
<p>Everyone taps <b>Ready</b> once they have read the setup, and the host starts the game. Any problem with the setup (too few players for a role, say) shows as a note under the steps.</p>`,
  playH: 'How every game plays',
  play: `<ul>
<li><b>Never show your screen.</b> Your phone shows your role, your cards and your choices. Everything else is said aloud, or shown on the TV.</li>
<li><b>Shared scenes.</b> Big moments (a reveal, a vote count, nightfall) play on every phone and the TV at the same moment, for the same time. They cannot be skipped, and no timer runs during them.</li>
<li><b>Choosing a player:</b> tap their seat on the table ring. A seat you can choose breathes; your choice turns to vellum.</li>
<li><b>Committing:</b> most choices are a tap and can be changed until the step ends. Sealed choices (a vote, a card played face down) are a <b>hold</b>: keep your thumb down until the seal closes.</li>
<li><b>The header</b> names the game's current step and its number (Night II, Mission 3, Round 4…), with the time left.</li>
<li><b>Under the table:</b> <em>My card</em> (your role, any time), the game's reference sheet, your private <em>Notes</em> and the <em>Story</em>, where the game has them.</li>
<li><b>Timers.</b> When time runs out, anything you have not submitted becomes a pass or an abstention. The host can add 30 seconds, move on, or end the game from the room menu.</li>
<li><b>Notices</b> about what others just did appear for a moment in the header strip.</li>
<li><b>Honour rules.</b> A few rules (silence, muted players) can only be kept by the table in person. Remote play enforces them in the chat.</li>
</ul>`,
  afterH: 'After a game',
  after: `<p>The end screen names the winners, turns every secret face up and, in most games, replays what really happened. Tap through the recap at your own pace.</p>
<p>Many games are played as a <b>match</b> of 1, 3 or 5 games: the scores carry over, and the table returns to the same lobby with the same settings, everyone ready for the next game. From the lobby the host can also switch to another game; the table, the seats and the portraits stay.</p>`,
  // ── Shared section labels for every game's chapter ──
  hSetup: 'Setup',
  hCast: 'The cast',
  hLoop: 'How a game goes',
  hWin: 'Winning and scores',
  hOpts: 'Lobby options',
  classicP: 'The original Dead Set: hidden roles, night kills and a secret ballot by day. Most of you want to survive. A few of you are Death. Nobody knows who is who — except Death, who knows each other.',
  presetsH: 'Setups',
  toc: ['Basics', 'A round', 'Winning', 'Core roles', 'Extended roles', 'Full Deck', 'Dreams', 'Rule cards', 'Modes', 'Night order', 'Phones'],
  basicsH: 'The basics',
  classicSetup: `<p>5–13 players (up to 25 with a Custom deck). Everyone is dealt a secret <b>role</b>. Most roles belong to the <b>non-Death</b> side; one or more players are secretly <b>Death</b>, and Death's players know each other. The game alternates night and day until one side wins.</p>
<ul>
<li><b>Roles</b> are who you are for the whole game: your side and your power.</li>
<li><b>Dreams</b> are one-night effects: from Night 1, every living player secretly draws one each night.</li>
<li><b>Rule cards</b> (1–3, drawn at setup) bend the whole game: double kills, weighted votes, ghosts that vote.</li>
<li><b>The story</b> (WHO / WHERE / WHY) is pure storytelling. It never changes a rule.</li>
</ul>
<p>You may tell the truth about your role, lie about it, or keep quiet. The host plays like everyone else and sees no more secrets.</p>`,
  roundH: 'A round',
  round: `<ol>
<li><b>Night 0 — the reveal.</b> Turn over your role card, read it, tap <em>Understood</em>. Nothing else happens: no kills, no dreams, no powers. Death players see their teammates.</li>
<li><b>Morning.</b> The dawn news is read: who died in the night (never how, never their role). Anything private you learned appears under <em>Only you know</em>. A Diplomat may declare immunity here; a Vigilante may take their shot.</li>
<li><b>Discussion & nominations.</b> Talk. Each living player may make <b>one formal nomination</b> per Day. Nominating someone already nominated just seconds it.</li>
<li><b>Defence.</b> Each nominee, in nomination order, gets the floor.</li>
<li><b>Secret ballot.</b> Every eligible living player votes for one nominee or abstains, on their own phone. You can change your vote until the host locks it. Only totals are published.</li>
<li><b>Sentence.</b> The single highest total is sentenced (eliminated). <b>A tie at the top sentences nobody.</b> At most one person is sentenced per Day.</li>
<li><b>Night.</b> Screens go dark. Nightfall lasts fifteen seconds with Dreams on (five without): everyone turns over their Dream and Dream Snatchers may swap. A player whose Dream was stolen sees it happen. Then night actions open by themselves. Everyone with a night power submits it secretly; Death agrees on its kill. When everyone is asleep — or the timer runs out — the server resolves every action at once and the next Day dawns.</li>
</ol>
<p class="small">Anything you fail to submit before a window closes becomes a pass (or an abstention). A disconnected phone keeps its seat and its secrets.</p>`,
  winH: 'Winning',
  win: `<ul>
<li><b>Non-Death wins</b> the moment no Death-aligned player is alive.</li>
<li><b>Death wins</b> the moment living Death-aligned players <b>strictly outnumber</b> everyone else alive. Equal numbers is not enough.</li>
<li><b>Jester</b> (Full Deck only) wins alone, instantly, if the town sentences them by vote.</li>
<li>If a night ever leaves nobody alive, the match is a <b>draw</b>.</li>
<li>With the <b>Doomsday Clock</b>, Death also wins if nobody has won when the final Day closes.</li>
<li><b>Blood Moon</b> (on by default): after two nights in a row without a death, the next night no protection holds and nothing can block Death's kill. It ends stalemates such as a lone Guardian shielding themself against a lone Death.</li>
<li><b>Death wins in the final two</b> (optional): if a Death is among the last two alive, Death wins at once.</li>
</ul>
<p>Victory is checked after every complete resolution — never halfway through a night.</p>`,
  coreH: 'Core roles',
  coreP: 'Always in the game.',
  killH: 'How the Death team kills',
  kill: 'All living Death teammates share one room. Each proposes targets; the kill happens only if <b>every one of them confirms exactly the same set</b>. Any disagreement, or anyone failing to confirm, and Death passes. The team kills <b>one</b> player per night no matter how many Deaths there are — two with Double Jeopardy, Night Shift or Power Surge, and never more than two.',
  extH: 'Extended roles — Standard',
  extP: 'From 7 players, extra seats are filled from this pool (drawn secretly). 7 players → 1 extended seat, 10 → 2, 11+ → 3.',
  fullH: 'Full Deck additions',
  fullP: 'Only in Full Deck / Chaos or Custom. Experienced groups.',
  dreamsH: 'Dreams',
  dreamsP: 'From Night 1, each living player draws one Dream card at random every night (duplicates allowed). It lasts that night only. You may describe yours — truthfully or not.',
  dreamsNote: 'Some Dreams are rarer than others, and Insomnia never appears more than twice in a match; Custom games can change how often each one is drawn. Dream Snatcher swaps happen during nightfall, before actions open, in seat order, once each. Whatever card you end up holding is the one that counts.',
  rulesH: 'Rule cards',
  rulesP: '1–3 are drawn (or chosen) at setup and stay in force all match. Some can only be honour-enforced when you play in the same room.',
  modesTh: ['Setup', 'Players', 'What changes'],
  countsH: 'Role counts',
  countsTh: ['Players', 'Death', 'Innocent', 'Guardian · Mentalist · Psycho', 'Extended'],
  modesNote: 'Classic / Learn fills extended seats with Innocents. Same room or remote is a delivery choice, not a different game: remote adds in-app table chat (and neighbour whispers under Fog of War).',
  orderH: 'Who beats what at night',
  order: `<p>Everyone submits at once; then the server resolves in a fixed order so the outcome never depends on who tapped first.</p>
<ol>
<li><b>Suppression.</b> Bard's silence cancels every role power. Sleep Paralysis stops its holder — and an active Death holding it stops the whole kill. Unreliable Power rolls its dice.</li>
<li><b>Curses & visits.</b> A Witch's Curse fizzles its target's action (or the whole Death kill). A Whore visiting any active Death sets the kill to zero.</li>
<li><b>Conversions.</b> Double Agent pledges, then Mimic copies. They count for the Mentalist tonight, but new Death members join the kill from next night.</li>
<li><b>Death's kill.</b> A target survives if they have, in order: temporary revival, Guardian Angel, Witch Bless, Guardian shield, a correct Oracle prediction. Otherwise a Bodyguard takes the blade — otherwise they die.</li>
<li><b>Psycho.</b> The mark lands unless the target is dead or protected (revival, Angel, Bless, Guardian).</li>
<li><b>Bombs & the rest.</b> A bomb is a fair coin; Guardian does not stop it. Visiting Whores are caught in the blast. Readings, deliveries, bets.</li>
<li><b>Necromancer</b> raises the dead — only if they survived the night.</li>
<li><b>Linked fates.</b> Whores die with a visited Death victim; Shared Nightmare and Sleepwalking holders die with their partner. Only revival or Guardian Angel prevents a linked death. Then any borrowed time expires.</li>
<li><b>Dawn.</b> Survivors receive their private reports. The public learns only who died.</li>
</ol>`,
  sidesH: 'Other sides and twists',
  sides: `<p>Optional, switched on in the lobby (or added with the role counters in Custom games). The town wins only once Death, the Cult and the Ripper are all gone.</p>
<ul>
<li><b>Lovers:</b> two random players, from any side, fall in love. Each learns the other's name. If one dies, the other dies of a broken heart. If they are the last two alive, they win together.</li>
<li><b>The Cult:</b> a Cult Leader recruits one player each night. Recruits keep their role but win with the Cult, which wins when it outnumbers everyone else. Death, the Ripper and protected players cannot be recruited.</li>
<li><b>The Ripper:</b> a lone killer who strikes each night. Death cannot kill the Ripper at night (except under a Blood Moon). The Ripper wins as the last one standing, or alone with one player who is no killer.</li>
<li><b>Clues</b> (on by default, rare): at some dawns, one or two players outside Death's team receive a true hint, such as "one of A and B walks with Death".</li>
<li><b>Coin-toss tiebreak</b> (optional): a tie at the top is settled by a coin toss instead of sparing everyone.</li>
<li><b>Open Ballot</b> (a Rule card): every vote is public as it comes in.</li>
</ul>`,
  missionCardsH: 'Mission cards',
  // ── Every game's chapter: setup, the game, winning, lobby options (the cast comes from the content) ──
  // ── Missions ──
  missionsSetup: `<p>5–12 players. Nobody dies: Death has slipped into the expedition, and the table must find it before it finds the Medium. Everyone is dealt a secret role. Death's players see each other (except the Stray); the Living know only themselves, and the Medium senses who is Death.</p>
<p>The table plays five missions. Each mission needs a team of a set size (shown in the lobby and on the TV); at 7 players and more, mission 4 needs two Sabotages to fail.</p>`,
  missionsLoop: `<ol>
<li><b>The mission card.</b> Each mission starts with a card. Most are Regular; now and then one changes the team, the vote or the reveal for this mission.</li>
<li><b>The proposal.</b> The Mission Leader (who holds the lantern) taps players on the ring to fill the team.</li>
<li><b>The team vote.</b> Everyone holds Approve or Reject in secret. The votes turn over all at once, with names. A majority sends the team; otherwise the lantern passes to the next player. The fifth proposal of a mission goes ahead whatever the vote.</li>
<li><b>The mission.</b> Each team member plays a card face down. The Living can only play Succeed; Death may play Succeed or Sabotage. The cards are shuffled and turned one by one: one Sabotage fails the mission.</li>
<li><b>The night interlude.</b> Everyone records a secret Hunch about who is Death. After missions 2, 3 and 4 the Candle holder learns one player's side, and the Candle passes to that player. With Clues on, a true hint may arrive at dawn.</li>
</ol>`,
  missionsWin: `<ul>
<li><b>Three successes:</b> Death unmasks, and the Reaper names who they think is the Medium (Death may talk it over first). Right: Death wins. Wrong: the Living win.</li>
<li><b>Three failures:</b> the Last Stand. Everyone names one player. If the table names one of the Living, Death wins; if it catches Death, the Reaper still gets the Reckoning: find the Medium and Death steals the win.</li>
<li><b>Side Missions</b> change the weight of your Last Stand vote: double if you completed yours, half if you failed it.</li>
<li>The Jester, if in play, wins alone by being named in the Last Stand or by the Reaper.</li>
</ul>`,
  missionsOpts: `<ul>
<li><b>Roles:</b> switch the Believer, Charlatan, Veiled, Stray, Undertaker and Jester in or out, and add the Twins.</li>
<li><b>Side Missions:</b> a secret personal objective for everyone.</li>
<li><b>Next Mission Leader:</b> the next player in line, or chosen by the last leader.</li>
<li><b>Mission cards:</b> off, rare or sometimes.</li>
<li><b>Clues:</b> rare, uncommon or common.</li>
<li><b>Story:</b> a random WHO / WHERE / WHY, or your own.</li>
</ul>`,
  // ── Exorcism ──
  exorcismSetup: `<p>3–12 players, 5–10 minutes a round. The Living know the secret password that would banish the Demon hiding among them; the Demon does not. Everyone sees the category. Words are dealt in the table's language on every phone, so they match.</p>`,
  exorcismLoop: `<ol>
<li><b>The crystal ball.</b> Tap it to look inside: the category, and (if you are Living) the password. The Demon sees only the category and must bluff.</li>
<li><b>The lots.</b> A lottery picks who speaks first; then the turn goes round the table in seat order.</li>
<li><b>One word each.</b> On your turn, say one word linked to the password, then hold the button on your phone. Prove you know it without handing it to the Demon. Depending on the lobby, the words go round once or more, and may be typed and shown on the TV.</li>
<li><b>Name the Demon.</b> Talk it over, then everyone votes for one player.</li>
<li><b>One last guess.</b> A caught Demon may name the password, from the word grid or typed.</li>
</ol>`,
  exorcismWin: `<ul>
<li>The vote names one of the Living, or ties (unless the coin settles ties): <b>the Demon wins</b>.</li>
<li>The vote names the Demon: <b>the Living win</b>, unless the Demon then guesses the password, and steals the win.</li>
<li>Scores carry on round after round: each Living player +1 for a win, each Demon +2.</li>
</ul>`,
  exorcismOpts: `<ul>
<li><b>Demons:</b> one, or two from 7 players; two Demons may know each other or not.</li>
<li><b>One last guess:</b> on or off.</li>
<li><b>Tied vote:</b> the Demon escapes, or a coin decides.</li>
<li><b>Word grid:</b> 16 words on the TV and phones; the password is one of them.</li>
<li><b>Rounds:</b> how many times the words go round the table. <b>Type the words:</b> shown on the TV.</li>
<li><b>Categories:</b> choose which word lists to draw from.</li>
</ul>`,
  // ── Coffins ──
  coffinsSetup: `<p>3–10 players, a quick game. Everyone plays for themself and holds four coffins: three Gold and one Curse (five with the longer option: four Gold, one Curse). Your coffins are hidden from everyone else.</p>`,
  coffinsLoop: `<ol>
<li><b>The burial.</b> Everyone secretly buries one coffin at once: tap a coffin, then tap Bury it. Your grave is a stack, newest on top.</li>
<li><b>Bury or challenge.</b> From the round's first player, each turn you either bury another coffin on top of your stack, or challenge: "I can open N", up to the number of coffins buried in total.</li>
<li><b>The bidding.</b> Around the table, raise the number or pass. A pass is final for the round. The last bidder left is the Digger.</li>
<li><b>The dig.</b> The Digger opens their own coffins first, top down, then picks other graves, one top coffin at a time, until N coffins are open. Every coffin turns over on the TV.</li>
<li><b>The result.</b> All Gold: a clean dig, and your headstone turns gilt. A Curse in your own grave: you choose a coffin to lose. Someone else's Curse: they draw one of your coffins blind, and it is gone; the Curse's owner starts the next round.</li>
</ol>`,
  coffinsWin: `<ul>
<li>Win with two clean digs (1 or 3 in the lobby), or as the last player with coffins.</li>
<li>Across a match: the winner +3, every clean dig +1, every rise from the dead +1.</li>
</ul>`,
  coffinsOpts: `<ul>
<li><b>The Death coffin</b> (on by default): each round one hidden player holds it in place of a Gold coffin. Dig it up and the dig fails; its holder steals one of your coffins, which becomes Gold.</li>
<li><b>Ghost wagers and Revenants</b> (on by default): players with no coffins left wager Gold or Curse on every dig; three right and they rise with one Gold coffin.</li>
<li><b>Relics</b> (off by default): a secret Lantern (peek at a grave), Key (open another grave before your own) or Ward (a curse costs nothing), each used once.</li>
<li><b>Clean digs to win, coffins per player, games per match.</b></li>
</ul>`,
  // ── Carnival ──
  carnivalSetup: `<p>4–12 players. Everyone plays for themself. Every mask is a familiar Dead Set role, and each has a power. Everyone starts with 6 Souls; the Offering, the plate in the middle of the table, starts empty. At 4–5 players two extra masks sit on empty chairs: they join the ball but never act.</p>
<p><b>The unmasking:</b> for a few seconds every mask is shown face up, on the TV and on every phone. Remember them; then they turn face down. A lottery picks the first dancer, and turns go clockwise.</p>`,
  carnivalLoop: `<p>On your turn, do one of three things:</p>
<ul>
<li><b>Swap or pretend.</b> Pick another mask (a player or an empty chair), then hold Swap or Pretend. The two buttons look the same, and nobody, not even the other player, learns which you chose.</li>
<li><b>Peek.</b> Look at your own mask for a moment. Everyone sees that you looked.</li>
<li><b>Claim.</b> Name a mask, "I am the Magistrate", and use its power.</li>
</ul>
<p><b>Challenges.</b> When someone claims, every other phone asks: <em>Is that your mask?</em> If nobody challenges, the claim stands, and the power works whatever the claimant really wears. If anyone challenges, the claimant and every challenger lift their masks: whoever truly wears it uses the power, and everyone else revealed pays a Soul (or more, in the lobby) into the Offering.</p>
<p><b>The opening dance.</b> Each player's first turn (two, if the host chooses) must be Swap or pretend, so the masks are already in doubt before anyone claims.</p>`,
  carnivalWin: `<ul>
<li><b>A full purse:</b> 13 Souls (or the lobby's number) and you win at once.</li>
<li><b>Death's harvest:</b> the player who has reaped 6 Souls through Death claims wins.</li>
<li><b>Ruin:</b> the moment someone falls to 0 Souls, the richest player wins (a tie goes to the higher harvest).</li>
<li>Across a match: the winner +3, everyone else +1 for each Soul above 6.</li>
</ul>`,
  carnivalOpts: `<ul>
<li><b>Masks:</b> the recommended set grows with the table; or build your own, one mask per seat (Death is required; only the Innocent may repeat).</li>
<li><b>A full purse, Death's harvest, penalty for a wrong claim, the opening dance, games per match.</b></li>
<li><b>Notes (the ball diary):</b> off by default, so you keep what you saw in your head.</li>
</ul>
<p>Tap <em>Masks at the ball</em> at any time for every mask in play and its power, drawn as a line of signs.</p>`,
  // ── Midnight ──
  midnightSetup: `<p>4–12 players, about 10 minutes. One night, one vote, no second chances. The deck holds one card per player plus three face down on the table (the empty chairs). The deck is public; who holds what is not. Everyone sees their own card once, at the deal.</p>
<p>Cards change hands in the dark. <b>At dawn you are whatever card is in front of you</b>, not what you were dealt.</p>`,
  midnightLoop: `<ol>
<li><b>The deal.</b> Look at your card once.</li>
<li><b>The night.</b> The phones wake each role in turn: Mimic, Death, Conspirator, Twins, Mentalist, Double Agent, Witch, Gambler, Insomniac. Every step lasts the same 10 seconds and runs even if its card lies on the table, so the night gives nothing away. Only the player dealt that card gets controls; every other phone says to keep your eyes shut. A Gambler who does nothing swaps with a random table card.</li>
<li><b>The day.</b> One discussion (5 minutes by default): claim, accuse, lie. Cards may have moved; trust nobody, not even yourself. The host can open the vote early.</li>
<li><b>The vote.</b> Everyone points at one other player at once. The player with the most votes dies, if that is at least two votes; a tie at the top kills every tied player. If the Vigilante dies, the player they pointed at dies too.</li>
</ol>`,
  midnightWin: `<ul>
<li>Sides are read from the cards at dawn (a Mimic counts as the role it copied).</li>
<li><b>The Living</b> win if at least one Death dies; with no Death among the players, if nobody dies.</li>
<li><b>Death and the Conspirator</b> win if no Death dies (and the Jester did not die).</li>
<li><b>The Jester</b> wins alone by being voted out. Several sides can win together.</li>
<li>Across a match: every winner +1, the Jester +2. The end screen shows every card as dealt and at dawn, and replays the night.</li>
</ul>`,
  midnightOpts: `<ul>
<li><b>Cards:</b> the recommended deck grows with the table; or choose them yourself (Death 1–2, Twins 0 or 2, Innocent 0–4, the rest 0–1; the total must be players + 3).</li>
<li><b>A lone Death peeks:</b> a Death who wakes alone may look at one table card.</li>
<li><b>Discussion length, games per match.</b></li>
</ul>`,
  // ── Séance ──
  seanceSetup: `<p>4–10 players, about 30 minutes. A co-operative murder mystery with a traitor. One player is the Ghost: it knows who killed it, where and why, and it cannot speak. Everyone else is a Medium, reading its visions. From five players a Deceiver may hide among the Mediums: a second spirit that knows the truth and works against the table.</p>
<p><b>The board:</b> three rows of story cards, WHO, WHERE and WHY. One card in each row is the truth.</p>`,
  seanceLoop: `<ol>
<li><b>Visions.</b> Each round every Medium is given one row. The Ghost picks a vision for each Medium from its hand: a card of two or three etched motifs that should point to the truth in that row.</li>
<li><b>The reveal.</b> The visions turn face up for everyone. Describe them, argue, persuade. The Ghost stays silent, but may frost a vision with a cold spot: <em>this one is not mine</em>.</li>
<li><b>The Deceiver's swap.</b> A few times a game, the Deceiver secretly swaps another Medium's vision for one of its own lies.</li>
<li><b>Candles.</b> Each Medium lights a candle on a card in their row, or holds it. The card with the most candles is put to the spirit. Right: the row is solved. Wrong: the card is struck.</li>
<li><b>The clock.</b> Every round burns a candle of the séance clock (seven at Standard).</li>
</ol>`,
  seanceWin: `<ul>
<li>Solve all three rows before the candles burn out, then name the Deceiver. Right: a <b>full victory</b>. Wrong: a <b>hollow victory</b>, shared with the Deceiver.</li>
<li>If the clock burns out, the Deceiver wins (with no Deceiver, the table loses). With one row left, everyone first lights a last-breath candle on it.</li>
<li>Across a match: a full victory +2 for the Ghost and each Medium; a hollow one +1 each and +1 for the Deceiver; a Deceiver's win +3.</li>
<li>The end screen replays every round: the true visions, the swaps and the candles.</li>
</ul>`,
  seanceOpts: `<ul>
<li><b>Difficulty:</b> how many cards in a row, visions per Medium and candles on the clock.</li>
<li><b>Deceivers:</b> none, one or two, and whether two know each other; how many swaps they get.</li>
<li><b>The Ghost's cold spots:</b> how many visions it may frost.</li>
<li><b>Last breath:</b> on or off. <b>The Ghost:</b> drawn by lot, or chosen by the host. <b>Games per match.</b></li>
</ul>`,
  // ── Graverobbers ──
  graveSetup: `<p>4–12 players, about 15 minutes. Two crews of grave robbers, the Moon and the Sun, dig a cemetery of 25 headstones for the relics that will summon their deity. A coin picks the crew that digs first: it has 9 relics in the ground, the other crew 8. Seven graves are empty, and one is Death's.</p>
<p>Each crew has an <b>Undertaker</b>, the only player who sees the burial register: what lies under every stone. Everyone else is a digger. The headstones show words in the table's language, or pencil icons.</p>`,
  graveLoop: `<ol>
<li><b>The sign.</b> On their crew's turn, the Undertaker gives one word and one number, "Ocean · 3": a word that links several of their crew's graves, and how many. The word may not be on the board. Then they say nothing more.</li>
<li><b>The dig.</b> The diggers talk it over and vote on their phones; the grave with the most votes is dug (a tie goes to the coin).</li>
<li><b>What lies beneath.</b> Your crew's relic: dig on, up to the number. An empty grave, or the other crew's relic (it is theirs now): the turn passes. Death's grave: your crew loses at once.</li>
<li><b>Stopping.</b> The crew may vote to stop. Stopping before the number is reached keeps one bonus dig for the next turn (it never stacks).</li>
</ol>
<p>Switch your phone between <em>Stones</em> (the words or icons) and <em>Map</em> (the board at a glance).</p>
<p><b>Three crews</b> (6–12 players): the Moon, the Sun and the Stars, a third of the table each. The first crew hides 7 relics, the others 6, with 5 empty graves. Death's grave puts a crew out of the game; the others dig on, and when one crew is left, it wins.</p>`,
  graveWin: `<ul>
<li>The first crew with all its relics dug up wins, even if the other crew dug some of them up by mistake.</li>
<li>A crew that opens Death's grave loses at once (with three crews, it is out).</li>
<li>Across a match of 1, 3 or 5 games: every win +1. The Undertakers rotate between games.</li>
</ul>`,
  graveOpts: `<ul>
<li><b>Number of crews:</b> two, or three from 6 players.</li>
<li><b>Graves show:</b> words or icons; <b>famous names</b> (films, heroes, landmarks) on or off.</li>
<li><b>Crews:</b> by seat (move players round the table to change crews) or random. <b>Undertakers:</b> rotating, random or chosen.</li>
<li><b>Signs:</b> typed (the word appears on every screen) or spoken (said aloud, the number tapped). <b>Games per match.</b></li>
</ul>`,
  // ── Mimic ──
  mimicSetup: `<p>4–12 players, about 8 minutes a game. Everyone shares one secret place, a story card, and holds a character there, except the Mimic, who sees only static and the board of possible places. The Living must find the Mimic; the Mimic must work out the place.</p>`,
  mimicLoop: `<ol>
<li><b>Questions.</b> Whoever holds the lantern asks anyone a question about the place, aloud, then taps who they asked; the lantern passes to them, and they ask next. Never ask back the player who just asked you. Answer so the Living recognise you, without telling the Mimic the place.</li>
<li><b>Accuse.</b> Once per game each, anyone may accuse a player. The clock stops; everyone else votes Agree or Disagree. Only a unanimous table convicts; otherwise the clock runs on.</li>
<li><b>The Mimic unmasks.</b> At any moment the Mimic may reveal itself and name the place.</li>
<li><b>Time's up.</b> When the clock runs out (8 minutes by default), everyone points at one suspect. The most votes is convicted; a tie lets the Mimic slip away.</li>
</ol>
<p>Strike out places on your own phone as you listen: your notes are private.</p>`,
  mimicWin: `<ul>
<li>Convict the Mimic: <b>the Living win</b>, unless a caught Mimic then names the place, and steals the win.</li>
<li>Convict one of the Living, or let the Mimic slip away: <b>the Mimic wins</b>.</li>
<li>The Mimic names the place: right, it wins; wrong, the Living win.</li>
<li>Across a match (3 games by default): the Living +1 each, and the accuser who caught the Mimic +1 more; the Mimic +2, or +3 for naming the place.</li>
</ul>`,
  mimicOpts: `<ul>
<li><b>Places on the board:</b> more places make it harder for the Mimic.</li>
<li><b>Last guess:</b> a caught Mimic may still name the place.</li>
<li><b>The TV backdrop sharpens:</b> a trust option. The TV shows the true place deeply blurred, sharpening as time runs out. Anyone who opens the TV link could read it.</li>
<li><b>Question time, games per match.</b></li>
</ul>`,
  // ── The Omen ──
  omenSetup: `<p>4–12 players, about 10 minutes. Everyone plays for themself; there are no hidden sides. An occult wheel points to one of three faces, Life, Death and Rebirth, in that order clockwise. Everyone starts with 5 Influence, shown to all.</p>`,
  omenLoop: `<p>Seven rounds, each in three steps:</p>
<ol>
<li><b>The wheel</b> shows where it starts this round.</li>
<li><b>The sealed ballot.</b> In secret, predict where the wheel will stop, and choose to turn it one step back, one step on, or leave it. A turn costs one Influence; with none left you can only leave it. You can change your ballot until everyone is in.</li>
<li><b>The reveal.</b> Every turn is added up and the wheel moves once, by the total (three steps the same way bring it back). Every prediction and every turn is then shown.</li>
</ol>
<p>The skill is reading the table: who still has Influence, who wants the wheel where, and who will push it.</p>`,
  omenWin: `<ul>
<li>A right prediction scores 3. A missing ballot predicts nothing and turns nothing.</li>
<li>At the end, every unused Influence is worth 1 point. The most points wins; ties share the victory.</li>
</ul>`,
  omenOpts: `<p>No switches: just the timers for each step.</p>`,
  // ── The Mirror ──
  mirrorSetup: `<p>4–12 players, about 15 minutes. Everyone plays for themself. A haunted mirror does not show your reflection: it shows what your friends think you will do. Eight fictional dilemmas, each with three answers, A, B and C, and no right one.</p>
<p>Each round you read one other player. The pairs rotate, so over the game everyone reads everyone, and everyone is read by exactly one player each round.</p>`,
  mirrorLoop: `<ol>
<li><b>Talk it over.</b> The dilemma and who reads whom are public. Ask, tease, mislead.</li>
<li><b>The sealed ballot.</b> Choose your own answer, and predict the answer of the player you read. Both are needed, and you can change them until everyone is in.</li>
<li><b>The mirror shows everything:</b> every answer, and every reading, right or wrong.</li>
</ol>`,
  mirrorWin: `<ul>
<li>A right prediction scores 2; your own answer scores nothing, so surprising your reader is fair play.</li>
<li>A missing ballot becomes a random answer; its reader is still scored against it.</li>
<li>The best reader wins; ties share the victory.</li>
</ul>`,
  mirrorOpts: `<p>No switches beyond the timers. When more dilemma packs exist, the lobby lets you choose which ones the eight are drawn from.</p>`,
};

/** The guide's chapters (polish pass): the basics describe the platform; then every game, Classic
 * included, has its own chapter laid out like a rule book: at a glance, how it works, setup, the cast,
 * how a game goes, winning and scores, lobby options. */
const GAME_KEY = { graverobbers: 'grave' };
const PLAIN_CAST = { missions: 'missions', exorcism: 'exorcism', seance: 'seance', graverobbers: 'graverobbers', mimic: 'mimic' };

export function renderGuide(c, { glyph, dreamGlyph, esc, t, roleF, dreamF, ruleF, presetF, tx, mcardF, FAMILIES, MODES, howFor = () => '', castFor = () => '' }) {
  const G = { ...GUIDE_EN, ...(tx('guide', null) ?? {}) };
  const name = (id) => (MODES[id]?.name ? t(MODES[id].name) : presetF(id, 'name')).replace(/^Dead Set\s*:\s*/, '');
  // E3: two groups, the basics and the games by family (as in the lobby). Classic's own sections are
  // listed under it. A phone gets a sticky select; a wide screen a left column with the same entries.
  const basics = [['b-about', G.aboutH], ['b-table', G.tableH], ['b-setup', G.setupH], ['b-play', G.playH], ['b-after', G.afterH]];
  const classicParts = [['c-round', G.toc[1]], ['c-win', G.toc[2]], ['c-core', G.toc[3]], ['c-ext', G.toc[4]], ['c-full', G.toc[5]], ['c-dreams', G.toc[6]], ['c-rules', G.toc[7]], ['c-presets', G.presetsH], ['c-order', G.toc[9]], ['c-sides', G.sidesH]];
  const families = FAMILIES.map((f) => [t(f.title), Object.keys(MODES).filter((id) => MODES[id].family === f.id)]).filter(([, ms]) => ms.length);
  const opt = ([id, label], sub) => `<option value="${id}">${sub ? '— ' : ''}${esc(String(label).replace(/<[^>]+>/g, ''))}</option>`;
  const link = ([id, label], sub) => `<a href="#${id}" class="${sub ? 'sub' : ''}">${label}</a>`;
  const gameOpts = (id) => opt([`m-${id}`, name(id)]) + (id === 'classic' ? classicParts.map((x) => opt(x, true)).join('') : '');
  const gameLinks = (id) => link([`m-${id}`, esc(name(id))]) + (id === 'classic' ? classicParts.map((x) => link(x, true)).join('') : '');
  const nav = `<nav class="g-nav" aria-label="${esc(t('Chapters'))}">
    <label class="g-jump"><span class="kicker">${t('Chapters')}</span><select class="input" data-act-change="guideJump">
      <optgroup label="${esc(G.basicsH)}">${basics.map((x) => opt(x)).join('')}</optgroup>
      ${families.map(([title, ms]) => `<optgroup label="${esc(`${t('The modes')} · ${title}`)}">${ms.map(gameOpts).join('')}</optgroup>`).join('')}</select></label>
    <div class="g-col"><div class="kicker">${G.basicsH}</div>${basics.map((x) => link(x)).join('')}
      <div class="kicker g-modes">${t('The modes')}</div>${families.map(([title, ms]) => `<small>${esc(title)}</small>${ms.map(gameLinks).join('')}`).join('')}</div>
  </nav>`;
  const roles = c?.roles ?? [];
  const bySet = (set) => roles.filter((r) => r.set === set);
  const align = (a) => t({ DEATH: 'Death', INDEPENDENT: 'Independent', CULT: 'Cult', RIPPER: 'The Ripper' }[a] ?? 'Non-Death');
  const entry = (r) => { const alias = roleF(r.id, 'alias'); return `<div class="entry">${glyph(r.glyph)}<div><div class="when">${esc(align(r.alignment))} · ${esc(roleF(r.id, 'when'))}</div><h4>${esc(roleF(r.id, 'name'))}${alias ? ` <span class="small muted">(${esc(alias)})</span>` : ''}</h4><p>${esc(roleF(r.id, 'text'))}</p></div></div>`; };
  const scaling = c?.scaling ?? {};
  const row = (cells, tag = 'td') => `<tr>${cells.map((x) => `<${tag}>${x}</${tag}>`).join('')}</tr>`;
  // Every game opens with its emblem, its family and table size, and the same illustrated steps as its lobby.
  const familyOf = (id) => FAMILIES.find((f) => f.id === MODES[id]?.family);
  const head = (id) => `<div class="g-mhead">${glyph(MODES[id].emblem)}<div><span class="kicker">${esc(t(familyOf(id)?.title ?? ''))}</span><span class="g-mfacts">${esc(t('{a}–{b} players', { a: MODES[id].min, b: MODES[id].max }))}</span></div></div>${howFor(id)}`;
  const part = (id, h, body) => (body ? `<h3${id ? ` id="${id}"` : ''}>${h}</h3>${body}` : '');
  const cast = (id) => (PLAIN_CAST[id] ? bySet(PLAIN_CAST[id]).map(entry).join('') : castFor(id));
  const game = (id) => {
    const k = GAME_KEY[id] ?? id;
    return `<section id="m-${id}" class="g-mode"><h2>${esc(name(id))}</h2>${head(id)}
      ${part('', G.hSetup, G[`${k}Setup`])}
      ${part('', G.hCast, cast(id))}
      ${id === 'missions' ? part('', G.missionCardsH, (c?.missionCards ?? []).map((x) => `<div class="entry">${glyph('mission')}<div><h4>${esc(mcardF(x.id, 'name'))}</h4><p>${esc(mcardF(x.id, 'text'))}</p></div></div>`).join('')) : ''}
      ${part('', G.hLoop, G[`${k}Loop`])}
      ${part('', G.hWin, G[`${k}Win`])}
      ${part('', G.hOpts, G[`${k}Opts`])}</section>`;
  };
  const classic = `<section id="m-classic" class="g-mode"><h2>${esc(name('classic'))}</h2>${head('classic')}
    <p class="scenario">${G.classicP}</p>${G.classicSetup}
    ${part('c-round', G.roundH, G.round)}
    ${part('c-win', G.winH, G.win)}
    ${part('c-core', G.coreH, `<p>${G.coreP}</p>${bySet('core').map(entry).join('')}<h4 class="g-sub">${G.killH}</h4><p>${G.kill}</p>`)}
    ${part('c-ext', G.extH, `<p>${G.extP}</p>${bySet('standard').map(entry).join('')}`)}
    ${part('c-full', G.fullH, `<p>${G.fullP}</p>${bySet('full').map(entry).join('')}`)}
    ${part('c-dreams', G.dreamsH, `<p>${G.dreamsP}</p>${(c?.dreams ?? []).map((d) => `<div class="entry">${dreamGlyph(d.id)}<div><h4>${esc(dreamF(d.id, 'name'))}</h4><p>${esc(dreamF(d.id, 'text'))}</p></div></div>`).join('')}<p class="small">${G.dreamsNote}</p>`)}
    ${part('c-rules', G.rulesH, `<p>${G.rulesP}</p>${(c?.rules ?? []).map((r) => `<div class="entry">${glyph('scroll')}<div><h4>${esc(ruleF(r.id, 'name'))}</h4><p>${esc(ruleF(r.id, 'text'))} <span class="muted">${esc(ruleF(r.id, 'enforcement'))}</span></p></div></div>`).join('')}`)}
    ${part('c-presets', G.presetsH, `<table><thead>${row(G.modesTh, 'th')}</thead><tbody>
      ${(c?.presets ?? []).filter((p) => !Object.keys(MODES).some((m) => m !== 'classic' && p[m])).map((p) => row([`<b>${esc(presetF(p.id, 'name'))}</b>`, `${p.min}–${p.max}`, esc(presetF(p.id, 'blurb'))])).join('')}
      </tbody></table>
      <h4 class="g-sub">${G.countsH}</h4>
      <table><thead>${row(G.countsTh, 'th')}</thead><tbody>
      ${Object.entries(scaling).map(([n, s]) => row([n, s.DEATH, s.INNOCENT, '1 · 1 · 1', s.EXTENDED])).join('')}
      </tbody></table>
      <p class="small">${G.modesNote}</p>`)}
    ${part('c-order', G.orderH, G.order)}
    ${part('c-sides', G.sidesH, `${G.sides}${bySet('side').map(entry).join('')}`)}</section>`;
  return `<div class="guide">
  <header class="phase-head"><span class="kicker">${G.kicker}</span><h1>${G.title}</h1>
    <p class="scenario">${G.intro}</p></header>
  ${nav}<div class="g-body">
  <section id="b-about"><h2>${G.aboutH}</h2>${G.about}</section>
  <section id="b-table"><h2>${G.tableH}</h2>${G.table}</section>
  <section id="b-setup"><h2>${G.setupH}</h2>${G.setup}</section>
  <section id="b-play"><h2>${G.playH}</h2>${G.play}</section>
  <section id="b-after"><h2>${G.afterH}</h2>${G.after}</section>
  ${FAMILIES.flatMap((f) => Object.keys(MODES).filter((id) => MODES[id].family === f.id)).map((id) => (id === 'classic' ? classic : game(id))).join('\n')}
  </div></div>`;
}
