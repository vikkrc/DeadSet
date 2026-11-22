// Dead Set: Mimic — the client (phones, TV, scenes, lobby, end). See MIMIC.md.
//
// A familiar room, slightly wrong. The Living hold the place (a WHERE story card with its etching)
// and a character there (a WHO card); the Mimic holds static. A lantern passes round the table with
// each question; the board of possible places sits under everything, with private strike-outs.

import { glyph } from './icons.js';
import { waitText } from './kit.js';
import { emblem } from './emblems.js';
import { cardArt } from './cards.js';
import { t, th, roleF, scenAt, scen, setNamer } from './i18n.js';
import { avatarSvg } from './avatar.js';
import { backdropSvg } from './backdrops.js';
import { scard } from './seance.js';
import { seatLayout } from './layout.js';

// Log lines carry the English card names: show them in the reader's language.
setNamer('where', (x) => scen('WHERE', String(x)));
setNamer('who', (x) => scen('WHO', String(x)));

export const isMimicPhase = (ph) => typeof ph === 'string' && ph.startsWith('Q_');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rawName = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
const pname = (v, id) => esc(rawName(v, id));
const place = (i) => scenAt('WHERE', i);
const mmss = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

function disc(v, id, cls = '') {
  const p = v.players.find((x) => x.id === id);
  return `<span class="q-disc ${cls}">${p?.avatar ? avatarSvg(p.avatar, 'q-av') : `<b>${esc((p?.name ?? '?').slice(0, 1))}</b>`}</span>`;
}
const doNow = (title, hint = '', cls = '') => `<div class="s-do q-do ${cls}" data-key="qdo-${esc(String(title)).slice(0, 24)}"><h2>${title}</h2>${hint ? `<p>${hint}</p>` : ''}</div>`;

// ── Cards ──────────────────────────────────────────────────────────────────
/** The Mimic's card: static where the place should be. Same size and shape as the Living's pair. */
function staticCard(cls = '') {
  return `<span class="tarot scard q-static ${cls}"><span class="arc-num">${esc(t('Where'))}</span><span class="q-noise" aria-hidden="true"></span><span class="nm">${esc(t('Static'))}</span></span>`;
}
function mimicRoleCard(cls = '') {
  return `<span class="tarot scard q-role rubric ${cls}"><span class="arc-num">${esc(t('Who'))}</span><span class="s-ic">${emblem('mimic')}</span><span class="nm">${esc(roleF('Q_MIMIC', 'name'))}</span></span>`;
}

/** Your card: the place and your character (Living), or static and the Mimic (the Mimic). */
function myCard(v, me, UI) {
  const q = me?.q ?? {};
  const hidden = !!UI.ui.qhide;
  const pair = q.mimic ? `${staticCard()}${mimicRoleCard()}` : q.loc != null ? `${scard('WHERE', q.loc)}${scard('WHO', q.who)}` : '';
  const line = q.mimic ? t('You are the Mimic. You do not know the place: listen, blend in, work it out.')
    : q.loc != null ? th('You are {who}, at {where}.', { who: scenAt('WHO', q.who), where: place(q.loc) }) : '';
  const unmask = q.mimic && v.phase === 'Q_ASK' ? `<button class="btn hold btn-ghost btn-sm q-unmask ${UI.ui.holding === 'qUnmask' ? 'holding' : ''}" data-hold="qUnmask" data-key="hold-qUnmask"><span class="hold-fill"></span><span class="hold-label">${esc(t('Hold to unmask and name the place'))}</span></button>` : '';
  return `<section class="q-card ${hidden ? 'hidden' : ''}" data-key="qcard">
    <header><span class="kicker">${t('Your card')}</span><button class="chip" data-act="qHide">${glyph(hidden ? 'mentalist' : 'close')}<span>${t(hidden ? 'Show my card' : 'Hide my card')}</span></button></header>
    ${hidden ? '' : `<div class="q-pair">${pair}</div><p class="q-line">${esc(line)}</p>${unmask}`}</section>`;
}

