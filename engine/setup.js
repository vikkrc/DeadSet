// Lobby settings, role scaling (§5.3), deck building and validation.
import { X_DEFAULTS, applyExorcismPatch, validateExorcism } from './exorcism.js';
import {
  ROLES, PRESETS, RULE_CARDS, RULE_IDS, COPY_SENSITIVE, SCENARIO, MIN_PLAYERS, ABS_MAX_PLAYERS, LANGS,
  DREAM_WEIGHTS, DREAM_WEIGHT_MAX, SMALL_TABLE, STANDARD_EXTENDED, FULL_EXTENDED,
  MISSION_OPTIONAL, MISSION_DEATH, MISSION_MIN, MISSION_MAX, MISSION_JESTER_MIN, modeOf, roleInMode,
} from './content.js';
import { shuffle, pick, seededRng } from './rng.js';

const TABLE = {
  5: [1, 1, 0], 6: [2, 1, 0], 7: [2, 1, 1], 8: [3, 1, 1], 9: [3, 2, 1],
  10: [3, 2, 2], 11: [3, 2, 3], 12: [4, 2, 3], 13: [4, 3, 3],
};

/** Returns { DEATH, INNOCENT, GUARDIAN, MENTALIST, PSYCHO, EXTENDED } for N players. */
export function scaling(n) {
  if (n < MIN_PLAYERS) throw new Error(`Dead Set needs at least ${MIN_PLAYERS} players`);
  let [death, innocent, ext] = TABLE[Math.min(n, 13)];
  // Deterministic extension past 13: +Extended, +Death, +Innocent, repeat (§5.3).
  for (let k = 14; k <= n; k++) {
    const step = (k - 14) % 3;
    if (step === 0) ext++;
    else if (step === 1) death++;
    else innocent++;
  }
  return { DEATH: death, INNOCENT: innocent, GUARDIAN: 1, MENTALIST: 1, PSYCHO: 1, EXTENDED: ext };
}

export function defaultSettings() {
  return {
    preset: 'standard',
    extendedPool: [...PRESETS.custom.pool],
    customDeck: '',
    dreams: true,
    doomsday: false,
    doomsdayDays: 3,
    rules: { mode: 'random', count: 1, selected: [] },
    scenario: { mode: 'random', who: '', where: '', why: '' },
    timers: { morning: 0, discussion: 0, defense: 0, voting: 90, swap: 30, night: 120, retaliation: 45,
      proposal: 0, teamVote: 60, mission: 45, interlude: 45, lastStand: 240, reckoning: 180,
      xClue: 30, xDiscuss: 90, xVote: 45, xGuess: 45 },
    transport: 'in-person',
    revealOnDeath: false,
    endReveal: true,
    selfNomination: false,
    selfVote: true,
    threads: false,
    lang: 'en',
    score: true,
    dreamWeights: { ...DREAM_WEIGHTS },
    customRoles: {},
    deckMode: 'auto',
    suggestSeed: 0,
    bloodMoon: true,
    finalTwoDeath: false,
    clues: true,
    clueOdds: 1,
    lovers: false,
    cult: false,
    ripper: false,
    tieBreak: 'none',
    backdrops: true,
    // Missions mode
    mRoles: { BELIEVER: true, CHARLATAN: true, VEILED: false, STRAY: false, UNDERTAKER: false, M_JESTER: false },
    missionCards: 1,
    leaderMode: 'next',
    twins: false,
    sideMissions: false,
    // Exorcism mode
    x: { ...X_DEFAULTS, categories: [...X_DEFAULTS.categories] },
  };
}

const clampInt = (v, lo, hi, d) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d;
};

