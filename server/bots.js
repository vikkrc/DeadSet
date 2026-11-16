// Practice bots: stand-in players for testing a table alone. They see exactly
// what a human in their seat would see (playerView) and act with simple random
// choices. They never chat. The host adds them from a hidden lobby panel.
import { categoryById } from '../engine/words.js';
import { playerView } from '../engine/views.js';
import { AVATAR_PARTS } from '../engine/content.js';
import { randomTeam } from '../engine/missions.js';
import { carnivalBelief } from '../engine/carnival.js';
import { fit, VISIONS } from '../engine/seancecontent.js';
import { tileKeys, keySign, signKey, signProblem } from '../engine/graverobbers.js';

export const BOT_NAMES = ['Ash', 'Bram', 'Cass', 'Dorian', 'Edda', 'Finch', 'Greer', 'Hollis', 'Isolde', 'Jem', 'Kestrel', 'Lark',
  'Mabel', 'Nell', 'Orrin', 'Perpetua', 'Quill', 'Rook', 'Silas', 'Tamsin', 'Ursa', 'Vesper', 'Wren', 'Yarrow', 'Zeke'];

const pick = (rng, arr) => arr[rng.int(arr.length)];
const chance = (rng, p) => rng.int(1000) < p * 1000;

export function botAvatar(rng) {
  return Object.fromEntries(Object.entries(AVATAR_PARTS).map(([k, n]) => [k, rng.int(n)]));
}

/**
 * What a bot does next in the current phase. Returns { cmd } to act,
 * { wait: true } to try again shortly, or null when it has nothing to do.
 */
export function botDecide(m, botId, rng) {
  const v = playerView(m, botId);
  const me = v.me;
  const a = v.action || {};
  if (!me) return null;
  switch (m.phase) {
    case 'LOBBY': return me.ready ? null : { cmd: { type: 'lobby.ready', payload: { ready: true } } };
    case 'NIGHT_0_REVEAL': return a.done ? null : { cmd: { type: 'role.ack', payload: {} } };
    case 'DAY_DISCUSSION':
      if (a.type === 'nominate' && !a.mine && a.targets?.length && chance(rng, 0.45)) return { cmd: { type: 'day.nominate', payload: { target: pick(rng, a.targets) } } };
      return null;
    case 'DAY_VOTING':
      if (a.type !== 'ballot' || a.choice) return null;
      if (chance(rng, 0.15) || !a.candidates?.length) return { cmd: { type: 'day.ballot', payload: { target: 'ABSTAIN' } } };
      return { cmd: { type: 'day.ballot', payload: { target: pick(rng, a.candidates.filter((id) => id !== me.id).length ? a.candidates.filter((id) => id !== me.id) : a.candidates) } } };
    case 'DAY_RESOLVING':
      if (a.type !== 'retaliate') return null;
      return { cmd: { type: 'day.retaliate', payload: { target: a.targets?.length && chance(rng, 0.7) ? pick(rng, a.targets) : null } } };
    case 'NIGHT_DREAM_SWAP':
      if (a.type === 'swap' && a.snatcher && a.choice == null && a.targets?.length && chance(rng, 0.5)) return { cmd: { type: 'dream.swap', payload: { target: pick(rng, a.targets) } } };
      return null;
    case 'NIGHT_ACTIONS': return nightMove(m, v, rng);
    default: return m.X ? exorcismMove(m, v, rng) : m.G ? graveMove(m, v, rng) : m.S ? seanceMove(m, v, rng) : m.N ? midnightMove(m, v, rng) : m.K ? carnivalMove(m, v, rng) : m.C ? coffinsMove(m, v, rng) : m.M ? missionMove(m, v, rng) : null;
  }
}

