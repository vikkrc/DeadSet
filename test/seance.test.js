// Dead Set: Séance — rules from SEANCE.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, addPlayer, startMatch, playerCommand, hostAdvance, updateSettings, setupReport } from '../engine/game.js';
import { playerView, publicView } from '../engine/views.js';
import { seededRng } from '../engine/rng.js';
import { botDecide } from '../server/bots.js';
import { ROWS, DIFFICULTY, deceiverCount } from '../engine/seance.js';
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
  /** Send every reader a vision and mark every impression: the visions go public. */
  t.visions = () => {
    for (const id of readers()) for (let k = 0; k < DIFFICULTY[m.config.difficulty].visions; k++) if (m.phase === 'S_VISION') cmd('p0', 's.send', { target: id, vision: m.S.hand[0] });
    for (const id of readers()) if (m.phase === 'S_VISION') cmd(id, 's.impress', { card: m.S.board[m.S.assign[id]].find((c) => !m.S.struck[m.S.assign[id]].includes(c)) });
  };
  /** Light candles: `pick(row)` → the card each reader lights. */
  t.light = (pick) => { if (m.phase === 'S_DISCUSS') advance(); for (const id of readers()) if (['S_CANDLE', 'S_LAST'].includes(m.phase)) cmd(id, 's.light', { card: pick(m.S.assign[id], id) }); };
  t.round = (pick) => { t.visions(); t.light(pick); };
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
  assert.ok(m.S.hand.length >= 7);
});

