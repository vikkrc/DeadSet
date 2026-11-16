// Dead Set: Séance — a co-operative deduction game with a hidden traitor (see SEANCE.md).
//
// Someone was murdered. Their Ghost sits at the table, knows WHO killed them,
// WHERE and WHY, and cannot speak: it sends wordless visions. The Mediums read
// them and light candles on what they believe. A Deceiver hides among the
// Mediums, knows the truth too, and swaps some visions for its own. Solve all
// three rows before the candles burn out, then name the Deceiver.

import { GameError, nameOf, pub, priv } from './state.js';
import { ROLES, SCENARIO } from './content.js';
import { VISIONS, STORY_TAGS, fit } from './seancecontent.js';

export const S_PHASES = ['S_INTRO', 'S_VISION', 'S_DISCUSS', 'S_CANDLE', 'S_LAST', 'S_NAMING'];
export const isSeancePhase = (ph) => typeof ph === 'string' && ph.startsWith('S_');
export const S_MIN = 4;
export const S_MAX = 10;
export const S_RETURN_SECONDS = 60;
export const ROWS = ['WHO', 'WHERE', 'WHY'];

/** Difficulty: cards per row, visions per Medium, candles on the clock. */
export const DIFFICULTY = {
  gentle: { size: 5, visions: 2, candles: 8 },
  standard: { size: 6, visions: 1, candles: 7 },
  grim: { size: 8, visions: 1, candles: 7 },
};
export const S_DEFAULTS = { difficulty: 'standard', deceivers: 'auto', know: true, swaps: 3, colds: 3, lastBreath: true, ghost: 'lot', ghostId: null, games: 1 };
export const S_TIMER_DEFAULTS = { sIntro: 20, sVision: 90, sDiscuss: 180, sCandle: 45, sName: 60 };
const HAND = 7;
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
  if ([2, 3, 4].includes(Number(patch.colds))) k.colds = Number(patch.colds);
  if (typeof patch.lastBreath === 'boolean') k.lastBreath = patch.lastBreath;
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
  if (n > S_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'Seance', n: S_MAX }]);
  if (k.ghost === 'host' && players.length && !players.some((p) => p.id === k.ghostId)) errors.push('Choose who plays the Ghost.');
  if (k.deceivers === 'two' && n < 9) warnings.push('Two Deceivers need nine players; this table gets one.');
  return { ok: errors.length === 0, errors, warnings, publicDeck: { exact: {} }, suggestions: [] };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const shuffle = (arr, tag) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = RNG.int(i + 1, tag); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** Everyone but the Ghost (the Deceivers included): the readers. */
const mediums = (m) => seatOrder(m).filter((id) => id !== S(m).ghost);
const openRows = (m) => ROWS.filter((r) => S(m).solved[r] == null);
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
const perMedium = (m) => DIFFICULTY[m.config.difficulty].visions;

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
    struck: { WHO: [], WHERE: [], WHY: [] }, solved: { WHO: null, WHERE: null, WHY: null },
    candles: D.candles, burnt: 0, round: 0, assign: {}, pool: shuffle(VISIONS.map((v) => v.id), 'svdeck'), discard: [],
    hand: [], dhand: {}, sent: {}, swap: {}, shown: {}, frosted: [], cold: k.colds, swapsLeft: Object.fromEntries(deceivers.map((id) => [id, k.swaps])),
    impressions: {}, lit: {}, acks: {}, history: [], naming: {}, result: null, last: false, verdicts: null,
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
function beginRound(m, now) {
  const st = S(m);
  st.round++;
  // Spread the readers over the open rows; the assignment rotates every round.
  const rows = openRows(m);
  const rs = mediums(m);
  st.assign = Object.fromEntries(rs.map((id, i) => [id, rows[(i + st.round - 1) % rows.length]]));
  st.discard.push(...st.hand);
  st.hand = draw(m, Math.max(HAND, rs.length * perMedium(m) + 2));
  for (const id of st.deceivers) { st.discard.push(...(st.dhand[id] ?? [])); st.dhand[id] = draw(m, FALSE_HAND); }
  Object.assign(st, { sent: {}, swap: {}, shown: {}, frosted: [], impressions: {}, lit: {}, verdicts: null });
  pub(m, ['Round {n}. The Ghost reaches out.', { n: st.round }], 'phase', { ev: 's-round', round: st.round, assign: { ...st.assign } });
  enter(m, 'S_VISION', now, T(m, 'sVision'));
}

