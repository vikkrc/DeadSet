// Dead Set: Carnival — rules from CARNIVAL.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { botDecide } from '../server/bots.js';
import { MASKS } from '../engine/carnival.js';
import { NAMES } from './helpers.js';

/**
 * A Carnival game with n players, already past the unmasking and the lottery.
 * `masks` sets each seat's mask in seat order (players, then chairs); `dance`
 * false skips the opening dance; `first` is the seat that starts.
 */
function setup(n = 6, { masks = null, first = 0, k = {}, dance = false, script = {}, seed = 5 } = {}) {
  const rng = seededRng(seed, { leader: [first], ...script });
  const m = newMatch({ id: 'k1', code: 'CARN01', hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'carnival', k });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now);
  const seats = [...m.players.map((p) => p.id), ...m.K.chairs];
  if (masks) {
    seats.forEach((s, i) => { m.K.masks[s] = masks[i]; });
    m.K.inPlay = [...new Set(masks)];
    for (const o of m.players) for (const s of seats) m.K.belief[o.id][s] = { mask: m.K.masks[s], p: 1 };
  }
  if (!dance) for (const id of Object.keys(m.K.forced)) m.K.forced[id] = 0;
  const id = (nm) => m.players.find((p) => p.name === nm).id;
  const cmd = (nm, type, payload = {}) => playerCommand(m, id(nm), { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  const t = { m, rng, id, cmd, advance, seats, souls: (nm) => m.K.souls[id(nm)] };
  /** Everyone but the claimant answers; `mine` lists who says "That's mine!". */
  t.answer = (mine = []) => { for (const p of m.players) if (p.id !== m.K.claim.by && m.phase === 'K_CHALLENGE') cmd(p.name, 'k.answer', { mine: mine.includes(p.name) }); };
  advance(); // unmasking → lottery
  advance(); // lottery → first turn
  return t;
}
const SIX = ['DEATH', 'CONSPIRATOR', 'WITCH', 'MENTALIST', 'MAGISTRATE', 'GAMBLER'];

test('the ball: one mask per seat, empty chairs below six, 6 Souls each, every mask shown once', () => {
  const rng = seededRng(1);
  const m = newMatch({ id: 'k', code: 'K', hostId: 'p0' });
  for (let i = 0; i < 4; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'carnival' });
  m.players.forEach((p) => { p.ready = true; });
  startMatch(m, rng, 1);
  assert.equal(m.phase, 'K_UNMASK');
  assert.deepEqual(m.K.chairs, ['chair1', 'chair2']);
  assert.deepEqual(Object.values(m.K.masks).sort(), [...SIX].sort());
  for (const p of m.players) assert.equal(m.K.souls[p.id], 6);
  // The unmasking is public; afterwards masks are hidden from everyone.
  assert.ok(publicView(m).carnival.seats.every((s) => s.mask));
  hostAdvance(m, rng, 2);
  assert.equal(m.phase, 'K_LOTTERY');
  assert.ok(publicView(m).carnival.seats.every((s) => s.mask === null));
  assert.ok(playerView(m, 'p0').carnival.seats.every((s) => s.mask === null));
});

test('recommended masks grow with the table: + Ripper at 7 … + Innocent at 12', () => {
  for (const [n, extra] of [[7, 'RIPPER'], [8, 'GUARDIAN'], [9, 'DOUBLE_AGENT'], [10, 'JESTER'], [11, 'BARD'], [12, 'INNOCENT']]) {
    const t = setup(n);
    assert.equal(Object.keys(t.m.K.masks).length, n);
    assert.ok(Object.values(t.m.K.masks).includes(extra), `${n}: ${extra}`);
    assert.equal(t.m.K.chairs.length, 0);
  }
});

test('the opening dance: the first turn must be Swap or pretend', () => {
  const t = setup(6, { masks: SIX, dance: true });
  assert.equal(t.m.K.turn, 'p0');
  assert.throws(() => t.cmd('Ada', 'k.peek'), /opening dance/);
  assert.throws(() => t.cmd('Ada', 'k.claim', { mask: 'DEATH' }), /opening dance/);
  t.cmd('Ada', 'k.swap', { target: 'p1', real: false });
  assert.equal(t.m.K.forced.p0, 0);
  assert.equal(t.m.K.turn, 'p1');
});

