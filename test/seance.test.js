// Dead Set: Séance — rules from SEANCE.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { botDecide } from '../server/bots.js';
import { ROWS, DIFFICULTY, deceiverCount, fitsAnswer, fitsDecoy, fitCount } from '../engine/seance.js';
import { VISIONS, MOTIF_TAGS, STORY_TAGS, TAGS } from '../engine/seancecontent.js';
import { SCENARIO } from '../engine/content.js';
import { EMBLEMS } from '../public/emblems.js';
import { NAMES } from './helpers.js';

/** A Séance at `n` players: p0 is the Ghost, `dec` are the Deceivers (ids), the truth is index 0 of every row. */
function setup({ n = 6, dec = ['p5'], settings = {}, ack = true } = {}) {
  const rng = seededRng(5);
  const m = newMatch({ id: 's1', code: 'SEAN01', hostId: 'p0' });
  for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'seance', s: { ghost: 'host', ghostId: 'p0', ...settings } });
  m.players.forEach((p) => { p.ready = true; });
  let now = 1_000_000;
  startMatch(m, rng, now);
  // Fix the Deceivers and the truth for the test.
  for (const p of m.players) if (p.id !== 'p0') p.roleId = dec.includes(p.id) ? 'S_DECEIVER' : 'S_MEDIUM';
  m.S.deceivers = [...dec];
  m.S.swapsLeft = Object.fromEntries(dec.map((id) => [id, m.config.swaps]));
  for (const r of ROWS) { m.S.truth[r] = m.S.board[r][0]; }
  const cmd = (id, type, payload = {}) => playerCommand(m, id, { type, payload, phaseId: m.phaseId }, rng, (now += 10));
  const advance = () => hostAdvance(m, rng, (now += 10));
  const readers = () => m.players.map((p) => p.id).filter((id) => id !== 'p0');
  const t = { m, rng, cmd, advance, readers, S: () => m.S };
  if (ack) for (const p of m.players) cmd(p.id, 's.ack');
  /** The Ghost sends every reader a vision and every reader marks a hunch: the visions go public. */
  t.visions = () => {
    for (const id of readers()) if (m.phase === 'S_VISION') cmd('p0', 's.send', { target: id, vision: m.S.hand[0] });
    for (const id of readers()) if (m.phase === 'S_VISION' && m.S.deceivers.length) cmd(id, 's.hunch', { target: readers().find((x) => x !== id) });
  };
  /** Lay hands: `pick(id)` → the card each reader's hand rests on; the Ghost is done. */
  t.hands = (pick) => {
    if (m.phase !== 'S_HANDS') return;
    cmd('p0', 's.done');
    for (const id of readers()) if (m.phase === 'S_HANDS') cmd(id, 's.hand', { card: pick(id) });
  };
  t.round = (pick) => { t.visions(); t.hands(pick); };
  /** A wrong card still in the current row. */
  t.wrong = () => m.S.board[m.S.at].find((c) => c !== m.S.truth[m.S.at] && !m.S.struck[m.S.at].includes(c));
  return t;
}