const visionDone = (m) => {
  const st = S(m);
  const rs = mediums(m);
  return rs.every((id) => (st.sent[id]?.length ?? 0) >= perMedium(m)) && rs.every((id) => st.impressions[id] != null);
};

/** Close the vision window: unsent visions go out at random, swaps land, everything turns public. */
function reveal(m, now) {
  const st = S(m);
  for (const id of mediums(m)) {
    while ((st.sent[id]?.length ?? 0) < perMedium(m) && st.hand.length) {
      const v = st.hand.splice(RNG.int(st.hand.length, 'sauto'), 1)[0];
      (st.sent[id] ||= []).push(v);
    }
  }
  const swaps = [];
  for (const [by, sw] of Object.entries(st.swap)) {
    const list = [...(st.sent[sw.target] ?? [])];
    if (!list.length) continue;
    swaps.push({ by, target: sw.target, from: list[0], to: sw.vision });
  }
  st.shown = Object.fromEntries(mediums(m).map((id) => [id, [...(st.sent[id] ?? [])]]));
  for (const s of swaps) {
    st.shown[s.target][0] = s.to;
    st.dhand[s.by] = st.dhand[s.by].filter((x) => x !== s.to);
    st.swapsLeft[s.by]--;
    st.discard.push(s.to);
  }
  st.swaps = swaps;
  st.discard.push(...Object.values(st.sent).flat());
  for (const id of mediums(m)) priv(m, id, ['Your vision for {row}.', { row: st.assign[id] }], 'svision', { visions: st.shown[id] });
  pub(m, 'The visions arrive.', 'phase', { ev: 's-visions', shown: structuredClone(st.shown), assign: { ...st.assign }, count: mediums(m).length });
  enter(m, 'S_DISCUSS', now, T(m, 'sDiscuss'));
}

function openCandles(m, now) {
  pub(m, 'Light your candles.', 'phase', { ev: 's-candles' });
  enter(m, 'S_CANDLE', now, T(m, 'sCandle'));
}

/** The plurality on one row, or null (a tie, or no candles). */
function plurality(m, row, voters) {
  const st = S(m);
  const tally = {};
  for (const id of voters) { const c = st.lit[id]; if (c != null && c !== 'abstain') tally[c] = (tally[c] || 0) + 1; }
  const top = Math.max(0, ...Object.values(tally));
  const best = Object.keys(tally).filter((c) => tally[c] === top);
  return { tally, pick: top > 0 && best.length === 1 ? Number(best[0]) : null };
}

function verdict(m, now) {
  const st = S(m);
  const rows = openRows(m);
  const verdicts = {};
  for (const row of rows) {
    const voters = st.last ? mediums(m) : mediums(m).filter((id) => st.assign[id] === row);
    const { tally, pick } = plurality(m, row, voters);
    let right = null;
    if (pick != null) {
      right = pick === st.truth[row];
      if (right) st.solved[row] = pick;
      else st.struck[row].push(pick); // struck from the row; the clock burns only by the round (see SEANCE.md §3)
    }
    verdicts[row] = { pick, right, tally };
  }
  st.verdicts = verdicts;
  const roundBurn = st.last ? 0 : 1;
  st.burnt = Math.min(st.candles, st.burnt + roundBurn);
  st.history.push({ round: st.last ? 'last' : st.round, assign: { ...st.assign }, sent: structuredClone(st.sent), shown: structuredClone(st.shown),
    swaps: [...(st.swaps ?? [])], frosted: [...st.frosted], impressions: { ...st.impressions }, lit: { ...st.lit }, verdicts: structuredClone(verdicts) });
  const solvedAll = openRows(m).length === 0;
  pub(m, 'The spirit answers.', 'phase', { ev: 's-verdict', verdicts: structuredClone(verdicts), burnt: st.burnt, candles: st.candles, rows, lit: { ...st.lit } });
  if (solvedAll) return naming(m, now);
  if (st.last) return finish(m, now, st.deceivers.length ? 'deceiver' : 'lost');
  if (st.burnt >= st.candles) {
    if (m.config.lastBreath && openRows(m).length === 1) return lastBreath(m, now);
    return finish(m, now, st.deceivers.length ? 'deceiver' : 'lost');
  }
  beginRound(m, now);
}