// ── The board of possible places ───────────────────────────────────────────
/**
 * Every possible place. `act` makes cards tappable (strike-outs, or the Mimic's guess);
 * `struck` greys out a phone's private notes; `truth` / `guess` mark the end.
 */
export function placesBoard(v, { act = '', sel = null, struck = new Set(), truth = null, guess = null, size = '' } = {}) {
  const Q = v.mimic;
  return `<div class="q-places ${size} n${Q.board.length}" data-key="qplaces-${size}">${Q.board.map((i) => {
    const state = truth === i ? 'solved' : struck.has(i) ? 'struck' : guess === i ? 'guess' : '';
    return scard('WHERE', i, { act, sel: sel === i, state, cls: 'q-place', key: `qp-${i}` });
  }).join('')}</div>`;
}

/** The arrows of the last few questions, drawn between seats on the ring. */
export function askArrows(v, keep = 4) {
  const list = (v.mimic?.asked ?? []).slice(-keep);
  if (!list.length) return '';
  const seated = [...v.players].sort((a, b) => a.seat - b.seat);
  const { pos } = seatLayout(seated.length);
  const at = (id) => { const i = seated.findIndex((p) => p.id === id); return i < 0 ? null : pos[i]; };
  const paths = list.map((x, i) => {
    const p1 = at(x.by); const p2 = at(x.to);
    if (!p1 || !p2) return '';
    const dx = p2.x - p1.x; const dy = p2.y - p1.y; const len = Math.hypot(dx, dy) || 1;
    const trim = 6.5;
    const x1 = p1.x + (dx / len) * trim; const y1 = p1.y + (dy / len) * trim;
    const x2 = p2.x - (dx / len) * trim; const y2 = p2.y - (dy / len) * trim;
    const mx = ((x1 + x2) / 2) * 0.7 + 15; const my = ((y1 + y2) / 2) * 0.7 + 15;
    const last = i === list.length - 1;
    return `<path class="${last ? 'last' : ''}" style="--age:${list.length - 1 - i}" d="M${x1.toFixed(2)} ${y1.toFixed(2)} Q${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}" marker-end="url(#qa-${last ? 'last' : 'old'})"/>`;
  }).join('');
  const marker = (id) => `<marker id="qa-${id}" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0 0L6 3L0 6z" class="${id}"/></marker>`;
  return `<svg class="q-arrows" viewBox="0 0 100 100" aria-hidden="true" data-key="qarrows-${v.mimic.askCount}"><defs>${marker('last')}${marker('old')}</defs>${paths}</svg>`;
}

/** The lantern strip: who holds it, the last question, the clock. */
function lantern(v) {
  const Q = v.mimic;
  const last = Q.asked?.at(-1);
  const clock = v.phase === 'Q_ASK' ? '<b class="clock q-clock" data-clock></b>' : Q.remain != null ? `<b class="q-clock paused">${mmss(Q.remain)}</b>` : '';
  return `<div class="q-bar" data-key="qbar"><span class="q-lantern">${emblem('lantern')}</span>
    <span class="q-who">${Q.asker ? th('{a} holds the lantern', { a: rawName(v, Q.asker) }) : esc(t('The cards'))}${last ? `<small>${esc(rawName(v, last.by))} → ${esc(rawName(v, last.to))}</small>` : ''}</span>${clock}</div>`;
}