// ── Exorcism ───────────────────────────────────────────────────────────────
// Bots say a word from the category (a Living bot sometimes says the password's
// neighbour in the list, a Demon bot a random one), vote for someone they did
// not hear much sense from (random, never a known fellow Demon), and a caught
// Demon guesses at random on the grid.
function exorcismMove(m, v, rng) {
  const a = v.action || {};
  const me = v.me;
  switch (a.type) {
    case 'xack': return a.done ? null : { cmd: { type: 'x.ack', payload: {} } };
    case 'xspeak': {
      const cat = categoryById(m.X.category);
      const words = cat.words[m.config.lang] ?? cat.words.en;
      const k = me.x?.demon ? rng.int(words.length) : (m.X.word + 1 + rng.int(3)) % words.length;
      return { cmd: { type: 'x.done', payload: { word: a.typed ? words[k] : undefined } } };
    }
    case 'xready': return a.ready ? null : { cmd: { type: 'x.ready', payload: { ready: true } } };
    case 'xvote': {
      if (a.choice) return null;
      const mates = new Set((me.x?.demonMates ?? []).map((x) => x.id));
      const pool = a.targets.filter((id) => !mates.has(id));
      return { cmd: { type: 'x.vote', payload: { target: pick(rng, pool.length ? pool : a.targets) } } };
    }
    case 'xguess': return { cmd: { type: 'x.guess', payload: { index: pick(rng, a.grid ?? [0]) } } };
    default: return null;
  }
}

// ── Coffins ────────────────────────────────────────────────────────────────
// Bots bury their curse early about a third of the time (the Death coffin
// early, so it gets dug), bid what they believe is safe (their own buried gold
// plus a share of the table) and sometimes bluff a raise, dig the plots of
// players who passed rather than those who bid high, and wager like the dice.
// Graverobbers: an Undertaker bot names the group (category, or an icon's concept tag) holding most of its crew's
// closed graves and none near Death; digger bots vote for closed graves in that group, and stop when none is left.
function graveMove(m, v, rng) {
  const a = v.action || {};
  const G = m.G;
  switch (a.type) {
    case 'gintro': return a.done ? null : { cmd: { type: 'g.ack', payload: {} } };
    case 'gsign': {
      if (!chance(rng, 0.5)) return null;
      const crew = G.turn;
      const count = {};
      const bad = new Set(G.tiles.filter((t) => !t.open && t.k === 'D').flatMap(tileKeys));
      for (const t of G.tiles) if (!t.open && t.k === crew) for (const k of tileKeys(t)) if (!bad.has(k)) count[k] = (count[k] || 0) + 1;
      const ranked = Object.keys(count).sort((x, y) => count[y] - count[x]);
      for (const k of ranked) {
        const word = keySign(k);
        if (!a.typed || !signProblem(m, word)) return { cmd: { type: 'g.sign', payload: { word, n: Math.min(3, count[k]) } } };
      }
      return { cmd: { type: 'g.sign', payload: { word: 'beyond', n: 1 } } };
    }
    case 'gvote': {
      if (a.choice != null || !chance(rng, 0.45)) return null;
      const key = signKey(G.sign?.word ?? '');
      const hits = G.tiles.map((t, i) => ({ t, i })).filter(({ t }) => !t.open && tileKeys(t).includes(key));
      if (!hits.length) return { cmd: { type: 'g.vote', payload: { tile: G.used > 0 || chance(rng, 0.5) ? 'stop' : G.tiles.findIndex((t) => !t.open) } } };
      return { cmd: { type: 'g.vote', payload: { tile: hits[0].i } } };
    }
    default: return null;
  }
}

