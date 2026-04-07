import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConditionMeter from '../ConditionMeter.vue'

describe('ConditionMeter', () => {
  it('displays value and /100 max', () => {
    const wrapper = mount(ConditionMeter, { props: { value: 75 } })
    expect(wrapper.find('.meter-value').text()).toContain('75')
    expect(wrapper.find('.meter-max').text()).toBe('/100')
  })

  it('applies correct condition color based on value', () => {
    const value = 85
    const wrapper = mount(ConditionMeter, { props: { value } })
    const style = wrapper.find('.meter-value').attributes('style')!
    // jsdom converts hex to rgb — #34B670 → rgb(52, 182, 112)
    expect(style).toContain('color:')
    expect(style).toContain('rgb(52, 182, 112)')
  })

  it('renders all 5 tick marks (0, 25, 50, 75, 100)', () => {
    const wrapper = mount(ConditionMeter, { props: { value: 50 } })
    const ticks = wrapper.findAll('.meter-ticks span')
    expect(ticks).toHaveLength(5)
    expect(ticks.map((t) => t.text())).toEqual(['0', '25', '50', '75', '100'])
  })
})
