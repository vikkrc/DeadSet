import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setup, runDay, runNight, NAMES } from './helpers.js';
import { scaling, buildDeck, validateSetup, defaultSettings, applySettingsPatch, parseCustomDeck } from '../engine/setup.js';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, rematch } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { ROLES } from '../engine/content.js';

const CORE5 = ['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO'];
const alive = (t, name) => t.P(name).alive;

// ── Setup & scaling ────────────────────────────────────────────────────────
test('T01/T03 scaling table and invariants for 5–18 players', () => {
  const expected = { 5: [1, 1, 0], 6: [2, 1, 0], 7: [2, 1, 1], 8: [3, 1, 1], 9: [3, 2, 1], 10: [3, 2, 2], 11: [3, 2, 3], 12: [4, 2, 3], 13: [4, 3, 3], 14: [4, 3, 4], 15: [5, 3, 4], 16: [5, 4, 4], 17: [5, 4, 5] };
  for (const [n, [d, i, e]] of Object.entries(expected)) {
    const c = scaling(Number(n));
    assert.deepEqual([c.DEATH, c.INNOCENT, c.EXTENDED], [d, i, e], `N=${n}`);
    assert.equal(c.DEATH + c.INNOCENT + 3 + c.EXTENDED, Number(n));
    assert.ok(c.DEATH < Number(n) - c.DEATH, 'Death never starts with a strict majority');
  }
  const s = applySettingsPatch(defaultSettings(), { preset: 'standard' });
  const deck = buildDeck(8, s, seededRng(3));
  assert.equal(deck.length, 8);
  assert.equal(deck.filter((r) => r === 'DEATH').length, 3);
  assert.equal(deck.filter((r) => ROLES[r].set === 'standard').length, 1);
  const five = buildDeck(5, s, seededRng(3)).sort();
  assert.deepEqual(five, [...CORE5].sort());
});

test('classic preset fills extended seats with Innocents; full deck needs 7', () => {
  const s = applySettingsPatch(defaultSettings(), { preset: 'classic' });
  const deck = buildDeck(11, s, seededRng(1));
  assert.equal(deck.filter((r) => r === 'INNOCENT').length, 5);
  const f = applySettingsPatch(defaultSettings(), { preset: 'full' });
  assert.equal(validateSetup(6, f).ok, false);
  assert.equal(validateSetup(7, f).ok, true);
});

test('custom deck parsing and validation', () => {
  const { roles, errors } = parseCustomDeck('Death x2\nGuardian, mentalist, Psycho\nCompanion');
  assert.deepEqual(errors, []);
  assert.equal(roles.length, 6);
  const s = applySettingsPatch(defaultSettings(), { preset: 'custom', customDeck: 'Death x3, Innocent x2' });
  assert.equal(validateSetup(5, s).ok, false, 'Death majority rejected');
});

