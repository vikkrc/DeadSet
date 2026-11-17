// Dead Set: The Omen — an occult wheel points to Life, Death or Rebirth; anyone may secretly turn it
// (see OMEN.md, from design/TWELVE-MODES-SPEC.md §2).
//
// Seven rounds. Each round the wheel shows a public start; every player secretly predicts where it
// will finish and may turn it one step either way, spending one of five Influence. The sum of all
// turns moves the wheel: a right prediction scores 3. Unused Influence is worth 1 each at the end.

import { GameError, pub } from './state.js';
import { ROLES } from './content.js';
import { seatOrder, enterPhase, resetForMode, castBallot, addScores, leaders } from './kit.js';

export const O_PHASES = ['O_SHOW', 'O_SECRET', 'O_REVEAL'];
export const isOmenPhase = (ph) => typeof ph === 'string' && ph.startsWith('O_');
export const O_MIN = 4;
export const O_MAX = 12;
export const O_ROUNDS = 7;
export const O_INFLUENCE = 5;
export const O_POINTS = 3;
export const O_RETURN_SECONDS = 60;
/** The three faces, in clockwise order. */
export const OUTCOMES = ['LIFE', 'DEATH', 'REBIRTH'];
export const O_DEFAULTS = {};
export const O_TIMER_DEFAULTS = { oShow: 8, oSecret: 40, oReveal: 12 };

let RNG = null;
const T = (m, key) => m.settings.timers?.[key] ?? O_TIMER_DEFAULTS[key] ?? 0;
const O = (m) => m.O;
const enter = (m, phase, now, seconds) => enterPhase(m, phase, now, seconds, m.O?.round ?? 0);
/** Where the wheel stops: the sum of every turn, applied once, wrapped onto the three faces. */
export const finishOf = (start, offset) => (((start + offset) % 3) + 3) % 3;

export function applyOmenPatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  s.o = { ...O_DEFAULTS, ...(s.o || {}) };
}

export function validateOmen(n) {
  const errors = [];
  if (n < O_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: O_MIN, n }]);
  if (n > O_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'The Omen', n: O_MAX }]);
  return { ok: errors.length === 0, errors, warnings: [], publicDeck: { exact: {} }, suggestions: [] };
}

export function startOmen(m, rng, now) {
  RNG = rng;
  resetForMode(m, { roleId: 'O_SEER', alignment: ROLES.O_SEER.alignment, config: { mode: 'omen', preset: 'omen', omen: true } });
  const ids = seatOrder(m);
  m.O = {
    round: 0, rounds: O_ROUNDS, start: null, influence: Object.fromEntries(ids.map((id) => [id, O_INFLUENCE])),
    ballots: {}, scores: Object.fromEntries(ids.map((id) => [id, 0])), last: null, history: [], bonus: null, winners: null,
  };
  pub(m, ['The wheel of omens turns. Seven rounds; five Influence each.', {}], 'phase', { ev: 'o-start' });
  nextRound(m, now);
}

function nextRound(m, now) {
  const st = O(m);
  st.round++;
  st.start = RNG.int(3, 'ostart');
  st.ballots = {};
  st.last = null;
  pub(m, ['Round {n}: the wheel points to {face}.', { n: st.round, face: OUTCOMES[st.start] }], 'phase', { ev: 'o-show', round: st.round, start: st.start });
  enter(m, 'O_SHOW', now, T(m, 'oShow'));
}

function openSecret(m, now) { enter(m, 'O_SECRET', now, T(m, 'oSecret')); }

