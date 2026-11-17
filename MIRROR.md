# Dead Set: The Mirror — rules

**Status: Beta 9, built 2026-11-17** (from design/TWELVE-MODES-SPEC.md §5). Family: *Reading the Room*.

A haunted mirror does not show your reflection: it shows what your friends think you will do. Win by reading people, not by finding a culprit.

## Rules

- **4–12 players**, everyone for themself. **Eight dilemmas**, drawn from the bank without repeats, avoiding the ones this table saw most recently.
- Each dilemma has **exactly three** plausible answers (A, B, C) and no right one.
- **Who reads whom:** with seats `0..n−1` and round `r` (from 0), seat `i` reads seat `(i + 1 + (r mod (n−1))) mod n`. Nobody reads themself, everyone is read by exactly one player, and over `n − 1` rounds everyone reads everyone.
- **Each round:**
  1. **Talk it over** (75 s; 45/75/120 in the lobby timers): the dilemma and the pairings are public. Ask, tease, mislead.
  2. **The sealed ballot** (30 s): your own answer *and* your prediction of your target's, both required, changeable until everyone is in.
  3. **The reveal** (12 s): every answer and every reading. A right prediction scores **2**; your own answer scores nothing.
- **Timeouts:** a missing ballot becomes a random A/B/C answer, labelled as a timeout, and an abstaining prediction. The player reading them is still scored against it.
- **The end:** the most points wins; ties share the victory.

## The dilemma bank (expandable)

`public/dilemmas.js` holds the bank: **80 dilemmas** in the `core` pack, in English. The server deals from it and every phone reads it.

To add dilemmas:
1. Append entries to `DILEMMAS` with a **new, stable id** (`d081`, `d082`…; never reuse or renumber an id) and a `pack` (`core`, or a new pack name).
2. Add the same id to `dilemmas` in every `public/i18n/<lang>.content.js` as `[prompt, A, B, C]`.
3. `npm test` fails until every language covers every id, with three distinct answers.

A new pack name shows up in the lobby as a *Dilemma packs* choice as soon as it exists; the host picks which packs the eight are drawn from. Keep dilemmas fictional, short, and free of real sensitive topics.

## Screens

- **Phones:** the dilemma card and who you read, face to face in the glass; then two rows of answers (*You would…* and *{name} would…*) and *Seal my ballot*; the reveal lists every reader, their answer and their reading, right or wrong.
- **TV:** the dilemma with answer counts at the reveal, the table with an arrow for every reading (green right, red dashed wrong), answer letters on the seats, and the readers' ledger.
- **End:** the best readers, how often each player was read right, and the table's most common answer to every dilemma.

## Bots

Practice bots answer and predict at random from their own view.