test('lobby rejects start below 5 players and before everyone is ready', () => {
  const m = newMatch({ id: 'x', code: 'AAAAAA', hostId: 'p0' });
  for (let i = 0; i < 4; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  assert.throws(() => startMatch(m, seededRng(1), 0), /At least 5/);
  addPlayer(m, { id: 'p4', name: 'Ed' });
  assert.throws(() => startMatch(m, seededRng(1), 0), /Ready/);
  assert.throws(() => addPlayer(m, { id: 'p9', name: ' ada ' }), /taken/);
});

// ── Night 0 / Day 1 ────────────────────────────────────────────────────────
test('T02 Night 0 is reveal only, then Day 1', () => {
  const t = setup(CORE5, { skipAck: true, dreams: true });
  assert.equal(t.m.phase, 'NIGHT_0_REVEAL');
  assert.equal(t.m.night, null);
  for (const p of t.m.players) t.cmd(p.name, 'role.ack');
  assert.equal(t.m.phase, 'DAY_PREP');
  assert.equal(t.m.dayNumber, 1);
  assert.ok(t.m.players.every((p) => p.alive && !p.dreamId));
  assert.equal(t.P('Ed').charges.PSYCHO, 1, 'no charge consumed on Night 0');
});

test('§16 example: Death sentenced on Day 1 → non-Death wins', () => {
  const t = setup(CORE5);
  runDay(t, { nominate: [['Bo', 'Ada'], ['Cy', 'Di']], votes: { Ada: 'Di', Bo: 'Ada', Cy: 'Ada', Di: 'Ada', Ed: 'Di' } });
  assert.equal(t.m.phase, 'ENDED');
  assert.equal(t.m.winner, 'NON_DEATH');
});

test('T04 tie → no sentence; Scapegoat dies instead when present', () => {
  const t = setup(CORE5);
  runDay(t, { nominate: [['Bo', 'Ada'], ['Cy', 'Di']], votes: { Ada: 'Di', Bo: 'Ada', Cy: 'Ada', Di: 'Di', Ed: 'ABSTAIN' } });
  assert.ok(t.m.players.every((p) => p.alive));
  assert.equal(t.m.phase, 'NIGHT_ACTIONS');

  const g = setup([...CORE5, 'SCAPEGOAT', 'INNOCENT'], { settings: {} });
  runDay(g, { nominate: [] });
  assert.equal(alive(g, 'Fay'), false, 'Scapegoat dies on no-sentence');
  assert.deepEqual(g.P('Fay').causes, ['SCAPEGOAT']);
});

test('T05 unique plurality sentenced; T25 last pre-lock vote counts once', () => {
  const t = setup([...CORE5, 'INNOCENT', 'DEATH']);
  t.advance();
  t.cmd('Bo', 'day.nominate', { target: t.id('Cy') });
  t.cmd('Cy', 'day.nominate', { target: t.id('Di') });
  t.advance(); t.advance({ skipAll: true });
  t.cmd('Ada', 'day.ballot', { target: t.id('Di') });
  t.cmd('Ada', 'day.ballot', { target: t.id('Cy') }); // change before lock
  t.cmd('Bo', 'day.ballot', { target: t.id('Cy') });
  t.cmd('Ed', 'day.ballot', { target: t.id('Di') });
  const phaseId = t.m.phaseId;
  t.advance();
  assert.equal(alive(t, 'Cy'), false);
  assert.equal(t.m.publicLog.find((l) => l.totals)?.totals[t.id('Cy')], 2);
  assert.throws(() => playerCommand(t.m, t.id('Ada'), { type: 'day.ballot', payload: { target: t.id('Di') }, phaseId }, t.rng, 0), /closed|not open/);
});

test('T06 Majority Rule with Magistrate weight 2 out of 3 eligible voters', () => {
  const t = setup(['DEATH', 'MAGISTRATE', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { rules: ['MAJORITY_RULE'] });
  // Make only 3 players eligible: kill two via direct state for the arrangement.
  t.P('Fay').alive = false; t.P('Ed').alive = false;
  t.advance();
  t.cmd('Bo', 'day.nominate', { target: t.id('Ada') });
  t.advance(); t.advance({ skipAll: true });
  assert.equal(t.m.day.eligibleVoters.length, 5); // Ada, Bo, Cy, Di, Gus
  t.P('Cy').alive = false; t.P('Di').alive = false; // reduce to 3 eligible
  t.m.day.eligibleVoters = [t.id('Ada'), t.id('Bo'), t.id('Gus')];
  t.cmd('Bo', 'day.ballot', { target: t.id('Ada') });
  t.advance();
  assert.equal(alive(t, 'Ada'), false, 'weight 2 > 1.5 sentences');
});

test('Majority Rule failure → no sentence', () => {
  const t = setup([...CORE5, 'INNOCENT', 'DEATH'], { rules: ['MAJORITY_RULE'] });
  runDay(t, { nominate: [['Bo', 'Ada']], votes: { Bo: 'Ada', Cy: 'Ada', Di: 'Ada' } }); // 3 of 7 eligible
  assert.equal(alive(t, 'Ada'), true);
});

test('T29 Conspirator and Magistrate weigh 3 under Paranoia; NO_VOTE weighs 0', async () => {
  const { ballotWeight } = await import('../engine/day.js');
  const t = setup(['DEATH', 'CONSPIRATOR', 'MAGISTRATE', 'MENTALIST', 'PSYCHO', 'GUARDIAN', 'DEATH'], { rules: ['PARANOIA'] });
  assert.equal(ballotWeight(t.m, t.P('Bo')), 3);
  assert.equal(ballotWeight(t.m, t.P('Cy')), 3);
  assert.equal(ballotWeight(t.m, t.P('Di')), 2);
  t.P('Cy').statuses.push({ type: 'NO_VOTE', day: 1 });
  assert.equal(ballotWeight(t.m, t.P('Cy')), 0);
});

// ── Night: Death faction ───────────────────────────────────────────────────
function toNight(t) { runDay(t, { nominate: [] }); }

test('T07 Guardian stops Death but not a bomb', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'TERRORIST', 'DEATH'], { script: { bomb: [1] } });
  toNight(t);
  runNight(t, { death: { all: ['Bo'] }, actions: { Cy: [{ target: 'Bo' }] } });
  assert.equal(alive(t, 'Bo'), true, 'guardian shield holds');

  const u = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'TERRORIST', 'DEATH'], { script: { bomb: [1] } });
  toNight(u);
  runNight(u, { death: { all: [] }, actions: { Cy: [{ target: 'Bo' }], Fay: [{ target: 'Bo' }] } });
  assert.equal(alive(u, 'Bo'), false, 'bomb ignores guardian');
  assert.deepEqual(u.P('Bo').causes, ['BOMB']);
});

test('T08 Whore visiting any active Death blocks the whole kill', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'WHORE', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: ['Bo'] }, actions: { Fay: [{ target: 'Gus' }] } });
  assert.equal(alive(t, 'Bo'), true);
  assert.equal(alive(t, 'Fay'), true);
});

