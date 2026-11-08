// Every translation covers every interface string, with matching placeholders.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { LANGS } from '../engine/content.js';

const run = (...args) => execFileSync(process.execPath, args, { cwd: new URL('..', import.meta.url), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

test('translation files match the English keys, placeholders and content shape', () => {
  assert.match(run('scripts/i18n-check.mjs'), /translations ok/);
});

for (const code of LANGS.filter((c) => c !== 'en')) {
  test(`${code} covers every interface string`, () => {
    assert.equal(run('scripts/i18n-keys.mjs', code).trim(), '', `missing ${code} strings`);
  });
}
