// Dead Set: Séance — the client (phones, TV, scenes, lobby, end). See SEANCE.md.
//
// Visions are vellum cards with two or three pencil motifs on the paper.
// Story cards (WHO / WHERE / WHY) are vellum too: WHO and WHY carry a pencil
// icon, WHERE its backdrop etching. The Ghost's phone is its own (it holds the truth and the
// hand); every reader's phone, Deceiver included, runs the same screens: the
// Deceiver's false visions live in the same drawer every reader has.

import { glyph } from './icons.js';
import { waitText, waxSeal } from './kit.js';
import { emblem } from './emblems.js';
import { cardArt } from './cards.js';
import { t, th, tmh, roleF, scenAt, setNamer } from './i18n.js';
import { avatarSvg } from './avatar.js';
import { backdropSvg } from './backdrops.js';
import { VISIONS, STORY_ICONS } from './visions.js';

export const isSeancePhase = (ph) => typeof ph === 'string' && ph.startsWith('S_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ROWS = ['WHO', 'WHERE', 'WHY'];
const ROW_LABEL = { WHO: 'Who', WHERE: 'Where', WHY: 'Why' };
const ROW_Q = { WHO: 'Who killed me?', WHERE: 'Where did it happen?', WHY: 'Why did it happen?' };
const ROW_NAME = { WHO: 'who killed me', WHERE: 'where it happened', WHY: 'why it happened' };
const ROW_EMB = { WHO: 's_crowd', WHY: 'key' };
setNamer('row', (r) => (ROW_NAME[r] ? t(ROW_NAME[r]) : String(r))); // a raw row id, or text already translated
const pname = (v, id) => esc(v.players.find((p) => p.id === id)?.name ?? t('Someone'));
const rawName = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
const cardName = (row, idx) => scenAt(row, idx);
const ROLE_EMB = { S_GHOST: 'shade', S_MEDIUM: 'medium', S_DECEIVER: 'charlatan' };

// ── Cards ──────────────────────────────────────────────────────────────────
// No arch "window" on Séance cards: the art sits on the vellum, uncropped.
/** A vision: two or three motifs collide on the card. Language-free. */
export function vcard(id, { cls = '', frost = false, act = '', sel = false, key = '', label = '', mark = '' } = {}) {
  const vi = VISIONS[id];
  const tag = act ? 'button' : 'span';
  cls = cls.replace(/\bthumb\b/, 'tarot--thumb').replace(/\bbig\b/, 'tarot--hand');
  const attrs = `${act ? `data-act="${act}" data-id="${esc(label || id)}" aria-pressed="${sel}"` : ''} ${key ? `data-key="${key}"` : ''}`;
  if (!vi) return `<${tag} class="tarot back vcard ${cls}" ${attrs} aria-label="${esc(t('A vision, face down'))}"><span class="sig">DS</span></${tag}>`;
  const motifs = vi.motifs.map((m, i) => `<span class="vm vm${i + 1}">${emblem(m)}</span>`).join('');
  return `<${tag} class="tarot vcard vl${vi.layout} ${frost ? 'frost' : ''} ${sel ? 'is-chosen' : ''} ${cls}" ${attrs} aria-label="${esc(t('A vision'))}">
    <span class="v-art" aria-hidden="true">${motifs}</span>
    ${frost ? `<span class="v-frost">${emblem('v_snow')}<b>${esc(t('Cold spot'))}</b></span>` : ''}${mark ? `<span class="v-mark">${mark}</span>` : ''}</${tag}>`;
}

const STATE_CLS = { struck: 'is-struck', dim: 'is-dim' };
/** A story card: WHO / WHY carry their pencil icon, WHERE its backdrop etching. */
export function scard(row, idx, { cls = '', act = '', sel = false, key = '', state = '' } = {}) {
  const tag = act ? 'button' : 'span';
  const attrs = `${act ? `data-act="${act}" data-id="${idx}" aria-pressed="${sel}"` : ''} ${key ? `data-key="${key}"` : ''}`;
  const art = row === 'WHERE' ? `<span class="s-bd" aria-hidden="true">${backdropSvg(idx, 'card')}</span>`
    : `<span class="s-ic" aria-hidden="true">${emblem(STORY_ICONS[row]?.[idx] ?? ROW_EMB[row])}</span>`;
  // DS-009: the card's name stays readable for assistive technology even when it is too small to print.
  const label = `${t(ROW_LABEL[row])}: ${cardName(row, idx)}${state === 'struck' ? ` (${t('struck out')})` : ''}`;
  return `<${tag} class="tarot scard row-${row} ${STATE_CLS[state] ?? state} ${sel ? 'is-chosen' : ''} ${cls}" ${attrs} aria-label="${esc(label)}">
    <span class="arc-num">${esc(t(ROW_LABEL[row]))}</span>${art}<span class="nm" style="--nl:${[...cardName(row, idx)].length}">${esc(cardName(row, idx))}</span>${state === 'struck' ? '<i class="s-x" aria-hidden="true"></i>' : ''}${state === 'solved' ? `<i class="s-ok" aria-hidden="true">${glyph('check')}</i>` : ''}</${tag}>`;
}

/** A role card for the reveal. */
function rcard(id, cls = '') {
  const size = cls.includes('big') ? 'tarot--hand' : 'tarot--small';
  return `<span class="tarot ${size} srole ${id === 'S_DECEIVER' ? 'rubric' : ''} ${cls.replace(/\b(big|thumb)\b/g, '')}"><span class="arc-num">${esc(t('Séance'))}</span>${cardArt(ROLE_EMB[id] ?? 'medium')}<span class="nm">${esc(roleF(id, 'name'))}</span></span>`;
}

/** The séance clock: candles, burnt ones gone out. */
export function candles(S, cls = '') {
  const n = S.candles;
  return `<div class="scandles ${cls}" data-key="scandles" role="img" aria-label="${esc(th('{n} of {m} candles left', { n: n - S.burnt, m: n }))}">${Array.from({ length: n }, (_, i) => `<i class="scdl ${i < S.burnt ? 'out' : ''}">${emblem('innocent')}</i>`).join('')}</div>`;
}

const stateOf = (S, row, idx, truth) => (S.solved[row] === idx ? 'solved' : S.struck[row].includes(idx) ? 'struck' : truth != null && truth === idx ? 'truth' : S.solved[row] != null ? 'dim' : '');
/** One row of candidates; struck cards sink to the end so the live ones stay together. */
function rowCards(v, row, { act = '', sel = null, truth = null, size = '', zoom = true } = {}) {
  const S = v.seance;
  const order = [...S.board[row]].sort((a, b) => (S.struck[row].includes(a) ? 1 : 0) - (S.struck[row].includes(b) ? 1 : 0));
  return `<div class="srow-cards ${size}" data-key="src-${row}-${size}">${order.map((idx) => {
    const st = stateOf(S, row, idx, truth);
    const live = act && st !== 'struck' && st !== 'solved' && st !== 'dim';
    return scard(row, idx, { act: live ? act : zoom ? 'sZoomS' : '', sel: sel === idx, state: st, key: `sc-${row}-${idx}`, cls: zoom && !live ? 'zoomable' : '' });
  }).join('')}</div>`;
}

function disc(v, id, cls = '') {
  const p = v.players.find((x) => x.id === id);
  return `<span class="s-disc ${cls}">${p?.avatar ? avatarSvg(p.avatar, 's-av') : `<b>${esc((p?.name ?? '?').slice(0, 1))}</b>`}</span>`;
}

/** The three questions in order: answered (with the answer), asked now, still to come. */
function questions(S, cls = '') {
  return `<ol class="s-qs ${cls}" data-key="sqs">${ROWS.map((r) => {
    const st = S.solved[r] != null ? 'done' : S.at === r ? 'on' : '';
    return `<li class="${st}"><span>${esc(t(ROW_LABEL[r]))}</span>${st === 'done' ? `<small>${esc(cardName(r, S.solved[r]))}</small>` : ''}</li>`;
  }).join('')}</ol>`;
}

/** The visions on a question so far: this round's first (bright), earlier rounds after (faded). */
function seenList(v, row, { round = null, act = 'sZoomV', mark = null, sel = null, skip = null } = {}) {
  const S = v.seance;
  const list = [...(S.seen?.[row] ?? [])].filter((x) => !(skip && x.to === skip && x.round === (round ?? S.round))).sort((a, b) => b.round - a.round);
  return list.map((x) => {
    const now = x.round === (round ?? S.round);
    const bad = mark && now && mark[x.to] != null && mark[x.to] !== x.v;
    return `<figure class="sv ${now ? 'now' : 'old'} ${x.frost ? 'frost' : ''} ${sel === x.to && now ? 'sel' : ''}" data-key="sv-${x.round}-${x.to}">${vcard(x.v, { cls: 'thumb', frost: x.frost, act: bad && act === 'sPickCold' ? act : 'sZoomV', label: bad && act === 'sPickCold' ? x.to : x.v, sel: sel === x.to && now, mark: bad ? glyph('close') : '' })}<figcaption>${pname(v, x.to)}${now ? '' : `<small>${th('round {n}', { n: x.round })}</small>`}</figcaption></figure>`;
  }).join('');
}

/** The status bar: the three questions (answered ones with their answer) and the clock. The round and the step are in the move strip above. */
function statusBar(v, me) {
  const S = v.seance;
  const s = me?.s ?? {};
  const special = { S_INTRO: 'The séance begins', S_NAMING: 'The naming' }[v.phase];
  return `<div class="s-bar" data-key="sbar">
    <div class="sb-top">${special ? `<p class="sb-special">${esc(t(special))}</p>` : questions(S, 'sm')}${candles(S, 'sm')}</div>
    ${s.role === 'GHOST' && !special ? `<p class="sb-you ghost">${esc(t('You are the Ghost'))}</p>` : ''}
  </div>`;
}

/** What to do now: one line of title, one of help. */
const doNow = (title, hint = '', cls = '') => `<div class="s-do ${cls}" data-key="sdo-${esc(String(title)).slice(0, 24)}"><h2>${title}</h2>${hint ? `<p>${hint}</p>` : ''}</div>`;

function truthStrip(S, truth, { label = true } = {}) {
  return `<div class="s-truth" data-key="struth">${label ? `<span class="kicker">${t('The truth · only you know')}</span>` : ''}<div class="st-cards">${ROWS.map((r) => scard(r, truth[r], { cls: `mini ${S.at === r ? 'is-now' : ''}`, state: S.solved[r] != null ? 'solved' : 'truth', act: 'sZoomS', key: `tr-${r}` }).replace('data-id=', `data-row="${r}" data-id=`)).join('')}</div></div>`;
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
      const sel = UI.sel.sfake ?? sw?.vision ?? null;
      const targets = (v.seance.readers ?? []).filter((id) => id !== v.me.id);
      body = s.swapsLeft > 0 ? `<p class="small">${th(s.swapsLeft === 1 ? 'Swap one reader\'s vision for one of yours. {n} swap left.' : 'Swap one reader\'s vision for one of yours. {n} swaps left.', { n: s.swapsLeft })}</p>
        <div class="sd-hand">${(s.dhand ?? []).map((x) => vcard(x, { cls: 'thumb', act: 'sFake', sel: sel === x, key: `sf-${x}` })).join('')}</div>
        <div class="sd-targets" data-key="sdpick">${targets.map((id) => `<button class="sd-t ${sw?.target === id ? 'sel' : ''}" data-act="sFakeTo" data-id="${id}" aria-pressed="${sw?.target === id}">${disc(v, id, 'xs')}<span>${pname(v, id)}</span></button>`).join('')}</div>
        ${sw ? `<p class="small">${th('{name}\'s vision will be swapped.', { name: rawName(v, sw.target) })} <button class="btn btn-ghost btn-sm" data-act="sFakeOff">${t('Cancel')}</button></p>` : `<p class="small muted">${t('Tap one of your visions, then a reader.')}</p>`}`
        : `<p class="small muted">${t('No swaps left.')}</p>`;
    } else body = `<p class="small muted">${t('You hold no visions. The Ghost will send you one.')}</p>`;
  }
  return `<div class="s-drawer ${open ? 'open' : ''}" data-key="sdrawer"><button class="btn btn-sm s-drawer-btn" data-act="sDrawer" aria-expanded="${open}">${glyph('p_cards')}<span>${t('Your hand')}</span>${glyph(open ? 'up' : 'down')}</button>${open ? `<div class="sd-body" data-key="sdbody">${body}</div>` : ''}</div>`;
}