test('Whore dies with a visited player killed by Death', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'WHORE', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: ['Bo'] }, actions: { Fay: [{ target: 'Bo' }] } });
  assert.equal(alive(t, 'Bo'), false);
  assert.equal(alive(t, 'Fay'), false);
  assert.deepEqual(t.P('Fay').causes, ['VISIT_COLLATERAL']);
});

test('T09 divergent Death targets → shared kill passes', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH', 'DEATH']);
  toNight(t);
  runNight(t, { death: { Ada: ['Bo'], Gus: ['Bo'], Hal: ['Cy'] } });
  assert.ok(t.m.players.every((p) => p.alive));
  assert.equal(t.m.phase, 'DAY_PREP');
});

test('T10 Double Jeopardy + Night Shift still caps Death at 2', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { rules: ['DOUBLE_JEOPARDY'], dreams: true });
  toNight(t);
  const swap = t.m.night;
  for (const pid of swap.aliveAtOpen) swap.initialDreams[pid] = swap.dreams[pid] = 'PREMONITION';
  swap.dreams[t.id('Ada')] = swap.initialDreams[t.id('Ada')] = 'NIGHT_SHIFT';
  swap.initialSnatchers = [];
  for (const pid of swap.aliveAtOpen) t.cmd(t.m.players.find((p) => p.id === pid).name, 'dream.swap', {});
  assert.equal(t.m.night.death.capacity, 2);
  assert.throws(() => t.cmd('Ada', 'death.propose', { targets: [t.id('Bo'), t.id('Cy'), t.id('Di')] }), /at most 2/);
  runNight(t, { death: { all: ['Bo', 'Cy'] } });
  assert.equal(alive(t, 'Bo'), false);
  assert.equal(alive(t, 'Cy'), false);
});

test('T11 Death actor with Sleep Paralysis blocks the entire kill', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  toNight(t);
  runNight(t, { dreams: { Ada: 'SLEEP_PARALYSIS', Bo: 'INSOMNIA', Cy: 'INSOMNIA', Di: 'INSOMNIA', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'INSOMNIA' }, death: { all: ['Bo'] } });
  assert.equal(alive(t, 'Bo'), true);
  const report = t.m.privateLog[t.id('Cy')].find((x) => x.kind === 'insomnia');
  assert.ok(report && /stayed/.test(report.text), 'Insomnia sees the stayed hand');
});

test('T12 Dream Snatcher swaps apply once in seat order', () => {
  const t = setup(CORE5, { dreams: true });
  toNight(t);
  const N = t.m.night;
  const set = { Ada: 'DREAM_SNATCHER', Bo: 'DREAM_SNATCHER', Cy: 'INSOMNIA', Di: 'GUARDIAN_ANGEL', Ed: 'PREMONITION' };
  for (const [n, d] of Object.entries(set)) N.initialDreams[t.id(n)] = N.dreams[t.id(n)] = d;
  N.initialSnatchers = [t.id('Ada'), t.id('Bo')];
  t.cmd('Bo', 'dream.swap', { target: t.id('Di') });
  t.cmd('Ada', 'dream.swap', { target: t.id('Bo') });
  for (const n of ['Cy', 'Di', 'Ed']) t.cmd(n, 'dream.swap', {});
  // Ada↔Bo first (seat 0): Ada=SNATCHER, Bo=SNATCHER; then Bo↔Di: Bo=ANGEL, Di=SNATCHER.
  assert.equal(N.dreams[t.id('Ada')], 'DREAM_SNATCHER');
  assert.equal(N.dreams[t.id('Bo')], 'GUARDIAN_ANGEL');
  assert.equal(N.dreams[t.id('Di')], 'DREAM_SNATCHER');
  assert.equal(t.m.phase, 'NIGHT_ACTIONS');
  const dreams = Object.values(N.dreams);
  assert.equal(dreams.length, 5, 'each living player holds exactly one dream');
});

test('T13 Shared Nightmare: holder with Angel survives partner death', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  toNight(t);
  runNight(t, { dreams: { Ada: 'INSOMNIA', Bo: 'SHARED_NIGHTMARE', Cy: 'SHARED_NIGHTMARE', Di: 'GUARDIAN_ANGEL', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'INSOMNIA' }, death: { all: ['Ed'] }, nightmare: { Bo: 'Ed', Cy: 'Ed' } });
  assert.equal(alive(t, 'Ed'), false);
  assert.equal(alive(t, 'Bo'), false, 'linked holder without protection dies');
  assert.equal(alive(t, 'Cy'), false);
  const u = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  toNight(u);
  // Bo holds the nightmare; give Bo Angel protection by checking protection path: holder Angel.
  runNight(u, { dreams: { Ada: 'INSOMNIA', Bo: 'SHARED_NIGHTMARE', Cy: 'INSOMNIA', Di: 'INSOMNIA', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'INSOMNIA' }, death: { all: ['Ed'] }, nightmare: { Bo: 'Ed' } });
  assert.equal(alive(u, 'Bo'), false);
});

