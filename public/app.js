// Dead Set client. Renders whatever filtered view the server sends; never
// decides outcomes, never holds anyone else's secrets.
import { glyph, dreamGlyph } from './icons.js';
import { qrSvg } from './qr.js';
import { renderGuide } from './guide.js';

const app = document.getElementById('app');
const S = {
  route: null, code: null, token: null, pid: null,
  view: null, conn: 'idle', es: null, content: null,
  toast: null, pending: false, drafts: {}, sel: {}, selPhase: null,
  ui: { drawer: false, unveiled: {}, flipped: {}, chat: null, recover: false, moderated: false },
};

// ── Utilities ──────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
const roman = (n) => ROMAN[n] ?? String(n);
const seatNo = (s) => String(s + 1).padStart(2, '0');
const V = () => S.view;
const player = (id) => V()?.players.find((p) => p.id === id);
const pname = (id) => esc(player(id)?.name ?? 'Someone');
const isNight = (phase) => phase === 'NIGHT_0_REVEAL' || phase === 'NIGHT_DREAM_SWAP' || phase === 'NIGHT_ACTIONS';
const sessionKey = (code) => `deadset:${code}`;
const saveSession = (code, data) => localStorage.setItem(sessionKey(code), JSON.stringify(data));
const loadSession = (code) => { try { return JSON.parse(localStorage.getItem(sessionKey(code))); } catch { return null; } };
const clearSession = (code) => localStorage.removeItem(sessionKey(code));
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
let clockSkew = 0;

function toast(text, kind = 'ok') {
  S.toast = { text, kind, at: Date.now() };
  render();
  setTimeout(() => { if (S.toast && Date.now() - S.toast.at >= 3200) { S.toast = null; render(); } }, 3300);
}

async function api(path, body) {
  const res = await fetch(path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status, code: data.code });
  return data;
}

