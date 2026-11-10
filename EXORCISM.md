# Dead Set: Exorcism — rules and game spec

A word game of bluff for **3–12 players**, chosen in the lobby next to Classic and Missions. One phone each, plus an optional TV board.

## 1. Sides

| Side | Sees | Wins when |
|---|---|---|
| **The Living** | The category **and the password** in their crystal ball | The table names a Demon **and** that Demon misses the password |
| **The Demon** (one; or two from 7 players) | Only the category (and, if the host allows, a vague hint) | The table names someone else, **or** the caught Demon names the password |

## 2. A round

1. **The crystal ball.** One reveal, on each phone: the ball clouds for a breath, then clears by itself. The Living see their password write itself letter by letter inside a slowly turning ring of runes; the Demon sees a sigil draw itself and *You are the Demon* flicker in like embers. Both balls glow in the same colour, so a phone's light gives nobody away. The category always shows, to everyone. Tapping the ball clouds it again (and back), smoothly both ways, without anything on screen moving. After a few seconds **I have seen it** fades in. The TV shows the category only. During the turns a smaller ball stays on each phone: tap it to look again.
2. **The lots.** The same lottery wheel as Missions picks who speaks first. The timers only start after it.
3. **One word each.** As each speaker confirms, a pill with their portrait (and their word, if typed) appears on the ball's edge, on phones and the TV. In seat order from the first speaker, each player says one word linked to the password, then **holds the button** on their phone to confirm. The TV and phones show whose turn it is. A speaker who runs out of time is skipped. Optionally the word is typed too and shown on the TV.
4. **Talk it over.** The ball turns gold. What was said floats on its edge, on phones and the TV: the typed words, or (when words are only spoken) the portraits of everyone who has spoken (dimmed if their time ran out). Everyone taps **Ready to vote** (or the timer runs out).
5. **Name the Demon.** The ball becomes the table: portraits sit around it, and it turns red, its mist churning faster. Tap it to look inside again. Everyone votes for one other player. The most votes is named. A tie lets the Demon escape (or, with the coin option, a coin decides). Naming a Living player, or nobody, means **the Demon wins**.
6. **One last guess.** A caught Demon gets one guess at the password: tap a word in the 4×4 grid, or type it when the grid is off (accents and case never matter; one typo is forgiven in words of five letters or more). Right, and the Demon still wins; wrong, and the Living win.
7. **The end.** The ball, holding the password, sits at the heart of the revealed table. The password, the Demon(s), the grid, what was said and who named whom are revealed. After 40 seconds (or when the host taps **Play again, same table**, shown right on the end screen), the table returns to **the same lobby with the same settings**, everyone already ready, and the **scores carry on**: Living +1 for a win, Demons +2.

## 3. Setup (lobby)

| Setting | Options (default first) |
|---|---|
| Demons | **One**, two (7+ players) |
| Demons know each other | **Off**, on (two Demons only) |
| The Demon's hint | **None**, number of letters, first letter |
| One last guess | **On**, off (off: a caught Demon simply loses) |
| Tied vote | **The Demon escapes**, a coin decides |
| Word grid | **On** (16 of the category's 20 words; the password is one of them), off |
| Rounds | **1**, 2, 3 |
| Type the words | **Off** (say it aloud), on |
| Categories | **All seventeen** on; switch any off (at least one) |
| Timers | Each speaker 30 s, discussion 90 s, voting 45 s, the Demon's guess 45 s |
| Table language | Forced on every phone in this mode, so the words match |

The lobby shows a short **How Exorcism works** explainer for everyone, and on phones and the TV the ball sits in the middle of the table, counting who is ready.

## 4. Words

Seventeen categories × 20 entries, index-aligned in all seven languages (`engine/words.js`). Everyday: Animals, Food and drink, In the house, Places, Jobs, Nature and weather, Sports and games, Getting around, Things that go bump, Clothes and accessories. Pop culture: Cartoon characters, Famous people, Video games, Video game characters, Movies, Heroes and villains, Famous places. Titles and names use each language's own version (*Az oroszlánkirály*, *Fluch der Karibik*, *Bob l'éponge*…).

**Draw another word.** If too many people don't know the word, the host can hold **Draw another word** in the menu at any time before the vote: the round is dealt afresh (new word, new roles), everyone looks into their ball again, and nothing is scored.

## 5. Interludes and sound

Shared scenes (the lottery, the call to vote, the vote reveal, the last guess) play in sync on every screen and lock inputs while they run (see Beta 0). The ball is a WebGL mist shader with a CSS fallback, and calm under reduced motion.

## 6. Practice bots

Bots acknowledge the ball, speak on their turn (typing a word from the category when typing is on), get ready, vote at random (never for a Demon they know), and a caught Demon bot guesses at random from the grid.
