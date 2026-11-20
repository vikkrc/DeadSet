// Dead Set: The Omen — the client (phones, TV, scenes, lobby, end). See OMEN.md.
//
// An astrolabe wheel of three faces, Life, Death and Rebirth, read clockwise. Each round shows where
// it starts; every seer secretly predicts the finish and may turn it one step (one Influence). The
// reveal turns the needle once, by the net total, and the ledger shows who pushed which way.

import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { cardArt } from './cards.js';
import { t, th, tp, roleF, setNamer } from './i18n.js';
import { esc, rawName, disc, doNow, scoreLedger, explainer, waiting } from './kit.js';

export const isOmenPhase = (ph) => typeof ph === 'string' && ph.startsWith('O_');
/** The faces' names, in the reader's language. */
const faceName = (i) => [t('Life'), t('Death'), t('Rebirth')][i] ?? '';
const FACE_EMB = ['innocent', t('death'), t('necro')];
const KEYS = ['LIFE', t('DEATH'), t('REBIRTH')];
setNamer('face', (x) => { const i = KEYS.indexOf(String(x)); return i >= 0 ? faceName(i) : String(x); });

/** The wheel: three faces; the needle points at `at` (or turns from `from` by `turn` steps when animating). */
const P = (deg, r) => { const a = (deg * Math.PI) / 180; return `${(100 + r * Math.sin(a)).toFixed(1)} ${(100 - r * Math.cos(a)).toFixed(1)}`; };
/** AT10: each face owns a sector of the dial, washed in its colour (Life gilt, Death oxblood, Rebirth blue-grey). */
const sectors = () => [0, 1, 2].map((i) => `<path class="o-sec f-${i}" d="M100 100 L${P(i * 120 - 60, 90)} A90 90 0 0 1 ${P(i * 120 + 60, 90)} Z"/>`).join('');
/** AT10: the seers ride the outer rim, one lozenge each; gilt once their omen is sealed. */
const seerDots = (seers) => (seers ? Array.from({ length: seers.n }, (_, i) => `<i class="o-seer ${i < seers.done ? 'on' : ''}" style="--d:${((i + 0.5) * 360) / seers.n}deg"></i>`).join('') : '');
export function wheel({ at = 0, from = null, turn = 0, size = '', mark = null, key = 'owheel', seers = null } = {}) {
  const spin = from != null;
  const a0 = (spin ? from : at) * 120;
  const a1 = a0 + turn * 120;
  return `<div class="o-wheel ${size} ${spin ? 'spin' : ''}" data-key="${key}" style="--a0:${a0}deg;--a1:${a1}deg">
    <svg class="o-rim" viewBox="0 0 200 200" aria-hidden="true">${sectors()}<circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="99"/><circle cx="100" cy="100" r="78" stroke-dasharray="2 5"/>
      ${[0, 120, 240].map((d) => `<path d="M100 100 L${(100 + 96 * Math.sin(((d + 60) * Math.PI) / 180)).toFixed(1)} ${(100 - 96 * Math.cos(((d + 60) * Math.PI) / 180)).toFixed(1)}"/>`).join('')}
      ${Array.from({ length: 36 }, (_, i) => { const r = (i * 10 * Math.PI) / 180; return `<path d="M${(100 + 90 * Math.sin(r)).toFixed(1)} ${(100 - 90 * Math.cos(r)).toFixed(1)}L${(100 + 96 * Math.sin(r)).toFixed(1)} ${(100 - 96 * Math.cos(r)).toFixed(1)}"/>`; }).join('')}</svg>
    ${[0, 1, 2].map((i) => `<span class="o-face f-${i} ${mark === i ? 'on' : ''}" style="--d:${i * 120}deg"><span class="o-fi">${emblem(FACE_EMB[i])}</span><b>${esc(faceName(i))}</b></span>`).join('')}
    ${seerDots(seers)}<span class="o-needle"><i></i></span><span class="o-hub">${emblem('oracle')}</span></div>`;
}

