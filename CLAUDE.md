# CLAUDE.md

Project context for LLM-assisted development.

## Project

Horse Race Simulator — a real-time horse racing app built with Vue 3, TypeScript, Pinia, Tailwind CSS v4, and Vite.

## Architecture

- **Atomic Design**: `atoms/` → `molecules/` → `organisms/` component hierarchy
- **State**: Three Pinia stores — `horse` (roster), `race` (programme/results), `simulation` (state machine + tick engine)
- **Styling**: Tailwind CSS v4 utility classes in Vue templates; design tokens defined via `@theme` in `src/styles/app.css`; non-utility styles (keyframes, Vue transitions, complex gradients, scrollbars) in `src/styles/custom.css`. Marker classes (no styles) kept on elements for test selectors.
- **Sprites**: 20-horse sprite sheet (`src/assets/horse_sprite.png`), 5 frames per horse, CSS `steps()` animation

## Key Conventions

- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters`
- ESLint 9 flat config + Prettier (no semicolons, single quotes, trailing commas)
- Husky pre-commit hook runs lint-staged on `*.{ts,vue}` files
- Unit tests in `__tests__/` directories alongside source, using Vitest + Vue Test Utils
- E2E tests in `e2e/` directory using Playwright (Chromium, Firefox, WebKit)
- 80% coverage thresholds enforced (statements, branches, functions, lines)
- Stable selectors use `data-testid` attributes (see `docs/testing.md` for the full list)

## Commands

```bash
npm run dev            # Vite dev server on :5173
npm run build          # Typecheck + production build
npm run build:analyze  # Build with bundle visualizer
npm test               # Vitest (unit)
npm run test:coverage  # Unit tests with coverage
npm run e2e            # Playwright E2E (all browsers)
npm run e2e:headed     # E2E with visible browser
npm run lint           # ESLint
npm run typecheck      # vue-tsc
```

## Important Files

| Path                             | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `src/stores/simulation.store.ts` | State machine: idle → counting → running → paused → finished            |
| `src/stores/race.store.ts`       | Programme generation, progress tracking, finish positions               |
| `src/stores/horse.store.ts`      | 20-horse roster with random names and conditions (created once on init) |
| `src/utils/horse-names.ts`       | Name generator — shuffled adjective + noun combinations                 |
| `src/constants/races.ts`         | 6 race configs (distances 1200m–2400m)                                  |
| `src/styles/app.css`             | Tailwind entry point — `@theme` design tokens + `@layer base` reset     |
| `src/styles/custom.css`          | Non-utility CSS — keyframes, Vue transitions, gradients, scrollbars     |
| `playwright.config.ts`           | E2E config — Chromium/Firefox/WebKit, Vite webServer                    |
| `vite.config.ts`                 | Build config + Vitest settings + bundle analyzer                        |

## Gotchas

- Horses are generated once at store init (not on "Generate Program" click). "Generate Program" only creates the race programme.
- The simulation tick runs every 50ms. Speed = f(conditionValue, distance) + random variance. Race duration scales with distance (1200m baseline; 2400m takes ~2x longer).
- E2E tests navigate to `/?speed=5` to accelerate races via the `SPEED_MULTIPLIER` in `simulation.store.ts`. Normal users at `/` get 1x speed.
- E2E `full-program.spec.ts` has a 300s timeout because it runs all 6 races end-to-end.
- Vitest must exclude `e2e/**` to avoid conflicts with Playwright's `test` import.
