// Shared client pieces for the round-and-ballot modes (Beta 9 onwards): portraits, the "do now"
// header, arrows between seats, the score ledger and lobby setting rows.

import { t, th } from './i18n.js';
import { avatarSvg } from './avatar.js';
import { seatLayout } from './layout.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const rawName = (v, id) => v.players.find((p) => p.id === id)?.name ?? t('Someone');
export const pname = (v, id) => esc(rawName(v, id));

/** A round portrait: the avatar, or the initial. Sizes: xs, sm, lg, huge. */
export function disc(v, id, cls = '') {
  const p = v.players.find((x) => x.id === id);
  return `<span class="k-disc ${cls}">${p?.avatar ? avatarSvg(p.avatar, 'k-av') : `<b>${esc((p?.name ?? '?').slice(0, 1))}</b>`}</span>`;
}

/** The "what to do now" header at the top of a phone screen. */
export const doNow = (title, hint = '', cls = '') => `<div class="s-do k-do ${cls}" data-key="kdo-${esc(String(title)).slice(0, 24)}"><h2>${title}</h2>${hint ? `<p>${hint}</p>` : ''}</div>`;

/**
 * Arrows between seats on the ring (the ring's `extra` layer). `pairs`: [{ from, to, cls }].
 * Curves bow toward the centre and stop at the portraits' edges.
 */
export function seatArrows(v, pairs, key = 'karrows') {
  if (!pairs?.length) return '';
  const seated = [...v.players].sort((a, b) => a.seat - b.seat);
  const { pos } = seatLayout(seated.length);
  const at = (id) => { const i = seated.findIndex((p) => p.id === id); return i < 0 ? null : pos[i]; };
  const paths = pairs.map((x, i) => {
    const p1 = at(x.from); const p2 = at(x.to);
    if (!p1 || !p2) return '';
    const dx = p2.x - p1.x; const dy = p2.y - p1.y; const len = Math.hypot(dx, dy) || 1;
    const trim = 6.5;
    const x1 = p1.x + (dx / len) * trim; const y1 = p1.y + (dy / len) * trim;
    const x2 = p2.x - (dx / len) * trim; const y2 = p2.y - (dy / len) * trim;
    const mx = ((x1 + x2) / 2) * 0.7 + 15; const my = ((y1 + y2) / 2) * 0.7 + 15;
    return `<path class="${x.cls ?? ''}" style="--i:${i}" d="M${x1.toFixed(2)} ${y1.toFixed(2)} Q${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}" marker-end="url(#ka-${x.cls || 'plain'})"/>`;
  }).join('');
  const kinds = [...new Set(pairs.map((x) => x.cls || 'plain'))];
  const marker = (id) => `<marker id="ka-${id}" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0 0L6 3L0 6z" class="${id}"/></marker>`;
  return `<svg class="k-arrows" viewBox="0 0 100 100" aria-hidden="true" data-key="${key}"><defs>${kinds.map(marker).join('')}</defs>${paths}</svg>`;
}

/**
 * The score ledger: players by score, with an optional extra cell per player.
 * `winners` (end) crowns the leaders; ties share the victory.
 */
export function scoreLedger(v, scores, { extra = null, winners = null, title = '', key = 'kledger', note = '' } = {}) {
  const list = v.players.map((p) => ({ p, s: scores?.[p.id] ?? 0 })).sort((a, b) => b.s - a.s || a.p.seat - b.p.seat);
  return `<section class="k-ledger" data-key="${key}">${title ? `<div class="rule">${title}</div>` : ''}<ol>${list.map(({ p, s }, i) => `<li class="${winners?.includes(p.id) ? 'won' : ''}" data-key="${key}-${p.id}"><span class="kl-n">${i + 1}</span>${disc(v, p.id, 'sm')}<b class="kl-name">${esc(p.name)}</b>${extra ? `<span class="kl-x">${extra(p.id)}</span>` : ''}<span class="kl-s">${s}</span></li>`).join('')}</ol>${note ? `<p class="small muted">${note}</p>` : ''}</section>`;
}

/** Lobby setting rows: hosts get the control, everyone else the current value. */
export function settingRow(isHost, title, sub, control, shown) {
  return `<${isHost ? 'label' : 'div'} class="toggle-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${isHost ? control : `<span class="tag">${shown}</span>`}</${isHost ? 'label' : 'div'}>`;
}

/** The explainer steps at the top of a mode's lobby deck: [glyph, title, text], already translated. */
export function explainer(title, steps, glyph, key) {
  return `<section class="x-explain" data-key="${key}"><div class="rule lstep">${title}</div>
    <ol class="x-steps">${steps.map(([g, a, b], i) => `<li style="--i:${i}"><span class="xs-g">${glyph(g)}</span><span><b>${a}</b><small>${b}</small></span></li>`).join('')}</ol></section>`;
}

/** "Waiting for the others · 3/5", from the view's progress. */
export const waiting = (v) => `<p class="small muted center-text" data-key="kwait">${th('Waiting for the others · {done}/{total}', v.progress ?? { done: 0, total: 0 })}</p>`;
