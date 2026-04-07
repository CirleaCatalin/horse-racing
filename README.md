<p align="center">
  <img src="docs/logo.svg" alt="Horse Race" width="420" />
</p>

<p align="center">
  A real-time horse racing simulation built with <strong>Vue 3</strong>, <strong>TypeScript</strong>, <strong>Pinia</strong>, and <strong>Vite</strong>.
</p>

<p align="center">
  <a href="https://github.com/CirleaCatalin/horse-racing/actions/workflows/ci.yml">
    <img src="https://github.com/CirleaCatalin/horse-racing/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
</p>

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

## How It Works

1. **20 Random Horses** — on app launch, 20 horses are generated with unique names (from shuffled word pools) and random condition values (0–100). They remain fixed for the session.
2. **Generate Program** — builds a 6-race programme with shuffled entries per race (up to 10 horses each), drawn from the existing 20-horse roster.
3. **Start Race** — a 3-2-1-GO countdown kicks off the simulation. Each horse advances every 50 ms at a speed determined by its condition value, race distance, and controlled randomness. Longer races (e.g. 2400m) take proportionally longer than shorter ones (e.g. 1200m).
4. **Finish & Results** — horses crossing the finish line receive positions by arrival order. After all entries finish, the race completes and the next one queues up. Results are available in the Schedule panel.

## Sprite Animation System

Horse animations use a **sprite sheet** technique for maximum performance:

- A single `horse_sprite.png` image (3061 × 7850 px) contains **20 horses × 5 animation frames** in a grid layout
- Each horse occupies one row; each column is one frame of the galloping cycle
- CSS `background-position` combined with `steps(5, end)` steps through the frames — no JavaScript runs per frame, keeping the animation smooth at any number of on-screen horses
- Per-horse timing offsets (0.45–0.72s duration, staggered phase) ensure no two horses animate in sync, creating a natural look
- Sprite dimensions are dynamically sized based on the track container height, maintaining the correct aspect ratio (`≈ 1.56:1`) at every viewport size

This approach avoids creating individual `<img>` or `<canvas>` elements per horse and per frame, reducing DOM nodes and eliminating layout thrashing during races.

## Documentation

| Document                                   | Description                                               |
| ------------------------------------------ | --------------------------------------------------------- |
| [Architecture](docs/architecture.md)       | Project structure, component hierarchy, data flow         |
| [Stores](docs/stores.md)                   | Pinia state management: horse, race, simulation           |
| [Simulation & Scoring](docs/simulation.md) | Speed formula, race mechanics, how winners are determined |
| [Components](docs/components.md)           | Atoms, molecules, organisms catalog                       |
| [Design System](docs/design-system.md)     | CSS variables, colours, typography, layout tokens         |
| [Testing](docs/testing.md)                 | Test setup, patterns, coverage thresholds                 |
| [Development](docs/development.md)         | Scripts, CI/CD, linting, formatting, git hooks            |

## Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Framework | Vue 3 (Composition API)              |
| State     | Pinia                                |
| Language  | TypeScript (strict mode)             |
| Build     | Vite 8                               |
| Test      | Vitest + Vue Test Utils              |
| E2E       | Playwright (Chromium/Firefox/WebKit) |
| Styling   | Tailwind CSS v4                      |
| Lint      | ESLint 9 (flat config) + Prettier    |
| CI        | GitHub Actions                       |

## Scripts

```bash
npm run dev            # Development server
npm run build          # Type-check + production build
npm run build:analyze  # Build with bundle visualizer
npm test               # Run all tests
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Tests with coverage report
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier format src/
npm run format:check   # Prettier check src/
npm run typecheck      # vue-tsc type checking
npm run e2e            # Playwright E2E tests (all browsers)
npm run e2e:headed     # E2E with visible browser
npm run e2e:ui         # Playwright interactive UI
```

## Project Structure

```
src/
  assets/            Logo SVG, horse sprite sheet
  components/
    atoms/           Base UI primitives (button, sprite, trademark)
    molecules/       Compound components (cards, meters, tabs, rows)
    organisms/       Full sections (header, panels, race track)
  stores/            Pinia stores (horse, race, simulation)
  composables/       Vue composables (useExpandedSet, useContainerSize)
  types/             TypeScript interfaces
  constants/         Static config (horse count, race configs)
  data/              Runtime data and mapping functions
  utils/             Pure helpers (random, sprite math, name generation)
  styles/            CSS organised by component layer
```

## AI-Assisted Development

- **Architecture & planning** — component hierarchy, store design, simulation engine
- **Implementation** — Vue components, Pinia stores, TypeScript types, utility functions
- **Styling migration** — full migration from 18 custom CSS files to Tailwind CSS v4
- **Testing** — unit tests (Vitest), E2E tests (Playwright), coverage configuration
- **Documentation** — README, architecture docs, CLAUDE.md

See [`CLAUDE.md`](CLAUDE.md) for project conventions and AI-development context.

## License

Private project.
