import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager } from '../server/rooms.js';
import { seededRng } from '../engine/rng.js';

function fakeRes() {
  const res = { chunks: [], ended: false, handlers: {} };
  res.write = (s) => { res.chunks.push(s); return true; };
  res.end = () => { res.ended = true; };
  res.on = (ev, fn) => { res.handlers[ev] = fn; };
  res.last = () => {
    const states = res.chunks.filter((c) => c.startsWith('event: state'));
    return JSON.parse(states.at(-1).split('data: ')[1]);
  };
  return res;
}

function table(n = 5) {
  const rm = new RoomManager({ rng: seededRng(11) });
  const host = rm.createRoom({ name: 'Ada' });
  const seats = [host];
  for (let i = 1; i < n; i++) seats.push(rm.joinRoom(host.code, { name: `P${i}` }));
  for (const s of seats.slice(1)) rm.command(host.code, s.token, { type: 'lobby.ready', payload: { ready: true } });
  return { rm, code: host.code, seats };
}

test('T26 recovery code rotates the token; old device loses control', () => {
  const { rm, code, seats } = table();
  const old = seats[2];
  const res = fakeRes();
  rm.attach(code, old.token, res);
  rm.command(code, seats[0].token, { type: 'host.recovery', payload: { playerId: old.playerId } });
  const recCode = rm.rooms.get(code).lastRecovery.code;
  const fresh = rm.recover(code, recCode);
  assert.equal(fresh.playerId, old.playerId);
  assert.ok(res.ended, 'old stream revoked');
  assert.throws(() => rm.command(code, old.token, { type: 'lobby.ready', payload: { ready: false } }), /not valid/);
  assert.throws(() => rm.recover(code, recCode), /not valid/, 'one-time code');
  rm.command(code, fresh.token, { type: 'lobby.ready', payload: { ready: false } });
});

test('only the host may use host commands; idempotency keys apply once', () => {
  const { rm, code, seats } = table();
  assert.throws(() => rm.command(code, seats[1].token, { type: 'host.start' }), /Only the host/);
  rm.command(code, seats[0].token, { type: 'host.start', key: 'k1' });
  const r = rm.command(code, seats[0].token, { type: 'host.start', key: 'k1' });
  assert.equal(r.duplicate, true);
  assert.equal(rm.rooms.get(code).match.phase, 'NIGHT_0_REVEAL');
});

test('T27 network payloads never carry another player\'s role', () => {
  const { rm, code, seats } = table(7);
  rm.command(code, seats[0].token, { type: 'host.start' });
  const m = rm.rooms.get(code).match;
  for (const s of seats) {
    const res = fakeRes();
    rm.attach(code, s.token, res);
    const v = res.last();
    const me = m.players.find((p) => p.id === s.playerId);
    assert.equal(v.me.role.id, me.roleId);
    for (const p of v.players) assert.equal(p.role, null, 'no roles on the public roster');
    const raw = res.chunks.join('');
    for (const other of m.players.filter((p) => p.id !== me.id && p.alignment !== 'DEATH')) {
      assert.ok(!raw.includes(`"seat":${other.seat},"alive":true,"connected":true,"ready":undefined,"role"`));
    }
    if (me.alignment !== 'DEATH') assert.equal(v.me.teammates, undefined);
    assert.ok(!raw.includes('roleId'), 'internal roleId never serialised');
  }
  const board = fakeRes();
  rm.attach(code, null, board, { board: true });
  assert.ok(!board.chunks.join('').includes('"me"'));
});

test('T28 offline phone: committed action persists, missing input passes at deadline', () => {
  let now = 0;
  const rm = new RoomManager({ rng: seededRng(5), clock: () => now });
  const host = rm.createRoom({ name: 'Ada' });
  const seats = [host];
  for (let i = 1; i < 5; i++) seats.push(rm.joinRoom(host.code, { name: `P${i}` }));
  for (const s of seats.slice(1)) rm.command(host.code, s.token, { type: 'lobby.ready', payload: { ready: true } });
  rm.command(host.code, host.token, { type: 'host.settings', payload: { timers: { night: 30, swap: 10 } } });
  rm.command(host.code, host.token, { type: 'host.start' });
  const m = rm.rooms.get(host.code).match;
  for (const s of seats) rm.command(host.code, s.token, { type: 'role.ack', phaseId: m.phaseId });
  rm.command(host.code, host.token, { type: 'host.advance', phaseId: m.phaseId });
  rm.command(host.code, host.token, { type: 'host.advance', phaseId: m.phaseId }); // no nominations → night
  assert.equal(m.phase, 'NIGHT_DREAM_SWAP');
  now += 11_000;
  // Drive the deadline directly rather than waiting on real timers.
  return import('../engine/game.js').then(({ onDeadline: od }) => {
    assert.ok(od(m, rm.rng, now));
    assert.equal(m.phase, 'NIGHT_ACTIONS');
    now += 31_000;
    assert.ok(od(m, rm.rng, now));
    assert.equal(m.phase, 'DAY_PREP', 'night resolved with everyone passing');
    assert.equal(m.dayNumber, 2);
  });
});

test('peek previews a room for the invitation without secrets', () => {
  const { rm, code } = table(6);
  const p = rm.peek(code);
  assert.equal(p.exists, true);
  assert.equal(p.host, 'Ada');
  assert.equal(p.seated, 6);
  assert.equal(p.phase, 'LOBBY');
  assert.equal(p.preset, 'Standard');
  assert.equal(rm.peek('ZZZZZZ').exists, false);
  assert.ok(!JSON.stringify(p).includes('token'));
});

test('a connected, unmuted TV board silences public sounds on phones', () => {
  const { rm, code, seats } = table();
  const phone = fakeRes();
  rm.attach(code, seats[1].token, phone);
  assert.equal(phone.last().boardAudio, false);
  const tv = fakeRes();
  rm.attach(code, null, tv, { board: true });
  const key = JSON.parse(tv.chunks.find((c) => c.startsWith('event: board')).split('data: ')[1]).key;
  assert.throws(() => rm.setBoardAudio(code, 'nope', true), /Unknown board/);
  rm.setBoardAudio(code, key, true);
  assert.equal(phone.last().boardAudio, true);
  rm.command(code, seats[0].token, { type: 'host.settings', payload: { score: false } });
  assert.equal(phone.last().boardAudio, false, 'host disabled the score');
  rm.command(code, seats[0].token, { type: 'host.settings', payload: { score: true } });
  tv.handlers.close();
  assert.equal(phone.last().boardAudio, false, 'board left');
  assert.equal(phone.last().table.threads, false, 'threads default off');
});
