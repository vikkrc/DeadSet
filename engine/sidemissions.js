// Dead Set: Missions — Side Missions (Beta 1).
//
// With the lobby switch on, every player is dealt one secret personal
// objective. Objectives only look at things both sides can do in the open
// (teams, votes, leading, the Candle, Hunches), and they are dealt the same way
// to everyone, so holding one never reveals your side.
//
// They are judged automatically after every vote, mission and night: the owner
// learns at once when one is won or lost. "Reach" objectives succeed the moment
// they are met; "keep" objectives fail the moment they are broken. When the
// Last Stand opens (or the game ends), whatever is still open is settled:
// a reach that was not met fails, a keep that held succeeds.
//
// In the Last Stand a completed Side Mission makes your vote count double; a
// failed one halves it.

import { priv } from './state.js';
import { shuffle } from './rng.js';

export const SIDE_WEIGHT = { done: 2, failed: 0.5, pending: 1 };

/** The pool. `fit(n)` limits table sizes; `test(s)` returns 'done', 'failed' or null (still open). */
export const SIDE_MISSIONS = {
  GO_TWICE: { kind: 'reach', text: 'Go on at least two missions.', test: (s) => (s.went >= 2 ? 'done' : null) },
  GO_THRICE: { kind: 'reach', text: 'Go on at least three missions.', fit: (n) => n >= 8, test: (s) => (s.went >= 3 ? 'done' : null) },
  STAY_BEHIND: { kind: 'keep', text: 'Go on no more than one mission.', test: (s) => (s.went >= 2 ? 'failed' : null) },
  EARLY_BIRD: { kind: 'reach', text: 'Go on mission 1 or mission 2.', test: (s) => (s.wentOn.some((k) => k <= 1) ? 'done' : s.missionsDone >= 2 ? 'failed' : null) },
  LATE_ARRIVAL: { kind: 'keep', text: 'Do not go on mission 1 or mission 2.', test: (s) => (s.wentOn.some((k) => k <= 1) ? 'failed' : null) },
  LANTERN_LEADS: { kind: 'reach', text: 'Lead a team that goes on its mission.', test: (s) => (s.ledGo >= 1 ? 'done' : null) },
  NO_LANTERN: { kind: 'keep', text: 'Never lead a team that goes on its mission.', test: (s) => (s.ledGo >= 1 ? 'failed' : null) },
  GOOD_COMPANY: { kind: 'reach', text: 'Be on a mission that succeeds.', test: (s) => (s.onOk >= 1 ? 'done' : null) },
  BAD_LUCK: { kind: 'reach', text: 'Be on a mission that fails.', test: (s) => (s.onFail >= 1 ? 'done' : null) },
  CLEAN_RECORD: { kind: 'keep', text: 'Never be on a mission that fails.', test: (s) => (s.onFail >= 1 ? 'failed' : null) },
  NAYSAYER: { kind: 'reach', text: 'Vote Reject at least three times.', test: (s) => (s.rejects >= 3 ? 'done' : null) },
  OPEN_HEART: { kind: 'keep', text: 'Never vote Reject.', test: (s) => (s.rejects >= 1 ? 'failed' : null) },
  LONE_VOICE: { kind: 'reach', text: 'Vote Reject on a team the table approves.', test: (s) => (s.rejectedApproved >= 1 ? 'done' : null) },
  LOST_CAUSE: { kind: 'reach', text: 'Vote Approve on a team the table rejects.', test: (s) => (s.approvedRejected >= 1 ? 'done' : null) },
  CONTRARIAN: { kind: 'reach', text: 'Be on the losing side of a team vote twice.', test: (s) => (s.minority >= 2 ? 'done' : null) },
  CROWD: { kind: 'keep', text: 'Always vote with the majority.', test: (s) => (s.minority >= 1 ? 'failed' : null) },
  FIRST_TRUST: { kind: 'reach', text: 'Approve the first proposal of two different missions.', test: (s) => (s.firstApproves >= 2 ? 'done' : null) },
  POPULAR: { kind: 'reach', text: 'Be named on at least three proposed teams.', test: (s) => (s.proposedOn >= 3 ? 'done' : null) },
  SELF_STARTER: { kind: 'reach', text: 'Put yourself on a team you propose.', test: (s) => (s.selfProposed >= 1 ? 'done' : null) },
  HUMBLE: { kind: 'keep', text: 'Never put yourself on a team you propose.', test: (s) => (s.selfProposed >= 1 ? 'failed' : null) },
  NEIGHBOURS: { kind: 'reach', text: 'Go on a mission together with the player on your left.', test: (s) => (s.withLeft >= 1 ? 'done' : null) },
  CANDLE_BEARER: { kind: 'reach', text: 'Hold the Candle at some point.', fit: (n, starter) => !starter, test: (s) => (s.candle ? 'done' : null) },
  STEADY_EYE: { kind: 'keep', text: 'Never change your Hunch (and place at least two).', test: (s) => (s.hunchChanged ? 'failed' : null), settle: (s) => (s.hunches >= 2 ? 'done' : 'failed') },
  RESTLESS: { kind: 'reach', text: 'Suspect three different players with your Hunches.', test: (s) => (s.hunchTargets >= 3 ? 'done' : null) },
};

