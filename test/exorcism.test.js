// Dead Set: Exorcism — rules from EXORCISM.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport, onDeadline } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { categoryById, sameWord, CATEGORIES } from '../engine/words.js';
import { RoomManager } from '../server/rooms.js';
import { NAMES } from './helpers.js';

/** A started Exorcism round. roles in seat order ('D' = Demon). The lottery picks seat `first`. */
function setup(roles, { x = {}, seed = 5, first = 0, word = { category: 'ANIMALS', word: 3 }, settings = {} } = {}) {
  const rng = seededRng(seed, { leader: [first], coin: [0] });
  const m = newMatch({ id: 'x1', code: 'EXOR01', hostId: 'p0' });
  roles.forEach((_, i) => addPlayer(m, { id: `p${i}`, name: NAMES[i] }));
  updateSettings(m, { preset: 'exorcism', x, ...settings });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now, { forceRoles: roles.map((r) => (r === 'D' ? 'X_DEMON' : 'X_LIVING')), forceWord: word });
  const id = (n) => m.players.find((p) => p.name === n).id;
  const cmd = (n, type, payload = {}) => playerCommand(m, id(n), { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  const t = { m, rng, id, cmd, advance, now: () => now };
  t.ackAll = () => { m.players.forEach((p) => cmd(p.name, 'x.ack')); assert.equal(m.phase, 'X_LOTTERY'); advance(); };
  t.speakAll = () => { while (m.phase === 'X_CLUES') cmd(m.players.find((p) => p.id === m.X.order[m.X.turn % m.X.order.length]).name, 'x.done', { word: 'hm' }); };
  t.readyAll = () => m.players.forEach((p) => cmd(p.name, 'x.ready'));
  t.vote = (map) => Object.entries(map).forEach(([a, b]) => cmd(a, 'x.vote', { target: id(b) }));
  return t;
}
const FIVE = ['L', 'L', 'D', 'L', 'L']; // Cy is the Demon

test('the crystal ball: Living see the password, the Demon only the category (and the hint, if on)', () => {
  const t = setup(FIVE, { x: { hint: 'initial' } });
  const me = (n) => playerView(t.m, t.id(n)).me.x;
  assert.equal(me('Ada').word, 3);
  assert.equal(me('Ada').category, 'ANIMALS');
  assert.equal(me('Cy').word, undefined);
  assert.equal(me('Cy').category, 'ANIMALS');
  assert.equal(me('Cy').hint.x, 'O'); // owl
  assert.ok(!JSON.stringify(publicView(t.m)).includes('"word":3'), 'the public view never carries the password');
  // hint off by default
  const u = setup(FIVE);
  assert.equal(playerView(u.m, 'p2').me.x.hint, undefined);
});

test('a lottery picks the first speaker; everyone speaks in seat order and confirms', () => {
  const t = setup(FIVE, { first: 3 });
  t.ackAll();
  assert.equal(t.m.phase, 'X_CLUES');
  assert.deepEqual(t.m.X.order, ['p3', 'p4', 'p0', 'p1', 'p2']);
  assert.throws(() => t.cmd('Ada', 'x.done'), /not your turn/);
  t.cmd('Di', 'x.done');
  assert.equal(publicView(t.m).exorcism.speaker, 'p4');
  // a speaker who runs out of time is skipped
  t.advance();
  assert.equal(publicView(t.m).exorcism.speaker, 'p0');
  assert.equal(t.m.X.clues[1].timeout, true);
  t.speakAll();
  assert.equal(t.m.phase, 'X_DISCUSS');
});

test('two rounds go around twice; typed words are shown', () => {
  const t = setup(FIVE, { x: { rounds: 2, typed: true } });
  t.ackAll();
  t.speakAll();
  assert.equal(t.m.X.clues.length, 10);
  assert.equal(t.m.X.clues[0].word, 'hm');
  assert.equal(t.m.phase, 'X_DISCUSS');
});

test('the vote: miss the Demon and the Demon wins', () => {
  const t = setup(FIVE);
  t.ackAll(); t.speakAll(); t.readyAll();
  assert.equal(t.m.phase, 'X_VOTE');
  assert.throws(() => t.cmd('Ada', 'x.vote', { target: t.id('Ada') }), /yourself/);
  t.vote({ Ada: 'Bo', Bo: 'Di', Cy: 'Bo', Di: 'Bo', Ed: 'Cy' });
  assert.equal(t.m.winner, 'DEMON');
  assert.equal(t.m.phase, 'ENDED');
});

test('catch the Demon: one guess at the password decides it', () => {
  for (const [index, winner] of [[3, 'DEMON'], [5, 'NON_DEATH']]) {
    const t = setup(FIVE);
    t.ackAll(); t.speakAll(); t.readyAll();
    t.vote({ Ada: 'Cy', Bo: 'Cy', Cy: 'Ada', Di: 'Cy', Ed: 'Bo' });
    assert.equal(t.m.phase, 'X_GUESS');
    assert.throws(() => t.cmd('Ada', 'x.guess', { index }), /caught Demon/);
    if (!t.m.X.grid.includes(index)) t.m.X.grid[1] = index;
    t.cmd('Cy', 'x.guess', { index });
    assert.equal(t.m.winner, winner);
  }
});

test('ties: by default the Demon escapes; with the coin, someone is named', () => {
  const t = setup(FIVE);
  t.ackAll(); t.speakAll(); t.readyAll();
  t.vote({ Ada: 'Cy', Bo: 'Cy', Cy: 'Ada', Di: 'Ada', Ed: 'Bo' });
  assert.equal(t.m.winner, 'DEMON');
  const c = setup(FIVE, { x: { tie: 'coin' } });
  c.ackAll(); c.speakAll(); c.readyAll();
  c.vote({ Ada: 'Cy', Bo: 'Cy', Cy: 'Ada', Di: 'Ada', Ed: 'Bo' });
  assert.ok(['X_GUESS', 'ENDED'].includes(c.m.phase));
  assert.ok(c.m.X.named);
});

test('typed guesses forgive accents, case and one typo', () => {
  assert.ok(sameWord('WOLF', 'wolf'));
  assert.ok(sameWord('Fledermous', 'Fledermaus'));
  assert.ok(sameWord('araignee', 'araignée'));
  assert.ok(!sameWord('cat', 'bat'));
  const t = setup(FIVE, { x: { grid: false } });
  t.ackAll(); t.speakAll(); t.readyAll();
  t.vote({ Ada: 'Cy', Bo: 'Cy', Cy: 'Ada', Di: 'Cy', Ed: 'Cy' });
  t.cmd('Cy', 'x.guess', { text: ' OWL ' });
  assert.equal(t.m.winner, 'DEMON');
});

test('setup: 3–12 players, two Demons from 7, at least one category', () => {
  const m = newMatch({ id: 'x', code: 'X', hostId: 'p0' });
  for (let i = 0; i < 3; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { preset: 'exorcism' });
  assert.ok(setupReport(m).ok);
  updateSettings(m, { x: { demons: 2 } });
  assert.ok(!setupReport(m).ok);
  for (let i = 3; i < 7; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  assert.ok(setupReport(m).ok);
  updateSettings(m, { x: { categories: [] } });
  assert.ok(!setupReport(m).ok);
  updateSettings(m, { x: { categories: ['FOOD'] } });
  assert.deepEqual(m.settings.x.categories, ['FOOD']);
  for (const c of CATEGORIES) for (const words of Object.values(c.words)) assert.equal(words.length, 20);
});

test('two Demons: they may know each other; the caught one guesses', () => {
  const roles = ['L', 'D', 'L', 'L', 'D', 'L', 'L'];
  const t = setup(roles, { x: { demons: 2, demonsKnow: true } });
  assert.equal(playerView(t.m, 'p1').me.x.demonMates[0].id, 'p4');
  const u = setup(roles, { x: { demons: 2 } });
  assert.equal(playerView(u.m, 'p1').me.x.demonMates, undefined);
});

test('the end returns the table to the same lobby, settings and scores kept', () => {
  const t = setup(FIVE, { x: { rounds: 2 } });
  t.ackAll(); t.speakAll(); t.readyAll();
  t.vote({ Ada: 'Bo', Bo: 'Di', Cy: 'Bo', Di: 'Bo', Ed: 'Cy' });
  assert.equal(t.m.xScores.p2, 2);
  assert.ok(t.m.deadline, 'a return timer runs');
  assert.ok(onDeadline(t.m, t.rng, t.m.deadline + 1));
  assert.equal(t.m.phase, 'LOBBY');
  assert.equal(t.m.settings.x.rounds, 2);
  assert.equal(t.m.xScores.p2, 2);
  assert.ok(t.m.players.every((p) => p.ready));
  assert.equal(publicView(t.m).mode, 'exorcism');
});

test('bots play whole Exorcism rounds', async () => {
  for (const n of [3, 6, 9]) {
    const rm = new RoomManager({ botDelay: [1, 3] });
    const host = rm.createRoom({ name: 'Mod', moderated: true });
    const m = rm.rooms.get(host.code).match;
    rm.command(host.code, host.token, { type: 'host.settings', payload: { preset: 'exorcism', x: { typed: true, demons: n >= 7 ? 2 : 1 } } });
    rm.command(host.code, host.token, { type: 'host.bots', payload: { count: n } });
    rm.command(host.code, host.token, { type: 'host.start' });
    for (const until = Date.now() + 60_000; Date.now() < until && m.phase !== 'ENDED';) {
      await new Promise((r) => setTimeout(r, 10));
      if (m.phase === 'X_LOTTERY') rm.command(host.code, host.token, { type: 'host.advance', payload: {}, phaseId: m.phaseId });
    }
    for (const r of rm.rooms.values()) { clearTimeout(r.timer); for (const tm of r.botTimers?.values() ?? []) clearTimeout(tm); }
    clearInterval(rm.sweeper);
    assert.equal(m.phase, 'ENDED', `n=${n} stuck in ${m.phase}`);
    assert.ok(['DEMON', 'NON_DEATH'].includes(m.winner));
    assert.equal(m.X.clues.length, n);
  }
});

test('the host can draw another word before the vote: a fresh deal, nothing scored', () => {
  const rm = new RoomManager({ botDelay: [10_000_000, 1] });
  const host = rm.createRoom({ name: 'Ada' });
  const m = rm.rooms.get(host.code).match;
  for (let i = 1; i < 5; i++) { const s = rm.joinRoom(host.code, { name: NAMES[i] }); rm.command(host.code, s.token, { type: 'lobby.ready', payload: { ready: true } }); }
  rm.command(host.code, host.token, { type: 'host.settings', payload: { preset: 'exorcism' } });
  rm.command(host.code, host.token, { type: 'lobby.ready', payload: { ready: true } });
  rm.command(host.code, host.token, { type: 'host.start' });
  const before = `${m.X.category}:${m.X.word}`;
  m.players.forEach((p) => { p.acknowledged = true; });
  rm.command(host.code, host.token, { type: 'host.xredraw' });
  assert.equal(m.phase, 'X_REVEAL');
  assert.notEqual(`${m.X.category}:${m.X.word}`, before);
  assert.ok(m.players.every((p) => !p.acknowledged), 'everyone looks again');
  assert.deepEqual(m.xScores, {});
  assert.ok(m.publicLog.some((l) => l.ev === 'x-redraw'));
  // not once the vote is open
  m.phase = 'X_VOTE';
  assert.throws(() => rm.command(host.code, host.token, { type: 'host.xredraw' }), /before the vote/);
  for (const r of rm.rooms.values()) clearTimeout(r.timer);
  clearInterval(rm.sweeper);
});
