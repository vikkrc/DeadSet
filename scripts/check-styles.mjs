// Style guards for public/styles.css (CONSISTENCY-PASS B3, B5, B6). Run by `npm test`.
// Each rule lists the offending lines; a line that is a deliberate exception ends with /* literal-ok */.
import { readFileSync, writeFileSync } from 'node:fs';
const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
const lines = css.split('\n');
const problems = [];
const ok = (line) => line.includes('literal-ok');
const offset = []; // character offset where each line starts
lines.reduce((at, line, i) => { offset[i] = at; return at + line.length + 1; }, 0);

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
  if (offset[i] > rootEnd && /cubic-bezier\(/.test(line)) problems.push(`B5 line ${i + 1}: cubic-bezier outside the tokens — use --ease, --ease-in or --spring`);
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

// B3: colours come from tokens. Hex literals are allowed in token definitions (--name: #hex), as
// #000/#fff, on a literal-ok line, or if they are in the frozen baseline of mode art colours
// (scripts/colour-baseline.json), which may only shrink: pass --write-baseline after removing some.
const rootClose = css.indexOf('}', css.indexOf(':root {'));
const hexCount = {};
lines.forEach((line, i) => {
  if (ok(line) || offset[i] < rootClose) return;
  for (const d of line.matchAll(/(?:^|[{;\s])([\w-]+)\s*:\s*([^;{}]*)/g)) {
    if (d[1].startsWith('--')) continue;
    for (const h of d[2].matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
      const hex = h[0].toLowerCase();
      if (['#000', '#fff', '#000000', '#ffffff'].includes(hex)) continue;
      (hexCount[hex] ??= []).push(i + 1);
    }
  }
});
const baseUrl = new URL('./colour-baseline.json', import.meta.url);
if (process.argv.includes('--write-baseline')) {
  const out = Object.fromEntries(Object.entries(hexCount).sort().map(([h, at]) => [h, at.length]));
  writeFileSync(baseUrl, JSON.stringify(out, null, 0).replace(/,/g, ',\n') + '\n');
} else {
  const base = JSON.parse(readFileSync(baseUrl, 'utf8'));
  for (const [hex, at] of Object.entries(hexCount)) {
    if (at.length > (base[hex] ?? 0)) problems.push(`B3 line ${at.at(-1)}: new colour literal ${hex} — use a token (or add one), or mark the line /* literal-ok */`);
  }
}

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('styles ok');
