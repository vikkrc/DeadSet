// Practice bots play whole matches on their own (with the host advancing).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager } from '../server/rooms.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function playOut(settings, bots, seats = 0) {
  const rm = new RoomManager({ botDelay: [1, 3] });
  const host = rm.createRoom({ name: 'Ada' });
  const room = rm.rooms.get(host.code);
  const m = room.match;
  rm.command(host.code, host.token, { type: 'host.settings', payload: settings });
  rm.command(host.code, host.token, { type: 'host.bots', payload: { count: bots } });
  assert.equal(m.players.length, bots + 1 + seats);
  rm.command(host.code, host.token, { type: 'host.start' });
  for (let i = 0; i < 400 && m.phase !== 'ENDED'; i++) {
    await wait(25);
    const v = m.phase;
    if (v === 'NIGHT_0_REVEAL') { try { rm.command(host.code, host.token, { type: 'role.ack', payload: {} }); } catch { /* already */ } }
    if (v === 'NIGHT_ACTIONS' && !m.night.done[host.id ?? m.hostId]) {
      try { rm.command(host.code, host.token, { type: 'night.commit', payload: { pass: true, death: [] } }); } catch { /* not alive */ }
    }
    await wait(25);
    if (m.phase === v && v !== 'NIGHT_0_REVEAL' && v !== 'ENDED') {
      try { rm.command(host.code, host.token, { type: 'host.advance', payload: {}, phaseId: m.phaseId }); } catch { /* moved */ }
    }
  }
  for (const r of rm.rooms.values()) for (const t of r.botTimers?.values() ?? []) clearTimeout(t);
  clearInterval(rm.sweeper);
  return m;
}

test('a table of bots plays a standard match to the end', async () => {
  const m = await playOut({}, 7);
  assert.equal(m.phase, 'ENDED');
  assert.ok(m.winner);
  assert.ok(m.players.filter((p) => p.bot).every((p) => p.avatar));
});

test('bots handle every side at a big custom table', async () => {
  const m = await playOut({ preset: 'custom', lovers: true, cult: true, ripper: true, tieBreak: 'coin', clueOdds: 3 }, 17);
  assert.equal(m.phase, 'ENDED');
  assert.ok(['DEATH', 'NON_DEATH', 'CULT', 'RIPPER', 'LOVERS', 'DRAW', 'JESTER'].includes(m.winner), m.winner);
});
