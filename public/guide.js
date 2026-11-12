// In-app "How to play". Catalog entries come from /api/content so the guide
// can never drift from the rules engine's own definitions. The prose lives in
// GUIDE_EN; each language file may provide its own `guide` table (same keys).
export const GUIDE_EN = {
  kicker: 'The rules, v1.0',
  title: 'How to<br><i>play.</i>',
  intro: 'Most of you want to survive. A few of you are Death. Nobody knows who is who — except Death, who knows each other.',
  toc: ['Basics', 'A round', 'Winning', 'Core roles', 'Extended roles', 'Full Deck', 'Dreams', 'Rule cards', 'Modes', 'Night order', 'Phones'],
  basicsH: 'The basics',
  basics: `<p>Dead Set is a social-deduction party game for 5–13 players. Everyone joins the same room on their own phone and is dealt a secret <b>Role</b>. Most roles belong to the <b>non-Death</b> faction; one or more players are secretly <b>Death</b>.</p>
<ul>
<li><b>Roles</b> are who you are for the whole match: your alignment and your power.</li>
<li><b>Dreams</b> are one-night effects: from Night 1, every living player secretly draws one each night.</li>
<li><b>Rule cards</b> (1–3, drawn at setup) bend the whole match — double kills, weighted votes, ghosts that vote.</li>
<li><b>The scenario</b> (WHO / WHERE / WHY) is pure storytelling. It never changes a rule.</li>
</ul>
<p>You may tell the truth about your role, lie about it, or keep quiet. Never show your screen. The app is the narrator: nobody has to sit out, and the host sees no more secrets than anyone else.</p>`,
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
  modesH: 'Modes',
  modesTh: ['Mode', 'Players', 'What changes'],
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
  phonesH: 'Playing on phones',
  phones: `<ul>
<li>The host creates a room and shares the six-character code or QR. Everyone else opens the link, enters a name, taps <em>Ready</em>.</li>
<li>Your seat is tied to your browser. If a phone dies, the host can issue a one-time <b>recovery code</b> from their controls; entering it on a new device moves your seat there and signs the old one out.</li>
<li>The host's phone is an ordinary player phone with a few extra buttons: advance the phase, add 30 seconds, end the match. The host cannot see roles, dreams, or votes.</li>
<li>A <b>public board</b> (no secrets) can be shown on a TV: open <span class="mono">/board/CODE</span>.</li>
<li>For a game where someone wants to run the table and see everything, create the room as a <b>trusted moderator</b>. They cannot hold a seat, and everyone is told.</li>
<li>Each player picks their own language from the language button on the start screen, the invitation or the room menu. The host sets the table's default language in the lobby.</li>
<li>MUTE, Fog of War and Cursed Silence are honour rules in person. Remote play enforces them in the chat.</li>
</ul>`,
  exorcismH: 'Dead Set: Exorcism',
  exorcism: `<p>A word game of bluff for 3–12 players, chosen in the lobby. The table's language is used on every phone, so the words match.</p>
<ol>
<li><b>The crystal ball.</b> Everyone sees the category. The Living also see the password; the Demon (one, or two from 7 players) does not, and may get a vague hint if the host allows it.</li>
<li><b>The lots.</b> A lottery picks who speaks first; then the turn goes around the table in seat order.</li>
<li><b>One word each.</b> On your turn, say one word linked to the password, then hold the button on your phone. Prove you know it without handing it to the Demon. Optionally the words are typed and shown on the TV.</li>
<li><b>Name the Demon.</b> Talk it over, then everyone votes. Name one of the Living (or tie, unless the coin is on) and the Demon wins.</li>
<li><b>One last guess.</b> A caught Demon gets one guess at the password, from the 4×4 word grid or typed. Right, and the Demon still wins.</li>
</ol>
<p>The round ends back in the same lobby with the same settings, and the scores carry on: Living +1 for a win, Demons +2.</p>`,
  coffinsH: 'Dead Set: Coffins',
  coffins: `<p>A quick bluffing game for 3–10 players, chosen in the lobby. Everyone holds 3 Gold coffins and one Curse (4 and one with the longer option).</p>
<ol>
<li><b>The burial.</b> Everyone secretly buries one coffin at once: tap it, then hold. Then, from the round's first player, each turn you either bury another coffin on top of your stack, or challenge: <i>"I can open N"</i>, up to the number buried in total.</li>
<li><b>The bidding.</b> Around the table, raise or pass. A pass is final for the round. The last bidder left is the Digger.</li>
<li><b>The dig.</b> The Digger opens their own coffins first, top down, then picks other graves, one top coffin at a time, until N are open.</li>
<li><b>Clean, or cursed.</b> All Gold: a clean dig, and the headstone turns gilt. A curse in your own grave: you choose a coffin to lose. Someone else's curse: they draw one of your coffins blindly, and it is gone. Their owner starts the next round.</li>
<li><b>Win</b> with your clean digs (2 by default; 1 or 3 in the lobby), or as the last player with coffins.</li>
</ol>
<p><b>The Death coffin</b> (on by default): each round one hidden player holds it in place of a Gold coffin. Dig it up and the dig fails; its holder steals one of your coffins, which becomes Gold. <b>Ghost wagers</b> (on by default): players with no coffins left wager Gold or Curse on every dig; three right and they rise as a Revenant with one Gold coffin. <b>Relics</b> (off by default): a secret Lantern (peek at a grave), Key (open another grave before your own) or Ward (a curse costs nothing), each used once.</p>
<p>Scores carry over between games: the winner +3, every clean dig +1, every rise +1.</p>`,
  missionsH: 'Dead Set: Missions',
  missions: `<p>A second mode for 5–12 players, chosen in the lobby. Nobody dies: Death has slipped into the expedition, and the table must find it.</p>
<ol>
<li><b>The mission card.</b> Each mission starts by drawing a card, before any team is chosen. Most are <i>Regular Missions</i>; now and then a card changes the team, the vote or the reveal. It holds for the whole mission.</li>
<li><b>The proposal.</b> The Mission Leader (the lantern) picks a team of the size shown.</li>
<li><b>The team vote.</b> Everyone votes Approve or Reject in secret; the votes are revealed all at once, with names. A majority sends the team. Otherwise the next player to the left proposes. The fifth proposal goes ahead whatever the vote.</li>
<li><b>The mission.</b> Each team member secretly plays a card. The Living can only play Succeed; Death may play Succeed or Sabotage. One Sabotage fails the mission (two on mission 4 at 7+ players). The cards are shuffled and turned one by one.</li>
<li><b>The night interlude.</b> Everyone picks a secret Hunch. After missions 2, 3 and 4 the Candle holder learns one player's side, and the Candle passes to them. Clues may arrive at dawn.</li>
</ol>
<p><b>The end.</b> Three successes: Death unmasks and the Reaper names the Medium. Right, and Death wins; wrong, and the Living win. Three failures: the Last Stand. Everyone names one player. Name one of the Living, and Death wins; catch Death, and the Reaper still gets the Reckoning.</p>`,
  missionCardsH: 'Mission cards',
};

