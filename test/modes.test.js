// Beta 0: each mode's setup offers and accepts only its own roles, rules and settings.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, updateSettings } from '../engine/game.js';
import { moderatorView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { ROLES, modeOf, roleInMode } from '../engine/content.js';
import { RoomManager } from '../server/rooms.js';
import { NAMES } from './helpers.js';

function lobby(n = 6) {
  const m = newMatch({ id: 'm1', code: 'MODE01', hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  return m;
}
const view = (m) => moderatorView(m);

test('classic setup lists no Missions roles, Missions setup lists only Missions roles', () => {
  const m = lobby();
  const classic = view(m).allRoles.map((r) => r.id);
  assert.ok(classic.length > 5);
  for (const id of classic) assert.ok(roleInMode(id, 'classic'), `${id} leaked into classic`);
  updateSettings(m, { mode: 'missions' });
  assert.equal(view(m).mode, 'missions');
  const mission = view(m).allRoles.map((r) => r.id);
  assert.ok(mission.length > 0);
  for (const id of mission) assert.equal(ROLES[id].set, 'missions', `${id} leaked into missions`);
});

test('switching modes remembers each mode\'s last settings', () => {
  const m = lobby();
  updateSettings(m, { preset: 'custom', dreams: false });
  updateSettings(m, { mode: 'missions' });
  assert.equal(modeOf(m.settings.preset), 'missions');
  updateSettings(m, { mode: 'classic' });
  assert.equal(m.settings.preset, 'custom');
  assert.equal(m.settings.dreams, false);
});

test('picking another mode\'s preset switches mode and keeps that preset', () => {
  const m = lobby();
  updateSettings(m, { mode: 'missions' });
  updateSettings(m, { preset: 'full' });
  assert.equal(m.settings.preset, 'full');
  assert.equal(modeOf(m.settings.preset), 'classic');
});

test('a custom classic deck cannot contain Missions roles', () => {
  const m = lobby();
  const mid = Object.values(ROLES).find((r) => r.set === 'missions').id;
  try { updateSettings(m, { preset: 'custom', custom: { [mid]: 1 } }); } catch { /* rejected outright is fine too */ }
  assert.ok(!Object.keys(m.settings.custom ?? {}).includes(mid) || !m.settings.custom[mid]);
});

test('host cannot hand out a role from another mode', () => {
  const rm = new RoomManager({ rng: seededRng(4) });
  const host = rm.createRoom({ name: NAMES[0], moderated: true });
  for (let i = 1; i < 6; i++) rm.joinRoom(host.code, { name: NAMES[i] });
  const m = rm.rooms.get(host.code).match;
  const target = m.players[0].id;
  const mid = 'REAPER';
  assert.throws(() => rm.command(host.code, host.token, { type: 'host.assign', payload: { playerId: target, roleId: mid } }), /not part of this game mode/);
  rm.command(host.code, host.token, { type: 'host.assign', payload: { playerId: target, roleId: 'DEATH' } });
  assert.equal(m.manualRoles[target], 'DEATH');
  // switching mode clears picks
  rm.command(host.code, host.token, { type: 'host.settings', payload: { mode: 'missions' } });
  assert.deepEqual(m.manualRoles, {});
});

test('shared interludes: inputs wait for the scene, and the next timer starts after it', () => {
  let now = 5_000_000;
  const rm = new RoomManager({ rng: seededRng(9), clock: () => now, interludes: true, botDelay: [10_000_000, 1] });
  const host = rm.createRoom({ name: NAMES[0] });
  const seats = [host];
  for (let i = 1; i < 5; i++) seats.push(rm.joinRoom(host.code, { name: NAMES[i] }));
  for (const s of seats.slice(1)) rm.command(host.code, s.token, { type: 'lobby.ready', payload: { ready: true } });
  rm.command(host.code, host.token, { type: 'host.settings', payload: { timers: { morning: 20, discussion: 60 } } });
  rm.command(host.code, host.token, { type: 'host.start' });
  const m = rm.rooms.get(host.code).match;
  const night0 = m.publicLog.find((l) => l.ev === 'night0');
  assert.ok(night0.mAt && night0.mDur > 5000, 'the ceremony is stamped as a shared scene');
  assert.ok(m.holdUntil > now);
  // the role card cannot be acknowledged while the ceremony plays…
  assert.throws(() => rm.command(host.code, seats[1].token, { type: 'role.ack', phaseId: m.phaseId }), /Wait for the scene/);
  // …nor can the host skip it; chat stays open
  assert.throws(() => rm.command(host.code, host.token, { type: 'host.advance', phaseId: m.phaseId }), /Wait for the scene/);
  now = m.holdUntil + 1;
  for (const s of seats) rm.command(host.code, s.token, { type: 'role.ack', phaseId: m.phaseId });
  assert.equal(m.phase, 'DAY_PREP');
  // Day 1 opens with a shared "Morning" scene; the phase timer starts after it.
  const day1 = m.publicLog.find((l) => l.ev === 'day1');
  assert.ok(day1?.mAt);
  assert.equal(m.deadline - now, 20_000 + day1.mDur, 'the morning timer starts after the scene');
  // Discussion opens after the morning: its timer runs from the end of any scene.
  now = m.holdUntil + 1;
  rm.command(host.code, host.token, { type: 'host.advance', phaseId: m.phaseId });
  assert.equal(m.phase, 'DAY_DISCUSSION');
  assert.equal(m.deadline - now, 60_000);
});
