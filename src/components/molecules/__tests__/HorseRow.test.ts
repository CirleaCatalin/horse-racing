import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseRow from '../HorseRow.vue'

import type { Horse } from '../../../types/horse'

const horse: Horse = {
  id: 1,
  name: 'Thunder Bolt',
  condition: 'Excellent',
  conditionValue: 92,
  horseIndex: 0,
}

describe('HorseRow', () => {
  it('renders horse name', () => {
    const wrapper = mount(HorseRow, { props: { horse } })
    expect(wrapper.find('.horse-name').text()).toBe('Thunder Bolt')
  })

  it('renders condition with correct color', () => {
    const wrapper = mount(HorseRow, { props: { horse } })
    const conditionEl = wrapper.find('.horse-condition')
    expect(conditionEl.text()).toContain('Excellent')
    // jsdom converts hex to rgb — #34B670 → rgb(52, 182, 112)
    expect(conditionEl.attributes('style')).toContain('rgb(52, 182, 112)')
  })

  it("emits 'select' on click", async () => {
    const wrapper = mount(HorseRow, { props: { horse } })
    await wrapper.find('.horse-row').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })
})
