import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setup, runDay, runNight } from './helpers.js';
import { playerView, publicView } from '../engine/views.js';
import { awardsFor, calledIt } from '../engine/awards.js';

test('D1-D3: a ghost lays up to two hunches a day, sees only their own, and calling Death earns an award', () => {
  const t = setup(['DEATH', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'INNOCENT', 'INNOCENT']);
  runDay(t, { nominate: [] });
  runNight(t, { death: { all: ['Bo'] } });
  assert.equal(t.P('Bo').alive, false);
  assert.throws(() => t.cmd('Cy', 'ghost.hunch', { target: t.id('Ada') }), /dead/);
  t.cmd('Bo', 'ghost.hunch', { target: t.id('Ada') });
  t.cmd('Bo', 'ghost.hunch', { target: t.id('Di') });
  assert.throws(() => t.cmd('Bo', 'ghost.hunch', { target: t.id('Ed') }), /Two hunches/);
  t.cmd('Bo', 'ghost.hunch', { target: t.id('Di') }); // taken back
  assert.deepEqual(playerView(t.m, t.id('Bo')).me.hunches, [t.id('Ada')]);
  // Nobody else, and not the TV, can see a hunch.
  assert.equal(playerView(t.m, t.id('Cy')).me.hunches, undefined);
  assert.ok(!JSON.stringify(publicView(t.m)).includes('hunch'));
  assert.equal(calledIt(t.m)[0].by, t.id('Bo'));
  t.m.winner = 'NON_DEATH';
  assert.ok(awardsFor(t.m, 'classic').some((a) => a.id === 'called' && a.pid === t.id('Bo')));
});
