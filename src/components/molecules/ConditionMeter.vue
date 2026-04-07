<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CONDITION_COLOR, conditionFromValue } from '../../data/horses'

const props = defineProps<{ value: number }>()

const barWidth = ref(0)
onMounted(() => {
  requestAnimationFrame(() => {
    barWidth.value = props.value
  })
})

const color = CONDITION_COLOR[conditionFromValue(props.value)]
</script>

<template>
  <div class="meter flex flex-col gap-2">
    <div class="meter-header flex items-baseline justify-between">
      <span
        class="meter-label font-ui text-text-quiet text-[10px] font-bold tracking-[1px] uppercase"
        >Condition</span
      >
      <span
        class="meter-value font-mono text-[22px] leading-none font-black transition-colors duration-[0.25s] ease-[ease]"
        :style="{ color }"
      >
        {{ value
        }}<span class="meter-max text-text-soft ml-0.5 text-xs font-semibold"
          >/100</span
        >
      </span>
    </div>

    <div class="meter-track bg-text-ghost h-2.5 overflow-hidden rounded-md">
      <div
        class="meter-fill h-full rounded-md transition-[width] duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)]"
        :style="{
          width: `${barWidth}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 8px ${color}66`,
        }"
      />
    </div>

    <div
      class="meter-ticks text-text-faint flex justify-between font-mono text-[9px]"
    >
      <span>0</span>
      <span>25</span>
      <span>50</span>
      <span>75</span>
      <span>100</span>
    </div>
  </div>
</template>
