import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editions } from '../public/gazette.js';

const fill = (s, p = {}) => s.replace(/\{(\w+)\}/g, (_, k) => (Array.isArray(p[k]) ? p[k].join(', ') : p[k] ?? ''));
const h = { t: fill, tm: (m) => (Array.isArray(m) ? fill(m[0], m[1]) : m), tlist: (x) => x.join(', '), scen: (_, x) => x, ruleF: (id) => id, roleF: (id) => ({ ORACLE: 'Oracle', DEATH: 'Death' })[id] ?? id, getLang: () => 'en' };
const players = [
  { id: 'a', name: 'Ilka', alive: true }, { id: 'b', name: 'Bram', alive: false, role: { id: 'ORACLE', alignment: 'NON_DEATH' } },
  { id: 'c', name: 'Mara', alive: false, role: null }, { id: 'd', name: 'Tomi', alive: true },
];

test('G4: headlines name people, and name roles only once the table has seen them', () => {
  const v = { players, activeRules: [], log: [
    { i: 0, at: 'Day 1', ev: 'nominate', by: 'a', target: 'c', first: true },
    { i: 1, at: 'Day 1', ev: 'tally', totals: { c: 4 } },
    { i: 2, at: 'Day 1', ev: 'sentence', victims: ['c'] },
    { i: 3, at: 'Night 1', ev: 'dawn', killed: ['b'], expired: [] },
  ] };
  const [night, day] = editions(v, h);
  assert.equal(night.title, 'The Oracle, Bram, found dead');
  assert.equal(day.title, 'Without a doubt: Mara sentenced 4–0');
});
