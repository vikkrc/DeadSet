// The public TV board. Everything here is derived from the public view only:
// it never reacts to private actions, not even with random decoration.
import { gazetteHtml } from './gazette.js';
import { seatLayout } from './layout.js';
import { backdropHtml } from './backdrops.js';
import { exorcismBoard, lobbyOrb } from './exorcism.js';
import { coffinsBoard, coffinCard } from './coffins.js';
import { carnivalBoard } from './carnival.js';
import { midnightBoard } from './midnight.js';
import { seanceBoard } from './seance.js';
import { graveBoard, lobbyCrews, graveLobbyCenter } from './graverobbers.js';
import { mimicBoard } from './mimic.js';
import { omenBoard } from './omen.js';
import { mirrorBoard } from './mirror.js';
import { cardArt, roleEmblemId } from './cards.js';
import { missionBoardStage, missionBoardRing, gridHtml, hunchArrowsSvg, hunchLegend, trackHtml, cardBanner } from './missions.js';
import { modeInfo, MODE_IDS } from './modes.js';
import { tvFrame, tvHeader, nowCard, panel, latestHeadlines, honoursPanel } from './tvframe.js';
import { modeTitle, modePitch, modeMeta } from './covers.js';
import { editions } from './gazette.js';

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
    // The lobby plays the chosen mode's own calm theme; switching mode crossfades into it.
    case 'LOBBY': return modeInfo(v.mode).lobbyMood ?? 'lobby';
    case 'ENDED': if (v.winner === 'OMEN' || v.winner === 'MIRROR') return 'endLiving';
      if (v.winner === 'MIMIC') return v.mimic?.result?.side === 'LIVING' ? 'endLiving' : 'endDeath';
      if (v.winner === 'GRAVEROBBERS') return v.graverobbers?.cause === 'death' ? 'endDeath' : 'endLiving';
      if (v.winner === 'SEANCE') return { full: 'endLiving', hollow: 'endDraw', deceiver: 'endDeath', lost: 'endDraw' }[v.seance?.result] ?? 'endDraw';
      if (v.winner === 'MIDNIGHT') { const sd = v.midnight?.winners?.sides ?? []; return sd.includes('JESTER') ? 'endJester' : sd.includes('LIVING') ? 'endLiving' : sd.includes('DEATH') ? 'endDeath' : 'endDraw'; }
      return { DEMON: 'endDeath', DEATH: 'endDeath', NON_DEATH: 'endLiving', JESTER: 'endJester', LOVERS: 'endLovers', CULT: 'endCult', RIPPER: 'endRipper' }[v.winner] ?? 'endDraw';
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
    case 'O_SHOW': return 'oShow';
    case 'O_SECRET': return 'oSecret';
    case 'O_REVEAL': return 'oShow';
    case 'W_PROMPT': return 'wTalk';
    case 'W_CHOOSE': return 'wSeal';
    case 'W_REVEAL': return 'wTalk';
    case 'Q_INTRO': return 'qDeal';
    case 'Q_ASK': return 'qAsk';
    case 'Q_VOTE': case 'Q_GUESS': return 'qAccuse';
    case 'Q_FINAL': return 'qFinal';
    case 'G_INTRO': return 'gYard';
    case 'G_SIGN': return 'gSign';
    case 'G_DIG': return 'gDig';
    case 'S_INTRO': return 'sGather';
    case 'S_VISION': return 'sReach';
    case 'S_HANDS': return v.seance && v.seance.candles - v.seance.burnt <= 2 ? 'sCandle' : 'sTalk';
    case 'S_NAMING': return 'sName';
    case 'N_DEAL': return 'nDeal';
    case 'N_NIGHT': return 'nNight';
    case 'N_DAY': return 'nDay';
    case 'N_VOTE': return 'nVote';
    case 'K_UNMASK': case 'K_LOTTERY': return 'kUnmask';
    case 'K_TURN': return 'kBall';
    case 'K_CHALLENGE': return 'kChallenge';
    case 'K_POWER': case 'K_LOOK': return 'kPower';
    case 'C_LOTTERY': case 'C_BURY': return 'mGather';
    case 'C_TURN': return 'mCamp';
    case 'C_BID': return 'mVote';
    case 'C_WAGER': return 'mCandle';
    case 'C_DIG': return 'mMission';
    case 'C_LOSE': return 'mReckon';
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

/** Séance: the last two candles. */
const isSeanceLate = (v) => !!v.seance && ['S_HANDS', 'S_VISION'].includes(v.phase) && v.seance.candles - v.seance.burnt <= 2;
/** The last few alive: the score adds a tension layer. */
export const tenseFor = (v) => v.mode === 'seance' ? isSeanceLate(v) : v.mode === 'carnival' ? v.phase === 'K_CHALLENGE' : v.mode === 'coffins' ? v.phase === 'C_DIG' : !['LOBBY', 'ENDED'].includes(v.phase) && v.players.filter((p) => p.alive).length <= Math.max(3, Math.ceil(v.players.length * 0.3));

