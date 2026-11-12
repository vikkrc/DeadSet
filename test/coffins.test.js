// Dead Set: Coffins — rules from COFFINS.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport, onDeadline } from '../engine/game.js';
import { playerView, publicView, moderatorView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { RoomManager } from '../server/rooms.js';
import { NAMES } from './helpers.js';

/**
 * A started Coffins game with n players. The lottery picks seat `first`; the
 * Death coffin goes to seat `death` (or is off). Script keys feed the rng.
 */
function setup(n = 4, { c = {}, first = 0, death = null, script = {}, seed = 3 } = {}) {
  const rng = seededRng(seed, { leader: [first], cdeath: death === null ? [0, 0, 0, 0, 0, 0, 0, 0] : [death, 0, death, 0, death, 0, death, 0], ...script });
  const m = newMatch({ id: 'c1', code: 'COFF01', hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { preset: 'coffins', c: { deathCoffin: death !== null, ...c } });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now);
  const id = (nm) => m.players.find((p) => p.name === nm).id;
  const cmd = (nm, type, payload = {}) => playerCommand(m, id(nm), { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  const cards = (nm) => m.C.owned[id(nm)];
  const gold = (nm, k = 0) => cards(nm).filter((x) => x.t === 'G' && !m.C.stacks[id(nm)].includes(x.id) && m.C.death?.card !== x.id)[k].id;
  const curse = (nm) => cards(nm).find((x) => x.t === 'C').id;
  const deathCard = () => m.C.death?.card;
  const t = { m, rng, id, cmd, advance, cards, gold, curse, deathCard, now: () => now };
  /** Out of the lottery: everyone buries their given first coffin (default: a Gold). */
  t.round = (firsts = {}) => {
    if (m.phase === 'C_LOTTERY') advance();
    assert.equal(m.phase, 'C_BURY');
    for (const p of m.players) if (!m.C.out[p.id]) cmd(p.name, 'c.bury', { card: firsts[p.name] ?? gold(p.name) });
    assert.equal(m.phase, 'C_TURN');
  };
  t.passAll = () => { while (m.phase === 'C_BID') cmd(m.players.find((p) => p.id === m.C.turn).name, 'c.pass'); };
  return t;
}

test('everyone starts with three Gold and one Curse; the lottery picks who goes first', () => {
  const t = setup(4, { first: 2 });
  assert.equal(t.m.phase, 'C_LOTTERY');
  for (const p of t.m.players) {
    assert.equal(t.cards(p.name).length, 4);
    assert.equal(t.cards(p.name).filter((x) => x.t === 'C').length, 1);
  }
  t.round();
  assert.equal(t.m.C.turn, t.id('Cy'));
  assert.equal(t.m.C.round, 1);
});

test('five coffins when the host chooses longer games', () => {
  const t = setup(3, { c: { coffins: 5 } });
  assert.equal(t.cards('Ada').length, 5);
});

test('burying by turns, then a challenge opens the bidding; the high bidder never bids on itself', () => {
  const t = setup(4);
  t.round();
  t.cmd('Ada', 'c.bury', { card: t.gold('Ada') });
  assert.equal(t.m.C.turn, t.id('Bo'));
  assert.throws(() => t.cmd('Cy', 'c.bury', { card: t.gold('Cy') }), /not your turn/);
  t.cmd('Bo', 'c.challenge', { n: 2 });
  assert.equal(t.m.phase, 'C_BID');
  assert.equal(t.m.C.turn, t.id('Cy'));
  assert.throws(() => t.cmd('Cy', 'c.raise', { n: 2 }), /Raise above/);
  t.cmd('Cy', 'c.raise', { n: 3 });
  t.cmd('Di', 'c.pass');
  t.cmd('Ada', 'c.pass');
  // Bo is asked next (Cy holds the bid); after Bo passes, Cy digs.
  assert.equal(t.m.C.turn, t.id('Bo'));
  t.cmd('Bo', 'c.pass');
  assert.equal(t.m.phase, 'C_DIG');
  assert.equal(t.m.C.digger, t.id('Cy'));
  assert.equal(t.m.C.target, 3);
});

test('a bid can never exceed the coffins in the ground, and bidding the total starts the dig at once', () => {
  const t = setup(3);
  t.round();
  assert.throws(() => t.cmd('Ada', 'c.challenge', { n: 4 }), /between 1 and 3/);
  t.cmd('Ada', 'c.challenge', { n: 3 });
  assert.equal(t.m.C.digger, t.id('Ada'));
});

test('the Digger opens their own coffins first, then picks others; a clean dig wins a challenge', () => {
  const t = setup(3);
  t.round();
  t.cmd('Ada', 'c.bury', { card: t.gold('Ada') });
  t.cmd('Bo', 'c.challenge', { n: 3 });
  t.cmd('Cy', 'c.pass');
  t.cmd('Ada', 'c.pass');
  // Ada's own coffins? No: Bo is the Digger. Bo's single coffin opens by itself.
  assert.equal(t.m.phase, 'C_DIG');
  assert.deepEqual(t.m.C.opened.map((o) => o.owner), [t.id('Bo')]);
  assert.throws(() => t.cmd('Bo', 'c.open', { owner: t.id('Bo') }), /another plot/);
  t.cmd('Bo', 'c.open', { owner: t.id('Ada') });
  t.cmd('Bo', 'c.open', { owner: t.id('Ada') });
  assert.equal(t.m.C.wins[t.id('Bo')], 1);
  assert.equal(t.m.phase, 'C_BURY');
  assert.equal(t.m.C.first, t.id('Bo'));
});

test('two clean digs win the game', () => {
  const t = setup(3);
  for (let r = 0; r < 2; r++) {
    t.round();
    while (t.m.C.turn !== t.id('Ada')) t.cmd(t.m.players.find((p) => p.id === t.m.C.turn).name, 'c.bury', { card: t.gold(t.m.players.find((p) => p.id === t.m.C.turn).name) });
    t.cmd('Ada', 'c.challenge', { n: 1 });
    t.passAll();
  }
  assert.equal(t.m.phase, 'ENDED');
  assert.equal(t.m.winner, 'COFFINS');
  assert.equal(t.m.cWinner, t.id('Ada'));
  assert.ok(t.m.cScores[t.id('Ada')] >= 5);
});

test('another player\'s curse: the Digger loses a coffin at random, and that player starts the next round', () => {
  const t = setup(3, { script: { closs: [0] } });
  t.round({ Bo: t.curse('Bo') });
  t.cmd('Ada', 'c.challenge', { n: 2 });
  t.passAll();
  t.cmd('Ada', 'c.open', { owner: t.id('Bo') });
  assert.equal(t.cards('Ada').length, 3);
  assert.equal(t.m.C.wins[t.id('Ada')], 0);
  assert.equal(t.m.C.first, t.id('Bo'));
  assert.equal(t.m.phase, 'C_BURY');
});

test('the Digger\'s own curse: they choose which coffin to lose and who starts', () => {
  const t = setup(3);
  t.round({ Ada: t.curse('Ada') });
  t.cmd('Ada', 'c.challenge', { n: 2 });
  t.passAll();
  assert.equal(t.m.phase, 'C_LOSE');
  const a = playerView(t.m, t.id('Ada')).action;
  assert.equal(a.type, 'closs');
  const curse = t.curse('Ada');
  t.cmd('Ada', 'c.lose', { card: curse, first: t.id('Cy') });
  assert.equal(t.cards('Ada').length, 3);
  assert.ok(!t.cards('Ada').some((x) => x.t === 'C'), 'Ada chose to lose her curse');
  assert.equal(t.m.C.first, t.id('Cy'));
});

test('the Death coffin: its holder steals one of the Digger\'s coffins as Gold', () => {
  const t = setup(3, { death: 1, script: { csteal: [0] } });
  t.advance();
  assert.equal(t.m.C.death.holder, t.id('Bo'));
  assert.ok(playerView(t.m, t.id('Bo')).me.c.holdsDeath);
  assert.ok(!playerView(t.m, t.id('Ada')).me.c.holdsDeath);
  assert.ok(!JSON.stringify(publicView(t.m).coffins).includes(t.m.C.death.card), 'the Death coffin is secret');
  t.round({ Bo: t.deathCard() });
  t.cmd('Ada', 'c.challenge', { n: 2 });
  t.passAll();
  t.cmd('Ada', 'c.open', { owner: t.id('Bo') });
  assert.equal(t.m.C.result?.face ?? t.m.C.history.at(-1).face, 'D');
  assert.equal(t.cards('Ada').length, 3);
  assert.equal(t.cards('Bo').length, 5);
});

test('digging up your own Death coffin simply fails the dig', () => {
  const t = setup(3, { death: 0 });
  t.advance();
  t.round({ Ada: t.deathCard() });
  t.cmd('Ada', 'c.challenge', { n: 2 });
  t.passAll();
  assert.equal(t.m.C.history.at(-1).face, 'D');
  assert.equal(t.cards('Ada').length, 4);
  assert.equal(t.m.phase, 'C_BURY');
});

test('losing the last coffin makes a ghost; three right wagers and it rises as a Revenant', () => {
  const t = setup(3, { first: 2, script: { closs: [0, 0, 0, 0, 0, 0] } });
  // Cy holds a single Gold coffin, digs first, and hits Bo's curse.
  t.m.C.owned[t.id('Cy')] = [t.m.C.owned[t.id('Cy')].find((x) => x.t === 'G')];
  t.round({ Bo: t.curse('Bo') });
  t.cmd('Cy', 'c.challenge', { n: 2 });
  t.passAll();
  t.cmd('Cy', 'c.open', { owner: t.id('Bo') });
  assert.ok(t.m.C.out[t.id('Cy')], 'Cy is a ghost');
  // Three digs, three right wagers.
  for (let r = 0; r < 3 && t.m.phase !== 'ENDED'; r++) {
    t.round();
    assert.equal(playerView(t.m, t.id('Cy')).action.type, 'cwatch');
    t.cmd(t.m.players.find((p) => p.id === t.m.C.turn).name, 'c.challenge', { n: 1 });
    t.passAll();
    assert.equal(t.m.phase, 'C_WAGER');
    t.cmd('Cy', 'c.wager', { bet: 'gold' });
  }
  if (t.m.phase !== 'ENDED') {
    assert.ok(!t.m.C.out[t.id('Cy')], 'Cy has risen');
    assert.equal(t.cards('Cy').length, 1);
    assert.equal(t.cards('Cy')[0].t, 'G');
    assert.equal(t.m.C.risen[t.id('Cy')], 1);
  }
});

test('the last player with coffins wins', () => {
  const t = setup(3, { first: 1, c: { wagers: false }, script: { closs: [0, 0, 0] } });
  t.m.C.owned[t.id('Bo')] = [t.m.C.owned[t.id('Bo')].find((x) => x.t === 'G')];
  t.m.C.owned[t.id('Cy')] = [t.m.C.owned[t.id('Cy')].find((x) => x.t === 'G')];
  // Bo digs into Ada's curse and is out.
  t.round({ Ada: t.curse('Ada') });
  t.cmd('Bo', 'c.challenge', { n: 2 });
  t.passAll();
  t.cmd('Bo', 'c.open', { owner: t.id('Ada') });
  assert.ok(t.m.C.out[t.id('Bo')]);
  assert.equal(t.m.C.first, t.id('Ada'));
  // Cy, alone with Ada, bids everything and hits Ada's curse too.
  t.round({ Ada: t.curse('Ada') });
  t.cmd('Ada', 'c.bury', { card: t.gold('Ada') });
  t.cmd('Cy', 'c.challenge', { n: 3 });
  t.cmd('Cy', 'c.open', { owner: t.id('Ada') });
  t.cmd('Cy', 'c.open', { owner: t.id('Ada') });
  assert.equal(t.m.phase, 'ENDED');
  assert.equal(t.m.cWinner, t.id('Ada'));
});

test('relics: the Lantern peeks privately, the Key opens another grave first, the Ward saves you once', () => {
  const t = setup(3, { c: { relics: true }, script: { crelic: [0, 1, 2] } });
  assert.equal(t.m.C.relics[t.id('Ada')].id, 'LANTERN');
  assert.equal(t.m.C.relics[t.id('Bo')].id, 'KEY');
  assert.equal(t.m.C.relics[t.id('Cy')].id, 'WARD');
  t.round({ Cy: t.curse('Cy') });
  // Lantern
  t.cmd('Ada', 'c.lantern', { owner: t.id('Cy') });
  const seen = t.m.privateLog[t.id('Ada')].at(-1);
  assert.equal(seen.face, 'C');
  assert.ok(!JSON.stringify(publicView(t.m)).includes('"face":"C"'), 'what the Lantern showed stays private');
  assert.throws(() => t.cmd('Ada', 'c.lantern', { owner: t.id('Bo') }), /no Lantern/);
  t.cmd('Ada', 'c.bury', { card: t.gold('Ada') });
  // Key: Bo opens Ada's grave before his own
  t.cmd('Bo', 'c.challenge', { n: 2 });
  t.passAll();
  assert.equal(playerView(t.m, t.id('Bo')).action.type, 'ckey');
  t.cmd('Bo', 'c.key', { owner: t.id('Ada') });
  assert.equal(t.m.C.history.at(-1)?.round === 1 ? 'done' : t.m.C.opened[0].owner, 'done');
  assert.equal(t.m.C.wins[t.id('Bo')], 1);
  // Ward: Cy hits a curse and loses nothing
  t.round({ Ada: t.curse('Ada') });
  while (t.m.C.turn !== t.id('Cy')) t.cmd(t.m.players.find((p) => p.id === t.m.C.turn).name, 'c.bury', { card: t.gold(t.m.players.find((p) => p.id === t.m.C.turn).name) });
  t.cmd('Cy', 'c.challenge', { n: 2 });
  t.passAll();
  t.cmd('Cy', 'c.open', { owner: t.id('Ada') });
  assert.equal(t.m.C.history.at(-1).ward, true);
  assert.equal(t.cards('Cy').length, 4);
  assert.ok(t.m.C.relics[t.id('Cy')].used);
});

test('privacy: nobody else sees your coffins, and the public view never shows a buried face', () => {
  const t = setup(4, { death: 2 });
  t.round({ Ada: t.curse('Ada') });
  const others = playerView(t.m, t.id('Bo'));
  assert.ok(!JSON.stringify(others.coffins).includes('"C"'), 'no faces in the public plots');
  assert.equal(others.me.c.cards.length, 4);
  assert.ok(!JSON.stringify(others.me).includes(t.curse('Ada')), 'Bo cannot see Ada\'s cards');
  assert.ok(moderatorView(t.m).cSecrets.stacks[t.id('Ada')].includes('C'), 'the moderator sees every coffin');
});

test('every timeout has a default: burial, turn, bid, dig and the choice of loss', () => {
  const t = setup(3);
  t.advance(); // lottery
  assert.equal(t.m.phase, 'C_BURY');
  assert.ok(onDeadline(t.m, t.rng, t.m.deadline + 1));
  assert.equal(t.m.phase, 'C_TURN');
  for (let i = 0; i < 60 && t.m.phase !== 'ENDED'; i++) onDeadline(t.m, t.rng, (t.m.deadline ?? t.now()) + 1);
  assert.ok(['C_BURY', 'C_TURN', 'C_BID', 'C_DIG', 'C_LOSE', 'ENDED'].includes(t.m.phase));
});

test('setup: only Coffins options, 3–10 players', () => {
  const m = newMatch({ id: 'c2', code: 'COFF02', hostId: 'p0' });
  for (let i = 0; i < 2; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'coffins' });
  assert.equal(m.settings.preset, 'coffins');
  assert.ok(!setupReport(m).ok);
  addPlayer(m, { id: 'p2', name: NAMES[2] });
  m.players.forEach((p) => { p.ready = true; });
  assert.ok(setupReport(m).ok);
  updateSettings(m, { c: { toWin: 9, coffins: 7, relics: true } });
  assert.equal(m.settings.c.toWin, 2);
  assert.equal(m.settings.c.coffins, 4);
  assert.equal(m.settings.c.relics, true);
  assert.equal(m.settings.c.wagers, true);
  assert.equal(m.settings.c.deathCoffin, true);
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function botGame(c, bots) {
  const rm = new RoomManager({ botDelay: [1, 3] });
  const host = rm.createRoom({ name: 'Ada' });
  const room = rm.rooms.get(host.code);
  const m = room.match;
  rm.command(host.code, host.token, { type: 'host.settings', payload: { mode: 'coffins', c } });
  rm.command(host.code, host.token, { type: 'host.bots', payload: { count: bots } });
  rm.command(host.code, host.token, { type: 'host.start' });
  for (let i = 0; i < 1500 && m.phase !== 'ENDED'; i++) {
    await wait(8);
    const ph = m.phase;
    const id = m.phaseId;
    await wait(8);
    // The host is a person: when it's the host's move, the host's timer runs out.
    if (m.phaseId === id && ph !== 'ENDED') { try { rm.command(host.code, host.token, { type: 'host.advance', payload: {}, phaseId: m.phaseId }); } catch { /* moved */ } }
  }
  for (const r of rm.rooms.values()) for (const tm of r.botTimers?.values() ?? []) clearTimeout(tm);
  clearInterval(rm.sweeper);
  return m;
}

test('a table of bots plays Coffins to the end, with every twist on', async () => {
  const m = await botGame({ relics: true, wagers: true, deathCoffin: true }, 6);
  assert.equal(m.phase, 'ENDED');
  assert.equal(m.winner, 'COFFINS');
  assert.ok(m.cWinner);
  assert.ok(m.C.history.length >= 1);
});

test('a small table of bots plays Coffins to the end with the twists off', async () => {
  const m = await botGame({ relics: false, wagers: false, deathCoffin: false }, 2);
  assert.equal(m.phase, 'ENDED');
});
