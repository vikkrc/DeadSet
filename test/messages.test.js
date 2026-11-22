// DS-011, DS-029: whole messages render the right names, not just the right placeholders.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setContent, tm } from '../public/i18n.js';
import { PRESETS } from '../engine/content.js';
import { newMatch, addPlayer, updateSettings, setupReport } from '../engine/game.js';

setContent({ roles: [], dreams: [], rules: [], presets: Object.values(PRESETS), scenario: { WHO: [], WHERE: [], WHY: [] } });

test('DS-011: an over-full table names its game in full', () => {
  for (const mode of ['omen', 'mirror', 'mimic', 'seance', 'carnival', 'coffins', 'midnight', 'graverobbers', 'exorcism', 'missions']) {
    const m = newMatch({ id: 'm', code: 'T', hostId: 'p0' });
    for (let i = 0; i < 25; i++) addPlayer(m, { id: `p${i}`, name: `P${i}` });
    updateSettings(m, { mode });
    const err = setupReport(m).errors.find((e) => Array.isArray(e) && e[0].includes('at most'));
    assert.ok(err, mode);
    const text = tm(err);
    const name = PRESETS[mode].name.replace(/^Dead Set\s*:\s*/i, '');
    assert.ok(text.startsWith(name), `${mode}: ${text}`);
  }
});
