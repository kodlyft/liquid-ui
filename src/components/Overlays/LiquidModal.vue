<template>
  <Transition name="lq-modal">
    <div v-if="modelValue" class="lq-modal-overlay" @click.self="onCancel">
      <div class="lq-modal lq-glass-strong lq-specular" role="dialog">
        <div
          v-if="icon"
          class="lq-modal__icon"
          :style="{ color: iconColor || 'currentColor' }"
          v-html="iconSvg(icon, 28)"
        />
        <h3 v-if="title" class="lq-modal__title">{{ title }}</h3>
        <p v-if="message" class="lq-modal__message">{{ message }}</p>
        <div v-if="$slots.default" class="lq-modal__body">
          <slot />
        </div>
        <div class="lq-modal__actions">
          <button class="lq-modal__btn lq-modal__btn--cancel" @click="onCancel">
            {{ cancelText }}
          </button>
          <div class="lq-modal__btn-sep" />
          <button
            :class="[
              'lq-modal__btn',
              destructive ? 'lq-modal__btn--destructive' : 'lq-modal__btn--confirm',
            ]"
            @click="onConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { iconSvg, type IconName } from '../../icons'

interface Props {
  modelValue?: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  icon?: IconName | ''
  iconColor?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
  destructive: false,
  icon: '',
  iconColor: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>
