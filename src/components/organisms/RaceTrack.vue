<script setup lang="ts">
import { ref, computed } from 'vue'
import HorseSprite from '../atoms/HorseSprite.vue'
import { useSimulationStore, useRaceStore, useHorseStore } from '../../stores'
import { useContainerSize } from '../../composables/useContainerSize'
import { SPRITE_ASPECT } from '../../utils/sprite'

const props = defineProps<{
  raceName: string
  raceLap: string
  raceDistance: number
}>()

const simStore = useSimulationStore()
const raceStore = useRaceStore()
const horseStore = useHorseStore()

// Horses visible during countdown, active race, between-races pause, and finished
const showHorses = computed(
  () =>
    simStore.isCounting ||
    simStore.isRunning ||
    simStore.isPaused ||
    simStore.isFinished,
)

// ── Container sizing ────────────────────────────────────────────���───────────
const containerRef = ref<HTMLElement | null>(null)
const { height: containerH } = useContainerSize(containerRef)

// ── Lane / horse sizing ───────────────────────────���─────────────────────────
const lanes = computed(() => raceStore.currentRace?.entries ?? [])
const laneH = computed(() => containerH.value / (lanes.value.length || 10))
const horseH = computed(() => Math.floor(laneH.value * 0.8))
const horseW = computed(() => Math.floor(horseH.value * SPRITE_ASPECT))

// ── Distance-based grid lines ─────────────────────────────────────────────
/** Number of grid segments — one line every 200m */
const gridSegments = computed(() => Math.floor(props.raceDistance / 200))

/** Inline styles for lane runway: grid spacing + container for cqw units */
const runwayStyle = computed(() => ({
  backgroundSize: `${100 / gridSegments.value}% 100%`,
  containerType: 'inline-size',
}))

/** CSS translateX for a horse at `progress` % (0 → start, 100 → finish line) */
function horseTranslate(progress: number): string {
  const p = Math.max(0, Math.min(100, progress ?? 0))
  // reserve horseW + 24px so the sprite reaches the finish-line edge
  return `calc(${p / 100} * (100cqw - ${horseW.value + 24}px))`
}

// ── Between-races podium ────────────────────────────────────────────────────
const lastRace = computed(() => {
  const done = raceStore.completedRaces
  return done[done.length - 1] ?? null
})

const podium = computed(() => {
  if (!lastRace.value) return []
  return [...lastRace.value.entries]
    .filter((e) => e.finishPosition !== undefined)
    .sort((a, b) => a.finishPosition! - b.finishPosition!)
    .slice(0, 3)
})

function getHorseName(id: number): string {
  return horseStore.horseById(id)?.name ?? `Horse ${id}`
}

function placeLabel(pos: number): string {
  if (pos === 1) return '🥇'
  if (pos === 2) return '🥈'
  if (pos === 3) return '🥉'
  return `#${pos}`
}
</script>