// Séance: the Ghost sends the vision that fits the truth best and the rest of the row least,
// and frosts a vision it did not send; Mediums light the card their row's visions fit best;
// the Deceiver swaps in a vision that fits a near miss, and lights plausibly wrong.
function seanceMove(m, v, rng) {
  const a = v.action || {};
  const me = v.me.id;
  const S = v.seance;
  const s = v.me.s ?? {};
  const open = (row) => S.board[row].filter((c) => !S.struck[row].includes(c));
  const best = (scores) => { const top = Math.max(...Object.values(scores)); const ids = Object.keys(scores).filter((k) => scores[k] === top); return Number(pick(rng, ids)); };
  switch (a.type) {
    case 'sintro': return a.done ? null : { cmd: { type: 's.ack', payload: {} } };
    case 'ssend': {
      const to = Object.keys(S.assign).find((id) => (s.sent?.[id]?.length ?? 0) < S.perMedium);
      if (!to || !s.hand?.length || !chance(rng, 0.5)) return null;
      const row = S.assign[to];
      const others = open(row).filter((c) => c !== s.truth[row]);
      const score = (vid) => fit(vid, row, s.truth[row]) * 2 - Math.max(0, ...others.map((c) => fit(vid, row, c)));
      const vision = [...s.hand].sort((x, y) => score(y) - score(x))[0];
      return { cmd: { type: 's.send', payload: { target: to, vision } } };
    }
    case 'simpress': {
      if (s.impression != null || !chance(rng, 0.4)) return null;
      if (s.role === 'DECEIVER' && !s.swap && s.swapsLeft > 0 && chance(rng, 0.7)) {
        const targets = Object.keys(S.assign).filter((id) => id !== me);
        const t = pick(rng, targets);
        const row = S.assign[t];
        const near = open(row).filter((c) => c !== s.truth[row]);
        const score = (vid) => Math.max(0, ...near.map((c) => fit(vid, row, c))) * 2 - fit(vid, row, s.truth[row]);
        const vision = [...s.dhand].sort((x, y) => score(y) - score(x))[0];
        if (vision != null) return { cmd: { type: 's.swap', payload: { target: t, vision } } };
      }
      return { cmd: { type: 's.impress', payload: { card: pick(rng, open(a.row)) } } };
    }
    case 'scold': {
      if (!S.cold || !chance(rng, 0.3)) return null;
      const t = Object.keys(S.shown ?? {}).find((id) => !S.frosted.includes(id) && S.shown[id].some((x) => !(s.sent?.[id] ?? []).includes(x)));
      return t ? { cmd: { type: 's.cold', payload: { target: t } } } : null;
    }
    case 'slight': {
      if (s.lit != null || !chance(rng, 0.4)) return null;
      const row = a.row;
      const cands = open(row);
      const visions = Object.entries(S.shown ?? {}).filter(([id]) => S.assign[id] === row && !S.frosted.includes(id)).flatMap(([, vs]) => vs);
      const scores = Object.fromEntries(cands.map((c) => [c, visions.reduce((n, vid) => n + fit(vid, row, c), 0) + rng.int(100) / 1000]));
      if (s.role === 'DECEIVER' && chance(rng, 0.6)) { delete scores[s.truth[row]]; if (!Object.keys(scores).length) return { cmd: { type: 's.light', payload: { card: 'abstain' } } }; }
      return { cmd: { type: 's.light', payload: { card: best(scores) } } };
    }
    case 'sname': {
      if (s.named || !chance(rng, 0.5)) return null;
      // Suspicion: candles lit on cards that turned out wrong.
      const sus = Object.fromEntries(a.targets.map((id) => [id, rng.int(100) / 1000]));
      for (const r of S.past ?? []) for (const [id, c] of Object.entries(r.lit ?? {})) if (id in sus && c !== 'abstain' && S.solved[r.assign[id]] != null && Number(c) !== S.solved[r.assign[id]]) sus[id] += 1;
      if (s.role === 'DECEIVER') for (const f of [me, ...(s.fellows ?? [])]) delete sus[f];
      const ranked = Object.keys(sus).sort((x, y) => sus[y] - sus[x]);
      return { cmd: { type: 's.name', payload: { targets: ranked.slice(0, a.count) } } };
    }
    default: return null;
  }
}

// Midnight: act at random within the role; by day, Death points at someone it knows is not Death.
function midnightMove(m, v, rng) {
  const a = v.action || {};
  const me = v.me.id;
  switch (a.type) {
    case 'ndeal': return a.done ? null : { cmd: { type: 'n.ack', payload: {} } };
    case 'nstep': {
      if (!chance(rng, 0.35)) return null; // act some time during the step
      switch (a.kind) {
        case 'copy': case 'DOUBLE_AGENT': return { cmd: { type: 'n.act', payload: { target: pick(rng, a.targets) } } };
        case 'lonePeek': case 'GAMBLER': return { cmd: { type: 'n.act', payload: { table: pick(rng, a.tables) } } };
        case 'MENTALIST': return chance(rng, 0.6) ? { cmd: { type: 'n.act', payload: { target: pick(rng, a.targets) } } } : { cmd: { type: 'n.act', payload: { tables: a.tables.slice(0, 2) } } };
        case 'WITCH': { const x = pick(rng, a.targets); const y = pick(rng, a.targets.filter((t) => t !== x)); return { cmd: { type: 'n.act', payload: { targets: [x, y] } } }; }
        default: return null;
      }
    }
    case 'nvote': {
      if (a.choice) return null;
      const deaths = new Set((v.me.n?.seen ?? []).flatMap((e) => (e.cards ?? []).filter((c) => c.role === 'DEATH').map((c) => c.seat)));
      const iAmDeath = v.me.n?.dealt === 'DEATH';
      const pool = iAmDeath ? a.targets.filter((t) => !deaths.has(t)) : a.targets.filter((t) => !(v.me.n?.seen ?? []).some((e) => e.step === 'N_TWIN' && e.cards.some((c) => c.seat === t)));
      return { cmd: { type: 'n.vote', payload: { target: pick(rng, pool.length ? pool : a.targets) } } };
    }
    default: return null;
  }
}

