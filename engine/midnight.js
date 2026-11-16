// Dead Set: Midnight — one night, one vote (see MIDNIGHT.md).
//
// One card per player plus three on the table (the empty chairs). Everyone
// sees their own card, then the night runs a fixed list of steps; each step
// lasts the same time whether or not anyone acts, so the night's length
// gives nothing away. Cards change hands; at dawn you are the card in front
// of you. One discussion, one vote: the most voted die (two votes at least).

import { GameError, nameOf, pub, priv } from './state.js';
import { ROLES } from './content.js';

export const N_PHASES = ['N_DEAL', 'N_NIGHT', 'N_DAY', 'N_VOTE'];
export const isMidnightPhase = (ph) => typeof ph === 'string' && ph.startsWith('N_');
export const N_MIN = 4;
export const N_MAX = 12;
export const N_RETURN_SECONDS = 60;
export const TABLE = ['chair1', 'chair2', 'chair3'];

/** Every card, in wake order (passive cards last). */
export const N_CARDS = ['MIMIC', 'DEATH', 'CONSPIRATOR', 'N_TWIN', 'MENTALIST', 'DOUBLE_AGENT', 'WITCH', 'GAMBLER', 'N_INSOMNIAC', 'VIGILANTE', 'JESTER', 'INNOCENT'];
/** The night's steps, in order. */
export const N_STEPS = ['MIMIC', 'DEATH', 'CONSPIRATOR', 'N_TWIN', 'MENTALIST', 'DOUBLE_AGENT', 'WITCH', 'GAMBLER', 'N_INSOMNIAC'];
const ACTION_ROLES = new Set(['MENTALIST', 'DOUBLE_AGENT', 'WITCH', 'GAMBLER']);
const DEATH_SIDE = new Set(['DEATH', 'CONSPIRATOR']);
/** How many of each card a custom deck may hold. */
export const N_LIMIT = { DEATH: 2, N_TWIN: 2, INNOCENT: 4 };
const limitOf = (id) => N_LIMIT[id] ?? 1;

const BASE = ['DEATH', 'DEATH', 'MENTALIST', 'DOUBLE_AGENT', 'WITCH', 'N_INSOMNIAC', 'INNOCENT'];
export function recommendedDeck(n) {
  const d = [...BASE];
  if (n >= 5) d.push('GAMBLER');
  if (n >= 6) d.push('CONSPIRATOR');
  if (n >= 7) d.push('JESTER');
  if (n >= 8) d.push('VIGILANTE');
  if (n >= 9) d.push('MIMIC');
  if (n >= 10) { d.splice(d.indexOf('INNOCENT'), 1); d.push('N_TWIN', 'N_TWIN'); }
  if (n >= 11) d.push('INNOCENT');
  if (n >= 12) d.push('INNOCENT');
  return sortDeck(d);
}
const sortDeck = (d) => [...d].sort((a, b) => N_CARDS.indexOf(a) - N_CARDS.indexOf(b));

export const N_DEFAULTS = { deck: 'recommended', pool: [], lonePeek: true, games: 1 };
export const N_TIMER_DEFAULTS = { nDeal: 15, nStep: 10, nDay: 300, nVote: 30 };

let RNG = null;
const T = (m, key) => m.settings.timers?.[key] ?? N_TIMER_DEFAULTS[key] ?? 0;
const bump = (m) => { m.stateVersion++; };
export const nSettings = (s) => ({ ...N_DEFAULTS, ...(s.n || {}) });
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
const N = (m) => m.N;

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.N?.step ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

// ── Settings ───────────────────────────────────────────────────────────────
export function applyMidnightPatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const k = nSettings(s);
  if (['recommended', 'custom'].includes(patch.deck)) k.deck = patch.deck;
  if (Array.isArray(patch.pool)) {
    const out = [];
    for (const id of patch.pool) {
      if (!N_CARDS.includes(id) || out.length >= N_MAX + 3) continue;
      if (out.filter((x) => x === id).length >= limitOf(id)) continue;
      out.push(id);
    }
    k.pool = sortDeck(out);
  }
  if (typeof patch.lonePeek === 'boolean') k.lonePeek = patch.lonePeek;
  if ([1, 3, 5].includes(Number(patch.games))) k.games = Number(patch.games);
  if (k.deck === 'custom' && !k.pool.length) k.pool = recommendedDeck(6);
  s.n = k;
}

