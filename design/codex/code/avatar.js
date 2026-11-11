// Dead Set cameo portraits: drop-in replacement for public/avatar.js (same exports, same part counts).
export const COLORS = ['#e8dcc0', '#d6bf94', '#c49a66', '#9a6a44', '#6a4530', '#b4ada0', '#8fae9c', '#9db0cf', '#b09ad2', '#d08f86'];
const HAIR_COLORS = ['#1d1510', '#5a3d28', '#8e3b22', '#c9a35a', '#e8dcc0', '#6f7f9a'];
const INK = '#1d1510';
const EYES = [
  '<circle cx="39" cy="46" r="3.2"/><circle cx="61" cy="46" r="3.2"/>',
  '<path fill="#f3ead6" stroke-width="1.6" d="M32 46c4-6 10-6 14 0-4 5-10 5-14 0zM54 46c4-6 10-6 14 0-4 5-10 5-14 0z"/><circle cx="39" cy="46" r="2.3"/><circle cx="61" cy="46" r="2.3"/>',
  '<path fill="none" stroke-width="2.4" d="M33 45q6 5 12 0M55 45q6 5 12 0"/>',
  '<path fill="none" stroke-width="2.6" d="M33 46h12M55 46h12"/><path fill="none" stroke-width="1.6" d="M32 40h13M55 40h13"/>',
  '<path fill="none" stroke-width="2.4" d="M32 39l13 5M68 39l-13 5"/><circle cx="39" cy="48" r="2.6"/><circle cx="61" cy="48" r="2.6"/>',
  '<circle fill="none" stroke-width="2" cx="38.5" cy="46" r="7"/><circle fill="none" stroke-width="2" cx="61.5" cy="46" r="7"/><path fill="none" stroke-width="2" d="M45.5 46h9"/><circle cx="38.5" cy="46" r="2"/><circle cx="61.5" cy="46" r="2"/>',
  '<path stroke-width="2.4" d="M33 44h12M55 44h12"/><path d="M35 44a4 4 0 0 0 8 0zM57 44a4 4 0 0 0 8 0z"/>',
  '<circle cx="39" cy="46" r="3.2"/><path fill="none" stroke-width="1.6" d="M25 36l51 8"/><path d="M53 41l15-1 1 10c-5 4-12 4-16-1z"/>',
];
const MOUTHS = [
  '<path fill="none" stroke-width="2.4" d="M42 61q8 7 16 0"/>',
  '<path fill="none" stroke-width="2.4" d="M43 63h14"/>',
  '<path fill="#3a0f10" stroke-width="2" d="M40 60q10 13 20 0z"/><path fill="none" stroke="#f3ead6" stroke-width="1.4" d="M44 62.5h12"/>',
  '<path fill="none" stroke-width="2.4" d="M42 65q8-6 16 0"/>',
  '<ellipse cx="50" cy="63.5" rx="4" ry="5" fill="#3a0f10" stroke-width="2"/>',
  '<path fill="none" stroke-width="2.4" d="M43 63q8 4 15-4"/>',
  '<path stroke-width="1" d="M50 58c-4-3-10-2-13 3 5 1 9 0 13-2 4 2 8 3 13 2-3-5-9-6-13-3z"/><path fill="none" stroke-width="2" d="M46 65.5h8"/>',
  '<path fill="none" stroke-width="2.4" d="M41 60q9 8 18 0"/><path fill="#f3ead6" stroke-width="1.2" d="M44.5 62.5l1.5 5 1.5-4.300zM52.5 63.200l1.5 4.300 1.5-5z"/>',
];
const HAIR = [
  '',
  '<path d="M24 44c-2-18 9-29 26-29s28 11 26 29c-3-9-8-14-14-16-8 3-18 3-24-1-7 3-12 8-14 17z"/>',
  '<path d="M23 48c-4-20 8-34 27-34 18 0 30 12 27 32-2-8-5-13-9-16-10 6-26 5-34-2-5 5-9 11-11 20z"/>',
  '<path d="M21 54c-3-15 2-26 10-32-1 8 0 13 4 17-6 4-10 9-14 15zM79 54c3-15-2-26-10-32 1 8 0 13-4 17 6 4 10 9 14 15zM40 24c6-4 14-4 20 0-6 2-14 2-20 0z"/>',
  '<path d="M20 86c-6-34 4-72 30-72s36 38 30 72c-4-2-7-2-10 0 3-22 2-40-4-50-10 5-24 5-32-1-6 10-7 28-4 51-3-2-6-2-10 0z"/>',
  '<circle cx="50" cy="9" r="7.5"/><path d="M24 42c-1-16 10-27 26-27s27 11 26 27c-6-8-14-12-26-12s-20 4-26 12z"/>',
  '<path d="M25 44c-6-17 5-32 22-32 13-4 27 2 31 13-6-3-12-3-17 0-9-5-23-1-36 19z"/>',
  '<path d="M22 48c-6-6-4-14 2-16-2-8 4-14 11-13 2-7 12-9 16-4 5-5 14-3 16 4 7-1 13 5 11 13 6 2 8 10 2 16-2-8-6-13-11-16-10 4-26 4-36 0-5 3-9 8-11 16z"/>',
  '<path d="M12 100c-4-20-2-40 2-56C18 24 31 9 50 9s32 15 36 35c4 16 6 36 2 56H72c5-12 7-24 7-52 0-17-11-28-29-28S21 31 21 48c0 28 2 40 7 52z"/>',
  '<path d="M50 14c-18 0-28 12-27 31 0 14-2 26-7 38 6 1 11-1 14-5 2-12 1-22 0-32 4-9 10-15 20-19 10 4 16 10 20 19-1 10-2 20 0 32 3 4 8 6 14 5-5-12-7-24-7-38 1-19-9-31-27-31z"/>',
];
export const PARTS = { c: COLORS.length, e: EYES.length, m: MOUTHS.length, h: HAIR.length };

export function randomAvatar() {
  return Object.fromEntries(Object.entries(PARTS).map(([k, n]) => [k, Math.floor(Math.random() * n)]));
}

/** SVG markup for a portrait (null → nothing). Clip it to a circle in CSS (.avatar { border-radius: 50% }). */
export function avatarSvg(a, cls = '') {
  if (!a) return '';
  const face = COLORS[a.c] ?? COLORS[0];
  let hair = HAIR_COLORS[(a.h * 3 + a.c) % HAIR_COLORS.length];
  if (hair.toLowerCase() === face.toLowerCase()) hair = HAIR_COLORS[0];
  if (a.h === 8) hair = '#2a2119'; // the cowl is cloth, not hair
  return `<svg class="avatar ${cls}" viewBox="0 0 100 100" aria-hidden="true">
    <rect width="100" height="100" class="av-bg"/>
    <g stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path class="av-robe" d="M40 70v9c-13 2-21 9-25 23h70c-4-14-12-21-25-23v-9z"/><path fill="${face}" d="M50 18c-16 0-26 11-26 28 0 16 10 30 26 30s26-14 26-30c0-17-10-28-26-28z"/></g>
    <path fill="none" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity=".55" d="M65 38l7-5M66 44l8-6M67 50l8-6M67 56l7-5M65 62l6-4.5M62 68l5-4"/>
    <g fill="${hair}" stroke="${INK}" stroke-width="2" stroke-linejoin="round">${HAIR[a.h] ?? ''}</g>
    <g fill="${INK}" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke-width="1.8" d="M50 46v9l-3.5 2"/>${EYES[a.e] ?? EYES[0]}${MOUTHS[a.m] ?? MOUTHS[0]}</g>
  </svg>`;
}
