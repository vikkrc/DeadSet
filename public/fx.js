// Dead Set — sensory layer: synthesized sound, haptics and particles.
//
// Privacy rule: sound and haptics fire only for PUBLIC events (phase changes,
// dawn, votes, the verdict) or for the player's own taps, which everyone makes
// at the same moments anyway. Nothing private (your role, a Mentalist reading,
// a Premonition) ever makes a noise, a buzz or a burst someone could notice
// from across the table.

const calm = matchMedia('(prefers-reduced-motion: reduce)');
let ctx = null;
let master = null;
let soundOn = localStorage.getItem('deadset:sound') !== 'off';

function audio() {
  if (!soundOn) return null;
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.32;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(a, { freq, type = 'sine', dur = 1, gain = 0.3, attack = 0.005, at = 0, to = null }) {
  const t = a.currentTime + at;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(a, { dur = 0.3, gain = 0.3, type = 'lowpass', freq = 800, q = 0.8, at = 0, sweep = null, attack = 0.004 }) {
  const t = a.currentTime + at;
  const len = Math.ceil(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + dur);
  f.Q.value = q;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t);
}

const bell = (a, f, at = 0, gain = 0.18, dur = 2.6) => {
  [[1, 1], [2.76, 0.45], [5.4, 0.22], [8.93, 0.1]].forEach(([m, g]) => tone(a, { freq: f * m, dur: dur / Math.sqrt(m), gain: gain * g, at }));
};

const SOUNDS = {
  tap: (a) => tone(a, { freq: 720, type: 'triangle', dur: 0.05, gain: 0.05 }),
  pick: (a) => { tone(a, { freq: 540, type: 'triangle', dur: 0.08, gain: 0.07 }); tone(a, { freq: 810, type: 'triangle', dur: 0.1, gain: 0.05, at: 0.035 }); },
  unpick: (a) => tone(a, { freq: 420, type: 'triangle', dur: 0.08, gain: 0.05, to: 300 }),
  stamp: (a) => { noise(a, { dur: 0.16, gain: 0.45, freq: 700 }); tone(a, { freq: 110, dur: 0.22, gain: 0.35, to: 55 }); },
  knock: (a) => { noise(a, { dur: 0.07, gain: 0.35, freq: 500, q: 2 }); noise(a, { dur: 0.07, gain: 0.3, freq: 460, q: 2, at: 0.13 }); },
  tick: (a) => tone(a, { freq: 1500, type: 'square', dur: 0.025, gain: 0.025 }),
  sleep: (a) => noise(a, { dur: 0.9, gain: 0.12, type: 'bandpass', freq: 1800, sweep: 300, q: 1.2, attack: 0.25 }),
  reveal: (a) => [1046, 1318, 1568, 2093].forEach((f, i) => tone(a, { freq: f, dur: 0.9, gain: 0.04, at: i * 0.06 })),
  night: (a) => {
    tone(a, { freq: 55, dur: 3.2, gain: 0.32, attack: 0.9 });
    tone(a, { freq: 82.4, dur: 3, gain: 0.14, attack: 1.1 });
    noise(a, { dur: 3, gain: 0.08, type: 'bandpass', freq: 400, sweep: 160, q: 0.7, attack: 1.2 });
    bell(a, 196, 0.6, 0.08, 3.5);
  },
  dawn: (a) => { bell(a, 523.25, 0, 0.16); bell(a, 783.99, 0.28, 0.1); noise(a, { dur: 2, gain: 0.04, type: 'highpass', freq: 3000, attack: 0.8 }); },
  death: (a) => {
    tone(a, { freq: 70, dur: 1.8, gain: 0.6, to: 32, attack: 0.01 });
    noise(a, { dur: 1.2, gain: 0.3, freq: 240, sweep: 60 });
    bell(a, 138.6, 0.05, 0.06, 3);
  },
  gavel: (a) => { SOUNDS.stamp(a); bell(a, 220, 0.12, 0.08, 2); },
  win: (a) => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => bell(a, f, i * 0.16, 0.11, 3)),
  lose: (a) => [392, 349.23, 311.13, 261.63].forEach((f, i) => bell(a, f, i * 0.22, 0.09, 2.6)),
  whoosh: (a) => noise(a, { dur: 0.5, gain: 0.1, type: 'bandpass', freq: 600, sweep: 2400, q: 0.8, attack: 0.15 }),
  crack: (a) => { noise(a, { dur: 0.09, gain: 0.5, type: 'highpass', freq: 2500 }); noise(a, { dur: 0.25, gain: 0.3, freq: 900, at: 0.03 }); tone(a, { freq: 160, dur: 0.3, gain: 0.25, to: 70, at: 0.02 }); },
  unfold: (a) => noise(a, { dur: 0.7, gain: 0.08, type: 'bandpass', freq: 3200, sweep: 1200, q: 0.6, attack: 0.2 }),
  thud: (a) => { tone(a, { freq: 90, dur: 0.35, gain: 0.35, to: 48 }); noise(a, { dur: 0.12, gain: 0.18, freq: 300 }); },
  heart: (a) => { tone(a, { freq: 62, dur: 0.22, gain: 0.55, to: 40 }); tone(a, { freq: 58, dur: 0.26, gain: 0.4, to: 38, at: 0.24 }); },
  page: (a) => { noise(a, { dur: 0.35, gain: 0.12, type: 'bandpass', freq: 2200, sweep: 900, q: 0.7, attack: 0.05 }); },
};