/** Merge an untrusted client patch into settings, coercing every field. */
export function applySettingsPatch(settings, patch = {}) {
  const s = structuredClone(settings);
  // Switching modes (Classic / Missions / Exorcism): each mode keeps its own
  // last preset and options, so going there and back loses nothing.
  if (patch.mode && ['classic', 'missions', 'exorcism'].includes(patch.mode) && patch.mode !== modeOf(s.preset)) {
    const from = modeOf(s.preset);
    s.memory = { ...(s.memory || {}) };
    s.memory[from] = { preset: s.preset, dreams: s.dreams, doomsday: s.doomsday, rules: structuredClone(s.rules) };
    const back = s.memory[patch.mode];
    if (patch.mode === 'classic') {
      s.preset = back?.preset && PRESETS[back.preset] && modeOf(back.preset) === 'classic' ? back.preset : 'standard';
      if (back) { s.dreams = back.dreams; s.doomsday = back.doomsday; s.rules = structuredClone(back.rules); } else { s.dreams = PRESETS[s.preset].dreams; s.doomsday = PRESETS[s.preset].doomsday; }
    } else s.preset = patch.mode;
  } else if (patch.preset && PRESETS[patch.preset] && modeOf(patch.preset) === modeOf(s.preset)) {
    // Within a mode (e.g. Classic's Standard → Full Deck), presets clamp the classic options.
    s.preset = patch.preset;
    const p = PRESETS[s.preset];
    if (modeOf(s.preset) === 'classic') {
      s.dreams = p.dreams;
      s.doomsday = p.doomsday;
      s.rules.count = Math.max(p.rulesMin, Math.min(p.rulesMax, s.rules.count));
      s.rules.selected = s.rules.selected.filter((r) => p.ruleIds.includes(r)).slice(0, p.rulesMax);
    }
  } else if (patch.preset && PRESETS[patch.preset]) {
    // A preset from another mode: switch modes properly.
    const switched = applySettingsPatch(settings, { mode: modeOf(patch.preset) });
    return applySettingsPatch(switched, { ...patch, mode: undefined });
  }
  const preset = PRESETS[s.preset];
  if (Array.isArray(patch.extendedPool)) {
    s.extendedPool = [...new Set(patch.extendedPool.filter((r) => ['standard', 'full'].includes(ROLES[r]?.set)))];
  }
  if (typeof patch.customDeck === 'string') s.customDeck = patch.customDeck.slice(0, 600);
  if (patch.customRoles && typeof patch.customRoles === 'object' && preset.custom) {
    const out = {};
    for (const [id, c] of Object.entries(patch.customRoles)) {
      const k = clampInt(c, 0, ABS_MAX_PLAYERS, 0);
      if (roleInMode(id, 'classic') && k > 0) out[id] = k;
    }
    s.customRoles = out;
  }
  if (['auto', 'exact'].includes(patch.deckMode) && preset.custom) {
    s.deckMode = patch.deckMode;
    if (s.deckMode === 'auto') s.customRoles = {};
    s.customDeck = '';
  }
  if (patch.dreamWeights && typeof patch.dreamWeights === 'object' && preset.custom) {
    s.dreamWeights = { ...DREAM_WEIGHTS, ...s.dreamWeights };
    for (const id of Object.keys(DREAM_WEIGHTS)) {
      if (patch.dreamWeights[id] !== undefined) s.dreamWeights[id] = clampInt(patch.dreamWeights[id], 0, DREAM_WEIGHT_MAX, DREAM_WEIGHTS[id]);
    }
  }
  if (patch.suggestSeed !== undefined) s.suggestSeed = clampInt(patch.suggestSeed, 0, 1e6, 0);
  if (typeof patch.dreams === 'boolean' && (preset.custom || preset.id === 'classic')) s.dreams = patch.dreams;
  if (typeof patch.doomsday === 'boolean' && preset.custom) s.doomsday = patch.doomsday;
  if (patch.doomsdayDays !== undefined) s.doomsdayDays = clampInt(patch.doomsdayDays, 1, 9, 3);
  if (patch.rules) {
    if (['random', 'manual'].includes(patch.rules.mode)) s.rules.mode = patch.rules.mode;
    if (patch.rules.count !== undefined) s.rules.count = clampInt(patch.rules.count, preset.rulesMin, preset.rulesMax, preset.rulesMin);
    if (Array.isArray(patch.rules.selected)) {
      s.rules.selected = [...new Set(patch.rules.selected.filter((r) => preset.ruleIds.includes(r)))].slice(0, preset.rulesMax);
    }
  }
  if (patch.scenario) {
    if (['random', 'manual'].includes(patch.scenario.mode)) s.scenario.mode = patch.scenario.mode;
    for (const k of ['who', 'where', 'why']) {
      if (typeof patch.scenario[k] === 'string') s.scenario[k] = patch.scenario[k].slice(0, 80);
    }
  }
  if (patch.timers) {
    s.timers = { ...defaultSettings().timers, ...s.timers };
    for (const k of Object.keys(s.timers)) {
      if (patch.timers[k] !== undefined) s.timers[k] = clampInt(patch.timers[k], 0, 1800, s.timers[k]);
    }
  }
  if (['in-person', 'remote'].includes(patch.transport)) s.transport = patch.transport;
  if (LANGS.includes(patch.lang)) s.lang = patch.lang;
  if (patch.preset && PRESETS[patch.preset] && !PRESETS[patch.preset].custom) {
    s.dreamWeights = { ...DREAM_WEIGHTS };
    s.customRoles = {};
  }
  if (patch.mRoles && typeof patch.mRoles === 'object') {
    s.mRoles = { ...defaultSettings().mRoles, ...s.mRoles };
    for (const k of Object.keys(MISSION_OPTIONAL)) if (typeof patch.mRoles[k] === 'boolean') s.mRoles[k] = patch.mRoles[k];
  }
  if (['next', 'choose'].includes(patch.leaderMode)) s.leaderMode = patch.leaderMode;
  if (patch.x) applyExorcismPatch(s, patch.x);
  if (typeof patch.twins === 'boolean') s.twins = patch.twins;
  if (typeof patch.sideMissions === 'boolean') s.sideMissions = patch.sideMissions;
  if (patch.missionCards !== undefined) s.missionCards = clampInt(patch.missionCards, 0, 2, 1);
  if (patch.clueOdds !== undefined) s.clueOdds = clampInt(patch.clueOdds, 1, 3, 1);
  if (['none', 'coin'].includes(patch.tieBreak)) s.tieBreak = patch.tieBreak;
  for (const k of ['revealOnDeath', 'endReveal', 'selfNomination', 'selfVote', 'threads', 'score', 'bloodMoon', 'finalTwoDeath', 'clues', 'lovers', 'cult', 'ripper', 'backdrops']) {
    if (typeof patch[k] === 'boolean') s[k] = patch[k];
  }
  return s;
}

