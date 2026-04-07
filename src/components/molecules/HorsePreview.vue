<script setup lang="ts">
import { computed } from 'vue'
import horseSprite from '../../assets/horse_sprite.png'
import { SPRITE_ROWS, SPRITE_COLS, SPRITE_ASPECT } from '../../utils/sprite'
import { useSpriteLoader } from '../../composables/useSpriteLoader'

// Static single-frame snapshot of a horse — no animation
const props = defineProps<{
  horseIndex: number // 0–19
  width?: number // display width in px (default 60)
}>()

const { loaded } = useSpriteLoader()

const w = computed(() => props.width ?? 60)
const h = computed(() => w.value / SPRITE_ASPECT)

const style = computed(() => ({
  width: `${w.value}px`,
  height: `${h.value}px`,
  flexShrink: '0',
  ...(loaded.value
    ? {
        backgroundImage: `url(${horseSprite})`,
        backgroundSize: `${w.value * SPRITE_COLS}px ${h.value * SPRITE_ROWS}px`,
        backgroundPositionX: '0%',
        backgroundPositionY: `${(props.horseIndex / (SPRITE_ROWS - 1)) * 100}%`,
        backgroundRepeat: 'no-repeat',
      }
    : {}),
}))
</script>

<template>
  <div
    class="horse-preview"
    :class="{
      'horse-preview--loading bg-accent-glass animate-skeleton-pulse rounded-sm':
        !loaded,
    }"
    :style="style"
  />
</template>
