// In-app "How to play". Catalog entries come from /api/content so the guide
// can never drift from the rules engine's own definitions.
const GLYPH_OF_DREAM = (id) => id;

export function renderGuide(c, { glyph, dreamGlyph, esc }) {
  const roles = c?.roles ?? [];
  const bySet = (set) => roles.filter((r) => r.set === set);
  const entry = (r) => `<div class="entry">${glyph(r.glyph)}<div><div class="when">${esc(r.alignment === 'DEATH' ? 'Death' : r.alignment === 'INDEPENDENT' ? 'Independent' : 'Non-Death')} · ${esc(r.when)}</div><h4>${esc(r.name)}${r.alias ? ` <span class="small muted">(${esc(r.alias)})</span>` : ''}</h4><p>${esc(r.summary)} ${esc(r.detail)}</p></div></div>`;
  const scaling = c?.scaling ?? {};
  return `<div class="guide">
  <header class="phase-head"><span class="kicker">The rules, v1.0</span><h1>How to<br><i>play.</i></h1>
    <p class="scenario">Most of you want to survive. A few of you are Death. Nobody knows who is who — except Death, who knows each other.</p></header>
  <nav class="toc pill-row">${['Basics', 'A round', 'Winning', 'Core roles', 'Extended roles', 'Full Deck', 'Dreams', 'Rule cards', 'Modes', 'Night order', 'Phones'].map((t, i) => `<a class="tag" href="#g${i}">${t}</a>`).join('')}</nav>

  <section id="g0"><h2>The basics</h2>
    <p>Dead Set is a social-deduction party game for 5–13 players. Everyone joins the same room on their own phone and is dealt a secret <b>Role</b>. Most roles belong to the <b>non-Death</b> faction; one or more players are secretly <b>Death</b>.</p>
    <ul>
      <li><b>Roles</b> are who you are for the whole match: your alignment and your power.</li>
      <li><b>Dreams</b> are one-night effects: from Night 1, every living player secretly draws one each night.</li>
      <li><b>Rule cards</b> (1–3, drawn at setup) bend the whole match — double kills, weighted votes, ghosts that vote.</li>
      <li><b>The scenario</b> (WHO / WHERE / WHY) is pure storytelling. It never changes a rule.</li>
    </ul>
    <p>You may tell the truth about your role, lie about it, or keep quiet. Never show your screen. The app is the narrator: nobody has to sit out, and the host sees no more secrets than anyone else.</p>
  </section>

  <section id="g1"><h2>A round</h2>
    <ol>
      <li><b>Night 0 — the reveal.</b> Turn over your role card, read it, tap <em>Understood</em>. Nothing else happens: no kills, no dreams, no powers. Death players see their teammates.</li>
      <li><b>Morning.</b> The dawn news is read: who died in the night (never how, never their role). Anything private you learned appears under <em>Only you know</em>. A Diplomat may declare immunity here; a Vigilante may take their shot.</li>
      <li><b>Discussion & nominations.</b> Talk. Each living player may make <b>one formal nomination</b> per Day. Nominating someone already nominated just seconds it.</li>
      <li><b>Defence.</b> Each nominee, in nomination order, gets the floor.</li>
      <li><b>Secret ballot.</b> Every eligible living player votes for one nominee or abstains, on their own phone. You can change your vote until the host locks it. Only totals are published.</li>
      <li><b>Sentence.</b> The single highest total is sentenced (eliminated). <b>A tie at the top sentences nobody.</b> At most one person is sentenced per Day.</li>
      <li><b>Night.</b> Screens go dark. Dreams are drawn (Dream Snatchers may swap). Everyone with a night power submits it secretly; Death agrees on its kill. When everyone is asleep — or the timer runs out — the server resolves every action at once and the next Day dawns.</li>
    </ol>
    <p class="small">Anything you fail to submit before a window closes becomes a pass (or an abstention). A disconnected phone keeps its seat and its secrets.</p>
  </section>

  <section id="g2"><h2>Winning</h2>
    <ul>
      <li><b>Non-Death wins</b> the moment no Death-aligned player is alive.</li>
      <li><b>Death wins</b> the moment living Death-aligned players <b>strictly outnumber</b> everyone else alive. Equal numbers is not enough.</li>
      <li><b>Jester</b> (Full Deck only) wins alone, instantly, if the town sentences them by vote.</li>
      <li>If a night ever leaves nobody alive, the match is a <b>draw</b>.</li>
      <li>With the <b>Doomsday Clock</b>, Death also wins if nobody has won when the final Day closes.</li>
    </ul>
    <p>Victory is checked after every complete resolution — never halfway through a night.</p>
  </section>

  <section id="g3"><h2>Core roles</h2><p>Always in the game.</p>${bySet('core').map(entry).join('')}
    <h3>How the Death team kills</h3>
    <p>All living Death teammates share one room. Each proposes targets; the kill happens only if <b>every one of them confirms exactly the same set</b>. Any disagreement, or anyone failing to confirm, and Death passes. The team kills <b>one</b> player per night no matter how many Deaths there are — two with Double Jeopardy, Night Shift or Power Surge, and never more than two.</p>
  </section>

  <section id="g4"><h2>Extended roles — Standard</h2><p>From 7 players, extra seats are filled from this pool (drawn secretly). 7 players → 1 extended seat, 10 → 2, 11+ → 3.</p>${bySet('standard').map(entry).join('')}</section>
  <section id="g5"><h2>Full Deck additions</h2><p>Only in Full Deck / Chaos or Custom. Experienced groups.</p>${bySet('full').map(entry).join('')}</section>

  <section id="g6"><h2>Dreams</h2><p>From Night 1, each living player draws one Dream card at random every night (duplicates allowed). It lasts that night only. You may describe yours — truthfully or not.</p>
    ${(c?.dreams ?? []).map((d) => `<div class="entry">${dreamGlyph(GLYPH_OF_DREAM(d.id))}<div><h4>${esc(d.name)}</h4><p>${esc(d.text)}</p></div></div>`).join('')}
    <p class="small">Dream Snatcher swaps happen before actions open, in seat order, once each. Whatever card you end up holding is the one that counts.</p>
  </section>

  <section id="g7"><h2>Rule cards</h2><p>1–3 are drawn (or chosen) at setup and stay in force all match. Some can only be honour-enforced when you play in the same room.</p>
    ${(c?.rules ?? []).map((r) => `<div class="entry">${glyph('scroll')}<div><h4>${esc(r.name)}</h4><p>${esc(r.text)} <span class="muted">${esc(r.enforcement)}</span></p></div></div>`).join('')}
  </section>

  <section id="g8"><h2>Modes</h2>
    <table><thead><tr><th>Mode</th><th>Players</th><th>What changes</th></tr></thead><tbody>
    ${(c?.presets ?? []).map((p) => `<tr><td><b>${esc(p.name)}</b></td><td>${p.min}–${p.max}</td><td>${esc(p.blurb)}</td></tr>`).join('')}
    </tbody></table>
    <h3>Role counts</h3>
    <table><thead><tr><th>Players</th><th>Death</th><th>Innocent</th><th>Guardian · Mentalist · Psycho</th><th>Extended</th></tr></thead><tbody>
    ${Object.entries(scaling).map(([n, s]) => `<tr><td>${n}</td><td>${s.DEATH}</td><td>${s.INNOCENT}</td><td>1 · 1 · 1</td><td>${s.EXTENDED}</td></tr>`).join('')}
    </tbody></table>
    <p class="small">Classic / Learn fills extended seats with Innocents. Same room or remote is a delivery choice, not a different game: remote adds in-app table chat (and neighbour whispers under Fog of War).</p>
  </section>

  <section id="g9"><h2>Who beats what at night</h2>
    <p>Everyone submits at once; then the server resolves in a fixed order so the outcome never depends on who tapped first.</p>
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
    </ol>
  </section>

  <section id="g10"><h2>Playing on phones</h2>
    <ul>
      <li>The host creates a room and shares the six-character code or QR. Everyone else opens the link, enters a name, taps <em>Ready</em>.</li>
      <li>Your seat is tied to your browser. If a phone dies, the host can issue a one-time <b>recovery code</b> from their controls; entering it on a new device moves your seat there and signs the old one out.</li>
      <li>The host's phone is an ordinary player phone with a few extra buttons: advance the phase, add 30 seconds, end the match. The host cannot see roles, dreams, or votes.</li>
      <li>A <b>public board</b> (no secrets) can be shown on a TV: open <span class="mono">/board/CODE</span>.</li>
      <li>For a game where someone wants to run the table and see everything, create the room as a <b>trusted moderator</b>. They cannot hold a seat, and everyone is told.</li>
      <li>MUTE, Fog of War and Cursed Silence are honour rules in person. Remote play enforces them in the chat.</li>
    </ul>
  </section>
  </div>`;
}
