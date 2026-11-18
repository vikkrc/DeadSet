// Dead Set: Midnight — one night, one vote. Phone screens, scenes, the TV.
// Built from the Codex: arcana role cards (the lattice back for every card
// face down), the silver night palette, struck medallions, vellum reports,
// wax holds. Pure renderers over the filtered view; app.js passes `h`.
//
// Privacy: during the night every phone shows the same step screen; only the
// waking player's has controls. Nothing at night makes a sound or a buzz.
import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { cardArt, roleNumber } from './cards.js';
import { t, th, tmh, roleF } from './i18n.js';
import { avatarSvg } from './avatar.js';

export const isMidnightPhase = (ph) => typeof ph === 'string' && ph.startsWith('N_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TABLE = ['chair1', 'chair2', 'chair3'];
const isTable = (id) => TABLE.includes(id);
const ROMAN = ['', 'I', 'II', 'III'];
const pname = (v, id) => (isTable(id) ? th('Table card {n}', { n: ROMAN[TABLE.indexOf(id) + 1] }) : esc(v.players.find((p) => p.id === id)?.name ?? t('Someone')));
const rname = (id) => roleF(id, 'name');
/** "Death wakes…", "The Twins wake…" */
const wakes = (role) => (role === 'N_TWIN' ? t('The Twins wake…') : th('{role} wakes…', { role: rname(role) }));

// ── The cards ─────────────────────────────────────────────────────────────
export const N_CARDS = ['MIMIC', 'DEATH', 'CONSPIRATOR', 'N_TWIN', 'MENTALIST', 'DOUBLE_AGENT', 'WITCH', 'GAMBLER', 'N_INSOMNIAC', 'VIGILANTE', 'JESTER', 'INNOCENT'];
const EMB = { DOUBLE_AGENT: 'double', N_TWIN: 'twins', N_INSOMNIAC: 'insomnia' };
const embOf = (id) => EMB[id] ?? id.toLowerCase();
const LIMIT = { DEATH: 2, N_TWIN: 2, INNOCENT: 4 };
// A role as a pencil-outline emblem in a gilt medallion: lists read better as icons than as tiny cards.
const nicon = (id, cls = '') => `<i class="nic side-${SIDE(id)} ${cls}" aria-hidden="true">${emblem(embOf(id))}</i>`;
/** What each card does in Midnight (MIDNIGHT.md §2). */
export const NPOWER = {
  MIMIC: 'Look at another player\'s card and become that role. An action role acts at once; Death, the Conspirator or a Twin wakes with them later.',
  DEATH: 'Wake with the other Death and see each other. A lone Death may look at one table card.',
  CONSPIRATOR: 'See who is Death. Death does not see you. You win with Death.',
  N_TWIN: 'Wake with your twin and see each other.',
  MENTALIST: 'Look at one other player\'s card, or two of the table cards.',
  DOUBLE_AGENT: 'Swap your card with another player\'s, then look at your new card.',
  WITCH: 'Swap two other players\' cards, without looking.',
  GAMBLER: 'Swap your card with a table card, without looking.',
  N_INSOMNIAC: 'Wake last and look at your own card.',
  VIGILANTE: 'No night action. If you are voted out, the player you voted for dies too.',
  JESTER: 'No night action. You win alone if you are voted out.',
  INNOCENT: 'No night action. Find a Death.',
};
const SIDE = (id) => (id === 'DEATH' || id === 'CONSPIRATOR' ? 'death' : id === 'JESTER' ? 'jester' : 'living');

/** A card: face up (the role) or the lattice back. Death's side in rubric ink, on the same vellum. */
export function ncard(id, { back = false, cls = '', act = '', sel = false, key = '', label = '' } = {}) {
  const tag = act ? 'button' : 'span';
  const attrs = `${act ? `data-act="${act}" data-id="${esc(label || id)}" aria-pressed="${sel}"` : ''} ${key ? `data-key="${key}"` : ''}`;
  if (back || !id) return `<${tag} class="arc back ncard ${sel ? 'sel' : ''} ${cls}" ${attrs} aria-label="${esc(t('A card, face down'))}"><span class="sig">DS</span></${tag}>`;
  return `<${tag} class="arc ncard ${SIDE(id) === 'death' ? 'rubric' : ''} ${sel ? 'sel' : ''} ${cls}" ${attrs} aria-label="${esc(rname(id))}">
    <span class="arc-num">${esc(roleNumber({ id }, t))}</span>${cardArt(embOf(id))}<span class="nm">${esc(rname(id))}</span></${tag}>`;
}

// ── Pieces ─────────────────────────────────────────────────────────────────
const slip = (kicker, title, sub = '', cls = '') => `<div class="k-slip ${cls} rise-in" data-key="nslip-${esc(String(kicker)).slice(0, 16)}"><span class="kicker">${kicker}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;

/** Struck medallions to choose from (players), plus the three table cards when allowed. */
function picker(v, ids, { selected = [], act = 'nPick', tables = false } = {}) {
  const sel = new Set(selected);
  const seats = ids.map((id) => {
    const p = v.players.find((x) => x.id === id);
    return `<button class="nseat ${sel.has(id) ? 'sel' : ''}" data-act="${act}" data-id="${id}" aria-pressed="${sel.has(id)}" data-key="ns-${id}">
      <span class="ns-disc">${p?.avatar ? avatarSvg(p.avatar, 'ns-av') : `<b>${esc((p?.name ?? '?').slice(0, 1))}</b>`}</span><span class="ns-name">${esc(p?.name ?? '?')}</span></button>`;
  }).join('');
  const tbl = tables ? `<div class="ntable" data-key="ntable">${TABLE.map((c, i) => `<button class="ntc ${sel.has(c) ? 'sel' : ''}" data-act="${act}" data-id="${c}" aria-pressed="${sel.has(c)}">${ncard(null)}<small>${ROMAN[i + 1]}</small></button>`).join('')}</div>` : '';
  return `${ids.length ? `<div class="npick" data-key="npick">${seats}</div>` : ''}${tbl}`;
}

/** What you have seen tonight, as a vellum report. */
function report(seen) {
  if (!seen?.length) return '';
  return `<div class="nreport vellum" data-key="nrep-${seen.length}"><span class="kicker">${t('Only you know')}</span>
    ${seen.map((e) => `<div class="nr-row">${(e.cards ?? []).length ? `<span class="nr-cards">${e.cards.map((c) => ncard(c.role, { cls: 'thumb' })).join('')}</span>` : ''}<p>${tmh(e.msg)}</p></div>`).join('')}</div>`;
}

function chipsRow(v) {
  if (!v.me || v.me.moderator) return '';
  const notes = (v.private || []).filter((e) => e.kind === 'nsee').length;
  return `<nav class="chips" data-key="nchips">
    <button class="chip" data-act="sheet" data-id="ncards">${glyph('moon')}<span>${t('Cards in play')}</span><b>${v.midnight.deck.reduce((s, x) => s + x.n, 0)}</b></button>
    <button class="chip" data-act="sheet" data-id="notes">${glyph('scroll')}<span>${t('Notes')}</span>${notes ? `<b>${notes}</b>` : ''}</button>
  </nav>`;
}

// ── Phone ──────────────────────────────────────────────────────────────────
const KIND_TITLE = {
  copy: 'Choose a player to copy', lonePeek: 'Look at a table card', MENTALIST: 'One player, or two table cards', DOUBLE_AGENT: 'Choose a player to swap with',
  WITCH: 'Choose two players to swap', GAMBLER: 'Choose a table card',
};

export function midnightMain(v, me, h) {
  const { S, head } = h;
  const N = v.midnight;
  if (!N) return head(v);
  if (S.sel.nphase !== v.phaseId) { S.sel.nphase = v.phaseId; S.sel.npick = []; }
  const a = v.action || {};
  let stage = '';
  switch (v.phase) {
    case 'N_DEAL': {
      const open = !!S.ui.nflip;
      stage = `${slip(t('Midnight'), t('Look at your card, once'), t('Shield your screen. Tap the card to turn it over.'))}
        <div class="ndeal" data-key="ndeal"><button class="nflip ${open ? 'open' : ''}" data-act="nFlip" data-key="nflip-${open ? 'o' : 'c'}" aria-label="${esc(t('Turn over your card'))}">${open ? ncard(a.card, { cls: 'big' }) : ncard(null, { cls: 'big' })}</button>
          <p class="small muted center-text">${t(open ? 'Tap to hide it again.' : 'Tap to turn over')}</p></div>
        ${open ? `<p class="npow">${esc(t(NPOWER[a.card] ?? ''))}</p>` : ''}
        ${a.done ? `<p class="small muted center-text">${th('Waiting for the others · {done}/{total}', v.progress ?? { done: 0, total: 0 })}</p>` : ''}`;
      break;
    }
    case 'N_NIGHT': {
      const role = N.stepRole;
      const head2 = `<div class="nstep" data-key="nstep-${role}"><span class="kicker">${th('Night · {i} of {n}', { i: N.step + 1, n: N.steps.length })}</span>
        <div class="ns-card">${ncard(role, { cls: 'big' })}</div><h2>${wakes(role)}</h2></div>`;
      if (a.type === 'nstep') {
        const sel = S.sel.npick ?? [];
        const body = a.kind === 'done' ? `<p class="npow">${t('Nothing more to do. Close your eyes until dawn.')}</p>`
          : a.kind === 'lonePeek' || a.kind === 'GAMBLER' ? picker(v, [], { selected: sel, tables: true })
            : a.kind === 'MENTALIST' ? picker(v, a.targets, { selected: sel, tables: true })
              : picker(v, a.targets, { selected: sel });
        stage = `${head2}<div class="nact me" data-key="nact">${a.kind !== 'done' ? `<span class="kicker">${t('You wake')}</span><h3>${t(KIND_TITLE[a.kind] ?? '')}</h3>` : ''}${body}</div>${report(a.seen)}`;
      } else {
        // The same frame on every sleeping phone: no controls, nothing to read.
        stage = `${head2}<div class="nact" data-key="nact"><p class="npow">${t('Keep your eyes closed. Your phone will wake you if it is your turn.')}</p></div>`;
      }
      break;
    }
    case 'N_DAY':
      stage = `${slip(t('Dawn'), t('Who are you now?'), t('Your card may have changed hands in the night. Talk it over; the vote comes when the time runs out.'))}
        ${report(me?.n?.seen)}
        <div class="ndealt" data-key="ndealt"><span class="kicker">${t('You were dealt')}</span>${ncard(me?.n?.dealt, { cls: 'thumb' })}<b>${esc(rname(me?.n?.dealt))}</b></div>`;
      break;
    case 'N_VOTE':
      stage = `${slip(t('The vote'), t(a.choice ? 'Your finger is pointed' : 'Point at one player'), a.choice ? th('You point at {name}. {done}/{total} have pointed.', { name: pname(v, a.choice), ...(v.progress ?? { done: 0, total: 0 }) }) : t('The most voted die, if they have two votes or more. If a Death dies, the Living win.'))}
        ${picker(v, a.targets ?? [], { selected: [S.sel.npick?.[0] ?? a.choice].filter(Boolean) })}`;
      break;
    default: break;
  }
  return `${head(v)}${stage}${chipsRow(v)}`;
}

export function midnightDock(v, h) {
  const { S, btn, holdBtn, commitBtn, rawName } = h;
  const a = v.action || {};
  const sel = S.sel.npick ?? [];
  const parts = [];
  const note = (x) => `<span class="dock-note" data-key="ndn">${x}</span>`;
  switch (a.type) {
    case 'ndeal':
      if (!a.done) parts.push(btn(t('I have seen it'), 'nAck', 'btn-solid', !S.ui.nflip));
      break;
    case 'nstep': {
      const k = a.kind;
      if (k === 'done') break;
      const tables = sel.filter(isTable);
      const ps = sel.filter((x) => !isTable(x));
      const ready = k === 'WITCH' ? ps.length === 2 : k === 'MENTALIST' ? ps.length === 1 || tables.length === 2 : (k === 'lonePeek' || k === 'GAMBLER') ? tables.length === 1 : ps.length === 1;
      parts.push(ready ? commitBtn('secret', 'nAct', t(k === 'WITCH' || k === 'DOUBLE_AGENT' || k === 'GAMBLER' ? 'Swap' : k === 'copy' ? 'Copy' : 'Look')) : note(t(KIND_TITLE[k] ?? '')));
      break;
    }
    case 'nvote': {
      const pickd = sel[0];
      if (pickd && pickd !== a.choice) parts.push(commitBtn('secret', 'nVote', th('Point at {name}', { name: rawName(pickd) })));
      else if (a.choice) parts.push(`<span class="dock-note stamped" data-key="nv-${a.choice}">${glyph('check')} ${th('You point at {name}', { name: rawName(a.choice) })}</span>`);
      break;
    }
    default: break;
  }
  return parts;
}

export function midnightActs(h) {
  const { S, V, send, render, haptic } = h;
  return {
    nFlip() { S.ui.nflip = !S.ui.nflip; render(); },
    async nAck() { await send('n.ack', {}); },
    nPick(el) {
      const a = V().action || {};
      const id = el.dataset.id;
      let sel = [...(S.sel.npick ?? [])];
      const max = a.type === 'nstep' ? (a.kind === 'WITCH' ? 2 : a.kind === 'MENTALIST' ? (isTable(id) ? 2 : 1) : 1) : 1;
      if (sel.includes(id)) sel = sel.filter((x) => x !== id);
      else {
        // The Mentalist picks one player or two table cards, never a mix.
        if (a.kind === 'MENTALIST') sel = sel.filter((x) => isTable(x) === isTable(id));
        sel = [...sel, id].slice(-max);
      }
      S.sel.npick = sel;
      if (a.type === 'nstep') { /* silent at night */ } else haptic(8);
      render();
    },
    async nAct() {
      const a = V().action;
      const sel = S.sel.npick ?? [];
      const tables = sel.filter(isTable);
      const ps = sel.filter((x) => !isTable(x));
      const payload = a.kind === 'WITCH' ? { targets: ps } : a.kind === 'MENTALIST' ? (ps.length ? { target: ps[0] } : { tables }) : (a.kind === 'lonePeek' || a.kind === 'GAMBLER') ? { table: tables[0] } : { target: ps[0] };
      if (await send('n.act', payload)) S.sel.npick = [];
    },
    async nVote() { if (await send('n.vote', { target: S.sel.npick[0] })) S.sel.npick = []; },
    nSet(el) {
      const key = el.dataset.id;
      const val = el.type === 'checkbox' ? el.checked : key === 'deck' ? el.value : Number(el.value);
      const patch = { [key]: val };
      if (key === 'deck' && val === 'custom') patch.pool = Object.entries(V().setup?.publicDeck?.exact ?? {}).flatMap(([id, n]) => Array(n).fill(id));
      send('host.settings', { n: patch }, { quiet: true });
    },
    nPoolStep(el) {
      const pool = [...(V().settings.n?.pool ?? [])];
      const id = el.dataset.id;
      const step = id === 'N_TWIN' ? 2 : 1;
      for (let i = 0; i < step; i++) {
        if (Number(el.dataset.d) > 0) pool.push(id); else { const j = pool.lastIndexOf(id); if (j >= 0) pool.splice(j, 1); }
      }
      haptic(6);
      send('host.settings', { n: { pool } }, { quiet: true });
    },
  };
}
export const MIDNIGHT_QUIET = ['nPick', 'nFlip'];

// ── The reference sheet: every card in play, in wake order ────────────────
export function cardsSheet(v) {
  const deck = v.midnight?.deck ?? Object.entries(v.setup?.publicDeck?.exact ?? {}).map(([id, n]) => ({ id, n }));
  const order = ['MIMIC', 'DEATH', 'CONSPIRATOR', 'N_TWIN', 'MENTALIST', 'DOUBLE_AGENT', 'WITCH', 'GAMBLER', 'N_INSOMNIAC'];
  let k = 0;
  return `<div class="k-ref" data-key="nref"><p class="small muted">${t('One card per player and three on the table. Cards that wake are listed in the order the night calls them.')}</p>
    <ul class="k-reflist">${deck.map(({ id, n }) => `<li data-key="nr-${id}">${nicon(id)}<div><b>${order.includes(id) ? `<small class="nr-ord">${ROMAN[++k] ?? ++k}.</small> ` : ''}${esc(rname(id))}${n > 1 ? ` <small>×${n}</small>` : ''}</b><p>${esc(t(NPOWER[id] ?? ''))}</p></div></li>`).join('')}</ul></div>`;
}

// ── Scenes ─────────────────────────────────────────────────────────────────
export function midnightMoment(l, v, fresh, { notify, name: nm }) {
  switch (l.ev) {
    case 'n-night': return { type: 'nfall', sound: 'night' };
    case 'n-dawn': return { type: 'ndawn', sound: 'dawn' };
    case 'n-step': return null;
    default: return null;
  }
}
export const N_MOMENT_TIME = { nfall: 3200, ndawn: 3600 };
export function midnightMomentHtml(m, h) {
  const { letters } = h;
  if (m.type === 'nfall') return `<div class="m-art nm-moon">${emblem('moon')}</div><span class="kicker">${esc(t('Midnight'))}</span><h1 class="m-title">${letters(t('Night falls'))}</h1><p class="m-sub">${esc(t('Close your eyes. Your phone will wake you.'))}</p>`;
  if (m.type === 'ndawn') return `<div class="m-art nm-sun">${emblem('sun')}</div><span class="kicker">${esc(t('Dawn'))}</span><h1 class="m-title">${letters(t('Who are you now?'))}</h1><p class="m-sub">${esc(t('One discussion. One vote.'))}</p>`;
  return '';
}

// ── Lobby ──────────────────────────────────────────────────────────────────
function explainer() {
  const steps = [
    ['moon', 'One look', 'Everyone sees their own card once. Three more lie face down on the table.'],
    ['witch', 'One night', 'The phones wake each role in turn. Cards are looked at and swapped in the dark.'],
    ['whispers', 'One argument', 'At dawn you are whatever card is in front of you. Talk it over.'],
    ['magistrate', 'One vote', 'Everyone points at once. If a Death dies, the Living win.'],
  ];
  return `<section class="x-explain" data-key="nexplain"><div class="rule">${t('How Midnight works')}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${t(a)}</b><small>${t(b)}</small></span></li>`).join('')}</ol></section>`;
}

