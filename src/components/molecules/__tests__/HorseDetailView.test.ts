import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseDetailView from '../HorseDetailView.vue'

import type { Horse } from '../../../types/horse'

const horse: Horse = {
  id: 3,
  name: 'Silver Arrow',
  condition: 'Good',
  conditionValue: 65,
  horseIndex: 2,
}

describe('HorseDetailView', () => {
  it('renders horse name, id, condition badge', () => {
    const wrapper = mount(HorseDetailView, { props: { horse } })
    expect(wrapper.find('.horse-name').text()).toBe('Silver Arrow')
    expect(wrapper.find('.horse-id').text()).toBe('#3')
    expect(wrapper.find('.horse-badge').text()).toBe('Good')
  })

  it('applies condition color to badge', () => {
    const wrapper = mount(HorseDetailView, { props: { horse } })
    const style = wrapper.find('.horse-badge').attributes('style')!
    // jsdom converts hex to rgb — #7ed957 → rgb(126, 217, 87)
    expect(style).toContain('rgb(126, 217, 87)')
  })

  it("emits 'back' when back button clicked", async () => {
    const wrapper = mount(HorseDetailView, { props: { horse } })
    await wrapper.find('.back-btn').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it("renders ConditionMeter with horse's conditionValue", () => {
    const wrapper = mount(HorseDetailView, { props: { horse } })
    expect(wrapper.find('.meter-value').text()).toContain('65')
  })
})