/** A card shown large over everything; tap anywhere to close. */
function zoomLayer(UI) {
  const z = UI.ui.szoom;
  if (!z) return '';
  const card = z.k === 'v' ? vcard(Number(z.id), { cls: 'huge' }) : scard(z.row, Number(z.id), { cls: 'huge' });
  return `<div class="s-zoom" data-act="sZoomOff" data-key="szoom">${card}<p>${t('Tap to close')}</p></div>`;
}

/** Hands on wrong cards per player, from the rounds the table saw (the Naming's evidence). */
function wrongHands(S) {
  const out = {};
  for (const r of S.past ?? []) for (const [id, c] of Object.entries(r.hands ?? {})) {
    const answer = S.solved[r.row];
    if (answer == null) continue;
    out[id] = out[id] ?? { wrong: 0, laid: 0 };
    out[id].laid++;
    if (c !== answer) out[id].wrong++;
  }
  return out;
}

/** Who the reader picks among: avatars with names (the hunch, the naming). */
function pickList(v, ids, sel, act) {
  return `<div class="s-picks" data-key="spicks">${ids.map((id) => `<button class="sd-t ${sel.includes(id) ? 'sel' : ''}" data-act="${act}" data-id="${id}" aria-pressed="${sel.includes(id)}">${disc(v, id, 'xs')}<span>${pname(v, id)}</span></button>`).join('')}</div>`;
}

