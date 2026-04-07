# Components

[Back to README](../README.md)

Components follow [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) principles: **atoms** (base primitives), **molecules** (combinations of atoms), and **organisms** (full page sections).

All components use Vue 3 `<script setup lang="ts">` with the Composition API.

---

## Atoms

Located in `src/components/atoms/`. The smallest, most reusable building blocks.

### BaseButton

Generic button component with variant and size support.

| Prop       | Type                   | Default     | Description                                                            |
| ---------- | ---------------------- | ----------- | ---------------------------------------------------------------------- |
| `variant`  | `'primary' \| 'ghost'` | `'primary'` | Visual style. Primary has a gradient background; ghost is transparent. |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`      | Controls padding and font size.                                        |
| `disabled` | `boolean`              | `false`     | Disables interaction.                                                  |
| `type`     | `string`               | `'button'`  | HTML button type attribute.                                            |

**Slot**: Default slot for button label.

### HorseSprite

Animated horse using CSS sprite animation from a 20x5 spritesheet.

| Prop         | Type      | Default  | Description                                                            |
| ------------ | --------- | -------- | ---------------------------------------------------------------------- |
| `horseIndex` | `number`  | required | Row in the spritesheet (0-19). Determines which horse graphic to show. |
| `height`     | `number`  | `40`     | Height in pixels. Width auto-calculated from aspect ratio.             |
| `finished`   | `boolean` | `false`  | When true, freezes the animation on frame 0 (standing pose).           |

**Animation details**:

- 5-frame CSS `steps()` animation.
- Duration varies per horse: `0.45s + (horseIndex * 0.015)s` for visual variety.
- Start delay is staggered so horses don't animate in sync.

### PanelTrademark

Simple attribution footer. No props. Renders a static text line.

---

## Molecules

Located in `src/components/molecules/`. Combine atoms with local state and logic.

### ConditionMeter

Animated progress bar displaying a horse's condition (0-100) with colour coding.

| Prop    | Type     | Description              |
| ------- | -------- | ------------------------ |
| `value` | `number` | Condition value (0-100). |

Features:

- Bar width animates on mount using `requestAnimationFrame`.
- Colour is derived from the condition tier (green for excellent, red for poor).
- Tick marks at 0, 25, 50, 75, 100.

### HorseDetailView

Expanded horse card with full details.

| Prop    | Type    | Description           |
| ------- | ------- | --------------------- |
| `horse` | `Horse` | The horse to display. |

| Event  | Payload | Description                              |
| ------ | ------- | ---------------------------------------- |
| `back` | none    | Emitted when the back button is clicked. |

Shows: name, ID badge, condition label with colour, HorsePreview, ConditionMeter.

### HorsePreview

Static single-frame horse sprite (no animation). Used as a thumbnail.

| Prop         | Type     | Default  | Description             |
| ------------ | -------- | -------- | ----------------------- |
| `horseIndex` | `number` | required | Spritesheet row (0-19). |
| `width`      | `number` | `60`     | Width in pixels.        |

### HorseRow

Clickable list item representing a single horse.

| Prop    | Type    | Description           |
| ------- | ------- | --------------------- |
| `horse` | `Horse` | The horse to display. |

| Event    | Payload | Description       |
| -------- | ------- | ----------------- |
| `select` | none    | Emitted on click. |

Shows: condition colour dot, name, condition label, chevron icon.

### NewsletterCard

Email subscription card. Static form with no functional backend.

### ProgrammeTab

Lists all races in the programme. Shows entries for expanded races.

| Prop       | Type          | Description               |
| ---------- | ------------- | ------------------------- |
| `expanded` | `Set<number>` | Set of expanded race IDs. |

| Event    | Payload  | Description                        |
| -------- | -------- | ---------------------------------- |
| `toggle` | `number` | Race ID to toggle expand/collapse. |

Features:

- LIVE badge on the currently active race.
- Lane assignments shown when a race card is expanded.
- Empty state when no programme has been generated.

### RaceCard

Collapsible card representing a single race.

| Prop           | Type      | Description                            |
| -------------- | --------- | -------------------------------------- |
| `race`         | `Race`    | Race data.                             |
| `isExpanded`   | `boolean` | Whether the card body is visible.      |
| `showDone`     | `boolean` | Whether to show DONE badge.            |
| `isActive`     | `boolean` | Whether this is the current live race. |
| `dimCompleted` | `boolean` | Reduce opacity for completed races.    |

| Event    | Payload | Description                         |
| -------- | ------- | ----------------------------------- |
| `toggle` | none    | Emitted when the header is clicked. |

### ResultsTab

Lists completed races with finish positions and podium medals.

| Prop       | Type          | Description               |
| ---------- | ------------- | ------------------------- |
| `expanded` | `Set<number>` | Set of expanded race IDs. |

Features:

- Entries sorted by finish position.
- Medal icons for 1st, 2nd, 3rd place.
- Empty state when no races have completed.

---

## Organisms

Located in `src/components/organisms/`. Major page sections composed of molecules.

### AppHeader

Top navigation bar with logo and action buttons.

| Event        | Payload | Description                                 |
| ------------ | ------- | ------------------------------------------- |
| `place-bet`  | none    | Emitted when "Generate Program" is clicked. |
| `start-race` | none    | Emitted when "Start" / "Pause" is clicked.  |

Button states:

- **Generate Program** — visible when idle with no programme, or when all races are finished.
- **Start / Pause** — disabled until a programme exists; toggles between start and pause labels based on simulation status.

### HorsePanel

Left sidebar managing horse list and detail views.

Features:

- **List view**: Scrollable list of `HorseRow` components.
- **Detail view**: `HorseDetailView` for the selected horse.
- Vue `<Transition>` provides a slide animation when switching between views.

### RaceTrack

The core visual component showing the race in progress.

Features:

- Dynamic lane heights calculated from container size via `useContainerSize`.
- `HorseSprite` per lane, positioned horizontally by `trackProgress`.
- Checkered finish line along the right edge.
- Lane highlights: gold, silver, bronze for top-3 finishers.
- **Overlays**:
  - Pre-race: "Generate a programme to begin".
  - Countdown: Animated 3-2-1-GO numbers.
  - Between races: Podium display with top-3 results.
  - Finished: "All races complete" with restart hint.

### SchedulePanel

Right sidebar with tabbed navigation.

- **Tab 1** — `ProgrammeTab`: Upcoming and live races.
- **Tab 2** — `ResultsTab`: Completed races with positions.
- Footer: `NewsletterCard` + `PanelTrademark`.
- Uses `useExpandedSet` composable for accordion state per tab.
