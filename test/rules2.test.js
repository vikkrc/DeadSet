// Blood Moon, final-two rule, Dream weights, big tables, suggestions, recap.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setup, runDay, runNight, NAMES } from './helpers.js';
import { validateSetup, defaultSettings, applySettingsPatch, suggestSetups, drawRules, buildDeck } from '../engine/setup.js';
import { newMatch, addPlayer, startMatch, updateSettings, hostAdvance } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { checkVictory } from '../engine/victory.js';
import { seededRng } from '../engine/rng.js';

const alive = (t, n) => t.P(n).alive;
const standoffNight = (t) => runNight(t, { death: { all: ['Bo'] }, actions: { Bo: [{ target: 'Bo' }] } });

test('Blood Moon rises after two deathless nights and no shield holds', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO']);
  runDay(t); standoffNight(t);
  assert.equal(alive(t, 'Bo'), true, 'night 1: the Guardian shields themself');
  runDay(t);
  assert.ok(!t.m.night.bloodMoon);
  standoffNight(t);
  assert.equal(alive(t, 'Bo'), true, 'night 2: still shielded');
  runDay(t);
  assert.equal(t.m.night.bloodMoon, true, 'night 3 is a Blood Moon');
  assert.ok(t.m.publicLog.some((l) => l.ev === 'bloodmoon'));
  standoffNight(t);
  assert.equal(alive(t, 'Bo'), false, 'the shield fails under the Blood Moon');
  assert.equal(t.m.calm, 0);
});

test('Blood Moon also overrides a blocked Death kill, and can be switched off', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO'], { settings: { bloodMoon: false } });
  for (let i = 0; i < 3; i++) { runDay(t); standoffNight(t); }
  assert.equal(alive(t, 'Bo'), true, 'with the rule off the standoff holds');
  const u = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO', 'WHORE']);
  for (let i = 0; i < 2; i++) { runDay(u); standoffNight(u); }
  runDay(u);
  runNight(u, { death: { all: ['Cy'] }, actions: { Fay: [{ target: 'Ada' }], Bo: [{ target: 'Cy' }] } });
  assert.equal(alive(u, 'Cy'), false, 'a Whore visit and a Guardian shield both fail');
});

test('Final-two rule: a Death among the last two wins when enabled', () => {
  const players = [{ alive: true, alignment: 'DEATH' }, { alive: true, alignment: 'NON_DEATH' }, { alive: false, alignment: 'NON_DEATH' }];
  assert.equal(checkVictory({ players, config: { finalTwoDeath: false } }), null);
  assert.equal(checkVictory({ players, config: { finalTwoDeath: true } }).winner, 'DEATH');
  const three = [...players, { alive: true, alignment: 'NON_DEATH' }];
  assert.equal(checkVictory({ players: three, config: { finalTwoDeath: true } }), null);
});

test('Insomnia is drawn at most twice in a match', () => {
  const t = setup(Array.from({ length: 12 }, (_, i) => (i < 3 ? 'DEATH' : 'INNOCENT')), {
    dreams: true, settings: { dreamWeights: { SLEEP_PARALYSIS: 0, PREMONITION: 0, WHISPERS: 0, SLEEPWALKING: 0, DREAM_SNATCHER: 0, NIGHT_SHIFT: 0, SHARED_NIGHTMARE: 0, GUARDIAN_ANGEL: 1, INSOMNIA: 4 } },
  });
  runDay(t);
  const drawn = Object.values(t.m.night.initialDreams);
  assert.equal(drawn.filter((d) => d === 'INSOMNIA').length, 2);
  assert.equal(drawn.length, 12);
  for (const p of t.m.players) assert.ok(playerView(t.m, p.id).me.dream, 'everyone sees their Dream at nightfall');
  assert.equal(t.m.deadline - t.m.openedAt, 15000);
});