// ── Phone ──────────────────────────────────────────────────────────────────
export function mimicMain(v, me, h) {
  const { S: UI, head, ring } = h;
  const Q = v.mimic;
  if (!Q) return head(v);
  const a = v.action || {};
  const q = me?.q ?? {};
  const key = `${v.code}:${(Q.board ?? []).join('.')}`;
  if (UI.ui.qkey !== key) { UI.ui.qkey = key; UI.ui.qstruck = []; UI.ui.qhide = false; UI.sel.qacc = null; UI.sel.qguess = null; UI.ui.qaccuse = false; }
  const struck = new Set(UI.ui.qstruck ?? []);
  const notes = `<p class="small muted center-text" data-key="qnotehint">${t('Tap a place to strike it out. Your notes are private.')}</p>`;
  let stage = '';
  switch (v.phase) {
    case 'Q_INTRO':
      stage = `${doNow(t('Look at your card'), t('One of you is the Mimic. Read your card, keep a straight face, then tap Ready.'))}
        ${myCard(v, me, UI)}
        ${a.done ? `<p class="small muted center-text">${waitText(v)}</p>` : ''}
        <div class="rule">${t('The possible places')}</div>${placesBoard(v, { struck })}`;
      break;
    case 'Q_ASK': {
      const accusing = UI.ui.qaccuse && a.canAccuse;
      const others = v.players.filter((p) => p.id !== me?.id).map((p) => p.id);
      let pick = null;
      let title = th('{a} holds the lantern', { a: rawName(v, Q.asker) });
      let hint = t('Listen closely. Anyone may accuse, once per game.');
      if (accusing) {
        pick = { act: 'qAccusePick', ids: others, selected: [UI.sel.qacc].filter(Boolean), tone: 'kill' };
        title = t('Who is the Mimic?');
        hint = t('Tap the player you accuse, then hold to accuse. Everyone else must agree.');
      } else if (a.asker) {
        pick = { act: 'qAsk', ids: others.filter((id) => id !== a.lastAsker), selected: [] };
        title = t('Ask someone a question');
        hint = t('Ask aloud about the place, then tap who you asked. The lantern passes to them.');
      }
      // AT6: the board of places owns the stage. Your card sits above it with the seal at its top right (the lantern
      // bead on the asker). The playing table comes back only when you must tap a seat: to ask, or to accuse.
      stage = pick ? `${lantern(v)}${doNow(title, hint, accusing ? 'blood' : 'gilt')}
        ${ring(v, { pick, center: '', extra: askArrows(v), turn: Q.asker ?? null })}
        ${myCard(v, me, UI)}
        <div class="rule">${t('The possible places')}</div>${placesBoard(v, { act: 'qStrike', struck })}${notes}`
        : `${doNow(title, hint)}${h.sealRow(myCard(v, me, UI), h.seal(v, { turn: Q.asker ?? null, key: 'qseal', size: 82 }))}
        ${placesBoard(v, { act: 'qStrike', struck })}${notes}`;
      break;
    }
    case 'Q_VOTE': {
      const A = Q.accusation;
      const vs = Object.entries(Q.votes ?? {});
      const title = a.type === 'qaccused' ? t('You are accused!') : th('{a} accuses {b}', { a: rawName(v, A.by), b: rawName(v, A.target) });
      const hint = a.type === 'qaccused' ? t('Defend yourself. If everyone agrees, you are convicted.')
        : a.type === 'qaccuser' ? t('Your vote is Agree. Only a unanimous table convicts.') : t('Agree or disagree. Only a unanimous table convicts; one Disagree saves them.');
      stage = `${lantern(v)}${doNow(title, hint, 'blood')}
        <div class="q-accused" data-key="qaccused">${disc(v, A.target, 'lg')}<b>${pname(v, A.target)}</b></div>
        <div class="q-votes" data-key="qvotes">${v.players.filter((p) => p.id !== A.target).map((p) => {
          const x = Q.votes?.[p.id];
          return `<span class="q-v ${x === true ? 'yes' : x === false ? 'no' : ''}">${disc(v, p.id, 'sm')}<i>${x === true ? glyph('check') : x === false ? glyph('close') : '…'}</i><small>${esc(p.name)}</small></span>`;
        }).join('')}</div>
        <p class="small muted center-text">${th('Votes in · {done}/{total}', v.progress ?? { done: vs.length, total: 0 })}</p>
        ${myCard(v, me, UI)}`;
      break;
    }
    case 'Q_GUESS': {
      const why = Q.guessWhy === 'caught' ? t('Caught! One last guess: name the place.') : t('You unmasked. Name the place.');
      if (a.type === 'qguess') {
        stage = `${doNow(why, t('Tap the place you think everyone is in, then hold to name it.'), 'blood')}
          ${placesBoard(v, { act: 'qGuessPick', sel: UI.sel.qguess, struck })}`;
      } else {
        stage = `${doNow(Q.guessWhy === 'caught' ? t('The Mimic has one last guess') : t('The Mimic unmasks'), t('Not a word, not a look. The Mimic is naming the place.'), 'blood')}
          ${placesBoard(v, { struck })}${myCard(v, me, UI)}`;
      }
      break;
    }
    case 'Q_FINAL': {
      const others = v.players.filter((p) => p.id !== me?.id).map((p) => p.id);
      const pick = { act: 'qFinal', ids: others, selected: [a.choice].filter(Boolean), tone: 'kill' };
      stage = `${doNow(t('Time is up: point at the Mimic'), t('Everyone, the Mimic too, points at one suspect. The most votes is convicted; a tie lets the Mimic slip away.'), 'blood')}
        ${ring(v, { pick, center: `<span class="c-big">${(Q.finalIn ?? []).length}</span><span class="c-sub">${t('have pointed')}</span>` })}
        ${myCard(v, me, UI)}`;
      break;
    }
    default: break;
  }
  return `${head(v)}${stage}`;
}

