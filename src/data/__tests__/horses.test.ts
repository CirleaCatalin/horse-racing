import { describe, it, expect } from 'vitest'
import { conditionFromValue, CONDITION_COLOR } from '../horses'

describe('conditionFromValue', () => {
  it('returns Excellent for values >= 80', () => {
    expect(conditionFromValue(80)).toBe('Excellent')
    expect(conditionFromValue(100)).toBe('Excellent')
  })

  it('returns Good for values >= 60 and < 80', () => {
    expect(conditionFromValue(60)).toBe('Good')
    expect(conditionFromValue(79)).toBe('Good')
  })

  it('returns Fair for values >= 40 and < 60', () => {
    expect(conditionFromValue(40)).toBe('Fair')
    expect(conditionFromValue(59)).toBe('Fair')
  })

  it('returns Average for values >= 20 and < 40', () => {
    expect(conditionFromValue(20)).toBe('Average')
    expect(conditionFromValue(39)).toBe('Average')
  })

  it('returns Poor for values < 20', () => {
    expect(conditionFromValue(19)).toBe('Poor')
    expect(conditionFromValue(0)).toBe('Poor')
  })
})

describe('CONDITION_COLOR', () => {
  it('has a color for every condition', () => {
    const conditions = ['Excellent', 'Good', 'Fair', 'Average', 'Poor'] as const
    for (const c of conditions) {
      expect(CONDITION_COLOR[c]).toBeDefined()
      expect(CONDITION_COLOR[c]).toMatch(/^#/)
    }
  })
})
