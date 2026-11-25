// Dead Set: Séance — a co-operative deduction game with a hidden traitor (see SEANCE.md).
//
// Someone was murdered. Their Ghost sits at the table, knows WHO killed them,
// WHERE and WHY, and cannot speak: it sends wordless visions. The séance asks
// one question at a time (who, then where, then why). Every Medium gets a
// vision for it, the table talks, and every Medium lays a hand on a card: the
// card under the most hands is put to the spirit. A Deceiver hides among the
// Mediums, knows the truth too, and swaps some visions for its own. Answer all
// three before the candles burn out, then name the Deceiver.

import { GameError, nameOf, pub, priv } from './state.js';
import { ROLES, SCENARIO } from './content.js';
import { VISIONS, STORY_TAGS, fit } from './seancecontent.js';

export const S_PHASES = ['S_INTRO', 'S_VISION', 'S_HANDS', 'S_NAMING'];
export const isSeancePhase = (ph) => typeof ph === 'string' && ph.startsWith('S_');
export const S_MIN = 4;
export const S_MAX = 10;
export const S_RETURN_SECONDS = 60;
export const ROWS = ['WHO', 'WHERE', 'WHY'];

/** Difficulty: cards per row, candles on the clock, and the share of the Ghost's hand dealt to fit the answer (of one vision per Medium). */
export const DIFFICULTY = {
  gentle: { size: 5, candles: 7, fits: 0.75 },
  standard: { size: 6, candles: 7, fits: 0.5 },
  grim: { size: 7, candles: 8, fits: 0.35 },
};
/** How many visions in the Ghost's hand are dealt to fit the answer: about half the Mediums on Standard, never none. */
export const fitCount = (difficulty, readers) => Math.max(1, Math.round(readers * DIFFICULTY[difficulty].fits + 0.5));
export const S_DEFAULTS = { difficulty: 'standard', deceivers: 'auto', know: true, swaps: 3, colds: 2, ghost: 'lot', ghostId: null, games: 1 };
export const S_TIMER_DEFAULTS = { sIntro: 20, sVision: 90, sHands: 180, sName: 60 };
/** The Ghost's hand: three more visions than there are Mediums, never fewer than six. */
const handSize = (readers) => Math.max(6, readers + 3);
const FALSE_HAND = 3;

let RNG = null;
const T = (m, key) => m.settings.timers?.[key] ?? S_TIMER_DEFAULTS[key] ?? 0;
const bump = (m) => { m.stateVersion++; };
export const sSettings = (s) => ({ ...S_DEFAULTS, ...(s.s || {}) });
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
const S = (m) => m.S;

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.S?.round ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

/** How many Deceivers this table gets. */
export function deceiverCount(n, settings) {
  const k = sSettings(settings);
  if (k.deceivers === 'none') return 0;
  if (k.deceivers === 'two') return n >= 9 ? 2 : n >= 5 ? 1 : 0;
  if (k.deceivers === 'one') return 1;
  return n >= 5 ? 1 : 0; // auto: one from five players, none at four
}

// ── Settings ───────────────────────────────────────────────────────────────
export function applySeancePatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const k = sSettings(s);
  if (DIFFICULTY[patch.difficulty]) k.difficulty = patch.difficulty;
  if (['auto', 'none', 'one', 'two'].includes(patch.deceivers)) k.deceivers = patch.deceivers;
  if (typeof patch.know === 'boolean') k.know = patch.know;
  if ([2, 3, 4].includes(Number(patch.swaps))) k.swaps = Number(patch.swaps);
  if ([1, 2, 3].includes(Number(patch.colds))) k.colds = Number(patch.colds);
  if (['lot', 'host'].includes(patch.ghost)) k.ghost = patch.ghost;
  if (patch.ghostId === null || typeof patch.ghostId === 'string') k.ghostId = patch.ghostId;
  if ([1, 2, 3].includes(Number(patch.games))) k.games = Number(patch.games);
  s.s = k;
}

