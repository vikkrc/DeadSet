// Room manager: identity, sessions, command routing, timers, persistence and
// per-audience broadcasting. The rules engine never sees tokens or sockets.
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  newMatch, addPlayer, removePlayer, moveSeat, updateSettings, startMatch, playerCommand, setupReport,
  hostAdvance, onDeadline, extendDeadline, abortMatch, rematch, normaliseName, GameError, MANUAL_MODES, renamePlayer,
} from '../engine/game.js';
import { playerView, publicView, moderatorView } from '../engine/views.js';
import { mimicBoardHint } from '../engine/mimic.js';
import { secureRng } from '../engine/rng.js';
import { ROLES, PRESETS, LANGS, modeOf, roleInMode } from '../engine/content.js';
import { byId, pub } from '../engine/state.js';
import { botDecide, botAvatar, BOT_NAMES } from './bots.js';
import { interludeMs, OPEN_DURING_SCENES } from '../public/interludes.js';

/** TV-L9: the start ceremony on the TV: 3, 2, 1, then the deal. */
export const COUNTDOWN_MS = 3600;
import { recommend } from '../engine/recommend.js';
import { didIWin } from '../public/outcome.js';
import { awardsFor, calledIt } from '../engine/awards.js';
import { REMATCH_READY } from '../public/modes.js';
import { redrawExorcism } from '../engine/exorcism.js';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const HOST_GRACE_MS = 60_000;
/** DS-005: what still works while the table is paused. Nothing here can move the game on. */
const PAUSE_OK = new Set(['host.pause', 'host.end', 'host.rename', 'host.kick', 'host.recovery', 'host.claim', 'chat.send', 'end.vote']);
const ROOM_TTL_MS = 12 * 60 * 60 * 1000;
// Phases that only exist to show a scene: they end shortly after it does.
const SHOWCASE = new Set(['M_LOTTERY', 'M_RESULT', 'X_LOTTERY']);

