<template>
  <div ref="root" class="lq-menu lq-glass-strong lq-specular" role="menu" @keydown="onKeydown">
    <template v-for="(item, i) in items" :key="i">
      <div v-if="item.divider" class="lq-menu__divider" role="separator" />

      <div v-else-if="item.heading" class="lq-menu__heading">{{ item.label }}</div>

      <div
        v-else-if="item.children && item.children.length"
        class="lq-menu__group"
        @mouseenter="submenu = i"
        @mouseleave="submenu = submenu === i ? null : submenu"
      >
        <button
          :class="['lq-menu__item', { 'is-disabled': item.disabled, 'is-open': submenu === i }]"
          :disabled="item.disabled"
          role="menuitem"
          aria-haspopup="menu"
          :aria-expanded="submenu === i"
          @click.stop="submenu = submenu === i ? null : i"
          @keydown.right.prevent="submenu = i"
          @keydown.left.prevent="submenu = null"
        >
          <span class="lq-menu__label">{{ item.label }}</span>
          <span class="lq-menu__chevron" aria-hidden="true">›</span>
        </button>

        <div v-if="submenu === i" ref="submenuEl" class="lq-menu__submenu" :style="submenuStyle">
          <LiquidContextMenu :items="item.children" @select="$emit('select', $event)" />
        </div>
      </div>

      <button
        v-else
        :class="['lq-menu__item', { 'is-danger': item.danger, 'is-disabled': item.disabled }]"
        :disabled="item.disabled"
        role="menuitem"
        @click="$emit('select', item)"
      >
        <span class="lq-menu__label">{{ item.label }}</span>
        <span v-if="item.shortcut" class="lq-menu__shortcut">{{ item.shortcut }}</span>
        <span v-if="item.icon" class="lq-menu__icon" v-html="iconSvg(item.icon, 16)" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { iconSvg } from '../../icons'
import type { MenuItem } from '../../types/menu'

export type { MenuItem }

interface Props {
  items: MenuItem[]
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'select', item: MenuItem): void
  (e: 'close'): void
}>()

const root = ref<HTMLElement | null>(null)
const submenu = ref<number | null>(null)
const submenuEl = ref<HTMLElement | HTMLElement[] | null>(null)
const submenuStyle = ref<Record<string, string>>({})

const MARGIN = 8

watch(submenu, async (index) => {
  submenuStyle.value = {}
  if (index === null) return

  await nextTick()
  const raw = submenuEl.value
  const element = Array.isArray(raw) ? raw[0] : raw
  if (!element) return

  const rect = element.getBoundingClientRect()
  const style: Record<string, string> = {}

  if (rect.bottom > window.innerHeight - MARGIN) {
    style.top = 'auto'
    style.bottom = '-6px'
  }
  if (rect.right > window.innerWidth - MARGIN) {
    style.left = 'auto'
    style.right = '100%'
    style.paddingLeft = '0'
    style.paddingRight = '4px'
  }

  submenuStyle.value = style
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

  const buttons = Array.from(
    root.value?.querySelectorAll<HTMLButtonElement>('.lq-menu__item:not(:disabled)') ?? [],
  )
  if (!buttons.length) return

  event.preventDefault()
  const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
  const step = event.key === 'ArrowDown' ? 1 : -1
  const next = (current + step + buttons.length) % buttons.length
  buttons[next]?.focus()
}
</script>
