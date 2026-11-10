// Dead Set client. Renders whatever filtered view the server sends; never
// decides outcomes, never holds anyone else's secrets.
import { glyph, dreamGlyph } from './icons.js';
import { qrSvg } from './qr.js';
import { renderGuide } from './guide.js';
import { sound, score, haptic, burstAt, celebrate, ambient } from './fx.js';
import { boardScreen, activeRuleNotes, moodFor, tenseFor, ruleGlyph } from './board.js';
import { seatLayout } from './layout.js';
import { sceneMs, scenesFor } from './interludes.js';
import { avatarSvg, randomAvatar, PARTS, COLORS } from './avatar.js';
import { giftHtml, productIndex } from './gifts.js';
import { gazetteHtml, frontPageHtml } from './gazette.js';
import { isMissionPhase, missionMain, missionPicks, missionCenter, missionDock, missionActs, missionMoment, missionMomentHtml, MISSION_MOMENT_TIME, revealTime, missionEndHtml, knowledgeHtml, trackHtml, gridHtml, missionMarks, hunchArrowsSvg, hunchLegend } from './missions.js';
import { LANGS, t, th, tm, tmh, entryMsg, stamp, roleF, dreamF, ruleF, presetF, mcardF, scen, optLabel, list as tlist, loadLang, setContent, browserLang, isLang, getLang, extra as tx } from './i18n.js';

const app = document.getElementById('app');
const S = {
  route: null, code: null, token: null, pid: null,
  view: null, conn: 'idle', es: null, content: null,
  pending: false, drafts: {}, sel: {}, selPhase: null,
  moments: [], moment: null, momentTimer: null, notes: [],
  seenLog: null, seenPriv: null, peek: null, board: { key: null, audio: false },
  ui: { sheet: null, veiled: {}, flipped: {}, chat: null, recover: false, moderated: false, tab: null, holding: null, homeTab: 'host', invite: false, recordList: localStorage.getItem('deadset:record') === 'list' },
};

// ── Utilities ──────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
const roman = (n) => ROMAN[n] ?? String(n);
const V = () => S.view;
const player = (id) => V()?.players.find((p) => p.id === id);
const pname = (id) => esc(player(id)?.name ?? t('Someone'));
const rawName = (id) => player(id)?.name ?? t('Someone');
const isNight = (phase) => phase === 'NIGHT_0_REVEAL' || phase === 'NIGHT_DREAM_SWAP' || phase === 'NIGHT_ACTIONS' || phase === 'M_REVEAL' || phase === 'M_NIGHT';
const sessionKey = (code) => `deadset:${code}`;
const saveSession = (code, data) => localStorage.setItem(sessionKey(code), JSON.stringify(data));
const loadSession = (code) => { try { return JSON.parse(localStorage.getItem(sessionKey(code))); } catch { return null; } };
const clearSession = (code) => localStorage.removeItem(sessionKey(code));
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const maxI = (arr) => (arr?.length ? arr[arr.length - 1].i ?? arr.length - 1 : -1);
let clockSkew = 0;

function initials(name) {
  const w = String(name).trim().split(/\s+/);
  return esc((w.length > 1 ? w[0][0] + w[1][0] : w[0][0] || '?').toUpperCase());
}
function hash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function sigil(id) {
  const h = hash(id);
  const a = 2 + (h % 7); const b = 2 + ((h >> 4) % 9); const rot = (h >> 8) % 360;
  return `<svg class="sigil" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" stroke-dasharray="${a} ${b}" transform="rotate(${rot} 50 50)"/></svg>`;
}
function moon(f, cls = '') {
  // f = lit fraction 0..1 (waxing). Terminator ellipse trick.
  const r = 40; const cx = 50; const cy = 50;
  const rx = Math.abs(1 - 2 * f) * r;
  const sweep = f < 0.5 ? 0 : 1;
  const lit = f <= 0.001 ? '' : f >= 0.999 ? `<circle cx="50" cy="50" r="${r}" class="lit"/>`
    : `<path class="lit" d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${rx.toFixed(2)} ${r} 0 0 ${sweep} ${cx} ${cy - r}Z"/>`;
  return `<svg class="moon ${cls}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${r}" class="dark"/>${lit}</svg>`;
}
function tally(n, total) {
  const groups = [];
  for (let g = 0; g < Math.ceil(Math.max(n, 1) / 5); g++) {
    const k = Math.min(5, n - g * 5);
    let d = '';
    for (let i = 0; i < Math.min(k, 4); i++) d += `<line x1="${4 + i * 5}" y1="3" x2="${4 + i * 5}" y2="21"/>`;
    if (k === 5) d += '<line x1="1" y1="18" x2="22" y2="6"/>';
    groups.push(`<svg viewBox="0 0 24 24" class="tally-g">${d}</svg>`);
  }
  return `<span class="tally" aria-label="${esc(t('{n} of {total}', { n, total }))}">${n ? groups.join('') : '<span class="muted small">—</span>'}</span>`;
}
function letters(text) {
  let i = 0;
  return text.split(' ').map((w) => `<span class="w">${[...w].map((c) => `<span class="l" style="--i:${i++}">${esc(c)}</span>`).join('')}</span>`).join(' ');
}

function notify(text, kind = '') {
  const id = uid();
  S.notes = [...S.notes.slice(-2), { id, text, kind }];
  render();
  setTimeout(() => { S.notes = S.notes.filter((n) => n.id !== id); render(); }, 3400);
}
const toast = (text, kind = '') => notify(t(text), kind === 'err' ? 'err' : kind);

// Language: the player's own choice, else the table's default, else the browser's.
const LANG_KEY = 'deadset:lang';
const wantedLang = () => {
  const pref = localStorage.getItem(LANG_KEY);
  if (isLang(pref)) return pref;
  const table = S.view?.table?.lang ?? S.peek?.lang;
  return isLang(table) ? table : browserLang();
};
let langLoading = null;
function syncLang() {
  const want = wantedLang();
  if (want === getLang() || langLoading === want) return;
  langLoading = want;
  loadLang(want).then(() => { langLoading = null; render(); });
}

// Sound policy. Public-event sounds: the TV board carries them when it's open
// and unmuted; phones then stay quiet. Interaction sounds: never at night (or
// for role-revealing taps), so nobody can be identified by what their phone does.
const onBoard = () => S.route?.name === 'board';
function pubSound(name, arg) {
  if (onBoard()) { if (S.board.audio) sound.play(name, arg); return; }
  if (V()?.boardAudio) return;
  sound.play(name, arg);
}
const secretPhase = () => { const v = V(); return !!v && isNight(v.phase); };
function uiSound(name) { if (!secretPhase()) sound.play(name); }
function uiHaptic(p) { if (!secretPhase()) haptic(p); }

async function api(path, body) {
  const res = await fetch(path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.msg ? tm(data.msg) : data.error ? t(data.error) : t('Request failed ({n})', { n: res.status })), { status: res.status, code: data.code });
  return data;
}

async function send(type, payload = {}, { quiet = false } = {}) {
  if (!S.token) return false;
  S.pending = true; render();
  try {
    await api(`/api/rooms/${S.code}/cmd`, { t: S.token, type, payload, phaseId: V()?.phaseId, key: uid() });
    return true;
  } catch (e) {
    if (!quiet) { toast(e.message, 'err'); haptic([20, 40, 20]); }
    return false;
  } finally {
    S.pending = false; render();
  }
}

// ── Routing & connection ───────────────────────────────────────────────────
function parseRoute() {
  const p = location.pathname.replace(/\/+$/, '') || '/';
  let m;
  if ((m = p.match(/^\/r\/([A-Za-z0-9]{6})$/))) return { name: 'room', code: m[1].toUpperCase() };
  if ((m = p.match(/^\/board\/([A-Za-z0-9]{6})$/))) return { name: 'board', code: m[1].toUpperCase() };
  if (p === '/guide') return { name: 'guide' };
  return { name: 'home' };
}
function go(path) { history.pushState({}, '', path); boot(); }
window.addEventListener('popstate', boot);

function disconnect() {
  S.es?.close();
  S.es = null; S.view = null; S.conn = 'idle';
  S.seenLog = null; S.seenPriv = null; S.moments = []; S.moment = null;
}

function boot() {
  S.route = parseRoute();
  const r = S.route;
  S.ui.sheet = null;
  if (r.name === 'room') {
    if (S.code !== r.code || !S.es) {
      disconnect();
      S.code = r.code;
      const sess = loadSession(r.code);
      S.token = sess?.token ?? null;
      S.pid = sess?.playerId ?? null;
      S.ui.invite = false; S.peek = null;
      if (S.token) connect(); else loadPeek();
    }
  } else if (r.name === 'board') {
    if (S.code !== r.code || !S.es) { disconnect(); S.code = r.code; S.token = null; connect(true); }
  } else {
    disconnect();
    S.code = null;
  }
  if (!S.content) loadContent();
  render();
}

async function reportBoardAudio(on) {
  if (!S.board.key) return;
  try { await api(`/api/rooms/${S.code}/board`, { key: S.board.key, audio: on }); } catch { /* best effort */ }
}

async function loadContent() {
  try { S.content = await api('/api/content'); setContent(S.content); render(); } catch { /* offline */ }
}

function connect(board = false) {
  const url = board ? `/api/rooms/${S.code}/events?board=1` : `/api/rooms/${S.code}/events?t=${encodeURIComponent(S.token)}`;
  S.conn = 'connecting';
  const es = new EventSource(url);
  S.es = es;
  es.addEventListener('state', (ev) => {
    const v = JSON.parse(ev.data);
    clockSkew = v.serverNow - Date.now();
    if (S.selPhase !== v.phaseId) { S.sel = {}; S.selPhase = v.phaseId; S.ui.tab = null; }
    const prev = S.view;
    detectMoments(v);
    if (board && prev && v.phase === 'LOBBY' && v.players.length > prev.players.length) pubSound('thud');
    S.view = v;
    S.conn = 'live';
    render();
  });
  es.addEventListener('board', (ev) => {
    S.board.key = JSON.parse(ev.data).key;
    if (S.board.audio) reportBoardAudio(true); // reconnected: tell the server again
  });
  es.addEventListener('revoked', () => {
    es.close();
    clearSession(S.code);
    S.token = null; S.view = null; S.es = null;
    toast(t('This seat was opened on another device, or you were removed.'), 'err');
    render();
  });
  es.onerror = async () => {
    if (es.readyState === EventSource.CLOSED) {
      S.es = null;
      try {
        const peek = await api(`/api/rooms/${S.code}/peek`);
        if (!peek.exists) { S.conn = 'gone'; S.view = null; clearSession(S.code); }
        else if (!board) { clearSession(S.code); S.token = null; S.view = null; S.conn = 'idle'; toast(t('Your session for this room has expired. Rejoin or recover your seat.'), 'err'); }
      } catch { S.conn = 'lost'; setTimeout(() => { if (!S.es && S.code) connect(board); }, 3000); }
      render();
    } else {
      S.conn = 'lost';
      render();
    }
  };
}

