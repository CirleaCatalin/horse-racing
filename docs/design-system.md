# Design System

[Back to README](../README.md)

The visual design is driven entirely by **CSS custom properties** (variables) defined in `src/styles/variables.css`. No CSS-in-JS or theming library is used.

---

## Colour Palette

### Brand

| Variable       | Value     | Usage                                        |
| -------------- | --------- | -------------------------------------------- |
| `--clr-accent` | `#34b670` | Primary green. Buttons, borders, highlights. |
| `--clr-bg`     | `#0d1131` | Dark navy background.                        |

### Accent Alpha Scale

A range of green at different opacities for subtle layering:

| Variable              | Opacity | Usage                         |
| --------------------- | ------- | ----------------------------- |
| `--clr-accent-subtle` | 3%      | Very faint background tint.   |
| `--clr-accent-glass`  | 8%      | Glass-like panel backgrounds. |
| `--clr-accent-wash`   | 12%     | Hover backgrounds.            |
| `--clr-accent-mist`   | 18%     | Active state backgrounds.     |
| `--clr-accent-tint`   | 25%     | Badge backgrounds.            |
| `--clr-accent-mid`    | 40%     | Secondary borders.            |
| `--clr-accent-strong` | 60%     | Strong accents.               |
| `--clr-accent-vivid`  | 80%     | Near-solid accent.            |

### Medal Colours

Each medal colour has multiple variants for gradients, glows, and borders:

| Medal  | Base      | Light     | Glow                    | Shadow    |
| ------ | --------- | --------- | ----------------------- | --------- |
| Gold   | `#ffc300` | `#ffe066` | `rgba(255,195,0,0.25)`  | `#b38600` |
| Silver | `#c0c0c0` | `#e0e0e0` | `rgba(192,192,192,0.2)` | `#808080` |
| Bronze | `#b06e3c` | `#d4956a` | `rgba(176,110,60,0.2)`  | `#7a4d2a` |

### Semantic Colours

| Variable        | Value                    | Usage                   |
| --------------- | ------------------------ | ----------------------- |
| `--clr-track`   | `#3d6e28`                | Race track grass green. |
| `--clr-surface` | `rgba(255,255,255,0.04)` | Card/panel surface.     |
| `--clr-border`  | `rgba(255,255,255,0.06)` | Subtle borders.         |
| `--clr-overlay` | `rgba(0,0,0,0.6)`        | Modal/overlay backdrop. |

---

## Typography

### Text Opacity Scale

All text uses white at varying opacity against the dark background:

| Variable           | Alpha | Usage                         |
| ------------------ | ----- | ----------------------------- |
| `--text-primary`   | 92%   | Main content, headings.       |
| `--text-secondary` | 55%   | Supporting text, labels.      |
| `--text-muted`     | 35%   | Disabled or de-emphasised.    |
| `--text-faint`     | 20%   | Barely visible hints.         |
| `--text-ghost`     | 10%   | Structural lines, watermarks. |
| `--text-invisible` | 6%    | Near-invisible separators.    |

### Font Stacks

| Variable      | Value               | Usage              |
| ------------- | ------------------- | ------------------ |
| `--font-ui`   | `Arial, sans-serif` | All UI text.       |
| `--font-mono` | `monospace`         | Code, data values. |

---

## Layout Tokens

| Variable     | Value   | Usage             |
| ------------ | ------- | ----------------- |
| `--panel-w`  | `210px` | Side panel width. |
| `--header-h` | `56px`  | Header height.    |

---

## Border Radius

| Variable        | Value  | Usage                          |
| --------------- | ------ | ------------------------------ |
| `--radius-sm`   | `4px`  | Small elements (badges, tags). |
| `--radius-md`   | `8px`  | Cards, inputs.                 |
| `--radius-lg`   | `10px` | Panels, modals.                |
| `--radius-pill` | `20px` | Pill-shaped buttons, chips.    |

---

## Transitions

| Variable     | Value                                  | Usage                              |
| ------------ | -------------------------------------- | ---------------------------------- |
| `--t-fast`   | `0.12s ease`                           | Micro-interactions (hover, focus). |
| `--t-mid`    | `0.18s ease`                           | Button presses, toggles.           |
| `--t-slow`   | `0.25s ease`                           | Panel slides, fades.               |
| `--t-bounce` | `0.22s cubic-bezier(0.34,1.56,0.64,1)` | Playful pop-in effects.            |
| `--t-slide`  | `0.3s cubic-bezier(0.32,0.72,0,1)`     | Smooth slide transitions.          |

---

## Z-Index Scale

| Variable       | Value | Usage                                |
| -------------- | ----- | ------------------------------------ |
| `--z-base`     | `1`   | Default stacking.                    |
| `--z-landmark` | `10`  | Important but non-blocking elements. |
| `--z-overlay`  | `20`  | Race overlays (countdown, podium).   |
| `--z-modal`    | `25`  | Modal dialogs.                       |
| `--z-panel`    | `100` | Side panels (mobile overlay mode).   |
| `--z-nav`      | `200` | Top navigation, bottom tab bar.      |

---

## CSS Organisation

Styles mirror the component hierarchy:

```
src/styles/
  variables.css         Design tokens (imported first in main.ts)
  base.css              Global reset (box-sizing, margin, height)
  atoms/
    base-button.css     Button variants, sizes, hover states
    horse-sprite.css    Sprite animation keyframes
    panel-trademark.css Footer text styling
  molecules/
    condition-meter.css Progress bar, ticks, colour animation
    horse-detail-view.css Card layout, condition badge
    horse-row.css       List item, condition dot
    newsletter-card.css Email form card
    programme-tab.css   Race list, LIVE badge
    race-card.css       Collapsible card, chevron
    results-tab.css     Finish positions, medals
  organisms/
    app.css             Root layout grid, mobile breakpoints
    app-header.css      Top bar, logo, button group
    horse-panel.css     Left sidebar, scroll, transition
    race-track.css      Track lanes, finish line, overlays
    schedule-panel.css  Right sidebar, tab bar
  shared/
    panel.css           Common side panel width, border
```

Each component imports its own CSS file via `<style src="...">`. No global style leakage.