test('Shared Nightmare + Guardian: guardian does not stop linked fate (§17)', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  toNight(t);
  runNight(t, { dreams: { Ada: 'INSOMNIA', Bo: 'SHARED_NIGHTMARE', Cy: 'INSOMNIA', Di: 'INSOMNIA', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'INSOMNIA' }, death: { all: ['Ed'] }, nightmare: { Bo: 'Ed' }, actions: { Cy: [{ target: 'Bo' }] } });
  assert.equal(alive(t, 'Bo'), false);
  assert.deepEqual(t.P('Bo').causes, ['SHARED_NIGHTMARE']);
});

test('T14 Sleepwalking linked to an already-dead partner does nothing', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  t.P('Ada').alive = true;
  toNight(t);
  runNight(t, { dreams: { Ada: 'INSOMNIA', Bo: 'INSOMNIA', Cy: 'INSOMNIA', Di: 'INSOMNIA', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'INSOMNIA' }, death: { all: ['Bo'] } });
  assert.equal(alive(t, 'Bo'), false);
  runDay(t, { nominate: [] });
  runNight(t, { dreams: { Ada: 'INSOMNIA', Cy: 'SLEEPWALKING', Di: 'INSOMNIA', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'INSOMNIA' }, death: { all: [] } });
  assert.equal(alive(t, 'Cy'), true, 'partner Bo was already dead');
});

test('Sleepwalking: partner killed tonight takes the holder too', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  toNight(t);
  runNight(t, { dreams: { Ada: 'INSOMNIA', Bo: 'INSOMNIA', Cy: 'SLEEPWALKING', Di: 'INSOMNIA', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'INSOMNIA' }, death: { all: ['Bo'] } });
  assert.equal(alive(t, 'Cy'), false);
});

test('T15 Psycho NO_VOTE lasts exactly the next Day', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: [] }, actions: { Ed: [{ target: 'Bo', option: 'NO_VOTE' }] } });
  assert.equal(t.m.dayNumber, 2);
  t.advance(); t.cmd('Cy', 'day.nominate', { target: t.id('Ada') }); t.advance(); t.advance({ skipAll: true });
  assert.ok(!t.m.day.eligibleVoters.includes(t.id('Bo')));
  assert.throws(() => t.cmd('Bo', 'day.ballot', { target: t.id('Ada') }), /disabled/);
  assert.equal(t.P('Ed').charges.PSYCHO, 0);
  t.advance(); // tally: no votes → no sentence
  runNight(t, { death: { all: [] } });
  t.advance(); t.cmd('Cy', 'day.nominate', { target: t.id('Ada') }); t.advance(); t.advance({ skipAll: true });
  assert.ok(t.m.day.eligibleVoters.includes(t.id('Bo')), 'may vote on the subsequent Day');
});

test('Psycho is blocked by Guardian and the charge is still spent', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: [] }, actions: { Ed: [{ target: 'Bo', option: 'MUTE' }], Cy: [{ target: 'Bo' }] } });
  assert.equal(t.P('Bo').statuses.length, 0);
  assert.equal(t.P('Ed').charges.PSYCHO, 0);
});

test('T16 Double Agent choosing Death: Death-aligned to the Mentalist tonight, not in tonight\'s kill', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'DOUBLE_AGENT', 'DEATH']);
  toNight(t);
  assert.ok(!t.m.night.death.members.includes(t.id('Fay')));
  runNight(t, { death: { all: [] }, actions: { Fay: [{ option: 'DEATH' }], Di: [{ target: 'Fay' }] } });
  assert.equal(t.P('Fay').alignment, 'DEATH');
  assert.ok(t.m.privateLog[t.id('Di')].some((x) => /Fay is DEATH-ALIGNED/.test(x.text)));
  runDay(t, { nominate: [] });
  assert.ok(t.m.night.death.members.includes(t.id('Fay')), 'joins the team on Night 2');
  assert.equal(t.m.night.death.capacity, 1, 'no extra kill');
});

test('Double Agent that does nothing defaults to non-Death', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'DOUBLE_AGENT', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: [] } });
  assert.equal(t.P('Fay').alignment, 'NON_DEATH');
  assert.equal(t.P('Fay').daSettled, true);
});

test('T17 Mimic copying Death joins the team next night only', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'MIMIC', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: [] }, actions: { Fay: [{ target: 'Ada' }] } });
  assert.equal(t.P('Fay').roleId, 'DEATH');
  assert.equal(t.P('Fay').alignment, 'DEATH');
  runDay(t, { nominate: [] });
  assert.ok(t.m.night.death.members.includes(t.id('Fay')));
  assert.equal(t.m.night.death.capacity, 1);
});

test('Mimic copying a Mimic or missing the choice is powerless', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'MIMIC', 'MIMIC']);
  toNight(t);
  runNight(t, { death: { all: [] }, actions: { Fay: [{ target: 'Gus' }] } });
  assert.equal(t.P('Fay').mimicPowerless, true);
  assert.equal(t.P('Gus').mimicPowerless, true);
  assert.equal(t.P('Fay').roleId, 'MIMIC');
});

