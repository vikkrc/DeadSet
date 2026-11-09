// Checks every translation file: placeholders and HTML tags must match the
// English key, and content tables must have the same shape as engine/content.js.
import { ROLES, DREAMS, RULE_CARDS, PRESETS, SCENARIO, PRODUCTS, LANGS, MISSION_CARDS } from '../engine/content.js';

let bad = 0;
const ph = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const tags = (s) => [...String(s).matchAll(/<\/?(\w+)/g)].map((m) => m[0]).sort().join(',');
for (const code of LANGS.filter((c) => c !== 'en')) {
  let d;
  try { d = (await import(`../public/i18n/${code}.js`)).default; } catch { bad++; console.log(`${code}: file missing`); continue; }
  const err = (m) => { bad++; console.log(`${code}: ${m}`); };
  for (const [k, v] of Object.entries(d.ui)) {
    if (ph(k) !== ph(v)) err(`placeholders differ: ${k} → ${v}`);
    if (tags(k) !== tags(v)) err(`tags differ: ${k} → ${v}`);
  }
  for (const id of Object.keys(ROLES)) for (const f of ['name', 'when', 'summary', 'detail']) if (!d.roles?.[id]?.[f]) err(`role ${id}.${f} missing`);
  for (const id of Object.keys(DREAMS)) for (const f of ['name', 'text']) if (!d.dreams?.[id]?.[f]) err(`dream ${id}.${f} missing`);
  for (const id of Object.keys(RULE_CARDS)) for (const f of ['name', 'text', 'enforcement']) if (!d.rules?.[id]?.[f]) err(`rule ${id}.${f} missing`);
  for (const id of Object.keys(MISSION_CARDS)) for (const f of ['name', 'text']) if (!d.mcards?.[id]?.[f]) err(`mission card ${id}.${f} missing`);
  for (const id of Object.keys(PRESETS)) for (const f of ['name', 'blurb']) if (!d.presets?.[id]?.[f]) err(`preset ${id}.${f} missing`);
  for (const k of ['WHO', 'WHERE', 'WHY']) if (d.scenario?.[k]?.length !== SCENARIO[k].length) err(`scenario ${k} length`);
  if (d.products?.length !== PRODUCTS.length) err('products length');
  if (d.whispers?.length !== 9) err('whispers length');
  if (!d.and) err('and missing');
}
console.log(bad ? `${bad} problem(s)` : 'translations ok');
process.exitCode = bad ? 1 : 0;
