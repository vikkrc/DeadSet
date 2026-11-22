// Dead Set: Mimic — everyone knows where you are, except the thing wearing a friend's face (see MIMIC.md).
//
// The Living share one location (a WHERE story card) and each hold a character there (a WHO card).
// The Mimic sees only static and the board of possible places. Questions pass round the table with
// a lantern; anyone may accuse once per game (only a unanimous table convicts); the Mimic may unmask
// and name the place at any moment; when time runs out, everyone points at one suspect.

import { GameError, nameOf, pub, priv } from './state.js';
import { ROLES, SCENARIO } from './content.js';

export const Q_PHASES = ['Q_INTRO', 'Q_ASK', 'Q_VOTE', 'Q_GUESS', 'Q_FINAL'];
export const isMimicPhase = (ph) => typeof ph === 'string' && ph.startsWith('Q_');
export const Q_MIN = 4;
export const Q_MAX = 12;
export const Q_RETURN_SECONDS = 60;
export const Q_BOARDS = [12, 16, 20, 30];
export const Q_DEFAULTS = { board: 16, games: 3, lastGuess: true, tvHint: false };
export const Q_TIMER_DEFAULTS = { qIntro: 20, qRound: 480, qVote: 30, qGuess: 30, qFinal: 45 };
/** How many recent questions the views carry (the TV draws them as arrows). */
const ASKED_KEEP = 12;

let RNG = null;
const T = (m, key) => m.settings.timers?.[key] ?? Q_TIMER_DEFAULTS[key] ?? 0;
const bump = (m) => { m.stateVersion++; };
export const qSettings = (s) => ({ ...Q_DEFAULTS, ...(s.q || {}) });
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
const Q = (m) => m.Q;
const shuffle = (arr, tag) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = RNG.int(i + 1, tag); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.Q?.step ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

// ── Settings ───────────────────────────────────────────────────────────────
export function applyMimicPatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const k = qSettings(s);
  if (Q_BOARDS.includes(Number(patch.board))) k.board = Number(patch.board);
  if ([1, 3, 5].includes(Number(patch.games))) k.games = Number(patch.games);
  if (typeof patch.lastGuess === 'boolean') k.lastGuess = patch.lastGuess;
  if (typeof patch.tvHint === 'boolean') k.tvHint = patch.tvHint;
  s.q = k;
}

export function validateMimic(n) {
  const errors = [];
  if (n < Q_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: Q_MIN, n }]);
  if (n > Q_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'mimic', n: Q_MAX }]);
  return { ok: errors.length === 0, errors, warnings: [], publicDeck: { exact: {} }, suggestions: [] };
}