// Carnival: a belief table per bot (where each mask probably is). Claim when sure, bluff a little, challenge when it is probably yours.
const K_VALUE = { CONSPIRATOR: 5, DEATH: 3, MAGISTRATE: 4, DIPLOMAT: 4, RIPPER: 3, GAMBLER: 3, JESTER: 2, GUARDIAN: 2, BARD: 2, SCAPEGOAT: 2, MIMIC: 2, INNOCENT: 1, MENTALIST: 1, ORACLE: 1, WITCH: 1, DOUBLE_AGENT: 1 };
function carnivalMove(m, v, rng) {
  const a = v.action || {};
  const me = v.me.id;
  const B = carnivalBelief(m, me);
  const mine = B[me] ?? { mask: null, p: 0 };
  const K = v.carnival;
  const value = (mask) => (mask === 'MAGISTRATE' ? (K.offering >= 2 ? 4 : 1) : K_VALUE[mask] ?? 1);
  const richest = (ids) => [...ids].sort((x, y) => (K.seats.find((s) => s.id === y)?.souls ?? 0) - (K.seats.find((s) => s.id === x)?.souls ?? 0))[0];
  switch (a.type) {
    case 'kturn': {
      if (a.forced > 0) return { cmd: { type: 'k.swap', payload: { target: pick(rng, a.targets), real: chance(rng, 0.5) } } };
      if (mine.p >= 0.7 && value(mine.mask) >= 2 && chance(rng, 0.85)) return { cmd: { type: 'k.claim', payload: { mask: mine.mask } } };
      if (chance(rng, 0.1)) { const strong = a.masks.filter((x) => value(x) >= 4); if (strong.length) return { cmd: { type: 'k.claim', payload: { mask: pick(rng, strong) } } }; }
      if (mine.p < 0.6 && chance(rng, 0.6)) return { cmd: { type: 'k.peek', payload: {} } };
      if (mine.p >= 0.7 && value(mine.mask) < 2) return { cmd: { type: 'k.swap', payload: { target: pick(rng, a.targets), real: true } } };
      return { cmd: { type: 'k.swap', payload: { target: pick(rng, a.targets), real: chance(rng, 0.5) } } };
    }
    case 'klook': return { cmd: { type: 'k.done', payload: {} } };
    case 'kanswer':
      if (a.answer) return null;
      return { cmd: { type: 'k.answer', payload: { mine: mine.mask === a.mask && mine.p >= (a.mask === 'DEATH' ? 0.3 : 0.55) } } };
    case 'kpower': {
      const players = a.targets.filter((id) => !id.startsWith('chair'));
      switch (a.mask) {
        case 'DEATH': case 'SCAPEGOAT': return { cmd: { type: 'k.power', payload: { target: richest(players) } } };
        case 'JESTER': {
          const sure = players.map((id) => ({ id, b: B[id] })).filter((x) => x.b?.mask).sort((x, y) => y.b.p - x.b.p)[0];
          return { cmd: { type: 'k.power', payload: { target: sure?.id ?? pick(rng, players), mask: sure?.b.mask ?? pick(rng, a.masks) } } };
        }
        case 'ORACLE': case 'WITCH': {
          const x = pick(rng, a.targets); let y = pick(rng, a.targets); while (y === x) y = pick(rng, a.targets);
          return { cmd: { type: 'k.power', payload: { targets: [x, y], real: chance(rng, 0.5) } } };
        }
        default: return { cmd: { type: 'k.power', payload: { target: pick(rng, a.targets) } } };
      }
    }
    default: return null;
  }
}

