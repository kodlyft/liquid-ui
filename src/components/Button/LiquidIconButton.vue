<template>
  <button
    :class="[
      'lq-iconbtn',
      `lq-iconbtn--${variant}`,
      `lq-iconbtn--${size}`,
      'lq-press',
      { 'is-disabled': disabled },
    ]"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="lq-iconbtn__inner" v-html="iconSvg(icon, iconSize)" />
    <span v-if="hasBadge" class="lq-iconbtn__badge">{{ badge }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconSvg, type IconName } from '../../icons'

export type IconButtonVariant = 'glass' | 'tinted' | 'destructive' | 'ghost'
export type IconButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  icon: IconName
  variant?: IconButtonVariant
  size?: IconButtonSize
  label?: string
  badge?: string | number | ''
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glass',
  size: 'md',
  label: '',
  badge: '',
  disabled: false,
})

defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const iconSize = computed(() => (props.size === 'sm' ? 14 : props.size === 'lg' ? 22 : 18))
const hasBadge = computed(() => props.badge !== '' && props.badge !== null && props.badge !== 0)
</script>
