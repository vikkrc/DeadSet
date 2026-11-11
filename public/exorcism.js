// Dead Set: Exorcism — phone screens, moments, the crystal ball and the TV board.
// Pure renderers over the filtered view; the shell (app.js) passes its helpers
// in `h` and merges `exorcismActs` into its action table.
import { glyph } from './icons.js';
import { t, th, getLang, setNamer } from './i18n.js';
import { avatarSvg } from './avatar.js';

export const isExorcismPhase = (ph) => typeof ph === 'string' && ph.startsWith('X_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const name = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');

// ── Words ──────────────────────────────────────────────────────────────────
let CATS = [];
export const setExorcismContent = (c) => { CATS = c?.exorcism?.categories ?? CATS; };
export const categories = () => CATS;
const cat = (id) => CATS.find((c) => c.id === id);
/** The table's language decides the words (it is forced on every phone in this mode). */
const wl = () => getLang();
export const catName = (id) => cat(id)?.name?.[wl()] ?? cat(id)?.name?.en ?? id;
setNamer('category', (id) => catName(id));
export const wordAt = (id, k) => cat(id)?.words?.[wl()]?.[k] ?? cat(id)?.words?.en?.[k] ?? '?';

// ── The crystal ball (WebGL mist, CSS fallback) ────────────────────────────
const FRAG = `precision mediump float;
uniform vec2 r; uniform float t; uniform float clear; uniform vec3 tint;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
  float d=length(uv);
  if(d>1.){gl_FragColor=vec4(0.);return;}
  float z=sqrt(1.-d*d);
  vec2 p=uv/(z+.55)*1.7;
  float a=t*.12; p=mat2(cos(a),-sin(a),sin(a),cos(a))*p;
  float q=fbm(p+vec2(t*.09,-t*.06));
  float m=fbm(p*1.4+q*2.2+vec2(-t*.11,t*.05));
  float swirl=fbm(p*3.+vec2(t*.2,0.));
  float mist=smoothstep(.28,.95,m)*(.75+.5*swirl);
  mist*=mix(1.,smoothstep(.08,.85,d),clear);
  vec3 deep=vec3(.04,.025,.09);
  vec3 col=mix(deep,tint,clamp(mist,0.,1.));
  col+=tint*pow(1.-z,2.6)*1.3;
  col+=vec3(1.)*pow(max(0.,1.-length(uv-vec2(-.38,.42))*2.4),3.)*.45;
  col+=tint*.18*(1.-d)*clear;
  float edge=smoothstep(1.,.965,d);
  gl_FragColor=vec4(col*edge,edge);
}`;
const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const balls = new Set();
const known = new WeakMap();
let rafId = 0;
const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const hex = (s) => { const n = parseInt(String(s).replace('#', ''), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };

function initBall(cv) {
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, antialias: true });
  if (!gl) { cv.closest('.xball')?.classList.add('no-gl'); return null; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.closest('.xball')?.classList.add('no-gl'); return null; }
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return { cv, gl, u: { r: gl.getUniformLocation(pr, 'r'), t: gl.getUniformLocation(pr, 't'), clear: gl.getUniformLocation(pr, 'clear'), tint: gl.getUniformLocation(pr, 'tint') }, clear: 0, t0: performance.now() };
}

