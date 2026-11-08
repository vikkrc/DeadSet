// Audience-filtered views (§20 "Event views"). Every payload sent to a client is
// built here. A player's view only ever contains: public facts, their own
// secrets, and — for active Death members — their teammates. Nothing else.
import { ROLES, DREAMS, RULE_CARDS, PRESETS } from './content.js';
import {
  byId, nameOf, hasRule, deathTeam, upcomingNight, isDayPhase,
} from './state.js';
import { setupReport, nominees, chatChannels, ballotWeight } from './game.js';

const roleCard = (id) => {
  const r = ROLES[id];
  if (!r) return null;
  return { id: r.id, name: r.name, alias: r.alias ?? null, glyph: r.glyph, alignment: r.alignment, when: r.when, summary: r.summary, detail: r.detail };
};

function progress(m) {
  const N = m.night;
  switch (m.phase) {
    case 'LOBBY': return { label: 'ready', done: m.players.filter((p) => p.ready).length, total: m.players.length };
    case 'NIGHT_0_REVEAL': return { label: 'have seen their role', done: m.players.filter((p) => p.acknowledged).length, total: m.players.length };
    case 'NIGHT_ACTIONS': return { label: 'asleep', done: N.aliveAtOpen.filter((id) => N.done[id]).length, total: N.aliveAtOpen.length };
    case 'DAY_VOTING': {
      const d = m.day;
      const ghosts = d.ghostVoters.length ? { ghostDone: Object.keys(d.ghostBallots).length, ghostTotal: d.ghostVoters.length } : {};
      return { label: 'ballots recorded', done: Object.keys(d.ballots).length, total: d.eligibleVoters.length, ...ghosts };
    }
    default: return null;
  }
}

const ADVANCE_LABEL = {
  LOBBY: 'Start match',
  NIGHT_0_REVEAL: 'Force Day 1',
  DAY_PREP: 'Open discussion',
  DAY_DISCUSSION: 'Close nominations',
  DAY_DEFENSE: 'Next defence',
  DAY_VOTING: 'Lock the vote',
  DAY_RESOLVING: 'Skip final act',
  NIGHT_DREAM_SWAP: 'Open night actions now',
  NIGHT_ACTIONS: 'Bring the dawn',
};

export function publicView(m, now = Date.now()) {
  const ended = m.phase === 'ENDED';
  const revealAll = ended && m.settings.endReveal && m.winner !== null;
  const revealDead = m.settings.revealOnDeath && !hasRule(m, 'HIDDEN_ROLES');
  const list = nominees(m);
  const v = {
    code: m.code, phase: m.phase, phaseId: m.phaseId, version: m.stateVersion, rulesVersion: m.rulesVersion,
    dayNumber: m.dayNumber, nightNumber: m.nightNumber, deadline: m.deadline, serverNow: now,
    hostId: m.hostId, moderated: m.moderated,
    preset: m.config?.preset ?? m.settings.preset,
    transport: m.settings.transport,
    table: { threads: !!m.settings.threads, score: m.settings.score !== false, lang: m.settings.lang || 'en' },
    doomsday: m.config?.doomsday ? m.config.doomsdayDays : null,
    scenario: m.scenario, activeRules: m.activeRules.map((id) => RULE_CARDS[id]),
    players: m.players.map((p) => ({
      id: p.id, name: p.name, seat: p.seat, alive: p.alive, connected: p.connected,
      ready: m.phase === 'LOBBY' ? p.ready : undefined,
      revived: !!p.tempRevival, immune: !!m.day?.immune.includes(p.id) && isDayPhase(m.phase),
      diedAt: p.alive ? null : p.diedAt ?? null,
      role: revealAll || (!p.alive && revealDead && m.phase !== 'LOBBY') ? roleCard(p.roleId) : null,
      originalRole: revealAll && p.originalRoleId !== p.roleId ? roleCard(p.originalRoleId) : null,
      alignment: revealAll ? p.alignment : null,
    })),
    progress: progress(m),
    log: m.publicLog.slice(-250),
    winner: m.winner, endReason: m.endReason, jesterId: m.jesterId ?? null,
  };
  if (m.day && isDayPhase(m.phase)) {
    v.day = {
      nominations: m.day.nominations.map((x) => ({ by: x.by, target: x.target })),
      nominees: list,
      defenseIndex: m.day.defenseIndex,
      speaking: m.phase === 'DAY_DEFENSE' ? list[m.day.defenseIndex] ?? null : null,
      majority: hasRule(m, 'MAJORITY_RULE') ? m.day.eligibleVoters.length / 2 : null,
      retaliation: !!m.day.retaliation,
    };
  }
  if (m.phase === 'LOBBY') {
    v.settings = m.settings;
    v.setup = setupReport(m);
    v.presets = Object.values(PRESETS).map((p) => ({ id: p.id, name: p.name, blurb: p.blurb, min: p.min, max: p.max, rulesMin: p.rulesMin, rulesMax: p.rulesMax, ruleIds: p.ruleIds, recommended: !!p.recommended, custom: !!p.custom, pool: p.pool }));
  }
  return v;
}

