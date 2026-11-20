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
  return out;
}
