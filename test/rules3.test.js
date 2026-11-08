// Optional sides (Lovers, Cult, Ripper), clues, coin-flip ties, Open Ballot, portraits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setup, runDay, runNight, NAMES } from './helpers.js';
import { buildDeck, validateSetup, defaultSettings, applySettingsPatch } from '../engine/setup.js';
import { newMatch, addPlayer, playerCommand } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { checkVictory } from '../engine/victory.js';
import { seededRng } from '../engine/rng.js';

const alive = (t, n) => t.P(n).alive;
const love = (t, a, b) => { t.P(a).lover = t.id(b); t.P(b).lover = t.id(a); };

test('Lovers die together, by day and by night', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH']);
  love(t, 'Cy', 'Di');
  runDay(t, { nominate: [['Bo', 'Cy']], votes: { Bo: 'Cy', Ed: 'Cy', Fay: 'Cy', Ada: 'Cy' } });
  assert.equal(alive(t, 'Cy'), false);
  assert.equal(alive(t, 'Di'), false, 'heartbreak by day');
  assert.ok(t.m.publicLog.some((l) => l.ev === 'heartbreak'));
  const u = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH']);
  love(u, 'Cy', 'Fay');
  runDay(u);
  runNight(u, { death: { all: ['Cy'] } });
  assert.equal(alive(u, 'Cy'), false);
  assert.equal(alive(u, 'Fay'), false, 'heartbreak by night');
});

test('Lovers win when they are the last two alive', () => {
  const players = [{ id: 'a', alive: true, alignment: 'DEATH', lover: 'b' }, { id: 'b', alive: true, alignment: 'NON_DEATH', lover: 'a' }, { id: 'c', alive: false, alignment: 'NON_DEATH' }];
  assert.equal(checkVictory({ players }).winner, 'LOVERS');
});

test('Lovers are dealt at the start and see each other', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO'], { settings: { lovers: true } });
  const pair = t.m.players.filter((p) => p.lover);
  assert.equal(pair.length, 2);
  assert.equal(playerView(t.m, pair[0].id).me.lover.id, pair[1].id);
  assert.equal(publicView(t.m).players.find((p) => p.id === pair[0].id).lover, undefined, 'secret until the end');
});

test('The Cult recruits, refuses Death, and wins by outnumbering', () => {
  const t = setup(['DEATH', 'CULT_LEADER', 'INNOCENT', 'INNOCENT', 'PSYCHO']);
  runDay(t);
  runNight(t, { death: { all: [] }, actions: { Bo: [{ target: 'Ada' }] } });
  assert.equal(t.P('Ada').alignment, 'DEATH', 'Death cannot be recruited');
  runDay(t);
  runNight(t, { death: { all: [] }, actions: { Bo: [{ target: 'Cy' }] } });
  assert.equal(t.P('Cy').alignment, 'CULT');
  assert.deepEqual(playerView(t.m, t.id('Cy')).me.cultmates.map((x) => x.name), ['Bo']);
  runDay(t, { nominate: [['Bo', 'Ada']], votes: { Bo: 'Ada', Cy: 'Ada', Di: 'Ada' } });
  assert.equal(t.m.winner, null, '2 Cult of 4: not yet a majority');
  runNight(t, { actions: { Bo: [{ target: 'Di' }] } });
  assert.equal(t.m.winner, 'CULT');
});

test('The Ripper kills, shrugs off Death, and wins alone', () => {
  const t = setup(['DEATH', 'RIPPER', 'GUARDIAN', 'INNOCENT', 'PSYCHO']);
  runDay(t);
  runNight(t, { death: { all: ['Bo'] }, actions: { Bo: [{ target: 'Di' }], Cy: [{ target: 'Cy' }] } });
  assert.equal(alive(t, 'Bo'), true, 'Death cannot kill the Ripper at night');
  assert.equal(alive(t, 'Di'), false);
  runDay(t, { nominate: [['Bo', 'Ada']], votes: { Bo: 'Ada', Cy: 'Ada', Ed: 'Ada' } });
  assert.equal(t.m.winner, null, 'the Ripper is still out there');
  runNight(t, { actions: { Bo: [{ target: 'Ed' }], Cy: [{ target: 'Cy' }] } });
  assert.equal(t.m.winner, 'RIPPER', 'alone with one non-killer');
});

