// Dead Set: Carnival — a masked ball of bluff and memory (see CARNIVAL.md).
//
// Everyone is dealt a mask (a familiar role card), sees the whole ball once,
// then the masks are shuffled, for real or in pretence, until nobody is sure
// what they wear. On your turn: swap or pretend with another mask, peek at
// your own, or claim a mask to use its power. Anyone who thinks they wear the
// claimed mask may challenge; revealed liars pay a Soul into the Offering.
// Win with a full purse (13 Souls), Death's harvest (6 reaped by Death
// claims), or be the richest when someone is ruined.

import { GameError, nameOf, pub, priv } from './state.js';
import { ROLES } from './content.js';

export const K_PHASES = ['K_UNMASK', 'K_LOTTERY', 'K_TURN', 'K_CHALLENGE', 'K_POWER'];
export const isCarnivalPhase = (ph) => typeof ph === 'string' && ph.startsWith('K_');
export const K_MIN = 4;
export const K_MAX = 12;
export const K_UNMASK_SECONDS = 10;
export const K_LOTTERY_SECONDS = 9;
export const K_RETURN_SECONDS = 60;

/** Every mask that can be in play, in the order the reference sheet lists them. */
export const MASKS = ['DEATH', 'CONSPIRATOR', 'DIPLOMAT', 'MAGISTRATE', 'GAMBLER', 'RIPPER', 'BARD', 'GUARDIAN', 'MENTALIST', 'ORACLE', 'WITCH', 'DOUBLE_AGENT', 'MIMIC', 'JESTER', 'SCAPEGOAT', 'INNOCENT'];
/** The recommended set: six for 4–6 players, then one more per seat. */
const BASE_SET = ['DEATH', 'CONSPIRATOR', 'WITCH', 'MENTALIST', 'MAGISTRATE', 'GAMBLER'];
const ADD_ORDER = ['RIPPER', 'GUARDIAN', 'DOUBLE_AGENT', 'JESTER', 'BARD', 'INNOCENT'];
export const recommendedMasks = (n) => [...BASE_SET, ...ADD_ORDER.slice(0, Math.max(0, n - 6))];
/** Masks whose power needs a choice from its user. */
const PICK = new Set(['DEATH', 'MENTALIST', 'ORACLE', 'WITCH', 'DOUBLE_AGENT', 'JESTER', 'SCAPEGOAT']);

/** Carnival defaults (settings.k). */
export const K_DEFAULTS = {
  masks: 'recommended', // or 'custom' (then `pool` lists the masks)
  pool: [],
  target: 13,           // a full purse: 8–20
  harvest: 6,           // Death's harvest: 0 (off) or 2–12, even
  start: 6,             // starting Souls
  penalty: 1,           // a wrong claim or challenge costs 1 or 2
  dance: 1,             // the opening dance: forced Swap-or-pretend turns each (1 or 2)
  diary: false,         // the ball diary (Notes): a private log of what you have seen
  games: 1,             // games per match: 1 or 3
};
export const K_TIMER_DEFAULTS = { kTurn: 45, kChallenge: 10, kPower: 20 };

let RNG = null;
const T = (m, key) => m.settings.timers?.[key] ?? K_TIMER_DEFAULTS[key] ?? 0;
const bump = (m) => { m.stateVersion++; };
export const kSettings = (s) => ({ ...K_DEFAULTS, ...(s.k || {}) });
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
const K = (m) => m.K;

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.K?.turnNo ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

// ── Settings ───────────────────────────────────────────────────────────────
export function applyCarnivalPatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const k = kSettings(s);
  if (['recommended', 'custom'].includes(patch.masks)) k.masks = patch.masks;
  if (Array.isArray(patch.pool)) k.pool = [...new Set(patch.pool.filter((id) => MASKS.includes(id)))];
  const n = Number(patch.target);
  if (Number.isInteger(n) && n >= 8 && n <= 20) k.target = n;
  const h = Number(patch.harvest);
  if (Number.isInteger(h) && (h === 0 || (h >= 2 && h <= 12 && h % 2 === 0))) k.harvest = h;
  if ([1, 2].includes(Number(patch.penalty))) k.penalty = Number(patch.penalty);
  if ([1, 2].includes(Number(patch.dance))) k.dance = Number(patch.dance);
  if ([1, 3].includes(Number(patch.games))) k.games = Number(patch.games);
  if (typeof patch.diary === 'boolean') k.diary = patch.diary;
  if (k.masks === 'custom' && !k.pool.length) k.pool = recommendedMasks(Math.max(6, (patch.n ?? 6)));
  s.k = k;
}