export function extendedPoolFor(settings) {
  const p = PRESETS[settings.preset];
  if (p.custom) return settings.extendedPool;
  return p.pool;
}

/** Parse a line/comma separated custom deck like "Death x2, Guardian, Whore". */
export function parseCustomDeck(text) {
  const out = [];
  const errors = [];
  const byName = {};
  for (const r of Object.values(ROLES).filter((x) => roleInMode(x.id, 'classic'))) {
    byName[r.name.toLowerCase()] = r.id;
    byName[r.id.toLowerCase()] = r.id;
    if (r.alias) byName[r.alias.toLowerCase()] = r.id;
  }
  for (const raw of text.split(/[\n,]+/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^(.*?)(?:\s*[x×*]\s*(\d+)|\s+(\d+))?$/i);
    const name = (m?.[1] || line).trim().toLowerCase().replace(/_/g, ' ');
    const count = Number(m?.[2] || m?.[3] || 1);
    const id = byName[name] || byName[name.replace(/ /g, '_')];
    if (!id) { errors.push(['Unknown role "{x}"', { x: line }]); continue; }
    for (let i = 0; i < Math.min(count, 18); i++) out.push(id);
  }
  return { roles: out, errors };
}

/** The exact role list a Custom game asked for (role counters, or typed text), or null. */
export function exactDeck(settings) {
  if (!PRESETS[settings.preset]?.custom) return null;
  const counts = settings.customRoles || {};
  if (settings.deckMode === 'exact') {
    const out = [];
    for (const [id, c] of Object.entries(counts)) for (let i = 0; i < c; i++) out.push(id);
    return { roles: out, errors: [] };
  }
  if (settings.customDeck?.trim()) return parseCustomDeck(settings.customDeck);
  return null;
}

