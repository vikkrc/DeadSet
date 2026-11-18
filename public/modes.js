// The mode registry (CONSISTENCY-PASS B7): one entry per game mode, pure data, importable by the server like
// interludes.js. Every list of modes elsewhere (the lobby's families, the rematch rule, the body's mode
// attribute, the lobby music, end-screen rules) reads from here, so a new mode is added in one place.
//
// Strings are English translation keys; callers pass them through t().

/** The lobby's families, in order: modes grouped by their core mechanic. */
export const FAMILIES = [
  { id: 'hidden', title: 'Hidden Allegiances', sub: 'Secret sides, a town that must find its killers.' },
  { id: 'hands', title: 'Changing Hands', sub: 'Role cards change owners while nobody is looking. Trust your memory.' },
  { id: 'reading', title: 'Reading the Room', sub: 'No hidden sides: read the people around you, and outguess them.' },
  { id: 'signs', title: 'Signs & Riddles', sub: 'Someone knows the secret and may only hint. Read the signs.' },
  { id: 'wager', title: 'Bluff & Wager', sub: 'Bury, bid and dare. A quick game of nerve.' },
];

/**
 * Per mode:
 * - family, emblem, blurb: the lobby card (the title is the preset's name; Classic's is `name`).
 * - min, max: players.
 * - prefix: the engine's phase prefix (null for Classic's day/night phases).
 * - rematchReady: the end screen returns the table to the lobby with everyone ready.
 * - draw: the first-player scene ('wheel', 'coin', 'fan' or null).
 * - lobbyMood: the music the lobby plays while this mode is chosen.
 * - rolesAtEnd: the end screen turns every role card face up (and lists every secret).
 * - aliveCount: the header counts the living.
 * - story: the mode deals WHO / WHERE / WHY story cards.
 */
export const MODES = {
  classic: { family: 'hidden', emblem: 'death', name: 'Classic Dead Set', blurb: 'Hidden roles, night kills, Dreams and Rule cards. 5–25 players.', min: 5, max: 25,
    prefix: null, rematchReady: false, draw: null, lobbyMood: 'lobby', rolesAtEnd: true, aliveCount: true, story: true },
  missions: { family: 'hidden', emblem: 'mission', blurb: 'Teams, votes and sabotage. Nobody dies. 5–12 players.', min: 5, max: 12,
    prefix: 'M_', rematchReady: false, draw: 'wheel', lobbyMood: 'mGather', rolesAtEnd: true, aliveCount: false, story: true },
  carnival: { family: 'hands', emblem: 'veiled', blurb: 'A masked ball of bluff and memory: swap masks, claim powers, gather Souls. 4–12 players.', min: 4, max: 12,
    prefix: 'K_', rematchReady: true, draw: 'wheel', lobbyMood: 'kUnmask' },
  midnight: { family: 'hands', emblem: 'moon', blurb: 'One night, one vote: cards change hands in the dark. 4–12 players.', min: 4, max: 12,
    prefix: 'N_', rematchReady: true, draw: null, lobbyMood: 'nDeal' },
  omen: { family: 'reading', emblem: 'oracle', blurb: 'A wheel of Life, Death and Rebirth that anyone may secretly turn. Predict where it stops. 4–12 players.', min: 4, max: 12,
    prefix: 'O_', rematchReady: true, draw: null, lobbyMood: 'oShow' },
  mirror: { family: 'reading', emblem: 'maskedvote', blurb: 'Answer a dilemma, and predict how a friend answers it. 4–12 players.', min: 4, max: 12,
    prefix: 'W_', rematchReady: true, draw: null, lobbyMood: 'wTalk' },
  exorcism: { family: 'signs', emblem: 'oracle', blurb: 'A word game of bluff: one word each, then name the Demon. 3–12 players.', min: 3, max: 12,
    prefix: 'X_', rematchReady: true, draw: 'wheel', lobbyMood: 'xLobby', rolesAtEnd: true },
  seance: { family: 'signs', emblem: 'shade', blurb: 'A silent Ghost sends visions; find who, where and why, and the Deceiver. 4–10 players.', min: 4, max: 10,
    prefix: 'S_', rematchReady: true, draw: 'wheel', lobbyMood: 'sGather' },
  graverobbers: { family: 'signs', emblem: 'headstone', blurb: 'Two crews dig a cemetery of words or icons; one word and a number from the Undertaker. 4–12 players.', min: 4, max: 12,
    prefix: 'G_', rematchReady: true, draw: 'coin', lobbyMood: 'gYard' },
  mimic: { family: 'signs', emblem: 'mimic', blurb: 'Everyone knows the place except the Mimic. Ask, answer, accuse. 4–12 players.', min: 4, max: 12,
    prefix: 'Q_', rematchReady: true, draw: 'fan', lobbyMood: 'qDeal' },
  coffins: { family: 'wager', emblem: 'undertaker', blurb: 'A quick bluffing game: bury gold, hide your curse, bid and dig. 3–10 players.', min: 3, max: 10,
    prefix: 'C_', rematchReady: true, draw: 'wheel', lobbyMood: 'cLobby' },
};

export const MODE_IDS = Object.keys(MODES);
export const modeInfo = (id) => MODES[id] ?? MODES.classic;
/** The mode a phase belongs to (by its prefix), or null for Classic's and shared phases. */
export const modeOfPhase = (phase) => MODE_IDS.find((id) => MODES[id].prefix && String(phase ?? '').startsWith(MODES[id].prefix)) ?? null;
/** Modes whose end screen sends everyone back to the lobby ready to go again. */
export const REMATCH_READY = MODE_IDS.filter((id) => MODES[id].rematchReady);
/** The collection at a glance, for the home page. */
export const COLLECTION = { modes: MODE_IDS.length, min: Math.min(...MODE_IDS.map((id) => MODES[id].min)), max: Math.max(...MODE_IDS.map((id) => MODES[id].max)) };
