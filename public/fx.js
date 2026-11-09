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

// Each played sound is nudged a few cents up or down, so repeats never sound canned.
let vary = 1;
function tone(a, { freq, type = 'sine', dur = 1, gain = 0.3, attack = 0.005, at = 0, to = null, dest = null, detune = 0 }) {
  const t = a.currentTime + at;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq * vary, t);
  if (detune) o.detune.value = detune;
  if (to) o.frequency.exponentialRampToValueAtTime(to * vary, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(dest || master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

const noiseBuf = new Map();
function noise(a, { dur = 0.3, gain = 0.3, type = 'lowpass', freq = 800, q = 0.8, at = 0, sweep = null, attack = 0.004, dest = null }) {
  const t = a.currentTime + at;
  const len = Math.ceil(a.sampleRate * Math.min(dur, 4));
  let buf = noiseBuf.get(len);
  if (!buf) {
    buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf.set(len, buf);
  }
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
  src.connect(f).connect(g).connect(dest || master);
  src.start(t);
}

const bell = (a, f, at = 0, gain = 0.18, dur = 2.6, dest = null) => {
  [[1, 1], [2.76, 0.45], [5.4, 0.22], [8.93, 0.1]].forEach(([m, g]) => tone(a, { freq: f * m, dur: dur / Math.sqrt(m), gain: gain * g, at, dest }));
};
/** A slightly out-of-tune music box: sweet, but wrong. */
const box = (a, f, at = 0, gain = 0.06, dest = null) => {
  const det = (Math.random() - 0.5) * 18;
  tone(a, { freq: f, dur: 1.8, gain, at, dest, detune: det });
  tone(a, { freq: f * 2, dur: 0.7, gain: gain * 0.35, at, dest, detune: det });
  tone(a, { freq: f * 3.01, dur: 0.35, gain: gain * 0.12, at, dest });
};
/** A plucked low string (filtered saw with a fast decay). */
function pluck(a, f, at = 0, gain = 0.12, dest = null, bright = 900) {
  const t = a.currentTime + at;
  const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
  const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3;
  lp.frequency.setValueAtTime(bright, t); lp.frequency.exponentialRampToValueAtTime(120, t + 0.35);
  const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  o.connect(lp).connect(g).connect(dest || master);
  o.start(t); o.stop(t + 0.55);
}
const heartbeat = (a, at = 0, gain = 0.5, dest = null) => {
  tone(a, { freq: 62, dur: 0.22, gain, to: 40, at, dest });
  tone(a, { freq: 58, dur: 0.26, gain: gain * 0.75, to: 38, at: at + 0.24, dest });
};
const semi = (f, n) => f * 2 ** (n / 12);

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
    const v = Math.floor(Math.random() * 3);
    tone(a, { freq: 55, dur: 3.2, gain: 0.32, attack: 0.9 });
    tone(a, { freq: v === 1 ? 77.8 : 82.4, dur: 3, gain: 0.14, attack: 1.1 });
    noise(a, { dur: 3, gain: 0.08, type: 'bandpass', freq: 400, sweep: 160, q: 0.7, attack: 1.2 });
    if (v === 2) [392, 370, 311, 294].forEach((f, i) => box(a, f, 0.8 + i * 0.42, 0.05));
    else bell(a, v ? 185 : 196, 0.6, 0.08, 3.5);
  },
  dawn: (a) => {
    const v = Math.floor(Math.random() * 3);
    const root = [523.25, 493.88, 587.33][v];
    bell(a, root, 0, 0.16); bell(a, semi(root, 7), 0.28, 0.1);
    if (v === 2) bell(a, semi(root, 10), 0.56, 0.07);
    noise(a, { dur: 2, gain: 0.04, type: 'highpass', freq: 3000, attack: 0.8 });
  },
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
  heart: (a) => heartbeat(a),
  // Missions: card flips and verdicts.
  flip: (a) => { noise(a, { dur: 0.12, gain: 0.22, type: 'bandpass', freq: 2600, sweep: 900, q: 0.9 }); tone(a, { freq: 300, dur: 0.06, gain: 0.08, at: 0.05 }); },
  goodCard: (a) => { SOUNDS.flip(a); bell(a, 880, 0.08, 0.07, 1.6); bell(a, 1318.5, 0.16, 0.05, 1.8); },
  badCard: (a) => { SOUNDS.flip(a); SOUNDS.crack(a); tone(a, { freq: 98, type: 'sawtooth', dur: 0.9, gain: 0.07, to: 49, at: 0.1 }); },
  missionOk: (a) => [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => bell(a, f, i * 0.12, 0.08, 2.4)),
  missionFail: (a) => { SOUNDS.stamp(a); [196, 185, 174.6].forEach((f, i) => tone(a, { freq: f, type: 'sawtooth', dur: 1.4, gain: 0.05, at: 0.15 + i * 0.25, to: f * 0.8 })); },
  approve: (a) => { bell(a, 783.99, 0, 0.07, 1.4); bell(a, 1046.5, 0.1, 0.06, 1.6); },
  page: (a) => { noise(a, { dur: 0.35, gain: 0.12, type: 'bandpass', freq: 2200, sweep: 900, q: 0.7, attack: 0.05 }); },
  // ── Public event stings ──
  /** An accusation: a knock and a sting that climbs with every voice joining it. */
  accuse: (a, k = 1) => {
    SOUNDS.knock(a);
    const f = semi(196, Math.min(12, (k - 1) * 3));
    tone(a, { freq: f, type: 'triangle', dur: 0.9, gain: 0.08, at: 0.2, attack: 0.02 });
    tone(a, { freq: semi(f, 6), type: 'sine', dur: 0.8, gain: 0.05, at: 0.24 });
    if (k > 2) noise(a, { dur: 0.6, gain: 0.05, type: 'bandpass', freq: 1200, sweep: 3000, q: 4, at: 0.2 });
  },
  shot: (a) => {
    noise(a, { dur: 0.12, gain: 0.7, type: 'highpass', freq: 1200 });
    tone(a, { freq: 120, dur: 0.5, gain: 0.5, to: 38 });
    noise(a, { dur: 1.6, gain: 0.08, type: 'lowpass', freq: 900, sweep: 200, at: 0.15, attack: 0.05 });
    noise(a, { dur: 0.1, gain: 0.12, type: 'highpass', freq: 1500, at: 0.42 });
  },
  immunity: (a) => { bell(a, 659.25, 0, 0.09, 2); bell(a, 987.77, 0.12, 0.07, 2.2); },
  spot: (a) => { tone(a, { freq: 220, dur: 1.4, gain: 0.06, attack: 0.5 }); tone(a, { freq: 330, dur: 1.3, gain: 0.04, attack: 0.6 }); },
  revive: (a) => {
    noise(a, { dur: 1.6, gain: 0.07, type: 'bandpass', freq: 300, sweep: 4000, q: 1, attack: 1.4 });
    [261.63, 311.13, 392, 466.16].forEach((f, i) => tone(a, { freq: f, dur: 1.4, gain: 0.05, at: 0.9 + i * 0.12, attack: 0.3 }));
  },
  scapegoat: (a) => { tone(a, { freq: 233, type: 'sawtooth', dur: 0.9, gain: 0.05, to: 110 }); SOUNDS.death(a); },
  bloodmoon: (a) => {
    // a long gong, a swell sucked backwards, and a dissonant choir hit
    [[1, 1], [1.48, 0.6], [2.31, 0.35], [3.17, 0.2]].forEach(([m, g]) => tone(a, { freq: 55 * m, dur: 6 / Math.sqrt(m), gain: 0.28 * g, attack: 0.02 }));
    noise(a, { dur: 2.2, gain: 0.12, type: 'bandpass', freq: 200, sweep: 1800, q: 0.9, attack: 2 });
    [110, 116.54, 164.81].forEach((f) => tone(a, { freq: f, type: 'sawtooth', dur: 3, gain: 0.025, attack: 1.2, at: 1.6 }));
  },
  // ── Endings: one theme per outcome ──
  winDeath: (a) => {
    [0, 1.4, 2.8].forEach((at, i) => bell(a, [130.81, 123.47, 110][i], at, 0.16, 4.5));
    tone(a, { freq: 41.2, dur: 5, gain: 0.35, attack: 0.8 });
    [392, 349.23, 311.13, 293.66, 261.63].forEach((f, i) => box(a, f, 0.6 + i * 0.5, 0.05));
  },
  winLiving: (a) => {
    // a bright rising fanfare, a warm major chord, and fireworks crackling overhead
    [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => bell(a, f, i * 0.13, 0.11, 3.4));
    [[130.81, 0.16], [164.81, 0.1], [196, 0.1], [261.63, 0.08]].forEach(([f, g]) => tone(a, { freq: f, type: 'triangle', dur: 4.5, gain: g, attack: 0.5, at: 0.9 }));
    [523.25, 659.25, 783.99].forEach((f, i) => tone(a, { freq: f, type: 'triangle', dur: 0.5, gain: 0.06, at: 1 + i * 0.09 }));
    for (let i = 0; i < 8; i++) {
      const at = 0.6 + i * 0.45 + Math.random() * 0.12;
      noise(a, { dur: 0.08, gain: 0.22, type: 'highpass', freq: 1800, at });
      tone(a, { freq: 95, dur: 0.35, gain: 0.18, to: 50, at });
      for (let k = 0; k < 5; k++) noise(a, { dur: 0.03, gain: 0.06, type: 'highpass', freq: 5000, at: at + 0.12 + k * 0.05 + Math.random() * 0.04 });
    }
    noise(a, { dur: 3.5, gain: 0.03, type: 'highpass', freq: 6000, attack: 1.2, at: 3 });
  },
  winJester: (a) => {
    [523.25, 554.37, 659.25, 622.25, 783.99, 739.99, 1046.5].forEach((f, i) => box(a, f, i * 0.13, 0.07));
    tone(a, { freq: 300, type: 'triangle', dur: 0.8, gain: 0.05, to: 900, at: 1 });
    tone(a, { freq: 900, type: 'triangle', dur: 0.6, gain: 0.04, to: 200, at: 1.8 });
  },
  winLovers: (a) => {
    // a tender waltz of music box and warm bells
    [[523.25, 0], [659.25, 0.5], [783.99, 1], [659.25, 1.5], [880, 2], [783.99, 2.6]].forEach(([f, at]) => box(a, f, at, 0.07));
    [[261.63, 0], [329.63, 1], [392, 2]].forEach(([f, at]) => tone(a, { freq: f, type: 'triangle', dur: 1.6, gain: 0.08, attack: 0.3, at }));
    bell(a, 1046.5, 2.9, 0.06, 3);
  },
  winCult: (a) => {
    // a chanted minor chord swelling under a single tolling bell
    [[110, 0], [130.81, 0.15], [164.81, 0.3], [220, 0.45]].forEach(([f, at]) => tone(a, { freq: f, type: 'sawtooth', dur: 4.5, gain: 0.025, attack: 1.4, at }));
    [0, 1.6, 3.2].forEach((at) => bell(a, 146.83, at, 0.12, 3.5));
    noise(a, { dur: 3.5, gain: 0.05, type: 'bandpass', freq: 300, sweep: 900, q: 1.2, attack: 1.5 });
  },
  winRipper: (a) => {
    // three blade swishes, a low thud, and a cold high whine
    [0, 0.42, 0.82].forEach((at) => { noise(a, { dur: 0.22, gain: 0.25, type: 'highpass', freq: 2500, sweep: 6000, at, attack: 0.02 }); tone(a, { freq: 1800, dur: 0.18, gain: 0.03, to: 600, at }); });
    tone(a, { freq: 55, dur: 2.5, gain: 0.45, to: 30, at: 1.2 });
    tone(a, { freq: 2637, type: 'sine', dur: 3, gain: 0.015, attack: 1, at: 1.4 });
    [261.63, 246.94, 233.08].forEach((f, i) => box(a, f, 1.8 + i * 0.6, 0.05));
  },
  coin: (a) => {
    // a flick, the coin ringing as it spins, and the landing
    tone(a, { freq: 2400, type: 'triangle', dur: 0.08, gain: 0.08 });
    for (let i = 0; i < 9; i++) tone(a, { freq: 3100 + (i % 2) * 200, dur: 0.05, gain: 0.03 * (1 - i / 10), at: 0.15 + i * 0.13 });
    noise(a, { dur: 0.08, gain: 0.25, type: 'highpass', freq: 1800, at: 1.45 });
    bell(a, 1975.5, 1.48, 0.05, 1.5);
  },
  draw: (a) => { [[110, 0], [164.81, 0.4], [146.83, 1.2]].forEach(([f, at]) => tone(a, { freq: f, dur: 3.5, gain: 0.1, attack: 0.8, at })); },
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
  play(name, arg) {
    const a = audio();
    if (!a || !SOUNDS[name]) return;
    vary = 1 + (Math.random() - 0.5) * 0.035;
    try { SOUNDS[name](a, arg); } catch { /* audio is a nicety */ } finally { vary = 1; }
  },
};

