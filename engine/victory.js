// Victory evaluation (§6, plus the optional sides). Always called on committed
// (post-transaction) state.
//
// Hostile sides: Death, the Cult and the Ripper. The town ("non-Death") wins
// only once every hostile side is gone. The Jester counts as an ordinary
// "other" player for the majority checks.
export function checkVictory(m, { jesterSentencedId = null } = {}) {
  if (jesterSentencedId) {
    return { winner: 'JESTER', reason: 'The Jester was sentenced by the town — and that was the plan all along.', jesterId: jesterSentencedId };
  }
  const alive = m.players.filter((p) => p.alive);
  const total = alive.length;
  const count = (a) => alive.filter((p) => p.alignment === a).length;
  const D = count('DEATH');
  const C = count('CULT');
  const R = count('RIPPER');
  if (total === 0) return { winner: 'DRAW', reason: 'Nobody is left standing. The match is a draw.' };
  // Lovers: the last two alive are the pair.
  if (total === 2 && alive[0].lover && alive[0].lover === alive[1].id) return { winner: 'LOVERS', reason: 'Only the two lovers remain, and love outlives the town.' };
  // The Ripper: alone, or alone with a single player who is no killer.
  if (R > 0 && (R === total || (total === 2 && R === 1 && D === 0 && C === 0))) {
    return { winner: 'RIPPER', reason: R === total ? 'The Ripper is the last one standing.' : 'The Ripper stands alone with a single victim left.' };
  }
  if (D === 0 && C === 0 && R === 0) return { winner: 'NON_DEATH', reason: 'No Death-aligned player remains alive.' };
  if (D > total - D) return { winner: 'DEATH', reason: 'Death now outnumbers everyone else still alive.' };
  if (C > total - C) return { winner: 'CULT', reason: 'The Cult now outnumbers everyone else still alive.' };
  if (m.config?.finalTwoDeath && total === 2 && D === 1) return { winner: 'DEATH', reason: 'Death is among the final two, and the table rule gives Death the win.' };
  return null;
}
