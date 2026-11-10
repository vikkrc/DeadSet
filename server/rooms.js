// Room manager: identity, sessions, command routing, timers, persistence and
// per-audience broadcasting. The rules engine never sees tokens or sockets.
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  newMatch, addPlayer, removePlayer, moveSeat, updateSettings, startMatch, playerCommand,
  hostAdvance, onDeadline, extendDeadline, abortMatch, rematch, normaliseName, GameError,
} from '../engine/game.js';
import { playerView, publicView, moderatorView } from '../engine/views.js';
import { secureRng } from '../engine/rng.js';
import { ROLES, PRESETS, LANGS, modeOf, roleInMode } from '../engine/content.js';
import { byId, pub } from '../engine/state.js';
import { botDecide, botAvatar, BOT_NAMES } from './bots.js';
import { interludeMs, OPEN_DURING_SCENES } from '../public/interludes.js';
import { redrawExorcism } from '../engine/exorcism.js';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const HOST_GRACE_MS = 60_000;
const ROOM_TTL_MS = 12 * 60 * 60 * 1000;
// Phases that only exist to show a scene: they end shortly after it does.
const SHOWCASE = new Set(['M_LOTTERY', 'M_RESULT', 'X_LOTTERY']);

const sha = (s) => createHash('sha256').update(s).digest('hex');
const newToken = () => randomBytes(32).toString('base64url');
const newId = () => randomBytes(9).toString('base64url');

export class RoomManager {
  constructor({ dataFile = null, rng = secureRng(), clock = () => Date.now(), botDelay = [700, 1800], interludes = false } = {}) {
    this.botDelay = botDelay;
    // Shared interludes (one synced scene sequence; inputs locked meanwhile). Off by default so engine-level tests stay instant.
    this.interludes = interludes;
    this.rooms = new Map();
    this.dataFile = dataFile;
    this.rng = rng;
    this.clock = clock;
    this.saveTimer = null;
    if (dataFile) this.load();
    this.sweeper = setInterval(() => this.sweep(), 10 * 60 * 1000);
    this.sweeper.unref?.();
  }

  // ── Identity ─────────────────────────────────────────────────────────────
  newCode() {
    for (;;) {
      let c = '';
      for (let i = 0; i < 6; i++) c += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
      if (!this.rooms.has(c)) return c;
    }
  }

  room(code) {
    const r = this.rooms.get(String(code || '').toUpperCase());
    if (!r) throw new GameError('No room with that code.', 'NOT_FOUND');
    return r;
  }

  issueSession(room, pid) {
    const token = newToken();
    // Rotating a session revokes any previous device for that player.
    for (const [h, id] of room.sessions) if (id === pid) room.sessions.delete(h);
    room.sessions.set(sha(token), pid);
    for (const c of room.clients) if (c.pid === pid) { c.res.write('event: revoked\ndata: {}\n\n'); c.res.end(); }
    return token;
  }

  auth(room, token) {
    const pid = token ? room.sessions.get(sha(String(token))) : null;
    if (!pid) throw new GameError('Your session is not valid for this room.', 'AUTH');
    return pid;
  }

  createRoom({ name, moderated = false, lang = 'en', avatar = null }) {
    const code = this.newCode();
    const hostId = newId();
    const match = newMatch({ id: newId(), code, hostId, moderated });
    const room = { code, match, sessions: new Map(), recovery: new Map(), clients: new Set(), timer: null, touched: this.clock(), hostSeen: this.clock(), transferVotes: new Set() };
    if (LANGS.includes(lang)) match.settings.lang = lang;
    if (!moderated) addPlayer(match, { id: hostId, name, avatar });
    else room.moderatorName = normaliseName(name) || 'Moderator';
    if (!moderated && match.players[0]) match.players[0].ready = true;
    this.rooms.set(code, room);
    const token = this.issueSession(room, hostId);
    this.changed(room);
    return { code, token, playerId: hostId };
  }

