// The Dead Set Gazette: the public record as illustrated editions, and the
// dawn front page. Built only from public log events (`ev` codes), worded with
// the match's own WHO / WHERE / WHY scenario cards.
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
const roman = (n) => ROMAN[n] ?? String(n);
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n) => WORDS[n] ?? String(n);

/** Scenario phrases, robust to custom (host-written) strings. */
export function scenarioWords(sc) {
  const who = (sc?.who || 'Strangers').trim();
  const where = (sc?.where || 'a quiet town').trim();
  const why = (sc?.why || 'Survive the Night').trim();
  const theWho = /^the\s/i.test(who) ? who : `The ${who}`;
  const place = where.replace(/^(a|an|the)\s+/i, '');
  const goal = why.charAt(0).toLowerCase() + why.slice(1);
  return { who, theWho, where, place, why, goal };
}

const listNames = (names) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);

/** Group public events into editions (newest first). */
export function editions(v) {
  const name = (id) => v.players.find((p) => p.id === id)?.name ?? 'Someone';
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
          if (s) ed.chips.push({ icon: 'mentalist', text: s.who }, { icon: 'necro', text: s.where }, { icon: 'scroll', text: s.why });
          break;
        }
        case 'nominate':
          if (!accused.includes(l.target)) accused.push(l.target);
          ed.chips.push({ acc: [name(l.by), name(l.target)], text: `${name(l.by)} ${l.first ? 'accuses' : 'seconds'} ${name(l.target)}` });
          break;
        case 'immunity': ed.chips.push({ icon: 'diplomat', text: `${name(l.who)} claims immunity` }); break;
        case 'shot': ed.chips.push({ icon: 'vigilante', cls: 'kill', text: l.victims?.length ? `Shot: ${listNames(l.victims.map(name))}` : 'A shot missed' }); break;
        case 'tally': {
          const t = Object.entries(l.totals || {}).sort((a, b) => b[1] - a[1]).map(([id, w]) => `${name(id)} ${w}`).join(' · ');
          ed.chips.push({ icon: 'magistrate', text: t || 'No valid votes' });
          break;
        }
        case 'sentence': ed.chips.push({ icon: 'dagger', cls: 'kill', text: `${name(l.victims[0])} sentenced` }); break;
        case 'nosentence': case 'novote': ed.chips.push({ icon: 'scroll', text: l.ev === 'novote' ? 'No nominations' : 'No sentence' }); break;
        case 'cancelled': ed.chips.push({ icon: 'gambler', text: 'Sentence cancelled' }); break;
        case 'scapegoat': ed.chips.push({ icon: 'scapegoat', cls: 'kill', text: `The Scapegoat pays: ${name(l.victims[0])}` }); break;
        case 'exchange': ed.chips.push({ icon: 'dagger', cls: 'kill', text: `${name(l.victims[0])} taken in exchange` }); break;
        case 'dawn': {
          const killed = (l.killed ?? []).map(name);
          for (const k of killed) ed.chips.push({ icon: 'dagger', cls: 'kill', text: k });
          for (const e of (l.expired ?? []).map(name)) ed.chips.push({ icon: 'death', text: `${e}'s borrowed time ran out` });
          if (!killed.length && !(l.expired ?? []).length) ed.chips.push({ icon: 'sun', text: 'Everyone woke' });
          break;
        }
        case 'revive': ed.chips.push({ icon: 'necro', text: `${listNames((l.ids ?? []).map(name))} returned` }); break;
        case 'rules': break;
        case 'end': ed.chips.push({ icon: l.winner === 'DEATH' ? 'death' : l.winner === 'JESTER' ? 'jester' : 'innocent', cls: l.winner === 'DEATH' ? 'kill' : '', text: l.reason }); break;
        default: break;
      }
    }
    if (ed.kind === 'start') {
      ed.title = 'The story begins';
      if (v.activeRules?.length) ed.chips.push(...v.activeRules.map((r) => ({ icon: 'magistrate', cls: 'rulechip', text: r.name })));
    } else if (ed.kind === 'night') {
      const dawn = has('dawn');
      const killed = (dawn?.killed ?? []).map(name);
      if (!dawn) ed.title = 'The town sleeps';
      else if (killed.length) { ed.title = `${listNames(killed)} found dead`; ed.tone = 'dead'; } else ed.title = 'A quiet night';
    } else if (ed.kind === 'day') {
      const s = has('sentence'); const g = has('scapegoat'); const shot = has('shot'); const ex = has('exchange');
      if (s) { ed.title = `The town sentences ${name(s.victims[0])}`; ed.tone = 'dead'; } else if (g) { ed.title = 'The Scapegoat pays'; ed.tone = 'dead'; } else if (has('cancelled')) ed.title = 'Fate intervenes';
      else if (has('nosentence') || has('novote')) ed.title = 'No one is sentenced';
      else if (accused.length) ed.title = `${listNames(accused.map(name))} ${accused.length > 1 ? 'stand' : 'stands'} accused`;
      else if (shot?.victims?.length) { ed.title = 'A shot rings out'; ed.tone = 'dead'; } else ed.title = num === 1 ? 'The first morning' : 'The floor is open';
      if (ex && !s) ed.tone = 'dead';
    } else {
      const e = has('end');
      ed.title = { DEATH: 'Death wins', NON_DEATH: 'The living win', JESTER: 'The Jester wins', DRAW: 'A draw', ABORTED: 'Abandoned' }[e?.winner] ?? 'The end';
      ed.tone = e?.winner === 'DEATH' ? 'dead' : '';
    }
    out.push(ed);
  }
  return out.reverse();
}

