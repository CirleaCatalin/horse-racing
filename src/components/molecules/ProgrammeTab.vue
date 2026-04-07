<script setup lang="ts">
import { computed } from 'vue'
import { useRaceStore, useSimulationStore } from '../../stores'
import { useHorseStore } from '../../stores'
import RaceCard from './RaceCard.vue'

const props = defineProps<{ expanded: Set<number> }>()
const emit = defineEmits<{ toggle: [raceId: number] }>()

const raceStore = useRaceStore()
const horseStore = useHorseStore()
const simStore = useSimulationStore()

const races = computed(() => raceStore.races)

const getHorse = (id: number) => horseStore.horseById(id)

const isLive = computed(
  () => simStore.isRunning || simStore.isPaused || simStore.isCounting,
)
</script>

<template>
  <div class="race-list py-1.5">
    <div
      v-if="races.length === 0"
      class="empty font-ui text-text-faint py-8 text-center text-[11px]"
    >
      Click <strong>Generate Program</strong> to create the race lineup
    </div>
    <RaceCard
      v-for="race in races"
      :key="race.id"
      data-testid="race-card"
      :race="race"
      :is-expanded="props.expanded.has(race.id)"
      :is-active="isLive && raceStore.currentRace?.id === race.id"
      :show-done="race.status === 'completed'"
      :dim-completed="true"
      @toggle="emit('toggle', race.id)"
    >
      <li
        v-for="entry in race.entries"
        :key="entry.horseId"
        class="entry-row hover:bg-accent-subtle flex items-center gap-1.5 px-3 py-[11px] pl-4 transition-[background] duration-[0.12s] ease-[ease]"
      >
        <span
          class="entry-lane text-text-muted w-[18px] shrink-0 font-mono text-[9px] font-bold"
          >L{{ entry.lane }}</span
        >
        <span
          class="entry-name font-ui text-text-normal min-w-0 flex-1 truncate text-[11px] font-semibold"
          >{{ getHorse(entry.horseId)?.name }}</span
        >
      </li>
    </RaceCard>
  </div>
</template>
