// Hand-drawn line glyphs on a 32×32 grid. Stroke only; colour comes from CSS.
const P = {
  // roles
  death: '<path d="M10 4h12M10 28h12M11 4c0 7 10 7 10 12s-10 5-10 12M21 4c0 7-10 7-10 12s10 5 10 12"/><path d="M14 24.5h4" />',
  innocent: '<path d="M16 5c-3 4-4 6.5-4 9a4 4 0 0 0 8 0c0-2.5-1-5-4-9z"/><path d="M13 22h6v6h-6z"/>',
  mentalist: '<path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z"/><circle cx="16" cy="16" r="3.5"/>',
  guardian: '<path d="M16 3l10 4v8c0 7-5 11-10 14C11 26 6 22 6 15V7z"/><path d="M16 9v14"/>',
  psycho: '<circle cx="16" cy="16" r="11"/><path d="M16 5l-2 6 4 3-3 5 2 8"/><path d="M10 14h2M20 14h2"/>',
  whore: '<circle cx="12.5" cy="16" r="6.5"/><circle cx="19.5" cy="16" r="6.5"/>',
  agent: '<rect x="5" y="11" width="22" height="15" rx="1"/><path d="M12 11V7h8v4M5 17h22"/>',
  terrorist: '<circle cx="14" cy="19" r="8"/><path d="M19 13l3-3M22 10c1-2 3-3 5-2M24 5l1 2M28 6l-2 1"/>',
  mimic: '<rect x="5" y="5" width="14" height="14"/><rect x="13" y="13" width="14" height="14" stroke-dasharray="2 2"/>',
  double: '<circle cx="16" cy="16" r="11"/><path d="M16 5a11 11 0 0 1 0 22z" fill="currentColor" stroke="none" opacity=".85"/>',
  diplomat: '<path d="M8 6h16v14l-8 6-8-6z"/><path d="M12 12h8M12 16h8"/>',
  scapegoat: '<path d="M9 6c-3 4-2 9 3 10M23 6c3 4 2 9-3 10"/><path d="M12 16c0 6 2 10 4 10s4-4 4-10"/><path d="M14 20h4"/>',
  necro: '<path d="M9 28V12a7 7 0 0 1 14 0v16"/><path d="M5 28h22M16 14v8M13 17h6"/>',
  conspirator: '<path d="M5 8h15v10H11l-4 4v-4H5z"/><path d="M14 22h7l4 4v-4h2V12h-3" stroke-dasharray="2 2"/>',
  magistrate: '<path d="M16 5v22M9 27h14M6 9h20"/><path d="M6 9l-3 8h6zM26 9l-3 8h6z"/>',
  oracle: '<circle cx="16" cy="14" r="9"/><path d="M10 27h12l-2-4h-8z"/><path d="M12 12a4 4 0 0 1 4-3"/>',
  gambler: '<rect x="6" y="6" width="20" height="20" rx="2"/><circle cx="11" cy="11" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/><circle cx="21" cy="21" r="1.2" fill="currentColor"/>',
  vigilante: '<circle cx="16" cy="16" r="9"/><path d="M16 3v8M16 21v8M3 16h8M21 16h8"/>',
  jester: '<path d="M5 24l3-14 8 8 8-8 3 14z"/><circle cx="8" cy="8" r="2"/><circle cx="24" cy="8" r="2"/><circle cx="16" cy="15" r="1.5"/><path d="M5 27h22"/>',
  bodyguard: '<path d="M13 4l9 4v7c0 6-4 9-9 12-5-3-9-6-9-12V8z"/><path d="M22 10l6 2v6c0 4-3 7-6 9" />',
  bard: '<path d="M10 26c-4 0-5-5-2-8 2-2 5-1 6-3l6-10 3 2-6 10c1 2 3 4 1 7-2 2-5 2-8 2z"/><circle cx="12" cy="21" r="2"/>',
  witch: '<path d="M20 5a11 11 0 1 0 7 17A9 9 0 0 1 20 5z"/><path d="M24 9l1 2 2 .5-2 1-1 2-1-2-2-1 2-.5z"/>',
  cult: '<path d="M16 4c-6 0-9 6-9 12v11h18V16c0-6-3-12-9-12z"/><path d="M12 17c1-2 7-2 8 0M13.5 21h5"/><circle cx="16" cy="13" r="1.3" fill="currentColor"/>',
  ripper: '<path d="M8 25L22 6l3 2-12 19z"/><path d="M8 25l-3 3M11 22l3 3"/><path d="M20 12c3 2 5 6 4 11" stroke-dasharray="1.5 2"/>',
  heart: '<path d="M16 27S4 19.5 4 11.5A6 6 0 0 1 16 9a6 6 0 0 1 12 2.5C28 19.5 16 27 16 27z"/>',
  coin: '<circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7.5" stroke-dasharray="2 2"/><path d="M16 11v10M13 13.5c0-1.5 6-1.5 6 0s-6 2-6 4 6 2 6 0"/>',
  gift: '<rect x="5" y="13" width="22" height="14" rx="1"/><path d="M4 9h24v4H4zM16 9v18M16 9c-2-5-8-5-7-1 1 2 5 1 7 1zM16 9c2-5 8-5 7-1-1 2-5 1-7 1z"/>',
  bot: '<rect x="7" y="10" width="18" height="14" rx="4"/><circle cx="12.5" cy="17" r="1.6" fill="currentColor"/><circle cx="19.5" cy="17" r="1.6" fill="currentColor"/><path d="M16 10V6M13 21h6"/><circle cx="16" cy="5" r="1.2"/>',
  clue: '<circle cx="13" cy="13" r="7"/><path d="M18 18l8 8"/><path d="M10 12a3 3 0 0 1 3-3"/>',
  // dreams
  paralysis: '<rect x="5" y="12" width="9" height="8" rx="4"/><rect x="18" y="12" width="9" height="8" rx="4"/><path d="M12 16h8"/>',
  premonition: '<path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z"/><path d="M16 11l1.3 3.7L21 16l-3.7 1.3L16 21l-1.3-3.7L11 16l3.7-1.3z"/>',
  whispers: '<path d="M16 16a2 2 0 1 1 2-2 4 4 0 1 1-4-4 6 6 0 1 1-6 6 8 8 0 1 1 8 8"/>',
  sleepwalk: '<path d="M9 6c3 0 4 3 3 7s-5 3-5 0 0-7 2-7zM21 15c3 0 4 3 3 7s-5 3-5 0 0-7 2-7z"/>',
  snatcher: '<path d="M6 11h18l-4-4M26 21H8l4 4"/>',
  nightshift: '<circle cx="16" cy="16" r="11"/><path d="M16 9v7l5 3"/>',
  nightmare: '<circle cx="12" cy="16" r="6"/><circle cx="20" cy="16" r="6"/><path d="M16 11.5v9" stroke-dasharray="1.5 1.5"/>',
  insomnia: '<path d="M4 18s5-7 12-7 12 7 12 7"/><circle cx="16" cy="18" r="3"/><path d="M16 4v4M7 7l2 3M25 7l-2 3"/>',
  angel: '<ellipse cx="16" cy="7" rx="7" ry="2.5"/><path d="M16 12v14M10 18c-3-1-5 1-6 4 4 0 6-1 6-4zM22 18c3-1 5 1 6 4-4 0-6-1-6-4z"/>',
  // ui
  moon: '<path d="M21 5a11 11 0 1 0 6 18A10 10 0 0 1 21 5z"/>',
  sun: '<circle cx="16" cy="16" r="5"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3"/>',
  dagger: '<path d="M16 3l2 4v13h-4V7zM10 20h12M16 20v6M14 28h4"/>',
  scroll: '<path d="M8 6h14v20H10a2 2 0 0 1-2-2zM22 6a2 2 0 0 1 2 2v2h-2"/><path d="M12 12h6M12 16h6M12 20h4"/>',
  close: '<path d="M8 8l16 16M24 8L8 24"/>',
  menu: '<path d="M5 9h22M5 16h22M5 23h14"/>',
  veil: '<path d="M4 16s5-8 12-8 12 8 12 8-5 8-12 8-12-8-12-8z"/><path d="M6 26L26 6"/>',
  check: '<path d="M6 17l6 6L26 9"/>',
  up: '<path d="M10 19l6-6 6 6"/>',
  down: '<path d="M10 13l6 6 6-6"/>',
  key: '<circle cx="11" cy="16" r="5"/><path d="M16 16h12M24 16v4M28 16v3"/>',
  out: '<path d="M13 8H6v16h7M18 11l5 5-5 5M23 16H11"/>',
  bell: '<path d="M9 22V14a7 7 0 0 1 14 0v8l2 3H7z"/><path d="M14 28h4"/>',
  bellOff: '<path d="M9 22V14a7 7 0 0 1 14 0v8l2 3H7z"/><path d="M14 28h4M5 5l22 22"/>',
};

export function glyph(name, cls = '') {
  const d = P[name] || P.scroll;
  return `<svg class="glyph ${cls}" viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

const DREAM_GLYPH = {
  SLEEP_PARALYSIS: 'paralysis', PREMONITION: 'premonition', WHISPERS: 'whispers', SLEEPWALKING: 'sleepwalk',
  DREAM_SNATCHER: 'snatcher', NIGHT_SHIFT: 'nightshift', SHARED_NIGHTMARE: 'nightmare', INSOMNIA: 'insomnia', GUARDIAN_ANGEL: 'angel',
};
export const dreamGlyph = (id) => glyph(DREAM_GLYPH[id] || 'moon');
