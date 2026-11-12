// Dead Set: Coffins — phone screens, moments, the TV graveyard and the end screen.
// Pure renderers over the filtered view; the shell (app.js) passes its helpers
// in `h` and merges `coffinsActs` into its action table.
//
// Privacy: every coffin face is drawn on the same dark wood at the same
// brightness, and nothing private ever plays a sound or a buzz.
import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { t, th } from './i18n.js';
import { avatarSvg } from './avatar.js';
import { backdropHtml } from './backdrops.js';

export const isCoffinsPhase = (ph) => typeof ph === 'string' && ph.startsWith('C_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const name = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
const player = (v, id) => v.players.find((p) => p.id === id);

// ── Art ────────────────────────────────────────────────────────────────────
/** The red wax seal: the curse. Scalloped rim, a cracked heart pressed in. */
function sealSvg(cls = '') {
  const pts = [];
  const n = 14;
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? 40 : 46;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<svg class="c-seal ${cls}" viewBox="0 0 100 100" aria-hidden="true"><path d="M${pts.join('L')}Z" fill="#9b2328" stroke="#5e1014" stroke-width="2"/>
    <circle cx="50" cy="50" r="31" fill="none" stroke="#c9474c" stroke-width="2.4"/>
    <path d="M50 70C34 58 28 50 28 42a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 8-6 16-22 28z" fill="#7a171c" stroke="#d76a6e" stroke-width="2"/>
    <path d="M50 40l-5 9 7 5-6 12" fill="none" stroke="#e9b3a5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
/** A face: Gold (the coin), Curse (the seal) or the Death coffin. */
export function faceArt(f) {
  if (f === 'C') return sealSvg();
  if (f === 'D') return emblem('death', { cls: 'c-face-em' });
  return emblem('coin', { cls: 'c-face-em' });
}
const FACE_EN = { G: 'Gold', C: 'Cursed', D: 'The Death coffin' };
export const faceName = (f) => t(FACE_EN[f] ?? 'Gold');

/** An upright coffin card (your hand). `f` null draws the closed lid. */
export function coffinCard(f, { cls = '', act = '', id = '', sel = false, label = '', key = '', badge = '' } = {}) {
  const tag = act ? 'button' : 'div';
  return `<${tag} class="ccard ${f ? `f-${f}` : 'back'} ${sel ? 'sel' : ''} ${cls}" ${act ? `data-act="${act}" data-id="${esc(id)}" aria-pressed="${sel}"` : ''} ${key ? `data-key="${key}"` : ''} aria-label="${esc(label || (f ? faceName(f) : t('A coffin')))}">
    <svg class="cc-wood" viewBox="0 0 60 100" aria-hidden="true"><path class="cc-box" d="M18 2h24l15 24-10 72H13L3 26z"/><path class="cc-lid" d="M20 7h20l12 20-9 66H17L8 27z"/>${f ? '' : '<path class="cc-cross" d="M30 30v34M21 41h18"/>'}<circle class="cc-nail" cx="13" cy="28" r="1.4"/><circle class="cc-nail" cx="47" cy="28" r="1.4"/><circle class="cc-nail" cx="20" cy="88" r="1.4"/><circle class="cc-nail" cx="40" cy="88" r="1.4"/></svg>
    ${f ? `<span class="cc-face">${faceArt(f)}</span>` : ''}${badge}</${tag}>`;
}

/** A coffin lying in a plot: closed, or opened with its face showing. */
function slab(f, i, fresh = false) {
  return `<i class="cslab ${f ? `open f-${f}` : ''} ${fresh ? 'fresh' : ''}" style="--i:${i}" data-key="sl-${i}-${f || 'x'}"><svg viewBox="0 0 100 34" aria-hidden="true"><path class="cs-box" d="M2 12L20 2h76v30H20L2 22z"/><path class="cs-lid" d="M7 13L22 6h70v22H22L7 21z"/></svg>${f ? `<span class="cs-face">${faceArt(f)}</span>` : ''}</i>`;
}

const RELIC_GLYPH = { LANTERN: 'lantern', KEY: 'key', WARD: 'ward' };
const RELIC_EN = { LANTERN: 'Lantern', KEY: 'Key', WARD: 'Ward' };
const RELIC_WHEN = {
  LANTERN: 'On your turn, before the bidding: peek at the top coffin of another grave.',
  KEY: 'When you dig: open another player\'s top coffin before your own.',
  WARD: 'When you hit a curse or the Death coffin: nothing is lost. Used by itself.',
};
const relicArt = (id) => (id === 'KEY' ? emblem('key', { cls: 'glyph' }) : glyph(RELIC_GLYPH[id] ?? 'scroll'));
export const relicName = (id) => t(RELIC_EN[id] ?? id);

// ── The graveyard: one headstone per player ───────────────────────────────
function candles(n, of) {
  return `<span class="c-candles" aria-label="${esc(th('{n} of {m} candles', { n, m: of }))}">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'lit' : ''}"></i>`).join('')}</span>`;
}
function winMarks(w, of) {
  return `<span class="c-wins" aria-label="${esc(th('{n} of {m} clean digs', { n: w, m: of }))}">${Array.from({ length: of }, (_, i) => `<i class="${i < w ? 'on' : ''}"></i>`).join('')}</span>`;
}

/** One headstone. `pick` makes it a button; `big` is the TV size. */
function stone(v, plot, { pick = null, sel = false, big = false, reveal = false } = {}) {
  const C = v.coffins;
  const p = player(v, plot.id);
  const meId = v.me?.id;
  const bidder = C.bid?.by === plot.id && ['C_BID', 'C_WAGER', 'C_DIG', 'C_LOSE'].includes(v.phase);
  const passed = v.phase === 'C_BID' && C.passed?.includes(plot.id);
  const now = (v.phase === 'C_TURN' || v.phase === 'C_BID') && C.turn === plot.id;
  const digger = C.digger === plot.id && ['C_WAGER', 'C_DIG', 'C_LOSE'].includes(v.phase);
  const cls = ['cstone', plot.id === meId ? 'me' : '', plot.out ? 'out' : '', plot.risen ? 'risen' : '', now ? 'now' : '', digger ? 'digger' : '',
    passed ? 'passed' : '', bidder ? 'bidder' : '', plot.wins ? 'gilt' : '', pick ? 'can' : '', sel ? 'sel' : '', p?.connected === false ? 'away' : ''].filter(Boolean).join(' ');
  // The stack, top first: opened coffins (this dig) show their faces.
  const st = reveal && plot.stack ? [...plot.stack].reverse() : null;
  const n = st ? st.length : plot.buried;
  const opened = plot.opened ?? [];
  const slabs = Array.from({ length: n }, (_, i) => slab(st ? st[i] : opened[i] ?? null, i, !st && i === opened.length - 1 && v.phase === 'C_DIG')).join('');
  const med = p?.avatar ? avatarSvg(p.avatar, 'cs-av') : `<b class="cs-ini">${esc((p?.name ?? '?')[0])}</b>`;
  const tagLine = plot.out
    ? (C.wagersOn ? candles(plot.candles, C.rise) : `<small class="cs-tag">${t('Out')}</small>`)
    : `<small class="cs-tag">${plot.inHand ? th('{n} in hand', { n: plot.inHand }) : t('Hand empty')}</small>`;
  const badge = bidder ? `<b class="cs-bid" data-key="bid-${C.bid.n}">${C.bid.n}</b>` : passed ? `<b class="cs-pass">${t('Pass')}</b>` : '';
  const relic = plot.relicUsed ? `<span class="cs-relic" title="${esc(relicName(plot.relicUsed))}">${relicArt(plot.relicUsed)}</span>` : '';
  const tag = pick ? 'button' : 'div';
  return `<${tag} class="${cls} ${big ? 'big' : ''}" ${pick ? `data-act="${pick}" data-id="${plot.id}" aria-pressed="${sel}"` : ''} data-key="cs-${plot.id}" aria-label="${esc(p?.name ?? '')}">
    <span class="cs-head">${plot.out ? `<span class="cs-crack" aria-hidden="true"></span>` : ''}<span class="cs-med">${med}${plot.risen ? `<i class="cs-rev">${glyph('necro')}</i>` : ''}${plot.out && C.wagersOn ? `<i class="cs-shade">${glyph('shade')}</i>` : ''}</span>
      <b class="cs-name">${esc(p?.name ?? '?')}</b>${winMarks(plot.wins, C.toWin)}${relic}${badge}</span>
    <span class="cs-plot" style="--n:${n}">${slabs || `<i class="cs-empty">${plot.out ? '' : t('nothing buried')}</i>`}</span>
    <span class="cs-foot">${tagLine}</span>
  </${tag}>`;
}

/** Every grave in seat order. `pick(plot)` returns the act for tappable ones. */
export function graveyard(v, { pick = () => null, selected = null, big = false, reveal = false } = {}) {
  const C = v.coffins;
  if (!C) return '';
  return `<div class="cyard ${big ? 'big' : ''} n${Math.min(C.plots.length, 10)}" data-key="cyard">${C.plots.map((pl) => stone(v, pl, { pick: pick(pl), sel: selected === pl.id, big, reveal })).join('')}</div>`;
}

// ── The bell tower: the current bid ────────────────────────────────────────
function tower(v, big = false) {
  const C = v.coffins;
  const bid = C.bid?.n ?? 0;
  const by = C.bid?.by;
  const digging = v.phase === 'C_DIG' || v.phase === 'C_WAGER';
  const opened = C.opened?.length ?? 0;
  const inner = digging
    ? `<span class="kicker">${t('Opened')}</span><b class="ct-n">${opened}<small>/${C.target}</small></b><small>${esc(name(v, C.digger))}</small>`
    : bid ? `<span class="kicker">${t('The bid')}</span><b class="ct-n" data-key="ctn-${bid}">${bid}</b><small>${esc(name(v, by))}</small>`
      : `<span class="kicker">${t('Buried')}</span><b class="ct-n">${C.total}</b><small>${t('in the ground')}</small>`;
  return `<div class="ctower ${big ? 'big' : ''} ${digging ? 'dig' : ''}" data-key="ctower"><svg class="ct-bell" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4v4M10 28c2-4 2-8 2-12a8 8 0 0 1 16 0c0 4 0 8 2 12zM8 28h24M17 31a3 3 0 0 0 6 0"/></svg>${inner}
    ${!digging && bid ? `<span class="ct-of">${th('of {n} buried', { n: C.total })}</span>` : ''}</div>`;
}

// ── Phone: main screen ─────────────────────────────────────────────────────
/** Your coffins: the hand along the bottom; buried ones sit in the ground. */
function myCoffins(v, { pickable = false, act = 'cPickCard', selected = null, loss = false } = {}) {
  const me = v.me?.c;
  if (!me?.cards?.length) return '';
  const cards = loss ? me.cards : [...me.cards].sort((a, b) => (a.buried === b.buried ? 0 : a.buried ? 1 : -1));
  const inHand = cards.filter((c) => !c.buried).length;
  return `<section class="chand ${pickable ? 'picking' : ''}" data-key="chand"><div class="rule">${t('Your coffins')}</div>
    <div class="ch-row">${cards.map((c) => {
      const can = pickable && (loss || !c.buried);
      const badge = c.buried && !loss ? `<span class="cc-buried">${th('Buried · {n}', { n: c.pos + 1 })}</span>` : '';
      return coffinCard(c.face, { act: can ? act : '', id: c.id, sel: selected === c.id, cls: c.buried && !loss ? 'buried' : '', key: `cc-${c.id}`, badge });
    }).join('')}</div>
    <p class="small muted center-text" data-key="chand-n">${loss ? t('Choose the coffin you lose for good.') : inHand ? th('{n} still in your hand.', { n: inHand }) : t('All your coffins are in the ground.')}</p></section>`;
}

function relicCard(v, S) {
  const r = v.me?.c?.relic;
  if (!r || !v.coffins?.relicsOn) return '';
  const lantern = r.id === 'LANTERN' && !r.used && v.action?.type === 'cturn' && v.action.lantern?.length;
  return `<div class="crelic ${r.used ? 'used' : ''}" data-key="crelic"><span class="cr-art">${relicArt(r.id)}</span><span><b>${th('Your relic: {r}', { r: relicName(r.id) })}</b><small>${r.used ? t('Used.') : t(RELIC_WHEN[r.id])}</small></span>
    ${lantern ? `<button class="chip ${S.ui.clantern ? 'live' : ''}" data-act="cLanternMode" data-key="clmode">${glyph('lantern')}<span>${t(S.ui.clantern ? 'Cancel' : 'Light it')}</span></button>` : ''}</div>`;
}

function stepper(v, S, min, max) {
  const n = Math.min(max, Math.max(min, S.sel.cbid ?? min));
  S.sel.cbid = n;
  return `<div class="cstep" data-key="cstep"><button class="cs-btn" data-act="cStep" data-id="-1" ${n <= min ? 'disabled' : ''} aria-label="${esc(t('Lower'))}">−</button>
    <span class="cs-val"><b data-key="csv-${n}">${n}</b><small>${th('of {n} buried', { n: max })}</small></span>
    <button class="cs-btn" data-act="cStep" data-id="1" ${n >= max ? 'disabled' : ''} aria-label="${esc(t('Higher'))}">+</button></div>`;
}

export function coffinsMain(v, me, h) {
  const { S, head, chips } = h;
  const C = v.coffins;
  if (!C) return head(v);
  const a = v.action || {};
  let stage = '';
  let pick = () => null;
  let selected = null;
  let hand = '';
  const ghost = !!me?.c?.out;
  switch (v.phase) {
    case 'C_LOTTERY':
      stage = `<p class="center-text muted" data-key="clot">${t('The lots are drawn to choose who plays first…')}</p>`;
      break;
    case 'C_BURY':
      if (a.type === 'cbury' && !a.done) {
        stage = `<div class="cturn me rise-in" data-key="cbury-me"><span class="kicker">${th('Round {n}', { n: C.round })}</span><h2>${t('Bury your first coffin')}</h2><p class="small muted">${t('Tap a coffin, then hold to bury it. Everyone buries one at once.')}</p></div>`;
        hand = myCoffins(v, { pickable: true, selected: S.sel.ccard });
      } else {
        stage = `<div class="cturn" data-key="cbury"><span class="kicker">${th('Round {n}', { n: C.round })}</span><h2>${t(ghost ? 'The living bury their coffins' : 'Your coffin is in the ground')}</h2><p class="small muted">${th('{done}/{total} have buried', v.progress ?? { done: 0, total: 0 })}</p></div>`;
        hand = myCoffins(v);
      }
      break;
    case 'C_TURN':
      if (a.type === 'cturn') {
        if (S.ui.clantern && a.lantern?.length) {
          stage = `<div class="cturn me rise-in" data-key="clantern-me"><span class="kicker">${t('Your Lantern')}</span><h2>${t('Pick a grave to light')}</h2><p class="small muted">${t('Only you will see its top coffin. The table only learns whose grave you lit.')}</p></div>`;
          pick = (pl) => (a.lantern.includes(pl.id) ? 'cPickPlot' : null);
          selected = S.sel.cplot;
          hand = myCoffins(v);
        } else {
          stage = `<div class="cturn me rise-in" data-key="cturn-me"><span class="kicker">${t('Your turn')}</span><h2>${t(a.canBury ? 'Bury another coffin, or challenge' : 'Your hand is empty: challenge')}</h2>
            <p class="small muted">${t(a.canBury ? 'Tap a coffin and hold to bury it. Or name how many coffins you can open without a curse.' : 'Name how many coffins you can open without a curse.')}</p></div>
            <div class="cchal" data-key="cchal"><span class="kicker">${t('Or challenge: I can open…')}</span>${stepper(v, S, 1, a.max)}</div>`;
          hand = myCoffins(v, { pickable: a.canBury, selected: S.sel.ccard });
        }
      } else {
        stage = `<div class="cturn" data-key="cturn"><span class="kicker">${th('Round {n}', { n: C.round })}</span><h2>${esc(name(v, C.turn))}</h2><p class="small muted">${t('Bury another coffin, or challenge?')}</p></div>`;
        hand = myCoffins(v);
      }
      break;
    case 'C_BID':
      if (a.type === 'cbid') {
        stage = `<div class="cturn me rise-in" data-key="cbid-me"><span class="kicker">${t('Your bid')}</span><h2>${th('Raise above {n}, or pass', { n: a.bid.n })}</h2>
          <p class="small muted">${th('{a} says they can open {n}. The highest bidder must dig, starting with their own grave. A pass is final this round.', { a: name(v, a.bid.by), n: a.bid.n })}</p></div>
          <div class="cchal" data-key="cchal">${stepper(v, S, a.min, a.max)}</div>`;
      } else {
        stage = `<div class="cturn" data-key="cbid"><span class="kicker">${t('The bidding')}</span><h2>${esc(name(v, C.turn))}</h2><p class="small muted">${th('Raise above {n}, or pass?', { n: C.bid.n })}</p></div>`;
      }
      hand = myCoffins(v);
      break;
    case 'C_WAGER':
      if (a.type === 'cwager') {
        stage = `<div class="cturn me ghost rise-in" data-key="cwager-me"><span class="kicker">${t('A ghost\'s wager')}</span><h2>${th('Will {a} dig clean?', { a: name(v, C.digger) })}</h2>
          <p class="small muted">${th('{n} coffins to open. Call it right to light a candle. Three candles and you rise.', { n: C.target })}</p>
          <div class="cwager" data-key="cwg"><button class="cw-btn ${a.bet === 'gold' ? 'on' : ''}" data-act="cWager" data-id="gold" aria-pressed="${a.bet === 'gold'}">${coffinCard('G')}<b>${t('Gold')}</b><small>${t('A clean dig')}</small></button>
          <button class="cw-btn ${a.bet === 'curse' ? 'on' : ''}" data-act="cWager" data-id="curse" aria-pressed="${a.bet === 'curse'}">${coffinCard('C')}<b>${t('Cursed')}</b><small>${t('It fails')}</small></button></div></div>`;
      } else {
        stage = `<div class="cturn" data-key="cwager"><span class="kicker">${th('{a} must open {n}', { a: name(v, C.digger), n: C.target })}</span><h2>${t('The ghosts are wagering…')}</h2><p class="small muted">${th('{done}/{total} wagers in', v.progress ?? { done: 0, total: 0 })}</p></div>`;
        hand = myCoffins(v);
      }
      break;
    case 'C_DIG':
      if (a.type === 'ckey') {
        stage = `<div class="cturn me rise-in" data-key="ckey-me"><span class="kicker">${t('Your Key')}</span><h2>${t('Open another grave first?')}</h2><p class="small muted">${t('Pick a grave to open its top coffin before your own, or skip the Key.')}</p></div>`;
        pick = (pl) => (a.targets.includes(pl.id) ? 'cPickPlot' : null);
        selected = S.sel.cplot;
      } else if (a.type === 'cdig') {
        stage = `<div class="cturn me rise-in" data-key="cdig-me"><span class="kicker">${t('You dig')}</span><h2>${th(a.left === 1 ? 'Open {n} more coffin' : 'Open {n} more coffins', { n: a.left })}</h2><p class="small muted">${t('Your own grave is open. Tap another grave to open its top coffin.')}</p></div>`;
        pick = (pl) => (a.targets.includes(pl.id) ? 'cPickPlot' : null);
        selected = S.sel.cplot;
      } else {
        stage = `<div class="cturn" data-key="cdig"><span class="kicker">${th('{a} digs', { a: name(v, C.digger) })}</span><h2>${th('{k} of {n} opened', { k: C.opened.length, n: C.target })}</h2><p class="small muted">${t('Own grave first, then one top coffin at a time.')}</p></div>`;
      }
      hand = myCoffins(v);
      break;
    case 'C_LOSE':
      if (a.type === 'closs') {
        stage = `<div class="cturn me demon rise-in" data-key="closs-me"><span class="kicker blood">${t('Your own curse')}</span><h2>${t('Give up one coffin')}</h2><p class="small muted">${t('Nobody learns which kind. Then choose who starts the next round.')}</p></div>`;
        hand = myCoffins(v, { pickable: true, act: 'cPickCard', selected: S.sel.ccard, loss: true });
        const starters = a.starters ?? [];
        stage += `<div class="cstarter" data-key="cstart"><span class="kicker">${t('Who starts the next round?')}</span><div class="chips-row">${starters.map((id) => `<button class="chipbtn ${(S.sel.cfirst ?? me.id) === id ? 'on' : ''}" data-act="cPickFirst" data-id="${id}">${esc(id === me.id ? t('You') : name(v, id))}</button>`).join('')}</div></div>`;
      } else {
        stage = `<div class="cturn" data-key="closs"><span class="kicker blood">${t('Their own curse')}</span><h2>${esc(name(v, C.digger))}</h2><p class="small muted">${t('They choose which coffin to lose, in secret.')}</p></div>`;
        hand = myCoffins(v);
      }
      break;
    default: break;
  }
  const ghostNote = ghost && C.wagersOn && v.phase !== 'C_WAGER'
    ? `<p class="c-ghostnote" data-key="cgn">${glyph('shade')}<span>${th('You are a ghost. Wager on every dig: {n} of {m} candles lit.', { n: C.plots.find((x) => x.id === me.id)?.candles ?? 0, m: C.rise })}</span></p>` : '';
  const goal = `<p class="c-goal small muted center-text" data-key="cgoal">${th(C.toWin === 1 ? 'One clean dig wins.' : '{n} clean digs win.', { n: C.toWin })}</p>`;
  // The hand comes first while you are choosing from it; the graveyard while you pick a grave.
  const handFirst = hand.includes('chand picking');
  const yard = `${tower(v)}${graveyard(v, { pick, selected })}${goal}${ghostNote}`;
  return `${head(v)}${stage}${handFirst ? hand + yard : yard + hand}${relicCard(v, S)}${chips(v)}`;
}

// ── Phone: the dock ────────────────────────────────────────────────────────
export function coffinsDock(v, h) {
  const { S, btn, holdBtn, rawName } = h;
  const a = v.action || {};
  const parts = [];
  switch (a.type) {
    case 'cbury':
      if (!a.done) parts.push(holdBtn('cBury', S.sel.ccard ? t('Hold to bury') : t('Tap a coffin first'), 'btn-solid', { dis: !S.sel.ccard }));
      break;
    case 'cturn':
      if (S.ui.clantern && a.lantern?.length) {
        parts.push(btn(t('Cancel'), 'cLanternMode', 'btn-ghost'));
        if (S.sel.cplot && a.lantern.includes(S.sel.cplot)) parts.push(holdBtn('cLantern', th('Light {name}\'s grave', { name: rawName(S.sel.cplot) }), 'btn-solid'));
        break;
      }
      if (a.canBury) parts.push(holdBtn('cBury', S.sel.ccard ? t('Hold to bury') : t('Tap a coffin to bury'), 'btn-ghost', { dis: !S.sel.ccard }));
      parts.push(holdBtn('cChallenge', th('Hold to challenge: {n}', { n: S.sel.cbid ?? 1 }), 'btn-blood'));
      break;
    case 'cbid':
      parts.push(btn(t('Pass'), 'cPass', 'btn-ghost'));
      parts.push(holdBtn('cRaise', th('Hold to raise to {n}', { n: S.sel.cbid ?? a.min }), 'btn-blood'));
      break;
    case 'ckey':
      parts.push(btn(t('Skip the Key'), 'cKeySkip', 'btn-ghost'));
      if (S.sel.cplot) parts.push(holdBtn('cKey', th('Turn the Key: {name}', { name: rawName(S.sel.cplot) }), 'btn-solid'));
      break;
    case 'cdig':
      if (S.sel.cplot && a.targets.includes(S.sel.cplot)) parts.push(holdBtn('cOpen', th('Hold to open {name}\'s coffin', { name: rawName(S.sel.cplot) }), 'btn-blood'));
      else parts.push(`<span class="dock-note" data-key="cdn">${t('Tap a grave to dig')}</span>`);
      break;
    case 'closs':
      parts.push(holdBtn('cLose', S.sel.ccard ? t('Hold to give it up') : t('Tap a coffin first'), 'btn-blood', { dis: !S.sel.ccard }));
      break;
    default: break;
  }
  return parts;
}

// ── Actions ────────────────────────────────────────────────────────────────
export function coffinsActs(h) {
  const { S, V, send, render, burstAt, sound, haptic } = h;
  const clear = () => { S.sel.ccard = null; S.sel.cplot = null; S.sel.cbid = null; S.sel.cfirst = null; S.ui.clantern = false; };
  return {
    cPickCard(el) { S.sel.ccard = S.sel.ccard === el.dataset.id ? null : el.dataset.id; haptic(8); render(); },
    cPickPlot(el) { S.sel.cplot = el.dataset.id; haptic(8); render(); },
    cPickFirst(el) { S.sel.cfirst = el.dataset.id; haptic(8); render(); },
    cStep(el) { const a = V().action; const min = a.type === 'cbid' ? a.min : 1; S.sel.cbid = Math.min(a.max, Math.max(min, (S.sel.cbid ?? min) + Number(el.dataset.id))); haptic(6); render(); },
    cLanternMode() { S.ui.clantern = !S.ui.clantern; S.sel.cplot = null; render(); },
    async cBury(el) { const ok = await send('c.bury', { card: S.sel.ccard }); if (ok) { clear(); sound.play('thud'); burstAt(el, { colors: ['#6b4a2e', '#ece5d5'] }); } },
    async cChallenge(el) { const ok = await send('c.challenge', { n: S.sel.cbid ?? 1 }); if (ok) { clear(); sound.play('stamp'); burstAt(el, { colors: ['#e2585e', '#ece5d5'] }); } },
    async cRaise(el) { const a = V().action; const ok = await send('c.raise', { n: S.sel.cbid ?? a.min }); if (ok) { clear(); sound.play('stamp'); burstAt(el, { colors: ['#e2585e', '#ece5d5'] }); } },
    async cPass() { const ok = await send('c.pass', {}); if (ok) clear(); },
    async cWager(el) { const ok = await send('c.wager', { bet: el.dataset.id }); if (ok) haptic(10); },
    async cLantern() { const ok = await send('c.lantern', { owner: S.sel.cplot }); if (ok) clear(); },
    async cKey() { const ok = await send('c.key', { owner: S.sel.cplot }); if (ok) clear(); },
    async cKeySkip() { const ok = await send('c.key', {}); if (ok) clear(); },
    async cOpen() { const ok = await send('c.open', { owner: S.sel.cplot }); if (ok) { S.sel.cplot = null; haptic(12); } },
    async cLose() { const ok = await send('c.lose', { card: S.sel.ccard, first: S.sel.cfirst ?? V().me.id }); if (ok) clear(); },
    cSet(el) {
      const key = el.dataset.id;
      const val = el.type === 'checkbox' ? el.checked : Number(el.value);
      send('host.settings', { c: { [key]: val } }, { quiet: true });
    },
  };
}
export const COFFINS_QUIET = ['cPickCard', 'cPickPlot', 'cPickFirst', 'cStep', 'cLanternMode'];

// ── Moments ────────────────────────────────────────────────────────────────
export function coffinsMoment(l, v, fresh, { notify, name: nm, sound }) {
  switch (l.ev) {
    case 'c-lottery': {
      const order = l.order.map((id) => ({ id, name: nm(id), av: v.players.find((p) => p.id === id)?.avatar ?? null }));
      return { type: 'mlottery', order, leader: l.leader, leaderName: nm(l.leader), idx: l.order.indexOf(l.leader), spins: l.spins ?? 2, sound: null,
        kickerText: t('Before the first burial'), titleText: t('Who plays first?'), resultText: t('The first to play') };
    }
    case 'c-round': if (l.n > 1) notify(t('Round {n} · {a} starts', { n: l.n, a: nm(l.first) })); return null;
    case 'c-bid': notify(t(l.open ? '{a} challenges: "I can open {n}."' : '{a} raises: "I can open {n}."', { a: nm(l.pid), n: l.n })); sound?.('accuse'); return null;
    case 'c-pass': notify(t('{a} passes.', { a: nm(l.pid) })); return null;
    case 'c-bury': sound?.('thud'); return null;
    case 'c-lantern': notify(t('{a} lights a Lantern over {b}\'s grave.', { a: nm(l.pid), b: nm(l.owner) })); return null;
    case 'c-key': notify(t('{a} turns a Key in {b}\'s grave first.', { a: nm(l.pid), b: nm(l.owner) })); return null;
    case 'c-open': sound?.(l.face === 'G' ? 'goodCard' : l.face === 'D' ? 'death' : 'crack'); return null;
    case 'c-lost': notify(t('{a} gives up a coffin. {b} starts the next round.', { a: nm(l.pid), b: nm(l.first) })); return null;
    case 'c-dig': return { type: 'cdig', digger: nm(l.pid), n: l.n, sound: 'gavel' };
    case 'c-result': {
      const res = { ...l, diggerName: nm(l.digger), ownerName: l.owner ? nm(l.owner) : '', stealer: l.stolenBy ? nm(l.stolenBy) : '',
        outNames: (l.out ?? []).map(nm), right: (l.wagerRight ?? []).map(nm), count: l.opened?.length ?? 0, toWin: v.coffins?.toWin ?? 2 };
      return { type: 'cresult', res, count: res.count, me: v.me?.id === l.digger, sound: l.face === 'G' ? 'win' : l.face === 'D' ? 'death' : 'crack' };
    }
    case 'c-rise': return { type: 'crise', who: nm(l.pid), av: v.players.find((p) => p.id === l.pid)?.avatar ?? null, sound: 'revive' };
    default: return null;
  }
}

export const C_MOMENT_TIME = { cdig: 2800, cresult: 6000, crise: 3600, clantern: 4200 };

/** Private: what your Lantern showed (only on your phone, silently). */
export function lanternMoments(freshPriv, nm) {
  return freshPriv.filter((x) => x.kind === 'lantern' && x.face).map((x) => ({ type: 'clantern', face: x.face, owner: nm(x.owner), tapOnly: true, sound: null }));
}

export function coffinsMomentHtml(m, h) {
  const { letters } = h;
  switch (m.type) {
    case 'cdig':
      return `<div class="m-art c-spade">${glyph('undertaker')}</div><span class="kicker">${t('The bidding is over')}</span><h1 class="m-title">${letters(m.digger)}</h1>
        <p class="m-sub">${th(m.n === 1 ? 'must open {n} coffin, starting with their own grave.' : 'must open {n} coffins, starting with their own grave.', { n: m.n })}</p>`;
    case 'clantern':
      return `<div class="m-art">${glyph('lantern')}</div><span class="kicker">${t('Your Lantern')}</span><h1 class="m-title">${letters(m.owner)}</h1>
        <div class="c-lantern-card">${coffinCard(m.face)}</div><p class="m-sub">${th('The top coffin: {f}.', { f: faceName(m.face) })}</p><p class="small muted">${t('Only you saw this.')}</p>`;
    case 'cresult': {
      const r = m.res;
      const own = r.owner === r.digger;
      const title = r.face === 'G' ? t('A clean dig!') : r.ward ? t('The Ward holds') : r.face === 'D' ? (own ? t('Their own Death coffin') : t('Death!')) : own ? t('Their own curse!') : th('{b}\'s curse!', { b: r.ownerName });
      const tiles = r.opened.map((o, i) => `<li style="--d:${0.5 + i * 0.6}s" class="f-${o.face}">${coffinCard(o.face, { cls: 'flipin' })}</li>`).join('');
      let stamp;
      if (r.face === 'G') stamp = `<div class="c-stamp win">${th('{w} of {t}', { w: r.wins, t: r.toWin })}</div>`;
      else if (r.ward) stamp = `<div class="c-stamp">${t('Nothing lost')}</div>`;
      else if (r.face === 'D' && own) stamp = `<div class="c-stamp loss">${t('The dig fails')}</div>`;
      else if (r.face === 'D') stamp = `<div class="c-stamp loss">${th('{b} steals a coffin', { b: r.stealer })}</div>`;
      else stamp = `<div class="c-stamp loss">${t('A coffin is lost')}</div>`;
      const lines = [];
      if (r.face === 'C' && own) lines.push(t('They choose which coffin to lose, in secret.'));
      if (r.face === 'C' && !own) lines.push(th('{b} draws one of {a}\'s coffins blindly. It is gone.', { a: r.diggerName, b: r.ownerName }));
      if (r.outNames.length) lines.push(th('{names}: no coffins left.', { names: r.outNames }));
      if (r.right.length) lines.push(th('The ghosts who called it: {names}', { names: r.right }));
      const delay = 0.5 + r.opened.length * 0.6 + 0.4;
      return `<span class="kicker">${th('{a} digs · {n}', { a: r.diggerName, n: r.n })}</span>
        <ol class="c-opened" style="--n:${r.opened.length}">${tiles}</ol>
        <div class="c-verdict ${r.face === 'G' ? 'gold' : 'grim'}" style="--d:${delay}s"><h1 class="m-title">${letters(title)}</h1>${stamp}${lines.map((x) => `<p class="m-sub small">${x}</p>`).join('')}</div>`;
    }
    case 'crise':
      return `<div class="m-art c-rise">${glyph('necro')}</div><span class="kicker">${t('Three candles')}</span><h1 class="m-title">${letters(m.who)}</h1>
        <div class="c-rise-candles">${candles(3, 3)}</div><p class="m-sub">${t('rises from the grave as a Revenant, with one Gold coffin.')}</p>`;
    default: return '';
  }
}

// ── Lobby ──────────────────────────────────────────────────────────────────
export function explainerHtml() {
  const steps = [
    ['undertaker', 'Bury', 'Everyone buries a coffin face down. Most hold Gold; one is your Curse.'],
    ['coin', 'Bury or challenge', 'On your turn, bury another, or say how many coffins you can open without a curse.'],
    ['magistrate', 'The bidding', 'Raise or pass. The highest bidder must dig.'],
    ['death', 'The dig', 'Open your own grave first, then the top coffins of others. A curse costs you a coffin.'],
    ['ward', 'Win', 'Win your clean digs, or be the last one with coffins.'],
  ];
  return `<section class="x-explain" data-key="cexplain"><div class="rule">${t('How Coffins works')}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${t(a)}</b><small>${t(b)}</small></span></li>`).join('')}</ol></section>`;
}

