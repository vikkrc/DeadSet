// Pass 0 / Pass A server contracts: retries, pause, restart, host rescue, failed starts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { RoomManager } from '../server/rooms.js';

function setup({ dataFile = null, n = 4, mode = 'omen' } = {}) {
  let now = 1_000_000;
  const rm = new RoomManager({ dataFile, clock: () => now, botDelay: [1e9, 1] });
  clearInterval(rm.sweeper);
  const host = rm.createRoom({ name: 'Ada' });
  const guests = [];
  for (let i = 1; i < n; i++) guests.push(rm.joinRoom(host.code, { name: `G${i}` }));
  const all = [host, ...guests];
  let k = 0;
  const cmd = (who, type, payload = {}, key = `k${k++}`) => rm.command(host.code, who.token, { type, payload, key, phaseId: rm.rooms.get(host.code).match.phaseId });
  if (mode) cmd(host, 'host.settings', { mode });
  for (const g of all) cmd(g, 'lobby.ready', { ready: true });
  return { rm, host, guests, all, cmd, room: () => rm.rooms.get(host.code), tick: (ms) => { now += ms; }, now: () => now };
}

test('DS-006: a failed keyed command fails again on retry; it is never a successful duplicate', () => {
  const t = setup();
  assert.throws(() => t.cmd(t.host, 'host.rename', { playerId: 'nobody', name: 'X' }, 'same'));
  assert.throws(() => t.cmd(t.host, 'host.rename', { playerId: 'nobody', name: 'X' }, 'same'));
  // and a success applies once
  t.cmd(t.host, 'host.start', {}, 'go');
  const phase = t.room().match.phaseId;
  assert.deepEqual(t.cmd(t.host, 'host.start', {}, 'go'), { ok: true, duplicate: true });
  assert.equal(t.room().match.phaseId, phase);
});

test('DS-005: a paused table cannot resolve itself, even when every ballot is in', () => {
  const t = setup();
  t.cmd(t.host, 'host.start');
  const m = t.room().match;
  for (let i = 0; i < 10 && m.phase !== 'O_SECRET'; i++) t.cmd(t.host, 'host.advance');
  assert.equal(m.phase, 'O_SECRET');
  t.cmd(t.host, 'host.pause');
  const phase = m.phaseId;
  for (const g of t.all) assert.throws(() => t.cmd(g, 'o.ballot', { predict: 0, turn: 0 }), /paused/);
  assert.throws(() => t.cmd(t.host, 'host.advance'), /paused/);
  assert.equal(m.phaseId, phase);
  assert.ok(t.room().paused);
  t.cmd(t.host, 'host.pause');
  assert.equal(t.room().paused, null);
  assert.ok(m.deadline > t.now());
});

test('DS-037, DS-038, DS-039: a restart keeps the pause, the ledger and the receipts', () => {
  const file = join(mkdtempSync(join(tmpdir(), 'ds-')), 'rooms.json');
  const t = setup({ dataFile: file });
  t.cmd(t.host, 'host.start');
  const m = t.room().match;
  for (let i = 0; i < 10 && m.phase !== 'O_SECRET'; i++) t.cmd(t.host, 'host.advance');
  t.cmd(t.host, 'host.extend', { seconds: 30 }, 'ext');
  const deadline = m.deadline;
  t.room().evening = { games: [{ mode: 'omen', winner: 'OMEN', winners: ['Ada'] }, { mode: 'omen', winner: 'OMEN', winners: ['G1'] }], rows: { a: { name: 'Ada', pts: 2, games: 2, wins: 1 } } };
  t.rm.save();
  const back = new RoomManager({ dataFile: file, clock: t.now });
  clearInterval(back.sweeper);
  const r2 = back.rooms.get(t.host.code);
  assert.equal(r2.evening.games.length, 2);
  // the same keyed extension after the restart is a duplicate, not another 30 seconds
  back.command(t.host.code, t.host.token, { type: 'host.extend', payload: { seconds: 30 }, key: 'ext', phaseId: r2.match.phaseId });
  assert.equal(r2.match.deadline, deadline);
  back.command(t.host.code, t.host.token, { type: 'host.pause', payload: {}, key: 'p1' });
  back.save();
  const again = new RoomManager({ dataFile: file, clock: t.now });
  clearInterval(again.sweeper);
  const r3 = again.rooms.get(t.host.code);
  assert.ok(r3.paused && r3.paused.left > 0, 'still paused, with the time that was left');
  assert.equal(r3.match.deadline, null);
});

test('DS-045: a failed Start anyway changes nobody\'s readiness', () => {
  const t = setup({ n: 3, mode: null });
  t.cmd(t.guests[0], 'lobby.ready', { ready: false });
  assert.throws(() => t.cmd(t.host, 'host.start', { anyway: true }));
  assert.equal(t.room().match.players.find((p) => p.name === 'G1').ready, false);
});

test('DS-041: a host who comes back voids the old takeover votes', () => {
  const t = setup({ n: 5 });
  const room = t.room();
  const fake = () => { const h = { on: (ev, fn) => { if (ev === 'close') h.close = fn; }, write() {}, end() { h.ended = true; } }; return h; };
  const streams = t.all.map((s) => { const r = fake(); t.rm.attach(t.host.code, s.token, r); return r; });
  streams[0].close(); // host leaves
  t.tick(61_000);
  t.cmd(t.guests[0], 'host.claim');
  assert.equal(room.transferVotes.size, 1);
  t.rm.attach(t.host.code, t.host.token, fake()); // host returns
  assert.equal(room.transferVotes.size, 0);
  clearTimeout(room.hostTimer);
});
