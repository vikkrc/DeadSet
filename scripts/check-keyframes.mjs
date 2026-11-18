// Fails when a @keyframes name is defined twice in public/styles.css: the later definition
// silently replaces the earlier one for every element that uses the name (CONSISTENCY-PASS A1).
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
const seen = new Map();
const dups = [];
css.split('\n').forEach((line, i) => {
  for (const m of line.matchAll(/@keyframes\s+([\w-]+)/g)) {
    if (seen.has(m[1])) dups.push(`${m[1]}: lines ${seen.get(m[1])} and ${i + 1}`);
    else seen.set(m[1], i + 1);
  }
});
if (dups.length) { console.error(`Duplicate @keyframes names:\n  ${dups.join('\n  ')}`); process.exit(1); }
console.log(`keyframes ok (${seen.size} unique)`);
