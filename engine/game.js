// Dead Set rules engine: phase machine and command handling.
// Pure functions over a plain serialisable match object. The server wraps each
// call in a single synchronous critical section (Node is single-threaded), so
// every command or transition is atomic.
import { ROLES, DREAMS, DREAM_IDS, RULES_VERSION, PRESETS, RULE_CARDS, ABS_MAX_PLAYERS, INSOMNIA_CAP, AVATAR_PARTS, modeOf, roleInMode } from './content.js';
import {
  defaultSettings, applySettingsPatch, validateSetup, buildDeck, drawRules, drawScenario, dreamWeightsFor,
} from './setup.js';
import {
  GameError, byId, living, nameOf, hasRule, deathTeam, pub, priv, isDayPhase, isNightPhase,
} from './state.js';
import { shuffle } from './rng.js';
import { resolveNight } from './night.js';
import { checkVictory } from './victory.js';
import { ballotWeight, tally } from './day.js';
import { startMissions, missionCommand, missionAdvance, isMissionPhase } from './missions.js';

export { GameError };

const MAX_CHAT = 280;
export const NIGHT_GRACE_SECONDS = 5;
/** With Dreams on, nightfall is long enough to read your Dream (and for Snatchers to swap). */
export const DREAM_SWAP_SECONDS = 15;
/** After this many deathless nights in a row, a Blood Moon rises. */
export const BLOOD_MOON_AFTER = 2;

export function newMatch({ id, code, hostId, moderated = false }) {
  return {
    id, code, rulesVersion: RULES_VERSION, stateVersion: 0,
    phase: 'LOBBY', phaseSeq: 0, phaseId: 'LOBBY:0', openedAt: null, deadline: null,
    dayNumber: 0, nightNumber: 0,
    hostId, moderated, moderatorId: moderated ? hostId : null,
    settings: defaultSettings(),
    players: [],
    scenario: null, activeRules: [], config: null,
    publicLog: [], privateLog: {}, chats: {},
    day: null, night: null, pendingStatuses: [], gamblerBets: [],
    winner: null, endReason: null, manualRoles: {}, hostTransferVotes: [], M: null,
  };
}

// ── Lobby ──────────────────────────────────────────────────────────────────
/** A valid portrait or null: { c, e, m, h } part indices. */
export function cleanAvatar(a) {
  if (!a || typeof a !== 'object') return null;
  const out = {};
  for (const [k, n] of Object.entries(AVATAR_PARTS)) {
    const v = Number.parseInt(a[k], 10);
    if (!Number.isInteger(v) || v < 0 || v >= n) return null;
    out[k] = v;
  }
  return out;
}

export function addPlayer(m, { id, name, avatar = null, bot = false }) {
  if (m.phase !== 'LOBBY') throw new GameError('The match has already started.');
  const clean = normaliseName(name);
  if (!clean) throw new GameError('Enter a display name.');
  if (m.players.some((p) => normaliseName(p.name).toLowerCase() === clean.toLowerCase())) {
    throw new GameError('That name is already taken in this room.');
  }
  if (m.players.length >= ABS_MAX_PLAYERS) throw new GameError('The room is full.');
  const p = {
    id, name: clean, seat: m.players.length, alive: true, ready: false, connected: false,
    roleId: null, originalRoleId: null, alignment: null, charges: {}, statuses: [],
    teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false,
    avatar: cleanAvatar(avatar), bot: !!bot, lover: null,
  };
  m.players.push(p);
  bump(m);
  return p;
}