// ── Moments: cinematic interstitials driven by public events ───────────────
function detectMoments(v) {
  const top = maxI(v.log);
  const ptop = maxI(v.private);
  if (S.seenLog === null) {
    // Fresh load: no replay, except a shared scene sequence still playing, which this screen joins mid-way.
    S.seenPriv = ptop;
    const live = v.log.find((l) => l.mAt && l.mAt + l.mDur > v.serverNow);
    S.seenLog = live ? live.i - 1 : top;
    if (!live) return;
  }
  if (top < S.seenLog) S.seenLog = -1; // a rematch reset the record
  if (ptop < S.seenPriv) S.seenPriv = -1;
  const fresh = v.log.filter((l) => l.i > S.seenLog);
  const freshPriv = (v.private || []).filter((l) => l.i > S.seenPriv);
  S.seenLog = top; S.seenPriv = ptop;
  const sharedFrom = (l, start) => {
    // Moments this entry produced that the server runs as shared scenes get its window; the rest stay personal.
    if (!l.mAt) return;
    const types = scenesFor(l, fresh).map(([type]) => type);
    let at = l.mAt;
    const end = l.mAt + l.mDur;
    for (const m of out.slice(start)) {
      if (!types.includes(m.type)) continue;
      const dur = Math.min(sceneMs(m.type, sceneData(m)), end - at);
      if (dur <= 0) continue;
      Object.assign(m, { at, dur, tapOnly: false });
      at += dur;
    }
  };
  const name = (id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
  const meId = v.me?.id;
  const out = [];
  // Private: your Dream was swapped by a Snatcher. Shown only on your phone,
  // silently, as night actions open (everyone's actions open at the same time).
  if (v.phase === 'NIGHT_ACTIONS' && v.me?.dreamFrom && v.me?.dream && !S.swapShown?.[v.phaseId]) {
    (S.swapShown ||= {})[v.phaseId] = true;
    out.push({ type: 'dreamswap', from: v.me.dreamFrom.id, to: v.me.dream.id, stole: !!v.me.dreamStole, sound: null });
  }
  for (const l of fresh) {
    const start = out.length;
    entryMoments(l);
    sharedFrom(l, start);
  }
  // Side Missions: the owner learns at once (personal, queued behind any shared scene).
  if (v.mode === 'missions' && v.me && !v.me.moderator) for (const x of freshPriv.filter((e) => e.kind === 'side' && e.state)) out.push({ type: 'mside', side: x.side, state: x.state, sound: x.state === 'done' ? 'approve' : 'unpick', tapOnly: true });
  function entryMoments(l) {
    if (v.mode === 'missions') {
      if (l.ev === 'm-start') { const sc = fresh.find((x) => x.ev === 'scenario'); out.push({ type: 'night0', scenario: sc ? entryMsg(sc) : '', sc: v.scenario, rules: [], tapOnly: false }); return; }
      if (l.ev === 'm-dawn' && v.me && !v.me.moderator) {
        // The Candle gets its own reveal; everything else goes on the private card.
        for (const c of freshPriv.filter((x) => x.kind === 'candle' && x.target)) out.push({ type: 'mcandle', name: name(c.target), death: !!c.death, sound: 'candleLight', tapOnly: true });
        const reports = freshPriv.filter((x) => ['witness', 'clue', 'undertaker'].includes(x.kind) || (x.kind === 'candle' && !x.target));
        out.push({ type: 'private', reports: reports.map((x) => ({ msg: entryMsg(x), lines: x.lines, kind: x.kind })), tapOnly: true });
        return;
      }
      if (l.ev?.startsWith('m-')) { const mm = missionMoment(l, v, fresh, { notify, name, content: S.content }); if (mm) out.push(...[].concat(mm)); return; }
    }
    switch (l.ev) {
      case 'night0': {
        const sc = fresh.find((x) => x.ev === 'scenario');
        out.push({ type: 'night0', scenario: sc ? entryMsg(sc) : '', sc: v.scenario, rules: v.activeRules.map((r) => ({ id: r.id })), tapOnly: false });
        break;
      }
      case 'day1': out.push({ type: 'day1' }); break;
      case 'nightfall': out.push({ type: 'nightfall', n: l.n }); break;
      case 'bloodmoon': out.push({ type: 'bloodmoon', n: l.n }); break;
      case 'dawn': {
        const rev = fresh.find((x) => x.ev === 'revive' && x.i > l.i);
        out.push({ type: 'dawn', day: l.day, killed: (l.killed ?? []).map(name), expired: (l.expired ?? []).map(name), revived: (rev?.ids ?? []).map(name), meDied: (l.victims ?? []).includes(meId) });
        if (v.me && !v.me.moderator && v.me.alive) {
          const reports = freshPriv.filter((x) => (x.at === `Night ${l.day - 1}` || x.at === `Day ${l.day}`) && !['dreamdraw', 'surge', 'chat', 'role'].includes(x.kind));
          for (const g of reports.filter((x) => x.kind === 'gift')) {
            const prod = Array.isArray(g.msg) ? g.msg[1]?.product : null;
            if (prod) out.push({ type: 'gift', product: prod, idx: productIndex(S.content?.products ?? [], prod), sound: null, tapOnly: true });
          }
          out.push({ type: 'private', reports: reports.map((x) => ({ msg: entryMsg(x), lines: x.lines, kind: x.kind })), tapOnly: true });
        }
        break;
      }
      case 'revive': if (!fresh.some((x) => x.ev === 'dawn')) out.push({ type: 'revive', names: (l.ids ?? []).map(name) }); break;
      case 'vote-open': out.push({ type: 'call', kicker: ['Day {n}', { n: roman(v.dayNumber) }], title: 'The vote', sub: 'Cast your ballot in secret. You can change it until it locks.', sound: 'knock' }); break;
      case 'tally': {
        const coin = fresh.find((x) => x.i > l.i && x.ev === 'coinflip');
        if (coin) { out.push({ type: 'tally', totals: Object.entries(l.totals || {}).map(([id, w]) => ({ name: name(id), w, id })).sort((a, b) => b.w - a.w), threshold: l.threshold, outcome: 'tie', reason: '', sentenced: null, goat: null }); break; }
        const outcomeEv = fresh.find((x) => x.i > l.i && ['sentence', 'nosentence', 'cancelled', 'scapegoat'].includes(x.ev));
        const goat = fresh.find((x) => x.i > l.i && x.ev === 'scapegoat');
        const sentence = fresh.find((x) => x.i > l.i && x.ev === 'sentence');
        out.push({ type: 'tally', totals: Object.entries(l.totals || {}).map(([id, w]) => ({ name: name(id), w, id })).sort((a, b) => b.w - a.w),
          threshold: l.threshold, outcome: outcomeEv?.ev ?? 'nosentence', reason: outcomeEv ? entryMsg(outcomeEv) : '', sentenced: sentence ? name(sentence.victims[0]) : null,
          meSentenced: !!sentence?.victims?.includes(meId), goat: goat ? name(goat.victims[0]) : null });
        break;
      }
      case 'coinflip': out.push({ type: 'coin', tied: (l.tied ?? []).map(name), winner: name(l.winner), meSentenced: l.winner === meId, sound: 'coin' }); break;
      case 'heartbreak': out.push({ type: 'death', sound: 'death', art: 'heart', title: 'A broken heart', names: (l.victims ?? []).map(name), sub: 'Love would not let them stay.' }); break;
      case 'scapegoat':
        if (!fresh.some((x) => x.ev === 'tally')) out.push({ type: 'death', sound: 'scapegoat', title: 'The Scapegoat pays', names: (l.victims ?? []).map(name), sub: 'No one was sentenced.' });
        break;
      case 'shot': out.push({ type: 'death', sound: 'shot', title: 'A shot rings out', names: (l.victims ?? []).map(name), sub: l.victims?.length ? 'Nobody saw who pulled the trigger.' : 'The bullet found no one.' }); break;
      case 'final-act': out.push({ type: 'call', kicker: ruleF('EQUAL_EXCHANGE', 'name'), title: 'A final act', sub: 'The condemned may take one more with them.', sound: 'knock' }); break;
      case 'exchange': out.push({ type: 'death', title: 'An equal exchange', names: (l.victims ?? []).map(name), sub: 'The condemned did not go alone.' }); break;
      case 'end': out.push({ type: 'end', winner: l.winner, reason: l.reason, tapOnly: true }); break;
      case 'discussion': notify(t('Day {n} · the floor is open', { n: roman(v.dayNumber) })); break;
      case 'defense': notify(t('Defence: each nominee speaks in turn')); pubSound('spot'); break;
      case 'novote': notify(t('Nobody was nominated. No vote today.')); break;
      case 'nominate': {
        notify(t(l.first ? '{a} accuses {b}' : '{a} seconds {b}', { a: name(l.by), b: name(l.target) }), 'accuse');
        const k = v.log.filter((x) => x.ev === 'nominate' && x.target === l.target && x.at === l.at && x.i <= l.i).length;
        pubSound('accuse', k);
        break;
      }
      case 'immunity': notify(t('{a} claims diplomatic immunity', { a: name(l.who) })); pubSound('immunity'); break;
      case 'exchange-none': notify(t('The condemned went quietly.')); break;
      default: break;
    }
  }
  if (out.length) {
    S.moments.push(...out.map((m) => ({ ...m, id: uid() })));
    if (!S.moment) nextMoment();
    else if (!S.moment.at && out.some((m) => m.at)) { S.moments.unshift(S.moment); S.moment = null; nextMoment(); } // a shared scene pre-empts a personal one
  }
}
const sceneData = (m) => ({ rules: m.rules?.length ?? 0, dead: (m.killed?.length ?? 0) + (m.expired?.length ?? 0), n: m.cards ? m.cards.length : m.count ?? 0 });

const MOMENT_SOUND = { night0: 'night', day1: 'dawn', nightfall: 'night', dawn: 'dawn', tally: 'knock', death: 'death', revive: 'revive', bloodmoon: 'bloodmoon' };
const END_THEME = { DEATH: 'winDeath', NON_DEATH: 'winLiving', JESTER: 'winJester', LOVERS: 'winLovers', CULT: 'winCult', RIPPER: 'winRipper' };
const MOMENT_TIME = { coin: 5200, gift: 5600, night0: 7600, day1: 3200, nightfall: 3000, dawn: 4200, tally: 5200, death: 3600, revive: 3000, call: 2200, bloodmoon: 4600, dreamswap: 3800 };
const momentTime = (m) => (m.type === 'mreveal' ? revealTime(m) : MISSION_MOMENT_TIME[m.type] ? MISSION_MOMENT_TIME[m.type] : !onBoard() && m.type === 'nightfall' ? 1800 : onBoard() && m.type === 'dawn' ? 9000 : MOMENT_TIME[m.type] + (m.type === 'dawn' ? 600 * (m.killed.length + m.expired.length) : 0)) + (m.type === 'night0' ? m.rules.length * 700 : 0);

function nextMoment() {
  clearTimeout(S.momentTimer);
  const now = Date.now() + clockSkew;
  // Shared scenes run on the server's clock: drop any that already ended, and play them before personal ones.
  S.moments = S.moments.filter((x) => !x.at || x.at + x.dur > now);
  const k = S.moments.findIndex((x) => x.at);
  S.moment = (k >= 0 ? S.moments.splice(k, 1)[0] : S.moments.shift()) ?? null;
  const m = S.moment;
  if (m) {
    const snd = m.sound ?? MOMENT_SOUND[m.type];
    if (snd) pubSound(snd);
    if (m.type === 'dawn' && onBoard()) setTimeout(() => pubSound('page'), 300);
    if (m.type === 'dawn' && (m.killed.length || m.expired.length)) { setTimeout(() => pubSound('death'), 900); haptic([30, 80, 120]); }
    if (m.type === 'tally') setTimeout(() => { pubSound(m.sentenced || m.goat ? 'gavel' : 'tap'); if (m.sentenced) haptic([40, 50, 90]); }, 1700);
    if (m.type === 'death') haptic([30, 80, 120]);
    if (m.type === 'mreveal') {
      const n = m.cards ? m.cards.length : m.count;
      pubSound('heart');
      for (let i = 0; i < n; i++) setTimeout(() => { pubSound(m.cards ? (m.cards[i] === 'F' ? 'badCard' : 'goodCard') : 'flip'); if (m.cards?.[i] === 'F') haptic([40, 30, 60]); }, (2.2 + i * 1.15) * 1000 + 350);
      setTimeout(() => { pubSound(m.failed ? 'missionFail' : 'missionOk'); haptic(m.failed ? [60, 40, 120] : [20, 30, 20]); }, (2.2 + n * 1.15 + 0.4) * 1000);
    }
    if (m.type === 'mlottery') {
      // A tick for every seat the lantern passes, slowing down as it settles.
      const n = m.order.length; const steps = m.spins * n + m.idx; const dur = 5600;
      const ease = (x) => 1 - (1 - x) ** 3;
      let prev = 0;
      for (let k = 1; k <= steps; k++) {
        // invert the ease: when has the hand passed k of `steps` seats?
        let lo = 0, hi = 1; for (let it = 0; it < 18; it++) { const mid = (lo + hi) / 2; if (ease(mid) * steps < k) lo = mid; else hi = mid; }
        const at = 400 + hi * dur; if (at - prev < 45) continue; prev = at;
        setTimeout(() => pubSound('tick'), at);
      }
      setTimeout(() => { pubSound('approve'); haptic([30, 40, 30]); }, 400 + dur + 150);
    }
    if (m.type === 'mvotes') setTimeout(() => pubSound(m.approved ? 'approve' : m.goes ? 'knock' : 'unpick'), 1300);
    if (m.type === 'mcard') setTimeout(() => pubSound('flip'), 700);
    if (m.type === 'mnamed') setTimeout(() => pubSound(m.death ? 'gavel' : 'death'), 2400);
    if (m.type === 'mreckon') setTimeout(() => pubSound(m.hit ? 'death' : 'gavel'), 2800);
    if (m.type === 'nightfall' || m.type === 'night0') haptic(20);
    if (m.type === 'end') {
      const won = didIWin(V(), m.winner);
      setTimeout(() => {
        celebrate(m.winner === 'ABORTED' || m.winner === 'DRAW' ? 'neutral' : m.winner);
        pubSound(END_THEME[m.winner] ?? 'draw');
        // Your own result follows the table's theme, on your own phone only.
        if (!onBoard() && won !== null && !V()?.boardAudio) setTimeout(() => sound.play(won ? 'win' : 'lose'), 3200);
        haptic([40, 60, 40, 60, 120]);
      }, 500);
    }
    if (m.at) S.momentTimer = setTimeout(nextMoment, Math.max(50, m.at + m.dur - now));
    else if (!m.tapOnly) S.momentTimer = setTimeout(nextMoment, calm.matches ? Math.min(momentTime(m), 2500) : momentTime(m));
  }
  render();
}

/** A private report, with Insomnia's chronological lines when present. */
function reportHtml(msg, lines) {
  return `${tmh(msg)}${lines?.length ? `<ul class="ins-lines">${lines.map((l) => `<li>${tmh(l)}</li>`).join('')}</ul>` : ''}`;
}

const WIN_GLYPH = { DEATH: 'death', JESTER: 'jester', NON_DEATH: 'innocent', LOVERS: 'heart', CULT: 'cult', RIPPER: 'ripper' };
const WIN_CLASS = { NON_DEATH: 'living', LOVERS: 'lovers', CULT: 'cult', RIPPER: 'ripper' };

function didIWin(v, winner) {
  const me = v?.me;
  if (!me || me.moderator || winner === 'DRAW' || winner === 'ABORTED') return null;
  if (winner === 'JESTER') return v.jesterId === me.id;
  if (winner === 'LOVERS') return !!me.lover;
  if (winner === 'RIPPER') return me.alignment === 'RIPPER';
  if (winner === 'CULT') return me.alignment === 'CULT';
  return (winner === 'DEATH' && me.alignment === 'DEATH') || (winner === 'NON_DEATH' && me.alignment === 'NON_DEATH');
}

function momentHtml(m) {
  const names = (list, cls = '') => list.map((n, i) => `<li class="victim ${cls}" style="--d:${0.9 + i * 0.5}s"><span>${esc(n)}</span></li>`).join('');
  let body = '';
  switch (m.type) {
    case 'night0': {
      // 19 · The opening ceremony: the story cards are dealt and turned, then the rules.
      const sc = m.sc ?? { who: '?', where: '?', why: '?' };
      const cards = [['Who', 'mentalist', scen('WHO', sc.who)], ['Where', 'necro', scen('WHERE', sc.where)], ['Why', 'scroll', scen('WHY', sc.why)]];
      body = `<span class="kicker">${t('Night 0 · the story is dealt')}</span><h1 class="m-title">${letters(t('The game begins'))}</h1>
        <div class="cer-cards">${cards.map(([k, g, txt], i) => `<div class="cer-card" style="--d:${0.9 + i * 0.85}s"><div class="cer-in"><div class="cer-face back"><b>DS</b></div><div class="cer-face front">${glyph(g)}<span class="k">${t(k)}</span><b>${esc(txt)}</b></div></div></div>`).join('')}</div>
        <p class="m-sub cer-line" style="--d:3.6s">${tmh(m.scenario)}</p>
        ${m.rules.length ? `<div class="cer-rules">${m.rules.map((r, i) => `<div class="cer-rule" style="--d:${4.2 + i * 0.7}s">${glyph(ruleGlyph(r.id))}<span><span class="k">${t('Rule card')}</span><b>${esc(ruleF(r.id, 'name'))}</b><small>${esc(ruleF(r.id, 'text'))}</small></span></div>`).join('')}</div>` : ''}
        <p class="m-sub small cer-line" style="--d:${4.6 + m.rules.length * 0.7}s">${onBoard() ? t('Players: look only at your own screen.') : t('Next: your role card, face down. Look only at your own screen.')}</p>`;
      break;
    }
    case 'day1':
      body = `<div class="m-art sunrise">${glyph('sun')}</div><span class="kicker">${t('Day {n}', { n: 'I' })}</span><h1 class="m-title">${letters(t('Morning'))}</h1><p class="m-sub">${t('Nobody has died — yet.')}</p>`;
      break;
    case 'nightfall':
      body = `<div class="m-art">${moon(0.35, 'rise')}<span class="stars"><i></i><i></i><i></i><i></i><i></i></span></div><span class="kicker">${t('Night {n}', { n: roman(m.n) })}</span><h1 class="m-title">${letters(t('Night falls'))}</h1><p class="m-sub">${t('Close your eyes. Keep your screen to yourself.')}</p>`;
      break;
    case 'bloodmoon':
      body = `<div class="m-art blood-moon-art">${moon(1, 'rise blood')}<span class="stars"><i></i><i></i><i></i></span></div><span class="kicker blood">${t('Night {n}', { n: roman(m.n) })}</span><h1 class="m-title blood">${letters(t('Blood Moon'))}</h1><p class="m-sub">${t('Two nights passed without a death. Tonight no protection holds, and nothing can stay Death\'s hand.')}</p>`;
      break;
    case 'dreamswap':
      body = `<span class="kicker">${m.stole ? esc(dreamF('DREAM_SNATCHER', 'name')) : t('A Dream Snatcher struck')}</span><h1 class="m-title">${letters(t(m.stole ? 'You stole a dream' : 'Your dream was stolen'))}</h1>
        <div class="swap-cards"><div class="swap-card gone">${dreamGlyph(m.from)}<b>${esc(dreamF(m.from, 'name'))}</b></div><span class="swap-arrow">⟶</span><div class="swap-card new">${dreamGlyph(m.to)}<b>${esc(dreamF(m.to, 'name'))}</b><small>${esc(dreamF(m.to, 'text'))}</small></div></div>
        <p class="m-sub small">${t('Tonight you dream this instead. Keep it to yourself.')}</p>`;
      break;
    case 'dawn': {
      if (onBoard()) { body = frontPageHtml(V(), m, H); break; }
      const dead = m.killed.length + m.expired.length;
      body = `<div class="m-art sunrise">${glyph('sun')}</div><span class="kicker">${t('Dawn · Day {n}', { n: roman(m.day) })}</span>
        <h1 class="m-title ${m.meDied ? 'blood' : ''}">${letters(t(m.meDied ? 'You did not wake' : dead ? 'Found dead' : 'Everyone woke'))}</h1>
        ${dead ? `<ul class="victims">${names(m.killed)}${names(m.expired, 'expired')}</ul>${m.expired.length ? `<p class="m-sub small">${t('Borrowed time ran out for some.')}</p>` : ''}` : `<p class="m-sub">${t('The night passed quietly.')}</p>`}
        ${m.revived.length ? `<p class="m-sub revive">${th(m.revived.length > 1 ? '{names} have returned from the grave.' : '{names} has returned from the grave.', { names: m.revived })}</p>` : ''}`;
      break;
    }
    case 'private':
      body = `<div class="m-art">${glyph('mentalist')}</div><span class="kicker">${t('Only you know')}</span><h1 class="m-title">${letters(t('Your night'))}</h1>
        ${m.reports.length ? `<ul class="m-reports">${m.reports.map((r, i) => `<li style="--d:${0.5 + i * 0.35}s">${reportHtml(r.msg, r.lines)}</li>`).join('')}</ul>` : `<p class="m-sub">${t('You slept. Nothing reached you.')}</p>`}
        <p class="m-sub small">${t('Keep this to yourself — or don\'t.')}</p>`;
      break;
    case 'revive':
      body = `<div class="m-art">${glyph('necro')}</div><span class="kicker">${t('The grave opens')}</span><h1 class="m-title">${letters(t('Returned'))}</h1><p class="m-sub">${th('{names} walk among you — until the next dawn.', { names: m.names })}</p>`;
      break;
    case 'call':
      body = `<span class="kicker">${tmh(m.kicker)}</span><h1 class="m-title">${letters(t(m.title))}</h1><p class="m-sub">${tmh(m.sub)}</p>`;
      break;
    case 'tally': {
      const max = Math.max(1, ...m.totals.map((x) => x.w));
      const outcome = m.sentenced
        ? `<div class="verdict-stamp ${m.meSentenced ? 'me' : ''}"><span class="v-name">${esc(m.meSentenced ? t('You') : m.sentenced)}</span><span class="stamp">${t('Sentenced')}</span></div>`
        : m.outcome === 'tie' ? `<div class="verdict-stamp"><span class="v-name">${t('A tie')}</span><span class="stamp soft">${t('Coin toss')}</span></div>`
        : m.outcome === 'cancelled' ? `<div class="verdict-stamp"><span class="v-name">${t('Fate intervenes')}</span><span class="stamp soft">${t('Cancelled')}</span></div><p class="m-sub small">${t('A wager was won. Nobody hangs today.')}</p>`
          : `<div class="verdict-stamp"><span class="v-name">${t('No one')}</span><span class="stamp soft">${t('Spared')}</span></div><p class="m-sub small">${tmh(m.reason)}</p>`;
      body = `<span class="kicker">${t('The ballots')}</span><h1 class="m-title">${letters(t('The town decides'))}</h1>
        ${m.totals.length ? `<ul class="bars">${m.totals.map((x, i) => `<li style="--w:${(x.w / max) * 100}%;--d:${0.3 + i * 0.15}s"><span class="b-name">${esc(x.name)}</span><span class="b-bar"><i></i></span><span class="b-n">${x.w}</span></li>`).join('')}</ul>` : `<p class="m-sub">${t('No valid votes.')}</p>`}
        ${m.threshold != null ? `<p class="m-sub small">${t('Majority Rule: more than {n} needed.', { n: m.threshold })}</p>` : ''}
        <div class="m-outcome">${outcome}${m.goat ? `<p class="m-sub blood">${th('The Scapegoat pays: {a} dies.', { a: m.goat })}</p>` : ''}</div>`;
      break;
    }
    case 'coin': {
      const faces = m.tied.length === 2 ? m.tied : [m.winner, '?'];
      const lands = faces[0] === m.winner ? 0 : 1;
      body = `<span class="kicker">${t('The vote is tied')}</span><h1 class="m-title">${letters(t('A coin decides'))}</h1>
        <div class="coin-stage"><div class="coin lands-${lands}"><div class="coin-face heads"><span>${esc(faces[0])}</span></div><div class="coin-face tails"><span>${esc(faces[1])}</span></div></div><div class="coin-shadow"></div></div>
        ${m.tied.length > 2 ? `<p class="m-sub small">${th('Tied: {names}', { names: m.tied })}</p>` : ''}
        <div class="verdict-stamp coin-verdict ${m.meSentenced ? 'me' : ''}"><span class="v-name">${esc(m.meSentenced ? t('You') : m.winner)}</span><span class="stamp">${t(V()?.mode === 'missions' ? 'Named' : 'Sentenced')}</span></div>`;
      break;
    }
    case 'gift': body = giftHtml(m.idx, { t, th, esc, product: m.product }); break;
    case 'mside': case 'mlottery': case 'mlantern': case 'mintro': case 'mcandle': case 'mcard': case 'mvotes': case 'mreveal': case 'mnamed': case 'munmask': case 'mreckon': body = missionMomentHtml(m, { letters, avatarSvg, onBoard }); break;
    case 'death':
      body = `<div class="m-art">${glyph(m.art || 'dagger')}</div><h1 class="m-title">${letters(t(m.title))}</h1>${m.names.length ? `<ul class="victims">${names(m.names)}</ul>` : ''}<p class="m-sub">${tmh(m.sub)}</p>`;
      break;
    case 'end': {
      const title = t({ DEATH: 'Death wins', NON_DEATH: 'The living win', JESTER: 'The Jester wins', DRAW: 'A draw', ABORTED: 'Abandoned', LOVERS: 'The Lovers win', CULT: 'The Cult wins', RIPPER: 'The Ripper wins' }[m.winner] ?? 'The end');
      const won = didIWin(V(), m.winner);
      body = `<div class="m-art">${glyph(WIN_GLYPH[m.winner] ?? 'scroll')}</div>
        <span class="kicker">${t('The verdict')}</span><h1 class="m-title ${m.winner === 'DEATH' ? 'blood' : ''}">${letters(title)}</h1><p class="m-sub">${tmh(m.reason)}</p>
        ${won === null ? '' : `<div class="result-stamp ${won ? 'win' : 'loss'}">${t(won ? 'Victory' : 'Defeat')}</div>`}`;
      break;
    }
    default: break;
  }
  const auto = !m.tapOnly;
  const left = m.at ? Math.max(0, m.at + m.dur - (Date.now() + clockSkew)) : momentTime(m);
  return `<div class="moment ${m.at ? 'shared' : ''} m-${m.type} ${m.winner === 'DEATH' || m.type === 'death' || m.type === 'munmask' ? 'grim' : ''} ${m.type === 'end' ? WIN_CLASS[m.winner] ?? '' : ''} ${onBoard() && m.type === 'dawn' ? 'front' : ''}" data-key="moment-${m.id}" data-act="momentNext" role="dialog" aria-live="assertive">
    ${m.type === 'end' && WIN_CLASS[m.winner] ? '<div class="sunburst" aria-hidden="true"></div>' : ''}<div class="m-body">${body}</div>
    <div class="m-foot">${auto ? `<span class="m-timer" style="--t:${left}ms"><i></i></span>` : ''}<span class="kicker">${t(m.at ? 'Everyone sees this together' : auto ? 'Tap to skip' : 'Tap to continue')}${S.moments.length ? ` · ${t('{n} more', { n: S.moments.length })}` : ''}</span></div>
  </div>`;
}

// ── DOM morphing (keeps elements alive so transitions actually animate) ────
function morph(el, html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  morphChildren(el, tpl.content);
}
function sameNode(a, b) {
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) return false;
  return a.nodeType !== 1 || a.getAttribute('data-key') === b.getAttribute('data-key');
}
function morphNode(a, b) {
  if (a.nodeType === 3 || a.nodeType === 8) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
  for (const { name, value } of [...b.attributes]) if (a.getAttribute(name) !== value) a.setAttribute(name, value);
  for (const { name } of [...a.attributes]) {
    if (b.hasAttribute(name)) continue;
    if (name === 'style' || (name === 'open' && a.tagName === 'DETAILS')) continue; // JS-driven / user-driven
    a.removeAttribute(name);
  }
  if (a.tagName === 'INPUT') {
    if (a.type === 'checkbox' || a.type === 'radio') { if (!(S.pending && a === document.activeElement)) a.checked = b.hasAttribute('checked'); }
    else if (a !== document.activeElement && a.value !== (b.getAttribute('value') ?? '')) a.value = b.getAttribute('value') ?? '';
    return;
  }
  if (a.tagName === 'TEXTAREA') { if (a !== document.activeElement) a.value = b.textContent; return; }
  morphChildren(a, b);
  if (a.tagName === 'SELECT' && a !== document.activeElement) {
    const o = [...b.querySelectorAll('option')].find((x) => x.hasAttribute('selected'));
    if (o) a.value = o.getAttribute('value') ?? o.textContent;
  }
}
function morphChildren(a, b) {
  const keyed = new Map();
  for (const c of a.children) { const k = c.getAttribute('data-key'); if (k) keyed.set(k, c); }
  let cur = a.firstChild;
  for (const nb of [...b.childNodes]) {
    const k = nb.nodeType === 1 ? nb.getAttribute('data-key') : null;
    let m = null;
    if (k) { m = keyed.get(k); if (m && m.nodeName !== nb.nodeName) m = null; if (m) keyed.delete(k); } else if (cur && sameNode(cur, nb)) m = cur;
    if (m) {
      if (m === cur) cur = cur.nextSibling; else a.insertBefore(m, cur);
      morphNode(m, nb);
    } else {
      a.insertBefore(nb, cur);
    }
  }
  while (cur) { const nx = cur.nextSibling; a.removeChild(cur); cur = nx; }
}

function render() {
  if (!S.route) return; // content can arrive before the first route is set
  syncLang();
  const bottoms = {};
  document.querySelectorAll('[data-scroll]').forEach((el) => { bottoms[el.dataset.scroll] = el.scrollHeight - el.scrollTop - el.clientHeight < 30; });
  const v = V();
  const night = !!v && isNight(v.phase) && ['room', 'board'].includes(S.route?.name);
  document.body.dataset.time = night ? 'night' : 'day';
  document.body.classList.toggle('has-moment', !!S.moment);
  document.body.classList.toggle('blood-moon', !!v?.bloodMoon && night);
  const ghost = !!v?.me && !v.me.moderator && v.me.alive === false && v.phase !== 'LOBBY' && v.phase !== 'ENDED' && S.route?.name === 'room';
  document.body.classList.toggle('is-dead', ghost);
  document.body.classList.toggle('is-board', onBoard());
  if (onBoard() && v && S.board.audio && v.table?.score !== false) { score.play(moodFor(v)); score.tension(tenseFor(v)); } else score.stop();
  document.body.classList.toggle('has-sheet', !!S.ui.sheet && (S.route?.name === 'room' || S.ui.sheet === 'lang' || S.ui.sheet === 'avatar'));
  ambient(night ? 'night' : null);
  morph(app, view());
  app.querySelectorAll('[data-scroll]').forEach((el) => { if (bottoms[el.dataset.scroll] !== false) el.scrollTop = el.scrollHeight; });
  tickClock();
}

function view() {
  const r = S.route;
  let html = '';
  if (r.name === 'home') html = homeScreen();
  else if (r.name === 'guide') html = guideScreen();
  else if (r.name === 'board') html = boardView();
  else if (r.name === 'room') {
    if (S.conn === 'gone') html = goneScreen();
    else if (!S.token) html = joinScreen();
    else if (!V()) html = loadingScreen();
    else html = roomScreen();
  }
  if ((S.ui.sheet === 'lang' || S.ui.sheet === 'avatar') && !(r.name === 'room' && S.token && V())) html += sheet(V());
  if (S.ui.recap && V()?.recap) html += recapHtml(V());
  if (S.moment) html += momentHtml(S.moment);
  if (S.conn === 'lost' && S.code) html += `<div class="conn" data-key="conn" role="status"><span class="pulse-dot"></span>${t('Reconnecting… your choices are safe on the server.')}</div>`;
  html += `<div class="toasts" data-key="toasts" aria-live="polite">${S.notes.map((n) => `<div class="toast ${n.kind}" data-key="n-${n.id}">${esc(n.text)}</div>`).join('')}</div>`;
  return html;
}

// ── Timer ──────────────────────────────────────────────────────────────────
const fuseSpan = new Map();
let lastTick = null;
function tickClock() {
  const v = V();
  const now = Date.now() + clockSkew;
  const left = v?.deadline ? Math.max(0, v.deadline - now) : null;
  if (v?.deadline && !fuseSpan.has(v.phaseId)) fuseSpan.set(v.phaseId, Math.max(1000, left));
  const frac = left == null ? 1 : Math.min(1, left / (fuseSpan.get(v.phaseId) || 1));
  document.querySelectorAll('[data-fuse]').forEach((el) => {
    el.hidden = left == null;
    el.firstElementChild.style.width = `${frac * 100}%`;
    el.classList.toggle('low', left != null && left < 10000);
  });
  document.querySelectorAll('[data-ringfuse]').forEach((el) => {
    el.classList.toggle('off', left == null);
    el.classList.toggle('low', left != null && left < 10000);
    el.querySelector('.burn').style.strokeDashoffset = String(100 - frac * 100);
  });
  const secs = left == null ? null : Math.ceil(left / 1000);
  if (onBoard()) {
    // 2 · the sun / moon rides the table's own timer ring, at the burning end
    const orb = document.querySelector('[data-orb]');
    if (orb) {
      const a = (-90 + frac * 360) * (Math.PI / 180);
      orb.style.left = `${50 + 49 * Math.cos(a)}%`;
      orb.style.top = `${50 + 49 * Math.sin(a)}%`;
    }
    const pressure = secs != null && secs <= 10 && secs > 0;
    document.body.classList.toggle('pressure', pressure);
    if (pressure && secs !== lastTick && !S.moment) pubSound('heart');
  }
  document.querySelectorAll('[data-clock]').forEach((el) => {
    el.textContent = secs == null ? '' : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    el.classList.toggle('low', secs != null && secs <= 10);
  });
  document.querySelectorAll('[data-secs]').forEach((el) => { el.textContent = secs == null ? '' : String(secs); });
  if (secs != null && secs <= 5 && secs > 0 && secs !== lastTick && S.route?.name === 'room' && !S.moment && v.phase !== 'NIGHT_DREAM_SWAP') pubSound('tick');
  lastTick = secs;
}
setInterval(tickClock, 250);
const fuse = () => '<div class="fuse" data-fuse data-key="fuse" hidden><i></i></div>';

// ── Labels ─────────────────────────────────────────────────────────────────
function phaseWord(v) {
  if (v.phase === 'LOBBY') return { word: t('Lobby'), num: '', night: false };
  if (v.phase === 'ENDED') return { word: t('The End'), num: '', night: false };
  if (v.phase === 'NIGHT_0_REVEAL') return { word: t('Night'), num: '0', night: true };
  if (v.phase === 'M_REVEAL') return { word: t('Missions'), num: '', night: true };
  if (isMissionPhase(v.phase)) return { word: v.phase === 'M_LAST_STAND' || v.phase === 'M_RECKONING' ? t('The End') : t('Mission'), num: v.phase === 'M_LAST_STAND' || v.phase === 'M_RECKONING' ? '' : roman((v.missions?.mission ?? 0) + 1), night: v.phase === 'M_NIGHT' };
  if (isNight(v.phase) || v.phase === 'NIGHT_RESOLVING') return { word: t('Night'), num: roman(v.nightNumber), night: true };
  return { word: t('Day'), num: roman(v.dayNumber), night: false };
}
const STEP_EN = {
  LOBBY: 'Gathering', NIGHT_0_REVEAL: 'Role reveal', DAY_PREP: 'Morning', DAY_DISCUSSION: 'Discussion',
  DAY_DEFENSE: 'Defence', DAY_VOTING: 'Secret ballot', DAY_RESOLVING: 'Final act', NIGHT_DREAM_SWAP: 'Nightfall', NIGHT_ACTIONS: 'Night actions', ENDED: 'Match over',
  M_REVEAL: 'Role reveal', M_LOTTERY: 'The first leader', M_PROPOSE: 'The proposal', M_VOTE: 'Team vote', M_MISSION: 'On the mission', M_RESULT: 'The reveal',
  M_NIGHT: 'Night interlude', M_LAST_STAND: 'The Last Stand', M_RECKONING: 'The Reckoning',
};
const STEP = new Proxy(STEP_EN, { get: (o, k) => (o[k] ? t(o[k]) : undefined) });
// The phase label, aware of the Open Ballot rule (votes are public then).
const stepOf = (v) => (v.phase === 'DAY_VOTING' && v.day?.openBallots ? t('Open ballot') : STEP[v.phase] ?? '');
const ALIGN_EN = { DEATH: 'Death', NON_DEATH: 'Non-Death', INDEPENDENT: 'Independent', CULT: 'Cult', RIPPER: 'The Ripper' };
const ALIGN = new Proxy(ALIGN_EN, { get: (o, k) => (o[k] ? t(o[k]) : undefined) });
const wordmark = () => '<a class="wordmark" href="/" data-link data-key="wm">Dead<i>Set</i><span class="seal"></span></a>';

