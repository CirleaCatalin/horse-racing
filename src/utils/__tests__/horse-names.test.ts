import { describe, it, expect } from 'vitest'
import { generateHorseNames } from '../horse-names'

describe('generateHorseNames', () => {
  it('returns the requested number of names', () => {
    expect(generateHorseNames(5)).toHaveLength(5)
    expect(generateHorseNames(20)).toHaveLength(20)
  })

  it('returns unique names', () => {
    const names = generateHorseNames(20)
    expect(new Set(names).size).toBe(20)
  })

  it('each name is two words', () => {
    const names = generateHorseNames(20)
    for (const name of names) {
      const parts = name.split(' ')
      expect(parts).toHaveLength(2)
      expect(parts[0].length).toBeGreaterThan(0)
      expect(parts[1].length).toBeGreaterThan(0)
    }
  })

  it('produces different names on subsequent calls', () => {
    const a = generateHorseNames(20)
    const b = generateHorseNames(20)
    // Extremely unlikely to be identical due to shuffling
    expect(a).not.toEqual(b)
  })
})
