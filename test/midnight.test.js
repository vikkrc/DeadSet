// Dead Set: Midnight — rules from MIDNIGHT.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { botDecide } from '../server/bots.js';
import { recommendedDeck, TABLE, N_STEPS } from '../engine/midnight.js';
import { NAMES } from './helpers.js';

/**
 * A Midnight game with `cards` dealt in seat order (players, then the three
 * table cards). Everyone acknowledges, so the night has begun.
 */
function setup(cards, { n = cards.length - 3, settings = {}, script = {}, ack = true } = {}) {
  const rng = seededRng(9, script);
  const m = newMatch({ id: 'n1', code: 'MIDN01', hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'midnight', n: { deck: 'custom', pool: cards, ...settings } });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now);
  const seats = [...m.players.map((p) => p.id), ...TABLE];
  seats.forEach((s, i) => { m.N.cards[s] = cards[i]; m.N.dealt[s] = cards[i]; });
  m.N.mimic = m.players.find((p) => cards[seats.indexOf(p.id)] === 'MIMIC')?.id ?? null;
  m.N.steps = N_STEPS.filter((r) => cards.includes(r));
  const id = (nm) => m.players.find((p) => p.name === nm).id;
  const cmd = (nm, type, payload = {}) => playerCommand(m, id(nm), { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  const t = { m, rng, id, cmd, advance, step: () => m.N.steps[m.N.step], card: (x) => m.N.cards[x.startsWith('chair') ? x : id(x)] };
  if (ack) for (const p of m.players) cmd(p.name, 'n.ack');
  /** Run the night to a given step (advancing the timers). */
  t.to = (role) => { while (m.phase === 'N_NIGHT' && t.step() !== role) advance(); assert.equal(t.step(), role); };
  t.toDay = () => { while (m.phase === 'N_NIGHT') advance(); assert.equal(m.phase, 'N_DAY'); };
  t.vote = (map) => { if (m.phase === 'N_DAY') advance(); for (const [a, b] of Object.entries(map)) cmd(a, 'n.vote', { target: id(b) }); if (m.phase === 'N_VOTE') advance(); };
  return t;
}

test('recommended decks: players + 3 cards, growing with the table', () => {
  for (let n = 4; n <= 12; n++) {
    const d = recommendedDeck(n);
    assert.equal(d.length, n + 3, `${n} players`);
    assert.equal(d.filter((x) => x === 'DEATH').length, 2);
  }
  assert.ok(recommendedDeck(10).filter((x) => x === 'N_TWIN').length === 2);
});

test('the deal: each player sees only their own card; the night starts when everyone has looked', () => {
  const t = setup(['DEATH', 'DEATH', 'MENTALIST', 'WITCH', 'INNOCENT', 'GAMBLER', 'N_INSOMNIAC'], { ack: false });
  assert.equal(t.m.phase, 'N_DEAL');
  assert.equal(playerView(t.m, 'p0').action.card, 'DEATH');
  assert.equal(playerView(t.m, 'p2').action.card, 'MENTALIST');
  assert.equal(publicView(t.m).midnight.cards, undefined);
  for (const p of t.m.players) t.cmd(p.name, 'n.ack');
  assert.equal(t.m.phase, 'N_NIGHT');
  assert.equal(t.step(), 'DEATH');
});

test('steps run for cards in the deck, even on the table, and last their full time', () => {
  // The Witch is on the table: the Witch step still runs.
  const t = setup(['DEATH', 'MENTALIST', 'INNOCENT', 'INNOCENT', 'WITCH', 'DEATH', 'GAMBLER']);
  assert.deepEqual(t.m.N.steps, ['DEATH', 'MENTALIST', 'WITCH', 'GAMBLER']);
  t.to('MENTALIST');
  t.cmd('Bo', 'n.act', { target: t.id('Ada') });
  assert.equal(t.step(), 'MENTALIST', 'acting does not end the step');
  assert.equal(playerView(t.m, 'p0').action.type, 'nsleep');
  t.advance();
  assert.equal(t.step(), 'WITCH');
  assert.equal(playerView(t.m, 'p2').action.type, 'nsleep', 'nobody holds the Witch');
});

test('Death sees Death; a lone Death peeks at a table card', () => {
  const two = setup(['DEATH', 'DEATH', 'INNOCENT', 'INNOCENT', 'MENTALIST', 'WITCH', 'GAMBLER']);
  assert.deepEqual(playerView(two.m, 'p0').action.seen[0].cards, [{ seat: 'p1', role: 'DEATH' }]);
  const one = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'DEATH', 'WITCH', 'GAMBLER']);
  assert.equal(playerView(one.m, 'p0').action.kind, 'lonePeek');
  one.cmd('Ada', 'n.act', { table: 'chair2' });
  assert.equal(playerView(one.m, 'p0').action.seen.at(-1).cards[0].role, 'WITCH');
  const off = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'DEATH', 'WITCH', 'GAMBLER'], { settings: { lonePeek: false } });
  assert.equal(playerView(off.m, 'p0').action.kind, 'done');
});

