import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSimulationStore } from '../simulation.store'
import { useRaceStore } from '../race.store'

describe('useSimulationStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function setup() {
    const raceStore = useRaceStore()
    const simStore = useSimulationStore()
    raceStore.generateProgram()
    return { raceStore, simStore }
  }

  describe('startPause() state machine', () => {
    it('starts in idle state', () => {
      const { simStore } = setup()
      expect(simStore.status).toBe('idle')
      expect(simStore.isIdle).toBe(true)
    })

    it('idle → counting on first startPause()', () => {
      const { simStore } = setup()
      simStore.startPause()
      expect(simStore.status).toBe('counting')
      expect(simStore.countdown).toBe(3)
    })

    it('counting → idle when cancelled', () => {
      const { simStore } = setup()
      simStore.startPause() // idle → counting
      simStore.startPause() // counting → idle
      expect(simStore.status).toBe('idle')
      expect(simStore.countdown).toBeNull()
    })

    it('counting → running after countdown completes', () => {
      const { simStore } = setup()
      simStore.startPause() // idle → counting

      vi.advanceTimersByTime(1000)
      expect(simStore.countdown).toBe(2)

      vi.advanceTimersByTime(1000)
      expect(simStore.countdown).toBe(1)

      vi.advanceTimersByTime(1000)
      expect(simStore.countdown).toBe(0) // GO!

      vi.advanceTimersByTime(800)
      expect(simStore.status).toBe('running')
    })

    it('running → paused on startPause()', () => {
      const { simStore } = setup()
      simStore.startPause() // idle → counting
      vi.advanceTimersByTime(3800) // counting → running
      expect(simStore.status).toBe('running')

      simStore.startPause() // running → paused
      expect(simStore.status).toBe('paused')
    })

    it('paused → running on resume (mid-race)', () => {
      const { simStore } = setup()
      simStore.startPause()
      vi.advanceTimersByTime(3800) // → running

      simStore.startPause() // → paused
      expect(simStore.isPaused).toBe(true)

      simStore.startPause() // → running
      expect(simStore.status).toBe('running')
    })
  })

  describe('_tick() simulation engine', () => {
    it('advances horse progress each tick while running', () => {
      const { simStore, raceStore } = setup()
      const race = raceStore.currentRace!
      const entry = race.entries[0]
      expect(entry.trackProgress).toBe(0)

      simStore.startPause()
      vi.advanceTimersByTime(3800) // countdown finishes → running
      vi.advanceTimersByTime(50) // one tick

      expect(entry.trackProgress).toBeGreaterThan(0)
    })

    it('assigns finish positions when horses reach 100%', () => {
      const { simStore, raceStore } = setup()
      const race = raceStore.currentRace!

      simStore.startPause()
      vi.advanceTimersByTime(3800) // → running

      // Manually push one horse to near-finish and tick
      race.entries[0].trackProgress = 99.9
      vi.advanceTimersByTime(50)

      expect(race.entries[0].trackProgress).toBe(100)
      expect(race.entries[0].finishPosition).toBeDefined()
    })

    it('completes race and pauses between races when all horses finish', () => {
      const { simStore, raceStore } = setup()
      const race = raceStore.currentRace!

      simStore.startPause()
      vi.advanceTimersByTime(3800) // → running

      // Push all horses to 100%
      for (const entry of race.entries) {
        entry.trackProgress = 100
        raceStore.assignFinishPosition(race.id, entry.horseId)
      }
      vi.advanceTimersByTime(50) // tick detects all finished

      expect(simStore.status).toBe('paused')
      expect(simStore.isBetweenRaces).toBe(true)
    })

    it('transitions to finished when all races are complete', () => {
      const { simStore, raceStore } = setup()

      // Complete all races except the last
      for (let i = 0; i < raceStore.races.length - 1; i++) {
        raceStore.completeCurrentRace()
      }

      const lastRace = raceStore.currentRace!
      simStore.startPause()
      vi.advanceTimersByTime(3800) // → running

      // Finish all horses in the last race
      for (const entry of lastRace.entries) {
        entry.trackProgress = 100
        raceStore.assignFinishPosition(lastRace.id, entry.horseId)
      }
      vi.advanceTimersByTime(50)

      expect(simStore.status).toBe('finished')
    })

    it('does not advance if status is not running', () => {
      const { simStore, raceStore } = setup()
      const race = raceStore.currentRace!
      const entry = race.entries[0]

      simStore.startPause() // counting
      vi.advanceTimersByTime(1000) // still counting
      expect(entry.trackProgress).toBe(0)
    })
  })

  describe('between-races resume', () => {
    it('starts countdown when resuming from between-races pause', () => {
      const { simStore, raceStore } = setup()
      const race = raceStore.currentRace!

      simStore.startPause()
      vi.advanceTimersByTime(3800) // → running

      // Finish all horses to trigger between-races pause
      for (const entry of race.entries) {
        entry.trackProgress = 100
        raceStore.assignFinishPosition(race.id, entry.horseId)
      }
      vi.advanceTimersByTime(50)
      expect(simStore.isBetweenRaces).toBe(true)
      expect(simStore.status).toBe('paused')

      // Resume — should start a new countdown
      simStore.startPause()
      expect(simStore.isBetweenRaces).toBe(false)
      expect(simStore.status).toBe('counting')
      expect(simStore.countdown).toBe(3)
    })
  })

  describe('reset()', () => {
    it('returns to idle and clears race state', () => {
      const { simStore, raceStore } = setup()
      simStore.startPause()
      vi.advanceTimersByTime(3800)
      expect(simStore.status).toBe('running')

      simStore.reset()
      expect(simStore.status).toBe('idle')
      expect(raceStore.races).toHaveLength(0)
    })
  })
})