/** The masks this table plays with: one per seat (empty chairs fill to six). */
export function masksFor(n, settings) {
  const k = kSettings(settings);
  const need = Math.max(6, n);
  if (k.masks !== 'custom') return recommendedMasks(n).slice(0, need);
  const pool = k.pool.includes('DEATH') ? k.pool : ['DEATH', ...k.pool];
  const out = pool.slice(0, need);
  while (out.length < need) out.push('INNOCENT');
  return out;
}

export function validateCarnival(n, settings) {
  const k = kSettings(settings);
  const errors = [];
  const warnings = [];
  if (n < K_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: K_MIN, n }]);
  if (n > K_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'Carnival', n: K_MAX }]);
  const need = Math.max(6, n);
  if (k.masks === 'custom') {
    if (!k.pool.includes('DEATH')) errors.push('Death must be one of the masks.');
    if (k.pool.length > need) errors.push(['Pick exactly {n} masks (one per seat).', { n: need }]);
    else if (k.pool.length < need) warnings.push(['{n} masks short: Innocents fill the rest.', { n: need - k.pool.length }]);
  }
  if (k.harvest && k.harvest >= k.target) warnings.push('Death\'s harvest is as high as the full purse.');
  return { ok: errors.length === 0, errors, warnings, publicDeck: { exact: Object.fromEntries(countBy(masksFor(Math.max(K_MIN, n), settings))) }, suggestions: [] };
}
const countBy = (list) => { const c = new Map(); for (const x of list) c.set(x, (c.get(x) || 0) + 1); return [...c]; };

// ── Helpers ────────────────────────────────────────────────────────────────
/** All seats at the ball: players in seat order, then the empty chairs. */
export const seatsOf = (m) => [...seatOrder(m), ...m.K.chairs];
const isChair = (m, id) => m.K.chairs.includes(id);
const players = (m) => seatOrder(m);
/** The two players beside `id` (chairs never act). */
function neighbours(m, id) {
  const o = players(m);
  const i = o.indexOf(id);
  const out = [o[(i + o.length - 1) % o.length], o[(i + 1) % o.length]].filter((x) => x !== id);
  return [...new Set(out)];
}
const seatName = (m, id) => (isChair(m, id) ? ['An empty chair', {}] : nameOf(m, id));

// What each player believes about each seat: { mask, p }. Used by the practice bots only; never sent to anyone.
function believeAll(m, seat) {
  const S = K(m);
  for (const o of players(m)) (S.belief[o] ||= {})[seat] = { mask: S.masks[seat], p: 1 };
}
function believe(m, o, seat) { (K(m).belief[o] ||= {})[seat] = { mask: K(m).masks[seat], p: 1 }; }
function blur(m, a, b, knower) {
  const S = K(m);
  for (const o of players(m)) {
    if (o === knower) { believe(m, o, a); believe(m, o, b); continue; }
    const B = (S.belief[o] ||= {});
    const A0 = B[a] ?? { mask: null, p: 0 };
    const B0 = B[b] ?? { mask: null, p: 0 };
    const pick = (stay, come) => (stay.p >= come.p ? { mask: stay.mask, p: stay.p * 0.5 } : { mask: come.mask, p: come.p * 0.5 });
    B[a] = pick(A0, B0);
    B[b] = pick(B0, A0);
  }
}

/** Move up to `n` Souls. `from`/`to`: a player id, 'bank' or 'offering'. Returns what moved. */
function pay(m, from, to, n, { shieldable = false } = {}) {
  const S = K(m);
  if (shieldable && from !== 'bank' && from !== 'offering' && S.shield[from]) return 0;
  const have = from === 'bank' ? n : from === 'offering' ? S.offering : S.souls[from];
  const amt = Math.max(0, Math.min(n, have));
  if (from === 'offering') S.offering -= amt; else if (from !== 'bank') S.souls[from] -= amt;
  if (to === 'offering') S.offering += amt; else if (to !== 'bank') S.souls[to] += amt;
  return amt;
}

