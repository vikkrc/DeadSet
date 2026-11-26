// TV audit (TV-PASS §16): plays each game on a 1600 × 900 TV with bots and checks every sample of the board.
// Needs a running server. Usage: PORT=3123 node scripts/tv-audit.mjs [mode …]   (default: every game)
// Env: SAMPLES (default 14), EVERY (ms between samples, default 2500), BOTS (default 6), OUT (folder for captures).
//
// Hard checks (exit 1): blank frames, buttons on the TV outside the lobby (the score bell is a span), text clipped
// past the viewport or running under the band, anything covering a seat's name.
// Soft report: the share of visible text under 20 px, and every text under 16 px (the TV floor).
import fs from 'node:fs';
import { createRequire } from 'node:module';

// Playwright is not a dependency of the game: use the one installed on the machine.
const { chromium } = createRequire(import.meta.url)('playwright');

const BASE = `http://localhost:${process.env.PORT || 3123}`;
const MODES = process.argv.slice(2).length ? process.argv.slice(2) : ['classic', 'missions', 'exorcism', 'coffins', 'carnival', 'midnight', 'seance', 'graverobbers', 'mimic', 'omen', 'mirror'];
const SAMPLES = +(process.env.SAMPLES || 14);
const EVERY = +(process.env.EVERY || 2500);
const OUT = process.env.OUT || '';
if (OUT) fs.mkdirSync(OUT, { recursive: true });
const ip = () => `10.77.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}`;
const api = async (path, body) => (await fetch(BASE + path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip() }, body: body ? JSON.stringify(body) : undefined })).json();

/** Runs in the page: one sample of the board. */
function inspect() {
  const W = innerWidth; const H = innerHeight;
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const label = (el) => (typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : el.tagName.toLowerCase());
  const frame = document.querySelector('main.tvx');
  const moment = [...document.querySelectorAll('.moment')].find(vis);
  const out = { phase: frame?.className.match(/mode-\w+/)?.[0] ?? '', blank: false, buttons: [], clipped: [], covered: [], small: [], chars: 0, under20: 0 };
  // Blank: no frame, or neither a scene nor anything on the stage.
  const stage = frame?.querySelector('.tvx-stage');
  if (!frame || (!moment && !(stage && vis(stage) && (stage.textContent.trim() || stage.querySelector('svg, .tok, img'))))) out.blank = true;
  const lobby = !!document.querySelector('.tvx.lb, .tvx[data-key^="board-lobby"], .tvx .lb-count') || /LOBBY/.test(document.body.dataset.phase ?? '');
  if (!lobby) for (const b of document.querySelectorAll('main.tvx button')) if (vis(b) && !b.closest('.moment')) out.buttons.push(label(b));
  const band = frame?.querySelector('.tvx-band')?.getBoundingClientRect();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const tx = n.textContent.trim(); const el = n.parentElement;
    if (!tx || !el || !vis(el) || el.closest('svg, .tv-arch, [aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > H) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    out.chars += tx.length; if (fs < 20) out.under20 += tx.length;
    if (fs < 16 && !el.closest('.tok-name, .kicker')) out.small.push([Math.round(fs * 10) / 10, label(el), tx.slice(0, 30)]);
    // Clipped: past the viewport, or a stage/ledger text whose box runs under the band.
    let hiddenBy = null; for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/(hidden|clip)/.test(cs.overflow + cs.overflowY)) { hiddenBy = p.getBoundingClientRect(); break; } }
    const bottom = hiddenBy ? Math.min(r.bottom, hiddenBy.bottom) : r.bottom;
    if (r.right > W + 2 || r.left < -2 || bottom > H + 2) out.clipped.push([label(el), tx.slice(0, 24)]);
    else if (band && el.closest('.tvx-body') && !moment && bottom > band.top + 2 && r.top < band.top) out.clipped.push([`under band ${label(el)}`, tx.slice(0, 24)]);
  }
  // Nothing over a name: sample each seat name's box; the element found must belong to that seat.
  if (!moment) for (const nm of frame?.querySelectorAll('.tok-name') ?? []) {
    if (!vis(nm)) continue; const r = nm.getBoundingClientRect(); const tok = nm.closest('.tok');
    for (const fx of [0.2, 0.5, 0.8]) {
      const hit = document.elementFromPoint(r.left + r.width * fx, r.top + r.height / 2);
      if (hit && !tok.contains(hit) && !hit.contains(nm) && !hit.closest('.tv-arch')) { out.covered.push([nm.textContent.trim().slice(0, 16), label(hit)]); break; }
    }
  }
  return out;
}

const report = {};
let hard = 0;
const browser = await chromium.launch();
for (const mode of MODES) {
  const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const r = await api('/api/rooms', { name: 'Audit' });
  const cmd = (type, payload = {}) => api(`/api/rooms/${r.code}/cmd`, { t: r.token, type, payload, key: String(Math.random()) });
  if (mode !== 'classic') await cmd('host.settings', { mode });
  await cmd('host.bots', { count: +(process.env.BOTS || 6) });
  await cmd('lobby.ready', { ready: true });
  await page.goto(`${BASE}/board/${r.code}`);
  await page.waitForTimeout(1500);
  const samples = [await page.evaluate(inspect)];
  await cmd('host.start');
  for (let i = 0; i < SAMPLES; i++) {
    await page.waitForTimeout(EVERY);
    const s = await page.evaluate(inspect);
    samples.push(s);
    const bad = s.blank || s.buttons.length || s.clipped.length || s.covered.length;
    if (OUT && bad) await page.screenshot({ path: `${OUT}/${mode}-${i}.png` });
  }
  const sum = (k) => samples.flatMap((s) => s[k]);
  const chars = samples.reduce((a, s) => a + s.chars, 0);
  const res = {
    blank: samples.filter((s) => s.blank).length,
    buttons: [...new Set(sum('buttons'))],
    clipped: [...new Set(sum('clipped').map((x) => x.join(' ')))].slice(0, 8),
    covered: [...new Set(sum('covered').map((x) => x.join(' by ')))].slice(0, 8),
    under20: chars ? `${Math.round((samples.reduce((a, s) => a + s.under20, 0) / chars) * 100)}%` : '0%',
    small: [...new Set(sum('small').map((x) => x.join(' ')))].slice(0, 6),
    errors,
  };
  hard += res.blank + res.buttons.length + res.clipped.length + res.covered.length + errors.length;
  report[mode] = res;
  console.log(mode, JSON.stringify(res));
  await page.close();
}
await browser.close();
console.log(hard ? `\nTV audit: ${hard} problem(s).` : '\nTV audit: clean.');
process.exit(hard ? 1 : 0);
