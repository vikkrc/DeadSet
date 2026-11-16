// Dead Set: Séance — the client (phones, TV, scenes, lobby, end). See SEANCE.md.
//
// Visions are vellum cards with two or three pencil motifs colliding inside the
// arch. Story cards (WHO / WHERE / WHY) are vellum too; WHERE carries its
// backdrop etching. The Ghost's phone is its own (it holds the truth and the
// hand); every reader's phone, Deceiver included, runs the same screens: the
// Deceiver's false visions live in the same drawer every reader has.

import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { cardArt } from './cards.js';
import { t, th, tmh, roleF, scenAt, setNamer } from './i18n.js';
import { avatarSvg } from './avatar.js';
import { backdropSvg } from './backdrops.js';
import { VISIONS } from './visions.js';

export const isSeancePhase = (ph) => typeof ph === 'string' && ph.startsWith('S_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ROWS = ['WHO', 'WHERE', 'WHY'];
const ROW_LABEL = { WHO: 'Who', WHERE: 'Where', WHY: 'Why' };
const ROW_Q = { WHO: 'Who killed me?', WHERE: 'Where did it happen?', WHY: 'Why did it happen?' };
const ROW_NAME = { WHO: 'who killed me', WHERE: 'where it happened', WHY: 'why it happened' };
const ROW_EMB = { WHO: 's_crowd', WHY: 'key' };
setNamer('row', (r) => t(ROW_NAME[r] ?? r));
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const pname = (v, id) => esc(v.players.find((p) => p.id === id)?.name ?? t('Someone'));
const rawName = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
const cardName = (row, idx) => scenAt(row, idx);
const ROLE_EMB = { S_GHOST: 'shade', S_MEDIUM: 'medium', S_DECEIVER: 'charlatan' };

// ── Cards ──────────────────────────────────────────────────────────────────
/** A vision: two or three motifs collide in the arch. Language-free. */
export function vcard(id, { cls = '', frost = false, act = '', sel = false, key = '', label = '', mark = '' } = {}) {
  const vi = VISIONS[id];
  const tag = act ? 'button' : 'span';
  const attrs = `${act ? `data-act="${act}" data-id="${esc(label || id)}" aria-pressed="${sel}"` : ''} ${key ? `data-key="${key}"` : ''}`;
  if (!vi) return `<${tag} class="arc back vcard ${cls}" ${attrs} aria-label="${esc(t('A vision, face down'))}"><span class="sig">DS</span></${tag}>`;
  const motifs = vi.motifs.map((m, i) => `<span class="vm vm${i + 1}">${emblem(m)}</span>`).join('');
  return `<${tag} class="arc vcard vl${vi.layout} ${frost ? 'frost' : ''} ${sel ? 'sel' : ''} ${cls}" ${attrs} aria-label="${esc(t('A vision'))}">
    <span class="v-art" aria-hidden="true"><svg class="v-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray=".7 4.1"/></svg>${motifs}</span>
    ${frost ? `<span class="v-frost">${emblem('v_snow')}<b>${esc(t('Cold spot'))}</b></span>` : ''}${mark ? `<span class="v-mark">${mark}</span>` : ''}</${tag}>`;
}

/** A story card: WHO / WHERE / WHY. WHERE shows its backdrop etching. */
export function scard(row, idx, { cls = '', act = '', sel = false, key = '', state = '' } = {}) {
  const tag = act ? 'button' : 'span';
  const attrs = `${act ? `data-act="${act}" data-id="${idx}" aria-pressed="${sel}"` : ''} ${key ? `data-key="${key}"` : ''}`;
  const art = row === 'WHERE' ? `<span class="s-bd" aria-hidden="true">${backdropSvg(idx, 'card')}</span>` : cardArt(ROW_EMB[row]);
  return `<${tag} class="arc scard row-${row} ${state} ${sel ? 'sel' : ''} ${cls}" ${attrs}>
    <span class="arc-num">${esc(t(ROW_LABEL[row]))}</span>${art}<span class="nm">${esc(cardName(row, idx))}</span>${state === 'struck' ? '<i class="s-x" aria-hidden="true"></i>' : ''}</${tag}>`;
}

/** A role card for the reveal. */
function rcard(id, cls = '') {
  return `<span class="arc srole ${id === 'S_DECEIVER' ? 'rubric' : ''} ${cls}"><span class="arc-num">${esc(t('Séance'))}</span>${cardArt(ROLE_EMB[id] ?? 'medium')}<span class="nm">${esc(roleF(id, 'name'))}</span></span>`;
}

/** The séance clock: candles, burnt ones gone out. */
export function candles(S) {
  const n = S.candles;
  return `<div class="scandles" data-key="scandles" role="img" aria-label="${esc(th('{n} of {m} candles left', { n: n - S.burnt, m: n }))}">${Array.from({ length: n }, (_, i) => `<i class="scdl ${i < S.burnt ? 'out' : ''}">${emblem('innocent')}</i>`).join('')}</div>`;
}

const stateOf = (S, row, idx, truth) => (S.solved[row] === idx ? 'solved' : S.struck[row].includes(idx) ? 'struck' : truth != null && truth === idx ? 'truth' : S.solved[row] != null ? 'dim' : '');
/** One row of candidates. */
function rowCards(v, row, { act = '', sel = null, truth = null, size = '' } = {}) {
  const S = v.seance;
  return `<div class="srow-cards ${size}" data-key="src-${row}">${S.board[row].map((idx) => {
    const st = stateOf(S, row, idx, truth);
    const live = act && st !== 'struck' && st !== 'solved' && st !== 'dim';
    return scard(row, idx, { act: live ? act : '', sel: sel === idx, state: st, key: `sc-${row}-${idx}` });
  }).join('')}</div>`;
}

function disc(v, id, cls = '') {
  const p = v.players.find((x) => x.id === id);
  return `<span class="s-disc ${cls}">${p?.avatar ? avatarSvg(p.avatar, 's-av') : `<b>${esc((p?.name ?? '?').slice(0, 1))}</b>`}</span>`;
}

/** Readers and the visions they hold, row by row (public from the reveal on). */
function visionRows(v, { act = '', sel = null, ghostSent = null, compact = false } = {}) {
  const S = v.seance;
  const rows = ROWS.filter((r) => Object.values(S.assign).includes(r));
  return `<div class="svrows ${compact ? 'compact' : ''}" data-key="svrows">${rows.map((row) => `<section class="svrow" data-key="svr-${row}">
    <span class="kicker">${esc(t(ROW_Q[row]))}</span>
    <div class="svr-list">${Object.keys(S.assign).filter((id) => S.assign[id] === row).map((id) => {
      const vs = S.shown?.[id] ?? [];
      const frost = S.frosted.includes(id);
      const notMine = ghostSent && vs.some((x) => !(ghostSent[id] ?? []).includes(x));
      return `<figure class="svr-item ${frost ? 'frost' : ''}" data-key="svi-${id}">${vs.length ? vs.map((x) => vcard(x, { cls: 'thumb', frost, act: act && !frost ? act : '', sel: sel === id, label: id, mark: notMine ? glyph('close') : '' })).join('') : vcard(null, { cls: 'thumb' })}
        <figcaption>${disc(v, id, 'xs')}${pname(v, id)}</figcaption></figure>`;
    }).join('')}</div></section>`).join('')}</div>`;
}

const slip = (kicker, title, sub = '', cls = '') => `<div class="k-slip ${cls} rise-in" data-key="sslip-${esc(String(kicker)).slice(0, 18)}"><span class="kicker">${kicker}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;

function chipsRow(v) {
  if (!v.me || v.me.moderator) return '';
  const notes = (v.private || []).length;
  return `<nav class="chips" data-key="schips">
    <button class="chip" data-act="sheet" data-id="sboard">${glyph('p_candle')}<span>${t('The board')}</span><b>${v.seance.candles - v.seance.burnt}</b></button>
    <button class="chip" data-act="sheet" data-id="notes">${glyph('scroll')}<span>${t('Notes')}</span>${notes ? `<b>${notes}</b>` : ''}</button>
  </nav>`;
}

function truthStrip(S, truth) {
  return `<div class="s-truth" data-key="struth"><span class="kicker">${t('The truth · only you know')}</span><div class="st-cards">${ROWS.map((r) => scard(r, truth[r], { cls: 'mini', state: S.solved[r] != null ? 'solved' : 'truth' })).join('')}</div></div>`;
}
const MUTE = () => `<p class="s-mute" data-key="smute">${glyph('shade')}<span>${t('You cannot speak. No words, no sounds, no gestures.')}</span></p>`;

/** Every reader's drawer: the same button on every phone; only the Deceiver's holds anything. */
function drawer(v, h) {
  const { S: UI } = h;
  const s = v.me?.s ?? {};
  const open = !!UI.ui.sdrawer;
  let body = '';
  if (open) {
    if (s.role === 'DECEIVER') {
      const sw = s.swap;
      const sel = UI.sel.sfake;
      const targets = Object.keys(v.seance.assign).filter((id) => id !== v.me.id);
      body = s.swapsLeft > 0 ? `<p class="small">${th(s.swapsLeft === 1 ? 'Swap one reader\'s vision for one of yours. {n} swap left.' : 'Swap one reader\'s vision for one of yours. {n} swaps left.', { n: s.swapsLeft })}</p>
        <div class="sd-hand">${(s.dhand ?? []).map((x) => vcard(x, { cls: 'thumb', act: 'sFake', sel: sel === x || sw?.vision === x, key: `sf-${x}` })).join('')}</div>
        <div class="npick" data-key="sdpick">${targets.map((id) => `<button class="nseat ${sw?.target === id ? 'sel' : ''}" data-act="sFakeTo" data-id="${id}" aria-pressed="${sw?.target === id}">${disc(v, id)}<span class="ns-name">${pname(v, id)}</span></button>`).join('')}</div>
        ${sw ? `<p class="small">${th('{name}\'s vision will be swapped.', { name: rawName(v, sw.target) })} <button class="btn btn-ghost btn-sm" data-act="sFakeOff">${t('Cancel')}</button></p>` : ''}`
        : `<p class="small muted">${t('No swaps left.')}</p>`;
    } else body = `<p class="small muted">${t('You hold no visions. The Ghost will send you one.')}</p>`;
  }
  return `<div class="s-drawer ${open ? 'open' : ''}" data-key="sdrawer"><button class="chip" data-act="sDrawer" aria-expanded="${open}">${glyph('p_cards')}<span>${t('Your hand')}</span></button>${open ? `<div class="sd-body vellum" data-key="sdbody">${body}</div>` : ''}</div>`;
}

// ── Phone ──────────────────────────────────────────────────────────────────
export function seanceMain(v, me, h) {
  const { S: UI, head } = h;
  const S = v.seance;
  if (!S) return head(v);
  if (UI.sel.sphase !== v.phaseId) { UI.sel.sphase = v.phaseId; UI.sel.scard = null; UI.sel.sv = null; UI.sel.spick = []; UI.sel.sfake = null; }
  const a = v.action || {};
  const s = me?.s ?? {};
  const ghost = s.role === 'GHOST';
  let stage = '';
  switch (v.phase) {
    case 'S_INTRO': {
      const open = !!UI.ui.sflip;
      const id = { GHOST: 'S_GHOST', DECEIVER: 'S_DECEIVER' }[s.role] ?? 'S_MEDIUM';
      const text = { GHOST: 'You were murdered. Send each reader a vision; frost a lie with a cold spot.', DECEIVER: 'You know the truth, and you lie. Swap a few visions for your own; never get named.', MEDIUM: 'Read the visions, argue, and light candles on the truth. Then name the Deceiver.' }[s.role];
      stage = `${slip(t('The séance'), th('{a} is the Ghost', { a: rawName(v, S.ghost) }), t('Shield your screen. Tap the card to turn it over.'))}
        <div class="ndeal" data-key="sdeal"><button class="nflip ${open ? 'open' : ''}" data-act="sFlip" data-key="sflip-${open ? 'o' : 'c'}">${open ? rcard(id, 'big') : '<span class="arc back srole big"><span class="sig">DS</span></span>'}</button></div>
        ${open ? `<p class="npow">${esc(t(text))}</p>${s.truth ? truthStrip(S, s.truth) : ''}${s.fellows?.length ? `<p class="npow">${th('The other Deceiver: {names}.', { names: s.fellows.map((x) => rawName(v, x)) })}</p>` : ''}` : ''}
        ${a.done ? `<p class="small muted center-text">${th('Waiting for the others · {done}/{total}', v.progress ?? { done: 0, total: 0 })}</p>` : ''}`;
      break;
    }
    case 'S_VISION': {
      if (ghost) {
        const hand = s.hand ?? [];
        stage = `${slip(th('Round {n}', { n: S.round }), t('Send a vision to each reader'), t('Tap a vision, then tap a reader. Tap a sent vision to take it back.'))}${MUTE()}${truthStrip(S, s.truth)}
          <div class="sg-readers" data-key="sgr">${Object.keys(S.assign).map((id) => {
            const sent = s.sent?.[id] ?? [];
            const slots = Array.from({ length: S.perMedium }, (_, k) => sent[k] != null ? vcard(sent[k], { cls: 'thumb', act: 'sUnsend', label: id, key: `sgs-${id}-${k}` }) : `<button class="sg-empty" data-act="sSendTo" data-id="${id}" data-key="sge-${id}-${k}"><b>+</b></button>`).join('');
            return `<div class="sg-slot ${sent.length >= S.perMedium ? 'full' : ''}" data-key="sg-${id}"><span class="sg-who">${disc(v, id)}<b>${pname(v, id)}</b><small>${esc(t(ROW_LABEL[S.assign[id]]))} · ${esc(cardName(S.assign[id], s.truth[S.assign[id]]))}</small></span><span class="sg-sent">${slots}</span></div>`;
          }).join('')}</div>
          <div class="sg-hand" data-key="sghand"><span class="kicker">${t('Your hand')}</span><div class="sgh-cards">${hand.map((x) => vcard(x, { act: 'sPickV', sel: UI.sel.sv === x, key: `sh-${x}` })).join('')}</div></div>`;
      } else {
        const row = a.row;
        stage = `${slip(th('Round {n}', { n: S.round }), esc(t(ROW_Q[row])), t('The Ghost is choosing your vision. Mark a first impression: it changes nothing, and nobody sees it.'))}
          ${rowCards(v, row, { act: 'sImpress', sel: s.impression })}
          ${s.impression != null ? `<p class="small muted center-text">${th('First impression: {card}', { card: cardName(row, s.impression) })} · ${th('Waiting for the others · {done}/{total}', v.progress ?? { done: 0, total: 0 })}</p>` : ''}
          ${drawer(v, h)}`;
      }
      break;
    }
    case 'S_DISCUSS': {
      const mine = s.visions ?? [];
      const frostMine = S.frosted.includes(me?.id);
      stage = ghost
        ? `${slip(t('Discussion'), t('They argue. You cannot speak.'), th(S.cold === 1 ? 'Tap a vision that is not yours to frost it with a cold spot. {n} left.' : 'Tap a vision that is not yours to frost it with a cold spot. {n} left.', { n: S.cold }))}${MUTE()}${truthStrip(S, s.truth)}${visionRows(v, { act: S.cold > 0 ? 'sPickCold' : '', sel: UI.sel.scold, ghostSent: s.sent })}`
        : `${slip(t('Discussion'), esc(t(ROW_Q[s.row])), t('Describe what you see. Argue. The Ghost stays silent.'))}
          <div class="s-mine" data-key="smine"><span class="kicker">${t('Your vision')}</span><div class="sm-cards">${mine.map((x) => vcard(x, { cls: 'big', frost: frostMine })).join('')}</div></div>
          ${visionRows(v, { compact: true })}`;
      break;
    }
    case 'S_CANDLE': case 'S_LAST': {
      if (ghost) { stage = `${slip(t('Candles'), t('They choose. You cannot speak.'), '')}${MUTE()}${truthStrip(S, s.truth)}`; break; }
      const row = a.row;
      const pick = UI.sel.scard ?? (typeof s.lit === 'number' ? s.lit : null);
      const rv = Object.keys(S.assign).filter((id) => S.assign[id] === row && S.shown?.[id]).flatMap((id) => S.shown[id].map((x) => ({ id, x })));
      stage = `${slip(v.phase === 'S_LAST' ? t('The last breath') : t('Candles'), esc(t(ROW_Q[row])), s.lit != null ? (s.lit === 'abstain' ? t('You hold your candle.') : th('Your candle burns on {card}.', { card: cardName(row, s.lit) })) : t('Light your candle on one card, or hold it back. The most candles are put to the spirit.'))}
        ${rowCards(v, row, { act: 'sPickCard', sel: pick })}
        ${rv.length ? `<div class="s-ref" data-key="sref"><span class="kicker">${t('The visions for this row')}</span><div class="sr-cards">${rv.map(({ id, x }) => `<figure>${vcard(x, { cls: 'thumb', frost: S.frosted.includes(id) })}<figcaption>${pname(v, id)}</figcaption></figure>`).join('')}</div></div>` : ''}`;
      break;
    }
    case 'S_NAMING': {
      if (ghost) { stage = `${slip(t('The naming'), t('Who came through with you?'), t('You cannot speak.'))}${MUTE()}`; break; }
      const sel = UI.sel.spick ?? [];
      stage = `${slip(t('The naming'), t(a.count > 1 ? 'Name the two Deceivers' : 'Name the Deceiver'), s.named ? th('You named {names}.', { names: s.named.map((x) => rawName(v, x)) }) : t('Name them correctly for the full victory. Name the wrong player, and the Deceiver wins too.'))}
        <div class="npick" data-key="snpick">${(a.targets ?? []).map((id) => `<button class="nseat ${sel.includes(id) || (!sel.length && s.named?.includes(id)) ? 'sel' : ''}" data-act="sPickName" data-id="${id}" aria-pressed="${sel.includes(id)}">${disc(v, id)}<span class="ns-name">${pname(v, id)}</span></button>`).join('')}</div>`;
      break;
    }
    default: break;
  }
  return `${head(v)}${candles(S)}${stage}${chipsRow(v)}`;
}

export function seanceDock(v, h) {
  const { S: UI, btn, holdBtn } = h;
  const a = v.action || {};
  const S = v.seance;
  const s = v.me?.s ?? {};
  const parts = [];
  const note = (x) => `<span class="dock-note" data-key="sdn">${x}</span>`;
  switch (a.type) {
    case 'sintro': if (!a.done) parts.push(btn(t('I am ready'), 'sAck', 'btn-solid', !UI.ui.sflip)); break;
    case 'ssend': parts.push(note(th('Sent {done} of {total}', { done: Object.values(s.sent ?? {}).reduce((n, x) => n + x.length, 0), total: Object.keys(S.assign).length * S.perMedium }))); break;
    case 'scold': if (UI.sel.scold && S.cold > 0) parts.push(holdBtn('sCold', th('Hold to frost {name}\'s vision', { name: rawName(v, UI.sel.scold) }), 'btn-blood')); break;
    case 'slight': {
      const pick = UI.sel.scard;
      if (pick != null && pick !== s.lit) parts.push(holdBtn('sLight', t('Hold to light the candle'), 'btn-blood'));
      else if (s.lit == null) parts.push(holdBtn('sAbstain', t('Hold my candle'), ''));
      else parts.push(`<span class="dock-note stamped" data-key="slit">${glyph('check')} ${t('Your candle is lit')}</span>`);
      break;
    }
    case 'sname': {
      const sel = UI.sel.spick ?? [];
      if (sel.length === a.count) parts.push(holdBtn('sName', th('Hold to name {names}', { names: sel.map((x) => rawName(v, x)) }), 'btn-blood'));
      else if (!s.named) parts.push(note(t(a.count > 1 ? 'Choose two players' : 'Choose one player')));
      break;
    }
    default: break;
  }
  return parts;
}

export function seanceActs(h) {
  const { S: UI, V, send, render, haptic, notify } = h;
  return {
    sFlip() { UI.ui.sflip = !UI.ui.sflip; render(); },
    async sAck() { await send('s.ack', {}); },
    sDrawer() { UI.ui.sdrawer = !UI.ui.sdrawer; render(); },
    sPickV(el) { const x = Number(el.dataset.id); UI.sel.sv = UI.sel.sv === x ? null : x; haptic(6); render(); },
    async sSendTo(el) {
      if (UI.sel.sv == null) { notify?.(t('Tap a vision in your hand first.')); return; }
      if (await send('s.send', { target: el.dataset.id, vision: UI.sel.sv }, { quiet: true })) { UI.sel.sv = null; haptic(8); }
    },
    async sUnsend(el) { await send('s.unsend', { target: el.dataset.id }, { quiet: true }); },
    async sImpress(el) { await send('s.impress', { card: Number(el.dataset.id) }, { quiet: true }); },
    sFake(el) { UI.sel.sfake = Number(el.dataset.id); render(); },
    async sFakeTo(el) {
      const vision = UI.sel.sfake ?? V().me?.s?.swap?.vision;
      if (vision == null) { notify?.(t('Tap one of your visions first.')); return; }
      if (await send('s.swap', { target: el.dataset.id, vision }, { quiet: true })) UI.sel.sfake = null;
    },
    async sFakeOff() { await send('s.swap', { target: null }, { quiet: true }); },
    sPickCold(el) { UI.sel.scold = UI.sel.scold === el.dataset.id ? null : el.dataset.id; render(); },
    async sCold() { if (await send('s.cold', { target: UI.sel.scold })) UI.sel.scold = null; },
    sPickCard(el) { UI.sel.scard = Number(el.dataset.id); haptic(6); render(); },
    async sLight() { if (await send('s.light', { card: UI.sel.scard })) UI.sel.scard = null; },
    async sAbstain() { await send('s.light', { card: 'abstain' }); },
    sPickName(el) {
      const a = V().action || {};
      const id = el.dataset.id;
      let sel = [...(UI.sel.spick ?? [])];
      sel = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id].slice(-(a.count ?? 1));
      UI.sel.spick = sel; haptic(6); render();
    },
    async sName() { if (await send('s.name', { targets: UI.sel.spick })) UI.sel.spick = []; },
    sSet(el) {
      const key = el.dataset.id;
      const raw = el.type === 'checkbox' ? el.checked : el.value;
      const val = ['swaps', 'colds', 'games'].includes(key) ? Number(raw) : raw === '' ? null : raw;
      send('host.settings', { s: { [key]: val } }, { quiet: true });
    },
  };
}
export const SEANCE_QUIET = ['sPickV', 'sPickCold', 'sPickCard', 'sPickName', 'sFake', 'sFlip', 'sDrawer', 'sImpress', 'sSendTo', 'sUnsend', 'sFakeTo', 'sFakeOff'];

/** The board sheet: every row, struck and solved, and the clock. */
export function boardSheet(v) {
  const S = v.seance;
  if (!S) return '';
  const truth = v.me?.s?.truth ?? null;
  return `<div class="s-sheet" data-key="ssheet">${candles(S)}${ROWS.map((r) => `<section><span class="kicker">${esc(t(ROW_Q[r]))}</span>${rowCards(v, r, { truth: truth?.[r] ?? null, size: 'sm' })}</section>`).join('')}
    ${S.shown ? `<div class="rule">${t('This round\'s visions')}</div>${visionRows(v, { compact: true })}` : ''}</div>`;
}

// ── Scenes ─────────────────────────────────────────────────────────────────
export function seanceMoment(l, v, fresh, { notify, name: nm }) {
  const S = v.seance;
  switch (l.ev) {
    case 's-lottery': {
      const order = l.order.map((id) => ({ id, name: nm(id), av: v.players.find((p) => p.id === id)?.avatar ?? null }));
      return { type: 'mlottery', order, leader: l.leader, leaderName: nm(l.leader), idx: l.order.indexOf(l.leader), spins: l.spins ?? 2, sound: null,
        kickerText: t('The séance'), titleText: t('Who was murdered?'), resultText: t('The Ghost') };
    }
    case 's-round': notify(th('Round {n}. The Ghost reaches out.', { n: l.round })); return null;
    case 's-visions': return { type: 'svisions', count: l.count, shown: l.shown, assign: l.assign, mine: v.me?.id && l.shown?.[v.me.id] ? l.shown[v.me.id] : null, row: v.me?.id ? l.assign?.[v.me.id] : null, sound: 'unfold' };
    case 's-cold': return { type: 'scold', name: nm(l.target), sound: null };
    case 's-verdict': return { type: 'sverdict', count: l.rows.length, rows: l.rows, verdicts: l.verdicts, burnt: l.burnt, candles: l.candles, sound: 'heart' };
    case 's-last': return { type: 'slast', row: l.row, sound: 'bell' };
    case 's-naming': return { type: 'sname', count: l.count, sound: 'bell' };
    case 's-named': return { type: 'snamed', named: (l.named ?? []).map(nm), right: !!l.right, sound: l.right ? 'approve' : 'death' };
    default: return null;
  }
}
export const S_MOMENT_TIME = { svisions: 5200, scold: 2600, sverdict: 6000, slast: 3200, sname: 3000, snamed: 5600 };

export function seanceMomentHtml(m, h) {
  const { letters, onBoard } = h;
  switch (m.type) {
    case 'svisions': {
      if (!onBoard() && m.mine) return `<span class="kicker">${esc(t('Your vision'))}</span><h1 class="m-title">${letters(t(ROW_Q[m.row] ?? 'Your vision'))}</h1><div class="sm-vis">${m.mine.map((x) => vcard(x, { cls: 'big rise-in' })).join('')}</div>`;
      const all = Object.entries(m.shown ?? {});
      return `<span class="kicker">${esc(t('The séance'))}</span><h1 class="m-title">${letters(t('The visions arrive'))}</h1><div class="sm-all">${all.map(([, xs], i) => xs.map((x) => `<span style="--i:${i}">${vcard(x, { cls: 'thumb' })}</span>`).join('')).join('')}</div>`;
    }
    case 'scold': return `<div class="m-art sm-cold">${emblem('v_snow')}</div><span class="kicker">${esc(t('A cold spot'))}</span><h1 class="m-title">${letters(t('This one is not mine'))}</h1><p class="m-sub">${esc(th('{name}\'s vision is frosted.', { name: m.name }))}</p>`;
    case 'sverdict': return `<span class="kicker">${esc(t('The spirit answers'))}</span><div class="sm-verdicts">${(m.rows ?? []).map((r, i) => {
      const x = m.verdicts[r];
      return `<div class="smv ${x.right ? 'right' : x.right === false ? 'wrong' : 'none'}" style="--i:${i}"><span class="kicker">${esc(t(ROW_LABEL[r]))}</span>${x.pick != null ? scard(r, x.pick, { cls: 'mini', state: x.right ? 'solved' : 'struck' }) : `<span class="smv-none">${esc(t('No verdict'))}</span>`}<b>${esc(t(x.right ? 'Yes.' : x.right === false ? 'No.' : 'Silence.'))}</b></div>`;
    }).join('')}</div><p class="m-sub">${esc(th('{n} of {m} candles left', { n: m.candles - m.burnt, m: m.candles }))}</p>`;
    case 'slast': return `<div class="m-art">${emblem('innocent')}</div><span class="kicker">${esc(t('The last breath'))}</span><h1 class="m-title">${letters(t('One last candle'))}</h1><p class="m-sub">${esc(th('Everyone lights a candle on {row}.', { row: t(ROW_NAME[m.row] ?? '') }))}</p>`;
    case 'sname': return `<div class="m-art">${emblem('charlatan')}</div><span class="kicker">${esc(t('The murder is solved'))}</span><h1 class="m-title">${letters(t(m.count > 1 ? 'Name the two Deceivers' : 'Name the Deceiver'))}</h1>`;
    case 'snamed': return `<div class="m-art">${emblem(m.right ? 'shade' : 'charlatan')}</div><span class="kicker">${esc(t('The naming'))}</span><h1 class="m-title">${letters(t(m.right ? 'The spirit rests' : 'Something else came through'))}</h1><p class="m-sub">${esc(m.named.length ? th('Named: {names}.', { names: m.named }) : t('The table could not agree.'))}</p>`;
    default: return '';
  }
}

// ── Lobby ──────────────────────────────────────────────────────────────────
function explainer() {
  const steps = [
    ['shade', 'The Ghost', 'Someone was murdered. Their Ghost knows who, where and why, and cannot speak.'],
    ['p_cards', 'Visions', 'Each round the Ghost sends every reader a wordless vision for one row.'],
    ['charlatan', 'The Deceiver', 'One reader is a second spirit. It knows the truth too, and swaps visions for lies.'],
    ['p_candle', 'Candles', 'Argue, then light candles. Solve all three rows before the clock burns out, then name the Deceiver.'],
  ];
  return `<section class="x-explain" data-key="sexplain"><div class="rule">${t('How the Séance works')}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${t(a)}</b><small>${t(b)}</small></span></li>`).join('')}</ol></section>`;
}

