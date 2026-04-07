# Architecture

[Back to README](../README.md)

## Overview

The application follows a unidirectional data flow pattern. Pinia stores hold all state, Vue components render it, and user actions dispatch store methods that update state. There is no backend; everything runs client-side.

## Directory Layout

```
src/
  main.ts                       # App bootstrap: creates Vue app + Pinia
  App.vue                       # Root layout (3-column desktop / overlay mobile)
  components/
    atoms/                      # Smallest reusable UI elements
      BaseButton.vue            # Generic button (primary / ghost variants)
      HorseSprite.vue           # Animated sprite from spritesheet
      PanelTrademark.vue        # Attribution footer
    molecules/                  # Compositions of atoms with local logic
      ConditionMeter.vue        # Animated 0-100 progress bar
      HorseDetailView.vue       # Full horse card with condition meter
      HorsePreview.vue          # Static single-frame sprite thumbnail
      HorseRow.vue              # Clickable horse list item
      NewsletterCard.vue        # Email subscription card
      ProgrammeTab.vue          # Upcoming / live race list
      RaceCard.vue              # Collapsible race summary
      ResultsTab.vue            # Completed race list with podium medals
    organisms/                  # Major page sections
      AppHeader.vue             # Top bar with logo + action buttons
      HorsePanel.vue            # Left sidebar: horse list / detail view
      RaceTrack.vue             # Centre: race visualisation + overlays
      SchedulePanel.vue         # Right sidebar: programme / results tabs
  stores/                       # Pinia composition-api stores
    horse.store.ts              # Horse pool generation and lookup
    race.store.ts               # 6-race programme, progress, results
    simulation.store.ts         # Race loop, timing, speed computation
    index.ts                    # Re-exports all stores
  types/                        # TypeScript interfaces
    horse.ts                    # Horse, HorseEntry, Condition
    race.ts                     # Race, RaceEntry, RaceConfig, RaceStatus
    simulation.ts               # SimulationStatus
    index.ts                    # Re-exports all types
  constants/                    # Immutable config
    horses.ts                   # HORSE_POOL (20 entries with name + sprite index)
    races.ts                    # RACE_CONFIGS (6 races), MAX_HORSES_PER_RACE
  data/                         # Derived data + mapping functions
    horses.ts                   # conditionFromValue(), CONDITION_COLOR, default horses
    races.ts                    # Default race programme (used before generation)
  utils/                        # Pure functions
    random.ts                   # shuffle, randomInt, randomFloat
    sprite.ts                   # SPRITE_ROWS, SPRITE_COLS, SPRITE_ASPECT
  composables/                  # Vue composition functions
    useExpandedSet.ts           # Reactive Set<number> for accordion state
    useContainerSize.ts         # ResizeObserver-based width/height tracking
    index.ts                    # Re-exports all composables
  styles/                       # CSS by component layer
    variables.css               # Design tokens (colours, spacing, z-index)
    base.css                    # Global reset
    atoms/                      # Styles for atom components
    molecules/                  # Styles for molecule components
    organisms/                  # Styles for organism components
    shared/                     # Shared panel styles
```

## Component Hierarchy

```
App.vue
  AppHeader.vue
    BaseButton.vue              # "Generate Program" / "Start|Pause"
  HorsePanel.vue                # Left panel
    HorseRow.vue                # Per-horse list item
      HorsePreview.vue          # Static sprite thumbnail
    HorseDetailView.vue         # Expanded horse card
      ConditionMeter.vue        # Condition bar
      HorsePreview.vue          # Large sprite thumbnail
  RaceTrack.vue                 # Centre
    HorseSprite.vue             # Per-lane animated sprite
  SchedulePanel.vue             # Right panel
    ProgrammeTab.vue
      RaceCard.vue              # Per-race collapsible card
    ResultsTab.vue
      RaceCard.vue              # Per-race with finish positions
    NewsletterCard.vue
    PanelTrademark.vue
```

## Data Flow

```
User clicks "Generate Program"
  |
  v
App.vue handler
  |-- simulationStore.reset()           Clear previous state
  |-- horseStore.generate()             Pick 1-20 random horses, assign conditions
  |-- raceStore.generateProgram()       Build 6 races with shuffled horse subsets
  v
UI re-renders (reactive)

User clicks "Start"
  |
  v
simulationStore.startPause()
  |-- status: idle -> counting
  |-- 3 -> 2 -> 1 -> GO! (1s intervals)
  |-- status: counting -> running
  |-- Start interval (_tick every 50ms)
  v
_tick() loop
  |-- For each horse in currentRace.entries:
  |     |-- Compute speed from conditionValue + variance
  |     |-- raceStore.updateProgress(raceId, horseId, newProgress)
  |     |-- If progress >= 100: raceStore.assignFinishPosition()
  |-- If all horses finished:
  |     |-- raceStore.completeCurrentRace()
  |     |-- If more races: isBetweenRaces = true, pause
  |     |-- If last race: status = finished
  v
UI updates reactively (sprite positions, lane highlights, overlays)
```

## Responsive Layout

- **Desktop (>768px)**: Three-column grid. Left panel (210px) | Race track (flex) | Right panel (210px).
- **Mobile**: Full-width race track. Bottom navigation tabs toggle overlay panels (horse list, schedule) via `v-if`.

## Key Design Decisions

1. **Composition API stores** — each store is a function returning refs, computeds, and methods. No class-based patterns.
2. **Atomic Design** — components are organised as atoms, molecules, and organisms for clear reuse boundaries.
3. **CSS variables over JS theming** — all design tokens live in `variables.css`, referenced throughout component styles.
4. **No router** — single-page app with panel-based navigation; no URL routing needed.
5. **No external API** — all data is generated client-side; the app is fully self-contained.
