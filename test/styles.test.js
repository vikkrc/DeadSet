// Style guards (CONSISTENCY-PASS): structural rules for public/styles.css.
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';

test('no @keyframes name is defined twice', () => {
  execFileSync(process.execPath, ['scripts/check-keyframes.mjs'], { stdio: 'pipe' });
});

test('styles keep to the layer, motion and colour tokens', () => {
  execFileSync(process.execPath, ['scripts/check-styles.mjs'], { stdio: 'pipe' });
});