export function hostControls(m) {
  const c = { advance: null, extend: !!m.deadline, end: m.phase !== 'LOBBY' && m.phase !== 'ENDED', rematch: m.phase === 'ENDED' };
  if (ADVANCE_LABEL[m.phase]) c.advance = ADVANCE_LABEL[m.phase];
  if (m.phase === 'DAY_DEFENSE') {
    const list = nominees(m);
    if (m.day.defenseIndex >= list.length - 1) c.advance = 'Open the vote';
    else c.skipAll = 'Skip to vote';
  }
  return c;
}

/** Private view for one seated player. */
export function playerView(m, pid, now = Date.now()) {
  const p = byId(m, pid);
  const base = publicView(m, now);
  if (!p) return base;
  const started = m.phase !== 'LOBBY';
  const me = {
    id: p.id, name: p.name, seat: p.seat, alive: p.alive, isHost: m.hostId === p.id,
    role: started ? roleCard(p.roleId) : null,
    originalRole: started && p.originalRoleId !== p.roleId ? roleCard(p.originalRoleId) : null,
    alignment: started ? p.alignment : null,
    mimicPowerless: !!p.mimicPowerless,
    charges: p.charges,
    statuses: p.statuses.map((s) => s.type),
    revived: p.tempRevival ? { expiresAfterNight: p.tempRevival.expiresAfterNight } : null,
    acknowledged: p.acknowledged,
    ready: p.ready,
  };
  // Death teammates: only for currently active (or about-to-be-active) members.
  if (started && p.alive && p.alignment === 'DEATH' && p.teamJoinNight != null && p.teamJoinNight <= upcomingNight(m)) {
    me.teammates = deathTeam(m).filter((x) => x.id !== p.id).map((x) => ({ id: x.id, name: x.name }));
  } else if (started && p.alignment === 'DEATH' && p.alive) {
    me.joinsTeamNight = p.teamJoinNight;
  }
  // Dream (night only; Snatchers see their card during the swap window).
  const N = m.night;
  if (N && m.phase === 'NIGHT_DREAM_SWAP' && N.initialSnatchers.includes(p.id)) me.dream = DREAMS.DREAM_SNATCHER;
  if (N && m.phase === 'NIGHT_ACTIONS' && N.dreams[p.id]) me.dream = DREAMS[N.dreams[p.id]];
  if (N?.sleepwalk[p.id] && m.phase === 'NIGHT_ACTIONS') me.sleepwalkPartner = nameOf(m, N.sleepwalk[p.id]);

  const v = { ...base, me, private: (m.privateLog[p.id] || []).slice(-120), action: actionFor(m, p), chats: chatsFor(m, p) };
  if (me.isHost) v.host = hostControls(m);
  return v;
}

