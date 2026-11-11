# Dead Set — Redacted Press · Design Layout Laboratory

This branch was created directly from `claude/serene-franklin-v9ujky`, not from Black Ledger or Gothic Press. It is isolated; no changes were made to the source branch or main.

## Creative correction

The earlier treatments were overly clean and corporate, or used generic occult imagery that felt like a casino. The new visual language is a grim, underground murder-mystery broadsheet, referencing expressive editorial letterforms, two-colour printing, archival engraved illustration, imperfect print registration and aggressive red/black contrasts. Ornament supports the story and game events rather than covering every control.

## Layout studies: created as separate standalone HTML/CSS tests

**A — Redacted Poster (selected).** A vermilion printed cover takes 59% of the desktop width, with a large masthead, anonymous witness illustration, index marks and a compact black invitation/entry area. On phones, the poster is stacked before the interactive panel.

**B — Forbidden Broadsheet.** A light paper cover with high-contrast masthead, dead-flower engraving and a dark secondary panel. Useful for the Gazette and role-card material language.

**C — Night Codex.** Black-on-black gothic print with engraved figure, arch framing, and a parchment interactive panel. Retained as an exploratory alternate.

These studies are snapshots supplied with the design review as HTML and PNG previews. They are not presented as working multiplayer screenshots.

## Implementation

- `public/redacted-press.css`: one stylesheet after the original `styles.css`, not a stack of experimental overrides
- `public/press-witness.svg`: original anonymous witness illustration, constructed as vector paths with engraving/hatchwork
- `public/press-rule.svg`: printer's ornament
- `public/press-cardback.svg`: original card-back engraving for flip cards
- `public/app.js`: only the homepage template has been rearranged. Existing host/join data attributes, room-code logic, translation lookups, moderation setting, tutorial toggle, and primary action are unchanged.
- `public/index.html`: activates the stylesheet and one headline-only font. Instrument Serif, Instrument Sans, and JetBrains Mono are retained for all main app typography.

The logo uses the existing Dead Set lettering with a restrained red cancellation stroke. It is an interim typographic treatment, not a claim that a final custom wordmark has been approved.

## QA / review

- Three layout studies rendered in Chromium at desktop and mobile sizes.
- Browser layout checks at 320, 390, 768, 1024, and 1440 px: no document-level horizontal overflow; action controls retain at least 50 px height in the tests.
- Modified application JavaScript parsed successfully when ECMAScript import declarations were stripped for syntax validation.
- The actual multiplayer application was not run in the layout environment. Those render tests do not verify role secrecy, server behavior, long translated strings or all gameplay states.
- Before merging: verify actual application home, join, lobby, role reveal, Classic rounds, Missions, Exorcism, TV board, reduced motion, focus and keyboard, small phones, and localization across all supported languages.

No third-party reference artwork or proprietary fonts were added to this branch. The illustration and ornament SVGs are original work, using only the broad visual language of the supplied references.
