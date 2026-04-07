import { ref } from 'vue'

/**
 * Manages a reactive Set of expanded item IDs (e.g. accordion cards).
 *
 * Vue cannot detect `.add()` / `.delete()` mutations on a Set ref, so every
 * mutation must produce a new Set instance. This composable encapsulates that
 * pattern so callers never have to think about it.
 *
 * @example
 * const { expanded, toggle } = useExpandedSet()
 * // in template: :is-expanded="expanded.has(race.id)" @toggle="toggle(race.id)"
 */
export function useExpandedSet() {
  const expanded = ref<Set<number>>(new Set())

  function toggle(id: number): void {
    const next = new Set(expanded.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    expanded.value = next
  }

  function clear(): void {
    expanded.value = new Set()
  }

  return { expanded, toggle, clear }
}
