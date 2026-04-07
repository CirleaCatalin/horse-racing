import type { Condition } from '../types/horse'

export const CONDITION_COLOR: Record<Condition, string> = {
  Excellent: '#34B670',
  Good: '#7ed957',
  Fair: '#f0c040',
  Average: '#f08c3a',
  Poor: '#ef4136',
}

// Derive condition label from a 0-100 value
export function conditionFromValue(v: number): Condition {
  if (v >= 80) return 'Excellent'
  if (v >= 60) return 'Good'
  if (v >= 40) return 'Fair'
  if (v >= 20) return 'Average'
  return 'Poor'
}
