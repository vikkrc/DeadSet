// Dead Set: Graverobbers — two crews dig a cemetery for their deity's relics (see GRAVEROBBERS.md).
//
// 25 graves in a 5×5 grid, each with a word or an icon on its headstone. The
// Blue crew serves the Moon, the Gold crew the Sun. Only each crew's
// Undertaker sees the burial register (what lies under every stone) and may
// give one word and one number; the diggers vote on their phones. One grave
// is Death's: open it and your crew loses at once.

import { GameError, nameOf, pub, priv } from './state.js';
import { ROLES } from './content.js';
import { CATEGORIES, fold } from './words.js';
import { EMBLEMS } from '../public/emblems.js';
import { MOTIF_TAGS } from '../public/visions.js';

export const G_PHASES = ['G_INTRO', 'G_SIGN', 'G_DIG'];
export const isGravePhase = (ph) => typeof ph === 'string' && ph.startsWith('G_');
export const G_MIN = 4;
export const G_MAX = 12;
export const G_RETURN_SECONDS = 60;
/** Every crew there can be: the Moon (B), the Sun (G) and, in a three-crew game, the Stars (V). */
export const CREWS = ['B', 'G', 'V'];
/** The crews in play for these settings. */
export const crewIds = (k) => (Number(k?.teams) === 3 ? ['B', 'G', 'V'] : ['B', 'G']);
/** Three crews: the first to dig hides 7 relics, the others 6, with 5 empty graves (two crews: 9, 8 and 7). */
export const relicCounts = (n) => (n === 3 ? { first: 7, rest: 6, empty: 5 } : { first: 9, rest: 8, empty: 7 });
const CREW_LINES = {
  B: { relicOther: 'A relic of the Moon: it goes to the Moon crew.', relic: 'A relic of the Moon!', win: 'The Moon rises. The Moon crew wins.', first: 'The coin decides: the Moon crew digs first.',
    cap2: 'You are the Undertaker of the Moon crew. Only you and the other Undertaker see the burial register.', cap3: 'You are the Undertaker of the Moon crew. Only the three Undertakers see the burial register.',
    dig: 'You dig for the Moon crew. Your Undertaker: {name}.', out: 'The Moon crew opened Death\'s grave and is out of the game.' },
  G: { relicOther: 'A relic of the Sun: it goes to the Sun crew.', relic: 'A relic of the Sun!', win: 'The Sun rises. The Sun crew wins.', first: 'The coin decides: the Sun crew digs first.',
    cap2: 'You are the Undertaker of the Sun crew. Only you and the other Undertaker see the burial register.', cap3: 'You are the Undertaker of the Sun crew. Only the three Undertakers see the burial register.',
    dig: 'You dig for the Sun crew. Your Undertaker: {name}.', out: 'The Sun crew opened Death\'s grave and is out of the game.' },
  V: { relicOther: 'A relic of the Stars: it goes to the Stars crew.', relic: 'A relic of the Stars!', win: 'The Stars rise. The Stars crew wins.', first: 'The coin decides: the Stars crew digs first.',
    cap3: 'You are the Undertaker of the Stars crew. Only the three Undertakers see the burial register.',
    dig: 'You dig for the Stars crew. Your Undertaker: {name}.', out: 'The Stars crew opened Death\'s grave and is out of the game.' },
};
/** Proper-noun categories: off by default (famous names make poor signs). */
export const FAMOUS = ['CARTOONS', 'CELEBS', 'VIDEOGAMES', 'GAMEHEROES', 'MOVIES', 'HEROES', 'LANDMARKS'];
/** Emblems left out of the icon pool: near-duplicates and marks that only mean something with their names. */
const ICON_SKIP = new Set(['approve', 'reject', 's_lone', 's_lost', 's_nays', 's_against', 's_twice', 's_thrice', 's_clean', 's_self', 's_popular',
  's_first', 's_restless', 's_crowd', 'ward', 'bodyguard', 'regular', 'extra', 'living', 'demon', 'succeed', 'sabotage']);
