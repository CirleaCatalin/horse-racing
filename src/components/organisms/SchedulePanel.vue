<script setup lang="ts">
import { ref } from 'vue'
import ProgrammeTab from '../molecules/ProgrammeTab.vue'
import ResultsTab from '../molecules/ResultsTab.vue'
import NewsletterCard from '../molecules/NewsletterCard.vue'
import PanelTrademark from '../atoms/PanelTrademark.vue'
import { useExpandedSet } from '../../composables/useExpandedSet'

type Tab = 'programme' | 'results'

const activeTab = ref<Tab>('programme')
const { expanded, toggle } = useExpandedSet()
</script>

<template>
  <aside
    class="panel w-panel-w border-accent-tint bg-accent-subtle flex shrink-0 flex-col overflow-hidden rounded-md border"
  >
    <!-- ── Tab bar ── -->
    <div class="tabs border-accent-tint flex shrink-0 border-b">
      <button
        class="tab font-ui text-text-muted hover:text-text-secondary -mb-px flex-1 cursor-pointer border-x-0 border-t-0 border-b-2 border-b-transparent bg-none text-[11px] font-bold tracking-[0.6px] uppercase transition-[color,border-color] duration-[0.12s] ease-[ease]"
        data-testid="tab-programme"
        :class="{
          'active !border-b-accent !text-accent': activeTab === 'programme',
        }"
        :style="{ height: '38px' }"
        @click="activeTab = 'programme'"
      >
        Programme
      </button>
      <button
        class="tab font-ui text-text-muted hover:text-text-secondary -mb-px flex-1 cursor-pointer border-x-0 border-t-0 border-b-2 border-b-transparent bg-none text-[11px] font-bold tracking-[0.6px] uppercase transition-[color,border-color] duration-[0.12s] ease-[ease]"
        data-testid="tab-results"
        :class="{
          'active !border-b-accent !text-accent': activeTab === 'results',
        }"
        :style="{ height: '38px' }"
        @click="activeTab = 'results'"
      >
        Results
      </button>
    </div>

    <!-- ── Tab content ── -->
    <div class="content custom-scrollbar flex-1 overflow-y-auto">
      <Transition name="fade" mode="out-in">
        <ProgrammeTab
          v-if="activeTab === 'programme'"
          key="programme"
          :expanded="expanded"
          @toggle="toggle"
        />
        <ResultsTab
          v-else
          key="results"
          :expanded="expanded"
          @toggle="toggle"
        />
      </Transition>
    </div>

    <!-- ── Footer ── -->
    <NewsletterCard />
    <PanelTrademark />
  </aside>
</template>
