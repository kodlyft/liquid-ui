<template>
  <span
    :class="[
      'lq-badge',
      `lq-badge--${variant}`,
      `lq-badge--${size}`,
      { 'has-icon': !!icon, 'is-dot': dot },
    ]"
  >
    <span v-if="dot" class="lq-badge__dot" />
    <span v-if="icon" class="lq-badge__icon" v-html="iconSvg(icon, size === 'sm' ? 10 : 12)" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { iconSvg, type IconName } from '../../icons'

export type BadgeVariant = 'glass' | 'accent' | 'success' | 'warning' | 'danger'

interface Props {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  icon?: IconName | ''
  dot?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'glass',
  size: 'md',
  icon: '',
  dot: false,
})
</script>
