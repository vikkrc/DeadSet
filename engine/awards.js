// F1: awards — two or three honours per game, computed at the end from the public record only (what the end
// screen already reveals). At most one award per player per game; each has an emblem from the existing set.
// An award is { id, pid, emblem, title, line } where title is an English key and line a [template, params] message.

const nameOf = (m, id) => m.players.find((p) => p.id === id)?.name ?? '';
const alignOf = (m, id) => m.players.find((p) => p.id === id)?.alignment;

/** D1: correct ghost hunches, earliest first: the target was Death and was still alive when the hunch was laid. */
export function calledIt(m) {
  return [...(m.ghostHunches ?? [])].filter((h) => alignOf(m, h.target) === 'DEATH' && alignOf(m, h.by) !== 'DEATH').sort((a, b) => a.at - b.at);
}

export function awardsFor(m, mode) {
  const out = [];
  const taken = new Set();
  const give = (id, pid, emblem, title, line) => { if (!pid || taken.has(pid)) return; taken.add(pid); out.push({ id, pid, emblem, title, line }); };
  const log = m.publicLog ?? [];
  if (mode === 'classic') {
    // First to suspect: the first to nominate someone who was Death.
    const first = log.find((l) => l.ev === 'nominate' && alignOf(m, l.target) === 'DEATH');
    if (first) give('first', first.by, 'mentalist', 'First to suspect', ['{a} was the first to accuse {b}, who was Death.', { a: nameOf(m, first.by), b: nameOf(m, first.target) }]);
    // Red herring: the innocent who drew the most votes.
    const votes = {};
    for (const l of log) if (l.ev === 'tally') for (const [id, n] of Object.entries(l.totals ?? {})) votes[id] = (votes[id] ?? 0) + (Number(n) || 0);
    const herring = Object.entries(votes).filter(([id]) => alignOf(m, id) && alignOf(m, id) !== 'DEATH').sort((a, b) => b[1] - a[1])[0];
    if (herring && herring[1] > 0) give('herring', herring[0], 'scapegoat', 'Red herring', [herring[1] === 1 ? '{a} drew a vote and was never Death.' : '{a} drew {n} votes and was never Death.', { a: nameOf(m, herring[0]), n: herring[1] }]);
    // Called it (D1): the first ghost whose hunch named Death while that Death still walked.
    const called = calledIt(m)[0];
    if (called) give('called', called.by, 'veiled', 'Called it', ['{a} named {b} from beyond the grave on Day {n}.', { a: nameOf(m, called.by), b: nameOf(m, called.target), n: called.day }]);
    // Last breath: a living player still standing at the end, when Death won.
    if (m.winner === 'DEATH') { const s = m.players.find((p) => p.alive && p.alignment !== 'DEATH'); if (s) give('breath', s.id, 'candle', 'Last breath', ['{a} was still standing when Death took the town.', { a: s.name }]); }
  }
  if (mode === 'exorcism' && m.X) {
    const X = m.X;
    const demons = new Set(m.players.filter((p) => p.roleId === 'X_DEMON').map((p) => p.id));
    const order = [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
    const sharp = order.find((id) => demons.has(X.votes?.[id]) && !demons.has(id));
    if (sharp) give('first', sharp, 'mentalist', 'First to suspect', ['{a} named the Demon.', { a: nameOf(m, sharp) }]);
    const got = {};
    for (const t of Object.values(X.votes ?? {})) got[t] = (got[t] ?? 0) + 1;
    const herring = Object.entries(got).filter(([id]) => !demons.has(id)).sort((a, b) => b[1] - a[1])[0];
    if (herring) give('herring', herring[0], 'scapegoat', 'Red herring', [herring[1] === 1 ? '{a} drew a vote and knew the word all along.' : '{a} drew {n} votes and knew the word all along.', { a: nameOf(m, herring[0]), n: herring[1] }]);
    for (const d of demons) if (!got[d]) give('tongue', d, 'demon', 'Silver tongue', ['{a}, the Demon, drew not a single vote.', { a: nameOf(m, d) }]);
  }
  if (mode === 'missions' && m.M) awardsMissions(m, give);
  if (mode === 'coffins' && m.C) awardsCoffins(m, give, log);
  if (mode === 'carnival' && m.K) awardsCarnival(m, give, log);
  if (mode === 'midnight' && m.N) awardsMidnight(m, give);
  if (mode === 'seance' && m.S) awardsSeance(m, give);
  if (mode === 'graverobbers' && m.G) awardsGrave(m, give);
  if (mode === 'mimic' && m.Q) awardsMimic(m, give);
  if (mode === 'omen' && m.O) awardsOmen(m, give);
  if (mode === 'mirror' && m.W) awardsMirror(m, give);
  return out;
}

// ── F1 for every other game. Each reads only what the end screen already shows (the record, the reveal). ──
const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
/** The single top player by a count (ties go to the earlier seat); null when nobody scored. */
function top(m, counts, { min = 1 } = {}) {
  let best = null;
  for (const id of seatOrder(m)) if ((counts[id] ?? 0) >= min && (best === null || counts[id] > counts[best])) best = id;
  return best;
}
const tally = (ids) => ids.reduce((o, id) => (id ? { ...o, [id]: (o[id] ?? 0) + 1 } : o), {});
const many = (n, one, other) => (n === 1 ? one : other);

function awardsMissions(m, give) {
  const M = m.M;
  const first = [...(M.hunches ?? [])].sort((a, b) => a.mission - b.mission).find((h) => alignOf(m, h.target) === 'DEATH' && alignOf(m, h.pid) !== 'DEATH');
  if (first) give('first', first.pid, 'mentalist', 'First to suspect', ['{a} had Death in their sights by mission {n}.', { a: nameOf(m, first.pid), b: nameOf(m, first.target), n: first.mission + 1 }]);
  const led = top(m, tally((M.results ?? []).filter((r) => !r.failed).map((r) => r.leader)));
  if (led) { const n = M.results.filter((r) => !r.failed && r.leader === led).length; give('leader', led, 'lantern', 'Steady hand', [many(n, '{a} led a mission home.', '{a} led {n} missions home.'), { a: nameOf(m, led), n }]); }
  const teams = tally((M.results ?? []).flatMap((r) => r.team));
  const welcome = top(m, teams, { min: 2 });
  if (welcome) give('welcome', welcome, 'approve', 'Welcome everywhere', ['{a} went on {n} missions.', { a: nameOf(m, welcome), n: teams[welcome] }]);
}

function awardsCoffins(m, give, log) {
  const S = m.C;
  const digger = top(m, S.wins ?? {});
  if (digger) give('digger', digger, 'skeleton', 'Master digger', [many(S.wins[digger], '{a} made a clean dig.', '{a} made {n} clean digs.'), { a: nameOf(m, digger), n: S.wins[digger] }]);
  const bids = log.filter((l) => l.ev === 'c-bid');
  const high = bids.reduce((b, l) => (!b || l.n > b.n ? l : b), null);
  if (high && high.n >= 3) give('bold', high.pid, 'gambler', 'Bold bidder', ['{a} once promised to open {n} coffins.', { a: nameOf(m, high.pid), n: high.n }]);
  const traps = tally(log.filter((l) => l.ev === 'c-open' && l.face === 'C' && l.owner).map((l) => l.owner));
  const trapper = top(m, traps);
  if (trapper) give('curse', trapper, 'curse', 'Booby trap', [many(traps[trapper], '{a}\'s curse caught a digger.', '{a}\'s curse caught {n} diggers.'), { a: nameOf(m, trapper), n: traps[trapper] }]);
}

function awardsCarnival(m, give, log) {
  const S = m.K;
  const claims = tally(log.filter((l) => l.ev === 'k-claim').map((l) => l.by));
  const bold = top(m, claims, { min: 2 });
  if (bold) give('bold', bold, 'mimic', 'Bold claimant', ['{a} claimed a mask {n} times.', { a: nameOf(m, bold), n: claims[bold] }]);
  const dancer = top(m, tally(log.filter((l) => l.ev === 'k-swap').map((l) => l.by)), { min: 2 });
  if (dancer) give('dancer', dancer, 'witch', 'Life of the ball', ['{a} never stopped dancing.', { a: nameOf(m, dancer) }]);
  const liar = top(m, S.liar ?? {});
  if (liar) give('liar', liar, 'charlatan', 'Caught out', [many(S.liar[liar], '{a} was caught in a lie and paid for it.', '{a} was caught in {n} lies and paid for them.'), { a: nameOf(m, liar), n: S.liar[liar] }]);
}

function awardsMidnight(m, give) {
  const S = m.N;
  const deathAtDawn = (id) => S.cards?.[id] === 'DEATH';
  const sharp = seatOrder(m).find((id) => S.votes?.[id] && deathAtDawn(S.votes[id]) && !deathAtDawn(id));
  if (sharp) give('first', sharp, 'mentalist', 'Pointed true', ['{a} pointed at Death.', { a: nameOf(m, sharp) }]);
  const herring = top(m, Object.fromEntries(Object.entries(S.tally ?? {}).filter(([id]) => !deathAtDawn(id))));
  if (herring) give('herring', herring, 'scapegoat', 'Red herring', [many(S.tally[herring], '{a} drew a finger and was never Death.', '{a} drew {n} fingers and was never Death.'), { a: nameOf(m, herring), n: S.tally[herring] }]);
  const turned = seatOrder(m).find((id) => S.dealt?.[id] && S.cards?.[id] && S.dealt[id] !== S.cards[id]);
  if (turned) give('turned', turned, 'snatcher', 'Not who they were', ['{a} went to sleep as one card and woke as another.', { a: nameOf(m, turned) }]);
}

function awardsSeance(m, give) {
  const st = m.S;
  const decs = new Set(st.deceivers ?? []);
  const named = seatOrder(m).find((id) => (st.naming?.[id] ?? []).some((x) => decs.has(x)) && !decs.has(id));
  if (named) give('first', named, 'mentalist', 'Saw through it', ['{a} named the Deceiver.', { a: nameOf(m, named) }]);
  if (st.ghost) give('ghost', st.ghost, 'shade', 'Voice from beyond', [st.solved && Object.keys(st.solved).length >= 3 ? '{a}, the Ghost, was understood without a word.' : '{a}, the Ghost, sent visions from beyond.', { a: nameOf(m, st.ghost) }]);
  for (const d of decs) if (!(st.named ?? []).includes(d)) give('tongue', d, 'charlatan', 'Silver tongue', ['{a}, the Deceiver, was never named.', { a: nameOf(m, d) }]);
}

function awardsGrave(m, give) {
  const st = m.G;
  const best = (st.signs ?? []).reduce((b, x) => (!b || x.n > b.n ? x : b), null);
  if (best && best.n >= 2) give('sign', best.by, 'undertaker', 'Golden sign', ['{a}\'s sign “{w}” pointed at {n} graves.', { a: nameOf(m, best.by), w: best.word, n: best.n }]);
  const crewOf = (id) => Object.keys(st.crews ?? {}).find((c) => st.crews[c].includes(id));
  const diggers = seatOrder(m).filter((id) => !Object.values(st.caps ?? {}).includes(id));
  const lucky = diggers.find((id) => crewOf(id) === st.winner);
  if (lucky) give('crew', lucky, 'succeed', 'Steady shovel', ['{a} dug with the winning crew.', { a: nameOf(m, lucky) }]);
  const deathDig = (st.digsLog ?? []).find((d) => d.kind === 'D');
  const unlucky = deathDig ? (st.crews?.[deathDig.crew] ?? []).find((id) => !Object.values(st.caps ?? {}).includes(id)) : null;
  if (unlucky) give('death', unlucky, 'death', 'Wrong grave', ['{a}\'s crew opened Death\'s grave.', { a: nameOf(m, unlucky) }]);
}

function awardsMimic(m, give) {
  const st = m.Q;
  const fv = st.finalVotes ?? {};
  const sharp = seatOrder(m).find((id) => fv[id] === st.mimic && id !== st.mimic);
  if (sharp) give('first', sharp, 'mentalist', 'First to suspect', ['{a} pointed at the Mimic.', { a: nameOf(m, sharp) }]);
  const counts = tally(Object.values(fv).filter((x) => x && x !== st.mimic));
  const herring = top(m, counts);
  if (herring) give('herring', herring, 'scapegoat', 'Red herring', [many(counts[herring], '{a} drew a finger and was never the Mimic.', '{a} drew {n} fingers and was never the Mimic.'), { a: nameOf(m, herring), n: counts[herring] }]);
  if (st.mimic && st.result?.side === 'MIMIC') give('tongue', st.mimic, 'mimic', 'Perfect copy', ['{a}, the Mimic, blended in to the end.', { a: nameOf(m, st.mimic) }]);
  else if (st.mimic && st.result?.guess != null) give('guess', st.mimic, 'mimic', 'Last gamble', ['{a}, the Mimic, made a last guess at the place.', { a: nameOf(m, st.mimic) }]);
}

function awardsOmen(m, give) {
  const O = m.O;
  const hits = {};
  for (const h of O.history ?? []) for (const [id, b] of Object.entries(h.ballots ?? {})) if (b.pred === h.finish) hits[id] = (hits[id] ?? 0) + 1;
  const seer = top(m, hits, { min: 2 });
  if (seer) give('seer', seer, 'oracle', 'Clear sight', ['{a} read the wheel right {n} times.', { a: nameOf(m, seer), n: hits[seer] }]);
  const thrift = top(m, O.influence ?? {}, { min: 1 });
  if (thrift) give('thrift', thrift, 'coin', 'Thrifty', [many(O.influence[thrift], '{a} kept one Influence to the end.', '{a} kept {n} Influence to the end.'), { a: nameOf(m, thrift), n: O.influence[thrift] }]);
  const turns = {};
  for (const h of O.history ?? []) for (const [id, b] of Object.entries(h.ballots ?? {})) if (b.rot) turns[id] = (turns[id] ?? 0) + 1;
  const hand = top(m, turns, { min: 2 });
  if (hand) give('hand', hand, 'gambler', 'Hand on the wheel', ['{a} turned the wheel {n} times.', { a: nameOf(m, hand), n: turns[hand] }]);
}

function awardsMirror(m, give) {
  const W = m.W;
  const read = {}; const readRight = {};
  for (const h of W.history ?? []) {
    const ans = h.answers ?? {};
    for (const [id, tg] of Object.entries(h.targets ?? {})) {
      const pred = h.preds?.[id];
      if (!pred) continue;
      read[tg] = (read[tg] ?? 0) + 1;
      if (pred === ans[tg]) readRight[tg] = (readRight[tg] ?? 0) + 1;
    }
  }
  const book = top(m, readRight, { min: 2 });
  if (book) give('book', book, 'mentalist', 'Open book', ['{a} was read right {n} times.', { a: nameOf(m, book), n: readRight[book] }]);
  const enigma = seatOrder(m).filter((id) => (read[id] ?? 0) >= 2).sort((a, b) => (readRight[a] ?? 0) / read[a] - (readRight[b] ?? 0) / read[b])[0];
  if (enigma && (readRight[enigma] ?? 0) / read[enigma] < 0.5) give('enigma', enigma, 'veiled', 'Enigma', ['{a} kept everyone guessing.', { a: nameOf(m, enigma) }]);
  const scores = W.scores ?? {};
  const reader = top(m, scores, { min: 2 });
  if (reader) give('reader', reader, 'oracle', 'Mind reader', ['{a} read others for {n} points.', { a: nameOf(m, reader), n: scores[reader] }]);
}
