<script setup lang="ts">
import { computed } from 'vue'
import { useRaceStore } from '../../stores'
import { useHorseStore } from '../../stores'
import RaceCard from './RaceCard.vue'

const props = defineProps<{ expanded: Set<number> }>()
const emit = defineEmits<{ toggle: [raceId: number] }>()

const raceStore = useRaceStore()
const horseStore = useHorseStore()

const completed = computed(() => raceStore.completedRaces)

const getHorse = (id: number) => horseStore.horseById(id)

const MEDAL = ['🥇', '🥈', '🥉']

function isPodium(pos: number | undefined): pos is number {
  return (pos ?? 99) <= 3
}

function podiumClass(pos: number | undefined): string | undefined {
  return isPodium(pos) ? `podium-${pos}` : undefined
}
</script>

<template>
  <div class="race-list py-1.5">
    <div
      v-if="completed.length === 0"
      class="empty font-ui text-text-faint py-8 text-center text-[11px]"
    >
      No results yet
    </div>
    <RaceCard
      v-for="race in completed"
      :key="race.id"
      data-testid="result-card"
      :race="race"
      :is-expanded="props.expanded.has(race.id)"
      :show-done="true"
      @toggle="emit('toggle', race.id)"
    >
      <li
        v-for="entry in [...race.entries].sort(
          (a, b) => (a.finishPosition ?? 99) - (b.finishPosition ?? 99),
        )"
        :key="entry.horseId"
        class="entry-row hover:bg-accent-subtle flex items-center gap-1.5 border-l-2 border-l-transparent px-3 py-[11px] pl-2.5 transition-[background] duration-[0.12s] ease-[ease]"
        :class="podiumClass(entry.finishPosition)"
      >
        <span
          class="entry-pos text-text-soft w-[22px] shrink-0 text-center font-mono text-[13px] font-bold"
        >
          {{
            isPodium(entry.finishPosition)
              ? MEDAL[entry.finishPosition - 1]
              : entry.finishPosition
          }}
        </span>
        <span
          class="entry-name font-ui text-text-normal min-w-0 flex-1 truncate text-[11px] font-semibold"
        >
          {{ getHorse(entry.horseId)?.name }}
        </span>
      </li>
    </RaceCard>
  </div>
</template>