export function validateSeance(n, settings, players = []) {
  const k = sSettings(settings);
  const errors = [];
  const warnings = [];
  if (n < S_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: S_MIN, n }]);
  if (n > S_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'seance', n: S_MAX }]);
  if (k.ghost === 'host' && players.length && !players.some((p) => p.id === k.ghostId)) errors.push('Choose who plays the Ghost.');
  if (k.deceivers === 'two' && n < 9) warnings.push('Two Deceivers need nine players; this table gets one.');
  return { ok: errors.length === 0, errors, warnings, publicDeck: { exact: {} }, suggestions: [] };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const shuffle = (arr, tag) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = RNG.int(i + 1, tag); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** Everyone but the Ghost (the Deceivers included): the readers. */
const mediums = (m) => seatOrder(m).filter((id) => id !== S(m).ghost);
const openRows = (m) => ROWS.filter((r) => S(m).solved[r] == null);
const live = (m, row) => S(m).board[row].filter((c) => !S(m).struck[row].includes(c));
const isDeceiver = (m, id) => S(m).deceivers.includes(id);
const cardName = (row, idx) => SCENARIO[row][idx];
function draw(m, n) {
  const st = S(m);
  const out = [];
  for (let i = 0; i < n; i++) {
    if (!st.pool.length) st.pool = shuffle(st.discard.splice(0), 'svdeck');
    if (!st.pool.length) break;
    out.push(st.pool.pop());
  }
  return out;
}
/** Take up to n visions that pass the test out of the deck (the discard too, once the deck runs dry). */
function drawWhere(m, n, test) {
  const st = S(m);
  const out = [];
  for (const pile of [st.pool, st.discard]) {
    for (let i = pile.length - 1; i >= 0 && out.length < n; i--) if (test(pile[i])) out.push(...pile.splice(i, 1));
  }
  return out;
}
/**
 * Fair dealing (SEANCE.md §4). A vision "fits" the answer when it shares a theme
 * with it and with no other card in the row more strongly. The Ghost's hand
 * always holds a few that fit (more on Gentle); the rest is the luck of the deck.
 * The Deceiver's false hand is dealt to fit a wrong card better than the answer.
 */
export const fitsAnswer = (vid, row, truth, rest) => fit(vid, row, truth) >= 1 && rest.every((c) => fit(vid, row, c) <= fit(vid, row, truth));
export const fitsDecoy = (vid, row, truth, rest) => rest.some((c) => fit(vid, row, c) >= 1 && fit(vid, row, c) > fit(vid, row, truth));
function dealHands(m) {
  const st = S(m);
  const row = st.at;
  const truth = st.truth[row];
  const rest = live(m, row).filter((c) => c !== truth);
  const used = new Set(st.seen[row].map((x) => x.v));
  const fresh = (x) => !used.has(x);
  st.discard.push(...st.hand);
  const want = fitCount(m.config.difficulty, mediums(m).length);
  const good = shuffle(drawWhere(m, want * 3, (x) => fresh(x) && fitsAnswer(x, row, truth, rest)), 'sfit').slice(0, want);
  const others = [];
  while (good.length + others.length < handSize(mediums(m).length)) {
    const [x] = draw(m, 1);
    if (x == null) break;
    others.push(x);
  }
  st.hand = shuffle([...good, ...others], 'shand');
  for (const id of st.deceivers) {
    st.discard.push(...(st.dhand[id] ?? []));
    const lies = drawWhere(m, FALSE_HAND, (x) => fresh(x) && fitsDecoy(x, row, truth, rest));
    st.dhand[id] = [...lies, ...draw(m, FALSE_HAND - lies.length)];
  }
}

/** A row of candidates: the truth, two near-misses that share a theme with it, the rest at random. */
function buildRow(row, truth, size) {
  const all = SCENARIO[row].map((_, i) => i).filter((i) => i !== truth);
  const tt = STORY_TAGS[row][truth];
  const near = shuffle(all.filter((i) => STORY_TAGS[row][i].some((x) => tt.includes(x))), 'snear').slice(0, 2);
  const rest = shuffle(all.filter((i) => !near.includes(i)), 'srest').slice(0, size - 1 - near.length);
  return shuffle([truth, ...near, ...rest], 'srow');
}