<template>
  <div
    class="track-shell bg-track flex h-full w-full flex-col overflow-hidden rounded-md font-mono"
  >
    <!-- ── Race info bar ── -->
    <div
      class="race-info border-surface-rim bg-black-lg flex h-7 shrink-0 items-center justify-center gap-2 border-b whitespace-nowrap"
    >
      <span
        class="race-info-name font-ui text-accent text-[11px] font-extrabold tracking-[0.5px] uppercase"
        >{{ raceName }}</span
      >
      <span class="race-info-sep text-text-faint font-mono text-[10px]">·</span>
      <span
        class="race-info-detail text-text-normal font-mono text-[11px] font-semibold"
        >{{ raceLap }}</span
      >
      <span class="race-info-sep text-text-faint font-mono text-[10px]">·</span>
      <span
        class="race-info-detail text-text-normal font-mono text-[11px] font-semibold"
        >{{ raceDistance }}m</span
      >
    </div>

    <!-- ── Lanes ── -->
    <div
      ref="containerRef"
      class="track relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div
        v-for="entry in lanes"
        :key="entry.horseId"
        data-testid="race-lane"
        class="lane bg-black-xs flex flex-1 items-center border-b border-white/15 transition-[background,border-bottom-color,box-shadow] duration-500 ease-[ease] last:border-b-0"
        :class="{
          'even !bg-black-sm': entry.lane % 2 === 0,
          'lane-gold': entry.finishPosition === 1,
          'lane-silver': entry.finishPosition === 2,
          'lane-bronze': entry.finishPosition === 3,
        }"
      >
        <span
          class="lane-num text-text-normal w-8 shrink-0 text-center text-xs font-bold select-none"
          >{{ entry.lane }}</span
        >
        <div
          class="lane-runway lane-runway-bg relative h-full flex-1 overflow-hidden"
          :style="runwayStyle"
        >
          <div
            v-if="horseH > 0 && showHorses"
            class="horse-mover z-base absolute top-1/2 left-1 transition-transform duration-[55ms] ease-linear will-change-transform"
            :style="{
              transform: `translateY(-50%) translateX(${horseTranslate(entry.trackProgress ?? 0)})`,
            }"
          >
            <HorseSprite
              :horse-index="(entry.horseId - 1) % 20"
              :height="horseH"
              :finished="(entry.trackProgress ?? 0) >= 100"
            />
          </div>
          <span
            v-if="entry.finishPosition"
            class="lane-place lane-place-anim text-text-normal pointer-events-none absolute inset-0 flex items-center justify-center gap-2 select-none"
          >
            <span
              class="lane-place-pos shrink-0 text-[clamp(12px,2.2vh,20px)] leading-none"
              >{{ placeLabel(entry.finishPosition) }}</span
            >
            <span
              class="lane-place-name font-ui max-w-[55%] truncate text-[clamp(9px,1.5vh,14px)] font-bold tracking-[1.5px] uppercase"
              >{{ getHorseName(entry.horseId) }}</span
            >
          </span>
        </div>
      </div>

      <!-- finish line -->
      <div
        class="finish-line finish-line-bg z-landmark absolute top-0 right-0 bottom-0 w-5"
        aria-label="Finish line"
      />

      <!-- ── Countdown overlay ── -->
      <Transition name="countdown-fade">
        <div
          v-if="simStore.isCounting"
          data-testid="overlay-countdown"
          class="countdown-overlay z-modal bg-overlay absolute inset-0 flex items-center justify-center backdrop-blur-[3px]"
        >
          <Transition name="count-pop" mode="out-in">
            <span
              :key="simStore.countdown ?? undefined"
              class="count-number font-ui text-[clamp(80px,18vw,180px)] leading-none font-black tracking-[-0.02em] text-white [text-shadow:0_0_40px_var(--color-text-quiet),0_6px_30px_rgba(0,0,0,0.9)]"
              :class="{
                'go !text-accent ![text-shadow:0_0_50px_var(--color-accent-glow),0_0_100px_var(--color-accent-heavy),0_6px_30px_rgba(0,0,0,0.9)]':
                  simStore.countdown === 0,
              }"
            >
              {{ simStore.countdown === 0 ? 'GO!' : simStore.countdown }}
            </span>
          </Transition>
        </div>
      </Transition>

      <!-- ── Between-races overlay ── -->
      <Transition name="overlay-fade">
        <div
          v-if="simStore.isBetweenRaces"
          data-testid="overlay-between"
          class="track-overlay between-overlay z-overlay bg-overlay-heavy pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-[6px] select-none"
        >
          <p
            class="overlay-race-done font-ui text-accent text-[clamp(18px,3.5vw,32px)] font-black tracking-[0.1em] uppercase [text-shadow:0_0_30px_var(--color-accent-heavy)]"
          >
            {{ lastRace?.name }} Complete
          </p>
          <ul
            class="podium-list flex w-[min(260px,80%)] list-none flex-col gap-1.5 ps-0"
          >
            <li
              v-for="(entry, i) in podium"
              :key="entry.horseId"
              class="podium-row border-surface-rim bg-surface flex items-center gap-2.5 rounded-sm border px-3 py-1.5"
              :class="`place-${i + 1}`"
            >
              <span
                class="podium-pos w-[26px] shrink-0 font-mono text-[10px] font-extrabold tracking-[0.5px]"
                >{{ placeLabel(i + 1) }}</span
              >
              <span
                class="podium-name font-ui text-text-bright truncate text-xs font-bold"
                >{{ getHorseName(entry.horseId) }}</span
              >
            </li>
          </ul>
          <button
            class="next-race-btn rounded-pill bg-accent font-ui mt-1.5 cursor-pointer border-none px-7 py-[9px] text-xs font-extrabold tracking-[0.8px] text-white uppercase shadow-[0_0_18px_var(--color-accent-border)] transition-[background,transform,box-shadow] duration-[0.12s] ease-[ease] hover:-translate-y-px hover:bg-[#3fcf80] hover:shadow-[0_0_26px_var(--color-accent-heavy)] active:translate-y-0"
            @click="simStore.startPause()"
          >
            Start {{ raceStore.currentRace?.name }}
          </button>
        </div>
      </Transition>

      <!-- ���─ Finished overlay ── -->
      <Transition name="overlay-fade">
        <div
          v-if="simStore.isFinished"
          data-testid="overlay-finished"
          class="track-overlay finished-overlay z-overlay bg-overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-[4px] select-none"
        >
          <p
            class="overlay-watermark font-ui text-text-ghost text-center text-[clamp(36px,7vw,96px)] leading-none font-black tracking-[0.08em] uppercase"
          >
            Programme Complete
          </p>
          <p
            class="overlay-tagline font-ui text-text-dim text-center text-[clamp(10px,1.4vw,15px)] font-bold tracking-[0.22em] uppercase"
          >
            All races finished
          </p>
          <div
            class="overlay-hint rounded-pill bg-black-md font-ui text-text-muted mt-2 flex items-center gap-2 border border-white/10 px-4 py-[7px] text-[11px] font-semibold tracking-[0.3px]"
          >
            <span
              class="hint-dot bg-accent animate-pulse-hint h-[7px] w-[7px] shrink-0 rounded-full shadow-[0_0_6px_var(--color-accent)]"
            />
            Click Generate Program to start a new session
          </div>
        </div>
      </Transition>

      <!-- ── Pre-race overlay ── -->
      <Transition name="overlay-fade">
        <div
          v-if="simStore.isIdle"
          data-testid="overlay-idle"
          class="track-overlay z-overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 select-none"
        >
          <p
            class="overlay-watermark font-ui text-text-ghost text-center text-[clamp(36px,7vw,96px)] leading-none font-black tracking-[0.08em] uppercase"
          >
            Horse Racing
          </p>
          <p
            class="overlay-tagline font-ui text-text-dim text-center text-[clamp(10px,1.4vw,15px)] font-bold tracking-[0.22em] uppercase"
          >
            Grace, power, and prestige in every race
          </p>
          <div
            class="overlay-hint rounded-pill bg-black-md font-ui text-text-muted mt-2 flex items-center gap-2 border border-white/10 px-4 py-[7px] text-[11px] font-semibold tracking-[0.3px]"
          >
            <span
              class="hint-dot bg-accent animate-pulse-hint h-[7px] w-[7px] shrink-0 rounded-full shadow-[0_0_6px_var(--color-accent)]"
            />
            Generate a program &amp; press Start to begin
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