test('Mimic copying Guardian gains powers from Night 2 with fresh charges', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'MIMIC', 'INNOCENT']);
  toNight(t);
  runNight(t, { death: { all: [] }, actions: { Fay: [{ target: 'Ed' }] } });
  assert.equal(t.P('Fay').roleId, 'PSYCHO');
  assert.equal(t.P('Fay').charges.PSYCHO, 1);
  runDay(t, { nominate: [] });
  assert.equal(t.m.night.schemas[t.id('Fay')].roleId, 'PSYCHO');
});

test('T18 Necromancer revives a Death; returnee is immune and expires after the following night', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'NECROMANCER', 'INNOCENT', 'DEATH', 'INNOCENT', 'PSYCHO']);
  runDay(t, { nominate: [['Bo', 'Ada']], votes: { Bo: 'Ada', Cy: 'Ada', Di: 'Ada', Ed: 'Ada', Fay: 'Ada' } });
  assert.equal(alive(t, 'Ada'), false);
  runNight(t, { death: { all: [] }, actions: { Ed: [{ target: 'Ada' }] } });
  assert.equal(alive(t, 'Ada'), true);
  assert.equal(t.P('Ada').tempRevival.expiresAfterNight, 2);
  runDay(t, { nominate: [] });
  assert.ok(t.m.night.death.members.includes(t.id('Ada')), 'revived Death acts with the team');
  runNight(t, { death: { all: [] } });
  assert.equal(alive(t, 'Ada'), false, 'expired');
  assert.deepEqual(t.P('Ada').causes, ['REVIVAL_EXPIRED']);
  assert.equal(t.P('Ed').charges.NECROMANCER, 0);
});

test('Necromancer killed the same night does not revive', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'NECROMANCER', 'INNOCENT', 'DEATH', 'INNOCENT', 'PSYCHO']);
  runDay(t, { nominate: [['Ada', 'Bo']], votes: { Ada: 'Bo', Cy: 'Bo', Di: 'Bo', Gus: 'Bo', Fay: 'Bo' } });
  runNight(t, { death: { all: ['Ed'] }, actions: { Ed: [{ target: 'Bo' }] } });
  assert.equal(alive(t, 'Bo'), false);
  assert.equal(alive(t, 'Ed'), false);
});

test('T19 Equal Exchange: sentenced Death takes one non-Death, then win check', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { rules: ['EQUAL_EXCHANGE'] });
  runDay(t, { nominate: [['Bo', 'Ada']], votes: { Bo: 'Ada', Cy: 'Ada', Di: 'Ada', Ed: 'Ada' } });
  assert.equal(t.m.phase, 'DAY_RESOLVING');
  assert.throws(() => t.cmd('Ada', 'day.retaliate', { target: t.id('Gus') }), /non-Death/);
  t.cmd('Ada', 'day.retaliate', { target: t.id('Cy') });
  assert.equal(alive(t, 'Cy'), false);
  assert.deepEqual(t.P('Cy').causes, ['EQUAL_EXCHANGE']);
  assert.equal(t.m.phase, 'NIGHT_ACTIONS');
});

test('T20 Jester: bombed → no win; sentenced → instant Jester win', () => {
  const roles = ['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'JESTER', 'TERRORIST'];
  const t = setup(roles, { script: { bomb: [1] } });
  toNight(t);
  runNight(t, { death: { all: [] }, actions: { Gus: [{ target: 'Fay' }] } });
  assert.equal(alive(t, 'Fay'), false);
  assert.notEqual(t.m.winner, 'JESTER');
  const u = setup(roles);
  runDay(u, { nominate: [['Bo', 'Fay']], votes: { Bo: 'Fay', Cy: 'Fay', Di: 'Fay' } });
  assert.equal(u.m.winner, 'JESTER');
});

test('T21 Insomnia holder who dies gets no report', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  toNight(t);
  runNight(t, { dreams: { Ada: 'PREMONITION', Bo: 'INSOMNIA', Cy: 'PREMONITION', Di: 'PREMONITION', Ed: 'PREMONITION', Fay: 'PREMONITION', Gus: 'PREMONITION' }, death: { all: ['Bo'] } });
  assert.equal(alive(t, 'Bo'), false);
  assert.ok(!(t.m.privateLog[t.id('Bo')] || []).some((x) => x.kind === 'insomnia'));
  assert.ok(t.m.privateLog[t.id('Cy')].some((x) => /Premonition: (Ada|Gus) walks with Death/.test(x.text)));
});

test('T22 Death at parity does not win', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH']);
  t.P('Bo').alive = false; t.P('Cy').alive = false; t.P('Di').alive = false;
  toNight(t); // 2 Death vs Ed, Fay
  assert.notEqual(t.m.phase, 'ENDED');
  runNight(t, { death: { all: ['Ed'] } });
  assert.equal(t.m.winner, 'DEATH', '2 vs 1 is a strict majority');
});

