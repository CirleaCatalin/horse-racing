import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useContainerSize } from '../useContainerSize'

let observeMock: ReturnType<typeof vi.fn>
let disconnectMock: ReturnType<typeof vi.fn>
let resizeCallback: (
  entries: Array<{ contentRect: { width: number; height: number } }>,
) => void

beforeEach(() => {
  observeMock = vi.fn()
  disconnectMock = vi.fn()

  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: typeof resizeCallback) {
        resizeCallback = cb
      }
      observe = observeMock
      disconnect = disconnectMock
      unobserve = vi.fn()
    },
  )
})

function createWrapper(elValue: HTMLElement | null) {
  return mount(
    defineComponent({
      setup() {
        const el = ref(elValue)
        const { width, height } = useContainerSize(el)
        return { width, height }
      },
      template: '<div />',
    }),
  )
}

describe('useContainerSize', () => {
  it('initializes width and height to 0', () => {
    const wrapper = createWrapper(document.createElement('div'))
    expect(wrapper.vm.width).toBe(0)
    expect(wrapper.vm.height).toBe(0)
  })

  it('updates dimensions when ResizeObserver fires', () => {
    const wrapper = createWrapper(document.createElement('div'))
    resizeCallback([{ contentRect: { width: 400, height: 300 } }])
    expect(wrapper.vm.width).toBe(400)
    expect(wrapper.vm.height).toBe(300)
  })

  it('does not observe when element ref is null', () => {
    createWrapper(null)
    expect(observeMock).not.toHaveBeenCalled()
  })

  it('disconnects observer on unmount', () => {
    const wrapper = createWrapper(document.createElement('div'))
    wrapper.unmount()
    expect(disconnectMock).toHaveBeenCalled()
  })
})
