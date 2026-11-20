// A1: one tarot-style cover per game, generated from the mode registry: the family, the mode's emblem in the
// lancet arch on its accent, the title in blackletter, the one-line pitch, players and playing time.
// Used by the lobby, the game picker (S1), the guest lobby (U5) and the home strip (U6).

import { MODES, FAMILIES } from './modes.js';
import { cardArt } from './cards.js';
import { t, th, presetF } from './i18n.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** The game's name as a cover shows it: without the "Dead Set:" prefix the other modes carry (Classic keeps its name). */
export const modeTitle = (id) => (MODES[id]?.name ? t(MODES[id].name) : presetF(id, 'name')).replace(/^Dead Set\s*:\s*/i, '');
/** The pitch: the registry blurb without its trailing player count (the meta line carries that). */
export const modePitch = (id) => t(MODES[id]?.blurb ?? '').replace(/\s*\d+\s*[–-]\s*\d+[^.]*\.\s*$/, '');
export const modeMeta = (id) => { const m = MODES[id]; return m ? `${m.min}–${m.max} · ${th('~{n} min', { n: m.minutes ?? 20 })}` : ''; };

/** The cover. size: '' (lobby), 'mini' (picker rows, home strip). */
export function cover(id, { size = '', act = '', key = '' } = {}) {
  const m = MODES[id];
  if (!m) return '';
  const fam = FAMILIES.find((f) => f.id === m.family);
  const tag = act ? 'button' : 'div';
  return `<${tag} class="tarot tarot--cover ${size}" style="--cv:${m.accent ?? 'var(--gilt)'}" ${act ? `type="button" data-act="${act}" data-id="${id}"` : ''} data-key="${key || `cover-${id}-${size}`}">
    <span class="cv-fam">${esc(t(fam?.title ?? ''))}</span>${cardArt(m.emblem, { rays: false })}<b class="cv-title">${esc(modeTitle(id))}</b>
    ${size === 'mini' ? '' : `<small class="cv-pitch">${esc(modePitch(id))}</small><span class="cv-meta">${esc(modeMeta(id))}</span>`}</${tag}>`;
}
