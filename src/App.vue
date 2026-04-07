<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import AppHeader from './components/organisms/AppHeader.vue'
import HorsePanel from './components/organisms/HorsePanel.vue'
import RaceTrack from './components/organisms/RaceTrack.vue'
import SchedulePanel from './components/organisms/SchedulePanel.vue'
import { useRaceStore, useSimulationStore } from './stores'

const raceStore = useRaceStore()
const simulationStore = useSimulationStore()

const currentRace = computed(
  () => raceStore.currentRace ?? raceStore.races[0] ?? null,
)

type MobilePanel = 'horses' | 'schedule' | null
const activePanel = ref<MobilePanel>(null)

const panelMap = {
  horses: markRaw(HorsePanel),
  schedule: markRaw(SchedulePanel),
}
const activePanelComponent = computed(() =>
  activePanel.value ? panelMap[activePanel.value] : null,
)

function onGenerateProgram(): void {
  simulationStore.reset() // stop any running race, clear old programme
  raceStore.generateProgram()
}

function onStartPause(): void {
  simulationStore.startPause()
}
</script>

<template>
  <div class="shell bg-bg flex h-screen w-screen flex-col overflow-hidden">
    <AppHeader @place-bet="onGenerateProgram" @start-race="onStartPause" />

    <!-- ── Desktop: 3-column layout ── -->
    <main
      class="app-main flex min-h-0 flex-1 gap-2.5 p-2.5 max-[767px]:gap-0 max-[767px]:p-1 min-[768px]:max-[1099px]:gap-2 min-[768px]:max-[1099px]:p-2"
    >
      <HorsePanel />
      <div
        class="track-wrapper min-w-0 flex-1 overflow-hidden rounded-md shadow-[0_4px_28px_rgba(0,0,0,0.55),0_0_0_1px_var(--color-accent-border)] max-[767px]:rounded-[6px]"
      >
        <RaceTrack
          :race-name="currentRace?.name ?? '—'"
          :race-lap="currentRace?.lap ?? ''"
          :race-distance="currentRace?.distance ?? 0"
        />
      </div>
      <SchedulePanel />
    </main>

    <!-- ── Mobile: slide-up panel overlay ── -->
    <Transition name="panel-slide">
      <div
        v-if="activePanel !== null"
        class="mobile-overlay top-header-h z-panel bg-bg fixed right-0 bottom-[calc(56px+env(safe-area-inset-bottom,0px))] left-0 hidden flex-col overflow-hidden max-[767px]:flex"
      >
        <Transition name="panel-fade" mode="out-in">
          <component :is="activePanelComponent" :key="activePanel" />
        </Transition>
      </div>
    </Transition>

    <!-- ── Mobile: bottom navigation ── -->
    <nav
      class="bottom-nav z-nav border-accent-tint bg-nav-bg fixed right-0 bottom-0 left-0 hidden h-[calc(56px+env(safe-area-inset-bottom,0px))] items-center justify-around border-t pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_24px_rgba(0,0,0,0.55)] backdrop-blur-[12px] max-[767px]:flex"
    >
      <button
        class="nav-tab font-ui text-text-soft hover:text-text-secondary flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 border-none bg-none p-0 text-[10px] font-bold tracking-[0.5px] uppercase transition-colors duration-[0.12s] ease-[ease]"
        :class="{ 'active !text-accent': activePanel === null }"
        data-testid="nav-track"
        @click="activePanel = null"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 3v18"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M5 3l14 4.5L5 12"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Track</span>
      </button>

      <button
        class="nav-tab font-ui text-text-soft hover:text-text-secondary flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 border-none bg-none p-0 text-[10px] font-bold tracking-[0.5px] uppercase transition-colors duration-[0.12s] ease-[ease]"
        :class="{ 'active !text-accent': activePanel === 'horses' }"
        data-testid="nav-horses"
        @click="activePanel = 'horses'"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M5 21v-1a7 7 0 0 1 14 0v1"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <span>Horses</span>
      </button>

      <button
        class="nav-tab font-ui text-text-soft hover:text-text-secondary flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 border-none bg-none p-0 text-[10px] font-bold tracking-[0.5px] uppercase transition-colors duration-[0.12s] ease-[ease]"
        :class="{ 'active !text-accent': activePanel === 'schedule' }"
        data-testid="nav-schedule"
        @click="activePanel = 'schedule'"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M7 9h10M7 13h10M7 17h6"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <span>Schedule</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
/* Mobile: safe-area bottom padding */
@media (max-width: 767px) {
  .shell {
    padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  }
}

/* min-width:768px overrides to ensure mobile-only elements stay hidden on desktop */
@media (min-width: 768px) {
  .mobile-overlay {
    display: none !important;
  }
  .bottom-nav {
    display: none !important;
  }
}

/* Tablet: slim panels */
@media (min-width: 768px) and (max-width: 1099px) {
  .app-main :deep(.panel) {
    width: 170px !important;
  }
}

/* Mobile: hide desktop panels, fill overlay */
@media (max-width: 767px) {
  .app-main :deep(.panel) {
    display: none !important;
  }
  .mobile-overlay :deep(.panel) {
    width: 100% !important;
    flex: 1;
    min-height: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
  }
}
</style>