function actionFor(m, p) {
  const N = m.night;
  const d = m.day;
  switch (m.phase) {
    case 'LOBBY': return { type: 'ready', ready: p.ready };
    case 'NIGHT_0_REVEAL': return { type: 'ack', done: p.acknowledged };
    case 'NIGHT_DREAM_SWAP':
      if (!p.alive || !N.aliveAtOpen.includes(p.id)) return { type: 'spectate' };
      return {
        type: 'swap', done: false, snatcher: N.initialSnatchers.includes(p.id),
        targets: N.initialSnatchers.includes(p.id) ? N.aliveAtOpen.filter((id) => id !== p.id) : [],
        choice: N.swaps[p.id] ?? null,
      };
    case 'NIGHT_ACTIONS': {
      if (!p.alive || !N.aliveAtOpen.includes(p.id)) return { type: 'spectate' };
      const schema = N.schemas[p.id];
      const a = { type: 'night', done: !!N.done[p.id], schema: null, submitted: N.actions[p.id]?.uses ?? null };
      if (schema && schema.kind !== 'death') {
        a.schema = { ...schema, role: roleCard(schema.roleId), charges: p.charges[schema.roleId] ?? null };
        if (schema.kind === 'chat') a.conspire = N.conspire[p.id] ?? null;
      }
      if (schema?.kind === 'death') {
        const D = N.death;
        a.death = {
          members: D.members.map((id) => ({ id, name: nameOf(m, id) })),
          capacity: D.capacity,
          proposals: D.proposals,
          confirmed: Object.fromEntries(D.members.map((id) => [id, Array.isArray(D.confirmed[id])])),
          targets: N.aliveAtOpen.filter((id) => !D.members.includes(id)),
          paralysed: N.dreams[p.id] === 'SLEEP_PARALYSIS',
        };
      }
      if (N.dreams[p.id] === 'SHARED_NIGHTMARE') {
        a.nightmare = { targets: N.aliveAtOpen.filter((id) => id !== p.id), choice: N.nightmare[p.id] ?? null };
      }
      return a;
    }
    case 'DAY_PREP': {
      if (!p.alive) return { type: 'spectate' };
      const out = { type: 'morning', abilities: [] };
      if (p.roleId === 'DIPLOMAT' && p.charges.DIPLOMAT > 0) out.abilities.push({ kind: 'immunity' });
      if (p.roleId === 'DIPLOMAT' && d.immune.includes(p.id)) out.abilities.push({ kind: 'immune' });
      if (p.roleId === 'VIGILANTE' && p.charges.VIGILANTE > 0 && p.alignment !== 'DEATH') {
        out.abilities.push({ kind: 'shoot', targets: m.players.filter((x) => x.alive && x.id !== p.id).map((x) => x.id), choice: d.shots[p.id] ?? null });
      }
      return out;
    }
    case 'DAY_DISCUSSION': {
      if (!p.alive) return { type: 'spectate' };
      const mine = d.nominations.find((x) => x.by === p.id);
      return {
        type: 'nominate', mine: mine?.target ?? null,
        targets: m.players.filter((x) => x.alive && (x.id !== p.id || m.settings.selfNomination) && !d.immune.includes(x.id)).map((x) => x.id),
      };
    }
    case 'DAY_DEFENSE': return { type: 'defense' };
    case 'DAY_VOTING': {
      const cands = nominees(m);
      if (p.alive && d.eligibleVoters.includes(p.id)) {
        return { type: 'ballot', candidates: cands, choice: d.ballots[p.id] ?? null, weight: ballotWeight(m, p), selfVote: m.settings.selfVote };
      }
      if (!p.alive && d.ghostVoters.includes(p.id)) {
        return { type: 'ballot', ghost: true, candidates: cands, choice: d.ghostBallots[p.id] ?? null, weight: 1, majority: hasRule(m, 'MAJORITY_RULE') };
      }
      return { type: p.alive ? 'novote' : 'spectate' };
    }
    case 'DAY_RESOLVING':
      if (d.retaliation?.actorId === p.id) return { type: 'retaliate', targets: d.retaliation.targets };
      return { type: 'wait' };
    default: return { type: 'none' };
  }
}

function chatsFor(m, p) {
  return chatChannels(m, p).map((ch) => {
    const c = m.chats[ch.id];
    const anon = c?.kind === 'conspire' && c.members[0] !== p.id;
    return {
      id: ch.id, label: ch.label, canSend: ch.canSend,
      messages: (c?.messages || []).slice(-80).map((x) => ({
        from: anon && x.from !== p.id ? null : x.from,
        name: x.from === p.id ? 'You' : anon ? 'Stranger' : nameOf(m, x.from),
        text: x.text, ts: x.ts,
      })),
    };
  });
}

/** Opt-in trusted moderator: a non-playing host who sees everything. */
export function moderatorView(m, now = Date.now()) {
  const v = publicView(m, now);
  const N = m.night;
  v.me = { id: m.moderatorId, isHost: true, moderator: true };
  v.host = hostControls(m);
  v.manualRoles = m.phase === 'LOBBY' ? m.manualRoles : undefined;
  v.allRoles = Object.values(ROLES).map((r) => ({ id: r.id, name: r.name, set: r.set }));
  v.secrets = m.phase === 'LOBBY' ? null : m.players.map((p) => ({
    id: p.id, role: roleCard(p.roleId)?.name, roleId: p.roleId, alignment: p.alignment, charges: p.charges,
    dream: N?.dreams[p.id] ? DREAMS[N.dreams[p.id]].name : null, dreamId: N?.dreams[p.id] ?? null,
    statuses: p.statuses.map((s) => s.type),
    action: N?.actions[p.id]?.uses ?? null, done: N ? !!N.done[p.id] : null,
    ballot: m.day?.ballots[p.id] ?? null,
  }));
  if (N?.death) v.deathTeam = { members: N.death.members, capacity: N.death.capacity, proposals: N.death.proposals, confirmed: N.death.confirmed };
  v.private = [];
  v.action = { type: 'moderator' };
  v.chats = [];
  return v;
}
