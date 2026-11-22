// V1: the share card. A 1080×1350 Gazette front page drawn on a canvas from the end-of-game view,
// shared through the Web Share API or downloaded. With `anon`, every name becomes a seat number and
// the faces become plain seats (K6: "Share without names"). Pure drawing: the caller passes every
// string already translated, so this file holds no copy of its own.
import { avatarSvg } from './avatar.js';

const W = 1080, H = 1350, M = 72;

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * DS-015: the largest face size at which a group of n fits its budget of height on the 1080-wide card, or, past the
 * smallest size, how many fit (the rest are named as '+N more'). Pure, so it can be tested without a canvas.
 */
export function fitFaces(n, budget, sizes = [128, 96, 72, 56, 44]) {
  for (const size of sizes) {
    const gap = size > 60 ? 24 : 14;
    const per = Math.max(1, Math.floor((W - 2 * M + gap) / (size + gap)));
    const rowH = size + (size > 100 ? 96 : size > 60 ? 70 : 34);
    if (Math.ceil(n / per) * rowH <= budget) return { size, gap, per, rowH, fit: n };
  }
  const size = sizes.at(-1); const gap = 14; const per = Math.max(1, Math.floor((W - 2 * M + gap) / (size + gap))); const rowH = size + 34;
  return { size, gap, per, rowH, fit: Math.max(0, Math.floor(budget / rowH) * per - 1) };
}

/** Replace every player name (longest first, so "Ann" never eats into "Anna") with its seat label. */
export function anonymise(text, names) {
  let out = String(text ?? '');
  const sorted = [...names].sort((a, b) => b[0].length - a[0].length);
  for (const [name, seat] of sorted) if (name) out = out.split(name).join(seat);
  return out;
}

function wrap(ctx, text, maxW) {
  const lines = []; let line = '';
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function fit(ctx, text, font, size, maxW, min = 28) {
  let s = size;
  ctx.font = `${font.replace('{s}', s)}`;
  while (s > min && ctx.measureText(text).width > maxW) { s -= 2; ctx.font = font.replace('{s}', s); }
  return s;
}

function svgImage(svg) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    const xml = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(/class="[^"]*"/g, '');
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  });
}

function rule(ctx, y, colour, double = false) {
  ctx.strokeStyle = colour; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(M, y); ctx.lineTo(W - M, y); ctx.stroke();
  if (double) { ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(M, y + 7); ctx.lineTo(W - M, y + 7); ctx.stroke(); }
}

/**
 * card = { masthead, dateLine, modeLine, kicker, title, reason, winnersLabel, fallenLabel, honoursLabel,
 *          players: [{ name, avatar, won, alive }], awards: [{ title, line }], url }
 */