/** Resolve the round from one locked snapshot: spend Influence once, sum the turns, score predictions. */
function resolve(m, now) {
  const st = O(m);
  const ids = seatOrder(m);
  const used = {};
  let offset = 0;
  for (const id of ids) {
    const b = st.ballots[id];
    if (!b) continue;
    const rot = b.rot !== 0 && st.influence[id] > 0 ? b.rot : 0;
    if (rot) { st.influence[id]--; used[id] = rot; }
    offset += rot;
  }
  const finish = finishOf(st.start, offset);
  const deltas = {};
  const ballots = {};
  for (const id of ids) {
    const b = st.ballots[id];
    ballots[id] = b ? { pred: b.pred ?? null, rot: used[id] ?? 0 } : { pred: null, rot: 0, timeout: true };
    if (b && b.pred === finish) deltas[id] = O_POINTS;
  }
  addScores(st.scores, deltas, ids);
  st.last = { round: st.round, start: st.start, offset, finish, ballots, deltas };
  st.history.push(st.last);
  pub(m, ['The wheel turns {n} and stops at {face}.', { n: offset, face: OUTCOMES[finish] }], 'phase', { ev: 'o-reveal', round: st.round, start: st.start, offset, finish, ballots, deltas });
  enter(m, 'O_REVEAL', now, T(m, 'oReveal'));
}

function finish(m, now) {
  const st = O(m);
  const ids = seatOrder(m);
  st.bonus = Object.fromEntries(ids.map((id) => [id, st.influence[id]]));
  addScores(st.scores, st.bonus, ids);
  st.winners = leaders(st.scores, ids);
  m.oScores = { ...st.scores };
  m.winner = 'OMEN';
  m.endReason = st.winners.length > 1 ? ['{n} seers share the victory.', { n: st.winners.length }] : ['The seer with the most points wins.', {}];
  pub(m, m.endReason, 'end', { ev: 'end', winner: 'OMEN', pids: [...st.winners], reason: m.endReason });
  enter(m, 'ENDED', now, O_RETURN_SECONDS);
}

export function omenCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const st = O(m);
  switch (type) {
    case 'o.ballot': {
      if (m.phase !== 'O_SECRET') throw new GameError('That window has closed.', 'STALE');
      const pred = Number(payload.pred);
      const rot = Number(payload.rot ?? 0);
      if (![0, 1, 2].includes(pred)) throw new GameError('Predict Life, Death or Rebirth.');
      if (![-1, 0, 1].includes(rot)) throw new GameError('Turn the wheel one step, or not at all.');
      if (rot !== 0 && st.influence[p.id] < 1) throw new GameError('You have no Influence left.');
      if (castBallot(m, st.ballots, p.id, { pred, rot }, seatOrder(m))) return resolve(m, now);
      return;
    }
    default: throw new GameError('Unknown command.');
  }
}

export function omenAdvance(m, rng, now) {
  RNG = rng;
  switch (m.phase) {
    case 'O_SHOW': return openSecret(m, now);
    case 'O_SECRET': return resolve(m, now);
    case 'O_REVEAL': return O(m).round >= O(m).rounds ? finish(m, now) : nextRound(m, now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const O_ADVANCE_LABEL = { O_SHOW: 'Open the ballot', O_SECRET: 'Close the ballot', O_REVEAL: 'Next round' };

// ── Views ──────────────────────────────────────────────────────────────────
export function omenPublic(m) {
  const st = O(m);
  if (!st) return null;
  const ended = m.phase === 'ENDED';
  return {
    round: st.round, rounds: st.rounds, start: st.start, influence: st.influence, scores: st.scores,
    locked: m.phase === 'O_SECRET' ? Object.keys(st.ballots) : [],
    last: ['O_REVEAL', 'ENDED'].includes(m.phase) ? st.last : null,
    history: ended ? st.history : st.history.map((h) => ({ round: h.round, start: h.start, offset: h.offset, finish: h.finish })),
    bonus: st.bonus, winners: st.winners,
  };
}

export const omenMe = (m, p) => (O(m) ? { ballot: O(m).ballots[p.id] ?? null, influence: O(m).influence[p.id] } : {});

export function omenAction(m, p) {
  const st = O(m);
  if (m.phase === 'O_SECRET') return { type: 'oballot', ballot: st.ballots[p.id] ?? null, influence: st.influence[p.id] };
  if (m.phase === 'O_SHOW') return { type: 'oshow' };
  if (m.phase === 'O_REVEAL') return { type: 'oreveal' };
  return { type: 'none' };
}

export function omenProgress(m) {
  if (m.phase === 'O_SECRET') return { label: 'ballots recorded', done: Object.keys(O(m).ballots).length, total: m.players.length };
  return null;
}

export const omenSecrets = (m) => (O(m) ? { ballots: O(m).ballots } : null);