export const ICON_POOL = Object.keys(EMBLEMS).filter((id) => !ICON_SKIP.has(id));

export const G_DEFAULTS = { tiles: 'words', famous: false, teams: 2, crews: 'seats', captains: 'rotate', signs: 'typed', games: 1, crew: {}, cap: {} };
export const G_TIMER_DEFAULTS = { gIntro: 20, gSign: 90, gVote: 45 };

let RNG = null;
const T = (m, key) => m.settings.timers?.[key] ?? G_TIMER_DEFAULTS[key] ?? 0;
const bump = (m) => { m.stateVersion++; };
export const gSettings = (s) => ({ ...G_DEFAULTS, ...(s.g || {}) });
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
const G = (m) => m.G;
const shuffle = (arr, tag) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = RNG.int(i + 1, tag); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function enter(m, phase, now, seconds) {
  m.phase = phase;
  m.phaseSeq++;
  m.phaseId = `${phase}:${m.G?.turnNo ?? 0}:${m.phaseSeq}`;
  m.openedAt = now;
  m.deadline = seconds > 0 ? now + seconds * 1000 : null;
  bump(m);
}

// ── Settings ───────────────────────────────────────────────────────────────
export function applyGravePatch(s, patch) {
  if (!patch || typeof patch !== 'object') return;
  const k = gSettings(s);
  if (['words', 'icons'].includes(patch.tiles)) k.tiles = patch.tiles;
  if (typeof patch.famous === 'boolean') k.famous = patch.famous;
  if ([2, 3].includes(Number(patch.teams))) k.teams = Number(patch.teams);
  if (['seats', 'random', 'chosen'].includes(patch.crews)) k.crews = patch.crews;
  if (['rotate', 'random', 'chosen'].includes(patch.captains)) k.captains = patch.captains;
  if (['typed', 'spoken'].includes(patch.signs)) k.signs = patch.signs;
  if ([1, 3, 5].includes(Number(patch.games))) k.games = Number(patch.games);
  if (patch.crew && typeof patch.crew === 'object') {
    const c = { ...k.crew };
    for (const [pid, v] of Object.entries(patch.crew)) if (CREWS.includes(v)) c[pid] = v; else delete c[pid];
    k.crew = c;
  }
  if (patch.cap && typeof patch.cap === 'object') {
    const c = { ...k.cap };
    for (const x of CREWS) if (x in patch.cap) { if (typeof patch.cap[x] === 'string') c[x] = patch.cap[x]; else delete c[x]; }
    k.cap = c;
  }
  s.g = k;
}

/** Who is on which crew, from the settings (random crews are dealt at the start). */
export function crewsFor(players, settings, rng = null) {
  const k = gSettings(settings);
  const ids = players.map((p) => p.id);
  const list = crewIds(k);
  const out = Object.fromEntries(list.map((c) => [c, []]));
  const smallest = () => list.reduce((a, c) => (out[c].length < out[a].length ? c : a), list[0]);
  if (k.crews === 'chosen') {
    for (const id of ids) if (list.includes(k.crew[id])) out[k.crew[id]].push(id);
    for (const id of ids) if (!list.includes(k.crew[id])) out[smallest()].push(id);
  } else if (k.crews === 'seats') {
    // Crews follow the table: the seats are cut into halves (or thirds), the first part digs for the Moon.
    const bySeat = [...players].sort((a, b) => (a.seat ?? 0) - (b.seat ?? 0));
    bySeat.forEach((p, i) => out[list[seatCrewIndex(i, bySeat.length, list.length)]].push(p.id));
  } else {
    const order = rng ? (() => { const a = [...ids]; for (let i = a.length - 1; i > 0; i--) { const j = rng.int(i + 1, 'gcrew'); [a[i], a[j]] = [a[j], a[i]]; } return a; })() : ids;
    order.forEach((id, i) => out[list[i % list.length]].push(id));
  }
  return out;
}

