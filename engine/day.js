// Ballot weights and the daytime tally (§12 D4–D5, §13 Paranoia / Majority Rule / Vengeful Ghosts).
import { ROLES } from './content.js';
import { byId, hasRule } from './state.js';

export function ballotWeight(m, p) {
  if (!p.alive) return 0;
  if (p.statuses.some((s) => s.type === 'NO_VOTE')) return 0;
  const role = ROLES[p.roleId];
  let w = role.voteBase ?? 1;
  if (hasRule(m, 'PARANOIA')) w += 1;
  if (role.voteBonus) w += role.voteBonus;
  return w;
}

/**
 * Tally the locked ballots. Missing ballots are abstentions. Ties at the top,
 * zero weight, or a failed Majority Rule threshold sentence nobody.
 */
export function tally(m) {
  const d = m.day;
  const living = {};
  const totals = {};
  let abstain = 0;
  for (const id of d.eligibleVoters) {
    const p = byId(m, id);
    const choice = d.ballots[id] ?? 'ABSTAIN';
    const w = ballotWeight(m, p);
    if (choice === 'ABSTAIN' || w === 0 || !p.alive) { abstain++; continue; }
    living[choice] = (living[choice] || 0) + w;
    totals[choice] = (totals[choice] || 0) + w;
  }
  let ghosts = 0;
  for (const id of d.ghostVoters) {
    const p = byId(m, id);
    if (p.alive) continue; // revived before lock: ghost ballot void
    const choice = d.ghostBallots[id];
    if (!choice || choice === 'ABSTAIN') continue;
    totals[choice] = (totals[choice] || 0) + 1;
    ghosts++;
  }
  const majority = hasRule(m, 'MAJORITY_RULE');
  const source = majority ? living : totals;
  const entries = Object.entries(source).filter(([, w]) => w > 0).sort((a, b) => b[1] - a[1]);
  const result = { totals, living, abstain, ghosts, majority, winner: null, reason: '' };
  if (!entries.length) { result.reason = 'No valid votes were cast. No one is sentenced.'; return result; }
  if (entries.length > 1 && entries[0][1] === entries[1][1]) { result.reason = 'The vote is tied at the top. No one is sentenced.'; return result; }
  const [top, weight] = entries[0];
  if (majority) {
    const threshold = d.eligibleVoters.length / 2;
    result.threshold = threshold;
    if (!(weight > threshold)) {
      result.reason = ['Majority Rule: {w} is not more than half of {n} eligible voters. No one is sentenced.', { w: weight, n: d.eligibleVoters.length }];
      return result;
    }
  }
  result.winner = top;
  return result;
}
