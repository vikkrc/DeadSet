// Dead Set: Graverobbers — the client (phones, TV, scenes, lobby, end). See GRAVEROBBERS.md.
//
// A cemetery at night: 25 headstones engraved with words or carved with
// pencil icons. The Moon crew digs in lapis blue, the Sun crew in gilt. The
// Undertakers' phones show the burial register as bands on the stones;
// everyone else sees only stone until a grave is opened.

import { glyph } from './icons.js';
import { emblem } from './emblems.js';
import { cardArt } from './cards.js';
import { t, th, roleF } from './i18n.js';
import { avatarSvg } from './avatar.js';
import { backdropHtml } from './backdrops.js';

export const isGravePhase = (ph) => typeof ph === 'string' && ph.startsWith('G_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pname = (v, id) => esc(v.players.find((p) => p.id === id)?.name ?? t('Someone'));
const rawName = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
const CREW_NAME = { B: 'The Moon', G: 'The Sun', V: 'The Stars' };
const CREW_EMB = { B: 'moon', G: 'sun', V: 'star' };
/** Per-crew lines (each a full sentence, so every language can bend it its own way). */
const YOU_CAP = { B: 'You are the Moon\'s Undertaker', G: 'You are the Sun\'s Undertaker', V: 'You are the Stars\' Undertaker' };
const YOU_DIG = { B: 'You dig for the Moon', G: 'You dig for the Sun', V: 'You dig for the Stars' };
const DIGS_FIRST = { B: 'The Moon digs first', G: 'The Sun digs first', V: 'The Stars dig first' };
const CAP_OF = { B: 'The Moon\'s Undertaker', G: 'The Sun\'s Undertaker', V: 'The Stars\' Undertaker' };
const RELIC_MINE = { B: 'A relic of the Moon!', G: 'A relic of the Sun!', V: 'A relic of the Stars!' };
const RELIC_OF = { B: 'A relic of the Moon', G: 'A relic of the Sun', V: 'A relic of the Stars' };
const RISES = { B: 'The Moon rises.', G: 'The Sun rises.', V: 'The Stars rise.' };
const ALL = ['B', 'G', 'V'];
/** The crews of this game (or these settings), in the fixed order Moon, Sun, Stars. */
const crewsIn = (R) => ALL.filter((c) => R?.crews?.[c]);
const teamsOf = (s) => (Number(s?.teams) === 3 ? ALL : ['B', 'G']);
const crewOf = (R, id) => crewsIn(R).find((c) => R.crews[c].includes(id)) ?? null;
/** Relics: the parcel emblems, one per grave index, in the crew's colour. */
const RELICS = ['p_key', 'succeed', 'p_feather', 'p_watch', 'p_compass', 'p_candle', 'p_letter', 'p_perfume', 'bell', 'coin', 'gift', 'grand', 'p_box', 'oracle', 'p_photo', 'curse', 'p_ticket', 'p_sand'];

function disc(v, id, cls = '') {
  const p = v.players.find((x) => x.id === id);
  return `<span class="g-disc ${cls}">${p?.avatar ? avatarSvg(p.avatar, 'g-av') : `<b>${esc((p?.name ?? '?').slice(0, 1))}</b>`}</span>`;
}

// ── The stones ─────────────────────────────────────────────────────────────
/** What is carved on a closed stone. */
const carving = (x) => (x.icon ? `<span class="gs-icon">${emblem(x.icon)}</span>` : `<span class="gs-word">${esc(x.w)}</span>`);
/** What an open grave shows. */
function opened(x, i) {
  if (x.k === 'D') return `<span class="gs-open">${emblem('death')}</span>`;
  if (x.k === 'N') return `<span class="gs-open">${emblem('v_moth')}</span>`;
  return `<span class="gs-open">${emblem(RELICS[i % RELICS.length])}<i class="gs-sig">${emblem(CREW_EMB[x.k])}</i></span>`;
}

/**
 * The cemetery: 25 stones. `register` (Undertakers, or everyone at the end) bands the closed stones.
 * `act` makes closed stones tappable; `votes` puts voters' portraits on the stones.
 */
export function cemetery(v, { register = null, act = '', mine = null, view = 'stones', size = '' } = {}) {
  const R = v.graverobbers;
  const votes = R.votes ?? {};
  const byTile = {};
  for (const [pid, x] of Object.entries(votes)) if (x !== 'stop') (byTile[x] ||= []).push(pid);
  const ended = v.phase === 'ENDED';
  return `<div class="g-yard ${view === 'map' ? 'map' : ''} ${size}" data-key="gyard-${view}-${size}">${R.tiles.map((x, i) => {
    const k = x.open || ended ? x.k : register?.[i] ?? null;
    const live = act && !x.open;
    const tag = live ? 'button' : 'span';
    const cls = ['g-stone', x.open ? `open k-${x.k}` : '', !x.open && k ? `reg k-${k}` : '', mine === i ? 'sel' : '', x.icon ? 'icon' : 'word', x.open && x.by && x.k !== x.by && x.k !== 'N' && x.k !== 'D' ? 'gift' : ''].filter(Boolean).join(' ');
    const vs = byTile[i] ?? [];
    const label = x.icon ? '' : x.w;
    return `<${tag} class="${cls}" ${live ? `data-act="${act}" data-id="${i}" aria-pressed="${mine === i}"` : ''} data-key="gs-${i}" aria-label="${esc(label)}" ${x.w ? `title="${esc(x.w)}"` : ''}>
      ${x.open ? opened(x, i) : view === 'map' ? '' : carving(x)}${x.open && !x.icon && view !== 'map' ? `<span class="gs-word small">${esc(x.w)}</span>` : ''}
      ${!x.open && k === 'D' ? `<i class="gs-skull">${emblem('death')}</i>` : ''}
      ${vs.length ? `<span class="gs-votes">${vs.map((id) => disc(v, id, 'xs')).join('')}</span>` : ''}</${tag}>`;
  }).join('')}</div>`;
}

/** The two altars: each relic found lights one more bead of the deity's sigil. */
function altar(R, c, cls = '') {
  const need = R.need[c];
  const found = R.found[c];
  const out = (R.out ?? []).includes(c);
  return `<div class="g-altar c-${c} ${R.turn === c ? 'turn' : ''} ${out ? 'out' : ''} ${cls}" data-key="galt-${c}">${out ? `<i class="ga-out" title="${esc(t('Out of the game'))}">${emblem('death')}</i>` : ''}<span class="ga-sig">${emblem(CREW_EMB[c])}</span>
    <span class="ga-beads">${Array.from({ length: need }, (_, i) => `<i class="${i < found ? 'on' : ''}"></i>`).join('')}</span>
    <b>${found}<small>/${need}</small></b>${R.bonus?.[c] ? `<span class="ga-bonus" title="${esc(t('A bonus dig next turn'))}">${glyph('lantern')}</span>` : ''}</div>`;
}

/** The sign, as everyone sees it. */
function signBanner(v) {
  const R = v.graverobbers;
  const s = R.sign;
  if (!s) return '';
  const left = Math.max(0, R.digs - R.used);
  return `<div class="g-sign c-${s.crew}" data-key="gsign-${R.turnNo}"><span class="gsn-sig">${emblem(CREW_EMB[s.crew])}</span>
    <b class="gsn-word">${s.word ? `“${esc(s.word)}”` : esc(t('a spoken sign'))}</b><span class="gsn-n">${s.n}</span>
    <span class="gsn-digs">${Array.from({ length: R.digs }, (_, i) => `<i class="${i < R.used ? 'used' : ''} ${i >= s.n ? 'bonus' : ''}"></i>`).join('')}<small>${th(left === 1 ? '{n} dig left' : '{n} digs left', { n: left })}</small></span></div>`;
}

// ── Phone ──────────────────────────────────────────────────────────────────
function statusBar(v, me) {
  const R = v.graverobbers;
  const g = me?.g ?? {};
  const you = g.crew ? t((g.captain ? YOU_CAP : YOU_DIG)[g.crew]) : '';
  const cs = crewsIn(R);
  if (cs.length === 3) return `<div class="g-bar three c-${g.crew ?? ''}" data-key="gbar"><span class="gb-you">${esc(you)}</span>${cs.map((c) => altar(R, c, 'sm')).join('')}</div>`;
  return `<div class="g-bar c-${g.crew ?? ''}" data-key="gbar">${altar(R, 'B', 'sm')}<span class="gb-you">${esc(you)}</span>${altar(R, 'G', 'sm')}</div>`;
}
const doNow = (title, hint = '', cls = '') => `<div class="s-do g-do ${cls}" data-key="gdo-${esc(String(title)).slice(0, 24)}"><h2>${title}</h2>${hint ? `<p>${hint}</p>` : ''}</div>`;

export function graveMain(v, me, h) {
  const { S: UI, head } = h;
  const R = v.graverobbers;
  if (!R) return head(v);
  if (UI.sel.gphase !== v.phaseId) { UI.sel.gphase = v.phaseId; UI.sel.gn = UI.sel.gn ?? null; }
  const a = v.action || {};
  const g = me?.g ?? {};
  const view = UI.ui.gview ?? 'stones';
  const reg = g.register && !UI.ui.ghide ? g.register : null;
  const turnName = t(CREW_NAME[R.turn]);
  const toggle = `<nav class="g-tools" data-key="gtools"><div class="seg g-view"><button data-act="gView" data-id="stones" aria-pressed="${view === 'stones'}">${t('Stones')}</button><button data-act="gView" data-id="map" aria-pressed="${view === 'map'}">${t('Map')}</button></div>
    ${g.register ? `<button class="chip" data-act="gHide">${glyph(UI.ui.ghide ? 'mentalist' : 'close')}<span>${t(UI.ui.ghide ? 'Show the register' : 'Hide the register')}</span></button>` : ''}</nav>`;
  let stage = '';
  switch (v.phase) {
    case 'G_INTRO': {
      const c = g.crew;
      const three = crewsIn(R).length === 3;
      stage = `${doNow(g.captain ? esc(roleF('G_UNDERTAKER', 'name')) : c ? t(YOU_DIG[c]) : t('The cemetery'),
        g.captain ? (three ? t('Only the three Undertakers see what lies under every stone. Give your crew one word and a number; never react to their guesses.') : t('You alone (with the other Undertaker) see what lies under every stone. Give your crew one word and a number; never react to their guesses.'))
          : three ? t('Your Undertaker gives a word and a number. Talk it over, vote for graves, dig up your relics. One grave is Death\'s: it puts your crew out of the game.') : t('Your Undertaker gives a word and a number. Talk it over, vote for graves, dig up your relics. One grave is Death\'s.'))}
        <div class="g-crews ${three ? 'three' : ''}" data-key="gcrews">${crewsIn(R).map((x) => `<section class="c-${x} ${x === c ? 'mine' : ''}"><header>${emblem(CREW_EMB[x])}<b>${t(CREW_NAME[x])}</b>${R.first === x ? `<small>${t('digs first')}</small>` : ''}</header>
          <ul>${R.crews[x].map((id) => `<li>${disc(v, id, 'xs')}<span>${pname(v, id)}</span>${R.caps[x] === id ? `<em>${esc(roleF('G_UNDERTAKER', 'name'))}</em>` : ''}</li>`).join('')}</ul></section>`).join('')}</div>
        ${a.done ? `<p class="small muted center-text">${th('Waiting for the others · {done}/{total}', v.progress ?? { done: 0, total: 0 })}</p>` : ''}`;
      break;
    }
    case 'G_SIGN': {
      if (a.type === 'gsign') {
        const n = UI.sel.gn;
        stage = `${doNow(t('Give your sign'), t('One word that links some of your graves (the coloured ones), and how many. Stay away from the black one.'))}
          <div class="g-composer" data-key="gcomp">${a.typed ? `<input class="input g-input" data-draft="gWord" maxlength="24" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t('One word'))}" value="${esc(UI.drafts?.gWord ?? '')}">` : `<p class="small muted">${t('Say your word aloud, then tap the number.')}</p>`}
            <div class="g-nums">${Array.from({ length: 9 }, (_, i) => `<button class="g-num ${n === i + 1 ? 'on' : ''}" data-act="gNum" data-id="${i + 1}">${i + 1}</button>`).join('')}</div></div>
          ${toggle}${cemetery(v, { register: reg, view })}`;
      } else {
        const capName = rawName(v, R.caps[R.turn]);
        stage = `${doNow(th('{name} is choosing a sign', { name: capName }), g.captain ? t('You cannot speak while the other crew digs. No reactions.') : g.crew === R.turn ? t('Watch your Undertaker. No hints from them now: only the sign counts.') : (R.turn === 'V' ? t('The Stars are up. Quietly plan your own next move.') : th('{crew} is up. Quietly plan your own next move.', { crew: turnName })))}
          ${toggle}${cemetery(v, { register: reg, view })}`;
      }
      break;
    }
    case 'G_DIG': {
      const voting = a.type === 'gvote';
      const mine = voting ? (UI.sel.gpick ?? (typeof a.choice === 'number' ? a.choice : null)) : null;
      const title = voting ? (a.choice === 'stop' ? t('You vote to stop digging') : typeof a.choice === 'number' ? th('Your vote: {word}', { word: R.tiles[a.choice].w ?? t('a carved stone') }) : t('Vote for a grave')) : g.captain && g.crew === R.turn ? t('Your crew is digging. Not a word.') : (R.turn === 'V' ? t('The Stars are digging') : th('{crew} is digging', { crew: turnName }));
      const hint = voting ? t('Talk it over, then tap a grave. The most votes digs; a tie goes to the coin. You can change your vote until it closes.') : th('Votes in · {done}/{total}', v.progress ?? { done: 0, total: 0 });
      stage = `${signBanner(v)}${doNow(title, hint)}${toggle}${cemetery(v, { register: reg, act: voting ? 'gVote' : '', mine, view })}`;
      break;
    }
    default: break;
  }
  return `${head(v)}${statusBar(v, me)}${stage}`;
}

export function graveDock(v, h) {
  const { S: UI, btn, holdBtn, commitBtn } = h;
  const a = v.action || {};
  const parts = [];
  const note = (x) => `<span class="dock-note" data-key="gdn">${x}</span>`;
  switch (a.type) {
    case 'gintro': if (!a.done) parts.push(btn(t('I am ready'), 'gAck', 'btn-solid')); break;
    case 'gsign': {
      const n = UI.sel.gn;
      const word = (UI.drafts?.gWord ?? '').trim();
      const ready = n && (!a.typed || word);
      parts.push(ready ? btn(a.typed ? th('Give the sign: “{word}” · {n}', { word, n }) : th('Give the sign · {n}', { n }), 'gSign', 'btn-solid') : note(t(a.typed ? 'Type a word and pick a number' : 'Pick a number')));
      break;
    }
    case 'gvote':
      parts.push(a.choice === 'stop' ? `<span class="dock-note stamped" data-key="gstop">${glyph('check')} ${t('You vote to stop')}</span>` : commitBtn('secret', 'gStop', t('Vote to stop digging'), { cls: 'btn-ghost' }));
      break;
    default: break;
  }
  return parts;
}

export function graveActs(h) {
  const { S: UI, V, send, render, haptic } = h;
  return {
    async gAck() { await send('g.ack', {}); },
    gView(el) { UI.ui.gview = el.dataset.id; render(); },
    gHide() { UI.ui.ghide = !UI.ui.ghide; render(); },
    gNum(el) { UI.sel.gn = Number(el.dataset.id); haptic(6); render(); },
    async gSign() {
      const a = V().action || {};
      const word = (UI.drafts?.gWord ?? '').trim();
      if (await send('g.sign', { word: a.typed ? word : null, n: UI.sel.gn })) { UI.sel.gn = null; if (UI.drafts) UI.drafts.gWord = ''; }
    },
    async gVote(el) {
      const a = V().action || {};
      const i = Number(el.dataset.id);
      haptic(8);
      await send('g.vote', { tile: a.choice === i ? null : i }, { quiet: true });
    },
    async gStop() { await send('g.vote', { tile: 'stop' }); },
    gSet(el) {
      const key = el.dataset.id;
      const raw = el.type === 'checkbox' ? el.checked : el.value;
      const val = key === 'games' || key === 'teams' ? Number(raw) : raw;
      send('host.settings', { g: { [key]: val } }, { quiet: true });
    },
    gCrew(el) { send('host.settings', { g: { crew: { [el.dataset.id]: el.dataset.crew } } }, { quiet: true }); },
    gCap(el) { send('host.settings', { g: { cap: { [el.dataset.crew]: el.value || null } } }, { quiet: true }); },
  };
}
export const GRAVE_QUIET = ['gView', 'gHide', 'gNum', 'gVote'];

// ── Scenes ─────────────────────────────────────────────────────────────────
export function graveMoment(l, v, fresh, { notify, name: nm }) {
  switch (l.ev) {
    case 'g-start': return { type: 'gstart', first: l.first, crews: l.crews, caps: l.caps, sound: 'coin' };
    case 'g-sign': return { type: 'gsign', crew: l.crew, word: l.word, n: l.n, bonus: l.bonus, sound: 'bell' };
    case 'g-dig': {
      const out = [];
      if (l.coin) out.push({ type: 'gcoin', crew: l.crew, coin: l.coin, labels: l.coin.options.map((x) => (x === 'stop' ? t('Stop digging') : v.graverobbers?.tiles?.[x]?.w ?? '')), sound: 'coin' });
      out.push({ type: 'gdig', crew: l.crew, three: !!v.graverobbers?.crews?.V, stop: !!l.stop, earned: !!l.earned, kind: l.kind ?? null, label: l.label ?? '', icon: l.icon ?? null, idx: l.idx ?? 0,
        sound: l.stop ? null : l.kind === 'D' ? 'death' : l.kind === 'N' ? 'thud' : l.kind === l.crew ? 'goodCard' : 'badCard' });
      return out;
    }
    case 'g-silent': notify(t('The Undertaker kept silent. The turn passes.')); return null;
    default: return null;
  }
}
export const G_MOMENT_TIME = { gstart: 5600, gsign: 3000, gcoin: 3600, gdig: 3800 };

export function graveMomentHtml(m, h) {
  const { letters } = h;
  switch (m.type) {
    case 'gstart': {
      if (m.crews?.V) {
        // Three crews: the three sigils turn in a circle, and the first crew's rises.
        return `<div class="g-draw3 pick-${m.first}">${ALL.map((c, i) => `<span class="gd c-${c} ${c === m.first ? 'won' : ''}" style="--i:${i}">${emblem(CREW_EMB[c])}</span>`).join('')}</div>
      <span class="kicker">${esc(t('The lot decides'))}</span><h1 class="m-title c-${m.first}">${letters(t(DIGS_FIRST[m.first]))}</h1>
      <p class="m-sub">${esc(t('Seven relics for the first crew, six for each of the others. Death\'s grave puts a crew out.'))}</p>`;
      }
      return `<div class="g-coin-scene"><div class="g-coin flip-${m.first}"><span class="f B">${emblem('moon')}</span><span class="f G">${emblem('sun')}</span></div></div>
      <span class="kicker">${esc(t('The coin decides'))}</span><h1 class="m-title c-${m.first}">${letters(t(DIGS_FIRST[m.first]))}</h1>
      <p class="m-sub">${esc(t('Nine relics for the first crew, eight for the other. One grave is Death\'s.'))}</p>`;
    }
    case 'gsign': return `<div class="m-art g-sig c-${m.crew}">${emblem(CREW_EMB[m.crew])}</div><span class="kicker">${esc(t(CAP_OF[m.crew]))}</span>
      <h1 class="m-title g-signword c-${m.crew}">${m.word ? `“${esc(m.word)}”` : esc(t('The sign'))}<span class="g-signn">${m.n}</span></h1>${m.bonus ? `<p class="m-sub">${esc(t('Plus one bonus dig'))}</p>` : ''}`;
    case 'gcoin': return `<div class="g-coin-scene"><div class="g-coin spin"><span class="f B">${emblem('moon')}</span><span class="f G">${emblem('sun')}</span></div></div>
      <span class="kicker">${esc(t('A tie'))}</span><h1 class="m-title">${letters(t('The coin decides'))}</h1><p class="m-sub">${esc(m.labels.join(' · '))}</p>`;
    case 'gdig': {
      if (m.stop) return `<div class="m-art">${emblem('undertaker')}</div><span class="kicker">${esc(t(CREW_NAME[m.crew]))}</span><h1 class="m-title">${letters(t('They stop digging'))}</h1>${m.earned ? `<p class="m-sub">${esc(t('One bonus dig next turn.'))}</p>` : ''}`;
      const three = !!m.three;
      const res = m.kind === 'D' ? ['Death\'s grave!', three ? 'The crew is out of the game.' : 'The crew is finished.'] : m.kind === 'N' ? ['An empty grave', 'Dust and moths. The turn passes.'] : m.kind === m.crew ? [RELIC_MINE[m.crew], ''] : [RELIC_OF[m.kind], three ? 'It belongs to another crew. The turn passes.' : 'It belongs to the other crew. The turn passes.'];
      const stone = { w: m.label, icon: m.icon, open: true, k: m.kind };
      return `<div class="g-dig-scene k-${m.kind}"><span class="g-stone big lift">${carving(stone)}</span><span class="g-stone big open k-${m.kind} reveal">${opened(stone, m.idx)}</span></div>
        <span class="kicker">${esc(m.label && !m.icon ? m.label : t('The grave opens'))}</span><h1 class="m-title c-${m.kind}">${letters(t(res[0]))}</h1>${res[1] ? `<p class="m-sub">${esc(t(res[1]))}</p>` : ''}`;
    }
    default: return '';
  }
}

// ── Lobby ──────────────────────────────────────────────────────────────────
function explainer() {
  const steps = [
    ['undertaker', 'The Undertakers', 'One per crew. Only they see what lies under every stone.'],
    ['p_letter', 'One word, one number', 'The Undertaker links some of the crew\'s graves: “Ocean · 3”.'],
    ['necro', 'Dig', 'The crew votes for a grave. Your relic: dig on. Empty, or theirs: the turn passes.'],
    ['death', 'Death\'s grave', 'Open it and your crew loses at once. Find all your relics first to win.'],
  ];
  return `<section class="x-explain" data-key="gexplain"><div class="rule">${t('How Graverobbers works')}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${t(a)}</b><small>${t(b)}</small></span></li>`).join('')}</ol></section>`;
}

export function scoreboard(v) {
  const S = v.gScores ?? v.graverobbers?.scores ?? {};
  const list = v.players.map((p) => ({ p, s: S[p.id] ?? 0 })).sort((a, b) => b.s - a.s);
  if (!list.some((x) => x.s)) return '';
  return `<section class="x-scores" data-key="gscores"><div class="rule">${t('Scores')}</div><ol class="ledger">${list.map(({ p, s }, i) => `<li><span class="seat">${i + 1}</span><span class="who"><b>${esc(p.name)}</b></span><span class="tags"><span class="tag ${i === 0 ? 'solid' : ''}">${s}</span></span></li>`).join('')}</ol>
    <p class="small muted">${t('Every winner +1.')}</p></section>`;
}

/**
 * Who sits with which crew in the lobby, as the engine will deal them: by seat (the first half
 * of the table is the Moon), or chosen (players without a crew fill the smaller one). Random → null.
 */
export function lobbyCrews(v) {
  const s = v.settings?.g ?? {};
  const mode = s.crews ?? 'seats';
  const list = teamsOf(s);
  const out = {};
  if (mode === 'seats') {
    const bySeat = [...v.players].sort((a, b) => a.seat - b.seat);
    bySeat.forEach((p, i) => { out[p.id] = list[seatCrewIndex(i, bySeat.length, list.length)]; });
  } else if (mode === 'chosen') {
    const n = Object.fromEntries(list.map((c) => [c, 0]));
    for (const p of v.players) if (list.includes(s.crew?.[p.id])) { out[p.id] = s.crew[p.id]; n[s.crew[p.id]]++; }
    for (const p of v.players) if (!out[p.id]) { const c = list.reduce((a, x) => (n[x] < n[a] ? x : a), list[0]); out[p.id] = c; n[c]++; }
  } else return null;
  return out;
}

/** As the engine: seat i of n belongs to which of `parts` crews (the earlier parts take the extra seats). */
function seatCrewIndex(i, n, parts) {
  const base = Math.floor(n / parts);
  const extra = n % parts;
  let start = 0;
  for (let c = 0; c < parts; c++) {
    const size = base + (c < extra ? 1 : 0);
    if (i < start + size) return c;
    start += size;
  }
  return parts - 1;
}

/** The middle of the lobby table: how many sit with each crew. */
export function graveLobbyCenter(v) {
  const map = lobbyCrews(v);
  const prog = v.progress;
  const ready = `<span class="c-sub">${t('{n}/{total} ready', { n: prog.done, total: prog.total })}</span>`;
  if (!map) return `<span class="c-big">${v.players.length}</span><span class="c-sub">${t('Crews are dealt at the start.')}</span>`;
  const count = (c) => Object.values(map).filter((x) => x === c).length;
  return `<span class="g-ccrews">${teamsOf(v.settings?.g).map((c) => `<span class="c-${c}">${emblem(CREW_EMB[c])}<b>${count(c)}</b></span>`).join('')}</span>${ready}`;
}

export function graveLobbyDeck(v, isHost, h) {
  const s = v.settings.g ?? {};
  const n = v.players.length;
  const row = (title, sub, control, shown) => `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
  const sel = (key, value, opts) => `<select class="input lang-select" data-act-change="gSet" data-id="${key}">${opts.map(([x, l]) => `<option value="${x}" ${String(value) === String(x) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const sw = (key, on) => `<input type="checkbox" class="switch" data-act-change="gSet" data-id="${key}" ${on ? 'checked' : ''}>`;
  const TILES = [['words', t('Words')], ['icons', t('Icons')]];
  const CREW_MODES = [['seats', t('By seat')], ['random', t('Random')], ['chosen', t('Chosen')]];
  const mode = s.crews ?? 'seats';
  const crews = mode === 'chosen';
  const map = lobbyCrews(v) ?? {};
  const list = teamsOf(s);
  const three = list.length === 3;
  const chosen = Object.fromEntries(list.map((c) => [c, v.players.filter((p) => map[p.id] === c).map((p) => p.id)]));
  const moveTo = (id, c) => list.filter((x) => x !== c).map((x) => `<button class="btn btn-ghost btn-sm g-move c-${x}" data-act="gCrew" data-id="${id}" data-crew="${x}" aria-label="${esc(t(CREW_NAME[x]))}">${glyph(CREW_EMB[x])}</button>`).join('');
  const editor = crews ? `<div class="g-crewedit ${three ? 'three' : ''}" data-key="gcrewedit">${list.map((c) => `<section class="c-${c}"><header>${emblem(CREW_EMB[c])}<b>${t(CREW_NAME[c])}</b></header>
      <ul>${chosen[c].map((id) => `<li>${disc(v, id, 'xs')}<span>${pname(v, id)}</span>${isHost ? moveTo(id, c) : ''}</li>`).join('')}</ul>
      ${s.captains === 'chosen' && isHost ? `<select class="input lang-select" data-act-change="gCap" data-crew="${c}"><option value="">${t('Undertaker: random')}</option>${chosen[c].map((id) => `<option value="${id}" ${s.cap?.[c] === id ? 'selected' : ''}>${pname(v, id)}</option>`).join('')}</select>` : ''}</section>`).join('')}</div>` : '';
  return `${explainer()}
    <section class="lobby-deck" data-key="gdeck">
    <div class="rule">${t(n === 1 ? 'The table · {n} player' : 'The table · {n} players', { n })}</div>
    <p class="small muted">${three ? (n >= 6 ? t('Three crews: the Moon, the Sun and the Stars. Each needs an Undertaker and at least one digger.') : t('Three crews need 6 to 12 players.')) : n >= 4 ? t('Two crews: the Moon and the Sun. Each needs an Undertaker and at least one digger.') : t('Seat 4 to 12 players.')}</p>
    <div class="g-lobbyart ${three ? 'three' : ''}" data-key="glart"><span class="arc c-B">${cardArt('moon')}<span class="nm">${t('The Moon')}</span></span>${three ? '' : `<span class="arc">${cardArt('undertaker')}<span class="nm">${esc(roleF('G_UNDERTAKER', 'name'))}</span></span>`}<span class="arc c-G">${cardArt('sun')}<span class="nm">${t('The Sun')}</span></span>${three ? `<span class="arc c-V">${cardArt('star')}<span class="nm">${t('The Stars')}</span></span>` : ''}</div>
    ${row(t('Number of crews'), t('Three crews: a third of the table each. Death\'s grave puts a crew out; the others dig on.'), sel('teams', three ? 3 : 2, [[2, t('Two crews')], [3, t('Three crews')]]), three ? t('Three crews') : t('Two crews'))}
    ${row(t('Graves show'), t('Words in the table\'s language, or pencil icons.'), sel('tiles', s.tiles ?? 'words', TILES), TILES.find((x) => x[0] === (s.tiles ?? 'words'))[1])}
    ${(s.tiles ?? 'words') === 'words' ? row(t('Famous names'), t('Add films, heroes, celebrities and landmarks to the words.'), sw('famous', !!s.famous), t(s.famous ? 'On' : 'Off')) : ''}
    ${row(t('Crews'), three ? t('By seat: the table is cut into thirds. Move players around the table to change crews.') : t('By seat: one half of the table against the other. Move players around the table to change crews.'), sel('crews', mode, CREW_MODES), CREW_MODES.find((x) => x[0] === mode)?.[1] ?? '')}
    ${row(t('Undertakers'), t('Rotating gives everyone a turn across a match.'), sel('captains', s.captains ?? 'rotate', [['rotate', t('Rotating')], ['random', t('Random')], ['chosen', t('Chosen')]]), t({ rotate: 'Rotating', random: 'Random', chosen: 'Chosen' }[s.captains ?? 'rotate']))}
    ${editor}
    ${row(t('Signs'), t('Typed: the word appears on every screen. Spoken: said aloud, the number tapped.'), sel('signs', s.signs ?? 'typed', [['typed', t('Typed')], ['spoken', t('Spoken')]]), t(s.signs === 'spoken' ? 'Spoken' : 'Typed'))}
    ${row(t('Games per match'), t('Scores carry over between games.'), sel('games', s.games ?? 1, [[1, '1'], [3, '3'], [5, '5']]), String(s.games ?? 1))}
    ${h.music ?? ''}
    ${scoreboard(v)}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
export const graveTitle = (R) => (RISES[R?.winner] ? t(RISES[R.winner]) : t('The End'));

export function graveEndHtml(v) {
  const R = v.graverobbers;
  if (!R?.history) return '';
  const back = v.deadline ? `<p class="center-text small muted">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const signs = R.history.signs.map((s) => {
    const digs = R.history.digs.filter((d) => d.turn === s.turn);
    return `<li class="c-${s.crew}"><span class="ge-sig">${emblem(CREW_EMB[s.crew])}</span><span class="ge-sign"><b>${s.word ? `“${esc(s.word)}”` : esc(t('a spoken sign'))} · ${s.n}</b><small>${pname(v, s.by)}</small></span>
      <span class="ge-digs">${digs.map((d) => (d.stop ? `<em>${t('stop')}</em>` : `<i class="k-${d.kind}">${esc(R.tiles[d.idx].w ?? '')}${R.tiles[d.idx].icon ? emblem(R.tiles[d.idx].icon) : ''}</i>`)).join('')}</span></li>`;
  }).join('');
  return `${back}<section data-key="geboard"><div class="rule">${t('The burial register')}</div>${cemetery(v, { view: 'stones', size: 'end' })}</section>
    ${signs ? `<section data-key="gesigns"><div class="rule">${t('Every sign')}</div><ol class="ge-list">${signs}</ol></section>` : ''}${scoreboard(v)}`;
}

// ── TV ─────────────────────────────────────────────────────────────────────
export function graveBoard(v, h) {
  const { header } = h;
  const R = v.graverobbers;
  if (!R) return '';
  const ended = v.phase === 'ENDED';
  const prog = v.progress ?? { done: 0, total: 0 };
  const turn = t(CREW_NAME[R.turn]);
  const [title, sub] = {
    G_INTRO: [t('The cemetery at midnight'), th('Everyone looks at their crew · {done}/{total}', prog)],
    G_SIGN: [th('{name} is choosing a sign', { name: rawName(v, R.caps[R.turn]) }), (R.turn === 'V' ? t('The Stars are up. Undertakers: not a word, not a look.') : th('{crew} is up. Undertakers: not a word, not a look.', { crew: turn }))],
    G_DIG: [(R.turn === 'V' ? t('The Stars are digging') : th('{crew} is digging', { crew: turn })), th('Votes in · {done}/{total}', prog)],
  }[v.phase] ?? ['', ''];
  const crewCol = (c) => `<aside class="gt-crew c-${c} ${R.turn === c && !ended ? 'turn' : ''}" data-key="gtc-${c}">${altar(R, c)}<b class="gt-name">${t(CREW_NAME[c])}</b>
    <ul>${R.crews[c].map((id) => `<li>${disc(v, id, 'sm')}<span>${pname(v, id)}</span>${R.caps[c] === id ? `<em>${esc(roleF('G_UNDERTAKER', 'name'))}</em>` : ''}</li>`).join('')}</ul></aside>`;
  const backdrop = v.table?.backdrops !== false ? backdropHtml(17, true) : '';
  return `<main class="board2 gboard has-backdrop ${ended ? 'is-ended' : ''} turn-${R.turn}" data-key="board-g">${backdrop}${header}
    <div class="gt-cols ${crewsIn(R).length === 3 ? 'three' : ''}">${crewCol('B')}<section class="gt-main">${ended ? graveEndHtml(v) : `<div class="gt-banner c-${R.turn}" data-key="gtban"><div><b>${esc(title)}</b><span>${esc(sub)}</span></div></div>${signBanner(v)}${cemetery(v, { size: 'tv' })}`}</section>${R.crews.V ? `<div class="gt-side">${crewCol('G')}${crewCol('V')}</div>` : crewCol('G')}</div></main>`;
}