/** Which part of the table seat i of n belongs to, with `parts` crews: the earlier parts take the extra seats. */
export function seatCrewIndex(i, n, parts) {
  const base = Math.floor(n / parts);
  const extra = n % parts;
  let start = 0;
  for (let c = 0; c < parts; c++) {
    const size = base + (c < extra ? 1 : 0);
    if (i < start + size) return c;
    start += size;
  }
  return parts - 1;
}

export function validateGrave(n, settings, players = []) {
  const k = gSettings(settings);
  const errors = [];
  const warnings = [];
  if (n < G_MIN) errors.push(['At least {min} players are needed (currently {n}).', { min: G_MIN, n }]);
  if (n > G_MAX) errors.push(['{preset} supports at most {n} players.', { preset: 'Graverobbers', n: G_MAX }]);
  if (k.teams === 3 && n < 6 && n >= G_MIN) errors.push(['Three crews need at least {min} players (currently {n}).', { min: 6, n }]);
  if (k.crews === 'chosen' && players.length >= G_MIN) {
    const c = crewsFor(players, settings);
    if (Object.values(c).some((x) => x.length < 2)) errors.push('Each crew needs at least two players.');
  }
  return { ok: errors.length === 0, errors, warnings, publicDeck: { exact: {} }, suggestions: [] };
}

// ── The board ──────────────────────────────────────────────────────────────
/** Deal 25 headstones: words from the whole pool (no categories), or icons. */
function dealStones(m) {
  const k = m.config;
  if (k.tiles === 'icons') return shuffle(ICON_POOL, 'gicons').slice(0, 25).map((id) => ({ icon: id }));
  const lang = k.lang;
  const pool = [];
  for (const c of CATEGORIES) {
    if (!k.famous && FAMOUS.includes(c.id)) continue;
    const ws = c.words[lang] ?? c.words.en;
    ws.forEach((w, i) => pool.push({ c: c.id, i, w }));
  }
  const seen = new Set();
  const out = [];
  for (const x of shuffle(pool, 'gwords')) {
    const f = fold(x.w);
    if (seen.has(f) || [...seen].some((s) => s.length >= 4 && f.length >= 4 && (s.includes(f) || f.includes(s)))) continue;
    seen.add(f);
    out.push(x);
    if (out.length === 25) break;
  }
  return out;
}

