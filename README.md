# Dead Set

A multiplayer social-deduction party game played on everyone's own phone. One authoritative server deals hidden roles, draws Dreams, collects secret night actions and votes, and resolves everything deterministically. Nobody has to be the narrator.

**→ Rules and modes: [GUIDE.md](GUIDE.md)** (also in the app at `/guide`)

**→ The modes**, grouped as in the lobby:

| Family | Mode | Players | Rules |
|---|---|---|---|
| Hidden Allegiances | Classic Dead Set | 5–25 | [GUIDE.md](GUIDE.md) |
| | Dead Set: Missions | 5–12 | [MISSIONS.md](MISSIONS.md) |
| Changing Hands | Dead Set: Carnival | 4–12 | [CARNIVAL.md](CARNIVAL.md) |
| | Dead Set: Midnight | 4–12 | [MIDNIGHT.md](MIDNIGHT.md) |
| Reading the Room | Dead Set: The Omen | 4–12 | [OMEN.md](OMEN.md) |
| | Dead Set: The Mirror | 4–12 | [MIRROR.md](MIRROR.md) |
| Signs & Riddles | Dead Set: Exorcism | 3–12 | [EXORCISM.md](EXORCISM.md) |
| | Dead Set: Séance | 4–10 | [SEANCE.md](SEANCE.md) |
| | Dead Set: Graverobbers | 4–12 | [GRAVEROBBERS.md](GRAVEROBBERS.md) |
| | Dead Set: Mimic | 4–12 | [MIMIC.md](MIMIC.md) |
| Bluff & Wager | Dead Set: Coffins | 3–10 | [COFFINS.md](COFFINS.md) |

What comes next: [ROADMAP.md](ROADMAP.md).

## Run it

Requires Node.js 18+. There are **no dependencies** to install.

```bash
npm start            # http://localhost:3000
PORT=8080 npm start  # another port
npm test             # rules-engine + server tests (spec §27 acceptance scenarios)
```

Players on the same Wi-Fi join at `http://<your-computer's-LAN-IP>:3000`, either by scanning the QR code in the lobby or by typing the six-character room code. For players in different places, deploy it anywhere that runs Node and keeps the connection open (Server-Sent Events).

Environment:

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `HOST` | `0.0.0.0` | Bind address |
| `DEADSET_DATA` | `data/rooms.json` | Where rooms are saved so a restart doesn't lose games. Set it to empty to disable. |

## How it is built

```
engine/            pure rules engine: plain JSON state in, plain JSON state out
  content.js       roles, Dreams, Rule cards, scenarios, mode presets (the canon)
  setup.js         scaling table, deck building, settings validation
  game.js          phase machine and command handling
  night.js         night resolver, in the fixed order R0–R9
  missions.js      Dead Set: Missions — proposals, team votes, sabotage, mission cards, Candle, Last Stand, Reckoning
  day.js           ballot weights and tally (plurality / Majority Rule / ghosts)
  victory.js       win check (strict majority, Jester, Lovers, Cult, Ripper, draw)
  views.js         per-audience views: public, player, Death team, moderator
  rng.js           crypto RNG in production; seeded/scripted RNG in tests
server/
  rooms.js         rooms, session tokens (hashed), recovery codes, timers,
                   idempotency, host hand-over, persistence, broadcasting
  index.js         zero-dependency HTTP server + SSE streams + static files
  bots.js          practice bots: act from their own player view, never chat
public/            vanilla-JS phone-first client (no build step)
test/              node:test suites
```

**Testing alone:** in the lobby, the host taps the room code five times to open a hidden *Practice bots* panel that fills the table with bots (see [GUIDE.md](GUIDE.md#9d-practice-bots-secret-test-mode)).

**Security model:**
- The six-character room code only *finds* a room. Each phone holds a high-entropy session token, and the server stores only its hash.
- Every view is built per audience on the server. Nobody's browser ever receives another player's role, Dream or ballot, and that includes the host's.
- All randomness is server-side.
- Commands are checked against the current phase id, so late or replayed taps are rejected. A ballot is replaced in place; it never counts twice.

**Interface:** the *Codex* identity, an illuminated manuscript by candlelight: vellum cards with pencil-drawn emblems on near-black ink, gilt ornament and one rubric red, Grenze Gotisch blackletter for titles and EB Garamond for text (both self-hosted). The palette cools to night blue at night, and each mode has its own mood. The source of truth for the look is [design/codex/DESIGN-GUIDE.md](design/codex/DESIGN-GUIDE.md); the consistency rules across modes are in [design/deadset-consistency/CONSISTENCY-PASS.md](design/deadset-consistency/CONSISTENCY-PASS.md).
- Players sit around a **table ring**, and tapping a seat is how you target anyone.
- Public events play as short **cinematic moments**: nightfall, dawn, the vote tally and the verdict.
- **Seven languages** (en, hu, sk, cs, de, fr, es). Each player picks their own; the host sets the table default. UI strings are keyed by their English text (`public/i18n.js`, dictionaries in `public/i18n/`), and the server sends events as `[template, params]` so every phone renders them in its own language. `node scripts/i18n-keys.mjs <lang>` lists missing strings, and `node scripts/i18n-check.mjs` checks placeholders. On localhost (or with `?i18n=debug`) the browser console also warns about any string a dictionary lacks.
- **Tables of 5–25.** `public/layout.js` places seats on one ring up to 14 and on two staggered rings above that, shared by phones and the TV board.
- **Generated score** (`public/fx.js`): each phase has its own mood built from a pad, wind, improvised music-box or bell motifs, plucked ostinatos, a choir, a heartbeat and swells, plus a tension layer for the last few players.
- There are **synthesized sounds** (no audio files), haptics and canvas particles. They are limited to public events, so nothing leaks a secret.
- A tiny DOM-morphing renderer (`public/app.js`) keeps elements alive between updates, so transitions animate.
- Effects and the generated TV score live in `public/fx.js`; the TV board is `public/board.js`; the Gazette is `public/gazette.js`.
- The Missions screens, moments and TV pieces are `public/missions.js`.
- Portraits are `public/avatar.js` (vector parts), the Traveling Agent's gift scenes are `public/gifts.js`, and the TV's location backdrops are `public/backdrops.js`.
- Concept mockups are in `design/`.
- It respects reduced motion and uses 44px+ touch targets.
