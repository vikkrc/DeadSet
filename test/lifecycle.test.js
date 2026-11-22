// DS-036, DS-044: identity and state across rematches and changes of game.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, updateSettings, abortMatch, rematch } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { MODE_IDS } from '../public/modes.js';

const SECTION = { missions: 'missions', exorcism: 'exorcism', coffins: 'coffins', carnival: 'carnival', midnight: 'midnight', seance: 'seance', graverobbers: 'graverobbers', mimic: 'mimic', omen: 'omen', mirror: 'mirror' };
function table(n = 6, { moderated = false } = {}) {
  const m = newMatch({ id: 'm', code: 'TEST01', hostId: moderated ? 'mod' : 'p0', moderated });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: `P${i}` });
  m.players.forEach((p) => { p.ready = true; });
  return m;
}
const play = (m, mode, rng, now) => { updateSettings(m, mode === 'classic' ? { preset: 'standard', quietFirstDay: false } : { mode }); m.players.forEach((p) => { p.ready = true; }); startMatch(m, rng, now); };

test('DS-036: handing host controls to a player never makes them the moderator at the next game', () => {
  const m = table(6, { moderated: true });
  const rng = seededRng(3);
  play(m, 'classic', rng, 1000);
  m.hostId = 'p2'; // a legitimate public-host transfer while the moderator was away
  abortMatch(m, 2000);
  rematch(m);
  play(m, 'classic', rng, 3000);
  assert.equal(m.moderatorId, 'mod');
  const v = playerView(m, 'p2');
  assert.ok(!v.me.moderator, 'the new host is still just a player');
  assert.equal(v.secrets, undefined);
});

test('DS-044: every ordered change of game leaves only the new game\'s state', () => {
  const rng = seededRng(5);
  const bad = [];
  let ran = 0;
  for (const from of MODE_IDS) for (const to of MODE_IDS) {
    const m = table(6);
    try { play(m, from, rng, 1000); } catch { continue; }
    abortMatch(m, 2000); rematch(m);
    try { play(m, to, rng, 3000); } catch { continue; }
    ran++;
    const v = publicView(m, 3000);
    const stale = Object.values(SECTION).filter((k) => v[k] && k !== SECTION[to]);
    if (stale.length) bad.push(`${from}→${to}: ${stale.join(',')}`);
  }
  assert.deepEqual(bad, []);
  assert.equal(ran, MODE_IDS.length ** 2, 'every pair started');
});
