// Dead Set: Mimic — rules from MIMIC.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport, rematch } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { botDecide } from '../server/bots.js';
import { SCENARIO } from '../engine/content.js';
import { mimicBoardHint } from '../engine/mimic.js';
import { NAMES } from './helpers.js';

/** A game at `n` players; the Mimic is fixed to `mimic` and p0 holds the lantern. */
function setup({ n = 5, settings = {}, mimic = 'p2', ack = true } = {}) {
  const rng = seededRng(7);
  const m = newMatch({ id: 'q1', code: 'MIMIC1', hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'mimic', q: settings });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now);
  const Q = m.Q;
  if (mimic && Q.mimic !== mimic) {
    // Swap the cards so the chosen player is the Mimic.
    const old = Q.mimic;
    Q.who[old] = Q.who[mimic];
    delete Q.who[mimic];
    Q.mimic = mimic;
  }
  const cmd = (id, type, payload = {}) => playerCommand(m, id, { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  if (ack) { for (const p of m.players) cmd(p.id, 'q.ack'); Q.asker = 'p0'; Q.lastAsker = null; }
  return { m, Q, rng, cmd, advance, tick: (ms) => { now += ms; return now; }, now: () => now };
}

test('setup: 4–12 players', () => {
  const m = newMatch({ id: 'q', code: 'Q', hostId: 'p0' });
  for (let i = 0; i < 3; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'mimic' });
  assert.equal(setupReport(m).ok, false);
  addPlayer(m, { id: 'p3', name: NAMES[3] });
  assert.equal(setupReport(m).ok, true);
});

test('the deal: one Mimic; the Living share the place and hold different characters; the board holds the place', () => {
  for (const board of [12, 16, 20, 30]) {
    const { m, Q } = setup({ n: 8, settings: { board }, mimic: null, ack: false });
    assert.equal(Q.board.length, Math.min(board, SCENARIO.WHERE.length));
    assert.ok(Q.board.includes(Q.loc));
    assert.equal(new Set(Q.board).size, Q.board.length);
    const living = m.players.filter((p) => p.id !== Q.mimic);
    assert.equal(living.length, 7);
    assert.equal(new Set(living.map((p) => Q.who[p.id])).size, 7, 'different characters');
    assert.equal(Q.who[Q.mimic], undefined);
  }
});

test('privacy: the place and characters reach only Living phones; the Mimic only its own phone', () => {
  const { m, Q } = setup({ mimic: 'p2' });
  const mv = playerView(m, 'p2');
  assert.equal(mv.me.q.mimic, true);
  assert.equal(mv.me.q.loc, undefined);
  const lv = playerView(m, 'p1');
  assert.equal(lv.me.q.loc, Q.loc);
  assert.equal(lv.me.q.mimic, undefined);
  const pub = JSON.stringify(publicView(m));
  assert.equal(pub.includes('"loc"'), false, 'no place in the public view');
  assert.equal(pub.includes('"who"'), false);
  assert.equal(JSON.stringify(playerView(m, 'p1')).includes('"mimic":"p2"'), false, 'nobody learns the Mimic');
  // The TV hint is a trust option, off by default, and never part of any phone's view.
  assert.equal(mimicBoardHint(m), null);
  m.config.tvHint = true;
  assert.deepEqual(mimicBoardHint(m), { loc: Q.loc });
  assert.equal(JSON.stringify(playerView(m, 'p2')).includes(`"hint"`), false);
});

test('the lantern: only its holder asks; never back to the one who just asked; it passes on', () => {
  const { m, Q, cmd } = setup();
  assert.equal(m.phase, 'Q_ASK');
  assert.throws(() => cmd('p1', 'q.ask', { to: 'p3' }), /lantern/);
  assert.throws(() => cmd('p0', 'q.ask', { to: 'p0' }), /someone else/);
  cmd('p0', 'q.ask', { to: 'p1' });
  assert.equal(Q.asker, 'p1');
  assert.throws(() => cmd('p1', 'q.ask', { to: 'p0' }), /ask back/);
  cmd('p1', 'q.ask', { to: 'p3' });
  assert.equal(publicView(m).mimic.asked.length, 2);
});

