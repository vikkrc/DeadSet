// The public TV board. Everything here is derived from the public view only:
// it never reacts to private actions, not even with random decoration.
import { gazetteHtml } from './gazette.js';
import { seatLayout } from './layout.js';
import { backdropHtml } from './backdrops.js';
import { exorcismBoard, lobbyOrb } from './exorcism.js';
import { cardArt, roleEmblemId } from './cards.js';
import { missionBoardStage, missionBoardRing, gridHtml, hunchArrowsSvg, hunchLegend } from './missions.js';

/** Which Rule cards shape the current phase, with a one-line note. */
export function activeRuleNotes(v) {
  const ph = v.phase;
  const talk = ph === 'DAY_DISCUSSION' || ph === 'DAY_DEFENSE';
  const vote = ph === 'DAY_VOTING';
  const night = ph === 'NIGHT_DREAM_SWAP' || ph === 'NIGHT_ACTIONS';
  const out = {};
  for (const r of v.activeRules || []) {
    let note = null;
    switch (r.id) {
      case 'FOG_OF_WAR': if (talk) note = 'Talk only to your seat neighbours'; break;
      case 'CURSED_SILENCE': if (talk) note = 'Speak only when addressed'; break;
      case 'MAJORITY_RULE': if (vote) note = v.day?.majority != null ? ['More than {n} weight needed', { n: v.day.majority }] : 'A strict majority is needed'; break;
      case 'PARANOIA': if (vote) note = 'Every ballot weighs one more'; break;
      case 'VENGEFUL_GHOSTS': if (vote) note = 'The dead cast ghost ballots'; break;
      case 'EQUAL_EXCHANGE': if (vote || ph === 'DAY_RESOLVING') note = 'A sentenced Death takes one along'; break;
      case 'DOUBLE_JEOPARDY': if (night) note = 'Death may take two tonight'; break;
      case 'UNRELIABLE_POWER': if (night) note = 'Every power rolls a die'; break;
      case 'POWER_SURGE': if (night) note = 'One power surges tonight'; break;
      case 'HIDDEN_ROLES': if (ph === 'DAY_PREP') note = 'The dead keep their secrets'; break;
      default: break;
    }
    if (note) out[r.id] = note;
  }
  return out;
}

export function moodFor(v) {
  switch (v.phase) {
    case 'LOBBY': return 'lobby';
    case 'ENDED': return { DEMON: 'endDeath', DEATH: 'endDeath', NON_DEATH: 'endLiving', JESTER: 'endJester', LOVERS: 'endLovers', CULT: 'endCult', RIPPER: 'endRipper' }[v.winner] ?? 'endDraw';
    case 'NIGHT_0_REVEAL': return 'ceremony';
    case 'NIGHT_DREAM_SWAP': case 'NIGHT_ACTIONS': case 'NIGHT_RESOLVING': return v.bloodMoon ? 'bloodmoon' : 'night';
    case 'M_REVEAL': return 'mGather';
    case 'M_PROPOSE': return 'mCamp';
    case 'M_VOTE': return 'mVote';
    case 'M_MISSION': return 'mMission';
    case 'M_RESULT': return 'mResult';
    case 'M_NIGHT': return 'mCandle';
    case 'M_LAST_STAND': return 'mStand';
    case 'M_RECKONING': return 'mReckon';
    case 'X_REVEAL': case 'X_LOTTERY': return 'mGather';
    case 'X_CLUES': return 'mCamp';
    case 'X_DISCUSS': return 'discussion';
    case 'X_VOTE': return 'mVote';
    case 'X_GUESS': return 'mReckon';
    case 'DAY_PREP': return 'morning';
    case 'DAY_DISCUSSION': return 'discussion';
    case 'DAY_DEFENSE': return 'defense';
    case 'DAY_VOTING': return 'vote';
    case 'DAY_RESOLVING': return 'resolving';
    default: return 'morning';
  }
}