function coffinsMove(m, v, rng) {
  const a = v.action || {};
  const c = v.me.c || {};
  const C = v.coffins;
  const cmd = (type, payload = {}) => ({ cmd: { type, payload } });
  const hand = (c.cards || []).filter((x) => !x.buried);
  const pickCard = (preferCurse) => {
    const death = hand.find((x) => x.face === 'D');
    if (death && chance(rng, 0.7)) return death.id;
    const curse = hand.find((x) => x.face === 'C');
    if (curse && preferCurse) return curse.id;
    const golds = hand.filter((x) => x.face !== 'C');
    return (golds.length ? pick(rng, golds) : pick(rng, hand)).id;
  };
  const safeGuess = () => {
    const mine = (c.cards || []).filter((x) => x.buried);
    const ownSafe = mine.some((x) => x.face === 'C') ? 0 : mine.length;
    const others = C.total - mine.length;
    // Most players bury gold on top, so a few of the others' coffins are fairly safe; more players, more risk each.
    const players = C.plots.filter((x) => !x.out).length;
    return Math.max(1, ownSafe + Math.min(others, Math.floor((players - 1) * (0.15 + rng.int(20) / 100)) + rng.int(2)));
  };
  switch (a.type) {
    case 'cbury': return a.done ? null : cmd('c.bury', { card: pickCard(chance(rng, 0.35)) });
    case 'cturn': {
      if (a.lantern?.length && chance(rng, 0.3)) return cmd('c.lantern', { owner: pick(rng, a.lantern) });
      if (a.canBury && chance(rng, 0.55)) return cmd('c.bury', { card: pickCard(chance(rng, 0.25)) });
      return cmd('c.challenge', { n: Math.min(a.max, safeGuess()) });
    }
    case 'cbid': {
      const safe = safeGuess();
      if (a.min <= a.max && (a.min <= safe || chance(rng, 0.08))) return cmd('c.raise', { n: a.min });
      return cmd('c.pass');
    }
    case 'cwager': return a.bet ? null : cmd('c.wager', { bet: chance(rng, 0.55) ? 'gold' : 'curse' });
    case 'ckey': return cmd('c.key', { owner: chance(rng, 0.6) && a.targets.length ? pick(rng, a.targets) : null });
    case 'cdig': {
      const passed = a.targets.filter((id) => C.passed.includes(id));
      return cmd('c.open', { owner: pick(rng, passed.length && chance(rng, 0.7) ? passed : a.targets) });
    }
    case 'closs': {
      const curse = a.cards.find((x) => x.face === 'C');
      return cmd('c.lose', { card: curse && chance(rng, 0.4) ? curse.id : pick(rng, a.cards).id, first: v.me.id });
    }
    default: return null;
  }
}

// ── Missions ───────────────────────────────────────────────────────────────
// Living bots trust nobody they know is Death; Death bots sabotage most of the
// time (less often when another known Death is on the team, so they don't
// double up).
function missionMove(m, v, rng) {
  const a = v.action || {};
  const me = v.me;
  const M = v.missions;
  const known = new Set([...(me.seesDeath || []), ...(me.teammates || [])].map((x) => x.id));
  const others = v.players.filter((p) => p.id !== me.id).map((p) => p.id);
  const cmd = (type, payload = {}) => ({ cmd: { type, payload } });
  switch (a.type) {
    case 'mack': return a.done ? null : cmd('m.ack');
    case 'mpropose': {
      const { team, ward } = botTeam(m, me, known, rng);
      return cmd('m.propose', { team, ward });
    }
    case 'mvote': {
      if (a.choice !== null) return null;
      const team = M.proposal?.team || [];
      const deathOn = team.filter((id) => known.has(id)).length;
      let approve;
      if (me.alignment === 'DEATH') approve = deathOn > 0 || chance(rng, 0.3);
      else approve = deathOn === 0 && (team.includes(me.id) || chance(rng, 0.6));
      if (M.forced) approve = approve || chance(rng, 0.5);
      return cmd('m.vote', { approve });
    }
    case 'mplay': {
      if (a.played) return null;
      if (!a.canFail) return cmd('m.play', { card: 'S' });
      const mates = (M.proposal?.team || []).filter((id) => id !== me.id && known.has(id)).length;
      return cmd('m.play', { card: chance(rng, mates ? 0.45 : 0.8) ? 'F' : 'S' });
    }
    case 'mnight': {
      if (a.done) return null;
      const payload = { done: true };
      const suspects = others.filter((id) => me.alignment === 'DEATH' ? !known.has(id) : (known.size ? known.has(id) : true));
      payload.hunch = a.hunch ?? pick(rng, suspects.length ? suspects : others);
      if (a.candle) payload.candle = pick(rng, a.candle.targets.filter((id) => id !== me.id));
      if (a.witness) payload.witness = pick(rng, a.witness.targets);
      if (a.haunt) payload.haunt = pick(rng, a.haunt.targets);
      if (a.lantern) {
        const trusted = a.lantern.targets.filter((id) => (me.alignment === 'DEATH') === known.has(id));
        payload.lantern = pick(rng, trusted.length ? trusted : a.lantern.targets);
      }
      return cmd('m.night', payload);
    }
    case 'mstand': {
      if (a.choice) return null;
      const pool = me.alignment === 'DEATH' ? a.targets.filter((id) => !known.has(id)) : a.targets.filter((id) => known.has(id));
      return cmd('m.accuse', { target: pick(rng, pool.length ? pool : a.targets) });
    }
    case 'mreckon': {
      if (a.reaper) {
        const theirs = Object.entries(a.suggestions).filter(([id]) => id !== me.id).map(([, t]) => t);
        if (!theirs.length && chance(rng, 0.5)) return { wait: true };
        return cmd('m.reckon', { target: theirs.length ? pick(rng, theirs) : pick(rng, a.targets) });
      }
      return a.mine ? null : cmd('m.suggest', { target: pick(rng, a.targets) });
    }
    default: return null;
  }
}

