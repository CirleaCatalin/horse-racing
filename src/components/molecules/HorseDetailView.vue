<script setup lang="ts">
import HorsePreview from './HorsePreview.vue'
import ConditionMeter from './ConditionMeter.vue'
import type { Horse } from '../../types/horse'
import { CONDITION_COLOR } from '../../data/horses'

defineProps<{ horse: Horse }>()
defineEmits<{ back: [] }>()
</script>

<template>
  <div class="detail flex h-full flex-col gap-4 p-3">
    <!-- back -->
    <button
      class="back-btn font-ui text-text-quiet hover:text-accent inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[11px] font-semibold tracking-[0.4px] transition-colors duration-[0.12s] ease-[ease]"
      @click="$emit('back')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M9 2L4 7L9 12"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Horse List
    </button>

    <!-- horse card -->
    <div
      class="horse-card border-accent-tint bg-accent-subtle flex flex-col items-center gap-1.5 rounded-md border px-3 py-4"
    >
      <HorsePreview :horse-index="horse.horseIndex" :width="90" />
      <div
        class="horse-id text-text-soft mt-1 font-mono text-[10px] font-bold tracking-[1px]"
      >
        #{{ horse.id }}
      </div>
      <h3
        class="horse-name font-ui text-text-primary text-center text-sm leading-tight font-extrabold"
      >
        {{ horse.name }}
      </h3>
      <span
        class="horse-badge rounded-pill font-ui border px-2.5 py-0.5 text-[10px] font-bold tracking-[0.8px] uppercase"
        :style="{
          color: CONDITION_COLOR[horse.condition],
          borderColor: CONDITION_COLOR[horse.condition],
          background: CONDITION_COLOR[horse.condition] + '18',
        }"
      >
        {{ horse.condition }}
      </span>
    </div>

    <!-- condition meter -->
    <ConditionMeter :value="horse.conditionValue" />
  </div>
</template>
