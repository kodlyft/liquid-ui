<template>
  <div :class="['lq-seg', `lq-seg--${size}`, `lq-seg--${variant}`]">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      :class="['lq-seg__opt', { 'is-active': opt.value === modelValue }]"
      @click="$emit('update:modelValue', opt.value)"
    >
      <span v-if="opt.icon" class="lq-seg__icon" v-html="iconSvg(opt.icon, iconSize)" />
      <span v-if="opt.label" class="lq-seg__label">{{ opt.label }}</span>
    </button>
    <span class="lq-seg__indicator" :style="indicatorStyle" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue'
import { iconSvg, type IconName } from '../../icons'

export interface SegmentedOption<V> {
  value: V
  label?: string
  icon?: IconName
}

const props = withDefaults(
  defineProps<{
    modelValue: T
    options: SegmentedOption<T>[]
    size?: 'sm' | 'md'
    variant?: 'glass' | 'inline'
  }>(),
  {
    size: 'md',
    variant: 'glass',
  },
)

defineEmits<{ (e: 'update:modelValue', value: T): void }>()

const activeIdx = computed(() =>
  Math.max(
    0,
    props.options.findIndex((o) => o.value === props.modelValue),
  ),
)

const indicatorStyle = computed(() => ({
  width: `calc((100% - 8px) / ${props.options.length})`,
  transform: `translateX(calc(${activeIdx.value} * 100%))`,
}))

const iconSize = computed(() => (props.size === 'sm' ? 14 : 16))
</script>
