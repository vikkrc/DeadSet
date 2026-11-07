// Victory evaluation (§6). Always called on committed (post-transaction) state.
export function checkVictory(m, { jesterSentencedId = null } = {}) {
  if (jesterSentencedId) {
    return { winner: 'JESTER', reason: 'The Jester was sentenced by the town — and that was the plan all along.', jesterId: jesterSentencedId };
  }
  const alive = m.players.filter((p) => p.alive);
  const D = alive.filter((p) => p.alignment === 'DEATH').length;
  const O = alive.length - D;
  if (D === 0 && O === 0) return { winner: 'DRAW', reason: 'Nobody is left standing. The match is a draw.' };
  if (D === 0) return { winner: 'NON_DEATH', reason: 'No Death-aligned player remains alive.' };
  if (D > O) return { winner: 'DEATH', reason: 'Death now outnumbers everyone else still alive.' };
  return null;
}
