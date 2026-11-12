// Lists the English interface strings that translation files should cover:
// literal arguments of t()/th() in the client, plus the message templates the
// engine sends. Usage: node scripts/i18n-keys.mjs [lang]  (with a language,
// prints only the keys that language is missing).
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const keys = new Set();
const lit = /'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\$]|\\.)*)`/g;
const unq = (s) => s.replace(/\\'/g, "'").replace(/\\`/g, '`').replace(/\\\\/g, '\\');

/** String literals of a source file (comments and regex literals skipped). */
function strings(src) {
  const out = [];
  let i = 0;
  const prevSig = () => { let j = out.pos ?? i - 1; while (j >= 0 && /\s/.test(src[j])) j--; return src[j]; };
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 2; continue; }
    if (c === '/') {
      out.pos = i - 1;
      if (/[(=,:!&|?;{}[]/.test(prevSig() ?? ';')) { i++; let cls = false; while (i < src.length) { const d = src[i]; if (d === '\\') { i += 2; continue; } if (d === '[') cls = true; else if (d === ']') cls = false; else if (d === '/' && !cls) break; i++; } i++; continue; }
      out.pos = undefined; i++; continue;
    }
    if (c === "'" || c === '"') {
      let j = i + 1; let s = '';
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') { s += src[j + 1] === c ? c : src[j] + src[j + 1]; j += 2; continue; } s += src[j++]; }
      out.push(s); i = j + 1; continue;
    }
    if (c === '`') {
      let j = i + 1; let s = ''; let dyn = false;
      while (j < src.length && src[j] !== '`') {
        if (src[j] === '\\') { s += src[j + 1]; j += 2; continue; }
        if (src[j] === '$' && src[j + 1] === '{') { dyn = true; let depth = 1; j += 2; while (j < src.length && depth) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; else if (src[j] === '`') { j = src.indexOf('`', j + 1); } j++; } continue; }
        s += src[j++];
      }
      if (!dyn) out.push(s);
      i = j + 1; continue;
    }
    i++;
  }
  return out;
}

// Client: every string literal inside a t( / th( / tm( / tmh( call (balanced parens).
for (const f of ['public/app.js', 'public/board.js', 'public/gazette.js', 'public/guide.js', 'public/gifts.js', 'public/missions.js', 'public/exorcism.js', 'public/coffins.js']) {
  const src = read(f);
  const re = /\b(?:t|th)\(/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 1; let i = re.lastIndex; let q = null;
    for (; i < src.length && depth; i++) {
      const c = src[i];
      if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
      if (c === "'" || c === '"' || c === '`') q = c;
      else if (c === '(') depth++;
      else if (c === ')') depth--;
    }
    const call = src.slice(re.lastIndex, i - 1);
    // Only the template argument: literals before the params object.
    const head = call.split(/,\s*\{\s*\w+[:,}]/)[0];
    for (const x of head.matchAll(lit)) { const s = unq(x[1] ?? x[2]); if (/[A-Za-z]/.test(s) && !/^[a-z]+[A-Z]\w*$/.test(s)) keys.add(s); }
  }
}
// Client tables whose values are passed through t().
const tables = [
  ['public/app.js', /const (?:STEP_EN|ALIGN_EN) = \{([\s\S]*?)\};/g],
  ['public/i18n.js', /const OPT = \{([\s\S]*?)\};/g],
  ['public/board.js', /export function activeRuleNotes[\s\S]*?\n\}/g],
  ['engine/views.js', /const ADVANCE_LABEL = \{([\s\S]*?)\};/g],
  ['engine/missions.js', /const MISSION_ADVANCE_LABEL = \{([\s\S]*?)\};/g],
];
for (const [f, re] of tables) for (const m of read(f).matchAll(re)) for (const x of (m[1] ?? m[0]).matchAll(lit)) { const s = unq(x[1] ?? x[2]); if (/\s/.test(s) || /^[A-Z][a-z]/.test(s)) keys.add(s); }
for (const f of ['public/app.js', 'public/missions.js', 'public/exorcism.js']) for (const m of read(f).matchAll(/(?:title|sub|kicker): '((?:[^'\\]|\\.)*)'/g)) keys.add(unq(m[1]));
for (const m of read('public/app.js').matchAll(/toggle\('\w+', '((?:[^'\\]|\\.)*)', '((?:[^'\\]|\\.)*)'\)/g)) { keys.add(unq(m[1])); keys.add(unq(m[2])); }
for (const m of read('public/app.js').matchAll(/roleRow\('\w+', '((?:[^'\\]|\\.)*)'\)/g)) keys.add(unq(m[1]));
for (const m of read('public/app.js').matchAll(/setRow\('\w+', '((?:[^'\\]|\\.)*)', '((?:[^'\\]|\\.)*)'\)/g)) { keys.add(unq(m[1])); keys.add(unq(m[2])); }
// Labels passed through small helpers that call t() themselves.
for (const m of read('public/app.js').matchAll(/timer\('\w+', '((?:[^'\\]|\\.)*)'\)/g)) keys.add(unq(m[1]));
for (const m of read('public/app.js').matchAll(/\bcount\('((?:[^'\\]|\\.)*)'\)/g)) keys.add(unq(m[1]));
// Ceremony card labels (translated through a variable).
for (const k of ['Who', 'Where', 'Why']) keys.add(k);
// Tables of labels the client translates at render time.
for (const m of read('public/app.js').matchAll(/const (?:SUGGESTION_LABEL|WEIGHT_LABEL|ROLE_GROUPS|TUTORIAL|RECAP_ROLE|AV_ROWS) = ([\s\S]*?);\n/g)) for (const x of m[1].matchAll(lit)) { const s = unq(x[1] ?? x[2]); if (/[A-Za-z]/.test(s) && !/^[A-Z_]+$/.test(s) && !/^[a-z]+$/.test(s)) keys.add(s); }

