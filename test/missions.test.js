// Dead Set: Missions — rules from MISSIONS.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport } from '../engine/game.js';
import { playerView, publicView, moderatorView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { cardFits, teamSize, failsNeeded, missionClue } from '../engine/missions.js';
import { missionDeck } from '../engine/setup.js';
import { RoomManager } from '../server/rooms.js';
import { NAMES } from './helpers.js';

const D = 'REAPER';
/** A started Missions match with exact roles in seat order. First Leader: seat 0 unless `leader` given. */
function setup(roles, { settings = {}, script = {}, seed = 3, leader = 0 } = {}) {
  const rng = seededRng(seed, { leader: [leader], mcard: [99], ...script });
  const m = newMatch({ id: 'm1', code: 'MISS01', hostId: 'p0' });
  roles.forEach((_, i) => addPlayer(m, { id: `p${i}`, name: NAMES[i] }));
  updateSettings(m, { preset: 'missions', clues: false, missionCards: 0, ...settings });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now, { forceRoles: roles });
  const id = (name) => m.players.find((p) => p.name === name).id;
  const cmd = (name, type, payload = {}) => playerCommand(m, id(name), { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  const t = { m, rng, id, cmd, advance };
  t.ackAll = () => m.players.forEach((p) => cmd(p.name, 'm.ack'));
  t.propose = (names, ward) => cmd(m.players.find((p) => p.id === m.M.leader).name, 'm.propose', { team: names.map(id), ward: ward ? id(ward) : undefined });
  t.voteAll = (approve, except = {}) => m.players.forEach((p) => cmd(p.name, 'm.vote', { approve: p.name in except ? except[p.name] : approve }));
  t.play = (cards) => Object.entries(cards).forEach(([n, c]) => cmd(n, 'm.play', { card: c }));
  t.night = (extra = {}) => m.players.forEach((p) => {
    const payload = { hunch: id(p.name === 'Ada' ? 'Bo' : 'Ada'), done: true, ...(extra[p.name] || {}) };
    const N = m.M.night;
    if (N?.needs.candle === p.id && !payload.candle) payload.candle = m.players.find((x) => !m.M.candle.past.includes(x.id)).id;
    if (m.phase === 'M_NIGHT') cmd(p.name, 'm.night', payload);
  });
  /** One whole mission: propose, approve, play, finish the result screen. */
  t.mission = (names, cards = {}, ward) => {
    t.propose(names, ward);
    t.voteAll(true);
    t.play(Object.fromEntries(names.map((n) => [n, cards[n] ?? 'S'])));
    advance(); // result screen
  };
  return t;
}
// 5 players: Ada Medium, Bo Companion, Cy Companion, Di Reaper, Ed Shade.
const FIVE = ['MEDIUM', 'COMPANION', 'COMPANION', D, 'SHADE'];

test('deck sizes and Death seats follow the table', () => {
  for (const [n, d] of [[5, 2], [6, 2], [7, 3], [8, 3], [9, 3], [10, 4]]) {
    const deck = missionDeck(n, { mRoles: { BELIEVER: true, CHARLATAN: true } });
    assert.equal(deck.length, n);
    assert.equal(deck.filter((r) => ['REAPER', 'CHARLATAN', 'VEILED', 'STRAY', 'SHADE'].includes(r)).length, d);
    assert.ok(deck.includes('MEDIUM') && deck.includes('REAPER') && deck.includes('BELIEVER') && deck.includes('CHARLATAN'));
  }
});

test('the lobby refuses more Death roles than Death seats, and tables outside 5–10', () => {
  const m = newMatch({ id: 'x', code: 'X', hostId: 'p0' });
  for (let i = 0; i < 5; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { preset: 'missions', mRoles: { CHARLATAN: true, VEILED: true } });
  assert.ok(!setupReport(m).ok);
  updateSettings(m, { mRoles: { VEILED: false } });
  assert.ok(setupReport(m).ok);
  for (let i = 5; i < 11; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  assert.ok(!setupReport(m).ok);
});

test('knowledge: Medium sees Death except the Veiled; Death sees Death except the Stray; Believer sees two candles', () => {
  const t = setup(['MEDIUM', 'BELIEVER', 'COMPANION', 'COMPANION', 'CHARLATAN', 'REAPER', 'VEILED', 'STRAY', 'COMPANION', 'COMPANION'].slice(0, 10), { settings: {} });
  const v = (n) => playerView(t.m, t.id(n)).me;
  const sees = v('Ada').seesDeath.map((x) => x.name);
  assert.ok(sees.includes(NAMES[4]) && sees.includes(NAMES[5]) && sees.includes(NAMES[7]) && !sees.includes(NAMES[6]));
  assert.deepEqual(v(NAMES[5]).teammates.map((x) => x.name).sort(), [NAMES[4], NAMES[6]].sort());
  assert.deepEqual(v(NAMES[7]).teammates, []);
  assert.deepEqual(v('Bo').candles.map((x) => x.name), [NAMES[0], NAMES[4]]);
  // Nobody else learns anything.
  assert.equal(v('Cy').seesDeath, undefined);
  assert.equal(v('Cy').teammates, undefined);
});

test('a proposal must match the team size; only the Leader proposes', () => {
  const t = setup(FIVE);
  t.ackAll();
  assert.equal(t.m.phase, 'M_PROPOSE');
  assert.equal(t.m.M.leader, 'p0');
  assert.throws(() => t.cmd('Bo', 'm.propose', { team: [t.id('Bo'), t.id('Cy')] }), /Leader/);
  assert.throws(() => t.propose(['Ada']), /team of 2/);
  t.propose(['Ada', 'Bo']);
  assert.equal(t.m.phase, 'M_VOTE');
});

test('a rejected proposal passes leadership to the left; the fifth goes ahead whatever the vote', () => {
  const t = setup(FIVE);
  t.ackAll();
  for (let i = 0; i < 4; i++) {
    assert.equal(t.m.M.leader, `p${i}`);
    t.propose(['Ada', 'Bo']);
    t.voteAll(false);
    assert.equal(t.m.phase, 'M_PROPOSE');
  }
  assert.equal(t.m.M.attempt, 5);
  assert.ok(publicView(t.m).missions.forced);
  t.propose(['Ada', 'Bo']);
  t.voteAll(false);
  assert.equal(t.m.phase, 'M_MISSION');
  const last = t.m.publicLog.filter((l) => l.ev === 'm-votes').at(-1);
  assert.equal(last.approved, false);
  assert.equal(last.goes, true);
  assert.equal(last.reject, 5);
});

test('team votes need a strict majority, and missing votes count as Approve', () => {
  const t = setup(FIVE);
  t.ackAll();
  t.propose(['Ada', 'Bo']);
  t.cmd('Ada', 'm.vote', { approve: false });
  t.cmd('Bo', 'm.vote', { approve: false });
  t.advance(); // lock: 3 missing → approve, 3–2
  assert.equal(t.m.phase, 'M_MISSION');
});

test('the Living cannot sabotage; a single sabotage fails a normal mission; cards are shuffled', () => {
  const t = setup(FIVE);
  t.ackAll();
  t.propose(['Bo', 'Di']);
  t.voteAll(true);
  assert.throws(() => t.cmd('Ada', 'm.play', { card: 'S' }), /not on this mission/);
  t.cmd('Bo', 'm.play', { card: 'F' }); // coerced to Succeed
  t.cmd('Di', 'm.play', { card: 'F' });
  assert.equal(t.m.phase, 'M_RESULT');
  const r = t.m.M.results[0];
  assert.equal(r.plays[t.id('Bo')], 'S');
  assert.equal(r.fails, 1);
  assert.equal(r.failed, true);
  assert.deepEqual(t.m.M.score, { S: 0, F: 1 });
  assert.deepEqual([...r.cards].sort(), ['F', 'S']);
  // Nobody's view links a card to a player.
  assert.equal(JSON.stringify(publicView(t.m).missions).includes('plays'), false);
});

test('mission 4 at 7+ players needs two sabotage cards', () => {
  const roles = ['MEDIUM', 'COMPANION', 'COMPANION', 'COMPANION', D, 'SHADE', 'SHADE'];
  const t = setup(roles);
  t.ackAll();
  const N = NAMES;
  t.mission([N[0], N[1]], {}); t.night();
  t.mission([N[0], N[1], N[2]], {}); t.night();
  t.mission([N[0], N[1], N[4]], { [N[4]]: 'F' }); t.night();
  assert.equal(failsNeeded(t.m), 2);
  t.mission([N[0], N[1], N[2], N[4]], { [N[4]]: 'F' });
  assert.equal(t.m.M.results[3].failed, false);
  assert.equal(t.m.M.score.S, 3);
  assert.equal(t.m.phase, 'M_RECKONING');
});

test('three successes → the Reckoning: Death wins only by naming the Medium', () => {
  for (const [target, winner] of [['Ada', 'DEATH'], ['Bo', 'NON_DEATH']]) {
    const t = setup(FIVE);
    t.ackAll();
    t.mission(['Ada', 'Bo']); t.night();
    t.mission(['Ada', 'Bo', 'Cy']); t.night();
    t.mission(['Ada', 'Bo']);
    assert.equal(t.m.phase, 'M_RECKONING');
    assert.deepEqual(publicView(t.m).missions.unmasked.sort(), ['p3', 'p4']);
    assert.throws(() => t.cmd('Ed', 'm.reckon', { target: t.id(target) }), /Reaper/);
    assert.throws(() => t.cmd('Di', 'm.reckon', { target: t.id('Ed') }), /not Death/);
    t.cmd('Ed', 'm.suggest', { target: t.id(target) });
    t.cmd('Di', 'm.reckon', { target: t.id(target) });
    assert.equal(t.m.phase, 'ENDED');
    assert.equal(t.m.winner, winner);
  }
});

test('three failures → the Last Stand; naming a Living player loses, catching Death leads to the Reckoning', () => {
  const fail3 = (t) => {
    t.ackAll();
    t.mission(['Ada', 'Di'], { Di: 'F' }); t.night();
    t.mission(['Ada', 'Bo', 'Di'], { Di: 'F' }); t.night();
    t.mission(['Ada', 'Ed'], { Ed: 'F' });
    assert.equal(t.m.phase, 'M_LAST_STAND');
  };
  const a = setup(FIVE);
  fail3(a);
  for (const p of a.m.players) a.cmd(p.name, 'm.accuse', { target: a.id(p.name === 'Bo' ? 'Cy' : 'Bo') });
  assert.equal(a.m.phase, 'ENDED');
  assert.equal(a.m.winner, 'DEATH');

  const b = setup(FIVE);
  fail3(b);
  for (const p of b.m.players) b.cmd(p.name, 'm.accuse', { target: b.id(p.name === 'Ed' ? 'Ada' : 'Ed') });
  assert.equal(b.m.phase, 'M_RECKONING');
  b.cmd('Di', 'm.reckon', { target: b.id('Cy') });
  assert.equal(b.m.winner, 'NON_DEATH');
});

test('a tied Last Stand is settled by the coin', () => {
  const t = setup(FIVE, { script: { coin: [1] } });
  t.ackAll();
  t.mission(['Ada', 'Di'], { Di: 'F' }); t.night();
  t.mission(['Ada', 'Bo', 'Di'], { Di: 'F' }); t.night();
  t.mission(['Ada', 'Ed'], { Ed: 'F' });
  const votes = { Ada: 'Di', Bo: 'Di', Cy: 'Bo', Di: 'Bo', Ed: 'Cy' };
  for (const [v, target] of Object.entries(votes)) t.cmd(v, 'm.accuse', { target: t.id(target) });
  const coin = t.m.publicLog.find((l) => l.ev === 'coinflip');
  assert.ok(coin);
  assert.equal(coin.tied.length, 2);
});

test('the Candle: after missions 2–4, only to players who never held it, and it passes on', () => {
  const t = setup(FIVE); // first leader p0 → Candle starts with seat 4 (Ed)
  t.ackAll();
  assert.equal(t.m.M.candle.holder, 'p4');
  t.mission(['Ada', 'Bo']);
  assert.equal(t.m.M.night.needs.candle, null); // not after mission 1
  t.night();
  t.mission(['Ada', 'Bo', 'Cy']);
  assert.equal(t.m.M.night.needs.candle, 'p4');
  assert.throws(() => t.cmd('Ed', 'm.night', { candle: t.id('Ed') }), /never held/);
  t.night({ Ed: { candle: t.id('Di') } });
  assert.equal(t.m.M.candle.holder, 'p3');
  const seen = t.m.privateLog.p4.find((x) => x.kind === 'candle');
  assert.equal(seen.death, true);
  assert.equal(playerView(t.m, 'p0').private.some((x) => x.kind === 'candle'), false);
});

test('the night needs everyone to pick a hunch; the holder must use the Candle first', () => {
  const t = setup(FIVE);
  t.ackAll();
  t.mission(['Ada', 'Bo']);
  assert.throws(() => t.cmd('Bo', 'm.night', { done: true }), /hunch/);
  t.night();
  assert.equal(t.m.phase, 'M_PROPOSE');
  assert.equal(t.m.M.mission, 1);
  assert.equal(t.m.M.leader, 'p1'); // leadership moved on after the mission
  t.mission(['Ada', 'Bo', 'Cy']);
  assert.throws(() => t.cmd('Ed', 'm.night', { hunch: t.id('Ada'), done: true }), /Candle/);
});

test('mission cards: most missions are Regular; each special appears once and only where it fits', () => {
  const t = setup(['MEDIUM', 'COMPANION', 'COMPANION', 'COMPANION', D, 'SHADE', 'SHADE']);
  assert.equal(cardFits(t.m, 'FRESH_FACES', 0), false);
  assert.equal(cardFits(t.m, 'BRITTLE', 0), false);
  assert.equal(cardFits(t.m, 'BRITTLE', 3), true);
  assert.equal(cardFits(t.m, 'GRAND', 0), false);
  assert.equal(cardFits(t.m, 'GRAND', 4), false);
  assert.equal(cardFits(t.m, 'HAUNTED_ROAD', 4), false);
  // Card frequency over many draws at "Rare".
  let special = 0;
  for (let s = 1; s <= 200; s++) {
    const rng = seededRng(s);
    const m = newMatch({ id: 'x', code: 'X', hostId: 'p0' });
    for (let i = 0; i < 6; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
    updateSettings(m, { preset: 'missions', missionCards: 1 });
    m.players.forEach((p) => { p.ready = true; });
    startMatch(m, rng, 1);
    m.players.forEach((p) => playerCommand(m, p.id, { type: 'm.ack' }, rng, 2));
    if (m.M.card !== 'REGULAR') special++;
  }
  assert.ok(special > 25 && special < 80, `special cards: ${special}/200`);
});

test('card effects: sizes, Lantern, Ward, Steadfast, Smoke, Grand', () => {
  const card = (c) => {
    const t = setup(FIVE);
    t.ackAll();
    t.m.M.card = c;
    return t;
  };
  let t = card('EXTRA_HAND');
  assert.equal(teamSize(t.m), 3);
  t = card('SKELETON_CREW');
  assert.equal(teamSize(t.m), 2); // never below 2
  t = card('LANTERN');
  assert.throws(() => t.propose(['Bo', 'Cy']), /Leader must/);
  t.propose(['Ada', 'Cy']);
  t = card('WARD');
  assert.throws(() => t.propose(['Di', 'Cy']), /ward/i);
  t.propose(['Di', 'Cy'], 'Di');
  t.voteAll(true);
  t.play({ Di: 'F', Cy: 'S' });
  assert.equal(t.m.M.results[0].failed, false);
  t = card('STEADFAST');
  t.mission(['Di', 'Ed'], { Di: 'F' });
  assert.equal(t.m.M.results[0].failed, false);
  t = card('SMOKE');
  t.mission(['Di', 'Cy'], { Di: 'F' });
  assert.equal(t.m.M.results[0].fails, null);
  assert.equal(t.m.M.results[0].cards, null);
  assert.equal(t.m.M.results[0].failed, true);
  t = card('GRAND');
  t.mission(['Ada', 'Cy']);
  assert.equal(t.m.M.score.S, 2);
});

test('card effects: Fresh Faces, Witness, Haunted Road, Trail, Masked Vote, Short Patience', () => {
  let t = setup(FIVE);
  t.ackAll();
  t.mission(['Ada', 'Bo']); t.night();
  t.m.M.card = 'FRESH_FACES'; // size 3, at least 2 not from {Ada, Bo}
  assert.throws(() => t.propose(['Ada', 'Bo', 'Cy']), /Fresh Faces/);
  t.propose(['Ada', 'Cy', 'Di']);

  t = setup(FIVE);
  t.ackAll();
  t.m.M.card = 'WITNESS';
  t.mission(['Ada', 'Di'], { Di: 'F' });
  t.night({ Ada: { witness: t.id('Di') } });
  assert.ok(t.m.privateLog.p0.some((x) => x.kind === 'witness' && /Sabotage/.test(x.text)));

  t = setup(FIVE);
  t.ackAll();
  t.m.M.card = 'HAUNTED_ROAD';
  t.mission(['Bo', 'Di'], { Di: 'F' });
  t.night({ Di: { haunt: t.id('Bo') } });
  assert.equal(publicView(t.m).missions.haunted, 'p1');
  const leader = t.m.players.find((p) => p.id === t.m.M.leader).name;
  assert.throws(() => t.cmd(leader, 'm.propose', { team: [t.id('Bo'), t.id('Cy'), t.id('Ada')] }), /haunted/);

  t = setup(FIVE);
  t.ackAll();
  t.m.M.card = 'TRAIL';
  t.mission(['Bo', 'Cy']);
  t.night();
  assert.equal(Object.keys(t.m.M.clueCount).length, 1);

  t = setup(FIVE);
  t.ackAll();
  t.m.M.card = 'MASKED_VOTE';
  t.propose(['Ada', 'Bo']);
  t.voteAll(true, { Bo: false });
  const ev = t.m.publicLog.filter((l) => l.ev === 'm-votes').at(-1);
  assert.equal(ev.votes, null);
  assert.equal(ev.approve, 4);

  t = setup(FIVE);
  t.ackAll();
  t.m.M.card = 'SHORT_PATIENCE';
  t.propose(['Ada', 'Bo']); t.voteAll(false);
  t.propose(['Ada', 'Bo']); t.voteAll(false);
  t.propose(['Ada', 'Bo']); t.voteAll(false);
  assert.equal(t.m.phase, 'M_MISSION');
});

test('clues in Missions are always true and never go to the Medium or Death', () => {
  const t = setup(FIVE, { settings: { clues: true, clueOdds: 3 } });
  t.ackAll();
  for (let s = 0; s < 50; s++) {
    const c = missionClue(t.m, 'p1', seededRng(s));
    assert.ok(c && /^Clue:/.test(c[0]));
    if (/is not Death-aligned/.test(c[0])) assert.ok(['Ada', 'Cy'].includes(c[1].b));
  }
});

test('the host can force a stuck proposal; a forced fifth proposal is drawn automatically', () => {
  const t = setup(FIVE);
  t.ackAll();
  t.advance(); // Ada never proposes → leadership passes, counts as a rejection
  assert.equal(t.m.M.leader, 'p1');
  assert.equal(t.m.M.attempt, 2);
  for (let i = 0; i < 3; i++) t.advance();
  assert.equal(t.m.M.attempt, 5);
  t.advance(); // forced: a random legal team is proposed
  assert.equal(t.m.phase, 'M_VOTE');
});

test('moderator sees plays; nobody else does', () => {
  const t = setup(FIVE);
  t.ackAll();
  t.propose(['Ada', 'Di']);
  t.voteAll(true);
  t.cmd('Di', 'm.play', { card: 'F' });
  assert.equal(moderatorView(t.m).missionSecrets.plays.p3, 'F');
  for (const pid of ['p0', 'p1', 'p4']) assert.equal(JSON.stringify(playerView(t.m, pid)).includes('"p3":"F"'), false);
});

async function botGame(n, settings = {}) {
  const rm = new RoomManager({ botDelay: [1, 3] });
  const host = rm.createRoom({ name: 'Mod', moderated: true });
  const room = rm.rooms.get(host.code);
  const m = room.match;
  rm.command(host.code, host.token, { type: 'host.settings', payload: { preset: 'missions', missionCards: 2, clueOdds: 3, ...settings } });
  rm.command(host.code, host.token, { type: 'host.bots', payload: { count: n } });
  rm.command(host.code, host.token, { type: 'host.start' });
  for (let i = 0; i < 1500 && m.phase !== 'ENDED'; i++) {
    await new Promise((r) => setTimeout(r, 10));
    if (m.phase === 'M_RESULT') rm.command(host.code, host.token, { type: 'host.advance', payload: {}, phaseId: m.phaseId });
  }
  for (const r of rm.rooms.values()) for (const tm of r.botTimers?.values() ?? []) clearTimeout(tm);
  clearInterval(rm.sweeper);
  return m;
}

test('bots play whole Missions games at 5, 7 and 10 players', async () => {
  for (const [n, s] of [[5, {}], [7, { mRoles: { VEILED: true } }], [10, { mRoles: { VEILED: true, STRAY: true } }]]) {
    const m = await botGame(n, s);
    assert.equal(m.phase, 'ENDED', `n=${n} stuck in ${m.phase}`);
    assert.ok(['DEATH', 'NON_DEATH'].includes(m.winner));
    assert.ok(m.M.results.length >= 3);
  }
});

test('a Candle pick counts even if the night is forced to dawn before the holder sleeps', () => {
  const t = setup(FIVE); // the Candle starts with Ed (p4)
  t.ackAll();
  t.mission(['Ada', 'Bo']); t.night();
  t.mission(['Ada', 'Bo', 'Cy']);
  assert.equal(t.m.M.night.needs.candle, 'p4');
  t.cmd('Ed', 'm.night', { candle: t.id('Di') }); // tapped a seat, never pressed "sleep"
  t.advance(); // the host brings the dawn
  const seen = t.m.privateLog.p4.find((x) => x.kind === 'candle');
  assert.equal(seen.target, 'p3');
  assert.equal(seen.death, true);
  assert.equal(t.m.M.candle.holder, 'p3');
});
