import { describe, it, expect } from 'vitest'
import { shuffle, randomInt, randomFloat } from '../random'

describe('shuffle', () => {
  it('returns a new array with the same elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
    expect(result.sort()).toEqual(input.sort())
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5]
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })

  it('returns an empty array for empty input', () => {
    expect(shuffle([])).toEqual([])
  })
})

describe('randomInt', () => {
  it('returns a value within the inclusive range', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomInt(3, 7)
      expect(val).toBeGreaterThanOrEqual(3)
      expect(val).toBeLessThanOrEqual(7)
      expect(Number.isInteger(val)).toBe(true)
    }
  })

  it('returns the same value when min equals max', () => {
    expect(randomInt(5, 5)).toBe(5)
  })
})

describe('randomFloat', () => {
  it('returns a value within [min, max)', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomFloat(1.0, 2.0)
      expect(val).toBeGreaterThanOrEqual(1.0)
      expect(val).toBeLessThan(2.0)
    }
  })

  it('returns min when min equals max', () => {
    expect(randomFloat(3.0, 3.0)).toBe(3.0)
  })
})