/** Dream weights in force (only Custom may change them). */
export function dreamWeightsFor(settings) {
  return PRESETS[settings.preset]?.custom ? { ...DREAM_WEIGHTS, ...(settings.dreamWeights || {}) } : { ...DREAM_WEIGHTS };
}

const SUGGESTION_POOLS = {
  // Steady: dependable powers, no conversions or lone winners.
  steady: STANDARD_EXTENDED.filter((r) => !['MIMIC', 'DOUBLE_AGENT'].includes(r)),
  // Sharp eyes: information and protection for the town.
  sharp: ['ORACLE', 'BODYGUARD', 'DIPLOMAT', 'MAGISTRATE', 'CONSPIRATOR', 'NECROMANCER', 'WHORE', 'TRAVELING_AGENT', 'GAMBLER'],
  // Wild night: the whole deck, swings included.
  wild: FULL_EXTENDED,
};

/** Three balanced role setups for N players, reshuffled by `seed`. */
export function suggestSetups(n, seed = 0) {
  if (n < MIN_PLAYERS || n > ABS_MAX_PLAYERS) return [];
  return Object.entries(SUGGESTION_POOLS).map(([key, poolAll], vi) => {
    const rng = seededRng(n * 7919 + seed * 104729 + vi * 31 + 1);
    const c = scaling(n);
    const roles = { DEATH: c.DEATH, INNOCENT: c.INNOCENT, GUARDIAN: 1, MENTALIST: 1, PSYCHO: 1 };
    const swap = (id) => { if (roles.INNOCENT > 1) { roles.INNOCENT--; roles[id] = (roles[id] || 0) + 1; } };
    if (n >= 16) swap('GUARDIAN');
    if (n >= 19) swap('MENTALIST');
    if (key === 'sharp' && n >= 9) swap('MENTALIST');
    const pool = poolAll.filter((r) => !(r === 'JESTER' && n < SMALL_TABLE.JESTER));
    const unique = shuffle(rng, pool, 'suggest');
    const dupable = pool.filter((r) => !COPY_SENSITIVE.includes(r));
    for (let i = 0; i < c.EXTENDED; i++) {
      const id = i < unique.length ? unique[i] : dupable.length ? pick(rng, dupable, 'suggest') : 'INNOCENT';
      roles[id] = (roles[id] || 0) + 1;
    }
    for (const k of Object.keys(roles)) if (!roles[k]) delete roles[k];
    return { key, roles };
  });
}

/**
 * Validate a setup for N seated players. Returns errors (blocking) and
 * warnings (shown, not blocking) plus a public description of the deck.
 */
