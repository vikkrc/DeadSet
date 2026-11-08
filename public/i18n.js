// Client-side translation. English is the source language: interface strings
// are looked up by their English text, game content (roles, dreams, rules,
// scenario cards) by id. Server messages arrive as [template, params] and are
// rendered here in the player's own language.
export const LANGS = [
  { code: 'en', name: 'English' }, { code: 'hu', name: 'Magyar' }, { code: 'sk', name: 'Slovenčina' },
  { code: 'cs', name: 'Čeština' }, { code: 'de', name: 'Deutsch' }, { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' },
];
const CODES = LANGS.map((l) => l.code);

let lang = 'en';
let D = null; // current dictionary (null = English)
const cache = {};
let EN = { roles: {}, dreams: {}, rules: {}, presets: {}, scenario: { WHO: [], WHERE: [], WHY: [] }, products: [] };

export const getLang = () => lang;
export const isLang = (c) => CODES.includes(c);

/** Best guess from the browser, used before the player has chosen. */
export function browserLang() {
  for (const l of navigator.languages || [navigator.language || 'en']) {
    const c = String(l).slice(0, 2).toLowerCase();
    if (CODES.includes(c)) return c;
  }
  return 'en';
}

export async function loadLang(code) {
  if (!CODES.includes(code)) code = 'en';
  if (code !== 'en' && !cache[code]) {
    try { cache[code] = (await import(`/i18n/${code}.js`)).default; } catch { code = 'en'; }
  }
  D = code === 'en' ? null : cache[code];
  lang = code;
  document.documentElement.lang = code;
  return code;
}

/** English game content from /api/content (the fallback for every lookup). */
export function setContent(c) {
  if (!c) return;
  EN = {
    roles: Object.fromEntries(c.roles.map((r) => [r.id, r])),
    dreams: Object.fromEntries(c.dreams.map((d) => [d.id, d])),
    rules: Object.fromEntries(c.rules.map((r) => [r.id, r])),
    presets: Object.fromEntries(c.presets.map((p) => [p.id, p])),
    scenario: c.scenario,
    products: c.products ?? [],
  };
}

const escH = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// ── Content lookups ────────────────────────────────────────────────────────
export const roleF = (id, f) => D?.roles?.[id]?.[f] ?? EN.roles[id]?.[f] ?? (f === 'name' ? id : '');
export const dreamF = (id, f) => D?.dreams?.[id]?.[f] ?? EN.dreams[id]?.[f] ?? (f === 'name' ? id : '');
export const ruleF = (id, f) => D?.rules?.[id]?.[f] ?? EN.rules[id]?.[f] ?? (f === 'name' ? id : '');
export const presetF = (id, f) => D?.presets?.[id]?.[f] ?? EN.presets[id]?.[f] ?? id;
/** Scenario card: translate the built-in cards, keep custom (host-written) text. */
export function scen(kind, english) {
  const i = (EN.scenario[kind] || []).indexOf(english);
  return i >= 0 ? (D?.scenario?.[kind]?.[i] ?? english) : english;
}
export function product(english) {
  const i = EN.products.indexOf(english);
  return i >= 0 ? (D?.products?.[i] ?? english) : english;
}
const OPT = { MUTE: 'Mute', NO_VOTE: 'No Vote', BLESS: 'Bless', CURSE: 'Curse', DEATH: 'Side with Death', NON_DEATH: 'Stay non-Death', SILENCE: 'Silence the Night' };
export const optLabel = (id) => t(OPT[id] ?? id);

export function list(arr) {
  const a = arr.map(String);
  const and = D?.and ?? 'and';
  return a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} ${and} ${a.at(-1)}`;
}

/** "Day 3" / "Night 2" / "Lobby" / "End" stamps. */
export function stamp(at) {
  const m = String(at ?? '').match(/^(Day|Night) (\d+)$/);
  if (m) return t(`${m[1]} {n}`, { n: m[2] });
  return t(String(at ?? ''));
}

// ── Messages ───────────────────────────────────────────────────────────────
const isMsg = (v) => Array.isArray(v) && v.length === 2 && typeof v[0] === 'string' && v[1] !== null && typeof v[1] === 'object' && !Array.isArray(v[1]);

function val(k, v) {
  if (v == null) return '';
  if (isMsg(v)) return tm(v);
  if (k.startsWith('role')) return roleF(v, 'name');
  if (k === 'dreamText') return dreamF(v, 'text');
  if (k.startsWith('dream')) return dreamF(v, 'name');
  if (k === 'rules') return list(v.map((r) => ruleF(r, 'name')));
  if (k.startsWith('opt')) return optLabel(v);
  if (k.startsWith('dead')) return v.map(([n, r]) => (r ? `${n} (${roleF(r, 'name')})` : n)).join(', ');
  if (k.startsWith('names')) return list(v);
  if (k === 'who' || k === 'where' || k === 'why') return scen(k.toUpperCase(), v);
  if (k === 'product') return product(v);
  if (k === 'preset') return presetF(String(v).toLowerCase().split(' ')[0], 'name');
  return String(v);
}

function fill(s, p, html) {
  return s.replace(/\{(\w+)\}/g, (all, k) => (k in p ? (html ? escH(val(k, p[k])) : val(k, p[k])) : all));
}

// While testing (localhost or ?i18n=debug), remember strings a dictionary lacks.
const DEBUG = typeof location !== 'undefined' && (location.hostname === 'localhost' || location.search.includes('i18n=debug'));
const missing = new Set();
if (DEBUG && typeof window !== 'undefined') window.__i18nMissing = missing;
const look = (tpl) => {
  const hit = D?.ui?.[tpl];
  if (hit === undefined && D && DEBUG && tpl && /[a-z]/i.test(tpl) && !missing.has(tpl)) { missing.add(tpl); console.warn(`[i18n:${lang}] missing:`, tpl); }
  return hit ?? tpl;
};

/** Translate an interface string (plain text). */
export function t(tpl, p) {
  const s = look(tpl);
  return p ? fill(s, p, false) : s;
}
/** Translate for HTML: the template is trusted, parameters are escaped. */
export function th(tpl, p) {
  const s = look(tpl);
  return p ? fill(s, p, true) : s;
}
/** Render a server message (string or [template, params]) as plain text. */
export function tm(msg) {
  if (msg == null) return '';
  if (typeof msg === 'string') return t(msg);
  if (isMsg(msg)) return t(msg[0], msg[1]);
  return String(msg);
}
/** Render a server message for HTML. */
export function tmh(msg) {
  if (msg == null) return '';
  if (typeof msg === 'string') return escH(t(msg));
  if (isMsg(msg)) return th(msg[0], msg[1]);
  return escH(String(msg));
}
/** A log entry's message, falling back to its English text. */
export const entryMsg = (l) => l.msg ?? l.text;
/** A localized extra table (e.g. home whispers, guide sections). */
export const extra = (key, fallback) => D?.[key] ?? fallback;
