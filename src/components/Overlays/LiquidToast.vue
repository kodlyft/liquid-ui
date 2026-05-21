<template>
  <Transition name="lq-toast">
    <div
      v-if="modelValue"
      :class="['lq-toast', `lq-toast--${variant}`, 'lq-specular']"
      role="status"
    >
      <span v-if="icon" class="lq-toast__icon" v-html="iconSvg(icon, 18)" />
      <div class="lq-toast__body">
        <div v-if="title" class="lq-toast__title">{{ title }}</div>
        <div v-if="description" class="lq-toast__desc">{{ description }}</div>
      </div>
      <button v-if="closable" class="lq-toast__close" aria-label="Dismiss" @click="dismiss">
        <span v-html="iconSvg('close', 14)" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { iconSvg, type IconName } from '../../icons'

export type ToastVariant = 'glass' | 'success' | 'warning' | 'danger'

interface Props {
  modelValue?: boolean
  title?: string
  description?: string
  icon?: IconName | ''
  variant?: ToastVariant
  closable?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: true,
  title: '',
  description: '',
  icon: '',
  variant: 'glass',
  closable: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'dismiss'): void
}>()

function dismiss() {
  emit('update:modelValue', false)
  emit('dismiss')
}
</script>