export function normaliseName(name) {
  return String(name ?? '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
}

export function removePlayer(m, pid) {
  if (m.phase !== 'LOBBY') throw new GameError('Players can only be removed in the lobby.');
  m.players = m.players.filter((p) => p.id !== pid);
  m.players.forEach((p, i) => { p.seat = i; });
  delete m.manualRoles[pid];
  bump(m);
}

export function moveSeat(m, pid, dir) {
  if (m.phase !== 'LOBBY') throw new GameError('Seats are fixed once the match starts.');
  const i = m.players.findIndex((p) => p.id === pid);
  const j = i + (dir < 0 ? -1 : 1);
  if (i < 0 || j < 0 || j >= m.players.length) return;
  [m.players[i], m.players[j]] = [m.players[j], m.players[i]];
  m.players.forEach((p, k) => { p.seat = k; });
  bump(m);
}

export function updateSettings(m, patch) {
  if (m.phase !== 'LOBBY') throw new GameError('Settings are locked once the match starts.');
  const before = modeOf(m.settings.preset);
  m.settings = applySettingsPatch(m.settings, patch);
  // A mode switch drops manual role picks: they belong to the old mode's roles.
  if (modeOf(m.settings.preset) !== before) m.manualRoles = {};
  bump(m);
}

export function setupReport(m) {
  const report = validateSetup(m.players.length, m.settings);
  if (m.players.some((p) => !p.ready)) report.notReady = m.players.filter((p) => !p.ready).length;
  if (m.moderated && Object.keys(m.manualRoles).length) {
    const roles = m.players.map((p) => m.manualRoles[p.id]).filter(Boolean);
    if (roles.length !== m.players.length) report.errors.push('Manual assignment: every player needs a role (or clear them all).');
    const missions = !!PRESETS[m.settings.preset]?.missions;
    if (roles.some((r) => !roleInMode(r, modeOf(m.settings.preset)))) report.errors.push(missions ? 'Manual assignment: use Missions roles only.' : 'Manual assignment: Missions roles cannot be used in this mode.');
    if (missions && roles.length === m.players.length && !(roles.includes('MEDIUM') && roles.includes('REAPER'))) report.errors.push('Manual assignment needs a Medium and a Reaper.');
    const d = roles.filter((r) => ROLES[r].alignment === 'DEATH').length;
    if (roles.length === m.players.length && d < 1) report.errors.push('Manual assignment needs at least one Death.');
    if (roles.length === m.players.length && d > roles.length - d) report.errors.push('Manual assignment gives Death a starting majority.');
    report.ok = report.errors.length === 0;
  }
  return report;
}

// ── Start / Night 0 ────────────────────────────────────────────────────────
export function startMatch(m, rng, now, { forceRoles = null } = {}) {
  if (m.phase !== 'LOBBY') throw new GameError('The match has already started.');
  const report = setupReport(m);
  if (!report.ok) throw new GameError(report.errors[0]);
  if (!forceRoles && report.notReady) throw new GameError('Everyone must tap Ready first.');
  const n = m.players.length;
  if (PRESETS[m.settings.preset]?.missions) { startMissions(m, rng, now, { forceRoles }); return; }
  m.M = null;
  let assignment;
  if (forceRoles) {
    assignment = m.players.map((p, i) => forceRoles[i]);
  } else if (m.moderated && Object.keys(m.manualRoles).length === n) {
    assignment = m.players.map((p) => m.manualRoles[p.id]);
  } else {
    assignment = shuffle(rng, buildDeck(n, m.settings, rng), 'deal');
  }
  if (assignment.length !== n || assignment.some((r) => !ROLES[r])) throw new GameError('Role assignment failed validation.');

  m.players.forEach((p, i) => {
    const role = ROLES[assignment[i]];
    Object.assign(p, {
      roleId: role.id, originalRoleId: role.id, alignment: role.alignment, alive: true,
      charges: {}, statuses: [], teamJoinNight: role.alignment === 'DEATH' ? 1 : null,
      tempRevival: null, revivedOnce: false, acknowledged: false, daSettled: false,
      mimicPowerless: false, powersFromNight: 1, causes: null, diedAt: null, lover: null,
    });
    if (role.night?.charges) p.charges[role.id] = role.night.charges;
    if (role.day?.charges) p.charges[role.id] = role.day.charges;
  });
  const preset = PRESETS[m.settings.preset];
  m.config = {
    mode: 'classic',
    preset: preset.id,
    dreams: m.settings.dreams,
    doomsday: preset.doomsday || (preset.custom && m.settings.doomsday),
    doomsdayDays: m.settings.doomsdayDays,
    dreamWeights: dreamWeightsFor(m.settings),
    bloodMoon: m.settings.bloodMoon !== false,
    finalTwoDeath: !!m.settings.finalTwoDeath,
    clues: m.settings.clues !== false,
    clueOdds: m.settings.clueOdds ?? 1,
    lovers: !!m.settings.lovers,
    tieBreak: m.settings.tieBreak === 'coin' ? 'coin' : 'none',
  };
  m.history = [];
  m.calm = 0;
  m.deadSnap = [];
  m.dreamCounts = {};
  m.activeRules = drawRules(m.settings, rng, n);
  m.scenario = drawScenario(m.settings, rng);
  m.publicLog = [];
  m.privateLog = {};
  m.chats = {};
  m.pendingStatuses = [];
  m.gamblerBets = [];
  m.dayNumber = 0;
  m.nightNumber = 0;
  m.winner = null;
  m.endReason = null;
  enterPhase(m, 'NIGHT_0_REVEAL', now, 0);
  pub(m, ['We are {who}, in {where}, trying to {why}.', { who: m.scenario.who, where: m.scenario.where, why: m.scenario.why }], 'scenario', { ev: 'scenario' });
  if (m.activeRules.length) pub(m, ['Rules in force: {rules}.', { rules: [...m.activeRules] }], 'rules');
  pub(m, 'Night 0. Look only at your own screen.', 'phase', { ev: 'night0' });
  // Lovers: two random players, from any side, bound together.
  if (m.config.lovers && n >= 4) {
    const [a, b] = shuffle(rng, m.players.map((p) => p.id), 'lovers');
    byId(m, a).lover = b;
    byId(m, b).lover = a;
  }
  for (const p of m.players) {
    priv(m, p.id, ['You are {role}.', { role: p.roleId }], 'role');
    if (p.lover) priv(m, p.id, ['Cupid\'s arrow found you: you are in love with {b}. If one of you dies, so does the other. If you two are the last alive, you win together.', { b: nameOf(m, p.lover) }], 'lover');
    if (p.alignment === 'CULT') priv(m, p.id, 'You lead the Cult. Each night, recruit one player. The Cult wins when it outnumbers everyone else.', 'cult');
    if (p.alignment === 'DEATH') {
      const mates = m.players.filter((x) => x.alignment === 'DEATH' && x.id !== p.id).map((x) => x.name);
      priv(m, p.id, mates.length ? ['Your Death teammates: {names}.', { names: mates }] : 'You are the only Death. Hunt alone.', 'death');
    }
  }
}

// ── Phase plumbing ─────────────────────────────────────────────────────────
function bump(m) { m.stateVersion++; }

function enterPhase(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.dayNumber}:${m.nightNumber}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

const T = (m, key) => m.settings.timers[key] || 0;

function endMatch(m, result, now) {
  m.winner = result.winner;
  m.endReason = result.reason;
  m.jesterId = result.jesterId ?? null;
  const label = { DEATH: 'Death wins.', NON_DEATH: 'The non-Death faction wins.', JESTER: 'The Jester wins alone.', DRAW: 'Draw.', ABORTED: 'Match aborted by the host.', LOVERS: 'The Lovers win.', CULT: 'The Cult wins.', RIPPER: 'The Ripper wins.' }[result.winner];
  pub(m, ['{label} {reason}', { label: [label, {}], reason: typeof result.reason === 'string' ? [result.reason, {}] : result.reason }], 'end', { ev: 'end', winner: result.winner, reason: result.reason });
  m.night = null;
  enterPhase(m, 'ENDED', now, 0);
}

function victoryOrNull(m, now, opts) {
  const v = checkVictory(m, opts);
  if (v) { endMatch(m, v, now); return true; }
  return false;
}

// ── Day ────────────────────────────────────────────────────────────────────
function beginDay(m, now) {
  m.dayNumber++;
  const n = m.dayNumber;
  // Apply queued Psycho statuses for this Day only; drop anything older.
  for (const p of m.players) p.statuses = [];
  for (const s of m.pendingStatuses.filter((x) => x.day === n)) {
    const p = byId(m, s.targetId);
    if (p?.alive) {
      p.statuses.push({ type: s.type, day: n, origin: s.origin });
      priv(m, p.id, s.type === 'MUTE'
        ? 'You wake unable to speak. You are MUTE today: no talking in discussion or defence, but you may still nominate and vote.'
        : 'You wake with your voice but not your vote. You have NO VOTE today.', 'status');
    }
  }
  m.pendingStatuses = m.pendingStatuses.filter((x) => x.day > n);
  m.day = {
    number: n, immune: [], shots: {}, nominations: [], defenseIndex: 0,
    ballots: {}, ghostBallots: {}, eligibleVoters: [], ghostVoters: [], result: null, retaliation: null,
  };
  enterPhase(m, 'DAY_PREP', now, T(m, 'morning'));
  if (n === 1) pub(m, 'Day 1 begins. Nobody has died — yet.', 'phase', { ev: 'day1' });
}

function closeMorning(m, now) {
  // Vigilante shots resolve atomically, then victory is checked.
  const shots = Object.entries(m.day.shots);
  const victims = [];
  for (const [actorId, target] of shots) {
    const a = byId(m, actorId);
    a.charges.VIGILANTE = 0;
    const t = byId(m, target);
    if (!t.alive) continue;
    if (t.tempRevival) { priv(m, actorId, ['Your shot passed through {b} — the dead cannot die twice while borrowed time lasts.', { b: t.name }]); continue; }
    if (!victims.includes(t.id)) victims.push(t.id);
    priv(m, actorId, ['Your shot killed {b}.', { b: t.name }]);
  }
  for (const id of victims) {
    const t = byId(m, id);
    t.alive = false; t.diedAt = `Day ${m.dayNumber}`; t.causes = ['VIGILANTE'];
  }
  if (shots.length) {
    pub(m, victims.length ? ['A shot rang out across the square. {dead} fell.', { dead: deadList(m, victims) }] : 'A shot rang out across the square, but nobody fell.', 'death', { victims, ev: 'shot' });
    victims.push(...heartbreak(m, victims));
  }
  if (victims.length && victoryOrNull(m, now)) return;
  pub(m, ['Day {n}: discussion and nominations are open.', { n: m.dayNumber }], 'phase', { ev: 'discussion' });
  enterPhase(m, 'DAY_DISCUSSION', now, T(m, 'discussion'));
}

/** Lovers die together: anyone whose lover just died follows them (by day). */
function heartbreak(m, ids) {
  const out = [];
  for (const id of ids) {
    const lover = byId(m, byId(m, id)?.lover);
    if (lover?.alive && !ids.includes(lover.id) && !out.includes(lover.id)) {
      lover.alive = false; lover.diedAt = `Day ${m.dayNumber}`; lover.causes = ['HEARTBREAK']; lover.tempRevival = null;
      out.push(lover.id);
    }
  }
  if (out.length) pub(m, ['{dead} died of a broken heart.', { dead: deadList(m, out) }], 'death', { victims: out, ev: 'heartbreak' });
  return out;
}

function deadList(m, ids) {
  const reveal = m.settings.revealOnDeath && !hasRule(m, 'HIDDEN_ROLES');
  return ids.map((id) => [byId(m, id).name, reveal ? byId(m, id).roleId : null]);
}


export function nominees(m) {
  if (!m.day) return [];
  const out = [];
  for (const nom of m.day.nominations) {
    if (!out.includes(nom.target) && byId(m, nom.target)?.alive && !m.day.immune.includes(nom.target)) out.push(nom.target);
  }
  return out;
}

function closeDiscussion(m, now) {
  const list = nominees(m);
  if (!list.length) {
    pub(m, 'Nobody was nominated. There is no vote today.', 'vote', { ev: 'novote' });
    resolveDay(m, now, { noVote: true });
    return;
  }
  m.day.defenseIndex = 0;
  pub(m, ['Defence: {names} will each speak in turn.', { names: list.map((id) => nameOf(m, id)) }], 'phase', { ev: 'defense' });
  enterPhase(m, 'DAY_DEFENSE', now, T(m, 'defense'));
}

function advanceDefense(m, now, skipAll = false) {
  const list = nominees(m);
  m.day.defenseIndex++;
  if (skipAll || m.day.defenseIndex >= list.length) openVoting(m, now);
  else enterPhase(m, 'DAY_DEFENSE', now, T(m, 'defense'));
}

function openVoting(m, now) {
  m.day.eligibleVoters = living(m).filter((p) => !p.statuses.some((s) => s.type === 'NO_VOTE')).map((p) => p.id);
  m.day.ghostVoters = hasRule(m, 'VENGEFUL_GHOSTS') ? m.players.filter((p) => !p.alive && !p.tempRevival).map((p) => p.id) : [];
  m.day.ballots = {};
  m.day.ghostBallots = {};
  pub(m, ['The vote is open. Candidates: {names}.', { names: nominees(m).map((id) => nameOf(m, id)) }], 'vote', { ev: 'vote-open' });
  enterPhase(m, 'DAY_VOTING', now, T(m, 'voting'));
}

function resolveDay(m, now, { noVote = false } = {}) {
  const d = m.day;
  const list = nominees(m);
  let sentenced = null;
  let cancelled = false;
  // Gambler: correct prediction of the first formal nominee cancels sentencing.
  const firstNominee = d.nominations[0]?.target ?? null;
  const bets = m.gamblerBets.filter((b) => b.day === d.number);
  m.gamblerBets = m.gamblerBets.filter((b) => b.day > d.number);
  for (const b of bets) {
    const won = firstNominee && b.targetId === firstNominee;
    if (byId(m, b.actorId).alive) priv(m, b.actorId, won ? 'Your bet came in. The sentencing is void.' : 'Your bet was lost.');
    if (won) cancelled = true;
  }
  if (!noVote) {
    const t = tally(m);
    d.result = t;
    const line = Object.entries(t.totals).sort((a, b) => b[1] - a[1]).map(([id, w]) => `${nameOf(m, id)} ${w}`).join(' · ');
    pub(m, line ? (t.abstain ? ['Ballots counted: {line}. {n} abstained.', { line, n: t.abstain }] : ['Ballots counted: {line}.', { line }]) : (t.abstain ? ['Ballots counted. {n} abstained.', { n: t.abstain }] : 'Ballots counted.'), 'vote', { ev: 'tally', totals: t.totals, majority: t.majority, threshold: t.threshold ?? null });
    if (cancelled) pub(m, 'Fate intervened: a wager was won, and today\'s sentence is cancelled.', 'vote', { ev: 'cancelled' });
    else if (t.winner) sentenced = t.winner;
    else if (t.tied && m.config.tieBreak === 'coin') {
      // The coin decides between the tied players (with more than two, it is tossed among them).
      sentenced = t.tied[rngRef.int(t.tied.length, 'coin')];
      pub(m, ['The vote is tied. A coin is tossed between {names}… it falls for {name}.', { names: t.tied.map((id) => nameOf(m, id)), name: nameOf(m, sentenced) }], 'vote', { ev: 'coinflip', tied: t.tied, winner: sentenced });
    } else pub(m, t.reason, 'vote', { ev: 'nosentence' });
  } else if (cancelled) {
    pub(m, 'A wager was won, but there was nothing left to cancel.', 'vote', { ev: 'cancelled' });
  }

  (m.history ||= []).push({
    kind: 'day', n: d.number, nominations: d.nominations.map((x) => ({ by: x.by, target: x.target })),
    ballots: { ...d.ballots }, ghostBallots: { ...d.ghostBallots }, shots: { ...d.shots },
    sentenced, cancelled, totals: d.result?.totals ?? {},
  });
  if (sentenced) {
    const p = byId(m, sentenced);
    p.alive = false; p.diedAt = `Day ${d.number}`; p.causes = ['SENTENCED']; p.tempRevival = null;
    pub(m, ['{dead} has been sentenced.', { dead: deadList(m, [sentenced]) }], 'sentence', { victims: [sentenced], ev: 'sentence' });
    if (p.roleId === 'JESTER' && p.alignment === 'INDEPENDENT') {
      endMatch(m, checkVictory(m, { jesterSentencedId: p.id }), now);
      return;
    }
    heartbreak(m, [sentenced]);
    if (p.alignment === 'DEATH' && hasRule(m, 'EQUAL_EXCHANGE')) {
      const targets = living(m).filter((x) => x.alignment !== 'DEATH').map((x) => x.id);
      if (targets.length) {
        d.retaliation = { actorId: p.id, targets, choice: null };
        priv(m, p.id, 'Equal Exchange: you may take one living non-Death player with you.', 'death');
        pub(m, 'The condemned is granted a final act…', 'vote', { ev: 'final-act' });
        enterPhase(m, 'DAY_RESOLVING', now, T(m, 'retaliation'));
        return;
      }
    }
  } else {
    // Scapegoat passive: lowest-seat living, non-immune Scapegoat dies.
    const goat = living(m).filter((p) => p.roleId === 'SCAPEGOAT' && !p.tempRevival).sort((a, b) => a.seat - b.seat)[0];
    if (goat) {
      goat.alive = false; goat.diedAt = `Day ${d.number}`; goat.causes = ['SCAPEGOAT'];
      pub(m, ['No one was sentenced — so the Scapegoat paid. {dead} is dead.', { dead: deadList(m, [goat.id]) }], 'death', { victims: [goat.id], ev: 'scapegoat' });
      heartbreak(m, [goat.id]);
    } else if (!noVote && !cancelled) {
      // reason already published
    } else {
      pub(m, 'No one was sentenced today.', 'vote', { ev: 'nosentence' });
    }
  }
  finishDay(m, now);
}

function resolveRetaliation(m, now) {
  const r = m.day.retaliation;
  if (r.choice) {
    const t = byId(m, r.choice);
    if (t.alive && !t.tempRevival) {
      t.alive = false; t.diedAt = `Day ${m.dayNumber}`; t.causes = ['EQUAL_EXCHANGE'];
      pub(m, ['With a last breath, the condemned took {dead} with them.', { dead: deadList(m, [t.id]) }], 'death', { victims: [t.id], ev: 'exchange' });
      heartbreak(m, [t.id]);
    } else {
      pub(m, 'The final act failed to claim anyone.', 'vote', { ev: 'exchange-none' });
    }
  } else {
    pub(m, 'The condemned went quietly.', 'vote', { ev: 'exchange-none' });
  }
  finishDay(m, now);
}

function finishDay(m, now) {
  for (const p of m.players) p.statuses = [];
  if (victoryOrNull(m, now)) return;
  if (m.config.doomsday && m.dayNumber >= m.config.doomsdayDays) {
    endMatch(m, { winner: 'DEATH', reason: ['The Doomsday Clock struck after Day {n}.', { n: m.dayNumber }] }, now);
    return;
  }
  beginNightPhase(m, now);
}

// ── Night ──────────────────────────────────────────────────────────────────
let rngRef = null; // set by the dispatcher for helpers that need randomness
function beginNightPhase(m, now) {
  const rng = rngRef;
  m.nightNumber = m.dayNumber;
  const n = m.nightNumber;
  const alive = living(m).map((p) => p.id);
  m.night = {
    number: n, aliveAtOpen: alive, initialDreams: {}, dreams: {}, initialSnatchers: [], swaps: {},
    swapDone: {}, done: {}, actions: {}, nightmare: {}, sleepwalk: {}, schemas: {}, surge: null,
    death: null, conspire: {},
  };
  pub(m, ['Night {n} falls. Keep your screen to yourself.', { n }], 'phase', { ev: 'nightfall', n });
  // A death during the Day breaks the run of quiet nights.
  const deadNow = m.players.filter((p) => !p.alive).map((p) => p.id);
  if (deadNow.some((id) => !(m.deadSnap || []).includes(id))) m.calm = 0;
  m.deadSnap = deadNow;
  if (m.config.bloodMoon && (m.calm ?? 0) >= BLOOD_MOON_AFTER) {
    m.night.bloodMoon = true;
    pub(m, 'A Blood Moon rises. Tonight no protection holds, and nothing can stay Death\'s hand.', 'phase', { ev: 'bloodmoon', n });
  }
  if (m.config.dreams) {
    m.dreamCounts ||= {};
    for (const id of alive) {
      const d = drawDream(m, rng);
      if (!d) continue;
      m.night.initialDreams[id] = d;
      m.dreamCounts[d] = (m.dreamCounts[d] || 0) + 1;
    }
    m.night.initialSnatchers = alive.filter((id) => m.night.initialDreams[id] === 'DREAM_SNATCHER');
    m.night.dreams = { ...m.night.initialDreams };
  }
  // A fixed nightfall: everyone reads their Dream, Dream Snatchers may pick a
  // swap, then night actions open on their own. The length never varies, so
  // it reveals nothing about who holds what.
  enterPhase(m, 'NIGHT_DREAM_SWAP', now, m.config.dreams ? DREAM_SWAP_SECONDS : NIGHT_GRACE_SECONDS);
}

/** One weighted Dream draw; Insomnia stops appearing once it reached its cap. */
function drawDream(m, rng) {
  const W = m.config.dreamWeights || {};
  const ids = DREAM_IDS.filter((id) => (W[id] ?? 1) > 0 && !(id === 'INSOMNIA' && (m.dreamCounts.INSOMNIA || 0) >= INSOMNIA_CAP));
  const total = ids.reduce((a, id) => a + (W[id] ?? 1), 0);
  if (!total) return null;
  let r = rng.int(total, 'dream');
  for (const id of ids) { r -= W[id] ?? 1; if (r < 0) return id; }
  return ids.at(-1);
}

function applySwaps(m) {
  const N = m.night;
  const snatchers = [...N.initialSnatchers].sort((a, b) => byId(m, a).seat - byId(m, b).seat);
  for (const s of snatchers) {
    const t = N.swaps[s];
    if (!t || t === s || !N.aliveAtOpen.includes(t)) continue;
    [N.dreams[s], N.dreams[t]] = [N.dreams[t], N.dreams[s]];
  }
}

function openActions(m, now) {
  const rng = rngRef;
  const N = m.night;
  const n = N.number;
  if (m.config.dreams) applySwaps(m);
  for (const p of m.players) p.dreamId = N.dreams[p.id] ?? null;
  // Sleepwalking: fixed link to the player seated immediately before.
  const seats = [...m.players].sort((a, b) => a.seat - b.seat);
  for (const id of N.aliveAtOpen) {
    if (N.dreams[id] === 'SLEEPWALKING') {
      const s = byId(m, id).seat;
      N.sleepwalk[id] = seats[(s - 1 + seats.length) % seats.length].id;
    }
  }
  // Death team snapshot for this night.
  const team = deathTeam(m, n).map((p) => p.id);
  // Power Surge: Death counts as one entry; each repeatable non-Death actor once.
  if (hasRule(m, 'POWER_SURGE')) {
    const entries = [];
    if (team.length) entries.push('DEATH');
    for (const id of N.aliveAtOpen) {
      if (team.includes(id)) continue;
      const s = baseSchema(m, byId(m, id), n, team);
      if (s && ROLES[s.roleId]?.night?.repeatable) entries.push(id);
    }
    N.surge = entries.length ? entries[rng.int(entries.length, 'surge')] : null;
  }
  for (const id of N.aliveAtOpen) N.schemas[id] = buildSchema(m, byId(m, id), n, team);
  if (team.length) {
    let cap = hasRule(m, 'DOUBLE_JEOPARDY') ? 2 : 1;
    if (team.some((id) => N.dreams[id] === 'NIGHT_SHIFT')) cap = 2;
    if (N.surge === 'DEATH') cap = 2;
    N.death = { members: team, capacity: Math.min(2, cap), proposals: {}, confirmed: {} };
  }
  // Private dream / surge notices.
  for (const id of N.aliveAtOpen) {
    const d = N.dreams[id];
    if (d) {
      const swapped = N.initialDreams[id] !== d;
      priv(m, id, [swapped ? 'Your dream shifted. Tonight you dream of {dream}: {dreamText}' : 'Tonight you dream of {dream}: {dreamText}', { dream: d, dreamText: d }], 'dreamdraw');
    }
    if (N.surge === id) priv(m, id, 'Power Surge: your power answers twice tonight.', 'surge');
    if (N.surge === 'DEATH' && team.includes(id)) priv(m, id, 'Power Surge: the Death faction may take two lives tonight.', 'surge');
  }
  enterPhase(m, 'NIGHT_ACTIONS', now, T(m, 'night'));
}

/** Role action availability before Night Shift / Surge multipliers. */
function baseSchema(m, p, n, team) {
  if (team.includes(p.id)) return { kind: 'death', roleId: 'DEATH' };
  const role = ROLES[p.roleId];
  const def = role?.night;
  if (!def) return null;
  if (p.roleId === 'MIMIC' && (p.mimicPowerless || n !== 1)) return null;
  if (p.roleId === 'DOUBLE_AGENT' && (p.daSettled || n !== 1)) return null;
  if (def.onlyNight && def.onlyNight !== n) return null;
  if ((p.powersFromNight ?? 1) > n) return null;
  if (def.charges && !(p.charges[p.roleId] > 0)) return null;
  if (p.alignment === 'DEATH' && def.kind !== 'death') {
    // Converted Death-aligned players act only through the team (from their join night).
    return null;
  }
  const alive = m.night.aliveAtOpen;
  let targets = [];
  if (def.kind === 'target' || def.kind === 'chat') targets = alive.filter((id) => def.self || id !== p.id);
  if (def.kind === 'dead') targets = m.players.filter((x) => !x.alive && !x.revivedOnce && x.id !== p.id).map((x) => x.id);
  if ((def.kind === 'target' || def.kind === 'dead' || def.kind === 'chat') && targets.length === 0) return null;
  return { kind: def.kind, roleId: p.roleId, targets, options: def.options ?? null, verb: def.verb };
}

function buildSchema(m, p, n, team) {
  const base = baseSchema(m, p, n, team);
  if (!base) return null;
  if (base.kind === 'death') return base;
  if (m.night.dreams[p.id] === 'SLEEP_PARALYSIS') return { ...base, blocked: 'paralysis', uses: 0 };
  let uses = 1;
  if (ROLES[base.roleId].night.repeatable) {
    if (m.night.dreams[p.id] === 'NIGHT_SHIFT') uses++;
    if (m.night.surge === p.id) uses++;
  }
  return { ...base, uses: Math.min(2, uses) };
}

function closeSwap(m, now) { openActions(m, now); }

function closeActions(m, now) {
  enterPhase(m, 'NIGHT_RESOLVING', now, 0);
  const res = resolveNight(m, rngRef);
  (m.history ||= []).push({ kind: 'night', n: m.night.number, bloodMoon: !!m.night.bloodMoon, arrows: res.arrows, lines: res.lines, died: [...res.deaths, ...res.expired], dreams: { ...m.night.dreams } });
  // Count deathless nights since anyone last died (day deaths reset it too).
  const deadNow = m.players.filter((p) => !p.alive).map((p) => p.id);
  const fresh = deadNow.filter((id) => !(m.deadSnap || []).includes(id));
  m.calm = fresh.length ? 0 : (m.calm ?? 0) + 1;
  m.deadSnap = deadNow;
  for (const p of m.players) p.dreamId = null;
  m.night = null;
  if (victoryOrNull(m, now)) return;
  beginDay(m, now);
}

// ── Public entry points ────────────────────────────────────────────────────
export function hostAdvance(m, rng, now, { skipAll = false } = {}) {
  rngRef = rng;
  if (isMissionPhase(m.phase)) { missionAdvance(m, rng, now); return; }
  switch (m.phase) {
    case 'NIGHT_0_REVEAL': pub(m, 'Night 0 ends.', 'phase'); beginDay(m, now); break;
    case 'DAY_PREP': closeMorning(m, now); break;
    case 'DAY_DISCUSSION': closeDiscussion(m, now); break;
    case 'DAY_DEFENSE': advanceDefense(m, now, skipAll); break;
    case 'DAY_VOTING': resolveDay(m, now); break;
    case 'DAY_RESOLVING': resolveRetaliation(m, now); break;
    case 'NIGHT_DREAM_SWAP': closeSwap(m, now); break;
    case 'NIGHT_ACTIONS': closeActions(m, now); break;
    default: throw new GameError('Nothing to advance.');
  }
}

/** Called by the server when `m.deadline` passes. Missing input becomes PASS / ABSTAIN. */
export function onDeadline(m, rng, now) {
  if (!m.deadline || now < m.deadline) return false;
  hostAdvance(m, rng, now);
  return true;
}

export function extendDeadline(m, seconds, now) {
  if (!m.deadline) throw new GameError('This phase has no timer.');
  if (now >= m.deadline) throw new GameError('The window has already closed.');
  m.deadline += seconds * 1000;
  pub(m, ['The host extended the timer by {n}s.', { n: seconds }], 'host');
  bump(m);
}

export function abortMatch(m, now) {
  if (m.phase === 'LOBBY' || m.phase === 'ENDED') throw new GameError('No match in progress.');
  endMatch(m, { winner: 'ABORTED', reason: 'No faction is awarded a win.' }, now);
}

export function rematch(m) {
  if (m.phase !== 'ENDED') throw new GameError('Finish the current match first.');
  const keep = m.players.map((p) => ({ id: p.id, name: p.name, seat: p.seat, connected: p.connected }));
  const fresh = newMatch({ id: m.id, code: m.code, hostId: m.hostId, moderated: m.moderated });
  Object.assign(m, { ...fresh, settings: m.settings, stateVersion: m.stateVersion + 1, phaseSeq: m.phaseSeq + 1 });
  m.phaseId = `LOBBY:${m.phaseSeq}`;
  for (const k of keep) {
    const p = addPlayer(m, k);
    p.connected = k.connected;
  }
}

/** Player command dispatcher. Throws GameError for anything illegal. */
export function playerCommand(m, actorId, cmd, rng, now) {
  rngRef = rng;
  const p = byId(m, actorId);
  if (!p) throw new GameError('You are not seated in this match.', 'AUTH');
  const { type, payload = {} } = cmd;
  if (type !== 'chat.send' && type !== 'lobby.ready' && cmd.phaseId && cmd.phaseId !== m.phaseId) {
    throw new GameError('That window has closed.', 'STALE');
  }
  if (type.startsWith('m.')) {
    if (!m.M || !isMissionPhase(m.phase)) throw new GameError('That window has closed.', 'STALE');
    missionCommand(m, p, type, payload, rng, now);
    return;
  }
  switch (type) {
    case 'lobby.ready':
      if (m.phase !== 'LOBBY') throw new GameError('Not in the lobby.');
      p.ready = !!payload.ready; break;

    case 'lobby.avatar': {
      if (m.phase !== 'LOBBY') throw new GameError('Not in the lobby.');
      const a = cleanAvatar(payload.avatar);
      if (!a) throw new GameError('Invalid portrait.');
      p.avatar = a;
      break;
    }

    case 'role.ack':
      need(m, 'NIGHT_0_REVEAL');
      p.acknowledged = true;
      if (m.players.every((x) => x.acknowledged)) { pub(m, 'Everyone has seen their role.', 'phase'); beginDay(m, now); }
      break;

    case 'dream.swap': {
      need(m, 'NIGHT_DREAM_SWAP');
      mustLive(m, p);
      const N = m.night;
      if (N.initialSnatchers.includes(p.id) && payload.target !== undefined) {
        if (payload.target !== null && (!N.aliveAtOpen.includes(payload.target) || payload.target === p.id)) throw new GameError('Pick another living player.');
        N.swaps[p.id] = payload.target;
      } else {
        throw new GameError('Only a Dream Snatcher can swap dreams.');
      }
      break;
    }

    case 'night.commit': {
      need(m, 'NIGHT_ACTIONS');
      mustLive(m, p);
      const N = m.night;
      const schema = N.schemas[p.id];
      if (payload.nightmare !== undefined && N.dreams[p.id] === 'SHARED_NIGHTMARE') {
        if (payload.nightmare !== null && (!N.aliveAtOpen.includes(payload.nightmare) || payload.nightmare === p.id)) throw new GameError('Pick another living dream partner.');
        if (payload.nightmare) N.nightmare[p.id] = payload.nightmare; else delete N.nightmare[p.id];
      }
      if (schema?.kind === 'death') {
        const targets = validateDeathTargets(m, payload.death ?? N.death.proposals[p.id] ?? []);
        N.death.proposals[p.id] = targets;
        N.death.confirmed[p.id] = targets;
      } else if (payload.uses && schema && !schema.blocked && schema.kind !== 'chat') {
        N.actions[p.id] = { uses: validateUses(schema, payload.uses) };
      } else if (payload.pass) {
        delete N.actions[p.id];
      }
      N.done[p.id] = true;
      if (N.aliveAtOpen.every((id) => N.done[id])) closeActions(m, now);
      break;
    }

    case 'night.reopen': {
      need(m, 'NIGHT_ACTIONS');
      mustLive(m, p);
      m.night.done[p.id] = false;
      if (m.night.death?.members.includes(p.id)) delete m.night.death.confirmed[p.id];
      break;
    }

    case 'death.propose': {
      need(m, 'NIGHT_ACTIONS');
      mustLive(m, p);
      const D = m.night.death;
      if (!D?.members.includes(p.id)) throw new GameError('You are not on the active Death team.');
      D.proposals[p.id] = validateDeathTargets(m, payload.targets ?? []);
      delete D.confirmed[p.id];
      m.night.done[p.id] = false;
      break;
    }

    case 'conspire.open': {
      need(m, 'NIGHT_ACTIONS');
      mustLive(m, p);
      const schema = m.night.schemas[p.id];
      if (schema?.kind !== 'chat' || schema.blocked) throw new GameError('You cannot open a whisper tonight.');
      if (m.night.conspire[p.id]) throw new GameError('You already chose your partner tonight.');
      if (!schema.targets.includes(payload.target)) throw new GameError('Pick a living player.');
      m.night.conspire[p.id] = payload.target;
      const ch = `consp:${m.nightNumber}:${p.id}`;
      m.chats[ch] = { members: [p.id, payload.target], night: m.nightNumber, kind: 'conspire', messages: [] };
      priv(m, payload.target, 'Someone has opened a private whisper with you. Check your messages.', 'chat');
      break;
    }

    case 'chat.send': sendChat(m, p, payload, now); break;

    case 'day.immunity': {
      need(m, 'DAY_PREP');
      mustLive(m, p);
      if (p.roleId !== 'DIPLOMAT' || !(p.charges.DIPLOMAT > 0)) throw new GameError('You have no immunity to declare.');
      p.charges.DIPLOMAT = 0;
      m.day.immune.push(p.id);
      pub(m, ['{a} has declared diplomatic immunity: they cannot be nominated today.', { a: p.name }], 'immunity', { ev: 'immunity', who: p.id });
      break;
    }

    case 'day.shoot': {
      need(m, 'DAY_PREP');
      mustLive(m, p);
      if (p.roleId !== 'VIGILANTE' || !(p.charges.VIGILANTE > 0) || p.alignment === 'DEATH') throw new GameError('You have no shot to take.');
      const t = byId(m, payload.target);
      if (payload.target === null) { delete m.day.shots[p.id]; break; }
      if (!t || !t.alive || t.id === p.id) throw new GameError('Pick another living player.');
      m.day.shots[p.id] = t.id;
      break;
    }

    case 'day.nominate': {
      need(m, 'DAY_DISCUSSION');
      mustLive(m, p);
      const t = byId(m, payload.target);
      if (!t || !t.alive) throw new GameError('You can only nominate a living player.');
      if (t.id === p.id && !m.settings.selfNomination) throw new GameError('You cannot nominate yourself.');
      if (m.day.immune.includes(t.id)) throw new GameError(['{b} has diplomatic immunity today.', { b: t.name }]);
      if (m.day.nominations.some((x) => x.by === p.id)) throw new GameError('You have already made your nomination today.');
      m.day.nominations.push({ by: p.id, target: t.id, at: now });
      const first = m.day.nominations.filter((x) => x.target === t.id).length === 1;
      pub(m, [first ? '{a} nominated {b}.' : '{a} seconded the nomination of {b}.', { a: p.name, b: t.name }], 'nominate', { ev: 'nominate', by: p.id, target: t.id, first });
      break;
    }

    case 'day.ballot': {
      need(m, 'DAY_VOTING');
      const d = m.day;
      const choice = payload.target;
      const list = nominees(m);
      if (d.eligibleVoters.includes(p.id) && p.alive) {
        if (choice !== 'ABSTAIN' && !list.includes(choice)) throw new GameError('That player is not on the ballot.');
        if (choice === p.id && !m.settings.selfVote) throw new GameError('Self-votes are disabled in this room.');
        d.ballots[p.id] = choice;
      } else if (d.ghostVoters.includes(p.id) && !p.alive) {
        if (choice !== 'ABSTAIN' && !list.includes(choice)) throw new GameError('That player is not on the ballot.');
        d.ghostBallots[p.id] = choice;
      } else {
        throw new GameError(p.alive ? 'Voting is disabled for you today.' : 'The dead do not vote.');
      }
      break;
    }

    case 'day.retaliate': {
      need(m, 'DAY_RESOLVING');
      const r = m.day.retaliation;
      if (!r || r.actorId !== p.id) throw new GameError('This choice is not yours.');
      if (payload.target !== null && !r.targets.includes(payload.target)) throw new GameError('Pick a living non-Death player.');
      r.choice = payload.target;
      resolveRetaliation(m, now);
      break;
    }

    default:
      throw new GameError('Unknown command.');
  }
  bump(m);
}

function need(m, phase) {
  if (m.phase !== phase) throw new GameError('That window is not open.', 'STALE');
}
function mustLive(m, p) {
  if (!p.alive) throw new GameError('The dead cannot act.');
  if (isNightPhase(m.phase) && !m.night.aliveAtOpen.includes(p.id)) throw new GameError('You returned too late to act tonight.');
}

function validateDeathTargets(m, targets) {
  const D = m.night.death;
  if (!Array.isArray(targets)) throw new GameError('Invalid targets.');
  const uniq = [...new Set(targets)];
  if (uniq.length > D.capacity) throw new GameError(['Your team can take at most {n} tonight.', { n: D.capacity }]);
  for (const t of uniq) {
    if (!m.night.aliveAtOpen.includes(t) || D.members.includes(t)) throw new GameError('Pick living players outside your team.');
  }
  return uniq;
}

function validateUses(schema, uses) {
  if (!Array.isArray(uses) || uses.length === 0) throw new GameError('Choose a target or pass.');
  if (uses.length > schema.uses) throw new GameError(['You can act {n} time(s) tonight.', { n: schema.uses }]);
  const out = [];
  const seen = new Set();
  for (const u of uses) {
    const o = {};
    if (schema.kind === 'target' || schema.kind === 'dead') {
      if (!schema.targets.includes(u.target)) throw new GameError('That target is not available.');
      if (seen.has(u.target)) throw new GameError('Use a different target for your second action.');
      seen.add(u.target);
      o.target = u.target;
    }
    if (schema.options) {
      if (!schema.options.some((x) => x.id === u.option)) throw new GameError('Choose an option.');
      o.option = u.option;
    }
    out.push(o);
  }
  return out;
}

// ── Chat channels ──────────────────────────────────────────────────────────
export function chatChannels(m, p) {
  const out = [];
  if (!p || m.phase === 'LOBBY' || m.phase === 'ENDED') return out;
  const remote = m.settings.transport === 'remote';
  const muted = p.statuses.some((s) => s.type === 'MUTE');
  const inDay = isDayPhase(m.phase) || (isMissionPhase(m.phase) && !['M_REVEAL', 'M_NIGHT'].includes(m.phase));
  if (remote && inDay) {
    if (hasRule(m, 'FOG_OF_WAR')) {
      const seats = [...m.players].sort((a, b) => a.seat - b.seat);
      const n = seats.length;
      const left = seats[(p.seat - 1 + n) % n];
      const right = seats[(p.seat + 1) % n];
      for (const nb of [left, right]) {
        const pair = [p.seat, nb.seat].sort((a, b) => a - b);
        out.push({ id: `fog:${pair[0]}-${pair[1]}`, label: ['Whisper · {name}', { name: nb.name }], canSend: p.alive && !muted && nb.alive, members: [p.id, nb.id] });
      }
    } else {
      out.push({ id: 'table', label: 'Table', canSend: p.alive && !muted, members: null });
    }
  }
  if (m.phase === 'NIGHT_ACTIONS' && m.night) {
    if (m.night.death?.members.includes(p.id)) out.push({ id: `death:${m.nightNumber}`, label: 'Death room', canSend: true, members: m.night.death.members });
    for (const [ch, c] of Object.entries(m.chats)) {
      if (c.kind === 'conspire' && c.night === m.nightNumber && c.members.includes(p.id)) {
        const other = c.members.find((x) => x !== p.id);
        out.push({ id: ch, label: c.members[0] === p.id ? ['Whisper · {name}', { name: nameOf(m, other) }] : 'Whisper · Stranger', canSend: true, members: c.members });
      }
    }
  }
  return out;
}

function sendChat(m, p, payload, now) {
  const text = String(payload.text ?? '').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').trim().slice(0, MAX_CHAT);
  if (!text) throw new GameError('Say something first.');
  const ch = chatChannels(m, p).find((c) => c.id === payload.channel);
  if (!ch) throw new GameError('That channel is not open to you.');
  if (!ch.canSend) throw new GameError(p.statuses.some((s) => s.type === 'MUTE') ? 'You are muted today.' : 'You cannot speak here.');
  const c = (m.chats[ch.id] ||= { members: ch.members, kind: ch.id.split(':')[0], messages: [] });
  const mine = c.messages.filter((x) => x.from === p.id && now - x.ts < 10000).length;
  if (mine >= 5) throw new GameError('Slow down.');
  if (c.kind === 'conspire' && c.messages.filter((x) => x.from === p.id).length >= 12) throw new GameError('The whisper is spent for tonight.');
  c.messages.push({ from: p.id, text, ts: now, at: m.phaseId });
  if (c.messages.length > 300) c.messages.splice(0, c.messages.length - 300);
}

export { ballotWeight };
