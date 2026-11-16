// Dead Set: Séance — content (see SEANCE.md §8). Pure data, shared by the engine and the client.
//
// Visions are language-free etchings: two or three motifs collide on a card
// (a key inside a birdcage, stairs that end in water). Each motif carries
// concept tags; a vision's tags are its motifs' tags. The story cards carry
// the same vocabulary, which drives near-miss boards, bot play and the
// "vision fits" check in the tests.

export const TAGS = ['water', 'travel', 'money', 'faith', 'night', 'royalty', 'fire', 'secrecy', 'death', 'time', 'nature',
  'cold', 'love', 'show', 'science', 'food', 'crime', 'home', 'magic', 'chance', 'escape', 'knowledge', 'danger'];

/** Motif (emblem id) → concept tags. */
export const MOTIF_TAGS = {
  death: ['death', 'night'], innocent: ['faith', 'fire'], mentalist: ['secrecy', 'magic', 'knowledge'], guardian: ['faith', 'royalty'],
  psycho: ['crime', 'secrecy'], whore: ['love', 'nature'], agent: ['travel', 'secrecy'], terrorist: ['danger', 'fire'],
  mimic: ['show', 'secrecy'], double: ['secrecy', 'show'], diplomat: ['knowledge', 'royalty'], scapegoat: ['magic', 'death'],
  necro: ['death', 'faith'], conspirator: ['secrecy', 'crime'], magistrate: ['crime', 'money'], oracle: ['magic', 'knowledge'],
  gambler: ['chance', 'money'], vigilante: ['crime', 'danger'], jester: ['show', 'chance'], bodyguard: ['royalty', 'danger'],
  bard: ['show', 'love'], witch: ['magic', 'night'], cult: ['faith', 'secrecy'], ripper: ['crime', 'death'], lovers: ['love', 'danger'],
  paralysis: ['secrecy', 'escape'], premonition: ['magic', 'time'], whispers: ['knowledge', 'magic'], sleepwalk: ['night', 'travel'],
  snatcher: ['chance', 'crime'], nightshift: ['time', 'night'], nightmare: ['night', 'magic'], insomnia: ['night', 'time'],
  angel: ['faith', 'death'], medium: ['magic', 'faith'], believer: ['faith', 'night'], companion: ['fire', 'travel'],
  reaper: ['death', 'nature'], charlatan: ['show', 'secrecy'], veiled: ['secrecy', 'death'], stray: ['fire', 'magic'],
  shade: ['death', 'night'], undertaker: ['death'], twins: ['faith', 'home'], regular: ['travel', 'cold'], lantern: ['night', 'travel'],
  fresh: ['nature', 'food'], skeleton: ['death', 'danger'], maskedvote: ['show', 'secrecy'], patience: ['time'], ward: ['home', 'faith'],
  steadfast: ['royalty', 'home'], brittle: ['danger', 'cold'], smoke: ['cold', 'water'], grand: ['royalty', 'money'],
  trail: ['crime', 'knowledge'], witness: ['secrecy', 'crime'], haunted: ['death', 'home'], succeed: ['faith', 'food'],
  sabotage: ['crime', 'danger'], moon: ['night', 'magic'], sun: ['time', 'nature'], key: ['secrecy', 'escape'], curse: ['magic', 'love'],
  headstone: ['death'], coin: ['money', 'chance'], gift: ['money', 'love'], bell: ['faith', 'time'],
  p_key: ['secrecy', 'escape'], p_sand: ['time', 'travel'], p_ticket: ['travel', 'show'], p_feather: ['nature', 'knowledge'],
  p_watch: ['time'], p_letter: ['love', 'knowledge'], p_perfume: ['love', 'secrecy'], p_cards: ['chance', 'money'],
  p_candle: ['fire', 'faith'], p_photo: ['home', 'show'], p_box: ['secrecy', 'money'], p_compass: ['travel', 'escape'],
  s_early: ['time', 'nature'], s_late: ['night', 'nature'], s_chair: ['home'], s_humble: ['food', 'home'],
  s_neighbours: ['home', 'secrecy'], s_steady: ['water', 'travel'], s_self: ['magic', 'secrecy'],
  v_wave: ['water', 'danger'], v_ship: ['water', 'travel'], v_fish: ['water', 'food'], v_bird: ['nature', 'escape'],
  v_cage: ['escape', 'secrecy'], v_stairs: ['home', 'escape'], v_tree: ['nature', 'death'], v_snake: ['danger', 'magic'],
  v_moth: ['night', 'nature'], v_planet: ['science', 'travel'], v_gear: ['science', 'time'], v_reel: ['show'],
  v_grapes: ['food', 'nature'], v_palm: ['travel', 'nature'], v_snow: ['cold'], v_train: ['travel', 'escape'],
};

