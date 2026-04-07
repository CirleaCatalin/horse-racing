export type RaceStatus = 'programmed' | 'completed'

export interface RaceEntry {
  horseId: number
  lane: number
  finishPosition?: number // populated when horse crosses the finish line
  trackProgress?: number // 0–100, current % along the track
}

export interface Race {
  id: number
  name: string
  lap: string
  distance: number // metres
  status: RaceStatus
  entries: RaceEntry[]
}

/** Static programme configuration — one entry per race slot */
export interface RaceConfig {
  name: string
  lap: string
  distance: number // metres
}
