import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useHorseStore } from './horse.store'
import { RACE_CONFIGS, MAX_HORSES_PER_RACE } from '../constants/races'
import { shuffle } from '../utils/random'
import type { Race, RaceEntry } from '../types/race'

export const useRaceStore = defineStore('races', () => {
  const horseStore = useHorseStore()

  // ── State ────────────────────────────────────────────────────────────────

  const races = ref<Race[]>([])
  const currentRaceIndex = ref(0)

  /** Tracks how many horses have crossed the finish line per race (raceId → count) */
  const _finishCounters = ref<Map<number, number>>(new Map())

  // ── Getters ──────────────────────────────────────────────────────────────

  const currentRace = computed(
    () => races.value[currentRaceIndex.value] ?? null,
  )
  const programmedRaces = computed(() =>
    races.value.filter((r) => r.status === 'programmed'),
  )
  const completedRaces = computed(() =>
    races.value.filter((r) => r.status === 'completed'),
  )
  const allRacesComplete = computed(
    () =>
      races.value.length > 0 &&
      races.value.every((r) => r.status === 'completed'),
  )

  /** O(1) lookup map for the current race's entries (horseId → RaceEntry) */
  const _currentEntryMap = computed(() => {
    const map = new Map<number, RaceEntry>()
    const race = currentRace.value
    if (race) {
      for (const entry of race.entries) {
        map.set(entry.horseId, entry)
      }
    }
    return map
  })

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Builds the 6-race programme from the currently generated horse list.
   * Each race gets a random shuffled subset of horses (up to MAX_HORSES_PER_RACE).
   * Must be called after useHorseStore().generate().
   */
  function generateProgram(): void {
    const horses = horseStore.horses
    if (horses.length === 0) return

    _finishCounters.value.clear()

    races.value = RACE_CONFIGS.map((config, index) => {
      const entries: RaceEntry[] = shuffle(horses)
        .slice(0, MAX_HORSES_PER_RACE)
        .map((horse, laneIndex) => ({
          horseId: horse.id,
          lane: laneIndex + 1,
          trackProgress: 0,
        }))

      return {
        id: index + 1,
        name: config.name,
        lap: config.lap,
        distance: config.distance,
        status: 'programmed',
        entries,
      }
    })

    currentRaceIndex.value = 0
  }

  /**
   * Updates a single horse's track progress within the current race.
   * Called every simulation tick — uses O(1) map lookup.
   */
  function updateProgress(
    raceId: number,
    horseId: number,
    progress: number,
  ): void {
    const race = currentRace.value
    if (!race || race.id !== raceId) return
    const entry = _currentEntryMap.value.get(horseId)
    if (!entry) return
    entry.trackProgress = Math.min(100, Math.max(0, progress))
  }

  /**
   * Assigns a finish position to a horse the moment it reaches 100%.
   * Position is determined by arrival order, not final progress value.
   */
  function assignFinishPosition(raceId: number, horseId: number): void {
    const race = currentRace.value
    if (!race || race.id !== raceId) return
    const entry = _currentEntryMap.value.get(horseId)
    if (!entry || entry.finishPosition !== undefined) return

    const position = (_finishCounters.value.get(raceId) ?? 0) + 1
    _finishCounters.value.set(raceId, position)
    entry.finishPosition = position
  }

  /**
   * Marks the current race as completed and advances the index to the next race.
   */
  function completeCurrentRace(): void {
    const race = currentRace.value
    if (!race || race.status === 'completed') return

    race.status = 'completed'

    if (currentRaceIndex.value < races.value.length - 1) {
      currentRaceIndex.value++
    }
  }

  function reset(): void {
    races.value = []
    currentRaceIndex.value = 0
    _finishCounters.value.clear()
  }

  return {
    // state
    races,
    currentRaceIndex,
    // getters
    currentRace,
    programmedRaces,
    completedRaces,
    allRacesComplete,
    // actions
    generateProgram,
    updateProgress,
    assignFinishPosition,
    completeCurrentRace,
    reset,
  }
})
