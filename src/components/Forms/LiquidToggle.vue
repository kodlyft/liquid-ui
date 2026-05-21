<template>
  <button
    :class="[
      'lq-toggle',
      `lq-toggle--${size}`,
      `lq-toggle--${color}`,
      { 'is-on': modelValue, 'is-disabled': disabled },
    ]"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="lq-toggle__track" />
    <span class="lq-toggle__thumb" />
  </button>
</template>

<script setup lang="ts">
export type ToggleColor = 'green' | 'accent' | 'orange' | 'red' | 'purple'
export type ToggleSize = 'sm' | 'md'

interface Props {
  modelValue?: boolean
  color?: ToggleColor
  size?: ToggleSize
  disabled?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  color: 'green',
  size: 'md',
  disabled: false,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

function toggle() {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>