  joinRoom(code, { name, avatar = null }) {
    const room = this.room(code);
    const pid = newId();
    addPlayer(room.match, { id: pid, name, avatar });
    const token = this.issueSession(room, pid);
    this.changed(room);
    return { code: room.code, token, playerId: pid };
  }

  recover(code, recoveryCode) {
    const room = this.room(code);
    const key = String(recoveryCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const entry = room.recovery.get(key);
    if (!entry || entry.expires < this.clock()) throw new GameError('That recovery code is not valid.', 'AUTH');
    room.recovery.delete(key);
    const token = this.issueSession(room, entry.pid);
    pub(room.match, `${byId(room.match, entry.pid)?.name ?? 'A player'} reconnected on a new device.`, 'host');
    this.changed(room);
    return { code: room.code, token, playerId: entry.pid };
  }

  // ── Commands ─────────────────────────────────────────────────────────────
  command(code, token, cmd) {
    const room = this.room(code);
    const pid = this.auth(room, token);
    const m = room.match;
    room.touched = this.clock();
    // Idempotency: one recorded command per key.
    room.keys ||= new Map();
    if (cmd.key) {
      if (room.keys.has(cmd.key)) return { ok: true, duplicate: true };
      room.keys.set(cmd.key, this.clock());
      if (room.keys.size > 500) room.keys.delete(room.keys.keys().next().value);
    }
    const type = String(cmd.type || '');
    const payload = cmd.payload && typeof cmd.payload === 'object' ? cmd.payload : {};
    if (!type.startsWith('host.') && !OPEN_DURING_SCENES(type) && this.holding(room)) throw new GameError('Wait for the scene to finish.', 'HOLD');
    if (type.startsWith('host.')) this.hostCommand(room, pid, type, payload, cmd.phaseId);
    else playerCommand(m, pid, { type, payload, phaseId: cmd.phaseId }, this.rng, this.clock());
    this.changed(room);
    return { ok: true };
  }

  hostCommand(room, pid, type, payload, phaseId) {
    const m = room.match;
    const now = this.clock();
    if (type === 'host.claim') return this.claimHost(room, pid);
    if (m.hostId !== pid) throw new GameError('Only the host can do that.', 'AUTH');
    const phaseBound = ['host.advance', 'host.extend'];
    // Shared scenes cannot be skipped: the host waits with everyone else.
    if (type === 'host.advance' && this.holding(room)) throw new GameError('Wait for the scene to finish.', 'HOLD');
    if (phaseBound.includes(type) && phaseId && phaseId !== m.phaseId) throw new GameError('The phase already moved on.', 'STALE');
    switch (type) {
      case 'host.settings': updateSettings(m, payload); break;
      case 'host.start': startMatch(m, this.rng, now); break;
      case 'host.advance': hostAdvance(m, this.rng, now, { skipAll: !!payload.skipAll }); break;
      case 'host.extend': extendDeadline(m, Math.max(10, Math.min(300, Number(payload.seconds) || 30)), now); break;
      case 'host.end': abortMatch(m, now); break;
      case 'host.xredraw': if (!m.X) throw new GameError('Nothing to redraw.'); redrawExorcism(m, this.rng, now); break;
      case 'host.rematch': { const x = m.config?.mode === 'exorcism'; rematch(m, { ready: x }); m.players.forEach((p) => { p.ready = x || p.bot || p.id === m.hostId; p.connected = this.isConnected(room, p.id); }); break; }
      case 'host.kick': {
        if (payload.playerId === pid) throw new GameError('You cannot remove yourself.');
        removePlayer(m, payload.playerId);
        for (const [h, id] of room.sessions) if (id === payload.playerId) room.sessions.delete(h);
        for (const c of room.clients) if (c.pid === payload.playerId) { c.res.write('event: revoked\ndata: {}\n\n'); c.res.end(); }
        break;
      }
      case 'host.seat': moveSeat(m, payload.playerId, Number(payload.dir)); break;
      // Practice bots (hidden test mode): fill seats with automatic players.
      case 'host.bots': {
        if (m.phase !== 'LOBBY') throw new GameError('Not in the lobby.');
        const want = Math.max(0, Math.min(24, Number(payload.count) || 0));
        const taken = new Set(m.players.map((p) => p.name.toLowerCase()));
        for (let i = 0; i < want && m.players.length < 25; i++) {
          const name = BOT_NAMES.find((n) => !taken.has(n.toLowerCase())) ?? `Bot ${m.players.length + 1}`;
          taken.add(name.toLowerCase());
          const p = addPlayer(m, { id: newId(), name, avatar: botAvatar(this.rng), bot: true });
          p.ready = true;
        }
        break;
      }
      case 'host.botsClear': {
        if (m.phase !== 'LOBBY') throw new GameError('Not in the lobby.');
        for (const p of m.players.filter((x) => x.bot)) removePlayer(m, p.id);
        break;
      }
      case 'host.assign': {
        if (!m.moderated || m.phase !== 'LOBBY') throw new GameError('Manual assignment is only for trusted moderators in the lobby.');
        if (payload.clear) m.manualRoles = {};
        else if (byId(m, payload.playerId)) {
          if (payload.roleId && roleInMode(payload.roleId, modeOf(m.settings.preset))) m.manualRoles[payload.playerId] = payload.roleId;
          else if (payload.roleId) throw new GameError('That role is not part of this game mode.');
          else delete m.manualRoles[payload.playerId];
        }
        m.stateVersion++;
        break;
      }
      case 'host.recovery': {
        const target = byId(m, payload.playerId);
        if (!target) throw new GameError('No such player.');
        let key;
        do { key = Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join(''); } while (room.recovery.has(key));
        for (const [k, e] of room.recovery) if (e.pid === target.id) room.recovery.delete(k);
        room.recovery.set(key, { pid: target.id, expires: now + 15 * 60 * 1000 });
        room.lastRecovery = { forHost: pid, playerId: target.id, code: key, expires: now + 15 * 60 * 1000 };
        break;
      }
      default: throw new GameError('Unknown host command.');
    }
  }

  claimHost(room, pid) {
    const m = room.match;
    if (m.hostId === pid) throw new GameError('You are already the host.');
    if (this.isConnected(room, m.hostId) || this.clock() - room.hostSeen < HOST_GRACE_MS) {
      throw new GameError('The host is still around. Host controls can be claimed after they have been gone for a minute.');
    }
    room.transferVotes.add(pid);
    const connected = m.players.filter((p) => this.isConnected(room, p.id) && p.id !== m.hostId);
    const votes = connected.filter((p) => room.transferVotes.has(p.id));
    if (votes.length * 2 > connected.length) {
      const next = votes.sort((a, b) => a.seat - b.seat)[0];
      m.hostId = next.id;
      room.transferVotes.clear();
      pub(m, `${next.name} now holds the public host controls.`, 'host');
      m.stateVersion++;
    }
  }

  /** True while a TV board in this room is connected and playing the score. */
  boardAudio(room) {
    if (room.match.settings.score === false) return false;
    for (const c of room.clients) if (c.board && c.audio) return true;
    return false;
  }

  setBoardAudio(code, key, on) {
    const room = this.room(code);
    const client = [...room.clients].find((c) => c.board && c.key && c.key === String(key || ''));
    if (!client) throw new GameError('Unknown board.', 'AUTH');
    client.audio = !!on;
    this.broadcast(room);
    return { ok: true };
  }

  /** Public, pre-join preview of a room (used by the invitation screen). */
  peek(code) {
    const r = this.rooms.get(String(code || '').toUpperCase());
    if (!r) return { exists: false };
    const m = r.match;
    const host = m.moderated ? r.moderatorName : m.players.find((p) => p.id === m.hostId)?.name;
    const preset = PRESETS[m.settings.preset];
    const rules = m.phase === 'LOBBY' ? (m.settings.rules.mode === 'random' ? m.settings.rules.count : m.settings.rules.selected.length) : m.activeRules.length;
    return { exists: true, phase: m.phase, players: m.players.length, host: host ?? null, seated: m.players.length, max: preset.max, preset: preset.id, rules, moderated: !!m.moderated, lang: m.settings.lang || 'en' };
  }

  // ── Streams ──────────────────────────────────────────────────────────────
  isConnected(room, pid) {
    for (const c of room.clients) if (c.pid === pid) return true;
    return false;
  }

  attach(code, token, res, { board = false } = {}) {
    const room = this.room(code);
    const pid = board ? null : this.auth(room, token);
    const client = { res, pid, board, last: '', key: board ? newToken() : null, audio: false };
    room.clients.add(client);
    if (board) res.write(`event: board\ndata: ${JSON.stringify({ key: client.key })}\n\n`);
    if (pid && pid === room.match.hostId) room.hostSeen = this.clock();
    this.syncPresence(room);
    this.send(room, client, true);
    const ping = setInterval(() => res.write(': ping\n\n'), 25_000);
    ping.unref?.();
    res.on('close', () => {
      clearInterval(ping);
      room.clients.delete(client);
      if (pid && pid === room.match.hostId) room.hostSeen = this.clock();
      this.syncPresence(room);
      this.broadcast(room);
    });
    this.broadcast(room);
  }

  syncPresence(room) {
    for (const p of room.match.players) p.connected = p.bot || this.isConnected(room, p.id);
  }

  viewFor(room, client) {
    const m = room.match;
    const now = this.clock();
    if (client.board) return { ...publicView(m, now), boardAudio: this.boardAudio(room) };
    if (m.moderated && client.pid === m.moderatorId) {
      const v = moderatorView(m, now);
      v.moderatorName = room.moderatorName;
      if (m.hostId !== m.moderatorId) v.host = undefined;
      return this.decorate(room, client, v);
    }
    return this.decorate(room, client, playerView(m, client.pid, now));
  }

  decorate(room, client, v) {
    const m = room.match;
    v.boardAudio = this.boardAudio(room);
    v.moderatorName = m.moderated ? room.moderatorName : null;
    if (v.host && room.lastRecovery?.forHost === client.pid && room.lastRecovery.expires > this.clock()) {
      v.host.recovery = { playerId: room.lastRecovery.playerId, code: room.lastRecovery.code };
    }
    if (v.me && !v.me.isHost && m.hostId !== client.pid) {
      v.hostAway = !this.isConnected(room, m.hostId) && this.clock() - room.hostSeen >= HOST_GRACE_MS;
      v.claimVoted = room.transferVotes.has(client.pid);
    }
    return v;
  }

  send(room, client, force = false) {
    const json = JSON.stringify(this.viewFor(room, client));
    const strip = json.replace(/"serverNow":\d+,/, '');
    if (!force && strip === client.last) return;
    client.last = strip;
    client.res.write(`event: state\ndata: ${json}\n\n`);
  }

  broadcast(room) {
    for (const c of room.clients) {
      try { this.send(room, c); } catch { /* client gone */ }
    }
  }

  /** Is a shared scene still playing? */
  holding(room) {
    return !!room.match.holdUntil && room.match.holdUntil > this.clock();
  }

  /**
   * Stamp new public events with their shared scene window and hold the table
   * until the sequence ends: the new phase's timer starts afterwards, and a
   * timer already running pauses for scenes that open mid-phase.
   */
  stampScenes(room) {
    const m = room.match;
    const log = m.publicLog;
    const now = this.clock();
    if ((room.stampedTo ?? -1) >= log.length) room.stampedTo = -1; // a rematch reset the record
    const from = room.stampedTo ?? log.length - 1;
    const batch = log.slice(from + 1);
    room.stampedTo = log.length - 1;
    const phaseMoved = room.lastPhaseId !== undefined && room.lastPhaseId !== m.phaseId;
    room.lastPhaseId = m.phaseId;
    if (!this.interludes || !batch.length) return;
    const before = Math.max(now, m.holdUntil ?? 0);
    let cursor = before;
    const ctx = { rules: m.activeRules?.length ?? 0 };
    for (const l of batch) {
      const ms = interludeMs(l, batch, ctx);
      if (!ms) continue;
      l.mAt = cursor; l.mDur = ms;
      cursor += ms;
    }
    if (cursor === before) return;
    m.holdUntil = cursor;
    if (!m.deadline) return;
    if (SHOWCASE.has(m.phase)) m.deadline = Math.max(m.deadline, cursor + 1500);
    else m.deadline += phaseMoved ? cursor - now : cursor - before;
  }

  changed(room) {
    this.stampScenes(room);
    this.syncPresence(room);
    this.arm(room);
    this.broadcast(room);
    this.scheduleSave();
    this.wakeBots(room);
  }

  /** Each bot takes its turn a moment after anything changes. */
  wakeBots(room) {
    const m = room.match;
    for (const p of m.players) {
      if (!p.bot || room.botTimers?.has(p.id)) continue;
      (room.botTimers ||= new Map()).set(p.id, setTimeout(() => {
        room.botTimers.delete(p.id);
        if (this.rooms.get(room.code) !== room || !m.players.includes(p)) return;
        let move = null;
        try { move = botDecide(m, p.id, this.rng); } catch { move = null; }
        if (!move) return;
        if (move.wait || this.holding(room)) { this.wakeBots(room); return; }
        try {
          playerCommand(m, p.id, { ...move.cmd, phaseId: m.phaseId }, this.rng, this.clock());
          this.changed(room);
        } catch { /* the window moved on; try again next change */ }
      }, Math.max(0, (m.holdUntil ?? 0) - this.clock()) + this.botDelay[0] + this.rng.int(this.botDelay[1])).unref?.() ?? null);
    }
  }

  arm(room) {
    clearTimeout(room.timer);
    const d = room.match.deadline;
    if (!d) return;
    room.timer = setTimeout(() => {
      try {
        if (onDeadline(room.match, this.rng, this.clock())) this.changed(room);
        else this.arm(room);
      } catch (e) { console.error('deadline error', e); }
    }, Math.max(0, d - this.clock()) + 50);
    room.timer.unref?.();
  }

  // ── Persistence ──────────────────────────────────────────────────────────
  scheduleSave() {
    if (!this.dataFile) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.save(), 400);
  }