// ── Phone ──────────────────────────────────────────────────────────────────
export function seanceMain(v, me, h) {
  const { S: UI, head } = h;
  const S = v.seance;
  if (!S) return head(v);
  if (UI.sel.sphase !== v.phaseId) { UI.sel.sphase = v.phaseId; UI.sel.scard = null; UI.sel.sv = null; UI.sel.spick = null; UI.sel.sfake = null; UI.sel.scold = null; UI.sel.shunch = null; }
  const a = v.action || {};
  const s = me?.s ?? {};
  const ghost = s.role === 'GHOST';
  const row = S.at;
  let stage = '';
  switch (v.phase) {
    case 'S_INTRO': {
      const open = !!UI.ui.sflip;
      const id = { GHOST: 'S_GHOST', DECEIVER: 'S_DECEIVER' }[s.role] ?? 'S_MEDIUM';
      const how = {
        GHOST: ['You were murdered. You know who, where and why.', 'The séance asks one question at a time. Each round, send every reader one vision for it.', 'You cannot speak. Frost a vision that is not yours with a cold spot.'],
        DECEIVER: ['You know the truth too, and you lie.', 'A few times a game, swap another reader\'s vision for one of yours (in “Your hand”).', 'Lay your hand like a reader, and do not get named.'],
        MEDIUM: ['The séance asks who, then where, then why.', 'The Ghost sends you a vision. Talk it over, then lay your hand on the card it points to.', 'Answer all three before the candles burn out, then name the Deceiver.'],
      }[s.role] ?? [];
      stage = `${doNow(open ? esc(roleF(id, 'name')) : th('{a} is the Ghost', { a: rawName(v, S.ghost) }), open ? '' : t('Shield your screen. Tap the card to turn it over.'))}
        <div class="s-intro ${open ? 'open' : ''}" data-key="sintro"><button class="nflip ${open ? 'open' : ''}" aria-label="${esc(t(open ? 'Hide your card' : 'Reveal your role'))}" data-act="sFlip" data-key="sflip-${open ? 'o' : 'c'}">${open ? rcard(id, 'big') : '<span class="tarot back srole big"><span class="sig">DS</span></span>'}</button>
        ${open ? `<ol class="s-how">${how.map((x) => `<li>${esc(t(x))}</li>`).join('')}</ol>` : ''}</div>
        ${open && s.truth ? truthStrip(S, s.truth) : ''}${open && s.fellows?.length ? `<p class="npow">${th('The other Deceiver: {names}.', { names: s.fellows.map((x) => rawName(v, x)) })}</p>` : ''}
        ${a.done ? `<p class="small muted center-text">${waitText(v)}</p>` : ''}`;
      break;
    }
    case 'S_VISION': {
      if (ghost) {
        const readers = S.readers ?? [];
        const full = (id) => s.sent?.[id] != null;
        const target = UI.sel.starget && readers.includes(UI.sel.starget) ? UI.sel.starget : readers.find((id) => !full(id)) ?? readers[0];
        UI.sel.starget = target;
        const done = readers.filter(full).length;
        stage = `${doNow(full(target) ? th('Sent to {name}', { name: pname(v, target) }) : th('Send {name} a vision', { name: pname(v, target) }),
          t('The answer is marked in red. Send a vision that points to it, not to the other cards.'))}
          <div class="sg-readers" data-key="sgr">${readers.map((id) => `<button class="sg-chip ${id === target ? 'on' : ''} ${full(id) ? 'done' : ''}" data-act="sTarget" data-id="${id}">${disc(v, id, 'xs')}<span>${pname(v, id)}</span>${full(id) ? vcard(s.sent[id], { cls: 'chip' }) : ''}</button>`).join('')}</div>
          ${rowCards(v, row, { truth: s.truth[row], size: 'xs' })}
          ${full(target) ? `<div class="sg-sent" data-key="sgs"><span>${vcard(s.sent[target], { cls: 'thumb' })}</span><button class="btn btn-ghost btn-sm" data-act="sUnsend" data-id="${target}">${t('Take back')}</button></div>` : ''}
          <div class="sg-hand" data-key="sghand"><span class="kicker">${th('Your hand · sent {done} of {total}', { done, total: readers.length })}</span><div class="sgh-cards">${(s.cards ?? []).map((x) => vcard(x, { act: 'sPickV', sel: UI.sel.sv === x, key: `sh-${x}` })).join('')}</div></div>${MUTE()}`;
        break;
      }
      const earlier = seenList(v, row);
      const cards = rowCards(v, row, { size: earlier ? 'xs' : '' });
      if (a.type === 'shunch') {
        const sel = UI.sel.shunch ?? s.hunch ?? s.lastHunch;
        stage = `${doNow(esc(t(ROW_Q[row])), s.hunch ? th('Your hunch: {name}. The Ghost is choosing your vision…', { name: rawName(v, s.hunch) }) : t('The Ghost is choosing your vision. Meanwhile, who do you suspect? Only you see your hunch.'))}
          ${cards}${earlier ? `<div class="s-seen" data-key="sseen"><span class="kicker">${t('Visions so far')}</span><div class="sv-row">${earlier}</div></div>` : ''}
          <div class="s-hunch" data-key="shunch"><span class="kicker">${t('Your hunch')}</span>${pickList(v, a.targets ?? [], sel ? [sel] : [], 'sPickHunch')}</div>
          ${drawer(v, h)}`;
      } else {
        stage = `${doNow(esc(t(ROW_Q[row])), t('The Ghost is choosing your vision.'))}${cards}${earlier ? `<div class="s-seen" data-key="sseen"><span class="kicker">${t('Visions so far')}</span><div class="sv-row">${earlier}</div></div>` : ''}`;
      }
      break;
    }
    case 'S_HANDS': {
      if (ghost) {
        const can = S.cold > 0 && !a.done;
        stage = `${doNow(t('They argue. You cannot speak.'), a.done ? t('You have seen the visions. Wait for their hands.') : S.cold > 0 ? th(S.cold === 1 ? 'A red mark shows a vision you did not send: tap it to frost it with a cold spot. {n} left.' : 'A red mark shows a vision you did not send: tap it to frost it with a cold spot. {n} left.', { n: S.cold }) : t('No cold spots left.'))}
          ${truthStrip(S, s.truth, { label: false })}<div class="s-seen" data-key="sseen"><div class="sv-row">${seenList(v, row, { act: can ? 'sPickCold' : 'sZoomV', mark: s.sent, sel: UI.sel.scold })}</div></div>${MUTE()}`;
        break;
      }
      const pick = UI.sel.scard ?? s.hand;
      const title = s.hand != null ? th('Your hand rests on {card}.', { card: cardName(row, s.hand) }) : t('Lay your hand');
      // AT8: the seal beside your vision — the Ghost's seat in red, the candles left in the disc.
      const sSeal = h.seal(v, { marks: { [S.ghost]: 'r', ...Object.fromEntries((S.handsIn ?? []).map((id) => [id, 'k'])) }, center: `<span class="c-big">${Math.max(0, S.candles - S.burnt)}<small>/${S.candles}</small></span>`, key: 'sseal', size: 78 });
      const mine = s.vision != null ? `<div class="sm-yours">${vcard(s.vision, { cls: 'big', frost: S.frosted.includes(me?.id), act: 'sZoomV', label: s.vision })}<small>${t('Your vision')}</small></div>` : '';
      const others = seenList(v, row, { skip: me?.id });
      stage = `${doNow(title, t('Talk it over. The card under the most hands is put to the spirit; a tie, and the planchette chooses.'))}
        <div class="s-mine" data-key="smine">${h.sealRow(mine, sSeal)}${others ? `<div class="sv-row">${others}</div>` : ''}</div>
        ${rowCards(v, row, { act: 'sPickCard', sel: pick, zoom: false, size: 'sm' })}`;
      break;
    }
    case 'S_NAMING': {
      if (ghost) { stage = `${doNow(t('Who came through with you?'), t('You cannot speak.'))}${MUTE()}`; break; }
      const sel = UI.sel.spick ?? s.named ?? (s.lastHunch ? [s.lastHunch] : []);
      const ev = wrongHands(S);
      stage = `${doNow(t(a.count > 1 ? 'Name the two Deceivers' : 'Name the Deceiver'), s.named ? th('You named {names}.', { names: s.named.map((x) => rawName(v, x)) }) : t('Who laid hands on the wrong cards? Who argued for a lie? Your last hunch is marked.'))}
        ${h.ring(v, { pick: { ids: a.targets ?? [], selected: sel, act: 'sPickName' }, marks: Object.fromEntries((a.targets ?? []).filter((id) => ev[id]?.wrong).map((id) => [id, String(ev[id].wrong)])), center: `<span class="c-sub">${esc(t('wrong hands'))}</span>` })}
        <ul class="s-evidence" data-key="snev">${(a.targets ?? []).map((id) => { const e = ev[id]; return `<li class="${sel.includes(id) ? 'sel' : ''}"><b>${pname(v, id)}</b> ${e ? th(e.wrong === 1 ? '{n} wrong hand of {m}' : '{n} wrong hands of {m}', { n: e.wrong, m: e.laid }) : t('no hands')}</li>`; }).join('')}</ul>`;
      break;
    }
    default: break;
  }
  return `${head(v)}${statusBar(v, me)}${stage}${h.chips(v)}${zoomLayer(UI)}`;
}