export function scoreboard(v) {
  const S = v.cScores ?? v.coffins?.scores ?? {};
  const list = v.players.map((p) => ({ p, s: S[p.id] ?? 0 })).sort((a, b) => b.s - a.s);
  if (!list.some((x) => x.s)) return '';
  const M = v.cMatch ?? v.coffins?.match;
  return `<section class="x-scores" data-key="cscores"><div class="rule">${t('Scores')}${M?.games > 1 ? ` · ${th('Game {n} of {m}', { n: Math.min(M.played + (v.phase === 'ENDED' ? 0 : 1), M.games), m: M.games })}` : ''}</div><ol class="ledger">${list.map(({ p, s }, i) => `<li data-key="cs-${p.id}"><span class="seat">${i + 1}</span><span class="who"><b>${esc(p.name)}</b></span><span class="tags"><span class="tag ${i === 0 ? 'solid' : ''}">${s}</span></span></li>`).join('')}</ol>
    <p class="small muted">${t('The winner +3, every clean dig +1, every rise +1.')}</p></section>`;
}

export function coffinsLobbyDeck(v, isHost, h) {
  const c = v.settings.c ?? {};
  const n = v.players.length;
  const row = (title, sub, control, shown) => `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
  const sw = (key, on) => `<input type="checkbox" class="switch" data-act-change="cSet" data-id="${key}" ${on ? 'checked' : ''}>`;
  const sel = (key, value, opts) => `<select class="input lang-select" data-act-change="cSet" data-id="${key}">${opts.map(([k, l]) => `<option value="${k}" ${String(value) === String(k) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const onOff = (on) => t(on ? 'On' : 'Off');
  const coffins = c.coffins ?? 4;
  const hand = `<div class="c-lobbyhand" data-key="clh">${Array.from({ length: coffins }, (_, i) => coffinCard(i === coffins - 1 ? 'C' : 'G', { key: `clh-${i}` })).join('')}</div>`;
  return `${explainerHtml()}
    <section class="lobby-deck" data-key="cdeck">
    <div class="rule">${t(n === 1 ? 'The table · {n} player' : 'The table · {n} players', { n })}</div>
    ${n >= 3 ? `<p class="small muted" data-key="ccount">${th('Each player: {g} Gold and one Curse.', { g: coffins - 1 })}</p>` : `<p class="small muted">${t('Seat 3 to 10 players.')}</p>`}
    ${hand}
    <div class="rule">${t('Winning')}</div>
    ${row(t('Clean digs to win'), t('Or be the last one with coffins.'), sel('toWin', c.toWin ?? 2, [[1, '1'], [2, '2'], [3, '3']]), String(c.toWin ?? 2))}
    ${row(t('Coffins per player'), t('5 makes a longer game.'), sel('coffins', coffins, [[4, t('4 (3 Gold, 1 Curse)')], [5, t('5 (4 Gold, 1 Curse)')]]), String(coffins))}
    ${row(t('Games per match'), t('Scores carry over between games.'), sel('games', c.games ?? 1, [[1, '1'], [3, '3'], [5, '5']]), String(c.games ?? 1))}
    <div class="rule">${t('Twists')}</div>
    ${row(t('Ghost wagers and Revenants'), t('Knocked-out players wager on every dig. Three right and they rise again.'), sw('wagers', c.wagers !== false), onOff(c.wagers !== false))}
    ${row(t('The Death coffin'), t('Each round one hidden player holds it. Dig it up, and they steal a coffin from you.'), sw('deathCoffin', c.deathCoffin !== false), onOff(c.deathCoffin !== false))}
    ${row(t('Relics'), t('Everyone gets a secret Lantern, Key or Ward, used once.'), sw('relics', !!c.relics), onOff(!!c.relics))}
    ${h.music ?? ''}
    ${scoreboard(v)}
  </section>`;
}

// ── End screen ─────────────────────────────────────────────────────────────
export function coffinsEndHtml(v) {
  const C = v.coffins;
  if (!C) return '';
  const back = v.deadline ? `<p class="center-text small muted" data-key="cback">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const hist = C.history ?? [];
  const bids = C.bids ?? [];
  // Who bluffed most: bids made with your own curse in your grave.
  const bluffs = {};
  for (const b of bids) if (b.curse) bluffs[b.pid] = (bluffs[b.pid] || 0) + 1;
  const top = Object.entries(bluffs).sort((a, b) => b[1] - a[1])[0];
  const outcome = (r) => (r.face === 'G' ? t('clean') : r.ward ? t('warded') : r.face === 'D' ? t('Death') : t('cursed'));
  const maxBid = Math.max(1, ...bids.map((b) => b.n));
  const rounds = [...new Set(bids.map((b) => b.round))];
  const graph = rounds.length ? `<section data-key="cgraph"><div class="rule">${t('The bidding, round by round')}</div><ol class="c-graph">${rounds.map((r) => {
    const rb = bids.filter((b) => b.round === r);
    const res = hist.find((x) => x.round === r);
    return `<li><span class="cg-r">${r}</span><span class="cg-bars">${rb.map((b) => `<i class="${b.curse ? 'bluff' : ''}" style="--h:${(b.n / maxBid) * 100}%" title="${esc(`${name(v, b.pid)}: ${b.n}`)}"><b>${b.n}</b></i>`).join('')}</span><small class="${res?.face === 'G' ? 'ok' : 'bad'}">${res ? outcome(res) : ''}</small></li>`;
  }).join('')}</ol><p class="small muted">${t('Red bars: bids made with a curse in the bidder\'s own grave.')}</p></section>` : '';
  const story = hist.length ? `<section data-key="chist"><div class="rule">${t('Every dig')}</div><ul class="ledger">${hist.map((r) => `<li><span class="seat">${r.round}</span><span class="who"><b>${esc(name(v, r.digger))} · ${r.n}</b><small>${r.opened.map((o) => (o.face === 'G' ? '●' : o.face === 'D' ? '☠' : '✕')).join(' ')} · ${esc(outcome(r))}${r.face === 'C' && r.owner !== r.digger ? ` · ${esc(name(v, r.owner))}` : ''}</small></span>
    <span class="tags">${r.death?.holder && C.deathOn ? `<span class="tag" title="${esc(t('The Death coffin'))}">${glyph('death')} ${esc(name(v, r.death.holder))}</span>` : ''}</span></li>`).join('')}</ul></section>` : '';
  return `${back}
    <section data-key="cfinal"><div class="rule">${t('Every coffin, face up')}</div>${graveyard(v, { reveal: true })}</section>
    ${top ? `<p class="c-award" data-key="caward">${glyph('jester')}<span><b>${t('Boldest bluffer')}</b><small>${th(top[1] === 1 ? '{a}: {n} bid with a curse at home' : '{a}: {n} bids with a curse at home', { a: name(v, top[0]), n: top[1] })}</small></span></p>` : ''}
    ${graph}${story}${scoreboard(v)}`;
}

// ── TV board ───────────────────────────────────────────────────────────────
export function coffinsBoard(v, h) {
  const { header } = h;
  const C = v.coffins;
  if (!C) return '';
  let now = '';
  switch (v.phase) {
    case 'C_LOTTERY': now = t('The lots are drawn…'); break;
    case 'C_BURY': now = `${th('Round {n}: everyone buries a coffin.', { n: C.round })} <b>${th('{done}/{total} buried', { done: v.progress?.done ?? 0, total: v.progress?.total ?? 0 })}</b>`; break;
    case 'C_TURN': now = th('{a}: bury another, or challenge?', { a: name(v, C.turn) }); break;
    case 'C_BID': now = `${th('{a}: raise above {n}, or pass?', { a: name(v, C.turn), n: C.bid.n })}`; break;
    case 'C_WAGER': now = `${th('The ghosts wager on {a}\'s dig.', { a: name(v, C.digger) })} <b>${th('{done}/{total} wagers in', { done: v.progress?.done ?? 0, total: v.progress?.total ?? 0 })}</b>`; break;
    case 'C_DIG': now = th('{a} digs: {k} of {n} opened.', { a: name(v, C.digger), k: C.opened.length, n: C.target }); break;
    case 'C_LOSE': now = th('{a} chooses a coffin to lose.', { a: name(v, C.digger) }); break;
    case 'ENDED': now = th('{a} wins.', { a: name(v, C.winner) }); break;
    default: break;
  }
  const ended = v.phase === 'ENDED';
  const backdrop = v.table?.backdrops !== false && C.where >= 0 ? backdropHtml(C.where, true) : '';
  const legend = `<div class="c-legend" data-key="clegend"><span>${coffinCard('G')}<small>${t('Gold')}</small></span><span>${coffinCard('C')}<small>${t('Cursed')}</small></span>${C.deathOn ? `<span>${coffinCard('D')}<small>${t('Death')}</small></span>` : ''}</div>`;
  return `<main class="board2 cboard ${ended ? 'is-ended' : ''} ${backdrop ? 'has-backdrop' : ''}" data-key="board-c">${backdrop}${header}
    <div class="c-cols">
      <section class="c-main">${graveyard(v, { big: true, reveal: ended })}<p class="b-now ${['C_DIG', 'C_LOSE'].includes(v.phase) ? 'blood' : ''}" data-key="cnow">${now}</p></section>
      <aside class="c-side">${tower(v, true)}<p class="c-goal" data-key="cgoal">${th(C.toWin === 1 ? 'One clean dig wins.' : '{n} clean digs win.', { n: C.toWin })}<br><span class="small muted">${t('Or be the last one with coffins.')}</span></p>${legend}${scoreboard(v)}</aside>
    </div></main>`;
}
