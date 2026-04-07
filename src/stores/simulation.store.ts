import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useHorseStore } from './horse.store'
import { useRaceStore } from './race.store'

// ── Simulation constants ──────────────────────────────────────────────────

/** How often the engine ticks in milliseconds (20 fps) */
const TICK_MS = 50

/**
 * Progress added per tick at minimum condition (0).
 * At 20 fps: 100 / 0.15 ≈ 667 ticks ≈ 33s for a slow horse.
 */
const MIN_SPEED = 0.15

/**
 * Progress added per tick at maximum condition (100).
 * At 20 fps: 100 / 0.40 ≈ 250 ticks ≈ 12.5s for a top horse.
 */
const MAX_SPEED = 0.4

/**
 * Fraction of baseSpeed applied as random variance per tick.
 * Keeps races exciting without fully negating condition differences.
 */
const VARIANCE_FACTOR = 0.3

/**
 * Reference distance in metres. Speed constants (MIN_SPEED / MAX_SPEED)
 * are calibrated for this distance; longer races scale proportionally slower.
 */
const BASE_DISTANCE = 1200

/**
 * Speed multiplier read from `?speed=N` query param.
 * Used by E2E tests to accelerate races (e.g. `/?speed=5`).
 */
const SPEED_MULTIPLIER =
  Number(new URLSearchParams(window.location.search).get('speed')) || 1

// ── Types ─────────────────────────────────────────────────────────────────

import type { SimulationStatus } from '../types/simulation'

// ── Store ─────────────────────────────────────────────────────────────────

export const useSimulationStore = defineStore('simulation', () => {
  const horseStore = useHorseStore()
  const raceStore = useRaceStore()

  // ── State ──────────────────────────────────────────────────────────────

  const status = ref<SimulationStatus>('idle')
  const _intervalId = ref<ReturnType<typeof setInterval> | null>(null)

  /** Current countdown value: 3 | 2 | 1 | 0 (GO!) | null (inactive) */
  const countdown = ref<number | null>(null)

  /** True while waiting between two races (paused, not mid-race) */
  const isBetweenRaces = ref(false)

  // ── Getters ────────────────────────────────────────────────────────────

  const isIdle = computed(() => status.value === 'idle')
  const isCounting = computed(() => status.value === 'counting')
  const isRunning = computed(() => status.value === 'running')
  const isPaused = computed(() => status.value === 'paused')
  const isFinished = computed(() => status.value === 'finished')

  // ── Private helpers ────────────────────────────────────────────────────

  let _countdownHandles: ReturnType<typeof setTimeout>[] = []

  function _clearCountdown(): void {
    _countdownHandles.forEach(clearTimeout)
    _countdownHandles = []
    countdown.value = null
  }

  function _startCountdown(): void {
    status.value = 'counting'
    countdown.value = 3

    const at = (ms: number, fn: () => void) => {
      _countdownHandles.push(setTimeout(fn, ms))
    }

    at(1000, () => {
      countdown.value = 2
    })
    at(2000, () => {
      countdown.value = 1
    })
    at(3000, () => {
      countdown.value = 0
    }) // "GO!"
    at(3800, () => {
      countdown.value = null
      status.value = 'running'
      _intervalId.value = setInterval(_tick, TICK_MS)
    })
  }

  function _clearTick(): void {
    if (_intervalId.value !== null) {
      clearInterval(_intervalId.value)
      _intervalId.value = null
    }
  }

  /**
   * Computes how much progress a horse makes in one tick.
   * Higher conditionValue → faster base speed, with small random variance
   * so no race is perfectly predictable.
   * Speed is scaled by distance: longer races yield smaller per-tick progress.
   */
  function _computeSpeed(conditionValue: number, distance: number): number {
    const base = MIN_SPEED + (conditionValue / 100) * (MAX_SPEED - MIN_SPEED)
    const variance = (Math.random() - 0.5) * 2 * VARIANCE_FACTOR * base
    const distanceScale = BASE_DISTANCE / distance
    return Math.max(0.01, (base + variance) * distanceScale * SPEED_MULTIPLIER)
  }

  /**
   * Core simulation tick — called every TICK_MS milliseconds.
   * Moves each horse in the current race and checks for finish/race-end.
   */
  function _tick(): void {
    if (status.value !== 'running') return

    const race = raceStore.currentRace
    if (!race) return

    let finishedCount = 0

    for (const entry of race.entries) {
      const current = entry.trackProgress ?? 0

      // Horse already finished — just count it
      if (current >= 100) {
        finishedCount++
        continue
      }

      const horse = horseStore.horseById(entry.horseId)
      const speed = _computeSpeed(horse?.conditionValue ?? 50, race.distance)
      const next = Math.min(100, current + speed)

      raceStore.updateProgress(race.id, entry.horseId, next)

      if (next >= 100) {
        // Assign finish position the moment the horse crosses the line
        raceStore.assignFinishPosition(race.id, entry.horseId)
        finishedCount++
      }
    }

    // All horses crossed — wrap up this race
    if (finishedCount === race.entries.length) {
      raceStore.completeCurrentRace()
      _clearTick()

      if (raceStore.allRacesComplete) {
        status.value = 'finished'
      } else {
        // Pause between races — player clicks Start to begin the next one
        isBetweenRaces.value = true
        status.value = 'paused'
      }
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────

  /**
   * Toggles between running and paused.
   * From idle: triggers a 3→2→1→GO! countdown before starting.
   * From paused: resumes immediately (no countdown).
   * From counting: cancels the countdown and returns to idle.
   */
  function startPause(): void {
    if (status.value === 'running') {
      status.value = 'paused'
      _clearTick()
      return
    }

    if (status.value === 'counting') {
      _clearCountdown()
      status.value = 'idle'
      return
    }

    if (status.value === 'idle') {
      _startCountdown()
      return
    }

    if (status.value === 'paused') {
      if (isBetweenRaces.value) {
        isBetweenRaces.value = false
        _startCountdown() // new race gets a fresh countdown
      } else {
        status.value = 'running'
        _intervalId.value = setInterval(_tick, TICK_MS)
      }
    }
  }

  /** Stops the simulation and resets all race state */
  function reset(): void {
    _clearCountdown()
    _clearTick()
    status.value = 'idle'
    isBetweenRaces.value = false
    raceStore.reset()
  }

  return {
    // state
    status,
    countdown,
    isBetweenRaces,
    // getters
    isIdle,
    isCounting,
    isRunning,
    isPaused,
    isFinished,
    // actions
    startPause,
    reset,
  }
})