export function seanceDock(v, h) {
  const { S: UI, btn, holdBtn, commitBtn } = h;
  const a = v.action || {};
  const S = v.seance;
  const s = v.me?.s ?? {};
  const parts = [];
  const note = (x) => `<span class="dock-note" data-key="sdn">${x}</span>`;
  const nameOf = (id) => v.players.find((p) => p.id === id)?.name ?? '';
  const stamped = (x, key) => `<span class="dock-note stamped" data-key="${key}">${waxSeal()} ${esc(x)}</span>`;
  switch (a.type) {
    case 'sintro': if (!a.done) parts.push(btn(t('I am ready'), 'sAck', 'btn-solid', !UI.ui.sflip)); break;
    case 'ssend': {
      const target = UI.sel.starget;
      if (UI.sel.sv != null && target) parts.push(btn(th('Send to {name}', { name: nameOf(target) }), 'sSend', 'btn-solid'));
      else parts.push(note(t('Tap a vision in your hand')));
      break;
    }
    case 'shunch': {
      const sel = UI.sel.shunch ?? s.hunch ?? s.lastHunch;
      if (sel && sel !== s.hunch) parts.push(commitBtn('secret', 'sHunch', s.hunch == null && sel === s.lastHunch ? th('Keep my hunch: {name}', { name: nameOf(sel) }) : th('My hunch: {name}', { name: nameOf(sel) })));
      else if (s.hunch) parts.push(stamped(th('Hunch: {name}', { name: nameOf(s.hunch) }), 'shunched'));
      else parts.push(note(t('Tap a player')));
      break;
    }
    case 'sghost': {
      if (a.done) { parts.push(stamped(t('Waiting for their hands'), 'sgdone')); break; }
      if (UI.sel.scold && S.cold > 0) parts.push(commitBtn('secret', 'sCold', th('Frost {name}\'s vision', { name: nameOf(UI.sel.scold) })));
      parts.push(holdBtn('sDone', t('Hold: I have seen them'), UI.sel.scold ? 'btn-ghost' : 'btn-solid'));
      break;
    }
    case 'shand': {
      const pick = UI.sel.scard;
      if (pick != null && pick !== s.hand) parts.push(commitBtn('secret', 'sHand', s.hand == null ? t('Lay my hand here') : t('Move my hand here')));
      else if (s.hand == null) parts.push(note(t('Tap a card')));
      else { parts.push(stamped(t('Your hand is down'), 'shanded')); parts.push(btn(t('Lift'), 'sLift', 'btn-ghost btn-sm')); }
      break;
    }
    case 'sname': {
      const sel = UI.sel.spick ?? s.named ?? (s.lastHunch ? [s.lastHunch] : []);
      if (sel.length === a.count && JSON.stringify(sel) !== JSON.stringify(s.named)) parts.push(holdBtn('sName', th('Hold to name {names}', { names: sel.map(nameOf) }), 'btn-blood'));
      else if (!s.named) parts.push(note(t(a.count > 1 ? 'Choose two players' : 'Choose one player')));
      break;
    }
    default: break;
  }
  return parts;
}

