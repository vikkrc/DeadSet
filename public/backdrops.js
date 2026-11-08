// TV backdrops: one quiet line-art scene per WHERE card, drawn behind the
// table. Index = position in engine/content.js SCENARIO.WHERE. Custom (host-
// written) locations, or the backdrops switch turned off, keep the plain room.
// Everything is decorative and never reacts to private actions.
const L = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
const stars = (n, seed) => Array.from({ length: n }, (_, i) => {
  const x = (seed * 97 + i * 173) % 1600; const y = (seed * 31 + i * 67) % 380;
  return `<circle cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.6}" class="bd-star" style="--i:${i % 7}"/>`;
}).join('');

const SCENES = [
  // 0 a sinking ship
  `<g class="bd-rock"><g ${L} stroke-width="3"><path d="M520 640l120 120h420l140-150z"/><path d="M760 610V300M760 300l-160 260h160M760 330l170 240H760"/><path d="M700 640h300"/></g></g>
   <g class="bd-waves" ${L} stroke-width="2.5"><path d="M0 760q100-30 200 0t200 0 200 0 200 0 200 0 200 0 200 0 200 0 200 0"/><path d="M0 820q100-30 200 0t200 0 200 0 200 0 200 0 200 0 200 0 200 0 200 0" opacity=".6"/></g>${stars(26, 1)}`,
  // 1 an abandoned amusement park
  `<g ${L} stroke-width="2.5"><g class="bd-spin" style="transform-origin:1180px 470px"><circle cx="1180" cy="470" r="220"/>${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return `<path d="M1180 470L${(1180 + 220 * Math.cos(a)).toFixed(0)} ${(470 + 220 * Math.sin(a)).toFixed(0)}"/><rect x="${(1166 + 220 * Math.cos(a)).toFixed(0)}" y="${(470 + 220 * Math.sin(a)).toFixed(0)}" width="28" height="22" rx="4"/>`; }).join('')}</g>
   <path d="M1080 860l100-390 100 390"/><path d="M160 860V620l140-90 140 90v240M160 620h280M300 530v-60"/><path d="M200 860V700h80v160"/></g>${stars(30, 2)}`,
  // 2 an underground bunker
  `<g ${L} stroke-width="2"><path d="M0 220h1600M0 470h1600M0 720h1600M400 0v900M800 0v900M1200 0v900" opacity=".35"/>
   <path d="M800 0v170"/><path class="bd-swing" d="M760 170h80l20 40h-120z" style="transform-origin:800px 0"/></g>
   <ellipse class="bd-flicker" cx="800" cy="300" rx="260" ry="120" fill="currentColor" fill-opacity=".25"/>
   <g ${L} stroke-width="3"><circle cx="1360" cy="560" r="70"/><path d="M1360 490v140M1290 560h140M1310 510l100 100M1410 510l-100 100"/></g>`,
  // 3 a haunted mansion
  `<g ${L} stroke-width="3"><path d="M420 860V420l380-220 380 220v440"/><path d="M800 200V90M760 120h80"/><path d="M540 860V700h120v160M940 860V700h120v160"/>
   <path d="M520 480h100v120H520zM980 480h100v120H980zM750 420h100v130H750z"/><path d="M420 420l-80 60M1180 420l80 60"/></g>
   <g class="bd-flicker" fill="currentColor" fill-opacity=".5"><rect x="520" y="480" width="100" height="120"/><rect x="750" y="420" width="100" height="130"/></g>
   <circle cx="1350" cy="170" r="70" fill="currentColor" opacity=".08"/>${stars(22, 3)}`,
  // 4 a snow-covered tundra
  `<g ${L} stroke-width="2.5"><path d="M0 700q260-80 520-10t540-30 540 40"/><path d="M0 800q300-60 620 0t620-20 360 10" opacity=".7"/>
   <path d="M200 700l60-140 60 140M240 620h40M1300 690l50-110 50 110"/></g>
   <g class="bd-snow" fill="currentColor">${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 131) % 1600}" cy="${(i * 53) % 900}" r="${1.5 + (i % 3)}" style="--i:${i % 9}"/>`).join('')}</g>`,
  // 5 a fog-bound lighthouse
  `<g ${L} stroke-width="3"><path d="M760 860l30-480h60l30 480z"/><path d="M780 380h80v-50h-80zM770 330h100M820 330v-40"/><path d="M786 520h68M776 680h88"/></g>
   <path class="bd-beam" d="M820 350L0 230v240z" fill="currentColor" opacity=".08" style="transform-origin:820px 350px"/>
   <g class="bd-fogs" fill="currentColor" opacity=".05"><ellipse cx="400" cy="760" rx="520" ry="70"/><ellipse cx="1200" cy="800" rx="560" ry="80"/></g>`,
  // 6 a derelict space station
  `${stars(80, 6)}<g class="bd-spin-slow" style="transform-origin:800px 450px" ${L} stroke-width="3"><circle cx="800" cy="450" r="300"/><circle cx="800" cy="450" r="250"/><path d="M800 150v600M500 450h600"/><rect x="760" y="410" width="80" height="80" rx="10"/></g>
   <g ${L} stroke-width="2"><path d="M1260 200l120-40 20 50-120 40z"/><path d="M1320 180l-30-80"/></g>`,
  // 7 a night train through the mountains
  `<g class="bd-pan" ${L} stroke-width="2.5"><path d="M0 560l180-220 160 160 200-260 220 260 160-140 240 220 200-200 240 180 200-180"/><path d="M1600 560l180-220 160 160 200-260 220 260 160-140 240 220 200-200 240 180 200-180"/></g>
   <g ${L} stroke-width="3"><path d="M0 760h1600"/><path d="M180 760V640h320v120M540 760V640h320v120M900 760V620l60-30h180v170"/></g>
   <g class="bd-flicker" fill="currentColor" fill-opacity=".55"><rect x="220" y="660" width="60" height="40"/><rect x="320" y="660" width="60" height="40"/><rect x="580" y="660" width="60" height="40"/><rect x="680" y="660" width="60" height="40"/></g>${stars(30, 7)}`,
  // 8 a flooded cathedral
  `<g ${L} stroke-width="3"><path d="M300 640V300q100-160 200 0v340M700 640V240q100-180 200 0v400M1100 640V300q100-160 200 0v340"/><path d="M200 640h1200"/></g>
   <g ${L} stroke-width="2" opacity=".35" transform="translate(0 1280) scale(1 -1)"><path d="M300 640V300q100-160 200 0v340M700 640V240q100-180 200 0v400M1100 640V300q100-160 200 0v340"/></g>
   <g class="bd-waves" ${L} stroke-width="2" opacity=".6"><path d="M0 700q100-14 200 0t200 0 200 0 200 0 200 0 200 0 200 0 200 0 200 0"/></g>`,
  // 9 an overgrown botanical garden
  `<g ${L} stroke-width="3"><path d="M400 860V420q400-300 800 0v440"/><path d="M400 520h800M500 420v440M800 300v560M1100 420v440" opacity=".5"/></g>
   <g class="bd-sway" ${L} stroke-width="3"><path d="M150 900c0-200 60-300 160-400M150 760c-60-40-120-40-160 0M200 620c60-50 130-40 170 10M260 520c-40-50-100-60-150-30"/>
   <path d="M1450 900c0-200-60-300-160-400M1450 760c60-40 120-40 160 0M1400 620c-60-50-130-40-170 10"/></g>`,
  // 10 a desert oasis hotel
  `<g ${L} stroke-width="2.5"><path d="M0 720q300-90 600 0t600-10 400 20"/><path d="M0 800q400-70 800 0t800 0" opacity=".6"/>
   <path d="M560 700V480h480v220M560 480l240-120 240 120M640 540h60v80h-60zM900 540h60v80h-60zM770 700V600h60v100"/></g>
   <g class="bd-sway" ${L} stroke-width="3"><path d="M300 720c10-140 0-220-20-280M280 440c-60-30-120-10-150 30M280 440c50-50 120-40 150 0M280 440c-10-60-60-90-110-90"/></g>
   <circle cx="1300" cy="200" r="80" fill="currentColor" opacity=".08"/>${stars(24, 10)}`,
  // 11 a remote monastery
  `<g ${L} stroke-width="3"><path d="M0 780l300-260 220 160 280-300 300 260 240-140 260 200"/><path d="M700 640V360l100-80 100 80v280M760 640v-90h80v90M780 400h40v60h-40z"/><path d="M800 280v-60M780 240h40"/></g>
   <g class="bd-swing" style="transform-origin:800px 410px" ${L} stroke-width="3"><path d="M786 410q14 30 28 0"/></g>${stars(36, 11)}`,
  // 12 a moonlit vineyard
  `<circle cx="1250" cy="200" r="90" fill="currentColor" opacity=".1"/>${stars(30, 12)}
   <g ${L} stroke-width="2.5">${Array.from({ length: 7 }, (_, i) => `<path d="M${-100 + i * 40} ${560 + i * 50}Q800 ${470 + i * 40} ${1700 - i * 40} ${560 + i * 50}" opacity="${0.4 + i * 0.08}"/>`).join('')}
   <path d="M240 600v-80M240 520c-30-10-50-30-50-50M240 520c30-10 50-30 50-50"/></g>`,
  // 13 an abandoned film studio
  `<g class="bd-sweep" style="transform-origin:300px 860px"><path d="M300 860L120 0h300z" fill="currentColor" opacity=".3"/></g>
   <g class="bd-sweep bd-sweep-2" style="transform-origin:1300px 860px"><path d="M1300 860L1180 0h300z" fill="currentColor" opacity=".3"/></g>
   <g ${L} stroke-width="3"><path d="M680 860V640h240v220M640 640h320"/><path d="M700 520l200-60 10 40-200 60zM700 560h200v80H700z"/><path d="M740 460l30 40M800 440l30 40M860 420l30 40"/>
   <path d="M300 860l-40-120h80zM1300 860l-40-120h80z"/></g>`,
  // 14 a clockwork museum
  `<g ${L} stroke-width="3"><g class="bd-spin" style="transform-origin:520px 430px"><circle cx="520" cy="430" r="150"/>${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return `<path d="M${(520 + 150 * Math.cos(a)).toFixed(0)} ${(430 + 150 * Math.sin(a)).toFixed(0)}L${(520 + 180 * Math.cos(a)).toFixed(0)} ${(430 + 180 * Math.sin(a)).toFixed(0)}"/>`; }).join('')}<circle cx="520" cy="430" r="40"/></g>
   <g class="bd-spin-rev" style="transform-origin:790px 560px"><circle cx="790" cy="560" r="100"/>${Array.from({ length: 10 }, (_, i) => { const a = (i * Math.PI) / 5; return `<path d="M${(790 + 100 * Math.cos(a)).toFixed(0)} ${(560 + 100 * Math.sin(a)).toFixed(0)}L${(790 + 124 * Math.cos(a)).toFixed(0)} ${(560 + 124 * Math.sin(a)).toFixed(0)}"/>`; }).join('')}<circle cx="790" cy="560" r="26"/></g>
   <path d="M1100 860V260h240v600M1100 340h240M1220 420v80l50 30"/><circle cx="1220" cy="460" r="70"/><path class="bd-pendulum" d="M1220 600v180" style="transform-origin:1220px 600px"/></g>`,
];

/** Backdrop markup for a WHERE card index, or '' for custom locations. */
export function backdropHtml(index, night) {
  const scene = SCENES[index];
  if (!scene) return '';
  return `<div class="backdrop bd-${index} ${night ? 'is-night' : ''}" data-key="bd-${index}" aria-hidden="true"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${scene}</svg></div>`;
}