test('assignments spread the readers over the open rows and rotate', () => {
  const t = setup();
  const { m } = t;
  const first = { ...m.S.assign };
  const counts = ROWS.map((r) => Object.values(first).filter((x) => x === r).length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
  // Nobody solves anything: everyone lights a wrong card in round one.
  t.round((row) => m.S.board[row][1]);
  assert.equal(m.S.round, 2);
  for (const id of t.readers()) assert.notEqual(m.S.assign[id], first[id], 'rotated');
});

test('visions: the Ghost sends (and can change) one per reader; they go public only at the reveal', () => {
  const t = setup();
  const { m, cmd } = t;
  const [v1, v2] = m.S.hand;
  cmd('p0', 's.send', { target: 'p1', vision: v1 });
  cmd('p0', 's.send', { target: 'p1', vision: v2 });
  assert.deepEqual(m.S.sent.p1, [v2]);
  assert.ok(m.S.hand.includes(v1), 'the replaced vision returns to the hand');
  assert.equal(publicView(m).seance.shown, undefined);
  assert.equal(playerView(m, 'p1').me.s.visions, undefined, 'the reader sees it at the reveal');
  assert.throws(() => cmd('p1', 's.send', { target: 'p2', vision: m.S.hand[0] }), /Ghost/);
  // The deadline: unsent visions go out at random.
  t.advance();
  assert.equal(m.phase, 'S_DISCUSS');
  for (const id of t.readers()) assert.equal(m.S.shown[id].length, 1);
  assert.ok(publicView(m).seance.shown);
  assert.deepEqual(playerView(m, 'p1').me.s.visions, [v2]);
});

test('the Deceiver swaps another reader\'s vision for one of its own; nobody can tell', () => {
  const t = setup();
  const { m, cmd } = t;
  const fake = m.S.dhand.p5[0];
  assert.throws(() => cmd('p5', 's.swap', { target: 'p5', vision: fake }), /another/);
  assert.throws(() => cmd('p2', 's.swap', { target: 'p1', vision: fake }));
  cmd('p5', 's.swap', { target: 'p1', vision: fake });
  // Same screen as a Medium's.
  assert.equal(playerView(m, 'p5').action.type, playerView(m, 'p2').action.type);
  t.visions();
  assert.equal(m.phase, 'S_DISCUSS');
  assert.deepEqual(m.S.shown.p1, [fake]);
  assert.notDeepEqual(m.S.sent.p1, [fake]);
  assert.equal(m.S.swapsLeft.p5, m.config.swaps - 1);
  assert.equal(JSON.stringify(publicView(m)).includes('"swap'), false, 'no swap in public');
});

test('cold spots: only the Ghost, a limited number, frost on every screen', () => {
  const t = setup({ settings: { colds: 2 } });
  const { m, cmd } = t;
  t.visions();
  assert.throws(() => cmd('p1', 's.cold', { target: 'p2' }), /Ghost/);
  cmd('p0', 's.cold', { target: 'p1' });
  cmd('p0', 's.cold', { target: 'p2' });
  assert.throws(() => cmd('p0', 's.cold', { target: 'p3' }), /No cold/);
  assert.deepEqual(publicView(m).seance.frosted, ['p1', 'p2']);
});

test('verdicts: the plurality is put to the spirit; right solves, wrong strikes; ties give nothing; a candle per round', () => {
  const t = setup({ n: 7, dec: [] });
  const { m } = t;
  // Two readers per row: on WHO both light the truth, on WHERE both a wrong card, on WHY they split.
  const split = {};
  t.round((row, id) => {
    if (row === 'WHO') return m.S.truth.WHO;
    if (row === 'WHERE') return m.S.board.WHERE[1];
    split[row] = (split[row] ?? 0) + 1;
    return m.S.board.WHY[split[row]];
  });
  const h = m.S.history[0];
  assert.equal(h.verdicts.WHO.right, true);
  assert.equal(m.S.solved.WHO, m.S.truth.WHO);
  assert.equal(h.verdicts.WHERE.right, false);
  assert.ok(m.S.struck.WHERE.includes(m.S.board.WHERE[1]));
  assert.equal(h.verdicts.WHY.pick, null, 'a tie');
  assert.equal(m.S.burnt, 1, 'one candle for the round; a wrong verdict burns nothing extra');
  assert.ok(publicView(m).seance.past[0].lit, 'candles are public after the verdict');
  // Solved rows take no readers.
  assert.ok(!Object.values(m.S.assign).includes('WHO'));
});

test('the end: solve all three, then name the Deceiver: full or hollow victory; scores', () => {
  for (const [named, result] of [['p5', 'full'], ['p1', 'hollow']]) {
    const t = setup();
    const { m, cmd } = t;
    while (m.phase !== 'S_NAMING') t.round((row) => m.S.truth[row]);
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

test('the clock burns out: the Deceiver wins; with one row open, the last breath', () => {
  // No last breath: the Deceiver wins.
  let t = setup({ settings: { lastBreath: false } });
  while (t.m.phase !== 'ENDED') t.round((row) => t.m.S.board[row].find((c) => c !== t.m.S.truth[row] && !t.m.S.struck[row].includes(c)) ?? 'abstain');
  assert.equal(t.m.S.result, 'deceiver');
  assert.equal(t.m.sScores.p5, 3);
  // Last breath: WHO and WHERE solved, WHY open when the candles run out.
  t = setup();
  const { m } = t;
  while (m.phase !== 'S_LAST' && m.phase !== 'ENDED') t.round((row) => (row === 'WHY' ? 'abstain' : m.S.truth[row]));
  assert.equal(m.phase, 'S_LAST');
  assert.ok(Object.values(m.S.assign).every((r) => r === 'WHY'), 'everyone reads the last row');
  t.light(() => m.S.truth.WHY);
  assert.equal(m.phase, 'S_NAMING');
});

test('no Deceiver at four: solving the murder is a full victory at once', () => {
  const t = setup({ n: 4, dec: [] });
  while (t.m.phase !== 'ENDED') t.round((row) => t.m.S.truth[row]);
  assert.equal(t.m.S.result, 'full');
});

test('two Deceivers: the table names two', () => {
  const t = setup({ n: 9, dec: ['p7', 'p8'], settings: { deceivers: 'two' } });
  const { m, cmd } = t;
  assert.deepEqual(playerView(m, 'p7').me.s.fellows, ['p8']);
  while (m.phase !== 'S_NAMING') t.round((row) => m.S.truth[row]);
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