// ── Home / join / guide ────────────────────────────────────────────────────
const WHISPERS = [
  'Bo was found dead. Nobody saw the Whore leave.',
  'The town hanged the Jester. He laughed.',
  'The Mentalist knew. Nobody believed her.',
  'Two votes short. The Scapegoat paid.',
  'Fay swore she was the Guardian. So did Gus.',
  'The Necromancer raised the wrong friend.',
  'A bomb at the door. A coin, flipped.',
  'Everyone woke. Somehow that was worse.',
  'Death voted with the town. Of course it did.',
];
let whisperTimer = null;
function seatXY(i, n, R) {
  const a = (-90 + (i * 360) / n) * (Math.PI / 180);
  return [(50 + R * Math.cos(a)).toFixed(2), (50 + R * Math.sin(a)).toFixed(2)];
}

// ── A · The Empty Table (home) ─────────────────────────────────────────────
function homeScreen() {
  const d = S.drafts;
  const tab = S.ui.homeTab;
  if (!whisperTimer) whisperTimer = setInterval(() => { if (S.route?.name === 'home') { S.whisper = (S.whisper ?? 0) + 1; render(); } }, 6500);
  const lines = tx('whispers', WHISPERS);
  const line = lines[(S.whisper ?? 0) % lines.length];
  const chairs = Array.from({ length: 7 }, (_, i) => { const [x, y] = seatXY(i, 7, 41); return `<span class="chair" style="left:${x}%;top:${y}%;--i:${i}">${sigil(`chair${i}`)}<i></i></span>`; }).join('');
  const code = (d.joinCode ?? '').toUpperCase();
  return `<main class="home2" data-key="home">
    <div class="h-top">${wordmark()}<div class="row" style="gap:6px">${langChip()}<button class="chip" data-act="sound" aria-label="${t(sound.on ? 'Mute' : 'Sound on')}">${glyph(sound.on ? 'bell' : 'bellOff')}</button><a class="chip" href="/guide" data-link>${t('How to play')}</a></div></div>
    <div class="h-grid">
      <section class="h-table" aria-hidden="true">
        <div class="h-ring"><div class="h-tabletop"></div>${chairs}
          <div class="h-title"><h1>${letters('Dead')}<br><i>${letters('Set.')}</i></h1><p>${t('Death sits among you.')}</p></div>
        </div>
        <p class="whisper" data-key="wh-${S.whisper ?? 0}">“${esc(line)}”</p>
      </section>
      <section class="h-panel">
        <p class="h-tag">${t('Hidden roles. Secret votes. Find them before they outnumber you.')}</p>
        <div class="seg" role="tablist"><button role="tab" data-act="homeTab" data-id="host" aria-pressed="${tab === 'host'}">${t('Host a table')}</button><button role="tab" data-act="homeTab" data-id="join" aria-pressed="${tab === 'join'}">${t('Join a table')}</button></div>
        ${tab === 'host' ? `<div class="stack" data-key="h-host">
          <label class="field"><span>${t('Your name')}</span><input class="input" maxlength="20" autocomplete="nickname" placeholder="${esc(t('e.g. Morgan'))}" data-draft="createName" value="${esc(d.createName ?? '')}"></label>
          ${S.ui.moderated ? '' : portraitRow(null)}
          <label class="check"><input type="checkbox" data-act="toggleModerated" ${S.ui.moderated ? 'checked' : ''}><span><b>${t('I\'ll moderate, not play')}</b><small>${t('Sees every secret, holds no seat. Everyone is told.')}</small></span></label>
          ${tutorialToggle()}
          <button class="btn btn-solid btn-wide btn-tall" data-act="create" ${S.pending ? 'disabled' : ''}>${t('Pull up a chair')}</button>
        </div>` : `<div class="stack" data-key="h-join">
          <label class="code-in" aria-label="${esc(t('Room code'))}">
            <input data-draft="joinCode" maxlength="6" autocapitalize="characters" autocomplete="off" spellcheck="false" inputmode="text" value="${esc(code)}">
            ${Array.from({ length: 6 }, (_, i) => `<span class="${i === Math.min(code.length, 5) ? 'cur' : ''} ${code[i] ? 'on' : ''}">${esc(code[i] ?? '')}</span>`).join('')}
          </label>
          <button class="btn btn-wide btn-tall ${code.length === 6 ? 'btn-solid' : ''}" data-act="gotoRoom" ${code.length === 6 ? '' : 'disabled'}>${t('Find the table')}</button>
          <p class="foot">${t('Or scan the QR code on the host\'s screen')}</p>
        </div>`}
        <p class="foot">${t('5–13 players · one phone each · no app to install')}</p>
      </section>
    </div>
  </main>`;
}

// ── E · The Invitation (link or QR, no seat yet) ───────────────────────────
async function loadPeek() {
  try { S.peek = await api(`/api/rooms/${S.code}/peek`); if (!S.peek.exists) S.conn = 'gone'; } catch { S.peek = { exists: true, phase: 'LOBBY' }; }
  render();
}
function joinScreen() {
  const d = S.drafts;
  const pk = S.peek;
  const hostName = pk?.host ?? t('Someone');
  if (!S.ui.invite) {
    return `<main class="invite2" data-key="inv-sealed">
      <div class="h-top">${wordmark()}${langChip()}</div>
      <span class="kicker inv-kicker">${t('A letter for you')}</span>
      <div class="envelope"><div class="flap"></div><div class="addr">${t('For whoever holds this link')}<small>${th('Table {code}', { code: S.code })}${pk?.seated != null ? ` · ${t('{n} seated', { n: pk.seated })}` : ''}</small></div></div>
      <button class="wax-btn ${S.ui.holding === 'seal' ? 'holding' : ''}" data-hold="openSeal" data-key="hold-seal" aria-label="${esc(t('Press and hold to break the seal'))}">
        <svg class="wax-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" pathLength="100"/></svg><span class="wax"><span>DS</span></span>
      </button>
      <div class="inv-hint"><p>${t('Press and hold the seal')}</p><span class="small muted">${th('{a} has saved you a seat.', { a: hostName })}</span></div>
      <button class="inv-recover" data-act="recoverInvite">${t('Already seated? Recover your seat')}</button>
    </main>`;
  }
  const started = pk && pk.phase !== 'LOBBY';
  const meta = pk ? `<div class="meta"><span>${esc(presetF(pk.preset, 'name'))}</span><span>${t('{n} of {max} seated', { n: pk.seated, max: pk.max })}</span><span>${t(pk.rules === 1 ? '{n} rule card' : '{n} rule cards', { n: pk.rules })}</span></div>` : '';
  let body;
  if (S.ui.recover) {
    body = `<span class="k">${th('Table {code} · recover your seat', { code: S.code })}</span><h2>${t('Back to <i>your chair.</i>')}</h2>
      <p>${t('Ask the host for a one-time recovery code. Your old device will be signed out.')}</p>
      <label class="sign"><input data-draft="recCode" maxlength="8" autocomplete="off" placeholder="${esc(t('Recovery code'))}" value="${esc(d.recCode ?? '')}"><small>${t('Code')}</small></label>
      <button class="btn btn-blood btn-wide" data-act="recover">${t('Recover my seat')}</button>
      <button class="letter-link" data-act="toggleRecover">${t('Join as a new player instead')}</button>`;
  } else if (started) {
    body = `<span class="k">${th('Table {code}', { code: S.code })}</span><h2>${t('The table has <i>already begun.</i>')}</h2>
      <p>${t('New seats can\'t be added mid-game. If this is your seat, recover it with a code from the host.')}</p>${meta}
      <button class="btn btn-blood btn-wide" data-act="toggleRecover">${t('Recover my seat')}</button>`;
  } else {
    body = `<span class="k">${th('Table {code} · an invitation', { code: S.code })}</span>
      <h2>${th('<i>{a}</i> has saved you a seat.', { a: hostName })}</h2>
      <p>${t('You are invited to a table of strangers, with Death roaming amongst them in secret.')}</p>${meta}
      <label class="sign"><input data-draft="joinName" maxlength="20" autocomplete="nickname" placeholder="${esc(t('Your name'))}" value="${esc(d.joinName ?? '')}"><small>${t('Sign your name')}</small></label>
 <button class="letter-portrait" data-act="avatarSheet">${avatarSvg(myAvatar(), 'lp-av')}<span>${t('Your portrait')}</span></button>
      <label class="letter-check"><input type="checkbox" data-act="tutorialToggle" ${tipsOn() ? 'checked' : ''}><span>${t('First game? Show me tips as we play')}</span></label>
      <button class="btn btn-blood btn-wide" data-act="join" ${S.pending ? 'disabled' : ''}>${t('Take my seat')}</button>
      <button class="letter-link" data-act="toggleRecover">${t('Already seated? Recover your seat')}</button>`;
  }
  return `<main class="invite2" data-key="inv-open">
    <div class="h-top">${wordmark()}${langChip()}</div>
    <div class="seal-shards" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="letter">${body}</div>
  </main>`;
}
const loadingScreen = () => `<main class="main narrow" data-key="load">${wordmark()}<div class="loading"><span class="pulse-dot"></span> ${t('Finding your seat…')}</div></main>`;
const goneScreen = () => `<main class="main narrow" data-key="gone">${wordmark()}<header class="phase-head"><h1>${t('No such <i>table.</i>')}</h1><p class="muted">${th('Room {code} doesn\'t exist, or it has been cleared away.', { code: S.code })}</p></header><a class="btn" href="/" data-link>${t('Back to start')}</a></main>`;
const guideScreen = () => `<main class="main" style="max-width:820px" data-key="guide"><div class="row between">${wordmark()}<div class="row">${langChip()}<button class="btn btn-sm" data-act="back">${t('Back')}</button></div></div>${renderGuide(S.content, H)}</main>`;

/** Language picker chip (opens the language sheet). */
function langChip() {
  return `<button class="chip lang-chip" data-act="langSheet" aria-label="${esc(t('Language'))}">${glyph('whispers')}<span>${esc(getLang().toUpperCase())}</span></button>`;
}

// ── The table ring ─────────────────────────────────────────────────────────
/**
 * Seats drawn around a table in seating order. When `pick` is set, the
 * selectable seats become buttons: tapping a seat is how you target anyone.
 */
function ring(v, { pick = null, center = '', slots = 0, reveal = false, marks = {}, lobby = false, crack = false, extra = '' } = {}) {
  const players = [...v.players].sort((a, b) => a.seat - b.seat);
  const n = Math.max(players.length, slots);
  const { pos, tok, dense } = seatLayout(n);
  const me = v.me;
  const d = v.day;
  const nomIdx = (id) => (d?.nominees ?? []).indexOf(id);
  const sel = new Set(pick?.selected?.filter(Boolean) ?? []);
  const can = new Set(pick?.ids ?? []);
  const seats = [];
  for (let i = 0; i < n; i++) {
    const x = pos[i].x.toFixed(2);
    const y = pos[i].y.toFixed(2);
    const p = players[i];
    if (!p) { seats.push(`<div class="tok empty" data-key="slot-${i}" style="left:${x}%;top:${y}%"><span class="tok-disc"></span><span class="tok-name">${t('empty')}</span></div>`); continue; }
    const selectable = can.has(p.id);
    const isSel = sel.has(p.id);
    const ni = nomIdx(p.id);
    const cls = ['tok',
      p.alive ? '' : 'dead', p.id === me?.id ? 'me' : '', p.connected ? '' : 'away',
      isSel ? 'sel' : '', selectable ? 'can' : pick ? 'mute' : '', pick?.tone === 'kill' ? 'kill' : '',
      ni >= 0 ? 'accused' : '', d?.speaking === p.id ? 'speaking' : '', p.immune ? 'immune' : '',
      lobby ? (p.ready ? 'ready' : 'unready') : '', reveal && p.alignment === 'DEATH' ? 'death' : '',
      me?.teammates?.some((t) => t.id === p.id) ? 'mate' : '', pos[i].inner ? 'inner' : '',
      // What this phone privately knows (Missions): Death seen by the Medium or by Candlelight, the Believer's candles.
      me?.seesDeath?.some((x) => x.id === p.id) || me?.candleSeen?.some((x) => x.id === p.id && x.death) ? 'known-death' : '',
      me?.candleSeen?.some((x) => x.id === p.id && !x.death) || me?.twin?.id === p.id ? 'known-living' : '',
      me?.candles?.some((x) => x.id === p.id) ? 'known-candle' : '',
    ].filter(Boolean).join(' ');
    const badges = [];
    if (ni >= 0) badges.push(`<b class="bdg b-nom" data-key="nom">${roman(ni + 1)}</b>`);
    if (p.immune) badges.push(`<b class="bdg b-imm" data-key="imm">${glyph('diplomat')}</b>`);
    if (p.revived) badges.push(`<b class="bdg b-rev" data-key="rev">${glyph('necro')}</b>`);
    if (p.id === v.hostId && v.phase === 'LOBBY') badges.push('<b class="bdg b-host" data-key="host"></b>');
    if (lobby && p.ready) badges.push(`<b class="bdg b-ok" data-key="ok">${glyph('check')}</b>`);
    if (marks[p.id]) badges.push(`<b class="bdg b-mark" data-key="mark">${marks[p.id]}</b>`);
    if (pick?.stamp === p.id) badges.push(`<b class="bdg b-stamp" data-key="stamp-${p.id}">${glyph('check')}</b>`);
    const inner = reveal && p.role ? glyph(p.role.glyph) : p.avatar ? avatarSvg(p.avatar, 'tok-av') : `<span class="tok-ini">${initials(p.name)}</span>`;
    if (p.bot && (lobby || v.phase === 'LOBBY')) badges.push(`<b class="bdg b-bot" data-key="bot">${glyph('bot')}</b>`);
    const label = `${esc(p.name)}${p.alive ? '' : `, ${t('dead')}`}${isSel ? `, ${t('selected')}` : ''}`;
    seats.push(`<button type="button" class="${cls}" data-key="tok-${p.id}" style="left:${x}%;top:${y}%" ${selectable ? `data-act="${pick.act}" data-id="${p.id}"` : 'tabindex="-1"'} aria-pressed="${isSel}" aria-label="${label}">
      <span class="tok-disc">${sigil(p.id)}${crack && !p.alive ? CRACK : ''}${inner}${badges.join('')}</span><span class="tok-name">${esc(p.name)}</span></button>`);
  }
  return `<div class="ring-wrap" data-key="ring-wrap"><div class="ring ${dense ? 'dense' : ''} ${pick ? 'picking' : ''} ${pick?.tone === 'kill' ? 'kill' : ''}" style="--tok:${tok}px" data-key="ring">
    <svg class="ring-fuse off" viewBox="0 0 100 100" data-ringfuse aria-hidden="true"><circle class="track" cx="50" cy="50" r="49"/><circle class="burn" cx="50" cy="50" r="49" pathLength="100"/></svg>
    <div class="ring-table" aria-hidden="true"></div>
    ${extra}
    ${seats.join('')}
    <div class="ring-center" data-key="center">${center}</div>
  </div></div>`;
}

function centerFor(v, pick) {
  const hint = pick?.hint ? `<span class="c-hint">${esc(pick.hint)}</span>` : '';
  const clock = '<span class="c-clock clock" data-clock></span>';
  const prog = v.progress;
  if (isMissionPhase(v.phase)) return missionCenter(v, pick);
  switch (v.phase) {
    case 'LOBBY': {
      const need = Math.max(0, 5 - v.players.length);
      return `<span class="c-big">${v.players.length}</span><span class="c-sub">${need ? t('{n} more needed', { n: need }) : t('{n}/{total} ready', { n: prog.done, total: prog.total })}</span>`;
    }
    case 'NIGHT_0_REVEAL': return `${moon(prog.done / Math.max(1, prog.total), 'c-moon')}<span class="c-sub">${t('{n}/{total} have seen their role', { n: prog.done, total: prog.total })}</span>`;
    case 'DAY_PREP': return `<span class="c-emblem sun">${glyph('sun')}</span><span class="c-sub">${t('Morning')}</span>${hint}${clock}`;
    case 'DAY_DISCUSSION': return `<span class="c-big">${v.day.nominees.length}</span><span class="c-sub">${t('accused')}</span>${hint}${clock}`;
    case 'DAY_DEFENSE': return `<span class="c-sub">${t('Speaking')}</span><span class="c-name">${v.day.speaking ? pname(v.day.speaking) : '—'}</span>${clock}`;
    case 'DAY_VOTING': return `${tally(prog.done, prog.total)}<span class="c-sub">${t('{n}/{total} voted', { n: prog.done, total: prog.total })}</span>${hint}${clock}`;
    case 'DAY_RESOLVING': return `<span class="c-emblem">${glyph('dagger')}</span><span class="c-sub">${t('A final act')}</span>${hint}${clock}`;
    case 'NIGHT_DREAM_SWAP': return `${moon(0.08, 'c-moon')}<span class="c-sub">${t('Nightfall')}</span>${hint}${clock}`;
    case 'NIGHT_ACTIONS': return `${moon(prog ? prog.done / Math.max(1, prog.total) : 0, 'c-moon')}<span class="c-sub">${prog ? t('{n}/{total} asleep', { n: prog.done, total: prog.total }) : ''}</span>${hint}${clock}`;
    case 'ENDED': return `<span class="c-emblem">${glyph(WIN_GLYPH[v.winner] ?? 'scroll')}</span><span class="c-sub">${t({ DEATH: 'Death wins', NON_DEATH: 'The living win', JESTER: 'Jester wins', DRAW: 'Draw', ABORTED: 'Abandoned', LOVERS: 'The Lovers win', CULT: 'The Cult wins', RIPPER: 'The Ripper wins' }[v.winner] ?? '')}</span>`;
    default: return '';
  }
}

const CRACK = '<svg class="crack" viewBox="0 0 100 100" aria-hidden="true"><path d="M52 6 L46 30 L58 42 L44 60 L54 76 L48 96"/><path d="M58 42 L76 47"/><path d="M44 60 L26 57"/></svg>';

/** What, if anything, tapping a seat does right now. */
function pickContexts(v) {
  const a = v.action;
  const me = v.me;
  if (!a || !me || me.moderator) return [];
  if (isMissionPhase(v.phase)) return missionPicks(v, S);
  const out = [];
  switch (v.phase) {
    case 'DAY_PREP':
      for (const ab of a.abilities || []) {
        if (ab.kind === 'shoot') out.push({ key: 'shoot', label: roleF('VIGILANTE', 'name'), act: 'shoot', ids: ab.targets, selected: [ab.choice], tone: 'kill', hint: t(ab.choice ? 'Aimed · tap to holster' : 'Tap to aim') });
      }
      break;
    case 'DAY_DISCUSSION':
      if (a.type === 'nominate' && !a.mine) out.push({ key: 'nom', label: t('Nominate'), act: 'pickNominate', ids: a.targets, selected: [S.sel.nominate], hint: t('Tap to accuse') });
      break;
    case 'DAY_VOTING':
      if (a.type === 'ballot') {
        const cands = a.candidates.filter((id) => a.selfVote || id !== me.id || a.ghost);
        const sel = S.sel.vote ?? a.choice;
        out.push({ key: 'vote', label: t('Vote'), act: 'pickVote', ids: cands, selected: [sel], tone: 'kill', stamp: a.choice !== 'ABSTAIN' ? a.choice : null, hint: t(a.choice ? 'Recorded · tap to change' : 'Tap to vote') });
      }
      break;
    case 'DAY_RESOLVING':
      if (a.type === 'retaliate') out.push({ key: 'ret', label: t('Final act'), act: 'pickRetaliate', ids: a.targets, selected: [S.sel.retaliate], tone: 'kill', hint: t('Take one with you') });
      break;
    case 'NIGHT_DREAM_SWAP':
      if (a.type === 'swap' && a.snatcher) out.push({ key: 'swap', label: t('Swap'), act: 'pickSwap', ids: a.targets, selected: [S.sel.swap !== undefined ? S.sel.swap : a.choice], hint: t('Steal a dream') });
      break;
    case 'NIGHT_ACTIONS': {
      if (a.type !== 'night' || a.done) break;
      if (a.death) {
        const mine = S.sel.death ?? a.death.proposals[me.id] ?? [];
        out.push({ key: 'death', label: t('The kill'), act: 'pickDeath', ids: a.death.targets, selected: mine, tone: 'kill', hint: t('Choose up to {n}', { n: a.death.capacity }) });
      }
      const s = a.schema;
      if (s && !s.blocked) {
        if (s.kind === 'target' || s.kind === 'dead') {
          out.push({ key: 'role', label: roleF(s.role.id, 'name'), act: 'pickTarget', ids: s.targets, selected: (S.sel.uses ?? []).map((u) => u.target), tone: ['TERRORIST', 'PSYCHO'].includes(s.role.id) ? 'kill' : null, hint: s.kind === 'dead' ? t('Tap the dead') : s.uses > 1 ? t('Pick two seats') : `${t(s.verb ?? 'Choose')}…` });
        }
        if (s.kind === 'chat' && !a.conspire && !v.chats?.some((c) => c.id.startsWith(`consp:${v.nightNumber}:${me.id}`))) {
          out.push({ key: 'role', label: t('Whisper'), act: 'pickConspire', ids: s.targets, selected: [S.sel.conspire], hint: t('Whisper to…') });
        }
      }
      if (a.nightmare) out.push({ key: 'dream', label: t('Dream partner'), act: 'pickNightmare', ids: a.nightmare.targets, selected: [S.sel.nightmare ?? a.nightmare.choice], hint: t('Bind your dream') });
      break;
    }
    default: break;
  }
  return out;
}

function activePick(v) {
  const ctx = pickContexts(v);
  if (!ctx.length) return { ctx, pick: null };
  const pick = ctx.find((c) => c.key === S.ui.tab) ?? ctx[0];
  return { ctx, pick };
}

function pickTabs(ctx, pick) {
  if (ctx.length < 2) return '';
  return `<div class="seg tabs" role="tablist" data-key="tabs">${ctx.map((c) => `<button role="tab" data-act="tab" data-id="${c.key}" aria-pressed="${c.key === pick.key}">${esc(c.label)}</button>`).join('')}</div>`;
}

// ── Room shell ─────────────────────────────────────────────────────────────
function roomScreen() {
  const v = V();
  const pw = phaseWord(v);
  const aliveCount = v.players.filter((p) => p.alive).length;
  const side = `<aside class="side" aria-label="${esc(t('Match'))}" data-key="side">
      ${wordmark()}
      <div class="count">
        <div><b>${esc(pw.word)} ${esc(pw.num)}</b><span>${esc(stepOf(v))}</span></div>
        <div>${v.phase === 'LOBBY' ? `<b>${v.players.length}</b><span>${t('Seated')}</span>` : `<b>${aliveCount}<span class="muted">/${v.players.length}</span></b><span>${t('Alive')}</span>`}</div>
      </div>
      <div class="row between"><span class="kicker">${t('Room')} <span class="mono">${esc(v.code)}</span></span><span class="clock" data-clock></span></div>
      ${fuse()}
      ${hostBox()}
      <div class="timeline" data-scroll="side-tl"><div class="rule">${t('Public record')}</div>${feed(v.log)}</div>
      <div class="row">${langChip()}<button class="btn btn-ghost btn-sm" data-act="sound">${glyph(sound.on ? 'bell' : 'bellOff')} ${t(sound.on ? 'Sound on' : 'Sound off')}</button></div>
    </aside>`;
  const top = `<header class="topbar" data-key="top">
      <span class="tb-emblem">${isNight(v.phase) ? glyph('moon') : glyph('sun')}</span>
      <div class="phase-mini"><strong>${esc(pw.word)} ${esc(pw.num)}</strong><span>${esc(stepOf(v))} · ${v.phase === 'LOBBY' ? t('{n} seated', { n: v.players.length }) : t('{n}/{total} alive', { n: aliveCount, total: v.players.length })}</span></div>
      <span class="clock" data-clock></span>
      <button class="btn btn-ghost icon-btn" data-act="sound" aria-label="${esc(t(sound.on ? 'Mute sounds' : 'Turn sounds on'))}">${glyph(sound.on ? 'bell' : 'bellOff')}</button>
      <button class="btn btn-ghost icon-btn" data-act="sheet" data-id="record" aria-label="${esc(t('Open match record'))}">${glyph('menu')}</button>
      ${fuse()}
    </header>`;
  return `<div class="shell" data-key="shell">${side}<div class="col">${top}<main class="main" id="main" data-key="main-${v.phase === 'LOBBY' ? 'lobby' : 'game'}">${coachCard(v)}${mainFor(v, v.me)}</main></div></div>${dock(v)}${sheet(v)}`;
}

