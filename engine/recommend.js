// S2: a recommended setup for every game and table size. The lobby starts from it and keeps it in step with
// the table as players come and go, until the host changes something themselves (the room is then "tuned").
// `patch` is a settings patch (as host.settings takes it); `facts` are the summary lines the lobby shows, as
// [template, params] messages.

import { scaling } from './setup.js';

const by = (n, steps) => steps.find(([max]) => n <= max)?.[1] ?? steps.at(-1)[1];

export function recommend(mode, n) {
  n = Math.max(0, Number(n) || 0);
  switch (mode) {
    case 'classic': {
      const c = scaling(Math.max(5, Math.min(25, n)));
      const rules = by(n, [[6, 1], [10, 2], [99, 3]]);
      return {
        patch: { preset: n > 13 ? 'custom' : 'standard', dreams: true, bloodMoon: true, quietFirstDay: true, rules: { mode: 'random', count: rules } },
        facts: [[c.DEATH === 1 ? '{n} Death' : '{n} of Death', { n: c.DEATH }], ['Dreams on', {}], [rules === 1 ? '{n} rule card' : '{n} rule cards', { n: rules }], ['A quiet first day', {}]],
      };
    }
    case 'exorcism': {
      const demons = n >= 8 ? 2 : 1;
      const rounds = n <= 5 ? 2 : 1;
      return { patch: { x: { demons, rounds } }, facts: [[demons === 1 ? '{n} Demon' : '{n} Demons', { n: demons }], [rounds === 1 ? '{n} round of words' : '{n} rounds of words', { n: rounds }]] };
    }
    case 'graverobbers': {
      const teams = n >= 9 ? 3 : 2;
      return { patch: { g: { teams } }, facts: [[teams === 2 ? 'Two crews' : 'Three crews', {}]] };
    }
    case 'coffins': {
      const relics = n >= 6;
      return { patch: { c: { relics, toWin: 2 } }, facts: [['Two clean digs win', {}], [relics ? 'Relics on' : 'Relics off', {}]] };
    }
    case 'carnival': {
      const harvest = n >= 6 ? 6 : 0;
      return { patch: { k: { harvest, target: 13 } }, facts: [['13 Souls to win', {}], [harvest ? 'Death\'s harvest on' : 'No harvest', {}]] };
    }
    default: return { patch: {}, facts: [] };
  }
}