export function mimicDock(v, h) {
  const { S: UI, btn, holdBtn } = h;
  const a = v.action || {};
  const Q = v.mimic;
  const parts = [];
  const note = (x) => `<span class="dock-note" data-key="qdn">${x}</span>`;
  switch (a.type) {
    case 'qintro': if (!a.done) parts.push(btn(t('I am ready'), 'qAck', 'btn-solid')); break;
    case 'qask':
      if (UI.ui.qaccuse && a.canAccuse) {
        parts.push(btn(t('Cancel'), 'qAccuseMode', 'btn-ghost'));
        parts.push(UI.sel.qacc ? holdBtn('qAccuse', th('Hold to accuse {a}', { a: rawName(v, UI.sel.qacc) }), 'btn-blood') : note(t('Tap a seat to accuse')));
      } else {
        if (a.asker) parts.push(note(t('Ask aloud, then tap who you asked')));
        if (a.canAccuse) parts.push(btn(`${glyph('dagger')} ${t('Accuse…')}`, 'qAccuseMode', 'btn-ghost'));
        else parts.push(note(t('You have made your accusation')));
      }
      break;
    case 'qvote':
      parts.push(btn(t('Disagree'), 'qVote', a.choice === false ? 'btn-solid' : 'btn-ghost', false, 'qno', 'data-yes="0"'));
      parts.push(btn(t('Agree'), 'qVote', a.choice === true ? 'btn-blood' : 'btn-ghost', false, 'qyes', 'data-yes="1"'));
      break;
    case 'qguess':
      parts.push(UI.sel.qguess != null ? holdBtn('qGuess', th('Hold to name {where}', { where: place(UI.sel.qguess) }), 'btn-blood') : note(t('Tap a place')));
      break;
    case 'qfinal':
      parts.push(note(a.choice ? th('You point at {a}. Tap another seat to change.', { a: rawName(v, a.choice) }) : t('Tap a seat to point at the Mimic')));
      break;
    default: break;
  }
  return parts;
}

