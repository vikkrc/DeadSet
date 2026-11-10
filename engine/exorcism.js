// Dead Set: Exorcism — a word game of bluff (see EXORCISM.md).
//
// A crystal ball shows everyone the category. The Living also see the
// password; the Demon (one, or two at bigger tables) sees only the category,
// and maybe a vague hint. A lottery picks who speaks first, then everyone in
// seat order says ONE word linked to the password and confirms on their phone.
// The table then names the Demon. Miss, and the Demon wins. Catch them, and the
// Demon gets one guess at the password: right, and the Demon still wins.

import { GameError, byId, nameOf, pub, priv } from './state.js';
import { shuffle } from './rng.js';
import { ROLES } from './content.js';
import { CATEGORIES, CATEGORY_IDS, categoryById, sameWord } from './words.js';

export const X_PHASES = ['X_REVEAL', 'X_LOTTERY', 'X_CLUES', 'X_DISCUSS', 'X_VOTE', 'X_GUESS'];
export const isExorcismPhase = (ph) => typeof ph === 'string' && ph.startsWith('X_');
export const X_MIN = 3;
export const X_MAX = 12;
export const X_LOTTERY_SECONDS = 9;
/** Seconds on the end screen before the table returns to the lobby (same settings, scores kept). */
export const X_RETURN_SECONDS = 40;

/** Exorcism defaults (settings.x). */
export const X_DEFAULTS = {
  demons: 1,            // 1, or 2 from 7 players
  demonsKnow: false,    // with two Demons: do they know each other?
  hint: 'none',         // the Demon's vague hint: none | length | initial
  categories: CATEGORY_IDS,
  grid: true,           // a 4×4 grid of 16 words on the TV (and on phones); the password is one of them
  typed: false,         // speakers type their word too (shown on the TV), or just say it aloud
  rounds: 1,            // clue rounds (1–3)
  tie: 'demon',         // a tied vote: the Demon escapes, or a coin decides
  guess: true,          // a caught Demon gets one guess at the password
};
export const X_TIMER_DEFAULTS = { xClue: 30, xDiscuss: 90, xVote: 45, xGuess: 45 };

const T = (m, key) => m.settings.timers?.[key] ?? X_TIMER_DEFAULTS[key] ?? 0;
const bump = (m) => { m.stateVersion++; };
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
const isDemon = (m, id) => byId(m, id)?.roleId === 'X_DEMON';
export const xSettings = (s) => ({ ...X_DEFAULTS, ...(s.x || {}) });

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.X?.turn ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

// ── Settings ───────────────────────────────────────────────────────────────
export function applyExorcismPatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const x = xSettings(s);
  if ([1, 2].includes(Number(patch.demons))) x.demons = Number(patch.demons);
  if (typeof patch.demonsKnow === 'boolean') x.demonsKnow = patch.demonsKnow;
  if (['none', 'length', 'initial'].includes(patch.hint)) x.hint = patch.hint;
  if (Array.isArray(patch.categories)) x.categories = CATEGORY_IDS.filter((id) => patch.categories.includes(id));
  if (typeof patch.grid === 'boolean') x.grid = patch.grid;
  if (typeof patch.typed === 'boolean') x.typed = patch.typed;
  if ([1, 2, 3].includes(Number(patch.rounds))) x.rounds = Number(patch.rounds);
  if (['demon', 'coin'].includes(patch.tie)) x.tie = patch.tie;
  if (typeof patch.guess === 'boolean') x.guess = patch.guess;
  s.x = x;
}

export function validateExorcism(n, settings) {
  const x = xSettings(settings);
  const errors = [];
  const warnings = [];
  if (n < X_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: X_MIN, n }]);
  if (n > X_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'Exorcism', n: X_MAX }]);
  if (!x.categories.length) errors.push('Switch on at least one category.');
  if (x.demons === 2 && n < 7) errors.push('Two Demons need at least 7 players.');
  if (x.demons === 1 && n >= 10) warnings.push('At 10 or more players, two Demons keep the hunt tense.');
  if (x.hint !== 'none' && n <= 4) warnings.push('A hint makes the Demon very hard to catch at a small table.');
  return { ok: errors.length === 0, errors, warnings, publicDeck: n >= X_MIN && n <= X_MAX ? { exact: { X_LIVING: n - x.demons, X_DEMON: x.demons } } : null, suggestions: [] };
}

