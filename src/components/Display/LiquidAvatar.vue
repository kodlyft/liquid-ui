<template>
  <span :class="['lq-avatar', `lq-avatar--${shape}`]" :style="rootStyle">
    <img v-if="src" :src="src" :alt="initials" class="lq-avatar__img" />
    <span v-else class="lq-avatar__initials" :style="{ background: bg }">
      {{ initials || '?' }}
    </span>
    <span v-if="status" :class="['lq-avatar__status', `lq-avatar__status--${status}`]" />
    <span v-if="hasBadge" class="lq-avatar__badge">{{ badge }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type AvatarStatus = '' | 'online' | 'away' | 'busy' | 'offline'

interface Props {
  src?: string
  initials?: string
  size?: number | string
  color?: string
  status?: AvatarStatus
  badge?: number | string
  shape?: 'circle' | 'rounded'
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  initials: '',
  size: 40,
  color: '',
  status: '',
  badge: '',
  shape: 'circle',
})

const dim = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const rootStyle = computed(() => ({
  width: dim.value,
  height: dim.value,
  fontSize: `calc(${dim.value} * 0.4)`,
}))

const palette = ['#ff6b9d', '#5e8cff', '#30d158', '#ff9f0a', '#bf5af2', '#40c8e0']
const bg = computed(() => {
  if (props.color) return props.color
  const i = (props.initials.charCodeAt(0) || 65) % palette.length
  return `linear-gradient(135deg, ${palette[i]} 0%, ${palette[(i + 2) % palette.length]} 100%)`
})

const hasBadge = computed(() => props.badge !== '' && props.badge !== 0 && props.badge !== null)
</script>
