# Testing

[Back to README](../README.md)

The project uses **Vitest** as its test framework with **Vue Test Utils** for component testing. Tests live alongside the code they test in `__tests__/` directories.

---

## Setup

### Configuration (`vite.config.ts`)

```ts
test: {
  globals: true,          // describe, it, expect available without imports
  environment: 'jsdom',   // DOM simulation for component tests
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov'],
    thresholds: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}
```

### Running Tests

```bash
npm test               # Single run, all tests
npm run test:watch     # Watch mode (re-runs on file changes)
npm run test:coverage  # Run with coverage report
```

---

## Test File Locations

```
src/
  utils/__tests__/
    random.test.ts                 # shuffle, randomInt, randomFloat
    sprite.test.ts                 # Sprite constants and aspect ratio
    horse-names.test.ts            # Random name generation
  data/__tests__/
    horses.test.ts                 # conditionFromValue, CONDITION_COLOR
  composables/__tests__/
    useExpandedSet.test.ts         # Toggle/clear reactive Set
    useContainerSize.test.ts       # ResizeObserver lifecycle
  stores/__tests__/
    horse.store.test.ts            # Random roster init, lookup
    race.store.test.ts             # Programme, progress, positions
    simulation.store.test.ts       # Tick loop, speed, state transitions
  components/
    atoms/__tests__/
      BaseButton.test.ts           # Props, variants, click events
      HorseSprite.test.ts          # Animation setup, finished state
    molecules/__tests__/
      ConditionMeter.test.ts       # Value display, colour, tick marks
      HorseDetailView.test.ts      # Horse data rendering, back event
      HorsePreview.test.ts         # Static sprite rendering
      HorseRow.test.ts             # List item rendering, select event
      ProgrammeTab.test.ts         # Race list, LIVE badge, toggle
      RaceCard.test.ts             # Expand/collapse, badges
      ResultsTab.test.ts           # Finish positions, medals
    organisms/__tests__/
      AppHeader.test.ts            # Button states, events
```

---

## Testing Patterns

### Store Tests

Store tests use a fresh Pinia instance per test to ensure isolation:

```ts
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

it('initialises with all 20 horses', () => {
  const store = useHorseStore()
  expect(store.horses).toHaveLength(20)
})
```

### Component Tests

Components are mounted with Vue Test Utils. Props and events are tested:

```ts
import { mount } from '@vue/test-utils'

it('renders horse name', () => {
  const wrapper = mount(HorseRow, {
    props: { horse: mockHorse },
  })
  expect(wrapper.text()).toContain('Thunder Bolt')
})

it('emits select on click', async () => {
  const wrapper = mount(HorseRow, {
    props: { horse: mockHorse },
  })
  await wrapper.trigger('click')
  expect(wrapper.emitted('select')).toBeTruthy()
})
```

### Components with Stores

Components that depend on stores need Pinia set up before mounting:

```ts
beforeEach(() => {
  setActivePinia(createPinia())
})

it('renders races from store', () => {
  const raceStore = useRaceStore()
  // Horses are auto-initialised — just generate the programme
  raceStore.generateProgram()

  const wrapper = mount(ProgrammeTab, {
    props: { expanded: new Set<number>() },
  })
  expect(wrapper.findAll('.race-card')).toHaveLength(raceStore.races.length)
})
```

### Utility Tests

Pure functions are tested with simple input/output assertions:

```ts
it('randomInt returns values in range [min, max]', () => {
  for (let i = 0; i < 200; i++) {
    const val = randomInt(5, 10)
    expect(val).toBeGreaterThanOrEqual(5)
    expect(val).toBeLessThanOrEqual(10)
  }
})

it('shuffle does not mutate the original array', () => {
  const original = [1, 2, 3, 4, 5]
  const copy = [...original]
  shuffle(original)
  expect(original).toEqual(copy)
})
```

### Composable Tests

Composables are tested by creating a minimal Vue component context:

```ts
it('tracks expanded state with toggle', () => {
  const { expanded, toggle } = useExpandedSet()
  expect(expanded.value.has(1)).toBe(false)

  toggle(1)
  expect(expanded.value.has(1)).toBe(true)

  toggle(1)
  expect(expanded.value.has(1)).toBe(false)
})
```

---

## Coverage

### Thresholds

All four metrics must be at or above **80%**:

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 80%       |
| Branches   | 80%       |
| Functions  | 80%       |
| Lines      | 80%       |

The build will **fail** if any threshold is not met.

### Coverage Exclusions

The following are excluded from coverage calculations:

- `node_modules/`
- `dist/`
- `**/*.d.ts` (type declaration files)
- `**/__tests__/**` (test files themselves)
- `**/*.test.ts`
- `**/*.config.*` (config files)
- `**/*.css` (stylesheets)
- `src/main.ts` (bootstrap file)

### Generating Reports

```bash
npm run test:coverage
```

This produces:

- **Terminal output**: Summary table with per-file breakdown.
- **`coverage/` directory**: Contains an `lcov` report for CI integration and HTML report for local browsing.

The `coverage/` directory is git-ignored.

---

## E2E Testing (Playwright)

The project uses **Playwright** for end-to-end testing, verifying the full user journey in a real browser.

### Configuration (`playwright.config.ts`)

- **Base URL**: `http://localhost:5173`
- **Web server**: Vite dev server auto-starts before tests
- **Browser**: Chromium only (fast CI; expandable later)
- **Timeout**: 60s per test (races take ~15-30s to complete)

### Running E2E Tests

```bash
npm run e2e            # Headless run
npm run e2e:headed     # Headed (visible browser)
npm run e2e:ui         # Interactive UI mode
```

### E2E Test File Locations

```
e2e/
  generate-program.spec.ts   # Programme generation, idle state, button states
  race-lifecycle.spec.ts     # Countdown, horse movement, race completion
  full-program.spec.ts       # All 6 races to "Programme Complete"
  horse-panel.spec.ts        # Horse list, detail view, navigation
```

### Data Test IDs

E2E tests use `data-testid` attributes for stable selectors:

| Component     | Test ID             | Purpose                     |
| ------------- | ------------------- | --------------------------- |
| AppHeader     | `btn-generate`      | Generate Program button     |
| AppHeader     | `btn-start`         | Start / Pause button        |
| RaceTrack     | `overlay-idle`      | Pre-race idle overlay       |
| RaceTrack     | `overlay-countdown` | 3-2-1-GO countdown          |
| RaceTrack     | `overlay-between`   | Between-race podium overlay |
| RaceTrack     | `overlay-finished`  | Programme complete overlay  |
| RaceTrack     | `race-lane`         | Individual race lane        |
| HorsePanel    | `horse-list`        | Horse list view             |
| HorsePanel    | `horse-detail`      | Horse detail view           |
| SchedulePanel | `tab-programme`     | Programme tab button        |
| SchedulePanel | `tab-results`       | Results tab button          |
| ProgrammeTab  | `race-card`         | Programme race card         |
| ResultsTab    | `result-card`       | Results race card           |