test('swap and pretend look the same to everyone; only a real swap moves the masks', () => {
  const t = setup(6, { masks: SIX });
  t.cmd('Ada', 'k.swap', { target: 'p1', real: false });
  assert.equal(t.m.K.masks.p0, 'DEATH');
  t.cmd('Bo', 'k.swap', { target: 'p2', real: true });
  assert.equal(t.m.K.masks.p1, 'WITCH');
  assert.equal(t.m.K.masks.p2, 'CONSPIRATOR');
  const swaps = publicView(t.m).log.filter((l) => l.ev === 'k-swap');
  assert.equal(swaps.length, 2);
  for (const l of swaps) assert.equal(l.real, undefined, 'nothing says whether it was real');
  assert.deepEqual(Object.keys(swaps[0]).sort(), Object.keys(swaps[1]).sort());
});

test('peek: only you see your mask; everyone knows you looked', () => {
  const t = setup(6, { masks: SIX });
  t.cmd('Ada', 'k.peek');
  assert.equal(t.m.phase, 'K_LOOK', 'the game waits while Ada looks');
  assert.deepEqual(playerView(t.m, 'p0').action.looks, [{ seat: 'p0', mask: 'DEATH' }]);
  assert.equal(playerView(t.m, 'p1').action.type, 'kwatch');
  assert.throws(() => t.cmd('Bo', 'k.done'), /closed/);
  t.cmd('Ada', 'k.done');
  assert.equal(t.m.K.turn, 'p1');
  const mine = playerView(t.m, 'p0').private.find((e) => e.peek);
  assert.equal(mine.mask, 'DEATH');
  assert.ok(!playerView(t.m, 'p1').private.some((e) => e.mask));
  assert.ok(publicView(t.m).log.some((l) => l.ev === 'k-peek' && l.by === 'p0'));
});

test('an unchallenged claim uses the power, true or not', () => {
  const t = setup(6, { masks: SIX });
  t.cmd('Ada', 'k.claim', { mask: 'CONSPIRATOR' }); // Ada is Death: a bluff
  assert.equal(t.m.phase, 'K_CHALLENGE');
  t.answer([]);
  assert.equal(t.souls('Ada'), 9);
  assert.equal(t.m.K.liar.p0, 1);
  assert.equal(t.m.K.turn, 'p1');
});

test('a challenge: masks are lifted, the true holder uses the power, the rest pay into the Offering', () => {
  const t = setup(6, { masks: SIX });
  t.cmd('Ada', 'k.claim', { mask: 'CONSPIRATOR' });
  t.answer(['Bo', 'Cy']); // Bo is the Conspirator; Cy (the Witch) is wrong
  assert.equal(t.souls('Ada'), 5);
  assert.equal(t.souls('Cy'), 5);
  assert.equal(t.souls('Bo'), 9);
  assert.equal(t.m.K.offering, 2);
  assert.equal(t.m.K.eye.p1, 1);
  const l = publicView(t.m).log.find((x) => x.ev === 'k-reveal');
  assert.deepEqual(l.reveal, { p0: 'DEATH', p1: 'CONSPIRATOR', p2: 'WITCH' });
  // The Magistrate takes everything in the Offering.
  t.cmd('Bo', 'k.claim', { mask: 'MAGISTRATE' });
  t.answer([]);
  assert.equal(t.souls('Bo'), 11);
  assert.equal(t.m.K.offering, 0);
});

test('claimed mask on a silent player or chair: every revealed player pays, nobody uses the power', () => {
  const t = setup(6, { masks: SIX });
  t.cmd('Ada', 'k.claim', { mask: 'GAMBLER' });
  t.answer(['Bo']);
  assert.equal(t.souls('Ada'), 5);
  assert.equal(t.souls('Bo'), 5);
  assert.equal(t.m.K.turn, 'p1');
});

