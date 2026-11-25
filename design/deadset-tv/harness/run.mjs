import { chromium } from 'playwright';
import fs from 'fs';
const BASE = 'http://localhost:3123';
const OUT = process.env.OUT || './shots';
const uid = () => Math.random().toString(36).slice(2);
let ipn = 10;
async function api(path, body, ip) {
  const r = await fetch(BASE + path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: body ? JSON.stringify(body) : undefined });
  return r.json().catch(() => ({}));
}
function watch(code, onState) {
  const ctrl = new AbortController();
  (async () => {
    const r = await fetch(`${BASE}/api/rooms/${code}/events?board=1`, { signal: ctrl.signal });
    const rd = r.body.getReader(); const dec = new TextDecoder(); let buf = '';
    for (;;) { const { value, done } = await rd.read().catch(() => ({ done: true })); if (done) break; buf += dec.decode(value, { stream: true });
      let i; while ((i = buf.indexOf('\n\n')) >= 0) { const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
        if (chunk.includes('event: state')) { const d = chunk.split('\n').find((l) => l.startsWith('data: ')); try { onState(JSON.parse(d.slice(6))); } catch {} } } }
  })().catch(() => {});
  return () => ctrl.abort();
}
export async function runMode(browser, spec) {
  const { name, settings = [], bots = 6, maxMs = 300000, lang = 'en', stall = 7000, beforeStart } = spec;
  const ip = `10.0.0.${ipn++}`;
  const dir = `${OUT}/${name}`; fs.mkdirSync(dir, { recursive: true });
  const r = await api('/api/rooms', { name: 'Viktor', lang }, ip);
  const { code, token } = r;
  const cmd = (type, payload = {}, phaseId) => api(`/api/rooms/${code}/cmd`, { t: token, type, payload, phaseId, key: uid() }, ip);
  for (const s of settings) { const x = await cmd('host.settings', s); if (x.error) console.log(name, 'settings err', x.error, JSON.stringify(s)); }
  await cmd('host.bots', { count: bots });
  await cmd('lobby.ready', { ready: true });
  let st = null, changed = Date.now(); const seen = [];
  const stop = watch(code, (s) => { if (!st || s.phaseId !== st.phaseId) { changed = Date.now(); seen.push(s.phaseId); } st = s; });
  const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  await phoneCtx.addInitScript({ path: './node_modules/axe-core/axe.min.js' }); await phoneCtx.addInitScript({ path: './audit.js' });
  await phoneCtx.addInitScript(([k, v, l]) => { localStorage.setItem(k, v); localStorage.setItem('deadset:lang', l); }, [`deadset:${code}`, JSON.stringify(r), lang]);
  const phone = await phoneCtx.newPage(); const errs = []; const audits = [];
  for (const pg of []) {}
  phone.on('pageerror', (e) => errs.push('phone: ' + e.message)); phone.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push('phone ' + m.type() + ': ' + m.text()); });
  const tvCtx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await tvCtx.addInitScript({ path: './node_modules/axe-core/axe.min.js' }); await tvCtx.addInitScript({ path: './audit.js' });
  const tv = await tvCtx.newPage(); tv.on('pageerror', (e) => errs.push('tv: ' + e.message)); tv.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push('tv ' + m.type() + ': ' + m.text()); });
  await phone.goto(`${BASE}/r/${code}`); await tv.goto(`${BASE}/board/${code}`);
  await phone.waitForTimeout(1800);
  let n = 0;
  const snap = async (tag) => { const k = String(n++).padStart(3, '0'); const ph = (st?.phase || 'X').replace(/[^A-Z0-9_]/gi, ''); 
    await Promise.all([phone.screenshot({ path: `${dir}/${k}-${ph}-${tag}-phone.png`, fullPage: true }).catch(() => {}), tv.screenshot({ path: `${dir}/${k}-${ph}-${tag}-tv.png` }).catch(() => {})]); };
  await snap('lobby'); if (spec.audit) for (const [pg, k] of [[phone, 'phone'], [tv, 'tv']]) { try { const r = await pg.evaluate((k) => window.__dsAudit(k), k); r.phase = 'LOBBY'; r.n = 0; audits.push(r); } catch (e) { errs.push('audit ' + e.message); } }
  if (beforeStart) await beforeStart({ phone, tv, cmd, snap });
  const s0 = await cmd('host.start'); if (s0.error) console.log(name, 'start err', s0.error);
  const t0 = Date.now(); let last = null; let lateShot = 0;
  while (Date.now() - t0 < maxMs) {
    await new Promise((res) => setTimeout(res, 500));
    if (!st) continue;
    if (st.phaseId !== last) { last = st.phaseId; await phone.waitForTimeout(700); await snap('a'); lateShot = Date.now() + 3200; if (spec.audit) { const ph = st.phase; for (const [pg, k] of [[phone, 'phone'], [tv, 'tv']]) { try { const r = await pg.evaluate((k) => window.__dsAudit(k), k); r.phase = ph; r.n = n; audits.push(r); } catch (e) { errs.push('audit ' + e.message); } } } }
    if (lateShot && Date.now() > lateShot) { lateShot = 0; await snap('b'); }
    if (/END/.test(st.phase) && Date.now() - changed > 9000) { await snap('final'); break; }
    if (Date.now() - changed > stall) { const x = await cmd('host.advance', {}, st.phaseId); changed = Date.now() - stall / 2; if (x.error && !/scene|Wait/.test(x.error)) errs.push('advance: ' + x.error); }
  }
  stop();
  if (spec.audit) fs.writeFileSync(`${dir}/_audit.json`, JSON.stringify(audits));
  fs.writeFileSync(`${dir}/_log.txt`, `code ${code}\nphases:\n${seen.join('\n')}\n\nerrors:\n${[...new Set(errs)].join('\n')}\n`);
  await phoneCtx.close(); await tvCtx.close();
  return { name, code, phases: seen.length, errs: [...new Set(errs)].length };
}
if (process.argv[2]) {
  const specs = JSON.parse(fs.readFileSync(process.argv[2]));
  const browser = await chromium.launch();
  const res = await Promise.all(specs.map((s) => runMode(browser, s)));
  console.log(JSON.stringify(res));
  await browser.close();
}
