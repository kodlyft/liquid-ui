<template>
  <label
    :class="[
      'lq-check',
      `lq-check--${size}`,
      { 'is-checked': modelValue, 'is-indeterminate': indeterminate, 'is-disabled': disabled },
      { 'lq-check--stacked': hasDescription },
    ]"
  >
    <input
      ref="input"
      class="lq-check__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :name="name"
      :value="value"
      :aria-label="label || undefined"
      @change="onChange"
    />
    <span class="lq-check__box" aria-hidden="true">
      <span class="lq-check__mark" v-html="markSvg" />
    </span>
    <span v-if="hasText" class="lq-check__text">
      <span class="lq-check__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hasDescription" class="lq-check__hint">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue'
import { iconSvg } from '../../icons'

export type CheckSize = 'sm' | 'md'

interface Props {
  modelValue?: boolean
  label?: string
  description?: string
  disabled?: boolean
  indeterminate?: boolean
  size?: CheckSize
  name?: string
  value?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  description: '',
  disabled: false,
  indeterminate: false,
  size: 'md',
  name: undefined,
  value: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const slots = useSlots()

const input = ref<HTMLInputElement | null>(null)

const hasDescription = computed(() => !!props.description || !!slots.description)
const hasText = computed(() => !!props.label || !!slots.default || hasDescription.value)

const markSvg = computed(() => iconSvg(props.indeterminate ? 'minus' : 'check', 24))

function syncIndeterminate() {
  if (input.value) input.value.indeterminate = props.indeterminate
}

onMounted(syncIndeterminate)
watch(() => props.indeterminate, syncIndeterminate)

function onChange(event: Event) {
  const next = (event.target as HTMLInputElement).checked
  emit('update:modelValue', next)
  emit('change', next)
}
</script>
