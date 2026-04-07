import type { RaceConfig } from '../types/race'

export type { RaceConfig }

/** Fixed programme structure — 6 races, always in this order */
export const RACE_CONFIGS: RaceConfig[] = [
  { name: 'Race 1', lap: '1st Lap', distance: 1200 },
  { name: 'Race 2', lap: '2nd Lap', distance: 1400 },
  { name: 'Race 3', lap: '3rd Lap', distance: 1600 },
  { name: 'Race 4', lap: '4th Lap', distance: 1800 },
  { name: 'Race 5', lap: '5th Lap', distance: 2000 },
  { name: 'Race 6', lap: '6th Lap', distance: 2400 },
]

/** Maximum number of horses allowed per race lane */
export const MAX_HORSES_PER_RACE = 10
