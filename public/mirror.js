// Dead Set: The Mirror — the client (phones, TV, scenes, lobby, end). See MIRROR.md.
//
// A haunted mirror: each round a dilemma with three answers; you answer for yourself and predict the
// player you face in the glass. The reveal draws every reading as an arrow, right or wrong.

import { tvFrame, nowCard, panel } from './tvframe.js';
import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { t, th, tp, dilemmaText } from './i18n.js';
import { dilemmaById, DILEMMAS } from './dilemmas.js';
import { esc, rawName, pname, disc, doNow, seatArrows, scoreLedger, explainer, waiting, settingRow } from './kit.js';

export const isMirrorPhase = (ph) => typeof ph === 'string' && ph.startsWith('W_');
const LETTERS = ['A', t('B'), t('C')];

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const NUM = ['I', 'II', 'III'];
/** An answer's letter (A/B/C, the data) as its fate numeral (I/II/III, what players see). */
const numOf = (x) => NUM[LETTERS.indexOf(x)] ?? x;
const initial = (v, id) => esc([...(rawName(v, id) || '?')][0] ?? '?');

/**
 * MR1: every dilemma is a card of the Arcana of Dilemmas — flat vellum, the Mirror's one sigil, the numeral, the
 * title in blackletter, a gilt rule, and the question as the hero. MR2: the three answers are fate cards beneath
 * it (`fates`): idle ink, or vellum with your red seal, silver with the seal you placed for the player you read,
 * and at the reveal the count and the portraits of who chose it. Sizes: '' (ballot), 'talk', 'tv', 'scene'.
 */
export function dilemmaCard(id, { size = '', round = null, card = true, fates = true, who = null, v = null, auto = {}, seals = {}, act = '', theirs = null } = {}) {
  const d = dilemmaText(dilemmaById(id));
  const fate = (c, i) => {
    const x = LETTERS[i];
    const ids = who?.[x] ?? [];
    const mine = seals.own === x;
    const pred = seals.pred === x;
    const cls = [mine ? 'yours' : '', pred ? 'theirs' : '', theirs === x ? 'truth' : '', who ? 'shown' : '', who && !ids.length ? 'empty' : ''].filter(Boolean).join(' ');
    const wax = `${mine ? `<i class="mr-seal mr-wax" aria-hidden="true">${esc(seals.me ?? '')}</i>` : ''}${pred ? `<i class="mr-seal mr-silver" aria-hidden="true">${esc(seals.them ?? '')}</i>` : ''}`;
    const faces = who ? `<span class="mr-who">${ids.map((pid) => `<span class="w-face ${auto[pid] ? 'auto' : ''}" title="${esc(rawName(v, pid))}">${disc(v, pid, 'xs')}</span>`).join('')}</span><em class="mr-count">${ids.length}</em>` : '';
    const tag = act ? 'button' : 'li';
    return `<${tag} class="mr-fate ${cls}" ${act ? `type="button" data-act="${act}" data-id="${x}" aria-pressed="${mine || pred}"` : ''} data-key="mrf-${x}"><b class="mr-num">${NUM[i]}</b><span class="mr-ans">${esc(c)}</span>${wax}${faces}</${tag}>`;
  };
  const list = fates ? `<${act ? 'div' : 'ol'} class="fates ${size}" data-key="fates-${id}">${d.choices.map(fate).join('')}</${act ? 'div' : 'ol'}>` : '';
  if (!card) return list;
  return `<article class="mr-card ${size}" data-key="mrcard-${id}-${size}">
    <span class="mr-sigil" aria-hidden="true">${emblem('s_self')}</span>
    ${round ? `<span class="mr-n">${esc(t('Dilemma'))} · ${ROMAN[round] ?? round}</span>` : ''}
    ${d.title ? `<b class="mr-title">${esc(d.title)}</b>` : ''}<i class="mr-rule" aria-hidden="true"></i>
    <p class="mr-q">${esc(d.prompt)}</p></article>${list}`;
}

/** MR4: the glass — a slim silvered band pairing you with the player you read. */
function glass(v, me, target) {
  if (!me || !target) return '';
  return `<div class="mr-glass" data-key="mrglass"><span class="mr-g-you">${disc(v, me, 'sm')}<b>${esc(t('You'))}</b></span><i class="mr-g-line" aria-hidden="true"></i><span class="mr-g-them"><b>${esc(rawName(v, target))}</b>${disc(v, target, 'sm')}</span></div>`;
}

