// Small shared helpers over plain match state.
import { fmt } from './messages.js';

/** An illegal command. `msg` is a translatable message (string or [template, params]). */
export class GameError extends Error {
  constructor(msg, code = 'INVALID') {
    super(fmt(msg));
    this.msg = msg;
    this.code = code;
  }
}

export const byId = (m, id) => m.players.find((p) => p.id === id);
export const living = (m) => m.players.filter((p) => p.alive);
export const isNightPhase = (phase) => phase === 'NIGHT_DREAM_SWAP' || phase === 'NIGHT_ACTIONS';
export const isDayPhase = (phase) => phase.startsWith('DAY_');

export function nameOf(m, id) {
  return byId(m, id)?.name ?? 'Someone';
}

export function hasRule(m, rule) {
  return m.activeRules.includes(rule);
}

/** The night the Death team "room" is currently preparing for. */
export function upcomingNight(m) {
  if (isNightPhase(m.phase)) return m.nightNumber;
  if (m.phase === 'NIGHT_0_REVEAL' || m.phase === 'LOBBY') return 1;
  return m.dayNumber;
}

export function deathTeam(m, nightNo = upcomingNight(m)) {
  return m.players.filter((p) => p.alive && p.alignment === 'DEATH' && p.teamJoinNight != null && p.teamJoinNight <= nightNo);
}

export function hasDayStatus(m, p, type) {
  return p.statuses.some((s) => s.type === type && s.day === m.dayNumber) && isDayPhase(m.phase);
}

/** Public log entry: `msg` is translatable; `text` is its English rendering. */
export function pub(m, msg, kind = 'info', extra = {}) {
  m.publicLog.push({ i: m.publicLog.length, at: stamp(m), kind, text: fmt(msg), msg, ...extra });
}

export function priv(m, pid, msg, kind = 'info', extra = {}) {
  const list = (m.privateLog[pid] ||= []);
  list.push({ i: list.length, at: stamp(m), kind, text: fmt(msg), msg, ...extra });
}

export function stamp(m) {
  if (m.phase === 'LOBBY') return 'Lobby';
  if (m.phase === 'NIGHT_0_REVEAL') return 'Night 0';
  if (m.M && m.phase.startsWith('M_')) return m.phase === 'M_REVEAL' ? 'Night 0' : m.phase === 'M_LAST_STAND' || m.phase === 'M_RECKONING' ? 'Finale' : `Mission ${m.M.mission + 1}`;
  if (isNightPhase(m.phase) || m.phase === 'NIGHT_RESOLVING') return `Night ${m.nightNumber}`;
  if (m.C && m.phase.startsWith('C_')) return `Round ${m.C.round}`;
  if (m.K && m.phase.startsWith('K_')) return `Turn ${m.K.turnNo}`;
  if (m.G && m.phase.startsWith('G_')) return m.G.turnNo ? `Turn ${m.G.turnNo}` : 'Lobby';
  if (m.S && m.phase.startsWith('S_')) return m.S.round ? `Round ${m.S.round}` : 'Lobby';
  if (m.N && m.phase.startsWith('N_')) return m.phase === 'N_DEAL' || m.phase === 'N_NIGHT' ? 'Night' : 'Day';
  if (m.X && m.phase.startsWith('X_')) return `Round ${m.X.round}`;
  if (m.O && m.phase.startsWith('O_') && m.O.round) return `Round ${m.O.round}`;
  if (m.W && m.phase.startsWith('W_') && m.W.round) return `Round ${m.W.round}`;
  if (m.Q && m.phase.startsWith('Q_')) return 'Day';
  if (m.phase === 'ENDED') return 'End';
  return `Day ${m.dayNumber}`;
}

/** The Psycho's charges for this match: 1 (once per game), 2 (one Mute and one No Vote) or unlimited (one a night). */
export function psychoCharges(m) {
  const k = m.config?.psycho ?? m.settings?.psycho;
  return k === 'nightly' ? 99 : k === 'both' ? 2 : 1;
}

/** The quiet first day (on by default): Day 1 is talk only. */
export const quietDay = (m) => m.config?.quietFirstDay !== false && m.config?.mode === 'classic' && m.dayNumber === 1;