// Coffins: explainer steps, label tables and the advance labels.
for (const m of read('public/coffins.js').matchAll(/const (?:steps|FACE_EN|RELIC_EN|RELIC_WHEN) = [\[{]([\s\S]*?)[\]}];/g)) for (const x of m[1].matchAll(lit)) { const s = unq(x[1] ?? x[2]); if (/\s|^[A-Z][a-z]/.test(s)) keys.add(s); }
for (const m of read('engine/coffins.js').matchAll(/export const C_ADVANCE_LABEL = \{([\s\S]*?)\};/g)) for (const x of m[1].matchAll(lit)) { const s = unq(x[1] ?? x[2]); if (/\s/.test(s)) keys.add(s); }
// Exorcism's explainer steps.
for (const m of read('public/exorcism.js').matchAll(/const steps = \[([\s\S]*?)\];/g)) for (const x of m[1].matchAll(lit)) { const s = unq(x[1] ?? x[2]); if (/\s|^[A-Z][a-z]/.test(s)) keys.add(s); }
for (const m of read('engine/exorcism.js').matchAll(/export const X_ADVANCE_LABEL = \{([\s\S]*?)\};/g)) for (const x of m[1].matchAll(lit)) { const s = unq(x[1] ?? x[2]); if (/\s/.test(s)) keys.add(s); }
// Side Missions: only the message templates (the objectives themselves are content).
for (const s of strings(read('engine/sidemissions.js'))) if (/\{\w+\}/.test(s)) keys.add(s);

// The gift quips (gifts.js), translated at render time.
for (const m of read('public/gifts.js').matchAll(/const QUIP = \[([\s\S]*?)\];/g)) for (const x of m[1].matchAll(lit)) keys.add(unq(x[1] ?? x[2]));

// Engine: message templates (strings shaped like sentences or containing {params}).
for (const m of read('engine/content.js').matchAll(/verb: '([^']+)'/g)) keys.add(m[1]);
for (const f of ['engine/missions.js', 'engine/exorcism.js', 'engine/coffins.js', 'engine/game.js', 'engine/night.js', 'engine/day.js', 'engine/setup.js', 'engine/views.js', 'engine/victory.js', 'engine/state.js', 'server/rooms.js', 'server/index.js']) {
  for (const s of strings(read(f))) {
    if (/\{\w+\}/.test(s) || (/^[A-Z]/.test(s) && /\s/.test(s) && !/^[A-Z_]+$/.test(s))) keys.add(s);
    else if (/^(ready|asleep|ballots recorded|have seen their role|are ready|have spoken|ready to vote|votes in|Table|Lobby|End)$/.test(s)) keys.add(s);
  }
}
const SKIP = new Set(['', 'DEMON', 'F', 'MASKED_VOTE', 'REGULAR', 'missions', 'stand', 'coin', 'DEATH', 'INDEPENDENT', 'ABSTAIN', 'Dead Set', 'Payload too large', 'Invalid JSON', 'Method not allowed', 'Could not restore rooms:']);
const list = [...keys].filter((k) => !SKIP.has(k) && !k.startsWith('deadline')).sort();
const lang = process.argv[2];
if (lang) {
  const d = (await import(new URL(`../public/i18n/${lang}.js`, import.meta.url))).default;
  const miss = list.filter((k) => !(k in (d.ui ?? {})));
  console.log(miss.map((k) => JSON.stringify(k)).join('\n'));
  console.error(`${lang}: ${list.length - miss.length}/${list.length} covered`);
} else console.log(JSON.stringify(list, null, 1));
