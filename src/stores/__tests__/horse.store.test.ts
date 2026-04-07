import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHorseStore } from '../horse.store'
import { HORSE_COUNT } from '../../constants/horses'

describe('useHorseStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initialises with exactly HORSE_COUNT horses', () => {
    const store = useHorseStore()
    expect(store.horses).toHaveLength(HORSE_COUNT)
  })

  it('assigns sequential ids from 1 to HORSE_COUNT', () => {
    const store = useHorseStore()
    const ids = store.horses.map((h) => h.id)
    expect(ids).toEqual(Array.from({ length: HORSE_COUNT }, (_, i) => i + 1))
  })

  it('assigns unique non-empty names', () => {
    const store = useHorseStore()
    const names = store.horses.map((h) => h.name)

    for (const name of names) {
      expect(name.length).toBeGreaterThan(0)
    }
    expect(new Set(names).size).toBe(HORSE_COUNT)
  })

  it('assigns random conditions between 0 and 100', () => {
    const store = useHorseStore()

    for (const horse of store.horses) {
      expect(horse.conditionValue).toBeGreaterThanOrEqual(0)
      expect(horse.conditionValue).toBeLessThanOrEqual(100)
      expect(['Excellent', 'Good', 'Fair', 'Average', 'Poor']).toContain(
        horse.condition,
      )
    }
  })

  it('assigns sprite indices 0 through HORSE_COUNT-1', () => {
    const store = useHorseStore()
    const indices = store.horses.map((h) => h.horseIndex)
    expect(indices).toEqual(Array.from({ length: HORSE_COUNT }, (_, i) => i))
  })

  describe('horseById', () => {
    it('returns the correct horse', () => {
      const store = useHorseStore()

      const firstHorse = store.horses[0]
      const found = store.horseById(firstHorse.id)
      expect(found).toBeDefined()
      expect(found!.id).toBe(firstHorse.id)
    })

    it('returns undefined for unknown id', () => {
      const store = useHorseStore()
      expect(store.horseById(999)).toBeUndefined()
    })
  })
})