export function deckFor(n, settings) {
  const k = nSettings(settings);
  return k.deck === 'custom' ? sortDeck(k.pool) : recommendedDeck(n);
}

export function validateMidnight(n, settings) {
  const k = nSettings(settings);
  const errors = [];
  const warnings = [];
  if (n < N_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: N_MIN, n }]);
  if (n > N_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'Midnight', n: N_MAX }]);
  const deck = deckFor(Math.max(N_MIN, Math.min(N_MAX, n)), settings);
  if (k.deck === 'custom') {
    if (!deck.includes('DEATH')) errors.push('Death must be one of the cards.');
    const twins = deck.filter((x) => x === 'N_TWIN').length;
    if (twins === 1) errors.push('The Twins come as a pair.');
    if (n >= N_MIN && deck.length !== n + 3) errors.push(['Pick exactly {n} cards (players + 3).', { n: n + 3 }]);
  }
  const exact = {};
  for (const id of deck) exact[id] = (exact[id] || 0) + 1;
  return { ok: errors.length === 0, errors, warnings, publicDeck: { exact }, suggestions: [] };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const players = (m) => seatOrder(m);
const isTable = (id) => TABLE.includes(id);
const seatName = (m, id) => (isTable(id) ? ['the table card {n}', { n: TABLE.indexOf(id) + 1 }] : nameOf(m, id));
/** The role a card counts as: the Mimic counts as what it copied. */
const asRole = (m, card) => (card === 'MIMIC' ? N(m).mimicAs ?? 'MIMIC' : card);
const sideOf = (m, card) => { const r = asRole(m, card); return DEATH_SIDE.has(r) ? 'DEATH' : r === 'JESTER' ? 'JESTER' : 'LIVING'; };
/** Who acts in a step: everyone dealt that card, and the Mimic if it copied a waking role. */
function actorsOf(m, role) {
  const S = N(m);
  const out = players(m).filter((id) => S.dealt[id] === role);
  if (role !== 'MIMIC' && S.mimicAs === role && !ACTION_ROLES.has(role) && S.dealt[S.mimic] === 'MIMIC') out.push(S.mimic);
  return out;
}
function see(m, pid, step, msg, cards = []) {
  const S = N(m);
  const entry = { step, msg, cards };
  (S.seen[pid] ||= []).push(entry);
  priv(m, pid, msg, 'nsee', { step, cards });
}
const swapCards = (m, a, b) => { const S = N(m); [S.cards[a], S.cards[b]] = [S.cards[b], S.cards[a]]; };