test('Death reaps 2 into the Harvest; three reaps win; the Guardian\'s shield blocks it', () => {
  const t = setup(8, { masks: ['DEATH', 'GUARDIAN', 'WITCH', 'MENTALIST', 'MAGISTRATE', 'GAMBLER', 'RIPPER', 'CONSPIRATOR'] });
  t.cmd('Ada', 'k.claim', { mask: 'DEATH' });
  t.answer([]);
  assert.equal(t.m.phase, 'K_POWER');
  t.cmd('Ada', 'k.power', { target: 'p2' });
  assert.equal(t.m.K.harvest.p0, 2);
  assert.equal(t.souls('Cy'), 4);
  t.cmd('Bo', 'k.claim', { mask: 'GUARDIAN' });
  t.answer([]);
  assert.ok(t.m.K.shield.p1);
  for (const nm of ['Cy', 'Di', 'Ed', 'Fay', 'Gus', 'Hal']) t.cmd(nm, 'k.swap', { target: 'p0', real: false });
  t.cmd('Ada', 'k.claim', { mask: 'DEATH' });
  t.answer([]);
  t.cmd('Ada', 'k.power', { target: 'p1' });
  assert.equal(t.m.K.harvest.p0, 2, 'the shield held');
  assert.equal(t.souls('Bo'), 7);
  // Bo's next turn ends the shield.
  assert.equal(t.m.K.turn, 'p1');
  assert.ok(!t.m.K.shield.p1);
  for (const nm of ['Bo', 'Cy', 'Di', 'Ed', 'Fay', 'Gus', 'Hal']) t.cmd(nm, 'k.swap', { target: 'p0', real: false });
  t.cmd('Ada', 'k.claim', { mask: 'DEATH' });
  t.answer([]);
  t.cmd('Ada', 'k.power', { target: 'p3' });
  for (const nm of ['Bo', 'Cy', 'Di', 'Ed', 'Fay', 'Gus', 'Hal']) t.cmd(nm, 'k.swap', { target: 'p0', real: false });
  t.cmd('Ada', 'k.claim', { mask: 'DEATH' });
  t.answer([]);
  t.cmd('Ada', 'k.power', { target: 'p4' });
  assert.equal(t.m.phase, 'ENDED');
  assert.equal(t.m.winner, 'CARNIVAL');
  assert.deepEqual(t.m.kWinners, ['p0']);
  assert.equal(t.m.publicLog.at(-1).how, 'harvest');
});

test('the Mentalist reads in private; the Oracle\'s targets are public, the result private', () => {
  const t = setup(6, { masks: SIX });
  t.cmd('Ada', 'k.claim', { mask: 'MENTALIST' });
  t.answer([]);
  t.cmd('Ada', 'k.power', { target: 'p4' });
  assert.equal(t.m.phase, 'K_LOOK');
  t.cmd('Ada', 'k.done');
  const pub = publicView(t.m).log.filter((l) => l.ev === 'k-power').at(-1);
  assert.equal(pub.target, undefined);
  assert.equal(pub.seats, undefined);
  assert.equal(playerView(t.m, 'p0').private.at(-1).mask, 'MAGISTRATE');
  t.m.K.inPlay.push('ORACLE');
  t.cmd('Bo', 'k.claim', { mask: 'ORACLE' });
  t.answer([]);
  t.cmd('Bo', 'k.power', { targets: ['p0', 'p5'] });
  assert.deepEqual(playerView(t.m, 'p1').action.looks.map((x) => x.mask), ['DEATH', 'GAMBLER']);
  t.advance();
  const o = publicView(t.m).log.filter((l) => l.ev === 'k-power').at(-1);
  assert.deepEqual(o.seats, ['p0', 'p5']);
  assert.deepEqual(playerView(t.m, 'p1').private.slice(-2).map((e) => e.mask), ['DEATH', 'GAMBLER']);
});

test('the Witch swaps or pretends in secret; the Double Agent swaps for real and looks', () => {
  const t = setup(9, { masks: ['WITCH', 'DOUBLE_AGENT', 'DEATH', 'CONSPIRATOR', 'MENTALIST', 'MAGISTRATE', 'GAMBLER', 'RIPPER', 'GUARDIAN'] });
  t.cmd('Ada', 'k.claim', { mask: 'WITCH' });
  t.answer([]);
  t.cmd('Ada', 'k.power', { targets: ['p2', 'p3'], real: true });
  assert.equal(t.m.K.masks.p2, 'CONSPIRATOR');
  const w = publicView(t.m).log.filter((l) => l.ev === 'k-swap').at(-1);
  assert.equal(w.real, undefined);
  t.cmd('Bo', 'k.claim', { mask: 'DOUBLE_AGENT' });
  t.answer([]);
  t.cmd('Bo', 'k.power', { target: 'p2' });
  t.cmd('Bo', 'k.done');
  assert.equal(t.m.K.masks.p1, 'CONSPIRATOR');
  assert.equal(t.m.K.masks.p2, 'DOUBLE_AGENT');
  assert.equal(playerView(t.m, 'p1').private.at(-1).mask, 'CONSPIRATOR');
});

