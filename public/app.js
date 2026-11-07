// Dead Set client. Renders whatever filtered view the server sends; never
// decides outcomes, never holds anyone else's secrets.
import { glyph, dreamGlyph } from './icons.js';
import { qrSvg } from './qr.js';
import { renderGuide } from './guide.js';
import { sound, haptic, burstAt, celebrate, ambient } from './fx.js';

const app = document.getElementById('app');
const S = {
  route: null, code: null, token: null, pid: null,
  view: null, conn: 'idle', es: null, content: null,
  pending: false, drafts: {}, sel: {}, selPhase: null,
  moments: [], moment: null, momentTimer: null, notes: [],
  seenLog: null, seenPriv: null,
  ui: { sheet: null, unveiled: {}, flipped: {}, chat: null, recover: false, moderated: false, tab: null, holding: null },
};

// ── Utilities ──────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
const roman = (n) => ROMAN[n] ?? String(n);
const V = () => S.view;
const player = (id) => V()?.players.find((p) => p.id === id);
const pname = (id) => esc(player(id)?.name ?? 'Someone');
const isNight = (phase) => phase === 'NIGHT_0_REVEAL' || phase === 'NIGHT_DREAM_SWAP' || phase === 'NIGHT_ACTIONS';
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
  return `<span class="tally" aria-label="${n} of ${total}">${n ? groups.join('') : '<span class="muted small">—</span>'}</span>`;
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
const toast = (text, kind = '') => notify(text, kind === 'err' ? 'err' : kind);

async function api(path, body) {
  const res = await fetch(path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status, code: data.code });
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
      if (S.token) connect();
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

