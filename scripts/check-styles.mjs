// Style guards for public/styles.css (CONSISTENCY-PASS B3, B5, B6). Run by `npm test`.
// Each rule lists the offending lines; a line that is a deliberate exception ends with /* literal-ok */.
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
const lines = css.split('\n');
const problems = [];
const ok = (line) => line.includes('literal-ok');

// B6: global layers use the named --z-* tokens; literals only for local stacking (-1 to 9).
lines.forEach((line, i) => {
  if (ok(line)) return;
  for (const m of line.matchAll(/z-index:\s*(-?\d+)\s*[;}]/g)) {
    const n = Number(m[1]);
    if (n < -1 || n > 9) problems.push(`B6 line ${i + 1}: z-index ${n} — use a --z-* layer`);
  }
});

// B5: one set of curves, one reduced-motion rule, transitions and shared moments on the motion scale.
const rootEnd = css.indexOf('}', css.indexOf(':root'));
lines.forEach((line, i) => {
  if (ok(line)) return;
  const at = lines.slice(0, i).join('\n').length;
  if (at > rootEnd && /cubic-bezier\(/.test(line)) problems.push(`B5 line ${i + 1}: cubic-bezier outside the tokens — use --ease, --ease-in or --spring`);
  for (const m of line.matchAll(/transition(?:-duration)?:\s*([^;}]*)/g)) {
    for (const seg of m[1].split(',')) {
      const d = seg.match(/(?<![\w.-])(\d*\.?\d+)m?s\b/);
      if (d && Number(d[1]) !== 0 && !seg.includes('!important')) problems.push(`B5 line ${i + 1}: transition "${seg.trim()}" — use a --t-* duration`);
    }
  }
  for (const m of line.matchAll(/\b(tarot-turn(?:-in|-out)?(?:-x)?|tarot-deal|stamp-in|letters-in|letterBounce)\s+(\d*\.?\d+m?s)/g)) {
    problems.push(`B5 line ${i + 1}: ${m[1]} runs ${m[2]} — shared moments use --t-card, --t-turn, --t-stamp or --t-scene`);
  }
});
const reduced = (css.match(/prefers-reduced-motion/g) || []).length;
if (reduced !== 2) problems.push(`B5: ${reduced - 1} reduced-motion rules — keep the one global rule`); // the rule plus its comment

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('styles ok');