export function validateSetup(n, settings) {
  if (PRESETS[settings.preset]?.missions) return validateMissions(n, settings);
  if (PRESETS[settings.preset]?.exorcism) return validateExorcism(n, settings);
  const errors = [];
  const warnings = [];
  const preset = PRESETS[settings.preset];
  if (n < MIN_PLAYERS) errors.push(['At least {min} players are needed (currently {n}).', { min: MIN_PLAYERS, n }]);
  if (n > preset.max) errors.push(['{preset} supports at most {n} players.', { preset: preset.name, n: preset.max }]);
  if (n < preset.min) errors.push(['{preset} needs at least {n} players.', { preset: preset.name, n: preset.min }]);
  if (n > 13 && n <= ABS_MAX_PLAYERS) warnings.push('More than 13 players: balance is less tested. The suggested setups are a good start.');

  // Rules
  const r = settings.rules;
  if (r.mode === 'manual') {
    if (r.selected.length < preset.rulesMin) errors.push(['Select at least {n} Rule card(s).', { n: preset.rulesMin }]);
    if (r.selected.length > preset.rulesMax) errors.push(['Select at most {n} Rule card(s).', { n: preset.rulesMax }]);
    warnings.push(...ruleWarnings(r.selected));
    if (r.selected.includes('DOUBLE_JEOPARDY') && n < SMALL_TABLE.DOUBLE_JEOPARDY) {
      warnings.push(['Double Jeopardy at fewer than {n} players can let Death win in a single night.', { n: SMALL_TABLE.DOUBLE_JEOPARDY }]);
    }
  }
  if (settings.scenario.mode === 'manual' && !(settings.scenario.who && settings.scenario.where && settings.scenario.why)) {
    errors.push('Fill in WHO, WHERE and WHY, or switch the scenario to random.');
  }

  let publicDeck = null;
  const exact = exactDeck(settings);
  if (exact) {
    const { roles, errors: e } = exact;
    errors.push(...e);
    if (roles.length !== n) errors.push(['The custom deck has {r} roles but {n} players are seated.', { r: roles.length, n }]);
    const deaths = roles.filter((x) => ROLES[x].alignment === 'DEATH').length;
    if (deaths < 1) errors.push('The deck needs at least one Death.');
    if (deaths > roles.length - deaths) errors.push('Death would start with a strict majority.');
    if (deaths === roles.length - deaths && deaths > 0) warnings.push('Death starts at parity — one night kill decides it.');
    if (roles.length && !roles.includes('MENTALIST') && !roles.includes('GUARDIAN')) warnings.push('No Mentalist or Guardian: the town has no information or protection.');
    if (roles.filter((x) => x === 'MIMIC').length > 1) warnings.push('Several Mimics may copy each other into powerlessness.');
    if (roles.includes('JESTER') && n < SMALL_TABLE.JESTER) warnings.push(['A Jester at fewer than {n} players can end the game very early.', { n: SMALL_TABLE.JESTER }]);
    if (roles.includes('CULT_LEADER') && n < SMALL_TABLE.CULT_LEADER) warnings.push(['A Cult at fewer than {n} players can unbalance the game.', { n: SMALL_TABLE.CULT_LEADER }]);
    if (roles.includes('RIPPER') && n < SMALL_TABLE.RIPPER) warnings.push(['The Ripper at fewer than {n} players can unbalance the game.', { n: SMALL_TABLE.RIPPER }]);
    if (n >= 10 && deaths < Math.round(n / 5)) warnings.push('Few Deaths for this many players: the town is favoured.');
    if (deaths > 0 && deaths * 2.6 > roles.length && deaths <= roles.length - deaths) warnings.push('Many Deaths for this many players: Death is favoured.');
    publicDeck = { exact: countBy(roles) };
  } else if (n >= MIN_PLAYERS) {
    const c = scaling(n);
    const pool = extendedPoolFor(settings);
    if (c.EXTENDED > 0 && !preset.innocentFiller && pool.length === 0) {
      warnings.push('The extended pool is empty: extended seats become Innocents.');
    }
    for (const [flag, id] of [['cult', 'CULT_LEADER'], ['ripper', 'RIPPER']]) {
      if (settings[flag] && n < SMALL_TABLE[id]) warnings.push([id === 'RIPPER' ? 'The Ripper at fewer than {n} players can unbalance the game.' : 'A Cult at fewer than {n} players can unbalance the game.', { n: SMALL_TABLE[id] }]);
    }
    if (preset.custom && pool.includes('JESTER')) {
      warnings.push(n < SMALL_TABLE.JESTER
        ? ['A Jester at fewer than {n} players can end the game very early.', { n: SMALL_TABLE.JESTER }]
        : 'Jester is in the pool: it can win alone if sentenced.');
    }
    const sides = sideRoles(settings);
    publicDeck = {
      core: { DEATH: c.DEATH, INNOCENT: Math.max(0, c.INNOCENT + (preset.innocentFiller ? c.EXTENDED : 0) - sides.length), GUARDIAN: 1, MENTALIST: 1, PSYCHO: 1, ...Object.fromEntries(sides.map((id) => [id, 1])) },
      extended: preset.innocentFiller ? 0 : c.EXTENDED,
      pool,
    };
  }
  const doomsday = preset.doomsday || (preset.custom && settings.doomsday);
  if (doomsday) warnings.push(['Doomsday Clock: Death wins if nobody has won after Day {n}.', { n: settings.doomsdayDays }]);
  if (settings.lovers && n < 6) warnings.push('Lovers at a table this small can end the game very quickly.');
  const suggestions = preset.custom ? suggestSetups(n, settings.suggestSeed || 0) : undefined;
  return { ok: errors.length === 0, errors, warnings, publicDeck, suggestions };
}

