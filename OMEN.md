# Dead Set: The Omen — rules

**Status: Beta 9, built 2026-11-17** (from design/TWELVE-MODES-SPEC.md §2). Family: *Reading the Room*.

An occult wheel points to **Life, Death or Rebirth**. Everyone sees where it starts, but anyone can secretly turn it. Guess where it will stop, counting your own turn and everyone else's.

## Rules

- **4–12 players**, everyone for themself. **Seven rounds.** Everyone starts with **5 Influence** (public).
- The faces sit clockwise: Life → Death → Rebirth → Life. A clockwise turn is +1, anticlockwise −1.
- **Each round:**
  1. **The wheel** shows a random start (8 s; repeats allowed).
  2. **The sealed ballot** (40 s): everyone secretly predicts the finish and chooses a turn: −1, 0 or +1. A turn costs one Influence; with none left only 0 is possible. The ballot can be changed until everyone is in.
  3. **The reveal**: all turns are added up and applied once: `finish = (start + Σ turns) mod 3`. Three clockwise turns bring it back. A right prediction scores **3**. Influence is spent exactly once, from the locked ballot.
- **Timeouts**: no prediction and no turn (never a free guess).
- **The end**: every unused Influence is worth **1 point**. The most points wins; ties share the victory.

## Screens

- **Phones**: the wheel at its start; three face buttons for the prediction; Back one / Leave it / On one, with your Influence; *Seal my omen* (changeable).
- **TV**: the astrolabe wheel, the round, and the seers' ledger with Influence pips; a tick as each ballot is sealed. The reveal turns the needle once by the net total (a shared scene), then the ledger shows every prediction and turn.
- **End**: the final count with each player's Influence bonus, and every turn of the wheel.

## Bots

Practice bots predict at random and turn the wheel now and then while their Influence lasts.