function frame(now) {
  rafId = 0;
  for (const b of balls) {
    if (!b.cv.isConnected) { balls.delete(b); continue; }
    const { gl, cv } = b;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const w = Math.round(cv.clientWidth * dpr); const hgt = Math.round(cv.clientHeight * dpr);
    if (cv.width !== w || cv.height !== hgt) { cv.width = w; cv.height = hgt; }
    gl.viewport(0, 0, w, hgt);
    const target = cv.dataset.clear === '1' ? 1 : 0;
    b.clear += (target - b.clear) * 0.04;
    gl.uniform2f(b.u.r, w, hgt);
    // Time runs at the ball's speed (the vote speeds it up); the tint glides to its target.
    const dt = Math.min(0.1, (now - (b.last ?? now)) / 1000); b.last = now;
    b.time = (b.time ?? 0) + dt * (Number(cv.dataset.speed) || 1);
    const want = hex(cv.dataset.tint || '#8fc7d6');
    b.tint = b.tint ? b.tint.map((c, i) => c + (want[i] - c) * 0.03) : want;
    gl.uniform1f(b.u.t, calm ? 4 : b.time);
    gl.uniform1f(b.u.clear, b.clear);
    gl.uniform3fv(b.u.tint, b.tint);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  if (balls.size && !calm) rafId = requestAnimationFrame(frame);
}

/** Start any crystal balls that appeared on screen (call after every render). */
export function mountBalls(root = document) {
  for (const cv of root.querySelectorAll('canvas.xball-gl')) {
    if (known.has(cv)) continue;
    const b = initBall(cv);
    known.set(cv, b ?? true);
    if (b) balls.add(b);
  }
  if (balls.size && !rafId) rafId = requestAnimationFrame(frame);
}

/** A crystal ball. `clear`: the mist parts and the inside shows. */
export function ballHtml({ key, kicker = '', title = '', sub = '', tint = '#8fc7d6', clear = true, big = false, cls = '', speed = 1, orbit = '' }) {
  return `<div class="xball ${big ? 'big' : ''} ${clear ? 'clear' : ''} ${cls}" data-key="${key}" style="--tint:${tint};--spin:${(1 / speed).toFixed(2)}">${orbit}
    <div class="xb-glow" aria-hidden="true"></div>
    <div class="xb-orb"><canvas class="xball-gl" data-key="${key}-gl" data-clear="${clear ? 1 : 0}" data-tint="${tint}" data-speed="${speed}" aria-hidden="true"></canvas><div class="xb-css" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="xb-in">${kicker ? `<span class="xb-k">${kicker}</span>` : ''}${title ? `<b class="xb-word">${title}</b>` : ''}${sub ? `<span class="xb-sub">${sub}</span>` : ''}</div></div>
    <div class="xb-stand" aria-hidden="true"></div>
  </div>`;
}
const LIVING_TINT = '#8fc7d6';
const TALK_TINT = '#e9c27a';
const VOTE_TINT = '#d23a4c';

/**
 * What has been said, floating on the ball's edge as soon as each speaker
 * confirms: one pill per player, with their portrait, and their words when
 * words are typed (or just their name when they are only spoken). Pills
 * glide to their new places (CSS transition) as more players speak.
 */
export function orbitHtml(v) {
  const X = v.exorcism;
  if (!X?.clues?.length) return '';
  const spoke = X.order.filter((id) => X.clues.some((c) => c.pid === id));
  if (!spoke.length) return '';
  const n = spoke.length;
  const zig = n > 7; // many pills: alternate two radii so they never pile up
  return `<div class="xb-orbit ${n > 7 ? 'crowded' : ''}" aria-hidden="true">${spoke.map((id, i) => {
    const p = v.players.find((x) => x.id === id);
    const mine = X.clues.filter((c) => c.pid === id);
    const quiet = mine.every((c) => c.timeout);
    const words = mine.filter((c) => c.word).map((c) => esc(c.word));
    const av = p?.avatar ? avatarSvg(p.avatar, 'xo-av') : `<b class="xo-ini">${esc((p?.name ?? '?')[0])}</b>`;
    const label = X.typed && words.length ? words.join(' · ') : esc(p?.name ?? '');
    const ang = (-90 + (i * 360) / n) * (Math.PI / 180);
    const r = zig ? (i % 2 ? 41 : 53) : 50;
    return `<span class="xo ${quiet ? 'quiet' : ''}" data-key="xo-${id}" style="left:${(50 + r * Math.cos(ang)).toFixed(2)}%;top:${(50 + r * Math.sin(ang)).toFixed(2)}%;--d:${(i * 0.37) % 2.4}s">
      <span class="xo-pill ${X.typed ? 'typed' : 'spoken'}">${av}<span class="xo-w">${label}</span></span></span>`;
  }).join('')}</div>`;
}
const DEMON_TINT = '#c2344a';

/**
 * My own ball, the same colour for everyone (a red glow would give the Demon
 * away across the table). Everything inside is always in the DOM and only its
 * state changes, so the ball never moves; opening and closing both animate.
 * The Living see their password materialise letter by letter; the Demon sees
 * a sigil draw itself and their fate flicker in like embers.
 */
export function myBall(v, { key = 'myball', open = true, big = false, small = false, act = '', tint = LIVING_TINT, speed = 1, orbit = '', cls = '' } = {}) {
  const x = v.me?.x;
  if (!x || !v.exorcism) return '';
  const k = `${esc(t('Category'))} · ${esc(catName(x.category))}`;
  const letters = (str, demon) => {
    // Letters are animated one by one, grouped per word so lines only break between words.
    const n = [...str].length;
    let i = 0;
    return str.split(' ').map((w) => `<span class="xw">${[...w].map((ch) => {
      const k2 = demon ? ((i * 7) % n) : i; // embers flicker in out of order; the password writes itself
      i++;
      return `<span class="xl" style="--k:${k2};--n:${n}">${esc(ch)}</span>`;
    }).join('')}</span>`).join(' ');
  };
  let word; let sub; let extra = '';
  if (x.demon) {
    word = letters(t('You are the Demon'), true);
    sub = x.hint ? (x.hint.kind === 'length' ? th('A whisper: {n} letters', { n: x.hint.n }) : th('A whisper: it begins with {x}', { x: x.hint.x })) : esc(t('You do not know the password.'));
    if (x.demonMates?.length) sub += `<br>${th('The other Demon: {names}', { names: x.demonMates.map((m) => m.name) })}`;
    extra = '<svg class="xb-sigil" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44"/><path d="M50 8 L74 86 L10 36 L90 36 L26 86 Z"/></svg>';
  } else {
    word = letters(wordAt(x.category, x.word), false);
    sub = esc(t('The password'));
    extra = '<svg class="xb-runes" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="45"/><circle cx="50" cy="50" r="40"/></svg>';
  }
  const tag = act ? 'button' : 'div';
  return `<${tag} class="xball-btn" ${act ? `data-act="${act}"` : ''} data-key="${key}-btn" aria-label="${esc(t(open ? 'Hide the ball' : 'Look into the ball'))}">
  <div class="xball personal ${x.demon ? 'is-demon' : 'is-living'} ${big ? 'big' : ''} ${small ? 'small' : ''} ${open ? 'clear open' : 'closed'} ${cls}" data-key="${key}" style="--tint:${tint};--spin:${(1 / speed).toFixed(2)}">${orbit}
    <div class="xb-glow" aria-hidden="true"></div>
    <div class="xb-orb"><canvas class="xball-gl" data-key="${key}-gl" data-clear="${open ? 1 : 0}" data-tint="${tint}" data-speed="${speed}" aria-hidden="true"></canvas><div class="xb-css" aria-hidden="true"><i></i><i></i><i></i></div>
      ${extra}
      <div class="xb-in"><span class="xb-k">${k}</span><b class="xb-word">${word}</b><span class="xb-sub">${sub}</span><span class="xb-tap">${esc(t('Tap to look inside'))}</span></div></div>
    <div class="xb-stand" aria-hidden="true"></div>
  </div></${tag}>`;
}

// ── Grid ───────────────────────────────────────────────────────────────────
export function wordGrid(v, { act = '', selected = null, mark = null } = {}) {
  const X = v.exorcism;
  if (!X?.grid) return '';
  return `<div class="xgrid" data-key="xgrid">${X.grid.map((k, i) => {
    const tag = act ? 'button' : 'div';
    return `<${tag} class="xg-cell ${selected === k ? 'sel' : ''} ${mark === k ? 'mark' : ''}" ${act ? `data-act="${act}" data-id="${k}"` : ''} style="--i:${i}" data-key="xg-${k}">${esc(wordAt(X.category, k))}</${tag}>`;
  }).join('')}</div>`;
}

// ── Lobby: explainer + setup ───────────────────────────────────────────────
export function explainerHtml() {
  const steps = [
    ['veiled', 'The crystal ball', 'Everyone sees the category. The Living also see the password. The Demon does not.'],
    ['coin', 'The lots', 'A lottery picks who speaks first. Then the turn goes around the table.'],
    ['whispers', 'One word each', 'Say one word linked to the password, then confirm on your phone. Prove you know it, without giving it away.'],
    ['magistrate', 'Name the Demon', 'Talk it over and vote. Miss, and the Demon wins.'],
    ['death', 'One last guess', 'A caught Demon gets one guess at the password. Right, and the Demon still wins.'],
  ];
  return `<section class="x-explain" data-key="xexplain"><div class="rule">${t('How Exorcism works')}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${t(a)}</b><small>${t(b)}</small></span></li>`).join('')}</ol></section>`;
}

export function exorcismLobbyDeck(v, isHost, h) {
  const s = v.settings;
  const x = s.x ?? {};
  const n = v.players.length;
  const row = (title, sub, control, shown) => `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
  const sw = (key, on) => `<input type="checkbox" class="switch" data-act-change="xSet" data-id="${key}" ${on ? 'checked' : ''}>`;
  const sel = (key, value, opts) => `<select class="input lang-select" data-act-change="xSet" data-id="${key}">${opts.map(([k, l]) => `<option value="${k}" ${String(value) === String(k) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const onOff = (on) => t(on ? 'On' : 'Off');
  const hints = [['none', t('None')], ['length', t('Number of letters')], ['initial', t('First letter')]];
  const ties = [['demon', t('The Demon escapes')], ['coin', t('A coin decides')]];
  const cats = categories();
  const on = new Set(x.categories ?? cats.map((c) => c.id));
  const tableLang = v.table?.lang ?? 'en';
  const scores = scoreboard(v);
  return `${explainerHtml()}
    <section class="lobby-deck" data-key="xdeck">
    <div class="rule">${t(n === 1 ? 'The table · {n} player' : 'The table · {n} players', { n })}</div>
    ${n >= 3 ? `<p class="small muted" data-key="xcount">${th(x.demons === 2 ? '{l} Living and two Demons.' : '{l} Living and one Demon.', { l: Math.max(0, n - (x.demons ?? 1)) })}</p>` : `<p class="small muted">${t('Seat 3 to 12 players.')}</p>`}
    ${isHost ? `<label class="toggle-row"><span><b>${t('Table language')}</b><small>${t('Forced on every phone in Exorcism, so the words match.')}</small></span><select class="input lang-select" data-act-change="tableLang">${h.LANGS.map((l) => `<option value="${l.code}" ${tableLang === l.code ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</select></label>`
      : `<div class="toggle-row"><span><b>${t('Table language')}</b><small>${t('Forced on every phone in Exorcism, so the words match.')}</small></span><span class="tag">${esc(h.LANGS.find((l) => l.code === tableLang)?.name ?? tableLang)}</span></div>`}
    <div class="rule">${t('The Demon')}</div>
    ${row(t('Demons'), t('Two Demons need at least 7 players.'), sel('demons', x.demons ?? 1, [[1, t('One')], [2, t('Two')]]), t(x.demons === 2 ? 'Two' : 'One'))}
    ${x.demons === 2 ? row(t('Demons know each other'), t('Off: each Demon works alone.'), sw('demonsKnow', x.demonsKnow), onOff(x.demonsKnow)) : ''}
    ${row(t('The Demon\'s hint'), t('A vague whisper about the password. None is the classic game.'), sel('hint', x.hint ?? 'none', hints), hints.find(([k]) => k === (x.hint ?? 'none'))[1])}
    ${row(t('One last guess'), t('A caught Demon may still win by naming the password.'), sw('guess', x.guess !== false), onOff(x.guess !== false))}
    ${row(t('Tied vote'), '', sel('tie', x.tie ?? 'demon', ties), ties.find(([k]) => k === (x.tie ?? 'demon'))[1])}
    <div class="rule">${t('The words')}</div>
    ${row(t('Word grid'), t('16 words on the TV (and on phones); the password is one of them, and the Demon guesses from it.'), sw('grid', x.grid !== false), onOff(x.grid !== false))}
    ${row(t('Rounds'), t('How many times the word goes around the table.'), sel('rounds', x.rounds ?? 1, [[1, '1'], [2, '2'], [3, '3']]), String(x.rounds ?? 1))}
    ${row(t('Type the words'), t('Each speaker also types their word, shown on the TV. Off: just say it aloud.'), sw('typed', !!x.typed), onOff(!!x.typed))}
    <div class="x-cats" data-key="xcats"><span class="kicker">${t('Categories')} · ${on.size}/${cats.length}</span><div class="chips-row">${cats.map((c) => isHost
      ? `<button class="chipbtn ${on.has(c.id) ? 'on' : ''}" data-act="xCat" data-id="${c.id}" aria-pressed="${on.has(c.id)}">${esc(c.name[wl()] ?? c.name.en)}</button>`
      : `<span class="chipbtn ${on.has(c.id) ? 'on' : ''}">${esc(c.name[wl()] ?? c.name.en)}</span>`).join('')}</div></div>
    ${scores}
  </section>`;
}

/** Points across rounds: Living +1 each for a win, Demons +2. */
export function scoreboard(v) {
  const S = v.xScores ?? v.exorcism?.scores ?? {};
  const list = v.players.map((p) => ({ p, s: S[p.id] ?? 0 })).sort((a, b) => b.s - a.s);
  if (!list.some((x) => x.s)) return '';
  return `<section class="x-scores" data-key="xscores"><div class="rule">${t('Scores')}</div><ol class="ledger">${list.map(({ p, s }, i) => `<li data-key="xs-${p.id}"><span class="seat">${i + 1}</span><span class="who"><b>${esc(p.name)}</b></span><span class="tags"><span class="tag ${i === 0 ? 'solid' : ''}">${s}</span></span></li>`).join('')}</ol>
    <p class="small muted">${t('Living +1 for a win, Demons +2.')}</p></section>`;
}

// ── Phone: main screen ─────────────────────────────────────────────────────
function orderStrip(v) {
  const X = v.exorcism;
  if (!X?.order?.length) return '';
  const total = X.order.length * X.rounds;
  return `<ol class="x-order" data-key="xorder">${X.order.map((id, i) => {
    const said = X.clues.filter((c) => c.pid === id);
    const now = X.speaker === id;
    return `<li class="${now ? 'now' : ''} ${said.length ? 'said' : ''}" style="--i:${i}" data-key="xo-${id}"><span class="xo-n">${i + 1}</span><b>${esc(name(v, id))}</b>${said.map((c) => `<small>${c.word ? esc(c.word) : c.timeout ? '…' : glyph('check')}</small>`).join('')}</li>`;
  }).join('')}</ol>${X.rounds > 1 && X.turn < total ? `<p class="small muted center-text" data-key="xround">${th('Round {n} of {m}', { n: X.round, m: X.rounds })}</p>` : ''}`;
}

export function exorcismMain(v, me, h) {
  const { S, ring, head, chips, activePick, pickTabs } = h;
  const X = v.exorcism;
  const a = v.action || {};
  const { ctx, pick } = activePick(v);
  const peek = !!S.ui.xpeek?.[v.phaseId];
  const gridBtn = X?.grid ? `<button class="chip" data-act="xGrid" data-key="xgridbtn">${glyph('menu')}<span>${t('Word grid')}</span></button>` : '';
  const tools = gridBtn ? `<nav class="chips" data-key="xtools">${gridBtn}</nav>` : '';
  // A small ball, always in place: tap it to look again, tap again to cloud it.
  // During the turns the ball is the hero: what has been said floats on its edge.
  const ballSmall = me?.x ? myBall(v, { key: 'peekball', open: peek, small: v.phase !== 'X_CLUES', act: 'xPeek', orbit: v.phase === 'X_CLUES' ? orbitHtml(v) : '' }) : '';
  const grid = S.ui.xgrid && X?.grid ? `<div class="x-gridwrap" data-key="xgridwrap"><span class="kicker">${esc(catName(X.category))}</span>${wordGrid(v)}</div>` : '';
  let stage = '';
  switch (v.phase) {
    case 'X_REVEAL': {
      // The one reveal: the ball clouds for a breath, then clears by itself.
      // Tapping it clouds it again (and back); the confirm fades in after a few seconds.
      const open = S.ui.xopen?.[v.phaseId];
      if (open === undefined) {
        (S.ui.xopen ||= {})[v.phaseId] = false;
        setTimeout(() => { if (S.ui.xopen[v.phaseId] === false && !S.ui.xtouched?.[v.phaseId]) { S.ui.xopen[v.phaseId] = true; h.sound?.play('reveal'); h.render?.(); } }, 1500);
      }
      return `${head(v)}
        <p class="muted center-text x-hint" data-key="xrhint">${me.acknowledged ? th('Waiting for the others · {done}/{total}', v.progress) : t('Shield your screen. Remember what you see.')}</p>
        ${myBall(v, { key: 'revealball', open: !!open, big: true, act: 'xFlip' })}
        <p class="small muted center-text x-hint" data-key="xrhint2">${t(open ? 'Tap the ball to cloud it again.' : 'Tap the ball to look inside.')}</p>
        ${chips(v)}`;
    }
    case 'X_LOTTERY':
      stage = `<p class="center-text muted" data-key="xlot">${t('The lots are drawn to choose who speaks first…')}</p>`;
      break;
    case 'X_CLUES':
      if (a.type === 'xspeak') {
        stage = `<div class="x-turn me rise-in" data-key="xturn-me"><span class="kicker">${t('Your turn')}</span><h2>${t('Say one word linked to the password')}</h2>
          <p class="small muted">${t(me.x?.demon ? 'You do not know it. Listen, guess, blend in.' : 'Close enough to prove you know it. Not so close that the Demon learns it.')}</p>
          ${a.typed ? `<input class="input x-input" data-draft="xword" maxlength="32" placeholder="${esc(t('Your word'))}" value="${esc(S.drafts?.xword ?? '')}" autocomplete="off">` : ''}</div>`;
      } else {
        stage = `<div class="x-turn" data-key="xturn"><span class="kicker">${t('Now speaking')}</span><h2>${esc(name(v, X.speaker))}</h2><p class="small muted">${t('Listen closely. Who knows the password, and who is only pretending?')}</p></div>`;
      }
      stage += orderStrip(v);
      break;
    case 'X_DISCUSS':
      // The ball turns gold while the table talks; what was said floats on its edge.
      stage = `<p class="center-text x-hint" data-key="xdisc"><b>${t('Talk it over')}</b><br><span class="small muted">${t('Who does not know the password? When you are ready, tap Ready to vote.')}</span></p>
        ${myBall(v, { key: 'peekball', open: peek, act: 'xPeek', tint: TALK_TINT, orbit: orbitHtml(v), cls: 'talk' })}`;
      break;
    case 'X_VOTE':
      stage = `<p class="center-text small muted" data-key="xvote">${t(X.demonCount > 1 ? 'One vote each. Catch one of the two Demons, or they win.' : 'One vote each. Miss the Demon, and the Demon wins.')}</p>`;
      break;
    case 'X_GUESS':
      if (a.type === 'xguess') {
        stage = `<div class="x-turn me demon rise-in" data-key="xguess-me"><span class="kicker blood">${t('Caught')}</span><h2>${t('One guess at the password')}</h2></div>
          ${a.grid ? wordGrid(v, { act: 'xPickGuess', selected: S.sel.xguess ?? null }) : `<input class="input x-input" data-draft="xguess" maxlength="40" placeholder="${esc(t('The password'))}" value="${esc(S.drafts?.xguess ?? '')}" autocomplete="off">`}`;
        return `${head(v)}${stage}${chips(v)}`;
      }
      stage = `<div class="x-turn" data-key="xguess"><span class="kicker blood">${t('Caught')}</span><h2>${esc(name(v, X.named))}</h2><p class="small muted">${t('The Demon gets one guess at the password…')}</p></div>`;
      break;
    default: break;
  }
  // The vote: the ball takes the middle of the table, red and restless.
  const table = v.phase === 'X_VOTE' ? ring(v, { pick, center: '', orb: myBall(v, { key: 'peekball', open: peek, act: 'xPeek', tint: VOTE_TINT, speed: 2.4, cls: 'in-ring vote' }) }) : '';
  const small = ['X_CLUES', 'X_LOTTERY', 'X_GUESS'].includes(v.phase) ? ballSmall : '';
  return `${head(v)}${tools}${small}${grid}${pickTabs(ctx, pick)}${table}${stage}${h.chatBlock(v)}${chips(v)}`;
}

export function exorcismPicks(v, S) {
  const a = v.action;
  if (!a || a.type !== 'xvote') return [];
  return [{ key: 'xvote', label: t('Name'), act: 'xPickVote', ids: a.targets, selected: [S.sel.xvote ?? a.choice], tone: 'kill', stamp: a.choice, hint: t(a.choice ? 'Recorded · tap to change' : 'Who is the Demon?') }];
}

export function exorcismDock(v, h) {
  const { S, btn, holdBtn, rawName } = h;
  const a = v.action || {};
  const parts = [];
  switch (a.type) {
    case 'xack': if (!a.done) parts.push(btn(t('I have seen it'), 'xAck', 'btn-solid x-late')); break;
    case 'xspeak': parts.push(holdBtn('xDone', t('Hold when you have said it'), 'btn-solid')); break;
    case 'xready': parts.push(btn(a.ready ? `${glyph('check')} ${t('Ready to vote')}` : t('Ready to vote'), 'xReady', a.ready ? 'btn-ghost is-on' : 'btn-solid')); break;
    case 'xvote': {
      const sel = S.sel.xvote ?? null;
      if (sel && sel !== a.choice) parts.push(btn(th('Name {name}', { name: rawName(sel) }), 'xVote', 'btn-blood'));
      else if (a.choice) parts.push(`<span class="dock-note stamped" data-key="xv-${a.choice}">${glyph('check')} ${th('You named {name}', { name: rawName(a.choice) })}</span>`);
      break;
    }
    case 'xguess': {
      const ready = a.grid ? S.sel.xguess != null : !!(S.drafts?.xguess ?? '').trim();
      parts.push(holdBtn('xGuess', ready ? t('Hold to guess') : t(a.grid ? 'Pick a word' : 'Type the password'), 'btn-blood', { dis: !ready }));
      break;
    }
    default: break;
  }
  return parts;
}

export function exorcismActs(h) {
  const { S, V, send, render, picked, burstAt, sound, haptic } = h;
  return {
    xFlip() { const id = V().phaseId; (S.ui.xopen ||= {})[id] = !S.ui.xopen[id]; (S.ui.xtouched ||= {})[id] = true; haptic(10); sound.play(S.ui.xopen[id] ? 'reveal' : 'tap'); render(); },
    async xAck(el) { const ok = await send('x.ack', {}); if (ok) burstAt(el); },
    xPeek() { const id = V().phaseId; (S.ui.xpeek ||= {})[id] = !S.ui.xpeek[id]; haptic(8); render(); },
    xGrid() { S.ui.xgrid = !S.ui.xgrid; render(); },
    async xDone(el) {
      const ok = await send('x.done', { word: S.drafts?.xword ?? '' });
      if (ok) { if (S.drafts) S.drafts.xword = ''; burstAt(el); haptic([20, 30, 20]); }
    },
    async xReady() { const a = V().action; await send('x.ready', { ready: !a.ready }); },
    xPickVote(el) { picked(el, true); S.sel.xvote = el.dataset.id; render(); },
    async xVote(el) { const ok = await send('x.vote', { target: S.sel.xvote }); if (ok) { sound.play('stamp'); burstAt(el, { colors: ['#e2585e', '#ece5d5'] }); S.sel.xvote = null; } },
    xPickGuess(el) { S.sel.xguess = Number(el.dataset.id); haptic(8); render(); },
    async xGuess() {
      const a = V().action;
      const ok = await send('x.guess', a.grid ? { index: S.sel.xguess } : { text: S.drafts?.xguess ?? '' });
      if (ok) S.sel.xguess = null;
    },
  };
}

// ── Moments ────────────────────────────────────────────────────────────────
export function exorcismMoment(l, v, fresh, { notify, name: nm }) {
  switch (l.ev) {
    case 'x-start': return null; // the reveal happens on each phone's own screen
    case 'x-lottery': {
      const order = l.order.map((id) => ({ id, name: nm(id), av: v.players.find((p) => p.id === id)?.avatar ?? null }));
      return { type: 'mlottery', order, leader: l.leader, leaderName: nm(l.leader), idx: l.order.indexOf(l.leader), spins: l.spins ?? 2, sound: null,
        kickerText: t('The séance begins'), titleText: t('Who speaks first?'), resultText: t('The first to speak') };
    }
    case 'x-clue': if (!l.timeout) notify(l.word ? t('{a}: {word}', { a: nm(l.pid), word: l.word }) : t('{a} has spoken', { a: nm(l.pid) })); return null;
    case 'x-round': notify(t('Round {n}', { n: l.n })); return null;
    case 'x-redraw': return { type: 'call', kicker: 'The host', title: 'A new word', sub: 'This round is not scored. Look into your ball again.', sound: 'unfold' };
    case 'x-discuss': return { type: 'call', kicker: 'Every word is said', title: 'Talk it over', sub: 'Who does not know the password?', sound: 'knock' };
    case 'x-vote': return { type: 'call', kicker: 'The vote', title: 'Name the Demon', sub: 'One vote each.', sound: 'knock' };
    case 'x-votes': {
      const totals = Object.entries(l.tally ?? {}).map(([id, n]) => ({ id, name: nm(id), n, by: Object.entries(l.votes ?? {}).filter(([, tg]) => tg === id).map(([vid]) => nm(vid)) })).sort((a, b) => b.n - a.n);
      return { type: 'xvotes', totals, named: l.named ? nm(l.named) : null, demon: l.demon, tied: (l.tied ?? []).map(nm), coin: l.coin, sound: 'knock' };
    }
    case 'x-guess': return { type: 'xguess', who: nm(l.pid), said: l.said, hit: l.hit, word: l.word, category: v.exorcism?.category, sound: 'heart' };
    default: return null;
  }
}

export const X_MOMENT_TIME = { xball: 7000, xvotes: 5600, xguess: 6200 };

export function exorcismMomentHtml(m, h) {
  const { letters, onBoard, V } = h;
  const v = V();
  switch (m.type) {
    case 'xball': {
      const ball = onBoard() || !v?.me?.x
        ? ballHtml({ key: `mball-${m.id}`, kicker: esc(t('The category')), title: esc(catName(m.category)), sub: esc(t('Phones: look only at your own screen.')), big: true })
        : myBall(v, { key: `mball-${m.id}`, big: true });
      return `<span class="kicker">${t('Dead Set: Exorcism')}</span><h1 class="m-title">${letters(t('The crystal ball'))}</h1>${ball}
        <p class="m-sub small">${t(onBoard() ? 'The Living see the password. The Demon sees only the category.' : 'Shield your screen. Remember what you see.')}</p>`;
    }
    case 'xvotes': {
      const max = Math.max(1, ...m.totals.map((x) => x.n));
      const stamp = m.named ? (m.demon ? t('The Demon!') : t('One of the Living')) : t('Nobody');
      return `<span class="kicker">${t('The vote')}</span><h1 class="m-title">${letters(t('The table names'))}</h1>
        ${m.totals.length ? `<div class="ballot"><ul class="bars">${m.totals.map((x, i) => `<li style="--w:${(x.n / max) * 100}%;--d:${0.3 + i * 0.15}s"><span class="b-name">${esc(x.name)}<small>${esc(x.by.join(', '))}</small></span><span class="beads" aria-hidden="true">${'<i></i>'.repeat(Math.min(12, x.n))}</span><span class="b-n">${x.n}</span></li>`).join('')}</ul></div>` : `<p class="m-sub">${t('No votes.')}</p>`}
        ${m.tied.length ? `<p class="m-sub small">${th(m.coin ? 'Tied: {names}. A coin decides.' : 'Tied: {names}.', { names: m.tied })}</p>` : ''}
        <div class="named"><b class="named-name">${esc(m.named ?? '—')}</b></div>
        <div class="verdict-stamp" style="--d:2.4s"><span class="stamp ${m.demon ? 'gold' : ''} late">${esc(stamp)}</span></div>
        <p class="m-sub small late">${t(m.demon ? 'Caught. But the Demon may yet name the password.' : 'The Demon slips away.')}</p>`;
    }
    case 'xguess':
      return `<span class="kicker blood">${t('One last guess')}</span><h1 class="m-title">${letters(m.said ?? '…')}</h1>
        <p class="m-sub">${th('{a} guesses.', { a: m.who })}</p>
        <div class="verdict-stamp" style="--d:2.2s"><span class="stamp ${m.hit ? '' : 'gold'} late">${t(m.hit ? 'Correct' : 'Wrong')}</span></div>
        ${ballHtml({ key: `gball-${m.id}`, kicker: esc(t('The password')), title: esc(wordAt(m.category, m.word)), tint: m.hit ? DEMON_TINT : LIVING_TINT, cls: 'late' })}`;
    default: return '';
  }
}

// ── End ────────────────────────────────────────────────────────────────────
/** The end: the ball, holding the password, sits at the heart of the revealed table. */
export function endOrb(v) {
  const X = v.exorcism;
  if (!X) return '';
  return ballHtml({ key: 'endball', kicker: `${esc(t('The password'))} · ${esc(catName(X.category))}`, title: esc(wordAt(X.category, X.word)), sub: X.demons?.length ? th(X.demons.length > 1 ? 'The Demons: {names}' : 'The Demon: {names}', { names: X.demons.map((id) => name(v, id)) }) : '', tint: v.winner === 'DEMON' ? DEMON_TINT : LIVING_TINT, cls: 'in-ring' });
}

export function exorcismEndHtml(v) {
  const X = v.exorcism;
  if (!X) return '';
  const back = v.deadline ? `<p class="center-text small muted" data-key="xback">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const votes = Object.entries(X.votes ?? {});
  return `${back}
    ${X.grid ? `<section data-key="endgrid"><div class="rule">${t('The grid')}</div>${wordGrid(v, { mark: X.word, selected: X.guess?.index ?? null })}</section>` : ''}
    ${X.clues.length ? `<section data-key="endclues"><div class="rule">${t('What was said')}</div>${orderStrip(v)}</section>` : ''}
    ${votes.length ? `<section data-key="endvotes"><div class="rule">${t('Who named whom')}</div><ul class="ledger">${votes.map(([a, b]) => `<li><span class="who"><b>${esc(name(v, a))}</b><small>${glyph('magistrate')} ${esc(name(v, b))}</small></span></li>`).join('')}</ul></section>` : ''}
    ${scoreboard(v)}`;
}

// ── TV board ───────────────────────────────────────────────────────────────
/** The lobby (phone and TV): the ball takes the middle of the table. */
export const lobbyOrb = () => ballHtml({ key: 'lobbyball', cls: 'in-ring', clear: false });

export function exorcismBoard(v, h) {
  const { header, ring } = h;
  const X = v.exorcism;
  if (!X) return '';
  let now = '';
  switch (v.phase) {
    case 'X_REVEAL': now = `<p class="b-now">${t('Look into your crystal ball.')} <b>${th('{done}/{total} ready', { done: v.progress?.done ?? 0, total: v.progress?.total ?? 0 })}</b></p>`; break;
    case 'X_LOTTERY': now = `<p class="b-now">${t('The lots are drawn…')}</p>`; break;
    case 'X_CLUES': now = `<p class="b-now">${th('Now speaking: {a}', { a: name(v, X.speaker) })}</p>`; break;
    case 'X_DISCUSS': now = `<p class="b-now">${t('Talk it over: who does not know the password?')} <b>${th('{done}/{total} ready to vote', { done: v.progress?.done ?? 0, total: v.progress?.total ?? 0 })}</b></p>`; break;
    case 'X_VOTE': now = `<p class="b-now blood">${t('Name the Demon.')} <b>${th('{done}/{total} votes in', { done: v.progress?.done ?? 0, total: v.progress?.total ?? 0 })}</b></p>`; break;
    case 'X_GUESS': now = `<p class="b-now blood">${th('{a} is caught and gets one guess…', { a: name(v, X.named) })}</p>`; break;
    case 'ENDED': now = `<p class="b-now">${t(v.winner === 'DEMON' ? 'The Demon wins.' : 'The Living win.')}</p>`; break;
    default: break;
  }
  const ended = v.phase === 'ENDED';
  const ball = ended
    ? ballHtml({ key: 'tvball', kicker: `${esc(t('The password'))} · ${esc(catName(X.category))}`, title: esc(wordAt(X.category, X.word)), sub: X.demons?.length ? th(X.demons.length > 1 ? 'The Demons: {names}' : 'The Demon: {names}', { names: X.demons.map((id) => name(v, id)) }) : '', tint: v.winner === 'DEMON' ? DEMON_TINT : LIVING_TINT, big: true })
    : v.phase === 'X_DISCUSS'
      ? ballHtml({ key: 'tvball', kicker: esc(t('The category')), title: esc(catName(X.category)), big: true, tint: TALK_TINT, orbit: orbitHtml(v), cls: 'talk' })
      : ballHtml({ key: 'tvball', kicker: esc(t('The category')), title: esc(catName(X.category)), sub: X.hint !== 'none' ? esc(t('The Demon hears a whisper.')) : '', big: true, orbit: v.phase === 'X_CLUES' ? orbitHtml(v) : '' });
  // The vote on the TV: everyone around a red, restless ball; a tick for each vote in.
  if (ended && ring) {
    return `<main class="board2 xboard is-ended" data-key="board-x">${header}
    <div class="x-cols">
      <section class="x-left">${ring(v, { center: '', reveal: true, orb: endOrb(v) })}${now}</section>
      <aside class="x-right">${X.grid ? `<div class="b-grid"><span class="kicker">${t('The grid')}</span>${wordGrid(v, { mark: X.word, selected: X.guess?.index ?? null })}</div>` : ''}${scoreboard(v)}</aside>
    </div></main>`;
  }
  if (v.phase === 'X_VOTE' && ring) {
    const marks = Object.fromEntries((X.voted ?? []).map((id) => [id, glyph('check')]));
    const orb = ballHtml({ key: 'tvball', kicker: esc(t('The category')), title: esc(catName(X.category)), tint: VOTE_TINT, speed: 2.4, cls: 'in-ring vote' });
    return `<main class="board2 xboard" data-key="board-x">${header}
    <div class="x-cols">
      <section class="x-left">${ring(v, { center: '', orb, marks })}${now}</section>
      <aside class="x-right">${X.grid ? `<div class="b-grid"><span class="kicker">${t('The grid')}</span>${wordGrid(v)}</div>` : ''}${scoreboard(v)}</aside>
    </div></main>`;
  }
  return `<main class="board2 xboard ${ended ? 'is-ended' : ''}" data-key="board-x">${header}
    <div class="x-cols">
      <section class="x-left">${ball}${now}${orderStrip(v)}</section>
      <aside class="x-right">${X.grid ? `<div class="b-grid"><span class="kicker">${t('The grid')}</span>${wordGrid(v, { mark: ended ? X.word : null, selected: X.guess?.index ?? null })}</div>` : ''}${scoreboard(v)}</aside>
    </div></main>`;
}