function hostBox() {
  const v = V();
  if (!v.host) {
    if (v.hostAway) {
      return `<div class="host-box" data-key="hostbox"><div class="rule">${t('Host away')}</div><p class="small muted">${t('The host has been gone for over a minute. A majority of connected players can hand the public controls to someone else.')}</p>
        <button class="btn btn-sm" data-act="claim" ${v.claimVoted ? 'disabled' : ''}>${t(v.claimVoted ? 'Vote cast' : 'Vote to take over')}</button></div>`;
    }
    return '';
  }
  const h = v.host;
  const rec = `<details class="more" data-key="recover"><summary>${t('Recover a player\'s seat')}</summary><div>
      <p class="small muted">${t('If someone\'s phone dies, issue a one-time code. They open the room link, choose "Already seated?" and enter it.')}</p>
      <select class="input" data-draft="recPick">${v.players.filter((p) => p.id !== v.me?.id).map((p) => `<option value="${p.id}" ${S.drafts.recPick === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
      <button class="btn btn-sm" data-act="issueRecovery">${t('Issue code')}</button>
      ${h.recovery ? `<p>${th('Code for <b>{a}</b>:', { a: rawName(h.recovery.playerId) })} <span class="mono code-sm">${esc(h.recovery.code)}</span><br><span class="small muted">${t('Valid 15 minutes, once.')}</span></p>` : ''}
    </div></details>`;
  if (v.phase === 'LOBBY') return `<div class="host-box" data-key="hostbox"><div class="rule">${t('Host')}</div><p class="small muted">${t('You see only what everyone sees.')}</p>${rec}</div>`;
  return `<div class="host-box" data-key="hostbox"><div class="rule">${t('Host controls')}</div>
    ${h.advance ? holdBtn('advance', t(h.advance), 'btn-solid', { key: 'side-adv' }) : ''}
    ${h.skipAll ? `<button class="btn btn-sm" data-act="advance" data-skip="1">${esc(t(h.skipAll))}</button>` : ''}
    <div class="row">${h.extend ? `<button class="btn btn-sm" data-act="extend">${t('+30 s')}</button>` : ''}
    ${h.end ? `<button class="btn btn-sm btn-ghost" data-act="end">${t('End match')}</button>` : ''}
    ${h.rematch ? `<button class="btn btn-sm btn-solid" data-act="rematch">${t('New match, same table')}</button>` : ''}</div>
    ${h.advance ? `<p class="small muted">${t('Hold to advance. Anything not submitted becomes a pass or abstention.')}</p>` : ''}
    ${rec}
  </div>`;
}

function holdBtn(act, label, cls = '', { dis = false, key = act } = {}) {
  return `<button class="btn hold ${cls} ${S.ui.holding === key ? 'holding' : ''}" data-hold="${act}" data-key="hold-${key}" ${dis ? 'disabled' : ''} ${S.pending ? 'data-pending' : ''}><span class="hold-fill"></span><span class="hold-label">${esc(label)}</span></button>`;
}

function feed(log, cls = '') {
  if (!log?.length) return `<p class="small muted">${t('Nothing yet.')}</p>`;
  return `<ul class="feed ${cls}">${log.map((l) => `<li class="k-${esc(l.kind)}" data-key="f-${l.i}"><span class="at">${esc(stamp(l.at))}</span><span class="txt">${reportHtml(entryMsg(l), l.lines)}</span></li>`).join('')}</ul>`;
}

function head(v, extra = '') {
  const pw = phaseWord(v);
  return `<header class="phase-head" data-key="head-${v.phase}">
    <div class="ph-row"><h1>${pw.night ? `<i>${esc(pw.word)}</i>` : esc(pw.word)}${pw.num ? `<span class="num">${esc(pw.num)}</span>` : ''}</h1>
    <span class="kicker">${esc(stepOf(v))}${v.doomsday && v.phase !== 'LOBBY' ? ` · ${t('Doom after Day {n}', { n: roman(v.doomsday) })}` : ''}${v.bloodMoon && isNight(v.phase) ? ` · <span class="blood">${t('Blood Moon')}</span>` : ''}</span>${v.me && v.me.alive === false && !v.me.moderator && v.phase !== 'ENDED' ? `<span class="ghost-tag" data-key="ghosttag">${t(isGhostTable(v) ? 'Ghost' : 'Dead')}</span>` : ''}${extra}</div>
  </header>`;
}

function chips(v) {
  const me = v.me;
  if (!me || me.moderator || v.phase === 'LOBBY') return '';
  const notes = (v.private || []).length;
  return `<nav class="chips" data-key="chips">
    <button class="chip" data-act="sheet" data-id="role">${me.role ? glyph(me.role.glyph) : ''}<span>${t('My role')}</span></button>
    <button class="chip" data-act="sheet" data-id="notes">${glyph('scroll')}<span>${t('Notes')}</span>${notes ? `<b>${notes}</b>` : ''}</button>
    ${v.activeRules?.length ? `<button class="chip ${Object.keys(activeRuleNotes(v)).length ? 'live' : ''}" data-act="sheet" data-id="rules">${glyph('magistrate')}<span>${t('Rules')}</span><b>${v.activeRules.length}</b></button>` : ''}
    ${v.scenario ? `<button class="chip" data-act="sheet" data-id="story">${glyph('whispers')}<span>${t('Story')}</span></button>` : ''}
  </nav>`;
}

function mainFor(v, me) {
  if (me?.moderator) return moderatorMain(v);
  switch (v.phase) {
    case 'LOBBY': return lobbyMain(v, me);
    case 'NIGHT_0_REVEAL': case 'M_REVEAL': return revealMain(v, me);
    case 'ENDED': return endMain(v, me);
    default:
      if (isMissionPhase(v.phase)) return missionMain(v, me, MH);
      return isNight(v.phase) ? nightMain(v, me) : dayMain(v, me);
  }
}

// ── Sheets (bottom drawers) ────────────────────────────────────────────────
function sheet(v) {
  const s = S.ui.sheet;
  if (!s) return '';
  const me = v?.me;
  let title = '';
  let body = '';
  if (s === 'record') {
    title = th('Room {code}', { code: v.code });
    body = `${hostBox()}${langRow(v)}${v.me?.moderator ? '' : tutorialToggle()}<div>${recordBlock(v)}</div>
      <div class="row"><a class="btn btn-sm btn-ghost" href="/guide" data-link>${t('How to play')}</a><button class="btn btn-sm btn-ghost" data-act="leave">${glyph('out')} ${t('Leave this device')}</button></div>`;
  } else if (s === 'avatar') {
    title = t('Your portrait');
    body = avatarEditor();
  } else if (s === 'lang') {
    title = t('Language');
    body = langList(v);
  } else if (s === 'role' && me?.role) {
    title = t('My role');
    body = `${roleCardHtml(me.role, { align: me.alignment, flipKey: 'sheet', flipped: true })}${roleNotes(me)}`;
  } else if (s === 'notes') {
    title = t('Only you were told');
    body = feed([...(v.private || [])].reverse(), 'feed-private');
  } else if (s === 'rules') {
    title = t('Rules in force');
    const live = activeRuleNotes(v);
    body = v.activeRules.map((r) => `<div class="rule-card ${live[r.id] ? 'live' : ''}">${glyph(ruleGlyph(r.id))}<div><b>${esc(ruleF(r.id, 'name'))}</b>${live[r.id] ? `<span class="in-effect">${t('In effect now')} · ${tmh(live[r.id])}</span>` : ''}<p>${esc(ruleF(r.id, 'text'))}</p><p class="small muted">${esc(ruleF(r.id, 'enforcement'))}</p></div></div>`).join('');
  } else if (s === 'story') {
    title = t('The story');
    body = `<p class="scenario">${storyLine(v.scenario)}</p><p class="small muted">${t('Pure flavour — it never changes the rules. Play it up.')}</p>`;
  } else if (s === 'qr') {
    title = t('Scan to join');
    body = `<div class="qr-big">${qrSvg(`${location.origin}/r/${v.code}`)}</div><p class="code-tiles big">${codeTiles(v.code)}</p>`;
  } else if (s.startsWith('seat:')) {
    const p = player(s.slice(5));
    if (!p) return '';
    const i = p.seat;
    title = esc(p.name);
    body = `<p class="small muted">${t('Seat {n} of {total}. Seating matters for Fog of War and Sleepwalking.', { n: i + 1, total: v.players.length })}</p>
      <div class="row"><button class="btn btn-sm" data-act="seat" data-pid="${p.id}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>${glyph('up')} ${t('Move earlier')}</button>
      <button class="btn btn-sm" data-act="seat" data-pid="${p.id}" data-dir="1" ${i === v.players.length - 1 ? 'disabled' : ''}>${glyph('down')} ${t('Move later')}</button></div>
      ${me?.moderator ? `<label class="field"><span>${t('Assign role')}</span><select class="input" data-act-change="assign" data-pid="${p.id}"><option value="">${t('Random')}</option>${v.allRoles.map((r) => `<option value="${r.id}" ${v.manualRoles?.[p.id] === r.id ? 'selected' : ''}>${esc(roleF(r.id, 'name'))}</option>`).join('')}</select></label>` : ''}
      ${p.id !== me?.id ? `<button class="btn btn-sm btn-ghost danger" data-act="kick" data-pid="${p.id}">${glyph('close')} ${t('Remove from table')}</button>` : ''}`;
  }
  return `<div class="sheet-scrim" data-act="sheet" data-key="scrim"></div>
    <div class="sheet" role="dialog" aria-label="${title}" data-key="sheet-${s}">
      <div class="sheet-grip" aria-hidden="true"></div>
      <div class="row between"><h2>${title}</h2><button class="btn btn-ghost icon-btn" data-act="sheet" aria-label="${esc(t('Close'))}">${glyph('close')}</button></div>
      <div class="sheet-body">${body}</div>
    </div>`;
}

/** Public record: the Gazette by default, a plain list when toggled. */
function recordBlock(v) {
  return `<div class="row between rec-head"><span class="kicker">${t('Public record')}</span><button class="chip" data-act="recordMode">${t(S.ui.recordList ? 'Gazette view' : 'List view')}</button></div>
    ${S.ui.recordList ? feed(v.log) : gazetteHtml(v, H)}`;
}

/** "We are …, in …, trying to …" in the player's language. */
function storyLine(sc) {
  if (!sc) return '';
  return th('We are {who}, in {where}, trying to {why}.', { who: sc.who, where: sc.where, why: sc.why });
}

/** The language picker: each player's own choice overrides the table's default. */
function langList(v) {
  const pref = localStorage.getItem('deadset:lang');
  const tableLang = v?.table?.lang ?? S.peek?.lang ?? null;
  const row = (code, label, on) => `<button class="lang-opt ${on ? 'on' : ''}" data-act="setLang" data-id="${code}" aria-pressed="${on}">${esc(label)}${on ? glyph('check') : ''}</button>`;
  return `<div class="lang-list">
    ${tableLang ? row('', t('Table default ({lang})', { lang: LANGS.find((l) => l.code === tableLang)?.name ?? tableLang }), !pref) : ''}
    ${LANGS.map((l) => row(l.code, l.name, pref ? pref === l.code : !tableLang && getLang() === l.code)).join('')}
  </div><p class="small muted">${t('Your choice applies to this device only. The host sets the table\'s default language in the lobby.')}</p>`;
}
function langRow() {
  return `<div class="row between"><span class="kicker">${t('Language')}</span>${langChip()}</div>`;
}

function codeTiles(code) {
  return [...code].map((c, i) => `<span class="tile" style="--i:${i}">${esc(c)}</span>`).join('');
}

// ── Lobby ──────────────────────────────────────────────────────────────────
function lobbyMain(v, me) {
  const url = `${location.origin}/r/${v.code}`;
  const isHost = !!v.host;
  const report = v.setup;
  const pick = isHost ? { act: 'seatSheet', ids: v.players.map((p) => p.id), selected: [] } : null;
  return `${head(v)}
    ${v.moderated ? `<div class="banner blood" data-key="mod">${glyph('mentalist')}<div><b>${th('Trusted moderator: {a}', { a: v.moderatorName ?? '' })}</b><p>${t('A non-playing moderator can see every role, dream and vote.')}</p></div></div>` : ''}
    <section class="invite" data-key="invite">
      <button class="code-tiles" data-act="${isHost ? 'codeTap' : 'copy'}" data-text="${esc(url)}" aria-label="${esc(t('Copy invite link'))}">${codeTiles(v.code)}</button>
      <div class="row center">
        <button class="btn btn-sm" data-act="share" data-text="${esc(url)}">${t('Invite')}</button>
        <button class="btn btn-sm" data-act="sheet" data-id="qr">${t('Show QR')}</button>
        <a class="btn btn-sm btn-ghost" href="/board/${esc(v.code)}" target="_blank" rel="noopener">${t('TV board ↗')}</a>
      </div>
    </section>
    ${ring(v, { pick, slots: Math.max(5, v.players.length), lobby: true, center: centerFor(v) })}
    ${isHost ? `<p class="small muted center-text" data-key="seathint">${t('Tap a seat to move or remove a player.')}</p>` : ''}
    ${me && !me.moderator ? portraitRow(v.players.find((p) => p.id === me.id)?.avatar) : ''}
    ${isHost && S.ui.botsPanel ? botsPanel(v) : ''}
    ${modeChooser(v, isHost)}
    ${lobbyDeck(v, isHost)}
    <section data-key="setup">
      <div class="rule">${t('Setup')}</div>
      ${isHost ? setupForm(v) : setupSummary(v)}
    </section>
    <section class="stack" data-key="report">
      ${report.errors.map((e, i) => `<div class="banner blood" data-key="err-${i}">${glyph('dagger')}<div><p>${tmh(e)}</p></div></div>`).join('')}
      ${report.warnings.map((w, i) => `<div class="banner" data-key="warn-${i}">${glyph('scroll')}<div><p>${tmh(w)}</p></div></div>`).join('')}
    </section>`;
}

// ── Portraits ──────────────────────────────────────────────────────────────
const AV_KEY = 'deadset:avatar';
function myAvatar() {
  try { const a = JSON.parse(localStorage.getItem(AV_KEY)); if (a && Object.keys(PARTS).every((k) => Number.isInteger(a[k]) && a[k] >= 0 && a[k] < PARTS[k])) return a; } catch { /* fresh */ }
  const a = randomAvatar();
  localStorage.setItem(AV_KEY, JSON.stringify(a));
  return a;
}
function portraitRow(current) {
  return `<button class="portrait-row" data-act="avatarSheet" data-key="prow">${avatarSvg(current ?? myAvatar(), 'pr-av')}<span><b>${t('Your portrait')}</b><small>${t('Tap to change how you appear at the table.')}</small></span></button>`;
}
const AV_ROWS = [['c', 'Colour'], ['e', 'Eyes'], ['m', 'Mouth'], ['h', 'Hair']];
function avatarEditor() {
  const a = myAvatar();
  return `<div class="av-editor">
    <div class="av-preview" data-key="avp-${a.c}-${a.e}-${a.m}-${a.h}">${avatarSvg(a, 'av-big')}</div>
    ${AV_ROWS.map(([k, label]) => `<div class="av-row"><span class="kicker">${t(label)}</span><div class="av-opts">${Array.from({ length: PARTS[k] }, (_, i) => {
      const sample = { ...a, [k]: i };
      const inner = k === 'c' ? `<i style="background:${COLORS[i]}"></i>` : avatarSvg(sample, 'av-mini');
      return `<button class="av-opt ${a[k] === i ? 'on' : ''}" data-act="avPart" data-k="${k}" data-v="${i}" aria-pressed="${a[k] === i}">${inner}</button>`;
    }).join('')}</div></div>`).join('')}
    <div class="row center"><button class="btn btn-sm" data-act="avRandom">${glyph('gambler')} ${t('Surprise me')}</button><button class="btn btn-sm btn-solid" data-act="sheet">${t('Done')}</button></div>
  </div>`;
}

function saveAvatar(a) {
  localStorage.setItem(AV_KEY, JSON.stringify(a));
  uiSound('pick');
  if (V()?.phase === 'LOBBY' && V()?.me && !V().me.moderator) send('lobby.avatar', { avatar: a }, { quiet: true });
  render();
}

// ── Practice bots (hidden test mode) ───────────────────────────────────────
function botsPanel(v) {
  const bots = v.players.filter((p) => p.bot).length;
  return `<section class="panel bots-panel" data-key="bots">${glyph('bot')}<div><span class="kicker">${t('Practice bots')}</span>
    <p class="small muted">${t('Test mode: bots take seats, ready up and play on their own. They never chat.')}</p>
    <div class="row"><button class="btn btn-sm" data-act="addBots" data-n="1">+1</button><button class="btn btn-sm" data-act="addBots" data-n="4">+4</button><button class="btn btn-sm" data-act="addBots" data-n="fill10">${t('Fill to {n}', { n: 10 })}</button>
    ${bots ? `<button class="btn btn-sm btn-ghost danger" data-act="clearBots">${t('Remove bots ({n})', { n: bots })}</button>` : ''}</div></div></section>`;
}

/** 20 · Tonight's deck, the extended pool, rule cards and table switches. */
function lobbyDeck(v, isHost) {
  const s = v.settings;
  const deck = v.setup?.publicDeck;
  const preset = v.presets.find((p) => p.id === s.preset);
  const roles = Object.fromEntries((S.content?.roles ?? []).map((r) => [r.id, r]));
  const card = (id, n, cls = '') => `<div class="dcard ${cls}" data-key="ld-${id}">${roles[id] ? glyph(roles[id].glyph) : ''}<b>${esc(roleF(id, 'name'))}</b>${n > 1 ? `<i>×${n}</i>` : ''}</div>`;
  let cards = '';
  if (deck?.exact) cards = Object.entries(deck.exact).map(([id, n]) => card(id, n, roles[id]?.alignment === 'DEATH' ? 'death' : '')).join('');
  else if (deck) {
    cards = Object.entries(deck.core).filter(([, n]) => n > 0).map(([id, n]) => card(id, n, id === 'DEATH' ? 'death' : '')).join('')
      + (deck.extended ? `<div class="dcard secret" data-key="ld-ext"><span class="q">?</span><b>${t('{n} extended', { n: deck.extended })}</b></div>` : '');
  }
  if (preset.missions) return missionLobbyDeck(v, isHost, cards);
  const allExt = (S.content?.roles ?? []).filter((r) => r.set === 'standard' || r.set === 'full').map((r) => r.id);
  const poolIds = preset.custom ? allExt : preset.pool;
  const inPool = new Set(deck?.pool ?? (preset.custom ? s.extendedPool : preset.pool));
  const editable = isHost && preset.custom && s.deckMode !== 'exact';
  const pool = poolIds.length && !deck?.exact ? `
    <div class="row between"><span class="kicker">${deck?.extended ? t('+{n} extended, drawn secretly from', { n: deck.extended }) : t('Extended pool · used from 7 players')}</span><span class="kicker on">${t('{n} of {total}', { n: [...inPool].filter((id) => poolIds.includes(id)).length, total: poolIds.length })}</span></div>
    <div class="pool-grid">${poolIds.map((id) => {
      const on = inPool.has(id);
      const inner = `${roles[id] ? glyph(roles[id].glyph) : ''}<span>${esc(roleF(id, 'name'))}</span>`;
      return editable ? `<button class="${on ? '' : 'off'}" data-act="poolToggle" data-id="${id}" aria-pressed="${on}" data-key="pg-${id}">${inner}</button>` : `<span class="${on ? '' : 'off'}" data-key="pg-${id}">${inner}</span>`;
    }).join('')}</div>${editable ? `<p class="small muted">${t('Tap to add or remove roles from the pool.')}</p>` : ''}` : '';
  const ruleCards = s.rules.mode === 'manual'
    ? (s.rules.selected.length ? s.rules.selected.map((id) => isHost
      ? `<button class="dcard rcard" data-act="ruleToggle" data-id="${id}" data-key="lr-${id}" aria-label="${esc(t('Remove {x}', { x: ruleF(id, 'name') }))}">${glyph(ruleGlyph(id))}<b>${esc(ruleF(id, 'name'))}</b><i>×</i></button>`
      : `<div class="dcard rcard" data-key="lr-${id}">${glyph(ruleGlyph(id))}<b>${esc(ruleF(id, 'name'))}</b></div>`).join('') : `<p class="small muted">${t('No rule cards chosen.')}</p>`)
    : Array.from({ length: s.rules.count }, (_, i) => `<div class="dcard rcard fd" data-key="lr-r${i}"><span class="q">?</span><b>${t('Drawn at start')}</b></div>`).join('') || `<p class="small muted">${t('No rule cards.')}</p>`;
  const toggle = (key, title, sub) => isHost
    ? `<label class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><input type="checkbox" class="switch" data-set-bool="${key}" ${v.table?.[key] ? 'checked' : ''}></label>`
    : `<div class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><span class="tag ${v.table?.[key] ? 'solid' : ''}">${t(v.table?.[key] ? 'On' : 'Off')}</span></div>`;
  const setRow = (key, title, sub) => isHost
    ? `<label class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><input type="checkbox" class="switch" data-set-bool="${key}" ${s[key] ? 'checked' : ''}></label>`
    : `<div class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><span class="tag ${s[key] ? 'solid' : ''}">${t(s[key] ? 'On' : 'Off')}</span></div>`;
  const tableLang = v.table?.lang ?? 'en';
  return `<section class="lobby-deck" data-key="ldeck">
    <div class="rule">${t(v.players.length === 1 ? 'Tonight\'s deck · {n} player' : 'Tonight\'s deck · {n} players', { n: v.players.length })}</div>
    <div class="deckrow">${cards || `<p class="small muted">${t('Seat at least 5 players to see the deck.')}</p>`}</div>
    ${pool}
    <div class="rule">${t('Rule cards in play')}</div>
    <div class="deckrow">${ruleCards}</div>
    <div class="rule">${t('The table')}</div>
    ${isHost ? `<label class="toggle-row"><span><b>${t('Table language')}</b><small>${t('The default for everyone. Each player can still pick their own.')}</small></span><select class="input lang-select" data-act-change="tableLang">${LANGS.map((l) => `<option value="${l.code}" ${tableLang === l.code ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</select></label>`
      : `<div class="toggle-row"><span><b>${t('Table language')}</b><small>${t('Set by the host. You can pick your own above.')}</small></span><span class="tag">${esc(LANGS.find((l) => l.code === tableLang)?.name ?? tableLang)}</span></div>`}
    <div class="rule">${t('Other sides')}</div>
    ${toggle('lovers', 'Lovers', 'Two random players fall in love. If one dies, so does the other; if they are the last two alive, they win together.')}
    ${s.deckMode === 'exact' && preset.custom ? `<p class="small muted">${t('With "Choose every role", add the Cult Leader or the Ripper with the role counters.')}</p>` : `${toggle('cult', 'The Cult', 'A Cult Leader recruits one player each night. The Cult wins when it outnumbers everyone else.')}
    ${toggle('ripper', 'The Ripper', 'A lone killer strikes each night and wins as the last one standing.')}`}
    <div class="rule">${t('Twists')}</div>
    ${toggle('clues', 'Clues', 'Rarely, at dawn, one or two players find a true hint about Death\'s team.')}
    ${v.table?.clues ? (isHost ? `<label class="toggle-row sub"><span><b>${t('How often')}</b></span><select class="input lang-select" data-act-change="clueOdds">${[[1, 'Rare'], [2, 'Uncommon'], [3, 'Common']].map(([n, l]) => `<option value="${n}" ${v.table.clueOdds === n ? 'selected' : ''}>${t(l)}</option>`).join('')}</select></label>` : `<div class="toggle-row sub"><span><b>${t('How often')}</b></span><span class="tag">${t(['', 'Rare', 'Uncommon', 'Common'][v.table.clueOdds] ?? 'Rare')}</span></div>`) : ''}
    ${isHost ? `<label class="toggle-row"><span><b>${t('Coin-toss tiebreak')}</b><small>${t('A tied vote is settled by a coin toss instead of sparing everyone.')}</small></span><input type="checkbox" class="switch" data-act-change="tieBreak" ${v.table?.tieBreak === 'coin' ? 'checked' : ''}></label>`
      : `<div class="toggle-row"><span><b>${t('Coin-toss tiebreak')}</b><small>${t('A tied vote is settled by a coin toss instead of sparing everyone.')}</small></span><span class="tag ${v.table?.tieBreak === 'coin' ? 'solid' : ''}">${t(v.table?.tieBreak === 'coin' ? 'On' : 'Off')}</span></div>`}
    ${toggle('bloodMoon', 'Blood Moon', 'After two nights in a row without a death, no protection holds for a night.')}
    ${toggle('finalTwoDeath', 'Death wins in the final two', 'If a Death is among the last two players alive, Death wins at once.')}
    ${toggle('threads', 'Threads of suspicion', 'Draws who accused whom across the table')}
    ${toggle('score', 'Atmospheric score', 'Music and effects play on the TV board')}
    ${toggle('backdrops', 'Location backdrops', 'The TV board shows a scene for the story\'s WHERE card.')}
  </section>`;
}

/** Lobby deck and switches for Dead Set: Missions. */
function missionLobbyDeck(v, isHost, cards) {
  const s = v.settings;
  const on = { BELIEVER: true, CHARLATAN: true, VEILED: false, STRAY: false, UNDERTAKER: false, M_JESTER: false, ...(s.mRoles || {}) };
  const n = v.players.length;
  const sizes = S.content?.missionSizes?.[n];
  const roleRow = (id, sub) => isHost
    ? `<label class="toggle-row"><span><b>${esc(roleF(id, 'name'))}</b><small>${t(sub)}</small></span><input type="checkbox" class="switch" data-act-change="mRole" data-id="${id}" ${on[id] ? 'checked' : ''}></label>`
    : `<div class="toggle-row"><span><b>${esc(roleF(id, 'name'))}</b><small>${t(sub)}</small></span><span class="tag ${on[id] ? 'solid' : ''}">${t(on[id] ? 'On' : 'Off')}</span></div>`;
  const toggle = (key, title, sub) => isHost
    ? `<label class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><input type="checkbox" class="switch" data-set-bool="${key}" ${v.table?.[key] ? 'checked' : ''}></label>`
    : `<div class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><span class="tag ${v.table?.[key] ? 'solid' : ''}">${t(v.table?.[key] ? 'On' : 'Off')}</span></div>`;
  const select = (act, value, opts, title, sub) => isHost
    ? `<label class="toggle-row"><span><b>${t(title)}</b>${sub ? `<small>${t(sub)}</small>` : ''}</span><select class="input lang-select" data-act-change="${act}">${opts.map(([k, l]) => `<option value="${k}" ${value === k ? 'selected' : ''}>${t(l)}</option>`).join('')}</select></label>`
    : `<div class="toggle-row"><span><b>${t(title)}</b>${sub ? `<small>${t(sub)}</small>` : ''}</span><span class="tag">${t(opts.find(([k]) => k === value)?.[1] ?? '')}</span></div>`;
  const setRow = (key, title, sub) => isHost
    ? `<label class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><input type="checkbox" class="switch" data-set-bool="${key}" ${s[key] ? 'checked' : ''}></label>`
    : `<div class="toggle-row"><span><b>${t(title)}</b><small>${t(sub)}</small></span><span class="tag ${s[key] ? 'solid' : ''}">${t(s[key] ? 'On' : 'Off')}</span></div>`;
  const tableLang = v.table?.lang ?? 'en';
  return `<section class="lobby-deck" data-key="ldeck">
    <div class="rule">${t(n === 1 ? 'Tonight\'s deck · {n} player' : 'Tonight\'s deck · {n} players', { n })}</div>
    <div class="deckrow">${cards || `<p class="small muted">${t('Seat 5 to 12 players to see the deck.')}</p>`}</div>
    ${sizes ? `<p class="small muted" data-key="msizes">${th('Team sizes for missions 1–5: {sizes}.', { sizes: sizes.join(' · ') })}${n >= 7 ? ` ${t('Mission 4 needs two Sabotage cards to fail.')}` : ''}</p>` : ''}
    <div class="rule">${t('The table')}</div>
    ${isHost ? `<label class="toggle-row"><span><b>${t('Table language')}</b><small>${t('The default for everyone. Each player can still pick their own.')}</small></span><select class="input lang-select" data-act-change="tableLang">${LANGS.map((l) => `<option value="${l.code}" ${tableLang === l.code ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</select></label>`
      : `<div class="toggle-row"><span><b>${t('Table language')}</b><small>${t('Set by the host. You can pick your own above.')}</small></span><span class="tag">${esc(LANGS.find((l) => l.code === tableLang)?.name ?? tableLang)}</span></div>`}
    <div class="rule">${t('Roles')}</div>
    <p class="small muted">${t('Every table has a Medium and a Reaper. Empty seats are Companions and Shades.')}</p>
    ${roleRow('BELIEVER', 'Sees the Medium and the Charlatan as two candles.')}
    ${roleRow('CHARLATAN', 'Death: looks like the Medium to the Believer.')}
    ${roleRow('VEILED', 'Death: hidden from the Medium.')}
    ${roleRow('STRAY', 'Death: unknown to the rest of Death, and blind to them.')}
    ${roleRow('UNDERTAKER', 'Living: learns how many Death players were on each failed team.')}
    ${roleRow('M_JESTER', 'Plays for itself: wins if named in the Last Stand or by the Reaper. From 7 players.')}
    ${setRow('twins', 'Twins', 'Two Living players who know each other.')}
    <div class="rule">${t('Twists')}</div>
    ${setRow('sideMissions', 'Side Missions', 'Everyone gets a secret personal objective. Complete it and your Last Stand vote counts double; fail it and it counts half.')}
    ${select('leaderMode', s.leaderMode ?? 'next', [['next', 'Next in line'], ['choose', 'Chosen by the last leader']], 'Next Mission Leader', 'After a mission, the lantern goes to the next player in line, or the last leader hands it to someone who has not led a mission yet.')}
    ${select('missionCards', s.missionCards ?? 1, [[0, 'Off'], [1, 'Rare'], [2, 'Sometimes']], 'Mission cards', 'Most missions are Regular. Sometimes a card changes the team, the vote or the reveal.')}
    ${toggle('clues', 'Clues', 'Rarely, at dawn, one or two players find a true hint about Death\'s team.')}
    ${v.table?.clues ? select('clueOdds', v.table.clueOdds, [[1, 'Rare'], [2, 'Uncommon'], [3, 'Common']], 'How often', '') : ''}
    ${toggle('score', 'Atmospheric score', 'Music and effects play on the TV board')}
    ${toggle('backdrops', 'Location backdrops', 'The TV board shows a scene for the story\'s WHERE card.')}
  </section>`;
}

/** The top-line choice: classic Dead Set or Dead Set: Missions. Everything below follows it. */
function modeChooser(v, isHost) {
  const missions = !!v.presets.find((p) => p.id === v.settings.preset)?.missions;
  const card = (mode, glyphName, title, sub) => {
    const on = (mode === 'missions') === missions;
    const inner = `${glyph(glyphName)}<span><b>${esc(title)}</b><small>${esc(sub)}</small></span>`;
    return isHost
      ? `<button class="mode-card ${on ? 'on' : ''}" data-act="gameMode" data-mode="${mode}" aria-pressed="${on}" data-key="mode-${mode}">${inner}</button>`
      : `<div class="mode-card ${on ? 'on' : 'off'}" data-key="mode-${mode}">${inner}</div>`;
  };
  return `<section class="mode-pick" data-key="modepick">
    <div class="rule">${t('Game mode')}</div>
    <div class="mode-cards">
      ${card('classic', 'death', t('Classic Dead Set'), t('Hidden roles, night kills, Dreams and Rule cards. 5–25 players.'))}
      ${card('missions', 'mission', presetF('missions', 'name'), t('Teams, votes and sabotage. Nobody dies. 5–12 players.'))}
    </div>
  </section>`;
}

function setupSummary(v) {
  const s = v.settings;
  const preset = v.presets.find((p) => p.id === s.preset);
  const ruleNames = (ids) => ids.map((id) => esc(ruleF(id, 'name'))).join(', ');
  return `<div class="stack">
    <div class="preset" aria-pressed="true" style="cursor:default"><b>${esc(presetF(preset.id, 'name'))}</b><small>${esc(presetF(preset.id, 'blurb'))}</small></div>
    <div class="pill-row">
      ${preset.missions ? `<span class="tag">${t(['No mission cards', 'Mission cards: rare', 'Mission cards: sometimes'][s.missionCards ?? 1])}</span>` : `<span class="tag">${s.rules.mode === 'random' ? t(s.rules.count === 1 ? '{n} random rule card' : '{n} random rule cards', { n: s.rules.count }) : ruleNames(s.rules.selected) || t('No rule cards')}</span>
      <span class="tag">${t(s.dreams ? 'Dreams on' : 'No dreams')}</span>`}
      <span class="tag">${t(s.transport === 'remote' ? 'Remote · chat' : 'Same room')}</span>
      ${s.scenario.mode === 'manual' ? `<span class="tag">${esc(s.scenario.who)}</span>` : ''}
    </div>
    <p class="muted small">${t('Tap <b>Ready</b> when you\'ve read the setup. The host starts the match.')}</p>
  </div>`;
}

function setupForm(v) {
  const s = v.settings;
  const preset = v.presets.find((p) => p.id === s.preset);
  const rules = (S.content?.rules ?? []).filter((r) => preset.ruleIds.includes(r.id));
  const tm8 = s.timers;
  const OPTS = [0, 15, 30, 45, 60, 90, 120, 180, 300, 600];
  const timer = (key, label) => `<label class="field"><span>${t(label)}</span><select class="input" data-set="timers.${key}">
      ${OPTS.map((n) => `<option value="${n}" ${tm8[key] === n ? 'selected' : ''}>${n === 0 ? t('Untimed') : n < 60 ? t('{n} s', { n }) : t('{n} min', { n: n / 60 })}</option>`).join('')}
      ${OPTS.includes(tm8[key]) ? '' : `<option selected value="${tm8[key]}">${t('{n} s', { n: tm8[key] })}</option>`}</select></label>`;
  return `<div class="stack" style="gap:18px">
    ${preset.missions ? '' : `<div class="carousel" data-key="presets">${v.presets.filter((p) => !p.missions).map((p) => `<button class="preset" data-act="preset" data-id="${p.id}" aria-pressed="${s.preset === p.id}" data-key="pr-${p.id}"><b>${esc(presetF(p.id, 'name'))}</b>${p.recommended ? `<span class="tag solid">${t('Best first game')}</span>` : ''}<small>${esc(presetF(p.id, 'blurb'))}</small><span class="kicker">${t('{a}–{b} players', { a: p.min, b: p.max })}</span></button>`).join('')}</div>`}

    ${preset.custom ? `<details class="more" data-key="d-custom" open><summary>${t('Custom deck')}</summary><div>
      <label class="check"><input type="checkbox" data-set-bool="dreams" ${s.dreams ? 'checked' : ''}><span><b>${t('Dreams')}</b><small>${t('Everyone draws a Dream card each night.')}</small></span></label>
      <label class="check"><input type="checkbox" data-set-bool="doomsday" ${s.doomsday ? 'checked' : ''}><span><b>${t('Doomsday Clock')}</b><small>${t('Death wins if nobody has won when the final Day closes.')}</small></span></label>
      ${customDeckEditor(v)}
      ${s.dreams ? dreamWeightsEditor(v) : ''}
    </div></details>` : ''}
    ${preset.id === 'classic' ? `<label class="check"><input type="checkbox" data-set-bool="dreams" ${s.dreams ? 'checked' : ''}><span><b>${t('Simplified Dreams')}</b><small>${t('Off by default for teaching games.')}</small></span></label>` : ''}
    ${preset.id === 'doomsday' || (preset.custom && s.doomsday) ? `<label class="field"><span>${t('Doomsday after Day')}</span><select class="input" data-set="doomsdayDays">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<option ${s.doomsdayDays === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>` : ''}

    <details class="more ${preset.missions ? 'hidden' : ''}" data-key="d-rules" open><summary>${t('Rule cards')}</summary><div>
      ${preset.rulesMax === 0 ? '' : `<div class="seg" role="group"><button data-act="rulesMode" data-mode="random" aria-pressed="${s.rules.mode === 'random'}">${t('Draw at random')}</button><button data-act="rulesMode" data-mode="manual" aria-pressed="${s.rules.mode === 'manual'}">${t('Choose')}</button></div>`}
      ${s.rules.mode === 'random' ? `<div class="stepper"><span>${t('How many')}</span>${range(preset.rulesMin, preset.rulesMax).map((n) => `<button data-act="ruleCount" data-n="${n}" aria-pressed="${s.rules.count === n}">${n}</button>`).join('')}</div><small class="muted small">${t('Drawn secretly when the match starts.')}</small>`
        : `<div class="rule-grid">${rules.map((r) => `<label class="check"><input type="checkbox" data-act-change="rule" data-id="${r.id}" ${s.rules.selected.includes(r.id) ? 'checked' : ''}><span><b>${esc(ruleF(r.id, 'name'))}</b><small>${esc(ruleF(r.id, 'text'))}</small></span></label>`).join('')}</div><small class="muted small">${t('Choose {a}–{b}.', { a: preset.rulesMin, b: preset.rulesMax })}</small>`}
    </div></details>

    <details class="more" data-key="d-story"><summary>${t('Story · WHO / WHERE / WHY')}</summary><div>
      <div class="seg" role="group"><button data-act="scenMode" data-mode="random" aria-pressed="${s.scenario.mode === 'random'}">${t('Random')}</button><button data-act="scenMode" data-mode="manual" aria-pressed="${s.scenario.mode === 'manual'}">${t('Write our own')}</button></div>
      ${s.scenario.mode === 'manual' ? ['who', 'where', 'why'].map((k) => `<label class="field"><span>${t(k.toUpperCase())}</span><input class="input" maxlength="80" data-set-text="scenario.${k}" value="${esc(s.scenario[k])}" placeholder="${esc(scen(k.toUpperCase(), { who: 'Lost Tourists', where: 'a Haunted Mansion', why: 'Solve a Murder' }[k]))}"></label>`).join('') : `<p class="small muted">${t('Pure storytelling. It never changes the rules.')}</p>`}
    </div></details>

    <details class="more" data-key="d-table"><summary>${t('Table & timers')}</summary><div>
      <div class="seg" role="group"><button data-act="transport" data-mode="in-person" aria-pressed="${s.transport === 'in-person'}">${t('Same room')}</button><button data-act="transport" data-mode="remote" aria-pressed="${s.transport === 'remote'}">${t('Remote · chat')}</button></div>
      ${preset.missions ? `<div class="grid2">${timer('proposal', 'Proposal')}${timer('teamVote', 'Team vote')}${timer('mission', 'Mission')}${timer('interlude', 'Night interlude')}${timer('lastStand', 'Last Stand')}${timer('reckoning', 'Reckoning')}</div>` : `<div class="grid2">${timer('morning', 'Morning')}${timer('discussion', 'Discussion')}${timer('defense', 'Defence (each)')}${timer('voting', 'Voting')}${timer('night', 'Night')}${timer('retaliation', 'Final act')}</div>
      <p class="small muted">${t(s.dreams ? 'Each night opens with a fifteen-second nightfall: everyone reads their Dream before actions begin.' : 'Each night opens with a five-second nightfall before actions begin.')}</p>`}
      ${preset.missions ? '' : `<label class="check"><input type="checkbox" data-set-bool="revealOnDeath" ${s.revealOnDeath ? 'checked' : ''}><span><b>${t('Reveal roles on death')}</b><small>${t('Never with the Hidden Roles card.')}</small></span></label>
      <label class="check"><input type="checkbox" data-set-bool="endReveal" ${s.endReveal ? 'checked' : ''}><span><b>${t('Reveal every role at the end')}</b></span></label>
      <label class="check"><input type="checkbox" data-set-bool="selfNomination" ${s.selfNomination ? 'checked' : ''}><span><b>${t('Allow self-nomination')}</b></span></label>
      <label class="check"><input type="checkbox" data-set-bool="selfVote" ${s.selfVote ? 'checked' : ''}><span><b>${t('Nominees may vote for themselves')}</b></span></label>`}
    </div></details>
  </div>`;
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const SUGGESTION_LABEL = {
  steady: ['Steady', 'Dependable powers. No conversions, no lone winners.'],
  sharp: ['Sharp eyes', 'More information and protection for the town.'],
  wild: ['Wild night', 'The whole deck, swings and all.'],
};
const CLASSIC_SETS = ['core', 'standard', 'full', 'side'];
const ROLE_GROUPS = [['Death', (r) => r.alignment === 'DEATH' && CLASSIC_SETS.includes(r.set)], ['Core', (r) => r.set === 'core' && r.alignment !== 'DEATH'], ['Standard', (r) => r.set === 'standard'], ['Full Deck', (r) => r.set === 'full'], ['Other sides', (r) => r.set === 'side']];

/** Custom deck: automatic (by player count) or exact role counters, plus suggestions. */
function customDeckEditor(v) {
  const s = v.settings;
  const exact = s.deckMode === 'exact';
  const n = v.players.length;
  const counts = s.customRoles || {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const deaths = Object.entries(counts).filter(([id]) => id === 'DEATH').reduce((a, [, c]) => a + c, 0);
  const all = S.content?.roles ?? [];
  const sugg = v.setup?.suggestions ?? [];
  const chipList = (roles) => Object.entries(roles).map(([id, c]) => `<span class="sg-role ${id === 'DEATH' ? 'death' : ''}">${glyph(all.find((r) => r.id === id)?.glyph ?? 'scroll')}${esc(roleF(id, 'name'))}${c > 1 ? `<i>×${c}</i>` : ''}</span>`).join('');
  const suggestions = sugg.length ? `<div class="row between"><span class="kicker">${t('Suggested for {n} players', { n })}</span><button class="chip" data-act="reshuffleSuggest">${glyph('gambler')}<span>${t('Shuffle')}</span></button></div>
    <div class="sugg" data-key="sugg">${sugg.map((g) => `<div class="sg" data-key="sg-${g.key}"><div class="sg-head"><b>${t(SUGGESTION_LABEL[g.key][0])}</b><button class="btn btn-sm" data-act="useSuggestion" data-id="${g.key}">${t('Use this')}</button></div><small>${t(SUGGESTION_LABEL[g.key][1])}</small><div class="sg-roles">${chipList(g.roles)}</div></div>`).join('')}</div>` : '';
  const counter = (r) => {
    const c = counts[r.id] || 0;
    return `<div class="rc ${c ? 'on' : ''} ${r.alignment === 'DEATH' ? 'death' : ''}" data-key="rc-${r.id}">
      <span class="rc-name">${glyph(r.glyph)}<span><b>${esc(roleF(r.id, 'name'))}</b><small>${esc(roleF(r.id, 'summary'))}</small></span></span>
      <span class="rc-ctl"><button data-act="roleCount" data-id="${r.id}" data-d="-1" ${c ? '' : 'disabled'} aria-label="${esc(t('Fewer: {x}', { x: roleF(r.id, 'name') }))}">−</button><b>${c}</b><button data-act="roleCount" data-id="${r.id}" data-d="1" aria-label="${esc(t('More: {x}', { x: roleF(r.id, 'name') }))}">+</button></span>
    </div>`;
  };
  const status = total === n ? 'ok' : 'off';
  return `<div class="seg" role="group"><button data-act="deckMode" data-mode="auto" aria-pressed="${!exact}">${t('Automatic deck')}</button><button data-act="deckMode" data-mode="exact" aria-pressed="${exact}">${t('Choose every role')}</button></div>
    <p class="small muted">${t(exact ? 'Set how many of each role are dealt. The total must match the players seated.' : 'Roles scale with the player count; extended seats come from the pool below.')}</p>
    ${suggestions}
    ${exact ? `<div class="rc-sum ${status}" data-key="rcsum"><b>${t('{n} of {total} seats filled', { n: total, total: n })}</b><span>${t('Death {a} · Others {b}', { a: deaths, b: total - deaths })}</span></div>
      ${ROLE_GROUPS.map(([label, f]) => { const list = all.filter(f); return list.length ? `<div class="rule">${t(label)}</div><div class="rc-grid">${list.map(counter).join('')}</div>` : ''; }).join('')}` : ''}`;
}

const WEIGHT_LABEL = ['Off', 'Rare', 'Uncommon', 'Common', 'Frequent'];
/** Custom Dream frequencies: a five-step scale per Dream. */
function dreamWeightsEditor(v) {
  const w = v.settings.dreamWeights || {};
  return `<div class="rule">${t('Dream frequency')}</div>
    <p class="small muted">${t('How often each Dream is drawn. Insomnia never appears more than twice in a match.')}</p>
    <div class="dw" data-key="dw">${(S.content?.dreams ?? []).map((d) => `<div class="dw-row" data-key="dw-${d.id}"><span class="dw-name">${dreamGlyph(d.id)}<b>${esc(dreamF(d.id, 'name'))}</b></span>
      <div class="seg dw-seg" role="group">${WEIGHT_LABEL.map((l, i) => `<button data-act="dreamWeight" data-id="${d.id}" data-w="${i}" aria-pressed="${(w[d.id] ?? 3) === i}">${t(l)}</button>`).join('')}</div></div>`).join('')}</div>`;
}

// ── Role card ──────────────────────────────────────────────────────────────
function roleCardHtml(role, { align = null, flipKey = 'role', flipped = null, mini = false } = {}) {
  if (!role) return '';
  const a = align ?? role.alignment;
  const isFlipped = flipped ?? !!S.ui.flipped[flipKey];
  if (mini) {
    return `<button class="role-mini ${a === 'DEATH' ? 'death' : ''}" data-act="sheet" data-id="role" data-key="rolemini">${glyph(role.glyph)}<span><b>${esc(roleF(role.id, 'name'))}</b><small>${esc(roleF(role.id, 'summary'))}</small></span></button>`;
  }
  return `<div class="card-stage" data-key="stage-${flipKey}">
    <button class="flipcard ${isFlipped ? 'flipped' : ''}" data-act="flip" data-key="${flipKey}" data-tilt aria-label="${isFlipped ? esc(t('Your role: {x}', { x: roleF(role.id, 'name') })) : esc(t('Turn over your role card'))}">
      <span class="face back"><span class="mono-gram">DS</span><span class="hint kicker">${t('Tap to turn over')}</span></span>
      <span class="face front ${a === 'DEATH' ? 'death' : ''}">
        <span class="corner"><b>${esc(ALIGN[a])}</b><span>${esc(roleF(role.id, 'when'))}</span></span>
        <span class="art">${glyph(role.glyph)}</span>
        <span class="nm">${esc(roleF(role.id, 'name'))}</span>
        ${roleF(role.id, 'alias') ? `<span class="small muted">${th('also called {x}', { x: roleF(role.id, 'alias') })}</span>` : ''}
        <span class="sum">${esc(roleF(role.id, 'summary'))}</span>
        <span class="shine" aria-hidden="true"></span>
      </span>
    </button></div>`;
}

function roleNotes(me) {
  return `<div class="stack" style="gap:10px">
    <p class="muted small">${esc(roleF(me.role.id, 'detail'))}</p>
    ${me.originalRole ? `<p class="small muted">${th('You began as {x}.', { x: roleF(me.originalRole.id, 'name') })}</p>` : ''}
    ${me.alignment === 'DEATH' && me.role.id !== 'DEATH' ? `<p class="blood small">${t('You are Death-aligned.')}</p>` : ''}
    ${me.mimicPowerless ? `<p class="small muted">${t('Your copy failed: you are a powerless Mimic.')}</p>` : ''}
    ${Object.values(me.charges || {}).map((n) => `<p class="small muted">${t(n > 0 ? 'One use remaining.' : 'Your once-per-game power is spent.')}</p>`).join('')}
    ${teammates(me)}
  </div>`;
}

function teammates(me) {
  if (V()?.mode === 'missions') return knowledgeHtml(me);
  const extra = `${me.lover ? `<div class="panel tight love-panel">${glyph('heart')}<div><span class="kicker">${t('Your love')}</span><p>${th('You are in love with <b>{name}</b>. If one of you dies, so does the other. If you two are the last alive, you win together.', { name: me.lover.name })}</p></div></div>` : ''}${me.cultmates ? `<div class="panel tight cult-panel"><span class="kicker">${t('The Cult')}</span><p>${me.cultmates.length ? esc(me.cultmates.map((x) => x.name).join(', ')) : t('No other members yet.')}</p></div>` : ''}`;
  return deathTeam(me) + extra;
}
function deathTeam(me) {
  if (me.teammates) return `<div class="panel tight seal"><span class="kicker blood">${t('Your Death team')}</span>${me.teammates.length ? `<p>${me.teammates.map((x) => esc(x.name)).join(', ')}</p>` : `<p>${t('You are alone. Every kill is your call.')}</p>`}</div>`;
  if (me.joinsTeamNight) return `<div class="panel tight seal"><span class="kicker blood">${t('Death team')}</span><p>${t('You join the Death team room on Night {n}.', { n: roman(me.joinsTeamNight) })}</p></div>`;
  return '';
}

// ── Night 0 ────────────────────────────────────────────────────────────────
function revealMain(v, me) {
  const key = `n0-${v.phaseId}`;
  return `${head(v)}
    <p class="muted center-text" data-key="n0hint">${me.acknowledged ? th('Waiting for the others · {done}/{total}', v.progress) : t('Shield your screen, then tap the card.')}</p>
    ${roleCardHtml(me.role, { align: me.alignment, flipKey: key })}
    ${S.ui.flipped[key] ? `<div data-key="n0notes" class="rise-in">${roleNotes(me)}</div>` : ''}
    ${chips(v)}`;
}

// ── Day ────────────────────────────────────────────────────────────────────
function dayMain(v, me) {
  const { ctx, pick } = activePick(v);
  let stage = '';
  if (v.phase === 'DAY_PREP') stage = morningStage(v);
  if (v.phase === 'DAY_DISCUSSION') stage = discussionStage(v);
  if (v.phase === 'DAY_DEFENSE') stage = defenseStage(v, me);
  if (v.phase === 'DAY_VOTING') stage = votingStage(v);
  if (v.phase === 'DAY_RESOLVING') stage = v.action.type === 'retaliate' ? `<p class="center-text blood" data-key="ret">${t('You were sentenced. You may take one living non-Death player with you.')}</p>` : `<p class="center-text muted" data-key="ret">${t('The condemned is making a final choice…')}</p>`;
  return `${head(v)}
    ${statusBanners(v, me)}
    ${ruleRibbon(v, me)}
    ${pickTabs(ctx, pick)}
    ${ring(v, { pick, center: centerFor(v, pick), marks: openBallotMarks(v) })}
    ${stage}
    ${chatBlock(v)}
    ${chips(v)}`;
}

/** 17 · Rule cards shaping the current phase, highlighted. */
function ruleRibbon(v, me) {
  const notes = activeRuleNotes(v);
  const ids = Object.keys(notes);
  if (!ids.length) return '';
  if (notes.FOG_OF_WAR && me?.alive && me.seat != null) {
    const seats = [...v.players].sort((x, y) => x.seat - y.seat);
    const n = seats.length; const l = seats[(me.seat - 1 + n) % n]; const r = seats[(me.seat + 1) % n];
    notes.FOG_OF_WAR = ['Talk only with {a} and {b}', { a: l.name, b: r.name }];
  }
  return `<div class="rule-ribbon" data-key="rr-${v.phase}">${ids.map((id) => `<span class="rr" data-key="rr-${id}">${glyph(ruleGlyph(id))}<b>${esc(ruleF(id, 'name'))}</b><span>${tmh(notes[id])}</span></span>`).join('')}</div>`;
}

const isGhostTable = (v) => v.activeRules?.some((r) => r.id === 'VENGEFUL_GHOSTS');
/** The dead see a ghostly screen; "ghost" wording only where ghosts can act. */
function deadBanner(v) {
  const ghost = isGhostTable(v);
  return `<div class="banner dead-banner" data-key="st-dead">${glyph('death')}<div><b>${t(ghost ? 'You are a ghost.' : 'You are dead.')}</b><p>${t(ghost ? 'Vengeful Ghosts: you cast a ghost ballot each Day. You cannot speak or use powers.' : 'Watch in silence, and don\'t help the living.')}</p></div></div>`;
}

function statusBanners(v, me) {
  const out = [];
  if (!me.alive) out.push(deadBanner(v));
  if (me.statuses.includes('MUTE')) out.push(`<div class="banner blood" data-key="st-mute">${glyph('psycho')}<div><b>${t('You are MUTE today.')}</b><p>${t('No talking in discussion or defence. You can still nominate and vote.')}</p></div></div>`);
  if (me.statuses.includes('NO_VOTE')) out.push(`<div class="banner blood" data-key="st-nov">${glyph('psycho')}<div><b>${t('NO VOTE today.')}</b><p>${t('You may speak, but your ballot is disabled.')}</p></div></div>`);
  if (me.revived) out.push(`<div class="banner" data-key="st-rev">${glyph('necro')}<div><b>${t('Borrowed time.')}</b><p>${th('Nothing can kill you until it runs out after Night {n} — but the town can still sentence you.', { n: roman(me.revived.expiresAfterNight) })}</p></div></div>`);
  return out.join('');
}

function morningStage(v) {
  const news = v.log.filter((l) => (l.ev === 'dawn' && l.day === v.dayNumber) || (l.at === `Day ${v.dayNumber}` && ['death', 'immunity'].includes(l.kind)) || (l.ev === 'revive' && l.at === `Night ${v.dayNumber - 1}`));
  const ab = v.action.abilities || [];
  let abilities = '';
  if (ab.some((x) => x.kind === 'immunity')) abilities += `<div class="panel tight" data-key="dip"><span class="kicker">${t('Diplomat · once per game')}</span><p class="small">${t('Declare immunity now and nobody can nominate you today. Everyone will see it.')}</p>${holdBtn('immunity', t('Hold to declare immunity'))}</div>`;
  if (ab.some((x) => x.kind === 'immune')) abilities += `<div class="banner" data-key="imm">${glyph('diplomat')}<div><b>${t('You are immune today.')}</b></div></div>`;
  if (ab.some((x) => x.kind === 'shoot')) abilities += `<p class="small muted center-text" data-key="vig">${t('Vigilante: tap a seat to aim. The shot fires when the host opens discussion. Nobody will know it was you.')}</p>`;
  return `<section class="stack" data-key="morning">
    ${news.length ? news.map((l) => `<div class="report ${l.kind === 'death' ? 'alarm' : ''}" data-key="news-${l.i}"><p>${tmh(entryMsg(l))}</p></div>`).join('') : `<div class="report" data-key="news-none"><p>${v.dayNumber === 1 ? t('Nobody has died yet. Introduce yourselves — or don\'t.') : t('Nothing to report.')}</p></div>`}
    ${abilities}
    ${!v.host ? `<p class="small muted center-text">${t('The host will open discussion shortly.')}</p>` : ''}
  </section>`;
}

function nominationList(v) {
  const d = v.day;
  if (!d?.nominations.length) return `<p class="muted small center-text" data-key="nonom">${t('No one is accused yet.')}</p>`;
  const by = {};
  for (const n of d.nominations) (by[n.target] ||= []).push(n.by);
  return `<ol class="accused" data-key="accused">${d.nominees.map((id, i) => `<li data-key="acc-${id}" class="${d.speaking === id ? 'speaking' : ''}"><span class="num">${roman(i + 1)}</span><b>${pname(id)}</b><small>${th('by {names}', { names: by[id].map(rawName) })}</small></li>`).join('')}</ol>`;
}

function discussionStage(v) {
  const a = v.action;
  return `<section class="stack" data-key="disc">${nominationList(v)}
    ${a.type === 'nominate' && a.mine ? `<p class="small muted center-text">${th('You accused <b>{name}</b>. One nomination per Day.', { name: rawName(a.mine) })}</p>` : ''}
    <p class="small muted center-text">${v.day.nominees.length ? t('When nominations close, each nominee defends themselves.') : t('No nominations means no vote — and no sentence.')}</p></section>`;
}

function defenseStage(v, me) {
  const d = v.day;
  return `<section class="stack" data-key="def">${nominationList(v)}
    ${d.speaking === me.id ? (me.statuses.includes('MUTE') ? `<div class="banner blood" data-key="myturn"><div><b>${t('Your turn — but you are muted.')}</b><p>${t('Plead without words.')}</p></div></div>` : `<div class="banner spot" data-key="myturn"><div><b>${t('Your turn to speak.')}</b><p>${t('Make your case to the table.')}</p></div></div>`) : ''}
  </section>`;
}

function votingStage(v) {
  const a = v.action;
  if (a.type === 'novote') return `<div class="banner blood" data-key="nov"><div><b>${t('Voting disabled.')}</b><p>${t('You have no vote today.')}</p></div></div>`;
  if (a.type !== 'ballot') return '';
  const sel = S.sel.vote ?? a.choice;
  return `<section class="stack" data-key="ballot">
    <div class="row center">
      <span class="tag ${a.ghost ? '' : 'solid'}">${a.ghost ? t('Ghost ballot · weight 1') : th('Your weight · {n}', { n: a.weight })}</span>
      <button class="btn btn-sm ${sel === 'ABSTAIN' ? 'btn-solid' : ''}" data-act="pickVote" data-id="ABSTAIN">${t('Abstain')}</button>
    </div>
    ${a.ghost && a.majority ? `<p class="small muted center-text">${t('Majority Rule: ghost ballots never decide the sentence.')}</p>` : ''}
    ${v.day.majority != null ? `<p class="small muted center-text">${th('Majority Rule: more than {n} weight needed.', { n: v.day.majority })}</p>` : ''}
    ${v.day.openBallots ? openBallotList(v) : `<p class="small muted center-text">${t(v.table?.tieBreak === 'coin' ? 'Secret until it locks. Only totals are published. A tie is settled by a coin toss.' : 'Secret until it locks. Only totals are published. A tie sentences nobody.')}</p>`}
  </section>`;
}

/** Open Ballot: who is voting for whom, live. */
function openBallotList(v) {
  const by = {};
  for (const [voter, tg] of Object.entries(v.day.openBallots)) (by[tg] ||= []).push(voter);
  const rows = Object.entries(by).sort((a, b) => b[1].length - a[1].length);
  return `<div class="open-ballots" data-key="ob"><span class="kicker">${t('Open Ballot')}</span>${rows.length ? rows.map(([tg, voters]) => `<div class="ob-row" data-key="ob-${tg}"><b>${tg === 'ABSTAIN' ? t('Abstain') : pname(tg)}</b><span>${voters.map(pname).join(', ')}</span></div>`).join('') : `<p class="small muted">${t('No votes yet.')}</p>`}</div>`;
}
function openBallotMarks(v) {
  const marks = {};
  for (const [voter, tg] of Object.entries(v.day?.openBallots ?? {})) if (tg !== 'ABSTAIN') marks[tg] = (marks[tg] ?? '') + initials(rawName(voter));
  return marks;
}

// ── Chat ───────────────────────────────────────────────────────────────────
function chatBlock(v) {
  if (!v.chats?.length) return '';
  const active = v.chats.find((c) => c.id === S.ui.chat) ?? v.chats[0];
  const myId = v.me?.id;
  const who = (m) => (m.from === myId ? t('You') : m.from == null ? t('Stranger') : m.name);
  return `<section class="chat" data-key="chat">
    <div class="tabs-row">${v.chats.map((c) => `<button class="chip ${c.id === active.id ? 'on' : ''}" data-act="chatTab" data-id="${esc(c.id)}">${tmh(c.label)}</button>`).join('')}</div>
    <div class="log" data-scroll="chat-${esc(active.id)}" data-key="log-${esc(active.id)}">${active.messages.length ? active.messages.map((m, i) => `<div class="msg ${m.from === myId ? 'mine' : ''}" data-key="m-${m.ts}-${i}"><b>${esc(who(m))}</b><span>${esc(m.text)}</span></div>`).join('') : `<p class="small muted">${t('No messages yet.')}</p>`}</div>
    ${active.canSend ? `<form data-form="chat" data-id="${esc(active.id)}"><input class="input" maxlength="280" placeholder="${esc(t('Say something…'))}" data-draft="chat" value="${esc(S.drafts.chat ?? '')}" autocomplete="off"><button class="btn btn-sm" type="submit">${t('Send')}</button></form>` : `<p class="small muted">${t('You cannot speak here right now.')}</p>`}
  </section>`;
}

// ── Night ──────────────────────────────────────────────────────────────────
const progressLine = (p) => (p ? th('{done}/{total} {label}', { done: p.done, total: p.total, label: t(p.label) }) : '');

function nightMain(v, me) {
  if (!me.alive || v.action.type === 'spectate') {
    return `${head(v)}
      ${me.alive ? `<div class="banner" data-key="spec">${glyph('death')}<div><b>${t('You returned too late to act tonight.')}</b><p>${t('No dreams, no powers. Dawn will tell.')}</p></div></div>` : deadBanner(v)}
      ${ring(v, { center: centerFor(v) })}${chips(v)}`;
  }
  // Nightfall: a fixed five-second grace, then actions open by themselves.
  if (v.phase === 'NIGHT_DREAM_SWAP') return `${head(v)}<div class="night-body" data-key="nightbody">${nightfallStage(v, me, v.action)}</div>${chips(v)}`;
  if (S.ui.veiled[v.phaseId]) {
    return `${head(v)}
      <section class="curtain" data-key="curtain">
        ${moon(0.3, 'big')}
        <p>${t('Make sure nobody can see your screen.')}</p>
        <button class="btn btn-solid" data-act="unveil">${t('Open your eyes')}</button>
        <span class="small muted">${progressLine(v.progress)}</span>
      </section>${chips(v)}`;
  }
  return `${head(v, `<button class="btn btn-sm btn-ghost cover" data-act="veil" data-key="cover">${glyph('veil')} ${t('Cover')}</button>`)}${ruleRibbon(v, me)}<div class="night-body" data-key="nightbody">${actionsStage(v, me, v.action)}</div>${chips(v)}`;
}

function nightfallStage(v, me, a) {
  const blood = v.bloodMoon ? `<div class="banner blood bm-banner" data-key="bm">${moon(1, 'blood')}<div><b>${t('Blood Moon')}</b><p>${t('No protection holds tonight.')}</p></div></div>` : '';
  const count = (line) => `<div class="nightfall-count" data-key="nfc"><b data-secs></b><span>${t(line)}</span></div>`;
  if (!me.dream) {
    return `<section class="nightfall" data-key="nightfall">${blood}${moon(0.08, 'big drift')}<h2>${t('Night falls')}</h2>${count('Shield your screen — your night begins in a moment.')}</section>`;
  }
  // Everyone turns over tonight's Dream; Dream Snatchers may also swap.
  const reveal = `<div class="dream-reveal" data-key="dr-${me.dream.id}-${v.phaseId}"><div class="dr-in">
      <div class="dr-face back">${moon(0.08)}</div>
      <div class="dr-face front">${dreamGlyph(me.dream.id)}<span class="kicker">${t('Tonight\'s dream')}</span><h3>${esc(dreamF(me.dream.id, 'name'))}</h3><p>${esc(dreamF(me.dream.id, 'text'))}</p></div>
    </div></div>`;
  if (a.type === 'swap' && a.snatcher) {
    // Snatchers need the table, so their card is compact and the ring comes first.
    const { pick } = activePick(v);
    return `<section class="nightfall snatch" data-key="nightfall-s">
      ${blood}${dreamCard(me.dream)}
      <p class="small center-text swaphint" data-key="swaphint">${t('Dream Snatcher: tap a seat to swap Dream cards before the night opens — or leave it and keep yours.')}</p>
      ${ring(v, { pick, center: centerFor(v, pick) })}
      ${count('Night actions open when the count ends.')}
    </section>`;
  }
  return `<section class="nightfall" data-key="nightfall">${blood}${reveal}${count('Shield your screen. Night actions open when the count ends.')}</section>`;
}

function sleepingHtml(v, line) {
  return `<section class="sleeping" data-key="sleeping">
    <div class="zz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></div>
    ${moon(v.progress ? v.progress.done / Math.max(1, v.progress.total) : 0, 'big')}
    <p>${esc(line)}</p>
    <span class="small muted">${v.progress ? `${progressLine(v.progress)} — ` : ''}${t('dawn comes when everyone sleeps, or when time runs out.')}</span>
  </section>`;
}

function dreamCard(d) {
  if (!d) return '';
  return `<div class="dream" data-key="dream-${d.id}">${dreamGlyph(d.id)}<div><span class="kicker">${t('Tonight\'s dream')}</span><h3>${esc(dreamF(d.id, 'name'))}</h3><p>${esc(dreamF(d.id, 'text'))}</p></div></div>`;
}

function actionsStage(v, me, a) {
  if (a.done) {
    return `${sleepingHtml(v, t('You are asleep.'))}${submittedSummary(a)}<div class="row center" data-key="wake"><button class="btn btn-ghost btn-sm" data-act="reopen">${t('Wake up and change my mind')}</button></div>${chatBlock(v)}`;
  }
  const { ctx, pick } = activePick(v);
  const parts = [dreamCard(me.dream)];
  const s = a.schema;
  const rname = s?.role ? esc(roleF(s.role.id, 'name')) : '';
  if (me.sleepwalkPartner) parts.push(`<p class="small muted center-text" data-key="sw">${th('You are bound to {name}, seated just before you.', { name: me.sleepwalkPartner })}</p>`);
  // The ring (the actual decision) comes first; details follow beneath it.
  if (ctx.length) {
    parts.push(pickTabs(ctx, pick));
    const marks = {};
    if (a.death && pick.key === 'death') {
      for (const m of a.death.members) {
        if (m.id === me.id) continue;
        for (const x of a.death.proposals[m.id] ?? []) marks[x] = (marks[x] ?? '') + initials(m.name);
      }
    }
    parts.push(ring(v, { pick, center: centerFor(v, pick), marks }));
    if (pick.key === 'role' && s?.options && (S.sel.uses ?? []).length) {
      parts.push(`<div class="stack" data-key="useopts">${(S.sel.uses ?? []).map((u, i) => `<div class="optrow" data-key="uo-${u.target}"><span>${pname(u.target)}</span><div class="seg">${s.options.map((o) => `<button data-act="pickUseOption" data-i="${i}" data-id="${o.id}" aria-pressed="${u.option === o.id}">${esc(optLabel(o.id))}</button>`).join('')}</div></div>`).join('')}</div>`);
    }
    if (pick.key === 'role' && s?.kind === 'chat') parts.push(`<div class="row center" data-key="conspbtn"><button class="btn" data-act="conspire" ${S.sel.conspire ? '' : 'disabled'}>${t('Open whisper')}</button></div>`);
  }
  if (a.death) parts.push(deathRoom(v, me, a.death));
  else if (!s) parts.push(`<p class="muted center-text" data-key="noact">${esc(noActionReason(me, v))}</p>`);
  else if (s.blocked === 'paralysis') parts.push(`<div class="banner blood" data-key="para">${dreamGlyph('SLEEP_PARALYSIS')}<div><b>${esc(dreamF('SLEEP_PARALYSIS', 'name'))}</b><p>${t('You cannot use your role tonight.')}</p></div></div>`);
  else if (s.kind === 'choice') {
    const sel = S.sel.uses ?? [];
    parts.push(`<section class="stack" data-key="choice"><div class="rule">${rname}${s.charges === 1 ? ` · ${t('once per game')}` : ''}</div><div class="options">${s.options.map((o) => `<button class="option" data-act="pickOption" data-id="${o.id}" aria-pressed="${sel[0]?.option === o.id}" data-key="o-${o.id}">${esc(optLabel(o.id))}</button>`).join('')}</div>
      ${s.role.id === 'DOUBLE_AGENT' ? `<p class="small muted">${t('Mandatory and permanent. No choice means you stay non-Death.')}</p>` : ''}</section>`);
  } else if (s.kind === 'chat' && (a.conspire || v.chats?.some((c) => c.id.startsWith(`consp:${v.nightNumber}:${me.id}`)))) {
    parts.push(`<p class="small muted center-text" data-key="wh">${t('Your whisper is open below. Your partner sees only "Stranger".')}</p>`);
  } else {
    parts.push(`<p class="small muted center-text" data-key="rolehint">${rname}${s.charges === 1 ? ` · ${t('once per game')}` : ''}${s.uses > 1 ? ` · ${t('twice tonight')}` : ''}${s.role.id === 'MIMIC' ? ` · ${t('mandatory, or you stay powerless')}` : ''}${s.kind === 'dead' ? ` · ${t('you must survive the night')}` : ''}</p>`);
  }
  if (!a.death && !ctx.length && me.role) parts.push(roleCardHtml(me.role, { align: me.alignment, mini: true }));
  parts.push(chatBlock(v));
  return parts.join('');
}

function submittedSummary(a) {
  if (a.death) {
    const mine = a.death.proposals?.[V().me.id] ?? [];
    return `<p class="small muted center-text" data-key="sub">${mine.length ? th('You confirmed: {names}.', { names: mine.map(rawName) }) : t('You confirmed a pass.')}</p>`;
  }
  if (a.submitted?.length) return `<p class="small muted center-text" data-key="sub">${th('Submitted: {what}.', { what: a.submitted.map((u) => [u.target ? rawName(u.target) : '', u.option ? optLabel(u.option) : ''].filter(Boolean).join(' · ')).join('; ') })}</p>`;
  return '';
}

function noActionReason(me, v) {
  if (me.mimicPowerless) return t('Your copy failed. No action — waiting for dawn.');
  if (me.role?.id === 'MIMIC' || me.role?.id === 'DOUBLE_AGENT') return t('Your choice was made on Night 1. Waiting for dawn.');
  if (Object.values(me.charges || {}).some((n) => n === 0)) return t('Your once-per-game power is spent. Waiting for dawn.');
  if (me.alignment === 'DEATH' && me.joinsTeamNight) return t('You join the Death team on Night {n}.', { n: roman(me.joinsTeamNight) });
  if (me.originalRole && v.nightNumber < 2) return t('Your new powers begin next night.');
  return t('No action tonight. Close your eyes and wait for dawn.');
}

function deathRoom(v, me, D) {
  const keyOf = (arr) => [...(arr || [])].sort().join(',');
  const props = D.members.map((m) => ({ ...m, picks: m.id === me.id ? (S.sel.death ?? D.proposals[m.id] ?? null) : D.proposals[m.id] ?? null, confirmed: D.confirmed[m.id] }));
  const agree = props.every((p) => p.picks && keyOf(p.picks) === keyOf(props[0].picks));
  return `<section class="death-room" data-key="droom">
    <div class="dr-head"><span class="kicker blood">${t('The Death room')}</span><span class="tag blood">${th('Capacity {n}', { n: D.capacity })}</span></div>
    ${D.paralysed ? `<div class="banner blood" data-key="dpara">${dreamGlyph('SLEEP_PARALYSIS')}<div><b>${t('You hold Sleep Paralysis.')}</b><p>${t('The whole kill is blocked tonight. Your team does not know.')}</p></div></div>` : ''}
    <ul class="mates">${props.map((p) => `<li class="${p.confirmed ? 'ok' : ''}" data-key="mate-${p.id}"><span class="mate-ini">${initials(p.name)}</span><span><b>${esc(p.id === me.id ? t('You') : p.name)}</b><small>${p.picks ? (p.picks.length ? p.picks.map(pname).join(' + ') : t('pass')) : t('thinking…')}</small></span>${p.confirmed ? `<i class="ok-mark">${glyph('check')}</i>` : ''}</li>`).join('')}</ul>
    <p class="agree ${agree ? 'yes' : 'no'}" data-key="agree-${agree}">${D.members.length === 1 ? t('You hunt alone.') : agree ? t('Your team agrees.') : t('Not agreed. Unless every one of you confirms the same target, nobody dies.')}</p>
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
function endMain(v, me) {
  const title = t({ DEATH: 'Death wins.', NON_DEATH: 'The living win.', JESTER: 'The Jester wins.', DRAW: 'A draw.', ABORTED: 'Abandoned.', LOVERS: 'The Lovers win.', CULT: 'The Cult wins.', RIPPER: 'The Ripper wins.' }[v.winner] ?? 'The End');
  const won = didIWin(v, v.winner);
  const revealed = v.players.some((p) => p.role);
  return `<section class="verdict ${v.winner === 'DEATH' ? 'death' : WIN_CLASS[v.winner] ?? ''}" data-key="verdict">${WIN_CLASS[v.winner] ? '<div class="sunburst" aria-hidden="true"></div>' : ''}<span class="kicker">${t('Verdict')}</span><h1>${letters(title)}</h1><p class="scenario">${tmh(v.endReason)}</p>
      ${won === null ? '' : `<div class="result-stamp ${won ? 'win' : 'loss'}">${won ? t('Victory') : t('Defeat')}</div>`}</section>
    ${revealed ? ring(v, { reveal: true, center: centerFor(v), marks: v.mode === 'missions' ? missionMarks(v) : {}, extra: v.mode === 'missions' ? hunchArrowsSvg(v) : '' }) : ''}
    ${revealed && v.missions?.hunches?.length ? hunchLegend() : ''}
    ${v.mode === 'missions' ? missionEndHtml(v) : ''}
    <section data-key="reveal"><div class="rule">${t('Every secret')}</div>${revealed ? `<ul class="ledger">${v.players.map((p, i) => `<li class="${p.alive ? '' : 'dead'} ${p.id === me?.id ? 'me' : ''}" style="--i:${i}" data-key="rv-${p.id}">
      <span class="seat">${p.role ? glyph(p.role.glyph) : ''}</span>
      <span class="who"><b>${esc(p.name)}</b><small>${p.role ? esc(roleF(p.role.id, 'name')) : '—'}${p.originalRole ? ` ${th('(was {role})', { role: p.originalRole.id })}` : ''} · ${p.alive ? t('alive') : `† ${esc(stamp(p.diedAt))}`}</small></span>
      <span class="tags">${p.lover ? `<span class="tag love" title="${esc(t('Lovers'))}">${glyph('heart')}</span>` : ''}<span class="tag ${p.alignment === 'DEATH' ? 'blood' : ''}">${esc(ALIGN[p.alignment] ?? '')}</span></span></li>`).join('')}</ul>` : `<p class="muted">${t('The host chose not to reveal roles.')}</p>`}</section>
    ${me && !me.moderator ? `<details class="more" data-key="endnotes"><summary>${t('My notes')}</summary><div>${feed([...(v.private || [])].reverse(), 'feed-private')}</div></details>` : ''}
    <details class="more" data-key="endrec"><summary>${t('Public record')}</summary><div>${recordBlock(v)}</div></details>
    <div class="row center" data-key="endbtns">${v.recap ? `<button class="btn btn-solid" data-act="recap">${glyph('scroll')} ${t('View recap')}</button>` : ''}<a class="btn" href="/" data-link>${t('Back to start')}</a></div>`;
}

// ── Moderator ──────────────────────────────────────────────────────────────
function moderatorMain(v) {
  if (v.phase === 'LOBBY') return lobbyMain(v, v.me);
  if (v.phase === 'ENDED' && v.mode === 'missions') return endMain(v, v.me);
  const sec = Object.fromEntries((v.secrets || []).map((s) => [s.id, s]));
  if (isMissionPhase(v.phase)) {
    const ms = v.missionSecrets || {};
    const line = (p) => [ms.votes && p.id in ms.votes ? t(ms.votes[p.id] ? 'approves' : 'rejects') : '', ms.plays?.[p.id] ? t(ms.plays[p.id] === 'F' ? 'plays Sabotage' : 'plays Succeed') : '',
      ms.night?.hunch?.[p.id] ? th('hunch: {name}', { name: rawName(ms.night.hunch[p.id]) }) : '', ms.stand?.[p.id] ? th('names {name}', { name: rawName(ms.stand[p.id]) }) : '', ms.reckon?.[p.id] ? th('suggests {name}', { name: rawName(ms.reckon[p.id]) }) : ''].filter(Boolean).join(' · ');
    return `${head(v)}
    <div class="banner blood" data-key="modb">${glyph('mentalist')}<div><b>${t('Trusted moderator view')}</b><p>${t('You see everything. Do not show this screen to players.')}</p></div></div>
    ${trackHtml(v)}
    ${ring(v, { center: centerFor(v), marks: missionMarks(v), pick: v.missions?.proposal && ['M_VOTE', 'M_MISSION'].includes(v.phase) ? { ids: [], selected: v.missions.proposal.team, act: '' } : null })}
    <section data-key="modall"><div class="rule">${t('Everyone')}</div><ul class="ledger">${v.players.map((p) => { const s = sec[p.id] || {}; return `<li data-key="mod-${p.id}"><span class="seat">${String(p.seat + 1).padStart(2, '0')}</span><span class="who"><b>${esc(p.name)}</b><small>${s.roleId ? esc(roleF(s.roleId, 'name')) : ''} · ${esc(ALIGN[s.alignment] ?? '')}${line(p) ? ` · ${esc(line(p))}` : ''}</small></span></li>`; }).join('')}</ul></section>
    <section data-key="modgrid"><div class="rule">${t('The missions')}</div>${gridHtml(v)}</section>`;
  }
  return `${head(v)}
    <div class="banner blood" data-key="modb">${glyph('mentalist')}<div><b>${t('Trusted moderator view')}</b><p>${t('You see everything. Do not show this screen to players.')}</p></div></div>
    ${ring(v, { center: centerFor(v) })}
    ${v.deathTeam ? `<div class="panel seal tight" data-key="moddt"><span class="kicker blood">${th('Death room · capacity {n}', { n: v.deathTeam.capacity })}</span>${v.deathTeam.members.map((id) => `<p>${pname(id)}: ${(v.deathTeam.proposals[id] || []).map(pname).join(' + ') || '—'} ${v.deathTeam.confirmed[id] ? `(${t('confirmed')})` : ''}</p>`).join('')}</div>` : ''}
    ${v.day ? nominationList(v) : ''}
    <section data-key="modall"><div class="rule">${t('Everyone')}</div><ul class="ledger">${v.players.map((p) => { const s = sec[p.id] || {}; return `<li class="${p.alive ? '' : 'dead'}" data-key="mod-${p.id}"><span class="seat">${String(p.seat + 1).padStart(2, '0')}</span><span class="who"><b>${esc(p.name)}</b><small>${s.roleId ? esc(roleF(s.roleId, 'name')) : ''} · ${esc(ALIGN[s.alignment] ?? '')}${s.dreamId ? ` · ${th('dreams {dream}', { dream: s.dreamId })}` : ''}${s.statuses?.length ? ` · ${s.statuses.map(optLabel).join(', ')}` : ''}${s.action ? ` · ${s.action.map((u) => [u.target ? pname(u.target) : '', u.option ? esc(optLabel(u.option)) : ''].filter(Boolean).join(' ')).join('; ')}` : ''}${s.ballot ? ` · ${s.ballot === 'ABSTAIN' ? t('abstains') : th('votes {name}', { name: rawName(s.ballot) })}` : ''}</small></span><span class="tags">${s.done ? `<span class="tag solid">${t('Done')}</span>` : ''}</span></li>`; }).join('')}</ul></section>`;
}

/** Translation and markup helpers shared with the board, Gazette and guide. */
const H = { esc, glyph, dreamGlyph, t, th, tm, tmh, entryMsg, stamp, roleF, dreamF, ruleF, presetF, scen, tlist, tx, getLang, mcardF };
/** Helpers for the Missions screens (public/missions.js). */
const MH = { S, ring, head: (...a) => head(...a), chips: (...a) => chips(...a), activePick: (...a) => activePick(...a), pickTabs: (...a) => pickTabs(...a), chatBlock: (...a) => chatBlock(...a) };

// ── First-game tips ────────────────────────────────────────────────────────
const TIPS_KEY = 'deadset:tutorial';
const TIPS_SEEN = 'deadset:tips-seen';
const tipsOn = () => localStorage.getItem(TIPS_KEY) === '1';
const tipsSeen = () => { try { return new Set(JSON.parse(localStorage.getItem(TIPS_SEEN) || '[]')); } catch { return new Set(); } };
function tutorialToggle() {
  return `<label class="check" data-key="tut"><input type="checkbox" data-act="tutorialToggle" ${tipsOn() ? 'checked' : ''}><span><b>${t('First-game tips')}</b><small>${t('Short hints walk you through each step of your first game.')}</small></span></label>`;
}
const TUTORIAL = {
  lobbyHost: ['You are the host', 'Share the code, the link or the QR. Standard is the best mode for a first game. When everyone is ready, hold Start.'],
  lobby: ['Welcome to the table', 'Wait for everyone to arrive and read the deck below. Then tap Ready; the host starts the game.'],
  night0: ['Your secret role', 'Shield your screen and tap the card to turn it over. Read what your role does, then tap Understood. Nobody acts tonight.'],
  night0Death: ['You are Death', 'You and your teammates know each other. Each night you agree on one victim. By day, blend in and steer suspicion away.'],
  morning: ['Morning', 'The news tells you who died in the night. Anything only you learned is under Notes. The host opens the discussion.'],
  discussion: ['Talk it out', 'Share suspicions — lying is allowed. Tap a seat, then confirm, to accuse someone. One accusation per day.'],
  defense: ['The defence', 'Each accused player speaks in turn. Listen for slips and contradictions.'],
  voting: ['Your secret vote', 'Tap the accused you trust least, then confirm. Only totals are shown. A tie at the top sentences nobody.'],
  voteNo: ['No vote today', 'You cannot vote today, but you can still watch and listen.'],
  resolving: ['A final act', 'The condemned may take someone with them. Wait for their choice.'],
  nightfall: ['Night falls', 'Shield your screen. Your night actions open by themselves in a moment.'],
  nightfallDream: ['Tonight\'s Dream', 'Everyone gets a Dream: a twist that lasts one night. Read it before the count ends.'],
  nightPower: ['Use your power', 'Tap a seat (or an option), then Commit & sleep. If you would rather not, Pass & sleep. Nobody sees what you chose.'],
  nightDeath: ['Choose a victim', 'Every Death must confirm the same target, or nobody dies tonight. Talk in the Death room, then confirm.'],
  nightNone: ['A quiet night for you', 'You have nothing to do tonight. Tap Go to sleep and wait for dawn.'],
  dead: ['You are out', 'Stay and watch, but don\'t give hints to the living. Your role stays secret unless the table reveals it.'],
  ended: ['Game over', 'Every secret is out. Tap View recap to replay who did what, night by night.'],
};
function coachKey(v) {
  const me = v.me;
  if (!me || me.moderator) return null;
  if (v.phase === 'LOBBY') return me.isHost ? 'lobbyHost' : 'lobby';
  if (v.phase === 'ENDED') return v.recap ? 'ended' : null;
  if (v.phase === 'NIGHT_0_REVEAL') return me.alignment === 'DEATH' ? 'night0Death' : 'night0';
  if (!me.alive) return 'dead';
  const a = v.action || {};
  switch (v.phase) {
    case 'DAY_PREP': return 'morning';
    case 'DAY_DISCUSSION': return 'discussion';
    case 'DAY_DEFENSE': return 'defense';
    case 'DAY_VOTING': return a.type === 'ballot' ? 'voting' : 'voteNo';
    case 'DAY_RESOLVING': return 'resolving';
    case 'NIGHT_DREAM_SWAP': return me.dream ? 'nightfallDream' : 'nightfall';
    case 'NIGHT_ACTIONS': return a.death ? 'nightDeath' : a.schema && !a.schema.blocked ? 'nightPower' : 'nightNone';
    default: return null;
  }
}
function coachCard(v) {
  if (!tipsOn()) return '';
  const key = coachKey(v);
  if (!key || tipsSeen().has(key)) return '';
  const [title, text] = TUTORIAL[key];
  return `<aside class="coach" data-key="coach-${key}" role="note">${glyph('scroll')}<div><span class="kicker">${t('First-game tip')}</span><b>${t(title)}</b><p>${t(text)}</p>
    <div class="row"><button class="btn btn-sm" data-act="coachDone" data-id="${key}">${t('Got it')}</button><button class="btn btn-sm btn-ghost" data-act="tutorialOff">${t('Turn tips off')}</button></div></div></aside>`;
}

// ── End-of-game recap ──────────────────────────────────────────────────────
const RECAP_KIND = {
  DEATH: 'death', TERRORIST: 'death', PSYCHO: 'death', GUARDIAN: 'protect', BODYGUARD: 'protect', ORACLE: 'protect', WITCH: 'protect',
  MENTALIST: 'info', WHORE: 'other', TRAVELING_AGENT: 'other', MIMIC: 'other', NECROMANCER: 'protect', GAMBLER: 'other', CONSPIRATOR: 'info', SHARED_NIGHTMARE: 'dream',
  RIPPER: 'death', CULT_LEADER: 'cult',
};
const RECAP_ROLE = { accuse: 'Accusation', vote: 'Vote', death: 'Kill or harm', protect: 'Protection', info: 'Reading or whisper', other: 'Other visit', dream: 'Dream link', cult: 'Recruitment' };
function recapSteps(v) {
  const steps = [];
  const gone = new Set();
  for (const h of v.recap || []) {
    const deadBefore = new Set(gone);
    if (h.kind === 'day') {
      const arrows = [];
      for (const n of h.nominations) arrows.push({ from: n.by, to: n.target, cls: 'accuse' });
      for (const [voter, target] of Object.entries(h.ballots)) if (target !== 'ABSTAIN') arrows.push({ from: voter, to: target, cls: 'vote' });
      for (const [voter, target] of Object.entries(h.ghostBallots || {})) if (target !== 'ABSTAIN') arrows.push({ from: voter, to: target, cls: 'vote ghost' });
      for (const [shooter, target] of Object.entries(h.shots || {})) arrows.push({ from: shooter, to: target, cls: 'death' });
      const lines = [];
      for (const [shooter, target] of Object.entries(h.shots || {})) lines.push(th('{a} (Vigilante) shot at {b}.', { a: rawName(shooter), b: rawName(target) }));
      for (const n of h.nominations) lines.push(th('{a} accuses {b}', { a: rawName(n.by), b: rawName(n.target) }));
      const votes = Object.entries(h.ballots);
      if (votes.length) lines.push(votes.map(([vtr, tg]) => th(tg === 'ABSTAIN' ? '{a} abstained' : '{a} voted {b}', { a: rawName(vtr), b: tg === 'ABSTAIN' ? '' : rawName(tg) })).join(' · '));
      if (h.sentenced) { lines.push(`<b>${th('{name} sentenced', { name: rawName(h.sentenced) })}</b>`); gone.add(h.sentenced); } else if (h.nominations.length) lines.push(t(h.cancelled ? 'Sentence cancelled' : 'No sentence'));
      for (const id of Object.keys(h.shots || {})) { const tg = h.shots[id]; if (!v.players.find((p) => p.id === tg)?.alive) gone.add(tg); }
      steps.push({ title: t('Day {n}', { n: roman(h.n) }), night: false, arrows, lines, deadBefore, died: h.sentenced ? [h.sentenced] : [] });
    } else {
      const arrows = [];
      for (const a of h.arrows) {
        const froms = Array.isArray(a.from) ? a.from : [a.from];
        for (const f of froms) arrows.push({ from: f, to: a.to, cls: `${RECAP_KIND[a.role] ?? 'other'} ${a.ok === false ? 'failed' : ''}` });
      }
      const lines = h.lines.map((l) => tmh(l));
      if (h.bloodMoon) lines.unshift(`<b class="blood">${t('Blood Moon')}</b>`);
      for (const id of h.died) gone.add(id);
      steps.push({ title: t('Night {n}', { n: roman(h.n) }), night: true, arrows, lines, deadBefore, died: h.died });
    }
  }
  return steps;
}
function recapRing(v, step) {
  const players = [...v.players].sort((a, b) => a.seat - b.seat);
  const { pos, dense } = seatLayout(players.length);
  const at = (id) => pos[players.findIndex((p) => p.id === id)];
  const r = dense ? 3.4 : 4.8;
  const paths = step.arrows.map((a, i) => {
    const p1 = at(a.from); const p2 = at(a.to);
    if (!p1 || !p2) return '';
    if (a.from === a.to) return `<path class="ra ${a.cls}" style="--d:${0.15 + i * 0.12}s" pathLength="1" d="M${(p1.x - r * 0.7).toFixed(1)} ${(p1.y - r * 0.7).toFixed(1)} c-6 -9 8 -9 ${(r * 1.4).toFixed(1)} 0" marker-end="url(#rah)"/>`;
    const dx = p2.x - p1.x; const dy = p2.y - p1.y; const len = Math.hypot(dx, dy) || 1;
    const sx = p1.x + (dx / len) * r; const sy = p1.y + (dy / len) * r; const ex = p2.x - (dx / len) * (r + 1); const ey = p2.y - (dy / len) * (r + 1);
    const mx = (sx + ex) / 2 * 0.7 + 50 * 0.3; const my = (sy + ey) / 2 * 0.7 + 50 * 0.3;
    return `<path class="ra ${a.cls}" style="--d:${0.15 + i * 0.12}s" pathLength="1" d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" marker-end="url(#rah)"/>`;
  }).join('');
  const seats = players.map((p, i) => {
    const q = pos[i];
    const cls = [step.deadBefore.has(p.id) ? 'gone' : '', step.died.includes(p.id) ? 'falls' : '', p.alignment === 'DEATH' ? 'death' : ''].join(' ');
    return `<g class="rs ${cls}"><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${r}"/><text x="${q.x.toFixed(1)}" y="${(q.y + r * 0.38).toFixed(1)}" font-size="${(r * 1.05).toFixed(1)}">${esc(initials(p.name))}</text><text class="rs-name" x="${q.x.toFixed(1)}" y="${(q.y + r + 3.2).toFixed(1)}" font-size="${dense ? 2.2 : 2.8}">${esc(p.name)}</text></g>`;
  }).join('');
  return `<svg class="recap-ring" viewBox="-4 -4 108 108" aria-hidden="true"><defs><marker id="rah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z"/></marker></defs><circle class="rr-table" cx="50" cy="50" r="${dense ? 22 : 28}"/>${paths}${seats}</svg>`;
}
function recapHtml(v) {
  const steps = recapSteps(v);
  if (!steps.length) return '';
  const i = Math.max(0, Math.min(steps.length - 1, S.ui.recap.i));
  const st = steps[i];
  const kinds = [...new Set(st.arrows.map((a) => a.cls.split(' ')[0]))];
  return `<div class="recap ${st.night ? 'is-night' : ''}" data-key="recap" role="dialog" aria-label="${esc(t('Recap'))}">
    <div class="recap-top"><span class="kicker">${t('Recap · {a} of {b}', { a: i + 1, b: steps.length })}</span><button class="btn btn-ghost icon-btn" data-act="recapClose" aria-label="${esc(t('Close'))}">${glyph('close')}</button></div>
    <h2 class="recap-title" data-key="rt-${i}">${st.night ? `<i>${esc(st.title)}</i>` : esc(st.title)}</h2>
    <div class="recap-body" data-key="rb-${i}">${recapRing(v, st)}
      <div class="recap-side"><div class="recap-legend">${kinds.map((k) => `<span class="rl ${k}"><i></i>${t(RECAP_ROLE[k] ?? 'Other visit')}</span>`).join('')}</div>
      <ul class="recap-lines">${st.lines.map((l, k) => `<li style="--d:${0.3 + k * 0.12}s">${l}</li>`).join('') || `<li>${t('Nothing happened.')}</li>`}</ul></div></div>
    <div class="recap-nav"><button class="btn" data-act="recapStep" data-d="-1" ${i === 0 ? 'disabled' : ''}>‹ ${t('Back')}</button>
      <button class="btn ${S.ui.recap.play ? '' : 'btn-solid'}" data-act="recapPlay">${t(S.ui.recap.play ? 'Pause' : 'Play')}</button>
      <button class="btn" data-act="recapStep" data-d="1" ${i === steps.length - 1 ? 'disabled' : ''}>${t('Next')} ›</button></div>
  </div>`;
}

// ── Board (public TV display) ──────────────────────────────────────────────
function boardView() {
  const v = V();
  if (S.conn === 'gone') return goneScreen();
  if (!v) return loadingScreen();
  return boardScreen(v, { ...H, ring, centerFor, roman, codeTiles, qrSvg, STEP, stepOf, phaseWord, content: S.content, audio: S.board.audio, wordmark });
}

// ── Dock (primary action) ──────────────────────────────────────────────────
function dock(v) {
  const me = v.me;
  const a = v.action;
  const parts = [];
  const hostNext = v.host?.advance && v.phase !== 'LOBBY' ? holdBtn('advance', t(v.host.advance), 'btn-host', { key: 'dock-adv' }) : '';
  const btn = (label, act, cls = 'btn-solid', dis = false, key = act, extra = '') => `<button class="btn ${cls}" data-act="${act}" data-key="d-${key}" ${extra} ${dis ? 'disabled' : ''} ${S.pending ? 'data-pending' : ''}>${label}</button>`;
  const startLabel = () => (v.setup.notReady ? th('Waiting for {n} to ready up', { n: v.setup.notReady }) : v.setup.ok ? t('Hold to start') : t('Fix setup first'));
  if (me?.moderator) {
    if (v.phase === 'LOBBY' && v.host) parts.push(holdBtn('start', startLabel(), 'btn-solid', { dis: !v.setup.ok || !!v.setup.notReady }));
  } else if (me) {
    switch (v.phase) {
      case 'LOBBY': {
        const need = 5 - v.players.length;
        if (v.host) parts.push(holdBtn('start', need > 0 ? (need === 1 ? t('Need 1 more player') : th('Need {n} more players', { n: need })) : startLabel(), `btn-solid ${v.setup.ok && !v.setup.notReady ? 'glow' : ''}`, { dis: !v.setup.ok || !!v.setup.notReady }));
        else parts.push(btn(me.ready ? `${glyph('check')} ${t('Ready')}` : t('I\'m ready'), 'ready', me.ready ? 'is-on' : 'btn-solid glow'));
        break;
      }
      case 'NIGHT_0_REVEAL':
        if (!me.acknowledged) parts.push(btn(t('Understood'), 'ack', 'btn-solid', !S.ui.flipped[`n0-${v.phaseId}`]));
        break;
      case 'DAY_PREP': {
        const shot = a.abilities?.find((x) => x.kind === 'shoot' && x.choice);
        if (shot) parts.push(`<span class="dock-note blood" data-key="aim">${glyph('vigilante')} ${th('Aimed at {name}', { name: rawName(shot.choice) })}</span>`);
        break;
      }
      case 'DAY_DISCUSSION':
        if (a.type === 'nominate' && !a.mine && S.sel.nominate) parts.push(btn(th('Accuse {name}', { name: rawName(S.sel.nominate) }), 'nominate', 'btn-blood'));
        break;
      case 'DAY_VOTING':
        if (a.type === 'ballot') {
          const sel = S.sel.vote ?? a.choice;
          if (sel && sel !== a.choice) parts.push(btn(sel === 'ABSTAIN' ? t('Abstain') : th('Vote {name}', { name: rawName(sel) }), 'vote', 'btn-blood'));
          else if (a.choice) parts.push(`<span class="dock-note stamped" data-key="rec-${a.choice}">${glyph('check')} ${a.choice === 'ABSTAIN' ? t('Abstained') : th('Voted {name}', { name: rawName(a.choice) })}</span>`);
        }
        break;
      case 'DAY_RESOLVING':
        if (a.type === 'retaliate') {
          parts.push(btn(t('Go quietly'), 'retaliate', 'btn-ghost', false, 'quiet', 'data-none="1"'));
          if (S.sel.retaliate) parts.push(btn(th('Take {name}', { name: rawName(S.sel.retaliate) }), 'retaliate', 'btn-blood'));
        }
        break;
      case 'NIGHT_ACTIONS':
        if (a.type === 'night' && !a.done && !S.ui.veiled[v.phaseId]) { const r = commitReady(a); parts.push(btn(`${glyph('moon')} ${esc(r.label)}`, 'commit', a.death ? 'btn-blood' : 'btn-solid', !r.ok)); }
        break;
      default:
        if (isMissionPhase(v.phase)) parts.push(...missionDock(v, { S, btn, holdBtn, rawName }));
        break;
    }
  }
  if (hostNext) parts.unshift(`<span class="mobile-only host-slot" data-key="hostslot">${hostNext}</span>`);
  if (!parts.length) return '';
  return `<div class="dock" data-key="dock">${parts.join('')}</div>`;
}

function commitReady(a) {
  if (a.death) {
    const picks = S.sel.death ?? a.death.proposals[V().me.id] ?? [];
    return { ok: true, label: picks.length ? t('Confirm {x}', { x: picks.map(rawName).join(' + ') }) : t('Confirm: pass') };
  }
  const s = a.schema;
  if (!s || s.blocked || s.kind === 'chat') return { ok: true, label: t('Go to sleep') };
  const sel = S.sel.uses ?? [];
  if (!sel.length) return { ok: true, label: s.role.id === 'MIMIC' || s.role.id === 'DOUBLE_AGENT' ? t('Skip (not advised)') : t('Pass & sleep') };
  if (s.options && sel.some((u) => !u.option)) return { ok: false, label: t('Choose an option') };
  return { ok: true, label: t('Commit & sleep') };
}

// ── Actions ────────────────────────────────────────────────────────────────
const picked = (el, kill = false, secret = false) => {
  const on = el.getAttribute('aria-pressed') !== 'true';
  if (!secret) { uiSound(on ? 'pick' : 'unpick'); uiHaptic(on ? 10 : 5); }
  if (on) burstAt(el, { colors: kill ? ['#e2585e', '#b3242d', '#ece5d5'] : ['#ece5d5', '#bdb4a4'], count: 12, power: 2.6 });
};

const ACT = {
  async create() {
    const name = (S.drafts.createName ?? '').trim();
    if (!name) return toast('Enter your name first.', 'err');
    S.pending = true; render();
    try {
      const r = await api('/api/rooms', { name, moderated: S.ui.moderated, lang: getLang(), avatar: S.ui.moderated ? null : myAvatar() });
      saveSession(r.code, r);
      sound.play('reveal');
      go(`/r/${r.code}`);
    } catch (e) { toast(e.message, 'err'); } finally { S.pending = false; render(); }
  },
  toggleModerated() { S.ui.moderated = !S.ui.moderated; render(); },
  gotoRoom() {
    const code = (S.drafts.joinCode ?? '').trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) return toast('Room codes have six characters.', 'err');
    go(`/r/${code}`);
  },
  async join() {
    const name = (S.drafts.joinName ?? '').trim();
    if (!name) return toast('Enter your name first.', 'err');
    S.pending = true; render();
    try {
      const r = await api(`/api/rooms/${S.code}/join`, { name, avatar: myAvatar() });
      saveSession(r.code, r);
      S.token = r.token; S.pid = r.playerId;
      sound.play('reveal');
      connect();
    } catch (e) {
      if (e.status === 404) S.conn = 'gone';
      toast(e.message, 'err');
    } finally { S.pending = false; render(); }
  },
  toggleRecover() { S.ui.recover = !S.ui.recover; render(); },
  poolToggle(el) { const pool = new Set(V().settings.extendedPool); if (pool.has(el.dataset.id)) pool.delete(el.dataset.id); else pool.add(el.dataset.id); send('host.settings', { extendedPool: [...pool] }); },
  ruleToggle(el) { const sel = V().settings.rules.selected.filter((x) => x !== el.dataset.id); send('host.settings', { rules: { selected: sel } }); },
  recordMode() { S.ui.recordList = !S.ui.recordList; localStorage.setItem('deadset:record', S.ui.recordList ? 'list' : 'gazette'); render(); },
  homeTab(el) { S.ui.homeTab = el.dataset.id; render(); },
  openSeal(el) { S.ui.invite = true; sound.play('crack'); setTimeout(() => sound.play('unfold'), 250); haptic([25, 40, 25]); burstAt(el, { colors: ['#c33a43', '#7d151d', '#ece5d5'], count: 22, power: 4 }); render(); },
  recoverInvite() { S.ui.invite = true; S.ui.recover = true; render(); },
  async recover() {
    try {
      const r = await api(`/api/rooms/${S.code}/recover`, { recoveryCode: S.drafts.recCode });
      saveSession(r.code, r);
      S.token = r.token; S.pid = r.playerId; S.ui.recover = false;
      connect();
    } catch (e) { toast(e.message, 'err'); }
  },
  leave() {
    if (!confirm(t('Forget this seat on this device? You can only get it back with a recovery code from the host.'))) return;
    clearSession(S.code); disconnect(); S.token = null; go('/');
  },
  back() { if (history.length > 1) history.back(); else go('/'); },
  sheet(el) { const id = el.dataset.id; S.ui.sheet = id && S.ui.sheet !== id ? id : null; if (S.ui.sheet) uiSound('whoosh'); render(); },
  seatSheet(el) { S.ui.sheet = `seat:${el.dataset.id}`; render(); },
  sound() { sound.toggle(); render(); },
  copy(el) { navigator.clipboard?.writeText(el.dataset.text).then(() => toast(t('Invite link copied')), () => notify(el.dataset.text)); burstAt(el); },
  share(el) {
    if (navigator.share) navigator.share({ title: 'Dead Set', text: t('Take a seat at my Dead Set table'), url: el.dataset.text }).catch(() => {});
    else ACT.copy(el);
  },
  ready(el) { if (!V().me.ready) burstAt(el); send('lobby.ready', { ready: !V().me.ready }); },
  async start() { await send('host.start'); },
  preset(el) { send('host.settings', { preset: el.dataset.id }); },
  gameMode(el) {
    if (el.dataset.mode === V().mode) return;
    if (el.dataset.mode !== 'classic') burstAt(el);
    // The server remembers each mode's own last settings.
    send('host.settings', { mode: el.dataset.mode });
  },
  rulesMode(el) { send('host.settings', { rules: { mode: el.dataset.mode } }); },
  ruleCount(el) { send('host.settings', { rules: { count: Number(el.dataset.n) } }); },
  scenMode(el) { send('host.settings', { scenario: { mode: el.dataset.mode } }); },
  transport(el) { send('host.settings', { transport: el.dataset.mode }); },
  seat(el) { send('host.seat', { playerId: el.dataset.pid, dir: Number(el.dataset.dir) }); },
  kick(el) { if (confirm(t('Remove {name} from the table?', { name: rawName(el.dataset.pid) }))) { S.ui.sheet = null; send('host.kick', { playerId: el.dataset.pid }); } },
  advance(el) { S.ui.sheet = null; send('host.advance', { skipAll: !!el.dataset.skip }); },
  extend() { send('host.extend', { seconds: 30 }); },
  end() { if (confirm(t('End the match now? It will be recorded as abandoned — no faction wins.'))) { S.ui.sheet = null; send('host.end'); } },
  rematch() { S.ui.sheet = null; send('host.rematch'); },
  claim() { send('host.claim'); },
  issueRecovery() { const id = S.drafts.recPick || V().players.find((p) => p.id !== V().me?.id)?.id; if (id) send('host.recovery', { playerId: id }); },
  flip(el) {
    const k = el.dataset.key;
    if (k === 'sheet') return;
    S.ui.flipped[k] = !S.ui.flipped[k];
    if (S.ui.flipped[k]) { uiSound('reveal'); uiHaptic(12); }
    render();
  },
  ack(el) { burstAt(el); send(V().mode === 'missions' ? 'm.ack' : 'role.ack'); },
  unveil() { S.ui.veiled[V().phaseId] = false; render(); },
  veil() { S.ui.veiled[V().phaseId] = true; render(); },
  async immunity() { await send('day.immunity'); },
  shoot(el) { picked(el, true, true); const cur = V().action.abilities.find((x) => x.kind === 'shoot')?.choice; send('day.shoot', { target: cur === el.dataset.id ? null : el.dataset.id }); },
  pickNominate(el) { picked(el); S.sel.nominate = S.sel.nominate === el.dataset.id ? null : el.dataset.id; render(); },
  async nominate(el) { burstAt(el, { colors: ['#e2585e', '#ece5d5'] }); if (S.sel.nominate) await send('day.nominate', { target: S.sel.nominate }); },
  pickVote(el) { picked(el, true); S.sel.vote = el.dataset.id; render(); },
  async vote(el) {
    if (!S.sel.vote) return;
    const ok = await send('day.ballot', { target: S.sel.vote });
    if (ok) { sound.play('stamp'); haptic([15, 30, 25]); burstAt(el, { colors: ['#e2585e', '#ece5d5'], count: 18 }); S.sel.vote = undefined; render(); }
  },
  pickRetaliate(el) { picked(el, true); S.sel.retaliate = el.dataset.id; render(); },
  retaliate(el) { send('day.retaliate', { target: el.dataset.none ? null : S.sel.retaliate }); },
  pickSwap(el) {
    picked(el, false, true);
    const cur = S.sel.swap !== undefined ? S.sel.swap : V().action.choice;
    S.sel.swap = cur === el.dataset.id ? null : el.dataset.id;
    send('dream.swap', { target: S.sel.swap }, { quiet: true });
    render();
  },
  pickTarget(el) {
    picked(el, el.classList.contains('kill'));
    const s = V().action.schema;
    const uses = s.uses ?? 1;
    let sel = [...(S.sel.uses ?? [])];
    const id = el.dataset.id;
    const i = sel.findIndex((u) => u.target === id);
    if (i >= 0) sel.splice(i, 1);
    else if (uses === 1) sel = [{ target: id, option: sel[0]?.option ?? (s.options?.length === 1 ? s.options[0].id : undefined) }];
    else if (sel.length < uses) sel.push({ target: id });
    else { sel.shift(); sel.push({ target: id }); }
    S.sel.uses = sel; render();
  },
  pickUseOption(el) { uiSound('pick'); const sel = [...(S.sel.uses ?? [])]; sel[Number(el.dataset.i)] = { ...sel[Number(el.dataset.i)], option: el.dataset.id }; S.sel.uses = sel; render(); },
  pickOption(el) { picked(el); S.sel.uses = S.sel.uses?.[0]?.option === el.dataset.id ? [] : [{ option: el.dataset.id }]; render(); },
  pickNightmare(el) { picked(el); S.sel.nightmare = S.sel.nightmare === el.dataset.id ? null : el.dataset.id; render(); },
  pickConspire(el) { picked(el); S.sel.conspire = el.dataset.id; render(); },
  conspire() { send('conspire.open', { target: S.sel.conspire }); },
  pickDeath(el) {
    picked(el, true);
    const D = V().action.death;
    let sel = [...(S.sel.death ?? D.proposals[V().me.id] ?? [])];
    const id = el.dataset.id;
    if (sel.includes(id)) sel = sel.filter((x) => x !== id);
    else if (sel.length < D.capacity) sel.push(id);
    else { sel.shift(); sel.push(id); }
    S.sel.death = sel; render();
    clearTimeout(ACT._dp);
    ACT._dp = setTimeout(() => send('death.propose', { targets: sel }, { quiet: true }), 250);
  },
  async commit(el) {
    const a = V().action;
    const payload = {};
    if (a.death) payload.death = S.sel.death ?? a.death.proposals[V().me.id] ?? [];
    else if (a.schema && !a.schema.blocked && a.schema.kind !== 'chat' && (S.sel.uses ?? []).length) payload.uses = S.sel.uses;
    else payload.pass = true;
    if (a.nightmare) payload.nightmare = S.sel.nightmare ?? a.nightmare.choice ?? null;
    burstAt(el, { colors: ['#a9bcd0', '#dde2ea'] });
    const ok = await send('night.commit', payload);

  },
  reopen() { send('night.reopen'); },
  chatTab(el) { S.ui.chat = el.dataset.id; render(); },
  tab(el) { S.ui.tab = el.dataset.id; render(); },
  momentNext() { if (!S.moment?.at) nextMoment(); },
  deckMode(el) {
    const mode = el.dataset.mode;
    const sug = V().setup?.suggestions?.[0]?.roles;
    send('host.settings', mode === 'exact' ? { deckMode: 'exact', customRoles: Object.keys(V().settings.customRoles || {}).length ? V().settings.customRoles : (sug ?? {}) } : { deckMode: 'auto' });
  },
  roleCount(el) {
    const counts = { ...(V().settings.customRoles || {}) };
    const id = el.dataset.id;
    counts[id] = Math.max(0, Math.min(25, (counts[id] || 0) + Number(el.dataset.d)));
    if (!counts[id]) delete counts[id];
    send('host.settings', { customRoles: counts }, { quiet: true });
  },
  useSuggestion(el) {
    const g = V().setup?.suggestions?.find((x) => x.key === el.dataset.id);
    if (g) { burstAt(el); send('host.settings', { deckMode: 'exact', customRoles: g.roles }); }
  },
  reshuffleSuggest() { send('host.settings', { suggestSeed: (V().settings.suggestSeed || 0) + 1 }, { quiet: true }); },
  dreamWeight(el) { send('host.settings', { dreamWeights: { [el.dataset.id]: Number(el.dataset.w) } }, { quiet: true }); },
  avatarSheet() { S.ui.sheet = 'avatar'; uiSound('whoosh'); render(); },
  avPart(el) { const a = { ...myAvatar(), [el.dataset.k]: Number(el.dataset.v) }; saveAvatar(a); },
  avRandom() { saveAvatar(randomAvatar()); },
  codeTap(el) {
    // Five quick taps on the room code open the hidden practice-bots panel.
    const now = Date.now();
    S.codeTaps = (S.codeTaps || []).filter((x) => now - x < 3000).concat(now);
    if (S.codeTaps.length >= 5) { S.codeTaps = []; S.ui.botsPanel = !S.ui.botsPanel; render(); return; }
    if (S.codeTaps.length === 1) ACT.copy(el); // only the first tap of a burst copies the link
  },
  addBots(el) {
    const n = el.dataset.n === 'fill10' ? Math.max(0, 10 - V().players.length) : Number(el.dataset.n);
    if (n > 0) send('host.bots', { count: n });
  },
  clearBots() { send('host.botsClear'); },
  tutorialToggle(el) {
    const on = el.type === 'checkbox' ? el.checked : !tipsOn();
    localStorage.setItem(TIPS_KEY, on ? '1' : '0');
    if (on) localStorage.removeItem(TIPS_SEEN);
    render();
  },
  tutorialOff() { localStorage.setItem(TIPS_KEY, '0'); render(); },
  coachDone(el) { const seen = tipsSeen(); seen.add(el.dataset.id); localStorage.setItem(TIPS_SEEN, JSON.stringify([...seen])); render(); },
  recap() { S.ui.recap = { i: 0, play: false }; uiSound('whoosh'); render(); },
  recapClose() { clearInterval(S.recapTimer); S.ui.recap = null; render(); },
  recapStep(el) { S.ui.recap.i += Number(el.dataset.d); render(); },
  recapPlay() {
    S.ui.recap.play = !S.ui.recap.play;
    clearInterval(S.recapTimer);
    if (S.ui.recap.play) {
      S.recapTimer = setInterval(() => {
        const n = recapSteps(V()).length;
        if (!S.ui.recap || S.ui.recap.i >= n - 1) { clearInterval(S.recapTimer); if (S.ui.recap) S.ui.recap.play = false; render(); return; }
        S.ui.recap.i++; pubSound('page'); render();
      }, 5200);
    }
    render();
  },
  langSheet() { S.ui.sheet = S.ui.sheet === 'lang' ? null : 'lang'; render(); },
  setLang(el) {
    if (el.dataset.id) localStorage.setItem(LANG_KEY, el.dataset.id); else localStorage.removeItem(LANG_KEY);
    S.ui.sheet = null;
    loadLang(wantedLang()).then(render);
  },
  boardScore() { sound.unlock(); if (!sound.on) sound.toggle(); S.board.audio = true; reportBoardAudio(true); render(); },
  boardMute() { S.board.audio = false; score.stop(); reportBoardAudio(false); render(); },
};

Object.assign(ACT, missionActs({ S, V, send: (...a) => send(...a), render: () => render(), picked, burstAt, sound, haptic }));

const QUIET = new Set(['mPickLantern', 'mPickTeam', 'mPickWard', 'mPickHunch', 'mPickCandle', 'mPickWitness', 'mPickHaunt', 'mPickAccuse', 'mPickReckon', 'mPickCard', 'avPart', 'avRandom', 'codeTap', 'boardScore', 'boardMute', 'pickNominate', 'pickVote', 'pickRetaliate', 'pickSwap', 'pickTarget', 'pickOption', 'pickNightmare', 'pickConspire', 'pickDeath', 'shoot', 'sound', 'pickUseOption', 'momentNext']);
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (link && link.origin === location.origin && !e.metaKey && !e.ctrlKey) { e.preventDefault(); go(link.pathname); return; }
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type !== 'checkbox')) return;
  if (el.tagName === 'INPUT') { ACT[el.dataset.act]?.(el); return; }
  e.preventDefault();
  if (el.disabled || el.hasAttribute('data-pending')) return;
  if (!QUIET.has(el.dataset.act)) { uiSound('tap'); uiHaptic(6); }
  ACT[el.dataset.act]?.(el);
});

