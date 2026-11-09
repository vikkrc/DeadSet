// Dead Set — canonical content inventory (rules version 1.0).
// Everything here is data: roles, dreams, rule cards, scenario decks, presets.
// The rules engine reads these definitions; the client only ever receives the
// public descriptive fields (never another player's assignment).

export const RULES_VERSION = '1.0';

/**
 * Night action kinds:
 *  - death      : collective faction kill (handled by the Death team UI)
 *  - target     : choose a living player (self allowed if `self`)
 *  - dead       : choose an eliminated player
 *  - choice     : choose one option, no target
 *  - chat       : open a private two-person channel (Conspirator)
 * Day action kinds:
 *  - immunity   : Diplomat self-immunity from sentencing for one Day
 *  - shoot      : Vigilante pre-vote elimination
 */
export const ROLES = {
  // ── Core five ────────────────────────────────────────────────────────────
  DEATH: {
    id: 'DEATH', name: 'Death', set: 'core', alignment: 'DEATH', glyph: 'death',
    when: 'Every night',
    summary: 'Agree with every living Death teammate on one shared kill each night.',
    detail: 'All active Death players must confirm exactly the same target set or the faction passes. Base capacity is one kill; Double Jeopardy, Night Shift or Power Surge can raise it to a hard cap of two — never one kill per Death player.',
    night: { kind: 'death' },
  },
  INNOCENT: {
    id: 'INNOCENT', name: 'Innocent', set: 'core', alignment: 'NON_DEATH', glyph: 'innocent',
    when: 'Day',
    summary: 'No power. Your voice and your vote are the weapon.',
    detail: 'Argue, accuse and vote. You still receive a Dream each night and can be affected by statuses.',
  },
  MENTALIST: {
    id: 'MENTALIST', name: 'Mentalist', set: 'core', alignment: 'NON_DEATH', glyph: 'mentalist',
    when: 'Every night',
    summary: 'Read one other player: Death-aligned or not.',
    detail: 'You learn only the target\'s current alignment (DEATH-ALIGNED / NOT DEATH-ALIGNED), never their exact role. A blocked reading returns nothing.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Read' },
  },
  GUARDIAN: {
    id: 'GUARDIAN', name: 'Guardian', set: 'core', alignment: 'NON_DEATH', glyph: 'guardian',
    when: 'Every night',
    summary: 'Shield one player (yourself allowed) from Death and from Psycho.',
    detail: 'Stops the Death faction kill and Psycho\'s status only. Does not stop bombs, Vigilante, Scapegoat, linked fates or expiry. You may repeat a target.',
    night: { kind: 'target', self: true, repeatable: true, verb: 'Shield' },
  },
  PSYCHO: {
    id: 'PSYCHO', name: 'Psycho', set: 'core', alignment: 'NON_DEATH', glyph: 'psycho',
    when: 'Once per game, at night',
    summary: 'Once: Mute a player or strip their vote for the next Day.',
    detail: 'MUTE: may not speak in discussion but can still nominate and vote. NO VOTE: may speak but cannot cast a ballot. Guardian, Guardian Angel and Witch Bless block it. The charge is spent even if blocked.',
    night: { kind: 'target', self: false, charges: 1, verb: 'Mark',
      options: [{ id: 'MUTE', label: 'Mute' }, { id: 'NO_VOTE', label: 'No Vote' }] },
  },

  // ── Standard extended (10) ───────────────────────────────────────────────
  WHORE: {
    id: 'WHORE', name: 'Whore', alias: 'Companion', set: 'standard', alignment: 'NON_DEATH', glyph: 'whore',
    when: 'Every night',
    summary: 'Visit someone. Visit a Death and their whole team\'s kill fails.',
    detail: 'If the person you visit is an active Death, the faction kill capacity becomes 0. If the person you visit is killed by Death, you die with them; if they are bombed, you are caught in the blast.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Visit' },
  },
  TRAVELING_AGENT: {
    id: 'TRAVELING_AGENT', name: 'Traveling Agent', set: 'standard', alignment: 'NON_DEATH', glyph: 'agent',
    when: 'Every night',
    summary: 'Deliver a mysterious product. Pure flavour — and a calling card.',
    detail: 'The recipient is told at dawn that a Traveling Agent visited them. The product has no mechanical effect, but the visit itself is information both of you can use.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Deliver to' },
  },
  TERRORIST: {
    id: 'TERRORIST', name: 'Terrorist', set: 'standard', alignment: 'NON_DEATH', glyph: 'terrorist',
    when: 'Every night',
    summary: 'Plant a bomb at a door. Fifty-fifty it goes off.',
    detail: 'The server flips a fair coin. On YES the target dies, and any Whore visiting them dies in the blast. Guardian cannot stop a bomb; Guardian Angel, Witch Bless and temporary revival can.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Bomb' },
  },
  MIMIC: {
    id: 'MIMIC', name: 'Mimic', set: 'standard', alignment: 'NON_DEATH', glyph: 'mimic',
    when: 'Night 1 only (mandatory)',
    summary: 'On Night 1, become a permanent copy of someone else\'s role.',
    detail: 'You take the target\'s role and alignment with fresh charges. Copied powers start on Night 2; a copied Death joins the team from Night 2. Copying a Mimic — or failing to choose — leaves you a powerless Mimic for the rest of the match.',
    night: { kind: 'target', self: false, onlyNight: 1, verb: 'Copy' },
  },
  DOUBLE_AGENT: {
    id: 'DOUBLE_AGENT', name: 'Double Agent', set: 'standard', alignment: 'NON_DEATH', glyph: 'double',
    when: 'Night 1 only (mandatory)',
    summary: 'On Night 1, secretly pick your side for the rest of the game.',
    detail: 'Choose DEATH or NON-DEATH. Choosing Death converts you at the end of Night 1; you join the Death team room on Night 2 and share its single kill. Missing the choice defaults to non-Death.',
    night: { kind: 'choice', onlyNight: 1, verb: 'Pledge',
      options: [{ id: 'DEATH', label: 'Side with Death' }, { id: 'NON_DEATH', label: 'Stay non-Death' }] },
  },
  DIPLOMAT: {
    id: 'DIPLOMAT', name: 'Diplomat', set: 'standard', alignment: 'NON_DEATH', glyph: 'diplomat',
    when: 'Once per game, Day (before nominations)',
    summary: 'Once: declare immunity from sentencing for one Day.',
    detail: 'Declared publicly during the morning window. You cannot be nominated that Day. It does not stop night kills, bombs, Vigilante or Scapegoat.',
    day: { kind: 'immunity', charges: 1 },
  },
  SCAPEGOAT: {
    id: 'SCAPEGOAT', name: 'Scapegoat', set: 'standard', alignment: 'NON_DEATH', glyph: 'scapegoat',
    when: 'Passive, Day',
    summary: 'If a Day ends with nobody sentenced, you die instead.',
    detail: 'Tie, no nominations, no votes, failed Majority Rule or a Gambler cancellation all count as "no sentence". This is a kill, not a sentencing. Only one Scapegoat (lowest seat) dies per Day.',
  },
  NECROMANCER: {
    id: 'NECROMANCER', name: 'Necromancer', set: 'standard', alignment: 'NON_DEATH', glyph: 'necro',
    when: 'Once per game, at night',
    summary: 'Once: raise an eliminated player for one Day and one Night.',
    detail: 'The returnee keeps their role and alignment, is immune to every kill while revived, and expires after the following Night. You must survive the night for the ritual to work. Each player can be revived only once.',
    night: { kind: 'dead', charges: 1, verb: 'Raise' },
  },
  CONSPIRATOR: {
    id: 'CONSPIRATOR', name: 'Conspirator', set: 'standard', alignment: 'NON_DEATH', glyph: 'conspirator',
    when: 'Passive Day vote, night chat',
    summary: 'Your vote counts +1. At night, open a private whisper with one player.',
    detail: 'Your ballot carries one extra weight on the same candidate. Each night you may open a short two-person text channel with a living player; it reveals no roles by itself.',
    night: { kind: 'chat', self: false, verb: 'Whisper to' },
    voteBonus: 1,
  },
  MAGISTRATE: {
    id: 'MAGISTRATE', name: 'Magistrate', set: 'standard', alignment: 'NON_DEATH', glyph: 'magistrate',
    when: 'Passive, Day',
    summary: 'Your ballot weighs 2 (3 under Paranoia).',
    detail: 'One ballot, one candidate, double weight. A Psycho No Vote reduces it to zero.',
    voteBase: 2,
  },

  // ── Full Deck additions (7) ──────────────────────────────────────────────
  ORACLE: {
    id: 'ORACLE', name: 'Oracle', set: 'full', alignment: 'NON_DEATH', glyph: 'oracle',
    when: 'Once per game, at night',
    summary: 'Once: guess who Death will strike tonight. Guess right, they live.',
    detail: 'If your prediction is in the Death faction\'s committed target set, that player is protected from one Death kill. A wrong guess or a Death pass yields nothing.',
    night: { kind: 'target', self: false, charges: 1, verb: 'Foresee' },
  },
  GAMBLER: {
    id: 'GAMBLER', name: 'Gambler', set: 'full', alignment: 'NON_DEATH', glyph: 'gambler',
    when: 'Once per game, at night',
    summary: 'Once: bet on tomorrow\'s first nominee. Win, and nobody hangs.',
    detail: 'If the first formal nomination of the next Day matches your bet, that Day\'s sentencing is cancelled before the tally. A Scapegoat can still die from the resulting no-sentence.',
    night: { kind: 'target', self: true, charges: 1, verb: 'Bet on' },
  },
  VIGILANTE: {
    id: 'VIGILANTE', name: 'Vigilante', set: 'full', alignment: 'NON_DEATH', glyph: 'vigilante',
    when: 'Once per game, Day (before nominations)',
    summary: 'Once: shoot a player in the morning, no vote required.',
    detail: 'A role kill, not a sentencing. Diplomat immunity does not stop it. Victory is checked immediately afterwards.',
    day: { kind: 'shoot', charges: 1 },
  },
  JESTER: {
    id: 'JESTER', name: 'Jester', set: 'full', alignment: 'INDEPENDENT', glyph: 'jester',
    when: 'Independent',
    summary: 'You win alone — only if the town votes to sentence you.',
    detail: 'Dying any other way (night kill, bomb, Vigilante, Scapegoat) does not count. Surviving to the end does not win either. You count as an "other" player against Death\'s majority.',
  },
  BODYGUARD: {
    id: 'BODYGUARD', name: 'Bodyguard', set: 'full', alignment: 'NON_DEATH', glyph: 'bodyguard',
    when: 'Every night',
    summary: 'Stand by someone. If Death comes for them, you take the blade.',
    detail: 'If your charge would die to the Death kill and nothing else saved them, you die in their place. Cannot guard yourself, cannot stop bombs or linked deaths, intercepts at most one kill per night.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Guard' },
  },
  BARD: {
    id: 'BARD', name: 'Bard', set: 'full', alignment: 'NON_DEATH', glyph: 'bard',
    when: 'Once per game, at night',
    summary: 'Once: Silence the Night. Every role power fails, Death included.',
    detail: 'All active role abilities that night are suppressed. Dreams, expiries and match Rules still apply. Sleep Paralysis on the Bard prevents the silence.',
    night: { kind: 'choice', charges: 1, verb: 'Perform',
      options: [{ id: 'SILENCE', label: 'Silence the Night' }] },
  },
  WITCH: {
    id: 'WITCH', name: 'Witch', set: 'full', alignment: 'NON_DEATH', glyph: 'witch',
    when: 'Every night',
    summary: 'Bless a player against harm, or Curse their next action to fizzle.',
    detail: 'Bless: protects from harmful role actions and bombs tonight (not linked fates). Curse: the target\'s next targeted role action fizzles; cursing an active Death blocks the faction kill. Never yourself.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Cast on',
      options: [{ id: 'BLESS', label: 'Bless' }, { id: 'CURSE', label: 'Curse' }] },
  },
};