/** Who chose what, from a round's answers: { A: [ids], B: [...], C: [...] } in seat order. */
const chosenBy = (v, answers) => {
  const out = { A: [], B: [], C: [] };
  for (const p of [...v.players].sort((a, b) => a.seat - b.seat)) if (answers?.[p.id]) out[answers[p.id]].push(p.id);
  return out;
};

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
      // MR5: talk — a large card, the answers as chips under it.
      stage = `${glass(v, me?.id, target)}${dilemmaCard(W.dilemma, { size: 'talk', round: W.round, fates: false })}
        <div class="mr-chips" data-key="mrchips">${dilemmaText(dilemmaById(W.dilemma)).choices.map((c, i) => `<span class="mr-chip"><b>${NUM[i]}</b>${esc(c)}</span>`).join('')}</div>`;
      break;
    case 'W_CHOOSE': {
      // MR3: two seals instead of two columns. Choose which seal you hold, then tap a fate to place it.
      const holding = UI.sel.wseal ?? 'own';
      const seg = `<div class="seg mr-seg" role="group" data-key="mrseg"><button data-act="wHold" data-id="own" aria-pressed="${holding === 'own'}"><i class="mr-seal mr-wax sm" aria-hidden="true">${initial(v, me?.id)}</i>${t('Your seal')}</button><button data-act="wHold" data-id="pred" aria-pressed="${holding === 'pred'}"><i class="mr-seal mr-silver sm" aria-hidden="true">${initial(v, target)}</i>${esc(th('{a}\'s seal', { a: rawName(v, target) }))}</button></div>`;
      stage = `${glass(v, me?.id, target)}${dilemmaCard(W.dilemma, { round: W.round, fates: false })}${seg}
        ${dilemmaCard(W.dilemma, { card: false, act: 'wFate', seals: { own: UI.sel.wown, pred: UI.sel.wpred, me: initial(v, me?.id), them: initial(v, target) } })}
        <p class="small muted center-text" data-key="mrhint">${t('Tap a fate to place the seal you are holding. Both seals can move until everyone has sealed.')}</p>
        ${a.ballot ? `${waiting(v)}` : ''}`;
      break;
    }
    case 'W_REVEAL': {
      const L = W.last;
      const tg = L.targets?.[me?.id];
      stage = `${dilemmaCard(L.dilemma, { round: W.round, who: chosenBy(v, L.answers), v, auto: L.auto, theirs: tg ? L.answers[tg] : null, seals: { own: L.answers[me?.id], pred: L.preds[me?.id], me: initial(v, me?.id), them: tg ? initial(v, tg) : '' } })}${resultRows(v, L, me?.id)}${readingsGrid(v, L, me?.id)}`;
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

/** MR6: two result rows — how you read your target, and how you were read. */
function resultRows(v, L, me) {
  if (!me) return '';
  const rows = [];
  const tg = L.targets[me];
  if (tg) {
    const hit = L.preds[me] && L.preds[me] === L.answers[tg];
    rows.push(`<li class="${hit ? 'hit' : 'miss'}">${disc(v, tg, 'sm')}<span>${esc(th('You read {a}', { a: rawName(v, tg) }))} · ${esc(t(hit ? 'right' : 'wrong'))}</span><b>${hit ? '+2' : '+0'}</b></li>`);
  }
  const by = Object.keys(L.targets).find((id) => L.targets[id] === me);
  if (by) {
    const hit = L.preds[by] && L.preds[by] === L.answers[me];
    rows.push(`<li class="${hit ? 'hit' : 'miss'}">${disc(v, by, 'sm')}<span>${esc(th('{a} read you', { a: rawName(v, by) }))} · ${esc(t(hit ? 'right' : 'wrong'))}</span><b>${hit ? esc(th('+2 to {a}', { a: rawName(v, by) })) : '+0'}</b></li>`);
  }
  return rows.length ? `<ul class="mr-results" data-key="mrres">${rows.join('')}</ul>` : '';
}

/** Every reading at the table as a tile: reader → target, the call and the truth, right or wrong. */
function readingsGrid(v, L, me) {
  const ids = [...v.players].sort((a, b) => a.seat - b.seat).map((p) => p.id);
  return `<section class="w-grid" data-key="wgrid"><div class="rule">${t('Every reading')}</div><ul>${ids.filter((id) => id !== me).map((id) => {
    const tg = L.targets[id];
    const pred = L.preds[id];
    const hit = pred && pred === L.answers[tg];
    return `<li class="${hit ? 'hit' : pred ? 'miss' : 'none'}">${disc(v, id, 'sm')}<i class="w-arrow">→</i>${disc(v, tg, 'sm')}
      <span class="w-call"><b>${pred ? numOf(pred) : '—'}</b><small>${esc(numOf(L.answers[tg]))}</small></span><span class="w-names">${esc(rawName(v, id))}<small>${esc(rawName(v, tg))}</small></span></li>`;
  }).join('')}</ul></section>`;
}

export function mirrorDock(v, h) {
  const { S: UI, commitBtn, sealedNote } = h;
  const a = v.action || {};
  if (a.type !== 'wballot') return [];
  const ready = UI.sel.wown && UI.sel.wpred;
  if (a.ballot && UI.sel.wown === a.ballot.own && UI.sel.wpred === a.ballot.pred) return [sealedNote(t('Sealed · you can change it until everyone is in'), 'wsealed')];
  return [ready ? commitBtn('secret', 'wSeal', a.ballot ? t('Change my ballot') : t('Seal my ballot')) : `<span class="dock-note" data-key="wdn">${t('Choose both answers')}</span>`];
}

export function mirrorActs(h) {
  const { S: UI, send, render, haptic } = h;
  return {
    wOwn(el) { UI.sel.wown = el.dataset.id; haptic(6); render(); },
    wPred(el) { UI.sel.wpred = el.dataset.id; haptic(6); render(); },
    wHold(el) { UI.sel.wseal = el.dataset.id; haptic(4); render(); },
    // Place the seal you hold; after your own, the hand moves to your target's seal if it is still unplaced.
    wFate(el) {
      const x = el.dataset.id;
      if ((UI.sel.wseal ?? 'own') === 'own') { UI.sel.wown = x; if (!UI.sel.wpred) UI.sel.wseal = 'pred'; } else UI.sel.wpred = x;
      haptic(8); render();
    },
    async wSeal() { if (UI.sel.wown && UI.sel.wpred) await send('w.ballot', { own: UI.sel.wown, pred: UI.sel.wpred }); },
    wSet(el) {
      const packs = [...document.querySelectorAll('[data-act-change="wSet"][data-id="pack"]')].filter((x) => x.checked).map((x) => x.value);
      if (packs.length) send('host.settings', { w: { packs } }, { quiet: true });
      else el.checked = true;
    },
  };
}
export const MIRROR_QUIET = ['wOwn', 'wPred', 'wHold', 'wFate'];

// ── Scenes ─────────────────────────────────────────────────────────────────
export function mirrorMoment(l) {
  if (l.ev === 'w-prompt') return { type: 'wprompt', round: l.round, dilemma: l.dilemma, sound: 'bell' };
  if (l.ev === 'w-reveal') return { type: 'wreveal', dilemma: l.dilemma, answers: l.answers, sound: 'shuffle' };
  return null;
}
export const W_MOMENT_TIME = { wprompt: 4800, wreveal: 3200 };

export function mirrorMomentHtml(m, h) {
  const { letters, V } = h;
  if (m.type === 'wprompt') return `<div class="m-art w-mart">${emblem('s_self')}</div><span class="kicker">${esc(th('Dilemma {n} of {m}', { n: m.round, m: V()?.mirror?.rounds ?? 8 }))}</span>
    ${dilemmaCard(m.dilemma, { size: 'scene', round: m.round })}`;
  const c = counts(m.answers);
  return `<div class="m-art w-mart w-lit">${emblem('s_self')}</div><span class="kicker">${esc(t('The mirror shows'))}</span><h1 class="m-title">${letters(t('Every answer'))}</h1>
    <p class="w-tally">${LETTERS.map((x, i) => `<span style="--i:${i}"><b>${numOf(x)}</b><i>${c[x]}</i></span>`).join('')}</p>`;
}

// ── Lobby ──────────────────────────────────────────────────────────────────
/** How it works: the lobby's step 2 and the guide's chapter header. */
export function explainerHtml(v = null) {
  // DS-002: eight rounds cannot pair everyone with everyone above nine players; the targets rotate.
  const n = v?.players?.length ?? 0;
  const reads = n && n <= 9 ? t('Each round you face one player in the glass; over the game, everyone reads everyone.') : t('Each round you face one player in the glass; the targets rotate, so you read as many people as eight rounds allow.');
  return explainer(t('How The Mirror works'), [
    ['maskedvote', t('A dilemma'), t('Eight rounds, each a fictional dilemma with three answers. None of them is right.')],
    ['medium', t('You read someone'), reads],
    ['mentalist', t('Answer and predict'), t('Seal your own answer and your prediction of theirs. Talk first: tease, ask, mislead.')],
    ['crown', t('Read them right'), t('A right prediction scores 2; your own answer scores nothing. The best reader wins.')],
  ], glyph, 'wexplain');
}

export function mirrorLobbyDeck(v, isHost, h) {
  const n = v.players.length;
  const s = v.settings.w ?? {};
  const packs = [...new Set(DILEMMAS.map((d) => d.pack))];
  const size = (p) => DILEMMAS.filter((d) => d.pack === p).length;
  const packRow = packs.length > 1 ? settingRow(isHost, t('Dilemma packs'), t('Which packs the eight dilemmas are drawn from.'),
    `<span class="w-packs">${packs.map((p) => `<label class="check"><input type="checkbox" data-act-change="wSet" data-id="pack" value="${esc(p)}" ${(s.packs ?? ['core']).includes(p) ? 'checked' : ''}><span>${esc(p)} · ${size(p)}</span></label>`).join('')}</span>`,
    (s.packs ?? ['core']).join(', ')) : '';
  return `${explainerHtml(v)}
    <section class="lobby-deck" data-key="wdeck">
    <div class="rule lstep">${t(n === 1 ? 'The deck · {n} player' : 'The deck · {n} players', { n })}</div>
    <p class="small muted">${n >= 4 ? th('{n} dilemmas in the bank; each game draws eight the table has not seen lately.', { n: DILEMMAS.length }) : t('Seat 4 to 12 players.')}</p>
    ${dilemmaCard(DILEMMAS[8].id, { size: 'lobby' })}
    ${packRow}
    ${h.music ?? ''}
    ${v.wScores ? scoreLedger(v, v.wScores, { title: t('Last game'), key: 'wlast' }) : ''}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
export const mirrorTitle = (v) => { const w = v.mirror?.winners ?? []; return w.length ? tp('{names} wins', '{names} win', w.length, { names: w.map((id) => rawName(v, id)) }) : t('The End'); };

export function mirrorEndHtml(v) {
  const W = v.mirror;
  if (!W?.winners) return '';
  const back = v.deadline ? `<p class="center-text small muted">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const ids = v.players.map((p) => p.id);
  // How well each player was read: how many of their readers got them right.
  const read = Object.fromEntries(ids.map((id) => [id, 0]));
  for (const r of W.history ?? []) for (const id of ids) if (r.preds[id] && r.preds[id] === r.answers[r.targets[id]]) read[r.targets[id]]++;
  const rounds = (W.history ?? []).map((r) => { const c = counts(r.answers); const top = LETTERS.reduce((x, y) => (c[y] > c[x] ? y : x), 'A'); const d = dilemmaText(dilemmaById(r.dilemma)); return `<li><p>${esc(d.prompt)}</p><small>${th('Most chose {x}: {answer}', { x: numOf(top), answer: d.choices[LETTERS.indexOf(top)] })}</small></li>`; }).join('');
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
  const marks = L ? Object.fromEntries(Object.entries(L.answers).map(([id, x]) => [id, numOf(x)])) : v.phase === 'W_CHOOSE' ? Object.fromEntries(W.locked.map((id) => [id, '✓'])) : {};
  const title = v.phase === 'W_PROMPT' ? t('Talk it over') : v.phase === 'W_CHOOSE' ? t('Seal your ballots') : L ? t('The mirror shows every answer') : '';
  const sub = v.phase === 'W_CHOOSE' ? th('Ballots sealed · {done}/{total}', v.progress ?? { done: 0, total: 0 }) : v.phase === 'W_PROMPT' ? t('Each arrow: who reads whom this round.') : '';
  const now = { kicker: ended ? t('The end') : th('Dilemma {n} of {m}', { n: W.round, m: W.rounds }), title: esc(title),
    line: v.phase === 'W_PROMPT' ? t('Each arrow: who reads whom this round.') : v.phase === 'W_CHOOSE' ? t('Your own answer, and your guess at the one you read.') : '',
    herald: v.phase === 'W_PROMPT' ? t('Talk it over. Ballots open next.') : v.phase === 'W_CHOOSE' ? t('Seal your ballot on your phone.') : ended ? t('The host chooses: again, or another game.') : '' };
  if (ended) return tvFrame(v, h, { stage: `<div class="wt-end" data-autoscroll>${mirrorEndHtml(v)}</div>`, ledger: nowCard({ ...now, title: '' }), herald: now.herald, key: 'board-w', cls: 'wboard is-ended' });
  // TV-G7 / TV-A6: the companion table (who reads whom) in the left column, the dilemma card the hero.
  const table = ring(v, { center: `<span class="c-sub">${esc(th('Dilemma {n} of {m}', { n: W.round, m: W.rounds }))}</span>`, extra: seatArrows(v, pairs, `warr-${W.round}-${v.phase}`), marks });
  const stage = `<div class="duo"><div class="duo-t">${table}<p class="duo-cap">${esc(t('Who reads whom'))}</p></div>
    <div class="duo-h">${dilemmaCard(W.dilemma, L ? { size: 'tv', round: W.round, who: chosenBy(v, L.answers), v, auto: L.auto } : { size: 'tv', round: W.round })}</div></div>`;
  const ledger = `${nowCard(now)}${scoreLedger(v, W.scores, { title: t('The readers'), key: 'wtled' })}`;
  return tvFrame(v, h, { stage, ledger, herald: now.herald, key: 'board-w', cls: 'wboard' });
}
