<template>
  <button
    :class="[
      'lq-btn',
      `lq-btn--${variant}`,
      `lq-btn--${size}`,
      `lq-btn--r-${rounded}`,
      'lq-press',
      { 'is-block': block, 'is-loading': loading, 'is-disabled': disabled },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="lq-btn__spinner" aria-hidden="true" />
    <span v-else-if="icon" class="lq-btn__icon" v-html="iconSvg(icon, iconSize)" />
    <span class="lq-btn__label">
      <slot />
    </span>
    <span v-if="iconRight" class="lq-btn__icon" v-html="iconSvg(iconRight, iconSize)" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconSvg, type IconName } from '../../icons'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'tinted' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonRadius = 'pill' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  rounded?: ButtonRadius
  icon?: IconName | ''
  iconRight?: IconName | ''
  block?: boolean
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: 'pill',
  icon: '',
  iconRight: '',
  block: false,
  disabled: false,
  loading: false,
})

defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const iconSize = computed(() => (props.size === 'sm' ? 14 : props.size === 'lg' ? 20 : 16))
</script>