// ── Optional sides (switched on in the lobby; never part of an extended pool) ──
Object.assign(ROLES, {
  CULT_LEADER: {
    id: 'CULT_LEADER', name: 'Cult Leader', set: 'side', alignment: 'CULT', glyph: 'cult',
    when: 'Every night',
    summary: 'Each night, recruit one player into the Cult. The Cult wins when it outnumbers everyone else.',
    detail: 'A recruit keeps their role and powers but now wins with the Cult, and learns who the other members are. Death-aligned players, the Ripper and protected players cannot be recruited. If the Leader dies, nobody else can recruit.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Recruit' },
  },
  RIPPER: {
    id: 'RIPPER', name: 'The Ripper', set: 'side', alignment: 'RIPPER', glyph: 'ripper',
    when: 'Every night',
    summary: 'Kill one player each night, alone. You win when you are the last one standing, or alone with one other who is no killer.',
    detail: 'Your kill is stopped by the same protections as Death\'s (Guardian, Guardian Angel, Witch Bless, temporary revival). Death cannot kill you at night, except under a Blood Moon. You read as NOT DEATH-ALIGNED.',
    night: { kind: 'target', self: false, repeatable: true, verb: 'Strike' },
  },
});

export const CORE_ROLES = ['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO'];
export const STANDARD_EXTENDED = ['WHORE', 'TRAVELING_AGENT', 'TERRORIST', 'MIMIC', 'DOUBLE_AGENT',
  'DIPLOMAT', 'SCAPEGOAT', 'NECROMANCER', 'CONSPIRATOR', 'MAGISTRATE'];