// ── The score: generated music for the TV board ────────────────────────────
// Every mood is built from a few voices over a slow pad and wind:
//   motif  – short music-box or bell phrases, a random walk on the mood's scale
//   pluck  – a low plucked ostinato that drives the day
//   heart  – a heartbeat pulse for votes and verdicts
//   choir  – formant-filtered voices for the night and the Blood Moon
//   swell  – rare low surges
// Each time a mood starts it picks a fresh transposition and phrase seed, so
// the same phase never sounds identical twice. Only the TV board plays it.
const MOODS = {
  lobby: { root: 98, scale: [0, 2, 3, 5, 7, 9, 10], chord: [1, 1.5, 2.25], cutoff: 650, wind: 0.012, gain: 0.5, motif: { voice: 'box', every: [8, 14], len: [3, 4], beat: 0.85, oct: 4 } },
  ceremony: { root: 73.4, scale: [0, 2, 3, 5, 7, 8, 10], chord: [1, 1.5, 2], cutoff: 520, wind: 0.02, gain: 0.55, choir: 0.018, motif: { voice: 'bell', every: [6, 10], len: [2, 3], beat: 1.15, oct: 3 }, swell: [9, 15] },
  morning: { root: 110, scale: [0, 2, 3, 7, 9], chord: [1, 1.2, 1.5, 2], cutoff: 820, wind: 0.008, gain: 0.45, motif: { voice: 'bell', every: [7, 12], len: [3, 4], beat: 0.8, oct: 3 } },
  discussion: { root: 110, scale: [0, 2, 3, 5, 7, 8, 10], chord: [1, 1.2, 1.5], cutoff: 700, wind: 0.008, gain: 0.42, pluck: { bpm: 72, pattern: [1, 0, 0, 1, 0, 1, 0, 0], notes: [0, 0, 7, 3] }, motif: { voice: 'box', every: [10, 16], len: [2, 4], beat: 0.7, oct: 4 } },
  defense: { root: 98, scale: [0, 1, 3, 5, 7, 8, 10], chord: [1, 1.19, 1.5], cutoff: 600, wind: 0.01, gain: 0.45, pluck: { bpm: 60, pattern: [1, 0, 0, 0, 1, 0, 1, 0], notes: [0, 1, 0, 7] }, choir: 0.008 },
  vote: { root: 73.4, scale: [0, 1, 3, 5, 7, 8, 10], chord: [1, 1.19, 1.5], cutoff: 620, wind: 0.012, gain: 0.5, heart: 72, motif: { voice: 'box', every: [6, 10], len: [2, 3], beat: 0.6, oct: 4 } },
  resolving: { root: 69.3, scale: [0, 1, 4, 5, 7, 8, 11], chord: [1, 1.19, 1.41], cutoff: 560, wind: 0.015, gain: 0.5, heart: 96, swell: [5, 9] },
  night: { root: 55, scale: [0, 2, 3, 5, 7, 8, 10], chord: [1, 1.5, 2, 3], cutoff: 380, wind: 0.05, gain: 0.6, choir: 0.01, shimmer: 0.006, motif: { voice: 'box', every: [9, 16], len: [3, 5], beat: 1.05, oct: 5 } },
  bloodmoon: { root: 51.9, scale: [0, 1, 4, 5, 6, 8, 10], chord: [1, 1.06, 1.5, 2], cutoff: 420, wind: 0.06, gain: 0.62, choir: 0.03, heart: 56, swell: [4, 8], motif: { voice: 'bell', every: [5, 8], len: [2, 3], beat: 0.9, oct: 3 } },
  endDeath: { root: 65.4, scale: [0, 2, 3, 5, 7, 8, 10], chord: [1, 1.19, 1.5, 2], cutoff: 700, wind: 0.02, gain: 0.5, choir: 0.02, motif: { voice: 'bell', every: [5, 8], len: [1, 2], beat: 1.3, oct: 2 } },
  endLiving: { root: 87.3, scale: [0, 2, 4, 5, 7, 9, 11], chord: [1, 1.25, 1.5, 2], cutoff: 950, wind: 0.008, gain: 0.45, motif: { voice: 'bell', every: [4, 7], len: [3, 5], beat: 0.55, oct: 3 } },
  endJester: { root: 98, scale: [0, 1, 4, 6, 7, 10], chord: [1, 1.26, 1.5], cutoff: 900, wind: 0.008, gain: 0.45, pluck: { bpm: 110, pattern: [1, 0, 1, 0, 1, 1, 0, 1], notes: [0, 6, 4, 1] }, motif: { voice: 'box', every: [3, 6], len: [4, 6], beat: 0.32, oct: 4 } },
  endLovers: { root: 87.3, scale: [0, 2, 4, 7, 9], chord: [1, 1.25, 1.5], cutoff: 900, wind: 0.006, gain: 0.45, motif: { voice: 'box', every: [4, 7], len: [3, 5], beat: 0.6, oct: 4 } },
  endCult: { root: 55, scale: [0, 2, 3, 5, 7, 8, 10], chord: [1, 1.19, 1.5, 2], cutoff: 520, wind: 0.03, gain: 0.55, choir: 0.03, swell: [6, 10], motif: { voice: 'bell', every: [5, 8], len: [1, 2], beat: 1.2, oct: 2 } },
  endRipper: { root: 51.9, scale: [0, 1, 5, 6, 7, 11], chord: [1, 1.06, 1.41], cutoff: 450, wind: 0.04, gain: 0.5, heart: 50, motif: { voice: 'box', every: [6, 10], len: [2, 3], beat: 1, oct: 4 } },
  endDraw: { root: 61.7, scale: [0, 5, 7], chord: [1, 1.5], cutoff: 500, wind: 0.03, gain: 0.45, motif: { voice: 'bell', every: [8, 13], len: [1, 2], beat: 1.4, oct: 2 } },
  // Overlay mixed on top of any mood when the table is down to its last few.
  tension: { root: 110, scale: [0, 1], chord: [], cutoff: 3000, wind: 0, gain: 0.5, shimmer: 0.012, heart: 104 },
};
let bus = null;
let layer = null;
let tense = null;
function scoreBus(a) {
  if (!bus) { bus = a.createGain(); bus.gain.value = 0.9; bus.connect(master); }
  return bus;
}
function buildLayer(a, mood) {
  const m = MOODS[mood];
  const shift = mood === 'tension' ? 0 : [0, 0, -2, 2, 3, -3][Math.floor(Math.random() * 6)];
  const root = semi(m.root, shift);
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
      o.frequency.value = root * r;
      o.detune.value = det + i * 1.5;
      const g = a.createGain(); g.gain.value = (i === 0 ? 0.16 : 0.07) / m.chord.length * 3;
      o.connect(g).connect(filt);
      nodes.push(o);
    }
  });
  if (m.wind) {
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
  }
  if (m.choir) {
    // two "aah" voices: saws through vowel formants, with a slow vibrato
    const vib = a.createOscillator(); vib.frequency.value = 4.6;
    const vibAmt = a.createGain(); vibAmt.gain.value = 3;
    vib.connect(vibAmt);
    nodes.push(vib);
    for (const r of [2, 3, 4.76]) {
      const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.value = root * r;
      vibAmt.connect(o.detune);
      const g = a.createGain(); g.gain.value = m.choir;
      for (const [f, q] of [[700, 7], [1150, 9]]) {
        const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
        o.connect(bp).connect(g);
      }
      g.connect(out);
      nodes.push(o);
    }
  }
  if (m.shimmer) {
    const trem = a.createOscillator(); trem.frequency.value = 6.5;
    const tg = a.createGain(); tg.gain.value = 0;
    const tAmt = a.createGain(); tAmt.gain.value = m.shimmer;
    trem.connect(tAmt).connect(tg.gain);
    for (const r of [16, 19.03, 24]) {
      const o = a.createOscillator(); o.frequency.value = root * r * (mood === 'tension' ? 0.5 : 1);
      o.connect(tg);
      nodes.push(o);
    }
    tg.connect(out);
    nodes.push(trem);
  }
  nodes.forEach((n) => n.start());
  out.gain.exponentialRampToValueAtTime(m.gain, a.currentTime + 3.5);
  const L = { out, nodes, mood, timers: [] };
  const later = (fn, sec) => { const id = setTimeout(() => { if (layerAlive(L)) fn(); }, sec * 1000); L.timers.push(id); };
  const span = ([lo, hi]) => lo + Math.random() * (hi - lo);
  if (m.motif) {
    let deg = Math.floor(Math.random() * m.scale.length);
    const phrase = () => {
      const x = audio(); if (!x) return;
      const len = Math.round(span(m.motif.len));
      let at = 0;
      for (let i = 0; i < len; i++) {
        deg = Math.max(0, Math.min(m.scale.length * 2 - 1, deg + [-1, -1, -1, 1, 1, 1, 2, -2, 0][Math.floor(Math.random() * 9)]));
        const n = m.scale[deg % m.scale.length] + 12 * Math.floor(deg / m.scale.length);
        const f = root * 2 ** m.motif.oct * 2 ** (n / 12) / 4;
        // unhurried rubato: notes drift apart a little, and phrases breathe at the end
        at += m.motif.beat * (i === 0 ? 0 : 0.9 + Math.random() * 0.35) * (i === len - 1 ? 1.35 : 1);
        if (m.motif.voice === 'box') box(x, f, at, 0.045, out); else bell(x, f, at, 0.045, 3.2, out);
      }
      later(phrase, span(m.motif.every));
    };
    later(phrase, 1.2 + Math.random() * 2);
  }
  if (m.pluck) {
    const step = 60 / m.pluck.bpm / 2;
    let i = 0;
    const tick = () => {
      const x = audio(); if (!x) return;
      if (m.pluck.pattern[i % m.pluck.pattern.length]) {
        const n = m.pluck.notes[Math.floor(i / m.pluck.pattern.length) % m.pluck.notes.length];
        pluck(x, semi(root, n), 0, 0.09, out, 700 + Math.random() * 500);
      }
      i++;
      later(tick, step);
    };
    later(tick, 0.5);
  }
  if (m.heart) {
    const beat = () => { const x = audio(); if (x) heartbeat(x, 0, 0.28, out); later(beat, 60 / m.heart * (0.97 + Math.random() * 0.06)); };
    later(beat, 0.8);
  }
  if (m.swell) {
    const sw = () => {
      const x = audio(); if (!x) return;
      tone(x, { freq: root / 2, dur: 4.5, gain: 0.18, attack: 2.2, dest: out });
      noise(x, { dur: 4, gain: 0.05, type: 'bandpass', freq: 160, sweep: 700, q: 0.8, attack: 2, dest: out });
      later(sw, span(m.swell));
    };
    later(sw, span(m.swell));
  }
  return L;
}
const layerAlive = (L) => L === layer || L === tense;
function dropLayer(a, l) {
  if (!l) return;
  l.timers.forEach(clearTimeout);
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
    const old = layer;
    layer = null;
    dropLayer(a, old);
    layer = buildLayer(a, mood);
  },
  /** The last-few-alive overlay: a shimmer and a fast heartbeat on top. */
  tension(on) {
    const a = ctx;
    if (!a || !soundOn) return;
    if (on && !tense) tense = buildLayer(a, 'tension');
    else if (!on && tense) { const old = tense; tense = null; dropLayer(a, old); }
  },
  stop() {
    if (ctx && layer) { const old = layer; layer = null; dropLayer(ctx, old); }
    if (ctx && tense) { const old = tense; tense = null; dropLayer(ctx, old); }
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
    case 'glitter': {
      c2.globalAlpha = a * (0.45 + 0.55 * Math.abs(Math.sin(p.phase + p.life * 40)));
      c2.shadowColor = p.color; c2.shadowBlur = 6;
      c2.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      break;
    }
    case 'streak': {
      // a spark with a short tail along its velocity
      c2.rotate(-p.rot);
      c2.strokeStyle = p.color; c2.lineWidth = p.size; c2.lineCap = 'round';
      c2.shadowColor = p.color; c2.shadowBlur = 10;
      c2.beginPath(); c2.moveTo(0, 0); c2.lineTo(-p.vx * 3, -p.vy * 3); c2.stroke();
      break;
    }
    case 'heart': {
      const r = p.size;
      c2.beginPath();
      c2.moveTo(0, r * 0.35);
      c2.bezierCurveTo(-r * 1.2, -r * 0.5, -r * 0.45, -r * 1.25, 0, -r * 0.45);
      c2.bezierCurveTo(r * 0.45, -r * 1.25, r * 1.2, -r * 0.5, 0, r * 0.35);
      c2.fill();
      break;
    }
    case 'slash': {
      c2.strokeStyle = p.color; c2.lineWidth = p.size; c2.lineCap = 'round';
      c2.shadowColor = '#e2585e'; c2.shadowBlur = 16;
      const len = p.len * Math.min(1, (1 - p.life) * 6);
      c2.beginPath(); c2.moveTo(-p.len / 2, 0); c2.lineTo(-p.len / 2 + len, 0); c2.stroke();
      break;
    }
    case 'flash': {
      const g = c2.createRadialGradient(0, 0, 0, 0, 0, p.size * (1.6 - p.life * 0.6));
      g.addColorStop(0, p.color); g.addColorStop(1, 'rgba(0,0,0,0)');
      c2.fillStyle = g; c2.beginPath(); c2.arc(0, 0, p.size * 1.6, 0, Math.PI * 2); c2.fill();
      break;
    }
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
    livingCelebration();
    return;
  } else if (kind === 'LOVERS') {
    // hearts rising in waves, rose petals drifting down
    for (let w = 0; w < 4; w++) {
      setTimeout(() => {
        for (let i = 0; i < 26; i++) add({ kind: 'heart', x: rand(0, W), y: H + rand(0, 80), vx: rand(-0.6, 0.6), vy: rand(-5.5, -2.5), g: -0.01, drag: 0.995, sway: 0.05, size: rand(5, 13), decay: rand(0.003, 0.006), color: ['#ff6b8a', '#ffb3c4', '#e2585e', '#ffd1dc'][i % 4], alpha: 0.9 });
        kick();
      }, w * 650);
    }
    for (let i = 0; i < 70; i++) add({ kind: 'petal', x: rand(0, W), y: rand(-H * 0.8, -10), vx: rand(-0.6, 0.6), vy: rand(1, 2.4), g: 0.005, drag: 0.996, sway: 0.04, vr: rand(-0.06, 0.06), rot: rand(0, 6), size: rand(5, 9), decay: rand(0.0025, 0.004), color: ['#c33a5a', '#ff8fa6', '#9e1c3a'][i % 3] });
  } else if (kind === 'CULT') {
    // a slow purple vortex of embers around the centre, then candle sparks rising
    const cx = W / 2; const cy = H * 0.38;
    for (let i = 0; i < 140; i++) {
      const a = (i / 140) * Math.PI * 12; const r = 30 + i * 2.2;
      add({ kind: i % 4 ? 'spark' : 'glitter', x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.6, vx: -Math.sin(a) * 2.2, vy: Math.cos(a) * 1.3 - 0.3, g: -0.004, drag: 0.985, size: rand(1.2, 2.6), decay: rand(0.006, 0.01), color: ['#b59be0', '#7d4fd6', '#9fe0b0', '#e0d0ff'][i % 4] });
    }
    setTimeout(() => {
      for (let i = 0; i < 80; i++) add({ kind: 'spark', x: rand(W * 0.1, W * 0.9), y: H + 10, vx: rand(-0.4, 0.4), vy: rand(-6, -3), g: -0.01, drag: 0.99, sway: 0.03, size: rand(1.2, 2.4), decay: rand(0.005, 0.009), color: ['#9fe0b0', '#b59be0', '#e9c27a'][i % 3] });
      kick();
    }, 1300);
  } else if (kind === 'RIPPER') {
    // three blade slashes across the screen, then a fine red mist falling
    [[0, -0.42], [420, 0.36], [820, -0.12]].forEach(([d, ang]) => setTimeout(() => {
      add({ kind: 'slash', x: W / 2 + rand(-40, 40), y: H * rand(0.3, 0.6), rot: ang, len: Math.hypot(W, H) * 0.9, size: rand(5, 8), decay: 0.012, color: '#f2e6e6' });
      for (let i = 0; i < 40; i++) add({ kind: 'spark', x: W / 2 + rand(-W / 2, W / 2), y: H * 0.45 + rand(-60, 60), vx: rand(-1, 1), vy: rand(0.5, 3), g: 0.12, drag: 0.98, size: rand(1.5, 3.5), decay: rand(0.008, 0.016), color: ['#b3242d', '#e2585e', '#7e1820'][i % 3] });
      kick();
    }, d));
    for (let i = 0; i < 90; i++) add({ kind: 'spark', x: rand(0, W), y: rand(-H, -10), vx: rand(-0.2, 0.2), vy: rand(0.8, 2), g: 0.004, drag: 0.998, size: rand(0.8, 1.8), decay: rand(0.002, 0.004), color: '#b3242d', alpha: 0.7 });
  } else {
    for (let i = 0; i < 40; i++) add({ kind: 'spark', x: rand(0, W), y: rand(0, H), vx: rand(-0.3, 0.3), vy: rand(-0.6, -0.1), size: rand(1, 2), decay: rand(0.004, 0.008), color: '#bdb4a4', alpha: 0.6 });
  }
  kick();
}