test('setup: 4–10 players; Deceivers by table size; a host-chosen Ghost must be seated', () => {
  assert.equal(deceiverCount(4, { s: {} }), 0);
  assert.equal(deceiverCount(5, { s: {} }), 1);
  assert.equal(deceiverCount(9, { s: { deceivers: 'two' } }), 2);
  assert.equal(deceiverCount(8, { s: { deceivers: 'two' } }), 1);
  assert.equal(deceiverCount(4, { s: { deceivers: 'one' } }), 1);
  assert.equal(deceiverCount(7, { s: { deceivers: 'none' } }), 0);
  const m = newMatch({ id: 's', code: 'S', hostId: 'p0' });
  for (let i = 0; i < 3; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
  updateSettings(m, { mode: 'seance' });
  assert.equal(setupReport(m).ok, false, 'three players');
  addPlayer(m, { id: 'p3', name: NAMES[3] });
  assert.equal(setupReport(m).ok, true);
  updateSettings(m, { s: { ghost: 'host', ghostId: 'nobody' } });
  assert.equal(setupReport(m).ok, false, 'the Ghost is not seated');
  updateSettings(m, { s: { ghostId: 'p2' } });
  assert.equal(setupReport(m).ok, true);
});

test('the start: a public, silent Ghost; the truth only for the Ghost and the Deceiver; the board holds it', () => {
  const t = setup({ ack: false });
  const { m } = t;
  assert.equal(m.phase, 'S_INTRO');
  assert.equal(publicView(m).seance.ghost, 'p0');
  assert.ok(m.players.find((p) => p.id === 'p0').statuses.some((s) => s.type === 'MUTE'), 'the Ghost cannot chat');
  assert.deepEqual(playerView(m, 'p0').me.s.truth, m.S.truth);
  assert.deepEqual(playerView(m, 'p5').me.s.truth, m.S.truth);
  assert.equal(playerView(m, 'p1').me.s.truth, undefined);
  assert.equal(publicView(m).seance.truth, undefined);
  assert.equal(publicView(m).seance.deceiverIds, undefined);
  for (const r of ROWS) {
    assert.equal(m.S.board[r].length, DIFFICULTY.standard.size);
    assert.ok(m.S.board[r].includes(m.S.truth[r]));
  }
  for (const p of m.players) t.cmd(p.id, 's.ack');
  assert.equal(m.phase, 'S_VISION');
  assert.equal(m.S.hand.length, 8);
});

test('one question at a time: who, then where, then why; the visions for it stay on the table', () => {
  const t = setup();
  const { m } = t;
  assert.equal(m.S.at, 'WHO');
  t.round(() => t.wrong());
  assert.equal(m.S.at, 'WHO', 'a wrong answer keeps the question open');
  assert.equal(m.S.seen.WHO.length, 5, 'five readers, five visions');
  t.round(() => m.S.truth.WHO);
  assert.equal(m.S.at, 'WHERE');
  assert.equal(publicView(m).seance.seen.WHO.length, 10, 'both rounds of WHO visions stay public');
  assert.equal(m.S.seen.WHERE.length, 0);
  assert.equal(m.S.round, 3);
});

test('fair dealing: the Ghost\'s hand always holds visions that fit the answer; the Deceiver\'s fit a wrong card', () => {
  for (let seed = 1; seed < 30; seed++) {
    const rng = seededRng(seed);
    const m = newMatch({ id: 's', code: 'S', hostId: 'p0' });
    for (let i = 0; i < 6; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i] });
    updateSettings(m, { mode: 'seance' });
    m.players.forEach((p) => { p.ready = true; });
    startMatch(m, rng, 1e6);
    hostAdvance(m, rng, 1e6 + 10);
    const row = m.S.at;
    const truth = m.S.truth[row];
    const rest = m.S.board[row].filter((c) => c !== truth);
    assert.equal(m.S.hand.length, 8, 'five readers + 3');
    assert.ok(m.S.hand.filter((x) => fitsAnswer(x, row, truth, rest)).length >= fitCount('standard', 5), `seed ${seed}`);
    const [d] = m.S.deceivers;
    assert.ok(m.S.dhand[d].some((x) => fitsDecoy(x, row, truth, rest)), `decoys, seed ${seed}`);
  }
});

test('visions: the Ghost sends (and can change) one per reader; they go public only at the reveal', () => {
  const t = setup();
  const { m, cmd } = t;
  const [v1, v2] = m.S.hand;
  cmd('p0', 's.send', { target: 'p1', vision: v1 });
  cmd('p0', 's.send', { target: 'p1', vision: v2 });
  assert.equal(m.S.sent.p1, v2);
  assert.ok(m.S.hand.includes(v1), 'the replaced vision returns to the hand');
  assert.equal(publicView(m).seance.seen.WHO.length, 0);
  assert.equal(playerView(m, 'p1').me.s.vision, undefined, 'the reader sees it at the reveal');
  assert.throws(() => cmd('p1', 's.send', { target: 'p2', vision: m.S.hand[0] }), /Ghost/);
  // The deadline: unsent visions go out from the hand.
  t.advance();
  assert.equal(m.phase, 'S_HANDS');
  for (const id of t.readers()) assert.ok(m.S.shown[id] != null);
  assert.equal(playerView(m, 'p1').me.s.vision, v2);
});

test('hunches: every reader marks one while the Ghost chooses (the Deceiver\'s cover); the window waits for them', () => {
  const t = setup();
  const { m, cmd } = t;
  for (const id of t.readers()) cmd('p0', 's.send', { target: id, vision: m.S.hand[0] });
  assert.equal(m.phase, 'S_VISION', 'still waiting for the hunches');
  assert.equal(playerView(m, 'p5').action.type, playerView(m, 'p2').action.type, 'the same screen for the Deceiver');
  assert.throws(() => cmd('p1', 's.hunch', { target: 'p1' }), /another/);
  assert.throws(() => cmd('p1', 's.hunch', { target: 'p0' }), /another/);
  for (const id of t.readers()) cmd(id, 's.hunch', { target: id === 'p1' ? 'p2' : 'p1' });
  assert.equal(m.phase, 'S_HANDS');
  assert.equal(playerView(m, 'p3').me.s.lastHunch, 'p1', 'kept for the next round and the Naming');
  assert.equal(JSON.stringify(publicView(m)).includes('"hunch'), false, 'hunches stay private until the end');
  // No Deceiver: nobody hunches.
  const q = setup({ n: 4, dec: [] });
  assert.equal(playerView(q.m, 'p1').action.type, 'swait');
  for (const id of q.readers()) q.cmd('p0', 's.send', { target: id, vision: q.m.S.hand[0] });
  assert.equal(q.m.phase, 'S_HANDS');
});