// ── Start ──────────────────────────────────────────────────────────────────
export function startGrave(m, rng, now) {
  RNG = rng;
  const k = gSettings(m.settings);
  m.players.forEach((p) => {
    Object.assign(p, {
      roleId: 'G_DIGGER', originalRoleId: 'G_DIGGER', alignment: ROLES.G_DIGGER.alignment, alive: true, charges: {}, statuses: [],
      teamJoinNight: null, tempRevival: null, revivedOnce: false, acknowledged: false, lover: null, diedAt: null, causes: null, ready: false,
    });
  });
  m.config = { mode: 'graverobbers', preset: 'graverobbers', graverobbers: true, ...k, lang: m.settings.lang || 'en' };
  Object.assign(m, { activeRules: [], scenario: null, history: [], publicLog: [], privateLog: {}, chats: {}, day: null, night: null,
    dayNumber: 0, nightNumber: 0, winner: null, endReason: null, M: null, X: null, C: null, K: null, N: null, S: null });
  m.gScores ||= {};
  m.gMatch = m.gMatch && m.gMatch.played < m.gMatch.total && m.gMatch.total === k.games ? m.gMatch : { played: 0, total: k.games };
  if (m.gMatch.played === 0) m.gScores = {};
  const crews = crewsFor(m.players, m.settings, k.crews === 'random' ? rng : null);
  const order = seatOrder(m);
  const list = crewIds(k);
  for (const c of list) crews[c].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  // Undertakers: chosen, random, or rotating through each crew game by game.
  const caps = {};
  for (const c of list) {
    const ids = crews[c];
    if (k.captains === 'chosen' && ids.includes(k.cap[c])) caps[c] = k.cap[c];
    else if (k.captains === 'rotate') caps[c] = ids[m.gMatch.played % ids.length];
    else caps[c] = ids[rng.int(ids.length, 'gcap')];
  }
  const first = list[rng.int(list.length, 'gfirst')];
  // Turn order: from the first crew on, in the fixed order Moon → Sun → Stars.
  const fi = list.indexOf(first);
  const turnOrder = [...list.slice(fi), ...list.slice(0, fi)];
  const cnt = relicCounts(list.length);
  const need = Object.fromEntries(list.map((c) => [c, c === first ? cnt.first : cnt.rest]));
  const stones = dealStones(m);
  const kinds = shuffle([...list.flatMap((c) => Array(need[c]).fill(c)), ...Array(cnt.empty).fill('N'), 'D'], 'gkinds');
  const zero = () => Object.fromEntries(list.map((c) => [c, 0]));
  m.G = {
    tiles: stones.map((s, i) => ({ ...s, k: kinds[i], open: false, by: null })),
    crews, caps, first, order: turnOrder, out: [], turn: first, turnNo: 0, sign: null, digs: 0, used: 0, bonus: zero(), turnBonus: 0,
    votes: {}, acks: {}, found: zero(), need,
    signs: [], digsLog: [], last: null, winner: null, cause: null,
  };
  for (const c of list) for (const id of crews[c]) {
    const p = m.players.find((x) => x.id === id);
    const cap = caps[c] === id;
    Object.assign(p, { roleId: cap ? 'G_UNDERTAKER' : 'G_DIGGER', originalRoleId: cap ? 'G_UNDERTAKER' : 'G_DIGGER', team: c });
    priv(m, id, cap ? [CREW_LINES[c][list.length === 3 ? 'cap3' : 'cap2'], {}] : [CREW_LINES[c].dig, { name: nameOf(m, caps[c]) }], 'role', { card: cap ? 'G_UNDERTAKER' : 'G_DIGGER', crew: c });
  }
  pub(m, [CREW_LINES[first].first, {}], 'phase', { ev: 'g-start', first, crews: structuredClone(crews), caps: { ...caps } });
  enter(m, 'G_INTRO', now, T(m, 'gIntro'));
}

// ── Turns ──────────────────────────────────────────────────────────────────
const diggersOf = (m, c) => G(m).crews[c].filter((id) => id !== G(m).caps[c]);

function beginTurn(m, now) {
  const st = G(m);
  st.turnNo++;
  Object.assign(st, { sign: null, digs: 0, used: 0, turnBonus: 0, votes: {} });
  enter(m, 'G_SIGN', now, T(m, 'gSign'));
}

/** Is this a fair sign? One word, not on the board, not part of a word on it. */
export function signProblem(m, word) {
  const w = String(word ?? '').trim();
  if (!w) return 'Type one word.';
  if (/\s/.test(w)) return 'One word only.';
  if (w.length > 24) return 'That word is too long.';
  const f = fold(w);
  if (!f) return 'Type one word.';
  if (m.config.tiles !== 'icons') {
    for (const t of G(m).tiles) {
      const tf = fold(t.w);
      if (tf === f) return 'That word is on the board.';
      if (f.length >= 3 && tf.length >= 3 && (tf.includes(f) || f.includes(tf))) return 'That word is part of a word on the board.';
    }
  }
  return null;
}

function giveSign(m, now, word, n) {
  const st = G(m);
  const crew = st.turn;
  st.turnBonus = st.bonus[crew];
  st.bonus[crew] = 0;
  st.sign = { word: word ?? null, n, by: st.caps[crew], crew };
  st.digs = n + st.turnBonus;
  st.used = 0;
  st.signs.push({ ...st.sign, turn: st.turnNo, bonus: st.turnBonus });
  pub(m, word ? ['{name}: “{word}” · {n}', { name: nameOf(m, st.caps[crew]), word, n }] : ['{name} gives the sign · {n}', { name: nameOf(m, st.caps[crew]), n }],
    'phase', { ev: 'g-sign', crew, word: word ?? null, n, bonus: st.turnBonus });
  openVote(m, now);
}

