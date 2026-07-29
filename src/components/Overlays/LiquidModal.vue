<template>
  <Teleport to="body">
    <Transition name="lq-modal">
      <div v-if="modelValue" class="lq-modal-overlay" @click.self="onDismiss">
        <div
          :class="[
            'lq-modal',
            'lq-glass-strong',
            'lq-specular',
            `lq-modal--${size}`,
            { 'lq-modal--no-actions': !actions },
          ]"
          role="dialog"
          aria-modal="true"
        >
          <div v-if="icon || title || message || $slots.header" class="lq-modal__head">
            <div
              v-if="icon"
              class="lq-modal__icon"
              :style="{ color: iconColor || 'currentColor' }"
              v-html="iconSvg(icon, 28)"
            />
            <h3 v-if="title" class="lq-modal__title">{{ title }}</h3>
            <p v-if="message" class="lq-modal__message">{{ message }}</p>
            <slot name="header" />
          </div>
          <div v-if="$slots.default" class="lq-modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="lq-modal__footer">
            <slot name="footer" />
          </div>
          <div v-if="actions" class="lq-modal__actions">
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
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
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
  actions?: boolean
  dismissible?: boolean
  size?: 'alert' | 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
  destructive: false,
  icon: '',
  iconColor: '',
  actions: true,
  dismissible: true,
  size: 'alert',
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

function onDismiss() {
  if (props.dismissible) onCancel()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue && props.dismissible) onCancel()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>
