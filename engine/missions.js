// Dead Set: Missions — the rules engine for the team-and-sabotage mode.
// The full rules are in MISSIONS.md; this file implements them. Like the base
// engine it is pure state-in / state-out over the plain match object, and all
// randomness goes through the injected rng (labels: 'deal', 'leader', 'mcard',
// 'mshuffle', 'clue', 'coin', 'mrandom').
import {
  ROLES, MISSION_DEATH, MISSION_SIZES, MISSION_CARDS, SPECIAL_MISSION_CARDS, MISSION_CARD_ODDS,
  MISSION_PROPOSALS, CLUE_ODDS, missionFailsNeeded, PRESETS,
} from './content.js';
import { missionDeck, drawScenario } from './setup.js';
import { GameError, byId, nameOf, pub, priv } from './state.js';
import { shuffle, pick } from './rng.js';

export const M_PHASES = ['M_REVEAL', 'M_LOTTERY', 'M_PROPOSE', 'M_VOTE', 'M_MISSION', 'M_RESULT', 'M_NIGHT', 'M_LAST_STAND', 'M_RECKONING'];
export const isMissionPhase = (phase) => M_PHASES.includes(phase);
/** Seconds the result stays up so every screen can play the card reveal. */
export const RESULT_SECONDS = (cards) => 7 + Math.ceil(cards * 1.4);
const CANDLE_AFTER = [1, 2, 3]; // after missions 2, 3 and 4 (0-based indices)
/** The first-leader lottery runs this long before the first mission opens. */
export const LOTTERY_SECONDS = 9;

