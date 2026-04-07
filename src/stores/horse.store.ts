import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { HORSE_COUNT } from '../constants/horses'
import type { Horse } from '../types/horse'
import { conditionFromValue } from '../data/horses'
import { randomFloat } from '../utils/random'
import { generateHorseNames } from '../utils/horse-names'

/** Build the full 20-horse roster with random names and conditions (called once). */
function createRoster(): Horse[] {
  const names = generateHorseNames(HORSE_COUNT)

  return Array.from({ length: HORSE_COUNT }, (_, i) => {
    const conditionValue = Math.round(randomFloat(0, 100))
    return {
      id: i + 1,
      name: names[i],
      horseIndex: i,
      conditionValue,
      condition: conditionFromValue(conditionValue),
    }
  })
}

export const useHorseStore = defineStore('horses', () => {
  // ── State ────────────────────────────────────────────────────────────────
  // 20 horses with random names and conditions, created once on app launch.
  const horses = ref<Horse[]>(createRoster())

  // ── Getters ──────────────────────────────────────────────────────────────

  /** Find a single horse by id — used by race entries to resolve horse data */
  const horseById = computed(
    () =>
      (id: number): Horse | undefined =>
        horses.value.find((h) => h.id === id),
  )

  const count = computed(() => horses.value.length)

  return {
    // state
    horses,
    // getters
    horseById,
    count,
  }
})
