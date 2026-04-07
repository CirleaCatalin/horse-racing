/** Fisher-Yates shuffle — returns a new array, never mutates the original */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Inclusive integer in [min, max] */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Float in [min, max) */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