export const FULL_EXTENDED = [...STANDARD_EXTENDED, 'ORACLE', 'GAMBLER', 'VIGILANTE', 'JESTER', 'BODYGUARD', 'BARD', 'WITCH'];
/** Roles never duplicated when the pool runs dry at 14+ players. */
export const COPY_SENSITIVE = ['MIMIC', 'DOUBLE_AGENT', 'JESTER'];

export const DREAMS = {
  SLEEP_PARALYSIS: { id: 'SLEEP_PARALYSIS', name: 'Sleep Paralysis', glyph: 'paralysis',
    text: 'You cannot use your night role action. If you are an active Death, the whole faction kill is blocked.' },
  PREMONITION: { id: 'PREMONITION', name: 'Premonition', glyph: 'premonition',
    text: 'At dawn you learn the name of one living Death-aligned player.' },
  WHISPERS: { id: 'WHISPERS', name: 'Whispers of the Past', glyph: 'whispers',
    text: 'At dawn you learn the exact role of one random eliminated player.' },
  SLEEPWALKING: { id: 'SLEEPWALKING', name: 'Sleepwalking', glyph: 'sleepwalk',
    text: 'You are bound to the player seated just before you. If they die tonight, you die at night\'s end.' },
  DREAM_SNATCHER: { id: 'DREAM_SNATCHER', name: 'Dream Snatcher', glyph: 'snatcher',
    text: 'Before actions open, you may swap Dream cards with another living player.' },
  NIGHT_SHIFT: { id: 'NIGHT_SHIFT', name: 'Night Shift', glyph: 'nightshift',
    text: 'One extra use of a repeatable night power, on a second target. For Death: team capacity becomes 2.' },
  SHARED_NIGHTMARE: { id: 'SHARED_NIGHTMARE', name: 'Shared Nightmare', glyph: 'nightmare',
    text: 'Choose a dream partner. If they die tonight, you die with them.' },
  INSOMNIA: { id: 'INSOMNIA', name: 'Insomnia', glyph: 'insomnia',
    text: 'At dawn you receive a full chronological report of tonight\'s actions — if you survive.' },
  GUARDIAN_ANGEL: { id: 'GUARDIAN_ANGEL', name: 'Guardian Angel', glyph: 'angel',
    text: 'Tonight you are immune to Death, Psycho, bombs, Witch Curse and linked deaths.' },
};
export const DREAM_IDS = Object.keys(DREAMS);
/** Default draw weights (0 = never … 4 = frequent). Custom games may change them. */
export const DREAM_WEIGHTS = {
  SLEEP_PARALYSIS: 3, PREMONITION: 2, WHISPERS: 3, SLEEPWALKING: 3, DREAM_SNATCHER: 3,
  NIGHT_SHIFT: 3, SHARED_NIGHTMARE: 3, INSOMNIA: 1, GUARDIAN_ANGEL: 2,
};
export const DREAM_WEIGHT_MAX = 4;
/** Insomnia is drawn at most this many times in one match. */
export const INSOMNIA_CAP = 2;