test('the Conspirator sees Death; Twins see each other; the Insomniac sees their card last', () => {
  const t = setup(['DEATH', 'CONSPIRATOR', 'N_TWIN', 'N_TWIN', 'DOUBLE_AGENT', 'N_INSOMNIAC', 'INNOCENT', 'DEATH', 'MENTALIST'], { n: 6 });
  t.to('CONSPIRATOR');
  assert.deepEqual(playerView(t.m, 'p1').action.seen[0].cards, [{ seat: 'p0', role: 'DEATH' }]);
  t.to('N_TWIN');
  assert.deepEqual(playerView(t.m, 'p2').action.seen[0].cards, [{ seat: 'p3', role: 'N_TWIN' }]);
  t.to('DOUBLE_AGENT');
  t.cmd('Ed', 'n.act', { target: t.id('Fay') }); // takes the Insomniac's card
  assert.equal(t.card('Ed'), 'N_INSOMNIAC');
  t.to('N_INSOMNIAC');
  assert.equal(playerView(t.m, 'p5').action.seen[0].cards[0].role, 'DOUBLE_AGENT', 'the Insomniac learns they were robbed');
});

test('Mentalist, Double Agent, Witch and Gambler', () => {
  const t = setup(['MENTALIST', 'DOUBLE_AGENT', 'WITCH', 'GAMBLER', 'DEATH', 'DEATH', 'INNOCENT']);
  t.to('MENTALIST');
  t.cmd('Ada', 'n.act', { tables: ['chair1', 'chair3'] });
  assert.deepEqual(playerView(t.m, 'p0').action.seen[0].cards.map((c) => c.role), ['DEATH', 'INNOCENT']);
  t.to('DOUBLE_AGENT');
  t.cmd('Bo', 'n.act', { target: t.id('Cy') });
  assert.equal(t.card('Bo'), 'WITCH');
  assert.equal(t.card('Cy'), 'DOUBLE_AGENT');
  t.to('WITCH');
  t.cmd('Cy', 'n.act', { targets: [t.id('Ada'), t.id('Di')] }); // Cy was dealt the Witch: still acts
  assert.equal(t.card('Ada'), 'GAMBLER');
  assert.equal(t.card('Di'), 'MENTALIST');
  t.to('GAMBLER');
  assert.equal(playerView(t.m, 'p3').action.kind, 'GAMBLER');
  t.advance(); // timeout: the Gambler must swap at random
  assert.ok(['DEATH', 'INNOCENT'].includes(t.card('Di')));
  assert.equal(t.m.phase, 'N_DAY');
});

