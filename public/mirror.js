// Dead Set: The Mirror — the client (phones, TV, scenes, lobby, end). See MIRROR.md.
//
// A haunted mirror: each round a dilemma with three answers; you answer for yourself and predict the
// player you face in the glass. The reveal draws every reading as an arrow, right or wrong.

import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { t, th, dilemmaText } from './i18n.js';
import { dilemmaById, DILEMMAS } from './dilemmas.js';
import { esc, rawName, pname, disc, doNow, seatArrows, scoreLedger, explainer, waiting, settingRow } from './kit.js';

export const isMirrorPhase = (ph) => typeof ph === 'string' && ph.startsWith('W_');
const LETTERS = ['A', t('B'), t('C')];

/** The dilemma card: the prompt and its three answers. `mark` lights answers: { A: 'mine' | 'pred' | 'count' … }. */
export function dilemmaCard(id, { size = '', counts = null, picks = {} } = {}) {
  const d = dilemmaText(dilemmaById(id));
  return `<article class="w-card ${size}" data-key="wcard-${id}-${size}"><span class="w-glass" aria-hidden="true">${emblem('maskedvote')}</span>
    <p class="w-prompt">${esc(d.prompt)}</p>
    <ol class="w-choices">${d.choices.map((c, i) => `<li class="${(picks[LETTERS[i]] ?? []).join(' ')}"><b>${LETTERS[i]}</b><span>${esc(c)}</span>${counts ? `<em>${counts[LETTERS[i]] ?? 0}</em>` : ''}</li>`).join('')}</ol></article>`;
}

/** You and the player you read, face to face in the glass. */
function facing(v, me, target) {
  return `<div class="w-facing" data-key="wfacing">${disc(v, me, 'lg')}<span class="w-frame">${emblem('maskedvote')}</span>${disc(v, target, 'lg')}
    <p>${th('You read {a}', { a: rawName(v, target) })}</p></div>`;
}

const counts = (answers) => { const c = { A: 0, B: 0, C: 0 }; for (const x of Object.values(answers ?? {})) c[x]++; return c; };

// ── Phone ──────────────────────────────────────────────────────────────────
export function mirrorMain(v, me, h) {
  const { S: UI, head } = h;
  const W = v.mirror;
  if (!W) return head(v);
  const a = v.action || {};
  if (UI.sel.wphase !== v.phaseId) { UI.sel.wphase = v.phaseId; UI.sel.wown = a.ballot?.own ?? null; UI.sel.wpred = a.ballot?.pred ?? null; }
  const round = `<span class="kicker w-round" data-key="wround">${th('Dilemma {n} of {m}', { n: W.round, m: W.rounds })}</span>`;
  const target = me?.w?.target;
  let stage = '';
  switch (v.phase) {
    case 'W_PROMPT':
      stage = `${round}${dilemmaCard(W.dilemma)}${target ? facing(v, me.id, target) : ''}
        ${doNow(t('Talk it over'), th('Ask {a} what they would do, tease, mislead. In a moment you answer for yourself, and predict {a}.', { a: rawName(v, target) }))}`;
      break;
    case 'W_CHOOSE': {
      const d = dilemmaText(dilemmaById(W.dilemma));
      const row = (act, sel, label) => `<div class="w-pick" data-key="wp-${act}"><span class="kicker">${label}</span><div class="w-opts">${d.choices.map((c, i) => `<button class="w-opt ${sel === LETTERS[i] ? 'on' : ''}" data-act="${act}" data-id="${LETTERS[i]}" aria-pressed="${sel === LETTERS[i]}"><b>${LETTERS[i]}</b><span>${esc(c)}</span></button>`).join('')}</div></div>`;
      stage = `${round}<article class="w-card sm" data-key="wcard-sm"><p class="w-prompt">${esc(d.prompt)}</p></article>
        ${doNow(t('Seal your ballot'), th('Your own answer scores nothing; reading {a} right scores 2.', { a: rawName(v, target) }))}
        ${row('wOwn', UI.sel.wown, t('You would…'))}
        ${row('wPred', UI.sel.wpred, th('{a} would…', { a: rawName(v, target) }))}
        ${a.ballot ? `<p class="small center-text w-sealed">${glyph('check')} ${t('Sealed. You can change it until everyone is in.')}</p>${waiting(v)}` : ''}`;
      break;
    }
    case 'W_REVEAL': {
      const L = W.last;
      stage = `${round}${dilemmaCard(L.dilemma, { counts: counts(L.answers), picks: myPicks(L, me?.id) })}${revealList(v, L, me?.id)}`;
      break;
    }
    default: break;
  }
  return `${head(v)}${stage}`;
}