export const RULE_CARDS = {
  FOG_OF_WAR: { id: 'FOG_OF_WAR', name: 'Fog of War', simple: false,
    text: 'During discussion you may talk directly only with the players in the seats right beside you.',
    enforcement: 'Honour system in person. Remote: table chat is replaced by neighbour whispers.' },
  DOUBLE_JEOPARDY: { id: 'DOUBLE_JEOPARDY', name: 'Double Jeopardy', simple: true,
    text: 'The Death faction may kill up to two players each night (hard cap 2).',
    enforcement: 'Blocks such as a Whore visit or paralysis still reduce it to 0.' },
  PARANOIA: { id: 'PARANOIA', name: 'Paranoia', simple: true,
    text: 'Every living ballot gets +1 weight. Magistrate weighs 3; Conspirator adds another +1.',
    enforcement: 'Ghost ballots stay at weight 1.' },
  UNRELIABLE_POWER: { id: 'UNRELIABLE_POWER', name: 'Unreliable Power', simple: false,
    text: 'Every night role action rolls a d6: 1–3 fails, 4–6 works. Death rolls once for the team.',
    enforcement: 'A failed once-per-game power is still spent.' },
  POWER_SURGE: { id: 'POWER_SURGE', name: 'Power Surge', simple: false,
    text: 'Each night one random eligible repeatable power gains an extra use. Death counts as one entry.',
    enforcement: 'Never more than two uses for anyone; Death capacity caps at 2.' },
  EQUAL_EXCHANGE: { id: 'EQUAL_EXCHANGE', name: 'Equal Exchange', simple: false,
    text: 'A Death-aligned player sentenced by vote may take one living non-Death player down with them.',
    enforcement: 'Night kills, Vigilante shots and linked deaths do not trigger it.' },
  CURSED_SILENCE: { id: 'CURSED_SILENCE', name: 'Cursed Silence', simple: false,
    text: 'During discussion you may speak only when directly addressed.',
    enforcement: 'Honour system. Nominations and votes are unaffected.' },
  MAJORITY_RULE: { id: 'MAJORITY_RULE', name: 'Majority Rule', simple: true,
    text: 'A sentence needs more than half of all eligible living voters\' weight on one nominee.',
    enforcement: 'Abstainers and non-voters still count in the denominator. Ghost ballots never count.' },
  HIDDEN_ROLES: { id: 'HIDDEN_ROLES', name: 'Hidden Roles', simple: true,
    text: 'Roles of eliminated players are never shown publicly until the game ends.',
    enforcement: 'Already the default; this card locks it on.' },
  VENGEFUL_GHOSTS: { id: 'VENGEFUL_GHOSTS', name: 'Vengeful Ghosts', simple: false,
    text: 'Each eliminated player may cast one weight-1 ghost ballot per Day.',
    enforcement: 'Ghosts cannot nominate, use powers or influence Majority Rule.' },
};
RULE_CARDS.OPEN_BALLOT = { id: 'OPEN_BALLOT', name: 'Open Ballot', simple: true,
  text: 'Every vote is public: everyone sees who is voting for whom as the ballots come in.',
  enforcement: 'Ballots can still be changed until the vote locks. Ghost ballots are public too.' };