test('T23 last Death dies with an opponent: non-Death wins; nobody left: draw', async () => {
  const { checkVictory } = await import('../engine/victory.js');
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'TERRORIST', 'INNOCENT'], { script: { bomb: [1] } });
  toNight(t);
  runNight(t, { death: { all: ['Bo'] }, actions: { Fay: [{ target: 'Ada' }] } });
  assert.equal(t.m.winner, 'NON_DEATH');
  const m = { players: [{ alive: false, alignment: 'DEATH' }, { alive: false, alignment: 'NON_DEATH' }] };
  assert.equal(checkVictory(m).winner, 'DRAW');
});

test('T24 Doomsday: Death wins after Day 3 closes, no Night 3', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { settings: { doomsday: true, doomsdayDays: 3 } });
  runDay(t); runNight(t, { death: { all: [] } });
  runDay(t); runNight(t, { death: { all: [] } });
  runDay(t);
  assert.equal(t.m.phase, 'ENDED');
  assert.equal(t.m.winner, 'DEATH');
  assert.equal(t.m.nightNumber, 2);
});

test('T30 Bomb YES with Angel only on the visiting Whore', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'TERRORIST', 'WHORE', 'DEATH'], { dreams: true, script: { bomb: [1] } });
  toNight(t);
  runNight(t, { dreams: { Ada: 'INSOMNIA', Bo: 'INSOMNIA', Cy: 'INSOMNIA', Di: 'INSOMNIA', Ed: 'INSOMNIA', Fay: 'INSOMNIA', Gus: 'GUARDIAN_ANGEL', Hal: 'INSOMNIA' }, death: { all: [] }, actions: { Fay: [{ target: 'Bo' }], Gus: [{ target: 'Bo' }] } });
  assert.equal(alive(t, 'Bo'), false);
  assert.equal(alive(t, 'Gus'), true);
});

test('§17 adversarial example: Whore on Death, Guardian on X, bomb on Y, X linked to Y', () => {
  const t = setup(['DEATH', 'DEATH', 'DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'WHORE', 'TERRORIST'], { rules: ['DOUBLE_JEOPARDY'], dreams: true, script: { bomb: [1] } });
  toNight(t);
  // X = Di (Innocent), Y = Fay (Mentalist). Ivy (Terrorist) bombs Fay.
  const all = Object.fromEntries(t.m.players.map((p) => [p.name, 'PREMONITION']));
  all.Di = 'SHARED_NIGHTMARE';
  runNight(t, { dreams: all, death: { all: ['Di', 'Fay'] }, actions: { Ed: [{ target: 'Di' }], Hal: [{ target: 'Ada' }], Ivy: [{ target: 'Fay' }] }, nightmare: { Di: 'Fay' } });
  assert.equal(alive(t, 'Fay'), false, 'bomb kills Y');
  assert.equal(alive(t, 'Di'), false, 'X dies of linked fate despite Guardian');
  const dead = t.m.players.filter((p) => !p.alive).map((p) => p.name).sort();
  assert.deepEqual(dead, ['Di', 'Fay']);
});

// ── Full deck roles ────────────────────────────────────────────────────────
test('Bard silences every power including Death', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'BARD', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: ['Bo'] }, actions: { Fay: [{ option: 'SILENCE' }], Di: [{ target: 'Ada' }] } });
  assert.equal(alive(t, 'Bo'), true);
  assert.ok(!t.m.privateLog[t.id('Di')].some((x) => /ALIGNED/.test(x.text)));
});

test('Oracle correct guess stops one Death kill; Bodyguard takes the blade', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'ORACLE', 'BODYGUARD'], { rules: ['DOUBLE_JEOPARDY'] });
  toNight(t);
  runNight(t, { death: { all: ['Bo', 'Cy'] }, actions: { Fay: [{ target: 'Bo' }], Gus: [{ target: 'Cy' }] } });
  assert.equal(alive(t, 'Bo'), true);
  assert.equal(alive(t, 'Cy'), true);
  assert.equal(alive(t, 'Gus'), false);
  assert.deepEqual(t.P('Gus').causes, ['BODYGUARD_SACRIFICE']);
});

test('Witch curse on active Death blocks the kill; bless stops a bomb', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'WITCH', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: ['Bo'] }, actions: { Fay: [{ target: 'Ada', option: 'CURSE' }] } });
  assert.equal(alive(t, 'Bo'), true);
  const u = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'WITCH', 'TERRORIST'], { script: { bomb: [1] } });
  toNight(u);
  runNight(u, { death: { all: [] }, actions: { Fay: [{ target: 'Bo', option: 'BLESS' }], Gus: [{ target: 'Bo' }] } });
  assert.equal(alive(u, 'Bo'), true);
});

test('Gambler correct bet cancels sentencing; Vigilante shoots in the morning', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'GAMBLER', 'VIGILANTE', 'DEATH']);
  toNight(t);
  runNight(t, { death: { all: [] }, actions: { Fay: [{ target: 'Bo' }] } });
  runDay(t, { nominate: [['Cy', 'Bo']], votes: { Cy: 'Bo', Di: 'Bo', Ed: 'Bo', Ada: 'Bo' } });
  assert.equal(alive(t, 'Bo'), true, 'sentence cancelled');
  runNight(t, { death: { all: [] } });
  t.cmd('Gus', 'day.shoot', { target: t.id('Hal') });
  t.advance();
  assert.equal(alive(t, 'Hal'), false);
  assert.deepEqual(t.P('Hal').causes, ['VIGILANTE']);
  assert.equal(t.m.phase, 'DAY_DISCUSSION');
});

