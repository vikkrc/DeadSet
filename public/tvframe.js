// The TV frame (TV-PASS §3–4): one grid for every board. A header (wordmark and mode, the phase word, one step
// line, the clock dial, the score bell), the body as stage + ledger, and the band (the herald line, progress
// beads, the join code). A fine gilt proscenium frames it, its four lozenge corners in the mode's accent.
// Every board hands this its stage and ledger; nothing else builds the grid.
import { glyph } from './icons.js';
import { t, th } from './i18n.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** The header: wordmark (and the mode under it), the phase word with its numeral, one step line, the clock dial, the bell. */
export function tvHeader(v, h, { step = null } = {}) {
  const { phaseWord, modeName, wordmark, stepOf, scen } = h;
  const pw = phaseWord(v);
  const place = v.scenario && v.mode === 'classic' ? scen('WHERE', v.scenario.where) : '';
  const line = step ?? `${esc(stepOf(v))}${place ? ` · <b>${esc(place)}</b>` : ''}`;
  const mode = v.phase === 'LOBBY' || v.mode === 'classic' ? '' : esc(modeName(v).replace(/^Dead Set\s*[:·–-]\s*/i, ''));
  // TV-R7: after the lobby the score is a 40-unit bell, never a button with words. Any key or tap on the TV starts it.
  const on = !!h.audio && v.table?.score !== false;
  const bell = v.table?.score === false ? '' : `<span class="tvx-bell ${on ? 'on' : 'off'}" data-key="tvbell" role="img" aria-label="${esc(on ? t('The score is playing') : t('Sound is off'))}">${glyph('bell')}${on ? '' : '<i class="tvx-bell-x"></i>'}</span>`;
  return `<header class="tvx-head" data-key="tvhead">
    <span class="tvx-brand">${wordmark()}${mode ? `<span class="tvx-mode">${mode}</span>` : ''}</span>
    ${pw.word ? `<span class="tvx-phase">${pw.night ? `<i>${esc(pw.word)}</i>` : esc(pw.word)}${pw.num ? `<sup>${esc(pw.num)}</sup>` : ''}</span>` : ''}
    <span class="tvx-step">${line}</span>
    <span class="grow"></span>
    <span class="tvx-clock" data-key="tvclock"><span class="tvx-dial" data-ringfuse><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="trk" cx="18" cy="18" r="15.9"/><circle class="burn" cx="18" cy="18" r="15.9" pathLength="100"/></svg></span><b class="clock" data-clock></b></span>
    ${bell}
  </header>`;
}

/** The Now card (TV-G2): the one sentence the room needs, in the ornate frame (TV-I5). */
export function nowCard({ kicker = '', title = '', line = '', tone = '' } = {}, key = 'tvnow') {
  if (!title && !line) return '';
  return `<section class="tv-now ${tone}" data-key="${key}">${kicker ? `<span class="kicker">${kicker}</span>` : ''}${title ? `<b>${title}</b>` : ''}${line ? `<span>${line}</span>` : ''}</section>`;
}

/** A plain ledger panel (records and lists keep the double rule, never the ornate frame). */
export const panel = (title, body, key, cls = '') => (body ? `<section class="tvx-pnl ${cls}" data-key="${key}">${title ? `<span class="kicker">${title}</span>` : ''}${body}</section>` : '');

/** The band (TV-I1): the herald in 30 units, progress beads with their label, the join code and a small QR. */
export function tvBand(v, h, herald = '') {
  const { qrSvg } = h;
  const p = v.progress;
  const beads = p?.total && p.total <= 24 ? `<span class="tvx-beads" aria-hidden="true">${Array.from({ length: p.total }, (_, i) => `<i class="${i < p.done ? 'on' : ''}"></i>`).join('')}</span>` : '';
  // TV-Y3: with three or fewer left to act, the band names them (only where the server says who, never a secret).
  const names = p?.waiting?.length && p.waiting.length <= 3 && p.total > p.waiting.length
    ? th('Waiting for {names}', { names: p.waiting.map((id) => v.players.find((x) => x.id === id)?.name ?? '?') }) : '';
  const label = v.phase === 'ENDED' && v.endVotes?.total ? th('Again? {n} of {m} say yes', { n: v.endVotes.again, m: v.endVotes.total })
    : names || (p?.total ? th('{done} of {total} done', p) : '');
  const join = v.phase === 'LOBBY' ? '' : `<span class="tvx-join">${qrSvg(`${location.origin}/r/${v.code}`)}<span><small>${t('Join or rejoin')}</small><b>${esc(v.code)}</b></span></span>`;
  return `<footer class="tvx-band" data-key="tvband"><p class="tvx-herald">${herald ? `<i class="loz" aria-hidden="true"></i>${herald}` : ''}</p>
    ${label ? `<span class="tvx-prog">${beads}<span>${esc(label)}</span></span>` : ''}${join}</footer>`;
}

/** The whole TV screen. `full` gives the stage the whole body (scenes, the lobby's idle loop). */
export function tvFrame(v, h, { stage = '', ledger = '', herald = '', cls = '', key = 'board', night = false, backdrop = '', full = false, header = null, step = null } = {}) {
  return `<main class="board2 tvx mode-${esc(v.mode)} ${night ? 'night is-night' : ''} ${cls}" data-key="${key}">
    ${backdrop}<i class="cn tl" aria-hidden="true"></i><i class="cn tr" aria-hidden="true"></i><i class="cn bl" aria-hidden="true"></i><i class="cn br" aria-hidden="true"></i>
    ${header ?? tvHeader(v, h, { step })}
    <div class="tvx-body ${full ? 'full' : ''}"><section class="tvx-stage" data-key="tvstage">${stage}</section>${full ? '' : `<aside class="tvx-ledger" data-key="tvledger">${ledger}</aside>`}</div>
    ${tvBand(v, h, herald)}
  </main>`;
}

/**
 * TV-G4: seat marks, a gilt tick on everyone who has acted in this step and a dashed ring on those who haven't.
 * Only where the server names who is waiting (steps everyone takes alike; never at night, never a secret subset).
 */
export function seatMarks(v) {
  const p = v.progress;
  if (!p?.waiting || v.phase === 'LOBBY') return {};
  const waiting = new Set(p.waiting);
  const acted = new Set(p.acted ?? v.players.filter((x) => x.alive !== false && !waiting.has(x.id)).map((x) => x.id));
  const out = {};
  for (const x of v.players) if (waiting.has(x.id)) out[x.id] = 'tv-wait'; else if (acted.has(x.id)) out[x.id] = 'tv-ok';
  return out;
}

/** The Gazette on the TV (TV-G3): the latest three headlines, never the log. */
export function latestHeadlines(eds, h) {
  const { t: tt } = h;
  const rn = h.roman ?? String;
  const when = (e) => (e.kind === 'start' ? tt('Night 0') : e.kind === 'night' ? th('Night {n}', { n: rn(e.num) }) : e.kind === 'day' ? th('Day {n}', { n: rn(e.num) }) : e.kind === 'mission' ? th('Mission {n}', { n: rn(e.num) }) : e.kind === 'finale' ? tt('Finale') : tt('Verdict'));
  const rows = eds.slice(0, 3).map((e) => `<p class="${e.tone}"><small>${esc(when(e))}</small><b>${esc(e.title)}</b></p>`).join('');
  return rows ? panel(t('The Gazette · latest'), `<div class="tvx-lat">${rows}</div>`, 'tvlat') : '';
}
