// The Traveling Agent's gifts arrive as a little scene on the recipient's
// phone: a parcel drops, the lid pops, and the product does its own gag.
// Shown only to the recipient, silently (it's private news).
const S = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';

// One illustration per product, in the order of engine/content.js PRODUCTS.
const ART = [
  // 0 a brass key that fits no lock
  `<g ${S}><circle cx="40" cy="60" r="16"/><circle cx="40" cy="60" r="6"/><path d="M56 60h46M90 60v12M100 60v8"/></g>`,
  // 1 a jar of warm sand
  `<g ${S}><path d="M40 34h40M42 34v6c-6 4-8 8-8 16v32a8 8 0 0 0 8 8h36a8 8 0 0 0 8-8V56c0-8-2-12-8-16v-6"/><path d="M36 66c10-6 18 4 26-2s16-2 22 2" /></g><g class="g-grains" fill="currentColor"><circle cx="52" cy="80" r="2"/><circle cx="62" cy="86" r="2"/><circle cx="72" cy="78" r="2"/><circle cx="58" cy="74" r="1.6"/><circle cx="68" cy="90" r="1.6"/></g>`,
  // 2 a ticket for a train that left yesterday
  `<g class="g-fly" ${S}><path d="M20 40h80v12a8 8 0 0 0 0 16v12H20V68a8 8 0 0 0 0-16z"/><path d="M76 40v40" stroke-dasharray="4 4"/><path d="M32 54h30M32 66h22"/></g>`,
  // 3 a single black feather
  `<g class="g-float" ${S}><path d="M40 96C40 60 60 30 92 22 88 56 70 84 40 96z"/><path d="M40 96L80 36M56 74l-10-6M64 62l-10-8M72 50l-8-8"/></g>`,
  // 4 a pocket watch running backwards
  `<g ${S}><circle cx="60" cy="66" r="30"/><path d="M60 36v-8M54 28h12"/><path d="M60 42v4M60 86v4M36 66h4M80 66h4"/></g><g class="g-hands" ${S}><path d="M60 66V48M60 66l12 8"/></g>`,
  // 5 a sealed letter addressed to you
  `<g class="g-unfold" ${S}><rect x="22" y="36" width="76" height="52" rx="3"/><path d="M22 38l38 28 38-28"/></g><circle cx="60" cy="66" r="7" fill="#b3242d"/>`,
  // 6 a vial of grey perfume
  `<g ${S}><path d="M52 30h16v10l8 8v40a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6V48l8-8z"/><path d="M48 70h24"/></g><g class="g-puff" fill="currentColor" opacity=".5"><circle cx="76" cy="26" r="6"/><circle cx="88" cy="18" r="8"/><circle cx="100" cy="12" r="10"/></g>`,
  // 7 a deck of cards missing the Queen
  `<g class="g-fan" ${S}><rect class="c1" x="42" y="30" width="36" height="52" rx="4"/><rect class="c2" x="42" y="30" width="36" height="52" rx="4"/><rect class="c3" x="42" y="30" width="36" height="52" rx="4"/></g><text x="60" y="64" text-anchor="middle" font-size="18" fill="currentColor" font-family="serif">?</text>`,
  // 8 a candle that smells of rain
  `<g ${S}><rect x="48" y="50" width="24" height="44" rx="2"/><path d="M60 50v-6"/></g><path class="g-flame" d="M60 22c6 8 8 14 0 22-8-8-6-14 0-22z" fill="#e9c27a"/><g class="g-rain" stroke="#8fb4e6" stroke-width="2" stroke-linecap="round"><path d="M30 20l-4 10M90 14l-4 10M100 40l-4 10M22 50l-4 10"/></g>`,
  // 9 a photograph of an empty room
  `<g class="g-develop"><rect x="24" y="28" width="72" height="64" rx="2" fill="#ece5d5"/><rect x="30" y="34" width="60" height="44" fill="#3a332c"/><path d="M30 78l20-18 40 18" fill="#5a5048"/><rect x="62" y="42" width="14" height="18" fill="#8a7d6c"/></g>`,
  // 10 a velvet-lined box (empty)
  `<g ${S}><path d="M26 58h68v32H26z"/><path d="M26 58l8-14h52l8 14"/></g><rect x="32" y="62" width="56" height="22" fill="#7e1820" opacity=".7"/><g class="g-dust" fill="currentColor" opacity=".45"><circle cx="40" cy="44" r="5"/><circle cx="60" cy="38" r="7"/><circle cx="80" cy="44" r="5"/></g>`,
  // 11 a compass that points at you
  `<g ${S}><circle cx="60" cy="62" r="32"/><path d="M60 30v6M60 88v6M28 62h6M86 62h6"/></g><g class="g-needle"><path d="M60 62L54 62 60 30 66 62z" fill="#e2585e"/><path d="M60 62L54 62 60 94 66 62z" fill="currentColor"/></g>`,
];

const QUIP = [
  'It fits no lock you own. Or any lock at all.',
  'Still warm. Nobody knows why.',
  'Too late, as always.',
  'It refuses to land.',
  'Time is going the wrong way.',
  'It is addressed to you. It is blank.',
  'It smells like a rainy funeral.',
  'Fifty-one cards. Somebody has the Queen.',
  'It smells of rain. It will not stay lit.',
  'An empty room. Is it yours?',
  '…It is beautifully empty.',
  'It points at you. It will not stop.',
];

export const productIndex = (products, english) => Math.max(-1, products.indexOf(english));

/** The gift scene. idx = product index (or -1 for an unknown product). */
export function giftHtml(idx, { t, th, product }) {
  const art = ART[idx] ?? ART[10];
  return `<span class="kicker">${t('A visitor in the night')}</span>
    <h1 class="m-title gift-title">${t('A parcel for you!')}</h1>
    <div class="gift-stage g-${idx}">
      <div class="gift-burst" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => { const r = (i / 12) * Math.PI * 2; return `<i style="--x:${Math.round(Math.cos(r) * 110)}px;--y:${Math.round(Math.sin(r) * 90 - 60)}px"></i>`; }).join('')}</div>
      <svg class="gift-item" viewBox="0 0 120 120" aria-hidden="true">${art}</svg>
      <svg class="gift-box" viewBox="0 0 120 120" aria-hidden="true">
        <rect x="18" y="52" width="84" height="56" rx="4" fill="#7a4b2a" stroke="#3a2414" stroke-width="3"/>
        <rect x="54" y="52" width="12" height="56" fill="#b3242d"/>
        <g class="gift-lid"><rect x="12" y="38" width="96" height="16" rx="3" fill="#8f5a34" stroke="#3a2414" stroke-width="3"/><rect x="54" y="38" width="12" height="16" fill="#c33a43"/>
        <path d="M60 38c-10-14-26-12-20-2 4 5 14 3 20 2zM60 38c10-14 26-12 20-2-4 5-14 3-20 2z" fill="#c33a43" stroke="#7e1820" stroke-width="2"/></g>
      </svg>
    </div>
    <p class="m-sub gift-line">${th('A Traveling Agent left you {product}.', { product })}</p>
    <p class="m-sub small gift-quip">${idx >= 0 ? t(QUIP[idx]) : ''}</p>`;
}