test('the Jester names a player and a mask: right takes 2, wrong pays 1', () => {
  const t = setup(10, { masks: ['JESTER', 'DEATH', 'CONSPIRATOR', 'WITCH', 'MENTALIST', 'MAGISTRATE', 'GAMBLER', 'RIPPER', 'GUARDIAN', 'DOUBLE_AGENT'] });
  t.cmd('Ada', 'k.claim', { mask: 'JESTER' });
  t.answer([]);
  t.cmd('Ada', 'k.power', { target: 'p1', mask: 'DEATH' });
  assert.equal(t.souls('Ada'), 8);
  assert.equal(t.souls('Bo'), 4);
  for (const nm of ['Bo', 'Cy', 'Di', 'Ed', 'Fay', 'Gus', 'Hal', 'Ivy', 'Jo']) t.cmd(nm, 'k.swap', { target: 'p0', real: false });
  t.cmd('Ada', 'k.claim', { mask: 'JESTER' });
  t.answer([]);
  t.cmd('Ada', 'k.power', { target: 'p2', mask: 'DEATH' });
  assert.equal(t.souls('Ada'), 7);
  assert.equal(t.m.K.offering, 1);
});

test('Ripper, Bard, Gambler and Scapegoat', () => {
  const t = setup(11, { masks: ['RIPPER', 'BARD', 'GAMBLER', 'SCAPEGOAT', 'DEATH', 'CONSPIRATOR', 'WITCH', 'MENTALIST', 'MAGISTRATE', 'GUARDIAN', 'JESTER'], script: { kcoin: [0] } });
  t.cmd('Ada', 'k.claim', { mask: 'RIPPER' });
  t.answer([]);
  assert.equal(t.souls('Ada'), 8);
  assert.equal(t.souls('Bo'), 5);
  assert.equal(t.m.K.souls.p10, 5);
  t.cmd('Bo', 'k.claim', { mask: 'BARD' });
  t.answer([]);
  assert.deepEqual([t.souls('Ada'), t.souls('Bo'), t.souls('Cy')], [9, 6, 7]);
  t.cmd('Cy', 'k.claim', { mask: 'GAMBLER' });
  t.answer([]);
  assert.equal(t.souls('Cy'), 10, 'heads: +3');
  t.cmd('Di', 'k.claim', { mask: 'SCAPEGOAT' });
  t.answer([]);
  t.cmd('Di', 'k.power', { target: 'p2' });
  assert.equal(t.souls('Cy'), 8);
  assert.equal(t.m.K.offering, 2);
});

test('the Mimic copies the mask claimed in the turn just before', () => {
  const t = setup(6, { masks: ['CONSPIRATOR', 'MAGISTRATE', 'WITCH', 'MENTALIST', 'DEATH', 'GAMBLER'] });
  t.m.K.inPlay.push('MIMIC');
  t.cmd('Ada', 'k.claim', { mask: 'CONSPIRATOR' });
  t.answer([]);
  t.cmd('Bo', 'k.claim', { mask: 'MIMIC' });
  t.answer([]);
  assert.equal(t.souls('Bo'), 9, 'copied the Conspirator');
  t.cmd('Cy', 'k.swap', { target: 'p0', real: false });
  t.cmd('Di', 'k.claim', { mask: 'MIMIC' });
  t.answer([]);
  assert.equal(t.souls('Di'), 7, 'nothing to copy: +1');
});

test('a full purse wins at once; scores: the winner +3, others +1 per Soul above 6', () => {
  const t = setup(6, { masks: SIX, k: { target: 9 } });
  t.cmd('Ada', 'k.claim', { mask: 'CONSPIRATOR' });
  t.answer([]);
  assert.equal(t.m.phase, 'ENDED');
  assert.deepEqual(t.m.kWinners, ['p0']);
  assert.equal(t.m.kScores.p0, 3);
  assert.equal(t.m.kScores.p1, 0);
});

test('ruin: someone at 0 ends the game and the richest wins (ties share)', () => {
  const t = setup(6, { masks: SIX });
  t.m.K.souls.p0 = 1;
  t.m.K.souls.p3 = 9;
  t.m.K.souls.p4 = 9;
  t.cmd('Ada', 'k.claim', { mask: 'GAMBLER' });
  t.answer(['Bo']); // Ada pays her last Soul
  assert.equal(t.m.phase, 'ENDED');
  assert.deepEqual(t.m.kWinners.sort(), ['p3', 'p4']);
  assert.equal(t.m.publicLog.at(-1).how, 'ruin');
});

