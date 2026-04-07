import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Tracks the rendered dimensions of a DOM element via ResizeObserver.
 * Pass the same template ref you bind with `ref="..."` in your template.
 *
 * @example
 * const containerRef = useTemplateRef('container')
 * const { width, height } = useContainerSize(containerRef)
 */
export function useContainerSize(el: Ref<HTMLElement | null>) {
  const width = ref(0)
  const height = ref(0)

  let ro: ResizeObserver

  onMounted(() => {
    ro = new ResizeObserver(([entry]) => {
      width.value = entry.contentRect.width
      height.value = entry.contentRect.height
    })
    if (el.value) ro.observe(el.value)
  })

  onUnmounted(() => ro?.disconnect())

  return { width, height }
}