const seatOrder = (m) => [...m.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);

/** Deal one objective per player, all different where the pool allows. */
export function dealSideMissions(m, rng) {
  const n = m.players.length;
  const out = {};
  const starter = m.M.candle.holder;
  let deck = shuffle(rng, Object.keys(SIDE_MISSIONS), 'side');
  for (const p of m.players) {
    const fits = (id) => !SIDE_MISSIONS[id].fit || SIDE_MISSIONS[id].fit(n, p.id === starter);
    let id = deck.find(fits);
    if (!id) { deck = shuffle(rng, Object.keys(SIDE_MISSIONS), 'side'); id = deck.find(fits); }
    deck = deck.filter((x) => x !== id);
    out[p.id] = { id, state: 'pending' };
    priv(m, p.id, ['Your Side Mission: {side}', { side: id }], 'side', { side: id });
  }
  m.M.side = out;
}

/** Everything the objectives look at, recomputed from the record for one player. */
function stats(m, pid) {
  const M = m.M;
  const order = seatOrder(m);
  const left = order[(order.indexOf(pid) + 1) % order.length];
  const s = { went: 0, wentOn: [], ledGo: 0, onOk: 0, onFail: 0, rejects: 0, rejectedApproved: 0, approvedRejected: 0, minority: 0,
    firstApproves: 0, proposedOn: 0, selfProposed: 0, withLeft: 0, candle: M.candle.past.includes(pid), hunches: 0, hunchChanged: false, hunchTargets: 0,
    missionsDone: M.results.length };
  for (const r of M.results) {
    if (r.team.includes(pid)) { s.went++; s.wentOn.push(r.mission); if (r.failed) s.onFail++; else s.onOk++; if (r.team.includes(left)) s.withLeft++; }
    if (r.leader === pid) s.ledGo++;
  }
  const firsts = new Set();
  for (const v of M.voteLog ?? []) {
    if (v.team.includes(pid)) s.proposedOn++;
    if (v.leader === pid && v.team.includes(pid)) s.selfProposed++;
    if (!(pid in v.votes)) continue;
    const yes = v.votes[pid];
    if (!yes) s.rejects++;
    if (!yes && v.approved) s.rejectedApproved++;
    if (yes && !v.approved) s.approvedRejected++;
    const majority = v.approve * 2 > v.total ? true : v.reject * 2 > v.total ? false : null;
    if (majority !== null && yes !== majority) s.minority++;
    if (yes && v.attempt === 1) firsts.add(v.mission);
  }
  s.firstApproves = firsts.size;
  const mine = M.hunches.filter((h) => h.pid === pid);
  s.hunches = mine.length;
  s.hunchChanged = mine.some((h, i) => i > 0 && h.target !== mine[i - 1].target);
  s.hunchTargets = new Set(mine.map((h) => h.target)).size;
  return s;
}

function settle(m, pid, state) {
  const o = m.M.side[pid];
  o.state = state;
  priv(m, pid, [state === 'done' ? 'Side Mission complete: {side}' : 'Side Mission failed: {side}', { side: o.id }], 'side', { side: o.id, state });
}

/** Judge every open objective. `final`: the Last Stand opens or the game ends, so settle the rest. */
export function judgeSideMissions(m, { final = false } = {}) {
  if (!m.M?.side) return;
  for (const [pid, o] of Object.entries(m.M.side)) {
    if (o.state !== 'pending') continue;
    const def = SIDE_MISSIONS[o.id];
    const s = stats(m, pid);
    const now = def.test(s);
    if (now) { settle(m, pid, now); continue; }
    if (final) settle(m, pid, def.settle ? def.settle(s) : def.kind === 'keep' ? 'done' : 'failed');
  }
}

/** A voter's weight in the Last Stand. */
export const standWeight = (m, pid) => (m.M.side ? SIDE_WEIGHT[m.M.side[pid]?.state ?? 'pending'] : 1);