test('Side switches add their roles to automatic decks and warn at small tables', () => {
  const s = applySettingsPatch(defaultSettings(), { cult: true, ripper: true });
  const deck = buildDeck(9, s, seededRng(2));
  assert.equal(deck.length, 9);
  assert.ok(deck.includes('CULT_LEADER') && deck.includes('RIPPER'));
  const w = JSON.stringify(validateSetup(6, s).warnings);
  assert.match(w, /Cult at fewer than/);
  assert.match(w, /Ripper at fewer than/);
});

test('Clues reach at most two non-Death survivors and tell the truth', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { settings: { clues: true, clueOdds: 3 }, script: { clue: [0, 1] } });
  runDay(t);
  runNight(t, { death: { all: [] } });
  const got = t.m.players.filter((p) => (t.m.privateLog[p.id] || []).some((l) => l.kind === 'clue'));
  assert.ok(got.length >= 1 && got.length <= 2);
  for (const p of got) assert.notEqual(p.alignment, 'DEATH');
  const u = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO'], { settings: { clues: false } });
  runDay(u); runNight(u, { death: { all: [] } });
  assert.ok(!u.m.players.some((p) => (u.m.privateLog[p.id] || []).some((l) => l.kind === 'clue')), 'switched off');
});

test('A coin decides a tied vote when the tiebreak is on', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { settings: { tieBreak: 'coin' }, script: { coin: [1] } });
  runDay(t, { nominate: [['Bo', 'Cy'], ['Di', 'Ed']], votes: { Bo: 'Cy', Fay: 'Cy', Di: 'Ed', Gus: 'Ed' } });
  const ev = t.m.publicLog.find((l) => l.ev === 'coinflip');
  assert.ok(ev, 'a coin was tossed');
  assert.deepEqual(ev.tied.sort(), [t.id('Cy'), t.id('Ed')].sort());
  assert.equal(t.P(t.m.players.find((p) => p.id === ev.winner).name).alive, false);
});

test('Open Ballot shows every vote as it comes in', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO'], { rules: ['OPEN_BALLOT'] });
  t.advance();
  t.cmd('Bo', 'day.nominate', { target: t.id('Cy') });
  t.advance(); t.advance({ skipAll: true });
  t.cmd('Bo', 'day.ballot', { target: t.id('Cy') });
  assert.equal(publicView(t.m).day.openBallots[t.id('Bo')], t.id('Cy'));
  const u = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO']);
  u.advance(); u.cmd('Bo', 'day.nominate', { target: u.id('Cy') }); u.advance(); u.advance({ skipAll: true });
  u.cmd('Bo', 'day.ballot', { target: u.id('Cy') });
  assert.equal(publicView(u.m).day.openBallots, undefined, 'secret without the rule');
});

test('Portraits are validated and public', () => {
  const m = newMatch({ id: 'x', code: 'AVA001', hostId: 'p0' });
  addPlayer(m, { id: 'p0', name: 'Ada', avatar: { c: 2, e: 3, m: 1, h: 9 } });
  addPlayer(m, { id: 'p1', name: 'Bo', avatar: { c: 99, e: 0, m: 0, h: 0 } });
  assert.deepEqual(publicView(m).players[0].avatar, { c: 2, e: 3, m: 1, h: 9 });
  assert.equal(publicView(m).players[1].avatar, null, 'out of range is dropped');
  playerCommand(m, 'p1', { type: 'lobby.avatar', payload: { avatar: { c: 1, e: 1, m: 1, h: 1 } } }, seededRng(1), 1);
  assert.deepEqual(m.players[1].avatar, { c: 1, e: 1, m: 1, h: 1 });
  assert.throws(() => playerCommand(m, 'p1', { type: 'lobby.avatar', payload: { avatar: { c: -1 } } }, seededRng(1), 1), /portrait/);
});
