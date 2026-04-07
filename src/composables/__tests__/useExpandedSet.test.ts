import { describe, it, expect } from 'vitest'
import { useExpandedSet } from '../useExpandedSet'

describe('useExpandedSet', () => {
  describe('toggle', () => {
    it('adds id when not present', () => {
      const { expanded, toggle } = useExpandedSet()
      toggle(1)
      expect(expanded.value.has(1)).toBe(true)
    })

    it('removes id when present', () => {
      const { expanded, toggle } = useExpandedSet()
      toggle(1)
      toggle(1)
      expect(expanded.value.has(1)).toBe(false)
    })

    it('produces a new Set instance (Vue reactivity)', () => {
      const { expanded, toggle } = useExpandedSet()
      const before = expanded.value
      toggle(1)
      expect(expanded.value).not.toBe(before)
    })

    it('multiple toggles maintain correct state', () => {
      const { expanded, toggle } = useExpandedSet()
      toggle(1)
      toggle(2)
      toggle(3)
      expect(expanded.value.has(1)).toBe(true)
      expect(expanded.value.has(2)).toBe(true)
      expect(expanded.value.has(3)).toBe(true)

      toggle(2)
      expect(expanded.value.has(1)).toBe(true)
      expect(expanded.value.has(2)).toBe(false)
      expect(expanded.value.has(3)).toBe(true)
    })

    it('toggle same id twice returns to empty', () => {
      const { expanded, toggle } = useExpandedSet()
      toggle(5)
      toggle(5)
      expect(expanded.value.size).toBe(0)
    })
  })

  describe('clear', () => {
    it('empties the set', () => {
      const { expanded, toggle, clear } = useExpandedSet()
      toggle(1)
      toggle(2)
      clear()
      expect(expanded.value.size).toBe(0)
    })

    it('produces a new Set instance', () => {
      const { expanded, toggle, clear } = useExpandedSet()
      toggle(1)
      const before = expanded.value
      clear()
      expect(expanded.value).not.toBe(before)
    })
  })
})
