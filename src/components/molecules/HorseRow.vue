<script setup lang="ts">
import HorsePreview from './HorsePreview.vue'
import type { Horse } from '../../types/horse'
import { CONDITION_COLOR } from '../../data/horses'

defineProps<{ horse: Horse }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <li
    class="horse-row group border-surface hover:bg-accent-glass flex cursor-pointer items-center gap-2.5 border-b px-3 py-1.5 transition-[background] duration-[0.12s] ease-[ease] last:border-b-0"
    @click="$emit('select')"
  >
    <HorsePreview :horse-index="horse.horseIndex" :width="58" />

    <div class="horse-info flex min-w-0 flex-1 flex-col gap-[3px]">
      <span
        class="horse-name font-ui text-text-bright truncate text-xs font-bold"
        >{{ horse.name }}</span
      >
      <span
        class="horse-condition font-ui flex items-center gap-[5px] text-[10px] font-semibold"
        :style="{ color: CONDITION_COLOR[horse.condition] }"
      >
        <span
          class="condition-dot h-1.5 w-1.5 shrink-0 rounded-full"
          :style="{ background: CONDITION_COLOR[horse.condition] }"
        />
        {{ horse.condition }}
      </span>
    </div>

    <svg
      class="chevron text-text-dim group-hover:text-accent ml-auto shrink-0 transition-colors duration-[0.12s] ease-[ease]"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
    >
      <path
        d="M3 2L7 5L3 8"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </li>
</template>
