// Shared interludes: one timeline the server runs and every screen follows.
//
// Some public events open a scene everyone watches together (the ceremony,
// nightfall, dawn, the ballots, a mission card, the cards turning...). The
// server stamps each such event with when its scene starts (`mAt`, server
// clock) and how long it lasts (`mDur`). While that sequence plays, inputs are
// locked and the next phase's timer waits; phones and the TV show each scene
// for exactly that window, and a phone that reconnects joins mid-sequence.
//
// This file is pure (no DOM) so the server imports it too: the durations here
// are the single source of truth for both sides.

/** How long each shared scene lasts, in ms. `d` is the scene's data. */
export function sceneMs(type, d = {}) {
  switch (type) {
    case 'night0': return 7600 + (d.rules ?? 0) * 700;
    case 'day1': return 3200;
    case 'nightfall': return 3000;
    case 'bloodmoon': return 4600;
    case 'dawn': return 6400 + 600 * (d.dead ?? 0);
    case 'revive': return 3000;
    case 'call': return 2600;
    case 'tally': return 5200;
    case 'coin': return 5200;
    case 'death': return 3600;
    // Missions
    case 'mlottery': return 8600;
    case 'mlantern': return 3600;
    case 'mintro': return 9000;
    case 'mcard': return 4200;
    case 'mvotes': return 5400;
    case 'mreveal': return 2600 + (d.n ?? 0) * 1150 + 2600;
    case 'mnamed': return 5200;
    case 'munmask': return 5200;
    case 'mreckon': return 6200;
    // Exorcism
    case 'xlottery': return 8600;
    case 'xball': return 7000;
    case 'xvotes': return 5600;
    case 'xguess': return 6200;
    default: return 0;
  }
}

/**
 * The shared scenes one public log entry opens, in order, as [type, data]
 * pairs. `batch` is every entry published by the same change (some scenes fold
 * several entries into one). Empty: the entry opens no shared scene.
 */
export function scenesFor(l, batch = [], ctx = {}) {
  const has = (ev) => batch.some((x) => x.ev === ev);
  switch (l.ev) {
    case 'night0': return [['night0', { rules: ctx.rules ?? 0 }]];
    case 'm-start': return [['night0', { rules: 0 }]];
    case 'day1': return [['day1']];
    case 'nightfall': case 'm-night': return [['nightfall']];
    case 'bloodmoon': return [['bloodmoon']];
    case 'dawn': return [['dawn', { dead: (l.killed?.length ?? 0) + (l.expired?.length ?? 0) }]];
    case 'revive': return has('dawn') ? [] : [['revive']];
    case 'vote-open': case 'final-act': case 'm-stand': case 'm-haunt': return [['call']];
    case 'tally': return [['tally']];
    case 'coinflip': return [['coin']];
    case 'heartbreak': case 'shot': case 'exchange': return [['death']];
    case 'scapegoat': return has('tally') ? [] : [['death']];
    case 'm-lottery': case 'x-lottery': return [['mlottery']];
    case 'm-lantern': return [['mlantern']];
    case 'm-card': return [['mintro'], ['mcard']];
    case 'm-votes': return [['mvotes']];
    case 'm-result': return [['mreveal', { n: l.cards ? l.cards.length : l.count ?? 0 }]];
    case 'm-named': return [['mnamed']];
    case 'm-unmask': return [['munmask']];
    case 'm-reckon': return [['mreckon']];
    case 'x-ball': return [['xball']];
    case 'x-votes': return [['xvotes']];
    case 'x-guess': return [['xguess']];
    default: return [];
  }
}

/** Total length of the shared scenes an entry opens. */
export const interludeMs = (l, batch, ctx) => scenesFor(l, batch, ctx).reduce((s, [type, d]) => s + sceneMs(type, d), 0);

/** Commands that stay open while a shared scene plays. */
export const OPEN_DURING_SCENES = (type) => type.startsWith('lobby.') || type === 'chat.send';
