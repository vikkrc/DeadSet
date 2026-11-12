// Dead Set — score themes for the TV board.
//
// The Classic score lives in fx.js. Each theme here is its own small band: its own
// synth voices and its own pattern logic, fed by the same moods (root, scale, chord
// colour, darkness, how tense the phase is), so every phase still sounds like itself
// in every theme. Notes are scheduled on the audio clock a little ahead of time, so
// rhythmic themes keep steady time.

export const SCORE_THEMES = ['classic', 'cathedral', 'neon', 'abyss', 'lullaby', 'ghosttown', 'chiptune'];
// Loudness trims, measured so every theme sits near the Classic score's level.
export const THEME_TRIM = { classic: 1, cathedral: 1.45, neon: 1.5, abyss: 0.85, lullaby: 7, ghosttown: 3.6, chiptune: 2.1 };

// How driven each phase is: 0 still, 1 moving, 2 pressing.
const ENERGY = {
  lobby: 0, ceremony: 0, morning: 0, night: 0, mGather: 0, mCandle: 0, endLovers: 0, endDraw: 0, endLiving: 1,
  discussion: 1, defense: 1, mCamp: 1, endDeath: 1, endCult: 1,
  vote: 2, resolving: 2, bloodmoon: 2, mVote: 2, mMission: 2, mStand: 2, mReckon: 2, endRipper: 2, endJester: 2,
};

const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const hz = (root, semis) => root * 2 ** (semis / 12);

// ── Voices ────────────────────────────────────────────────────────────────
/** One oscillator with an attack / hold / release envelope, optional filter sweep, vibrato and glide. */
function osc(a, { f, t, dur, type = 'sine', wave = null, attack = 0.01, release = 0.2, gain = 0.1, dest, detune = 0, vib = 0, vibRate = 5.5, vibDelay = 0, glide = null, filter = null }) {
  const o = a.createOscillator();
  if (wave) o.setPeriodicWave(wave); else o.type = type;
  if (glide) { o.frequency.setValueAtTime(glide, t); o.frequency.exponentialRampToValueAtTime(f, t + Math.min(0.22, dur * 0.5)); } else o.frequency.setValueAtTime(f, t);
  o.detune.setValueAtTime(detune, t);
  const hold = Math.max(attack, dur);
  const end = t + hold + release;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.setValueAtTime(gain, t + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  let head = o;
  if (filter) {
    const bq = a.createBiquadFilter();
    bq.type = filter.type ?? 'lowpass'; bq.Q.value = filter.q ?? 1;
    bq.frequency.setValueAtTime(filter.freq, t);
    if (filter.to) bq.frequency.exponentialRampToValueAtTime(filter.to, t + (filter.time ?? dur));
    head.connect(bq); head = bq;
  }
  head.connect(g).connect(dest);
  if (vib) {
    const l = a.createOscillator(); l.frequency.value = vibRate;
    const amt = a.createGain(); amt.gain.setValueAtTime(0, t); amt.gain.linearRampToValueAtTime(vib, t + vibDelay + 0.2);
    l.connect(amt).connect(o.detune);
    l.start(t); l.stop(end + 0.05);
  }
  o.start(t); o.stop(end + 0.05);
}

const noiseBufs = new WeakMap();
function noiseBuffer(a) {
  let b = noiseBufs.get(a);
  if (!b) {
    b = a.createBuffer(1, a.sampleRate * 2, a.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noiseBufs.set(a, b);
  }
  return b;
}
/** A burst of filtered noise (drums, breath, wind). */
function hiss(a, { t, dur, gain, dest, type = 'bandpass', freq = 1000, q = 1, to = null, attack = 0.002 }) {
  const s = a.createBufferSource(); s.buffer = noiseBuffer(a); s.loop = true;
  const bq = a.createBiquadFilter(); bq.type = type; bq.Q.value = q;
  bq.frequency.setValueAtTime(freq, t);
  if (to) bq.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur);
  s.connect(bq).connect(g).connect(dest);
  s.start(t, Math.random()); s.stop(t + attack + dur + 0.05);
}

/** A generated room: decaying noise, darker as it fades. Shared per length. */
const rooms = new WeakMap();
function room(a, bus, seconds, bright = 0.5) {
  let byLen = rooms.get(a);
  if (!byLen) { byLen = new Map(); rooms.set(a, byLen); }
  const key = `${seconds}:${bright}`;
  if (!byLen.has(key)) {
    const len = Math.floor(a.sampleRate * seconds);
    const ir = a.createBuffer(2, len, a.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const x = i / len;
        lp += (Math.random() * 2 - 1 - lp) * (bright * (1 - x) + 0.05);
        d[i] = lp * (1 - x) ** 2.2;
      }
    }
    const c = a.createConvolver(); c.buffer = ir; c.connect(bus);
    byLen.set(key, c);
  }
  return byLen.get(key);
}

