# Stores

[Back to README](../README.md)

All state management uses **Pinia** with the Composition API pattern (`defineStore` with a setup function). Stores are located in `src/stores/` and re-exported from `src/stores/index.ts`.

---

## Horse Store (`horse.store.ts`)

Manages the pool of horses available for racing.

### State

| Name          | Type      | Description                                                                   |
| ------------- | --------- | ----------------------------------------------------------------------------- |
| `horses`      | `Horse[]` | Currently generated horses. Initialised with a default set before generation. |
| `isGenerated` | `boolean` | Whether `generate()` has been called at least once.                           |

### Getters

| Name        | Returns                              | Description                                                              |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------ |
| `horseById` | `(id: number) => Horse \| undefined` | Finds a horse by its ID. Used heavily by the race and simulation stores. |
| `count`     | `number`                             | Number of horses currently in the pool.                                  |

### Actions

#### `generate()`

Builds a fresh horse list for a new programme.

1. Picks a random count between 1 and 20 (inclusive) using `randomInt()`.
2. Shuffles the full `HORSE_POOL` (20 entries) and takes the first `count` entries.
3. Assigns each horse a random `conditionValue` (0-100) and derives the `condition` label.
4. Sets `isGenerated = true`.

```
HORSE_POOL (20 fixed entries)
  -> shuffle
  -> slice(0, randomCount)
  -> map: assign conditionValue + condition label
  -> horses.value
```

### Condition Mapping

The numeric `conditionValue` (0-100) maps to a label:

| Range  | Label     | Colour    |
| ------ | --------- | --------- |
| 80-100 | Excellent | `#34B670` |
| 60-79  | Good      | `#7ed957` |
| 40-59  | Fair      | `#f0c040` |
| 20-39  | Average   | `#f08c3a` |
| 0-19   | Poor      | `#ef4136` |

---

## Race Store (`race.store.ts`)

Manages the 6-race programme, track progress, and finish positions.

### State

| Name               | Type     | Description                         |
| ------------------ | -------- | ----------------------------------- |
| `races`            | `Race[]` | The full 6-race programme.          |
| `currentRaceIndex` | `number` | Index of the currently active race. |

### Getters

| Name               | Returns        | Description                        |
| ------------------ | -------------- | ---------------------------------- |
| `currentRace`      | `Race \| null` | The race at `currentRaceIndex`.    |
| `programmedRaces`  | `Race[]`       | Races with status `'programmed'`.  |
| `completedRaces`   | `Race[]`       | Races with status `'completed'`.   |
| `allRacesComplete` | `boolean`      | True when every race has finished. |

### Actions

#### `generateProgram()`

Creates the 6-race programme from the current horse list.

1. Iterates over `RACE_CONFIGS` (6 entries with name, lap, distance).
2. For each race: shuffles all horses, takes up to `MAX_HORSES_PER_RACE` (10), assigns lane numbers starting from 1.
3. All races start with status `'programmed'` and `trackProgress: 0` for every entry.
4. Resets `currentRaceIndex` to 0.

#### `updateProgress(raceId, horseId, progress)`

Sets a horse's `trackProgress` (clamped 0-100) in the current race. Uses an internal `Map<number, RaceEntry>` for O(1) lookup. Called every simulation tick.

#### `assignFinishPosition(raceId, horseId)`

Records the order in which horses cross the finish line. Uses a per-race counter: the first horse to reach 100% gets position 1, the second gets 2, and so on. A horse that already has a position is skipped.

#### `completeCurrentRace()`

Marks the current race as `'completed'` and advances `currentRaceIndex` to the next race.

#### `reset()`

Clears all races and resets the index.

### Race Configuration

Defined in `src/constants/races.ts`:

| Race   | Lap     | Distance |
| ------ | ------- | -------- |
| Race 1 | 1st Lap | 1200m    |
| Race 2 | 2nd Lap | 1400m    |
| Race 3 | 3rd Lap | 1600m    |
| Race 4 | 4th Lap | 1800m    |
| Race 5 | 5th Lap | 2000m    |
| Race 6 | 6th Lap | 2400m    |

---

## Simulation Store (`simulation.store.ts`)

Orchestrates the race timing loop and horse movement calculations.

### Constants

| Name              | Value  | Purpose                                 |
| ----------------- | ------ | --------------------------------------- |
| `TICK_MS`         | `50`   | Interval between ticks (20 fps).        |
| `MIN_SPEED`       | `0.15` | Slowest possible progress per tick.     |
| `MAX_SPEED`       | `0.4`  | Fastest possible progress per tick.     |
| `VARIANCE_FACTOR` | `0.3`  | Randomness multiplier for speed jitter. |

### State

| Name             | Type               | Description                                                         |
| ---------------- | ------------------ | ------------------------------------------------------------------- |
| `status`         | `SimulationStatus` | Current state: `idle`, `counting`, `running`, `paused`, `finished`. |
| `countdown`      | `number`           | Current countdown value (3, 2, 1, 0). Shown as overlay.             |
| `isBetweenRaces` | `boolean`          | True when showing the between-race podium overlay.                  |

### Status Transitions

```
idle ──> counting ──> running ──> paused
  ^                     |           |
  |                     v           |
  |                  running <──────┘
  |                     |
  |                     v
  |              (race complete)
  |                     |
  |          ┌──────────┴──────────┐
  |          v                     v
  |   isBetweenRaces          finished
  |     (next race)          (all done)
  |          |
  └──────────┘
```

### Actions

#### `startPause()`

Toggles the simulation based on current status:

- **idle / paused (between races)**: Starts a 3-2-1 countdown, then begins the tick loop.
- **running**: Pauses the tick loop.
- **paused**: Resumes the tick loop immediately (no countdown).
- **counting**: Cancels the countdown, returns to idle.

#### `_tick()` (internal)

The core loop, called every `TICK_MS`:

1. Gets the current race from the race store.
2. For each entry that hasn't finished:
   - Looks up the horse's `conditionValue`.
   - Computes speed via `_computeSpeed()`.
   - Updates `trackProgress`.
   - If progress reaches 100%, assigns a finish position.
3. When all entries have finished:
   - Completes the current race.
   - If more races remain: sets `isBetweenRaces = true`, pauses.
   - If all races done: sets `status = 'finished'`.

#### `_computeSpeed(conditionValue)` (internal)

See [Simulation & Scoring](simulation.md) for the full formula.

#### `reset()`

Stops the interval, resets all state to initial values.
