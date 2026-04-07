import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ResultsTab from '../ResultsTab.vue'
import { useRaceStore } from '../../../stores'

function setupCompletedRace() {
  const raceStore = useRaceStore()
  raceStore.generateProgram()

  // Manually complete the first race with finish positions
  const race = raceStore.races[0]
  race.entries.forEach((entry, i) => {
    entry.finishPosition = i + 1
    entry.trackProgress = 100
  })
  race.status = 'completed'

  return { raceStore }
}

describe('ResultsTab', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders empty state when no completed races', () => {
    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set<number>() },
    })
    expect(wrapper.find('.empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('No results yet')
  })

  it('renders completed races only', () => {
    const { raceStore } = setupCompletedRace()
    const completedCount = raceStore.completedRaces.length

    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set<number>() },
    })
    const cards = wrapper.findAll('.race-card')
    expect(cards).toHaveLength(completedCount)
  })

  it('sorts entries by finish position', () => {
    const { raceStore } = setupCompletedRace()
    const raceId = raceStore.completedRaces[0].id

    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set([raceId]) },
    })
    const positions = wrapper.findAll('.entry-pos').map((el) => el.text())
    // Top 3 are medals, rest are numeric
    expect(positions[0]).toBe('🥇')
    expect(positions[1]).toBe('🥈')
    expect(positions[2]).toBe('🥉')
  })

  it('shows medal emoji for top 3', () => {
    const { raceStore } = setupCompletedRace()
    const raceId = raceStore.completedRaces[0].id

    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set([raceId]) },
    })
    const positions = wrapper.findAll('.entry-pos')
    expect(positions[0].text()).toBe('🥇')
    expect(positions[1].text()).toBe('🥈')
    expect(positions[2].text()).toBe('🥉')
  })

  it('shows numeric position for 4th+', () => {
    const { raceStore } = setupCompletedRace()
    const race = raceStore.completedRaces[0]
    if (race.entries.length < 4) return // skip if fewer than 4 entries

    const raceId = race.id
    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set([raceId]) },
    })
    const positions = wrapper.findAll('.entry-pos')
    expect(positions[3].text()).toBe('4')
  })

  it('applies podium class for top 3', () => {
    const { raceStore } = setupCompletedRace()
    const raceId = raceStore.completedRaces[0].id

    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set([raceId]) },
    })
    const rows = wrapper.findAll('.entry-row')
    expect(rows[0].classes()).toContain('podium-1')
    expect(rows[1].classes()).toContain('podium-2')
    expect(rows[2].classes()).toContain('podium-3')
  })

  it('handles entries with undefined finishPosition gracefully', () => {
    const raceStore = useRaceStore()
    raceStore.generateProgram()

    const race = raceStore.races[0]
    // Only assign positions to some entries
    race.entries[0].finishPosition = 1
    race.entries[0].trackProgress = 100
    race.entries[1].trackProgress = 100
    // entries[1].finishPosition stays undefined
    race.status = 'completed'

    const raceId = race.id
    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set([raceId]) },
    })
    const rows = wrapper.findAll('.entry-row')
    // Entry with position 1 should have podium class, the rest should not
    expect(rows[0].classes()).toContain('podium-1')
    // Entries without finishPosition should not have podium class
    const lastRow = rows[rows.length - 1]
    expect(lastRow.classes()).not.toContain('podium-1')
    expect(lastRow.classes()).not.toContain('podium-2')
    expect(lastRow.classes()).not.toContain('podium-3')
  })

  it('emits toggle with race id', async () => {
    setupCompletedRace()

    const wrapper = mount(ResultsTab, {
      props: { expanded: new Set<number>() },
    })
    await wrapper.find('.race-header').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })
})