test('timeouts: a turn peeks (or pretends during the dance), challenges pass, powers pick at random', () => {
  const t = setup(6, { masks: SIX, dance: true });
  t.advance();
  assert.equal(t.m.K.forced.p0, 0, 'a forced turn pretends');
  assert.equal(t.m.K.masks.p0, 'DEATH');
  for (const id of Object.keys(t.m.K.forced)) t.m.K.forced[id] = 0;
  t.advance();
  assert.equal(t.m.phase, 'K_LOOK', 'a timed-out turn peeks, and the game waits for the look');
  assert.ok(playerView(t.m, 'p1').private.some((e) => e.peek));
  t.advance();
  t.cmd('Cy', 'k.claim', { mask: 'DEATH' });
  t.advance();
  assert.equal(t.m.phase, 'K_POWER');
  t.advance();
  assert.equal(t.m.K.harvest.p2, 2);
});

test('the ball diary (notes) is off by default: only the latest sightings are kept', () => {
  const t = setup(6, { masks: SIX });
  t.cmd('Ada', 'k.peek');
  t.cmd('Ada', 'k.done');
  assert.ok(playerView(t.m, 'p0').private.some((e) => e.peek));
  for (const nm of ['Bo', 'Cy', 'Di', 'Ed', 'Fay']) t.cmd(nm, 'k.swap', { target: 'p0', real: false });
  t.cmd('Ada', 'k.swap', { target: 'p1', real: false });
  assert.ok(!playerView(t.m, 'p0').private.some((e) => e.peek), 'forgotten');
  const d = setup(6, { masks: SIX, k: { diary: true } });
  d.cmd('Ada', 'k.peek');
  d.cmd('Ada', 'k.done');
  for (const nm of ['Bo', 'Cy', 'Di', 'Ed', 'Fay']) d.cmd(nm, 'k.swap', { target: 'p0', real: false });
  d.cmd('Ada', 'k.swap', { target: 'p1', real: false });
  assert.ok(playerView(d.m, 'p0').private.some((e) => e.peek), 'kept in the diary');
});

test('setup: 4–12 players; custom masks need Death; settings are clamped', () => {
  const m = newMatch({ id: 'k', code: 'K', hostId: 'p0' });
  for (let i = 0; i < 3; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'carnival', k: { target: 99, harvest: 5, penalty: 3, dance: 2 } });
  assert.equal(setupReport(m).ok, false);
  assert.equal(m.settings.k.target, 13);
  assert.equal(m.settings.k.harvest, 6);
  assert.equal(m.settings.k.penalty, 1);
  assert.equal(m.settings.k.dance, 2);
  addPlayer(m, { id: 'p3', name: NAMES[3] });
  m.players.forEach((p) => { p.ready = true; });
  assert.equal(setupReport(m).ok, true);
  updateSettings(m, { k: { masks: 'custom', pool: ['WITCH', 'GAMBLER', 'CONSPIRATOR', 'MAGISTRATE', 'MENTALIST', 'ORACLE'] } });
  assert.equal(setupReport(m).ok, false, 'Death is required');
  updateSettings(m, { k: { pool: ['DEATH', 'WITCH', 'GAMBLER', 'ORACLE'] } });
  assert.equal(setupReport(m).ok, true);
  assert.ok(MASKS.includes('INNOCENT'));
});

test('bots play whole games to the end at 4 and 12 players', () => {
  for (const n of [4, 12]) {
    for (let g = 0; g < 4; g++) {
      const rng = seededRng(g + n * 10);
      const m = newMatch({ id: 'b', code: 'B', hostId: 'p0' });
      for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i], bot: true });
      updateSettings(m, { mode: 'carnival' });
      m.players.forEach((p) => { p.ready = true; });
      let now = 1e6;
      startMatch(m, rng, now);
      for (let guard = 0; m.phase !== 'ENDED' && guard < 3000; guard++) {
        let acted = false;
        for (const p of m.players) {
          const d = botDecide(m, p.id, rng);
          if (d?.cmd) { playerCommand(m, p.id, { ...d.cmd, phaseId: m.phaseId }, rng, (now += 10)); acted = true; }
          if (m.phase === 'ENDED') break;
        }
        if (!acted && m.phase !== 'ENDED') hostAdvance(m, rng, (now += 10));
      }
      assert.equal(m.phase, 'ENDED', `${n} players, game ${g}`);
    }
  }
});
