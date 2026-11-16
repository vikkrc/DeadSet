// Dead Set: Graverobbers — rules from GRAVEROBBERS.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { botDecide } from '../server/bots.js';
import { ICON_POOL } from '../engine/graverobbers.js';
import { EMBLEMS } from '../public/emblems.js';
import { NAMES } from './helpers.js';

/**
 * A game at `n` players with chosen crews: p0..p(n/2-1) Moon (B), the rest Sun (G);
 * Undertakers p0 (B) and the first Sun player. The Moon crew goes first; the register is fixed.
 */
function setup({ n = 6, settings = {}, ack = true } = {}) {
  const rng = seededRng(3);
  const m = newMatch({ id: 'g1', code: 'GRAVE1', hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  const half = Math.ceil(n / 2);
  const crew = Object.fromEntries(Array.from({ length: n }, (_, i) => [`p${i}`, i < half ? 'B' : 'G']));
  updateSettings(m, { mode: 'graverobbers', g: { crews: 'chosen', crew, captains: 'chosen', cap: { B: 'p0', G: `p${half}` }, ...settings } });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now);
  // Fix the board: graves 0-8 Moon, 9-16 Sun, 17-23 empty, 24 Death; the Moon goes first.
  const G = m.G;
  G.first = 'B'; G.turn = 'B'; G.need = { B: 9, G: 8 };
  G.tiles.forEach((t, i) => { t.k = i < 9 ? 'B' : i < 17 ? 'G' : i < 24 ? 'N' : 'D'; });
  const cmd = (id, type, payload = {}) => playerCommand(m, id, { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  const t = { m, rng, cmd, advance, G, half, cap: { B: 'p0', G: `p${half}` }, diggers: (c) => G.crews[c].filter((id) => id !== G.caps[c]) };
  if (ack) for (const p of m.players) cmd(p.id, 'g.ack');
  t.sign = (n, word = 'zzzq') => cmd(t.cap[G.turn], 'g.sign', { word, n });
  /** Every digger of the crew in play votes for the same grave (or stop). */
  t.dig = (tile) => { for (const id of t.diggers(G.turn)) if (m.phase === 'G_DIG') cmd(id, 'g.vote', { tile }); };
  return t;
}

test('setup: 4–12 players; chosen crews need two each', () => {
  const m = newMatch({ id: 'g', code: 'G', hostId: 'p0' });
  for (let i = 0; i < 3; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'graverobbers' });
  assert.equal(setupReport(m).ok, false);
  addPlayer(m, { id: 'p3', name: NAMES[3] });
  assert.equal(setupReport(m).ok, true);
  updateSettings(m, { g: { crews: 'chosen', crew: { p0: 'B', p1: 'B', p2: 'B', p3: 'G' } } });
  assert.equal(setupReport(m).ok, false, 'a crew of one');
});

test('the deal: 25 graves, 9 for the first crew, 8 for the other, 7 empty, 1 Death; distinct words', () => {
  for (const tiles of ['words', 'icons']) {
    const rng = seededRng(11);
    const m = newMatch({ id: 'g', code: 'G', hostId: 'p0' });
    for (let i = 0; i < 6; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
    updateSettings(m, { mode: 'graverobbers', g: { tiles } });
    m.players.forEach((p) => { p.ready = true; });
    startMatch(m, rng, 1e6);
    const G = m.G;
    assert.equal(G.tiles.length, 25);
    const c = (k) => G.tiles.filter((t) => t.k === k).length;
    assert.equal(c(G.first), 9);
    assert.equal(c(G.first === 'B' ? 'G' : 'B'), 8);
    assert.equal(c('N'), 7);
    assert.equal(c('D'), 1);
    const labels = G.tiles.map((t) => t.w ?? t.icon);
    assert.equal(new Set(labels).size, 25);
    if (tiles === 'icons') for (const x of labels) assert.ok(EMBLEMS[x]);
    assert.equal(G.crews.B.length + G.crews.G.length, 6);
    assert.ok(G.crews.B.includes(G.caps.B) && G.crews.G.includes(G.caps.G));
  }
  assert.ok(ICON_POOL.length >= 60);
});

test('privacy: only the two Undertakers see the burial register', () => {
  const t = setup();
  assert.ok(playerView(t.m, 'p0').me.g.register);
  assert.ok(playerView(t.m, `p${t.half}`).me.g.register);
  assert.equal(playerView(t.m, 'p1').me.g.register, undefined);
  assert.ok(publicView(t.m).graverobbers.tiles.every((x) => x.k === null), 'no kinds on closed graves');
  assert.equal(JSON.stringify(playerView(t.m, 'p1')).includes('"register"'), false);
});

test('signs: only the Undertaker in play; one word, not on the board; 1–9', () => {
  const t = setup();
  const { m, cmd } = t;
  assert.equal(m.phase, 'G_SIGN');
  assert.throws(() => cmd('p1', 'g.sign', { word: 'zzzq', n: 2 }), /Undertaker/);
  assert.throws(() => cmd(t.cap.G, 'g.sign', { word: 'zzzq', n: 2 }), /Undertaker/);
  assert.throws(() => t.sign(2, 'two words'), /One word/);
  assert.throws(() => t.sign(2, t.G.tiles[3].w), /on the board/);
  assert.throws(() => t.sign(0), /1 to 9/);
  t.sign(2);
  assert.equal(m.phase, 'G_DIG');
  assert.equal(publicView(m).graverobbers.sign.word, 'zzzq');
});

test('digging: own relic digs on, an empty grave ends the turn, the other crew\'s relic is theirs', () => {
  const t = setup();
  const { m, G } = t;
  t.sign(2);
  t.dig(0);
  assert.equal(G.found.B, 1);
  assert.equal(m.phase, 'G_DIG', 'one dig left');
  t.dig(17);
  assert.equal(G.turn, 'G', 'an empty grave passes the turn');
  assert.equal(m.phase, 'G_SIGN');
  t.sign(3);
  t.dig(1); // a Moon relic, dug by the Sun
  assert.equal(G.found.B, 2);
  assert.equal(G.turn, 'B');
});

test('the vote: the most votes digs; a tie goes to the coin; no votes means stop', () => {
  const t = setup({ n: 8 });
  const { m, G, cmd } = t;
  const ds = t.diggers('B');
  assert.equal(ds.length, 3);
  t.sign(3);
  cmd(ds[0], 'g.vote', { tile: 0 }); cmd(ds[1], 'g.vote', { tile: 0 }); cmd(ds[2], 'g.vote', { tile: 17 });
  assert.equal(m.phase, 'G_DIG', 'split votes wait for the timer');
  assert.deepEqual(publicView(m).graverobbers.votes[ds[0]], 0, 'votes are public');
  t.advance();
  assert.ok(G.tiles[0].open && !G.tiles[17].open);
  cmd(ds[0], 'g.vote', { tile: 1 }); cmd(ds[1], 'g.vote', { tile: 17 });
  t.advance();
  const tie = m.publicLog.filter((l) => l.ev === 'g-dig').at(-1).coin;
  assert.ok(tie && tie.options.length === 2, 'a coin settles the tie');
  // No votes at all: the crew stops.
  if (m.phase === 'G_DIG') { t.advance(); assert.equal(m.phase, 'G_SIGN'); }
});

test('stopping early earns one bonus dig; it never stacks; none for stopping on the bonus dig', () => {
  const t = setup();
  const { G } = t;
  t.sign(2); t.dig(0); t.dig('stop');
  assert.equal(G.bonus.B, 1, 'stopped with a dig of the number left');
  t.sign(1); t.dig(9); t.dig('stop'); // the Sun: dig, then their turn ended by digs used up? (n=1: used up)
  if (G.turn === 'G') t.dig('stop');
  assert.equal(G.turn, 'B');
  t.sign(1);
  assert.equal(G.digs, 2, 'the number plus the bonus');
  assert.equal(G.bonus.B, 0, 'consumed');
  t.dig(1); // used 1 = the number; one bonus dig left
  t.dig('stop');
  assert.equal(G.bonus.B, 0, 'stopping on the bonus dig earns nothing');
});

test('winning: all relics, even dug by the other crew; Death\'s grave loses at once', () => {
  let t = setup();
  t.sign(9);
  for (let i = 0; i < 9; i++) t.dig(i);
  assert.equal(t.m.phase, 'ENDED');
  assert.equal(t.G.winner, 'B');
  assert.equal(t.m.gScores.p1, 1);
  assert.ok(publicView(t.m).graverobbers.tiles.every((x) => x.k), 'the register is public at the end');
  t = setup();
  t.sign(1); t.dig(24);
  assert.equal(t.G.winner, 'G');
  assert.equal(t.G.cause, 'death');
});

test('Undertakers rotate between games of a match', () => {
  const rng = seededRng(5);
  const m = newMatch({ id: 'g', code: 'G', hostId: 'p0' });
  for (let i = 0; i < 6; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'graverobbers', g: { games: 3, crews: 'chosen', crew: { p0: 'B', p1: 'B', p2: 'B', p3: 'G', p4: 'G', p5: 'G' } } });
  m.players.forEach((p) => { p.ready = true; });
  startMatch(m, rng, 1e6);
  const first = { ...m.G.caps };
  m.gMatch.played = 1;
  m.phase = 'LOBBY';
  m.players.forEach((p) => { p.ready = true; });
  startMatch(m, rng, 2e6);
  assert.notEqual(m.G.caps.B, first.B);
});

test('bots play whole games in words and icons, at 4 and 10 players', () => {
  for (const tiles of ['words', 'icons']) for (const n of [4, 10]) for (let g = 0; g < 3; g++) {
    const rng = seededRng(g + n * 13 + (tiles === 'icons' ? 99 : 0));
    const m = newMatch({ id: 'b', code: 'B', hostId: 'p0' });
    for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i], bot: true });
    updateSettings(m, { mode: 'graverobbers', g: { tiles } });
    m.players.forEach((p) => { p.ready = true; });
    let now = 1e6;
    startMatch(m, rng, now);
    for (let guard = 0; m.phase !== 'ENDED' && guard < 4000; guard++) {
      let acted = false;
      for (const p of m.players) {
        const d = botDecide(m, p.id, rng);
        if (d?.cmd) { try { playerCommand(m, p.id, { ...d.cmd, phaseId: m.phaseId }, rng, (now += 10)); acted = true; } catch { /* stale */ } }
        if (m.phase === 'ENDED') break;
      }
      if (!acted && m.phase !== 'ENDED') hostAdvance(m, rng, (now += 10));
    }
    assert.equal(m.phase, 'ENDED', `${tiles} ${n} game ${g}`);
    assert.ok(m.G.winner);
  }
});

test('crews by seat (the default): the first half of the table is the Moon; moving a seat changes crew', async () => {
  const { moveSeat } = await import('../engine/game.js');
  const { crewsFor } = await import('../engine/graverobbers.js');
  const m = newMatch({ id: 'g', code: 'G', hostId: 'p0' });
  for (let i = 0; i < 5; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'graverobbers' });
  assert.equal(m.settings.g?.crews ?? 'seats', 'seats');
  assert.deepEqual(crewsFor(m.players, m.settings), { B: ['p0', 'p1', 'p2'], G: ['p3', 'p4'] });
  moveSeat(m, 'p2', 1); // p2 moves past p3
  assert.deepEqual(crewsFor(m.players, m.settings), { B: ['p0', 'p1', 'p3'], G: ['p2', 'p4'] });
  m.players.forEach((p) => { p.ready = true; });
  startMatch(m, seededRng(2), 1e6);
  assert.deepEqual(m.G.crews, { B: ['p0', 'p1', 'p3'], G: ['p2', 'p4'] });
});