export const RULE_IDS = Object.keys(RULE_CARDS);
export const SIMPLE_RULE_IDS = RULE_IDS.filter((r) => RULE_CARDS[r].simple);

/** Catalogued historical rule ideas: never selectable (spec §13). */
export const RETIRED_RULES = ['Silent Night', 'Mirrored Fates', 'Role Swap', 'Night Watch', 'Total Eclipse'];

export const SCENARIO = {
  // New cards are only ever appended: translations look cards up by position.
  WHO: ['Time Travelers', 'Space Explorers', 'Mythical Creatures', 'Ghosts of Historical Figures', 'Mutants',
    'Secret Society Members', 'Lost Tourists', 'Artificial Intelligences', 'Medieval Villagers', 'Celebrity Lookalikes',
    'Retired Circus Performers', 'Lighthouse Keepers', 'Rival Chefs', 'Exiled Royals', 'Night-Shift Nurses',
    'Deep-Sea Divers', 'Wedding Guests', 'Stranded Astronomers', 'Masked Ball Dancers', 'Silent Monks'],
  WHERE: ['a Sinking Ship', 'an Abandoned Amusement Park', 'an Underground Bunker', 'a Haunted Mansion', 'a Snow-Covered Tundra',
    'a Fog-Bound Lighthouse', 'a Derelict Space Station', 'a Night Train Through the Mountains', 'a Flooded Cathedral',
    'an Overgrown Botanical Garden', 'a Desert Oasis Hotel', 'a Remote Monastery', 'a Moonlit Vineyard',
    'an Abandoned Film Studio', 'a Clockwork Museum'],
  WHY: ['Find a Hidden Treasure', 'Escape Before Time Runs Out', 'Complete a Ritual', 'Solve a Murder', 'Stop an Impending Disaster',
    'Break an Ancient Curse', 'Win a Fortune at Cards', 'Protect a Royal Heir', 'Find the Way Home', 'Expose a Traitor',
    'Survive Until Sunrise', 'Recover a Stolen Relic', 'Wake the Sleeping Town', 'Decode a Final Message', 'Keep a Terrible Secret'],
};

