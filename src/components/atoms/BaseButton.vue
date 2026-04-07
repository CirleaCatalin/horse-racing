<script setup lang="ts">
// inheritAttrs: false so we control where native attrs land (on <button>)
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    v-bind="$attrs"
    class="btn font-ui inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[5px] font-bold tracking-[0.4px] whitespace-nowrap transition-[filter,background,border-color,box-shadow] duration-[0.12s] ease-[ease] select-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      {
        'h-8 px-3.5 text-xs': size === 'sm',
        'h-10 px-[22px] text-[13px]': size === 'md',
        'h-12 px-7 text-[15px]': size === 'lg',
        'btn-gradient-primary text-bg border-none shadow-[0_2px_12px_var(--color-accent-border)]':
          variant === 'primary',
        'bg-accent-glass border-accent-strong text-accent border-[1.5px]':
          variant === 'ghost',
      },
    ]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn--ghost:not(:disabled):hover {
  background: var(--color-accent-tint);
  border-color: var(--color-accent);
}
</style>