/** The last few alive: the score adds a tension layer. */
export const tenseFor = (v) => !['LOBBY', 'ENDED'].includes(v.phase) && v.players.filter((p) => p.alive).length <= Math.max(3, Math.ceil(v.players.length * 0.3));

const RULE_GLYPH = {
  FOG_OF_WAR: 'veil', CURSED_SILENCE: 'psycho', MAJORITY_RULE: 'magistrate', PARANOIA: 'mentalist', VENGEFUL_GHOSTS: 'death',
  EQUAL_EXCHANGE: 'dagger', DOUBLE_JEOPARDY: 'dagger', UNRELIABLE_POWER: 'gambler', POWER_SURGE: 'nightshift', HIDDEN_ROLES: 'scroll',
};
export const ruleGlyph = (id) => RULE_GLYPH[id] ?? 'scroll';

export function boardScreen(v, h) {
  const { esc, glyph, ring, centerFor, codeTiles, qrSvg, stepOf, phaseWord, audio, wordmark, t, th, tmh, roleF, ruleF, presetF, scen, tlist } = h;
  const pw = phaseWord(v);
  const night = ['NIGHT_0_REVEAL', 'NIGHT_DREAM_SWAP', 'NIGHT_ACTIONS', 'M_REVEAL', 'M_NIGHT'].includes(v.phase);
  const place = v.scenario ? scen('WHERE', v.scenario.where).replace(/^(a|an|the)\s+/i, '') : '';
  const soundCtl = !v.table?.score ? `<span class="b-sound off">${t('Score off')}</span>`
    : !audio ? `<button class="b-sound start" data-act="boardScore">${glyph('bell')} ${t('Start the score')}</button>`
      : `<button class="b-sound on" data-act="boardMute">${glyph('bell')}<span class="eq"><i></i><i></i><i></i><i></i></span> ${night ? t('Night score') : t('Day score')}</button>`;
  const header = `<header class="b-head" data-key="bhead">
    ${wordmark()}
    <span class="b-phase">${pw.night ? `<i>${esc(pw.word)}</i>` : esc(pw.word)}${pw.num ? `<sup>${esc(pw.num)}</sup>` : ''}</span>
    <span class="b-step">${esc(stepOf(v))}${place ? ` · ${esc(place)}` : ''}</span>
    <span class="grow"></span>
    <span class="b-clock clock" data-clock></span>
    ${v.phase === 'ENDED' && v.recap ? `<button class="b-sound start" data-act="recap" data-key="b-recap">${glyph('scroll')} ${t('View recap')}</button>` : ''}
    ${soundCtl}
  </header>`;

  // ── 20 · Lobby showcase ────────────────────────────────────────────────
  if (v.phase === 'LOBBY') {
    const url = `${location.origin}/r/${v.code}`;
    const s = v.settings;
    const deck = v.setup?.publicDeck;
    const roles = Object.fromEntries((h.content?.roles ?? []).map((r) => [r.id, r]));
    const card = (id, n, cls = '') => `<div class="dcard arc ${roles[id]?.alignment === 'DEATH' ? 'noir' : ''} ${cls}" data-key="dk-${id}">${roles[id] ? cardArt(roleEmblemId(roles[id])) : ''}<b>${esc(roleF(id, 'name'))}</b>${n > 1 ? `<i>×${n}</i>` : ''}</div>`;
    let deckHtml = '';
    if (deck?.exact) deckHtml = Object.entries(deck.exact).map(([id, n]) => card(id, n, roles[id]?.alignment === 'DEATH' ? 'death' : '')).join('');
    else if (deck) {
      deckHtml = Object.entries(deck.core).filter(([, n]) => n > 0).map(([id, n]) => card(id, n, id === 'DEATH' ? 'death' : '')).join('')
        + (deck.extended ? `<div class="dcard arc back secret" data-key="dk-ext"><span class="sig">?</span><b>${th('{n} extended', { n: deck.extended })}</b></div>` : '');
    }
    const classic = v.mode === 'classic';
    const ruleCards = !classic ? '' : s.rules.mode === 'manual'
      ? (s.rules.selected.length ? s.rules.selected.map((id) => `<div class="dcard rcard arc edict" data-key="rc-${id}"><i class="ed-ini" aria-hidden="true">${esc([...ruleF(id, 'name')][0] ?? '')}</i><b>${esc(ruleF(id, 'name'))}</b></div>`).join('') : `<p class="small muted">${t('No rule cards.')}</p>`)
      : Array.from({ length: s.rules.count }, (_, i) => `<div class="dcard rcard fd arc back" data-key="rc-r${i}"><span class="sig">?</span><b>${t('Drawn at start')}</b></div>`).join('') || `<p class="small muted">${t('No rule cards.')}</p>`;
    return `<main class="board2 lobby" data-key="board-lobby">${header}
      <div class="b-lobby">
        <section class="b-join">
          <span class="kicker">${t('Scan to take a seat')}</span>
          <div class="qr-frame">${qrSvg(url)}</div>
          <div class="code-tiles big">${codeTiles(v.code)}</div>
          <span class="small muted">${esc(location.host)}</span>
        </section>
        <section class="b-table">${ring(v, { center: centerFor(v), lobby: true, slots: Math.max(5, v.players.length), orb: v.mode === 'exorcism' ? lobbyOrb() : '' })}</section>
        <section class="b-deck">
          <span class="kicker">${t('Tonight\'s deck')} · ${esc(presetF(s.preset, 'name'))}</span>
          <div class="deckrow">${deckHtml}</div>
          ${deck?.extended ? `<p class="small muted">${th('Extended seats are drawn secretly from: {names}.', { names: deck.pool.map((id) => roleF(id, 'name')) })}</p>` : ''}
          ${classic ? `<span class="kicker">${t('Rule cards')}</span>
          <div class="deckrow">${ruleCards}</div>` : ''}
          ${v.mode === 'exorcism' ? '' : `<span class="kicker">${t('Story')}</span>`}
          ${v.mode === 'exorcism' ? '' : `<p class="scenario">${s.scenario.mode === 'manual' && s.scenario.who ? esc(`${scen('WHO', s.scenario.who)} · ${scen('WHERE', s.scenario.where)} · ${scen('WHY', s.scenario.why)}`) : t('Dealt when the match begins.')}</p>`}
        </section>
      </div></main>`;
  }

  if (v.mode === 'exorcism' && v.exorcism) return exorcismBoard(v, { header, ring });

  // ── 1 · Living table + 2 · sky + 6 · threads + 17 · plaques ────────────
  const players = [...v.players].sort((a, b) => a.seat - b.seat);
  const layout = seatLayout(players.length);
  const pos = (id) => {
    const p = layout.pos[players.findIndex((x) => x.id === id)] ?? { x: 50, y: 50 };
    return [p.x, p.y];
  };
  let extra = '';
  if (!night && v.day?.nominees?.length && ['DAY_DISCUSSION', 'DAY_DEFENSE', 'DAY_VOTING', 'DAY_RESOLVING'].includes(v.phase)) {
    for (const id of v.day.nominees) {
      const [x, y] = pos(id);
      const hot = v.day.speaking === id || v.phase === 'DAY_VOTING';
      extra += `<div class="b-spot ${hot ? 'hot' : ''}" data-key="spot-${id}" style="left:${x}%;top:${y}%"></div>`;
    }
  }
  if (v.table?.threads) {
    const pairs = new Map();
    for (const l of v.log) {
      if (l.ev !== 'nominate') continue;
      const k = `${l.by}>${l.target}`;
      const day = Number(String(l.at).split(' ')[1]) || 0;
      const e = pairs.get(k) ?? { by: l.by, target: l.target, n: 0, day: 0 };
      e.n++; e.day = Math.max(e.day, day);
      pairs.set(k, e);
    }
    const today = v.dayNumber;
    const paths = [...pairs.values()].map((e) => {
      const [x1, y1] = pos(e.by); const [x2, y2] = pos(e.target);
      const mx = ((x1 + x2) / 2) * 0.62 + 50 * 0.38; const my = ((y1 + y2) / 2) * 0.62 + 50 * 0.38;
      const age = today - e.day;
      const op = age <= 0 ? 0.85 : age === 1 ? 0.5 : 0.25;
      const w = 1.2 + Math.min(4, e.n) * 1.1;
      return `<path d="M${x1.toFixed(2)} ${y1.toFixed(2)} Q${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}" stroke-width="${w}" opacity="${op}"/>`;
    }).join('');
    extra += `<svg class="b-threads" viewBox="0 0 100 100" data-key="threads" aria-hidden="true">${paths}</svg>`;
  }
  // Open Ballot: live vote lines from voter to target.
  if (v.day?.openBallots) {
    const lines = Object.entries(v.day.openBallots).filter(([, tg]) => tg !== 'ABSTAIN').map(([voter, tg]) => {
      const [x1, y1] = pos(voter); const [x2, y2] = pos(tg);
      return `<path d="M${x1.toFixed(2)} ${y1.toFixed(2)} Q${(((x1 + x2) / 2) * 0.7 + 15).toFixed(2)} ${(((y1 + y2) / 2) * 0.7 + 15).toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}"/>`;
    }).join('');
    extra += `<svg class="b-votes" viewBox="0 0 100 100" data-key="votes" aria-hidden="true">${lines}</svg>`;
  }
  extra += `<div class="sky-orb ${night ? 'moon' : 'sun'}" data-orb aria-hidden="true"></div>`;
  if (night) extra += '<div class="b-fog" data-key="fog" aria-hidden="true"><i></i><i></i><i></i></div>';
  const centerExtra = !night && v.phase !== 'ENDED' && v.phase !== 'DAY_VOTING' ? '<div class="b-candle" aria-hidden="true"><i></i><b></b></div>' : '';
  const live = activeRuleNotes(v);
  const plaques = (v.activeRules || []).map((r) => `<span class="plaque ${live[r.id] ? 'on' : ''}" data-key="pl-${r.id}">${glyph(ruleGlyph(r.id))}<span>${esc(ruleF(r.id, 'name'))}${live[r.id] ? `<em>${tmh(live[r.id])}</em>` : ''}</span></span>`).join('');
  const mr = v.mode === 'missions' ? missionBoardRing(v) : null;
  if (mr && v.phase === 'ENDED') extra += hunchArrowsSvg(v);
  const table = ring(v, { center: (mr ? '' : centerExtra) + centerFor(v), reveal: v.phase === 'ENDED', crack: true, extra, marks: mr?.marks ?? {}, pick: mr?.team.length ? { ids: [], selected: mr.team, act: '' } : null });
  const where = (h.content?.scenario?.WHERE ?? []).indexOf(v.scenario?.where);
  const backdrop = v.table?.backdrops !== false && where >= 0 ? backdropHtml(where, night) : '';
  return `<main class="board2 ${night ? 'is-night' : 'is-day'} ${backdrop ? 'has-backdrop' : ''}" data-key="board-game">
    ${backdrop}
    ${header}
    <div class="b-cols">
      <section class="b-stage">${mr ? missionBoardStage(v, h) : ''}${table}${mr && v.phase === 'ENDED' && v.missions?.hunches?.length ? hunchLegend() : ''}<div class="plaques">${plaques}</div>
      </section>
      <aside class="b-side" data-scroll="b-gz">${mr ? `<div class="b-grid"><span class="kicker">${t('The missions')}</span>${gridHtml(v)}</div>` : ''}${gazetteHtml(v, h)}</aside>
    </div>
    <div class="b-pressure" aria-hidden="true">${Array.from({ length: 22 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
  </main>`;
}
