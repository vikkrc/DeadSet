// Lobby settings, role scaling (§5.3), deck building and validation.
import {
  ROLES, PRESETS, RULE_CARDS, RULE_IDS, COPY_SENSITIVE, SCENARIO, MIN_PLAYERS, ABS_MAX_PLAYERS,
} from './content.js';
import { shuffle, pick } from './rng.js';

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
    timers: { morning: 0, discussion: 0, defense: 0, voting: 90, swap: 30, night: 120, retaliation: 45 },
    transport: 'in-person',
    revealOnDeath: false,
    endReveal: true,
    selfNomination: false,
    selfVote: true,
    threads: false,
    score: true,
  };
}

const clampInt = (v, lo, hi, d) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d;
};

/** Merge an untrusted client patch into settings, coercing every field. */
export function applySettingsPatch(settings, patch = {}) {
  const s = structuredClone(settings);
  if (patch.preset && PRESETS[patch.preset]) {
    s.preset = patch.preset;
    const p = PRESETS[s.preset];
    s.dreams = p.dreams;
    s.doomsday = p.doomsday;
    s.rules.count = Math.max(p.rulesMin, Math.min(p.rulesMax, s.rules.count));
    s.rules.selected = s.rules.selected.filter((r) => p.ruleIds.includes(r)).slice(0, p.rulesMax);
  }
  const preset = PRESETS[s.preset];
  if (Array.isArray(patch.extendedPool)) {
    s.extendedPool = [...new Set(patch.extendedPool.filter((r) => ROLES[r] && ROLES[r].set !== 'core'))];
  }
  if (typeof patch.customDeck === 'string') s.customDeck = patch.customDeck.slice(0, 600);
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
    for (const k of Object.keys(s.timers)) {
      if (patch.timers[k] !== undefined) s.timers[k] = clampInt(patch.timers[k], 0, 1800, s.timers[k]);
    }
  }
  if (['in-person', 'remote'].includes(patch.transport)) s.transport = patch.transport;
  for (const k of ['revealOnDeath', 'endReveal', 'selfNomination', 'selfVote', 'threads', 'score']) {
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
  for (const r of Object.values(ROLES)) {
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
    if (!id) { errors.push(`Unknown role "${line}"`); continue; }
    for (let i = 0; i < Math.min(count, 18); i++) out.push(id);
  }
  return { roles: out, errors };
}

/**
 * Validate a setup for N seated players. Returns errors (blocking) and
 * warnings (shown, not blocking) plus a public description of the deck.
 */
export function validateSetup(n, settings) {
  const errors = [];
  const warnings = [];
  const preset = PRESETS[settings.preset];
  if (n < MIN_PLAYERS) errors.push(`At least ${MIN_PLAYERS} players are needed (currently ${n}).`);
  if (n > preset.max) errors.push(`${preset.name} supports at most ${preset.max} players.`);
  if (n < preset.min) errors.push(`${preset.name} needs at least ${preset.min} players.`);
  if (n > 13 && n <= ABS_MAX_PLAYERS) warnings.push('More than 13 players is experimental: balance is untested.');

  // Rules
  const r = settings.rules;
  if (r.mode === 'manual') {
    if (r.selected.length < preset.rulesMin) errors.push(`Select at least ${preset.rulesMin} Rule card(s).`);
    if (r.selected.length > preset.rulesMax) errors.push(`Select at most ${preset.rulesMax} Rule card(s).`);
    warnings.push(...ruleWarnings(r.selected));
  }
  if (settings.scenario.mode === 'manual' && !(settings.scenario.who && settings.scenario.where && settings.scenario.why)) {
    errors.push('Fill in WHO, WHERE and WHY, or switch the scenario to random.');
  }

  let publicDeck = null;
  if (preset.custom && settings.customDeck.trim()) {
    const { roles, errors: e } = parseCustomDeck(settings.customDeck);
    errors.push(...e);
    if (roles.length !== n) errors.push(`The custom deck has ${roles.length} roles but ${n} players are seated.`);
    const deaths = roles.filter((x) => ROLES[x].alignment === 'DEATH').length;
    if (deaths < 1) errors.push('The deck needs at least one Death.');
    if (deaths > roles.length - deaths) errors.push('Death would start with a strict majority.');
    if (deaths === roles.length - deaths && deaths > 0) warnings.push('Death starts at parity — one night kill decides it.');
    if (roles.length && !roles.includes('MENTALIST') && !roles.includes('GUARDIAN')) warnings.push('No Mentalist or Guardian: the town has no information or protection.');
    if (roles.filter((x) => x === 'MIMIC').length > 1) warnings.push('Several Mimics may copy each other into powerlessness.');
    publicDeck = { exact: countBy(roles) };
  } else if (n >= MIN_PLAYERS) {
    const c = scaling(n);
    const pool = extendedPoolFor(settings);
    if (c.EXTENDED > 0 && !preset.innocentFiller && pool.length === 0) {
      warnings.push('The extended pool is empty: extended seats become Innocents.');
    }
    if (preset.custom && pool.includes('JESTER')) warnings.push('Jester is in the pool: it can win alone if sentenced.');
    publicDeck = {
      core: { DEATH: c.DEATH, INNOCENT: c.INNOCENT + (preset.innocentFiller ? c.EXTENDED : 0), GUARDIAN: 1, MENTALIST: 1, PSYCHO: 1 },
      extended: preset.innocentFiller ? 0 : c.EXTENDED,
      pool,
    };
  }
  const doomsday = preset.doomsday || (preset.custom && settings.doomsday);
  if (doomsday) warnings.push(`Doomsday Clock: Death wins if nobody has won after Day ${settings.doomsdayDays}.`);
  return { ok: errors.length === 0, errors, warnings, publicDeck };
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

/** Build the concrete list of N roles (server-side, authoritative randomness). */
export function buildDeck(n, settings, rng) {
  const preset = PRESETS[settings.preset];
  if (preset.custom && settings.customDeck.trim()) return parseCustomDeck(settings.customDeck).roles;
  const c = scaling(n);
  const deck = [];
  for (const id of ['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO']) {
    for (let i = 0; i < c[id]; i++) deck.push(id);
  }
  const pool = extendedPoolFor(settings);
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

export function drawRules(settings, rng) {
  const preset = PRESETS[settings.preset];
  if (settings.rules.mode === 'manual') return [...settings.rules.selected];
  const count = Math.max(preset.rulesMin, Math.min(preset.rulesMax, settings.rules.count));
  return shuffle(rng, preset.ruleIds.filter((id) => RULE_CARDS[id]), 'rules').slice(0, count);
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