async function loadContent() {
  try { S.content = await api('/api/content'); render(); } catch { /* offline */ }
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
    detectMoments(v);
    S.view = v;
    S.conn = 'live';
    render();
  });
  es.addEventListener('revoked', () => {
    es.close();
    clearSession(S.code);
    S.token = null; S.view = null; S.es = null;
    toast('This seat was opened on another device, or you were removed.', 'err');
    render();
  });
  es.onerror = async () => {
    if (es.readyState === EventSource.CLOSED) {
      S.es = null;
      try {
        const peek = await api(`/api/rooms/${S.code}/peek`);
        if (!peek.exists) { S.conn = 'gone'; S.view = null; clearSession(S.code); }
        else if (!board) { clearSession(S.code); S.token = null; S.view = null; S.conn = 'idle'; toast('Your session for this room has expired. Rejoin or recover your seat.', 'err'); }
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
  if (S.seenLog === null) { S.seenLog = top; S.seenPriv = ptop; return; } // fresh load: no replay
  if (top < S.seenLog) S.seenLog = -1; // a rematch reset the record
  if (ptop < S.seenPriv) S.seenPriv = -1;
  const fresh = v.log.filter((l) => l.i > S.seenLog);
  const freshPriv = (v.private || []).filter((l) => l.i > S.seenPriv);
  S.seenLog = top; S.seenPriv = ptop;
  const name = (id) => v.players.find((p) => p.id === id)?.name ?? 'Someone';
  const meId = v.me?.id;
  const out = [];
  for (const l of fresh) {
    switch (l.ev) {
      case 'night0': {
        const sc = fresh.find((x) => x.ev === 'scenario');
        out.push({ type: 'night0', scenario: sc?.text ?? '', rules: v.activeRules.map((r) => r.name) });
        break;
      }
      case 'day1': out.push({ type: 'day1' }); break;
      case 'nightfall': out.push({ type: 'nightfall', n: l.n }); break;
      case 'dawn': {
        const rev = fresh.find((x) => x.ev === 'revive' && x.i > l.i);
        out.push({ type: 'dawn', day: l.day, killed: (l.killed ?? []).map(name), expired: (l.expired ?? []).map(name), revived: (rev?.ids ?? []).map(name), meDied: (l.victims ?? []).includes(meId) });
        if (v.me && !v.me.moderator && v.me.alive) {
          const reports = freshPriv.filter((x) => (x.at === `Night ${l.day - 1}` || x.at === `Day ${l.day}`) && !['dreamdraw', 'surge', 'chat', 'role'].includes(x.kind));
          out.push({ type: 'private', reports: reports.map((x) => x.text), tapOnly: true });
        }
        break;
      }
      case 'revive': if (!fresh.some((x) => x.ev === 'dawn')) out.push({ type: 'revive', names: (l.ids ?? []).map(name) }); break;
      case 'vote-open': out.push({ type: 'call', kicker: `Day ${roman(v.dayNumber)}`, title: 'The vote', sub: 'Cast your ballot in secret. You can change it until it locks.', sound: 'knock' }); break;
      case 'tally': {
        const outcomeEv = fresh.find((x) => x.i > l.i && ['sentence', 'nosentence', 'cancelled', 'scapegoat'].includes(x.ev));
        const goat = fresh.find((x) => x.i > l.i && x.ev === 'scapegoat');
        const sentence = fresh.find((x) => x.i > l.i && x.ev === 'sentence');
        out.push({ type: 'tally', totals: Object.entries(l.totals || {}).map(([id, w]) => ({ name: name(id), w, id })).sort((a, b) => b.w - a.w),
          threshold: l.threshold, outcome: outcomeEv?.ev ?? 'nosentence', reason: outcomeEv?.text ?? '', sentenced: sentence ? name(sentence.victims[0]) : null,
          meSentenced: !!sentence?.victims?.includes(meId), goat: goat ? name(goat.victims[0]) : null });
        break;
      }
      case 'scapegoat':
        if (!fresh.some((x) => x.ev === 'tally')) out.push({ type: 'death', title: 'The Scapegoat pays', names: (l.victims ?? []).map(name), sub: 'No one was sentenced.' });
        break;
      case 'shot': out.push({ type: 'death', title: 'A shot rings out', names: (l.victims ?? []).map(name), sub: l.victims?.length ? 'Nobody saw who pulled the trigger.' : 'The bullet found no one.' }); break;
      case 'final-act': out.push({ type: 'call', kicker: 'Equal Exchange', title: 'A final act', sub: 'The condemned may take one more with them.', sound: 'knock' }); break;
      case 'exchange': out.push({ type: 'death', title: 'An equal exchange', names: (l.victims ?? []).map(name), sub: 'The condemned did not go alone.' }); break;
      case 'end': out.push({ type: 'end', winner: l.winner, reason: l.reason, tapOnly: true }); break;
      case 'discussion': notify(`Day ${roman(v.dayNumber)} · the floor is open`); break;
      case 'defense': notify('Defence: each nominee speaks in turn'); break;
      case 'novote': notify('Nobody was nominated. No vote today.'); break;
      case 'nominate': notify(`${name(l.by)} ${l.first ? 'accuses' : 'seconds'} ${name(l.target)}`, 'accuse'); sound.play('knock'); break;
      case 'immunity': notify(`${name(l.who)} claims diplomatic immunity`); break;
      case 'exchange-none': notify('The condemned went quietly.'); break;
      default: break;
    }
  }
  if (out.length) {
    S.moments.push(...out.map((m) => ({ ...m, id: uid() })));
    if (!S.moment) nextMoment();
  }
}

const MOMENT_SOUND = { night0: 'night', day1: 'dawn', nightfall: 'night', dawn: 'dawn', tally: 'knock', death: 'death', revive: 'reveal' };
const MOMENT_TIME = { night0: 4200, day1: 3200, nightfall: 3000, dawn: 4200, tally: 5200, death: 3600, revive: 3000, call: 2200 };
const momentTime = (m) => MOMENT_TIME[m.type] + (m.type === 'dawn' ? 600 * (m.killed.length + m.expired.length) : 0);

function nextMoment() {
  clearTimeout(S.momentTimer);
  S.moment = S.moments.shift() ?? null;
  const m = S.moment;
  if (m) {
    const snd = m.sound ?? MOMENT_SOUND[m.type];
    if (snd) sound.play(snd);
    if (m.type === 'dawn' && (m.killed.length || m.expired.length)) { setTimeout(() => sound.play('death'), 900); haptic([30, 80, 120]); }
    if (m.type === 'tally') setTimeout(() => { sound.play(m.sentenced || m.goat ? 'gavel' : 'tap'); if (m.sentenced) haptic([40, 50, 90]); }, 1700);
    if (m.type === 'death') haptic([30, 80, 120]);
    if (m.type === 'nightfall' || m.type === 'night0') haptic(20);
    if (m.type === 'end') {
      const won = didIWin(V(), m.winner);
      setTimeout(() => { celebrate(m.winner === 'ABORTED' || m.winner === 'DRAW' ? 'neutral' : m.winner); sound.play(won === false ? 'lose' : 'win'); haptic([40, 60, 40, 60, 120]); }, 500);
    }
    if (!m.tapOnly) S.momentTimer = setTimeout(nextMoment, calm.matches ? Math.min(momentTime(m), 2500) : momentTime(m));
  }
  render();
}

function didIWin(v, winner) {
  const me = v?.me;
  if (!me || me.moderator || winner === 'DRAW' || winner === 'ABORTED') return null;
  if (winner === 'JESTER') return v.jesterId === me.id;
  return (winner === 'DEATH' && me.alignment === 'DEATH') || (winner === 'NON_DEATH' && me.alignment === 'NON_DEATH');
}

function momentHtml(m) {
  const names = (list, cls = '') => list.map((n, i) => `<li class="victim ${cls}" style="--d:${0.9 + i * 0.5}s"><span>${esc(n)}</span></li>`).join('');
  let body = '';
  switch (m.type) {
    case 'night0':
      body = `<div class="m-art">${moon(0.15, 'rise')}</div><span class="kicker">Night 0</span><h1 class="m-title">${letters('The game begins')}</h1>
        <p class="m-sub">${esc(m.scenario)}</p>${m.rules.length ? `<div class="m-rules">${m.rules.map((r) => `<span class="tag">${esc(r)}</span>`).join('')}</div>` : ''}
        <p class="m-sub small">Look only at your own screen.</p>`;
      break;
    case 'day1':
      body = `<div class="m-art sunrise">${glyph('sun')}</div><span class="kicker">Day I</span><h1 class="m-title">${letters('Morning')}</h1><p class="m-sub">Nobody has died — yet.</p>`;
      break;
    case 'nightfall':
      body = `<div class="m-art">${moon(0.35, 'rise')}<span class="stars"><i></i><i></i><i></i><i></i><i></i></span></div><span class="kicker">Night ${roman(m.n)}</span><h1 class="m-title">${letters('Night falls')}</h1><p class="m-sub">Close your eyes. Keep your screen to yourself.</p>`;
      break;
    case 'dawn': {
      const dead = m.killed.length + m.expired.length;
      body = `<div class="m-art sunrise">${glyph('sun')}</div><span class="kicker">Dawn · Day ${roman(m.day)}</span>
        <h1 class="m-title ${m.meDied ? 'blood' : ''}">${letters(m.meDied ? 'You did not wake' : dead ? 'Found dead' : 'Everyone woke')}</h1>
        ${dead ? `<ul class="victims">${names(m.killed)}${names(m.expired, 'expired')}</ul>${m.expired.length ? '<p class="m-sub small">Borrowed time ran out for some.</p>' : ''}` : '<p class="m-sub">The night passed quietly.</p>'}
        ${m.revived.length ? `<p class="m-sub revive">${esc(m.revived.join(', '))} ${m.revived.length > 1 ? 'have' : 'has'} returned from the grave.</p>` : ''}`;
      break;
    }
    case 'private':
      body = `<div class="m-art">${glyph('mentalist')}</div><span class="kicker">Only you know</span><h1 class="m-title">${letters('Your night')}</h1>
        ${m.reports.length ? `<ul class="m-reports">${m.reports.map((r, i) => `<li style="--d:${0.5 + i * 0.35}s">${esc(r)}</li>`).join('')}</ul>` : '<p class="m-sub">You slept. Nothing reached you.</p>'}
        <p class="m-sub small">Keep this to yourself — or don't.</p>`;
      break;
    case 'revive':
      body = `<div class="m-art">${glyph('necro')}</div><span class="kicker">The grave opens</span><h1 class="m-title">${letters('Returned')}</h1><p class="m-sub">${esc(m.names.join(', '))} walk among you — until the next dawn.</p>`;
      break;
    case 'call':
      body = `<span class="kicker">${esc(m.kicker)}</span><h1 class="m-title">${letters(m.title)}</h1><p class="m-sub">${esc(m.sub)}</p>`;
      break;
    case 'tally': {
      const max = Math.max(1, ...m.totals.map((t) => t.w));
      const outcome = m.sentenced
        ? `<div class="verdict-stamp ${m.meSentenced ? 'me' : ''}"><span class="v-name">${esc(m.meSentenced ? 'You' : m.sentenced)}</span><span class="stamp">Sentenced</span></div>`
        : m.outcome === 'cancelled' ? '<div class="verdict-stamp"><span class="v-name">Fate intervenes</span><span class="stamp soft">Cancelled</span></div><p class="m-sub small">A wager was won. Nobody hangs today.</p>'
          : `<div class="verdict-stamp"><span class="v-name">No one</span><span class="stamp soft">Spared</span></div><p class="m-sub small">${esc(m.reason)}</p>`;
      body = `<span class="kicker">The ballots</span><h1 class="m-title">${letters('The town decides')}</h1>
        ${m.totals.length ? `<ul class="bars">${m.totals.map((t, i) => `<li style="--w:${(t.w / max) * 100}%;--d:${0.3 + i * 0.15}s"><span class="b-name">${esc(t.name)}</span><span class="b-bar"><i></i></span><span class="b-n">${t.w}</span></li>`).join('')}</ul>` : '<p class="m-sub">No valid votes.</p>'}
        ${m.threshold != null ? `<p class="m-sub small">Majority Rule: more than ${m.threshold} needed.</p>` : ''}
        <div class="m-outcome">${outcome}${m.goat ? `<p class="m-sub blood">The Scapegoat pays: ${esc(m.goat)} dies.</p>` : ''}</div>`;
      break;
    }
    case 'death':
      body = `<div class="m-art">${glyph('dagger')}</div><h1 class="m-title">${letters(m.title)}</h1>${m.names.length ? `<ul class="victims">${names(m.names)}</ul>` : ''}<p class="m-sub">${esc(m.sub)}</p>`;
      break;
    case 'end': {
      const title = { DEATH: 'Death wins', NON_DEATH: 'The living win', JESTER: 'The Jester wins', DRAW: 'A draw', ABORTED: 'Abandoned' }[m.winner] ?? 'The end';
      const won = didIWin(V(), m.winner);
      body = `<div class="m-art">${glyph(m.winner === 'DEATH' ? 'death' : m.winner === 'JESTER' ? 'jester' : m.winner === 'NON_DEATH' ? 'innocent' : 'scroll')}</div>
        <span class="kicker">The verdict</span><h1 class="m-title ${m.winner === 'DEATH' ? 'blood' : ''}">${letters(title)}</h1><p class="m-sub">${esc(m.reason)}</p>
        ${won === null ? '' : `<div class="result-stamp ${won ? 'win' : 'loss'}">${won ? 'Victory' : 'Defeat'}</div>`}`;
      break;
    }
    default: break;
  }
  const auto = !m.tapOnly;
  return `<div class="moment m-${m.type} ${m.winner === 'DEATH' || m.type === 'death' ? 'grim' : ''}" data-key="moment-${m.id}" data-act="momentNext" role="dialog" aria-live="assertive">
    <div class="m-body">${body}</div>
    <div class="m-foot">${auto ? `<span class="m-timer" style="--t:${momentTime(m)}ms"><i></i></span>` : ''}<span class="kicker">${auto ? 'Tap to skip' : 'Tap to continue'}${S.moments.length ? ` · ${S.moments.length} more` : ''}</span></div>
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
    if (a.type === 'checkbox' || a.type === 'radio') a.checked = b.hasAttribute('checked');
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
  const bottoms = {};
  document.querySelectorAll('[data-scroll]').forEach((el) => { bottoms[el.dataset.scroll] = el.scrollHeight - el.scrollTop - el.clientHeight < 30; });
  const v = V();
  const night = !!v && isNight(v.phase) && ['room', 'board'].includes(S.route?.name);
  document.body.dataset.time = night ? 'night' : 'day';
  document.body.classList.toggle('has-moment', !!S.moment);
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
  else if (r.name === 'board') html = boardScreen();
  else if (r.name === 'room') {
    if (S.conn === 'gone') html = goneScreen();
    else if (!S.token) html = joinScreen();
    else if (!V()) html = loadingScreen();
    else html = roomScreen();
  }
  if (S.moment) html += momentHtml(S.moment);
  if (S.conn === 'lost' && S.code) html += '<div class="conn" data-key="conn" role="status"><span class="pulse-dot"></span>Reconnecting… your choices are safe on the server.</div>';
  html += `<div class="notes" data-key="notes" aria-live="polite">${S.notes.map((n) => `<div class="note ${n.kind}" data-key="n-${n.id}">${esc(n.text)}</div>`).join('')}</div>`;
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
  document.querySelectorAll('[data-clock]').forEach((el) => {
    el.textContent = secs == null ? '' : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    el.classList.toggle('low', secs != null && secs <= 10);
  });
  if (secs != null && secs <= 5 && secs > 0 && secs !== lastTick && S.route?.name === 'room' && !S.moment) sound.play('tick');
  lastTick = secs;
}
setInterval(tickClock, 250);
const fuse = () => '<div class="fuse" data-fuse data-key="fuse" hidden><i></i></div>';

// ── Labels ─────────────────────────────────────────────────────────────────
function phaseWord(v) {
  if (v.phase === 'LOBBY') return { word: 'Lobby', num: '' };
  if (v.phase === 'ENDED') return { word: 'The End', num: '' };
  if (v.phase === 'NIGHT_0_REVEAL') return { word: 'Night', num: '0' };
  if (isNight(v.phase) || v.phase === 'NIGHT_RESOLVING') return { word: 'Night', num: roman(v.nightNumber) };
  return { word: 'Day', num: roman(v.dayNumber) };
}
const STEP = {
  LOBBY: 'Gathering', NIGHT_0_REVEAL: 'Role reveal', DAY_PREP: 'Morning', DAY_DISCUSSION: 'Discussion',
  DAY_DEFENSE: 'Defence', DAY_VOTING: 'Secret ballot', DAY_RESOLVING: 'Final act', NIGHT_DREAM_SWAP: 'Dreaming', NIGHT_ACTIONS: 'Night actions', ENDED: 'Match over',
};
const ALIGN = { DEATH: 'Death', NON_DEATH: 'Non-Death', INDEPENDENT: 'Independent' };
const wordmark = () => '<a class="wordmark" href="/" data-link data-key="wm">Dead<i>Set</i><span class="seal"></span></a>';

// ── Home / join / guide ────────────────────────────────────────────────────
function homeScreen() {
  const d = S.drafts;
  return `<main class="main home" data-key="home">
    <header class="hero">
      ${wordmark()}
      <h1 class="hero-title"><span class="h-dead">${letters('Dead')}</span><span class="h-set">${letters('Set.')}</span></h1>
      <p class="lede">Hidden roles, bad dreams and worse alibis. Everyone plays on their own phone — the app is the narrator.</p>
      <div class="facts"><span>5–13 players</span><span>One phone each</span><span>20–60 min</span></div>
    </header>
    <div class="split">
      <section class="panel">
        <div class="rule"><span class="idx">01</span>Open a table</div>
        <label class="field"><span>Your name</span><input class="input" maxlength="20" autocomplete="nickname" placeholder="e.g. Morgan" data-draft="createName" value="${esc(d.createName ?? '')}"></label>
        <label class="check"><input type="checkbox" data-act="toggleModerated" ${S.ui.moderated ? 'checked' : ''}><span><b>I'll moderate, not play</b><small>Trusted moderator: sees every secret, holds no seat. Everyone is told.</small></span></label>
        <button class="btn btn-solid btn-wide" data-act="create" ${S.pending ? 'disabled' : ''}>Create game</button>
      </section>
      <section class="panel">
        <div class="rule"><span class="idx">02</span>Take a seat</div>
        <label class="field"><span>Room code</span><input class="input input-code" maxlength="6" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="······" data-draft="joinCode" value="${esc(d.joinCode ?? '')}"></label>
        <button class="btn btn-wide" data-act="gotoRoom">Join</button>
      </section>
    </div>
    <a class="btn btn-ghost" href="/guide" data-link>How to play →</a>
  </main>`;
}

function joinScreen() {
  const d = S.drafts;
  return `<main class="main narrow" data-key="join">
    ${wordmark()}
    <header class="phase-head"><span class="kicker">Room <span class="mono">${esc(S.code)}</span></span><h1>Take a <i>seat.</i></h1></header>
    ${S.ui.recover ? `<section class="stack panel" data-key="rec">
        <p class="muted small">Lost your phone or switched browsers? Ask the host for a one-time recovery code. Your old device will be signed out.</p>
        <label class="field"><span>Recovery code</span><input class="input input-code" maxlength="8" data-draft="recCode" value="${esc(d.recCode ?? '')}" autocomplete="off"></label>
        <button class="btn btn-solid btn-wide" data-act="recover">Recover seat</button>
        <button class="btn btn-ghost" data-act="toggleRecover">Join as a new player instead</button>
      </section>` : `<section class="stack panel" data-key="new">
        <label class="field"><span>Your name</span><input class="input" maxlength="20" autocomplete="nickname" placeholder="Name shown at the table" data-draft="joinName" value="${esc(d.joinName ?? '')}"></label>
        <button class="btn btn-solid btn-wide" data-act="join" ${S.pending ? 'disabled' : ''}>Join the table</button>
        <button class="btn btn-ghost" data-act="toggleRecover">I already have a seat in this game</button>
      </section>`}
  </main>`;
}
const loadingScreen = () => `<main class="main narrow" data-key="load">${wordmark()}<div class="loading"><span class="pulse-dot"></span> Finding your seat…</div></main>`;
const goneScreen = () => `<main class="main narrow" data-key="gone">${wordmark()}<header class="phase-head"><h1>No such <i>table.</i></h1><p class="muted">Room ${esc(S.code)} doesn't exist, or it has been cleared away.</p></header><a class="btn" href="/" data-link>Back to start</a></main>`;
const guideScreen = () => `<main class="main" style="max-width:820px" data-key="guide"><div class="row between">${wordmark()}<button class="btn btn-sm" data-act="back">Back</button></div>${renderGuide(S.content, { glyph, dreamGlyph, esc })}</main>`;

// ── The table ring ─────────────────────────────────────────────────────────
/**
 * Seats drawn around a table in seating order. When `pick` is set, the
 * selectable seats become buttons: tapping a seat is how you target anyone.
 */
function ring(v, { pick = null, center = '', slots = 0, reveal = false, marks = {}, lobby = false } = {}) {
  const players = [...v.players].sort((a, b) => a.seat - b.seat);
  const n = Math.max(players.length, slots);
  const tok = n <= 6 ? 60 : n <= 8 ? 54 : n <= 10 ? 48 : n <= 13 ? 42 : 38;
  const R = n <= 6 ? 36 : 38.5;
  const me = v.me;
  const d = v.day;
  const nomIdx = (id) => (d?.nominees ?? []).indexOf(id);
  const sel = new Set(pick?.selected?.filter(Boolean) ?? []);
  const can = new Set(pick?.ids ?? []);
  const seats = [];
  for (let i = 0; i < n; i++) {
    const ang = (-90 + (i * 360) / n) * (Math.PI / 180);
    const x = (50 + R * Math.cos(ang)).toFixed(2);
    const y = (50 + R * Math.sin(ang)).toFixed(2);
    const p = players[i];
    if (!p) { seats.push(`<div class="tok empty" data-key="slot-${i}" style="left:${x}%;top:${y}%"><span class="tok-disc"></span><span class="tok-name">empty</span></div>`); continue; }
    const selectable = can.has(p.id);
    const isSel = sel.has(p.id);
    const ni = nomIdx(p.id);
    const cls = ['tok',
      p.alive ? '' : 'dead', p.id === me?.id ? 'me' : '', p.connected ? '' : 'away',
      isSel ? 'sel' : '', selectable ? 'can' : pick ? 'mute' : '', pick?.tone === 'kill' ? 'kill' : '',
      ni >= 0 ? 'accused' : '', d?.speaking === p.id ? 'speaking' : '', p.immune ? 'immune' : '',
      lobby ? (p.ready ? 'ready' : 'unready') : '', reveal && p.alignment === 'DEATH' ? 'death' : '',
      me?.teammates?.some((t) => t.id === p.id) ? 'mate' : '',
    ].filter(Boolean).join(' ');
    const badges = [];
    if (ni >= 0) badges.push(`<b class="bdg b-nom" data-key="nom">${roman(ni + 1)}</b>`);
    if (p.immune) badges.push(`<b class="bdg b-imm" data-key="imm">${glyph('diplomat')}</b>`);
    if (p.revived) badges.push(`<b class="bdg b-rev" data-key="rev">${glyph('necro')}</b>`);
    if (p.id === v.hostId && v.phase === 'LOBBY') badges.push('<b class="bdg b-host" data-key="host"></b>');
    if (lobby && p.ready) badges.push(`<b class="bdg b-ok" data-key="ok">${glyph('check')}</b>`);
    if (marks[p.id]) badges.push(`<b class="bdg b-mark" data-key="mark">${marks[p.id]}</b>`);
    if (pick?.stamp === p.id) badges.push(`<b class="bdg b-stamp" data-key="stamp-${p.id}">${glyph('check')}</b>`);
    const inner = reveal && p.role ? glyph(p.role.glyph) : `<span class="tok-ini">${initials(p.name)}</span>`;
    const label = `${esc(p.name)}${p.alive ? '' : ', dead'}${isSel ? ', selected' : ''}`;
    seats.push(`<button type="button" class="${cls}" data-key="tok-${p.id}" style="left:${x}%;top:${y}%" ${selectable ? `data-act="${pick.act}" data-id="${p.id}"` : 'tabindex="-1"'} aria-pressed="${isSel}" aria-label="${label}">
      <span class="tok-disc">${sigil(p.id)}${inner}${badges.join('')}</span><span class="tok-name">${esc(p.name)}</span></button>`);
  }
  return `<div class="ring-wrap" data-key="ring-wrap"><div class="ring ${pick ? 'picking' : ''} ${pick?.tone === 'kill' ? 'kill' : ''}" style="--tok:${tok}px" data-key="ring">
    <svg class="ring-fuse off" viewBox="0 0 100 100" data-ringfuse aria-hidden="true"><circle class="track" cx="50" cy="50" r="49"/><circle class="burn" cx="50" cy="50" r="49" pathLength="100"/></svg>
    <div class="ring-table" aria-hidden="true"></div>
    ${seats.join('')}
    <div class="ring-center" data-key="center">${center}</div>
  </div></div>`;
}

function centerFor(v, pick) {
  const hint = pick?.hint ? `<span class="c-hint">${esc(pick.hint)}</span>` : '';
  const clock = '<span class="c-clock clock" data-clock></span>';
  const prog = v.progress;
  switch (v.phase) {
    case 'LOBBY': {
      const need = Math.max(0, 5 - v.players.length);
      return `<span class="c-big">${v.players.length}</span><span class="c-sub">${need ? `${need} more needed` : `${prog.done}/${prog.total} ready`}</span>`;
    }
    case 'NIGHT_0_REVEAL': return `${moon(prog.done / Math.max(1, prog.total), 'c-moon')}<span class="c-sub">${prog.done}/${prog.total} have seen their role</span>`;
    case 'DAY_PREP': return `<span class="c-emblem sun">${glyph('sun')}</span><span class="c-sub">Morning</span>${hint}${clock}`;
    case 'DAY_DISCUSSION': return `<span class="c-big">${v.day.nominees.length}</span><span class="c-sub">accused</span>${hint}${clock}`;
    case 'DAY_DEFENSE': return `<span class="c-sub">Speaking</span><span class="c-name">${v.day.speaking ? pname(v.day.speaking) : '—'}</span>${clock}`;
    case 'DAY_VOTING': return `${tally(prog.done, prog.total)}<span class="c-sub">${prog.done}/${prog.total} voted</span>${hint}${clock}`;
    case 'DAY_RESOLVING': return `<span class="c-emblem">${glyph('dagger')}</span><span class="c-sub">A final act</span>${hint}${clock}`;
    case 'NIGHT_DREAM_SWAP':
    case 'NIGHT_ACTIONS': return `${moon(prog ? prog.done / Math.max(1, prog.total) : 0, 'c-moon')}<span class="c-sub">${prog ? `${prog.done}/${prog.total} ${esc(prog.label)}` : ''}</span>${hint}${clock}`;
    case 'ENDED': return `<span class="c-emblem">${glyph(v.winner === 'DEATH' ? 'death' : v.winner === 'JESTER' ? 'jester' : 'innocent')}</span><span class="c-sub">${esc({ DEATH: 'Death wins', NON_DEATH: 'The living win', JESTER: 'Jester wins', DRAW: 'Draw', ABORTED: 'Abandoned' }[v.winner] ?? '')}</span>`;
    default: return '';
  }
}

/** What, if anything, tapping a seat does right now. */
function pickContexts(v) {
  const a = v.action;
  const me = v.me;
  if (!a || !me || me.moderator) return [];
  const out = [];
  switch (v.phase) {
    case 'DAY_PREP':
      for (const ab of a.abilities || []) {
        if (ab.kind === 'shoot') out.push({ key: 'shoot', label: 'Vigilante', act: 'shoot', ids: ab.targets, selected: [ab.choice], tone: 'kill', hint: ab.choice ? 'Aimed · tap to holster' : 'Tap to aim' });
      }
      break;
    case 'DAY_DISCUSSION':
      if (a.type === 'nominate' && !a.mine) out.push({ key: 'nom', label: 'Nominate', act: 'pickNominate', ids: a.targets, selected: [S.sel.nominate], hint: 'Tap to accuse' });
      break;
    case 'DAY_VOTING':
      if (a.type === 'ballot') {
        const cands = a.candidates.filter((id) => a.selfVote || id !== me.id || a.ghost);
        const sel = S.sel.vote ?? a.choice;
        out.push({ key: 'vote', label: 'Vote', act: 'pickVote', ids: cands, selected: [sel], tone: 'kill', stamp: a.choice !== 'ABSTAIN' ? a.choice : null, hint: a.choice ? 'Recorded · tap to change' : 'Tap to vote' });
      }
      break;
    case 'DAY_RESOLVING':
      if (a.type === 'retaliate') out.push({ key: 'ret', label: 'Final act', act: 'pickRetaliate', ids: a.targets, selected: [S.sel.retaliate], tone: 'kill', hint: 'Take one with you' });
      break;
    case 'NIGHT_DREAM_SWAP':
      if (a.type === 'swap' && a.snatcher && !a.done) out.push({ key: 'swap', label: 'Swap', act: 'pickSwap', ids: a.targets, selected: [S.sel.swap], hint: 'Steal a dream' });
      break;
    case 'NIGHT_ACTIONS': {
      if (a.type !== 'night' || a.done) break;
      if (a.death) {
        const mine = S.sel.death ?? a.death.proposals[me.id] ?? [];
        out.push({ key: 'death', label: 'The kill', act: 'pickDeath', ids: a.death.targets, selected: mine, tone: 'kill', hint: `Choose up to ${a.death.capacity}` });
      }
      const s = a.schema;
      if (s && !s.blocked) {
        if (s.kind === 'target' || s.kind === 'dead') {
          out.push({ key: 'role', label: s.role.name, act: 'pickTarget', ids: s.targets, selected: (S.sel.uses ?? []).map((u) => u.target), tone: ['TERRORIST', 'PSYCHO'].includes(s.role.id) ? 'kill' : null, hint: s.kind === 'dead' ? 'Tap the dead' : s.uses > 1 ? 'Pick two seats' : `${s.verb ?? 'Choose'}…` });
        }
        if (s.kind === 'chat' && !a.conspire && !v.chats?.some((c) => c.id.startsWith(`consp:${v.nightNumber}:${me.id}`))) {
          out.push({ key: 'role', label: 'Whisper', act: 'pickConspire', ids: s.targets, selected: [S.sel.conspire], hint: 'Whisper to…' });
        }
      }
      if (a.nightmare) out.push({ key: 'dream', label: 'Dream partner', act: 'pickNightmare', ids: a.nightmare.targets, selected: [S.sel.nightmare ?? a.nightmare.choice], hint: 'Bind your dream' });
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
  const side = `<aside class="side" aria-label="Match" data-key="side">
      ${wordmark()}
      <div class="count">
        <div><b>${esc(pw.word)} ${esc(pw.num)}</b><span>${esc(STEP[v.phase] ?? '')}</span></div>
        <div>${v.phase === 'LOBBY' ? `<b>${v.players.length}</b><span>Seated</span>` : `<b>${aliveCount}<span class="muted">/${v.players.length}</span></b><span>Alive</span>`}</div>
      </div>
      <div class="row between"><span class="kicker">Room <span class="mono">${esc(v.code)}</span></span><span class="clock" data-clock></span></div>
      ${fuse()}
      ${hostBox()}
      <div class="timeline" data-scroll="side-tl"><div class="rule">Public record</div>${feed(v.log)}</div>
      <button class="btn btn-ghost btn-sm" data-act="sound">${glyph(sound.on ? 'bell' : 'bellOff')} ${sound.on ? 'Sound on' : 'Sound off'}</button>
    </aside>`;
  const top = `<header class="topbar" data-key="top">
      <span class="tb-emblem">${isNight(v.phase) ? glyph('moon') : glyph('sun')}</span>
      <div class="phase-mini"><strong>${esc(pw.word)} ${esc(pw.num)}</strong><span>${esc(STEP[v.phase] ?? '')} · ${v.phase === 'LOBBY' ? `${v.players.length} seated` : `${aliveCount}/${v.players.length} alive`}</span></div>
      <span class="clock" data-clock></span>
      <button class="btn btn-ghost icon-btn" data-act="sound" aria-label="${sound.on ? 'Mute sounds' : 'Turn sounds on'}">${glyph(sound.on ? 'bell' : 'bellOff')}</button>
      <button class="btn btn-ghost icon-btn" data-act="sheet" data-id="record" aria-label="Open match record">${glyph('menu')}</button>
      ${fuse()}
    </header>`;
  return `<div class="shell" data-key="shell">${side}<div class="col">${top}<main class="main" id="main" data-key="main-${v.phase === 'LOBBY' ? 'lobby' : 'game'}">${mainFor(v, v.me)}</main></div></div>${dock(v)}${sheet(v)}`;
}

function hostBox() {
  const v = V();
  if (!v.host) {
    if (v.hostAway) {
      return `<div class="host-box" data-key="hostbox"><div class="rule">Host away</div><p class="small muted">The host has been gone for over a minute. A majority of connected players can hand the public controls to someone else.</p>
        <button class="btn btn-sm" data-act="claim" ${v.claimVoted ? 'disabled' : ''}>${v.claimVoted ? 'Vote cast' : 'Vote to take over'}</button></div>`;
    }
    return '';
  }
  const h = v.host;
  const rec = `<details class="more" data-key="recover"><summary>Recover a player's seat</summary><div>
      <p class="small muted">If someone's phone dies, issue a one-time code. They open the room link, choose "I already have a seat" and enter it.</p>
      <select class="input" data-draft="recPick">${v.players.filter((p) => p.id !== v.me?.id).map((p) => `<option value="${p.id}" ${S.drafts.recPick === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
      <button class="btn btn-sm" data-act="issueRecovery">Issue code</button>
      ${h.recovery ? `<p>Code for <b>${pname(h.recovery.playerId)}</b>: <span class="mono code-sm">${esc(h.recovery.code)}</span><br><span class="small muted">Valid 15 minutes, once.</span></p>` : ''}
    </div></details>`;
  if (v.phase === 'LOBBY') return `<div class="host-box" data-key="hostbox"><div class="rule">Host</div><p class="small muted">You see only what everyone sees.</p>${rec}</div>`;
  return `<div class="host-box" data-key="hostbox"><div class="rule">Host controls</div>
    ${h.advance ? holdBtn('advance', h.advance, 'btn-solid', { key: 'side-adv' }) : ''}
    ${h.skipAll ? `<button class="btn btn-sm" data-act="advance" data-skip="1">${esc(h.skipAll)}</button>` : ''}
    <div class="row">${h.extend ? '<button class="btn btn-sm" data-act="extend">+30 s</button>' : ''}
    ${h.end ? '<button class="btn btn-sm btn-ghost" data-act="end">End match</button>' : ''}
    ${h.rematch ? '<button class="btn btn-sm btn-solid" data-act="rematch">New match, same table</button>' : ''}</div>
    ${h.advance ? '<p class="small muted">Hold to advance. Anything not submitted becomes a pass or abstention.</p>' : ''}
    ${rec}
  </div>`;
}

function holdBtn(act, label, cls = '', { dis = false, key = act } = {}) {
  return `<button class="btn hold ${cls} ${S.ui.holding === key ? 'holding' : ''}" data-hold="${act}" data-key="hold-${key}" ${dis || S.pending ? 'disabled' : ''}><span class="hold-fill"></span><span class="hold-label">${esc(label)}</span></button>`;
}

function feed(log, cls = '') {
  if (!log?.length) return '<p class="small muted">Nothing yet.</p>';
  return `<ul class="feed ${cls}">${log.map((l) => `<li class="k-${esc(l.kind)}" data-key="f-${l.i}"><span class="at">${esc(l.at)}</span><span class="txt">${esc(l.text)}</span></li>`).join('')}</ul>`;
}

function head(v, extra = '') {
  const pw = phaseWord(v);
  return `<header class="phase-head" data-key="head-${v.phase}">
    <div class="ph-row"><h1>${pw.word === 'Night' ? `<i>${pw.word}</i>` : esc(pw.word)}${pw.num ? `<span class="num">${esc(pw.num)}</span>` : ''}</h1>
    <span class="kicker">${esc(STEP[v.phase] ?? '')}${v.doomsday && v.phase !== 'LOBBY' ? ` · Doom after Day ${roman(v.doomsday)}` : ''}</span>${extra}</div>
  </header>`;
}

function chips(v) {
  const me = v.me;
  if (!me || me.moderator || v.phase === 'LOBBY') return '';
  const notes = (v.private || []).length;
  return `<nav class="chips" data-key="chips">
    <button class="chip" data-act="sheet" data-id="role">${me.role ? glyph(me.role.glyph) : ''}<span>My role</span></button>
    <button class="chip" data-act="sheet" data-id="notes">${glyph('scroll')}<span>Notes</span>${notes ? `<b>${notes}</b>` : ''}</button>
    ${v.activeRules?.length ? `<button class="chip" data-act="sheet" data-id="rules">${glyph('magistrate')}<span>Rules</span><b>${v.activeRules.length}</b></button>` : ''}
    ${v.scenario ? `<button class="chip" data-act="sheet" data-id="story">${glyph('whispers')}<span>Story</span></button>` : ''}
  </nav>`;
}

function mainFor(v, me) {
  if (me?.moderator) return moderatorMain(v);
  switch (v.phase) {
    case 'LOBBY': return lobbyMain(v, me);
    case 'NIGHT_0_REVEAL': return revealMain(v, me);
    case 'ENDED': return endMain(v, me);
    default: return isNight(v.phase) ? nightMain(v, me) : dayMain(v, me);
  }
}

// ── Sheets (bottom drawers) ────────────────────────────────────────────────
function sheet(v) {
  const s = S.ui.sheet;
  if (!s) return '';
  const me = v.me;
  let title = '';
  let body = '';
  if (s === 'record') {
    title = `Room ${esc(v.code)}`;
    body = `${hostBox()}<div><div class="rule">Public record</div>${feed(v.log)}</div>
      <div class="row"><a class="btn btn-sm btn-ghost" href="/guide" data-link>How to play</a><button class="btn btn-sm btn-ghost" data-act="leave">${glyph('out')} Leave this device</button></div>`;
  } else if (s === 'role' && me?.role) {
    title = 'My role';
    body = `${roleCardHtml(me.role, { align: me.alignment, flipKey: 'sheet', flipped: true })}${roleNotes(me)}`;
  } else if (s === 'notes') {
    title = 'Only you were told';
    body = feed([...(v.private || [])].reverse(), 'notes');
  } else if (s === 'rules') {
    title = 'Rules in force';
    body = v.activeRules.map((r) => `<div class="rule-card"><b>${esc(r.name)}</b><p>${esc(r.text)}</p><p class="small muted">${esc(r.enforcement)}</p></div>`).join('');
  } else if (s === 'story') {
    title = 'The story';
    body = `<p class="scenario">${esc(`We are ${v.scenario.who}, in ${v.scenario.where}, trying to ${v.scenario.why}.`)}</p><p class="small muted">Pure flavour — it never changes the rules. Play it up.</p>`;
  } else if (s === 'qr') {
    title = 'Scan to join';
    body = `<div class="qr-big">${qrSvg(`${location.origin}/r/${v.code}`)}</div><p class="code-tiles big">${codeTiles(v.code)}</p>`;
  } else if (s.startsWith('seat:')) {
    const p = player(s.slice(5));
    if (!p) return '';
    const i = p.seat;
    title = esc(p.name);
    body = `<p class="small muted">Seat ${i + 1} of ${v.players.length}. Seating matters for Fog of War and Sleepwalking.</p>
      <div class="row"><button class="btn btn-sm" data-act="seat" data-pid="${p.id}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>${glyph('up')} Move earlier</button>
      <button class="btn btn-sm" data-act="seat" data-pid="${p.id}" data-dir="1" ${i === v.players.length - 1 ? 'disabled' : ''}>${glyph('down')} Move later</button></div>
      ${me?.moderator ? `<label class="field"><span>Assign role</span><select class="input" data-act-change="assign" data-pid="${p.id}"><option value="">Random</option>${v.allRoles.map((r) => `<option value="${r.id}" ${v.manualRoles?.[p.id] === r.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select></label>` : ''}
      ${p.id !== me?.id ? `<button class="btn btn-sm btn-ghost danger" data-act="kick" data-pid="${p.id}">${glyph('close')} Remove from table</button>` : ''}`;
  }
  return `<div class="sheet-scrim" data-act="sheet" data-key="scrim"></div>
    <div class="sheet" role="dialog" aria-label="${title}" data-key="sheet-${s}">
      <div class="sheet-grip" aria-hidden="true"></div>
      <div class="row between"><h2>${title}</h2><button class="btn btn-ghost icon-btn" data-act="sheet" aria-label="Close">${glyph('close')}</button></div>
      <div class="sheet-body">${body}</div>
    </div>`;
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
    ${v.moderated ? `<div class="banner blood" data-key="mod">${glyph('mentalist')}<div><b>Trusted moderator: ${esc(v.moderatorName ?? '')}</b><p>A non-playing moderator can see every role, dream and vote.</p></div></div>` : ''}
    <section class="invite" data-key="invite">
      <button class="code-tiles" data-act="copy" data-text="${esc(url)}" aria-label="Copy invite link">${codeTiles(v.code)}</button>
      <div class="row center">
        <button class="btn btn-sm" data-act="share" data-text="${esc(url)}">Invite</button>
        <button class="btn btn-sm" data-act="sheet" data-id="qr">Show QR</button>
        <a class="btn btn-sm btn-ghost" href="/board/${esc(v.code)}" target="_blank" rel="noopener">TV board ↗</a>
      </div>
    </section>
    ${ring(v, { pick, slots: Math.max(5, v.players.length), lobby: true, center: centerFor(v) })}
    ${isHost ? '<p class="small muted center-text" data-key="seathint">Tap a seat to move or remove a player.</p>' : ''}
    <section data-key="setup">
      <div class="rule">Setup</div>
      ${isHost ? setupForm(v) : setupSummary(v)}
    </section>
    <section class="stack" data-key="report">
      ${report.publicDeck ? deckPreview(report.publicDeck) : ''}
      ${report.errors.map((e, i) => `<div class="banner blood" data-key="err-${i}">${glyph('dagger')}<div><p>${esc(e)}</p></div></div>`).join('')}
      ${report.warnings.map((w, i) => `<div class="banner" data-key="warn-${i}">${glyph('scroll')}<div><p>${esc(w)}</p></div></div>`).join('')}
    </section>`;
}

function deckPreview(deck) {
  const names = S.content?.roles ? Object.fromEntries(S.content.roles.map((r) => [r.id, r])) : {};
  const chip = (id, n, cls = '') => `<span class="deck-card ${cls}" data-key="dc-${id}">${names[id] ? glyph(names[id].glyph) : ''}<b>${esc(names[id]?.name ?? id)}</b><i>×${n}</i></span>`;
  if (deck.exact) return `<div class="deck" data-key="deck"><span class="kicker">Exact deck</span><div class="deck-row">${Object.entries(deck.exact).map(([id, n]) => chip(id, n, id === 'DEATH' ? 'death' : '')).join('')}</div></div>`;
  return `<div class="deck" data-key="deck"><span class="kicker">The deck</span><div class="deck-row">
    ${Object.entries(deck.core).filter(([, n]) => n > 0).map(([id, n]) => chip(id, n, id === 'DEATH' ? 'death' : '')).join('')}
    ${deck.extended ? `<span class="deck-card secret" data-key="dc-ext"><span class="q">?</span><b>Extended</b><i>×${deck.extended}</i></span>` : ''}
  </div>${deck.extended ? `<p class="small muted">Extended seats are drawn secretly from: ${deck.pool.map((id) => esc(names[id]?.name ?? id)).join(', ')}.</p>` : ''}</div>`;
}

function setupSummary(v) {
  const s = v.settings;
  const preset = v.presets.find((p) => p.id === s.preset);
  const ruleNames = (ids) => ids.map((id) => esc(S.content?.rules.find((r) => r.id === id)?.name ?? id)).join(', ');
  return `<div class="stack">
    <div class="preset" aria-pressed="true" style="cursor:default"><b>${esc(preset.name)}</b><small>${esc(preset.blurb)}</small></div>
    <div class="pill-row">
      <span class="tag">${s.rules.mode === 'random' ? `${s.rules.count} random rule card${s.rules.count === 1 ? '' : 's'}` : ruleNames(s.rules.selected) || 'No rule cards'}</span>
      <span class="tag">${s.dreams ? 'Dreams on' : 'No dreams'}</span>
      <span class="tag">${s.transport === 'remote' ? 'Remote · chat' : 'Same room'}</span>
      ${s.scenario.mode === 'manual' ? `<span class="tag">${esc(s.scenario.who)}</span>` : ''}
    </div>
    <p class="muted small">Tap <b>Ready</b> when you've read the setup. The host starts the match.</p>
  </div>`;
}

function setupForm(v) {
  const s = v.settings;
  const preset = v.presets.find((p) => p.id === s.preset);
  const rules = (S.content?.rules ?? []).filter((r) => preset.ruleIds.includes(r.id));
  const ext = (S.content?.roles ?? []).filter((r) => r.set !== 'core');
  const t = s.timers;
  const OPTS = [0, 15, 30, 45, 60, 90, 120, 180, 300, 600];
  const timer = (key, label) => `<label class="field"><span>${label}</span><select class="input" data-set="timers.${key}">
      ${OPTS.map((n) => `<option value="${n}" ${t[key] === n ? 'selected' : ''}>${n === 0 ? 'Untimed' : n < 60 ? `${n} s` : `${n / 60} min`}</option>`).join('')}
      ${OPTS.includes(t[key]) ? '' : `<option selected value="${t[key]}">${t[key]} s</option>`}</select></label>`;
  return `<div class="stack" style="gap:18px">
    <div class="carousel" data-key="presets">${v.presets.map((p) => `<button class="preset" data-act="preset" data-id="${p.id}" aria-pressed="${s.preset === p.id}" data-key="pr-${p.id}"><b>${esc(p.name)}</b>${p.recommended ? '<span class="tag solid">Best first game</span>' : ''}<small>${esc(p.blurb)}</small><span class="kicker">${p.min}–${p.max} players</span></button>`).join('')}</div>

    ${preset.custom ? `<details class="more" data-key="d-custom" open><summary>Custom deck</summary><div>
      <div class="rule-grid">${ext.map((r) => `<label class="check"><input type="checkbox" data-act-change="pool" data-id="${r.id}" ${s.extendedPool.includes(r.id) ? 'checked' : ''}><span><b>${esc(r.name)} <span class="muted small">${r.set === 'full' ? 'Full Deck' : 'Standard'}</span></b><small>${esc(r.summary)}</small></span></label>`).join('')}</div>
      <label class="check"><input type="checkbox" data-set-bool="dreams" ${s.dreams ? 'checked' : ''}><span><b>Dreams</b><small>Everyone draws a Dream card each night.</small></span></label>
      <label class="check"><input type="checkbox" data-set-bool="doomsday" ${s.doomsday ? 'checked' : ''}><span><b>Doomsday Clock</b><small>Death wins if nobody has won when the final Day closes.</small></span></label>
      <label class="field"><span>Exact deck (optional)</span><textarea class="input" data-set-text="customDeck" placeholder="Death x2&#10;Guardian&#10;Mentalist&#10;Psycho&#10;Whore">${esc(s.customDeck)}</textarea></label>
    </div></details>` : ''}
    ${preset.id === 'classic' ? `<label class="check"><input type="checkbox" data-set-bool="dreams" ${s.dreams ? 'checked' : ''}><span><b>Simplified Dreams</b><small>Off by default for teaching games.</small></span></label>` : ''}
    ${preset.id === 'doomsday' || (preset.custom && s.doomsday) ? `<label class="field"><span>Doomsday after Day</span><select class="input" data-set="doomsdayDays">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<option ${s.doomsdayDays === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>` : ''}

    <details class="more" data-key="d-rules" open><summary>Rule cards</summary><div>
      ${preset.rulesMax === 0 ? '' : `<div class="seg" role="group"><button data-act="rulesMode" data-mode="random" aria-pressed="${s.rules.mode === 'random'}">Draw at random</button><button data-act="rulesMode" data-mode="manual" aria-pressed="${s.rules.mode === 'manual'}">Choose</button></div>`}
      ${s.rules.mode === 'random' ? `<div class="stepper"><span>How many</span>${range(preset.rulesMin, preset.rulesMax).map((n) => `<button data-act="ruleCount" data-n="${n}" aria-pressed="${s.rules.count === n}">${n}</button>`).join('')}</div><small class="muted small">Drawn secretly when the match starts.</small>`
        : `<div class="rule-grid">${rules.map((r) => `<label class="check"><input type="checkbox" data-act-change="rule" data-id="${r.id}" ${s.rules.selected.includes(r.id) ? 'checked' : ''}><span><b>${esc(r.name)}</b><small>${esc(r.text)}</small></span></label>`).join('')}</div><small class="muted small">Choose ${preset.rulesMin}–${preset.rulesMax}.</small>`}
    </div></details>

    <details class="more" data-key="d-story"><summary>Story · WHO / WHERE / WHY</summary><div>
      <div class="seg" role="group"><button data-act="scenMode" data-mode="random" aria-pressed="${s.scenario.mode === 'random'}">Random</button><button data-act="scenMode" data-mode="manual" aria-pressed="${s.scenario.mode === 'manual'}">Write our own</button></div>
      ${s.scenario.mode === 'manual' ? ['who', 'where', 'why'].map((k) => `<label class="field"><span>${k.toUpperCase()}</span><input class="input" maxlength="80" data-set-text="scenario.${k}" value="${esc(s.scenario[k])}" placeholder="${{ who: 'Lost Tourists', where: 'a Haunted Mansion', why: 'Solve a Murder' }[k]}"></label>`).join('') : '<p class="small muted">Pure storytelling. It never changes the rules.</p>'}
    </div></details>

    <details class="more" data-key="d-table"><summary>Table & timers</summary><div>
      <div class="seg" role="group"><button data-act="transport" data-mode="in-person" aria-pressed="${s.transport === 'in-person'}">Same room</button><button data-act="transport" data-mode="remote" aria-pressed="${s.transport === 'remote'}">Remote · chat</button></div>
      <div class="grid2">${timer('morning', 'Morning')}${timer('discussion', 'Discussion')}${timer('defense', 'Defence (each)')}${timer('voting', 'Voting')}${timer('swap', 'Dream swap')}${timer('night', 'Night')}${timer('retaliation', 'Final act')}</div>
      <label class="check"><input type="checkbox" data-set-bool="revealOnDeath" ${s.revealOnDeath ? 'checked' : ''}><span><b>Reveal roles on death</b><small>Never with the Hidden Roles card.</small></span></label>
      <label class="check"><input type="checkbox" data-set-bool="endReveal" ${s.endReveal ? 'checked' : ''}><span><b>Reveal every role at the end</b></span></label>
      <label class="check"><input type="checkbox" data-set-bool="selfNomination" ${s.selfNomination ? 'checked' : ''}><span><b>Allow self-nomination</b></span></label>
      <label class="check"><input type="checkbox" data-set-bool="selfVote" ${s.selfVote ? 'checked' : ''}><span><b>Nominees may vote for themselves</b></span></label>
    </div></details>
  </div>`;
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// ── Role card ──────────────────────────────────────────────────────────────
function roleCardHtml(role, { align = null, flipKey = 'role', flipped = null, mini = false } = {}) {
  if (!role) return '';
  const a = align ?? role.alignment;
  const isFlipped = flipped ?? !!S.ui.flipped[flipKey];
  if (mini) {
    return `<button class="role-mini ${a === 'DEATH' ? 'death' : ''}" data-act="sheet" data-id="role" data-key="rolemini">${glyph(role.glyph)}<span><b>${esc(role.name)}</b><small>${esc(role.summary)}</small></span></button>`;
  }
  return `<div class="card-stage" data-key="stage-${flipKey}">
    <button class="flipcard ${isFlipped ? 'flipped' : ''}" data-act="flip" data-key="${flipKey}" data-tilt aria-label="${isFlipped ? `Your role: ${esc(role.name)}` : 'Turn over your role card'}">
      <span class="face back"><span class="mono-gram">DS</span><span class="hint kicker">Tap to turn over</span></span>
      <span class="face front ${a === 'DEATH' ? 'death' : ''}">
        <span class="corner"><b>${esc(ALIGN[a])}</b><span>${esc(role.when)}</span></span>
        <span class="art">${glyph(role.glyph)}</span>
        <span class="nm">${esc(role.name)}</span>
        ${role.alias ? `<span class="small muted">also called ${esc(role.alias)}</span>` : ''}
        <span class="sum">${esc(role.summary)}</span>
        <span class="shine" aria-hidden="true"></span>
      </span>
    </button></div>`;
}

function roleNotes(me) {
  return `<div class="stack" style="gap:10px">
    <p class="muted small">${esc(me.role.detail)}</p>
    ${me.originalRole ? `<p class="small muted">You began as ${esc(me.originalRole.name)}.</p>` : ''}
    ${me.alignment === 'DEATH' && me.role.id !== 'DEATH' ? '<p class="blood small">You are Death-aligned.</p>' : ''}
    ${me.mimicPowerless ? '<p class="small muted">Your copy failed: you are a powerless Mimic.</p>' : ''}
    ${Object.values(me.charges || {}).map((n) => `<p class="small muted">${n > 0 ? 'One use remaining.' : 'Your once-per-game power is spent.'}</p>`).join('')}
    ${teammates(me)}
  </div>`;
}

function teammates(me) {
  if (me.teammates) return `<div class="panel tight seal"><span class="kicker blood">Your Death team</span>${me.teammates.length ? `<p>${me.teammates.map((t) => esc(t.name)).join(', ')}</p>` : '<p>You are alone. Every kill is your call.</p>'}</div>`;
  if (me.joinsTeamNight) return `<div class="panel tight seal"><span class="kicker blood">Death team</span><p>You join the Death team room on Night ${roman(me.joinsTeamNight)}.</p></div>`;
  return '';
}

// ── Night 0 ────────────────────────────────────────────────────────────────
function revealMain(v, me) {
  const key = `n0-${v.phaseId}`;
  return `${head(v)}
    <p class="muted center-text" data-key="n0hint">${me.acknowledged ? `Waiting for the others · ${v.progress.done}/${v.progress.total}` : 'Shield your screen, then tap the card.'}</p>
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
  if (v.phase === 'DAY_RESOLVING') stage = v.action.type === 'retaliate' ? '<p class="center-text blood" data-key="ret">You were sentenced. You may take one living non-Death player with you.</p>' : '<p class="center-text muted" data-key="ret">The condemned is making a final choice…</p>';
  return `${head(v)}
    ${statusBanners(v, me)}
    ${pickTabs(ctx, pick)}
    ${ring(v, { pick, center: centerFor(v, pick) })}
    ${stage}
    ${chatBlock(v)}
    ${chips(v)}`;
}

function statusBanners(v, me) {
  const out = [];
  if (!me.alive) out.push(`<div class="banner" data-key="st-dead">${glyph('death')}<div><b>You are dead.</b><p>Watch in silence.${v.activeRules.some((r) => r.id === 'VENGEFUL_GHOSTS') ? ' Vengeful Ghosts: you cast a ghost ballot each Day.' : ''}</p></div></div>`);
  if (me.statuses.includes('MUTE')) out.push(`<div class="banner blood" data-key="st-mute">${glyph('psycho')}<div><b>You are MUTE today.</b><p>No talking in discussion or defence. You can still nominate and vote.</p></div></div>`);
  if (me.statuses.includes('NO_VOTE')) out.push(`<div class="banner blood" data-key="st-nov">${glyph('psycho')}<div><b>NO VOTE today.</b><p>You may speak, but your ballot is disabled.</p></div></div>`);
  if (me.revived) out.push(`<div class="banner" data-key="st-rev">${glyph('necro')}<div><b>Borrowed time.</b><p>Nothing can kill you until it runs out after Night ${roman(me.revived.expiresAfterNight)} — but the town can still sentence you.</p></div></div>`);
  const ids = v.activeRules.map((r) => r.id);
  if (me.alive && (v.phase === 'DAY_DISCUSSION' || v.phase === 'DAY_DEFENSE')) {
    if (ids.includes('CURSED_SILENCE')) out.push(`<div class="banner" data-key="st-cs">${glyph('scroll')}<div><b>Cursed Silence</b><p>Speak only when someone addresses you directly.</p></div></div>`);
    if (ids.includes('FOG_OF_WAR')) {
      const seats = [...v.players].sort((x, y) => x.seat - y.seat);
      const n = seats.length; const l = seats[(me.seat - 1 + n) % n]; const r = seats[(me.seat + 1) % n];
      out.push(`<div class="banner" data-key="st-fog">${glyph('scroll')}<div><b>Fog of War</b><p>Talk only with ${esc(l.name)} and ${esc(r.name)}.</p></div></div>`);
    }
  }
  return out.join('');
}

function morningStage(v) {
  const news = v.log.filter((l) => (l.ev === 'dawn' && l.day === v.dayNumber) || (l.at === `Day ${v.dayNumber}` && ['death', 'immunity'].includes(l.kind)) || (l.ev === 'revive' && l.at === `Night ${v.dayNumber - 1}`));
  const ab = v.action.abilities || [];
  let abilities = '';
  if (ab.some((x) => x.kind === 'immunity')) abilities += `<div class="panel tight" data-key="dip"><span class="kicker">Diplomat · once per game</span><p class="small">Declare immunity now and nobody can nominate you today. Everyone will see it.</p>${holdBtn('immunity', 'Hold to declare immunity')}</div>`;
  if (ab.some((x) => x.kind === 'immune')) abilities += `<div class="banner" data-key="imm">${glyph('diplomat')}<div><b>You are immune today.</b></div></div>`;
  if (ab.some((x) => x.kind === 'shoot')) abilities += '<p class="small muted center-text" data-key="vig">Vigilante: tap a seat to aim. The shot fires when the host opens discussion. Nobody will know it was you.</p>';
  return `<section class="stack" data-key="morning">
    ${news.length ? news.map((l) => `<div class="report ${l.kind === 'death' ? 'alarm' : ''}" data-key="news-${l.i}"><p>${esc(l.text)}</p></div>`).join('') : `<div class="report" data-key="news-none"><p>${v.dayNumber === 1 ? 'Nobody has died yet. Introduce yourselves — or don\'t.' : 'Nothing to report.'}</p></div>`}
    ${abilities}
    ${!v.host ? '<p class="small muted center-text">The host will open discussion shortly.</p>' : ''}
  </section>`;
}

function nominationList(v) {
  const d = v.day;
  if (!d?.nominations.length) return '<p class="muted small center-text" data-key="nonom">No one is accused yet.</p>';
  const by = {};
  for (const n of d.nominations) (by[n.target] ||= []).push(n.by);
  return `<ol class="accused" data-key="accused">${d.nominees.map((id, i) => `<li data-key="acc-${id}" class="${d.speaking === id ? 'speaking' : ''}"><span class="num">${roman(i + 1)}</span><b>${pname(id)}</b><small>by ${by[id].map(pname).join(', ')}</small></li>`).join('')}</ol>`;
}

function discussionStage(v) {
  const a = v.action;
  return `<section class="stack" data-key="disc">${nominationList(v)}
    ${a.type === 'nominate' && a.mine ? `<p class="small muted center-text">You accused <b>${pname(a.mine)}</b>. One nomination per Day.</p>` : ''}
    <p class="small muted center-text">${v.day.nominees.length ? 'When nominations close, each nominee defends themselves.' : 'No nominations means no vote — and no sentence.'}</p></section>`;
}

function defenseStage(v, me) {
  const d = v.day;
  return `<section class="stack" data-key="def">${nominationList(v)}
    ${d.speaking === me.id ? (me.statuses.includes('MUTE') ? '<div class="banner blood" data-key="myturn"><div><b>Your turn — but you are muted.</b><p>Plead without words.</p></div></div>' : '<div class="banner spot" data-key="myturn"><div><b>Your turn to speak.</b><p>Make your case to the table.</p></div></div>') : ''}
  </section>`;
}

function votingStage(v) {
  const a = v.action;
  if (a.type === 'novote') return '<div class="banner blood" data-key="nov"><div><b>Voting disabled.</b><p>You have no vote today.</p></div></div>';
  if (a.type !== 'ballot') return '';
  const sel = S.sel.vote ?? a.choice;
  return `<section class="stack" data-key="ballot">
    <div class="row center">
      <span class="tag ${a.ghost ? '' : 'solid'}">${a.ghost ? 'Ghost ballot · weight 1' : `Your weight · ${a.weight}`}</span>
      <button class="btn btn-sm ${sel === 'ABSTAIN' ? 'btn-solid' : ''}" data-act="pickVote" data-id="ABSTAIN">Abstain</button>
    </div>
    ${a.ghost && a.majority ? '<p class="small muted center-text">Majority Rule: ghost ballots never decide the sentence.</p>' : ''}
    ${v.day.majority != null ? `<p class="small muted center-text">Majority Rule: more than ${v.day.majority} weight needed.</p>` : ''}
    <p class="small muted center-text">Secret until it locks. Only totals are published. A tie sentences nobody.</p>
  </section>`;
}

// ── Chat ───────────────────────────────────────────────────────────────────
function chatBlock(v) {
  if (!v.chats?.length) return '';
  const active = v.chats.find((c) => c.id === S.ui.chat) ?? v.chats[0];
  return `<section class="chat" data-key="chat">
    <div class="tabs-row">${v.chats.map((c) => `<button class="chip ${c.id === active.id ? 'on' : ''}" data-act="chatTab" data-id="${esc(c.id)}">${esc(c.label)}</button>`).join('')}</div>
    <div class="log" data-scroll="chat-${esc(active.id)}" data-key="log-${esc(active.id)}">${active.messages.length ? active.messages.map((m, i) => `<div class="msg ${m.name === 'You' ? 'mine' : ''}" data-key="m-${m.ts}-${i}"><b>${esc(m.name)}</b><span>${esc(m.text)}</span></div>`).join('') : '<p class="small muted">No messages yet.</p>'}</div>
    ${active.canSend ? `<form data-form="chat" data-id="${esc(active.id)}"><input class="input" maxlength="280" placeholder="Say something…" data-draft="chat" value="${esc(S.drafts.chat ?? '')}" autocomplete="off"><button class="btn btn-sm" type="submit">Send</button></form>` : '<p class="small muted">You cannot speak here right now.</p>'}
  </section>`;
}

// ── Night ──────────────────────────────────────────────────────────────────
function nightMain(v, me) {
  if (!me.alive || v.action.type === 'spectate') {
    return `${head(v)}
      <div class="banner" data-key="spec">${glyph('death')}<div><b>${me.alive ? 'You returned too late to act tonight.' : 'You are dead.'}</b><p>No dreams, no powers. Dawn will tell.</p></div></div>
      ${ring(v, { center: centerFor(v) })}${chips(v)}`;
  }
  const unveiled = S.ui.unveiled[v.phaseId];
  if (!unveiled) {
    return `${head(v)}
      <section class="curtain" data-key="curtain">
        ${moon(0.3, 'big')}
        <p>Make sure nobody can see your screen.</p>
        <button class="btn btn-solid" data-act="unveil">Open your eyes</button>
        <span class="small muted">${v.progress ? `${v.progress.done}/${v.progress.total} ${esc(v.progress.label)}` : ''}</span>
      </section>${chips(v)}`;
  }
  const body = v.phase === 'NIGHT_DREAM_SWAP' ? swapStage(v, me, v.action) : actionsStage(v, me, v.action);
  return `${head(v, `<button class="btn btn-sm btn-ghost cover" data-act="veil" data-key="cover">${glyph('veil')} Cover</button>`)}<div class="night-body" data-key="nightbody">${body}</div>${chips(v)}`;
}

function swapStage(v, me, a) {
  if (a.done) return sleepingHtml(v, 'Dreams are settling…');
  const { pick } = activePick(v);
  if (a.snatcher) {
    return `${dreamCard(me.dream)}
      <p class="small muted center-text" data-key="swaphint">Swap Dream cards with another player before actions open — or keep yours. Swaps resolve in seat order.</p>
      ${ring(v, { pick, center: centerFor(v, pick) })}
      <div class="row center" data-key="keep"><button class="btn btn-ghost btn-sm" data-act="swap" data-none="1">Keep my dream</button></div>`;
  }
  return `<section class="curtain small" data-key="forming">${moon(0.5, 'big drift')}<p>Your dream is forming…</p><button class="btn btn-solid" data-act="swap" data-none="1">Close my eyes</button></section>`;
}

function sleepingHtml(v, line) {
  return `<section class="sleeping" data-key="sleeping">
    <div class="zz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></div>
    ${moon(v.progress ? v.progress.done / Math.max(1, v.progress.total) : 0, 'big')}
    <p>${esc(line)}</p>
    <span class="small muted">${v.progress ? `${v.progress.done}/${v.progress.total} ${esc(v.progress.label)}` : ''} — dawn comes when everyone sleeps, or when time runs out.</span>
  </section>`;
}

function dreamCard(d) {
  if (!d) return '';
  return `<div class="dream" data-key="dream-${d.id}">${dreamGlyph(d.id)}<div><span class="kicker">Tonight's dream</span><h3>${esc(d.name)}</h3><p>${esc(d.text)}</p></div></div>`;
}

function actionsStage(v, me, a) {
  if (a.done) {
    return `${sleepingHtml(v, 'You are asleep.')}${submittedSummary(a)}<div class="row center" data-key="wake"><button class="btn btn-ghost btn-sm" data-act="reopen">Wake up and change my mind</button></div>${chatBlock(v)}`;
  }
  const { ctx, pick } = activePick(v);
  const parts = [dreamCard(me.dream)];
  const s = a.schema;
  if (me.sleepwalkPartner) parts.push(`<p class="small muted center-text" data-key="sw">You are bound to ${esc(me.sleepwalkPartner)}, seated just before you.</p>`);
  // The ring (the actual decision) comes first; details follow beneath it.
  if (ctx.length) {
    parts.push(pickTabs(ctx, pick));
    const marks = {};
    if (a.death && pick.key === 'death') {
      for (const m of a.death.members) {
        if (m.id === me.id) continue;
        for (const t of a.death.proposals[m.id] ?? []) marks[t] = (marks[t] ?? '') + initials(m.name);
      }
    }
    parts.push(ring(v, { pick, center: centerFor(v, pick), marks }));
    if (pick.key === 'role' && s?.options && (S.sel.uses ?? []).length) {
      parts.push(`<div class="stack" data-key="useopts">${(S.sel.uses ?? []).map((u, i) => `<div class="optrow" data-key="uo-${u.target}"><span>${pname(u.target)}</span><div class="seg">${s.options.map((o) => `<button data-act="pickUseOption" data-i="${i}" data-id="${o.id}" aria-pressed="${u.option === o.id}">${esc(o.label)}</button>`).join('')}</div></div>`).join('')}</div>`);
    }
    if (pick.key === 'role' && s?.kind === 'chat') parts.push(`<div class="row center" data-key="conspbtn"><button class="btn" data-act="conspire" ${S.sel.conspire ? '' : 'disabled'}>Open whisper</button></div>`);
  }
  if (a.death) parts.push(deathRoom(v, me, a.death));
  else if (!s) parts.push(`<p class="muted center-text" data-key="noact">${noActionReason(me, v)}</p>`);
  else if (s.blocked === 'paralysis') parts.push(`<div class="banner blood" data-key="para">${dreamGlyph('SLEEP_PARALYSIS')}<div><b>Sleep Paralysis</b><p>You cannot use your role tonight.</p></div></div>`);
  else if (s.kind === 'choice') {
    const sel = S.sel.uses ?? [];
    parts.push(`<section class="stack" data-key="choice"><div class="rule">${esc(s.role.name)}${s.charges === 1 ? ' · once per game' : ''}</div><div class="options">${s.options.map((o) => `<button class="option" data-act="pickOption" data-id="${o.id}" aria-pressed="${sel[0]?.option === o.id}" data-key="o-${o.id}">${esc(o.label)}</button>`).join('')}</div>
      ${s.role.id === 'DOUBLE_AGENT' ? '<p class="small muted">Mandatory and permanent. No choice means you stay non-Death.</p>' : ''}</section>`);
  } else if (s.kind === 'chat' && (a.conspire || v.chats?.some((c) => c.id.startsWith(`consp:${v.nightNumber}:${me.id}`)))) {
    parts.push('<p class="small muted center-text" data-key="wh">Your whisper is open below. Your partner sees only "Stranger".</p>');
  } else {
    parts.push(`<p class="small muted center-text" data-key="rolehint">${esc(s.role.name)}${s.charges === 1 ? ' · once per game' : ''}${s.uses > 1 ? ' · twice tonight' : ''}${s.role.id === 'MIMIC' ? ' · mandatory, or you stay powerless' : ''}${s.kind === 'dead' ? ' · you must survive the night' : ''}</p>`);
  }
  if (!a.death && !ctx.length && me.role) parts.push(roleCardHtml(me.role, { align: me.alignment, mini: true }));
  parts.push(chatBlock(v));
  return parts.join('');
}

function submittedSummary(a) {
  if (a.death) {
    const mine = a.death.proposals?.[V().me.id] ?? [];
    return `<p class="small muted center-text" data-key="sub">${mine.length ? `You confirmed: ${mine.map(pname).join(' and ')}.` : 'You confirmed a pass.'}</p>`;
  }
  if (a.submitted?.length) return `<p class="small muted center-text" data-key="sub">Submitted: ${a.submitted.map((u) => [u.target ? pname(u.target) : '', u.option ? optionLabel(a.schema, u.option) : ''].filter(Boolean).join(' · ')).join('; ')}.</p>`;
  return '';
}
const optionLabel = (schema, id) => esc(schema?.options?.find((o) => o.id === id)?.label ?? id);

function noActionReason(me, v) {
  if (me.mimicPowerless) return 'Your copy failed. No action — waiting for dawn.';
  if (me.role?.id === 'MIMIC' || me.role?.id === 'DOUBLE_AGENT') return 'Your choice was made on Night 1. Waiting for dawn.';
  if (Object.values(me.charges || {}).some((n) => n === 0)) return 'Your once-per-game power is spent. Waiting for dawn.';
  if (me.alignment === 'DEATH' && me.joinsTeamNight) return `You join the Death team on Night ${roman(me.joinsTeamNight)}.`;
  if (me.originalRole && v.nightNumber < 2) return 'Your new powers begin next night.';
  return 'No action tonight. Close your eyes and wait for dawn.';
}

function deathRoom(v, me, D) {
  const keyOf = (arr) => [...(arr || [])].sort().join(',');
  const props = D.members.map((m) => ({ ...m, picks: m.id === me.id ? (S.sel.death ?? D.proposals[m.id] ?? null) : D.proposals[m.id] ?? null, confirmed: D.confirmed[m.id] }));
  const agree = props.every((p) => p.picks && keyOf(p.picks) === keyOf(props[0].picks));
  return `<section class="death-room" data-key="droom">
    <div class="dr-head"><span class="kicker blood">The Death room</span><span class="tag blood">Capacity ${D.capacity}</span></div>
    ${D.paralysed ? `<div class="banner blood" data-key="dpara">${dreamGlyph('SLEEP_PARALYSIS')}<div><b>You hold Sleep Paralysis.</b><p>The whole kill is blocked tonight. Your team does not know.</p></div></div>` : ''}
    <ul class="mates">${props.map((p) => `<li class="${p.confirmed ? 'ok' : ''}" data-key="mate-${p.id}"><span class="mate-ini">${initials(p.name)}</span><span><b>${esc(p.id === me.id ? 'You' : p.name)}</b><small>${p.picks ? (p.picks.length ? p.picks.map(pname).join(' + ') : 'pass') : 'thinking…'}</small></span>${p.confirmed ? `<i class="ok-mark">${glyph('check')}</i>` : ''}</li>`).join('')}</ul>
    <p class="agree ${agree ? 'yes' : 'no'}" data-key="agree-${agree}">${D.members.length === 1 ? 'You hunt alone.' : agree ? 'Your team agrees.' : 'Not agreed. Unless every one of you confirms the same target, nobody dies.'}</p>
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
function endMain(v, me) {
  const title = { DEATH: 'Death wins.', NON_DEATH: 'The living win.', JESTER: 'The Jester wins.', DRAW: 'A draw.', ABORTED: 'Abandoned.' }[v.winner] ?? 'The End';
  const won = didIWin(v, v.winner);
  const revealed = v.players.some((p) => p.role);
  return `<section class="verdict ${v.winner === 'DEATH' ? 'death' : ''}" data-key="verdict"><span class="kicker">Verdict</span><h1>${letters(title)}</h1><p class="scenario">${esc(v.endReason)}</p>
      ${won === null ? '' : `<div class="result-stamp ${won ? 'win' : 'loss'}">${won ? 'Victory' : 'Defeat'}</div>`}</section>
    ${revealed ? ring(v, { reveal: true, center: centerFor(v) }) : ''}
    <section data-key="reveal"><div class="rule">Every secret</div>${revealed ? `<ul class="ledger">${v.players.map((p, i) => `<li class="${p.alive ? '' : 'dead'} ${p.id === me?.id ? 'me' : ''}" style="--i:${i}" data-key="rv-${p.id}">
      <span class="seat">${p.role ? glyph(p.role.glyph) : ''}</span>
      <span class="who"><b>${esc(p.name)}</b><small>${p.role ? esc(p.role.name) : '—'}${p.originalRole ? ` (was ${esc(p.originalRole.name)})` : ''} · ${p.alive ? 'alive' : `† ${esc(p.diedAt ?? '')}`}</small></span>
      <span class="tags"><span class="tag ${p.alignment === 'DEATH' ? 'blood' : ''}">${esc(ALIGN[p.alignment] ?? '')}</span></span></li>`).join('')}</ul>` : '<p class="muted">The host chose not to reveal roles.</p>'}</section>
    ${me && !me.moderator ? `<details class="more" data-key="endnotes"><summary>My notes</summary><div>${feed([...(v.private || [])].reverse(), 'notes')}</div></details>` : ''}
    <details class="more" data-key="endrec"><summary>Public record</summary><div>${feed(v.log)}</div></details>
    <div class="row center" data-key="endbtns"><a class="btn" href="/" data-link>Back to start</a></div>`;
}

// ── Moderator ──────────────────────────────────────────────────────────────
function moderatorMain(v) {
  if (v.phase === 'LOBBY') return lobbyMain(v, v.me);
  const sec = Object.fromEntries((v.secrets || []).map((s) => [s.id, s]));
  return `${head(v)}
    <div class="banner blood" data-key="modb">${glyph('mentalist')}<div><b>Trusted moderator view</b><p>You see everything. Do not show this screen to players.</p></div></div>
    ${ring(v, { center: centerFor(v) })}
    ${v.deathTeam ? `<div class="panel seal tight" data-key="moddt"><span class="kicker blood">Death room · capacity ${v.deathTeam.capacity}</span>${v.deathTeam.members.map((id) => `<p>${pname(id)}: ${(v.deathTeam.proposals[id] || []).map(pname).join(' + ') || '—'} ${v.deathTeam.confirmed[id] ? '(confirmed)' : ''}</p>`).join('')}</div>` : ''}
    ${v.day ? nominationList(v) : ''}
    <section data-key="modall"><div class="rule">Everyone</div><ul class="ledger">${v.players.map((p) => { const s = sec[p.id] || {}; return `<li class="${p.alive ? '' : 'dead'}" data-key="mod-${p.id}"><span class="seat">${String(p.seat + 1).padStart(2, '0')}</span><span class="who"><b>${esc(p.name)}</b><small>${esc(s.role ?? '')} · ${esc(ALIGN[s.alignment] ?? '')}${s.dream ? ` · dreams ${esc(s.dream)}` : ''}${s.statuses?.length ? ` · ${s.statuses.join(', ')}` : ''}${s.action ? ` · ${s.action.map((u) => [u.target ? pname(u.target) : '', u.option ?? ''].filter(Boolean).join(' ')).join('; ')}` : ''}${s.ballot ? ` · votes ${s.ballot === 'ABSTAIN' ? 'abstain' : pname(s.ballot)}` : ''}</small></span><span class="tags">${s.done ? '<span class="tag solid">Done</span>' : ''}</span></li>`; }).join('')}</ul></section>`;
}

// ── Board (public TV display) ──────────────────────────────────────────────
function boardScreen() {
  const v = V();
  if (S.conn === 'gone') return goneScreen();
  if (!v) return loadingScreen();
  return `<main class="board" data-key="board">
    <div class="row between">${wordmark()}<span class="kicker">Room <span class="mono">${esc(v.code)}</span> · public board</span></div>
    <div class="cols">
      <section>${head(v)}${v.scenario ? `<p class="scenario">${esc(`We are ${v.scenario.who}, in ${v.scenario.where}, trying to ${v.scenario.why}.`)}</p>` : ''}
        ${ring(v, { center: centerFor(v), lobby: v.phase === 'LOBBY', slots: v.phase === 'LOBBY' ? Math.max(5, v.players.length) : 0, reveal: v.phase === 'ENDED' })}
        ${v.phase === 'LOBBY' ? `<div class="row center" data-key="bqr">${qrSvg(`${location.origin}/r/${v.code}`)}<span class="code-tiles big">${codeTiles(v.code)}</span></div>` : ''}
        ${v.day?.nominees?.length ? nominationList(v) : ''}
      </section>
      <section><div class="rule">Public record</div><div data-scroll="board-tl" class="board-feed">${feed(v.log)}</div>
        ${v.activeRules?.length ? `<div class="rule">Rules in force</div>${v.activeRules.map((r) => `<p><b>${esc(r.name)}</b> <span class="muted small">${esc(r.text)}</span></p>`).join('')}` : ''}</section>
    </div></main>`;
}

// ── Dock (primary action) ──────────────────────────────────────────────────
function dock(v) {
  const me = v.me;
  const a = v.action;
  const parts = [];
  const hostNext = v.host?.advance && v.phase !== 'LOBBY' ? holdBtn('advance', v.host.advance, 'btn-host', { key: 'dock-adv' }) : '';
  const btn = (label, act, cls = 'btn-solid', dis = false, key = act, extra = '') => `<button class="btn ${cls}" data-act="${act}" data-key="d-${key}" ${extra} ${dis || S.pending ? 'disabled' : ''}>${label}</button>`;
  if (me?.moderator) {
    if (v.phase === 'LOBBY' && v.host) parts.push(holdBtn('start', v.setup.notReady ? `Waiting for ${v.setup.notReady} to ready up` : 'Hold to start', 'btn-solid', { dis: !v.setup.ok || !!v.setup.notReady }));
  } else if (me) {
    switch (v.phase) {
      case 'LOBBY':
        if (v.host) parts.push(holdBtn('start', v.players.length < 5 ? `Need ${5 - v.players.length} more player${5 - v.players.length === 1 ? '' : 's'}` : v.setup.notReady ? `Waiting for ${v.setup.notReady} to ready up` : v.setup.ok ? 'Hold to start' : 'Fix setup first', `btn-solid ${v.setup.ok && !v.setup.notReady ? 'glow' : ''}`, { dis: !v.setup.ok || !!v.setup.notReady }));
        else parts.push(btn(me.ready ? `${glyph('check')} Ready` : 'I\'m ready', 'ready', me.ready ? 'is-on' : 'btn-solid glow'));
        break;
      case 'NIGHT_0_REVEAL':
        if (!me.acknowledged) parts.push(btn('Understood', 'ack', 'btn-solid', !S.ui.flipped[`n0-${v.phaseId}`]));
        break;
      case 'DAY_PREP': {
        const shot = a.abilities?.find((x) => x.kind === 'shoot' && x.choice);
        if (shot) parts.push(`<span class="dock-note blood" data-key="aim">${glyph('vigilante')} Aimed at ${pname(shot.choice)}</span>`);
        break;
      }
      case 'DAY_DISCUSSION':
        if (a.type === 'nominate' && !a.mine && S.sel.nominate) parts.push(btn(`Accuse ${pname(S.sel.nominate)}`, 'nominate', 'btn-blood'));
        break;
      case 'DAY_VOTING':
        if (a.type === 'ballot') {
          const sel = S.sel.vote ?? a.choice;
          if (sel && sel !== a.choice) parts.push(btn(sel === 'ABSTAIN' ? 'Abstain' : `Vote ${pname(sel)}`, 'vote', 'btn-blood'));
          else if (a.choice) parts.push(`<span class="dock-note stamped" data-key="rec-${a.choice}">${glyph('check')} ${a.choice === 'ABSTAIN' ? 'Abstained' : `Voted ${pname(a.choice)}`}</span>`);
        }
        break;
      case 'DAY_RESOLVING':
        if (a.type === 'retaliate') {
          parts.push(btn('Go quietly', 'retaliate', 'btn-ghost', false, 'quiet', 'data-none="1"'));
          if (S.sel.retaliate) parts.push(btn(`Take ${pname(S.sel.retaliate)}`, 'retaliate', 'btn-blood'));
        }
        break;
      case 'NIGHT_DREAM_SWAP':
        if (a.type === 'swap' && a.snatcher && !a.done && S.sel.swap && S.ui.unveiled[v.phaseId]) parts.push(btn(`Swap with ${pname(S.sel.swap)}`, 'swap', 'btn-solid'));
        break;
      case 'NIGHT_ACTIONS':
        if (a.type === 'night' && !a.done && S.ui.unveiled[v.phaseId]) { const r = commitReady(a); parts.push(btn(`${glyph('moon')} ${esc(r.label)}`, 'commit', a.death ? 'btn-blood' : 'btn-solid', !r.ok)); }
        break;
      default: break;
    }
  }
  if (hostNext) parts.unshift(`<span class="mobile-only host-slot" data-key="hostslot">${hostNext}</span>`);
  if (!parts.length) return '';
  return `<div class="dock" data-key="dock">${parts.join('')}</div>`;
}

function commitReady(a) {
  if (a.death) {
    const picks = S.sel.death ?? a.death.proposals[V().me.id] ?? [];
    return { ok: true, label: picks.length ? `Confirm ${picks.map((id) => player(id)?.name).join(' + ')}` : 'Confirm: pass' };
  }
  const s = a.schema;
  if (!s || s.blocked || s.kind === 'chat') return { ok: true, label: 'Go to sleep' };
  const sel = S.sel.uses ?? [];
  if (!sel.length) return { ok: true, label: s.role.id === 'MIMIC' || s.role.id === 'DOUBLE_AGENT' ? 'Skip (not advised)' : 'Pass & sleep' };
  if (s.options && sel.some((u) => !u.option)) return { ok: false, label: 'Choose an option' };
  return { ok: true, label: 'Commit & sleep' };
}

// ── Actions ────────────────────────────────────────────────────────────────
const picked = (el, kill = false) => {
  const on = el.getAttribute('aria-pressed') !== 'true';
  sound.play(on ? 'pick' : 'unpick');
  haptic(on ? 10 : 5);
  if (on) burstAt(el, { colors: kill ? ['#e2585e', '#b3242d', '#ece5d5'] : ['#ece5d5', '#bdb4a4'], count: 12, power: 2.6 });
};

const ACT = {
  async create() {
    const name = (S.drafts.createName ?? '').trim();
    if (!name) return toast('Enter your name first.', 'err');
    S.pending = true; render();
    try {
      const r = await api('/api/rooms', { name, moderated: S.ui.moderated });
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
      const r = await api(`/api/rooms/${S.code}/join`, { name });
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
  async recover() {
    try {
      const r = await api(`/api/rooms/${S.code}/recover`, { recoveryCode: S.drafts.recCode });
      saveSession(r.code, r);
      S.token = r.token; S.pid = r.playerId; S.ui.recover = false;
      connect();
    } catch (e) { toast(e.message, 'err'); }
  },
  leave() {
    if (!confirm('Forget this seat on this device? You can only get it back with a recovery code from the host.')) return;
    clearSession(S.code); disconnect(); S.token = null; go('/');
  },
  back() { if (history.length > 1) history.back(); else go('/'); },
  sheet(el) { const id = el.dataset.id; S.ui.sheet = id && S.ui.sheet !== id ? id : null; if (S.ui.sheet) sound.play('whoosh'); render(); },
  seatSheet(el) { S.ui.sheet = `seat:${el.dataset.id}`; render(); },
  sound() { sound.toggle(); render(); },
  copy(el) { navigator.clipboard?.writeText(el.dataset.text).then(() => toast('Invite link copied'), () => toast(el.dataset.text)); burstAt(el); },
  share(el) {
    if (navigator.share) navigator.share({ title: 'Dead Set', text: 'Take a seat at my Dead Set table', url: el.dataset.text }).catch(() => {});
    else ACT.copy(el);
  },
  ready(el) { if (!V().me.ready) burstAt(el); send('lobby.ready', { ready: !V().me.ready }); },
  async start() { await send('host.start'); },
  preset(el) { send('host.settings', { preset: el.dataset.id }); },
  rulesMode(el) { send('host.settings', { rules: { mode: el.dataset.mode } }); },
  ruleCount(el) { send('host.settings', { rules: { count: Number(el.dataset.n) } }); },
  scenMode(el) { send('host.settings', { scenario: { mode: el.dataset.mode } }); },
  transport(el) { send('host.settings', { transport: el.dataset.mode }); },
  seat(el) { send('host.seat', { playerId: el.dataset.pid, dir: Number(el.dataset.dir) }); },
  kick(el) { if (confirm(`Remove ${player(el.dataset.pid)?.name} from the table?`)) { S.ui.sheet = null; send('host.kick', { playerId: el.dataset.pid }); } },
  advance(el) { S.ui.sheet = null; send('host.advance', { skipAll: !!el.dataset.skip }); },
  extend() { send('host.extend', { seconds: 30 }); },
  end() { if (confirm('End the match now? It will be recorded as abandoned — no faction wins.')) send('host.end'); },
  rematch() { S.ui.sheet = null; send('host.rematch'); },
  claim() { send('host.claim'); },
  issueRecovery() { const id = S.drafts.recPick || V().players.find((p) => p.id !== V().me?.id)?.id; if (id) send('host.recovery', { playerId: id }); },
  flip(el) {
    const k = el.dataset.key;
    if (k === 'sheet') return;
    S.ui.flipped[k] = !S.ui.flipped[k];
    if (S.ui.flipped[k]) { sound.play('reveal'); haptic(12); }
    render();
  },
  ack(el) { burstAt(el); send('role.ack'); },
  unveil() { S.ui.unveiled[V().phaseId] = true; sound.play('whoosh'); render(); },
  veil() { S.ui.unveiled[V().phaseId] = false; render(); },
  async immunity() { await send('day.immunity'); },
  shoot(el) { picked(el, true); const cur = V().action.abilities.find((x) => x.kind === 'shoot')?.choice; send('day.shoot', { target: cur === el.dataset.id ? null : el.dataset.id }); },
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
  pickSwap(el) { picked(el); S.sel.swap = S.sel.swap === el.dataset.id ? null : el.dataset.id; render(); },
  swap(el) { sound.play('sleep'); send('dream.swap', { target: el.dataset.none ? null : S.sel.swap }); },
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
  pickUseOption(el) { sound.play('pick'); const sel = [...(S.sel.uses ?? [])]; sel[Number(el.dataset.i)] = { ...sel[Number(el.dataset.i)], option: el.dataset.id }; S.sel.uses = sel; render(); },
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
    if (ok) { sound.play('sleep'); haptic(15); }
  },
  reopen() { send('night.reopen'); },
  chatTab(el) { S.ui.chat = el.dataset.id; render(); },
  tab(el) { S.ui.tab = el.dataset.id; render(); },
  momentNext() { nextMoment(); },
};

const QUIET = new Set(['pickNominate', 'pickVote', 'pickRetaliate', 'pickSwap', 'pickTarget', 'pickOption', 'pickNightmare', 'pickConspire', 'pickDeath', 'shoot', 'sound', 'pickUseOption', 'momentNext']);
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (link && link.origin === location.origin && !e.metaKey && !e.ctrlKey) { e.preventDefault(); go(link.pathname); return; }
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type !== 'checkbox')) return;
  if (el.tagName === 'INPUT') { ACT[el.dataset.act]?.(el); return; }
  e.preventDefault();
  if (el.disabled) return;
  if (!QUIET.has(el.dataset.act)) { sound.play('tap'); haptic(6); }
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
  if (!el || el.disabled) return;
  e.preventDefault();
  cancelHold();
  const key = el.dataset.key.replace(/^hold-/, '');
  S.ui.holding = key;
  el.classList.add('holding');
  haptic(8);
  holdTimer = setTimeout(() => {
    holdTimer = null; S.ui.holding = null; el.classList.remove('holding');
    haptic([20, 30, 40]); sound.play('stamp'); burstAt(el);
    ACT[el.dataset.hold]?.(el);
  }, calm.matches ? 450 : 750);
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
    if (el.dataset.draft === 'joinCode') { v = v.toUpperCase().replace(/[^A-Z0-9]/g, ''); el.value = v; }
    S.drafts[el.dataset.draft] = v;
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
boot();
