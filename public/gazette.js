// The Dead Set Gazette: the public record as illustrated editions, and the
// dawn front page. Built only from public log events (`ev` codes), worded with
// the match's own WHO / WHERE / WHY scenario cards, in the reader's language.
// Helpers (t, tm, scen, ruleF, tlist, tx, getLang) come from the caller.
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
const roman = (n) => ROMAN[n] ?? String(n);
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** Scenario phrases, robust to custom (host-written) strings. */
export function scenarioWords(sc, h) {
  const en = h.getLang() === 'en';
  const who = h.scen('WHO', (sc?.who || 'Strangers').trim());
  const where = h.scen('WHERE', (sc?.where || 'a quiet town').trim());
  const why = h.scen('WHY', (sc?.why || 'Survive the Night').trim());
  const theWho = !en || /^the\s/i.test(who) ? who : `The ${who}`;
  const place = en ? where.replace(/^(a|an|the)\s+/i, '') : where;
  const goal = h.getLang() === 'de' ? why : why.charAt(0).toLowerCase() + why.slice(1);
  return { who, theWho, where, place, why, goal };
}

/** Group public events into editions (newest first). */
export function editions(v, h) {
  const { t, tm, tlist, scen, ruleF } = h;
  const name = (id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
  const groups = new Map();
  for (const l of v.log) {
    if (!l.ev || l.at === 'Lobby') continue;
    if (!groups.has(l.at)) groups.set(l.at, []);
    groups.get(l.at).push(l);
  }
  const out = [];
  for (const [at, list] of groups) {
    const [kind, numStr] = at.split(' ');
    const num = Number(numStr);
    const ed = { key: at, kind: kind === 'Night' ? (num === 0 ? 'start' : 'night') : kind === 'Day' ? 'day' : 'end', num, title: '', tone: '', chips: [] };
    const has = (ev) => list.find((x) => x.ev === ev);
    const accused = [];
    for (const l of list) {
      switch (l.ev) {
        case 'scenario': {
          const s = v.scenario;
          if (s) ed.chips.push({ icon: 'mentalist', text: scen('WHO', s.who) }, { icon: 'necro', text: scen('WHERE', s.where) }, { icon: 'scroll', text: scen('WHY', s.why) });
          break;
        }
        case 'nominate':
          if (!accused.includes(l.target)) accused.push(l.target);
          ed.chips.push({ acc: [name(l.by), name(l.target)], text: t(l.first ? '{a} accuses {b}' : '{a} seconds {b}', { a: name(l.by), b: name(l.target) }) });
          break;
        case 'immunity': ed.chips.push({ icon: 'diplomat', text: t('{name} claims immunity', { name: name(l.who) }) }); break;
        case 'shot': ed.chips.push({ icon: 'vigilante', cls: 'kill', text: l.victims?.length ? t('Shot: {names}', { names: l.victims.map(name) }) : t('A shot missed') }); break;
        case 'tally': {
          const x = Object.entries(l.totals || {}).sort((a, b) => b[1] - a[1]).map(([id, w]) => `${name(id)} ${w}`).join(' · ');
          ed.chips.push({ icon: 'magistrate', text: x || t('No valid votes') });
          break;
        }
        case 'sentence': ed.chips.push({ icon: 'dagger', cls: 'kill', text: t('{name} sentenced', { name: name(l.victims[0]) }) }); break;
        case 'nosentence': case 'novote': ed.chips.push({ icon: 'scroll', text: l.ev === 'novote' ? t('No nominations') : t('No sentence') }); break;
        case 'cancelled': ed.chips.push({ icon: 'gambler', text: t('Sentence cancelled') }); break;
        case 'coinflip': ed.chips.push({ icon: 'coin', text: t('A coin decided: {name}', { name: name(l.winner) }) }); break;
        case 'heartbreak': for (const id of l.victims ?? []) ed.chips.push({ icon: 'heart', cls: 'kill', text: t('{name} died of a broken heart', { name: name(id) }) }); break;
        case 'scapegoat': ed.chips.push({ icon: 'scapegoat', cls: 'kill', text: t('The Scapegoat pays: {name}', { name: name(l.victims[0]) }) }); break;
        case 'exchange': ed.chips.push({ icon: 'dagger', cls: 'kill', text: t('{name} taken in exchange', { name: name(l.victims[0]) }) }); break;
        case 'dawn': {
          const killed = (l.killed ?? []).map(name);
          for (const k of killed) ed.chips.push({ icon: 'dagger', cls: 'kill', text: k });
          for (const e of (l.expired ?? []).map(name)) ed.chips.push({ icon: 'death', text: t('{name}\'s borrowed time ran out', { name: e }) });
          if (!killed.length && !(l.expired ?? []).length) ed.chips.push({ icon: 'sun', text: t('Everyone woke') });
          break;
        }
        case 'revive': ed.chips.push({ icon: 'necro', text: t('{names} returned', { names: (l.ids ?? []).map(name) }) }); break;
        case 'rules': break;
        case 'end': ed.chips.push({ icon: { DEATH: 'death', JESTER: 'jester', LOVERS: 'heart', CULT: 'cult', RIPPER: 'ripper' }[l.winner] ?? 'innocent', cls: ['DEATH', 'RIPPER'].includes(l.winner) ? 'kill' : '', text: tm(l.reason) }); break;
        default: break;
      }
    }
    if (ed.kind === 'start') {
      ed.title = t('The story begins');
      if (v.activeRules?.length) ed.chips.push(...v.activeRules.map((r) => ({ icon: 'magistrate', cls: 'rulechip', text: ruleF(r.id, 'name') })));
    } else if (ed.kind === 'night') {
      const dawn = has('dawn');
      const killed = (dawn?.killed ?? []).map(name);
      if (!dawn) ed.title = t('The town sleeps');
      else if (killed.length) { ed.title = t('{names} found dead', { names: killed }); ed.tone = 'dead'; } else ed.title = t('A quiet night');
    } else if (ed.kind === 'day') {
      const s = has('sentence'); const g = has('scapegoat'); const shot = has('shot'); const ex = has('exchange');
      if (s) { ed.title = t('The town sentences {name}', { name: name(s.victims[0]) }); ed.tone = 'dead'; } else if (g) { ed.title = t('The Scapegoat pays'); ed.tone = 'dead'; } else if (has('cancelled')) ed.title = t('Fate intervenes');
      else if (has('nosentence') || has('novote')) ed.title = t('No one is sentenced');
      else if (accused.length) ed.title = t(accused.length > 1 ? '{names} stand accused' : '{names} stands accused', { names: accused.map(name) });
      else if (shot?.victims?.length) { ed.title = t('A shot rings out'); ed.tone = 'dead'; } else ed.title = num === 1 ? t('The first morning') : t('The floor is open');
      if (ex && !s) ed.tone = 'dead';
    } else {
      const e = has('end');
      ed.title = t({ DEATH: 'Death wins', NON_DEATH: 'The living win', JESTER: 'The Jester wins', DRAW: 'A draw', ABORTED: 'Abandoned', LOVERS: 'The Lovers win', CULT: 'The Cult wins', RIPPER: 'The Ripper wins' }[e?.winner] ?? 'The end');
      ed.tone = ['DEATH', 'RIPPER'].includes(e?.winner) ? 'dead' : '';
    }
    out.push(ed);
  }
  return out.reverse();
}

/** The Gazette column / record: masthead + editions. */
export function gazetteHtml(v, h, { masthead = true, limit = 40 } = {}) {
  const { glyph, esc, t, th } = h;
  const w = scenarioWords(v.scenario, h);
  const alive = v.players.filter((p) => p.alive).length;
  const eds = editions(v, h).slice(0, limit);
  const edLabel = v.phase === 'ENDED' ? t('Final edition') : v.dayNumber ? t('Day {n} edition', { n: roman(v.dayNumber) }) : t('First edition');
  const when = (e) => (e.kind === 'start' ? t('Night {n}', { n: 0 }) : e.kind === 'end' ? t('Verdict') : e.kind === 'night' ? t('Night') : t('Day'));
  const chip = (c) => {
    if (c.acc) return `<span class="ev"><span class="mini">${esc(c.acc[0][0])}</span><span class="arrow">⟶</span><span class="mini">${esc(c.acc[1][0])}</span>${esc(c.text)}</span>`;
    return `<span class="ev ${c.cls ?? ''}">${c.icon ? glyph(c.icon) : ''}${esc(c.text)}</span>`;
  };
  return `<div class="gazette">
    ${masthead ? `<div class="mast"><h3>${th('The Dead Set <i>Gazette</i>')}</h3><div><span>${esc(v.scenario ? w.place : t('Unknown parts'))}</span><span>${esc(edLabel)}</span><span>${th('{a} of {b} alive', { a: alive, b: v.players.length })}</span></div></div>` : ''}
    ${eds.length ? eds.map((e, i) => `<article class="edition ${i === 0 && v.phase !== 'ENDED' ? 'today' : ''}" data-key="ed-${esc(e.key)}">
      <div class="when">${glyph(e.kind === 'night' || e.kind === 'start' ? 'moon' : e.kind === 'end' ? 'scroll' : 'sun')}<b>${e.kind === 'end' ? '·' : roman(e.num)}</b><span>${esc(when(e))}</span></div>
      <div><h4 class="${e.tone}">${esc(e.title)}</h4><div class="events">${e.chips.map(chip).join('')}</div></div>
    </article>`).join('') : `<p class="small muted">${t('The presses are quiet. Nothing has happened yet.')}</p>`}
  </div>`;
}

/** Full-page dawn front page (TV board). */
export function frontPageHtml(v, m, h) {
  const { esc, t, tlist, ruleF, tx } = h;
  const words = h.getLang() === 'en' ? WORDS : tx('numbers', null);
  const word = (n) => words?.[n] ?? String(n);
  const w = scenarioWords(v.scenario, h);
  const killed = m.killed ?? [];
  const expired = m.expired ?? [];
  const dead = killed.length;
  const alive = v.players.filter((p) => p.alive).length;
  const total = v.players.length;
  const headline = dead === 0 ? t('A quiet night in {place}', { place: w.place }) : dead === 1 ? t('{name} found dead', { name: killed[0] }) : dead === 2 ? t('{a} and {b} found dead', { a: killed[0], b: killed[1] }) : t('{n} found dead', { n: word(dead) });
  const others = Math.max(0, alive - (m.revived?.length ?? 0));
  const p = { theWho: w.theWho, place: w.place, wh: w.where, goal: w.goal };
  const dek = dead === 0
    ? t('{theWho} of {wh} woke to a full table. No one was taken in the night.', p)
    : `${dead === 1 ? t('{theWho} woke in {wh} to an empty chair;', p) : t('{theWho} woke in {wh} to {n} empty chairs;', { ...p, n: word(dead) })} ${others === 1 ? t('one other rose unharmed.') : t('{n} others rose unharmed.', { n: word(others) })}`;
  const victimLine = dead === 0
    ? t('Every door was found as it was left, and every chair was filled at the morning count.')
    : t('{names} did not answer the morning call. No one saw who came for them.', { names: killed });
  const body = `${t('Day {n} dawns in {wh}.', { ...p, n: roman(m.day) })} ${victimLine} ${t('{theWho} must still {goal} — and at least one of the {n} who remain is lying.', { ...p, n: word(alive) })}`;
  const deadAll = v.players.filter((x) => !x.alive).map((x) => x.name);
  const lastTally = [...v.log].reverse().find((l) => l.at === `Day ${m.day - 1}` && ['sentence', 'nosentence', 'novote', 'cancelled', 'scapegoat'].includes(l.ev));
  const yesterday = !lastTally ? '—' : lastTally.ev === 'sentence' ? t('{name} sentenced', { name: v.players.find((x) => x.id === lastTally.victims?.[0])?.name ?? '?' }) : lastTally.ev === 'scapegoat' ? t('Scapegoat paid') : t('No sentence');
  const portrait = dead ? `<div class="portrait">${esc(killed[0][0])}<svg viewBox="0 0 100 100"><path d="M52 8 L46 30 L58 42 L44 60 L54 76 L48 94"/><path d="M58 42 L74 46"/><path d="M44 60 L28 58"/></svg></div>`
    : '<div class="portrait empty">∅</div>';
  return `<div class="paper" data-key="paper-${m.id}">
    <div class="mh"><h2>${esc(t('The Dead Set Gazette'))}</h2><div><span>${esc(w.place)}</span><span>${esc(t('Dawn of Day {n}', { n: roman(m.day) }))}</span><span>${esc(t('Price: one soul'))}</span></div></div>
    <div class="hl">${esc(headline.toLocaleUpperCase(h.getLang()))}</div>
    <p class="dk">${esc(dek)}${m.revived?.length ? ` ${esc(t('{names} returned from the grave.', { names: m.revived }))}` : ''}${expired.length ? ` ${esc(t('Borrowed time ran out for {names}.', { names: expired }))}` : ''}</p>
    <div class="cols">
      <p>${esc(body)}</p>
      <div class="photo">${portrait}<span>${esc(dead ? t('{name} · Night {n}', { name: killed[0], n: roman(m.day - 1) }) : t('The empty chair was not filled'))}</span></div>
      <div class="facts">
        <div><span>${esc(t('Alive'))}</span><span>${esc(t('{a} of {b}', { a: alive, b: total }))}</span></div>
        <div><span>${esc(t('The dead'))}</span><span>${esc(deadAll.join(' · ') || t('none'))}</span></div>
        <div><span>${esc(t('Yesterday'))}</span><span>${esc(yesterday)}</span></div>
        <div><span>${esc(t('Rules'))}</span><span>${esc(v.activeRules.map((r) => ruleF(r.id, 'name')).join(' · ') || t('none'))}</span></div>
        <div><span>${esc(t('Their purpose'))}</span><span>${esc(w.why)}</span></div>
      </div>
    </div>
    ${dead ? `<div class="stampx">${esc(t('Extra'))}</div>` : ''}
  </div>`;
}
