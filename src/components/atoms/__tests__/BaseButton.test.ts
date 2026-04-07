import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies variant class', () => {
    const ghost = mount(BaseButton, { props: { variant: 'ghost' } })
    expect(ghost.find('button').classes()).toContain('btn--ghost')

    const primary = mount(BaseButton, { props: { variant: 'primary' } })
    expect(primary.find('button').classes()).toContain('btn--primary')
  })

  it('applies size class', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const wrapper = mount(BaseButton, { props: { size } })
      expect(wrapper.find('button').classes()).toContain(`btn--${size}`)
    }
  })

  it('defaults to variant=primary, size=md', () => {
    const wrapper = mount(BaseButton)
    const classes = wrapper.find('button').classes()
    expect(classes).toContain('btn--primary')
    expect(classes).toContain('btn--md')
  })

  it('sets disabled attribute when prop is true', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('sets type attribute (defaults to button)', () => {
    const defaultBtn = mount(BaseButton)
    expect(defaultBtn.find('button').attributes('type')).toBe('button')

    const submitBtn = mount(BaseButton, { props: { type: 'submit' } })
    expect(submitBtn.find('button').attributes('type')).toBe('submit')
  })

  it('forwards $attrs to native button', () => {
    const wrapper = mount(BaseButton, {
      attrs: { 'aria-label': 'test', id: 'btn-1' },
    })
    const btn = wrapper.find('button')
    expect(btn.attributes('aria-label')).toBe('test')
    expect(btn.attributes('id')).toBe('btn-1')
  })
})
