export type Condition = 'Excellent' | 'Good' | 'Fair' | 'Average' | 'Poor'

export interface Horse {
  id: number
  name: string
  condition: Condition
  conditionValue: number // 0–100
  horseIndex: number // sprite row 0–19
}