function openVote(m, now) {
  G(m).votes = {};
  enter(m, 'G_DIG', now, T(m, 'gVote'));
}

function endTurn(m, now) {
  const st = G(m);
  st.turn = nextCrew(st, st.turn);
  beginTurn(m, now);
}

/** The next crew still in the game, in turn order. */
function nextCrew(st, c) {
  const o = st.order ?? ['B', 'G'];
  for (let k = 1; k <= o.length; k++) {
    const x = o[(o.indexOf(c) + k) % o.length];
    if (!(st.out ?? []).includes(x)) return x;
  }
  return c;
}

/** Close the vote: the most votes digs (a tie goes to the coin), or the crew stops. */
function resolveVote(m, now) {
  const st = G(m);
  const crew = st.turn;
  const tally = {};
  for (const id of diggersOf(m, crew)) { const v = st.votes[id]; if (v != null) tally[v] = (tally[v] || 0) + 1; }
  const top = Math.max(0, ...Object.values(tally));
  const tied = Object.keys(tally).filter((x) => tally[x] === top);
  let choice = tied.length ? tied[RNG.int(tied.length, 'gtie')] : 'stop';
  if (!tied.length) choice = 'stop';
  const coin = tied.length > 1 ? { options: tied.map((x) => (x === 'stop' ? 'stop' : Number(x))), pick: choice === 'stop' ? 'stop' : Number(choice) } : null;
  if (choice === 'stop') return stop(m, now, coin, tally);
  dig(m, now, Number(choice), coin, tally);
}

function stop(m, now, coin, tally) {
  const st = G(m);
  const crew = st.turn;
  // Stopping before the Undertaker's number earns one bonus dig next turn (never more than one).
  const earned = st.used < st.sign.n;
  if (earned) st.bonus[crew] = 1;
  st.digsLog.push({ turn: st.turnNo, crew, stop: true, earned, tally });
  pub(m, [earned ? 'The crew stops digging, and keeps one bonus dig for next time.' : 'The crew stops digging.', {}], 'phase', { ev: 'g-dig', crew, stop: true, earned, coin, tally });
  endTurn(m, now);
}

function dig(m, now, idx, coin, tally) {
  const st = G(m);
  const crew = st.turn;
  const t = st.tiles[idx];
  t.open = true;
  t.by = crew;
  st.used++;
  const kind = t.k;
  st.last = { idx, kind, crew };
  st.digsLog.push({ turn: st.turnNo, crew, idx, kind, tally });
  const ev = { ev: 'g-dig', crew, idx, kind, coin, tally, label: t.w ?? t.icon, icon: t.icon ?? null };
  if (kind === 'D') {
    pub(m, ['Death\'s grave is open.', {}], 'phase', ev);
    st.out.push(crew);
    const left = st.order.filter((c) => !st.out.includes(c));
    if (left.length === 1) return finish(m, now, left[0], 'death');
    // Three crews: the crew that opened Death's grave is out; the others dig on.
    pub(m, [CREW_LINES[crew].out, {}], 'phase', { ev: 'g-out', crew });
    return endTurn(m, now);
  }
  if (kind === 'N') {
    pub(m, ['An empty grave.', {}], 'phase', ev);
    return endTurn(m, now);
  }
  st.found[kind]++;
  if (kind !== crew) {
    pub(m, [CREW_LINES[kind].relicOther, {}], 'phase', ev);
    if (st.found[kind] >= st.need[kind] && !st.out.includes(kind)) return finish(m, now, kind, 'relics');
    return endTurn(m, now);
  }
  pub(m, [CREW_LINES[kind].relic, {}], 'phase', ev);
  if (st.found[kind] >= st.need[kind]) return finish(m, now, kind, 'relics');
  if (st.used >= st.digs) return endTurn(m, now);
  openVote(m, now);
}