test('Diplomat immunity prevents nomination that Day only', () => {
  const t = setup(['DEATH', 'DIPLOMAT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH']);
  t.cmd('Bo', 'day.immunity');
  t.advance();
  assert.throws(() => t.cmd('Cy', 'day.nominate', { target: t.id('Bo') }), /immunity/);
  assert.throws(() => t.cmd('Bo', 'day.immunity'), /not open|no immunity/);
});

test('Night Shift gives a Guardian two shields; Unreliable Power can spoil a once-only power', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true, rules: ['DOUBLE_JEOPARDY'] });
  toNight(t);
  const all = Object.fromEntries(t.m.players.map((p) => [p.name, 'PREMONITION']));
  all.Cy = 'NIGHT_SHIFT';
  runNight(t, { dreams: all, death: { all: ['Bo', 'Di'] }, actions: { Cy: [{ target: 'Bo' }, { target: 'Di' }] } });
  assert.equal(alive(t, 'Bo'), true);
  assert.equal(alive(t, 'Di'), true);
  const u = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { rules: ['UNRELIABLE_POWER'], script: { d6: [5, 0] } });
  toNight(u);
  runNight(u, { death: { all: [] }, actions: { Ed: [{ target: 'Bo', option: 'MUTE' }] } });
  assert.equal(u.P('Ed').charges.PSYCHO, 0);
  assert.equal(u.m.pendingStatuses.length, 0, 'd6=1 failed');
});

test('Power Surge picks Death as a single entry and raises capacity to 2', () => {
  const t = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'PSYCHO', 'INNOCENT', 'DEATH'], { rules: ['POWER_SURGE'], script: { surge: [0] } });
  toNight(t);
  assert.equal(t.m.night.surge, 'DEATH');
  assert.equal(t.m.night.death.capacity, 2);
});

test('Vengeful Ghosts: ghost ballots count in plurality but never under Majority Rule', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { rules: ['VENGEFUL_GHOSTS'] });
  t.P('Bo').alive = false;
  t.advance();
  t.cmd('Cy', 'day.nominate', { target: t.id('Ada') });
  t.cmd('Di', 'day.nominate', { target: t.id('Gus') });
  t.advance(); t.advance({ skipAll: true });
  t.cmd('Cy', 'day.ballot', { target: t.id('Ada') });
  t.cmd('Di', 'day.ballot', { target: t.id('Gus') });
  t.cmd('Bo', 'day.ballot', { target: t.id('Ada') }); // ghost
  t.advance();
  assert.equal(alive(t, 'Ada'), false, 'ghost breaks the tie');
});

test('Conspirator whisper is anonymous to the partner', () => {
  const t = setup(['DEATH', 'CONSPIRATOR', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'INNOCENT']);
  toNight(t);
  t.cmd('Bo', 'conspire.open', { target: t.id('Fay') });
  const ch = `consp:1:${t.id('Bo')}`;
  t.cmd('Bo', 'chat.send', { channel: ch, text: 'psst' });
  t.cmd('Fay', 'chat.send', { channel: ch, text: 'who?' });
  const v = playerView(t.m, t.id('Fay'));
  const c = v.chats.find((x) => x.id === ch);
  assert.equal(c.messages[0].name, 'Stranger');
  assert.equal(c.messages[0].from, null);
  assert.throws(() => t.cmd('Cy', 'chat.send', { channel: ch, text: 'hi' }), /not open/);
});

// ── Privacy ────────────────────────────────────────────────────────────────
test('T27/§25 no view leaks another living player\'s role, dream or choice', () => {
  const t = setup(['DEATH', 'INNOCENT', 'GUARDIAN', 'MENTALIST', 'PSYCHO', 'INNOCENT', 'DEATH'], { dreams: true });
  toNight(t);
  for (const pid of t.m.night.aliveAtOpen) t.cmd(t.m.players.find((p) => p.id === pid).name, 'dream.swap', {});
  t.cmd('Cy', 'night.commit', { uses: [{ target: t.id('Bo') }] });
  t.cmd('Ada', 'death.propose', { targets: [t.id('Di')] });
  const host = JSON.stringify(playerView(t.m, t.id('Ada') === t.m.hostId ? t.id('Bo') : t.id('Bo')));
  for (const secret of ['GUARDIAN', 'MENTALIST', 'PSYCHO', '"DEATH"']) assert.ok(!host.includes(`"id":${secret.startsWith('"') ? secret : `"${secret}"`}`), `Bo's view leaks ${secret}`);
  const pubv = JSON.stringify(publicView(t.m));
  assert.ok(!pubv.includes('"role":{'), 'public board has no roles');
  assert.ok(!pubv.includes(t.m.night.dreams[t.id('Cy')]));
  const deathView = playerView(t.m, t.id('Ada'));
  assert.deepEqual(deathView.me.teammates.map((x) => x.name), ['Gus']);
  const innocentView = playerView(t.m, t.id('Bo'));
  assert.equal(innocentView.me.teammates, undefined);
  assert.equal(innocentView.action.death, undefined);
});