export function mimicActs(h) {
  const { S: UI, V, send, render, haptic } = h;
  return {
    async qAck() { await send('q.ack', {}); },
    qHide() { UI.ui.qhide = !UI.ui.qhide; render(); },
    async qAsk(el) { haptic(8); await send('q.ask', { to: el.dataset.id }, { quiet: true }); },
    qAccuseMode() { UI.ui.qaccuse = !UI.ui.qaccuse; UI.sel.qacc = null; render(); },
    qAccusePick(el) { UI.sel.qacc = UI.sel.qacc === el.dataset.id ? null : el.dataset.id; haptic(6); render(); },
    async qAccuse() { if (UI.sel.qacc && await send('q.accuse', { target: UI.sel.qacc })) { UI.ui.qaccuse = false; UI.sel.qacc = null; } },
    async qVote(el) { haptic(8); await send('q.vote', { yes: el.dataset.yes === '1' }, { quiet: true }); },
    async qUnmask() { await send('q.unmask', {}); },
    qStrike(el) {
      const i = Number(el.dataset.id);
      const s = new Set(UI.ui.qstruck ?? []);
      if (s.has(i)) s.delete(i); else s.add(i);
      UI.ui.qstruck = [...s];
      haptic(4);
      render();
    },
    qGuessPick(el) { UI.sel.qguess = Number(el.dataset.id); haptic(6); render(); },
    async qGuess() { if (UI.sel.qguess != null) await send('q.guess', { loc: UI.sel.qguess }); },
    async qFinal(el) {
      const a = V().action || {};
      haptic(8);
      await send('q.final', { target: a.choice === el.dataset.id ? null : el.dataset.id }, { quiet: true });
    },
    qSet(el) {
      const key = el.dataset.id;
      const raw = el.type === 'checkbox' ? el.checked : el.value;
      const val = ['board', 'games'].includes(key) ? Number(raw) : raw;
      send('host.settings', { q: { [key]: val } }, { quiet: true });
    },
  };
}
export const MIMIC_QUIET = ['qHide', 'qAsk', 'qAccuseMode', 'qAccusePick', 'qVote', 'qStrike', 'qGuessPick', 'qFinal'];

// ── Scenes ─────────────────────────────────────────────────────────────────
export function mimicMoment(l, v, fresh, { notify }) {
  switch (l.ev) {
    case 'q-start': return { type: 'qstart', n: l.board?.length ?? 16, sound: 'shuffle' };
    case 'q-open': notify(th('{a} holds the lantern and asks the first question.', { a: rawName(v, l.asker) })); return null;
    case 'q-accuse': return { type: 'qaccuse', by: l.by, target: l.target, sound: 'nominate' };
    case 'q-verdict': return { type: 'qverdict', target: l.target, convicted: !!l.convicted, mimic: !!l.mimic, final: !!l.final, sound: l.convicted ? (l.mimic ? 'goodCard' : 'death') : 'unpick' };
    case 'q-unmask': return { type: 'qunmask', by: l.by, sound: 'bell' };
    case 'q-guess': return { type: 'qguess', loc: l.loc, right: !!l.right, caught: !!l.caught, sound: l.right ? 'death' : 'approve' };
    case 'q-time': return { type: 'qtime', sound: 'bell' };
    default: return null;
  }
}
export const Q_MOMENT_TIME = { qstart: 5200, qaccuse: 3400, qverdict: 4400, qunmask: 3400, qguess: 4800, qtime: 3200 };