test('accusations: once each; the clock stops; only a unanimous table convicts', () => {
  const { m, Q, cmd, tick } = setup({ mimic: 'p2' });
  tick(60_000);
  cmd('p0', 'q.accuse', { target: 'p1' });
  assert.equal(m.phase, 'Q_VOTE');
  const left = Q.remain;
  assert.ok(left > 0 && left < 480_000);
  assert.throws(() => cmd('p1', 'q.vote', { yes: false }), /accused/);
  cmd('p2', 'q.vote', { yes: true }); cmd('p3', 'q.vote', { yes: true }); cmd('p4', 'q.vote', { yes: false });
  assert.equal(m.phase, 'Q_ASK', 'divided: the questions go on');
  assert.ok(Math.abs((m.deadline - tick(0)) - left) < 100, 'the clock restarts where it stopped');
  assert.throws(() => cmd('p0', 'q.accuse', { target: 'p3' }), /already/);
});

test('convicting a Living player: the Mimic wins (+2)', () => {
  const { m, Q, cmd } = setup({ mimic: 'p2' });
  cmd('p0', 'q.accuse', { target: 'p1' });
  for (const id of ['p2', 'p3', 'p4']) cmd(id, 'q.vote', { yes: true });
  assert.equal(m.phase, 'ENDED');
  assert.equal(Q.result.side, 'MIMIC');
  assert.equal(Q.result.how, 'wrong');
  assert.equal(m.qScores.p2, 2);
  assert.equal(publicView(m).mimic.result.mimic, 'p2', 'revealed at the end');
});

test('catching the Mimic: last guess wrong → Living win (+1 each, accuser +1); right → the Mimic steals it', () => {
  let t = setup({ mimic: 'p2' });
  t.cmd('p0', 'q.accuse', { target: 'p2' });
  for (const id of ['p1', 'p3', 'p4']) t.cmd(id, 'q.vote', { yes: true });
  assert.equal(t.m.phase, 'Q_GUESS');
  assert.throws(() => t.cmd('p1', 'q.guess', { loc: t.Q.loc }), /Only the Mimic/);
  const wrong = t.Q.board.find((x) => x !== t.Q.loc);
  t.cmd('p2', 'q.guess', { loc: wrong });
  assert.equal(t.Q.result.side, 'LIVING');
  assert.equal(t.Q.result.how, 'caught');
  assert.equal(t.m.qScores.p0, 2);
  assert.equal(t.m.qScores.p1, 1);
  assert.equal(t.m.qScores.p2, 0);

  t = setup({ mimic: 'p2' });
  t.cmd('p0', 'q.accuse', { target: 'p2' });
  for (const id of ['p1', 'p3', 'p4']) t.cmd(id, 'q.vote', { yes: true });
  t.cmd('p2', 'q.guess', { loc: t.Q.loc });
  assert.equal(t.Q.result.how, 'lastGuess');
  assert.equal(t.m.qScores.p2, 2);

  t = setup({ mimic: 'p2', settings: { lastGuess: false } });
  t.cmd('p0', 'q.accuse', { target: 'p2' });
  for (const id of ['p1', 'p3', 'p4']) t.cmd(id, 'q.vote', { yes: true });
  assert.equal(t.m.phase, 'ENDED', 'no last guess when it is off');
  assert.equal(t.Q.result.side, 'LIVING');
});

test('unmasking: the Mimic names the place (+3), or loses', () => {
  let t = setup({ mimic: 'p2' });
  assert.throws(() => t.cmd('p1', 'q.unmask'), /Only the Mimic/);
  t.cmd('p2', 'q.unmask');
  assert.equal(t.m.phase, 'Q_GUESS');
  t.cmd('p2', 'q.guess', { loc: t.Q.loc });
  assert.equal(t.Q.result.how, 'guess');
  assert.equal(t.m.qScores.p2, 3);
  t = setup({ mimic: 'p2' });
  t.cmd('p2', 'q.unmask');
  t.advance(); // the guess timed out
  assert.equal(t.Q.result.side, 'LIVING');
  assert.equal(t.Q.result.how, 'guessWrong');
});