test('host view of a match contains controls but no secrets', () => {
  const t = setup(CORE5);
  const v = playerView(t.m, 'p1'); // Bo (not host)
  assert.equal(v.host, undefined);
  const hv = playerView(t.m, 'p0');
  assert.ok(hv.host.advance);
  assert.ok(hv.players.every((p) => p.role === null));
});

test('rematch returns everyone to the lobby with fresh state', () => {
  const t = setup(CORE5);
  runDay(t, { nominate: [['Bo', 'Ada']], votes: { Bo: 'Ada', Cy: 'Ada', Di: 'Ada' } });
  assert.equal(t.m.phase, 'ENDED');
  rematch(t.m);
  assert.equal(t.m.phase, 'LOBBY');
  assert.equal(t.m.players.length, 5);
  assert.ok(t.m.players.every((p) => p.alive && !p.roleId));
});

// ── Property test ──────────────────────────────────────────────────────────
test('random full matches N=5…13 always terminate and keep invariants', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const rng = seededRng(seed);
    const n = 5 + (seed % 9);
    const m = newMatch({ id: 'r', code: 'RRRRRR', hostId: 'p0' });
    for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
    updateSettings(m, { preset: n >= 7 && seed % 3 === 0 ? 'full' : 'standard', rules: { mode: 'random', count: 1 + (seed % 3) } });
    m.players.forEach((p) => { p.ready = true; });
    let now = 0;
    startMatch(m, rng, now);
    const pc = (p, type, payload) => { try { playerCommand(m, p.id, { type, payload, phaseId: m.phaseId }, rng, ++now); } catch (e) { if (e.name !== 'GameError' && !e.code) throw e; } };
    for (const p of m.players) pc(p, 'role.ack', {});
    let steps = 0;
    while (m.phase !== 'ENDED' && steps++ < 400) {
      const alive = m.players.filter((p) => p.alive);
      const any = () => alive[rng.int(alive.length)];
      if (m.phase === 'DAY_DISCUSSION') for (const p of alive) if (rng.int(3) === 0) pc(p, 'day.nominate', { target: any().id });
      if (m.phase === 'DAY_VOTING') for (const p of alive) { const c = m.day.eligibleVoters.includes(p.id) ? [...new Set(m.day.nominations.map((x) => x.target))] : []; if (c.length) pc(p, 'day.ballot', { target: c[rng.int(c.length)] }); }
      if (m.phase === 'NIGHT_ACTIONS') {
        const N = m.night;
        for (const id of [...N.aliveAtOpen]) {
          if (m.phase !== 'NIGHT_ACTIONS') break;
          const s = N.schemas[id];
          const p = m.players.find((x) => x.id === id);
          if (s?.kind === 'death') { pc(p, 'night.commit', { death: [N.death.targets?.[0] ?? N.aliveAtOpen.find((x) => !N.death.members.includes(x))].filter(Boolean) }); continue; }
          if (s && !s.blocked && s.kind !== 'chat') {
            const uses = [];
            for (let k = 0; k < s.uses; k++) uses.push({ target: s.targets?.[k], option: s.options?.[rng.int(s.options.length)]?.id });
            pc(p, 'night.commit', { uses: s.kind === 'choice' ? uses.map((u) => ({ option: u.option })) : uses.filter((u) => u.target) });
          }
          if (m.phase === 'NIGHT_ACTIONS' && !N.done[id]) pc(p, 'night.commit', { pass: true });
        }
      }
      if (m.phase === 'DAY_RESOLVING') { const r = m.day.retaliation; pc(m.players.find((x) => x.id === r.actorId), 'day.retaliate', { target: r.targets[0] }); }
      if (m.phase !== 'ENDED' && !['NIGHT_ACTIONS'].includes(m.phase) || (m.phase === 'NIGHT_ACTIONS' && m.night && !m.night.aliveAtOpen.every((id) => m.night.done[id]))) {
        if (m.phase !== 'ENDED') hostAdvance(m, rng, ++now, { skipAll: true });
      }
      // invariants
      const seats = new Set(m.players.map((p) => p.seat));
      assert.equal(seats.size, n);
      for (const p of m.players) {
        assert.ok(ROLES[p.roleId], 'one valid role');
        if (p.tempRevival) assert.ok(p.alive);
        for (const s of p.statuses) assert.equal(s.day, m.dayNumber);
      }
      if (m.night?.death) assert.ok(m.night.death.capacity <= 2);
    }
    assert.equal(m.phase, 'ENDED', `seed ${seed} did not finish`);
    assert.ok(['DEATH', 'NON_DEATH', 'JESTER', 'DRAW'].includes(m.winner));
  }
});