test('the Mimic copies a role: an action at once, a waking role in its turn', () => {
  const w = setup(['MIMIC', 'WITCH', 'DEATH', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  assert.equal(w.step(), 'MIMIC');
  w.cmd('Ada', 'n.act', { target: w.id('Bo') });
  assert.equal(w.m.N.mimicAs, 'WITCH');
  assert.equal(playerView(w.m, 'p0').action.kind, 'WITCH');
  w.cmd('Ada', 'n.act', { targets: [w.id('Cy'), w.id('Di')] });
  assert.equal(w.card('Cy'), 'INNOCENT');
  const d = setup(['MIMIC', 'DEATH', 'INNOCENT', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  d.cmd('Ada', 'n.act', { target: d.id('Bo') });
  d.to('DEATH');
  assert.deepEqual(playerView(d.m, 'p0').action.seen.at(-1).cards, [{ seat: 'p1', role: 'DEATH' }]);
  assert.deepEqual(playerView(d.m, 'p1').action.seen[0].cards, [{ seat: 'p0', role: 'DEATH' }]);
});

test('the vote: two votes or more to die, ties all die, the Vigilante takes their target', () => {
  const t = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  t.toDay();
  t.vote({ Ada: 'Bo', Bo: 'Ada', Cy: 'Di', Di: 'Cy' });
  assert.deepEqual(t.m.N.died.sort(), ['p0', 'p1', 'p2', 'p3'].sort().filter(() => false), 'all on one vote: nobody dies');
  const u = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'VIGILANTE', 'DEATH', 'MENTALIST', 'GAMBLER']);
  u.toDay();
  u.vote({ Ada: 'Di', Bo: 'Di', Cy: 'Ada', Di: 'Ada' });
  assert.deepEqual(u.m.N.died.sort(), ['p0', 'p3']);
  const v = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'VIGILANTE', 'DEATH', 'MENTALIST', 'GAMBLER']);
  v.toDay();
  v.vote({ Ada: 'Di', Bo: 'Di', Cy: 'Di', Di: 'Bo' });
  assert.deepEqual(v.m.N.died.sort(), ['p1', 'p3'], 'the Vigilante takes Bo with them');
});