const T = (m, key) => m.settings.timers?.[key] || 0;
const bump = (m) => { m.stateVersion++; };
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
const isDeath = (m, id) => byId(m, id)?.alignment === 'DEATH';
const roleOf = (m, id) => byId(m, id)?.roleId;
const reaperId = (m) => m.players.find((p) => p.roleId === 'REAPER')?.id ?? null;

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.M?.mission ?? 0}:${m.M?.attempt ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

// ── Start ──────────────────────────────────────────────────────────────────
export function startMissions(m, rng, now, { forceRoles = null } = {}) {
  const n = m.players.length;
  let assignment;
  if (forceRoles) assignment = m.players.map((p, i) => forceRoles[i]);
  else if (m.moderated && Object.keys(m.manualRoles).length === n) assignment = m.players.map((p) => m.manualRoles[p.id]);
  else assignment = shuffle(rng, missionDeck(n, m.settings), 'deal');
  if (assignment.length !== n || assignment.some((r) => ROLES[r]?.set !== 'missions')) throw new GameError('Role assignment failed validation.');
  if (!assignment.includes('MEDIUM') || !assignment.includes('REAPER')) throw new GameError('Missions needs a Medium and a Reaper.');
  m.players.forEach((p, i) => {
    const role = ROLES[assignment[i]];
    Object.assign(p, {
      roleId: role.id, originalRoleId: role.id, alignment: role.alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null,
    });
  });
  m.config = { mode: 'missions', preset: 'missions', missions: true, clues: m.settings.clues !== false, clueOdds: m.settings.clueOdds ?? 1, missionCards: m.settings.missionCards ?? 1, leaderMode: m.settings.leaderMode === 'choose' ? 'choose' : 'next' };
  m.activeRules = [];
  m.scenario = drawScenario(m.settings, rng);
  m.history = [];
  m.publicLog = [];
  m.privateLog = {};
  m.chats = {};
  m.day = null;
  m.night = null;
  m.dayNumber = 0;
  m.nightNumber = 0;
  m.winner = null;
  m.endReason = null;
  const order = seatOrder(m);
  const first = order[rng.int(n, 'leader')];
  const firstIdx = order.indexOf(first);
  m.M = {
    n, sizes: MISSION_SIZES[n], mission: 0, attempt: 1, leader: first,
    card: null, cardsUsed: [], proposal: null, votes: {}, plays: {},
    attempts: [], results: [], score: { S: 0, F: 0 },
    candle: { holder: order[(firstIdx - 1 + n) % n], past: [order[(firstIdx - 1 + n) % n]] }, candleChecks: [],
    haunted: null, night: null, hunches: [], stand: null, reckon: null, unmasked: null, clueCount: {},
  };
  pub(m, ['We are {who}, in {where}, trying to {why}.', { who: m.scenario.who, where: m.scenario.where, why: m.scenario.why }], 'scenario', { ev: 'scenario' });
  pub(m, 'The expedition gathers. Look only at your own screen.', 'phase', { ev: 'm-start' });
  for (const p of m.players) {
    priv(m, p.id, ['You are {role}.', { role: p.roleId }], 'role');
    const k = knowledge(m, p);
    if (k.death) priv(m, p.id, k.death.length ? ['You see Death in: {names}.', { names: k.death.map((id) => nameOf(m, id)) }] : 'You see no one of Death.', 'medium');
    if (k.teammates) priv(m, p.id, k.teammates.length ? ['Your Death teammates: {names}.', { names: k.teammates.map((id) => nameOf(m, id)) }] : 'You serve Death alone.', 'death');
    if (k.candles) priv(m, p.id, k.candles.length > 1 ? ['Two candles burn for you: {names}. One of them is the Medium.', { names: k.candles.map((id) => nameOf(m, id)) }] : ['The Medium is {b}.', { b: nameOf(m, k.candles[0]) }], 'believer');
  }
  enter(m, 'M_REVEAL', now, 0);
}

/** What a player knows at the start (and keeps knowing). */
export function knowledge(m, p) {
  const out = {};
  const r = p.roleId;
  if (r === 'MEDIUM') out.death = m.players.filter((x) => x.alignment === 'DEATH' && x.roleId !== 'VEILED').map((x) => x.id);
  if (p.alignment === 'DEATH' && r !== 'STRAY') out.teammates = m.players.filter((x) => x.alignment === 'DEATH' && x.id !== p.id && x.roleId !== 'STRAY').map((x) => x.id);
  if (r === 'STRAY') out.teammates = [];
  if (r === 'BELIEVER') out.candles = m.players.filter((x) => x.roleId === 'MEDIUM' || x.roleId === 'CHARLATAN').sort((a, b) => a.seat - b.seat).map((x) => x.id);
  return out;
}

// ── Mission setup ──────────────────────────────────────────────────────────
const baseFails = (m, k = m.M.mission) => missionFailsNeeded(m.M.n, k);
export function teamSize(m, k = m.M.mission, card = m.M.card) {
  let s = m.M.sizes[k];
  if (card === 'EXTRA_HAND') s += 1;
  if (card === 'SKELETON_CREW') s -= 1;
  return Math.max(2, Math.min(m.M.n - 1, s));
}
export function failsNeeded(m, k = m.M.mission, card = m.M.card) {
  if (card === 'BRITTLE') return 1;
  return baseFails(m, k) + (card === 'STEADFAST' ? 1 : 0);
}
const prevTeam = (m) => m.M.results[m.M.results.length - 1]?.team ?? [];
const hauntedNow = (m) => (m.M.haunted && m.M.haunted.mission === m.M.mission ? m.M.haunted.id : null);
const freshNeed = (size) => Math.ceil(size / 2);

/** Can this card apply to mission k (with the current history)? */
export function cardFits(m, id, k = m.M.mission) {
  const n = m.M.n;
  const base = m.M.sizes[k];
  const haunted = m.M.haunted && m.M.haunted.mission === k ? m.M.haunted.id : null;
  switch (id) {
    case 'LANTERN': return !haunted;
    case 'FRESH_FACES': {
      if (k === 0) return false;
      const prev = prevTeam(m);
      const fresh = n - prev.length;
      const avail = n - (haunted ? 1 : 0);
      return fresh >= freshNeed(base) && avail >= base;
    }
    case 'EXTRA_HAND': return base + 1 <= n - 1 - (haunted ? 1 : 0);
    case 'SKELETON_CREW': return base >= 3;
    case 'STEADFAST': return baseFails(m, k) + 1 <= base;
    case 'BRITTLE': return baseFails(m, k) === 2;
    case 'GRAND': return k >= 1 && k <= 3;
    case 'TRAIL': case 'WITNESS': case 'HAUNTED_ROAD': return k <= 3;
    default: return true;
  }
}

function drawCard(m, rng) {
  const odds = MISSION_CARD_ODDS[m.config.missionCards ?? 1] ?? 0;
  let card = 'REGULAR';
  if (odds > 0 && rng.int(100, 'mcard') < odds) {
    const pool = SPECIAL_MISSION_CARDS.filter((id) => !m.M.cardsUsed.includes(id) && cardFits(m, id));
    if (pool.length) { card = pick(rng, pool, 'mcard'); m.M.cardsUsed.push(card); }
  }
  m.M.card = card;
}

function beginMission(m, rng, now) {
  const M = m.M;
  M.attempt = 1;
  M.attempts = [];
  M.proposal = null;
  M.votes = {};
  M.plays = {};
  drawCard(m, rng);
  pub(m, ['Mission {n} of 5. The card: {mcard}.', { n: M.mission + 1, mcard: M.card }], 'mission', { ev: 'm-card', mission: M.mission, card: M.card, size: teamSize(m), fails: failsNeeded(m) });
  openProposal(m, now);
}

const maxAttempts = (m) => (m.M.card === 'SHORT_PATIENCE' ? 3 : MISSION_PROPOSALS);
export const isForced = (m) => m.M.attempt >= maxAttempts(m);

function openProposal(m, now) {
  m.M.proposal = null;
  m.M.votes = {};
  pub(m, ['{a} leads proposal {k} for mission {n}.', { a: nameOf(m, m.M.leader), k: m.M.attempt, n: m.M.mission + 1 }], 'mission', { ev: 'm-leader', leader: m.M.leader, attempt: m.M.attempt, forced: isForced(m) });
  enter(m, 'M_PROPOSE', now, T(m, 'proposal'));
}

function nextLeader(m) {
  const order = seatOrder(m);
  m.M.leader = order[(order.indexOf(m.M.leader) + 1) % order.length];
}

/** Throws unless `team` (+ ward) is a legal proposal for the current mission. */
export function checkTeam(m, team, ward) {
  const M = m.M;
  if (!Array.isArray(team)) throw new GameError('Pick a team.');
  const ids = [...new Set(team)];
  const size = teamSize(m);
  if (ids.length !== team.length || ids.some((id) => !byId(m, id))) throw new GameError('Pick each player once.');
  if (ids.length !== size) throw new GameError(['This mission needs a team of {n}.', { n: size }]);
  const h = hauntedNow(m);
  if (h && ids.includes(h)) throw new GameError(['{b} is haunted and cannot go on this mission.', { b: nameOf(m, h) }]);
  if (M.card === 'LANTERN' && !ids.includes(M.leader)) throw new GameError('Lantern Bearer: the Leader must be on the team.');
  if (M.card === 'FRESH_FACES') {
    const prev = prevTeam(m);
    if (ids.filter((id) => !prev.includes(id)).length < freshNeed(size)) throw new GameError(['Fresh Faces: at least {n} must not have been on the previous mission.', { n: freshNeed(size) }]);
  }
  if (M.card === 'WARD') {
    if (!ward || !ids.includes(ward)) throw new GameError('Ward: name one team member to ward.');
  } else if (ward) throw new GameError('Only the Ward card lets you ward someone.');
  return ids;
}

/** A random legal team (used when a forced proposal times out, and by bots). */
export function randomTeam(m, rng, withLeader = false) {
  const M = m.M;
  const size = teamSize(m);
  const h = hauntedNow(m);
  for (let tries = 0; tries < 200; tries++) {
    let pool = m.players.map((p) => p.id).filter((id) => id !== h);
    let team = [];
    if (M.card === 'LANTERN' || (withLeader && M.leader !== h)) { team.push(M.leader); pool = pool.filter((id) => id !== M.leader); }
    if (M.card === 'FRESH_FACES') {
      const prev = prevTeam(m);
      const fresh = shuffle(rng, pool.filter((id) => !prev.includes(id)), 'mrandom');
      const need = Math.max(0, freshNeed(size) - team.filter((id) => !prev.includes(id)).length);
      team.push(...fresh.slice(0, need));
      pool = pool.filter((id) => !team.includes(id));
    }
    team.push(...shuffle(rng, pool, 'mrandom').slice(0, size - team.length));
    team = team.slice(0, size);
    const ward = M.card === 'WARD' ? team[rng.int(team.length, 'mrandom')] : null;
    try { checkTeam(m, team, ward); return { team, ward }; } catch { /* retry */ }
  }
  throw new GameError('No legal team exists for this mission.');
}

// ── Commands ───────────────────────────────────────────────────────────────
export function missionCommand(m, p, type, payload, rng, now) {
  const M = m.M;
  const need = (phase) => { if (m.phase !== phase) throw new GameError('That window has closed.', 'STALE'); };
  switch (type) {
    case 'm.ack':
      need('M_REVEAL');
      p.acknowledged = true;
      if (m.players.every((x) => x.acknowledged)) openLottery(m, rng, now);
      return;

    case 'm.propose': {
      need('M_PROPOSE');
      if (p.id !== M.leader) throw new GameError('Only the Mission Leader proposes the team.');
      const team = checkTeam(m, payload.team, payload.ward ?? null);
      submitProposal(m, team, payload.ward ?? null, now);
      return;
    }

    case 'm.vote':
      need('M_VOTE');
      M.votes[p.id] = !!payload.approve;
      if (m.players.every((x) => x.id in M.votes)) resolveVote(m, rng, now);
      return;

    case 'm.play': {
      need('M_MISSION');
      if (!M.proposal.team.includes(p.id)) throw new GameError('You are not on this mission.');
      let card = payload.card === 'F' ? 'F' : 'S';
      if (card === 'F' && (p.alignment !== 'DEATH' || M.proposal.ward === p.id)) card = 'S';
      M.plays[p.id] = card;
      if (M.proposal.team.every((id) => id in M.plays)) resolveMission(m, rng, now);
      return;
    }

    case 'm.night': {
      need('M_NIGHT');
      const N = M.night;
      const others = (id) => id && id !== p.id && byId(m, id);
      if (payload.hunch !== undefined) {
        if (payload.hunch !== null && !others(payload.hunch)) throw new GameError('Pick another player.');
        N.hunch[p.id] = payload.hunch;
      }
      if (payload.candle !== undefined && N.needs.candle === p.id) {
        if (!others(payload.candle) || M.candle.past.includes(payload.candle)) throw new GameError('The Candle can only go to someone who has never held it.');
        N.candle = payload.candle;
      }
      if (payload.witness !== undefined && N.needs.witness === p.id) {
        if (!N.team.includes(payload.witness) || payload.witness === p.id) throw new GameError('Pick another member of the team.');
        N.witness = payload.witness;
      }
      if (payload.haunt !== undefined && N.needs.haunt === p.id) {
        if (!N.team.includes(payload.haunt) || payload.haunt === p.id) throw new GameError('Pick another member of the team.');
        N.haunt = payload.haunt;
      }
      if (payload.lantern !== undefined && N.needs.lantern === p.id) {
        if (!lanternTargets(m).includes(payload.lantern)) throw new GameError('The lantern can only go to someone who has not led a mission yet.');
        N.lantern = payload.lantern;
      }
      if (payload.done) {
        if (N.needs.lantern === p.id && !N.lantern && lanternTargets(m).length) throw new GameError('Choose the next leader first.');
        if (N.needs.candle === p.id && !N.candle) throw new GameError('Use the Candle first.');
        if (N.needs.witness === p.id && !N.witness) throw new GameError('Choose whose card to see first.');
        if (N.needs.haunt === p.id && !N.haunt) throw new GameError('Choose who is haunted first.');
        if (!N.hunch[p.id]) throw new GameError('Pick your hunch first.');
        N.done[p.id] = true;
      }
      if (m.players.every((x) => N.done[x.id])) closeNight(m, rng, now);
      return;
    }

    case 'm.accuse':
      need('M_LAST_STAND');
      if (!byId(m, payload.target) || payload.target === p.id) throw new GameError('Pick another player.');
      M.stand.votes[p.id] = payload.target;
      if (m.players.every((x) => x.id in M.stand.votes)) resolveStand(m, rng, now);
      return;

    case 'm.suggest':
      need('M_RECKONING');
      if (p.alignment !== 'DEATH') throw new GameError('Only Death takes part in the Reckoning.');
      if (!reckonTargets(m).includes(payload.target)) throw new GameError('Pick a player who is not Death.');
      M.reckon.suggestions[p.id] = payload.target;
      return;

    case 'm.reckon':
      need('M_RECKONING');
      if (p.roleId !== 'REAPER') throw new GameError('Only the Reaper names the Medium.');
      if (!reckonTargets(m).includes(payload.target)) throw new GameError('Pick a player who is not Death.');
      finishReckoning(m, payload.target, now);
      return;

    default: throw new GameError('Unknown command.');
  }
}

/** Before the first mission: a dramatic draw for who carries the lantern first. */
function openLottery(m, rng, now) {
  const order = seatOrder(m);
  // The draw is already made; the spin shown on every screen just lands on it.
  pub(m, ['The lantern is passed around the table… it stops at {a}.', { a: nameOf(m, m.M.leader) }], 'phase', { ev: 'm-lottery', leader: m.M.leader, order, spins: 2 + rng.int(2, 'mrandom') });
  enter(m, 'M_LOTTERY', now, LOTTERY_SECONDS);
}

function startFirstMission(m, rng, now) {
  pub(m, ['{a} carries the lantern first. {b} holds the Candle.', { a: nameOf(m, m.M.leader), b: nameOf(m, m.M.candle.holder) }], 'phase', { ev: 'm-begin' });
  beginMission(m, rng, now);
}

function submitProposal(m, team, ward, now) {
  const M = m.M;
  M.proposal = { team, ward, leader: M.leader, attempt: M.attempt, forced: isForced(m) };
  M.votes = {};
  pub(m, ['{a} proposes {names}.', { a: nameOf(m, M.leader), names: team.map((id) => nameOf(m, id)) }], 'mission',
    { ev: 'm-propose', leader: M.leader, team, ward, attempt: M.attempt, forced: isForced(m) });
  if (ward) pub(m, ['{b} is warded: their card will be Succeed.', { b: nameOf(m, ward) }], 'mission', { ev: 'm-ward', target: ward });
  enter(m, 'M_VOTE', now, T(m, 'teamVote'));
}

function resolveVote(m, rng, now) {
  const M = m.M;
  for (const p of m.players) if (!(p.id in M.votes)) M.votes[p.id] = true; // missing → Approve
  const approve = Object.values(M.votes).filter(Boolean).length;
  const reject = m.players.length - approve;
  const approved = approve * 2 > m.players.length;
  const forced = isForced(m);
  const masked = M.card === 'MASKED_VOTE';
  const goes = approved || forced;
  M.attempts.push({ ...M.proposal, votes: masked ? null : { ...M.votes }, approve, reject, approved, goes });
  pub(m, [goes ? (approved ? 'The team is approved ({a}–{r}).' : 'Rejected ({a}–{r}), but this proposal goes ahead regardless.') : 'The team is rejected ({a}–{r}).', { a: approve, r: reject }], 'vote',
    { ev: 'm-votes', votes: masked ? null : { ...M.votes }, approve, reject, approved, forced, goes, team: M.proposal.team, attempt: M.attempt });
  if (goes) {
    M.plays = {};
    enter(m, 'M_MISSION', now, T(m, 'mission'));
    pub(m, ['The team sets out: {names}.', { names: M.proposal.team.map((id) => nameOf(m, id)) }], 'mission', { ev: 'm-go', team: M.proposal.team });
    return;
  }
  M.attempt++;
  nextLeader(m);
  openProposal(m, now);
}

function resolveMission(m, rng, now) {
  const M = m.M;
  const team = M.proposal.team;
  for (const id of team) if (!(id in M.plays)) M.plays[id] = 'S';
  const cards = shuffle(rng, team.map((id) => M.plays[id]), 'mshuffle');
  const fails = cards.filter((c) => c === 'F').length;
  const need = failsNeeded(m);
  const failed = fails >= need;
  const weight = M.card === 'GRAND' ? 2 : 1;
  const smoke = M.card === 'SMOKE';
  if (failed) M.score.F += weight; else M.score.S += weight;
  const result = {
    mission: M.mission, card: M.card, team, ward: M.proposal.ward, leader: M.proposal.leader, size: team.length, need,
    attempts: M.attempts, plays: { ...M.plays }, cards: smoke ? null : cards, fails: smoke ? null : fails, failed, weight,
  };
  M.results.push(result);
  pub(m, [failed ? (smoke ? 'Mission {n} failed.' : 'Mission {n} failed: {f} Sabotage.') : (smoke ? 'Mission {n} succeeded.' : 'Mission {n} succeeded: {f} Sabotage.'), { n: M.mission + 1, f: fails }], failed ? 'death' : 'mission',
    { ev: 'm-result', mission: M.mission, cards: smoke ? null : cards, count: team.length, fails: smoke ? null : fails, need, failed, weight, card: M.card, score: { ...M.score } });
  M.proposal = { ...M.proposal };
  enter(m, 'M_RESULT', now, RESULT_SECONDS(team.length));
}

function afterResult(m, rng, now) {
  const M = m.M;
  if (M.score.S >= 3) return openReckoning(m, now, 'missions');
  if (M.score.F >= 3) return openStand(m, now);
  openNight(m, now);
}

// ── Night interlude ────────────────────────────────────────────────────────
function openNight(m, now) {
  const M = m.M;
  const r = M.results[M.results.length - 1];
  m.nightNumber++;
  M.night = {
    mission: r.mission, team: r.team, done: {}, hunch: {}, candle: null, witness: null, haunt: null, lantern: null,
    needs: {
      lantern: m.config.leaderMode === 'choose' ? r.leader : null,
      candle: CANDLE_AFTER.includes(r.mission) ? M.candle.holder : null,
      witness: r.card === 'WITNESS' ? r.leader : null,
      haunt: r.card === 'HAUNTED_ROAD' && r.failed ? reaperId(m) : null,
    },
  };
  // The Candle only matters while someone new can still receive it.
  if (M.night.needs.candle && !m.players.some((p) => !M.candle.past.includes(p.id))) M.night.needs.candle = null;
  pub(m, 'Night falls on the expedition.', 'phase', { ev: 'm-night', n: m.nightNumber });
  enter(m, 'M_NIGHT', now, T(m, 'interlude'));
}

function closeNight(m, rng, now) {
  const M = m.M;
  const N = M.night;
  for (const [pid, t] of Object.entries(N.hunch)) if (t) M.hunches.push({ mission: N.mission, pid, target: t });
  if (N.needs.candle) {
    const holder = N.needs.candle;
    let target = N.candle;
    if (!target) {
      priv(m, holder, 'The Candle burned down unused tonight.');
      pub(m, ['{a} kept the Candle to themselves tonight.', { a: nameOf(m, holder) }], 'mission', { ev: 'm-candle', by: holder, target: null });
    } else {
      priv(m, holder, [isDeath(m, target) ? 'The Candle shows {b}: Death.' : 'The Candle shows {b}: Living.', { b: nameOf(m, target) }], 'candle', { target, death: isDeath(m, target) });
      pub(m, ['{a} held the Candle to {b}. The Candle passes to {b}.', { a: nameOf(m, holder), b: nameOf(m, target) }], 'mission', { ev: 'm-candle', by: holder, target });
      M.candleChecks.push({ by: holder, target, mission: N.mission, death: isDeath(m, target) });
      M.candle.holder = target;
      M.candle.past.push(target);
    }
  }
  if (N.needs.witness && N.witness) {
    const card = M.results[M.results.length - 1].plays[N.witness];
    priv(m, N.needs.witness, [card === 'F' ? 'Witness: {b} played Sabotage on mission {n}.' : 'Witness: {b} played Succeed on mission {n}.', { b: nameOf(m, N.witness), n: N.mission + 1 }], 'witness');
    pub(m, ['{a} watched {b}\'s card.', { a: nameOf(m, N.needs.witness), b: nameOf(m, N.witness) }], 'mission', { ev: 'm-witness', by: N.needs.witness, target: N.witness });
  }
  if (N.needs.haunt) {
    const target = N.haunt ?? pick(rng, N.team.filter((id) => id !== N.needs.haunt), 'mrandom');
    if (target) {
      M.haunted = { mission: N.mission + 1, id: target };
      pub(m, ['{b} is haunted and cannot go on the next mission.', { b: nameOf(m, target) }], 'death', { ev: 'm-haunt', target });
    }
  }
  // Clues: the lobby's odds, plus the Trail card.
  const r = M.results[M.results.length - 1];
  const living = m.players.filter((p) => p.alignment !== 'DEATH' && p.roleId !== 'MEDIUM').map((p) => p.id);
  const getters = [];
  if (m.config.clues && rng.int(100, 'clue') < (CLUE_ODDS[m.config.clueOdds] ?? 0)) getters.push(...shuffle(rng, living, 'clue').slice(0, 2));
  if (r.card === 'TRAIL' && !r.failed) {
    const onTeam = r.team.filter((id) => living.includes(id) && !getters.includes(id));
    if (onTeam.length) getters.push(pick(rng, onTeam, 'clue'));
  }
  for (const id of getters) {
    const clue = missionClue(m, id, rng);
    if (clue) { priv(m, id, clue, 'clue'); M.clueCount[id] = (M.clueCount[id] || 0) + 1; }
  }
  // Who leads next: the last leader's choice, or simply the next in line.
  const chooser = N.needs.lantern;
  M.night = null;
  pub(m, 'Dawn. The expedition moves on.', 'phase', { ev: 'm-dawn' });
  M.mission++;
  if (chooser) {
    const pool = lanternTargets(m, chooser);
    let next = N.lantern && pool.includes(N.lantern) ? N.lantern : null;
    if (!next) {
      // Not chosen in time: the lantern goes to the next eligible player in line.
      const order = seatOrder(m);
      const i = order.indexOf(chooser);
      next = [...order.slice(i + 1), ...order.slice(0, i)].find((id) => pool.includes(id)) ?? null;
    }
    if (next) {
      M.leader = next;
      pub(m, [N.lantern ? '{a} hands the lantern to {b}.' : '{a} chose no one in time. The lantern passes to {b}.', { a: nameOf(m, chooser), b: nameOf(m, next) }], 'mission', { ev: 'm-lantern', by: chooser, to: next, chosen: !!N.lantern });
    } else nextLeader(m);
  } else nextLeader(m);
  beginMission(m, rng, now);
}

/** Who may be handed the lantern: anyone who has not led a mission that went ahead. */
export function lanternTargets(m, chooser = m.M.night?.needs.lantern) {
  const led = new Set(m.M.results.map((r) => r.leader));
  const pool = m.players.map((p) => p.id).filter((id) => id !== chooser && !led.has(id));
  return pool;
}

/** One true clue for `forId`, or null. */
export function missionClue(m, forId, rng) {
  const death = m.players.filter((p) => p.alignment === 'DEATH').map((p) => p.id);
  const others = m.players.filter((p) => p.alignment !== 'DEATH' && p.id !== forId).map((p) => p.id);
  const order = seatOrder(m);
  const n = order.length;
  const near = (id) => [-2, -1, 1, 2].map((d) => order[(order.indexOf(id) + d + n) % n]);
  const kinds = [];
  if (death.length && others.length) kinds.push('pair');
  if (others.length) kinds.push('clear');
  const nearIds = m.players.map((p) => p.id).filter((id) => id !== forId && near(id).some((x) => death.includes(x)));
  if (nearIds.length) kinds.push('near');
  if (m.M.results.length) kinds.push('mission');
  if (!kinds.length) return null;
  switch (pick(rng, kinds, 'clue')) {
    case 'pair': {
      const pair = shuffle(rng, [pick(rng, death, 'clue'), pick(rng, others, 'clue')], 'clue');
      return ['Clue: one of {a} and {b} walks with Death.', { a: nameOf(m, pair[0]), b: nameOf(m, pair[1]) }];
    }
    case 'clear': return ['Clue: {b} is not Death-aligned.', { b: nameOf(m, pick(rng, others, 'clue')) }];
    case 'near': return ['Clue: someone seated within two seats of {b} walks with Death.', { b: nameOf(m, pick(rng, nearIds, 'clue')) }];
    default: {
      const r = pick(rng, m.M.results, 'clue');
      return [r.team.some((id) => death.includes(id)) ? 'Clue: Death had someone on mission {n}.' : 'Clue: nobody from Death went on mission {n}.', { n: r.mission + 1 }];
    }
  }
}

// ── The end ────────────────────────────────────────────────────────────────
function openStand(m, now) {
  m.M.stand = { votes: {}, named: null };
  pub(m, 'Three missions have failed. The Last Stand: name one player you believe is Death.', 'phase', { ev: 'm-stand' });
  enter(m, 'M_LAST_STAND', now, T(m, 'lastStand'));
}

function resolveStand(m, rng, now) {
  const S = m.M.stand;
  const tally = {};
  for (const t of Object.values(S.votes)) tally[t] = (tally[t] || 0) + 1;
  const top = Math.max(0, ...Object.values(tally));
  let tied = Object.keys(tally).filter((id) => tally[id] === top);
  if (!tied.length) tied = m.players.map((p) => p.id);
  let named = tied[0];
  if (tied.length > 1) {
    named = tied[rng.int(tied.length, 'coin')];
    pub(m, ['The Last Stand is tied. A coin is tossed between {names}… it falls for {name}.', { names: tied.map((id) => nameOf(m, id)), name: nameOf(m, named) }], 'vote', { ev: 'coinflip', tied, winner: named });
  }
  S.named = named;
  S.tally = tally;
  const caught = isDeath(m, named);
  pub(m, [caught ? 'The table names {b}, and {b} walks with Death!' : 'The table names {b}, but {b} is one of the Living.', { b: nameOf(m, named) }], caught ? 'mission' : 'death',
    { ev: 'm-named', target: named, death: caught, tally, role: caught ? null : byId(m, named).roleId });
  if (!caught) return endMissions(m, { winner: 'DEATH', reason: 'The Last Stand named one of the Living. Death holds the expedition.' }, now);
  openReckoning(m, now, 'stand');
}

export const reckonTargets = (m) => m.players.filter((p) => p.alignment !== 'DEATH').map((p) => p.id);

function openReckoning(m, now, from) {
  const M = m.M;
  M.reckon = { from, suggestions: {}, target: null };
  M.unmasked = m.players.filter((p) => p.alignment === 'DEATH').map((p) => p.id);
  pub(m, [from === 'stand' ? 'Death is caught, but not beaten. Death unmasks: {names}. Now they hunt the Medium.' : 'Three missions succeed. Death unmasks: {names}. Now they hunt the Medium.', { names: M.unmasked.map((id) => nameOf(m, id)) }], 'phase', { ev: 'm-unmask', ids: M.unmasked, from });
  enter(m, 'M_RECKONING', now, T(m, 'reckoning'));
}

function reckonFallback(m, rng) {
  const R = m.M.reckon;
  const counts = {};
  for (const t of Object.values(R.suggestions)) counts[t] = (counts[t] || 0) + 1;
  const top = Math.max(0, ...Object.values(counts));
  const best = Object.keys(counts).filter((id) => counts[id] === top);
  if (best.length === 1) return best[0];
  const mine = R.suggestions[reaperId(m)];
  if (mine && best.includes(mine)) return mine;
  return pick(rng, best.length ? best : reckonTargets(m), 'mrandom');
}

function finishReckoning(m, target, now) {
  const M = m.M;
  M.reckon.target = target;
  const medium = m.players.find((p) => p.roleId === 'MEDIUM').id;
  const hit = target === medium;
  pub(m, [hit ? 'The Reaper names {b}, and {b} is the Medium.' : 'The Reaper names {b}, but the Medium was {c}.', { b: nameOf(m, target), c: nameOf(m, medium) }], hit ? 'death' : 'mission',
    { ev: 'm-reckon', target, medium, hit, role: byId(m, target).roleId });
  endMissions(m, hit
    ? { winner: 'DEATH', reason: 'Death found the Medium.' }
    : { winner: 'NON_DEATH', reason: M.reckon.from === 'stand' ? 'The Living caught Death in the Last Stand, and the Medium stayed hidden.' : 'Three missions succeeded, and the Medium stayed hidden.' }, now);
}

function endMissions(m, result, now) {
  m.winner = result.winner;
  m.endReason = result.reason;
  pub(m, ['{label} {reason}', { label: [result.winner === 'DEATH' ? 'Death wins.' : 'The Living win.', {}], reason: [result.reason, {}] }], 'end', { ev: 'end', winner: result.winner, reason: result.reason });
  enter(m, 'ENDED', now, 0);
}

// ── Host / timers ──────────────────────────────────────────────────────────
export function missionAdvance(m, rng, now) {
  const M = m.M;
  switch (m.phase) {
    case 'M_REVEAL': pub(m, 'The host starts the first mission.', 'phase'); openLottery(m, rng, now); break;
    case 'M_LOTTERY': startFirstMission(m, rng, now); break;
    case 'M_PROPOSE':
      if (isForced(m)) {
        const { team, ward } = randomTeam(m, rng, true);
        pub(m, ['Time ran out. A team is drawn for {a}.', { a: nameOf(m, M.leader) }], 'mission');
        submitProposal(m, team, ward, now);
      } else {
        M.attempts.push({ leader: M.leader, team: null, attempt: M.attempt, approved: false, goes: false, skipped: true });
        pub(m, ['{a} did not propose in time. Leadership passes on.', { a: nameOf(m, M.leader) }], 'mission', { ev: 'm-skip', leader: M.leader });
        M.attempt++;
        nextLeader(m);
        openProposal(m, now);
      }
      break;
    case 'M_VOTE': resolveVote(m, rng, now); break;
    case 'M_MISSION': resolveMission(m, rng, now); break;
    case 'M_RESULT': afterResult(m, rng, now); break;
    case 'M_NIGHT': closeNight(m, rng, now); break;
    case 'M_LAST_STAND': resolveStand(m, rng, now); break;
    case 'M_RECKONING': finishReckoning(m, M.reckon.target ?? reckonFallback(m, rng), now); break;
    default: throw new GameError('Nothing to advance.');
  }
}

export const MISSION_ADVANCE_LABEL = {
  M_REVEAL: 'Start the first mission', M_LOTTERY: 'Skip the draw', M_PROPOSE: 'Pass leadership on', M_VOTE: 'Lock the vote', M_MISSION: 'Close the mission',
  M_RESULT: 'Continue', M_NIGHT: 'Bring the dawn', M_LAST_STAND: 'Lock the Last Stand', M_RECKONING: 'Force the Reckoning',
};

// ── Views ──────────────────────────────────────────────────────────────────
/** Public mission state (everything here is safe for everyone). */
export function missionPublic(m) {
  const M = m.M;
  if (!M) return null;
  const card = M.card ? MISSION_CARDS[M.card] : null;
  const showVotes = ['M_VOTE'].includes(m.phase) ? null : undefined;
  return {
    mission: M.mission, attempt: M.attempt, maxAttempts: maxAttempts(m), forced: isForced(m), leader: M.leader,
    sizes: M.sizes.map((s, k) => ({ size: k === M.mission && M.card ? teamSize(m) : s, fails: k === M.mission && M.card ? failsNeeded(m) : missionFailsNeeded(M.n, k) })),
    card: card ? { id: card.id, name: card.name, text: card.text, glyph: card.glyph } : null,
    proposal: M.proposal ? { team: M.proposal.team, ward: M.proposal.ward, leader: M.proposal.leader, forced: M.proposal.forced } : null,
    voted: ['M_VOTE'].includes(m.phase) ? Object.keys(M.votes) : showVotes,
    played: m.phase === 'M_MISSION' ? Object.keys(M.plays) : undefined,
    attempts: M.attempts.map((a) => ({ leader: a.leader, team: a.team, ward: a.ward ?? null, approve: a.approve, reject: a.reject, approved: a.approved, goes: a.goes, votes: a.votes ?? null, skipped: !!a.skipped })),
    results: M.results.map((r) => ({ mission: r.mission, card: r.card, team: r.team, ward: r.ward, leader: r.leader, need: r.need, cards: r.cards, fails: r.fails, failed: r.failed, weight: r.weight,
      attempts: r.attempts.map((a) => ({ leader: a.leader, team: a.team, approve: a.approve, reject: a.reject, approved: a.approved, goes: a.goes, votes: a.votes ?? null, skipped: !!a.skipped })) })),
    score: M.score,
    candle: { holder: M.candle.holder, past: M.candle.past, checks: M.candleChecks.map((c) => ({ by: c.by, target: c.target, mission: c.mission })) },
    haunted: M.haunted && M.haunted.mission === M.mission ? M.haunted.id : null,
    night: M.night ? { done: Object.keys(M.night.done), lantern: M.night.needs.lantern, candle: !!M.night.needs.candle, witness: !!M.night.needs.witness, haunt: !!M.night.needs.haunt } : null,
    stand: M.stand ? { voted: Object.keys(M.stand.votes), named: M.stand.named, tally: M.stand.tally ?? null } : null,
    reckon: M.reckon ? { from: M.reckon.from, target: M.reckon.target } : null,
    unmasked: M.unmasked,
    hunches: m.phase === 'ENDED' ? M.hunches : undefined,
    // aggregate suspicion (counts only, never who placed them) once Death is choosing or the game is over
    hunchHeat: ['M_RECKONING', 'ENDED'].includes(m.phase) ? M.hunches.reduce((o, x) => ({ ...o, [x.target]: (o[x.target] || 0) + 1 }), {}) : undefined,
    cardsUsed: M.cardsUsed,
  };
}

/** What a player may do right now. */
export function missionAction(m, p) {
  const M = m.M;
  switch (m.phase) {
    case 'M_REVEAL': return { type: 'mack', done: p.acknowledged };
    case 'M_LOTTERY': return { type: 'mlottery' };
    case 'M_PROPOSE':
      if (p.id !== M.leader) return { type: 'mwait', leader: M.leader };
      return { type: 'mpropose', size: teamSize(m), ward: M.card === 'WARD', haunted: hauntedNow(m), lantern: M.card === 'LANTERN',
        fresh: M.card === 'FRESH_FACES' ? { need: freshNeed(teamSize(m)), prev: prevTeam(m) } : null };
    case 'M_VOTE': return { type: 'mvote', choice: p.id in M.votes ? M.votes[p.id] : null };
    case 'M_MISSION':
      if (!M.proposal.team.includes(p.id)) return { type: 'mwait' };
      return { type: 'mplay', played: p.id in M.plays, canFail: p.alignment === 'DEATH' && M.proposal.ward !== p.id, warded: M.proposal.ward === p.id };
    case 'M_NIGHT': {
      const N = M.night;
      const a = { type: 'mnight', done: !!N.done[p.id], hunch: N.hunch[p.id] ?? null };
      if (N.needs.candle === p.id) a.candle = { targets: m.players.filter((x) => !M.candle.past.includes(x.id)).map((x) => x.id), choice: N.candle };
      if (N.needs.witness === p.id) a.witness = { targets: N.team.filter((id) => id !== p.id), choice: N.witness };
      if (N.needs.haunt === p.id) a.haunt = { targets: N.team.filter((id) => id !== p.id), choice: N.haunt };
      if (N.needs.lantern === p.id) { const targets = lanternTargets(m); if (targets.length) a.lantern = { targets, choice: N.lantern }; }
      return a;
    }
    case 'M_LAST_STAND': return { type: 'mstand', choice: M.stand.votes[p.id] ?? null, targets: m.players.filter((x) => x.id !== p.id).map((x) => x.id) };
    case 'M_RECKONING':
      if (p.alignment !== 'DEATH') return { type: 'mwait' };
      return { type: 'mreckon', reaper: p.roleId === 'REAPER', targets: reckonTargets(m), suggestions: M.reckon.suggestions, mine: M.reckon.suggestions[p.id] ?? null };
    default: return { type: 'none' };
  }
}

/** Private additions to a player's own view. */
export function missionMe(m, p) {
  if (m.phase === 'LOBBY' || !m.M) return {};
  const k = knowledge(m, p);
  const out = {};
  if (k.death) out.seesDeath = k.death.map((id) => ({ id, name: nameOf(m, id) }));
  if (k.teammates) out.teammates = k.teammates.map((id) => ({ id, name: nameOf(m, id), reaper: roleOf(m, id) === 'REAPER' }));
  if (k.candles) out.candles = k.candles.map((id) => ({ id, name: nameOf(m, id) }));
  if (p.roleId === 'STRAY') out.stray = true;
  out.candleSeen = m.M.candleChecks.filter((c) => c.by === p.id).map((c) => ({ id: c.target, name: nameOf(m, c.target), death: c.death }));
  return out;
}

export function missionSecrets(m) {
  const M = m.M;
  return {
    plays: m.phase === 'M_MISSION' ? M.plays : null,
    votes: m.phase === 'M_VOTE' ? M.votes : null,
    night: M.night ? { hunch: M.night.hunch, lantern: M.night.lantern, candle: M.night.candle, witness: M.night.witness, haunt: M.night.haunt } : null,
    stand: M.stand?.votes ?? null,
    reckon: M.reckon?.suggestions ?? null,
    results: M.results.map((r) => r.plays),
  };
}

export { PRESETS };
