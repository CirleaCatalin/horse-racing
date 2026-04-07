import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceCard from '../RaceCard.vue'
import type { Race } from '../../../types/race'

const race: Race = {
  id: 1,
  name: 'Race 1',
  lap: '1st Lap',
  distance: 1200,
  status: 'programmed',
  entries: [
    { horseId: 1, lane: 1, trackProgress: 0 },
    { horseId: 2, lane: 2, trackProgress: 0 },
  ],
}

function mountCard(
  props: Partial<Record<string, unknown>> = {},
  slots?: Record<string, string>,
) {
  return mount(RaceCard, {
    props: { race, isExpanded: false, ...props },
    slots,
  })
}

describe('RaceCard', () => {
  it('renders race name, lap, distance', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.race-name').text()).toBe('Race 1')
    expect(wrapper.find('.race-lap').text()).toBe('1st Lap · 1200m')
  })

  it('shows LIVE badge when isActive=true', () => {
    const wrapper = mountCard({ isActive: true })
    expect(wrapper.find('.live-badge').exists()).toBe(true)
    expect(wrapper.find('.live-badge').text()).toContain('LIVE')
  })

  it('shows DONE badge when showDone=true', () => {
    const wrapper = mountCard({ showDone: true })
    expect(wrapper.find('.done-badge').exists()).toBe(true)
    expect(wrapper.find('.done-badge').text()).toContain('DONE')
  })

  it('shows horse count when neither active nor done', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.horse-count').text()).toBe('2')
  })

  it('shows entry list when isExpanded=true', () => {
    const wrapper = mountCard(
      { isExpanded: true },
      { default: '<li>Entry</li>' },
    )
    expect(wrapper.find('.entry-list').exists()).toBe(true)
  })

  it('hides entry list when isExpanded=false', () => {
    const wrapper = mountCard({ isExpanded: false })
    expect(wrapper.find('.entry-list').exists()).toBe(false)
  })

  it("emits 'toggle' when header clicked", async () => {
    const wrapper = mountCard()
    await wrapper.find('.race-header').trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('applies is-completed class when dimCompleted and race status is completed', () => {
    const completedRace: Race = { ...race, status: 'completed' }
    const wrapper = mount(RaceCard, {
      props: { race: completedRace, isExpanded: false, dimCompleted: true },
    })
    expect(wrapper.find('.race-card').classes()).toContain('is-completed')
  })

  it('rotates chevron when expanded', () => {
    const expanded = mountCard({ isExpanded: true })
    expect(expanded.find('.chevron').classes()).toContain('open')

    const collapsed = mountCard({ isExpanded: false })
    expect(collapsed.find('.chevron').classes()).not.toContain('open')
  })
})