// Hold-to-confirm buttons: irreversible host / ability actions need a deliberate press.
let holdTimer = null;
function cancelHold() {
  clearTimeout(holdTimer); holdTimer = null;
  if (S.ui.holding) { document.querySelectorAll('.hold.holding').forEach((b) => b.classList.remove('holding')); S.ui.holding = null; }
}
document.addEventListener('pointerdown', (e) => {
  sound.unlock();
  const el = e.target.closest('[data-hold]');
  if (!el || el.disabled || el.hasAttribute('data-pending')) return;
  e.preventDefault();
  cancelHold();
  const key = el.dataset.key.replace(/^hold-/, '');
  if (el.dataset.hold === 'openSeal') sound.unlock();
  S.ui.holding = key;
  el.classList.add('holding');
  uiHaptic(8);
  holdTimer = setTimeout(() => {
    holdTimer = null; S.ui.holding = null; el.classList.remove('holding');
    if (el.dataset.hold !== 'openSeal') { uiHaptic([20, 30, 40]); uiSound('stamp'); burstAt(el); }
    ACT[el.dataset.hold]?.(el);
  }, calm.matches ? 450 : el.dataset.hold === 'openSeal' ? 900 : 750);
});
['pointerup', 'pointercancel'].forEach((t) => document.addEventListener(t, () => { if (holdTimer) cancelHold(); }, true));
document.addEventListener('pointerout', (e) => { if (holdTimer && e.target.closest?.('[data-hold]') && !e.target.closest('[data-hold]').contains(e.relatedTarget)) cancelHold(); }, true);
document.addEventListener('keydown', (e) => {
  const h = e.target.closest?.('[data-hold]');
  if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); if (!h.disabled) ACT[h.dataset.hold]?.(h); return; }
  if (e.key === 'Escape' && S.ui.sheet) { S.ui.sheet = null; render(); return; }
  if (e.key === 'Escape' && S.moment) { nextMoment(); return; }
  if (e.key !== 'Enter' || !e.target.dataset?.draft) return;
  const k = e.target.dataset.draft;
  if (k === 'createName') ACT.create();
  if (k === 'joinCode') ACT.gotoRoom();
  if (k === 'joinName') ACT.join();
  if (k === 'recCode') ACT.recover();
});
document.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-hold]')) e.preventDefault(); });

