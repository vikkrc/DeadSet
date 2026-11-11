// The Arcana: one tarot deck for the whole game (see design/codex/DESIGN-GUIDE.md §7).
// Shared by the phone (app.js, missions.js) and the TV (board.js).
import { emblem } from './emblems.js';

/** Fixed card numbers, so the deck feels like a real one. Death is XIII. */
export const ROLE_NUM = {
  INNOCENT: '0', MIMIC: 'I', MENTALIST: 'II', WHORE: 'III', MAGISTRATE: 'IV', DIPLOMAT: 'V', GUARDIAN: 'VII', BODYGUARD: 'VIII',
  ORACLE: 'IX', GAMBLER: 'X', VIGILANTE: 'XI', SCAPEGOAT: 'XII', DEATH: 'XIII', TRAVELING_AGENT: 'XIV', PSYCHO: 'XV', TERRORIST: 'XVI',
  BARD: 'XVII', WITCH: 'XVIII', DOUBLE_AGENT: 'XIX', NECROMANCER: 'XX', CONSPIRATOR: 'XXI', JESTER: '★', CULT_LEADER: '★', RIPPER: '★',
};
/** Roles whose emblem id differs from their interface glyph. */
const ROLE_EMBLEM = {
  COMPANION: 'companion', REAPER: 'reaper', SHADE: 'shade', UNDERTAKER: 'undertaker', TWIN: 'twins', M_JESTER: 'jester',
  X_LIVING: 'living', X_DEMON: 'demon', CULT_LEADER: 'cult', RIPPER: 'ripper',
};
export const roleEmblemId = (role) => ROLE_EMBLEM[role?.id] ?? role?.glyph ?? 'innocent';
/** The card's top line: a Roman numeral for the classic deck, the mode's name otherwise. */
export const roleNumber = (role, t) => ROLE_NUM[role?.id] ?? (role?.set === 'missions' ? t('Mission') : role?.set === 'exorcism' ? t('Exorcism') : '★');

/** Card art: the emblem inside its ray ring, in a lancet-arched window. */
export const cardArt = (id) => `<span class="arc-art" aria-hidden="true">${emblem(id, { rays: true, cls: 'arc-emb' })}</span>`;

const MCARD_EMBLEM = {
  REGULAR: 'regular', LANTERN: 'lantern', FRESH_FACES: 'fresh', EXTRA_HAND: 'extra', SKELETON_CREW: 'skeleton', MASKED_VOTE: 'maskedvote',
  SHORT_PATIENCE: 'patience', WARD: 'ward', STEADFAST: 'steadfast', BRITTLE: 'brittle', SMOKE: 'smoke', GRAND: 'grand', TRAIL: 'trail',
  WITNESS: 'witness', HAUNTED_ROAD: 'haunted',
};
export const missionEmblemId = (id) => MCARD_EMBLEM[id] ?? 'regular';
