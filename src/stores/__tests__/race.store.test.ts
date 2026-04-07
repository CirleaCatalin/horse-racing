import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaceStore } from '../race.store'
import { useHorseStore } from '../horse.store' // needed for empty-horses test
import { RACE_CONFIGS } from '../../constants/races'

describe('useRaceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function setup() {
    const raceStore = useRaceStore()
    raceStore.generateProgram()
    return { raceStore }
  }

  describe('generateProgram()', () => {
    it('creates one race per config', () => {
      const { raceStore } = setup()
      expect(raceStore.races).toHaveLength(RACE_CONFIGS.length)
    })

    it('sets all races to programmed status', () => {
      const { raceStore } = setup()
      for (const race of raceStore.races) {
        expect(race.status).toBe('programmed')
      }
    })

    it('assigns entries with lane numbers and zero progress', () => {
      const { raceStore } = setup()
      for (const race of raceStore.races) {
        expect(race.entries.length).toBeGreaterThan(0)
        for (const entry of race.entries) {
          expect(entry.lane).toBeGreaterThanOrEqual(1)
          expect(entry.trackProgress).toBe(0)
          expect(entry.finishPosition).toBeUndefined()
        }
      }
    })

    it('does nothing when horses are empty', () => {
      setActivePinia(createPinia())
      const horseStore = useHorseStore()
      const raceStore = useRaceStore()
      // Don't generate horses — store starts with defaults, so reset them
      horseStore.horses = [] as never[]
      raceStore.generateProgram()
      expect(raceStore.races).toHaveLength(0)
    })
  })

  describe('updateProgress()', () => {
    it('updates the track progress of a horse in the current race', () => {
      const { raceStore } = setup()
      const race = raceStore.currentRace!
      const entry = race.entries[0]

      raceStore.updateProgress(race.id, entry.horseId, 42)
      expect(entry.trackProgress).toBe(42)
    })

    it('clamps progress to [0, 100]', () => {
      const { raceStore } = setup()
      const race = raceStore.currentRace!
      const entry = race.entries[0]

      raceStore.updateProgress(race.id, entry.horseId, 150)
      expect(entry.trackProgress).toBe(100)

      raceStore.updateProgress(race.id, entry.horseId, -10)
      expect(entry.trackProgress).toBe(0)
    })

    it('ignores updates for non-current race', () => {
      const { raceStore } = setup()
      // Second race is not the current race
      const secondRace = raceStore.races[1]
      const entry = secondRace.entries[0]

      raceStore.updateProgress(secondRace.id, entry.horseId, 50)
      expect(entry.trackProgress).toBe(0) // unchanged
    })
  })

  describe('assignFinishPosition()', () => {
    it('assigns sequential positions as horses finish', () => {
      const { raceStore } = setup()
      const race = raceStore.currentRace!
      const [e1, e2, e3] = race.entries

      raceStore.assignFinishPosition(race.id, e1.horseId)
      raceStore.assignFinishPosition(race.id, e2.horseId)
      raceStore.assignFinishPosition(race.id, e3.horseId)

      expect(e1.finishPosition).toBe(1)
      expect(e2.finishPosition).toBe(2)
      expect(e3.finishPosition).toBe(3)
    })

    it('does not reassign an existing finish position', () => {
      const { raceStore } = setup()
      const race = raceStore.currentRace!
      const entry = race.entries[0]

      raceStore.assignFinishPosition(race.id, entry.horseId)
      raceStore.assignFinishPosition(race.id, entry.horseId) // duplicate call

      expect(entry.finishPosition).toBe(1)
    })
  })

  describe('completeCurrentRace()', () => {
    it('marks the current race as completed and advances index', () => {
      const { raceStore } = setup()
      expect(raceStore.currentRaceIndex).toBe(0)

      raceStore.completeCurrentRace()

      expect(raceStore.races[0].status).toBe('completed')
      expect(raceStore.currentRaceIndex).toBe(1)
    })

    it('does not advance past the last race', () => {
      const { raceStore } = setup()
      const lastIndex = raceStore.races.length - 1

      // Complete all races
      for (let i = 0; i <= lastIndex; i++) {
        raceStore.completeCurrentRace()
      }

      expect(raceStore.currentRaceIndex).toBe(lastIndex)
      expect(raceStore.allRacesComplete).toBe(true)
    })
  })
})