/** The Gazette column / record: masthead + editions. */
export function gazetteHtml(v, { glyph, esc, masthead = true, limit = 40 } = {}) {
  const w = scenarioWords(v.scenario);
  const alive = v.players.filter((p) => p.alive).length;
  const eds = editions(v).slice(0, limit);
  const edLabel = v.phase === 'ENDED' ? 'Final edition' : v.dayNumber ? `Day ${roman(v.dayNumber)} edition` : 'First edition';
  const chip = (c) => {
    if (c.acc) return `<span class="ev"><span class="mini">${esc(c.acc[0][0])}</span><span class="arrow">⟶</span><span class="mini">${esc(c.acc[1][0])}</span>${esc(c.text)}</span>`;
    return `<span class="ev ${c.cls ?? ''}">${c.icon ? glyph(c.icon) : ''}${esc(c.text)}</span>`;
  };
  return `<div class="gazette">
    ${masthead ? `<div class="mast"><h3>The Dead Set <i>Gazette</i></h3><div><span>${esc(v.scenario ? w.place : 'Unknown parts')}</span><span>${esc(edLabel)}</span><span>${alive} of ${v.players.length} alive</span></div></div>` : ''}
    ${eds.length ? eds.map((e, i) => `<article class="edition ${i === 0 && v.phase !== 'ENDED' ? 'today' : ''}" data-key="ed-${esc(e.key)}">
      <div class="when">${glyph(e.kind === 'night' || e.kind === 'start' ? 'moon' : e.kind === 'end' ? 'scroll' : 'sun')}<b>${e.kind === 'end' ? '·' : roman(e.num)}</b><span>${e.kind === 'start' ? 'Night 0' : e.kind === 'end' ? 'Verdict' : e.kind === 'night' ? 'Night' : 'Day'}</span></div>
      <div><h4 class="${e.tone}">${esc(e.title)}</h4><div class="events">${e.chips.map(chip).join('')}</div></div>
    </article>`).join('') : '<p class="small muted">The presses are quiet. Nothing has happened yet.</p>'}
  </div>`;
}

/** Full-page dawn front page (TV board). */
export function frontPageHtml(v, m, { esc }) {
  const w = scenarioWords(v.scenario);
  const killed = m.killed ?? [];
  const expired = m.expired ?? [];
  const dead = killed.length;
  const alive = v.players.filter((p) => p.alive).length;
  const total = v.players.length;
  const headline = dead === 0 ? `A quiet night in ${w.place}` : dead === 1 ? `${killed[0]} found dead` : dead === 2 ? `${killed[0]} and ${killed[1]} found dead` : `${word(dead)} found dead`;
  const others = Math.max(0, alive - (m.revived?.length ?? 0));
  const dek = dead === 0
    ? `${w.theWho} of ${w.where} woke to a full table. No one was taken in the night.`
    : `${w.theWho} woke in ${w.where} to ${dead === 1 ? 'an empty chair' : `${word(dead)} empty chairs`}; ${word(others)} ${others === 1 ? 'other rose' : 'others rose'} unharmed.`;
  const victimLine = dead === 0
    ? 'Every door was found as it was left, and every chair was filled at the morning count.'
    : dead === 1 ? `${killed[0]} did not answer the morning call. No one saw who came for them.`
      : `${listNames(killed)} did not answer the morning call. No one saw who came for them.`;
  const body = `Day ${roman(m.day)} dawns in ${w.where}. ${victimLine} ${w.theWho} must still ${w.goal} — and at least one of the ${word(alive)} who remain is lying.`;
  const deadAll = v.players.filter((p) => !p.alive).map((p) => p.name);
  const lastTally = [...v.log].reverse().find((l) => l.at === `Day ${m.day - 1}` && ['sentence', 'nosentence', 'novote', 'cancelled', 'scapegoat'].includes(l.ev));
  const yesterday = !lastTally ? '—' : lastTally.ev === 'sentence' ? `${v.players.find((p) => p.id === lastTally.victims?.[0])?.name ?? '?'} sentenced` : lastTally.ev === 'scapegoat' ? 'Scapegoat paid' : 'No sentence';
  const portrait = dead ? `<div class="portrait">${esc(killed[0][0])}<svg viewBox="0 0 100 100"><path d="M52 8 L46 30 L58 42 L44 60 L54 76 L48 94"/><path d="M58 42 L74 46"/><path d="M44 60 L28 58"/></svg></div>`
    : '<div class="portrait empty">∅</div>';
  return `<div class="paper" data-key="paper-${m.id}">
    <div class="mh"><h2>The Dead Set Gazette</h2><div><span>${esc(w.place)}</span><span>Dawn of Day ${roman(m.day)}</span><span>Price: one soul</span></div></div>
    <div class="hl">${esc(headline.toUpperCase())}</div>
    <p class="dk">${esc(dek)}${m.revived?.length ? ` ${esc(listNames(m.revived))} returned from the grave.` : ''}${expired.length ? ` Borrowed time ran out for ${esc(listNames(expired))}.` : ''}</p>
    <div class="cols">
      <p>${esc(body)}</p>
      <div class="photo">${portrait}<span>${esc(dead ? `${killed[0]} · Night ${roman(m.day - 1)}` : 'The empty chair was not filled')}</span></div>
      <div class="facts">
        <div><span>Alive</span><span>${alive} of ${total}</span></div>
        <div><span>The dead</span><span>${esc(deadAll.join(' · ') || 'none')}</span></div>
        <div><span>Yesterday</span><span>${esc(yesterday)}</span></div>
        <div><span>Rules</span><span>${esc(v.activeRules.map((r) => r.name).join(' · ') || 'none')}</span></div>
        <div><span>Their purpose</span><span>${esc(w.why)}</span></div>
      </div>
    </div>
    ${dead ? '<div class="stampx">Extra</div>' : ''}
  </div>`;
}