/** The living win: confetti cannons, waves of fireworks, then a glitter shower. */
const FIRE = [['#ffd36b', '#fff1c2', '#e9a43a'], ['#f2f2f2', '#c9e3ff', '#8fb4e6'], ['#ff8a6b', '#ffd0b8', '#e9c27a'], ['#b8f0c2', '#f6ffe8', '#7fd39a'], ['#e0b8ff', '#fff0ff', '#b59be0']];
const CONF = ['#e9c27a', '#ece5d5', '#e2585e', '#8fd3a5', '#8fb4e6', '#f2b66b'];
function firework(x, y, colors, n = 96) {
  const scale = Math.min(1.4, Math.max(0.8, Math.min(W, H) / 500));
  add({ kind: 'flash', x, y, size: 70 * scale, decay: 0.06, alpha: 0.55, color: colors[1] });
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
    const sp = rand(2.8, 8) * scale;
    add({ kind: i % 3 ? 'streak' : 'spark', x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, g: 0.065, drag: 0.962, size: rand(1.4, 2.8), decay: rand(0.008, 0.014), color: colors[i % colors.length] });
  }
  for (let i = 0; i < 18; i++) add({ kind: 'glitter', x, y, vx: rand(-1.5, 1.5), vy: rand(-1.5, 1), g: 0.03, drag: 0.98, size: rand(1.5, 2.6), decay: rand(0.006, 0.01), color: colors[0] });
  kick();
}
function rocket(x, colors, delay) {
  setTimeout(() => {
    const top = rand(H * 0.12, H * 0.4);
    const r = { kind: 'streak', x, y: H + 10, vx: rand(-0.6, 0.6), vy: -Math.sqrt(2 * 0.12 * (H + 10 - top)), g: 0.12, drag: 1, size: 2, decay: 0.012, color: colors[1] };
    add(r);
    kick();
    const t = Math.abs(r.vy / r.g) * 16;
    setTimeout(() => firework(x + r.vx * t / 16, top, colors), Math.max(250, t));
  }, delay);
}
function livingCelebration() {
  // confetti cannons from both bottom corners
  for (const [delay, side] of [[0, 1], [80, -1], [1600, 1], [1680, -1]]) {
    setTimeout(() => {
      for (let i = 0; i < 70; i++) {
        const x = side > 0 ? -10 : W + 10;
        add({ kind: i % 4 ? 'slip' : 'petal', x, y: H * rand(0.7, 0.95), vx: side * rand(5, 14), vy: rand(-17, -8), g: 0.24, drag: 0.982, sway: 0.03,
          vr: rand(-0.35, 0.35), rot: rand(0, 6), size: rand(3, 6.5), decay: rand(0.003, 0.006), color: CONF[i % CONF.length] });
      }
      kick();
    }, delay);
  }
  // waves of fireworks
  const shots = Math.round(rand(7, 9));
  for (let i = 0; i < shots; i++) rocket(rand(W * 0.15, W * 0.85), FIRE[i % FIRE.length], 250 + i * rand(380, 520));
  // a slow golden glitter shower to finish
  setTimeout(() => {
    for (let i = 0; i < 120; i++) {
      add({ kind: i % 3 ? 'glitter' : 'slip', x: rand(0, W), y: rand(-H * 0.5, -10), vx: rand(-0.4, 0.4), vy: rand(1, 2.6), g: 0.01, drag: 0.995, sway: 0.025,
        vr: rand(-0.1, 0.1), size: i % 3 ? rand(1.4, 2.8) : rand(3, 5), decay: rand(0.002, 0.004), color: ['#ffd36b', '#ece5d5', '#e9c27a', '#fff1c2'][i % 4] });
    }
    kick();
  }, 3600);
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
