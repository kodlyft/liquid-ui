<template>
  <div class="lq-stepper lq-glass">
    <button
      class="lq-stepper__btn lq-press"
      :disabled="modelValue <= min"
      aria-label="Decrease"
      @click="bump(-1)"
    >
      <span v-html="iconSvg('minus', 18)" />
    </button>
    <span class="lq-stepper__divider" />
    <button
      class="lq-stepper__btn lq-press"
      :disabled="modelValue >= max"
      aria-label="Increase"
      @click="bump(1)"
    >
      <span v-html="iconSvg('plus', 18)" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { iconSvg } from '../../icons'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 1,
})

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

function bump(dir: number) {
  const next = props.modelValue + dir * props.step
  emit('update:modelValue', Math.max(props.min, Math.min(props.max, next)))
}
</script>
