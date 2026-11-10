// Practice bots: stand-in players for testing a table alone. They see exactly
// what a human in their seat would see (playerView) and act with simple random
// choices. They never chat. The host adds them from a hidden lobby panel.
import { categoryById } from '../engine/words.js';
import { playerView } from '../engine/views.js';
import { AVATAR_PARTS } from '../engine/content.js';
import { randomTeam } from '../engine/missions.js';

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
    default: return m.X ? exorcismMove(m, v, rng) : m.M ? missionMove(m, v, rng) : null;
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
