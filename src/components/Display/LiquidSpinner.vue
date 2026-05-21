<template>
  <span class="lq-spinner" :style="rootStyle">
    <svg viewBox="0 0 24 24" :width="size" :height="size">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.4" fill="none" opacity="0.18" />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        stroke-width="2.4"
        fill="none"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
  color: '',
})

const dim = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const rootStyle = computed(() => ({
  color: props.color || 'currentColor',
  width: dim.value,
  height: dim.value,
}))
</script>
