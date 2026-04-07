<script setup lang="ts">
import { computed } from 'vue'
import horseSprite from '../../assets/horse_sprite.png'
import { SPRITE_ROWS, SPRITE_COLS, SPRITE_ASPECT } from '../../utils/sprite'
import { useSpriteLoader } from '../../composables/useSpriteLoader'

const props = defineProps<{
  horseIndex: number // 0–19, selects sprite row
  height: number // display height in px
  finished?: boolean // freeze on first frame when true
}>()

const { loaded } = useSpriteLoader()

// Per-horse animation durations (0.45–0.72s) and phase offsets.
// Values are manually varied so no two horses share the same cycle speed or start phase.
const DURATIONS = [
  0.55, 0.62, 0.48, 0.58, 0.7, 0.52, 0.64, 0.45, 0.61, 0.57, 0.5, 0.68, 0.54,
  0.66, 0.46, 0.72, 0.53, 0.6, 0.67, 0.49,
]
const DELAYS = [
  0.0, -0.12, -0.28, -0.07, -0.21, -0.35, -0.09, -0.18, -0.32, -0.14, -0.25,
  -0.05, -0.4, -0.16, -0.3, -0.08, -0.22, -0.38, -0.11, -0.45,
]

const w = computed(() => props.height * SPRITE_ASPECT)

const style = computed(() => ({
  width: `${w.value}px`,
  height: `${props.height}px`,
  ...(loaded.value
    ? {
        backgroundImage: `url(${horseSprite})`,
        backgroundSize: `${w.value * SPRITE_COLS}px ${props.height * SPRITE_ROWS}px`,
        backgroundPositionY: `${(props.horseIndex / (SPRITE_ROWS - 1)) * 100}%`,
        backgroundRepeat: 'no-repeat',
        ...(props.finished
          ? { animation: 'none', backgroundPositionX: '0%' }
          : {
              animationDuration: `${DURATIONS[props.horseIndex % DURATIONS.length]}s`,
              animationDelay: `${DELAYS[props.horseIndex % DELAYS.length]}s`,
            }),
      }
    : {}),
}))
</script>

<template>
  <div
    class="horse animate-horse-run shrink-0"
    :class="{
      'horse--loading bg-accent-glass animate-skeleton-pulse rounded-sm':
        !loaded,
    }"
    :style="style"
  />
</template>