/** Light my answer and my prediction on the card. */
function myPicks(L, id) {
  const p = {};
  if (!id) return p;
  if (L.answers[id]) (p[L.answers[id]] ||= []).push('mine');
  if (L.preds[id]) (p[L.preds[id]] ||= []).push('pred');
  return p;
}

/** Each reader: their answer, and their reading of their target, right or wrong. */
function revealList(v, L, me) {
  const ids = [...v.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
  const mine = ids.filter((id) => id === me);
  const rest = ids.filter((id) => id !== me);
  return `<ul class="w-reads" data-key="wreads">${[...mine, ...rest].map((id) => {
    const tg = L.targets[id];
    const pred = L.preds[id];
    const hit = pred && pred === L.answers[tg];
    return `<li class="${id === me ? 'me' : ''} ${hit ? 'hit' : pred ? 'miss' : 'none'}">${disc(v, id, 'sm')}<span class="w-who"><b>${pname(v, id)}</b><small>${L.auto[id] ? t('timed out: a random answer') : th('chose {x}', { x: L.answers[id] })}</small></span>
      <span class="w-read">${pred ? `<i>${pred}</i>` : '<i>—</i>'}→${disc(v, tg, 'xs')}<i class="w-ans">${L.answers[tg]}</i></span>${hit ? '<em class="w-plus">+2</em>' : ''}</li>`;
  }).join('')}</ul>`;
}

export function mirrorDock(v, h) {
  const { S: UI, btn } = h;
  const a = v.action || {};
  if (a.type !== 'wballot') return [];
  const ready = UI.sel.wown && UI.sel.wpred;
  return [ready ? btn(a.ballot ? t('Change my ballot') : t('Seal my ballot'), 'wSeal', a.ballot ? 'btn-ghost' : 'btn-solid') : `<span class="dock-note" data-key="wdn">${t('Choose both answers')}</span>`];
}

export function mirrorActs(h) {
  const { S: UI, send, render, haptic } = h;
  return {
    wOwn(el) { UI.sel.wown = el.dataset.id; haptic(6); render(); },
    wPred(el) { UI.sel.wpred = el.dataset.id; haptic(6); render(); },
    async wSeal() { if (UI.sel.wown && UI.sel.wpred) await send('w.ballot', { own: UI.sel.wown, pred: UI.sel.wpred }); },
    wSet(el) {
      const packs = [...document.querySelectorAll('[data-act-change="wSet"][data-id="pack"]')].filter((x) => x.checked).map((x) => x.value);
      if (packs.length) send('host.settings', { w: { packs } }, { quiet: true });
      else el.checked = true;
    },
  };
}
export const MIRROR_QUIET = ['wOwn', 'wPred'];

// ── Scenes ─────────────────────────────────────────────────────────────────
export function mirrorMoment(l) {
  if (l.ev === 'w-prompt') return { type: 'wprompt', round: l.round, dilemma: l.dilemma, sound: 'bell' };
  if (l.ev === 'w-reveal') return { type: 'wreveal', dilemma: l.dilemma, answers: l.answers, sound: 'shuffle' };
  return null;
}
export const W_MOMENT_TIME = { wprompt: 4800, wreveal: 3200 };

export function mirrorMomentHtml(m, h) {
  const { letters, V } = h;
  if (m.type === 'wprompt') return `<div class="m-art w-mart">${emblem('maskedvote')}</div><span class="kicker">${esc(th('Dilemma {n} of {m}', { n: m.round, m: V()?.mirror?.rounds ?? 8 }))}</span>
    ${dilemmaCard(m.dilemma, { size: 'scene' })}`;
  const c = counts(m.answers);
  return `<div class="m-art w-mart crack">${emblem('maskedvote')}</div><span class="kicker">${esc(t('The mirror shows'))}</span><h1 class="m-title">${letters(t('Every answer'))}</h1>
    <p class="m-sub">${LETTERS.map((x) => `${x} · ${c[x]}`).join('   ')}</p>`;
}

// ── Lobby ──────────────────────────────────────────────────────────────────
export function mirrorLobbyDeck(v, isHost, h) {
  const n = v.players.length;
  const s = v.settings.w ?? {};
  const packs = [...new Set(DILEMMAS.map((d) => d.pack))];
  const size = (p) => DILEMMAS.filter((d) => d.pack === p).length;
  const packRow = packs.length > 1 ? settingRow(isHost, t('Dilemma packs'), t('Which packs the eight dilemmas are drawn from.'),
    `<span class="w-packs">${packs.map((p) => `<label class="check"><input type="checkbox" data-act-change="wSet" data-id="pack" value="${esc(p)}" ${(s.packs ?? ['core']).includes(p) ? 'checked' : ''}><span>${esc(p)} · ${size(p)}</span></label>`).join('')}</span>`,
    (s.packs ?? ['core']).join(', ')) : '';
  return `${explainer(t('How The Mirror works'), [
    ['maskedvote', t('A dilemma'), t('Eight rounds, each a fictional dilemma with three answers. None of them is right.')],
    ['medium', t('You read someone'), t('Each round you face one player in the glass; over the game, everyone reads everyone.')],
    ['mentalist', t('Answer and predict'), t('Seal your own answer and your prediction of theirs. Talk first: tease, ask, mislead.')],
    ['crown', t('Read them right'), t('A right prediction scores 2; your own answer scores nothing. The best reader wins.')],
  ], glyph, 'wexplain')}
    <section class="lobby-deck" data-key="wdeck">
    <div class="rule">${t(n === 1 ? 'The table · {n} player' : 'The table · {n} players', { n })}</div>
    <p class="small muted">${n >= 4 ? th('{n} dilemmas in the bank; each game draws eight the table has not seen lately.', { n: DILEMMAS.length }) : t('Seat 4 to 12 players.')}</p>
    ${dilemmaCard(DILEMMAS[8].id, { size: 'lobby' })}
    ${packRow}
    ${h.music ?? ''}
    ${v.wScores ? scoreLedger(v, v.wScores, { title: t('Last game'), key: 'wlast' }) : ''}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
export const mirrorTitle = (v) => { const w = v.mirror?.winners ?? []; return w.length ? t('{names} wins', { names: w.map((id) => rawName(v, id)) }) : t('The End'); };

export function mirrorEndHtml(v) {
  const W = v.mirror;
  if (!W?.winners) return '';
  const back = v.deadline ? `<p class="center-text small muted">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const ids = v.players.map((p) => p.id);
  // How well each player was read: how many of their readers got them right.
  const read = Object.fromEntries(ids.map((id) => [id, 0]));
  for (const r of W.history ?? []) for (const id of ids) if (r.preds[id] && r.preds[id] === r.answers[r.targets[id]]) read[r.targets[id]]++;
  const rounds = (W.history ?? []).map((r) => { const c = counts(r.answers); const top = LETTERS.reduce((x, y) => (c[y] > c[x] ? y : x), 'A'); const d = dilemmaText(dilemmaById(r.dilemma)); return `<li><p>${esc(d.prompt)}</p><small>${th('Most chose {x}: {answer}', { x: top, answer: d.choices[LETTERS.indexOf(top)] })}</small></li>`; }).join('');
  return `${back}${scoreLedger(v, W.scores, { title: t('The best readers'), key: 'wend', winners: W.winners,
    extra: (id) => `<small>${th('read right {n}×', { n: read[id] })}</small>` })}
    <section data-key="wrounds"><div class="rule">${t('Every dilemma')}</div><ol class="w-hist">${rounds}</ol></section>`;
}

// ── TV ─────────────────────────────────────────────────────────────────────
export function mirrorBoard(v, h) {
  const { header, ring } = h;
  const W = v.mirror;
  if (!W) return '';
  const ended = v.phase === 'ENDED';
  const L = v.phase === 'W_REVEAL' ? W.last : null;
  const pairs = Object.entries(L ? L.targets : W.targets ?? {}).map(([from, to]) => ({ from, to, cls: L ? (L.preds[from] && L.preds[from] === L.answers[to] ? 'hit' : 'miss') : 'plain' }));
  const marks = L ? Object.fromEntries(Object.entries(L.answers).map(([id, x]) => [id, x])) : v.phase === 'W_CHOOSE' ? Object.fromEntries(W.locked.map((id) => [id, '✓'])) : {};
  const title = v.phase === 'W_PROMPT' ? t('Talk it over') : v.phase === 'W_CHOOSE' ? t('Seal your ballots') : L ? t('The mirror shows every answer') : '';
  const sub = v.phase === 'W_CHOOSE' ? th('Ballots sealed · {done}/{total}', v.progress ?? { done: 0, total: 0 }) : v.phase === 'W_PROMPT' ? t('Each arrow: who reads whom this round.') : '';
  return `<main class="board2 wboard ${ended ? 'is-ended' : ''}" data-key="board-w">${header}
    <div class="wt-cols">
      <section class="wt-table">${ended ? '' : ring(v, { center: `<span class="c-sub">${esc(th('Dilemma {n} of {m}', { n: W.round, m: W.rounds }))}</span>`, extra: seatArrows(v, pairs, `warr-${W.round}-${v.phase}`), marks })}
        ${ended ? '' : `<div class="ot-banner"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div>`}</section>
      <section class="wt-side">${ended ? mirrorEndHtml(v) : `${dilemmaCard(W.dilemma, { size: 'tv', counts: L ? counts(L.answers) : null })}${scoreLedger(v, W.scores, { title: t('The readers'), key: 'wtled' })}`}</section>
    </div></main>`;
}