function finish(m, now, winner, cause) {
  const st = G(m);
  st.winner = winner;
  st.cause = cause;
  m.winner = 'GRAVEROBBERS';
  const sc = (m.gScores ||= {});
  for (const id of st.crews[winner]) sc[id] = (sc[id] || 0) + 1;
  for (const c of Object.keys(st.crews)) for (const id of st.crews[c]) sc[id] = sc[id] || 0;
  m.gMatch.played++;
  const label = CREW_LINES[winner].win;
  m.endReason = cause === 'death' ? ['{label} (Death\'s grave was opened.)', { label: [label, {}] }] : [label, {}];
  pub(m, m.endReason, 'end', { ev: 'end', winner: 'GRAVEROBBERS', crew: winner, cause, pids: [...st.crews[winner]], reason: m.endReason });
  enter(m, 'ENDED', now, G_RETURN_SECONDS);
}

// ── Commands ───────────────────────────────────────────────────────────────
export function graveCommand(m, p, type, payload, rng, now) {
  RNG = rng;
  const st = G(m);
  const need = (phase) => { if (m.phase !== phase) throw new GameError('That window has closed.', 'STALE'); };
  const crewOf = (id) => crewOfId(st, id);
  switch (type) {
    case 'g.ack':
      need('G_INTRO');
      st.acks[p.id] = true;
      if (seatOrder(m).every((id) => st.acks[id])) return beginTurn(m, now);
      return bump(m);
    case 'g.sign': {
      need('G_SIGN');
      if (st.caps[st.turn] !== p.id) throw new GameError('Only the Undertaker of the crew in play gives the sign.');
      const n = Number(payload.n);
      if (!Number.isInteger(n) || n < 1 || n > 9) throw new GameError('Choose a number from 1 to 9.');
      let word = null;
      if (m.config.signs === 'typed') {
        const bad = signProblem(m, payload.word);
        if (bad) throw new GameError(bad);
        word = String(payload.word).trim();
      }
      return giveSign(m, now, word, n);
    }
    case 'g.vote': {
      need('G_DIG');
      if (crewOf(p.id) !== st.turn || st.caps[st.turn] === p.id) throw new GameError('Only the diggers of the crew in play vote.');
      const v = payload.tile;
      if (v == null) delete st.votes[p.id];
      else if (v === 'stop') st.votes[p.id] = 'stop';
      else {
        const i = Number(v);
        if (!st.tiles[i] || st.tiles[i].open) throw new GameError('Pick a grave that is still closed.');
        st.votes[p.id] = i;
      }
      if (diggersOf(m, st.turn).every((id) => st.votes[id] != null)) {
        // Unanimous? Dig at once. Otherwise the vote stays open for a change of heart until the timer or the host closes it.
        const vals = new Set(diggersOf(m, st.turn).map((id) => String(st.votes[id])));
        if (vals.size === 1) return resolveVote(m, now);
      }
      return bump(m);
    }
    default: throw new GameError('Unknown command.');
  }
}

export function graveAdvance(m, rng, now) {
  RNG = rng;
  switch (m.phase) {
    case 'G_INTRO': return beginTurn(m, now);
    case 'G_SIGN': {
      // The Undertaker kept silent: the turn passes.
      pub(m, ['The Undertaker kept silent. The turn passes.', {}], 'phase', { ev: 'g-silent', crew: G(m).turn });
      return endTurn(m, now);
    }
    case 'G_DIG': return resolveVote(m, now);
    default: throw new GameError('Nothing to advance.');
  }
}

export const G_ADVANCE_LABEL = { G_INTRO: 'Open the cemetery', G_SIGN: 'Skip the sign', G_DIG: 'Close the vote' };

/** Which crew a player digs for. */
export const crewOfId = (st, id) => Object.keys(st.crews).find((c) => st.crews[c].includes(id)) ?? null;

