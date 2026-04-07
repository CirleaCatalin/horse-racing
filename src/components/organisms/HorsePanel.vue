<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import HorseRow from '../molecules/HorseRow.vue'
import HorseDetailView from '../molecules/HorseDetailView.vue'
import type { Horse } from '../../types/horse'
import { useHorseStore } from '../../stores'

const horseStore = useHorseStore()
const { horses } = storeToRefs(horseStore)

const selected = ref<Horse | null>(null)
</script>

<template>
  <aside
    class="panel w-panel-w border-accent-tint bg-accent-subtle relative flex shrink-0 flex-col overflow-hidden rounded-md border"
  >
    <Transition name="slide" mode="out-in">
      <!-- ── List view ── -->
      <div
        v-if="!selected"
        key="list"
        data-testid="horse-list"
        class="view flex h-full flex-col"
      >
        <div
          class="panel-header border-accent-tint flex shrink-0 items-center justify-between border-b px-3.5 pt-3 pb-2.5"
        >
          <h2
            class="panel-title font-ui text-text-secondary text-xs font-bold tracking-[1.2px] uppercase"
          >
            Horse List
          </h2>
          <span
            class="panel-count rounded-pill border-accent-muted bg-accent-tint text-accent border px-2 py-[1px] font-mono text-[11px] font-bold"
            >{{ horses.length }}</span
          >
        </div>

        <ul
          class="horse-list custom-scrollbar flex-1 list-none overflow-y-auto px-0 py-1"
        >
          <HorseRow
            v-for="horse in horses"
            :key="horse.id"
            :horse="horse"
            @select="selected = horse"
          />
        </ul>
      </div>

      <!-- ── Detail view ── -->
      <div
        v-else
        key="detail"
        data-testid="horse-detail"
        class="view flex h-full flex-col"
      >
        <HorseDetailView :horse="selected" @back="selected = null" />
      </div>
    </Transition>
  </aside>
</template>