function lastBreath(m, now) {
  const st = S(m);
  st.last = true;
  st.lit = {};
  st.assign = Object.fromEntries(mediums(m).map((id) => [id, openRows(m)[0]]));
  pub(m, ['The last candle gutters. One last breath: everyone lights a candle on {row}.', { row: openRows(m)[0] }], 'phase', { ev: 's-last', row: openRows(m)[0] });
  enter(m, 'S_LAST', now, T(m, 'sCandle'));
}

function naming(m, now) {
  const st = S(m);
  if (!st.deceivers.length) return finish(m, now, 'full');
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
  const rowOf = (id) => st.assign[id];
  const candidate = (row, c) => {
    const idx = Number(c);
    if (!st.board[row].includes(idx) || st.struck[row].includes(idx)) throw new GameError('Pick a card in your row.');
    return idx;
  };
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
      const list = (st.sent[to] ||= []);
      if (list.length >= perMedium(m)) {
        // Sending again replaces the earlier choice (it returns to the hand).
        st.hand.push(list.shift());
      }
      list.push(v);
      st.hand = st.hand.filter((x) => x !== v);
      if (visionDone(m)) return reveal(m, now);
      return bump(m);
    }
    case 's.unsend': {
      need('S_VISION');
      if (!isGhost) throw new GameError('Only the Ghost sends visions.');
      const list = st.sent[payload.target] ?? [];
      st.hand.push(...list);
      delete st.sent[payload.target];
      return bump(m);
    }
    case 's.impress': {
      need('S_VISION');
      if (isGhost) throw new GameError('The Ghost already knows.');
      st.impressions[p.id] = candidate(rowOf(p.id), payload.card);
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
      if (Object.entries(st.swap).some(([by, s]) => by !== p.id && s.target === t)) throw new GameError('That vision is already being swapped.');
      if (!st.dhand[p.id].includes(v)) throw new GameError('That vision is not in your hand.');
      st.swap[p.id] = { target: t, vision: v };
      return bump(m);
    }
    case 's.cold': {
      need('S_DISCUSS');
      if (!isGhost) throw new GameError('Only the Ghost can frost a vision.');
      if (st.cold <= 0) throw new GameError('No cold spots left.');
      const t = payload.target;
      if (!st.shown[t] || st.frosted.includes(t)) throw new GameError('Pick a vision.');
      st.frosted.push(t);
      st.cold--;
      pub(m, ['A cold spot settles on {name}\'s vision.', { name: nameOf(m, t) }], 'phase', { ev: 's-cold', target: t });
      return bump(m);
    }
    case 's.light': {
      need('S_CANDLE', 'S_LAST');
      if (isGhost) throw new GameError('The Ghost does not light candles.');
      st.lit[p.id] = payload.card === 'abstain' ? 'abstain' : candidate(rowOf(p.id), payload.card);
      if (mediums(m).every((id) => st.lit[id] != null)) return verdict(m, now);
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
    case 'S_DISCUSS': return openCandles(m, now);
    case 'S_CANDLE': case 'S_LAST': return verdict(m, now);
    case 'S_NAMING': return resolveNaming(m, now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const S_ADVANCE_LABEL = { S_INTRO: 'Begin the séance', S_VISION: 'Reveal the visions', S_DISCUSS: 'Light the candles', S_CANDLE: 'Ask the spirit', S_LAST: 'Ask the spirit', S_NAMING: 'Close the naming' };

// ── Views ──────────────────────────────────────────────────────────────────
export function seancePublic(m) {
  const st = S(m);
  if (!st) return null;
  const ended = m.phase === 'ENDED';
  const shownOpen = ['S_DISCUSS', 'S_CANDLE', 'S_LAST'].includes(m.phase) || (m.phase === 'S_NAMING') || ended;
  return {
    ghost: st.ghost, board: st.board, struck: st.struck, solved: st.solved, candles: st.candles, burnt: st.burnt, round: st.round,
    assign: m.phase === 'S_INTRO' ? {} : st.assign, difficulty: m.config.difficulty, perMedium: perMedium(m), deceivers: st.deceivers.length,
    shown: shownOpen ? st.shown : undefined, frosted: st.frosted, cold: st.cold, last: st.last,
    acked: m.phase === 'S_INTRO' ? Object.keys(st.acks) : [], lit: ['S_CANDLE', 'S_LAST'].includes(m.phase) ? Object.keys(st.lit) : [],
    named: m.phase === 'S_NAMING' ? Object.keys(st.naming) : [], verdicts: st.verdicts,
    // Only at the end: the truth, the Deceivers, every round's true visions and swaps.
    truth: ended ? st.truth : undefined, deceiverIds: ended ? st.deceivers : undefined, history: ended ? st.history : undefined,
    result: st.result, winners: st.winners, namedIds: ended ? st.named : undefined, nameTally: ended ? st.nameTally : undefined,
    // Every finished round, as the table saw it: the visions, the cold spots, who lit which candle, the verdicts.
    past: st.history.map((h) => ({ round: h.round, assign: h.assign, shown: h.shown, frosted: h.frosted, lit: h.lit, verdicts: h.verdicts })),
    scores: m.sScores ?? {}, match: m.sMatch,
  };
}

export function seanceMe(m, p) {
  const st = S(m);
  if (!st) return {};
  const role = p.id === st.ghost ? 'GHOST' : isDeceiver(m, p.id) ? 'DECEIVER' : 'MEDIUM';
  const out = { role, row: st.assign[p.id] ?? null, impression: st.impressions[p.id] ?? null, lit: st.lit[p.id] ?? null };
  if (role !== 'MEDIUM') out.truth = st.truth;
  if (role === 'DECEIVER' && m.config.know) out.fellows = st.deceivers.filter((x) => x !== p.id);
  if (st.shown[p.id]) out.visions = st.shown[p.id];
  if (role === 'GHOST') { out.hand = st.hand; out.sent = st.sent; }
  if (role === 'DECEIVER') { out.dhand = st.dhand[p.id] ?? []; out.swapsLeft = st.swapsLeft[p.id]; out.swap = st.swap[p.id] ?? null; }
  if (m.phase === 'S_NAMING') out.named = st.naming[p.id] ?? null;
  return out;
}

export function seanceAction(m, p) {
  const st = S(m);
  const isGhost = p.id === st.ghost;
  switch (m.phase) {
    case 'S_INTRO': return { type: 'sintro', done: !!st.acks[p.id] };
    case 'S_VISION': return isGhost ? { type: 'ssend' } : { type: 'simpress', row: st.assign[p.id] };
    case 'S_DISCUSS': return { type: isGhost ? 'scold' : 'sdiscuss' };
    case 'S_CANDLE': case 'S_LAST': return isGhost ? { type: 'swatch' } : { type: 'slight', row: st.assign[p.id] };
    case 'S_NAMING': return isGhost ? { type: 'swatch' } : { type: 'sname', count: st.deceivers.length, targets: seatOrder(m).filter((x) => x !== p.id && x !== st.ghost) };
    default: return { type: 'none' };
  }
}

export function seanceProgress(m) {
  const st = S(m);
  const rs = mediums(m);
  if (m.phase === 'S_INTRO') return { label: 'ready', done: Object.keys(st.acks).length, total: m.players.length };
  if (m.phase === 'S_VISION') return { label: 'ready', done: rs.filter((id) => st.impressions[id] != null).length, total: rs.length };
  if (m.phase === 'S_CANDLE' || m.phase === 'S_LAST') return { label: 'candles lit', done: Object.keys(st.lit).length, total: rs.length };
  if (m.phase === 'S_NAMING') return { label: 'votes in', done: Object.keys(st.naming).length, total: rs.length };
  return null;
}

export const seanceSecrets = (m) => (S(m) ? { truth: { ...S(m).truth }, deceivers: [...S(m).deceivers], sent: structuredClone(S(m).sent), swap: structuredClone(S(m).swap) } : null);

// For bots and tests.
export { fit };