export async function drawShareCard(card, { anon = false } = {}) {
  await document.fonts?.ready;
  const seats = card.players.map((p, i) => [p.name, `${card.seatWord} ${i + 1}`]);
  const say = (s) => (anon ? anonymise(s, seats) : String(s ?? ''));
  const paper = css('--vellum') || '#dccba4'; /* literal-ok */
  const ink = css('--sepia') || '#1d1510'; /* literal-ok */
  const ink2 = css('--sepia-2') || '#5a4632'; /* literal-ok */
  const red = css('--rubric') || '#8e1b1f'; /* literal-ok */
  const edge = css('--paper-edge') || '#77633f'; /* literal-ok */
  const BLACK = "'Grenze Gotisch', 'UnifrakturCook', Georgia, serif";
  const TEXT = "'EB Garamond', Georgia, serif";

  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
  // A soft vignette, so it reads as old paper rather than a flat fill.
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); /* literal-ok */
  g.addColorStop(1, 'rgba(60,40,20,0.28)'); /* literal-ok */
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = edge; ctx.lineWidth = 3; ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.lineWidth = 1; ctx.strokeRect(40, 40, W - 80, H - 80);

  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  let y = 150;
  ctx.fillStyle = ink;
  fit(ctx, card.masthead, `400 {s}px ${BLACK}`, 108, W - 2 * M);
  ctx.fillText(card.masthead, W / 2, y);
  y += 36; rule(ctx, y, ink, true);
  y += 44;
  ctx.font = `600 26px ${TEXT}`; ctx.fillStyle = ink2;
  ctx.textAlign = 'left'; ctx.fillText(card.dateLine.toUpperCase(), M, y);
  ctx.textAlign = 'right'; ctx.fillText(card.modeLine.toUpperCase(), W - M, y);
  y += 22; rule(ctx, y, ink);

  // The headline.
  ctx.textAlign = 'center';
  y += 64; ctx.font = `600 28px ${TEXT}`; ctx.fillStyle = red;
  ctx.fillText(say(card.kicker).toUpperCase(), W / 2, y);
  const title = say(card.title);
  const ts = fit(ctx, title, `400 {s}px ${BLACK}`, 112, W - 2 * M, 56);
  ctx.fillStyle = ink;
  y += ts + 6; ctx.fillText(title, W / 2, y);

  // The story in a sentence or three.
  ctx.font = `italic 400 36px ${TEXT}`; ctx.fillStyle = ink2;
  y += 34;
  for (const line of wrap(ctx, say(card.reason), W - 2 * M - 40).slice(0, 4)) { y += 46; ctx.fillText(line, W / 2, y); }

  // The winners' faces, then the rest of the table.
  const winners = card.players.filter((p) => p.won);
  const others = card.players.filter((p) => !p.won);
  // DS-015: every player is accounted for. Faces shrink until the whole group fits its share of the page; only past
  // the smallest size do the rest become an explicit '+N more at the table' line, never a silent cut.
  const drawn = new Set();
  const faces = async (list, budget, top, sizes) => {
    const L = fitFaces(list.length, budget, sizes);
    const { size, gap, per, rowH } = L;
    const shown = list.slice(0, L.fit);
    let yy = top;
    for (let i = 0; i < shown.length; i += per) {
      const row = shown.slice(i, i + per);
      const total = row.length * size + (row.length - 1) * gap;
      let x = (W - total) / 2;
      for (const p of row) {
        const idx = card.players.indexOf(p);
        drawn.add(idx);
        ctx.save();
        ctx.beginPath(); ctx.arc(x + size / 2, yy + size / 2, size / 2, 0, Math.PI * 2); ctx.closePath();
        ctx.fillStyle = css('--vellum-2') || '#c6b185'; /* literal-ok */
        ctx.fill(); ctx.clip();
        const img = !anon && p.avatar ? await svgImage(avatarSvg(p.avatar)) : null;
        if (img) ctx.drawImage(img, x, yy, size, size);
        else { ctx.fillStyle = ink; ctx.font = `400 ${Math.round(size * 0.42)}px ${BLACK}`; ctx.textAlign = 'center'; ctx.fillText(anon ? String(idx + 1) : (p.name[0] || '?').toUpperCase(), x + size / 2, yy + size * 0.64); }
        ctx.restore();
        ctx.lineWidth = p.won ? 4 : 2; ctx.strokeStyle = p.won ? red : edge;
        ctx.beginPath(); ctx.arc(x + size / 2, yy + size / 2, size / 2, 0, Math.PI * 2); ctx.stroke();
        if (!p.alive) { ctx.strokeStyle = ink2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + size * 0.2, yy + size * 0.8); ctx.lineTo(x + size * 0.8, yy + size * 0.2); ctx.stroke(); }
        ctx.fillStyle = ink; ctx.textAlign = 'center';
        ctx.font = `600 ${size > 100 ? 26 : size > 60 ? 20 : 16}px ${TEXT}`;
        let label = anon ? seats[idx][1] : p.name;
        while (ctx.measureText(label).width > size + gap - 4 && label.length > 3) label = `${label.slice(0, -2)}…`;
        ctx.fillText(label, x + size / 2, yy + size + (size > 100 ? 34 : size > 60 ? 26 : 18));
        x += size + gap;
      }
      yy += rowH;
    }
    const rest = list.length - shown.length;
    if (rest > 0) {
      ctx.font = `italic 400 22px ${TEXT}`; ctx.fillStyle = ink2; ctx.textAlign = 'center';
      ctx.fillText(card.moreLabel.replace('{n}', rest), W / 2, yy + 6); yy += 40;
      for (const p of list.slice(shown.length)) drawn.add(card.players.indexOf(p));
    }
    return yy;
  };
  y += 70;
  if (winners.length) {
    ctx.font = `600 24px ${TEXT}`; ctx.fillStyle = red; ctx.textAlign = 'center';
    ctx.fillText(card.winnersLabel.toUpperCase(), W / 2, y); y += 22;
    y = await faces(winners, others.length ? 380 : 620, y, [128, 96, 72, 56, 44]);
  }
  if (others.length) {
    ctx.font = `600 22px ${TEXT}`; ctx.fillStyle = ink2; ctx.textAlign = 'center';
    ctx.fillText(card.othersLabel.toUpperCase(), W / 2, y); y += 18;
    const honours = card.awards.length ? 60 + 44 * Math.min(3, card.awards.length) : 0;
    y = await faces(others, Math.max(110, H - 140 - honours - y), y, [72, 56, 44, 40]);
  }

  // The evening's honours (F1).
  if (card.awards.length && y < H - 260) {
    y += 10; rule(ctx, y, ink); y += 56;
    ctx.font = `600 24px ${TEXT}`; ctx.fillStyle = red; ctx.textAlign = 'center';
    ctx.fillText(card.honoursLabel.toUpperCase(), W / 2, y);
    for (const a of card.awards.slice(0, 3)) {
      if (y > H - 170) break;
      y += 44; ctx.textAlign = 'center';
      ctx.font = `400 34px ${BLACK}`; ctx.fillStyle = ink;
      const head = `${a.title} — `;
      const body = say(a.line);
      const hw = ctx.measureText(head).width;
      ctx.font = `italic 400 30px ${TEXT}`;
      let bw = ctx.measureText(body).width;
      let text = body;
      while (hw + bw > W - 2 * M && text.length > 8) { text = `${text.slice(0, -2)}…`; bw = ctx.measureText(text).width; }
      const x0 = (W - hw - bw) / 2;
      ctx.textAlign = 'left';
      ctx.font = `400 34px ${BLACK}`; ctx.fillStyle = ink; ctx.fillText(head, x0, y);
      ctx.font = `italic 400 30px ${TEXT}`; ctx.fillStyle = ink2; ctx.fillText(text, x0 + hw, y);
    }
  }

  // The foot.
  rule(ctx, H - 120, ink, true);
  ctx.textAlign = 'center'; ctx.fillStyle = ink2; ctx.font = `600 26px ${TEXT}`;
  ctx.fillText(card.url, W / 2, H - 70);
  return new Promise((resolve) => c.toBlob(resolve, 'image/png'));
}

