import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { SPRITE_ASPECT, SPRITE_ROWS } from '../../../utils/sprite'

vi.mock('../../../composables/useSpriteLoader', () => ({
  useSpriteLoader: () => ({ loaded: ref(true) }),
}))

// Import after mock so the module picks up the stub
const { default: HorseSprite } = await import('../HorseSprite.vue')

describe('HorseSprite', () => {
  it('computes width from height * SPRITE_ASPECT', () => {
    const wrapper = mount(HorseSprite, { props: { horseIndex: 0, height: 50 } })
    const style = wrapper.find('.horse').attributes('style')!
    const expectedWidth = 50 * SPRITE_ASPECT
    expect(style).toContain(`width: ${expectedWidth}px`)
  })

  it('sets correct backgroundPositionY for horseIndex', () => {
    const index = 5
    const wrapper = mount(HorseSprite, {
      props: { horseIndex: index, height: 50 },
    })
    const style = wrapper.find('.horse').attributes('style')!
    const expectedY = (index / (SPRITE_ROWS - 1)) * 100
    expect(style).toContain(`background-position-y: ${expectedY}%`)
  })

  it('applies animation duration/delay when not finished', () => {
    const wrapper = mount(HorseSprite, { props: { horseIndex: 0, height: 50 } })
    const style = wrapper.find('.horse').attributes('style')!
    expect(style).toContain('animation-duration: 0.55s')
    expect(style).toContain('animation-delay: 0s')
  })

  it('freezes animation when finished=true', () => {
    const wrapper = mount(HorseSprite, {
      props: { horseIndex: 0, height: 50, finished: true },
    })
    const style = wrapper.find('.horse').attributes('style')!
    expect(style).toContain('animation: none')
    expect(style).toContain('background-position-x: 0%')
  })
})
