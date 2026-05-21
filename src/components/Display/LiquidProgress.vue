<template>
  <div class="lq-progress-wrap">
    <div v-if="label" class="lq-progress-label">{{ label }}</div>
    <div
      :class="[
        'lq-progress',
        `lq-progress--${color}`,
        `lq-progress--${size}`,
        { 'is-indeterminate': indeterminate },
      ]"
    >
      <div v-if="!indeterminate" class="lq-progress__fill" :style="{ width: clamped + '%' }" />
      <div v-else class="lq-progress__indet" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ProgressColor = 'accent' | 'success' | 'warning' | 'white'

interface Props {
  value?: number
  color?: ProgressColor
  size?: 'sm' | 'md'
  indeterminate?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  color: 'accent',
  size: 'md',
  indeterminate: false,
  label: '',
})

const clamped = computed(() => Math.max(0, Math.min(100, props.value)))
</script>
