<template>
  <div
    :class="[
      'lq-card',
      `lq-card--${variant}`,
      `lq-card--p-${padding}`,
      `lq-card--r-${rounded}`,
      { 'is-elevated': elevated },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
export type CardVariant = 'glass' | 'strong' | 'tinted' | 'solid'

interface Props {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'lg' | 'xl'
  elevated?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'glass',
  padding: 'md',
  rounded: 'lg',
  elevated: true,
})
</script>