// ── Views ──────────────────────────────────────────────────────────────────
export function gravePublic(m) {
  const st = G(m);
  if (!st) return null;
  const ended = m.phase === 'ENDED';
  return {
    mode: m.config.tiles, signs: m.config.signs,
    tiles: st.tiles.map((t) => ({ w: t.w ?? null, icon: t.icon ?? null, open: t.open, k: t.open || ended ? t.k : null, by: t.by })),
    crews: st.crews, caps: st.caps, first: st.first, order: st.order ?? ['B', 'G'], out: st.out ?? [], turn: st.turn, turnNo: st.turnNo, sign: st.sign, digs: st.digs, used: st.used,
    bonus: st.bonus, turnBonus: st.turnBonus, found: st.found, need: st.need,
    votes: m.phase === 'G_DIG' ? st.votes : {}, acked: m.phase === 'G_INTRO' ? Object.keys(st.acks) : [],
    last: st.last, winner: st.winner, cause: st.cause, history: ended ? { signs: st.signs, digs: st.digsLog } : undefined,
    scores: m.gScores ?? {}, match: m.gMatch,
  };
}

export function graveMe(m, p) {
  const st = G(m);
  if (!st) return {};
  const crew = crewOfId(st, p.id);
  const captain = crew && st.caps[crew] === p.id;
  const out = { crew, captain: !!captain, vote: st.votes[p.id] ?? null };
  // The burial register: only the Undertakers.
  if (captain) out.register = st.tiles.map((t) => t.k);
  return out;
}

export function graveAction(m, p) {
  const st = G(m);
  const crew = crewOfId(st, p.id);
  const cap = crew && st.caps[crew] === p.id;
  switch (m.phase) {
    case 'G_INTRO': return { type: 'gintro', done: !!st.acks[p.id] };
    case 'G_SIGN': return cap && crew === st.turn ? { type: 'gsign', typed: m.config.signs === 'typed' } : { type: 'gwait' };
    case 'G_DIG': return !cap && crew === st.turn ? { type: 'gvote', choice: st.votes[p.id] ?? null } : { type: 'gwatch' };
    default: return { type: 'none' };
  }
}

export function graveProgress(m) {
  const st = G(m);
  if (m.phase === 'G_INTRO') return { label: 'ready', done: Object.keys(st.acks).length, total: m.players.length };
  if (m.phase === 'G_DIG') { const ds = diggersOf(m, st.turn); return { label: 'votes in', done: ds.filter((id) => st.votes[id] != null).length, total: ds.length }; }
  return null;
}

export const graveSecrets = (m) => (G(m) ? { register: G(m).tiles.map((t) => t.k), words: G(m).tiles.map((t) => t.c ?? null) } : null);

// ── For bots ───────────────────────────────────────────────────────────────
/** A one-word sign per category, for practice bots (never shown as board words). */
const CAT_SIGN = { ANIMALS: 'zoo', FOOD: 'meal', HOUSE: 'home', PLACES: 'town', JOBS: 'work', NATURE: 'outdoors', GAMES: 'olympics', TRANSPORT: 'travel',
  SPOOKY: 'halloween', CLOTHES: 'wardrobe', CARTOONS: 'animation', CELEBS: 'famous', VIDEOGAMES: 'console', GAMEHEROES: 'gamer', MOVIES: 'film',
  HEROES: 'comics', LANDMARKS: 'tourism', TOOLS: 'workshop', BODY: 'anatomy', SKY: 'heavens', MUSIC: 'melody', SEA: 'ocean', CASTLE: 'medieval',
  KITCHEN: 'cooking', SCIENCE: 'experiment', PLAY: 'playground', BUILDINGS: 'architecture', PLANTS: 'garden', MAGIC: 'sorcery', FABRIC: 'fashion', CRIME: 'police' };
/** The groups a tile belongs to, for bots: its category, or its icon's concept tags. */
export const tileKeys = (t) => (t.c ? [t.c] : MOTIF_TAGS[t.icon] ?? [t.icon]);
export const keySign = (key) => CAT_SIGN[key] ?? key;
export const signKey = (word) => Object.keys(CAT_SIGN).find((k) => CAT_SIGN[k] === word) ?? word;