export function seanceActs(h) {
  const { S: UI, V, send, render, haptic, notify } = h;
  const nextTarget = () => {
    const v = V(); const S = v.seance; const s = v.me?.s ?? {};
    const readers = S.readers ?? [];
    const i = readers.indexOf(UI.sel.starget);
    return [...readers.slice(i + 1), ...readers.slice(0, i + 1)].find((id) => s.sent?.[id] == null) ?? UI.sel.starget;
  };
  return {
    sFlip() { UI.ui.sflip = !UI.ui.sflip; render(); },
    async sAck() { await send('s.ack', {}); },
    sDrawer() { UI.ui.sdrawer = !UI.ui.sdrawer; render(); },
    sTarget(el) { UI.sel.starget = el.dataset.id; UI.sel.sv = null; render(); },
    sPickV(el) { const x = Number(el.dataset.id); UI.sel.sv = UI.sel.sv === x ? null : x; haptic(6); render(); },
    async sSend() {
      if (UI.sel.sv == null || !UI.sel.starget) return;
      if (await send('s.send', { target: UI.sel.starget, vision: UI.sel.sv }, { quiet: true })) { UI.sel.sv = null; haptic(8); UI.sel.starget = nextTarget(); render(); }
    },
    async sUnsend(el) { await send('s.unsend', { target: el.dataset.id }, { quiet: true }); },
    sPickHunch(el) { UI.sel.shunch = el.dataset.id; haptic(6); render(); },
    async sHunch() { const s = V().me?.s ?? {}; const x = UI.sel.shunch ?? s.lastHunch; if (x && await send('s.hunch', { target: x }, { quiet: true })) UI.sel.shunch = null; },
    sFake(el) { UI.sel.sfake = Number(el.dataset.id); render(); },
    async sFakeTo(el) {
      const vision = UI.sel.sfake ?? V().me?.s?.swap?.vision;
      if (vision == null) { notify?.(t('Tap one of your visions first.')); return; }
      if (await send('s.swap', { target: el.dataset.id, vision }, { quiet: true })) UI.sel.sfake = null;
    },
    async sFakeOff() { await send('s.swap', { target: null }, { quiet: true }); },
    sPickCold(el) { UI.sel.scold = UI.sel.scold === el.dataset.id ? null : el.dataset.id; render(); },
    async sCold() { if (await send('s.cold', { target: UI.sel.scold })) UI.sel.scold = null; },
    async sDone() { await send('s.done', {}); },
    sPickCard(el) { UI.sel.scard = Number(el.dataset.id); haptic(6); render(); },
    async sHand() { if (await send('s.hand', { card: UI.sel.scard })) UI.sel.scard = null; },
    async sLift() { await send('s.hand', { card: null }); },
    sPickName(el) {
      const v = V(); const a = v.action || {}; const s = v.me?.s ?? {};
      const id = el.dataset.id;
      let sel = [...(UI.sel.spick ?? s.named ?? (s.lastHunch ? [s.lastHunch] : []))];
      sel = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id].slice(-(a.count ?? 1));
      UI.sel.spick = sel; haptic(6); render();
    },
    async sName() { const v = V(); const s = v.me?.s ?? {}; const sel = UI.sel.spick ?? (s.lastHunch ? [s.lastHunch] : []); if (await send('s.name', { targets: sel })) UI.sel.spick = null; },
    sZoomV(el) { UI.ui.szoom = { k: 'v', id: el.dataset.id }; render(); },
    sZoomS(el) {
      const row = el.dataset.row ?? el.closest('[class*="row-"]')?.className.match(/row-(WHO|WHERE|WHY)/)?.[1];
      UI.ui.szoom = { k: 's', id: el.dataset.id, row }; render();
    },
    sZoomOff() { UI.ui.szoom = null; render(); },
    sSet(el) {
      const key = el.dataset.id;
      const raw = el.type === 'checkbox' ? el.checked : el.value;
      const val = ['swaps', 'colds', 'games'].includes(key) ? Number(raw) : raw === '' ? null : raw;
      send('host.settings', { s: { [key]: val } }, { quiet: true });
    },
  };
}
export const SEANCE_QUIET = ['sPickV', 'sPickCold', 'sPickCard', 'sPickName', 'sPickHunch', 'sHunch', 'sFake', 'sFlip', 'sDrawer', 'sSend', 'sUnsend', 'sFakeTo', 'sFakeOff', 'sTarget', 'sZoomV', 'sZoomS', 'sZoomOff'];

