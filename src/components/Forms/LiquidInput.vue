<template>
  <label
    :class="['lq-input', `lq-input--${size}`, { 'is-disabled': disabled, 'has-icon': !!icon }]"
  >
    <span v-if="icon" class="lq-input__icon" v-html="iconSvg(icon, iconSize)" />
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="$emit('submit', modelValue)"
    />
    <button
      v-if="clearable && modelValue"
      class="lq-input__clear"
      aria-label="Clear"
      @click.prevent="$emit('update:modelValue', '')"
    >
      <span v-html="iconSvg('close', 12)" />
    </button>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconSvg, type IconName } from '../../icons'

interface Props {
  modelValue?: string
  placeholder?: string
  type?: string
  icon?: IconName | ''
  clearable?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  icon: '',
  clearable: false,
  disabled: false,
  size: 'md',
})

defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'submit', v: string): void
}>()

const iconSize = computed(() => (props.size === 'sm' ? 14 : 16))
</script>
