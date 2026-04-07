import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { SPRITE_ASPECT, SPRITE_ROWS } from '../../../utils/sprite'

vi.mock('../../../composables/useSpriteLoader', () => ({
  useSpriteLoader: () => ({ loaded: ref(true) }),
}))

const { default: HorsePreview } = await import('../HorsePreview.vue')

describe('HorsePreview', () => {
  it('uses default width of 60 when not provided', () => {
    const wrapper = mount(HorsePreview, { props: { horseIndex: 0 } })
    const style = wrapper.find('div').attributes('style')!
    expect(style).toContain('width: 60px')
  })

  it('respects custom width prop', () => {
    const wrapper = mount(HorsePreview, {
      props: { horseIndex: 0, width: 120 },
    })
    const style = wrapper.find('div').attributes('style')!
    expect(style).toContain('width: 120px')
  })

  it('computes height from width / SPRITE_ASPECT', () => {
    const width = 80
    const wrapper = mount(HorsePreview, { props: { horseIndex: 0, width } })
    const style = wrapper.find('div').attributes('style')!
    const expectedHeight = width / SPRITE_ASPECT
    expect(style).toContain(`height: ${expectedHeight}px`)
  })

  it('sets correct backgroundPositionY for horseIndex', () => {
    const index = 10
    const wrapper = mount(HorsePreview, { props: { horseIndex: index } })
    const style = wrapper.find('div').attributes('style')!
    const expectedY = (index / (SPRITE_ROWS - 1)) * 100
    expect(style).toContain(`background-position-y: ${expectedY}%`)
  })
})