function deckEditor(v, isHost, need) {
  const pool = v.settings.n?.pool ?? [];
  const count = (id) => pool.filter((x) => x === id).length;
  const total = pool.length;
  const rows = N_CARDS.map((id) => {
    const n = count(id);
    const max = LIMIT[id] ?? 1;
    const step = id === 'N_TWIN' ? 2 : 1;
    const req = id === 'DEATH';
    const canDown = n - step >= (req ? 1 : 0);
    const canUp = n + step <= max && total + step <= need;
    const b = (d, on) => `<button class="kme-btn" data-act="nPoolStep" data-id="${id}" data-d="${d}" ${on ? '' : 'disabled'}>${d > 0 ? `+${step}` : `−${step}`}</button>`;
    return `<li class="kme-row ${n ? 'on' : ''} ${req ? 'req' : ''}" data-key="nme-${id}">${ncard(id, { cls: 'thumb' })}
      <span class="kme-name"><b>${esc(rname(id))}</b>${req ? `<small class="kme-req">${t('Required')}</small>` : id === 'N_TWIN' ? `<small class="kme-req soft">${t('A pair')}</small>` : ''}</span>
      <span class="kme-step">${isHost ? b(-1, canDown) : ''}<em>${n}<small>/${max}</small></em>${isHost ? b(1, canUp) : ''}</span></li>`;
  }).join('');
  return `<div class="k-medit" data-key="nmedit"><div class="kme-head ${total === need ? 'ok' : 'bad'}"><span class="kicker">${t('Your cards')}</span><b>${th('{n} of {m} cards', { n: total, m: need })}</b></div>
    <p class="small muted">${t('One card per player, plus three on the table. Death is required; the Twins come as a pair.')}</p><ul class="kme-list">${rows}</ul></div>`;
}

