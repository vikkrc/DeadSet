// Player portraits: simple stylised vector parts on a 100×100 face.
// A portrait is { c, e, m, h } — indices into the colour, eyes, mouth and hair
// sets below. The server only checks the ranges (engine/content.js AVATAR_PARTS).
export const COLORS = ['#e8c4a0', '#d6a57c', '#b07a52', '#8a5636', '#5e3a24', '#f2d7c4', '#c9d6e8', '#bfe3c8', '#e6c7ea', '#f0dc9a'];
const HAIR_COLORS = ['#2b2420', '#4a3426', '#7a4b2a', '#c9a15a', '#e8e1d2', '#8b2e2e', '#2e3a5a', '#3c2a4d', '#1d1d1d', '#a8a8a8'];
const INK = '#1b1714';

// Eyes: drawn around (38, 46) and (62, 46).
const EYES = [
  '<circle cx="38" cy="47" r="4"/><circle cx="62" cy="47" r="4"/>',
  '<path d="M33 47q5-5 10 0M57 47q5-5 10 0" fill="none" stroke-width="3" stroke-linecap="round"/>',
  '<ellipse cx="38" cy="47" rx="5" ry="6.5" fill="#fff"/><ellipse cx="62" cy="47" rx="5" ry="6.5" fill="#fff"/><circle cx="39" cy="48" r="3"/><circle cx="63" cy="48" r="3"/>',
  '<path d="M32 46h12M56 46h12" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M33 44l10 4M67 44l-10 4" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="49" r="2.6"/><circle cx="62" cy="49" r="2.6"/>',
  '<circle cx="38" cy="47" r="6" fill="none" stroke-width="2.4"/><circle cx="62" cy="47" r="6" fill="none" stroke-width="2.4"/><path d="M44 47h12" stroke-width="2.4"/><circle cx="38" cy="47" r="2"/><circle cx="62" cy="47" r="2"/>',
  '<path d="M33 49q5 4 10 0M57 49q5 4 10 0" fill="none" stroke-width="3" stroke-linecap="round"/>',
  '<circle cx="38" cy="47" r="4.5"/><circle cx="62" cy="47" r="4.5"/><circle cx="39.5" cy="45.5" r="1.4" fill="#fff"/><circle cx="63.5" cy="45.5" r="1.4" fill="#fff"/>',
];
// Mouths: around (50, 66).
const MOUTHS = [
  '<path d="M42 64q8 7 16 0" fill="none" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M43 66h14" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M41 63q9 12 18 0z" fill="#5a2020"/>',
  '<path d="M43 68q7-6 14 0" fill="none" stroke-width="3" stroke-linecap="round"/>',
  '<circle cx="50" cy="66" r="4" fill="#5a2020"/>',
  '<path d="M42 66q4 3 8 0t8 0" fill="none" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M43 64q7 6 14 0" fill="none" stroke-width="3" stroke-linecap="round"/><path d="M53 66v4" stroke-width="2.4" stroke-linecap="round"/>',
  '<path d="M44 65q6 4 12-1" fill="none" stroke-width="3" stroke-linecap="round"/><path d="M47 69q3 2 6 0" fill="none" stroke-width="1.6"/>',
];
// Hair: index 0 is bald.
const HAIR = [
  '',
  '<path d="M22 44C20 22 34 12 50 12s30 10 28 32c-4-12-14-18-28-18S26 32 22 44z"/>',
  '<path d="M20 52C16 24 32 10 50 10s34 14 30 42c-2-10-4-16-8-20-6 6-20 8-32 4-8 4-12 8-20 16z"/>',
  '<path d="M24 36c2-16 14-24 26-24s24 8 26 24c-8-6-14-8-26-8s-18 2-26 8z"/><path d="M34 14l4-8 6 7 6-9 6 9 6-7 4 8"/>',
  '<path d="M18 76C10 40 26 12 50 12s40 28 32 64c-2-20-6-32-10-38-6 4-36 4-44 0-4 6-8 18-10 38z"/>',
  '<circle cx="50" cy="12" r="10"/><path d="M24 40c0-16 12-26 26-26s26 10 26 26c-8-8-16-10-26-10s-18 2-26 10z"/>',
  '<path d="M26 38c-4-14 6-28 24-28 10 0 18 4 22 10-6-2-12-2-16 2-6-6-20-4-30 16z"/>',
  '<path d="M20 46c-6-14 2-34 18-34 2-6 22-6 24 0 16 0 24 20 18 34-4-8-6-12-10-14 0 4-4 6-10 6s-8-4-10-6c-2 2-6 2-10 0-4 2-8 6-10 14z"/>',
  '<path d="M28 30c4-12 12-18 22-18s18 6 22 18c-6-4-12-6-22-6s-16 2-22 6z"/><path d="M50 12v-4" stroke-width="3"/>',
  '<path d="M16 50c-2-22 12-40 34-40s36 18 34 40c-2-6-6-10-10-12l-2 8-6-12-4 10-6-12-6 12-4-10-6 12-2-8c-4 2-8 6-10 12z"/>',
];
export const PARTS = { c: COLORS.length, e: EYES.length, m: MOUTHS.length, h: HAIR.length };

export function randomAvatar() {
  return Object.fromEntries(Object.entries(PARTS).map(([k, n]) => [k, Math.floor(Math.random() * n)]));
}

/** SVG markup for a portrait (null → nothing). */
export function avatarSvg(a, cls = '') {
  if (!a) return '';
  const face = COLORS[a.c] ?? COLORS[0];
  const hair = HAIR_COLORS[(a.h * 3 + a.c) % HAIR_COLORS.length];
  return `<svg class="avatar ${cls}" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="50" class="av-bg"/>
    <circle cx="50" cy="52" r="34" fill="${face}"/>
    <g fill="${hair}">${HAIR[a.h] ?? ''}</g>
    <g fill="${INK}" stroke="${INK}">${EYES[a.e] ?? EYES[0]}</g>
    <g fill="${INK}" stroke="${INK}">${MOUTHS[a.m] ?? MOUTHS[0]}</g>
    <ellipse cx="34" cy="60" rx="5" ry="3" fill="#e0707a" opacity=".25"/><ellipse cx="66" cy="60" rx="5" ry="3" fill="#e0707a" opacity=".25"/>
  </svg>`;
}