test('Default weights make Insomnia rarer than the others', () => {
  const s = defaultSettings();
  assert.ok(s.dreamWeights.INSOMNIA < s.dreamWeights.SLEEP_PARALYSIS);
  const p = applySettingsPatch(s, { dreamWeights: { INSOMNIA: 4 } });
  assert.equal(p.dreamWeights.INSOMNIA, 1, 'only Custom may change weights');
  const c = applySettingsPatch(applySettingsPatch(s, { preset: 'custom' }), { dreamWeights: { INSOMNIA: 9 } });
  assert.equal(c.dreamWeights.INSOMNIA, 4, 'clamped to the scale');
});

test('Suggested setups are balanced and fit every count from 5 to 25', () => {
  for (let n = 5; n <= 25; n++) {
    const sug = suggestSetups(n, 3);
    assert.equal(sug.length, 3);
    for (const g of sug) {
      assert.equal(Object.values(g.roles).reduce((a, b) => a + b, 0), n, `${g.key} @${n}`);
      const s = applySettingsPatch(applySettingsPatch(defaultSettings(), { preset: 'custom' }), { deckMode: 'exact', customRoles: g.roles });
      const r = validateSetup(n, s);
      assert.deepEqual(r.errors, [], `${g.key} @${n}`);
      if (n < 8) assert.ok(!g.roles.JESTER);
    }
  }
});

test('Custom games seat up to 25 players and start', () => {
  const m = newMatch({ id: 'b', code: 'BIG001', hostId: 'p0' });
  for (let i = 0; i < 25; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  assert.throws(() => addPlayer(m, { id: 'x', name: 'Zed' }), /full/);
  updateSettings(m, { preset: 'custom' });
  m.players.forEach((p) => { p.ready = true; });
  startMatch(m, seededRng(3), 1000);
  assert.equal(m.phase, 'NIGHT_0_REVEAL');
  assert.ok(m.players.filter((p) => p.alignment === 'DEATH').length >= 5);
});

test('Small tables: random draws skip Double Jeopardy and the Jester', () => {
  const s = applySettingsPatch(defaultSettings(), { rules: { count: 3 } });
  for (let seed = 1; seed < 60; seed++) assert.ok(!drawRules(s, seededRng(seed), 6).includes('DOUBLE_JEOPARDY'));
  const full = applySettingsPatch(defaultSettings(), { preset: 'full' });
  for (let seed = 1; seed < 60; seed++) assert.ok(!buildDeck(7, full, seededRng(seed)).includes('JESTER'));
  const custom = applySettingsPatch(applySettingsPatch(defaultSettings(), { preset: 'custom' }), { deckMode: 'exact', customRoles: { DEATH: 1, JESTER: 1, INNOCENT: 3 }, rules: { mode: 'manual', selected: ['DOUBLE_JEOPARDY'] } });
  const w = JSON.stringify(validateSetup(5, custom).warnings);
  assert.match(w, /Jester at fewer than/);
  assert.match(w, /Double Jeopardy at fewer than/);
});

test('The recap lists every night and day once the match ends', () => {
  const t = setup(['DEATH', 'GUARDIAN', 'INNOCENT', 'MENTALIST', 'PSYCHO']);
  runDay(t);
  runNight(t, { death: { all: ['Cy'] }, actions: { Di: [{ target: 'Ada' }] } });
  assert.equal(publicView(t.m).recap, undefined, 'hidden while the game runs');
  runDay(t, { nominate: [['Bo', 'Ada']], votes: { Bo: 'Ada', Di: 'Ada', Ed: 'Ada' } });
  assert.equal(t.m.winner, 'NON_DEATH');
  const recap = publicView(t.m).recap;
  assert.deepEqual(recap.map((r) => r.kind), ['day', 'night', 'day']);
  assert.ok(recap[1].arrows.some((a) => a.role === 'DEATH' && a.to === t.id('Cy')));
  assert.equal(recap[2].ballots[t.id('Bo')], t.id('Ada'));
});