export function renderGuide(c, { glyph, dreamGlyph, esc, t, roleF, dreamF, ruleF, presetF, tx, mcardF }) {
  const G = { ...GUIDE_EN, ...(tx('guide', null) ?? {}) };
  const roles = c?.roles ?? [];
  const bySet = (set) => roles.filter((r) => r.set === set);
  const align = (a) => t({ DEATH: 'Death', INDEPENDENT: 'Independent', CULT: 'Cult', RIPPER: 'The Ripper' }[a] ?? 'Non-Death');
  const entry = (r) => { const alias = roleF(r.id, 'alias'); return `<div class="entry">${glyph(r.glyph)}<div><div class="when">${esc(align(r.alignment))} · ${esc(roleF(r.id, 'when'))}</div><h4>${esc(roleF(r.id, 'name'))}${alias ? ` <span class="small muted">(${esc(alias)})</span>` : ''}</h4><p>${esc(roleF(r.id, 'summary'))} ${esc(roleF(r.id, 'detail'))}</p></div></div>`; };
  const scaling = c?.scaling ?? {};
  const row = (cells, tag = 'td') => `<tr>${cells.map((x) => `<${tag}>${x}</${tag}>`).join('')}</tr>`;
  return `<div class="guide">
  <header class="phase-head"><span class="kicker">${G.kicker}</span><h1>${G.title}</h1>
    <p class="scenario">${G.intro}</p></header>
  <nav class="toc pill-row">${G.toc.map((x, i) => `<a class="tag" href="#g${i}">${x}</a>`).join('')}<a class="tag" href="#g11">${G.sidesH}</a><a class="tag" href="#g12">${G.missionsH}</a><a class="tag" href="#g13">${G.exorcismH}</a><a class="tag" href="#g14">${G.coffinsH}</a></nav>
  <section id="g0"><h2>${G.basicsH}</h2>${G.basics}</section>
  <section id="g1"><h2>${G.roundH}</h2>${G.round}</section>
  <section id="g2"><h2>${G.winH}</h2>${G.win}</section>
  <section id="g3"><h2>${G.coreH}</h2><p>${G.coreP}</p>${bySet('core').map(entry).join('')}
    <h3>${G.killH}</h3><p>${G.kill}</p></section>
  <section id="g4"><h2>${G.extH}</h2><p>${G.extP}</p>${bySet('standard').map(entry).join('')}</section>
  <section id="g5"><h2>${G.fullH}</h2><p>${G.fullP}</p>${bySet('full').map(entry).join('')}</section>
  <section id="g6"><h2>${G.dreamsH}</h2><p>${G.dreamsP}</p>
    ${(c?.dreams ?? []).map((d) => `<div class="entry">${dreamGlyph(d.id)}<div><h4>${esc(dreamF(d.id, 'name'))}</h4><p>${esc(dreamF(d.id, 'text'))}</p></div></div>`).join('')}
    <p class="small">${G.dreamsNote}</p></section>
  <section id="g7"><h2>${G.rulesH}</h2><p>${G.rulesP}</p>
    ${(c?.rules ?? []).map((r) => `<div class="entry">${glyph('scroll')}<div><h4>${esc(ruleF(r.id, 'name'))}</h4><p>${esc(ruleF(r.id, 'text'))} <span class="muted">${esc(ruleF(r.id, 'enforcement'))}</span></p></div></div>`).join('')}</section>
  <section id="g8"><h2>${G.modesH}</h2>
    <table><thead>${row(G.modesTh, 'th')}</thead><tbody>
    ${(c?.presets ?? []).map((p) => row([`<b>${esc(presetF(p.id, 'name'))}</b>`, `${p.min}–${p.max}`, esc(presetF(p.id, 'blurb'))])).join('')}
    </tbody></table>
    <h3>${G.countsH}</h3>
    <table><thead>${row(G.countsTh, 'th')}</thead><tbody>
    ${Object.entries(scaling).map(([n, s]) => row([n, s.DEATH, s.INNOCENT, '1 · 1 · 1', s.EXTENDED])).join('')}
    </tbody></table>
    <p class="small">${G.modesNote}</p></section>
  <section id="g9"><h2>${G.orderH}</h2>${G.order}</section>
  <section id="g10"><h2>${G.phonesH}</h2>${G.phones}</section>
  <section id="g11"><h2>${G.sidesH}</h2>${G.sides}${roles.filter((r) => r.set === 'side').map(entry).join('')}</section>
  <section id="g12"><h2>${G.missionsH}</h2>${G.missions}${roles.filter((r) => r.set === 'missions').map(entry).join('')}
    <h3>${G.missionCardsH}</h3>${(c?.missionCards ?? []).map((x) => `<div class="entry">${glyph('mission')}<div><h4>${esc(mcardF(x.id, 'name'))}</h4><p>${esc(mcardF(x.id, 'text'))}</p></div></div>`).join('')}</section>
  <section id="g13"><h2>${G.exorcismH}</h2>${G.exorcism}${roles.filter((r) => r.set === 'exorcism').map(entry).join('')}</section>
  <section id="g14"><h2>${G.coffinsH}</h2>${G.coffins}${roles.filter((r) => r.set === 'coffins').map(entry).join('')}</section>
  </div>`;
}