// ── Start ──────────────────────────────────────────────────────────────────
export function startMimic(m, rng, now) {
  RNG = rng;
  const k = qSettings(m.settings);
  m.players.forEach((p) => {
    Object.assign(p, {
      roleId: 'Q_LIVING', originalRoleId: 'Q_LIVING', alignment: ROLES.Q_LIVING.alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  m.config = { mode: 'mimic', preset: 'mimic', mimic: true, ...k };
  Object.assign(m, { activeRules: [], scenario: null, history: [], publicLog: [], privateLog: {}, chats: {}, day: null, night: null,
    dayNumber: 0, nightNumber: 0, winner: null, endReason: null, M: null, X: null, C: null, K: null, N: null, S: null, G: null });
  m.qMatch = m.qMatch && m.qMatch.played < m.qMatch.total && m.qMatch.total === k.games ? m.qMatch : { played: 0, total: k.games };
  if (m.qMatch.played === 0) { m.qScores = {}; m.qLast = null; }
  m.qScores ||= {};
  const ids = seatOrder(m);
  // The Mimic: never the same player twice in a row.
  const pool = ids.filter((id) => id !== m.qLast);
  const mimic = pool[rng.int(pool.length, 'qmimic')];
  m.qLast = mimic;
  const places = SCENARIO.WHERE.map((_, i) => i);
  const loc = places[rng.int(places.length, 'qloc')];
  const size = Math.min(k.board, places.length);
  const board = shuffle([loc, ...shuffle(places.filter((i) => i !== loc), 'qboard').slice(0, size - 1)], 'qorder');
  const whos = shuffle(SCENARIO.WHO.map((_, i) => i), 'qwho');
  const who = {};
  ids.filter((id) => id !== mimic).forEach((id, i) => { who[id] = whos[i % whos.length]; });
  m.Q = {
    mimic, loc, board, who, step: 0, acks: {}, asker: null, lastAsker: null, asked: [], askCount: 0,
    accusedBy: {}, accusation: null, votes: {}, remain: T(m, 'qRound') * 1000, guess: null, guessWhy: null,
    finalVotes: {}, result: null, history: [],
  };
  for (const id of ids) {
    const p = m.players.find((x) => x.id === id);
    if (id === mimic) {
      Object.assign(p, { roleId: 'Q_MIMIC', originalRoleId: 'Q_MIMIC', alignment: ROLES.Q_MIMIC.alignment });
      priv(m, id, 'You are the Mimic. Listen, blend in, and work out where everyone is.', 'role', { card: 'Q_MIMIC' });
    } else {
      priv(m, id, ['You are Living. The place: {where}. You are {who}.', { where: SCENARIO.WHERE[loc], who: SCENARIO.WHO[who[id]] }], 'role', { card: 'Q_LIVING' });
    }
  }
  pub(m, ['Everyone looks at their card. One of you is the Mimic.', {}], 'phase', { ev: 'q-start', board: [...board] });
  enter(m, 'Q_INTRO', now, T(m, 'qIntro'));
}

// ── Questions ──────────────────────────────────────────────────────────────
/** Open (or reopen) the questions with the time left on the clock; no time left goes to the final vote. */
function openQuestions(m, now) {
  const st = Q(m);
  st.step++;
  if (st.remain <= 0) return openFinal(m, now);
  enter(m, 'Q_ASK', now, 0);
  m.deadline = T(m, 'qRound') > 0 ? now + st.remain : null;
}

/** Stop the clock, keeping the time left. */
function pause(m, now) {
  const st = Q(m);
  if (m.phase === 'Q_ASK' && m.deadline) st.remain = Math.max(0, m.deadline - now);
}

function ask(m, p, to, now) {
  const st = Q(m);
  if (st.asker !== p.id) throw new GameError('Only the player holding the lantern asks.');
  if (to === p.id) throw new GameError('Ask someone else.');
  if (!m.players.some((x) => x.id === to)) throw new GameError('Pick a player at the table.');
  if (to === st.lastAsker && m.players.length > 2) throw new GameError('You cannot ask back the player who just asked you.');
  st.asked.push({ by: p.id, to, n: ++st.askCount });
  if (st.asked.length > ASKED_KEEP) st.asked.shift();
  st.history.push({ kind: 'ask', by: p.id, to });
  st.lastAsker = p.id;
  st.asker = to;
  pub(m, ['{a} asks {b}.', { a: nameOf(m, p.id), b: nameOf(m, to) }], 'info', { ev: 'q-ask', by: p.id, to });
  bump(m);
}

// ── Accusations ────────────────────────────────────────────────────────────
function accuse(m, p, target, now) {
  const st = Q(m);
  if (st.accusedBy[p.id]) throw new GameError('You have already made your accusation this game.');
  if (target === p.id) throw new GameError('Accuse someone else.');
  if (!m.players.some((x) => x.id === target)) throw new GameError('Pick a player at the table.');
  pause(m, now);
  st.accusedBy[p.id] = true;
  st.accusation = { by: p.id, target };
  st.votes = { [p.id]: true };
  st.history.push({ kind: 'accuse', by: p.id, target });
  pub(m, ['{a} accuses {b} of being the Mimic.', { a: nameOf(m, p.id), b: nameOf(m, target) }], 'phase', { ev: 'q-accuse', by: p.id, target });
  enter(m, 'Q_VOTE', now, T(m, 'qVote'));
}

const voters = (m) => seatOrder(m).filter((id) => id !== Q(m).accusation?.target);

function closeVote(m, now) {
  const st = Q(m);
  const a = st.accusation;
  const vs = voters(m);
  const yes = vs.filter((id) => st.votes[id] === true);
  const unanimous = yes.length === vs.length;
  st.history.push({ kind: 'vote', target: a.target, by: a.by, votes: { ...st.votes }, unanimous });
  if (!unanimous) {
    pub(m, ['The table is divided: no conviction. The questions go on.', {}], 'phase', { ev: 'q-verdict', target: a.target, by: a.by, convicted: false, votes: { ...st.votes } });
    st.accusation = null;
    st.votes = {};
    return openQuestions(m, now);
  }
  return convict(m, now, a.target, { by: a.by, votes: { ...st.votes }, how: 'accuse' });
}

/** The table convicts a player: the Mimic is caught (last guess, if on), or a Living player was wrongly convicted. */
function convict(m, now, target, { by = null, votes = {}, how }) {
  const st = Q(m);
  const isMimic = target === st.mimic;
  pub(m, isMimic ? ['{a} is the Mimic!', { a: nameOf(m, target) }] : ['{a} was Living. The Mimic fooled the table.', { a: nameOf(m, target) }],
    'phase', { ev: 'q-verdict', target, by, convicted: true, mimic: isMimic, votes, how });
  if (!isMimic) return finish(m, now, 'MIMIC', 'wrong', { target, by });
  if (m.config.lastGuess) {
    st.guessWhy = 'caught';
    st.caughtBy = by;
    st.accusation = null;
    return enter(m, 'Q_GUESS', now, T(m, 'qGuess'));
  }
  return finish(m, now, 'LIVING', 'caught', { target, by });
}

// ── The Mimic's guess ──────────────────────────────────────────────────────
function unmask(m, p, now) {
  const st = Q(m);
  if (p.id !== st.mimic) throw new GameError('Only the Mimic can unmask.');
  pause(m, now);
  st.guessWhy = 'unmask';
  st.history.push({ kind: 'unmask', by: p.id });
  pub(m, ['{a} unmasks: the Mimic will name the place.', { a: nameOf(m, p.id) }], 'phase', { ev: 'q-unmask', by: p.id });
  enter(m, 'Q_GUESS', now, T(m, 'qGuess'));
}

function guess(m, now, loc) {
  const st = Q(m);
  st.guess = loc;
  const right = loc === st.loc;
  const caught = st.guessWhy === 'caught';
  pub(m, right ? ['The Mimic names {where}, and it is right.', { where: SCENARIO.WHERE[loc] }] : loc == null ? ['The Mimic names no place.', {}] : ['The Mimic names {where}. Wrong.', { where: SCENARIO.WHERE[loc] }],
    'phase', { ev: 'q-guess', loc, right, caught, mimic: st.mimic });
  if (right) return finish(m, now, 'MIMIC', caught ? 'lastGuess' : 'guess', { target: caught ? st.mimic : null, by: st.caughtBy ?? null });
  return finish(m, now, 'LIVING', caught ? 'caught' : 'guessWrong', { target: st.mimic, by: st.caughtBy ?? null });
}

// ── Time's up: the final vote ──────────────────────────────────────────────
function openFinal(m, now) {
  const st = Q(m);
  st.remain = 0;
  st.finalVotes = {};
  pub(m, ['Time is up. Everyone points at one suspect.', {}], 'phase', { ev: 'q-time' });
  enter(m, 'Q_FINAL', now, T(m, 'qFinal'));
}

function closeFinal(m, now) {
  const st = Q(m);
  const tally = {};
  for (const v of Object.values(st.finalVotes)) tally[v] = (tally[v] || 0) + 1;
  const top = Math.max(0, ...Object.values(tally));
  const leaders = Object.keys(tally).filter((id) => tally[id] === top);
  st.history.push({ kind: 'final', votes: { ...st.finalVotes } });
  if (!top || leaders.length !== 1) {
    pub(m, ['The table cannot agree. The Mimic slips away.', {}], 'phase', { ev: 'q-verdict', target: null, convicted: false, final: true, votes: { ...st.finalVotes }, tally });
    return finish(m, now, 'MIMIC', 'escaped', {});
  }
  return convict(m, now, leaders[0], { votes: { ...st.finalVotes }, how: 'final' });
}

// ── The end ────────────────────────────────────────────────────────────────
const LINES = {
  caught: 'The Mimic is caught. The Living win.',
  guessWrong: 'The Mimic named the wrong place. The Living win.',
  wrong: 'The table convicted a living friend. The Mimic wins.',
  escaped: 'The Mimic slipped away. The Mimic wins.',
  guess: 'The Mimic named the place. The Mimic wins.',
  lastGuess: 'Caught, but the Mimic named the place. The Mimic wins.',
};

function finish(m, now, side, how, { target = null, by = null } = {}) {
  const st = Q(m);
  st.result = { side, how, target, by, guess: st.guess };
  m.winner = 'MIMIC';
  const sc = (m.qScores ||= {});
  for (const id of seatOrder(m)) sc[id] = sc[id] || 0;
  if (side === 'LIVING') {
    for (const id of seatOrder(m)) if (id !== st.mimic) sc[id] += 1;
    if (by && by !== st.mimic) sc[by] += 1;
  } else sc[st.mimic] += how === 'guess' ? 3 : 2;
  m.qMatch.played++;
  m.endReason = [LINES[how], {}];
  const pids = side === 'LIVING' ? seatOrder(m).filter((id) => id !== st.mimic) : [st.mimic];
  pub(m, m.endReason, 'end', { ev: 'end', winner: 'MIMIC', side, how, pids, mimic: st.mimic, loc: st.loc, reason: m.endReason });
  enter(m, 'ENDED', now, Q_RETURN_SECONDS);
}

// ── Commands ───────────────────────────────────────────────────────────────
export function mimicCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const st = Q(m);
  const need = (...phases) => { if (!phases.includes(m.phase)) throw new GameError('That window has closed.', 'STALE'); };
  switch (type) {
    case 'q.ack':
      need('Q_INTRO');
      st.acks[p.id] = true;
      if (seatOrder(m).every((id) => st.acks[id])) return beginQuestions(m, now);
      return bump(m);
    case 'q.ask': need('Q_ASK'); return ask(m, p, String(payload.to ?? ''), now);
    case 'q.accuse': need('Q_ASK'); return accuse(m, p, String(payload.target ?? ''), now);
    case 'q.unmask': need('Q_ASK'); return unmask(m, p, now);
    case 'q.vote': {
      need('Q_VOTE');
      if (!voters(m).includes(p.id)) throw new GameError('The accused does not vote.');
      if (p.id === st.accusation.by) throw new GameError('You made the accusation: your vote is Agree.');
      st.votes[p.id] = !!payload.yes;
      if (voters(m).every((id) => st.votes[id] != null)) return closeVote(m, now);
      return bump(m);
    }
    case 'q.guess': {
      need('Q_GUESS');
      if (p.id !== st.mimic) throw new GameError('Only the Mimic names the place.');
      const loc = Number(payload.loc);
      if (!st.board.includes(loc)) throw new GameError('Pick a place on the board.');
      return guess(m, now, loc);
    }
    case 'q.final': {
      need('Q_FINAL');
      const t = payload.target == null ? null : String(payload.target);
      if (t === p.id) throw new GameError('Point at someone else.');
      if (t && !m.players.some((x) => x.id === t)) throw new GameError('Pick a player at the table.');
      if (t) st.finalVotes[p.id] = t; else delete st.finalVotes[p.id];
      if (seatOrder(m).every((id) => st.finalVotes[id])) return closeFinal(m, now);
      return bump(m);
    }
    default: throw new GameError('Unknown command.');
  }
}

function beginQuestions(m, now) {
  const st = Q(m);
  const ids = seatOrder(m);
  st.asker = ids[RNG.int(ids.length, 'qfirst')];
  pub(m, ['{a} holds the lantern and asks the first question.', { a: nameOf(m, st.asker) }], 'phase', { ev: 'q-open', asker: st.asker });
  openQuestions(m, now);
}

export function mimicAdvance(m, rng, now) {
  RNG = rng;
  switch (m.phase) {
    case 'Q_INTRO': return beginQuestions(m, now);
    case 'Q_ASK': Q(m).remain = 0; return openFinal(m, now);
    case 'Q_VOTE': return closeVote(m, now);
    case 'Q_GUESS': return guess(m, now, null);
    case 'Q_FINAL': return closeFinal(m, now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const Q_ADVANCE_LABEL = { Q_INTRO: 'Start the questions', Q_ASK: 'End the questions', Q_VOTE: 'Close the vote', Q_GUESS: 'Close the guess', Q_FINAL: 'Close the final vote' };

// ── Views ──────────────────────────────────────────────────────────────────
export function mimicPublic(m) {
  const st = Q(m);
  if (!st) return null;
  const ended = m.phase === 'ENDED';
  const finalOpen = m.phase === 'Q_FINAL';
  return {
    board: st.board, asker: st.asker, lastAsker: st.lastAsker, asked: st.asked, askCount: st.askCount,
    accusation: st.accusation, votes: m.phase === 'Q_VOTE' ? st.votes : {}, accusedBy: Object.keys(st.accusedBy),
    acked: m.phase === 'Q_INTRO' ? Object.keys(st.acks) : [], guessWhy: m.phase === 'Q_GUESS' ? st.guessWhy : null,
    // The final vote: who has pointed, not at whom, until it closes.
    finalIn: finalOpen ? Object.keys(st.finalVotes) : [],
    remain: m.phase === 'Q_ASK' ? null : st.remain, round: T(m, 'qRound') * 1000,
    tvHint: !!m.config.tvHint,
    result: ended ? { ...st.result, mimic: st.mimic, loc: st.loc, who: st.who, history: st.history } : null,
    scores: m.qScores ?? {}, match: m.qMatch,
  };
}

export function mimicMe(m, p) {
  const st = Q(m);
  if (!st) return {};
  const out = { accused: !!st.accusedBy[p.id], vote: st.votes[p.id] ?? null, final: st.finalVotes[p.id] ?? null };
  if (p.id === st.mimic) out.mimic = true;
  else { out.loc = st.loc; out.who = st.who[p.id]; }
  return out;
}

export function mimicAction(m, p) {
  const st = Q(m);
  switch (m.phase) {
    case 'Q_INTRO': return { type: 'qintro', done: !!st.acks[p.id] };
    case 'Q_ASK': return { type: 'qask', asker: st.asker === p.id, canAccuse: !st.accusedBy[p.id], lastAsker: st.lastAsker };
    case 'Q_VOTE': {
      const a = st.accusation;
      if (a.target === p.id) return { type: 'qaccused' };
      if (a.by === p.id) return { type: 'qaccuser' };
      return { type: 'qvote', choice: st.votes[p.id] ?? null };
    }
    case 'Q_GUESS': return p.id === st.mimic ? { type: 'qguess' } : { type: 'qwait' };
    case 'Q_FINAL': return { type: 'qfinal', choice: st.finalVotes[p.id] ?? null };
    default: return { type: 'none' };
  }
}

export function mimicProgress(m) {
  const st = Q(m);
  if (m.phase === 'Q_INTRO') return { label: 'ready', done: Object.keys(st.acks).length, total: m.players.length };
  if (m.phase === 'Q_VOTE') { const vs = voters(m); return { label: 'votes in', done: vs.filter((id) => st.votes[id] != null).length, total: vs.length }; }
  if (m.phase === 'Q_FINAL') return { label: 'votes in', done: Object.keys(st.finalVotes).length, total: m.players.length };
  return null;
}

/**
 * For TV boards only (never phones): the true place, so the board can draw it deeply blurred behind
 * the places and sharpen it as time runs out. A trust option, off by default: the board URL is open.
 */
export const mimicBoardHint = (m) => (Q(m) && m.config?.tvHint && isMimicPhase(m.phase) ? { loc: Q(m).loc } : null);

export const mimicSecrets = (m) => (Q(m) ? { mimic: Q(m).mimic, loc: Q(m).loc, who: Q(m).who } : null);