const sha = (s) => createHash('sha256').update(s).digest('hex');
/** A response we may still write to (DS-035: never write after end). */
const writable = (res) => !!res && !res.writableEnded && !res.destroyed && res.ended !== true;
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
    this.revokeClients(room, pid);
    return token;
  }

  /**
   * DS-035: the one way a stream ends. The client leaves the room's set and loses its heartbeat before its
   * response is ended, so a broadcast that follows can never write to it. Safe to call twice.
   */
  dropClient(room, client, last = '') {
    if (client.gone) return;
    client.gone = true;
    room.clients.delete(client);
    clearInterval(client.ping);
    try { if (last && writable(client.res)) client.res.write(last); } catch { /* already closed */ }
    try { if (writable(client.res)) client.res.end(); } catch { /* already closed */ }
  }

  revokeClients(room, pid, reason = null) {
    const data = JSON.stringify(reason ? { reason } : {});
    for (const c of [...room.clients]) if (c.pid === pid) this.dropClient(room, c, `event: revoked\ndata: ${data}\n\n`);
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
    // DS-042: a code is only good for a seat that still exists.
    if (!entry || entry.expires < this.clock() || !byId(room.match, entry.pid)) { if (entry) room.recovery.delete(key); throw new GameError('That recovery code is not valid.', 'AUTH'); }
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
    const type = String(cmd.type || '');
    const payload = cmd.payload && typeof cmd.payload === 'object' ? cmd.payload : {};
    // DS-006, DS-039: idempotency. A key is recorded only once its command has succeeded, scoped to the actor,
    // and kept across restarts; a failed request leaves no receipt, so its retry fails (or succeeds) honestly.
    room.keys ||= new Map();
    const receipt = cmd.key ? `${pid}:${String(cmd.key).slice(0, 80)}` : null;
    if (receipt && room.keys.has(receipt)) {
      if (room.keys.get(receipt).type !== type) throw new GameError('That request was already used for something else.', 'DUPLICATE');
      return { ok: true, duplicate: true };
    }
    // DS-005: a paused table takes no moves. Only the host's housekeeping (and resuming) goes through.
    if (room.paused && !PAUSE_OK.has(type)) throw new GameError('The table is paused.', 'PAUSED');
    if (!type.startsWith('host.') && !OPEN_DURING_SCENES(type) && this.holding(room)) throw new GameError('Wait for the scene to finish.', 'HOLD');
    if (room.countdown && (['host.settings', 'host.kick', 'host.bots', 'host.seat'].includes(type) || (type === 'lobby.ready' && payload.ready === false))) {
      this.cancelCountdown(room, type === 'host.settings' ? 'setup' : 'table');
    }
    if (type.startsWith('host.')) this.hostCommand(room, pid, type, payload, cmd.phaseId);
    else if (type === 'end.vote') {
      // F3: after a game every player can say what they want next; the host still decides.
      if (!['again', 'another'].includes(payload.choice)) throw new GameError('Choose Again or Try another.');
      (room.endVotes ||= {})[pid] = payload.choice;
    } else playerCommand(m, pid, { type, payload, phaseId: cmd.phaseId }, this.rng, this.clock());
    if (receipt) {
      room.keys.set(receipt, { type, at: this.clock() });
      while (room.keys.size > 500) room.keys.delete(room.keys.keys().next().value);
    }
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
      case 'host.settings': {
        // S2: the room follows the recommended setup until the host changes a game setting themselves. Table
        // settings (language, music, pace, backdrops) do not count; choosing a game starts from its recommendation.
        const COSMETIC = ['lang', 'score', 'scoreTheme', 'backdrops', 'threads', 'pace', 'transport'];
        if (payload.recommended) { m.recTuned = false; m.recN = null; break; }
        const before = JSON.stringify(m.settings);
        const rulesBefore = [...(m.settings.rules?.selected ?? [])];
        updateSettings(m, payload);
        if (payload.mode) { m.recTuned = false; m.recN = null; } else if (Object.keys(payload).some((k) => !COSMETIC.includes(k))) m.recTuned = true;
        // TV-L12: a change to the game, the deck or the rules lands as a ribbon on the TV, and everyone re-readies,
        // so nobody starts on rules they did not see. Table settings (music, pace, language…) change nothing.
        if (m.phase === 'LOBBY' && JSON.stringify(m.settings) !== before && Object.keys(payload).some((k) => !COSMETIC.includes(k) && k !== 'timers')) {
          for (const p of m.players) if (!p.bot && p.id !== m.hostId) p.ready = false;
          const rulesNow = m.settings.rules?.selected ?? [];
          const added = rulesNow.find((r) => !rulesBefore.includes(r));
          const removed = rulesBefore.find((r) => !rulesNow.includes(r));
          const by = byId(m, pid)?.name ?? '';
          room.lobbyNote = payload.mode ? { kind: 'mode', by, mode: payload.mode, at: now } : added ? { kind: 'rule+', by, rule: added, at: now } : removed ? { kind: 'rule-', by, rule: removed, at: now } : { kind: 'setup', by, at: now };
        }
        break;
      }
      // TV-L11: while the host has the game picker open, the TV follows it.
      case 'host.browse': {
        room.browsing = payload.open && m.phase === 'LOBBY' ? { by: byId(m, pid)?.name ?? '', at: now } : null;
        break;
      }
      // S4: "Start anyway" seats everyone as ready (their phones get the role reveal like everyone else).
      case 'host.start': {
        // TV-L9: with a TV at the table, the start is a ceremony: 3, 2, 1 on the TV (phones say "Look at the TV"),
        // then the deal. The host can cancel until zero (TV-L14). Without a TV the game starts at once.
        if (m.phase !== 'LOBBY') throw new GameError('The match has already started.');
        const report = setupReport(m);
        if (!report.ok) throw new GameError(report.errors[0]);
        if (report.notReady && !payload.anyway) throw new GameError('Everyone must tap Ready first.');
        if (this.interludes && [...room.clients].some((c) => c.board) && !room.countdown) {
          room.countdown = { at: now + COUNTDOWN_MS, anyway: !!payload.anyway, by: byId(m, pid)?.name ?? '' };
          room.countdownOff = null;
          clearTimeout(room.cdTimer);
          room.cdTimer = setTimeout(() => this.finishCountdown(room), COUNTDOWN_MS);
          room.cdTimer.unref?.();
          break;
        }
        if (room.countdown) break; // already counting down
        this.startNow(room, !!payload.anyway);
        room.browsing = null;
        break;
      }
      case 'host.cancelStart': this.cancelCountdown(room, 'host'); break;
      case 'host.advance': hostAdvance(m, this.rng, now, { skipAll: !!payload.skipAll }); break;
      case 'host.extend': extendDeadline(m, Math.max(10, Math.min(300, Number(payload.seconds) || 30)), now); break;
      case 'host.end': abortMatch(m, now); break;
      case 'host.eveningClear': room.evening = { games: [], rows: {} }; break;
      // H: Pause freezes the phase's clock (for doorbells and pizza); Resume gives back exactly what was left.
      case 'host.pause': {
        if (room.paused) {
          if (room.paused.left != null) m.deadline = now + room.paused.left;
          if (room.paused.hold != null) m.holdUntil = now + room.paused.hold; // a scene picks up where it stopped
          room.paused = null;
          pub(m, 'The table resumes.', 'host', { ev: 'resume' });
        } else {
          if (m.phase === 'LOBBY' || m.phase === 'ENDED') throw new GameError('There is nothing to pause.');
          room.paused = { phaseId: m.phaseId, by: byId(m, pid)?.name ?? '', left: m.deadline ? Math.max(1000, m.deadline - now) : null, hold: m.holdUntil > now ? m.holdUntil - now : null };
          m.deadline = null;
          if (room.paused.hold != null) m.holdUntil = Number.MAX_SAFE_INTEGER; // scenes stop too
          pub(m, ['Paused by {a}.', { a: room.paused.by }], 'host', { ev: 'pause' });
        }
        break;
      }
      // Safety: the host can rename a player (a typo, or a name that does not belong at the table).
      case 'host.rename': renamePlayer(m, payload.playerId, payload.name); break;
      case 'host.xredraw': if (!m.X) throw new GameError('Nothing to redraw.'); redrawExorcism(m, this.rng, now); break;
      case 'host.rematch': { const x = REMATCH_READY.includes(m.config?.mode); rematch(m, { ready: x }); m.players.forEach((p) => { p.ready = x || p.bot || p.id === m.hostId; p.connected = this.isConnected(room, p.id); }); break; }
      case 'host.kick': {
        if (payload.playerId === pid) throw new GameError('You cannot remove yourself.');
        removePlayer(m, payload.playerId);
        for (const [h, id] of room.sessions) if (id === payload.playerId) room.sessions.delete(h);
        // DS-042: the seat's recovery codes go with it.
        for (const [k, e] of room.recovery) if (e.pid === payload.playerId) room.recovery.delete(k);
        if (room.lastRecovery?.playerId === payload.playerId) room.lastRecovery = null;
        room.transferVotes?.delete(payload.playerId);
        if (room.endVotes) delete room.endVotes[payload.playerId];
        this.revokeClients(room, payload.playerId, 'kicked');
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
        if (!payload.clear && !MANUAL_MODES.has(modeOf(m.settings.preset))) throw new GameError('This game deals its own cards: clear the manual assignment.');
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
    return { exists: true, phase: m.phase, mode: m.phase === 'LOBBY' || !m.config ? modeOf(m.settings.preset) : m.config.mode ?? (m.config.missions ? 'missions' : 'classic'), players: m.players.length, host: host ?? null, seated: m.players.length, max: preset.max, preset: preset.id, rules, moderated: !!m.moderated, lang: m.settings.lang || 'en' };
  }

  // ── Streams ──────────────────────────────────────────────────────────────
  isConnected(room, pid) {
    for (const c of room.clients) if (c.pid === pid) return true;
    return false;
  }

  attach(code, token, res, { board = false } = {}) {
    const room = this.room(code);
    const pid = board ? null : this.auth(room, token);
    const client = { res, pid, board, last: '', key: board ? newToken() : null, audio: false, gone: false, ping: null };
    room.clients.add(client);
    res.on?.('error', () => this.dropClient(room, client)); // a broken socket never takes the process down
    if (board) res.write(`event: board\ndata: ${JSON.stringify({ key: client.key })}\n\n`);
    if (pid && pid === room.match.hostId) {
      room.hostSeen = this.clock();
      // DS-041: the host is back, so any attempt to take over is void; DS-040: no takeover deadline either.
      room.transferVotes.clear();
      clearTimeout(room.hostTimer);
    }
    this.syncPresence(room);
    this.send(room, client, true);
    client.ping = setInterval(() => { if (writable(res)) { try { res.write(': ping\n\n'); } catch { this.dropClient(room, client); } } else this.dropClient(room, client); }, 25_000);
    client.ping.unref?.();
    res.on('close', () => {
      this.dropClient(room, client);
      if (pid && pid === room.match.hostId && !this.isConnected(room, pid)) {
        room.hostSeen = this.clock();
        // DS-040: when the grace runs out, tell everyone (an idle table would otherwise never learn it can rescue itself).
        clearTimeout(room.hostTimer);
        room.hostTimer = setTimeout(() => { if (this.rooms.get(room.code) === room) this.broadcast(room); }, HOST_GRACE_MS + 250);
        room.hostTimer.unref?.();
      }
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
    if (client.board) { const hint = mimicBoardHint(m); return { ...publicView(m, now), boardAudio: this.boardAudio(room), paused: room.paused ? { by: room.paused.by } : null, ...this.presenceView(room), ...this.countdownView(room), evening: this.eveningView(room), endVotes: this.endVotesView(room), awards: m.phase === 'ENDED' ? room.awards ?? null : null, ...(hint ? { mimicHint: hint } : {}) }; }
    if (m.moderated && client.pid === m.moderatorId) {
      const v = moderatorView(m, now);
      v.moderatorName = room.moderatorName;
      if (m.hostId !== m.moderatorId) v.host = undefined;
      return this.decorate(room, client, v);
    }
    return this.decorate(room, client, playerView(m, client.pid, now));
  }

  /**
   * TV-Z3 / TV-Z5, for the TV only: whether the host has stepped out (and whether the minute's grace is over, after
   * which any player may take the host controls), and how many other screens are watching the board.
   */
  presenceView(room) {
    const m = room.match;
    const host = m.players.find((p) => p.id === m.hostId);
    const out = host && !host.bot && !this.isConnected(room, m.hostId);
    const watching = Math.max(0, [...room.clients].filter((c) => c.board).length - 1);
    return { hostOut: out ? { name: host.name, free: this.clock() - room.hostSeen >= HOST_GRACE_MS } : null, watching };
  }

  eveningView(room) {
    const ev = room.evening;
    if (!ev?.games?.length) return null;
    return { games: ev.games.slice(-12), rows: Object.entries(ev.rows).map(([id, r]) => ({ id, ...r })).sort((a, b) => b.pts - a.pts || b.wins - a.wins || a.name.localeCompare(b.name)) };
  }
  endVotesView(room, pid = null) {
    const votes = Object.values(room.endVotes ?? {});
    return { again: votes.filter((x) => x === 'again').length, another: votes.filter((x) => x === 'another').length, total: room.match.players.filter((p) => !p.bot).length, mine: pid ? room.endVotes?.[pid] ?? null : null };
  }

  countdownView(room) {
    if (room.match.phase !== 'LOBBY') return {};
    const off = room.countdownOff && this.clock() - room.countdownOff.at < 6000 ? { reason: room.countdownOff.reason } : null;
    const note = room.lobbyNote && this.clock() - room.lobbyNote.at < 6000 ? { ...room.lobbyNote } : null;
    const browsing = room.browsing && this.clock() - room.browsing.at < 180_000 ? { by: room.browsing.by } : null;
    return { countdown: room.countdown ? { at: room.countdown.at, by: room.countdown.by } : null, countdownOff: off, lobbyNote: note, browsing };
  }

  decorate(room, client, v) {
    const m = room.match;
    v.boardAudio = this.boardAudio(room);
    v.evening = this.eveningView(room);
    v.endVotes = this.endVotesView(room, client.pid);
    v.awards = room.match.phase === 'ENDED' ? room.awards ?? null : null;
    v.paused = room.paused ? { by: room.paused.by } : null;
    Object.assign(v, this.countdownView(room));
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
    if (client.gone || !writable(client.res)) return;
    const json = JSON.stringify(this.viewFor(room, client));
    const strip = json.replace(/"serverNow":\d+,/, '');
    if (!force && strip === client.last) return;
    client.last = strip;
    client.res.write(`event: state\ndata: ${json}\n\n`);
  }

  broadcast(room) {
    for (const c of [...room.clients]) {
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
    const ctx = { rules: m.activeRules?.length ?? 0, pace: m.settings?.pace, doomsday: m.config?.doomsday ? m.config.doomsdayDays : null };
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

  /** S2: keep an untuned lobby on the recommended setup for its game and table size. */
  syncRecommended(room) {
    const m = room.match;
    if (m.phase !== 'LOBBY' || m.recTuned || m.recN === m.players.length) return;
    m.recN = m.players.length;
    const { patch } = recommend(modeOf(m.settings.preset), m.players.length);
    if (Object.keys(patch).length) { try { updateSettings(m, patch); } catch { /* a recommendation never blocks the lobby */ } }
  }

  /**
   * F2: the evening ledger. Each finished game gives every player 0–2 evening points (a win 2; a place in the
   * top half of a scored game, or surviving a game of elimination, 1), so a ten-minute game and an hour-long one
   * weigh the same. Kept on the room, so it survives rematches and changes of game; the host can clear it.
   */
  recordEvening(room) {
    const m = room.match;
    if (m.phase !== 'ENDED' || !m.winner || m.winner === 'ABORTED' || room.eveningFor === m.phaseId) return;
    room.eveningFor = m.phaseId;
    const ev = (room.evening ||= { games: [], rows: {} });
    const mode = modeOf(m.settings.preset);
    const now = this.clock();
    const ranked = ['omen', 'mirror', 'carnival', 'coffins'].includes(mode);
    const scores = (v) => (mode === 'omen' ? v.omen?.scores : mode === 'mirror' ? v.mirror?.scores : mode === 'carnival' ? Object.fromEntries((v.carnival?.seats ?? []).filter((x) => !x.chair).map((x) => [x.id, x.souls ?? 0])) : mode === 'coffins' ? Object.fromEntries((v.coffins?.plots ?? []).map((x) => [x.id, x.wins ?? 0])) : null);
    const winners = [];
    const called = new Set(calledIt(m).map((h) => h.by));
    for (const p of m.players) {
      let v;
      try { v = playerView(m, p.id, now); } catch { continue; }
      const won = didIWin(v, m.winner);
      let pts = won ? 2 : 0;
      if (!won && ranked) { const sc = scores(v) ?? {}; const sorted = Object.values(sc).sort((a, b) => b - a); if ((sc[p.id] ?? 0) >= (sorted[Math.floor((sorted.length - 1) / 2)] ?? Infinity)) pts = 1; }
      else if (!won && p.alive && ['classic', 'midnight'].includes(mode)) pts = 1;
      if (mode === 'classic' && called.has(p.id)) pts += 1; // D1: a ghost who called it earns a point for the ledger
      const row = (ev.rows[p.id] ||= { name: p.name, pts: 0, games: 0, wins: 0 });
      row.name = p.name; row.avatar = p.avatar ?? null; row.games++; row.pts += pts; row.last = pts; if (won) { row.wins++; winners.push(p.name); }
    }
    room.awards = awardsFor(m, mode);
    for (const r of Object.values(ev.rows)) if (!m.players.some((p) => ev.rows[p.id] === r)) r.last = null; // sat this one out
    ev.games.push({ mode, winner: m.winner, winners });
  }

  changed(room) {
    this.syncRecommended(room);
    this.recordEvening(room);
    if (room.paused && room.paused.phaseId !== room.match.phaseId) { // the host ended the game while paused
      room.paused = null;
      if (room.match.holdUntil === Number.MAX_SAFE_INTEGER) room.match.holdUntil = 0;
    }
    if (room.match.phase !== 'ENDED' && room.match.phase !== 'LOBBY') { room.endVotes = {}; room.awards = null; }
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
        if (move.wait || this.holding(room) || room.paused) { this.wakeBots(room); return; }
        try {
          playerCommand(m, p.id, { ...move.cmd, phaseId: m.phaseId }, this.rng, this.clock());
          this.changed(room);
        } catch { /* the window moved on; try again next change */ }
      }, Math.max(0, (m.holdUntil ?? 0) - this.clock()) + this.botDelay[0] + this.rng.int(this.botDelay[1])).unref?.() ?? null);
    }
  }

  /** Start the game now (DS-045: Start anyway readies everyone only if the start then succeeds). */
  startNow(room, anyway) {
    const m = room.match;
    const was = m.players.map((p) => p.ready);
    if (anyway) m.players.forEach((p) => { p.ready = true; });
    try { startMatch(m, this.rng, this.clock()); } catch (e) { m.players.forEach((p, i) => { p.ready = was[i]; }); throw e; }
  }

  /** The countdown reached zero: start, unless the table changed under it (then it says why). */
  finishCountdown(room) {
    if (this.rooms.get(room.code) !== room || !room.countdown) return;
    const { anyway } = room.countdown;
    room.countdown = null;
    room.browsing = null;
    try { this.startNow(room, anyway); } catch { room.countdownOff = { reason: 'setup', at: this.clock() }; }
    this.changed(room);
  }

  /** TV-L14: until zero, a host tap or a change at the table (someone leaves, unreadies, or the setup changes) cancels. */
  cancelCountdown(room, reason) {
    if (!room.countdown) return false;
    clearTimeout(room.cdTimer);
    room.countdown = null;
    room.countdownOff = { reason, at: this.clock() };
    return true;
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
      // DS-037, DS-038, DS-039: what a restart must not forget.
      paused: r.paused ?? null, evening: r.evening ?? null, eveningFor: r.eveningFor ?? null, awards: r.awards ?? null,
      endVotes: r.endVotes ?? null, keys: r.keys ? [...r.keys] : [],
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
        const room = { code: r.code, match: r.match, sessions: new Map(r.sessions), recovery: new Map(r.recovery), clients: new Set(), timer: null, touched: r.touched, hostSeen: this.clock(), transferVotes: new Set(), moderatorName: r.moderatorName,
          paused: r.paused ?? null, evening: r.evening ?? undefined, eveningFor: r.eveningFor ?? undefined, awards: r.awards ?? null, endVotes: r.endVotes ?? undefined, keys: new Map(r.keys ?? []) };
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
