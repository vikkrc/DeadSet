// Dead Set: The Mirror — the haunted mirror shows what your friends think you will do
// (see MIRROR.md, from design/TWELVE-MODES-SPEC.md §5).
//
// Eight dilemmas from the bank (public/dilemmas.js). Each round every player answers for themself and
// predicts the answer of one assigned player; the targets rotate so everyone reads everyone. A right
// prediction scores 2; your own answer scores nothing.

import { GameError, pub } from './state.js';
import { ROLES } from './content.js';
import { DILEMMAS } from '../public/dilemmas.js';
import { seatOrder, shuffleWith, enterPhase, resetForMode, castBallot, addScores, leaders } from './kit.js';

export const W_PHASES = ['W_PROMPT', 'W_CHOOSE', 'W_REVEAL'];
export const isMirrorPhase = (ph) => typeof ph === 'string' && ph.startsWith('W_');
export const W_MIN = 4;
export const W_MAX = 12;
export const W_ROUNDS = 8;
export const W_POINTS = 2;
export const W_RETURN_SECONDS = 60;
export const W_PACKS = [...new Set(DILEMMAS.map((d) => d.pack))];
export const W_DEFAULTS = { packs: ['core'] };
export const W_TIMER_DEFAULTS = { wTalk: 75, wChoose: 30, wReveal: 12 };
export const CHOICES = ['A', 'B', 'C'];

let RNG = null;
const T = (m, key) => m.settings.timers?.[key] ?? W_TIMER_DEFAULTS[key] ?? 0;
const W = (m) => m.W;
const enter = (m, phase, now, seconds) => enterPhase(m, phase, now, seconds, m.W?.round ?? 0);
export const wSettings = (s) => ({ ...W_DEFAULTS, ...(s.w || {}) });

export function applyMirrorPatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const k = wSettings(s);
  if (Array.isArray(patch.packs)) {
    const packs = patch.packs.filter((x) => W_PACKS.includes(x));
    if (packs.length) k.packs = packs;
  }
  s.w = k;
}

export function validateMirror(n, settings) {
  const errors = [];
  if (n < W_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: W_MIN, n }]);
  if (n > W_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'mirror', n: W_MAX }]);
  if (poolOf(settings).length < W_ROUNDS) errors.push('Not enough dilemmas in the chosen packs.');
  return { ok: errors.length === 0, errors, warnings: [], publicDeck: { exact: {} }, suggestions: [] };
}

const poolOf = (settings) => { const k = wSettings(settings); return DILEMMAS.filter((d) => k.packs.includes(d.pack)); };

/**
 * Who reads whom in round r (0-based): seat i reads seat (i + 1 + (r mod (n − 1))) mod n.
 * Nobody reads themself; every player is read by exactly one other; over n − 1 rounds everyone reads everyone.
 */
export function targetsFor(ids, r) {
  const n = ids.length;
  const k = 1 + (r % (n - 1));
  return Object.fromEntries(ids.map((id, i) => [id, ids[(i + k) % n]]));
}

export function startMirror(m, rng, now) {
  RNG = rng;
  resetForMode(m, { roleId: 'W_READER', alignment: ROLES.W_READER.alignment, config: { mode: 'mirror', preset: 'mirror', mirror: true, ...wSettings(m.settings) } });
  const ids = seatOrder(m);
  // Avoid the dilemmas this table saw most recently, when the bank allows.
  const seen = new Set(m.wSeen ?? []);
  const pool = poolOf(m.settings);
  const fresh = pool.filter((d) => !seen.has(d.id));
  const pickFrom = fresh.length >= W_ROUNDS ? fresh : pool;
  const deck = shuffleWith(rng, pickFrom.map((d) => d.id), 'wdeck').slice(0, W_ROUNDS);
  m.wSeen = [...(m.wSeen ?? []), ...deck].slice(-Math.max(0, pool.length - W_ROUNDS));
  m.W = { round: 0, rounds: W_ROUNDS, deck, dilemma: null, targets: {}, ballots: {}, scores: Object.fromEntries(ids.map((id) => [id, 0])), last: null, history: [], winners: null };
  pub(m, ['The mirror wakes. Eight dilemmas; read your friends.', {}], 'phase', { ev: 'w-start' });
  nextRound(m, now);
}

function nextRound(m, now) {
  const st = W(m);
  const ids = seatOrder(m);
  st.dilemma = st.deck[st.round];
  st.targets = targetsFor(ids, st.round);
  st.round++;
  st.ballots = {};
  st.last = null;
  pub(m, ['Dilemma {n} of {m}.', { n: st.round, m: st.rounds }], 'phase', { ev: 'w-prompt', round: st.round, dilemma: st.dilemma, targets: { ...st.targets } });
  enter(m, 'W_PROMPT', now, T(m, 'wTalk'));
}