export function ruleWarnings(ids) {
  const w = [];
  if (ids.includes('MAJORITY_RULE') && ids.includes('VENGEFUL_GHOSTS')) {
    w.push('Majority Rule + Vengeful Ghosts: ghost ballots are cast for drama but never decide the sentence.');
  }
  if (ids.includes('FOG_OF_WAR') && ids.includes('CURSED_SILENCE')) {
    w.push('Fog of War + Cursed Silence: discussion will be extremely restricted.');
  }
  if (ids.includes('HIDDEN_ROLES')) w.push('Hidden Roles reinforces the default: dead roles are already secret.');
  if (ids.includes('DOUBLE_JEOPARDY') && ids.includes('POWER_SURGE')) {
    w.push('Double Jeopardy + Power Surge: Death is already at the cap of 2, so a surge on Death adds nothing.');
  }
  return w;
}

function countBy(arr) {
  const o = {};
  for (const x of arr) o[x] = (o[x] || 0) + 1;
  return o;
}

/** Side roles the lobby switched on (automatic decks only; exact decks list them). */
export function sideRoles(settings) {
  if (exactDeck(settings)) return [];
  return [settings.cult && 'CULT_LEADER', settings.ripper && 'RIPPER'].filter(Boolean);
}

/** Build the concrete list of N roles (server-side, authoritative randomness). */
export function buildDeck(n, settings, rng) {
  const deck = buildBaseDeck(n, settings, rng);
  // Each side role takes the place of an Innocent (or, failing that, an extended seat).
  for (const id of sideRoles(settings)) {
    let i = deck.lastIndexOf('INNOCENT');
    if (i < 0) i = deck.findIndex((r) => ROLES[r].set !== 'core');
    if (i >= 0) deck[i] = id;
  }
  return deck;
}

function buildBaseDeck(n, settings, rng) {
  const preset = PRESETS[settings.preset];
  const exact = exactDeck(settings);
  if (exact) return exact.roles;
  const c = scaling(n);
  const deck = [];
  for (const id of ['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO']) {
    for (let i = 0; i < c[id]; i++) deck.push(id);
  }
  // Presets skip the Jester at small tables; Custom keeps what the host chose.
  const pool = extendedPoolFor(settings).filter((r) => preset.custom || !(r === 'JESTER' && n < SMALL_TABLE.JESTER));
  if (preset.innocentFiller || pool.length === 0) {
    for (let i = 0; i < c.EXTENDED; i++) deck.push('INNOCENT');
    return deck;
  }
  const unique = shuffle(rng, pool, 'deal');
  const dupable = pool.filter((r) => !COPY_SENSITIVE.includes(r));
  for (let i = 0; i < c.EXTENDED; i++) {
    if (i < unique.length) deck.push(unique[i]);
    else if (dupable.length) deck.push(pick(rng, dupable, 'deal'));
    else deck.push('INNOCENT');
  }
  return deck;
}

