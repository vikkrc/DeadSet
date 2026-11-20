import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anonymise } from '../public/share.js';

test('V1: share without names swaps every name, longest first', () => {
  const seats = [['Ann', 'Seat 1'], ['Anna', 'Seat 2'], ['Bram', 'Seat 3']];
  assert.equal(anonymise('Anna named Ann; Bram, the Demon, wins.', seats), 'Seat 2 named Seat 1; Seat 3, the Demon, wins.');
  assert.equal(anonymise('', seats), '');
});
