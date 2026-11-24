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
    case 'doom': return 4800; // the Doomsday Clock: how many days remain, at the first morning and every dawn
    case 'nightfall': return 3000;
    case 'bloodmoon': return 4600;
    case 'dawn': return 6400 + 600 * (d.dead ?? 0);
    case 'revive': return 3000;
    case 'call': return 2600;
    case 'tally': return 3000; // the ballots, counted
    case 'verdict': return 3400; // then, on its own screen, who is sentenced (or spared)
    case 'coin': return 4400;
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
    // Midnight
    case 'nfall': return 3200;
    case 'ndawn': return 3600;
    // Graverobbers
    case 'ospin': return 6600; // wind-back and spin 3.6 s, a held breath, then the face lights and the name is stamped
    case 'wprompt': return 4800;
    case 'wreveal': return 3200;
    case 'qstart': return 5200;
    case 'qaccuse': return 3400;
    case 'qverdict': return 4400;
    case 'qunmask': return 3400;
    case 'qguess': return 4800;
    case 'qtime': return 3200;
    case 'gstart': return 8600; // every first-player draw lasts as long as the wheel (C8)
    case 'gsign': return 3000;
    case 'gcoin': return 3600;
    case 'gdig': return 3800;
    // Séance
    case 'svisions': return 3600 + Math.min(d.n ?? 0, 10) * 450;
    case 'scold': return 2600;
    case 'sverdict': return 2200 + (d.n ?? 0) * 2400;
    case 'slast': return 3200;
    case 'sname': return 3000;
    case 'snamed': return 5600;
    // Carnival
    case 'kintro': return 3400;
    case 'kswap': return 3400;
    case 'kclaim': return 3200;
    case 'kreveal': return 3200 + Math.min(d.n ?? 0, 12) * 800 + 2400;
    case 'kpower': return d.coin ? 6000 : 4400;
    // Coffins
    case 'cdig': return 2800;
    case 'cresult': return 3800 + Math.min(d.n ?? 0, 12) * 600;
    case 'crise': return 3600;
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
    case 'day1': return ctx.doomsday ? [['day1'], ['doom']] : [['day1']];
    case 'nightfall': case 'm-night': return [['nightfall']];
    case 'bloodmoon': return [['bloodmoon']];
    case 'dawn': return [['dawn', { dead: (l.killed?.length ?? 0) + (l.expired?.length ?? 0) }], ...(ctx.doomsday && !has('end') && l.day <= ctx.doomsday ? [['doom']] : [])];
    case 'revive': return has('dawn') ? [] : [['revive']];
    case 'vote-open': case 'final-act': case 'm-stand': case 'm-haunt': return [['call']];
    case 'tally': return has('coinflip') ? [['tally']] : [['tally'], ['verdict']];
    case 'coinflip': return [['coin'], ['verdict']];
    case 'heartbreak': case 'shot': case 'exchange': return [['death']];
    case 'scapegoat': return has('tally') ? [] : [['death']];
    case 'm-lottery': case 'x-lottery': case 'c-lottery': case 'k-lottery': case 's-lottery': return [['mlottery']];
    case 'o-reveal': return [['ospin']];
    case 'w-prompt': return [['wprompt']];
    case 'w-reveal': return [['wreveal']];
    case 'q-start': return [['qstart']];
    case 'q-accuse': return [['qaccuse']];
    case 'q-verdict': return [['qverdict']];
    case 'q-unmask': return [['qunmask']];
    case 'q-guess': return [['qguess']];
    case 'q-time': return [['qtime']];
    case 'g-start': return [['gstart']];
    case 'g-sign': return [['gsign']];
    case 'g-dig': return l.coin ? [['gcoin'], ['gdig', { kind: l.kind }]] : [['gdig', { kind: l.kind }]];
    case 's-visions': return [['svisions', { n: l.count ?? 0 }]];
    case 's-cold': return [['scold']];
    case 's-verdict': return [['sverdict', { n: l.rows?.length ?? 0 }]];
    case 's-last': return [['slast']];
    case 's-naming': return [['sname']];
    case 's-named': return [['snamed']];
    case 'n-night': return [['nfall']];
    case 'n-dawn': return [['ndawn']];
    case 'k-unmask': return (l.order ?? Object.keys(l.masks ?? {})).map(() => ['kintro']);
    case 'k-swap': return [['kswap']];
    case 'k-claim': return [['kclaim']];
    case 'k-reveal': return [['kreveal', { n: Object.keys(l.reveal ?? {}).length }]];
    case 'k-power': return [['kpower', { coin: l.coin ?? null }]];
    case 'c-dig': return [['cdig']];
    case 'c-result': return [['cresult', { n: l.opened?.length ?? 0 }]];
    case 'c-rise': return [['crise']];
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

/**
 * P1: three scene sizes. Full scenes take both screens and hold the timeline (a death, a verdict, the deal…).
 * Turn-level events (a swap or a claim in Carnival, a sign or a dig in Graverobbers, a dig called in Coffins, an
 * accusation in Mimic) are banners: under Part III they drop as a public herald slip, inputs stay open, and they do
 * not hold the timeline. Opening Death's grave stays a full scene. (Inline steps live on the table itself.)
 */
const BANNER = new Set(['kswap', 'kclaim', 'gsign', 'gdig', 'cdig', 'qaccuse']);
export const sceneSize = (type, d = {}) => (type === 'gdig' && d.kind === 'D' ? 'full' : BANNER.has(type) ? 'banner' : 'full');

/**
 * P3: the table's pace. Brisk plays every full scene at 0.6 of its length (the client speeds the scene's
 * animations and cues up to match) and drops banners to inline: no slip, just the table and its sound.
 */
export const paceScale = (pace) => (pace === 'brisk' ? 0.6 : 1);

/** Total length of the full scenes an entry opens: only those hold the shared timeline. */
export const interludeMs = (l, batch, ctx = {}) => Math.round(scenesFor(l, batch, ctx).reduce((s, [type, d]) => s + (sceneSize(type, d) === 'full' ? sceneMs(type, d) : 0), 0) * paceScale(ctx.pace));

/** Commands that stay open while a shared scene plays. */
export const OPEN_DURING_SCENES = (type) => type.startsWith('lobby.') || type === 'chat.send';
