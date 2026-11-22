import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anonymise } from '../public/share.js';

test('V1: share without names swaps every name, longest first', () => {
  const seats = [['Ann', 'Seat 1'], ['Anna', 'Seat 2'], ['Bram', 'Seat 3']];
  assert.equal(anonymise('Anna named Ann; Bram, the Demon, wins.', seats), 'Seat 2 named Seat 1; Seat 3, the Demon, wins.');
  assert.equal(anonymise('', seats), '');
});

import { fitFaces } from '../public/share.js';
test('DS-015: a full table of 25 fits on the card, every face accounted for', () => {
  // one winner, 24 others, in the space left between the headline and three honours
  assert.equal(fitFaces(1, 380, [128, 96, 72, 56, 44]).fit, 1);
  assert.equal(fitFaces(24, 420, [72, 56, 44]).fit, 24);
  // twenty winners still fit, smaller
  assert.equal(fitFaces(20, 620, [128, 96, 72, 56, 44]).fit, 20);
  // and when nothing could fit, the count left over is explicit, never silent
  const tiny = fitFaces(25, 100, [44]);
  assert.ok(tiny.fit < 25);
});
