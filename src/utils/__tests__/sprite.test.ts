import { describe, it, expect } from 'vitest'
import { SPRITE_ROWS, SPRITE_COLS, SPRITE_ASPECT } from '../sprite'

describe('sprite constants', () => {
  it('SPRITE_ROWS equals 20', () => {
    expect(SPRITE_ROWS).toBe(20)
  })

  it('SPRITE_COLS equals 5', () => {
    expect(SPRITE_COLS).toBe(5)
  })

  it('SPRITE_ASPECT matches manual calculation', () => {
    const expected = 3061 / 5 / (7850 / 20)
    expect(SPRITE_ASPECT).toBeCloseTo(expected, 10)
  })
})
