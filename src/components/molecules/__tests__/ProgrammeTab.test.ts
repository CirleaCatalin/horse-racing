import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ProgrammeTab from '../ProgrammeTab.vue'
import { useRaceStore, useSimulationStore } from '../../../stores'

describe('ProgrammeTab', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders empty state when no races', () => {
    const wrapper = mount(ProgrammeTab, {
      props: { expanded: new Set<number>() },
    })
    expect(wrapper.find('.empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('Generate Program')
  })

  it('renders a RaceCard per race', () => {
    const raceStore = useRaceStore()
    raceStore.generateProgram()

    const wrapper = mount(ProgrammeTab, {
      props: { expanded: new Set<number>() },
    })
    const cards = wrapper.findAll('.race-card')
    expect(cards).toHaveLength(raceStore.races.length)
  })

  it('marks current race as active when simulation is live', () => {
    const raceStore = useRaceStore()
    const simStore = useSimulationStore()
    raceStore.generateProgram()
    // Simulate running state
    simStore.$patch({ status: 'running' })

    const wrapper = mount(ProgrammeTab, {
      props: { expanded: new Set<number>() },
    })
    const activeCards = wrapper.findAll('.is-active')
    expect(activeCards).toHaveLength(1)
  })

  it('shows lane and horse name in entries', () => {
    const raceStore = useRaceStore()
    raceStore.generateProgram()

    const firstRaceId = raceStore.races[0].id
    const wrapper = mount(ProgrammeTab, {
      props: { expanded: new Set([firstRaceId]) },
    })
    const entries = wrapper.findAll('.entry-row')
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].find('.entry-lane').text()).toMatch(/^L\d+$/)
    expect(entries[0].find('.entry-name').text()).toBeTruthy()
  })

  it('emits toggle with race id', async () => {
    const raceStore = useRaceStore()
    raceStore.generateProgram()

    const wrapper = mount(ProgrammeTab, {
      props: { expanded: new Set<number>() },
    })
    await wrapper.find('.race-header').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')![0]).toEqual([raceStore.races[0].id])
  })
})