const textTimers = {};
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.draft) {
    let v = el.value;
    if (el.dataset.draft === 'joinCode') { v = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); el.value = v; }
    S.drafts[el.dataset.draft] = v;
    if (el.dataset.draft === 'joinCode') { render(); if (v.length === 6) setTimeout(() => ACT.gotoRoom(), 250); }
  }
  if (el.dataset.setText) {
    const path = el.dataset.setText;
    clearTimeout(textTimers[path]);
    textTimers[path] = setTimeout(() => send('host.settings', nest(path, el.value), { quiet: true }), 450);
  }
});
document.addEventListener('change', (e) => {
  const el = e.target;
  const s = V()?.settings;
  if (el.dataset.draft) S.drafts[el.dataset.draft] = el.value;
  if (el.dataset.set) send('host.settings', nest(el.dataset.set, Number(el.value)));
  if (el.dataset.setBool) send('host.settings', { [el.dataset.setBool]: el.checked });
  if (el.dataset.actChange === 'pool' && s) {
    const pool = new Set(s.extendedPool);
    if (el.checked) pool.add(el.dataset.id); else pool.delete(el.dataset.id);
    send('host.settings', { extendedPool: [...pool] });
  }
  if (el.dataset.actChange === 'rule' && s) {
    const sel = new Set(s.rules.selected);
    if (el.checked) sel.add(el.dataset.id); else sel.delete(el.dataset.id);
    send('host.settings', { rules: { selected: [...sel] } });
  }
  if (el.dataset.actChange === 'tableLang') send('host.settings', { lang: el.value });
  if (el.dataset.actChange === 'clueOdds') send('host.settings', { clueOdds: Number(el.value) });
  if (el.dataset.actChange === 'leaderMode') send('host.settings', { leaderMode: el.value });
  if (el.dataset.actChange === 'missionCards') send('host.settings', { missionCards: Number(el.value) });
  if (el.dataset.actChange === 'mRole') send('host.settings', { mRoles: { [el.dataset.id]: el.checked } });
  if (el.dataset.actChange === 'tieBreak') send('host.settings', { tieBreak: el.checked ? 'coin' : 'none' });
  if (el.dataset.actChange === 'assign') send('host.assign', { playerId: el.dataset.pid, roleId: el.value || null });
});
document.addEventListener('submit', (e) => {
  const f = e.target;
  if (f.dataset.form === 'chat') {
    e.preventDefault();
    const text = (S.drafts.chat ?? '').trim();
    if (!text) return;
    S.drafts.chat = '';
    f.querySelector('input').value = '';
    send('chat.send', { channel: f.dataset.id, text });
  }
});

function nest(path, value) {
  const parts = path.split('.');
  const out = {};
  let o = out;
  parts.forEach((p, i) => { if (i === parts.length - 1) o[p] = value; else { o[p] = {}; o = o[p]; } });
  return out;
}

// Subtle 3D tilt on pointer devices only, respecting reduced motion.
const fine = matchMedia('(hover: hover) and (pointer: fine)');
document.addEventListener('pointermove', (e) => {
  if (!fine.matches || calm.matches) return;
  const card = e.target.closest?.('[data-tilt]');
  document.querySelectorAll('[data-tilt]').forEach((c) => { if (c !== card) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); } });
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
  card.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`);
});

loadContent();
loadLang(wantedLang()).finally(boot);