/** Pulse waves for the 8-bit theme (duty 12.5%, 25%). */
const pulses = new WeakMap();
function pulse(a, duty) {
  let byDuty = pulses.get(a);
  if (!byDuty) { byDuty = new Map(); pulses.set(a, byDuty); }
  if (!byDuty.has(duty)) {
    const n = 40; const real = new Float32Array(n); const imag = new Float32Array(n);
    for (let k = 1; k < n; k++) { real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty); }
    byDuty.set(duty, a.createPeriodicWave(real, imag));
  }
  return byDuty.get(duty);
}

// ── Harmony ───────────────────────────────────────────────────────────────
/** Semitone offsets of the chord built on a scale step (stacked thirds of the mood's scale). */
function chordOn(scale, deg) {
  const n = scale.length;
  const at = (k) => scale[((k % n) + n) % n] + 12 * Math.floor(k / n);
  if (n >= 5) return [at(deg), at(deg + 2), at(deg + 4)];
  if (n >= 3) return [at(deg), at(deg + 1), at(deg + 2)];
  return [0, 7, 12];
}
const step = (scale, k) => { const n = scale.length; return scale[((k % n) + n) % n] + 12 * Math.floor(k / n); };

// ── The builder ───────────────────────────────────────────────────────────
/**
 * Build one theme's layer for a mood. `L` is the layer record from fx.js (its timers are
 * cleared and its nodes stopped when the mood ends); `later` schedules while L is alive.
 */
export function buildThemed(theme, { a, m, mood, root, out, bus, L, later, audio, kit }) {
  const energy = ENERGY[mood] ?? 1;
  const dark = m.cutoff < 500;
  const keep = (n) => { n.start(); L.nodes.push(n); return n; };
  // The step clock: calls fn(i, t) for every step a quarter-second before it sounds.
  const clock = (stepSec, fn) => {
    let i = 0;
    let next = a.currentTime + 0.2;
    const pump = () => {
      const x = audio(); if (!x) return;
      if (next < x.currentTime - 0.1) next = x.currentTime + 0.05; // after a stall, resume rather than burst
      while (next < x.currentTime + 0.25) { const len = stepSec(i); fn(i, next, len); next += len; i++; }
      later(pump, 0.07);
    };
    later(pump, 0.05);
  };
  const send = (node, gain) => { const g = a.createGain(); g.gain.value = gain; out.connect(g).connect(node); };
  const tone = (opts) => osc(a, { dest: out, ...opts });
  const heart = (bpm) => { const beat = () => { const x = audio(); if (x) kit.heartbeat(x, 0, 0.22, out); later(beat, 60 / bpm * rnd(0.97, 1.03)); }; later(beat, 0.8); };
  return THEMES[theme]({ a, m, mood, root, out, bus, energy, dark, keep, clock, send, tone, heart, later, audio, kit });
}