/**
 * V2: the evening card. The ledger as one page: how many games, who won what, the standings with faces, and the
 * evening's first place. Same paper, same 'without names' option as the game card.
 * card = { masthead, dateLine, title, gamesLine, standingsLabel, gamesLabel, ptsWord, seatWord,
 *          rows: [{ name, avatar, pts, wins, games }], games: [{ mode, winners: [names] }], url }
 */
export async function drawEveningCard(card, { anon = false } = {}) {
  await document.fonts?.ready;
  const seats = card.rows.map((r, i) => [r.name, `${card.seatWord} ${i + 1}`]);
  const say = (x) => (anon ? anonymise(x, seats) : String(x ?? ''));
  const paper = css('--vellum') || '#dccba4'; /* literal-ok */
  const ink = css('--sepia') || '#1d1510'; /* literal-ok */
  const ink2 = css('--sepia-2') || '#5a4632'; /* literal-ok */
  const red = css('--rubric') || '#8e1b1f'; /* literal-ok */
  const edge = css('--paper-edge') || '#77633f'; /* literal-ok */
  const BLACK = "'Grenze Gotisch', 'UnifrakturCook', Georgia, serif";
  const TEXT = "'EB Garamond', Georgia, serif";
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); /* literal-ok */
  g.addColorStop(1, 'rgba(60,40,20,0.28)'); /* literal-ok */
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = edge; ctx.lineWidth = 3; ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.lineWidth = 1; ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  let y = 150;
  ctx.fillStyle = ink;
  fit(ctx, card.masthead, `400 {s}px ${BLACK}`, 108, W - 2 * M);
  ctx.fillText(card.masthead, W / 2, y);
  y += 36; rule(ctx, y, ink, true);
  y += 44;
  ctx.font = `600 26px ${TEXT}`; ctx.fillStyle = ink2;
  ctx.textAlign = 'left'; ctx.fillText(card.dateLine.toUpperCase(), M, y);
  ctx.textAlign = 'right'; ctx.fillText(card.gamesLine.toUpperCase(), W - M, y);
  y += 22; rule(ctx, y, ink);
  // The headline: the evening's first place.
  ctx.textAlign = 'center';
  const title = say(card.title);
  const ts = fit(ctx, title, `400 {s}px ${BLACK}`, 96, W - 2 * M, 52);
  ctx.fillStyle = ink; y += ts + 40; ctx.fillText(title, W / 2, y);
  // The standings.
  y += 78; ctx.font = `600 24px ${TEXT}`; ctx.fillStyle = red; ctx.fillText(card.standingsLabel.toUpperCase(), W / 2, y);
  y += 20;
  const rows = card.rows.slice(0, 10);
  const rowH = rows.length > 7 ? 52 : 64;
  const face = rowH - 14;
  for (const [i, r] of rows.entries()) {
    const top = y + i * rowH;
    const x0 = M + 40;
    ctx.fillStyle = i === 0 ? red : ink2; ctx.font = `400 34px ${BLACK}`; ctx.textAlign = 'right';
    ctx.fillText(String(i + 1), x0, top + face * 0.72);
    const fx = x0 + 20;
    ctx.save(); ctx.beginPath(); ctx.arc(fx + face / 2, top + face / 2, face / 2, 0, Math.PI * 2); ctx.closePath();
    ctx.fillStyle = css('--vellum-2') || '#c6b185'; /* literal-ok */
    ctx.fill(); ctx.clip();
    const img = !anon && r.avatar ? await svgImage(avatarSvg(r.avatar)) : null;
    if (img) ctx.drawImage(img, fx, top, face, face);
    else { ctx.fillStyle = ink; ctx.font = `400 ${Math.round(face * 0.45)}px ${BLACK}`; ctx.textAlign = 'center'; ctx.fillText(anon ? String(i + 1) : (r.name[0] || '?').toUpperCase(), fx + face / 2, top + face * 0.66); }
    ctx.restore();
    ctx.strokeStyle = i === 0 ? red : edge; ctx.lineWidth = i === 0 ? 3 : 2;
    ctx.beginPath(); ctx.arc(fx + face / 2, top + face / 2, face / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.textAlign = 'left'; ctx.fillStyle = ink; ctx.font = `600 ${rowH > 60 ? 30 : 26}px ${TEXT}`;
    ctx.fillText(anon ? seats[i][1] : r.name, fx + face + 18, top + face * 0.68);
    ctx.textAlign = 'right'; ctx.font = `italic 400 24px ${TEXT}`; ctx.fillStyle = ink2;
    ctx.fillText(`${r.wins}/${r.games}`, W - M - 140, top + face * 0.68);
    ctx.font = `400 34px ${BLACK}`; ctx.fillStyle = ink;
    ctx.fillText(`${r.pts} ${card.ptsWord}`, W - M - 10, top + face * 0.7);
  }
  y += rows.length * rowH + 10;
  if (card.rows.length > rows.length) { ctx.textAlign = 'center'; ctx.font = `italic 400 22px ${TEXT}`; ctx.fillStyle = ink2; ctx.fillText(card.moreLabel.replace('{n}', card.rows.length - rows.length), W / 2, y + 8); y += 34; }
  // The games, newest last.
  if (y < H - 230 && card.games.length) {
    rule(ctx, y, ink); y += 46;
    ctx.textAlign = 'center'; ctx.font = `600 24px ${TEXT}`; ctx.fillStyle = red; ctx.fillText(card.gamesLabel.toUpperCase(), W / 2, y);
    const room = Math.max(1, Math.floor((H - 160 - y) / 36));
    if (card.games.length > room) { y += 36; ctx.font = `italic 400 22px ${TEXT}`; ctx.fillStyle = ink2; ctx.fillText(card.earlierLabel.replace('{n}', card.games.length - room + 1), W / 2, y); }
    for (const gm of card.games.length > room ? card.games.slice(-(room - 1)) : card.games) {
      y += 36; ctx.font = `italic 400 26px ${TEXT}`; ctx.fillStyle = ink2;
      let line = say(`${gm.mode} — ${gm.winners.join(', ') || '—'}`);
      while (ctx.measureText(line).width > W - 2 * M && line.length > 10) line = `${line.slice(0, -2)}…`;
      ctx.fillText(line, W / 2, y);
    }
  }
  rule(ctx, H - 120, ink, true);
  ctx.textAlign = 'center'; ctx.fillStyle = ink2; ctx.font = `600 26px ${TEXT}`;
  ctx.fillText(card.url, W / 2, H - 70);
  return new Promise((resolve) => c.toBlob(resolve, 'image/png'));
}

/** Share the card as a file where the device can; otherwise download it. */
export async function shareCard(card, opts = {}) {
  const blob = await (opts.evening ? drawEveningCard(card, opts) : drawShareCard(card, opts));
  if (!blob) return 'failed';
  const file = new File([blob], `dead-set-${Date.now()}.png`, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: card.masthead }); return 'shared'; } catch { return 'cancelled'; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = file.name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
}