test('who wins: the Living if a Death dies, Death if not, the Jester alone; scores', () => {
  const a = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  a.toDay();
  a.vote({ Ada: 'Bo', Bo: 'Ada', Cy: 'Ada', Di: 'Ada' });
  assert.deepEqual(a.m.N.winners.sides, ['LIVING']);
  assert.deepEqual(a.m.nWinners.sort(), ['p1', 'p2', 'p3']);
  assert.equal(a.m.nScores.p1, 1);
  const b = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  b.toDay();
  b.vote({ Ada: 'Bo', Bo: 'Cy', Cy: 'Bo', Di: 'Bo' });
  assert.deepEqual(b.m.N.winners.sides, ['DEATH']);
  const c = setup(['DEATH', 'JESTER', 'INNOCENT', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  c.toDay();
  c.vote({ Ada: 'Bo', Bo: 'Cy', Cy: 'Bo', Di: 'Bo' });
  assert.deepEqual(c.m.N.winners.sides, ['JESTER']);
  assert.equal(c.m.nScores.p1, 2);
  // No Death among the players: the Living win if nobody dies.
  const d = setup(['INNOCENT', 'INNOCENT', 'MENTALIST', 'WITCH', 'DEATH', 'DEATH', 'GAMBLER']);
  d.toDay();
  d.vote({ Ada: 'Bo', Bo: 'Cy', Cy: 'Di', Di: 'Ada' });
  assert.deepEqual(d.m.N.winners.sides, ['LIVING']);
});

test('cards at dawn decide: a Death swapped away by the Witch is no longer Death', () => {
  const t = setup(['DEATH', 'WITCH', 'INNOCENT', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  t.to('WITCH');
  t.cmd('Bo', 'n.act', { targets: [t.id('Ada'), t.id('Cy')] });
  t.toDay();
  t.vote({ Ada: 'Cy', Bo: 'Cy', Cy: 'Ada', Di: 'Cy' });
  assert.deepEqual(t.m.N.died, ['p2']);
  assert.deepEqual(t.m.N.winners.sides, ['LIVING'], 'Cy holds the Death card at dawn');
  assert.ok(t.m.nWinners.includes('p0'), 'Ada, now an Innocent, wins with the Living');
  const pv = publicView(t.m).midnight;
  assert.equal(pv.dealt.p0, 'DEATH');
  assert.equal(pv.cards.p0, 'INNOCENT');
  assert.ok(pv.timeline.some((e) => e.kind === 'swap'));
});

test('privacy: no cards in any view before the end; night steps look the same to sleepers', () => {
  const t = setup(['DEATH', 'WITCH', 'INNOCENT', 'INNOCENT', 'DEATH', 'MENTALIST', 'GAMBLER']);
  const json = JSON.stringify(playerView(t.m, 'p2'));
  assert.ok(!json.includes('"WITCH"') || !JSON.stringify(playerView(t.m, 'p2').midnight).includes('cards'));
  assert.equal(publicView(t.m).midnight.dealt, undefined);
  assert.deepEqual(Object.keys(playerView(t.m, 'p2').action).sort(), ['role', 'type']);
  assert.deepEqual(Object.keys(playerView(t.m, 'p3').action).sort(), ['role', 'type']);
});

test('setup: 4–12 players; a custom deck needs Death, paired Twins and players + 3 cards', () => {
  const m = newMatch({ id: 'n', code: 'N', hostId: 'p0' });
  for (let i = 0; i < 4; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  m.players.forEach((p) => { p.ready = true; });
  updateSettings(m, { mode: 'midnight' });
  assert.equal(setupReport(m).ok, true);
  updateSettings(m, { n: { deck: 'custom', pool: ['INNOCENT', 'INNOCENT', 'MENTALIST', 'WITCH', 'GAMBLER', 'JESTER', 'CONSPIRATOR'] } });
  assert.equal(setupReport(m).ok, false, 'no Death');
  updateSettings(m, { n: { pool: ['DEATH', 'N_TWIN', 'MENTALIST', 'WITCH', 'GAMBLER', 'JESTER', 'CONSPIRATOR'] } });
  assert.equal(setupReport(m).ok, false, 'a lone Twin');
  updateSettings(m, { n: { pool: ['DEATH', 'DEATH', 'DEATH', 'MENTALIST', 'WITCH', 'GAMBLER', 'JESTER', 'CONSPIRATOR'] } });
  assert.equal(m.settings.n.pool.filter((x) => x === 'DEATH').length, 2, 'at most two Deaths');
  assert.equal(setupReport(m).ok, true);
});

test('bots play whole games to the end at 4 and 12 players', () => {
  for (const n of [4, 12]) {
    for (let g = 0; g < 4; g++) {
      const rng = seededRng(g + n * 7);
      const m = newMatch({ id: 'b', code: 'B', hostId: 'p0' });
      for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i], bot: true });
      updateSettings(m, { mode: 'midnight' });
      m.players.forEach((p) => { p.ready = true; });
      let now = 1e6;
      startMatch(m, rng, now);
      for (let guard = 0; m.phase !== 'ENDED' && guard < 2000; guard++) {
        let acted = false;
        for (const p of m.players) {
          const d = botDecide(m, p.id, rng);
          if (d?.cmd) { try { playerCommand(m, p.id, { ...d.cmd, phaseId: m.phaseId }, rng, (now += 10)); acted = true; } catch { /* stale */ } }
          if (m.phase === 'ENDED') break;
        }
        if (!acted && m.phase !== 'ENDED') hostAdvance(m, rng, (now += 10));
      }
      assert.equal(m.phase, 'ENDED', `${n} players, game ${g}`);
      assert.ok(m.N.winners);
    }
  }
});
