# Development

[Back to README](../README.md)

This document covers the development workflow, tooling, and CI/CD pipeline.

---

## Prerequisites

- **Node.js** 20+
- **npm** 10+

## Getting Started

```bash
git clone <repo-url>
cd horse-race
npm install          # Installs dependencies + sets up Husky git hooks
npm run dev          # Starts Vite dev server at http://localhost:5173
```

---

## Scripts Reference

| Script          | Command                    | Description                           |
| --------------- | -------------------------- | ------------------------------------- |
| `dev`           | `vite`                     | Start development server with HMR.    |
| `build`         | `vue-tsc -b && vite build` | Type-check then build for production. |
| `preview`       | `vite preview`             | Preview the production build locally. |
| `test`          | `vitest run`               | Run all tests once.                   |
| `test:watch`    | `vitest`                   | Run tests in watch mode.              |
| `test:coverage` | `vitest run --coverage`    | Run tests with V8 coverage report.    |
| `lint`          | `eslint .`                 | Check for lint errors.                |
| `lint:fix`      | `eslint . --fix`           | Auto-fix lint errors.                 |
| `format`        | `prettier --write src/`    | Format all source files.              |
| `format:check`  | `prettier --check src/`    | Check formatting without writing.     |
| `typecheck`     | `vue-tsc -b --noEmit`      | Run TypeScript type checking.         |

---

## Code Quality Tools

### ESLint

**Config**: `eslint.config.js` (ESLint v9 flat config format)

Extends:

- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-vue` essential rules

Custom rules:

- Unused variables prefixed with `_` are allowed.
- Browser globals (`window`, `document`, `requestAnimationFrame`, etc.) are declared.

Vue files use `vue-eslint-parser` with `typescript-eslint` as the script parser.

### Prettier

**Config**: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all"
}
```

This matches the existing code style: no semicolons, single quotes, trailing commas everywhere.

### TypeScript

**Config**: `tsconfig.json` (references `tsconfig.app.json` and `tsconfig.node.json`)

Strict mode is enabled with `noUnusedLocals` and `noUnusedParameters`. The Vue 3 DOM types are included via `@vue/tsconfig`.

---

## Git Hooks

### Husky

Husky is set up via `npm install` (the `prepare` script runs `husky`). Git hooks live in `.husky/`.

### Pre-commit Hook

The pre-commit hook runs **lint-staged**, which only processes staged files:

| File Pattern      | Actions                                |
| ----------------- | -------------------------------------- |
| `*.{ts,vue}`      | `eslint --fix` then `prettier --write` |
| `*.{json,md,css}` | `prettier --write`                     |

This ensures every commit has consistent formatting and no lint errors, without processing the entire codebase.

---

## CI/CD

### GitHub Actions (`.github/workflows/ci.yml`)

**Triggers**: Push to `main`, all pull requests targeting `main`.

**Environment**: Ubuntu latest, Node.js 20, `npm ci` for deterministic installs.

**Pipeline steps**:

```
1. Checkout code
2. Setup Node.js 20 (with npm cache)
3. npm ci
4. Typecheck     (npm run typecheck)
5. Lint          (npm run lint)
6. Test          (npm run test:coverage)
7. Upload coverage artifact (30-day retention)
```

All steps must pass for the workflow to succeed. Coverage reports are uploaded as build artifacts for review.

---

## Build

```bash
npm run build
```

This runs `vue-tsc -b` (type-check) followed by `vite build`. Output goes to `dist/`.

The production build uses:

- **Vite 8** with Rolldown bundler
- **LightningCSS** for CSS minification
- Tree-shaking of unused code

---

## Project Dependencies

### Runtime

| Package | Purpose                        |
| ------- | ------------------------------ |
| `vue`   | UI framework (Composition API) |
| `pinia` | State management               |

### Development

| Package               | Purpose                         |
| --------------------- | ------------------------------- |
| `vite`                | Build tool and dev server       |
| `vue-tsc`             | Vue-aware TypeScript compiler   |
| `typescript`          | Type system                     |
| `vitest`              | Test framework                  |
| `@vitest/coverage-v8` | V8 coverage provider            |
| `@vue/test-utils`     | Vue component testing utilities |
| `@pinia/testing`      | Pinia testing helpers           |
| `jsdom`               | DOM simulation for tests        |
| `eslint`              | Linter                          |
| `@eslint/js`          | ESLint core rules               |
| `typescript-eslint`   | TypeScript ESLint integration   |
| `eslint-plugin-vue`   | Vue-specific lint rules         |
| `prettier`            | Code formatter                  |
| `husky`               | Git hook manager                |
| `lint-staged`         | Run linters on staged files     |

---

## Adding New Features

### Adding a new component

1. Create the `.vue` file in the appropriate layer (`atoms/`, `molecules/`, `organisms/`).
2. Create a matching CSS file in `src/styles/<layer>/`.
3. Write tests in a `__tests__/` directory alongside the component.
4. Import and use in the parent component.

### Adding a new store

1. Create `src/stores/<name>.store.ts` using the Composition API pattern.
2. Export from `src/stores/index.ts`.
3. Add types to `src/types/<name>.ts` and export from `src/types/index.ts`.
4. Write tests in `src/stores/__tests__/<name>.store.test.ts`.

### Adding a new composable

1. Create `src/composables/use<Name>.ts`.
2. Export from `src/composables/index.ts`.
3. Write tests in `src/composables/__tests__/use<Name>.test.ts`.