/** The board sheet: every row, struck and solved, and the clock. */
export function boardSheet(v) {
  const S = v.seance;
  if (!S) return '';
  const truth = v.me?.s?.truth ?? null;
  return `<div class="s-sheet" data-key="ssheet">${candles(S)}${ROWS.map((r) => `<section class="${S.at === r ? 'is-now' : ''}"><span class="kicker">${esc(t(ROW_Q[r]))}</span>${rowCards(v, r, { truth: truth?.[r] ?? null, size: 'sm', zoom: false })}${(S.seen?.[r] ?? []).length ? `<div class="sv-row">${seenList(v, r)}</div>` : ''}</section>`).join('')}</div>`;
}

// ── Scenes ─────────────────────────────────────────────────────────────────
export function seanceMoment(l, v, fresh, { notify, name: nm }) {
  switch (l.ev) {
    case 's-lottery': {
      const order = l.order.map((id) => ({ id, name: nm(id), av: v.players.find((p) => p.id === id)?.avatar ?? null }));
      return { type: 'mlottery', order, leader: l.leader, leaderName: nm(l.leader), idx: l.order.indexOf(l.leader), spins: l.spins ?? 2, sound: null,
        kickerText: t('Before the first round'), titleText: t('Who was murdered?'), resultText: '{name} is the Ghost' };
    }
    case 's-round': notify(th('Round {n}. The Ghost reaches out.', { n: l.round })); return null;
    case 's-visions': return { type: 'svisions', count: l.count, shown: l.shown, row: l.row, mine: v.me?.id != null ? l.shown?.[v.me.id] ?? null : null, sound: 'unfold' };
    case 's-cold': return { type: 'scold', name: nm(l.target), sound: null };
    case 's-verdict': return { type: 'sverdict', row: l.row, pick: l.pick, right: l.right, tie: l.tie, drift: l.drift, burnt: l.burnt, candles: l.candles, sound: l.right ? 'approve' : 'heart' };
    case 's-naming': return { type: 'sname', count: l.count, sound: 'bell' };
    case 's-named': return { type: 'snamed', named: (l.named ?? []).map(nm), right: !!l.right, sound: l.right ? 'approve' : 'death' };
    default: return null;
  }
}
export const S_MOMENT_TIME = { svisions: 5200, scold: 2600, sverdict: 5200, sname: 3000, snamed: 5600 };

export function seanceMomentHtml(m, h) {
  const { letters, onBoard } = h;
  switch (m.type) {
    case 'svisions': {
      if (!onBoard() && m.mine != null) return `<span class="kicker">${esc(t('Your vision'))}</span><h1 class="m-title">${letters(t(ROW_Q[m.row] ?? 'Your vision'))}</h1><div class="sm-vis">${vcard(m.mine, { cls: 'big rise-in' })}</div>`;
      const all = Object.values(m.shown ?? {});
      return `<span class="kicker">${esc(t(ROW_Q[m.row] ?? 'The séance'))}</span><h1 class="m-title">${letters(t('The visions arrive'))}</h1><div class="sm-all">${all.map((x, i) => `<span style="--i:${i}">${vcard(x, { cls: 'thumb' })}</span>`).join('')}</div>`;
    }
    case 'scold': return `<div class="m-art sm-cold">${emblem('v_snow')}</div><span class="kicker">${esc(t('A cold spot'))}</span><h1 class="m-title">${letters(t('This one is not mine'))}</h1><p class="m-sub">${esc(th('{name}\'s vision is frosted.', { name: m.name }))}</p>`;
    case 'sverdict': {
      const why = m.drift ? t('No hand was laid; the planchette drifted.') : m.tie ? t('The hands were tied; the planchette chose.') : '';
      return `<span class="kicker">${esc(t(ROW_Q[m.row] ?? 'The spirit answers'))}</span><div class="sm-answer ${m.right ? 'right' : 'wrong'}">${scard(m.row, m.pick, { cls: 'big', state: m.right ? 'solved' : '' })}<b class="sm-stamp">${esc(t(m.right ? 'Yes.' : 'No.'))}</b></div>
        ${why ? `<p class="m-sub">${esc(why)}</p>` : ''}<p class="m-sub">${esc(th('{n} of {m} candles left', { n: m.candles - m.burnt, m: m.candles }))}</p>`;
    }
    case 'sname': return `<div class="m-art">${emblem('charlatan')}</div><span class="kicker">${esc(t('The murder is solved'))}</span><h1 class="m-title">${letters(t(m.count > 1 ? 'Name the two Deceivers' : 'Name the Deceiver'))}</h1>`;
    case 'snamed': return `<div class="m-art">${emblem(m.right ? 'shade' : 'charlatan')}</div><span class="kicker">${esc(t('The naming'))}</span><h1 class="m-title">${letters(t(m.right ? 'The spirit rests' : 'Something else came through'))}</h1><p class="m-sub">${esc(m.named.length ? th('Named: {names}.', { names: m.named }) : t('The table could not agree.'))}</p>`;
    default: return '';
  }
}

