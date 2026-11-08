// Practice bots: stand-in players for testing a table alone. They see exactly
// what a human in their seat would see (playerView) and act with simple random
// choices. They never chat. The host adds them from a hidden lobby panel.
import { playerView } from '../engine/views.js';
import { AVATAR_PARTS } from '../engine/content.js';

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
    default: return null;
  }
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
