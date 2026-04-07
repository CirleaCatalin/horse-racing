<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'
import logoSvg from '../../assets/logo.svg'
import { useRaceStore, useSimulationStore } from '../../stores'

defineEmits<{
  placeBet: []
  startRace: []
}>()

const raceStore = useRaceStore()
const simStore = useSimulationStore()

const hasProgramme = computed(() => raceStore.races.length > 0)

/** Start/Pause is only usable once a programme exists and the simulation isn't finished. */
const canStart = computed(() => hasProgramme.value && !simStore.isFinished)
</script>

<template>
  <header
    class="header h-header-h bg-bg border-accent-glass flex shrink-0 items-center justify-between border-b px-6 shadow-[0_2px_20px_var(--color-overlay)] max-[767px]:px-3.5 max-[479px]:px-2.5"
  >
    <img
      :src="logoSvg"
      class="logo block h-6 w-auto min-w-0 shrink max-[479px]:h-[18px]"
      alt="Horse Racing"
    />
    <nav class="ctas flex shrink-0 items-center gap-2.5 max-[479px]:gap-1.5">
      <BaseButton
        v-if="!hasProgramme || simStore.isFinished"
        variant="ghost"
        data-testid="btn-generate"
        @click="$emit('placeBet')"
        >Generate Program</BaseButton
      >
      <BaseButton
        variant="primary"
        data-testid="btn-start"
        :disabled="!canStart"
        @click="$emit('startRace')"
        >Start / Pause</BaseButton
      >
    </nav>
  </header>
</template>

<style scoped>
/* Compact secondary CTA on very small screens */
@media (max-width: 479px) {
  .ctas :deep(.btn--ghost) {
    font-size: 11px;
    height: 34px;
    padding: 0 10px;
  }
  .ctas :deep(.btn--primary) {
    font-size: 11px;
    height: 34px;
    padding: 0 10px;
  }
}
</style>
