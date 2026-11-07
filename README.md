# Dead Set

A multiplayer social-deduction party game played on everyone's own phone. One authoritative server deals hidden roles, draws Dreams, collects secret night actions and votes, and resolves everything deterministically. Nobody has to be the narrator.

**→ Rules and modes: [GUIDE.md](GUIDE.md)** (also in the app at `/guide`)

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
  day.js           ballot weights and tally (plurality / Majority Rule / ghosts)
  victory.js       win check (strict majority, Jester, draw)
  views.js         per-audience views: public, player, Death team, moderator
  rng.js           crypto RNG in production; seeded/scripted RNG in tests
server/
  rooms.js         rooms, session tokens (hashed), recovery codes, timers,
                   idempotency, host hand-over, persistence, broadcasting
  index.js         zero-dependency HTTP server + SSE streams + static files
public/            vanilla-JS phone-first client (no build step)
test/              node:test suites
```

**Security model:**
- The six-character room code only *finds* a room. Each phone holds a high-entropy session token, and the server stores only its hash.
- Every view is built per audience on the server. Nobody's browser ever receives another player's role, Dream or ballot, and that includes the host's.
- All randomness is server-side.
- Commands are checked against the current phase id, so late or replayed taps are rejected. A ballot is replaced in place; it never counts twice.

**Interface:** a "mourning stationery" identity: soot paper, bone ink, one oxblood accent, Instrument Serif and Instrument Sans. The whole palette cools to ink-blue at night. Dead names are struck through in the ledger, timers burn down as a fuse, and the role and Dream glyphs are hand-drawn SVG. It respects reduced motion, uses 44px+ touch targets, and the card tilt only applies on devices with a fine pointer.