test('time\'s up: the final vote convicts the most-pointed player', () => {
  let t = setup({ mimic: 'p2' });
  t.advance();
  assert.equal(t.m.phase, 'Q_FINAL');
  assert.throws(() => t.cmd('p0', 'q.final', { target: 'p0' }), /someone else/);
  for (const [a, b] of [['p0', 'p2'], ['p1', 'p2'], ['p2', 'p3'], ['p3', 'p2'], ['p4', 'p1']]) t.cmd(a, 'q.final', { target: b });
  assert.equal(t.m.phase, 'Q_GUESS', 'the Mimic had the most votes: caught, with a last guess');
});

test('the final vote: a tie, or a Living player, and the Mimic wins', () => {
  let t = setup({ mimic: 'p2' });
  t.advance();
  for (const [a, b] of [['p0', 'p1'], ['p1', 'p0'], ['p2', 'p3'], ['p3', 'p4'], ['p4', 'p0']]) t.cmd(a, 'q.final', { target: b });
  assert.equal(t.Q.result.how, 'wrong', 'p0 had the most votes and is Living');
  t = setup({ mimic: 'p2' });
  t.advance();
  for (const [a, b] of [['p0', 'p1'], ['p1', 'p0'], ['p2', 'p3'], ['p3', 'p4']]) t.cmd(a, 'q.final', { target: b });
  t.advance();
  assert.equal(t.Q.result.how, 'escaped', 'a four-way tie');
});

test('a match: scores carry over and the Mimic is never the same player twice running', () => {
  const rng = seededRng(3);
  const m = newMatch({ id: 'q', code: 'Q', hostId: 'p0' });
  for (let i = 0; i < 4; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'mimic', q: { games: 5 } });
  let last = null;
  for (let g = 0; g < 5; g++) {
    m.players.forEach((p) => { p.ready = true; });
    startMatch(m, rng, 1e6 + g * 1e6);
    assert.notEqual(m.Q.mimic, last);
    last = m.Q.mimic;
    hostAdvance(m, rng, 1e6 + g * 1e6 + 1); // intro
    hostAdvance(m, rng, 1e6 + g * 1e6 + 2); // time's up
    hostAdvance(m, rng, 1e6 + g * 1e6 + 3); // no final votes: escaped
    assert.equal(m.phase, 'ENDED');
    rematch(m, { ready: true });
  }
  assert.equal(m.qMatch.played, 5);
  assert.ok(Object.values(m.qScores).reduce((a, b) => a + b, 0) === 10, 'five escapes, +2 each');
});

test('bots play whole games at 4, 8 and 12 players', () => {
  for (const n of [4, 8, 12]) for (let g = 0; g < 4; g++) {
    const rng = seededRng(g + n * 31);
    const m = newMatch({ id: 'b', code: 'B', hostId: 'p0' });
    for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i], bot: true });
    updateSettings(m, { mode: 'mimic' });
    m.players.forEach((p) => { p.ready = true; });
    let now = 1e6;
    startMatch(m, rng, now);
    for (let guard = 0; m.phase !== 'ENDED' && guard < 3000; guard++) {
      let acted = false;
      for (const p of m.players) {
        const d = botDecide(m, p.id, rng);
        if (d?.cmd) { try { playerCommand(m, p.id, { ...d.cmd, phaseId: m.phaseId }, rng, (now += 10)); acted = true; } catch { /* stale */ } }
        if (m.phase === 'ENDED') break;
      }
      if (!acted && m.phase !== 'ENDED') hostAdvance(m, rng, (now += 10));
    }
    assert.equal(m.phase, 'ENDED', `${n} game ${g}`);
    assert.ok(['LIVING', 'MIMIC'].includes(m.Q.result.side));
  }
});
