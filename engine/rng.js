// Authoritative randomness. Production uses crypto.randomInt; tests inject a
// seeded generator and may script specific labelled draws (e.g. 'bomb', 'd6').
import { randomInt } from 'node:crypto';

export function secureRng() {
  return { int: (n) => (n <= 1 ? 0 : randomInt(n)) };
}

/** Deterministic mulberry32 generator. `script` maps label → array of forced values. */
export function seededRng(seed = 1, script = {}) {
  let a = seed >>> 0;
  const queues = Object.fromEntries(Object.entries(script).map(([k, v]) => [k, [...v]]));
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    int(n, label) {
      if (label && queues[label]?.length) return queues[label].shift();
      return n <= 1 ? 0 : Math.floor(next() * n);
    },
  };
}

export function pick(rng, arr, label) {
  return arr[rng.int(arr.length, label)];
}

export function shuffle(rng, arr, label) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng.int(i + 1, label);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
