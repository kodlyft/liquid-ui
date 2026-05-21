<template>
  <label class="lq-search">
    <span class="lq-search__icon" v-html="iconSvg('search', 16)" />
    <input
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="$emit('submit', modelValue)"
    />
    <button v-if="showMic" class="lq-search__mic" aria-label="Voice search" @click.prevent>
      <span v-html="iconSvg('mic', 16)" />
    </button>
  </label>
</template>

<script setup lang="ts">
import { iconSvg } from '../../icons'

interface Props {
  modelValue?: string
  placeholder?: string
  showMic?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search',
  showMic: true,
})

defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'submit', v: string): void
}>()
</script>