export function scoreboard(v) {
  const S = v.nScores ?? v.midnight?.scores ?? {};
  const list = v.players.map((p) => ({ p, s: S[p.id] ?? 0 })).sort((a, b) => b.s - a.s);
  if (!list.some((x) => x.s)) return '';
  return `<section class="x-scores" data-key="nscores"><div class="rule">${t('Scores')}</div><ol class="ledger">${list.map(({ p, s }, i) => `<li><span class="seat">${i + 1}</span><span class="who"><b>${esc(p.name)}</b></span><span class="tags"><span class="tag ${i === 0 ? 'solid' : ''}">${s}</span></span></li>`).join('')}</ol>
    <p class="small muted">${t('Every winner +1; the Jester +2.')}</p></section>`;
}

export function midnightLobbyDeck(v, isHost, h) {
  const s = v.settings.n ?? {};
  const n = v.players.length;
  const row = (title, sub, control, shown) => `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
  const sel = (key, value, opts) => `<select class="input lang-select" data-act-change="nSet" data-id="${key}">${opts.map(([x, l]) => `<option value="${x}" ${String(value) === String(x) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const custom = s.deck === 'custom';
  const deck = Object.entries(v.setup?.publicDeck?.exact ?? {}).map(([id, c]) => ({ id, n: c }));
  return `${explainer()}
    <section class="lobby-deck" data-key="ndeck">
    <div class="rule">${t(n === 1 ? 'The table · {n} player' : 'The table · {n} players', { n })}</div>
    ${n >= 4 ? `<p class="small muted">${th('{n} cards: one each, three on the table.', { n: n + 3 })}</p>` : `<p class="small muted">${t('Seat 4 to 12 players.')}</p>`}
    <div class="k-lobbydeck" data-key="nld">${deck.map(({ id, n: c }) => `<button class="kld-c" data-act="sheet" data-id="ncards">${ncard(id, { cls: 'thumb' })}${c > 1 ? `<b>×${c}</b>` : ''}</button>`).join('')}</div>
    <button class="btn btn-ghost btn-sm" data-act="sheet" data-id="ncards" data-key="nref-btn">${glyph('moon')} ${t('What every card does')}</button>
    <div class="rule">${t('The cards')}</div>
    ${row(t('Cards'), t('Recommended grows with the table. Custom: choose them yourself.'), sel('deck', custom ? 'custom' : 'recommended', [['recommended', t('Recommended')], ['custom', t('Custom')]]), t(custom ? 'Custom' : 'Recommended'))}
    ${custom ? deckEditor(v, isHost, n + 3) : ''}
    ${row(t('A lone Death peeks'), t('A Death who wakes alone may look at one table card.'), `<input type="checkbox" class="switch" data-act-change="nSet" data-id="lonePeek" ${s.lonePeek !== false ? 'checked' : ''}>`, t(s.lonePeek !== false ? 'On' : 'Off'))}
    ${row(t('Games per match'), t('Scores carry over between games.'), sel('games', s.games ?? 1, [[1, '1'], [3, '3'], [5, '5']]), String(s.games ?? 1))}
    ${h.music ?? ''}
    ${scoreboard(v)}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
const STEP_LINE = {
  copy: (v, e) => th('The Mimic ({a}) copied {b}: {role}.', { a: pname(v, e.by), b: pname(v, e.target), role: rname(e.role) }),
  look: (v, e) => th('{a} looked at {b}.', { a: pname(v, e.by), b: e.seats.map((s) => (isTable(s) ? t('Table card {n}', { n: ROMAN[TABLE.indexOf(s) + 1] }) : v.players.find((p) => p.id === s)?.name ?? '')).join(', ') }),
  swap: (v, e) => (e.step === 'DOUBLE_AGENT' ? th('{a} swapped cards with {b} and looked at the new one.', { a: pname(v, e.by), b: pname(v, e.seats[1]) })
    : e.step === 'GAMBLER' ? th('{a} swapped their card with {b}, without looking.', { a: pname(v, e.by), b: pname(v, e.seats[1]) })
      : th('{a} swapped the cards of {b} and {c}.', { a: pname(v, e.by), b: pname(v, e.seats[0]), c: pname(v, e.seats[1]) })),
  self: (v, e) => th('{a} woke and saw their card: {role}.', { a: pname(v, e.by), role: rname(e.role) }),
};

export function midnightEndHtml(v) {
  const N = v.midnight;
  if (!N?.cards) return '';
  const back = v.deadline ? `<p class="center-text small muted">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const died = new Set(N.died ?? []);
  const winners = new Set(N.winners?.players ?? []);
  const fig = (id, shown = id) => `<figure>${ncard(id, { cls: 'thumb' })}<figcaption>${esc(rname(shown))}</figcaption></figure>`;
  const rows = v.players.map((p) => `<li class="${died.has(p.id) ? 'died' : ''} ${winners.has(p.id) ? 'won' : ''}" data-key="ne-${p.id}">
    <span class="ne-who"><b>${esc(p.name)}</b><small>${N.votes?.[p.id] ? th('pointed at {name}', { name: pname(v, N.votes[p.id]) }) : t('did not point')}</small>${N.tally?.[p.id] ? `<small class="ne-n">${th(N.tally[p.id] === 1 ? '{n} vote' : '{n} votes', { n: N.tally[p.id] })}</small>` : ''}</span>
    <span class="ne-cards">${fig(N.dealt[p.id])}<i>${glyph('down')}</i>${fig(N.cards[p.id], N.cards[p.id] === 'MIMIC' && N.mimicAs ? N.mimicAs : N.cards[p.id])}</span>
    <span class="ne-tags">${died.has(p.id) ? `<span class="tag blood">${t('Dead')}</span>` : ''}${winners.has(p.id) ? `<span class="tag solid">${t('Won')}</span>` : ''}</span></li>`).join('');
  const table = TABLE.map((c, i) => `<figure class="ne-t">${ncard(N.cards[c], { cls: 'thumb' })}<figcaption><small>${ROMAN[i + 1]}</small>${esc(rname(N.cards[c]))}</figcaption></figure>`).join('');
  const night = (N.timeline ?? []).map((e) => `<li>${nicon(e.step)}<span>${STEP_LINE[e.kind]?.(v, e) ?? ''}</span></li>`).join('');
  return `${back}
    <section data-key="neall"><div class="rule">${t('Every card: dealt, and at dawn')}</div><ul class="ne-list">${rows}</ul>
      <div class="ne-table"><span class="kicker">${t('On the table at dawn')}</span><div>${table}</div></div></section>
    ${night ? `<section data-key="nenight"><div class="rule">${t('The whole night')}</div><ol class="nt-list">${night}</ol></section>` : ''}
    ${scoreboard(v)}`;
}

// ── TV ─────────────────────────────────────────────────────────────────────
export function midnightBoard(v, h) {
  const { header, ring } = h;
  const N = v.midnight;
  if (!N) return '';
  const ended = v.phase === 'ENDED';
  let main = '';
  if (v.phase === 'N_DEAL') {
    main = `<div class="nb-centre"><span class="kicker">${t('Midnight')}</span><h2>${t('Everyone looks at their card, once.')}</h2><div class="nb-backs">${v.players.map(() => ncard(null)).join('')}</div>
      <p class="b-now">${th('{done}/{total} have looked', v.progress ?? { done: 0, total: 0 })}</p></div>`;
  } else if (v.phase === 'N_NIGHT') {
    main = `<div class="nb-centre night"><div class="nb-moon">${emblem('moon')}</div><span class="kicker">${th('Night · {i} of {n}', { i: N.step + 1, n: N.steps.length })}</span>
      <div class="nb-card">${ncard(N.stepRole, { cls: 'big' })}</div><h2>${wakes(N.stepRole)}</h2>
      <ol class="nb-steps">${N.steps.map((r, i) => `<li class="${i < N.step ? 'past' : i === N.step ? 'now' : ''}">${emblem(embOf(r))}</li>`).join('')}</ol></div>`;
  } else {
    const marks = v.phase === 'N_VOTE' ? Object.fromEntries((N.voted ?? []).map((id) => [id, glyph('check')])) : {};
    const now = v.phase === 'N_DAY' ? t('Dawn. Who are you now? Talk it over.') : v.phase === 'N_VOTE' ? th('Point at one player · {done}/{total}', v.progress ?? { done: 0, total: 0 }) : '';
    main = `${ring ? ring(v, { center: '', marks }) : ''}<p class="b-now">${now}</p>`;
  }
  const deck = `<div class="n-tvref fr"><span class="kicker">${t('Cards in play')}</span><ul>${N.deck.map(({ id, n }) => `<li>${nicon(id)}<b>${esc(rname(id))}${n > 1 ? ` <small>×${n}</small>` : ''}</b></li>`).join('')}</ul></div>`;
  return `<main class="board2 nboard ${['N_DEAL', 'N_NIGHT'].includes(v.phase) ? 'is-night' : ''} ${ended ? 'is-ended' : ''}" data-key="board-n">${header}
    <div class="k-cols"><section class="k-main">${ended ? midnightEndHtml(v) : main}</section><aside class="k-side">${deck}${scoreboard(v)}</aside></div></main>`;
}
