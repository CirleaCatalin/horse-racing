import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('useSpriteLoader', () => {
  let onloadCb: (() => void) | null = null
  let completeProp = false

  beforeEach(() => {
    onloadCb = null
    completeProp = false
    vi.resetModules()

    vi.stubGlobal(
      'Image',
      class {
        src = ''
        set onload(fn: () => void) {
          onloadCb = fn
        }
        get complete() {
          return completeProp
        }
      },
    )
  })

  it('starts with loaded=false before image loads', async () => {
    const { useSpriteLoader } = await import('../useSpriteLoader')
    const { loaded } = useSpriteLoader()
    expect(loaded.value).toBe(false)
  })

  it('sets loaded=true when onload fires', async () => {
    const { useSpriteLoader } = await import('../useSpriteLoader')
    const { loaded } = useSpriteLoader()

    expect(loaded.value).toBe(false)
    onloadCb?.()
    expect(loaded.value).toBe(true)
  })

  it('sets loaded=true immediately when image is already cached', async () => {
    completeProp = true
    const { useSpriteLoader } = await import('../useSpriteLoader')
    const { loaded } = useSpriteLoader()
    expect(loaded.value).toBe(true)
  })
})