test('the Deceiver swaps another reader\'s vision for one of its own; nobody can tell', () => {
  const t = setup();
  const { m, cmd } = t;
  const fake = m.S.dhand.p5[0];
  assert.throws(() => cmd('p5', 's.swap', { target: 'p5', vision: fake }), /another/);
  assert.throws(() => cmd('p2', 's.swap', { target: 'p1', vision: fake }));
  cmd('p5', 's.swap', { target: 'p1', vision: fake });
  t.visions();
  assert.equal(m.phase, 'S_HANDS');
  assert.equal(m.S.shown.p1, fake);
  assert.notEqual(m.S.sent.p1, fake);
  assert.equal(m.S.swapsLeft.p5, m.config.swaps - 1);
  assert.equal(playerView(m, 'p1').me.s.vision, fake);
  assert.equal(JSON.stringify(publicView(m)).includes('"swap'), false, 'no swap in public');
});

test('cold spots: only the Ghost, a limited number; the round waits for the Ghost', () => {
  const t = setup();
  const { m, cmd } = t;
  t.visions();
  assert.equal(m.S.cold, 2, 'two by default');
  assert.throws(() => cmd('p1', 's.cold', { target: 'p2' }), /Ghost/);
  cmd('p0', 's.cold', { target: 'p1' });
  cmd('p0', 's.cold', { target: 'p2' });
  assert.throws(() => cmd('p0', 's.cold', { target: 'p3' }), /No cold/);
  assert.deepEqual(publicView(m).seance.frosted, ['p1', 'p2']);
  assert.ok(m.S.seen.WHO.find((x) => x.to === 'p1').frost);
  for (const id of t.readers()) cmd(id, 's.hand', { card: m.S.truth.WHO });
  assert.equal(m.phase, 'S_HANDS', 'every hand is down, but the Ghost is still looking');
  cmd('p0', 's.done');
  assert.equal(m.S.solved.WHO, m.S.truth.WHO);
});

test('hands: the card under the most is asked; a tie is settled at random, never skipped; a candle per round', () => {
  const t = setup({ n: 6, dec: [] });
  const { m, cmd } = t;
  t.visions();
  assert.throws(() => cmd('p0', 's.hand', { card: m.S.truth.WHO }), /Ghost/);
  assert.throws(() => cmd('p1', 's.hand', { card: m.S.board.WHERE[0] }), /row/);
  cmd('p1', 's.hand', { card: m.S.board.WHO[1] });
  cmd('p1', 's.hand', { card: null });
  assert.equal(m.S.hands.p1, undefined, 'a hand can be lifted');
  assert.deepEqual(publicView(m).seance.handsIn, []);
  // Two on one wrong card, two on another, one on the truth: a tie between the two wrong cards.
  const [w1, w2] = m.S.board.WHO.filter((c) => c !== m.S.truth.WHO);
  t.hands((id) => ({ p1: w1, p2: w1, p3: w2, p4: w2, p5: m.S.truth.WHO })[id]);
  const h = m.S.history[0];
  assert.equal(h.verdict.tie, true);
  assert.ok([w1, w2].includes(h.verdict.pick));
  assert.equal(h.verdict.right, false);
  assert.ok(m.S.struck.WHO.includes(h.verdict.pick));
  assert.equal(m.S.burnt, 1);
  assert.deepEqual(publicView(m).seance.past[0].hands.p5, m.S.truth.WHO, 'hands are public after the answer');
  // Nobody lays a hand: the planchette drifts to a card anyway.
  t.visions();
  t.advance();
  assert.equal(m.S.history[1].verdict.drift, true);
  assert.equal(m.S.burnt, 2);
});

test('brute force fails: three questions, seven candles, six cards each', () => {
  // Asking every card in turn needs up to 15 rounds; the clock has 7.
  const t = setup({ n: 4, dec: [] });
  while (t.m.phase !== 'ENDED') t.round(() => t.wrong() ?? t.m.S.truth[t.m.S.at]);
  assert.equal(t.m.S.result, 'lost');
  assert.equal(t.m.S.burnt, 7);
});