// The curated visions: [main motif, second motif, (accent)]. The order is the vision's id (never reorder).
const V = [
  'key v_cage', 'v_stairs v_wave', 'nightshift v_moth', 'grand s_humble', 'v_ship moon', 'v_fish p_key', 'v_bird p_letter', 'v_tree headstone',
  'v_snake succeed', 'v_planet p_compass', 'v_gear patience', 'v_reel maskedvote', 'v_grapes ripper', 'v_palm p_sand', 'v_snow lantern', 'v_train p_ticket',
  'coin p_box', 'gambler grand', 'p_cards psycho', 'oracle v_wave', 'whispers key', 'witch moon', 'death v_grapes', 'shade v_stairs',
  'undertaker v_ship', 'angel v_cage', 'necro p_candle', 'believer v_snow', 'lovers ripper', 'whore headstone', 'curse p_perfume', 'bell v_wave',
  'steadfast lantern', 's_neighbours witness', 's_chair shade', 'trail p_photo', 'conspirator p_box', 'magistrate coin', 'sabotage grand', 'terrorist nightshift',
  'skeleton v_palm', 'v_moth p_candle', 'v_bird sun', 'v_fish s_humble', 's_steady v_snake', 'v_planet insomnia', 'v_gear mentalist', 'v_reel double',
  'jester v_cage', 'bard lovers', 'mimic p_photo', 'cult v_tree', 'medium v_moth', 'premonition v_train', 'sleepwalk v_stairs', 'nightmare v_snow',
  'p_watch v_wave', 'p_feather p_letter', 'p_compass regular', 'companion v_tree', 'reaper v_grapes', 'haunted s_neighbours', 'smoke v_ship', 'brittle steadfast',
  'veiled v_reel', 'agent v_train', 'diplomat grand', 'guardian grand', 'scapegoat p_candle', 'fresh headstone', 'ward key', 's_early v_bird',
  's_late v_grapes', 'stray whispers', 'paralysis p_letter', 'witness v_planet', 'p_sand patience', 'gift v_snake', 's_self maskedvote', 'v_cage v_moth',
  'coin v_fish', 'vigilante p_cards', 'succeed lovers', 'oracle nightshift',
];
// A small third motif on every fourth vision: the dream gets stranger, and a little less certain.
const ACCENTS = ['moon', 'key', 'p_candle', 'bell', 'coin', 'v_moth', 'p_feather', 'sun', 'p_watch', 'v_bird', 'headstone', 'v_wave'];

export const VISIONS = V.map((s, id) => {
  const motifs = s.split(' ');
  if (id % 4 === 3) { const a = ACCENTS[(id >> 2) % ACCENTS.length]; if (!motifs.includes(a)) motifs.push(a); }
  const tags = [...new Set(motifs.flatMap((x) => MOTIF_TAGS[x] ?? []))];
  return { id, motifs, tags, layout: id % 4 };
});
export const VISION_COUNT = VISIONS.length;

/** Story cards (index-aligned with SCENARIO in content.js) → concept tags. */
export const STORY_TAGS = {
  WHO: [['time', 'science', 'travel'], ['science', 'travel', 'escape'], ['magic', 'nature'], ['death', 'royalty', 'knowledge'], ['science', 'danger'],
    ['secrecy', 'faith', 'magic'], ['travel', 'escape'], ['science', 'knowledge'], ['home', 'faith', 'food'], ['show', 'secrecy'],
    ['show', 'chance', 'fire'], ['water', 'night', 'cold'], ['food', 'crime'], ['royalty', 'escape', 'money'], ['night', 'death', 'time'],
    ['water', 'danger'], ['love', 'food'], ['science', 'night', 'cold'], ['show', 'secrecy', 'love'], ['faith', 'secrecy', 'knowledge']],
  WHERE: [['water', 'travel', 'danger'], ['show', 'chance'], ['escape', 'danger', 'home'], ['home', 'death'], ['cold', 'nature'],
    ['water', 'night', 'cold'], ['science', 'escape'], ['travel', 'night', 'cold'], ['water', 'faith'], ['nature', 'science'],
    ['travel', 'water', 'money', 'fire'], ['faith', 'knowledge'], ['food', 'night', 'nature'], ['show', 'secrecy'], ['time', 'science', 'knowledge']],
  WHY: [['money', 'secrecy'], ['escape', 'time'], ['magic', 'faith', 'fire'], ['crime', 'death'], ['danger', 'time'],
    ['magic', 'death'], ['chance', 'money'], ['royalty', 'danger'], ['travel', 'home'], ['secrecy', 'crime'],
    ['night', 'danger'], ['crime', 'faith'], ['night', 'magic', 'home'], ['knowledge', 'secrecy'], ['secrecy', 'crime']],
};

/** How well a vision fits a card: shared tags. */
export const fit = (vision, row, idx) => {
  const tags = STORY_TAGS[row][idx] ?? [];
  return VISIONS[vision].tags.filter((x) => tags.includes(x)).length;
};