const RULE_GLYPH = {
  FOG_OF_WAR: 'veil', CURSED_SILENCE: 'psycho', MAJORITY_RULE: 'magistrate', PARANOIA: 'mentalist', VENGEFUL_GHOSTS: 'death',
  EQUAL_EXCHANGE: 'dagger', DOUBLE_JEOPARDY: 'dagger', UNRELIABLE_POWER: 'gambler', POWER_SURGE: 'nightshift', HIDDEN_ROLES: 'scroll',
};
export const ruleGlyph = (id) => RULE_GLYPH[id] ?? 'scroll';

export function boardScreen(v, h) {
  const { esc, glyph, ring, centerFor, codeTiles, qrSvg, stepOf, phaseWord, modeName, audio, wordmark, t, th, tmh, roleF, ruleF, presetF, scen, tlist } = h;
  const pw = phaseWord(v);
  const night = ['NIGHT_0_REVEAL', 'NIGHT_DREAM_SWAP', 'NIGHT_ACTIONS', 'M_REVEAL', 'M_NIGHT'].includes(v.phase);
  const place = v.scenario ? scen('WHERE', v.scenario.where).replace(/^(a|an|the)\s+/i, '') : '';
  const soundCtl = !v.table?.score ? `<span class="b-sound off">${t('Score off')}</span>`
    : !audio ? `<button class="b-sound start" data-act="boardScore">${glyph('bell')} ${t('Start the score')}</button>`
      : `<button class="b-sound on icon" data-act="boardMute" aria-label="${esc(night ? t('Night score') : t('Day score'))}" title="${esc(night ? t('Night score') : t('Day score'))}">${glyph('bell')}<span class="eq"><i></i><i></i><i></i><i></i></span></button>`;
  const header = `<header class="b-head" data-key="bhead">
    <span class="b-brand">${wordmark()}${v.phase === 'LOBBY' || v.mode === 'classic' ? '' : `<span class="b-mode">${esc(modeName(v).replace(/^Dead Set\s*[:·–-]\s*/i, ''))}</span>`}</span>
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
    const card = (id, n, cls = '') => `<div class="tarot--small dcard tarot ${roles[id]?.alignment === 'DEATH' ? 'noir' : ''} ${cls}" data-key="dk-${id}">${roles[id] ? cardArt(roleEmblemId(roles[id])) : ''}<b>${esc(roleF(id, 'name'))}</b>${n > 1 ? `<i>×${n}</i>` : ''}</div>`;
    let deckHtml = '';
    if (deck?.exact) deckHtml = Object.entries(deck.exact).map(([id, n]) => card(id, n, roles[id]?.alignment === 'DEATH' ? 'death' : '')).join('');
    else if (deck) {
      deckHtml = Object.entries(deck.core).filter(([, n]) => n > 0).map(([id, n]) => card(id, n, id === 'DEATH' ? 'death' : '')).join('')
        + (deck.extended ? `<div class="tarot--small dcard tarot back secret" data-key="dk-ext"><span class="sig">?</span><b>${th('{n} extended', { n: deck.extended })}</b></div>` : '');
    }
    const classic = v.mode === 'classic';
    const ruleCards = !classic ? '' : s.rules.mode === 'manual'
      ? (s.rules.selected.length ? s.rules.selected.map((id) => `<div class="tarot--small dcard rcard tarot edict" data-key="rc-${id}"><i class="ed-ini" aria-hidden="true">${esc([...ruleF(id, 'name')][0] ?? '')}</i><b>${esc(ruleF(id, 'name'))}</b></div>`).join('') : `<p class="small muted">${t('No rule cards.')}</p>`)
      : Array.from({ length: s.rules.count }, (_, i) => `<div class="tarot--small dcard rcard fd tarot back" data-key="rc-r${i}"><span class="sig">?</span><b>${t('Drawn at start')}</b></div>`).join('') || `<p class="small muted">${t('No rule cards.')}</p>`;
    return lobbyTv(v, h, { deckHtml, ruleCards, roles });
  }

  if (v.mode === 'exorcism' && v.exorcism) return exorcismBoard(v, { ...h, header, ring });
  if (v.mode === 'coffins' && v.coffins) return coffinsBoard(v, { ...h, header });
  if (v.mode === 'carnival' && v.carnival) return carnivalBoard(v, { ...h, header });
  if (v.mode === 'midnight' && v.midnight) return midnightBoard(v, { ...h, header, ring });
  if (v.mode === 'seance' && v.seance) return seanceBoard(v, { ...h, header, ring });
  if (v.mode === 'graverobbers' && v.graverobbers) return graveBoard(v, { ...h, header });
  if (v.mode === 'mimic' && v.mimic) return mimicBoard(v, { ...h, header, ring });
  if (v.mode === 'omen' && v.omen) return omenBoard(v, { ...h, header, ring });
  if (v.mode === 'mirror' && v.mirror) return mirrorBoard(v, { ...h, header, ring });

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
  const centerExtra = ''; // the day disc carries its own count; no candle
  const live = activeRuleNotes(v);
  const plaques = (v.activeRules || []).map((r) => `<span class="plaque ${live[r.id] ? 'on' : ''}" data-key="pl-${r.id}">${glyph(ruleGlyph(r.id))}<span>${esc(ruleF(r.id, 'name'))}${live[r.id] ? `<em>${tmh(live[r.id])}</em>` : ''}</span></span>`).join('');
  const mr = v.mode === 'missions' ? missionBoardRing(v) : null;
  if (mr && v.phase === 'ENDED') extra += hunchArrowsSvg(v);
  // TV-A2: Missions' five seals live in the table's disc, with the count of who has acted in this step.
  const mCenter = mr && v.phase !== 'ENDED' ? `<div class="tv-mdisc">${trackHtml(v)}</div>${v.progress?.total ? `<span class="c-sub">${esc(th('{done}/{total} done', v.progress))}</span>` : ''}` : null;
  const table = ring(v, { center: mCenter ?? ((mr ? '' : centerExtra) + centerFor(v)), reveal: v.phase === 'ENDED', crack: true, extra, marks: mr?.marks ?? {}, pick: mr?.team.length ? { ids: [], selected: mr.team, act: '', keep: true } : null });
  const where = (h.content?.scenario?.WHERE ?? []).indexOf(v.scenario?.where);
  const backdrop = v.table?.backdrops !== false && where >= 0 ? backdropHtml(where, night) : '';
  // TV-G1 / TV-A1: no left rail. The ledger holds the Now card (rules only when one applies), the town or the
  // expedition, and the Gazette's latest three headlines; the table is the hero, centred.
  const now = classicNow(v, h, live);
  const rulesNow = Object.entries(live).map(([id, note]) => `<p class="tvx-rule">${glyph(ruleGlyph(id))}<span><b>${esc(ruleF(id, 'name'))}</b> ${tmh(note)}</span></p>`).join('');
  const town = rosterHtml(v, h);
  const steps = !mr && NIGHT_PHASES.includes(v.phase) ? nightSteps(v, h) : null;
  const ledger = mr
    ? `${nowCard(now)}${cardBanner(v) ? panel('', cardBanner(v), 'tvmcard') : ''}${panel(t('The deduction'), gridHtml(v), 'tvgrid')}`
    : steps
      // TV-A1b: at night the ledger holds the night's public steps (the current one lit) and the story, not the town.
      ? `${nowCard({ ...now, line: rulesNow })}${panel(t('Tonight'), steps.html, 'tvsteps')}${storyPanel(v, h)}`
      : `${nowCard({ ...now, line: `${now.line ?? ''}${rulesNow}` })}${panel(t('The town'), town, 'tvtown')}${latestHeadlines(editions(v, h), h)}`;
  const stage = `${table}${mr && v.phase === 'ENDED' && v.missions?.hunches?.length ? hunchLegend() : ''}`;
  return tvFrame(v, h, { stage, ledger, herald: now.herald ?? '', night, backdrop, key: 'board-game', progress: steps?.progress, cls: `${night ? 'is-night' : 'is-day'} ${backdrop ? 'has-backdrop' : ''}` })
    + `<div class="b-pressure" aria-hidden="true">${Array.from({ length: 22 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>`;
}

/**
 * TV-L7 / TV-L8: the lobby on the frame. Until the expected players are seated (the preset's minimum, or six),
 * the join panel is the hero beside a table of empty chairs; then the table takes the stage with its ready ticks.
 * The ledger tells the room what it is about to play and teaches it, a step at a time.
 */
function lobbyTv(v, h, { deckHtml, ruleCards, roles }) {
  const { t, th, glyph, ring, codeTiles, qrSvg, presetF, ruleF, roleF, avatar } = h;
  const rn = h.roman ?? String;
  const s = v.settings;
  const info = modeInfo(v.mode);
  const preset = v.presets?.find((p) => p.id === s.preset);
  const expected = Math.max(v.players.length, preset?.min ?? info.min ?? 6, 4);
  const n = v.players.length;
  const ready = v.players.filter((p) => p.ready).length;
  const arrival = n < expected;
  const url = `${location.origin}/r/${v.code}`;
  // Teach: the game's own steps, one at a time (every 8 s), with a dot track.
  const steps = [...(h.how ?? '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  const k = steps.length ? (h.howStep ?? 0) % steps.length : 0;
  const teach = steps.length ? `<div class="lb-teach" data-key="lbteach-${k}">${steps[k]}</div><span class="lb-dots" aria-hidden="true">${steps.map((_, i) => `<i class="${i === k ? 'on' : ''}"></i>`).join('')}</span>` : '';
  const title = modeTitle(v.mode);
  const tonight = `<section class="tv-now lb-tonight" data-key="lbtonight"><span class="kicker">${t('Tonight we play')}</span>
    <div class="lb-game">${h.cover ? `<span class="lb-cover">${h.cover(v.mode, { bare: true, notitle: true })}</span>` : ''}<span><b>${esc(title)}</b><em>${esc(modePitch(v.mode))}</em><small>${esc(modeMeta(v.mode))}</small></span></div></section>`;
  const how = teach ? panel(th('How it works · {n} of {m}', { n: k + 1, m: steps.length }), teach, 'lbhow') : '';
  const deck = deckHtml ? panel(th('Tonight\'s deck · {name}', { name: presetF(s.preset, 'name') }), `<div class="lb-deck">${deckHtml}</div>${v.mode === 'classic' ? `<span class="kicker lb-rk">${t('Rule cards')}</span><div class="lb-deck">${ruleCards}</div>` : ''}`, 'lbdeck') : '';
  const join = (cls = '') => `<section class="tv-now lb-join ${cls}" data-key="lbjoin"><span class="kicker">${t('Scan to take a seat')}</span><div class="qr-frame">${qrSvg(url)}</div>
    <div class="code-tiles big">${codeTiles(v.code)}</div><span class="tv-url">${esc(`${location.host}/r/${v.code}`)}</span>
    ${v.table?.score !== false && !h.audio ? `<p class="lb-sound">${glyph('bell')} ${t('Sound plays from this screen: tap the bell to turn it on or off.')}</p>` : ''}</section>`;
  const ids = MODE_IDS;
  // TV-L11: the TV follows the host's picker: the chosen cover large, its neighbours dimmed, the title, pitch and the
  // game's teach steps as chips. The room can argue about it before anyone taps.
  if (v.browsing && !v.countdown) {
    const i = Math.max(0, ids.indexOf(v.mode));
    const near = [-2, -1, 0, 1, 2].map((d) => ids[(i + d + ids.length) % ids.length]);
    const titles = steps.map((x) => (x.match(/<b>([\s\S]*?)<\/b>/)?.[1] ?? '').replace(/<[^>]+>/g, '')).filter(Boolean).slice(0, 4);
    const stage = `<div class="lb-choose"><div class="lb-carousel">${near.map((id, j) => `<span class="lb-c ${j === 2 ? 'on' : 'off'}" data-key="lbc-${id}">${h.cover(id, { bare: true, notitle: true })}</span>`).join('')}</div>
      <h2 class="lb-ctitle">${esc(title)}</h2><p class="lb-cpitch">${esc(modePitch(v.mode))}</p><small class="lb-cmeta">${esc(modeMeta(v.mode))}</small>
      ${titles.length ? `<ol class="lb-chips">${titles.map((x, j) => `<li><i>${rn(j + 1)}</i>${esc(x)}</li>`).join('')}</ol>` : ''}</div>`;
    return tvFrame(v, h, { stage, full: true, join: true, key: 'board-lobby', cls: 'lobby is-choosing',
      header: tvHeader(v, h, { word: t('Choose a game'), step: esc(th('{n} at the table · {a} is browsing', { n, a: v.browsing.by })) }),
      herald: `${esc(th('{a} is choosing tonight\'s game.', { a: v.browsing.by }))} <em>${esc(t('Suggest one out loud.'))}</em>` });
  }
  // TV-L13: nobody joins for three minutes: the join panel is the hero and the covers cycle beside it.
  if ((h.idleFor ?? 0) > 180_000) {
    // The covers turn on a slow, continuous ring (pure CSS, so a re-render never restarts it).
    const flow = `<div class="lb-flow" aria-hidden="true" data-key="lbflow"><div class="lb-flow-ring" style="--n:${ids.length}">${ids.map((id, i) => `<span class="lb-fc" style="--i:${i}">${h.cover(id, { bare: true, notitle: true })}</span>`).join('')}</div></div>`;
    const stage = `<div class="lb-idle">${join('big')}<div class="lb-idlecovers">${flow}
      <p class="lb-cpitch">${esc(th('{n} games. The host picks one once you are seated.', { n: ids.length }))}</p></div></div>`;
    return tvFrame(v, h, { stage, full: true, key: 'board-lobby', cls: 'lobby is-idle', header: tvHeader(v, h, { word: t('Waiting for players'), step: '' }),
      herald: `${t('Scan the code with your phone to take a seat.')} <em>${t('No app, no account.')}</em>` });
  }
  // TV-L10: between games: the last result beside the table; the ledger asks Again, or another game, and keeps the evening.
  const ev = v.evening;
  const last = h.lastResult;
  const between = !!(ev?.games?.length && last);
  const header = between && ev.games.length >= 3 && ev.rows?.length && !v.countdown ? tvHeader(v, h, { word: t('The evening'), step: esc(th('{n} games tonight · game {m} next', { n: ev.games.length, m: ev.games.length + 1 })) })
    : between ? tvHeader(v, h, { word: t('Again?'), step: esc(th('Game {n} of the evening', { n: ev.games.length + 1 })) }) : tvHeader(v, h, { word: t('The gathering'), step: esc(arrival ? th('{n} seated · {m} expected', { n, m: expected }) : th('{n} seated · {r} ready', { n, r: ready })) });
  // TV-L9 / TV-L14: the start ceremony. The disc counts 3, 2, 1 in 210-unit blackletter; a cancel says why in the band.
  const counting = !!v.countdown;
  const offWhy = v.countdownOff ? { host: t('The host called the start off.'), table: t('The start was called off: the table changed.'), setup: t('The start was called off: the setup changed.') }[v.countdownOff.reason] : '';
  const notReady = v.players.filter((p) => !p.ready);
  // TV-L12: a change the host makes arrives as a ribbon in the band; everyone re-readies.
  const ln = v.lobbyNote;
  const noteText = ln ? (ln.kind === 'mode' ? th('{a} chose {game} · everyone re-readies', { a: ln.by, game: modeTitle(ln.mode) }) : ln.kind === 'rule+' ? th('{a} added the rule {rule} · everyone re-readies', { a: ln.by, rule: ruleF(ln.rule, 'name') }) : ln.kind === 'rule-' ? th('{a} removed the rule {rule} · everyone re-readies', { a: ln.by, rule: ruleF(ln.rule, 'name') }) : th('{a} changed the setup · everyone re-readies', { a: ln.by })) : '';
  const herald = counting ? esc(th('{a} starts the game. Look up.', { a: v.countdown.by })) : offWhy ? esc(offWhy) : noteText ? `<span class="lb-ribbon">${esc(noteText)}</span>` : between ? (notReady.length && notReady.length <= 3 ? `${esc(t('Ready up for another round.'))} <em>${esc(th('Waiting for {names}', { names: notReady.map((p) => p.name) }))}</em>` : esc(t('Ready up for another round.'))) : arrival ? `${t('Scan the code with your phone to take a seat.')} <em>${t('No app, no account.')}</em>`
    : !notReady.length ? th('All {n} are ready. The host starts when the room is settled.', { n })
      : notReady.length <= 3 ? th('Waiting for {names}', { names: notReady.map((p) => p.name) }) : t('Ready up on your phone.');
  const table = ring(v, { lobby: true, slots: arrival ? expected : n, center: counting ? `<b class="lb-count" data-countdown="${v.countdown.at}">3</b><span class="c-sub">${esc(t('The game begins'))}</span>` : arrival
    ? `<span class="c-big">${n}</span><span class="c-sub">${esc(th('seated · {a} to {b}', { a: info.min ?? preset?.min ?? 4, b: info.max ?? preset?.max ?? 12 }))}</span>`
    : `<span class="c-big">${ready}<small>/${n}</small></span><span class="c-sub">${esc(t(ready === n ? 'all ready' : 'ready'))}</span>` });
  const lastCard = between ? `<section class="tv-now red lb-last" data-key="lblast"><span class="kicker">${esc(th('Last game · {game}', { game: modeTitle(last.mode) }))}</span><b>${esc(last.title)}</b>${last.reason ? `<span>${h.tmh(last.reason)}</span>` : ''}
      ${last.awards?.[0] ? `<p class="lb-lasthon">${h.emblem ? `<i>${h.emblem(last.awards[0].emblem)}</i>` : ''}<span><b>${esc(t(last.awards[0].title))}</b><small>${h.tmh(last.awards[0].line)}</small></span></p>` : ''}</section>` : '';
  // TV-O3: from the third game on, between games is the evening: its champion, every game as its cover with the
  // winners' faces, the top six and the evening's honours one at a time.
  const evening = between && !counting && ev.games.length >= 3 && ev.rows?.length;
  const stage = evening ? eveningStage(ev, h) : !counting && !between ? `<div class="duo lb-arrival">${join(arrival ? '' : 'small')}<div class="duo-h">${table}</div></div>` : between && !counting ? `<div class="duo lb-between">${lastCard}<div class="duo-h">${table}</div></div>` : table;
  // Gathering: the Now card is the teach step; the game and tonight's deck below it.
  const teachNow = teach ? `<section class="tv-now lb-now" data-key="lbnow"><span class="kicker">${th('How it works · {n} of {m}', { n: k + 1, m: steps.length })}</span>${teach}</section>` : '';
  // Every step at a glance, the one being taught lit (where there is no deck to show, this fills the record).
  const titles = steps.map((x) => (x.match(/<b>([\s\S]*?)<\/b>/)?.[1] ?? '').replace(/<[^>]+>/g, ''));
  const outline = !deck && titles.length ? panel(t('The game in steps'), `<ol class="lb-outline">${titles.map((x, i) => `<li class="${i === k ? 'on' : ''}"><i>${i + 1}</i>${esc(x)}</li>`).join('')}</ol>`, 'lboutline') : '';
  const sofar = ev?.games?.length ? panel(h.tp ? h.tp('Tonight so far · {n} game', 'Tonight so far · {n} games', ev.games.length) : th('Tonight so far · {n} games', { n: ev.games.length }), `<ol class="lb-sofar">${ev.games.map((g) => `<li><span class="lb-sc">${h.emblem ? h.emblem(modeInfo(g.mode).emblem) : ''}</span><span><b>${esc(modeTitle(g.mode))}</b><small>${esc(g.winners?.length ? th('Won: {names}', { names: g.winners }) : t('Nobody won'))}</small></span></li>`).join('')}</ol>`, 'lbsofar') : '';
  const againNow = `<section class="tv-now lb-now" data-key="lbagain"><span class="kicker">${t('Again, or another game?')}</span><b>${esc(t('Same table, new roles'))}</b><span>${esc(t('Ready up on your phone; the host can also pick another game.'))}</span></section>`;
  const ledger = evening ? `${againNow}${eveningLedger(ev, h)}` : between ? `${againNow}${sofar}` : arrival ? `${tonight}${how}${deck}` : `${teachNow}${tonight.replace('tv-now lb-tonight', 'tvx-pnl lb-tonight').replace('data-key="lbtonight"', 'data-key="lbtonight" data-fit="1"')}${deck || outline}`;
  return tvFrame(v, h, { stage, ledger, herald, header, join: between || counting, key: 'board-lobby', cls: `lobby ${arrival && !counting && !between ? 'is-arrival' : 'is-gathering'} ${counting ? 'is-counting' : ''} ${between ? 'is-between' : ''} ${noteText ? 'has-ribbon' : ''}` });
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** The town in seat order: who stands accused (and by whom), the dead struck through with when they fell. */
function rosterHtml(v, h) {
  const { t, th, roman: rn } = h;
  const players = [...v.players].sort((a, b) => a.seat - b.seat);
  const noms = v.day?.nominations ?? [];
  const order = v.day?.nominees ?? [];
  const when = (at) => { const [k, n] = String(at ?? '').split(' '); return k === 'Day' ? th('fell Day {n}', { n: rn(Number(n)) }) : k === 'Night' ? th('fell Night {n}', { n: rn(Number(n)) }) : t('fell'); };
  const rows = players.map((p) => {
    const i = order.indexOf(p.id);
    const by = noms.filter((x) => x.target === p.id).map((x) => v.players.find((q) => q.id === x.by)?.name ?? '?');
    const right = !p.alive ? `<span>${esc(when(p.diedAt))}</span>` : i >= 0 ? `<span class="rd">${esc(`${rn(i + 1)} · ${th('by {names}', { names: by })}`)}</span>` : v.day?.speaking === p.id ? `<span class="ok">${esc(t('speaks'))}</span>` : '<span></span>';
    return `<div class="tvx-rr ${p.alive ? '' : 'dead'} ${v.day?.speaking === p.id ? 'hi' : ''}" data-key="rr-${p.id}"><i class="rr-face">${h.avatar(p)}</i><b>${esc(p.name)}</b>${right}</div>`;
  }).join('');
  return `<div class="tvx-ros ${players.length >= 16 ? 'two' : ''}">${rows}</div>`;
}

/** What the room needs to know now, in the TV's words (TV-G2), and the herald line for the band. */
/** TV-O3: the evening's stage: the champion large, then every game played as its cover with its winners' faces. */
function eveningStage(ev, h) {
  const face = (r, cls = '') => `<span class="ev-face ${cls}">${h.avatar(r ?? { name: '?' })}</span>`;
  const byName = (nm) => ev.rows.find((r) => r.name === nm);
  const top = ev.rows[0];
  const champ = `<section class="ev-champ" data-key="evchamp">${face(top, 'big')}<span><span class="kicker">${esc(h.t('Champion of the evening'))}</span><b>${esc(top.name)}</b>
    <em>${esc(h.th('{w} won · {p} points tonight', { w: top.wins, p: top.pts }))}</em></span></section>`;
  const games = ev.games.slice(-6).map((g, i) => `<figure class="ev-game" style="--i:${i}" data-key="evg-${i}"><span class="ev-cover">${h.cover ? h.cover(g.mode, { bare: true, notitle: true }) : ''}</span><b class="ev-title">${esc(modeTitle(g.mode))}</b>
    <span class="ev-wins">${(g.winners ?? []).slice(0, 4).map((nm) => face(byName(nm), 'sm')).join('')}${(g.winners ?? []).length > 4 ? `<i>+${g.winners.length - 4}</i>` : ''}</span>
    <figcaption>${esc(g.winners?.length ? g.winners.length > 2 ? h.th('{n} winners', { n: g.winners.length }) : g.winners.join(' · ') : h.t('Nobody won'))}</figcaption></figure>`).join('');
  return `<div class="ev-stage">${champ}<div class="ev-games">${games}</div></div>`;
}
/** TV-O3: the evening's ledger: the top six, then every honour earned tonight, one at a time. */
function eveningLedger(ev, h) {
  const six = ev.rows.slice(0, 6).map((r, i) => `<li class="${i === 0 ? 'lead' : ''}"><b>${esc(r.name)}</b><span>${r.pts}</span></li>`).join('');
  const awards = ev.games.flatMap((g) => g.awards ?? []);
  const players = awards.map((a) => { const r = ev.rows.find((x) => x.id === a.pid); return { id: a.pid, name: a.name || r?.name || '', avatar: r?.avatar ?? null }; });
  const hon = awards.length ? honoursPanel({ awards, players }, h).replace(h.t('Honours of the game'), h.t('Honours of the evening')) : '';
  return `${panel(h.t('Tonight'), `<ol class="tv-scores">${six}</ol>`, 'evtop')}${hon}`;
}

const NIGHT_PHASES = ['NIGHT_DREAM_SWAP', 'NIGHT_ACTIONS', 'NIGHT_RESOLVING'];
/**
 * TV-A1b: the night's public steps. Every phone acts at once, so the steps light by phase, never by who has acted:
 * the dreams are dealt (or night falls), the night's roles wake and Death chooses together, then dawn.
 */
function nightSteps(v, h) {
  const { t, glyph } = h;
  const rows = [
    { id: 'NIGHT_DREAM_SWAP', g: 'moon', label: v.table?.dreams ? t('The dreams are dealt') : t('Night falls') },
    { id: 'NIGHT_ACTIONS', g: 'mentalist', label: t('The night\'s roles wake') },
    { id: 'NIGHT_ACTIONS', g: 'death', label: t('Death chooses') },
    { id: 'NIGHT_RESOLVING', g: 'sun', label: t('Dawn') },
  ];
  const order = ['NIGHT_DREAM_SWAP', 'NIGHT_ACTIONS', 'NIGHT_RESOLVING'];
  const at = order.indexOf(v.phase);
  const html = `<ol class="tv-steps">${rows.map((r) => { const k = order.indexOf(r.id); return `<li class="${k < at ? 'past' : k === at ? 'now' : ''}">${glyph(r.g)}<span>${esc(r.label)}</span></li>`; }).join('')}</ol>`;
  return { html, progress: { done: at, total: order.length, label: h.th('Step {n} of {m}', { n: at + 1, m: order.length }) } };
}
/** The story in 24 units: the sentence the Gazette uses. */
function storyPanel(v, h) {
  const sc = v.scenario;
  if (!sc) return '';
  return panel(h.t('The story'), `<p class="tv-story">${h.th('We are {who}, in {where}, trying to {why}.', { who: h.scen('WHO', sc.who), where: h.scen('WHERE', sc.where), why: h.scen('WHY', sc.why) })}</p>`, 'tvstory');
}

function classicNow(v, h, live) {
  const { t, th, roman: rn } = h;
  const name = (id) => v.players.find((p) => p.id === id)?.name ?? '?'; // raw: th() escapes what it fills in
  const names = (ids) => ids.map(name);
  const day = v.dayNumber ?? 0;
  const noms = v.day?.nominees ?? [];
  const M = v.missions;
  if (M) {
    const team = (M.proposal?.team ?? []).map(name);
    switch (v.phase) {
      case 'M_REVEAL': return { kicker: t('The expedition'), title: t('Look at your role'), line: t('Every phone shows a card. Keep it to yourself.'), herald: t('Look at your role on your phone. Keep it secret.') };
      case 'M_PROPOSE': return { kicker: th('Mission {n}', { n: rn(M.mission + 1) }), title: th('{a} chooses a team', { a: name(M.leader) }), line: th('A team of {n} sets out.', { n: M.sizes[M.mission].size }), herald: th('{a} picks the team on their phone. Argue for your place.', { a: name(M.leader) }) };
      case 'M_VOTE': return { kicker: th('Mission {n} · the vote', { n: rn(M.mission + 1) }), title: th('{a} proposes {names}', { a: name(M.proposal.leader), names: team }), line: t('Approve or reject. A majority sends them.'), herald: t('Vote on your phone: approve or reject the team.') };
      case 'M_MISSION': return { kicker: th('Mission {n}', { n: rn(M.mission + 1) }), title: th('On the mission: {names}', { names: team }), line: t('Each of them plays a card in secret.'), herald: t('The team plays their cards. Everyone else waits.') };
      case 'M_NIGHT': return { kicker: t('Night'), title: t('Night falls on the expedition'), line: t('Night powers wake on the phones.'), herald: t('Eyes on your own phone.'), tone: '' };
      case 'M_LAST_STAND': return { kicker: t('The Last Stand'), title: t('Name one player you believe is Death'), line: t('Three missions succeeded. One last chance for Death to hide.'), herald: t('Vote on your phone.'), tone: 'red' };
      case 'M_RECKONING': return { kicker: t('The Reckoning'), title: t('Death hunts the Medium'), line: t('Death has unmasked. If it finds the Medium, it wins.'), herald: t('Death chooses on its phone.'), tone: 'red' };
      case 'ENDED': return { kicker: t('The end'), title: t('The expedition is over'), line: '', herald: t('The host chooses: again, or another game.') };
      default: return { kicker: '', title: h.stepOf(v), line: '', herald: '' };
    }
  }
  switch (v.phase) {
    case 'NIGHT_0_REVEAL': return { kicker: t('Night 0'), title: t('The story is dealt'), line: t('Everyone looks at their role.'), herald: t('Look at your role on your phone. Keep it secret.') };
    case 'NIGHT_DREAM_SWAP': case 'NIGHT_ACTIONS': return { kicker: th('Night {n}', { n: rn(v.nightNumber ?? day) }), title: t('The town sleeps'), line: t('Every phone looks the same at night. Nothing here gives anyone away.'), herald: t('Eyes on your own phone. The night is quiet.') };
    case 'DAY_PREP': return { kicker: th('Day {n} · morning', { n: rn(day) }), title: t('The town wakes'), line: t('Read the Gazette, then the floor opens.'), herald: t('Morning. The floor opens soon.') };
    case 'DAY_DISCUSSION': return { kicker: th('Day {n} · discussion', { n: rn(day) }), title: noms.length ? (noms.length > 1 ? th('{names} stand accused', { names: names(noms) }) : th('{names} stands accused', { names: names(noms) })) : t('The floor is open'),
      line: t('Accuse someone from your phone; a second voice puts them on trial.'), herald: t('Talk it over. Accuse and second from your phone.') };
    case 'DAY_DEFENSE': {
      const sp = v.day?.speaking;
      const by = (v.day?.nominations ?? []).filter((x) => x.target === sp).map((x) => name(x.by));
      const next = noms[noms.indexOf(sp) + 1];
      return { kicker: th('Day {n} · the defence', { n: rn(day) }), title: th('{a} speaks', { a: name(sp) }), line: by.length ? th('Accused by {names}.', { names: by }) : '',
        herald: next ? th('Next: {a}, then the ballot.', { a: name(next) }) : t('Next: the ballot.') };
    }
    case 'DAY_VOTING': return { kicker: th('Day {n} · {step}', { n: rn(day), step: h.stepOf(v) }), title: t('Hang one, or spare them all'),
      line: noms.length === 1 ? t('One stands accused. Ballots lock when the clock runs out.') : th('{n} stand accused. Ballots lock when the clock runs out.', { n: noms.length }),
      herald: v.day?.openBallots ? t('Vote on your phone. Every vote shows on the table.') : t('Cast your ballot on your phone. You can change it until it locks.') };
    case 'DAY_RESOLVING': return { kicker: th('Day {n} · the final act', { n: rn(day) }), title: t('The sentence'), line: '', herald: t('The sentence is carried out.'), tone: 'red' };
    case 'ENDED': return { kicker: t('The end'), title: h.tmh ? h.tmh(v.endReason) : '', line: '', herald: t('The host chooses: again, or another game.') };
    default: return { kicker: '', title: esc(h.stepOf(v)), line: '', herald: '' };
  }
}

