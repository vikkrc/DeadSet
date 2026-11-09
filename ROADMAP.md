# Dead Set roadmap

Agreed plan. Nothing here is built yet unless marked done. **The roadmap is subject to change.**

## Beta 1: Missions, part 2

- **Side Missions** (lobby switch). Every player is dealt one secret personal objective at random when the game starts, from a large pool. Examples:
  - "Go on three missions."
  - "Never approve a team you're not on."
  - "Hold the Candle once."

  You learn the moment you've succeeded or failed. The result changes the weight of your vote in the Last Stand: more if you succeeded, less if you failed. Each one must be judged automatically from what the game records. They need checking for balance, so that Death players' Side Missions don't leak their side.
- **Hungarian:** rename *Last Stand* to **Utolsó Esély** everywhere.
- **Twins** (lobby switch): two Living players who know each other. Check the core logic and the balance with Twins on, with bot simulations at every table size.
- **Up to 12 players:**
  - Death counts and team sizes for 11 and 12 players.
  - New roles that fit the logic (ideas: the Undertaker, and a Missions Jester).
  - Simulate the balance before shipping.

## Beta 2: Dead Set: Carnival (inspired by Mascarade)
Iterate on the full game loop, rules, logic and mechanics first, then implement and test.

## Beta 3: Dead Set: Lifeboat
Still rough at the pitch stage and needs a lot of design work first: crisis cards, secret contributions, the overboard vote, ghost clues, and private goals that make selfish play ambiguous. Then implement and test.

## Beta 4: Dead Set: Séance
Iterate on the rules first. It needs many more WHO / WHERE / WHY cards to avoid repetition. That also affects the other modes (story intros, backdrops, translations), so plan for a bigger content pass. Then implement and test.

## Beta 5: Dead Set: Doppelgänger (a cousin of Spyfall)
Everyone sees the same WHERE card and a personal role there; the Doppelgänger sees only static and must blend in. Develop the game loop, logic and rules, and **spice it up** beyond the base pitch. Then build the mode. It benefits from Beta 4's bigger WHERE pool.

## Beta 6: Dead Set: Exorcism (based on Chameleon)
- **Story:** the Living must pass round the secret word of the exorcism (the password) that would banish the Death among them. They then try to catch Death. If caught, Death gets one last chance to guess the password, and wins if it does.
- **Phones:** a mechanism similar to Doppelgänger.
- **Word grid (setup switch):** an optional 4×4 grid of words in the topic, shown on the TV and openable on every phone.
- **Categories:** several, each switchable in setup, with many words each.
- **Language:** the lobby language is **forced on all players** in this mode, because everyone must see the same words.
- **Between rounds:** the end of a round brings everyone back to the same lobby with the same settings, so they can jump straight into a new round.
- Design the logic and mechanics first, then build.

## Beta 7: Dead Set: Midnight (a cousin of One Night Ultimate Werewolf)
Develop the rules, logic and mechanics, then build the game.

## Beta 8: Dead Set: Council (a cousin of Secret Hitler)
Develop the rules, logic and mechanics. This needs **thorough thinking**, because it is a very involved mode: elections, the decree deck, Death's unlockable powers, and the blame dynamics. Then build the game.

## Beta 9: Dead Set: Coffins (a cousin of Skull)
Develop the rules, logic and mechanics, then build the game.

## Beta 10: the big final update before version 1.0
Build one of the big modes left out so far (e.g. Whitechapel, Hollow Manor, Lifeboat if not done, The Wake, Contagion, The Inquest), or something new worthy of the last big update before the first full version.

## Pitched and parked
- The Wake (two rooms, 8–25 players)
- Last Words (a word game with a hidden twist)
- Sketches (a cousin of A Fake Artist Goes to New York): one stroke each on a shared drawing; the Forger doesn't know the word
- Contagion (infection passed through secret card trades)
- The Inquest (a cousin of Deception: Murder in Hong Kong): the Coroner gives clues only through scene tiles
- Whitechapel (hidden movement: the Ripper on a location map)
- Hollow Manor (a cousin of Betrayal at House on the Hill): explore, then the house turns one of you
