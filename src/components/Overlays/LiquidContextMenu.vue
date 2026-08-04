<template>
  <div ref="root" class="lq-menu lq-glass-strong lq-specular" role="menu" @keydown="onKeydown">
    <template v-for="(item, i) in items" :key="i">
      <div v-if="item.divider" class="lq-menu__divider" role="separator" />

      <div v-else-if="item.heading" class="lq-menu__heading">{{ item.label }}</div>

      <div
        v-else-if="item.children && item.children.length"
        class="lq-menu__group"
        @mouseenter="openSubmenu(i, $event)"
        @mouseleave="scheduleClose(i)"
      >
        <button
          :class="['lq-menu__item', { 'is-disabled': item.disabled, 'is-open': submenu === i }]"
          :disabled="item.disabled"
          role="menuitem"
          aria-haspopup="menu"
          :aria-expanded="submenu === i"
          @click.stop="submenu === i ? closeSubmenu() : openSubmenu(i, $event)"
          @keydown.right.prevent="openSubmenu(i, $event)"
          @keydown.left.prevent="closeSubmenu()"
        >
          <span class="lq-menu__label">{{ item.label }}</span>
          <span class="lq-menu__chevron" aria-hidden="true">›</span>
        </button>

        <Teleport to="body">
          <div
            v-if="submenu === i"
            ref="panel"
            class="lq-menu__submenu"
            :style="submenuStyle"
            @mouseenter="cancelClose"
            @mouseleave="scheduleClose(i)"
          >
            <LiquidContextMenu :items="item.children" @select="$emit('select', $event)" />
          </div>
        </Teleport>
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
import { nextTick, onBeforeUnmount, ref } from 'vue'
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
const panel = ref<HTMLElement | HTMLElement[] | null>(null)
const submenu = ref<number | null>(null)
const submenuStyle = ref<Record<string, string>>({ visibility: 'hidden' })

const MARGIN = 8
const GAP = 4
const RISE = 6
const CLOSE_DELAY_MS = 140

let anchor: HTMLElement | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

function cancelClose() {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = null
}

function closeSubmenu() {
  cancelClose()
  submenu.value = null
  anchor = null
  submenuStyle.value = { visibility: 'hidden' }
}

function scheduleClose(index: number) {
  cancelClose()
  closeTimer = setTimeout(() => {
    if (submenu.value === index) closeSubmenu()
  }, CLOSE_DELAY_MS)
}

async function openSubmenu(index: number, event: Event) {
  cancelClose()

  const target = event.currentTarget as HTMLElement | null
  anchor = target?.closest<HTMLElement>('.lq-menu__group') ?? target
  submenu.value = index
  submenuStyle.value = { visibility: 'hidden' }

  await nextTick()
  place()
}

function place() {
  const raw = panel.value
  const element = Array.isArray(raw) ? raw[0] : raw
  if (!element || !anchor) return

  const row = anchor.getBoundingClientRect()
  const box = element.getBoundingClientRect()

  const flips = row.right + GAP + box.width > window.innerWidth - MARGIN
  const left = flips ? Math.max(MARGIN, row.left - GAP - box.width) : row.right + GAP

  let top = row.top - RISE
  if (top + box.height > window.innerHeight - MARGIN) {
    top = Math.max(MARGIN, window.innerHeight - MARGIN - box.height)
  }

  submenuStyle.value = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    visibility: 'visible',
  }
}

onBeforeUnmount(cancelClose)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (submenu.value !== null) {
      closeSubmenu()
      return
    }
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
