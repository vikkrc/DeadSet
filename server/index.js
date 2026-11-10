// Dead Set HTTP server — zero dependencies.
//   Commands:  POST /api/...           (JSON)
//   Live view: GET  /api/rooms/:code/events?t=<token>   (Server-Sent Events,
//              one audience-filtered snapshot per change)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RoomManager } from './rooms.js';
import { ROLES, DREAMS, RULE_CARDS, PRESETS, SCENARIO, RETIRED_RULES, PRODUCTS, LANGS, MISSION_CARDS, MISSION_SIZES, MISSION_DEATH, MISSION_STORY } from '../engine/content.js';
import { scaling } from '../engine/setup.js';
import { SIDE_MISSIONS } from '../engine/sidemissions.js';
import { GameError } from '../engine/state.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(ROOT, '..', 'public');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DATA = process.env.DEADSET_DATA ?? join(ROOT, '..', 'data', 'rooms.json');

const rooms = new RoomManager({ dataFile: DATA || null, interludes: process.env.DEADSET_INTERLUDES !== '0' });

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

// Simple per-IP rate limiting for room discovery / identity endpoints.
const buckets = new Map();
function limited(req, cost = 1, perMinute = 30) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const now = Date.now();
  const b = buckets.get(ip) || { tokens: perMinute, at: now };
  b.tokens = Math.min(perMinute, b.tokens + ((now - b.at) / 60000) * perMinute);
  b.at = now;
  b.tokens -= cost;
  buckets.set(ip, b);
  if (buckets.size > 5000) buckets.clear();
  return b.tokens < 0;
}

const content = {
  roles: Object.values(ROLES), dreams: Object.values(DREAMS), rules: Object.values(RULE_CARDS),
  presets: Object.values(PRESETS), scenario: SCENARIO, retired: RETIRED_RULES, products: PRODUCTS, langs: LANGS,
  missionCards: Object.values(MISSION_CARDS), missionSizes: MISSION_SIZES, missionDeath: MISSION_DEATH, missionStory: MISSION_STORY,
  sideMissions: Object.entries(SIDE_MISSIONS).map(([id, o]) => ({ id, kind: o.kind, text: o.text })),
  scaling: Object.fromEntries([5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => [n, scaling(n)])),
};

function json(res, status, body) {
  const s = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(s);
}

async function body(req) {
  let size = 0;
  const chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > 32 * 1024) throw Object.assign(new Error('Payload too large'), { status: 413 });
    chunks.push(c);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }); }
}

function fail(res, e) {
  if (e instanceof GameError) {
    const status = { AUTH: 401, NOT_FOUND: 404, STALE: 409 }[e.code] ?? 400;
    return json(res, status, { error: e.message, code: e.code, msg: e.msg });
  }
  if (e.status) return json(res, e.status, { error: e.message });
  console.error(e);
  return json(res, 500, { error: 'Something went wrong on the server.' });
}

async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean); // ['api', ...]
  if (req.method === 'GET' && parts[1] === 'content') return json(res, 200, content);
  if (req.method === 'GET' && parts[1] === 'health') return json(res, 200, { ok: true, rooms: rooms.rooms.size });

  if (parts[1] === 'rooms' && parts.length === 2 && req.method === 'POST') {
    if (limited(req, 3)) return json(res, 429, { error: 'Too many requests. Wait a moment.' });
    const b = await body(req);
    return json(res, 200, rooms.createRoom({ name: b.name, moderated: !!b.moderated, lang: b.lang, avatar: b.avatar }));
  }
  if (parts[1] !== 'rooms' || !parts[2]) return json(res, 404, { error: 'Not found' });
  const code = parts[2].toUpperCase();
  const action = parts[3];

  if (req.method === 'GET' && action === 'peek') {
    if (limited(req)) return json(res, 429, { error: 'Too many requests.' });
    return json(res, 200, rooms.peek(code));
  }
  if (req.method === 'GET' && action === 'events') {
    const board = url.searchParams.get('board') === '1';
    const token = url.searchParams.get('t');
    const room = rooms.rooms.get(code);
    if (!room) return json(res, 404, { error: 'No room with that code.' });
    if (!board) {
      try { rooms.auth(room, token); } catch (e) { return fail(res, e); }
    }
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store, no-transform',
      connection: 'keep-alive', 'x-accel-buffering': 'no',
    });
    res.write('retry: 2000\n\n');
    rooms.attach(code, token, res, { board });
    return undefined;
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const b = await body(req);
  if (action === 'join') {
    if (limited(req, 2)) return json(res, 429, { error: 'Too many requests. Wait a moment.' });
    return json(res, 200, rooms.joinRoom(code, { name: b.name, avatar: b.avatar }));
  }
  if (action === 'recover') {
    if (limited(req, 5)) return json(res, 429, { error: 'Too many attempts. Wait a minute.' });
    return json(res, 200, rooms.recover(code, b.recoveryCode));
  }
  if (action === 'board') {
    if (limited(req, 0.2)) return json(res, 429, { error: 'Too many requests.' });
    return json(res, 200, rooms.setBoardAudio(code, b.key, b.audio));
  }
  if (action === 'cmd') {
    return json(res, 200, rooms.command(code, b.t, b));
  }
  return json(res, 404, { error: 'Not found' });
}

async function staticFile(req, res, url) {
  let path = decodeURIComponent(url.pathname);
  if (path === '/' || path.startsWith('/r/') || path.startsWith('/board/') || path === '/guide') path = '/index.html';
  const file = normalize(join(PUBLIC, path));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  try {
    const s = await stat(file);
    if (!s.isFile()) throw new Error('not a file');
    const data = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] || 'application/octet-stream',
      'cache-control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=300',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) await api(req, res, url);
    else await staticFile(req, res, url);
  } catch (e) {
    if (!res.headersSent) fail(res, e);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Dead Set is listening on http://localhost:${PORT}`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => { rooms.save(); process.exit(0); });
}