async function send(type, payload = {}, { quiet = false } = {}) {
  if (!S.token) return;
  S.pending = true; render();
  try {
    await api(`/api/rooms/${S.code}/cmd`, { t: S.token, type, payload, phaseId: V()?.phaseId, key: uid() });
  } catch (e) {
    if (!quiet) toast(e.message, 'err');
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

function go(path) {
  history.pushState({}, '', path);
  boot();
}
window.addEventListener('popstate', boot);

function disconnect() {
  S.es?.close();
  S.es = null;
  S.view = null;
  S.conn = 'idle';
}

function boot() {
  S.route = parseRoute();
  const r = S.route;
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
  if (r.name === 'guide' && !S.content) loadContent();
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
    if (S.selPhase !== v.phaseId) { S.sel = {}; S.selPhase = v.phaseId; }
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

// ── Render core (preserves focus, drafts and scroll) ───────────────────────
function render() {
  const active = document.activeElement;
  const keep = active?.dataset?.keep;
  const selStart = active?.selectionStart; const selEnd = active?.selectionEnd;
  const scrolls = {};
  document.querySelectorAll('[data-scroll]').forEach((el) => { scrolls[el.dataset.scroll] = { top: el.scrollTop, bottom: el.scrollHeight - el.scrollTop - el.clientHeight < 24 }; });

  const v = V();
  document.body.dataset.time = v && (isNight(v.phase)) ? 'night' : 'day';
  app.innerHTML = view();

  if (keep) {
    const el = app.querySelector(`[data-keep="${keep}"]`);
    if (el) { el.focus({ preventScroll: true }); try { if (selStart != null) el.setSelectionRange(selStart, selEnd); } catch { /* not text */ } }
  }
  app.querySelectorAll('[data-scroll]').forEach((el) => {
    const s = scrolls[el.dataset.scroll];
    if (!s || s.bottom) el.scrollTop = el.scrollHeight; else el.scrollTop = s.top;
  });
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
  if (S.conn === 'lost' && S.code) html += '<div class="conn" role="status">Connection lost — reconnecting. Your choices are safe on the server.</div>';
  if (S.toast) html += `<div class="toast ${S.toast.kind === 'err' ? 'err' : ''}" role="status">${esc(S.toast.text)}</div>`;
  return html;
}

// ── Timer ──────────────────────────────────────────────────────────────────
function tickClock() {
  const v = V();
  const now = Date.now() + clockSkew;
  document.querySelectorAll('[data-fuse]').forEach((el) => {
    const bar = el.querySelector('i');
    if (!v?.deadline) { el.hidden = true; return; }
    el.hidden = false;
    const total = Math.max(1, v.deadline - (v.openedAt ?? (v.deadline - 60000)));
    const left = Math.max(0, v.deadline - now);
    const span = el.dataset.span ? Number(el.dataset.span) : null;
    const frac = Math.min(1, left / (span || total));
    bar.style.width = `${frac * 100}%`;
    el.classList.toggle('low', left < 10000);
  });
  document.querySelectorAll('[data-clock]').forEach((el) => {
    if (!v?.deadline) { el.textContent = ''; return; }
    const left = Math.max(0, Math.ceil((v.deadline - now) / 1000));
    el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    el.classList.toggle('low', left <= 10);
  });
}
setInterval(tickClock, 250);
const fuseSpan = new Map();
function fuse() {
  const v = V();
  if (!v?.deadline) return '<div class="fuse" data-fuse hidden><i></i></div>';
  // remember the full length of this window the first time we see it
  if (!fuseSpan.has(v.phaseId)) fuseSpan.set(v.phaseId, Math.max(1000, v.deadline - (Date.now() + clockSkew)));
  return `<div class="fuse" data-fuse data-span="${fuseSpan.get(v.phaseId)}"><i></i></div>`;
}

// ── Labels ─────────────────────────────────────────────────────────────────
function phaseWord(v) {
  if (v.phase === 'LOBBY') return { word: 'Lobby', num: '' };
  if (v.phase === 'ENDED') return { word: 'The End', num: '' };
  if (v.phase === 'NIGHT_0_REVEAL') return { word: 'Night', num: '0' };
  if (isNight(v.phase) || v.phase === 'NIGHT_RESOLVING') return { word: 'Night', num: roman(v.nightNumber) };
  return { word: 'Day', num: roman(v.dayNumber) };
}
const STEP = {
  LOBBY: 'Gathering at the table', NIGHT_0_REVEAL: 'Private role reveal', DAY_PREP: 'Morning · abilities', DAY_DISCUSSION: 'Discussion · nominations',
  DAY_DEFENSE: 'Defence', DAY_VOTING: 'Secret ballot', DAY_RESOLVING: 'A final act', NIGHT_DREAM_SWAP: 'Dreams are drawn', NIGHT_ACTIONS: 'Night actions', ENDED: 'Match over',
};
const ALIGN = { DEATH: 'Death', NON_DEATH: 'Non-Death', INDEPENDENT: 'Independent' };

// ── Screens: home / join / guide ───────────────────────────────────────────
function homeScreen() {
  const d = S.drafts;
  return `<main class="main" style="max-width:920px">
    <header class="hero">
      <a class="wordmark" href="/" data-link>Dead<i>Set</i><span class="seal"></span></a>
      <h1>Dead<br><i>Set.</i></h1>
      <p class="lede">A party game of hidden roles, bad dreams and worse alibis. Every player on their own phone; nobody has to sit out as narrator.</p>
      <div class="facts"><span>5 – 13 players</span><span>One phone each</span><span>20 – 60 min</span><span><a href="/guide" data-link>How to play →</a></span></div>
    </header>
    <div class="split">
      <section>
        <div class="rule"><span class="idx">01</span>Open a table</div>
        <label class="field"><span>Your name</span><input class="input" maxlength="20" autocomplete="nickname" placeholder="e.g. Morgan" data-keep="createName" data-draft="createName" value="${esc(d.createName ?? '')}"></label>
        <label class="check"><input type="checkbox" data-act="toggleModerated" ${S.ui.moderated ? 'checked' : ''}><span><b>I'll moderate and not play</b><small>Trusted-moderator mode: you see every secret, so you cannot hold a seat. Everyone is told.</small></span></label>
        <button class="btn btn-solid btn-wide" data-act="create" ${S.pending ? 'disabled' : ''}>Create game</button>
      </section>
      <section>
        <div class="rule"><span class="idx">02</span>Take a seat</div>
        <label class="field"><span>Room code</span><input class="input input-code" maxlength="6" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="······" data-keep="joinCode" data-draft="joinCode" value="${esc(d.joinCode ?? '')}"></label>
        <button class="btn btn-wide" data-act="gotoRoom">Continue</button>
        <p class="small muted">Or scan the QR code on the host's screen.</p>
      </section>
    </div>
  </main>`;
}

function joinScreen() {
  const d = S.drafts;
  return `<main class="main">
    <a class="wordmark" href="/" data-link>Dead<i>Set</i><span class="seal"></span></a>
    <header class="phase-head"><span class="kicker">Room <span class="mono">${esc(S.code)}</span></span><h1>Take a<br><i>seat.</i></h1></header>
    ${S.ui.recover ? `<section class="stack">
        <div class="rule">Recover your seat</div>
        <p class="muted">Lost your phone or switched browsers? Ask the host for a one-time recovery code. Your old device will be signed out.</p>
        <label class="field"><span>Recovery code</span><input class="input input-code" maxlength="8" data-keep="recCode" data-draft="recCode" value="${esc(d.recCode ?? '')}" autocomplete="off"></label>
        <button class="btn btn-solid btn-wide" data-act="recover">Recover seat</button>
        <button class="btn btn-ghost" data-act="toggleRecover">Join as a new player instead</button>
      </section>` : `<section class="stack">
        <label class="field"><span>Your name</span><input class="input" maxlength="20" autocomplete="nickname" placeholder="Name shown at the table" data-keep="joinName" data-draft="joinName" value="${esc(d.joinName ?? '')}"></label>
        <button class="btn btn-solid btn-wide" data-act="join" ${S.pending ? 'disabled' : ''}>Join the table</button>
        <button class="btn btn-ghost" data-act="toggleRecover">I already have a seat in this game</button>
      </section>`}
  </main>`;
}

function loadingScreen() {
  return `<main class="main"><a class="wordmark" href="/" data-link>Dead<i>Set</i><span class="seal"></span></a><p class="muted">Finding your seat…</p></main>`;
}
function goneScreen() {
  return `<main class="main"><a class="wordmark" href="/" data-link>Dead<i>Set</i><span class="seal"></span></a>
    <header class="phase-head"><h1>No such<br><i>table.</i></h1><p class="muted">Room ${esc(S.code)} doesn't exist, or it has been cleared away.</p></header>
    <a class="btn" href="/" data-link>Back to start</a></main>`;
}

function guideScreen() {
  return `<main class="main" style="max-width:820px">
    <div class="row between"><a class="wordmark" href="/" data-link>Dead<i>Set</i><span class="seal"></span></a><button class="btn btn-sm" data-act="back">Back</button></div>
    ${renderGuide(S.content, { glyph, dreamGlyph, esc })}
  </main>`;
}

// ── Room shell ─────────────────────────────────────────────────────────────
function roomScreen() {
  const v = V();
  const pw = phaseWord(v);
  const me = v.me;
  const aliveCount = v.players.filter((p) => p.alive).length;
  const side = `<aside class="side" aria-label="Match">
      <a class="wordmark" href="/" data-link>Dead<i>Set</i><span class="seal"></span></a>
      <div class="count">
        <div><b>${esc(pw.word)} ${esc(pw.num)}</b><span>${esc(STEP[v.phase] ?? '')}</span></div>
        <div><b>${aliveCount}<span class="muted" style="font-size:18px">/${v.players.length}</span></b><span>Alive</span></div>
      </div>
      <div class="stack" style="gap:8px">
        <div class="row between"><span class="kicker">Room <span class="mono">${esc(v.code)}</span></span><span class="clock" data-clock></span></div>
        ${fuse()}
      </div>
      ${hostBox()}
      <div class="timeline" data-scroll="side-tl"><div class="rule">Public record</div>${feed(v.log)}</div>
    </aside>`;
  const top = `<header class="topbar">
      <div class="phase-mini"><strong>${esc(pw.word)} ${esc(pw.num)}</strong><span>${esc(STEP[v.phase] ?? '')} · ${aliveCount}/${v.players.length} alive</span></div>
      <span class="clock" data-clock></span>
      <button class="btn btn-ghost icon-btn" data-act="drawer" aria-label="Open match record">${glyph('menu')}</button>
      ${fuse()}
    </header>`;
  const drawer = S.ui.drawer ? `<div class="drawer-scrim" data-act="drawer"></div>
    <div class="drawer" role="dialog" aria-label="Match record">
      <div class="row between"><span class="kicker">Room <span class="mono">${esc(v.code)}</span></span><button class="btn btn-ghost icon-btn" data-act="drawer" aria-label="Close">${glyph('close')}</button></div>
      <div class="scroll">${hostBox()}<div><div class="rule">Public record</div>${feed(v.log)}</div>
      <button class="btn btn-ghost" data-act="leave">${glyph('out')} Leave this device</button></div>
    </div>` : '';
  return `<div class="shell">${side}<div>${top}<main class="main" id="main">${mainFor(v, me)}</main></div></div>${dock(v)}${drawer}`;
}

function hostBox() {
  const v = V();
  if (!v.host) {
    if (v.hostAway) {
      return `<div class="host-box"><div class="rule">Host away</div><p class="small muted">The host has been gone for over a minute. A majority of connected players can hand the public controls to someone else.</p>
        <button class="btn btn-sm" data-act="claim" ${v.claimVoted ? 'disabled' : ''}>${v.claimVoted ? 'Vote cast' : 'Vote to take over'}</button></div>`;
    }
    return '';
  }
  const h = v.host;
  const rec = `<details class="more"><summary>Recover a player's seat</summary><div>
      <p class="small muted">If someone's phone dies, issue a one-time code. They open the room link, choose "I already have a seat" and enter it. Their old device is signed out.</p>
      <select class="input" data-keep="recPick" data-draft="recPick">${v.players.filter((p) => p.id !== v.me?.id).map((p) => `<option value="${p.id}" ${S.drafts.recPick === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
      <button class="btn btn-sm" data-act="issueRecovery">Issue code</button>
      ${h.recovery ? `<p>Code for <b>${pname(h.recovery.playerId)}</b>: <span class="mono" style="font-size:20px;letter-spacing:.12em">${esc(h.recovery.code)}</span><br><span class="small muted">Valid 15 minutes, once.</span></p>` : ''}
    </div></details>`;
  if (v.phase === 'LOBBY') return `<div class="host-box"><div class="rule">Host</div><p class="small muted">You see only what everyone sees. Set up the table, then start when all are ready.</p>${rec}</div>`;
  return `<div class="host-box"><div class="rule">Host controls</div>
    ${h.advance ? `<button class="btn btn-solid" data-act="advance" ${S.pending ? 'disabled' : ''}>${esc(h.advance)}</button>` : ''}
    ${h.skipAll ? `<button class="btn btn-sm" data-act="advance" data-skip="1">${esc(h.skipAll)}</button>` : ''}
    <div class="row">${h.extend ? '<button class="btn btn-sm" data-act="extend">+30 s</button>' : ''}
    ${h.end ? '<button class="btn btn-sm btn-ghost" data-act="end">End match</button>' : ''}
    ${h.rematch ? '<button class="btn btn-sm btn-solid" data-act="rematch">New match, same table</button>' : ''}</div>
    <p class="small muted">${h.advance ? 'Advancing closes the window: anything not submitted becomes a pass or abstention.' : ''}</p>
    ${rec}
  </div>`;
}

function feed(log, cls = '') {
  if (!log?.length) return '<p class="small muted">Nothing yet.</p>';
  return `<ul class="feed ${cls}">${log.map((l) => `<li class="k-${esc(l.kind)}"><span class="at">${esc(l.at)}</span><span class="txt">${esc(l.text)}</span></li>`).join('')}</ul>`;
}

function head(v, extra = '') {
  const pw = phaseWord(v);
  return `<header class="phase-head">
    <span class="kicker">${esc(STEP[v.phase] ?? '')}${v.doomsday && v.phase !== 'LOBBY' ? ` · Doomsday after Day ${roman(v.doomsday)}` : ''}</span>
    <h1>${pw.word === 'Night' ? `<i>${pw.word}</i>` : esc(pw.word)}${pw.num ? `<span class="num">${esc(pw.num)}</span>` : ''}</h1>
    ${v.scenario && v.phase !== 'LOBBY' ? `<p class="scenario">${esc(`We are ${v.scenario.who}, in ${v.scenario.where}, trying to ${v.scenario.why}.`)}</p>` : ''}
    ${extra}
  </header>`;
}

function rulesStrip(v) {
  if (!v.activeRules?.length) return '';
  return `<details class="more"><summary>Rules in force · ${v.activeRules.map((r) => esc(r.name)).join(' · ')}</summary><div>
    ${v.activeRules.map((r) => `<div><b>${esc(r.name)}</b><p class="small muted">${esc(r.text)} ${esc(r.enforcement)}</p></div>`).join('')}
  </div></details>`;
}

function mainFor(v, me) {
  if (me?.moderator) return moderatorMain(v);
  switch (v.phase) {
    case 'LOBBY': return lobbyMain(v, me);
    case 'NIGHT_0_REVEAL': return revealMain(v, me);
    case 'ENDED': return endMain(v, me);
    default:
      return isNight(v.phase) ? nightMain(v, me) : dayMain(v, me);
  }
}

// ── Lobby ──────────────────────────────────────────────────────────────────
function lobbyMain(v, me) {
  const url = `${location.origin}/r/${v.code}`;
  const isHost = !!v.host;
  const report = v.setup;
  return `${head(v, `<p class="step"><b>${v.players.length}</b> seated · ${v.progress.done}/${v.progress.total} ready${v.players.length < 5 ? ' · need at least 5' : ''}</p>`)}
    ${v.moderated ? `<div class="banner blood">${glyph('mentalist')}<div><b>Trusted moderator: ${esc(v.moderatorName ?? '')}</b><p>This room has a non-playing moderator who can see every role, dream and vote. Everyone else sees only their own secrets.</p></div></div>` : ''}
    <section>
      <div class="rule"><span class="idx">01</span>Invite</div>
      <div class="code-block">
        <div class="stack" style="gap:10px"><span class="code-big">${esc(v.code)}</span>
          <div class="row"><button class="btn btn-sm" data-act="copy" data-text="${esc(url)}">Copy link</button>
          <a class="btn btn-sm btn-ghost" href="/board/${esc(v.code)}" target="_blank" rel="noopener">Public board ↗</a></div>
        </div>
        ${qrSvg(url)}
      </div>
    </section>
    <section>
      <div class="rule"><span class="idx">02</span>The table · seating order</div>
      ${lobbyRoster(v, me, isHost)}
      ${isHost ? '<p class="small muted" style="margin-top:10px">Seating matters for Fog of War and Sleepwalking: arrange it to match where people physically sit.</p>' : ''}
    </section>
    <section>
      <div class="rule"><span class="idx">03</span>Setup</div>
      ${isHost ? setupForm(v) : setupSummary(v)}
    </section>
    <section class="stack">
      ${report.publicDeck ? deckPreview(report.publicDeck) : ''}
      ${report.errors.map((e) => `<div class="banner blood">${glyph('dagger')}<div><p>${esc(e)}</p></div></div>`).join('')}
      ${report.warnings.map((w) => `<div class="banner">${glyph('scroll')}<div><p>${esc(w)}</p></div></div>`).join('')}
    </section>`;
}

function lobbyRoster(v, me, isHost) {
  const moderator = me?.moderator;
  return `<ul class="ledger">${v.players.map((p, i) => `<li class="${p.id === me?.id ? 'me' : ''}">
      <span class="seat">${seatNo(p.seat)}</span>
      <span class="who"><b>${esc(p.name)}</b><small><span class="dot ${p.connected ? 'on' : ''}"></span> ${p.connected ? 'here' : 'offline'}${p.id === v.hostId ? ' · host' : ''}</small></span>
      <span class="tags">
        ${p.ready ? '<span class="tag solid">Ready</span>' : '<span class="tag dim">Not ready</span>'}
        ${moderator ? `<select class="input" style="min-height:36px;width:150px;font-size:14px" data-act-change="assign" data-pid="${p.id}"><option value="">Random</option>${v.allRoles.map((r) => `<option value="${r.id}" ${v.manualRoles?.[p.id] === r.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select>` : ''}
        ${isHost ? `<button class="btn btn-ghost icon-btn" title="Move up" aria-label="Move ${esc(p.name)} up" data-act="seat" data-pid="${p.id}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>${glyph('up')}</button>
          <button class="btn btn-ghost icon-btn" title="Move down" aria-label="Move ${esc(p.name)} down" data-act="seat" data-pid="${p.id}" data-dir="1" ${i === v.players.length - 1 ? 'disabled' : ''}>${glyph('down')}</button>
          ${p.id !== me?.id ? `<button class="btn btn-ghost icon-btn" title="Remove" aria-label="Remove ${esc(p.name)}" data-act="kick" data-pid="${p.id}">${glyph('close')}</button>` : ''}` : ''}
      </span></li>`).join('')}</ul>`;
}

function deckPreview(deck) {
  const names = S.content?.roles ? Object.fromEntries(S.content.roles.map((r) => [r.id, r.name])) : {};
  const nm = (id) => esc(names[id] ?? id.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()));
  if (deck.exact) {
    return `<div class="panel tight"><span class="kicker">Exact deck</span><div class="pill-row">${Object.entries(deck.exact).map(([id, n]) => `<span class="tag">${nm(id)} × ${n}</span>`).join('')}</div></div>`;
  }
  return `<div class="panel tight"><span class="kicker">The deck</span><div class="pill-row">
    ${Object.entries(deck.core).filter(([, n]) => n > 0).map(([id, n]) => `<span class="tag ${id === 'DEATH' ? 'blood' : ''}">${nm(id)} × ${n}</span>`).join('')}
    ${deck.extended ? `<span class="tag solid">${deck.extended} extended, drawn secretly</span>` : ''}
  </div>${deck.extended ? `<p class="small muted">Extended pool: ${deck.pool.map(nm).join(', ')}.</p>` : ''}</div>`;
}

function setupSummary(v) {
  const s = v.settings;
  const preset = v.presets.find((p) => p.id === s.preset);
  const ruleNames = (ids) => ids.map((id) => esc(S.content?.rules.find((r) => r.id === id)?.name ?? id)).join(', ');
  return `<div class="stack">
    <div class="preset" aria-pressed="true" style="cursor:default"><b>${esc(preset.name)}</b><small>${esc(preset.blurb)}</small></div>
    <p class="muted small">Rule cards: ${s.rules.mode === 'random' ? `${s.rules.count} drawn at random when the match starts` : ruleNames(s.rules.selected) || 'none'} ·
      Scenario: ${s.scenario.mode === 'random' ? 'random' : esc(`${s.scenario.who} / ${s.scenario.where} / ${s.scenario.why}`)} ·
      Play: ${s.transport === 'remote' ? 'remote, with in-app table chat' : 'in person'} · Dreams: ${s.dreams ? 'on' : 'off'}</p>
    <p class="muted small">Waiting for the host to start. Tap <b>Ready</b> when you have read the setup.</p>
  </div>`;
}

function setupForm(v) {
  const s = v.settings;
  const preset = v.presets.find((p) => p.id === s.preset);
  const allRules = S.content?.rules ?? [];
  const rules = allRules.filter((r) => preset.ruleIds.includes(r.id));
  const ext = (S.content?.roles ?? []).filter((r) => r.set !== 'core');
  const t = s.timers;
  const timer = (key, label, hint) => `<label class="field"><span>${label}</span><select class="input" data-set="timers.${key}">
      ${[0, 15, 30, 45, 60, 90, 120, 180, 300, 600].map((n) => `<option value="${n}" ${t[key] === n ? 'selected' : ''}>${n === 0 ? 'Untimed (host advances)' : n < 60 ? `${n} seconds` : `${n / 60} min`}</option>`).join('')}
      ${[0, 15, 30, 45, 60, 90, 120, 180, 300, 600].includes(t[key]) ? '' : `<option selected value="${t[key]}">${t[key]} s</option>`}
    </select>${hint ? `<small class="muted small">${hint}</small>` : ''}</label>`;
  return `<div class="stack" style="gap:28px">
    <div class="preset-list">${v.presets.map((p) => `<button class="preset" data-act="preset" data-id="${p.id}" aria-pressed="${s.preset === p.id}"><b>${esc(p.name)}${p.recommended ? ' <span class="tag" style="vertical-align:4px">Recommended</span>' : ''}</b><small>${esc(p.blurb)} ${p.min}–${p.max} players.</small></button>`).join('')}</div>

    ${preset.custom ? `<div class="stack">
      <span class="kicker">Custom pool</span>
      <div class="rule-grid">${ext.map((r) => `<label class="check"><input type="checkbox" data-act-change="pool" data-id="${r.id}" ${s.extendedPool.includes(r.id) ? 'checked' : ''}><span><b>${esc(r.name)} <span class="muted small">${r.set === 'full' ? 'Full Deck' : 'Standard'}</span></b><small>${esc(r.summary)}</small></span></label>`).join('')}</div>
      <label class="check"><input type="checkbox" data-set-bool="dreams" ${s.dreams ? 'checked' : ''}><span><b>Dreams</b><small>Every living player draws a Dream card each night.</small></span></label>
      <label class="check"><input type="checkbox" data-set-bool="doomsday" ${s.doomsday ? 'checked' : ''}><span><b>Doomsday Clock</b><small>Death wins if nobody has won when the final Day closes.</small></span></label>
      <label class="field"><span>Exact deck (optional — overrides scaling)</span><textarea class="input" data-keep="customDeck" data-set-text="customDeck" placeholder="Death x2&#10;Guardian&#10;Mentalist&#10;Psycho&#10;Whore">${esc(s.customDeck)}</textarea><small class="muted small">One role per line, "x2" for copies. Must match the number of seated players.</small></label>
    </div>` : ''}
    ${preset.id === 'classic' ? `<label class="check"><input type="checkbox" data-set-bool="dreams" ${s.dreams ? 'checked' : ''}><span><b>Simplified Dreams</b><small>Off by default for teaching games.</small></span></label>` : ''}
    ${preset.id === 'doomsday' || (preset.custom && s.doomsday) ? `<label class="field"><span>Doomsday after Day</span><select class="input" data-set="doomsdayDays">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<option ${s.doomsdayDays === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>` : ''}

    <div class="stack">
      <span class="kicker">Rule cards</span>
      ${preset.rulesMax === 0 ? '' : `<div class="seg" role="group"><button data-act="rulesMode" data-mode="random" aria-pressed="${s.rules.mode === 'random'}">Draw at random</button><button data-act="rulesMode" data-mode="manual" aria-pressed="${s.rules.mode === 'manual'}">Choose</button></div>`}
      ${s.rules.mode === 'random' ? `<label class="field"><span>How many</span><select class="input" data-set="rules.count">${range(preset.rulesMin, preset.rulesMax).map((n) => `<option ${s.rules.count === n ? 'selected' : ''}>${n}</option>`).join('')}</select><small class="muted small">Drawn secretly by the server when the match starts, then shown to everyone.</small></label>`
        : `<div class="rule-grid">${rules.map((r) => `<label class="check"><input type="checkbox" data-act-change="rule" data-id="${r.id}" ${s.rules.selected.includes(r.id) ? 'checked' : ''}><span><b>${esc(r.name)}</b><small>${esc(r.text)}</small></span></label>`).join('')}</div><small class="muted small">Choose ${preset.rulesMin}–${preset.rulesMax}.</small>`}
    </div>

    <div class="stack">
      <span class="kicker">Scenario — WHO / WHERE / WHY</span>
      <div class="seg" role="group"><button data-act="scenMode" data-mode="random" aria-pressed="${s.scenario.mode === 'random'}">Random</button><button data-act="scenMode" data-mode="manual" aria-pressed="${s.scenario.mode === 'manual'}">Write our own</button></div>
      ${s.scenario.mode === 'manual' ? ['who', 'where', 'why'].map((k) => `<label class="field"><span>${k.toUpperCase()}</span><input class="input" maxlength="80" data-keep="scen-${k}" data-set-text="scenario.${k}" value="${esc(s.scenario[k])}" placeholder="${{ who: 'Lost Tourists', where: 'a Haunted Mansion', why: 'Solve a Murder' }[k]}"></label>`).join('') : '<p class="small muted">Pure storytelling: it never changes the rules.</p>'}
    </div>

    <details class="more"><summary>Table & timers</summary><div>
      <div class="field"><span>How are you playing?</span><div class="seg" role="group"><button data-act="transport" data-mode="in-person" aria-pressed="${s.transport === 'in-person'}">Same room</button><button data-act="transport" data-mode="remote" aria-pressed="${s.transport === 'remote'}">Remote · table chat</button></div></div>
      <div class="grid2">
        ${timer('morning', 'Morning window', 'Diplomat / Vigilante')}${timer('discussion', 'Discussion')}
        ${timer('defense', 'Defence, per nominee')}${timer('voting', 'Voting')}
        ${timer('swap', 'Dream swap window')}${timer('night', 'Night actions')}
        ${timer('retaliation', 'Equal Exchange choice')}
      </div>
      <label class="check"><input type="checkbox" data-set-bool="revealOnDeath" ${s.revealOnDeath ? 'checked' : ''}><span><b>Reveal roles on death</b><small>Off by default. Never with the Hidden Roles card.</small></span></label>
      <label class="check"><input type="checkbox" data-set-bool="endReveal" ${s.endReveal ? 'checked' : ''}><span><b>Reveal every role when the match ends</b></span></label>
      <label class="check"><input type="checkbox" data-set-bool="selfNomination" ${s.selfNomination ? 'checked' : ''}><span><b>Allow self-nomination</b><small>House rule.</small></span></label>
      <label class="check"><input type="checkbox" data-set-bool="selfVote" ${s.selfVote ? 'checked' : ''}><span><b>Nominees may vote for themselves</b></span></label>
    </div></details>
  </div>`;
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// ── Role card ──────────────────────────────────────────────────────────────
function roleCardHtml(role, { mini = false, align = null, flipKey = null } = {}) {
  if (!role) return '';
  const a = align ?? role.alignment;
  const card = `<article class="card ${mini ? 'mini' : 'tilt'} ${a === 'DEATH' ? 'death' : ''} ${flipKey ? 'flip-in' : ''}" ${mini ? '' : 'data-tilt'}>
    ${mini ? '' : `<div class="corner"><b>${esc(ALIGN[a])}</b><span>${esc(role.when)}</span></div>`}
    <div class="face">${glyph(role.glyph)}<div><h2>${esc(role.name)}</h2>${role.alias ? `<span class="small muted">also called ${esc(role.alias)}</span>` : ''}${mini ? `<p>${esc(role.summary)}</p>` : ''}</div>${mini ? '' : `<p>${esc(role.summary)}</p>`}</div>
    ${mini ? '' : `<div class="foot">${esc(ALIGN[a])} · ${esc(role.when)}</div>`}
  </article>`;
  return mini ? card : `<div class="card-stage">${card}</div>`;
}

function myRoleBlock(me, { flipKey = 'role', allowHide = false } = {}) {
  const shown = S.ui.flipped[flipKey];
  if (!shown) {
    return `<div class="card-stage"><button class="card back" data-act="flip" data-key="${flipKey}" aria-label="Turn over your role card"><span class="mono-gram">DS</span><span class="hint kicker">Tap to turn over</span></button></div>`;
  }
  return `${roleCardHtml(me.role, { align: me.alignment, flipKey })}
    <div class="stack">
      <p class="muted">${esc(me.role.detail)}</p>
      ${me.originalRole ? `<p class="small muted">You began as ${esc(me.originalRole.name)}.</p>` : ''}
      ${me.alignment === 'DEATH' && me.role.id !== 'DEATH' ? '<p class="blood small">You are Death-aligned.</p>' : ''}
      ${me.mimicPowerless ? '<p class="small muted">Your copy failed: you are a powerless Mimic.</p>' : ''}
      ${chargesLine(me)}
      ${teammates(me)}
      ${allowHide ? `<button class="btn btn-sm btn-ghost" data-act="flip" data-key="${flipKey}">${glyph('veil')} Hide card</button>` : ''}
    </div>`;
}

function chargesLine(me) {
  const entries = Object.entries(me.charges || {});
  if (!entries.length) return '';
  return `<p class="small muted">${entries.map(([, n]) => (n > 0 ? 'One use remaining.' : 'Your once-per-game power is spent.')).join(' ')}</p>`;
}

function teammates(me) {
  if (me.teammates) {
    return `<div class="panel tight seal"><span class="kicker blood">Your Death team</span>${me.teammates.length ? `<p>${me.teammates.map((t) => esc(t.name)).join(', ')}</p>` : '<p>You are alone. Every kill is your call.</p>'}</div>`;
  }
  if (me.joinsTeamNight) return `<div class="panel tight seal"><span class="kicker blood">Death team</span><p>You join the Death team room on Night ${roman(me.joinsTeamNight)}.</p></div>`;
  return '';
}

// ── Night 0 ────────────────────────────────────────────────────────────────
function revealMain(v, me) {
  return `${head(v, '<p class="step">Look only at your own screen. Nothing happens tonight except this.</p>')}
    ${myRoleBlock(me, { flipKey: 'role' })}
    ${me.acknowledged ? `<p class="muted">Waiting for the others · ${v.progress.done}/${v.progress.total} have seen their role.</p>` : ''}
    ${rulesStrip(v)}`;
}

// ── Day ────────────────────────────────────────────────────────────────────
function dayMain(v, me) {
  const d = v.day || {};
  let stage = '';
  const a = v.action;
  if (v.phase === 'DAY_PREP') stage = morningStage(v, me, a);
  if (v.phase === 'DAY_DISCUSSION') stage = discussionStage(v, me, a);
  if (v.phase === 'DAY_DEFENSE') stage = defenseStage(v, me, d);
  if (v.phase === 'DAY_VOTING') stage = votingStage(v, me, a);
  if (v.phase === 'DAY_RESOLVING') stage = resolvingStage(v, me, a);
  return `${head(v)}
    ${statusBanners(v, me)}
    ${rulesStrip(v)}
    ${stage}
    ${chatBlock(v)}
    <section><div class="rule">The table</div>${tableLedger(v, me)}</section>
    ${myCornerBlock(v, me)}`;
}

function statusBanners(v, me) {
  const out = [];
  if (!me.alive) out.push(`<div class="banner">${glyph('death')}<div><b>You are dead.</b><p>Watch in silence. Do not reveal what you knew. ${v.activeRules.some((r) => r.id === 'VENGEFUL_GHOSTS') ? 'Vengeful Ghosts lets you cast a ghost ballot each Day.' : ''}</p></div></div>`);
  if (me.statuses.includes('MUTE')) out.push(`<div class="banner blood">${glyph('psycho')}<div><b>You are MUTE today.</b><p>Do not speak during discussion or your defence. You may still nominate and vote.</p></div></div>`);
  if (me.statuses.includes('NO_VOTE')) out.push(`<div class="banner blood">${glyph('psycho')}<div><b>You have NO VOTE today.</b><p>You may speak, and can still be nominated, but your ballot is disabled.</p></div></div>`);
  if (me.revived) out.push(`<div class="banner">${glyph('necro')}<div><b>You walk on borrowed time.</b><p>Nothing can kill you until it runs out after Night ${roman(me.revived.expiresAfterNight)} — but the town can still sentence you.</p></div></div>`);
  const ids = v.activeRules.map((r) => r.id);
  if (me.alive && (v.phase === 'DAY_DISCUSSION' || v.phase === 'DAY_DEFENSE')) {
    if (ids.includes('CURSED_SILENCE')) out.push(`<div class="banner">${glyph('scroll')}<div><b>Cursed Silence</b><p>Speak only when someone addresses you directly.</p></div></div>`);
    if (ids.includes('FOG_OF_WAR')) {
      const seats = [...v.players].sort((x, y) => x.seat - y.seat);
      const n = seats.length; const l = seats[(me.seat - 1 + n) % n]; const r = seats[(me.seat + 1) % n];
      out.push(`<div class="banner">${glyph('scroll')}<div><b>Fog of War</b><p>You may talk directly only with ${esc(l.name)} and ${esc(r.name)}.</p></div></div>`);
    }
  }
  return out.join('');
}

function tableLedger(v, me, { votes = null } = {}) {
  return `<ul class="ledger">${v.players.map((p) => `<li class="${p.alive ? '' : 'dead'} ${p.id === me?.id ? 'me' : ''}">
    <span class="seat">${seatNo(p.seat)}</span>
    <span class="who"><b>${esc(p.name)}</b><small>${p.alive ? `<span class="dot ${p.connected ? 'on' : ''}"></span> ${p.connected ? 'here' : 'offline'}` : `† ${esc(p.diedAt ?? '')}`}${p.role ? ` · ${esc(p.role.name)}` : ''}</small></span>
    <span class="tags">${p.immune ? '<span class="tag solid">Immune</span>' : ''}${p.revived ? '<span class="tag">Revived</span>' : ''}${p.id === v.hostId ? '<span class="tag dim">Host</span>' : ''}${votes?.[p.id] ? `<span class="tag">${votes[p.id]}</span>` : ''}</span>
  </li>`).join('')}</ul>`;
}

function morningStage(v, me, a) {
  const news = v.log.filter((l) => ['dawn', 'death', 'revive', 'immunity'].includes(l.kind) && (l.text.includes(`Dawn of Day ${v.dayNumber}.`) || l.at === `Day ${v.dayNumber}` || (l.kind === 'revive' && l.at === `Night ${v.dayNumber - 1}`)));
  const mine = (v.private || []).filter((x) => (x.at === `Night ${v.dayNumber - 1}` || x.at === `Day ${v.dayNumber}`) && !['dreamdraw', 'surge', 'chat'].includes(x.kind));
  let abilities = '';
  for (const ab of a.abilities || []) {
    if (ab.kind === 'immunity') abilities += `<div class="panel"><span class="kicker">Diplomat · once per game</span><p>Declare immunity now and nobody can nominate you today. Everyone will see it.</p><button class="btn" data-act="immunity">Declare immunity</button></div>`;
    if (ab.kind === 'immune') abilities += '<div class="banner">' + glyph('diplomat') + '<div><b>You are immune today.</b></div></div>';
    if (ab.kind === 'shoot') {
      abilities += `<div class="panel seal"><span class="kicker blood">Vigilante · once per game</span><p>Pick someone to shoot when the morning window closes. Nobody will know it was you. You can change or cancel until then.</p>
        ${choiceList(ab.targets, { selected: ab.choice ? [ab.choice] : [], act: 'shoot', kill: true })}
        ${ab.choice ? '<button class="btn btn-ghost btn-sm" data-act="shoot" data-id="">Holster — cancel the shot</button>' : ''}</div>`;
    }
  }
  return `<section class="stack">
    <div class="rule">${v.dayNumber === 1 ? 'The first morning' : 'At dawn'}</div>
    ${news.length ? news.map((l) => `<div class="report ${l.kind === 'death' ? 'alarm' : ''}"><p>${esc(l.text)}</p></div>`).join('') : `<div class="report"><p>${v.dayNumber === 1 ? 'Nobody has died yet. Introduce yourselves — or don\'t.' : 'Nothing to report.'}</p></div>`}
    ${mine.length ? `<div class="rule">Only you know</div>${mine.map((x) => `<div class="report ${x.kind === 'alarm' ? 'alarm' : ''}"><span class="kicker">${esc(x.at)}</span><p>${esc(x.text)}</p></div>`).join('')}` : ''}
    ${abilities}
    <p class="small muted">${v.host ? 'When everyone has read the news, open discussion.' : 'The host will open discussion shortly.'}</p>
  </section>`;
}

function choiceList(ids, { selected = [], act, kill = false, disabled = false, votes = null, extra = '' } = {}) {
  return `<div class="choices" role="group">${ids.map((id) => {
    const p = player(id);
    const on = selected.includes(id);
    return `<button class="choice ${kill ? 'kill' : ''}" data-act="${act}" data-id="${id}" aria-pressed="${on}" ${disabled ? 'disabled' : ''}>
      <span class="seat">${p ? seatNo(p.seat) : '—'}</span><b>${pname(id)}${p && !p.alive ? ' <span class="small muted">(dead)</span>' : ''}</b>
      ${votes ? `<span class="votes">${votes[id] ?? ''}</span>` : '<span class="mark"></span>'}</button>`;
  }).join('')}${extra}</div>`;
}

function nominationList(v) {
  const d = v.day;
  if (!d.nominations.length) return '<p class="muted">No nominations yet.</p>';
  const seconds = {};
  for (const n of d.nominations) (seconds[n.target] ||= []).push(n.by);
  return `<ol class="ledger" style="list-style:none">${d.nominees.map((id, i) => `<li><span class="seat">${roman(i + 1)}</span><span class="who"><b>${pname(id)}</b><small>named by ${seconds[id].map(pname).join(', ')}</small></span><span class="tags">${seconds[id].length > 1 ? `<span class="tag">${seconds[id].length}×</span>` : ''}</span></li>`).join('')}</ol>`;
}

function discussionStage(v, me, a) {
  let mine = '';
  if (a.type === 'nominate') {
    const sel = S.sel.nominate ?? null;
    mine = a.mine ? `<p class="muted">You nominated <b>${pname(a.mine)}</b>. One nomination per player per Day.</p>`
      : `<details class="more" ${sel ? 'open' : ''}><summary>Make a formal nomination</summary><div>
        <p class="small muted">Only formal nominations count — the first one matters to a Gambler. Repeat nominations add no vote weight.</p>
        ${choiceList(a.targets, { selected: sel ? [sel] : [], act: 'pickNominate' })}
        <button class="btn btn-solid" data-act="nominate" ${sel ? '' : 'disabled'}>Nominate ${sel ? pname(sel) : ''}</button></div></details>`;
  }
  return `<section class="stack"><div class="rule">Nominated</div>${nominationList(v)}${mine}
    <p class="small muted">${v.day.nominees.length ? 'When nominations close, each nominee gets a defence in order.' : 'If nobody is nominated, there is no vote today — and no sentence.'}</p></section>`;
}

function defenseStage(v, me, d) {
  return `<section class="stack"><div class="rule">Defence</div>
    <div class="choices">${d.nominees.map((id, i) => `<div class="choice" aria-pressed="${i === d.defenseIndex}" style="cursor:default"><span class="seat">${roman(i + 1)}</span><b>${pname(id)}</b><span class="small muted">${i < d.defenseIndex ? 'spoke' : i === d.defenseIndex ? 'speaking' : 'waiting'}</span></div>`).join('')}</div>
    ${d.speaking === me.id ? (me.statuses.includes('MUTE') ? '<div class="banner blood"><div><b>Your turn — but you are muted.</b><p>Plead without words.</p></div></div>' : '<div class="banner"><div><b>Your turn to speak.</b><p>Make your case to the table.</p></div></div>') : ''}
  </section>`;
}

function votingStage(v, me, a) {
  const d = v.day;
  let ballot = '';
  if (a.type === 'ballot') {
    const sel = S.sel.vote ?? a.choice;
    const cands = a.candidates.filter((id) => a.selfVote || id !== me.id || a.ghost);
    ballot = `<div class="panel ${a.ghost ? '' : ''}">
      <span class="kicker">${a.ghost ? 'Ghost ballot · weight 1' : `Your ballot · weight ${a.weight}`}</span>
      ${a.ghost && a.majority ? '<p class="small muted">Majority Rule is in force: ghost ballots are cast, but never decide the sentence.</p>' : ''}
      ${choiceList(cands, { selected: sel ? [sel] : [], act: 'pickVote', kill: true, extra: `<button class="choice" data-act="pickVote" data-id="ABSTAIN" aria-pressed="${sel === 'ABSTAIN'}"><span class="seat">—</span><b>Abstain</b><span class="mark"></span></button>` })}
      <button class="btn btn-solid" data-act="vote" ${sel && sel !== a.choice ? '' : 'disabled'}>${a.choice ? 'Change my ballot' : 'Cast ballot'}</button>
      ${a.choice ? `<p class="small">Vote recorded${a.choice === 'ABSTAIN' ? ' (abstain)' : `: ${pname(a.choice)}`}. You can change it until the vote locks.</p>` : '<p class="small muted">Secret until the vote locks. Only totals are published.</p>'}
    </div>`;
  } else if (a.type === 'novote') {
    ballot = '<div class="banner blood"><div><b>Voting disabled.</b><p>You have no vote today.</p></div></div>';
  }
  return `<section class="stack"><div class="rule">Secret ballot</div>
    <p class="muted">${v.progress.done}/${v.progress.total} ballots recorded${v.progress.ghostTotal ? ` · ${v.progress.ghostDone}/${v.progress.ghostTotal} ghosts` : ''}${d.majority != null ? ` · Majority Rule: more than ${d.majority} needed` : ''}. A tie at the top sentences nobody.</p>
    ${ballot}</section>`;
}

function resolvingStage(v, me, a) {
  if (a.type === 'retaliate') {
    const sel = S.sel.retaliate ?? null;
    return `<section class="stack"><div class="panel seal"><span class="kicker blood">Equal Exchange</span><p>You were sentenced. You may take one living non-Death player with you.</p>
      ${choiceList(a.targets, { selected: sel ? [sel] : [], act: 'pickRetaliate', kill: true })}
      <div class="row"><button class="btn btn-blood" data-act="retaliate" ${sel ? '' : 'disabled'}>Take them with me</button><button class="btn btn-ghost" data-act="retaliate" data-none="1">Go quietly</button></div></div></section>`;
  }
  return '<section class="stack"><p class="muted">The condemned is making a final choice…</p></section>';
}

function myCornerBlock(v, me) {
  return `<section><details class="more"><summary>My role & notes</summary><div>
    ${myRoleBlock(me, { flipKey: `corner-${v.phaseId}`, allowHide: true })}
    <div class="rule">Everything only you were told</div>${feed([...(v.private || [])].reverse(), 'notes')}
  </div></details></section>`;
}

// ── Chat ───────────────────────────────────────────────────────────────────
function chatBlock(v) {
  if (!v.chats?.length) return '';
  const active = v.chats.find((c) => c.id === S.ui.chat) ?? v.chats[0];
  return `<section class="chat"><div class="rule">${esc(active.label)}</div>
    ${v.chats.length > 1 ? `<div class="tabs">${v.chats.map((c) => `<button class="btn btn-sm ${c.id === active.id ? 'btn-solid' : ''}" data-act="chatTab" data-id="${esc(c.id)}">${esc(c.label)}</button>`).join('')}</div>` : ''}
    <div class="log" data-scroll="chat-${esc(active.id)}" aria-live="polite">${active.messages.length ? active.messages.map((m) => `<div class="msg ${m.name === 'You' ? 'mine' : ''}"><b>${esc(m.name)}</b>${esc(m.text)}</div>`).join('') : '<p class="small muted">No messages yet.</p>'}</div>
    ${active.canSend ? `<form data-form="chat" data-id="${esc(active.id)}"><input class="input" maxlength="280" placeholder="Say something…" data-keep="chat" data-draft="chat" value="${esc(S.drafts.chat ?? '')}" autocomplete="off"><button class="btn btn-sm" type="submit">Send</button></form>` : '<p class="small muted">You cannot speak here right now.</p>'}
  </section>`;
}

// ── Night ──────────────────────────────────────────────────────────────────
function nightMain(v, me) {
  if (!me.alive || v.action.type === 'spectate') {
    return `${head(v, '<p class="step">The living are asleep. You watch.</p>')}
      ${!me.alive ? `<div class="banner">${glyph('death')}<div><b>You are dead.</b><p>No dreams, no powers. Dawn will tell.</p></div></div>` : '<div class="banner"><div><b>You returned too late to act tonight.</b></div></div>'}
      <p class="muted">${v.progress ? `${v.progress.done}/${v.progress.total} ${v.progress.label}.` : ''}</p>
      <section><div class="rule">The table</div>${tableLedger(v, me)}</section>`;
  }
  const unveiled = S.ui.unveiled[v.phaseId];
  const body = v.phase === 'NIGHT_DREAM_SWAP' ? swapStage(v, me, v.action) : actionsStage(v, me, v.action);
  return `${head(v, `<p class="step">${v.progress ? `${v.progress.done}/${v.progress.total} ${esc(v.progress.label)}` : ''}</p>`)}
    <div class="${unveiled ? '' : 'veiled'}">
      ${unveiled ? '' : `<div class="veil">${glyph('veil')}<p class="muted">Make sure nobody can see your screen.</p><button class="btn btn-solid" data-act="unveil">Show my night</button></div>`}
      <div class="veil-body stack" style="gap:32px">${unveiled ? `<div class="row end"><button class="btn btn-sm btn-ghost" data-act="veil">${glyph('veil')} Cover screen</button></div>` : ''}${unveiled ? body : '<div style="height:360px"></div>'}</div>
    </div>`;
}

function swapStage(v, me, a) {
  if (a.done) return `<p class="muted">Your eyes are closed. Dreams are settling · ${v.progress.done}/${v.progress.total}.</p>`;
  if (a.snatcher) {
    const sel = S.sel.swap ?? null;
    return `${dreamCard(me.dream)}
      <section class="stack"><div class="rule">Steal a dream</div><p class="muted">Swap your Dream card with another player before actions open — or keep the one you have. Swaps resolve in seat order.</p>
      ${choiceList(a.targets, { selected: sel ? [sel] : [], act: 'pickSwap' })}
      <div class="row"><button class="btn btn-solid" data-act="swap" ${sel ? '' : 'disabled'}>Swap dreams</button><button class="btn btn-ghost" data-act="swap" data-none="1">Keep my dream</button></div></section>`;
  }
  return `<section class="stack"><div class="report"><p>Your dream is forming. Close your eyes and wait.</p></div>
    <button class="btn btn-solid" data-act="swap" data-none="1">Close my eyes</button></section>`;
}

function dreamCard(d) {
  if (!d) return '';
  return `<div class="dream">${dreamGlyph(d.id)}<div><span class="kicker">Tonight's dream</span><h3>${esc(d.name)}</h3><p>${esc(d.text)}</p></div></div>`;
}

function actionsStage(v, me, a) {
  const parts = [];
  parts.push(dreamCard(me.dream));
  if (me.sleepwalkPartner) parts.push(`<p class="small muted">You are bound to ${esc(me.sleepwalkPartner)}, seated just before you.</p>`);
  if (me.role) parts.push(roleCardHtml(me.role, { mini: true, align: me.alignment }));
  if (a.done) {
    parts.push(`<section class="stack"><div class="report"><p>You are asleep. ${v.progress.done}/${v.progress.total} asleep — dawn comes when everyone is, or when time runs out.</p></div>
      ${submittedSummary(a)}
      <button class="btn btn-ghost" data-act="reopen">Wake up and change my mind</button></section>`);
    parts.push(chatBlock(v));
    return parts.join('');
  }
  if (a.death) parts.push(deathRoom(v, me, a.death));
  else if (a.schema) parts.push(roleAction(v, me, a.schema));
  else parts.push(`<section class="stack"><div class="rule">Your night</div><p class="muted">${noActionReason(me, v)}</p></section>`);
  if (a.nightmare) {
    const sel = S.sel.nightmare ?? a.nightmare.choice;
    parts.push(`<section class="stack"><div class="rule">Shared Nightmare · choose a partner</div><p class="small muted">If they die tonight, so do you. They are not harmed by the link.</p>${choiceList(a.nightmare.targets, { selected: sel ? [sel] : [], act: 'pickNightmare' })}</section>`);
  }
  parts.push(chatBlock(v));
  return parts.join('');
}

function submittedSummary(a) {
  if (a.death) {
    const mine = a.death.proposals?.[V().me.id] ?? [];
    return `<p class="small muted">${mine.length ? `You confirmed: ${mine.map(pname).join(' and ')}.` : 'You confirmed a pass.'}</p>`;
  }
  if (a.submitted?.length) return `<p class="small muted">Submitted: ${a.submitted.map((u) => [u.target ? pname(u.target) : '', u.option ? optionLabel(a.schema, u.option) : ''].filter(Boolean).join(' · ')).join('; ')}.</p>`;
  return '';
}
const optionLabel = (schema, id) => esc(schema?.options?.find((o) => o.id === id)?.label ?? id);

function noActionReason(me, v) {
  if (me.mimicPowerless) return 'Your copy failed. No action — waiting for dawn.';
  if (me.role?.id === 'MIMIC' || me.role?.id === 'DOUBLE_AGENT') return 'Your choice was made on Night 1. No action — waiting for dawn.';
  if (Object.values(me.charges || {}).some((n) => n === 0)) return 'Your once-per-game power is spent. No action — waiting for dawn.';
  if (me.alignment === 'DEATH' && me.joinsTeamNight) return `You join the Death team on Night ${roman(me.joinsTeamNight)}. No action tonight.`;
  if (me.originalRole && v.nightNumber < 2) return 'Your new powers begin next night.';
  return 'No action tonight. Waiting for dawn.';
}

function roleAction(v, me, s) {
  if (s.blocked === 'paralysis') return `<div class="banner blood">${dreamGlyph('SLEEP_PARALYSIS')}<div><b>Sleep Paralysis</b><p>You cannot use your role tonight.</p></div></div>`;
  const role = s.role;
  const uses = s.uses ?? 1;
  const sel = S.sel.uses ?? [];
  let body = '';
  if (s.kind === 'chat') {
    if (s.conspire || a_conspireOpen(v)) {
      body = `<p class="muted">Your whisper with ${pname(s.conspire)} is open below. They do not see your name unless you tell them.</p>`;
    } else {
      const pick = S.sel.conspire ?? null;
      body = `<p class="muted">Open a private two-person text channel for tonight. Your partner sees only "Stranger".</p>
        ${choiceList(s.targets, { selected: pick ? [pick] : [], act: 'pickConspire' })}
        <button class="btn" data-act="conspire" ${pick ? '' : 'disabled'}>Open whisper</button>`;
    }
  } else if (s.kind === 'choice') {
    body = `<div class="choices">${s.options.map((o) => `<button class="choice" data-act="pickOption" data-id="${o.id}" aria-pressed="${sel[0]?.option === o.id}"><span class="seat">—</span><b>${esc(o.label)}</b><span class="mark"></span></button>`).join('')}</div>`;
  } else {
    const chosen = sel.map((u) => u.target);
    body = `${uses > 1 ? `<p class="small">Tonight you may act <b>twice</b>, on two different players.</p>` : ''}
      ${choiceList(s.targets, { selected: chosen, act: 'pickTarget', kill: ['TERRORIST', 'PSYCHO', 'VIGILANTE'].includes(role.id) })}
      ${s.options ? sel.map((u, i) => `<div class="field"><span>${pname(u.target)} — choose</span><div class="seg">${s.options.map((o) => `<button data-act="pickUseOption" data-i="${i}" data-id="${o.id}" aria-pressed="${u.option === o.id}">${esc(o.label)}</button>`).join('')}</div></div>`).join('') : ''}`;
  }
  const verb = s.verb ?? 'Act on';
  return `<section class="stack"><div class="rule">${esc(role.name)} · ${esc(verb)}${s.charges === 1 ? ' · once per game' : ''}</div>
    ${s.kind === 'dead' ? '<p class="small muted">Choose an eliminated player to raise at dawn. You must survive the night.</p>' : ''}
    ${role.id === 'MIMIC' ? '<p class="small muted">Mandatory: if you do not choose, you stay a powerless Mimic.</p>' : ''}
    ${role.id === 'DOUBLE_AGENT' ? '<p class="small muted">Mandatory and permanent. If you do not choose, you stay non-Death.</p>' : ''}
    ${body}</section>`;
}
const a_conspireOpen = (v) => v.chats?.some((c) => c.id.startsWith(`consp:${v.nightNumber}:${v.me.id}`));

function deathRoom(v, me, D) {
  const mine = S.sel.death ?? D.proposals[me.id] ?? [];
  const keyOf = (arr) => [...(arr || [])].sort().join(',');
  const proposals = D.members.map((m) => ({ ...m, picks: D.proposals[m.id] ?? null, confirmed: D.confirmed[m.id] }));
  const agree = proposals.every((p) => p.picks && keyOf(p.picks) === keyOf(proposals[0].picks));
  return `<section class="stack">
    <div class="panel seal">
      <span class="kicker blood">The Death room · capacity ${D.capacity}</span>
      ${D.paralysed ? `<div class="banner blood">${dreamGlyph('SLEEP_PARALYSIS')}<div><b>You hold Sleep Paralysis.</b><p>The whole faction kill is blocked tonight. Your team does not know.</p></div></div>` : ''}
      <ul class="ledger">${proposals.map((p) => `<li class="${p.id === me.id ? 'me' : ''}"><span class="seat">${glyph('death')}</span><span class="who"><b>${esc(p.name)}</b><small>${p.picks ? (p.picks.length ? p.picks.map(pname).join(' + ') : 'pass') : 'thinking…'}</small></span><span class="tags">${p.confirmed ? '<span class="tag solid">Confirmed</span>' : '<span class="tag dim">Open</span>'}</span></li>`).join('')}</ul>
      <p class="small ${agree ? '' : 'blood'}">${D.members.length === 1 ? 'You hunt alone.' : agree ? 'Your team agrees.' : 'Your team does not agree. Unless every one of you confirms the same target, nobody dies.'}</p>
    </div>
    <div class="rule">Choose up to ${D.capacity}</div>
    ${choiceList(D.targets, { selected: mine, act: 'pickDeath', kill: true })}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
function endMain(v, me) {
  const title = { DEATH: 'Death wins.', NON_DEATH: 'The living win.', JESTER: 'The Jester wins.', DRAW: 'A draw.', ABORTED: 'Abandoned.' }[v.winner] ?? 'The End';
  const mine = me && v.winner && v.winner !== 'ABORTED' && v.winner !== 'DRAW' ? myResult(v, me) : '';
  return `${head(v)}
    <section class="verdict ${v.winner === 'DEATH' ? 'death' : ''}"><span class="kicker">Verdict</span><h1>${esc(title)}</h1><p class="scenario">${esc(v.endReason)}</p>${mine}</section>
    <section><div class="rule">Every secret</div>${v.players.some((p) => p.role) ? `<ul class="ledger reveal">${v.players.map((p) => `<li class="${p.alive ? '' : 'dead'} ${p.id === me?.id ? 'me' : ''}">
      <span class="seat">${seatNo(p.seat)}</span>
      <span class="who"><b>${esc(p.name)}</b><small>${p.role ? esc(p.role.name) : '—'}${p.originalRole ? ` (was ${esc(p.originalRole.name)})` : ''} · ${p.alive ? 'alive' : `† ${esc(p.diedAt ?? '')}`}</small></span>
      <span class="tags"><span class="tag ${p.alignment === 'DEATH' ? 'blood' : ''}">${esc(ALIGN[p.alignment] ?? '')}</span></span></li>`).join('')}</ul>` : '<p class="muted">The host chose not to reveal roles.</p>'}</section>
    ${me && !me.moderator ? `<section><details class="more"><summary>My notes</summary><div>${feed([...(v.private || [])].reverse(), 'notes')}</div></details></section>` : ''}
    <section class="lg-hide"><div class="rule">Public record</div>${feed(v.log)}</section>
    <div class="row"><a class="btn" href="/" data-link>Back to start</a></div>`;
}

function myResult(v, me) {
  const won = (v.winner === 'DEATH' && me.alignment === 'DEATH') || (v.winner === 'NON_DEATH' && me.alignment === 'NON_DEATH') || (v.winner === 'JESTER' && v.jesterId === me.id);
  return `<p class="kicker" style="margin-top:8px">${won ? 'You won.' : 'You lost.'}</p>`;
}

// ── Moderator ──────────────────────────────────────────────────────────────
function moderatorMain(v) {
  if (v.phase === 'LOBBY') return lobbyMain(v, v.me);
  const sec = Object.fromEntries((v.secrets || []).map((s) => [s.id, s]));
  return `${head(v)}
    <div class="banner blood">${glyph('mentalist')}<div><b>Trusted moderator view</b><p>You see everything. Do not show this screen to players.</p></div></div>
    ${v.deathTeam ? `<div class="panel seal tight"><span class="kicker blood">Death room · capacity ${v.deathTeam.capacity}</span>${v.deathTeam.members.map((id) => `<p>${pname(id)}: ${(v.deathTeam.proposals[id] || []).map(pname).join(' + ') || '—'} ${v.deathTeam.confirmed[id] ? '(confirmed)' : ''}</p>`).join('')}</div>` : ''}
    ${v.day ? `<section class="stack"><div class="rule">Nominated</div>${nominationList(v)}</section>` : ''}
    <section><div class="rule">Everyone</div><ul class="ledger">${v.players.map((p) => { const s = sec[p.id] || {}; return `<li class="${p.alive ? '' : 'dead'}"><span class="seat">${seatNo(p.seat)}</span><span class="who"><b>${esc(p.name)}</b><small>${esc(s.role ?? '')} · ${esc(ALIGN[s.alignment] ?? '')}${s.dream ? ` · dreams ${esc(s.dream)}` : ''}${s.statuses?.length ? ` · ${s.statuses.join(', ')}` : ''}${s.action ? ` · ${s.action.map((u) => [u.target ? pname(u.target) : '', u.option ?? ''].filter(Boolean).join(' ')).join('; ')}` : ''}${s.ballot ? ` · votes ${s.ballot === 'ABSTAIN' ? 'abstain' : pname(s.ballot)}` : ''}</small></span><span class="tags">${s.done ? '<span class="tag solid">Done</span>' : ''}</span></li>`; }).join('')}</ul></section>`;
}

// ── Board (public display) ─────────────────────────────────────────────────
function boardScreen() {
  const v = V();
  if (S.conn === 'gone') return goneScreen();
  if (!v) return loadingScreen();
  const pw = phaseWord(v);
  const totals = [...v.log].reverse().find((l) => l.totals && l.at === `Day ${v.dayNumber}`)?.totals;
  return `<main class="board">
    <div class="row between"><a class="wordmark" href="/" data-link>Dead<i>Set</i><span class="seal"></span></a><span class="kicker">Room <span class="mono">${esc(v.code)}</span> · public board</span></div>
    <header class="phase-head"><span class="kicker">${esc(STEP[v.phase] ?? '')}</span><h1>${pw.word === 'Night' ? `<i>${pw.word}</i>` : esc(pw.word)}${pw.num ? `<span class="num">${esc(pw.num)}</span>` : ''}</h1>
      ${v.scenario ? `<p class="scenario">${esc(`We are ${v.scenario.who}, in ${v.scenario.where}, trying to ${v.scenario.why}.`)}</p>` : ''}
      <div class="row between"><span class="muted">${v.progress ? `${v.progress.done}/${v.progress.total} ${esc(v.progress.label)}` : ''}</span><span class="clock" data-clock></span></div>${fuse()}</header>
    <div class="cols">
      <section><div class="rule">The table</div>${tableLedger(v, null, { votes: totals })}
        ${v.phase === 'LOBBY' ? `<div style="margin-top:24px" class="row">${qrSvg(`${location.origin}/r/${v.code}`)}<span class="code-big">${esc(v.code)}</span></div>` : ''}
        ${v.day?.nominees?.length ? `<div class="rule" style="margin-top:28px">Nominated</div>${nominationList(v)}` : ''}
        ${v.activeRules?.length ? `<div class="rule" style="margin-top:28px">Rules in force</div>${v.activeRules.map((r) => `<p><b>${esc(r.name)}</b> <span class="muted small">${esc(r.text)}</span></p>`).join('')}` : ''}
      </section>
      <section><div class="rule">Public record</div><div data-scroll="board-tl" style="max-height:70vh;overflow:auto">${feed(v.log)}</div></section>
    </div></main>`;
}

// ── Dock (primary action) ──────────────────────────────────────────────────
function dock(v) {
  const me = v.me;
  const a = v.action;
  if (!me || me.moderator) {
    if (v.phase === 'LOBBY' && v.host) return `<div class="dock"><button class="btn btn-solid" data-act="start" ${v.setup.ok && !v.setup.notReady && !S.pending ? '' : 'disabled'}>${v.setup.notReady ? `Waiting for ${v.setup.notReady} to be ready` : 'Start match'}</button></div>`;
    return '';
  }
  const btn = (label, act, cls = 'btn-solid', dis = false) => `<div class="dock"><button class="btn ${cls}" data-act="${act}" ${dis || S.pending ? 'disabled' : ''}>${label}</button></div>`;
  if (v.phase === 'LOBBY') {
    if (v.host) return btn(v.setup.notReady ? `Waiting for ${v.setup.notReady} to be ready` : 'Start match', 'start', 'btn-solid', !v.setup.ok || !!v.setup.notReady);
    return btn(me.ready ? 'Ready — tap to undo' : 'I\'m ready', 'ready', me.ready ? '' : 'btn-solid');
  }
  if (v.phase === 'NIGHT_0_REVEAL') {
    if (me.acknowledged) return '';
    return btn('Understood', 'ack', 'btn-solid', !S.ui.flipped.role);
  }
  if (v.phase === 'NIGHT_ACTIONS' && a.type === 'night' && !a.done && S.ui.unveiled[v.phaseId]) {
    const ready = commitReady(a);
    return btn(ready.label, 'commit', a.death ? 'btn-blood' : 'btn-solid', !ready.ok);
  }
  // Phones have no sidebar: give the host their next step right in the dock.
  if (v.host?.advance && !S.ui.drawer) return `<div class="dock mobile-only"><button class="btn" data-act="advance" ${S.pending ? 'disabled' : ''}>${esc(v.host.advance)}</button></div>`;
  return '';
}

function commitReady(a) {
  if (a.death) {
    const picks = S.sel.death ?? a.death.proposals[V().me.id] ?? [];
    return { ok: true, label: picks.length ? `Confirm ${picks.map((id) => player(id)?.name).join(' + ')}` : 'Confirm: pass tonight' };
  }
  const s = a.schema;
  if (!s || s.blocked || s.kind === 'chat') return { ok: true, label: 'Go to sleep' };
  const sel = S.sel.uses ?? [];
  if (!sel.length) return { ok: true, label: s.role.id === 'MIMIC' || s.role.id === 'DOUBLE_AGENT' ? 'Skip (not recommended)' : 'Pass and sleep' };
  if (s.options && sel.some((u) => !u.option)) return { ok: false, label: 'Choose an option' };
  return { ok: true, label: 'Commit and sleep' };
}

// ── Events ─────────────────────────────────────────────────────────────────
const ACT = {
  async create() {
    const name = (S.drafts.createName ?? '').trim();
    if (!name) return toast('Enter your name first.', 'err');
    S.pending = true; render();
    try {
      const r = await api('/api/rooms', { name, moderated: S.ui.moderated });
      saveSession(r.code, r);
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
  drawer() { S.ui.drawer = !S.ui.drawer; render(); },
  copy(el) { navigator.clipboard?.writeText(el.dataset.text).then(() => toast('Link copied.'), () => toast(el.dataset.text)); },
  ready() { send('lobby.ready', { ready: !V().me.ready }); },
  start() { send('host.start'); },
  preset(el) { send('host.settings', { preset: el.dataset.id }); },
  rulesMode(el) { send('host.settings', { rules: { mode: el.dataset.mode } }); },
  scenMode(el) { send('host.settings', { scenario: { mode: el.dataset.mode } }); },
  transport(el) { send('host.settings', { transport: el.dataset.mode }); },
  seat(el) { send('host.seat', { playerId: el.dataset.pid, dir: Number(el.dataset.dir) }); },
  kick(el) { if (confirm(`Remove ${player(el.dataset.pid)?.name} from the table?`)) send('host.kick', { playerId: el.dataset.pid }); },
  advance(el) { S.ui.drawer = false; send('host.advance', { skipAll: !!el.dataset.skip }); },
  extend() { send('host.extend', { seconds: 30 }); },
  end() { if (confirm('End the match now? It will be recorded as abandoned — no faction wins.')) send('host.end'); },
  rematch() { send('host.rematch'); },
  claim() { send('host.claim'); },
  issueRecovery() { const id = S.drafts.recPick || V().players.find((p) => p.id !== V().me?.id)?.id; if (id) send('host.recovery', { playerId: id }); },
  flip(el) { S.ui.flipped[el.dataset.key] = !S.ui.flipped[el.dataset.key]; render(); },
  ack() { send('role.ack'); },
  unveil() { S.ui.unveiled[V().phaseId] = true; render(); },
  veil() { S.ui.unveiled[V().phaseId] = false; render(); },
  immunity() { if (confirm('Declare diplomatic immunity for today? This uses your only charge and everyone will see it.')) send('day.immunity'); },
  shoot(el) { send('day.shoot', { target: el.dataset.id || null }); },
  pickNominate(el) { S.sel.nominate = S.sel.nominate === el.dataset.id ? null : el.dataset.id; render(); },
  nominate() { if (S.sel.nominate) send('day.nominate', { target: S.sel.nominate }); },
  pickVote(el) { S.sel.vote = el.dataset.id; render(); },
  vote() { if (S.sel.vote) send('day.ballot', { target: S.sel.vote }); },
  pickRetaliate(el) { S.sel.retaliate = el.dataset.id; render(); },
  retaliate(el) { send('day.retaliate', { target: el.dataset.none ? null : S.sel.retaliate }); },
  pickSwap(el) { S.sel.swap = S.sel.swap === el.dataset.id ? null : el.dataset.id; render(); },
  swap(el) { send('dream.swap', { target: el.dataset.none ? null : S.sel.swap }); },
  pickTarget(el) {
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
  pickUseOption(el) { const sel = [...(S.sel.uses ?? [])]; sel[Number(el.dataset.i)] = { ...sel[Number(el.dataset.i)], option: el.dataset.id }; S.sel.uses = sel; render(); },
  pickOption(el) { S.sel.uses = S.sel.uses?.[0]?.option === el.dataset.id ? [] : [{ option: el.dataset.id }]; render(); },
  pickNightmare(el) { S.sel.nightmare = S.sel.nightmare === el.dataset.id ? null : el.dataset.id; render(); },
  pickConspire(el) { S.sel.conspire = el.dataset.id; render(); },
  conspire() { send('conspire.open', { target: S.sel.conspire }); },
  pickDeath(el) {
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
  commit() {
    const a = V().action;
    const payload = {};
    if (a.death) payload.death = S.sel.death ?? a.death.proposals[V().me.id] ?? [];
    else if (a.schema && !a.schema.blocked && a.schema.kind !== 'chat' && (S.sel.uses ?? []).length) payload.uses = S.sel.uses;
    else payload.pass = true;
    if (a.nightmare) payload.nightmare = S.sel.nightmare ?? a.nightmare.choice ?? null;
    send('night.commit', payload);
  },
  reopen() { send('night.reopen'); },
  chatTab(el) { S.ui.chat = el.dataset.id; render(); },
};

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (link && link.origin === location.origin && !e.metaKey && !e.ctrlKey) { e.preventDefault(); S.ui.drawer = false; go(link.pathname); return; }
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type !== 'checkbox')) return;
  if (el.tagName === 'INPUT') { ACT[el.dataset.act]?.(el); return; }
  e.preventDefault();
  if (el.disabled) return;
  ACT[el.dataset.act]?.(el);
});

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
    send('chat.send', { channel: f.dataset.id, text });
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || !e.target.dataset?.draft) return;
  const k = e.target.dataset.draft;
  if (k === 'createName') ACT.create();
  if (k === 'joinCode') ACT.gotoRoom();
  if (k === 'joinName') ACT.join();
  if (k === 'recCode') ACT.recover();
});

function nest(path, value) {
  const parts = path.split('.');
  const out = {};
  let o = out;
  parts.forEach((p, i) => { if (i === parts.length - 1) o[p] = value; else { o[p] = {}; o = o[p]; } });
  return out;
}

// Subtle 3D tilt on pointer devices only (vanilla-tilt style), respecting reduced motion.
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const calm = matchMedia('(prefers-reduced-motion: reduce)');
document.addEventListener('pointermove', (e) => {
  if (!fine.matches || calm.matches) return;
  const card = e.target.closest?.('[data-tilt]');
  document.querySelectorAll('[data-tilt]').forEach((c) => { if (c !== card) c.style.transform = ''; });
  if (!card) return;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
});

loadContent();
boot();
