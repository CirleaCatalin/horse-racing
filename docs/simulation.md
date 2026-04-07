# Simulation & Scoring

[Back to README](../README.md)

This document explains how races run, how horse speed is calculated, and how winners are determined.

---

## Race Lifecycle

Each race goes through these phases:

### 1. Countdown (3-2-1-GO)

When the user clicks **Start**, a countdown begins:

- `3` is shown for 1 second
- `2` is shown for 1 second
- `1` is shown for 1 second
- `GO!` flashes briefly, then the race starts

The user can cancel during the countdown (returns to idle).

### 2. Running

A `setInterval` fires `_tick()` every **50 ms** (20 updates per second). Each tick:

1. Iterates over every entry in the current race.
2. Skips horses that already have a `finishPosition`.
3. Computes a speed value for the horse.
4. Adds that speed to the horse's `trackProgress` (clamped at 100).
5. If a horse reaches 100%, it is assigned the next finish position.

### 3. Race Complete

When every entry has a `finishPosition`:

- The race status changes to `'completed'`.
- If more races remain, the simulation pauses and shows a between-race podium overlay.
- If it was the last race, the simulation status becomes `'finished'`.

### 4. Between Races

The podium overlay displays the top 3 finishers. The user clicks **Start** again to begin the next race (with a fresh countdown).

---

## Speed Formula

Each tick, a horse's speed is calculated as:

```
base = MIN_SPEED + (conditionValue / 100) * (MAX_SPEED - MIN_SPEED)
variance = (random(-1, 1)) * VARIANCE_FACTOR * base
speed = max(0.01, base + variance)
```

Where:

- `MIN_SPEED = 0.15` — progress per tick for the worst possible horse
- `MAX_SPEED = 0.4` — progress per tick for the best possible horse
- `VARIANCE_FACTOR = 0.3` — controls how much randomness affects each tick
- `conditionValue` — the horse's condition rating (0-100)

### What This Means in Practice

| Condition | conditionValue | Base Speed   | Approx. Race Time |
| --------- | -------------- | ------------ | ----------------- |
| Excellent | 90             | 0.375 / tick | ~13 seconds       |
| Good      | 70             | 0.325 / tick | ~15 seconds       |
| Fair      | 50             | 0.275 / tick | ~18 seconds       |
| Average   | 30             | 0.225 / tick | ~22 seconds       |
| Poor      | 10             | 0.175 / tick | ~29 seconds       |

_Times are approximate because variance adds randomness to every tick._

### Why Variance Matters

The `VARIANCE_FACTOR` of 0.3 means each tick's speed can deviate up to 30% from the base. This creates realistic racing dynamics:

- A horse with condition 50 might occasionally sprint faster than a horse with condition 70.
- No race outcome is fully predetermined; higher condition only improves the odds.
- Leads can change throughout the race, making it exciting to watch.

The `max(0.01, ...)` floor prevents a horse from ever standing still due to extreme negative variance.

---

## How Winners Are Determined

Winners are determined by **arrival order**, not by raw speed or condition.

### Finish Position Assignment

```
For each tick:
  For each horse in the race:
    Update trackProgress += speed
    If trackProgress >= 100 AND no finishPosition yet:
      finishPosition = next available position (1, 2, 3, ...)
```

Key rules:

- The **first horse** to reach `trackProgress >= 100` gets position **1** (winner).
- The **second horse** gets position **2**, and so on.
- If two horses reach 100% in the same tick, the one processed first in the entry array gets the lower position. Since entries are shuffled at programme generation, this is effectively random for simultaneous finishers.
- Once a position is assigned, it is final and cannot change.

### Podium Display

After a race completes, the top 3 are highlighted:

- **1st place** — gold medal, gold lane highlight
- **2nd place** — silver medal, silver lane highlight
- **3rd place** — bronze medal, bronze lane highlight

---

## Simulation Parameters Summary

| Parameter             | Value         | Location              |
| --------------------- | ------------- | --------------------- |
| Tick interval         | 50 ms         | `simulation.store.ts` |
| Min speed             | 0.15 / tick   | `simulation.store.ts` |
| Max speed             | 0.4 / tick    | `simulation.store.ts` |
| Variance factor       | 0.3           | `simulation.store.ts` |
| Max horses per race   | 10            | `constants/races.ts`  |
| Horse pool size       | 20            | `constants/horses.ts` |
| Generated horse count | 1-20 (random) | `horse.store.ts`      |
| Condition range       | 0-100         | `horse.store.ts`      |
| Number of races       | 6             | `constants/races.ts`  |
| Track progress range  | 0-100%        | `race.store.ts`       |