export const sound = {
  get on() { return soundOn; },
  toggle() {
    soundOn = !soundOn;
    localStorage.setItem('deadset:sound', soundOn ? 'on' : 'off');
    if (soundOn) this.play('pick');
    else score.stop();
    return soundOn;
  },
  unlock() { if (soundOn) audio(); },
  play(name) {
    const a = audio();
    if (!a || !SOUNDS[name]) return;
    try { SOUNDS[name](a); } catch { /* audio is a nicety */ }
  },
};

// ── The score: generated ambient music for the TV board ────────────────────
// Each mood is a slow detuned pad, a bed of wind and occasional bells. Moods
// crossfade over a few seconds. Only the TV board ever plays the score.
const MOODS = {
  lobby: { root: 98, chord: [1, 1.5, 2.25], cutoff: 650, bells: [392, 440, 587, 659], every: [6, 11], wind: 0.012, gain: 0.5 },
  day: { root: 110, chord: [1, 1.2, 1.5, 2], cutoff: 820, bells: [440, 523, 587, 659, 784], every: [5, 9], wind: 0.01, gain: 0.45 },
  vote: { root: 73.4, chord: [1, 1.19, 1.5], cutoff: 620, bells: [], every: null, wind: 0.012, gain: 0.5, pulse: true },
  night: { root: 55, chord: [1, 1.5, 2, 3], cutoff: 380, bells: [392, 466, 523, 622, 698], every: [3, 7], wind: 0.05, gain: 0.6 },
  end: { root: 65.4, chord: [1, 1.25, 1.5, 2], cutoff: 900, bells: [523, 659, 784, 1046], every: [2, 5], wind: 0.01, gain: 0.45 },
};
let bus = null;
let layer = null;
let bellTimer = null;
let pulseTimer = null;
function scoreBus(a) {
  if (!bus) { bus = a.createGain(); bus.gain.value = 0.9; bus.connect(master); }
  return bus;
}
function buildLayer(a, mood) {
  const m = MOODS[mood];
  const out = a.createGain();
  out.gain.value = 0.0001;
  out.connect(scoreBus(a));
  const filt = a.createBiquadFilter();
  filt.type = 'lowpass'; filt.frequency.value = m.cutoff; filt.Q.value = 0.7;
  filt.connect(out);
  const lfo = a.createOscillator(); lfo.frequency.value = 0.045;
  const lfoAmt = a.createGain(); lfoAmt.gain.value = m.cutoff * 0.35;
  lfo.connect(lfoAmt).connect(filt.frequency);
  const nodes = [lfo];
  m.chord.forEach((r, i) => {
    for (const det of [-4, 4]) {
      const o = a.createOscillator();
      o.type = i === 0 ? 'sine' : 'triangle';
      o.frequency.value = m.root * r;
      o.detune.value = det + i * 1.5;
      const g = a.createGain(); g.gain.value = (i === 0 ? 0.16 : 0.07) / m.chord.length * 3;
      o.connect(g).connect(filt);
      nodes.push(o);
    }
  });
  // wind: looping filtered noise
  const len = a.sampleRate * 4;
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
  const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 0.6;
  const wlfo = a.createOscillator(); wlfo.frequency.value = 0.07;
  const wAmt = a.createGain(); wAmt.gain.value = 260;
  wlfo.connect(wAmt).connect(bp.frequency);
  const wg = a.createGain(); wg.gain.value = m.wind;
  src.connect(bp).connect(wg).connect(out);
  nodes.push(src, wlfo);
  nodes.forEach((n) => n.start());
  out.gain.exponentialRampToValueAtTime(m.gain, a.currentTime + 3.5);
  return { out, nodes, mood };
}
function dropLayer(a, l) {
  if (!l) return;
  const t = a.currentTime;
  l.out.gain.cancelScheduledValues(t);
  l.out.gain.setValueAtTime(Math.max(0.0001, l.out.gain.value), t);
  l.out.gain.exponentialRampToValueAtTime(0.0001, t + 3);
  setTimeout(() => { l.nodes.forEach((n) => { try { n.stop(); } catch { /* stopped */ } }); l.out.disconnect(); }, 3300);
}
export const score = {
  get mood() { return layer?.mood ?? null; },
  play(mood) {
    if (!MOODS[mood]) return;
    const a = audio();
    if (!a) { this.stop(); return; }
    if (layer?.mood === mood) return;
    dropLayer(a, layer);
    layer = buildLayer(a, mood);
    clearTimeout(bellTimer); clearInterval(pulseTimer);
    const m = MOODS[mood];
    const ring = () => {
      if (!layer || layer.mood !== mood) return;
      if (m.bells.length) bell(a, m.bells[Math.floor(Math.random() * m.bells.length)] / 2, 0, 0.05, 4);
      bellTimer = setTimeout(ring, (m.every[0] + Math.random() * (m.every[1] - m.every[0])) * 1000);
    };
    if (m.every) bellTimer = setTimeout(ring, 1500);
    if (m.pulse) pulseTimer = setInterval(() => { const x = audio(); if (x) tone(x, { freq: 880, type: 'sine', dur: 0.05, gain: 0.025 }); }, 1000);
  },
  stop() {
    clearTimeout(bellTimer); clearInterval(pulseTimer);
    if (ctx && layer) dropLayer(ctx, layer);
    layer = null;
  },
};