const THEMES = {
  // Cathedral: a pipe organ walking a slow chorale, pedal notes beneath, a harpsichord
  // counter-line when the table stirs, and a tolling bell when it presses. Long stone reverb.
  cathedral({ a, m, root, out, bus, energy, dark, clock, send, tone, heart, kit, audio }) {
    send(room(a, bus, 4.5, 0.35), 0.5);
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(4200, m.cutoff * 4); lp.Q.value = 0.5;
    const voice = a.createGain(); voice.connect(lp).connect(out);
    const beat = 60 / [54, 64, 78][energy];
    const prog = pick([[0, 5, 3, 4], [0, 3, 5, 4], [0, 6, 5, 4], [0, 2, 3, 4]]);
    const stops = dark ? [[1, 1], [2, 0.35]] : [[1, 1], [2, 0.5], [3, 0.22], [4, 0.16]];
    let bar = 0;
    clock((i) => beat, (i, t) => {
      const b = i % 4;
      if (b === 0) {
        const ch = chordOn(m.scale, prog[bar % prog.length]);
        const len = beat * 4 + 0.15;
        ch.forEach((n, k) => stops.forEach(([h, g]) => osc(a, { f: hz(root * 2, n + (k === 0 ? 12 : 0)) * h, t, dur: len, attack: 0.09, release: 0.7, gain: 0.03 * g, dest: voice, vib: 5, vibRate: 6 })));
        osc(a, { f: hz(root, ch[0]) / 2, t, dur: len, attack: 0.2, release: 1, gain: 0.11, dest: voice });
        osc(a, { f: hz(root, ch[0]), t, dur: len, type: 'triangle', attack: 0.2, release: 1, gain: 0.03, dest: voice });
        if (energy === 2 && bar % 2 === 0) { const x = audio(); if (x) kit.bell(x, hz(root * 4, ch[0]), t - x.currentTime, 0.05, 4, out); }
        bar++;
      }
      if (energy >= 1 && Math.random() < [0, 0.55, 0.8][energy]) {
        const k = Math.floor(rnd(0, m.scale.length * 2));
        const f = hz(root * 4, step(m.scale, k));
        osc(a, { f, t, dur: 0.04, type: 'sawtooth', attack: 0.003, release: 0.45, gain: 0.022, dest: out, filter: { freq: 4200, to: 900, time: 0.35, q: 0.8 } });
        osc(a, { f, t, dur: 0.04, type: 'square', attack: 0.003, release: 0.3, gain: 0.008, dest: out, detune: 7, filter: { freq: 3000, to: 700, time: 0.3 } });
      }
    });
    if (m.heart) heart(m.heart);
  },

  // Neon Noir: an eighties night drive. Supersaw pads, a sixteenth-note arpeggiator through a
  // dotted-eighth echo, a pumping saw bass and a drum machine that builds with the phase.
  neon({ a, m, root, out, bus, energy, dark, clock, send }) {
    const bpm = [84, 100, 116][energy];
    const s16 = 60 / bpm / 4;
    const echo = a.createDelay(2); echo.delayTime.value = s16 * 3;
    const fb = a.createGain(); fb.gain.value = 0.36;
    const wet = a.createGain(); wet.gain.value = 0.22;
    const arpBus = a.createGain(); arpBus.connect(out); arpBus.connect(echo); echo.connect(fb).connect(echo); echo.connect(wet).connect(out);
    send(room(a, bus, 2, 0.6), 0.2);
    const prog = pick([[0, 5, 2, 6], [0, 5, 3, 4], [0, 3, 5, 6]]);
    const order = energy === 0 ? 'up' : energy === 1 ? 'updown' : 'rand';
    let ch = chordOn(m.scale, prog[0]);
    const padTop = dark ? m.cutoff * 1.6 : m.cutoff * 2.4;
    clock(() => s16, (i, t) => {
      const st = i % 16;
      const bar = Math.floor(i / 16);
      if (st === 0 && bar % 2 === 0) {
        ch = chordOn(m.scale, prog[(bar / 2) % prog.length]);
        const len = s16 * 32;
        ch.forEach((n) => [-12, 0, 11].forEach((d) => osc(a, { f: hz(root * 2, n), t, dur: len, type: 'sawtooth', detune: d, attack: 0.9, release: 1.4, gain: energy === 0 ? 0.024 : 0.014, dest: out, filter: { freq: 300, to: padTop, time: len * 0.5, q: 0.9 } })));
      }
      // arpeggio: chord tones over two octaves
      const tones = [...ch, ...ch.map((n) => n + 12)];
      const idx = order === 'up' ? st % tones.length : order === 'updown' ? [0, 1, 2, 3, 4, 5, 4, 3, 2, 1][st % 10] % tones.length : Math.floor(Math.random() * tones.length);
      if (energy > 0 || st % 2 === 0) osc(a, { f: hz(root * (dark ? 2 : 4), tones[idx]), t, dur: s16 * 0.6, type: 'square', attack: 0.004, release: 0.08, gain: 0.02, dest: arpBus, filter: { freq: 2600, to: 500, time: s16 * 0.9, q: 4 } });
      // bass
      if (energy === 0) { if (st === 0) osc(a, { f: hz(root, ch[0]), t, dur: s16 * 14, type: 'sawtooth', attack: 0.3, release: 0.6, gain: 0.05, dest: out, filter: { freq: 260, q: 2 } }); }
      else if (st % 2 === 0) osc(a, { f: hz(root, ch[0] + (st % 4 === 2 && energy === 2 ? 12 : 0)), t, dur: s16 * 1.4, type: 'sawtooth', attack: 0.004, release: 0.08, gain: 0.07, dest: out, filter: { freq: 900, to: 160, time: s16 * 1.6, q: 6 } });
      // drum machine
      const kick = energy === 2 ? st % 4 === 0 : energy === 1 && (st === 0 || st === 8);
      if (kick) osc(a, { f: 46, glide: 150, t, dur: 0.12, attack: 0.002, release: 0.25, gain: 0.32, dest: out });
      if (energy >= 1 && (st === 4 || st === 12)) { hiss(a, { t, dur: 0.18, gain: 0.08, freq: 1800, q: 0.7, dest: out }); osc(a, { f: 190, t, dur: 0.02, release: 0.1, gain: 0.05, dest: out }); }
      if (energy >= 1 && st % 2 === 0) hiss(a, { t, dur: st === 14 && energy === 2 ? 0.16 : 0.03, gain: 0.025, type: 'highpass', freq: 7000, dest: out });
    });
  },

  // Abyss: no tune, no grid. Detuned drones in a vast space, metallic tones struck far away,
  // sub-bass drops and breath. Busier and closer as the phase presses.
  abyss({ a, m, root, out, bus, energy, keep, send, tone, heart, later, audio }) {
    send(room(a, bus, 7, 0.25), 0.65);
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; lp.Q.value = 3; lp.connect(out);
    const sweep = keep(a.createOscillator()); sweep.frequency.value = 0.03;
    const sAmt = a.createGain(); sAmt.gain.value = 140; sweep.connect(sAmt).connect(lp.frequency);
    for (const [r, d] of [[0.5, -9], [0.5, 9], [0.75, 4]]) {
      const o = keep(a.createOscillator()); o.type = 'sawtooth'; o.frequency.value = root * r; o.detune.value = d;
      const g = a.createGain(); g.gain.value = 0.05; o.connect(g).connect(lp);
    }
    const sub = keep(a.createOscillator()); sub.frequency.value = root / 2;
    const sg = a.createGain(); sg.gain.value = 0.12; sub.connect(sg).connect(out);
    const glass = keep(a.createOscillator()); glass.frequency.value = hz(root * 8, m.scale[m.scale.length - 1] ?? 7);
    const gg = a.createGain(); gg.gain.value = 0; glass.connect(gg).connect(out);
    const gl = keep(a.createOscillator()); gl.frequency.value = 0.05; const glA = a.createGain(); glA.gain.value = 0.006; gl.connect(glA).connect(gg.gain);
    const dens = [1, 1.8, 3][energy];
    // metal: two-operator FM, struck far away
    const metal = () => {
      const x = audio(); if (!x) return;
      const t = x.currentTime + 0.05;
      const f = hz(root * pick([4, 6, 8]), pick(m.scale));
      const car = x.createOscillator(); car.frequency.value = f;
      const mod = x.createOscillator(); mod.frequency.value = f * pick([1.41, 2.76, 3.53]);
      const idx = x.createGain(); idx.gain.setValueAtTime(f * 2.5, t); idx.gain.exponentialRampToValueAtTime(1, t + 4);
      mod.connect(idx).connect(car.frequency);
      const g = x.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.045, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 6);
      car.connect(g).connect(out);
      car.start(t); mod.start(t); car.stop(t + 6.1); mod.stop(t + 6.1);
      later(metal, rnd(6, 14) / dens);
    };
    later(metal, rnd(2, 5));
    const drop = () => { const x = audio(); if (!x) return; osc(x, { f: 30, glide: 90, t: x.currentTime + 0.05, dur: 1.6, attack: 0.05, release: 1.2, gain: 0.18, dest: out }); later(drop, rnd(12, 22) / dens); };
    later(drop, rnd(5, 9));
    const breath = () => { const x = audio(); if (!x) return; hiss(x, { t: x.currentTime + 0.05, dur: rnd(2, 4), attack: rnd(1.5, 3), gain: 0.03, freq: rnd(300, 600), to: rnd(900, 1600), q: 6, dest: out }); later(breath, rnd(9, 18) / dens); };
    later(breath, rnd(3, 8));
    if (energy === 2) heart(m.heart ?? 56);
  },

  // Lullaby: a nursery waltz on a toy piano that has been left in the attic: oom-pah-pah
  // underneath, a melody that repeats like a nursery rhyme, and tape that wavers. Under
  // pressure it starts to run down.
  lullaby({ a, m, root, out, bus, energy, clock, send, heart }) {
    send(room(a, bus, 2.6, 0.5), 0.32);
    const beat = 60 / [70, 86, 100][energy];
    const prog = [0, 3, 4, 0];
    const wow = [12, 22, 45][energy];
    const toy = (f, t, gain, dur = 0.9) => {
      const det = Math.sin(t * 0.37) * wow + rnd(-6, 6);
      osc(a, { f, t, dur: 0.02, release: dur, gain, dest: out, detune: det });
      osc(a, { f: f * 4.02, t, dur: 0.01, release: dur * 0.3, gain: gain * 0.28, dest: out, detune: det });
      osc(a, { f: f * 2, t, dur: 0.01, type: 'triangle', release: dur * 0.5, gain: gain * 0.2, dest: out, detune: det });
    };
    const motif = () => Array.from({ length: 6 }, (_, k) => (k === 0 || Math.random() < 0.75 ? Math.floor(rnd(0, m.scale.length + 3)) : null));
    let A = motif(); let B = motif();
    clock(() => beat * (energy === 2 && Math.random() < 0.12 ? rnd(1.1, 1.35) : 1), (i, t) => {
      const bar = Math.floor(i / 3); const b = i % 3;
      const ch = chordOn(m.scale, prog[bar % 4]);
      if (b === 0) osc(a, { f: hz(root * 2, ch[0]), t, dur: 0.05, type: 'triangle', release: 0.7, gain: 0.07, dest: out });
      else { toy(hz(root * 4, ch[1]), t, 0.012, 0.4); toy(hz(root * 4, ch[2]), t, 0.012, 0.4); }
      // melody: A A' B A over eight bars (two bars per phrase)
      const phrase = Math.floor(bar / 2) % 4;
      if (phrase === 0 && bar % 8 === 0 && b === 0) { A = motif(); B = motif(); }
      const src = phrase === 2 ? B : A;
      const deg = src[(bar % 2) * 3 + b];
      if (deg !== null && deg !== undefined && (energy > 0 || bar % 2 === 0)) {
        const lift = phrase === 1 && (bar % 2) * 3 + b < 5 ? 2 : 0;
        toy(hz(root * 8, step(m.scale, deg + lift)), t, 0.035);
        if (energy === 2 && Math.random() < 0.2) toy(hz(root * 8, step(m.scale, deg + lift) + 1), t + 0.02, 0.015); // a wrong note
      }
    });
    if (m.heart && energy === 2) heart(m.heart);
  },

  // Ghost Town: a deserted frontier street. Twangy guitar with boom-chick picking, a lone
  // whistle that slides between long notes, a galloping woodblock, and an anvil at high noon.
  ghosttown({ a, m, root, out, bus, energy, clock, send, later, audio }) {
    send(room(a, bus, 1.7, 0.8), 0.3);
    const bpm = [68, 92, 112][energy];
    const e8 = 60 / bpm / 2;
    const twang = (f, t, gain = 0.05, dur = 0.25) => osc(a, { f, glide: f * 0.985, t, dur, type: 'sawtooth', attack: 0.003, release: 0.9, gain, dest: out, vib: 9, vibRate: 5, vibDelay: 0.25, filter: { freq: 2800, to: 650, time: 0.5, q: 2 } });
    const prog = pick([[0, 3, 4, 0], [0, 6, 5, 4], [0, 5, 3, 4]]);
    clock(() => e8, (i, t) => {
      const st = i % 8; const bar = Math.floor(i / 8);
      const ch = chordOn(m.scale, prog[bar % 4]);
      const strum = (g) => ch.forEach((n, k) => twang(hz(root * 4, n), t + k * 0.018, g, 0.12));
      if (energy === 0) {
        if (st === 0 && bar % 2 === 0) { ch.forEach((n, k) => twang(hz(root * 2, n + (k ? 12 : 0)), t + k * 0.06, 0.05, 1.6)); }
      } else {
        if (st === 0) twang(hz(root * 2, ch[0]), t, 0.07);
        if (st === 4) twang(hz(root * 2, ch[0] + 7), t, 0.06);
        if (st === 2 || st === 6) strum(0.02);
        if ([0, 2, 3, 4, 6, 7].includes(st)) { hiss(a, { t, dur: 0.03, gain: st % 4 === 0 ? 0.05 : 0.03, freq: 1900, q: 7, dest: out }); osc(a, { f: 880, t, dur: 0.005, release: 0.04, gain: 0.015, dest: out }); }
        if (energy === 2 && st === 0 && bar % 2 === 0) [1, 2.76, 5.4].forEach((r, k) => osc(a, { f: 1040 * r, t, dur: 0.01, release: 1.6 / (k + 1), gain: 0.02 / (k + 1), dest: out }));
      }
    });
    // the whistle: a few long notes with slides between them
    const whistle = () => {
      const x = audio(); if (!x) return;
      let t = x.currentTime + 0.1;
      let deg = Math.floor(rnd(0, m.scale.length));
      let prev = null;
      const n = Math.floor(rnd(3, 6));
      for (let k = 0; k < n; k++) {
        deg += pick([-2, -1, 1, 1, 2, 0]);
        const f = hz(root * 8, step(m.scale, Math.max(-2, deg)));
        const d = e8 * pick([2, 3, 4, 6]) * (k === n - 1 ? 1.8 : 1);
        osc(x, { f, glide: prev, t, dur: d, attack: 0.08, release: 0.35, gain: 0.04, dest: out, vib: 28, vibRate: 5.6, vibDelay: 0.3 });
        prev = f; t += d;
      }
      later(whistle, (t - x.currentTime) + rnd(6, 14) / (energy + 1));
    };
    later(whistle, rnd(2, 5));
  },

  // 8-Bit Haunt: a haunted cartridge. Pulse-wave lead with a four-bar tune that repeats and
  // answers itself, a fast chord arpeggio, triangle bass and noise drums.
  chiptune({ a, m, root, out, energy, clock }) {
    const bpm = [96, 120, 144][energy];
    const s16 = 60 / bpm / 4;
    const lead = pulse(a, 0.25); const thin = pulse(a, 0.125);
    const prog = pick([[0, 5, 3, 4], [0, 3, 4, 4], [0, 6, 5, 4]]);
    const tune = () => Array.from({ length: 16 }, (_, k) => (k % 4 === 0 || Math.random() < [0.25, 0.45, 0.6][energy] ? Math.floor(rnd(0, m.scale.length * 2)) : null));
    let A = tune(); let B = tune();
    clock(() => s16, (i, t) => {
      const st = i % 16; const bar = Math.floor(i / 16);
      const ch = chordOn(m.scale, prog[bar % 4]);
      if (bar % 4 === 0 && st === 0 && bar % 8 === 0) { A = tune(); B = tune(); }
      // lead: A A B A, the last bar of each A resolving to the root
      const bars = [A, A, B, A];
      const deg = bars[bar % 4][st];
      const rest = energy === 0 && Math.floor(bar / 4) % 2 === 1;
      if (deg !== null && !rest) {
        const n = bar % 4 === 3 && st >= 12 ? ch[0] + 12 : step(m.scale, deg);
        osc(a, { f: hz(root * 4, n), t, dur: s16 * (st % 4 === 0 ? 1.8 : 0.8), wave: lead, attack: 0.002, release: 0.04, gain: 0.03, dest: out, vib: 18, vibRate: 7, vibDelay: 0.12 });
      }
      // arpeggio: the chord as a fast ripple
      if (energy >= 1) osc(a, { f: hz(root * 8, ch[st % 3]), t, dur: s16 * 0.5, wave: thin, attack: 0.001, release: 0.02, gain: 0.011, dest: out });
      // triangle bass
      if (st % 2 === 0) osc(a, { f: hz(root, ch[0] + (st % 4 === 2 ? 12 : 0)), t, dur: s16 * 1.6, type: 'triangle', attack: 0.002, release: 0.03, gain: 0.11, dest: out });
      // noise drums
      if (energy >= 1 && st % 8 === 0) osc(a, { f: 45, glide: 180, t, dur: 0.06, type: 'triangle', release: 0.08, gain: 0.25, dest: out });
      if (energy >= 1 && st % 8 === 4) hiss(a, { t, dur: 0.09, gain: 0.07, type: 'highpass', freq: 1800, dest: out });
      if (energy === 2 && st % 2 === 1) hiss(a, { t, dur: 0.015, gain: 0.03, type: 'highpass', freq: 8000, dest: out });
    });
  },
};
