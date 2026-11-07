import {
  newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings,
} from '../engine/game.js';
import { seededRng } from '../engine/rng.js';

export const NAMES = 'Ada Bo Cy Di Ed Fay Gus Hal Ivy Jo Kit Lu Mo Ned Oz Pip Quin Rae'.split(' ');

/**
 * Build a started match with exact roles (in seat order), rules and options.
 * Returns helpers bound to that match.
 */
export function setup(roles, { rules = [], settings = {}, script = {}, seed = 7, dreams = false, skipAck = false } = {}) {
  const rng = seededRng(seed, script);
  const m = newMatch({ id: 'm1', code: 'TEST01', hostId: 'p0' });
  roles.forEach((_, i) => addPlayer(m, { id: `p${i}`, name: NAMES[i] }));
  updateSettings(m, { preset: 'custom', dreams, rules: { mode: 'manual', selected: rules }, ...settings });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now, { forceRoles: roles });
  const P = (name) => m.players.find((p) => p.name === name);
  const id = (name) => P(name).id;
  const cmd = (name, type, payload = {}) => playerCommand(m, id(name), { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = (opts) => hostAdvance(m, rng, (now += 10), opts);
  if (!skipAck) for (const p of m.players) cmd(p.name, 'role.ack');
  return { m, rng, P, id, cmd, advance };
}

/** From DAY_PREP: run the whole day. votes: { voterName: targetName | 'ABSTAIN' }. */
export function runDay(t, { nominate = [], votes = {} } = {}) {
  const { m, cmd, advance, id } = t;
  if (m.phase === 'DAY_PREP') advance();
  for (const [by, target] of nominate) cmd(by, 'day.nominate', { target: id(target) });
  advance(); // close discussion → defence (or no-vote resolution)
  if (m.phase === 'DAY_DEFENSE') advance({ skipAll: true });
  if (m.phase === 'DAY_VOTING') {
    for (const [voter, target] of Object.entries(votes)) cmd(voter, 'day.ballot', { target: target === 'ABSTAIN' ? 'ABSTAIN' : id(target) });
    advance();
  }
}

/** In NIGHT_ACTIONS: everybody listed commits, everyone else passes; then dawn. */
export function runNight(t, { death = null, actions = {}, nightmare = {}, dreams = null } = {}) {
  const { m, cmd, id } = t;
  if (m.phase === 'NIGHT_DREAM_SWAP') {
    if (dreams) for (const [name, d] of Object.entries(dreams)) m.night.dreams[id(name)] = d, (m.night.initialDreams[id(name)] = d);
    for (const pid of m.night.aliveAtOpen) if (!m.night.swapDone[pid]) cmd(m.players.find((p) => p.id === pid).name, 'dream.swap', {});
  }
  if (m.phase !== 'NIGHT_ACTIONS') throw new Error(`expected NIGHT_ACTIONS, got ${m.phase}`);
  const team = m.night.death?.members ?? [];
  for (const pid of [...m.night.aliveAtOpen]) {
    if (m.phase !== 'NIGHT_ACTIONS') break;
    const p = m.players.find((x) => x.id === pid);
    const payload = {};
    if (team.includes(pid)) payload.death = (death?.[p.name] ?? death?.all ?? []).map(id);
    else if (actions[p.name]) payload.uses = actions[p.name].map((u) => ({ target: u.target ? id(u.target) : undefined, option: u.option }));
    else payload.pass = true;
    if (nightmare[p.name]) payload.nightmare = id(nightmare[p.name]);
    cmd(p.name, 'night.commit', payload);
  }
}