export function haptic(pattern = 8) {
  if (calm.matches) return;
  try { navigator.vibrate?.(pattern); } catch { /* unsupported */ }
}

// ── Particles ──────────────────────────────────────────────────────────────
let canvas = null;
let c2 = null;
let parts = [];
let raf = 0;
let ambientMode = null;
let W = 0;
let H = 0;

function ensure() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  c2 = canvas.getContext('2d');
  const size = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    c2.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  window.addEventListener('resize', size);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
}

const rand = (a, b) => a + Math.random() * (b - a);

function kick() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(loop);
}

function loop() {
  raf = 0;
  c2.clearRect(0, 0, W, H);
  const now = performance.now();
  parts = parts.filter((p) => p.life > 0);
  for (const p of parts) {
    p.vx *= p.drag; p.vy = p.vy * p.drag + p.g;
    if (p.sway) p.vx += Math.sin(now / 400 + p.phase) * p.sway;
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    p.life -= p.decay;
    if (p.kind === 'mote') {
      p.life = 1;
      if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
      if (ambientMode !== 'night') p.dead = true;
    }
    draw(p);
  }
  parts = parts.filter((p) => !p.dead);
  if (parts.length && !document.hidden) raf = requestAnimationFrame(loop);
}

function draw(p) {
  const a = Math.max(0, Math.min(1, p.life)) * p.alpha;
  c2.save();
  c2.globalAlpha = a;
  c2.translate(p.x, p.y);
  c2.rotate(p.rot);
  c2.fillStyle = p.color;
  switch (p.kind) {
    case 'spark':
      c2.shadowColor = p.color; c2.shadowBlur = 8;
      c2.beginPath(); c2.arc(0, 0, p.size, 0, Math.PI * 2); c2.fill();
      break;
    case 'slip':
      c2.scale(1, Math.cos(p.rot * 2));
      c2.fillRect(-p.size, -p.size * 0.35, p.size * 2, p.size * 0.7);
      break;
    case 'petal':
      c2.beginPath(); c2.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2); c2.fill();
      break;
    case 'tri':
      c2.beginPath(); c2.moveTo(0, -p.size); c2.lineTo(p.size, p.size); c2.lineTo(-p.size, p.size); c2.closePath(); c2.fill();
      break;
    default:
      c2.beginPath(); c2.arc(0, 0, p.size, 0, Math.PI * 2); c2.fill();
  }
  c2.restore();
}