// ── Start ──────────────────────────────────────────────────────────────────
export function startExorcism(m, rng, now, { forceRoles = null, forceWord = null } = {}) {
  const n = m.players.length;
  const x = xSettings(m.settings);
  let roles;
  if (forceRoles) roles = forceRoles;
  else roles = shuffle(rng, [...Array(x.demons).fill('X_DEMON'), ...Array(n - x.demons).fill('X_LIVING')], 'deal');
  if (roles.length !== n || !roles.includes('X_DEMON')) throw new GameError('Role assignment failed validation.');
  m.players.forEach((p, i) => {
    Object.assign(p, {
      roleId: roles[i], originalRoleId: roles[i], alignment: ROLES[roles[i]].alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  const pool = x.categories.length ? x.categories : CATEGORY_IDS;
  const cat = categoryById(forceWord?.category ?? pool[rng.int(pool.length, 'xcat')]);
  // The grid: 16 of the category's 20 words; the password is one of them.
  const all = Array.from({ length: cat.words.en.length }, (_, i) => i);
  const grid = shuffle(rng, all, 'xgrid').slice(0, 16);
  const word = forceWord?.word ?? (x.grid ? grid[rng.int(grid.length, 'xword')] : rng.int(all.length, 'xword'));
  if (x.grid && !grid.includes(word)) grid[0] = word;
  m.config = { mode: 'exorcism', preset: 'exorcism', exorcism: true, ...x, lang: m.settings.lang || 'en' };
  m.activeRules = [];
  m.scenario = null;
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
  m.M = null;
  m.xScores ||= {};
  m.X = {
    category: cat.id, word, grid: x.grid ? grid : null,
    order: [], first: null, turn: 0, round: 1, clues: [], ready: {}, votes: {}, tally: null, named: null, guess: null,
    demons: m.players.filter((p) => p.roleId === 'X_DEMON').map((p) => p.id),
  };
  const lang = m.config.lang;
  for (const p of m.players) {
    if (p.roleId === 'X_DEMON') {
      priv(m, p.id, ['You are the Demon. The category is {category}. You do not know the password.', { category: cat.id }], 'role');
      const h = hintFor(cat, word, x.hint, lang);
      if (h) priv(m, p.id, h, 'xhint');
      if (x.demonsKnow && m.X.demons.length > 1) priv(m, p.id, ['The other Demon is {b}.', { b: nameOf(m, m.X.demons.find((id) => id !== p.id)) }], 'death');
    } else priv(m, p.id, ['You are Living. The category is {category}. The password is in your crystal ball.', { category: cat.id }], 'role');
  }
  pub(m, ['The crystal ball clouds over. The category: {category}.', { category: cat.id }], 'phase', { ev: 'x-start', category: cat.id });
  enter(m, 'X_REVEAL', now, 0);
}

/** The Demon's vague hint, or null. */
function hintFor(cat, word, kind, lang) {
  const w = (cat.words[lang] ?? cat.words.en)[word];
  if (kind === 'length') return [w.includes(' ') ? 'A whisper: the password is a few words, {n} letters in all.' : 'A whisper: the password has {n} letters.', { n: w.replace(/[^\p{L}]/gu, '').length }];
  if (kind === 'initial') return ['A whisper: the password begins with {x}.', { x: w[0].toUpperCase() }];
  return null;
}

/** What a player knows. */
export function xKnowledge(m, p) {
  const X = m.X;
  if (!X) return {};
  const x = m.config;
  if (p.roleId === 'X_DEMON') {
    const out = { demon: true, category: X.category };
    const cat = categoryById(X.category);
    if (x.hint !== 'none') out.hint = { kind: x.hint, ...hintData(cat, X.word, x.hint, x.lang) };
    if (x.demonsKnow) out.demonMates = X.demons.filter((id) => id !== p.id).map((id) => ({ id, name: nameOf(m, id) }));
    return out;
  }
  return { demon: false, category: X.category, word: X.word };
}
function hintData(cat, word, kind, lang) {
  const w = (cat.words[lang] ?? cat.words.en)[word];
  return kind === 'length' ? { n: w.replace(/[^\p{L}]/gu, '').length } : { x: w[0].toUpperCase() };
}

// ── Flow ───────────────────────────────────────────────────────────────────
function openLottery(m, rng, now) {
  const order = seatOrder(m);
  const first = order[rng.int(order.length, 'leader')];
  m.X.first = first;
  const i = order.indexOf(first);
  m.X.order = [...order.slice(i), ...order.slice(0, i)];
  pub(m, ['The lots are drawn: {a} speaks first.', { a: nameOf(m, first) }], 'phase', { ev: 'x-lottery', leader: first, order, spins: 2 });
  enter(m, 'X_LOTTERY', now, X_LOTTERY_SECONDS);
}

function openTurn(m, now) {
  const X = m.X;
  enter(m, 'X_CLUES', now, T(m, 'xClue'));
  X.turnOpenedAt = now;
}

function nextTurn(m, now) {
  const X = m.X;
  X.turn++;
  if (X.turn >= X.order.length * m.config.rounds) return openDiscussion(m, now);
  X.round = Math.floor(X.turn / X.order.length) + 1;
  if (X.turn % X.order.length === 0) pub(m, ['Round {n}: once more around the table.', { n: X.round }], 'phase', { ev: 'x-round', n: X.round });
  openTurn(m, now);
}

export const speakerNow = (m) => (m.phase === 'X_CLUES' ? m.X.order[m.X.turn % m.X.order.length] : null);

function recordClue(m, pid, word, now, { timeout = false } = {}) {
  const X = m.X;
  const w = typeof word === 'string' ? word.replace(/\s+/g, ' ').trim().slice(0, 32) : '';
  X.clues.push({ pid, word: m.config.typed && w ? w : null, round: X.round, timeout });
  pub(m, [timeout ? '{a} ran out of time.' : (m.config.typed && w ? '{a} says: {word}.' : '{a} has spoken.'), { a: nameOf(m, pid), word: w }], 'mission',
    { ev: 'x-clue', pid, word: m.config.typed && w ? w : null, round: X.round, timeout });
  nextTurn(m, now);
}

function openDiscussion(m, now) {
  m.X.ready = {};
  pub(m, 'Every word is said. Talk it over: who does not know the password?', 'phase', { ev: 'x-discuss' });
  enter(m, 'X_DISCUSS', now, T(m, 'xDiscuss'));
}

function openVote(m, now) {
  m.X.votes = {};
  pub(m, 'Name the Demon. One vote each.', 'phase', { ev: 'x-vote' });
  enter(m, 'X_VOTE', now, T(m, 'xVote'));
}

function resolveVote(m, rng, now) {
  const X = m.X;
  const tally = {};
  for (const t of Object.values(X.votes)) tally[t] = (tally[t] || 0) + 1;
  const top = Math.max(0, ...Object.values(tally));
  const tied = Object.keys(tally).filter((id) => tally[id] === top);
  X.tally = tally;
  let named = null;
  let coin = false;
  if (tied.length === 1) named = tied[0];
  else if (tied.length > 1 && m.config.tie === 'coin') { named = tied[rng.int(tied.length, 'coin')]; coin = true; }
  X.named = named;
  const caught = !!named && isDemon(m, named);
  pub(m, [!named ? (tied.length ? 'The vote is tied between {names}. The Demon slips away.' : 'Nobody was named. The Demon slips away.') : caught ? 'The table names {b}, and {b} is the Demon!' : 'The table names {b}, but {b} is one of the Living.', { b: named ? nameOf(m, named) : '', names: tied.map((id) => nameOf(m, id)) }],
    caught ? 'mission' : 'death', { ev: 'x-votes', votes: { ...X.votes }, tally, named, demon: caught, tied: tied.length > 1 ? tied : null, coin });
  if (!caught) return endExorcism(m, 'DEMON', named ? 'The table named one of the Living. The Demon wins.' : 'The Demon was never named. The Demon wins.', now);
  if (!m.config.guess) return endExorcism(m, 'NON_DEATH', 'The Demon was caught and cast out.', now);
  pub(m, ['{b} is caught, but gets one guess at the password.', { b: nameOf(m, named) }], 'phase', { ev: 'x-guessing', pid: named });
  enter(m, 'X_GUESS', now, T(m, 'xGuess'));
}

function resolveGuess(m, pid, payload, now) {
  const X = m.X;
  const cat = categoryById(X.category);
  const words = cat.words[m.config.lang] ?? cat.words.en;
  let hit = false;
  let said = null;
  if (payload && Number.isInteger(payload.index) && payload.index >= 0 && payload.index < words.length) { said = words[payload.index]; hit = payload.index === X.word; }
  else if (payload && typeof payload.text === 'string' && payload.text.trim()) { said = payload.text.trim().slice(0, 40); hit = sameWord(said, words[X.word]) || sameWord(said, cat.words.en[X.word]); }
  X.guess = { pid, said, index: Number.isInteger(payload?.index) ? payload.index : null, hit };
  pub(m, [hit ? '{a} guesses {said}, and it is the password! The Demon wins.' : (said ? '{a} guesses {said}. Wrong: the password was {word}.' : '{a} could not guess. The password was {word}.'), { a: nameOf(m, pid), said: said ?? '', word: words[X.word] }], hit ? 'death' : 'mission',
    { ev: 'x-guess', pid, said, index: X.guess.index, hit, word: X.word });
  endExorcism(m, hit ? 'DEMON' : 'NON_DEATH', hit ? 'Caught, but the Demon named the password. The Demon wins.' : 'The Demon was caught and missed the password. The Living win.', now);
}

function endExorcism(m, winner, reason, now) {
  m.winner = winner;
  m.endReason = reason;
  const S = (m.xScores ||= {});
  for (const p of m.players) {
    const demon = p.roleId === 'X_DEMON';
    if ((winner === 'DEMON' && demon) || (winner === 'NON_DEATH' && !demon)) S[p.id] = (S[p.id] || 0) + (demon ? 2 : 1);
  }
  pub(m, ['{label} {reason}', { label: [winner === 'DEMON' ? 'The Demon wins.' : 'The Living win.', {}], reason: [reason, {}] }], 'end', { ev: 'end', winner, reason });
  enter(m, 'ENDED', now, X_RETURN_SECONDS);
}

/**
 * The host draws another word (too many people did not know it): the round is
 * dealt afresh, new word and new roles, and nothing is scored. Only before the
 * vote, so nobody can use it to escape a verdict.
 */
export const X_REDRAW_PHASES = ['X_REVEAL', 'X_LOTTERY', 'X_CLUES', 'X_DISCUSS'];
export function redrawExorcism(m, rng, now) {
  if (!X_REDRAW_PHASES.includes(m.phase)) throw new GameError('A new word can only be drawn before the vote.');
  const old = { category: m.X.category, word: m.X.word };
  for (let tries = 0; tries < 6; tries++) {
    startExorcism(m, rng, now);
    if (m.X.category !== old.category || m.X.word !== old.word) break;
  }
  pub(m, 'The host drew another word. This round is not scored.', 'host', { ev: 'x-redraw' });
}

// ── Commands ───────────────────────────────────────────────────────────────
export function exorcismCommand(m, p, type, payload, rng, now) {
  const X = m.X;
  const need = (phase) => { if (m.phase !== phase) throw new GameError('That window has closed.', 'STALE'); };
  switch (type) {
    case 'x.ack':
      need('X_REVEAL');
      p.acknowledged = true;
      if (m.players.every((x) => x.acknowledged)) openLottery(m, rng, now);
      return;
    case 'x.done':
      need('X_CLUES');
      if (speakerNow(m) !== p.id) throw new GameError('It is not your turn.');
      recordClue(m, p.id, payload.word, now);
      return;
    case 'x.ready':
      need('X_DISCUSS');
      X.ready[p.id] = payload.ready !== false;
      if (m.players.every((x) => X.ready[x.id])) openVote(m, now);
      return;
    case 'x.vote':
      need('X_VOTE');
      if (payload.target === p.id) throw new GameError('You cannot name yourself.');
      if (!byId(m, payload.target)) throw new GameError('Pick another player.');
      X.votes[p.id] = payload.target;
      if (m.players.every((x) => x.id in X.votes)) resolveVote(m, rng, now);
      return;
    case 'x.guess':
      need('X_GUESS');
      if (p.id !== X.named) throw new GameError('Only the caught Demon guesses.');
      if (m.config.grid && !(Number.isInteger(payload.index) && X.grid.includes(payload.index))) throw new GameError('Pick a word from the grid.');
      resolveGuess(m, p.id, payload, now);
      return;
    default: throw new GameError('Unknown command.');
  }
}

/** Host "advance" and timers. */
export function exorcismAdvance(m, rng, now) {
  switch (m.phase) {
    case 'X_REVEAL': pub(m, 'The host starts the reading.', 'phase'); openLottery(m, rng, now); break;
    case 'X_LOTTERY': openTurn(m, now); break;
    case 'X_CLUES': recordClue(m, speakerNow(m), null, now, { timeout: true }); break;
    case 'X_DISCUSS': openVote(m, now); break;
    case 'X_VOTE': resolveVote(m, rng, now); break;
    case 'X_GUESS': resolveGuess(m, m.X.named, null, now); break;
    default: throw new GameError('Nothing to advance.');
  }
}

export const X_ADVANCE_LABEL = {
  X_REVEAL: 'Start the reading', X_LOTTERY: 'Skip the draw', X_CLUES: 'Skip this speaker', X_DISCUSS: 'Open the vote', X_VOTE: 'Lock the vote', X_GUESS: 'End the guess',
};

// ── Views ──────────────────────────────────────────────────────────────────
export function exorcismPublic(m) {
  const X = m.X;
  if (!X) return null;
  const ended = m.phase === 'ENDED';
  return {
    category: X.category, grid: X.grid, rounds: m.config.rounds, typed: m.config.typed, hint: m.config.hint, guessOn: m.config.guess, demonCount: X.demons.length,
    order: X.order, first: X.first, turn: X.turn, round: X.round, speaker: speakerNow(m),
    clues: X.clues,
    ready: m.phase === 'X_DISCUSS' ? Object.keys(X.ready).filter((id) => X.ready[id]) : undefined,
    voted: m.phase === 'X_VOTE' ? Object.keys(X.votes) : undefined,
    votes: X.tally ? X.votes : undefined,
    tally: X.tally, named: X.named, guess: X.guess,
    word: ended ? X.word : undefined,
    demons: ended || X.tally ? (ended ? X.demons : X.named && isDemon(m, X.named) ? [X.named] : undefined) : undefined,
    scores: m.xScores ?? {},
  };
}

export function exorcismAction(m, p) {
  const X = m.X;
  switch (m.phase) {
    case 'X_REVEAL': return { type: 'xack', done: p.acknowledged };
    case 'X_LOTTERY': return { type: 'mlottery' };
    case 'X_CLUES': return speakerNow(m) === p.id ? { type: 'xspeak', typed: m.config.typed } : { type: 'xlisten', speaker: speakerNow(m) };
    case 'X_DISCUSS': return { type: 'xready', ready: !!X.ready[p.id] };
    case 'X_VOTE': return { type: 'xvote', choice: X.votes[p.id] ?? null, targets: m.players.filter((x) => x.id !== p.id).map((x) => x.id) };
    case 'X_GUESS': return X.named === p.id ? { type: 'xguess', grid: X.grid } : { type: 'xwait', named: X.named };
    default: return { type: 'none' };
  }
}

export function exorcismProgress(m) {
  const X = m.X;
  switch (m.phase) {
    case 'X_REVEAL': return { label: 'are ready', done: m.players.filter((p) => p.acknowledged).length, total: m.players.length };
    case 'X_CLUES': return { label: 'have spoken', done: X.turn, total: X.order.length * m.config.rounds };
    case 'X_DISCUSS': return { label: 'ready to vote', done: Object.values(X.ready).filter(Boolean).length, total: m.players.length };
    case 'X_VOTE': return { label: 'votes in', done: Object.keys(X.votes).length, total: m.players.length };
    default: return null;
  }
}

export const exorcismSecrets = (m) => ({ word: m.X?.word ?? null, demons: m.X?.demons ?? [], votes: m.X?.votes ?? {} });
export { CATEGORIES };
