// Dead Set: Coffins — a quick bluffing game (see COFFINS.md).
//
// Everyone holds coffin cards: Gold, and one Curse. Each round everyone buries
// one at once, then by turns either buries another or challenges ("I can open
// N"). The bidding goes round; the last bidder digs, opening every one of their
// own coffins first, then others' top coffins. A clean dig wins a challenge;
// two wins the game, as does being the last player with coffins. A curse costs
// the Digger a coffin. Twists: ghost wagers and Revenants, the Death coffin
// (a hidden player each round; whoever digs it up has a coffin stolen), and
// Relics (Lantern, Key, Ward).

import { GameError, byId, nameOf, pub, priv } from './state.js';
import { shuffle } from './rng.js';
import { ROLES } from './content.js';

export const C_PHASES = ['C_LOTTERY', 'C_BURY', 'C_TURN', 'C_BID', 'C_WAGER', 'C_DIG', 'C_LOSE'];
export const isCoffinsPhase = (ph) => typeof ph === 'string' && ph.startsWith('C_');
export const C_MIN = 3;
export const C_MAX = 10;
export const C_LOTTERY_SECONDS = 9;
/** Seconds on the end screen before the table returns to the lobby (settings and scores kept). */
export const C_RETURN_SECONDS = 60;
/** Ghost candles needed to rise. */
export const C_RISE = 3;
export const RELICS = ['LANTERN', 'KEY', 'WARD'];

/** Coffins defaults (settings.c). */
export const C_DEFAULTS = {
  wagers: true,       // ghosts wager on each dig; three right and they rise as Revenants
  deathCoffin: true,  // each round one hidden player holds the Death coffin
  relics: false,      // one secret relic each: Lantern, Key or Ward
  toWin: 2,           // challenges needed to win: 1, 2 or 3
  coffins: 4,         // coffins per player: 4 (3 Gold + Curse) or 5 (4 Gold + Curse)
  games: 1,           // games per match: 1, 3 or 5 (scores carry over)
};
export const C_TIMER_DEFAULTS = { cBury: 20, cTurn: 30, cBid: 20, cDig: 15, cWager: 10 };

let RNG = null; // the room's random source, set on every command and timer
const T = (m, key) => m.settings.timers?.[key] ?? C_TIMER_DEFAULTS[key] ?? 0;
const bump = (m) => { m.stateVersion++; };
export const cSettings = (s) => ({ ...C_DEFAULTS, ...(s.c || {}) });
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.C?.round ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

// ── Settings ───────────────────────────────────────────────────────────────
export function applyCoffinsPatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const c = cSettings(s);
  for (const k of ['wagers', 'deathCoffin', 'relics']) if (typeof patch[k] === 'boolean') c[k] = patch[k];
  if ([1, 2, 3].includes(Number(patch.toWin))) c.toWin = Number(patch.toWin);
  if ([4, 5].includes(Number(patch.coffins))) c.coffins = Number(patch.coffins);
  if ([1, 3, 5].includes(Number(patch.games))) c.games = Number(patch.games);
  s.c = c;
}

export function validateCoffins(n, settings) {
  const c = cSettings(settings);
  const errors = [];
  const warnings = [];
  if (n < C_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: C_MIN, n }]);
  if (n > C_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'Coffins', n: C_MAX }]);
  if (c.toWin === 1 && n >= 7) warnings.push('One challenge to win is very quick at a big table.');
  return { ok: errors.length === 0, errors, warnings, publicDeck: null, suggestions: [] };
}

// ── Helpers over the state ─────────────────────────────────────────────────
const C = (m) => m.C;
/** Players still holding coffins (not ghosts), in seat order. */
export const inGame = (m) => seatOrder(m).filter((id) => !m.C.out[id]);
const owned = (m, id) => m.C.owned[id] ?? [];
const stack = (m, id) => m.C.stacks[id] ?? [];
/** Cards a player still holds in hand this round (owned and not buried). */
export const handOf = (m, id) => {
  const buried = new Set(stack(m, id));
  return owned(m, id).filter((c) => !buried.has(c.id));
};
const cardById = (m, id, cid) => owned(m, id).find((c) => c.id === cid);
/** A card's face as it opens: Gold, Curse, or the Death coffin. */
const face = (m, card) => (card.t === 'C' ? 'C' : m.C.death?.card === card.id ? 'D' : 'G');
export const totalBuried = (m) => Object.values(m.C.stacks).reduce((s, x) => s + x.length, 0);
/** The next player clockwise after `id` among `pool`. */
function nextAfter(m, id, pool) {
  const order = seatOrder(m);
  const set = new Set(pool);
  for (let k = 1; k <= order.length; k++) {
    const x = order[(order.indexOf(id) + k) % order.length];
    if (set.has(x)) return x;
  }
  return null;
}

