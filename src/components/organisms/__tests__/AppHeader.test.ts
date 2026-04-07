import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AppHeader from '../AppHeader.vue'
import { useRaceStore, useSimulationStore } from '../../../stores'

function mountHeader() {
  return mount(AppHeader)
}

describe('AppHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows Generate Program button when no programme', () => {
    const wrapper = mountHeader()
    expect(wrapper.text()).toContain('Generate Program')
  })

  it('shows Generate Program button when simulation finished', () => {
    const raceStore = useRaceStore()
    const simStore = useSimulationStore()
    raceStore.generateProgram()
    simStore.$patch({ status: 'finished' })

    const wrapper = mountHeader()
    expect(wrapper.text()).toContain('Generate Program')
  })

  it('hides Generate Program button during active programme', () => {
    const raceStore = useRaceStore()
    raceStore.generateProgram()

    const wrapper = mountHeader()
    const buttons = wrapper.findAll('button')
    const genBtn = buttons.find((b) => b.text().includes('Generate Program'))
    expect(genBtn).toBeUndefined()
  })

  it('disables Start/Pause when no programme', () => {
    const wrapper = mountHeader()
    const startBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('Start'))!
    expect(startBtn.attributes('disabled')).toBeDefined()
  })

  it('enables Start/Pause when programme exists and not finished', () => {
    const raceStore = useRaceStore()
    raceStore.generateProgram()

    const wrapper = mountHeader()
    const startBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('Start'))!
    expect(startBtn.attributes('disabled')).toBeUndefined()
  })

  it("emits 'placeBet' on Generate Program click", async () => {
    const wrapper = mountHeader()
    const genBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('Generate Program'))!
    await genBtn.trigger('click')
    expect(wrapper.emitted('placeBet')).toHaveLength(1)
  })

  it("emits 'startRace' on Start/Pause click", async () => {
    const raceStore = useRaceStore()
    raceStore.generateProgram()

    const wrapper = mountHeader()
    const startBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('Start'))!
    await startBtn.trigger('click')
    expect(wrapper.emitted('startRace')).toHaveLength(1)
  })
})
