// Dead Set: Carnival — the masked ball: phone screens, moments, the TV ballroom.
// Built from the Codex pieces (design/codex/DESIGN-GUIDE.md): the astrolabe
// table and struck medallions, arcana cards for the masks (lattice backs face
// down), vellum slips, gilt frames, wax holds and stamps. Pure renderers over
// the filtered view; the shell (app.js) passes its helpers in `h`.
//
// Privacy: Swap and Pretend are the same wax button with a different word;
// every phone answers every challenge; what a look shows is only ever on the
// looker's own phone.
import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { cardArt, roleNumber } from './cards.js';
import { t, th, tmh, roleF, entryMsg } from './i18n.js';
import { avatarSvg } from './avatar.js';
import { backdropHtml } from './backdrops.js';
import { seatLayout } from './layout.js';

export const isCarnivalPhase = (ph) => typeof ph === 'string' && ph.startsWith('K_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isChair = (id) => typeof id === 'string' && id.startsWith('chair');
const pname = (v, id) => (isChair(id) ? t('An empty chair') : v.players.find((p) => p.id === id)?.name ?? t('Someone'));
const roleName = (id) => roleF(id, 'name');

// ── The masks ──────────────────────────────────────────────────────────────
export const MASKS = ['DEATH', 'CONSPIRATOR', 'DIPLOMAT', 'MAGISTRATE', 'GAMBLER', 'RIPPER', 'BARD', 'GUARDIAN', 'MENTALIST', 'ORACLE', 'WITCH', 'DOUBLE_AGENT', 'MIMIC', 'JESTER', 'SCAPEGOAT', 'INNOCENT'];
const EMB = { DOUBLE_AGENT: 'double' };
const embOf = (id) => EMB[id] ?? id.toLowerCase();
/** Each mask's own ink: muted, of a similar weight, so cards read at a glance (and none outshines another). */
export const MASK_INK = {
  DEATH: '#9c1c22', CONSPIRATOR: '#6a2f86', DIPLOMAT: '#2f7a62', MAGISTRATE: '#34508f', GAMBLER: '#b37a1c', RIPPER: '#7a1838',
  BARD: '#c0602a', GUARDIAN: '#2c6aa0', MENTALIST: '#7656b0', ORACLE: '#1c8088', WITCH: '#467a2a', DOUBLE_AGENT: '#5b5f66',
  MIMIC: '#a03f86', JESTER: '#a8902a', SCAPEGOAT: '#85603a', INNOCENT: '#6f8796',
};
const ink = (id) => (MASK_INK[id] ? `--mk:${MASK_INK[id]}` : '');
/** What each mask does when claimed (CARNIVAL.md §4). */
export const POWER = {
  DEATH: 'Take 2 Souls from a player of your choice. They count toward your Harvest.',
  CONSPIRATOR: 'Take 3 Souls.',
  DIPLOMAT: 'Take 2 Souls.',
  MAGISTRATE: 'Take everything in the Offering.',
  GAMBLER: 'Toss the coin. Heads: take 3 Souls. Tails: pay 1 into the Offering.',
  RIPPER: 'Take 1 Soul from each neighbour.',
  BARD: 'You and both neighbours take 1 Soul each.',
  GUARDIAN: 'Take 1 Soul. Until your next turn, nobody can take Souls from you.',
  MENTALIST: 'Look at one other mask. Nobody learns whose.',
  ORACLE: 'Look at two other masks. Everyone sees whose; only you see what.',
  WITCH: 'Swap or pretend to swap two other masks, in secret.',
  DOUBLE_AGENT: 'Swap your mask for real with another, then look at your new one.',
  MIMIC: 'Use the power of the mask claimed in the turn before yours. None? Take 1 Soul.',
  JESTER: 'Name a player and a mask. Right: they pay you 2 Souls. Wrong: pay 1 into the Offering.',
  SCAPEGOAT: 'A player of your choice pays 2 Souls into the Offering.',
  INNOCENT: 'Take 1 Soul.',
};

// ── The rune system: every power as a short line of pictograms ────────────
// soul (coin) · offering (the gift) · harvest (scythe) · pick (a player you
// choose) · nbr (your two neighbours) · you · eye (look) · hid (nobody learns
// whose) · swap · shield · coin (toss) · copy · guess · to (goes to).
const ICO = {
  pick: '<circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="3.2"/><path d="M16 3v5M16 24v5M3 16h5M24 16h5"/>',
  nbr: '<circle cx="16" cy="16" r="4.2"/><circle cx="5.5" cy="16" r="3.4"/><circle cx="26.5" cy="16" r="3.4"/><path d="M10 22c2 2.6 10 2.6 12 0"/>',
  you: '<circle cx="16" cy="11" r="5"/><path d="M6.5 27c1.4-5.6 5-8.4 9.5-8.4s8.1 2.8 9.5 8.4"/>',
  eye: '<path d="M3 16c4-6.5 8.5-9.5 13-9.5s9 3 13 9.5c-4 6.5-8.5 9.5-13 9.5S7 22.5 3 16z"/><circle cx="16" cy="16" r="4.4"/>',
  hid: '<path d="M3 15c4 5.6 8.5 8.4 13 8.4s9-2.8 13-8.4"/><path d="M7 20.5l-2 3M12 22.6l-1 3.4M20 22.6l1 3.4M25 20.5l2 3"/>',
  swap: '<path d="M6 11h17l-4-4M26 21H9l4 4"/>',
  shield: '<path d="M16 4l10 3.5v8c0 6.5-4.5 10.5-10 12.5-5.5-2-10-6-10-12.5v-8z"/><path d="M11.5 16l3.2 3.2 6-6.4"/>',
  coin: '<circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6.4" stroke-dasharray="2 2"/><path d="M27 7.5a14 14 0 0 1 2 6.5M5 24.5A14 14 0 0 1 3 18"/>',
  copy: '<rect x="5" y="8" width="13" height="18" rx="1.6"/><rect x="13" y="5" width="13" height="18" rx="1.6"/>',
  guess: '<circle cx="16" cy="16" r="12"/><path d="M12.4 12.6a3.8 3.8 0 1 1 5.6 3.4c-1.4.8-2 1.6-2 3.2"/><circle cx="16" cy="23" r=".9" fill="currentColor"/>',
  to: '<path d="M5 16h20M19 10l6 6-6 6"/>',
  harvest: '<path d="M8 28L21 6"/><path d="M21 6c-6.5-1-13 1.5-16 6.5 5-2.5 10-3.4 14.4-2.4"/>',
  or: '<path d="M12 27L20 5"/>',
};
const ico = (k) => (k === 'soul' ? emblem('coin', { cls: 'kr-em' }) : k === 'offering' ? emblem('gift', { cls: 'kr-em' })
  : `<svg class="kr-ic" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`);
const RUNES = {
  DEATH: [['pick'], ['soul', '−2'], ['to'], ['you'], ['harvest', '+2']],
  CONSPIRATOR: [['soul', '+3']],
  DIPLOMAT: [['soul', '+2']],
  MAGISTRATE: [['offering'], ['to'], ['you']],
  GAMBLER: [['coin'], ['soul', '+3'], ['or'], ['offering', '−1']],
  RIPPER: [['nbr'], ['soul', '−1'], ['to'], ['you']],
  BARD: [['you'], ['nbr'], ['soul', '+1']],
  GUARDIAN: [['soul', '+1'], ['shield']],
  MENTALIST: [['eye', '1'], ['hid']],
  ORACLE: [['eye', '2']],
  WITCH: [['swap', '2'], ['hid']],
  DOUBLE_AGENT: [['swap'], ['eye']],
  MIMIC: [['copy']],
  JESTER: [['guess'], ['soul', '+2'], ['or'], ['offering', '−1']],
  SCAPEGOAT: [['pick'], ['offering', '−2']],
  INNOCENT: [['soul', '+1']],
};
export function runes(id, cls = '') {
  return `<span class="krunes ${cls}" aria-hidden="true">${(RUNES[id] ?? []).map(([k, n]) => (k === 'to' || k === 'or'
    ? `<i class="kr-sep">${ico(k)}</i>` : `<i class="kr k-${k}">${ico(k)}${n ? `<b>${esc(n)}</b>` : ''}</i>`)).join('')}</span>`;
}
const LEGEND = [['soul', 'Souls'], ['offering', 'The Offering'], ['harvest', 'Harvest'], ['pick', 'A player you choose'], ['nbr', 'Your neighbours'], ['you', 'You'],
  ['eye', 'Look at a mask'], ['hid', 'Nobody learns whose'], ['swap', 'Swap masks'], ['shield', 'Shielded until your next turn'], ['coin', 'Coin toss'], ['copy', 'Copy the last claim'], ['guess', 'Name a player and a mask']];

/** A mask as an arcana card: face up, or the common lattice back. */
export function maskCard(id, { back = false, cls = '', act = '', sel = false, key = '', badge = '' } = {}) {
  const tag = act ? 'button' : 'span';
  const attrs = `${act ? `data-act="${act}" data-id="${id}" aria-pressed="${sel}"` : ''} ${key ? `data-key="${key}"` : ''}`;
  if (back || !id) return `<${tag} class="tarot back kcard ${cls}" ${attrs} aria-label="${esc(t('A mask, face down'))}"><span class="sig">DS</span>${badge}</${tag}>`;
  return `<${tag} class="tarot kcard ${id === 'DEATH' ? 'rubric' : ''} ${sel ? 'sel' : ''} ${cls}" style="${ink(id)}" ${attrs} aria-label="${esc(roleName(id))}">
    <span class="arc-num">${esc(roleNumber({ id }, t))}</span>${cardArt(embOf(id))}<span class="nm">${esc(roleName(id))}</span>${badge}</${tag}>`;
}

// ── The ballroom: the astrolabe table, with a mask at every seat ──────────
/**
 * `pick` = { ids, act, selected: [] } makes seats tappable; `open` shows the
 * masks face up (the unmasking, the end); `marks` adds a badge per seat.
 */
export function ballroom(v, { pick = null, open = false, center = '', marks = {}, big = false } = {}) {
  const K = v.carnival;
  const seats = K.seats;
  const { pos, tok, dense } = seatLayout(seats.length);
  const can = new Set(pick?.ids ?? []);
  const sel = new Set((pick?.selected ?? []).filter(Boolean));
  const meId = v.me?.id;
  const out = seats.map((s, i) => {
    const p = v.players.find((x) => x.id === s.id);
    const x = pos[i].x.toFixed(2);
    const y = pos[i].y.toFixed(2);
    const selectable = can.has(s.id);
    const cls = ['tok', 'kseat', s.chair ? 'chair' : '', s.id === meId ? 'me' : '', selectable ? 'can' : pick ? 'mute' : '', sel.has(s.id) ? 'sel' : '',
      K.turn === s.id && ['K_TURN', 'K_CHALLENGE', 'K_POWER'].includes(v.phase) ? 'speaking' : '', p && p.connected === false ? 'away' : '', pos[i].inner ? 'inner' : ''].filter(Boolean).join(' ');
    const face = open && s.mask;
    // Face up (the unmasking, the end): the medallion becomes the mask, its name beneath.
    const inner = face ? `<span class="k-face ${s.mask === 'DEATH' ? 'rubric' : ''}" style="${ink(s.mask)}">${emblem(embOf(s.mask))}</span>`
      : s.chair ? `<span class="k-chair">${emblem('s_chair')}</span>` : p?.avatar ? avatarSvg(p.avatar, 'tok-av') : `<span class="tok-ini">${esc((p?.name ?? '?').slice(0, 1))}</span>`;
    const badges = [];
    if (!s.chair) badges.push(`<b class="bdg k-soul" data-key="ks-${s.souls}" title="${esc(t('Souls'))}">${s.souls}</b>`);
    if (s.shield) badges.push(`<b class="bdg k-shield" data-key="ksh">${ico('shield')}</b>`);
    if (marks[s.id]) badges.push(`<b class="bdg b-mark" data-key="mark">${marks[s.id]}</b>`);
    const mask = face ? `<span class="k-maskname" style="${ink(s.mask)}" data-key="kmn-${s.mask}">${esc(roleName(s.mask))}</span>` : `<span class="kmask" data-key="km-x">${maskCard(null)}</span>`;
    const label = `${pname(v, s.id)}${sel.has(s.id) ? `, ${t('selected')}` : ''}`;
    return `<button type="button" class="${cls}" data-key="tok-${s.id}" style="left:${x}%;top:${y}%" ${selectable ? `data-act="${pick.act}" data-id="${s.id}"` : 'tabindex="-1"'} aria-pressed="${sel.has(s.id)}" aria-label="${esc(label)}">
      <span class="tok-disc">${inner}${badges.join('')}</span>${face ? '' : mask}<span class="tok-name">${esc(s.chair ? t('Empty chair') : p?.name ?? '?')}</span>${face ? mask : ''}</button>`;
  }).join('');
  const orbit = dense ? 0 : (50 - Math.hypot(pos[0].x - 50, pos[0].y - 50)).toFixed(2);
  return `<div class="ring-wrap kball ${big ? 'big' : ''} ${open ? 'open' : ''}" data-key="ring-wrap"><div class="ring ${dense ? 'dense' : ''} ${tok < 44 ? 'small-tok' : ''} ${pick ? 'picking' : ''}" style="--tok:${tok}px;--orbit:${orbit}%" data-key="ring">
    <svg class="ring-fuse off" viewBox="0 0 100 100" data-ringfuse aria-hidden="true"><circle class="track" cx="50" cy="50" r="49"/><circle class="burn" cx="50" cy="50" r="49" pathLength="100"/></svg>
    <div class="ring-table" aria-hidden="true"></div>
    ${out}
    <div class="ring-center" data-key="center">${center || offering(v)}</div>
  </div></div>`;
}
/** The collection plate in the middle of the table. */
function offering(v) {
  const K = v.carnival;
  return `<div class="k-plate" data-key="kplate"><span class="kp-em">${emblem('gift')}</span><b class="kp-n" data-key="kp-${K.offering}">${K.offering}</b><span class="kp-l">${t('The Offering')}</span><span class="c-clock clock" data-clock></span></div>`;
}

/** Your purse: Souls toward the target, the Harvest, a shield. */
function purse(v) {
  const K = v.carnival;
  const me = K.seats.find((s) => s.id === v.me?.id);
  if (!me) return '';
  return `<div class="k-purse" data-key="kpurse">
    <span class="kp"><i>${emblem('coin')}</i><b data-key="kps-${me.souls}">${me.souls}</b><small>${th('of {n} Souls', { n: K.target })}</small></span>
    ${K.harvestTarget ? `<span class="kp harvest"><i>${ico('harvest')}</i><b>${me.harvest}</b><small>${th('of {n} Harvest', { n: K.harvestTarget })}</small></span>` : ''}
    ${me.shield ? `<span class="kp shield"><i>${ico('shield')}</i><small>${t('Shielded')}</small></span>` : ''}
  </div>`;
}

/** The slip that says what is happening. */
const slip = (kicker, title, sub = '', cls = '') => `<div class="k-slip ${cls} rise-in" data-key="kslip-${esc(kicker).slice(0, 18)}"><span class="kicker">${kicker}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;


// ── Phone: main screen ─────────────────────────────────────────────────────
export function carnivalMain(v, me, h) {
  const { S, head } = h;
  const K = v.carnival;
  if (!K) return head(v);
  if (S.sel.kphase !== v.phaseId) { S.sel.kphase = v.phaseId; S.sel.kseat = []; S.sel.kmask = null; if (v.action?.type !== 'kturn') S.ui.kmode = null; }
  const a = v.action || {};
  const turnName = pname(v, K.turn);
  let stage = '';
  let pick = null;
  let open = false;
  let below = '';
  switch (v.phase) {
    case 'K_UNMASK':
      open = true;
      stage = slip(t('The unmasking'), t('Remember every mask'), t('For a moment every mask is shown. Then they turn face down, and the dancing begins.'));
      break;
    case 'K_LOTTERY':
      stage = slip(t('The masks turn face down'), t('Who dances first?'));
      break;
    case 'K_TURN':
      if (a.type === 'kturn') {
        const mode = a.forced ? 'swap' : S.ui.kmode;
        const seg = a.forced ? '' : `<div class="seg kseg" role="group" data-key="kseg">${['swap', 'peek', 'claim'].map((k) => `<button data-act="kMode" data-id="${k}" aria-pressed="${mode === k}">${t({ swap: 'Swap or pretend', peek: 'Peek', claim: 'Claim' }[k])}</button>`).join('')}</div>`;
        const sub = a.forced ? th(a.forced > 1 ? 'The opening dance: {n} more turns of Swap or pretend.' : 'The opening dance: your first turn is Swap or pretend.', { n: a.forced })
          : mode === 'swap' ? t('Pick a mask to dance with. Then hold Swap or Pretend: nobody will know which.')
            : mode === 'peek' ? t('Lift your own mask for a moment. Everyone sees that you looked, not what you saw.')
              : mode === 'claim' ? t('Name a mask. If nobody challenges, you use its power, whatever you wear.')
                : t('Swap or pretend, peek at your own mask, or claim a mask and use its power.');
        stage = `${slip(t('Your turn'), t('The ball is yours'), sub, 'me')}${seg}`;
        if (mode === 'swap') pick = { ids: a.targets, act: 'kPickSeat', selected: S.sel.kseat };
        if (mode === 'claim') below = `<div class="k-claimgrid" data-key="kcg">${a.masks.map((id) => `<div class="kcg-cell">${maskCard(id, { act: 'kPickMask', sel: S.sel.kmask === id, key: `kc-${id}`, cls: 'noname' })}<b class="kcg-n">${esc(roleName(id))}</b>${runes(id, 'sm')}</div>`).join('')}</div>`;
      } else {
        stage = slip(t('The dance goes on'), th('{a}\'s turn', { a: turnName }), t('Swap or pretend, peek, or claim?'));
      }
      break;
    case 'K_CHALLENGE':
      if (a.type === 'kanswer') {
        stage = `<div class="k-claim" data-key="kclaim-${a.mask}"><span class="kicker">${th('{a} claims', { a: pname(v, a.by) })}</span>
          ${maskCard(a.mask, { cls: 'big' })}${runes(a.mask)}
          <h2>${a.answer ? t(a.answer === 'mine' ? 'You said: That\'s mine!' : 'You let it pass.') : t('Is that your mask?')}</h2>
          <p class="small muted">${a.answer ? th('{done}/{total} have answered', v.progress ?? { done: 0, total: 0 }) : th('Challenge only if you think you wear the {role}. Wrong, and you pay {n} into the Offering.', { role: roleName(a.mask), n: K.penalty })}</p></div>`;
      } else {
        stage = `<div class="k-claim" data-key="kclaim-me"><span class="kicker">${t('Your claim')}</span>${maskCard(K.claim.mask, { cls: 'big' })}<h2>${t('The ball is answering…')}</h2><p class="small muted">${th('{done}/{total} have answered', v.progress ?? { done: 0, total: 0 })}</p></div>`;
      }
      break;
    case 'K_POWER':
      if (a.type === 'kpower') {
        const two = a.two;
        stage = slip(th('The {role}', { role: roleName(a.mask) }), t(two ? 'Choose two masks' : a.mask === 'JESTER' ? 'Name a player and a mask' : a.targets.some(isChair) ? 'Choose a mask' : 'Choose a player'), t(POWER[a.mask]), 'me');
        pick = { ids: a.targets, act: 'kPickSeat', selected: S.sel.kseat };
        if (a.mask === 'JESTER') below = `<div class="k-claimgrid" data-key="kjg">${a.masks.map((id) => `<div class="kcg-cell">${maskCard(id, { act: 'kPickMask', sel: S.sel.kmask === id, key: `kj-${id}`, cls: 'noname' })}<b class="kcg-n">${esc(roleName(id))}</b></div>`).join('')}</div>`;
      } else {
        stage = slip(th('{a} wears the power', { a: pname(v, K.power?.user) }), th('The {role}', { role: roleName(K.power?.mask) }), t(POWER[K.power?.mask] ?? ''));
      }
      break;
    case 'K_LOOK':
      if (a.type === 'klook') {
        // Only on the looker's phone: the card(s), until they are done reading.
        const title = a.kind === 'peek' ? t('Your mask') : a.kind === 'DOUBLE_AGENT' ? t('Your new mask') : t(a.looks.length > 1 ? 'The masks you read' : 'The mask you read');
        stage = `<div class="k-look rise-in" data-key="klook-${v.phaseId}"><span class="kicker">${esc(title)}</span>
          <div class="kl-cards">${a.looks.map((x) => `<figure class="kl-c">${maskCard(x.mask, { cls: 'big' })}<figcaption><b>${esc(roleName(x.mask))}</b>${x.seat === v.me.id ? '' : `<small>${esc(pname(v, x.seat))}</small>`}</figcaption></figure>`).join('')}</div>
          <p class="small muted">${t('Only you see this. Remember it.')}</p></div>`;
        return `${head(v)}${stage}${h.chips(v)}`;
      }
      stage = slip(t('A moment'), K.look?.kind === 'peek' ? th('{a} lifts their mask…', { a: pname(v, K.look?.pid) }) : th('{a} reads the masks…', { a: pname(v, K.look?.pid) }), t('The ball waits until they are done.'));
      break;
    default: break;
  }
  return `${head(v)}${stage}${ballroom(v, { pick, open })}${purse(v)}${below}${h.chips(v)}`;
}

// ── Phone: the dock ────────────────────────────────────────────────────────
export function carnivalDock(v, h) {
  const { S, holdBtn, rawName } = h;
  const a = v.action || {};
  const parts = [];
  const note = (txt) => `<span class="dock-note" data-key="kdn">${txt}</span>`;
  const seat = S.sel.kseat?.[0];
  switch (a.type) {
    case 'kturn': {
      const mode = a.forced ? 'swap' : S.ui.kmode;
      if (mode === 'swap') {
        if (!seat) { parts.push(note(t('Pick a mask to dance with'))); break; }
        // Two identical wax buttons: only the word differs.
        parts.push(holdBtn('kSwapFake', t('Hold: Pretend'), 'btn-blood k-twin', { key: 'k-twin-a' }));
        parts.push(holdBtn('kSwapReal', t('Hold: Swap'), 'btn-blood k-twin', { key: 'k-twin-b' }));
      } else if (mode === 'peek') parts.push(holdBtn('kPeek', t('Hold to lift your mask'), 'btn-blood'));
      else if (mode === 'claim') parts.push(S.sel.kmask ? holdBtn('kClaim', th('Hold to claim the {role}', { role: roleName(S.sel.kmask) }), 'btn-blood') : note(t('Choose the mask you claim')));
      else parts.push(note(t('Choose what to do')));
      break;
    }
    case 'klook':
      parts.push(`<button class="btn btn-solid" data-act="kDone" data-key="d-kdone">${t('I have seen it')}</button>`);
      break;
    case 'kanswer':
      if (!a.answer) {
        parts.push(holdBtn('kPass', t('Hold: Let it pass'), 'btn-solid k-twin', { key: 'k-ans-a' }));
        parts.push(holdBtn('kMine', t('Hold: That\'s mine!'), 'btn-blood k-twin', { key: 'k-ans-b' }));
      }
      break;
    case 'kpower': {
      const sel = S.sel.kseat ?? [];
      if (a.two) {
        if (sel.length < 2) { parts.push(note(th('Choose two masks · {n}/2', { n: sel.length }))); break; }
        if (a.real) {
          parts.push(holdBtn('kWitchFake', t('Hold: Pretend'), 'btn-blood k-twin', { key: 'k-twin-a' }));
          parts.push(holdBtn('kWitchReal', t('Hold: Swap'), 'btn-blood k-twin', { key: 'k-twin-b' }));
        } else parts.push(holdBtn('kPower', t('Hold to look'), 'btn-blood'));
        break;
      }
      if (a.mask === 'JESTER' && !(seat && S.sel.kmask)) { parts.push(note(t('Choose a player and a mask'))); break; }
      if (!seat) { parts.push(note(t('Choose on the table'))); break; }
      parts.push(holdBtn('kPower', a.mask === 'JESTER' ? th('Hold: {name} is the {role}', { name: rawName(seat), role: roleName(S.sel.kmask) }) : th('Hold to choose {name}', { name: isChair(seat) ? t('the empty chair') : rawName(seat) }), 'btn-blood'));
      break;
    }
    default: break;
  }
  return parts;
}

// ── Actions ────────────────────────────────────────────────────────────────
export function carnivalActs(h) {
  const { S, V, send, render, burstAt, sound, haptic } = h;
  const clear = () => { S.sel.kseat = []; S.sel.kmask = null; S.ui.kmode = null; };
  return {
    kMode(el) { S.ui.kmode = el.dataset.id; S.sel.kseat = []; S.sel.kmask = null; haptic(8); render(); },
    kPickSeat(el) {
      const a = V().action;
      const id = el.dataset.id;
      const cur = S.sel.kseat ?? [];
      if (a?.two) S.sel.kseat = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-2);
      else S.sel.kseat = cur[0] === id ? [] : [id];
      haptic(8); render();
    },
    kPickMask(el) { S.sel.kmask = S.sel.kmask === el.dataset.id ? null : el.dataset.id; haptic(8); render(); },
    async kSwapReal(el) { if (await send('k.swap', { target: S.sel.kseat[0], real: true })) { clear(); burstAt(el); } },
    async kSwapFake(el) { if (await send('k.swap', { target: S.sel.kseat[0], real: false })) { clear(); burstAt(el); } },
    async kPeek() { if (await send('k.peek', {})) clear(); },
    async kClaim(el) { if (await send('k.claim', { mask: S.sel.kmask })) { clear(); sound.play('stamp'); burstAt(el, { colors: ['#c9a35a', '#ecd28f'] }); } },
    async kMine(el) { if (await send('k.answer', { mine: true })) burstAt(el, { colors: ['#9c1c22', '#ece5d5'] }); },
    async kPass() { await send('k.answer', { mine: false }); },
    async kDone() { await send('k.done', {}); },
    async kPower() { const a = V().action; const sel = S.sel.kseat ?? []; if (await send('k.power', a.two ? { targets: sel } : { target: sel[0], mask: S.sel.kmask })) clear(); },
    async kWitchReal() { if (await send('k.power', { targets: S.sel.kseat, real: true })) clear(); },
    async kWitchFake() { if (await send('k.power', { targets: S.sel.kseat, real: false })) clear(); },
    kSet(el) {
      const key = el.dataset.id;
      const val = el.type === 'checkbox' ? el.checked : key === 'masks' ? el.value : Number(el.value);
      const patch = { [key]: val };
      // Going custom starts from the masks the table would play now.
      if (key === 'masks' && val === 'custom') patch.pool = Object.entries(V().setup?.publicDeck?.exact ?? {}).flatMap(([id, n]) => Array(n).fill(id));
      send('host.settings', { k: patch }, { quiet: true });
    },
    kPoolStep(el) {
      const pool = [...(V().settings.k?.pool ?? [])];
      const id = el.dataset.id;
      if (Number(el.dataset.d) > 0) pool.push(id); else { const i = pool.lastIndexOf(id); if (i >= 0) pool.splice(i, 1); }
      haptic(6);
      send('host.settings', { k: { pool } }, { quiet: true });
    },
    kPool(el) {
      const k = V().settings.k ?? {};
      const pool = new Set(k.pool?.length ? k.pool : []);
      if (pool.has(el.dataset.id)) pool.delete(el.dataset.id); else pool.add(el.dataset.id);
      send('host.settings', { k: { pool: MASKS.filter((x) => pool.has(x)) } }, { quiet: true });
    },
  };
}
export const CARNIVAL_QUIET = ['kMode', 'kPickSeat', 'kPickMask'];

// ── The reference sheet: every mask at this ball ──────────────────────────
export function masksSheet(v) {
  const K = v.carnival;
  const deck = K?.deck ?? (v.setup?.publicDeck?.exact ? Object.entries(v.setup.publicDeck.exact).map(([id, n]) => ({ id, n })) : []);
  return `<div class="k-ref" data-key="kref">
    <p class="small muted">${t('Claim any of these. Each power works whether or not you really wear the mask, unless someone challenges.')}</p>
    <ul class="k-reflist">${deck.map(({ id, n }) => `<li data-key="kr-${id}">${maskCard(id, { cls: 'thumb' })}<div><b>${esc(roleName(id))}${n > 1 ? ` <small>×${n}</small>` : ''}</b>${runes(id)}<p>${esc(t(POWER[id]))}</p></div></li>`).join('')}</ul>
    <div class="orn"><span class="kicker">${t('The signs')}</span></div>
    <ul class="k-legend">${LEGEND.map(([k, l]) => `<li><i class="kr k-${k}">${ico(k)}</i><span>${t(l)}</span></li>`).join('')}</ul>
  </div>`;
}

// ── Moments ────────────────────────────────────────────────────────────────
export function carnivalMoment(l, v, fresh, { notify, name: nm, sound }) {
  switch (l.ev) {
    case 'k-unmask': {
      // The ceremony: every seat's mask, one at a time, with what it does; then the whole table.
      const order = l.order ?? Object.keys(l.masks ?? {});
      return order.map((id, i) => ({ type: 'kintro', seat: id, name: pname(v, id), chair: isChair(id), av: v.players.find((p) => p.id === id)?.avatar ?? null,
        mask: l.masks[id], i: i + 1, n: order.length, sound: i === 0 ? 'unfold' : 'flip' }));
    }
    case 'k-lottery': {
      const order = l.order.map((id) => ({ id, name: nm(id), av: v.players.find((p) => p.id === id)?.avatar ?? null }));
      return { type: 'mlottery', order, leader: l.leader, leaderName: nm(l.leader), idx: l.order.indexOf(l.leader), spins: l.spins ?? 2, sound: null,
        kickerText: t('Before the first turn'), titleText: t('Who dances first?'), resultText: '{name} dances first' };
    }
    case 'k-swap': return { type: 'kswap', by: nm(l.by), a: pname(v, l.a), b: pname(v, l.b), witch: !!l.power, sound: 'whoosh' };
    case 'k-peek': notify(t('{a} lifts their mask for a moment.', { a: nm(l.by) })); return null;
    case 'k-claim': return { type: 'kclaim', by: nm(l.by), mask: l.mask, sound: 'stamp' };
    case 'k-unchallenged': notify(t('Nobody challenges. {a} uses the {role}.', { a: nm(l.by), role: roleName(l.mask) })); return null;
    case 'k-reveal': return { type: 'kreveal', mask: l.mask, by: l.by, rows: Object.entries(l.reveal).map(([id, mask]) => ({ id, name: nm(id), mask, holder: l.holders.includes(id), paid: l.paid?.[id] ?? 0 })), count: Object.keys(l.reveal).length, sound: 'flip' };
    case 'k-mimic': notify(t('{a} mimics the {role}.', { a: nm(l.user), role: roleName(l.mask) })); return null;
    case 'k-powerpick': notify(t('{a} uses the {role}…', { a: nm(l.user), role: roleName(l.mask) })); return null;
    case 'k-power': return { type: 'kpower', mask: l.mask, user: nm(l.user), msg: entryMsg(l), coin: l.coin ?? null, gain: l.gain ?? 0, sound: l.coin === 'tails' || (l.gain ?? 0) < 0 ? 'badCard' : 'goodCard' };
    default: return null;
  }
}
/** Private: a look (your peek, the Mentalist, the Oracle, the Double Agent), on your phone only, silently. */
export function lookMoments(freshPriv, v) {
  return freshPriv.filter((x) => x.kind === 'look' && x.mask).map((x) => ({ type: 'klook', mask: x.mask, whose: x.seat === v.me?.id ? null : pname(v, x.seat), tapOnly: true, sound: null }));
}
export const K_MOMENT_TIME = { kintro: 3400, kswap: 3400, kclaim: 3200, kreveal: 7000, kpower: 4400 };

export function carnivalMomentHtml(m, h) {
  const { letters } = h;
  switch (m.type) {
    case 'kintro':
      return `<span class="kicker">${esc(t('The unmasking'))} · ${esc(t('{i} of {n}', { i: m.i, n: m.n }))}</span>
        <div class="ki-who"><span class="ki-med">${m.chair ? emblem('s_chair') : m.av ? avatarSvg(m.av, 'ki-av') : `<b>${esc(m.name.slice(0, 1))}</b>`}</span><b class="ki-name">${esc(m.name)}</b></div>
        <div class="k-claimcard ki-card">${maskCard(m.mask, { cls: 'big' })}</div>
        <h1 class="m-title" style="${ink(m.mask)}">${letters(roleName(m.mask))}</h1>
        ${runes(m.mask)}<p class="m-sub ki-pow">${esc(t(POWER[m.mask]))}</p>`;
    case 'kswap':
      return `<span class="kicker">${esc(m.witch ? t('The Witch\'s hands') : t('A dance under the cloak'))}</span><h1 class="m-title">${letters(m.witch ? `${m.a} · ${m.b}` : `${m.by} · ${m.b}`)}</h1>
        <div class="k-dance" aria-hidden="true"><span class="kd a">${maskCard(null)}</span><span class="kd b">${maskCard(null)}</span><span class="k-cloak"></span></div>
        <p class="m-sub">${esc(t('Swapped, or only pretended? Nobody knows.'))}</p>`;
    case 'kclaim':
      return `<span class="kicker">${esc(t('{a} claims', { a: m.by }))}</span><div class="k-claimcard">${maskCard(m.mask, { cls: 'big' })}</div>
        <h1 class="m-title">${letters(t('I am the {role}', { role: roleName(m.mask) }))}</h1>${runes(m.mask)}`;
    case 'kreveal': {
      const rows = m.rows.map((r, i) => `<li style="--d:${0.4 + i * 0.7}s" class="${r.holder ? 'true' : 'false'}"><span class="kr-card">${maskCard(r.mask, { cls: 'noname' })}</span><em class="kr-mask">${esc(roleName(r.mask))}</em><b>${esc(r.name)}</b>
        ${r.holder ? `<span class="c-stamp win">${esc(t('True'))}</span>` : `<span class="c-stamp loss">${esc(t('−{n} Soul', { n: r.paid }))}</span>`}</li>`).join('');
      return `<span class="kicker">${esc(t('The masks are lifted'))}</span><h1 class="m-title">${letters(t('The {role}?', { role: roleName(m.mask) }))}</h1><ol class="k-reveal">${rows}</ol>`;
    }
    case 'kpower': {
      const coin = m.coin ? `<div class="coin-stage k-coinstage"><div class="coin lands-${m.coin === 'heads' ? 0 : 1}"><div class="coin-face heads k-coin" aria-label="${esc(t('Heads'))}"><span class="kc-skull">${emblem('death')}</span></div><div class="coin-face tails k-coin" aria-label="${esc(t('Tails'))}"><span class="kc-ds">DS</span></div></div><div class="coin-shadow"></div></div>` : '';
      return `<div class="m-art k-sting">${emblem(embOf(m.mask), { rays: true })}</div><span class="kicker">${esc(t('The {role}', { role: roleName(m.mask) }))}</span>
        ${coin}<h1 class="m-title">${letters(m.user)}</h1><p class="m-sub">${tmh(m.msg)}</p>`;
    }
    case 'klook':
      return `<span class="kicker">${esc(m.whose ? t('The mask of {a}', { a: m.whose }) : t('Your mask'))}</span><div class="k-claimcard">${maskCard(m.mask, { cls: 'big' })}</div>
        <h1 class="m-title">${letters(roleName(m.mask))}</h1><p class="m-sub small">${esc(t('Only you see this. Remember it.'))}</p>`;
    default: return '';
  }
}

// ── Lobby ──────────────────────────────────────────────────────────────────
function explainer() {
  const steps = [
    ['veiled', 'The unmasking', 'Everyone is dealt a mask: a role card. For a moment every mask is shown; then they turn face down.'],
    ['witch', 'Swap or pretend', 'Trade masks with someone, or only pretend to. Nobody, not even they, learns which.'],
    ['mentalist', 'Peek', 'Look at your own mask for a moment. Everyone sees that you looked.'],
    ['magistrate', 'Claim', 'Say which mask you wear and use its power. Anyone who thinks it is theirs may challenge: wrong guesses pay into the Offering.'],
    ['death', 'Win', 'Gather 13 Souls, reap a Harvest of 6 with Death, or be the richest when someone is ruined.'],
  ];
  return `<section class="x-explain" data-key="kexplain"><div class="rule">${t('How Carnival works')}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${t(a)}</b><small>${t(b)}</small></span></li>`).join('')}</ol></section>`;
}