export function scoreboard(v) {
  const S = v.sScores ?? v.seance?.scores ?? {};
  const list = v.players.map((p) => ({ p, s: S[p.id] ?? 0 })).sort((a, b) => b.s - a.s);
  if (!list.some((x) => x.s)) return '';
  return `<section class="x-scores" data-key="sscores"><div class="rule">${t('Scores')}</div><ol class="ledger">${list.map(({ p, s }, i) => `<li><span class="seat">${i + 1}</span><span class="who"><b>${esc(p.name)}</b></span><span class="tags"><span class="tag ${i === 0 ? 'solid' : ''}">${s}</span></span></li>`).join('')}</ol>
    <p class="small muted">${t('Full victory: +2 each. Hollow victory: +1 each, the Deceiver too. The Deceiver alone: +3.')}</p></section>`;
}

export function seanceLobbyDeck(v, isHost, h) {
  const s = v.settings.s ?? {};
  const n = v.players.length;
  const row = (title, sub, control, shown) => `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
  const sel = (key, value, opts) => `<select class="input lang-select" data-act-change="sSet" data-id="${key}">${opts.map(([x, l]) => `<option value="${x}" ${String(value) === String(x) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const sw = (key, on) => `<input type="checkbox" class="switch" data-act-change="sSet" data-id="${key}" ${on ? 'checked' : ''}>`;
  const DIFF = [['gentle', t('Gentle')], ['standard', t('Standard')], ['grim', t('Grim')]];
  const DIFF_SUB = { gentle: 'Five cards a row, two visions each, eight candles.', standard: 'Six cards a row, one vision each, seven candles.', grim: 'Eight cards a row, one vision each, seven candles.' };
  const DEC = [['auto', t('One (none at four)')], ['none', t('None')], ['one', t('One')], ['two', t('Two (from nine)')]];
  const decN = s.deceivers === 'none' ? 0 : s.deceivers === 'two' ? (n >= 9 ? 2 : n >= 5 ? 1 : 0) : s.deceivers === 'one' ? 1 : n >= 5 ? 1 : 0;
  return `${explainer()}
    <section class="lobby-deck" data-key="sdeck">
    <div class="rule">${t(n === 1 ? 'The table · {n} player' : 'The table · {n} players', { n })}</div>
    <p class="small muted">${n >= 4 ? th(decN === 1 ? 'One Ghost, {m} readers, {d} Deceiver among them.' : decN ? 'One Ghost, {m} readers, {d} Deceivers among them.' : 'One Ghost and {m} readers, all honest.', { m: Math.max(0, n - 1), d: decN }) : t('Seat 4 to 10 players.')}</p>
    <div class="s-lobbycards" data-key="slc">${['S_GHOST', 'S_MEDIUM', 'S_DECEIVER'].map((id) => rcard(id, 'thumb')).join('')}</div>
    ${row(t('Difficulty'), t(DIFF_SUB[s.difficulty ?? 'standard']), sel('difficulty', s.difficulty ?? 'standard', DIFF), t(DIFF.find((x) => x[0] === (s.difficulty ?? 'standard'))[1]))}
    ${row(t('Deceivers'), t('A second spirit among the readers.'), sel('deceivers', s.deceivers ?? 'auto', DEC), DEC.find((x) => x[0] === (s.deceivers ?? 'auto'))[1])}
    ${s.deceivers === 'two' ? row(t('Deceivers know each other'), '', sw('know', s.know !== false), t(s.know !== false ? 'On' : 'Off')) : ''}
    ${row(t('The Deceiver\'s swaps'), t('How many visions it may swap in a game.'), sel('swaps', s.swaps ?? 3, [[2, '2'], [3, '3'], [4, '4']]), String(s.swaps ?? 3))}
    ${row(t('The Ghost\'s cold spots'), t('How many visions the Ghost may frost: "this one is not mine".'), sel('colds', s.colds ?? 3, [[2, '2'], [3, '3'], [4, '4']]), String(s.colds ?? 3))}
    ${row(t('Last breath'), t('If the candles run out with one row open, everyone lights one final candle on it.'), sw('lastBreath', s.lastBreath !== false), t(s.lastBreath !== false ? 'On' : 'Off'))}
    ${row(t('The Ghost'), t('Drawn by lot, or chosen by the host.'), sel('ghost', s.ghost ?? 'lot', [['lot', t('Drawn by lot')], ['host', t('Chosen')]]), t(s.ghost === 'host' ? 'Chosen' : 'Drawn by lot'))}
    ${s.ghost === 'host' ? row(t('Who plays the Ghost'), '', sel('ghostId', s.ghostId ?? '', [['', '—'], ...v.players.map((p) => [p.id, esc(p.name)])]), s.ghostId ? pname(v, s.ghostId) : '—') : ''}
    ${row(t('Games per match'), t('Scores carry over between games.'), sel('games', s.games ?? 1, [[1, '1'], [2, '2'], [3, '3']]), String(s.games ?? 1))}
    ${h.music ?? ''}
    ${scoreboard(v)}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
export const seanceTitle = (result) => ({ full: 'The spirit rests.', hollow: 'A hollow victory.', deceiver: 'The Deceiver wins.', lost: 'The candles gutter.' }[result] ?? 'The End');

export function seanceEndHtml(v) {
  const S = v.seance;
  if (!S?.truth) return '';
  const back = v.deadline ? `<p class="center-text small muted">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const dec = S.deceiverIds ?? [];
  const truth = `<section data-key="setruth"><div class="rule">${t('The murder')}</div><div class="se-truth">${ROWS.map((r) => scard(r, S.truth[r], { state: S.solved[r] != null ? 'solved' : 'truth' })).join('')}</div>
    <p class="center-text se-line">${tmh(['{who}, in {where}, to {why}.', { who: scenAt('WHO', S.truth.WHO), where: scenAt('WHERE', S.truth.WHERE), why: scenAt('WHY', S.truth.WHY) }])}</p></section>`;
  const decs = dec.length ? `<section data-key="sedec"><div class="rule">${t(dec.length > 1 ? 'The Deceivers' : 'The Deceiver')}</div><ul class="se-dec">${dec.map((id) => `<li>${disc(v, id)}<b>${pname(v, id)}</b>${S.nameTally ? `<small>${th(S.nameTally[id] === 1 ? 'named by {n}' : 'named by {n}', { n: S.nameTally[id] ?? 0 })}</small>` : ''}</li>`).join('')}</ul></section>` : '';
  const rounds = (S.history ?? []).map((h, k) => {
    const readers = Object.keys(h.assign);
    const lines = readers.map((id) => {
      const sent = h.sent?.[id] ?? [];
      const shown = h.shown?.[id] ?? [];
      const sw = (h.swaps ?? []).find((x) => x.target === id);
      const lit = h.lit?.[id];
      const row = h.assign[id];
      const cardsHtml = h.round === 'last' ? '' : `<span class="se-vis">${shown.map((x) => vcard(x, { cls: 'thumb', frost: h.frosted?.includes(id) })).join('')}${sw ? `<span class="se-swap">${glyph('close')}<small>${th('swapped by {name}; the Ghost sent', { name: rawName(v, sw.by) })}</small>${vcard(sw.from, { cls: 'thumb' })}</span>` : ''}</span>`;
      return `<li class="${dec.includes(id) ? 'dec' : ''}"><span class="se-who">${disc(v, id, 'xs')}<b>${pname(v, id)}</b><small>${esc(t(ROW_LABEL[row]))}</small></span>${cardsHtml}
        <span class="se-lit">${lit == null ? `<small>${t('no candle')}</small>` : lit === 'abstain' ? `<small>${t('held their candle')}</small>` : `${glyph('p_candle')}<small>${esc(cardName(row, lit))}</small>`}${h.impressions?.[id] != null ? `<small class="muted">${th('first impression: {card}', { card: cardName(row, h.impressions[id]) })}</small>` : ''}</span></li>`;
    }).join('');
    const verdicts = Object.entries(h.verdicts ?? {}).map(([r, x]) => `<span class="tag ${x.right ? 'solid' : x.right === false ? 'blood' : ''}">${esc(t(ROW_LABEL[r]))}: ${x.pick != null ? esc(cardName(r, x.pick)) : esc(t('no verdict'))}</span>`).join('');
    const open = k === (S.history.length - 1);
    return `<li class="se-round"><details class="more" ${open ? 'open' : ''} data-key="ser-${k}"><summary>${h.round === 'last' ? t('The last breath') : th('Round {n}', { n: h.round })}<span class="se-sum">${verdicts}</span></summary><ul class="se-lines">${lines}</ul></details></li>`;
  }).join('');
  return `${back}${truth}${decs}${rounds ? `<section data-key="serounds"><div class="rule">${t('The whole séance')}</div><ol class="se-rounds">${rounds}</ol></section>` : ''}${scoreboard(v)}`;
}

// ── TV ─────────────────────────────────────────────────────────────────────
export function seanceBoard(v, h) {
  const { header } = h;
  const S = v.seance;
  if (!S) return '';
  const ended = v.phase === 'ENDED';
  const prog = v.progress ?? { done: 0, total: 0 };
  const now = {
    S_INTRO: th('{a} is the Ghost. Everyone looks at their role · {done}/{total}', { a: rawName(v, S.ghost), ...prog }),
    S_VISION: t('The Ghost reaches out. Visions are on their way.'),
    S_DISCUSS: t('Describe your visions. The Ghost stays silent.'),
    S_CANDLE: th('Light the candles · {done}/{total}', prog),
    S_LAST: th('The last breath · {done}/{total}', prog),
    S_NAMING: th(S.deceivers > 1 ? 'Name the two Deceivers · {done}/{total}' : 'Name the Deceiver · {done}/{total}', prog),
  }[v.phase] ?? '';
  const readersOf = (row) => Object.keys(S.assign).filter((id) => S.assign[id] === row);
  const rows = ROWS.map((row) => {
    const rs = readersOf(row);
    const vis = rs.map((id) => {
      const vs = S.shown?.[id];
      return `<figure class="sbv ${S.frosted.includes(id) ? 'frost' : ''}" data-key="sbv-${id}">${vs ? vs.map((x) => vcard(x, { cls: 'thumb', frost: S.frosted.includes(id) })).join('') : vcard(null, { cls: 'thumb' })}<figcaption>${disc(v, id, 'xs')}${pname(v, id)}</figcaption></figure>`;
    }).join('');
    return `<section class="sb-row ${S.solved[row] != null ? 'is-solved' : ''}" data-key="sbr-${row}"><header><span class="kicker">${esc(t(ROW_LABEL[row]))}</span><b>${esc(t(ROW_Q[row]))}</b></header>
      ${rowCards(v, row, { truth: ended ? S.truth?.[row] : null })}<div class="sb-vis">${vis}</div></section>`;
  }).join('');
  const side = `<div class="sb-ghost fr" data-key="sbghost"><span class="kicker">${t('The Ghost')}</span>${disc(v, S.ghost, 'lg')}<b>${pname(v, S.ghost)}</b><small>${t('cannot speak')}</small>
      <div class="sb-stats"><span>${glyph('v_snow')} ${th(S.cold === 1 ? '{n} cold spot' : '{n} cold spots', { n: S.cold })}</span>${S.round ? `<span>${th('Round {n}', { n: S.round })}</span>` : ''}</div></div>
    <div class="sb-clock" data-key="sbclock"><span class="kicker">${t('The séance clock')}</span>${candles(S)}<small>${th('{n} of {m} candles left', { n: S.candles - S.burnt, m: S.candles })}</small></div>`;
  return `<main class="board2 sboard ${ended ? 'is-ended' : ''}" data-key="board-s">${header}
    <div class="k-cols"><section class="k-main">${ended ? seanceEndHtml(v) : `<div class="sb-rows">${rows}</div><p class="b-now">${now}</p>`}</section><aside class="k-side">${side}${scoreboard(v)}</aside></div></main>`;
}
