// Real HTTP/SSE regressions against a child server process (DS-035, DS-042). Mock responses cannot catch
// a write after end: only a real socket throws it.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = 3900 + Math.floor(Math.random() * 90);
const BASE = `http://127.0.0.1:${PORT}`;
let child; let exited = null;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let ip = 1;
const api = async (path, body) => {
  const r = await fetch(BASE + path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.77.0.${ip++ % 250}` }, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, body: await r.json().catch(() => null) };
};
const cmd = (code, t, type, payload = {}) => api(`/api/rooms/${code}/cmd`, { t, type, payload, key: Math.random().toString(36) });
/** Open an SSE stream; resolves once the first state arrives. */
function stream(code, token) {
  return new Promise((resolve, reject) => {
    const s = { events: [], ended: false };
    const req = http.get(`${BASE}/api/rooms/${code}/events?t=${encodeURIComponent(token)}`, (res) => {
      res.setEncoding('utf8');
      res.on('data', (d) => { s.events.push(d); if (d.includes('event: state')) resolve(s); });
      res.on('end', () => { s.ended = true; });
      res.on('error', () => { s.ended = true; });
    });
    req.on('error', reject);
    s.req = req;
  });
}

before(async () => {
  child = spawn(process.execPath, ['server/index.js'], { env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', DEADSET_DATA: '', DEADSET_INTERLUDES: '0' }, stdio: 'ignore' });
  child.on('exit', (c) => { exited = c; });
  for (let i = 0; i < 50; i++) { try { if ((await api('/api/health')).status === 200) return; } catch { /* starting */ } await wait(100); }
  throw new Error('server did not start');
});
after(() => child?.kill());

test('DS-035: kicking a connected player keeps the server up and revokes the stream', async () => {
  const host = (await api('/api/rooms', { name: 'Ada' })).body;
  const guest = (await api(`/api/rooms/${host.code}/join`, { name: 'Bo' })).body;
  const other = (await api('/api/rooms', { name: 'Cy' })).body; // another room, still playing on
  const gs = await stream(host.code, guest.token);
  const os = await stream(other.code, other.token);
  assert.equal((await cmd(host.code, host.token, 'host.kick', { playerId: guest.playerId })).status, 200);
  await wait(300);
  assert.equal(exited, null, 'the process is still running');
  assert.equal((await api('/api/health')).status, 200);
  assert.ok(gs.events.join('').includes('"reason":"kicked"'));
  assert.equal((await cmd(host.code, guest.token, 'lobby.ready', { ready: true })).status >= 400, true, 'old token rejected');
  assert.equal(os.ended, false, 'the other room keeps its stream');
  os.req.destroy();
});

test('DS-035, DS-042: recovering a connected seat keeps the server up; a kicked seat\'s code dies with it', async () => {
  const host = (await api('/api/rooms', { name: 'Ada' })).body;
  const guest = (await api(`/api/rooms/${host.code}/join`, { name: 'Bo' })).body;
  const a = await stream(host.code, guest.token);
  const b = await stream(host.code, guest.token); // two open streams for the same seat
  await cmd(host.code, host.token, 'host.recovery', { playerId: guest.playerId });
  const peek = (await api(`/api/rooms/${host.code}/events?t=x`)); void peek;
  const view = await new Promise((resolve) => {
    http.get(`${BASE}/api/rooms/${host.code}/events?t=${encodeURIComponent(host.token)}`, (res) => {
      let buf = ''; res.setEncoding('utf8');
      res.on('data', (d) => { buf += d; const m = buf.match(/event: state\ndata: (.*)\n/); if (m) { res.destroy(); resolve(JSON.parse(m[1])); } });
    });
  });
  const code = view.host.recovery.code;
  const rec = await api(`/api/rooms/${host.code}/recover`, { recoveryCode: code });
  assert.equal(rec.status, 200);
  await wait(300);
  assert.equal(exited, null);
  assert.equal((await api('/api/health')).status, 200);
  assert.ok(a.events.join('').includes('revoked') && b.events.join('').includes('revoked'));
  // DS-042: issue a code, remove the seat, try the code.
  await cmd(host.code, host.token, 'host.recovery', { playerId: guest.playerId });
  const v2 = await new Promise((resolve) => {
    http.get(`${BASE}/api/rooms/${host.code}/events?t=${encodeURIComponent(host.token)}`, (res) => {
      let buf = ''; res.setEncoding('utf8');
      res.on('data', (d) => { buf += d; const m = buf.match(/event: state\ndata: (.*)\n/); if (m) { res.destroy(); resolve(JSON.parse(m[1])); } });
    });
  });
  await cmd(host.code, host.token, 'host.kick', { playerId: guest.playerId });
  assert.equal((await api(`/api/rooms/${host.code}/recover`, { recoveryCode: v2.host.recovery.code })).status >= 400, true);
});