export function scoreboard(v) {
  const S = v.kScores ?? v.carnival?.scores ?? {};
  const list = v.players.map((p) => ({ p, s: S[p.id] ?? 0 })).sort((a, b) => b.s - a.s);
  if (!list.some((x) => x.s)) return '';
  return `<section class="x-scores" data-key="kscores"><div class="rule">${t('Scores')}</div><ol class="ledger">${list.map(({ p, s }, i) => `<li data-key="ksc-${p.id}"><span class="seat">${i + 1}</span><span class="who"><b>${esc(p.name)}</b></span><span class="tags"><span class="tag ${i === 0 ? 'solid' : ''}">${s}</span></span></li>`).join('')}</ol>
    <p class="small muted">${t('The winner +3; everyone else +1 for each Soul above 6.')}</p></section>`;
}

/** Custom masks: a stepper per mask, the total against the seats, Death required. */
function maskEditor(v, isHost, need) {
  const pool = v.settings.k?.pool ?? [];
  const count = (id) => pool.filter((x) => x === id).length;
  const total = pool.length;
  const rows = MASKS.map((id) => {
    const n = count(id);
    const req = id === 'DEATH';
    const max = id === 'INNOCENT' ? need : 1;
    const canDown = n > (req ? 1 : 0);
    const canUp = n < max && total < need;
    const step = (d, on) => `<button class="kme-btn" data-act="kPoolStep" data-id="${id}" data-d="${d}" ${on ? '' : 'disabled'} aria-label="${esc(d > 0 ? t('Add {x}', { x: roleName(id) }) : t('Remove {x}', { x: roleName(id) }))}">${d > 0 ? '+1' : '−1'}</button>`;
    return `<li class="kme-row ${n ? 'on' : ''} ${req ? 'req' : ''}" data-key="kme-${id}">${maskCard(id, { cls: 'thumb' })}
      <span class="kme-name"><b>${esc(roleName(id))}</b>${req ? `<small class="kme-req">${t('Required')}</small>` : ''}${runes(id, 'sm')}</span>
      <span class="kme-step">${isHost ? step(-1, canDown) : ''}<em data-key="kme-n-${n}">${n}<small>/${max}</small></em>${isHost ? step(1, canUp) : ''}</span></li>`;
  }).join('');
  return `<div class="k-medit" data-key="kmedit"><div class="kme-head ${total === need ? 'ok' : 'bad'}"><span class="kicker">${t('Your masks')}</span>
    <b>${th('{n} of {m} seats', { n: total, m: need })}</b></div>
    <p class="small muted">${t('One mask per seat. Death is required; only the Innocent may appear more than once.')}</p>
    <ul class="kme-list">${rows}</ul></div>`;
}