/** Close the ballots: a missing answer becomes a random, labelled automatic one; a missing prediction abstains. */
function resolve(m, now) {
  const st = W(m);
  const ids = seatOrder(m);
  const answers = {};
  const auto = {};
  for (const id of ids) {
    const b = st.ballots[id];
    if (b) answers[id] = b.own;
    else { answers[id] = CHOICES[RNG.int(3, 'wauto')]; auto[id] = true; }
  }
  const preds = {};
  const deltas = {};
  for (const id of ids) {
    const b = st.ballots[id];
    preds[id] = b ? b.pred : null;
    if (b && b.pred === answers[st.targets[id]]) deltas[id] = W_POINTS;
  }
  addScores(st.scores, deltas, ids);
  st.last = { round: st.round, dilemma: st.dilemma, targets: { ...st.targets }, answers, auto, preds, deltas };
  st.history.push(st.last);
  pub(m, ['The mirror shows every answer.', {}], 'phase', { ev: 'w-reveal', round: st.round, dilemma: st.dilemma, answers, auto, preds, deltas, targets: { ...st.targets } });
  enter(m, 'W_REVEAL', now, T(m, 'wReveal'));
}

function finish(m, now) {
  const st = W(m);
  const ids = seatOrder(m);
  st.winners = leaders(st.scores, ids);
  m.wScores = { ...st.scores };
  m.winner = 'MIRROR';
  m.endReason = st.winners.length > 1 ? ['{n} readers share the victory.', { n: st.winners.length }] : ['The best reader of the table wins.', {}];
  pub(m, m.endReason, 'end', { ev: 'end', winner: 'MIRROR', pids: [...st.winners], reason: m.endReason });
  enter(m, 'ENDED', now, W_RETURN_SECONDS);
}

export function mirrorCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const st = W(m);
  switch (type) {
    case 'w.ballot': {
      if (m.phase !== 'W_CHOOSE') throw new GameError('That window has closed.', 'STALE');
      const own = String(payload.own ?? '');
      const pred = String(payload.pred ?? '');
      if (!CHOICES.includes(own) || !CHOICES.includes(pred)) throw new GameError('Choose your answer and your prediction.');
      if (castBallot(m, st.ballots, p.id, { own, pred }, seatOrder(m))) return resolve(m, now);
      return;
    }
    default: throw new GameError('Unknown command.');
  }
}

export function mirrorAdvance(m, rng, now) {
  RNG = rng;
  switch (m.phase) {
    case 'W_PROMPT': return enter(m, 'W_CHOOSE', now, T(m, 'wChoose'));
    case 'W_CHOOSE': return resolve(m, now);
    case 'W_REVEAL': return W(m).round >= W(m).rounds ? finish(m, now) : nextRound(m, now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const W_ADVANCE_LABEL = { W_PROMPT: 'Seal the ballots', W_CHOOSE: 'Show the answers', W_REVEAL: 'Next dilemma' };

// ── Views ──────────────────────────────────────────────────────────────────
export function mirrorPublic(m) {
  const st = W(m);
  if (!st) return null;
  return {
    round: st.round, rounds: st.rounds, dilemma: st.dilemma, targets: st.targets, scores: st.scores,
    locked: m.phase === 'W_CHOOSE' ? Object.keys(st.ballots) : [],
    last: ['W_REVEAL', 'ENDED'].includes(m.phase) ? st.last : null,
    history: m.phase === 'ENDED' ? st.history : [], winners: st.winners,
  };
}

export const mirrorMe = (m, p) => (W(m) ? { ballot: W(m).ballots[p.id] ?? null, target: W(m).targets[p.id] ?? null } : {});

export function mirrorAction(m, p) {
  const st = W(m);
  if (m.phase === 'W_PROMPT') return { type: 'wprompt', target: st.targets[p.id] };
  if (m.phase === 'W_CHOOSE') return { type: 'wballot', target: st.targets[p.id], ballot: st.ballots[p.id] ?? null };
  if (m.phase === 'W_REVEAL') return { type: 'wreveal' };
  return { type: 'none' };
}

export function mirrorProgress(m) {
  if (m.phase === 'W_CHOOSE') return { label: 'ballots recorded', done: Object.keys(W(m).ballots).length, total: m.players.length };
  return null;
}

export const mirrorSecrets = (m) => (W(m) ? { ballots: W(m).ballots } : null);