  save() {
    if (!this.dataFile) return;
    const data = [...this.rooms.values()].map((r) => ({
      code: r.code, match: r.match, sessions: [...r.sessions], recovery: [...r.recovery],
      touched: r.touched, moderatorName: r.moderatorName ?? null,
    }));
    mkdirSync(dirname(this.dataFile), { recursive: true });
    const tmp = `${this.dataFile}.tmp`;
    writeFileSync(tmp, JSON.stringify(data));
    renameSync(tmp, this.dataFile);
  }

  load() {
    if (!existsSync(this.dataFile)) return;
    try {
      const data = JSON.parse(readFileSync(this.dataFile, 'utf8'));
      for (const r of data) {
        const room = { code: r.code, match: r.match, sessions: new Map(r.sessions), recovery: new Map(r.recovery), clients: new Set(), timer: null, touched: r.touched, hostSeen: this.clock(), transferVotes: new Set(), moderatorName: r.moderatorName };
        for (const p of room.match.players) p.connected = false;
        room.stampedTo = room.match.publicLog.length - 1;
        room.lastPhaseId = room.match.phaseId;
        this.rooms.set(r.code, room);
        this.arm(room);
      }
      console.log(`Restored ${this.rooms.size} room(s).`);
    } catch (e) {
      console.error('Could not restore rooms:', e.message);
    }
  }

  sweep() {
    const now = this.clock();
    for (const [code, r] of this.rooms) {
      if (r.clients.size === 0 && now - r.touched > ROOM_TTL_MS) { clearTimeout(r.timer); this.rooms.delete(code); }
    }
    this.scheduleSave();
  }
}