export function drawRules(settings, rng, n = 99) {
  const preset = PRESETS[settings.preset];
  if (settings.rules.mode === 'manual') return [...settings.rules.selected];
  const count = Math.max(preset.rulesMin, Math.min(preset.rulesMax, settings.rules.count));
  // Random draws never deal Double Jeopardy to a small table (hosts may still pick it).
  const ids = preset.ruleIds.filter((id) => RULE_CARDS[id] && !(id === 'DOUBLE_JEOPARDY' && n < SMALL_TABLE.DOUBLE_JEOPARDY));
  return shuffle(rng, ids, 'rules').slice(0, count);
}

export function drawScenario(settings, rng) {
  if (settings.scenario.mode === 'manual') {
    return { who: settings.scenario.who, where: settings.scenario.where, why: settings.scenario.why };
  }
  return {
    who: pick(rng, SCENARIO.WHO, 'scenario'),
    where: pick(rng, SCENARIO.WHERE, 'scenario'),
    why: pick(rng, SCENARIO.WHY, 'scenario'),
  };
}

export { RULE_IDS };

// ── Missions mode ──────────────────────────────────────────────────────────
/** Which optional Missions roles are switched on. */
export function missionRolesOn(settings) {
  const on = { ...defaultSettings().mRoles, ...(settings.mRoles || {}) };
  return Object.keys(MISSION_OPTIONAL).filter((k) => on[k]);
}

/** The Missions deck for n players: Medium + Reaper + switched-on roles, filled with Companions and Shades. */
export function missionDeck(n, settings) {
  const death = MISSION_DEATH[n];
  const on = missionRolesOn(settings);
  const deathRoles = ['REAPER', ...on.filter((r) => MISSION_OPTIONAL[r] === 'DEATH')];
  const livingRoles = ['MEDIUM', ...on.filter((r) => MISSION_OPTIONAL[r] === 'NON_DEATH')];
  // Twins replace two plain Companions: two Living players who know each other.
  if (settings.twins) livingRoles.push('TWIN', 'TWIN');
  while (deathRoles.length < death) deathRoles.push('SHADE');
  while (livingRoles.length < n - death) livingRoles.push('COMPANION');
  return [...livingRoles, ...deathRoles];
}

function validateMissions(n, settings) {
  const errors = [];
  const warnings = [];
  if (n < MISSION_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: MISSION_MIN, n }]);
  if (n > MISSION_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'Missions', n: MISSION_MAX }]);
  if (settings.scenario.mode === 'manual' && !(settings.scenario.who && settings.scenario.where && settings.scenario.why)) {
    errors.push('Fill in WHO, WHERE and WHY, or switch the scenario to random.');
  }
  const on = missionRolesOn(settings);
  const deathOpt = on.filter((r) => MISSION_OPTIONAL[r] === 'DEATH');
  let publicDeck = null;
  if (n >= MISSION_MIN && n <= MISSION_MAX) {
    const death = MISSION_DEATH[n];
    if (deathOpt.length + 1 > death) errors.push(['Too many Death roles: {n} players have only {d} Death seats, and the Reaper takes one.', { n, d: death }]);
    else publicDeck = { exact: countBy(missionDeck(n, settings)) };
  }
  if (n >= MISSION_MIN && n <= MISSION_MAX) {
    const livingSeats = n - MISSION_DEATH[n];
    const livingNeed = 1 + on.filter((r) => MISSION_OPTIONAL[r] === 'NON_DEATH').length + (settings.twins ? 2 : 0);
    if (livingNeed > livingSeats) errors.push(['Too many Living roles: {n} players have only {d} Living seats, and the Medium takes one.', { n, d: livingSeats }]);
    if (on.includes('M_JESTER') && n < MISSION_JESTER_MIN) errors.push(['The Jester needs at least {n} players.', { n: MISSION_JESTER_MIN }]);
  }
  if (on.includes('CHARLATAN') && !on.includes('BELIEVER')) warnings.push('The Charlatan only matters when a Believer is in play.');
  if (settings.twins && !on.includes('VEILED') && !on.includes('STRAY') && n >= 7) warnings.push('Twins help the Living. For balance, switch on the Veiled or the Stray.');
  return { ok: errors.length === 0, errors, warnings, publicDeck, suggestions: [] };
}
