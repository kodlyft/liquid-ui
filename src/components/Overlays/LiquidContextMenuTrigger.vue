<template>
  <div class="lq-menu-trigger" @contextmenu="onContextMenu">
    <slot />

    <Teleport to="body">
      <div
        v-if="open"
        ref="layer"
        class="lq-menu-layer"
        :style="{ left: `${position.x}px`, top: `${position.y}px` }"
        @contextmenu.prevent.stop
      >
        <LiquidContextMenu :items="items" @select="onSelect" @close="close" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import LiquidContextMenu from './LiquidContextMenu.vue'
import type { MenuItem } from '../../types/menu'

interface Props {
  items: MenuItem[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const emit = defineEmits<{
  (e: 'select', item: MenuItem): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const open = ref(false)
const layer = ref<HTMLElement | null>(null)
const position = reactive({ x: 0, y: 0 })

const MARGIN = 8

function onContextMenu(event: MouseEvent) {
  if (props.disabled) return

  event.preventDefault()
  event.stopPropagation()
  openAt(event.clientX, event.clientY)
}

function openAt(x: number, y: number) {
  position.x = x
  position.y = y
  open.value = true
  emit('open')
  void nextTick(clampIntoView)
}

function clampIntoView() {
  const element = layer.value
  if (!element) return

  const rect = element.getBoundingClientRect()

  if (rect.right > window.innerWidth - MARGIN) {
    position.x = Math.max(MARGIN, window.innerWidth - rect.width - MARGIN)
  }
  if (rect.bottom > window.innerHeight - MARGIN) {
    position.y = Math.max(MARGIN, window.innerHeight - rect.height - MARGIN)
  }
}

function close() {
  if (!open.value) return
  open.value = false
  emit('close')
}

function onSelect(item: MenuItem) {
  emit('select', item)
  close()
}

function onPointerDown(event: PointerEvent) {
  if (layer.value?.contains(event.target as Node)) return
  if ((event.target as HTMLElement | null)?.closest?.('.lq-menu')) return
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(open, (isOpen) => {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  document[method]('pointerdown', onPointerDown as EventListener, true)
  document[method]('keydown', onKeydown as EventListener, true)
  window[method]('blur', close)
  window[method]('scroll', close, true)
  window[method]('resize', close)
})

onBeforeUnmount(() => {
  if (open.value) close()
})

defineExpose({ open: openAt, close })
</script>