// ── Lobby ──────────────────────────────────────────────────────────────────
/** The same count engine/seance.js deals: one Deceiver from five players, none at four (or as the host set it). */
const deceiverCount = (n, k = 'auto') => (k === 'none' ? 0 : k === 'two' ? (n >= 9 ? 2 : n >= 5 ? 1 : 0) : k === 'one' ? 1 : n >= 5 ? 1 : 0);
export function explainerHtml(v = null) {
  // DS-002: a four-seat table (or one set to none) has no Deceiver; the steps say so.
  const dec = v ? deceiverCount(v.players.length, v.settings?.s?.deceivers) : null;
  const steps = [
    ['shade', 'The Ghost', 'Someone was murdered. Their Ghost knows who, where and why, and cannot speak.'],
    ['p_cards', 'Visions', 'The séance asks who, then where, then why. Each round the Ghost sends every reader a wordless vision for the question.'],
    ...(dec === 0 ? [] : [['charlatan', dec === null ? 'The Deceiver (from five players)' : 'The Deceiver', 'One reader is a second spirit. It knows the truth too, and swaps visions for lies.']]),
    ['v_hand', 'Hands', 'Talk it over, then lay your hands. The card under the most hands is put to the spirit.'],
    ['p_candle', 'Candles', dec === 0 ? 'Every round burns a candle. Answer all three before the last one goes out.' : 'Every round burns a candle. Answer all three before the last one goes out, then name the Deceiver.'],
  ];
  return `<section class="x-explain" data-key="sexplain"><div class="rule lstep">${t('How the Séance works')}</div>
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
  const DIFF_SUB = { gentle: 'Five cards a row; most of the Ghost\'s visions fit. Seven candles.', standard: 'Six cards a row; about half the Ghost\'s visions fit. Seven candles.', grim: 'Seven cards a row; few of the Ghost\'s visions fit. Eight candles.' };
  const DEC = [['auto', t('One (none at four)')], ['none', t('None')], ['one', t('One')], ['two', t('Two (from nine)')]];
  const decN = s.deceivers === 'none' ? 0 : s.deceivers === 'two' ? (n >= 9 ? 2 : n >= 5 ? 1 : 0) : s.deceivers === 'one' ? 1 : n >= 5 ? 1 : 0;
  return `${explainerHtml(v)}
    <section class="lobby-deck" data-key="sdeck">
    <div class="rule lstep">${t(n === 1 ? 'The deck · {n} player' : 'The deck · {n} players', { n })}</div>
    <p class="small muted">${n >= 4 ? th(decN === 1 ? 'One Ghost, {m} readers, {d} Deceiver among them.' : decN ? 'One Ghost, {m} readers, {d} Deceivers among them.' : 'One Ghost and {m} readers, all honest.', { m: Math.max(0, n - 1), d: decN }) : t('Seat 4 to 10 players.')}</p>
    <div class="s-lobbycards" data-key="slc">${['S_GHOST', 'S_MEDIUM', 'S_DECEIVER'].map((id) => rcard(id, 'thumb')).join('')}</div>
    <div class="rule lstep">${t('Rules')}</div>
    ${row(t('Difficulty'), t(DIFF_SUB[s.difficulty ?? 'standard']), sel('difficulty', s.difficulty ?? 'standard', DIFF), t(DIFF.find((x) => x[0] === (s.difficulty ?? 'standard'))[1]))}
    ${row(t('Deceivers'), t('A second spirit among the readers.'), sel('deceivers', s.deceivers ?? 'auto', DEC), DEC.find((x) => x[0] === (s.deceivers ?? 'auto'))[1])}
    ${s.deceivers === 'two' ? row(t('Deceivers know each other'), '', sw('know', s.know !== false), t(s.know !== false ? 'On' : 'Off')) : ''}
    ${row(t('The Deceiver\'s swaps'), t('How many visions it may swap in a game.'), sel('swaps', s.swaps ?? 3, [[2, '2'], [3, '3'], [4, '4']]), String(s.swaps ?? 3))}
    ${row(t('The Ghost\'s cold spots'), t('How many visions the Ghost may frost: "this one is not mine".'), sel('colds', s.colds ?? 2, [[1, '1'], [2, '2'], [3, '3']]), String(s.colds ?? 2))}
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
  const decs = dec.length ? `<section data-key="sedec"><div class="rule">${t(dec.length > 1 ? 'The Deceivers' : 'The Deceiver')}</div><ul class="se-dec">${dec.map((id) => `<li>${disc(v, id)}<b>${pname(v, id)}</b>${S.nameTally ? `<small>${th('named by {n}', { n: S.nameTally[id] ?? 0 })}</small>` : ''}</li>`).join('')}</ul></section>` : '';
  const rounds = (S.history ?? []).map((h, k) => {
    const lines = Object.keys(h.shown ?? {}).map((id) => {
      const sw = (h.swaps ?? []).find((x) => x.target === id);
      const hand = h.hands?.[id];
      const hunch = h.hunch?.[id];
      return `<li class="${dec.includes(id) ? 'dec' : ''}"><span class="se-who">${disc(v, id, 'xs')}<b>${pname(v, id)}</b></span>
        <span class="se-vis">${vcard(h.shown[id], { cls: 'thumb', frost: h.frosted?.includes(id) })}${sw ? `<span class="se-swap">${glyph('close')}<small>${th('swapped by {name}; the Ghost sent', { name: rawName(v, sw.by) })}</small>${vcard(sw.from, { cls: 'thumb' })}</span>` : ''}</span>
        <span class="se-lit">${hand == null ? `<small>${t('no hand')}</small>` : `${glyph('v_hand')}<small>${esc(cardName(h.row, hand))}</small>`}${hunch ? `<small class="muted">${th('hunch: {name}', { name: rawName(v, hunch) })}</small>` : ''}</span></li>`;
    }).join('');
    const x = h.verdict;
    const verdict = `<span class="tag ${x.right ? 'solid' : 'blood'}">${esc(t(ROW_LABEL[h.row]))}: ${esc(cardName(h.row, x.pick))}</span>`;
    const open = k === (S.history.length - 1);
    return `<li class="se-round"><details class="more" ${open ? 'open' : ''} data-key="ser-${k}"><summary>${th('Round {n}', { n: h.round })}<span class="se-sum">${verdict}</span></summary><ul class="se-lines">${lines}</ul></details></li>`;
  }).join('');
  return `${back}${truth}${decs}${rounds ? `<section data-key="serounds"><div class="rule">${t('The whole séance')}</div><ol class="se-rounds">${rounds}</ol></section>` : ''}${scoreboard(v)}`;
}

