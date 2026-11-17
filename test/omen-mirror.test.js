// Beta 9: The Omen and The Mirror — rules from OMEN.md and MIRROR.md (design/TWELVE-MODES-SPEC.md §2, §5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { botDecide } from '../server/bots.js';
import { finishOf } from '../engine/omen.js';
import { targetsFor } from '../engine/mirror.js';
import { DILEMMAS } from '../public/dilemmas.js';
import { NAMES } from './helpers.js';

function table(mode, n, seed = 5) {
  const rng = seededRng(seed);
  const m = newMatch({ id: mode, code: mode.toUpperCase(), hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now);
  const cmd = (id, type, payload = {}) => playerCommand(m, id, { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  return { m, rng, cmd, advance };
}

// ── The Omen ───────────────────────────────────────────────────────────────
test('omen: 4–12 players; seven rounds; five Influence each, public', () => {
  const m = newMatch({ id: 'o', code: 'O', hostId: 'p0' });
  for (let i = 0; i < 3; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'omen' });
  assert.equal(setupReport(m).ok, false);
  const t = table('omen', 5);
  assert.equal(t.m.phase, 'O_SHOW');
  assert.equal(t.m.O.rounds, 7);
  assert.deepEqual(Object.values(publicView(t.m).omen.influence), [5, 5, 5, 5, 5]);
});

test('omen: the wheel moves by the sum of all turns, applied once (−4, +3, cancelling)', () => {
  assert.equal(finishOf(0, -4), 2, 'Life −4 → Rebirth');
  assert.equal(finishOf(1, 3), 1, 'three clockwise turns come back');
  assert.equal(finishOf(2, 0), 2);
  const t = table('omen', 4);
  t.advance(); // open the ballot
  const st = t.m.O.start;
  // Two clockwise, one anticlockwise, one still: net +1.
  t.cmd('p0', 'o.ballot', { pred: (st + 1) % 3, rot: 1 });
  t.cmd('p1', 'o.ballot', { pred: st, rot: 1 });
  t.cmd('p2', 'o.ballot', { pred: (st + 1) % 3, rot: -1 });
  assert.equal(t.m.phase, 'O_SECRET', 'waits for everyone');
  assert.equal(JSON.stringify(publicView(t.m)).includes('"rot"'), false, 'turns are private until the reveal');
  t.cmd('p3', 'o.ballot', { pred: (st + 2) % 3, rot: 0 });
  assert.equal(t.m.phase, 'O_REVEAL');
  const L = t.m.O.last;
  assert.equal(L.offset, 1);
  assert.equal(L.finish, (st + 1) % 3);
  assert.equal(t.m.O.scores.p0, 3);
  assert.equal(t.m.O.scores.p1, 0);
  assert.equal(t.m.O.scores.p2, 3);
  assert.deepEqual([t.m.O.influence.p0, t.m.O.influence.p1, t.m.O.influence.p2, t.m.O.influence.p3], [4, 4, 4, 5], 'one Influence per turn, none for standing still');
});

test('omen: changing a ballot before the close never spends twice; no Influence, no turning', () => {
  const t = table('omen', 4);
  t.advance();
  t.cmd('p0', 'o.ballot', { pred: 0, rot: 1 });
  t.cmd('p0', 'o.ballot', { pred: 1, rot: -1 });
  t.cmd('p0', 'o.ballot', { pred: 1, rot: 1 });
  t.advance();
  assert.equal(t.m.O.influence.p0, 4, 'spent once');
  t.m.O.influence.p1 = 0;
  t.advance(); t.advance(); // next round, open
  assert.throws(() => t.cmd('p1', 'o.ballot', { pred: 0, rot: 1 }), /no Influence/);
  t.cmd('p1', 'o.ballot', { pred: 0, rot: 0 });
  assert.equal(playerView(t.m, 'p1').action.type, 'oballot');
});

test('omen: timeouts mean no prediction and no turn; after seven rounds unused Influence scores 1 each; ties share', () => {
  const t = table('omen', 4);
  for (let r = 0; r < 7; r++) {
    t.advance(); // show → secret
    if (r === 0) t.cmd('p0', 'o.ballot', { pred: (t.m.O.start + 1) % 3, rot: 1 });
    t.advance(); // close
    assert.equal(t.m.phase, 'O_REVEAL');
    if (r > 0) assert.equal(t.m.O.last.offset, 0, 'nobody voted: the wheel stays');
    t.advance(); // next round / end
  }
  assert.equal(t.m.phase, 'ENDED');
  assert.equal(t.m.O.scores.p0, 3 + 4, 'a right call plus four unused Influence');
  assert.equal(t.m.O.scores.p1, 5);
  assert.deepEqual(t.m.O.winners, ['p0']);
  assert.equal(t.m.winner, 'OMEN');
});

// ── The Mirror ─────────────────────────────────────────────────────────────
test('mirror: the bank holds at least 75 distinct dilemmas, three answers each', () => {
  assert.ok(DILEMMAS.length >= 75);
  assert.equal(new Set(DILEMMAS.map((d) => d.id)).size, DILEMMAS.length);
  for (const d of DILEMMAS) { assert.equal(d.choices.length, 3); assert.equal(new Set(d.choices).size, 3); }
});

test('mirror: targets are a permutation with no self-reads; over n − 1 rounds everyone reads everyone', () => {
  for (const n of [4, 7, 12]) {
    const ids = Array.from({ length: n }, (_, i) => `p${i}`);
    const seen = Object.fromEntries(ids.map((id) => [id, new Set()]));
    for (let r = 0; r < Math.max(8, n - 1); r++) {
      const tg = targetsFor(ids, r);
      assert.equal(new Set(Object.values(tg)).size, n, `round ${r} at ${n}: everyone is read once`);
      for (const id of ids) { assert.notEqual(tg[id], id); if (r < n - 1) seen[id].add(tg[id]); }
    }
    for (const id of ids) assert.equal(seen[id].size, n - 1, 'everyone read everyone');
  }
});

test('mirror: eight dilemmas; a right prediction scores 2; the ballot needs both fields', () => {
  const t = table('mirror', 4);
  const { m } = t;
  assert.equal(m.W.deck.length, 8);
  assert.equal(new Set(m.W.deck).size, 8);
  assert.equal(m.phase, 'W_PROMPT');
  t.advance();
  assert.equal(m.phase, 'W_CHOOSE');
  assert.throws(() => t.cmd('p0', 'w.ballot', { own: 'A' }), /answer and your prediction/);
  const tg = m.W.targets;
  const own = { p0: 'A', p1: 'B', p2: 'C', p3: 'A' };
  const wrong = (x) => ['A', 'B', 'C'].find((c) => c !== x);
  for (const id of ['p0', 'p1', 'p2', 'p3']) t.cmd(id, 'w.ballot', { own: own[id], pred: id === 'p0' ? own[tg.p0] : wrong(own[tg[id]]) });
  assert.equal(m.phase, 'W_REVEAL');
  assert.equal(m.W.scores.p0, 2);
  assert.equal(publicView(m).mirror.last.answers.p1, 'B');
});

test('mirror: a timeout gives a labelled random answer and an abstaining prediction; an all-timeout round scores nothing', () => {
  const t = table('mirror', 5);
  t.advance(); // to choose
  t.cmd('p0', 'w.ballot', { own: 'A', pred: 'B' });
  t.advance(); // close
  const L = t.m.W.last;
  assert.ok(L.auto.p1 && L.auto.p4 && !L.auto.p0);
  assert.ok(['A', 'B', 'C'].includes(L.answers.p1));
  assert.equal(L.preds.p1, null);
  t.advance(); t.advance(); t.advance(); // next round, choose, close with nobody
  assert.equal(Object.keys(t.m.W.last.deltas).length, 0);
  assert.equal(Object.keys(t.m.W.last.auto).length, 5);
});

test('mirror: a fresh match avoids the dilemmas this table just saw', () => {
  const t = table('mirror', 4);
  const first = new Set(t.m.W.deck);
  for (let i = 0; i < 8 * 3; i++) t.advance();
  assert.equal(t.m.phase, 'ENDED');
  t.advance(); // back to the lobby
  t.m.players.forEach((p) => { p.ready = true; });
  startMatch(t.m, t.rng, 9e6);
  assert.equal(t.m.W.deck.filter((id) => first.has(id)).length, 0);
});

test('bots play whole games of both modes', () => {
  for (const mode of ['omen', 'mirror']) for (const n of [4, 12]) {
    const t = table(mode, n, n + 3);
    t.m.players.forEach((p) => { p.bot = true; });
    let now = 2e6;
    for (let guard = 0; t.m.phase !== 'ENDED' && guard < 4000; guard++) {
      let acted = false;
      for (const p of t.m.players) {
        const d = botDecide(t.m, p.id, t.rng);
        if (d?.cmd) { try { playerCommand(t.m, p.id, { ...d.cmd, phaseId: t.m.phaseId }, t.rng, (now += 10)); acted = true; } catch { /* stale */ } }
      }
      if (!acted && t.m.phase !== 'ENDED') hostAdvance(t.m, t.rng, (now += 10));
    }
    assert.equal(t.m.phase, 'ENDED', `${mode} at ${n}`);
  }
});