export function mimicMomentHtml(m, h) {
  const { letters, V } = h;
  const v = V();
  switch (m.type) {
    case 'qstart': return `<div class="q-deal">${Array.from({ length: 5 }, (_, i) => `<span class="q-dc" style="--i:${i}">${i === 2 ? emblem('mimic') : emblem('p_letter')}</span>`).join('')}</div>
      <span class="kicker">${esc(t('The cards are dealt'))}</span><h1 class="m-title">${letters(t('One of you is the Mimic'))}</h1>
      <p class="m-sub">${esc(t('Everyone else shares one place. The Mimic sees only static.'))}</p>`;
    case 'qaccuse': return `<div class="q-faceoff">${disc(v, m.by, 'huge')}<span class="q-vs">${glyph('dagger')}</span>${disc(v, m.target, 'huge accused')}</div>
      <span class="kicker">${esc(t('An accusation'))}</span><h1 class="m-title blood">${letters(th('{a} accuses {b}', { a: rawName(v, m.by), b: rawName(v, m.target) }))}</h1>
      <p class="m-sub">${esc(t('The clock stops. Only a unanimous table convicts.'))}</p>`;
    case 'qverdict': {
      if (!m.convicted) return `<div class="m-art">${emblem('maskedvote')}</div><span class="kicker">${esc(t('The verdict'))}</span>
        <h1 class="m-title">${letters(t(m.final ? 'The table cannot agree' : 'The table is divided'))}</h1><p class="m-sub">${esc(t(m.final ? 'The Mimic slips away.' : 'No conviction. The questions go on.'))}</p>`;
      return `<div class="q-unveil ${m.mimic ? 'mimic' : 'living'}">${disc(v, m.target, 'huge')}<span class="q-mask">${emblem(m.mimic ? 'mimic' : 'innocent')}</span></div>
        <span class="kicker">${esc(th('{a} is convicted', { a: rawName(v, m.target) }))}</span><h1 class="m-title ${m.mimic ? '' : 'blood'}">${letters(t(m.mimic ? 'The Mimic is caught!' : 'A living friend'))}</h1>
        <p class="m-sub">${esc(t(m.mimic ? 'But it may still name the place.' : 'The Mimic fooled the table.'))}</p>`;
    }
    case 'qunmask': return `<div class="q-unveil mimic">${disc(v, m.by, 'huge')}<span class="q-mask">${emblem('mimic')}</span></div>
      <span class="kicker">${esc(t('The Mimic unmasks'))}</span><h1 class="m-title blood">${letters(rawName(v, m.by))}</h1><p class="m-sub">${esc(t('Now it names the place.'))}</p>`;
    case 'qguess': return `<div class="q-guesscard ${m.right ? 'right' : 'wrong'}">${m.loc != null ? scard('WHERE', m.loc, { cls: 'huge' }) : staticCard('huge')}</div>
      <span class="kicker">${esc(t('The Mimic names'))}</span><h1 class="m-title ${m.right ? 'blood' : ''}">${letters(m.loc != null ? place(m.loc) : t('Nothing'))}</h1>
      <p class="m-sub">${esc(t(m.right ? 'Right. The Mimic wins.' : 'Wrong. The Living win.'))}</p>`;
    case 'qtime': return `<div class="m-art">${emblem('patience')}</div><span class="kicker">${esc(t('Time is up'))}</span><h1 class="m-title">${letters(t('Point at the Mimic'))}</h1>
      <p class="m-sub">${esc(t('Everyone points at one suspect.'))}</p>`;
    default: return '';
  }
}

// ── Lobby ──────────────────────────────────────────────────────────────────
export function explainerHtml(v = null) {
  const last = v ? v.settings?.q?.lastGuess !== false : null;
  const steps = [
    ['mimic', 'The cards', 'Everyone shares one place and holds a character there. One of you is the Mimic and sees only static.'],
    ['lantern', 'Questions', 'Whoever holds the lantern asks anyone a question aloud, then passes the lantern to them.'],
    ['dagger', 'Accuse', 'Once per game each. The clock stops; only a unanimous table convicts.'],
    ['mentalist', 'The Mimic', last === false ? 'Unmask at any moment and name the place. Caught means caught: no last guess at this table.' : last === null ? 'Unmask at any moment and name the place. Caught? One last guess, if the host leaves it on.' : 'Unmask at any moment and name the place. Caught? One last guess.'],
  ];
  return `<section class="x-explain" data-key="qexplain"><div class="rule lstep">${t('How Mimic works')}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${t(a)}</b><small>${t(b)}</small></span></li>`).join('')}</ol></section>`;
}

export function scoreboard(v) {
  const S = v.qScores ?? v.mimic?.scores ?? {};
  const list = v.players.map((p) => ({ p, s: S[p.id] ?? 0 })).sort((a, b) => b.s - a.s);
  if (!list.some((x) => x.s)) return '';
  const match = v.mimic?.match ?? v.qMatch;
  return `<section class="x-scores" data-key="qscores"><div class="rule">${t('Scores')}${match ? ` · ${th('game {n} of {m}', { n: match.played, m: match.total })}` : ''}</div><ol class="ledger">${list.map(({ p, s }, i) => `<li><span class="seat">${i + 1}</span><span class="who"><b>${esc(p.name)}</b></span><span class="tags"><span class="tag ${i === 0 ? 'solid' : ''}">${s}</span></span></li>`).join('')}</ol>
    <p class="small muted">${t('The Living +1 each (the accuser who caught the Mimic +1 more). The Mimic +2, or +3 for naming the place.')}</p></section>`;
}

export function mimicLobbyDeck(v, isHost, h) {
  const s = v.settings.q ?? {};
  const n = v.players.length;
  const row = (title, sub, control, shown) => `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
  const sel = (key, value, opts) => `<select class="input lang-select" data-act-change="qSet" data-id="${key}">${opts.map(([x, l]) => `<option value="${x}" ${String(value) === String(x) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const sw = (key, on) => `<input type="checkbox" class="switch" data-act-change="qSet" data-id="${key}" ${on ? 'checked' : ''}>`;
  const BOARDS = [[16, '16'], [12, '12'], [20, '20'], [30, t('All 30')]];
  const board = s.board ?? 16;
  return `${explainerHtml(v)}
    <section class="lobby-deck" data-key="qdeck">
    <div class="rule lstep">${t(n === 1 ? 'The deck · {n} player' : 'The deck · {n} players', { n })}</div>
    <p class="small muted">${n >= 4 ? t('One Mimic; everyone else is Living.') : t('Seat 4 to 12 players.')}</p>
    <div class="q-lobbyart" data-key="qlart"><span class="tarot">${cardArt('mimic')}<span class="nm">${esc(roleF('Q_MIMIC', 'name'))}</span></span>${scard('WHERE', 5)}${scard('WHO', 3)}</div>
    <div class="rule lstep">${t('Rules')}</div>
    ${row(t('Places on the board'), t('How many possible places everyone sees. More places, harder for the Mimic.'), sel('board', board, BOARDS), BOARDS.find((x) => x[0] === board)?.[1] ?? String(board))}
    ${row(t('Last guess'), t('A caught Mimic may still name the place and steal the win.'), sw('lastGuess', s.lastGuess !== false), t(s.lastGuess !== false ? 'On' : 'Off'))}
    ${row(t('The TV backdrop sharpens'), t('A trust option: the TV shows the true place deeply blurred, sharpening as time runs out. Anyone who opens the TV link could read it.'), sw('tvHint', !!s.tvHint), t(s.tvHint ? 'On' : 'Off'))}
    ${row(t('Games per match'), t('Scores carry over; the Mimic changes every game.'), sel('games', s.games ?? 3, [[3, '3'], [1, '1'], [5, '5']]), String(s.games ?? 3))}
    ${h.music ?? ''}
    ${scoreboard(v)}
  </section>`;
}

