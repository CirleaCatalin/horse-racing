<script setup lang="ts">
import type { Race } from '../../types/race'

defineProps<{
  race: Race
  isExpanded: boolean
  showDone?: boolean
  isActive?: boolean
  dimCompleted?: boolean // apply faded style when race is completed (Programme tab only)
}>()

defineEmits<{ toggle: [] }>()
</script>

<template>
  <div
    class="race-card border-text-ghost border-b border-l-3 border-l-transparent transition-[border-color,background] duration-[0.12s] ease-[ease] last:border-b-0"
    :class="{
      'is-completed': dimCompleted && race.status === 'completed',
      'is-active': isActive,
    }"
  >
    <button
      class="race-header hover:bg-accent-glass flex w-full cursor-pointer items-center justify-between gap-2 border-none bg-none px-3 py-[18px] text-left transition-[background] duration-[0.12s] ease-[ease]"
      @click="$emit('toggle')"
    >
      <div class="race-meta flex min-w-0 flex-col gap-0.5">
        <span
          class="race-name font-ui text-text-bright text-xs font-extrabold"
          >{{ race.name }}</span
        >
        <span class="race-lap text-text-muted font-mono text-[10px]"
          >{{ race.lap }} · {{ race.distance }}m</span
        >
      </div>
      <div class="race-header-right flex shrink-0 items-center gap-1.5">
        <span
          v-if="isActive"
          class="live-badge border-accent-strong bg-accent-tint font-ui text-accent inline-flex items-center gap-[5px] rounded-sm border px-1.5 py-0.5 text-[9px] font-extrabold tracking-[1px]"
        >
          <span
            class="live-dot bg-accent animate-live-pulse h-[5px] w-[5px] shrink-0 rounded-full shadow-[0_0_5px_var(--color-accent)]"
          />LIVE
        </span>
        <span
          v-else-if="showDone"
          class="done-badge border-accent-muted bg-accent-tint font-ui text-accent rounded-sm border px-[5px] py-0.5 text-[9px] font-bold tracking-[0.8px]"
          >&#10003; DONE</span
        >
        <span
          v-else
          class="horse-count rounded-pill border-accent-muted bg-accent-tint text-accent border px-1.5 py-[1px] font-mono text-[10px] font-bold"
          >{{ race.entries.length }}</span
        >
        <svg
          class="chevron text-text-faint shrink-0 transition-[transform,color] duration-[0.18s] ease-[ease]"
          :class="{ 'open text-accent rotate-180': isExpanded }"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </button>

    <Transition name="expand">
      <ul v-if="isExpanded" class="entry-list list-none ps-0 pb-1.5">
        <slot />
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.race-card.is-completed {
  border-left-color: var(--color-accent-border);
  opacity: 0.6;
}
.race-card.is-completed .race-name {
  color: var(--color-text-muted);
}

.race-card.is-active {
  border-left-color: var(--color-accent);
  background: var(--color-accent-glass);
}
.race-card.is-active .race-name {
  color: var(--color-accent);
}
</style>
