// Translatable messages. A message is either a plain template string or a
// [template, params] pair. The server stores the message (so every client can
// render it in its own language) and an English rendering as a fallback.
//
// Param conventions (shared with public/i18n.js):
//   role*      → a role id, rendered as the role's name
//   dreamText  → a dream id, rendered as the dream's description
//   dream*     → a dream id, rendered as the dream's name
//   rules      → array of rule ids
//   opt*       → MUTE / NO_VOTE / BLESS / CURSE / DEATH / NON_DEATH option ids
//   dead*      → array of [name, roleId|null] (role shown when revealed)
//   names*     → array of names, joined as a list
//   mcard*     → a Missions mission-card id, rendered as the card's name
//   who/where/why → scenario cards
//   anything else → printed as-is; nested messages are rendered recursively
import { ROLES, DREAMS, RULE_CARDS, MISSION_CARDS } from './content.js';

const OPT = { MUTE: 'Mute', NO_VOTE: 'No Vote', BLESS: 'Bless', CURSE: 'Curse', DEATH: 'Death', NON_DEATH: 'Non-Death' };

export const isMsg = (v) => Array.isArray(v) && v.length === 2 && typeof v[0] === 'string' && v[1] !== null && typeof v[1] === 'object' && !Array.isArray(v[1]);

export function listEn(arr) {
  const a = arr.map(String);
  return a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a.at(-1)}`;
}

function val(k, v) {
  if (v == null) return '';
  if (isMsg(v)) return fmt(v);
  if (k.startsWith('role')) return ROLES[v]?.name ?? String(v);
  if (k.startsWith('mcard')) return MISSION_CARDS[v]?.name ?? String(v);
  if (k === 'dreamText') return DREAMS[v]?.text ?? String(v);
  if (k.startsWith('dream')) return DREAMS[v]?.name ?? String(v);
  if (k === 'rules') return listEn(v.map((r) => RULE_CARDS[r]?.name ?? r));
  if (k.startsWith('opt')) return OPT[v] ?? String(v);
  if (k.startsWith('dead')) return v.map(([n, r]) => (r ? `${n} (${ROLES[r]?.name ?? r})` : n)).join(', ');
  if (k.startsWith('names')) return listEn(v);
  return String(v);
}

/** Render a message in English. */
export function fmt(msg) {
  if (msg == null) return '';
  if (typeof msg === 'string') return msg;
  if (!isMsg(msg)) return String(msg);
  const [tpl, p] = msg;
  return tpl.replace(/\{(\w+)\}/g, (_, k) => val(k, p[k]));
}