test('the end: answer all three, then name the Deceiver: full or hollow victory; scores', () => {
  for (const [named, result] of [['p5', 'full'], ['p1', 'hollow']]) {
    const t = setup();
    const { m, cmd } = t;
    while (m.phase !== 'S_NAMING') t.round(() => m.S.truth[m.S.at]);
    assert.equal(m.S.burnt, 3);
    assert.throws(() => cmd('p0', 's.name', { target: 'p5' }), /Ghost/);
    for (const id of t.readers()) cmd(id, 's.name', { target: id === named ? 'p2' : named });
    assert.equal(m.phase, 'ENDED');
    assert.equal(m.S.result, result);
    if (result === 'full') { assert.equal(m.sScores.p1, 2); assert.equal(m.sScores.p0, 2); assert.equal(m.sScores.p5, 0); }
    else { assert.equal(m.sScores.p1, 1); assert.equal(m.sScores.p5, 1); }
    assert.ok(publicView(m).seance.truth, 'the truth at the end');
    assert.ok(publicView(m).seance.history?.length);
  }
});

test('the clock burns out: the Deceiver wins', () => {
  const t = setup();
  while (t.m.phase !== 'ENDED') t.round(() => t.wrong() ?? t.m.S.truth[t.m.S.at]);
  assert.equal(t.m.S.result, 'deceiver');
  assert.equal(t.m.sScores.p5, 3);
});

test('no Deceiver at four: solving the murder is a full victory at once', () => {
  const t = setup({ n: 4, dec: [] });
  while (t.m.phase !== 'ENDED') t.round(() => t.m.S.truth[t.m.S.at]);
  assert.equal(t.m.S.result, 'full');
});

test('two Deceivers: the table names two', () => {
  const t = setup({ n: 9, dec: ['p7', 'p8'], settings: { deceivers: 'two' } });
  const { m, cmd } = t;
  assert.deepEqual(playerView(m, 'p7').me.s.fellows, ['p8']);
  while (m.phase !== 'S_NAMING') t.round(() => m.S.truth[m.S.at]);
  assert.throws(() => cmd('p1', 's.name', { targets: ['p7'] }), /two/);
  for (const id of t.readers()) cmd(id, 's.name', { targets: id === 'p7' || id === 'p8' ? ['p1', 'p2'] : ['p7', 'p8'] });
  assert.equal(m.S.result, 'full');
});

test('privacy: a Medium never sees the truth, the Deceivers or another reader\'s private vision early', () => {
  const t = setup();
  const { m } = t;
  const v = JSON.stringify(playerView(m, 'p1'));
  assert.ok(!v.includes('"truth"'));
  assert.ok(!v.includes('"dhand"'));
  assert.ok(!v.includes('"cards"'), 'not the Ghost\'s hand');
  assert.equal(playerView(m, 'p1').me.s.role, 'MEDIUM');
  assert.equal(playerView(m, 'p5').me.s.role, 'DECEIVER');
});

test('content: every vision is drawn from existing motifs; every tag lives on visions and on story cards', () => {
  assert.equal(VISIONS.length, 84);
  for (const vi of VISIONS) {
    assert.ok(vi.motifs.length >= 2 && vi.motifs.length <= 3);
    for (const x of vi.motifs) { assert.ok(EMBLEMS[x], `emblem ${x}`); assert.ok(MOTIF_TAGS[x], `tags ${x}`); }
  }
  for (const r of ROWS) assert.equal(STORY_TAGS[r].length, SCENARIO[r].length, r);
  for (const tag of TAGS) {
    assert.ok(VISIONS.some((vi) => vi.tags.includes(tag)), `a vision for ${tag}`);
    assert.ok(ROWS.some((r) => STORY_TAGS[r].some((c) => c.includes(tag))), `a card for ${tag}`);
  }
});

test('bots play whole games to the end at 4, 7 and 10 players', () => {
  for (const n of [4, 7, 10]) {
    for (let g = 0; g < 3; g++) {
      const rng = seededRng(g + n * 11);
      const m = newMatch({ id: 'b', code: 'B', hostId: 'p0' });
      for (let i = 0; i < n; i++) addPlayer(m, { id: `p${i}`, name: NAMES[i], bot: true });
      updateSettings(m, { mode: 'seance', s: { deceivers: n >= 9 ? 'two' : 'auto' } });
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
      assert.equal(m.phase, 'ENDED', `${n} players, game ${g}`);
      assert.ok(m.S.result);
    }
  }
});