const pips = (n, total = 5) => `<span class="o-pips" aria-label="${esc(th('{n} Influence', { n }))}">${Array.from({ length: total }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
const rotGlyph = (r) => (r > 0 ? '↻' : r < 0 ? '↺' : '·');
const faceChip = (i) => (i == null ? '<span class="o-chip none">—</span>' : `<span class="o-chip f-${i}">${emblem(FACE_EMB[i])}</span>`);

// ── Phone ──────────────────────────────────────────────────────────────────
export function omenMain(v, me, h) {
  const { S: UI, head } = h;
  const O = v.omen;
  if (!O) return head(v);
  const a = v.action || {};
  if (UI.sel.ophase !== v.phaseId) {
    UI.sel.ophase = v.phaseId;
    UI.sel.opred = a.ballot?.pred ?? null;
    UI.sel.orot = a.ballot?.rot ?? 0;
  }
  const mine = me?.o ?? {};
  const round = `<div class="o-round" data-key="oround"><span class="kicker">${th('Round {n} of {m}', { n: O.round, m: O.rounds })}</span>${pips(mine.influence ?? 0)}</div>`;
  let stage = '';
  switch (v.phase) {
    case 'O_SHOW':
      stage = `${round}${doNow(th('The wheel points to {face}', { face: faceName(O.start) }), t('Everyone sees where it starts. In a moment, secretly predict where it stops, and decide whether to turn it.'))}
        ${wheel({ at: O.start, mark: O.start })}`;
      break;
    case 'O_SECRET': {
      const pred = UI.sel.opred;
      const rot = UI.sel.orot ?? 0;
      const inf = a.influence ?? 0;
      stage = `${round}${doNow(t('Predict, and perhaps turn'), t('Your prediction and your turn stay secret. Every turn at the table is added up before the wheel moves.'))}
        ${wheel({ at: O.start, mark: pred, seers: v.progress ? { n: v.progress.total, done: v.progress.done } : null })}
        <div class="o-pick" data-key="opick"><span class="kicker">${t('Where will it stop?')}</span>
          <div class="o-preds">${[0, 1, 2].map((i) => `<button class="o-pred f-${i} ${pred === i ? 'on' : ''}" data-act="oPred" data-id="${i}" aria-pressed="${pred === i}"><span>${emblem(FACE_EMB[i])}</span><b>${esc(faceName(i))}</b></button>`).join('')}</div></div>
        <div class="o-pick" data-key="orot"><span class="kicker">${t('Turn the wheel?')} · ${th('{n} Influence left', { n: inf })}</span>
          <div class="seg o-rots">${[[-1, '↺', t('Back one')], [0, '◎', t('Leave it')], [1, '↻', t('On one')]].map(([r, g, l]) => `<button data-act="oRot" data-id="${r}" aria-pressed="${rot === r}" aria-label="${esc(l)} · ${esc(t(r < 0 ? 'anticlockwise' : r > 0 ? 'clockwise' : 'the needle stays'))}" ${r !== 0 && inf < 1 ? 'disabled' : ''}><b aria-hidden="true">${g}</b> ${esc(l)}</button>`).join('')}</div>
          <p class="small muted">${t('Turning costs one Influence. Unused Influence is worth one point each at the end.')}</p></div>
        ${a.ballot ? `<p class="small center-text o-sealed">${glyph('check')} ${t('Your omen is sealed. You can change it until everyone is in.')}</p>${waiting(v)}` : ''}`;
      break;
    }
    case 'O_REVEAL': {
      const L = O.last;
      stage = `${round}${doNow(th('It stops at {face}', { face: faceName(L.finish) }), L.offset ? th('The table turned it {n} in all.', { n: L.offset > 0 ? `+${L.offset}` : String(L.offset) }) : t('The turns cancelled out: it did not move.'))}
        ${wheel({ at: L.finish, mark: L.finish, size: 'sm' })}${revealLedger(v)}`;
      break;
    }
    default: break;
  }
  return `${head(v)}${stage}`;
}

/** Who predicted what, who turned which way, and the points. */
function revealLedger(v) {
  const O = v.omen;
  const L = O.last;
  return scoreLedger(v, O.scores, {
    key: 'oled',
    cols: [t('Seer'), t('Prediction · Turn'), t('Points')],
    extra: (id) => { const b = L.ballots[id] ?? {}; const d = L.deltas[id] ?? 0; return `${faceChip(b.pred)}<span class="o-rot r${b.rot ?? 0}">${rotGlyph(b.rot ?? 0)}</span>${d ? `<em class="o-plus">+${d}</em>` : ''}`; },
  });
}

export function omenDock(v, h) {
  const { S: UI, commitBtn, sealedNote } = h;
  const a = v.action || {};
  if (a.type !== 'oballot') return [];
  const ready = UI.sel.opred != null;
  // Classic's pattern (C1): the stamp while the sealed ballot stands; the button again once you change it.
  if (a.ballot && UI.sel.opred === a.ballot.pred && (UI.sel.orot ?? 0) === (a.ballot.rot ?? 0)) return [sealedNote(t('Sealed · you can change it until everyone is in'), 'osealed')];
  return [ready ? commitBtn('secret', 'oSeal', a.ballot ? t('Change my omen') : t('Seal my omen')) : `<span class="dock-note" data-key="odn">${t('Pick where it stops')}</span>`];
}

export function omenActs(h) {
  const { S: UI, send, render, haptic } = h;
  return {
    oPred(el) { UI.sel.opred = Number(el.dataset.id); haptic(6); render(); },
    oRot(el) { UI.sel.orot = Number(el.dataset.id); haptic(6); render(); },
    async oSeal() { if (UI.sel.opred != null) await send('o.ballot', { pred: UI.sel.opred, rot: UI.sel.orot ?? 0 }); },
  };
}
export const OMEN_QUIET = ['oPred', 'oRot'];

// ── Scenes ─────────────────────────────────────────────────────────────────
export function omenMoment(l) {
  if (l.ev === 'o-reveal') return { type: 'ospin', start: l.start, offset: l.offset, finish: l.finish, sound: 'coin' };
  return null;
}
export const O_MOMENT_TIME = { ospin: 4600 };

export function omenMomentHtml(m, h) {
  const { letters } = h;
  return `${wheel({ from: m.start, turn: m.offset, size: 'big', key: `ospin-${m.start}-${m.offset}` })}
    <span class="kicker">${esc(m.offset ? th('The table turned it {n}', { n: m.offset > 0 ? `+${m.offset}` : String(m.offset) }) : t('The turns cancel out'))}</span>
    <h1 class="m-title o-ft f-${m.finish}">${letters(faceName(m.finish))}</h1>`;
}

// ── Lobby ──────────────────────────────────────────────────────────────────
/** How it works: the lobby's step 2 and the guide's chapter header. */
export function explainerHtml() {
  return explainer(t('How The Omen works'), [
    ['oracle', t('The wheel'), t('It points to Life, Death or Rebirth. Everyone sees where each round starts.')],
    ['mentalist', t('Predict'), t('Secretly guess where it will stop: a right guess scores 3.')],
    ['maskedvote', t('Turn it'), t('Spend one of your five Influence to turn it one step, either way. Every turn is added up.')],
    ['crown', t('Seven rounds'), t('Unused Influence is worth one point each at the end. The most points wins; ties share.')],
  ], glyph, 'oexplain');
}

export function omenLobbyDeck(v, isHost, h) {
  const n = v.players.length;
  return `${explainerHtml()}
    <section class="lobby-deck" data-key="odeck">
    <div class="rule lstep">${t(n === 1 ? 'The deck · {n} player' : 'The deck · {n} players', { n })}</div>
    <p class="small muted">${n >= 4 ? t('Everyone plays for themself. No hidden sides.') : t('Seat 4 to 12 players.')}</p>
    <div class="o-lobbyart" data-key="olart">${wheel({ at: 0, mark: 0, size: 'sm', key: 'olwheel' })}</div>
    ${h.music ?? ''}
    ${v.oScores ? scoreLedger(v, v.oScores, { title: t('Last game'), key: 'olast' }) : ''}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