// ── End ────────────────────────────────────────────────────────────────────
export const mimicTitle = (Q) => (Q?.result?.side === 'LIVING' ? t('The Living win') : Q?.result ? t('The Mimic wins') : t('The End'));

export function mimicEndHtml(v) {
  const Q = v.mimic;
  const R = Q?.result;
  if (!R) return '';
  const back = v.deadline ? `<p class="center-text small muted">${t('Back to the lobby in')} <b class="clock" data-clock></b></p>` : '';
  const cast = v.players.map((p) => {
    const mim = p.id === R.mimic;
    return `<li class="${mim ? 'mim' : ''}">${disc(v, p.id, 'sm')}<span><b>${esc(p.name)}</b><small>${esc(mim ? roleF('Q_MIMIC', 'name') : scenAt('WHO', R.who?.[p.id]))}</small></span>${mim ? `<i>${emblem('mimic')}</i>` : ''}</li>`;
  }).join('');
  return `${back}<section class="q-end" data-key="qend">
      <div class="q-endpair">${scard('WHERE', R.loc, { cls: 'big' })}<span class="q-endmim">${disc(v, R.mimic, 'huge')}<b>${pname(v, R.mimic)}</b><small>${esc(roleF('Q_MIMIC', 'name'))}</small></span></div>
      ${R.guess != null ? `<p class="center-text small">${th('The Mimic named {where}.', { where: place(R.guess) })}</p>` : ''}
    </section>
    <section data-key="qcast"><div class="rule">${t('Who was who')}</div><ul class="q-cast">${cast}</ul></section>
    <section data-key="qboardend"><div class="rule">${t('The possible places')}</div>${placesBoard(v, { truth: R.loc, guess: R.guess, size: 'end' })}</section>${scoreboard(v)}`;
}

