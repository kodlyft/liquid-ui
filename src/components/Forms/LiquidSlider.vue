<template>
  <div :class="['lq-slider', `lq-slider--${color}`, { 'is-disabled': disabled }]">
    <span v-if="iconLeft" class="lq-slider__icon" v-html="iconSvg(iconLeft, 16)" />
    <div ref="trackEl" class="lq-slider__track" @pointerdown="onDown">
      <div class="lq-slider__fill" :style="{ width: percent + '%' }" />
      <div class="lq-slider__thumb" :style="{ left: percent + '%' }" />
    </div>
    <span v-if="iconRight" class="lq-slider__icon" v-html="iconSvg(iconRight, 16)" />
    <span v-if="showValue" class="lq-slider__value">{{ modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { iconSvg, type IconName } from '../../icons'

export type SliderColor = 'accent' | 'white' | 'green'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  color?: SliderColor
  iconLeft?: IconName | ''
  iconRight?: IconName | ''
  disabled?: boolean
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 50,
  min: 0,
  max: 100,
  step: 1,
  color: 'accent',
  iconLeft: '',
  iconRight: '',
  disabled: false,
  showValue: false,
})

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const trackEl = ref<HTMLElement | null>(null)
const percent = computed(() => {
  const p = (props.modelValue - props.min) / (props.max - props.min)
  return Math.max(0, Math.min(100, p * 100))
})

function setFromEvent(e: PointerEvent) {
  if (!trackEl.value || props.disabled) return
  const r = trackEl.value.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const raw = props.min + Math.max(0, Math.min(1, x)) * (props.max - props.min)
  const stepped = Math.round(raw / props.step) * props.step
  emit('update:modelValue', Math.max(props.min, Math.min(props.max, stepped)))
}

function onDown(e: PointerEvent) {
  e.preventDefault()
  setFromEvent(e)
  const move = (ev: PointerEvent) => setFromEvent(ev)
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}
</script>