export const omenTitle = (v) => { const w = v.omen?.winners ?? []; return w.length ? tp('{names} wins', '{names} win', w.length, { names: w.map((id) => rawName(v, id)) }) : t('The End'); };

export function omenEndHtml(v) {
  const O = v.omen;
  if (!O?.winners) return '';
  const back = v.deadline ? `<p class="center-text small muted">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const rounds = (O.history ?? []).map((r) => `<li><span class="kicker">${r.round}</span>${faceChip(r.start)}<span class="o-rot r${Math.sign(r.offset)}">${r.offset > 0 ? `+${r.offset}` : r.offset}</span>${faceChip(r.finish)}</li>`).join('');
  return `${back}${scoreLedger(v, O.scores, { title: t('The final count'), key: 'oend', winners: O.winners,
    extra: (id) => `<small class="o-bonus">${th('+{n} Influence', { n: O.bonus?.[id] ?? 0 })}</small>` })}
    <section data-key="orounds"><div class="rule">${t('Every turn of the wheel')}</div><ol class="o-hist">${rounds}</ol></section>`;
}

// ── TV ─────────────────────────────────────────────────────────────────────
export function omenBoard(v, h) {
  const { header } = h;
  const O = v.omen;
  if (!O) return '';
  const ended = v.phase === 'ENDED';
  const L = O.last;
  const showing = v.phase === 'O_REVEAL' && L;
  const at = showing ? L.finish : O.start;
  const title = ended ? omenTitle(v) : v.phase === 'O_SHOW' ? th('The wheel points to {face}', { face: faceName(O.start) })
    : v.phase === 'O_SECRET' ? t('Predict, and perhaps turn') : showing ? th('It stops at {face}', { face: faceName(L.finish) }) : '';
  const sub = v.phase === 'O_SECRET' ? th('Omens sealed · {done}/{total}', v.progress ?? { done: 0, total: 0 }) : showing ? (L.offset ? th('The table turned it {n} in all.', { n: L.offset > 0 ? `+${L.offset}` : String(L.offset) }) : t('The turns cancelled out: it did not move.')) : '';
  const extra = (id) => {
    if (showing) { const b = L.ballots[id] ?? {}; const d = L.deltas[id] ?? 0; return `${faceChip(b.pred)}<span class="o-rot r${b.rot ?? 0}">${rotGlyph(b.rot ?? 0)}</span>${d ? `<em class="o-plus">+${d}</em>` : ''}${pips(O.influence[id])}`; }
    return `${v.phase === 'O_SECRET' && O.locked.includes(id) ? `<span class="o-lock">${glyph('check')}</span>` : ''}${pips(O.influence[id])}`;
  };
  return `<main class="board2 oboard ${ended ? 'is-ended' : ''}" data-key="board-o">${header}
    <div class="ot-cols">
      <section class="ot-wheel">${ended ? '' : `<span class="kicker">${th('Round {n} of {m}', { n: O.round, m: O.rounds })}</span>`}${wheel({ at, mark: showing || v.phase === 'O_SHOW' ? at : null, size: 'tv' })}
        <div class="ot-banner"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div></section>
      <section class="ot-side">${ended ? omenEndHtml(v) : scoreLedger(v, O.scores, { title: t('The seers'), key: 'otled', extra })}</section>
    </div></main>`;
}
