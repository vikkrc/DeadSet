// Shared client pieces for the round-and-ballot modes (Beta 9 onwards): portraits, the "do now"
// header, arrows between seats, the score ledger and lobby setting rows.

import { t, th, tph } from './i18n.js';
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
export function scoreLedger(v, scores, { extra = null, winners = null, title = '', key = 'kledger', note = '', cols = null } = {}) {
  const list = v.players.map((p) => ({ p, s: scores?.[p.id] ?? 0 })).sort((a, b) => b.s - a.s || a.p.seat - b.p.seat);
  return `<section class="k-ledger" data-key="${key}">${title ? `<div class="rule">${title}</div>` : ''}<ol data-flip>${cols ? `<li class="kl-head" aria-hidden="true"><span class="kl-n"></span><b class="kl-name">${esc(cols[0])}</b>${extra ? `<span class="kl-x">${esc(cols[1])}</span>` : ''}<span class="kl-s">${esc(cols[2])}</span></li>` : ''}${list.map(({ p, s }, i) => `<li class="${winners?.includes(p.id) ? 'won' : ''}" data-key="${key}-${p.id}"><span class="kl-n">${i + 1}</span>${disc(v, p.id, 'sm')}<b class="kl-name">${esc(p.name)}</b>${extra ? `<span class="kl-x">${extra(p.id)}</span>` : ''}<span class="kl-s" data-gain="${key}-${p.id}" data-n="${s}">${s}</span></li>`).join('')}</ol>${note ? `<p class="small muted">${note}</p>` : ''}</section>`;
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
/**
 * I · Sealed in wax: one seal means "this is final and it is yours". Three sizes only (s 30, m 44, l 92 px);
 * pressed once when it first appears, then still. It never sits over words, and at night every role gets the
 * same seal at the same moment, so it says nothing about what was chosen.
 */
// The seal is the favicon's: the same wax, rim and pressed letter, drawn from the same paths.
const SEAL_SVG = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><radialGradient id="ws-g" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#d4484f"/><stop offset=".5" stop-color="#a0222a"/><stop offset="1" stop-color="#5e0e14"/></radialGradient></defs><path d="M60.96 32.00C60.84 36.29 60.05 40.75 58.38 44.70C56.71 48.66 54.26 53.15 50.94 55.75C47.62 58.34 42.69 59.50 38.45 60.27C34.22 61.04 29.65 61.28 25.52 60.39C21.39 59.51 16.84 57.65 13.69 54.96C10.55 52.26 8.44 48.04 6.63 44.22C4.83 40.39 3.06 36.17 2.86 32.00C2.66 27.83 3.69 23.11 5.43 19.20C7.17 15.30 9.91 10.96 13.31 8.56C16.70 6.16 21.62 5.54 25.80 4.82C29.97 4.09 34.41 3.31 38.34 4.20C42.27 5.10 45.93 7.75 49.38 10.21C52.83 12.67 57.13 15.34 59.06 18.97C60.99 22.60 61.07 27.71 60.96 32.00Z" fill="url(#ws-g)"/><circle cx="32" cy="32" r="24" fill="none" stroke="#3c060a" stroke-opacity=".3" stroke-width="1.2"/><circle cx="32" cy="32.6" r="24" fill="none" stroke="#ffb4ac" stroke-opacity=".18" stroke-width=".8"/><path fill="#ffcfc6" fill-opacity=".28" d="M224 502Q232 595 232.0 679.0Q232 763 225 838Q211 994 120 1084Q354 1095 569 1180Q351 1289 47 1289Q31 1289 15 1289L344 1535Q805 1464 1028.5 1208.0Q1252 952 1269 534L680 31Q395 175 4 270ZM616 1154Q585 1097 567.0 1044.5Q549 992 549.0 944.0Q549 896 550.5 822.5Q552 749 557.0 684.0Q562 619 592 531Q571 533 551 533Q450 533 359 492Q599 317 732 317Q787 317 824 348Q937 443 937 622Q937 781 854.0 920.5Q771 1060 616 1154Z" transform="translate(.6 .7) translate(16.34 52.76) scale(0.02460 -0.02460)"/><path fill="#2e0306" d="M224 502Q232 595 232.0 679.0Q232 763 225 838Q211 994 120 1084Q354 1095 569 1180Q351 1289 47 1289Q31 1289 15 1289L344 1535Q805 1464 1028.5 1208.0Q1252 952 1269 534L680 31Q395 175 4 270ZM616 1154Q585 1097 567.0 1044.5Q549 992 549.0 944.0Q549 896 550.5 822.5Q552 749 557.0 684.0Q562 619 592 531Q571 533 551 533Q450 533 359 492Q599 317 732 317Q787 317 824 348Q937 443 937 622Q937 781 854.0 920.5Q771 1060 616 1154Z" transform="translate(16.34 52.76) scale(0.02460 -0.02460)"/></svg>';
export const waxSeal = (size = 's', cls = '') => (/\bcracked\b/.test(cls)
  // A broken seal: the same wax in two pieces along a jagged break, which come apart after it is pressed.
  ? `<span class="wseal ws-${size} ${cls}" aria-hidden="true"><span class="wh wh-a">${SEAL_SVG}</span><span class="wh wh-b">${SEAL_SVG}</span></span>`
  : `<span class="wseal ws-${size} ${cls}" aria-hidden="true">${SEAL_SVG}</span>`);

export const waiting = (v) => `<p class="small muted center-text" data-key="kwait">${waitText(v)}</p>`;
/**
 * N3, DS-026: your choice is in; now name who the table waits for where the server says it is safe to, otherwise
 * give the count. Never 'everyone is in' unless the list says so.
 */
export function waitText(v) {
  const ids = (v.progress?.waiting ?? null)?.filter((id) => id !== v.me?.id);
  if (!ids) return th('Waiting for the others · {done}/{total}', v.progress ?? { done: 0, total: 0 });
  if (!ids.length) return t('Everyone is in');
  const a = v.players.find((p) => p.id === ids[0])?.name ?? '';
  return ids.length === 1 ? th('Waiting for {a}', { a }) : tph('Waiting for {a} and one other', 'Waiting for {a} and {n} others', ids.length - 1, { a });
}