export const PRODUCTS = ['a brass key that fits no lock', 'a jar of warm sand', 'a ticket for a train that left yesterday',
  'a single black feather', 'a pocket watch running backwards', 'a sealed letter addressed to you', 'a vial of grey perfume',
  'a deck of cards missing the Queen', 'a candle that smells of rain', 'a photograph of an empty room', 'a velvet-lined box (empty)',
  'a compass that points at you'];

export const PRESETS = {
  standard: { id: 'standard', name: 'Standard', min: 5, max: 13, pool: STANDARD_EXTENDED, dreams: true,
    rulesMin: 1, rulesMax: 3, ruleIds: RULE_IDS, doomsday: false, recommended: true,
    blurb: 'The intended Dead Set experience. Ten extended roles from 7 players, a Dream for everyone each night, 1–3 Rule cards.' },
  classic: { id: 'classic', name: 'Classic / Learn', min: 5, max: 13, pool: [], innocentFiller: true, dreams: false,
    rulesMin: 0, rulesMax: 1, ruleIds: SIMPLE_RULE_IDS, doomsday: false,
    blurb: 'For teaching. Core roles only — extended seats are filled with Innocents. Dreams off by default, at most one simple Rule.' },
  full: { id: 'full', name: 'Full Deck / Chaos', min: 7, max: 13, pool: FULL_EXTENDED, dreams: true,
    rulesMin: 1, rulesMax: 3, ruleIds: RULE_IDS, doomsday: false,
    blurb: 'All 17 extended roles including Jester, Bard and Witch. High randomness, experienced groups only.' },
  doomsday: { id: 'doomsday', name: 'Doomsday', min: 5, max: 13, pool: STANDARD_EXTENDED, dreams: true,
    rulesMin: 1, rulesMax: 3, ruleIds: RULE_IDS, doomsday: true,
    blurb: 'Standard, against the clock. If nobody has won when the final Day closes, Death wins.' },
  custom: { id: 'custom', name: 'Custom', min: 5, max: 25, pool: FULL_EXTENDED, dreams: true,
    rulesMin: 0, rulesMax: 3, ruleIds: RULE_IDS, doomsday: false, custom: true,
    blurb: 'Pick the extended pool, Dreams, Rules and clock yourself — or type the exact deck. Warns about unbalanced setups.' },
};