// ── TV ─────────────────────────────────────────────────────────────────────
export function mimicBoard(v, h) {
  const { header, ring } = h;
  const Q = v.mimic;
  if (!Q) return '';
  const ended = v.phase === 'ENDED';
  const prog = v.progress ?? { done: 0, total: 0 };
  const A = Q.accusation;
  const [title, sub] = {
    Q_INTRO: [t('Everyone looks at their card'), th('One of you is the Mimic · {done}/{total} ready', prog)],
    Q_ASK: [th('{a} holds the lantern', { a: rawName(v, Q.asker) }), Q.asked?.length ? `${rawName(v, Q.asked.at(-1).by)} → ${rawName(v, Q.asked.at(-1).to)}` : t('Ask anyone a question about the place.')],
    Q_VOTE: [A ? th('{a} accuses {b}', { a: rawName(v, A.by), b: rawName(v, A.target) }) : '', th('Votes in · {done}/{total}', prog)],
    Q_GUESS: [Q.guessWhy === 'caught' ? t('The Mimic has one last guess') : t('The Mimic unmasks'), t('It is naming the place.')],
    Q_FINAL: [t('Time is up: point at the Mimic'), th('Votes in · {done}/{total}', prog)],
  }[v.phase] ?? ['', ''];
  // The trust option: the true place, deeply blurred behind the board, sharpening as the clock runs down.
  const hint = v.mimicHint && !ended ? (() => {
    const total = Q.round || 1;
    const left = v.phase === 'Q_ASK' && v.deadline ? Math.max(0, v.deadline - Date.now()) : Q.remain ?? total;
    const done = Math.min(1, Math.max(0, 1 - left / total));
    const running = v.phase === 'Q_ASK';
    return `<div class="q-hint ${running ? 'run' : ''}" data-key="qhint" style="--elapsed:${(done * total / 1000).toFixed(1)}s;--total:${(total / 1000).toFixed(0)}s;--done:${done.toFixed(3)}" aria-hidden="true">${backdropSvg(v.mimicHint.loc, 'tv')}</div>`;
  })() : '';
  const clock = v.phase === 'Q_ASK' ? '<b class="clock" data-clock></b>' : Q.remain != null && !ended ? `<b class="paused">${mmss(Q.remain)}</b>` : '';
  const votes = v.phase === 'Q_VOTE' && A ? `<div class="q-tvvotes">${v.players.filter((p) => p.id !== A.target).map((p) => { const x = Q.votes?.[p.id]; return `<span class="q-v ${x === true ? 'yes' : x === false ? 'no' : ''}">${disc(v, p.id, 'sm')}<i>${x === true ? glyph('check') : x === false ? glyph('close') : '…'}</i></span>`; }).join('')}</div>` : '';
  const center = ended ? '' : `<span class="q-tvclock">${clock}</span>`;
  const shape = { 12: [4, 3], 16: [4, 4], 20: [5, 4], 30: [6, 5] }[Q.board.length] ?? [4, 4];
  // The end on the TV: the reveal, who was who, and the board, side by side and sized to the screen.
  if (ended) return `<main class="board2 qboard is-ended" data-key="board-q">${header}<div class="qt-end">${mimicEndHtml(v)}</div></main>`;
  return `<main class="board2 qboard" data-key="board-q">${header}
    <div class="qt-cols">
      <section class="qt-table">${ring(v, { center, orb: hint, turn: v.phase === 'Q_ASK' ? Q.asker ?? null : null, extra: ended ? '' : askArrows(v, 5), marks: A && v.phase === 'Q_VOTE' ? { [A.target]: '?' } : {} })}
        ${ended ? '' : `<div class="qt-banner ${['Q_VOTE', 'Q_GUESS', 'Q_FINAL'].includes(v.phase) ? 'blood' : ''}" data-key="qtban"><b>${esc(title)}</b><span>${esc(sub)}</span>${votes}</div>`}</section>
      <section class="qt-places" style="--cols:${shape[0]};--rows:${shape[1]}">${ended ? mimicEndHtml(v) : `<div class="rule">${t('The possible places')}</div>${placesBoard(v, { size: 'tv' })}`}</section>
    </div></main>`;
}
