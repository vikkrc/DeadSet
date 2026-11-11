#!/usr/bin/env node
/* Zero-dependency visual-asset smoke check. Run with:
     node scripts/check-deco-design.mjs
   This is not a browser screenshot or an end-to-end gameplay test.
*/
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const at = (x) => join(root, x);
const read = (x) => readFileSync(at(x), 'utf8');

const css = read('public/redacted-press.css');
const html = read('public/index.html');
const app = read('public/app.js');
const lab = read('public/deco-preview.html');

assert.match(html, /href="\/styles\.css"/);
assert.match(html, /href="\/redacted-press\.css"/);
assert.doesNotMatch(html, /href="\/(?:gothic-press|black-ledger)\.css"/);
assert.match(lab, /href="\/redacted-press\.css"/);
assert.match(lab, /data-target="night"/);
assert.match(lab, /data-target="vote"/);
assert.match(lab, /data-target="board"/);
assert.match(lab, /data-target="reveal"/);

// If selectors remain but target inputs disappear, the cosmetic redesign
// would make the lobby inaccessible. Check the stable action hooks survive.
for (const action of ['create', 'gotoRoom', 'homeTab', 'toggleModerated', 'pickVote', 'flip']) {
  assert.ok(app.includes('data-act="' + action + '"'), 'Missing application action: ' + action);
}
assert.match(app, /function roleCardHtml/);
assert.match(app, /function ring\(/);
assert.match(app, /function boardView/);

const urls = [...css.matchAll(/url\(\s*['"]?(\/(?:press|deco)-[\w-]+\.svg)['"]?\s*\)/g)]
  .map((m) => m[1]);
const unique = [...new Set(urls)];
assert.ok(unique.length >= 7, 'Expected multiple original SVG decorations');
for (const url of unique) {
  const path = 'public' + url;
  assert.ok(existsSync(at(path)), 'CSS references missing asset: ' + url);
  const svg = read(path);
  assert.match(svg, /^\s*<svg\b/);
  assert.match(svg, /<\/svg>\s*$/);
  assert.match(svg, /\bviewBox="/);
  assert.doesNotMatch(svg, /<script\b|onload\s*=|foreignObject/i);
}

// Basic balanced CSS delimiter check, ignoring strings and block comments.
let brace = 0, quote = '', comment = false, escape = false;
for (let i = 0; i < css.length; i++) {
  const c = css[i], n = css[i + 1];
  if (comment) { if (c === '*' && n === '/') { comment = false; i++; } continue; }
  if (quote) {
    if (escape) escape = false;
    else if (c === '\\') escape = true;
    else if (c === quote) quote = '';
    continue;
  }
  if (c === '/' && n === '*') { comment = true; i++; continue; }
  if (c === "'" || c === '"') { quote = c; continue; }
  if (c === '{') brace++;
  if (c === '}') brace--;
  assert.ok(brace >= 0, 'CSS closes block before opening');
}
assert.equal(brace, 0, 'CSS has unclosed block');
assert.equal(quote, '', 'CSS has unclosed string');
assert.equal(comment, false, 'CSS has unclosed comment');
console.log('Gothic Deco smoke check passed (' + unique.length + ' SVG assets, action hooks, styles and preview).');