/** A legal team, preferring players the bot trusts (and itself). */
function botTeam(m, me, known, rng) {
  const M = m.M;
  for (let i = 0; i < 40; i++) {
    try {
      const { team, ward } = randomTeam(m, rng, chance(rng, 0.8));
      const bad = team.filter((id) => known.has(id)).length;
      if (me.alignment === 'DEATH' ? bad === 0 && i < 20 : bad > 0 && i < 30) continue;
      return { team, ward: ward && M.card === 'WARD' ? (me.alignment === 'DEATH' ? team.find((id) => !known.has(id)) ?? ward : ward) : ward };
    } catch { break; }
  }
  return randomTeam(m, rng, false);
}

function nightMove(m, v, rng) {
  const a = v.action;
  if (a.type !== 'night' || a.done) return null;
  const payload = {};
  if (v.me.dream?.id === 'SHARED_NIGHTMARE') {
    const others = m.night.aliveAtOpen.filter((id) => id !== v.me.id);
    if (others.length) payload.nightmare = pick(rng, others);
  }
  if (a.death) {
    // The Death team agrees: copy any teammate's proposal, or the lowest-seated
    // bot picks (a human teammate can still overrule it with their own pick).
    const D = a.death;
    const theirs = D.members.filter((x) => x.id !== v.me.id).map((x) => D.proposals[x.id]).find((p) => p?.length);
    if (theirs) { payload.death = theirs; return { cmd: { type: 'night.commit', payload } }; }
    const seat = (id) => m.players.find((p) => p.id === id);
    const lead = D.members.filter((x) => seat(x.id)?.bot).sort((x, y) => seat(x.id).seat - seat(y.id).seat)[0];
    if (!lead) return null;
    if (lead.id !== v.me.id) return { wait: true };
    payload.death = D.targets?.length ? [pick(rng, D.targets)] : [];
    return { cmd: { type: 'night.commit', payload } };
  }
  const s = a.schema;
  if (!s || s.blocked || s.kind === 'chat' || chance(rng, 0.2)) { payload.pass = true; return { cmd: { type: 'night.commit', payload } }; }
  if (s.kind === 'choice') {
    payload.uses = [{ option: pick(rng, s.options).id }];
    return { cmd: { type: 'night.commit', payload } };
  }
  const pool = [...(s.targets || [])];
  if (!pool.length) { payload.pass = true; return { cmd: { type: 'night.commit', payload } }; }
  const uses = [];
  for (let i = 0; i < (s.uses || 1) && pool.length; i++) {
    const tgt = pool.splice(rng.int(pool.length), 1)[0];
    uses.push({ target: tgt, option: s.options ? pick(rng, s.options).id : undefined });
  }
  payload.uses = uses;
  return { cmd: { type: 'night.commit', payload } };
}