function add(p) {
  parts.push({ vx: 0, vy: 0, g: 0, drag: 0.98, rot: 0, vr: 0, life: 1, decay: 0.015, alpha: 1, size: 3, sway: 0, phase: Math.random() * 6, kind: 'spark', color: '#ece5d5', ...p });
}

/** Small burst from a point (e.g. a confirmed tap). */
export function burst(x, y, { colors = ['#ece5d5', '#bdb4a4'], count = 14, power = 3.2 } = {}) {
  if (calm.matches) return;
  ensure();
  for (let i = 0; i < count; i++) {
    const ang = rand(0, Math.PI * 2);
    const sp = rand(power * 0.4, power);
    add({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.6, g: 0.06, drag: 0.94, size: rand(1, 2.4), decay: rand(0.025, 0.045), color: colors[i % colors.length] });
  }
  kick();
}

export function burstAt(el, opts) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, opts);
}

/** Victory / defeat celebrations, themed per outcome. */
export function celebrate(kind) {
  if (calm.matches) return;
  ensure();
  if (kind === 'DEATH') {
    // crimson petals and ash drifting down
    for (let i = 0; i < 90; i++) {
      add({ kind: i % 3 ? 'petal' : 'spark', x: rand(0, W), y: rand(-H * 0.6, -10), vx: rand(-0.4, 0.4), vy: rand(0.8, 2.2), g: 0.004, drag: 0.995, sway: 0.03,
        vr: rand(-0.05, 0.05), rot: rand(0, 6), size: i % 3 ? rand(4, 8) : rand(1, 2), decay: rand(0.002, 0.004),
        color: ['#b3242d', '#e2585e', '#7e1820', '#5d564d'][i % 4] });
    }
  } else if (kind === 'JESTER') {
    for (let i = 0; i < 120; i++) {
      const left = i % 2 === 0;
      add({ kind: i % 3 === 0 ? 'tri' : 'slip', x: left ? -10 : W + 10, y: H * rand(0.55, 0.85), vx: (left ? 1 : -1) * rand(4, 11), vy: rand(-12, -5), g: 0.22, drag: 0.985,
        vr: rand(-0.3, 0.3), size: rand(3, 6), decay: rand(0.004, 0.008), color: ['#ece5d5', '#e2585e', '#d6a24a', '#8fb59a'][i % 4] });
    }
  } else if (kind === 'NON_DEATH' || kind === 'win') {
    // embers and bone paper slips rising from the bottom like candle sparks
    for (let i = 0; i < 130; i++) {
      add({ kind: i % 2 ? 'spark' : 'slip', x: rand(W * 0.1, W * 0.9), y: H + rand(0, 60), vx: rand(-2.2, 2.2), vy: rand(-15, -7), g: 0.2, drag: 0.985, sway: 0.02,
        vr: rand(-0.25, 0.25), size: i % 2 ? rand(1.2, 2.6) : rand(3, 6), decay: rand(0.005, 0.01),
        color: ['#ece5d5', '#e9c27a', '#d6964f', '#bdb4a4'][i % 4] });
    }
  } else {
    for (let i = 0; i < 40; i++) add({ kind: 'spark', x: rand(0, W), y: rand(0, H), vx: rand(-0.3, 0.3), vy: rand(-0.6, -0.1), size: rand(1, 2), decay: rand(0.004, 0.008), color: '#bdb4a4', alpha: 0.6 });
  }
  kick();
}

/** Very faint drifting motes at night. */
export function ambient(mode) {
  if (mode === ambientMode) return;
  ambientMode = mode;
  if (calm.matches || mode !== 'night') return;
  ensure();
  for (let i = 0; i < 26; i++) {
    add({ kind: 'mote', x: rand(0, W), y: rand(0, H), vx: rand(-0.08, 0.08), vy: rand(-0.35, -0.08), drag: 1, sway: 0.004, size: rand(0.6, 1.6), alpha: rand(0.12, 0.35), color: '#a9bcd0' });
  }
  kick();
}