export const MIN_PLAYERS = 5;

/** Interface languages. The table sets a default; each player may override it. */
export const LANGS = ['en', 'hu', 'sk', 'cs', 'de', 'fr', 'es'];
export const ABS_MAX_PLAYERS = 25;
/** Below these counts, random draws skip cards that tend to unbalance small tables. */
export const SMALL_TABLE = { DOUBLE_JEOPARDY: 7, JESTER: 8, CULT_LEADER: 8, RIPPER: 8 };
/** Portrait parts: colours, eyes, mouths, hair (the client draws them). */
export const AVATAR_PARTS = { c: 10, e: 8, m: 8, h: 10 };
/** Chance per night that clues reach someone (index = odds setting). */
export const CLUE_ODDS = [0, 15, 30, 50];

// ── Dead Set: Missions (see MISSIONS.md) ───────────────────────────────────
// Roles used only in the Missions mode (set 'missions'); they never enter the
// base game's decks.
Object.assign(ROLES, {
  MEDIUM: { id: 'MEDIUM', name: 'Medium', set: 'missions', alignment: 'NON_DEATH', glyph: 'medium', when: 'Always',
    summary: 'You see every Death player, except the Veiled. Guide the expedition without giving yourself away.',
    detail: 'If the Living win three missions, or catch a Death player in the Last Stand, Death gets one guess at who you are. If they name you, Death wins.' },
  BELIEVER: { id: 'BELIEVER', name: 'Believer', set: 'missions', alignment: 'NON_DEATH', glyph: 'believer', when: 'Always',
    summary: 'You see two candles: the Medium and the Charlatan. You do not know which is which.',
    detail: 'Work out which candle is the true Medium and protect them, often by acting like the Medium yourself. Without a Charlatan in play, your only candle is the Medium.' },
  COMPANION: { id: 'COMPANION', name: 'Companion', set: 'missions', alignment: 'NON_DEATH', glyph: 'innocent', when: 'Always',
    summary: 'You know nothing but your own heart. Watch the votes and the missions.',
    detail: 'You can only play Succeed. Read who proposes whom, who approves which team, and which missions fail.' },
  REAPER: { id: 'REAPER', name: 'Reaper', set: 'missions', alignment: 'DEATH', glyph: 'death', when: 'Always',
    summary: 'You lead Death. In the Reckoning, you make the final call on who the Medium is.',
    detail: 'You see the rest of Death (except the Stray). On a mission you may play Succeed or Sabotage. Your teammates can suggest names in the Reckoning; your choice counts.' },
  CHARLATAN: { id: 'CHARLATAN', name: 'Charlatan', set: 'missions', alignment: 'DEATH', glyph: 'charlatan', when: 'Always',
    summary: 'To the Believer you look exactly like the Medium. Use it.',
    detail: 'You see the rest of Death (except the Stray). On a mission you may play Succeed or Sabotage.' },
  VEILED: { id: 'VEILED', name: 'Veiled', set: 'missions', alignment: 'DEATH', glyph: 'veiled', when: 'Always',
    summary: 'The Medium cannot see you.',
    detail: 'You see the rest of Death (except the Stray). On a mission you may play Succeed or Sabotage.' },
  STRAY: { id: 'STRAY', name: 'Stray', set: 'missions', alignment: 'DEATH', glyph: 'stray', when: 'Always',
    summary: 'You serve Death alone: you do not know the others, and they do not know you.',
    detail: 'The Medium still sees you. On a mission you may play Succeed or Sabotage. In the Reckoning, Death unmasks and you join the others.' },
  SHADE: { id: 'SHADE', name: 'Shade', set: 'missions', alignment: 'DEATH', glyph: 'death', when: 'Always',
    summary: 'You walk with Death and know your teammates.',
    detail: 'You see the rest of Death (except the Stray). On a mission you may play Succeed or Sabotage.' },
});