// ── TV ─────────────────────────────────────────────────────────────────────
/** The TV's line for each step: a title and what the table is doing. */
function tvNow(v) {
  const S = v.seance;
  const prog = v.progress ?? { done: 0, total: 0 };
  const q = S.at ? t(ROW_Q[S.at]) : '';
  return {
    S_INTRO: [th('{a} is the Ghost', { a: rawName(v, S.ghost) }), th('Everyone looks at their role · {done}/{total}', prog)],
    S_VISION: [q, S.deceivers ? th('The Ghost sends every reader a vision; readers mark a hunch · {done}/{total} sent', prog) : th('The Ghost sends every reader a vision · {done}/{total}', prog)],
    S_HANDS: [q, th('Talk it over, then lay your hands. The most hands are put to the spirit · {done}/{total}', prog)],
    S_NAMING: [t(S.deceivers > 1 ? 'Name the two Deceivers' : 'Name the Deceiver'), th('Votes in · {done}/{total}', prog)],
  }[v.phase] ?? ['', ''];
}

export function seanceBoard(v, h) {
  const { header } = h;
  const S = v.seance;
  if (!S) return '';
  const ended = v.phase === 'ENDED';
  const [title, sub] = tvNow(v);
  // TV-A8: the candle board owns the stage; the visions for the question sit in one strip above it.
  const rows = ROWS.map((row) => {
    const state = S.solved[row] != null ? 'is-solved' : S.at === row ? 'is-now' : 'is-later';
    return `<section class="s2-row ${state}" data-key="s2r-${row}"><header><b>${esc(t(ROW_LABEL[row]))}</b><small>${esc(t(ROW_Q[row]))}</small></header>
      ${rowCards(v, row, { truth: ended ? S.truth?.[row] : null, zoom: false })}</section>`;
  }).join('');
  const waiting = v.phase === 'S_VISION' ? (S.readers ?? []).map((id) => `<figure class="sv now wait" data-key="svw-${id}">${vcard(null, { cls: 'thumb' })}<figcaption>${pname(v, id)}</figcaption></figure>`).join('') : '';
  const seen = S.at ? seenList(v, S.at) : '';
  const strip = `<div class="s2-vis" data-key="s2vis"><span class="kicker">${esc(S.at ? t('Visions for this question') : t('The séance'))}</span><div class="sv-row">${waiting}${seen}</div></div>`;
  // TV-G4: a tick for every reader who has acted in this step, a dashed ring for the rest.
  const acting = { S_INTRO: S.acked, S_HANDS: S.handsIn, S_NAMING: S.named }[v.phase] ?? null;
  const mark = (id) => (acting ? `<i class="mk ${acting.includes(id) ? 'ok' : 'wait'}">${acting.includes(id) ? glyph('check') : ''}</i>` : '');
  const table = `<section class="s2-table" data-key="s2table"><span class="kicker">${t('At the table')}</span><ul>
    <li class="ghost">${disc(v, S.ghost)}<b>${pname(v, S.ghost)}</b><small>${t('The Ghost · cannot speak')}</small></li>
    ${(S.readers ?? []).map((id) => `<li>${disc(v, id)}<b>${pname(v, id)}</b>${mark(id)}</li>`).join('')}</ul></section>`;
  const ledger = `<div class="tv-now" data-key="s2now"><span class="kicker">${S.round ? th('Round {n}', { n: S.round }) : t('The séance')}</span><b>${esc(title)}</b><span>${esc(sub)}</span></div>
    <section class="s2-clock" data-key="s2clock"><span class="kicker">${th('The séance clock · {n} of {m} left', { n: S.candles - S.burnt, m: S.candles })}</span>${candles(S)}<small>${glyph('v_snow')} ${th(S.cold === 1 ? '{n} cold spot' : '{n} cold spots', { n: S.cold })}</small></section>
    ${table}${scoreboard(v)}`;
  return `<main class="board2 sboard2 tv-grid ${ended ? 'is-ended' : ''}" data-key="board-s">${header}
    <div class="tv-body tv-ledgered">
      <section class="tv-stage s2-stage" data-key="s2stage">${ended ? `<div class="sb-end" data-autoscroll>${seanceEndHtml(v)}</div>` : `<div class="s2-board">${strip}<div class="s2-rows">${rows}</div></div>`}</section>
      <aside class="tv-ledger" data-key="s2ledger" data-autoscroll>${ledger}</aside>
    </div></main>`;
}