// ── Start ──────────────────────────────────────────────────────────────────
export function startMidnight(m, rng, now) {
  RNG = rng;
  const k = nSettings(m.settings);
  m.players.forEach((p) => {
    Object.assign(p, {
      roleId: 'N_SLEEPER', originalRoleId: 'N_SLEEPER', alignment: ROLES.N_SLEEPER.alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  m.config = { mode: 'midnight', preset: 'midnight', midnight: true, ...k };
  Object.assign(m, { activeRules: [], scenario: null, history: [], publicLog: [], privateLog: {}, chats: {}, day: null, night: null,
    dayNumber: 0, nightNumber: 0, winner: null, endReason: null, M: null, X: null, C: null, K: null });
  m.nScores ||= {};
  m.nMatch = m.nMatch && m.nMatch.played < m.nMatch.total && m.nMatch.total === k.games ? m.nMatch : { played: 0, total: k.games };
  if (m.nMatch.played === 0) m.nScores = {};
  const order = players(m);
  const deck = deckFor(order.length, m.settings);
  for (let i = deck.length - 1; i > 0; i--) { const j = rng.int(i + 1, 'ndeal'); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  const seats = [...order, ...TABLE];
  const cards = Object.fromEntries(seats.map((id, i) => [id, deck[i]]));
  m.N = {
    deck: sortDeck(deck), cards, dealt: { ...cards }, mimic: order.find((id) => cards[id] === 'MIMIC') ?? null, mimicAs: null, mimicStage: null,
    steps: N_STEPS.filter((r) => deck.includes(r)), step: -1, acted: {}, acks: {}, seen: {}, timeline: [], votes: {}, died: [], winners: null,
    where: rng.int(15, 'nwhere'),
  };
  for (const id of order) priv(m, id, ['Your card: {role}.', { role: cards[id] }], 'role', { card: cards[id] });
  pub(m, 'Midnight. Everyone looks at their card, once.', 'phase', { ev: 'n-deal' });
  enter(m, 'N_DEAL', now, T(m, 'nDeal'));
}

function nightfall(m, now) {
  pub(m, 'Night falls. Close your eyes; your phone will wake you.', 'phase', { ev: 'n-night' });
  nextStep(m, now);
}

function nextStep(m, now) {
  const S = N(m);
  S.step++;
  S.acted = {};
  if (S.step >= S.steps.length) return dawn(m, now);
  const role = S.steps[S.step];
  if (role === 'MIMIC') S.mimicStage = 'pick';
  // What some roles simply see when they wake.
  const acts = actorsOf(m, role);
  if (role === 'DEATH') {
    for (const id of acts) {
      const others = acts.filter((x) => x !== id);
      see(m, id, role, others.length ? ['Death wakes with you: {names}.', { names: others.map((x) => nameOf(m, x)) }] : 'You are the only Death at the table.', others.map((x) => ({ seat: x, role: 'DEATH' })));
    }
  }
  if (role === 'CONSPIRATOR') {
    const deaths = actorsOf(m, 'DEATH');
    for (const id of acts) see(m, id, role, deaths.length ? ['Death is {names}.', { names: deaths.map((x) => nameOf(m, x)) }] : 'No player is Death tonight.', deaths.map((x) => ({ seat: x, role: 'DEATH' })));
  }
  if (role === 'N_TWIN') {
    for (const id of acts) {
      const others = acts.filter((x) => x !== id);
      see(m, id, role, others.length ? ['Your twin: {names}.', { names: others.map((x) => nameOf(m, x)) }] : 'Your twin is not at the table.', others.map((x) => ({ seat: x, role: 'N_TWIN' })));
    }
  }
  if (role === 'N_INSOMNIAC') {
    for (const id of acts) { see(m, id, role, ['You wake before dawn. Your card: {role}.', { role: S.cards[id] }], [{ seat: id, role: S.cards[id] }]); S.timeline.push({ step: role, by: id, kind: 'self', role: S.cards[id] }); }
  }
  pub(m, role === 'N_TWIN' ? ['The Twins wake…', {}] : ['{role} wakes…', { role }], 'phase', { ev: 'n-step', role, i: S.step, of: S.steps.length });
  enter(m, 'N_NIGHT', now, T(m, 'nStep') * (role === 'MIMIC' ? 2 : 1));
}

/** What the current step lets this player do (null: they sleep). */
function stepFor(m, pid) {
  const S = N(m);
  const role = S.steps[S.step];
  if (!actorsOf(m, role).includes(pid)) return null;
  if (role === 'MIMIC') {
    if (S.mimicStage === 'pick') return { kind: 'copy' };
    if (S.mimicStage === 'act' && ACTION_ROLES.has(S.mimicAs) && !S.acted[pid]) return { kind: S.mimicAs };
    return { kind: 'done' };
  }
  if (S.acted[pid]) return { kind: 'done' };
  if (role === 'DEATH') return actorsOf(m, 'DEATH').length === 1 && m.config.lonePeek ? { kind: 'lonePeek' } : { kind: 'done' };
  if (ACTION_ROLES.has(role)) return { kind: role };
  return { kind: 'done' };
}

function act(m, pid, payload, kind, role) {
  const S = N(m);
  const others = players(m).filter((x) => x !== pid);
  const needPlayer = (id) => { if (!others.includes(id)) throw new GameError('Pick another player.'); return id; };
  const needTable = (id) => { if (!isTable(id)) throw new GameError('Pick a table card.'); return id; };
  switch (kind) {
    case 'copy': {
      const t = needPlayer(payload.target);
      S.mimicAs = S.cards[t];
      S.mimicStage = ACTION_ROLES.has(S.mimicAs) ? 'act' : 'done';
      see(m, pid, 'MIMIC', ['You copy {name}: you are now the {role}.', { name: nameOf(m, t), role: S.mimicAs }], [{ seat: t, role: S.mimicAs }]);
      S.timeline.push({ step: 'MIMIC', by: pid, kind: 'copy', target: t, role: S.mimicAs });
      return;
    }
    case 'lonePeek': {
      const t = needTable(payload.table);
      see(m, pid, role, ['The table card shows: {role}.', { role: S.cards[t] }], [{ seat: t, role: S.cards[t] }]);
      S.timeline.push({ step: role, by: pid, kind: 'look', seats: [t] });
      break;
    }
    case 'MENTALIST': {
      if (payload.target) {
        const t = needPlayer(payload.target);
        see(m, pid, role, ['{name}\'s card: {role}.', { name: nameOf(m, t), role: S.cards[t] }], [{ seat: t, role: S.cards[t] }]);
        S.timeline.push({ step: role, by: pid, kind: 'look', seats: [t] });
      } else {
        const [a, b] = payload.tables ?? [];
        needTable(a); needTable(b);
        if (a === b) throw new GameError('Pick two different table cards.');
        see(m, pid, role, ['Two table cards: {r1} and {r2}.', { r1: S.cards[a], r2: S.cards[b] }], [{ seat: a, role: S.cards[a] }, { seat: b, role: S.cards[b] }]);
        S.timeline.push({ step: role, by: pid, kind: 'look', seats: [a, b] });
      }
      break;
    }
    case 'DOUBLE_AGENT': {
      const t = needPlayer(payload.target);
      swapCards(m, pid, t);
      see(m, pid, role, ['You swap with {name}. Your new card: {role}.', { name: nameOf(m, t), role: S.cards[pid] }], [{ seat: pid, role: S.cards[pid] }]);
      S.timeline.push({ step: role, by: pid, kind: 'swap', seats: [pid, t] });
      break;
    }
    case 'WITCH': {
      const [a, b] = payload.targets ?? [];
      needPlayer(a); needPlayer(b);
      if (a === b) throw new GameError('Pick two different players.');
      swapCards(m, a, b);
      see(m, pid, role, ['You swap the cards of {a} and {b}.', { a: nameOf(m, a), b: nameOf(m, b) }]);
      S.timeline.push({ step: role, by: pid, kind: 'swap', seats: [a, b] });
      break;
    }
    case 'GAMBLER': {
      const t = needTable(payload.table);
      swapCards(m, pid, t);
      see(m, pid, role, ['You swap your card with table card {n}, without looking.', { n: TABLE.indexOf(t) + 1 }]);
      S.timeline.push({ step: role, by: pid, kind: 'swap', seats: [pid, t] });
      break;
    }
    default: throw new GameError('Nothing to do now.');
  }
  S.acted[pid] = true;
  if (role === 'MIMIC') S.mimicStage = 'done';
}

/** Defaults when a step runs out: the Gambler must swap; the Mimic copies someone. */
function stepDefaults(m) {
  const S = N(m);
  const role = S.steps[S.step];
  for (const id of actorsOf(m, role)) {
    let st = stepFor(m, id);
    if (st?.kind === 'copy') { const o = players(m).filter((x) => x !== id); act(m, id, { target: o[RNG.int(o.length, 'nauto')] }, 'copy', role); st = stepFor(m, id); }
    if (st?.kind === 'GAMBLER') act(m, id, { table: TABLE[RNG.int(3, 'nauto')] }, 'GAMBLER', role);
  }
}

function dawn(m, now) {
  pub(m, 'Dawn. Who are you now? Talk it over, then point.', 'phase', { ev: 'n-dawn' });
  m.dayNumber = 1;
  enter(m, 'N_DAY', now, T(m, 'nDay'));
}

function openVote(m, now) {
  pub(m, 'Point at one player. Everyone at once.', 'phase', { ev: 'n-vote' });
  enter(m, 'N_VOTE', now, T(m, 'nVote'));
}

function resolveVote(m, now) {
  const S = N(m);
  const tally = {};
  for (const [, t] of Object.entries(S.votes)) if (t) tally[t] = (tally[t] || 0) + 1;
  const top = Math.max(0, ...Object.values(tally));
  let died = top >= 2 ? Object.keys(tally).filter((id) => tally[id] === top) : [];
  // The Vigilante takes the one they pointed at.
  const extra = [];
  for (const id of died) if (asRole(m, S.cards[id]) === 'VIGILANTE' && S.votes[id] && !died.includes(S.votes[id])) extra.push(S.votes[id]);
  died = [...died, ...extra.filter((x, i) => extra.indexOf(x) === i)];
  S.died = died;
  S.tally = tally;
  S.vigilante = extra;
  for (const id of died) { const p = m.players.find((x) => x.id === id); if (p) p.alive = false; }
  // Who wins (cards at dawn).
  const ps = players(m);
  const deaths = ps.filter((id) => asRole(m, S.cards[id]) === 'DEATH');
  const jester = died.some((id) => asRole(m, S.cards[id]) === 'JESTER');
  const sides = new Set();
  if (jester) sides.add('JESTER');
  if (deaths.length) {
    if (died.some((id) => deaths.includes(id))) sides.add('LIVING');
    else if (!jester) sides.add('DEATH');
  } else if (!died.length) sides.add('LIVING');
  else {
    const consp = ps.find((id) => asRole(m, S.cards[id]) === 'CONSPIRATOR');
    if (consp && !died.includes(consp) && !jester) sides.add('DEATH');
  }
  const winners = ps.filter((id) => {
    const side = sideOf(m, S.cards[id]);
    return side === 'JESTER' ? died.includes(id) && sides.has('JESTER') : sides.has(side);
  });
  S.winners = { sides: [...sides], players: winners };
  m.winner = 'MIDNIGHT';
  m.nWinners = winners;
  const sc = (m.nScores ||= {});
  for (const id of ps) sc[id] = (sc[id] || 0) + (winners.includes(id) ? (sideOf(m, S.cards[id]) === 'JESTER' ? 2 : 1) : 0);
  m.nMatch.played++;
  const label = sides.size ? [...sides].map((x) => ({ LIVING: 'The Living win.', DEATH: 'Death wins.', JESTER: 'The Jester wins.' }[x])).join(' ') : 'Nobody wins.';
  const msg = died.length ? [died.length > 1 ? '{names} die. {label}' : '{names} dies. {label}', { names: died.map((id) => nameOf(m, id)), label: [label, {}] }] : ['Nobody dies. {label}', { label: [label, {}] }];
  m.endReason = msg;
  pub(m, msg, 'end', { ev: 'end', winner: 'MIDNIGHT', sides: [...sides], pids: winners, died, tally, votes: { ...S.votes }, reason: msg });
  enter(m, 'ENDED', now, N_RETURN_SECONDS);
}

// ── Commands ───────────────────────────────────────────────────────────────
export function midnightCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const S = N(m);
  const need = (phase) => { if (m.phase !== phase) throw new GameError('That window has closed.', 'STALE'); };
  switch (type) {
    case 'n.ack':
      need('N_DEAL');
      S.acks[p.id] = true;
      if (players(m).every((id) => S.acks[id])) return nightfall(m, now);
      return bump(m);
    case 'n.act': {
      need('N_NIGHT');
      const st = stepFor(m, p.id);
      if (!st || st.kind === 'done') throw new GameError('Nothing to do now.');
      act(m, p.id, payload, st.kind, S.steps[S.step]);
      return bump(m); // the step always runs its full time
    }
    case 'n.vote': {
      need('N_VOTE');
      const t = payload.target;
      if (t === p.id || !players(m).includes(t)) throw new GameError('Point at another player.');
      S.votes[p.id] = t;
      if (players(m).every((id) => S.votes[id])) return resolveVote(m, now);
      return bump(m);
    }
    default: throw new GameError('Unknown command.');
  }
}

export function midnightAdvance(m, rng, now) {
  RNG = rng;
  switch (m.phase) {
    case 'N_DEAL': return nightfall(m, now);
    case 'N_NIGHT': stepDefaults(m); return nextStep(m, now);
    case 'N_DAY': return openVote(m, now);
    case 'N_VOTE': return resolveVote(m, now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const N_ADVANCE_LABEL = { N_DEAL: 'Start the night', N_NIGHT: 'Next step', N_DAY: 'Open the vote', N_VOTE: 'Close the vote' };

// ── Views ──────────────────────────────────────────────────────────────────
export function midnightPublic(m) {
  const S = N(m);
  if (!S) return null;
  const ended = m.phase === 'ENDED';
  const counts = {};
  for (const id of S.deck) counts[id] = (counts[id] || 0) + 1;
  return {
    deck: Object.entries(counts).map(([id, n]) => ({ id, n })).sort((a, b) => N_CARDS.indexOf(a.id) - N_CARDS.indexOf(b.id)),
    steps: S.steps, step: S.step, stepRole: m.phase === 'N_NIGHT' ? S.steps[S.step] : null,
    acked: m.phase === 'N_DEAL' ? Object.keys(S.acks) : [], voted: m.phase === 'N_VOTE' ? Object.keys(S.votes) : [],
    lonePeek: !!m.config.lonePeek, where: S.where,
    // Only at the end: every card, dealt and at dawn, the votes and the whole night.
    dealt: ended ? S.dealt : undefined, cards: ended ? S.cards : undefined, mimicAs: ended ? S.mimicAs : undefined,
    votes: ended ? S.votes : undefined, tally: ended ? S.tally : undefined, died: ended ? S.died : undefined, vigilante: ended ? S.vigilante : undefined,
    timeline: ended ? S.timeline : undefined, winners: S.winners, scores: m.nScores ?? {}, match: m.nMatch,
  };
}

export function midnightMe(m, p) {
  const S = N(m);
  if (!S) return {};
  return { dealt: S.dealt[p.id], seen: S.seen[p.id] ?? [], vote: S.votes[p.id] ?? null };
}

export function midnightAction(m, p) {
  const S = N(m);
  switch (m.phase) {
    case 'N_DEAL': return { type: 'ndeal', card: S.dealt[p.id], done: !!S.acks[p.id] };
    case 'N_NIGHT': {
      const role = S.steps[S.step];
      const st = stepFor(m, p.id);
      // Every phone runs the same step screen; only the waking player's has controls.
      if (!st) return { type: 'nsleep', role };
      const seen = (S.seen[p.id] ?? []).filter((e) => e.step === role);
      return { type: 'nstep', role, kind: st.kind, targets: players(m).filter((x) => x !== p.id), tables: TABLE, seen, mimicAs: p.id === S.mimic ? S.mimicAs : undefined };
    }
    case 'N_DAY': return { type: 'nday' };
    case 'N_VOTE': return { type: 'nvote', targets: players(m).filter((x) => x !== p.id), choice: S.votes[p.id] ?? null };
    default: return { type: 'none' };
  }
}

export function midnightProgress(m) {
  const S = N(m);
  if (m.phase === 'N_DEAL') return { label: 'ready', done: Object.keys(S.acks).length, total: m.players.length };
  if (m.phase === 'N_VOTE') return { label: 'votes in', done: Object.keys(S.votes).length, total: m.players.length };
  return null;
}

export const midnightSecrets = (m) => (N(m) ? { cards: { ...N(m).cards }, dealt: { ...N(m).dealt }, mimicAs: N(m).mimicAs } : null);
