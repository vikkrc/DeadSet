// Shared machinery for the round-and-ballot modes (Beta 9 onwards: The Omen, The Mirror, and later
// The Pact, Standoff, Inheritance, Confessions, The Gazette…): sealed simultaneous ballots, a round
// loop, a score ledger with shared victory on ties, and the per-mode reset at the start of a match.

import { GameError } from './state.js';

const bump = (m) => { m.stateVersion++; };

/** Seat order, as player ids. */
export const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);

/** A seeded shuffle. */
export function shuffleWith(rng, arr, tag) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = rng.int(i + 1, tag); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Enter a phase: new phase id (stale commands are refused), timer, state bump. */
export function enterPhase(m, phase, now, seconds, step = 0) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${step}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

/** Every player becomes a plain participant of `roleId`; the logs and other modes' state are cleared. */
export function resetForMode(m, { roleId, alignment, config }) {
  m.players.forEach((p) => {
    Object.assign(p, {
      roleId, originalRoleId: roleId, alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  m.config = config;
  Object.assign(m, { activeRules: [], scenario: null, history: [], publicLog: [], privateLog: {}, chats: {}, day: null, night: null,
    dayNumber: 0, nightNumber: 0, winner: null, endReason: null, M: null, X: null, C: null, K: null, N: null, S: null, G: null, Q: null, O: null, W: null });
}

/** A sealed ballot: stored privately, replaceable until the ballot closes; true once everyone has one. */
export function castBallot(m, store, pid, ballot, eligible) {
  if (!eligible.includes(pid)) throw new GameError('You do not vote in this ballot.');
  store[pid] = ballot;
  bump(m);
  return eligible.every((id) => store[id] != null);
}

/** Add round deltas to a score table (every seated player gets an entry). */
export function addScores(scores, deltas, ids) {
  for (const id of ids) scores[id] = (scores[id] || 0) + (deltas[id] || 0);
  return scores;
}

/** The leaders: everyone tied on the top score shares the victory. */
export function leaders(scores, ids) {
  const top = Math.max(...ids.map((id) => scores[id] || 0));
  return ids.filter((id) => (scores[id] || 0) === top);
}

export const touch = bump;