// ── Start ──────────────────────────────────────────────────────────────────
export function startCoffins(m, rng, now, { forceRoles = null } = {}) {
  RNG = rng;
  const c = cSettings(m.settings);
  m.players.forEach((p) => {
    Object.assign(p, {
      roleId: 'C_DIGGER', originalRoleId: 'C_DIGGER', alignment: ROLES.C_DIGGER.alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  void forceRoles;
  m.config = { mode: 'coffins', preset: 'coffins', coffins: true, ...c };
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
  m.X = null;
  m.cScores ||= {};
  m.cMatch = m.cMatch && m.cMatch.played < m.cMatch.total && m.cMatch.total === c.games ? m.cMatch : { played: 0, total: c.games };
  if (m.cMatch.played === 0) m.cScores = {};
  let n = 0;
  const deal = () => {
    const cards = [];
    for (let i = 0; i < c.coffins - 1; i++) cards.push({ id: `k${n++}`, t: 'G' });
    cards.push({ id: `k${n++}`, t: 'C' });
    return cards;
  };
  m.C = {
    round: 0, owned: {}, stacks: {}, out: {}, wins: {}, candles: {}, risen: {}, relics: {}, wagers: {},
    first: null, turn: null, bid: null, passed: [], digger: null, target: 0, opened: [], keyUsed: false,
    death: null, result: null, history: [], bids: [], where: rng.int(15, 'cwhere'), cardSeq: 0,
  };
  for (const p of m.players) {
    m.C.owned[p.id] = deal();
    m.C.stacks[p.id] = [];
    m.C.wins[p.id] = 0;
    m.C.candles[p.id] = 0;
  }
  m.C.cardSeq = n;
  if (c.relics) {
    for (const p of m.players) {
      const r = RELICS[rng.int(RELICS.length, 'crelic')];
      m.C.relics[p.id] = { id: r, used: false };
      priv(m, p.id, ['Your relic: {relic}. It works once.', { relic: r }], 'role', { relic: r });
    }
  }
  for (const p of m.players) priv(m, p.id, ['You hold {g} Gold coffins and one Curse.', { g: c.coffins - 1 }], 'role');
  pub(m, 'The graveyard opens. Everyone holds their coffins.', 'phase', { ev: 'c-start' });
  // The first gravedigger: the lottery wheel.
  const order = seatOrder(m);
  const first = order[rng.int(order.length, 'leader')];
  m.C.first = first;
  pub(m, ['The lots are drawn: {a} goes first.', { a: nameOf(m, first) }], 'phase', { ev: 'c-lottery', leader: first, order, spins: 2 });
  enter(m, 'C_LOTTERY', now, C_LOTTERY_SECONDS);
}

// ── A round ────────────────────────────────────────────────────────────────
function openRound(m, rng, now) {
  const S = C(m);
  S.round++;
  for (const id of Object.keys(S.stacks)) S.stacks[id] = [];
  S.bid = null;
  S.passed = [];
  S.digger = null;
  S.target = 0;
  S.opened = [];
  S.keyUsed = false;
  S.wagers = {};
  S.result = null;
  S.buried0 = {};
  // The Death coffin: one hidden player, in place of one of their Gold coffins.
  S.death = null;
  if (m.config.deathCoffin) {
    const eligible = inGame(m).filter((id) => owned(m, id).some((c) => c.t === 'G'));
    if (eligible.length) {
      const holder = eligible[rng.int(eligible.length, 'cdeath')];
      const golds = owned(m, holder).filter((c) => c.t === 'G');
      const card = golds[rng.int(golds.length, 'cdeath')].id;
      S.death = { holder, card };
      priv(m, holder, 'You hold the Death coffin this round. Whoever digs it up loses a coffin to you.', 'death', { deathCoffin: true });
    }
  }
  if (!inGame(m).includes(S.first)) S.first = nextAfter(m, S.first, inGame(m)) ?? inGame(m)[0];
  pub(m, ['Round {n}. Everyone buries a coffin.', { n: S.round }], 'phase', { ev: 'c-round', n: S.round, first: S.first });
  enter(m, 'C_BURY', now, T(m, 'cBury'));
}

function bury(m, pid, cardId) {
  const S = C(m);
  const card = cardById(m, pid, cardId);
  if (!card) throw new GameError('Pick one of your coffins.');
  if (stack(m, pid).includes(cardId)) throw new GameError('That coffin is already buried.');
  S.stacks[pid].push(cardId);
}

function closeBurial(m, now) {
  const S = C(m);
  pub(m, 'The first coffins are in the ground.', 'phase', { ev: 'c-buried', counts: Object.fromEntries(inGame(m).map((id) => [id, stack(m, id).length])) });
  S.turn = S.first;
  openTurn(m, now);
}

function openTurn(m, now) {
  enter(m, 'C_TURN', now, T(m, 'cTurn'));
}

function nextTurn(m, now) {
  const S = C(m);
  S.turn = nextAfter(m, S.turn, inGame(m));
  openTurn(m, now);
}

function challenge(m, pid, n, now) {
  const S = C(m);
  const total = totalBuried(m);
  if (!Number.isInteger(n) || n < 1 || n > total) throw new GameError(['Bid between 1 and {n}.', { n: total }]);
  S.bid = { n, by: pid };
  S.passed = [];
  S.bids.push({ round: S.round, pid, n, curse: hasCurseBuried(m, pid) });
  pub(m, ['{a} challenges: "I can open {n}."', { a: nameOf(m, pid), n }], 'mission', { ev: 'c-bid', pid, n, open: true });
  if (n === total) return startDig(m, pid, now);
  advanceBid(m, pid, now);
}
const hasCurseBuried = (m, pid) => stack(m, pid).some((cid) => cardById(m, pid, cid)?.t === 'C');

function raise(m, pid, n, now) {
  const S = C(m);
  const total = totalBuried(m);
  if (!Number.isInteger(n) || n <= S.bid.n || n > total) throw new GameError(['Raise above {a}, up to {b}.', { a: S.bid.n, b: total }]);
  S.bid = { n, by: pid };
  S.bids.push({ round: S.round, pid, n, curse: hasCurseBuried(m, pid) });
  pub(m, ['{a} raises: "I can open {n}."', { a: nameOf(m, pid), n }], 'mission', { ev: 'c-bid', pid, n });
  if (n === total) return startDig(m, pid, now);
  advanceBid(m, pid, now);
}

function passBid(m, pid, now) {
  const S = C(m);
  S.passed.push(pid);
  pub(m, ['{a} passes.', { a: nameOf(m, pid) }], 'mission', { ev: 'c-pass', pid });
  advanceBid(m, pid, now);
}

function advanceBid(m, from, now) {
  const S = C(m);
  // Everyone still in the bidding apart from the high bidder, who never bids against itself.
  const contenders = inGame(m).filter((id) => !S.passed.includes(id) && id !== S.bid.by);
  if (!contenders.length) return startDig(m, S.bid.by, now);
  S.turn = nextAfter(m, from, contenders);
  enter(m, 'C_BID', now, T(m, 'cBid'));
}

// ── The dig ────────────────────────────────────────────────────────────────
function startDig(m, pid, now) {
  const S = C(m);
  S.digger = pid;
  S.target = S.bid.n;
  S.opened = [];
  S.turn = pid;
  pub(m, ['{a} must open {n} coffins, starting with their own.', { a: nameOf(m, pid), n: S.target }], 'phase', { ev: 'c-dig', pid, n: S.target });
  const ghosts = m.players.filter((p) => S.out[p.id]).map((p) => p.id);
  if (m.config.wagers && ghosts.length) {
    S.wagers = {};
    pub(m, 'The ghosts place their wagers.', 'phase', { ev: 'c-wager-open' });
    return enter(m, 'C_WAGER', now, T(m, 'cWager'));
  }
  beginDig(m, now);
}

function beginDig(m, now) {
  const S = C(m);
  const r = S.relics[S.digger];
  enter(m, 'C_DIG', now, T(m, 'cDig'));
  // A Key lets the Digger open someone else's coffin before their own: wait for that choice.
  if (r?.id === 'KEY' && !r.used && othersWithCoffins(m).length) { S.keyPending = true; return; }
  S.keyPending = false;
  openOwn(m, now);
}

const othersWithCoffins = (m) => inGame(m).filter((id) => id !== m.C.digger && topUnopened(m, id) !== null);
/** Index (in the stack) of a plot's top unopened coffin, or null. */
function topUnopened(m, owner) {
  const st = stack(m, owner);
  const done = m.C.opened.filter((o) => o.owner === owner).length;
  const k = st.length - 1 - done;
  return k >= 0 ? k : null;
}

/** Open one coffin; returns its face. Ends the dig on a curse or the Death coffin. */
function openOne(m, owner, now) {
  const S = C(m);
  const k = topUnopened(m, owner);
  if (k === null) throw new GameError('That plot has nothing left to open.');
  const cid = stack(m, owner)[k];
  const f = face(m, cardById(m, owner, cid));
  S.opened.push({ owner, card: cid, face: f });
  pub(m, [f === 'G' ? 'Gold in {a}\'s grave.' : f === 'C' ? 'A curse in {a}\'s grave!' : 'The Death coffin, in {a}\'s grave!', { a: nameOf(m, owner) }],
    f === 'G' ? 'mission' : 'death', { ev: 'c-open', owner, face: f, k: S.opened.length });
  bump(m);
  if (f !== 'G') { resolveDig(m, f, owner, now); return f; }
  if (S.opened.length >= S.target) { resolveDig(m, 'G', null, now); return f; }
  return f;
}

/** The Digger's own grave, top down, until the bid is met or something bites. */
function openOwn(m, now) {
  const S = C(m);
  while (m.phase === 'C_DIG' && topUnopened(m, S.digger) !== null && S.opened.length < S.target) {
    const f = openOne(m, S.digger, now);
    if (f !== 'G') return;
  }
  if (m.phase === 'C_DIG') enter(m, 'C_DIG', now, T(m, 'cDig'));
}

function resolveDig(m, f, owner, now) {
  const S = C(m);
  const d = S.digger;
  const ward = S.relics[d];
  const wardUp = ward?.id === 'WARD' && !ward.used && f !== 'G';
  S.snap = Object.fromEntries(Object.entries(S.stacks).map(([id, st]) => [id, st.map((cid) => face(m, cardById(m, id, cid)))]));
  const res = { digger: d, n: S.target, face: f, owner, opened: S.opened.map((o) => ({ owner: o.owner, face: o.face })), lost: 0, stolenBy: null, ward: false, rose: [], out: [] };
  S.result = res;
  // Ghost wagers
  const clean = f === 'G';
  const wagerRight = [];
  for (const [g, bet] of Object.entries(S.wagers)) {
    if ((bet === 'gold') === clean) { S.candles[g] = (S.candles[g] || 0) + 1; wagerRight.push(g); }
  }
  res.wagers = { ...S.wagers };
  res.wagerRight = wagerRight;
  if (clean) {
    S.wins[d] = (S.wins[d] || 0) + 1;
    pub(m, ['{a} opens all {n}. A clean dig! ({w} of {t})', { a: nameOf(m, d), n: S.target, w: S.wins[d], t: m.config.toWin }], 'mission', { ev: 'c-result', ...res, wins: S.wins[d] });
    S.first = d;
    if (S.wins[d] >= m.config.toWin) return endCoffins(m, d, null, now, 'digs');
    return afterRound(m, now);
  }
  if (wardUp) {
    ward.used = true;
    res.ward = true;
    pub(m, ['{a}\'s Ward holds. The dig fails, but nothing is lost.', { a: nameOf(m, d) }], 'mission', { ev: 'c-result', ...res });
    S.first = f === 'D' && owner !== d ? owner : f === 'C' && owner !== d ? owner : d;
    return afterRound(m, now);
  }
  if (f === 'D') {
    if (owner === d) {
      pub(m, ['{a} dug up their own Death coffin. The dig fails.', { a: nameOf(m, d) }], 'death', { ev: 'c-result', ...res });
      S.first = d;
      return afterRound(m, now);
    }
    // The holder steals one of the Digger's coffins at random; it becomes Gold.
    const mine = owned(m, d);
    const stolen = mine.splice(RNG.int(mine.length, 'csteal'), 1)[0];
    S.owned[owner].push({ id: `k${S.cardSeq++}`, t: 'G' });
    res.stolenBy = owner;
    res.lost = 1;
    priv(m, d, [stolen.t === 'C' ? 'Death took your Curse.' : 'Death took one of your Gold coffins.', {}], 'death');
    pub(m, ['Death! {b} steals one of {a}\'s coffins.', { a: nameOf(m, d), b: nameOf(m, owner) }], 'death', { ev: 'c-result', ...res });
    S.first = owner;
    return checkOut(m, d, now) || afterRound(m, now);
  }
  // A curse
  if (owner === d) {
    // The Digger chooses which coffin to lose, and who starts next.
    pub(m, ['{a} found their own curse!', { a: nameOf(m, d) }], 'death', { ev: 'c-result', ...res, lost: 1, chooses: true });
    S.lose = { pid: d };
    return enter(m, 'C_LOSE', now, T(m, 'cDig'));
  }
  const mine = owned(m, d);
  const lost = mine.splice(RNG.int(mine.length, 'closs'), 1)[0];
  res.lost = 1;
  priv(m, d, [lost.t === 'C' ? '{b} drew your Curse. It is gone.' : '{b} drew one of your Gold coffins. It is gone.', { b: nameOf(m, owner) }], 'death');
  pub(m, ['{b}\'s curse! {a} loses a coffin.', { a: nameOf(m, d), b: nameOf(m, owner) }], 'death', { ev: 'c-result', ...res });
  S.first = owner;
  return checkOut(m, d, now) || afterRound(m, now);
}

function chooseLoss(m, pid, cardId, first, now) {
  const S = C(m);
  const mine = owned(m, pid);
  let i = mine.findIndex((c) => c.id === cardId);
  if (i < 0) i = RNG.int(mine.length, 'closs');
  mine.splice(i, 1);
  const pool = inGame(m);
  S.first = pool.includes(first) ? first : pid;
  S.lose = null;
  pub(m, ['{a} gives up a coffin. {b} starts the next round.', { a: nameOf(m, pid), b: nameOf(m, S.first) }], 'mission', { ev: 'c-lost', pid, first: S.first });
  return checkOut(m, pid, now) || afterRound(m, now);
}

/** A player with no coffins left is out (a ghost). Returns true if the game ended. */
function checkOut(m, pid, now) {
  const S = C(m);
  if (owned(m, pid).length) return false;
  S.out[pid] = true;
  S.candles[pid] = 0;
  if (S.relics[pid]) S.relics[pid].used = true;
  S.result?.out.push(pid);
  pub(m, [m.config.wagers ? '{a} has no coffins left, and joins the ghosts.' : '{a} has no coffins left, and is out.', { a: nameOf(m, pid) }], 'death', { ev: 'c-out', pid });
  return false;
}

function afterRound(m, now) {
  const S = C(m);
  // Last one standing
  const left = inGame(m);
  if (left.length === 1) return endCoffins(m, left[0], null, now, 'last');
  if (left.length === 0) return endCoffins(m, S.digger, null, now, 'last');
  // Ghosts with three candles rise as Revenants: one Gold coffin, no curse.
  if (m.config.wagers) {
    for (const p of m.players) {
      if (S.out[p.id] && (S.candles[p.id] || 0) >= C_RISE) {
        S.out[p.id] = false;
        S.candles[p.id] = 0;
        S.owned[p.id] = [{ id: `k${S.cardSeq++}`, t: 'G' }];
        S.risen[p.id] = (S.risen[p.id] || 0) + 1;
        S.result?.rose.push(p.id);
        pub(m, ['{a} rises from the grave as a Revenant, with one Gold coffin.', { a: nameOf(m, p.id) }], 'mission', { ev: 'c-rise', pid: p.id });
      }
    }
  }
  S.history.push({ round: S.round, ...S.result, death: S.death ? { holder: S.death.holder } : null, stacks: S.snap ?? {} });
  openRound(m, RNG, now);
}

function endCoffins(m, winner, reason, now, how) {
  const S = C(m);
  if (S.result) S.history.push({ round: S.round, ...S.result, death: S.death ? { holder: S.death.holder } : null, stacks: S.snap ?? {} });
  m.winner = 'COFFINS';
  m.cWinner = winner;
  const msg = [how === 'digs' ? (S.wins[winner] === 1 ? '{a} wins with a clean dig.' : '{a} wins with {n} clean digs.') : '{a} wins: the last one with coffins.', { a: nameOf(m, winner), n: S.wins[winner] }];
  m.endReason = msg;
  const sc = (m.cScores ||= {});
  for (const p of m.players) {
    sc[p.id] = (sc[p.id] || 0) + (S.wins[p.id] || 0) + (S.risen[p.id] || 0) + (p.id === winner ? 3 : 0);
  }
  m.cMatch.played++;
  pub(m, msg, 'end', { ev: 'end', winner: 'COFFINS', pid: winner, how, reason: msg });
  enter(m, 'ENDED', now, C_RETURN_SECONDS);
}

// ── Commands ───────────────────────────────────────────────────────────────
export function coffinsCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const S = C(m);
  const need = (phase) => { if (m.phase !== phase) throw new GameError('That window has closed.', 'STALE'); };
  const mustPlay = () => { if (S.out[p.id]) throw new GameError('Ghosts cannot do that.'); };
  switch (type) {
    case 'c.bury': {
      if (m.phase === 'C_BURY') {
        mustPlay();
        if (stack(m, p.id).length) throw new GameError('You have already buried your first coffin.');
        bury(m, p.id, payload.card);
        if (inGame(m).every((id) => stack(m, id).length)) closeBurial(m, now);
        else bump(m);
        return;
      }
      need('C_TURN');
      if (S.turn !== p.id) throw new GameError('It is not your turn.');
      bury(m, p.id, payload.card);
      pub(m, ['{a} buries another coffin.', { a: nameOf(m, p.id) }], 'mission', { ev: 'c-bury', pid: p.id });
      nextTurn(m, now);
      return;
    }
    case 'c.challenge':
      need('C_TURN');
      if (S.turn !== p.id) throw new GameError('It is not your turn.');
      challenge(m, p.id, Number(payload.n), now);
      return;
    case 'c.lantern': {
      need('C_TURN');
      if (S.turn !== p.id) throw new GameError('It is not your turn.');
      const r = S.relics[p.id];
      if (r?.id !== 'LANTERN' || r.used) throw new GameError('You have no Lantern to light.');
      const owner = payload.owner;
      if (owner === p.id || S.out[owner] || !stack(m, owner).length) throw new GameError('Pick another plot with a buried coffin.');
      r.used = true;
      const st = stack(m, owner);
      const f = face(m, cardById(m, owner, st[st.length - 1]));
      priv(m, p.id, [f === 'G' ? 'Your Lantern shows Gold on top of {a}\'s grave.' : f === 'C' ? 'Your Lantern shows a Curse on top of {a}\'s grave.' : 'Your Lantern shows the Death coffin on top of {a}\'s grave.', { a: nameOf(m, owner) }], 'lantern', { owner, face: f });
      pub(m, ['{a} lights a Lantern over {b}\'s grave.', { a: nameOf(m, p.id), b: nameOf(m, owner) }], 'mission', { ev: 'c-lantern', pid: p.id, owner });
      bump(m);
      return;
    }
    case 'c.raise':
      need('C_BID');
      if (S.turn !== p.id) throw new GameError('It is not your turn to bid.');
      raise(m, p.id, Number(payload.n), now);
      return;
    case 'c.pass':
      need('C_BID');
      if (S.turn !== p.id) throw new GameError('It is not your turn to bid.');
      passBid(m, p.id, now);
      return;
    case 'c.wager': {
      need('C_WAGER');
      if (!S.out[p.id]) throw new GameError('Only ghosts wager.');
      if (!['gold', 'curse'].includes(payload.bet)) throw new GameError('Wager Gold or Curse.');
      S.wagers[p.id] = payload.bet;
      if (m.players.filter((x) => S.out[x.id]).every((x) => S.wagers[x.id])) beginDig(m, now);
      else bump(m);
      return;
    }
    case 'c.key': {
      need('C_DIG');
      if (S.digger !== p.id || !S.keyPending) throw new GameError('That window has closed.', 'STALE');
      S.keyPending = false;
      if (payload.owner) {
        if (!othersWithCoffins(m).includes(payload.owner)) throw new GameError('Pick another plot with a buried coffin.');
        S.relics[p.id].used = true;
        pub(m, ['{a} turns a Key in {b}\'s grave first.', { a: nameOf(m, p.id), b: nameOf(m, payload.owner) }], 'mission', { ev: 'c-key', pid: p.id, owner: payload.owner });
        const f = openOne(m, payload.owner, now);
        if (f !== 'G' || m.phase !== 'C_DIG') return;
      }
      openOwn(m, now);
      return;
    }
    case 'c.open': {
      need('C_DIG');
      if (S.digger !== p.id) throw new GameError('Only the Digger opens coffins.');
      if (S.keyPending) throw new GameError('Use your Key or skip it first.');
      if (topUnopened(m, p.id) !== null) throw new GameError('Open your own coffins first.');
      if (payload.owner === p.id || !othersWithCoffins(m).includes(payload.owner)) throw new GameError('Pick another plot with a coffin left.');
      openOne(m, payload.owner, now);
      if (m.phase === 'C_DIG') enter(m, 'C_DIG', now, T(m, 'cDig'));
      return;
    }
    case 'c.lose':
      need('C_LOSE');
      if (S.lose?.pid !== p.id) throw new GameError('That window has closed.', 'STALE');
      chooseLoss(m, p.id, payload.card, payload.first, now);
      return;
    default: throw new GameError('Unknown command.');
  }
}

/** Host "advance" and timers: every timeout has a sensible default. */
export function coffinsAdvance(m, rng, now) {
  RNG = rng;
  const S = C(m);
  const randomCard = (id) => { const h = handOf(m, id); return h[rng.int(h.length, 'cauto')]?.id; };
  switch (m.phase) {
    case 'C_LOTTERY': openRound(m, rng, now); break;
    case 'C_BURY':
      for (const id of inGame(m)) if (!stack(m, id).length) bury(m, id, randomCard(id));
      closeBurial(m, now);
      break;
    case 'C_TURN':
      if (handOf(m, S.turn).length) { bury(m, S.turn, randomCard(S.turn)); pub(m, ['{a} buries another coffin.', { a: nameOf(m, S.turn) }], 'mission', { ev: 'c-bury', pid: S.turn, auto: true }); nextTurn(m, now); } else challenge(m, S.turn, 1, now);
      break;
    case 'C_BID': passBid(m, S.turn, now); break;
    case 'C_WAGER': beginDig(m, now); break;
    case 'C_DIG':
      if (S.keyPending) { S.keyPending = false; openOwn(m, now); break; }
      if (topUnopened(m, S.digger) !== null) { openOwn(m, now); break; }
      { const pool = othersWithCoffins(m); openOne(m, pool[rng.int(pool.length, 'cauto')], now); if (m.phase === 'C_DIG') enter(m, 'C_DIG', now, T(m, 'cDig')); }
      break;
    case 'C_LOSE': chooseLoss(m, S.lose.pid, null, S.lose.pid, now); break;
    default: throw new GameError('Nothing to advance.');
  }
}

export const C_ADVANCE_LABEL = {
  C_LOTTERY: 'Skip the draw', C_BURY: 'Bury for the slow ones', C_TURN: 'Skip this turn', C_BID: 'Pass for them', C_WAGER: 'Close the wagers', C_DIG: 'Dig for them', C_LOSE: 'Choose for them',
};

// ── Views ──────────────────────────────────────────────────────────────────
export function coffinsPublic(m) {
  const S = C(m);
  if (!S) return null;
  const ended = m.phase === 'ENDED';
  const plots = seatOrder(m).map((id) => ({
    id, held: owned(m, id).length, inHand: handOf(m, id).length, buried: stack(m, id).length,
    opened: S.opened.filter((o) => o.owner === id).map((o) => o.face),
    wins: S.wins[id] || 0, out: !!S.out[id], candles: S.candles[id] || 0, risen: S.risen[id] || 0,
    relicUsed: S.relics[id]?.used && !S.out[id] ? S.relics[id].id : null,
    wagered: m.phase === 'C_WAGER' ? !!S.wagers[id] : undefined,
    stack: ended ? stack(m, id).map((cid) => face(m, cardById(m, id, cid) ?? { t: 'G' })) : undefined,
  }));
  return {
    round: S.round, first: S.first, turn: S.turn, bid: S.bid, passed: S.passed, digger: S.digger, target: S.target,
    total: totalBuried(m), opened: S.opened.map((o) => ({ owner: o.owner, face: o.face })), keyPending: !!S.keyPending,
    plots, toWin: m.config.toWin, wagersOn: m.config.wagers, deathOn: m.config.deathCoffin, relicsOn: m.config.relics, rise: C_RISE,
    result: S.result, where: S.where,
    history: ended ? S.history : undefined,
    bids: ended ? S.bids : undefined,
    winner: m.cWinner ?? null,
    scores: m.cScores ?? {}, match: m.cMatch,
  };
}

/** What one player knows: their coffins, what they buried, their relic. */
export function coffinsMe(m, p) {
  const S = C(m);
  if (!S) return {};
  const st = stack(m, p.id);
  const mine = owned(m, p.id).map((c) => ({ id: c.id, face: face(m, c), buried: st.includes(c.id), pos: st.indexOf(c.id) }));
  return {
    cards: mine, holdsDeath: S.death?.holder === p.id && !!owned(m, p.id).find((c) => c.id === S.death.card),
    relic: S.relics[p.id] ?? null, out: !!S.out[p.id], wager: S.wagers[p.id] ?? null,
  };
}

export function coffinsAction(m, p) {
  const S = C(m);
  const out = !!S.out[p.id];
  switch (m.phase) {
    case 'C_LOTTERY': return { type: 'mlottery' };
    case 'C_BURY': return out ? { type: 'cwatch' } : { type: 'cbury', first: true, done: stack(m, p.id).length > 0 };
    case 'C_TURN': {
      if (S.turn !== p.id) return { type: 'cwatch', turn: S.turn };
      const r = S.relics[p.id];
      const lantern = r?.id === 'LANTERN' && !r.used ? inGame(m).filter((id) => id !== p.id && stack(m, id).length) : null;
      return { type: 'cturn', canBury: handOf(m, p.id).length > 0, max: totalBuried(m), lantern };
    }
    case 'C_BID': return S.turn === p.id ? { type: 'cbid', min: S.bid.n + 1, max: totalBuried(m), bid: S.bid } : { type: 'cwatch', turn: S.turn };
    case 'C_WAGER': return out ? { type: 'cwager', bet: S.wagers[p.id] ?? null } : { type: 'cwatch' };
    case 'C_DIG':
      if (S.digger !== p.id) return { type: 'cwatch', digger: S.digger };
      if (S.keyPending) return { type: 'ckey', targets: othersWithCoffins(m) };
      return { type: 'cdig', targets: othersWithCoffins(m), left: S.target - S.opened.length };
    case 'C_LOSE': return S.lose?.pid === p.id ? { type: 'closs', starters: inGame(m), cards: owned(m, p.id).map((c) => ({ id: c.id, face: face(m, c) })) } : { type: 'cwatch' };
    default: return { type: 'none' };
  }
}

export function coffinsProgress(m) {
  const S = C(m);
  switch (m.phase) {
    case 'C_BURY': return { label: 'have buried', done: inGame(m).filter((id) => stack(m, id).length).length, total: inGame(m).length };
    case 'C_WAGER': { const g = m.players.filter((p) => S.out[p.id]); return { label: 'wagers in', done: g.filter((p) => S.wagers[p.id]).length, total: g.length }; }
    default: return null;
  }
}

/** The moderator sees every coffin. */
export const coffinsSecrets = (m) => {
  const S = C(m);
  if (!S) return null;
  return { stacks: Object.fromEntries(Object.entries(S.stacks).map(([id, st]) => [id, st.map((cid) => face(m, cardById(m, id, cid) ?? { t: 'G' }))])),
    hands: Object.fromEntries(Object.keys(S.owned).map((id) => [id, handOf(m, id).map((c) => face(m, c))])), death: S.death?.holder ?? null, relics: S.relics };
};
