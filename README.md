# Gukga (국가, "The Nation")

**A card-decision game where presidents come and go, and the country remembers.**

> A president lasts eight years at most. The nation remains.

You play a sequence of presidents of a fictional republic. Each one gets eight
binary decisions per term. Your decisions become the next president's
situation, and how six factions *remember* each president shapes the cards
your successors are dealt. The game ends with a history-textbook paragraph
about the country you built.

Single `index.html` with no build step and no dependencies. The UI is in Korean.

## Why I built it

Swipe-style decision games (Reigns-like) usually reset when the ruler dies.
I wanted the opposite: **consequences that outlive the decision-maker**. The
design question was how to make long-term, hard-to-see effects visible and
felt in a game that only ever asks "left or right?"

The three principles from the design doc:

1. **The protagonist is the nation.** Presidents pass; infrastructure and
   memory remain.
2. **Hero and villain are the same person.** One decision is remembered as
   rescue by one faction and as betrayal by another.
3. **The past is not over.** A predecessor's decisions come back as bills, and
   memories of them come back as pressure.

## Design

The state lives in three layers:

| Layer | What | When the president changes |
|---|---|---|
| Nation | 4 indicators (public opinion, economy, international trust, corruption), development stage, infrastructure, flags | carries over; *how* power changed hands triggers events |
| Attitude | how 6 factions see the *current* president | resets to "watching" |
| Memory | how each faction remembers *each past* president | kept per president; fades (×0.8), and later events can rewrite it |

Design choices I'd point to:

- **Constraints in the card, outcomes from the state.** Each card explains why
  there are only two options. The same choice resolves differently depending on
  the country's condition.
- **Hidden information as a mechanic.** Factions show a mood word and a
  headline, not a number. Above 60 corruption, the economy reading itself
  becomes noisy (±10). You govern with less and less reliable data.
- **Legacy rules.** Four rules (succession pressure, recall, re-evaluation,
  fading) let a past president's memory change the next president's cards.
  The faction mood at the moment of the farewell press interview is frozen as
  that president's memory value.
- **No death at the extremes.** v3 replaced "an indicator hit 0, you died" with
  collapse at the bottom and *imbalance crises* at the top. The pressure comes
  from trade-offs instead of a single meter.

## Testing the balance

`tools/sim.js` loads the game script headlessly and auto-plays N games with
random or policy-driven choices. It reports errors, how terms ended, title
combinations and card frequency.

```sh
node tools/sim.js 3000
```

3,000 random games run with 0 errors and produce 200+ distinct title
combinations. The simulator also surfaced the main known imbalance: random play
ends in **"captured state" (corruption 100)** far too often, because more cards
raise corruption than lower it. That is the next tuning target.

## Run it

Open `index.html` in a browser (← → keys also work).

## Files

```text
index.html            the game (validation build: 3 presidents, 8 decisions per term)
docs/scenario_v3.md   full design document v3 (Korean)
tools/sim.js          headless auto-play balance checker
README_KO.md          original Korean README with the card list and spec deviations
```

## How this was built

I wrote the game design (`docs/scenario_v3.md`). The implementation was built
with an AI coding assistant from that design.