export function carnivalLobbyDeck(v, isHost, h) {
  const k = v.settings.k ?? {};
  const n = v.players.length;
  const row = (title, sub, control, shown) => `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
  const sw = (key, on) => `<input type="checkbox" class="switch" data-act-change="kSet" data-id="${key}" ${on ? 'checked' : ''}>`;
  const sel = (key, value, opts) => `<select class="input lang-select" data-act-change="kSet" data-id="${key}">${opts.map(([x, l]) => `<option value="${x}" ${String(value) === String(x) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const onOff = (on) => t(on ? 'On' : 'Off');
  const deck = Object.entries(v.setup?.publicDeck?.exact ?? {}).map(([id, c]) => ({ id, n: c }));
  const custom = k.masks === 'custom';
  const pool = new Set(k.pool ?? []);
  const need = Math.max(6, n);
  const harvests = [[0, t('Off')], ...[2, 4, 6, 8, 10, 12].map((x) => [x, String(x)])];
  return `${explainer()}
    <section class="lobby-deck" data-key="kdeck">
    <div class="rule">${t(n === 1 ? 'The deck · {n} player' : 'The deck · {n} players', { n })}</div>
    ${n >= 4 ? `<p class="small muted" data-key="kcount">${n < 6 ? th(6 - n === 1 ? '{n} masks: one sits on an empty chair.' : '{n} masks: {c} sit on empty chairs.', { n: 6, c: 6 - n }) : th('{n} masks, one per guest.', { n })}</p>` : `<p class="small muted">${t('Seat 4 to 12 players.')}</p>`}
    <div class="k-lobbydeck" data-key="kld">${deck.map(({ id, n: c }) => `<button class="kld-c" data-act="sheet" data-id="masks">${maskCard(id, { cls: 'thumb' })}${c > 1 ? `<b>×${c}</b>` : ''}</button>`).join('')}</div>
    <button class="btn btn-ghost btn-sm" data-act="sheet" data-id="masks" data-key="kref-btn">${glyph('mask')} ${t('What every mask does')}</button>
    <div class="rule">${t('The masks')}</div>
    ${row(t('Masks'), t('Recommended grows with the table. Custom: pick one mask per seat (Death is required; only the Innocent may repeat).'), sel('masks', custom ? 'custom' : 'recommended', [['recommended', t('Recommended')], ['custom', t('Custom')]]), t(custom ? 'Custom' : 'Recommended'))}
    ${custom ? maskEditor(v, isHost, need) : ''}
    <div class="rule">${t('Winning')}</div>
    ${row(t('A full purse'), t('Souls needed to win.'), sel('target', k.target ?? 13, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((x) => [x, String(x)])), String(k.target ?? 13))}
    ${row(t('Death\'s harvest'), t('Souls reaped with Death to win. Each reap is 2.'), sel('harvest', k.harvest ?? 6, harvests), (harvests.find(([x]) => x === (k.harvest ?? 6)) ?? harvests[3])[1])}
    ${row(t('Penalty for a wrong claim'), t('Paid into the Offering by every revealed player without the mask.'), sel('penalty', k.penalty ?? 1, [[1, '1'], [2, '2']]), String(k.penalty ?? 1))}
    <div class="rule">${t('The ball')}</div>
    ${row(t('The opening dance'), t('Turns each player must spend on Swap or pretend before anything else.'), sel('dance', k.dance ?? 1, [[1, '1'], [2, '2']]), String(k.dance ?? 1))}
    ${row(t('Notes (the ball diary)'), t('A private log of what you have seen. Off: memory only.'), sw('diary', !!k.diary), onOff(!!k.diary))}
    ${row(t('Games per match'), t('Scores carry over between games.'), sel('games', k.games ?? 1, [[1, '1'], [3, '3']]), String(k.games ?? 1))}
    ${h.music ?? ''}
    ${scoreboard(v)}
  </section>`;
}

// ── End screen ─────────────────────────────────────────────────────────────
export function carnivalEndHtml(v) {
  const K = v.carnival;
  if (!K) return '';
  const back = v.deadline ? `<p class="center-text small muted" data-key="kback">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const top = (obj) => Object.entries(obj ?? {}).sort((a, b) => b[1] - a[1])[0];
  const liar = top(K.liar);
  const eye = top(K.eye);
  const line = (e) => {
    const by = esc(pname(v, e.by));
    switch (e.kind) {
      case 'swap': return e.agent ? th('{a} trades masks with {b}, for real.', { a: pname(v, e.by), b: pname(v, e.b) }) : `${th('{a} dances with {b}.', { a: pname(v, e.by), b: pname(v, e.b) })} <span class="tag ${e.real ? 'solid' : ''}">${t(e.real ? 'Real' : 'Pretend')}</span>`;
      case 'witch': return `${th('The Witch: {a} and {b}.', { a: pname(v, e.a), b: pname(v, e.b) })} <span class="tag ${e.real ? 'solid' : ''}">${t(e.real ? 'Real' : 'Pretend')}</span>`;
      case 'peek': return th('{a} peeks.', { a: pname(v, e.by) });
      case 'look': return th('{a} looks at {b}.', { a: pname(v, e.by), b: e.seats.map((s) => pname(v, s)) });
      case 'claim': return `${th('{a} claims the {role}', { a: pname(v, e.by), role: roleName(e.mask) })}${e.challengers.length ? ` · ${th('challenged by {names}', { names: e.challengers.map((s) => pname(v, s)) })}` : e.truth && e.truth !== e.mask ? ` <span class="tag blood">${t('A lie')}</span>` : ''}`;
      default: return by;
    }
  };
  return `${back}
    <section data-key="kfinal"><div class="rule">${t('Every mask, face up')}</div>${ballroom(v, { open: true })}</section>
    <div class="k-awards" data-key="kaw">${liar ? `<p class="c-award">${glyph('jester')}<span><b>${t('Best liar')}</b><small>${th('{a}: {n} claims in the wrong mask', { a: pname(v, liar[0]), n: liar[1] })}</small></span></p>` : ''}
      ${eye ? `<p class="c-award">${glyph('oracle')}<span><b>${t('Sharpest eye')}</b><small>${th('{a}: {n} right challenges', { a: pname(v, eye[0]), n: eye[1] })}</small></span></p>` : ''}</div>
    ${K.timeline?.length ? `<details class="more" data-key="ktl"><summary>${t('The whole ball')}</summary><div><ol class="k-timeline">${K.timeline.map((e) => `<li><span class="seat">${e.n}</span><span>${line(e)}</span></li>`).join('')}</ol></div></details>` : ''}
    ${scoreboard(v)}`;
}

// ── TV board ───────────────────────────────────────────────────────────────
export function carnivalBoard(v, h) {
  const { header } = h;
  const K = v.carnival;
  if (!K) return '';
  const turn = pname(v, K.turn);
  const now = {
    K_UNMASK: t('Remember every mask.'),
    K_LOTTERY: t('The masks turn face down…'),
    K_TURN: th('{a}: swap or pretend, peek, or claim?', { a: turn }),
    K_CHALLENGE: K.claim ? `${th('{a} claims the {role}.', { a: pname(v, K.claim.by), role: roleName(K.claim.mask) })} <b>${th('{done}/{total} have answered', v.progress ?? { done: 0, total: 0 })}</b>` : '',
    K_POWER: K.power ? th('{a} uses the {role}…', { a: pname(v, K.power.user), role: roleName(K.power.mask) }) : '',
    K_LOOK: K.look ? (K.look.kind === 'peek' ? th('{a} lifts their mask…', { a: pname(v, K.look.pid) }) : th('{a} reads the masks…', { a: pname(v, K.look.pid) })) : '',
    ENDED: th('{names} wins.', { names: (K.winners ?? []).map((id) => pname(v, id)) }),
  }[v.phase] ?? '';
  const ended = v.phase === 'ENDED';
  const marks = v.phase === 'K_CHALLENGE' && K.claim ? Object.fromEntries(K.claim.answered.map((id) => [id, glyph('check')])) : {};
  const backdrop = v.table?.backdrops !== false && K.where >= 0 ? backdropHtml(K.where, true) : '';
  const purses = [...K.seats].filter((s) => !s.chair).map((s) => `<li data-key="kpl-${s.id}" class="${s.id === K.turn ? 'now' : ''}"><b>${esc(pname(v, s.id))}</b>
    <span class="k-pips" aria-label="${esc(th('{n} Souls', { n: s.souls }))}">${Array.from({ length: Math.min(s.souls, 20) }, () => '<i></i>').join('')}<em>${s.souls}</em></span>
    ${K.harvestTarget ? `<span class="k-harv">${Array.from({ length: K.harvestTarget / 2 }, (_, i) => `<i class="${i < s.harvest / 2 ? 'on' : ''}">${ico('harvest')}</i>`).join('')}</span>` : ''}</li>`).join('');
  return `<main class="board2 kboard ${ended ? 'is-ended' : ''} ${backdrop ? 'has-backdrop' : ''}" data-key="board-k">${backdrop}${header}
    <div class="k-cols">
      <section class="k-main">${ballroom(v, { open: ended || v.phase === 'K_UNMASK', marks, big: true })}<p class="b-now" data-key="know">${now}</p></section>
      <aside class="k-side">
        <div class="k-ledger fr"><span class="kicker">${th('Souls · {n} to win', { n: K.target })}</span><ul>${purses}</ul></div>
        <div class="k-tvref ${K.deck.length > 7 ? 'two' : ''}"><span class="kicker">${t('Masks at the ball')}</span><ul>${K.deck.map(({ id, n }) => `<li>${maskCard(id, { cls: 'thumb' })}<b>${esc(roleName(id))}${n > 1 ? ` ×${n}` : ''}</b>${runes(id, 'sm')}</li>`).join('')}</ul></div>
        ${ended ? scoreboard(v) : ''}
      </aside>
    </div></main>`;
}