// ── Start ──────────────────────────────────────────────────────────────────
export function startSeance(m, rng, now) {
  RNG = rng;
  const k = sSettings(m.settings);
  m.players.forEach((p) => {
    Object.assign(p, {
      roleId: 'S_MEDIUM', originalRoleId: 'S_MEDIUM', alignment: ROLES.S_MEDIUM.alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  m.config = { mode: 'seance', preset: 'seance', seance: true, ...k };
  Object.assign(m, { activeRules: [], scenario: null, history: [], publicLog: [], privateLog: {}, chats: {}, day: null, night: null,
    dayNumber: 0, nightNumber: 0, winner: null, endReason: null, M: null, X: null, C: null, K: null, N: null });
  m.sScores ||= {};
  m.sMatch = m.sMatch && m.sMatch.played < m.sMatch.total && m.sMatch.total === k.games ? m.sMatch : { played: 0, total: k.games };
  if (m.sMatch.played === 0) m.sScores = {};
  const order = seatOrder(m);
  const ghost = k.ghost === 'host' && order.includes(k.ghostId) ? k.ghostId : order[rng.int(order.length, 'sghost')];
  const readers = order.filter((id) => id !== ghost);
  const deceivers = shuffle(readers, 'sdec').slice(0, deceiverCount(order.length, m.settings));
  const D = DIFFICULTY[k.difficulty];
  const truth = Object.fromEntries(ROWS.map((r) => [r, rng.int(SCENARIO[r].length, 'struth')]));
  m.S = {
    ghost, deceivers, truth, board: Object.fromEntries(ROWS.map((r) => [r, buildRow(r, truth[r], D.size)])),
    struck: { WHO: [], WHERE: [], WHY: [] }, solved: { WHO: null, WHERE: null, WHY: null }, at: 'WHO',
    seen: { WHO: [], WHERE: [], WHY: [] }, candles: D.candles, burnt: 0, round: 0, pool: shuffle(VISIONS.map((v) => v.id), 'svdeck'), discard: [],
    hand: [], dhand: {}, sent: {}, swap: {}, shown: {}, swaps: [], frosted: [], cold: k.colds, ghostDone: false,
    swapsLeft: Object.fromEntries(deceivers.map((id) => [id, k.swaps])),
    hunch: {}, lastHunch: {}, hands: {}, acks: {}, history: [], naming: {}, result: null, verdict: null,
  };
  const ghostP = m.players.find((p) => p.id === ghost);
  Object.assign(ghostP, { roleId: 'S_GHOST', originalRoleId: 'S_GHOST', alignment: ROLES.S_GHOST.alignment });
  ghostP.statuses = [{ type: 'MUTE', source: 'seance' }]; // the Ghost cannot speak, in the room or in the chat
  for (const id of deceivers) Object.assign(m.players.find((p) => p.id === id), { roleId: 'S_DECEIVER', originalRoleId: 'S_DECEIVER', alignment: ROLES.S_DECEIVER.alignment });
  const truthMsg = ['{who}, in {where}, to {why}.', { who: cardName('WHO', truth.WHO), where: cardName('WHERE', truth.WHERE), why: cardName('WHY', truth.WHY) }];
  for (const id of order) {
    if (id === ghost) priv(m, id, ['You are the Ghost. You were murdered: {truth}', { truth: truthMsg }], 'role', { card: 'S_GHOST' });
    else if (isDeceiver(m, id)) {
      const others = deceivers.filter((x) => x !== id);
      priv(m, id, ['You are the Deceiver. The truth: {truth}', { truth: truthMsg }], 'role', { card: 'S_DECEIVER' });
      if (others.length && k.know) priv(m, id, ['The other Deceiver: {names}.', { names: others.map((x) => nameOf(m, x)) }], 'role');
    } else priv(m, id, 'You are a Medium. Read the visions; find the truth.', 'role', { card: 'S_MEDIUM' });
  }
  pub(m, ['The séance begins. {a} is the Ghost.', { a: nameOf(m, ghost) }], 'phase', { ev: 's-lottery', leader: ghost, order, spins: k.ghost === 'lot' ? 2 : 0 });
  enter(m, 'S_INTRO', now, T(m, 'sIntro'));
}

// ── Rounds ─────────────────────────────────────────────────────────────────
// The séance asks one question at a time: WHO, then WHERE, then WHY. Every
// round the Ghost sends every Medium one vision for it; the visions stay on the
// table until the question is answered.
const needHunch = (m) => S(m).deceivers.length > 0;
function beginRound(m, now) {
  const st = S(m);
  st.round++;
  Object.assign(st, { sent: {}, swap: {}, shown: {}, swaps: [], frosted: [], hunch: {}, hands: {}, ghostDone: false, verdict: null });
  dealHands(m);
  pub(m, ['Round {n}. The Ghost reaches out.', { n: st.round }], 'phase', { ev: 's-round', round: st.round, row: st.at });
  enter(m, 'S_VISION', now, T(m, 'sVision'));
}

const visionDone = (m) => {
  const st = S(m);
  const rs = mediums(m);
  return rs.every((id) => st.sent[id] != null) && (!needHunch(m) || rs.every((id) => st.hunch[id] != null));
};

/** Close the vision window: unsent visions go out from the hand, swaps land, everything turns public. */
function reveal(m, now) {
  const st = S(m);
  const row = st.at;
  for (const id of mediums(m)) {
    if (st.sent[id] != null || !st.hand.length) continue;
    // Out of time: the Ghost's hand sends what fits best by itself.
    const rest = live(m, row).filter((c) => c !== st.truth[row]);
    const pickI = st.hand.findIndex((x) => fitsAnswer(x, row, st.truth[row], rest));
    st.sent[id] = st.hand.splice(pickI >= 0 ? pickI : RNG.int(st.hand.length, 'sauto'), 1)[0];
  }
  st.shown = { ...st.sent };
  st.swaps = [];
  for (const [by, sw] of Object.entries(st.swap)) {
    // Two Deceivers on the same reader: only the first swap lands; the second is not spent.
    if (st.shown[sw.target] == null || st.swaps.some((x) => x.target === sw.target)) continue;
    st.swaps.push({ by, target: sw.target, from: st.shown[sw.target], to: sw.vision });
    st.shown[sw.target] = sw.vision;
    st.dhand[by] = st.dhand[by].filter((x) => x !== sw.vision);
    st.swapsLeft[by]--;
  }
  for (const id of needHunch(m) ? mediums(m) : []) if (st.hunch[id]) st.lastHunch[id] = st.hunch[id];
  for (const [to, v] of Object.entries(st.shown)) st.seen[row].push({ round: st.round, to, v });
  st.discard.push(...Object.values(st.sent), ...st.swaps.map((x) => x.to));
  for (const id of mediums(m)) if (st.shown[id] != null) priv(m, id, ['Your vision for {row}.', { row }], 'svision', { vision: st.shown[id] });
  pub(m, 'The visions arrive.', 'phase', { ev: 's-visions', row, round: st.round, shown: { ...st.shown }, count: Object.keys(st.shown).length });
  enter(m, 'S_HANDS', now, T(m, 'sHands'));
}

/** The hands are counted: the card under the most is asked; a tie, or no hands at all, is settled by the planchette (at random). */
function verdict(m, now) {
  const st = S(m);
  const row = st.at;
  const open = live(m, row);
  const tally = {};
  for (const id of mediums(m)) { const c = st.hands[id]; if (c != null && open.includes(c)) tally[c] = (tally[c] || 0) + 1; }
  const top = Math.max(0, ...Object.values(tally));
  const best = top ? Object.keys(tally).filter((c) => tally[c] === top).map(Number) : open;
  const pick = best.length === 1 ? best[0] : best[RNG.int(best.length, 'splanchette')];
  const right = pick === st.truth[row];
  if (right) st.solved[row] = pick;
  else st.struck[row].push(pick);
  st.burnt = Math.min(st.candles, st.burnt + 1);
  st.verdict = { row, pick, right, tally, hands: { ...st.hands }, tie: top > 0 && best.length > 1, drift: top === 0 };
  st.history.push({ round: st.round, row, sent: { ...st.sent }, shown: { ...st.shown }, swaps: [...st.swaps], frosted: [...st.frosted],
    hunch: { ...st.hunch }, hands: { ...st.hands }, verdict: { ...st.verdict } });
  pub(m, right ? 'The spirit answers: yes.' : 'The spirit answers: no.', 'phase', { ev: 's-verdict', ...structuredClone(st.verdict), burnt: st.burnt, candles: st.candles });
  if (right) st.at = openRows(m)[0] ?? null;
  if (!openRows(m).length) return naming(m, now);
  if (st.burnt >= st.candles) return finish(m, now, st.deceivers.length ? 'deceiver' : 'lost');
  beginRound(m, now);
}

const handsDone = (m) => S(m).ghostDone && mediums(m).every((id) => S(m).hands[id] != null);

function naming(m, now) {
  const st = S(m);
  st.at = null;
  if (!st.deceivers.length) return finish(m, now, 'full');
  // Each Medium's last hunch is their first pick; they may change it.
  st.naming = {};
  pub(m, st.deceivers.length > 1 ? 'The murder is solved. Now name the two Deceivers.' : 'The murder is solved. Now name the Deceiver.', 'phase', { ev: 's-naming', count: st.deceivers.length });
  enter(m, 'S_NAMING', now, T(m, 'sName'));
}

function resolveNaming(m, now) {
  const st = S(m);
  const k = st.deceivers.length;
  const tally = {};
  for (const picks of Object.values(st.naming)) for (const t of picks) tally[t] = (tally[t] || 0) + 1;
  const order = seatOrder(m);
  const ranked = Object.keys(tally).sort((a, b) => tally[b] - tally[a] || order.indexOf(a) - order.indexOf(b));
  // A tie at the cut-off names nobody there: the table must agree.
  const named = ranked.slice(0, k).filter((id) => ranked.length <= k || tally[id] > tally[ranked[k]]);
  const right = named.length === k && named.every((id) => st.deceivers.includes(id));
  st.named = named;
  st.nameTally = tally;
  pub(m, right ? 'Named. The spirit rests.' : 'Something else came through.', 'phase', { ev: 's-named', named, right, tally, deceivers: [...st.deceivers] });
  finish(m, now, right ? 'full' : 'hollow');
}

function finish(m, now, result) {
  const st = S(m);
  st.result = result;
  const order = seatOrder(m);
  const good = order.filter((id) => !isDeceiver(m, id));
  const winners = result === 'full' ? good : result === 'hollow' ? order : result === 'deceiver' ? [...st.deceivers] : [];
  st.winners = winners;
  m.winner = 'SEANCE';
  const sc = (m.sScores ||= {});
  for (const id of order) {
    const d = isDeceiver(m, id);
    const pts = result === 'full' ? (d ? 0 : 2) : result === 'hollow' ? 1 : result === 'deceiver' ? (d ? 3 : 0) : 0;
    sc[id] = (sc[id] || 0) + pts;
  }
  m.sMatch.played++;
  const truth = ['{who}, in {where}, to {why}.', { who: cardName('WHO', st.truth.WHO), where: cardName('WHERE', st.truth.WHERE), why: cardName('WHY', st.truth.WHY) }];
  const label = { full: 'The spirit rests.', hollow: 'A hollow victory: the murder is solved, but the Deceiver walks free.', deceiver: 'The candles gutter. The Deceiver wins.', lost: 'The candles gutter. The séance has failed.' }[result];
  m.endReason = [`{label} {truth}`, { label: [label, {}], truth }];
  pub(m, m.endReason, 'end', { ev: 'end', winner: 'SEANCE', result, pids: winners, deceivers: [...st.deceivers], truth: { ...st.truth }, reason: m.endReason });
  enter(m, 'ENDED', now, S_RETURN_SECONDS);
}

// ── Commands ───────────────────────────────────────────────────────────────
export function seanceCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const st = S(m);
  const need = (...phases) => { if (!phases.includes(m.phase)) throw new GameError('That window has closed.', 'STALE'); };
  const isGhost = p.id === st.ghost;
  const reader = () => { if (isGhost) throw new GameError('The Ghost cannot do that.'); };
  switch (type) {
    case 's.ack':
      need('S_INTRO');
      st.acks[p.id] = true;
      if (seatOrder(m).every((id) => st.acks[id])) return beginRound(m, now);
      return bump(m);
    case 's.send': {
      need('S_VISION');
      if (!isGhost) throw new GameError('Only the Ghost sends visions.');
      const to = payload.target;
      const v = Number(payload.vision);
      if (!mediums(m).includes(to)) throw new GameError('Send it to a Medium.');
      if (!st.hand.includes(v)) throw new GameError('That vision is not in your hand.');
      if (st.sent[to] != null) st.hand.push(st.sent[to]); // sending again replaces the earlier choice
      st.sent[to] = v;
      st.hand = st.hand.filter((x) => x !== v);
      if (visionDone(m)) return reveal(m, now);
      return bump(m);
    }
    case 's.unsend': {
      need('S_VISION');
      if (!isGhost) throw new GameError('Only the Ghost sends visions.');
      if (st.sent[payload.target] != null) st.hand.push(st.sent[payload.target]);
      delete st.sent[payload.target];
      return bump(m);
    }
    case 's.hunch': {
      // Every Medium marks a hunch while the Ghost chooses; it hides the Deceiver's swap and becomes their first pick at the Naming.
      need('S_VISION');
      reader();
      if (!needHunch(m)) throw new GameError('Nothing to do now.');
      const t = payload.target;
      if (t === p.id || t === st.ghost || !mediums(m).includes(t)) throw new GameError('Pick another Medium.');
      st.hunch[p.id] = t;
      if (visionDone(m)) return reveal(m, now);
      return bump(m);
    }
    case 's.swap': {
      need('S_VISION');
      if (!isDeceiver(m, p.id)) throw new GameError('Nothing to do now.'); // looks exactly like a Medium's error-free screen otherwise
      if (st.swapsLeft[p.id] <= 0) throw new GameError('No swaps left.');
      if (payload.target == null) { delete st.swap[p.id]; return bump(m); }
      const t = payload.target;
      const v = Number(payload.vision);
      if (t === p.id || !mediums(m).includes(t)) throw new GameError('Pick another Medium.');
      if (!st.dhand[p.id].includes(v)) throw new GameError('That vision is not in your hand.');
      st.swap[p.id] = { target: t, vision: v };
      return bump(m);
    }
    case 's.cold': {
      need('S_HANDS');
      if (!isGhost) throw new GameError('Only the Ghost can frost a vision.');
      if (st.cold <= 0) throw new GameError('No cold spots left.');
      const t = payload.target;
      if (st.shown[t] == null || st.frosted.includes(t)) throw new GameError('Pick a vision.');
      st.frosted.push(t);
      st.cold--;
      const seen = st.seen[st.at].find((x) => x.round === st.round && x.to === t);
      if (seen) seen.frost = true;
      pub(m, ['A cold spot settles on {name}\'s vision.', { name: nameOf(m, t) }], 'phase', { ev: 's-cold', target: t });
      return bump(m);
    }
    case 's.done': {
      // The Ghost has seen the visions: no more cold spots this round.
      need('S_HANDS');
      if (!isGhost) throw new GameError('Only the Ghost can do that.');
      st.ghostDone = true;
      if (handsDone(m)) return verdict(m, now);
      return bump(m);
    }
    case 's.hand': {
      need('S_HANDS');
      reader();
      if (payload.card == null) { delete st.hands[p.id]; return bump(m); }
      const c = Number(payload.card);
      if (!live(m, st.at).includes(c)) throw new GameError('Pick a card in the row.');
      st.hands[p.id] = c;
      if (handsDone(m)) return verdict(m, now);
      return bump(m);
    }
    case 's.name': {
      need('S_NAMING');
      if (isGhost) throw new GameError('The Ghost does not name.');
      const k = st.deceivers.length;
      const picks = [...new Set(Array.isArray(payload.targets) ? payload.targets : [payload.target])].filter(Boolean);
      if (picks.length !== k || picks.some((t) => t === p.id || t === st.ghost || !seatOrder(m).includes(t))) throw new GameError(k > 1 ? 'Name two other players.' : 'Name another player.');
      st.naming[p.id] = picks;
      if (mediums(m).every((id) => st.naming[id])) return resolveNaming(m, now);
      return bump(m);
    }
    default: throw new GameError('Unknown command.');
  }
}

export function seanceAdvance(m, rng, now) {
  RNG = rng;
  switch (m.phase) {
    case 'S_INTRO': return beginRound(m, now);
    case 'S_VISION': return reveal(m, now);
    case 'S_HANDS': return verdict(m, now);
    case 'S_NAMING': return resolveNaming(m, now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const S_ADVANCE_LABEL = { S_INTRO: 'Begin the séance', S_VISION: 'Reveal the visions', S_HANDS: 'Ask the spirit', S_NAMING: 'Close the naming' };

// ── Views ──────────────────────────────────────────────────────────────────
export function seancePublic(m) {
  const st = S(m);
  if (!st) return null;
  const ended = m.phase === 'ENDED';
  return {
    ghost: st.ghost, board: st.board, struck: st.struck, solved: st.solved, at: st.at, candles: st.candles, burnt: st.burnt, round: st.round,
    difficulty: m.config.difficulty, deceivers: st.deceivers.length, readers: mediums(m),
    // Every vision the table has seen, row by row (this round's arrive at the reveal), frosted ones marked.
    seen: st.seen, frosted: st.frosted, cold: st.cold, ghostDone: m.phase === 'S_HANDS' && st.ghostDone,
    acked: m.phase === 'S_INTRO' ? Object.keys(st.acks) : [], handsIn: m.phase === 'S_HANDS' ? Object.keys(st.hands) : [],
    named: m.phase === 'S_NAMING' ? Object.keys(st.naming) : [], verdict: st.verdict,
    // Only at the end: the truth, the Deceivers, every round's true visions, swaps and hunches.
    truth: ended ? st.truth : undefined, deceiverIds: ended ? st.deceivers : undefined, history: ended ? st.history : undefined,
    result: st.result, winners: st.winners, namedIds: ended ? st.named : undefined, nameTally: ended ? st.nameTally : undefined,
    // Every finished round, as the table saw it: whose hand lay where, and the answer.
    past: st.history.map((h) => ({ round: h.round, row: h.row, hands: h.hands, verdict: h.verdict, frosted: h.frosted })),
    scores: m.sScores ?? {}, match: m.sMatch,
  };
}

export function seanceMe(m, p) {
  const st = S(m);
  if (!st) return {};
  const role = p.id === st.ghost ? 'GHOST' : isDeceiver(m, p.id) ? 'DECEIVER' : 'MEDIUM';
  const out = { role, hunch: st.hunch[p.id] ?? null, lastHunch: st.lastHunch[p.id] ?? null, hand: st.hands[p.id] ?? null };
  if (role !== 'MEDIUM') out.truth = st.truth;
  if (role === 'DECEIVER' && m.config.know) out.fellows = st.deceivers.filter((x) => x !== p.id);
  if (st.shown[p.id] != null) out.vision = st.shown[p.id];
  if (role === 'GHOST') { out.cards = st.hand; out.sent = st.sent; }
  if (role === 'DECEIVER') { out.dhand = st.dhand[p.id] ?? []; out.swapsLeft = st.swapsLeft[p.id]; out.swap = st.swap[p.id] ?? null; }
  if (m.phase === 'S_NAMING') out.named = st.naming[p.id] ?? null;
  return out;
}

export function seanceAction(m, p) {
  const st = S(m);
  const isGhost = p.id === st.ghost;
  switch (m.phase) {
    case 'S_INTRO': return { type: 'sintro', done: !!st.acks[p.id] };
    case 'S_VISION': return isGhost ? { type: 'ssend', row: st.at } : needHunch(m) ? { type: 'shunch', row: st.at, targets: mediums(m).filter((x) => x !== p.id) } : { type: 'swait', row: st.at };
    case 'S_HANDS': return isGhost ? { type: 'sghost', row: st.at, done: st.ghostDone } : { type: 'shand', row: st.at };
    case 'S_NAMING': return isGhost ? { type: 'swatch' } : { type: 'sname', count: st.deceivers.length, targets: mediums(m).filter((x) => x !== p.id) };
    default: return { type: 'none' };
  }
}

export function seanceProgress(m) {
  const st = S(m);
  const rs = mediums(m);
  if (m.phase === 'S_INTRO') return { label: 'ready', done: Object.keys(st.acks).length, total: m.players.length };
  if (m.phase === 'S_VISION') return { label: 'visions sent', done: rs.filter((id) => st.sent[id] != null).length, total: rs.length };
  if (m.phase === 'S_HANDS') return { label: 'hands laid', done: Object.keys(st.hands).length, total: rs.length };
  if (m.phase === 'S_NAMING') return { label: 'votes in', done: Object.keys(st.naming).length, total: rs.length };
  return null;
}

export const seanceSecrets = (m) => (S(m) ? { truth: { ...S(m).truth }, deceivers: [...S(m).deceivers], sent: structuredClone(S(m).sent), swap: structuredClone(S(m).swap) } : null);

// For bots and tests.
export { fit };