/** Optional Missions roles (lobby switches) and their side. */
export const MISSION_OPTIONAL = { BELIEVER: 'NON_DEATH', CHARLATAN: 'DEATH', VEILED: 'DEATH', STRAY: 'DEATH' };
export const MISSION_MIN = 5;
export const MISSION_MAX = 10;
/** Death seats per table size. */
export const MISSION_DEATH = { 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 4 };
/** Team sizes for missions 1–5 per table size. */
export const MISSION_SIZES = {
  5: [2, 3, 2, 3, 3], 6: [2, 3, 4, 3, 4], 7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5], 9: [3, 4, 4, 5, 5], 10: [3, 4, 4, 5, 5],
};
/** Sabotage cards needed to fail mission k (index 0–4): two on mission 4 from 7 players. */
export const missionFailsNeeded = (n, k) => (n >= 7 && k === 3 ? 2 : 1);
/** Chance a mission draws a special card (index = setting: off, rare, sometimes). */
export const MISSION_CARD_ODDS = [0, 25, 40];
/** Proposals per mission; the last one goes ahead whatever the vote. */
export const MISSION_PROPOSALS = 5;

export const MISSION_CARDS = {
  REGULAR: { id: 'REGULAR', name: 'Regular Mission', glyph: 'mission', text: 'No special effect.' },
  LANTERN: { id: 'LANTERN', name: 'Lantern Bearer', glyph: 'lantern', text: 'The Leader must be on the team.' },
  FRESH_FACES: { id: 'FRESH_FACES', name: 'Fresh Faces', glyph: 'fresh', text: 'At least half the team (rounded up) must not have been on the previous mission.' },
  EXTRA_HAND: { id: 'EXTRA_HAND', name: 'Extra Hand', glyph: 'plus', text: 'The team is one player larger.' },
  SKELETON_CREW: { id: 'SKELETON_CREW', name: 'Skeleton Crew', glyph: 'minus', text: 'The team is one player smaller.' },
  MASKED_VOTE: { id: 'MASKED_VOTE', name: 'Masked Vote', glyph: 'mask', text: 'Team votes show only the totals, not who voted how.' },
  SHORT_PATIENCE: { id: 'SHORT_PATIENCE', name: 'Short Patience', glyph: 'hourglass', text: 'The third proposal goes ahead whatever the vote.' },
  WARD: { id: 'WARD', name: 'Ward', glyph: 'guardian', text: 'With the team, the Leader names one member whose card is forced to Succeed.' },
  STEADFAST: { id: 'STEADFAST', name: 'Steadfast', glyph: 'shield', text: 'One more Sabotage than usual is needed to fail.' },
  BRITTLE: { id: 'BRITTLE', name: 'Brittle', glyph: 'crack', text: 'A single Sabotage fails it, even though this mission normally needs two.' },
  SMOKE: { id: 'SMOKE', name: 'Smoke', glyph: 'smoke', text: 'Only the result is shown, not how many Sabotage cards were played.' },
  GRAND: { id: 'GRAND', name: 'Grand Mission', glyph: 'crown', text: 'The result counts twice on the track.' },
  TRAIL: { id: 'TRAIL', name: 'Trail', glyph: 'clue', text: 'If it succeeds, one random Living team member finds a clue at night.' },
  WITNESS: { id: 'WITNESS', name: 'Witness', glyph: 'mentalist', text: 'At night, the Leader of the team privately sees one other member\'s card.' },
  HAUNTED_ROAD: { id: 'HAUNTED_ROAD', name: 'Haunted Road', glyph: 'veiled', text: 'If it fails, the Reaper picks one of its members to sit out the next mission.' },
};
export const SPECIAL_MISSION_CARDS = Object.keys(MISSION_CARDS).filter((k) => k !== 'REGULAR');

PRESETS.missions = { id: 'missions', name: 'Dead Set: Missions', min: MISSION_MIN, max: MISSION_MAX, pool: [], dreams: false,
  rulesMin: 0, rulesMax: 0, ruleIds: [], doomsday: false, missions: true,
  blurb: 'Teams, votes and sabotage. Nobody dies: lead missions, read the votes, and find Death before it finds the Medium.' };