// ── Start ──────────────────────────────────────────────────────────────────
export function startCarnival(m, rng, now) {
  RNG = rng;
  const k = kSettings(m.settings);
  m.players.forEach((p) => {
    Object.assign(p, {
      roleId: 'K_GUEST', originalRoleId: 'K_GUEST', alignment: ROLES.K_GUEST.alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  m.config = { mode: 'carnival', preset: 'carnival', carnival: true, ...k, harvestOn: k.harvest > 0 };
  Object.assign(m, { activeRules: [], scenario: null, history: [], publicLog: [], privateLog: {}, chats: {}, day: null, night: null,
    dayNumber: 0, nightNumber: 0, winner: null, endReason: null, M: null, X: null, C: null });
  m.kScores ||= {};
  m.kMatch = m.kMatch && m.kMatch.played < m.kMatch.total && m.kMatch.total === k.games ? m.kMatch : { played: 0, total: k.games };
  if (m.kMatch.played === 0) m.kScores = {};
  const order = seatOrder(m);
  const chairs = order.length < 6 ? Array.from({ length: 6 - order.length }, (_, i) => `chair${i + 1}`) : [];
  const deck = masksFor(order.length, m.settings);
  // Shuffle the deck onto the seats.
  for (let i = deck.length - 1; i > 0; i--) { const j = rng.int(i + 1, 'kdeal'); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  const seats = [...order, ...chairs];
  m.K = {
    chairs, masks: Object.fromEntries(seats.map((id, i) => [id, deck[i]])), inPlay: [...new Set(deck)].sort((a, b) => MASKS.indexOf(a) - MASKS.indexOf(b)),
    souls: Object.fromEntries(order.map((id) => [id, k.start])), harvest: Object.fromEntries(order.map((id) => [id, 0])), offering: 0,
    shield: {}, forced: Object.fromEntries(order.map((id) => [id, k.dance])), turn: null, turnNo: 0, first: null,
    claim: null, power: null, prevClaim: null, thisClaim: null, last: null,
    belief: {}, timeline: [], liar: {}, eye: {}, winners: null, where: rng.int(15, 'kwhere'),
  };
  for (const s of seats) believeAll(m, s);
  pub(m, 'The ball begins. For a moment, every mask is shown.', 'phase', { ev: 'k-unmask', masks: { ...m.K.masks } });
  enter(m, 'K_UNMASK', now, K_UNMASK_SECONDS);
}

function lottery(m, now) {
  const S = K(m);
  const order = players(m);
  const first = order[RNG.int(order.length, 'leader')];
  S.first = first;
  pub(m, ['The masks turn face down. {a} dances first.', { a: nameOf(m, first) }], 'phase', { ev: 'k-lottery', leader: first, order, spins: 2 });
  enter(m, 'K_LOTTERY', now, K_LOTTERY_SECONDS);
}

function beginTurn(m, pid, now) {
  const S = K(m);
  S.turn = pid;
  S.turnNo++;
  S.prevClaim = S.thisClaim;
  S.thisClaim = null;
  S.claim = null;
  S.power = null;
  delete S.shield[pid]; // the Guardian's shield lasts until your next turn
  enter(m, 'K_TURN', now, T(m, 'kTurn'));
}

function endTurn(m, now) {
  if (m.phase === 'ENDED') return;
  const S = K(m);
  const o = players(m);
  beginTurn(m, o[(o.indexOf(S.turn) + 1) % o.length], now);
}

const note = (m, pid, msg, extra = {}) => priv(m, pid, msg, 'look', { kturn: K(m).turnNo, ...extra });

// ── The three turn actions ────────────────────────────────────────────────
function swap(m, by, a, b, real, now, { power = null } = {}) {
  const S = K(m);
  if (real) [S.masks[a], S.masks[b]] = [S.masks[b], S.masks[a]];
  blur(m, a, b, by);
  S.timeline.push({ n: S.turnNo, by, kind: power ? 'witch' : 'swap', a, b, real });
  if (power) pub(m, ['{a} lifts two masks under the cloak: {b} and {c}.', { a: nameOf(m, by), b: seatName(m, a), c: seatName(m, b) }], 'mission', { ev: 'k-swap', by, a, b, power });
  else pub(m, ['{a} dances with {b}: two masks under the cloak.', { a: nameOf(m, by), b: seatName(m, b) }], 'mission', { ev: 'k-swap', by, a, b });
}

function startClaim(m, pid, mask, now) {
  const S = K(m);
  S.claim = { by: pid, mask, answers: {} };
  S.thisClaim = mask;
  pub(m, ['{a} claims: "I am the {role}."', { a: nameOf(m, pid), role: mask }], 'mission', { ev: 'k-claim', by: pid, mask });
  enter(m, 'K_CHALLENGE', now, T(m, 'kChallenge'));
}

function resolveClaim(m, now) {
  const S = K(m);
  const { by, mask, answers } = S.claim;
  const challengers = players(m).filter((id) => id !== by && answers[id] === 'mine');
  if (!challengers.length) {
    if (S.masks[by] !== mask) S.liar[by] = (S.liar[by] || 0) + 1;
    S.timeline.push({ n: S.turnNo, by, kind: 'claim', mask, challengers: [], truth: S.masks[by] });
    pub(m, ['Nobody challenges. {a} uses the {role}.', { a: nameOf(m, by), role: mask }], 'mission', { ev: 'k-unchallenged', by, mask });
    return usePower(m, by, mask, by, now);
  }
  const revealed = [by, ...challengers];
  const reveal = Object.fromEntries(revealed.map((id) => [id, S.masks[id]]));
  const holders = revealed.filter((id) => S.masks[id] === mask);
  const paid = {};
  for (const id of revealed) if (!holders.includes(id)) paid[id] = pay(m, id, 'offering', m.config.penalty);
  for (const id of challengers) if (holders.includes(id)) S.eye[id] = (S.eye[id] || 0) + 1;
  for (const id of revealed) believeAll(m, id);
  S.timeline.push({ n: S.turnNo, by, kind: 'claim', mask, challengers, reveal, holders });
  pub(m, holders.length ? ['The masks are lifted. The true {role}: {names}.', { role: mask, names: holders.map((id) => nameOf(m, id)) }] : ['The masks are lifted. Nobody revealed is the {role}.', { role: mask }],
    'mission', { ev: 'k-reveal', by, mask, reveal, holders, paid });
  if (checkWin(m, by, now)) return;
  if (!holders.length) return endTurn(m, now);
  if (holders.length > 1) { // only duplicate Innocents
    for (const h of holders) pay(m, 'bank', h, 1);
    pub(m, ['Each true {role} takes a Soul.', { role: mask }], 'mission', { ev: 'k-power', user: holders[0], users: holders, mask, gain: 1 });
    if (checkWin(m, by, now)) return;
    return endTurn(m, now);
  }
  return usePower(m, holders[0], mask, by, now);
}

// ── Powers ─────────────────────────────────────────────────────────────────
function usePower(m, user, mask, actor, now, { mimic = false } = {}) {
  const S = K(m);
  const done = (msg, extra) => {
    pub(m, msg, 'mission', { ev: 'k-power', user, mask, mimic, ...extra });
    if (!checkWin(m, actor, now)) endTurn(m, now);
  };
  switch (mask) {
    case 'CONSPIRATOR': pay(m, 'bank', user, 3); return done(['{a} takes 3 Souls.', { a: nameOf(m, user) }], { gain: 3 });
    case 'DIPLOMAT': pay(m, 'bank', user, 2); return done(['{a} takes 2 Souls.', { a: nameOf(m, user) }], { gain: 2 });
    case 'INNOCENT': pay(m, 'bank', user, 1); return done(['{a} takes a Soul.', { a: nameOf(m, user) }], { gain: 1 });
    case 'MAGISTRATE': { const n = pay(m, 'offering', user, S.offering); return done(['{a} empties the Offering: {n} Souls.', { a: nameOf(m, user), n }], { gain: n }); }
    case 'GUARDIAN': pay(m, 'bank', user, 1); S.shield[user] = true; return done(['{a} takes a Soul and raises a shield until their next turn.', { a: nameOf(m, user) }], { gain: 1, shield: true });
    case 'GAMBLER': {
      const heads = RNG.int(2, 'kcoin') === 0;
      const n = heads ? pay(m, 'bank', user, 3) : -pay(m, user, 'offering', 1);
      return done([heads ? 'Heads! {a} takes 3 Souls.' : 'Tails. {a} pays a Soul into the Offering.', { a: nameOf(m, user) }], { coin: heads ? 'heads' : 'tails', gain: n });
    }
    case 'RIPPER': {
      const got = {};
      for (const nb of neighbours(m, user)) got[nb] = pay(m, nb, user, 1, { shieldable: true });
      return done(['{a} takes a Soul from each neighbour.', { a: nameOf(m, user) }], { from: got, gain: Object.values(got).reduce((s, x) => s + x, 0) });
    }
    case 'BARD': {
      const who = [user, ...neighbours(m, user)];
      for (const id of who) pay(m, 'bank', id, 1);
      return done(['{a} and both neighbours take a Soul each.', { a: nameOf(m, user) }], { users: who, gain: 1 });
    }
    case 'MIMIC': {
      const copy = S.prevClaim;
      if (copy && copy !== 'MIMIC') {
        pub(m, ['{a} mimics the {role}.', { a: nameOf(m, user), role: copy }], 'mission', { ev: 'k-mimic', user, mask: copy });
        return usePower(m, user, copy, actor, now, { mimic: true });
      }
      pay(m, 'bank', user, 1);
      return done(['Nothing to mimic: {a} takes a Soul.', { a: nameOf(m, user) }], { gain: 1 });
    }
    default:
      if (!PICK.has(mask)) return done(['{a} uses the {role}.', { a: nameOf(m, user), role: mask }], {});
      S.power = { user, mask, actor, mimic };
      pub(m, ['{a} uses the {role}…', { a: nameOf(m, user), role: mask }], 'mission', { ev: 'k-powerpick', user, mask });
      return enter(m, 'K_POWER', now, T(m, 'kPower'));
  }
}

/** Targets for a power that needs a choice. */
function powerTargets(m, user, mask) {
  const others = seatsOf(m).filter((id) => id !== user);
  const otherPlayers = players(m).filter((id) => id !== user);
  switch (mask) {
    case 'DEATH': case 'JESTER': case 'SCAPEGOAT': return otherPlayers;
    default: return others;
  }
}

function applyPower(m, payload, now) {
  const S = K(m);
  const { user, mask, actor, mimic } = S.power;
  const targets = powerTargets(m, user, mask);
  const need = (id) => { if (!targets.includes(id)) throw new GameError('Pick someone at the ball.'); return id; };
  const done = (msg, extra) => {
    S.power = null;
    pub(m, msg, 'mission', { ev: 'k-power', user, mask, mimic, ...extra });
    if (!checkWin(m, actor, now)) endTurn(m, now);
  };
  switch (mask) {
    case 'DEATH': {
      const t = need(payload.target);
      const n = pay(m, t, user, 2, { shieldable: true });
      if (m.config.harvestOn) S.harvest[user] += n;
      return done([n ? '{a} reaps {n} Souls from {b}.' : '{b} is shielded. Death reaps nothing.', { a: nameOf(m, user), b: nameOf(m, t), n }], { target: t, gain: n, harvest: m.config.harvestOn ? S.harvest[user] : 0 });
    }
    case 'SCAPEGOAT': {
      const t = need(payload.target);
      const n = pay(m, t, 'offering', 2);
      return done(['{b} pays {n} Souls into the Offering.', { b: nameOf(m, t), n }], { target: t, lost: n });
    }
    case 'JESTER': {
      const t = need(payload.target);
      if (!S.inPlay.includes(payload.mask)) throw new GameError('Name a mask in play.');
      const right = S.masks[t] === payload.mask;
      const n = right ? pay(m, t, user, 2, { shieldable: true }) : -pay(m, user, 'offering', 1);
      return done([right ? 'Right! {b} pays the Jester {n}.' : 'Wrong. The Jester pays a Soul into the Offering.', { b: nameOf(m, t), n: Math.abs(n) }], { target: t, guess: payload.mask, right, gain: n });
    }
    case 'MENTALIST': {
      const t = need(payload.target);
      believe(m, user, t);
      note(m, user, ['The mask of {a}: {role}.', { a: seatName(m, t), role: S.masks[t] }], { seat: t, mask: S.masks[t] });
      S.timeline.push({ n: S.turnNo, by: user, kind: 'look', seats: [t], secret: true });
      return done('The Mentalist reads someone\'s mask.', {});
    }
    case 'ORACLE': {
      const a = need(payload.targets?.[0]);
      const b = need(payload.targets?.[1]);
      if (a === b) throw new GameError('Pick two different masks.');
      for (const t of [a, b]) { believe(m, user, t); note(m, user, ['The mask of {a}: {role}.', { a: seatName(m, t), role: S.masks[t] }], { seat: t, mask: S.masks[t] }); }
      S.timeline.push({ n: S.turnNo, by: user, kind: 'look', seats: [a, b] });
      return done(['The Oracle gazes at {a} and {b}.', { a: seatName(m, a), b: seatName(m, b) }], { seats: [a, b] });
    }
    case 'WITCH': {
      const a = need(payload.targets?.[0]);
      const b = need(payload.targets?.[1]);
      if (a === b) throw new GameError('Pick two different masks.');
      S.power = null;
      swap(m, user, a, b, !!payload.real, now, { power: 'WITCH' });
      if (!checkWin(m, actor, now)) endTurn(m, now);
      return undefined;
    }
    case 'DOUBLE_AGENT': {
      const t = need(payload.target);
      [S.masks[user], S.masks[t]] = [S.masks[t], S.masks[user]];
      for (const o of players(m)) { const B = (S.belief[o] ||= {}); [B[user], B[t]] = [B[t], B[user]]; }
      believe(m, user, user);
      note(m, user, ['Your new mask: {role}.', { role: S.masks[user] }], { seat: user, mask: S.masks[user] });
      S.timeline.push({ n: S.turnNo, by: user, kind: 'swap', a: user, b: t, real: true, agent: true });
      return done(['{a} trades masks with {b}, for real.', { a: nameOf(m, user), b: seatName(m, t) }], { target: t, seats: [user, t] });
    }
    default: throw new GameError('Unknown power.');
  }
}

function randomPower(m) {
  const S = K(m);
  const { user, mask } = S.power;
  const ts = powerTargets(m, user, mask);
  const pick = () => ts[RNG.int(ts.length, 'kauto')];
  const two = () => { const a = pick(); let b = pick(); while (b === a && ts.length > 1) b = pick(); return [a, b]; };
  if (mask === 'ORACLE' || mask === 'WITCH') return { targets: two(), real: RNG.int(2, 'kauto') === 0 };
  if (mask === 'JESTER') return { target: pick(), mask: S.inPlay[RNG.int(S.inPlay.length, 'kauto')] };
  return { target: pick() };
}

// ── Winning ────────────────────────────────────────────────────────────────
/** Checked after every action. `actor` (the claimant) wins if two conditions trigger at once. */
function checkWin(m, actor, now) {
  const S = K(m);
  const ps = players(m);
  const purse = ps.filter((id) => S.souls[id] >= m.config.target);
  const reaped = m.config.harvestOn ? ps.filter((id) => S.harvest[id] >= m.config.harvest) : [];
  const ruined = ps.filter((id) => S.souls[id] <= 0);
  const kinds = [purse.length, reaped.length, ruined.length].filter(Boolean).length;
  if (!kinds) return false;
  const best = (list) => { const top = Math.max(...list.map((id) => S.souls[id])); return list.filter((id) => S.souls[id] === top); };
  if (kinds > 1 && actor && (purse.includes(actor) || reaped.includes(actor) || ruined.length)) return endCarnival(m, [actor], purse.includes(actor) ? 'purse' : reaped.includes(actor) ? 'harvest' : 'ruin', now);
  if (purse.length) return endCarnival(m, purse.includes(actor) ? [actor] : best(purse), 'purse', now);
  if (reaped.length) return endCarnival(m, reaped.includes(actor) ? [actor] : reaped.slice(0, 1), 'harvest', now);
  // Ruin: the richest wins; a tie goes to the higher Harvest; still tied, they share.
  let top = best(ps);
  if (top.length > 1) { const h = Math.max(...top.map((id) => S.harvest[id])); top = top.filter((id) => S.harvest[id] === h); }
  return endCarnival(m, top, 'ruin', now, ruined);
}

function endCarnival(m, winners, how, now, ruined = []) {
  const S = K(m);
  S.winners = winners;
  m.winner = 'CARNIVAL';
  m.kWinners = winners;
  const names = winners.map((id) => nameOf(m, id));
  const msg = how === 'purse' ? ['{names} fills the purse and wins.', { names }]
    : how === 'harvest' ? ['Death came for its due: {names} wins the harvest.', { names }]
      : [winners.length > 1 ? '{b} is ruined. The richest share the win: {names}.' : '{b} is ruined. The richest wins: {names}.', { b: ruined.map((id) => nameOf(m, id)), names }];
  m.endReason = msg;
  const sc = (m.kScores ||= {});
  for (const id of players(m)) sc[id] = (sc[id] || 0) + (winners.includes(id) ? 3 : Math.max(0, S.souls[id] - 6));
  m.kMatch.played++;
  pub(m, msg, 'end', { ev: 'end', winner: 'CARNIVAL', pids: winners, pid: winners[0], how, reason: msg });
  enter(m, 'ENDED', now, K_RETURN_SECONDS);
  return true;
}

// ── Commands ───────────────────────────────────────────────────────────────
export function carnivalCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const S = K(m);
  const need = (phase) => { if (m.phase !== phase) throw new GameError('That window has closed.', 'STALE'); };
  const myTurn = () => { need('K_TURN'); if (S.turn !== p.id) throw new GameError('It is not your turn.'); };
  switch (type) {
    case 'k.swap': {
      myTurn();
      const t = payload.target;
      if (t === p.id || !seatsOf(m).includes(t)) throw new GameError('Pick another mask at the ball.');
      swap(m, p.id, p.id, t, !!payload.real, now);
      if (S.forced[p.id] > 0) S.forced[p.id]--;
      return endTurn(m, now);
    }
    case 'k.peek': {
      myTurn();
      if (S.forced[p.id] > 0) throw new GameError('The opening dance: swap or pretend first.');
      believe(m, p.id, p.id);
      note(m, p.id, ['You lift your mask: {role}.', { role: S.masks[p.id] }], { seat: p.id, mask: S.masks[p.id], peek: true });
      S.timeline.push({ n: S.turnNo, by: p.id, kind: 'peek' });
      pub(m, ['{a} lifts their mask for a moment.', { a: nameOf(m, p.id) }], 'mission', { ev: 'k-peek', by: p.id });
      return endTurn(m, now);
    }
    case 'k.claim': {
      myTurn();
      if (S.forced[p.id] > 0) throw new GameError('The opening dance: swap or pretend first.');
      if (!S.inPlay.includes(payload.mask)) throw new GameError('Name a mask in play.');
      return startClaim(m, p.id, payload.mask, now);
    }
    case 'k.answer': {
      need('K_CHALLENGE');
      if (p.id === S.claim.by) throw new GameError('You made the claim.');
      S.claim.answers[p.id] = payload.mine ? 'mine' : 'pass';
      if (players(m).filter((id) => id !== S.claim.by).every((id) => S.claim.answers[id])) return resolveClaim(m, now);
      return bump(m);
    }
    case 'k.power': {
      need('K_POWER');
      if (S.power?.user !== p.id) throw new GameError('That window has closed.', 'STALE');
      return applyPower(m, payload, now);
    }
    default: throw new GameError('Unknown command.');
  }
}

/** Host "advance" and timers. A turn defaults to Peek (a forced dance turn to a pretence); a power pick to a random choice. */
export function carnivalAdvance(m, rng, now) {
  RNG = rng;
  const S = K(m);
  switch (m.phase) {
    case 'K_UNMASK': return lottery(m, now);
    case 'K_LOTTERY': return beginTurn(m, S.first, now);
    case 'K_TURN': {
      const id = S.turn;
      if (S.forced[id] > 0) {
        const ts = seatsOf(m).filter((x) => x !== id);
        swap(m, id, id, ts[rng.int(ts.length, 'kauto')], false, now);
        S.forced[id]--;
        return endTurn(m, now);
      }
      believe(m, id, id);
      note(m, id, ['You lift your mask: {role}.', { role: S.masks[id] }], { seat: id, mask: S.masks[id], peek: true });
      S.timeline.push({ n: S.turnNo, by: id, kind: 'peek', auto: true });
      pub(m, ['{a} lifts their mask for a moment.', { a: nameOf(m, id) }], 'mission', { ev: 'k-peek', by: id, auto: true });
      return endTurn(m, now);
    }
    case 'K_CHALLENGE':
      for (const id of players(m)) if (id !== S.claim.by && !S.claim.answers[id]) S.claim.answers[id] = 'pass';
      return resolveClaim(m, now);
    case 'K_POWER': return applyPower(m, randomPower(m), now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const K_ADVANCE_LABEL = {
  K_UNMASK: 'Hide the masks', K_LOTTERY: 'Skip the draw', K_TURN: 'Peek for them', K_CHALLENGE: 'Close the challenges', K_POWER: 'Choose for them',
};

// ── Views ──────────────────────────────────────────────────────────────────
export function carnivalPublic(m) {
  const S = K(m);
  if (!S) return null;
  const ended = m.phase === 'ENDED';
  const open = ended || m.phase === 'K_UNMASK';
  return {
    seats: seatsOf(m).map((id) => ({
      id, chair: isChair(m, id), souls: isChair(m, id) ? null : S.souls[id], harvest: isChair(m, id) ? null : S.harvest[id],
      shield: !!S.shield[id], forced: isChair(m, id) ? 0 : S.forced[id], mask: open ? S.masks[id] : null,
    })),
    offering: S.offering, turn: S.turn, turnNo: S.turnNo, first: S.first, inPlay: S.inPlay,
    deck: countBy(Object.values(S.masks)).map(([id, n]) => ({ id, n })).sort((a, b) => MASKS.indexOf(a.id) - MASKS.indexOf(b.id)),
    claim: S.claim ? { by: S.claim.by, mask: S.claim.mask, answered: Object.keys(S.claim.answers) } : null,
    power: S.power ? { user: S.power.user, mask: S.power.mask } : null,
    prevClaim: S.prevClaim,
    target: m.config.target, harvestTarget: m.config.harvestOn ? m.config.harvest : 0, penalty: m.config.penalty, diary: !!m.config.diary,
    where: S.where,
    timeline: ended ? S.timeline : undefined,
    liar: ended ? S.liar : undefined, eye: ended ? S.eye : undefined,
    winners: S.winners, scores: m.kScores ?? {}, match: m.kMatch,
  };
}

export function carnivalMe(m, p) {
  const S = K(m);
  if (!S) return {};
  return { forced: S.forced[p.id] ?? 0, shield: !!S.shield[p.id] };
}

export function carnivalAction(m, p) {
  const S = K(m);
  switch (m.phase) {
    case 'K_UNMASK': return { type: 'kunmask' };
    case 'K_LOTTERY': return { type: 'mlottery' };
    case 'K_TURN':
      if (S.turn !== p.id) return { type: 'kwatch', turn: S.turn };
      return { type: 'kturn', forced: S.forced[p.id] ?? 0, targets: seatsOf(m).filter((id) => id !== p.id), masks: S.inPlay };
    case 'K_CHALLENGE':
      if (S.claim.by === p.id) return { type: 'kwatch', claim: true };
      return { type: 'kanswer', by: S.claim.by, mask: S.claim.mask, answer: S.claim.answers[p.id] ?? null };
    case 'K_POWER':
      if (S.power.user !== p.id) return { type: 'kwatch', power: true };
      return { type: 'kpower', mask: S.power.mask, targets: powerTargets(m, p.id, S.power.mask), masks: S.inPlay, two: ['ORACLE', 'WITCH'].includes(S.power.mask), real: S.power.mask === 'WITCH' };
    default: return { type: 'none' };
  }
}

export function carnivalProgress(m) {
  const S = K(m);
  if (m.phase === 'K_CHALLENGE') { const others = players(m).filter((id) => id !== S.claim.by); return { label: 'answers in', done: others.filter((id) => S.claim.answers[id]).length, total: others.length }; }
  return null;
}

/** The private log a player gets back: with the ball diary off, only this turn's sightings (and the welcome). */
export function carnivalPrivate(m, p, list) {
  const S = K(m);
  if (!S || m.config.diary || m.phase === 'ENDED') return list;
  return list.filter((e) => e.kturn === undefined || e.kturn >= S.turnNo - 1);
}

/** The bots' beliefs (server only). */
export const carnivalBelief = (m, pid) => K(m)?.belief?.[pid] ?? {};

/** The moderator sees every mask. */
export const carnivalSecrets = (m) => (K(m) ? { masks: { ...K(m).masks } } : null);
