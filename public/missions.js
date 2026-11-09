// Dead Set: Missions — phone screens, moments and TV board pieces.
// Pure renderers over the filtered view; the shell (app.js) passes its helpers
// in `h` and merges `missionActs` into its action table.
import { glyph } from './icons.js';
import { t, th, tmh, roleF, mcardF, missionStoryLine, scen } from './i18n.js';
import { backdropHtml } from './backdrops.js';

export const isMissionPhase = (ph) => typeof ph === 'string' && ph.startsWith('M_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];
const CARD_GLYPH = {
  REGULAR: 'mission', LANTERN: 'lantern', FRESH_FACES: 'fresh', EXTRA_HAND: 'plus', SKELETON_CREW: 'minus', MASKED_VOTE: 'mask',
  SHORT_PATIENCE: 'hourglass', WARD: 'guardian', STEADFAST: 'shield', BRITTLE: 'crack', SMOKE: 'smoke', GRAND: 'crown',
  TRAIL: 'clue', WITNESS: 'mentalist', HAUNTED_ROAD: 'veiled',
};
export const cardGlyph = (id) => glyph(CARD_GLYPH[id] ?? 'mission');
const name = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');

// ── Track, card, grid ──────────────────────────────────────────────────────
/** Five mission discs + the proposal pips. */
export function trackHtml(v, { big = false } = {}) {
  const M = v.missions;
  if (!M) return '';
  const discs = M.sizes.map((s, k) => {
    const r = M.results.find((x) => x.mission === k);
    const state = r ? (r.failed ? 'fail' : 'ok') : k === M.mission && v.phase !== 'ENDED' ? 'now' : '';
    return `<li class="md ${state} ${s.fails > 1 ? 'two' : ''}" data-key="md-${k}" title="${esc(t('Mission {n}', { n: k + 1 }))}">
      <span class="md-n">${r ? glyph(r.failed ? 'sabotage' : 'succeed') : s.size}</span>
      ${s.fails > 1 && !r ? `<b class="md-two" title="${esc(t('Needs two Sabotage cards to fail'))}">2</b>` : ''}
      ${r?.weight > 1 ? '<b class="md-x2">×2</b>' : ''}</li>`;
  }).join('');
  const pips = v.phase === 'ENDED' || !['M_PROPOSE', 'M_VOTE'].includes(v.phase) ? '' : `<div class="pips" data-key="pips" aria-label="${esc(t('Proposal {k} of {n}', { k: M.attempt, n: M.maxAttempts }))}">
    ${Array.from({ length: M.maxAttempts }, (_, i) => `<i class="${i < M.attempt - 1 ? 'used' : i === M.attempt - 1 ? 'now' : ''} ${i === M.maxAttempts - 1 ? 'hammer' : ''}"></i>`).join('')}
    <span class="kicker">${M.forced ? t('This proposal goes ahead whatever the vote') : t('Proposal {k} of {n}', { k: M.attempt, n: M.maxAttempts })}</span></div>`;
  return `<section class="mtrack ${big ? 'big' : ''}" data-key="mtrack">
    <div class="mscore"><span class="ok">${glyph('succeed')}<b>${M.score.S}</b></span><ol class="discs">${discs}</ol><span class="fail"><b>${M.score.F}</b>${glyph('sabotage')}</span></div>
    ${pips}</section>`;
}

/** A mission card face (also used by the card-draw moment). */
export function cardFace(id, { size = null, fails = null } = {}) {
  const special = id !== 'REGULAR';
  return `<div class="mcard ${special ? 'special' : ''}" data-key="mcard-${id}">
    <span class="mc-kick kicker">${t(special ? 'Mission card' : 'Regular Mission')}</span>
    <span class="mc-art">${cardGlyph(id)}</span>
    <b class="mc-name">${esc(mcardF(id, 'name'))}</b>
    <small class="mc-text">${esc(mcardF(id, 'text'))}</small>
    ${size ? `<span class="mc-foot">${th(fails > 1 ? 'Team of {n} · fails with {f} Sabotage' : 'Team of {n} · fails with one Sabotage', { n: size, f: fails })}</span>` : ''}
  </div>`;
}

function cardBanner(v) {
  const M = v.missions;
  if (!M?.card || v.phase === 'ENDED') return '';
  const s = M.sizes[M.mission];
  const story = missionStoryLine(v.scenario, M.mission);
  return `<div class="mc-banner ${M.card.id !== 'REGULAR' ? 'special' : ''}" data-key="mcb-${M.mission}">${cardGlyph(M.card.id)}<div>
    <span class="kicker">${t('Mission {n} of 5', { n: M.mission + 1 })} · ${th(s.fails > 1 ? 'team of {n}, two Sabotage to fail' : 'team of {n}', { n: s.size })}</span>
    ${story ? `<span class="mcb-step">${esc(story.step)}</span>` : ''}
    <b>${esc(mcardF(M.card.id, 'name'))}</b>${M.card.id !== 'REGULAR' ? `<small>${esc(mcardF(M.card.id, 'text'))}</small>` : ''}</div></div>`;
}

/** Who went where, who voted how: the deduction grid. */
export function gridHtml(v) {
  const M = v.missions;
  if (!M?.results.length) return `<p class="small muted">${t('No mission has set out yet.')}</p>`;
  const players = [...v.players].sort((a, b) => a.seat - b.seat);
  const head = `<tr><th></th>${M.results.map((r) => `<th class="${r.failed ? 'fail' : 'ok'}" title="${esc(mcardF(r.card, 'name'))}">${ROMAN[r.mission + 1]}${r.card !== 'REGULAR' ? `<span class="g-card">${cardGlyph(r.card)}</span>` : ''}</th>`).join('')}</tr>`;
  const rows = players.map((p) => `<tr data-key="gr-${p.id}"><th>${esc(p.name)}</th>${M.results.map((r) => {
    const went = r.team.includes(p.id);
    const led = r.leader === p.id;
    const last = r.attempts.filter((a) => a.goes).at(-1);
    const vote = last?.votes ? last.votes[p.id] : undefined;
    return `<td class="${went ? 'went' : ''} ${went && r.failed ? 'f' : ''}">${led ? `<span class="g-lead" title="${esc(t('Leader'))}">${glyph('lantern')}</span>` : ''}${went ? '<b class="g-dot"></b>' : ''}${vote === undefined ? '' : `<i class="g-v ${vote ? 'y' : 'n'}" title="${esc(t(vote ? 'Approved' : 'Rejected'))}"></i>`}</td>`;
  }).join('')}</tr>`).join('');
  const foot = `<tr class="g-res"><th>${t('Result')}</th>${M.results.map((r) => `<td class="${r.failed ? 'fail' : 'ok'}">${r.fails == null ? '?' : r.fails}${glyph(r.failed ? 'sabotage' : 'succeed')}</td>`).join('')}</tr>`;
  return `<div class="mgrid-wrap" data-key="mgrid"><table class="mgrid">${head}${rows}${foot}</table>
    <p class="small muted">${t('Dot: on the team. Lantern: led it. Gold/red mark: approved/rejected the team that went. Bottom row: Sabotage cards played.')}</p></div>`;
}

/** Ring badges: lantern, Candle, haunted, ward, unmasked Death. */
export function missionMarks(v) {
  const M = v.missions;
  if (!M) return {};
  const marks = {};
  const add = (id, html) => { if (id) marks[id] = (marks[id] ?? '') + html; };
  if (v.phase !== 'ENDED') add(M.leader, `<span class="mk lantern" title="${esc(t('Mission Leader'))}">${glyph('lantern')}</span>`);
  add(M.candle.holder, `<span class="mk candle" title="${esc(t('Holds the Candle'))}">${glyph('candle')}</span>`);
  add(M.haunted, `<span class="mk haunt" title="${esc(t('Haunted'))}">${glyph('veiled')}</span>`);
  if (M.proposal?.ward && ['M_VOTE', 'M_MISSION', 'M_RESULT'].includes(v.phase)) add(M.proposal.ward, `<span class="mk ward">${glyph('guardian')}</span>`);
  for (const id of M.unmasked ?? []) add(id, `<span class="mk unmask">${glyph('death')}</span>`);
  return marks;
}

/** Players on the current proposal (highlighted on the ring). */
const teamNow = (v) => (['M_VOTE', 'M_MISSION', 'M_RESULT'].includes(v.phase) ? v.missions?.proposal?.team ?? [] : []);

// ── What I know ────────────────────────────────────────────────────────────
export function knowledgeHtml(me) {
  const parts = [];
  if (me.seesDeath) parts.push(`<div class="panel tight seal" data-key="k-medium"><span class="kicker blood">${t('You see Death in')}</span><p>${me.seesDeath.length ? esc(me.seesDeath.map((x) => x.name).join(', ')) : t('No one. Death is veiled from you.')}</p><p class="small muted">${t('Steer the expedition without giving yourself away.')}</p></div>`);
  if (me.candles) parts.push(`<div class="panel tight" data-key="k-believer"><span class="kicker">${t(me.candles.length > 1 ? 'Two candles burn for you' : 'The Medium')}</span><p>${esc(me.candles.map((x) => x.name).join(me.candles.length > 1 ? ` ${t('or')} ` : ''))}</p><p class="small muted">${t(me.candles.length > 1 ? 'One is the Medium, one is the Charlatan.' : 'Protect them.')}</p></div>`);
  if (me.teammates && !me.stray) parts.push(`<div class="panel tight seal" data-key="k-death"><span class="kicker blood">${t('Your Death team')}</span><p>${me.teammates.length ? me.teammates.map((x) => `${esc(x.name)}${x.reaper ? ` <small>(${esc(roleF('REAPER', 'name'))})</small>` : ''}`).join(', ') : t('No one else you can see.')}</p></div>`);
  if (me.stray) parts.push(`<div class="panel tight seal" data-key="k-stray"><span class="kicker blood">${t('You serve Death alone')}</span><p class="small">${t('You do not know the rest of Death, and they do not know you.')}</p></div>`);
  if (me.candleSeen?.length) parts.push(`<div class="panel tight" data-key="k-candle"><span class="kicker">${glyph('candle')} ${t('By Candlelight')}</span>${me.candleSeen.map((c) => `<p>${esc(c.name)}: <b class="${c.death ? 'blood' : ''}">${t(c.death ? 'Death' : 'Living')}</b></p>`).join('')}</div>`);
  return parts.join('');
}

// ── Pick contexts (tap a seat) ─────────────────────────────────────────────
export function missionPicks(v, S) {
  const a = v.action;
  const me = v.me;
  const out = [];
  if (!a || !me || me.moderator) return out;
  switch (a.type) {
    case 'mpropose': {
      const sel = S.sel.team ?? [];
      const ids = v.players.map((p) => p.id).filter((id) => id !== a.haunted);
      out.push({ key: 'team', label: t('Team'), act: 'mPickTeam', ids, selected: sel, hint: th('Pick {n} · {k} chosen', { n: a.size, k: sel.length }) });
      if (a.ward && sel.length === a.size) out.push({ key: 'ward', label: t('Ward'), act: 'mPickWard', ids: sel, selected: [S.sel.ward], hint: t('Ward one member') });
      break;
    }
    case 'mnight':
      if (a.done) break;
      if (a.candle) out.push({ key: 'candle', label: t('Candle'), act: 'mPickCandle', ids: a.candle.targets.filter((id) => id !== me.id), selected: [S.sel.candle ?? a.candle.choice], hint: t('Learn one side') });
      if (a.witness) out.push({ key: 'witness', label: t('Witness'), act: 'mPickWitness', ids: a.witness.targets, selected: [S.sel.witness ?? a.witness.choice], hint: t('See one card') });
      if (a.haunt) out.push({ key: 'haunt', label: t('Haunt'), act: 'mPickHaunt', ids: a.haunt.targets, selected: [S.sel.haunt ?? a.haunt.choice], tone: 'kill', hint: t('Keep one off the next mission') });
      out.push({ key: 'hunch', label: t('Hunch'), act: 'mPickHunch', ids: v.players.map((p) => p.id).filter((id) => id !== me.id), selected: [S.sel.hunch ?? a.hunch], hint: t('Who do you suspect most?') });
      break;
    case 'mstand':
      out.push({ key: 'stand', label: t('Name'), act: 'mPickAccuse', ids: a.targets, selected: [S.sel.accuse ?? a.choice], tone: 'kill', stamp: a.choice, hint: t(a.choice ? 'Recorded · tap to change' : 'Who walks with Death?') });
      break;
    case 'mreckon':
      out.push({ key: 'reckon', label: t('The Medium'), act: 'mPickReckon', ids: a.targets, selected: [S.sel.reckon ?? a.mine], tone: 'kill', hint: t(a.reaper ? 'Name the Medium' : 'Suggest the Medium') });
      break;
    default: break;
  }
  return out;
}

export function missionCenter(v, pick) {
  const M = v.missions;
  const prog = v.progress;
  const hint = pick?.hint ? `<span class="c-hint">${esc(pick.hint)}</span>` : '';
  const clock = '<span class="c-clock clock" data-clock></span>';
  switch (v.phase) {
    case 'M_REVEAL': return `<span class="c-emblem">${glyph('mission')}</span><span class="c-sub">${t('{n}/{total} have seen their role', { n: prog.done, total: prog.total })}</span>`;
    case 'M_PROPOSE': return `<span class="c-emblem lantern">${glyph('lantern')}</span><span class="c-name">${esc(name(v, M.leader))}</span><span class="c-sub">${t('leads')}</span>${hint}${clock}`;
    case 'M_VOTE': return `<span class="c-big">${prog.done}<small>/${prog.total}</small></span><span class="c-sub">${t('votes in')}</span>${hint}${clock}`;
    case 'M_MISSION': return `<span class="c-emblem">${glyph('mission')}</span><span class="c-sub">${t('{n}/{total} cards played', { n: prog.done, total: prog.total })}</span>${clock}`;
    case 'M_RESULT': { const r = M.results.at(-1); return `<span class="c-emblem ${r?.failed ? 'blood' : 'gold'}">${glyph(r?.failed ? 'sabotage' : 'succeed')}</span><span class="c-sub">${t(r?.failed ? 'Failed' : 'Succeeded')}</span>`; }
    case 'M_NIGHT': return `<span class="c-emblem">${glyph('moon')}</span><span class="c-sub">${t('{n}/{total} asleep', { n: prog.done, total: prog.total })}</span>${hint}${clock}`;
    case 'M_LAST_STAND': return `<span class="c-big">${prog.done}<small>/${prog.total}</small></span><span class="c-sub">${t('have named someone')}</span>${hint}${clock}`;
    case 'M_RECKONING': return `<span class="c-emblem blood">${glyph('death')}</span><span class="c-sub">${t('Death hunts the Medium')}</span>${hint}${clock}`;
    default: return '';
  }
}

// ── Main screen ────────────────────────────────────────────────────────────
export function missionMain(v, me, h) {
  const { S, ring, head, chips, activePick, pickTabs } = h;
  const M = v.missions;
  const { ctx, pick } = activePick(v);
  const a = v.action || {};
  const team = teamNow(v);
  const ringPick = pick ?? (team.length ? { ids: [], selected: team, act: '' } : null);
  const table = ring(v, { pick: ringPick, center: missionCenter(v, pick), marks: missionMarks(v) });
  let stage = '';
  switch (v.phase) {
    case 'M_PROPOSE':
      stage = a.type === 'mpropose'
        ? `<p class="center-text" data-key="lead-you"><b>${t('You carry the lantern.')}</b> ${th('Choose a team of {n}.', { n: a.size })}${a.lantern ? ` ${t('You must go yourself.')}` : ''}${a.fresh ? ` ${th('At least {n} must not have been on the last mission.', { n: a.fresh.need })}` : ''}${a.haunted ? ` ${th('{b} is haunted and cannot go.', { b: name(v, a.haunted) })}` : ''}</p>`
        : `<p class="center-text muted" data-key="lead-wait">${th('{a} is choosing a team. Talk it through.', { a: name(v, M.leader) })}</p>`;
      break;
    case 'M_VOTE': {
      const mine = a.choice;
      stage = `<div class="center-text" data-key="vote-stage"><p>${th('{a} proposes {names}.', { a: name(v, M.proposal.leader), names: M.proposal.team.map((id) => name(v, id)) })}${M.proposal.ward ? ` ${th('{b} is warded.', { b: name(v, M.proposal.ward) })}` : ''}</p>
        <p class="small muted">${t(M.card?.id === 'MASKED_VOTE' ? 'Masked Vote: only the totals will be shown.' : 'Votes are revealed all at once, with names.')}</p>
        ${mine === null ? '' : `<p class="stamped-line ${mine ? 'gold' : 'blood'}">${glyph(mine ? 'approve' : 'reject')} ${t(mine ? 'You approved' : 'You rejected')} <span class="small muted">· ${t('tap the other button to change')}</span></p>`}</div>`;
      break;
    }
    case 'M_MISSION':
      stage = a.type === 'mplay' ? playStage(v, a, S) : `<p class="center-text muted" data-key="mwait">${th('The team is on the mission: {names}.', { names: M.proposal.team.map((id) => name(v, id)) })}</p>`;
      break;
    case 'M_RESULT': {
      const r = M.results.at(-1);
      stage = `<p class="center-text big-result ${r.failed ? 'blood' : 'gold'}" data-key="mres">${th(r.failed ? 'Mission {n} failed.' : 'Mission {n} succeeded.', { n: r.mission + 1 })}${r.fails != null ? ` <span class="small muted">${th('{f} Sabotage', { f: r.fails })}</span>` : ''}</p>`;
      break;
    }
    case 'M_NIGHT': return nightStage(v, me, a, h, ctx, pick, table);
    case 'M_LAST_STAND':
      stage = `<div class="banner blood" data-key="stand">${glyph('death')}<div><b>${t('The Last Stand')}</b><p>${t('Three missions have failed. Name one player you believe is Death. Catch one, and Death must still find the Medium to win.')}</p></div></div>`;
      break;
    case 'M_RECKONING':
      stage = a.type === 'mreckon' ? reckonStage(v, a) : `<div class="banner blood" data-key="reck">${glyph('death')}<div><b>${t('The Reckoning')}</b><p>${t('Death has unmasked and is hunting the Medium. Keep your nerve.')}</p></div></div>`;
      break;
    default: break;
  }
  // On the mission, your cards come first: the table is just context.
  if (a.type === 'mplay') return `${head(v)}${trackHtml(v)}${stage}${cardBanner(v)}${table}${h.chatBlock(v)}${chips(v)}`;
  return `${head(v)}${trackHtml(v)}${cardBanner(v)}${pickTabs(ctx, pick)}${table}${stage}${h.chatBlock(v)}${chips(v)}`;
}

function playStage(v, a, S) {
  if (a.played) return `<div class="mplay done" data-key="mplay-done">${glyph('check')}<p>${t('Your card is in. Wait for the rest of the team.')}</p></div>`;
  if (S.ui.mcover?.[v.phaseId] !== false) {
    return `<section class="curtain" data-key="mcurtain"><span class="c-emblem">${glyph('mission')}</span><p>${t('You are on the mission. Shield your screen, then choose your card.')}</p><button class="btn btn-solid" data-act="mUncover">${t('Show my cards')}</button></section>`;
  }
  const sel = S.sel.mcard;
  const card = (id, label, g, dis) => `<button class="mplay-card ${id === 'F' ? 'bad' : 'good'} ${sel === id ? 'sel' : ''}" data-act="mPickCard" data-id="${id}" ${dis ? 'disabled' : ''} data-key="mpc-${id}" aria-pressed="${sel === id}">
    <span class="mpc-in"><span class="mpc-art">${glyph(g)}</span><b>${t(label)}</b>${dis ? `<small>${t(a.warded ? 'You are warded.' : 'Only Death can sabotage.')}</small>` : ''}</span></button>`;
  return `<section class="mplay" data-key="mplay"><div class="mplay-cards">${card('S', 'Succeed', 'succeed', false)}${card('F', 'Sabotage', 'sabotage', !a.canFail)}</div>
    <button class="btn btn-ghost btn-sm" data-act="mCover">${glyph('veil')} ${t('Cover')}</button></section>`;
}

function nightStage(v, me, a, h, ctx, pick, table) {
  const { S, head, chips, pickTabs } = h;
  if (a.type !== 'mnight') return `${head(v)}${table}${chips(v)}`;
  if (a.done) {
    return `${head(v)}${trackHtml(v)}<section class="sleeping" data-key="msleep"><div class="zz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></div><p>${t('You are asleep.')}</p><span class="small muted">${th('{done}/{total} asleep', { done: v.progress.done, total: v.progress.total })}</span></section>${chips(v)}`;
  }
  if (S.ui.veiled[v.phaseId] !== false) {
    return `${head(v)}<section class="curtain" data-key="mncurtain"><span class="c-emblem">${glyph('moon')}</span><p>${t('Night falls on the expedition. Make sure nobody can see your screen.')}</p><button class="btn btn-solid" data-act="unveil">${t('Open your eyes')}</button></section>${chips(v)}`;
  }
  const jobs = [];
  if (a.candle) { const c = S.sel.candle ?? a.candle.choice; jobs.push(`<div class="panel tight ${c ? 'lit' : ''}" data-key="job-candle">${glyph('candle')} <b>${t('You hold the Candle.')}</b> ${c ? th('The Candle will show you {name} at dawn.', { name: name(v, c) }) : t('Choose someone who has never held it: you learn their side, and the Candle passes to them.')}</div>`); }
  if (a.witness) jobs.push(`<div class="panel tight" data-key="job-wit">${glyph('mentalist')} <b>${esc(mcardF('WITNESS', 'name'))}.</b> ${t('Choose one member of your team: you see the card they played.')}</div>`);
  if (a.haunt) jobs.push(`<div class="panel tight seal" data-key="job-haunt">${glyph('veiled')} <b>${esc(mcardF('HAUNTED_ROAD', 'name'))}.</b> ${t('Choose one member of the failed team: they cannot go on the next mission.')}</div>`);
  return `${head(v, `<button class="btn btn-sm btn-ghost cover" data-act="veil" data-key="cover">${glyph('veil')} ${t('Cover')}</button>`)}
    <p class="small muted center-text" data-key="hunch-hint">${t('Everyone picks a Hunch: who you suspect most. Hunches stay secret until the end.')}</p>
    ${jobs.join('')}${pickTabs(ctx, pick)}${table}${chips(v)}`;
}

function reckonStage(v, a) {
  const sug = Object.entries(a.suggestions || {});
  return `<div class="banner blood" data-key="reck-d">${glyph('death')}<div><b>${t('The Reckoning')}</b><p>${t(a.reaper ? 'You are the Reaper. Hear your team, then name the Medium. If you are right, Death wins.' : 'Suggest who the Medium is. The Reaper makes the final call.')}</p>
    ${sug.length ? `<ul class="sugg">${sug.map(([by, target]) => `<li>${esc(name(v, by))} → <b>${esc(name(v, target))}</b></li>`).join('')}</ul>` : ''}</div></div>`;
}

// ── Dock ───────────────────────────────────────────────────────────────────
export function missionDock(v, h) {
  const { S, btn, holdBtn, rawName } = h;
  const a = v.action || {};
  const parts = [];
  switch (a.type) {
    case 'mack': if (!a.done) parts.push(btn(t('Understood'), 'ack', 'btn-solid', !S.ui.flipped[`n0-${v.phaseId}`])); break;
    case 'mpropose': {
      const sel = S.sel.team ?? [];
      const ready = sel.length === a.size && (!a.ward || (S.sel.ward && sel.includes(S.sel.ward)));
      parts.push(btn(ready ? th('Propose {names}', { names: sel.map(rawName) }) : sel.length === a.size && a.ward ? t('Ward one member') : th('Pick {n} · {k} chosen', { n: a.size, k: sel.length }), 'mPropose', 'btn-solid', !ready));
      break;
    }
    case 'mvote':
      parts.push(btn(`${glyph('approve')} ${t('Approve')}`, 'mVote', `btn-gold ${a.choice === true ? 'is-on' : ''}`, false, 'approve', 'data-v="1"'));
      parts.push(btn(`${glyph('reject')} ${t('Reject')}`, 'mVote', `btn-blood ${a.choice === false ? 'is-on' : ''}`, false, 'reject', 'data-v="0"'));
      break;
    case 'mplay':
      if (!a.played && S.sel.mcard && S.ui.mcover?.[v.phaseId] === false) parts.push(holdBtn('mPlay', t(S.sel.mcard === 'F' ? 'Hold to play Sabotage' : 'Hold to play Succeed'), S.sel.mcard === 'F' ? 'btn-blood' : 'btn-solid'));
      break;
    case 'mnight':
      if (!a.done && S.ui.veiled[v.phaseId] === false) {
        const need = (a.candle && !(S.sel.candle ?? a.candle.choice)) ? t('Use the Candle') : (a.witness && !(S.sel.witness ?? a.witness.choice)) ? t('Choose a card to see') : (a.haunt && !(S.sel.haunt ?? a.haunt.choice)) ? t('Choose who is haunted') : !(S.sel.hunch ?? a.hunch) ? t('Pick your hunch') : null;
        parts.push(btn(`${glyph('moon')} ${need ?? t('Go to sleep')}`, 'mSleep', 'btn-solid', !!need));
      }
      break;
    case 'mstand': {
      const sel = S.sel.accuse ?? null;
      if (sel && sel !== a.choice) parts.push(btn(th('Name {name}', { name: rawName(sel) }), 'mAccuse', 'btn-blood'));
      else if (a.choice) parts.push(`<span class="dock-note stamped" data-key="st-${a.choice}">${glyph('check')} ${th('You named {name}', { name: rawName(a.choice) })}</span>`);
      break;
    }
    case 'mreckon': {
      const sel = S.sel.reckon ?? a.mine;
      if (a.reaper && sel) parts.push(holdBtn('mReckon', th('Hold to name {name} as the Medium', { name: rawName(sel) }), 'btn-blood'));
      else if (!a.reaper && sel && sel !== a.mine) parts.push(btn(th('Suggest {name}', { name: rawName(sel) }), 'mSuggest', 'btn-blood'));
      break;
    }
    default: break;
  }
  return parts;
}

// ── Actions (merged into app.js's ACT) ─────────────────────────────────────
export function missionActs(h) {
  const { S, V, send, render, picked, burstAt, sound, haptic } = h;
  const night = (payload) => send('m.night', payload, { quiet: true });
  const one = (key, el, kill = false, secret = false) => { picked(el, kill, secret); S.sel[key] = S.sel[key] === el.dataset.id ? null : el.dataset.id; render(); };
  return {
    mPickTeam(el) {
      picked(el);
      const a = V().action;
      let sel = [...(S.sel.team ?? [])];
      const id = el.dataset.id;
      if (sel.includes(id)) sel = sel.filter((x) => x !== id);
      else if (sel.length < a.size) sel.push(id);
      else { sel.shift(); sel.push(id); }
      if (S.sel.ward && !sel.includes(S.sel.ward)) S.sel.ward = null;
      S.sel.team = sel;
      if (a.ward && sel.length === a.size && !S.sel.ward) S.ui.tab = 'ward';
      render();
    },
    mPickWard(el) { one('ward', el); },
    async mPropose(el) {
      const ok = await send('m.propose', { team: S.sel.team, ward: S.sel.ward || undefined });
      if (ok) { burstAt(el); S.sel.team = []; S.sel.ward = null; }
    },
    async mVote(el) {
      const approve = el.dataset.v === '1';
      const ok = await send('m.vote', { approve });
      if (ok) { sound.play('stamp'); haptic([15, 30, 25]); burstAt(el, { colors: approve ? ['#e9c27a', '#ece5d5'] : ['#e2585e', '#ece5d5'], count: 14 }); }
    },
    mUncover() { (S.ui.mcover ||= {})[V().phaseId] = false; render(); },
    mCover() { (S.ui.mcover ||= {})[V().phaseId] = true; S.sel.mcard = null; render(); },
    mPickCard(el) { S.sel.mcard = el.dataset.id; haptic(8); render(); },
    async mPlay() {
      const card = S.sel.mcard;
      const ok = await send('m.play', { card });
      if (ok) { S.sel.mcard = null; (S.ui.mcover ||= {})[V().phaseId] = true; haptic([20, 40, 20]); render(); }
    },
    // Night picks are saved on the server as soon as they're tapped, so a dawn
    // forced by the host or the timer still uses them.
    mPickHunch(el) { one('hunch', el, false, true); night({ hunch: S.sel.hunch }); },
    mPickCandle(el) { one('candle', el, false, true); if (S.sel.candle) night({ candle: S.sel.candle }); },
    mPickWitness(el) { one('witness', el, false, true); if (S.sel.witness) night({ witness: S.sel.witness }); },
    mPickHaunt(el) { one('haunt', el, true, true); if (S.sel.haunt) night({ haunt: S.sel.haunt }); },
    async mSleep() {
      const a = V().action;
      const payload = { hunch: S.sel.hunch ?? a.hunch, done: true };
      if (a.candle) payload.candle = S.sel.candle ?? a.candle.choice;
      if (a.witness) payload.witness = S.sel.witness ?? a.witness.choice;
      if (a.haunt) payload.haunt = S.sel.haunt ?? a.haunt.choice;
      const ok = await send('m.night', payload);
      if (ok) { S.sel.hunch = S.sel.candle = S.sel.witness = S.sel.haunt = null; }
    },
    mPickAccuse(el) { picked(el, true); S.sel.accuse = el.dataset.id; render(); },
    async mAccuse(el) { const ok = await send('m.accuse', { target: S.sel.accuse }); if (ok) { sound.play('stamp'); burstAt(el, { colors: ['#e2585e', '#ece5d5'] }); S.sel.accuse = null; } },
    mPickReckon(el) { picked(el, true); S.sel.reckon = el.dataset.id; render(); },
    async mSuggest() { const ok = await send('m.suggest', { target: S.sel.reckon }); if (ok) S.sel.reckon = null; },
    async mReckon() { await send('m.reckon', { target: S.sel.reckon ?? V().action.mine }); },
  };
}

// ── Moments ────────────────────────────────────────────────────────────────
/** Map one public log entry to a moment (or a toast via `notify`). */
export function missionMoment(l, v, fresh, { notify, name: nm, ...h }) {
  switch (l.ev) {
    case 'm-card': {
      // The story comes first: what this mission is, here, for these people. Then the card turns.
      const sc = v.scenario;
      const st = missionStoryLine(sc, l.mission);
      const card = { type: 'mcard', card: l.card, mission: l.mission, size: l.size, fails: l.fails, sound: 'unfold' };
      if (!st) return card;
      const whereIdx = (h.content?.scenario?.WHERE ?? []).indexOf(sc?.where);
      return [{
        type: 'mintro', mission: l.mission, step: st.step, scene: st.scene, whereIdx,
        place: sc ? scen('WHERE', sc.where) : '',
        lead: sc ? t('{who} in {where} must {why}: {n}. {step}', { who: scen('WHO', sc.who), where: scen('WHERE', sc.where), why: scen('WHY', sc.why), n: l.mission + 1, step: st.step }) : '',
        sound: 'missionIntro',
      }, card];
    }
    case 'm-votes': return {
      type: 'mvotes', approve: l.approve, reject: l.reject, approved: l.approved, goes: l.goes, forced: l.forced,
      votes: l.votes ? Object.entries(l.votes).map(([id, y]) => ({ id, name: nm(id), y, av: v.players.find((p) => p.id === id)?.avatar })) : null, sound: 'knock',
    };
    case 'm-result': return { type: 'mreveal', mission: l.mission, cards: l.cards, count: l.count, fails: l.fails, need: l.need, failed: l.failed, weight: l.weight, sound: null, tapOnly: false };
    case 'm-stand': return { type: 'call', kicker: 'Three missions failed', title: 'The Last Stand', sub: 'Name one player you believe is Death.', sound: 'standDrum' };
    case 'm-named': return { type: 'mnamed', target: nm(l.target), death: l.death, sound: 'knock' };
    case 'm-unmask': return { type: 'munmask', ids: l.ids, names: l.ids.map(nm), from: l.from, sound: 'unmask' };
    case 'm-reckon': return { type: 'mreckon', target: nm(l.target), hit: l.hit, medium: nm(l.medium), sound: 'heart' };
    case 'm-haunt': return { type: 'call', kicker: mcardF('HAUNTED_ROAD', 'name'), title: 'Haunted', sub: ['{b} cannot go on the next mission.', { b: nm(l.target) }], sound: 'death' };
    case 'm-night': return { type: 'nightfall', n: l.n };
    case 'm-candle': if (l.target) notify(t('{a} held the Candle to {b}', { a: nm(l.by), b: nm(l.target) })); return null;
    case 'm-propose': notify(th('{a} proposes {names}', { a: nm(l.leader), names: l.team.map(nm) })); return null;
    case 'm-skip': notify(t('{a} passed without proposing', { a: nm(l.leader) })); return null;
    default: return null;
  }
}

export const MISSION_MOMENT_TIME = { mintro: 9000, mcandle: 5200, mcard: 4200, mvotes: 5400, mnamed: 5200, munmask: 5200, mreckon: 6200 };
export const revealTime = (m) => 2600 + (m.cards ? m.cards.length : m.count) * 1150 + 2600;

export function missionMomentHtml(m, h) {
  const { letters, avatarSvg, onBoard } = h;
  switch (m.type) {
    case 'mintro':
      return `${m.whereIdx >= 0 ? backdropHtml(m.whereIdx, m.mission % 2 === 1) : ''}<div class="mi-body">
        <span class="kicker mi-kick">${esc(t('Mission {n} of 5', { n: m.mission + 1 }))}${m.place ? ` · ${esc(m.place)}` : ''}</span>
        <div class="mi-num" aria-hidden="true">${ROMAN[m.mission + 1]}</div>
        <h1 class="m-title mi-title">${letters(m.step)}</h1>
        <div class="mi-rule" aria-hidden="true"><i></i>${glyph('lantern')}<i></i></div>
        <p class="mi-lead">${esc(m.lead)}</p>
        <p class="mi-scene">${esc(m.scene)}</p>
        <p class="m-sub small mi-next">${esc(t('The mission card is drawn…'))}</p></div>`;
    case 'mcandle':
      return `<div class="candle-art" aria-hidden="true"><span class="cl-flame"></span><span class="cl-glow"></span>${glyph('candle')}</div>
        <span class="kicker">${esc(t('By Candlelight'))}</span><h1 class="m-title">${letters(m.name)}</h1>
        <div class="verdict-stamp" style="--d:2s"><span class="stamp late-stamp ${m.death ? '' : 'gold'}">${esc(t(m.death ? 'Death' : 'Living'))}</span></div>
        <p class="m-sub small late">${esc(t('Only you saw this. The Candle now passes to them.'))}</p>`;
    case 'mcard':
      return `<span class="kicker">${t('Mission {n} of 5', { n: m.mission + 1 })}</span><h1 class="m-title">${letters(t(m.card === 'REGULAR' ? 'A mission' : 'A mission card'))}</h1>
        <div class="mc-flip ${m.card !== 'REGULAR' ? 'special' : ''}"><div class="mc-in"><div class="mc-back"><b>DS</b></div><div class="mc-front">${cardFace(m.card, { size: m.size, fails: m.fails })}</div></div></div>
        <p class="m-sub small">${t('The card holds for every proposal on this mission.')}</p>`;
    case 'mvotes': {
      const stamp = m.approved ? 'Approved' : m.goes ? 'Goes ahead' : 'Rejected';
      const tokens = m.votes
        ? `<ul class="vflip">${m.votes.map((x, i) => `<li style="--d:${0.35 + i * 0.07}s"><span class="vf-in"><span class="vf-face back">${x.av ? avatarSvg(x.av, 'vf-av') : `<b>${esc(x.name[0])}</b>`}</span><span class="vf-face front ${x.y ? 'y' : 'n'}">${glyph(x.y ? 'approve' : 'reject')}</span></span><small>${esc(x.name)}</small></li>`).join('')}</ul>`
        : `<p class="m-sub">${glyph('mask')} ${t('Masked Vote')}</p>`;
      return `<span class="kicker">${t('The team vote')}</span><h1 class="m-title">${letters(t('The table decides'))}</h1>${tokens}
        <p class="vcount"><span class="gold">${glyph('approve')} ${m.approve}</span><span class="blood">${glyph('reject')} ${m.reject}</span></p>
        <div class="verdict-stamp"><span class="stamp ${m.approved ? 'gold' : m.goes ? 'soft' : ''}">${t(stamp)}</span></div>
        ${m.forced && !m.approved ? `<p class="m-sub small">${t('The last proposal goes ahead whatever the vote.')}</p>` : ''}`;
    }
    case 'mreveal': {
      const n = m.cards ? m.cards.length : m.count;
      const cards = Array.from({ length: n }, (_, i) => {
        const c = m.cards?.[i];
        return `<div class="rc ${m.cards ? (c === 'F' ? 'bad' : 'good') : 'smoke'}" style="--i:${i};--n:${n};--d:${2.2 + i * 1.15}s"><div class="rc-in"><div class="rc-back"><b>DS</b></div><div class="rc-front">${m.cards ? `${glyph(c === 'F' ? 'sabotage' : 'succeed')}<b>${t(c === 'F' ? 'Sabotage' : 'Succeed')}</b>${c === 'F' ? '<svg class="rc-crack" viewBox="0 0 100 140" aria-hidden="true"><path d="M50 0L44 34 58 50 40 78 56 98 48 140"/><path d="M58 50L84 58M40 78L14 72"/></svg>' : ''}` : glyph('smoke')}</div></div></div>`;
      }).join('');
      const end = 2.2 + n * 1.15 + 0.4;
      return `<div class="reveal-wash ${m.failed ? 'fail' : 'ok'}" style="--d:${end}s" aria-hidden="true"></div><span class="kicker">${t('Mission {n}', { n: m.mission + 1 })}${m.weight > 1 ? ` · ${t('counts twice')}` : ''}</span><h1 class="m-title">${letters(t('The cards are turned'))}</h1>
        <div class="reveal-table ${m.failed ? 'is-fail' : 'is-ok'}" style="--end:${end}s">${cards}</div>
        ${m.cards ? '' : `<p class="m-sub small" style="--d:1.2s">${t('Smoke: only the result is shown.')}</p>`}
        <div class="reveal-stamp" style="--d:${end}s"><span class="stamp ${m.failed ? '' : 'gold'}">${t(m.failed ? 'Failed' : 'Succeeded')}</span>${m.need > 1 ? `<small>${t('Two Sabotage cards were needed.')}</small>` : ''}</div>`;
    }
    case 'mnamed':
      return `<span class="kicker">${t('The Last Stand')}</span><h1 class="m-title">${letters(t('The table names'))}</h1>
        <div class="named"><b class="named-name">${esc(m.target)}</b></div>
        <div class="verdict-stamp" style="--d:2.4s"><span class="stamp ${m.death ? '' : 'gold'} late">${t(m.death ? 'Walks with Death' : 'One of the Living')}</span></div>
        <p class="m-sub small late">${t(m.death ? 'Death is caught, but it may yet find the Medium.' : 'The wrong name. Death holds the expedition.')}</p>`;
    case 'munmask':
      return `<div class="m-art">${glyph('death')}</div><span class="kicker blood">${t(m.from === 'stand' ? 'Caught, not beaten' : 'Three missions succeed')}</span><h1 class="m-title blood">${letters(t('Death unmasks'))}</h1>
        <ul class="victims unmasked">${m.names.map((x, i) => `<li class="victim" style="--d:${0.9 + i * 0.45}s"><span>${esc(x)}</span></li>`).join('')}</ul>
        <p class="m-sub">${t('Now Death hunts the Medium. One guess.')}</p>`;
    case 'mreckon':
      return `<span class="kicker blood">${t('The Reckoning')}</span><h1 class="m-title">${letters(t('The Reaper names'))}</h1>
        <div class="named"><b class="named-name">${esc(m.target)}</b></div>
        <div class="verdict-stamp" style="--d:2.8s"><span class="stamp ${m.hit ? '' : 'gold'} late">${t(m.hit ? 'The Medium' : 'Not the Medium')}</span></div>
        ${m.hit ? '' : `<p class="m-sub small late">${th('The Medium was {b}.', { b: m.medium })}</p>`}`;
    default: return '';
  }
}

// ── End screen extras ──────────────────────────────────────────────────────
export function missionEndHtml(v) {
  const M = v.missions;
  if (!M) return '';
  const hunches = M.hunches ?? [];
  const byTarget = {};
  for (const x of hunches) byTarget[x.target] = (byTarget[x.target] || 0) + 1;
  const top = Object.entries(byTarget).sort((a, b) => b[1] - a[1]).slice(0, 3);
  return `${trackHtml(v)}
    <section data-key="endgrid"><div class="rule">${t('The missions')}</div>${gridHtml(v)}</section>
    ${top.length ? `<section data-key="hunch"><div class="rule">${t('Most suspected (Hunches)')}</div><ul class="ledger">${top.map(([id, n]) => `<li><span class="seat">${n}</span><span class="who"><b>${esc(name(v, id))}</b><small>${th(n === 1 ? '{n} hunch' : '{n} hunches', { n })}</small></span></li>`).join('')}</ul></section>` : ''}`;
}

// ── TV board ───────────────────────────────────────────────────────────────
export function missionBoardStage(v, h) {
  const M = v.missions;
  if (!M) return '';
  let now = '';
  switch (v.phase) {
    case 'M_PROPOSE': now = `<p class="b-now">${glyph('lantern')} ${th('{a} is choosing a team of {n}.', { a: name(v, M.leader), n: M.sizes[M.mission].size })}</p>`; break;
    case 'M_VOTE': now = `<p class="b-now">${th('{a} proposes {names}.', { a: name(v, M.proposal.leader), names: M.proposal.team.map((id) => name(v, id)) })} <b>${th('{done}/{total} votes in', { done: v.progress.done, total: v.progress.total })}</b></p>`; break;
    case 'M_MISSION': now = `<p class="b-now">${th('On the mission: {names}.', { names: M.proposal.team.map((id) => name(v, id)) })} <b>${th('{done}/{total} cards played', { done: v.progress.done, total: v.progress.total })}</b></p>`; break;
    case 'M_NIGHT': now = `<p class="b-now">${glyph('moon')} ${t('Night falls on the expedition.')}</p>`; break;
    case 'M_LAST_STAND': now = `<p class="b-now blood">${t('The Last Stand: name one player you believe is Death.')} <b>${th('{done}/{total} votes in', { done: v.progress.done, total: v.progress.total })}</b></p>`; break;
    case 'M_RECKONING': now = `<p class="b-now blood">${t('Death has unmasked and is hunting the Medium.')}</p>`; break;
    default: break;
  }
  return `<section class="b-mission" data-key="bmission">${trackHtml(v, { big: true })}${cardBanner(v)}${now}</section>`;
}

export const missionBoardRing = (v) => ({ marks: missionMarks(v), team: teamNow(v) });
